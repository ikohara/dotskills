const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const { normalize, parsePlan, lintPlan } = require("./passage-check.js");

const SCRIPT = path.join(__dirname, "passage-check.js");

function plan(lines) {
  return lines.join("\n") + "\n";
}

function writePlan(lines) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "passage-check-"));
  const file = path.join(dir, "plan.md");
  fs.writeFileSync(file, plan(lines), "utf8");
  return file;
}

function run(args) {
  try {
    const stdout = execFileSync(process.execPath, [SCRIPT, ...args], {
      encoding: "utf8",
    });
    return { code: 0, out: stdout };
  } catch (err) {
    return { code: err.status, out: `${err.stdout || ""}${err.stderr || ""}` };
  }
}

const REPLACEMENT = [
  "### Task 91: a fixture task",
  "",
  "**P91.1** `tmp/fixture.md` — replace exactly these 2 lines",
  "",
  "```text",
  "alpha",
  "beta",
  "```",
  "",
  "**P91.1 →**",
  "",
  "```text",
  "gamma",
  "```",
];

const INSERTION = [
  "### Task 92: another fixture task",
  "",
  "**A92.1** `tmp/fixture.md` — `grep -c alpha tmp/fixture.md` — before: 1, after: 1",
  "",
  "**P92.2** `tmp/fixture.md` — insert after these 1 lines",
  "",
  "```text",
  "alpha",
  "```",
  "",
  "**P92.2 →**",
  "",
  "```text",
  "delta",
  "```",
];

const SWEEP_CLEAN = [
  "### Task 94: the old-value sweep",
  "",
  "**O94.1** `alpha` — gone from `tmp/fixture.md`; P91.1 replaces it",
];

const SWEEP_TRAPPED = [
  "### Task 94: the old-value sweep",
  "",
  "**O94.1** `gamma` — gone from `tmp/fixture.md`; P91.1 replaces it",
];

const codes = (lines) => lintPlan(parsePlan(plan(lines))).map((p) => p.code);

test("normalize turns CRLF into LF", () => {
  assert.strictEqual(normalize("a\r\nb\r\n"), "a\nb\n");
});

test("a replacement inside a task body parses", () => {
  const parsed = parsePlan(plan(REPLACEMENT));
  assert.strictEqual(parsed.blocks.length, 1);
  const block = parsed.blocks[0];
  assert.strictEqual(block.id, "P91.1");
  assert.strictEqual(block.kind, "P");
  assert.strictEqual(block.task, 91);
  assert.strictEqual(block.ordinal, 1);
  assert.strictEqual(block.shape, "replace");
  assert.strictEqual(block.path, "tmp/fixture.md");
  assert.strictEqual(block.count, 2);
  assert.deepStrictEqual(block.old, ["alpha", "beta"]);
  assert.deepStrictEqual(block.new, ["gamma"]);
});

test("an insertion parses, and its new block omits the anchor lines", () => {
  const parsed = parsePlan(plan(INSERTION));
  const insertion = parsed.blocks.find((b) => b.id === "P92.2");
  assert.strictEqual(insertion.shape, "insert-after");
  assert.deepStrictEqual(insertion.old, ["alpha"]);
  assert.deepStrictEqual(insertion.new, ["delta"]);
  const anchor = parsed.blocks.find((b) => b.id === "A92.1");
  assert.strictEqual(anchor.kind, "A");
  assert.strictEqual(anchor.command, "grep -c alpha tmp/fixture.md");
  assert.strictEqual(anchor.before, "1");
  assert.strictEqual(anchor.after, "1");
});

test("an insert-before lead is read as insert-before", () => {
  const lines = INSERTION.slice();
  lines[4] = "**P92.2** `tmp/fixture.md` — insert before these 1 lines";
  const parsed = parsePlan(plan(lines));
  assert.strictEqual(parsed.blocks.find((b) => b.id === "P92.2").shape, "insert-before");
});

test("a global replacement carries its occurrence count", () => {
  const lines = REPLACEMENT.slice();
  lines[2] = "**P91.1** `tmp/fixture.md` — replace all 4 occurrences of these 2 lines";
  const block = parsePlan(plan(lines)).blocks[0];
  assert.strictEqual(block.shape, "replace-all");
  assert.strictEqual(block.occurrences, 4);
  assert.strictEqual(block.count, 2);
});

