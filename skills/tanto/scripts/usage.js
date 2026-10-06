// No shebang: this file is always invoked as `node <path>`, exactly as
// `reading.js` and `boundary.js` are. The runtime text spells the command
// `node "$TANTO/scripts/usage.js"`, and a reader who is setting `$TANTO`
// needs the interpreter named rather than implied.
//
// The measurement of a topic's usage, taken after the fact from the
// transcripts on disk: a response is counted once, keyed by the model id the
// transcript records, and priced by the dated `rates` table as a view. It
// also assembles, checks, and places the close's feedback file, collects the
// usage rows the skill's repository keeps, and names the workspace by a
// salted hash. It imports nothing from `reading.js`: the two are read by
// different passages, and neither binds the other.

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { parseArgs } = require("node:util");

// One line, so that a reader who runs the script bare and takes the first
// line of its output sees every form.
const USAGE =
  "Usage: usage.js measure --topic <topic> [--final] [--transcripts <path>...] | close --topic <topic> [--release] [--keep-usage] [--transcripts <path>...] | report [--json] [--csv <dir>] | between <from> <to> | collect --into <path> --inbox <dir> | id — each form also takes [--root <dir>] [--config <path>] [--project-config <path>] [--config-dir <dir>] [--skill-dir <dir>] [--now <ISO>]";

// The five token classes, in the order every table and line prints them.
const CLASSES = ["input", "cache_write_5m", "cache_write_1h", "cache_read", "output"];
const COUNT_KEYS = ["responses", ...CLASSES];

// The fifteen dispatch kinds, each the `tanto-<object>-<act>` agent type
// read back as `<object>.<act>`.
const KINDS = [
  "task.implement",
  "task.escalate",
  "task.review-spec",
  "task.review-quality",
  "plan.draft",
  "plan.review",
  "plan.coldread",
  "spec.review",
  "branch.review",
  "boundary.verify",
  "brief.write",
  "shoroku.recommend",
  "shoroku.apply",
  "shoroku.review",
  "default",
];

// The last-resort share threshold, when no layer sets `ceiling.share_threshold`.
const DEFAULT_SHARE_THRESHOLD = 150000;

// The harness's own opening phrase for a compaction, as `reading.js` reads it.
const COMPACTION_PHRASE = "This session is being continued from a previous conversation";

// The gap window, in minutes, inside which a wake-up's first response tells
// a cold cache from a warm one (`reading.js`'s rule).
const TTL_WINDOW_MIN = 5;
const TTL_WINDOW_MAX = 60;

// The model id the harness records on a record it writes itself.
const SYNTHETIC_MODEL = "<synthetic>";

// Five-minute slots; twelve active slots are an active hour (spec 5.3).
const SLOT_MS = 5 * 60 * 1000;

const PLAN_FIELDS = ["name", "window", "budget", "as_of"];
const RATE_SCALARS = ["as_of", "source", "unit"];

// A batch report's file name, `batch-<key>-report.md`, at the end of a path.
const REPORT_RE = /(?:^|[\\/])batch-(.+)-report\.md$/;

// The first line of a file decides what it is (spec 7.3).
const FEEDBACK_HEAD = "# Shoroku feedback";

// The Triage lines of a file not yet triaged, as the template leaves them.
const TRIAGE_OPEN = [
  "- Outcome — <feedback, once triaged>",
  "- Items — <n>: <issue | fix | redirect | kaiseki | relay | dismissed> — <reference>",
  "- Date — <YYYY-MM-DD>",
];

// ---------------------------------------------------------------------------
// Small helpers

/** JSON at `file`, or null when it is absent or does not parse. */
function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function exists(file) {
  try {
    fs.statSync(file);
    return true;
  } catch {
    return false;
  }
}

function listDir(dir) {
  try {
    return fs.readdirSync(dir).sort();
  } catch {
    return [];
  }
}

/** Every line of a file, with a trailing empty line dropped. */
function readLines(file) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

/** An error message flattened to one line. */
function oneLine(message) {
  return String(message).replace(/\s+/g, " ").trim();
}

function tokens(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function round(value, places) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

/** The local calendar date of an instant, `YYYY-MM-DD`. */
function localDate(ms) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** A record's `timestamp` in milliseconds, or null. */
function stampOf(record) {
  const t = Date.parse(record.timestamp);
  return Number.isFinite(t) ? t : null;
}

/**
 * A spawner `startedAt` in milliseconds. The spawner writes local time as
 * `YYYY-MM-DD HH:MM`; an ISO instant is taken as it stands.
 */
function startedAtOf(value) {
  if (typeof value !== "string") return null;
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]).getTime();
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : null;
}

function emptyCounts() {
  return { responses: 0, input: 0, cache_write_5m: 0, cache_write_1h: 0, cache_read: 0, output: 0 };
}

function addCounts(target, source) {
  for (const key of COUNT_KEYS) target[key] += tokens(source[key]);
}

function tokenSum(counts) {
  return CLASSES.reduce((sum, key) => sum + tokens(counts[key]), 0);
}

/** The harness's project slug for a directory: every other character a dash. */
function slugOf(dir) {
  return dir.replace(/[^A-Za-z0-9]/g, "-");
}

/** Two directories are the same when their real paths are, case aside on Windows. */
function sameDir(a, b) {
  const real = (p) => {
    try {
      return fs.realpathSync(p);
    } catch {
      return path.resolve(p);
    }
  };
  const x = real(a);
  const y = real(b);
  return process.platform === "win32" ? x.toLowerCase() === y.toLowerCase() : x === y;
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ---------------------------------------------------------------------------
// The config: `rates`, `plans`, and the share threshold, over three layers

/**
 * The three layers in order: the skill's built-in `templates/tanto.json`,
 * the personal file, the project file. The built-in file's own keys are
 * never reported as unknown.
 */
function configLayers(ctx) {
  const builtIn = path.join(ctx.skillDir, "templates", "tanto.json");
  return [
    { file: builtIn, data: readJson(builtIn), builtIn: true },
    { file: ctx.configFile, data: readJson(ctx.configFile), builtIn: false },
    { file: ctx.projectFile, data: readJson(ctx.projectFile), builtIn: false },
  ];
}

/**
 * The merged `rates` table. A later layer replaces a model's row whole and
 * sets `as_of`, `source`, or `unit` when it carries them; a field this
 * script does not know is ignored and reported through `warn`, in
 * `reading.js`'s form.
 */
function mergeRates(layers, warn) {
  const rates = { as_of: null, source: null, unit: null, per_mtok: {} };
  for (const layer of layers) {
    const source = layer.data?.rates;
    if (!source || typeof source !== "object" || Array.isArray(source)) continue;
    const unknown = layer.builtIn ? () => {} : (name) => warn(`unknown key rates.${name} in ${layer.file}, ignored`);
    for (const [key, value] of Object.entries(source)) {
      if (RATE_SCALARS.includes(key)) {
        rates[key] = value;
      } else if (key === "per_mtok" && value && typeof value === "object" && !Array.isArray(value)) {
        for (const [model, row] of Object.entries(value)) {
          if (!row || typeof row !== "object" || Array.isArray(row)) {
            unknown(`per_mtok.${model}`);
            continue;
          }
          const clean = {};
          for (const [field, rate] of Object.entries(row)) {
            if (CLASSES.includes(field)) clean[field] = tokens(rate);
            else unknown(`per_mtok.${model}.${field}`);
          }
          rates.per_mtok[model] = clean;
        }
      } else {
        unknown(key);
      }
    }
  }
  return rates;
}

/** The merged `plans` list: the last layer that sets the key replaces it. */
function mergePlans(layers, warn) {
  let plans = [];
  for (const layer of layers) {
    const source = layer.data?.plans;
    if (!Array.isArray(source)) continue;
    plans = [];
    for (const entry of source) {
      if (!entry || typeof entry !== "object") continue;
      const clean = {};
      for (const [field, value] of Object.entries(entry)) {
        if (PLAN_FIELDS.includes(field)) clean[field] = value;
        else if (!layer.builtIn) warn(`unknown key plans.${field} in ${layer.file}, ignored`);
      }
      plans.push(clean);
    }
  }
  return plans;
}

/** `ceiling.share_threshold` as the three layers leave it. */
function shareThresholdOf(layers) {
  let threshold = DEFAULT_SHARE_THRESHOLD;
  for (const layer of layers) {
    const value = layer.data?.ceiling?.share_threshold;
    if (typeof value === "number") threshold = value;
  }
  return threshold;
}

/** A model's row: the exact key, else the longest key that is a prefix of it. */
function rateRowOf(perMtok, model) {
  if (Object.hasOwn(perMtok, model)) return perMtok[model];
  let best = null;
  for (const key of Object.keys(perMtok)) {
    if (model.startsWith(key) && (best === null || key.length > best.length)) best = key;
  }
  return best === null ? null : perMtok[best];
}

/** Tokens times the class rates, per million; null for an unpriced model. */
function amountOf(counts, row) {
  if (!row) return null;
  let sum = 0;
  for (const key of CLASSES) sum += tokens(counts[key]) * tokens(row[key]);
  return sum / 1e6;
}

// ---------------------------------------------------------------------------
// Reading a transcript

/** The five classes of one `usage` object, as one response. */
function countsOf(usage) {
  const counts = emptyCounts();
  counts.responses = 1;
  counts.input = tokens(usage.input_tokens);
  counts.cache_read = tokens(usage.cache_read_input_tokens);
  counts.output = tokens(usage.output_tokens);
  const split = usage.cache_creation;
  if (split && typeof split === "object") {
    counts.cache_write_5m = tokens(split.ephemeral_5m_input_tokens);
    counts.cache_write_1h = tokens(split.ephemeral_1h_input_tokens);
  } else {
    counts.cache_write_5m = tokens(usage.cache_creation_input_tokens);
  }
  return counts;
}

/** A response's whole prompt: fresh input, cache creation, and cache reads. */
function contextOfUsage(usage) {
  return tokens(usage.input_tokens) + tokens(usage.cache_creation_input_tokens) + tokens(usage.cache_read_input_tokens);
}

/** A record of `type` `user` that carries no `tool_result` block. */
function isWakeUp(record) {
  if (record.type !== "user") return false;
  const content = record.message?.content;
  if (Array.isArray(content) && content.some((block) => block && block.type === "tool_result")) return false;
  return true;
}

function wakeUpText(record) {
  const content = record.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    const block = content.find((b) => b && typeof b.text === "string");
    if (block) return block.text;
  }
  return "";
}

