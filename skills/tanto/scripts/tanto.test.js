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
const { spawn, spawnSync } = require("node:child_process");

const LAUNCHER = path.join(__dirname, "tanto.js");
// The fake is spawner.test.js's, read out of its source rather than copied,
// so that one file defines the CLI's behavior. The guard turns a silent
// extraction failure into a named one.
const FAKE = fs
  .readFileSync(path.join(__dirname, "spawner.test.js"), "utf8")
  .split("const FAKE = `")[1]
  .split("`;")[0]
  .replace(/\\\\n/g, "\\n");
if (!FAKE.includes("backgrounded · ")) {
  throw new Error("the fake CLI could not be read out of spawner.test.js");
}

const workspaces = [];
after(() => {
  for (const ws of workspaces) {
    try {
      launch(ws, ["teishi"]);
    } catch {
      // Best-effort teardown: a spawner already stopped is the ordinary case.
    }
    try {
      fs.rmSync(ws.root, { recursive: true, force: true });
    } catch {
      // Best-effort cleanup (Minor 15, branch-review.md): a lingering handle
      // on Windows is not worth failing the suite over.
    }
  }
});

let counter = 0;

// A listing fixture's cwd: the workspace root, which no fixture can name
// before `workspace` makes it, so `ROOT` stands for it there. The real
// listing carries a cwd on every entry, and every reader keeps only the
// entries at or under the root (spec 2.3).
const ROOT = Symbol("the workspace root");

function workspace(sessions = []) {
  counter += 1;
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `tanto-launch-${counter}-`)));
  spawnSync("git", ["init", "--quiet", root], { encoding: "utf8" });
  const fake = path.join(root, "fake-claude.js");
  fs.writeFileSync(fake, FAKE);
  const state = path.join(root, "fake-state.json");
  const listed = sessions.map((s) => (s.cwd === ROOT ? { ...s, cwd: root } : s));
  fs.writeFileSync(state, JSON.stringify({ root, sessions: listed, next: {} }));
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
      // A request the spawner is handling is renamed to `<name>.<pid>.claimed`
      // and stays that way until its result is written (issue-f03b).
      const key = name.replace(/\.\d+\.claimed$/, "");
      if (key.endsWith(".json")) byName.set(key, JSON.parse(fs.readFileSync(path.join(place, name), "utf8")));
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

/** The ids the launcher ran the CLI's `attach` on, in order (spec 4.3). */
function attaches(ws) {
  return calls(ws)
    .filter((argv) => argv[0] === "attach")
    .map((argv) => argv[1]);
}

function lastAttach(ws) {
  return attaches(ws).at(-1);
}

// A fake of its own around the shared one: at the n-th attach it writes the
// files of `attach-steps.json`'s n-th step, the way a handover changes them
// while the human is attached, and then runs the shared fake. A step's
// `@later` entry is `{ ms, files }`: a detached `node -e` child writes those
// files `ms` after the attach has returned, the way the spawner writes the
// state file a moment after the `stop` that ended the attach.
const ATTACH_HOOK = `
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
if (process.argv[2] === "attach") {
  const file = path.join(__dirname, "attach-steps.json");
  const steps = JSON.parse(fs.readFileSync(file, "utf8"));
  const step = steps.shift() || {};
  fs.writeFileSync(file, JSON.stringify(steps));
  for (const [name, body] of Object.entries(step)) {
    if (name !== "@later") {
      fs.writeFileSync(path.join(__dirname, name), body);
      continue;
    }
    const script = "const fs = require('node:fs'); const [dir, ms, files] = process.argv.slice(1);" +
      "setTimeout(() => { for (const [name, text] of Object.entries(JSON.parse(files))) {" +
      "const target = require('node:path').join(dir, name); fs.writeFileSync(target + '.tmp', text);" +
      "fs.renameSync(target + '.tmp', target); } }, Number(ms));";
    spawn(process.execPath, ["-e", script, __dirname, String(body.ms), JSON.stringify(body.files)], {
      detached: true,
      stdio: "ignore",
    }).unref();
  }
}
require("./fake-claude.js");
`;

/** Write `steps` for the hooked fake, and name it as the workspace's CLI. */
function onAttach(ws, steps) {
  fs.writeFileSync(path.join(ws.root, "attach-steps.json"), JSON.stringify(steps));
  ws.fake = path.join(ws.root, "fake-attach.js");
  fs.writeFileSync(ws.fake, ATTACH_HOOK);
}

/** A transcript whose one assistant record `reading.js` reads as `context` tokens. */
function writeTranscript(ws, sessionId, context) {
  const file = path.join(ws.root, `${sessionId}.jsonl`);
  const usage = { input_tokens: 100, cache_creation_input_tokens: 0, cache_read_input_tokens: context - 100 };
  fs.writeFileSync(file, `${JSON.stringify({ type: "assistant", message: { usage } })}\n`);
  return file;
}

// The roster template's twenty columns (roster-ledger 1.1): the seat's
// eleven, then the nine reading columns, blank until a reading lands.
const ROSTER_HEAD = [
  "# tanto roster",
  "",
  "| Role | Topic | Name | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
];
const READINGS = "— | — | — | — | — | — | 0 | 0 | 0";

function writeRoster(ws, status, transcript) {
  fs.mkdirSync(path.join(ws.root, ".tanto"), { recursive: true });
  const row = `| kanri | — | seat-live [ffffff] | ${ws.root} | sonnet | high | main | auto | 2026-09-21 09:00 | ${status} | ${transcript} | ${READINGS} |`;
  fs.writeFileSync(path.join(ws.root, ".tanto", "roster.md"), `${[...ROSTER_HEAD, row].join("\n")}\n`);
}

function writeSeats(ws, seats) {
  const dir = path.join(ws.root, ".tanto", "spawner");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "seats.json"), JSON.stringify({ seats }));
}

function setState(ws, patch) {
  const state = JSON.parse(fs.readFileSync(ws.state, "utf8"));
  fs.writeFileSync(ws.state, JSON.stringify({ ...state, ...patch }));
}

/** Backdate a file's mtime so a later write is unambiguously newer than it,
 * whatever the filesystem's timestamp resolution. */
function backdate(file, seconds) {
  const past = new Date(Date.now() - seconds * 1000);
  fs.utimesSync(file, past, past);
}

// The two lines the launcher prints before an attach (spec 4.3), byte for byte.
const LEAVE =
  "← or /exit leaves for the agent view, and leaving the agent view comes back here; open no seat from the agent view — tanto <role> is the way in. Leaving ends no seat, and a Kanri you /stop comes back with tanto";
const TRUST =
  "this folder's trust is not recorded: run claude here once and answer \"Yes, I trust this folder\" — the agent view's own trust question after ← or /exit takes no input";

// The line the launcher prints before it enters the Kanri the spawner holds
// and the roster's first row does not name (roster-ledger 6).
const heldLine = (sessionId) =>
  `tanto: the roster's first row does not name the Kanri the spawner holds, ${sessionId}; entering it — run boundary.js roster show`;

/** `.claude.json` in the fake config directory, keyed as the CLI keys the root. */
function writeTrust(ws, accepted) {
  const key = ws.root.replace(/\\/g, "/");
  const body = { projects: { [key]: { hasTrustDialogAccepted: accepted } } };
  fs.writeFileSync(path.join(ws.root, ".claude.json"), JSON.stringify(body));
}

const LIVE_KANRI = {
  sessionId: "sess-live",
  name: "seat-live [ffffff]",
  cwd: ROOT,
  kind: "background",
  state: "running",
  id: "bg07",
  pid: 1111,
};

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
  const got = launch(ws, ["--root", inner]);
  assert.equal(got.code, 2);
  assert.match(got.err, /top level/);
});

test("the first run writes the two workspace files and asks for a Kanri", () => {
  const ws = workspace();
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 0);
  assert.equal(fs.readFileSync(path.join(ws.root, ".tanto", ".gitignore"), "utf8").trim(), "*");
  assert.match(fs.readFileSync(path.join(ws.root, ".tanto", ".markdownlint-cli2.yaml"), "utf8"), /default: false/);
  const asked = requests(ws).find((r) => r.op === "spawn");
  assert.equal(asked.role, "kanri");
  assert.equal(asked.prompt.includes("kanri"), true);
  assert.equal(asked.model, "sonnet");
  assert.equal(asked.effort, "high");
  assert.equal(asked.mode, "auto");
  assert.equal(lastAttach(ws), "bg01", got.err);
});

