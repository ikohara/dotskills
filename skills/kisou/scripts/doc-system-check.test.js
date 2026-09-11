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
  main,
} = require("./doc-system-check.js");

const SCRIPT = path.join(__dirname, "doc-system-check.js");
const TEMPLATES = path.join(__dirname, "..", "templates", "docs");
const TYPES = ["requirements", "design", "decisions", "issues", "notes", "reports"];

// Every temporary directory `tmp()` creates, so this file's own fixtures
// leave nothing behind under the OS temp dir.
const tmpDirs = [];
process.on("exit", () => {
  for (const dir of tmpDirs) {
    // Per-entry, so one locked directory does not stop every entry after
    // it in the array from being attempted too.
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // Best-effort teardown -- see above.
    }
  }
});

function tmp() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "doc-system-check-"));
  tmpDirs.push(dir);
  return dir;
}

function run(args) {
  try {
    const out = execFileSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" });
    return { code: 0, out };
  } catch (err) {
    return { code: err.status, out: `${err.stdout || ""}${err.stderr || ""}` };
  }
}

/**
 * `main(args)`, in-process, with stdout/stderr captured instead of printed.
 * For tests that need to monkeypatch a shared module (fs, path) around the
 * call, since `run()`'s child process cannot see a patch made in this one.
 */
function callMain(args) {
  const origOut = process.stdout.write;
  const origErr = process.stderr.write;
  let out = "";
  let err = "";
  process.stdout.write = (chunk) => {
    out += chunk;
    return true;
  };
  process.stderr.write = (chunk) => {
    err += chunk;
    return true;
  };
  try {
    const code = main(args);
    return { code, out, err };
  } finally {
    process.stdout.write = origOut;
    process.stderr.write = origErr;
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
      `note: ${posix(docs)}/requirements/AGENTS.md — not kisou-managed: first heading is "# Requirements", expected "# requirements/ — AGENTS"`,
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
    write(file, read(file).replace(/\r?\n/g, "\r\n"));
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

// --- test case 5: the insertion position -----------------------------------

test("an added section lands after the nearest preceding section present", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "requirements", "AGENTS.md");
  write(target, read(target).replace("## Body\n\nBody body.\n\n", ""));
  const applied = run(["apply", "--items", "1", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 0);
  assert.deepStrictEqual(
    splitSections(read(target)).sections.map((s) => s.heading),
    ["# requirements/ — AGENTS", "## File", "## Body", "## Growth"],
  );
  const after = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(after.code, 0);
});

test("applying only the later of two adds anchors it to what is present", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "requirements", "AGENTS.md");
  write(target, read(target).replace("## Body\n\nBody body.\n\n", "").replace("## Growth\n\nGrowth body.\n", ""));
  const listed = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.match(listed.out, /^2 items, 0 notes$/m);
  const applied = run(["apply", "--items", "2", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 0);
  assert.deepStrictEqual(
    splitSections(read(target)).sections.map((s) => s.heading),
    ["# requirements/ — AGENTS", "## File", "## Growth"],
  );
});

test("applying both adds in one run lands them in template order", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "requirements", "AGENTS.md");
  write(target, read(target).replace("## Body\n\nBody body.\n\n", "").replace("## Growth\n\nGrowth body.\n", ""));
  const applied = run(["apply", "--items", "1,2", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 0);
  assert.deepStrictEqual(
    splitSections(read(target)).sections.map((s) => s.heading),
    ["# requirements/ — AGENTS", "## File", "## Body", "## Growth"],
  );
  const after = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(after.code, 0);
  assert.match(after.out, /^0 items, 0 notes$/m);
});

test("an add whose only preceding section is the H1 lands directly after it", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, "# notes/ — AGENTS\n\nIntro.\n\n## Body\n\nBody body.\n\n## Growth\n\nGrowth body.\n");
  const applied = run(["apply", "--items", "1", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 0);
  assert.deepStrictEqual(
    splitSections(read(target)).sections.map((s) => s.heading),
    ["# notes/ — AGENTS", "## File", "## Body", "## Growth"],
  );
});

