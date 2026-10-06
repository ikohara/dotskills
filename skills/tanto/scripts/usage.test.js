// The tests of `usage.js`. Every transcript here is synthetic, built from
// records shaped as the harness writes them -- `message.id`, `message.model`,
// `message.usage` with its `cache_creation` split, `origin.kind`, the
// `subagents/` directory with its `.meta.json`, `toolUseResult`'s
// `resumedAgentId` -- so that no real transcript, a file that carries the
// human's words, is ever committed. Each workspace, config directory, and
// skill directory is a temp directory of its own, so the host's real config
// and salt never decide a result.
const test = require("node:test");
const { after } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const usage = require("./usage.js");

const SCRIPT = path.join(__dirname, "usage.js");

const tmpDirs = [];
function tmpDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tanto-usage-"));
  tmpDirs.push(dir);
  return dir;
}
after(() => {
  for (const dir of tmpDirs) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // Best-effort teardown: one locked directory must not stop the rest.
    }
  }
});

// The measurement's moment, and the fixtures' origin four hours before it.
const NOW = "2026-10-06T12:00:00.000Z";
const T0 = Date.parse("2026-10-06T08:00:00.000Z");
function at(minutes) {
  return new Date(T0 + minutes * 60000).toISOString();
}
function pad(n) {
  return String(n).padStart(2, "0");
}
function localDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Placeholder rates: the real table is the built-in file's, which this
// suite never reads.
const RATES = {
  as_of: "2026-01-01",
  source: "fixture",
  unit: "USD",
  per_mtok: {
    "model-a": { input: 1000, cache_write_5m: 2000, cache_write_1h: 4000, cache_read: 100, output: 10000 },
    "model-b": { input: 2000, cache_write_5m: 4000, cache_write_1h: 8000, cache_read: 200, output: 20000 },
  },
};

let seq = 0;

/** One response, split over one record per content block, as the harness writes it. */
function response(minute, { id, model = "model-a", usage: u = {}, blocks, effort } = {}) {
  const messageId = id ?? `msg-${++seq}`;
  const full = {
    input_tokens: 0,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 0,
    output_tokens: 0,
    ...u,
  };
  return (blocks ?? [{ type: "text", text: "ok" }]).map((block) => ({
    type: "assistant",
    timestamp: at(minute),
    ...(effort ? { perTurnEffort: effort } : {}),
    message: { id: messageId, model, role: "assistant", usage: full, content: [block] },
  }));
}

function wake(minute, kind, text = "go on") {
  return {
    type: "user",
    timestamp: at(minute),
    ...(kind ? { origin: { kind } } : {}),
    message: { role: "user", content: text },
  };
}

function toolResult(minute, extra = {}) {
  return {
    type: "user",
    timestamp: at(minute),
    message: { role: "user", content: [{ type: "tool_result", tool_use_id: "x", content: "ok" }] },
    ...extra,
  };
}

function agentUse(id) {
  return { type: "tool_use", id, name: "Agent", input: { description: "a task" } };
}

function writeJsonl(file, records) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    `${records
      .flat()
      .map((r) => JSON.stringify(r))
      .join("\n")}\n`,
    "utf8",
  );
  // A transcript is as recent as the measurement, so the mtime rule that
  // skips a Kanri which ended before the window never fires by accident.
  fs.utimesSync(file, new Date(NOW), new Date(NOW));
}

function linesOf(records) {
  return records.flat().map((r) => JSON.stringify(r));
}

/**
 * A workspace, a config directory, and a skill directory. `skill` is where
 * the skill lives: `own` (inside this workspace, which holds `.git`),
 * `other` (another repository with a `.tanto/`), `bare` (another repository
 * without one), or `copied` (no repository at all).
 */
function workspace({ skill = "other", builtIn = {} } = {}) {
  const base = tmpDir();
  const root = path.join(base, "quarry");
  const configDir = path.join(base, "cfg");
  fs.mkdirSync(root, { recursive: true });
  fs.mkdirSync(configDir, { recursive: true });
  let skillRepo = null;
  let skillDir;
  if (skill === "own") {
    fs.mkdirSync(path.join(root, ".git"));
    skillRepo = root;
    skillDir = path.join(root, "skills", "tanto");
  } else if (skill === "other" || skill === "bare") {
    skillRepo = path.join(base, "toolrepo");
    fs.mkdirSync(path.join(skillRepo, ".git"), { recursive: true });
    if (skill === "other") fs.mkdirSync(path.join(skillRepo, ".tanto", "inbox"), { recursive: true });
    skillDir = path.join(skillRepo, "skills", "tanto");
  } else {
    skillDir = path.join(base, "copied", "tanto");
  }
  const templates = path.join(skillDir, "templates");
  fs.mkdirSync(templates, { recursive: true });
  fs.writeFileSync(
    path.join(templates, "tanto.json"),
    JSON.stringify({ ceiling: { share_threshold: 100 }, rates: RATES, plans: [], ...builtIn }),
    "utf8",
  );
  return { base, root, configDir, skillDir, skillRepo, seats: 0 };
}

/**
 * One seat: its transcript under `<config dir>/projects/<slug>/`, its
 * dispatches under `<sessionId>/subagents/`, and its spawn result under
 * `.tanto/spawner/results/` unless `listed` is false.
 */
function addSeat(ws, seat) {
  const n = ++ws.seats;
  const sessionId = seat.sessionId ?? `${String(n).padStart(8, "0")}-0000-4000-8000-${String(n).padStart(12, "0")}`;
  const file = path.join(ws.configDir, "projects", seat.slug ?? "proj", `${sessionId}.jsonl`);
  writeJsonl(file, seat.records ?? []);
  for (const sub of seat.subagents ?? []) {
    const dir = path.join(ws.configDir, "projects", seat.slug ?? "proj", sessionId, "subagents");
    writeJsonl(path.join(dir, `agent-${sub.id}.jsonl`), sub.records);
    fs.writeFileSync(
      path.join(dir, `agent-${sub.id}.meta.json`),
      JSON.stringify({
        agentType: sub.agentType,
        description: "d",
        toolUseId: sub.toolUseId,
        spawnDepth: 1,
        model: "x",
      }),
      "utf8",
    );
  }
  if (seat.listed !== false) {
    const results = path.join(ws.root, ".tanto", "spawner", "results");
    fs.mkdirSync(results, { recursive: true });
    fs.writeFileSync(
      path.join(results, `2026-10-06T00-00-${pad(n)}-spawn-${seat.role}.json`),
      JSON.stringify({
        op: "spawn",
        role: seat.role,
        topic: seat.topic ?? "alpha-topic",
        sessionId,
        id: sessionId.slice(0, 8),
        name: `seat-${seat.role}-${n}`,
        transcript: file,
        startedAt: seat.startedAt ?? "2026-10-06 00:00",
      }),
      "utf8",
    );
  }
  return { sessionId, file, name: `seat-${seat.role}-${n}` };
}

function run(ws, args, { now = NOW, env = {} } = {}) {
  const full = [
    SCRIPT,
    ...args,
    "--root",
    ws.root,
    "--config-dir",
    ws.configDir,
    "--skill-dir",
    ws.skillDir,
    "--config",
    path.join(ws.configDir, "tanto.json"),
    "--project-config",
    path.join(ws.root, ".claude", "tanto.json"),
    "--now",
    now,
  ];
  const result = spawnSync(process.execPath, full, {
    encoding: "utf8",
    cwd: ws.root,
    // No git discovery above the temp directory: a workspace here is inside
    // git only when a test makes it so.
    env: { ...process.env, CLAUDE_CONFIG_DIR: ws.configDir, GIT_CEILING_DIRECTORIES: os.tmpdir(), ...env },
  });
  return { code: result.status, out: result.stdout || "", err: result.stderr || "" };
}

function readUsage(ws, topic = "alpha-topic") {
  return JSON.parse(fs.readFileSync(path.join(ws.root, ".tanto", topic, "usage.json"), "utf8"));
}

/** The keikaku seat most tests share: one response of three records, a dated id, an unknown id. */
function basicSeat(ws) {
  return addSeat(ws, {
    role: "keikaku",
    records: [
      wake(0, "human"),
      ...response(1, {
        id: "k-r1",
        usage: { input_tokens: 1000, output_tokens: 100 },
        blocks: [
          { type: "text", text: "a" },
          { type: "text", text: "b" },
          { type: "tool_use", id: "tu-k1", name: "Bash", input: { command: "true" } },
        ],
        effort: "high",
      }),
      toolResult(1.2),
      wake(1.5, "peer"),
      ...response(2, {
        model: "model-a-20260101",
        usage: { cache_read_input_tokens: 2000, output_tokens: 200 },
        effort: "high",
      }),
      wake(2.5, "task-notification"),
      wake(3.5, null),
      ...response(4, { model: "model-z", usage: { input_tokens: 500, output_tokens: 50 }, effort: "max" }),
    ],
  });
}

