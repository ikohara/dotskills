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
// working (spec 4.1): the longest silence between two beats is one census
// interval plus one census pass.
const HEARTBEAT_STALE_MS = 60000;

// The ops, in the order `templates/spawn-request.md` documents them.
const OPS = ["spawn", "stop", "rm", "resume", "attention", "ack", "park", "hold", "release"];

// The statuses a census pass checks against the listing's entry (spec 2.7):
// a `parked` seat the listing shows again is `relist`ed into them first,
// and a `gone` one `revive`d. They are not the roster's words: a `parked`
// seat's row stays `live`, and Kanri writes `stopped`.
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

/**
 * `seats.json` holds one array, `seats`. A seat carries what its spawn knew
 * — `sessionId`, `id`, `name`, `role`, `topic`, `model`, `effort`, `mode`,
 * `worktree`, `cwd`, `startedAt`, `startedAtMs`, `transcript` — the marks
 * earlier rules set — `renamed`, `goneAt`, `noFirstTurn`, `strayed`,
 * `undelivered` — and these (spec 2.8, section 6):
 *
 * - `status`, one of six: `running` (listed with a pid, in the background or
 *   in a tab), `blocked` (listed in the background on a prompt), `parked` (a
 *   contract-2 dialogue seat not listed), `gone` (any other seat not
 *   listed), `stopped`, and `removed`.
 * - `contract` — the `spawn` request's mark, `2` under this contract (spec
 *   1.1): the park, the hold, and the census's `parked` touch a seat that
 *   carries it. `requestId` — the request file that spawned it. `once` — a
 *   seat stopped and removed once its turn has ended (spec 4.4).
 * - `kind` — the listing's, `background` or `interactive`, at the last
 *   census pass; `waitingFor` — a `blocked` seat's cause (spec 2.6).
 * - `parkRequest`, `lastPark`, `waiting`, `midTurn` — the park (spec 2.3,
 *   2.7); `held` — the hold (spec 2.4); `leaveRequest` — a `self` stop
 *   waiting for its turn's end, and `endedBy: "taiseki"` once it is done
 *   (spec 5.2).
 * - `parkedAtMs`, `stoppedAtMs`, `listedAtMs` — epoch milliseconds, as
 *   `startedAtMs` is, and never compared with the minute-resolution
 *   `stamp()` strings the file also carries.
 */
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

// A final message is settled once a closing `system` record follows it, or
// once the transcript has not been written for this long (spec 2.8): a turn
// taken in a tab writes no `turn_duration`, and a session with no Stop hook
// writes no `stop_hook_summary` either.
const TURN_SETTLED_MS = 10000;

/** The `system` records the harness writes after a turn's final message (S-2, P-1b). */
const CLOSING_SUBTYPES = ["turn_duration", "stop_hook_summary"];

/**
 * "The turn ended" (spec 2.8), read over messages and not records: the
 * transcript's `user` and `assistant` records that are not `isSidechain` and
 * come after the record whose `uuid` is `after` — all of them with no
 * `after` — with consecutive `assistant` records of one `message.id` taken
 * as one message, since a final message is often a thinking record and a
 * text record that both carry `stop_reason: end_turn`. Returns null when
 * the transcript cannot be read or does not hold `after`, which no caller
 * takes for an end; otherwise:
 *
 * - `ended` — the last message is an `end_turn` assistant that is settled,
 *   or the harness's own `<synthetic>` record, which closes a turn left
 *   open when a session is woken;
 * - `newTurn` — a message follows an ended one: a `user` record, or an
 *   assistant message that is not synthetic;
 * - `midTurn` — the last message is anything but an `end_turn` assistant: a
 *   `tool_use`, a `user` record, the synthetic record, any other
 *   `stop_reason`.
 *
 * The park, a `self` stop, a `once` seat, and `boundary.js seat` read
 * `ended`; the park reads `newTurn`; the census's `parked` reads `midTurn`.
 */
