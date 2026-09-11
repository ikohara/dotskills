// biome-ignore lint/suspicious/noRedundantUseStrict: CommonJS script, not an ES module
"use strict";

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const {
  normalize,
  expandName,
  expandTemplate,
  targetSet,
  splitSections,
  firstHeading,
  classify,
  compareSections,
} = require("./doc-system-check.js");

const SCRIPT = path.join(__dirname, "doc-system-check.js");
const TEMPLATES = path.join(__dirname, "..", "templates", "docs");
const TYPES = ["requirements", "design", "decisions", "issues", "notes", "reports"];

function tmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "doc-system-check-"));
}

function run(args) {
  try {
    const out = execFileSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" });
    return { code: 0, out };
  } catch (err) {
    return { code: err.status, out: `${err.stdout || ""}${err.stderr || ""}` };
  }
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, "utf8");
}

/** Install the real bundle, expanded, under `docsDir`. */
function expandBundle(docsDir, kase, templatesDir = TEMPLATES) {
  for (const t of targetSet(kase)) {
    const source = read(path.join(templatesDir, t.template));
    write(path.join(docsDir, t.target), expandTemplate(source, kase));
  }
}

/** A seven-file miniature bundle whose bodies this suite controls. */
function fakeTemplates(dir) {
  write(path.join(dir, "AGENTS.md"), "# AGENTS.md\n\nRoot intro.\n\n## Document management\n\nRoot rules.\n");
  for (const type of TYPES) {
    write(
      path.join(dir, type, "AGENTS.md"),
      `# {{${type}}}/ — AGENTS\n\nIntro.\n\n## File\n\nFile body.\n\n## Body\n\nBody body.\n\n## Growth\n\nGrowth body.\n`,
    );
  }
  return dir;
}

/** A docs root holding the expanded miniature bundle. */
function fakeInstall(kase = "snake_case") {
  const root = tmp();
  const templates = fakeTemplates(path.join(root, "templates"));
  const docs = path.join(root, "docs");
  expandBundle(docs, kase, templates);
  return { root, templates, docs };
}

const posix = (p) => p.split(path.sep).join("/");

test("normalize strips a BOM, folds CRLF, and collapses trailing newlines", () => {
  assert.strictEqual(normalize("﻿a\r\nb\r\n\n\n"), "a\nb\n");
  assert.strictEqual(normalize("a\n"), "a\n");
});

test("expandName follows the case-aware mapping", () => {
  assert.strictEqual(expandName("docs", "snake_case"), "docs");
  assert.strictEqual(expandName("requirements", "snake_case"), "requirements");
  assert.strictEqual(expandName("docs", "PascalCase"), "Documents");
  assert.strictEqual(expandName("src", "PascalCase"), "Source");
  assert.strictEqual(expandName("requirements", "PascalCase"), "Requirements");
  assert.strictEqual(expandName("reports", "PascalCase"), "Reports");
});

test("expandTemplate replaces every placeholder occurrence", () => {
  assert.strictEqual(expandTemplate("{{docs}}/{{notes}}/x — {{notes}}", "PascalCase"), "Documents/Notes/x — Notes");
});

test("the target set is seven entries in the report's order", () => {
  const snake = targetSet("snake_case");
  assert.deepStrictEqual(
    snake.map((t) => t.target),
    [
      "AGENTS.md",
      "requirements/AGENTS.md",
      "design/AGENTS.md",
      "decisions/AGENTS.md",
      "issues/AGENTS.md",
      "notes/AGENTS.md",
      "reports/AGENTS.md",
    ],
  );
  assert.deepStrictEqual(
    snake.map((t) => t.template),
    [
      "AGENTS.md",
      "requirements/AGENTS.md",
      "design/AGENTS.md",
      "decisions/AGENTS.md",
      "issues/AGENTS.md",
      "notes/AGENTS.md",
      "reports/AGENTS.md",
    ],
  );
  assert.deepStrictEqual(
    targetSet("PascalCase").map((t) => t.target),
    [
      "AGENTS.md",
      "Requirements/AGENTS.md",
      "Design/AGENTS.md",
      "Decisions/AGENTS.md",
      "Issues/AGENTS.md",
      "Notes/AGENTS.md",
      "Reports/AGENTS.md",
    ],
  );
});