test("a singular lead parses, and both number agreements are accepted", () => {
  const one = REPLACEMENT.slice();
  one[2] = "**P91.1** `tmp/fixture.md` — replace exactly this 1 line";
  one.splice(6, 1);
  const block = parsePlan(plan(one)).blocks[0];
  assert.strictEqual(block.shape, "replace");
  assert.strictEqual(block.count, 1);
  assert.deepStrictEqual(block.old, ["alpha"]);
  assert.deepStrictEqual(codes(one), []);

  const all = one.slice();
  all[2] = "**P91.1** `tmp/fixture.md` — replace all 4 occurrences of this 1 line";
  const globalBlock = parsePlan(plan(all)).blocks[0];
  assert.strictEqual(globalBlock.shape, "replace-all");
  assert.strictEqual(globalBlock.occurrences, 4);
  assert.strictEqual(globalBlock.count, 1);

  const plural = one.slice();
  plural[2] = "**P91.1** `tmp/fixture.md` — replace exactly these 1 lines";
  assert.deepStrictEqual(codes(plural), []);
});

test("an old-value lead parses its needle", () => {
  const parsed = parsePlan(
    plan(["### Task 93: the sweep", "", "**O93.1** `Two signals` — gone from `roles/kanri.md`; P93.2 replaces it"]),
  );
  const block = parsed.blocks[0];
  assert.strictEqual(block.kind, "O");
  assert.strictEqual(block.needle, "Two signals");
});

test("a lead whose id or path is a placeholder is documentation and is skipped", () => {
  const parsed = parsePlan(
    plan([
      "### Task 1: a fixture task",
      "",
      "**P<id>** `<path>` — replace exactly these 1 lines",
      "",
      "```text",
      "alpha",
      "```",
    ]),
  );
  assert.deepStrictEqual(parsed.blocks, []);
});

test("a lead outside every task body is not resolved", () => {
  const parsed = parsePlan(plan(["## Context", ""].concat(REPLACEMENT.slice(2))));
  assert.deepStrictEqual(parsed.blocks, []);
});

test("the created list is read from the plan", () => {
  const parsed = parsePlan(
    plan(
      [
        "```text",
        "created: skills/tanto/scripts/passage-check.js",
        "created: skills/tanto/scripts/passage-check.test.js",
        "```",
      ].concat(REPLACEMENT),
    ),
  );
  assert.deepStrictEqual(parsed.created, [
    "skills/tanto/scripts/passage-check.js",
    "skills/tanto/scripts/passage-check.test.js",
  ]);
});

test("a well-formed plan lints clean", () => {
  assert.deepStrictEqual(codes(REPLACEMENT.concat([""], INSERTION)), []);
});

test("lint fails when zero task headings were found", () => {
  assert.deepStrictEqual(codes(["## Context", "", "Nothing here."]), ["no-task-headings"]);
});

test("lint reports a declared count that disagrees with its block", () => {
  const lines = REPLACEMENT.slice();
  lines[2] = "**P91.1** `tmp/fixture.md` — replace exactly these 3 lines";
  assert.deepStrictEqual(codes(lines), ["count-mismatch"]);
});

test("lint reports a repeated id", () => {
  const lines = REPLACEMENT.concat([""], REPLACEMENT.slice(2));
  assert.ok(codes(lines).includes("duplicate-id"));
});

test("lint reports an id cited in prose that has no block", () => {
  const lines = REPLACEMENT.concat(["", "Applied after P91.9, which does not exist."]);
  const problems = lintPlan(parsePlan(plan(lines)));
  assert.deepStrictEqual(
    problems.map((p) => p.code),
    ["missing-block"],
  );
  assert.strictEqual(problems[0].id, "P91.9");
});

test("lint reports an insertion with no anchor step", () => {
  const lines = INSERTION.slice(0, 2).concat(INSERTION.slice(4));
  assert.deepStrictEqual(codes(lines), ["insertion-without-anchor"]);
});

test("lint reports an anchor that omits a value", () => {
  const lines = INSERTION.slice();
  lines[2] = "**A92.1** `tmp/fixture.md` — `grep -c alpha tmp/fixture.md` — before: 1";
  assert.ok(codes(lines).includes("anchor-missing-value"));
});

