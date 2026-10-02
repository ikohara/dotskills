// issues-by-finder: count the issues under docs/issues/ per topic by the finder
// that proposed them (read through the `Source:` line and the `.tanto/<topic>/kanri.md`
// ledger rows), or run the experience-layer exit criterion's `exp-` recipe. Run as:
//   node scripts/issues-by-finder.js [--docs docs/issues] [--tanto .tanto]
//     [--status open,deferred,resolved] [--json <path>]
//   node scripts/issues-by-finder.js --exp <topic> [--docs <paths...>]
//     [--inputs <paths...>] [--adr <paths...>]
// Dependency-free CommonJS.

const fs = require("node:fs");
const path = require("node:path");

const NO_TOPIC = "—";
const DEFAULT_STATUSES = ["open", "deferred", "resolved"];
const SOURCE_KINDS = ["shoroku", "session", "inbox", "hotfix", "no source"];
const UNMAPPED_CUT = 40;

// The finder patterns, in match order: the first one that matches a Source
// cell wins. Each is a case-insensitive substring; a `*` matches a run of
// non-space characters.
const FINDER_PATTERNS = [
  ["batch-shusei", "close"],
  ["shoki", "close"],
  ["batch-*-report.md", "jisso"],
  ["shoroku-proposal-jisso-", "jisso"],
  ["shoroku-proposal.md", "jisso"],
  ["batch-*-verdict.md", "boundary"],
  ["branch-review", "branch reviewer"],
  ["spec-review.md", "spec reviewer"],
  ["plan-review", "plan reviewer"],
  ["coldread.md", "plan reviewer"],
  ["plan-dryrun", "plan reviewer"],
  ["shoroku-proposal-sekkei-", "sekkei"],
  ["exit-sekkei-proposal", "sekkei"],
  ["the spec", "sekkei"],
  ["spec §", "sekkei"],
  ["docs/superpowers/specs/", "sekkei"],
  ["spec-draft", "sekkei"],
  ["shoroku-proposal-keikaku-", "keikaku"],
  ["exit-keikaku-proposal", "keikaku"],
  ["shoroku-proposal-kanri-", "kanri"],
  ["exit-kanri-", "kanri"],
  ["Kanri's own", "kanri"],
  ["kanri-handover", "kanri"],
  ["kaiseki-", "kaiseki"],
  [".tanto/kikaku/", "kikaku"],
  ["Kikaku decision", "kikaku"],
  ["inbox", "inbox"],
  ["human word", "human"],
].map(([pattern, finder]) => {
  const source = pattern
    .split("*")
    .map((part) => part.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&"))
    .join("\\S*");
  return { pattern, finder, regex: new RegExp(source, "i") };
});

// The Totals table's columns: the finders in mapping order, then these.
const FINDER_COLUMNS = [...new Set(FINDER_PATTERNS.map((entry) => entry.finder))];
const EXTRA_COLUMNS = ["session", "hotfix", "shoroku (unnumbered)", "no source", "unresolved", "unmapped"];
const ALL_COLUMNS = [...FINDER_COLUMNS, ...EXTRA_COLUMNS];

function escapeCell(text) {
  return String(text).replace(/\|/g, "\\|");
}

function renderTable(header, rows) {
  const line = (cells) => `| ${cells.map(escapeCell).join(" | ")} |`;
  return [line(header), line(header.map(() => "---")), ...rows.map(line)].join("\n");
}

function normalizeEol(text) {
  return text.replace(/\r\n?/g, "\n");
}

// The `Source:` line of an issue file: the body's first non-empty line after
// the frontmatter, or null when that line is not a `Source:` line.
function sourceLine(issueText) {
  const lines = normalizeEol(issueText).split("\n");
  let start = 0;
  if (lines[0] !== undefined && lines[0].trim() === "---") {
    const close = lines.findIndex((line, i) => i > 0 && line.trim() === "---");
    if (close !== -1) {
      start = close + 1;
    }
  }
  const first = lines.slice(start).find((line) => line.trim() !== "");
  if (first === undefined) {
    return null;
  }
  const match = /^Source:[ \t]*(.*)$/.exec(first.trim());
  return match ? match[1].trim() : null;
}

function parseSource(text) {
  const raw = String(text);
  const body = /^---\r?\n/.test(raw) ? sourceLine(raw) : raw.trim().replace(/^Source:[ \t]*/, "");
  if (body === null) {
    return { kind: null, topic: null, row: null };
  }
  if (/^inbox(\s|$)/.test(body)) {
    return { kind: "inbox", topic: null, row: null };
  }
  if (/^session(\s|$)/.test(body)) {
    return { kind: "session", topic: null, row: null };
  }
  if (/^hotfix(\s|$)/.test(body)) {
    return { kind: "hotfix", topic: null, row: null };
  }
  const shoroku = /^shoroku\s+(\S+)(?:\s+S-(\d+))?/.exec(body);
  if (shoroku) {
    return { kind: "shoroku", topic: shoroku[1], row: shoroku[2] === undefined ? null : Number(shoroku[2]) };
  }
  return { kind: null, topic: null, row: null };
}

// The cells of a table row: split on unescaped `|`, trimmed, the outer pipes dropped.
function splitRow(line) {
  let inner = line.trim();
  if (inner.startsWith("|")) {
    inner = inner.slice(1);
  }
  if (inner.endsWith("|") && !inner.endsWith("\\|")) {
    inner = inner.slice(0, -1);
  }
  return inner.split(/(?<!\\)\|/).map((cell) => cell.trim().replace(/\\\|/g, "|"));
}

function findRow(ledgerText, n) {
  const id = `S-${n}`;
  for (const line of normalizeEol(ledgerText).split("\n")) {
    if (!line.trimStart().startsWith("|")) {
      continue;
    }
    const cells = splitRow(line);
    if (cells[0] === id) {
      return cells;
    }
  }
  return null;
}

function mapFinder(cell) {
  const text = String(cell);
  for (const entry of FINDER_PATTERNS) {
    if (entry.regex.test(text)) {
      return entry.finder;
    }
  }
  return `unmapped (${text.trim().slice(0, UNMAPPED_CUT)})`;
}

function readLedger(tantoDir, topic, cache) {
  const file = path.join(tantoDir, topic, "kanri.md");
  if (cache?.has(file)) {
    return cache.get(file);
  }
  let text = null;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    text = null;
  }
  if (cache) {
    cache.set(file, text);
  }
  return text;
}

