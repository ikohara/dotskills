// No shebang: this file is always invoked as `node <path>`. Not for a
// line-ending reason -- `.gitattributes` pins `*.js` to `eol=lf` -- but
// because the runtime text spells the command
// `node "$TANTO/scripts/passage-check.js"`, and a reader who is setting
// `$TANTO` needs the interpreter named rather than implied.

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");
const { parseArgs } = require("node:util");

const USAGE =
  "Usage: passage-check.js <lint|replay|diff|verify|sections|frame|boundary> [--plan <path>] [--file <path>] [--base <ref>] [--task <N>] [--stage 1|2] [<heading>...]";

// A lead's id-body is either `<task>.<ordinal>` or a `<...>` placeholder.
const ID_BODY = "(\\d+\\.\\d+|<[^>]*>)";
const LEAD_START_RE = new RegExp(`^\\*\\*([PAOW])${ID_BODY}\\*\\* \`([^\`]*)\`(?: — (.*))?$`);
const CONTINUATION_RE = new RegExp(`^\\*\\*P${ID_BODY} →\\*\\*$`);
const TASK_HEADING_RE = /^#{2,3} Task (\d+)\b/;
const CREATED_RE = /^created: (.+)$/;
const CITED_ID_RE = /\b[PAOW]\d+\.\d+\b/g;