const SHOKI_PART = [
  "# Shoroku feedback — <workspace id> <YYYY-MM-DD>",
  "",
  "A lead paragraph that instructs the scribe and does not travel.",
  "",
  "- Workspace — <workspace id>",
  "- Closed — <YYYY-MM-DD>",
  "",
  "## Items",
  "",
  "1. The recommend dispatch names the feedback destination in its first line — Class: tanto-only",
  "",
  "## Departures",
  "",
  "1. override — recommended issues, adopt — directed issues, reject — the item duplicated an open one — rule: none yet",
  "",
  "## Usage",
  "",
  "<one fenced json block: the usage extract of 4.6>",
  "",
  "## Received",
  "",
  "## Triage",
  "",
  "- Outcome — <feedback>",
  "",
].join("\n");

function writeShokiPart(ws, text = SHOKI_PART, topic = "alpha-topic") {
  const file = path.join(ws.root, ".tanto", topic, "shoroku-feedback.md");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, "utf8");
  return file;
}

function workspaceIdOf(ws) {
  const out = run(ws, ["id"]).out;
  return out.match(/^workspace: ([0-9a-f]{7})$/m)[1];
}

/** The lines of one `## ` section of a Markdown text. */
function section(text, name) {
  const lines = text.split("\n");
  const start = lines.indexOf(`## ${name}`);
  if (start === -1) return null;
  const out = [];
  for (let i = start + 1; i < lines.length && !lines[i].startsWith("## "); i++) out.push(lines[i]);
  return out.join("\n").trim();
}

function usageBlockOf(text) {
  const body = section(text, "Usage");
  return body.replace(/^```json\n/, "").replace(/\n```$/, "");
}

// ---------------------------------------------------------------------------
// Counting

test("a response of three records sharing a message.id is counted once", () => {
  const summary = usage.summarizeTranscript(
    linesOf(
      response(1, {
        id: "one",
        usage: { input_tokens: 10, cache_read_input_tokens: 100, output_tokens: 50 },
        blocks: [
          { type: "text", text: "a" },
          { type: "text", text: "b" },
          { type: "text", text: "c" },
        ],
      }),
    ),
  );
  assert.equal(summary.responses.length, 1);
  assert.deepEqual(summary.responses[0].counts, {
    responses: 1,
    input: 10,
    cache_write_5m: 0,
    cache_write_1h: 0,
    cache_read: 100,
    output: 50,
  });
});

test("the creation count is split by cache_creation, and taken whole as 5m without it", () => {
  assert.deepEqual(
    usage.countsOf({
      input_tokens: 1,
      cache_creation_input_tokens: 30,
      cache_read_input_tokens: 4,
      output_tokens: 5,
      cache_creation: { ephemeral_5m_input_tokens: 10, ephemeral_1h_input_tokens: 20 },
    }),
    { responses: 1, input: 1, cache_write_5m: 10, cache_write_1h: 20, cache_read: 4, output: 5 },
  );
  assert.deepEqual(
    usage.countsOf({ input_tokens: 1, cache_creation_input_tokens: 30, cache_read_input_tokens: 4, output_tokens: 5 }),
    { responses: 1, input: 1, cache_write_5m: 30, cache_write_1h: 0, cache_read: 4, output: 5 },
  );
});

test("wake-ups are counted by origin.kind, tool results are none, and a compaction is counted", () => {
  const summary = usage.summarizeTranscript(
    linesOf([
      wake(0, "human"),
      wake(1, "peer"),
      wake(2, "peer"),
      wake(3, "task-notification"),
      wake(4, null, "This session is being continued from a previous conversation. Summary follows."),
      toolResult(5),
      ...response(6, {}),
    ]),
  );
  assert.deepEqual(summary.wakeups, { human: 1, peer: 2, task: 1, other: 1, cold: 0, warm: 0 });
  assert.equal(summary.compactions, 1);
});

test("cold and warm count the wake-ups after a gap of five to sixty minutes", () => {
  const summary = usage.summarizeTranscript(
    linesOf([
      ...response(0, { usage: { cache_read_input_tokens: 1000 } }),
      wake(10, "peer"),
      ...response(10.1, { usage: { input_tokens: 500, cache_read_input_tokens: 10 } }),
      wake(11, "peer"),
      ...response(11, { usage: { input_tokens: 500, cache_read_input_tokens: 10 } }),
      wake(31, "peer"),
      ...response(31, { usage: { input_tokens: 1, cache_read_input_tokens: 1000 } }),
      wake(200, "peer"),
      ...response(200, { usage: { input_tokens: 500 } }),
    ]),
  );
  assert.equal(summary.wakeups.cold, 1);
  assert.equal(summary.wakeups.warm, 1);
});

test("a window keeps only the records stamped inside it", () => {
  const summary = usage.summarizeTranscript(
    linesOf([
      wake(-10, "human"),
      ...response(-9, { usage: { output_tokens: 1000 } }),
      wake(5, "peer"),
      ...response(6, { usage: { output_tokens: 7 } }),
      ...response(500, { usage: { output_tokens: 1000 } }),
    ]),
    { from: T0, to: T0 + 60 * 60000 },
  );
  assert.equal(summary.responses.length, 1);
  assert.equal(summary.responses[0].counts.output, 7);
  assert.deepEqual(summary.wakeups, { human: 0, peer: 1, task: 0, other: 0, cold: 0, warm: 0 });
});

test("the batch key is read from a Write block, and from the boundary line sent to Kanri", () => {
  const summary = usage.summarizeTranscript(
    linesOf([
      ...response(1, {
        blocks: [
          {
            type: "tool_use",
            id: "w1",
            name: "Write",
            input: { file_path: "/x/.tanto/t/batch-A-rework-1-report.md", content: "r" },
          },
        ],
      }),
      ...response(2, {
        blocks: [
          {
            type: "tool_use",
            id: "s1",
            name: "SendMessage",
            input: { to: "kanri", message: ".tanto/t/batch-fixwave-report.md — transcript: 1 B" },
          },
        ],
      }),
      ...response(3, {
        blocks: [
          { type: "tool_use", id: "w2", name: "Write", input: { file_path: "/x/.tanto/t/notes.md", content: "n" } },
          { type: "tool_use", id: "s2", name: "SendMessage", input: { to: "kanri", message: "see batch-B-report.md" } },
        ],
      }),
    ]),
  );
  assert.deepEqual(
    summary.markers.map((m) => m.key),
    ["A-rework-1", "fixwave"],
  );
});

test("the Tasks cell's four forms", () => {
  assert.equal(usage.parseTasksCell("1-4"), 4);
  assert.equal(usage.parseTasksCell("F1-F7"), 7);
  assert.equal(usage.parseTasksCell("1, 3, 5-7"), 5);
  assert.equal(usage.parseTasksCell("2"), 1);
  assert.equal(usage.parseTasksCell("the rest"), null);
  assert.equal(usage.parseTasksCell("F1-G3"), null);
  assert.equal(usage.parseTasksCell(""), null);
});

test("a model id is priced exactly, else by its longest prefix, else not at all", () => {
  const table = {
    m: { input: 1, cache_write_5m: 0, cache_write_1h: 0, cache_read: 0, output: 0 },
    "m-x": { input: 2, cache_write_5m: 0, cache_write_1h: 0, cache_read: 0, output: 0 },
  };
  assert.equal(usage.rateRowOf(table, "m-x"), table["m-x"]);
  assert.equal(usage.rateRowOf(table, "m-x-20260101"), table["m-x"]);
  assert.equal(usage.rateRowOf(table, "m-y"), table.m);
  assert.equal(usage.rateRowOf(table, "q"), null);
  assert.equal(usage.amountOf({ input: 3000000 }, table["m-x"]), 6);
  assert.equal(usage.amountOf({ input: 3000000 }, null), null);
});

test("a dispatch kind is the agent type read back, else the type as it stands", () => {
  assert.equal(usage.kindOf("tanto-task-review-spec"), "task.review-spec");
  assert.equal(usage.kindOf("tanto-shoroku-recommend"), "shoroku.recommend");
  assert.equal(usage.kindOf("tanto-default"), "default");
  assert.equal(usage.kindOf("fork"), "fork");
  assert.equal(usage.kindOf(undefined), "unknown");
  assert.equal(usage.KINDS.length, 15);
});

// ---------------------------------------------------------------------------
// measure