test("an existing .gitignore is never overwritten", () => {
  const ws = workspace();
  fs.mkdirSync(path.join(ws.root, ".tanto"), { recursive: true });
  fs.writeFileSync(path.join(ws.root, ".tanto", ".gitignore"), "# mine\n");
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 0);
  assert.equal(fs.readFileSync(path.join(ws.root, ".tanto", ".gitignore"), "utf8"), "# mine\n");
});

test("a live background Kanri is attached to, not spawned again", () => {
  const ws = workspace([
    {
      sessionId: "sess-live",
      name: "seat-live [ffffff]",
      cwd: ROOT,
      kind: "background",
      state: "running",
      id: "bg07",
      pid: 1111,
    },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(lastAttach(ws), "bg07", got.err);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
});

test("an interactive first row is reported and not attached to", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: ROOT, kind: "interactive", id: "tab1", pid: 1111 },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 1);
  assert.match(got.out, /^kanri is open in a VS Code tab; close the tab and run this again$/m);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
});

test("a handover file asks for a Kanri whatever the roster says", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: ROOT, kind: "interactive", id: "tab1", pid: 1111 },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  fs.writeFileSync(path.join(ws.root, ".tanto", "kanri-handover.md"), "# tanto Kanri handover\n");
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 1);
  assert.equal(lastAttach(ws), "bg01", got.err);
});

test("a handover file with a successor already in seats.json is attached to, not spawned again (R-12)", () => {
  // The handover window (roles/kanri.md's step 4 until the successor accepts)
  // is a minute or more; running `tanto` inside it must find the successor
  // the spawner already recorded rather than write a second spawn request
  // for `/tanto kanri` (Important 2, branch-review.md). The successor must
  // also be in the live listing: the cross-check added in fix round 2
  // (Important 1) refuses to attach to a seats.json row the CLI does not
  // list.
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: ROOT, kind: "interactive", id: "tab1", pid: 1111 },
    {
      sessionId: "sess-new-kanri",
      name: "seat-new [aaaaaa]",
      cwd: ROOT,
      kind: "background",
      state: "running",
      id: "bg09",
      pid: 1112,
    },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const handoverFile = path.join(ws.root, ".tanto", "kanri-handover.md");
  fs.writeFileSync(handoverFile, "# tanto Kanri handover\n");
  backdate(handoverFile, 5);
  writeSeats(ws, [
    { sessionId: "sess-live", id: "tab1", name: "seat-live [ffffff]", role: "kanri", status: "running" },
    { sessionId: "sess-new-kanri", id: "bg09", name: "seat-new [aaaaaa]", role: "kanri", status: "running" },
  ]);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
  assert.equal(lastAttach(ws), "bg09", got.err);
});

test("a handover file with only the outgoing Kanri in seats.json still spawns a successor (C-2a)", () => {
  // Reproduces the round-1 Critical: seats.json is rewritten unconditionally
  // by the resident's own ~15s census, so within the handover window the
  // file is always "newer" than the handover file itself. Keying the
  // successor check on that file mtime alone (round 1's bug) matched the
  // OUTGOING Kanri's own row here — the only kanri row that exists — and
  // wrongly suppressed the spawn request that creates the real successor.
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: ROOT, kind: "interactive", id: "tab1", pid: 1111 },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const handoverFile = path.join(ws.root, ".tanto", "kanri-handover.md");
  fs.writeFileSync(handoverFile, "# tanto Kanri handover\n");
  backdate(handoverFile, 5);
  // seats.json written well after the handover file, exactly as the
  // resident's own census would during the handover window, holding only
  // the outgoing Kanri's own (pre-handover) row.
  writeSeats(ws, [
    { sessionId: "sess-live", id: "tab1", name: "seat-live [ffffff]", role: "kanri", status: "running" },
  ]);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(requests(ws).filter((r) => r.op === "spawn" && r.role === "kanri").length, 1);
  assert.equal(lastAttach(ws), "bg01", got.err);
});

test("a handover file with both the outgoing Kanri and a live successor attaches to the successor (C-2b)", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: ROOT, kind: "interactive", id: "tab1", pid: 1111 },
    {
      sessionId: "sess-successor",
      name: "seat-new [aaaaaa]",
      cwd: ROOT,
      kind: "background",
      state: "running",
      id: "bg09",
      pid: 1112,
    },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const handoverFile = path.join(ws.root, ".tanto", "kanri-handover.md");
  fs.writeFileSync(handoverFile, "# tanto Kanri handover\n");
  backdate(handoverFile, 5);
  writeSeats(ws, [
    { sessionId: "sess-live", id: "tab1", name: "seat-live [ffffff]", role: "kanri", status: "running" },
    { sessionId: "sess-successor", id: "bg09", name: "seat-new [aaaaaa]", role: "kanri", status: "running" },
  ]);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(requests(ws).filter((r) => r.op === "spawn" && r.role === "kanri").length, 0);
  assert.equal(lastAttach(ws), "bg09", got.err);
});

test("a handover successor row the live listing has lost is not attached to directly (Important 1)", () => {
  // A seats.json row distinct from the outgoing Kanri, but absent from the
  // live listing, must not be trusted as an attachable id directly. It is
  // also a second holder of the role, so the successor's spawn, which names
  // the outgoing Kanri alone, is refused (spec 1.2) and the launcher says so;
  // a seat the listing lost is put back by `fukki`, never by `tanto`.
  const ws = workspace();
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const handoverFile = path.join(ws.root, ".tanto", "kanri-handover.md");
  fs.writeFileSync(handoverFile, "# tanto Kanri handover\n");
  backdate(handoverFile, 5);
  writeSeats(ws, [
    { sessionId: "sess-live", id: "tab1", name: "seat-live [ffffff]", role: "kanri", status: "running" },
    { sessionId: "sess-ghost", id: "bg-ghost", name: "seat-ghost [999999]", role: "kanri", status: "running" },
  ]);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.notEqual(lastAttach(ws), "bg-ghost", got.err);
  assert.equal(requests(ws).filter((r) => r.op === "spawn" && r.role === "kanri").length, 1);
  assert.equal(got.code, 1);
  assert.match(got.err, /held: sess-ghost/);
  assert.deepEqual(
    requests(ws).filter((r) => r.op === "resume"),
    [],
  );
});

test("a running seat the listing lost is resumed, and no line asks for fukki", () => {
  const ws = workspace([
    {
      sessionId: "sess-live",
      name: "seat-live [ffffff]",
      cwd: ROOT,
      kind: "background",
      state: "running",
      id: "bg07",
      pid: 1111,
    },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "running" },
    { sessionId: "sess-gone", id: "bg08", name: "seat-gone [eeeeee]", role: "jisso", status: "running" },
  ]);
  const got = launch(ws, ["--timeout", "20000"]);
  const resumed = requests(ws).filter((r) => r.op === "resume");
  assert.equal(resumed.length, 1);
  assert.equal(resumed[0].sessionId, "sess-gone");
  assert.doesNotMatch(got.out, /tanto fukki/);
});