function wakeUpSource(record) {
  const kind = record.origin?.kind;
  if (kind === "human") return "human";
  if (kind === "peer") return "peer";
  if (kind === "task-notification") return "task";
  return "other";
}

/**
 * The batch key a `tool_use` block names: a `Write` whose `file_path` ends
 * `batch-<key>-report.md`, or a `SendMessage` whose message opens with such
 * a path -- the boundary line a Jisso sends Kanri.
 */
function batchMarkerOf(block) {
  const input = block.input || {};
  if (block.name === "Write" && typeof input.file_path === "string") {
    const m = input.file_path.match(REPORT_RE);
    if (m) return m[1];
  }
  if (block.name === "SendMessage" && typeof input.message === "string") {
    const first = input.message.trim().split(/\s+/)[0] || "";
    const m = first.match(REPORT_RE);
    if (m) return m[1];
  }
  return null;
}

/**
 * Everything the measurement reads from one transcript's lines. With
 * `window` ({ from, to }, milliseconds, both inclusive), a record counts only
 * when it is stamped inside it.
 */
function summarizeTranscript(lines, window = null) {
  const inWindow = (t) => window === null || (t !== null && t >= window.from && t <= window.to);
  const responses = new Map();
  const summary = {
    responses: [],
    effort: "unknown",
    wakeups: { human: 0, peer: 0, task: 0, other: 0, cold: 0, warm: 0 },
    compactions: 0,
    firstStamp: null,
    lastStamp: null,
    toolUses: 0,
    agentUses: new Map(),
    markers: [],
    resumes: new Map(),
  };
  const toolUseIds = new Set();
  let lastStamp = null;
  let pendingTtl = false;

  lines.forEach((line, index) => {
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      return;
    }
    if (!record || typeof record !== "object") return;
    const t = stampOf(record);
    if (!inWindow(t)) return;
    if (t !== null) {
      if (summary.firstStamp === null || t < summary.firstStamp) summary.firstStamp = t;
      if (summary.lastStamp === null || t > summary.lastStamp) summary.lastStamp = t;
    }

    if (record.type === "user") {
      const result = record.toolUseResult;
      if (result && typeof result === "object" && typeof result.resumedAgentId === "string") {
        summary.resumes.set(result.resumedAgentId, (summary.resumes.get(result.resumedAgentId) || 0) + 1);
      }
      if (!isWakeUp(record)) return;
      summary.wakeups[wakeUpSource(record)]++;
      if (wakeUpText(record).startsWith(COMPACTION_PHRASE)) summary.compactions++;
      if (t !== null) {
        const gap = lastStamp === null ? null : (t - lastStamp) / 60000;
        pendingTtl = gap !== null && gap >= TTL_WINDOW_MIN && gap <= TTL_WINDOW_MAX;
        lastStamp = t;
      }
      return;
    }
    if (record.type !== "assistant") return;

    if (typeof record.perTurnEffort === "string") summary.effort = record.perTurnEffort;
    else if (typeof record.effort === "string") summary.effort = record.effort;
    if (t !== null) lastStamp = t;

    const message = record.message || {};
    const usage = message.usage;
    // The harness's own placeholder records carry no API call, and are no
    // response: their model is the literal `<synthetic>`.
    if (usage && typeof usage === "object" && message.model !== SYNTHETIC_MODEL) {
      if (pendingTtl) {
        const fresh = tokens(usage.input_tokens) + tokens(usage.cache_creation_input_tokens);
        if (fresh > tokens(usage.cache_read_input_tokens)) summary.wakeups.cold++;
        else summary.wakeups.warm++;
        pendingTtl = false;
      }
      const key = typeof message.id === "string" ? message.id : `#${index}`;
      if (!responses.has(key)) {
        responses.set(key, {
          model: typeof message.model === "string" ? message.model : "unknown",
          counts: countsOf(usage),
          context: contextOfUsage(usage),
          stamp: t,
        });
      }
    }
    for (const block of Array.isArray(message.content) ? message.content : []) {
      if (!block || block.type !== "tool_use") continue;
      const id = typeof block.id === "string" ? block.id : null;
      if (id !== null) {
        if (toolUseIds.has(id)) continue;
        toolUseIds.add(id);
      }
      summary.toolUses++;
      if ((block.name === "Agent" || block.name === "Task") && id !== null) summary.agentUses.set(id, t);
      const key = batchMarkerOf(block);
      if (key !== null) summary.markers.push({ stamp: t, key });
    }
  });

  summary.responses = [...responses.values()];
  return summary;
}

/** The five classes per model id, from a summary's responses. */
function modelsOf(summary) {
  const models = {};
  for (const response of summary.responses) {
    if (!models[response.model]) models[response.model] = emptyCounts();
    addCounts(models[response.model], response.counts);
  }
  return models;
}

/** `tanto-<object>-<act>` read back as `<object>.<act>`, else the type as it stands. */
function kindOf(agentType) {
  if (typeof agentType !== "string" || agentType === "") return "unknown";
  for (const kind of KINDS) {
    if (agentType === `tanto-${kind.replace(".", "-")}`) return kind;
  }
  return agentType;
}

// ---------------------------------------------------------------------------
// The spawner's files, and finding a transcript

/**
 * Every seat the spawner's files name, by `sessionId`: the results under
 * `.tanto/spawner/results/` and every `.tanto/<topic>/spawner-results/`,
 * then `.tanto/spawner/seats.json`. The first non-empty value of a field
 * wins; `aliases` keeps every name, short id, and `renamed` value any of
 * them gave the seat, since a resume and a rename each give another.
 */