test("a needle occurring outside every new-passage block lints clean", () => {
  assert.deepStrictEqual(codes(REPLACEMENT.concat([""], SWEEP_CLEAN)), []);
});

test("lint reports a needle the plan reproduces in its own new-passage text", () => {
  const problems = lintPlan(parsePlan(plan(REPLACEMENT.concat([""], SWEEP_TRAPPED))));
  assert.deepStrictEqual(
    problems.map((p) => p.code),
    ["needle-in-new-text"],
  );
  assert.strictEqual(problems[0].id, "O94.1");
});

test("lint exits 0 on a clean plan and 1 on a failing one", () => {
  const clean = writePlan(REPLACEMENT);
  assert.strictEqual(run(["lint", "--plan", clean]).code, 0);
  const broken = writePlan(["## Context", "", "Nothing here."]);
  const result = run(["lint", "--plan", broken]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /no-task-headings/);
});

test("an unreadable plan exits 2, not 1", () => {
  const missing = path.join(os.tmpdir(), "passage-check-absent", "plan.md");
  assert.strictEqual(run(["lint", "--plan", missing]).code, 2);
});

test("a CRLF plan parses the same as an LF one", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "passage-check-"));
  const file = path.join(dir, "plan.md");
  fs.writeFileSync(file, plan(REPLACEMENT).replace(/\n/g, "\r\n"), "utf8");
  assert.strictEqual(run(["lint", "--plan", file]).code, 0);
  const parsed = parsePlan(fs.readFileSync(file, "utf8"));
  assert.deepStrictEqual(parsed.blocks[0].old, ["alpha", "beta"]);
});

const { replayPlan } = require("./passage-check.js");

function makeRepo(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "passage-check-repo-"));
  const git = (...args) =>
    execFileSync(
      "git",
      ["-C", dir, "-c", "user.email=t@t", "-c", "user.name=t", "-c", "core.autocrlf=false", ...args],
      {
        encoding: "utf8",
      },
    );
  git("init", "-q");
  // Written into the fixture repository's own config, not just passed to
  // this helper's own git invocations, so that the script under test --
  // which runs its own `git diff` without this `-c` flag -- inherits it too,
  // instead of falling through to the host's global `core.autocrlf`.
  git("config", "core.autocrlf", "false");
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), content, "utf8");
    git("add", name);
  }
  git("commit", "-qm", "base");
  return { dir, git, head: git("rev-parse", "HEAD").trim() };
}

function runIn(cwd, args) {
  try {
    return { code: 0, out: execFileSync(process.execPath, [SCRIPT, ...args], { cwd, encoding: "utf8" }) };
  } catch (err) {
    return { code: err.status, out: `${err.stdout || ""}${err.stderr || ""}` };
  }
}

test("replay applies a passage to a copy of the base blob and exits 0", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const file = writePlan(REPLACEMENT);
  const result = runIn(repo.dir, ["replay", "--plan", file, "--base", repo.head]);
  assert.strictEqual(result.code, 0);
  assert.strictEqual(fs.readFileSync(path.join(repo.dir, "tmp/fixture.md"), "utf8"), "alpha\nbeta\n");
});

test("replay fails when an old passage occurs other than the stated number of times", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\nalpha\nbeta\n" });
  const file = writePlan(REPLACEMENT);
  const result = runIn(repo.dir, ["replay", "--plan", file, "--base", repo.head]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /P91\.1/);
});

test("replay re-runs each anchor against the applied copy and compares it with after", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\n" });
  const wrong = INSERTION.slice();
  wrong[2] = "**A92.1** `tmp/fixture.md` — `grep -c alpha tmp/fixture.md` — before: 1, after: 0";
  assert.strictEqual(runIn(repo.dir, ["replay", "--plan", writePlan(INSERTION), "--base", repo.head]).code, 0);
  assert.strictEqual(runIn(repo.dir, ["replay", "--plan", writePlan(wrong), "--base", repo.head]).code, 1);
});