test("a rebooted Kanri the listing lost is resumed, never spawned again", () => {
  // The reboot of spec 1.8: seats.json still holds Kanri as running, and
  // `claude agents --json` has not seen it since the machine came back.
  const ws = workspace([
    {
      sessionId: "sess-live",
      name: "seat-live [ffffff]",
      cwd: ROOT,
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
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 0);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
  const resumed = requests(ws).filter((r) => r.op === "resume");
  assert.deepEqual(
    resumed.map((r) => r.sessionId),
    ["sess-live"],
  );
  assert.equal(lastAttach(ws), "bg07", got.err);
  assert.doesNotMatch(got.out, /tanto fukki/);
});

test("a Kanri seat with no roster row is resumed once, never spawned or double-resumed (Important 7)", () => {
  // No roster.md at all: the Second Kanri rule keys on the roster's first
  // row, and cannot fire with none. Without the fix, `row` being null spawns
  // a fresh Kanri (the `else` branch's `held` is null) while the "every
  // other seat" loop below resumes the same crashed seat a second time
  // (its own `row &&` guard never matches with no row either).
  const ws = workspace([
    {
      sessionId: "sess-crashed",
      name: "seat-crashed [cccccc]",
      cwd: ROOT,
      kind: "background",
      state: "running",
      id: "bg05",
      hidden: true,
    },
  ]);
  writeSeats(ws, [
    { sessionId: "sess-crashed", id: "bg05", name: "seat-crashed [cccccc]", role: "kanri", status: "running" },
  ]);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 0);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
  const resumed = requests(ws).filter((r) => r.op === "resume");
  assert.deepEqual(
    resumed.map((r) => r.sessionId),
    ["sess-crashed"],
  );
});

test("tanto puts back what a restart took, and leaves a contract-2 dialogue seat to the spawner (spec 4.4)", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "running", contract: 2 },
    { sessionId: "sess-jisso", id: "bg08", role: "jisso", topic: "t", status: "running", contract: 2 },
    { sessionId: "sess-sekkei", id: "bg12", role: "sekkei", topic: "t", status: "running", contract: 2 },
    { sessionId: "sess-keikaku", id: "bg14", role: "keikaku", topic: "t", status: "blocked" },
    { sessionId: "sess-hosa", id: "bg15", role: "hosa", topic: "—", status: "parked", contract: 2 },
  ]);
  const child = quietSpawner(ws);
  try {
    const got = launch(ws, ["kanri", "--timeout", "5000"]);
    assert.equal(got.code, 0, got.err);
    assert.deepEqual(
      requests(ws)
        .filter((r) => r.op === "resume")
        .map((r) => r.sessionId)
        .sort(),
      ["sess-jisso", "sess-keikaku"],
    );
  } finally {
    child.kill();
  }
});

test("entering a role puts nothing back: the resume list is the Kanri path's alone (spec 4.4)", () => {
  const ws = workspace();
  writeSeats(ws, [
    { sessionId: "sess-kikaku", id: "bg21", role: "kikaku", topic: "—", status: "parked", contract: 2 },
    { sessionId: "sess-jisso", id: "bg08", role: "jisso", topic: "t", status: "running", contract: 2 },
  ]);
  const child = quietSpawner(ws);
  try {
    const got = launch(ws, ["kikaku", "-n", "--timeout", "5000"]);
    assert.equal(got.code, 0, got.err);
    assert.deepEqual(requests(ws), []);
  } finally {
    child.kill();
  }
});

test("fukki, and a bare tanto, carry the fukki word in a Kanri's resume and send no messenger (spec 4.4)", () => {
  for (const argv of [["fukki"], ["kanri"]]) {
    const ws = workspace([{ ...LIVE_KANRI, hidden: true }]);
    writeRoster(ws, "live", "/tmp/sess-live.jsonl");
    writeSeats(ws, [{ sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "gone", contract: 2 }]);
    const got = launch(ws, [...argv, "--timeout", "20000"]);
    assert.equal(got.code, 0, got.err);
    assert.deepEqual(
      requests(ws)
        .filter((r) => r.op === "resume")
        .map((r) => [r.sessionId, r.prompt]),
      [["sess-live", "/tanto fukki"]],
    );
    assert.equal(requests(ws).filter((r) => r.role === "denrei").length, 0, argv[0]);
  }
});

test("fukki with a live Kanri spawns a once messenger that forwards the fukki line to Kanri's name (spec 4.4)", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [{ sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "running", contract: 2 }]);
  const got = launch(ws, ["ふっき", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  const spawned = requests(ws).filter((r) => r.op === "spawn");
  assert.deepEqual(
    spawned.map((r) => [r.role, r.once, r.contract, r.model, r.effort]),
    [["denrei", true, 2, "sonnet", "low"]],
  );
  assert.ok(spawned[0].prompt.startsWith("You are a messenger."), spawned[0].prompt);
  assert.ok(spawned[0].prompt.includes("with to set to seat-live [ffffff] and message set to"), spawned[0].prompt);
  assert.ok(
    spawned[0].prompt.endsWith(
      "\nBEGIN\nfukki: requested at the launcher\n(tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)\nEND",
    ),
    spawned[0].prompt,
  );
  assert.deepEqual(attaches(ws), ["bg07"]);
});

test("fukki in a run that has not moved sends no messenger, and asks for /tanto fukki in Kanri before the attach (spec 4.4)", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [{ sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "running" }]);
  const got = launch(ws, ["resume", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  const lines = got.out.split(/\r?\n/);
  const asked = lines.indexOf("Kanri is on the old contract: type /tanto fukki there");
  assert.notEqual(asked, -1, got.out);
  assert.ok(asked < lines.indexOf(LEAVE), got.out);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
});

test("jokyo prints one line per seat from the state file and the listing, and starts and writes nothing (spec 4.5)", () => {
  const listed = (sessionId, extra) => ({ sessionId, name: `x-${sessionId}`, cwd: ROOT, pid: 1200, ...extra });
  const ws = workspace([
    listed("sess-kanri", { kind: "background", status: "busy" }),
    listed("sess-jisso", { kind: "background", status: "waiting", waitingFor: "permission prompt" }),
    listed("sess-kikaku", { kind: "interactive", status: "idle" }),
    listed("sess-kaiseki", { kind: "background", status: "idle" }),
  ]);
  const seat = (sessionId, role, topic, status, extra = {}) => ({
    sessionId,
    role,
    topic,
    status,
    contract: 2,
    ...extra,
  });
  writeSeats(ws, [
    seat("sess-sekkei", "sekkei", "t", "parked", {
      waiting: true,
      transcript: writeTranscript(ws, "sess-sekkei", 212340),
    }),
    seat("sess-kanri", "kanri", "—", "running"),
    seat("sess-jisso", "jisso", "t", "blocked"),
    seat("sess-kikaku", "kikaku", "—", "running", {
      waiting: true,
      transcript: writeTranscript(ws, "sess-kikaku", 96120),
    }),
    seat("sess-hosa", "hosa", "—", "parked", { transcript: writeTranscript(ws, "sess-hosa", 41870) }),
    seat("sess-keikaku", "keikaku", "t", "parked", { midTurn: true }),
    seat("sess-kaiseki", "kaiseki", "—", "running"),
    seat("sess-old", "jisso", "u", "stopped"),
    seat("sess-gone", "jisso", "u", "gone"),
  ]);
  const got = launch(ws, ["状況"]);
  assert.equal(got.code, 0, got.err);
  const lines = got.out.trimEnd().split(/\r?\n/);
  assert.equal(lines[0], "no spawner running: the seats below are as the state file last held them");
  const expected = [
    /^kanri\s+—\s+working$/,
    /^sekkei\s+t\s+parked — waiting for you\s+context=212340\s+tanto sekkei$/,
    /^jisso\s+t\s+blocked — permission prompt\s+tanto jisso t$/,
    /^kikaku\s+—\s+in a tab — waiting for you\s+context=96120$/,
    /^hosa\s+—\s+parked\s+context=41870$/,
    /^keikaku\s+t\s+parked — mid-turn\s+tanto fukki$/,
    /^kaiseki\s+—\s+idle$/,
    /^jisso\s+u\s+gone$/,
  ];
  assert.equal(lines.length, expected.length + 1, got.out);
  for (const [i, pattern] of expected.entries()) assert.match(lines[i + 1], pattern);
  assert.equal(fs.existsSync(path.join(ws.root, ".tanto", "spawner", "pid")), false);
  assert.equal(fs.existsSync(path.join(ws.root, ".tanto", "spawner", "requests")), false);
});