function readSpawner(root) {
  const seats = new Map();
  const merge = (entry) => {
    if (!entry || typeof entry !== "object" || typeof entry.sessionId !== "string") return;
    const seat = seats.get(entry.sessionId) || { sessionId: entry.sessionId, aliases: new Set() };
    for (const key of ["role", "topic", "name", "id", "transcript", "startedAt"]) {
      if (seat[key] === undefined && typeof entry[key] === "string" && entry[key] !== "") seat[key] = entry[key];
    }
    for (const key of ["name", "id", "renamed"]) {
      if (typeof entry[key] === "string" && entry[key] !== "") seat.aliases.add(entry[key]);
    }
    seats.set(entry.sessionId, seat);
  };
  const tanto = path.join(root, ".tanto");
  const dirs = [path.join(tanto, "spawner", "results")];
  for (const name of listDir(tanto)) dirs.push(path.join(tanto, name, "spawner-results"));
  for (const dir of dirs) {
    for (const name of listDir(dir)) {
      if (name.endsWith(".json")) merge(readJson(path.join(dir, name)));
    }
  }
  const census = readJson(path.join(tanto, "spawner", "seats.json"));
  if (census && Array.isArray(census.seats)) for (const entry of census.seats) merge(entry);
  return seats;
}

/** A seat's transcript: the result's path, else `<sessionId>.jsonl` under any project slug. */
function findTranscript(ctx, seat) {
  if (seat.transcript && exists(seat.transcript)) return seat.transcript;
  const projects = path.join(ctx.configDir, "projects");
  for (const slug of listDir(projects)) {
    const candidate = path.join(projects, slug, `${seat.sessionId}.jsonl`);
    if (exists(candidate)) return candidate;
  }
  return null;
}

/** A transcript's dispatches: `<transcript without .jsonl>/subagents/agent-<id>.jsonl`. */
function readDispatches(file, window) {
  const dir = path.join(file.replace(/\.jsonl$/, ""), "subagents");
  const dispatches = [];
  for (const name of listDir(dir)) {
    const m = name.match(/^agent-(.+)\.jsonl$/);
    if (!m) continue;
    let lines;
    try {
      lines = readLines(path.join(dir, name));
    } catch {
      continue;
    }
    const summary = summarizeTranscript(lines, window);
    if (window !== null && summary.responses.length === 0) continue;
    const meta = readJson(path.join(dir, `agent-${m[1]}.meta.json`)) || {};
    dispatches.push({ agent: m[1], kind: kindOf(meta.agentType), toolUseId: meta.toolUseId, summary });
  }
  return dispatches;
}

// ---------------------------------------------------------------------------
// The quality counters

/**
 * A Tasks cell's task count: `1-4` is four, `F1-F7` seven, a comma list the
 * sum of its parts (a part one number or one range), anything else null.
 */
function parseTasksCell(cell) {
  if (typeof cell !== "string" || cell.trim() === "") return null;
  let sum = 0;
  for (const raw of cell.split(",")) {
    const part = raw.trim();
    let m = part.match(/^([A-Za-z]*)(\d+)$/);
    if (m) {
      sum += 1;
      continue;
    }
    m = part.match(/^([A-Za-z]*)(\d+)\s*[-–]\s*([A-Za-z]*)(\d+)$/);
    if (m && m[1] === m[3] && Number(m[4]) >= Number(m[2])) {
      sum += Number(m[4]) - Number(m[2]) + 1;
      continue;
    }
    return null;
  }
  return sum;
}

/** The Batches table of a ledger: one { batch, tasks, state } per row. */
function readBatchesTable(file) {
  let lines;
  try {
    lines = readLines(file).map((line) => line.replace(/\r$/, ""));
  } catch {
    return [];
  }
  const start = lines.findIndex((line) => line.trim() === "## Batches");
  if (start === -1) return [];
  const cells = (line) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());
  const rows = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) break;
    if (!/^\|\s*Batch\s*\|/.test(lines[i])) continue;
    const header = cells(lines[i]);
    const col = (name) => header.indexOf(name);
    for (let j = i + 1; j < lines.length && lines[j].trim().startsWith("|"); j++) {
      const row = cells(lines[j]);
      if (row.every((cell) => /^:?-+:?$/.test(cell))) continue;
      rows.push({ batch: row[col("Batch")] ?? "", tasks: row[col("Tasks")] ?? "", state: row[col("State")] ?? "" });
    }
    break;
  }
  return rows;
}

/** The batch a dispatch belongs to: the first marker at or after it, else the last. */
function batchOfDispatch(markers, at) {
  if (markers.length === 0) return "unknown";
  if (at !== null) {
    const next = markers.find((marker) => marker.stamp !== null && marker.stamp >= at);
    if (next) return next.key;
  }
  return markers[markers.length - 1].key;
}

function qualityOf(root, topic, seats) {
  const table = readBatchesTable(path.join(root, ".tanto", topic, "kanri.md"));
  const batches = new Map();
  const ensure = (key) => {
    if (!batches.has(key)) {
      batches.set(key, {
        key,
        implement: 0,
        implement_resumes: 0,
        review_spec: 0,
        review_quality: 0,
        escalate: 0,
      });
    }
    return batches.get(key);
  };
  for (const seat of seats) {
    if (seat.role !== "jisso") continue;
    const markers = [...seat.summary.markers].sort((a, b) => (a.stamp ?? 0) - (b.stamp ?? 0));
    if (markers.length === 0) ensure("unknown");
    for (const marker of markers) ensure(marker.key);
    for (const dispatch of seat.dispatches) {
      const at = seat.summary.agentUses.get(dispatch.toolUseId) ?? dispatch.summary.firstStamp;
      const batch = ensure(batchOfDispatch(markers, at));
      if (dispatch.kind === "task.implement") {
        batch.implement++;
        batch.implement_resumes += seat.summary.resumes.get(dispatch.agent) || 0;
      } else if (dispatch.kind === "task.review-spec") batch.review_spec++;
      else if (dispatch.kind === "task.review-quality") batch.review_quality++;
      else if (dispatch.kind === "task.escalate") batch.escalate++;
    }
  }
  const squash = (text) => text.replace(/\s+/g, "");
  const out = [];
  for (const counters of batches.values()) {
    const row = table.find((r) => squash(r.batch) === squash(counters.key));
    out.push({
      key: row ? row.batch : counters.key,
      tasks: row ? parseTasksCell(row.tasks) : null,
      state: row ? row.state : null,
      implement: counters.implement,
      implement_resumes: counters.implement_resumes,
      review_spec: counters.review_spec,
      review_quality: counters.review_quality,
      escalate: counters.escalate,
    });
  }
  const fixWave = table.find((r) => r.batch === "fix wave");
  return {
    batches: out,
    rework_batches: table.filter((r) => r.batch.includes("rework-")).length,
    fix_wave_tasks: fixWave ? parseTasksCell(fixWave.tasks) : null,
    kaiseki: listDir(path.join(root, ".tanto", topic)).filter((name) => /^kaiseki-\d+-brief\.md$/.test(name)).length,
  };
}

// ---------------------------------------------------------------------------
// The measurement

function seatEntryOf(seat) {
  const { summary } = seat;
  const contexts = summary.responses.map((r) => r.context);
  const stamps = summary.responses.map((r) => r.stamp).filter((t) => t !== null);
  const iso = (t) => (t === null || t === undefined ? null : new Date(t).toISOString());
  return {
    session: seat.sessionId,
    role: seat.role,
    windowed: seat.windowed,
    effort: summary.effort,
    models: modelsOf(summary),
    wakeups: { ...summary.wakeups },
    context: {
      first: contexts.length ? contexts[0] : 0,
      last: contexts.length ? contexts[contexts.length - 1] : 0,
      max: contexts.reduce((max, c) => (c > max ? c : max), 0),
    },
    compactions: summary.compactions,
    first: stamps.length ? iso(stamps.reduce((a, b) => Math.min(a, b))) : null,
    last: stamps.length ? iso(stamps.reduce((a, b) => Math.max(a, b))) : null,
  };
}

