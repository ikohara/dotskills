const test = require("node:test");
const { after } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const SCRIPT = path.join(__dirname, "boundary.js");
const TANTO = path.dirname(__dirname);

// Every temporary directory a helper below creates, so this file's own
// fixtures leave nothing behind under the OS temp dir.
const tmpDirs = [];
function tmpDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tanto-boundary-"));
  tmpDirs.push(dir);
  return dir;
}
after(() => {
  for (const dir of tmpDirs) {
    // Per-entry, so one locked directory does not stop every entry after it.
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // Best-effort teardown -- see above.
    }
  }
});

function write(dir, name, body) {
  const file = path.join(dir, name);
  fs.writeFileSync(file, body, "utf8");
  return file;
}

// The run's cwd is the fixture directory, never the repository: `boundary`
// runs the plan's checks in `process.cwd()`, and a real repository's state
// must never decide a test's result.
function run(args, cwd) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: "utf8",
    cwd,
  });
  return { code: result.status, out: result.stdout || "", err: result.stderr || "" };
}

const PLAN = [
  "# Fixture plan",
  "",
  "## How a batch is verified",
  "",
  "```bash",
  "true",
  "```",
  "",
  "Expected: nothing.",
  "",
].join("\n");

const REPORT = [
  "# Batch F report — tasks 1 to 2",
  "",
  "- Plan — plan.md",
  "- Transcript — transcript: 11 B, 22 records, 3 wake-ups, 0 compactions, context=44",
  "- Ceiling — ceiling: jisso baseline=10 + 2 x 5 = 20 — context=44 over",
  "",
  "## Rulings",
  "",
  "- R-1 applied",
  "",
  "## Questions for the human",
  "",
  "none",
  "",
  "## Deviations from the plan",
  "",
  "none",
  "",
  "## Shoroku proposal",
  "",
  "1. an item",
  "",
  "## For Kanri",
  "",
  "### Rulings needed",
  "",
  "- none",
  "",
  "### Verify in the tree",
  "",
  "- run `true`",
  "",
].join("\n");

const MEASUREMENT = [
  "# Measurement report",
  "",
  "## Tasks",
  "",
  "the tool ran",
  "",
  "## Verification",
  "",
  "the prediction held for two of three",
  "",
].join("\n");

function fixture() {
  const dir = tmpDir();
  return {
    dir,
    plan: write(dir, "plan.md", PLAN),
    report: write(dir, "report.md", REPORT),
  };
}

test("check prints the check: line first and each child under its heading", () => {
  const f = fixture();
  const result = run(["check", "--plan", f.plan, "--report", f.report, "--base", "HEAD", "--tanto", TANTO], f.dir);
  const lines = result.out.split("\n");
  assert.match(lines[0], /^check: (pass|fail) — boundary (pass|fail); diff (pass|fail) \(informational\)$/);
  for (const heading of ["## boundary", "## diff", "## sections", "## jisso reading"]) {
    assert.ok(result.out.includes(`\n${heading}\n`), `${heading} is missing`);
  }
  // Outside a repository both halves fail, so the verdict and the exit code
  // are the failing ones, and that is the mapping under test.
  assert.strictEqual(lines[0], "check: fail — boundary fail; diff fail (informational)");
  assert.strictEqual(result.code, 1);
});

test("only boundary gates the verdict; diff prints but never fails it", () => {
  const f = fixture();
  // `boundary` passes on a plan whose verification list is one `true` fence
  // when it runs inside a git repository, so this case runs in the real one
  // and asserts the mapping rather than the outcome: whatever `diff` says,
  // the verdict word repeats `boundary`'s.
  const args = ["check", "--plan", f.plan, "--report", f.report, "--base", "HEAD", "--tanto", TANTO];
  const result = run(args, f.dir);
  const first = result.out.split("\n")[0];
  const boundaryWord = /boundary (pass|fail)/.exec(first)[1];
  const verdictWord = /^check: (pass|fail)/.exec(first)[1];
  assert.strictEqual(verdictWord, boundaryWord);
  assert.strictEqual(result.code, boundaryWord === "pass" ? 0 : 1);
  assert.match(first, /diff (pass|fail) \(informational\)$/);
});

test("check reads the report's header for the jisso reading, and not its body", () => {
  const f = fixture();
  const result = run(["check", "--plan", f.plan, "--report", f.report, "--base", "HEAD", "--tanto", TANTO], f.dir);
  const block = result.out.split("\n## jisso reading\n")[1] || "";
  assert.match(block, /transcript: 11 B, 22 records, 3 wake-ups, 0 compactions, context=44/);
  assert.match(block, /ceiling: jisso baseline=10/);
  assert.ok(!block.includes("R-1 applied"), "the report's body leaked into the reading block");
});

test("check prints the five report headings through passage-check sections", () => {
  const f = fixture();
  const result = run(["check", "--plan", f.plan, "--report", f.report, "--base", "HEAD", "--tanto", TANTO], f.dir);
  const block = result.out.split("\n## sections\n")[1].split("\n## jisso reading\n")[0];
  for (const heading of [
    "For Kanri",
    "Rulings",
    "Questions for the human",
    "Deviations from the plan",
    "Shoroku proposal",
  ]) {
    assert.ok(block.includes(heading), `${heading} is missing from the sections block`);
  }
  // `Rulings needed` and `Verify in the tree` are `###` headings inside For
  // Kanri and print with it, so neither is named a second time.
  assert.ok(block.includes("Rulings needed"), "Rulings needed did not print with For Kanri");
  assert.ok(block.includes("Verify in the tree"), "Verify in the tree did not print with For Kanri");
});

test("check adds ## measurement only when --measurement is given", () => {
  const f = fixture();
  const without = run(["check", "--plan", f.plan, "--report", f.report, "--base", "HEAD", "--tanto", TANTO], f.dir);
  assert.ok(!without.out.includes("\n## measurement\n"));
  const file = write(f.dir, "measurement.md", MEASUREMENT);
  const withIt = run(
    ["check", "--plan", f.plan, "--report", f.report, "--base", "HEAD", "--measurement", file, "--tanto", TANTO],
    f.dir,
  );
  assert.ok(withIt.out.includes("\n## measurement\n"));
  const block = withIt.out.split("\n## measurement\n")[1].split("\n## jisso reading\n")[0];
  assert.ok(block.includes("the tool ran"));
  assert.ok(block.includes("the prediction held for two of three"));
});