test("a copy with only its H1 takes every section, in order, at the end", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, "# notes/ — AGENTS\n\nIntro.\n");
  const applied = run(["apply", "--items", "1,2,3", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 0);
  assert.deepStrictEqual(
    splitSections(read(target)).sections.map((s) => s.heading),
    ["# notes/ — AGENTS", "## File", "## Body", "## Growth"],
  );
});

// --- test case 2, apply side: seven creates yield identity -----------------

test("applying all seven creates yields a level tree", () => {
  const root = tmp();
  const templates = fakeTemplates(path.join(root, "templates"));
  const docs = path.join(root, "docs");
  const applied = run([
    "apply",
    "--items",
    "1,2,3,4,5,6,7",
    "--templates",
    templates,
    "--docs",
    docs,
    "--case",
    "snake_case",
  ]);
  assert.strictEqual(applied.code, 0);
  assert.match(applied.out, /^7 items applied$/m);
  const after = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(after.code, 0);
  assert.match(after.out, /^0 items, 0 notes$/m);
});

test("a replace restores identity and leaves the rest of the file alone", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  const original = read(target);
  write(target, original.replace("File body.", "File\nbody rewrapped."));
  const applied = run(["apply", "--items", "1", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 0);
  assert.strictEqual(read(target), original);
});

// --- test case 6, second half: an author section survives an apply ---------

test("an unrelated apply leaves an author section where the author put it", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "design", "AGENTS.md");
  write(
    target,
    read(target)
      .replace("## Body\n", "## Local conventions\n\nOurs.\n\n## Body\n")
      .replace("Growth body.", "Growth\nbody rewrapped."),
  );
  const applied = run(["apply", "--items", "1", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 0);
  assert.deepStrictEqual(
    splitSections(read(target)).sections.map((s) => s.heading),
    ["# design/ — AGENTS", "## File", "## Local conventions", "## Body", "## Growth"],
  );
  const after = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(after.code, 0);
  assert.match(after.out, /^0 items, 1 note$/m);
});

// --- test case 8, second half: apply writes the target's line ending -------

test("a CRLF target keeps CRLF after an apply", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, read(target).replace("File body.", "File\nbody rewrapped.").replace(/\n/g, "\r\n"));
  const applied = run(["apply", "--items", "1", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 0);
  const written = read(target);
  assert.ok(written.includes("\r\n"));
  assert.strictEqual(written.replace(/\r\n/g, "\n").includes("File body."), true);
  const after = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(after.code, 0);
});

// --- test case 8, third part: apply writes the target's BOM back -----------

test("a BOM'd target keeps its BOM after an apply", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, `﻿${read(target).replace("File body.", "File\nbody rewrapped.")}`);
  const applied = run(["apply", "--items", "1", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 0);
  const raw = fs.readFileSync(target, "utf8");
  assert.strictEqual(raw.charCodeAt(0), 0xfeff);
  assert.ok(raw.includes("File body."));
  const after = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(after.code, 0);
});

// --- test case 9: errors ---------------------------------------------------

test("apply with no --items is exit 2 and writes nothing", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, read(target).replace("File body.", "Changed."));
  const before = read(target);
  const applied = run(["apply", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 2);
  assert.strictEqual(read(target), before);
});

test("apply with a number past the list is exit 2 and writes nothing", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, read(target).replace("File body.", "Changed."));
  const before = read(target);
  const applied = run(["apply", "--items", "1,9", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 2);
  assert.strictEqual(read(target), before);
});

test("apply cannot reach a note, which has no number", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "requirements", "AGENTS.md");
  write(target, "# Requirements\n\nOurs.\n");
  const listed = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.match(listed.out, /^0 items, 1 note$/m);
  const applied = run(["apply", "--items", "1", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 2);
  assert.strictEqual(read(path.join(docs, "requirements", "AGENTS.md")), "# Requirements\n\nOurs.\n");
});

test("a template with a repeated heading is exit 2", () => {
  const { templates, docs } = fakeInstall();
  const file = path.join(templates, "notes", "AGENTS.md");
  write(file, `${read(file)}\n## File\n\nAgain.\n`);
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 2);
});

test("a template with no H1 is exit 2", () => {
  const { templates, docs } = fakeInstall();
  write(path.join(templates, "notes", "AGENTS.md"), "Just prose.\n");
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 2);
});