const REPLACE_RE = /^replace exactly (?:these|this) (\d+) lines?$/;
const REPLACE_ALL_RE = /^replace all (\d+) occurrences? of (?:these|this) (\d+) lines?$/;
const INSERT_AFTER_RE = /^insert after (?:these|this) (\d+) lines?$/;
const INSERT_BEFORE_RE = /^insert before (?:these|this) (\d+) lines?$/;
const WHOLE_FILE_RE = /^new file, (\d+) lines?$/;
const ANCHOR_FULL_RE = /^`([^`]*)` — before: (.+), after: (.+)$/;
const ANCHOR_PARTIAL_RE = /^`([^`]*)` — before: (.+)$/;

/** CRLF to LF. Every comparison, search and line count runs on the result. */
function normalize(text) {
  return text.replace(/\r\n/g, "\n");
}

/**
 * Read the fence starting at or after `start` (blank lines are skipped
 * first). Returns { content, nextIndex } or null when no fence opens there,
 * or it never closes.
 */
function readFence(lines, start) {
  let k = start;
  while (k < lines.length && lines[k] === "") k++;
  if (k >= lines.length) return null;
  const open = lines[k].match(/^(`{3,})/);
  if (!open) return null;
  const fenceLen = open[1].length;
  const content = [];
  for (let m = k + 1; m < lines.length; m++) {
    const line = lines[m];
    if (/^`{3,}$/.test(line) && line.length >= fenceLen) {
      return { content, nextIndex: m + 1 };
    }
    content.push(line);
  }
  return null;
}

function idOf(kind, idBody) {
  return `${kind}${idBody}`;
}

function taskOrdinalOf(idBody) {
  const [task, ordinal] = idBody.split(".").map(Number);
  return { task, ordinal };
}

/**
 * Match a P-lead's remainder against the four passage shapes. Returns
 * { shape, count, occurrences } or null when none match.
 */
function matchPassageShape(remainder) {
  if (!remainder) return null;
  let m = remainder.match(REPLACE_RE);
  if (m) return { shape: "replace", count: Number(m[1]), occurrences: null };
  m = remainder.match(REPLACE_ALL_RE);
  if (m) return { shape: "replace-all", count: Number(m[2]), occurrences: Number(m[1]) };
  m = remainder.match(INSERT_AFTER_RE);
  if (m) return { shape: "insert-after", count: Number(m[1]), occurrences: null };
  m = remainder.match(INSERT_BEFORE_RE);
  if (m) return { shape: "insert-before", count: Number(m[1]), occurrences: null };
  return null;
}

/** Read a plan. Returns { blocks, created, citations, taskHeadings }. */
function parsePlan(text) {
  const lines = normalize(text).split("\n");

  // Which task body (if any) each line falls under. A lead is resolved only
  // inside the text under a `### Task <n>` or `## Task <n>` heading; any
  // other heading in between does not close that task's body.
  let currentTask = null;
  const lineTask = new Array(lines.length).fill(null);
  const taskHeadings = [];
  for (let i = 0; i < lines.length; i++) {
    const heading = lines[i].match(TASK_HEADING_RE);
    if (heading) {
      currentTask = Number(heading[1]);
      taskHeadings.push(currentTask);
    }
    lineTask[i] = currentTask;
  }

  // Fenced code, at any backtick count, so a lead-shaped fixture string
  // quoted inside a documentation fence is never read as a block, and its
  // ids are never read as citations.
  const inFence = new Array(lines.length).fill(false);
  {
    let fenceLen = 0;
    for (let i = 0; i < lines.length; i++) {
      if (fenceLen === 0) {
        const open = lines[i].match(/^(`{3,})/);
        if (open) {
          fenceLen = open[1].length;
          inFence[i] = true;
        }
        continue;
      }
      inFence[i] = true;
      if (/^`{3,}$/.test(lines[i]) && lines[i].length >= fenceLen) {
        fenceLen = 0;
      }
    }
  }

  const blocks = [];
  const malformedLeads = [];
  const leadLine = new Array(lines.length).fill(false);

  let i = 0;
  while (i < lines.length) {
    if (inFence[i]) {
      i++;
      continue;
    }
    const lead = lines[i].match(LEAD_START_RE);
    if (!lead) {
      i++;
      continue;
    }
    const [, kind, idBody, content, remainder] = lead;
    leadLine[i] = true;

    if (idBody.startsWith("<") || content.startsWith("<")) {
      // A lead whose id or path is a placeholder is documentation.
      i++;
      continue;
    }
    if (lineTask[i] === null) {
      // A lead outside every task body is not resolved.
      i++;
      continue;
    }

    const { task, ordinal } = taskOrdinalOf(idBody);
    const line = i + 1;

    if (kind === "O") {
      blocks.push({
        kind: "O",
        id: idOf(kind, idBody),
        task,
        ordinal,
        path: null,
        shape: "old-value",
        count: null,
        old: null,
        new: null,
        command: null,
        before: null,
        after: null,
        needle: content,
        note: remainder || "",
        line,
      });
      i++;
      continue;
    }

    if (kind === "A") {
      const full = remainder?.match(ANCHOR_FULL_RE);
      const partial = !full && remainder?.match(ANCHOR_PARTIAL_RE);
      if (!full && !partial) {
        malformedLeads.push({ id: idOf(kind, idBody), line });
        i++;
        continue;
      }
      const [, command, before, after] = full || partial;
      blocks.push({
        kind: "A",
        id: idOf(kind, idBody),
        task,
        ordinal,
        path: content,
        shape: "anchor",
        count: null,
        old: null,
        new: null,
        command,
        before,
        after: full ? after : null,
        needle: null,
        note: null,
        line,
      });
      i++;
      continue;
    }

    if (kind === "W") {
      const wf = remainder?.match(WHOLE_FILE_RE);
      if (!wf) {
        malformedLeads.push({ id: idOf(kind, idBody), line });
        i++;
        continue;
      }
      const fence = readFence(lines, i + 1);
      if (!fence) {
        malformedLeads.push({ id: idOf(kind, idBody), line });
        i++;
        continue;
      }
      blocks.push({
        kind: "W",
        id: idOf(kind, idBody),
        task,
        ordinal,
        path: content,
        shape: "whole-file",
        count: Number(wf[1]),
        old: null,
        new: fence.content,
        command: null,
        before: null,
        after: null,
        needle: null,
        note: null,
        line,
      });
      i = fence.nextIndex;
      continue;
    }

    // kind === 'P'
    const matched = matchPassageShape(remainder);
    if (!matched) {
      malformedLeads.push({ id: idOf(kind, idBody), line });
      i++;
      continue;
    }
    const { shape, count, occurrences } = matched;

    const oldFence = readFence(lines, i + 1);
    if (!oldFence) {
      malformedLeads.push({ id: idOf(kind, idBody), line });
      i++;
      continue;
    }
    let j = oldFence.nextIndex;
    while (j < lines.length && lines[j] === "") j++;
    const cont = lines[j]?.match(CONTINUATION_RE);
    if (!cont || cont[1] !== idBody) {
      malformedLeads.push({ id: idOf(kind, idBody), line });
      i = oldFence.nextIndex;
      continue;
    }
    leadLine[j] = true;
    const newFence = readFence(lines, j + 1);
    if (!newFence) {
      malformedLeads.push({ id: idOf(kind, idBody), line });
      i = j + 1;
      continue;
    }

    blocks.push({
      kind: "P",
      id: idOf(kind, idBody),
      task,
      ordinal,
      path: content,
      shape,
      count,
      old: oldFence.content,
      new: newFence.content,
      command: null,
      before: null,
      after: null,
      needle: null,
      note: null,
      line,
      occurrences,
    });
    i = newFence.nextIndex;
  }

  // Citations: ids mentioned outside a lead line and outside fenced code.
  const citations = [];
  for (let li = 0; li < lines.length; li++) {
    if (inFence[li] || leadLine[li]) continue;
    for (const m of lines[li].matchAll(CITED_ID_RE)) {
      citations.push(m[0]);
    }
  }

  const created = [];
  for (const line of lines) {
    const m = line.match(CREATED_RE);
    if (m) created.push(m[1].trim());
  }

  return { blocks, created, citations, taskHeadings, malformedLeads, lines };
}

/** Check a parsed plan against itself. Returns Problem[]; empty means clean. */
function lintPlan(parsed) {
  const problems = [];
  const push = (code, id, message) => problems.push({ code, id, message });

  if (parsed.taskHeadings.length === 0) {
    push("no-task-headings", null, "the plan carries no `### Task <n>` or `## Task <n>` heading");
  }

  for (const bad of parsed.malformedLeads) {
    push("malformed-lead", bad.id, `line ${bad.line} does not match a recognized lead shape`);
  }

  for (const block of parsed.blocks) {
    if (block.kind === "P") {
      if (block.count !== block.old.length) {
        push("count-mismatch", block.id, `declared ${block.count}, actual ${block.old.length}`);
      }
    } else if (block.kind === "W") {
      if (block.count !== block.new.length) {
        push("count-mismatch", block.id, `declared ${block.count}, actual ${block.new.length}`);
      }
    } else if (block.kind === "A" && block.after === null) {
      push("anchor-missing-value", block.id, "the anchor states no `after:` value");
    }
  }

  const seen = new Map();
  for (const block of parsed.blocks) {
    seen.set(block.id, (seen.get(block.id) || 0) + 1);
  }
  for (const [id, count] of seen) {
    if (count > 1) push("duplicate-id", id, `id appears ${count} times`);
  }

  const blockIds = new Set(parsed.blocks.map((b) => b.id));
  const citedMissing = new Set();
  for (const id of parsed.citations) {
    if (!blockIds.has(id) && !citedMissing.has(id)) {
      citedMissing.add(id);
      push("missing-block", id, "cited in prose but has no block");
    }
  }

  const anchorTasks = new Set(parsed.blocks.filter((b) => b.kind === "A").map((b) => b.task));
  for (const block of parsed.blocks) {
    if ((block.shape === "insert-after" || block.shape === "insert-before") && !anchorTasks.has(block.task)) {
      push("insertion-without-anchor", block.id, "an insertion carries no anchor step");
    }
  }

  const newText = parsed.blocks
    .filter((b) => b.kind === "P" && b.new)
    .map((b) => b.new.join("\n"))
    .join("\n");
  for (const block of parsed.blocks) {
    if (block.kind === "O" && block.needle && newText.includes(block.needle)) {
      push("needle-in-new-text", block.id, "the old value occurs in the plan's own new-passage text");
    }
  }

  return problems;
}

function runLint(values) {
  if (!values.plan) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  let text;
  try {
    text = fs.readFileSync(values.plan, "utf8");
  } catch (err) {
    process.stderr.write(`error reading plan: ${err.message}\n${USAGE}\n`);
    return 2;
  }
  const parsed = parsePlan(text);
  const problems = lintPlan(parsed);
  if (problems.length === 0) {
    console.log("lint: clean");
    return 0;
  }
  for (const problem of problems) {
    console.log(`${problem.code}: ${problem.id ?? "(plan)"} — ${problem.message}`);
  }
  return 1;
}

/** Detect the dominant line ending of raw, un-normalized text. */
function detectEnding(raw) {
  const crlf = (raw.match(/\r\n/g) || []).length;
  const totalNewlines = (raw.match(/\n/g) || []).length;
  return crlf > totalNewlines - crlf ? "\r\n" : "\n";
}

/** Restore an ending onto LF-normalized text. */
function applyEnding(text, ending) {
  return ending === "\r\n" ? text.replace(/\n/g, "\r\n") : text;
}

/** Split normalized text into a line array, remembering a trailing newline. */
function toLines(text) {
  const trailingNewline = text.endsWith("\n");
  const body = trailingNewline ? text.slice(0, -1) : text;
  return { lines: body === "" ? [] : body.split("\n"), trailingNewline };
}

function fromLines(lines, trailingNewline) {
  return lines.join("\n") + (trailingNewline ? "\n" : "");
}

/** Every start index at which `needle` occurs, in order, within `haystack`. */
function findMatches(haystack, needle) {
  const matches = [];
  if (needle.length === 0 || needle.length > haystack.length) return matches;
  for (let i = 0; i + needle.length <= haystack.length; i++) {
    let hit = true;
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) {
        hit = false;
        break;
      }
    }
    if (hit) matches.push(i);
  }
  return matches;
}

/** Apply a passage's old-to-new edit at its already-verified match indices. */
function applyPassage(lines, block, matches) {
  if (block.shape === "insert-after") {
    const idx = matches[0] + block.old.length;
    return [...lines.slice(0, idx), ...block.new, ...lines.slice(idx)];
  }
  if (block.shape === "insert-before") {
    const idx = matches[0];
    return [...lines.slice(0, idx), ...block.new, ...lines.slice(idx)];
  }
  // replace / replace-all: rewrite every match, back to front so earlier
  // indices stay valid.
  let result = lines;
  for (let k = matches.length - 1; k >= 0; k--) {
    const idx = matches[k];
    result = [...result.slice(0, idx), ...block.new, ...result.slice(idx + block.old.length)];
  }
  return result;
}

/**
 * The fenced `bash`/`console` blocks the plan wants replay to run, each with
 * the paragraph beginning `Expected:` that immediately follows it, when
 * there is one. A fence closes only on a backtick run of at least its own
 * length, so a plan's four-backtick command fences are not closed early by
 * the three-backtick fences its passage blocks use.
 */
function extractCommandFences(lines) {
  const fences = [];
  let i = 0;
  while (i < lines.length) {
    const open = lines[i].match(/^(`{3,})(\S*)$/);
    if (!open) {
      i++;
      continue;
    }
    const fenceLen = open[1].length;
    const info = open[2];
    const content = [];
    let j = i + 1;
    let closed = false;
    for (; j < lines.length; j++) {
      if (/^`{3,}$/.test(lines[j]) && lines[j].length >= fenceLen) {
        closed = true;
        break;
      }
      content.push(lines[j]);
    }
    const nextIndex = closed ? j + 1 : lines.length;
    if (info === "bash" || info === "console") {
      let k = nextIndex;
      while (k < lines.length && lines[k] === "") k++;
      let expectation = null;
      if (k < lines.length && lines[k].startsWith("Expected:")) {
        const para = [];
        while (k < lines.length && lines[k] !== "") {
          para.push(lines[k]);
          k++;
        }
        expectation = para.join("\n");
      }
      fences.push({ command: content.join("\n"), expectation });
    }
    i = nextIndex;
  }
  return fences;
}

// A `replay-skip:` declaration is anchored at column 0, the same way `lint`
// anchors a lead: the plan's own two declarations sit at column 0 inside a
// fenced Global Constraints block, while the string also turns up mid-line
// in a table cell and indented in a paragraph -- both excluded by the anchor.
const REPLAY_SKIP_RE = /^replay-skip: (.+?) — (.+)$/;

/** The `replay-skip:` patterns the plan declares in its Global Constraints. */
function extractReplaySkipPatterns(lines) {
  const patterns = [];
  for (const line of lines) {
    const m = line.match(REPLAY_SKIP_RE);
    if (m) patterns.push({ pattern: m[1], reason: m[2] });
  }
  return patterns;
}

function firstWord(command) {
  const m = command.trim().match(/^(\S+)/);
  return m ? m[1] : "";
}

/**
 * Run a shell command in Git Bash, capturing both stdout and stderr on
 * every outcome, plus the process's own exit status. `execSync`'s
 * stdout-only return value leaves a succeeding command's stderr with
 * nowhere to go but the parent's own stderr -- pure noise, out of order and
 * detached from the fence it belongs to -- so this uses `spawnSync`
 * instead, whose result exposes both streams regardless of exit status,
 * and concatenates them the way a caught `execSync` failure already would.
 */
function runShellResult(command, cwd) {
  const result = spawnSync("bash", ["-c", command], { cwd, encoding: "utf8" });
  return { output: `${result.stdout || ""}${result.stderr || ""}`, status: result.status };
}

/** `runShellResult`'s output alone, for a caller that never needs the status. */
function runShell(command, cwd) {
  return runShellResult(command, cwd).output;
}

/**
 * Reconstruct the plan against its merge base: copy the base blobs to a
 * temporary tree, apply every passage, re-run the anchors, run the plan's
 * commands, and sweep for residual `O` needles. Never touches the working
 * tree, and never removes its own tree -- a caller that wants the tree
 * cleaned up on every path, including a throw partway through this
 * function (a plan path absent at `base` throws well after the tree
 * already holds a partial copy), should pass `options.tree` and remove
 * that same path itself once this call returns or throws. Returns
 * { ok, tree, failures, residuals, commands }. Throws on a broken
 * invocation -- an unresolvable `base` or a plan path absent at `base`
 * foremost among them -- which the caller reports as exit 2.
 */
function replayPlan(parsed, base, options = {}) {
  const cwd = options.cwd || process.cwd();

  try {
    execFileSync("git", ["-C", cwd, "rev-parse", "--verify", `${base}^{commit}`], { encoding: "utf8" });
  } catch {
    throw new Error(`could not resolve --base '${base}'`);
  }

  const tree = options.tree || fs.mkdtempSync(path.join(os.tmpdir(), "passage-check-replay-"));
  const endings = new Map();

  // Step 1: copy each blob the plan names from `--base`, recording each
  // file's dominant line ending. A whole-file (`W`) block names a path that
  // does not exist at `base` yet, so it is created directly in step 2
  // instead of copied here.
  const basePaths = new Set();
  for (const block of parsed.blocks) {
    if (block.path && block.kind !== "W") basePaths.add(block.path);
  }
  const writtenPaths = new Set(basePaths);
  for (const p of basePaths) {
    const raw = execFileSync("git", ["-C", cwd, "show", `${base}:${p}`], { encoding: "utf8" });
    endings.set(p, detectEnding(raw));
    const dest = path.join(tree, p);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, raw, "utf8");
  }

  // Step 2: apply each passage in plan order, asserting the old block
  // occurs exactly once -- or, for a global replacement, exactly
  // `occurrences` times.
  const failures = [];
  for (const block of parsed.blocks) {
    if (block.kind === "W") {
      const dest = path.join(tree, block.path);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, `${block.new.join("\n")}\n`, "utf8");
      writtenPaths.add(block.path);
      continue;
    }
    if (block.kind !== "P") continue;
    const dest = path.join(tree, block.path);
    const { lines, trailingNewline } = toLines(normalize(fs.readFileSync(dest, "utf8")));
    const matches = findMatches(lines, block.old);
    const expected = block.shape === "replace-all" ? block.occurrences : 1;
    if (matches.length !== expected) {
      failures.push({
        code: "occurrence-count",
        id: block.id,
        message: `expected ${expected} occurrence${expected === 1 ? "" : "s"} of the old block, found ${matches.length}`,
      });
      continue;
    }
    const updated = applyPassage(lines, block, matches);
    const ending = endings.get(block.path) || "\n";
    fs.writeFileSync(dest, applyEnding(fromLines(updated, trailingNewline), ending), "utf8");
  }

  // Step 3: re-run each anchor against the applied copy and compare it with
  // its stated `after:` value.
  for (const block of parsed.blocks) {
    if (block.kind !== "A") continue;
    const actual = runShell(block.command, tree).trim();
    if (actual !== String(block.after).trim()) {
      failures.push({
        code: "anchor-after",
        id: block.id,
        message: `expected after: ${block.after}, got: ${actual}`,
      });
    }
  }

  // Step 4: run the plan's commands in order against that tree, skipping
  // what it cannot run. Neither a skip nor a differing output is a failure.
  const skipPatterns = extractReplaySkipPatterns(parsed.lines);
  const commands = [];
  for (const fence of extractCommandFences(parsed.lines)) {
    const skipReason =
      firstWord(fence.command) === "git"
        ? "a git command; the applied tree is not a git repository"
        : /passage-check\.js["']?\s+verify\b/.test(fence.command)
          ? "invokes passage-check verify, whose subject is the working tree, not the applied copy"
          : skipPatterns.find((s) => fence.command.includes(s.pattern))?.reason;

    if (skipReason) {
      commands.push({ command: fence.command, skipped: true, reason: skipReason });
      continue;
    }
    const output = runShell(fence.command, tree);
    if (fence.expectation === null) {
      commands.push({ command: fence.command, skipped: false, output, expectation: null, status: "no-expectation" });
      continue;
    }
    // Empty output is never a MATCH, even against an expectation it is
    // trivially a substring of: a false MATCH is the one result that stops
    // a human from looking, and the comparison is deliberately crude.
    const trimmedOutput = output.trim();
    const status = trimmedOutput !== "" && fence.expectation.trim().includes(trimmedOutput) ? "match" : "differs";
    commands.push({ command: fence.command, skipped: false, output, expectation: fence.expectation, status });
  }

  // Step 5: run every `O` needle against the applied tree and record every
  // residual hit. A hit is reported, never adjudicated.
  const treeText = [...writtenPaths]
    .map((p) => {
      try {
        return normalize(fs.readFileSync(path.join(tree, p), "utf8"));
      } catch {
        return "";
      }
    })
    .join("\n");
  const residuals = [];
  for (const block of parsed.blocks) {
    if (block.kind !== "O") continue;
    const hits = block.needle ? treeText.split(block.needle).length - 1 : 0;
    residuals.push({ id: block.id, needle: block.needle, hits });
  }

  return { ok: failures.length === 0, tree, failures, residuals, commands };
}

/** `replay --plan <path> --base <ref>`. Returns the process exit code. */
function runReplay(values) {
  if (!values.plan || !values.base) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  let text;
  try {
    text = fs.readFileSync(values.plan, "utf8");
  } catch (err) {
    process.stderr.write(`error reading plan: ${err.message}\n${USAGE}\n`);
    return 2;
  }
  const parsed = parsePlan(text);

  // Created here, not inside `replayPlan`, so this wrapper can always find
  // it to clean up below -- on a passing run, a failing one, or a throw
  // partway through `replayPlan` (a plan path absent at `base` throws from
  // `git show`, well after the tree already holds a partial copy; only an
  // unresolvable `--base` throws before any of that copying starts). Its
  // own try/catch keeps a broken invocation (e.g. no writable temp
  // directory) reported as exit 2 rather than an uncaught exception --
  // there is nothing to remove yet at this point, so no `finally` is
  // needed here.
  let tree;
  try {
    tree = fs.mkdtempSync(path.join(os.tmpdir(), "passage-check-replay-"));
  } catch (err) {
    process.stderr.write(`error: ${err.message}\n${USAGE}\n`);
    return 2;
  }
  try {
    let result;
    try {
      result = replayPlan(parsed, values.base, { cwd: process.cwd(), tree });
    } catch (err) {
      process.stderr.write(`error: ${err.message}\n${USAGE}\n`);
      return 2;
    }

    for (const failure of result.failures) {
      console.log(`${failure.code}: ${failure.id} — ${failure.message}`);
    }

    const skipped = result.commands.filter((c) => c.skipped);
    if (skipped.length > 0) {
      console.log(`skipped ${skipped.length} command${skipped.length === 1 ? "" : "s"}:`);
      for (const c of skipped) {
        console.log(`  skipped: ${c.command} — ${c.reason}`);
      }
    }
    for (const c of result.commands) {
      if (c.skipped) continue;
      if (c.status === "no-expectation") {
        console.log(`ran (no stated expectation): ${c.command}\n${c.output}`);
      } else {
        console.log(
          `${c.status.toUpperCase()}: ${c.command}\n  actual: ${c.output.trim()}\n  expected: ${c.expectation}`,
        );
      }
    }

    const residualHits = result.residuals.filter((r) => r.hits > 0).length;
    console.log(
      `${result.residuals.length} residual O needle${result.residuals.length === 1 ? "" : "s"} swept, ${residualHits} with hits:`,
    );
    for (const r of result.residuals) {
      console.log(`  ${r.id} \`${r.needle}\` — ${r.hits} occurrence${r.hits === 1 ? "" : "s"}`);
    }

    return result.ok ? 0 : 1;
  } finally {
    // A removal failure (e.g. a locked file on Windows) is not the
    // question the human ran `replay` to answer, and letting it escape
    // this `finally` would discard whatever this call was about to return
    // in favor of an uncaught exception instead. `maxRetries`/`retryDelay`
    // give a transient lock a moment to clear; if it still fails, swallow
    // it silently rather than compete with the adjudication output above.
    try {
      fs.rmSync(tree, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
    } catch {
      // Deliberately silent -- see above.
    }
  }
}

const DIFF_GIT_RE = /^diff --git a\/(.+) b\/(.+)$/;
const DIFF_MINUS_HEADER_RE = /^--- (a\/|\/dev\/null)/;
const DIFF_PLUS_HEADER_RE = /^\+\+\+ (b\/|\/dev\/null)/;

/**
 * Every added/removed content line of a `git diff` text, each with the path
 * of the file it belongs to. The path comes from the `diff --git a/... b/...`
 * header rather than the `+++`/`---` lines, so a deleted file (whose `+++` is
 * `/dev/null`) still carries a path for its removed lines.
 */
function parseDiffEntries(diffText) {
  const entries = [];
  let currentPath = null;
  for (const line of diffText.split("\n")) {
    const header = line.match(DIFF_GIT_RE);
    if (header) {
      currentPath = header[2];
      continue;
    }
    // File headers are matched precisely -- `^--- (a/|/dev/null)` and
    // `^\+\+\+ (b/|/dev/null)` -- rather than by a bare `startsWith("---")`
    // / `startsWith("+++")`, which would also swallow a removed `---` or an
    // added `+++` content line (a YAML frontmatter fence, a Markdown
    // thematic break) as if it were a header.
    if (
      DIFF_MINUS_HEADER_RE.test(line) ||
      DIFF_PLUS_HEADER_RE.test(line) ||
      line.startsWith("@@") ||
      line.startsWith("index ")
    ) {
      continue;
    }
    if (line.startsWith("+")) {
      entries.push({ path: currentPath, kind: "add", content: line.slice(1) });
    } else if (line.startsWith("-")) {
      entries.push({ path: currentPath, kind: "remove", content: line.slice(1) });
    }
  }
  return entries;
}

/** Every line that lies inside a fenced block of the plan, at any backtick count. */
function fencedLineSet(lines) {
  const set = new Set();
  let fenceLen = 0;
  for (const line of lines) {
    if (fenceLen === 0) {
      const open = line.match(/^(`{3,})/);
      if (open) fenceLen = open[1].length;
      continue;
    }
    if (/^`{3,}$/.test(line) && line.length >= fenceLen) {
      fenceLen = 0;
      continue;
    }
    set.add(line);
  }
  return set;
}

/**
 * The path `git diff` would print for `file`, relative to the repository
 * root with forward slashes, or null when `file` is absent or lies outside
 * the repository (a plan written to a temp directory, as the tests do).
 */
function repoRelativePath(cwd, file) {
  if (!file) return null;
  let top;
  try {
    top = execFileSync("git", ["-C", cwd, "rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
  const rel = path.relative(path.resolve(top), path.resolve(cwd, file));
  if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) return null;
  return rel.split(path.sep).join("/");
}

/**
 * Classify `git diff <base>` from the side opposite `replay`: every added
 * line outside a `created:` path must be text the plan literally quotes
 * (present as a line anywhere in the plan), and every removed line must fall
 * inside one of the plan's fenced blocks. Needs only the plan and `git` --
 * no scratch tree, no passage application -- so, unlike `replay`, it is
 * still there at the last boundary once the session that wrote the plan is
 * gone. Returns { ok, unaccountedAdded, unexplainedRemoved, exempt }. Throws
 * on a broken invocation -- an unresolvable `base` foremost -- which the
 * caller reports as exit 2.
 */
function diffPlan(parsed, base, options = {}) {
  const cwd = options.cwd || process.cwd();

  try {
    execFileSync("git", ["-C", cwd, "rev-parse", "--verify", `${base}^{commit}`], { encoding: "utf8" });
  } catch {
    throw new Error(`could not resolve --base '${base}'`);
  }

  const raw = execFileSync("git", ["-C", cwd, "diff", base], { encoding: "utf8" });
  // Strip CR before classifying: a CRLF working tree diffed against an LF
  // index carries CR bytes on the added lines, which no literal quote from
  // the plan will ever contain.
  const entries = parseDiffEntries(raw.replace(/\r/g, ""));

  // De-duplicate by path: the plan may state `created:` more than once for
  // the same path (this plan's own Global Constraints and instrument-spec
  // sections both declare it), and the exempted count must reflect paths,
  // not lines.
  const exempt = [...new Set(parsed.created)];
  const createdSet = new Set(exempt);

  // The plan's own path is outside what `diff` checks: no task writes it,
  // it is Sekkei's under Sekkei's own commit rule, and every answer to a
  // cold read is an edit to it after the base. Without this, each replaced
  // line of the plan is an unexplained removal at every later boundary,
  // because the plan never quotes its own previous text in a fence
  // (kisou-refresh bug report, 2026-09-11).
  const planPath = repoRelativePath(cwd, options.planPath);

  const quotedLines = new Set(parsed.lines);
  const fenced = fencedLineSet(parsed.lines);

  const unaccountedAdded = [];
  const unexplainedRemoved = [];
  for (const entry of entries) {
    if (entry.path && createdSet.has(entry.path)) continue;
    if (entry.path && planPath && entry.path === planPath) continue;
    if (entry.kind === "add") {
      if (!quotedLines.has(entry.content)) {
        unaccountedAdded.push({ path: entry.path, content: entry.content });
      }
    } else if (!fenced.has(entry.content)) {
      unexplainedRemoved.push({ path: entry.path, content: entry.content });
    }
  }

  return {
    ok: unaccountedAdded.length === 0 && unexplainedRemoved.length === 0,
    unaccountedAdded,
    unexplainedRemoved,
    exempt,
  };
}

/** `diff --plan <path> --base <ref>`. Returns the process exit code. */
function runDiff(values) {
  if (!values.plan || !values.base) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  let text;
  try {
    text = fs.readFileSync(values.plan, "utf8");
  } catch (err) {
    process.stderr.write(`error reading plan: ${err.message}\n${USAGE}\n`);
    return 2;
  }
  const parsed = parsePlan(text);

  let result;
  try {
    result = diffPlan(parsed, values.base, { cwd: process.cwd(), planPath: values.plan });
  } catch (err) {
    process.stderr.write(`error: ${err.message}\n${USAGE}\n`);
    return 2;
  }

  if (result.exempt.length > 0) {
    console.log(`${result.exempt.length} path${result.exempt.length === 1 ? "" : "s"} exempt as created:`);
    for (const p of result.exempt) {
      console.log(`  ${p}`);
    }
  }
  for (const added of result.unaccountedAdded) {
    console.log(`unaccounted-added: ${added.path ?? "(unknown path)"} — ${added.content}`);
  }
  for (const removed of result.unexplainedRemoved) {
    console.log(`unexplained-removed: ${removed.path ?? "(unknown path)"} — ${removed.content}`);
  }
  if (result.ok) {
    console.log("diff: clean");
  }
  return result.ok ? 0 : 1;
}

/**
 * Check task `taskNumber`'s new passages and anchors against the working
 * tree. Reads only the working tree -- no `--base`, no diffing; that is
 * `diff`'s job at the boundary. Returns { ok, failures, passageCount }: a
 * task whose body carries no `P` block -- for example one that touches only
 * a `created:` path, which has nothing pre-existing for a "new" passage to
 * be counted against -- reports `passageCount === 0`, which is a result and
 * not a failure.
 */
function verifyTask(parsed, taskNumber, options = {}) {
  const cwd = options.cwd || process.cwd();
  const failures = [];

  const passages = parsed.blocks.filter((b) => b.kind === "P" && b.task === taskNumber);

  // Group by target path and identical new text: a plan that states the
  // same replacement more than once means it that many times over. Each
  // block contributes its own declared occurrence count -- 1 for an
  // ordinary replace or insertion, or a replace-all block's own stated
  // `occurrences` (P12.4 in this branch's own plan is one such block,
  // alone in its group, declaring 4) -- and the group's expected total is
  // their sum.
  const groups = new Map();
  for (const block of passages) {
    const key = JSON.stringify([block.path, block.new]);
    let group = groups.get(key);
    if (!group) {
      group = { path: block.path, new: block.new, blocks: [] };
      groups.set(key, group);
    }
    group.blocks.push(block);
  }

  for (const group of groups.values()) {
    let lines;
    try {
      lines = toLines(normalize(fs.readFileSync(path.join(cwd, group.path), "utf8"))).lines;
    } catch {
      lines = [];
    }
    const matches = findMatches(lines, group.new);
    const expected = group.blocks.reduce((sum, b) => sum + (b.shape === "replace-all" ? b.occurrences : 1), 0);
    const id = group.blocks.map((b) => b.id).join(", ");
    if (matches.length === 0) {
      failures.push({ code: "passage-absent", id, message: `new passage not found in ${group.path}` });
    } else if (matches.length !== expected) {
      failures.push({
        code: "passage-count",
        id,
        message: `expected ${expected} occurrence${expected === 1 ? "" : "s"} of the new passage in ${group.path}, found ${matches.length}`,
      });
    }
  }

  const anchors = parsed.blocks.filter((b) => b.kind === "A" && b.task === taskNumber);
  for (const block of anchors) {
    const actual = runShell(block.command, cwd).trim();
    if (actual !== String(block.after).trim()) {
      failures.push({
        code: "anchor-after",
        id: block.id,
        message: `expected after: ${block.after}, got: ${actual}`,
      });
    }
  }

  return { ok: failures.length === 0, failures, passageCount: passages.length };
}

/** `verify --plan <path> --task <N>`. Returns the process exit code. */
function runVerify(values) {
  if (!values.plan || !values.task) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  const taskNumber = Number(values.task);
  if (!Number.isInteger(taskNumber)) {
    process.stderr.write(`invalid --task '${values.task}'\n${USAGE}\n`);
    return 2;
  }
  let text;
  try {
    text = fs.readFileSync(values.plan, "utf8");
  } catch (err) {
    process.stderr.write(`error reading plan: ${err.message}\n${USAGE}\n`);
    return 2;
  }
  const parsed = parsePlan(text);
  if (!parsed.taskHeadings.includes(taskNumber)) {
    process.stderr.write(`no such task in the plan: ${taskNumber}\n${USAGE}\n`);
    return 2;
  }
  const result = verifyTask(parsed, taskNumber, { cwd: process.cwd() });

  if (result.passageCount === 0) {
    console.log(`task ${taskNumber}: no passages`);
  } else if (result.ok) {
    console.log(`task ${taskNumber}: verify clean`);
  }
  for (const failure of result.failures) {
    console.log(`${failure.code}: ${failure.id} — ${failure.message}`);
  }

  return result.ok ? 0 : 1;
}

const HEADING_RE = /^(#{1,6}) +(.*)$/;

/** A line's heading depth and trimmed text, or null when it is not a heading. */
function headingOf(line) {
  const m = line.match(HEADING_RE);
  if (!m) return null;
  return { depth: m[1].length, text: m[2].trim() };
}

/** Every line that lies inside a fenced block, at any backtick count. */
function fenceFlags(lines) {
  const inFence = new Array(lines.length).fill(false);
  let fenceLen = 0;
  for (let i = 0; i < lines.length; i++) {
    if (fenceLen === 0) {
      const open = lines[i].match(/^(`{3,})/);
      if (open) {
        fenceLen = open[1].length;
        inFence[i] = true;
      }
      continue;
    }
    inFence[i] = true;
    if (/^`{3,}$/.test(lines[i]) && lines[i].length >= fenceLen) {
      fenceLen = 0;
    }
  }
  return inFence;
}

/** The index of the first heading whose text is `name`, or -1. */
function findSection(lines, inFence, name) {
  for (let i = 0; i < lines.length; i++) {
    if (inFence[i]) continue;
    const heading = headingOf(lines[i]);
    if (heading && heading.text === name) return i;
  }
  return -1;
}

/** The index one past the section headed at `start`. */
function sectionEnd(lines, inFence, start) {
  const depth = headingOf(lines[start]).depth;
  for (let i = start + 1; i < lines.length; i++) {
    if (inFence[i]) continue;
    const heading = headingOf(lines[i]);
    if (heading && heading.depth <= depth) return i;
  }
  return lines.length;
}

/**
 * Each named heading's line and body down to the next heading of the same or
 * higher depth, in the order `headings` gives. Returns { output, missing }:
 * `output` is the lines to print, in argument order; `missing` is every name
 * that heads no section.
 */
function sectionsOf(text, headings) {
  const { lines } = toLines(normalize(text));
  const inFence = fenceFlags(lines);

  const output = [];
  const missing = [];
  for (const name of headings) {
    const trimmedName = name.trim();
    const start = findSection(lines, inFence, trimmedName);
    if (start === -1) {
      missing.push(trimmedName);
      continue;
    }
    const end = sectionEnd(lines, inFence, start);
    output.push(...lines.slice(start, end));
  }
  return { output, missing };
}

/** `sections --file <path> <heading> [<heading>...]`. Returns the exit code. */
function runSections(values, headings) {
  if (!values.file || headings.length === 0) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  let text;
  try {
    text = fs.readFileSync(values.file, "utf8");
  } catch (err) {
    process.stderr.write(`error reading file: ${err.message}\n${USAGE}\n`);
    return 2;
  }
  const { output, missing } = sectionsOf(text, headings);
  if (output.length > 0) {
    console.log(output.join("\n"));
  }
  for (const name of missing) {
    process.stderr.write(`no section ${name}\n`);
  }
  return missing.length > 0 ? 1 : 0;
}

const TASK_TEXT_RE = /^Task (\d+)\b/;
const STEP_LINE_RE = /^- \[ \] \*\*Step/;

/**
 * Every task heading in the plan -- any heading of depth two or more whose
 * text is `Task`, a space and a number (issue-ac9d: a plan's tasks are not
 * always three hashes deep, and a rule that stops at the word `Task` alone
 * would also take the `## Tasks` heading every plan carries above them).
 * Each entry's `end` is the index one past the task's own body -- the next
 * heading at that depth or shallower, or the end of the plan -- and
 * `stepStart` is the index of the task's first `- [ ] **Step` line within
 * that body, or -1 when the task carries no step region.
 */
function planTasks(lines, inFence) {
  const tasks = [];
  for (let i = 0; i < lines.length; i++) {
    if (inFence[i]) continue;
    const heading = headingOf(lines[i]);
    if (!heading || heading.depth < 2) continue;
    const m = heading.text.match(TASK_TEXT_RE);
    if (!m) continue;
    const end = sectionEnd(lines, inFence, i);
    let stepStart = -1;
    for (let j = i + 1; j < end; j++) {
      if (inFence[j]) continue;
      if (STEP_LINE_RE.test(lines[j])) {
        stepStart = j;
        break;
      }
    }
    tasks.push({ number: Number(m[1]), headingIndex: i, end, stepStart });
  }
  return tasks;
}

/**
 * The default frame: every line outside a step region, each region replaced
 * by one `[steps: <n> lines]` line counting the region's own lines,
 * including its first `- [ ] **Step` line. What the `awk` this replaces
 * printed, on every plan whose tasks it recognized (issue-ac9d).
 */
function renderDefault(lines, tasks) {
  const regions = tasks
    .filter((t) => t.stepStart !== -1)
    .map((t) => ({ start: t.stepStart, end: t.end }))
    .sort((a, b) => a.start - b.start);
  const output = [];
  let i = 0;
  let r = 0;
  while (i < lines.length) {
    if (r < regions.length && i === regions[r].start) {
      output.push(`[steps: ${regions[r].end - regions[r].start} lines]`);
      i = regions[r].end;
      r++;
      continue;
    }
    output.push(lines[i]);
    i++;
  }
  return output;
}

const FRAME_STAGE1_SECTIONS = ["Global Constraints", "Batches", "How a batch is verified", "Self-Review"];

/**
 * Stage 1: every heading line of the plan, plus the whole body of each of
 * the four fixed sections the plan carries, in document order and each line
 * once. A section the plan does not carry is silently absent.
 */
function renderStage1(lines, inFence) {
  const include = new Set();
  for (let i = 0; i < lines.length; i++) {
    if (inFence[i]) continue;
    if (headingOf(lines[i])) include.add(i);
  }
  for (const name of FRAME_STAGE1_SECTIONS) {
    const start = findSection(lines, inFence, name);
    if (start === -1) continue;
    const end = sectionEnd(lines, inFence, start);
    for (let i = start; i < end; i++) include.add(i);
  }
  return [...include].sort((a, b) => a - b).map((i) => lines[i]);
}

/**
 * Stage 2: each task's heading through the line before its first step, then
 * one `[steps: <n> lines]` line. A task with no step region prints its head
 * alone.
 */
function renderStage2(lines, tasks) {
  const output = [];
  for (const task of tasks) {
    const headEnd = task.stepStart !== -1 ? task.stepStart : task.end;
    for (let i = task.headingIndex; i < headEnd; i++) output.push(lines[i]);
    if (task.stepStart !== -1) output.push(`[steps: ${task.end - task.stepStart} lines]`);
  }
  return output;
}

/**
 * Read a plan the way Kanri's cold read does (spec 8.2): the default output
 * collapses every task's step region to its line count; `stage` 1 or 2 reads
 * a coarser or finer frame; `task` reads one task whole, taking precedence
 * over `stage`. Returns { output, found }: `found` is false only when `task`
 * named a number no task heading carries, in which case `output` is empty.
 */
function framePlan(text, options = {}) {
  const stage = options.stage ?? null;
  const task = options.task ?? null;
  const { lines } = toLines(normalize(text));
  const inFence = fenceFlags(lines);
  const tasks = planTasks(lines, inFence);

  if (task !== null) {
    const match = tasks.find((t) => t.number === task);
    if (!match) return { output: [], found: false };
    return { output: lines.slice(match.headingIndex, match.end), found: true };
  }
  if (stage === 1) return { output: renderStage1(lines, inFence), found: true };
  if (stage === 2) return { output: renderStage2(lines, tasks), found: true };
  return { output: renderDefault(lines, tasks), found: true };
}

/** `frame --plan <path> [--stage 1|2] [--task <N>]`. Returns the exit code. */
function runFrame(values) {
  if (!values.plan) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  let stage = null;
  if (values.stage !== undefined) {
    stage = Number(values.stage);
    if (stage !== 1 && stage !== 2) {
      process.stderr.write(`invalid --stage '${values.stage}'\n${USAGE}\n`);
      return 2;
    }
  }
  const task = values.task !== undefined ? Number(values.task) : null;
  let text;
  try {
    text = fs.readFileSync(values.plan, "utf8");
  } catch (err) {
    process.stderr.write(`error reading plan: ${err.message}\n${USAGE}\n`);
    return 2;
  }
  const result = framePlan(text, { stage, task });
  if (task !== null && !result.found) {
    process.stderr.write(`no such task in the plan: ${task}\n${USAGE}\n`);
    return 2;
  }
  if (result.output.length > 0) {
    console.log(result.output.join("\n"));
  }
  return 0;
}

/**
 * The plan's own verification list, run at a batch boundary (spec 8.3):
 * `git status --porcelain` first, as check 1 -- passing when its own
 * trimmed output is empty, the one check whose exit status is not what
 * decides it -- then every fenced `bash`/`console` block under the plan's
 * How a batch is verified heading, numbered from 2 in document order.
 * Unlike `replay`, this runs in the working tree rather than a scratch
 * copy, so only a `replay-skip:` marker is honored; there is no git command
 * or `verify` invocation to exempt for a tree that is not a git repository,
 * because this one is. Returns { ok, checks, skipped }: `checks` is
 * { n, command, expectation, output, status }, `status` one of `"pass"`
 * and `"fail"`; `skipped` is { command, reason }; `ok` is true when every
 * check passed. Throws when the plan carries no How a batch is verified
 * heading, which the CLI wrapper reports as exit 2.
 */
function boundaryPlan(parsed, options = {}) {
  const cwd = options.cwd || process.cwd();
  const inFence = fenceFlags(parsed.lines);
  const start = findSection(parsed.lines, inFence, "How a batch is verified");
  if (start === -1) {
    throw new Error("the plan carries no How a batch is verified heading");
  }
  const end = sectionEnd(parsed.lines, inFence, start);
  const fences = extractCommandFences(parsed.lines.slice(start, end));
  const skipPatterns = extractReplaySkipPatterns(parsed.lines);

  const checks = [];
  const skipped = [];

  const statusOutput = runShell("git status --porcelain", cwd);
  checks.push({
    n: 1,
    command: "git status --porcelain",
    expectation: null,
    output: statusOutput,
    status: statusOutput.trim() === "" ? "pass" : "fail",
  });

  let n = 2;
  for (const fence of fences) {
    const skip = skipPatterns.find((s) => fence.command.includes(s.pattern));
    if (skip) {
      skipped.push({ command: fence.command, reason: skip.reason });
      continue;
    }
    const { output, status } = runShellResult(fence.command, cwd);
    checks.push({
      n,
      command: fence.command,
      expectation: fence.expectation,
      output,
      status: status === 0 ? "pass" : "fail",
    });
    n++;
  }

  return { ok: checks.every((c) => c.status === "pass"), checks, skipped };
}

/** `boundary --plan <path>`. Returns the process exit code. */
function runBoundary(values) {
  if (!values.plan) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  let text;
  try {
    text = fs.readFileSync(values.plan, "utf8");
  } catch (err) {
    process.stderr.write(`error reading plan: ${err.message}\n${USAGE}\n`);
    return 2;
  }
  const parsed = parsePlan(text);

  let result;
  try {
    result = boundaryPlan(parsed, { cwd: process.cwd() });
  } catch (err) {
    process.stderr.write(`error: ${err.message}\n${USAGE}\n`);
    return 2;
  }

  for (const s of result.skipped) {
    console.log(`skipped: ${s.command} — ${s.reason}`);
  }
  for (const check of result.checks) {
    const firstLine = check.command.split("\n")[0];
    console.log(`${check.status} ${check.n}: ${firstLine}`);
    if (check.status === "fail") {
      console.log(check.output);
    }
  }

  return result.ok ? 0 : 1;
}

/** Dispatch a subcommand. Returns the process exit code. */
function main(argv) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        plan: { type: "string" },
        base: { type: "string" },
        task: { type: "string" },
        file: { type: "string" },
        stage: { type: "string" },
      },
    });
  } catch (err) {
    process.stderr.write(`${err.message}\n${USAGE}\n`);
    return 2;
  }

  const [subcommand] = parsed.positionals;
  if (subcommand === "lint") {
    return runLint(parsed.values);
  }
  if (subcommand === "replay") {
    return runReplay(parsed.values);
  }
  if (subcommand === "diff") {
    return runDiff(parsed.values);
  }
  if (subcommand === "verify") {
    return runVerify(parsed.values);
  }
  if (subcommand === "sections") {
    return runSections(parsed.values, parsed.positionals.slice(1));
  }
  if (subcommand === "frame") {
    return runFrame(parsed.values);
  }
  if (subcommand === "boundary") {
    return runBoundary(parsed.values);
  }

  process.stderr.write(`${USAGE}\n`);
  return 2;
}

module.exports = {
  normalize,
  parsePlan,
  lintPlan,
  replayPlan,
  diffPlan,
  verifyTask,
  sectionsOf,
  framePlan,
  boundaryPlan,
  main,
};

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}
