// No shebang: this file is always invoked as `node <path>`, exactly as
// `passage-check.js` is. The runtime text spells the command
// `node "$TANTO/scripts/reading.js"`, and a reader who is setting `$TANTO`
// needs the interpreter named rather than implied.

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { parseArgs } = require("node:util");

// One line, so that a reader who runs the script bare and takes the first
// line of its output sees both forms.
const USAGE =
  "Usage: reading.js <transcript> [--role kanri|jisso] [--presence] [--backstop] [--now <ISO>] [--config <path>] [--project-config <path>] [--settings <path>], or reading.js --share <transcript> [<transcript>...] [--config <path>] [--project-config <path>]";

// The documented auto-compact point for the 1M-window models
// (docs/notes/claude-code-sessions-observed.md, and
// code.claude.com/docs/en/model-config.md). The skill never sets it.
const DEFAULT_AUTO_COMPACT_WINDOW = 967000;

// The last-resort copy of `templates/tanto.json`'s `ceiling` map, used only
// when the shipped template cannot be read. The template is the built-in
// default; this keeps the instrument working when it is missing.
const BUILT_IN_CEILING = {
  kanri: { batches: 2, per_batch: 65000 },
  jisso: { batches: 2, per_batch: 65000 },
  presence_minutes: 60,
  share_threshold: 150000,
};

const CEILING_ROLES = ["kanri", "jisso"];
const ROLE_FIELDS = ["batches", "per_batch"];
const SCALAR_FIELDS = ["presence_minutes", "share_threshold"];

// The harness's own opening phrase for a compaction. It may change: a
// reworded one reads as `0`, and a compaction the session notices for itself
// is still the signal it always was.
const COMPACTION_PHRASE = "This session is being continued from a previous conversation";

/** JSON at `file`, or null when it is absent or does not parse. */
function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

/** The config directory the harness names, or `~/.claude`. */
function configDir() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
}

function configPathOf(explicit) {
  return explicit || path.join(configDir(), "tanto.json");
}

/**
 * The project file, at `<cwd>/.claude/tanto.json`. `CLAUDE_CONFIG_DIR`
 * relocates the home-directory files only, so this path is read relative to
 * the session's working directory whatever that variable says.
 */
function projectConfigPathOf(explicit) {
  return explicit || path.join(process.cwd(), ".claude", "tanto.json");
}

function settingsPathOf(explicit) {
  return explicit || path.join(configDir(), "settings.json");
}

/** A deep-enough copy of the ceiling map's two levels. */
function cloneCeiling(source) {
  return {
    kanri: { ...source.kanri },
    jisso: { ...source.jisso },
    presence_minutes: source.presence_minutes,
    share_threshold: source.share_threshold,
  };
}

/**
 * Overlay one `ceiling` map onto `target`, field by field, the way the two
 * maps that already exist are overlaid. A key that names no role and no
 * field is ignored and reported through `warn`.
 */
function overlayCeiling(target, source, warn) {
  if (!source || typeof source !== "object") return;
  for (const [key, value] of Object.entries(source)) {
    if (CEILING_ROLES.includes(key)) {
      if (!value || typeof value !== "object") {
        warn(key);
        continue;
      }
      for (const [field, fieldValue] of Object.entries(value)) {
        if (ROLE_FIELDS.includes(field)) {
          target[key][field] = fieldValue;
        } else {
          warn(`${key}.${field}`);
        }
      }
    } else if (SCALAR_FIELDS.includes(key)) {
      target[key] = value;
    } else {
      warn(key);
    }
  }
}

/**
 * The merged `ceiling` map: the built-in copy, then the shipped
 * `templates/tanto.json`, then the personal file, then the project file.
 * Returns { ceiling, warnings, paths } -- `paths` the personal and the
 * project file as each was resolved, and `warnings` the unknown keys of
 * both, each named with the file it came from, which the caller writes to
 * stderr. Nothing in this script prints either path.
 */
