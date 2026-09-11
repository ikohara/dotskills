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

const TYPES = ["requirements", "design", "decisions", "issues", "notes", "reports"];

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
  const templateHeadingSet = new Set(templateSections.map((s) => s.heading));
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
    if (templateHeadingSet.has(s.heading) && !seen.has(s.heading)) {
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
    } catch {
      return false;
    }
    if (!entries.includes(segment)) {
      return false;
    }
    dir = path.join(dir, segment);
  }
  return true;
}

/** Print `message` to stderr, prefixed `error: `, and return exit code 2. */
function fail(message) {
  process.stderr.write(`error: ${message}\n`);
  return 2;
}

/** Run `check`: resolve the seven targets, print notes and the summary line. */
function runCheck({ templatesDir, docsDir, kase }) {
  const targets = targetSet(kase);
  const notes = [];
  const itemCount = 0; // no item kind exists yet; a later task adds them

  for (const t of targets) {
    const templatePath = path.join(templatesDir, t.template);
    let templateRaw;
    try {
      templateRaw = fs.readFileSync(templatePath, "utf8");
    } catch (err) {
      return fail(`cannot read template ${posixPath(templatePath)}: ${err.message}`);
    }

    const expandedTemplate = expandTemplate(templateRaw, kase);
    const templateSections = splitSections(expandedTemplate).sections;
    const badTemplate = templateError(templateSections);
    if (badTemplate) {
      return fail(`template ${posixPath(templatePath)} ${badTemplate}`);
    }

    if (!existsExact(docsDir, t.target)) {
      // No item kind exists yet; a later task turns this into `create`.
      continue;
    }

    const targetPath = path.join(docsDir, t.target);
    let targetRaw;
    try {
      targetRaw = fs.readFileSync(targetPath, "utf8");
    } catch (err) {
      return fail(`cannot read ${posixPath(targetPath)}: ${err.message}`);
    }

    const printedPath = reportPath(docsDir, t.target);
    const isRoot = t.type === "root";
    const result = classify(targetRaw, expandedTemplate, isRoot);

    if (!result.managed) {
      if (isRoot && result.missingDocManagement) {
        notes.push(
          `note: ${printedPath} — kisou-managed by H1, but the "## Document management" heading is missing; restore it by hand`,
        );
      } else {
        const foundText = result.found === null ? "(none)" : result.found;
        notes.push(
          `note: ${printedPath} — not kisou-managed: first heading is ${foundText}, expected ${result.expected}`,
        );
      }
      continue;
    }

    const targetSections = splitSections(targetRaw).sections;
    const compared = compareSections(templateSections, targetSections);
    for (const heading of compared.authorAdded) {
      notes.push(`note: ${printedPath} — author section kept: ${heading}`);
    }
    // `compared.missing` and `compared.diverged` become items in a later task.
  }

  for (const note of notes) {
    process.stdout.write(`${note}\n`);
  }
  const itemWord = itemCount === 1 ? "item" : "items";
  const noteWord = notes.length === 1 ? "note" : "notes";
  process.stdout.write(`${itemCount} ${itemWord}, ${notes.length} ${noteWord}\n`);
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
    const derivedCount = perTypeCount(derived);
    const otherCount = perTypeCount(other);
    if (derivedCount === 0 && otherCount > 0) {
      return fail(`cannot derive --case from ${base}; pass --case explicitly`);
    }
    kase = derived;
  }

  if (subcommand === "check") {
    return runCheck({ templatesDir, docsDir: values.docs, kase });
  }

  // `apply` is implemented in a later task.
  return fail("apply is not yet implemented");
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
};

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}
