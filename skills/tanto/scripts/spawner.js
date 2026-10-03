// No shebang: this file is always invoked as `node <path>`, exactly as
// `reading.js` and `boundary.js` are. It is the one process in a tanto run
// that issues `claude --bg`, `claude stop`, `claude rm`, and
// `claude --resume`, and it runs outside every Claude session, started by
// `tanto.js` and never by a session's own Bash tool.

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const USAGE = "Usage: spawner.js run [--root <dir>] [--once], or spawner.js notify --stdin | --text <line>";

const REQUEST_INTERVAL_MS = 2000;
const CENSUS_INTERVAL_MS = 15000;
const SPAWN_POLL_MS = 1000;
const SPAWN_POLL_TRIES = 30;
const TRANSCRIPT_POLL_MS = 500;
const TRANSCRIPT_POLL_TRIES = 20;
// A seat with no transcript this long after its spawn has run no first turn
// (spec 3.1): twice the longest healthy start the probes saw, eight passes.
const FIRST_TURN_WAIT_MS = 120000;
// A heartbeat older than this is not this spawner's, or is one that stopped
// working (spec 4.1): the longest silence between two beats is one `claude`
// call and one sleep, under two seconds.
const HEARTBEAT_STALE_MS = 60000;

// The ops, in the order `templates/spawn-request.md` documents them.
const OPS = ["spawn", "stop", "rm", "resume", "attention", "ack"];

// The seat statuses `seats.json` carries. They are not the roster's words:
// the roster gains `stopped` alone, and Kanri writes it.
const LIVE = ["running", "blocked"];

// No caller in this file reads `positionals` — unlike `tanto.js`'s own copy
// of this function, which does — so this copy returns `values` alone
// (Minor 14, branch-review.md).
function parseArgs(argv) {
  const values = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      values[arg.slice(2)] = true;
    } else {
      values[arg.slice(2)] = next;
      i++;
    }
  }
  return { values };
}

function spawnerDir(root) {
  return path.join(root, ".tanto", "spawner");
}

function requestsDir(root) {
  return path.join(spawnerDir(root), "requests");
}

function resultsDir(root) {
  return path.join(spawnerDir(root), "results");
}

function ensureDirs(root) {
  fs.mkdirSync(requestsDir(root), { recursive: true });
  fs.mkdirSync(resultsDir(root), { recursive: true });
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

/** Write through a temp file and rename, so a reader never sees half a file. */
function writeJsonAtomic(file, value) {
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temp, file);
}

function readSeats(root) {
  const doc = readJson(path.join(spawnerDir(root), "seats.json"));
  return Array.isArray(doc?.seats) ? doc.seats : [];
}

function writeSeats(root, seats) {
  writeJsonAtomic(path.join(spawnerDir(root), "seats.json"), { seats });
}

function seatOf(seats, sessionId) {
  return seats.find((seat) => seat.sessionId === sessionId) || null;
}

function stamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * `claude agents --json`'s `startedAt` is an epoch-millisecond number; the
 * roster's Started column wants `stamp`'s shape. Formatted once here, where
 * the value first enters a seat, so the seat, the spawn result, and every
 * later reader (`boundary.js record --seat`, the roster template) carry the
 * same shape without reaching back into this file. A value that is not a
 * number — already formatted, or absent — is left alone rather than
 * double-formatted.
 */
