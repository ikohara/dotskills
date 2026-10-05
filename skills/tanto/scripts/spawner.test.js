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
const { spawn, spawnSync } = require("node:child_process");

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
const flag = (name) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : undefined);
if (fail[sub]) {
  process.stderr.write(fail[sub] + "\\n");
  process.exit(1);
}
// A refusal printed on stdout with nothing on stderr, the shape 37ec's item 4
// measured for claude rm (spec 5.1).
const failOut = state.failOut || {};
if (failOut[sub]) {
  process.stdout.write(failOut[sub] + "\\n");
  process.exit(1);
}
const save = () => fs.writeFileSync(statePath, JSON.stringify(state));
if (sub === "agents") {
  // A session marked hidden is the reboot case: the process is gone, so the
  // listing does not carry it, but --resume still finds it by sessionId.
  let sessions = state.sessions.filter((s) => !s.hidden);
  // A session whose stop is finishing (spec 2.5, S-5): listed leaving more
  // times, then gone from the listing as a hidden one is -- --resume still
  // finds it.
  const leaving = sessions.filter((s) => s.leaving > 0);
  for (const s of leaving) {
    s.leaving -= 1;
    if (s.leaving === 0) s.hidden = true;
  }
  if (leaving.length > 0) save();
  // agentsHideSessionId/agentsHideCount simulate a session that exists but
  // has not yet re-registered with the listing -- the window a single
  // post-resume poll used to miss (Important 8, branch-review.md).
  if (state.agentsHideSessionId && state.agentsHideCount > 0) {
    sessions = sessions.filter((s) => s.sessionId !== state.agentsHideSessionId);
    state.agentsHideCount -= 1;
    save();
  }
  // A resumed session whose process has not registered yet: the listing
  // still shows the collected seat's stale entry -- its old name and id, no
  // pid -- for stale.listings more listings (spec 3.2 item 2).
  let staleShown = false;
  sessions = sessions.map((s) => {
    if (!s.stale) return s;
    const { pid, stale, ...rest } = s;
    stale.listings -= 1;
    if (stale.listings <= 0) delete s.stale;
    staleShown = true;
    return { ...rest, name: stale.name, id: stale.id };
  });
  if (staleShown) save();
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
    // What seats.json held as the stop ran: the park writes it first (spec 2.3).
    const seatsFile = state.root + "/.tanto/spawner/seats.json";
    if (fs.existsSync(seatsFile)) state.seatsAtStop = fs.readFileSync(seatsFile, "utf8");
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
  // state.copy: the CLI started a copy instead of waking the session (spec
  // 2.5, P-8) -- a new session under the root, the note on stderr unless
  // quiet, and the copy's own id on stdout.
  if (state.copy) {
    const copy = { sessionId: "sess-copy", id: state.copy.id, name: found.name, cwd: state.root };
    state.sessions.push({ ...copy, kind: "background", pid: 4400 });
    save();
    if (!state.copy.quiet) {
      process.stderr.write("note: already running in the background, so this started a copy as " + copy.id + "\\n");
    }
    process.stdout.write("backgrounded · " + copy.id + " · " + copy.name + " (idle — send a prompt to start)\\n");
    process.exit(0);
  }
  // A collected seat's entry has no pid; with resumeStaleListings set, the
  // listing keeps showing it that way for that many listings after the
  // resume. The resumed process itself always registers with a pid.
  if (!found.pid && state.resumeStaleListings > 0) {
    found.stale = { name: found.name, id: found.id, listings: state.resumeStaleListings };
  }
  found.name = (state.next && state.next.name) || found.name;
  found.id = (state.next && state.next.id) || found.id;
  found.state = "running";
  found.pid = found.pid || 4322;
  delete found.hidden;
  save();
  process.stderr.write(
    "note: woke session " + found.id + " with its saved options (--name, --settings, --model, --effort, --permission-mode).\\n",
  );
  // A prompt on the line is the session's turn, and the CLI prints no idle
  // note (S-3).
  const idle = argv.length > 3 ? "" : " (idle — send a prompt to start)";
  process.stdout.write("backgrounded · " + found.id + " · " + found.name + idle + "\\n");
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
    name: next.name || flag("--name") || "seat-new [aaaaaa]",
    id: next.id || "bg01",
    status: "running",
    state: next.state || "running",
  };
  if (next.worktree) session.worktree = next.worktree;
  // The CLI prints the short id and the name. A listing entry may lack the
  // id, which is what the spawner's fallback parse of this line is for.
  const printed = session.id;
  if (next.noListedId) delete session.id;
  // next.foreign: a session another repository started in the same seconds,
  // listed ahead of this one (spec 2.3).
  if (next.foreign) state.sessions.push(next.foreign);
  state.sessions.push(session);
  save();
  // next.idleNote: the note the CLI prints for a session started with no
  // prompt -- a resume's normal line, and a spawn's when its prompt was lost
  // (spec 1.2).
  const idle = next.idleNote ? " (idle — send a prompt to start)" : "";
  process.stdout.write("backgrounded · " + printed + " · " + session.name + idle + "\\n");
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
  return {
    root,
    fake,
    state,
    log: path.join(root, "fake-log.txt"),
    notices: path.join(root, "notices.txt"),
    // The workspace's own config directory: the census looks for a
    // transcript at every pass, and no test reads the user's `projects/`.
    config: path.join(root, "claude-config"),
  };
}

function setState(ws, patch) {
  const state = JSON.parse(fs.readFileSync(ws.state, "utf8"));
  fs.writeFileSync(ws.state, JSON.stringify({ ...state, ...patch }));
}

// The fake's --bg startedAt. `run` fixes TANTO_NOW_MS at it, so that no seat
// reaches the two-minute first-turn budget unless its test says so (spec 3.4).
const STARTED_AT = 1789984800000;

function run(ws, argv, opts = {}) {
  const { env, ...rest } = opts;
  const result = spawnSync(process.execPath, [SPAWNER, ...argv], {
    encoding: "utf8",
    env: {
      ...process.env,
      TANTO_CLAUDE_NODE: ws.fake,
      TANTO_NOTICE_LOG: ws.notices,
      FAKE_STATE: ws.state,
      FAKE_LOG: ws.log,
      CLAUDE_CONFIG_DIR: ws.config,
      TANTO_NOW_MS: String(STARTED_AT),
      ...env,
    },
    ...rest,
  });
  return { code: result.status, out: result.stdout || "", err: result.stderr || "" };
}