// --- test case 1: identity -------------------------------------------------

test("the expanded snake_case bundle is level with its templates", () => {
  const docs = path.join(tmp(), "docs");
  expandBundle(docs, "snake_case");
  const result = run(["check", "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /^0 items, 0 notes$/m);
});

test("the expanded PascalCase bundle is level, with the case derived", () => {
  const docs = path.join(tmp(), "Documents");
  expandBundle(docs, "PascalCase");
  const result = run(["check", "--docs", docs]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /^0 items, 0 notes$/m);
});

test("compareSections finds nothing between a template and its own copy", () => {
  const source = read(path.join(TEMPLATES, "requirements", "AGENTS.md"));
  const expanded = expandTemplate(source, "snake_case");
  const compared = compareSections(splitSections(expanded).sections, splitSections(expanded).sections);
  assert.deepStrictEqual(compared, { missing: [], diverged: [], authorAdded: [] });
});

// --- test case 3: the fingerprint -----------------------------------------

test("a type copy with a foreign H1 is a note, not an item", () => {
  const { templates, docs } = fakeInstall();
  write(path.join(docs, "requirements", "AGENTS.md"), "# Requirements\n\nOurs.\n");
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.ok(
    result.out.includes(
      `note: ${posix(docs)}/requirements/AGENTS.md — not kisou-managed: first heading is # Requirements, expected # requirements/ — AGENTS`,
    ),
  );
  assert.match(result.out, /^0 items, 1 note$/m);
});

test("a root with the right H1 but no document-management heading is a note", () => {
  const { templates, docs } = fakeInstall();
  write(path.join(docs, "AGENTS.md"), "# AGENTS.md\n\nRoot intro.\n");
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.ok(
    result.out.includes(
      `note: ${posix(docs)}/AGENTS.md — kisou-managed by H1, but the "## Document management" heading is missing; restore it by hand`,
    ),
  );
  assert.match(result.out, /^0 items, 1 note$/m);
});

test("classify reports what it found and what it expected", () => {
  const template = "# requirements/ — AGENTS\n\nIntro.\n";
  assert.deepStrictEqual(classify(template, template, false), {
    managed: true,
    found: "# requirements/ — AGENTS",
    expected: "# requirements/ — AGENTS",
    missingDocManagement: false,
  });
  const foreign = classify("Prose first.\n\n# Something\n", template, false);
  assert.strictEqual(foreign.managed, false);
  assert.strictEqual(foreign.found, "# Something");
  const headless = classify("Just prose.\n", template, false);
  assert.strictEqual(headless.managed, false);
  assert.strictEqual(headless.found, null);
});

// --- test case 7: fences, frontmatter, setext, preamble --------------------

test("a hash inside a backtick fence is not a heading", () => {
  const split = splitSections("# H\n\n```bash\n# POSIX\n```\n\n## Real\n\nx\n");
  assert.deepStrictEqual(
    split.sections.map((s) => s.heading),
    ["# H", "## Real"],
  );
});

test("a hash inside a tilde fence is not a heading", () => {
  const split = splitSections("# H\n\n~~~text\n## Context\n## Options\n~~~\n\n## Real\n\nx\n");
  assert.deepStrictEqual(
    split.sections.map((s) => s.heading),
    ["# H", "## Real"],
  );
});

test("a longer closing run closes the fence and a shorter one does not", () => {
  const split = splitSections("# H\n\n````text\n```\n# not a heading\n````\n\n## Real\n\nx\n");
  assert.deepStrictEqual(
    split.sections.map((s) => s.heading),
    ["# H", "## Real"],
  );
});

test("an indented hash is a code block, not a heading", () => {
  const split = splitSections("# H\n\n    # indented\n\n## Real\n\nx\n");
  assert.deepStrictEqual(
    split.sections.map((s) => s.heading),
    ["# H", "## Real"],
  );
});

test("leading frontmatter is skipped and its hash is not a heading", () => {
  const split = splitSections("---\ntitle: # not a heading\n---\n\n# H\n\nx\n");
  assert.deepStrictEqual(split.frontmatter, ["---", "title: # not a heading", "---"]);
  assert.deepStrictEqual(
    split.sections.map((s) => s.heading),
    ["# H"],
  );
});

test("a setext underline is not a heading", () => {
  const split = splitSections("Title\n=====\n\nx\n");
  assert.deepStrictEqual(split.sections, []);
  assert.deepStrictEqual(split.preamble, ["Title", "=====", "", "x"]);
  assert.strictEqual(firstHeading("Title\n=====\n\nx\n"), null);
});

test("lines before the first heading are the preamble", () => {
  const split = splitSections("Lead in.\n\n# H\n\nx\n");
  assert.deepStrictEqual(split.preamble, ["Lead in.", ""]);
  assert.deepStrictEqual(split.sections[0].body, ["", "x"]);
});

test("a section body runs to the next heading, flat", () => {
  const split = splitSections("# H\n\na\n\n## Two\n\nb\n\n### Three\n\nc\n");
  assert.deepStrictEqual(
    split.sections.map((s) => s.heading),
    ["# H", "## Two", "### Three"],
  );
  assert.deepStrictEqual(split.sections[1].body, ["", "b", ""]);
  assert.deepStrictEqual(split.sections[2].body, ["", "c"]);
});

test("a fenced heading in the real bundle does not split the ADR template", () => {
  const source = read(path.join(TEMPLATES, "decisions", "AGENTS.md"));
  const headings = splitSections(expandTemplate(source, "snake_case")).sections.map((s) => s.heading);
  assert.ok(!headings.includes("## Context       — what forced a decision"));
  assert.ok(headings.includes("## Body (MADR-lite)"));
});

test("a copy whose H1 is setext is reported as not kisou-managed", () => {
  const { templates, docs } = fakeInstall();
  write(path.join(docs, "notes", "AGENTS.md"), "notes/ — AGENTS\n===============\n\nIntro.\n");
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.ok(result.out.includes("not kisou-managed: first heading is (none)"));
});

test("a copy whose fenced block holds a hash line stays level", () => {
  const { templates, docs } = fakeInstall();
  const withFence =
    "# {{notes}}/ — AGENTS\n\nIntro.\n\n## File\n\n```bash\n# POSIX\n```\n\n## Body\n\nBody body.\n\n## Growth\n\nGrowth body.\n";
  write(path.join(templates, "notes", "AGENTS.md"), withFence);
  write(path.join(docs, "notes", "AGENTS.md"), expandTemplate(withFence, "snake_case"));
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /^0 items, 0 notes$/m);
});

// --- test case 2: absent ---------------------------------------------------

test("an empty docs root is seven create items", () => {
  const root = tmp();
  const templates = fakeTemplates(path.join(root, "templates"));
  const docs = path.join(root, "docs");
  fs.mkdirSync(docs, { recursive: true });
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /^1\. create: .*\/AGENTS\.md$/m);
  assert.match(result.out, /^7\. create: .*\/reports\/AGENTS\.md$/m);
  assert.match(result.out, /^7 items, 0 notes$/m);
});