test("check adds ## kanri reading only when --kanri-transcript is given", () => {
  const f = fixture();
  const transcript = write(
    f.dir,
    "kanri.jsonl",
    `${JSON.stringify({
      type: "user",
      timestamp: "2026-09-19T00:00:00.000Z",
      origin: { kind: "human" },
      message: { role: "user", content: "start" },
    })}\n${JSON.stringify({
      type: "assistant",
      message: {
        role: "assistant",
        usage: { input_tokens: 1, cache_creation_input_tokens: 2, cache_read_input_tokens: 3 },
      },
    })}\n`,
  );
  const result = run(
    [
      "check",
      "--plan",
      f.plan,
      "--report",
      f.report,
      "--base",
      "HEAD",
      "--kanri-transcript",
      transcript,
      "--tanto",
      TANTO,
    ],
    f.dir,
  );
  assert.ok(result.out.includes("\n## kanri reading\n"));
  const block = result.out.split("\n## kanri reading\n")[1];
  assert.match(block, /transcript: \d+ B, \d+ records/);
  assert.match(block, /ceiling: kanri baseline=/);
  assert.match(block, /human: last=/);
});

test("check exits 2 when an argument is unnamed and when a path is absent", () => {
  const f = fixture();
  const noBase = run(["check", "--plan", f.plan, "--report", f.report, "--tanto", TANTO], f.dir);
  assert.strictEqual(noBase.code, 2);
  assert.match(noBase.err, /check needs --base/);
  const gone = run(
    ["check", "--plan", f.plan, "--report", path.join(f.dir, "nope.md"), "--base", "HEAD", "--tanto", TANTO],
    f.dir,
  );
  assert.strictEqual(gone.code, 2);
  assert.match(gone.err, /--report .* is not on disk/);
});

test("an unknown subcommand exits 2 and names the three that exist", () => {
  const f = fixture();
  const result = run(["verify"], f.dir);
  assert.strictEqual(result.code, 2);
  assert.match(result.err, /check\|record\|census/);
});

// The ledger and the roster the tests write to are copies of the templates
// this skill ships, so a change to a fixed table's shape fails here first.
function ledgerAndRoster() {
  const dir = tmpDir();
  const ledger = path.join(dir, "kanri.md");
  const roster = path.join(dir, "roster.md");
  fs.copyFileSync(path.join(TANTO, "templates", "kanri.md"), ledger);
  fs.copyFileSync(path.join(TANTO, "templates", "roster.md"), roster);
  return { dir, ledger, roster };
}

const KANRI_READING = "transcript: 1 B, 2 records, 3 wake-ups, 0 compactions, context=4 ttl=1h";
const JISSO_READING = "transcript: 5 B, 6 records, 7 wake-ups, 0 compactions, context=8";

function recordArgs(fixture) {
  return [
    "record",
    "--ledger",
    fixture.ledger,
    "--roster",
    fixture.roster,
    "--batch",
    "Z",
    "--tasks",
    "1-3",
    "--state",
    "reported",
    "--verdict",
    "check: pass — boundary pass, diff pass",
    "--progress",
    "batch Z reported, ruling pending",
    "--kanri",
    "kanri-z [aaaaaa]",
    "--kanri-reading",
    KANRI_READING,
    "--jisso",
    "jisso-z [bbbbbb]",
    "--jisso-reading",
    JISSO_READING,
    "--s-item",
    "batch-Z-report.md item 1 | an item worth keeping",
    "--event",
    "boundary Z verified",
    "--now",
    "2026-09-19 10:00",
  ];
}

test("record run twice changes nothing the second time", () => {
  const fixture = ledgerAndRoster();
  const args = recordArgs(fixture);
  const first = run(args, fixture.dir);
  assert.strictEqual(first.code, 0, first.err);
  const ledgerAfterOne = fs.readFileSync(fixture.ledger, "utf8");
  const rosterAfterOne = fs.readFileSync(fixture.roster, "utf8");
  const second = run(args, fixture.dir);
  assert.strictEqual(second.code, 0, second.err);
  assert.strictEqual(fs.readFileSync(fixture.ledger, "utf8"), ledgerAfterOne);
  assert.strictEqual(fs.readFileSync(fixture.roster, "utf8"), rosterAfterOne);
  assert.strictEqual(second.out, first.out);
});

test("record writes the Batches row, drops the placeholder, and prints what it wrote", () => {
  const fixture = ledgerAndRoster();
  const result = run(recordArgs(fixture), fixture.dir);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(ledger.includes("| Z | 1-3 | reported |"), ledger);
  assert.ok(!ledger.includes("(no batch yet)"));
  assert.ok(!ledger.includes("(no item yet)"));
  assert.ok(result.out.includes("| Z | 1-3 | reported |"));
});

test("a second call rewrites only the cells its arguments name", () => {
  const fixture = ledgerAndRoster();
  run(recordArgs(fixture), fixture.dir);
  const args = ["record", "--ledger", fixture.ledger, "--batch", "Z", "--state", "accepted"];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 0, result.err);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(ledger.includes("| Z | 1-3 | accepted |"), ledger);
  assert.ok(ledger.includes("check: pass — boundary pass, diff pass"));
});

