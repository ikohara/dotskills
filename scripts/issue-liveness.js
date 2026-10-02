// issue-liveness: for each open or deferred issue under docs/issues/, extract
// the strings and paths it cites, check them against a git ref's tree, and name
// the commit that removed what is gone. Run as:
//   node scripts/issue-liveness.js --out <dir> [--ref main] [--docs docs/issues]
// Dependency-free CommonJS; every git call is an argument array, no shell.

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const MAX_BUFFER = 256 * 1024 * 1024;
const STATUS_DIRS = ["open", "deferred"];
const EXCLUDED_TREES = ["docs/issues/", "docs/reports/", "docs/superpowers/", ".tanto/"];
const TREE_EXTENSIONS = new Set(
  (
    ".md .txt .js .cjs .mjs .ts .json .jsonc .yaml .yml .toml .sh .bat .ps1 .psd1 .psm1 .py .css .html" +
    " .gitignore .gitattributes .editorconfig"
  ).split(" "),
);
const PATH_EXTENSIONS = [".md", ".js", ".json", ".sh", ".bat", ".ps1", ".py", ".yaml", ".yml", ".toml"];
const PATH_SKIP_PREFIXES = [".tanto/", ".superpowers/", "~", "$", "<"];
const QUOTE_MIN = 30;
const QUOTE_MAX = 140;
const SPLIT_ABOVE = 50;
const NEIGHBOR_COUNT = 3;
const TOKEN_MIN = 4;
const TITLE_CUT = 100;
const LIVING_TREES = ["docs/experience", "docs/design", "docs/notes", "docs/issues/open", "docs/issues/deferred"];

// The cluster table. A title's cluster is the first row, in `order`, that has
// a term matching the title; a title no row matches is `other`. Matching looks
// at the `title:` alone and is case-insensitive (see `termMatches`):
//   - a term of five characters or fewer made only of letters and digits
//     (plan, task, lint, fence, scene, kanri, jisso, hosa, sdd, i18n, cache,
//     token, quota, shoki, kisou, ...) matches as a whole word, `\b` on both
//     sides;
//   - any longer term matches as a substring;
//   - a term with `/`, `.`, or `-`, a term with a space or `=`, `R-n`, and
//     `429` (digits only) match literally as substrings, by `includes` on the
//     lowercased strings, never through a regex built from the term.
// `round` is the review round (1 to 6) the cluster belongs to; a round of more
// than fifty issues is split into `<n>a` and `<n>b` in table order.
const CLUSTERS = [
  {
    order: 1,
    name: "passage-check / plan instrument",
    round: 1,
    terms: ["passage-check", "passage", "replay", "needle", "fence", "O block", "dry run", "dryrun", "pickaxe", "lint"],
  },
  {
    order: 2,
    name: "kanri / ledger / handover / boundary",
    round: 2,
    terms: ["ledger", "handover", "boundary", "census", "ruling", "R-n", "events line", "successor", "kanri"],
  },
  {
    order: 3,
    name: "roster / handshake / address",
    round: 2,
    terms: ["roster", "handshake", "address", "no-role", "rename", "sessionId"],
  },
  {
    order: 4,
    name: "reading / ceiling / cost / ttl",
    round: 3,
    terms: [
      "reading",
      "ceiling",
      "context=",
      "cache",
      "token",
      "wake-up",
      "compaction",
      "quota",
      "429",
      "cost",
      "ttl",
      "share",
    ],
  },
  {
    order: 5,
    name: "config / agents / effort / model",
    round: 3,
    terms: ["tanto.json", "config", "agent definition", "agents/", "effort", "model", "family"],
  },
  {
    order: 6,
    name: "keikaku / plan / coldread / batch shape",
    round: 4,
    terms: ["keikaku", "coldread", "cold read", "batch", "plan"],
  },
  {
    order: 7,
    name: "jisso / sdd / report",
    round: 4,
    terms: ["jisso", "sdd", "implementer", "batch report", "report", "task"],
  },
  { order: 8, name: "sekkei / spec / dialogue", round: 4, terms: ["sekkei", "spec", "dialogue"] },
  { order: 9, name: "brief / review", round: 4, terms: ["brief", "review"] },
  {
    order: 10,
    name: "shoroku / close / kessai / shoki",
    round: 5,
    terms: ["shoroku", "close", "kessai", "shoki", "shusei", "direction", "recommend", "proposal"],
  },
  {
    order: 11,
    name: "spawner / bg seats / resume",
    round: 5,
    terms: [
      "spawner",
      "spawn",
      "bg seat",
      "background",
      "resume",
      "launcher",
      "seats.json",
      "--bg",
      "attach",
      "terminal seat",
      "tab seat",
    ],
  },
  { order: 12, name: "hosa / kikaku / kaiseki", round: 5, terms: ["hosa", "kikaku", "kaiseki"] },
  {
    order: 13,
    name: "kisou / docs system / templates",
    round: 6,
    terms: [
      "kisou",
      "doc-system",
      "docs/",
      "template",
      "frontmatter",
      "AGENTS.md",
      "experience",
      "scene",
      "requirement",
    ],
  },
  {
    order: 14,
    name: "wayaku / i18n / language",
    round: 6,
    terms: ["wayaku", "language", "japanese", "translation", "i18n"],
  },
  { order: 15, name: "tests / scripts", round: 6, terms: ["test", "script", "node", "pre-commit"] },
  { order: 16, name: "other", round: 6, terms: [] },
];

