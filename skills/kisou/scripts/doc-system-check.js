// The doc-system half of `kisou migrate`: compare an installed doc-system
// against the bundled templates expanded for one `case`, report the
// differences (`check`), or write the accepted ones (`apply --items`).
//
// Node 22 or later. Standard library only.
//
// No shebang: this file is always invoked as `node <path>`, because the
// runtime text spells the command `node "$KISOU/scripts/doc-system-check.js"`
// and a reader who is setting `$KISOU` needs the interpreter named rather
// than implied.

// biome-ignore lint/suspicious/noRedundantUseStrict: CommonJS script, not an ES module
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { parseArgs } = require("node:util");

const USAGE =
  "Usage: doc-system-check.js <check|apply> --docs <dir> [--templates <dir>] [--case snake_case|PascalCase] [--items <n,...>]";

const TYPES = ["experience", "design", "decisions", "issues", "notes", "reports"];

// `docs -> Documents`, `src -> Source`, every other name title-cased. The same
// names SKILL.md Step 2 lists.
const PASCAL = { docs: "Documents", src: "Source" };

/** Strip a BOM, fold CRLF, collapse trailing newlines to one. */
function normalize(text) {
  let result = text;
  if (result.charCodeAt(0) === 0xfeff) {
    result = result.slice(1);
  }
  result = result.replace(/\r\n/g, "\n");
  result = result.replace(/\n*$/, "\n");
  return result;
}

/** One `{{name}}` value under one case convention. */
function expandName(name, kase) {
  if (kase === "PascalCase") {
    if (Object.hasOwn(PASCAL, name)) {
      return PASCAL[name];
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return name;
}

/** Every `{{name}}` in a template body. */
function expandTemplate(text, kase) {
  return text.replace(/\{\{(\w+)\}\}/g, (_match, name) => expandName(name, kase));
}

/** The seven { type, template, target } entries, in report order. */
function targetSet(kase) {
  const entries = [{ type: "root", template: "AGENTS.md", target: "AGENTS.md" }];
  for (const type of TYPES) {
    entries.push({
      type,
      template: `${type}/AGENTS.md`,
      target: `${expandName(type, kase)}/AGENTS.md`,
    });
  }
  return entries;
}

/** Lines of `text`, normalized and split, with the final empty element dropped. */
function normalizedLines(text) {
  const lines = normalize(text).split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }
  return lines;
}

/** { frontmatter, preamble, sections: [{ heading, body }] }, fence-aware. */
function splitSections(text) {
  const lines = normalizedLines(text);

  let idx = 0;
  let frontmatter = [];
  if (lines[0] === "---") {
    let j = 1;
    while (j < lines.length && lines[j] !== "---") {
      j++;
    }
    if (j < lines.length) {
      frontmatter = lines.slice(0, j + 1);
      idx = j + 1;
    }
  }

  const preamble = [];
  const sections = [];
  let current = null;
  let inFence = false;
  let fenceChar = null;
  let fenceLen = 0;

  for (let i = idx; i < lines.length; i++) {
    const line = lines[i];
    let isHeading = false;

    if (!inFence) {
      const openMatch = /^ {0,3}(`{3,}|~{3,})/.exec(line);
      if (openMatch) {
        inFence = true;
        fenceChar = openMatch[1][0];
        fenceLen = openMatch[1].length;
      } else if (/^ {0,3}#{1,6}(?: |$)/.test(line)) {
        isHeading = true;
      }
    } else {
      const closeMatch = /^ {0,3}(`+|~+)\s*$/.exec(line);
      if (closeMatch && closeMatch[1][0] === fenceChar && closeMatch[1].length >= fenceLen) {
        inFence = false;
      }
    }

    if (isHeading) {
      current = { heading: line, body: [] };
      sections.push(current);
    } else if (current) {
      current.body.push(line);
    } else {
      preamble.push(line);
    }
  }

  return { frontmatter, preamble, sections };
}

/** The whole first ATX heading line, or null. */
function firstHeading(text) {
  const { sections } = splitSections(text);
  return sections.length > 0 ? sections[0].heading : null;
}

/** { managed, found, expected, missingDocManagement }. */
function classify(text, expandedTemplate, isRoot) {
  const found = firstHeading(text);
  const expected = firstHeading(expandedTemplate);
  let managed = found !== null && found === expected;
  let missingDocManagement = false;

  if (isRoot && managed) {
    const { sections } = splitSections(text);
    const hasDocManagement = sections.some((s) => s.heading === "## Document management");
    if (!hasDocManagement) {
      missingDocManagement = true;
      managed = false;
    }
  }

  return { managed, found, expected, missingDocManagement };
}

/** A body with its trailing blank lines removed. */
function trimTrailingBlanks(body) {
  const trimmed = body.slice();
  while (trimmed.length > 0 && trimmed[trimmed.length - 1] === "") {
    trimmed.pop();
  }
  return trimmed;
}

/** `lines` with its leading and trailing blank lines removed; interior blanks stay. */
function trimBlankEdges(lines) {
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start] === "") {
    start++;
  }
  while (end > start && lines[end - 1] === "") {
    end--;
  }
  return lines.slice(start, end);
}

