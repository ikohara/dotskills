const test = require("node:test");
const { before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");

const { normalize, extractQuotes, extractPathTokens } = require("./issue-liveness.js");

const SCRIPT = path.join(__dirname, "issue-liveness.js");

// Three sentences of 40 to 80 characters. A and B are broken across a line in
// the fixture's SKILL.md; C lives only under docs/reports/.
const SENTENCE_A = "The quick brown fox jumps over the lazy dog near the river bank";
const SENTENCE_B = "Pack my box with five dozen liquor jugs before the long journey";
const SENTENCE_C = "A report sentence that only exists under the reports directory";

const tmpDirs = [];
let fixture;
let outDir;
let rows;
let meta;

function mkTmp(prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tmpDirs.push(dir);
  return dir;
}

function git(dir, ...args) {
  return execFileSync(
    "git",
    ["-C", dir, "-c", "user.email=t@t", "-c", "user.name=t", "-c", "core.autocrlf=false", ...args],
    {
      encoding: "utf8",
    },
  );
}

function write(rel, content) {
  const file = path.join(fixture, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function issue(id, title, bodyLines) {
  return [
    "---",
    `id: ${id}`,
    `title: ${title}`,
    "severity: medium",
    "created: 2026-01-01",
    "---",
    ...bodyLines,
    "",
  ].join("\n");
}

function run(args, cwd) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { cwd, encoding: "utf8" });
}

function row(id) {
  const found = rows.find((r) => r.id === id);
  assert.ok(found, `row ${id} is present`);
  return found;
}

before(() => {
  fixture = mkTmp("issue-liveness-");
  git(fixture, "init", "-q", "-b", "main");
  git(fixture, "config", "core.autocrlf", "false");

  const half = (s) => {
    const cut = s.indexOf(" ", Math.floor(s.length / 2));
    return `${s.slice(0, cut)}\n${s.slice(cut + 1)}`;
  };
  write(
    "skills/demo/SKILL.md",
    `# Demo\n\nFirst paragraph.\n\n${half(SENTENCE_A)}\n\nMiddle paragraph.\n\n${half(SENTENCE_B)}\n\nLast paragraph.\n`,
  );
  write("skills/demo/roles/kanri.md", "one\ntwo\nthree\n");
  write("scripts/old-tool.js", "module.exports = 1;\n");
  write("docs/reports/2026-01-01-r.md", `# Report\n\n${SENTENCE_C}\n`);

  const src = ["Source: inbox 2026-01-01", ""];
  write(
    "docs/issues/open/aaaa-alive.md",
    issue("aaaa", "alive", [...src, `It says "${SENTENCE_A}" and names \`roles/kanri.md\`.`]),
  );
  write("docs/issues/open/bbbb-gone.md", issue("bbbb", "gone", [...src, `It says "${SENTENCE_B}".`]));
  write("docs/issues/deferred/cccc-path.md", issue("cccc", "path", [...src, "It names `scripts/old-tool.js`."]));
  write("docs/issues/open/dddd-none.md", issue("dddd", "none", [...src, "Nothing to check here."]));
  write(
    "docs/issues/open/eeee-partly.md",
    issue("eeee", "partly", [...src, `It says "${SENTENCE_A}" and "${SENTENCE_C}", at \`skills/demo/SKILL.md:999\`.`]),
  );
  write(
    "docs/issues/open/ffff-crlf.md",
    issue("ffff", "crlf", [...src, `It says "${SENTENCE_A}".`]).replace(/\n/g, "\r\n"),
  );

  git(fixture, "add", "-A");
  git(fixture, "commit", "-q", "-m", "add the fixture");

  const skill = path.join(fixture, "skills/demo/SKILL.md");
  const text = fs.readFileSync(skill, "utf8");
  const start = text.indexOf(half(SENTENCE_B));
  assert.ok(start > 0, "sentence B is in the fixture");
  fs.writeFileSync(skill, text.slice(0, start) + text.slice(start + half(SENTENCE_B).length + 2));
  git(fixture, "commit", "-q", "-a", "-m", "remove the stale sentence");

  git(fixture, "rm", "-q", "scripts/old-tool.js");
  git(fixture, "commit", "-q", "-m", "delete the old tool");

  outDir = path.join(mkTmp("issue-liveness-out-"), "nested");
  const result = run(["--out", outDir], fixture);
  assert.equal(result.status, 0, result.stderr);
  const data = JSON.parse(fs.readFileSync(path.join(outDir, "liveness.json"), "utf8"));
  meta = data[0].meta;
  rows = data.slice(1);
});

after(() => {
  for (const dir of tmpDirs) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // Best-effort teardown; one locked directory must not stop the rest.
    }
  }
});