function ledgerCell(tantoDir, topic, n, cache) {
  const ledger = readLedger(tantoDir, topic, cache);
  if (ledger === null) {
    return null;
  }
  const row = findRow(ledger, n);
  if (row === null || row[1] === undefined) {
    return null;
  }
  return row[1];
}

// `issue` is an issue file's text, or an object with a `text` field.
function finderOf(issue, tantoDir, cache) {
  const text = typeof issue === "string" ? issue : issue.text;
  const line = sourceLine(text);
  if (line === null) {
    return { topic: NO_TOPIC, finder: "no source" };
  }
  const source = parseSource(line);
  if (source.kind === "inbox" || source.kind === "session" || source.kind === "hotfix") {
    return { topic: NO_TOPIC, finder: source.kind };
  }
  if (source.kind === null) {
    return { topic: NO_TOPIC, finder: "no source" };
  }
  if (source.row === null) {
    return { topic: source.topic, finder: "shoroku (unnumbered)" };
  }
  let cell = ledgerCell(tantoDir, source.topic, source.row, cache);
  if (cell === null) {
    return { topic: source.topic, finder: "unresolved" };
  }
  // A carried row is followed once only; what the hop lands on is mapped as it stands.
  const roster = /^carried from roster-S-\d+/i.exec(cell);
  const hop = /^carried from (\S+) S-(\d+)/i.exec(cell);
  if (roster) {
    const colon = cell.indexOf(": ");
    if (colon !== -1) {
      cell = cell.slice(colon + 2).trim();
    }
  } else if (hop) {
    cell = ledgerCell(tantoDir, hop[1], Number(hop[2]), cache);
    if (cell === null) {
      return { topic: source.topic, finder: "unresolved" };
    }
  }
  return { topic: source.topic, finder: mapFinder(cell) };
}

