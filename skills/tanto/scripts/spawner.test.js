// The spawner's tests. No test starts a real session: the CLI is a fake Node
// script this file writes into a temp directory, named to the spawner through
// TANTO_CLAUDE_NODE, which records every argument list it is given and prints
// what `claude` prints.

const test = require("node:test");
const { after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const SPAWNER = path.join(__dirname, "spawner.js");
const BOUNDARY = path.join(__dirname, "boundary.js");
const TEMPLATES = path.join(__dirname, "..", "templates");

const FAKE = `
const fs = require("node:fs");
const argv = process.argv.slice(2);
const statePath = process.env.FAKE_STATE;
const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
fs.appendFileSync(process.env.FAKE_LOG, JSON.stringify(argv) + "\\n");
const fail = state.fail || {};
const sub = argv[0];
if (fail[sub]) {
  process.stderr.write(fail[sub] + "\\n");
  process.exit(1);
}
const save = () => fs.writeFileSync(statePath, JSON.stringify(state));
if (sub === "agents") {
  // A session marked hidden is the reboot case: the process is gone, so the
  // listing does not carry it, but --resume still finds it by sessionId.
  let sessions = state.sessions.filter((s) => !s.hidden);
  // agentsHideSessionId/agentsHideCount simulate a session that exists but
  // has not yet re-registered with the listing -- the window a single
  // post-resume poll used to miss (Important 8, branch-review.md).
  if (state.agentsHideSessionId && state.agentsHideCount > 0) {
    sessions = sessions.filter((s) => s.sessionId !== state.agentsHideSessionId);
    state.agentsHideCount -= 1;
    save();
  }
  process.stdout.write(JSON.stringify({ sessions }));
  process.exit(0);
}
if (sub === "stop" || sub === "rm") {
  const wanted = argv[1];
  const found = state.sessions.find((s) => s.sessionId === wanted || s.id === wanted);
  if (!found || (state.idForm === "short" && found.id !== wanted)) {
    process.stderr.write("unknown session " + wanted + "\\n");
    process.exit(1);
  }
  if (sub === "stop") {
    found.state = "stopped";
    if (state.dropsOnStop) state.sessions = state.sessions.filter((s) => s !== found);
  } else {
    state.sessions = state.sessions.filter((s) => s !== found);
    if (found.worktree) process.stdout.write("Removed worktree " + found.worktree + "\\n");
  }
  save();
  process.exit(0);
}
if (sub === "--resume") {
  const found = state.sessions.find((s) => s.sessionId === argv[1]);
  if (!found) {
    process.stderr.write("unknown session " + argv[1] + "\\n");
    process.exit(1);
  }
  found.name = (state.next && state.next.name) || found.name;
  found.id = (state.next && state.next.id) || found.id;
  found.state = "running";
  delete found.hidden;
  save();
  process.stdout.write("Resumed background session " + found.id + "\\n");
  process.exit(0);
}
if (argv.includes("--bg")) {
  const next = state.next || {};
  state.cwdSeen = process.cwd();
  const session = {
    pid: 4321,
    cwd: next.cwd || state.root,
    kind: "background",
    // The real CLI's --bg prints an epoch-millisecond number
    // (branch-review.md's Important 1); 2026-09-21T10:00:00Z as a number.
    startedAt: 1789984800000,
    sessionId: next.sessionId || "sess-new",
    name: next.name || "seat-new [aaaaaa]",
    id: next.id || "bg01",
    status: "running",
    state: next.state || "running",
  };
  if (next.worktree) session.worktree = next.worktree;
  state.sessions.push(session);
  save();
  process.stdout.write("Started background session " + session.id + "\\n");
  process.exit(0);
}
process.exit(0);
`;

let counter = 0;
const roots = [];
after(() => {
  for (const root of roots) {
    try {
      fs.rmSync(root, { recursive: true, force: true });
    } catch {
      // Best-effort cleanup (Minor 15, branch-review.md): a lingering handle
      // on Windows is not worth failing the suite over.
    }
  }
});

/** A temp root with .tanto/spawner/ and a fake CLI beside it. */
function workspace(sessions = []) {
  counter += 1;
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `tanto-spawner-${counter}-`));
  roots.push(root);
  fs.mkdirSync(path.join(root, ".tanto", "spawner", "requests"), { recursive: true });
  fs.mkdirSync(path.join(root, ".tanto", "spawner", "results"), { recursive: true });
  const fake = path.join(root, "fake-claude.js");
  fs.writeFileSync(fake, FAKE);
  const state = path.join(root, "fake-state.json");
  fs.writeFileSync(state, JSON.stringify({ root, sessions, next: {} }));
  return { root, fake, state, log: path.join(root, "fake-log.txt"), notices: path.join(root, "notices.txt") };
}