test("jokyo names tanto fukki for a gone Kanri and a Kikaku's own word for its cut turn, and no stale line while a spawner beats (spec 4.5)", () => {
  const ws = workspace([{ sessionId: "sess-kikaku", name: "x-05", cwd: ROOT, pid: 1201, kind: "interactive" }]);
  writeSeats(ws, [
    { sessionId: "sess-kanri", role: "kanri", topic: "—", status: "gone" },
    { sessionId: "sess-kikaku", role: "kikaku", topic: "—", status: "running", contract: 2 },
    { sessionId: "sess-hosa", role: "hosa", topic: "—", status: "parked", contract: 2, midTurn: true },
  ]);
  const child = quietSpawner(ws);
  try {
    const got = launch(ws, ["jokyo"]);
    assert.equal(got.code, 0, got.err);
    const lines = got.out.trimEnd().split(/\r?\n/);
    assert.equal(lines.length, 3, got.out);
    assert.match(lines[0], /^kanri\s+—\s+gone\s+tanto fukki$/);
    assert.match(lines[1], /^kikaku\s+—\s+in a tab$/);
    assert.match(lines[2], /^hosa\s+—\s+parked — mid-turn\s+tanto hosa$/);
  } finally {
    child.kill();
  }
});

test("claude agents failing exits 1 with the stderr, and writes no request (Important 5)", () => {
  const ws = workspace();
  setState(ws, { fail: { agents: "classifier refused" } });
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 1);
  assert.match(got.err, /tanto: claude agents failed — classifier refused/);
  const dir = path.join(ws.root, ".tanto", "spawner", "requests");
  assert.equal(fs.existsSync(dir) ? fs.readdirSync(dir).length : 0, 0);
});

test("teishi --seats reports a failed stop and exits 1 (Important 6)", () => {
  const ws = workspace([
    {
      sessionId: "sess-live",
      name: "seat-live [ffffff]",
      cwd: ROOT,
      kind: "background",
      state: "running",
      id: "bg07",
      pid: 1111,
    },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  launch(ws, ["--timeout", "20000"]);
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "running" },
    { sessionId: "sess-missing", id: "bg99", name: "seat-missing [999999]", role: "jisso", status: "running" },
  ]);
  // A seat the listing does not show is recorded stopped with no command
  // (spawner spec 2.8), so the failure here is the CLI refusing a listed one.
  const state = JSON.parse(fs.readFileSync(ws.state, "utf8"));
  fs.writeFileSync(ws.state, JSON.stringify({ ...state, fail: { stop: "refused" } }));
  const got = launch(ws, ["teishi", "--seats", "--timeout", "20000"]);
  assert.equal(got.code, 1);
  assert.match(got.err, /tanto: stop sess-live failed/);
});

test("--help's usage line documents --timeout (Minor 10)", () => {
  const ws = workspace();
  const got = launch(ws, ["--help"]);
  assert.match(got.err, /--timeout <ms>/);
});

/**
 * A spawner that beats and runs this design's code but answers nothing, so
 * that no census pass rewrites the state file a test arranged (spec 4.2).
 * `strangerPid` is below.
 */
function quietSpawner(ws) {
  const child = strangerPid(ws, Date.now());
  fs.writeFileSync(path.join(ws.root, ".tanto", "spawner", "contract"), "2\n");
  return child;
}

test("the word table: each of the four words in romaji, kana, kanji, and English, and the seven roles (spec 4.1)", () => {
  const { wordOf } = require(LAUNCHER);
  const table = {
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
  for (const [id, words] of Object.entries(table)) {
    for (const word of words) assert.equal(wordOf(word), id, word);
  }
  for (const word of ["down", "up", "shoki", "denrei", "Kanri"]) assert.equal(wordOf(word), null, word);
});

test("a first word that is no role and no word exits 2 with the usage and the --root line, writing nothing (spec 4.1)", () => {
  const ws = workspace();
  // A spawner that beats, so that a launcher that took the root as its first
  // word still starts none.
  const child = strangerPid(ws, Date.now());
  try {
    for (const argv of [[ws.root], ["down"], ["kikak"]]) {
      const got = launch(ws, [...argv, "--timeout", "1000"]);
      assert.equal(got.code, 2, argv.join(" "));
      assert.match(got.err, /^Usage: tanto/);
      assert.match(got.err, /a root is given with --root$/m);
    }
    assert.equal(fs.existsSync(path.join(ws.root, ".tanto", "spawner", "requests")), false);
  } finally {
    child.kill();
  }
});

test("taiseki at the launcher names the word to say in the seat, and does nothing (spec 4.1)", () => {
  const ws = workspace();
  const got = launch(ws, ["退席"]);
  assert.equal(got.code, 2);
  assert.equal(got.out.trim(), "taiseki is said in the seat it ends: /tanto taiseki");
  assert.equal(fs.existsSync(path.join(ws.root, ".tanto")), false);
});

test("the Kanri spawn the launcher writes carries contract: 2 (spec 1.1)", () => {
  const ws = workspace();
  const got = launch(ws, ["kanri", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "spawn")
      .map((r) => [r.role, r.prompt, r.contract]),
    [["kanri", "/tanto kanri", 2]],
  );
});

test("tanto kikaku with no Kikaku held asks for one, and for no Kanri (spec 4.2)", () => {
  const ws = workspace();
  const got = launch(ws, ["kikaku", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "spawn")
      .map((r) => [r.role, r.topic, r.prompt, r.model, r.contract]),
    [["kikaku", "—", "/tanto kikaku", "fable", 2]],
  );
});

test("tanto hosa enters the Hosa the state file holds, parked or not, and asks for none (spec 4.2)", () => {
  const ws = workspace();
  writeSeats(ws, [{ sessionId: "sess-hosa", id: "bg31", role: "hosa", topic: "—", status: "parked", contract: 2 }]);
  const got = launch(ws, ["ほさ", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
});

test("sekkei, keikaku, and jisso are entered, never started: none held is said, two held want a topic (spec 4.2)", () => {
  const ws = workspace();
  writeSeats(ws, [
    { sessionId: "sess-kanri", id: "bg02", role: "kanri", topic: "—", status: "running", contract: 2 },
    { sessionId: "sess-k1", id: "bg41", role: "keikaku", topic: "topic-a", status: "parked", contract: 2 },
    { sessionId: "sess-k2", id: "bg42", role: "keikaku", topic: "topic-b", status: "parked", contract: 2 },
  ]);
  const child = quietSpawner(ws);
  try {
    const none = launch(ws, ["sekkei", "--timeout", "5000"]);
    assert.equal(none.code, 1);
    assert.match(none.out, /^no sekkei is held; Kanri starts one — tanto kanri$/m);
    const two = launch(ws, ["keikaku", "--timeout", "5000"]);
    assert.equal(two.code, 2);
    assert.match(two.err, /^ {2}tanto keikaku topic-a$/m);
    assert.match(two.err, /^ {2}tanto keikaku topic-b$/m);
    const one = launch(ws, ["計画", "topic-b", "-n", "--timeout", "5000"]);
    assert.equal(one.code, 0, one.err);
    assert.deepEqual(requests(ws), []);
  } finally {
    child.kill();
  }
});

test("kaiseki: a topic names the attached one, none held starts a standalone one, two held want a topic (spec 4.2)", () => {
  const ws = workspace();
  writeSeats(ws, [{ sessionId: "sess-kanri", id: "bg02", role: "kanri", topic: "—", status: "running", contract: 2 }]);
  const missing = launch(ws, ["kaiseki", "topic-a", "--timeout", "20000"]);
  assert.equal(missing.code, 1);
  assert.match(missing.out, /^no kaiseki topic-a is held; Kanri starts one — tanto kanri$/m);
  const standalone = launch(ws, ["解析", "--timeout", "20000"]);
  assert.equal(standalone.code, 0, standalone.err);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "spawn")
      .map((r) => [r.role, r.topic, r.prompt, r.contract]),
    [["kaiseki", "—", "/tanto kaiseki", 2]],
  );
  const both = workspace();
  writeSeats(both, [
    { sessionId: "sess-ka1", id: "bg51", role: "kaiseki", topic: "—", status: "parked", contract: 2 },
    { sessionId: "sess-ka2", id: "bg52", role: "kaiseki", topic: "topic-a", status: "parked", contract: 2 },
  ]);
  const two = launch(both, ["kaiseki", "--timeout", "20000"]);
  assert.equal(two.code, 2);
  assert.match(two.err, /^ {2}tanto kaiseki topic-a$/m);
});

test("an older spawner: a listed Kanri is still entered, and any other act prints the restart line and writes nothing (spec 4.2)", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  // A spawner that beats and wrote no `contract` file.
  // A seat the listing has lost, which a launcher on the new contract would
  // resume on this path: the older spawner is written nothing, resume included.
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "running" },
    { sessionId: "sess-jisso", id: "bg08", role: "jisso", topic: "t", status: "running" },
  ]);
  const child = strangerPid(ws, Date.now());
  const lost = workspace([{ ...LIVE_KANRI, hidden: true }]);
  writeRoster(lost, "live", "/tmp/sess-live.jsonl");
  writeSeats(lost, [{ sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "gone" }]);
  const lostChild = strangerPid(lost, Date.now());
  try {
    const entered = launch(ws, ["kanri", "--timeout", "1000"]);
    assert.equal(entered.code, 0, entered.err);
    const refused = [
      [ws, ["kikaku"]],
      [ws, ["fukki"]],
      [ws, ["hosa", "-n"]],
      [lost, ["kanri"]],
    ];
    for (const [where, argv] of refused) {
      const got = launch(where, [...argv, "--timeout", "1000"]);
      assert.equal(got.code, 1, argv.join(" "));
      assert.match(got.out, /^the spawner is older than this launcher: run tanto teishi, then tanto$/m);
    }
    assert.deepEqual(requests(ws), []);
    assert.deepEqual(requests(lost), []);
  } finally {
    child.kill();
    lostChild.kill();
  }
});

