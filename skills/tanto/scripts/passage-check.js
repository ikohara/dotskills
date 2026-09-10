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

const USAGE = "Usage: passage-check.js <lint|replay|diff|verify> --plan <path> [--base <ref>] [--task <N>]";

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
 * every outcome. `execSync`'s stdout-only return value leaves a succeeding
 * command's stderr with nowhere to go but the parent's own stderr -- pure
 * noise, out of order and detached from the fence it belongs to -- so this
 * uses `spawnSync` instead, whose result exposes both streams regardless of
 * exit status, and concatenates them the way a caught `execSync` failure
 * already would.
 */
function runShell(command, cwd) {
  const result = spawnSync("bash", ["-c", command], { cwd, encoding: "utf8" });
  return `${result.stdout || ""}${result.stderr || ""}`;
}

/**
 * Reconstruct the plan against its merge base: copy the base blobs to a
 * temporary tree, apply every passage, re-run the anchors, run the plan's
 * commands, and sweep for residual `O` needles. Never touches the working
 * tree. Returns { ok, tree, failures, residuals, commands }. Throws on a
 * broken invocation -- an unresolvable `base` foremost among them -- which
 * the caller reports as exit 2.
 */
function replayPlan(parsed, base, options = {}) {
  const cwd = options.cwd || process.cwd();

  try {
    execFileSync("git", ["-C", cwd, "rev-parse", "--verify", `${base}^{commit}`], { encoding: "utf8" });
  } catch {
    throw new Error(`could not resolve --base '${base}'`);
  }

  const tree = fs.mkdtempSync(path.join(os.tmpdir(), "passage-check-replay-"));
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
        : /passage-check\.js\s+verify\b/.test(fence.command)
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

  let result;
  try {
    result = replayPlan(parsed, values.base, { cwd: process.cwd() });
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

  process.stderr.write(`${USAGE}\n`);
  return 2;
}

module.exports = { normalize, parsePlan, lintPlan, replayPlan, main };

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}