test("a rework's key is a row of its own, and every earlier row keeps its cells (spec 1.3)", () => {
  const fixture = ledgerAndRoster();
  const record = (...args) => {
    const result = run(["record", "--ledger", fixture.ledger, ...args], fixture.dir);
    assert.strictEqual(result.code, 0, result.err);
  };
  const rowOf = (key) =>
    fs
      .readFileSync(fixture.ledger, "utf8")
      .split(/\r?\n/)
      .find((line) => line.startsWith(`| ${key} |`));
  record("--batch", "B", "--tasks", "4-7", "--state", "rework", "--prompt", "batch-B-prompt.md");
  record("--batch", "B", "--report", "batch-B-report.md", "--verdict", "Task 5 returned: its test pins the old line");
  record("--batch", "fix wave", "--tasks", "fix wave", "--state", "rework", "--verdict", "one finding left open");
  const firstPass = rowOf("B");
  const fixWave = rowOf("fix wave");
  record("--batch", "B-rework-1", "--tasks", "5", "--state", "planned", "--prompt", "batch-B-rework-1-prompt.md");
  record("--batch", "B-rework-1", "--state", "rework", "--report", "batch-B-rework-1-report.md", "--verdict", "open");
  record("--batch", "B-rework-2", "--tasks", "5", "--state", "planned", "--prompt", "batch-B-rework-2-prompt.md");
  record("--batch", "fixwave-rework-1", "--tasks", "fix wave", "--state", "planned");
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.strictEqual(rowOf("B"), firstPass, ledger);
  assert.strictEqual(rowOf("fix wave"), fixWave, ledger);
  assert.strictEqual(
    rowOf("B-rework-1"),
    "| B-rework-1 | 5 | rework | batch-B-rework-1-prompt.md | batch-B-rework-1-report.md | open |",
  );
  assert.strictEqual(rowOf("B-rework-2"), "| B-rework-2 | 5 | planned | batch-B-rework-2-prompt.md |  |  |");
  assert.strictEqual(rowOf("fixwave-rework-1"), "| fixwave-rework-1 | fix wave | planned |  |  |  |");
  const order = ["B", "fix wave", "B-rework-1", "B-rework-2", "fixwave-rework-1"].map((key) =>
    ledger.indexOf(`| ${key} |`),
  );
  assert.deepStrictEqual(
    [...order].sort((a, b) => a - b),
    order,
    ledger,
  );
});

test("a State the Batches table does not name is refused and nothing is written", () => {
  const fixture = ledgerAndRoster();
  const before = fs.readFileSync(fixture.ledger, "utf8");
  const args = ["record", "--ledger", fixture.ledger, "--batch", "Z", "--state", "done"];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 1);
  assert.match(result.err, /did not find a State the Batches table names/);
  assert.strictEqual(fs.readFileSync(fixture.ledger, "utf8"), before);
});

test("the S-n counter reads the table it appends to", () => {
  const fixture = ledgerAndRoster();
  run(recordArgs(fixture), fixture.dir);
  const args = [
    "record",
    "--ledger",
    fixture.ledger,
    "--batch",
    "Z",
    "--s-item",
    "exit-kanri-proposal.md item 2 | a second item",
    "--now",
    "2026-09-19 11:00",
  ];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 0, result.err);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(ledger.includes("| S-1 | batch-Z-report.md item 1 |"), ledger);
  assert.ok(ledger.includes("| S-2 | exit-kanri-proposal.md item 2 |"), ledger);
});

test("the Measurements entry replaces its own batch and leaves the others alone", () => {
  const fixture = ledgerAndRoster();
  const earlier = [
    "record",
    "--ledger",
    fixture.ledger,
    "--roster",
    fixture.roster,
    "--batch",
    "Y",
    "--kanri",
    "kanri-y [cccccc]",
    "--kanri-reading",
    "transcript: 1 B, 1 records, 1 wake-ups, 0 compactions, context=11 ttl=1h",
    "--jisso",
    "jisso-y [dddddd]",
    "--jisso-reading",
    JISSO_READING,
    "--now",
    "2026-09-19 09:00",
  ];
  assert.strictEqual(run(earlier, fixture.dir).code, 0);
  run(recordArgs(fixture), fixture.dir);
  const again = [
    "record",
    "--ledger",
    fixture.ledger,
    "--roster",
    fixture.roster,
    "--batch",
    "Z",
    "--kanri",
    "kanri-z [aaaaaa]",
    "--kanri-reading",
    "transcript: 9 B, 9 records, 9 wake-ups, 0 compactions, context=99 ttl=5m",
    "--jisso",
    "jisso-z [bbbbbb]",
    "--jisso-reading",
    JISSO_READING,
    "--now",
    "2026-09-19 12:00",
  ];
  assert.strictEqual(run(again, fixture.dir).code, 0);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  // Batch Y's entry is another batch's and is left alone; batch Z's own
  // earlier entry is replaced, not appended to.
  assert.ok(ledger.includes("batch Y: kanri context=11, jisso context=8, ttl=1h"), ledger);
  assert.ok(ledger.includes("batch Z: kanri context=99, jisso context=8, ttl=5m"), ledger);
  assert.ok(!ledger.includes("kanri context=4"), "batch Z's earlier entry survived");
});

test("the Progress line is replaced whole and the Session events line is written once", () => {
  const fixture = ledgerAndRoster();
  run(recordArgs(fixture), fixture.dir);
  run(recordArgs(fixture), fixture.dir);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(ledger.includes("batch Z reported, ruling pending"), ledger);
  assert.ok(!ledger.includes("rewritten in place: which batch is in flight"));
  const events = ledger.split("- 2026-09-19 10:00 — boundary Z verified").length - 1;
  assert.strictEqual(events, 1);
});

test("a Residency row is appended once and then rewritten in place", () => {
  const fixture = ledgerAndRoster();
  run(recordArgs(fixture), fixture.dir);
  const roster = fs.readFileSync(fixture.roster, "utf8");
  assert.ok(
    roster.includes("| kanri | — | kanri-z [aaaaaa] | 2026-09-19 | batch Z | 1 | 2 | 3 | 0 | context=4 |"),
    roster,
  );
  assert.ok(
    roster.includes("| jisso | — | jisso-z [bbbbbb] | 2026-09-19 | batch Z | 5 | 6 | 7 | 0 | context=8 |"),
    roster,
  );
  const rows = roster.split("kanri-z [aaaaaa]").length - 1;
  assert.strictEqual(rows, 1);
});

