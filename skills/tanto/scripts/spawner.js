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
  return Array.isArray(doc && doc.seats) ? doc.seats : [];
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

function runClaude(args) {
  const command = claudeCommand(args);
  const result = spawnSync(command.file, command.args, {
    encoding: "utf8",
    windowsHide: true,
  });
  const err = result.stderr || (result.error ? String(result.error.message) : "");
  return { code: result.status === null ? 1 : result.status, out: result.stdout || "", err };
}

/** `claude agents --json --cwd <root>`, parsed. Never throws. */
function listAgents(root) {
  const got = runClaude(["agents", "--json", "--cwd", root]);
  if (got.code !== 0) {
    return { sessions: [], error: got.err.trim() || `claude agents exited ${got.code}` };
  }
  let parsed;
  try {
    parsed = JSON.parse(got.out);
  } catch {
    return { sessions: [], error: "claude agents --json did not print JSON" };
  }
  if (Array.isArray(parsed)) return { sessions: parsed };
  return { sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [] };
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
 * roster as `unavailable`, and `reading.js --share` would skip at the
 * close. Ten seconds of looking costs nothing and closes that window.
 */
function transcriptOf(sessionId) {
  for (let attempt = 0; attempt < TRANSCRIPT_POLL_TRIES; attempt++) {
    const found = findTranscript(sessionId);
    if (found) return found;
    sleepSync(TRANSCRIPT_POLL_MS);
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
 * The `--bg` command line. `request.branch` is not read here — it is
 * informational, carried through into the result and then into
 * `record --seat`'s Branch column (`boundary.js`); a worktree seat's real
 * branch is the CLI's own (Important 4, task 26; Minor 5, branch-review.md).
 */
function spawnArgs(request) {
  const args = ["--bg"];
  if (request.model) args.push("--model", request.model);
  if (request.effort) args.push("--effort", request.effort);
  args.push("--permission-mode", request.mode || "auto");
  if (request.worktree) args.push("-w", request.worktree);
  for (const dir of request.addDir || []) args.push("--add-dir", dir);
  args.push(request.prompt);
  return args;
}

/** The short id `--bg` prints, when it prints one. */
function shortIdOf(text) {
  const found = /session\s+([A-Za-z0-9][\w-]*)/i.exec(text || "");
  return found ? found[1] : null;
}

function findNew(root, before) {
  for (let attempt = 0; attempt < SPAWN_POLL_TRIES; attempt++) {
    const listing = listAgents(root);
    const fresh = listing.sessions.find((s) => s.sessionId && !before.has(s.sessionId));
    if (fresh) return fresh;
    sleepSync(SPAWN_POLL_MS);
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
    const found = listing.sessions.find((s) => s.sessionId === sessionId);
    if (found) return found;
    sleepSync(SPAWN_POLL_MS);
  }
  return null;
}

function opSpawn(root, request, seats) {
  // A transient failure here must not be swallowed into an empty `before`
  // set: `findNew` below would then adopt the first already-running session
  // it sees as the new seat (Important 9, branch-review.md).
  const listing = listAgents(root);
  if (listing.error) return { error: `claude agents: ${listing.error}` };
  const before = new Set(listing.sessions.map((s) => s.sessionId));
  const got = runClaude(spawnArgs(request));
  if (got.code !== 0) return { error: `claude --bg exited ${got.code}: ${got.err.trim()}` };
  const session = findNew(root, before);
  if (!session) {
    return {
      error:
        "claude --bg exited 0 but `claude agents --json --cwd <root>` listed no new session within 30 s — " +
        "it may have started under another cwd",
    };
  }

  // The listing's first sighting is where the ad hoc-worktree guard runs
  // (issue-aa37): a `--bg` session under a mode that gates a tool has once
  // reported its cwd under `.claude/worktrees/` with no `-w`.
  const strayRoot = path.join(root, ".claude", "worktrees");
  const stray = !request.worktree && session.cwd && session.cwd.startsWith(strayRoot);
  const id = session.id || shortIdOf(got.out);
  const startedAt = formatStartedAt(session.startedAt);
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
    status: stray ? "stopped" : "running",
  };
  seats.push(seat);
  if (stray) {
    runClaude(["stop", id || session.sessionId]);
    appendLog(root, `guard stopped ${session.sessionId} at ${session.cwd}`);
    return { error: `ad hoc worktree ${session.cwd}` };
  }
  return {
    id,
    sessionId: session.sessionId,
    name: session.name,
    cwd: session.cwd,
    transcript: transcriptOf(session.sessionId),
    startedAt,
  };
}

/** `stop` and `rm` take the short id on some builds and the long one on others. */
function runWithEitherId(verb, seat, sessionId) {
  const first = runClaude([verb, sessionId]);
  if (first.code === 0) return first;
  if (seat && seat.id && seat.id !== sessionId) {
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
    if (got.code !== 0) return { error: `claude stop: ${got.err.trim()}` };
    if (seat) seat.status = "stopped";
    return { stopped: stamp() };
  }

  if (request.op === "rm") {
    const got = runWithEitherId("rm", seat, request.sessionId);
    if (got.code !== 0) return { error: `claude rm: ${got.err.trim()}` };
    if (seat) seat.status = "removed";
    const printed = /Removed worktree (.+)/i.exec(got.out);
    return { removed: stamp(), worktree: printed ? printed[1].trim() : seat && seat.worktree };
  }

  if (request.op === "resume") {
    const got = runClaude(["--resume", request.sessionId, "--bg"]);
    if (got.code !== 0) return { error: `claude --resume: ${got.err.trim()}` };
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
    const text = String(request.message || "").replace("<id>", (seat && seat.id) || "<id>");
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
    try {
      outcome = handleRequest(root, request, seats);
    } catch (error) {
      outcome = { error: String(error && error.message) };
    }
    writeJsonAtomic(path.join(resultsDir(root), name), { ...request, ...outcome });
    fs.rmSync(file, { force: true });
    writeSeats(root, seats);
    appendLog(root, `${request.op} ${name} ${outcome.error ? `error: ${outcome.error}` : "ok"}`);
  }
}

function runCensus(root, seats) {
  const listing = listAgents(root);
  if (listing.error) {
    appendLog(root, `census: ${listing.error}`);
    return seats;
  }
  const byId = new Map(listing.sessions.filter((s) => s.sessionId).map((s) => [s.sessionId, s]));
  for (const seat of seats) {
    if (!LIVE.includes(seat.status)) continue;
    const session = byId.get(seat.sessionId);
    if (!session) {
      seat.status = "gone";
      seat.goneAt = stamp();
      appendLog(root, `census: ${seat.sessionId} gone`);
      continue;
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
  }
  writeSeats(root, seats);
  return seats;
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
      appendLog(root, `guard: ${error && error.message ? error.message : String(error)}`);
    }
  };
}

function cmdRun(argv) {
  const { values } = parseArgs(argv);
  const root = typeof values.root === "string" ? path.resolve(values.root) : process.cwd();
  // Every child this process spawns — `claude --bg` above all — must land in
  // the workspace root, never wherever the spawner itself was started from
  // (Critical 1, branch-review.md): `spawnSync` with no `cwd` inherits this
  // process's own, so fixing it here once covers `runClaude`'s every caller.
  process.chdir(root);
  ensureDirs(root);
  fs.writeFileSync(path.join(spawnerDir(root), "pid"), `${process.pid}\n`);
  const pass = guarded(root, () => {
    const seats = readSeats(root);
    takeRequests(root, seats);
    runCensus(root, seats);
  });
  pass();
  if (values.once) return 0;
  // The two intervals below and the watch callback never interleave a
  // read-modify-write of `seats.json`, because `sleepSync`'s `Atomics.wait`
  // — used by the transcript poll and by `findNew`/`findResumed` — blocks
  // this event loop for up to ~40 s per spawn or resume. Making any of those
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
    fs.watch(
      requestsDir(root),
      guarded(root, () => takeRequests(root, readSeats(root))),
    );
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

module.exports = { main, noticeCommand, handleRequest, runCensus, readSeats, spawnerDir };

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