function totalsOf(groups, rates) {
  const byModel = {};
  for (const models of groups) {
    for (const [model, counts] of Object.entries(models)) {
      if (!byModel[model]) byModel[model] = emptyCounts();
      addCounts(byModel[model], counts);
    }
  }
  let amount = 0;
  const unpriced = [];
  for (const model of Object.keys(byModel).sort()) {
    const value = amountOf(byModel[model], rateRowOf(rates.per_mtok, model));
    byModel[model].amount = value === null ? null : round(value, 4);
    if (value === null) unpriced.push(model);
    else amount += value;
  }
  return {
    by_model: byModel,
    amount: round(amount, 4),
    unit: rates.unit,
    unpriced,
    rates_as_of: rates.as_of,
  };
}

/**
 * Measure one topic. Returns { usage } or { error }, the error a fixed
 * phrase that names neither the topic nor a path, since it may travel.
 */
function measureTopic(ctx, topic, options) {
  const { transcripts, stage, rates, threshold } = options;
  const spawner = readSpawner(ctx.root);
  const now = ctx.now.getTime();
  const skipped = [];
  const seats = [];
  const readSeat = (entry, role, windowed, window) => {
    const file = entry.file || findTranscript(ctx, entry);
    if (!file) {
      skipped.push({ session: entry.sessionId, reason: "transcript not found" });
      return;
    }
    let lines;
    try {
      lines = readLines(file);
    } catch (err) {
      skipped.push({ session: entry.sessionId, reason: `unreadable: ${err.code || oneLine(err.message)}` });
      return;
    }
    const summary = summarizeTranscript(lines, window);
    if (windowed && summary.responses.length === 0) return;
    seats.push({ sessionId: entry.sessionId, role, windowed, file, summary, window });
  };

  if (transcripts) {
    for (const file of transcripts) {
      const sessionId = path.basename(file).replace(/\.jsonl$/, "");
      readSeat({ sessionId, file: exists(file) ? file : null }, spawner.get(sessionId)?.role || "unknown", false, null);
    }
    if (seats.length === 0) return { error: "no transcript given could be read" };
  } else {
    const own = [...spawner.values()].filter((seat) => seat.topic === topic);
    if (own.length === 0) return { error: "no seat of the topic in the spawner's files" };
    for (const entry of own) readSeat(entry, entry.role || "unknown", false, null);
    if (seats.length === 0) return { error: "no transcript of the topic's seats could be read" };
  }

  const starts = seats.map((seat) => seat.summary.firstStamp).filter((t) => t !== null);
  const from = starts.length ? starts.reduce((a, b) => Math.min(a, b)) : now;
  const window = { from, to: now };

  if (!transcripts) {
    for (const entry of spawner.values()) {
      if (entry.role !== "kanri" || entry.topic === topic) continue;
      const started = startedAtOf(entry.startedAt);
      if (started !== null && started > now) continue;
      const file = findTranscript(ctx, entry);
      if (!file) {
        if (started !== null && started >= from)
          skipped.push({ session: entry.sessionId, reason: "transcript not found" });
        continue;
      }
      let mtime = null;
      try {
        mtime = fs.statSync(file).mtimeMs;
      } catch {
        // read below, and named there when it fails
      }
      if (mtime !== null && mtime < from) continue;
      readSeat({ ...entry, file }, "kanri", true, window);
    }
  }

  for (const seat of seats) seat.dispatches = readDispatches(seat.file, seat.window);

  const slots = new Set();
  const mark = (stamp) => {
    if (stamp !== null && stamp >= from) slots.add(Math.floor((stamp - from) / SLOT_MS));
  };
  let shareTotal = 0;
  let shareOver = 0;
  for (const seat of seats) {
    for (const response of seat.summary.responses) {
      mark(response.stamp);
      shareTotal += response.context;
      if (response.context > threshold) shareOver += response.context;
    }
    for (const dispatch of seat.dispatches) for (const response of dispatch.summary.responses) mark(response.stamp);
  }

  const seatEntries = seats.map(seatEntryOf);
  const dispatchEntries = [];
  for (const seat of seats) {
    for (const dispatch of seat.dispatches) {
      const { summary } = dispatch;
      dispatchEntries.push({
        session: seat.sessionId,
        agent: dispatch.agent,
        kind: dispatch.kind,
        models: modelsOf(summary),
        tool_uses: summary.toolUses,
        wall_ms: summary.firstStamp === null ? 0 : summary.lastStamp - summary.firstStamp,
        resumes: seat.summary.resumes.get(dispatch.agent) || 0,
      });
    }
  }

  const usage = {
    schema: 1,
    topic,
    stage,
    measured_at: new Date(now).toISOString(),
    window: { from: new Date(from).toISOString(), to: new Date(now).toISOString() },
    active_hours: round(slots.size / 12, 2),
    seats: seatEntries,
    dispatches: dispatchEntries,
    quality: qualityOf(ctx.root, topic, seats),
    share: {
      threshold,
      over: shareOver,
      total: shareTotal,
      pct: shareTotal === 0 ? 0 : Math.round((shareOver / shareTotal) * 100),
    },
    totals: totalsOf([...seatEntries.map((s) => s.models), ...dispatchEntries.map((d) => d.models)], rates),
    skipped,
  };
  return { usage };
}

function money(value) {
  return value.toFixed(2);
}

/** The cost line of 5.4 (`as of the kessai`) or of the final measurement (`as of the close`). */
function costLine(usage) {
  const totals = usage.totals;
  const priced = [];
  const unpriced = [];
  for (const [model, counts] of Object.entries(totals.by_model)) {
    if (counts.amount === null) unpriced.push({ model, tokens: tokenSum(counts) });
    else priced.push({ model, amount: counts.amount });
  }
  priced.sort((a, b) => b.amount - a.amount || a.model.localeCompare(b.model));
  unpriced.sort((a, b) => b.tokens - a.tokens || a.model.localeCompare(b.model));
  const parts = [
    ...priced.map((p) => `${p.model} ${money(p.amount)}`),
    ...unpriced.map((u) => `${u.model} unpriced (${u.tokens} tokens)`),
  ];
  const when = usage.stage === "final" ? "the close" : "the kessai";
  const models = parts.length ? ` — ${parts.join("; ")}` : "";
  const unit = totals.unit ? ` ${totals.unit}` : "";
  return `cost: ${usage.topic} as of ${when}${models} — total ${money(totals.amount)}${unit} (rates ${totals.rates_as_of ?? "none"})`;
}

// ---------------------------------------------------------------------------
// The extract (4.6)

function hoursBetween(first, last) {
  const a = Date.parse(first);
  const b = Date.parse(last);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
  return round((b - a) / 3600000, 2);
}

/**
 * The usage extract: `usage.json` with no topic, no session, and no instant
 * -- a date and durations only. The dispatches are summed per dispatching
 * role, kind, and model id; a dispatch that answered under several model ids
 * is split by them, its tool uses, wall time, and resumes counted under the
 * first.
 */
function extractOf(usage, workspace, closed) {
  const roleOf = new Map(usage.seats.map((seat) => [seat.session, seat.role]));
  const seats = usage.seats.map((seat) => ({
    role: seat.role,
    windowed: seat.windowed,
    effort: seat.effort,
    models: seat.models,
    wakeups: seat.wakeups,
    context: seat.context,
    compactions: seat.compactions,
    hours: hoursBetween(seat.first, seat.last),
  }));
  const groups = new Map();
  for (const dispatch of usage.dispatches) {
    const role = roleOf.get(dispatch.session) || "unknown";
    let models = Object.keys(dispatch.models);
    if (models.length === 0) models = ["none"];
    models.forEach((model, i) => {
      const key = JSON.stringify([role, dispatch.kind, model]);
      if (!groups.has(key)) {
        groups.set(key, {
          role,
          kind: dispatch.kind,
          model,
          n: 0,
          counts: emptyCounts(),
          tool_uses: 0,
          wall_ms: 0,
          resumes: 0,
        });
      }
      const group = groups.get(key);
      group.n++;
      addCounts(group.counts, dispatch.models[model] || {});
      if (i === 0) {
        group.tool_uses += dispatch.tool_uses;
        group.wall_ms += dispatch.wall_ms;
        group.resumes += dispatch.resumes;
      }
    });
  }
  return {
    schema: 1,
    workspace,
    closed,
    measured: true,
    span_hours: hoursBetween(usage.window.from, usage.window.to),
    active_hours: usage.active_hours,
    seats,
    dispatches: [...groups.values()],
    quality: usage.quality,
    share: usage.share,
    totals: usage.totals,
  };
}