test("a peer reading and a status each name the row they write", () => {
  const fixture = ledgerAndRoster();
  const sessions = fs
    .readFileSync(fixture.roster, "utf8")
    .replace("| kanri | — | <name> [<ref>] |", "| keikaku | tanto-diet | keikaku-a [ccdd11] |");
  fs.writeFileSync(fixture.roster, sessions, "utf8");
  const args = [
    "record",
    "--ledger",
    fixture.ledger,
    "--roster",
    fixture.roster,
    "--batch",
    "Z",
    "--peer-reading",
    "keikaku keikaku-a [ccdd11] transcript: 7 B, 8 records, 9 wake-ups, 1 compactions, context=10",
    "--status",
    "keikaku-a [ccdd11] cleared",
    "--now",
    "2026-09-19 13:00",
  ];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 0, result.err);
  const roster = fs.readFileSync(fixture.roster, "utf8");
  assert.ok(
    roster.includes("| keikaku | — | keikaku-a [ccdd11] | 2026-09-19 | batch Z | 7 | 8 | 9 | 1 | context=10 |"),
    roster,
  );
  assert.ok(roster.includes("| keikaku | tanto-diet | keikaku-a [ccdd11] |"), roster);
  assert.ok(roster.includes("| cleared |"), roster);
});

test("an unavailable Jisso reading still writes the Batches row and the Kanri Residency row", () => {
  const fixture = ledgerAndRoster();
  const args = recordArgs(fixture).map((arg) =>
    arg === JISSO_READING ? "transcript: unavailable — no transcript on this host" : arg,
  );
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 0, result.err);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  const roster = fs.readFileSync(fixture.roster, "utf8");
  // Nothing else this same call names is lost: the Batches row, the S-item
  // row, and the Session events line are all still written.
  assert.ok(ledger.includes("| Z | 1-3 | reported |"), ledger);
  assert.ok(ledger.includes("| S-1 | batch-Z-report.md item 1 |"), ledger);
  assert.ok(ledger.includes("- 2026-09-19 10:00 — boundary Z verified"), ledger);
  // The unavailable side's own Residency row is still written, `—` in the
  // four figure columns and `context=unavailable` rather than a refusal.
  assert.ok(
    roster.includes("| jisso | — | jisso-z [bbbbbb] | 2026-09-19 | batch Z | — | — | — | — | context=unavailable |"),
    roster,
  );
  // The available side's own Residency row reads normally, unaffected.
  assert.ok(
    roster.includes("| kanri | — | kanri-z [aaaaaa] | 2026-09-19 | batch Z | 1 | 2 | 3 | 0 | context=4 |"),
    roster,
  );
  // The joint Measurements entry needs both figures, so it is skipped, not
  // written with a garbage or partial entry, and the skip is reported under
  // "Rows written" rather than swallowed.
  assert.match(result.out, /measurement skipped — jisso reading unavailable/);
  assert.ok(!ledger.includes("batch Z: kanri context="), ledger);
});

test("both readings unavailable, and an unavailable peer reading, still write —/context=unavailable rows and report both skips", () => {
  const fixture = ledgerAndRoster();
  const unavailable = "transcript: unavailable — no transcript on this host";
  const args = [
    "record",
    "--ledger",
    fixture.ledger,
    "--roster",
    fixture.roster,
    "--batch",
    "Z",
    "--kanri",
    "kanri-z [aaaaaa]",
    "--kanri-reading",
    unavailable,
    "--jisso",
    "jisso-z [bbbbbb]",
    "--jisso-reading",
    unavailable,
    "--peer-reading",
    `keikaku keikaku-a [ccdd11] ${unavailable}`,
    "--now",
    "2026-09-19 14:00",
  ];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 0, result.err);
  // "Both sides unavailable" is its own `who` branch, distinct from the
  // single-side wording covered above.
  assert.match(result.out, /measurement skipped — kanri and jisso readings unavailable/);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(!ledger.includes("batch Z: kanri context="), ledger);
  const roster = fs.readFileSync(fixture.roster, "utf8");
  // Kanri's and Jisso's own Residency rows both read unavailable...
  assert.ok(
    roster.includes("| kanri | — | kanri-z [aaaaaa] | 2026-09-19 | batch Z | — | — | — | — | context=unavailable |"),
    roster,
  );
  assert.ok(
    roster.includes("| jisso | — | jisso-z [bbbbbb] | 2026-09-19 | batch Z | — | — | — | — | context=unavailable |"),
    roster,
  );
  // ...and a `--peer-reading` that arrives unavailable survives the PEER
  // regex's own parse first and still writes the same shape of row.
  assert.ok(
    roster.includes(
      "| keikaku | — | keikaku-a [ccdd11] | 2026-09-19 | batch Z | — | — | — | — | context=unavailable |",
    ),
    roster,
  );
});

