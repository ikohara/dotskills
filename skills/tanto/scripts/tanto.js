// No shebang: the two wrappers beside this file are what is invoked bare,
// and they name `node` themselves. This is the human's one command — it
// starts the spawner, finds or asks for a Kanri, puts back what a restart
// took, and prints the one line the human types next. It is idempotent, and
// it never runs `claude --bg` itself: its Kanri goes through the spawner
// like every other seat.

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync, spawn } = require("node:child_process");
const { loadSessions } = require("./reading.js");
const { readSeats, spawnerDir } = require("./spawner.js");

const USAGE = "Usage: tanto [<root>], or tanto down [<root>] [--seats]";
const SPAWNER = path.join(__dirname, "spawner.js");
const WAIT_MS = 60000;
const POLL_MS = 250;
const GITIGNORE = "*\n";
const MARKDOWNLINT = "config:\n  default: false\n";

function parseArgs(argv) {
  const values = {};
  const positionals = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      values[arg.slice(2)] = true;
    } else {
      values[arg.slice(2)] = next;
      i++;
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

function claudeCommand(args) {
  const viaNode = process.env.TANTO_CLAUDE_NODE;
  if (viaNode) return { file: process.execPath, args: [viaNode, ...args] };
  return { file: process.env.TANTO_CLAUDE || "claude", args };
}

function listAgents(root) {
  const command = claudeCommand(["agents", "--json", "--cwd", root]);
  const got = spawnSync(command.file, command.args, { encoding: "utf8", windowsHide: true });
  if (got.status !== 0) return [];
  try {
    const parsed = JSON.parse(got.stdout || "");
    if (Array.isArray(parsed)) return parsed;
    return Array.isArray(parsed.sessions) ? parsed.sessions : [];
  } catch {
    return [];
  }
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

function livePid(root) {
  const text = (() => {
    try {
      return fs.readFileSync(pidPath(root), "utf8");
    } catch {
      return "";
    }
  })();
  const pid = Number(text.trim());
  if (!pid) return null;
  try {
    process.kill(pid, 0);
    return pid;
  } catch {
    return null;
  }
}

function startSpawner(root) {
  if (livePid(root)) return false;
  const log = fs.openSync(path.join(spawnerDir(root), "log"), "a");
  const child = spawn(process.execPath, [SPAWNER, "run", "--root", root], {
    cwd: root,
    detached: true,
    stdio: ["ignore", log, log],
    windowsHide: true,
  });
  child.unref();
  for (let i = 0; i < 40 && !livePid(root); i++) sleepSync(POLL_MS);
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
  if (!row || !row.startsWith("|")) return null;
  const cells = row
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
  if (cells.length < 11) return null;
  return { name: cells[2], status: cells[9], sessionId: path.basename(cells[10], ".jsonl") };
}

/** The branch the shared tree is on, which the request schema asks for. */
function branchOf(root) {
  const got = spawnSync("git", ["-C", root, "rev-parse", "--abbrev-ref", "HEAD"], {
    encoding: "utf8",
    windowsHide: true,
  });
  return got.status === 0 ? got.stdout.trim() : "";
}

function kanriRequest(root, sessions) {
  const seat = sessions.kanri || {};
  return {
    op: "spawn",
    role: "kanri",
    topic: "—",
    model: seat.model,
    effort: seat.effort,
    branch: branchOf(root),
    mode: "auto",
    prompt: "/tanto kanri",
  };
}

function cmdUp(argv) {
  const { values, positionals } = parseArgs(argv);
  const root = resolveRoot(positionals[0]);
  if (!root) return 2;
  const waitMs = values.timeout ? Number(values.timeout) : WAIT_MS;
  const sessions = loadSessions(root);
  // Read before the spawner wakes: its own startup census reacts to the same
  // "missing from the listing" signal by marking a seat gone, which would
  // race this decision if seats.json were read after startSpawner below.
  const seats = readSeats(root);
  ensureWorkspace(root);
  startSpawner(root);

  const listing = listAgents(root);
  const byId = new Map(listing.filter((s) => s.sessionId && s.state !== "stopped").map((s) => [s.sessionId, s]));
  const handover = fs.existsSync(path.join(root, ".tanto", "kanri-handover.md"));
  const row = firstRosterRow(root);
  const listed = row ? byId.get(row.sessionId) : null;
  // Step 4's own seats.json check, before it decides spawn against resume: a
  // first row the listing has lost but seats.json still holds as running or
  // blocked is the reboot or crash case (spec 1.8), and it is resumed. Spawning
  // instead would leave two Kanris — the old one resumed by the loop below, the
  // new one stopping itself as the Second Kanri case.
  const held = row ? seats.find((s) => s.sessionId === row.sessionId) : null;
  const kanriHeld = Boolean(held && (held.status === "running" || held.status === "blocked"));

  let attach = null;
  let resumed = 0;
  if (!handover && listed && row.status.startsWith("live") && listed.kind === "background") {
    attach = listed.id || row.sessionId;
  } else if (!handover && listed && row.status.startsWith("live")) {
    process.stdout.write("Kanri is an interactive tab; hand over first\n");
  } else {
    const request =
      !handover && !listed && kanriHeld
        ? { op: "resume", role: held.role || "kanri", topic: held.topic, sessionId: row.sessionId }
        : kanriRequest(root, sessions);
    const id = writeRequest(root, request);
    const result = waitForResult(root, id, waitMs);
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
    if (row && seat.sessionId === row.sessionId) continue;
    writeRequest(root, { op: "resume", role: seat.role, topic: seat.topic, sessionId: seat.sessionId });
    resumed += 1;
  }

  if (attach) process.stdout.write(`claude attach ${attach}\n`);
  if (resumed > 0) process.stdout.write("then type /tanto fukki there once\n");
  return 0;
}

function cmdDown(argv) {
  const { values, positionals } = parseArgs(argv);
  const root = resolveRoot(positionals[0]);
  if (!root) return 2;
  const waitMs = values.timeout ? Number(values.timeout) : WAIT_MS;

  if (values.seats) {
    const ids = [];
    for (const seat of readSeats(root)) {
      if (seat.status !== "running" && seat.status !== "blocked") continue;
      ids.push(writeRequest(root, { op: "stop", role: seat.role, topic: seat.topic, sessionId: seat.sessionId }));
    }
    for (const id of ids) waitForResult(root, id, waitMs);
  }

  const pid = livePid(root);
  if (!pid) {
    process.stdout.write("no spawner running\n");
    try {
      fs.rmSync(pidPath(root), { force: true });
    } catch {
      // Nothing to remove is the ordinary case here.
    }
    return 0;
  }
  try {
    process.kill(pid, "SIGTERM");
  } catch {
    // Already gone between the check and the signal.
  }
  for (let i = 0; i < 40 && livePid(root); i++) sleepSync(POLL_MS);
  fs.rmSync(pidPath(root), { force: true });
  process.stdout.write("tanto down: spawner stopped; the conversations are kept\n");
  return 0;
}

function main(argv) {
  if (argv.includes("--help") || argv.includes("-h")) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  if (argv[0] === "down") return cmdDown(argv.slice(1));
  return cmdUp(argv);
}

module.exports = { main };

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
