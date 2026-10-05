// No shebang: the two wrappers beside this file are what is invoked bare,
// and they name `node` themselves. This is the human's one command — it
// starts the spawner, finds or asks for a Kanri, puts back what a restart
// took, and prints the one line the human types next. It is idempotent, and
// it never runs `claude --bg` itself: its Kanri goes through the spawner
// like every other seat.

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync, spawn } = require("node:child_process");
const { loadSessions } = require("./reading.js");
const { readSeats, spawnerDir, underRoot, appendLog, heartbeatPath, HEARTBEAT_STALE_MS } = require("./spawner.js");

const USAGE = [
  "Usage: tanto [<role>] [<topic>] [--attach | --no-attach] [--root <path>] [--timeout <ms>]",
  "       tanto fukki [--no-attach] [--root <path>] [--timeout <ms>]",
  "       tanto teishi [--seats] [--root <path>] [--timeout <ms>]",
  "       tanto jokyo [--root <path>]",
].join("\n");
const SPAWNER = path.join(__dirname, "spawner.js");
const WAIT_MS = 60000;
const POLL_MS = 250;

// The line printed after every attach line (spec 4.1): every way out of a
// seat but `/stop` leaves it running.
const LEAVE_LINE =
  "← or /exit returns to the agent view, Ctrl+Z to the shell; the seat keeps running — /stop alone stops it, and a Kanri you /stop comes back with tanto";

// The trust hint (spec 4.3), printed before the attach line.
const TRUST_LINE =
  "this folder's trust is not recorded: run claude here once and answer \"Yes, I trust this folder\" — the agent view's own trust question after ← or /exit takes no input";

// A seat `seats.json` holds as `running` or `blocked` — or, for Kanri alone,
// `gone` — is resumed; one it holds as `stopped` or `removed` is not (spec 4.2).
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

function claudeCommand(args) {
  const viaNode = process.env.TANTO_CLAUDE_NODE;
  if (viaNode) return { file: process.execPath, args: [viaNode, ...args] };
  return { file: process.env.TANTO_CLAUDE || "claude", args };
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
  for (const file of [pidPath(root), heartbeatPath(root)]) {
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
  // new one until the next `tanto down`. Both claim a request by rename, so
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

/** The roster's first data row, as its eleven cells, or null. */
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
  const cells = row
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
  if (cells.length < 11) return null;
  return { name: cells[2], status: cells[9], sessionId: path.basename(cells[10], ".jsonl") };
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
  const byId = new Map(
    listing.sessions.filter((s) => s.sessionId && s.pid && s.state !== "stopped").map((s) => [s.sessionId, s]),
  );
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
  // spawner ran, and it is resumed like a `running` one (spec 4.2); a
  // `stopped` one — after `tanto down --seats`, or a handover — is not.
  const held = row
    ? seats.find((s) => s.sessionId === row.sessionId)
    : seats.find((s) => s.role === "kanri" && KANRI_RESUMABLE.includes(s.status));
  const kanriHeld = Boolean(held && KANRI_RESUMABLE.includes(held.status));
  // A handover in progress: look for the successor before writing a second
  // spawn request for one that already exists (R-12, Important 2).
  const handoverMtimeMs = handover ? statMtimeMs(handoverFile) : null;
  const successor =
    handover && handoverMtimeMs !== null
      ? kanriSuccessor(root, handoverMtimeMs, seats, byId, row ? row.sessionId : null)
      : null;

  let attach = null;
  let resumed = 0;
  if (role !== "kanri") {
    const entry = enterRole(root, sessions, role, topic, seats, older, waitMs);
    if (entry.code !== undefined) return entry.code;
    attach = entry.attach;
  } else if (!handover && listed && row.status.startsWith("live") && listed.kind === "background") {
    attach = listed.id || row.sessionId;
  } else if (!handover && listed && row.status.startsWith("live")) {
    process.stdout.write("Kanri is an interactive tab; hand over first\n");
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
          }
        : kanriRequest(root, sessions, held);
    let result = waitForResult(root, writeRequest(root, request), waitMs);
    if (result?.error && request.op === "resume") {
      fail(`tanto: the Kanri resume failed — ${result.error}; spawning a new Kanri`);
      request = kanriRequest(root, sessions, held);
      result = waitForResult(root, writeRequest(root, request), waitMs);
    }
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

  for (const seat of seats) {
    if (seat.status !== "running" && seat.status !== "blocked") continue;
    if (byId.has(seat.sessionId)) continue;
    // Kanri's own resume is step 4's, above; this loop is every other seat.
    // Keyed on `held` rather than `row.sessionId`, so it still skips a Kanri
    // resumed above when there was no roster row to key on (Important 7).
    if (held && seat.sessionId === held.sessionId) continue;
    writeRequest(root, { op: "resume", role: seat.role, topic: seat.topic, sessionId: seat.sessionId });
    resumed += 1;
  }

  const hint = trustHint(root);
  if (hint) process.stdout.write(`${hint}\n`);
  if (attach) process.stdout.write(`claude attach ${attach}\n${LEAVE_LINE}\n`);
  // Only when a seat the human can reach was actually named above — an
  // interactive first row prints its own line and sets no `attach`, and
  // "then type /tanto fukki there" with nothing before it names nothing to
  // attach to first (Minor 10, branch-review.md).
  if (resumed > 0 && attach) process.stdout.write("then type /tanto fukki there once\n");
  return 0;
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
    for (const seat of readSeats(root)) {
      if (seat.status !== "running" && seat.status !== "blocked") continue;
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
  process.stdout.write("tanto down: spawner stopped; the conversations are kept\n");
  return seatsFailed ? 1 : 0;
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