test("a heading record cannot find makes it write nothing and exit 1, naming the table", () => {
  const fixture = ledgerAndRoster();
  const stripped = fs.readFileSync(fixture.ledger, "utf8").replace("## Batches", "## Batch list");
  fs.writeFileSync(fixture.ledger, stripped, "utf8");
  const before = fs.readFileSync(fixture.ledger, "utf8");
  const result = run(recordArgs(fixture), fixture.dir);
  assert.strictEqual(result.code, 1);
  assert.match(result.err, /the ledger's Batches table/);
  assert.strictEqual(fs.readFileSync(fixture.ledger, "utf8"), before);
});

test("the same event in two batches is two lines; twice in one batch is one", () => {
  const fixture = ledgerAndRoster();
  const event = (batch, now) => [
    "record",
    "--ledger",
    fixture.ledger,
    "--batch",
    batch,
    "--event",
    "dispatch: plan.review on fable",
    "--now",
    now,
  ];
  assert.strictEqual(run(event("Y", "2026-09-19 09:00"), fixture.dir).code, 0);
  assert.strictEqual(run(event("Y", "2026-09-19 09:30"), fixture.dir).code, 0);
  assert.strictEqual(run(event("Z", "2026-09-19 10:00"), fixture.dir).code, 0);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  const lines = ledger.split("\n").filter((l) => l.includes("dispatch: plan.review on fable"));
  // Two dispatches of one kind in two batches are two dispatches, and the
  // close counts them by kind; the repeated call inside batch Y is one.
  assert.strictEqual(lines.length, 2);
  assert.ok(ledger.includes("dispatch: plan.review on fable (batch Y)"), ledger);
  assert.ok(ledger.includes("dispatch: plan.review on fable (batch Z)"), ledger);
});

test("an event-only call writes no Batches row and needs no --batch", () => {
  const fixture = ledgerAndRoster();
  const args = [
    "record",
    "--ledger",
    fixture.ledger,
    "--event",
    "unanswered: keikaku-a [ccdd11] — plan committed:",
    "--s-item",
    "exit-keikaku-proposal.md item 1 | an item raised between plans",
    "--now",
    "2026-09-19 08:00",
  ];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 0, result.err);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  // The Batches table is untouched, placeholder and all.
  assert.ok(ledger.includes("| (no batch yet) |"), ledger);
  assert.ok(ledger.includes("- 2026-09-19 08:00 — unanswered: keikaku-a [ccdd11] — plan committed:"), ledger);
  assert.ok(ledger.includes("| S-1 | exit-keikaku-proposal.md item 1 |"), ledger);
});

test("--prompt writes the Batches row's Prompt cell", () => {
  const fixture = ledgerAndRoster();
  const args = [
    "record",
    "--ledger",
    fixture.ledger,
    "--batch",
    "Y",
    "--state",
    "sent",
    "--prompt",
    ".tanto/tanto-diet/batch-Y-prompt.md",
  ];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 0, result.err);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(ledger.includes("| Y |  | sent | .tanto/tanto-diet/batch-Y-prompt.md |"), ledger);
});

test("record keeps a file's own line ending", () => {
  const fixture = ledgerAndRoster();
  const lf = fs.readFileSync(fixture.ledger, "utf8").replace(/\r\n/g, "\n");
  const crlf = lf.replace(/\n/g, "\r\n");
  fs.writeFileSync(fixture.ledger, crlf, "utf8");
  const args = ["record", "--ledger", fixture.ledger, "--batch", "Z", "--state", "sent"];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 0, result.err);
  const after = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(after.includes("\r\n"), "the CRLF endings were lost");
  assert.ok(!/[^\r]\n/.test(after), "a bare LF was written into a CRLF file");
});

test("record keeps a file's own line ending (LF)", () => {
  const fixture = ledgerAndRoster();
  const lf = fs.readFileSync(fixture.ledger, "utf8").replace(/\r\n/g, "\n");
  fs.writeFileSync(fixture.ledger, lf, "utf8");
  const args = ["record", "--ledger", fixture.ledger, "--batch", "Z", "--state", "sent"];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 0, result.err);
  const after = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(!after.includes("\r"), "a CRLF ending was written into an LF file");
});

const SEAT = {
  role: "jisso",
  topic: "bg-seats",
  name: "seat-one [aaaaaa]",
  cwd: "/repo",
  model: "sonnet",
  effort: "xhigh",
  branch: "bg-seats",
  mode: "auto",
  startedAt: "2026-09-21 10:00",
  transcript: "/tmp/seat-one.jsonl",
  sessionId: "sess-one",
};

test("--seat writes a terminal seat's roster row, and a second call rewrites it", () => {
  const fixture = ledgerAndRoster();
  const seat = write(fixture.dir, "result.json", JSON.stringify(SEAT));
  const args = ["record", "--ledger", fixture.ledger, "--roster", fixture.roster, "--seat", seat];
  assert.strictEqual(run(args, fixture.dir).code, 0);
  const first = fs.readFileSync(fixture.roster, "utf8");
  assert.ok(first.includes("| jisso | bg-seats | seat-one [aaaaaa] | /repo |"), first);
  assert.ok(first.includes("/tmp/seat-one.jsonl |"), first);
  const moved = write(fixture.dir, "result2.json", JSON.stringify({ ...SEAT, branch: "next" }));
  assert.strictEqual(
    run(["record", "--ledger", fixture.ledger, "--roster", fixture.roster, "--seat", moved], fixture.dir).code,
    0,
  );
  const second = fs.readFileSync(fixture.roster, "utf8");
  assert.strictEqual(second.split("seat-one [aaaaaa]").length - 1, 1);
  assert.ok(second.includes("| next |"), second);
});

test("--seat writes the session id in the Transcript cell when the result found no transcript, and unavailable when it has neither", () => {
  const fixture = ledgerAndRoster();
  const seatRows = (seat) => {
    const file = write(fixture.dir, "result.json", JSON.stringify(seat));
    const args = ["record", "--ledger", fixture.ledger, "--roster", fixture.roster, "--seat", file];
    assert.strictEqual(run(args, fixture.dir).code, 0);
    return fs.readFileSync(fixture.roster, "utf8");
  };
  const bare = seatRows({ ...SEAT, transcript: null });
  assert.ok(bare.includes("| live | sess-one.jsonl |"), bare);
  const neither = seatRows({ ...SEAT, name: "seat-two [bbbbbb]", transcript: null, sessionId: undefined });
  assert.ok(neither.includes("| live | unavailable |"), neither);
  const found = seatRows(SEAT);
  assert.ok(found.includes("| live | /tmp/seat-one.jsonl |"), found);
  assert.ok(!found.includes("| sess-one.jsonl |"), found);
});

test("--seat on a file that is not there exits 2 and writes nothing", () => {
  const fixture = ledgerAndRoster();
  const before = fs.readFileSync(fixture.roster, "utf8");
  const args = [
    "record",
    "--ledger",
    fixture.ledger,
    "--roster",
    fixture.roster,
    "--seat",
    path.join(fixture.dir, "gone.json"),
  ];
  assert.strictEqual(run(args, fixture.dir).code, 2);
  assert.strictEqual(fs.readFileSync(fixture.roster, "utf8"), before);
});

