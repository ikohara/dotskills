const test = require("node:test");
const { after } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");

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

test("an unknown subcommand exits 2 and names the seven that exist", () => {
  const f = fixture();
  const result = run(["verify"], f.dir);
  assert.strictEqual(result.code, 2);
  assert.match(result.err, /check\|record\|census\|request\|seat\|wake\|beat/);
});

// The ledger and the roster the tests write to are copies of the templates
// this skill ships, so a change to a fixed table's shape fails here first.
// The seats table's two placeholder rows become Kanri's and a Jisso's, each
// found by the `sessionId` its Transcript cell carries, so that a reading —
// which appends no row — has a row to land in.
const KANRI_ID = "0a0a0a0a-0000-4000-8000-00000000000a";
const JISSO_ID = "0b0b0b0b-0000-4000-8000-00000000000b";
const KEIKAKU_ID = "0c0c0c0c-0000-4000-8000-00000000000c";
// The Name header cell of the shape before this one, spelled so that a sweep
// for the retired string finds none.
const OLD_NAME = ["Name", "[ref]"].join(" ");

/** A seats-table row of twenty cells, no reading landed in it yet. */
function seatRow(role, name, sessionId) {
  const counts = role === "kanri" ? "0 | 0 | 0" : "— | — | —";
  return `| ${role} | — | ${name} | /repo | sonnet | high | main | auto | 2026-09-19 09:00 | live | /home/u/${sessionId}.jsonl | — | — | — | — | — | — | ${counts} |`;
}

function ledgerAndRoster() {
  const dir = tmpDir();
  const ledger = path.join(dir, "kanri.md");
  const roster = path.join(dir, "roster.md");
  fs.copyFileSync(path.join(TANTO, "templates", "kanri.md"), ledger);
  const seated = fs
    .readFileSync(path.join(TANTO, "templates", "roster.md"), "utf8")
    .split(/\r?\n/)
    .map((line) => {
      if (line.startsWith("| kanri | — | <name> |")) return seatRow("kanri", "kanri-z", KANRI_ID);
      if (line.startsWith("| <role> |")) return seatRow("jisso", "jisso-z", JISSO_ID);
      return line;
    });
  fs.writeFileSync(roster, seated.join("\n"), "utf8");
  return { dir, ledger, roster };
}