function listIssues(docsDir, status) {
  const dir = path.join(docsDir, status);
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(dir, entry.name))
    .sort();
}

function bump(map, key) {
  map[key] = (map[key] || 0) + 1;
}

function column(finder) {
  return finder.startsWith("unmapped (") ? "unmapped" : finder;
}

function countByFinder({ docs, tanto, statuses }) {
  const names = statuses && statuses.length > 0 ? statuses : DEFAULT_STATUSES;
  const perTopic = {};
  const totals = {};
  const sourceKinds = Object.fromEntries(SOURCE_KINDS.map((kind) => [kind, 0]));
  const cache = new Map();
  let total = 0;
  let attributable = 0;
  let unresolved = 0;
  for (const status of names) {
    for (const file of listIssues(docs, status)) {
      const text = fs.readFileSync(file, "utf8");
      const { topic, finder } = finderOf(text, tanto, cache);
      total += 1;
      perTopic[topic] = perTopic[topic] || {};
      bump(perTopic[topic], finder);
      totals[topic] = totals[topic] || {};
      bump(totals[topic], column(finder));
      const line = sourceLine(text);
      const parsed = line === null ? { kind: null, row: null } : parseSource(line);
      bump(sourceKinds, parsed.kind === null ? "no source" : parsed.kind);
      if (parsed.kind === "shoroku" && parsed.row !== null) {
        attributable += 1;
        if (finder === "unresolved") {
          unresolved += 1;
        }
      }
    }
  }
  return {
    total,
    perTopic,
    totals,
    sourceKinds,
    attributable: { count: attributable, total, share: total === 0 ? 0 : attributable / total, unresolved },
  };
}

function sortedTopics(map) {
  return Object.keys(map).sort((a, b) => {
    if (a === NO_TOPIC) {
      return b === NO_TOPIC ? 0 : 1;
    }
    if (b === NO_TOPIC) {
      return -1;
    }
    return a < b ? -1 : a > b ? 1 : 0;
  });
}

function renderCounts(result) {
  const out = [];
  for (const topic of sortedTopics(result.perTopic)) {
    const counts = result.perTopic[topic];
    const rows = Object.keys(counts)
      .sort((a, b) => counts[b] - counts[a] || (a < b ? -1 : a > b ? 1 : 0))
      .map((finder) => [finder, counts[finder]]);
    out.push(`## By finder — ${topic}`, "", renderTable(["Finder", "Issues"], rows), "");
  }
  const topics = sortedTopics(result.totals);
  const used = ALL_COLUMNS.filter((name) => topics.some((topic) => result.totals[topic][name]));
  const sum = (topic) => used.reduce((acc, name) => acc + (result.totals[topic][name] || 0), 0);
  const rows = topics.map((topic) => [topic, ...used.map((name) => result.totals[topic][name] || 0), sum(topic)]);
  rows.push([
    "Total",
    ...used.map((name) => topics.reduce((acc, topic) => acc + (result.totals[topic][name] || 0), 0)),
    result.total,
  ]);
  out.push("## Totals", "", renderTable(["Topic", ...used, "Total"], rows), "");
  out.push(
    "## Source kinds",
    "",
    renderTable(
      ["Source", "Issues"],
      SOURCE_KINDS.map((kind) => [kind, result.sourceKinds[kind] || 0]),
    ),
    "",
  );
  const a = result.attributable;
  const percent = (a.share * 100).toFixed(1);
  out.push(
    `Attributable: ${a.count} of ${a.total} issues (${percent}%) name an S-<n> ledger row and reach a finder ` +
      "through it; the by-finder table reads only the topics whose issues carry one.",
    "",
    `Of those ${a.count}, ${a.unresolved} came out unresolved.`,
    "",
    `issues counted: ${result.total}`,
  );
  return out.join("\n");
}

// --- the exp- count ---

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchAll(text, regex, group) {
  const found = [];
  for (const match of text.matchAll(regex)) {
    found.push(match[group]);
  }
  return found;
}