test("a docs root that does not exist is seven create items, not an error", () => {
  const root = tmp();
  const templates = fakeTemplates(path.join(root, "templates"));
  const docs = path.join(root, "absent");
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /^7 items, 0 notes$/m);
  assert.strictEqual(fs.existsSync(docs), false);
});

test("a docs path that is a file is exit 2", () => {
  const root = tmp();
  const templates = fakeTemplates(path.join(root, "templates"));
  const file = path.join(root, "docs.md");
  write(file, "not a directory\n");
  const result = run(["check", "--templates", templates, "--docs", file, "--case", "snake_case"]);
  assert.strictEqual(result.code, 2);
});

// --- test case 4: diverged, with its printed text asserted -----------------

test("a rewrapped section is one replace item, printed as two blocks", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, read(target).replace("File body.", "File\nbody rewrapped."));
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 1);
  assert.strictEqual(
    result.out,
    [
      `1. replace: ${posix(docs)}/notes/AGENTS.md — ## File`,
      "-",
      "- File",
      "- body rewrapped.",
      "-",
      "+",
      "+ File body.",
      "+",
      "1 item, 0 notes",
      "",
    ].join("\n"),
  );
});

test("items are ordered by file, then by the template's section order", () => {
  const { templates, docs } = fakeInstall();
  for (const type of ["reports", "design"]) {
    const target = path.join(docs, type, "AGENTS.md");
    write(target, read(target).replace("Growth body.", "Changed.").replace("File body.", "Also changed."));
  }
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  const items = result.out.split("\n").filter((l) => /^\d+\. /.test(l));
  assert.deepStrictEqual(items, [
    `1. replace: ${posix(docs)}/design/AGENTS.md — ## File`,
    `2. replace: ${posix(docs)}/design/AGENTS.md — ## Growth`,
    `3. replace: ${posix(docs)}/reports/AGENTS.md — ## File`,
    `4. replace: ${posix(docs)}/reports/AGENTS.md — ## Growth`,
  ]);
});