function loadCeiling(explicitConfig, explicitProjectConfig) {
  const ceiling = cloneCeiling(BUILT_IN_CEILING);
  const template = readJson(path.join(__dirname, "..", "templates", "tanto.json"));
  // The shipped template is the built-in default, so its own keys are never
  // reported as unknown: a template this script cannot read is a defect of
  // the skill, not of the human's file.
  overlayCeiling(ceiling, template?.ceiling, () => {});

  const warnings = [];
  const configFile = configPathOf(explicitConfig);
  const personal = readJson(configFile);
  overlayCeiling(ceiling, personal?.ceiling, (name) => {
    warnings.push(`unknown key ceiling.${name} in ${configFile}, ignored`);
  });

  // The project layer wins. A file that is missing or does not parse is the
  // no-op case here, exactly as the personal one is.
  const projectFile = projectConfigPathOf(explicitProjectConfig);
  const project = readJson(projectFile);
  overlayCeiling(ceiling, project?.ceiling, (name) => {
    warnings.push(`unknown key ceiling.${name} in ${projectFile}, ignored`);
  });

  return { ceiling, warnings, paths: { personal: configFile, project: projectFile } };
}

/** A usage field as a number, or 0 when it is absent or not one. */
function tokens(value) {
  return typeof value === "number" ? value : 0;
}

/**
 * One `assistant` record's whole prompt in tokens, cached part included, or
 * null when the record carries no `usage` object.
 */
function contextOf(record) {
  const usage = record.message?.usage;
  if (!usage || typeof usage !== "object") return null;
  return tokens(usage.input_tokens) + tokens(usage.cache_creation_input_tokens) + tokens(usage.cache_read_input_tokens);
}

/** Every line of a transcript, with a trailing empty line dropped. */
function recordLines(raw) {
  const lines = raw.split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

/** A record of `type` `user` that carries no `tool_result` block. */
function isWakeUp(record) {
  if (record.type !== "user") return false;
  const content = record.message?.content;
  if (Array.isArray(content) && content.some((block) => block && block.type === "tool_result")) {
    return false;
  }
  return true;
}

/** A wake-up's text: the string content, or the first `text` block's text. */
function wakeUpText(record) {
  const content = record.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    const block = content.find((b) => b && typeof b.text === "string");
    if (block) return block.text;
  }
  return "";
}

/**
 * The five figures, the effort, the baseline, and the last human turn, from
 * one transcript. Throws when the file cannot be read, which the caller
 * reports as the `unavailable` form.
 */
function readTranscript(file) {
  const raw = fs.readFileSync(file, "utf8");
  const bytes = fs.statSync(file).size;
  const lines = recordLines(raw);

  let wakeUps = 0;
  let compactions = 0;
  let context = 0;
  let baseline = 0;
  let baselineSeen = false;
  let effort = "unknown";
  let lastHuman = null;

  for (const line of lines) {
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      // A line that does not parse is counted in records and nowhere else,
      // so a truncated last line while the harness is mid-write does not
      // fail the reading.
      continue;
    }
    if (!record || typeof record !== "object") continue;

    if (isWakeUp(record)) {
      wakeUps++;
      if (wakeUpText(record).startsWith(COMPACTION_PHRASE)) compactions++;
      if (record.origin && record.origin.kind === "human" && record.timestamp) {
        lastHuman = record.timestamp;
      }
      continue;
    }

    if (record.type === "assistant") {
      effort =
        typeof record.perTurnEffort === "string"
          ? record.perTurnEffort
          : typeof record.effort === "string"
            ? record.effort
            : "unknown";
      const turn = contextOf(record);
      if (turn !== null) {
        context = turn;
        if (!baselineSeen) {
          baseline = turn;
          baselineSeen = true;
        }
      }
    }
  }

  return {
    bytes,
    records: lines.length,
    wakeUps,
    compactions,
    context,
    baseline,
    effort,
    lastHuman,
  };
}

/** An error message flattened to the one line the reading carries. */
function oneLine(message) {
  return String(message).replace(/\s+/g, " ").trim();
}

function printWarnings(warnings) {
  for (const warning of warnings) {
    process.stderr.write(`${warning}\n`);
  }
}

/** `<role>`'s ceiling: the measured baseline plus N batches of consumption. */
function ceilingOf(ceiling, role, baseline) {
  const batches = ceiling[role].batches;
  const perBatch = ceiling[role].per_batch;
  return { batches, perBatch, value: baseline + batches * perBatch };
}