test("replay restores the dominant line ending of the file it copied", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\r\nbeta\r\n" });
  const parsed = parsePlan(fs.readFileSync(writePlan(REPLACEMENT), "utf8"));
  const result = replayPlan(parsed, repo.head, { cwd: repo.dir });
  assert.strictEqual(result.ok, true);
  assert.strictEqual(fs.readFileSync(path.join(result.tree, "tmp/fixture.md"), "utf8"), "gamma\r\n");
});

test("replay prints residual O hits under a heading naming their count, and still exits 0", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const lines = REPLACEMENT.concat(["", "**O91.2** `alpha` — gone once P91.1 lands"]);
  const result = runIn(repo.dir, ["replay", "--plan", writePlan(lines), "--base", repo.head]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /1 residual/i);
});

test("replay skips a command that invokes passage-check verify", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const lines = REPLACEMENT.concat([
    "",
    "```bash",
    "node skills/tanto/scripts/passage-check.js verify --plan p.md --task 91",
    "```",
    "",
    "Expected: `0`",
  ]);
  const result = runIn(repo.dir, ["replay", "--plan", writePlan(lines), "--base", repo.head]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /skipped/i);
});

test("an unresolvable base exits 2 and names the ref, unlike an unknown subcommand", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const file = writePlan(REPLACEMENT);
  const unknown = runIn(repo.dir, ["no-such-subcommand", "--plan", file]);
  assert.strictEqual(unknown.code, 2);
  assert.doesNotMatch(unknown.out, /no-such-ref/);
  const result = runIn(repo.dir, ["replay", "--plan", file, "--base", "no-such-ref"]);
  assert.strictEqual(result.code, 2);
  assert.match(result.out, /no-such-ref/);
});

test("an empty command output is never a MATCH", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const lines = REPLACEMENT.concat(["", "```bash", "true", "```", "", "Expected: nothing in particular"]);
  const result = runIn(repo.dir, ["replay", "--plan", writePlan(lines), "--base", repo.head]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /DIFFERS/);
});

test("replay applies a global replacement across every declared occurrence", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\nalpha\nbeta\n" });
  const lines = REPLACEMENT.slice();
  lines[2] = "**P91.1** `tmp/fixture.md` — replace all 2 occurrences of these 2 lines";
  const result = runIn(repo.dir, ["replay", "--plan", writePlan(lines), "--base", repo.head]);
  assert.strictEqual(result.code, 0);
});

test("replay fails a global replacement whose old block occurs a different number of times", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const lines = REPLACEMENT.slice();
  lines[2] = "**P91.1** `tmp/fixture.md` — replace all 2 occurrences of these 2 lines";
  const result = runIn(repo.dir, ["replay", "--plan", writePlan(lines), "--base", repo.head]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /occurrence-count/);
});

test("replay finds and runs a four-backtick command fence", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const lines = REPLACEMENT.concat([
    "",
    "````bash",
    "echo four-backtick-ran",
    "````",
    "",
    "Expected: `four-backtick-ran`",
  ]);
  const result = runIn(repo.dir, ["replay", "--plan", writePlan(lines), "--base", repo.head]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /MATCH/);
});

test("diff passes when every added line is text the plan quotes", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  fs.writeFileSync(path.join(repo.dir, "tmp/fixture.md"), "gamma\n", "utf8");
  const result = runIn(repo.dir, ["diff", "--plan", writePlan(REPLACEMENT), "--base", repo.head]);
  assert.strictEqual(result.code, 0);
});

test("diff lists an added line the plan does not quote, and exits 1", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  fs.writeFileSync(path.join(repo.dir, "tmp/fixture.md"), "gamma\nepsilon\n", "utf8");
  const result = runIn(repo.dir, ["diff", "--plan", writePlan(REPLACEMENT), "--base", repo.head]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /epsilon/);
});

test("diff exempts a created path and names it in the output", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  fs.writeFileSync(path.join(repo.dir, "tmp/fixture.md"), "gamma\n", "utf8");
  fs.writeFileSync(path.join(repo.dir, "tmp/made.md"), "anything at all\n", "utf8");
  repo.git("add", "tmp/made.md");
  const lines = ["```text", "created: tmp/made.md", "```"].concat(REPLACEMENT);
  const result = runIn(repo.dir, ["diff", "--plan", writePlan(lines), "--base", repo.head]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /1 path exempt as created/);
  assert.match(result.out, /tmp\/made\.md/);
});