test("a missing fixed section is an add item", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "issues", "AGENTS.md");
  write(target, read(target).replace("## Body\n\nBody body.\n\n", ""));
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 1);
  assert.strictEqual(
    result.out,
    [`1. add: ${posix(docs)}/issues/AGENTS.md — ## Body`, "1 item, 0 notes", ""].join("\n"),
  );
});

// --- test case 6, first half: author sections ------------------------------

test("an author-added section is a note and no item", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "design", "AGENTS.md");
  write(target, read(target).replace("## Body\n", "## Local conventions\n\nOurs.\n\n## Body\n"));
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.strictEqual(
    result.out,
    [`note: ${posix(docs)}/design/AGENTS.md — author section kept: ## Local conventions`, "0 items, 1 note", ""].join(
      "\n",
    ),
  );
});

test("a repeated heading compares the first and notes the second", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, `${read(target)}\n## File\n\nA second one.\n`);
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.ok(result.out.includes(`note: ${posix(docs)}/notes/AGENTS.md — author section kept: ## File`));
  assert.match(result.out, /^0 items, 1 note$/m);
});

// --- test case 8, first half: encoding and line endings --------------------

test("a CRLF copy of the bundle is level", () => {
  const docs = path.join(tmp(), "docs");
  expandBundle(docs, "snake_case");
  for (const t of targetSet("snake_case")) {
    const file = path.join(docs, t.target);
    write(file, read(file).replace(/\n/g, "\r\n"));
  }
  const result = run(["check", "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /^0 items, 0 notes$/m);
});

test("a copy with a BOM is level", () => {
  const docs = path.join(tmp(), "docs");
  expandBundle(docs, "snake_case");
  const file = path.join(docs, "reports", "AGENTS.md");
  write(file, `﻿${read(file)}`);
  const result = run(["check", "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /^0 items, 0 notes$/m);
});

test("extra trailing newlines are not a divergence", () => {
  const docs = path.join(tmp(), "docs");
  expandBundle(docs, "snake_case");
  const file = path.join(docs, "issues", "AGENTS.md");
  write(file, `${read(file)}\n\n`);
  const result = run(["check", "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
});