test("a run that has not moved: a Kikaku and a standalone Kaiseki start, and every seat Kanri addresses waits for the move (spec 4.2)", () => {
  const ws = workspace();
  writeSeats(ws, [
    { sessionId: "sess-kanri", id: "bg02", role: "kanri", topic: "—", status: "running" },
    { sessionId: "sess-jisso", id: "bg03", role: "jisso", topic: "t", status: "running" },
  ]);
  for (const argv of [["hosa"], ["sekkei"], ["keikaku", "t"], ["jisso"], ["kaiseki", "t"]]) {
    const got = launch(ws, [...argv, "--timeout", "20000"]);
    assert.equal(got.code, 1, argv.join(" "));
    assert.match(got.out, /^this run is on the old contract — move it first: README, "Moving a run"$/m);
  }
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
  const kikaku = launch(ws, ["kikaku", "--timeout", "20000"]);
  assert.equal(kikaku.code, 0, kikaku.err);
  setState(ws, { next: { sessionId: "sess-kaiseki", id: "bg04" } });
  const kaiseki = launch(ws, ["kaiseki", "--timeout", "20000"]);
  assert.equal(kaiseki.code, 0, kaiseki.err);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "spawn")
      .map((r) => r.role),
    ["kikaku", "kaiseki"],
  );
});

test("teishi --seats keeps a following --root from being consumed as its value (Minor 10)", () => {
  const ws = workspace([
    {
      sessionId: "sess-live",
      name: "seat-live [ffffff]",
      cwd: ROOT,
      kind: "background",
      state: "running",
      id: "bg07",
      pid: 1111,
    },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  launch(ws, ["--timeout", "20000"]);
  const pidfile = path.join(ws.root, ".tanto", "spawner", "pid");
  assert.equal(fs.existsSync(pidfile), true);
  // Run from a cwd that is not ws.root: if `--seats` swallowed the `--root`
  // after it as its own value, the root would fall back to this cwd instead.
  const args = [LAUNCHER, "teishi", "--seats", "--root", ws.root, "--timeout", "20000"];
  const result = spawnSync(process.execPath, args, {
    encoding: "utf8",
    cwd: os.tmpdir(),
    env: {
      ...process.env,
      TANTO_CLAUDE_NODE: ws.fake,
      TANTO_NOTICE_LOG: path.join(ws.root, "notices.txt"),
      CLAUDE_CONFIG_DIR: ws.root,
      FAKE_STATE: ws.state,
      FAKE_LOG: ws.log,
    },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(pidfile), false);
});

test("an interactive first row is refused before any seat is resumed or attached (spec 4.3)", () => {
  const ws = workspace([
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: ROOT, kind: "interactive", id: "tab1", pid: 1111 },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [
    { sessionId: "sess-live", id: "tab1", name: "seat-live [ffffff]", role: "kanri", status: "running" },
    { sessionId: "sess-gone", id: "bg08", name: "seat-gone [eeeeee]", role: "jisso", status: "running" },
  ]);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 1);
  assert.equal(requests(ws).filter((r) => r.op === "resume").length, 0);
  assert.deepEqual(attaches(ws), []);
});

test("teishi --seats retires the run, and the next tanto spawns a fresh Kanri", () => {
  const ws = workspace([
    {
      sessionId: "sess-live",
      name: "seat-live [ffffff]",
      cwd: ROOT,
      kind: "background",
      state: "running",
      id: "bg07",
      pid: 1111,
    },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "running" },
  ]);
  launch(ws, ["kanri", "--timeout", "20000"]);
  // The CLI drops a background session it stops from the listing.
  setState(ws, { dropsOnStop: true });
  launch(ws, ["teishi", "--timeout", "20000", "--seats"]);
  const got = launch(ws, ["kanri", "--timeout", "20000"]);
  assert.equal(got.code, 0);
  // A stopped seat is not resumed, so the roster's first row is no Kanri
  // any more and step 4 asks for a new one.
  assert.equal(requests(ws).filter((r) => r.op === "resume").length, 0);
  assert.equal(requests(ws).filter((r) => r.op === "spawn" && r.role === "kanri").length, 1);
  assert.equal(lastAttach(ws), "bg01", got.err);
});

test("a stopped seat is not resumed", () => {
  const ws = workspace([
    {
      sessionId: "sess-live",
      name: "seat-live [ffffff]",
      cwd: ROOT,
      kind: "background",
      state: "running",
      id: "bg07",
      pid: 1111,
    },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [{ sessionId: "sess-old", id: "bg05", name: "seat-old [dddddd]", role: "jisso", status: "stopped" }]);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(lastAttach(ws), "bg07", got.err);
  assert.equal(requests(ws).filter((r) => r.op === "resume").length, 0);
  assert.equal(/tanto fukki/.test(got.out), false);
});

test("teishi stops the spawner and removes its pidfile", () => {
  const ws = workspace([
    {
      sessionId: "sess-live",
      name: "seat-live [ffffff]",
      cwd: ROOT,
      kind: "background",
      state: "running",
      id: "bg07",
      pid: 1111,
    },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  launch(ws, ["--timeout", "20000"]);
  const pidfile = path.join(ws.root, ".tanto", "spawner", "pid");
  assert.equal(fs.existsSync(pidfile), true);
  const got = launch(ws, ["teishi"]);
  assert.equal(got.code, 0);
  assert.equal(fs.existsSync(pidfile), false);
});

test("teishi --seats writes a stop request for every running seat", () => {
  const ws = workspace([
    {
      sessionId: "sess-live",
      name: "seat-live [ffffff]",
      cwd: ROOT,
      kind: "background",
      state: "running",
      id: "bg07",
      pid: 1111,
    },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  launch(ws, ["--timeout", "20000"]);
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "running" },
    { sessionId: "sess-old", id: "bg05", name: "seat-old [dddddd]", role: "jisso", status: "stopped" },
  ]);
  launch(ws, ["teishi", "--seats", "--timeout", "20000"]);
  const stops = requests(ws).filter((r) => r.op === "stop");
  assert.deepEqual(
    stops.map((r) => r.sessionId),
    ["sess-live"],
  );
});

test("teishi --seats stops every seat the state file holds, parked and gone ones as well as listed ones (spec 4.6)", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  launch(ws, ["kanri", "--timeout", "20000"]);
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "running", contract: 2 },
    { sessionId: "sess-parked", id: "bg12", role: "sekkei", topic: "t", status: "parked", contract: 2 },
    { sessionId: "sess-gone", id: "bg13", role: "jisso", topic: "t", status: "gone", contract: 2 },
    { sessionId: "sess-old", id: "bg05", role: "jisso", topic: "t", status: "stopped" },
  ]);
  const got = launch(ws, ["停止", "--seats", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "stop")
      .map((r) => r.sessionId)
      .sort(),
    ["sess-gone", "sess-live", "sess-parked"],
  );
});