test("measure writes usage.json with its keys and no others, and prints the cost line", () => {
  const ws = workspace();
  const seat = basicSeat(ws);
  const result = run(ws, ["measure", "--topic", "alpha-topic"]);
  assert.equal(result.code, 0, result.err);
  assert.equal(
    result.out.trim(),
    "cost: alpha-topic as of the kessai — model-a-20260101 2.20; model-a 2.00; model-z unpriced (550 tokens) — total 4.20 USD (rates 2026-01-01)",
  );
  const u = readUsage(ws);
  assert.deepEqual(Object.keys(u), [
    "schema",
    "topic",
    "stage",
    "measured_at",
    "window",
    "active_hours",
    "seats",
    "dispatches",
    "quality",
    "share",
    "totals",
    "skipped",
  ]);
  assert.equal(u.schema, 1);
  assert.equal(u.stage, "kessai");
  assert.equal(u.measured_at, NOW);
  assert.deepEqual(u.window, { from: at(0), to: NOW });
  assert.equal(u.seats.length, 1);
  const s = u.seats[0];
  assert.deepEqual(Object.keys(s), [
    "session",
    "role",
    "windowed",
    "effort",
    "models",
    "wakeups",
    "context",
    "compactions",
    "first",
    "last",
  ]);
  assert.equal(s.session, seat.sessionId);
  assert.equal(s.role, "keikaku");
  assert.equal(s.windowed, false);
  assert.equal(s.effort, "max");
  assert.deepEqual(s.models["model-a"], {
    responses: 1,
    input: 1000,
    cache_write_5m: 0,
    cache_write_1h: 0,
    cache_read: 0,
    output: 100,
  });
  assert.deepEqual(s.wakeups, { human: 1, peer: 1, task: 1, other: 1, cold: 0, warm: 0 });
  assert.deepEqual(s.context, { first: 1000, last: 500, max: 2000 });
  assert.equal(s.first, at(1));
  assert.equal(s.last, at(4));
  assert.deepEqual(u.totals.unpriced, ["model-z"]);
  assert.equal(u.totals.amount, 4.2);
  assert.equal(u.totals.by_model["model-z"].amount, null);
  assert.equal(u.totals.by_model["model-a-20260101"].amount, 2.2);
  assert.equal(u.totals.unit, "USD");
  assert.equal(u.totals.rates_as_of, "2026-01-01");
  assert.deepEqual(u.skipped, []);
});

test("a subagent directory is summed per dispatch, with its kind, tool uses, wall time, and resumes", () => {
  const ws = workspace();
  addSeat(ws, {
    role: "jisso",
    records: [
      wake(0, "peer"),
      ...response(1, { blocks: [agentUse("tu-1"), agentUse("tu-2"), agentUse("tu-3")] }),
      toolResult(20, { toolUseResult: { success: true, resumedAgentId: "ag1" } }),
    ],
    subagents: [
      {
        id: "ag1",
        agentType: "tanto-task-implement",
        toolUseId: "tu-1",
        records: [
          wake(2, null, "do task 1"),
          ...response(3, {
            model: "model-b",
            usage: { input_tokens: 10, output_tokens: 1 },
            blocks: [
              { type: "tool_use", id: "a1", name: "Read", input: {} },
              { type: "tool_use", id: "a2", name: "Edit", input: {} },
            ],
          }),
          ...response(7, { model: "model-b", usage: { input_tokens: 20, output_tokens: 2 } }),
        ],
      },
      {
        id: "ag2",
        agentType: "tanto-task-implement",
        toolUseId: "tu-2",
        records: [...response(4, { model: "model-b", usage: { input_tokens: 5, output_tokens: 5 } })],
      },
      {
        id: "ag3",
        agentType: "tanto-task-review-spec",
        toolUseId: "tu-3",
        records: [...response(5, { model: "model-a", usage: { output_tokens: 3 } })],
      },
    ],
  });
  assert.equal(run(ws, ["measure", "--topic", "alpha-topic"]).code, 0);
  const u = readUsage(ws);
  const byAgent = Object.fromEntries(u.dispatches.map((d) => [d.agent, d]));
  assert.deepEqual(Object.keys(byAgent.ag1), ["session", "agent", "kind", "models", "tool_uses", "wall_ms", "resumes"]);
  assert.equal(byAgent.ag1.kind, "task.implement");
  assert.equal(byAgent.ag1.models["model-b"].responses, 2);
  assert.equal(byAgent.ag1.models["model-b"].input, 30);
  assert.equal(byAgent.ag1.tool_uses, 2);
  assert.equal(byAgent.ag1.wall_ms, 5 * 60000);
  assert.equal(byAgent.ag1.resumes, 1);
  assert.equal(byAgent.ag2.resumes, 0);
  assert.equal(byAgent.ag3.kind, "task.review-spec");

  const extract = usage.extractOf(u, "abcdef0", "2026-10-06");
  const implement = extract.dispatches.find((d) => d.kind === "task.implement");
  assert.deepEqual(implement, {
    role: "jisso",
    kind: "task.implement",
    model: "model-b",
    n: 2,
    counts: { responses: 3, input: 35, cache_write_5m: 0, cache_write_1h: 0, cache_read: 0, output: 8 },
    tool_uses: 2,
    wall_ms: 5 * 60000,
    resumes: 1,
  });
});

test("a Kanri seat is counted over the topic's window only, and one outside it not at all", () => {
  const ws = workspace();
  addSeat(ws, { role: "keikaku", records: [wake(0, "human"), ...response(10, { usage: { output_tokens: 1 } })] });
  const kanri = addSeat(ws, {
    role: "kanri",
    topic: "—",
    records: [
      wake(-130, "human"),
      ...response(-120, { usage: { output_tokens: 1000 } }),
      wake(29, "peer"),
      ...response(30, { usage: { output_tokens: 7 }, blocks: [agentUse("tu-k1")] }),
      ...response(300, { usage: { output_tokens: 1000 } }),
    ],
    subagents: [
      {
        id: "k1",
        agentType: "tanto-shoroku-recommend",
        toolUseId: "tu-k1",
        records: [
          ...response(-100, { usage: { output_tokens: 1000 } }),
          ...response(40, { usage: { output_tokens: 3 } }),
        ],
      },
      {
        id: "k2",
        agentType: "tanto-brief-write",
        toolUseId: "tu-k0",
        records: [...response(-100, { usage: { output_tokens: 1000 } })],
      },
    ],
  });
  addSeat(ws, {
    role: "kanri",
    topic: "—",
    records: [wake(-310, "human"), ...response(-300, { usage: { output_tokens: 1000 } })],
  });
  assert.equal(run(ws, ["measure", "--topic", "alpha-topic"]).code, 0);
  const u = readUsage(ws);
  const kanriSeats = u.seats.filter((s) => s.role === "kanri");
  assert.equal(kanriSeats.length, 1);
  assert.equal(kanriSeats[0].session, kanri.sessionId);
  assert.equal(kanriSeats[0].windowed, true);
  assert.deepEqual(kanriSeats[0].models["model-a"].output, 7);
  assert.deepEqual(kanriSeats[0].wakeups, { human: 0, peer: 1, task: 0, other: 0, cold: 0, warm: 0 });
  const kanriDispatches = u.dispatches.filter((d) => d.session === kanri.sessionId);
  assert.deepEqual(
    kanriDispatches.map((d) => [d.agent, d.kind, d.models["model-a"].output]),
    [["k1", "shoroku.recommend", 3]],
  );
});

test("share is the hand count over the seats' responses, each counted once", () => {
  const ws = workspace();
  addSeat(ws, {
    role: "jisso",
    records: [
      wake(0, "peer"),
      ...response(1, { usage: { input_tokens: 50 } }),
      ...response(2, { usage: { input_tokens: 50, cache_read_input_tokens: 100 } }),
      ...response(3, {
        usage: { cache_creation_input_tokens: 200 },
        blocks: [
          { type: "text", text: "a" },
          { type: "text", text: "b" },
        ],
      }),
    ],
  });
  assert.equal(run(ws, ["measure", "--topic", "alpha-topic"]).code, 0);
  assert.deepEqual(readUsage(ws).share, { threshold: 100, over: 350, total: 400, pct: 88 });
});

test("active hours count the five-minute slots with a response, across a gap", () => {
  const ws = workspace();
  addSeat(ws, {
    role: "jisso",
    records: [
      wake(0, "peer"),
      ...response(0.5, { blocks: [agentUse("tu-g")] }),
      ...response(1, {}),
      ...response(4, {}),
      ...response(6, {}),
      ...response(130, {}),
    ],
    subagents: [{ id: "g", agentType: "tanto-task-implement", toolUseId: "tu-g", records: [...response(200, {})] }],
  });
  assert.equal(run(ws, ["measure", "--topic", "alpha-topic"]).code, 0);
  // Slots 0, 1, 26, and 40 from the window's start: four of twelve.
  assert.equal(readUsage(ws).active_hours, 0.33);
});

test("measure prints cost: unavailable and writes nothing when the topic has no seat", () => {
  const ws = workspace();
  basicSeat(ws);
  const result = run(ws, ["measure", "--topic", "beta-topic"]);
  assert.equal(result.code, 0);
  assert.equal(result.out.trim(), "cost: unavailable — no seat of the topic in the spawner's files");
  assert.equal(fs.existsSync(path.join(ws.root, ".tanto", "beta-topic", "usage.json")), false);
});