test("--status accepts stopped and still refuses a word the table does not name", () => {
  const fixture = ledgerAndRoster();
  const seat = write(fixture.dir, "result.json", JSON.stringify(SEAT));
  assert.strictEqual(
    run(["record", "--ledger", fixture.ledger, "--roster", fixture.roster, "--seat", seat], fixture.dir).code,
    0,
  );
  const stop = [
    "record",
    "--ledger",
    fixture.ledger,
    "--roster",
    fixture.roster,
    "--status",
    "seat-one [aaaaaa] stopped",
  ];
  assert.strictEqual(run(stop, fixture.dir).code, 0);
  assert.ok(fs.readFileSync(fixture.roster, "utf8").includes("| stopped |"));
  const bad = ["record", "--ledger", fixture.ledger, "--roster", fixture.roster, "--status", "seat-one [aaaaaa] gone"];
  const refused = run(bad, fixture.dir);
  assert.strictEqual(refused.code, 1);
  assert.match(refused.err, /live, cleared, stopped, or queued/);
});

test("check pairs a commit-ready with its commit-done even when only one side carries a --batch suffix, and still reports a genuinely unpaired commit-ready", () => {
  const fixture = ledgerAndRoster();
  const plan = write(fixture.dir, "plan.md", PLAN);
  const report = write(fixture.dir, "report.md", "# Report\n\n- Transcript — none\n\n## For Kanri\n\nnothing\n");
  // The paired peer: `commit-ready:` written with no `--batch`, `commit-done:`
  // for the same subject written WITH `--batch` -- the real shape `record`
  // itself writes (a peer's own commit-ready call rarely carries a batch; the
  // boundary's own commit-done call for it usually does), and the shape that
  // exposed the bug where pairing compared the raw, batch-suffixed text.
  const readyArgs = [
    "record",
    "--ledger",
    fixture.ledger,
    "--event",
    "commit-ready: sekkei next-topic — docs: the next spec",
    "--now",
    "2026-09-21 09:00",
  ];
  assert.strictEqual(run(readyArgs, fixture.dir).code, 0);
  const doneArgs = [
    "record",
    "--ledger",
    fixture.ledger,
    "--batch",
    "C",
    "--event",
    "commit-done: sekkei next-topic — docs: the next spec",
    "--now",
    "2026-09-21 09:30",
  ];
  assert.strictEqual(run(doneArgs, fixture.dir).code, 0);
  // A genuinely unpaired commit-ready: no commit-done for it anywhere.
  const unpairedArgs = [
    "record",
    "--ledger",
    fixture.ledger,
    "--batch",
    "C",
    "--event",
    "commit-ready: keikaku next-topic — docs: the next plan",
    "--now",
    "2026-09-21 10:00",
  ];
  assert.strictEqual(run(unpairedArgs, fixture.dir).code, 0);
  const args = [
    "check",
    "--plan",
    plan,
    "--report",
    report,
    "--base",
    "HEAD",
    "--tanto",
    TANTO,
    "--ledger",
    fixture.ledger,
  ];
  const result = run(args, fixture.dir);
  assert.ok(result.out.includes("## commit-ready"), result.out);
  assert.ok(result.out.includes("keikaku next-topic"), result.out);
  assert.ok(!result.out.includes("sekkei next-topic"), result.out);
});

test("check exits 2 when --ledger names a path that is not on disk", () => {
  const fixture = ledgerAndRoster();
  const plan = write(fixture.dir, "plan.md", PLAN);
  const report = write(fixture.dir, "report.md", "# Report\n\n- Transcript — none\n\n## For Kanri\n\nnothing\n");
  const args = [
    "check",
    "--plan",
    plan,
    "--report",
    report,
    "--base",
    "HEAD",
    "--tanto",
    TANTO,
    "--ledger",
    path.join(fixture.dir, "gone.md"),
  ];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 2);
  assert.match(result.err, /--ledger .* is not on disk/);
});

// The two shapes of a proposal items table: the six columns the templates
// carry, and the seven a ledger opened before the retired column went keeps.
const RETIRED = ["Stag", "e"].join("");

function itemsLedger(columns) {
  const dir = tmpDir();
  const body = [
    "# Conductor ledger — t",
    "",
    "## Shoroku proposal items",
    "",
    `| ${columns.join(" | ")} |`,
    `| ${columns.map(() => "---").join(" | ")} |`,
    `| (no item yet) |${" |".repeat(columns.length - 1)}`,
    "",
    "## Session events",
    "",
  ].join("\n");
  return { dir, ledger: write(dir, "kanri.md", body) };
}

test("an S-n row takes the columns its table's header names, six or seven", () => {
  const six = ["S-n", "Source", "Item", "Destination", "Adopted", "Written"];
  const seven = ["S-n", "Source", "Item", "Destination", "Adopted", RETIRED, "Written"];
  const cases = [
    [six, "| S-1 | report.md item 1 | an item |  | pending | no |"],
    [seven, "| S-1 | report.md item 1 | an item |  | pending | t2 | no |"],
  ];
  for (const [columns, expected] of cases) {
    const f = itemsLedger(columns);
    const result = run(["record", "--ledger", f.ledger, "--s-item", "report.md item 1 | an item"], f.dir);
    assert.strictEqual(result.code, 0, result.err);
    const ledger = fs.readFileSync(f.ledger, "utf8");
    assert.ok(ledger.includes(expected), ledger);
    assert.ok(!ledger.includes("(no item yet)"), ledger);
  }
});

// `census`: a fake `claude` that prints a fixed listing, fails, or prints no
// JSON, and records the arguments it was given.
const CENSUS_FAKE = [
  'const fs = require("node:fs");',
  "fs.writeFileSync(process.env.FAKE_ARGS, JSON.stringify(process.argv.slice(2)));",
  'if (process.env.FAKE_MODE === "fail") {',
  '  process.stderr.write("listing broke\\n");',
  "  process.exit(1);",
  "}",
  'if (process.env.FAKE_MODE === "garbage") {',
  '  process.stdout.write("not json");',
  "  process.exit(0);",
  "}",
  'process.stdout.write(fs.readFileSync(process.env.FAKE_LISTING, "utf8"));',
].join("\n");

