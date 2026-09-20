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

test("an unknown subcommand exits 2 and names the two that exist", () => {
  const f = fixture();
  const result = run(["verify"], f.dir);
  assert.strictEqual(result.code, 2);
  assert.match(result.err, /check\|record/);
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

test("--deferred writes the Measurements deferrals entry for its own batch", () => {
  const fixture = ledgerAndRoster();
  const call = (batch, text, now) => [
    "record",
    "--ledger",
    fixture.ledger,
    "--batch",
    batch,
    "--deferred",
    text,
    "--now",
    now,
  ];
  assert.strictEqual(run(call("Y", "context=1, last human turn 90 min ago", "2026-09-19 09:00"), fixture.dir).code, 0);
  assert.strictEqual(run(call("Z", "context=2, last human turn 70 min ago", "2026-09-19 10:00"), fixture.dir).code, 0);
  assert.strictEqual(run(call("Z", "context=3, last human turn 60 min ago", "2026-09-19 11:00"), fixture.dir).code, 0);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(ledger.includes("batch Y: context=1, last human turn 90 min ago"), ledger);
  assert.ok(ledger.includes("batch Z: context=3, last human turn 60 min ago"), ledger);
  assert.ok(!ledger.includes("context=2"), "batch Z's earlier deferral survived");
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