test("--transcripts reads the paths given, a role the spawner does not know read as unknown", () => {
  const ws = workspace();
  const known = addSeat(ws, { role: "jisso", topic: "old-topic", records: [...response(1, {})] });
  const loose = addSeat(ws, { role: "sekkei", listed: false, records: [...response(2, {})] });
  const result = run(ws, ["measure", "--topic", "old-topic", "--transcripts", known.file, loose.file]);
  assert.equal(result.code, 0, result.err);
  const u = readUsage(ws, "old-topic");
  assert.deepEqual(
    u.seats.map((s) => [s.session, s.role, s.windowed]),
    [
      [known.sessionId, "jisso", false],
      [loose.sessionId, "unknown", false],
    ],
  );
});

test("measure records the cold and warm wake-ups in the seat's entry", () => {
  const ws = workspace();
  addSeat(ws, {
    role: "jisso",
    records: [
      wake(0, "peer"),
      ...response(1, { usage: { cache_read_input_tokens: 1000 } }),
      wake(11, "peer"),
      ...response(11, { usage: { input_tokens: 500, cache_read_input_tokens: 10 } }),
      wake(41, "task-notification"),
      ...response(41, { usage: { input_tokens: 1, cache_read_input_tokens: 1000 } }),
    ],
  });
  assert.equal(run(ws, ["measure", "--topic", "alpha-topic"]).code, 0);
  assert.deepEqual(readUsage(ws).seats[0].wakeups, { human: 0, peer: 2, task: 1, other: 0, cold: 1, warm: 1 });
});

test("a measure without --final never overwrites a final file", () => {
  const ws = workspace();
  basicSeat(ws);
  assert.equal(run(ws, ["measure", "--topic", "alpha-topic", "--final"]).code, 0);
  assert.equal(readUsage(ws).stage, "final");
  const later = "2026-10-06T12:30:00.000Z";
  const result = run(ws, ["measure", "--topic", "alpha-topic"], { now: later });
  assert.equal(result.code, 0);
  const lines = result.out.trim().split("\n");
  assert.match(lines[0], /^cost: alpha-topic as of the kessai — /);
  assert.equal(lines[1], "usage: final kept");
  assert.equal(readUsage(ws).measured_at, NOW);
  assert.equal(run(ws, ["measure", "--topic", "alpha-topic", "--final"], { now: later }).code, 0);
  assert.equal(readUsage(ws).measured_at, later);
});

test("the topic's quality counters: batches by key, rework rows, the fix wave, and Kaiseki briefs", () => {
  const ws = workspace();
  const topicDir = path.join(ws.root, ".tanto", "alpha-topic");
  fs.mkdirSync(topicDir, { recursive: true });
  fs.writeFileSync(
    path.join(topicDir, "kanri.md"),
    [
      "# Kanri ledger",
      "",
      "## Batches",
      "",
      "| Batch | Tasks | State | Prompt | Report | Verdict |",
      "| --- | --- | --- | --- | --- | --- |",
      "| A | 1-4 | accepted | p | r | accepted |",
      "| A-rework-1 | 2, 4 | accepted | p | r | accepted |",
      "| fix wave | F1-F3 | accepted | p | r | accepted |",
      "",
      "## Rulings",
      "",
    ].join("\n"),
    "utf8",
  );
  for (const name of ["kaiseki-1-brief.md", "kaiseki-2-brief.md", "kaiseki-1-report.md"]) {
    fs.writeFileSync(path.join(topicDir, name), "x", "utf8");
  }
  const send = (id, key) => ({
    type: "tool_use",
    id,
    name: "SendMessage",
    input: { to: "kanri", message: `.tanto/alpha-topic/batch-${key}-report.md — transcript: 1 B` },
  });
  const sub = (id, agentType, minute) => ({
    id,
    agentType,
    toolUseId: `tu-${id}`,
    records: [...response(minute + 0.5, { model: "model-b" })],
  });
  addSeat(ws, {
    role: "jisso",
    records: [
      wake(0, "peer"),
      ...response(1, { blocks: [agentUse("tu-d1")] }),
      ...response(2, { blocks: [agentUse("tu-d2")] }),
      ...response(3, { blocks: [agentUse("tu-d3")] }),
      toolResult(5, { toolUseResult: { success: true, resumedAgentId: "d1" } }),
      ...response(10, { blocks: [send("m1", "A")] }),
      ...response(11, { blocks: [agentUse("tu-d4")] }),
      ...response(12, { blocks: [agentUse("tu-d5")] }),
      ...response(20, {
        blocks: [
          {
            type: "tool_use",
            id: "w1",
            name: "Write",
            input: { file_path: "/w/.tanto/alpha-topic/batch-A-rework-1-report.md", content: "r" },
          },
        ],
      }),
    ],
    subagents: [
      sub("d1", "tanto-task-implement", 1),
      sub("d2", "tanto-task-review-spec", 2),
      sub("d3", "tanto-task-review-quality", 3),
      sub("d4", "tanto-task-implement", 11),
      sub("d5", "tanto-task-escalate", 12),
    ],
  });
  addSeat(ws, {
    role: "jisso",
    records: [
      wake(25, "peer"),
      ...response(30, { blocks: [agentUse("tu-e1")] }),
      ...response(40, { blocks: [send("m2", "fixwave")] }),
    ],
    subagents: [sub("e1", "tanto-task-implement", 30)],
  });
  addSeat(ws, {
    role: "jisso",
    records: [wake(45, "peer"), ...response(50, { blocks: [agentUse("tu-f1")] })],
    subagents: [sub("f1", "tanto-task-implement", 50)],
  });
  assert.equal(run(ws, ["measure", "--topic", "alpha-topic"]).code, 0);
  const q = readUsage(ws).quality;
  const byKey = Object.fromEntries(q.batches.map((b) => [b.key, b]));
  assert.deepEqual(Object.keys(byKey).sort(), ["A", "A-rework-1", "fix wave", "unknown"]);
  assert.deepEqual(byKey.A, {
    key: "A",
    tasks: 4,
    state: "accepted",
    implement: 1,
    implement_resumes: 1,
    review_spec: 1,
    review_quality: 1,
    escalate: 0,
  });
  assert.equal(byKey["A-rework-1"].tasks, 2);
  assert.equal(byKey["A-rework-1"].implement, 1);
  assert.equal(byKey["A-rework-1"].escalate, 1);
  assert.equal(byKey["fix wave"].tasks, 3);
  assert.equal(byKey["fix wave"].implement, 1);
  assert.equal(byKey.unknown.tasks, null);
  assert.equal(byKey.unknown.state, null);
  assert.equal(byKey.unknown.implement, 1);
  assert.equal(q.rework_batches, 1);
  assert.equal(q.fix_wave_tasks, 3);
  assert.equal(q.kaiseki, 2);
});

// ---------------------------------------------------------------------------
// The two tables' layering

test("a later layer replaces one model's row whole, plans as a list, and an unknown field is warned", () => {
  const warnings = [];
  const layers = [
    { file: "built-in.json", builtIn: true, data: { rates: { ...RATES, extra: 1 }, plans: [] } },
    {
      file: "personal.json",
      builtIn: false,
      data: {
        rates: { as_of: "2026-03-01", per_mtok: { "model-a": { input: 7, bogus: 1 } } },
        plans: [
          { name: "p1", window: "5h", budget: 1, as_of: "2026-03-01" },
          { name: "p2", window: "7d", budget: 2, as_of: "2026-03-01" },
        ],
      },
    },
    {
      file: "project.json",
      builtIn: false,
      data: { plans: [{ name: "p3", window: "7d", budget: 5, as_of: "2026-03-02", color: "red" }] },
    },
  ];
  const rates = usage.mergeRates(layers, (line) => warnings.push(line));
  const plans = usage.mergePlans(layers, (line) => warnings.push(line));
  assert.deepEqual(rates.per_mtok["model-a"], { input: 7 });
  assert.deepEqual(rates.per_mtok["model-b"], RATES.per_mtok["model-b"]);
  assert.equal(rates.as_of, "2026-03-01");
  assert.equal(rates.source, "fixture");
  assert.equal(rates.unit, "USD");
  assert.deepEqual(plans, [{ name: "p3", window: "7d", budget: 5, as_of: "2026-03-02" }]);
  assert.deepEqual(warnings, [
    "unknown key rates.per_mtok.model-a.bogus in personal.json, ignored",
    "unknown key plans.color in project.json, ignored",
  ]);
});

test("measure warns on stderr about a field of rates it does not know", () => {
  const ws = workspace();
  basicSeat(ws);
  const personal = path.join(ws.configDir, "tanto.json");
  fs.writeFileSync(personal, JSON.stringify({ rates: { currency: "EUR" } }), "utf8");
  const result = run(ws, ["measure", "--topic", "alpha-topic"]);
  assert.equal(result.code, 0);
  assert.equal(result.err.trim(), `unknown key rates.currency in ${personal}, ignored`);
});

