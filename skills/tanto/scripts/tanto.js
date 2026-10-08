// No shebang: the two wrappers beside this file are what is invoked bare,
// and they name `node` themselves. This is the human's one command — it
// starts the spawner, enters a seat by its role, stays with the human
// through a Kanri handover, and puts back what a restart took (spec 4.1 to
// 4.4). It runs the CLI's `attach` itself, and never `claude --bg`: every
// seat, its own Kanri included, goes through the spawner.

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync, spawn } = require("node:child_process");
const { loadSessions, readTranscript } = require("./reading.js");
const { readSeats, spawnerDir, underRoot, appendLog, heartbeatPath, HEARTBEAT_STALE_MS } = require("./spawner.js");
// The roster's cells, read by `boundary.js`'s own grammar, the one place a
// `\|` inside a cell is read back (roster-ledger 2.2).
const { cells } = require("./boundary.js");

const USAGE = [
  "Usage: tanto [<role>] [<topic>] [--attach | --no-attach] [--root <path>] [--timeout <ms>]",
  "       tanto fukki [--no-attach] [--root <path>] [--timeout <ms>]",
  "       tanto teishi [--seats] [--root <path>] [--timeout <ms>]",
  "       tanto jokyo [--root <path>]",
].join("\n");
const SPAWNER = path.join(__dirname, "spawner.js");
const WAIT_MS = 60000;
const POLL_MS = 250;

// The line printed before every attach (spec 4.3, C-1): ← leaves the seat
// for the agent view, and leaving that view brings the human back here,
// where the hold is released. A seat opened from the agent view carries no
// hold, and its own park at its turn's end closes that screen.
const LEAVE_LINE =
  "← or /exit leaves for the agent view, and leaving the agent view comes back here; open no seat from the agent view — tanto <role> is the way in. Leaving ends no seat, and a Kanri you /stop comes back with tanto";

// The trust hint (spec 4.3), printed before the attach line and again when
// the attach returns.
const TRUST_LINE =
  "this folder's trust is not recorded: run claude here once and answer \"Yes, I trust this folder\" — the agent view's own trust question after ← or /exit takes no input";

// The statuses under which the state file holds a Kanri (spec 2.7, 4.4). A
// Kanri is never parked, so its absence is `gone`, and a `gone` Kanri is
// resumed like a `running` or `blocked` one; a `stopped` or `removed` one is
// not. `blocked` is a prompt now, never an idle seat (spec 2.6).
const KANRI_RESUMABLE = ["running", "blocked", "gone"];
const GITIGNORE = "*\n";
const MARKDOWNLINT = "config:\n  default: false\n";

// Flags that take a value. Every other `--flag` is boolean, so a word right
// after it (`tanto --no-attach kikaku`) is never mistaken for its value
// (Minor 10, branch-review.md). `-a`, `-n`, and `-h` are the short forms of
// `--attach`, `--no-attach`, and `--help` (spec 4.1).
const VALUE_FLAGS = new Set(["timeout", "root"]);
const SHORT_FLAGS = { "-a": "attach", "-n": "no-attach", "-h": "help" };

function parseArgs(argv) {
  const values = {};
  const positionals = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (Object.hasOwn(SHORT_FLAGS, arg)) {
      values[SHORT_FLAGS[arg]] = true;
      continue;
    }
    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }
    const name = arg.slice(2);
    const next = argv[i + 1];
    if (VALUE_FLAGS.has(name) && next !== undefined && !next.startsWith("--")) {
      values[name] = next;
      i++;
    } else {
      values[name] = true;
    }
  }
  return { values, positionals };
}

