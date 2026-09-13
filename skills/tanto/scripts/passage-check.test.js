const test = require("node:test");
const { after, mock } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const { normalize, parsePlan, lintPlan } = require("./passage-check.js");

const SCRIPT = path.join(__dirname, "passage-check.js");

// Every temporary directory a helper below creates, so this file's own
// fixtures leave nothing behind under the OS temp dir -- the same obligation
// `runReplay` carries for `replayPlan`'s tree, just discharged at file
// teardown instead of per-call.
const tmpDirs = [];
function cleanupTmpDirs() {
  for (const dir of tmpDirs) {
    // Per-entry, so one locked directory does not stop every entry after
    // it in the array from being attempted too.
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // Best-effort teardown -- see above.
    }
  }
}
after(cleanupTmpDirs);

function plan(lines) {
  return lines.join("\n") + "\n";
}

function writePlan(lines) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "passage-check-"));
  tmpDirs.push(dir);
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

// Task 1 carries a passage; task 2 touches only a created: path and so has
// no P block of its own -- the boundary case Step 1's test checks against a
// task number (99) that matches no heading at all.
const TASK_ONE_AND_TWO = [
  "```text",
  "created: tmp/made.md",
  "```",
  "",
  "### Task 1: first fixture task",
  "",
  "**P1.1** `tmp/fixture.md` — replace exactly these 2 lines",
  "",
  "```text",
  "alpha",
  "beta",
  "```",
  "",
  "**P1.1 →**",
  "",
  "```text",
  "gamma",
  "```",
  "",
  "### Task 2: only a created path",
  "",
  "Nothing but a new file.",
];

// Two P blocks in one task carrying the same new text against the same
// path -- Step 2's grouping fixture.
const SHARED_NEW_TEXT = [
  "### Task 95: two blocks sharing new text",
  "",
  "**P95.1** `tmp/fixture.md` — replace exactly these 1 lines",
  "",
  "```text",
  "alpha",
  "```",
  "",
  "**P95.1 →**",
  "",
  "```text",
  "shared",
  "```",
  "",
  "**P95.2** `tmp/fixture.md` — replace exactly these 1 lines",
  "",
  "```text",
  "beta",
  "```",
  "",
  "**P95.2 →**",
  "",
  "```text",
  "shared",
  "```",
];

const WHOLE_FILE = [
  "### Task 96: a whole new file",
  "",
  "**W96.1** `tmp/new.md` — new file, 2 lines",
  "",
  "```text",
  "line one",
  "line two",
  "```",
];

// A replay-skip: declaration (column 0, `pattern — reason`) alongside a
// fenced command it matches.
const REPLAY_SKIP_FIXTURE = ["```text", "replay-skip: echo skip-marker — deliberately flaky in this fixture", "```"]
  .concat(REPLACEMENT)
  .concat(["", "```bash", "echo skip-marker and other words", "```", "", "Expected: `does not matter`"]);

// A P lead whose tail has no count, alongside a placeholder O lead
// (`<id>`/`<needle>`) that documents a convention rather than naming a
// real block.
const MALFORMED_AND_PLACEHOLDER = [
  "### Task 97: a malformed lead and a placeholder",
  "",
  "**P97.1** `tmp/fixture.md` — replace these",
  "",
  "**O<id>** `<needle>` — a placeholder, not a real block",
];

// A single replace-all block, alone in its group: its own declared
// occurrence count (4), not a flat group size of 1, is what verify must
// expect. This is the shape task 12's P12.4 uses in the plan this branch
// built.
const REPLACE_ALL_SINGLE = [
  "### Task 98: a single replace-all block",
  "",
  "**P98.1** `tmp/fixture.md` — replace all 4 occurrences of this 1 line",
  "",
  "```text",
  "alpha",
  "```",
  "",
  "**P98.1 →**",
  "",
  "```text",
  "gamma",
  "```",
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
  tmpDirs.push(dir);
  const file = path.join(dir, "plan.md");
  fs.writeFileSync(file, plan(REPLACEMENT).replace(/\n/g, "\r\n"), "utf8");
  assert.strictEqual(run(["lint", "--plan", file]).code, 0);
  const parsed = parsePlan(fs.readFileSync(file, "utf8"));
  assert.deepStrictEqual(parsed.blocks[0].old, ["alpha", "beta"]);
});

