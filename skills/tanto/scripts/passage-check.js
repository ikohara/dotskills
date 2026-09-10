// No shebang: this file is always invoked as `node <path>`. Not for a
// line-ending reason -- `.gitattributes` pins `*.js` to `eol=lf` -- but
// because the runtime text spells the command
// `node "$TANTO/scripts/passage-check.js"`, and a reader who is setting
// `$TANTO` needs the interpreter named rather than implied.

const fs = require("node:fs");
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

  return { blocks, created, citations, taskHeadings, malformedLeads };
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

  process.stderr.write(`${USAGE}\n`);
  return 2;
}

module.exports = { normalize, parsePlan, lintPlan, main };

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}