test("teishi --seats stops a parked and a gone seat that carry no contract mark, as it stops a marked one (spec 4.6)", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  launch(ws, ["kanri", "--timeout", "20000"]);
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "running", contract: 2 },
    { sessionId: "sess-parked", id: "bg12", role: "sekkei", topic: "t", status: "parked" },
    { sessionId: "sess-gone", id: "bg13", role: "jisso", topic: "t", status: "gone" },
    { sessionId: "sess-old", id: "bg05", role: "jisso", topic: "t", status: "stopped" },
  ]);
  const got = launch(ws, ["停止", "--seats", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "stop")
      .map((r) => r.sessionId)
      .sort(),
    ["sess-gone", "sess-live", "sess-parked"],
  );
});

test("teishi removes the contract file with pid and heartbeat (spec 4.2, 4.6)", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  launch(ws, ["kanri", "--timeout", "20000"]);
  const dir = path.join(ws.root, ".tanto", "spawner");
  assert.equal(fs.readFileSync(path.join(dir, "contract"), "utf8").trim(), "2");
  const got = launch(ws, ["stop"]);
  assert.equal(got.code, 0, got.err);
  assert.equal(got.out.trim(), "tanto teishi: spawner stopped; the conversations are kept");
  for (const name of ["pid", "heartbeat", "contract"]) assert.equal(fs.existsSync(path.join(dir, name)), false, name);
});

test("an old-shape roster earns one line naming its roles, a cleared row no longer among them, and the launcher goes on (spec 4.7; roster-ledger 2.2)", () => {
  const ws = workspace([LIVE_KANRI]);
  const row = (role, topic, status, sessionId) =>
    `| ${role} | ${topic} | x-${role} | ${ws.root} | sonnet | high | main | auto | 2026-10-05 09:00 | ${status} | /tmp/${sessionId}.jsonl |`;
  fs.mkdirSync(path.join(ws.root, ".tanto"), { recursive: true });
  const roster = [
    ...ROSTER_HEAD,
    row("kanri", "—", "live", "sess-live"),
    row("kikaku", "—", "cleared", "sess-tab"),
    row("sekkei", "t", "live", "sess-sekkei"),
    row("jisso", "t", "stopped", "sess-jisso"),
  ];
  fs.writeFileSync(path.join(ws.root, ".tanto", "roster.md"), `${roster.join("\n")}\n`);
  writeSeats(ws, [{ sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "running", contract: 2 }]);
  const old = launch(ws, ["kanri", "--timeout", "20000"]);
  assert.equal(old.code, 0, old.err);
  const line =
    'old-contract rows in .tanto/roster.md (sekkei): those windows are no longer seats of this run — see the README, "Moving a run"';
  assert.equal(old.out.split(/\r?\n/).filter((l) => l === line).length, 1, old.out);
  assert.deepEqual(attaches(ws), ["bg07"]);
  fs.writeFileSync(
    path.join(ws.root, ".tanto", "roster.md"),
    `${[...ROSTER_HEAD, row("kanri", "—", "live", "sess-live")].join("\n")}\n`,
  );
  const moved = launch(ws, ["kanri", "--timeout", "20000"]);
  assert.equal(moved.out.includes("old-contract rows"), false, moved.out);
});

test("a listing entry counts by its pid, whatever its state says (spec 2.6)", () => {
  const ws = workspace([{ ...LIVE_KANRI, state: "stopped" }]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const got = launch(ws, ["kanri", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.deepEqual(attaches(ws), ["bg07"]);
  assert.equal(requests(ws).filter((r) => r.op === "spawn" || r.op === "resume").length, 0);
});

test("the launcher itself never runs claude --bg", () => {
  const ws = workspace();
  launch(ws, ["--timeout", "20000"]);
  const own = calls(ws).filter((argv) => argv.includes("--bg"));
  assert.equal(own.length, 1);
  const seats = JSON.parse(fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "seats.json"), "utf8")).seats;
  assert.equal(seats[0].role, "kanri");
});

test("the line on leaving a seat is printed before the attach, which runs on the seat's id", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const got = launch(ws, ["--timeout", "20000"]);
  const lines = got.out.split(/\r?\n/);
  assert.notEqual(lines.indexOf(LEAVE), -1, got.out);
  assert.deepEqual(attaches(ws), ["bg07"]);
});

test("a Kanri seats.json holds as gone is resumed, never spawned again", () => {
  // The human's `/stop`, or a crash while the spawner ran: the listing has
  // lost it, and --resume still finds it by sessionId (spec 4.2).
  const ws = workspace([{ ...LIVE_KANRI, hidden: true }]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "gone", goneAt: "x" },
  ]);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "resume")
      .map((r) => r.sessionId),
    ["sess-live"],
  );
  const lines = got.out.split(/\r?\n/);
  assert.notEqual(lines.indexOf(LEAVE), -1, got.out);
  assert.deepEqual(attaches(ws), ["bg07"]);
});

test("a pid-less listing entry is not read as a live seat, and gets a resume request (fix 1)", () => {
  const ws = workspace([
    // The measured real shape (R-11, S-54): a sessionId with no pid and no
    // status, for a process that already exited hours earlier.
    { sessionId: "sess-live", name: "seat-live [ffffff]", cwd: ROOT, kind: "background", state: "blocked" },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "running" },
    { sessionId: "sess-gone", id: "bg08", name: "seat-gone [eeeeee]", role: "jisso", status: "running" },
  ]);
  const got = launch(ws, ["--timeout", "20000"]);
  const resumed = requests(ws).filter((r) => r.op === "resume");
  assert.deepEqual(resumed.map((r) => r.sessionId).sort(), ["sess-gone", "sess-live"]);
  assert.doesNotMatch(got.out, /tanto fukki/);
});

test("a Kanri resume that fails says so in one line and spawns a new Kanri", () => {
  const ws = workspace();
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeSeats(ws, [{ sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "gone" }]);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.match(got.err, /^tanto: the Kanri resume failed — .*unknown session sess-live.*; spawning a new Kanri$/m);
  assert.equal(requests(ws).filter((r) => r.op === "spawn" && r.role === "kanri").length, 1);
  assert.equal(lastAttach(ws), "bg01", got.err);
});

test("a held: answer to the launcher's Kanri spawn enters the listed Kanri the spawner holds, the line first, and writes no second spawn (roster-ledger 6, f07a)", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "replaced", "/tmp/sess-before.jsonl");
  writeSeats(ws, [
    { sessionId: "sess-before", id: "bg03", name: "seat-before", role: "kanri", status: "stopped" },
    { sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "running", contract: 2 },
  ]);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.ok(got.out.split(/\r?\n/).includes(heldLine("sess-live")), got.out);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 1);
  assert.equal(requests(ws).filter((r) => r.op === "resume").length, 0);
  assert.deepEqual(attaches(ws), ["bg07"]);
});

test("a held: answer naming a gone Kanri enters it by the one resume with the fukki word, and writes no second spawn (roster-ledger 6)", () => {
  const ws = workspace([{ ...LIVE_KANRI, hidden: true }]);
  writeRoster(ws, "replaced", "/tmp/sess-before.jsonl");
  writeSeats(ws, [
    { sessionId: "sess-before", id: "bg03", name: "seat-before", role: "kanri", status: "stopped" },
    {
      sessionId: "sess-live",
      id: "bg07",
      name: "seat-live [ffffff]",
      role: "kanri",
      status: "gone",
      goneAt: "x",
      contract: 2,
    },
  ]);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.ok(got.out.split(/\r?\n/).includes(heldLine("sess-live")), got.out);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 1);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "resume")
      .map((r) => [r.sessionId, r.prompt]),
    [["sess-live", "/tanto fukki"]],
  );
  assert.deepEqual(attaches(ws), ["bg07"]);
});