function setState(ws, patch) {
  const state = JSON.parse(fs.readFileSync(ws.state, "utf8"));
  fs.writeFileSync(ws.state, JSON.stringify({ ...state, ...patch }));
}

function run(ws, argv, opts = {}) {
  const result = spawnSync(process.execPath, [SPAWNER, ...argv], {
    encoding: "utf8",
    env: {
      ...process.env,
      TANTO_CLAUDE_NODE: ws.fake,
      TANTO_NOTICE_LOG: ws.notices,
      FAKE_STATE: ws.state,
      FAKE_LOG: ws.log,
    },
    ...opts,
  });
  return { code: result.status, out: result.stdout || "", err: result.stderr || "" };
}

/** Write one request file; the caller still runs `run --once` to take it. */
function request(ws, body) {
  const id = `2026-09-21T10-00-00-${Math.random().toString(36).slice(2, 8)}`;
  const file = path.join(ws.root, ".tanto", "spawner", "requests", `${id}.json`);
  fs.writeFileSync(file, JSON.stringify(body));
  return { id, file };
}

function result(ws, id) {
  const file = path.join(ws.root, ".tanto", "spawner", "results", `${id}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function seats(ws) {
  const file = path.join(ws.root, ".tanto", "spawner", "seats.json");
  return JSON.parse(fs.readFileSync(file, "utf8")).seats;
}

function calls(ws) {
  if (!fs.existsSync(ws.log)) return [];
  return fs
    .readFileSync(ws.log, "utf8")
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line));
}

function notices(ws) {
  if (!fs.existsSync(ws.notices)) return [];
  return fs
    .readFileSync(ws.notices, "utf8")
    .split("\n")
    .filter((line) => line.length > 0);
}

const SPAWN = {
  op: "spawn",
  role: "jisso",
  topic: "t",
  model: "sonnet",
  effort: "xhigh",
  branch: "t",
  mode: "auto",
  prompt: "/tanto jisso batch=.tanto/t/batch-A-prompt.md",
};

test("no argument prints the usage line and exits 2", () => {
  const ws = workspace();
  const got = run(ws, []);
  assert.equal(got.code, 2);
  assert.match(got.err, /^Usage: spawner\.js/);
});

test("notify --text raises the notice through the log channel", () => {
  const ws = workspace();
  const got = run(ws, ["notify", "--text", "kessai: t — claude attach bg01"]);
  assert.equal(got.code, 0);
  assert.deepEqual(notices(ws), ["kessai: t — claude attach bg01"]);
});

test("notify --stdin reads the hook payload and raises one notice", () => {
  const ws = workspace();
  const payload = JSON.stringify({
    session_id: "sess-1",
    cwd: ws.root,
    transcript_path: "/tmp/sess-1.jsonl",
    notification_type: "permission_prompt",
  });
  // Through the shared `run` helper, not a one-off spawnSync (Minor 15,
  // branch-review.md): `notify` never touches the CLI, but going through the
  // same TANTO_CLAUDE_NODE seam as every other test keeps this one from
  // silently drifting off it.
  const got = run(ws, ["notify", "--stdin"], { input: payload });
  assert.equal(got.code, 0);
  assert.equal(notices(ws).length, 1);
  assert.match(notices(ws)[0], /permission_prompt/);
});

test("the notice command is the platform's, and nothing is installed for it", () => {
  const { noticeCommand } = require("./spawner.js");
  assert.equal(noticeCommand("x", "win32")[0], "powershell");
  assert.match(noticeCommand("x", "win32")[1].join(" "), /ToastNotificationManager/);
  assert.equal(noticeCommand("x", "darwin")[0], "osascript");
  assert.equal(noticeCommand("x", "linux")[0], "notify-send");
});

test("the darwin notice command escapes quotes and backslashes (Important 12)", () => {
  const { noticeCommand } = require("./spawner.js");
  const text = 'say "hi" \\ done';
  const escaped = text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const [file, args] = noticeCommand(text, "darwin");
  assert.equal(file, "osascript");
  assert.equal(args[1], `display notification "${escaped}" with title "tanto"`);
});

test("a spawn writes the result, the seat, and deletes the request", () => {
  const ws = workspace();
  const { id, file } = request(ws, SPAWN);
  assert.equal(run(ws, ["run", "--root", ws.root, "--once"]).code, 0);
  const got = result(ws, id);
  assert.equal(got.op, "spawn");
  assert.equal(got.sessionId, "sess-new");
  assert.equal(got.name, "seat-new [aaaaaa]");
  assert.equal(got.cwd, ws.root);
  assert.equal(got.id, "bg01");
  assert.match(got.startedAt, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  assert.equal(seats(ws)[0].startedAt, got.startedAt);
  assert.equal(fs.existsSync(file), false);
  assert.equal(seats(ws)[0].status, "running");
  assert.equal(seats(ws)[0].role, "jisso");
});

test("a spawn's command line carries the flags the request names", () => {
  const ws = workspace();
  request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const spawned = calls(ws).find((argv) => argv.includes("--bg"));
  assert.deepEqual(spawned, [
    "--bg",
    "--model",
    "sonnet",
    "--effort",
    "xhigh",
    "--permission-mode",
    "auto",
    "-w",
    "shoki-t",
    "--add-dir",
    ws.root,
    SPAWN.prompt,
  ]);
});

test("a --bg child's cwd is the workspace root, not wherever the spawner was started", () => {
  const ws = workspace();
  request(ws, SPAWN);
  // The spawner itself is started from a directory that has nothing to do
  // with the workspace, exactly as `tanto.js` does not guarantee and a
  // hand-run `node spawner.js run --root X` never did (Critical 1,
  // branch-review.md).
  const got = run(ws, ["run", "--root", ws.root, "--once"], { cwd: os.tmpdir() });
  assert.equal(got.code, 0);
  const state = JSON.parse(fs.readFileSync(ws.state, "utf8"));
  assert.equal(fs.realpathSync(state.cwdSeen), fs.realpathSync(ws.root));
});

test("a spawn's startedAt reaches the roster's Started cell in the same shape", () => {
  const ws = workspace();
  const { id } = request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const got = result(ws, id);
  assert.match(got.startedAt, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);

  const ledger = path.join(ws.root, "kanri.md");
  const roster = path.join(ws.root, "roster.md");
  fs.copyFileSync(path.join(TEMPLATES, "kanri.md"), ledger);
  fs.copyFileSync(path.join(TEMPLATES, "roster.md"), roster);
  const seatFile = path.join(ws.root, "seat-result.json");
  fs.writeFileSync(seatFile, JSON.stringify(got));
  const recorded = spawnSync(
    process.execPath,
    [BOUNDARY, "record", "--ledger", ledger, "--roster", roster, "--seat", seatFile],
    { encoding: "utf8", cwd: ws.root },
  );
  assert.equal(recorded.status, 0, recorded.stderr);
  const rosterText = fs.readFileSync(roster, "utf8");
  const line = rosterText.split("\n").find((l) => l.includes(got.name));
  assert.ok(line, rosterText);
  assert.ok(line.includes(`| ${got.startedAt} |`), line);
});

test("a pre-spawn listing failure is reported, and claude --bg never runs (Important 9)", () => {
  const ws = workspace();
  setState(ws, { fail: { agents: "listing broke" } });
  const { id } = request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const got = result(ws, id);
  assert.match(got.error, /listing broke/);
  assert.equal(calls(ws).filter((argv) => argv.includes("--bg")).length, 0);
  assert.equal(seats(ws).length, 0);
});

test("a failing spawn writes error and stderr, and no seat", () => {
  const ws = workspace();
  setState(ws, { fail: { "--bg": "classifier refused" } });
  const { id } = request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const got = result(ws, id);
  assert.match(got.error, /classifier refused/);
  assert.equal(got.sessionId, undefined);
  assert.equal(seats(ws).length, 0);
});

test("stop marks the seat stopped and keeps the conversation", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const { id } = request(ws, { op: "stop", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).stopped, /2026|\d{4}/);
  assert.equal(seats(ws)[0].status, "stopped");
});

test("stop falls back to the short id when the CLI takes only that form", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, { idForm: "short" });
  const { id } = request(ws, { op: "stop", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, id).error, undefined);
  const stops = calls(ws).filter((argv) => argv[0] === "stop");
  assert.deepEqual(
    stops.map((argv) => argv[1]),
    ["sess-new", "bg01"],
  );
});

test("rm reports the worktree it removed", () => {
  const ws = workspace();
  setState(ws, { next: { sessionId: "sess-shoki", id: "bg09", worktree: "/repo/.claude/worktrees/shoki-t" } });
  request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const { id } = request(ws, { op: "rm", sessionId: "sess-shoki" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).removed, /\d/);
  assert.match(result(ws, id).worktree, /shoki-t/);
  assert.equal(seats(ws)[0].status, "removed");
});

test("resume passes --resume <sessionId> --bg and no other flag", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, { next: { name: "seat-back [bbbbbb]", id: "bg02" } });
  const { id } = request(ws, { op: "resume", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const resumed = calls(ws).find((argv) => argv[0] === "--resume");
  assert.deepEqual(resumed, ["--resume", "sess-new", "--bg"]);
  assert.equal(result(ws, id).sessionId, "sess-new");
  assert.equal(result(ws, id).name, "seat-back [bbbbbb]");
});

test("resume polls the listing until the resumed session reappears (Important 8)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, { sessions: [] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "gone");
  assert.match(seats(ws)[0].goneAt, /\d/);
  setState(ws, {
    sessions: [
      {
        sessionId: "sess-new",
        name: "seat-back [bbbbbb]",
        cwd: ws.root,
        kind: "background",
        state: "running",
        id: "bg02",
      },
    ],
    next: { name: "seat-back [bbbbbb]", id: "bg02" },
    // The session exists in the backing store already -- the fake's own
    // "--resume" handler finds it there -- but the first listing after the
    // resume still misses it, exactly as a single, un-retried poll used to
    // (Important 8, branch-review.md).
    agentsHideSessionId: "sess-new",
    agentsHideCount: 1,
  });
  const { id } = request(ws, { op: "resume", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const got = result(ws, id);
  assert.equal(got.name, "seat-back [bbbbbb]");
  assert.equal(seats(ws)[0].status, "running");
  assert.equal(seats(ws)[0].goneAt, undefined);
});

test("attention fills a bare id from seats.json and names its channel", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const { id } = request(ws, {
    op: "attention",
    sessionId: "sess-new",
    message: "human-needed: jisso t — claude attach <id>",
  });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, id).channel, "log");
  assert.match(result(ws, id).notified, /\d/);
  assert.deepEqual(notices(ws), ["human-needed: jisso t — claude attach bg01"]);
});

test("ack clears the renamed mark of the session it names", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, {
    sessions: [
      {
        sessionId: "sess-new",
        name: "seat-two [cccccc]",
        cwd: ws.root,
        kind: "background",
        state: "running",
        id: "bg01",
      },
    ],
  });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].renamed, "seat-new [aaaaaa]");
  const { id } = request(ws, { op: "ack", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).acked, /\d/);
  assert.equal(seats(ws)[0].renamed, undefined);
  assert.equal(seats(ws)[0].name, "seat-two [cccccc]");
});

test("an unparseable request writes an error result and a log line (Important 10)", () => {
  const ws = workspace();
  const file = path.join(ws.root, ".tanto", "spawner", "requests", "2026-09-21T10-00-00-zzz.json");
  fs.writeFileSync(file, "not json");
  run(ws, ["run", "--root", ws.root, "--once"]);
  const resultFile = path.join(ws.root, ".tanto", "spawner", "results", "2026-09-21T10-00-00-zzz.json");
  assert.deepEqual(JSON.parse(fs.readFileSync(resultFile, "utf8")), { error: "request did not parse" });
  assert.equal(fs.existsSync(file), false);
  const log = fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "log"), "utf8");
  assert.match(log, /request did not parse/);
});

test("a pass that throws is caught, and the resident's own log carries it (Important 11)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  // A seat transitioning to blocked calls raiseNotice, which appendFileSync's
  // straight to TANTO_NOTICE_LOG with no guard of its own; pointing that
  // path at a directory makes the call throw inside the census, with nothing
  // around the first pass() to catch it before this fix (Important 11,
  // branch-review.md).
  fs.mkdirSync(ws.notices, { recursive: true });
  setState(ws, {
    sessions: [
      {
        sessionId: "sess-new",
        name: "seat-new [aaaaaa]",
        cwd: ws.root,
        kind: "background",
        state: "blocked",
        id: "bg01",
      },
    ],
  });
  const got = run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(got.code, 0);
  const log = fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "log"), "utf8");
  assert.match(log, /guard:/);
});

test("an unknown op is a result with an error and nothing else", () => {
  const ws = workspace();
  const { id } = request(ws, { op: "launch" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).error, /unknown op/);
  assert.equal(calls(ws).filter((argv) => argv.includes("--bg")).length, 0);
});

test("requests are taken in name order", () => {
  const ws = workspace();
  const dir = path.join(ws.root, ".tanto", "spawner", "requests");
  fs.writeFileSync(
    path.join(dir, "2026-09-21T10-00-02-bbb.json"),
    JSON.stringify({ op: "attention", message: "second" }),
  );
  fs.writeFileSync(
    path.join(dir, "2026-09-21T10-00-01-aaa.json"),
    JSON.stringify({ op: "attention", message: "first" }),
  );
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.deepEqual(notices(ws), ["first", "second"]);
});

test("the census raises one notice per block, not one per pass", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, {
    sessions: [
      {
        sessionId: "sess-new",
        name: "seat-new [aaaaaa]",
        cwd: ws.root,
        kind: "background",
        state: "blocked",
        waitingFor: "permission prompt",
        id: "bg01",
      },
    ],
  });
  run(ws, ["run", "--root", ws.root, "--once"]);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "blocked");
  assert.equal(notices(ws).length, 1);
  assert.match(notices(ws)[0], /jisso t/);
});

test("the census marks a lost seat gone, and leaves a stopped one alone", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, { sessions: [] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "gone");
  assert.match(seats(ws)[0].goneAt, /\d/);
  const second = workspace();
  request(second, SPAWN);
  run(second, ["run", "--root", second.root, "--once"]);
  request(second, { op: "stop", sessionId: "sess-new" });
  setState(second, { dropsOnStop: true });
  run(second, ["run", "--root", second.root, "--once"]);
  run(second, ["run", "--root", second.root, "--once"]);
  assert.equal(seats(second)[0].status, "stopped");
});

test("the guard stops a seat whose cwd is an ad hoc worktree", () => {
  const ws = workspace();
  const stray = path.join(ws.root, ".claude", "worktrees", "wt-1");
  setState(ws, { next: { cwd: stray } });
  const { id } = request(ws, { ...SPAWN, mode: "manual" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).error, /ad hoc worktree/);
  assert.equal(seats(ws)[0].status, "stopped");
  assert.equal(calls(ws).filter((argv) => argv[0] === "stop").length, 1);
});

test("nothing the spawner does reads or writes the roster", () => {
  const ws = workspace();
  const roster = path.join(ws.root, ".tanto", "roster.md");
  fs.writeFileSync(roster, "# tanto roster\n");
  const before = fs.readFileSync(roster, "utf8");
  const spawnReq = request(ws, SPAWN);
  const attentionReq = request(ws, { op: "attention", message: "x" });
  const got = run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(got.code, 0);
  assert.equal(result(ws, spawnReq.id).error, undefined);
  assert.equal(result(ws, attentionReq.id).error, undefined);
  assert.equal(fs.readFileSync(roster, "utf8"), before);
});

test("run --once writes the pidfile and leaves no process behind", () => {
  const ws = workspace();
  const got = run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(got.code, 0);
  const pid = fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "pid"), "utf8").trim();
  assert.match(pid, /^\d+$/);
  assert.notEqual(Number(pid), process.pid);
  // `run` above is spawnSync, so it has already returned by the time the
  // pidfile is read (Minor 15, branch-review.md): the recorded pid must no
  // longer belong to any running process, not merely have the right shape.
  let alive = true;
  try {
    process.kill(Number(pid), 0);
  } catch {
    alive = false;
  }
  assert.equal(alive, false);
});