const { replayPlan, main } = require("./passage-check.js");

function makeRepo(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "passage-check-repo-"));
  tmpDirs.push(dir);
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

function replayTreeDirs() {
  return fs.readdirSync(os.tmpdir()).filter((name) => name.startsWith("passage-check-replay-"));
}

test("a CLI replay run removes its temporary tree, on a pass and on a failure alike", () => {
  const before1 = new Set(replayTreeDirs());
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const passResult = runIn(repo.dir, ["replay", "--plan", writePlan(REPLACEMENT), "--base", repo.head]);
  assert.strictEqual(passResult.code, 0);
  assert.deepStrictEqual(
    replayTreeDirs().filter((name) => !before1.has(name)),
    [],
  );

  const before2 = new Set(replayTreeDirs());
  const conflictRepo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\nalpha\nbeta\n" });
  const failResult = runIn(conflictRepo.dir, ["replay", "--plan", writePlan(REPLACEMENT), "--base", conflictRepo.head]);
  assert.strictEqual(failResult.code, 1);
  assert.deepStrictEqual(
    replayTreeDirs().filter((name) => !before2.has(name)),
    [],
  );
});

test("a CLI replay run also removes its tree when replayPlan throws after creating it (a plan path absent at base)", () => {
  // Unlike an unresolvable --base, which throws before replayPlan ever
  // creates a tree, a plan path that base does not have throws from `git
  // show` well after the tree already holds a partial copy -- the case
  // this test targets. The fixture repo below has no tmp/fixture.md at
  // all, so REPLACEMENT's P91.1 (which names that path) hits exactly that.
  const repo = makeRepo({ "unrelated.md": "irrelevant\n" });
  const before = new Set(replayTreeDirs());
  const result = runIn(repo.dir, ["replay", "--plan", writePlan(REPLACEMENT), "--base", repo.head]);
  assert.strictEqual(result.code, 2);
  assert.deepStrictEqual(
    replayTreeDirs().filter((name) => !before.has(name)),
    [],
  );
});

test("a locked temp tree does not turn a passing replay into a crash", () => {
  // Simulates the one failure mode force:true does not cover -- a locked
  // file on Windows -- by making rmSync itself throw. If runReplay's
  // cleanup let that escape its finally, this in-process call would throw
  // out of main() instead of returning, and the test would fail on the
  // uncaught exception rather than on the assertion below.
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const file = writePlan(REPLACEMENT);
  let lockedTree = null;
  const rm = mock.method(fs, "rmSync", (target) => {
    lockedTree = target;
    throw new Error("EBUSY: simulated lock, resource busy or locked");
  });
  const log = mock.method(console, "log", () => {});
  const cwd = process.cwd();
  let code;
  try {
    process.chdir(repo.dir);
    code = main(["replay", "--plan", file, "--base", repo.head]);
  } finally {
    process.chdir(cwd);
    rm.mock.restore();
    log.mock.restore();
  }
  assert.strictEqual(code, 0);
  // The mock above simulated a permanent lock, so runReplay's own cleanup
  // could not actually remove the tree -- the real fs.rmSync is restored
  // now, so remove it here instead, leaving this test's own footprint at
  // zero rather than trading one leak fixed for another introduced.
  assert.ok(lockedTree, "expected runReplay's cleanup to call fs.rmSync on its tree");
  fs.rmSync(lockedTree, { recursive: true, force: true });
});