// ---------------------------------------------------------------------------
// id

function git(cwd, ...args) {
  const result = spawnSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    env: { ...process.env, GIT_CEILING_DIRECTORIES: os.tmpdir() },
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

test("the id is one repository's at two paths, another under another salt, and the slug's outside git", () => {
  const ws = workspace({ skill: "copied" });
  git(ws.root, "init", "-q");
  git(
    ws.root,
    "-c",
    "user.name=t",
    "-c",
    "user.email=t@example.com",
    "-c",
    "commit.gpgsign=false",
    "commit",
    "-q",
    "--allow-empty",
    "-m",
    "root",
  );
  const clone = path.join(ws.base, "elsewhere");
  spawnSync("git", ["clone", "-q", ws.root, clone], { encoding: "utf8" });
  const rootCommit = git(ws.root, "rev-list", "--max-parents=0", "HEAD");

  const first = workspaceIdOf(ws);
  const salt = fs.readFileSync(path.join(ws.configDir, "tanto-salt"), "utf8").trim();
  assert.match(salt, /^[0-9a-f]{64}$/);
  assert.equal(first, usage.workspaceIdOf(salt, rootCommit));
  assert.equal(workspaceIdOf({ ...ws, root: clone }), first);

  const otherConfig = path.join(ws.base, "cfg2");
  assert.notEqual(workspaceIdOf({ ...ws, configDir: otherConfig }), first);

  const plain = path.join(ws.base, "plain");
  fs.mkdirSync(plain);
  assert.equal(workspaceIdOf({ ...ws, root: plain }), usage.workspaceIdOf(salt, usage.slugOf(plain)));
});

test("the salt is written once, owner-only where modes exist, and never rewritten", () => {
  const ws = workspace({ skill: "copied" });
  const file = path.join(ws.configDir, "tanto-salt");
  assert.equal(fs.existsSync(file), false);
  const first = workspaceIdOf(ws);
  const salt = fs.readFileSync(file, "utf8");
  if (process.platform !== "win32") assert.equal(fs.statSync(file).mode & 0o077, 0);
  assert.equal(workspaceIdOf(ws), first);
  assert.equal(fs.readFileSync(file, "utf8"), salt);

  const kept = workspace({ skill: "copied" });
  fs.writeFileSync(path.join(kept.configDir, "tanto-salt"), "a-salt-of-the-human's\n", "utf8");
  assert.equal(workspaceIdOf(kept), usage.workspaceIdOf("a-salt-of-the-human's", usage.slugOf(kept.root)));
  assert.equal(fs.readFileSync(path.join(kept.configDir, "tanto-salt"), "utf8"), "a-salt-of-the-human's\n");
});

/** True when a directory above the temp directory holds `.git`, which makes the copied case unreachable here. */
function gitAboveTemp() {
  let dir = os.tmpdir();
  for (;;) {
    if (fs.existsSync(path.join(dir, ".git"))) return true;
    const parent = path.dirname(dir);
    if (parent === dir) return false;
    dir = parent;
  }
}

test("id's second line names this one, another root, or none", (t) => {
  const own = workspace({ skill: "own" });
  assert.match(run(own, ["id"]).out, /^skill repository: this one$/m);
  const other = workspace({ skill: "other" });
  assert.equal(run(other, ["id"]).out.split("\n")[1], `skill repository: ${fs.realpathSync(other.skillRepo)}`);
  if (gitAboveTemp()) {
    t.skip("a directory above the temp directory holds .git");
    return;
  }
  const copied = workspace({ skill: "copied" });
  assert.match(run(copied, ["id"]).out, /^skill repository: none$/m);
});

// ---------------------------------------------------------------------------
// close

test("close in a workspace whose skill repository has a .tanto/ places the file in sent/ and prints four lines", () => {
  const ws = workspace({ skill: "other" });
  basicSeat(ws);
  writeShokiPart(ws);
  const id = workspaceIdOf(ws);
  const date = localDate(NOW);
  const result = run(ws, ["close", "--topic", "alpha-topic"]);
  assert.equal(result.code, 0, result.out + result.err);
  const placed = path.join(ws.root, ".tanto", "sent", `${date}-feedback-${id}.md`);
  assert.deepEqual(result.out.trim().split("\n"), [
    "usage: .tanto/alpha-topic/usage.json — cost: alpha-topic as of the close — model-a-20260101 2.20; model-a 2.00; model-z unpriced (550 tokens) — total 4.20 USD (rates 2026-01-01)",
    `feedback: ${placed}`,
    `to: ${fs.realpathSync(ws.skillRepo)}`,
    `send: shoroku-feedback: ${placed}`,
  ]);
  assert.equal(readUsage(ws).stage, "final");
  const text = fs.readFileSync(placed, "utf8");
  const lines = text.split("\n");
  assert.equal(lines[0], `# Shoroku feedback — ${id} ${date}`);
  assert.ok(lines.includes(`- Workspace — ${id}`));
  assert.ok(lines.includes(`- Closed — ${date}`));
  assert.ok(!text.includes("A lead paragraph"));
  assert.equal(
    section(text, "Items"),
    "1. The recommend dispatch names the feedback destination in its first line — Class: tanto-only",
  );
  assert.match(section(text, "Departures"), /^1\. override — /);
  const extract = JSON.parse(usageBlockOf(text));
  assert.equal(extract.workspace, id);
  assert.equal(extract.closed, date);
  assert.equal(extract.measured, true);
  assert.equal(section(text, "Received"), "");
  assert.match(section(text, "Triage"), /^- Outcome — <feedback>$/m);
});

test("the extract carries no session, first, last, measured_at, or window key, and no ISO instant", () => {
  const ws = workspace({ skill: "other" });
  basicSeat(ws);
  writeShokiPart(ws);
  assert.equal(run(ws, ["close", "--topic", "alpha-topic"]).code, 0);
  const sent = path.join(ws.root, ".tanto", "sent");
  const text = fs.readFileSync(path.join(sent, fs.readdirSync(sent)[0]), "utf8");
  const block = usageBlockOf(text);
  const extract = JSON.parse(block);
  // `context.first` and `context.last` are token counts, not instants; the
  // keys that go are the seat's own and the measurement's.
  assert.deepEqual(Object.keys(extract.seats[0]), [
    "role",
    "windowed",
    "effort",
    "models",
    "wakeups",
    "context",
    "compactions",
    "hours",
  ]);
  assert.doesNotMatch(block, /"(session|agent|measured_at|window|topic)":/);
  assert.doesNotMatch(block, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
  assert.deepEqual(Object.keys(extract), [
    "schema",
    "workspace",
    "closed",
    "measured",
    "span_hours",
    "active_hours",
    "seats",
    "dispatches",
    "quality",
    "share",
    "totals",
  ]);
  assert.equal(extract.span_hours, 4);
  assert.equal(extract.seats[0].hours, 0.05);
});

test("close in the skill's own repository places the file in its inbox, triaged, and checks nothing", () => {
  const ws = workspace({ skill: "own" });
  basicSeat(ws);
  // The root's basename in an item would hold the file anywhere else.
  writeShokiPart(ws, SHOKI_PART.replace("in its first line", "in the quarry checkout"));
  const id = workspaceIdOf(ws);
  const date = localDate(NOW);
  const result = run(ws, ["close", "--topic", "alpha-topic"]);
  assert.equal(result.code, 0, result.out);
  const placed = path.join(ws.root, ".tanto", "inbox", `${date}-feedback-${id}.md`);
  assert.equal(result.out.trim().split("\n")[1], `feedback: own repository — ${placed}`);
  assert.equal(result.out.trim().split("\n").length, 2);
  const text = fs.readFileSync(placed, "utf8");
  assert.equal(section(text, "Received"), `- this repository's own close, ${date}`);
  assert.equal(section(text, "Triage"), ["- Outcome — feedback", "- Items — none", `- Date — ${date}`].join("\n"));
  assert.equal(fs.existsSync(path.join(ws.root, ".tanto", "sent")), false);
});

test("close with no skill repository, or one without a .tanto/, keeps the file in sent/ and sends nothing", (t) => {
  const bare = workspace({ skill: "bare" });
  basicSeat(bare);
  writeShokiPart(bare);
  const result = run(bare, ["close", "--topic", "alpha-topic"]);
  assert.equal(result.code, 0);
  const placed = path.join(bare.root, ".tanto", "sent", `${localDate(NOW)}-feedback-${workspaceIdOf(bare)}.md`);
  assert.equal(result.out.trim().split("\n")[1], `feedback: kept — the skill repository has no .tanto/ — ${placed}`);
  assert.doesNotMatch(result.out, /^send:/m);
  assert.ok(fs.existsSync(placed));
  if (gitAboveTemp()) {
    t.skip("a directory above the temp directory holds .git");
    return;
  }
  const copied = workspace({ skill: "copied" });
  basicSeat(copied);
  writeShokiPart(copied);
  const kept = run(copied, ["close", "--topic", "alpha-topic"]);
  assert.match(kept.out, /^feedback: kept — no skill repository on this machine — .+\.md$/m);
  assert.doesNotMatch(kept.out, /^send:/m);
});

test("close holds a file that names the workspace anywhere, and places nothing", () => {
  const ws = workspace({ skill: "other" });
  const seat = basicSeat(ws);
  writeShokiPart(
    ws,
    SHOKI_PART.replace("in its first line", `in ${ws.root.replace(/\\/g, "/")}/notes`).replace(
      "an open one",
      `the one ${seat.name} raised`,
    ),
  );
  const result = run(ws, ["close", "--topic", "alpha-topic"]);
  assert.equal(result.code, 1);
  const lines = result.out.trim().split("\n");
  assert.match(lines[0], /^usage: /);
  assert.equal(lines[1], "feedback: held — 2 lines name this workspace");
  assert.match(lines[2], /^ {2}\d+: 1\. The recommend dispatch names/);
  assert.match(lines[3], /^ {2}\d+: 1\. override — /);
  assert.equal(lines.length, 4);
  assert.ok(fs.existsSync(path.join(ws.root, ".tanto", "alpha-topic", "shoroku-feedback-held.md")));
  assert.equal(fs.existsSync(path.join(ws.root, ".tanto", "sent")), false);
});

test("close holds a file that names a seat by a name it took later, from seats.json", () => {
  const ws = workspace({ skill: "other" });
  const seat = basicSeat(ws);
  fs.writeFileSync(
    path.join(ws.root, ".tanto", "spawner", "seats.json"),
    JSON.stringify({ seats: [{ sessionId: seat.sessionId, name: "seat-later", renamed: "seat-renamed-9f" }] }),
    "utf8",
  );
  writeShokiPart(ws, SHOKI_PART.replace("in its first line", "as seat-renamed-9f asked"));
  const result = run(ws, ["close", "--topic", "alpha-topic"]);
  assert.equal(result.code, 1);
  assert.match(result.out, /^feedback: held — 1 lines name this workspace$/m);
});

test("close holds a file whose items name the root's basename or the topic as a word", () => {
  const ws = workspace({ skill: "other" });
  basicSeat(ws);
  writeShokiPart(
    ws,
    SHOKI_PART.replace(
      "1. The recommend dispatch",
      "1. Quarrying the ledger took long\n2. The alpha-topic close showed it\n3. The recommend dispatch",
    ),
  );
  const result = run(ws, ["close", "--topic", "alpha-topic"]);
  assert.equal(result.code, 1);
  assert.match(result.out, /^feedback: held — 1 lines name this workspace$/m);
  assert.match(result.out, /^ {2}\d+: 2\. The alpha-topic close showed it$/m);
});

test("the two needle classes are searched over their own scopes", () => {
  const needles = { anywhere: ["C:/w/quarry"], body: ["quarry", "alpha-topic"] };
  const text = [
    "# Shoroku feedback — abcdef0 2026-10-06",
    "",
    "## Items",
    "",
    "1. quarry",
    "2. at 2026-10-06T08:00:00Z",
    "",
    "## Departures",
    "",
    "none",
    "",
    "## Usage",
    "",
    "```json",
    '{ "note": "quarry", "at": "2026-10-06T08:00:00Z" }',
    "```",
    "",
    "## Received",
    "",
    "- c:/W/Quarry/x",
  ].join("\n");
  assert.deepEqual(
    usage.heldLines(text, needles).map((h) => h.line),
    [5, 15, 20],
  );

  // The needles `needlesOf` builds: each line below carries exactly one hit,
  // in the Received section where the body class does not reach, so that a
  // form dropped from `forms()` or the slug dropped from the needles shows.
  const root = "C:\\w\\quarry";
  const built = usage.needlesOf({ root }, "alpha-topic", new Map());
  const home = os.homedir();
  const hits = [
    ['an escaped path {"path":"C:\\\\w\\\\quarry"}', "the root as JSON.stringify writes it"],
    ["a git-bash path /c/w/quarry/x", "the root's /c/ form"],
    [`a home directory ${home}/notes`, "the home directory as given"],
    [`a home directory ${home.replace(/\\/g, "/")}/notes`, "the home directory with forward slashes"],
    [`a home directory ${home.replace(/\\/g, "\\\\")}\\\\notes`, "the home directory with doubled backslashes"],
    [`a session dir ${usage.slugOf(root)}`, "the slug"],
  ];
  for (const [line, what] of hits) {
    assert.equal(usage.heldLines(`## Received\n\n${line}`, built).length, 1, `held: ${what}`);
  }
});

test("close --release places a held file as it stands", () => {
  const ws = workspace({ skill: "other" });
  basicSeat(ws);
  writeShokiPart(ws, SHOKI_PART.replace("in its first line", "in the quarry checkout"));
  assert.equal(run(ws, ["close", "--topic", "alpha-topic"]).code, 1);
  const result = run(ws, ["close", "--topic", "alpha-topic", "--release"]);
  assert.equal(result.code, 0);
  assert.match(result.out, /^send: shoroku-feedback: .+\.md$/m);
  const sent = path.join(ws.root, ".tanto", "sent");
  assert.match(fs.readFileSync(path.join(sent, fs.readdirSync(sent)[0]), "utf8"), /the quarry checkout/);
  assert.equal(fs.existsSync(path.join(ws.root, ".tanto", "alpha-topic", "shoroku-feedback-held.md")), false);
});

test("close offers again every feedback file the target's inbox lacks", () => {
  const ws = workspace({ skill: "other" });
  basicSeat(ws);
  writeShokiPart(ws);
  const sent = path.join(ws.root, ".tanto", "sent");
  fs.mkdirSync(sent, { recursive: true });
  fs.writeFileSync(path.join(sent, "2026-09-01-feedback-abc1234.md"), "# Shoroku feedback — abc1234 2026-09-01\n");
  fs.writeFileSync(path.join(sent, "2026-09-02-feedback-abc1234.md"), "# Shoroku feedback — abc1234 2026-09-02\n");
  fs.writeFileSync(path.join(sent, "2026-09-03-consult-ask-01.md"), "# Consult — ask 01 — a question\n");
  fs.writeFileSync(path.join(ws.skillRepo, ".tanto", "inbox", "2026-09-02-feedback-abc1234.md"), "copy\n");
  const result = run(ws, ["close", "--topic", "alpha-topic"]);
  assert.equal(result.code, 0);
  const sends = result.out.split("\n").filter((line) => line.startsWith("send: "));
  assert.equal(sends.length, 2);
  assert.equal(sends[1], `send: shoroku-feedback: ${path.join(sent, "2026-09-01-feedback-abc1234.md")}`);
});

test("a second close changes nothing but the measurement", () => {
  const ws = workspace({ skill: "other" });
  basicSeat(ws);
  writeShokiPart(ws);
  const sent = path.join(ws.root, ".tanto", "sent");
  const first = run(ws, ["close", "--topic", "alpha-topic"]);
  assert.equal(first.code, 0);
  const firstText = fs.readFileSync(path.join(sent, fs.readdirSync(sent)[0]), "utf8");
  const later = "2026-10-06T13:00:00.000Z";
  const second = run(ws, ["close", "--topic", "alpha-topic"], { now: later });
  assert.equal(second.code, 0);
  const placedLine = (out) => out.split("\n").find((line) => line.startsWith("feedback: "));
  assert.equal(placedLine(second.out), placedLine(first.out));
  assert.equal(fs.readdirSync(sent).length, 1);
  assert.equal(readUsage(ws).measured_at, later);
  const secondText = fs.readFileSync(path.join(sent, fs.readdirSync(sent)[0]), "utf8");
  assert.equal(JSON.parse(usageBlockOf(firstText)).span_hours, 4);
  assert.equal(JSON.parse(usageBlockOf(secondText)).span_hours, 5);
  const withoutUsage = (text) => text.replace(usageBlockOf(text), "");
  assert.equal(withoutUsage(secondText), withoutUsage(firstText));
});

test("a close does not rewrite a file whose basename the receiving inbox already holds", () => {
  const ws = workspace({ skill: "other" });
  basicSeat(ws);
  writeShokiPart(ws);
  const sent = path.join(ws.root, ".tanto", "sent");
  const placedFile = path.join(ws.root, ".tanto", "alpha-topic", "shoroku-feedback-placed.txt");
  assert.equal(run(ws, ["close", "--topic", "alpha-topic"]).code, 0);
  const first = path.join(sent, fs.readdirSync(sent)[0]);
  const firstBytes = fs.readFileSync(first);
  // The intake copied the file and the receiving close triaged the copy.
  const copy = path.join(ws.skillRepo, ".tanto", "inbox", path.basename(first));
  fs.writeFileSync(copy, "triaged copy\n", "utf8");
  const second = run(ws, ["close", "--topic", "alpha-topic"]);
  assert.equal(second.code, 0, second.err);
  assert.deepEqual(fs.readFileSync(first), firstBytes);
  assert.equal(fs.readFileSync(copy, "utf8"), "triaged copy\n");
  const next = first.replace(/\.md$/, "-2.md");
  assert.deepEqual(fs.readdirSync(sent).sort(), [path.basename(first), path.basename(next)].sort());
  assert.equal(fs.readFileSync(placedFile, "utf8"), `${next}\n`);
  const lines = second.out.split("\n");
  assert.ok(lines.includes(`feedback: ${next}`));
  assert.ok(lines.includes(`send: shoroku-feedback: ${next}`));
  assert.ok(!lines.includes(`send: shoroku-feedback: ${first}`));
  assert.equal(lines.filter((line) => line.startsWith("send: ")).length, 1);
});

test("close reads the template's own placeholder lines as none, in Items and in Departures", () => {
  const ws = workspace({ skill: "other" });
  basicSeat(ws);
  const template = path.join(__dirname, "..", "templates", "shoroku-feedback.md");
  const file = path.join(ws.root, ".tanto", "alpha-topic", "shoroku-feedback.md");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.copyFileSync(template, file);
  const result = run(ws, ["close", "--topic", "alpha-topic"]);
  assert.equal(result.code, 0, result.out + result.err);
  const sent = path.join(ws.root, ".tanto", "sent");
  const text = fs.readFileSync(path.join(sent, fs.readdirSync(sent)[0]), "utf8");
  assert.equal(section(text, "Items"), "none");
  assert.equal(section(text, "Departures"), "none");
});

test("close assembles none into both sections when shoki's part is absent, and says so", () => {
  const ws = workspace({ skill: "other" });
  basicSeat(ws);
  const result = run(ws, ["close", "--topic", "alpha-topic"]);
  assert.equal(result.code, 0);
  const missing = path.join(ws.root, ".tanto", "alpha-topic", "shoroku-feedback.md");
  assert.equal(result.out.split("\n")[1], `feedback: shoki's part absent — ${missing}`);
  const sent = path.join(ws.root, ".tanto", "sent");
  const text = fs.readFileSync(path.join(sent, fs.readdirSync(sent)[0]), "utf8");
  assert.equal(section(text, "Items"), "none");
  assert.equal(section(text, "Departures"), "none");
});

test("close whose measurement fails still places the file, its Usage block measured false", () => {
  const ws = workspace({ skill: "other" });
  writeShokiPart(ws);
  const result = run(ws, ["close", "--topic", "alpha-topic"]);
  assert.equal(result.code, 0);
  assert.equal(result.out.split("\n")[0], "usage: unavailable — no seat of the topic in the spawner's files");
  assert.equal(fs.existsSync(path.join(ws.root, ".tanto", "alpha-topic", "usage.json")), false);
  const sent = path.join(ws.root, ".tanto", "sent");
  const text = fs.readFileSync(path.join(sent, fs.readdirSync(sent)[0]), "utf8");
  assert.deepEqual(JSON.parse(usageBlockOf(text)), {
    measured: false,
    reason: "no seat of the topic in the spawner's files",
  });
});

test("close --keep-usage measures nothing and takes the file's Usage block as it stands", () => {
  const ws = workspace({ skill: "other" });
  const block = '{\n  "measured": false,\n  "reason": "the transcripts were swept",\n  "kept": 12\n}';
  writeShokiPart(
    ws,
    SHOKI_PART.replace("<one fenced json block: the usage extract of 4.6>", `\`\`\`json\n${block}\n\`\`\``),
  );
  const result = run(ws, ["close", "--topic", "alpha-topic", "--keep-usage"]);
  assert.equal(result.code, 0);
  assert.equal(result.out.split("\n")[0], "usage: kept — the file's own Usage block");
  assert.equal(fs.existsSync(path.join(ws.root, ".tanto", "alpha-topic", "usage.json")), false);
  const sent = path.join(ws.root, ".tanto", "sent");
  assert.equal(usageBlockOf(fs.readFileSync(path.join(sent, fs.readdirSync(sent)[0]), "utf8")), block);
});

test("a thrown I/O error exits 2 with one stderr line, not the hold's code 1 with a stack", () => {
  const ws = workspace({ skill: "other" });
  writeShokiPart(ws);
  // `.tanto/sent` is a file, so the placement cannot make its directory.
  fs.writeFileSync(path.join(ws.root, ".tanto", "sent"), "not a directory\n", "utf8");
  const result = run(ws, ["close", "--topic", "alpha-topic", "--keep-usage"]);
  assert.equal(result.code, 2, result.err);
  assert.match(result.err, /^usage\.js: [^\n]+\n$/);
  assert.doesNotMatch(result.out, /^feedback:/m);
});

// ---------------------------------------------------------------------------
// collect

function feedbackCopy(dir, name, usageBody) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, name),
    [
      `# Shoroku feedback — abc1234 ${name.slice(0, 10)}`,
      "",
      "## Items",
      "",
      "none",
      "",
      "## Departures",
      "",
      "none",
      "",
      "## Usage",
      "",
      usageBody,
      "",
      "## Received",
      "",
      "- intake, 2026-10-06",
      "",
    ].join("\n"),
    "utf8",
  );
}