/** Two bodies, compared after each has its trailing blank lines removed. */
function bodiesEqual(a, b) {
  const ta = trimTrailingBlanks(a);
  const tb = trimTrailingBlanks(b);
  if (ta.length !== tb.length) {
    return false;
  }
  return ta.every((line, i) => line === tb[i]);
}

/** { missing, diverged, authorAdded } — heading lines. */
function compareSections(templateSections, targetSections) {
  const templateBodyByHeading = new Map();
  for (const s of templateSections) {
    if (!templateBodyByHeading.has(s.heading)) {
      templateBodyByHeading.set(s.heading, s.body);
    }
  }

  const seen = new Set();
  const matched = new Set();
  const divergedSet = new Set();
  const authorAdded = [];

  for (const s of targetSections) {
    if (templateBodyByHeading.has(s.heading) && !seen.has(s.heading)) {
      seen.add(s.heading);
      matched.add(s.heading);
      if (!bodiesEqual(templateBodyByHeading.get(s.heading), s.body)) {
        divergedSet.add(s.heading);
      }
    } else {
      authorAdded.push(s.heading);
    }
  }

  const missing = [];
  const diverged = [];
  for (const s of templateSections) {
    if (!matched.has(s.heading)) {
      missing.push(s.heading);
    } else if (divergedSet.has(s.heading)) {
      diverged.push(s.heading);
    }
  }

  return { missing, diverged, authorAdded };
}

