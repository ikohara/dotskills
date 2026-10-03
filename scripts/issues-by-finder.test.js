const test = require("node:test");
const { after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const { parseSource, findRow, mapFinder, finderOf, countByFinder, expCount, main } = require("./issues-by-finder.js");

const SCRIPT = path.join(__dirname, "issues-by-finder.js");
const DASH = "—";

const tmpDirs = [];

function mkTmp() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "issues-by-finder-"));
  tmpDirs.push(dir);
  return dir;
}

after(() => {
  for (const dir of tmpDirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

function write(root, rel, text) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function issueText(source, eol = "\n") {
  const front = ["---", 'id: "abcd"', 'title: "a title"', "---", ""];
  const body = source === null ? ["", "Some body without a source line."] : ["", `Source: ${source}`, "", "Body."];
  return [...front, ...body, ""].join(eol);
}

const T1_LEDGER = [
  "# t1 ledger",
  "",
  "## Shoroku candidates",
  "",
  "| S-n | Source | Candidate | Destination |",
  "|-----|--------|-----------|-------------|",
  "| S-1 | spec-review.md #1 | first | issues |",
  "| S-2 | plan-review.md #3 | second | issues |",
  "| S-5 | carried from t3 S-1 | fifth | issues |",
  "",
].join("\n");

const T2_LEDGER = [
  "# t2 ledger",
  "",
  "## Events",
  "",
  "| Time | Event |",
  "|------|-------|",
  "| 10:00 | started |",
  "",
  "## Shoroku proposal items",
  "",
  "| S-n | Source | Item | Destination |",
  "|-----|--------|------|-------------|",
  "| S-1 | batch-B-report.md #2 | one | issues |",
  "| S-2 | carried from t1 S-2: the original file | two | issues |",
  "| S-3 | carried from t1 S-5 | three | issues |",
  "| S-4 | carried from roster-S-4: Kikaku decision `x.md` | four | issues |",
  "| S-5 | Destination words only | five | issues |",
  "| S-6 | odd \\| pipe cell | six | issues |",
  "",
].join("\r\n");

const T3_LEDGER = [
  "## Shoroku proposal items",
  "",
  "| S-n | Source | Item |",
  "|--|--|--|",
  "| S-1 | batch-C-report.md | x |",
  "",
].join("\n");

function ledgerFixture() {
  const root = mkTmp();
  write(root, ".tanto/t1/kanri.md", T1_LEDGER);
  write(root, ".tanto/t2/kanri.md", T2_LEDGER);
  write(root, ".tanto/t3/kanri.md", T3_LEDGER);
  return root;
}

// Nine issues over the three status directories.
function pileFixture() {
  const root = ledgerFixture();
  const issues = [
    ["open", "a1", "inbox 2026-01-01-x"],
    ["open", "a2", "session 2026-01-01"],
    ["open", "a3", "hotfix fix the thing"],
    ["deferred", "b1", "shoroku t1"],
    ["deferred", "b2", "shoroku t1 S-1"],
    ["resolved", "c1", null],
    ["resolved", "c2", "shoroku t2 S-5"],
    ["resolved", "c3", "shoroku t2 S-6"],
    ["resolved", "c4", "shoroku gone-topic S-1"],
  ];
  for (const [status, id, source] of issues) {
    write(root, `docs/issues/${status}/${id}-title.md`, issueText(source, id === "a2" ? "\r\n" : "\n"));
  }
  return { root, count: issues.length };
}

function run(args, cwd) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], { cwd, encoding: "utf8" });
  return { status: result.status, stdout: result.stdout.replace(/\r\n/g, "\n"), stderr: result.stderr };
}

test("parseSource reads each Source form and the S-n row", () => {
  assert.deepEqual(parseSource("inbox 2026-01-01-x"), { kind: "inbox", topic: null, row: null });
  assert.deepEqual(parseSource("session 2026-01-01"), { kind: "session", topic: null, row: null });
  assert.deepEqual(parseSource("hotfix fix the thing"), { kind: "hotfix", topic: null, row: null });
  assert.deepEqual(parseSource("shoroku t1"), { kind: "shoroku", topic: "t1", row: null });
  assert.deepEqual(parseSource("shoroku t1 S-12"), { kind: "shoroku", topic: "t1", row: 12 });
  assert.deepEqual(parseSource("something else"), { kind: null, topic: null, row: null });
});