test("collect appends a row once, creates the file, and skips other copies and unmeasured blocks", () => {
  const base = tmpDir();
  const inbox = path.join(base, "inbox");
  const into = path.join(base, "docs", "notes", "tanto-usage.jsonl");
  const extract = { schema: 1, workspace: "abc1234", closed: "2026-10-01", measured: true, seats: [] };
  feedbackCopy(inbox, "2026-10-01-feedback-abc1234.md", `\`\`\`json\n${JSON.stringify(extract, null, 2)}\n\`\`\``);
  feedbackCopy(inbox, "2026-10-02-feedback-abc1234.md", "none");
  feedbackCopy(inbox, "2026-10-03-feedback-abc1234.md", '```json\n{ "measured": false, "reason": "gone" }\n```');
  fs.writeFileSync(path.join(inbox, "2026-10-04-a-bug.md"), "# Bug report — a bug\n", "utf8");
  fs.writeFileSync(path.join(inbox, "2026-10-05-consult-ask-01.md"), "# Consult — ask 01 — q\n", "utf8");
  const collect = () =>
    spawnSync(process.execPath, [SCRIPT, "collect", "--into", into, "--inbox", inbox], { encoding: "utf8" });

  let result = collect();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), "collected: 1 rows, 0 already present");
  const rows = fs.readFileSync(into, "utf8").trim().split("\n");
  assert.equal(rows.length, 1);
  assert.deepEqual(JSON.parse(rows[0]), { source: "2026-10-01-feedback-abc1234", ...extract });

  result = collect();
  assert.equal(result.stdout.trim(), "collected: 0 rows, 1 already present");
  assert.equal(fs.readFileSync(into, "utf8").trim().split("\n").length, 1);

  feedbackCopy(inbox, "2026-10-06-feedback-def5678.md", `\`\`\`json\n${JSON.stringify(extract)}\n\`\`\``);
  result = collect();
  assert.equal(result.stdout.trim(), "collected: 1 rows, 1 already present");
  assert.equal(fs.readFileSync(into, "utf8").trim().split("\n").length, 2);
});