function formatStartedAt(value) {
  return typeof value === "number" ? stamp(new Date(value)) : value;
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/**
 * Now, in epoch milliseconds, for a seat's age (spec 3.2): `TANTO_NOW_MS`
 * when set — a test seam, like `TANTO_CLAUDE_NODE` — else the clock.
 */
function nowMs() {
  const fixed = process.env.TANTO_NOW_MS;
  return fixed ? Number(fixed) : Date.now();
}

function heartbeatPath(root) {
  return path.join(spawnerDir(root), "heartbeat");
}

/**
 * The spawner's proof that it is alive and working (spec 4.1): the clock's
 * epoch milliseconds — never `TANTO_NOW_MS`, since the launcher compares it
 * with its own clock — through a temp file and rename. The launcher trusts
 * it over `pid`, which a dead spawner leaves behind and the system may give
 * to another process. Never throws: a beat that cannot be written reads to
 * the launcher as a stale one.
 */
function beat(root) {
  const file = heartbeatPath(root);
  try {
    fs.writeFileSync(`${file}.tmp`, `${Date.now()}\n`);
    fs.renameSync(`${file}.tmp`, file);
  } catch {
    // As `appendLog`'s: not a reason to stop spawning seats.
  }
}

/** Every poll loop's wait: a beat, then the sleep, so no poll outlasts the heartbeat's budget. */
function pause(root, ms) {
  beat(root);
  sleepSync(ms);
}

function appendLog(root, line) {
  try {
    fs.appendFileSync(path.join(spawnerDir(root), "log"), `${stamp()} ${line}\n`);
  } catch {
    // A log that cannot be written is not a reason to stop spawning seats.
  }
}

/**
 * The CLI, as a command. `TANTO_CLAUDE_NODE` names a Node script to run in
 * its place, which is how the tests fake it: a `.cmd` shim on PATH would
 * need `shell: true`, and the real `claude` is a native binary that does
 * not.
 */
function claudeCommand(args) {
  const viaNode = process.env.TANTO_CLAUDE_NODE;
  if (viaNode) return { file: process.execPath, args: [viaNode, ...args] };
  return { file: process.env.TANTO_CLAUDE || "claude", args };
}

/**
 * Run the CLI. `cwd` is the child's working directory — a worktree seat's
 * spawn alone passes one (spec 2.2); every other call inherits the root,
 * which `cmdRun` made this process's own.
 */
function runClaude(args, cwd) {
  const command = claudeCommand(args);
  const result = spawnSync(command.file, command.args, {
    encoding: "utf8",
    windowsHide: true,
    ...(cwd ? { cwd } : {}),
  });
  const err = result.stderr || (result.error ? String(result.error.message) : "");
  return { code: result.status === null ? 1 : result.status, out: result.stdout || "", err };
}

/**
 * `claude agents --json`, parsed, keeping the entries whose listed `cwd` is
 * the root or under it (`underRoot`, spec 2.3). No `--cwd`: the CLI's
 * filter is measured for the root alone, and a seat whose cwd is a worktree
 * under the root may be keyed elsewhere. Never throws.
 */
function listAgents(root) {
  const got = runClaude(["agents", "--json"]);
  if (got.code !== 0) {
    return { sessions: [], error: got.err.trim() || `claude agents exited ${got.code}` };
  }
  let parsed;
  try {
    parsed = JSON.parse(got.out);
  } catch {
    return { sessions: [], error: "claude agents --json did not print JSON" };
  }
  const all = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.sessions) ? parsed.sessions : [];
  return { sessions: all.filter((s) => underRoot(root, s?.cwd)) };
}

function configDir() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
}

/**
 * One look for `<sessionId>.jsonl` under every project directory. Only the
 * config directory is derived the way `SKILL.md`'s reading section derives
 * it (`CLAUDE_CONFIG_DIR`, else `~/.claude`); the project slug is the
 * harness's own encoding of a cwd, and nothing here runs inside a session
 * to read it from context, so the file is searched for rather than built.
 * A session id is unique, so the first hit is the file.
 */