// ---------------------------------------------------------------------------
// The workspace id (section 6)

/** `<config dir>/tanto-salt`, written once when absent, owner-readable only. */
function saltOf(configDir) {
  const file = path.join(configDir, "tanto-salt");
  try {
    return fs.readFileSync(file, "utf8").trim();
  } catch {
    // written below
  }
  fs.mkdirSync(configDir, { recursive: true });
  try {
    fs.writeFileSync(file, `${crypto.randomBytes(32).toString("hex")}\n`, { mode: 0o600, flag: "wx" });
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
  return fs.readFileSync(file, "utf8").trim();
}

/** The smallest root commit of `HEAD`, or null outside git or with no commit. */
function rootCommitOf(root) {
  const result = spawnSync("git", ["-C", root, "rev-list", "--max-parents=0", "HEAD"], { encoding: "utf8" });
  if (result.status !== 0 || typeof result.stdout !== "string") return null;
  const commits = result.stdout.split(/\r?\n/).filter(Boolean).sort();
  return commits.length ? commits[0] : null;
}

function workspaceIdOf(salt, input) {
  return crypto.createHash("sha256").update(`${salt}\n${input}`).digest("hex").slice(0, 7);
}

function workspaceId(ctx) {
  return workspaceIdOf(saltOf(ctx.configDir), rootCommitOf(ctx.root) ?? slugOf(ctx.root));
}

/** The skill's repository: the nearest directory above the skill's real path that holds `.git`. */
function skillRepositoryOf(ctx) {
  let dir;
  try {
    dir = fs.realpathSync(ctx.skillDir);
  } catch {
    dir = path.resolve(ctx.skillDir);
  }
  for (;;) {
    if (exists(path.join(dir, ".git"))) {
      return { root: dir, own: sameDir(dir, ctx.root) };
    }
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

// ---------------------------------------------------------------------------
// The feedback file (2.1, 2.5 to 2.8)

/** A Markdown file's `## ` sections: name to body lines. */
function sectionsOf(text) {
  const sections = new Map();
  let current = null;
  for (const line of text.replace(/\r\n/g, "\n").split("\n")) {
    const m = line.match(/^## (.+?)\s*$/);
    if (m) {
      current = m[1];
      sections.set(current, []);
    } else if (current !== null) {
      sections.get(current).push(line);
    }
  }
  return sections;
}

// The one line each section carries in templates/shoroku-feedback.md before a
// hand fills it. A body that is exactly that line was never filled: it reads
// as none, so that a copied template does not travel with its placeholders.
const ITEMS_PLACEHOLDER = "<n>. <the line that travels> — Class: tanto-only | both";
const DEPARTURES_PLACEHOLDER =
  "<n>. <override | retyped | unsure-resolved | rejected-as-recommended> — recommended <type, and adopt or reject> — directed <type, and adopt or reject> — <the reason, paraphrased> — rule: <the rule it suggests, or none yet>";

/**
 * A section's body with its outer blank lines dropped, or `none` when empty
 * or when it is the section's placeholder line alone.
 */
function bodyOf(lines, placeholder) {
  const body = [...lines];
  while (body.length && body[0].trim() === "") body.shift();
  while (body.length && body[body.length - 1].trim() === "") body.pop();
  if (body.length === 1 && body[0].trim() === placeholder) return ["none"];
  return body.length ? body : ["none"];
}

/** The text of the first fenced block in a section, or null. */
function fencedBlockOf(lines) {
  const start = lines.findIndex((line) => /^```/.test(line));
  if (start === -1) return null;
  const end = lines.findIndex((line, i) => i > start && /^```\s*$/.test(line));
  if (end === -1) return null;
  return lines.slice(start + 1, end).join("\n");
}

function assembleFeedback({ id, date, items, departures, usageBlock, own }) {
  return [
    `# Shoroku feedback — ${id} ${date}`,
    "",
    `- Workspace — ${id}`,
    `- Closed — ${date}`,
    "",
    "## Items",
    "",
    ...items,
    "",
    "## Departures",
    "",
    ...departures,
    "",
    "## Usage",
    "",
    "```json",
    usageBlock,
    "```",
    "",
    "## Received",
    "",
    ...(own ? [`- this repository's own close, ${date}`, ""] : []),
    "## Triage",
    "",
    ...(own ? ["- Outcome — feedback", "- Items — none", `- Date — ${date}`] : TRIAGE_OPEN),
    "",
  ].join("\n");
}

/**
 * The strings that would name the workspace: `anywhere` over the whole file,
 * matched without regard to case, and `body` -- the root's basename and the
 * topic slug -- matched as whole words in the bodies of Items and
 * Departures only.
 */
function needlesOf(ctx, topic, spawner) {
  const anywhere = new Set();
  const forms = (p) => {
    const slash = p.replace(/\\/g, "/");
    const out = [p, slash, p.replace(/\//g, "\\")];
    const drive = slash.match(/^([A-Za-z]):\/(.*)$/);
    if (drive) out.push(`/${drive[1].toLowerCase()}/${drive[2]}`);
    // The form `JSON.stringify` writes: each backslash doubled.
    for (const form of out.filter((f) => f.includes("\\"))) out.push(form.replace(/\\/g, "\\\\"));
    return out;
  };
  for (const form of forms(ctx.root)) anywhere.add(form);
  for (const form of forms(os.homedir())) anywhere.add(form);
  anywhere.add(slugOf(ctx.root));
  for (const seat of spawner.values()) {
    anywhere.add(seat.sessionId);
    for (const alias of seat.aliases) anywhere.add(alias);
  }
  return {
    anywhere: [...anywhere].filter((needle) => needle.length >= 4),
    body: [path.basename(ctx.root), topic].filter(Boolean),
  };
}

/**
 * Every line of `text` that names the workspace, as { line, text }. A
 * needle matches whole -- no letter, digit, or underscore on either side --
 * so that an eight-digit short id is never found inside a token count.
 */
function heldLines(text, needles) {
  const lines = text.split("\n");
  const whole = (needle) => new RegExp(`(?<![A-Za-z0-9_])${escapeRegExp(needle)}(?![A-Za-z0-9_])`, "i");
  const anywhere = needles.anywhere.map(whole);
  const words = needles.body.map(whole);
  const held = [];
  let section = null;
  lines.forEach((line, i) => {
    const heading = line.match(/^## (.+?)\s*$/);
    if (heading) section = heading[1];
    let hit = anywhere.some((re) => re.test(line));
    if (!hit && section === "Usage" && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(line)) hit = true;
    if (!hit && !heading && (section === "Items" || section === "Departures")) {
      hit = words.some((re) => re.test(line));
    }
    if (hit) held.push({ line: i + 1, text: line });
  });
  return held;
}

function isFeedbackFile(file) {
  try {
    return fs.readFileSync(file, "utf8").startsWith(FEEDBACK_HEAD);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// The forms

function loadConfig(ctx) {
  const layers = configLayers(ctx);
  const warnings = [];
  const warn = (line) => warnings.push(line);
  const rates = mergeRates(layers, warn);
  const plans = mergePlans(layers, warn);
  for (const line of warnings) process.stderr.write(`${line}\n`);
  return { rates, plans, threshold: shareThresholdOf(layers) };
}

function transcriptsOf(values, positionals) {
  if (!values.transcripts) return null;
  return [...values.transcripts, ...positionals];
}

function usagePathOf(ctx, topic) {
  return path.join(ctx.root, ".tanto", topic, "usage.json");
}

function writeUsage(file, usage) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(usage, null, 2)}\n`, "utf8");
}

function cmdMeasure(ctx, values, positionals) {
  const config = loadConfig(ctx);
  const stage = values.final ? "final" : "kessai";
  const result = measureTopic(ctx, values.topic, {
    transcripts: transcriptsOf(values, positionals),
    stage,
    rates: config.rates,
    threshold: config.threshold,
  });
  if (result.error) {
    console.log(`cost: unavailable — ${result.error}`);
    return 0;
  }
  console.log(costLine(result.usage));
  const file = usagePathOf(ctx, values.topic);
  if (!values.final && readJson(file)?.stage === "final") {
    console.log("usage: final kept");
    return 0;
  }
  writeUsage(file, result.usage);
  return 0;
}

function cmdClose(ctx, values, positionals) {
  const topic = values.topic;
  const topicDir = path.join(ctx.root, ".tanto", topic);
  const shokiFile = path.join(topicDir, "shoroku-feedback.md");
  const placedFile = path.join(topicDir, "shoroku-feedback-placed.txt");
  const heldFile = path.join(topicDir, "shoroku-feedback-held.md");
  const id = workspaceId(ctx);
  const today = localDate(ctx.now.getTime());

  let shokiText = null;
  try {
    shokiText = fs.readFileSync(shokiFile, "utf8");
  } catch {
    // reported below
  }
  const sections = shokiText === null ? new Map() : sectionsOf(shokiText);

  let usageBlock;
  if (values["keep-usage"]) {
    const kept = sections.has("Usage") ? fencedBlockOf(sections.get("Usage")) : null;
    if (kept === null) {
      console.log("usage: unavailable — no Usage block to keep");
      usageBlock = JSON.stringify({ measured: false, reason: "no Usage block to keep" }, null, 2);
    } else {
      console.log("usage: kept — the file's own Usage block");
      usageBlock = kept;
    }
  } else {
    const config = loadConfig(ctx);
    const result = measureTopic(ctx, topic, {
      transcripts: transcriptsOf(values, positionals),
      stage: "final",
      rates: config.rates,
      threshold: config.threshold,
    });
    if (result.error) {
      console.log(`usage: unavailable — ${result.error}`);
      usageBlock = JSON.stringify({ measured: false, reason: result.error }, null, 2);
    } else {
      writeUsage(usagePathOf(ctx, topic), result.usage);
      console.log(`usage: .tanto/${topic}/usage.json — ${costLine(result.usage)}`);
      usageBlock = JSON.stringify(extractOf(result.usage, id, localDate(ctx.now.getTime())), null, 2);
    }
  }

  let items = ["none"];
  let departures = ["none"];
  if (shokiText === null || !sections.has("Items") || !sections.has("Departures")) {
    console.log(`feedback: shoki's part absent — ${shokiFile}`);
  } else {
    items = bodyOf(sections.get("Items"), ITEMS_PLACEHOLDER);
    departures = bodyOf(sections.get("Departures"), DEPARTURES_PLACEHOLDER);
  }

  const repository = skillRepositoryOf(ctx);
  const own = repository?.own === true;
  const destination = path.join(ctx.root, ".tanto", own ? "inbox" : "sent");

  // A run after the first reuses the file it placed, so that a second run
  // changes nothing but the measurement -- except a sent file whose basename
  // the receiving inbox already holds: the intake would copy a rewrite over
  // a copy the receiving close may have triaged, so that run takes a new stem.
  const inbox = repository === null ? null : path.join(repository.root, ".tanto", "inbox");
  const delivered = (name) => !own && inbox !== null && exists(path.join(inbox, name));
  let target = null;
  let previous = null;
  try {
    previous = fs.readFileSync(placedFile, "utf8").trim();
  } catch {
    // first placement
  }
  if (previous && path.dirname(previous) === destination && !delivered(path.basename(previous))) target = previous;
  let date = today;
  if (target) {
    date = path.basename(target).slice(0, 10);
  } else {
    const stem = `${today}-feedback-${id}`;
    target = path.join(destination, `${stem}.md`);
    for (let n = 2; exists(target); n++) target = path.join(destination, `${stem}-${n}.md`);
  }
  const text = assembleFeedback({ id, date, items, departures, usageBlock, own });

  // Place the file and record where, for a later run to reuse.
  const place = () => {
    fs.mkdirSync(destination, { recursive: true });
    fs.writeFileSync(target, text, "utf8");
    fs.mkdirSync(topicDir, { recursive: true });
    fs.writeFileSync(placedFile, `${target}\n`, "utf8");
  };

  if (own) {
    place();
    console.log(`feedback: own repository — ${target}`);
    return 0;
  }

  const spawner = readSpawner(ctx.root);
  if (!values.release) {
    const held = heldLines(text, needlesOf(ctx, topic, spawner));
    if (held.length > 0) {
      fs.mkdirSync(topicDir, { recursive: true });
      fs.writeFileSync(heldFile, text, "utf8");
      console.log(`feedback: held — ${held.length} lines name this workspace`);
      for (const hit of held) console.log(`  ${hit.line}: ${hit.text}`);
      return 1;
    }
  }

  place();
  try {
    fs.rmSync(heldFile, { force: true });
  } catch {
    // a stale held file is harmless
  }

  if (repository === null || !exists(path.join(repository.root, ".tanto"))) {
    const reason = repository === null ? "no skill repository on this machine" : "the skill repository has no .tanto/";
    console.log(`feedback: kept — ${reason} — ${target}`);
    return 0;
  }
  console.log(`feedback: ${target}`);
  console.log(`to: ${repository.root}`);
  if (!delivered(path.basename(target))) console.log(`send: shoroku-feedback: ${target}`);
  for (const name of listDir(destination)) {
    const file = path.join(destination, name);
    if (file === target || !name.endsWith(".md") || !isFeedbackFile(file)) continue;
    if (!delivered(name)) console.log(`send: shoroku-feedback: ${file}`);
  }
  return 0;
}

function cmdCollect(values) {
  const into = path.resolve(values.into);
  const present = new Set();
  let existing = "";
  try {
    existing = fs.readFileSync(into, "utf8");
  } catch {
    // created below
  }
  for (const line of existing.split("\n")) {
    if (line.trim() === "") continue;
    try {
      const row = JSON.parse(line);
      if (row && typeof row.source === "string") present.add(row.source);
    } catch {
      // a line that does not parse is kept and not read
    }
  }
  const rows = [];
  let already = 0;
  for (const name of listDir(values.inbox)) {
    const file = path.join(values.inbox, name);
    if (!name.endsWith(".md") || !isFeedbackFile(file)) continue;
    const source = name.replace(/\.md$/, "");
    if (present.has(source)) {
      already++;
      continue;
    }
    const usage = sectionsOf(fs.readFileSync(file, "utf8")).get("Usage");
    const block = usage ? fencedBlockOf(usage) : null;
    let extract = null;
    try {
      extract = block === null ? null : JSON.parse(block);
    } catch {
      extract = null;
    }
    if (!extract || typeof extract !== "object" || !Array.isArray(extract.seats)) continue;
    rows.push(JSON.stringify({ source, ...extract }));
    present.add(source);
  }
  if (rows.length > 0 || existing === "") {
    fs.mkdirSync(path.dirname(into), { recursive: true });
    const lead = existing !== "" && !existing.endsWith("\n") ? "\n" : "";
    fs.writeFileSync(into, `${existing}${lead}${rows.map((row) => `${row}\n`).join("")}`, "utf8");
  }
  console.log(`collected: ${rows.length} rows, ${already} already present`);
  return 0;
}

function cmdBetween(ctx, positionals) {
  const from = Date.parse(positionals[1]);
  const to = Date.parse(positionals[2]);
  if (positionals.length !== 3 || !Number.isFinite(from) || !Number.isFinite(to) || to < from) {
    process.stderr.write(`between needs two ISO instants, the earlier first\n${USAGE}\n`);
    return 2;
  }
  const { rates } = loadConfig(ctx);
  const window = { from, to };
  const byModel = {};
  let files = 0;
  const walk = (dir) => {
    for (const name of listDir(dir)) {
      const file = path.join(dir, name);
      let stat;
      try {
        stat = fs.statSync(file);
      } catch {
        continue;
      }
      if (stat.isDirectory()) {
        walk(file);
        continue;
      }
      if (!name.endsWith(".jsonl") || stat.mtimeMs < from) continue;
      let lines;
      try {
        lines = readLines(file);
      } catch {
        continue;
      }
      const summary = summarizeTranscript(lines, window);
      if (summary.responses.length === 0) continue;
      files++;
      for (const [model, counts] of Object.entries(modelsOf(summary))) {
        if (!byModel[model]) byModel[model] = emptyCounts();
        addCounts(byModel[model], counts);
      }
    }
  };
  walk(path.join(ctx.configDir, "projects"));
  const totals = totalsOf([byModel], rates);
  const unit = totals.unit ? ` ${totals.unit}` : "";
  const responses = Object.values(byModel).reduce((sum, c) => sum + c.responses, 0);
  console.log(
    `between ${new Date(from).toISOString()} ${new Date(to).toISOString()} — ${responses} responses in ${files} transcripts`,
  );
  for (const model of Object.keys(totals.by_model).sort()) {
    const counts = totals.by_model[model];
    const classes = CLASSES.map((key) => `${key} ${counts[key]}`).join(", ");
    const amount = counts.amount === null ? "unpriced" : `${money(counts.amount)}${unit}`;
    console.log(`${model}: ${classes} — ${amount}`);
  }
  console.log(`total ${money(totals.amount)}${unit} (rates ${totals.rates_as_of ?? "none"})`);
  return 0;
}

function cmdId(ctx) {
  console.log(`workspace: ${workspaceId(ctx)}`);
  const repository = skillRepositoryOf(ctx);
  console.log(`skill repository: ${repository === null ? "none" : repository.own ? "this one" : repository.root}`);
  return 0;
}

// ---------------------------------------------------------------------------
// report

/** Every close the workspace holds, as { key, stage, at, extract }. */
function closesOf(ctx) {
  const closes = [];
  const tanto = path.join(ctx.root, ".tanto");
  let id = null;
  for (const name of listDir(tanto)) {
    const usage = readJson(path.join(tanto, name, "usage.json"));
    if (!usage || !Array.isArray(usage.seats)) continue;
    if (id === null) id = workspaceId(ctx);
    const at = Date.parse(usage.measured_at);
    closes.push({
      key: usage.topic || name,
      stage: usage.stage || "unknown",
      at: Number.isFinite(at) ? at : 0,
      extract: extractOf(usage, id, Number.isFinite(at) ? localDate(at) : null),
    });
  }
  const record = path.join(ctx.root, "docs", "notes", "tanto-usage.jsonl");
  let raw = null;
  try {
    raw = fs.readFileSync(record, "utf8");
  } catch {
    // a workspace without the record
  }
  if (raw !== null) {
    for (const line of raw.split("\n")) {
      if (line.trim() === "") continue;
      try {
        const row = JSON.parse(line);
        if (row && Array.isArray(row.seats)) closes.push({ key: row.source, stage: "row", at: 0, extract: row });
      } catch {
        // a line that does not parse is skipped
      }
    }
  }
  return { closes, hasRecord: raw !== null };
}

function priceAt(rates, model, counts) {
  return amountOf(counts, rateRowOf(rates.per_mtok, model));
}

function amountOfExtract(rates, extract) {
  let sum = 0;
  for (const [model, counts] of Object.entries(extract.totals?.by_model || {})) {
    const value = priceAt(rates, model, counts);
    if (value !== null) sum += value;
  }
  return sum;
}

function buildReport(ctx, rates, plans) {
  const { closes, hasRecord } = closesOf(ctx);
  const topics = [];
  const kinds = new Map();
  const quality = [];
  for (const close of closes) {
    const { extract } = close;
    for (const [model, counts] of Object.entries(extract.totals?.by_model || {})) {
      const value = priceAt(rates, model, counts);
      topics.push({
        topic: close.key,
        stage: close.stage,
        active_hours: extract.active_hours,
        model,
        tokens: tokenSum(counts),
        amount: value === null ? null : round(value, 4),
      });
    }
    for (const group of extract.dispatches || []) {
      if (!kinds.has(group.kind))
        kinds.set(group.kind, { kind: group.kind, dispatches: 0, tokens: 0, amount: 0, wall_ms: 0 });
      const kind = kinds.get(group.kind);
      kind.dispatches += group.n;
      kind.tokens += tokenSum(group.counts);
      kind.amount += priceAt(rates, group.model, group.counts) ?? 0;
      kind.wall_ms += group.wall_ms;
    }
    const q = extract.quality || { batches: [] };
    const sum = (field) => (q.batches || []).reduce((s, b) => s + (b[field] || 0), 0);
    const tasks = (q.batches || []).reduce((s, b) => s + (typeof b.tasks === "number" ? b.tasks : 0), 0);
    const per = (n) => (tasks > 0 ? round(n / tasks, 2) : null);
    quality.push({
      topic: close.key,
      tasks,
      implement: per(sum("implement")),
      implement_resumes: per(sum("implement_resumes")),
      review_spec: per(sum("review_spec")),
      review_quality: per(sum("review_quality")),
      escalate: per(sum("escalate")),
      rework_batches: q.rework_batches ?? 0,
      fix_wave_tasks: q.fix_wave_tasks ?? null,
      kaiseki: q.kaiseki ?? 0,
    });
  }

  const finals = closes.filter((c) => c.stage === "final" && c.extract.active_hours > 0);
  const paceOf = (c) => amountOfExtract(rates, c.extract) / c.extract.active_hours;
  const planLines = [];
  if (finals.length > 0) {
    const newest = finals.reduce((a, b) => (b.at > a.at ? b : a));
    const mean = finals.reduce((s, c) => s + paceOf(c), 0) / finals.length;
    for (const plan of plans) {
      const budget = tokens(plan.budget);
      const tail = `an upper bound: the plan is shared with other products (rates ${rates.as_of ?? "none"}, budget ${plan.as_of ?? "none"})`;
      const hours = (pace) => (pace > 0 ? (budget / pace).toFixed(1) : "unbounded");
      planLines.push(
        `plan ${plan.name} (${plan.window}): about ${hours(paceOf(newest))} h at ${newest.key}'s pace — ${tail}`,
      );
      planLines.push(
        `plan ${plan.name} (${plan.window}): about ${hours(mean)} h at the mean pace of ${finals.length} topics — ${tail}`,
      );
    }
  }

  const workspaces = [];
  if (hasRecord) {
    const byWorkspace = new Map();
    for (const close of closes) {
      if (close.stage !== "row") continue;
      const id = close.extract.workspace || "unknown";
      if (!byWorkspace.has(id))
        byWorkspace.set(id, { workspace: id, closes: 0, active_hours: 0, tokens: 0, amount: 0 });
      const w = byWorkspace.get(id);
      w.closes++;
      w.active_hours = round(w.active_hours + tokens(close.extract.active_hours), 2);
      for (const counts of Object.values(close.extract.totals?.by_model || {})) w.tokens += tokenSum(counts);
      w.amount = round(w.amount + amountOfExtract(rates, close.extract), 4);
    }
    workspaces.push(...byWorkspace.values());
  }

  return {
    rates_as_of: rates.as_of,
    unit: rates.unit,
    topics,
    kinds: [...kinds.values()]
      .sort((a, b) => a.kind.localeCompare(b.kind))
      .map((k) => ({
        kind: k.kind,
        dispatches: k.dispatches,
        tokens: k.tokens,
        amount: round(k.amount, 4),
        mean_wall_min: k.dispatches ? round(k.wall_ms / k.dispatches / 60000, 1) : 0,
      })),
    quality,
    plans: planLines,
    workspaces,
    closes,
  };
}

function table(header, rows) {
  const line = (cells) => `| ${cells.map((c) => (c === null || c === undefined ? "—" : String(c))).join(" | ")} |`;
  return [line(header), line(header.map(() => "---")), ...rows.map(line)];
}

function csvCell(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(file, header, rows) {
  const lines = [header, ...rows].map((row) => row.map(csvCell).join(","));
  fs.writeFileSync(file, `${lines.join("\n")}\n`, "utf8");
}

const CSV_HEADERS = {
  closes: [
    "key",
    "workspace",
    "closed",
    "stage",
    "span_hours",
    "active_hours",
    "amount",
    "unit",
    "rates_as_of",
    "share_pct",
    "rework_batches",
    "fix_wave_tasks",
    "kaiseki",
  ],
  seats: [
    "key",
    "role",
    "windowed",
    "effort",
    "model",
    ...COUNT_KEYS,
    "human",
    "peer",
    "task",
    "other",
    "cold",
    "warm",
    "context_first",
    "context_last",
    "context_max",
    "compactions",
    "hours",
  ],
  dispatches: ["key", "role", "kind", "model", "n", ...COUNT_KEYS, "tool_uses", "wall_ms", "resumes"],
  batches: [
    "key",
    "batch",
    "tasks",
    "state",
    "implement",
    "implement_resumes",
    "review_spec",
    "review_quality",
    "escalate",
  ],
};

function writeCsvExport(dir, closes) {
  fs.mkdirSync(dir, { recursive: true });
  const closes_ = [];
  const seats = [];
  const dispatches = [];
  const batches = [];
  for (const { key, stage, extract } of closes) {
    const t = extract.totals || {};
    closes_.push([
      key,
      extract.workspace,
      extract.closed,
      stage,
      extract.span_hours,
      extract.active_hours,
      t.amount,
      t.unit,
      t.rates_as_of,
      extract.share?.pct,
      extract.quality?.rework_batches,
      extract.quality?.fix_wave_tasks,
      extract.quality?.kaiseki,
    ]);
    for (const seat of extract.seats || []) {
      for (const [model, counts] of Object.entries(seat.models || {})) {
        const w = seat.wakeups || {};
        const c = seat.context || {};
        seats.push([
          key,
          seat.role,
          seat.windowed,
          seat.effort,
          model,
          ...COUNT_KEYS.map((k) => counts[k]),
          w.human,
          w.peer,
          w.task,
          w.other,
          w.cold,
          w.warm,
          c.first,
          c.last,
          c.max,
          seat.compactions,
          seat.hours,
        ]);
      }
    }
    for (const group of extract.dispatches || []) {
      dispatches.push([
        key,
        group.role,
        group.kind,
        group.model,
        group.n,
        ...COUNT_KEYS.map((k) => group.counts?.[k]),
        group.tool_uses,
        group.wall_ms,
        group.resumes,
      ]);
    }
    for (const b of extract.quality?.batches || []) {
      batches.push([
        key,
        b.key,
        b.tasks,
        b.state,
        b.implement,
        b.implement_resumes,
        b.review_spec,
        b.review_quality,
        b.escalate,
      ]);
    }
  }
  writeCsv(path.join(dir, "closes.csv"), CSV_HEADERS.closes, closes_);
  writeCsv(path.join(dir, "seats.csv"), CSV_HEADERS.seats, seats);
  writeCsv(path.join(dir, "dispatches.csv"), CSV_HEADERS.dispatches, dispatches);
  writeCsv(path.join(dir, "batches.csv"), CSV_HEADERS.batches, batches);
}

function cmdReport(ctx, values) {
  const { rates, plans } = loadConfig(ctx);
  const report = buildReport(ctx, rates, plans);
  if (values.csv) {
    writeCsvExport(path.resolve(values.csv), report.closes);
    console.log(`csv: ${path.resolve(values.csv)} — closes.csv, seats.csv, dispatches.csv, batches.csv`);
    return 0;
  }
  const { closes, ...shown } = report;
  if (values.json) {
    console.log(JSON.stringify(shown, null, 2));
    return 0;
  }
  const amount = (value) => (value === null ? "unpriced" : money(value));
  const out = [];
  out.push("## Per topic", "");
  out.push(
    ...table(
      ["Topic", "Stage", "Active h", "Model", "Tokens", "Amount"],
      report.topics.map((r) => [r.topic, r.stage, r.active_hours, r.model, r.tokens, amount(r.amount)]),
    ),
  );
  out.push("", "## Per kind", "");
  out.push(
    ...table(
      ["Kind", "Dispatches", "Tokens", "Amount", "Mean wall min"],
      report.kinds.map((k) => [k.kind, k.dispatches, k.tokens, money(k.amount), k.mean_wall_min]),
    ),
  );
  out.push("", "## Quality per task", "");
  out.push(
    ...table(
      [
        "Topic",
        "Tasks",
        "Implement",
        "Implement resumes",
        "Review spec",
        "Review quality",
        "Escalate",
        "Rework batches",
        "Fix wave tasks",
        "Kaiseki",
      ],
      report.quality.map((q) => [
        q.topic,
        q.tasks,
        q.implement,
        q.implement_resumes,
        q.review_spec,
        q.review_quality,
        q.escalate,
        q.rework_batches,
        q.fix_wave_tasks,
        q.kaiseki,
      ]),
    ),
  );
  if (report.plans.length > 0) out.push("", "## Plans", "", ...report.plans);
  if (report.workspaces.length > 0) {
    out.push("", "## Per workspace", "");
    out.push(
      ...table(
        ["Workspace", "Closes", "Active h", "Tokens", "Amount"],
        report.workspaces.map((w) => [w.workspace, w.closes, w.active_hours, w.tokens, money(w.amount)]),
      ),
    );
  }
  out.push("", `Amounts in ${rates.unit ?? "no unit"} (rates ${rates.as_of ?? "none"}).`);
  console.log(out.join("\n"));
  return 0;
}

// ---------------------------------------------------------------------------
// Dispatch

const FORMS = ["measure", "close", "report", "between", "collect", "id"];

function contextOf(values) {
  const root = path.resolve(values.root || process.cwd());
  const configDir = path.resolve(
    values["config-dir"] || process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude"),
  );
  return {
    root,
    configDir,
    skillDir: path.resolve(values["skill-dir"] || path.join(__dirname, "..")),
    configFile: values.config || path.join(configDir, "tanto.json"),
    projectFile: values["project-config"] || path.join(root, ".claude", "tanto.json"),
    now: values.now ? new Date(values.now) : new Date(),
  };
}

/** Returns the process exit code. */
function main(argv) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        topic: { type: "string" },
        final: { type: "boolean" },
        transcripts: { type: "string", multiple: true },
        release: { type: "boolean" },
        "keep-usage": { type: "boolean" },
        json: { type: "boolean" },
        csv: { type: "string" },
        into: { type: "string" },
        inbox: { type: "string" },
        root: { type: "string" },
        config: { type: "string" },
        "project-config": { type: "string" },
        "config-dir": { type: "string" },
        "skill-dir": { type: "string" },
        now: { type: "string" },
      },
    });
  } catch (err) {
    process.stderr.write(`${err.message}\n${USAGE}\n`);
    return 2;
  }
  const { values, positionals } = parsed;
  const form = positionals[0];
  if (!FORMS.includes(form)) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  const ctx = contextOf(values);
  if (!Number.isFinite(ctx.now.getTime())) {
    process.stderr.write(`invalid --now '${values.now}'\n${USAGE}\n`);
    return 2;
  }
  const rest = positionals.slice(1);
  if ((form === "measure" || form === "close") && !values.topic) {
    process.stderr.write(`${form} needs --topic\n${USAGE}\n`);
    return 2;
  }
  if ((form === "measure" || form === "close") && rest.length > 0 && !values.transcripts) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  // An I/O failure is a usage-class error (2), never the hold's code (1).
  try {
    if (form === "measure") return cmdMeasure(ctx, values, rest);
    if (form === "close") return cmdClose(ctx, values, rest);
    if (form === "report") return cmdReport(ctx, values);
    if (form === "between") return cmdBetween(ctx, positionals);
    if (form === "collect") {
      if (!values.into || !values.inbox) {
        process.stderr.write(`collect needs --into and --inbox\n${USAGE}\n`);
        return 2;
      }
      return cmdCollect(values);
    }
    return cmdId(ctx);
  } catch (err) {
    process.stderr.write(`usage.js: ${oneLine(err.message)}\n`);
    return 2;
  }
}

module.exports = {
  CLASSES,
  KINDS,
  countsOf,
  summarizeTranscript,
  kindOf,
  parseTasksCell,
  readBatchesTable,
  rateRowOf,
  amountOf,
  mergeRates,
  mergePlans,
  extractOf,
  workspaceIdOf,
  slugOf,
  heldLines,
  needlesOf,
  costLine,
  main,
};

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}