test("a temp-directory creation failure exits 2 with usage, not an uncaught exception", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const file = writePlan(REPLACEMENT);
  const mkdtemp = mock.method(fs, "mkdtempSync", () => {
    throw new Error("EACCES: permission denied, mkdtemp");
  });
  let stderr = "";
  const stderrWrite = mock.method(process.stderr, "write", (chunk) => {
    stderr += chunk;
    return true;
  });
  const cwd = process.cwd();
  let code;
  try {
    process.chdir(repo.dir);
    code = main(["replay", "--plan", file, "--base", repo.head]);
  } finally {
    process.chdir(cwd);
    mkdtemp.mock.restore();
    stderrWrite.mock.restore();
  }
  assert.strictEqual(code, 2);
  assert.match(stderr, /EACCES/);
  assert.match(stderr, /Usage:/);
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
  // replayPlan never removes its own tree -- this call bypasses the CLI
  // wrapper that normally does -- so this test registers it with the same
  // file-teardown the other helpers use. The removal itself only runs once
  // every test in this file has finished, well after the read below.
  tmpDirs.push(result.tree);
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

test("replay skips the quoted $TANTO form of verify that the role files prescribe", () => {
  // The closing double quote sits where the skip rule once expected
  // whitespace, so the rule never fired on the form Sekkei is told to write
  // and every verify fence ran inside the applied tree (kisou-refresh bug
  // report, 2026-09-11).
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const lines = REPLACEMENT.concat([
    "",
    "```bash",
    'node "$TANTO/scripts/passage-check.js" verify --plan p.md --task 91',
    "```",
    "",
    "Expected: `0`",
  ]);
  const result = runIn(repo.dir, ["replay", "--plan", writePlan(lines), "--base", repo.head]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /skipped 1 command/i);
  assert.doesNotMatch(result.out, /DIFFERS/);
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

test("diff exempts the plan's own path, so a post-base edit to the plan is not an unexplained removal", () => {
  // A plan whose base is its own commit is edited after it — every cold-read
  // answer is such an edit — and the replaced lines never sit in a fence
  // (kisou-refresh bug report, 2026-09-11).
  const before = plan(REPLACEMENT.concat(["", "A prose line the cold read will change."]));
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n", "docs/plan.md": before });
  fs.writeFileSync(path.join(repo.dir, "tmp/fixture.md"), "gamma\n", "utf8");
  fs.writeFileSync(path.join(repo.dir, "docs/plan.md"), before.replace("will change", "has changed"), "utf8");
  const result = runIn(repo.dir, ["diff", "--plan", "docs/plan.md", "--base", repo.head]);
  assert.strictEqual(result.code, 0, result.out);
  assert.doesNotMatch(result.out, /unexplained-removed/);
  assert.doesNotMatch(result.out, /unaccounted-added/);
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

test("diff reports a removed line that is itself literally --- rather than reading it as a file header", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\n---\nzeta\n" });
  fs.writeFileSync(path.join(repo.dir, "tmp/fixture.md"), "gamma\n", "utf8");
  const result = runIn(repo.dir, ["diff", "--plan", writePlan(REPLACEMENT), "--base", repo.head]);
  assert.strictEqual(result.code, 1);
  // Reported selectively, not everything: the ordinary removed line still
  // shows up next to the `---` line that a loose `startsWith("---")` would
  // misread as `git diff`'s own file-header line and silently drop.
  assert.match(result.out, /unexplained-removed: tmp\/fixture\.md — ---/);
  assert.match(result.out, /unexplained-removed: tmp\/fixture\.md — zeta/);
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

test("verify --task <N> matching no task heading exits 2 before any passage is read, but a created-only task still reports no passages", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const file = writePlan(TASK_ONE_AND_TWO);

  const missing = runIn(repo.dir, ["verify", "--plan", file, "--task", "99"]);
  assert.strictEqual(missing.code, 2);
  assert.match(missing.out, /no such task in the plan: 99/);
  assert.match(missing.out, /Usage:/);

  const createdOnly = runIn(repo.dir, ["verify", "--plan", file, "--task", "2"]);
  assert.strictEqual(createdOnly.code, 0);
  assert.match(createdOnly.out, /no passages/i);
});

test("verifyTask groups P blocks sharing a target path and identical new text, expecting the group's size as the occurrence count", () => {
  const repo = makeRepo({ "tmp/fixture.md": "shared\nshared\n" });
  const result = runIn(repo.dir, ["verify", "--plan", writePlan(SHARED_NEW_TEXT), "--task", "95"]);
  assert.strictEqual(result.code, 0);
});

test("verify reports passage-count, stating expected and found, when a shared-text group's occurrence count disagrees", () => {
  const repo = makeRepo({ "tmp/fixture.md": "shared\n" });
  const result = runIn(repo.dir, ["verify", "--plan", writePlan(SHARED_NEW_TEXT), "--task", "95"]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /passage-count/);
  assert.match(result.out, /expected 2/);
  assert.match(result.out, /found 1/);
});

test("verify expects a lone replace-all block's own declared occurrence count, not a flat group size of 1", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\n" });
  const file = writePlan(REPLACE_ALL_SINGLE);

  fs.writeFileSync(path.join(repo.dir, "tmp/fixture.md"), "gamma\ngamma\ngamma\ngamma\n", "utf8");
  assert.strictEqual(runIn(repo.dir, ["verify", "--plan", file, "--task", "98"]).code, 0);

  fs.writeFileSync(path.join(repo.dir, "tmp/fixture.md"), "gamma\ngamma\n", "utf8");
  const result = runIn(repo.dir, ["verify", "--plan", file, "--task", "98"]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /passage-count/);
  assert.match(result.out, /expected 4/);
  assert.match(result.out, /found 2/);
});

test("a W lead parses with its path, count, and content", () => {
  const parsed = parsePlan(plan(WHOLE_FILE));
  assert.strictEqual(parsed.blocks.length, 1);
  const block = parsed.blocks[0];
  assert.strictEqual(block.kind, "W");
  assert.strictEqual(block.id, "W96.1");
  assert.strictEqual(block.path, "tmp/new.md");
  assert.strictEqual(block.count, 2);
  assert.deepStrictEqual(block.new, ["line one", "line two"]);
});

test("lint reports a W count that disagrees with its block", () => {
  const lines = WHOLE_FILE.slice();
  lines[2] = "**W96.1** `tmp/new.md` — new file, 3 lines";
  assert.deepStrictEqual(codes(lines), ["count-mismatch"]);
});

test("replay reports a replay-skip pattern's matching fence as skipped, with its stated reason", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const result = runIn(repo.dir, ["replay", "--plan", writePlan(REPLAY_SKIP_FIXTURE), "--base", repo.head]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /skipped: echo skip-marker and other words — deliberately flaky in this fixture/);
});

test("replay reports a fence with no Expected paragraph as run with no stated expectation, not as DIFFERS", () => {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  const lines = REPLACEMENT.concat(["", "```bash", "echo no-expectation-here", "```"]);
  const result = runIn(repo.dir, ["replay", "--plan", writePlan(lines), "--base", repo.head]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /ran \(no stated expectation\): echo no-expectation-here/);
  assert.doesNotMatch(result.out, /DIFFERS/);
});

test("lint reports a malformed P lead with no count as malformed-lead, and skips a placeholder O lead as documentation", () => {
  const problems = lintPlan(parsePlan(plan(MALFORMED_AND_PLACEHOLDER)));
  assert.deepStrictEqual(
    problems.map((p) => p.code),
    ["malformed-lead"],
  );
  assert.strictEqual(problems[0].id, "P97.1");
  // Asserted on the parse result itself, not only on lint's findings: the
  // documentation skip produces no O block at all, so this pins the skip
  // even though skipping it produces no lint finding either way.
  assert.strictEqual(parsePlan(plan(MALFORMED_AND_PLACEHOLDER)).blocks.length, 0);
});

test("the file-teardown cleanup removes both the plan-writing and repo-fixture helper directories", () => {
  // Regression guard for the two prefixes that made up the bulk of the
  // original leak (passage-check- and passage-check-repo-): the only other
  // assertion on tmpDirs' removal filters for passage-check-replay-, so a
  // no-op after() body, or a helper that stopped registering its
  // directory, would still leave 47/47 green without this.
  const planDir = path.dirname(writePlan(REPLACEMENT));
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  assert.ok(fs.existsSync(planDir));
  assert.ok(fs.existsSync(repo.dir));

  cleanupTmpDirs();

  assert.ok(!fs.existsSync(planDir));
  assert.ok(!fs.existsSync(repo.dir));
});

test("one directory whose removal fails does not stop the rest of the teardown loop from being attempted", () => {
  const lockedDir = path.dirname(writePlan(REPLACEMENT));
  const goodRepo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  assert.ok(fs.existsSync(lockedDir));
  assert.ok(fs.existsSync(goodRepo.dir));

  const originalRmSync = fs.rmSync;
  const rm = mock.method(fs, "rmSync", (target, options) => {
    if (target === lockedDir) {
      throw new Error("EBUSY: simulated lock, resource busy or locked");
    }
    return originalRmSync(target, options);
  });
  try {
    cleanupTmpDirs();
  } finally {
    rm.mock.restore();
  }

  // goodRepo.dir was registered after lockedDir, so it is only reached if
  // the loop keeps going past lockedDir's failure instead of aborting on it.
  assert.ok(!fs.existsSync(goodRepo.dir));
});

const { sectionsOf } = require("./passage-check.js");

// A report skeleton: two depth-2 sections with a deeper one inside the first,
// which is what every tanto report, brief and proposal looks like.
const REPORT = [
  "# Batch A report",
  "",
  "Preamble prose no reader names.",
  "",
  "## For Kanri",
  "",
  "The batch landed.",
  "",
  "### Deviations from the plan",
  "",
  "None.",
  "",
  "## Rulings",
  "",
  "One ruling needed.",
  "",
  "## Questions for the human",
  "",
  "Nothing blocking.",
];

test("sections prints a section's heading and body down to the next heading of the same depth", () => {
  const file = writePlan(REPORT);
  const result = run(["sections", "--file", file, "Rulings"]);
  assert.strictEqual(result.code, 0);
  assert.strictEqual(result.out, "## Rulings\n\nOne ruling needed.\n\n");
});

test("a deeper heading is body, and a deeper section ends at the next shallower heading", () => {
  const file = writePlan(REPORT);
  const whole = run(["sections", "--file", file, "For Kanri"]);
  assert.strictEqual(whole.code, 0);
  assert.match(whole.out, /### Deviations from the plan/);
  assert.match(whole.out, /None\./);
  assert.doesNotMatch(whole.out, /## Rulings/);

  const deeper = run(["sections", "--file", file, "Deviations from the plan"]);
  assert.strictEqual(deeper.code, 0);
  assert.strictEqual(deeper.out, "### Deviations from the plan\n\nNone.\n\n");
});

test("sections prints the named sections in the order the arguments give, not the file's", () => {
  const file = writePlan(REPORT);
  const result = run(["sections", "--file", file, "Questions for the human", "Rulings"]);
  assert.strictEqual(result.code, 0);
  assert.ok(
    result.out.indexOf("## Questions for the human") < result.out.indexOf("## Rulings"),
    "expected the argument order, not the document order",
  );
});

test("a name that matches no heading exits 1 after the rest is printed, naming it on stderr", () => {
  const file = writePlan(REPORT);
  const result = run(["sections", "--file", file, "Rulings", "Shoroku candidates", "Questions for the human"]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /^no section Shoroku candidates$/m);
  assert.match(result.out, /One ruling needed\./);
  assert.match(result.out, /Nothing blocking\./);

  const direct = sectionsOf(fs.readFileSync(file, "utf8"), ["Rulings", "Shoroku candidates"]);
  assert.deepStrictEqual(direct.missing, ["Shoroku candidates"]);
  assert.deepStrictEqual(direct.output, ["## Rulings", "", "One ruling needed.", ""]);
});

// `run` above concatenates the two streams, so it cannot tell a `no section`
// line written to stdout from one written to stderr -- the distinction spec
// 8.1 makes, and the one that matters: a caller is reading the printed
// sections out of stdout, and an error line there lands inside the body it is
// reading.
const { spawnSync } = require("node:child_process");

function runStreams(args) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" });
  return { code: result.status, stdout: result.stdout, stderr: result.stderr };
}

test("the no-section line goes to stderr, never into the stdout a caller is reading", () => {
  const file = writePlan(REPORT);
  const result = runStreams(["sections", "--file", file, "Rulings", "Shoroku candidates"]);
  assert.strictEqual(result.code, 1);
  assert.match(result.stderr, /^no section Shoroku candidates$/m);
  assert.doesNotMatch(result.stdout, /no section/);
  assert.strictEqual(result.stdout, "## Rulings\n\nOne ruling needed.\n\n");
});

test("the heading text is matched exactly and trimmed, never as a substring", () => {
  const file = writePlan(REPORT);
  const result = run(["sections", "--file", file, "Kanri"]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /no section Kanri/);
  assert.strictEqual(run(["sections", "--file", file, "  For Kanri  "]).code, 0);
});

test("sections exits 2 when no heading is named, and when the file cannot be read", () => {
  const file = writePlan(REPORT);
  const noHeading = run(["sections", "--file", file]);
  assert.strictEqual(noHeading.code, 2);
  assert.match(noHeading.out, /Usage:/);
  const missing = run(["sections", "--file", path.join(os.tmpdir(), "passage-check-absent", "report.md"), "Rulings"]);
  assert.strictEqual(missing.code, 2);
});

const { framePlan } = require("./passage-check.js");

// Tasks at three hashes under a `## Tasks` heading, as the plans in
// `docs/superpowers/plans/` are written, with a fenced block inside a step
// region whose own `##` line must neither end the region nor the task.
//
// The `## Tasks` heading is a trap, and it is here on purpose: a rule written
// as `^##+ Task` alone matches it, and `## Tasks` would then be a depth-2
// task swallowing Task 1's steps and Task 2's heading whole. Fix the rule,
// never this fixture.
const FRAME_PLAN = [
  "# A fixture plan",
  "",
  "## Global Constraints",
  "",
  "Commit by explicit path.",
  "",
  "## Batches",
  "",
  "| Batch | Tasks |",
  "",
  "## How a batch is verified",
  "",
  "Run the linter.",
  "",
  "## Tasks",
  "",
  "### Task 1: the first task",
  "",
  "Head prose for task 1.",
  "",
  "- [ ] **Step 1: do the thing**",
  "",
  "```bash",
  "echo one",
  "## not a heading, inside a fence",
  "```",
  "",
  "Expected: `one`",
  "",
  "### Task 2: the second task",
  "",
  "Head prose for task 2.",
  "",
  "- [ ] **Step 1: do the other thing**",
  "",
  "Prose inside the step.",
  "",
  "## Self-Review",
  "",
  "Nothing to review.",
];

// A `## Task` heading at two hashes (issue-ac9d), a step region that runs to
// the end of the file, and only one of the four stage-1 sections.
const FRAME_SHALLOW = [
  "# A shallow fixture plan",
  "",
  "## Global Constraints",
  "",
  "Only this section.",
  "",
  "## Task 1: a task at two hashes",
  "",
  "Head prose only.",
  "",
  "- [ ] **Step 1: the only step**",
  "",
  "Body of the step.",
];

test("frame prints everything outside the step regions, each region replaced by its line count", () => {
  const result = run(["frame", "--plan", writePlan(FRAME_SHALLOW)]);
  assert.strictEqual(result.code, 0);
  assert.strictEqual(
    result.out,
    [
      "# A shallow fixture plan",
      "",
      "## Global Constraints",
      "",
      "Only this section.",
      "",
      "## Task 1: a task at two hashes",
      "",
      "Head prose only.",
      "",
      "[steps: 3 lines]",
      "",
    ].join("\n"),
  );
});

test("a task heading at three hashes is a task too, and a fenced block inside a step region is skipped whole", () => {
  const result = run(["frame", "--plan", writePlan(FRAME_PLAN)]);
  assert.strictEqual(result.code, 0);
  // 9 lines, not the 4 a fence-blind reader would stop at: the `##` line
  // inside the fence ends neither the region nor the task.
  assert.match(result.out, /\[steps: 9 lines\]/);
  assert.match(result.out, /\[steps: 4 lines\]/);
  assert.doesNotMatch(result.out, /echo one/);
  assert.doesNotMatch(result.out, /not a heading, inside a fence/);
  assert.match(result.out, /## Self-Review/);
  assert.match(result.out, /Head prose for task 2\./);
});

test("a task heading is `Task` followed by a space and a number, so `## Tasks` is not one", () => {
  // Were `## Tasks` read as a task, stage 2 would print its head -- which
  // contains Task 1's heading -- and one count for it, so the heading lines
  // of the output are the discriminator, not the counts.
  const stage2 = framePlan(plan(FRAME_PLAN), { stage: 2 });
  assert.deepStrictEqual(
    stage2.output.filter((line) => /^#/.test(line)),
    ["### Task 1: the first task", "### Task 2: the second task"],
  );
  assert.deepStrictEqual(
    stage2.output.filter((line) => line.startsWith("[steps:")),
    ["[steps: 9 lines]", "[steps: 4 lines]"],
  );
});

test("frame --stage 1 prints the headings and the four fixed sections, and no task body", () => {
  const result = run(["frame", "--plan", writePlan(FRAME_PLAN), "--stage", "1"]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /Commit by explicit path\./);
  assert.match(result.out, /\| Batch \| Tasks \|/);
  assert.match(result.out, /Run the linter\./);
  assert.match(result.out, /Nothing to review\./);
  assert.match(result.out, /### Task 1: the first task/);
  assert.match(result.out, /### Task 2: the second task/);
  assert.doesNotMatch(result.out, /Head prose for task 1\./);
  assert.doesNotMatch(result.out, /\[steps:/);
});

test("frame --stage 2 prints each task's head and its step count, and nothing else", () => {
  const result = run(["frame", "--plan", writePlan(FRAME_PLAN), "--stage", "2"]);
  assert.strictEqual(result.code, 0);
  assert.strictEqual(
    result.out,
    [
      "### Task 1: the first task",
      "",
      "Head prose for task 1.",
      "",
      "[steps: 9 lines]",
      "### Task 2: the second task",
      "",
      "Head prose for task 2.",
      "",
      "[steps: 4 lines]",
      "",
    ].join("\n"),
  );
});

test("frame --task <N> prints that task whole, its steps and fences included", () => {
  const result = run(["frame", "--plan", writePlan(FRAME_PLAN), "--task", "1"]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /- \[ \] \*\*Step 1: do the thing\*\*/);
  assert.match(result.out, /echo one/);
  assert.doesNotMatch(result.out, /\[steps:/);
  assert.doesNotMatch(result.out, /### Task 2/);
  assert.doesNotMatch(result.out, /## Global Constraints/);
});

test("a plan missing one of the stage-1 sections prints what it has", () => {
  const result = run(["frame", "--plan", writePlan(FRAME_SHALLOW), "--stage", "1"]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /Only this section\./);
  assert.match(result.out, /## Task 1: a task at two hashes/);
  assert.doesNotMatch(result.out, /Self-Review/);
  assert.doesNotMatch(result.out, /Head prose only\./);
});

test("frame exits 2 on a --task no heading carries and on a --stage outside 1 and 2", () => {
  const file = writePlan(FRAME_PLAN);
  const missing = run(["frame", "--plan", file, "--task", "9"]);
  assert.strictEqual(missing.code, 2);
  assert.match(missing.out, /no such task in the plan: 9/);
  assert.match(missing.out, /Usage:/);
  const badStage = run(["frame", "--plan", file, "--stage", "3"]);
  assert.strictEqual(badStage.code, 2);
  assert.match(badStage.out, /invalid --stage '3'/);

  assert.deepStrictEqual(framePlan(plan(FRAME_PLAN), { task: 9 }), { output: [], found: false });
});

const { boundaryPlan } = require("./passage-check.js");

// A repository whose HEAD carries a Co-Authored-By trailer, so that the
// trailer check the fixture plan supplies as its own first command has
// something to find. `boundary` runs in the working tree, so unlike `replay`
// it never skips a git command.
function boundaryRepo() {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  repo.git("commit", "--allow-empty", "-qm", "base\n\nCo-Authored-By: Claude <noreply@anthropic.com>");
  return repo;
}

// The bash fences before the heading and under the next section of the same
// depth are the region bounds: `boundary` must run neither.
const BOUNDARY_PLAN = REPLACEMENT.concat([
  "",
  "```bash",
  "echo before-the-section",
  "```",
  "",
  "## How a batch is verified",
  "",
  "```bash",
  "git log -1 --format=%B | grep -c Co-Authored-By",
  "```",
  "",
  "Expected: `1`",
  "",
  "```bash",
  "echo boundary-second-check",
  "```",
  "",
  "Expected: `boundary-second-check`",
  "",
  "## Self-Review",
  "",
  "```bash",
  "echo outside-the-section",
  "```",
]);

// A two-line command whose output text differs from the command text, so
// that "printed once" and "the first line only" are both measurable.
const BOUNDARY_FAILING = REPLACEMENT.concat([
  "",
  "## How a batch is verified",
  "",
  "```bash",
  "printf 'boundary-output-%s\\n' once",
  "exit 3",
  "```",
  "",
  "Expected: `nothing in particular`",
]);

const BOUNDARY_NO_EXPECTATION = REPLACEMENT.concat(["", "## How a batch is verified", "", "```bash", "true", "```"]);

const BOUNDARY_SKIPPED = [
  "```text",
  "replay-skip: echo skip-marker — deliberately flaky in this fixture",
  "```",
].concat(REPLACEMENT, [
  "",
  "## How a batch is verified",
  "",
  "```bash",
  "echo skip-marker and other words",
  "```",
  "",
  "Expected: `does not matter`",
]);

test("boundary runs git status first, then each fence under the heading and none outside it", () => {
  const repo = boundaryRepo();
  const result = runIn(repo.dir, ["boundary", "--plan", writePlan(BOUNDARY_PLAN)]);
  assert.strictEqual(result.code, 0, result.out);
  assert.match(result.out, /^pass 1: git status --porcelain$/m);
  assert.match(result.out, /^pass 2: git log -1 --format=%B \| grep -c Co-Authored-By$/m);
  assert.match(result.out, /^pass 3: echo boundary-second-check$/m);
  assert.doesNotMatch(result.out, /before-the-section/);
  assert.doesNotMatch(result.out, /outside-the-section/);
});

test("boundary names a failing check by number and first line, prints its output once, and exits 1", () => {
  const repo = boundaryRepo();
  const result = runIn(repo.dir, ["boundary", "--plan", writePlan(BOUNDARY_FAILING)]);
  assert.strictEqual(result.code, 1);
  const failLine = result.out.split("\n").find((line) => line.startsWith("fail 2: "));
  assert.strictEqual(failLine, "fail 2: printf 'boundary-output-%s\\n' once");
  assert.strictEqual(result.out.split("boundary-output-once").length - 1, 1);
});

test("boundary exits 2 on a plan it cannot read and on one with no How a batch is verified heading", () => {
  const repo = boundaryRepo();
  const missing = path.join(os.tmpdir(), "passage-check-absent", "plan.md");
  assert.strictEqual(runIn(repo.dir, ["boundary", "--plan", missing]).code, 2);
  const noHeading = runIn(repo.dir, ["boundary", "--plan", writePlan(REPLACEMENT)]);
  assert.strictEqual(noHeading.code, 2);
  assert.match(noHeading.out, /How a batch is verified/);
});

test("boundary fails check 1 on a dirty working tree and still runs the checks after it", () => {
  const repo = boundaryRepo();
  fs.writeFileSync(path.join(repo.dir, "tmp/untracked.md"), "dirt\n", "utf8");
  const result = runIn(repo.dir, ["boundary", "--plan", writePlan(BOUNDARY_PLAN)]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /^fail 1: git status --porcelain$/m);
  assert.match(result.out, /tmp\/untracked\.md/);
  assert.match(result.out, /^pass 3: echo boundary-second-check$/m);
});

test("boundary honors a replay-skip marker and does not number the skipped block as a check", () => {
  const repo = boundaryRepo();
  const result = runIn(repo.dir, ["boundary", "--plan", writePlan(BOUNDARY_SKIPPED)]);
  assert.strictEqual(result.code, 0, result.out);
  assert.match(result.out, /^skipped: echo skip-marker and other words — deliberately flaky in this fixture$/m);
  assert.doesNotMatch(result.out, /pass 2:/);
});

test("boundaryPlan carries each fence's Expected paragraph, and null where the plan states none", () => {
  const repo = boundaryRepo();
  const stated = boundaryPlan(parsePlan(fs.readFileSync(writePlan(BOUNDARY_PLAN), "utf8")), { cwd: repo.dir });
  assert.strictEqual(stated.checks.length, 3);
  assert.strictEqual(stated.checks[2].expectation, "Expected: `boundary-second-check`");

  const bare = boundaryPlan(parsePlan(fs.readFileSync(writePlan(BOUNDARY_NO_EXPECTATION), "utf8")), { cwd: repo.dir });
  assert.strictEqual(bare.ok, true);
  assert.strictEqual(bare.checks.length, 2);
  assert.strictEqual(bare.checks[1].expectation, null);
  assert.strictEqual(bare.checks[1].status, "pass");
});

// A command that exits non-zero while printing exactly what its Expected
// paragraph states: `replay` would call this a MATCH, and `boundary` must
// still call it a failure.
const BOUNDARY_MATCHING_FAILURE = REPLACEMENT.concat([
  "",
  "## How a batch is verified",
  "",
  "```bash",
  "echo boundary-matching-output; exit 1",
  "```",
  "",
  "Expected: boundary-matching-output",
]);

test("boundary fails a check whose output matches its Expected paragraph but whose command exits non-zero", () => {
  const repo = boundaryRepo();
  const result = runIn(repo.dir, ["boundary", "--plan", writePlan(BOUNDARY_MATCHING_FAILURE)]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /^fail 2: echo boundary-matching-output; exit 1$/m);
  assert.match(result.out, /boundary-matching-output/);
});