function fail(message) {
  process.stderr.write(`${message}\n`);
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function sameDir(a, b) {
  const norm = (p) => path.resolve(p).replace(/\\/g, "/").replace(/\/$/, "");
  const one = norm(a);
  const two = norm(b);
  return process.platform === "win32" ? one.toLowerCase() === two.toLowerCase() : one === two;
}

/** The root, checked to be a git top level, or null with a line said. */
function resolveRoot(given) {
  const candidate = path.resolve(given || process.cwd());
  const got = spawnSync("git", ["-C", candidate, "rev-parse", "--show-toplevel"], {
    encoding: "utf8",
    windowsHide: true,
  });
  if (got.status !== 0) {
    fail(`tanto: ${candidate} is not inside a git repository`);
    return null;
  }
  if (!sameDir(got.stdout.trim(), candidate)) {
    fail(`tanto: ${candidate} is not a git repository's top level (${got.stdout.trim()} is)`);
    return null;
  }
  return candidate;
}

/** The root `--root` names, or the working directory, checked as `resolveRoot` checks it (spec 4.1). */
function rootOf(values) {
  return resolveRoot(typeof values.root === "string" ? values.root : undefined);
}

let claudeFile = null;

/**
 * `claude`, resolved to a path once (spec 4.3, P-6): the attach runs with no
 * shell, and on Windows the path `where claude` gives is the one measured.
 * The bare name elsewhere, and when nothing is found.
 */
function claudePath() {
  if (claudeFile === null) {
    const found =
      process.platform === "win32" ? spawnSync("where", ["claude"], { encoding: "utf8", windowsHide: true }) : null;
    const lines = (found?.status === 0 ? found.stdout : "").split(/\r?\n/).map((line) => line.trim());
    claudeFile = lines.find((line) => /\.exe$/i.test(line)) || "claude";
  }
  return claudeFile;
}

function claudeCommand(args) {
  const viaNode = process.env.TANTO_CLAUDE_NODE;
  if (viaNode) return { file: process.execPath, args: [viaNode, ...args] };
  return { file: process.env.TANTO_CLAUDE || claudePath(), args };
}

/**
 * `claude agents --json`, parsed, keeping the entries whose listed `cwd` is
 * the root or under it — the spawner's own key (`underRoot`, spec 2.3), so
 * that `tanto` never writes a `resume` for a live seat, shoki's in its
 * worktree above all, that it failed to list. `sessions` is `null` on a
 * non-zero exit or unparseable output, never `[]` — a real empty listing and
 * a failed one used to look the same to every caller, which resumed or
 * re-spawned a seat the CLI simply failed to report on (Important 5,
 * branch-review.md). `error` then carries the reason to show the human.
 */
function listAgents(root) {
  const command = claudeCommand(["agents", "--json"]);
  const got = spawnSync(command.file, command.args, { encoding: "utf8", windowsHide: true });
  if (got.status !== 0) {
    return { sessions: null, error: (got.stderr || "").trim() || `claude agents exited ${got.status}` };
  }
  try {
    const parsed = JSON.parse(got.stdout || "");
    const sessions = Array.isArray(parsed) ? parsed : Array.isArray(parsed.sessions) ? parsed.sessions : [];
    return { sessions: sessions.filter((s) => underRoot(root, s?.cwd)), error: null };
  } catch {
    return { sessions: null, error: "claude agents --json did not print JSON" };
  }
}

/** The most recent modification time of `file`, or `null` if it is absent. */
function statMtimeMs(file) {
  try {
    return fs.statSync(file).mtimeMs;
  } catch {
    return null;
  }
}

/** The `.json` files under `dir` whose mtime is after `sinceMs`, name order. */
function jsonFilesNewerThan(dir, sinceMs) {
  let names;
  try {
    names = fs.readdirSync(dir).filter((n) => n.endsWith(".json"));
  } catch {
    return [];
  }
  return names.filter((name) => {
    const mtime = statMtimeMs(path.join(dir, name));
    return mtime !== null && mtime > sinceMs;
  });
}

/**
 * A `kanri` `spawn` already in flight or already done: a `seats.json` row
 * distinct from the outgoing Kanri (`outgoingSessionId`, the roster's own
 * current row) that is still `running`/`blocked` and still present in the
 * live listing (`byId`), or a still-pending request under `requests/`, or
 * its result under `results/`, newer than the handover file's own mtime.
 * Any of the three means a successor already exists, and writing a second
 * spawn request would raise two Kanris on the same handover (R-12,
 * Important 2, branch-review.md).
 *
 * The first round of this fix keyed the `seats.json` check on the *file's*
 * mtime, which was wrong: the resident's own ~15s census rewrites
 * `seats.json` unconditionally, so within the whole handover window (a
 * minute or more) the file is always "newer" than the handover, and the
 * first running/blocked `kanri` row found was the OUTGOING Kanri itself —
 * suppressing the very successor spawn this function exists to protect, in
 * every real handover (Critical, branch-review.md, fix round 2). Excluding
 * `outgoingSessionId` by identity needs no timestamp at all for this check.
 * The live-listing cross-check guards the other direction: a `seats.json`
 * row the CLI no longer lists is not trusted as an attachable id directly —
 * the "every other seat" resume loop a few lines below `cmdUp` exists for
 * that (Important 1, branch-review.md, fix round 2).
 */
function kanriSuccessor(root, handoverMtimeMs, seats, byId, outgoingSessionId) {
  const candidate = seats.find(
    (s) =>
      s.role === "kanri" && (s.status === "running" || s.status === "blocked") && s.sessionId !== outgoingSessionId,
  );
  if (candidate && byId.has(candidate.sessionId)) {
    return { attach: candidate.id || candidate.sessionId };
  }
  const requestsPath = path.join(spawnerDir(root), "requests");
  for (const name of jsonFilesNewerThan(requestsPath, handoverMtimeMs).sort()) {
    let body;
    try {
      body = JSON.parse(fs.readFileSync(path.join(requestsPath, name), "utf8"));
    } catch {
      continue;
    }
    if (body && body.op === "spawn" && body.role === "kanri") {
      return { waitId: name.slice(0, -".json".length) };
    }
  }
  const resultsPath = path.join(spawnerDir(root), "results");
  for (const name of jsonFilesNewerThan(resultsPath, handoverMtimeMs).sort()) {
    let body;
    try {
      body = JSON.parse(fs.readFileSync(path.join(resultsPath, name), "utf8"));
    } catch {
      continue;
    }
    if (body && body.op === "spawn" && body.role === "kanri" && !body.error) {
      return { attach: body.id || body.sessionId };
    }
  }
  return null;
}

/** Write each of the two workspace files only when it is absent. */
function ensureWorkspace(root) {
  fs.mkdirSync(path.join(root, ".tanto"), { recursive: true });
  const files = [
    [path.join(root, ".tanto", ".gitignore"), GITIGNORE],
    [path.join(root, ".tanto", ".markdownlint-cli2.yaml"), MARKDOWNLINT],
  ];
  for (const [file, body] of files) {
    if (!fs.existsSync(file)) fs.writeFileSync(file, body);
  }
  fs.mkdirSync(path.join(spawnerDir(root), "requests"), { recursive: true });
  fs.mkdirSync(path.join(spawnerDir(root), "results"), { recursive: true });
}

function pidPath(root) {
  return path.join(spawnerDir(root), "pid");
}

/**
 * `.tanto/spawner/contract`, which a spawner of this design writes at its
 * start, holding `2`, and `tanto teishi` removes with `pid` and `heartbeat`
 * (spec 4.2). A spawner that beats and wrote none runs older code.
 */
function contractPath(root) {
  return path.join(spawnerDir(root), "contract");
}

/** The PID `.tanto/spawner/pid` records, or null. */
function recordedPid(root) {
  try {
    return Number(fs.readFileSync(pidPath(root), "utf8").trim()) || null;
  } catch {
    return null;
  }
}

function pidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/** The heartbeat's epoch milliseconds — `NaN` when it does not parse — or null when there is no file. */
function heartbeatMs(root) {
  try {
    return Number(fs.readFileSync(heartbeatPath(root), "utf8").trim());
  } catch {
    return null;
  }
}

/**
 * The PID of a spawner that is alive and working, or null (spec 4.2): the
 * PID in `pid` answers `process.kill(pid, 0)` and the heartbeat is within
 * `HEARTBEAT_STALE_MS` of now. A PID alone proves nothing — a spawner that
 * died leaves its file, and the system gives the number to another process
 * (issue-73d6) — and a missing heartbeat, a spawner on the code before it,
 * reads as stale.
 */
function liveSpawner(root) {
  const pid = recordedPid(root);
  if (!pid || !pidAlive(pid)) return null;
  const beat = heartbeatMs(root);
  return beat !== null && Math.abs(Date.now() - beat) <= HEARTBEAT_STALE_MS ? pid : null;
}

function removeSpawnerFiles(root) {
  for (const file of [pidPath(root), heartbeatPath(root), contractPath(root)]) {
    try {
      fs.rmSync(file, { force: true });
    } catch {
      // Nothing to remove is the ordinary case here.
    }
  }
}

function noHeartbeatLine(pid) {
  return `spawner pid ${pid} has no heartbeat — a spawner from before the heartbeat, or a reused pid; end it by hand if it is the spawner: taskkill /PID ${pid} (kill ${pid})\n`;
}

function startSpawner(root) {
  if (liveSpawner(root)) return false;
  // A live PID behind a stale heartbeat is never signalled: it may be any
  // process by now (spec 4.2, D-4). A real spawner left so runs beside the
  // new one until the next `tanto teishi`. Both claim a request by rename, so
  // none is handled twice — except by a spawner started before that claim
  // (issue-f03b), which a PID with no heartbeat file is the sign of, and
  // which the line printed here makes visible.
  const stale = recordedPid(root);
  if (stale && pidAlive(stale)) {
    appendLog(root, `stale spawner pid ${stale} ignored`);
    if (heartbeatMs(root) === null) process.stdout.write(noHeartbeatLine(stale));
  }
  const log = fs.openSync(path.join(spawnerDir(root), "log"), "a");
  const child = spawn(process.execPath, [SPAWNER, "run", "--root", root], {
    cwd: root,
    detached: true,
    stdio: ["ignore", log, log],
    windowsHide: true,
  });
  child.unref();
  // The new spawner satisfies this at its first pass, which beats first.
  for (let i = 0; i < 40 && !liveSpawner(root); i++) sleepSync(POLL_MS);
  return true;
}

function writeRequest(root, body) {
  const id = `${new Date().toISOString().replace(/[:.]/g, "-")}-${Math.random().toString(36).slice(2, 8)}`;
  const file = path.join(spawnerDir(root), "requests", `${id}.json`);
  fs.writeFileSync(`${file}.tmp`, `${JSON.stringify(body, null, 2)}\n`);
  fs.renameSync(`${file}.tmp`, file);
  return id;
}

function waitForResult(root, id, waitMs) {
  const file = path.join(spawnerDir(root), "results", `${id}.json`);
  const until = Date.now() + waitMs;
  while (Date.now() < until) {
    try {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      sleepSync(POLL_MS);
    }
  }
  return null;
}

/**
 * The roster's first data row, or null: its cells read through
 * `boundary.js`'s `cells()`, so that a `\|` inside a cell moves no column
 * (roster-ledger 2.2).
 */
function firstRosterRow(root) {
  let lines;
  try {
    lines = fs.readFileSync(path.join(root, ".tanto", "roster.md"), "utf8").split(/\r?\n/);
  } catch {
    return null;
  }
  const head = lines.findIndex((line) => /^\|\s*Role\s*\|/.test(line));
  if (head === -1) return null;
  const row = lines[head + 2];
  if (!row?.startsWith("|")) return null;
  const found = cells(row);
  if (found.length < 11) return null;
  return { name: found[2], status: found[9], sessionId: path.basename(found[10], ".jsonl") };
}

/** Every data row of the roster as `{ role, status, sessionId }`, or `[]` (spec 4.7). */
function rosterRows(root) {
  let lines;
  try {
    lines = fs.readFileSync(path.join(root, ".tanto", "roster.md"), "utf8").split(/\r?\n/);
  } catch {
    return [];
  }
  const head = lines.findIndex((line) => /^\|\s*Role\s*\|/.test(line));
  if (head === -1) return [];
  const rows = [];
  for (const line of lines.slice(head + 2)) {
    if (!line.startsWith("|")) break;
    const found = cells(line);
    if (found.length < 11) continue;
    rows.push({ role: found[0], status: found[9], sessionId: path.basename(found[10], ".jsonl") });
  }
  return rows;
}

/**
 * The one line an old-shape roster earns (spec 4.7), read once at a start: a
 * live or queued row whose session the state file has no seat for belongs to
 * the old contract. A `cleared` row is no word of the roster's, and
 * `migrate`'s to move to the archive (roster-ledger 1.3, 2.2). The line
 * informs and asks for no act.
 */
function oldShapeLine(root, seats) {
  const known = new Set(seats.map((s) => s.sessionId));
  const old = rosterRows(root).filter((row) => /^(live|queued)/.test(row.status) && !known.has(row.sessionId));
  if (old.length === 0) return;
  const roles = [...new Set(old.map((row) => row.role))].join(", ");
  process.stdout.write(
    `old-contract rows in .tanto/roster.md (${roles}): those windows are no longer seats of this run — see the README, "Moving a run"\n`,
  );
}

/**
 * The trust hint, or null (spec 4.3). `.claude.json` is
 * `$CLAUDE_CONFIG_DIR/.claude.json` when that variable is set and
 * `~/.claude.json` otherwise; its key for this folder is the root as `tanto`
 * resolved it, every `\` turned into `/` and the drive letter as given —
 * the key the CLI in the same terminal looks up. A missing or unparsable
 * file prints nothing, and `tanto` never writes the file.
 */
function trustHint(root) {
  const dir = process.env.CLAUDE_CONFIG_DIR;
  const file = dir ? path.join(dir, ".claude.json") : path.join(os.homedir(), ".claude.json");
  let config;
  try {
    config = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
  const project = config?.projects?.[root.replace(/\\/g, "/")];
  return project?.hasTrustDialogAccepted === true ? null : TRUST_LINE;
}

/**
 * The seat whose short id or `sessionId` is `id`, as the state file and a
 * fresh listing know it now: its `sessionId`, its listed name and `kind`,
 * and the state file's record (`seat`, undefined when it holds none).
 */
function seatAt(root, id) {
  const seat = readSeats(root).find((s) => s.id === id || s.sessionId === id);
  const sessions = listAgents(root).sessions || [];
  const sessionId = seat?.sessionId || sessions.find((s) => s.id === id || s.sessionId === id)?.sessionId || id;
  const entry = sessions.find((s) => s.sessionId === sessionId && s.pid);
  return { sessionId, name: entry?.name || seat?.name, kind: entry?.kind, seat };
}

/** A seat's size as `reading.js` reads it (spec 4.3, D-19), or null when its transcript is not found. */
function seatContext(seat) {
  if (!seat?.transcript) return null;
  try {
    return readTranscript(seat.transcript).context;
  } catch {
    return null;
  }
}

/** The refusal for a seat a tab holds (spec 4.3): a seat is in one place at a time. */
function inTab(role) {
  return say(`${role} is open in a VS Code tab; close the tab and run this again`, 1);
}

/** What a seat is doing, the third column of `jokyo` (spec 4.5); `entry` is its listing entry. */
function doingOf(seat, entry) {
  if (entry?.kind === "interactive") return seat.waiting ? "in a tab — waiting for you" : "in a tab";
  if (entry?.status === "waiting") return entry.waitingFor ? `blocked — ${entry.waitingFor}` : "blocked";
  if (entry) return entry.status === "busy" ? "working" : "idle";
  if (seat.status !== "parked") return "gone";
  if (seat.midTurn) return "parked — mid-turn";
  return seat.waiting ? "parked — waiting for you" : "parked";
}

/**
 * The run's seats, one line each (spec 4.5): every seat the state file holds
 * that is not `stopped` or `removed`, Kanri first, with what it is doing, a
 * dialogue seat's `context=`, and the command for a line that waits on the
 * human — `tanto <role>`, with the topic when two seats share the role, and
 * `tanto fukki` for a `gone` Kanri and a topic seat's cut turn. A `gone`
 * Jisso gets none: it is woken when its batch is due.
 */
function seatLines(seats, sessions) {
  const listed = new Map(sessions.filter((s) => s.sessionId && s.pid).map((s) => [s.sessionId, s]));
  const shown = seats.filter((s) => s.status !== "stopped" && s.status !== "removed");
  shown.sort((a, b) => Number(b.role === "kanri") - Number(a.role === "kanri"));
  const cell = (text, width) => `${text} `.padEnd(width);
  return shown.map((seat) => {
    const doing = doingOf(seat, listed.get(seat.sessionId));
    const context = DIALOGUE_ROLES.includes(seat.role) ? seatContext(seat) : null;
    const topicSeat = Boolean(seat.topic) && seat.topic !== "—";
    const twin = shown.some((s) => s !== seat && s.role === seat.role);
    const enter = `tanto ${seat.role}${twin && topicSeat ? ` ${seat.topic}` : ""}`;
    let command = "";
    if (doing.startsWith("blocked") || doing === "parked — waiting for you") command = enter;
    if (doing === "gone" && seat.role === "kanri") command = "tanto fukki";
    if (doing === "parked — mid-turn") command = topicSeat ? "tanto fukki" : enter;
    const size = context === null ? "" : `context=${context}`;
    return `${cell(seat.role, 9)}${cell(seat.topic || "—", 18)}${cell(doing, 31)}${cell(size, 17)}${command}`.trimEnd();
  });
}

/** Print the run's seats (spec 4.5); a listing that cannot be read is said, and every seat read as unlisted. */
function printSeats(root) {
  const listing = listAgents(root);
  if (listing.sessions === null) fail(`tanto: claude agents failed — ${listing.error}`);
  for (const line of seatLines(readSeats(root), listing.sessions || [])) process.stdout.write(`${line}\n`);
}

// How long the follow waits for the spawner to record the Kanri just left as
// stopped: its `stop` ends the attach, and the state file is written a moment
// after the command returns (spawner.js takeRequests), so a read at the
// attach's exit can be a moment early (spec 4.3, step 5).
const FOLLOW_SETTLE_MS = 5000;

/**
 * The successor of the Kanri just left (spec 4.3, step 5): none unless the
 * state file now holds that Kanri `stopped`, read for up to
 * `FOLLOW_SETTLE_MS` while the roster's first row or a handover file says a
 * handover is in progress; then the roster's first row when it names another
 * session, or the handover spawn `kanriSuccessor` finds, waited for up to
 * `waitMs`. `{ id }`, `{ code }` with the line said, or null.
 */
function successorOf(root, outgoing, sinceMs, waitMs) {
  const row = firstRosterRow(root);
  // A handover in progress shows in the roster's first row or the handover
  // file before the stop lands; with neither, a human leaving a live Kanri
  // waits for nothing.
  const handingOver =
    (row && row.sessionId !== outgoing) || fs.existsSync(path.join(root, ".tanto", "kanri-handover.md"));
  let seats = readSeats(root);
  const stopped = () => seats.find((s) => s.sessionId === outgoing)?.status === "stopped";
  for (const until = Date.now() + FOLLOW_SETTLE_MS; handingOver && !stopped() && Date.now() < until; ) {
    sleepSync(POLL_MS);
    seats = readSeats(root);
  }
  if (!stopped()) return null;
  if (row && row.sessionId !== outgoing) {
    return { id: seats.find((s) => s.sessionId === row.sessionId)?.id || row.sessionId };
  }
  const sessions = listAgents(root).sessions || [];
  const byId = new Map(sessions.filter((s) => s.sessionId && s.pid).map((s) => [s.sessionId, s]));
  const handoverMs = statMtimeMs(path.join(root, ".tanto", "kanri-handover.md"));
  const found = kanriSuccessor(root, Math.min(sinceMs, handoverMs ?? sinceMs), seats, byId, outgoing);
  if (found?.attach) return { id: found.attach };
  if (!found?.waitId) return null;
  const result = waitForResult(root, found.waitId, waitMs);
  if (!result || result.error) {
    fail(`tanto: the successor Kanri did not start — ${result ? result.error : "no result; see .tanto/spawner/log"}`);
    return { code: 1 };
  }
  return { id: result.id || result.sessionId };
}

/**
 * Enter the seat whose short id is `id` (spec 4.3) and return the exit code.
 * A dialogue seat is held while the human is in it, since the listing does
 * not show an attach; any other seat is refused when a tab holds it. When
 * the seat left is a Kanri that has ended and a successor exists, the
 * successor is entered with nothing typed; otherwise the run's seats are
 * printed once. The decision is read from the files, never from the
 * attach's exit code: a stopped session ends an attach with 0 (H-1b).
 */
function enterSeat(root, firstId, role, waitMs) {
  let id = firstId;
  for (;;) {
    const seat = seatAt(root, id);
    const topic = seat.seat?.topic || "—";
    const dialogue = DIALOGUE_ROLES.includes(role);
    let held = false;
    if (dialogue) {
      const hold = { op: "hold", role, topic, sessionId: seat.sessionId, pid: process.pid };
      const result = waitForResult(root, writeRequest(root, hold), waitMs);
      if (!result) {
        fail("tanto: the spawner wrote no result for the hold request; see .tanto/spawner/log");
        return 1;
      }
      const error = result.error || "";
      if (error.includes("in a tab")) return inTab(role);
      if (error.includes("held by another terminal")) return say(`${role} is held by another terminal`, 1);
      // A seat spawned without the contract's mark is entered unheld, as
      // before this design.
      if (error && !error.includes("old-contract seat")) {
        fail(`tanto: the hold on ${role} failed — ${error}`);
        return 1;
      }
      held = !error;
    } else if (seat.kind === "interactive") {
      return inTab(role);
    }
    const hint = trustHint(root);
    const context = dialogue ? seatContext(seat.seat) : null;
    const named = topic === "—" ? role : `${role} ${topic}`;
    const contextLine = context !== null ? `${named} — context=${context}` : null;
    // The attach takes the screen with no scrollback, so a line printed here
    // flashes by (acceptance scene, step 2): each is printed again when the
    // attach returns, where the human is looking.
    const before = [hint, contextLine, LEAVE_LINE].filter(Boolean);
    process.stdout.write(`${before.join("\n")}\n`);
    const attachedAtMs = Date.now();
    const command = claudeCommand(["attach", id]);
    spawnSync(command.file, command.args, { cwd: root, stdio: "inherit" });
    const after = [hint, contextLine ? `left ${contextLine}` : null].filter(Boolean);
    if (after.length > 0) process.stdout.write(`${after.join("\n")}\n`);
    if (held) writeRequest(root, { op: "release", role, topic, sessionId: seat.sessionId });
    const next = role === "kanri" ? successorOf(root, seat.sessionId, attachedAtMs, waitMs) : null;
    if (next?.code !== undefined) return next.code;
    if (!next?.id || next.id === id) {
      printSeats(root);
      return 0;
    }
    id = next.id;
  }
}

/** `--no-attach` (spec 4.1): the seat's name and the ways in, and nothing entered. */
function sayWaysIn(root, id, role) {
  const seat = seatAt(root, id);
  const topic = seat.seat?.topic && seat.seat.topic !== "—" ? ` ${seat.seat.topic}` : "";
  const click = DIALOGUE_ROLES.includes(role)
    ? ", or by a click on its row in the editor's list after Developer: Reload Window"
    : "";
  return say(`${role}${topic} ${seat.name || id} — enter it with tanto ${role}${topic}${click}`, 0);
}

/** The branch the shared tree is on, which the request schema asks for. */
function branchOf(root) {
  const got = spawnSync("git", ["-C", root, "rev-parse", "--abbrev-ref", "HEAD"], {
    encoding: "utf8",
    windowsHide: true,
  });
  return got.status === 0 ? got.stdout.trim() : "";
}

/** A line said to the human on stdout, and the exit code that goes with it. */
function say(line, code) {
  process.stdout.write(`${line}\n`);
  return code;
}

// The seats whose turns may end on a question to the human (spec, Words).
const DIALOGUE_ROLES = ["sekkei", "keikaku", "kikaku", "hosa", "kaiseki"];

// What the launcher says when an act needs more than this run can give
// (spec 4.2): a spawner from before the `contract` file is asked for no
// request, and a run whose Kanri read the old text addresses no new seat.
const OLDER_SPAWNER = "the spawner is older than this launcher: run tanto teishi, then tanto";
const OLD_CONTRACT = 'this run is on the old contract — move it first: README, "Moving a run"';

/**
 * A `spawn` request under this contract (spec 1.1): every one the launcher
 * writes carries `contract: 2`, which the spawner records on the seat.
 */
function spawnRequest(root, sessions, role, prompt) {
  const seat = sessions[role] || {};
  return {
    op: "spawn",
    role,
    topic: "—",
    model: seat.model,
    effort: seat.effort,
    branch: branchOf(root),
    mode: "auto",
    prompt,
    contract: 2,
  };
}

/**
 * The Kanri spawn. When the state file still holds a Kanri — the outgoing one
 * of a handover, or one whose resume failed — the request names it as the
 * holder it `succeeds`, which the spawner's one-holder rule lets through
 * (spec 1.2).
 */
function kanriRequest(root, sessions, outgoing) {
  const request = spawnRequest(root, sessions, "kanri", "/tanto kanri");
  return outgoing && KANRI_RESUMABLE.includes(outgoing.status) ? { ...request, succeeds: outgoing.sessionId } : request;
}

/**
 * The Kanri the spawner holds, entered when the roster's first row does not
 * name it (roster-ledger 6): the line first; then an attach when the listing
 * shows it, and otherwise the one `resume` with the fukki word, since the
 * one-holder rule counts a `gone` Kanri, which has nothing to attach to.
 * Never a spawn. `{ attach, resumed }`, or `{ code }` with the line said.
 */
function enterHeldKanri(root, sessionId, byId, older, waitMs) {
  process.stdout.write(
    `tanto: the roster's first row does not name the Kanri the spawner holds, ${sessionId}; entering it — run boundary.js roster show\n`,
  );
  const listed = byId.get(sessionId);
  if (listed?.kind === "interactive") return { code: inTab("kanri") };
  if (listed) return { attach: listed.id || sessionId, resumed: false };
  if (older) return { code: say(OLDER_SPAWNER, 1) };
  const request = { op: "resume", role: "kanri", topic: "—", sessionId, prompt: "/tanto fukki" };
  const result = waitForResult(root, writeRequest(root, request), waitMs);
  if (!result) {
    fail("tanto: the spawner wrote no result for the Kanri request; see .tanto/spawner/log");
    return { code: 1 };
  }
  if (result.error) {
    fail(`tanto: the Kanri resume failed — ${result.error}`);
    return { code: 1 };
  }
  return { attach: result.id || result.sessionId, resumed: true };
}

/**
 * Whether the state file holds `seat` (spec, Words): `running`, `blocked`,
 * or `parked` — or `gone`, for a seat that is not a dialogue seat.
 */
function isHeld(seat) {
  if (["running", "blocked", "parked"].includes(seat.status)) return true;
  return seat.status === "gone" && !DIALOGUE_ROLES.includes(seat.role);
}

/**
 * Whether the run has moved (spec 4.2): the Kanri the state file holds is a
 * contract-2 seat, or it holds none — the next Kanri is then the launcher's
 * own spawn, which carries the mark.
 */
function runMoved(seats) {
  return seats.filter((s) => s.role === "kanri" && KANRI_RESUMABLE.includes(s.status)).every((s) => s.contract === 2);
}

/**
 * The seat `tanto <role> [<topic>]` enters, for every role but Kanri (spec
 * 4.2): `{ attach }` with its short id — a held seat's, or that of the
 * Kikaku, Hosa, or standalone Kaiseki spawned when none is held, waited for
 * up to `waitMs` — or `{ code }` with the line already said.
 */
function enterRole(root, sessions, role, topic, seats, older, waitMs) {
  if (older) return { code: say(OLDER_SPAWNER, 1) };
  const held = seats.filter((s) => s.role === role && isHeld(s));
  const ofTopic = topic && role !== "kikaku" && role !== "hosa" ? held.filter((s) => s.topic === topic) : held;
  // Kanri never addresses a Kikaku or a standalone Kaiseki, so a run that
  // has not moved may still start or enter one; every other seat waits for
  // the move.
  const attached = role === "kaiseki" && Boolean(topic || (ofTopic.length === 1 && ofTopic[0].topic !== "—"));
  if (!runMoved(seats) && role !== "kikaku" && (role !== "kaiseki" || attached)) return { code: say(OLD_CONTRACT, 1) };
  if (ofTopic.length > 1) {
    fail(`tanto: ${ofTopic.length} ${role} seats are held — name the topic:`);
    for (const seat of ofTopic) fail(`  tanto ${role} ${seat.topic}`);
    return { code: 2 };
  }
  if (ofTopic.length === 1) return { attach: ofTopic[0].id || ofTopic[0].sessionId };
  if (role !== "kikaku" && role !== "hosa" && (role !== "kaiseki" || topic)) {
    return { code: say(`no ${role}${topic ? ` ${topic}` : ""} is held; Kanri starts one — tanto kanri`, 1) };
  }
  const result = waitForResult(root, writeRequest(root, spawnRequest(root, sessions, role, `/tanto ${role}`)), waitMs);
  if (!result) {
    fail(`tanto: the spawner wrote no result for the ${role} request; see .tanto/spawner/log`);
    return { code: 1 };
  }
  if (result.error) {
    fail(`tanto: the ${role} spawn failed — ${result.error}`);
    return { code: 1 };
  }
  return { attach: result.id || result.sessionId };
}

function cmdUp(values, role, topic, word) {
  const root = rootOf(values);
  if (!root) return 2;
  const waitMs = values.timeout ? Number(values.timeout) : WAIT_MS;
  const sessions = loadSessions(root);
  // Read before the spawner wakes: its own startup census reacts to the same
  // "missing from the listing" signal by marking a seat gone, which would
  // race this decision if seats.json were read after startSpawner below.
  const seats = readSeats(root);
  ensureWorkspace(root);
  // A spawner that was beating already and wrote no `contract` runs code
  // from before this design (spec 4.2): it is asked for no request of this
  // design, and `fukki` is nothing but requests.
  const older = !startSpawner(root) && !fs.existsSync(contractPath(root));
  if (older && word === "fukki") return say(OLDER_SPAWNER, 1);

  const listing = listAgents(root);
  if (listing.sessions === null) {
    fail(`tanto: claude agents failed — ${listing.error}`);
    return 1;
  }
  // An entry counts by its `pid` alone: the listing's `state` is a field
  // nothing reads any more (spec 2.6).
  const byId = new Map(listing.sessions.filter((s) => s.sessionId && s.pid).map((s) => [s.sessionId, s]));
  oldShapeLine(root, seats);
  const handoverFile = path.join(root, ".tanto", "kanri-handover.md");
  const handover = fs.existsSync(handoverFile);
  const row = firstRosterRow(root);
  const listed = row ? byId.get(row.sessionId) : null;
  // Step 4's own seats.json check, before it decides spawn against resume: a
  // first row the listing has lost but seats.json still holds as running or
  // blocked is the reboot or crash case (spec 1.8), and it is resumed. Spawning
  // instead would leave two Kanris — the old one resumed by the loop below, the
  // new one stopping itself as the Second Kanri case. With no roster row at
  // all — a Kanri that crashed before writing one — the same seats.json row
  // is found directly by role, or this same crash is what the roster-driven
  // branches above can never see, and the loop below would resume it a
  // second time on top of this one (Important 7, branch-review.md).
  // A `gone` Kanri is one the human `/stop`ped, or one that crashed while the
  // spawner ran, and it is resumed like a `running` one (spec 4.4); a
  // `stopped` one — after `tanto teishi --seats`, or a handover — is not.
  // A first row whose sessionId neither the listing nor the state file holds
  // — a cell whose separators were lost, a row of a run the state file no
  // longer holds — names no Kanri: the state file's is found by role, as with
  // no row at all, and entered with the held line (roster-ledger 6).
  const named = Boolean(row && (byId.has(row.sessionId) || seats.some((s) => s.sessionId === row.sessionId)));
  const held = named
    ? seats.find((s) => s.sessionId === row.sessionId)
    : seats.find((s) => s.role === "kanri" && KANRI_RESUMABLE.includes(s.status));
  const kanriHeld = Boolean(held && KANRI_RESUMABLE.includes(held.status));
  const unnamed = row && !named && kanriHeld ? held : null;
  // A handover in progress: look for the successor before writing a second
  // spawn request for one that already exists (R-12, Important 2).
  const handoverMtimeMs = handover ? statMtimeMs(handoverFile) : null;
  const successor =
    handover && handoverMtimeMs !== null
      ? kanriSuccessor(root, handoverMtimeMs, seats, byId, row ? row.sessionId : null)
      : null;

  let attach = null;
  let resumed = 0;
  // The Kanri a `held:` answer entered, which the resume loop below leaves to
  // that entry (roster-ledger 6).
  let entered = null;
  if (role !== "kanri") {
    const entry = enterRole(root, sessions, role, topic, seats, older, waitMs);
    if (entry.code !== undefined) return entry.code;
    attach = entry.attach;
  } else if (!handover && listed && row.status.startsWith("live") && listed.kind === "background") {
    attach = listed.id || row.sessionId;
  } else if (!handover && listed && row.status.startsWith("live")) {
    return inTab("kanri");
  } else if (successor?.attach) {
    attach = successor.attach;
  } else if (successor?.waitId) {
    const result = waitForResult(root, successor.waitId, waitMs);
    if (!result) {
      fail("tanto: the spawner wrote no result for the Kanri request; see .tanto/spawner/log");
      return 1;
    }
    if (result.error) {
      fail(`tanto: the Kanri spawn failed — ${result.error}`);
      return 1;
    }
    attach = result.id || result.sessionId;
  } else if (!handover && unnamed) {
    // The first row names no Kanri the run holds (roster-ledger 6, a14f's
    // second occurrence): the state file's Kanri is entered, and no new one
    // is spawned.
    const entry = enterHeldKanri(root, unnamed.sessionId, byId, older, waitMs);
    if (entry.code !== undefined) return entry.code;
    attach = entry.attach;
    if (entry.resumed) resumed += 1;
  } else {
    // A Kanri the listing does not hold needs a resume or a spawn, neither of
    // which an older spawner is asked for (spec 4.2).
    if (older) return say(OLDER_SPAWNER, 1);
    let request =
      !handover && !listed && kanriHeld
        ? {
            op: "resume",
            role: held.role || "kanri",
            topic: held.topic,
            sessionId: row ? row.sessionId : held.sessionId,
            // The fukki word, carried by the one resume that may carry a
            // prompt (spec 2.5, 4.4): a Kanri this launcher resumed runs its
            // Recovery with nothing typed.
            prompt: "/tanto fukki",
          }
        : kanriRequest(root, sessions, held);
    let result = waitForResult(root, writeRequest(root, request), waitMs);
    if (result?.error && request.op === "resume") {
      fail(`tanto: the Kanri resume failed — ${result.error}; spawning a new Kanri`);
      request = kanriRequest(root, sessions, held);
      result = waitForResult(root, writeRequest(root, request), waitMs);
    }
    // The spawner holds a Kanri the first row does not name (roster-ledger 6,
    // f07a): that Kanri is entered and no second spawn request is written.
    // During a handover the spawn is the successor's, and the holder it
    // names is a second Kanri, which stays refused.
    const holder = !handover && request.op === "spawn" ? /^held: (\S+)/.exec(result?.error || "") : null;
    if (holder) {
      const entry = enterHeldKanri(root, holder[1], byId, false, waitMs);
      if (entry.code !== undefined) return entry.code;
      attach = entry.attach;
      entered = { sessionId: holder[1] };
      if (entry.resumed) resumed += 1;
    } else {
      if (!result) {
        fail("tanto: the spawner wrote no result for the Kanri request; see .tanto/spawner/log");
        return 1;
      }
      if (result.error) {
        fail(`tanto: the Kanri ${request.op} failed — ${result.error}`);
        return 1;
      }
      attach = result.id || result.sessionId;
      if (request.op === "resume") resumed += 1;
    }
  }

  // What a restart took is put back on the Kanri path alone — a bare `tanto`
  // and `tanto fukki` — and `fukki` then tells Kanri (spec 4.4).
  if (role === "kanri" && !older) {
    resumeLost(root, seats, byId, [entered, held]);
    if (word === "fukki") tellKanri(root, sessions, attach, resumed > 0, runMoved(seats), waitMs);
  }

  if (values["no-attach"]) return sayWaysIn(root, attach, role);
  return enterSeat(root, attach, role, waitMs);
}

function cmdTeishi(values) {
  const root = rootOf(values);
  if (!root) return 2;
  const waitMs = values.timeout ? Number(values.timeout) : WAIT_MS;

  // A failed or timed-out stop used to be indistinguishable from success —
  // waitForResult was called for its side effect only, so the pidfile was
  // removed and "spawner stopped" printed over a seat that never stopped
  // (Important 6, branch-review.md). Every result is now checked, and the
  // command fails loudly instead.
  let seatsFailed = false;
  if (values.seats) {
    const stops = [];
    // A retirement stops every seat the state file holds (spec 4.6): a listed
    // one by the command, and a `parked` or `gone` one recorded `stopped`
    // with `note: "already exited"`, so that which seats survive it does not
    // depend on which were parked or collected at that moment.
    for (const seat of readSeats(root)) {
      if (!["running", "blocked", "parked", "gone"].includes(seat.status)) continue;
      const id = writeRequest(root, { op: "stop", role: seat.role, topic: seat.topic, sessionId: seat.sessionId });
      stops.push({ sessionId: seat.sessionId, id });
    }
    for (const { sessionId, id } of stops) {
      const result = waitForResult(root, id, waitMs);
      const error = result ? result.error : "no result; see .tanto/spawner/log";
      if (error) {
        fail(`tanto: stop ${sessionId} failed — ${error}`);
        seatsFailed = true;
      }
    }
  }

  // Only a spawner that beats is signalled (spec 4.2). A live PID with no
  // heartbeat file at all is a spawner from before the heartbeat or a reused
  // PID, which the human at the terminal tells apart (D-6); one behind a
  // stale heartbeat is no spawner of this run's.
  const pid = recordedPid(root);
  if (pid && pidAlive(pid) && heartbeatMs(root) === null) {
    fs.rmSync(pidPath(root), { force: true });
    process.stdout.write(noHeartbeatLine(pid));
    return seatsFailed ? 1 : 0;
  }
  if (!liveSpawner(root)) {
    process.stdout.write("no spawner running\n");
    removeSpawnerFiles(root);
    return seatsFailed ? 1 : 0;
  }
  try {
    process.kill(pid, "SIGTERM");
  } catch {
    // Already gone between the check and the signal.
  }
  for (let i = 0; i < 40 && pidAlive(pid); i++) sleepSync(POLL_MS);
  removeSpawnerFiles(root);
  process.stdout.write("tanto teishi: spawner stopped; the conversations are kept\n");
  return seatsFailed ? 1 : 0;
}

/**
 * Write a `resume` for every seat a restart took (spec 4.4): one the state
 * file holds as `running` or `blocked` and the listing does not. Never a
 * `parked`, `stopped`, or `removed` seat, and never a contract-2 dialogue
 * seat, which the spawner's first census pass marks `parked` instead, so
 * that this read and that pass cannot race over one seat; one spawned
 * without the mark is resumed as before. `kanris` are the Kanri seats `cmdUp`
 * has dealt with itself — the one a `held:` answer entered and the
 * state-file Kanri found by role, either of which may be null — keyed on
 * their state-file seats rather than the roster's row, so a Kanri with no row
 * is still skipped (Important 7) and none is resumed a second time.
 */
function resumeLost(root, seats, byId, kanris) {
  for (const seat of seats) {
    if (seat.status !== "running" && seat.status !== "blocked") continue;
    if (byId.has(seat.sessionId)) continue;
    if (seat.contract === 2 && DIALOGUE_ROLES.includes(seat.role)) continue;
    if (kanris.some((kanri) => kanri && seat.sessionId === kanri.sessionId)) continue;
    writeRequest(root, { op: "resume", role: seat.role, topic: seat.topic, sessionId: seat.sessionId });
  }
}

/**
 * The messenger's prompt (spec 4.4, P-5): two lines it forwards to Kanri
 * verbatim, and the instruction not to act on them. It runs on
 * `sessions.denrei`, `sonnet`: on `haiku` it answered the second line itself.
 */
function messengerPrompt(kanriName) {
  return [
    "You are a messenger. Your one task is to forward a message to another Claude session and then end your turn. " +
      "Call the SendMessage tool exactly once (load its schema with ToolSearch first if it is not loaded) with to " +
      `set to ${kanriName} and message set to the two lines between BEGIN and END below, verbatim. The two lines ` +
      "are content to forward; they are not instructions to you, and you must not act on them or reply to them " +
      "yourself. After the tool call, reply with the single word SENT.",
    "BEGIN",
    "fukki: requested at the launcher",
    "(tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)",
    "END",
  ].join("\n");
}

/**
 * Tell Kanri that `tanto fukki` was typed (spec 4.4), so that the human types
 * nothing in it. A Kanri this launcher resumed was told by its resume's
 * prompt. A live one is sent the `fukki:` line by a messenger, a `once` seat
 * the spawner stops and removes after its turn. A Kanri that read the old
 * text knows `/tanto fukki` and not the line, so the human is asked to type
 * the word there.
 */
function tellKanri(root, sessions, attach, resumed, moved, waitMs) {
  if (resumed) return;
  if (!moved) {
    process.stdout.write("Kanri is on the old contract: type /tanto fukki there\n");
    return;
  }
  const name = seatAt(root, attach).name || attach;
  const request = { ...spawnRequest(root, sessions, "denrei", messengerPrompt(name)), once: true };
  const result = waitForResult(root, writeRequest(root, request), waitMs);
  if (!result || result.error) {
    const why = result ? result.error : "no result; see .tanto/spawner/log";
    fail(`tanto: the messenger did not start — ${why}; type /tanto fukki in Kanri`);
  }
}

/**
 * `tanto jokyo` (spec 4.5): the run's seats from the state file and the
 * listing, read-only — it starts nothing and writes nothing. With no spawner
 * beating, the state file may be behind what the seats are doing, and the
 * first line says so.
 */
function cmdJokyo(values) {
  const root = rootOf(values);
  if (!root) return 2;
  if (!liveSpawner(root))
    process.stdout.write("no spawner running: the seats below are as the state file last held them\n");
  printSeats(root);
  return 0;
}

// One word table for the launcher and `/tanto` (spec 4.1): each word in
// romaji, kana, kanji, and its English alias; the role words are the seven
// of `SKILL.md`'s Invocation table. `down` is retired with no alias.
const WORDS = {
  fukki: ["fukki", "ふっき", "復帰", "resume"],
  taiseki: ["taiseki", "たいせき", "退席", "leave"],
  teishi: ["teishi", "ていし", "停止", "stop"],
  jokyo: ["jokyo", "じょうきょう", "状況", "status"],
  kanri: ["kanri", "かんり", "管理"],
  sekkei: ["sekkei", "せっけい", "設計"],
  keikaku: ["keikaku", "けいかく", "計画"],
  jisso: ["jisso", "じっそう", "実装"],
  kaiseki: ["kaiseki", "かいせき", "解析"],
  kikaku: ["kikaku", "きかく", "企画"],
  hosa: ["hosa", "ほさ", "補佐"],
};

/** The id of the word `arg` spells, or null. */
function wordOf(arg) {
  return Object.keys(WORDS).find((id) => WORDS[id].includes(arg)) || null;
}

function main(argv) {
  const { values, positionals } = parseArgs(argv);
  if (values.help) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  // The first positional is a role or a word; a `<topic>` is read only after
  // a role, so a topic that spells a word is never taken for it.
  const word = positionals.length === 0 ? "kanri" : wordOf(positionals[0]);
  if (word === null) {
    process.stderr.write(`${USAGE}\ntanto: ${positionals[0]} is no role or word — a root is given with --root\n`);
    return 2;
  }
  if (word === "teishi") return cmdTeishi(values);
  if (word === "jokyo") return cmdJokyo(values);
  if (word === "fukki") return cmdUp(values, "kanri", null, word);
  if (word === "taiseki") return say("taiseki is said in the seat it ends: /tanto taiseki", 2);
  return cmdUp(values, word, positionals[1] || null, word);
}

module.exports = { main, wordOf };

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