test("a first row whose sessionId neither the listing nor the state file holds enters the state file's Kanri by role, the line first, and spawns none (roster-ledger 6, a14f)", () => {
  const ws = workspace([{ ...LIVE_KANRI, hidden: true }]);
  // f07a's cell: the separators lost, so the basename names no seat of the run.
  writeRoster(ws, "live", "C:Usersu.claudeprojectspsess-live.jsonl");
  writeSeats(ws, [
    {
      sessionId: "sess-live",
      id: "bg07",
      name: "seat-live [ffffff]",
      role: "kanri",
      status: "gone",
      goneAt: "x",
      contract: 2,
    },
  ]);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.ok(got.out.split(/\r?\n/).includes(heldLine("sess-live")), got.out);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "resume")
      .map((r) => [r.sessionId, r.prompt]),
    [["sess-live", "/tanto fukki"]],
  );
  assert.deepEqual(attaches(ws), ["bg07"]);
});

test("the roster's first row is read through boundary.js's cells(): a \\| inside a cell moves no column (roster-ledger 2.2)", () => {
  const ws = workspace([LIVE_KANRI]);
  fs.mkdirSync(path.join(ws.root, ".tanto"), { recursive: true });
  const row = `| kanri | — | seat-live [ffffff] | ${ws.root} \\| a copy | sonnet | high | main | auto | 2026-09-21 09:00 | live | /tmp/sess-live.jsonl | ${READINGS} |`;
  fs.writeFileSync(path.join(ws.root, ".tanto", "roster.md"), `${[...ROSTER_HEAD, row].join("\n")}\n`);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.deepEqual(attaches(ws), ["bg07"]);
  assert.equal(requests(ws).filter((r) => r.op === "spawn" || r.op === "resume").length, 0);
});

test("the trust hint comes before the line on leaving when .claude.json does not record the folder's trust", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  writeTrust(ws, false);
  const got = launch(ws, ["--timeout", "20000"]);
  const lines = got.out.split(/\r?\n/);
  const at = lines.indexOf(TRUST);
  assert.notEqual(at, -1, got.out);
  assert.equal(lines[at + 1], LEAVE);
  // The attach takes the screen, so the hint is printed again when it returns.
  assert.ok(lines.slice(at + 2).includes(TRUST), got.out);
});