// ---------------------------------------------------------------- git

// One-line message for a failed git call: the first stderr line, else the
// first message line.
function gitFailure(args, error) {
  const stderr = error && error.stderr ? String(error.stderr) : "";
  const detail = (stderr.split("\n").find((l) => l.trim()) || String(error.message).split("\n")[0]).trim();
  return new Error(`git ${args[0]} failed: ${detail}`);
}

function git(args, cwd) {
  try {
    return execFileSync("git", ["-c", "core.quotepath=false", ...args], {
      cwd,
      encoding: "utf8",
      maxBuffer: MAX_BUFFER,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    throw gitFailure(args, error);
  }
}

// ---------------------------------------------------------------- command line

function parseArgs(argv) {
  const args = { out: "", ref: "main", docs: "docs/issues" };
  for (let i = 0; i < argv.length; i++) {
    const name = argv[i];
    if (name !== "--out" && name !== "--ref" && name !== "--docs") {
      throw new Error(`unknown option: ${name}`);
    }
    const value = argv[++i];
    if (value === undefined) {
      throw new Error(`missing value for ${name}`);
    }
    args[name.slice(2)] = value;
  }
  if (!args.out) {
    throw new Error("missing --out <dir>");
  }
  return args;
}

// ---------------------------------------------------------------- text

function toLf(text) {
  return text.replace(/\r\n/g, "\n");
}

// The comparison form of a text: LF, links reduced to their text, backticks
// gone, whitespace runs (line breaks included) one space, trimmed.
function normalize(text) {
  return toLf(text)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, (_all, label) => label)
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function countLines(text) {
  if (text === "") {
    return 0;
  }
  const breaks = toLf(text).split("\n").length - 1;
  return text.endsWith("\n") ? breaks : breaks + 1;
}

// ---------------------------------------------------------------- the pile

function unquoteValue(raw) {
  const value = raw.trim();
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replace(/\\(["\\])/g, "$1");
  }
  if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  return value;
}

function splitFrontmatter(text) {
  const lines = toLf(text).split("\n");
  const open = lines.indexOf("---");
  const close = open < 0 ? -1 : lines.indexOf("---", open + 1);
  if (open < 0 || close < 0) {
    return { fields: {}, body: lines.join("\n") };
  }
  const fields = {};
  for (const line of lines.slice(open + 1, close)) {
    const match = /^([A-Za-z0-9_-]+):(.*)$/.exec(line);
    if (match) {
      fields[match[1]] = unquoteValue(match[2]);
    }
  }
  return { fields, body: lines.slice(close + 1).join("\n") };
}

// Every straight or curly quoted pair whose inner text is 30 to 140 characters
// long, over the whole body; each distinct text once.
function extractQuotes(body) {
  const quotes = [];
  for (const match of toLf(body).matchAll(/"([^"]*)"|\u201c([^\u201d]*)\u201d/g)) {
    const inner = match[1] ?? match[2];
    if (inner.length >= QUOTE_MIN && inner.length <= QUOTE_MAX && !quotes.includes(inner)) {
      quotes.push(inner);
    }
  }
  return quotes;
}

// Every single-backtick code span that looks like a file path; a trailing
// `:<line>` or `:<line>-<line>` is the hint. Each distinct span once.
function extractPathTokens(body) {
  const found = [];
  const seen = new Set();
  for (const match of toLf(body).matchAll(/(?<!`)`([^`\n]+)`(?!`)/g)) {
    const span = match[1];
    if (/\s/.test(span) || seen.has(span)) {
      continue;
    }
    seen.add(span);
    let token = span;
    let hint = null;
    const suffix = /^(.+):(\d+)(?:-(\d+))?$/.exec(span);
    if (suffix) {
      token = suffix[1];
      const from = Number(suffix[2]);
      hint = { from, to: suffix[3] === undefined ? from : Number(suffix[3]) };
    }
    const pathLike = token.includes("/") || PATH_EXTENSIONS.some((ext) => token.endsWith(ext));
    if (pathLike && !PATH_SKIP_PREFIXES.some((prefix) => token.startsWith(prefix))) {
      found.push({ token, hint });
    }
  }
  return found;
}

function parseIssue(text, file) {
  const { fields, body } = splitFrontmatter(text);
  const firstLine = body.split("\n").find((l) => l.trim() !== "");
  const source = firstLine?.startsWith("Source: ") ? firstLine.slice("Source: ".length).trim() : null;
  return {
    id: fields.id || path.posix.basename(file.path, ".md"),
    dir: file.dir,
    path: file.path,
    title: fields.title ?? "",
    severity: fields.severity ?? "",
    created: fields.created ?? "",
    source,
    sourceKind: source ? source.split(/\s+/)[0] : null,
    citesExp: /exp-[0-9a-f]{4}/.test(body),
    quotes: extractQuotes(body),
    paths: extractPathTokens(body),
  };
}

function readPile(docsDir, docs) {
  const issues = [];
  for (const dir of STATUS_DIRS) {
    let names;
    try {
      names = fs.readdirSync(path.join(docsDir, dir), { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT" || error.code === "ENOTDIR") {
        continue; // a status directory exists only while it holds an issue
      }
      throw new Error(`cannot read ${docs}/${dir}: ${error.code}`);
    }
    for (const entry of names
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const text = fs.readFileSync(path.join(docsDir, dir, entry.name), "utf8").replace(/^\uFEFF/, "");
      issues.push(parseIssue(text, { path: `${docs.replace(/[\\/]+$/, "")}/${dir}/${entry.name}`, dir }));
    }
  }
  return issues;
}

// ---------------------------------------------------------------- the tree

function isLoadable(p) {
  if (EXCLUDED_TREES.some((tree) => p.startsWith(tree))) {
    return false;
  }
  const ext = path.posix.extname(path.posix.basename(p)).toLowerCase();
  return ext === "" || TREE_EXTENSIONS.has(ext);
}

function loadTree(ref, cwd) {
  const paths = git(["ls-tree", "-r", "-z", "--name-only", ref], cwd).split("\0").filter(Boolean);
  const files = new Map();
  for (const p of paths.filter(isLoadable)) {
    const text = git(["show", `${ref}:${p}`], cwd);
    files.set(p, { text, norm: normalize(text), lineCount: countLines(text) });
  }
  const extraCounts = new Map();
  return {
    ref,
    cwd,
    paths,
    files,
    lineCountOf(p) {
      const loaded = files.get(p);
      if (loaded) {
        return loaded.lineCount;
      }
      if (!extraCounts.has(p)) {
        extraCounts.set(p, countLines(git(["show", `${ref}:${p}`], cwd)));
      }
      return extraCounts.get(p);
    },
  };
}

function checkQuote(quote, tree) {
  const needle = normalize(quote);
  for (const [p, file] of tree.files) {
    if (file.norm.includes(needle)) {
      return { state: "alive", foundIn: p };
    }
  }
  return { state: "gone" };
}

// Does tracked path P resolve token T (a file, or a directory form)?
function resolves(p, token) {
  return p === token || p.endsWith(`/${token}`) || p.startsWith(`${token}/`) || p.includes(`/${token}/`);
}

function stripTrailingSlash(token) {
  return token.endsWith("/") ? token.slice(0, -1) : token;
}

function checkPath(token, hint, tree) {
  const wanted = stripTrailingSlash(token);
  const foundIn = wanted === "" ? undefined : tree.paths.find((p) => resolves(p, wanted));
  if (foundIn === undefined) {
    return { state: "gone" };
  }
  if (hint && hint.to > tree.lineCountOf(foundIn)) {
    return { state: "partly", foundIn };
  }
  return { state: "alive", foundIn };
}

// ---------------------------------------------------------------- the trace

function escapeRegexWord(word) {
  return word.replace(/[\\^$.|?*+()[\]{}]/g, "\\$&");
}

// The newest commit that changed the count of the quote's text, as
// {subject, path}; its words are joined by \s+ so a quote that wraps in the
// source still matches.
function traceQuote(quote, ref, cwd) {
  const pattern = quote.split(/\s+/).filter(Boolean).map(escapeRegexWord).join("\\s+");
  const out = git(
    [
      "log",
      ref,
      "-n",
      "1",
      "--format=%s",
      "--name-only",
      "--pickaxe-regex",
      `-S${pattern}`,
      "--",
      ".",
      ":(exclude)docs/issues",
      ":(exclude)docs/reports",
      ":(exclude)docs/superpowers",
      ":(exclude).tanto",
    ],
    cwd,
  );
  const lines = toLf(out).split("\n");
  if (!lines[0]) {
    return null;
  }
  const filePath = lines.slice(1).find((l) => l.trim() !== "");
  return filePath === undefined ? null : { subject: lines[0], path: filePath };
}

// Every deleted path with the subject of the commit that deleted it, newest first.
function loadDeletions(ref, cwd) {
  const out = toLf(git(["log", ref, "--diff-filter=D", "--name-only", "--format=%x00%s"], cwd));
  const deletions = [];
  for (const chunk of out.split("\0").slice(1)) {
    const [subject, ...names] = chunk.split("\n");
    for (const name of names.filter((n) => n !== "")) {
      deletions.push({ path: name, subject });
    }
  }
  return deletions;
}

function tracePath(token, deletions) {
  const wanted = stripTrailingSlash(token);
  const hit = wanted === "" ? undefined : deletions.find((d) => resolves(d.path, wanted));
  return hit ? { subject: hit.subject, path: hit.path } : null;
}

// ---------------------------------------------------------------- the verdict

function verdictOf(items) {
  const counts = { alive: 0, gone: 0, none: 0 };
  for (const item of items) {
    if (item.state === "alive") {
      counts.alive++;
    } else if (item.state === "gone") {
      counts.gone++;
    } else {
      counts.none++;
    }
  }
  let verdict = "partly";
  if (items.length === 0) {
    verdict = "none";
  } else if (counts.alive === items.length) {
    verdict = "alive";
  } else if (counts.gone === items.length) {
    verdict = "gone";
  }
  return { verdict, counts };
}

// ---------------------------------------------------------------- the cluster

// Does TERM match TITLE? See the comment above CLUSTERS for the rule.
function termMatches(term, title) {
  const lowTerm = term.toLowerCase();
  const lowTitle = title.toLowerCase();
  if (/^[a-z0-9]{1,5}$/.test(lowTerm) && !/^[0-9]+$/.test(lowTerm)) {
    return new RegExp(`\\b${lowTerm}\\b`).test(lowTitle);
  }
  return lowTitle.includes(lowTerm);
}

function clusterRowOf(title) {
  return (
    CLUSTERS.find((cluster) => cluster.terms.some((term) => termMatches(term, title))) ?? CLUSTERS[CLUSTERS.length - 1]
  );
}

function clusterOf(title) {
  return clusterRowOf(title).name;
}

const byId = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

// Sets row.round to the round file's name part and returns the rows in table
// order: cluster order, then id. A round of more than SPLIT_ABOVE rows splits
// into its first ceil(n / 2) rows (`<n>a`) and the rest (`<n>b`).
function assignRounds(rows) {
  const clusterFor = (row) =>
    CLUSTERS.find((c) => c.name === (row.cluster ?? clusterOf(row.title ?? ""))) ?? CLUSTERS[15];
  const ordered = rows
    .map((row) => ({ row, cluster: clusterFor(row) }))
    .sort((a, b) => a.cluster.order - b.cluster.order || byId(a.row, b.row));
  const roundSizes = new Map();
  for (const { cluster } of ordered) {
    roundSizes.set(cluster.round, (roundSizes.get(cluster.round) ?? 0) + 1);
  }
  const seen = new Map();
  for (const { row, cluster } of ordered) {
    const index = seen.get(cluster.round) ?? 0;
    seen.set(cluster.round, index + 1);
    const size = roundSizes.get(cluster.round);
    row.round =
      size > SPLIT_ABOVE ? `${cluster.round}${index < Math.ceil(size / 2) ? "a" : "b"}` : String(cluster.round);
  }
  return ordered.map(({ row }) => row);
}

// [{part, count}] for rows already in table order; an array, never an object
// keyed by part (integer-like keys would enumerate before `1a`).
function roundCounts(rows) {
  const counts = [];
  for (const row of rows) {
    const last = counts[counts.length - 1];
    if (last && last.part === row.round) {
      last.count++;
    } else {
      counts.push({ part: row.round, count: 1 });
    }
  }
  return counts;
}

// ---------------------------------------------------------------- neighbors and inbound

function titleTokens(title) {
  return new Set(
    title
      .toLowerCase()
      .split(/\W+/)
      .filter((token) => token.length >= TOKEN_MIN),
  );
}

// For each issue, the NEIGHBOR_COUNT other issues with the largest title-token
// overlap above zero, ties by id. A hint for the recommender, never a verdict.
function neighborsOf(rows) {
  const tokens = rows.map((row) => ({ id: row.id, set: titleTokens(row.title ?? "") }));
  const map = new Map();
  for (const self of tokens) {
    const scored = [];
    for (const other of tokens) {
      if (other === self) {
        continue;
      }
      let overlap = 0;
      for (const token of self.set) {
        if (other.set.has(token)) {
          overlap++;
        }
      }
      if (overlap > 0) {
        scored.push({ id: other.id, overlap });
      }
    }
    scored.sort((a, b) => b.overlap - a.overlap || byId(a, b));
    map.set(self.id, scored.slice(0, NEIGHBOR_COUNT));
  }
  return map;
}

function markdownFilesUnder(root, rel, found) {
  let entries;
  try {
    entries = fs.readdirSync(path.join(root, rel), { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") {
      return;
    }
    throw new Error(`cannot read ${rel}: ${error.code}`);
  }
  for (const entry of entries) {
    const child = `${rel}/${entry.name}`;
    if (entry.isDirectory()) {
      markdownFilesUnder(root, child, found);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      found.push(child);
    }
  }
}

// The living documents of the working tree, repository-relative with forward
// slashes: *.md under the LIVING_TREES, docs/experience.md, and the *.md files
// at the repository root. Reports, decisions, and resolved issues are not read.
function livingDocuments(cwd) {
  const found = [];
  for (const tree of LIVING_TREES) {
    markdownFilesUnder(cwd, tree, found);
  }
  if (fs.existsSync(path.join(cwd, "docs", "experience.md"))) {
    found.push("docs/experience.md");
  }
  for (const entry of fs.readdirSync(cwd, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".md")) {
      found.push(entry.name);
    }
  }
  return [...new Set(found)].sort();
}

// For each issue, the living documents whose text contains the issue's
// repository-relative path, a link or plain text alike; never the issue's own file.
function inboundOf(rows, cwd) {
  const documents = livingDocuments(cwd).map((doc) => ({
    doc,
    text: toLf(fs.readFileSync(path.join(cwd, doc), "utf8")),
  }));
  const map = new Map();
  for (const row of rows) {
    const own = row.path.replace(/\\/g, "/");
    map.set(
      row.id,
      documents.filter(({ doc, text }) => doc !== own && text.includes(own)).map(({ doc }) => doc),
    );
  }
  return map;
}

// ---------------------------------------------------------------- the tables

// A markdown table cell: every `|` written `\|` (a backslash before it is
// doubled so the escape holds) and line breaks made spaces.
function escapeCell(text) {
  return String(text)
    .replace(/\s*\n\s*/g, " ")
    .replace(/(\\*)\|/g, (_all, slashes) => `${slashes}${slashes}\\|`);
}

function cell(text) {
  const escaped = escapeCell(text);
  return escaped === "" ? "—" : escaped;
}

function goneCell(row) {
  return row.items
    .filter((item) => item.state === "gone")
    .map((item) => {
      const needle = item.text.replace(/\s+/g, " ").trim();
      return `${needle} → ${item.removedBy ? item.removedBy.subject : "no commit found"}`;
    })
    .map((text) => escapeCell(text))
    .join("<br>");
}

function renderTable(part, rows, meta) {
  const tally = { alive: 0, gone: 0, partly: 0, none: 0 };
  for (const row of rows) {
    tally[row.verdict]++;
  }
  const header =
    "| id | dir | sev | verdict | a/g/n | cluster | title | gone items (needle → subject) | neighbors | inbound |";
  const lines = [
    `Liveness — round ${part} — ref ${meta.ref}, ${meta.date} — alive ${tally.alive}, gone ${tally.gone}, partly ${tally.partly}, none ${tally.none}`,
    "",
    "Columns: a/g/n counts items alive, gone and partly (a path whose line hint is past the file's end); n is not the verdict none of line 1.",
    "",
    header,
    `|${" --- |".repeat(10)}`,
  ];
  for (const row of rows) {
    const cells = [
      cell(row.id),
      cell(row.dir),
      cell(row.severity),
      cell(row.verdict),
      cell(`${row.counts.alive}/${row.counts.gone}/${row.counts.none}`),
      cell(row.cluster),
      cell([...row.title].slice(0, TITLE_CUT).join("")),
      goneCell(row) || "—",
      cell(row.neighbors.map((n) => `${n.id} (${n.overlap})`).join(", ")),
      cell(row.inbound.join(", ")),
    ];
    lines.push(`| ${cells.join(" | ")} |`);
  }
  return `${lines.join("\n")}\n`;
}

// ---------------------------------------------------------------- the run

function pathText(token, hint) {
  if (!hint) {
    return token;
  }
  return hint.to === hint.from ? `${token}:${hint.from}` : `${token}:${hint.from}-${hint.to}`;
}

function localDate(now) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function analyze({ ref, docs, cwd }) {
  const started = Date.now();
  git(["rev-parse", "--verify", `${ref}^{tree}`], cwd);
  const docsDir = path.resolve(cwd, docs);
  if (!fs.existsSync(docsDir) || !fs.statSync(docsDir).isDirectory()) {
    throw new Error(`docs directory not found: ${docs}`);
  }
  const issues = readPile(docsDir, docs);
  const tree = loadTree(ref, cwd);

  const quoteTraces = new Map();
  let deletions = null;
  const rows = issues.map((issue) => {
    const items = [];
    for (const quote of issue.quotes) {
      const result = checkQuote(quote, tree);
      let removedBy = null;
      if (result.state === "gone") {
        if (!quoteTraces.has(quote)) {
          quoteTraces.set(quote, traceQuote(quote, ref, cwd));
        }
        removedBy = quoteTraces.get(quote);
      }
      items.push({ kind: "quote", text: quote, state: result.state, foundIn: result.foundIn ?? null, removedBy });
    }
    for (const { token, hint } of issue.paths) {
      const result = checkPath(token, hint, tree);
      let removedBy = null;
      if (result.state === "gone") {
        deletions ??= loadDeletions(ref, cwd);
        removedBy = tracePath(token, deletions);
      }
      items.push({
        kind: "path",
        text: pathText(token, hint),
        state: result.state,
        foundIn: result.foundIn ?? null,
        removedBy,
      });
    }
    const { verdict, counts } = verdictOf(items);
    return {
      id: issue.id,
      dir: issue.dir,
      path: issue.path,
      title: issue.title,
      severity: issue.severity,
      created: issue.created,
      source: issue.source,
      sourceKind: issue.sourceKind,
      citesExp: issue.citesExp,
      cluster: clusterOf(issue.title),
      round: "",
      verdict,
      counts,
      items,
      neighbors: [],
      inbound: [],
    };
  });
  const ordered = assignRounds(rows);
  const neighbors = neighborsOf(ordered);
  const inbound = inboundOf(ordered, cwd);
  for (const row of ordered) {
    row.neighbors = neighbors.get(row.id);
    row.inbound = inbound.get(row.id);
  }

  const verdicts = { alive: 0, gone: 0, partly: 0, none: 0 };
  const clusters = Object.fromEntries(CLUSTERS.map((cluster) => [cluster.name, 0]));
  for (const row of ordered) {
    verdicts[row.verdict]++;
    clusters[row.cluster]++;
  }
  const rounds = roundCounts(ordered);
  const wallSeconds = Number(((Date.now() - started) / 1000).toFixed(1));
  return {
    rows: ordered,
    meta: { ref, date: localDate(new Date()), total: ordered.length, verdicts, clusters, rounds, wallSeconds },
  };
}

function oneLine(message) {
  return String(message).split("\n")[0].trim();
}

function main(argv, io) {
  try {
    const args = parseArgs(argv);
    const outDir = path.resolve(io.cwd, args.out);
    try {
      fs.mkdirSync(outDir, { recursive: true });
    } catch (error) {
      throw new Error(`cannot create --out directory: ${error.code || oneLine(error.message)}`);
    }
    const { rows, meta } = analyze({ ref: args.ref, docs: args.docs, cwd: io.cwd });
    fs.writeFileSync(path.join(outDir, "liveness.json"), `${JSON.stringify([{ meta }, ...rows], null, 2)}\n`);
    for (const { part } of meta.rounds) {
      const inRound = rows.filter((row) => row.round === part);
      fs.writeFileSync(path.join(outDir, `liveness-R${part}.md`), renderTable(part, inRound, meta));
    }
    const v = meta.verdicts;
    io.stdout.write(`verdicts: alive ${v.alive}, gone ${v.gone}, partly ${v.partly}, none ${v.none}\n`);
    io.stdout.write(`rounds: ${meta.rounds.map((r) => `${r.part} ${r.count}`).join(", ")}\n`);
    io.stdout.write(`wall: ${meta.wallSeconds.toFixed(1)} s\n`);
    return 0;
  } catch (error) {
    io.stderr.write(`${oneLine(error.message)}\n`);
    return 1;
  }
}

module.exports = {
  CLUSTERS,
  parseArgs,
  normalize,
  parseIssue,
  extractQuotes,
  extractPathTokens,
  loadTree,
  checkQuote,
  checkPath,
  traceQuote,
  loadDeletions,
  tracePath,
  verdictOf,
  termMatches,
  clusterOf,
  assignRounds,
  roundCounts,
  neighborsOf,
  inboundOf,
  escapeCell,
  renderTable,
  analyze,
  main,
};

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2), {
    cwd: process.cwd(),
    stdout: process.stdout,
    stderr: process.stderr,
  });
}