test("verdicts per issue and in the meta element", () => {
  assert.equal(meta.ref, "main");
  assert.deepEqual(meta.verdicts, { alive: 2, gone: 2, partly: 1, none: 1 });
  assert.equal(meta.total, 6);
  assert.equal(rows.length, 6);
  assert.match(meta.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(typeof meta.wallSeconds, "number");
  assert.deepEqual(
    rows.map((r) => r.id),
    ["aaaa", "bbbb", "cccc", "dddd", "eeee", "ffff"],
  );

  assert.equal(row("aaaa").verdict, "alive");
  assert.deepEqual(row("aaaa").counts, { alive: 2, gone: 0, none: 0 });
  assert.equal(row("bbbb").verdict, "gone");
  assert.deepEqual(row("bbbb").counts, { alive: 0, gone: 1, none: 0 });
  assert.equal(row("cccc").verdict, "gone");
  assert.deepEqual(row("cccc").counts, { alive: 0, gone: 1, none: 0 });
  assert.equal(row("cccc").dir, "deferred");
  assert.equal(row("dddd").verdict, "none");
  assert.deepEqual(row("dddd").counts, { alive: 0, gone: 0, none: 0 });
  assert.equal(row("eeee").verdict, "partly");
  assert.deepEqual(row("eeee").counts, { alive: 1, gone: 1, none: 1 });
  assert.equal(row("ffff").verdict, "alive");
  assert.equal(row("aaaa").source, "inbox 2026-01-01");
  assert.equal(row("aaaa").sourceKind, "inbox");
  assert.equal(row("aaaa").citesExp, false);
});

test("a gone quote names the commit that removed it, across a source line break", () => {
  const item = row("bbbb").items[0];
  assert.equal(item.kind, "quote");
  assert.equal(item.state, "gone");
  assert.deepEqual(item.removedBy, { subject: "remove the stale sentence", path: "skills/demo/SKILL.md" });
});

test("a gone path token names the commit that deleted it", () => {
  const item = row("cccc").items[0];
  assert.equal(item.kind, "path");
  assert.equal(item.state, "gone");
  assert.deepEqual(item.removedBy, { subject: "delete the old tool", path: "scripts/old-tool.js" });
});

test("a quote wrapped across a line in the source is found alive", () => {
  const item = row("aaaa").items.find((i) => i.kind === "quote");
  assert.equal(item.state, "alive");
  assert.equal(item.foundIn, "skills/demo/SKILL.md");
});

test("a needle present only under docs/issues or docs/reports reads gone", () => {
  const item = row("eeee").items.find((i) => i.kind === "quote" && i.text === SENTENCE_C);
  assert.ok(item, "the quote of C is an item");
  assert.equal(item.state, "gone");
  assert.equal(item.removedBy, null);
});

test("a skill-relative path token resolves alive by suffix", () => {
  const item = row("aaaa").items.find((i) => i.kind === "path");
  assert.equal(item.text, "roles/kanri.md");
  assert.equal(item.state, "alive");
  assert.equal(item.foundIn, "skills/demo/roles/kanri.md");
});

test("a line hint past the end of the file reads partly", () => {
  const item = row("eeee").items.find((i) => i.kind === "path");
  assert.equal(item.text, "skills/demo/SKILL.md:999");
  assert.equal(item.state, "partly");
  assert.equal(item.foundIn, "skills/demo/SKILL.md");
});

test("CRLF input is read as LF", () => {
  const ffff = row("ffff");
  assert.equal(ffff.title, "crlf");
  assert.equal(ffff.sourceKind, "inbox");
  assert.equal(ffff.items[0].state, "alive");
  assert.equal(normalize("a\r\n  b `c` [d](e)"), "a b c d");
});

test("extraction units", () => {
  const q30 = "x".repeat(30);
  const q29 = "x".repeat(29);
  const q141 = "x".repeat(141);
  const quotes = extractQuotes(
    `a "${q30}" b “${"y".repeat(30)}” c "${q29}" d "${q141}" e "${"z".repeat(20)}\n${"z".repeat(20)}" f`,
  );
  assert.deepEqual(quotes, [q30, "y".repeat(30), `${"z".repeat(20)}\n${"z".repeat(20)}`]);
  assert.deepEqual(extractQuotes(`"${q30}" and "${q30}"`), [q30]);

  const tokens = extractPathTokens(
    [
      "`skills/x/y.md:12-14`",
      "`SKILL.md`",
      "`.tanto/x/y.md`",
      "`~/x.md`",
      "`$TANTO/x.js`",
      "`<dir>/x.md`",
      "`two words.md`",
      "`plainword`",
      "`a/b.sh:7`",
    ].join(" "),
  );
  assert.deepEqual(tokens, [
    { token: "skills/x/y.md", hint: { from: 12, to: 14 } },
    { token: "SKILL.md", hint: null },
    { token: "a/b.sh", hint: { from: 7, to: 7 } },
  ]);
});

test("exit codes", () => {
  const ok = run(["--out", path.join(mkTmp("issue-liveness-out-"), "ok")], fixture);
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /^verdicts: alive 2, gone 2, partly 1, none 1\nwall: \d+\.\d s\n$/);

  const out = path.join(mkTmp("issue-liveness-out-"), "x");
  const cases = [
    ["--docs", path.join(fixture, "no-such-dir"), "--out", out],
    ["--ref", "no-such-ref", "--out", out],
    ["--bogus", "--out", out],
    [],
  ];
  for (const args of cases) {
    const result = run(args, fixture);
    assert.equal(result.status, 1, `args ${JSON.stringify(args)}`);
    assert.equal(result.stderr.split("\n").filter(Boolean).length, 1, result.stderr);
    assert.ok(result.stderr.endsWith("\n"));
  }

  const notRepo = mkTmp("issue-liveness-norepo-");
  const result = run(["--out", out], notRepo);
  assert.equal(result.status, 1);
  assert.equal(result.stderr.split("\n").filter(Boolean).length, 1, result.stderr);
});