/** One more seat's row, after the Jisso's. */
function addSeat(fixture, line) {
  const jisso = seatRow("jisso", "jisso-z", JISSO_ID);
  const text = fs.readFileSync(fixture.roster, "utf8").replace(jisso, `${jisso}\n${line}`);
  fs.writeFileSync(fixture.roster, text, "utf8");
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
    KANRI_ID,
    "--kanri-reading",
    KANRI_READING,
    "--jisso",
    JISSO_ID,
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
    KANRI_ID,
    "--kanri-reading",
    "transcript: 1 B, 1 records, 1 wake-ups, 0 compactions, context=11 ttl=1h",
    "--jisso",
    JISSO_ID,
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
    KANRI_ID,
    "--kanri-reading",
    "transcript: 9 B, 9 records, 9 wake-ups, 0 compactions, context=99 ttl=5m",
    "--jisso",
    JISSO_ID,
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

test("a reading lands in its seat's row, found by sessionId, and a second one rewrites the same cells", () => {
  const fixture = ledgerAndRoster();
  run(recordArgs(fixture), fixture.dir);
  const roster = fs.readFileSync(fixture.roster, "utf8");
  assert.ok(roster.includes("| kanri | — | kanri-z | /repo |"), roster);
  assert.ok(roster.includes(`${KANRI_ID}.jsonl | batch Z | 1 | 2 | 3 | 0 | context=4 | 0 | 0 | 0 |`), roster);
  assert.ok(roster.includes(`${JISSO_ID}.jsonl | batch Z | 5 | 6 | 7 | 0 | context=8 | — | — | — |`), roster);
  const later = "transcript: 9 B, 9 records, 9 wake-ups, 1 compactions, context=99 ttl=5m";
  const again = recordArgs(fixture).map((arg) => (arg === KANRI_READING ? later : arg));
  assert.strictEqual(run(again, fixture.dir).code, 0);
  const after = fs.readFileSync(fixture.roster, "utf8");
  assert.ok(after.includes(`${KANRI_ID}.jsonl | batch Z | 9 | 9 | 9 | 1 | context=99 | 0 | 0 | 0 |`), after);
  assert.strictEqual(after.split(KANRI_ID).length - 1, 1);
});

test("a peer reading lands in its seat's row by sessionId, and one for a seat no row holds is refused", () => {
  const fixture = ledgerAndRoster();
  addSeat(fixture, seatRow("keikaku", "keikaku-a", KEIKAKU_ID));
  const peer = (sessionId) => [
    "record",
    "--ledger",
    fixture.ledger,
    "--roster",
    fixture.roster,
    "--batch",
    "Z",
    "--peer-reading",
    `keikaku ${sessionId} transcript: 7 B, 8 records, 9 wake-ups, 1 compactions, context=10`,
    "--now",
    "2026-09-19 13:00",
  ];
  const result = run(peer(KEIKAKU_ID), fixture.dir);
  assert.strictEqual(result.code, 0, result.err);
  const roster = fs.readFileSync(fixture.roster, "utf8");
  assert.ok(roster.includes("| keikaku | — | keikaku-a | /repo |"), roster);
  assert.ok(roster.includes(`${KEIKAKU_ID}.jsonl | batch Z | 7 | 8 | 9 | 1 | context=10 | — | — | — |`), roster);
  // A reading appends no row: a row is created by `--seat` alone.
  const unknown = "0d0d0d0d-0000-4000-8000-00000000000d";
  const refused = run(peer(unknown), fixture.dir);
  assert.strictEqual(refused.code, 1);
  assert.ok(refused.err.includes(`did not find a roster row for ${unknown}`), refused.err);
  assert.strictEqual(fs.readFileSync(fixture.roster, "utf8"), roster);
});

test("an unavailable Jisso reading still writes the Batches row and Kanri's reading", () => {
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
  // The unavailable side's own reading is still written, `—` in the four
  // figure columns and `context=unavailable` rather than a refusal.
  assert.ok(roster.includes(`${JISSO_ID}.jsonl | batch Z | — | — | — | — | context=unavailable |`), roster);
  // The available side's own reading lands normally, unaffected.
  assert.ok(roster.includes(`${KANRI_ID}.jsonl | batch Z | 1 | 2 | 3 | 0 | context=4 |`), roster);
  // The joint Measurements entry needs both figures, so it is skipped, not
  // written with a garbage or partial entry, and the skip is reported under
  // "Rows written" rather than swallowed.
  assert.match(result.out, /measurement skipped — jisso reading unavailable/);
  assert.ok(!ledger.includes("batch Z: kanri context="), ledger);
});

test("both readings unavailable, and an unavailable peer reading, still write —/context=unavailable rows and report both skips", () => {
  const fixture = ledgerAndRoster();
  addSeat(fixture, seatRow("keikaku", "keikaku-a", KEIKAKU_ID));
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
    KANRI_ID,
    "--kanri-reading",
    unavailable,
    "--jisso",
    JISSO_ID,
    "--jisso-reading",
    unavailable,
    "--peer-reading",
    `keikaku ${KEIKAKU_ID} ${unavailable}`,
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
  // Kanri's and Jisso's own readings both land unavailable...
  for (const id of [KANRI_ID, JISSO_ID]) {
    assert.ok(roster.includes(`${id}.jsonl | batch Z | — | — | — | — | context=unavailable |`), roster);
  }
  // ...and a `--peer-reading` that arrives unavailable survives the PEER
  // regex's own parse first and still writes the same cells.
  assert.ok(roster.includes(`${KEIKAKU_ID}.jsonl | batch Z | — | — | — | — | context=unavailable |`), roster);
});

test("a heading record cannot find makes it write nothing and exit 1, naming the table and migrate", () => {
  const fixture = ledgerAndRoster();
  const stripped = fs.readFileSync(fixture.ledger, "utf8").replace("## Batches", "## Batch list");
  fs.writeFileSync(fixture.ledger, stripped, "utf8");
  const before = fs.readFileSync(fixture.ledger, "utf8");
  const result = run(recordArgs(fixture), fixture.dir);
  assert.strictEqual(result.code, 1);
  assert.ok(result.err.includes("the Batches table header is not the template's — expected "), result.err);
  assert.ok(result.err.includes(", found no table — run boundary.js migrate"), result.err);
  assert.strictEqual(fs.readFileSync(fixture.ledger, "utf8"), before);
});

test("a table whose header is not the template's is refused, naming the file, both headers, and migrate (spec 2.1)", () => {
  const fixture = ledgerAndRoster();
  // Today's sessions table: the old Name cell and eleven cells.
  const old = [
    "# tanto roster",
    "",
    `| Role | Topic | ${OLD_NAME} | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript |`,
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    `| kanri | — | kanri-z | /repo | sonnet | high | main | auto | 2026-09-19 09:00 | live | /home/u/${KANRI_ID}.jsonl |`,
    "",
  ].join("\n");
  fs.writeFileSync(fixture.roster, old, "utf8");
  const ledgerBefore = fs.readFileSync(fixture.ledger, "utf8");
  const result = run(recordArgs(fixture), fixture.dir);
  assert.strictEqual(result.code, 1);
  const expected = `record wrote nothing — ${fixture.roster}: the seats table header is not the template's — expected | Role | Topic | Name | cwd |`;
  assert.ok(result.err.includes(expected), result.err);
  assert.ok(result.err.includes(`| Noticed |, found | Role | Topic | ${OLD_NAME} | cwd |`), result.err);
  assert.ok(result.err.endsWith("| Transcript | — run boundary.js migrate\n"), result.err);
  assert.strictEqual(fs.readFileSync(fixture.roster, "utf8"), old);
  assert.strictEqual(fs.readFileSync(fixture.ledger, "utf8"), ledgerBefore);
  // A ledger table one column wider than the template's is refused the same way.
  const wider = ledgerAndRoster();
  const batches = "| Batch | Tasks | State | Prompt | Report | Verdict |";
  const text = fs.readFileSync(wider.ledger, "utf8").replace(batches, `${batches} Note |`);
  fs.writeFileSync(wider.ledger, text, "utf8");
  const refused = run(["record", "--ledger", wider.ledger, "--batch", "Z", "--state", "sent"], wider.dir);
  assert.strictEqual(refused.code, 1);
  assert.ok(refused.err.includes("the Batches table header is not the template's"), refused.err);
  assert.strictEqual(fs.readFileSync(wider.ledger, "utf8"), text);
});

test("a `|` inside a value is written `\\|` and read back whole by the next rewrite (spec 2.2)", () => {
  const fixture = ledgerAndRoster();
  const record = (...args) => run(["record", "--ledger", fixture.ledger, "--batch", "Z", ...args], fixture.dir);
  assert.strictEqual(record("--state", "reported", "--verdict", "check: fail — a | b").code, 0);
  assert.strictEqual(record("--state", "accepted").code, 0);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  assert.ok(ledger.includes("| Z |  | accepted |  |  | check: fail — a \\| b |"), ledger);
});

test("a value with a newline is refused, and nothing is written (spec 2.2)", () => {
  const fixture = ledgerAndRoster();
  const before = fs.readFileSync(fixture.ledger, "utf8");
  const args = ["record", "--ledger", fixture.ledger, "--batch", "Z", "--state", "reported", "--verdict", "one\ntwo"];
  const result = run(args, fixture.dir);
  assert.strictEqual(result.code, 1);
  assert.ok(result.err.includes('did not find a cell with no newline (got "one\\ntwo")'), result.err);
  assert.strictEqual(fs.readFileSync(fixture.ledger, "utf8"), before);
});

test("a reading with neither --batch nor --read-at is refused, and with --read-at its label is the Read at cell (spec 2.3)", () => {
  const fixture = ledgerAndRoster();
  const reading = (...extra) => [
    "record",
    "--ledger",
    fixture.ledger,
    "--roster",
    fixture.roster,
    "--kanri",
    KANRI_ID,
    "--kanri-reading",
    KANRI_READING,
    ...extra,
  ];
  const bare = run(reading(), fixture.dir);
  assert.strictEqual(bare.code, 1);
  assert.ok(bare.err.includes("did not find --batch or --read-at beside a reading"), bare.err);
  assert.strictEqual(run(reading("--read-at", "start"), fixture.dir).code, 0);
  const roster = fs.readFileSync(fixture.roster, "utf8");
  assert.ok(roster.includes(`${KANRI_ID}.jsonl | start | 1 | 2 | 3 | 0 | context=4 | 0 | 0 | 0 |`), roster);
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
    "human-access: done — the human signed in",
    "--now",
    now,
  ];
  assert.strictEqual(run(event("Y", "2026-09-19 09:00"), fixture.dir).code, 0);
  assert.strictEqual(run(event("Y", "2026-09-19 09:30"), fixture.dir).code, 0);
  assert.strictEqual(run(event("Z", "2026-09-19 10:00"), fixture.dir).code, 0);
  const ledger = fs.readFileSync(fixture.ledger, "utf8");
  const lines = ledger.split("\n").filter((l) => l.includes("human-access: done — the human signed in"));
  // The same exchange in two batches is two exchanges, and both stay in the
  // ledger; the repeated call inside batch Y is one.
  assert.strictEqual(lines.length, 2);
  assert.ok(ledger.includes("human-access: done — the human signed in (batch Y)"), ledger);
  assert.ok(ledger.includes("human-access: done — the human signed in (batch Z)"), ledger);
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
  transcript: "/tmp/5e5e5e5e-0000-4000-8000-000000000001.jsonl",
  sessionId: "5e5e5e5e-0000-4000-8000-000000000001",
};

test("--seat writes a seat's twenty-cell row, and a rewrite keeps its reading, its Name, and what the result lacks", () => {
  const fixture = ledgerAndRoster();
  const seat = (body, name) => {
    const file = write(fixture.dir, name, JSON.stringify(body));
    return run(["record", "--ledger", fixture.ledger, "--roster", fixture.roster, "--seat", file], fixture.dir);
  };
  assert.strictEqual(seat(SEAT, "result.json").code, 0);
  const head = `| jisso | bg-seats | seat-one [aaaaaa] | /repo | sonnet | xhigh | bg-seats | auto | 2026-09-21 10:00 | live | ${SEAT.transcript} |`;
  const first = fs.readFileSync(fixture.roster, "utf8");
  assert.ok(first.includes(`${head} — | — | — | — | — | — | — | — | — |`), first);
  const reading = ["record", "--ledger", fixture.ledger, "--roster", fixture.roster, "--batch", "Z"];
  const jisso = ["--jisso", SEAT.sessionId, "--jisso-reading", JISSO_READING];
  assert.strictEqual(run([...reading, ...jisso], fixture.dir).code, 0);
  // A rewrite from a result under another name, on another branch, with no model.
  const moved = { ...SEAT, name: "seat-one-renamed", branch: "next", model: undefined };
  assert.strictEqual(seat(moved, "result2.json").code, 0);
  const second = fs.readFileSync(fixture.roster, "utf8");
  assert.strictEqual(second.split(SEAT.sessionId).length - 1, 1);
  const kept = head.replace("| bg-seats | auto |", "| next | auto |");
  assert.ok(second.includes(`${kept} batch Z | 5 | 6 | 7 | 0 | context=8 | — | — | — |`), second);
});

test("a `|` in a seat's cwd is written `\\|`, and a reading after it still lands in its own columns (spec 2.2)", () => {
  const fixture = ledgerAndRoster();
  const piped = write(fixture.dir, "result.json", JSON.stringify({ ...SEAT, cwd: "/repo/a|b" }));
  const seat = ["record", "--ledger", fixture.ledger, "--roster", fixture.roster, "--seat", piped];
  assert.strictEqual(run(seat, fixture.dir).code, 0);
  const reading = ["record", "--ledger", fixture.ledger, "--roster", fixture.roster, "--batch", "Z"];
  const jisso = ["--jisso", SEAT.sessionId, "--jisso-reading", JISSO_READING];
  assert.strictEqual(run([...reading, ...jisso], fixture.dir).code, 0);
  const roster = fs.readFileSync(fixture.roster, "utf8");
  assert.ok(roster.includes("| seat-one [aaaaaa] | /repo/a\\|b | sonnet |"), roster);
  assert.ok(roster.includes(`${SEAT.transcript} | batch Z | 5 | 6 | 7 | 0 | context=8 | — | — | — |`), roster);
});

test("--seat writes <sessionId>.jsonl when the result found no transcript, and refuses no sessionId, a Transcript cell of the wrong shape, and a cwd with a control character", () => {
  const fixture = ledgerAndRoster();
  const seat = (body) => {
    const file = write(fixture.dir, "result.json", JSON.stringify(body));
    return run(["record", "--ledger", fixture.ledger, "--roster", fixture.roster, "--seat", file], fixture.dir);
  };
  assert.strictEqual(seat({ ...SEAT, transcript: null }).code, 0);
  const before = fs.readFileSync(fixture.roster, "utf8");
  assert.ok(before.includes(`| live | ${SEAT.sessionId}.jsonl |`), before);
  // The f07a path: an inline script collapsed the separators, so the basename is the whole path.
  const collapsed = `C:Users0000105523.claudeprojectsc--repo${SEAT.sessionId}.jsonl`;
  const refusals = [
    [{ ...SEAT, transcript: null, sessionId: undefined }, "did not find a sessionId in "],
    [{ ...SEAT, transcript: collapsed }, `whose basename is <uuid>.jsonl (got ${collapsed})`],
    [{ ...SEAT, transcript: "/tmp/sess-one.jsonl" }, "whose basename is <uuid>.jsonl (got /tmp/sess-one.jsonl)"],
    [{ ...SEAT, cwd: "C:\u0000Users" }, 'did not find a cwd cell with no control character (got "C:\\u0000Users")'],
  ];
  for (const [body, said] of refusals) {
    const got = seat(body);
    assert.strictEqual(got.code, 1, got.err);
    assert.ok(got.err.includes(said), got.err);
  }
  assert.strictEqual(fs.readFileSync(fixture.roster, "utf8"), before);
});

const SUCCESSOR_ID = "0e0e0e0e-0000-4000-8000-00000000000e";

/** A result file for a seat: SEAT with `fields` over it. */
function resultFile(fixture, name, fields) {
  return write(fixture.dir, name, JSON.stringify({ ...SEAT, ...fields }));
}

test("--seat repeats, each a result file or a sessionId the state file holds, needs no --ledger, and refuses a value that is neither (spec 2.4)", () => {
  const fixture = ledgerAndRoster();
  const root = path.join(fixture.dir, "root");
  fs.mkdirSync(path.join(root, ".tanto", "spawner"), { recursive: true });
  // A state entry: every cell a row needs, and no branch.
  const entry = { ...SEAT, sessionId: KEIKAKU_ID, name: "keikaku-b", role: "keikaku", topic: "t", status: "running" };
  delete entry.branch;
  delete entry.transcript;
  fs.writeFileSync(path.join(root, ".tanto", "spawner", "seats.json"), JSON.stringify({ seats: [entry] }));
  const roster = ["record", "--roster", fixture.roster, "--root", root];
  const got = run([...roster, "--seat", resultFile(fixture, "result.json", {}), "--seat", KEIKAKU_ID], fixture.dir);
  assert.strictEqual(got.code, 0, got.err);
  const text = fs.readFileSync(fixture.roster, "utf8");
  assert.ok(text.includes("| jisso | bg-seats | seat-one [aaaaaa] | /repo |"), text);
  const fromState = `| keikaku | t | keikaku-b | /repo | sonnet | xhigh | — | auto | 2026-09-21 10:00 | live | ${KEIKAKU_ID}.jsonl |`;
  assert.ok(text.includes(fromState), text);
  const gone = run([...roster, "--seat", path.join(fixture.dir, "gone.json")], fixture.dir);
  assert.strictEqual(gone.code, 1);
  assert.ok(gone.err.includes("did not find a --seat result file or a sessionId the state file holds"), gone.err);
  assert.strictEqual(fs.readFileSync(fixture.roster, "utf8"), text);
});

test("a --seat rewrite keeps a bare <sessionId>.jsonl Transcript cell until the entry carries a path, and the path after (spec 2.2, 2.4)", () => {
  const fixture = ledgerAndRoster();
  const root = path.join(fixture.dir, "root");
  fs.mkdirSync(path.join(root, ".tanto", "spawner"), { recursive: true });
  const entry = { ...SEAT, sessionId: KEIKAKU_ID, name: "keikaku-b", role: "keikaku", topic: "t", status: "running" };
  delete entry.transcript;
  // The state entry as the spawner holds it, then this Transcript cell after `--seat <sessionId>`.
  const cellAfter = (fields) => {
    const seats = JSON.stringify({ seats: [{ ...entry, ...fields }] });
    fs.writeFileSync(path.join(root, ".tanto", "spawner", "seats.json"), seats);
    const got = run(["record", "--roster", fixture.roster, "--root", root, "--seat", KEIKAKU_ID], fixture.dir);
    assert.strictEqual(got.code, 0, got.err);
    return rowCells(fixture, KEIKAKU_ID)[10];
  };
  assert.strictEqual(cellAfter({}), `${KEIKAKU_ID}.jsonl`);
  const found = `/home/u/.claude/projects/p/${KEIKAKU_ID}.jsonl`;
  assert.strictEqual(cellAfter({ transcript: found }), found);
  assert.strictEqual(cellAfter({ transcript: null }), found);
  assert.strictEqual(fs.readFileSync(fixture.roster, "utf8").split(KEIKAKU_ID).length - 1, 1);
});

test("--init creates the roster from the template, its placeholders dropped, and writes its seats; a roster that exists is refused (spec 2.4)", () => {
  const dir = tmpDir();
  const roster = path.join(dir, ".tanto", "roster.md");
  const kanri = { role: "kanri", topic: "—", name: "kanri-a", sessionId: KANRI_ID, transcript: null };
  const seat = write(dir, "kanri.json", JSON.stringify({ ...SEAT, ...kanri }));
  const got = run(["record", "--init", "--roster", roster, "--seat", seat], dir);
  assert.strictEqual(got.code, 0, got.err);
  const text = fs.readFileSync(roster, "utf8");
  const lines = text.split("\n");
  const head = lines.findIndex((line) => line.startsWith("| Role |"));
  assert.ok(lines[head + 2].startsWith("| kanri | — | kanri-a | /repo |"), text);
  assert.ok(lines[head + 2].endsWith(`| ${KANRI_ID}.jsonl | — | — | — | — | — | — | 0 | 0 | 0 |`), text);
  assert.ok(!lines[head + 3].startsWith("|"), text);
  assert.ok(text.includes("| (no item yet) |"), text);
  assert.ok(!text.includes("- <YYYY-MM-DD HH:MM>"), text);
  const again = run(["record", "--init", "--roster", roster, "--seat", seat], dir);
  assert.strictEqual(again.code, 1);
  assert.ok(again.err.includes(`--init on a roster that exists (${roster})`), again.err);
  assert.strictEqual(fs.readFileSync(roster, "utf8"), text);
  const extra = run(["record", "--init", "--roster", path.join(dir, "x.md"), "--seat", seat, "--event", "x"], dir);
  assert.strictEqual(extra.code, 2);
  // The first Events line lands under the emptied heading.
  const event = run(["record", "--roster", roster, "--roster-event", "a first line", "--now", "2026-10-07 09:00"], dir);
  assert.strictEqual(event.code, 0, event.err);
  assert.ok(fs.readFileSync(roster, "utf8").endsWith("- 2026-10-07 09:00 — a first line\n"));
});

test("--succeeds writes the successor's row first and the predecessor's replaced, its other cells kept, with the Events line naming its Transcript (spec 2.4)", () => {
  const fixture = ledgerAndRoster();
  const record = (...args) => run(["record", "--roster", fixture.roster, ...args], fixture.dir);
  assert.strictEqual(record("--kanri", KANRI_ID, "--kanri-reading", KANRI_READING, "--read-at", "start").code, 0);
  const kanri = { role: "kanri", topic: "—", name: "kanri-y", sessionId: SUCCESSOR_ID, transcript: null };
  const successor = resultFile(fixture, "kanri.json", kanri);
  const handover = ["--seat", successor, "--succeeds", KANRI_ID, "--now", "2026-10-07 10:00"];
  const got = record(...handover);
  assert.strictEqual(got.code, 0, got.err);
  const text = fs.readFileSync(fixture.roster, "utf8");
  const lines = text.split("\n");
  const head = lines.findIndex((line) => line.startsWith("| Role |"));
  assert.ok(lines[head + 2].startsWith("| kanri | — | kanri-y |"), text);
  assert.ok(lines[head + 2].endsWith(`| ${SUCCESSOR_ID}.jsonl | — | — | — | — | — | — | 0 | 0 | 0 |`), text);
  const predecessor = `| replaced | /home/u/${KANRI_ID}.jsonl | start | 1 | 2 | 3 | 0 | context=4 | 0 | 0 | 0 |`;
  assert.ok(lines[head + 3].startsWith("| kanri | — | kanri-z |") && lines[head + 3].endsWith(predecessor), text);
  const said = `- 2026-10-07 10:00 — handover accepted by kanri-y from kanri-z — /home/u/${KANRI_ID}.jsonl`;
  assert.strictEqual(text.split(said).length - 1, 1, text);
  const twice = record(...handover);
  assert.strictEqual(twice.code, 0, twice.err);
  assert.strictEqual(fs.readFileSync(fixture.roster, "utf8"), text);
  assert.strictEqual(twice.out, got.out);
  const refusals = [
    [["--seat", successor, "--succeeds", "0f0f0f0f-0000-4000-8000-00000000000f"], 1, "a roster row for 0f0f0f0f"],
    [["--seat", resultFile(fixture, "jisso.json", {}), "--succeeds", SUCCESSOR_ID], 1, "whose role is kanri"],
    [["--seat", successor, "--seat", successor, "--succeeds", KANRI_ID], 2, "exactly one --seat"],
  ];
  for (const [args, code, said] of refusals) {
    const refused = record(...args);
    assert.strictEqual(refused.code, code, refused.err);
    assert.ok(refused.err.includes(said), refused.err);
  }
  assert.strictEqual(fs.readFileSync(fixture.roster, "utf8"), text);
});

test("--rename rewrites the Name cell and writes its resumed: line, --roster-event writes a stamped line once, and neither needs --ledger (spec 2.4)", () => {
  const fixture = ledgerAndRoster();
  const record = (...args) =>
    run(["record", "--roster", fixture.roster, "--now", "2026-10-07 11:00", ...args], fixture.dir);
  const rename = record("--rename", `${JISSO_ID} dotskills-jisso-roster-ledger-1a2b`);
  assert.strictEqual(rename.code, 0, rename.err);
  const text = fs.readFileSync(fixture.roster, "utf8");
  assert.ok(text.includes("| jisso | — | dotskills-jisso-roster-ledger-1a2b | /repo |"), text);
  assert.ok(text.includes("- 2026-10-07 11:00 — resumed: jisso-z → dotskills-jisso-roster-ledger-1a2b"), text);
  const again = record("--rename", `${JISSO_ID} dotskills-jisso-roster-ledger-1a2b`);
  assert.strictEqual(again.out, rename.out);
  assert.strictEqual(fs.readFileSync(fixture.roster, "utf8"), text);
  for (let i = 0; i < 2; i++) assert.strictEqual(record("--roster-event", "sent: kanri — a line").code, 0);
  const events = fs.readFileSync(fixture.roster, "utf8").split("— sent: kanri — a line").length - 1;
  assert.strictEqual(events, 1);
  const unknown = record("--rename", "0f0f0f0f-0000-4000-8000-00000000000f someone");
  assert.strictEqual(unknown.code, 1);
  assert.ok(unknown.err.includes("did not find a roster row for 0f0f0f0f-0000-4000-8000-00000000000f"), unknown.err);
});

test("--s-item given --roster and no --ledger writes the roster's items table under the same header check, and a ledger flag still needs --ledger (spec 2.4)", () => {
  const fixture = ledgerAndRoster();
  const item = ["--s-item", "exit-kanri-proposal.md item 1 | an item raised between plans"];
  const got = run(["record", "--roster", fixture.roster, ...item], fixture.dir);
  assert.strictEqual(got.code, 0, got.err);
  const text = fs.readFileSync(fixture.roster, "utf8");
  assert.ok(text.includes("| S-1 | exit-kanri-proposal.md item 1 | an item raised between plans |"), text);
  assert.ok(!text.includes("(no item yet)"), text);
  const old = text.replace("| S-n | Source | Item |", "| S-n | Source | Candidate |");
  fs.writeFileSync(fixture.roster, old, "utf8");
  const refused = run(["record", "--roster", fixture.roster, ...item], fixture.dir);
  assert.strictEqual(refused.code, 1);
  assert.ok(refused.err.includes("the Shoroku proposal items table header is not the template's"), refused.err);
  assert.strictEqual(fs.readFileSync(fixture.roster, "utf8"), old);
  for (const args of [["--event", "x"], ["--batch", "Z", "--state", "sent"], ["--progress", "x"], item]) {
    assert.strictEqual(run(["record", ...args], fixture.dir).code, 2, args.join(" "));
  }
});

/** A `record` call against the fixture's ledger and roster. */
function recordWith(fixture) {
  return (...args) => run(["record", "--ledger", fixture.ledger, "--roster", fixture.roster, ...args], fixture.dir);
}

/** The cells of the roster row whose Transcript cell carries `sessionId`. */
function rowCells(fixture, sessionId) {
  const line = fs
    .readFileSync(fixture.roster, "utf8")
    .split(/\r?\n/)
    .find((l) => l.includes(`${sessionId}.jsonl`));
  return line.slice(2, -2).split(" | ");
}

test("--status writes one of the five words into the row its sessionId finds, and refuses cleared, another word, and a name (spec 1.3, 2.3)", () => {
  const fixture = ledgerAndRoster();
  const seat = write(fixture.dir, "result.json", JSON.stringify(SEAT));
  const record = recordWith(fixture);
  assert.strictEqual(record("--seat", seat).code, 0);
  for (const word of ["stopped", "dead", "live", "replaced", "queued"]) {
    assert.strictEqual(record("--status", `${SEAT.sessionId} ${word}`).code, 0);
    assert.ok(fs.readFileSync(fixture.roster, "utf8").includes(`| ${word} | ${SEAT.transcript} |`), word);
  }
  const before = fs.readFileSync(fixture.roster, "utf8");
  const words = "one of queued, live, stopped, replaced, dead";
  const refusals = [
    [`${SEAT.sessionId} cleared`, words],
    [`${SEAT.sessionId} gone`, words],
    ["seat-one [aaaaaa] stopped", words],
    ["dotskills-jisso-1a2b stopped", "did not find a roster row for dotskills-jisso-1a2b"],
  ];
  for (const [value, said] of refusals) {
    const refused = record("--status", value);
    assert.strictEqual(refused.code, 1, value);
    assert.ok(refused.err.includes(said), refused.err);
  }
  assert.strictEqual(fs.readFileSync(fixture.roster, "utf8"), before);
});

test("--suffix appends and removes a live cell's suffix, and refuses a row whose word is not live (spec 2.3)", () => {
  const fixture = ledgerAndRoster();
  const record = recordWith(fixture);
  const status = () => rowCells(fixture, JISSO_ID)[9];
  assert.strictEqual(record("--suffix", `${JISSO_ID} blocked 10:12`).code, 0);
  assert.strictEqual(status(), "live (blocked since 10:12)");
  assert.strictEqual(record("--suffix", `${JISSO_ID} idle 10:30`).code, 0);
  assert.strictEqual(status(), "live (idle since 10:30)");
  assert.strictEqual(record("--suffix", `${JISSO_ID} none`).code, 0);
  assert.strictEqual(status(), "live");
  assert.strictEqual(record("--status", `${JISSO_ID} stopped`).code, 0);
  const refused = record("--suffix", `${JISSO_ID} idle 11:00`);
  assert.strictEqual(refused.code, 1);
  assert.ok(refused.err.includes("did not find a live row for --suffix (got stopped)"), refused.err);
  const garbled = record("--suffix", `${JISSO_ID} asleep`);
  assert.strictEqual(garbled.code, 1);
  assert.ok(garbled.err.includes('a --suffix "<sessionId> blocked <HH:MM>|idle <HH:MM>|none"'), garbled.err);
});

test("--kanri-count adds one to its column alone, --kanri-counts sets the three, and neither needs a reading (spec 2.3)", () => {
  const fixture = ledgerAndRoster();
  const record = recordWith(fixture);
  const counts = () => rowCells(fixture, KANRI_ID).slice(11).join(" ");
  assert.strictEqual(record("--kanri", KANRI_ID, "--kanri-count", "batches").code, 0);
  assert.strictEqual(record("--kanri", KANRI_ID, "--kanri-count", "batches").code, 0);
  assert.strictEqual(record("--kanri", KANRI_ID, "--kanri-count", "plans").code, 0);
  assert.strictEqual(counts(), "— — — — — — 2 1 0");
  assert.strictEqual(record("--kanri", KANRI_ID, "--kanri-counts", "5 6 7").code, 0);
  assert.strictEqual(counts(), "— — — — — — 5 6 7");
  const wrong = record("--kanri", KANRI_ID, "--kanri-count", "wake-ups");
  assert.strictEqual(wrong.code, 1);
  assert.ok(wrong.err.includes("a --kanri-count of batches, plans, or noticed (got wake-ups)"), wrong.err);
  assert.strictEqual(record("--kanri-count", "batches").code, 2);
  assert.strictEqual(counts(), "— — — — — — 5 6 7");
});

test("a peer line that carries a name in place of a sessionId does not parse (spec 2.3)", () => {
  const fixture = ledgerAndRoster();
  const before = fs.readFileSync(fixture.roster, "utf8");
  const line = "keikaku keikaku-a [ccdd11] transcript: 7 B, 8 records, 9 wake-ups, 1 compactions, context=10";
  const refused = recordWith(fixture)("--batch", "Z", "--peer-reading", line);
  assert.strictEqual(refused.code, 1);
  assert.ok(refused.err.includes(`did not find a --peer-reading that parses (got ${line})`), refused.err);
  assert.strictEqual(fs.readFileSync(fixture.roster, "utf8"), before);
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

/** The six columns of the template's Shoroku proposal items table. */
const ITEM_COLUMNS = ["S-n", "Source", "Item", "Destination", "Adopted", "Written"];

/** The cells of the items row whose S-n cell is `label`. */
function itemCells(ledger, label) {
  const line = fs
    .readFileSync(ledger, "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith(`| ${label} |`));
  return line ? line.slice(2, -2).split(" | ") : null;
}

test("--s-item takes three fields, writes `—` for an empty destination, reads two fields as source and item, and keeps its dedup (spec 2.5)", () => {
  const f = itemsLedger(ITEM_COLUMNS);
  const item = (value) => run(["record", "--ledger", f.ledger, "--s-item", value], f.dir);
  for (const value of [
    "report.md item 1 | issues | an item",
    "report.md item 2 |  | another item",
    "report.md item 3 | an item from a brief rendered before the destination field",
  ]) {
    const got = item(value);
    assert.strictEqual(got.code, 0, got.err);
  }
  const again = item("report.md item 1 | issues | an item");
  assert.strictEqual(again.out, "| S-1 | report.md item 1 | an item | issues | pending | no |\n");
  assert.deepStrictEqual(itemCells(f.ledger, "S-2"), ["S-2", "report.md item 2", "another item", "—", "pending", "no"]);
  const old = [
    "S-3",
    "report.md item 3",
    "an item from a brief rendered before the destination field",
    "—",
    "pending",
    "no",
  ];
  assert.deepStrictEqual(itemCells(f.ledger, "S-3"), old);
  assert.strictEqual(itemCells(f.ledger, "S-4"), null);
});

test("an S-n table that holds a number twice is refused before any row is written (spec 2.5)", () => {
  const f = itemsLedger(ITEM_COLUMNS);
  const collided = "| S-28 | a.md item 1 | one | — | pending | no |\n| S-28 | b.md item 1 | two | — | pending | no |";
  const text = fs.readFileSync(f.ledger, "utf8").replace("| (no item yet) | | | | | |", collided);
  fs.writeFileSync(f.ledger, text, "utf8");
  const refused = run(["record", "--ledger", f.ledger, "--s-item", "c.md item 1 |  | three"], f.dir);
  assert.strictEqual(refused.code, 1);
  assert.ok(refused.err.includes("did not find an S-n table with no number used twice (S-28 twice)"), refused.err);
  assert.strictEqual(fs.readFileSync(f.ledger, "utf8"), text);
});

/** A ledger whose items table holds S-1 to S-4, with the destinations given. */
function directedLedger(destinations) {
  const f = itemsLedger(ITEM_COLUMNS);
  destinations.forEach((destination, i) => {
    const value = `report.md item ${i + 1} | ${destination} | item ${i + 1}`;
    assert.strictEqual(run(["record", "--ledger", f.ledger, "--s-item", value], f.dir).code, 0);
  });
  return f;
}

/** A direction file built from the template, its two placeholder lines replaced by `items`. */
function directionFile(f, items) {
  const lines = fs.readFileSync(path.join(TANTO, "templates", "shoroku-direction.md"), "utf8").split(/\r?\n/);
  const at = lines.findIndex((line) => line.startsWith("- <n> "));
  lines.splice(at, 2, ...items);
  return write(f.dir, "shoroku-direction.md", lines.join("\n"));
}

test("--direction writes Adopted from a direction file, printing its inbox and unmatched lines, and refuses a file that matches no S-n (spec 2.6)", () => {
  const f = directedLedger(["issues", "notes", "issues"]);
  const items = [
    "- 1 — adopt — yes — t S-1",
    "- 2 — reject — no — t S-2",
    "- 3 — fix — yes — t S-3",
    "- 4 — adopt — yes — (inbox 2026-10-07-bug.md #2)",
    "- 5 — adopt — yes — t S-9",
    "- 6 — adopt — yes — other S-1",
  ];
  const file = directionFile(f, items);
  const got = run(["record", "--ledger", f.ledger, "--direction", file], f.dir);
  assert.strictEqual(got.code, 0, got.err);
  assert.deepStrictEqual(
    [1, 2, 3].map((n) => itemCells(f.ledger, `S-${n}`)[4]),
    ["yes", "no", "yes"],
  );
  assert.ok(got.out.includes(`direction: no S-n — ${items[3]}\n`), got.out);
  assert.ok(got.out.includes(`direction: unmatched — ${items[4]}\n`), got.out);
  assert.ok(got.out.includes(`direction: unmatched — ${items[5]}\n`), got.out);
  const after = fs.readFileSync(f.ledger, "utf8");
  assert.strictEqual(run(["record", "--ledger", f.ledger, "--direction", file], f.dir).out, got.out);
  assert.strictEqual(fs.readFileSync(f.ledger, "utf8"), after);
  const inboxOnly = directionFile(f, [items[3]]);
  const refused = run(["record", "--ledger", f.ledger, "--direction", inboxOnly], f.dir);
  assert.strictEqual(refused.code, 1);
  assert.ok(refused.err.includes(`direction: nothing matched — ${inboxOnly}`), refused.err);
  assert.strictEqual(fs.readFileSync(f.ledger, "utf8"), after);
});

test("--written fills Written for the adopted rows still `no`, skipping a feedback-only row; --only narrows it; --written-feedback fills that row (spec 2.6)", () => {
  const f = directedLedger(["issues", "feedback", "notes; feedback", "issues"]);
  const items = [
    "- 1 — adopt — yes — t S-1",
    "- 2 — adopt — yes — t S-2",
    "- 3 — fix — yes — t S-3",
    "- 4 — reject — no — t S-4",
  ];
  assert.strictEqual(run(["record", "--ledger", f.ledger, "--direction", directionFile(f, items)], f.dir).code, 0);
  const record = (...args) => run(["record", "--ledger", f.ledger, ...args], f.dir);
  const writtenCells = () => [1, 2, 3, 4].map((n) => itemCells(f.ledger, `S-${n}`)[5]);
  assert.strictEqual(record("--written", "fix: the shusei commit", "--only", "S-3").code, 0);
  assert.deepStrictEqual(writtenCells(), ["no", "no", "fix: the shusei commit", "no"]);
  const shoki = record("--written", "docs: the shoki commit");
  assert.strictEqual(shoki.code, 0, shoki.err);
  assert.deepStrictEqual(writtenCells(), ["docs: the shoki commit", "no", "fix: the shusei commit", "no"]);
  assert.strictEqual(record("--written", "docs: the shoki commit").out, shoki.out);
  assert.strictEqual(record("--written-feedback", "2026-10-07-t.md").code, 0);
  assert.deepStrictEqual(writtenCells(), [
    "docs: the shoki commit",
    "feedback 2026-10-07-t.md",
    "fix: the shusei commit",
    "no",
  ]);
  const unknown = record("--written", "x", "--only", "S-9");
  assert.strictEqual(unknown.code, 1);
  assert.ok(unknown.err.includes("did not find an S-n row for S-9"), unknown.err);
  assert.strictEqual(run(["record", "--written", "x"], f.dir).code, 2);
});

test("an S-n row is written in the template's six columns, and a table with the retired seventh is refused, naming migrate", () => {
  const six = ["S-n", "Source", "Item", "Destination", "Adopted", "Written"];
  const seven = ["S-n", "Source", "Item", "Destination", "Adopted", RETIRED, "Written"];
  const f = itemsLedger(six);
  const result = run(["record", "--ledger", f.ledger, "--s-item", "report.md item 1 | an item"], f.dir);
  assert.strictEqual(result.code, 0, result.err);
  const ledger = fs.readFileSync(f.ledger, "utf8");
  assert.ok(ledger.includes("| S-1 | report.md item 1 | an item |"), ledger);
  assert.ok(!ledger.includes("(no item yet)"), ledger);
  const old = itemsLedger(seven);
  const before = fs.readFileSync(old.ledger, "utf8");
  const refused = run(["record", "--ledger", old.ledger, "--s-item", "report.md item 1 | an item"], old.dir);
  assert.strictEqual(refused.code, 1);
  assert.ok(refused.err.includes("the Shoroku proposal items table header is not the template's"), refused.err);
  assert.ok(refused.err.endsWith("— run boundary.js migrate\n"), refused.err);
  assert.strictEqual(fs.readFileSync(old.ledger, "utf8"), before);
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
  "| Role | Topic | Name | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |",
  `|${" --- |".repeat(20)}`,
];

function sessionRow(role, topic, name, status, transcript) {
  return `| ${role} | ${topic} | ${name} | /repo | sonnet | high | main | auto | 2026-09-23 10:00 | ${status} | ${transcript} |${" — |".repeat(9)}`;
}

test("census refuses a roster whose seats table is not the template's, naming migrate (spec 3)", () => {
  const f = censusFixture([], () => []);
  const old = fs.readFileSync(f.roster, "utf8").replace("| Name | cwd |", `| ${OLD_NAME} | cwd |`);
  fs.writeFileSync(f.roster, old, "utf8");
  const result = census(f, "");
  assert.strictEqual(result.code, 1);
  assert.strictEqual(result.out, "census: roster header is not the template's — run boundary.js migrate\n");
  assert.strictEqual(fs.readFileSync(f.roster, "utf8"), old);
});

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

test("census prints the spawner: line, then the live and queued rows under its six headings, by its own path comparison", () => {
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
      "spawner: stale",
      "",
      "## Listed",
      "",
      "kanri — kanri-a [aaaaaa] — sess-kanri — listed as kanri-a (background)",
      "sekkei t sekkei-b [bbbbbb] — sess-sekkei — listed as dotskills-4d (interactive) — renamed",
      "jisso t jisso-f — sess-queued — listed as jisso-f (background)",
      "",
      "## Parked",
      "",
      "none",
      "",
      "## Ended",
      "",
      "none",
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
  for (const heading of ["Parked", "Ended", "Not listed", "No session id", "Not held"]) {
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
      // A seat that answered and waits lists `state: "blocked"` beside
      // `status: "idle"`, and is not blocked (spec 2.6, S-1).
      {
        sessionId: "sess-kanri",
        name: "kanri-a",
        kind: "background",
        cwd: root,
        pid: 1111,
        state: "blocked",
        status: "idle",
      },
      {
        sessionId: "sess-jisso",
        name: "jisso-h",
        kind: "background",
        cwd: root,
        pid: 1112,
        status: "waiting",
        waitingFor: "permission prompt",
      },
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
        "kanri — kanri-a [aaaaaa] — sess-kanri — listed as kanri-a (background)",
        "jisso t jisso-h — sess-jisso — listed as jisso-h (background) — blocked (permission prompt) — no first turn since 2026-10-03 10:02",
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

test("census prints Parked with its marks, Ended, a blocked background seat's cause, and a seat no row holds (spec 1.3, 2.6, 2.7)", () => {
  const f = censusFixture(
    [
      KANRI_ROW,
      sessionRow("sekkei", "t", "sekkei-b", "live", "/home/u/.claude/projects/p/sess-sekkei.jsonl"),
      sessionRow("keikaku", "t", "keikaku-c", "live", "/home/u/.claude/projects/p/sess-keikaku.jsonl"),
      sessionRow("hosa", "—", "hosa-d", "live", "/home/u/.claude/projects/p/sess-hosa.jsonl"),
      sessionRow("jisso", "t", "jisso-e", "live", "/home/u/.claude/projects/p/sess-done.jsonl"),
      sessionRow("jisso", "t", "jisso-f", "queued", "/home/u/.claude/projects/p/sess-gone.jsonl"),
      sessionRow("kaiseki", "t", "kaiseki-g", "live", "/home/u/.claude/projects/p/sess-tab.jsonl"),
      sessionRow("jisso", "u", "jisso-h", "live", "/home/u/.claude/projects/p/sess-prompt.jsonl"),
    ],
    (root) => [
      { sessionId: "sess-kanri", name: "kanri-a", kind: "background", cwd: root, pid: 1111, status: "busy" },
      // A prompt in a tab is never blocked; a background one is, with its cause.
      {
        sessionId: "sess-tab",
        name: "dotskills-7b",
        kind: "interactive",
        cwd: root,
        pid: 1112,
        status: "waiting",
        waitingFor: "permission prompt",
      },
      {
        sessionId: "sess-prompt",
        name: "jisso-h",
        kind: "background",
        cwd: root,
        pid: 1113,
        status: "waiting",
        waitingFor: "permission prompt",
      },
      {
        sessionId: "sess-hosa2",
        name: "dotskills-hosa-3c4d",
        kind: "background",
        cwd: root,
        pid: 1114,
        status: "idle",
      },
    ],
  );
  const spawnerDir = path.join(f.root, ".tanto", "spawner");
  fs.mkdirSync(spawnerDir, { recursive: true });
  fs.writeFileSync(path.join(spawnerDir, "heartbeat"), `${Date.now()}\n`);
  const seats = [
    { sessionId: "sess-kanri", role: "kanri", status: "running" },
    {
      sessionId: "sess-sekkei",
      role: "sekkei",
      topic: "t",
      status: "parked",
      contract: 2,
      midTurn: true,
      waiting: true,
    },
    { sessionId: "sess-keikaku", role: "keikaku", topic: "t", status: "parked", contract: 2 },
    { sessionId: "sess-hosa", role: "hosa", status: "stopped", endedBy: "taiseki" },
    { sessionId: "sess-done", role: "jisso", topic: "t", status: "removed" },
    { sessionId: "sess-gone", role: "jisso", topic: "t", status: "gone" },
    {
      sessionId: "sess-kikaku",
      name: "dotskills-kikaku-1a2b",
      role: "kikaku",
      topic: "—",
      status: "parked",
      contract: 2,
      requestId: "req-kikaku",
    },
    {
      sessionId: "sess-hosa2",
      name: "dotskills-hosa-3c4d",
      role: "hosa",
      topic: "—",
      status: "running",
      contract: 2,
      requestId: "req-hosa",
    },
    // An earlier run's seats no row holds: collected, or ended.
    { sessionId: "sess-old", name: "dotskills-kanri-9f9f", role: "kanri", status: "gone" },
    { sessionId: "sess-left", name: "dotskills-kikaku-7c7c", role: "kikaku", status: "stopped", endedBy: "taiseki" },
  ];
  fs.writeFileSync(path.join(spawnerDir, "seats.json"), JSON.stringify({ seats }));
  const result = census(f, "");
  assert.strictEqual(result.code, 0, result.err);
  assert.strictEqual(
    result.out,
    [
      "spawner: beating",
      "",
      "## Listed",
      "",
      "kanri — kanri-a [aaaaaa] — sess-kanri — listed as kanri-a (background)",
      "kaiseki t kaiseki-g — sess-tab — listed as dotskills-7b (interactive) — renamed",
      "jisso u jisso-h — sess-prompt — listed as jisso-h (background) — blocked (permission prompt)",
      "",
      "## Parked",
      "",
      "sekkei t sekkei-b — sess-sekkei — mid-turn — waiting",
      "keikaku t keikaku-c — sess-keikaku",
      "",
      "## Ended",
      "",
      "hosa — hosa-d — sess-hosa — stopped by taiseki",
      "jisso t jisso-e — sess-done — removed",
      "",
      "## Not listed",
      "",
      "jisso t jisso-f — sess-gone",
      "",
      "## No session id",
      "",
      "none",
      "",
      "## Not held",
      "",
      "dotskills-hosa-3c4d (background) — sess-hosa2 — spawned as hosa —, result req-hosa",
      "dotskills-kikaku-1a2b (not listed) — sess-kikaku — spawned as kikaku —, result req-kikaku",
      "",
    ].join("\n"),
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
      {
        sessionId: "sess-jisso",
        name: "jisso-h",
        kind: "background",
        cwd: root,
        pid: 1112,
        status: "waiting",
        waitingFor: "permission prompt",
      },
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
      "jisso t jisso-h — sess-jisso — listed as jisso-h (background) — blocked (permission prompt) — no first turn since 2026-10-04 10:02\n",
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

// `request`, `seat`, `wake`, and `beat`: a root with the spawner's directory,
// its state file, and its heartbeat — fresh, or ten minutes old — and the
// census's fake `claude` for the listing.
function spawnerFixture(seatsOf, sessionsOf, beating = true) {
  const f = censusFixture([KANRI_ROW], sessionsOf);
  const dir = path.join(f.root, ".tanto", "spawner");
  fs.mkdirSync(path.join(dir, "requests"), { recursive: true });
  fs.mkdirSync(path.join(dir, "results"), { recursive: true });
  fs.writeFileSync(path.join(dir, "seats.json"), JSON.stringify({ seats: seatsOf(f) }));
  fs.writeFileSync(path.join(dir, "heartbeat"), `${Date.now() - (beating ? 0 : 600000)}\n`);
  return { ...f, spawner: dir };
}

function fakeEnv(f) {
  return { ...process.env, TANTO_CLAUDE_NODE: f.fake, FAKE_LISTING: f.listing, FAKE_ARGS: f.args, FAKE_MODE: "" };
}

function sub(f, args, env = {}) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: "utf8",
    cwd: f.root,
    env: { ...fakeEnv(f), ...env },
  });
  return { code: result.status, out: (result.stdout || "").replace(/\r\n/g, "\n"), err: result.stderr || "" };
}

/** The request files `wake` or `request` wrote, in the order the spawner takes them. */
function requestsOf(f) {
  const dir = path.join(f.spawner, "requests");
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => JSON.parse(fs.readFileSync(path.join(dir, name), "utf8")));
}

/**
 * A transcript of one turn: ended — an `end_turn` message its Stop hook's
 * record settles — or open on a tool call; with `tail`, records after it.
 */
function transcriptOf(dir, sessionId, ended, tail = []) {
  const reply = ended
    ? { id: "msg-1", model: "claude-test", stop_reason: "end_turn", content: [{ type: "text", text: "done" }] }
    : { id: "msg-1", model: "claude-test", stop_reason: "tool_use", content: [{ type: "tool_use", id: "t-1" }] };
  const records = [
    { type: "user", uuid: "u-1", message: { role: "user", content: "go" } },
    { type: "assistant", uuid: "a-1", message: reply },
    ...(ended ? [{ type: "system", subtype: "stop_hook_summary", uuid: "s-1" }] : []),
    ...tail,
  ];
  return write(dir, `${sessionId}.jsonl`, `${records.map((r) => JSON.stringify(r)).join("\n")}\n`);
}

test("request park and request leave write the seat's own request, after its transcript's last uuid (spec 2.2, 5.2)", () => {
  const f = spawnerFixture(
    () => [],
    () => [],
  );
  // The last record carries no uuid; the one before it does.
  const t = transcriptOf(f.dir, "sess-park", true, [{ type: "file-history-snapshot", messageId: "m-1" }]);
  assert.strictEqual(sub(f, ["request", "park", "--transcript", t, "--waiting", "--notice"]).code, 0);
  assert.deepStrictEqual(requestsOf(f), [
    { op: "park", sessionId: "sess-park", waiting: true, notice: true, after: "s-1" },
  ]);
  for (const name of fs.readdirSync(path.join(f.spawner, "requests"))) {
    fs.rmSync(path.join(f.spawner, "requests", name));
  }
  const parked = sub(f, ["request", "park", "--transcript", t]);
  assert.strictEqual(parked.code, 0, parked.err);
  assert.match(parked.out, /^park requested: \S+\n$/);
  const leave = sub(f, ["request", "leave", "--transcript", t]);
  assert.strictEqual(leave.code, 0, leave.err);
  assert.deepStrictEqual(requestsOf(f), [
    { op: "park", sessionId: "sess-park", waiting: false, notice: false, after: "s-1" },
    { op: "stop", sessionId: "sess-park", self: true, after: "s-1" },
  ]);
});

test("request refuses --notice without --waiting, a flag on leave, and a root with no spawner, writing nothing", () => {
  const f = spawnerFixture(
    () => [],
    () => [],
  );
  const t = transcriptOf(f.dir, "sess-park", true);
  const refusals = [
    [["park", "--transcript", t, "--notice"], /--notice goes with --waiting/],
    [["leave", "--transcript", t, "--waiting"], /takes no --waiting and no --notice/],
    [["sleep", "--transcript", t], /needs park, leave, or attention/],
    [["park", "--transcript", t, "--root", f.dir], /no spawner requests directory/],
  ];
  for (const [args, said] of refusals) {
    const got = sub(f, ["request", ...args]);
    assert.strictEqual(got.code, 2, got.err);
    assert.match(got.err, said);
  }
  assert.deepStrictEqual(requestsOf(f), []);
});

test("seat prints its five words and its sessionId, then the spawner: line, by sessionId or by name, and no entry with the listing's kind (spec 1.5, 2.5)", () => {
  const f = spawnerFixture(
    (fx) => [
      {
        sessionId: "sess-a",
        name: "dotskills-sekkei-t-1a2b",
        role: "sekkei",
        status: "parked",
        transcript: transcriptOf(fx.dir, "sess-a", true),
      },
      {
        sessionId: "sess-b",
        name: "dotskills-keikaku-t-3c4d",
        role: "keikaku",
        status: "running",
        transcript: transcriptOf(fx.dir, "sess-b", false),
      },
      // Stopped while a tab holds it: still listed, under the editor's name.
      { sessionId: "sess-c", name: "dotskills-kikaku-5e6f", role: "kikaku", status: "stopped" },
      { sessionId: "sess-d", name: "dotskills-denrei-7a8b", role: "denrei", status: "removed" },
    ],
    (root) => [
      { sessionId: "sess-b", name: "dotskills-keikaku-t-3c4d", kind: "background", cwd: root, pid: 1112 },
      { sessionId: "sess-c", name: "dotskills-7b", kind: "interactive", cwd: root, pid: 1113 },
      { sessionId: "sess-bg", name: "dotskills-kanri-9e9e", kind: "background", cwd: root, pid: 1114 },
      { sessionId: "sess-tab", name: "dotskills-3f", kind: "interactive", cwd: root, pid: 1115 },
    ],
  );
  const lines = (who) => sub(f, ["seat", who, "--root", f.root]).out;
  assert.strictEqual(lines("sess-a"), "parked dotskills-sekkei-t-1a2b - sekkei ended sess-a\nspawner: beating\n");
  assert.strictEqual(
    lines("sess-b"),
    "running dotskills-keikaku-t-3c4d background keikaku open sess-b\nspawner: beating\n",
  );
  assert.strictEqual(lines("sess-c"), "stopped dotskills-7b interactive kikaku - sess-c\nspawner: beating\n");
  // A name resolves to its sessionId, the sixth field Kanri reads at receipt (roster-ledger 2.3).
  assert.strictEqual(
    lines("dotskills-denrei-7a8b"),
    "removed dotskills-denrei-7a8b - denrei - sess-d\nspawner: beating\n",
  );
  assert.strictEqual(lines("sess-bg"), "no entry background\nspawner: beating\n");
  assert.strictEqual(lines("sess-tab"), "no entry interactive\nspawner: beating\n");
  assert.strictEqual(lines("sess-none"), "no entry -\nspawner: beating\n");
});

test("seat exits 1 with `seat: the listing failed` and no entry line when the listing fails, for a held seat or not", () => {
  const f = spawnerFixture(
    () => [{ sessionId: "sess-a", name: "dotskills-sekkei-t-1a2b", role: "sekkei", status: "parked" }],
    () => [],
  );
  for (const mode of ["fail", "garbage"]) {
    for (const who of ["sess-a", "sess-none"]) {
      const got = sub(f, ["seat", who, "--root", f.root], { FAKE_MODE: mode });
      assert.strictEqual(got.code, 1, `${mode} ${who}: ${got.err}`);
      assert.strictEqual(got.out, "", `${mode} ${who}`);
    }
  }
  const failed = sub(f, ["seat", "sess-none", "--root", f.root], { FAKE_MODE: "fail" });
  assert.strictEqual(failed.err, "boundary.js: seat: the listing failed — listing broke\n");
  const garbage = sub(f, ["seat", "sess-none", "--root", f.root], { FAKE_MODE: "garbage" });
  assert.strictEqual(garbage.err, "boundary.js: seat: the listing failed — claude agents --json printed no JSON\n");
  // A listing that works still answers, so the exit 1 above is the listing's alone.
  assert.deepStrictEqual(sub(f, ["seat", "sess-none", "--root", f.root]), {
    code: 0,
    out: "no entry -\nspawner: beating\n",
    err: "",
  });
});

test("beat prints the spawner: line and exits 1 when the heartbeat is stale or absent (spec 2.5)", () => {
  const live = spawnerFixture(
    () => [],
    () => [],
  );
  assert.deepStrictEqual(sub(live, ["beat", "--root", live.root]), {
    code: 0,
    out: "spawner: beating\n",
    err: "",
  });
  const stale = spawnerFixture(
    () => [],
    () => [],
    false,
  );
  assert.strictEqual(sub(stale, ["beat", "--root", stale.root]).out, "spawner: stale\n");
  assert.strictEqual(sub(stale, ["beat", "--root", stale.root]).code, 1);
  fs.rmSync(path.join(stale.spawner, "heartbeat"));
  assert.strictEqual(sub(stale, ["beat", "--root", stale.root]).out, "spawner: stale\n");
});

/**
 * `wake`, run beside a fake spawner that answers each request it finds with
 * `answer(request)` merged into it, as the spawner writes a result.
 */
async function wakeBeside(f, args, answer, env = {}) {
  const child = spawn(process.execPath, [SCRIPT, "wake", "--root", f.root, ...args], {
    cwd: f.root,
    env: { ...fakeEnv(f), TANTO_WAKE_WAIT_MS: "10000", ...env },
  });
  let out = "";
  child.stdout.on("data", (chunk) => {
    out += chunk;
  });
  let code = null;
  child.on("close", (status) => {
    code = status;
  });
  const seen = [];
  while (code === null) {
    const dir = path.join(f.spawner, "requests");
    const names = fs.readdirSync(dir).filter((n) => n.endsWith(".json"));
    for (const name of names.sort()) {
      const request = JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"));
      fs.rmSync(path.join(dir, name));
      seen.push(request);
      const result = path.join(f.spawner, "results", name);
      fs.writeFileSync(`${result}.tmp`, JSON.stringify({ ...request, ...answer(request) }));
      fs.renameSync(`${result}.tmp`, result);
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return { code, out: out.replace(/\r\n/g, "\n"), seen };
}

test("wake resumes several seats with no prompt in one call, and prints each seat's line or its error (spec 2.5)", async () => {
  const f = spawnerFixture(
    (fx) => [
      {
        sessionId: "sess-a",
        name: "dotskills-sekkei-t-1a2b",
        role: "sekkei",
        status: "parked",
        transcript: transcriptOf(fx.dir, "sess-a", true),
      },
      { sessionId: "sess-b", name: "dotskills-keikaku-t-3c4d", role: "keikaku", status: "parked" },
    ],
    (root) => [{ sessionId: "sess-a", name: "dotskills-sekkei-t-1a2b", kind: "background", cwd: root, pid: 1112 }],
  );
  const seatsFile = path.join(f.spawner, "seats.json");
  const woken = await wakeBeside(f, ["sess-a", "sess-b"], (request) => {
    if (request.sessionId === "sess-b") return { error: "listed", name: "dotskills-4d", kind: "interactive" };
    const doc = JSON.parse(fs.readFileSync(seatsFile, "utf8"));
    doc.seats[0].status = "running";
    fs.writeFileSync(seatsFile, JSON.stringify(doc));
    return { id: "1a2b", name: "dotskills-sekkei-t-1a2b" };
  });
  assert.deepStrictEqual(woken.seen, [
    { op: "resume", sessionId: "sess-a" },
    { op: "resume", sessionId: "sess-b" },
  ]);
  assert.strictEqual(
    woken.out,
    [
      "spawner: beating",
      "running dotskills-sekkei-t-1a2b background sekkei ended sess-a",
      "error: listed — sess-b dotskills-4d",
      "",
    ].join("\n"),
  );
  assert.strictEqual(woken.code, 1);
});

test("wake --hold writes each seat's hold, with forMs and no pid, before its resume (spec 2.4)", async () => {
  const f = spawnerFixture(
    () => [{ sessionId: "sess-a", name: "dotskills-hosa-1a2b", role: "hosa", status: "parked" }],
    () => [],
  );
  const woken = await wakeBeside(f, ["--hold", "sess-a"], () => ({}));
  assert.deepStrictEqual(woken.seen, [
    { op: "hold", sessionId: "sess-a", forMs: 3300000 },
    { op: "resume", sessionId: "sess-a" },
  ]);
  assert.strictEqual(woken.out, "spawner: beating\nparked dotskills-hosa-1a2b - hosa - sess-a\n");
  assert.strictEqual(woken.code, 0);
});

test("wake --hold exits 1 and says `hold:` on the seat's line when only its hold failed (spec 2.4, 2.5)", async () => {
  const f = spawnerFixture(
    () => [{ sessionId: "sess-a", name: "dotskills-hosa-1a2b", role: "hosa", status: "parked" }],
    () => [],
  );
  const woken = await wakeBeside(f, ["--hold", "sess-a"], (request) =>
    request.op === "hold" ? { error: "no such seat" } : {},
  );
  assert.strictEqual(woken.out, "spawner: beating\nparked dotskills-hosa-1a2b - hosa - sess-a — hold: no such seat\n");
  assert.strictEqual(woken.code, 1);
});

test("wake prints `listing:` and exits 1 when the listing fails, after each seat's line", async () => {
  const f = spawnerFixture(
    () => [{ sessionId: "sess-a", name: "dotskills-hosa-1a2b", role: "hosa", status: "parked" }],
    () => [],
  );
  const woken = await wakeBeside(f, ["sess-a"], () => ({}), { FAKE_MODE: "fail" });
  assert.strictEqual(
    woken.out,
    "spawner: beating\nparked dotskills-hosa-1a2b - hosa - sess-a\nlisting: listing broke\n",
  );
  assert.strictEqual(woken.code, 1);
});

test("wake writes nothing on a stale spawner, and names a seat whose result never came", () => {
  const stale = spawnerFixture(
    () => [],
    () => [],
    false,
  );
  assert.deepStrictEqual(sub(stale, ["wake", "sess-a", "--root", stale.root]), {
    code: 1,
    out: "spawner: stale\n",
    err: "",
  });
  assert.deepStrictEqual(requestsOf(stale), []);
  const quiet = spawnerFixture(
    () => [],
    () => [],
  );
  const got = sub(quiet, ["wake", "sess-a", "--root", quiet.root], { TANTO_WAKE_WAIT_MS: "300" });
  assert.strictEqual(got.out, "spawner: beating\nerror: no result — sess-a\n");
  assert.strictEqual(got.code, 1);
});

test("request attention writes the intake's notice on a beating spawner, naming no seat, beside a seat's park request (tanto-feedback 7.2)", () => {
  const f = spawnerFixture(
    () => [],
    () => [],
  );
  const t = transcriptOf(f.dir, "sess-hosa", true);
  assert.strictEqual(sub(f, ["request", "park", "--transcript", t]).code, 0);
  const got = sub(f, ["request", "attention", "--message", "consult: waiting — tanto kikaku", "--root", f.root]);
  assert.strictEqual(got.code, 0, got.err);
  assert.match(got.out, /^attention requested: \S+\n$/);
  // The seat's own park request stands beside it, unchanged.
  assert.deepStrictEqual(requestsOf(f), [
    { op: "park", sessionId: "sess-hosa", waiting: false, notice: false, after: "s-1" },
    { op: "attention", message: "consult: waiting — tanto kikaku" },
  ]);
});

test("request attention writes nothing and exits 1 with the spawner: line on a stale or absent heartbeat", () => {
  const stale = spawnerFixture(
    () => [],
    () => [],
    false,
  );
  const args = ["request", "attention", "--message", "consult: waiting — tanto kikaku", "--root", stale.root];
  assert.deepStrictEqual(sub(stale, args), { code: 1, out: "spawner: stale\n", err: "" });
  fs.rmSync(path.join(stale.spawner, "heartbeat"));
  assert.deepStrictEqual(sub(stale, args), { code: 1, out: "spawner: stale\n", err: "" });
  assert.deepStrictEqual(requestsOf(stale), []);
});

test("request attention refuses a --transcript, a park flag, and a missing --message, writing nothing", () => {
  const f = spawnerFixture(
    () => [],
    () => [],
  );
  const t = transcriptOf(f.dir, "sess-hosa", true);
  const noSeat = /takes no --transcript, --waiting, or --notice/;
  const refusals = [
    [["attention", "--message", "consult: waiting", "--transcript", t], noSeat],
    [["attention", "--message", "consult: waiting", "--waiting"], noSeat],
    [["attention"], /needs --message <text>/],
    [["attention", "--message"], /needs --message <text>/],
  ];
  for (const [args, said] of refusals) {
    const got = sub(f, ["request", ...args]);
    assert.strictEqual(got.code, 2, got.err);
    assert.match(got.err, said);
  }
  assert.deepStrictEqual(requestsOf(f), []);
});
