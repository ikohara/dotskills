// The launcher's tests. The CLI is the same fake Node script the spawner's
// tests use, named through TANTO_CLAUDE_NODE; the spawner itself is real,
// because "the launcher starts the spawner, and never runs claude --bg
// itself" is one of the properties under test. Every workspace is stopped in
// teardown.

const test = require("node:test");
const { after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const LAUNCHER = path.join(__dirname, "tanto.js");
// The fake is spawner.test.js's, read out of its source rather than copied,
// so that one file defines the CLI's behavior. The guard turns a silent
// extraction failure into a named one.
const FAKE = fs
  .readFileSync(path.join(__dirname, "spawner.test.js"), "utf8")
  .split("const FAKE = `")[1]
  .split("`;")[0]
  .replace(/\\\\n/g, "\\n");
if (!FAKE.includes("Started background session")) {
  throw new Error("the fake CLI could not be read out of spawner.test.js");
}

const workspaces = [];
after(() => {
  for (const ws of workspaces) {
    try {
      launch(ws, ["down", ws.root]);
    } catch {
      // Best-effort teardown: a spawner already stopped is the ordinary case.
    }
  }
});

let counter = 0;

function workspace(sessions = []) {
  counter += 1;
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `tanto-launch-${counter}-`)));
  spawnSync("git", ["init", "--quiet", root], { encoding: "utf8" });
  const fake = path.join(root, "fake-claude.js");
  fs.writeFileSync(fake, FAKE);
  const state = path.join(root, "fake-state.json");
  fs.writeFileSync(state, JSON.stringify({ root, sessions, next: {} }));
  const ws = { root, fake, state, log: path.join(root, "fake-log.txt") };
  workspaces.push(ws);
  return ws;
}

function launch(ws, argv) {
  const result = spawnSync(process.execPath, [LAUNCHER, ...argv], {
    encoding: "utf8",
    cwd: ws.root,
    env: {
      ...process.env,
      TANTO_CLAUDE_NODE: ws.fake,
      TANTO_NOTICE_LOG: path.join(ws.root, "notices.txt"),
      CLAUDE_CONFIG_DIR: ws.root,
      FAKE_STATE: ws.state,
      FAKE_LOG: ws.log,
    },
  });
  return { code: result.status, out: result.stdout || "", err: result.stderr || "" };
}

function requests(ws) {
  const dir = path.join(ws.root, ".tanto", "spawner", "requests");
  const results = path.join(ws.root, ".tanto", "spawner", "results");
  const byName = new Map();
  for (const place of [dir, results]) {
    if (!fs.existsSync(place)) continue;
    for (const name of fs.readdirSync(place).sort()) {
      if (name.endsWith(".json")) byName.set(name, JSON.parse(fs.readFileSync(path.join(place, name), "utf8")));
    }
  }
  return [...byName.values()];
}

function calls(ws) {
  if (!fs.existsSync(ws.log)) return [];
  return fs
    .readFileSync(ws.log, "utf8")
    .split("\n")
    .filter((l) => l.length > 0)
    .map((l) => JSON.parse(l));
}

const ROSTER_HEAD = [
  "# tanto roster",
  "",
  "| Role | Topic | Name [ref] | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
];

function writeRoster(ws, status, transcript) {
  fs.mkdirSync(path.join(ws.root, ".tanto"), { recursive: true });
  const row = `| kanri | — | seat-live [ffffff] | ${ws.root} | sonnet | high | main | auto | 2026-09-21 09:00 | ${status} | ${transcript} |`;
  fs.writeFileSync(path.join(ws.root, ".tanto", "roster.md"), `${[...ROSTER_HEAD, row].join("\n")}\n`);
}

function writeSeats(ws, seats) {
  const dir = path.join(ws.root, ".tanto", "spawner");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "seats.json"), JSON.stringify({ seats }));
}

test("--help prints the usage line and exits 2", () => {
  const ws = workspace();
  const got = launch(ws, ["--help"]);
  assert.equal(got.code, 2);
  assert.match(got.err, /^Usage: tanto/);
});

test("a root that is not a git top level is refused", () => {
  const ws = workspace();
  const inner = path.join(ws.root, "sub");
  fs.mkdirSync(inner);
  const got = launch(ws, [inner]);
  assert.equal(got.code, 2);
  assert.match(got.err, /top level/);
});

test("the first run writes the two workspace files and asks for a Kanri", () => {
  const ws = workspace();
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  assert.equal(got.code, 0);
  assert.equal(fs.readFileSync(path.join(ws.root, ".tanto", ".gitignore"), "utf8").trim(), "*");
  assert.match(fs.readFileSync(path.join(ws.root, ".tanto", ".markdownlint-cli2.yaml"), "utf8"), /default: false/);
  const asked = requests(ws).find((r) => r.op === "spawn");
  assert.equal(asked.role, "kanri");
  assert.equal(asked.prompt.includes("kanri"), true);
  assert.equal(asked.model, "sonnet");
  assert.equal(asked.effort, "high");
  assert.equal(asked.mode, "auto");
  assert.match(got.out, /claude attach bg01/);
});