test("findRow finds the row anywhere, under either heading, and splits on unescaped pipes only", () => {
  assert.equal(findRow(T1_LEDGER, 1)[1], "spec-review.md #1");
  assert.equal(findRow(T2_LEDGER, 1)[1], "batch-B-report.md #2");
  assert.equal(findRow(T2_LEDGER, 6)[1], "odd | pipe cell");
  assert.equal(findRow(T2_LEDGER, 99), null);
  assert.equal(findRow(T2_LEDGER, 10), null);
});

test("each Source form reaches its finder and topic", () => {
  const { root, count } = pileFixture();
  const tanto = path.join(root, ".tanto");
  const finder = (text) => finderOf(text, tanto);
  assert.deepEqual(finder(issueText("inbox 2026-01-01-x")), { topic: DASH, finder: "inbox" });
  assert.deepEqual(finder(issueText("session 2026-01-01", "\r\n")), { topic: DASH, finder: "session" });
  assert.deepEqual(finder(issueText("hotfix fix the thing")), { topic: DASH, finder: "hotfix" });
  assert.deepEqual(finder(issueText("shoroku t1")), { topic: "t1", finder: "shoroku (unnumbered)" });
  assert.deepEqual(finder(issueText("shoroku t1 S-1")), { topic: "t1", finder: "spec reviewer" });
  assert.deepEqual(finder(issueText(null)), { topic: DASH, finder: "no source" });
  const result = countByFinder({
    docs: path.join(root, "docs/issues"),
    tanto,
    statuses: ["open", "deferred", "resolved"],
  });
  assert.equal(result.total, count);
  assert.equal(result.perTopic[DASH].inbox, 1);
  assert.equal(result.perTopic[DASH]["no source"], 1);
  assert.equal(result.perTopic.t1["shoroku (unnumbered)"], 1);
  assert.equal(result.perTopic.t1["spec reviewer"], 1);
  assert.deepEqual(result.sourceKinds, { shoroku: 5, session: 1, inbox: 1, hotfix: 1, "no source": 1 });
  assert.equal(result.attributable.count, 4);
  assert.equal(result.attributable.unresolved, 1);
});

test("a ledger headed Shoroku candidates and one headed Shoroku proposal items both resolve", () => {
  const root = ledgerFixture();
  const tanto = path.join(root, ".tanto");
  assert.equal(finderOf(issueText("shoroku t1 S-2"), tanto).finder, "plan reviewer");
  assert.equal(finderOf(issueText("shoroku t2 S-1"), tanto).finder, "jisso");
});

test("a carried from row follows one hop to another topic or to the roster text, and only once", () => {
  const root = ledgerFixture();
  const tanto = path.join(root, ".tanto");
  assert.equal(finderOf(issueText("shoroku t2 S-2"), tanto).finder, "plan reviewer");
  assert.equal(finderOf(issueText("shoroku t2 S-4"), tanto).finder, "kikaku");
  // t2 S-3 carries from t1 S-5, which itself carries from t3 S-1: the second hop is not followed.
  assert.equal(finderOf(issueText("shoroku t2 S-3"), tanto).finder, "unmapped (carried from t3 S-1)");
  assert.equal(finderOf(issueText("shoroku t1 S-5"), tanto).finder, "jisso");
});