// ---------------------------------------------------------------------------
// between

test("between sums the responses stamped inside the interval, subagents included", () => {
  const ws = workspace();
  addSeat(ws, {
    slug: "one",
    role: "jisso",
    records: [
      ...response(-120, { usage: { output_tokens: 1000 } }),
      ...response(60, { usage: { input_tokens: 1000, output_tokens: 100 } }),
    ],
    subagents: [
      {
        id: "s",
        agentType: "tanto-task-implement",
        toolUseId: "tu",
        records: [...response(90, { model: "model-q", usage: { output_tokens: 5 } })],
      },
    ],
  });
  addSeat(ws, { slug: "two", role: "kikaku", records: [...response(300, { usage: { output_tokens: 1000 } })] });
  const result = run(ws, ["between", at(0), at(120)]);
  assert.equal(result.code, 0, result.err);
  assert.deepEqual(result.out.trim().split("\n"), [
    `between ${at(0)} ${at(120)} — 2 responses in 2 transcripts`,
    "model-a: input 1000, cache_write_5m 0, cache_write_1h 0, cache_read 0, output 100 — 2.00 USD",
    "model-q: input 0, cache_write_5m 0, cache_write_1h 0, cache_read 0, output 5 — unpriced",
    "total 2.00 USD (rates 2026-01-01)",
  ]);
  assert.equal(run(ws, ["between", at(120), at(0)]).code, 2);
});

// ---------------------------------------------------------------------------
// report