/** A transcript of `sessionId` under one project slug of the workspace's config directory. */
function writeTranscript(ws, sessionId, slug = "c--repo") {
  const dir = path.join(ws.config, "projects", slug);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${sessionId}.jsonl`);
  fs.writeFileSync(file, "{}\n");
  return file;
}

/** Put these seats into seats.json, as an earlier pass of the spawner would have left them. */
function putSeats(ws, list) {
  fs.writeFileSync(path.join(ws.root, ".tanto", "spawner", "seats.json"), JSON.stringify({ seats: list }));
}

/** A transcript of `records`, one JSON line each, at `writeTranscript`'s path (spec 2.8). */
function writeRecords(ws, sessionId, records) {
  const file = writeTranscript(ws, sessionId);
  fs.writeFileSync(file, `${records.map((record) => JSON.stringify(record)).join("\n")}\n`);
  return file;
}

// Transcript records in the shapes spec 2.8 reads. A closing `system` record
// carries no uuid, as many records do not.
const REC = {
  human: (uuid, extra = {}) => ({ type: "user", uuid, message: { role: "user", content: "go on" }, ...extra }),
  result: (uuid) => ({ type: "user", uuid, message: { role: "user", content: [{ type: "tool_result" }] } }),
  tool: (uuid, id) => ({ type: "assistant", uuid, message: { id, model: "claude-opus", stop_reason: "tool_use" } }),
  end: (uuid, id) => ({ type: "assistant", uuid, message: { id, model: "claude-opus", stop_reason: "end_turn" } }),
  close: (subtype) => ({ type: "system", subtype }),
  synthetic: (uuid) => ({
    type: "assistant",
    uuid,
    message: { id: "msg-synthetic", model: "<synthetic>", stop_reason: "stop_sequence" },
  }),
};

// A turn that ends on a request: the request is the turn's last tool call
// (`after` is its uuid), then its result and the closing message, settled
// by the Stop hook's record.
const ENDED_TURN = [
  REC.human("u1"),
  REC.tool("u2", "m1"),
  REC.result("u3"),
  REC.end("u4", "m2"),
  REC.close("stop_hook_summary"),
];

function spawnerLog(ws) {
  const file = path.join(ws.root, ".tanto", "spawner", "log");
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
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

/** The name the spawner gives a seat of this workspace, as a pattern (spec 1.1). */
function namePattern(ws, role, topic) {
  const repo = path
    .basename(ws.root)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return new RegExp(`^${repo}-${role}${topic ? `-${topic}` : ""}-[0-9a-f]{4}$`);
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
  const got = run(ws, ["notify", "--text", "kessai: t — tanto kanri"]);
  assert.equal(got.code, 0);
  assert.deepEqual(notices(ws), ["kessai: t — tanto kanri"]);
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

test("the hook's notice names the way in by role for a seat the state file holds, and claude attach for any other session (spec 1.1)", () => {
  const ws = workspace();
  putSeats(ws, [{ sessionId: "sess-1", id: "bg01", name: "s", role: "sekkei", topic: "t", status: "running" }]);
  const hook = (sessionId, cwd) =>
    run(ws, ["notify", "--stdin"], {
      input: JSON.stringify({ session_id: sessionId, cwd, notification_type: "permission_prompt" }),
    });
  const worktree = path.join(ws.root, ".claude", "worktrees", "x");
  hook("sess-1", worktree);
  hook("sess-9", ws.root);
  assert.deepEqual(notices(ws), [
    `tanto: permission_prompt in ${worktree} — tanto sekkei t`,
    `tanto: permission_prompt in ${ws.root} — claude attach sess-9`,
  ]);
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

test("a seat's name is <repo>-<role>[-<topic>]-<hex>, drawn again while seats.json holds it", () => {
  const { seatName } = require("./spawner.js");
  const root = path.join(os.tmpdir(), "My Repo!");
  const draws =
    (...values) =>
    () =>
      values.shift();
  assert.equal(seatName(root, { role: "kanri", topic: "—" }, [], draws("9c01")), "my-repo-kanri-9c01");
  assert.equal(
    seatName(root, { role: "jisso", topic: "BG Seat_Ergonomics" }, [], draws("3f2a")),
    "my-repo-jisso-bg-seat-ergonomics-3f2a",
  );
  assert.equal(seatName(root, { role: "shoki" }, [], draws("0a0b")), "my-repo-shoki-0a0b");
  assert.equal(
    seatName(path.join(os.tmpdir(), "!!!"), { role: "jisso", topic: "t" }, [], draws("0001")),
    "jisso-t-0001",
  );
  const held = [{ name: "my-repo-jisso-t-3f2a" }];
  assert.equal(seatName(root, { role: "jisso", topic: "t" }, held, draws("3f2a", "9c01")), "my-repo-jisso-t-9c01");
  assert.match(seatName(root, { role: "jisso", topic: "t" }, []), /^my-repo-jisso-t-[0-9a-f]{4}$/);
});

test("the short id is read from the spawn line and from the resume line", () => {
  const { shortIdOf } = require("./spawner.js");
  assert.equal(shortIdOf("backgrounded · ced66c9a · probe-named-s1\n"), "ced66c9a");
  assert.equal(shortIdOf("backgrounded · ced66c9a · probe-named-s1 (idle — send a prompt to start)\n"), "ced66c9a");
  assert.equal(shortIdOf("session ced66c9a started\n"), null);
});

test("a spawn writes the result, the seat, and deletes the request", () => {
  const ws = workspace();
  const { id, file } = request(ws, SPAWN);
  assert.equal(run(ws, ["run", "--root", ws.root, "--once"]).code, 0);
  const got = result(ws, id);
  assert.equal(got.op, "spawn");
  assert.equal(got.sessionId, "sess-new");
  assert.match(got.name, namePattern(ws, "jisso", "t"));
  assert.equal(got.cwd, ws.root);
  assert.equal(got.id, "bg01");
  assert.match(got.startedAt, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  assert.equal(seats(ws)[0].startedAt, got.startedAt);
  assert.equal(fs.existsSync(file), false);
  assert.equal(seats(ws)[0].status, "running");
  assert.equal(seats(ws)[0].role, "jisso");
});

test("a marked spawn of a held role is refused unless it names the holder it succeeds; an unmarked one is not (spec 1.2)", () => {
  const ws = workspace();
  const KANRI = { ...SPAWN, role: "kanri", topic: "—", prompt: "/tanto kanri", contract: 2 };
  const spawnAs = (sessionId, body) => {
    setState(ws, { next: { sessionId, id: `id-${sessionId}` } });
    writeTranscript(ws, sessionId);
    const { id } = request(ws, body);
    run(ws, ["run", "--root", ws.root, "--once"]);
    return { id, got: result(ws, id) };
  };
  const first = spawnAs("sess-k1", KANRI);
  assert.equal(first.got.sessionId, "sess-k1");
  assert.equal(spawnAs("sess-k2", KANRI).got.error, "held: sess-k1");
  assert.equal(spawnAs("sess-k2", { ...KANRI, succeeds: "sess-k1" }).got.sessionId, "sess-k2");
  assert.equal(spawnAs("sess-k3", { ...KANRI, contract: undefined }).got.sessionId, "sess-k3");
  assert.equal(calls(ws).filter((argv) => argv.includes("--bg")).length, 3);
  const byId = Object.fromEntries(seats(ws).map((seat) => [seat.sessionId, seat]));
  assert.equal(byId["sess-k1"].contract, 2);
  assert.equal(byId["sess-k1"].requestId, first.id);
  assert.equal(byId["sess-k3"].contract, undefined);
});

test("a spawn writes the state file as soon as the listing shows the session, before its transcript poll ends (spec 1.5)", async () => {
  const ws = workspace();
  request(ws, SPAWN);
  const env = {
    ...process.env,
    TANTO_CLAUDE_NODE: ws.fake,
    TANTO_NOTICE_LOG: ws.notices,
    FAKE_STATE: ws.state,
    FAKE_LOG: ws.log,
    CLAUDE_CONFIG_DIR: ws.config,
    TANTO_NOW_MS: String(STARTED_AT),
  };
  const child = spawn(process.execPath, [SPAWNER, "run", "--root", ws.root, "--once"], { env, stdio: "ignore" });
  const exited = new Promise((resolve) => child.on("exit", resolve));
  const file = path.join(ws.root, ".tanto", "spawner", "seats.json");
  const holds = () => {
    try {
      return JSON.parse(fs.readFileSync(file, "utf8")).seats.some((seat) => seat.sessionId === "sess-new");
    } catch {
      return false;
    }
  };
  let seen = false;
  for (let i = 0; i < 80 && !seen; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    seen = holds();
  }
  // No transcript exists, so the poll runs its ten seconds: the seat was on
  // disk while it ran.
  assert.equal(seen, true);
  assert.equal(child.exitCode, null);
  await exited;
});

test("a once seat is stopped and removed when its turn has ended, and five minutes after its spawn in any case (spec 4.4)", () => {
  const MESSENGER = {
    ...SPAWN,
    role: "denrei",
    topic: "—",
    effort: "low",
    once: true,
    contract: 2,
    prompt: "Forward.",
  };
  const ws = workspace();
  writeRecords(ws, "sess-new", [REC.human("u1"), REC.end("u2", "m1"), REC.close("stop_hook_summary")]);
  request(ws, MESSENGER);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].once, true);
  assert.equal(seats(ws)[0].status, "removed");
  assert.deepEqual(
    calls(ws)
      .filter((argv) => argv[0] === "stop" || argv[0] === "rm")
      .map((argv) => argv[0]),
    ["stop", "rm"],
  );
  assert.match(spawnerLog(ws), /once: sess-new removed — its turn ended/);

  const late = workspace();
  writeRecords(late, "sess-new", [REC.human("u1"), REC.tool("u2", "m1")]);
  request(late, MESSENGER);
  run(late, ["run", "--root", late.root, "--once"]);
  assert.equal(seats(late)[0].status, "running");
  run(late, ["run", "--root", late.root, "--once"], { env: { TANTO_NOW_MS: String(STARTED_AT + 300000) } });
  assert.equal(seats(late)[0].status, "removed");
  assert.match(spawnerLog(late), /once: sess-new removed — five minutes after its spawn/);
});

test("a spawn's command line carries the name, the isolation setting, the request's flags, and the prompt before --add-dir", () => {
  const ws = workspace();
  fs.mkdirSync(path.join(ws.root, ".claude", "worktrees", "shoki-t"), { recursive: true });
  request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const spawned = calls(ws).find((argv) => argv.includes("--bg"));
  assert.match(spawned[2], namePattern(ws, "shoki", "t"));
  // No -w for any seat (spec 2.2), and the prompt before the variadic
  // --add-dir, which would read it as one more directory (spec 1.1).
  assert.deepEqual(spawned, [
    "--bg",
    "--name",
    spawned[2],
    "--settings",
    '{"worktree":{"bgIsolation":"none"}}',
    "--model",
    "sonnet",
    "--effort",
    "xhigh",
    "--permission-mode",
    "auto",
    SPAWN.prompt,
    "--add-dir",
    ws.root,
  ]);
});

test("every spawn passes --settings, a Kanri's included, and a topic of — is left out of the name", () => {
  const ws = workspace();
  const { id } = request(ws, { ...SPAWN, role: "kanri", topic: "—", prompt: "/tanto kanri" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const spawned = calls(ws).find((argv) => argv.includes("--bg"));
  assert.equal(spawned[spawned.indexOf("--settings") + 1], '{"worktree":{"bgIsolation":"none"}}');
  assert.match(spawned[spawned.indexOf("--name") + 1], namePattern(ws, "kanri", ""));
  assert.equal(result(ws, id).name, spawned[spawned.indexOf("--name") + 1]);
});

test("a listing entry with no id takes the short id the --bg line printed", () => {
  const ws = workspace();
  setState(ws, { next: { id: "ced66c9a", noListedId: true } });
  const { id } = request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, id).id, "ced66c9a");
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

test("turnEnded reads a turn's end over messages: a cli tail, a tab's tail, one message in two records (spec 2.8)", () => {
  const { turnEnded } = require("./spawner.js");
  const ws = workspace();
  const file = (records) => writeRecords(ws, "sess-t", records);
  const ended = { ended: true, newTurn: false, midTurn: false };
  const cli = [REC.human("u1"), REC.end("u2", "m1"), REC.close("stop_hook_summary"), REC.close("turn_duration")];
  assert.deepEqual(turnEnded(file(cli)), ended);
  assert.deepEqual(turnEnded(file([REC.human("u1"), REC.end("u2", "m1"), REC.close("stop_hook_summary")])), ended);
  // A tab's turn writes no turn_duration (0 of 79 in the review's count).
  const tab = [
    REC.human("u1", { entrypoint: "claude-vscode" }),
    { ...REC.end("u2", "m1"), entrypoint: "claude-vscode" },
    { ...REC.close("stop_hook_summary"), entrypoint: "claude-vscode" },
  ];
  assert.deepEqual(turnEnded(file(tab)), ended);
  // A thinking record and a text record of one message.id are one message.
  const split = [REC.human("u1"), REC.end("u2", "m1"), REC.end("u3", "m1"), REC.close("stop_hook_summary")];
  assert.deepEqual(turnEnded(file(split), "u1"), ended);
  assert.equal(turnEnded(file(split), "u-absent"), null);
  assert.equal(turnEnded(path.join(ws.root, "no-such.jsonl")), null);
});

test("turnEnded settles a final message by the file's age, and reads a tool_use and a synthetic close as mid-turn (spec 2.8)", () => {
  const { turnEnded } = require("./spawner.js");
  const ws = workspace();
  const unsettled = writeRecords(ws, "sess-t", [REC.human("u1"), REC.end("u2", "m1")]);
  assert.deepEqual(turnEnded(unsettled), { ended: false, newTurn: false, midTurn: false });
  const old = new Date(Date.now() - 11000);
  fs.utimesSync(unsettled, old, old);
  assert.equal(turnEnded(unsettled).ended, true);
  const onTool = writeRecords(ws, "sess-t", [REC.human("u1"), REC.tool("u2", "m1")]);
  assert.deepEqual(turnEnded(onTool), { ended: false, newTurn: false, midTurn: true });
  const synthetic = writeRecords(ws, "sess-t", [REC.human("u1"), REC.tool("u2", "m1"), REC.synthetic("u3")]);
  assert.deepEqual(turnEnded(synthetic), { ended: true, newTurn: false, midTurn: true });
});

test("turnEnded sees a new turn after `after`, begun by the human's record or by a peer's isMeta one (spec 2.8)", () => {
  const { turnEnded } = require("./spawner.js");
  const ws = workspace();
  // The request's own tool result follows `after` and begins no turn.
  const settled = turnEnded(writeRecords(ws, "sess-t", ENDED_TURN), "u2");
  assert.deepEqual(settled, { ended: true, newTurn: false, midTurn: false });
  for (const next of [REC.human("u5"), REC.human("u5", { isMeta: true })]) {
    const turn = turnEnded(writeRecords(ws, "sess-t", [...ENDED_TURN, next]), "u2");
    assert.deepEqual(turn, { ended: false, newTurn: true, midTurn: true });
  }
});

test("stop runs claude stop only for a seat listed in the background, and writes stoppedAtMs (spec 2.8, 5.1)", () => {
  const ws = workspace();
  const entry = (sessionId, kind, extra = {}) => ({
    sessionId,
    id: `id-${sessionId}`,
    name: sessionId,
    cwd: ws.root,
    kind,
    pid: 4321,
    ...extra,
  });
  setState(ws, {
    sessions: [
      entry("sess-bg", "background"),
      entry("sess-tab", "interactive"),
      entry("sess-off", "background", { hidden: true }),
    ],
  });
  const ids = ["sess-bg", "sess-tab", "sess-off", "sess-done", "sess-rm"];
  const status = { "sess-done": "stopped", "sess-rm": "removed" };
  putSeats(
    ws,
    ids.map((sessionId) => ({
      sessionId,
      name: sessionId,
      role: "jisso",
      topic: "t",
      status: status[sessionId] || "running",
    })),
  );
  const asked = Object.fromEntries(ids.map((sessionId) => [sessionId, request(ws, { op: "stop", sessionId }).id]));
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.deepEqual(
    calls(ws)
      .filter((argv) => argv[0] === "stop")
      .map((argv) => argv[1]),
    ["sess-bg"],
  );
  const note = (sessionId) => result(ws, asked[sessionId]).note;
  assert.equal(note("sess-bg"), undefined);
  assert.equal(note("sess-tab"), "in a tab");
  assert.equal(note("sess-off"), "already exited");
  assert.equal(note("sess-done"), "already exited");
  assert.equal(note("sess-rm"), undefined);
  const byId = Object.fromEntries(seats(ws).map((seat) => [seat.sessionId, seat]));
  for (const sessionId of ["sess-bg", "sess-tab", "sess-off"]) {
    assert.equal(byId[sessionId].status, "stopped");
    assert.equal(byId[sessionId].stoppedAtMs, STARTED_AT);
  }
  assert.equal(byId["sess-done"].stoppedAtMs, undefined);
  assert.equal(byId["sess-rm"].status, "removed");
});

test("a self stop is refused for a seat the human does not pace, and ends a paced one in a tab or unlisted at once (spec 5.2)", () => {
  const ws = workspace();
  setState(ws, {
    sessions: [
      { sessionId: "sess-tab", id: "tab1", name: "dotskills-7b", cwd: ws.root, kind: "interactive", pid: 4321 },
    ],
  });
  putSeats(ws, [
    { sessionId: "sess-j", name: "j", role: "jisso", topic: "t", status: "running" },
    { sessionId: "sess-a", name: "a", role: "kaiseki", topic: "t", status: "running" },
    { sessionId: "sess-tab", id: "tab1", name: "k", role: "kikaku", topic: "—", status: "running" },
    { sessionId: "sess-off", name: "h", role: "hosa", topic: "—", status: "parked" },
  ]);
  const leave = (sessionId) => request(ws, { op: "stop", sessionId, self: true, after: "u2" }).id;
  const asked = { jisso: leave("sess-j"), attached: leave("sess-a"), tab: leave("sess-tab"), off: leave("sess-off") };
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, asked.jisso).error, "not a seat the human paces");
  assert.equal(result(ws, asked.attached).error, "not a seat the human paces");
  assert.equal(result(ws, asked.tab).note, "in a tab");
  assert.equal(result(ws, asked.off).note, "already exited");
  const byId = Object.fromEntries(seats(ws).map((seat) => [seat.sessionId, seat]));
  for (const sessionId of ["sess-tab", "sess-off"]) {
    assert.equal(byId[sessionId].status, "stopped");
    assert.equal(byId[sessionId].endedBy, "taiseki");
  }
  assert.equal(byId["sess-j"].endedBy, undefined);
  assert.equal(calls(ws).filter((argv) => argv[0] === "stop").length, 0);
});

test("a self stop in the background waits for its turn's end, and is dropped ten minutes on with a notice (spec 5.2)", () => {
  const paced = (ws) => {
    setState(ws, {
      sessions: [
        { sessionId: "sess-k", id: "bg01", name: "k", cwd: ws.root, kind: "background", pid: 4321, status: "busy" },
      ],
    });
    const transcript = writeRecords(ws, "sess-k", ENDED_TURN.slice(0, 2));
    putSeats(ws, [
      { sessionId: "sess-k", id: "bg01", name: "k", role: "kikaku", topic: "—", status: "running", transcript },
    ]);
    return request(ws, { op: "stop", sessionId: "sess-k", self: true, after: "u2" }).id;
  };
  const ws = workspace();
  const asked = paced(ws);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, asked).leaveRequested, STARTED_AT);
  assert.equal(seats(ws)[0].status, "running");
  assert.equal(calls(ws).filter((argv) => argv[0] === "stop").length, 0);
  writeRecords(ws, "sess-k", ENDED_TURN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.deepEqual(
    calls(ws)
      .filter((argv) => argv[0] === "stop")
      .map((argv) => argv[1]),
    ["sess-k"],
  );
  assert.equal(seats(ws)[0].status, "stopped");
  assert.equal(seats(ws)[0].endedBy, "taiseki");
  assert.equal(seats(ws)[0].leaveRequest, undefined);

  const late = workspace();
  paced(late);
  run(late, ["run", "--root", late.root, "--once"]);
  run(late, ["run", "--root", late.root, "--once"], { env: { TANTO_NOW_MS: String(STARTED_AT + 600000) } });
  assert.equal(seats(late)[0].status, "running");
  assert.equal(seats(late)[0].leaveRequest, undefined);
  assert.deepEqual(notices(late), ["taiseki not done: kikaku — tanto kikaku"]);
  assert.match(spawnerLog(late), /leave: sess-k dropped — its turn did not end/);
});

test("rm reports the worktree claude rm printed, and none when it printed none (spec 2.4)", () => {
  const ws = workspace();
  fs.mkdirSync(path.join(ws.root, ".claude", "worktrees", "shoki-t"), { recursive: true });
  setState(ws, { next: { sessionId: "sess-shoki", id: "bg09", worktree: "/repo/.claude/worktrees/shoki-t" } });
  request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const { id } = request(ws, { op: "rm", sessionId: "sess-shoki" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).removed, /\d/);
  assert.match(result(ws, id).worktree, /shoki-t/);
  assert.equal(seats(ws)[0].status, "removed");

  // Kanri's worktree is the seat's cwd and never the CLI's: claude rm prints
  // no Removed worktree line, and the result names no worktree.
  const second = workspace();
  fs.mkdirSync(path.join(second.root, ".claude", "worktrees", "shoki-t"), { recursive: true });
  request(second, { ...SPAWN, role: "shoki", worktree: "shoki-t" });
  run(second, ["run", "--root", second.root, "--once"]);
  const rm = request(second, { op: "rm", sessionId: "sess-new" });
  run(second, ["run", "--root", second.root, "--once"]);
  assert.match(result(second, rm.id).removed, /\d/);
  assert.equal(result(second, rm.id).worktree, undefined);
  assert.equal(seats(second)[0].status, "removed");
});

test("a spawn whose --bg line carries the idle note is an error, and its seat is removed (spec 1.2)", () => {
  const ws = workspace();
  setState(ws, { next: { idleNote: true } });
  const { id } = request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(
    result(ws, id).error,
    /^prompt not delivered: backgrounded · bg01 · \S+ \(idle — send a prompt to start\)$/,
  );
  assert.deepEqual(
    calls(ws)
      .filter((argv) => argv[0] === "rm")
      .map((argv) => argv[1]),
    ["sess-new"],
  );
  assert.equal(seats(ws)[0].status, "removed");
  assert.match(seats(ws)[0].undelivered, /\(idle — send a prompt to start\)$/);
  const log = fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "log"), "utf8");
  assert.match(log, /spawn: sess-new removed — prompt not delivered/);
  assert.doesNotMatch(log, /guard stopped/);
});

test("an undelivered seat is removed by the short id when the build takes only that one", () => {
  const ws = workspace();
  setState(ws, { next: { idleNote: true }, idForm: "short" });
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.deepEqual(
    calls(ws)
      .filter((argv) => argv[0] === "rm")
      .map((argv) => argv[1]),
    ["sess-new", "bg01"],
  );
  assert.equal(seats(ws)[0].status, "removed");
});

test("a failed spawn or resume with nothing on stderr reports the line it printed on stdout (spec 5.1)", () => {
  const ws = workspace();
  setState(ws, { failOut: { "--bg": "refused: the classifier said no" } });
  const spawn = request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, spawn.id).error, "claude --bg exited 1: refused: the classifier said no");
  const second = workspace();
  request(second, SPAWN);
  run(second, ["run", "--root", second.root, "--once"]);
  // Not listed, so that the resume reaches the command (spec 2.5).
  const listed = JSON.parse(fs.readFileSync(second.state, "utf8")).sessions;
  setState(second, {
    sessions: listed.map((s) => ({ ...s, hidden: true })),
    failOut: { "--resume": "refused: no such session" },
  });
  const resume = request(second, { op: "resume", sessionId: "sess-new" });
  run(second, ["run", "--root", second.root, "--once"]);
  assert.equal(result(second, resume.id).error, "claude --resume: refused: no such session");
});

test("an undelivered seat whose rm failed is not marked as having run no first turn", () => {
  const ws = workspace();
  setState(ws, { next: { idleNote: true }, fail: { rm: "boom" } });
  const { id } = request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).error, /claude rm: boom$/);
  run(ws, ["run", "--root", ws.root, "--once"], LATE);
  assert.equal(seats(ws)[0].noFirstTurn, undefined);
  assert.deepEqual(notices(ws), []);
});

test("stop and rm on a session the CLI has already dropped succeed, with a note (spec 5.1)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, { fail: { stop: "No job matching sess-new", rm: "No job matching sess-new" } });
  const stop = request(ws, { op: "stop", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, stop.id).error, undefined);
  assert.match(result(ws, stop.id).stopped, /\d/);
  assert.equal(result(ws, stop.id).note, "already exited");
  assert.equal(seats(ws)[0].status, "stopped");
  const rm = request(ws, { op: "rm", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, rm.id).error, undefined);
  assert.match(result(ws, rm.id).removed, /\d/);
  assert.equal(result(ws, rm.id).note, "already exited");
  assert.equal(seats(ws)[0].status, "removed");
  const log = fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "log"), "utf8");
  assert.ok(log.includes(`rm ${rm.id}.json ok (already exited)`), log);
});

test("a failed rm with nothing on stderr reports the line it printed on stdout (spec 5.1)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, { failOut: { rm: "refused: the worktree has changes" } });
  const { id } = request(ws, { op: "rm", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, id).error, "claude rm: refused: the worktree has changes");
  assert.equal(seats(ws)[0].status, "running");
});

test("resume passes --resume <sessionId> --bg and no other flag", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  // Not listed, so that the resume reaches the command (spec 2.5).
  const listed = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions;
  setState(ws, { sessions: listed.map((s) => ({ ...s, hidden: true })), next: { name: "seat-back [bbbbbb]" } });
  const { id } = request(ws, { op: "resume", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const resumed = calls(ws).find((argv) => argv[0] === "--resume");
  assert.deepEqual(resumed, ["--resume", "sess-new", "--bg"]);
  assert.equal(result(ws, id).sessionId, "sess-new");
  assert.equal(result(ws, id).name, "seat-back [bbbbbb]");
  const log = fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "log"), "utf8");
  assert.match(log, /resume sess-new: note: woke session bg01 with its saved options/);
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
        id: "bg01",
        pid: 1111,
      },
    ],
    next: { name: "seat-back [bbbbbb]" },
    // The session exists in the backing store already -- the fake's own
    // "--resume" handler finds it there -- but the first listing after the
    // resume still misses it, exactly as a single, un-retried poll used to
    // (Important 8, branch-review.md). The first of the two hidden listings
    // is the resume's own look before its command (spec 2.5).
    agentsHideSessionId: "sess-new",
    agentsHideCount: 2,
  });
  const { id } = request(ws, { op: "resume", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const got = result(ws, id);
  assert.equal(got.name, "seat-back [bbbbbb]");
  assert.equal(seats(ws)[0].status, "running");
  assert.equal(seats(ws)[0].goneAt, undefined);
});

test("resume waits past the stale pid-less entry of its own sessionId, for the entry with a pid (spec 3.2 item 2)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const spawned = seats(ws)[0];
  // The seat is collected: its entry stays listed with no pid, and the
  // spawner's census marks it gone.
  const listed = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions;
  setState(ws, {
    sessions: listed.map((s) => {
      const { pid, ...rest } = s;
      return rest;
    }),
  });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "gone");
  // The first listing after the resume still shows the stale entry, with the
  // old name and id; the next one shows the resumed process, with a pid.
  setState(ws, { next: { name: "seat-back [bbbbbb]" }, resumeStaleListings: 1 });
  const { id } = request(ws, { op: "resume", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const got = result(ws, id);
  assert.notEqual(got.name, spawned.name);
  assert.equal(got.name, "seat-back [bbbbbb]");
  assert.equal(got.id, "bg01");
  assert.equal(seats(ws)[0].status, "running");
  assert.equal(seats(ws)[0].goneAt, undefined);
});

/** A listing entry and a contract-2 Sekkei seat of `sessionId`, for the resume tests (spec 2.5). */
function resumable(ws, sessionId, listing = {}, seat = {}) {
  const shared = { sessionId, id: `id-${sessionId}`, name: `name-${sessionId}` };
  return {
    entry: { ...shared, cwd: ws.root, kind: "background", pid: 4321, ...listing },
    seat: { ...shared, role: "sekkei", topic: "t", contract: 2, status: "running", ...seat },
  };
}

test("resume answers listed for a seat a tab holds or that is alive, waits out a stop finishing, and wakes an unlisted one (spec 2.5)", () => {
  const ws = workspace();
  const cases = {
    tab: resumable(ws, "sess-tab", { kind: "interactive" }),
    live: resumable(ws, "sess-live", {}, { status: "stopped", stoppedAtMs: STARTED_AT - 60000 }),
    parked: resumable(ws, "sess-parked", { hidden: true }, { status: "parked", parkedAtMs: STARTED_AT - 3600000 }),
  };
  setState(ws, { sessions: Object.values(cases).map((c) => c.entry) });
  putSeats(
    ws,
    Object.values(cases).map((c) => c.seat),
  );
  const asked = Object.fromEntries(
    Object.entries(cases).map(([key, c]) => [key, request(ws, { op: "resume", sessionId: c.seat.sessionId }).id]),
  );
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.deepEqual(
    [result(ws, asked.tab).error, result(ws, asked.tab).kind, result(ws, asked.tab).name],
    ["listed", "interactive", "name-sess-tab"],
  );
  assert.deepEqual([result(ws, asked.live).error, result(ws, asked.live).kind], ["listed", "background"]);
  assert.equal(result(ws, asked.parked).error, undefined);
  assert.deepEqual(
    calls(ws)
      .filter((argv) => argv[0] === "--resume")
      .map((argv) => argv[1]),
    ["sess-parked"],
  );
  const parked = seats(ws).find((seat) => seat.sessionId === "sess-parked");
  assert.equal(parked.status, "running");
  assert.equal(parked.parkedAtMs, undefined);

  // Parked five seconds ago and still listed: the stop is finishing (S-5).
  const leaving = workspace();
  const finishing = resumable(leaving, "sess-d", { leaving: 1 }, { status: "parked", parkedAtMs: STARTED_AT - 5000 });
  setState(leaving, { sessions: [finishing.entry] });
  putSeats(leaving, [finishing.seat]);
  const { id } = request(leaving, { op: "resume", sessionId: "sess-d" });
  run(leaving, ["run", "--root", leaving.root, "--once"]);
  assert.equal(result(leaving, id).error, undefined);
  assert.deepEqual(
    calls(leaving)
      .slice(0, 3)
      .map((argv) => argv[0]),
    ["agents", "agents", "--resume"],
  );
});

test("resume refuses a prompt for any role but kanri, and passes a Kanri's as its one positional (spec 2.5, 4.4)", () => {
  const ws = workspace();
  const sekkei = resumable(ws, "sess-s", { hidden: true });
  const kanri = resumable(ws, "sess-k", { hidden: true }, { role: "kanri", topic: "—", status: "gone" });
  setState(ws, { sessions: [sekkei.entry, kanri.entry] });
  putSeats(ws, [sekkei.seat, kanri.seat]);
  const refused = request(ws, { op: "resume", sessionId: "sess-s", prompt: "resume: go on" });
  const fukki = request(ws, { op: "resume", sessionId: "sess-k", prompt: "/tanto fukki" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, refused.id).error, "no prompt for this role");
  assert.equal(result(ws, fukki.id).error, undefined);
  assert.deepEqual(
    calls(ws).filter((argv) => argv[0] === "--resume"),
    [["--resume", "sess-k", "--bg", "/tanto fukki"]],
  );
});

test("a copy a resume started is stopped and removed, found on stderr or on stdout alone (spec 2.5, P-8)", () => {
  for (const quiet of [false, true]) {
    const ws = workspace();
    const parked = resumable(ws, "sess-s", { hidden: true }, { status: "parked", parkedAtMs: STARTED_AT - 3600000 });
    setState(ws, { sessions: [parked.entry], copy: { id: "cp01", quiet } });
    putSeats(ws, [parked.seat]);
    const { id } = request(ws, { op: "resume", sessionId: "sess-s" });
    run(ws, ["run", "--root", ws.root, "--once"]);
    assert.equal(result(ws, id).error, "copy cp01 removed");
    assert.deepEqual(
      calls(ws).filter((argv) => argv[0] === "stop" || argv[0] === "rm"),
      [
        ["stop", "cp01"],
        ["rm", "cp01"],
      ],
    );
    assert.equal(seats(ws)[0].status, "parked");
  }
});

test("attention raises its message as written and names its channel (spec 1.1)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const { id } = request(ws, {
    op: "attention",
    sessionId: "sess-new",
    message: "human-needed: jisso t — tanto jisso t",
  });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, id).channel, "log");
  assert.match(result(ws, id).notified, /\d/);
  assert.deepEqual(notices(ws), ["human-needed: jisso t — tanto jisso t"]);
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
        pid: 1111,
      },
    ],
  });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(seats(ws)[0].renamed, namePattern(ws, "jisso", "t"));
  const { id } = request(ws, { op: "ack", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).acked, /\d/);
  assert.equal(seats(ws)[0].renamed, undefined);
  assert.equal(seats(ws)[0].name, "seat-two [cccccc]");
});

/**
 * A contract-2 Sekkei the spawner holds, its transcript `records`, listed in
 * the background and idle with `listing` merged in; the fake drops a stopped
 * session from the listing, as the CLI does once the process has left.
 */
function dialogueSeat(ws, { seat = {}, listing = {}, records = ENDED_TURN } = {}) {
  const transcript = writeRecords(ws, "sess-d", records);
  const name = "dotskills-sekkei-t-0a0b";
  setState(ws, {
    sessions: [
      {
        sessionId: "sess-d",
        id: "bg05",
        name,
        cwd: ws.root,
        kind: "background",
        pid: 4321,
        status: "idle",
        ...listing,
      },
    ],
    dropsOnStop: true,
  });
  putSeats(ws, [
    {
      sessionId: "sess-d",
      id: "bg05",
      name,
      role: "sekkei",
      topic: "t",
      contract: 2,
      status: "running",
      transcript,
      ...seat,
    },
  ]);
  return transcript;
}

const PARK = { op: "park", sessionId: "sess-d", after: "u2" };
const once = (ws, opts) => run(ws, ["run", "--root", ws.root, "--once"], opts);
const stopsOf = (ws) =>
  calls(ws)
    .filter((argv) => argv[0] === "stop")
    .map((argv) => argv[1]);
const LATER = (ms) => ({ env: { TANTO_NOW_MS: String(STARTED_AT + ms) } });

test("a park stops an idle seat once its turn has ended, state first, decided by the listing and not the recorded status (spec 2.3)", () => {
  for (const status of ["running", "blocked"]) {
    const ws = workspace();
    dialogueSeat(ws, { seat: { status } });
    const { id } = request(ws, PARK);
    once(ws);
    assert.equal(result(ws, id).parkRequested, STARTED_AT);
    assert.deepEqual(stopsOf(ws), ["sess-d"]);
    const seat = seats(ws)[0];
    assert.equal(seat.status, "parked");
    assert.equal(seat.parkedAtMs, STARTED_AT);
    assert.deepEqual(seat.lastPark, { after: "u2", waiting: false });
    assert.equal(seat.parkRequest, undefined);
    const atStop = JSON.parse(JSON.parse(fs.readFileSync(ws.state, "utf8")).seatsAtStop).seats[0];
    assert.equal(atStop.status, "parked");
  }
});

test("a park waits on a busy seat, a seat on a prompt, and a held one, and is dropped ten minutes after the turn ended unless held (spec 2.3)", () => {
  const cases = [
    { listing: { status: "busy" } },
    { listing: { status: "waiting", waitingFor: "permission prompt" } },
    { seat: { held: { atMs: STARTED_AT, pid: process.pid } } },
  ];
  for (const { listing, seat } of cases) {
    const ws = workspace();
    dialogueSeat(ws, { listing, seat });
    request(ws, PARK);
    once(ws);
    assert.deepEqual(stopsOf(ws), []);
    assert.equal(seats(ws)[0].parkRequest.endedAtMs, STARTED_AT);
    once(ws, LATER(600000));
    assert.deepEqual(stopsOf(ws), []);
    assert.equal(seats(ws)[0].parkRequest === undefined, !seat?.held);
  }
});

test("a park is kept until the turn ends, dropped ten minutes after it was asked, and voided by a new turn (spec 2.3)", () => {
  const ws = workspace();
  dialogueSeat(ws, { records: ENDED_TURN.slice(0, 2) });
  request(ws, PARK);
  once(ws);
  assert.equal(seats(ws)[0].parkRequest.after, "u2");
  once(ws, LATER(600000));
  assert.equal(seats(ws)[0].parkRequest, undefined);
  assert.match(spawnerLog(ws), /park: sess-d dropped — its turn did not end/);

  const voided = workspace();
  dialogueSeat(voided, { records: [...ENDED_TURN, REC.human("u5")] });
  request(voided, PARK);
  once(voided);
  assert.equal(seats(voided)[0].parkRequest, undefined);
  assert.match(spawnerLog(voided), /park: sess-d void — a new turn began/);
  assert.deepEqual(stopsOf(voided), []);
});

test("a park parks an unlisted seat with no stop, leaves one a tab holds running, and raises the waiting notice once (spec 2.2, 2.3)", () => {
  const gone = workspace();
  dialogueSeat(gone, { listing: { hidden: true } });
  request(gone, PARK);
  once(gone);
  assert.equal(seats(gone)[0].status, "parked");
  assert.deepEqual(stopsOf(gone), []);

  const tab = workspace();
  dialogueSeat(tab, { listing: { kind: "interactive" } });
  request(tab, { ...PARK, waiting: true, notice: true });
  once(tab);
  assert.equal(seats(tab)[0].status, "running");
  assert.equal(seats(tab)[0].waiting, true);
  assert.equal(seats(tab)[0].parkRequest, undefined);
  assert.deepEqual(notices(tab), ["waiting: sekkei t — tanto sekkei t"]);
  // A peer's line starts a turn while the question stands: no second notice.
  const second = [REC.human("u5", { isMeta: true }), REC.tool("u6", "m3"), REC.result("u7"), REC.end("u8", "m4")];
  writeRecords(tab, "sess-d", [...ENDED_TURN, ...second, REC.close("stop_hook_summary")]);
  request(tab, { ...PARK, after: "u6", waiting: true, notice: true });
  once(tab);
  assert.equal(notices(tab).length, 1);
  // A turn's end without --waiting clears it.
  request(tab, { ...PARK, after: "u6" });
  once(tab);
  assert.equal(seats(tab)[0].waiting, undefined);
});

test("the standing request stops a seat listed again with no new turn two minutes on, not while held, and ends at a new turn (spec 2.3)", () => {
  for (const held of [false, true]) {
    const ws = workspace();
    const mark = held ? { held: { atMs: STARTED_AT, pid: process.pid } } : {};
    const lastPark = { after: "u2", waiting: false };
    dialogueSeat(ws, { seat: { status: "parked", parkedAtMs: STARTED_AT - 600000, lastPark, ...mark } });
    once(ws);
    assert.deepEqual(stopsOf(ws), []);
    assert.equal(seats(ws)[0].listedAtMs, STARTED_AT);
    once(ws, LATER(120000));
    assert.deepEqual(stopsOf(ws), held ? [] : ["sess-d"]);
    if (!held) assert.equal(seats(ws)[0].status, "parked");
  }
  const ws = workspace();
  const lastPark = { after: "u2", waiting: false };
  dialogueSeat(ws, { records: [...ENDED_TURN, REC.human("u5")], seat: { lastPark } });
  once(ws);
  assert.equal(seats(ws)[0].lastPark, undefined);
});

test("hold marks a contract-2 seat, answers its errors, and release unmarks it and stops nothing (spec 2.4)", () => {
  const ws = workspace();
  dialogueSeat(ws);
  const marked = request(ws, { op: "hold", sessionId: "sess-d", pid: process.pid });
  once(ws);
  assert.equal(result(ws, marked.id).held, STARTED_AT);
  assert.deepEqual(seats(ws)[0].held, { atMs: STARTED_AT, pid: process.pid });
  const other = request(ws, { op: "hold", sessionId: "sess-d", pid: process.pid + 1 });
  once(ws);
  assert.equal(result(ws, other.id).error, "held by another terminal");
  const release = request(ws, { op: "release", sessionId: "sess-d" });
  once(ws);
  assert.match(result(ws, release.id).released, /\d/);
  assert.equal(seats(ws)[0].held, undefined);
  assert.equal(seats(ws)[0].status, "running");
  const forFace = request(ws, { op: "hold", sessionId: "sess-d", forMs: 3300000 });
  once(ws);
  assert.deepEqual(seats(ws)[0].held, { atMs: STARTED_AT, forMs: 3300000 });
  assert.equal(result(ws, forFace.id).error, undefined);
  assert.deepEqual(stopsOf(ws), []);

  const errorOf = (options, body) => {
    const each = workspace();
    dialogueSeat(each, options);
    const { id } = request(each, { sessionId: "sess-d", ...body });
    once(each);
    return result(each, id).error;
  };
  const hold = { op: "hold", pid: process.pid };
  assert.equal(errorOf({ listing: { kind: "interactive" } }, hold), "in a tab");
  assert.equal(errorOf({ seat: { status: "stopped" } }, hold), "ended");
  assert.equal(errorOf({ seat: { contract: undefined } }, hold), "old-contract seat");
  assert.equal(errorOf({ seat: { contract: undefined } }, PARK), "not a dialogue seat");
  assert.equal(errorOf({ seat: { status: "removed" } }, PARK), "ended");
});

test("hold waits out a park under thirty seconds old that the listing still shows (spec 2.4, S-5)", () => {
  const ws = workspace();
  dialogueSeat(ws, { listing: { leaving: 1 }, seat: { status: "parked", parkedAtMs: STARTED_AT - 5000 } });
  const { id } = request(ws, { op: "hold", sessionId: "sess-d", pid: process.pid });
  once(ws);
  assert.equal(result(ws, id).held, STARTED_AT);
  // The hold's own look, the wait's look that finds it gone, and the census's.
  assert.equal(calls(ws).filter((argv) => argv[0] === "agents").length, 3);
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
        status: "waiting",
        waitingFor: "permission prompt",
        id: "bg01",
        pid: 1111,
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

test("a request another spawner renamed first is not handled twice (issue-f03b)", () => {
  const ws = workspace();
  const { id, file } = request(ws, { op: "attention", message: "once" });
  // Stands in for the second spawner: the first rename of a request file
  // succeeds for it and fails for this process, as it does for the loser.
  const preload = path.join(ws.root, "lose-the-rename.js");
  fs.writeFileSync(
    preload,
    `const fs = require("node:fs");
const real = fs.renameSync;
fs.renameSync = (from, to) => {
  if (String(from).endsWith(".json") && String(from).includes("requests")) {
    real(from, to + ".other");
    const error = new Error("ENOENT: no such file or directory, rename");
    error.code = "ENOENT";
    throw error;
  }
  return real(from, to);
};
`,
  );
  run(ws, ["run", "--root", ws.root, "--once"], {
    env: { NODE_OPTIONS: `--require ${JSON.stringify(preload)}` },
  });
  assert.deepEqual(notices(ws), []);
  assert.equal(fs.existsSync(path.join(ws.root, ".tanto", "spawner", "results", `${id}.json`)), false);
  assert.equal(fs.existsSync(file), false);
  // The same request taken without a rival is handled once and leaves no claim behind.
  const second = request(ws, { op: "attention", message: "twice" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.deepEqual(notices(ws), ["twice"]);
  assert.match(result(ws, second.id).notified, /\d/);
  const left = fs.readdirSync(path.join(ws.root, ".tanto", "spawner", "requests")).filter((n) => !n.endsWith(".other"));
  assert.deepEqual(left, []);
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
        status: "waiting",
        waitingFor: "permission prompt",
        id: "bg01",
        pid: 1111,
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
  assert.equal(seats(ws)[0].strayed, stray);
  assert.equal(calls(ws).filter((argv) => argv[0] === "stop").length, 1);
});

test("the guard stops a seat that reaches an ad hoc worktree after its first sighting, and toasts once", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const stray = path.join(ws.root, ".claude", "worktrees", "probe-task");
  const listed = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions;
  setState(ws, { sessions: listed.map((s) => ({ ...s, cwd: stray })) });
  run(ws, ["run", "--root", ws.root, "--once"]);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "stopped");
  assert.equal(seats(ws)[0].strayed, stray);
  assert.deepEqual(
    calls(ws)
      .filter((argv) => argv[0] === "stop")
      .map((argv) => argv[1]),
    ["bg01"],
  );
  assert.equal(notices(ws).length, 1);
  assert.match(notices(ws)[0], /^strayed: jisso t \S+ — /);
});

test("the guard compares the paths with the separators unified and, on Windows, the case folded", {
  skip: process.platform !== "win32",
}, () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const stray = `${ws.root.toUpperCase().replace(/\\/g, "/")}/.CLAUDE/WORKTREES/wt-2`;
  const listed = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions;
  setState(ws, { sessions: listed.map((s) => ({ ...s, cwd: stray })) });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "stopped");
});

test("the guard leaves alone a seat running in the worktree Kanri cut for it", () => {
  const ws = workspace();
  const worktree = path.join(ws.root, ".claude", "worktrees", "shoki-t");
  fs.mkdirSync(worktree, { recursive: true });
  setState(ws, { next: { cwd: worktree } });
  request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "running");
  assert.equal(calls(ws).filter((argv) => argv[0] === "stop").length, 0);
});

test("a worktree request runs claude --bg in the directory Kanri cut, with no -w (spec 2.2)", () => {
  const ws = workspace();
  const worktree = path.join(ws.root, ".claude", "worktrees", "shoki-t");
  fs.mkdirSync(worktree, { recursive: true });
  setState(ws, { next: { cwd: worktree } });
  const { id } = request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, id).error, undefined);
  const spawned = calls(ws).find((argv) => argv.includes("--bg"));
  assert.equal(spawned.includes("-w"), false);
  const state = JSON.parse(fs.readFileSync(ws.state, "utf8"));
  assert.equal(fs.realpathSync(state.cwdSeen), fs.realpathSync(worktree));
  assert.equal(seats(ws)[0].cwd, worktree);
  assert.equal(seats(ws)[0].status, "running");
});

test("a worktree request whose directory is not there is an error, and claude --bg never runs (spec 2.2)", () => {
  const ws = workspace();
  const { id } = request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).error, /^worktree .*shoki-t is not a directory$/);
  assert.equal(calls(ws).filter((argv) => argv.includes("--bg")).length, 0);
  assert.equal(seats(ws).length, 0);
});

test("a spawn adopts the new session under the root, never one another repository started meanwhile (spec 2.3)", () => {
  const ws = workspace();
  const worktree = path.join(ws.root, ".claude", "worktrees", "shoki-t");
  fs.mkdirSync(worktree, { recursive: true });
  const foreign = {
    sessionId: "sess-foreign",
    name: "elsewhere",
    cwd: path.dirname(ws.root),
    kind: "background",
    state: "running",
    id: "bg99",
    pid: 999,
  };
  setState(ws, { next: { sessionId: "sess-shoki", cwd: worktree, foreign } });
  const { id } = request(ws, { ...SPAWN, role: "shoki", worktree: "shoki-t", addDir: [ws.root] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(result(ws, id).sessionId, "sess-shoki");
  assert.deepEqual(
    seats(ws).map((s) => s.sessionId),
    ["sess-shoki"],
  );
  assert.equal(
    calls(ws).some((argv) => argv[0] === "agents" && argv.includes("--cwd")),
    false,
  );
});

test("the census revives a gone seat the listing holds again, and never a stopped one", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  // A seat that ran its first turn, so that its gone is the ordinary one and
  // raises no no-first-turn toast (spec 3.1).
  writeTranscript(ws, "sess-new");
  const listed = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions;
  setState(ws, { sessions: [] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "gone");
  setState(ws, { sessions: listed.map((s) => ({ ...s, status: "waiting", waitingFor: "permission prompt" })) });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "blocked");
  assert.equal(seats(ws)[0].goneAt, undefined);
  assert.equal(notices(ws).length, 1);
  const log = fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "log"), "utf8");
  assert.match(log, /census: sess-new back/);

  // The fake keeps a stopped session listed, as a reopened one would be.
  const second = workspace();
  request(second, SPAWN);
  run(second, ["run", "--root", second.root, "--once"]);
  request(second, { op: "stop", sessionId: "sess-new" });
  run(second, ["run", "--root", second.root, "--once"]);
  run(second, ["run", "--root", second.root, "--once"]);
  assert.equal(seats(second)[0].status, "stopped");
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

test("a pid-less listing entry is treated as absent by the census (fix 1)", () => {
  const ws = workspace();
  // A seat already gone: the census must not revive it from a pid-less
  // entry -- the measured real shape (R-11, S-54) is a sessionId with no
  // pid and no status, for a process that already exited hours earlier.
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, { sessions: [] });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "gone");
  setState(ws, {
    sessions: [
      { sessionId: "sess-new", name: "seat-new [aaaaaa]", cwd: ws.root, kind: "background", status: "waiting" },
    ],
  });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].status, "gone");

  // A seat that IS live: when the listing only offers a pid-less entry for
  // it, it must not be read as blocked or kept running -- exactly as if the
  // entry were missing from the listing.
  const second = workspace();
  request(second, SPAWN);
  run(second, ["run", "--root", second.root, "--once"]);
  const listed = JSON.parse(fs.readFileSync(second.state, "utf8")).sessions;
  setState(second, {
    sessions: listed.map((s) => {
      const { pid, ...rest } = s;
      return rest;
    }),
  });
  run(second, ["run", "--root", second.root, "--once"]);
  assert.equal(seats(second)[0].status, "gone");
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

test("run writes the contract file, holding 2, at its start (spec 4.2)", () => {
  const ws = workspace();
  assert.equal(run(ws, ["run", "--root", ws.root, "--once"]).code, 0);
  assert.equal(fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "contract"), "utf8"), "2\n");
});

test("run --once leaves a heartbeat within the test's own clock (spec 4.1)", () => {
  const ws = workspace();
  const before = Date.now();
  assert.equal(run(ws, ["run", "--root", ws.root, "--once"]).code, 0);
  const after = Date.now();
  const beat = Number(fs.readFileSync(path.join(ws.root, ".tanto", "spawner", "heartbeat"), "utf8").trim());
  assert.ok(beat >= before && beat <= after, `${before} <= ${beat} <= ${after}`);
});

// The two-minute budget, with TANTO_NOW_MS past it (spec 3.1, 3.4).
const LATE = { env: { TANTO_NOW_MS: String(STARTED_AT + 120000) } };

test("a seat with no transcript under two minutes after its spawn gets no mark (spec 3.1)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  run(ws, ["run", "--root", ws.root, "--once"], { env: { TANTO_NOW_MS: String(STARTED_AT + 119000) } });
  assert.equal(seats(ws)[0].noFirstTurn, undefined);
  assert.deepEqual(notices(ws), []);
  assert.doesNotMatch(spawnerLog(ws), /first turn/);
});

test("a seat with no transcript two minutes after its spawn is marked, toasted, and logged once (spec 3.1)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  run(ws, ["run", "--root", ws.root, "--once"], LATE);
  run(ws, ["run", "--root", ws.root, "--once"], LATE);
  const seat = seats(ws)[0];
  assert.equal(seat.status, "running");
  assert.match(seat.noFirstTurn, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  assert.deepEqual(notices(ws), [`no first turn: jisso t ${seat.name} — tanto jisso t`]);
  assert.equal(spawnerLog(ws).match(/census: sess-new no first turn after 2m/g).length, 1);
});

test("a transcript under any project slug clears the mark and reaches the seat (spec 3.1)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  run(ws, ["run", "--root", ws.root, "--once"], LATE);
  assert.match(seats(ws)[0].noFirstTurn, /\d/);
  const file = writeTranscript(ws, "sess-new", "c--repo--claude-worktrees-shoki-t");
  run(ws, ["run", "--root", ws.root, "--once"], LATE);
  assert.equal(seats(ws)[0].noFirstTurn, undefined);
  assert.equal(seats(ws)[0].transcript, file);
  assert.match(spawnerLog(ws), /census: sess-new first turn/);
  assert.equal(notices(ws).length, 1);
});

test("a seat the listing drops with no transcript goes gone with the mark; one with a transcript goes plainly gone (spec 3.1)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  const listed = JSON.parse(fs.readFileSync(ws.state, "utf8")).sessions;
  setState(ws, { sessions: listed.map((s) => ({ ...s, hidden: true })) });
  run(ws, ["run", "--root", ws.root, "--once"]);
  const seat = seats(ws)[0];
  assert.equal(seat.status, "gone");
  assert.match(seat.noFirstTurn, /\d/);
  assert.deepEqual(notices(ws), [`no first turn: jisso t ${seat.name}`]);
  assert.match(spawnerLog(ws), /census: sess-new gone — no first turn/);

  const second = workspace();
  request(second, SPAWN);
  run(second, ["run", "--root", second.root, "--once"]);
  writeTranscript(second, "sess-new");
  const held = JSON.parse(fs.readFileSync(second.state, "utf8")).sessions;
  setState(second, { sessions: held.map((s) => ({ ...s, hidden: true })) });
  run(second, ["run", "--root", second.root, "--once"]);
  assert.equal(seats(second)[0].status, "gone");
  assert.equal(seats(second)[0].noFirstTurn, undefined);
  assert.deepEqual(notices(second), []);
  assert.match(spawnerLog(second), /census: sess-new gone\n/);
});

test("the census marks blocked on a background entry's status waiting, with its cause, never on state blocked or in a tab (spec 2.6)", () => {
  const ws = workspace();
  const ids = ["sess-prompt", "sess-idle", "sess-tab"];
  const listing = {
    "sess-prompt": { kind: "background", status: "waiting", waitingFor: "permission prompt" },
    "sess-idle": { kind: "background", status: "idle" },
    "sess-tab": { kind: "interactive", status: "waiting", waitingFor: "permission prompt" },
  };
  // An idle seat lists the retired `state` as blocked too (S-1).
  listing["sess-idle"].state = "blocked";
  setState(ws, {
    sessions: ids.map((sessionId) => ({
      sessionId,
      name: `n-${sessionId}`,
      cwd: ws.root,
      pid: 4321,
      ...listing[sessionId],
    })),
  });
  const seat = (sessionId) => ({ sessionId, name: `n-${sessionId}`, role: "jisso", topic: "t", status: "running" });
  putSeats(
    ws,
    ids.map((sessionId) => ({ ...seat(sessionId), transcript: writeTranscript(ws, sessionId) })),
  );
  once(ws);
  const byId = Object.fromEntries(seats(ws).map((each) => [each.sessionId, each]));
  assert.equal(byId["sess-prompt"].status, "blocked");
  assert.equal(byId["sess-prompt"].waitingFor, "permission prompt");
  assert.equal(byId["sess-prompt"].kind, "background");
  assert.equal(byId["sess-idle"].status, "running");
  assert.equal(byId["sess-tab"].status, "running");
  assert.equal(byId["sess-tab"].kind, "interactive");
  assert.deepEqual(notices(ws), ["blocked: jisso t n-sess-prompt — permission prompt — tanto jisso t"]);
});

test("the census parks a contract-2 dialogue seat that leaves the listing, with midTurn, and marks an unmarked one and a Jisso gone (spec 2.7)", () => {
  const ws = workspace();
  const seat = (sessionId, role, records, extra = {}) => ({
    sessionId,
    name: sessionId,
    role,
    topic: "t",
    status: "running",
    transcript: writeRecords(ws, sessionId, records),
    ...extra,
  });
  putSeats(ws, [
    seat("sess-cut", "sekkei", [REC.human("u1"), REC.tool("u2", "m1")], { contract: 2 }),
    seat("sess-done", "keikaku", ENDED_TURN, { contract: 2 }),
    seat("sess-old", "keikaku", ENDED_TURN),
    seat("sess-j", "jisso", ENDED_TURN, { contract: 2 }),
  ]);
  once(ws);
  const byId = Object.fromEntries(seats(ws).map((each) => [each.sessionId, each]));
  assert.equal(byId["sess-cut"].status, "parked");
  assert.equal(byId["sess-cut"].midTurn, true);
  assert.equal(byId["sess-cut"].parkedAtMs, STARTED_AT);
  assert.equal(byId["sess-done"].status, "parked");
  assert.equal(byId["sess-done"].midTurn, undefined);
  assert.equal(byId["sess-old"].status, "gone");
  assert.equal(byId["sess-j"].status, "gone");
  assert.match(spawnerLog(ws), /census: sess-cut parked — mid-turn/);
});

test("the census sets a parked seat running when the listing shows it again, and parked once more when it goes (spec 2.7)", () => {
  const ws = workspace();
  const seat = { status: "parked", parkedAtMs: STARTED_AT - 600000, midTurn: true };
  dialogueSeat(ws, { listing: { kind: "interactive", name: "dotskills-7b" }, seat });
  once(ws);
  const back = seats(ws)[0];
  assert.equal(back.status, "running");
  assert.equal(back.kind, "interactive");
  assert.equal(back.name, "dotskills-7b");
  assert.equal(back.listedAtMs, STARTED_AT);
  assert.equal(back.midTurn, undefined);
  setState(ws, { sessions: [] });
  once(ws);
  assert.equal(seats(ws)[0].status, "parked");

  // Parked five seconds ago and still listed: the process is leaving (S-5).
  const leaving = workspace();
  dialogueSeat(leaving, { seat: { status: "parked", parkedAtMs: STARTED_AT - 5000 } });
  once(leaving);
  assert.equal(seats(leaving)[0].status, "parked");
});

test("the census clears a dead launcher's hold, and a forMs hold once the transcript has been quiet that long (spec 2.4)", () => {
  const dead = spawnSync(process.execPath, ["-e", ""]).pid;
  const ws = workspace();
  dialogueSeat(ws, { seat: { held: { atMs: STARTED_AT, pid: dead } } });
  once(ws);
  assert.equal(seats(ws)[0].held, undefined);
  assert.match(spawnerLog(ws), /census: sess-d hold cleared/);
  for (const [quietMs, cleared] of [
    [3360000, true],
    [600000, false],
  ]) {
    const each = workspace();
    const transcript = dialogueSeat(each, { seat: { held: { atMs: STARTED_AT - 3600000, forMs: 3300000 } } });
    const at = new Date(STARTED_AT - quietMs);
    fs.utimesSync(transcript, at, at);
    once(each);
    assert.equal(seats(each)[0].held === undefined, cleared);
  }
});