test("mapFinder gives every pattern's finder, the first match winning", () => {
  const cases = [
    ["batch-shusei-report.md", "close"],
    ["shoki brief", "close"],
    ["batch-B-report.md", "jisso"],
    ["shoroku-proposal-jisso-ab.md", "jisso"],
    ["shoroku-proposal.md", "jisso"],
    ["batch-C-verdict.md", "boundary"],
    ["branch-review.md", "branch reviewer"],
    ["spec-review.md", "spec reviewer"],
    ["plan-review.md", "plan reviewer"],
    ["coldread.md", "plan reviewer"],
    ["plan-dryrun.md", "plan reviewer"],
    ["shoroku-proposal-sekkei-ab.md", "sekkei"],
    ["exit-sekkei-proposal.md", "sekkei"],
    ["the spec §2", "sekkei"],
    ["spec § 3", "sekkei"],
    ["docs/superpowers/specs/x.md", "sekkei"],
    ["spec-draft.md", "sekkei"],
    ["shoroku-proposal-keikaku-ab.md", "keikaku"],
    ["exit-keikaku-proposal.md", "keikaku"],
    ["shoroku-proposal-kanri-ab.md", "kanri"],
    ["exit-kanri-x.md", "kanri"],
    ["Kanri's own observation", "kanri"],
    ["kanri-handover.md", "kanri"],
    ["kaiseki-report.md", "kaiseki"],
    [".tanto/kikaku/x.md", "kikaku"],
    ["Kikaku decision", "kikaku"],
    ["inbox 2026-01-01-x", "inbox"],
    ["human word", "human"],
  ];
  for (const [cell, expected] of cases) {
    assert.equal(mapFinder(cell), expected, cell);
  }
  assert.notEqual(mapFinder("batch-shusei-report.md"), "jisso");
  assert.equal(mapFinder("BATCH-b-REPORT.md"), "jisso");
});

test("an unmapped cell keeps its first 40 characters; a missing ledger or row is unresolved", () => {
  const root = ledgerFixture();
  const tanto = path.join(root, ".tanto");
  assert.equal(mapFinder("Destination words only"), "unmapped (Destination words only)");
  assert.equal(mapFinder("x".repeat(60)), `unmapped (${"x".repeat(40)})`);
  assert.equal(finderOf(issueText("shoroku t2 S-5"), tanto).finder, "unmapped (Destination words only)");
  assert.equal(finderOf(issueText("shoroku gone-topic S-1"), tanto).finder, "unresolved");
  assert.equal(finderOf(issueText("shoroku t1 S-99"), tanto).finder, "unresolved");
});