function usageFixture(ws, topic, { measuredAt, input, output, activeHours, dispatchInput, wallMs }) {
  const counts = (i, o) => ({ responses: 1, input: i, cache_write_5m: 0, cache_write_1h: 0, cache_read: 0, output: o });
  const file = path.join(ws.root, ".tanto", topic, "usage.json");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const u = {
    schema: 1,
    topic,
    stage: "final",
    measured_at: measuredAt,
    window: { from: "2026-10-01T00:00:00.000Z", to: measuredAt },
    active_hours: activeHours,
    seats: [
      {
        session: `s-${topic}`,
        role: "jisso",
        windowed: false,
        effort: "high",
        models: { "model-a": counts(input, output) },
        wakeups: { human: 1, peer: 2, task: 0, other: 0, cold: 0, warm: 1 },
        context: { first: 10, last: 20, max: 30 },
        compactions: 0,
        first: "2026-10-01T00:00:00.000Z",
        last: "2026-10-01T01:30:00.000Z",
      },
    ],
    dispatches: [
      {
        session: `s-${topic}`,
        agent: "a1",
        kind: "task.implement",
        models: { "model-a": counts(dispatchInput, dispatchInput / 10) },
        tool_uses: 4,
        wall_ms: wallMs,
        resumes: 1,
      },
    ],
    quality: {
      batches: [
        {
          key: "A",
          tasks: 4,
          state: "accepted",
          implement: 4,
          implement_resumes: 2,
          review_spec: 4,
          review_quality: 4,
          escalate: 0,
        },
      ],
      rework_batches: 0,
      fix_wave_tasks: null,
      kaiseki: 0,
    },
    share: { threshold: 100, over: 1, total: 2, pct: 50 },
    totals: {
      by_model: { "model-a": { ...counts(input, output), amount: 0 } },
      amount: 0,
      unit: "USD",
      unpriced: [],
      rates_as_of: "2026-01-01",
    },
    skipped: [],
  };
  fs.writeFileSync(file, JSON.stringify(u), "utf8");
}

function reportWorkspace() {
  const ws = workspace();
  usageFixture(ws, "t-one", {
    measuredAt: "2026-10-02T00:00:00.000Z",
    input: 1000,
    output: 100,
    activeHours: 2,
    dispatchInput: 100,
    wallMs: 120000,
  });
  usageFixture(ws, "t-two", {
    measuredAt: "2026-10-03T00:00:00.000Z",
    input: 2000,
    output: 200,
    activeHours: 1,
    dispatchInput: 300,
    wallMs: 360000,
  });
  fs.mkdirSync(path.join(ws.root, ".claude"), { recursive: true });
  fs.writeFileSync(
    path.join(ws.root, ".claude", "tanto.json"),
    JSON.stringify({ plans: [{ name: "pro", window: "5h", budget: 100, as_of: "2026-02-01" }] }),
    "utf8",
  );
  return ws;
}

test("report prints the per-topic, per-kind, and quality tables, and the plan line", () => {
  const ws = reportWorkspace();
  const result = run(ws, ["report"]);
  assert.equal(result.code, 0, result.err);
  const lines = result.out.split("\n");
  assert.ok(lines.includes("| Topic | Stage | Active h | Model | Tokens | Amount |"));
  assert.ok(lines.includes("| t-one | final | 2 | model-a | 1100 | 2.00 |"));
  assert.ok(lines.includes("| t-two | final | 1 | model-a | 2200 | 4.00 |"));
  assert.ok(lines.includes("| Kind | Dispatches | Tokens | Amount | Mean wall min |"));
  assert.ok(lines.includes("| task.implement | 2 | 440 | 0.80 | 4 |"));
  assert.ok(lines.includes("| t-one | 4 | 1 | 0.5 | 1 | 1 | 0 | 0 | — | 0 |"));
  const tail = "an upper bound: the plan is shared with other products (rates 2026-01-01, budget 2026-02-01)";
  assert.ok(lines.includes(`plan pro (5h): about 25.0 h at t-two's pace — ${tail}`));
  assert.ok(lines.includes(`plan pro (5h): about 40.0 h at the mean pace of 2 topics — ${tail}`));
  assert.ok(!lines.includes("## Per workspace"));
});

test("report reads the tracked record and groups its rows by workspace id", () => {
  const ws = reportWorkspace();
  const notes = path.join(ws.root, "docs", "notes");
  fs.mkdirSync(notes, { recursive: true });
  const row = {
    source: "2026-09-01-feedback-abc1234",
    schema: 1,
    workspace: "abc1234",
    closed: "2026-09-01",
    measured: true,
    span_hours: 3,
    active_hours: 1.5,
    seats: [],
    dispatches: [],
    quality: { batches: [], rework_batches: 0, fix_wave_tasks: null, kaiseki: 0 },
    share: { threshold: 100, over: 0, total: 0, pct: 0 },
    totals: {
      by_model: {
        "model-b": {
          responses: 1,
          input: 500,
          cache_write_5m: 0,
          cache_write_1h: 0,
          cache_read: 0,
          output: 0,
          amount: 1,
        },
      },
      amount: 1,
      unit: "USD",
      unpriced: [],
      rates_as_of: "2026-01-01",
    },
  };
  fs.writeFileSync(path.join(notes, "tanto-usage.jsonl"), `${JSON.stringify(row)}\n`, "utf8");
  const result = run(ws, ["report"]);
  const lines = result.out.split("\n");
  assert.ok(lines.includes("| 2026-09-01-feedback-abc1234 | row | 1.5 | model-b | 500 | 1.00 |"));
  assert.ok(lines.includes("| Workspace | Closes | Active h | Tokens | Amount |"));
  assert.ok(lines.includes("| abc1234 | 1 | 1.5 | 500 | 1.00 |"));
});

test("report --json prints the same as one object", () => {
  const ws = reportWorkspace();
  const result = run(ws, ["report", "--json"]);
  const report = JSON.parse(result.out);
  assert.deepEqual(Object.keys(report), ["rates_as_of", "unit", "topics", "kinds", "quality", "plans", "workspaces"]);
  assert.equal(report.kinds[0].kind, "task.implement");
  assert.equal(report.plans.length, 2);
});

test("report --csv writes four flat tables, each with its header", () => {
  const ws = reportWorkspace();
  const dir = path.join(ws.base, "export");
  const result = run(ws, ["report", "--csv", dir]);
  assert.equal(result.code, 0, result.err);
  const read = (name) => fs.readFileSync(path.join(dir, name), "utf8").trim().split("\n");
  const closes = read("closes.csv");
  assert.equal(
    closes[0],
    "key,workspace,closed,stage,span_hours,active_hours,amount,unit,rates_as_of,share_pct,rework_batches,fix_wave_tasks,kaiseki",
  );
  assert.equal(closes.length, 3);
  assert.match(closes[1], /^t-one,[0-9a-f]{7},2026-10-0[12],final,24,2,0,USD,2026-01-01,50,0,,0$/);
  const seats = read("seats.csv");
  assert.equal(
    seats[0],
    "key,role,windowed,effort,model,responses,input,cache_write_5m,cache_write_1h,cache_read,output,human,peer,task,other,cold,warm,context_first,context_last,context_max,compactions,hours",
  );
  assert.equal(seats[1], "t-one,jisso,false,high,model-a,1,1000,0,0,0,100,1,2,0,0,0,1,10,20,30,0,1.5");
  const dispatches = read("dispatches.csv");
  assert.equal(
    dispatches[0],
    "key,role,kind,model,n,responses,input,cache_write_5m,cache_write_1h,cache_read,output,tool_uses,wall_ms,resumes",
  );
  assert.equal(dispatches[1], "t-one,jisso,task.implement,model-a,1,1,100,0,0,0,10,4,120000,1");
  const batches = read("batches.csv");
  assert.equal(batches[0], "key,batch,tasks,state,implement,implement_resumes,review_spec,review_quality,escalate");
  assert.equal(batches[1], "t-one,A,4,accepted,4,2,4,4,0");
});

// ---------------------------------------------------------------------------
// The command line

test("a missing form or a missing --topic is a usage error", () => {
  const ws = workspace();
  const bare = spawnSync(process.execPath, [SCRIPT], { encoding: "utf8" });
  assert.equal(bare.status, 2);
  assert.match(bare.stderr, /^Usage: usage\.js measure /);
  assert.equal(run(ws, ["measure"]).code, 2);
  assert.equal(run(ws, ["close"]).code, 2);
  assert.equal(run(ws, ["collect"]).code, 2);
  assert.equal(run(ws, ["measure", "--topic", "x"], { now: "not a time" }).code, 2);
});

test("the salt digest is SHA-256 over the salt, a newline, and the input", () => {
  const expected = crypto.createHash("sha256").update("s\nroot").digest("hex").slice(0, 7);
  assert.equal(usage.workspaceIdOf("s", "root"), expected);
  assert.equal(usage.slugOf("C:\\Users\\me\\devel\\repo"), "C--Users-me-devel-repo");
});