function readIfFile(file) {
  try {
    return fs.statSync(file).isFile() ? fs.readFileSync(file, "utf8") : null;
  } catch {
    return null;
  }
}

function topicFiles(cwd, dirRel, topic) {
  const re = new RegExp(`^\\d{4}-\\d{2}-\\d{2}-${escapeRegex(topic)}(-design)?\\.md$`);
  let names;
  try {
    names = fs.readdirSync(path.join(cwd, dirRel));
  } catch {
    names = [];
  }
  return names
    .filter((name) => re.test(name))
    .sort()
    .map((name) => `${dirRel}/${name}`);
}

// `docs`, `inputs`, `adr`: arrays of paths, or undefined for the defaults
// (`adr` defaults to none). A path is read against `cwd`.
function expCount({ topic, docs, inputs, adr, cwd }) {
  const base = cwd || process.cwd();
  const skipped = [];
  const specFiles = topicFiles(base, "docs/superpowers/specs", topic);
  const planFiles = topicFiles(base, "docs/superpowers/plans", topic);

  let documentPaths;
  if (docs === undefined) {
    documentPaths = [...specFiles, ...planFiles];
    if (specFiles.length === 0) {
      skipped.push(`docs/superpowers/specs/<date>-${topic}[-design].md`);
    }
    if (planFiles.length === 0) {
      skipped.push(`docs/superpowers/plans/<date>-${topic}[-design].md`);
    }
    for (const brief of ["review-brief-spec.md", "review-brief-plan.md"]) {
      const rel = `.tanto/${topic}/${brief}`;
      if (fs.existsSync(path.join(base, rel))) {
        documentPaths.push(rel);
      } else {
        skipped.push(rel);
      }
    }
  } else {
    documentPaths = [...docs];
  }
  documentPaths.push(...(adr || []));

  let inputPaths;
  if (inputs === undefined) {
    inputPaths = [];
    for (const name of ["dialogue.md", "spec-inputs.md"]) {
      const rel = `.tanto/${topic}/${name}`;
      if (fs.existsSync(path.join(base, rel))) {
        inputPaths.push(rel);
      } else {
        skipped.push(rel);
      }
    }
    const named = new Set();
    for (const spec of specFiles) {
      const text = readIfFile(path.join(base, spec)) || "";
      for (const rel of matchAll(text, /\.tanto\/kikaku\/[^\s`()[\]<>"'|,;*]+\.md/g, 0)) {
        named.add(rel);
      }
    }
    for (const rel of [...named].sort()) {
      if (fs.existsSync(path.join(base, rel))) {
        inputPaths.push(rel);
      } else {
        skipped.push(rel);
      }
    }
  } else {
    inputPaths = [...inputs];
  }

  const documentIds = new Set();
  for (const rel of documentPaths) {
    const text = readIfFile(path.resolve(base, rel));
    if (text !== null) {
      for (const id of matchAll(text, /exp-([0-9a-f]{4})/g, 1)) {
        documentIds.add(id);
      }
    }
  }
  const inputIds = new Set();
  for (const rel of inputPaths) {
    const text = readIfFile(path.resolve(base, rel));
    if (text !== null) {
      const found = [...matchAll(text, /exp-([0-9a-f]{4})/g, 1), ...matchAll(text, /\b([0-9a-f]{4})\b/g, 1)];
      for (const id of found) {
        inputIds.add(id);
      }
    }
  }
  const sorted = (set) => [...set].sort();
  return {
    documents: documentPaths,
    inputs: inputPaths,
    documentIds: sorted(documentIds),
    inputIds: sorted(inputIds),
    unprompted: sorted(documentIds).filter((id) => !inputIds.has(id)),
    skipped,
  };
}

function renderExp(result) {
  const list = (items) => (items.length === 0 ? "(none)" : items.join(", "));
  const ids = (items) => (items.length === 0 ? "(none)" : items.join(" "));
  return [
    `documents: ${list(result.documents)}`,
    `inputs: ${list(result.inputs)}`,
    `documents ids (${result.documentIds.length}): ${ids(result.documentIds)}`,
    `inputs ids (${result.inputIds.length}): ${ids(result.inputIds)}`,
    `unprompted (${result.unprompted.length}): ${ids(result.unprompted.map((id) => `exp-${id}`))}`,
    `skipped: ${list(result.skipped)}`,
    `unprompted: ${result.unprompted.length}`,
  ].join("\n");
}

// --- the command line ---

class UsageError extends Error {}

const SINGLE_OPTIONS = ["--docs", "--tanto", "--status", "--json"];
const MULTI_OPTIONS = ["--docs", "--inputs", "--adr"];

function parseArgs(argv) {
  const opts = {};
  let i = 0;
  const exp = argv.includes("--exp");
  while (i < argv.length) {
    const arg = argv[i];
    if (arg === "--exp") {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        throw new UsageError("--exp needs a topic");
      }
      opts.exp = next;
      i += 2;
    } else if (exp && MULTI_OPTIONS.includes(arg)) {
      const values = [];
      i += 1;
      while (i < argv.length && !argv[i].startsWith("--")) {
        values.push(argv[i]);
        i += 1;
      }
      opts[arg.slice(2)] = values;
    } else if (!exp && SINGLE_OPTIONS.includes(arg)) {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        throw new UsageError(`${arg} needs a value`);
      }
      opts[arg.slice(2)] = next;
      i += 2;
    } else if (arg.startsWith("--")) {
      throw new UsageError(
        SINGLE_OPTIONS.includes(arg) || MULTI_OPTIONS.includes(arg)
          ? `option ${arg} does not apply ${exp ? "with" : "without"} --exp`
          : `unknown option ${arg}`,
      );
    } else {
      throw new UsageError(`unexpected argument ${arg}`);
    }
  }
  return opts;
}

function mustExist(cwd, given, what) {
  for (const item of given) {
    if (!fs.existsSync(path.resolve(cwd, item))) {
      throw new UsageError(`${what} does not exist: ${item}`);
    }
  }
}

function main(argv, io) {
  const cwd = io?.cwd || process.cwd();
  const stdout = io?.stdout || process.stdout;
  const stderr = io?.stderr || process.stderr;
  try {
    const opts = parseArgs(argv);
    if (opts.exp !== undefined) {
      for (const name of ["docs", "inputs", "adr"]) {
        if (opts[name]) {
          mustExist(cwd, opts[name], `--${name} path`);
        }
      }
      const result = expCount({ topic: opts.exp, docs: opts.docs, inputs: opts.inputs, adr: opts.adr, cwd });
      stdout.write(`${renderExp(result)}\n`);
      return 0;
    }
    const docs = path.resolve(cwd, opts.docs || "docs/issues");
    if (!fs.existsSync(docs) || !fs.statSync(docs).isDirectory()) {
      throw new UsageError(`issues directory does not exist: ${opts.docs || "docs/issues"}`);
    }
    if (opts.tanto !== undefined) {
      mustExist(cwd, [opts.tanto], "--tanto path");
    }
    const tanto = path.resolve(cwd, opts.tanto || ".tanto");
    const statuses = opts.status
      ? opts.status
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : DEFAULT_STATUSES;
    const result = countByFinder({ docs, tanto, statuses });
    stdout.write(`${renderCounts(result)}\n`);
    if (opts.json !== undefined) {
      const { count, total, share } = result.attributable;
      const json = {
        statuses,
        total: result.total,
        perTopic: result.perTopic,
        totals: result.totals,
        sourceKinds: result.sourceKinds,
        attributable: { count, total, share },
      };
      fs.writeFileSync(path.resolve(cwd, opts.json), `${JSON.stringify(json, null, 2)}\n`);
    }
    return 0;
  } catch (error) {
    if (error instanceof UsageError) {
      stderr.write(`issues-by-finder: ${error.message}\n`);
      return 1;
    }
    throw error;
  }
}

module.exports = { parseSource, findRow, mapFinder, finderOf, countByFinder, expCount, main };

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2), {
    cwd: process.cwd(),
    stdout: process.stdout,
    stderr: process.stderr,
  });
}