const SESSIONS_HEAD = [
  "| Role | Topic | Name [ref] | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
];

function sessionRow(role, topic, name, status, transcript) {
  return `| ${role} | ${topic} | ${name} | /repo | sonnet | high | main | auto | 2026-09-23 10:00 | ${status} | ${transcript} |`;
}

/** A root with a roster of `rows`, and a listing `sessionsOf(root, dir)` returns. */
function censusFixture(rows, sessionsOf) {
  const dir = tmpDir();
  const root = path.join(dir, "repo");
  fs.mkdirSync(path.join(root, ".tanto"), { recursive: true });
  const roster = write(
    path.join(root, ".tanto"),
    "roster.md",
    ["# tanto roster", "", ...SESSIONS_HEAD, ...rows, ""].join("\n"),
  );
  const listing = write(dir, "listing.json", JSON.stringify({ sessions: sessionsOf(root, dir) }));
  const fake = write(dir, "fake-claude.js", CENSUS_FAKE);
  return { dir, root, roster, listing, fake, args: path.join(dir, "fake-args.json") };
}

function census(f, mode, args = ["--root", f.root, "--roster", f.roster]) {
  const result = spawnSync(process.execPath, [SCRIPT, "census", ...args], {
    encoding: "utf8",
    cwd: f.dir,
    env: { ...process.env, TANTO_CLAUDE_NODE: f.fake, FAKE_LISTING: f.listing, FAKE_ARGS: f.args, FAKE_MODE: mode },
  });
  return { code: result.status, out: (result.stdout || "").replace(/\r\n/g, "\n"), err: result.stderr || "" };
}

const KANRI_ROW = sessionRow("kanri", "—", "kanri-a [aaaaaa]", "live", "/home/u/.claude/projects/p/sess-kanri.jsonl");

test("census prints the live and queued rows under its four headings, by its own path comparison", () => {
  const f = censusFixture(
    [
      KANRI_ROW,
      sessionRow(
        "sekkei",
        "t",
        "sekkei-b [bbbbbb]",
        "live (idle since 10:00)",
        "/home/u/.claude/projects/p/sess-sekkei.jsonl",
      ),
      sessionRow("hosa", "—", "hosa-c [cccccc]", "live", "/home/u/.claude/projects/p/sess-hosa.jsonl"),
      sessionRow("kikaku", "—", "kikaku-d [dddddd]", "live", "unavailable"),
      sessionRow("jisso", "t", "jisso-e", "stopped", "/home/u/.claude/projects/p/sess-old.jsonl"),
      sessionRow("jisso", "t", "jisso-f", "queued", "C:\\Users\\u\\.claude\\projects\\p\\sess-queued.jsonl"),
    ],
    (root, dir) => [
      { sessionId: "sess-kanri", name: "kanri-a", kind: "background", cwd: root, pid: 1111 },
      { sessionId: "sess-sekkei", name: "dotskills-4d", kind: "interactive", cwd: path.join(root, "sub"), pid: 1112 },
      { sessionId: "sess-queued", name: "jisso-f", kind: "background", cwd: root, pid: 1113 },
      { sessionId: "sess-old", name: "old-seat", kind: "background", cwd: root, pid: 1114 },
      { sessionId: "sess-human", name: "human-own", kind: "interactive", cwd: root, pid: 1115 },
      { sessionId: "sess-other", name: "other-repo", kind: "background", cwd: path.join(dir, "other"), pid: 1116 },
      { sessionId: "sess-sibling", name: "sibling", kind: "background", cwd: `${root}-two`, pid: 1117 },
    ],
  );
  const result = census(f, "");
  assert.strictEqual(result.code, 0, result.err);
  assert.strictEqual(
    result.out,
    [
      "",
      "## Listed",
      "",
      "kanri — kanri-a [aaaaaa] — sess-kanri — listed as kanri-a (background)",
      "sekkei t sekkei-b [bbbbbb] — sess-sekkei — listed as dotskills-4d (interactive) — renamed",
      "jisso t jisso-f — sess-queued — listed as jisso-f (background)",
      "",
      "## Not listed",
      "",
      "hosa — hosa-c [cccccc] — sess-hosa",
      "",
      "## No session id",
      "",
      "kikaku — kikaku-d [dddddd]",
      "",
      "## Not held",
      "",
      "old-seat (background) — sess-old — row stopped",
      "human-own (interactive) — sess-human",
      "",
    ].join("\n"),
  );
  // The unfiltered listing: the census keeps what is under the root itself.
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(f.args, "utf8")), ["agents", "--json"]);
});

test("census prints none under a heading with no entry, and writes nothing", () => {
  const f = censusFixture([KANRI_ROW], (root) => [
    { sessionId: "sess-kanri", name: "kanri-a", kind: "background", cwd: root, pid: 1111 },
  ]);
  const before = fs.readFileSync(f.roster, "utf8");
  const result = census(f, "");
  assert.strictEqual(result.code, 0, result.err);
  for (const heading of ["Not listed", "No session id", "Not held"]) {
    assert.ok(result.out.includes(`## ${heading}\n\nnone\n`), result.out);
  }
  assert.strictEqual(fs.readFileSync(f.roster, "utf8"), before);
});

test("census exits 1 with one line on a failed or non-JSON listing, and 2 on a usage error or an unreadable roster", () => {
  const f = censusFixture([KANRI_ROW], () => []);
  const failed = census(f, "fail");
  assert.strictEqual(failed.code, 1);
  assert.strictEqual(failed.out, "census: unavailable — listing broke\n");
  const garbage = census(f, "garbage");
  assert.strictEqual(garbage.code, 1);
  assert.match(garbage.out, /^census: unavailable — .+\n$/);
  assert.strictEqual(census(f, "", ["--root", f.root, "--roster", path.join(f.dir, "gone.md")]).code, 2);
  assert.strictEqual(census(f, "", ["--root"]).code, 2);
});