function runReading(file, values) {
  let reading;
  try {
    reading = readTranscript(file);
  } catch (err) {
    // The unavailable form is a value the roles send, not a failure.
    console.log(`transcript: unavailable — ${oneLine(err.message)}`);
    console.log("effort=unknown");
    return 0;
  }

  console.log(
    `transcript: ${reading.bytes} B, ${reading.records} records, ` +
      `${reading.wakeUps} wake-ups, ${reading.compactions} compactions, ` +
      `context=${reading.context}`,
  );
  console.log(`effort=${reading.effort}`);

  const { ceiling, warnings } = loadCeiling(values.config, values["project-config"]);
  printWarnings(warnings);

  let ceilingValue = null;
  if (values.role) {
    const derived = ceilingOf(ceiling, values.role, reading.baseline);
    ceilingValue = derived.value;
    const verdict = reading.context >= derived.value ? "over" : "under";
    console.log(
      `ceiling: ${values.role} baseline=${reading.baseline} + ${derived.batches} x ` +
        `${derived.perBatch} = ${derived.value} — context=${reading.context} ${verdict}`,
    );
  }

  if (values.presence) {
    const windowMinutes = ceiling.presence_minutes;
    if (reading.lastHuman === null) {
      console.log(`human: last=none — absent (window ${windowMinutes} min)`);
    } else {
      const now = values.now ? new Date(values.now) : new Date();
      const minutes = Math.floor((now.getTime() - new Date(reading.lastHuman).getTime()) / 60000);
      const verdict = minutes <= windowMinutes ? "present" : "absent";
      console.log(
        `human: last=${reading.lastHuman} ${minutes} min ago — ${verdict} ` + `(window ${windowMinutes} min)`,
      );
    }
  }

  if (values.backstop) {
    const fromEnv = process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW;
    let window;
    let source;
    if (fromEnv !== undefined && fromEnv !== "") {
      window = Number(fromEnv);
      source = "env";
    } else {
      const settings = readJson(settingsPathOf(values.settings));
      if (settings && typeof settings.autoCompactWindow === "number") {
        window = settings.autoCompactWindow;
        source = "settings";
      } else {
        window = DEFAULT_AUTO_COMPACT_WINDOW;
        source = "default";
      }
    }
    const verdict = window > ceilingValue ? "above" : "below";
    console.log(`backstop: autoCompactWindow=${window} (${source}) — ${verdict} ceiling ${ceilingValue}`);
  }

  return 0;
}

function runShare(paths, values) {
  if (paths.length === 0) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  const { ceiling, warnings } = loadCeiling(values.config, values["project-config"]);
  printWarnings(warnings);
  const threshold = ceiling.share_threshold;

  let total = 0;
  let over = 0;
  let read = 0;
  const skipped = [];

  for (const file of paths) {
    let raw;
    try {
      raw = fs.readFileSync(file, "utf8");
    } catch {
      skipped.push(file);
      continue;
    }
    read++;
    for (const line of recordLines(raw)) {
      let record;
      try {
        record = JSON.parse(line);
      } catch {
        continue;
      }
      if (!record || record.type !== "assistant") continue;
      const turn = contextOf(record);
      if (turn === null) continue;
      total += turn;
      if (turn > threshold) over += turn;
    }
  }

  const pct = total === 0 ? 0 : Math.round((over / total) * 100);
  let line =
    `share: ${pct}% of usage at context > ${threshold} over ${read} transcripts ` + `(${over} / ${total} tokens)`;
  if (skipped.length > 0) line += ` (skipped ${skipped.join(", ")})`;
  console.log(line);
  return 0;
}

/** Dispatch. Returns the process exit code. */
function main(argv) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        role: { type: "string" },
        presence: { type: "boolean" },
        backstop: { type: "boolean" },
        share: { type: "boolean" },
        now: { type: "string" },
        config: { type: "string" },
        "project-config": { type: "string" },
        settings: { type: "string" },
      },
    });
  } catch (err) {
    process.stderr.write(`${err.message}\n${USAGE}\n`);
    return 2;
  }

  const values = parsed.values;
  if (values.role !== undefined && !CEILING_ROLES.includes(values.role)) {
    process.stderr.write(`invalid --role '${values.role}'\n${USAGE}\n`);
    return 2;
  }
  if (values.share) {
    return runShare(parsed.positionals, values);
  }
  if (parsed.positionals.length !== 1) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  if (values.backstop && values.role === undefined) {
    process.stderr.write(`--backstop needs --role\n${USAGE}\n`);
    return 2;
  }
  return runReading(parsed.positionals[0], values);
}

module.exports = {
  readTranscript,
  loadCeiling,
  ceilingOf,
  main,
};

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}