/** The leading run length of `#` characters a heading line opens with. */
function headingLevel(heading) {
  const m = /^ {0,3}(#+)/.exec(heading);
  return m ? m[1].length : 0;
}

/** null, or a description of why `sections` cannot be a valid template. */
function templateError(sections) {
  if (sections.length === 0 || headingLevel(sections[0].heading) !== 1) {
    return "has no H1";
  }
  const seen = new Set();
  for (const s of sections) {
    if (seen.has(s.heading)) {
      return `repeats the heading ${s.heading}`;
    }
    seen.add(s.heading);
  }
  return null;
}

/** `p` with every backslash rewritten to a forward slash. */
function posixPath(p) {
  return p.split(path.sep).join("/");
}

/** The path as the operator would type it: `--docs` joined with the target. */
function reportPath(docsDir, relTarget) {
  return posixPath(path.join(docsDir, relTarget));
}

/** Whether `relTarget` exists under `baseDir`, by exact-name lookup at every level. */
function existsExact(baseDir, relTarget) {
  const segments = relTarget.split("/");
  let dir = baseDir;
  for (const segment of segments) {
    let entries;
    try {
      entries = fs.readdirSync(dir);
    } catch (err) {
      if (err.code === "ENOENT" || err.code === "ENOTDIR") {
        return false;
      }
      throw err;
    }
    if (!entries.includes(segment)) {
      return false;
    }
    dir = path.join(dir, segment);
  }
  return true;
}

/** The line ending the raw text's first line uses: "\r\n" or "\n". */
function detectLineEnding(raw) {
  const idx = raw.indexOf("\n");
  if (idx > 0 && raw[idx - 1] === "\r") {
    return "\r\n";
  }
  return "\n";
}

/** A template with no H1, or a target that exists and cannot be read. */
class TemplateError extends Error {}
class ReadError extends Error {}

/** A bad `--items` argument, a number past the list, or a vanished identity. */
class ApplyError extends Error {}

/** Print `message` to stderr, prefixed `error: `, and return exit code 2. */
function fail(message) {
  process.stderr.write(`error: ${message}\n`);
  return 2;
}

/** Walk the seven targets. Returns { items, notes }. */
function collect({ templatesDir, docsDir, kase }) {
  const targets = targetSet(kase);
  const items = [];
  const notes = [];

  for (const t of targets) {
    const templatePath = path.join(templatesDir, t.template);
    let templateRaw;
    try {
      templateRaw = fs.readFileSync(templatePath, "utf8");
    } catch (err) {
      throw new ReadError(`cannot read template ${posixPath(templatePath)}: ${err.message}`);
    }

    const expandedTemplate = expandTemplate(templateRaw, kase);
    const templateSections = splitSections(expandedTemplate).sections;
    const badTemplate = templateError(templateSections);
    if (badTemplate) {
      throw new TemplateError(`template ${posixPath(templatePath)} ${badTemplate}`);
    }

    const printedPath = reportPath(docsDir, t.target);
    const absPath = path.resolve(path.join(docsDir, t.target));

    let exists;
    try {
      exists = existsExact(docsDir, t.target);
    } catch (err) {
      throw new ReadError(`cannot read ${posixPath(path.join(docsDir, t.target))}: ${err.message}`);
    }

    if (!exists) {
      items.push({
        kind: "create",
        path: printedPath,
        absPath,
        heading: null,
        oldBody: null,
        newBody: null,
        text: normalize(expandedTemplate),
        lineEnding: "\n",
        bom: false,
      });
      continue;
    }

    const targetPath = path.join(docsDir, t.target);
    let targetRaw;
    try {
      targetRaw = fs.readFileSync(targetPath, "utf8");
    } catch (err) {
      throw new ReadError(`cannot read ${posixPath(targetPath)}: ${err.message}`);
    }

    const isRoot = t.type === "root";
    const result = classify(targetRaw, expandedTemplate, isRoot);

    if (!result.managed) {
      if (isRoot && result.missingDocManagement) {
        notes.push(
          `note: ${printedPath} — kisou-managed by H1, but the "## Document management" heading is missing; restore it by hand`,
        );
      } else {
        const foundText = result.found === null ? "(none)" : `"${result.found}"`;
        notes.push(
          `note: ${printedPath} — not kisou-managed: first heading is ${foundText}, expected "${result.expected}"`,
        );
      }
      continue;
    }

    const lineEnding = detectLineEnding(targetRaw);
    const bom = targetRaw.charCodeAt(0) === 0xfeff;

    const { preamble: targetPreamble, sections: targetSections } = splitSections(targetRaw);
    const compared = compareSections(templateSections, targetSections);

    for (const heading of compared.authorAdded) {
      notes.push(`note: ${printedPath} — author section kept: ${heading}`);
    }

    const keptPreamble = trimBlankEdges(targetPreamble);
    if (keptPreamble.length > 0) {
      const lineWord = keptPreamble.length === 1 ? "line" : "lines";
      notes.push(`note: ${printedPath} — text before the first heading kept: ${keptPreamble.length} ${lineWord}`);
    }

    const missingSet = new Set(compared.missing);
    const divergedSet = new Set(compared.diverged);
    const targetBodyByHeading = new Map();
    for (const s of targetSections) {
      if (!targetBodyByHeading.has(s.heading)) {
        targetBodyByHeading.set(s.heading, s.body);
      }
    }

    for (const s of templateSections) {
      if (missingSet.has(s.heading)) {
        items.push({
          kind: "add",
          path: printedPath,
          absPath,
          heading: s.heading,
          oldBody: null,
          newBody: s.body,
          text: null,
          lineEnding,
          bom,
          templateSections,
        });
      } else if (divergedSet.has(s.heading)) {
        items.push({
          kind: "replace",
          path: printedPath,
          absPath,
          heading: s.heading,
          oldBody: targetBodyByHeading.get(s.heading),
          newBody: s.body,
          text: null,
          lineEnding,
          bom,
          templateSections,
        });
      }
    }
  }

  // A docs root that still holds this type under its name before 2026-09 gets
  // one note: renaming the directory is a hand migration, never an item.
  const legacyName = expandName("requirements", kase);
  let legacyOnly;
  try {
    legacyOnly =
      existsExact(docsDir, `${legacyName}/AGENTS.md`) &&
      !existsExact(docsDir, `${expandName("experience", kase)}/AGENTS.md`);
  } catch (err) {
    throw new ReadError(`cannot read ${posixPath(path.join(docsDir, legacyName))}: ${err.message}`);
  }
  if (legacyOnly) {
    notes.push(
      `note: ${reportPath(docsDir, legacyName)}/ — the name the experience type had before 2026-09; renaming it is a hand migration, not an item`,
    );
  }

  return { items, notes };
}

/** `<kind>: <path>[ — <heading>]`, the label an item line and a vanished-identity error share. */
function itemLabel(item) {
  if (item.kind === "create") {
    return `create: ${item.path}`;
  }
  return `${item.kind}: ${item.path} — ${item.heading}`;
}

/** One item's numbered line, with no diff blocks: `<n>. <kind>: <path>[ — <heading>]`. */
function itemLine(index, item) {
  return `${index}. ${itemLabel(item)}`;
}

/** One item's report line(s): the item line, and a `replace`'s diff blocks. */
function formatItem(index, item) {
  const lines = [itemLine(index, item)];
  if (item.kind === "replace") {
    for (const line of item.oldBody) {
      lines.push(line === "" ? "-" : `- ${line}`);
    }
    for (const line of item.newBody) {
      lines.push(line === "" ? "+" : `+ ${line}`);
    }
  }
  return lines;
}

/** The whole stdout of `check`, summary line included. */
function formatReport({ items, notes }) {
  const lines = [];
  items.forEach((item, i) => {
    lines.push(...formatItem(i + 1, item));
  });
  for (const note of notes) {
    lines.push(note);
  }
  const itemWord = items.length === 1 ? "item" : "items";
  const noteWord = notes.length === 1 ? "note" : "notes";
  lines.push(`${items.length} ${itemWord}, ${notes.length} ${noteWord}`);
  return `${lines.join("\n")}\n`;
}

/**
 * Run `check`: collect the report and print it. Returns the exit code.
 *
 * Every throw from `collect` — a domain error or an internal bug alike —
 * becomes `error: ...` on stderr and exit 2: `check`'s exit code is the
 * pre-commit hook's signal for "items exist" (1), so an internal bug must
 * never surface as that code.
 */
function runCheck({ templatesDir, docsDir, kase }) {
  let result;
  try {
    result = collect({ templatesDir, docsDir, kase });
  } catch (err) {
    return fail(err.message);
  }
  process.stdout.write(formatReport(result));
  return result.items.length > 0 ? 1 : 0;
}

/** "1,2,5" -> [1, 2, 5]. Throws on a field that is not a positive integer. */
function parseItems(raw) {
  const numbers = new Set();
  for (const field of raw.split(",").map((f) => f.trim())) {
    if (!/^[1-9][0-9]*$/.test(field)) {
      throw new ApplyError(`--items field ${JSON.stringify(field)} is not a positive integer`);
    }
    numbers.add(Number(field));
  }
  return [...numbers].sort((a, b) => a - b);
}

/** `sections`, with the section at `index` replaced by `heading`/`body`, written out. */
function writeSections(frontmatter, preamble, sections, index, heading, body) {
  const lines = [...frontmatter, ...preamble];
  sections.forEach((s, i) => {
    if (i === index) {
      lines.push(heading, ...body);
    } else {
      lines.push(s.heading, ...s.body);
    }
  });
  return `${lines.join("\n")}\n`;
}

/** Replace one fixed section's body in `targetText`, by the writing rule. */
function replaceSectionBody(targetText, heading, newBody) {
  const { frontmatter, preamble, sections } = splitSections(targetText);
  const index = sections.findIndex((s) => s.heading === heading);
  const hasNext = index < sections.length - 1;
  const trimmed = trimTrailingBlanks(newBody);
  const body = hasNext ? [...trimmed, ""] : trimmed;
  return writeSections(frontmatter, preamble, sections, index, heading, body);
}

/** Insert one template section into a target's lines at the template's place. */
function insertSection(targetText, templateSections, heading) {
  const { frontmatter, preamble, sections } = splitSections(targetText);
  const ti = templateSections.findIndex((s) => s.heading === heading);
  const templateBody = templateSections[ti].body;

  const presentIndex = (templateHeading) => sections.findIndex((s) => s.heading === templateHeading);

  let insertIndex = sections.length;
  let anchored = false;
  for (let i = ti - 1; i >= 0 && !anchored; i--) {
    const idx = presentIndex(templateSections[i].heading);
    if (idx !== -1) {
      insertIndex = idx + 1;
      anchored = true;
    }
  }
  if (!anchored) {
    for (let i = ti + 1; i < templateSections.length && !anchored; i++) {
      const idx = presentIndex(templateSections[i].heading);
      if (idx !== -1) {
        insertIndex = idx;
        anchored = true;
      }
    }
  }

  const hasNext = insertIndex < sections.length;
  const trimmed = trimTrailingBlanks(templateBody);
  const body = hasNext ? [...trimmed, ""] : trimmed;

  // The preceding section's raw body is left untouched; when it has no
  // trailing blank line of its own (the end-of-file case after
  // normalization), a separating blank line is added before our heading.
  let leadingBlank = false;
  if (insertIndex > 0) {
    const prevBody = sections[insertIndex - 1].body;
    leadingBlank = prevBody.length === 0 || prevBody[prevBody.length - 1] !== "";
  }

  const lines = [...frontmatter, ...preamble];
  sections.forEach((s, i) => {
    if (i === insertIndex) {
      if (leadingBlank) {
        lines.push("");
      }
      lines.push(heading, ...body);
    }
    lines.push(s.heading, ...s.body);
  });
  if (insertIndex === sections.length) {
    if (leadingBlank) {
      lines.push("");
    }
    lines.push(heading, ...body);
  }

  return `${lines.join("\n")}\n`;
}

/** Wrap one fs call for `writeItem`: any failure becomes an `ApplyError`. */
function writeItemFs(item, fn) {
  try {
    return fn();
  } catch (err) {
    throw new ApplyError(`cannot write ${posixPath(item.absPath)}: ${err.message}`);
  }
}

/**
 * Write one accepted item to disk, keeping the target's line ending and BOM.
 *
 * Each fs call is wrapped through `writeItemFs`: an `EPERM`/`EACCES`/
 * `EISDIR`/`ENOENT` (or any other write-path failure) becomes an
 * `ApplyError`, the domain class `runApply` already knows to report as
 * `error: ...` and exit 2, rather than a plain `Error` that would rethrow
 * with a stack trace as though it were an internal bug. `insertSection` and
 * `replaceSectionBody` stay outside the wrap, so a real bug in either still
 * rethrows with its stack, per the m-1 narrowing.
 */
function writeItem(item) {
  if (item.kind === "create") {
    writeItemFs(item, () => fs.mkdirSync(path.dirname(item.absPath), { recursive: true }));
    writeItemFs(item, () => fs.writeFileSync(item.absPath, item.text, "utf8"));
    return;
  }

  const targetRaw = writeItemFs(item, () => fs.readFileSync(item.absPath, "utf8"));
  const targetText = normalize(targetRaw);
  const newText =
    item.kind === "add"
      ? insertSection(targetText, item.templateSections, item.heading)
      : replaceSectionBody(targetText, item.heading, item.newBody);

  let out = newText;
  if (item.lineEnding === "\r\n") {
    out = out.replace(/\n/g, "\r\n");
  }
  if (item.bom) {
    out = `﻿${out}`;
  }
  writeItemFs(item, () => fs.writeFileSync(item.absPath, out, "utf8"));
}

/**
 * Write the accepted items. Returns how many were written.
 *
 * Validates every number against the initial list before writing anything.
 * Writes in list order, recomputing the list from the tree after every write
 * so the next accepted item is found by identity, not by its old number.
 * `onApply({ number, item })`, if given, is called with each item as it is
 * written, alongside the check-list number the operator gave it — that
 * number, not a fresh 1-based index, is what a printout owes the operator.
 */
function applyItems({ templatesDir, docsDir, kase, numbers, onApply }) {
  let state = collect({ templatesDir, docsDir, kase });

  const identities = numbers.map((n) => {
    const item = state.items[n - 1];
    if (!item) {
      throw new ApplyError(`item ${n} does not exist`);
    }
    return { number: n, path: item.path, kind: item.kind, heading: item.heading };
  });

  let count = 0;
  for (let i = 0; i < identities.length; i++) {
    const identity = identities[i];
    const item = state.items.find(
      (it) => it.path === identity.path && it.kind === identity.kind && it.heading === identity.heading,
    );
    if (!item) {
      throw new ApplyError(`item ${identity.number} (${itemLabel(identity)}) is no longer available`);
    }
    writeItem(item);
    count++;
    if (onApply) {
      onApply({ number: identity.number, item });
    }
    if (i < identities.length - 1) {
      state = collect({ templatesDir, docsDir, kase });
    }
  }

  return count;
}

/**
 * Run `apply`: write the accepted items and print what was written.
 *
 * The catch narrows to the three domain error classes: a bad `--items`
 * number, an unreadable template, or a target that cannot be read all become
 * `error: ...` and exit 2. Anything else is an internal bug in the writing
 * path itself and rethrows with its stack, rather than being hidden behind
 * an `error: ...` line the way a domain error is.
 */
function runApply({ templatesDir, docsDir, kase, numbers }) {
  const applied = [];
  let count;
  try {
    count = applyItems({
      templatesDir,
      docsDir,
      kase,
      numbers,
      onApply: (entry) => applied.push(entry),
    });
  } catch (err) {
    if (applied.length > 0) {
      process.stdout.write(`${applied.map(({ number, item }) => itemLine(number, item)).join("\n")}\n`);
    }
    if (err instanceof ApplyError || err instanceof TemplateError || err instanceof ReadError) {
      return fail(err.message);
    }
    throw err;
  }

  const lines = applied.map(({ number, item }) => itemLine(number, item));
  const word = count === 1 ? "item" : "items";
  lines.push(`${count} ${word} applied`);
  process.stdout.write(`${lines.join("\n")}\n`);
  return 0;
}

/** Dispatch a subcommand. Returns the process exit code. */
function main(argv) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        templates: { type: "string" },
        docs: { type: "string" },
        case: { type: "string" },
        items: { type: "string" },
      },
    });
  } catch {
    return fail(USAGE);
  }

  const { positionals, values } = parsed;
  const subcommand = positionals[0];
  if (subcommand !== "check" && subcommand !== "apply") {
    return fail(USAGE);
  }
  if (positionals.length > 1) {
    return fail(USAGE);
  }
  if (!values.docs) {
    return fail(USAGE);
  }
  if (values.case !== undefined && values.case !== "snake_case" && values.case !== "PascalCase") {
    return fail(USAGE);
  }
  if (subcommand === "check" && values.items !== undefined) {
    return fail(USAGE);
  }

  const templatesDir = values.templates ? values.templates : path.join(__dirname, "..", "templates", "docs");

  let docsStat = null;
  try {
    docsStat = fs.statSync(values.docs);
  } catch (err) {
    if (err.code !== "ENOENT") {
      return fail(`cannot read --docs ${values.docs}: ${err.message}`);
    }
  }
  if (docsStat && !docsStat.isDirectory()) {
    return fail(`--docs ${values.docs} is not a directory`);
  }

  let kase = values.case;
  if (!kase) {
    const base = path.basename(path.resolve(values.docs));
    const derived = base === "Documents" ? "PascalCase" : "snake_case";
    const other = derived === "PascalCase" ? "snake_case" : "PascalCase";
    const perTypeCount = (k) =>
      targetSet(k).filter((t) => t.type !== "root" && existsExact(values.docs, t.target)).length;
    let derivedCount;
    let otherCount;
    try {
      derivedCount = perTypeCount(derived);
      otherCount = perTypeCount(other);
    } catch (err) {
      return fail(`cannot read --docs ${values.docs}: ${err.message}`);
    }
    if (derivedCount === 0 && otherCount > 0) {
      return fail(`cannot derive --case from ${base}; pass --case explicitly`);
    }
    kase = derived;
  }

  if (subcommand === "check") {
    return runCheck({ templatesDir, docsDir: values.docs, kase });
  }

  if (values.items === undefined) {
    return fail("apply requires --items <n,...>");
  }
  let numbers;
  try {
    numbers = parseItems(values.items);
  } catch (err) {
    if (err instanceof ApplyError) {
      return fail(err.message);
    }
    throw err;
  }
  return runApply({ templatesDir, docsDir: values.docs, kase, numbers });
}

module.exports = {
  normalize,
  expandName,
  expandTemplate,
  targetSet,
  splitSections,
  firstHeading,
  classify,
  compareSections,
  main,
  collect,
  formatReport,
  parseItems,
  applyItems,
};

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}