test("the grand total, the last line, and --json agree with the issue count; a pipe is escaped", () => {
  const { root, count } = pileFixture();
  const json = path.join(root, "out.json");
  const result = run(
    ["--docs", path.join(root, "docs/issues"), "--tanto", path.join(root, ".tanto"), "--json", json],
    root,
  );
  assert.equal(result.status, 0, result.stderr);
  const lines = result.stdout.trimEnd().split("\n");
  assert.equal(lines.at(-1), `issues counted: ${count}`);
  assert.match(result.stdout, /^## By finder — t1$/m);
  assert.match(result.stdout, /^## By finder — —$/m);
  assert.ok(result.stdout.indexOf("## By finder — t1") < result.stdout.indexOf("## By finder — —"));
  assert.match(result.stdout, /^\| Finder \| Issues \|$/m);
  assert.match(result.stdout, /^## Totals$/m);
  assert.match(result.stdout, /^## Source kinds$/m);
  assert.match(result.stdout, /^\| Total \| .* \| 9 \|$/m);
  assert.match(result.stdout, /unmapped \(odd \\\| pipe cell\)/);
  assert.match(
    result.stdout,
    /^Attributable: 4 of 9 issues \(44\.4%\) name an S-<n> ledger row and reach a finder through it; the by-finder table reads only the topics whose issues carry one\.$/m,
  );
  const parsed = JSON.parse(fs.readFileSync(json, "utf8"));
  assert.equal(parsed.total, count);
  assert.deepEqual(parsed.statuses, ["open", "deferred", "resolved"]);
  assert.deepEqual(parsed.attributable, { count: 4, total: 9, share: 4 / 9 });
  assert.equal(parsed.perTopic.t2["unmapped (odd | pipe cell)"], 1);
  assert.equal(parsed.totals.t2.unmapped, 2);
  assert.equal(parsed.sourceKinds.shoroku, 5);
});

test("--status narrows the count", () => {
  const { root } = pileFixture();
  const result = run(
    ["--docs", path.join(root, "docs/issues"), "--tanto", path.join(root, ".tanto"), "--status", "open"],
    root,
  );
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trimEnd().split("\n").at(-1), "issues counted: 3");
});

function expFixture() {
  const root = mkTmp();
  write(
    root,
    "docs/superpowers/specs/2026-01-01-t-design.md",
    "Cites exp-aaaa, exp-bbbb, exp-cccc and the issue id dddd.\nSee .tanto/kikaku/k.md for the direction.\n",
  );
  write(root, "docs/superpowers/plans/2026-01-01-t.md", "Cites exp-eeee.\n");
  write(root, ".tanto/t/dialogue.md", "The human said aaaa.\n");
  write(root, ".tanto/t/review-brief-spec.md", "Nothing cited.\n");
  write(root, ".tanto/kikaku/k.md", "A decision citing exp-bbbb.\n");
  return root;
}

test("--exp subtracts the inputs from the documents by bare id", () => {
  const root = expFixture();
  const result = expCount({ topic: "t", cwd: root });
  assert.deepEqual(result.documentIds, ["aaaa", "bbbb", "cccc", "eeee"]);
  assert.deepEqual(result.unprompted, ["cccc", "eeee"]);
  assert.ok(!result.documentIds.includes("dddd"));
  assert.deepEqual(result.skipped, [".tanto/t/review-brief-plan.md", ".tanto/t/spec-inputs.md"]);
  assert.ok(result.inputs.includes(".tanto/kikaku/k.md"));
  assert.ok(result.inputs.includes(".tanto/t/dialogue.md"));
  const cli = run(["--exp", "t", "--adr"], root);
  assert.equal(cli.status, 0, cli.stderr);
  const lines = cli.stdout.trimEnd().split("\n");
  assert.equal(lines.at(-1), "unprompted: 2");
  assert.ok(lines.includes("unprompted (2): exp-cccc exp-eeee"));
  assert.ok(lines.includes("documents ids (4): aaaa bbbb cccc eeee"));
  assert.ok(lines.some((line) => line.startsWith("skipped: ") && line.includes(".tanto/t/review-brief-plan.md")));
  assert.ok(lines.some((line) => line.startsWith("documents: ") && line.includes("2026-01-01-t-design.md")));
});

test("--docs replaces the default document list, --adr still adds, --inputs replaces the inputs", () => {
  const root = expFixture();
  write(root, "adr/one.md", "Cites exp-ffff.\n");
  write(root, "elsewhere.md", "Cites exp-1111.\n");
  write(root, "mine.md", "I said 1111 and ffff.\n");
  const result = expCount({
    topic: "t",
    docs: ["elsewhere.md"],
    inputs: ["mine.md"],
    adr: ["adr/one.md"],
    cwd: root,
  });
  assert.deepEqual(result.documents, ["elsewhere.md", "adr/one.md"]);
  assert.deepEqual(result.inputs, ["mine.md"]);
  assert.deepEqual(result.unprompted, []);
  assert.deepEqual(result.skipped, []);
  const cli = run(["--exp", "t", "--docs", "elsewhere.md", "--inputs", "--adr", "adr/one.md"], root);
  assert.equal(cli.status, 0, cli.stderr);
  assert.equal(cli.stdout.trimEnd().split("\n").at(-1), "unprompted: 2");
});

test("the exit codes: 0 on a completed run, 1 with one stderr line on a usage error", () => {
  const { root } = pileFixture();
  assert.equal(run(["--docs", path.join(root, "docs/issues"), "--tanto", path.join(root, ".tanto")], root).status, 0);
  assert.equal(run([], root).status, 0);
  const cases = [
    ["--docs", path.join(root, "no-such-dir")],
    ["--exp"],
    ["--exp", "--adr"],
    ["--bogus"],
    ["--tanto", path.join(root, "no-such-tanto")],
    ["--exp", "t", "--docs", path.join(root, "no-such.md")],
    ["--json", path.join(root, "no-such-json-dir", "out.json")],
  ];
  for (const args of cases) {
    const result = run(args, root);
    assert.equal(result.status, 1, args.join(" "));
    assert.equal(result.stdout, "", args.join(" "));
    assert.equal(result.stderr.trimEnd().split("\n").length, 1, args.join(" "));
  }
  assert.equal(
    fs.existsSync(path.join(root, "no-such-json-dir")),
    false,
    "--json into a missing directory writes nothing",
  );
});

test("main writes through the io it is given and returns the exit code", () => {
  const { root } = pileFixture();
  let out = "";
  let err = "";
  const io = { cwd: root, stdout: { write: (s) => (out += s) }, stderr: { write: (s) => (err += s) } };
  assert.equal(main([], io), 0);
  assert.match(out, /issues counted: 9\n$/);
  assert.equal(main(["--bogus"], io), 1);
  assert.match(err, /unknown option --bogus/);
});