test("diff strips CR before classifying an added line", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  fs.writeFileSync(path.join(repo.dir, "tmp/fixture.md"), "gamma\r\n", "utf8");
  assert.strictEqual(runIn(repo.dir, ["diff", "--plan", writePlan(REPLACEMENT), "--base", repo.head]).code, 0);
});

test("diff reports a removed line that falls outside every fenced block", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\nzeta\n" });
  fs.writeFileSync(path.join(repo.dir, "tmp/fixture.md"), "gamma\n", "utf8");
  const result = runIn(repo.dir, ["diff", "--plan", writePlan(REPLACEMENT), "--base", repo.head]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /zeta/);
});

test("diff de-duplicates a created path the plan declares twice, exempting it once", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  fs.writeFileSync(path.join(repo.dir, "tmp/fixture.md"), "gamma\n", "utf8");
  fs.writeFileSync(path.join(repo.dir, "tmp/made.md"), "anything at all\n", "utf8");
  repo.git("add", "tmp/made.md");
  const lines = ["```text", "created: tmp/made.md", "created: tmp/made.md", "```"].concat(REPLACEMENT);
  const result = runIn(repo.dir, ["diff", "--plan", writePlan(lines), "--base", repo.head]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /1 path exempt as created/);
  assert.doesNotMatch(result.out, /2 paths exempt as created/);
});

test("diff's unresolvable base exits 2 and names the ref", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const result = runIn(repo.dir, ["diff", "--plan", writePlan(REPLACEMENT), "--base", "no-such-ref"]);
  assert.strictEqual(result.code, 2);
  assert.match(result.out, /no-such-ref/);
});

test("verify passes when a task new passage is present exactly once", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  fs.writeFileSync(path.join(repo.dir, "tmp/fixture.md"), "gamma\n", "utf8");
  const result = runIn(repo.dir, ["verify", "--plan", writePlan(REPLACEMENT), "--task", "91"]);
  assert.strictEqual(result.code, 0);
});

test("verify exits 2 on a non-numeric --task rather than reporting a false no-passages", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const result = runIn(repo.dir, ["verify", "--plan", writePlan(REPLACEMENT), "--task", "abc"]);
  assert.strictEqual(result.code, 2);
  assert.doesNotMatch(result.out, /no passages/i);
});

test("verify fails when a new passage is absent, and when it is present twice", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const file = writePlan(REPLACEMENT);
  assert.strictEqual(runIn(repo.dir, ["verify", "--plan", file, "--task", "91"]).code, 1);
  fs.writeFileSync(path.join(repo.dir, "tmp/fixture.md"), "gamma\ngamma\n", "utf8");
  assert.strictEqual(runIn(repo.dir, ["verify", "--plan", file, "--task", "91"]).code, 1);
  // A missing target file is an absent passage, not a crash: without the
  // read's try/catch fallback this would surface as an uncaught-exception
  // stack trace instead of a `passage-absent` report.
  fs.unlinkSync(path.join(repo.dir, "tmp/fixture.md"));
  const missing = runIn(repo.dir, ["verify", "--plan", file, "--task", "91"]);
  assert.strictEqual(missing.code, 1);
  assert.match(missing.out, /passage-absent/);
});

test("verify checks a task anchor against its after value", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\n" });
  fs.writeFileSync(path.join(repo.dir, "tmp/fixture.md"), "alpha\ndelta\n", "utf8");
  assert.strictEqual(runIn(repo.dir, ["verify", "--plan", writePlan(INSERTION), "--task", "92"]).code, 0);
  const wrong = INSERTION.slice();
  wrong[2] = "**A92.1** `tmp/fixture.md` — `grep -c alpha tmp/fixture.md` — before: 1, after: 3";
  assert.strictEqual(runIn(repo.dir, ["verify", "--plan", writePlan(wrong), "--task", "92"]).code, 1);
});

test("verify reports no passages for a task that touches only created paths", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const lines = [
    "```text",
    "created: tmp/made.md",
    "```",
    "",
    "### Task 94: only a created path",
    "",
    "Nothing but a new file.",
  ];
  const result = runIn(repo.dir, ["verify", "--plan", writePlan(lines), "--task", "94"]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /no passages/i);
});