function findTranscript(sessionId) {
  const projects = path.join(configDir(), "projects");
  try {
    for (const entry of fs.readdirSync(projects, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const file = path.join(projects, entry.name, `${sessionId}.jsonl`);
      if (fs.existsSync(file)) return file;
    }
  } catch {
    // No projects directory on this host yet.
  }
  return null;
}

/**
 * The transcript of a session, with a retry: the harness writes the file
 * some time after `claude agents --json` first lists the session, so one
 * look at the first sighting can miss it and freeze a `null` into the
 * result -- which `boundary.js record --seat` would then write into the
 * roster as `<sessionId>.jsonl`, and `reading.js --share` would skip at the
 * close. Ten seconds of looking costs nothing and narrows that window; the
 * census looks again at every pass while the seat has none (spec 3.1).
 */
function transcriptOf(root, sessionId) {
  for (let attempt = 0; attempt < TRANSCRIPT_POLL_TRIES; attempt++) {
    const found = findTranscript(sessionId);
    if (found) return found;
    pause(root, TRANSCRIPT_POLL_MS);
  }
  return null;
}

function noticeText(seat, message) {
  if (message) return message;
  const where = seat.id ? ` — claude attach ${seat.id}` : "";
  return `blocked: ${seat.role} ${seat.topic} ${seat.name}${where}`;
}

/**
 * The channel, by platform, each a child process with no dependency. The
 * Windows script loads the WinRT toast manager and shows a two-line toast
 * under the AUMID PowerShell registers for itself. That id must be the
 * registered one: `Show()` on an unregistered app id returns without error
 * and displays nothing, so a wrong id would make `raiseNotice` report a
 * channel for a notice nobody saw (task 11 measures it by eye).
 */
function noticeCommand(text, platform = process.platform) {
  if (platform === "win32") {
    const quoted = `'${String(text).replace(/'/g, "''")}'`;
    const script = [
      "[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null",
      "$x = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)",
      "$n = $x.GetElementsByTagName('text')",
      "$n.Item(0).AppendChild($x.CreateTextNode('tanto')) > $null",
      `$n.Item(1).AppendChild($x.CreateTextNode(${quoted})) > $null`,
      "[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\\WindowsPowerShell\\v1.0\\powershell.exe').Show([Windows.UI.Notifications.ToastNotification]::new($x))",
    ].join("; ");
    return ["powershell", ["-NoProfile", "-Command", script]];
  }
  if (platform === "darwin") {
    // Unescaped, a `"` or `\` in a topic or an `attention` message breaks or
    // injects the osascript command; the win32 branch above already escapes
    // its quotes (Important 12, branch-review.md).
    const escaped = String(text).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return ["osascript", ["-e", `display notification "${escaped}" with title "tanto"`]];
  }
  return ["notify-send", ["tanto", String(text)]];
}

/**
 * Raise the notice. Returns the channel used: `log` when the test seam is
 * set or the platform command fails, else the platform's own word. A notice
 * is a convenience, and `claude agents` in a terminal needs none.
 */
function raiseNotice(text) {
  const log = process.env.TANTO_NOTICE_LOG;
  if (log) {
    fs.appendFileSync(log, `${text}\n`);
    return "log";
  }
  const [file, args] = noticeCommand(text);
  const got = spawnSync(file, args, { encoding: "utf8", windowsHide: true });
  if (got.status === 0) return file;
  return "log";
}

/**
 * One segment of a seat's name: lower-cased, every run of characters outside
 * `a-z0-9` turned into one `-`, and no `-` at either end.
 */
function nameSegment(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Four random lower-case hexadecimal digits. */
function randomHex() {
  return Math.floor(Math.random() * 0x10000)
    .toString(16)
    .padStart(4, "0");
}

/**
 * A terminal seat's name, `<repo>-<role>[-<topic>]-<hex>` (spec 1.1): the
 * root's basename, the request's role, its topic unless absent or `—`, and
 * four hexadecimal digits, drawn again while a seat in `seats.json` carries
 * the whole name. The CLI registers it as the user's own, which no
 * auto-title replaces, and a flag-less resume brings it back from the job's
 * saved options, so the name is the seat's for its life.
 */
function seatName(root, request, seats, draw = randomHex) {
  const topic = request.topic && request.topic !== "—" ? nameSegment(request.topic) : "";
  const stem = [nameSegment(path.basename(root)), request.role, topic].filter(Boolean).join("-");
  let name = `${stem}-${draw()}`;
  while (seats.some((seat) => seat.name === name)) name = `${stem}-${draw()}`;
  return name;
}

/** A path with its separators unified, no trailing one, and, on Windows, its case folded. */
function comparablePath(p) {
  const unified = String(p).replace(/\\/g, "/").replace(/\/+$/, "");
  return process.platform === "win32" ? unified.toLowerCase() : unified;
}

/**
 * Whether a listed cwd is the root or a path under it: `boundary.js
 * census`'s key, and every reader of the listing here (spec 2.3), so a
 * session another repository starts in the same seconds is never adopted.
 */
function underRoot(root, cwd) {
  if (!cwd) return false;
  const base = comparablePath(root);
  const here = comparablePath(cwd);
  return here === base || here.startsWith(`${base}/`);
}

/** Whether a listed cwd lies under `<root>/.claude/worktrees/` (issue-aa37, spec 1.4). */
function underAdHocWorktree(root, cwd) {
  if (!cwd) return false;
  const worktrees = comparablePath(path.join(root, ".claude", "worktrees"));
  return comparablePath(cwd).startsWith(`${worktrees}/`);
}

// The CLI's background isolation, off for this seat alone (spec 1.2): with
// the default, `worktree`, a seat's first Write fails and it moves itself
// into `.claude/worktrees/`. A flag layer outranks every settings file, no
// file is written, and a flag-less resume keeps it.
const NO_BG_ISOLATION = JSON.stringify({ worktree: { bgIsolation: "none" } });

/**
 * The `--bg` command line of a spawn: the seat's name and the isolation
 * setting, then the request's own flags, then the prompt, and every
 * `--add-dir` last. No `-w` is passed for any seat: a worktree seat runs with
 * the worktree Kanri cut as its cwd (`opSpawn`, spec 2.2). A resume passes
 * none of them — any flag on `--resume … --bg` starts a copy under a new id —
 * and the CLI brings back the options the spawn passed. `request.branch` is
 * not read here — it is informational, carried through into the result and
 * then into `record --seat`'s Branch column (`boundary.js`); a worktree
 * seat's real branch is Kanri's `worktree-shoki-<topic>`, cut in the merge
 * act (Important 4, task 26; Minor 5, branch-review.md).
 */
function spawnArgs(request, name) {
  const args = ["--bg", "--name", name, "--settings", NO_BG_ISOLATION];
  if (request.model) args.push("--model", request.model);
  if (request.effort) args.push("--effort", request.effort);
  args.push("--permission-mode", request.mode || "auto");
  // The prompt before every `--add-dir`: that option is variadic, so a prompt
  // after it is read as one more directory and the seat starts with no first
  // turn (spec 1.1).
  const addDirs = (request.addDir || []).flatMap((dir) => ["--add-dir", dir]);
  return [...args, request.prompt, ...addDirs];
}

/**
 * The short id `--bg` prints, for a listing entry that carries no `id`: the
 * CLI prints `backgrounded · <short id> · <name>` on a spawn, and the same
 * line with ` (idle — send a prompt to start)` after it on a resume — and on
 * a spawn whose prompt was lost, which `opSpawn` treats as an error.
 */
function shortIdOf(text) {
  const found = /backgrounded\s+·\s+([A-Za-z0-9][\w-]*)\s+·/.exec(text || "");
  return found ? found[1] : null;
}

/** The note `claude --bg` prints for a session started with no prompt (spec 1.2). */
const IDLE_NOTE = "(idle — send a prompt to start)";

/** The line of `text` carrying the idle note, trimmed, or null. */
function idleLine(text) {
  const line = String(text || "")
    .split(/\r?\n/)
    .find((l) => l.includes(IDLE_NOTE));
  return line ? line.trim() : null;
}

/**
 * A spawn whose prompt was not delivered (spec 1.2): the seat exists, so it
 * is recorded with `undelivered` and removed with `claude rm` — not `stop`,
 * since such a session is listed with no `pid` and holds nothing worth
 * keeping. A removal that fails leaves the seat `running`, for the census to
 * see gone; the result is an error either way, which Kanri reads at its next
 * act, and the log line has a prefix of its own, apart from the guard's.
 */
function removeUndelivered(root, seat, line) {
  seat.undelivered = line;
  const got = runWithEitherId("rm", seat, seat.sessionId);
  if (got.code !== 0 && !alreadyExited(got)) {
    appendLog(root, `spawn: ${seat.sessionId} rm failed — ${failureText(got)}`);
    return { error: `prompt not delivered: ${line}; claude rm: ${failureText(got)}` };
  }
  seat.status = "removed";
  appendLog(root, `spawn: ${seat.sessionId} removed — prompt not delivered`);
  return { error: `prompt not delivered: ${line}` };
}

function findNew(root, before) {
  for (let attempt = 0; attempt < SPAWN_POLL_TRIES; attempt++) {
    const listing = listAgents(root);
    const fresh = listing.sessions.find((s) => s.sessionId && !before.has(s.sessionId));
    if (fresh) return fresh;
    pause(root, SPAWN_POLL_MS);
  }
  return null;
}

/**
 * As `findNew`, but for a `resume`: the session already exists under
 * `sessionId`, so a single post-`--resume` listing can still miss the
 * harness's own re-registration window, and the seat was left with its
 * stale name and id, a `goneAt` that never cleared, and a result reporting
 * success with `name: undefined` (Important 8, branch-review.md).
 */
function findResumed(root, sessionId) {
  for (let attempt = 0; attempt < SPAWN_POLL_TRIES; attempt++) {
    const listing = listAgents(root);
    // A collected seat leaves a stale entry of its own sessionId, with no
    // pid, which the listing shows before the resumed process registers
    // (spec 3.1).
    const found = listing.sessions.find((s) => s.sessionId === sessionId && s.pid);
    if (found) return found;
    pause(root, SPAWN_POLL_MS);
  }
  return null;
}

function opSpawn(root, request, seats) {
  // A worktree seat runs with the directory Kanri cut as its cwd (spec 2.2),
  // never with `-w`: an ordinary session, so the harness's worktree isolation
  // does not apply to it. A directory that is not there is an error before
  // `claude --bg` runs.
  const cwd = request.worktree ? path.join(root, ".claude", "worktrees", request.worktree) : null;
  if (cwd && !fs.statSync(cwd, { throwIfNoEntry: false })?.isDirectory()) {
    return { error: `worktree ${cwd} is not a directory` };
  }
  // A transient failure here must not be swallowed into an empty `before`
  // set: `findNew` below would then adopt the first already-running session
  // it sees as the new seat (Important 9, branch-review.md).
  const listing = listAgents(root);
  if (listing.error) return { error: `claude agents: ${listing.error}` };
  const before = new Set(listing.sessions.map((s) => s.sessionId));
  const name = seatName(root, request, seats);
  const got = runClaude(spawnArgs(request, name), cwd);
  if (got.code !== 0) return { error: `claude --bg exited ${got.code}: ${got.err.trim()}` };
  // The idle note on a spawn is a prompt that never reached the seat (spec
  // 1.2). On a resume it is the CLI's normal line, and the resume op does not
  // read it.
  const undelivered = idleLine(got.out);
  const session = findNew(root, before);
  if (!session && undelivered) return { error: `prompt not delivered: ${undelivered}` };
  if (!session) {
    return {
      error:
        "claude --bg exited 0 but `claude agents --json` listed no new session under the root within its poll — " +
        "it may have started under another cwd",
    };
  }

  // The listing's first sighting is the guard's first look (issue-aa37); the
  // spawner's census looks again at every pass, since a seat reaches
  // `.claude/worktrees/` at its first Write, after this sighting (spec 1.4).
  const stray = !request.worktree && underAdHocWorktree(root, session.cwd);
  const id = session.id || shortIdOf(got.out);
  const startedAt = formatStartedAt(session.startedAt);
  // The epoch value beside the formatted one, for the census's first-turn
  // budget (spec 3.2); absent when the listing gave no number.
  const startedAtMs = typeof session.startedAt === "number" ? session.startedAt : undefined;
  const seat = {
    sessionId: session.sessionId,
    id,
    name: session.name,
    role: request.role,
    topic: request.topic,
    model: request.model,
    effort: request.effort,
    mode: request.mode || "auto",
    worktree: request.worktree,
    cwd: session.cwd,
    startedAt,
    startedAtMs,
    status: stray ? "stopped" : "running",
    ...(stray ? { strayed: session.cwd } : {}),
  };
  seats.push(seat);
  if (undelivered) return removeUndelivered(root, seat, undelivered);
  if (stray) {
    runClaude(["stop", id || session.sessionId]);
    appendLog(root, `guard stopped ${session.sessionId} at ${session.cwd}`);
    return { error: `ad hoc worktree ${session.cwd}` };
  }
  // The seat carries its transcript too (spec 3.2): null when the poll
  // missed it, which the census fills later.
  seat.transcript = transcriptOf(root, session.sessionId);
  return {
    id,
    sessionId: session.sessionId,
    name: session.name,
    cwd: session.cwd,
    transcript: seat.transcript,
    startedAt,
  };
}

/**
 * A `claude stop` or `claude rm` that failed because the CLI has already
 * dropped the session (spec 5.1): not an error, since what the op asked for
 * is done.
 */
function alreadyExited(got) {
  return got.code !== 0 && got.err.includes("No job matching");
}

/** A failed command's text: its stderr, or its stdout when the stderr is empty (spec 5.1). */
function failureText(got) {
  return got.err.trim() || got.out.trim();
}

/** `stop` and `rm` take the short id on some builds and the long one on others. */
function runWithEitherId(verb, seat, sessionId) {
  const first = runClaude([verb, sessionId]);
  if (first.code === 0) return first;
  if (seat?.id && seat.id !== sessionId) {
    const second = runClaude([verb, seat.id]);
    if (second.code === 0) return second;
    return second;
  }
  return first;
}

function handleRequest(root, request, seats) {
  if (!OPS.includes(request.op)) return { error: `unknown op ${request.op}` };
  const seat = request.sessionId ? seatOf(seats, request.sessionId) : null;

  if (request.op === "spawn") return opSpawn(root, request, seats);

  if (request.op === "stop") {
    const got = runWithEitherId("stop", seat, request.sessionId);
    const exited = alreadyExited(got);
    if (got.code !== 0 && !exited) return { error: `claude stop: ${failureText(got)}` };
    if (seat) seat.status = "stopped";
    return { stopped: stamp(), ...(exited ? { note: "already exited" } : {}) };
  }

  if (request.op === "rm") {
    const got = runWithEitherId("rm", seat, request.sessionId);
    const exited = alreadyExited(got);
    if (got.code !== 0 && !exited) return { error: `claude rm: ${failureText(got)}` };
    if (seat) seat.status = "removed";
    // The worktree `claude rm` printed it removed, and none when it printed
    // none: Kanri's worktree is the seat's cwd and not the CLI's, and a name
    // is not a removal (spec 2.4).
    const printed = /Removed worktree (.+)/i.exec(got.out);
    return {
      removed: stamp(),
      ...(printed ? { worktree: printed[1].trim() } : {}),
      ...(exited ? { note: "already exited" } : {}),
    };
  }

  if (request.op === "resume") {
    // No flag: the CLI brings back the options the spawn passed and names
    // them on stderr, which a result does not carry, so the log keeps it.
    const got = runClaude(["--resume", request.sessionId, "--bg"]);
    if (got.code !== 0) return { error: `claude --resume: ${got.err.trim()}` };
    if (got.err.trim()) appendLog(root, `resume ${request.sessionId}: ${got.err.trim()}`);
    const session = findResumed(root, request.sessionId);
    if (seat && session) {
      seat.name = session.name;
      seat.id = session.id || shortIdOf(got.out) || seat.id;
      seat.status = "running";
      delete seat.goneAt;
    }
    return {
      sessionId: request.sessionId,
      name: session ? session.name : undefined,
      id: seat ? seat.id : shortIdOf(got.out),
    };
  }

  if (request.op === "attention") {
    const text = String(request.message || "").replace("<id>", seat?.id || "<id>");
    const channel = raiseNotice(text);
    appendLog(root, `attention ${text}`);
    return { notified: stamp(), channel };
  }

  // ack
  if (seat) delete seat.renamed;
  return { acked: stamp() };
}

function takeRequests(root, seats) {
  let names;
  try {
    names = fs
      .readdirSync(requestsDir(root))
      .filter((n) => n.endsWith(".json"))
      .sort();
  } catch {
    return;
  }
  for (const name of names) {
    const file = path.join(requestsDir(root), name);
    const request = readJson(file);
    if (!request) {
      // Removing the file with no result and no log line left the requester
      // — `tanto.js`'s `waitForResult`, or Kanri reading results — waiting
      // out its whole timeout with no diagnostic (Important 10,
      // branch-review.md).
      writeJsonAtomic(path.join(resultsDir(root), name), { error: "request did not parse" });
      fs.rmSync(file, { force: true });
      appendLog(root, `${name} error: request did not parse`);
      continue;
    }
    let outcome;
    // A beat before and after every request (spec 4.1): a spawn or a resume
    // is the longest stretch the spawner works without returning here.
    beat(root);
    try {
      outcome = handleRequest(root, request, seats);
    } catch (error) {
      outcome = { error: String(error?.message) };
    }
    beat(root);
    writeJsonAtomic(path.join(resultsDir(root), name), { ...request, ...outcome });
    fs.rmSync(file, { force: true });
    writeSeats(root, seats);
    // A `note` rides on success: `rm <name> ok (already exited)` (spec 5.1).
    const said = outcome.error ? `error: ${outcome.error}` : outcome.note ? `ok (${outcome.note})` : "ok";
    appendLog(root, `${request.op} ${name} ${said}`);
  }
}

/**
 * A seat `seats.json` holds as `gone` whose `sessionId` the listing holds
 * again — one the human `/stop`ped and reopened with `claude attach <id>`
 * (spec 1.3). It goes back to `running`, and the pass that follows sets
 * `blocked` when the listing says so, the notice with it. A seat the run's
 * own `stop` request stopped, or one removed, is never revived.
 */
function revive(root, seat) {
  seat.status = "running";
  delete seat.goneAt;
  appendLog(root, `census: ${seat.sessionId} back`);
}

/**
 * The ad hoc-worktree guard at a pass (spec 1.4): stop the seat by its short
 * id, mark it `stopped` with `strayed: <cwd>`, log it, and toast once — the
 * next pass skips a `stopped` seat, so the toast is not repeated. A stop
 * that fails leaves the seat as it was, for the next pass to try again.
 */
function strand(root, seat, cwd) {
  const got = runClaude(["stop", seat.id || seat.sessionId]);
  if (got.code !== 0) {
    appendLog(root, `guard: stop ${seat.sessionId} failed — ${got.err.trim()}`);
    return;
  }
  seat.status = "stopped";
  seat.strayed = cwd;
  appendLog(root, `guard stopped ${seat.sessionId} at ${cwd}`);
  raiseNotice(`strayed: ${seat.role} ${seat.topic} ${seat.name} — ${cwd}`);
}

/**
 * Look once for a seat's transcript while `seats.json` holds none (spec 3.1):
 * the spawn's ten-second poll can miss it, and the path that reaches the
 * seat here is what `record --seat` and the roster's Transcript column read
 * next. A mark of no first turn that the transcript answers is cleared.
 * Returns whether the seat has a transcript now.
 */
function lookForTranscript(root, seat) {
  if (seat.transcript) return true;
  const found = findTranscript(seat.sessionId);
  if (!found) return false;
  seat.transcript = found;
  if (seat.noFirstTurn) {
    delete seat.noFirstTurn;
    appendLog(root, `census: ${seat.sessionId} first turn`);
  }
  return true;
}

/**
 * A seat that has run no first turn (spec 3.1): marked once, with one toast
 * and one log line, and never stopped — the one cause the design knows is
 * closed at the spawn, and what reaches here is for the human to look at. A
 * seat with no `startedAtMs`, one from before this rule, is never judged.
 */
function noFirstTurn(root, seat, line) {
  if (seat.noFirstTurn || typeof seat.startedAtMs !== "number") return false;
  seat.noFirstTurn = stamp();
  const where = seat.id ? ` — claude attach ${seat.id}` : "";
  raiseNotice(`no first turn: ${seat.role} ${seat.topic} ${seat.name}${where}`);
  appendLog(root, line);
  return true;
}

/** One `running` or `blocked` seat against the listing's entry for it. */
function censusSeat(root, seat, session) {
  if (!session) {
    seat.status = "gone";
    seat.goneAt = stamp();
    // Gone with no transcript: a session that never ran a turn and did not
    // stay — listed with no pid, so absent here at its first pass, before
    // the budget below could see it.
    const marked =
      !lookForTranscript(root, seat) && noFirstTurn(root, seat, `census: ${seat.sessionId} gone — no first turn`);
    if (!marked) appendLog(root, `census: ${seat.sessionId} gone`);
    return;
  }
  if (!seat.worktree && underAdHocWorktree(root, session.cwd)) {
    strand(root, seat, session.cwd);
    return;
  }
  if (session.name && session.name !== seat.name) {
    seat.renamed = seat.name;
    seat.name = session.name;
    appendLog(root, `census: ${seat.sessionId} renamed to ${session.name}`);
  }
  if (session.id) seat.id = session.id;
  if (session.state === "blocked" && seat.status !== "blocked") {
    seat.status = "blocked";
    raiseNotice(noticeText(seat));
    appendLog(root, `census: ${seat.sessionId} blocked`);
  } else if (session.state !== "blocked" && seat.status === "blocked") {
    seat.status = "running";
  }
  if (lookForTranscript(root, seat)) return;
  if (nowMs() - seat.startedAtMs >= FIRST_TURN_WAIT_MS) {
    noFirstTurn(root, seat, `census: ${seat.sessionId} no first turn after 2m`);
  }
}

/** The spawner's census: one pass over `seats.json` against the listing. */
function runCensus(root, seats) {
  beat(root);
  const listing = listAgents(root);
  if (listing.error) {
    appendLog(root, `census: ${listing.error}`);
    return seats;
  }
  const byId = new Map(listing.sessions.filter((s) => s.sessionId && s.pid).map((s) => [s.sessionId, s]));
  for (const seat of seats) {
    const session = byId.get(seat.sessionId);
    if (seat.status === "gone" && session) revive(root, seat);
    if (LIVE.includes(seat.status)) censusSeat(root, seat, session);
  }
  writeSeats(root, seats);
  return seats;
}

/**
 * Log a caught exception, never letting the logging itself throw. `appendLog`
 * already wraps its own `appendFileSync`, but the message it is handed here
 * — `error && error.message ? ... : String(error)` — is evaluated in the
 * caller's `catch` block, outside that guard; an `error` whose `.message`
 * getter or `toString` throws would still escape and end the resident —
 * exactly the class of failure `guarded` below exists to survive (Important
 * 2, branch-review.md, fix round 2).
 */
function logGuardError(root, error) {
  try {
    appendLog(root, `guard: ${error?.message ? error.message : String(error)}`);
  } catch {
    // As above: logging the caught error must never itself end the resident.
  }
}

/**
 * Wrap `fn` so an exception it throws is caught and logged rather than
 * ending the resident. `handleRequest`'s own call site already has this
 * belt; the first `pass()`, the two intervals, and the `fs.watch` callback
 * did not, and there are unguarded throws underneath all four —
 * `writeJsonAtomic`, `appendFileSync` on `TANTO_NOTICE_LOG`, `rmSync` — any
 * one of which ended the resident, and every seat's bookkeeping with it,
 * silently (Important 11, branch-review.md).
 */
function guarded(root, fn) {
  return (...args) => {
    try {
      fn(...args);
    } catch (error) {
      logGuardError(root, error);
    }
  };
}

function cmdRun(argv) {
  const { values } = parseArgs(argv);
  const root = typeof values.root === "string" ? path.resolve(values.root) : process.cwd();
  // Every child this process spawns — `claude --bg` above all — must land in
  // the workspace root, never wherever the spawner itself was started from
  // (Critical 1, branch-review.md): `spawnSync` with no `cwd` inherits this
  // process's own, so fixing it here once covers `runClaude`'s every caller
  // but a worktree seat's spawn, which names its own (spec 2.2).
  process.chdir(root);
  ensureDirs(root);
  fs.writeFileSync(path.join(spawnerDir(root), "pid"), `${process.pid}\n`);
  const pass = guarded(root, () => {
    beat(root);
    const seats = readSeats(root);
    takeRequests(root, seats);
    runCensus(root, seats);
  });
  pass();
  if (values.once) return 0;
  // The two intervals below and the watch callback never interleave a
  // read-modify-write of `seats.json`, because `sleepSync`'s `Atomics.wait`
  // — used by the transcript poll and by `findNew`/`findResumed`, through
  // `pause`, which beats first — blocks this event loop for up to about a
  // minute per spawn or resume (M-6). Making any of those
  // polls async needs one shared array between the loops first (Minor 17,
  // branch-review.md).
  setInterval(
    guarded(root, () => takeRequests(root, readSeats(root))),
    REQUEST_INTERVAL_MS,
  );
  setInterval(
    guarded(root, () => runCensus(root, readSeats(root))),
    CENSUS_INTERVAL_MS,
  );
  try {
    const watcher = fs.watch(
      requestsDir(root),
      guarded(root, () => takeRequests(root, readSeats(root))),
    );
    // The try/catch above only catches a synchronous construction failure.
    // An `error` event emitted later — the requests directory removed or
    // replaced out from under the watch, which happens on Windows — is
    // asynchronous and unrelated to `guarded`'s call-time wrapping, so it
    // needs its own handler through the same logged, never-throwing path
    // (Important 3, branch-review.md, fix round 2).
    watcher.on("error", (error) => logGuardError(root, error));
  } catch {
    // The two-second interval is the floor; the watch is the speed-up.
  }
  return 0;
}

function cmdNotify(argv) {
  const { values } = parseArgs(argv);
  if (typeof values.text === "string") {
    raiseNotice(values.text);
    return 0;
  }
  if (!values.stdin) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  let payload = {};
  try {
    payload = JSON.parse(fs.readFileSync(0, "utf8"));
  } catch {
    payload = {};
  }
  const what = payload.notification_type || "notification";
  const where = payload.cwd || "";
  const who = payload.session_id || "";
  raiseNotice(`tanto: ${what} in ${where} — claude attach ${who}`);
  return 0;
}

function main(argv) {
  const sub = argv[0];
  if (sub === "run") return cmdRun(argv.slice(1));
  if (sub === "notify") return cmdNotify(argv.slice(1));
  process.stderr.write(`${USAGE}\n`);
  return 2;
}

module.exports = {
  main,
  noticeCommand,
  handleRequest,
  runCensus,
  readSeats,
  spawnerDir,
  seatName,
  shortIdOf,
  // For the launcher (`tanto.js`): the listing's key, the log, and the heartbeat.
  underRoot,
  appendLog,
  heartbeatPath,
  HEARTBEAT_STALE_MS,
};

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