test("a held Kikaku is entered under a hold, released when the attach ends, its context= said first (spec 4.3)", () => {
  const ws = workspace([
    {
      sessionId: "sess-kikaku",
      name: "x-kikaku-a1",
      cwd: ROOT,
      kind: "background",
      status: "idle",
      id: "bg21",
      pid: 1121,
    },
  ]);
  const transcript = writeTranscript(ws, "sess-kikaku", 96120);
  writeSeats(ws, [
    { sessionId: "sess-kikaku", id: "bg21", role: "kikaku", topic: "—", status: "running", contract: 2, transcript },
  ]);
  const got = launch(ws, ["kikaku", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.deepEqual(attaches(ws), ["bg21"]);
  const own = requests(ws).filter((r) => r.sessionId === "sess-kikaku");
  assert.deepEqual(own.map((r) => r.op).sort(), ["hold", "release"]);
  assert.equal(typeof own[0].pid, "number");
  const lines = got.out.split(/\r?\n/);
  assert.equal(lines[lines.indexOf(LEAVE) - 1], "kikaku — context=96120");
  // The attach takes the screen, so the context line is printed again when it returns.
  assert.ok(lines.slice(lines.indexOf(LEAVE) + 1).includes("left kikaku — context=96120"), got.out);
});

test("a Kikaku spawned with no contract mark is entered with one attach: its hold answers old-contract seat, and no release follows (spec 4.3)", () => {
  const ws = workspace([
    {
      sessionId: "sess-kikaku",
      name: "x-kikaku-a1",
      cwd: ROOT,
      kind: "background",
      status: "idle",
      id: "bg21",
      pid: 1121,
    },
  ]);
  writeSeats(ws, [{ sessionId: "sess-kikaku", id: "bg21", role: "kikaku", topic: "—", status: "running" }]);
  const got = launch(ws, ["kikaku", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.doesNotMatch(got.err, /the hold on kikaku failed/);
  assert.deepEqual(attaches(ws), ["bg21"]);
  const own = requests(ws).filter((r) => r.sessionId === "sess-kikaku");
  assert.deepEqual(
    own.map((r) => r.op),
    ["hold"],
  );
  assert.equal(own[0].error, "old-contract seat");
});

test("a seat a VS Code tab holds is refused: a Kikaku at its hold, a Jisso at the listing (spec 4.3)", () => {
  const tab = { name: "x-05", cwd: ROOT, kind: "interactive", pid: 1131 };
  const kikaku = workspace([{ ...tab, sessionId: "sess-kikaku", id: "bg22" }]);
  writeSeats(kikaku, [
    { sessionId: "sess-kikaku", id: "bg22", role: "kikaku", topic: "—", status: "running", contract: 2 },
  ]);
  const refused = launch(kikaku, ["kikaku", "--timeout", "20000"]);
  assert.equal(refused.code, 1);
  assert.match(refused.out, /^kikaku is open in a VS Code tab; close the tab and run this again$/m);
  assert.deepEqual(attaches(kikaku), []);
  const jisso = workspace([{ ...tab, sessionId: "sess-jisso", id: "bg23" }]);
  writeSeats(jisso, [
    { sessionId: "sess-jisso", id: "bg23", role: "jisso", topic: "t", status: "running", contract: 2 },
  ]);
  const listed = launch(jisso, ["jisso", "--timeout", "20000"]);
  assert.equal(listed.code, 1);
  assert.match(listed.out, /^jisso is open in a VS Code tab; close the tab and run this again$/m);
  assert.equal(requests(jisso).filter((r) => r.op === "hold").length, 0);
  assert.deepEqual(attaches(jisso), []);
});

test("a Kanri that hands over while the human is attached is followed to its successor, with nothing typed (spec 4.3)", () => {
  const ws = workspace([
    LIVE_KANRI,
    { sessionId: "sess-next", name: "seat-next", cwd: ROOT, kind: "background", id: "bg09", pid: 1112 },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const kanri = { sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", contract: 2 };
  const next = { sessionId: "sess-next", id: "bg09", role: "kanri", topic: "—", status: "running", contract: 2 };
  writeSeats(ws, [{ ...kanri, status: "running" }]);
  // During the first attach the outgoing Kanri is stopped and its successor
  // takes the roster's first row; nothing changes during the second.
  const row = `| kanri | — | seat-next | ${ws.root} | sonnet | high | main | auto | 2026-10-05 09:00 | live | /tmp/sess-next.jsonl |`;
  onAttach(ws, [
    {
      ".tanto/spawner/seats.json": JSON.stringify({ seats: [{ ...kanri, status: "stopped" }, next] }),
      ".tanto/roster.md": `${[...ROSTER_HEAD, row].join("\n")}\n`,
    },
  ]);
  const child = quietSpawner(ws);
  try {
    const got = launch(ws, ["kanri", "--timeout", "5000"]);
    assert.equal(got.code, 0, got.err);
    assert.deepEqual(attaches(ws), ["bg07", "bg09"]);
    assert.deepEqual(requests(ws), []);
  } finally {
    child.kill();
  }
});

test("a Kanri that hands over is followed when the spawner records its stop a second after the attach returns (spec 4.3, step 5)", () => {
  const ws = workspace([
    LIVE_KANRI,
    { sessionId: "sess-next", name: "seat-next", cwd: ROOT, kind: "background", id: "bg09", pid: 1112 },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const kanri = { sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", contract: 2 };
  const next = { sessionId: "sess-next", id: "bg09", role: "kanri", topic: "—", status: "running", contract: 2 };
  writeSeats(ws, [{ ...kanri, status: "running" }]);
  // The successor's `stop` ends the attach, and the spawner writes the state
  // file only after the command returns: the attach writes the roster's new
  // first row, and a detached child writes `stopped` a second later.
  const row = `| kanri | — | seat-next | ${ws.root} | sonnet | high | main | auto | 2026-10-05 09:00 | live | /tmp/sess-next.jsonl |`;
  onAttach(ws, [
    {
      ".tanto/roster.md": `${[...ROSTER_HEAD, row].join("\n")}\n`,
      "@later": {
        ms: 1000,
        files: { ".tanto/spawner/seats.json": JSON.stringify({ seats: [{ ...kanri, status: "stopped" }, next] }) },
      },
    },
  ]);
  const child = quietSpawner(ws);
  try {
    const got = launch(ws, ["kanri", "--timeout", "5000"]);
    assert.equal(got.code, 0, got.err);
    assert.deepEqual(attaches(ws), ["bg07", "bg09"]);
    assert.deepEqual(requests(ws), []);
  } finally {
    child.kill();
  }
});

test("a Kanri with no contract mark that hands over is followed to its successor, and no hold is written for it (spec 4.3)", () => {
  const ws = workspace([
    LIVE_KANRI,
    { sessionId: "sess-next", name: "seat-next", cwd: ROOT, kind: "background", id: "bg09", pid: 1112 },
  ]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const kanri = { sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—" };
  const next = { sessionId: "sess-next", id: "bg09", role: "kanri", topic: "—", status: "running" };
  writeSeats(ws, [{ ...kanri, status: "running" }]);
  const row = `| kanri | — | seat-next | ${ws.root} | sonnet | high | main | auto | 2026-10-05 09:00 | live | /tmp/sess-next.jsonl |`;
  onAttach(ws, [
    {
      ".tanto/spawner/seats.json": JSON.stringify({ seats: [{ ...kanri, status: "stopped" }, next] }),
      ".tanto/roster.md": `${[...ROSTER_HEAD, row].join("\n")}\n`,
    },
  ]);
  const child = quietSpawner(ws);
  try {
    const got = launch(ws, ["kanri", "--timeout", "5000"]);
    assert.equal(got.code, 0, got.err);
    assert.deepEqual(attaches(ws), ["bg07", "bg09"]);
    assert.deepEqual(requests(ws), []);
  } finally {
    child.kill();
  }
});

test("leaving the attach with no handover prints the run's seats once, and exits 0 (spec 4.3, 4.5)", () => {
  const ws = workspace([{ ...LIVE_KANRI, status: "busy" }]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  // The hint is printed again after the attach: the listing follows it.
  writeTrust(ws, false);
  const transcript = writeTranscript(ws, "sess-sekkei", 212340);
  writeSeats(ws, [
    { sessionId: "sess-live", id: "bg07", role: "kanri", topic: "—", status: "running", contract: 2 },
    {
      sessionId: "sess-sekkei",
      id: "bg11",
      role: "sekkei",
      topic: "t",
      status: "parked",
      contract: 2,
      waiting: true,
      transcript,
    },
  ]);
  const child = quietSpawner(ws);
  try {
    const got = launch(ws, ["管理", "--timeout", "5000"]);
    assert.equal(got.code, 0, got.err);
    assert.deepEqual(attaches(ws), ["bg07"]);
    const lines = got.out.split(/\r?\n/);
    const listing = lines
      .slice(lines.indexOf(LEAVE) + 1)
      .filter((line) => line.length > 0 && line !== TRUST && !line.startsWith("left "));
    assert.equal(listing.length, 2, got.out);
    assert.match(listing[0], /^kanri\s+—\s+working$/);
    assert.match(listing[1], /^sekkei\s+t\s+parked — waiting for you\s+context=212340\s+tanto sekkei$/);
  } finally {
    child.kill();
  }
});

test("--no-attach starts the seat, prints its name and the ways in, and attaches nothing (spec 4.1)", () => {
  const ws = workspace();
  const got = launch(ws, ["-n", "hosa", "--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.deepEqual(attaches(ws), []);
  assert.deepEqual(
    requests(ws).map((r) => [r.op, r.role]),
    [["spawn", "hosa"]],
  );
  assert.match(
    got.out,
    /^hosa \S.* — enter it with tanto hosa, or by a click on its row in the editor's list after Developer: Reload Window$/m,
  );
});

test("no trust hint when .claude.json records the trust, is missing, or does not parse, and the file is never written", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "live", "/tmp/sess-live.jsonl");
  const file = path.join(ws.root, ".claude.json");
  writeTrust(ws, true);
  const recorded = fs.readFileSync(file, "utf8");
  assert.equal(launch(ws, ["--timeout", "20000"]).out.includes(TRUST), false);
  assert.equal(fs.readFileSync(file, "utf8"), recorded);
  fs.rmSync(file);
  assert.equal(launch(ws, ["--timeout", "20000"]).out.includes(TRUST), false);
  assert.equal(fs.existsSync(file), false);
  fs.writeFileSync(file, "{ not json");
  assert.equal(launch(ws, ["--timeout", "20000"]).out.includes(TRUST), false);
  assert.equal(fs.readFileSync(file, "utf8"), "{ not json");
});

/**
 * A live process that is no spawner, recorded in the workspace's `pid` file
 * (spec 4.3). A sleeping child the test ends itself stands for the PID a
 * crashed spawner left behind: a launcher that signalled it would end this
 * child, never the test's own process.
 */
function strangerPid(ws, heartbeat) {
  const child = spawn(process.execPath, ["-e", "setTimeout(() => {}, 120000)"], {
    stdio: "ignore",
    windowsHide: true,
  });
  const dir = path.join(ws.root, ".tanto", "spawner");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "pid"), `${child.pid}\n`);
  if (heartbeat !== undefined) fs.writeFileSync(path.join(dir, "heartbeat"), `${heartbeat}\n`);
  return child;
}

function alive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

test("a live pid with no heartbeat is not trusted: tanto starts a spawner and logs the stale pid (spec 4.2)", () => {
  const ws = workspace();
  const child = strangerPid(ws);
  try {
    const got = launch(ws, ["--timeout", "20000"]);
    assert.equal(got.code, 0, got.err);
    assert.equal(lastAttach(ws), "bg01", got.err);
    assert.ok(got.out.includes(`spawner pid ${child.pid} has no heartbeat`), got.out);
    const dir = path.join(ws.root, ".tanto", "spawner");
    assert.ok(fs.readFileSync(path.join(dir, "log"), "utf8").includes(`stale spawner pid ${child.pid} ignored`));
    assert.notEqual(Number(fs.readFileSync(path.join(dir, "pid"), "utf8").trim()), child.pid);
    assert.equal(alive(child.pid), true);
  } finally {
    child.kill();
  }
});

test("a live pid with a heartbeat of now is a running spawner: tanto starts none (spec 4.2)", () => {
  const ws = workspace();
  const child = strangerPid(ws, Date.now());
  const dir = path.join(ws.root, ".tanto", "spawner");
  try {
    // No spawner answers the Kanri request, so the launcher waits out its
    // timeout; what matters is that it started nothing.
    launch(ws, ["--timeout", "1000"]);
    assert.equal(Number(fs.readFileSync(path.join(dir, "pid"), "utf8").trim()), child.pid);
    assert.equal(fs.existsSync(path.join(dir, "log")), false);
  } finally {
    child.kill();
    fs.rmSync(path.join(dir, "pid"), { force: true });
    fs.rmSync(path.join(dir, "heartbeat"), { force: true });
  }
});

test("teishi with a stale heartbeat removes pid and heartbeat and signals nothing (spec 4.2)", () => {
  const ws = workspace();
  const child = strangerPid(ws, Date.now() - 120000);
  const dir = path.join(ws.root, ".tanto", "spawner");
  try {
    const got = launch(ws, ["teishi"]);
    assert.equal(got.code, 0, got.err);
    assert.equal(got.out.trim(), "no spawner running");
    assert.equal(fs.existsSync(path.join(dir, "pid")), false);
    assert.equal(fs.existsSync(path.join(dir, "heartbeat")), false);
    assert.equal(alive(child.pid), true);
  } finally {
    child.kill();
  }
});

test("teishi with a live pid and no heartbeat file names the pid to end by hand and signals nothing (D-6)", () => {
  const ws = workspace();
  const child = strangerPid(ws);
  const dir = path.join(ws.root, ".tanto", "spawner");
  try {
    const got = launch(ws, ["teishi"]);
    assert.equal(got.code, 0, got.err);
    assert.equal(
      got.out.trim(),
      `spawner pid ${child.pid} has no heartbeat — a spawner from before the heartbeat, or a reused pid; end it by hand if it is the spawner: taskkill /PID ${child.pid} (kill ${child.pid})`,
    );
    assert.equal(fs.existsSync(path.join(dir, "pid")), false);
    assert.equal(alive(child.pid), true);
  } finally {
    child.kill();
  }
});