test("a pid-less listing entry is not listed, and its row is noted as a stale entry (spec 3.2 item 3)", () => {
  const f = censusFixture(
    [KANRI_ROW, sessionRow("jisso", "t", "jisso-g", "live", "/home/u/.claude/projects/p/sess-moved.jsonl")],
    (root, dir) => [
      // The measured real shape (R-11, S-54): a sessionId with no pid and no
      // status, for a process that already exited hours earlier.
      { sessionId: "sess-kanri", name: "kanri-a", kind: "background", cwd: root, state: "blocked" },
      // A stale entry is noted by its sessionId, wherever its cwd.
      { sessionId: "sess-moved", name: "jisso-g", kind: "background", cwd: path.join(dir, "other"), state: "blocked" },
      { sessionId: "sess-stray", name: "stray", kind: "background", cwd: root, state: "blocked" },
    ],
  );
  const result = census(f, "");
  assert.strictEqual(result.code, 0, result.err);
  assert.ok(result.out.includes("\n## Listed\n\nnone\n"), result.out);
  const stale = " — listed without a pid (a stale entry)";
  assert.ok(
    result.out.includes(
      `\n## Not listed\n\nkanri — kanri-a [aaaaaa] — sess-kanri${stale}\njisso t jisso-g — sess-moved${stale}\n`,
    ),
    result.out,
  );
  // Not held lists no entry without a pid.
  assert.ok(result.out.includes("\n## Not held\n\nnone\n"), result.out);
});

test("census places a session whose cwd spells the root's drive letter in the other case", {
  skip: process.platform !== "win32",
}, () => {
  const f = censusFixture([KANRI_ROW], (root) => {
    const letter = root[0] === root[0].toUpperCase() ? root[0].toLowerCase() : root[0].toUpperCase();
    return [{ sessionId: "sess-kanri", name: "kanri-a", kind: "interactive", cwd: letter + root.slice(1), pid: 1111 }];
  });
  const result = census(f, "");
  assert.strictEqual(result.code, 0, result.err);
  assert.ok(result.out.includes("kanri — kanri-a [aaaaaa] — sess-kanri — listed as kanri-a (interactive)"), result.out);
});

test("census reads seats.json beside the roster: a blocked seat's line and a marked seat's line carry their suffixes (spec 3.3)", () => {
  const f = censusFixture(
    [
      KANRI_ROW,
      sessionRow("jisso", "t", "jisso-h", "live", "/home/u/.claude/projects/p/sess-jisso.jsonl"),
      sessionRow("shoki", "t", "shoki-i", "live", "/home/u/.claude/projects/p/sess-shoki.jsonl"),
    ],
    (root) => [
      { sessionId: "sess-kanri", name: "kanri-a", kind: "background", cwd: root, pid: 1111, state: "blocked" },
      { sessionId: "sess-jisso", name: "jisso-h", kind: "background", cwd: root, pid: 1112, state: "blocked" },
    ],
  );
  fs.mkdirSync(path.join(f.root, ".tanto", "spawner"), { recursive: true });
  const seats = [
    { sessionId: "sess-jisso", status: "blocked", noFirstTurn: "2026-10-03 10:02" },
    { sessionId: "sess-shoki", status: "gone", noFirstTurn: "2026-10-03 10:05" },
  ];
  fs.writeFileSync(path.join(f.root, ".tanto", "spawner", "seats.json"), JSON.stringify({ seats }));
  const result = census(f, "");
  assert.strictEqual(result.code, 0, result.err);
  assert.ok(
    result.out.includes(
      [
        "\n## Listed\n",
        "kanri — kanri-a [aaaaaa] — sess-kanri — listed as kanri-a (background) — blocked",
        "jisso t jisso-h — sess-jisso — listed as jisso-h (background) — blocked — no first turn since 2026-10-03 10:02",
        "",
      ].join("\n"),
    ),
    result.out,
  );
  assert.ok(
    result.out.includes("\n## Not listed\n\nshoki t shoki-i — sess-shoki — no first turn since 2026-10-03 10:05\n"),
    result.out,
  );
});

test("census matches a row whose Transcript cell is the bare session id: a blocked seat and a seat that never started carry their suffixes", () => {
  const f = censusFixture(
    [
      KANRI_ROW,
      sessionRow("jisso", "t", "jisso-h", "live", "sess-jisso.jsonl"),
      sessionRow("shoki", "t", "shoki-i", "live", "sess-shoki.jsonl"),
    ],
    (root) => [
      { sessionId: "sess-kanri", name: "kanri-a", kind: "background", cwd: root, pid: 1111 },
      { sessionId: "sess-jisso", name: "jisso-h", kind: "background", cwd: root, pid: 1112, state: "blocked" },
      { sessionId: "sess-shoki", name: "shoki-i", kind: "background", cwd: root, state: "blocked" },
    ],
  );
  fs.mkdirSync(path.join(f.root, ".tanto", "spawner"), { recursive: true });
  const seats = [
    { sessionId: "sess-jisso", status: "blocked", noFirstTurn: "2026-10-04 10:02" },
    { sessionId: "sess-shoki", status: "gone", noFirstTurn: "2026-10-04 10:05" },
  ];
  fs.writeFileSync(path.join(f.root, ".tanto", "spawner", "seats.json"), JSON.stringify({ seats }));
  const result = census(f, "");
  assert.strictEqual(result.code, 0, result.err);
  assert.ok(
    result.out.includes(
      "jisso t jisso-h — sess-jisso — listed as jisso-h (background) — blocked — no first turn since 2026-10-04 10:02\n",
    ),
    result.out,
  );
  assert.ok(
    result.out.includes(
      "\n## Not listed\n\nshoki t shoki-i — sess-shoki — listed without a pid (a stale entry) — no first turn since 2026-10-04 10:05\n",
    ),
    result.out,
  );
  assert.ok(result.out.includes("\n## No session id\n\nnone\n"), result.out);
});