test("a PascalCase doc-system under a root named Docs needs an explicit case", () => {
  const root = tmp();
  const templates = fakeTemplates(path.join(root, "templates"));
  const docs = path.join(root, "Docs");
  expandBundle(docs, "PascalCase", templates);
  const derived = run(["check", "--templates", templates, "--docs", docs]);
  assert.strictEqual(derived.code, 2);
  assert.match(derived.out, /--case/);
  const explicit = run(["check", "--templates", templates, "--docs", docs, "--case", "PascalCase"]);
  assert.strictEqual(explicit.code, 0);
});

test("an unknown subcommand and an unknown option are exit 2", () => {
  const { templates, docs } = fakeInstall();
  assert.strictEqual(run(["frobnicate", "--docs", docs]).code, 2);
  assert.strictEqual(run(["check", "--docs", docs, "--nope", "x"]).code, 2);
  assert.strictEqual(run(["check", "--templates", templates, "--docs", docs, "--case", "camelCase"]).code, 2);
  assert.strictEqual(run(["check", "--templates", templates, "--docs", docs, "--items", "1"]).code, 2);
});

// --- test case 5, on the real bundle ---------------------------------------
// The spec writes case 5 against the shipped `requirements` template, and task
// 9 quotes it as the evidence that closes issue-f623. The miniature-bundle
// cases above cover the same three insertion positions; this one makes the
// evidence a real template rather than a fixture the suite invented.