test("an existing .gitignore is never overwritten", () => {
  const ws = workspace();
  fs.mkdirSync(path.join(ws.root, ".tanto"), { recursive: true });
  fs.writeFileSync(path.join(ws.root, ".tanto", ".gitignore"), "# mine\n");
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  assert.equal(got.code, 0);
  assert.equal(fs.readFileSync(path.join(ws.root, ".tanto", ".gitignore"), "utf8"), "# mine\n");
});

test("a live background Kanri is attached to, not spawned again", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "background", state: "running", id: "bg07" },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  assert.match(got.out, /claude attach bg07/);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
});

test("an interactive first row is reported and not attached to", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "interactive", id: "tab1" },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  assert.match(got.out, /interactive tab; hand over first/);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
});

test("a handover file asks for a Kanri whatever the roster says", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "interactive", id: "tab1" },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  fs.writeFileSync(path.join(ws.root, ".tanto", "kanri-handover.md"), "# tanto Kanri handover\n");
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 1);
  assert.match(got.out, /claude attach bg01/);
});

test("a running seat the listing lost is resumed, and fukki is printed", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "background", state: "running", id: "bg07" },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "running" },
    { sessionId: "sess-gone", id: "bg08", name: "seat-gone [eeeeee]", role: "jisso", status: "running" },
  ]);
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  const resumed = requests(ws).filter((r) => r.op === "resume");
  assert.equal(resumed.length, 1);
  assert.equal(resumed[0].sessionId, "sess-gone");
  assert.match(got.out, /tanto fukki/);
});

test("a rebooted Kanri the listing lost is resumed, never spawned again", () => {
  // The reboot of spec 1.8: seats.json still holds Kanri as running, and
  // `claude agents --json` has not seen it since the machine came back.
  const ws = workspace([
    {
      sessionId: "sess-live",
      name: "seat-live [ffffff]",
      cwd: null,
      kind: "background",
      state: "running",
      id: "bg07",
      hidden: true,
    },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "running" },
  ]);
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  assert.equal(got.code, 0);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
  const resumed = requests(ws).filter((r) => r.op === "resume");
  assert.deepEqual(
    resumed.map((r) => r.sessionId),
    ["sess-live"],
  );
  assert.match(got.out, /claude attach bg07/);
  assert.match(got.out, /tanto fukki/);
});

test("down --seats retires the run, and the next tanto spawns a fresh Kanri", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "background", state: "running", id: "bg07" },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "running" },
  ]);
  launch(ws, [ws.root, "--timeout", "20000"]);
  launch(ws, ["down", ws.root, "--seats", "--timeout", "20000"]);
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  assert.equal(got.code, 0);
  // A stopped seat is not resumed, so the roster's first row is no Kanri
  // any more and step 4 asks for a new one.
  assert.equal(requests(ws).filter((r) => r.op === "resume").length, 0);
  assert.equal(requests(ws).filter((r) => r.op === "spawn" && r.role === "kanri").length, 1);
  assert.match(got.out, /claude attach bg01/);
});

test("a stopped seat is not resumed", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "background", state: "running", id: "bg07" },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [{ sessionId: "sess-old", id: "bg05", name: "seat-old [dddddd]", role: "jisso", status: "stopped" }]);
  const got = launch(ws, [ws.root, "--timeout", "20000"]);
  assert.match(got.out, /claude attach bg07/);
  assert.equal(requests(ws).filter((r) => r.op === "resume").length, 0);
  assert.equal(/tanto fukki/.test(got.out), false);
});

test("down stops the spawner and removes its pidfile", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "background", state: "running", id: "bg07" },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  launch(ws, [ws.root, "--timeout", "20000"]);
  const pidfile = path.join(ws.root, ".tanto", "spawner", "pid");
  assert.equal(fs.existsSync(pidfile), true);
  const got = launch(ws, ["down", ws.root]);
  assert.equal(got.code, 0);
  assert.equal(fs.existsSync(pidfile), false);
});

test("down --seats writes a stop request for every running seat", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: null, kind: "background", state: "running", id: "bg07" },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  launch(ws, [ws.root, "--timeout", "20000"]);
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "running" },
    { sessionId: "sess-old", id: "bg05", name: "seat-old [dddddd]", role: "jisso", status: "stopped" },
  ]);
  launch(ws, ["down", ws.root, "--seats", "--timeout", "20000"]);
  const stops = requests(ws).filter((r) => r.op === "stop");
  assert.deepEqual(
    stops.map((r) => r.sessionId),
    ["sess-live"],
  );
});

test("the launcher itself never runs claude --bg", () => {
  const ws = workspace();
  launch(ws, [ws.root, "--timeout", "20000"]);
  const own = calls(ws).filter((argv) => argv.includes("--bg"));
  assert.equal(own.length, 1);
  const seats = JSON.parse(fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "seats.json"), "utf8")).seats;
  assert.equal(seats[0].role, "kanri");
});