function turnEnded(transcript, after) {
  let text;
  let writtenMs;
  try {
    text = fs.readFileSync(transcript, "utf8");
    writtenMs = fs.statSync(transcript).mtimeMs;
  } catch {
    return null;
  }
  const records = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      records.push(JSON.parse(line));
    } catch {
      // A line the harness is still writing; the next pass reads it whole.
    }
  }
  let start = 0;
  if (after) {
    const at = records.findIndex((record) => record?.uuid === after);
    if (at === -1) return null;
    start = at + 1;
  }
  const messages = [];
  let closedAt = -1;
  for (let i = start; i < records.length; i++) {
    const record = records[i];
    if (record?.type === "system" && CLOSING_SUBTYPES.includes(record.subtype)) closedAt = i;
    if ((record?.type !== "user" && record?.type !== "assistant") || record.isSidechain) continue;
    const id = record.message?.id;
    const last = messages[messages.length - 1];
    if (record.type === "assistant" && last?.type === "assistant" && id && last.id === id) {
      last.stopReason = record.message?.stop_reason;
      last.at = i;
      continue;
    }
    messages.push({
      type: record.type,
      id,
      stopReason: record.message?.stop_reason,
      synthetic: record.type === "assistant" && record.message?.model === "<synthetic>",
      at: i,
    });
  }
  const isEnd = (m) => m.type === "assistant" && !m.synthetic && m.stopReason === "end_turn";
  const closes = (m) => isEnd(m) || m.synthetic;
  const newTurn = messages.some((m, i) => i > 0 && closes(messages[i - 1]) && !m.synthetic);
  const last = messages[messages.length - 1];
  if (!last) return { ended: false, newTurn, midTurn: false };
  const settled = closedAt > last.at || nowMs() - writtenMs >= TURN_SETTLED_MS;
  return { ended: (isEnd(last) && settled) || last.synthetic, newTurn, midTurn: !isEnd(last) };
}

/**
 * The census's notice for a seat on a prompt (spec 2.6): its cause, as the
 * listing gives it, and the launcher's way in, by role — a seat's id
 * changes at every handover, and its role does not (I-11).
 */