test("a section deleted from the real requirements copy is re-inserted in place", () => {
  const docs = path.join(tmp(), "docs");
  expandBundle(docs, "snake_case");
  const target = path.join(docs, "requirements", "AGENTS.md");
  const text = read(target);
  const start = text.indexOf("## requirements vs issues");
  const end = text.indexOf("## Growth", start);
  assert.ok(start > 0 && end > start);
  write(target, text.slice(0, start) + text.slice(end));
  const before = run(["check", "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(before.code, 1);
  assert.match(before.out, /^1\. add: .*requirements\/AGENTS\.md — ## requirements vs issues$/m);
  assert.strictEqual(run(["apply", "--items", "1", "--docs", docs, "--case", "snake_case"]).code, 0);
  assert.deepStrictEqual(
    splitSections(read(target)).sections.map((s) => s.heading),
    ["# requirements/ — AGENTS", "## File", "## Frontmatter", "## Body", "## requirements vs issues", "## Growth"],
  );
  const after = run(["check", "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(after.code, 0);
  assert.match(after.out, /^0 items, 0 notes$/m);
});

// --- fix wave (m-1, m-2, m-3, m-4, n-1): whole-branch review resolutions ----

test("an internal error in check exits 2, never 1, so the hook does not read it as items existing", () => {
  const { templates, docs } = fakeInstall();
  const originalJoin = path.join;
  path.join = () => {
    throw new TypeError("boom: simulated internal bug, not a domain error");
  };
  let result;
  try {
    result = callMain(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  } finally {
    path.join = originalJoin;
  }
  assert.strictEqual(result.code, 2);
  assert.strictEqual(result.out, "");
  assert.match(result.err, /^error: /);
});

test("apply prints the check-list number of each applied item, not a fresh index", () => {
  const { templates, docs } = fakeInstall();
  for (const type of ["design", "reports", "notes"]) {
    write(
      path.join(docs, type, "AGENTS.md"),
      read(path.join(docs, type, "AGENTS.md")).replace("File body.", "Changed."),
    );
  }
  const listed = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.match(listed.out, /^3 items, 0 notes$/m);
  const applied = run(["apply", "--items", "2", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 0);
  assert.match(applied.out, /^2\. replace: .*notes\/AGENTS\.md — ## File$/m);
  assert.match(applied.out, /^1 item applied$/m);
});

test("a mid-run apply failure prints what was already written, and names the vanished item's heading", () => {
  const { templates, docs } = fakeInstall();
  const targetA = path.join(docs, "design", "AGENTS.md");
  const targetB = path.join(docs, "notes", "AGENTS.md");
  write(targetA, read(targetA).replace("File body.", "Changed A."));
  write(targetB, read(targetB).replace("File body.", "Changed B."));
  const listed = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.match(listed.out, /^2 items, 0 notes$/m);

  // Deletes item 2's target right after item 1 is written, so the recomputed
  // list no longer contains item 2's identity -- a vanished-identity failure
  // without needing to fabricate a race.
  const originalWrite = fs.writeFileSync;
  let calls = 0;
  fs.writeFileSync = (...args) => {
    calls++;
    const result = originalWrite(...args);
    if (calls === 1) {
      fs.rmSync(targetB, { force: true });
    }
    return result;
  };
  let result;
  try {
    result = callMain(["apply", "--items", "1,2", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  } finally {
    fs.writeFileSync = originalWrite;
  }
  assert.strictEqual(result.code, 2);
  assert.match(result.out, /^1\. replace: .*design\/AGENTS\.md — ## File$/m);
  assert.match(result.err, /^error: item 2 \(replace: .*notes\/AGENTS\.md — ## File\) is no longer available$/m);
  assert.ok(read(targetA).includes("File body."));
});

test("a trailing space on the H1 yields a note whose two quoted texts differ visibly", () => {
  const { templates, docs } = fakeInstall();
  write(path.join(docs, "requirements", "AGENTS.md"), "# requirements/ — AGENTS \n\nOurs.\n");
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.ok(
    result.out.includes(
      `note: ${posix(docs)}/requirements/AGENTS.md — not kisou-managed: first heading is "# requirements/ — AGENTS ", expected "# requirements/ — AGENTS"`,
    ),
  );
});

test("an add and a replace in the same file converge to identity in either order", () => {
  for (const order of ["1,2", "2,1"]) {
    const { templates, docs } = fakeInstall();
    const target = path.join(docs, "reports", "AGENTS.md");
    const level = read(target);
    write(target, level.replace("## File\n\nFile body.\n\n", "").replace("Growth body.", "Growth changed."));
    const listed = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
    assert.match(listed.out, /^2 items, 0 notes$/m);
    const applied = run(["apply", "--items", order, "--templates", templates, "--docs", docs, "--case", "snake_case"]);
    assert.strictEqual(applied.code, 0, `order ${order}: ${applied.out}`);
    assert.strictEqual(read(target), level, `order ${order} did not converge to identity`);
    const after = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
    assert.strictEqual(after.code, 0);
    assert.match(after.out, /^0 items, 0 notes$/m);
  }
});

// --- fix round 1: a write failure in apply is a domain error, not a bug ----

test("a write failure during apply is exit 2 with no stack trace, not a rethrown bug", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, read(target).replace("File body.", "Changed."));
  const listed = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.match(listed.out, /^1 item, 0 notes$/m);

  const originalWrite = fs.writeFileSync;
  fs.writeFileSync = () => {
    throw Object.assign(new Error("EPERM: operation not permitted"), { code: "EPERM" });
  };
  let result;
  try {
    result = callMain(["apply", "--items", "1", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  } finally {
    fs.writeFileSync = originalWrite;
  }
  assert.strictEqual(result.code, 2);
  assert.strictEqual(result.out, "");
  assert.match(result.err, /^error: cannot write .*: EPERM: operation not permitted\n$/);
  assert.strictEqual(result.err.split("\n").length, 2);
});

// --- fix wave, task 13 (M-2): the preamble is kept and reported as a note --

test("a preamble above the H1 is kept and reported as a note, and survives an apply", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  const original = read(target);
  write(target, `A paragraph before the heading.\n\n${original}`);

  const before = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(before.code, 0);
  assert.strictEqual(
    before.out,
    [`note: ${posix(docs)}/notes/AGENTS.md — text before the first heading kept: 1 line`, "0 items, 1 note", ""].join(
      "\n",
    ),
  );

  write(target, read(target).replace("File body.", "File\nbody rewrapped."));
  const applied = run(["apply", "--items", "1", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 0);
  const finalText = read(target);
  assert.ok(finalText.startsWith("A paragraph before the heading.\n\n"));
  assert.strictEqual(finalText, `A paragraph before the heading.\n\n${original}`);

  const after = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(after.code, 0);
  assert.strictEqual(
    after.out,
    [`note: ${posix(docs)}/notes/AGENTS.md — text before the first heading kept: 1 line`, "0 items, 1 note", ""].join(
      "\n",
    ),
  );
});
