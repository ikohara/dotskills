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
      verdict,
      counts,
      items,
    };
  });
  rows.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  const verdicts = { alive: 0, gone: 0, partly: 0, none: 0 };
  for (const row of rows) {
    verdicts[row.verdict]++;
  }
  const wallSeconds = Number(((Date.now() - started) / 1000).toFixed(1));
  return { rows, meta: { ref, date: localDate(new Date()), total: rows.length, verdicts, wallSeconds } };
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
    const v = meta.verdicts;
    io.stdout.write(`verdicts: alive ${v.alive}, gone ${v.gone}, partly ${v.partly}, none ${v.none}\n`);
    io.stdout.write(`wall: ${meta.wallSeconds.toFixed(1)} s\n`);
    return 0;
  } catch (error) {
    io.stderr.write(`${oneLine(error.message)}\n`);
    return 1;
  }
}

module.exports = {
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