function noticeText(seat) {
  return `blocked: ${seat.role} ${seat.topic} ${seat.name} — ${seat.waitingFor} — ${enterCommand(seat)}`;
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
 * A seat's name, `<repo>-<role>[-<topic>]-<hex>` (spec 1.1): the
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

// Within this long of a park or a stop, a listed entry is the process still
// leaving (spec 2.5, S-5), not a seat that is alive.
const STOP_SETTLE_MS = 30000;

/**
 * Poll the listing once a second, up to thirty times, until `sessionId` has
 * left it (spec 2.5): a resume issued while a stop is finishing starts a
 * copy (S-5). Returns whether it left.
 */
function waitUnlisted(root, sessionId) {
  for (let attempt = 0; attempt < SPAWN_POLL_TRIES; attempt++) {
    const { entry, error } = listedEntry(root, sessionId);
    if (!error && !entry) return true;
    pause(root, SPAWN_POLL_MS);
  }
  return false;
}

/**
 * The copy a resume started instead of waking the seat (spec 2.5, P-8), or
 * null: the id after `started a copy as` on either stream — the CLI writes
 * its note to stderr — or stdout's `backgrounded · <id>` when that id is
 * neither the seat's short id nor the head of its `sessionId`.
 */
function copyOf(got, sessionId, seat) {
  const noted = /started a copy as ([A-Za-z0-9][\w-]*)/.exec(`${got.err}\n${got.out}`);
  if (noted) return noted[1];
  const printed = shortIdOf(got.out);
  if (!printed || printed === seat?.id || sessionId.startsWith(printed)) return null;
  return printed;
}

/**
 * `resume` (spec 2.5). A parked seat is woken, never handed a line: a
 * prompt is taken for a Kanri alone (S-3), as the command's one positional
 * and still no flag (decision-7c87). Before the command, on a fresh
 * listing, a seat a tab holds or one alive in the background is `listed`,
 * since a resume would start a copy that holds its whole conversation and
 * acts on its prompt (M-6, P-8); a seat whose park or stop is under thirty
 * seconds old is waited out. After it, a copy is stopped and removed, and a
 * prompt the CLI did not take is an error. The CLI names the options it
 * brought back on stderr, which a result does not carry, so the log keeps
 * it.
 */
function opResume(root, request, seat) {
  if (request.prompt && (seat?.role || request.role) !== "kanri") return { error: "no prompt for this role" };
  if (seat?.status === "removed") return { error: "removed" };
  const { entry, error } = listedEntry(root, request.sessionId);
  if (error) return { error: `claude agents: ${error}` };
  if (entry) {
    const listed = { error: "listed", name: entry.name, kind: entry.kind };
    if (entry.kind === "interactive") return listed;
    const endedAtMs = Math.max(seat?.parkedAtMs || 0, seat?.stoppedAtMs || 0);
    if (nowMs() - endedAtMs >= STOP_SETTLE_MS) return listed;
    if (!waitUnlisted(root, request.sessionId)) return { error: "still listed" };
  }
  const got = runClaude(["--resume", request.sessionId, "--bg", ...(request.prompt ? [request.prompt] : [])]);
  if (got.code !== 0) return { error: `claude --resume: ${failureText(got)}` };
  const copy = copyOf(got, request.sessionId, seat);
  if (copy) {
    runClaude(["stop", copy]);
    runClaude(["rm", copy]);
    appendLog(root, `resume ${request.sessionId}: copy ${copy} removed`);
    return { error: `copy ${copy} removed` };
  }
  if (request.prompt && idleLine(got.out)) return { error: "prompt not delivered" };
  if (got.err.trim()) appendLog(root, `resume ${request.sessionId}: ${got.err.trim()}`);
  const session = findResumed(root, request.sessionId);
  if (seat && session) {
    seat.name = session.name;
    seat.id = session.id || shortIdOf(got.out) || seat.id;
    seat.status = "running";
    delete seat.goneAt;
    delete seat.parkedAtMs;
    delete seat.midTurn;
  }
  return {
    sessionId: request.sessionId,
    name: session ? session.name : undefined,
    id: seat ? seat.id : shortIdOf(got.out),
  };
}

// The roles whose turns can end on a question to the human (spec, Words).
const DIALOGUE_ROLES = ["sekkei", "keikaku", "kikaku", "hosa", "kaiseki"];

// The roles a marked spawn gives one holder at a time (spec 1.2).
const ONE_HOLDER_ROLES = ["kanri", "kikaku", "hosa"];

/**
 * Whether the state file holds a seat (spec, Words): `running`, `blocked`,
 * or `parked` — or `gone`, for a seat that is not a dialogue seat, which a
 * resume brings back.
 */
function holds(seat) {
  if (["running", "blocked", "parked"].includes(seat.status)) return true;
  return seat.status === "gone" && !DIALOGUE_ROLES.includes(seat.role);
}

// A `once` seat is stopped and removed this long after its spawn, whatever
// its turn did (spec 4.4).
const ONCE_WAIT_MS = 300000;

/**
 * The census's end of a `once` seat (spec 4.4) — a messenger, which
 * forwards one line and has nothing more to do: stopped and removed when its
 * turn has ended (spec 2.8), or five minutes after its spawn in any case. A
 * removal that fails is logged and tried again at the next pass.
 */
function endOnceSeats(root, seats) {
  for (const seat of seats) {
    if (!seat.once || seat.status === "removed") continue;
    const transcript = seat.transcript || findTranscript(seat.sessionId);
    const ended = Boolean(transcript && turnEnded(transcript)?.ended);
    const late = typeof seat.startedAtMs === "number" && nowMs() - seat.startedAtMs >= ONCE_WAIT_MS;
    if (!ended && !late) continue;
    runWithEitherId("stop", seat, seat.sessionId);
    const got = runWithEitherId("rm", seat, seat.sessionId);
    if (got.code !== 0 && !alreadyExited(got)) {
      appendLog(root, `once: ${seat.sessionId} rm failed — ${failureText(got)}`);
      continue;
    }
    seat.status = "removed";
    appendLog(root, `once: ${seat.sessionId} removed — ${ended ? "its turn ended" : "five minutes after its spawn"}`);
  }
}

function opSpawn(root, request, seats, requestId) {
  // One holder per role (spec 1.2): a marked request for a role the state
  // file holds a seat of is refused, unless it names that seat as the one it
  // succeeds — a Kanri's handover. An unmarked request is never refused: a
  // Kanri that read the old text hands over with no `succeeds`.
  if (request.contract === 2 && ONE_HOLDER_ROLES.includes(request.role)) {
    const holder = seats.find((s) => s.role === request.role && holds(s) && s.sessionId !== request.succeeds);
    if (holder) return { error: `held: ${holder.sessionId}` };
  }
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
  if (got.code !== 0) return { error: `claude --bg exited ${got.code}: ${failureText(got)}` };
  // The idle note on a spawn is a prompt that never reached the seat (spec
  // 1.2); a resume reads it only when it carried a prompt (`opResume`).
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
    // The request's mark (spec 1.1), the request file it came in, and a
    // messenger's `once` (spec 4.4).
    ...(request.contract !== undefined ? { contract: request.contract } : {}),
    ...(requestId ? { requestId } : {}),
    ...(request.once === true ? { once: true } : {}),
  };
  seats.push(seat);
  // On disk at once, before the transcript poll below (spec 1.5): a seat
  // whose first act is `boundary.js seat` finds its own entry.
  writeSeats(root, seats);
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

// A request a seat leaves standing — a `self` stop here, a park (spec 2.3)
// — is dropped this long after it was written, or after its turn ended,
// with a log line.
const STANDING_WAIT_MS = 600000;

/**
 * Whether the human paces this seat (spec 5.2): a Kikaku, a Hosa, or a
 * Kaiseki whose topic is `—`. Only such a seat ends by its own `taiseki`,
 * whatever a role's text let through.
 */
function pacedByHuman(seat) {
  if (seat?.role === "kikaku" || seat?.role === "hosa") return true;
  return seat?.role === "kaiseki" && (!seat.topic || seat.topic === "—");
}

/** A seat ended (spec 2.8): `stopped`, the moment in epoch milliseconds, and who ended it. */
function markStopped(seat, endedBy) {
  seat.status = "stopped";
  seat.stoppedAtMs = nowMs();
  if (endedBy) seat.endedBy = endedBy;
  delete seat.leaveRequest;
}

/**
 * The listing's entry for `sessionId` when it carries a pid (decision-ebbd),
 * from `sessions` when a listing was already taken, else from a fresh one.
 * Returns { entry } — `entry` null when the session is not listed — or
 * { error } when the listing cannot be read.
 */
function listedEntry(root, sessionId, sessions = null) {
  let listed = sessions;
  if (!listed) {
    const listing = listAgents(root);
    if (listing.error) return { error: listing.error };
    listed = listing.sessions;
  }
  return { entry: listed.find((s) => s.sessionId === sessionId && s.pid) || null };
}

/**
 * `stop` (spec 2.8's table, 5.1): `claude stop` for a seat a fresh listing
 * shows in the background, and no command otherwise — the CLI reports a
 * seat a tab holds stopped and does not stop it (P-9), and a seat not listed
 * has no process. Both are recorded `stopped` with a note. A listing that
 * cannot be read leaves the command to decide, as before this rule; a seat
 * already ended is answered with nothing done.
 */
function opStop(root, request, seat) {
  if (seat?.status === "removed") return { stopped: stamp() };
  if (seat?.status === "stopped") return { stopped: stamp(), note: "already exited" };
  const { entry, error } = listedEntry(root, request.sessionId);
  if (!error && (!entry || entry.kind === "interactive")) {
    if (seat) markStopped(seat);
    return { stopped: stamp(), note: entry ? "in a tab" : "already exited" };
  }
  const got = runWithEitherId("stop", seat, request.sessionId);
  const exited = alreadyExited(got);
  if (got.code !== 0 && !exited) return { error: `claude stop: ${failureText(got)}` };
  if (seat) markStopped(seat);
  return { stopped: stamp(), ...(exited ? { note: "already exited" } : {}) };
}

/**
 * A seat's end by its own word (spec 5.2), tried when the request comes and
 * at every pass after: at once for a seat a tab holds or that is not listed,
 * which is what makes the word work the same from a terminal, a tab, and
 * Remote Control, and for a seat in the background once its turn has ended
 * since `after` (spec 2.8), so that its closing line is written. Ten minutes
 * on, an unmet request is dropped, logged, and said to the human, so that
 * the word never fails in silence. Returns the result once the seat ended,
 * else null.
 */
function tryLeave(root, seat, sessions = null) {
  const leave = seat.leaveRequest;
  if (nowMs() - leave.atMs >= STANDING_WAIT_MS) {
    delete seat.leaveRequest;
    appendLog(root, `leave: ${seat.sessionId} dropped — its turn did not end`);
    raiseNotice(`taiseki not done: ${seat.role} — tanto ${seat.role}`);
    return null;
  }
  const { entry, error } = listedEntry(root, seat.sessionId, sessions);
  if (error) return null;
  let note = entry ? "in a tab" : "already exited";
  if (entry && entry.kind !== "interactive") {
    const transcript = seat.transcript || findTranscript(seat.sessionId);
    if (!transcript || !turnEnded(transcript, leave.after)?.ended) return null;
    const got = runWithEitherId("stop", seat, seat.sessionId);
    if (got.code !== 0 && !alreadyExited(got)) {
      appendLog(root, `leave: ${seat.sessionId} stop failed — ${failureText(got)}`);
      return null;
    }
    note = alreadyExited(got) ? "already exited" : null;
  }
  markStopped(seat, "taiseki");
  appendLog(root, `leave: ${seat.sessionId} stopped`);
  return { stopped: stamp(), ...(note ? { note } : {}) };
}

/** `stop` with `self` and `after` (spec 5.2): a seat the human paces, ending itself. */
function opLeave(root, request, seat) {
  if (!pacedByHuman(seat)) return { error: "not a seat the human paces" };
  if (seat.status === "removed") return { stopped: stamp() };
  if (seat.status === "stopped") return { stopped: stamp(), note: "already exited" };
  const atMs = nowMs();
  seat.leaveRequest = { after: request.after, atMs };
  return tryLeave(root, seat) || { leaveRequested: atMs };
}

/**
 * Every `self` stop still waiting for its turn's end, tried again (spec
 * 5.2): at a request pass, which takes a listing only when one waits, and at
 * a census pass, on the listing it already took.
 */
function leavePass(root, seats, sessions = null) {
  const waiting = seats.filter((seat) => seat.leaveRequest && seat.status !== "stopped" && seat.status !== "removed");
  if (waiting.length === 0) return;
  let listed = sessions;
  if (!listed) {
    const listing = listAgents(root);
    if (listing.error) return;
    listed = listing.sessions;
  }
  for (const seat of waiting) tryLeave(root, seat, listed);
  writeSeats(root, seats);
}

function handleRequest(root, request, seats, requestId) {
  if (!OPS.includes(request.op)) return { error: `unknown op ${request.op}` };
  const seat = request.sessionId ? seatOf(seats, request.sessionId) : null;

  if (request.op === "spawn") return opSpawn(root, request, seats, requestId);

  // A seat's own `taiseki` carries `self` and `after` (spec 5.2).
  if (request.op === "stop") return request.self ? opLeave(root, request, seat) : opStop(root, request, seat);

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

  if (request.op === "resume") return opResume(root, request, seat);

  if (request.op === "attention") {
    // As written: a message names `tanto <role> [<topic>]`, never an id (spec 1.1).
    const text = String(request.message || "");
    const channel = raiseNotice(text);
    appendLog(root, `attention ${text}`);
    return { notified: stamp(), channel };
  }

  if (request.op === "park") return opPark(request, seat);
  if (request.op === "hold") return opHold(root, request, seat);
  if (request.op === "release") {
    if (!seat) return { error: `unknown seat ${request.sessionId}` };
    // The mark alone (spec 2.4): a park the seat asked for while it was held
    // proceeds at the next pass, and a seat that asked for none is left to
    // its own next turn's end.
    delete seat.held;
    return { released: stamp() };
  }

  // ack
  if (seat) delete seat.renamed;
  return { acked: stamp() };
}

// A seat parked at its own request and listed again with no new turn is
// stopped again once it has been listed this long (spec 2.3): long enough
// for a wake's `SendMessage` to begin a turn.
const RELISTED_PARK_MS = 120000;

/** Whether a seat is a contract-2 dialogue seat (spec 1.1, Words), the one kind the park and its census rules touch. */
function isContractDialogue(seat) {
  return seat?.contract === 2 && DIALOGUE_ROLES.includes(seat.role);
}

/** The launcher's way into a seat (spec 1.1): `tanto <role>`, with its topic when it has one. */
function enterCommand(seat) {
  const topic = seat.topic && seat.topic !== "—" ? ` ${seat.topic}` : "";
  return `tanto ${seat.role}${topic}`;
}

/** Whether a process answers signal 0 — a launcher holds a seat while it does (spec 2.4). */
function pidAlive(pid) {
  try {
    process.kill(Number(pid), 0);
    return true;
  } catch (error) {
    return error?.code === "EPERM";
  }
}

/**
 * `park` (spec 2.2, 2.3): the request is recorded on the seat, replacing any
 * earlier one, and answered at once; `tryParks` carries it out at the passes
 * that follow.
 */
function opPark(request, seat) {
  if (!isContractDialogue(seat)) return { error: "not a dialogue seat" };
  if (seat.status === "stopped" || seat.status === "removed") return { error: "ended" };
  const atMs = nowMs();
  seat.parkRequest = { after: request.after, waiting: request.waiting === true, notice: request.notice === true, atMs };
  return { parkRequested: atMs };
}

/**
 * `hold` (spec 2.4): a launcher's mark, `pid` its own, written before an
 * attach, which the listing does not show (H-1a); or Kanri's for a face with
 * no launcher, `forMs` long. It wakes nothing — the attach does (P-4). A
 * seat whose park is under thirty seconds old and still listed is waited out
 * first, so that the attach does not meet a process that is leaving (S-5).
 */
function opHold(root, request, seat) {
  if (!seat) return { error: `unknown seat ${request.sessionId}` };
  if (seat.contract !== 2) return { error: "old-contract seat" };
  if (seat.status === "stopped" || seat.status === "removed") return { error: "ended" };
  if (!request.pid && !request.forMs) return { error: "a hold names a pid or forMs" };
  if (seat.held?.pid && pidAlive(seat.held.pid)) return { error: "held by another terminal" };
  const { entry, error } = listedEntry(root, seat.sessionId);
  if (error) return { error: `claude agents: ${error}` };
  if (entry?.kind === "interactive") return { error: "in a tab" };
  if (entry && typeof seat.parkedAtMs === "number" && nowMs() - seat.parkedAtMs < STOP_SETTLE_MS) {
    waitUnlisted(root, seat.sessionId);
  }
  const atMs = nowMs();
  seat.held = request.pid ? { atMs, pid: Number(request.pid) } : { atMs, forMs: Number(request.forMs) };
  return { held: atMs };
}

/** A park done (spec 2.3): `parked` now, its request kept as `lastPark` until a new turn begins. */
function markParked(seat, park) {
  seat.status = "parked";
  seat.parkedAtMs = nowMs();
  seat.lastPark = { after: park.after, waiting: park.waiting };
  delete seat.kind;
  delete seat.listedAtMs;
}

/**
 * The park's stop (spec 2.3): the state file is written with the seat
 * `parked` before `claude stop` runs, so that a sender who reads it
 * meanwhile wakes the seat rather than sending into a process that is
 * stopping. A stop that fails puts the seat back to `running`, and its
 * `lastPark` is tried again by the standing request.
 */
function stopToPark(root, seats, seat, park) {
  markParked(seat, park);
  writeSeats(root, seats);
  const got = runWithEitherId("stop", seat, seat.sessionId);
  if (got.code !== 0 && !alreadyExited(got)) {
    seat.status = "running";
    delete seat.parkedAtMs;
    appendLog(root, `park: ${seat.sessionId} stop failed — ${failureText(got)}`);
    return;
  }
  appendLog(root, `park: ${seat.sessionId} stopped`);
}

/**
 * One park request, tried (spec 2.3): decided by the transcript and a fresh
 * listing, never by the seat's recorded status, which may be a pass behind.
 * A new turn since `after` voids it; until the turn has ended nothing is
 * done, and ten minutes after the request it is dropped. Once the turn has
 * ended the seat's `waiting` is set from the request, once, with the notice
 * when it goes from unset to set at a turn the human did not start. Then a
 * seat not listed is `parked`; one a tab holds stays `running`; one in the
 * background is stopped once it is `idle` and not held, and ten minutes
 * after its turn ended with no hold the request is dropped and the seat left
 * alive. A condition that cannot be read parks nothing.
 */
function tryPark(root, seats, seat, fresh) {
  const park = seat.parkRequest;
  const now = nowMs();
  const transcript = seat.transcript || findTranscript(seat.sessionId);
  const turn = transcript ? turnEnded(transcript, park.after) : null;
  if (turn?.newTurn) {
    delete seat.parkRequest;
    appendLog(root, `park: ${seat.sessionId} void — a new turn began`);
    return;
  }
  if (!turn?.ended) {
    if (now - park.atMs >= STANDING_WAIT_MS) {
      delete seat.parkRequest;
      appendLog(root, `park: ${seat.sessionId} dropped — its turn did not end`);
    }
    return;
  }
  if (park.endedAtMs === undefined) {
    park.endedAtMs = now;
    if (park.waiting && park.notice && !seat.waiting) {
      raiseNotice(`waiting: ${seat.role} ${seat.topic} — ${enterCommand(seat)}`);
    }
    if (park.waiting) seat.waiting = true;
    else delete seat.waiting;
  }
  const sessions = fresh();
  if (!sessions) return;
  const entry = sessions.find((s) => s.sessionId === seat.sessionId && s.pid);
  if (!entry) {
    delete seat.parkRequest;
    markParked(seat, park);
    appendLog(root, `park: ${seat.sessionId} parked — not listed`);
    return;
  }
  if (entry.kind === "interactive") {
    delete seat.parkRequest;
    appendLog(root, `park: ${seat.sessionId} left running — a tab holds it`);
    return;
  }
  if (seat.held) return;
  if (entry.status === "idle") {
    delete seat.parkRequest;
    stopToPark(root, seats, seat, park);
    return;
  }
  if (now - park.endedAtMs >= STANDING_WAIT_MS) {
    delete seat.parkRequest;
    appendLog(
      root,
      `park: ${seat.sessionId} dropped — ${entry.status || "no status"} ten minutes after its turn ended`,
    );
  }
}

/**
 * The standing request (spec 2.3): a seat parked at its own request and
 * listed in the background again — woken by an attach or a wake — in which
 * no new turn has begun since `lastPark.after` is stopped again, state
 * first, once it has been listed two minutes, is `idle`, and is not held:
 * its own last request carried out again, not a park on the spawner's
 * reading. A new turn ends the standing request.
 */
function standingPark(root, seats, seat, fresh) {
  const park = seat.lastPark;
  const transcript = seat.transcript || findTranscript(seat.sessionId);
  const turn = transcript ? turnEnded(transcript, park.after) : null;
  if (!turn) return;
  if (turn.newTurn) {
    delete seat.lastPark;
    delete seat.listedAtMs;
    return;
  }
  const entry = fresh()?.find((s) => s.sessionId === seat.sessionId && s.pid);
  if (!entry || entry.kind === "interactive") return;
  if (typeof seat.listedAtMs !== "number") {
    seat.listedAtMs = nowMs();
    return;
  }
  if (nowMs() - seat.listedAtMs < RELISTED_PARK_MS || entry.status !== "idle" || seat.held) return;
  appendLog(root, `park: ${seat.sessionId} listed again with no new turn`);
  stopToPark(root, seats, seat, park);
}

/**
 * Every park request, at every request pass and every census pass (spec
 * 2.3), and the standing request of every seat parked at its own word, at a
 * census pass. A listing is taken once, and only when a seat needs one;
 * `sessions` is the census's own.
 */
function tryParks(root, seats, sessions = null, census = false) {
  const due = seats.filter(
    (seat) => seat.status !== "stopped" && seat.status !== "removed" && (seat.parkRequest || (census && seat.lastPark)),
  );
  if (due.length === 0) return;
  let listed = sessions;
  const fresh = () => {
    if (!listed) {
      const listing = listAgents(root);
      if (listing.error) return null;
      listed = listing.sessions;
    }
    return listed;
  };
  for (const seat of due) {
    if (seat.parkRequest) tryPark(root, seats, seat, fresh);
    else standingPark(root, seats, seat, fresh);
  }
  writeSeats(root, seats);
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
    const listed = path.join(requestsDir(root), name);
    // Claim the request by rename before reading it, so that two spawners on
    // one root never both handle it (issue-f03b): the rename that fails is the
    // one that lost, and that spawner skips the request. A claim a crash
    // leaves behind is not retried, since a retry could spawn a seat twice.
    const file = `${listed}.${process.pid}.claimed`;
    try {
      fs.renameSync(listed, file);
    } catch {
      continue;
    }
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
      // The request's file name, less `.json`, is the id a spawned seat records (spec 1.5).
      outcome = handleRequest(root, request, seats, path.basename(name, ".json"));
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
  tryParks(root, seats);
  leavePass(root, seats);
}

/**
 * A seat `seats.json` holds as `gone` whose `sessionId` the listing holds
 * again — one the human `/stop`ped and reopened (spec 1.3). It goes back to
 * `running`, and the pass that follows sets `blocked` when the listing says
 * so, the notice with it. A seat the run's own `stop` request stopped, or
 * one removed, is never revived.
 */
function revive(root, seat) {
  seat.status = "running";
  delete seat.goneAt;
  appendLog(root, `census: ${seat.sessionId} back`);
}

/**
 * A `parked` seat the listing shows again (spec 2.7) — woken by an attach, a
 * click on its row, or a wake — is `running`, and the pass that follows
 * records its listed kind and name. Within thirty seconds of its park the
 * entry is the stopped process leaving (S-5), not a return.
 */
function relist(root, seat) {
  if (typeof seat.parkedAtMs === "number" && nowMs() - seat.parkedAtMs < STOP_SETTLE_MS) return;
  seat.status = "running";
  seat.listedAtMs = nowMs();
  delete seat.parkedAtMs;
  delete seat.midTurn;
  appendLog(root, `census: ${seat.sessionId} listed again`);
}

/**
 * A contract-2 dialogue seat the listing no longer shows (spec 2.7) — parked
 * by a pass, its tab closed, collected after its idle hour, cut by a reboot
 * — is `parked`, never `gone`: its conversation is on disk, and a wake
 * brings it back. `midTurn` marks a last turn that did not end by itself,
 * read over the whole transcript (spec 2.8), for Kanri's Recovery and
 * `tanto jokyo`.
 */
function parkByAbsence(root, seat) {
  seat.status = "parked";
  seat.parkedAtMs = nowMs();
  delete seat.kind;
  delete seat.listedAtMs;
  delete seat.waitingFor;
  if (lookForTranscript(root, seat) && turnEnded(seat.transcript)?.midTurn) seat.midTurn = true;
  else delete seat.midTurn;
  appendLog(root, `census: ${seat.sessionId} parked${seat.midTurn ? " — mid-turn" : ""}`);
}

/**
 * The census's end of a hold (spec 2.4): a launcher's mark once its pid no
 * longer answers signal 0 — a launcher that died released nothing — and a
 * mark for a face with no launcher once the seat's transcript has gone
 * unwritten for its `forMs`. A seat's standing request then parks it.
 */
function clearHold(root, seat) {
  const mark = seat.held;
  if (!mark) return;
  if (mark.pid) {
    if (pidAlive(mark.pid)) return;
  } else if (mark.forMs) {
    const transcript = seat.transcript || findTranscript(seat.sessionId);
    const writtenMs = (transcript && fs.statSync(transcript, { throwIfNoEntry: false })?.mtimeMs) || 0;
    if (nowMs() - Math.max(writtenMs, mark.atMs || 0) < mark.forMs) return;
  }
  delete seat.held;
  appendLog(root, `census: ${seat.sessionId} hold cleared`);
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
 * closed at the spawn, and what reaches here is for the human to look at. The
 * way in, `tanto <role> [<topic>]`, rides only on a seat the listing still
 * holds: a gone seat has no process to enter. A seat with no `startedAtMs`,
 * one from before this rule, is never judged. A seat whose prompt was not
 * delivered (spec 1.2) is never marked: its cause is already in its result.
 */
function noFirstTurn(root, seat, line, listed = false) {
  if (seat.noFirstTurn || seat.undelivered || typeof seat.startedAtMs !== "number") return false;
  seat.noFirstTurn = stamp();
  const where = listed ? ` — ${enterCommand(seat)}` : "";
  raiseNotice(`no first turn: ${seat.role} ${seat.topic} ${seat.name}${where}`);
  appendLog(root, line);
  return true;
}

/** One `running` or `blocked` seat against the listing's entry for it. */
function censusSeat(root, seat, session) {
  if (!session && isContractDialogue(seat)) {
    parkByAbsence(root, seat);
    return;
  }
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
  seat.kind = session.kind;
  // A prompt in the background (spec 2.6, S-1): the listing's `status:
  // "waiting"`, its cause in `waitingFor`. A seat that answered and waits is
  // `idle` and not blocked, and a prompt in a tab is in front of the human
  // already.
  const onPrompt = session.kind === "background" && session.status === "waiting";
  if (onPrompt) {
    seat.waitingFor = session.waitingFor || "waiting";
    if (seat.status !== "blocked") {
      seat.status = "blocked";
      raiseNotice(noticeText(seat));
      appendLog(root, `census: ${seat.sessionId} blocked — ${seat.waitingFor}`);
    }
  } else {
    if (seat.status === "blocked") seat.status = "running";
    delete seat.waitingFor;
  }
  if (lookForTranscript(root, seat)) return;
  if (nowMs() - seat.startedAtMs >= FIRST_TURN_WAIT_MS) {
    noFirstTurn(root, seat, `census: ${seat.sessionId} no first turn after 2m`, true);
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
    if (seat.status === "parked" && session) relist(root, seat);
    if (LIVE.includes(seat.status)) censusSeat(root, seat, session);
    clearHold(root, seat);
  }
  leavePass(root, seats, listing.sessions);
  endOnceSeats(root, seats);
  tryParks(root, seats, listing.sessions, true);
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
  // The contract this spawner keeps (spec 4.2): a launcher that finds a
  // spawner beating and no such file is talking to code from before it.
  // `tanto teishi` removes it with `pid` and `heartbeat`.
  fs.writeFileSync(path.join(spawnerDir(root), "contract"), "2\n");
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

/**
 * The seats of the run whose root is `cwd` or above it — a worktree seat's
 * cwd lies under the root — or none when no state file is found.
 */
function seatsAbove(cwd) {
  let dir = cwd ? path.resolve(cwd) : "";
  while (dir) {
    if (fs.existsSync(path.join(spawnerDir(dir), "seats.json"))) return readSeats(dir);
    const parent = path.dirname(dir);
    if (parent === dir) return [];
    dir = parent;
  }
  return [];
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
  // The way in by role for a seat the state file holds (spec 1.1); `claude
  // attach` only for a session no run of this design started.
  const seat = seatOf(seatsAbove(where), who);
  raiseNotice(`tanto: ${what} in ${where} — ${seat ? enterCommand(seat) : `claude attach ${who}`}`);
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
  // For `boundary.js seat`'s fifth word (spec 2.5).
  turnEnded,
  // For the launcher (`tanto.js`): the listing's key, the log, and the heartbeat.
  underRoot,
  appendLog,
  heartbeatPath,
  HEARTBEAT_STALE_MS,
};

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
