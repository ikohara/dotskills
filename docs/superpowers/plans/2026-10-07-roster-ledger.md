# roster-ledger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The roster is one row per seat, keyed by `sessionId`, and `boundary.js record` is its only writer: it validates every table against its template, escapes a `|` in a cell, refuses what does not fit with one line that names the repair, and takes `sessionId`s where it took names. The handover, the bootstrap, the archive move, and the direction's write-back are commands (`--succeeds`, `--init`, `archive`, `--direction` and `--written`); a Start reads `roster show`; the census gains **Returned** and loses the spawner's `renamed` mark and `ack` op; the launcher enters the Kanri the spawner holds.

**Architecture:** Batch A changes `boundary.js` and its tests in five tasks — the roster and archive templates with the schema check, the cell grammar, and the one-row-per-seat model (Task 1); the `sessionId` key and the readings (Task 2); the seat writers (Task 3); `S-n` and the direction (Task 4); `migrate` (Task 5) — and lands the run-time `boundary-brief.md` with the three `roles/kanri.md` paragraphs that key on its `record` call (Task 6). Batch B changes the census (Task 7), adds `roster show` (Task 8) and `archive` (Task 9) in `boundary.js`, removes the `ack` op and the `renamed` mark from `spawner.js` and `templates/spawn-request.md` and persists `request.branch` (Task 10), and gives `tanto.js` the shared cell grammar, the `held:` entry, and the state-file fallback (Task 11). Batch C, the plan's last batch and its safe boundary, writes the contract's text in seven tasks: `SKILL.md` in two, `roles/kanri.md` in three, the template `kanri-handover.md`, and the README with the plan-wide sweep.

**Tech Stack:** Node 22 or later with no dependencies (`node --test`), Markdown, and the tanto skill's `passage-check.js` for every block below.

**Spec:** `docs/superpowers/specs/2026-10-07-roster-ledger-design.md` — every task names the spec sections it carries out. The dialogue is `.tanto/roster-ledger/dialogue.md` (D-1 to D-5 the spec's, D-6 to D-8 this plan's); the reviews the spec already applies are `.tanto/roster-ledger/spec-check-kanri.md` and `.tanto/roster-ledger/spec-review.md`.

**Every old block was read at `2fe109a`**, `main`'s tip and the merge base. The branch's only commits since are the spec's, so every file under `skills/tanto/` is that commit's.

**`node --test` takes the test files, not the directory.** The spec writes `node --test skills/tanto/scripts/*.test.js`; on Node 24.16, the version installed here, a directory argument is read as one test file and fails at once. Every command below names `skills/tanto/scripts/*.test.js` or one test file.

**Reports and prompts follow the tanto templates.**

## Global Constraints

**This repository's rules (`AGENTS.md`), binding on every task:**

- Run `./scripts/lint.sh <the task's own changed paths>`, each path by its
  file name — never a directory — and fix every issue before committing.
  A hook that fixes a file fails the run with the fix left in the tree:
  re-run the same command, which then passes.
- Commit by explicit path, the message before the `--`:
  `git commit --only -m "<subject>" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- <paths>`.
  The index is shared with whatever else this checkout is doing. The
  trailer names the agent; a harness that supplies its own attribution
  line uses that line. A new file needs `git add -- <path>` first; Task 1
  creates `skills/tanto/templates/shoroku-direction.md`, the plan's one new
  file.
- Never `git add -A` / `.` / `-u`, a bare `git commit`, `git commit -a`,
  `--no-verify` or any other hook bypass; never amend a published commit;
  never push to `origin/main`. A task that seems to need one is a reason to
  stop and report, not to use it.
- Edit no `CLAUDE.md` or `AGENTS.md`, no repository-root Markdown, and no
  linter or formatter configuration. `skills/tanto/SKILL.md`, the seven
  `skills/tanto/roles/*.md`, and `skills/tanto/README.md` are agent
  instruction files under the same "Never do" rule; the approval for the
  passages this plan writes into them is the spec, accepted in
  `.tanto/roster-ledger/dialogue.md` ("all OK" and the five changes of the
  human's answer, D-5, after D-1 to D-4 section by section), and it covers
  exactly this plan's passages — no task extends an edit beyond its own
  blocks on the strength of it. Two sites the spec's section 7 does not
  list are in the plan on Keikaku's reading, filed as D-7 and D-8 for the
  human to override: `roles/kaiseki.md` and `templates/bug-report.md` (one
  line each, Task 13) and `templates/spawn-request.md` (Task 10, batch B).
- AGENTS.md asks for a review of a skill's sibling `README.md` after
  `SKILL.md` is edited; in this plan that review is Task 18's blocks and
  nothing more, so no task but Task 18 touches `skills/tanto/README.md`.
- Every commit lands on the branch `roster-ledger`. The merge into `main`
  is the human's, taken at the close; no task merges, rebases, or switches
  the branch.
- American English in every passage, comment, and commit message.

**Model families** (the built-in `skills/tanto/templates/tanto.json`; this
repository's `.claude/tanto.json` overrides Kikaku and Sekkei alone, and the
personal file sets `language` and `ceiling.kanri.batches` alone, read
2026-10-07 — a batch prompt names the family it dispatches with, read fresh
at its boundary): every task runs under a Jisso on `sonnet`, effort `xhigh`
(`sessions.jisso`); its `task.implement` subagent on `sonnet`, effort `high`;
an SDD fix round's escalation, rounds 4 and 5, on `opus`, effort `high`
(`task.escalate`); the spec and quality reviewers on `opus`, effort `medium`
(`task.review-spec`, `task.review-quality`); the boundary's verifier on
`sonnet`, effort `high` (`boundary.verify`).

**The shared-tree rule (contract rule 5).** A modification in the shared
checkout that a task or its own subagent did not make is not its to
discard: it is reported — the subagent tells its Jisso one line, the Jisso
tells Kanri one line — and is never run through `git checkout --` or
`git clean` on the task's own judgment. Only Kanri decides whether it is
stray.

**Node.** The tests run on Node 22 or later; this host has 24.16. A
boundary checks the version it ran on (How a batch is verified), and a task
that runs a test names no version of its own.

**Line endings.** Task 1 creates one Markdown file,
`skills/tanto/templates/shoroku-direction.md`; a created file lands `w/lf`
on this host every time, so its task writes `rm <path> && git checkout --
<path>` after the commit into its own steps. No other task creates or moves
a Markdown file. On this Windows host a file the Edit tool modifies keeps
the line endings it had, and `passage-check.js` normalizes CRLF before every
comparison.

**Running the suite and the boundary.** The whole suite takes nine minutes on
this host, which is longer than the Bash tool's ten-minute foreground
maximum once `boundary --plan` runs fence 2 and the fences after it. A step
that runs `node --test skills/tanto/scripts/*.test.js` or one test file of
it, and the boundary's `passage-check.js boundary --plan`, runs in the
background (`run_in_background: true`) with its output redirected to a file,
and its result is read from that file once the completion notice arrives:
the `# tests`, `# pass`, and `# fail` lines of the TAP stream, or the `pass`
and `fail` lines of `boundary`. A run cut at a timeout is no result, and is
never read as a failure or as a pass; it is run again in the background.
Only `boundary.test.js` and `reading.test.js`, which take ten to twenty
seconds, may run in the foreground; `tanto.test.js` takes two to three
minutes and `spawner.test.js` about eight, and run in the background too.

**No measurement task (spec, "What the plan must contain").** Every figure
the design rests on is in the spec's "Measured while designing". No task of
this plan measures anything.

**A batch reaches every workspace at its commit (spec section 9, "Six
workspaces read one skill directory").** The skill every workspace loads is
a link into this working tree: from batch A's first commit, `boundary.js`
on disk is the new one in `dotrepo`, `dotskills`, `ellmx`, `kuchidome`,
`mpm-playground-console`, and `s2-paper-picker` alike, and its `record` and
census refuse every roster whose header is not the template's until
`boundary.js migrate` runs there. The operating choice is the human's
(spec I-3): during this plan tanto is not run in another workspace — or, if
it is, that workspace is migrated when its first refusal names `migrate` —
and `dotskills` is not switched back to `main` until the merge. A task that
touches a script keeps its own test file green at its commit; the skill's
text of batch C is read by the next session started anywhere.

**Rule 11 — this plan edits the skill's own files.** While this plan is in
flight, the authority for its sessions is these Global Constraints, Kanri's
orders line, and the batch prompts — not `skills/tanto/`'s role text as it
stands on disk at any moment before the plan lands. Every Jisso of this
plan is spawned at the plan's landing with `queue=roster-ledger`, reading
nothing until its own `batch:` line reaches it, so that every one of them
read the skill as it stood before batch A.

**Batch C is the safe boundary** — the first point from which a role may be
started or replaced, and the plan's last batch: it lands `SKILL.md`,
`roles/kanri.md`, the template `kanri-handover.md`, the two one-line
sites of `roles/kaiseki.md` and `templates/bug-report.md`, and the README in
one batch, so that every file the plan touches agrees with every other; the
run-time template `boundary-brief.md` lands in batch A with the
`roles/kanri.md` paragraphs that key on it (rule 11), and `spawn-request.md`
with the spawner change that retires the op it documents in batch B. When the whole-branch review's findings touch
`SKILL.md`, a role file, or a template, the safe boundary is the fix wave's
landing instead. Until then no role is replaced and no further role is
created, except Kanri's own handover, whose successor takes this ruling and
Constraint 2 below from the handover file and runs the Handover case with
`--succeeds` once batch A has landed (by hand before), and a Kaiseki, which
is a Kanri ruling `R-n` made with the half-edited skill in view; between
batches B and C the handover template's `## Reading` still says
"Residency" and the successor reads the roster by `roster show` all the
same. Until the boundary the authority for the run's sessions is these
constraints, each seat's own prompt keys, and the batch prompts.

**The spec's five constraints, in substance (spec section 8):**

1. **The live roster is migrated the moment batch A's report lands.** The
   skill directory is a link into the tree, so from A's first commit the
   `boundary.js` on disk is the new one and every census Kanri runs on the
   unmigrated roster fails on the header. When A's `report:` line arrives —
   before any census, any `record`, and the `boundary.verify` dispatch —
   Kanri runs `boundary.js migrate` once over `.tanto/roster.md`,
   `.tanto/roster-archive.md`, and the open ledger, and reads what it
   prints; a `census: roster header is not the template's` line during
   batch A is the same signal and the same act. `record` refuses the old
   shape with the line that names `migrate`, so a forgotten run is caught at
   the first write. `migrate`'s `suspect:` and `unplaced:` lines are Kanri's
   to settle by hand then, once. Inside batch A, before the report lands,
   Kanri runs no census and writes no row: a line from a name no row holds
   waits for the boundary.
2. **Every `record` call carries `sessionId`s from A's boundary on** — the
   brief's and Kanri's own (loop step 6's `--status` lines and
   `--kanri-count` among them), with `<role> <sessionId> <reading>` peer
   lines resolved at receipt and the three-field `--s-item`. A's batch
   prompt's Kanri directive says so, and A's own text change to the three
   `roles/kanri.md` paragraphs (Task 6) lands with it; Kanri's own
   `sessionId` is its transcript basename, every other seat's is its row's,
   and `record` refuses a name with a line that says so.
3. **No role is started or replaced before batch C's landing**, except
   Kanri's own handover when due and a Kaiseki, as the safe-boundary
   paragraph above says. `migrate`'s `suspect:` and `unplaced:` lines are
   the one hand edit of the plan, at batch A, and the role's "you edit no
   table by hand" stands for every other moment.
4. **The archive move at this plan's close is `boundary.js archive`**, and
   the close's direction write-back is `--direction` and `--written`: the
   plan's own close is the first run of both, and their output is the
   close's acceptance check.
5. **A task that changes `record`'s refusal lines brings its tests with
   it**, and `node --test skills/tanto/scripts/*.test.js` is green at every
   task that touches a script.

**The four Jissos' rows come first.** At the plan's landing Kanri spawns
the four Jissos (batches A, B, C, and the fix wave) with `queue=roster-ledger`
and writes each one's roster row with the old shape's `record --seat`,
all four before it sends batch A's `batch:` line. After Task 1's commit
`record` refuses the old-shape roster until `migrate` runs at A's report,
and Constraint 1 forbids Kanri's writes inside A, so a row written later
cannot be written at all. Batch A's boundary brief then reads
`jisso=<that Jisso's sessionId, from its roster row>` (Task 6), and
`migrate` carries every row, the four `queued` Jissos' among them. Batch
A's prompt names this order in its Kanri directive.

**What a handover written during this plan carries.** Kanri's handover is
likely due inside this plan, and the role text a successor reads lags the
code until batch C lands (rule 11). The outgoing Kanri copies the paragraph
for its window into the handover file's Next step, whichever text its
successor will read:

- *Inside batch A, before its report lands* — Constraints 1 to 3 and the
  order of the four Jissos' rows above; that Kanri runs no census and writes
  no row until A's report, then runs `boundary.js migrate` once over the
  roster, the archive, and the open ledger; the batch-A dispatch keys of
  Task 6 (`jisso=`, `kanri-transcript=` from its own scratchpad path, the
  `<role> <sessionId> <reading>` peer lines resolved at receipt, the
  three-field `--s-item`); and that the successor's Start still reads the
  old step 3 ("the bootstrap: create it") and step 4 ("cold-read the
  roster"), which this window's authority overrides.
- *Between A and B* — the roster is migrated; `record --init`, `--seat`,
  `--succeeds`, `--roster-event`, `--rename`, and `--status` by
  `sessionId` exist and are used for every row and every roster Events
  line, and the Handover case's `--succeeds`; `roster show` and
  `archive` do not exist yet, so the successor reads the roster by a read
  of the one file; the census prints six headings until B, with the
  header line of Task 1.
- *Between B and C* — every command of the spec exists; the successor reads
  the roster by `boundary.js roster show`, runs the seven-heading census
  and acts on Returned, and uses `--succeeds` and `--init`; the role file
  it reads still says "cold-read the roster", "the bootstrap: create it", a
  by-hand Handover case, and the six headings, and the handover template
  still says "Residency" — the commands above are the authority until C.

 `skills/tanto/scripts/passage-check.js`,
`reading.js`, `usage.js`, and their three test files; `skills/tanto/roles/`
`sekkei.md`, `keikaku.md`, `jisso.md`, `kikaku.md`, and `hosa.md`; and the
templates other than `roster.md`, `roster-archive.md`, `kanri.md`,
`shoroku-direction.md`, `boundary-brief.md`, `kanri-handover.md`,
`spawn-request.md`, and `bug-report.md`. Every batch's boundary checks that
none of them changed.

**Named-mechanism rule.** A task that introduces or changes a named
mechanism — a `record` flag (`--seat`, `--init`, `--succeeds`, `--rename`,
`--roster-event`, `--suffix`, `--read-at`, `--kanri-count`, `--kanri-counts`,
`--s-item`, `--direction`, `--written`, `--only`, `--written-feedback`), a
subcommand (`migrate`, `roster show`, `archive`), a census heading (**Returned**),
a status word, a refusal line, the Name cell, a column, a section pointer
(`## Reading`) — lists in its own text every other site, in the same file and
in the files this plan touches, that names the same mechanism, so its
reviewer checks them together. Each task's "Named-mechanism sites" note is
this rule applied.

**The SDD ledger** is `.superpowers/sdd/2026-10-07-roster-ledger/progress.md`.

**The `replay-skip:` declarations.** `replay` already skips a fence whose
first word is `git` and every `passage-check.js verify`; the patterns below
are narrow on purpose, so that no fence of How a batch is verified matches
one and `boundary --plan` runs every check there:

```text
replay-skip: node --test skills/tanto/scripts/ — the scratch tree replay applies holds only the blobs of the paths this plan's passages touch, and a task's own test run needs the whole skill beside them
replay-skip: --test-name-pattern — a task's red or green run of named tests needs the whole skill, as above
replay-skip: rm skills/tanto/templates/shoroku-direction.md — a git restore of the one file Task 1 creates; the scratch tree carries no `.git`, and the rm would delete the file replay just applied
replay-skip: ./scripts/lint.sh skills/ — the scratch tree carries no `.git`, `.pre-commit-config.yaml`, or the `mise`/`uv` toolchain `lint.sh` needs
```

## Batches

| Batch | Tasks | Delivers | Stop conditions at this boundary |
| --- | --- | --- | --- |
| A | 1-6 | `boundary.js` and its tests, and the run-time template: the roster and archive templates (twenty and 21 columns, the Residency table gone), the new `shoroku-direction.md`, the template-derived header check, the `\|` escape and the Transcript, cwd, and newline checks, the one-row-per-seat model with the readings, `--status`, `--suffix`, Kanri's counts, and `--read-at` keyed by `sessionId`, and `seat`'s and `wake`'s sixth field (Tasks 1-2); `--seat` repeatable or by `sessionId`, `--init`, `--succeeds`, `--roster-event`, `--rename`, and `--ledger` required by the ledger's flags alone (Task 3); the three-field `--s-item`, the duplicate-number refusal, `--direction`, `--written`, and `--written-feedback` (Task 4); `boundary.js migrate` (Task 5); `templates/boundary-brief.md` and the three `roles/kanri.md` paragraphs that key on its `record` call (Task 6) | `node --version` is 22 or later; the whole suite `skills/tanto/scripts/*.test.js` green; `passage-check.js verify` clean for Tasks 1-6; `./scripts/lint.sh` clean on every changed path; every O-needle of Tasks 1-6 at 0 over its stated files; `passage-check.js diff` clean outside `docs/superpowers/`; none of the files no task touches changed — every one a fence of How a batch is verified; and Kanri's own act at this boundary, before any census or `record`: `boundary.js migrate` over the live roster, archive, and ledger (Constraint 1), whose printed rows and `suspect:` and `unplaced:` lines are read and settled |
| B | 7-11 | the census's seven headings, **Returned** with its two cases, and the `queued; its batch line wakes it` line (Task 7); `boundary.js roster show` (Task 8); `boundary.js archive` and the ten-subcommand usage line (Task 9); `spawner.js` without the `ack` op and the `renamed` mark, the seat's `branch` persisted, and the `ack` op out of `templates/spawn-request.md` (Task 10); `tanto.js` on the shared cell grammar, the `held:` entry, and the state-file fallback, with `boundary.js` exporting `cells` (Task 11) | everything batch A's row names, again; `passage-check.js verify` clean for Tasks 7-11; every O-needle of Tasks 1-11 at 0 over its stated files; fence 8 of How a batch is verified — the census prints its seven headings and `roster show` its first row and the live rows in under a second, against the live roster (the verifier runs it; its line is in the verdict) |
| C — the safe boundary, the plan's last batch | 12-18 | the contract's text: `SKILL.md` in two parts by heading (Tasks 12-13, with the two one-line roster-read sites of `roles/kaiseki.md` and `templates/bug-report.md` in Task 13); `roles/kanri.md` in three parts by heading (Tasks 14-16); `templates/kanri-handover.md` (Task 17); `README.md` and the plan-wide sweep (Task 18) | everything batches A and B name, again; `passage-check.js verify` clean for Tasks 12-18; **every O-needle of the whole plan at 0 over its stated files**; the whole-skill sweep of fence 5 at zero, over the scripts and their tests too; at the close, `boundary.js archive`, `record --direction`, and `record --written` are the first run of the new commands and their output is the close's acceptance check (Constraint 4) |

A stop condition worded as a property of the whole tree — "the suite is
green", "every O-needle … is 0", "no hit over `skills/tanto/`" — is backed
by a fence that sweeps the whole of that scope, not only the files the
batch wrote. The table's three batch rows plus one for the whole-branch
review's fix wave size Kanri's Jisso queue: **four** seats, spawned at the
plan's landing with `queue=roster-ledger`. Batch A carries six tasks and
batch C seven; Kanri may rotate its Jisso inside a batch at a task boundary.

**Batch A's boundary is the plan's one hand act.** Kanri runs `migrate` over
the live roster, archive, and ledger when A's report lands and before any
census or `record` (Constraint 1), and the verifier's own `record` call at
that boundary then writes the twenty-column rows.

## How a batch is verified

This plan ships Node scripts with their tests and Markdown (the contract,
`roles/kanri.md`, templates, and the README), and carries passages. Every
boundary runs the fenced checks below, in order, from the repository's top
level; `boundary --plan` judges each by its exit status alone, and a batch
is accepted only when every one exits 0. Each fence reads the state the
batch left — which batch has landed is read from whether the branch has
changed the one file only that batch changes: `templates/shoroku-direction.md`
for A, `scripts/spawner.js` for B, and `README.md` for C — so every one is
meaningful at every boundary. The per-task checks are the tasks' own:
`passage-check.js verify --task <N>` for every task the batch's row names,
run by the boundary as it runs every task's Verify step.

This plan writes no JSON file, and no frontmatter but what a task loads for
itself. `git` opens every fence but the first: `replay` skips a fence whose
first word is `git`, and each needs the checkout the scratch tree is not. The
dry run therefore exercised the first fence alone, and `boundary --plan` is
the first run of the others.

**1. The runtime.** Node 22 or later; the version is printed.

```bash
node -e 'const major = Number(process.versions.node.split(".")[0]); console.log(`node ${process.version}`); process.exit(major >= 22 ? 0 : 1)'
```

Expected: `node v24.16.0` on this host, exit 0.

**2. The whole suite.** Every test file of `skills/tanto/scripts/`, TAP
output, its `# pass` and `# fail` lines printed; any failure, or a run that
ends without a `# fail 0` line, exits 1. About nine minutes on this host.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
out="$(mktemp)"
node --test --test-reporter=tap skills/tanto/scripts/*.test.js >"$out" 2>&1
status=$?
grep -E '^# (tests|pass|fail) ' "$out"
grep -E '^not ok ' "$out"
fails="$(sed -n 's/^# fail //p' "$out")"
rm -f "$out"
[ "$status" -eq 0 ] && [ "$fails" = "0" ] || exit 1
```

Expected: `# fail 0`, and `# pass` equal to `# tests`.

**3. Lint, by name.** Every path the branch has changed under
`skills/tanto/`, each named.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
mapfile -t paths < <(git diff --name-only "$(git merge-base main HEAD)" -- skills/tanto)
[ "${#paths[@]}" -gt 0 ] || { echo "no changed path under skills/tanto/"; exit 1; }
./scripts/lint.sh "${paths[@]}"
```

Expected: every hook `Passed` or `Skipped`, no file changed.

**4. The old values.** Every O-needle of the plan whose block says it is at 0 afterwards, each over exactly the files where it was found at the merge base — and, for each file, from the batch whose boundary lands it: a needle gates on the batch of its own task when that task edits the file, and otherwise on the last batch that edits the file, so a hit left in a file a later batch rewrites is no failure at an earlier boundary. A needle with a stated residual (its block says it stays) is not listed here. A needle with a hit prints it and fails the check. The list is the plan's own O blocks, written by script at assembly; a needle's block is the authority for its reason.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
base="$(git merge-base main HEAD)"
landed=A
git diff --quiet "$base" -- skills/tanto/scripts/spawner.js || landed=B
git diff --quiet "$base" -- skills/tanto/README.md || landed=C
echo "old values after batch $landed"
residual=0
while IFS= read -r line; do
  [ -n "$line" ] || continue
  batch="${line%%@@*}"; rest="${line#*@@}"; needle="${rest%@@*}"; scope="${rest##*@@}"
  case "$landed$batch" in AA|BA|BB|CA|CB|CC) ;; *) continue ;; esac
  hits="$(git grep -F -c -e "$needle" -- $scope | awk -F: '{ s += $NF } END { print s + 0 }')"
  if [ "$hits" -ne 0 ]; then
    echo "residual $hits: $needle"
    git grep -F -n -e "$needle" -- $scope
    residual=1
  fi
done < <(sed -n '/^BEGIN-NEEDLES$/,/^END-NEEDLES$/p' docs/superpowers/plans/2026-10-07-roster-ledger.md | grep -v -e '^BEGIN-NEEDLES$' -e '^END-NEEDLES$')
[ "$residual" -eq 0 ] || exit 1
echo "every old value at 0"
```

Expected: `old values after batch <A, B, or C>`, then `every old value at 0`.

The needle list the fence reads, one row per file group, `<batch>@@<needle>@@<files>`. The fence reads it from this plan file so that its own text stays ASCII: a non-ASCII byte in a fence cut the command short under `boundary --plan` on this host (measured while assembling the plan).

```text
BEGIN-NEEDLES
A@@Residency@@skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js skills/tanto/templates/roster-archive.md skills/tanto/templates/roster.md
A@@Name [ref]@@skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js skills/tanto/templates/roster-archive.md skills/tanto/templates/roster.md
A@@Transcript is dropped@@skills/tanto/templates/roster-archive.md
A@@matched by the Name column@@skills/tanto/scripts/boundary.js
A@@RESIDENCY_HEADER@@skills/tanto/scripts/boundary.js
A@@writeResidency@@skills/tanto/scripts/boundary.js
A@@or unavailable>@@skills/tanto/templates/roster.md
A@@: "unavailable"),@@skills/tanto/scripts/boundary.js
A@@a name in ${file}@@skills/tanto/scripts/boundary.js
A@@no sessions table@@skills/tanto/scripts/boundary.js
A@@<model id>@@skills/tanto/templates/roster-archive.md skills/tanto/templates/roster.md
A@@rewrite the row's Name column@@skills/tanto/templates/roster.md
A@@as one row@@skills/tanto/templates/roster.md
A@@kanri-z [aaaaaa]@@skills/tanto/scripts/boundary.test.js
A@@an item |  | pending | t2 | no |@@skills/tanto/scripts/boundary.test.js
A@@live|cleared|stopped|queued@@skills/tanto/scripts/boundary.js
A@@live, cleared, stopped, or queued@@skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
A@@(?:\s+\[[^\]]+\])?@@skills/tanto/scripts/boundary.js
A@@the address, and the reading@@skills/tanto/scripts/boundary.js
A@@current[2] !== name@@skills/tanto/scripts/boundary.js
A@@note("--kanri-reading beside --kanri")@@skills/tanto/scripts/boundary.js
A@@seat prints its five words and the spawner: line@@skills/tanto/scripts/boundary.test.js
A@@if (!ledgerPath) return@@skills/tanto/scripts/boundary.js
A@@seatFile@@skills/tanto/scripts/boundary.js
A@@function writeSeatRow(doc, file, written)@@skills/tanto/scripts/boundary.js
A@@"status"];@@skills/tanto/scripts/boundary.js
A@@sectionSpan(doc.lines, "Session events");@@skills/tanto/scripts/boundary.js
A@@--seat on a file that is not there exits 2@@skills/tanto/scripts/boundary.test.js
A@@Stag[e]@@skills/tanto/scripts/boundary.js
A@@RETIRED_COLUMN@@skills/tanto/scripts/boundary.js
A@@"t2"@@skills/tanto/scripts/boundary.js
A@@sItemCells@@skills/tanto/scripts/boundary.js
A@@Destination: "",@@skills/tanto/scripts/boundary.js
A@@String(item).split("|")@@skills/tanto/scripts/boundary.js
A@@<role> <name> <reading>@@skills/tanto/roles/kanri.md skills/tanto/templates/boundary-brief.md
A@@--kanri "<name>"@@skills/tanto/templates/boundary-brief.md
A@@--jisso "<name>"@@skills/tanto/templates/boundary-brief.md
A@@--status "<name>@@skills/tanto/roles/kanri.md
A@@<source> | <item>"@@skills/tanto/roles/kanri.md skills/tanto/templates/boundary-brief.md
A@@each by its bare name@@skills/tanto/roles/kanri.md
A@@per line, the name bare@@skills/tanto/roles/kanri.md
A@@which under Next prompt@@skills/tanto/templates/boundary-brief.md
A@@from the roster's first data row>@@skills/tanto/roles/kanri.md skills/tanto/templates/boundary-brief.md
B@@CENSUS_HEADINGS = ["Listed", "Parked", "Ended", "Not listed"@@skills/tanto/scripts/boundary.js
B@@The six headings@@skills/tanto/scripts/boundary.js
B@@under six headings@@skills/tanto/scripts/boundary.js
B@@under its six headings@@skills/tanto/scripts/boundary.test.js
B@@if (sessionId) others.set(sessionId, status);@@skills/tanto/scripts/boundary.js
B@@"old-seat (background) — sess-old — row stopped"@@skills/tanto/scripts/boundary.test.js
B@@"jisso t jisso-f — sess-gone",@@skills/tanto/scripts/boundary.test.js
B@@["Parked", "Ended", "Not listed", "No session id", "Not held"]@@skills/tanto/scripts/boundary.test.js
B@@sessionIdOf(row[10])@@skills/tanto/scripts/boundary.js
B@@Seven subcommands@@skills/tanto/scripts/boundary.js
B@@Kanri runs the next four itself@@skills/tanto/scripts/boundary.js
B@@writes a document, and only@@skills/tanto/scripts/boundary.js
B@@check|record|census|request|seat|wake|beat <options>@@skills/tanto/scripts/boundary.js
B@@names the seven that exist@@skills/tanto/scripts/boundary.test.js
B@@check\|record\|census\|request\|seat\|wake\|beat/@@skills/tanto/scripts/boundary.test.js
B@@"ack"@@skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js
B@@// ack@@skills/tanto/scripts/spawner.js
B@@seat.renamed@@skills/tanto/scripts/spawner.js
B@@ack clears the renamed mark@@skills/tanto/scripts/spawner.test.js
B@@].renamed@@skills/tanto/scripts/spawner.test.js
B@@carried through into the result@@skills/tanto/scripts/spawner.js
B@@'s Branch column@@skills/tanto/scripts/spawner.js skills/tanto/templates/spawn-request.md
B@@.split("|")@@skills/tanto/scripts/tanto.js
B@@row.status.startsWith("cleared")@@skills/tanto/scripts/tanto.js
B@@row whose status is cleared@@skills/tanto/scripts/tanto.js
B@@as its eleven cells@@skills/tanto/scripts/tanto.js
B@@const held = row@@skills/tanto/scripts/tanto.js
B@@resumeLost(root, seats, byId, held);@@skills/tanto/scripts/tanto.js
B@@Name [ref]@@skills/tanto/scripts/tanto.test.js
B@@(kikaku, sekkei)@@skills/tanto/scripts/tanto.test.js
C@@Columns are Role, Topic,@@skills/tanto/SKILL.md
C@@— and then six@@skills/tanto/SKILL.md
C@@- **No session id** — a row whose@@skills/tanto/SKILL.md
C@@- **Not held** — a session under the root@@skills/tanto/SKILL.md
C@@ a Kanri that handed over;@@skills/tanto/SKILL.md
C@@gone and that is not parked@@skills/tanto/SKILL.md
C@@Kanri runs it before a @@skills/tanto/SKILL.md
C@@open ledger, in the roster@@skills/tanto/SKILL.md
C@@prints one line from the state file@@skills/tanto/SKILL.md
C@@one row per seat, written from the spawner@@skills/tanto/SKILL.md
C@@rows with their last readings, and the closed@@skills/tanto/SKILL.md
C@@the ops being @@skills/tanto/SKILL.md
C@@Nineteen of them@@skills/tanto/SKILL.md
C@@its seven subcommands are@@skills/tanto/SKILL.md
C@@line and the roster@@skills/tanto/SKILL.md
C@@Listed, Parked, Ended, Not listed@@skills/tanto/SKILL.md
C@@reads once —@@skills/tanto/SKILL.md
C@@the bootstrap: create it@@skills/tanto/roles/kanri.md
C@@cold-read the roster@@skills/tanto/roles/kanri.md
C@@rows: a row whose Status is@@skills/tanto/roles/kanri.md
C@@ row is left as it is, for@@skills/tanto/roles/kanri.md
C@@rewrite the roster@@skills/tanto/roles/kanri.md
C@@when the census does not list@@skills/tanto/roles/kanri.md
C@@Residency row@@skills/tanto/roles/kanri.md
C@@rewrite it in place with your name@@skills/tanto/roles/kanri.md
C@@before you write a @@skills/tanto/roles/kanri.md
C@@open ledger, in the roster@@skills/tanto/roles/kanri.md
C@@prints one line, @@skills/tanto/roles/kanri.md
C@@Residency table@@skills/tanto/roles/kanri.md
C@@inherits, Residency@@skills/tanto/roles/kanri.md
C@@reports to you and goes idle, so that@@skills/tanto/roles/kanri.md
C@@census's time, to the row's@@skills/tanto/roles/kanri.md
C@@at a later census whose Listed line for that seat does not carry@@skills/tanto/roles/kanri.md
C@@replaced, refused@@skills/tanto/roles/kanri.md
C@@bring the roster's Shoroku proposal items table@@skills/tanto/roles/kanri.md
C@@with their last readings and this plan's Events lines@@skills/tanto/roles/kanri.md
C@@outside a boundary you write the row yourself@@skills/tanto/roles/kanri.md
C@@in the roster's Events either way. You@@skills/tanto/roles/kanri.md
C@@your bare name, as a roster Events line. @@skills/tanto/roles/kanri.md
C@@rows in the ledger: Adopted from the answer.@@skills/tanto/roles/kanri.md
C@@the docs subject for an adopted row@@skills/tanto/roles/kanri.md
C@@ rows written — a row whose@@skills/tanto/roles/kanri.md
C@@; and fill the ledger's Measurements@@skills/tanto/roles/kanri.md
C@@line of the roster. A sweep@@skills/tanto/roles/kanri.md
C@@gets a roster Events line saying@@skills/tanto/roles/kanri.md
C@@Name [ref]@@skills/tanto/roles/kanri.md
C@@repository root, prints the roster's@@skills/tanto/roles/kanri.md
C@@then six headings@@skills/tanto/roles/kanri.md
C@@Listed, Parked, Ended, Not listed@@skills/tanto/roles/kanri.md
C@@Start step 1's read of your own name@@skills/tanto/roles/kanri.md
C@@, with an Events line naming what ended@@skills/tanto/roles/kanri.md
C@@prompt wakes it. Any other row is marked@@skills/tanto/roles/kanri.md
C@@rewrite the row's Name column with the@@skills/tanto/roles/kanri.md
C@@you write with the request,@@skills/tanto/roles/kanri.md
C@@write its row from that result file with@@skills/tanto/roles/kanri.md
C@@- **No session id** — nothing.@@skills/tanto/roles/kanri.md
C@@cold-read as if fresh@@skills/tanto/roles/kanri.md
C@@act on its six headings@@skills/tanto/roles/kanri.md
C@@with an Events line per row@@skills/tanto/roles/kanri.md
C@@Write the Events line@@skills/tanto/roles/kanri.md
C@@ with an Events line naming what showed its process gone@@skills/tanto/roles/kanri.md
C@@not final: its Events line names what@@skills/tanto/roles/kanri.md
C@@wake fails gets the Events line a seat@@skills/tanto/roles/kanri.md
C@@ with an Events line quoting the human@@skills/tanto/roles/kanri.md
C@@with an Events line naming the guard@@skills/tanto/roles/kanri.md
C@@is the seat lost: its Events line says@@skills/tanto/roles/kanri.md
C@@otherwise record in the roster's Events that@@skills/tanto/roles/kanri.md
C@@gets no answer and an Events@@skills/tanto/roles/kanri.md
C@@## Residency@@skills/tanto/templates/kanri-handover.md
C@@Kanri's Residency row in@@skills/tanto/templates/kanri-handover.md
C@@after its cold read@@skills/tanto/templates/kanri-handover.md
C@@ (the file a close sends the skill's@@skills/tanto/README.md
C@@rows idempotently;@@skills/tanto/README.md skills/tanto/SKILL.md
END-NEEDLES
```

**5. The whole-skill sweep.** Batch C's whole-skill sweep, which is Task 18's Step 5 in one fence: the spec's first six needles over `skills/tanto/` as a whole (every file), then the rest of the spec's list over the files it names. It waits for batch C: at A and B it prints that and exits 0, since the contract text the needles name is batch C's. The scripts and their tests are inside the sweep, not placed apart: every retired string `migrate` and the old-shape fixtures need is spelled in two parts.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
git diff --quiet "$(git merge-base main HEAD)" -- skills/tanto/README.md && { echo "sweep: waits for batch C"; exit 0; }
! grep -rn -F -e 'Residency' -e 'Name [ref]' -e 'Name `[ref]`' -e '"ack"' -e 'seat.renamed' -e '`ack`' -e '`acked`' -e 'rewrite the roster' -e 'cold-read the roster' -e 'after its cold read' -e 'cold-read as if fresh' skills/tanto/ || exit 1
! grep -n -F -e 'live|cleared' -e 'Stag[e]' -e 'RETIRED_COLUMN' -e '"t2"' -e 'matched by the Name column' -e 'writeResidency' skills/tanto/scripts/boundary.js || exit 1
! grep -n -F -e "reads once $(printf '\xe2\x80\x94')" -e 'Transcript is dropped' -e '<role> <name> <reading>' -e '--kanri "<name>"' -e '--jisso "<name>"' -e '--status "<name>' -e 'replaced, refused' -e 'when the census does not list' -e '<name [ref]>' -e '<kanri name>' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/templates/roster-archive.md skills/tanto/templates/boundary-brief.md || exit 1
echo "no stale term outside its dispositions"
```

Expected: `sweep: waits for batch C` at batches A and B; at batch C, `no stale term outside its dispositions`, exit 0.

**6. Files no task touches.** None of them changed since the branch left
`main`.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
git diff --quiet "$(git merge-base main HEAD)" -- skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js skills/tanto/scripts/reading.js skills/tanto/scripts/reading.test.js skills/tanto/scripts/usage.js skills/tanto/scripts/usage.test.js skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md skills/tanto/roles/jisso.md skills/tanto/roles/kikaku.md skills/tanto/roles/hosa.md skills/tanto/templates/agent.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/batch-report.md skills/tanto/templates/consult.md skills/tanto/templates/kaiseki-brief.md skills/tanto/templates/kaiseki-report.md skills/tanto/templates/kikaku-decision.md skills/tanto/templates/review-brief.md skills/tanto/templates/shoki-brief.md skills/tanto/templates/shoroku-brief.md skills/tanto/templates/shoroku-feedback.md skills/tanto/templates/tanto.json || { echo "a file no task touches changed"; exit 1; }
echo "untouched: the three instruments, five role files, and twelve template files"
```

Expected: the `untouched:` line, exit 0.

**7. The passages against the branch.** `passage-check.js diff` from the
merge base: every added line is text the plan quotes and every removed line
lies inside one of its fences. The spec and the plan under
`docs/superpowers/` are Sekkei's and Keikaku's commits, not a task's, so
their lines are filtered out; any other `unaccounted-added` or
`unexplained-removed` line fails the check.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"
out="$(node "$TANTO/scripts/passage-check.js" diff --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --base "$(git merge-base main HEAD)")"
status=$?
[ "$status" -le 1 ] || { printf '%s\n' "$out"; exit 1; }
left="$(printf '%s\n' "$out" | grep -E '^(unaccounted-added|unexplained-removed): ' | grep -v -E '^(unaccounted-added|unexplained-removed): docs/superpowers/')"
if [ -n "$left" ]; then
  printf '%s\n' "$left"
  exit 1
fi
echo "diff: clean outside docs/superpowers/"
```

Expected: `diff: clean outside docs/superpowers/`.

**8. The census and `roster show` against the live roster, from batch B.**
The verifier runs this fence with the rest of `boundary --plan`; its pass or
fail line is in the verdict. Before batch B has landed (`spawner.js` is
unchanged) it prints that it waits and exits 0. After, `boundary.js census`
must print the spawner line and the seven `## <heading>` lines, and
`boundary.js roster show` must exit 0 in under a second (spec,
"Verification" for batch B). A census that prints `census: unavailable` or a
roster whose header is not the template's fails the fence, which is the stop
a boundary needs.

```bash
git rev-parse --show-toplevel >/dev/null || exit 1
git diff --quiet "$(git merge-base main HEAD)" -- skills/tanto/scripts/spawner.js && { echo "census and roster show: wait for batch B"; exit 0; }
out="$(node skills/tanto/scripts/boundary.js census)" || { printf '%s\n' "$out"; exit 1; }
printf '%s\n' "$out" | head -n 1
for h in "Listed" "Parked" "Ended" "Returned" "Not listed" "No session id" "Not held"; do
  printf '%s\n' "$out" | grep -q -x "## $h" || { echo "missing heading: $h"; exit 1; }
done
start="$(date +%s%N)"
show="$(node skills/tanto/scripts/boundary.js roster show)" || { printf '%s\n' "$show"; exit 1; }
end="$(date +%s%N)"
printf '%s\n' "$show" | head -n 1
ms=$(( (end - start) / 1000000 ))
echo "roster show: $ms ms"
[ "$ms" -lt 1000 ] || exit 1
```

Expected: `census and roster show: wait for batch B` before B; after, the
spawner line, the `first:` line of `roster show`, and `roster show: <n> ms`
with `n` under 1000, exit 0.

## Tasks

### Task 1: One table per roster, the schema from the template

Spec 1.1, 1.2, and 1.3; 2.1; 2.2; 2.3's readings by `sessionId` with
`--read-at`; 2.4's twenty-cell row that a rewrite keeps; 2.6's template;
section 3's census header line; and section 7's entries for
`templates/roster.md`, `roster-archive.md`, `kanri.md`, and
`shoroku-direction.md`. The roster keeps one table of twenty columns, the
nine reading columns joined to the seat's row and the Residency section
gone; the archive's table is those twenty and Ended; `templates/kanri.md`'s
`S-n` prose names the three-field `--s-item` and the duplicate-number
refusal; and `templates/shoroku-direction.md` is new. In `boundary.js`,
`record` compares every table it is about to touch with the same table in
the skill's own template, located as `path.join(__dirname, "..",
"templates")`, and on a mismatch writes nothing and prints the one line
that names `boundary.js migrate`; `cells()` and `row()` carry the `\|`
escape; a value with a newline, a Transcript cell whose basename is not
`<uuid>.jsonl`, a seat with no `sessionId`, and a cwd with a control
character are refused; `writeResidency` and `RESIDENCY_HEADER` are gone and
a reading lands in the nine reading columns of the row its `sessionId`
finds, its Read at `batch <X>` or the `--read-at` label; `--seat` writes
the twenty-cell row by `sessionId` and a rewrite keeps the reading, the
Name cell, and every cell the result lacks — so a bare `<sessionId>.jsonl`
Transcript cell, legitimate for a seat whose result or state entry carries
no `transcript` (spec 2.2), stays while the seat carries none and is
replaced by the path once one carries it, and a path once written stays
when a later result carries `transcript: null`; and the census on a roster
whose header is not the template's prints
`census: roster header is not the template's — run boundary.js migrate`
and exits 1. Every old test that asserted the two-table shape is rewritten
here, so the suite is green at this task's commit.

The readings' key and `--read-at`, which the cut gives Task 2, and the
`--seat` rewrite that keeps what the result lacks, which it gives Task 3,
are this task's: removing `writeResidency` rewrites the reading writer and
its callers, and a twenty-cell row rewritten whole would erase its own
reading, so no later task has a base line left to re-key either.
`sItemCells`'s fixed map, `RETIRED_COLUMN`, and `"t2"` go in Task 4, which
owns `writeSItem`'s lines; the header check here already refuses the
seven-column table they served. After this task, `record` writes nothing
into a table the template does not name, and a reading or a seat row is
found by its `sessionId`.

**Files:**

- Modify: `skills/tanto/scripts/boundary.js` — `SESSIONS_HEADER` and
  `RESIDENCY_HEADER` replaced by `TEMPLATES`, `headerAt`, `templateHeader`,
  `SESSIONS_HEADER` read from the template, and `headerMismatch`; `cells`
  and `row`; `writeResidency` replaced by `seatRowAt` and `writeReading`;
  `writeSeatRow`'s comment and body below its result-file read, with
  `TRANSCRIPT_BASENAME`, `transcriptProblem`, `cwdProblem`, and
  `SEAT_FIELDS` above it; `cmdRecord`'s `today`, its newline and header
  checks, its comment on the unavailable reading, its readings' Read at,
  and its three reading calls; `cmdCensus`'s table lookup.
- Modify: `skills/tanto/templates/roster.md` — the Keeping rule's first,
  third, and fourth bullets and a new second, the table, the Topic
  paragraph, the Residency section; `skills/tanto/templates/roster-archive.md`
  — its prose and its Sessions table; `skills/tanto/templates/kanri.md` —
  a paragraph after the `S-n` reference paragraph.
- Create: `skills/tanto/templates/shoroku-direction.md`.
- Test: `skills/tanto/scripts/boundary.test.js` — `ledgerAndRoster` and
  its helpers, `recordArgs`, the Measurements, reading, peer, unavailable,
  heading, `--seat`, and `S-n` tests, `SEAT`, `SESSIONS_HEAD`, and
  `sessionRow`; new tests for the header refusal, the escape, the newline,
  `--read-at`, the cwd escape, the seat refusals, and the census line.
  `skills/tanto/scripts/spawner.test.js` — "a spawn's startedAt reaches the
  roster's Started cell in the same shape", whose spawn now carries a
  `sessionId` the Transcript check accepts.

**Interfaces:**

- Consumes: nothing an earlier task writes.
- Produces: `TEMPLATES`; `headerAt(lines, heading)` (a null heading finds
  the seats table, the first whose header begins `| Role |`);
  `templateHeader(template, heading)`; `headerMismatch(file, template,
  heading)`, which returns the refusal line or null and null for an absent
  file — Tasks 3, 4, and 5 call it, and Tasks 7 to 9 may; `SESSIONS_HEADER`,
  now the template's whole header; `seatRowAt(doc, sessionId)`, the one
  row finder every roster writer of Tasks 2 and 3 uses;
  `writeReading(doc, sessionId, reading, readAt, written)`;
  `transcriptProblem(cell)` and `cwdProblem(cell)`, which Task 5's `migrate`
  calls; `cells()` and `row()` with the escape, `cells` still a top-level
  function declaration for Task 11's export. In `cmdRecord`, the names
  `readings` and `readAt`, and the header check's reads of `wantsBatchRow`,
  `ledgerPath`, `kanriReading`, `jissoReading`, `needRoster`, and
  `rosterPath`, which Tasks 2 and 3 keep defined. In the tests,
  `KANRI_ID`, `JISSO_ID`, `KEIKAKU_ID`, `OLD_NAME`, `seatRow`, `addSeat`,
  and the seeded `ledgerAndRoster`, and the twenty-column `SESSIONS_HEAD`
  and `sessionRow` the census tests of Task 7 build on.

**Named-mechanism sites** (`git grep` at the base).

- The roster's twenty columns, the Residency table gone, and the archive's
  shape: `SKILL.md` "The roster" ("Columns are …", the Name cell, the
  archive's shape) (Task 12), its Artifacts rows for the roster, the
  archive, and the templates — twenty with `shoroku-direction.md` — and
  rule 11's "templates a session reads once" (Task 13);
  `roles/kanri.md` Start step 3's "Residency row" (Task 14), loop step 4,
  "The trigger", "The residency line", "The handover file", the Replace
  table, and "Readings" (Task 15); `templates/kanri-handover.md`'s
  `## Residency` (Task 17); the README's "Moving a run" (Task 18).
- The header check and the census line: `cmdCensus` beyond its table
  lookup is Task 7's, which keeps the line this task prints; Task 8's
  `roster show` and Task 9's `archive` end with the same `migrate` line.
- `templates/bug-report.md`'s second paragraph reads the intake's name from
  "the `Name [ref]` column" of another workspace's roster — the read
  `SKILL.md` "Messages" (Task 13) and `roles/kanri.md` "Reporting from the
  other side" (Task 16) make, and a hit of the spec's second needle, which
  Task 18 sweeps across `skills/tanto/` — but no task of the cut names the
  file; Keikaku places it.
- The `\|` escape: `tanto.js`'s `firstRosterRow`, `rosterRows`, and
  `oldShapeLine`, which split on `|` themselves, and `tanto.test.js`'s
  eleven-column `ROSTER_HEAD` (Task 11).
- The reading key and `--read-at`: `templates/boundary-brief.md`'s `record`
  call and `roles/kanri.md`'s dispatch block, readings line, and loop step
  6 (Task 6); "Readings"' "write the row yourself" (Task 15).
- In `boundary.js`, the lines of `writeSeatRow` that read the result file
  are Task 3's, `writeStatus` Task 2's, `sItemCells` and `writeSItem` Task
  4's; in `boundary.test.js`, the `--status` test is Task 2's and the
  missing-file `--seat` test Task 3's. `spawner.test.js` is Task 10's file
  beyond the one test this task edits.

**O1.39** `Residency` — the table and every name for it in the files this task touches (spec 1.1; the Old values' first needle); before: 2 in `skills/tanto/templates/roster.md`, 2 in `skills/tanto/templates/roster-archive.md`, 8 in `skills/tanto/scripts/boundary.js`, 5 in `skills/tanto/scripts/boundary.test.js`; after: 0 in all four. The case-folded rest of `boundary.js` (`RESIDENCY_HEADER`, `residencyRows`) goes too (O1.43). Its 9 in `skills/tanto/roles/kanri.md` are Tasks 14 and 15's, and its 2 in `skills/tanto/templates/kanri-handover.md` Task 17's.

**O1.40** `Name [ref]` — the header cell (spec 1.1); before: 2 in `skills/tanto/templates/roster.md`, 1 in `skills/tanto/templates/roster-archive.md`, 3 in `skills/tanto/scripts/boundary.js`, 1 in `skills/tanto/scripts/boundary.test.js`; after: 0 in all four, the tests spelling the old cell as `OLD_NAME`. Its 1 in `skills/tanto/SKILL.md` ("Messages") is Task 13's, its 1 in `skills/tanto/roles/kanri.md` ("Reporting from the other side") Task 16's, and its 1 in `skills/tanto/scripts/tanto.test.js` (`ROSTER_HEAD`) Task 11's; its 1 in `skills/tanto/templates/bug-report.md` no task of the cut names (see Named-mechanism sites).

**O1.41** `Transcript is dropped` — the archive's dropped-columns paragraph (spec 1.2); before: 1 in `skills/tanto/templates/roster-archive.md`, after: 0.

**O1.42** `matched by the Name column` — `writeSeatRow`'s comment (spec 2.4); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O1.43** `RESIDENCY_HEADER` — the second table's header constant (spec 2.1); before: 2 in `skills/tanto/scripts/boundary.js`, after: 0.

**O1.44** `writeResidency` — the Residency writer (spec 1.1); before: 4 in `skills/tanto/scripts/boundary.js`, after: 0.

**O1.45** `or unavailable>` — `unavailable` as a Transcript cell in the template (spec 2.2); before: 2 in `skills/tanto/templates/roster.md`, after: 0.

**O1.46** `: "unavailable"),` — `unavailable` as a Transcript cell `--seat` writes (spec 2.2); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O1.47** `a name in ${file}` — `--seat`'s refusal of a result with no name, which a `sessionId` refusal replaces (spec 2.2); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O1.48** `no sessions table` — the census's line on a roster it cannot read (spec 3); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O1.49** `<model id>` — the Model cell's placeholder (spec 2.4, 20de); before: 2 in `skills/tanto/templates/roster.md`, 1 in `skills/tanto/templates/roster-archive.md`, after: 0.

**O1.50** `rewrite the row's Name column` — the rename by hand (spec 2.4); before: 1 in `skills/tanto/templates/roster.md`, after: 0. Its 1 in `skills/tanto/roles/kanri.md` ("Session lifecycle", the `renamed` act) is Task 16's.

**O1.51** `as one row` — the archive move's join of a row and its Residency row (spec 1.2); before: 1 in `skills/tanto/templates/roster.md`, after: 0.

**O1.52** `kanri-z [aaaaaa]` — the readings keyed by a name in the tests (spec 2.3); before: 7 in `skills/tanto/scripts/boundary.test.js`, after: 0.

**O1.53** `an item |  | pending | t2 | no |` — the seven-column `S-n` row the tests expected written (spec 2.1); before: 1 in `skills/tanto/scripts/boundary.test.js`, after: 0.

**A1.54** `skills/tanto/scripts/boundary.js` — `grep -c "^function headerMismatch(" skills/tanto/scripts/boundary.js` — before: 0, after: 1

**A1.55** `skills/tanto/templates/kanri.md` — `grep -c -- '--s-item "<source> | <destination> | <item>"' skills/tanto/templates/kanri.md` — before: 0, after: 1

- [ ] **Step 1: Write the failing tests**

Apply P1.22 to P1.38. P1.22 seeds the copied roster's two placeholder
rows as Kanri's and a Jisso's, each with a `sessionId`; P1.23 to P1.26 key
the readings by those; P1.27 to P1.32 bring the reading tests to the
twenty-cell row; P1.33 adds the header, escape, newline, and `--read-at`
tests; P1.34 and P1.35 give `SEAT` a `sessionId` the Transcript check
accepts and bring the `--seat` tests to the new row and its refusals;
P1.36 refuses the seven-column `S-n` table; P1.37 gives the census
fixture the template's header and adds the census refusal; P1.38 gives the
spawner test's spawn a `sessionId` of the same shape, so that it still
passes once Step 4 lands.

**P1.22** `skills/tanto/scripts/boundary.test.js` — replace exactly these 10 lines

```js
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
```

**P1.22 →**

```js
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
```

**P1.23** `skills/tanto/scripts/boundary.test.js` — replace exactly these 8 lines

```js
    "--kanri",
    "kanri-z [aaaaaa]",
    "--kanri-reading",
    KANRI_READING,
    "--jisso",
    "jisso-z [bbbbbb]",
    "--jisso-reading",
    JISSO_READING,
```

**P1.23 →**

```js
    "--kanri",
    KANRI_ID,
    "--kanri-reading",
    KANRI_READING,
    "--jisso",
    JISSO_ID,
    "--jisso-reading",
    JISSO_READING,
```

**P1.24** `skills/tanto/scripts/boundary.test.js` — replace exactly this 1 line

```js
    "kanri-y [cccccc]",
```

**P1.24 →**

```js
    KANRI_ID,
```

**P1.25** `skills/tanto/scripts/boundary.test.js` — replace exactly this 1 line

```js
    "jisso-y [dddddd]",
```

**P1.25 →**

```js
    JISSO_ID,
```

**P1.26** `skills/tanto/scripts/boundary.test.js` — replace exactly these 5 lines

```js
    "kanri-z [aaaaaa]",
    "--kanri-reading",
    "transcript: 9 B, 9 records, 9 wake-ups, 0 compactions, context=99 ttl=5m",
    "--jisso",
    "jisso-z [bbbbbb]",
```

**P1.26 →**

```js
    KANRI_ID,
    "--kanri-reading",
    "transcript: 9 B, 9 records, 9 wake-ups, 0 compactions, context=99 ttl=5m",
    "--jisso",
    JISSO_ID,
```

**P1.27** `skills/tanto/scripts/boundary.test.js` — replace exactly these 47 lines

```js
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
    .replace("| kanri | — | <name> |", "| keikaku | tanto-diet | keikaku-a [ccdd11] |");
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
```

**P1.27 →**

```js
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
```

**P1.28** `skills/tanto/scripts/boundary.test.js` — replace exactly this 1 line

```js
test("an unavailable Jisso reading still writes the Batches row and the Kanri Residency row", () => {
```

**P1.28 →**

```js
test("an unavailable Jisso reading still writes the Batches row and Kanri's reading", () => {
```

**P1.29** `skills/tanto/scripts/boundary.test.js` — replace exactly these 11 lines

```js
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
```

**P1.29 →**

```js
  // The unavailable side's own reading is still written, `—` in the four
  // figure columns and `context=unavailable` rather than a refusal.
  assert.ok(roster.includes(`${JISSO_ID}.jsonl | batch Z | — | — | — | — | context=unavailable |`), roster);
  // The available side's own reading lands normally, unaffected.
  assert.ok(roster.includes(`${KANRI_ID}.jsonl | batch Z | 1 | 2 | 3 | 0 | context=4 |`), roster);
```

**P1.30** `skills/tanto/scripts/boundary.test.js` — replace exactly these 2 lines

```js
test("both readings unavailable, and an unavailable peer reading, still write —/context=unavailable rows and report both skips", () => {
  const fixture = ledgerAndRoster();
```

**P1.30 →**

```js
test("both readings unavailable, and an unavailable peer reading, still write —/context=unavailable rows and report both skips", () => {
  const fixture = ledgerAndRoster();
  addSeat(fixture, seatRow("keikaku", "keikaku-a", KEIKAKU_ID));
```

**P1.31** `skills/tanto/scripts/boundary.test.js` — replace exactly these 9 lines

```js
    "kanri-z [aaaaaa]",
    "--kanri-reading",
    unavailable,
    "--jisso",
    "jisso-z [bbbbbb]",
    "--jisso-reading",
    unavailable,
    "--peer-reading",
    `keikaku keikaku-a [ccdd11] ${unavailable}`,
```

**P1.31 →**

```js
    KANRI_ID,
    "--kanri-reading",
    unavailable,
    "--jisso",
    JISSO_ID,
    "--jisso-reading",
    unavailable,
    "--peer-reading",
    `keikaku ${KEIKAKU_ID} ${unavailable}`,
```

**P1.32** `skills/tanto/scripts/boundary.test.js` — replace exactly these 17 lines

```js
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
```

**P1.32 →**

```js
  // Kanri's and Jisso's own readings both land unavailable...
  for (const id of [KANRI_ID, JISSO_ID]) {
    assert.ok(roster.includes(`${id}.jsonl | batch Z | — | — | — | — | context=unavailable |`), roster);
  }
  // ...and a `--peer-reading` that arrives unavailable survives the PEER
  // regex's own parse first and still writes the same cells.
  assert.ok(roster.includes(`${KEIKAKU_ID}.jsonl | batch Z | — | — | — | — | context=unavailable |`), roster);
```

**P1.33** `skills/tanto/scripts/boundary.test.js` — replace exactly these 10 lines

```js
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
```

**P1.33 →**

```js
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
```

**P1.34** `skills/tanto/scripts/boundary.test.js` — replace exactly these 2 lines

```js
  transcript: "/tmp/seat-one.jsonl",
  sessionId: "sess-one",
```

**P1.34 →**

```js
  transcript: "/tmp/5e5e5e5e-0000-4000-8000-000000000001.jsonl",
  sessionId: "5e5e5e5e-0000-4000-8000-000000000001",
```

**P1.35** `skills/tanto/scripts/boundary.test.js` — replace exactly these 34 lines

```js
test("--seat writes a seat's roster row from its result file, and a second call rewrites it", () => {
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
```

**P1.35 →**

```js
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
```

**P1.36** `skills/tanto/scripts/boundary.test.js` — replace exactly these 16 lines

```js
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
```

**P1.36 →**

```js
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
```

**P1.37** `skills/tanto/scripts/boundary.test.js` — replace exactly these 8 lines

```js
const SESSIONS_HEAD = [
  "| Role | Topic | Name [ref] | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
];

function sessionRow(role, topic, name, status, transcript) {
  return `| ${role} | ${topic} | ${name} | /repo | sonnet | high | main | auto | 2026-09-23 10:00 | ${status} | ${transcript} |`;
}
```

**P1.37 →**

```js
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
```

**P1.38** `skills/tanto/scripts/spawner.test.js` — replace exactly these 3 lines

```js
test("a spawn's startedAt reaches the roster's Started cell in the same shape", () => {
  const ws = workspace();
  const { id } = request(ws, SPAWN);
```

**P1.38 →**

```js
test("a spawn's startedAt reaches the roster's Started cell in the same shape", () => {
  const ws = workspace();
  // `record --seat` writes a Transcript cell whose basename is a uuid alone.
  setState(ws, { next: { sessionId: "6f6f6f6f-0000-4000-8000-000000000001" } });
  const { id } = request(ws, SPAWN);
```

- [ ] **Step 2: Run the boundary tests to verify they fail**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: FAIL — the rewritten reading, peer, and unavailable-reading
tests (no row carries the reading's `sessionId` in the Residency shape),
the new header, escape, newline, and `--read-at` tests, the three `--seat`
tests, the `S-n` test, and every census test, whose fixture now carries
the template's twenty-column header, which today's `SESSIONS_HEADER` does
not find (exit 2). The other tests pass.

- [ ] **Step 3: Bring the templates to one table, and add the direction template**

Apply P1.14 to P1.20, and write W1.21.

**P1.14** `skills/tanto/templates/roster.md` — replace exactly these 8 lines

```markdown
- One row per seat, Kanri's own row first. Every row is written from the
  spawner's result file, by `boundary.js record --seat <results path>`:
  Kanri writes it for a seat it requested when the result lands, and for a
  seat the launcher started — a Kikaku, a Hosa — when its census prints
  that seat under Not held with
  `— spawned as <role> <topic>, result <id>`. A standalone Kaiseki and a
  messenger get no row. A row that does not exist yet while its seat is
  already working is not an error: nothing is sent to a seat by its row.
```

**P1.14 →**

```markdown
- One row per seat, Kanri's own row first, found by its `sessionId` — its
  Transcript cell's basename without `.jsonl` — and by nothing else. Every
  row is written from the spawner's result file, by
  `boundary.js record --seat <results path or sessionId>`: Kanri writes it
  for a seat it requested when the result lands, and for a seat the
  launcher started — a Kikaku, a Hosa — when its census prints that seat
  under Not held with `— spawned as <role> <topic>, result <id>`. Kanri's
  own row is written by `record --init` at its bootstrap and by
  `record --succeeds <sessionId>` at a handover. A standalone Kaiseki and a
  messenger get no row. A row that does not exist yet while its seat is
  already working is not an error: nothing is sent to a seat by its row.
- `boundary.js record` is this file's one writer, and no cell and no Events
  line is edited by hand: a status by `--status "<sessionId> <word>"`, a
  `live` cell's suffix by `--suffix`, a Name cell by `--rename`, an Events
  line by `--roster-event`, and a reading by the reading flags with
  `--batch` or `--read-at`. Every call compares the header of each table
  it touches with this template's and writes nothing when they differ,
  naming `boundary.js migrate`, which brings an older roster to this shape
  once. `boundary.js roster show` prints what a Start reads, and
  `boundary.js archive` moves the ended rows at a plan close.
```

**P1.15** `skills/tanto/templates/roster.md` — replace exactly these 8 lines

```markdown
- A seat the census prints with the suffix `— renamed` — a known
  `sessionId` whose listed name is not the row's Name cell — is Kanri's to
  reconcile: rewrite the row's Name column and write the Events line
  `resumed: <old name> → <new name>`; nothing else is asked of it, and the
  suffix goes at the next census. A seat open in a VS Code tab carries the
  editor's name, and a new one after every window reload; Kanri's census finds its
  `sessionId` under that name and rewrites the cell the same way, and
  nothing is typed in the tab.
```

**P1.15 →**

```markdown
- A seat the census prints with the suffix `— renamed` — a known
  `sessionId` whose listed name is not the row's Name cell — is Kanri's to
  reconcile with `record --rename "<sessionId> <new name>"`, which rewrites
  the Name cell and writes the Events line
  `resumed: <old name> → <new name>` itself; nothing else is asked of it,
  and the suffix goes at the next census. A seat open in a VS Code tab
  carries the editor's name, and a new one after every window reload;
  Kanri's census finds its `sessionId` under that name and rewrites the
  cell the same way, and nothing is typed in the tab.
```

**P1.16** `skills/tanto/templates/roster.md` — replace exactly these 4 lines

```markdown
  disk goes `live` again when a line due to it resumes it. A stopped, dead,
  or replaced row stays, with its Residency row, until the plan closes, then
  both move to `roster-archive.md` as one row, so the run stays readable
  after a replacement and the roster stays short.
```

**P1.16 →**

```markdown
  disk goes `live` again when a line due to it resumes it. A stopped, dead,
  or replaced row stays until the plan closes, when `boundary.js archive`
  moves it, whole, to `roster-archive.md`, so the run stays readable after
  a replacement and the roster stays short.
```

**P1.17** `skills/tanto/templates/roster.md` — replace exactly these 10 lines

```markdown
| Role | Topic | Name [ref] | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> | <absolute path> | <model id> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path, <sessionId>.jsonl, or unavailable> |
| <role> | <topic> | <name> | <absolute path> | <model id> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path, <sessionId>.jsonl, or unavailable> |

Topic is the topic the seat's spawn request named, as its result file
carries it — for a Jisso, the topic whose queue it was spawned into: the
plan whose batches are in flight, or, with none in flight, the plan whose
landing requested the queue — or `—` for Kanri, Kikaku, and Hosa. Effort
is the spawn's, as the result file records it.
```

**P1.17 →**

```markdown
| Role | Topic | Name | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> | <absolute path> | <family, as the spawn request named it> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path or <sessionId>.jsonl> | <batch <X>, start, handover, or plan close> | <n> | <n> | <n> | <n> | context=<n> | <n> | <m> | <k> |
| <role> | <topic> | <name> | <absolute path> | <family, as the spawn request named it> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path or <sessionId>.jsonl> | <batch <X>> | <n> | <n> | <n> | <n> | context=<n> | — | — | — |

Topic is the topic the seat's spawn request named, as its result file
carries it — for a Jisso, the topic whose queue it was spawned into: the
plan whose batches are in flight, or, with none in flight, the plan whose
landing requested the queue — or `—` for Kanri, Kikaku, and Hosa. Model is
the family the spawn request named, as the result file carries it: the full
model id is known to the seat alone. Effort is the spawn's, as the result
file records it.
```

**P1.18** `skills/tanto/templates/roster.md` — replace exactly these 30 lines

```markdown
## Residency

| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | context=<n> | <n> | <m> | <k> |
| <role> | <topic> | <name> | <YYYY-MM-DD> | <boundary> | <n> | <n> | <n> | <n> | context=<n> | — | — | — |

One row per session of the current run, live or not, Kanri's first, rewritten
in place by Kanri at every boundary and plan close from the readings the
sessions send (`SKILL.md`, "The transcript reading"): a role's row from its
latest boundary or exit line, Kanri's own from the reading it takes at the
trigger check. Context holds the reading's fifth figure in the spelling the
reading itself prints, `context=<n>`, so that a sweep for that spelling finds
every place a reading lands. Kikaku sends no reading and its reading columns
stay blank: it is the human's own seat, and its cost is the human's own
pacing. A `queued` row's stay blank until its boundary, and one that never
ran moves to the archive as `stopped`, with its blanks. The last three columns
are Kanri's only — batches accepted,
plans closed, and compactions noticed by the session itself, cumulative since
its own start; a declined handover leaves Noticed incremented, so the count
stays a record, and a handover resets Kanri's row to the successor with zero
counts. A reading Kanri doubted and could not verify carries `(unverified)`
after its Compactions figure; when the session sent `transcript: unavailable`,
`—` stands in the four figure columns and `context=unavailable` in Context, so
that a `context=` sweep still finds the row. At the plan close every row whose session is stopped,
dead, or replaced moves to `roster-archive.md`, joined with its
status row above, and the archive's Context column across runs is the data any
later ceiling for the roles that only measure would be read from — Kanri's and
Jisso's come from `tanto.json`'s `ceiling` map, and issue-40ed's two halves
closed with decision-b6cb and with that map.
```

**P1.18 →**

```markdown
Read at and the eight columns after it are the seat's reading, written into
its own row by `record` from the readings the sessions send (`SKILL.md`,
"The transcript reading"): a role's from its latest boundary or exit line,
Kanri's own from the reading it takes at the trigger check. Read at is
`batch <X>` for a boundary's reading and `start`, `handover`, `plan close`,
or `turn <HH:MM>` for one Kanri takes outside a boundary. Context holds the
reading's fifth figure in the spelling the reading itself prints,
`context=<n>`, so that a sweep for that spelling finds every place a
reading lands. The nine stay `—` until the seat's first reading lands.
Kikaku sends no reading and its reading columns stay `—`: it is the
human's own seat, and its cost is the human's own pacing. A `queued` row's
stay `—` until its boundary, and one that never ran moves to the archive as
`stopped`, with its blanks. Batches, Plans, and Noticed are Kanri's only —
batches accepted, plans closed, and compactions noticed by the session
itself, cumulative since its own start, `0` on the row `--init` or
`--succeeds` writes and moved by `record --kanri-count`, and `—` on every
other row; a declined handover leaves Noticed incremented, so the count
stays a record. A reading Kanri doubted and could not verify carries
`(unverified)` after its Compactions figure; when the session sent
`transcript: unavailable`, `—` stands in the four figure columns and
`context=unavailable` in Context, so that a `context=` sweep still finds
the row. The archive's Context column across runs is the data any later
ceiling for the roles that only measure would be read from — Kanri's and
Jisso's come from `tanto.json`'s `ceiling` map, and issue-40ed's two
halves closed with decision-b6cb and with that map.
```

**P1.19** `skills/tanto/templates/roster-archive.md` — replace exactly these 28 lines

```markdown
Kept by Kanri at `.tanto/roster-archive.md`, next to the roster.
Kanri is the only writer, and writes it at a plan close: the rows of the roster
whose status is `stopped`, `dead`, or `replaced` — a
`queued` row that never ran moves as `stopped` — each with its last Residency
reading, and the closed plan's Events lines move here, so that the roster
holds only the live run and this file holds the record across runs. Events
lines of a topic that ran concurrently, interleaved with the closed plan's,
move with them and sit under the closing plan's heading — so a topic's own
opening history may be filed under a sibling topic's heading, by design, not
by error. Nothing
is rewritten here; rows and lines are appended in the order they arrive.

## Sessions

| Role | Name [ref] | Model | Branch | Started | Ended | Status | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <role> | <name> | <model id> | <branch> | <YYYY-MM-DD> | <YYYY-MM-DD> | <stopped, dead, or replaced> | <last boundary> | <n> | <n> | <n> | <n> | context=<n> | <n or —> | <m or —> | <k or —> |

An archive row is the roster's status row for that session joined with its
last Residency row; the Topic, cwd, Effort, Mode and Transcript columns are
dropped, Started keeps the date and drops the time, Ended is the date the
row's status changed. Transcript is dropped because the file it names is
local to one machine and outlives nothing, and the topic's measurement does
not need it: `usage.js close`, the last act of the close's landing, finds
each seat's transcript from the spawner's result files — by the path a
result holds, else by its `sessionId` — so the move may come before it.
Context keeps the reading's `context=<n>` figure, and it is the one column
of this table a later design will be read from.
```

**P1.19 →**

```markdown
Kept at `.tanto/roster-archive.md`, next to the roster, and written by
`boundary.js archive` alone, at a plan close: every roster row whose status
is `stopped`, `dead`, or `replaced` — a `queued` row that never ran moves
as `stopped` — copied whole, and the closed plan's Events lines, verbatim,
so that the roster holds only the live run and this file holds the record
across runs. Events lines of a topic that ran concurrently, interleaved
with the closed plan's, move with them and sit under the closing plan's
heading — so a topic's own opening history may be filed under a sibling
topic's heading, by design, not by error. Nothing is rewritten here; rows
and lines are appended in the order they arrive.

## Sessions

| Role | Topic | Name | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed | Ended |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <role> | <topic> | <name> | <absolute path> | <family> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | <stopped, dead, or replaced> | <absolute path or <sessionId>.jsonl> | <last reading's label> | <n> | <n> | <n> | <n> | context=<n> | <n or —> | <m or —> | <k or —> | <YYYY-MM-DD> |

An archive row is the roster's row for that session copied whole — its
last reading among its cells, nothing joined and nothing dropped — and
Ended the date of the move. Context keeps the reading's `context=<n>`
figure, and it is the one column of this table a later design will be read
from. An archive in an older shape — the fifteen and sixteen columns of
2026-09 — is brought to this one by `boundary.js migrate`, each table
under `## Sessions` in place, its Topic, cwd, Effort, Mode, and Transcript
cells `—`; a closed plan's own section stays as it was written.
```

**P1.20** `skills/tanto/templates/kanri.md` — insert after these 2 lines

```markdown
could claim is one row in the ledger of the topic that raised it, never a
compound value.
```

**P1.20 →**

```markdown

Every row is written by `boundary.js record`, one
`--s-item "<source> | <destination> | <item>"` per item: an empty
destination is written `—`, and a two-field value is read as source and
item. A row with the same Source and Item is already there. The row is
numbered from the highest `S-n` in the table, and a table in which a number
occurs twice is refused before anything is written, so that a collision is
repaired once and never grows.
```

**W1.21** `skills/tanto/templates/shoroku-direction.md` — new file, 31 lines

```markdown
# Shoroku direction — <topic>

Written by Kanri at the close, at `.tanto/<topic>/shoroku-direction.md`,
from the human's answer to the shoroku brief: the recommendation as the
human left it, with what the answer changed. Item numbers are the
recommendation's (`.tanto/<topic>/shoroku-recommendation.md`). Everything
not named under Overrides and notes is as recommended.
`boundary.js record --direction <this path> --ledger <the ledger>` reads
the Items section and writes each `S-n` line's `yes` or `no` into the
Adopted cell of that row; a line whose pointer is `(inbox …)` it prints and
writes nothing for.

## Overrides and notes

- <item number> — <group> — <what the human's answer changed, and why>
- <Merge, a Departure, the hotfixes since the previous plan — one line
  each, or none>

## Items

Each line: item number — group — Adopted (`yes` adopts or fixes it, `no`
does not) — pointer: `<topic> S-<n>` for a row of the topic's ledger, or
`(inbox <basename>)`, with ` #<m>` for one item of a file that carries
several, for an inbox or feedback item.

- <n> — <adopt, fix, reject, or unsure> — <yes or no> — <topic> S-<n>
- <n> — <adopt, fix, reject, or unsure> — <yes or no> — (inbox <basename>[ #<m>])

The line grammar is fixed: `- <n> — <group> — yes|no — <topic> S-<n>` or
`- <n> — <group> — yes|no — (inbox <basename>[ #<m>])`, one line per item,
nothing after the pointer.
```

- [ ] **Step 4: Read the schema from the template, escape the cell, and write the twenty-cell row by `sessionId`**

Apply P1.1 to P1.13.

**P1.1** `skills/tanto/scripts/boundary.js` — replace exactly these 3 lines

```js
/** The roster's two `| Role | Topic | Name [ref] |` tables, told apart. */
const SESSIONS_HEADER = "| Role | Topic | Name [ref] | cwd |";
const RESIDENCY_HEADER = "| Role | Topic | Name [ref] | Since |";
```

**P1.1 →**

```js
/**
 * The skill's own templates: the schema `record` compares every table it is
 * about to touch with before it writes (spec 2.1). In the repository that
 * ships the skill the skill directory is a link into the tree, so these are
 * the working tree's own.
 */
const TEMPLATES = path.join(__dirname, "..", "templates");

/**
 * A table's header line: the first table under `## <heading>`, or, with a
 * null heading, the roster's seats table — the first table whose header
 * begins `| Role |`, whatever else it says, so that a roster in an older
 * shape is found and named rather than missed. Null when there is none.
 */
function headerAt(lines, heading) {
  if (heading === null) {
    const at = lines.findIndex((line) => line.startsWith("| Role |"));
    return at === -1 ? null : at;
  }
  const span = sectionSpan(lines, heading);
  const table = span ? tableSpan(lines, span) : null;
  return table ? table.header : null;
}

/** A template's header line for a table, as `headerAt` finds it. */
function templateHeader(template, heading) {
  const lines = fs.readFileSync(path.join(TEMPLATES, template), "utf8").split(/\r?\n/);
  return lines[headerAt(lines, heading)].trim();
}

/** The roster's seats table header, as `templates/roster.md` spells it. */
const SESSIONS_HEADER = templateHeader("roster.md", null);

/**
 * The one line a table earns whose header is not its template's, cell for
 * cell (spec 2.1), or null when the two agree. A file not on disk has no
 * header to compare: its absence is its caller's to refuse.
 */
function headerMismatch(file, template, heading) {
  if (file === null || !fs.existsSync(file)) return null;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  const expected = templateHeader(template, heading);
  const at = headerAt(lines, heading);
  if (at !== null && cells(lines[at]).join("|") === cells(expected).join("|")) return null;
  const found = at === null ? "no table" : lines[at].trim();
  const table = heading === null ? "seats table" : `${heading} table`;
  return `record wrote nothing — ${file}: the ${table} header is not the template's — expected ${expected}, found ${found} — run boundary.js migrate`;
}
```

**P1.2** `skills/tanto/scripts/boundary.js` — replace exactly these 10 lines

```js
/** The cells of a `| a | b |` row, trimmed. */
function cells(line) {
  const inner = line.replace(/^\s*\|/, "").replace(/\|\s*$/, "");
  return inner.split("|").map((cell) => cell.trim());
}

/** The row a cell list writes back as. */
function row(values) {
  return `| ${values.join(" | ")} |`;
}
```

**P1.2 →**

```js
/**
 * The cells of a `| a | b |` row, trimmed, each `\|` read back as the `|`
 * it stands for (spec 2.2). With `row`, the one place the escape lives:
 * every reader of a cell goes through this function.
 */
function cells(line) {
  const inner = line.replace(/^\s*\|/, "").replace(/(?<!\\)\|\s*$/, "");
  return inner.split(/(?<!\\)\|/).map((cell) => cell.trim().replace(/\\\|/g, "|"));
}

/** The row a cell list writes back as, each `|` inside a value written `\|`. */
function row(values) {
  return `| ${values.map((value) => String(value).replace(/\|/g, "\\|")).join(" | ")} |`;
}
```

**P1.3** `skills/tanto/scripts/boundary.js` — replace exactly these 39 lines

```js
/**
 * A Residency row, rewritten in place from a reading, or appended. An
 * `unavailable` reading still writes the row — `—` in the four figure
 * columns and `context=unavailable` — rather than refusing the whole call
 * over the one side whose transcript could not be read.
 */
function writeResidency(doc, role, name, reading, batch, today, written) {
  const unavailable = isUnavailableReading(reading);
  const figures = unavailable ? null : readingFigures(reading);
  if (!unavailable && !figures) return `a reading that parses (got ${reading})`;
  const table = tableByHeader(doc.lines, RESIDENCY_HEADER);
  if (!table) return "the roster's Residency table";
  let at = -1;
  for (let i = table.first; i < table.end; i++) {
    if (cells(doc.lines[i])[2] === name) at = i;
  }
  const blank = [role, "—", name, today, "", "", "", "", "", "", "—", "—", "—"];
  const current = at === -1 ? blank : cells(doc.lines[at]);
  while (current.length < blank.length) current.push("—");
  current[4] = `batch ${batch}`;
  if (unavailable) {
    current[5] = "—";
    current[6] = "—";
    current[7] = "—";
    current[8] = "—";
    current[9] = "context=unavailable";
  } else {
    current[5] = figures.bytes;
    current[6] = figures.records;
    current[7] = figures.wakeUps;
    current[8] = figures.compactions;
    current[9] = `context=${figures.context}`;
  }
  const line = row(current);
  if (at === -1) doc.lines.splice(table.end, 0, line);
  else doc.lines[at] = line;
  written.push(line);
  return null;
}
```

**P1.3 →**

```js
/**
 * The line of the seats-table row whose Transcript cell's basename is
 * `sessionId` (spec 1.1), or null. That cell is the key and nothing else
 * is: the Name cell is a record, rewritten at every rename.
 */
function seatRowAt(doc, sessionId) {
  const table = tableByHeader(doc.lines, SESSIONS_HEADER);
  if (!table) return null;
  for (let i = table.first; i < table.end; i++) {
    if (sessionIdOf(cells(doc.lines[i])[10]) === sessionId) return i;
  }
  return null;
}

/**
 * A reading, written into the reading columns of the row that holds its
 * seat (spec 1.1, 2.3): Read at and the five figures, and no other cell. A
 * reading appends no row — a row is created by `--seat` alone — and an
 * `unavailable` reading still writes `—` in the four figure columns and
 * `context=unavailable`, rather than refusing the whole call over the one
 * side whose transcript could not be read.
 */
function writeReading(doc, sessionId, reading, readAt, written) {
  const unavailable = isUnavailableReading(reading);
  const figures = unavailable ? null : readingFigures(reading);
  if (!unavailable && !figures) return `a reading that parses (got ${reading})`;
  const at = seatRowAt(doc, sessionId);
  if (at === null) return `a roster row for ${sessionId}`;
  const current = cells(doc.lines[at]);
  const read = unavailable
    ? ["—", "—", "—", "—", "context=unavailable"]
    : [figures.bytes, figures.records, figures.wakeUps, figures.compactions, `context=${figures.context}`];
  current.splice(11, 6, readAt, ...read);
  doc.lines[at] = row(current);
  written.push(doc.lines[at]);
  return null;
}
```

**P1.4** `skills/tanto/scripts/boundary.js` — replace exactly these 10 lines

```js
/**
 * A seat's roster row, written from the spawner's result file for every
 * seat, whoever asked for it: Kanri records a seat the launcher started once
 * the census prints it under Not held (spec 1.3). Idempotent: a second call
 * rewrites the row in place, matched by the Name column, and a name the
 * table does not hold is appended. The Status cell is always written as
 * `live`, on purpose (Minor 13, branch-review.md): `--seat` is only ever
 * called from a spawn or resume result, and a later `stopped` in that
 * column belongs to Kanri alone to write.
 */
```

**P1.4 →**

```js
/** A Transcript cell's basename as every writer writes it: `<uuid>.jsonl` (spec 2.2). */
const TRANSCRIPT_BASENAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jsonl$/i;

/**
 * The refusal a Transcript cell earns whose basename is not `<uuid>.jsonl`
 * — a path whose separators an inline script collapsed among them — or
 * null. It runs on the cell being written, never as a scan of the table.
 */
function transcriptProblem(cell) {
  const basename = String(cell).split(/[\\/]/).pop();
  return TRANSCRIPT_BASENAME.test(basename) ? null : `a Transcript cell whose basename is <uuid>.jsonl (got ${cell})`;
}

/** The refusal a cwd cell earns that carries a control character, or null. */
function cwdProblem(cell) {
  const control = [...String(cell || "")].some((ch) => ch.charCodeAt(0) < 32 || ch.charCodeAt(0) === 127);
  return control ? `a cwd cell with no control character (got ${JSON.stringify(cell)})` : null;
}

/** The seat fields the first eleven cells of a row are written from, by column. */
const SEAT_FIELDS = [
  "role",
  "topic",
  "name",
  "cwd",
  "model",
  "effort",
  "branch",
  "mode",
  "startedAt",
  null,
  "transcript",
];

/**
 * A seat's roster row, written from the seat a `--seat` value names, for
 * every seat, whoever asked for it: Kanri records a seat the launcher
 * started once the census prints it under Not held. The row is found by the
 * seat's `sessionId` and appended when no row holds it, its reading columns
 * `—` and its three counts `0` for Kanri and `—` for every other role; a
 * second call rewrites it in place, keeping every cell the seat does not
 * carry — the nine reading columns among them — and the Name cell whatever
 * the seat carries, so that a rewrite never undoes a rename (spec 2.4). A
 * bare `<sessionId>.jsonl` Transcript cell, written for a seat that carries
 * no `transcript`, is kept while the seat still carries none and replaced
 * by the path once it carries one; a path stays when a later seat carries
 * `transcript: null`. The Status cell is written `live`: a later `stopped`
 * belongs to Kanri alone to write. The Transcript and cwd cells are checked
 * for shape on the way in (spec 2.2).
 */
```

**P1.5** `skills/tanto/scripts/boundary.js` — replace exactly these 29 lines

```js
  if (!seat.name) return `a name in ${file}`;
  const table = tableByHeader(doc.lines, SESSIONS_HEADER);
  if (!table) return "the roster's sessions table";
  const columns = [
    seat.role || "—",
    seat.topic || "—",
    seat.name,
    seat.cwd || "—",
    seat.model || "—",
    seat.effort || "unknown",
    seat.branch || "—",
    seat.mode || "auto",
    seat.startedAt || "—",
    "live",
    // The path; a seat whose transcript is not on disk yet carries the bare
    // `<sessionId>.jsonl`, which the census matches by `sessionId`, and
    // `unavailable` stands only where the result held neither.
    seat.transcript || (seat.sessionId ? `${seat.sessionId}.jsonl` : "unavailable"),
  ];
  const line = row(columns);
  let at = -1;
  for (let i = table.first; i < table.end; i++) {
    if (cells(doc.lines[i])[2] === seat.name) at = i;
  }
  if (at === -1) doc.lines.splice(table.end, 0, line);
  else doc.lines[at] = line;
  written.push(line);
  return null;
}
```

**P1.5 →**

```js
  if (!seat.sessionId) return `a sessionId in ${file}`;
  // The path; a seat whose transcript is not on disk yet carries the bare
  // `<sessionId>.jsonl`, which every writer and the census find by its
  // `sessionId`.
  const transcript = seat.transcript || `${seat.sessionId}.jsonl`;
  const shape = transcriptProblem(transcript) || cwdProblem(seat.cwd);
  if (shape) return shape;
  const table = tableByHeader(doc.lines, SESSIONS_HEADER);
  if (!table) return "the roster's seats table";
  const fresh = [
    seat.role || "—",
    seat.topic || "—",
    seat.name || "—",
    seat.cwd || "—",
    seat.model || "—",
    seat.effort || "unknown",
    seat.branch || "—",
    seat.mode || "auto",
    seat.startedAt || "—",
    "live",
    transcript,
    "—",
    "—",
    "—",
    "—",
    "—",
    "—",
    ...(seat.role === "kanri" ? ["0", "0", "0"] : ["—", "—", "—"]),
  ];
  const broken = fresh.find((cell) => /[\r\n]/.test(String(cell)));
  if (broken !== undefined) return `a cell with no newline (got ${JSON.stringify(broken)})`;
  const at = seatRowAt(doc, seat.sessionId);
  if (at === null) {
    const line = row(fresh);
    doc.lines.splice(table.end, 0, line);
    written.push(line);
    return null;
  }
  const current = cells(doc.lines[at]);
  while (current.length < fresh.length) current.push("—");
  const next = current.map((cell, i) => {
    if (i === 9) return "live";
    const field = SEAT_FIELDS[i];
    return field && field !== "name" && seat[field] ? fresh[i] : cell;
  });
  doc.lines[at] = row(next);
  written.push(doc.lines[at]);
  return null;
}
```

**P1.6** `skills/tanto/scripts/boundary.js` — replace exactly these 2 lines

```js
  const now = given(values, "now") || stamp(new Date());
  const today = now.slice(0, 10);
```

**P1.6 →**

```js
  const now = given(values, "now") || stamp(new Date());
```

**P1.7** `skills/tanto/scripts/boundary.js` — insert after these 4 lines

```js
  const problems = [];
  const note = (problem) => {
    if (problem) problems.push(problem);
  };
```

**P1.7 →**

```js
  // A value with a newline would end its row early (spec 2.2): nothing
  // this call names is written past one.
  const broken = argv.find((arg) => /[\r\n]/.test(arg));
  if (broken !== undefined) {
    return fail(`record wrote nothing — it did not find a cell with no newline (got ${JSON.stringify(broken)})`, 1);
  }
  // Every table this call is about to touch is compared, cell for cell, with
  // the same table in the skill's own template before anything is written
  // (spec 2.1); one mismatch writes nothing, and its line names the command
  // that repairs it.
  const measures = (kanriReading !== null && jissoReading !== null) || given(values, "deferred") !== null;
  const touches = [
    [wantsBatchRow, ledgerPath, "kanri.md", "Batches"],
    [measures, ledgerPath, "kanri.md", "Measurements"],
    [values["s-item"].length > 0, ledgerPath, "kanri.md", "Shoroku proposal items"],
    [needRoster, rosterPath, "roster.md", null],
  ];
  const mismatches = touches
    .filter(([touched]) => touched)
    .map(([, file, template, heading]) => headerMismatch(file, template, heading))
    .filter((line) => line !== null);
  if (mismatches.length > 0) {
    for (const line of mismatches) fail(line, 1);
    return 1;
  }
```

**P1.8** `skills/tanto/scripts/boundary.js` — replace exactly these 2 lines

```js
      // call — the other side's own Residency row, and everything else this
      // call names, are still written below.
```

**P1.8 →**

```js
      // call — the other side's own reading, and everything else this call
      // names, are still written below.
```

**P1.9** `skills/tanto/scripts/boundary.js` — replace exactly these 3 lines

```js
  const residencyRows = kanri !== null || jisso !== null || values["peer-reading"].length > 0;
  if (residencyRows && !batch) note("--batch beside a Residency row");
  if (needRoster && !(residencyRows && !batch)) {
```

**P1.9 →**

```js
  // A reading lands in the reading columns of the row that holds its seat,
  // found by the `sessionId` its flag names (spec 1.1, 2.3). Its Read at
  // cell is `batch <X>` inside a boundary and the `--read-at` label outside
  // one — `start`, `handover`, `plan close` — and a reading with neither is
  // refused.
  const readings = kanriReading !== null || jissoReading !== null || values["peer-reading"].length > 0;
  const readAt = batch ? `batch ${batch}` : given(values, "read-at");
  if (readings && !readAt) note("--batch or --read-at beside a reading");
  if (needRoster && !(readings && !readAt)) {
```

**P1.10** `skills/tanto/scripts/boundary.js` — replace exactly this 1 line

```js
      note(writeResidency(roster, "kanri", kanri, kanriReading, batch, today, written));
```

**P1.10 →**

```js
      note(writeReading(roster, kanri, kanriReading, readAt, written));
```

**P1.11** `skills/tanto/scripts/boundary.js` — replace exactly this 1 line

```js
      note(writeResidency(roster, "jisso", jisso, jissoReading, batch, today, written));
```

**P1.11 →**

```js
      note(writeReading(roster, jisso, jissoReading, readAt, written));
```

**P1.12** `skills/tanto/scripts/boundary.js` — replace exactly this 1 line

```js
      note(writeResidency(roster, found[1], found[2], found[3], batch, today, written));
```

**P1.12 →**

```js
      note(writeReading(roster, found[2], found[3], readAt, written));
```

**P1.13** `skills/tanto/scripts/boundary.js` — replace exactly these 2 lines

```js
  const table = tableByHeader(lines, SESSIONS_HEADER);
  if (!table) return fail(`census: no sessions table in ${rosterPath}`, 2);
```

**P1.13 →**

```js
  // A roster whose seats table is not the template's is refused whole, and
  // the line names the command that repairs it (spec 3).
  if (headerMismatch(rosterPath, "roster.md", null) !== null) {
    console.log("census: roster header is not the template's — run boundary.js migrate");
    return 1;
  }
  const table = tableByHeader(lines, SESSIONS_HEADER);
  if (!table) {
    console.log("census: roster header is not the template's — run boundary.js migrate");
    return 1;
  }
```

- [ ] **Step 5: Run the boundary suite to verify it passes**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: every test passes, the census tests printing their old output over the twenty-column fixture.

- [ ] **Step 6: Run the whole suite**

Run it in the background with its output in a file, and read the file
after the completion notice; a run cut at a timeout is no result.

```bash
node --test skills/tanto/scripts/*.test.js > .tanto/roster-ledger/suite-task-1.txt 2>&1
```

Expected: exit 0, and the file's last lines report no failed test.

- [ ] **Step 7: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 1
```

Expected: `task 1: verify clean`.

- [ ] **Step 8: Run lint on the task's own paths**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js skills/tanto/scripts/spawner.test.js skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md skills/tanto/templates/kanri.md skills/tanto/templates/shoroku-direction.md
```

Expected: lint passes with no file changed.

- [ ] **Step 9: Commit**

The template is new, so it is added first; and since a created Markdown
file lands `w/lf` on this host, it is restored from the index after the
commit.

```bash
git add -- skills/tanto/templates/shoroku-direction.md
```

Expected: no output.

```bash
git commit --only -m "feat: the roster is one table read against its template, and record refuses a header that is not the template's" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js skills/tanto/scripts/spawner.test.js skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md skills/tanto/templates/kanri.md skills/tanto/templates/shoroku-direction.md
```

Expected: one commit.

```bash
rm skills/tanto/templates/shoroku-direction.md && git checkout -- skills/tanto/templates/shoroku-direction.md
```

Expected: no output.

### Task 2: The key: `--status`, `--suffix`, Kanri's counts, the peer line, and `seat`'s sixth field

Spec 1.3's five status words and the rest of 2.3. `--status
"<sessionId> <word>"` writes one of `queued`, `live`, `stopped`,
`replaced`, and `dead` into the Status cell of the row `seatRowAt` finds,
and refuses `cleared`, any other word, and a name in place of a
`sessionId`; `--suffix "<sessionId> blocked <HH:MM>|idle <HH:MM>|none"`
appends or removes a `live` cell's suffix and refuses a row whose word is
not `live`; `--kanri <sessionId> --kanri-count batches|plans|noticed` adds
one to that column alone, and `--kanri-counts "<n> <m> <k>"` sets the
three, neither needing a reading, `--kanri-count` being, by spec 2.3's
definition, the one write a second identical call is not a no-op for; a
`--peer-reading` line carries `<role> <sessionId> <reading>`, and a line
with a bracketed name no longer parses; and `seat`'s line — which `wake`
prints too — ends with the seat's `sessionId`, the sixth field Kanri reads
to resolve a peer's bare name at receipt. Task 1 already keyed the
readings and wrote `--read-at`. After this task, every roster write but
the seat writers' is keyed by `sessionId`.

**Files:**

- Modify: `skills/tanto/scripts/boundary.js` — `PEER`; `writeStatus`
  replaced by `STATUS_WORDS`, `COUNT_COLUMNS`, `rewriteRow`, `writeStatus`,
  `writeSuffix`, and `writeCounts`; `cmdRecord`'s `rosterRows` line, its
  `--kanri-reading` check, and its status loop; `seatLine`'s comment and
  its line.
- Test: `skills/tanto/scripts/boundary.test.js` — the `--status` test
  replaced by the status, suffix, counts, and peer-line tests; the `seat`
  test's name and four lines; four `wake` lines.

**Interfaces:**

- Consumes: Task 1's `seatRowAt`, `SEAT`'s `sessionId`, `KANRI_ID`,
  `JISSO_ID`, and the seeded `ledgerAndRoster`.
- Produces: `STATUS_WORDS`; `rewriteRow(doc, sessionId, change, written)`;
  `writeStatus(doc, value, written)`, `writeSuffix(doc, value, written)`,
  `writeCounts(doc, sessionId, count, counts, written)`; in `cmdRecord`,
  `kanriCount`, `kanriCounts`, `counted`, and `suffix`, which Task 3 keeps
  defined, and the `seatRows` it reads from Task 3's lines; the six-field
  `seat` and `wake` line, `<status> <name> <kind> <role> <turn> <sessionId>`,
  which Task 6's role text reads.

**Named-mechanism sites** (`git grep` at the base).

- The status words and `cleared`: `templates/roster.md`'s status paragraph
  (five words already, unchanged); `SKILL.md` "The roster" (Task 12);
  `roles/kanri.md` "Session lifecycle" and the Release row (Tasks 15 and 16);
  `tanto.js`'s `oldShapeLine` `cleared` test (Task 11).
- The two suffixes and their writer: `SKILL.md` "The roster" and "Messages"
  (Tasks 12, 13); `roles/kanri.md` loop step 4's `(idle since)` sentence and
  "Session lifecycle"'s `(blocked since)` bullet (Task 15).
- Kanri's counts: `templates/roster.md`'s reading paragraph (Task 1);
  `roles/kanri.md` loop step 6 (Task 6), the Handover case (Task 14), "The
  residency line" and the Release row (Task 15).
- `seat`'s line and its sixth field: `SKILL.md` "The address" (Task 12);
  `roles/kanri.md` "Sending to a seat", which spells the five words, and
  the readings line of loop step 2 (Task 6). No task of the cut names
  "Sending to a seat"'s line; Keikaku places it.

**O2.15** `live|cleared|stopped|queued` — `cleared` as a `record --status` word (spec 1.3; the Old values' third needle); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O2.16** `live, cleared, stopped, or queued` — the status refusal and its test (spec 1.3); before: 1 in `skills/tanto/scripts/boundary.js` and 1 in `skills/tanto/scripts/boundary.test.js`, after: 0 in both.

**O2.17** `(?:\s+\[[^\]]+\])?` — the peer line's bracketed name (spec 2.3); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O2.18** `the address, and the reading` — `PEER`'s comment (spec 2.3); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O2.19** `current[2] !== name` — `writeStatus`'s match by name (spec 2.3); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O2.20** `note("--kanri-reading beside --kanri")` — a `--kanri` that needed a reading, now also met by a count (spec 2.3); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O2.21** `seat prints its five words and the spawner: line` — the `seat` test's name (spec 2.3); before: 1 in `skills/tanto/scripts/boundary.test.js`, after: 0.

- [ ] **Step 1: Write the failing tests**

Apply P2.1 to P2.3 and P2.11 to P2.14. P2.1 replaces the `--status` test
with the status, suffix, counts, and peer-line tests; P2.2, P2.3, and
P2.11 to P2.14 give the `seat` and `wake` lines their sixth field.

**P2.1** `skills/tanto/scripts/boundary.test.js` — replace exactly these 23 lines

```js
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
```

**P2.1 →**

```js
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
```

**P2.2** `skills/tanto/scripts/boundary.test.js` — replace exactly this 1 line

```js
test("seat prints its five words and the spawner: line, by sessionId or by name, and no entry with the listing's kind (spec 1.5, 2.5)", () => {
```

**P2.2 →**

```js
test("seat prints its five words and its sessionId, then the spawner: line, by sessionId or by name, and no entry with the listing's kind (spec 1.5, 2.5)", () => {
```

**P2.3** `skills/tanto/scripts/boundary.test.js` — replace exactly these 4 lines

```js
  assert.strictEqual(lines("sess-a"), "parked dotskills-sekkei-t-1a2b - sekkei ended\nspawner: beating\n");
  assert.strictEqual(lines("sess-b"), "running dotskills-keikaku-t-3c4d background keikaku open\nspawner: beating\n");
  assert.strictEqual(lines("sess-c"), "stopped dotskills-7b interactive kikaku -\nspawner: beating\n");
  assert.strictEqual(lines("dotskills-denrei-7a8b"), "removed dotskills-denrei-7a8b - denrei -\nspawner: beating\n");
```

**P2.3 →**

```js
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
```

**P2.11** `skills/tanto/scripts/boundary.test.js` — replace exactly this 1 line

```js
      "running dotskills-sekkei-t-1a2b background sekkei ended",
```

**P2.11 →**

```js
      "running dotskills-sekkei-t-1a2b background sekkei ended sess-a",
```

**P2.12** `skills/tanto/scripts/boundary.test.js` — replace exactly this 1 line

```js
  assert.strictEqual(woken.out, "spawner: beating\nparked dotskills-hosa-1a2b - hosa -\n");
```

**P2.12 →**

```js
  assert.strictEqual(woken.out, "spawner: beating\nparked dotskills-hosa-1a2b - hosa - sess-a\n");
```

**P2.13** `skills/tanto/scripts/boundary.test.js` — replace exactly this 1 line

```js
  assert.strictEqual(woken.out, "spawner: beating\nparked dotskills-hosa-1a2b - hosa - — hold: no such seat\n");
```

**P2.13 →**

```js
  assert.strictEqual(woken.out, "spawner: beating\nparked dotskills-hosa-1a2b - hosa - sess-a — hold: no such seat\n");
```

**P2.14** `skills/tanto/scripts/boundary.test.js` — replace exactly this 1 line

```js
  assert.strictEqual(woken.out, "spawner: beating\nparked dotskills-hosa-1a2b - hosa -\nlisting: listing broke\n");
```

**P2.14 →**

```js
  assert.strictEqual(
    woken.out,
    "spawner: beating\nparked dotskills-hosa-1a2b - hosa - sess-a\nlisting: listing broke\n",
  );
```

- [ ] **Step 2: Run the boundary tests to verify they fail**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: FAIL — the four new `record` tests (today's `--status` keys by
name and takes `cleared`, and `--suffix`, `--kanri-count`, and
`--kanri-counts` do not exist) and the `seat` test, whose lines lack the
sixth field; the `wake` tests fail on the same field. The other tests pass.

- [ ] **Step 3: Key the status, the suffix, and the counts by `sessionId`, and print it on `seat`'s line**

Apply P2.4 to P2.10.

**P2.4** `skills/tanto/scripts/boundary.js` — replace exactly these 2 lines

```js
/** A `--peer-reading` value: the role, the address, and the reading. */
const PEER = /^(\S+)\s+(\S+(?:\s+\[[^\]]+\])?)\s+(transcript:.*)$/;
```

**P2.4 →**

```js
/**
 * A `--peer-reading` value: the role, the seat's `sessionId`, which Kanri
 * resolved from the peer's bare name at receipt, and the reading (spec 2.3).
 */
const PEER = /^(\S+)\s+(\S+)\s+(transcript:.*)$/;
```

**P2.5** `skills/tanto/scripts/boundary.js` — replace exactly these 14 lines

```js
/** A session row's Status cell. */
function writeStatus(doc, name, status, written) {
  const table = tableByHeader(doc.lines, SESSIONS_HEADER);
  if (!table) return "the roster's sessions table";
  for (let i = table.first; i < table.end; i++) {
    const current = cells(doc.lines[i]);
    if (current[2] !== name) continue;
    current[9] = status;
    doc.lines[i] = row(current);
    written.push(doc.lines[i]);
    return null;
  }
  return `a roster row for ${name}`;
}
```

**P2.5 →**

```js
/** The five words a row's Status cell holds (spec 1.3); `cleared` is none of them. */
const STATUS_WORDS = ["queued", "live", "stopped", "replaced", "dead"];

/** Kanri's three count columns, by the word `--kanri-count` names them with. */
const COUNT_COLUMNS = { batches: 17, plans: 18, noticed: 19 };

/** One row's cells, rewritten by `change` in place, found by `sessionId`. */
function rewriteRow(doc, sessionId, change, written) {
  const at = seatRowAt(doc, sessionId);
  if (at === null) return `a roster row for ${sessionId}`;
  const current = cells(doc.lines[at]);
  const problem = change(current);
  if (problem) return problem;
  doc.lines[at] = row(current);
  written.push(doc.lines[at]);
  return null;
}

/**
 * A `--status "<sessionId> <word>"` value, written into the Status cell
 * whole — a `live` cell's suffix goes with its word — or the refusal a word
 * that is not one of the five, or a name in place of a `sessionId`, earns.
 */
function writeStatus(doc, value, written) {
  const found = /^(\S+)\s+(\S+)$/.exec(String(value).trim());
  if (!found || !STATUS_WORDS.includes(found[2])) {
    return `a --status "<sessionId> <word>", the word one of ${STATUS_WORDS.join(", ")} (got ${value})`;
  }
  return rewriteRow(
    doc,
    found[1],
    (current) => {
      current[9] = found[2];
      return null;
    },
    written,
  );
}

/**
 * A `--suffix "<sessionId> blocked <HH:MM>|idle <HH:MM>|none"` value (spec
 * 2.3): `(blocked since <HH:MM>)` or `(idle since <HH:MM>)` after a `live`
 * cell's word, or neither with `none`. A row whose word is not `live` is
 * refused.
 */
function writeSuffix(doc, value, written) {
  const found = /^(\S+)\s+(?:(blocked|idle)\s+(\d{2}:\d{2})|none)$/.exec(String(value).trim());
  if (!found) return `a --suffix "<sessionId> blocked <HH:MM>|idle <HH:MM>|none" (got ${value})`;
  return rewriteRow(
    doc,
    found[1],
    (current) => {
      const word = current[9].split(/\s+/)[0];
      if (word !== "live") return `a live row for --suffix (got ${word})`;
      current[9] = found[2] ? `live (${found[2]} since ${found[3]})` : "live";
      return null;
    },
    written,
  );
}

/**
 * Kanri's counts (spec 2.3): `--kanri-count <column>` adds one to that cell
 * and touches nothing else, the moments a count moves being moments Kanri
 * reads no row; `--kanri-counts "<batches> <plans> <noticed>"` sets the
 * three, for a repair. The one write a second identical call is not a no-op
 * for, since an increment is what it is.
 */
function writeCounts(doc, sessionId, count, counts, written) {
  return rewriteRow(
    doc,
    sessionId,
    (current) => {
      if (count !== null) {
        if (!Object.hasOwn(COUNT_COLUMNS, count)) return `a --kanri-count of batches, plans, or noticed (got ${count})`;
        const column = COUNT_COLUMNS[count];
        const n = Number(current[column]);
        current[column] = String((Number.isInteger(n) ? n : 0) + 1);
      }
      if (counts !== null) {
        const found = /^(\d+) (\d+) (\d+)$/.exec(counts.trim());
        if (!found) return `a --kanri-counts "<batches> <plans> <noticed>" (got ${counts})`;
        current.splice(17, 3, found[1], found[2], found[3]);
      }
      return null;
    },
    written,
  );
}
```

**P2.6** `skills/tanto/scripts/boundary.js` — replace exactly this 1 line

```js
  const rosterRows = values["peer-reading"].length + values.status.length + seatRows;
```

**P2.6 →**

```js
  const kanriCount = given(values, "kanri-count");
  const kanriCounts = given(values, "kanri-counts");
  const counted = kanriCount !== null || kanriCounts !== null;
  if (counted && kanri === null) return fail("record needs --kanri beside --kanri-count or --kanri-counts", 2);
  const suffix = given(values, "suffix");
  const rosterRows = values["peer-reading"].length + values.status.length + seatRows + (suffix === null ? 0 : 1);
```

**P2.7** `skills/tanto/scripts/boundary.js` — replace exactly this 1 line

```js
    if (kanri !== null && kanriReading === null) note("--kanri-reading beside --kanri");
```

**P2.7 →**

```js
    if (kanri !== null && kanriReading === null && !counted) {
      note("--kanri-reading, --kanri-count, or --kanri-counts beside --kanri");
    }
    if (kanri !== null && counted) note(writeCounts(roster, kanri, kanriCount, kanriCounts, written));
```

**P2.8** `skills/tanto/scripts/boundary.js` — replace exactly these 8 lines

```js
    for (const line of values.status) {
      const found = /^(.*)\s+(live|cleared|stopped|queued)$/.exec(String(line).trim());
      if (!found) {
        note(`a --status ending in live, cleared, stopped, or queued (got ${line})`);
        continue;
      }
      note(writeStatus(roster, found[1].trim(), found[2], written));
    }
```

**P2.8 →**

```js
    for (const line of values.status) note(writeStatus(roster, line, written));
    if (suffix !== null) note(writeSuffix(roster, suffix, written));
```


**P2.9** `skills/tanto/scripts/boundary.js` — replace exactly these 2 lines

```js
/**
 * `seat`'s line, `<status> <name> <kind> <role> <turn>` (spec 2.5). The name
```

**P2.9 →**

```js
/**
 * `seat`'s line, `<status> <name> <kind> <role> <turn> <sessionId>` (spec
 * 2.5), which `wake` prints too: the sixth field is what Kanri reads to
 * resolve a peer's bare name at receipt (roster-ledger 2.3). The name
```

**P2.10** `skills/tanto/scripts/boundary.js` — replace exactly this 1 line

```js
  return `${seat.status || "-"} ${name} ${kind} ${seat.role || "-"} ${turn}`;
```

**P2.10 →**

```js
  return `${seat.status || "-"} ${name} ${kind} ${seat.role || "-"} ${turn} ${seat.sessionId}`;
```


- [ ] **Step 4: Run the boundary suite to verify it passes**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: every test passes.

- [ ] **Step 5: Run the whole suite**

Run it in the background with its output in a file, and read the file
after the completion notice; a run cut at a timeout is no result.

```bash
node --test skills/tanto/scripts/*.test.js > .tanto/roster-ledger/suite-task-2.txt 2>&1
```

Expected: exit 0, and the file's last lines report no failed test.

- [ ] **Step 6: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 2
```

Expected: `task 2: verify clean`.

- [ ] **Step 7: Run lint on the task's own paths**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: lint passes with no file changed.

- [ ] **Step 8: Commit**

```bash
git commit --only -m "feat: record keys --status, --suffix, and Kanri's counts by sessionId, and seat prints the sessionId" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: one commit.

### Task 3: The seat writers: `--seat` repeated or by `sessionId`, `--init`, `--succeeds`, `--roster-event`, `--rename`, and `--ledger` for the ledger alone

Spec 2.4. `--seat` repeats, each value a spawn result file or a
`sessionId` whose state-file entry supplies the row — Branch `—` until
Task 10 persists `request.branch` — and a value that is neither is
refused; `record --init --roster <path> --seat <value>...` creates the
roster from `templates/roster.md` with its placeholder rows and its Events
placeholder dropped, the `(no item yet)` row kept, and refuses a roster
that exists; `--succeeds <sessionId>`, with exactly one Kanri `--seat`,
moves the successor's row first, writes the predecessor's `replaced` with
its other cells kept, and writes the roster Events line
`handover accepted by <successor name> from <predecessor name> — <predecessor Transcript cell>`;
`--roster-event "<text>"` writes a stamped, deduplicated line under the
roster's `## Events`; `--rename "<sessionId> <new name>"` rewrites the
Name cell and writes `resumed: <old name> → <new name>` itself; and
`--ledger` is needed by the flags that write the ledger alone, with
`--s-item` given `--roster` and no `--ledger` writing the roster's own
items table under the same header check. That last form, which the cut
gives Task 4, is this task's, since it is the one exception to the ledger
rule written here. After this task, no roster row, Name cell, or Events
line is written by hand.

**Files:**

- Modify: `skills/tanto/scripts/boundary.js` — `REPEATABLE`; `writeEvent`'s
  comment's last line and its heading parameter; `writeSeatRow`'s
  signature and its read of the seat, through `seatOf`; `seatOf`,
  `writeSucceeds`, `writeRename`, and `recordInit` before `cmdRecord`;
  `cmdRecord`'s ledger requirement, its `--seat` values, its `needRoster`,
  its ledger read, its `--s-item` loop, its seat write, and its ledger
  write.
- Test: `skills/tanto/scripts/boundary.test.js` — the missing-file `--seat`
  test replaced by six tests.

**Interfaces:**

- Consumes: Task 1's `writeSeatRow` body (it reads `seat`, `file`, and
  `written`), `seatRowAt`, `headerMismatch`, `TEMPLATES`, and
  `SESSIONS_HEADER`; Task 2's `rosterRows` line, which reads `seatRows`;
  `stateSeats(root)` on `main` already.
- Produces: `seatOf(value, root)`; `writeSucceeds`, `writeRename`, and
  `recordInit(values)`; `writeEvent(doc, text, batch, now, written,
  heading)`, the roster's `Events` heading its last argument; in
  `cmdRecord`, `root`, `seatValues`, `succeeds`, `rename`,
  `itemsToRoster`, and a `ledger` that may be null, which Task 4's write-back
  refuses when it is; the forms `--init`, `--succeeds`, `--rename`, and
  `--roster-event`, which Tasks 12 to 16's role text names.

**Named-mechanism sites** (`git grep` at the base).

- `--init` and the bootstrap: `roles/kanri.md` Start step 3 (Task 14);
  `templates/roster.md`'s first bullet (Task 1).
- `--succeeds` and the handover row: `roles/kanri.md`'s Handover case and
  its `or dead` clause (Task 14); `templates/kanri-handover.md` (Task 17);
  `tanto.js`'s held-Kanri branch (Task 11); the spawner's `succeeds` field
  (`spawner.js`, unchanged).
- `--rename` and `resumed:`: `templates/roster.md`'s third bullet (Task 1);
  `roles/kanri.md`'s "Yours" case (Task 14) and "Session lifecycle"'s
  `— renamed` act (Task 16); `SKILL.md` "The roster" (Task 12).
- `--roster-event` and every roster Events line `roles/kanri.md` asks for
  (Task 16).
- `--seat <sessionId>` and the state entry's Branch: `spawner.js`'s
  `request.branch` (Task 10).
- `--ledger` for the ledger alone: `templates/boundary-brief.md`'s second
  `record` call and `roles/kanri.md`'s rework call, which keep it (Task 6
  leaves both).

**O3.13** `if (!ledgerPath) return` — `--ledger` required by every call (spec 2.4); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O3.14** `seatFile` — the one `--seat` file (spec 2.4); before: 7 in `skills/tanto/scripts/boundary.js`, after: 0.

**O3.15** `function writeSeatRow(doc, file, written)` — the seat read from a result file alone (spec 2.4); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O3.16** `"status"];` — `REPEATABLE` without `seat` and `roster-event` (spec 2.4); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O3.17** `sectionSpan(doc.lines, "Session events");` — the event writer bound to the ledger's heading (spec 2.4); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O3.18** `--seat on a file that is not there exits 2` — the test of a `--seat` value read as a file alone (spec 2.4); before: 1 in `skills/tanto/scripts/boundary.test.js`, after: 0.

**A3.19** `skills/tanto/scripts/boundary.js` — `grep -c "seatOf(" skills/tanto/scripts/boundary.js` — before: 0, after: 3

- [ ] **Step 1: Write the failing tests**

Apply P3.1: the missing-file `--seat` test becomes the repeated and
state-entry `--seat` test, and the bare-Transcript rewrite, `--init`,
`--succeeds`, `--rename` with `--roster-event`, and roster `--s-item`
tests follow it.

**P3.1** `skills/tanto/scripts/boundary.test.js` — replace exactly these 15 lines

```js
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
```

**P3.1 →**

```js
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
```


- [ ] **Step 2: Run the boundary tests to verify they fail**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: FAIL — the six new tests: today's `record` takes one `--seat`
file, refuses every call without `--ledger`, and knows neither `--init`,
`--succeeds`, `--rename`, nor `--roster-event`. The other tests pass.

- [ ] **Step 3: Write the seat writers and make `--ledger` the ledger's alone**

Apply P3.2 to P3.12.

**P3.2** `skills/tanto/scripts/boundary.js` — replace exactly these 2 lines

```js
/** The flags `record` collects rather than overwrites. */
const REPEATABLE = ["peer-reading", "s-item", "event", "status"];
```

**P3.2 →**

```js
/** The flags `record` collects rather than overwrites. */
const REPEATABLE = ["peer-reading", "s-item", "event", "status", "seat", "roster-event"];
```

**P3.3** `skills/tanto/scripts/boundary.js` — replace exactly these 5 lines

```js
 * `--batch` — a between-plans record — keys on the text alone.
 */
function writeEvent(doc, text, batch, now, written) {
  const span = sectionSpan(doc.lines, "Session events");
  if (!span) return "the ledger's Session events section";
```

**P3.3 →**

```js
 * `--batch` — a between-plans record — keys on the text alone. The roster's
 * `## Events` lines are written the same way, by `--roster-event`, with the
 * heading `Events` (spec 2.4).
 */
function writeEvent(doc, text, batch, now, written, heading = "Session events") {
  const span = sectionSpan(doc.lines, heading);
  if (!span) return heading === "Events" ? "the roster's Events section" : "the ledger's Session events section";
```

**P3.4** `skills/tanto/scripts/boundary.js` — replace exactly these 7 lines

```js
function writeSeatRow(doc, file, written) {
  let seat;
  try {
    seat = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return `a --seat file that parses (${file})`;
  }
```

**P3.4 →**

```js
function writeSeatRow(doc, file, root, written) {
  const { seat, problem } = seatOf(file, root);
  if (problem) return problem;
```

**P3.5** `skills/tanto/scripts/boundary.js` — insert before these 2 lines

```js
function cmdRecord(argv) {
  const values = parseArgs(argv, REPEATABLE);
```

**P3.5 →**

```js
/**
 * The seat a `--seat` value names (spec 2.4): a spawn result file's, or, for
 * a value that names no file, the state file's entry for that `sessionId`,
 * which carries every cell a row needs and stays when the close moves the
 * topic's result files — how a Kanri the launcher spawned writes its own row
 * at the bootstrap and at a handover. A resume result is no input: a resumed
 * seat's row exists, and a wake writes no row.
 */
function seatOf(value, root) {
  if (fs.existsSync(value)) {
    try {
      return { seat: JSON.parse(fs.readFileSync(value, "utf8")) };
    } catch {
      return { problem: `a --seat file that parses (${value})` };
    }
  }
  const entry = stateSeats(root).get(value);
  if (!entry) return { problem: `a --seat result file or a sessionId the state file holds (got ${value})` };
  return { seat: entry };
}

/**
 * The handover write (spec 2.4), after `--seat` has written the successor's
 * row: that row moved first in the table; the predecessor's row, found by
 * the `sessionId` given, `replaced` with every other cell kept, its reading
 * columns among them; and the roster Events line
 * `handover accepted by <successor name> from <predecessor name> — <predecessor Transcript cell>`.
 */
function writeSucceeds(doc, predecessor, value, root, now, written) {
  const { seat } = seatOf(value, root);
  if (seat.role !== "kanri") return `a --seat whose role is kanri beside --succeeds (got ${seat.role || "none"})`;
  if (seat.sessionId === predecessor) return `a --succeeds that names another seat than the --seat (${predecessor})`;
  if (seatRowAt(doc, predecessor) === null) return `a roster row for ${predecessor}`;
  const table = tableByHeader(doc.lines, SESSIONS_HEADER);
  const [moved] = doc.lines.splice(seatRowAt(doc, seat.sessionId), 1);
  doc.lines.splice(table.first, 0, moved);
  const at = seatRowAt(doc, predecessor);
  const current = cells(doc.lines[at]);
  current[9] = "replaced";
  doc.lines[at] = row(current);
  written.push(doc.lines[at]);
  const line = `handover accepted by ${cells(moved)[2]} from ${current[2]} — ${current[10]}`;
  return writeEvent(doc, line, null, now, written, "Events");
}

/**
 * `--rename "<sessionId> <new name>"` (spec 2.4): the row's Name cell
 * rewritten and the roster Events line `resumed: <old name> → <new name>`
 * written with it — the census's `— renamed` act and the "Yours" case's
 * rewrite. A row that carries the name already is left as it stands, its
 * line printed again.
 */
function writeRename(doc, value, now, written) {
  const found = /^(\S+)\s+(\S.*)$/.exec(String(value).trim());
  if (!found) return `a --rename "<sessionId> <new name>" (got ${value})`;
  const [, sessionId, name] = found;
  const at = seatRowAt(doc, sessionId);
  if (at === null) return `a roster row for ${sessionId}`;
  const current = cells(doc.lines[at]);
  const old = current[2];
  if (old === name) {
    written.push(doc.lines[at]);
    const span = sectionSpan(doc.lines, "Events");
    const lines = span ? doc.lines.slice(span.start, span.end) : [];
    const said = lines.findLast((line) => line.includes(" — resumed: ") && line.endsWith(` → ${name}`));
    if (said) written.push(said);
    return null;
  }
  current[2] = name;
  doc.lines[at] = row(current);
  written.push(doc.lines[at]);
  return writeEvent(doc, `resumed: ${old} → ${name}`, null, now, written, "Events");
}

/**
 * `record --init --roster <path> --seat <value>...` (spec 2.4): the roster
 * created from `templates/roster.md` — its prose and its tables, the seats
 * table's two placeholder rows dropped, the items table's `(no item yet)`
 * row kept for the items writer, and the placeholder bullet under
 * `## Events` dropped so that `--roster-event` appends under an empty
 * heading — then its seats, in the order given, Kanri's own first. A roster
 * that exists is refused, and the call takes nothing else.
 */
function recordInit(values) {
  const rosterPath = given(values, "roster");
  const seatValues = values.seat.filter((value) => value !== true);
  if (!rosterPath || seatValues.length === 0) return fail("record --init needs --roster and a --seat", 2);
  const allowed = ["init", "roster", "seat", "root", "now"];
  const named = (value) => !(Array.isArray(value) && value.length === 0);
  const extra = Object.entries(values).filter(([name, value]) => !allowed.includes(name) && named(value));
  if (extra.length > 0) return fail("record --init takes --roster and --seat alone", 2);
  if (fs.existsSync(rosterPath)) {
    return fail(`record wrote nothing — --init on a roster that exists (${rosterPath})`, 1);
  }
  const lines = fs.readFileSync(path.join(TEMPLATES, "roster.md"), "utf8").split(/\r?\n/);
  const seats = tableByHeader(lines, SESSIONS_HEADER);
  lines.splice(seats.first, seats.end - seats.first);
  const events = sectionSpan(lines, "Events");
  const bullet = lines.findIndex((line, i) => i > events.start && line.startsWith("- "));
  if (bullet !== -1) lines.splice(bullet, events.end - bullet);
  const doc = { file: rosterPath, lines, eol: "\n" };
  const root = path.resolve(given(values, "root") || process.cwd());
  const written = [];
  const problems = seatValues.map((value) => writeSeatRow(doc, value, root, written)).filter(Boolean);
  if (problems.length > 0) {
    for (const problem of problems) fail(`record wrote nothing — it did not find ${problem}`, 1);
    return 1;
  }
  fs.mkdirSync(path.dirname(rosterPath), { recursive: true });
  writeDoc(doc);
  for (const line of written) console.log(line);
  return 0;
}

```

**P3.6** `skills/tanto/scripts/boundary.js` — replace exactly these 4 lines

```js
  const ledgerPath = given(values, "ledger");
  const batch = given(values, "batch");
  if (!ledgerPath) return fail("record needs --ledger", 2);
  if (!fs.existsSync(ledgerPath)) return fail(`record: --ledger ${ledgerPath} is not on disk`, 2);
```

**P3.6 →**

```js
  const ledgerPath = given(values, "ledger");
  const batch = given(values, "batch");
  if (values.init === true) return recordInit(values);
  // `--ledger` is needed by the flags that write the ledger and by no other
  // (spec 2.4): a bootstrap, a handover between plans, and a close's last
  // census have none. `--s-item` given `--roster` and no `--ledger` writes
  // the roster's own items table.
  const ledgerFlags = ["tasks", "state", "report", "verdict", "prompt", "progress", "deferred"];
  const pair = given(values, "kanri-reading") !== null && given(values, "jisso-reading") !== null;
  const itemsNeedLedger = values["s-item"].length > 0 && given(values, "roster") === null;
  const needLedger =
    ledgerFlags.some((name) => given(values, name) !== null) || values.event.length > 0 || pair || itemsNeedLedger;
  if (!ledgerPath && needLedger) return fail("record needs --ledger", 2);
  if (ledgerPath && !fs.existsSync(ledgerPath)) return fail(`record: --ledger ${ledgerPath} is not on disk`, 2);
```

**P3.7** `skills/tanto/scripts/boundary.js` — replace exactly these 5 lines

```js
  const seatFile = given(values, "seat");
  if (seatFile !== null && !fs.existsSync(seatFile)) {
    return fail(`record: --seat ${seatFile} is not on disk`, 2);
  }
  const seatRows = seatFile === null ? 0 : 1;
```

**P3.7 →**

```js
  // Each `--seat` is a spawn result file or a `sessionId` the state file
  // holds (spec 2.4), and `--succeeds` takes exactly one, a Kanri's.
  const root = path.resolve(given(values, "root") || process.cwd());
  const seatValues = values.seat.filter((value) => value !== true);
  const succeeds = given(values, "succeeds");
  if (succeeds !== null && seatValues.length !== 1) return fail("record --succeeds needs exactly one --seat", 2);
  const seatRows = seatValues.length;
```

**P3.8** `skills/tanto/scripts/boundary.js` — replace exactly this 1 line

```js
  const needRoster = kanri !== null || jisso !== null || rosterRows > 0;
```

**P3.8 →**

```js
  const rename = given(values, "rename");
  const itemsToRoster = ledgerPath === null && values["s-item"].length > 0;
  const rosterWrites = rename !== null || values["roster-event"].length > 0 || itemsToRoster;
  const needRoster = kanri !== null || jisso !== null || rosterRows > 0 || rosterWrites;
```

**P3.9** `skills/tanto/scripts/boundary.js` — replace exactly this 1 line

```js
  const ledger = readDoc(ledgerPath);
```

**P3.9 →**

```js
  const ledger = ledgerPath === null ? null : readDoc(ledgerPath);
```

**P3.10** `skills/tanto/scripts/boundary.js` — replace exactly this 1 line

```js
  for (const item of values["s-item"]) note(writeSItem(ledger, item, written));
```

**P3.10 →**

```js
  if (ledger !== null) {
    for (const item of values["s-item"]) note(writeSItem(ledger, item, written));
  }
```

**P3.11** `skills/tanto/scripts/boundary.js` — replace exactly this 1 line

```js
    if (seatFile !== null) note(writeSeatRow(roster, seatFile, written));
```

**P3.11 →**

```js
    for (const value of seatValues) note(writeSeatRow(roster, value, root, written));
    if (succeeds !== null && problems.length === 0) {
      note(writeSucceeds(roster, succeeds, seatValues[0], root, now, written));
    }
    if (rename !== null) note(writeRename(roster, rename, now, written));
    for (const text of values["roster-event"]) note(writeEvent(roster, text, null, now, written, "Events"));
    if (itemsToRoster) {
      const mismatch = headerMismatch(rosterPath, "roster.md", "Shoroku proposal items");
      if (mismatch) return fail(mismatch, 1);
      for (const item of values["s-item"]) note(writeSItem(roster, item, written));
    }
```

**P3.12** `skills/tanto/scripts/boundary.js` — replace exactly this 1 line

```js
  writeDoc(ledger);
```

**P3.12 →**

```js
  if (ledger !== null) writeDoc(ledger);
```

- [ ] **Step 4: Run the boundary suite to verify it passes**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: every test passes.

- [ ] **Step 5: Run the whole suite**

Run it in the background with its output in a file, and read the file
after the completion notice; a run cut at a timeout is no result.

```bash
node --test skills/tanto/scripts/*.test.js > .tanto/roster-ledger/suite-task-3.txt 2>&1
```

Expected: exit 0, and the file's last lines report no failed test.

- [ ] **Step 6: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 3
```

Expected: `task 3: verify clean`.

- [ ] **Step 7: Run lint on the task's own paths**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: lint passes with no file changed.

- [ ] **Step 8: Commit**

```bash
git commit --only -m "feat: record writes --seat by sessionId, --init, --succeeds, --rename, and --roster-event, and needs --ledger for the ledger alone" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: one commit.

### Task 4: `S-n` and the direction: the three-field `--s-item`, the duplicate-number refusal, `--direction`, `--written`, `--written-feedback`

Spec 2.5 and 2.6, and 2.1's last sentence. `--s-item "<source> |
<destination> | <item>"` splits on the first two unescaped pipes, writes
an empty destination `—`, and reads a two-field value as source and item;
before any row is written every `S-n` cell is read, and a number the table
holds twice is refused with `an S-n table with no number used twice (S-28
twice)`; the dedup on Source and Item stays, and the row is written in the
template's six columns, so `sItemCells`'s fixed map, `RETIRED_COLUMN`, and
`"t2"` go. `record --direction <path>` writes each `## Items` line's `yes`
or `no` into the Adopted cell of its `S-n` row, prints an `(inbox …)` line
as `direction: no S-n — <line>` and a line the table does not hold, or
another topic's, as `direction: unmatched — <line>`, and refuses a file
that matches no `S-n` line with `direction: nothing matched — <path>`;
`--written "<subject>" [--only S-a,…]` writes the subject into the adopted
rows whose Written is `no`, skipping a row whose Destination is exactly
`feedback`; and `--written-feedback "<basename>"` writes
`feedback <basename>` into those rows. All three need `--ledger` and the
items table's header check. After this task, the close's write-back is
three commands and no hand edit.

**Files:**

- Modify: `skills/tanto/scripts/boundary.js` — `RETIRED_COLUMN`,
  `sItemCells`, and `writeSItem` replaced by `sItemFields` and
  `writeSItem`; `itemsTable`, `sRowAt`, `writeDirection`, `fillWritten`,
  `writeWritten`, and `writeWrittenFeedback` before `writeProgress`;
  `cmdRecord`'s write-back after its Progress line.
- Test: `skills/tanto/scripts/boundary.test.js` — four tests after
  `itemsLedger`.

**Interfaces:**

- Consumes: Task 1's `headerMismatch` and `cells`/`row` escape; Task 1's
  `templates/shoroku-direction.md`, whose Items lines the direction test
  builds its file from; Task 3's nullable `ledger`; `itemsLedger` on `main`
  already.
- Produces: `sItemFields(value)`; `writeSItem(doc, value, written)`,
  whose refusals Task 3's roster `--s-item` shares;
  `writeDirection`, `writeWritten`, `writeWrittenFeedback`; the printed
  lines `direction: no S-n — <line>` and `direction: unmatched — <line>`,
  which `roles/kanri.md`'s Check step and landing read (Task 16).

**Named-mechanism sites** (`git grep` at the base).

- The three-field `--s-item`: `templates/boundary-brief.md`'s `record`
  call and `roles/kanri.md` loop step 6 (Task 6); `templates/kanri.md`'s
  `S-n` prose (Task 1); `roles/kanri.md`'s other `--s-item` sentences,
  "The handover, in a plan and between plans" and "A seat's exit"
  (Tasks 15 and 16).
- `--direction`, `--written`, `--only`, `--written-feedback`, and
  `feedback <basename>`: `roles/kanri.md`'s Check step, step 4's
  write-back, and the landing (Task 16); `templates/shoki-brief.md`,
  which spec 2.6 says names these, writes no ledger cell at the base ("The
  ledger is Kanri's") and needs no change; `templates/kanri.md`'s Written
  paragraph, unchanged.
- The direction file's grammar: `templates/shoroku-direction.md` (Task 1).

**O4.5** `Stag[e]` — the retired column's test (spec 2.1; the Old values' `Stag[e]`); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0. Task 5's `migrate` spells the column in two parts.

**O4.6** `RETIRED_COLUMN` — the retired column's constant (spec 2.1); before: 2 in `skills/tanto/scripts/boundary.js`, after: 0.

**O4.7** `"t2"` — the retired column's value (spec 2.1); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O4.8** `sItemCells` — the fixed map by header (spec 2.1); before: 2 in `skills/tanto/scripts/boundary.js`, after: 0.

**O4.9** `Destination: "",` — the blank destination (spec 2.5); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O4.10** `String(item).split("|")` — the two-field split on any pipe (spec 2.5); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**A4.11** `skills/tanto/scripts/boundary.js` — `grep -c "writeDirection(" skills/tanto/scripts/boundary.js` — before: 0, after: 2

**A4.12** `skills/tanto/scripts/boundary.test.js` — `grep -c "directionFile(" skills/tanto/scripts/boundary.test.js` — before: 0, after: 4

- [ ] **Step 1: Write the failing tests**

Apply P4.1: the three-field and duplicate-number tests, and the
`--direction` and `--written` tests over a direction file built from the
template, after `itemsLedger`.

**P4.1** `skills/tanto/scripts/boundary.test.js` — insert after these 2 lines

```js
  return { dir, ledger: write(dir, "kanri.md", body) };
}
```

**P4.1 →**

```js

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
```


- [ ] **Step 2: Run the boundary tests to verify they fail**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: FAIL — the four new tests: today's `--s-item` writes the second
field as the item and a blank destination, numbers past a used number,
and `--direction`, `--written`, and `--written-feedback` do not exist. The
other tests pass.

- [ ] **Step 3: Split the item on three fields, refuse a used number, and write the direction back**

Apply P4.2 to P4.4.

**P4.2** `skills/tanto/scripts/boundary.js` — replace exactly these 58 lines

```js
/**
 * The seventh column of an `S-n` table, which a ledger or a roster opened
 * before it was retired keeps (spec 3.5). Spelled with one bracketed
 * character, as the consistency note's check 7 spells every retired string.
 */
const RETIRED_COLUMN = /^Stag[e]$/;

/** An `S-n` row's cells, one per column the table's own header names. */
function sItemCells(header, number, source, text) {
  const byColumn = {
    "S-n": `S-${number}`,
    Source: source,
    Item: text,
    Destination: "",
    Adopted: "pending",
    Written: "no",
  };
  return header.map((column) => {
    if (Object.hasOwn(byColumn, column)) return byColumn[column];
    return RETIRED_COLUMN.test(column) ? "t2" : "";
  });
}

/**
 * One `S-n` row, numbered from the table's highest existing `S-n`, so that a
 * `pending` row a Kanri exit wrote there since the last boundary is counted
 * and not overwritten, and written by the header it finds: six cells, or
 * seven with `t2` in the retired column, nothing migrated. A row with the
 * same Source and Item is already there.
 */
function writeSItem(doc, item, written) {
  const span = sectionSpan(doc.lines, "Shoroku proposal items");
  if (!span) return "the ledger's Shoroku proposal items table";
  const table = tableSpan(doc.lines, span);
  if (!table) return "the ledger's Shoroku proposal items table";
  const parts = String(item).split("|");
  const source = parts[0].trim();
  const text = parts.slice(1).join("|").trim();
  let highest = 0;
  const placeholders = [];
  for (let i = table.first; i < table.end; i++) {
    const current = cells(doc.lines[i]);
    if (current[1] === source && current[2] === text) {
      // Already recorded. Print the row as it stands, so that a re-run
      // with the same arguments prints the same rows as the first run.
      written.push(doc.lines[i]);
      return null;
    }
    const found = /^S-(\d+)$/.exec(current[0]);
    if (found) highest = Math.max(highest, Number(found[1]));
    if (current[0] === "(no item yet)") placeholders.push(i);
  }
  const line = row(sItemCells(cells(doc.lines[table.header]), highest + 1, source, text));
  doc.lines.splice(table.end, 0, line);
  for (const i of placeholders.reverse()) doc.lines.splice(i, 1);
  written.push(line);
  return null;
}
```

**P4.2 →**

```js
/**
 * An `--s-item` value's three fields, split on its first two unescaped
 * pipes (spec 2.5): the source, the destination, and the item, a `\|` in
 * any of them read back as `|`. A two-field value — from a brief rendered
 * before the destination field — is the source and the item; an empty or
 * absent destination is written `—`.
 */
function sItemFields(value) {
  const parts = String(value).split(/(?<!\\)\|/);
  if (parts.length < 2) return null;
  const field = (part) => part.trim().replace(/\\\|/g, "|");
  const [source, ...rest] = parts;
  if (rest.length === 1) return { source: field(source), destination: "—", item: field(rest[0]) };
  return { source: field(source), destination: field(rest[0]) || "—", item: field(rest.slice(1).join("|")) };
}

/**
 * One `S-n` row, in the template's six columns — the header `record`
 * compared before it wrote — numbered from the table's highest `S-n`, so
 * that a `pending` row a Kanri exit wrote there since the last boundary is
 * counted and not overwritten (spec 2.5). Before any row is written every
 * `S-n` cell is read, and a number the table holds twice is refused, so
 * that a table a hand edit collided is repaired once and never grows. A row
 * with the same Source and Item is already there. The ledger's table and,
 * between plans, the roster's are written alike.
 */
function writeSItem(doc, value, written) {
  const span = sectionSpan(doc.lines, "Shoroku proposal items");
  const table = span ? tableSpan(doc.lines, span) : null;
  if (!table) return "the Shoroku proposal items table";
  const fields = sItemFields(value);
  if (!fields) return `an --s-item "<source> | <destination> | <item>" (got ${value})`;
  const numbers = new Set();
  let highest = 0;
  let same = null;
  const placeholders = [];
  for (let i = table.first; i < table.end; i++) {
    const current = cells(doc.lines[i]);
    const found = /^S-(\d+)$/.exec(current[0]);
    if (found) {
      const number = Number(found[1]);
      if (numbers.has(number)) return `an S-n table with no number used twice (S-${number} twice)`;
      numbers.add(number);
      highest = Math.max(highest, number);
    }
    if (current[0] === "(no item yet)") placeholders.push(i);
    if (current[1] === fields.source && current[2] === fields.item) same = i;
  }
  if (same !== null) {
    // Already recorded. Print the row as it stands, so that a re-run with
    // the same arguments prints the same rows as the first run.
    written.push(doc.lines[same]);
    return null;
  }
  const line = row([`S-${highest + 1}`, fields.source, fields.item, fields.destination, "pending", "no"]);
  doc.lines.splice(table.end, 0, line);
  for (const i of placeholders.reverse()) doc.lines.splice(i, 1);
  written.push(line);
  return null;
}
```

**P4.3** `skills/tanto/scripts/boundary.js` — insert before these 2 lines

```js
/** The Progress section's body, replaced whole by the one line. */
function writeProgress(doc, text, written) {
```

**P4.3 →**

```js
/** The ledger's items table, or null. */
function itemsTable(doc) {
  const span = sectionSpan(doc.lines, "Shoroku proposal items");
  return span ? tableSpan(doc.lines, span) : null;
}

/** The line of the items row whose S-n cell is `label`, or -1. */
function sRowAt(doc, table, label) {
  for (let i = table.first; i < table.end; i++) {
    if (cells(doc.lines[i])[0] === label) return i;
  }
  return -1;
}

/**
 * `--direction <path>` (spec 2.6): the direction file's `## Items` lines,
 * each matched on `— yes|no — <topic> S-<n>` at its end, written into the
 * Adopted cell of that `S-n` row of this ledger, whose title names the
 * topic. A line whose pointer is `(inbox …)` is expected and printed
 * `direction: no S-n — <line>`; a line whose `S-n` the table does not hold,
 * or another topic's, is printed `direction: unmatched — <line>`, and the
 * pass goes on. A file whose Items match no `S-n` line at all earns
 * `direction: nothing matched — <path>`, which the caller refuses with.
 */
function writeDirection(doc, file, written) {
  let lines;
  try {
    lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  } catch {
    return `a direction file at ${file}`;
  }
  const items = sectionSpan(lines, "Items");
  const table = itemsTable(doc);
  if (!items || !table) return `the Items section of ${file} and the ledger's Shoroku proposal items table`;
  const title = /^# Conductor ledger — (\S+)$/.exec((doc.lines[0] || "").trim());
  const topic = title && !title[1].startsWith("<") ? title[1] : null;
  let matched = 0;
  for (let i = items.start + 1; i < items.end; i++) {
    const line = lines[i].trim();
    if (!line.startsWith("- ")) continue;
    const found = /— (yes|no) — (\S+) S-(\d+)$/.exec(line);
    if (!found) {
      written.push(`direction: ${line.includes("(inbox ") ? "no S-n" : "unmatched"} — ${line}`);
      continue;
    }
    const at = topic !== null && found[2] !== topic ? -1 : sRowAt(doc, table, `S-${found[3]}`);
    if (at === -1) {
      written.push(`direction: unmatched — ${line}`);
      continue;
    }
    matched++;
    const current = cells(doc.lines[at]);
    current[4] = found[1];
    doc.lines[at] = row(current);
    written.push(doc.lines[at]);
  }
  return matched === 0 ? `direction: nothing matched — ${file}` : null;
}

/**
 * `value` into the Written cell of each adopted row `wanted` picks whose
 * Written is `no` — or is `value` already, printed again, so that a second
 * call changes nothing and prints the same.
 */
function fillWritten(doc, table, wanted, value, written) {
  for (let i = table.first; i < table.end; i++) {
    const current = cells(doc.lines[i]);
    if (!/^S-\d+$/.test(current[0]) || current[4] !== "yes" || !wanted(current)) continue;
    if (current[5] !== "no" && current[5] !== value) continue;
    current[5] = value;
    doc.lines[i] = row(current);
    written.push(doc.lines[i]);
  }
  return null;
}

/**
 * `--written "<subject>" [--only S-a,S-b,…]` (spec 2.6): the commit subject
 * into the adopted rows whose Written is `no`, a row whose Destination is
 * exactly `feedback` skipped; with `--only`, the rows named and no other —
 * how shusei's subject reaches the `fix` rows and shoki's the rest.
 */
function writeWritten(doc, subject, only, written) {
  const table = itemsTable(doc);
  if (!table) return "the ledger's Shoroku proposal items table";
  const named = only === null ? null : only.split(",").map((part) => part.trim());
  for (const label of named || []) {
    if (sRowAt(doc, table, label) === -1) return `an S-n row for ${label}`;
  }
  const wanted = (current) => current[3] !== "feedback" && (named === null || named.includes(current[0]));
  return fillWritten(doc, table, wanted, subject, written);
}

/**
 * `--written-feedback "<basename>"` (spec 2.6): `feedback <basename>` into
 * the adopted rows whose only destination is `feedback`, once `usage.js
 * close` has placed the file, never while it holds it.
 */
function writeWrittenFeedback(doc, basename, written) {
  const table = itemsTable(doc);
  if (!table) return "the ledger's Shoroku proposal items table";
  return fillWritten(doc, table, (current) => current[3] === "feedback", `feedback ${basename}`, written);
}

```

**P4.4** `skills/tanto/scripts/boundary.js` — insert after these 2 lines

```js
  const progress = given(values, "progress");
  if (progress !== null) note(writeProgress(ledger, progress, written));
```

**P4.4 →**

```js
  // The close's write-back (spec 2.6): the direction file's answers into
  // Adopted, and the commit subjects and the feedback file into Written.
  const direction = given(values, "direction");
  const subject = given(values, "written");
  const feedback = given(values, "written-feedback");
  if (direction !== null || subject !== null || feedback !== null) {
    if (ledger === null) return fail("record needs --ledger for --direction, --written, or --written-feedback", 2);
    const mismatch = headerMismatch(ledgerPath, "kanri.md", "Shoroku proposal items");
    if (mismatch) return fail(mismatch, 1);
    if (direction !== null) {
      const refusal = writeDirection(ledger, direction, written);
      if (refusal?.startsWith("direction: ")) return fail(refusal, 1);
      note(refusal);
    }
    if (subject !== null) note(writeWritten(ledger, subject, given(values, "only"), written));
    if (feedback !== null) note(writeWrittenFeedback(ledger, feedback, written));
  }
```

- [ ] **Step 4: Run the boundary suite to verify it passes**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: every test passes.

- [ ] **Step 5: Run the whole suite**

Run it in the background with its output in a file, and read the file
after the completion notice; a run cut at a timeout is no result.

```bash
node --test skills/tanto/scripts/*.test.js > .tanto/roster-ledger/suite-task-4.txt 2>&1
```

Expected: exit 0, and the file's last lines report no failed test.

- [ ] **Step 6: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 4
```

Expected: `task 4: verify clean`.

- [ ] **Step 7: Run lint on the task's own paths**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: lint passes with no file changed.

- [ ] **Step 8: Commit**

```bash
git commit --only -m "feat: record takes a three-field --s-item, refuses a used S-n number, and writes the direction back with --direction and --written" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: one commit.

### Task 5: `boundary.js migrate`

Spec 1.4, and the fixtures "What the plan must contain" names.
`boundary.js migrate --roster <path> --archive <path> [--ledger <path>]
[--now <YYYY-MM-DD>]` brings each file to its template's shape once,
reading the headers from the skill's own `templates/` as `record` does.
For the roster it finds the sessions table by its header's first cells and
the readings table by its own, joins each reading row into the last
sessions row that carries the same Name cell — the one join by name this
design makes — writes the twenty-column header, drops the readings
heading, table, and prose, moves every `cleared` row to the archive with
Ended the `--now` day, prints each row it wrote, prints
`unplaced: <role> <name> — no sessions row carries that name` for a
reading it could not place and `suspect: <role> <name> — Transcript <cell>`
for a `live` or `queued` row whose Transcript cell is not `<uuid>.jsonl`,
and brings the items table's `Candidate` and retired columns to the
template's. For the archive it creates the file from
`templates/roster-archive.md` when it is absent, and otherwise brings each
table directly under `## Sessions` to the 21 columns in place, Topic, cwd,
Effort, Mode, and Transcript `—`. For the ledger it renames `Candidate`,
drops the retired column, moving no value, and prints `missing row:` for a
Measurements table without the opening's row. Before it rewrites a file it
keeps one copy, `<path>.pre-migrate`, written once; a file already in its
template's shape prints `migrate: <path> is current`; and a shape it does
not recognize writes nothing to any file, prints
`migrate: <path> — unknown shape: <what it found>`, and exits 1.

The live archive is not the one sixteen-column table the spec measured: a
copy of `.tanto/roster-archive.md` at this plan's writing holds a
fifteen-column table (no Context) and a sixteen-column one under
`## Sessions`, and a closed plan's own section after `## Events` for each
plan since, with `### Sessions` and `### Residency readings` tables. So
`migrate` brings both `## Sessions` tables to 21 columns in place, Context
`—` where a row had none, and leaves every closed plan's section as
history; a moved row is appended after the last table under
`## Sessions`. Run over copies of the live roster, archive, and ledger,
this task's code wrote every roster row with its reading, printed no
`unplaced:` or `suspect:` line, brought both archive tables to 21 columns,
found the ledger current, and on a second run found all three current. After this task, the plan's own
roster can be migrated at batch A's boundary (Global Constraint 1).

**Files:**

- Modify: `skills/tanto/scripts/boundary.js` — `RETIRED_ITEMS_COLUMN`,
  `sameCells`, `separator`, `repairItems`, `migrateRoster`,
  `migrateArchive`, `sessionsEnd`, `archiveFromTemplate`, and `cmdMigrate`
  after `cmdBeat`; `main`'s `migrate` line after its `record` line.
- Test: `skills/tanto/scripts/boundary.test.js` — `OLD_READINGS`,
  `STALE_ID`, `HISTORY_ROW`, `separatorOf`, `oldShapes`, `migrate`, and
  three tests before the items-table comment.

**Interfaces:**

- Consumes: Task 1's `headerAt`, `templateHeader`, `SESSIONS_HEADER`,
  `TEMPLATES`, `transcriptProblem`, and the escape; Task 1's twenty- and
  21-column templates; `readDoc`, `writeDoc`, `sectionSpan`, `tableSpan`,
  and `MEASUREMENT_ROW` on `main` already; the tests' `OLD_NAME`,
  `KANRI_ID`, `JISSO_ID`, and `KEIKAKU_ID` (Task 1), and `RETIRED` and
  `itemsLedger` on `main`.
- Produces: `cmdMigrate` and its printed lines, which Global Constraint 1
  and the README's "Moving a run" (Task 18) name; `archiveFromTemplate(file)`
  and `sessionsEnd(lines)`, which Task 9's `archive` can use to create the
  archive and to find where a moved row goes; `repairItems`,
  `sameCells`, and `separator`.

**Named-mechanism sites** (`git grep` at the base).

- The subcommand list: `boundary.js`'s header comment ("Seven
  subcommands") and its usage line, and the "unknown subcommand" test,
  are Task 9's, which lists every subcommand `migrate` among them; this
  task adds `main`'s dispatch line alone. `SKILL.md`'s scripts paragraph
  (Task 13); the README's "Moving a run" (Task 18).
- The `migrate` line every refusal ends with: Task 1's header check and
  census line, Task 8's `roster show`, Task 9's `archive`.
- The `cleared` rows `migrate` moves: `tanto.js`'s `oldShapeLine` (Task 11),
  `roster show`'s `cleared:` line (Task 8), the Release row (Task 15).

**O5.4** `check|record|census|request|seat|wake|beat <options>` — the usage line without `migrate`; before: 1 in `skills/tanto/scripts/boundary.js`, after: 1 — it stays for Task 9, which lists every subcommand.

**O5.5** `Seven subcommands` — the header comment's count; before: 1 in `skills/tanto/scripts/boundary.js`, after: 1 — it stays for Task 9, as O5.4.

**A5.6** `skills/tanto/scripts/boundary.js` — `grep -c "cmdMigrate(" skills/tanto/scripts/boundary.js` — before: 0, after: 2

**A5.7** `skills/tanto/scripts/boundary.test.js` — `grep -c "oldShapes()" skills/tanto/scripts/boundary.test.js` — before: 0, after: 5

- [ ] **Step 1: Write the failing tests**

Apply P5.1: the fixtures in today's two-table roster shape with a reading
under a stale name, a `cleared` row, and a Transcript cell missing its
separators; an archive with the fifteen- and sixteen-column tables under
`## Sessions` and a closed plan's section after them; and a ledger with
the `Candidate` and retired columns — and the three `migrate` tests.

**P5.1** `skills/tanto/scripts/boundary.test.js` — insert before these 2 lines

```js
// The two shapes of a proposal items table: the six columns the templates
// carry, and the seven a ledger opened before the retired column went keeps.
```

**P5.1 →**

```js
// `migrate` (spec 1.4): today's two-table roster, the 16-column archive, and
// an older ledger, the retired strings spelled in two parts so that a sweep
// for them finds none here.
const OLD_READINGS = ["## Resid", "ency"].join("");
const STALE_ID = "1f1f1f1f-0000-4000-8000-000000000001";
// A closed plan's own section of the archive: history, which migrate leaves as it stands.
const HISTORY_ROW = [
  `| Role | ${OLD_NAME} | Model | Branch | Started | Ended | Status | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |`,
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  "| jisso | jisso-h | sonnet | t | 2026-10-01 | 2026-10-02 | stopped | batch B | 1 | 2 | 3 | 0 | context=4 | — | — | — |",
].join("\n");

/** A separator row for `n` columns. */
function separatorOf(n) {
  return `|${" --- |".repeat(n)}`;
}

/** A root holding today's two-table roster, the 16-column archive, and an older ledger. */
function oldShapes() {
  const dir = tmpDir();
  const transcript = (id) => `/home/u/${id}.jsonl`;
  const roster = [
    "# tanto roster",
    "",
    "## Keeping rule",
    "",
    "- One row per seat.",
    "",
    `| Role | Topic | ${OLD_NAME} | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript |`,
    separatorOf(11),
    `| kanri | — | kanri-a | /repo | sonnet | high | main | auto | 2026-10-07 09:00 | live | ${transcript(KANRI_ID)} |`,
    `| sekkei | t | sekkei-b | /repo | fable | high | t | auto | 2026-10-07 10:00 | stopped | ${transcript(JISSO_ID)} |`,
    `| kikaku | — | kikaku-c | /repo | fable | xhigh | main | auto | 2026-10-06 09:00 | cleared | ${transcript(KEIKAKU_ID)} |`,
    // The f07a path: an inline script collapsed the separators.
    `| kanri | — | kanri-d | /repo | sonnet | high | main | auto | 2026-10-07 11:00 | live | C:Users0000105523.claude${STALE_ID}.jsonl |`,
    "",
    OLD_READINGS,
    "",
    `| Role | Topic | ${OLD_NAME} | Since | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |`,
    separatorOf(13),
    "| kanri | — | kanri-a | 2026-10-07 | batch A | 1 | 2 | 3 | 0 | context=4 | 1 | 0 | 0 |",
    "| sekkei | t | sekkei-b | 2026-10-07 | plan close | 5 | 6 | 7 | 1 | context=8 | — | — | — |",
    // A reading under a name no sessions row carries any more: the seat was renamed since.
    "| jisso | t | jisso-old-name | 2026-10-07 | batch A | 9 | 9 | 9 | 0 | context=9 | — | — | — |",
    "",
    "One row per session of the current run.",
    "",
    "## Shoroku proposal items",
    "",
    "| S-n | Source | Candidate | Destination | Adopted | Written |",
    separatorOf(6),
    "| (no item yet) | | | | | |",
    "",
    "## Events",
    "",
    "- 2026-10-07 09:00 — a line",
    "",
  ];
  const archive = [
    "# tanto roster archive",
    "",
    "## Sessions",
    "",
    // The rows before 2026-09-14, with no Context column.
    `| Role | ${OLD_NAME} | Model | Branch | Started | Ended | Status | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |`,
    separatorOf(15),
    "| sekkei | sekkei-w | fable | t | 2026-09-06 | 2026-09-07 | stopped | batch A | 1 | 2 | 3 | 0 | — | — | — |",
    "",
    "Rows below this point carry a Context column.",
    "",
    `| Role | ${OLD_NAME} | Model | Branch | Started | Ended | Status | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |`,
    separatorOf(16),
    "| jisso | jisso-x | sonnet | t | 2026-09-14 | 2026-09-15 | stopped | batch A | 1 | 2 | 3 | 0 | context=4 | — | — | — |",
    "",
    "## Events",
    "",
    "- 2026-09-15 09:00 — an old line",
    "",
    "## t — moved from `roster.md` at the plan's close, 2026-10-02",
    "",
    "### Sessions",
    "",
    HISTORY_ROW,
    "",
  ];
  const ledger = itemsLedger(["S-n", "Source", "Candidate", "Destination", "Adopted", RETIRED, "Written"]).ledger;
  const items = fs
    .readFileSync(ledger, "utf8")
    .replace("| (no item yet) | | | | | | |", "| S-1 | a.md item 1 | b | issues | pending | t2 | no |");
  fs.writeFileSync(ledger, items, "utf8");
  return {
    dir,
    roster: write(dir, "roster.md", roster.join("\n")),
    archive: write(dir, "roster-archive.md", archive.join("\n")),
    ledger,
  };
}

function migrate(f, ...extra) {
  return run(
    ["migrate", "--roster", f.roster, "--archive", f.archive, "--ledger", f.ledger, "--now", "2026-10-08", ...extra],
    f.dir,
  );
}

test("migrate joins each reading into the row that carries its name, moves the cleared rows, and prints its unplaced and suspect rows (spec 1.4)", () => {
  const f = oldShapes();
  const originals = [f.roster, f.archive, f.ledger].map((file) => fs.readFileSync(file, "utf8"));
  const got = migrate(f);
  assert.strictEqual(got.code, 0, got.err);
  const roster = fs.readFileSync(f.roster, "utf8");
  const header = fs
    .readFileSync(path.join(TANTO, "templates", "roster.md"), "utf8")
    .split(/\r?\n/)
    .find((line) => line.startsWith("| Role |"));
  assert.ok(roster.includes(`${header}\n${separatorOf(20)}\n`), roster);
  const joined = `| kanri | — | kanri-a | /repo | sonnet | high | main | auto | 2026-10-07 09:00 | live | /home/u/${KANRI_ID}.jsonl | batch A | 1 | 2 | 3 | 0 | context=4 | 1 | 0 | 0 |`;
  assert.ok(roster.includes(joined), roster);
  assert.ok(got.out.includes(`${joined}\n`), got.out);
  assert.ok(
    roster.includes(`/home/u/${JISSO_ID}.jsonl | plan close | 5 | 6 | 7 | 1 | context=8 | — | — | — |`),
    roster,
  );
  assert.ok(roster.includes(`C:Users0000105523.claude${STALE_ID}.jsonl | — | — | — | — | — | — | — | — | — |`), roster);
  assert.ok(
    got.out.includes(`suspect: kanri kanri-d — Transcript C:Users0000105523.claude${STALE_ID}.jsonl\n`),
    got.out,
  );
  assert.ok(got.out.includes("unplaced: jisso jisso-old-name — no sessions row carries that name\n"), got.out);
  assert.ok(
    !roster.includes(OLD_READINGS) && !roster.includes("One row per session") && !roster.includes("kikaku-c"),
    roster,
  );
  assert.ok(roster.includes("| S-n | Source | Item | Destination | Adopted | Written |"), roster);
  assert.ok(roster.includes("- 2026-10-07 09:00 — a line"), roster);
  const archive = fs.readFileSync(f.archive, "utf8");
  const moved = `| kikaku | — | kikaku-c | /repo | fable | xhigh | main | auto | 2026-10-06 09:00 | cleared | /home/u/${KEIKAKU_ID}.jsonl | — | — | — | — | — | — | — | — | — | 2026-10-08 |`;
  assert.ok(archive.includes(moved), archive);
  const widened =
    "| jisso | — | jisso-x | — | sonnet | — | t | — | 2026-09-14 | stopped | — | batch A | 1 | 2 | 3 | 0 | context=4 | — | — | — | 2026-09-15 |";
  assert.ok(archive.includes(widened), archive);
  const older =
    "| sekkei | — | sekkei-w | — | fable | — | t | — | 2026-09-06 | stopped | — | batch A | 1 | 2 | 3 | 0 | — | — | — | — | 2026-09-07 |";
  assert.ok(archive.includes(older), archive);
  assert.ok(archive.includes(HISTORY_ROW), archive);
  // The cleared row lands after the last row of the last table under Sessions.
  assert.ok(
    archive.indexOf(widened) < archive.indexOf(moved) && archive.indexOf(moved) < archive.indexOf("## Events"),
    archive,
  );
  const ledger = fs.readFileSync(f.ledger, "utf8");
  assert.ok(ledger.includes("| S-n | Source | Item | Destination | Adopted | Written |"), ledger);
  assert.ok(ledger.includes("| S-1 | a.md item 1 | b | issues | pending | no |"), ledger);
  assert.ok(
    got.out.includes(`missing row: ${f.ledger} — Measurements has no "Kanri's context at the topic's opening" row\n`),
    got.out,
  );
  // One copy of each file as it was, kept beside it.
  [f.roster, f.archive, f.ledger].forEach((file, i) => {
    assert.strictEqual(fs.readFileSync(`${file}.pre-migrate`, "utf8"), originals[i]);
  });
  // `record` reads the migrated roster.
  assert.strictEqual(run(["record", "--roster", f.roster, "--status", `${KANRI_ID} live`], f.dir).code, 0);
});

test("migrate run twice finds every file current, keeps its first copies, and writes nothing (spec 1.4)", () => {
  const f = oldShapes();
  const originals = [f.roster, f.archive, f.ledger].map((file) => fs.readFileSync(file, "utf8"));
  assert.strictEqual(migrate(f).code, 0);
  const after = [f.roster, f.archive, f.ledger].map((file) => fs.readFileSync(file, "utf8"));
  const again = migrate(f);
  assert.strictEqual(again.code, 0, again.err);
  for (const file of [f.roster, f.archive, f.ledger]) {
    assert.ok(again.out.includes(`migrate: ${file} is current\n`), again.out);
  }
  [f.roster, f.archive, f.ledger].forEach((file, i) => {
    assert.strictEqual(fs.readFileSync(file, "utf8"), after[i]);
    assert.strictEqual(fs.readFileSync(`${file}.pre-migrate`, "utf8"), originals[i]);
  });
});

test("migrate creates an absent archive from the template, and on a shape it does not know writes nothing and exits 1 (spec 1.4)", () => {
  const f = oldShapes();
  fs.rmSync(f.archive);
  const got = migrate(f);
  assert.strictEqual(got.code, 0, got.err);
  assert.ok(got.out.includes(`migrate: ${f.archive} created from templates/roster-archive.md\n`), got.out);
  const archive = fs.readFileSync(f.archive, "utf8");
  assert.ok(archive.includes("| Role | Topic | Name | cwd |") && archive.includes("| cleared |"), archive);
  assert.ok(!archive.includes("<role>") && !archive.includes("- <YYYY-MM-DD>"), archive);
  const odd = oldShapes();
  const text = fs.readFileSync(odd.roster, "utf8").replace("| Role | Topic |", "| Role | Who |");
  fs.writeFileSync(odd.roster, text, "utf8");
  const before = [odd.roster, odd.archive, odd.ledger].map((file) => fs.readFileSync(file, "utf8"));
  const refused = migrate(odd);
  assert.strictEqual(refused.code, 1);
  assert.ok(
    refused.out.startsWith(`migrate: ${odd.roster} — unknown shape: a seats header | Role | Who |`),
    refused.out,
  );
  [odd.roster, odd.archive, odd.ledger].forEach((file, i) => {
    assert.strictEqual(fs.readFileSync(file, "utf8"), before[i]);
    assert.ok(!fs.existsSync(`${file}.pre-migrate`), file);
  });
  assert.strictEqual(run(["migrate", "--roster", odd.roster], odd.dir).code, 2);
});

```


- [ ] **Step 2: Run the boundary tests to verify they fail**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: FAIL — the three `migrate` tests, on `boundary.js: usage:`
(exit 2): the subcommand does not exist. The other tests pass.

- [ ] **Step 3: Write `migrate`**

Apply P5.2 and P5.3.

**P5.2** `skills/tanto/scripts/boundary.js` — insert after these 3 lines

```js
  console.log(line);
  return line === "spawner: beating" ? 0 : 1;
}
```

**P5.2 →**

```js

/** The items column a ledger opened before its retirement keeps, in two parts so that a sweep for it finds none. */
const RETIRED_ITEMS_COLUMN = ["Stag", "e"].join("");

/** Two cell lists, compared cell for cell. */
function sameCells(a, b) {
  return a.length === b.length && a.every((cell, i) => cell === b[i]);
}

/** A table's separator row for `n` columns. */
function separator(n) {
  return `|${" --- |".repeat(n)}`;
}

/**
 * A Shoroku proposal items table brought to its template's header (spec
 * 1.4): the pre-rename `Candidate` column named `Item`, and the retired
 * column dropped with its cells, no value moved. Returns whether it
 * changed, or the shape it could not place.
 */
function repairItems(lines, template) {
  const at = headerAt(lines, "Shoroku proposal items");
  if (at === null) return { changed: false };
  const expected = cells(templateHeader(template, "Shoroku proposal items"));
  const header = cells(lines[at]);
  if (sameCells(header, expected)) return { changed: false };
  const renamed = header.map((cell) => (cell === "Candidate" ? "Item" : cell));
  const drop = renamed.indexOf(RETIRED_ITEMS_COLUMN);
  const keep = (list) => list.filter((_, i) => i !== drop);
  if (!sameCells(keep(renamed), expected)) return { unknown: `an items header ${lines[at].trim()}` };
  lines[at] = row(expected);
  lines[at + 1] = separator(expected.length);
  for (let i = at + 2; i < lines.length && lines[i].startsWith("|"); i++) lines[i] = row(keep(cells(lines[i])));
  return { changed: true };
}

/**
 * The roster brought to the template's one table (spec 1.4). The sessions
 * table is found by its header's first cells and the readings table by its
 * own — `Since` in its fourth — and each reading row is joined into the
 * last sessions row that carries the same Name cell: the one join by name
 * this design makes, because the old shape has no other key, and the last.
 * A reading no row carries is printed `unplaced:`; a `cleared` row moves to
 * the archive as it stands, Ended `today`; a `live` or `queued` row whose
 * Transcript cell is not `<uuid>.jsonl` is printed `suspect:` and left as
 * it stands. The readings heading, table, and prose go.
 */
function migrateRoster(doc, today) {
  const lines = doc.lines;
  const out = [];
  const items = repairItems(lines, "roster.md");
  if (items.unknown) return { unknown: items.unknown };
  const at = headerAt(lines, null);
  if (at === null) return { unknown: "no seats table" };
  const header = cells(lines[at]);
  const readingsAt = () => lines.findIndex((line) => line.startsWith("| Role |") && cells(line)[3] === "Since");
  const expected = cells(SESSIONS_HEADER);
  if (sameCells(header, expected) && readingsAt() === -1) return { changed: items.changed, out, moved: [] };
  const old = header.length === 11 && header[1] === "Topic" && header[3] === "cwd" && header[10] === "Transcript";
  if (!old) return { unknown: `a seats header ${lines[at].trim()}` };
  const blank = (cell) => (cell === "" ? "—" : cell);
  const sessions = [];
  for (let i = at + 2; i < lines.length && lines[i].startsWith("|"); i++) {
    const current = cells(lines[i]).slice(0, 11);
    while (current.length < 11) current.push("—");
    sessions.push({ cells: current.map(blank), reading: null });
  }
  const readings = readingsAt();
  for (let i = readings + 2; readings !== -1 && i < lines.length && lines[i].startsWith("|"); i++) {
    const reading = cells(lines[i]);
    const target = sessions.filter((s) => s.cells[2] === reading[2]).pop();
    if (target) target.reading = reading.slice(4, 13).map(blank);
    else out.push(`unplaced: ${reading[0]} ${reading[2]} — no sessions row carries that name`);
  }
  const kept = [];
  const moved = [];
  for (const seat of sessions) {
    const full = [...seat.cells, ...(seat.reading || ["—", "—", "—", "—", "—", "—", "—", "—", "—"])];
    const status = full[9].split(/\s+/)[0];
    if (status === "cleared") {
      moved.push(row([...full, today]));
      out.push(`archived: ${moved[moved.length - 1]}`);
      continue;
    }
    if ((status === "live" || status === "queued") && transcriptProblem(full[10])) {
      out.push(`suspect: ${full[0]} ${full[2]} — Transcript ${full[10]}`);
    }
    kept.push(row(full));
    out.push(kept[kept.length - 1]);
  }
  lines.splice(at, sessions.length + 2, row(expected), separator(expected.length), ...kept);
  const table = readingsAt();
  if (table !== -1) {
    let start = table;
    while (start > at && !lines[start].startsWith("## ")) start--;
    if (start === at) start = table;
    let stop = table + 1;
    while (stop < lines.length && !/^#{1,2} /.test(lines[stop])) stop++;
    lines.splice(start, stop - start);
  }
  return { changed: true, out, moved };
}

/**
 * The archive brought to the template's 21 columns (spec 1.4): each table
 * directly under `## Sessions`, in place — the sixteen-column rows of
 * 2026-09-14, and the fifteen-column rows before them, which carry no
 * Context — with Topic, cwd, Effort, Mode, and Transcript `—`, Context `—`
 * where the row had none, and Ended moved last. A table under any other
 * heading — a closed plan's own section — is history and left as it
 * stands. Returns the rows it rewrote, or the shape it could not place.
 */
function migrateArchive(doc) {
  const lines = doc.lines;
  const expected = cells(templateHeader("roster-archive.md", "Sessions"));
  const span = sectionSpan(lines, "Sessions");
  let tables = 0;
  let rows = 0;
  let changed = false;
  for (let at = span ? span.start : lines.length; at < (span ? span.end : 0); at++) {
    if (!lines[at].startsWith("| ") || !(lines[at + 1] || "").startsWith("| ---")) continue;
    tables++;
    const header = cells(lines[at]);
    if (sameCells(header, expected)) continue;
    const context = header.includes("Context");
    const old = header[2] === "Model" && header[5] === "Ended" && header.length === (context ? 16 : 15);
    if (!old) return { unknown: `a Sessions header ${lines[at].trim()}` };
    changed = true;
    lines[at] = row(expected);
    lines[at + 1] = separator(expected.length);
    for (let i = at + 2; i < span.end && lines[i].startsWith("|"); i++) {
      const o = cells(lines[i]);
      if (!context) o.splice(12, 0, "—");
      while (o.length < 16) o.push("—");
      lines[i] = row([o[0], "—", o[1], "—", o[2], "—", o[3], "—", o[4], o[6], "—", ...o.slice(7, 16), o[5]]);
      rows++;
    }
  }
  if (tables === 0) return { unknown: "no Sessions table" };
  return { changed, rows };
}

/** The end of the last table under `## Sessions`, where a moved row is appended. */
function sessionsEnd(lines) {
  const span = sectionSpan(lines, "Sessions");
  let end = null;
  for (let i = span.start; i < span.end; i++) {
    if (lines[i].startsWith("| ") && (lines[i + 1] || "").startsWith("| ---")) {
      end = i + 2;
      while (end < span.end && lines[end].startsWith("|")) end++;
    }
  }
  return end;
}

/**
 * `templates/roster-archive.md` as a new archive: its prose and its two
 * headings, the Sessions table's placeholder row and the placeholder line
 * under `## Events` dropped.
 */
function archiveFromTemplate(file) {
  const lines = fs.readFileSync(path.join(TEMPLATES, "roster-archive.md"), "utf8").split(/\r?\n/);
  const table = tableSpan(lines, sectionSpan(lines, "Sessions"));
  lines.splice(table.first, table.end - table.first);
  const events = sectionSpan(lines, "Events");
  const bullet = lines.findIndex((line, i) => i > events.start && line.startsWith("- "));
  if (bullet !== -1) lines.splice(bullet, events.end - bullet);
  return { file, lines, eol: "\n" };
}

/**
 * `migrate --roster <path> --archive <path> [--ledger <path>] [--now
 * <YYYY-MM-DD>]` (spec 1.4): each file brought to its template's shape
 * once, the headers read from the skill's own `templates/`, as `record`
 * reads them. Idempotent and safe twice over: before it rewrites a file it
 * keeps one copy beside it, `<path>.pre-migrate`, written once and never
 * overwritten, and a file already in its template's shape is read and left
 * as it is, `migrate: <path> is current`. On a shape it does not recognize
 * it writes nothing to any file, prints
 * `migrate: <path> — unknown shape: <what it found>`, and exits 1.
 */
function cmdMigrate(argv) {
  const values = parseArgs(argv);
  const rosterPath = given(values, "roster");
  const archivePath = given(values, "archive");
  const ledgerPath = given(values, "ledger");
  if (!rosterPath || !archivePath) return fail("migrate needs --roster and --archive", 2);
  for (const file of [rosterPath, ledgerPath].filter(Boolean)) {
    if (!fs.existsSync(file)) return fail(`migrate: ${file} is not on disk`, 2);
  }
  const today = given(values, "now") || stamp(new Date()).slice(0, 10);
  const created = !fs.existsSync(archivePath);
  const archive = created ? archiveFromTemplate(archivePath) : readDoc(archivePath);
  const archived = migrateArchive(archive);
  const roster = readDoc(rosterPath);
  const migrated = migrateRoster(roster, today);
  const ledger = ledgerPath ? readDoc(ledgerPath) : null;
  const repaired = ledger ? repairItems(ledger.lines, "kanri.md") : { changed: false };
  const unknown = [
    [archivePath, archived.unknown],
    [rosterPath, migrated.unknown],
    [ledgerPath, repaired.unknown],
  ].filter(([, what]) => what);
  if (unknown.length > 0) {
    for (const [file, what] of unknown) console.log(`migrate: ${file} — unknown shape: ${what}`);
    return 1;
  }
  if (migrated.moved.length > 0) {
    archive.lines.splice(sessionsEnd(archive.lines), 0, ...migrated.moved);
  }
  const keep = (doc, changed) => {
    if (!changed) {
      console.log(`migrate: ${doc.file} is current`);
      return;
    }
    if (fs.existsSync(doc.file) && !fs.existsSync(`${doc.file}.pre-migrate`)) {
      fs.copyFileSync(doc.file, `${doc.file}.pre-migrate`);
    }
    writeDoc(doc);
  };
  keep(archive, created || archived.changed || migrated.moved.length > 0);
  if (created) console.log(`migrate: ${archivePath} created from templates/roster-archive.md`);
  if (archived.rows > 0)
    console.log(`migrate: ${archivePath} — ${archived.rows} rows brought to the template's columns`);
  keep(roster, migrated.changed);
  for (const line of migrated.out) console.log(line);
  if (ledger) {
    keep(ledger, repaired.changed);
    const span = sectionSpan(ledger.lines, "Measurements");
    const table = span ? tableSpan(ledger.lines, span) : null;
    const rows = table ? ledger.lines.slice(table.first, table.end) : [];
    if (!rows.some((line) => cells(line)[0].startsWith(MEASUREMENT_ROW))) {
      console.log(`missing row: ${ledgerPath} — Measurements has no "${MEASUREMENT_ROW}" row`);
    }
  }
  return 0;
}
```

**P5.3** `skills/tanto/scripts/boundary.js` — insert after this 1 line

```js
  if (sub === "record") return cmdRecord(argv.slice(1));
```

**P5.3 →**

```js
  if (sub === "migrate") return cmdMigrate(argv.slice(1));
```

- [ ] **Step 4: Run the boundary suite to verify it passes**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: every test passes.

- [ ] **Step 5: Run the whole suite**

Run it in the background with its output in a file, and read the file
after the completion notice; a run cut at a timeout is no result.

```bash
node --test skills/tanto/scripts/*.test.js > .tanto/roster-ledger/suite-task-5.txt 2>&1
```

Expected: exit 0, and the file's last lines report no failed test.

- [ ] **Step 6: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 5
```

Expected: `task 5: verify clean`.

- [ ] **Step 7: Run lint on the task's own paths**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: lint passes with no file changed.

- [ ] **Step 8: Commit**

```bash
git commit --only -m "feat: boundary.js migrate brings a roster, an archive, and a ledger to their templates once" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: one commit.

### Task 6: The run-time brief and the three `roles/kanri.md` paragraphs that key on its `record` call

Spec 2.3's brief and Kanri paragraphs, 2.5's three fields, section 7's
`templates/boundary-brief.md` entry, and section 8's batch A share of
`roles/kanri.md`. `templates/boundary-brief.md`'s dispatch arguments gain
`jisso=<sessionId>` for `seat=none`; its peer-readings line reads
`<role> <sessionId> <reading>`; its `record` call carries `--kanri` with
Kanri's `sessionId` — the basename of the `kanri-transcript=` path — and
`--jisso` with the Jisso's, from the `seat=` result or the `jisso=` key,
`--peer-reading "<role> <sessionId> <reading>"`, and
`--s-item "<source> | <destination> | <item>"`; and its Next prompt
names the next `queued` seat by `sessionId` and name both. In
`roles/kanri.md`, the dispatch block gains the `jisso=` line. In both,
`kanri-transcript=` names Kanri's own transcript path, read from its
scratchpad path (`SKILL.md`, "The transcript reading") and never from the
roster's first data row, whose Transcript cell may hold only
`<sessionId>.jsonl` (spec 2.2): a seat row written from a state entry
with no `transcript` carries the bare cell. The
readings line says the peer's bare name is resolved at receipt by
`boundary.js seat <name>`'s sixth field, with the `unresolved reading:`
event for a name `seat` does not hold; and loop step 6's call carries
`--status "<sessionId> <word>"`, `--kanri <your sessionId>
--kanri-count batches`, and the three-field `--s-item`. These are about
twenty lines of the role file, in the same batch as the brief that keys on
them, so that a successor Kanri spawned between batches A and C reads a
dispatch block that matches the brief on disk (rule 11). After this task,
every `record` call the run-time text writes carries `sessionId`s.

**Files:**

- Modify: `skills/tanto/templates/boundary-brief.md` — the dispatch
  arguments and the paragraph after them; step 4's `record` call and its
  paragraph; step 5's Next prompt sentence; the verdict file's
  `## Next prompt`.
- Modify: `skills/tanto/roles/kanri.md` — "The batch loop" step 2's
  dispatch block (its `kanri-transcript=` line and a `jisso=` line) and its
  readings sentence, and step 6's `record` call and the paragraph after it.

**Interfaces:**

- Consumes: Tasks 1 and 2's keys — the readings, `--status`, and
  `--kanri-count` by `sessionId`, and `seat`'s sixth field; Task 4's three
  fields; `record --event` on `main` already.
- Produces: the brief's arguments and its `record` call, which Global
  Constraint 2 and batch A's boundary run; the `jisso=` key Kanri's
  dispatch carries.

**Named-mechanism sites** (`git grep` at the base).

- The other three ranges of `roles/kanri.md`, each another task's and none
  touching this task's lines: Start steps 3 and 4, the Handover case, the
  "Yours" case, and "Sending to a seat"'s beat sentence (Task 14); loop
  step 4, "The trigger", "The residency line", "The handover file",
  "Readings", the Replace table, the Release row, and the `(blocked
  since)` and `(idle since)` sentences (Task 15); the Check step, step 4's
  write-back, the landing, "Session lifecycle", Recovery step 1, and
  "Reporting from the other side" (Task 16).
- The rework's `record` call in step 6 and the brief's second call carry
  no roster flag and are left as they stand.
- `seat`'s line as `roles/kanri.md` "Sending to a seat" spells it, five
  words: no task of the cut names it (Task 2).

**O6.8** `<role> <name> <reading>` — the peer line keyed by a name (spec 2.3; the Old values); before: 1 in `skills/tanto/templates/boundary-brief.md` and 1 in `skills/tanto/roles/kanri.md`, after: 0 in both.

**O6.9** `--kanri "<name>"` — Kanri's reading keyed by a name (spec 2.3); before: 1 in `skills/tanto/templates/boundary-brief.md`, 0 in `skills/tanto/roles/kanri.md`, after: 0.

**O6.10** `--jisso "<name>"` — the Jisso's reading keyed by a name (spec 2.3); before: 1 in `skills/tanto/templates/boundary-brief.md`, 0 in `skills/tanto/roles/kanri.md`, after: 0.

**O6.11** `--status "<name>` — the status keyed by a name (spec 2.3); before: 2 in `skills/tanto/roles/kanri.md` (one line), 0 in `skills/tanto/templates/boundary-brief.md`, after: 0.

**O6.12** `<source> | <item>"` — the two-field `--s-item` (spec 2.5); before: 1 in `skills/tanto/templates/boundary-brief.md` and 1 in `skills/tanto/roles/kanri.md`, after: 0 in both.

**O6.13** `<name [ref]>` — the spec's Old values needle for the brief's `record` call; before: 0 in `skills/tanto/templates/boundary-brief.md` — already gone at the base, the call's spelling being O6.9's and O6.10's — after: 0.

**O6.14** `<kanri name>` — as O6.13; before: 0 in `skills/tanto/templates/boundary-brief.md`, after: 0.

**O6.15** `each by its bare name` — step 6's statuses by name (spec 2.3); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O6.16** `per line, the name bare` — the readings line's bare name (spec 2.3); before: 1 in `skills/tanto/roles/kanri.md`, after: 0.

**O6.17** `which under Next prompt` — the next queued seat named without its `sessionId` (spec 2.3); before: 1 in `skills/tanto/templates/boundary-brief.md`, after: 0.

**O6.20** `from the roster's first data row>` — Kanri's transcript path read from a row whose Transcript cell may be a bare `<sessionId>.jsonl` (spec 2.2); before: 1 in `skills/tanto/templates/boundary-brief.md` and 1 in `skills/tanto/roles/kanri.md`, after: 0 in both. The role file's other "first data row" sentences — the four cases' `sessionId`, the intake's read — key on the `sessionId` alone and stay (Tasks 14 and 16).

**A6.18** `skills/tanto/roles/kanri.md` — `grep -c "jisso=<that Jisso's sessionId" skills/tanto/roles/kanri.md` — before: 0, after: 1

- [ ] **Step 1: Key the brief's `record` call by `sessionId`**

Apply P6.1 to P6.4.

**P6.1** `skills/tanto/templates/boundary-brief.md` — replace exactly these 13 lines

````markdown
```text
topic=<topic> batch=<key> plan=<plan path> report=<report path>
ledger=<.tanto/<topic>/kanri.md> roster=<.tanto/roster.md> base=<merge base>
kanri-transcript=<Kanri's transcript path, from the roster's first data row>
tanto=<the skill's own directory>
seat=<the spawner result file of the Jisso that ran this batch, or none>
measurement=<the measurement report's path on a measurement batch, or none>
peer readings since the last boundary, one per line, or none: <…>
```

The last line is the one thing you cannot see for yourself: the readings
peers' last lines carried since the previous boundary. It travels in the
dispatch and goes through `record`.
````

**P6.1 →**

````markdown
```text
topic=<topic> batch=<key> plan=<plan path> report=<report path>
ledger=<.tanto/<topic>/kanri.md> roster=<.tanto/roster.md> base=<merge base>
kanri-transcript=<Kanri's own transcript path, from its scratchpad path (SKILL.md, "The transcript reading"); the roster row's Transcript cell may hold only <sessionId>.jsonl>
tanto=<the skill's own directory>
seat=<the spawner result file of the Jisso that ran this batch, or none>
jisso=<that Jisso's sessionId, from its roster row, when seat=none>
measurement=<the measurement report's path on a measurement batch, or none>
peer readings since the last boundary, one per line, or none: <…>
```

The last line is the one thing you cannot see for yourself: the readings
peers' last lines carried since the previous boundary, each as
`<role> <sessionId> <reading>` — the `sessionId` Kanri resolved from the
peer's bare name when the line arrived. It travels in the dispatch and goes
through `record`.
````

**P6.2** `skills/tanto/templates/boundary-brief.md` — replace exactly these 20 lines

````markdown
   ```bash
   node "<tanto>/scripts/boundary.js" record --ledger <ledger> --roster <roster> \
     --batch <key> --tasks <N-M> --state reported --report <report> \
     --verdict "<the check: line>" \
     --kanri "<name>" --kanri-reading "<Kanri's reading, with its ttl= line>" \
     --jisso "<name>" --jisso-reading "<Jisso's reading>" \
     --seat <the seat= results path, when the dispatch carried one> \
     --peer-reading "<role> <name> <reading>" \
     --s-item "<source> | <item>"
   ```

   `<N-M>` is the tasks the plan's Batches table gives the batch — at a
   rework's boundary, the tasks its prompt's title names, since the plan
   has no row for a rework. One `--s-item` per item of the report's Shoroku
   proposal section, one
   `--peer-reading` per line the dispatch carried. The state you write is
   `reported` and nothing
   else: acceptance is a ruling, and the resident's own single `record` call
   carries it. Read what `record` prints — the rows it wrote — into the
   verdict file's Rows written.
````

**P6.2 →**

````markdown
   ```bash
   node "<tanto>/scripts/boundary.js" record --ledger <ledger> --roster <roster> \
     --batch <key> --tasks <N-M> --state reported --report <report> \
     --verdict "<the check: line>" \
     --kanri <Kanri's sessionId> --kanri-reading "<Kanri's reading, with its ttl= line>" \
     --jisso <the Jisso's sessionId> --jisso-reading "<Jisso's reading>" \
     --seat <the seat= results path, when the dispatch carried one> \
     --peer-reading "<role> <sessionId> <reading>" \
     --s-item "<source> | <destination> | <item>"
   ```

   `<N-M>` is the tasks the plan's Batches table gives the batch — at a
   rework's boundary, the tasks its prompt's title names, since the plan
   has no row for a rework. Kanri's `sessionId` is the basename of the
   `kanri-transcript=` path without `.jsonl`; the Jisso's is the
   `sessionId` the `seat=` result carries, or the `jisso=` value when
   `seat=none`. `record` finds every row by its `sessionId` and by nothing
   else, so a name in either place is refused, and so is a reading for a
   seat no row holds. One `--s-item` per item of the report's Shoroku
   proposal section, its destination the one the item names or empty; one
   `--peer-reading` per line the dispatch carried. The state you write is
   `reported` and nothing
   else: acceptance is a ruling, and the resident's own single `record` call
   carries it. Read what `record` prints — the rows it wrote — into the
   verdict file's Rows written.
````

**P6.3** `skills/tanto/templates/boundary-brief.md` — replace exactly these 3 lines

````markdown
   by workspace and branch alone. Under a plan that edits the tanto skill,
   the roster's `queued` rows in spawn order name the next seat and you say
   which under Next prompt. Fill the Previous batch verdict section's first line from the
````

**P6.3 →**

````markdown
   by workspace and branch alone. Under a plan that edits the tanto skill,
   the roster's `queued` rows in spawn order name the next seat, and you
   name it under Next prompt by its `sessionId` and its name both. Fill the
   Previous batch verdict section's first line from the
````

**P6.4** `skills/tanto/templates/boundary-brief.md` — replace exactly these 3 lines

````markdown
## Next prompt

the path of the rendered prompt, or `none — final batch`
````

**P6.4 →**

````markdown
## Next prompt

the path of the rendered prompt, and under a skill-editing plan's queue the
next `queued` seat by its `sessionId` and its name; or `none — final batch`
````


- [ ] **Step 2: Bring the three role paragraphs to the brief**

Apply P6.5 to P6.7 and P6.19.

**P6.5** `skills/tanto/roles/kanri.md` — insert after these 2 lines

````markdown
   tanto=<skill dir>
   seat=<the spawner result file of the Jisso that ran this batch, or none>
````

**P6.5 →**

````markdown
   jisso=<that Jisso's sessionId, from its roster row, when seat=none>
````

**P6.6** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

````markdown
   file" in `templates/boundary-brief.md`. The readings line is the one
   thing the subagent cannot see and you hold as text: the readings peers'
   last lines carried since the previous boundary, one
   `<role> <name> <reading>` per line, the name bare. What a dispatch cost
   is no line of yours: `usage.js` measures every dispatch from the
   transcripts at the close.
````

**P6.6 →**

````markdown
   file" in `templates/boundary-brief.md`. The readings line is the one
   thing the subagent cannot see and you hold as text: the readings peers'
   last lines carried since the previous boundary, one
   `<role> <sessionId> <reading>` per line. A peer's line carries its bare
   name and no `sessionId`, so you resolve the name the moment the line
   arrives, while it is fresh: `boundary.js seat <name>` prints the
   `sessionId` as its sixth field. When `seat` prints `no entry` for the
   name, you write the reading as the ledger event
   `unresolved reading: <role> <name> — <reading>` through `record --event`
   instead, and that row is not written. `jisso=` carries the Jisso's
   `sessionId` from its row when `seat=none` — a `queued` seat of a
   skill-editing plan's queue. What a dispatch cost is no line of yours:
   `usage.js` measures every dispatch from the transcripts at the close.
````

**P6.7** `skills/tanto/roles/kanri.md` — replace exactly these 17 lines

````markdown
   ```bash
   node "$TANTO/scripts/boundary.js" record --ledger <.tanto/<topic>/kanri.md> \
     --roster <.tanto/roster.md> --batch <key> --state accepted|rework \
     --verdict "<one line>" --progress "<one line>" \
     --status "<name> stopped" --status "<name> live" \
     --s-item "<source> | <item>" \
     --event "commit-done: <role> <topic> — <subject>"
   ```

   It carries the Batches row's state and verdict your ruling gives, the
   Progress line, the Status changes this boundary decided — the retiring
   Jisso `stopped`, the Jisso you have just started `live`, any other seat
   step 4 ended `stopped`, each by its bare name — one `--s-item` per item of a shoroku
   proposal step 4 form-checked, and one `commit-done:` event per boundary
   reply step 5 took; `<key>` is the key of the batch whose boundary this
   is. At a boundary no table is edited by hand: that call, and for a
   rework the second call below, are all of it.
````

**P6.7 →**

````markdown
   ```bash
   node "$TANTO/scripts/boundary.js" record --ledger <.tanto/<topic>/kanri.md> \
     --roster <.tanto/roster.md> --batch <key> --state accepted|rework \
     --verdict "<one line>" --progress "<one line>" \
     --status "<sessionId> stopped" --status "<sessionId> live" \
     --kanri <your sessionId> --kanri-count batches \
     --s-item "<source> | <destination> | <item>" \
     --event "commit-done: <role> <topic> — <subject>"
   ```

   It carries the Batches row's state and verdict your ruling gives, the
   Progress line, the Status changes this boundary decided — the retiring
   Jisso `stopped`, the Jisso you have just started `live`, any other seat
   step 4 ended `stopped`, each by the `sessionId` its row's Transcript
   cell carries and never by a name, which `record` refuses — your Batches
   count moved by one when the batch is accepted, by `--kanri` with your
   own `sessionId`, your transcript's basename, and `--kanri-count batches`,
   both left out on a rework; one `--s-item` per item of a shoroku proposal
   step 4 form-checked, its destination the one the item names or empty;
   and one `commit-done:` event per boundary reply step 5 took. `<key>` is
   the key of the batch whose boundary this is. At a boundary no table is
   edited by hand: that call, and for a rework the second call below, are
   all of it.
````

**P6.19** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

````markdown
   kanri-transcript=<your transcript path, from the roster's first data row>
````

**P6.19 →**

````markdown
   kanri-transcript=<your own transcript path, from your scratchpad path (SKILL.md, "The transcript reading"); the roster row's Transcript cell may hold only <sessionId>.jsonl>
````

- [ ] **Step 3: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 6
```

Expected: `task 6: verify clean`.

- [ ] **Step 4: Run lint on the task's own paths**

```bash
./scripts/lint.sh skills/tanto/templates/boundary-brief.md skills/tanto/roles/kanri.md
```

Expected: lint passes with no file changed.

- [ ] **Step 5: Commit**

```bash
git commit --only -m "docs: the boundary brief and Kanri's record calls carry sessionIds and the three-field --s-item" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/templates/boundary-brief.md skills/tanto/roles/kanri.md
```

Expected: one commit.

### Task 7: `boundary.js census`: seven headings, Returned, and the queued line

Spec section 3, and section 7's `scripts/boundary.js` entry for "the seventh
heading and the 78b3 line" with its census tests. The census prints seven
headings — **Listed**, **Parked**, **Ended**, **Returned**, **Not listed**,
**No session id**, **Not held** — each line the Heading column of spec
section 3's table, carrying the `sessionId` the row's act keys on. A
`stopped` or `dead` row whose seat the state file holds `running` or
`blocked`, or the listing shows while the state file has not ended it,
prints under Returned as `<role> <topic> <name> — <sessionId> — <row status>;
seat <running, blocked, or listed>`, and no longer under Not held; a
`queued` row the listing does not show prints under Not listed with
` — queued; its batch line wakes it`, whatever the state file holds short of
`stopped` or `removed`, `gone` included, and no longer under Parked; and a
row of any status whose Transcript cell carries no `sessionId` — a blank or
`unavailable` cell, or one whose separators were lost (f07a) — prints under
No session id, with ` — row <status>` when the row is neither `live` nor
`queued`. The census still writes nothing; its header refusal is Task 1's.

After this task, one census tells Kanri which ended seat came back and which
queued seat waits for its line, and every line names the `sessionId` its act
is written for.

**Files:**

- Modify: `skills/tanto/scripts/boundary.js` — `CENSUS_HEADINGS` and its
  comment, with `rowSessionId` before it; `cmdCensus`'s comment and its row
  loop.
- Test: `skills/tanto/scripts/boundary.test.js` — the census tests "census
  prints the spawner: line…", "census prints none under a heading…", and
  "census prints Parked with its marks…" brought to seven headings; one new
  test after "census matches a row whose Transcript cell is the bare session
  id".

**Interfaces:**

- Consumes: Task 1's census on the twenty-column roster — the header check
  and its refusal line, which replace `cmdCensus`'s base lines 840–841 and
  which this task does not touch — and the census test helpers
  `censusFixture`, `sessionRow(role, topic, name, status, transcript)`, and
  `census` as Task 1 leaves them; `sessionIdOf` and `stateSeats`, on `main`.
- Produces: `rowSessionId(transcript)`, through which `roster show`
  (Task 8) reads its keys; and the census's seven headings with these lines,
  which `SKILL.md`'s "The census" table (Task 12) and `roles/kanri.md`'s
  "Session lifecycle" (Task 16) name:
  - Returned: `<role> <topic> <name> — <sessionId> — <stopped or dead>; seat <running, blocked, or listed>`
  - Not listed, for a `queued` row: `<role> <topic> <name> — <sessionId> — queued; its batch line wakes it[ — no first turn since <stamp>]`
  - No session id: `<role> <topic> <name>[ — row <status>]`
  - Listed, Parked, Ended, Not held, and Not listed for a `live` row:
    unchanged.

**Named-mechanism sites** (`git grep` at `main`).

- The census's headings: `SKILL.md` "The roster", its census bullet list,
  which becomes spec section 3's table (Task 12), and "Artifacts", the
  scripts paragraph's "under six headings — Listed, Parked, Ended, Not
  listed, No session id, and Not held" (Task 13); `roles/kanri.md` "Session
  lifecycle", its census paragraph's "six headings", its "No session id —
  nothing" bullet and its Not held bullet's `— row <status>`, and "Recovery"
  step 1's "act on its six headings" (Task 16); `templates/roster.md`'s
  Keeping rule, whose census bullet says a `queued` row the census does not
  list stays `queued` (Task 1).
- The `— renamed` suffix stays derived from the listed name against the Name
  cell; the spawner's `renamed` mark and its `ack` op go in Task 10, and
  `SKILL.md` "Resuming"'s "the `renamed` marks reconciled" names the
  census's suffix and stays.
- `rowSessionId`'s rule — a basename of letters, digits, and dashes — is the
  census's and `roster show`'s (Task 8); the `<uuid>.jsonl` shape check on a
  cell being written is `record`'s (Task 1), and `migrate`'s `suspect:` line
  (Task 5) names the same rows from the other side.
- Other tasks editing `boundary.js`: Task 1 (`cells`, `row`, the template
  header check, `sItemCells`, `writeResidency`, and the census's header
  line), Task 2 (the reading and status writers, `PEER`, `seat`'s sixth
  field), Task 3 (`writeSeatRow` and `cmdRecord`'s roster flags), Task 4
  (`writeSItem`, `--direction`, `--written`), Task 5 (`migrate`), Task 8
  (`roster show`, after `cmdCensus`), Task 9 (`archive`, the header comment,
  the usage line), Task 11 (the file's last line). In `boundary.test.js`:
  Tasks 1 to 5 the `record` and fixture tests, Task 8 the `roster show`
  tests before the `request` fixtures, Task 9 the `archive` tests and "an
  unknown subcommand". This task takes `cmdCensus`'s comment and row loop
  and the census tests' expected output, and no line of either another task
  quotes.

**O7.1** `CENSUS_HEADINGS = ["Listed", "Parked", "Ended", "Not listed"` — the six headings without Returned (spec 3); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O7.2** `The six headings` — `CENSUS_HEADINGS`'s comment (spec 3); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O7.3** `under six headings` — `cmdCensus`'s comment (spec 3); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0. `SKILL.md`'s "under six" wraps before "headings" and is Task 13's.

**O7.4** `under its six headings` — the first census test's name (spec 3); before: 1 in `skills/tanto/scripts/boundary.test.js`, after: 0.

**O7.5** `if (sessionId) others.set(sessionId, status);` — every row neither `live` nor `queued` filed for Not held before its `sessionId` was read, so that a `stopped` row whose seat runs printed under Not held and a cell with no `sessionId` of such a row printed nowhere (spec 3, the Returned and No session id rows); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O7.6** `"old-seat (background) — sess-old — row stopped"` — a `stopped` row whose seat is listed, expected under Not held (spec 3, Returned); before: 1 in `skills/tanto/scripts/boundary.test.js`, after: 0.

**O7.7** `"jisso t jisso-f — sess-gone",` — a `queued` row against a `gone` entry with no line of its own (spec 3, 78b3); before: 1 in `skills/tanto/scripts/boundary.test.js`, after: 0.

**O7.8** `["Parked", "Ended", "Not listed", "No session id", "Not held"]` — the headings "census prints none" walks (spec 3); before: 1 in `skills/tanto/scripts/boundary.test.js`, after: 0.

**O7.9** `sessionIdOf(row[10])` — the census's key read with no shape test, so that a cell whose separators were lost was a key no seat holds (spec 2.2, 3); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0. `sessionIdOf` itself stays, and `rowSessionId` reads through it.

**A7.10** `skills/tanto/scripts/boundary.test.js` — `grep -c 'census prints Returned' skills/tanto/scripts/boundary.test.js` — before: 0, after: 1

- [ ] **Step 1: Write the failing tests**

Apply P7.11 to P7.15. P7.11 and P7.12 bring the first census test to seven
headings, its listed `stopped` row under Returned; P7.13 adds Returned to the
headings "census prints none" walks; P7.14 adds Returned and the queued line
to "census prints Parked…"; P7.15 adds the new test.

**P7.11** `skills/tanto/scripts/boundary.test.js` — replace exactly this 1 line

```js
test("census prints the spawner: line, then the live and queued rows under its six headings, by its own path comparison", () => {
```

**P7.11 →**

```js
test("census prints the spawner: line, then the roster's rows under its seven headings, a listed stopped row under Returned, by its own path comparison", () => {
```

**P7.12** `skills/tanto/scripts/boundary.test.js` — replace exactly these 13 lines

```js
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
```

**P7.12 →**

```js
      "none",
      "",
      "## Returned",
      "",
      "jisso t jisso-e — sess-old — stopped; seat listed",
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
```

**P7.13** `skills/tanto/scripts/boundary.test.js` — replace exactly this 1 line

```js
  for (const heading of ["Parked", "Ended", "Not listed", "No session id", "Not held"]) {
```

**P7.13 →**

```js
  for (const heading of ["Parked", "Ended", "Returned", "Not listed", "No session id", "Not held"]) {
```

**P7.14** `skills/tanto/scripts/boundary.test.js` — replace exactly these 5 lines

```js
      "jisso t jisso-e — sess-done — removed",
      "",
      "## Not listed",
      "",
      "jisso t jisso-f — sess-gone",
```

**P7.14 →**

```js
      "jisso t jisso-e — sess-done — removed",
      "",
      "## Returned",
      "",
      "none",
      "",
      "## Not listed",
      "",
      "jisso t jisso-f — sess-gone — queued; its batch line wakes it",
```

**P7.15** `skills/tanto/scripts/boundary.test.js` — insert after these 2 lines

```js
  assert.ok(result.out.includes("\n## No session id\n\nnone\n"), result.out);
});
```

**P7.15 →**

```js

test("census prints Returned for an ended row whose seat runs again, a queued row the listing lost as waiting for its batch line, and a row with no sessionId under No session id (roster-ledger 3)", () => {
  const f = censusFixture(
    [
      sessionRow("kanri", "—", "kanri-a", "live", "/home/u/.claude/projects/p/sess-kanri.jsonl"),
      sessionRow("jisso", "t", "jisso-b", "dead", "/home/u/.claude/projects/p/sess-dead.jsonl"),
      sessionRow("jisso", "t", "jisso-c", "stopped", "/home/u/.claude/projects/p/sess-stayed.jsonl"),
      sessionRow("sekkei", "t", "sekkei-d", "stopped", "/home/u/.claude/projects/p/sess-tab.jsonl"),
      sessionRow("keikaku", "t", "keikaku-e", "stopped", "/home/u/.claude/projects/p/sess-parked.jsonl"),
      sessionRow("kanri", "—", "kanri-f", "replaced", "/home/u/.claude/projects/p/sess-before.jsonl"),
      sessionRow("jisso", "u", "jisso-g", "queued", "/home/u/.claude/projects/p/sess-later.jsonl"),
      // f07a's cell: the separators lost, the drive's colon and the path's
      // dots run into the basename.
      sessionRow("hosa", "—", "hosa-h", "live", "C:Usersu.claudeprojectspsess-lost.jsonl"),
      sessionRow("jisso", "u", "jisso-i", "stopped", "unavailable"),
    ],
    (root) => [
      { sessionId: "sess-kanri", name: "kanri-a", kind: "background", cwd: root, pid: 1111 },
      { sessionId: "sess-stayed", name: "jisso-c", kind: "background", cwd: root, pid: 1112 },
      { sessionId: "sess-tab", name: "dotskills-7b", kind: "interactive", cwd: root, pid: 1113 },
      { sessionId: "sess-before", name: "kanri-f", kind: "background", cwd: root, pid: 1114 },
    ],
  );
  const spawnerDir = path.join(f.root, ".tanto", "spawner");
  fs.mkdirSync(spawnerDir, { recursive: true });
  const seats = [
    { sessionId: "sess-kanri", role: "kanri", status: "running" },
    // Back, and nobody wrote it (007e's fifth case): held running, not listed.
    { sessionId: "sess-dead", role: "jisso", topic: "t", status: "running" },
    // A tab the state file holds stopped stays listed after its stop: no return.
    { sessionId: "sess-tab", role: "sekkei", topic: "t", status: "stopped" },
    {
      sessionId: "sess-parked",
      name: "dotskills-keikaku-5e5e",
      role: "keikaku",
      topic: "t",
      status: "parked",
      contract: 2,
      requestId: "req-keikaku",
    },
    // A queued seat's entry gone is no absence to mark (78b3).
    { sessionId: "sess-later", role: "jisso", topic: "u", status: "gone" },
  ];
  fs.writeFileSync(path.join(spawnerDir, "seats.json"), JSON.stringify({ seats }));
  const before = fs.readFileSync(f.roster, "utf8");
  const result = census(f, "");
  assert.strictEqual(result.code, 0, result.err);
  assert.strictEqual(
    result.out,
    [
      "spawner: stale",
      "",
      "## Listed",
      "",
      "kanri — kanri-a — sess-kanri — listed as kanri-a (background)",
      "",
      "## Parked",
      "",
      "none",
      "",
      "## Ended",
      "",
      "none",
      "",
      "## Returned",
      "",
      "jisso t jisso-b — sess-dead — dead; seat running",
      // Ended by the run and its process stayed (cd46): listed, no state entry.
      "jisso t jisso-c — sess-stayed — stopped; seat listed",
      "",
      "## Not listed",
      "",
      "jisso u jisso-g — sess-later — queued; its batch line wakes it",
      "",
      "## No session id",
      "",
      "hosa — hosa-h",
      "jisso u jisso-i — row stopped",
      "",
      "## Not held",
      "",
      "dotskills-7b (interactive) — sess-tab — row stopped",
      "kanri-f (background) — sess-before — row replaced",
      "dotskills-keikaku-5e5e (not listed) — sess-parked — row stopped — spawned as keikaku t, result req-keikaku",
      "",
    ].join("\n"),
  );
  assert.strictEqual(fs.readFileSync(f.roster, "utf8"), before);
});
```

- [ ] **Step 2: Run the census tests to verify they fail**

```bash
node --test --test-name-pattern "census" skills/tanto/scripts/boundary.test.js
```

Expected: FAIL — four tests: "census prints the spawner: line, then the
roster's rows under its seven headings…" and "census prints none under a
heading with no entry" (no Returned heading), "census prints Parked with its
marks…" (no Returned heading, the queued row's bare line), and the new test.
The other census tests pass.

- [ ] **Step 3: Print Returned, the queued line, and every row no key finds**

Apply P7.16 to P7.19.

**P7.16** `skills/tanto/scripts/boundary.js` — replace exactly these 2 lines

```js
/** The six headings `census` prints after its `spawner:` line, in order (spec 2.7). */
const CENSUS_HEADINGS = ["Listed", "Parked", "Ended", "Not listed", "No session id", "Not held"];
```

**P7.16 →**

```js
/**
 * A Transcript cell's `sessionId` as a key finds it, or null: `sessionIdOf`'s
 * basename, held to letters, digits, and dashes. A cell whose separators were
 * lost — f07a's path written through an inline script, the drive's colon and
 * the path's dots run into one word — has no `sessionId` and prints under No
 * session id (roster-ledger 2.2, 3). The `<uuid>.jsonl` shape is the writer's
 * check on the cell it writes, never this reader's.
 */
function rowSessionId(transcript) {
  const id = sessionIdOf(transcript);
  return id && /^[0-9A-Za-z-]+$/.test(id) ? id : null;
}

/** The seven headings `census` prints after its `spawner:` line, in order (roster-ledger 3). */
const CENSUS_HEADINGS = ["Listed", "Parked", "Ended", "Returned", "Not listed", "No session id", "Not held"];
```

**P7.17** `skills/tanto/scripts/boundary.js` — replace exactly these 6 lines

```js
/**
 * `census [--root <dir>] [--roster <path>]` (spec 2.2, 2.7): the `spawner:`
 * line, then the roster's `live` and `queued` rows against the state file and
 * `claude agents --json`'s sessions under the root, under six headings.
 * Read-only — Kanri, the roster's one writer, acts on what it prints.
 */
```

**P7.17 →**

```js
/**
 * `census [--root <dir>] [--roster <path>]` (spec 2.2, 2.7; roster-ledger
 * 3): the `spawner:` line, then the roster's rows against the state file and
 * `claude agents --json`'s sessions under the root, under seven headings: a
 * `live` or `queued` row by where its seat is, a `stopped` or `dead` row
 * whose seat runs again under Returned, and a row of any status whose
 * Transcript cell has no `sessionId` under No session id. Read-only — Kanri,
 * the roster's one writer, acts on each line by the `sessionId` it carries,
 * one act per row of roster-ledger section 3's table.
 */
```

**P7.18** `skills/tanto/scripts/boundary.js` — replace exactly these 13 lines

```js
    const status = row[9].split(/\s+/)[0];
    const sessionId = sessionIdOf(row[10]);
    if (status !== "live" && status !== "queued") {
      if (sessionId) others.set(sessionId, status);
      continue;
    }
    if (!sessionId) {
      out["No session id"].push(`${role} ${topic} ${name}`);
      continue;
    }
    held.add(sessionId);
    const seat = seats.get(sessionId);
    const where = `${role} ${topic} ${name} — ${sessionId}`;
```

**P7.18 →**

```js
    const status = row[9].split(/\s+/)[0];
    const sessionId = rowSessionId(row[10]);
    if (!sessionId) {
      // A row no key finds, whatever its status (roster-ledger 3): nothing
      // to mark; `migrate` prints a `live` or `queued` one `suspect:`, and
      // the human repairs or retires it once.
      const other = status === "live" || status === "queued" ? "" : ` — row ${status}`;
      out["No session id"].push(`${role} ${topic} ${name}${other}`);
      continue;
    }
    const seat = seats.get(sessionId);
    const where = `${role} ${topic} ${name} — ${sessionId}`;
    if (status === "stopped" || status === "dead") {
      // Returned (roster-ledger 3): the seat of an ended row runs again —
      // held `running` or `blocked`, or listed while the state file has not
      // ended it, since a tab the state file holds `stopped` stays listed
      // and is no return. For `dead` Kanri writes the row `live`, as nobody
      // did (007e's fifth case); for `stopped` it writes a `stop` request
      // unless one is waiting, as the run ended it and the process stayed
      // (cd46).
      const running = seat?.status === "running" || seat?.status === "blocked";
      const ended = seat?.status === "stopped" || seat?.status === "removed";
      if (running || (listed.has(sessionId) && !ended)) {
        held.add(sessionId);
        out.Returned.push(`${where} — ${status}; seat ${running ? seat.status : "listed"}`);
        continue;
      }
    }
    if (status !== "live" && status !== "queued") {
      others.set(sessionId, status);
      continue;
    }
    held.add(sessionId);
```

**P7.19** `skills/tanto/scripts/boundary.js` — replace exactly these 2 lines

```js
    const session = listed.get(sessionId);
    if (!session && seat?.status === "parked") {
```

**P7.19 →**

```js
    const session = listed.get(sessionId);
    if (!session && status === "queued") {
      // A `queued` seat reads nothing until its batch line, which wakes it,
      // whatever the state file holds, `gone` included: marked by nobody
      // (roster-ledger 3, 78b3).
      out["Not listed"].push(`${where} — queued; its batch line wakes it${firstTurn(sessionId)}`);
      continue;
    }
    if (!session && seat?.status === "parked") {
```

- [ ] **Step 4: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 7
```

Expected: `task 7: verify clean`.

- [ ] **Step 5: Run the boundary suite to verify it passes**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: every test passes, the four census tests of Step 2 among them.

- [ ] **Step 6: Run lint per Global Constraints**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: lint passes with no file changed.

- [ ] **Step 7: Commit per Global Constraints**

```bash
git commit --only -m "feat: boundary.js census prints Returned, the queued line, and every row no key finds (roster-ledger 3)" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: one commit.

### Task 8: `boundary.js roster show`

Spec 4.1, and section 7's `scripts/boundary.js` entry for `roster show`
with its test. `boundary.js roster show [--root <dir>] [--roster <path>]
[--events <n>|all] [--items]` prints, and writes nothing: the first data row
as `first: <name> — <sessionId> — <status> — counts <batches> <plans>
<noticed>`; every `live` and `queued` row as `<role> <topic> <name> —
<status> — <sessionId>`, with ` — no state entry` for a seat the spawner's
state file does not hold; `cleared: <n> rows — run boundary.js migrate`
while a `cleared` row remains; `items: <n>`, the roster's Shoroku proposal
items table's rows, and the rows themselves with `--items`; and `events:`
followed by the last ten Events entries, or the last `<n>`, or every one
with `all`. On a roster whose seats header is not `templates/roster.md`'s it
prints what it can read and ends with the line that names `migrate`,
exit 1. `--root` is the census's: the root whose `.tanto/roster.md` and
`.tanto/spawner/seats.json` are read, the cwd by default.

After this task, a Start and a handover read the roster in one command of
fixed output, whatever the roster's size.

**Files:**

- Modify: `skills/tanto/scripts/boundary.js` — after `cmdCensus`:
  `tableRows`, `refusalFor`, `eventEntries`, and `cmdRoster`; `main`'s
  `roster` line, after its `census` line.
- Test: `skills/tanto/scripts/boundary.test.js` — before the `request`
  fixtures' comment: the fixture helpers `templateLine`, `separatorFor`,
  `SHOW_READINGS`, `showRow`, and `rosterFixture`, and three `roster show`
  tests.

**Interfaces:**

- Consumes: Task 1's `templates/roster.md` — one seats table whose header is
  spec 1.1's twenty columns in order, Batches, Plans, and Noticed the
  eighteenth to the twentieth — its `cells()` and `row()` with the `\|`
  escape, `headerAt(lines, heading)`, and `headerMismatch(file, template,
  heading)`, whose `record wrote nothing — …` line `refusalFor` renames for
  the subcommand that prints it; in the tests, Task 1's `OLD_NAME` and Task
  5's `separatorOf(n)`; Task 7's `rowSessionId`; `stateSeats`,
  `sectionSpan`, `tableSpan`, `parseLine`, and `rootOf`, on `main`.
- Produces: `roster show`'s lines above, which `roles/kanri.md` Start step 4
  (Task 14) and `templates/kanri-handover.md` (Task 17) name in place of a
  cold read, and the launcher's held line names (Task 11); `refusalFor(
  subcommand, line)`, which `archive` (Task 9) uses; and the test helpers
  `templateLine(name)`, `separatorFor(header)`, `showRow(role, topic, name,
  status, sessionId[, readings])`, and `rosterFixture(rows, { items,
  events, seats, header })`, which Task 9's tests use — named apart from
  Task 1's `seatRow` and Task 5's `separatorOf`, which this file already
  declares.

**Named-mechanism sites** (`git grep` at `main`).

- The subcommand list: `boundary.js`'s header comment and its usage line,
  and the test "an unknown subcommand exits 2 and names the seven that
  exist", are Task 9's, which lists all ten; `SKILL.md` "Artifacts", the
  scripts paragraph's subcommands (Task 13); `skills/tanto/README.md`
  "Layout", the `scripts/boundary.js` bullet (Task 18).
- `roster show` in place of a cold read: `roles/kanri.md` Start step 4 and
  the Handover case (Task 14), "The handover file" (Task 15);
  `templates/kanri-handover.md`'s `## Reading` and `## Next step`
  (Task 17).
- The line that names `migrate`: `record`'s refusal of spec 2.1 and the
  census's header line (Task 1), and `migrate`'s own reading of the
  templates (Task 5), all through Task 1's `headerMismatch`; `show` and
  `archive` (Task 9) print that same line, renamed by `refusalFor`.
- Kanri's three counts, which `first:` prints: `--kanri-count` and
  `--kanri-counts` (Task 2), `--init` and `--succeeds` writing `0 0 0`
  (Task 3).
- Other tasks editing `boundary.js` and `boundary.test.js`: as Task 7 lists
  them. This task takes the lines after `cmdCensus`'s end, one line after
  `main`'s `census` line, and the lines before the `request` fixtures'
  comment.

**A8.1** `skills/tanto/scripts/boundary.js` — `grep -c 'if (sub === "roster")' skills/tanto/scripts/boundary.js` — before: 0, after: 1

**A8.2** `skills/tanto/scripts/boundary.test.js` — `grep -c '^function rosterFixture' skills/tanto/scripts/boundary.test.js` — before: 0, after: 1

- [ ] **Step 1: Write the failing tests**

Apply P8.3.

**P8.3** `skills/tanto/scripts/boundary.test.js` — insert before these 3 lines

```js
// `request`, `seat`, `wake`, and `beat`: a root with the spawner's directory,
// its state file, and its heartbeat — fresh, or ten minutes old — and the
// census's fake `claude` for the listing.
```

**P8.3 →**

```js
// `roster show` and `archive`: a roster and an archive on their templates'
// own header rows, so that a fixture's shape is the template's whatever the
// template holds, and a state file beside them.
function templateLine(name) {
  return fs
    .readFileSync(path.join(TANTO, "templates", name), "utf8")
    .split(/\r?\n/)
    .find((line) => line.startsWith("| Role |"));
}

/** A table's separator row, through `separatorOf`, one `---` per cell of `header`. */
function separatorFor(header) {
  return separatorOf(header.match(/\|/g).length - 1);
}

/** A row's nine reading cells, Read at to Noticed. */
const SHOW_READINGS = "start | 1 | 2 | 3 | 0 | context=4 | 0 | 0 | 0";

/** A roster row of the template's twenty cells: the seat's eleven, then the nine reading cells. */
function showRow(role, topic, name, status, sessionId, readings = SHOW_READINGS) {
  const transcript = `/home/u/.claude/projects/p/${sessionId}.jsonl`;
  return `| ${role} | ${topic} | ${name} | /repo | sonnet | high | main | auto | 2026-10-07 10:00 | ${status} | ${transcript} | ${readings} |`;
}

/** A root holding a roster of `rows` with its `items` and `events`, and a state file of `seats`. */
function rosterFixture(rows, { items = [], events = [], seats = [], header = templateLine("roster.md") } = {}) {
  const dir = tmpDir();
  const root = path.join(dir, "repo");
  fs.mkdirSync(path.join(root, ".tanto", "spawner"), { recursive: true });
  fs.writeFileSync(path.join(root, ".tanto", "spawner", "seats.json"), JSON.stringify({ seats }));
  const itemHead = "| S-n | Source | Item | Destination | Adopted | Written |";
  const body = [
    "# tanto roster",
    "",
    header,
    separatorFor(header),
    ...rows,
    "",
    "## Shoroku proposal items",
    "",
    itemHead,
    separatorFor(itemHead),
    ...(items.length > 0 ? items : ["| (no item yet) | | | | | |"]),
    "",
    "## Events",
    "",
    ...events,
    "",
  ];
  const roster = write(path.join(root, ".tanto"), "roster.md", body.join("\n"));
  return { dir, root, roster, archive: path.join(root, ".tanto", "roster-archive.md") };
}

test("roster show prints the first row with Kanri's counts, every live and queued row, the items count, and the last ten Events entries, and writes nothing (roster-ledger 4.1)", () => {
  const events = Array.from({ length: 12 }, (_, i) => `- 2026-10-07 10:${String(i).padStart(2, "0")} — event ${i}`);
  const f = rosterFixture(
    [
      showRow("kanri", "—", "kanri-a", "live", "sess-kanri", "start | 1 | 2 | 3 | 0 | context=4 | 5 | 1 | 2"),
      showRow("kanri", "—", "kanri-z", "replaced", "sess-before"),
      showRow("sekkei", "t", "sekkei-b", "live (idle since 10:00)", "sess-sekkei"),
      showRow("jisso", "t", "jisso-c", "queued", "sess-queued"),
      showRow("jisso", "t", "jisso-d", "stopped", "sess-done"),
    ],
    {
      items: ["| S-1 | kikaku file | an item | issues | pending | no |"],
      events,
      seats: [
        { sessionId: "sess-kanri", status: "running" },
        { sessionId: "sess-queued", status: "parked" },
      ],
    },
  );
  const before = fs.readFileSync(f.roster, "utf8");
  const got = run(["roster", "show", "--root", f.root], f.dir);
  assert.strictEqual(got.code, 0, got.err);
  assert.strictEqual(
    got.out.replace(/\r\n/g, "\n"),
    [
      "first: kanri-a — sess-kanri — live — counts 5 1 2",
      "kanri — kanri-a — live — sess-kanri",
      // A seat the state file does not hold: the old-contract row Start step 4 looks for.
      "sekkei t sekkei-b — live (idle since 10:00) — sess-sekkei — no state entry",
      "jisso t jisso-c — queued — sess-queued",
      "items: 1",
      "events:",
      ...events.slice(-10),
      "",
    ].join("\n"),
  );
  assert.strictEqual(fs.readFileSync(f.roster, "utf8"), before);
});

test("roster show --events all and --items print every Events entry and the items rows, --events <n> the last n, and a cleared row is counted for migrate (roster-ledger 4.1)", () => {
  const f = rosterFixture(
    [
      showRow("kanri", "—", "kanri-a", "live", "sess-kanri", "start | 1 | 2 | 3 | 0 | context=4 | 0 | 0 | 0"),
      showRow("kikaku", "—", "kikaku-b", "cleared", "sess-tab"),
    ],
    {
      items: ["| S-1 | a | one | issues | pending | no |", "| S-2 | b | two | notes | pending | no |"],
      events: [
        "- 2026-10-07 10:00 — unsent: kanri — a line",
        "  that wraps",
        "- 2026-10-07 10:05 — sent: kanri — a line",
      ],
      seats: [{ sessionId: "sess-kanri", status: "running" }],
    },
  );
  const got = run(["roster", "show", "--root", f.root, "--events", "all", "--items"], f.dir);
  assert.strictEqual(got.code, 0, got.err);
  assert.strictEqual(
    got.out.replace(/\r\n/g, "\n"),
    [
      "first: kanri-a — sess-kanri — live — counts 0 0 0",
      "kanri — kanri-a — live — sess-kanri",
      "cleared: 1 rows — run boundary.js migrate",
      "items: 2",
      "| S-1 | a | one | issues | pending | no |",
      "| S-2 | b | two | notes | pending | no |",
      "events:",
      "- 2026-10-07 10:00 — unsent: kanri — a line",
      "  that wraps",
      "- 2026-10-07 10:05 — sent: kanri — a line",
      "",
    ].join("\n"),
  );
  const last = run(["roster", "show", "--root", f.root, "--events", "1"], f.dir);
  assert.strictEqual(last.code, 0, last.err);
  assert.ok(last.out.replace(/\r\n/g, "\n").endsWith("events:\n- 2026-10-07 10:05 — sent: kanri — a line\n"), last.out);
});

test("roster show on a roster whose header is not the template's prints the rows it can and ends with the line that names migrate, exit 1; a usage error exits 2 (roster-ledger 4.1)", () => {
  // The old header's Name cell, as Task 1's tests spell it (`OLD_NAME`), so
  // that the plan's sweep for the old header finds no fixture.
  const header = templateLine("roster.md").replace("| Name |", `| ${OLD_NAME} |`);
  const f = rosterFixture([showRow("kanri", "—", "kanri-a", "live", "sess-kanri")], {
    header,
    seats: [{ sessionId: "sess-kanri", status: "running" }],
  });
  const got = run(["roster", "show", "--root", f.root], f.dir);
  assert.strictEqual(got.code, 1, got.err);
  const lines = got.out.replace(/\r\n/g, "\n").trimEnd().split("\n");
  assert.strictEqual(lines[0], "first: kanri-a — sess-kanri — live — counts 0 0 0");
  assert.match(
    lines.at(-1),
    /^roster show — .+roster\.md: the seats table header is not the template's — expected \| Role \| Topic \| Name \| .+, found \| Role \| Topic \| Name \[ref\] \| .+ — run boundary\.js migrate$/,
  );
  const usage = [["roster"], ["roster", "list"], ["roster", "show", "--roster", path.join(f.dir, "absent.md")]];
  for (const args of usage) assert.strictEqual(run(args, f.dir).code, 2, args.join(" "));
});

```

- [ ] **Step 2: Run the `roster show` tests to verify they fail**

```bash
node --test --test-name-pattern "roster show" skills/tanto/scripts/boundary.test.js
```

Expected: FAIL — the three new tests, each on exit 2 and the usage line,
since `boundary.js` has no `roster` subcommand.

- [ ] **Step 3: Write `roster show`**

Apply P8.4 and P8.5.

**P8.4** `skills/tanto/scripts/boundary.js` — insert after these 7 lines

```js
  console.log(spawnerLine(root));
  for (const heading of CENSUS_HEADINGS) {
    console.log(`\n## ${heading}\n`);
    console.log(out[heading].length > 0 ? out[heading].join("\n") : "none");
  }
  return 0;
}
```

**P8.4 →**

```js

/**
 * The data rows of the seats table `headerAt` finds at `at`, the template's
 * or an older shape's, as cell lists.
 */
function tableRows(lines, at) {
  let end = at + 2;
  while (end < lines.length && lines[end].startsWith("|")) end++;
  return lines.slice(at + 2, end).map((line) => cells(line));
}

/**
 * `record`'s refusal line of roster-ledger 2.1, `headerMismatch`'s, named for
 * the subcommand that prints it, so that one text names the drift and the
 * command that repairs it whoever reads the file.
 */
function refusalFor(subcommand, line) {
  return line.replace(/^record wrote nothing/, subcommand);
}

/** The entries under a document's `## Events`: each `- ` line with the indented lines that continue it. */
function eventEntries(lines) {
  const span = sectionSpan(lines, "Events");
  if (!span) return [];
  const entries = [];
  for (let i = span.start + 1; i < span.end; i++) {
    if (lines[i].startsWith("- ")) entries.push(lines[i]);
    else if (entries.length > 0 && /^\s+\S/.test(lines[i])) entries[entries.length - 1] += `\n${lines[i]}`;
  }
  return entries;
}

/**
 * `roster show [--root <dir>] [--roster <path>] [--events <n>|all] [--items]`
 * (roster-ledger 4.1): what a Start and a handover read in place of a cold
 * read, and nothing written. The first data row with Kanri's three counts;
 * every `live` and `queued` row, with ` — no state entry` for a seat the
 * spawner's state file does not hold (the old-contract row); the `cleared`
 * rows `migrate` moves; the items table's count, or its rows with
 * `--items`; and the last ten Events entries, the last `<n>`, or every one.
 * On a roster whose header is not the template's it prints what it can read
 * and ends with the line that names `migrate`, exit 1.
 */
function cmdRoster(argv) {
  const { values, positionals } = parseLine(argv, ["items"]);
  if (positionals[0] !== "show" || positionals.length > 1) return fail("roster needs show", 2);
  for (const name of ["root", "roster", "events"]) {
    if (values[name] === true) return fail(`roster show: --${name} needs a value`, 2);
  }
  const root = rootOf(values);
  const rosterPath = given(values, "roster") || path.join(root, ".tanto", "roster.md");
  const events = given(values, "events") || "10";
  if (events !== "all" && !/^\d+$/.test(events)) return fail("roster show: --events takes a number or all", 2);
  let lines;
  try {
    lines = fs.readFileSync(rosterPath, "utf8").split(/\r?\n/);
  } catch {
    return fail(`roster show: cannot read the roster at ${rosterPath}`, 2);
  }
  // The seats table as `headerAt` finds it, the template's or an older
  // shape's, so that an old roster's rows still print (roster-ledger 4.1).
  const at = headerAt(lines, null);
  if (at === null) {
    console.log(refusalFor("roster show", headerMismatch(rosterPath, "roster.md", null)));
    return 1;
  }
  const seats = stateSeats(root);
  const rows = tableRows(lines, at);
  const word = (each) => String(each[9] || "").split(/\s+/)[0];
  const first = rows[0];
  if (first) {
    const counts = [17, 18, 19].map((i) => first[i] || "—").join(" ");
    console.log(`first: ${first[2]} — ${rowSessionId(first[10]) || "—"} — ${first[9]} — counts ${counts}`);
  } else {
    console.log("first: none");
  }
  for (const each of rows) {
    if (word(each) !== "live" && word(each) !== "queued") continue;
    const sessionId = rowSessionId(each[10]);
    const entry = sessionId && seats.has(sessionId) ? "" : " — no state entry";
    console.log(`${each[0]} ${each[1]} ${each[2]} — ${each[9]} — ${sessionId || "—"}${entry}`);
  }
  const cleared = rows.filter((each) => word(each) === "cleared").length;
  if (cleared > 0) console.log(`cleared: ${cleared} rows — run boundary.js migrate`);
  const span = sectionSpan(lines, "Shoroku proposal items");
  const items = span ? tableSpan(lines, span) : null;
  const itemRows = items
    ? lines.slice(items.first, items.end).filter((line) => cells(line)[0] !== "(no item yet)")
    : [];
  console.log(`items: ${itemRows.length}`);
  if (values.items) for (const line of itemRows) console.log(line);
  const entries = eventEntries(lines);
  const count = events === "all" ? entries.length : Math.min(Number(events), entries.length);
  console.log("events:");
  for (const entry of entries.slice(entries.length - count)) console.log(entry);
  const problem = headerMismatch(rosterPath, "roster.md", null);
  if (problem) {
    console.log(refusalFor("roster show", problem));
    return 1;
  }
  return 0;
}
```

**P8.5** `skills/tanto/scripts/boundary.js` — insert after this 1 line

```js
  if (sub === "census") return cmdCensus(argv.slice(1));
```

**P8.5 →**

```js
  if (sub === "roster") return cmdRoster(argv.slice(1));
```

- [ ] **Step 4: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 8
```

Expected: `task 8: verify clean`.

- [ ] **Step 5: Run the boundary suite to verify it passes**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: every test passes, the three `roster show` tests among them.

- [ ] **Step 6: Run lint per Global Constraints**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: lint passes with no file changed.

- [ ] **Step 7: Commit per Global Constraints**

```bash
git commit --only -m "feat: boundary.js roster show prints the first row, the live and queued rows, the items count, and the Events tail (roster-ledger 4.1)" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: one commit.

### Task 9: `boundary.js archive`, and the ten subcommands

Spec section 5, and section 7's `scripts/boundary.js` entries for `archive`
and for "the usage line's list of subcommands", with their tests.
`boundary.js archive [--root <dir>] [--roster <path>] [--archive <path>]
[--now <YYYY-MM-DD>]` moves every row whose Status is `stopped`, `dead`, or
`replaced` from the roster to the archive's Sessions table, each copied
whole with Ended, `--now` or today, last; then moves every Events entry of
the roster to the archive's `## Events`, verbatim and in order; creates the
archive through Task 5's `archiveFromTemplate` when it is absent; checks
the roster's seats table and the archive's Sessions table against their
templates first, through Task 1's `headerMismatch`, and writes both or
neither, `archive wrote nothing — <path>: the <seats or Sessions> table
header is not the template's — expected …, found … — run boundary.js
migrate` on stderr, exit 1; and prints each row moved and one line,
`archive: <n> rows and <m> Events lines moved to <path>`. A second call
moves nothing. The header comment, the usage line, and its test name all
ten subcommands — `check`, `record`, `census`, `roster`, `archive`,
`migrate`, `request`, `seat`, `wake`, `beat`.

After this task, a plan close's archive move is one command that drops no
column and no line, and the script's own usage names every subcommand it
has.

**Files:**

- Modify: `skills/tanto/scripts/boundary.js` — the header comment; after
  `cmdBeat`, before Task 5's `migrate` functions: `eventSpan` and
  `cmdArchive`; `main`'s
  `archive` line, after its `record` line, and its usage line.
- Test: `skills/tanto/scripts/boundary.test.js` — "an unknown subcommand
  exits 2 and names the seven that exist"; two `archive` tests after "wake
  writes nothing on a stale spawner, and names a seat whose result never
  came".

**Interfaces:**

- Consumes: Task 1's `templates/roster.md` (the twenty-column seats header)
  and `templates/roster-archive.md` (one `## Sessions` table, the
  twenty-one-column header with Ended last, and `## Events`), and `cells()`
  and `row()` with the escape, `headerAt`, and `headerMismatch(file,
  template, heading)`; Task 5's `archiveFromTemplate(file)` and
  `sessionsEnd(lines)`, and its `cmdMigrate` and `migrate` line in `main`,
  which this task's usage line and header comment name; Task 8's
  `refusalFor` and its test helpers `templateLine`, `separatorFor`,
  `showRow`, and `rosterFixture`; `readDoc`, `writeDoc`, `stamp`,
  `sectionSpan`, `parseLine`, and `rootOf`, on `main`.
- Produces: `archive`'s lines above, which `roles/kanri.md`'s Release row
  and close (Task 15) and Global Constraint 4's close check name; the usage
  line `usage: boundary.js check|record|census|roster|archive|migrate|request|seat|wake|beat <options>`.

**Named-mechanism sites** (`git grep` at `main`).

- The subcommand list: this task owns `boundary.js`'s header comment, its
  usage line, and the test "an unknown subcommand…", and lists all ten,
  `migrate` among them; Task 5 adds `migrate`'s line to `main` and Task 8
  `roster`'s, and neither writes the list. `SKILL.md` "Artifacts", the
  scripts paragraph's "its seven subcommands" (Task 13);
  `skills/tanto/README.md` "Layout", the `scripts/boundary.js` bullet
  (Task 18).
- The archive move: `roles/kanri.md`'s close and its Release row, "the
  archive move" and its movable statuses (Task 15), and "Session
  lifecycle"'s "before the archive move" (Task 16);
  `templates/roster.md`'s Keeping rule and `templates/roster-archive.md`'s
  opening paragraph, which say the move is this command's (Task 1);
  `SKILL.md` "Artifacts", the row for `.tanto/roster-archive.md` (Task 13).
- The refusal line: `record`'s of spec 2.1 (Task 1), and `roster show`'s
  (Task 8), are Task 1's `headerMismatch` line, which `refusalFor` renames;
  a new archive is `migrate`'s too (Task 5's `archiveFromTemplate`).
- Other tasks editing `boundary.js` and `boundary.test.js`: as Task 7 lists
  them. This task takes the file's first comment, the lines after
  `cmdBeat`'s end, one line after `main`'s `record` line, `main`'s usage
  line, the unknown-subcommand test, and the lines after the `wake` test it
  names.

**O9.1** `Seven subcommands` — the header comment's count (spec 7, the usage line's list); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O9.2** `Kanri runs the next four itself` — the header comment's count of Kanri's own subcommands, `roster show`, `archive`, and `migrate` not among them (spec 7); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O9.3** `writes a document, and only` — the header comment's "Only `record` writes a document", when `archive` and `migrate` write documents too (spec 1.4, 5); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O9.4** `check|record|census|request|seat|wake|beat <options>` — the usage line without `roster`, `archive`, and `migrate` (spec 7); before: 1 in `skills/tanto/scripts/boundary.js`, after: 0.

**O9.5** `names the seven that exist` — the unknown-subcommand test's name (spec 7); before: 1 in `skills/tanto/scripts/boundary.test.js`, after: 0.

**O9.6** `check\|record\|census\|request\|seat\|wake\|beat/` — the unknown-subcommand test's pattern (spec 7); before: 1 in `skills/tanto/scripts/boundary.test.js`, after: 0.

**A9.7** `skills/tanto/scripts/boundary.js` — `grep -c 'if (sub === "archive")' skills/tanto/scripts/boundary.js` — before: 0, after: 1

**A9.8** `skills/tanto/scripts/boundary.test.js` — `grep -c '^test("archive ' skills/tanto/scripts/boundary.test.js` — before: 0, after: 2

- [ ] **Step 1: Write the failing tests**

Apply P9.9 and P9.10.

**P9.9** `skills/tanto/scripts/boundary.test.js` — replace exactly these 5 lines

```js
test("an unknown subcommand exits 2 and names the seven that exist", () => {
  const f = fixture();
  const result = run(["verify"], f.dir);
  assert.strictEqual(result.code, 2);
  assert.match(result.err, /check\|record\|census\|request\|seat\|wake\|beat/);
```

**P9.9 →**

```js
test("an unknown subcommand exits 2 and names the ten that exist", () => {
  const f = fixture();
  const result = run(["verify"], f.dir);
  assert.strictEqual(result.code, 2);
  assert.match(result.err, /check\|record\|census\|roster\|archive\|migrate\|request\|seat\|wake\|beat/);
```

**P9.10** `skills/tanto/scripts/boundary.test.js` — insert after these 4 lines

```js
  const got = sub(quiet, ["wake", "sess-a", "--root", quiet.root], { TANTO_WAKE_WAIT_MS: "300" });
  assert.strictEqual(got.out, "spawner: beating\nerror: no result — sess-a\n");
  assert.strictEqual(got.code, 1);
});
```

**P9.10 →**

```js

test("archive moves the stopped, dead, and replaced rows whole with Ended and the Events entries verbatim, creating the archive from its template, and a second call moves nothing (roster-ledger 5)", () => {
  const live = showRow("kanri", "—", "kanri-a", "live", "sess-kanri");
  const handover = "handover | 9 | 9 | 9 | 1 | context=9 | 4 | 1 | 1";
  const replaced = showRow("kanri", "—", "kanri-z", "replaced", "sess-before", handover);
  const stopped = showRow("jisso", "t", "jisso-b", "stopped", "sess-done");
  const queued = showRow("jisso", "t", "jisso-c", "queued", "sess-queued");
  const dead = showRow("sekkei", "t", "sekkei-d", "dead", "sess-dead");
  const events = [
    "- 2026-10-07 10:00 — handover accepted by kanri-a from kanri-z — /home/u/.claude/projects/p/sess-before.jsonl",
    "- 2026-10-07 11:00 — t closed",
  ];
  const f = rosterFixture([live, replaced, stopped, queued, dead], { events });
  const got = run(["archive", "--root", f.root, "--now", "2026-10-08"], f.dir);
  assert.strictEqual(got.code, 0, got.err);
  // An archive row is the roster row whole, and Ended last.
  const archived = (line) => `${line} 2026-10-08 |`;
  const out = got.out.replace(/\r\n/g, "\n").trimEnd().split("\n");
  assert.deepStrictEqual(out.slice(0, 3), [archived(replaced), archived(stopped), archived(dead)]);
  assert.match(out[3], /^archive: 3 rows and 2 Events lines moved to .+roster-archive\.md$/);
  const archive = fs.readFileSync(f.archive, "utf8").replace(/\r\n/g, "\n");
  assert.ok(archive.includes(`${templateLine("roster-archive.md")}\n`), archive);
  assert.ok(archive.includes(`\n${archived(replaced)}\n${archived(stopped)}\n${archived(dead)}\n`), archive);
  assert.ok(archive.indexOf("## Events") < archive.indexOf(events[0]), archive);
  assert.ok(archive.endsWith(`\n\n${events.join("\n")}\n`), archive);
  const roster = fs.readFileSync(f.roster, "utf8");
  assert.ok(roster.includes(`\n${live}\n${queued}\n\n`), roster);
  assert.ok(!roster.includes("sess-before") && !roster.includes("t closed"), roster);
  const again = run(["archive", "--root", f.root, "--now", "2026-10-09"], f.dir);
  assert.strictEqual(again.code, 0, again.err);
  assert.match(again.out, /^archive: 0 rows and 0 Events lines moved to /);
  assert.strictEqual(fs.readFileSync(f.archive, "utf8").replace(/\r\n/g, "\n"), archive);
});

test("archive writes neither file when the roster's or the archive's header is not the template's, and appends to an archive that is (roster-ledger 2.1, 5)", () => {
  const stopped = showRow("jisso", "t", "jisso-b", "stopped", "sess-done");
  const f = rosterFixture([showRow("kanri", "—", "kanri-a", "live", "sess-kanri"), stopped], {
    events: ["- 2026-10-07 10:00 — jisso-b stopped"],
  });
  const head = templateLine("roster-archive.md");
  const prior = `${showRow("jisso", "t", "jisso-old", "stopped", "sess-old")} 2026-10-01 |`;
  const body = (header) =>
    [
      "# tanto roster archive",
      "",
      "## Sessions",
      "",
      header,
      separatorFor(header),
      prior,
      "",
      "## Events",
      "",
      "- 2026-10-01 09:00 — earlier",
      "",
    ].join("\n");
  const drifted = head.replace("| Ended |", "| Gone |");
  fs.writeFileSync(f.archive, body(drifted));
  const rosterBefore = fs.readFileSync(f.roster, "utf8");
  const refused = run(["archive", "--root", f.root], f.dir);
  assert.strictEqual(refused.code, 1);
  assert.match(
    refused.err,
    /archive wrote nothing — .+roster-archive\.md: the Sessions table header is not the template's — expected .+\| Ended \|, found .+\| Gone \| — run boundary\.js migrate/,
  );
  assert.strictEqual(fs.readFileSync(f.roster, "utf8"), rosterBefore);
  assert.strictEqual(fs.readFileSync(f.archive, "utf8"), body(drifted));
  // The old header's Name cell, as Task 1's tests spell it.
  const header = templateLine("roster.md").replace("| Name |", `| ${OLD_NAME} |`);
  const old = rosterFixture([stopped], { header });
  const oldRefused = run(["archive", "--root", old.root], old.dir);
  assert.strictEqual(oldRefused.code, 1);
  assert.match(oldRefused.err, /archive wrote nothing — .+roster\.md: the seats table header is not the template's/);
  assert.strictEqual(fs.existsSync(old.archive), false);
  fs.writeFileSync(f.archive, body(head));
  const got = run(["archive", "--root", f.root, "--now", "2026-10-08"], f.dir);
  assert.strictEqual(got.code, 0, got.err);
  const archive = fs.readFileSync(f.archive, "utf8");
  assert.ok(archive.includes(`${prior}\n${stopped} 2026-10-08 |\n\n## Events`), archive);
  assert.ok(archive.endsWith("- 2026-10-01 09:00 — earlier\n- 2026-10-07 10:00 — jisso-b stopped\n"), archive);
});
```

- [ ] **Step 2: Run the `archive` and usage tests to verify they fail**

```bash
node --test --test-name-pattern "archive|unknown subcommand" skills/tanto/scripts/boundary.test.js
```

Expected: FAIL — the two `archive` tests, each on exit 2 and the usage
line, and "an unknown subcommand exits 2 and names the ten that exist",
whose usage line names seven.

- [ ] **Step 3: Write `archive` and the ten subcommands**

Apply P9.11 to P9.14.

**P9.11** `skills/tanto/scripts/boundary.js` — replace exactly these 14 lines

```js
// Seven subcommands. `check` runs the boundary's read-only commands and
// prints their output under fixed headings, and `record` writes the ledger's
// and the roster's rows — both run by the `boundary.verify` kind from
// `templates/boundary-brief.md`, and, under the design's shape 2, by a
// headless session running the same brief. Kanri runs the next four itself:
// `census`, the roster's `live` and `queued` rows against the spawner's state
// file and the CLI's listing of the sessions under the root, read-only;
// `seat`, a seat's status and its name at the moment of sending; `wake`, a
// `resume` for each parked seat it names; and `beat`, the spawner's
// heartbeat, read before every request. `request` is a seat's own, its
// `park` or its `leave`, written as its turn's last tool call, or the
// intake's `attention`, the notice that a consult has arrived, which names
// no seat. Only `record` writes a document, and only `wake` and `request`
// write request files. It judges nothing.
```

**P9.11 →**

```js
// Ten subcommands. `check` runs the boundary's read-only commands and
// prints their output under fixed headings, and `record` writes the ledger's
// and the roster's rows — both run by the `boundary.verify` kind from
// `templates/boundary-brief.md`, and, under the design's shape 2, by a
// headless session running the same brief. Kanri runs the next seven itself:
// `census`, the roster's rows against the spawner's state file and the CLI's
// listing of the sessions under the root, read-only; `roster show`, the
// roster's first row, its live and queued rows, its items count, and its
// Events tail, read-only; `archive`, a plan close's move of the ended rows
// and the Events lines to the archive; `migrate`, the one rewrite of a
// roster, an archive, or a ledger of an older shape into its template's;
// `seat`, a seat's status and its name at the moment of sending; `wake`, a
// `resume` for each parked seat it names; and `beat`, the spawner's
// heartbeat, read before every request. `request` is a seat's own, its
// `park` or its `leave`, written as its turn's last tool call, or the
// intake's `attention`, the notice that a consult has arrived, which names
// no seat. Only `record`, `archive`, and `migrate` write a document, and
// only `wake` and `request` write request files. It judges nothing.
```

**P9.12** `skills/tanto/scripts/boundary.js` — insert after these 4 lines

```js
  const line = spawnerLine(root);
  console.log(line);
  return line === "spawner: beating" ? 0 : 1;
}
```

**P9.12 →**

```js

/**
 * The lines of a document's `## Events` from its first entry to its last
 * non-blank line, end-exclusive — the section's own prose before the first
 * entry left out — or null when there is no such section.
 */
function eventSpan(lines) {
  const span = sectionSpan(lines, "Events");
  if (!span) return null;
  let start = span.start + 1;
  while (start < span.end && !lines[start].startsWith("- ")) start++;
  let end = span.end;
  while (end > start && lines[end - 1].trim() === "") end--;
  return { start, end };
}

/**
 * `archive [--root <dir>] [--roster <path>] [--archive <path>] [--now
 * <YYYY-MM-DD>]` (roster-ledger 5): a plan close's move. Every row whose
 * Status is `stopped`, `dead`, or `replaced` leaves the roster for the
 * archive's Sessions table, copied whole with Ended, `--now` or today; then
 * every Events entry of the roster moves to the archive's `## Events`,
 * verbatim and in order. A `queued` row that never ran moves once Kanri has
 * written it `stopped`, and a `cleared` row is `migrate`'s. The archive is
 * created from its template when absent; both headers are checked against
 * their templates first (roster-ledger 2.1), and both files are written or
 * neither. Prints each row moved and one count line; a second call moves
 * nothing.
 */
function cmdArchive(argv) {
  const { values } = parseLine(argv, []);
  for (const name of ["root", "roster", "archive", "now"]) {
    if (values[name] === true) return fail(`archive: --${name} needs a value`, 2);
  }
  const root = rootOf(values);
  const rosterPath = given(values, "roster") || path.join(root, ".tanto", "roster.md");
  const archivePath = given(values, "archive") || path.join(root, ".tanto", "roster-archive.md");
  if (!fs.existsSync(rosterPath)) return fail(`archive: --roster ${rosterPath} is not on disk`, 2);
  const ended = (given(values, "now") || stamp(new Date())).slice(0, 10);
  const roster = readDoc(rosterPath);
  const archive = fs.existsSync(archivePath) ? readDoc(archivePath) : archiveFromTemplate(archivePath);

  // Both headers against their templates first (roster-ledger 2.1); an
  // archive not on disk yet is the template's own. `record`'s line, named
  // for this command.
  const refused = [
    headerMismatch(rosterPath, "roster.md", null),
    headerMismatch(archivePath, "roster-archive.md", "Sessions"),
  ].filter(Boolean);
  if (!sectionSpan(archive.lines, "Events")) {
    refused.push(`record wrote nothing — ${archivePath}: no Events section — run boundary.js migrate`);
  }
  if (refused.length > 0) {
    for (const line of refused) fail(refusalFor("archive wrote nothing", line), 1);
    return 1;
  }

  const at = headerAt(roster.lines, null);
  const width = cells(roster.lines[at]).length;
  let end = at + 2;
  while (end < roster.lines.length && roster.lines[end].startsWith("|")) end++;
  const moved = [];
  for (let i = end - 1; i >= at + 2; i--) {
    const current = cells(roster.lines[i]);
    if (!["stopped", "dead", "replaced"].includes(String(current[9] || "").split(/\s+/)[0])) continue;
    while (current.length < width) current.push("—");
    moved.unshift(row([...current.slice(0, width), ended]));
    roster.lines.splice(i, 1);
  }
  archive.lines.splice(sessionsEnd(archive.lines), 0, ...moved);

  const from = eventSpan(roster.lines);
  const moving = from ? roster.lines.splice(from.start, from.end - from.start) : [];
  if (moving.length > 0) {
    const to = sectionSpan(archive.lines, "Events");
    let at = to.end;
    while (at > to.start + 1 && archive.lines[at - 1].trim() === "") at--;
    // A blank line between the heading, or the section's prose, and the first entry.
    const gap = /^(- |\s)/.test(archive.lines[at - 1]) ? [] : [""];
    archive.lines.splice(at, 0, ...gap, ...moving);
  }
  writeDoc(archive);
  writeDoc(roster);
  for (const line of moved) console.log(line);
  const entries = moving.filter((line) => line.startsWith("- ")).length;
  console.log(`archive: ${moved.length} rows and ${entries} Events lines moved to ${archivePath}`);
  return 0;
}
```

**P9.13** `skills/tanto/scripts/boundary.js` — insert after this 1 line

```js
  if (sub === "record") return cmdRecord(argv.slice(1));
```

**P9.13 →**

```js
  if (sub === "archive") return cmdArchive(argv.slice(1));
```

**P9.14** `skills/tanto/scripts/boundary.js` — replace exactly this 1 line

```js
  return fail("usage: boundary.js check|record|census|request|seat|wake|beat <options>", 2);
```

**P9.14 →**

```js
  return fail("usage: boundary.js check|record|census|roster|archive|migrate|request|seat|wake|beat <options>", 2);
```

- [ ] **Step 4: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 9
```

Expected: `task 9: verify clean`.

- [ ] **Step 5: Run the boundary suite to verify it passes**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: every test passes, the two `archive` tests and the
unknown-subcommand test among them.

- [ ] **Step 6: Run lint per Global Constraints**

```bash
./scripts/lint.sh skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: lint passes with no file changed.

- [ ] **Step 7: Commit per Global Constraints**

```bash
git commit --only -m "feat: boundary.js archive moves the ended rows and the Events lines, and the usage names ten subcommands (roster-ledger 5)" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/boundary.js skills/tanto/scripts/boundary.test.js
```

Expected: one commit.

### Task 10: `spawner.js`: the `ack` op and the `renamed` mark go, and the seat keeps its branch

Spec section 3's last paragraph (c330) and 2.4's last sentence, and section
7's `scripts/spawner.js` entry with its test. `OPS` loses `ack`, eight ops
remaining, and a request whose op is `ack` is answered as every unknown op
is, `unknown op ack`; the spawner's census rewrites a renamed seat's `name`
and logs the rename as today, and sets no `renamed` mark, which no code
read; and a `spawn` records `request.branch` on the seat it writes to
`seats.json`, so that `record --seat <sessionId>` writes the Branch cell
from the state entry. `templates/spawn-request.md`, which documents the
ops in `OPS`'s order and the `branch` field, says the same.

After this task, the state file carries nothing the run never reads, and
every cell a roster row needs is in the seat's entry.

**Files:**

- Modify: `skills/tanto/scripts/spawner.js` — `OPS`; `readSeats`'s comment;
  `spawnArgs`'s comment; `opSpawn`'s seat; `handleRequest`'s last op; the
  census pass's rename.
- Modify: `skills/tanto/templates/spawn-request.md` — the opening
  paragraph's list of Kanri's ops; the `op`, `branch`, and `sessionId`
  bullets; the results paragraph's `ack` clause.
- Test: `skills/tanto/scripts/spawner.test.js` — "ack clears the renamed
  mark of the session it names", rewritten; "a spawn writes the result, the
  seat, and deletes the request", one assertion added.

**Interfaces:**

- Consumes: nothing of another task; `handleRequest`'s `unknown op` answer,
  on `main`.
- Produces: the seat's `branch` field in `.tanto/spawner/seats.json`, which
  Task 3's `record --seat <sessionId>` writes the Branch cell from; eight
  ops, which `SKILL.md`'s Artifacts row for `.tanto/spawner/` (Task 13)
  lists.

**Named-mechanism sites** (`git grep` at `main`).

- `ack`: `SKILL.md` "The address", the beat sentence "a `spawn`, a `stop`,
  an `attention`, or an `ack`" (Task 12), and "Artifacts", the
  `.tanto/spawner/` row's nine ops (Task 13); `roles/kanri.md` "Sending to a
  seat", the beat sentence (Task 14); `templates/spawn-request.md`, this
  task. No other script names the op.
- The `renamed` mark: no reader in any script; the census's `— renamed`
  suffix in `boundary.js` is derived from the listing and stays (Task 7);
  `SKILL.md` "Resuming"'s "the `renamed` marks reconciled" names that
  suffix and stays; Kanri's act on it is `--rename` (Task 3).
- `branch`: `tanto.js`'s `spawnRequest` writes it from `branchOf`, and
  every Kanri `spawn` carries it, on `main`; `record --seat`'s Branch cell
  from a result or a state entry (Task 3).
- `templates/spawn-request.md` is a run-time template Kanri reads when it
  writes a request; its passages here are the whole of this task's edit to
  it, and no other task edits it.

**O10.1** `"ack"` — the op in `OPS` and the test's request (spec 3, c330; the spec's fourth needle); before: 1 in `skills/tanto/scripts/spawner.js` and 1 in `skills/tanto/scripts/spawner.test.js`, after: 0 in both. The rewritten test spells the retired op in two parts.

**O10.2** `// ack` — `handleRequest`'s last op (spec 3); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O10.3** `seat.renamed` — the mark set by the census pass and deleted by `ack` (spec 3; the spec's fourth needle); before: 2 in `skills/tanto/scripts/spawner.js`, after: 0.

**A10.4** `skills/tanto/scripts/spawner.js` — `grep -c 'renamed., .goneAt' skills/tanto/scripts/spawner.js` — before: 1, after: 0

A10.4 counts `readSeats`'s comment, which lists the `renamed` mark among the
seat's fields (spec 3): an anchor, because the old value's own spelling
carries backticks, which no needle can hold.

**A10.5** `skills/tanto/scripts/spawner.js` — `grep -w acked skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js skills/tanto/templates/spawn-request.md | wc -l` — before: 3, after: 0

A10.5 counts `ack`'s result field as a word, one line in each of the three
files (spec 3): an anchor and not a needle, since the bare string is a
substring of "tracked" and "stacked" in the role text and the brief.

**A10.6** `skills/tanto/templates/spawn-request.md` — `grep -c '[^a-z]ack[^a-z]' skills/tanto/templates/spawn-request.md` — before: 4, after: 0

A10.6 counts the op in the request template's four lists (spec 3; the
spec's fourth needle in its backticked spelling, counted as a word by an
anchor for the same reason); the same count over
`skills/tanto/scripts/spawner.js` is 0 before and after. Its hits in
`SKILL.md` and `roles/kanri.md` are Tasks 12 to 14's.

**O10.7** `ack clears the renamed mark` — the test of the retired op (spec 3); before: 1 in `skills/tanto/scripts/spawner.test.js`, after: 0.

**O10.8** `].renamed` — the test's reads of the mark (spec 3); before: 2 in `skills/tanto/scripts/spawner.test.js`, after: 0.

**O10.9** `carried through into the result` — `spawnArgs`'s comment, which names the result alone as `branch`'s carrier (spec 2.4); before: 1 in `skills/tanto/scripts/spawner.js`, after: 0.

**O10.10** `'s Branch column` — the request template's `branch` bullet and `spawnArgs`'s comment, which name the result alone as the Branch cell's source (spec 2.4); before: 1 in `skills/tanto/templates/spawn-request.md` and 1 in `skills/tanto/scripts/spawner.js`, after: 0 in both.

**A10.11** `skills/tanto/scripts/spawner.test.js` — `grep -c 'seats(ws)\[0\].branch' skills/tanto/scripts/spawner.test.js` — before: 0, after: 1

- [ ] **Step 1: Write the failing tests**

Apply P10.12 and P10.13.

**P10.12** `skills/tanto/scripts/spawner.test.js` — replace exactly these 25 lines

```js
test("ack clears the renamed mark of the session it names", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, {
    sessions: [
      {
        sessionId: "sess-new",
        name: "seat-two [cccccc]",
        cwd: ws.root,
        kind: "background",
        state: "running",
        id: "bg01",
        pid: 1111,
      },
    ],
  });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(seats(ws)[0].renamed, namePattern(ws, "jisso", "t"));
  const { id } = request(ws, { op: "ack", sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).acked, /\d/);
  assert.equal(seats(ws)[0].renamed, undefined);
  assert.equal(seats(ws)[0].name, "seat-two [cccccc]");
});
```

**P10.12 →**

```js
test("a renamed seat takes the listed name with no mark beside it, and the retired op is an unknown op (roster-ledger 3, c330)", () => {
  const ws = workspace();
  request(ws, SPAWN);
  run(ws, ["run", "--root", ws.root, "--once"]);
  setState(ws, {
    sessions: [
      {
        sessionId: "sess-new",
        name: "seat-two [cccccc]",
        cwd: ws.root,
        kind: "background",
        state: "running",
        id: "bg01",
        pid: 1111,
      },
    ],
  });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.equal(seats(ws)[0].name, "seat-two [cccccc]");
  assert.equal(Object.hasOwn(seats(ws)[0], "renamed"), false);
  assert.match(spawnerLog(ws), /census: sess-new renamed to seat-two \[cccccc\]/);
  // The retired op, spelled in two parts so that the plan's sweep for it finds none.
  const { id } = request(ws, { op: ["ac", "k"].join(""), sessionId: "sess-new" });
  run(ws, ["run", "--root", ws.root, "--once"]);
  assert.match(result(ws, id).error, /unknown op ack/);
});
```

**P10.13** `skills/tanto/scripts/spawner.test.js` — insert after this 1 line

```js
  assert.equal(seats(ws)[0].role, "jisso");
```

**P10.13 →**

```js
  // The request's branch on the seat, for `record --seat <sessionId>` (roster-ledger 2.4).
  assert.equal(seats(ws)[0].branch, "t");
```

- [ ] **Step 2: Run the two tests to verify they fail**

```bash
node --test --test-name-pattern "a renamed seat|a spawn writes the result" skills/tanto/scripts/spawner.test.js
```

Expected: FAIL — both tests: the seat carries no `branch`, and the renamed
seat carries the `renamed` mark. Run in the background with the output in a
file, as Global Constraints say for `spawner.test.js`.

- [ ] **Step 3: Remove the op and the mark, and keep the branch**

Apply P10.14 to P10.24.

**P10.14** `skills/tanto/scripts/spawner.js` — replace exactly this 1 line

```js
const OPS = ["spawn", "stop", "rm", "resume", "attention", "ack", "park", "hold", "release"];
```

**P10.14 →**

```js
const OPS = ["spawn", "stop", "rm", "resume", "attention", "park", "hold", "release"];
```

**P10.15** `skills/tanto/scripts/spawner.js` — replace exactly these 5 lines

```js
 * `seats.json` holds one array, `seats`. A seat carries what its spawn knew
 * — `sessionId`, `id`, `name`, `role`, `topic`, `model`, `effort`, `mode`,
 * `worktree`, `cwd`, `startedAt`, `startedAtMs`, `transcript` — the marks
 * earlier rules set — `renamed`, `goneAt`, `noFirstTurn`, `strayed`,
 * `undelivered` — and these (spec 2.8, section 6):
```

**P10.15 →**

```js
 * `seats.json` holds one array, `seats`. A seat carries what its spawn knew
 * — `sessionId`, `id`, `name`, `role`, `topic`, `model`, `effort`, `branch`,
 * `mode`, `worktree`, `cwd`, `startedAt`, `startedAtMs`, `transcript` — the
 * marks earlier rules set — `goneAt`, `noFirstTurn`, `strayed`,
 * `undelivered` — and these (spec 2.8, section 6):
```

**P10.16** `skills/tanto/scripts/spawner.js` — replace exactly these 5 lines

```js
 * and the CLI brings back the options the spawn passed. `request.branch` is
 * not read here — it is informational, carried through into the result and
 * then into `record --seat`'s Branch column (`boundary.js`); a worktree
 * seat's real branch is Kanri's `worktree-shoki-<topic>`, cut in the merge
 * act (Important 4, task 26; Minor 5, branch-review.md).
```

**P10.16 →**

```js
 * and the CLI brings back the options the spawn passed. `request.branch` is
 * not read here — it is informational, carried into the result and into the
 * seat's state entry, from either of which `record --seat` writes the
 * Branch column (`boundary.js`; roster-ledger 2.4); a worktree seat's real
 * branch is Kanri's `worktree-shoki-<topic>`, cut in the merge act
 * (Important 4, task 26; Minor 5, branch-review.md).
```

**P10.17** `skills/tanto/scripts/spawner.js` — replace exactly these 3 lines

```js
    model: request.model,
    effort: request.effort,
    mode: request.mode || "auto",
```

**P10.17 →**

```js
    model: request.model,
    effort: request.effort,
    branch: request.branch,
    mode: request.mode || "auto",
```

**P10.18** `skills/tanto/scripts/spawner.js` — replace exactly these 13 lines

```js
  if (request.op === "release") {
    if (!seat) return { error: `unknown seat ${request.sessionId}` };
    // The mark alone (spec 2.4): a park the seat asked for while it was held
    // proceeds at the next pass, and a seat that asked for none is left to
    // its own next turn's end.
    delete seat.held;
    return { released: stamp() };
  }

  // ack
  if (seat) delete seat.renamed;
  return { acked: stamp() };
}
```

**P10.18 →**

```js
  // release, the last of the eight ops: the op that cleared the census's
  // rename mark is gone with the mark (roster-ledger 3, c330).
  if (!seat) return { error: `unknown seat ${request.sessionId}` };
  // The mark alone (spec 2.4): a park the seat asked for while it was held
  // proceeds at the next pass, and a seat that asked for none is left to
  // its own next turn's end.
  delete seat.held;
  return { released: stamp() };
}
```

**P10.19** `skills/tanto/scripts/spawner.js` — replace exactly these 5 lines

```js
  if (session.name && session.name !== seat.name) {
    seat.renamed = seat.name;
    seat.name = session.name;
    appendLog(root, `census: ${seat.sessionId} renamed to ${session.name}`);
  }
```

**P10.19 →**

```js
  // The name the listing shows now, and no mark beside it: the census's
  // `— renamed` reads the listed name against the row's Name cell, and the
  // mark had no reader (roster-ledger 3, c330).
  if (session.name && session.name !== seat.name) {
    seat.name = session.name;
    appendLog(root, `census: ${seat.sessionId} renamed to ${session.name}`);
  }
```

**P10.20** `skills/tanto/templates/spawn-request.md` — replace exactly this 1 line

```markdown
`stop`, `rm`, `attention`, `ack`, and `release`, and, through
```

**P10.20 →**

```markdown
`stop`, `rm`, `attention`, and `release`, and, through
```

**P10.21** `skills/tanto/templates/spawn-request.md` — replace exactly these 2 lines

```markdown
- `op` — one of `spawn`, `stop`, `rm`, `resume`, `attention`, `ack`,
  `park`, `hold`, and `release`. `rm` is written for shoki alone; the
```

**P10.21 →**

```markdown
- `op` — one of the eight, `spawn`, `stop`, `rm`, `resume`, `attention`,
  `park`, `hold`, and `release`. `rm` is written for shoki alone; the
```

**P10.22** `skills/tanto/templates/spawn-request.md` — replace exactly these 3 lines

```markdown
- `branch` — the branch the shared tree is on when the request is written.
  Informational: `spawnArgs` never reads it; it is carried into the result
  and then into `record --seat`'s Branch column.
```

**P10.22 →**

```markdown
- `branch` — the branch the shared tree is on when the request is written.
  Informational: `spawnArgs` never reads it; it is carried into the result
  and into the seat's entry in `seats.json`, from either of which
  `record --seat` writes the Branch column.
```

**P10.23** `skills/tanto/templates/spawn-request.md` — replace exactly these 2 lines

```markdown
- `sessionId` — the seat's identity, for `stop`, `rm`, `resume`, `ack`,
  `attention`, `park`, `hold`, and `release`.
```

**P10.23 →**

```markdown
- `sessionId` — the seat's identity, for `stop`, `rm`, `resume`,
  `attention`, `park`, `hold`, and `release`.
```

**P10.24** `skills/tanto/templates/spawn-request.md` — replace exactly these 2 lines

```markdown
the spawn gave; `attention` adds `notified` and `channel`; `ack` adds
`acked`. A `stop` or `rm` whose session the CLI had already dropped —
```

**P10.24 →**

```markdown
the spawn gave; and `attention` adds `notified` and `channel`. A `stop` or
`rm` whose session the CLI had already dropped —
```

- [ ] **Step 4: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 10
```

Expected: `task 10: verify clean`.

- [ ] **Step 5: Run the spawner suite to verify it passes**

```bash
node --test skills/tanto/scripts/spawner.test.js
```

Expected: every test passes, the two of Step 2 among them. About eight
minutes: in the background with the output in a file, read after the
completion notice.

- [ ] **Step 6: Run lint per Global Constraints**

```bash
./scripts/lint.sh skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js skills/tanto/templates/spawn-request.md
```

Expected: lint passes with no file changed.

- [ ] **Step 7: Commit per Global Constraints**

```bash
git commit --only -m "feat: spawner.js drops the ack op and the renamed mark, and keeps the request's branch on the seat (roster-ledger 3, 2.4)" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/spawner.js skills/tanto/scripts/spawner.test.js skills/tanto/templates/spawn-request.md
```

Expected: one commit.

### Task 11: `tanto.js`: the shared cell grammar, and entering the Kanri the spawner holds

Spec section 6 and 2.2's launcher sentence, and section 7's
`scripts/tanto.js` entry with its test. `tanto.js` requires `cells` from
`boundary.js`, which exports it and runs its subcommands only as the command
itself; `firstRosterRow` and `rosterRows` read a row through it, so that a
`\|` inside a cell moves no column; and `oldShapeLine`'s `cleared` test goes,
a `cleared` row being `migrate`'s to move. In the Kanri branch, with no
handover file: when the spawner answers the launcher's own Kanri `spawn`
with `error: held: <sessionId>`, the launcher prints
`tanto: the roster's first row does not name the Kanri the spawner holds,
<sessionId>; entering it — run boundary.js roster show` and enters that
seat — attached when the listing shows it, else by the one `resume` with
the `/tanto fukki` prompt, since a `gone` holder has nothing to attach to —
and writes no second spawn; and when a first row's `sessionId` matches
neither the listing nor the state file, the state file's Kanri held as
`KANRI_RESUMABLE` defines it is found by role, as with no row, and entered
the same way, before any spawn request. A `held:` answer during a handover
names a second Kanri beside the successor's spawn, and stays a refusal, as
"a handover successor row the live listing has lost is not attached to
directly" tests. The tests' roster header is the template's twenty columns.

After this task, the human steps into the Kanri the run holds with the same
command whichever row the roster's first line carries, and the launcher
reads a cell the way `record` writes it.

**Files:**

- Modify: `skills/tanto/scripts/tanto.js` — the requires; `firstRosterRow`;
  `rosterRows`; `oldShapeLine`; `enterHeldKanri`, new, after
  `kanriRequest`; `cmdUp`'s `held`, its `entered`, its Kanri branches, and
  its `resumeLost` call.
- Modify: `skills/tanto/scripts/boundary.js` — its last line: `cells`
  exported, `main` run only when the file is the command.
- Test: `skills/tanto/scripts/tanto.test.js` — `ROSTER_HEAD`, `READINGS`,
  and `writeRoster`; `heldLine`; "an old-shape roster earns one line…";
  four new tests after "a Kanri resume that fails says so in one line and
  spawns a new Kanri".

**Interfaces:**

- Consumes: Task 1's `cells(line)` in `boundary.js` — a row's cells, a `\|`
  read back as `|`; Task 8's `roster show`, which the held line names; the
  spawner's `held: <sessionId>` refusal and `holds()`, which count a `gone`
  Kanri, on `main`.
- Produces: `module.exports = { cells }` from `boundary.js`; the held line
  above, which `roles/kanri.md` and the README do not quote; no new
  request op or field.

**Named-mechanism sites** (`git grep` at `main`).

- The cell grammar: `cells()` and `row()` with the escape are Task 1's;
  `successorOf` reads `firstRosterRow` and needs no change of its own.
- The old-contract line: `roles/kanri.md` "Start" step 4, which names a
  `cleared` row among the old-contract ones (Task 14); `skills/tanto/README.md`
  "Moving a run", the launcher's old-contract line (Task 18).
- `held:`: `spawner.js`'s `opSpawn` refusal, unchanged; `roles/kanri.md`
  "Session lifecycle"'s sentence on the successor's request answered
  `held:`, which stays (Task 16's heading, no change there for this);
  `templates/roster.md`'s Keeping rule, `held: <sessionId>` (Task 1).
- The fukki resume: the held-Kanri branch's resume and `enterHeldKanri`'s
  carry the same `/tanto fukki` prompt; `resumeLost` leaves the Kanri that
  either entered.
- `boundary.js`'s last line is this task's alone; Tasks 1 to 9's edits to
  the file are as Task 7 lists them.
- The tests' twenty-column `ROSTER_HEAD` is spec 1.1's header, which Task
  1's `templates/roster.md` carries; the handover-follow tests' own
  eleven-cell rows under it read the same, `cells()` taking any width.

**O11.1** `.split("|")` — `firstRosterRow` and `rosterRows` splitting a row themselves (spec 2.2); before: 2 in `skills/tanto/scripts/tanto.js`, after: 0. `boundary.js`'s own two, in `cells()` and in `writeSItem`, are the grammar's and are Tasks 1 and 4's to keep or rewrite; this needle is measured over `tanto.js` alone.

**O11.2** `row.status.startsWith("cleared")` — `oldShapeLine`'s `cleared` test (spec 2.2, 1.3); before: 1 in `skills/tanto/scripts/tanto.js`, after: 0.

**O11.3** `row whose status is cleared` — `oldShapeLine`'s comment, the same (spec 2.2); before: 1 in `skills/tanto/scripts/tanto.js`, after: 0.

**O11.4** `as its eleven cells` — `firstRosterRow`'s comment (spec 1.1, 2.2); before: 1 in `skills/tanto/scripts/tanto.js`, after: 0.

**O11.5** `const held = row` — the Kanri found by the first row's `sessionId` alone, so that a row the state file does not hold left the launcher no Kanri to enter (spec 6); before: 1 in `skills/tanto/scripts/tanto.js`, after: 0.

**O11.6** `resumeLost(root, seats, byId, held);` — the resume loop told of the row's Kanri alone, which would resume a `running` holder a `held:` answer had already entered (spec 6); before: 1 in `skills/tanto/scripts/tanto.js`, after: 0.

**O11.7** `Name [ref]` — the tests' roster header (spec 1.1; the spec's second needle, swept over `skills/tanto/` whole); before: 1 in `skills/tanto/scripts/tanto.test.js`, after: 0. Its hits in `boundary.js` and `boundary.test.js` are Task 1's.

**O11.8** `(kikaku, sekkei)` — the old-contract line counting a `cleared` row (spec 2.2); before: 1 in `skills/tanto/scripts/tanto.test.js`, after: 0.

**A11.9** `skills/tanto/scripts/tanto.js` — `grep -c 'require("./boundary.js")' skills/tanto/scripts/tanto.js` — before: 0, after: 1

**A11.10** `skills/tanto/scripts/tanto.js` — `grep -c '^function enterHeldKanri' skills/tanto/scripts/tanto.js` — before: 0, after: 1

**A11.11** `skills/tanto/scripts/boundary.js` — `grep -c 'require.main === module' skills/tanto/scripts/boundary.js` — before: 0, after: 1

**A11.12** `skills/tanto/scripts/tanto.test.js` — `grep -c '^const heldLine' skills/tanto/scripts/tanto.test.js` — before: 0, after: 1

- [ ] **Step 1: Write the failing tests**

Apply P11.13 to P11.17. P11.13 brings the tests' roster to the twenty
columns; P11.14 adds the held line; P11.15 and P11.16 take the `cleared` row
out of the old-contract line; P11.17 adds the four tests.

**P11.13** `skills/tanto/scripts/tanto.test.js` — replace exactly these 12 lines

```js
const ROSTER_HEAD = [
  "# tanto roster",
  "",
  "| Role | Topic | Name [ref] | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
];

function writeRoster(ws, status, transcript) {
  fs.mkdirSync(path.join(ws.root, ".tanto"), { recursive: true });
  const row = `| kanri | — | seat-live [ffffff] | ${ws.root} | sonnet | high | main | auto | 2026-09-21 09:00 | ${status} | ${transcript} |`;
  fs.writeFileSync(path.join(ws.root, ".tanto", "roster.md"), `${[...ROSTER_HEAD, row].join("\n")}\n`);
}
```

**P11.13 →**

```js
// The roster template's twenty columns (roster-ledger 1.1): the seat's
// eleven, then the nine reading columns, blank until a reading lands.
const ROSTER_HEAD = [
  "# tanto roster",
  "",
  "| Role | Topic | Name | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
];
const READINGS = "— | — | — | — | — | — | 0 | 0 | 0";

function writeRoster(ws, status, transcript) {
  fs.mkdirSync(path.join(ws.root, ".tanto"), { recursive: true });
  const row = `| kanri | — | seat-live [ffffff] | ${ws.root} | sonnet | high | main | auto | 2026-09-21 09:00 | ${status} | ${transcript} | ${READINGS} |`;
  fs.writeFileSync(path.join(ws.root, ".tanto", "roster.md"), `${[...ROSTER_HEAD, row].join("\n")}\n`);
}
```

**P11.14** `skills/tanto/scripts/tanto.test.js` — insert after these 2 lines

```js
const TRUST =
  "this folder's trust is not recorded: run claude here once and answer \"Yes, I trust this folder\" — the agent view's own trust question after ← or /exit takes no input";
```

**P11.14 →**

```js
// The line the launcher prints before it enters the Kanri the spawner holds
// and the roster's first row does not name (roster-ledger 6).
const heldLine = (sessionId) =>
  `tanto: the roster's first row does not name the Kanri the spawner holds, ${sessionId}; entering it — run boundary.js roster show`;
```

**P11.15** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
test("an old-shape roster earns one line naming its roles, and the launcher goes on (spec 4.7)", () => {
```

**P11.15 →**

```js
test("an old-shape roster earns one line naming its roles, a cleared row no longer among them, and the launcher goes on (spec 4.7; roster-ledger 2.2)", () => {
```

**P11.16** `skills/tanto/scripts/tanto.test.js` — replace exactly this 1 line

```js
    'old-contract rows in .tanto/roster.md (kikaku, sekkei): those windows are no longer seats of this run — see the README, "Moving a run"';
```

**P11.16 →**

```js
    'old-contract rows in .tanto/roster.md (sekkei): those windows are no longer seats of this run — see the README, "Moving a run"';
```

**P11.17** `skills/tanto/scripts/tanto.test.js` — insert after these 4 lines

```js
  assert.match(got.err, /^tanto: the Kanri resume failed — .*unknown session sess-live.*; spawning a new Kanri$/m);
  assert.equal(requests(ws).filter((r) => r.op === "spawn" && r.role === "kanri").length, 1);
  assert.equal(lastAttach(ws), "bg01", got.err);
});
```

**P11.17 →**

```js

test("a held: answer to the launcher's Kanri spawn enters the listed Kanri the spawner holds, the line first, and writes no second spawn (roster-ledger 6, f07a)", () => {
  const ws = workspace([LIVE_KANRI]);
  writeRoster(ws, "replaced", "/tmp/sess-before.jsonl");
  writeSeats(ws, [
    { sessionId: "sess-before", id: "bg03", name: "seat-before", role: "kanri", status: "stopped" },
    { sessionId: "sess-live", id: "bg07", name: "seat-live [ffffff]", role: "kanri", status: "running", contract: 2 },
  ]);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.ok(got.out.split(/\r?\n/).includes(heldLine("sess-live")), got.out);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 1);
  assert.equal(requests(ws).filter((r) => r.op === "resume").length, 0);
  assert.deepEqual(attaches(ws), ["bg07"]);
});

test("a held: answer naming a gone Kanri enters it by the one resume with the fukki word, and writes no second spawn (roster-ledger 6)", () => {
  const ws = workspace([{ ...LIVE_KANRI, hidden: true }]);
  writeRoster(ws, "replaced", "/tmp/sess-before.jsonl");
  writeSeats(ws, [
    { sessionId: "sess-before", id: "bg03", name: "seat-before", role: "kanri", status: "stopped" },
    {
      sessionId: "sess-live",
      id: "bg07",
      name: "seat-live [ffffff]",
      role: "kanri",
      status: "gone",
      goneAt: "x",
      contract: 2,
    },
  ]);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.ok(got.out.split(/\r?\n/).includes(heldLine("sess-live")), got.out);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 1);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "resume")
      .map((r) => [r.sessionId, r.prompt]),
    [["sess-live", "/tanto fukki"]],
  );
  assert.deepEqual(attaches(ws), ["bg07"]);
});

test("a first row whose sessionId neither the listing nor the state file holds enters the state file's Kanri by role, the line first, and spawns none (roster-ledger 6, a14f)", () => {
  const ws = workspace([{ ...LIVE_KANRI, hidden: true }]);
  // f07a's cell: the separators lost, so the basename names no seat of the run.
  writeRoster(ws, "live", "C:Usersu.claudeprojectspsess-live.jsonl");
  writeSeats(ws, [
    {
      sessionId: "sess-live",
      id: "bg07",
      name: "seat-live [ffffff]",
      role: "kanri",
      status: "gone",
      goneAt: "x",
      contract: 2,
    },
  ]);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.ok(got.out.split(/\r?\n/).includes(heldLine("sess-live")), got.out);
  assert.equal(requests(ws).filter((r) => r.op === "spawn").length, 0);
  assert.deepEqual(
    requests(ws)
      .filter((r) => r.op === "resume")
      .map((r) => [r.sessionId, r.prompt]),
    [["sess-live", "/tanto fukki"]],
  );
  assert.deepEqual(attaches(ws), ["bg07"]);
});

test("the roster's first row is read through boundary.js's cells(): a \\| inside a cell moves no column (roster-ledger 2.2)", () => {
  const ws = workspace([LIVE_KANRI]);
  fs.mkdirSync(path.join(ws.root, ".tanto"), { recursive: true });
  const row = `| kanri | — | seat-live [ffffff] | ${ws.root} \\| a copy | sonnet | high | main | auto | 2026-09-21 09:00 | live | /tmp/sess-live.jsonl | ${READINGS} |`;
  fs.writeFileSync(path.join(ws.root, ".tanto", "roster.md"), `${[...ROSTER_HEAD, row].join("\n")}\n`);
  const got = launch(ws, ["--timeout", "20000"]);
  assert.equal(got.code, 0, got.err);
  assert.deepEqual(attaches(ws), ["bg07"]);
  assert.equal(requests(ws).filter((r) => r.op === "spawn" || r.op === "resume").length, 0);
});
```

- [ ] **Step 2: Run the launcher's new tests to verify they fail**

```bash
node --test --test-name-pattern "roster-ledger" skills/tanto/scripts/tanto.test.js
```

Expected: FAIL — five tests: the four new ones (the `held:` answer reported
as a failed spawn, a spawn written for the unknown first row, and the `\|`
cell read as two cells) and "an old-shape roster earns one line…" (the
`cleared` row still counted). Run in the background with the output in a
file, as Global Constraints say for `tanto.test.js`.

- [ ] **Step 3: Read through `cells()` and enter the held Kanri**

Apply P11.18 to P11.28.

**P11.18** `skills/tanto/scripts/boundary.js` — replace exactly this 1 line

```js
process.exitCode = main(process.argv.slice(2));
```

**P11.18 →**

```js
// `tanto.js` reads the roster's cells through this file's own grammar
// (roster-ledger 2.2), so the subcommands run only when the file is the
// command itself.
module.exports = { cells };
if (require.main === module) process.exitCode = main(process.argv.slice(2));
```

**P11.19** `skills/tanto/scripts/tanto.js` — insert after this 1 line

```js
const { readSeats, spawnerDir, underRoot, appendLog, heartbeatPath, HEARTBEAT_STALE_MS } = require("./spawner.js");
```

**P11.19 →**

```js
// The roster's cells, read by `boundary.js`'s own grammar, the one place a
// `\|` inside a cell is read back (roster-ledger 2.2).
const { cells } = require("./boundary.js");
```

**P11.20** `skills/tanto/scripts/tanto.js` — replace exactly this 1 line

```js
/** The roster's first data row, as its eleven cells, or null. */
```

**P11.20 →**

```js
/**
 * The roster's first data row, or null: its cells read through
 * `boundary.js`'s `cells()`, so that a `\|` inside a cell moves no column
 * (roster-ledger 2.2).
 */
```

**P11.21** `skills/tanto/scripts/tanto.js` — replace exactly these 6 lines

```js
  const cells = row
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
  if (cells.length < 11) return null;
  return { name: cells[2], status: cells[9], sessionId: path.basename(cells[10], ".jsonl") };
```

**P11.21 →**

```js
  const found = cells(row);
  if (found.length < 11) return null;
  return { name: found[2], status: found[9], sessionId: path.basename(found[10], ".jsonl") };
```

**P11.22** `skills/tanto/scripts/tanto.js` — replace exactly these 6 lines

```js
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
    if (cells.length >= 11)
      rows.push({ role: cells[0], status: cells[9], sessionId: path.basename(cells[10], ".jsonl") });
```

**P11.22 →**

```js
    const found = cells(line);
    if (found.length < 11) continue;
    rows.push({ role: found[0], status: found[9], sessionId: path.basename(found[10], ".jsonl") });
```

**P11.23** `skills/tanto/scripts/tanto.js` — replace exactly these 11 lines

```js
/**
 * The one line an old-shape roster earns (spec 4.7), read once at a start: a
 * row whose status is cleared, or a live or queued row whose session the
 * state file has no seat for, belongs to the old contract. The line informs
 * and asks for no act.
 */
function oldShapeLine(root, seats) {
  const known = new Set(seats.map((s) => s.sessionId));
  const old = rosterRows(root).filter(
    (row) => row.status.startsWith("cleared") || (/^(live|queued)/.test(row.status) && !known.has(row.sessionId)),
  );
```

**P11.23 →**

```js
/**
 * The one line an old-shape roster earns (spec 4.7), read once at a start: a
 * live or queued row whose session the state file has no seat for belongs to
 * the old contract. A `cleared` row is no word of the roster's, and
 * `migrate`'s to move to the archive (roster-ledger 1.3, 2.2). The line
 * informs and asks for no act.
 */
function oldShapeLine(root, seats) {
  const known = new Set(seats.map((s) => s.sessionId));
  const old = rosterRows(root).filter((row) => /^(live|queued)/.test(row.status) && !known.has(row.sessionId));
```

**P11.24** `skills/tanto/scripts/tanto.js` — insert after these 3 lines

```js
  const request = spawnRequest(root, sessions, "kanri", "/tanto kanri");
  return outgoing && KANRI_RESUMABLE.includes(outgoing.status) ? { ...request, succeeds: outgoing.sessionId } : request;
}
```

**P11.24 →**

```js

/**
 * The Kanri the spawner holds, entered when the roster's first row does not
 * name it (roster-ledger 6): the line first; then an attach when the listing
 * shows it, and otherwise the one `resume` with the fukki word, since the
 * one-holder rule counts a `gone` Kanri, which has nothing to attach to.
 * Never a spawn. `{ attach, resumed }`, or `{ code }` with the line said.
 */
function enterHeldKanri(root, sessionId, byId, older, waitMs) {
  process.stdout.write(
    `tanto: the roster's first row does not name the Kanri the spawner holds, ${sessionId}; entering it — run boundary.js roster show\n`,
  );
  const listed = byId.get(sessionId);
  if (listed) return { attach: listed.id || sessionId, resumed: false };
  if (older) return { code: say(OLDER_SPAWNER, 1) };
  const request = { op: "resume", role: "kanri", topic: "—", sessionId, prompt: "/tanto fukki" };
  const result = waitForResult(root, writeRequest(root, request), waitMs);
  if (!result) {
    fail("tanto: the spawner wrote no result for the Kanri request; see .tanto/spawner/log");
    return { code: 1 };
  }
  if (result.error) {
    fail(`tanto: the Kanri resume failed — ${result.error}`);
    return { code: 1 };
  }
  return { attach: result.id || result.sessionId, resumed: true };
}
```

**P11.25** `skills/tanto/scripts/tanto.js` — replace exactly these 4 lines

```js
  const held = row
    ? seats.find((s) => s.sessionId === row.sessionId)
    : seats.find((s) => s.role === "kanri" && KANRI_RESUMABLE.includes(s.status));
  const kanriHeld = Boolean(held && KANRI_RESUMABLE.includes(held.status));
```

**P11.25 →**

```js
  // A first row whose sessionId neither the listing nor the state file holds
  // — a cell whose separators were lost, a row of a run the state file no
  // longer holds — names no Kanri: the state file's is found by role, as with
  // no row at all, and entered with the held line (roster-ledger 6).
  const named = Boolean(row && (byId.has(row.sessionId) || seats.some((s) => s.sessionId === row.sessionId)));
  const held = named
    ? seats.find((s) => s.sessionId === row.sessionId)
    : seats.find((s) => s.role === "kanri" && KANRI_RESUMABLE.includes(s.status));
  const kanriHeld = Boolean(held && KANRI_RESUMABLE.includes(held.status));
  const unnamed = row && !named && kanriHeld ? held : null;
```

**P11.26** `skills/tanto/scripts/tanto.js` — replace exactly these 2 lines

```js
  let attach = null;
  let resumed = 0;
```

**P11.26 →**

```js
  let attach = null;
  let resumed = 0;
  // The Kanri a `held:` answer entered, which the resume loop below leaves to
  // that entry (roster-ledger 6).
  let entered = null;
```

**P11.27** `skills/tanto/scripts/tanto.js` — replace exactly these 2 lines

```js
    attach = result.id || result.sessionId;
  } else {
```

**P11.27 →**

```js
    attach = result.id || result.sessionId;
  } else if (!handover && unnamed) {
    // The first row names no Kanri the run holds (roster-ledger 6, a14f's
    // second occurrence): the state file's Kanri is entered, and no new one
    // is spawned.
    const entry = enterHeldKanri(root, unnamed.sessionId, byId, older, waitMs);
    if (entry.code !== undefined) return entry.code;
    attach = entry.attach;
    if (entry.resumed) resumed += 1;
  } else {
```

**P11.28** `skills/tanto/scripts/tanto.js` — replace exactly these 10 lines

```js
    if (!result) {
      fail("tanto: the spawner wrote no result for the Kanri request; see .tanto/spawner/log");
      return 1;
    }
    if (result.error) {
      fail(`tanto: the Kanri ${request.op} failed — ${result.error}`);
      return 1;
    }
    attach = result.id || result.sessionId;
    if (request.op === "resume") resumed += 1;
```

**P11.28 →**

```js
    // The spawner holds a Kanri the first row does not name (roster-ledger 6,
    // f07a): that Kanri is entered and no second spawn request is written.
    // During a handover the spawn is the successor's, and the holder it
    // names is a second Kanri, which stays refused.
    const holder = !handover && request.op === "spawn" ? /^held: (\S+)/.exec(result?.error || "") : null;
    if (holder) {
      const entry = enterHeldKanri(root, holder[1], byId, false, waitMs);
      if (entry.code !== undefined) return entry.code;
      attach = entry.attach;
      entered = { sessionId: holder[1] };
      if (entry.resumed) resumed += 1;
    } else {
      if (!result) {
        fail("tanto: the spawner wrote no result for the Kanri request; see .tanto/spawner/log");
        return 1;
      }
      if (result.error) {
        fail(`tanto: the Kanri ${request.op} failed — ${result.error}`);
        return 1;
      }
      attach = result.id || result.sessionId;
      if (request.op === "resume") resumed += 1;
    }
```

**P11.29** `skills/tanto/scripts/tanto.js` — replace exactly this 1 line

```js
    resumeLost(root, seats, byId, held);
```

**P11.29 →**

```js
    resumeLost(root, seats, byId, entered || held);
```

- [ ] **Step 4: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 11
```

Expected: `task 11: verify clean`.

- [ ] **Step 5: Run the boundary suite, which loads the file this task ends differently**

```bash
node --test skills/tanto/scripts/boundary.test.js
```

Expected: every test passes; `boundary.js` still runs as the command.

- [ ] **Step 6: Run the launcher suite to verify it passes**

```bash
node --test skills/tanto/scripts/tanto.test.js
```

Expected: every test passes, the five of Step 2 and "a handover successor
row the live listing has lost is not attached to directly" among them. Two
to three minutes: in the background with the output in a file, read after
the completion notice.

- [ ] **Step 7: Run lint per Global Constraints**

```bash
./scripts/lint.sh skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js skills/tanto/scripts/boundary.js
```

Expected: lint passes with no file changed.

- [ ] **Step 8: Commit per Global Constraints**

```bash
git commit --only -m "feat: tanto.js reads the roster through boundary.js cells() and enters the Kanri the spawner holds (roster-ledger 6, 2.2)" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/scripts/tanto.js skills/tanto/scripts/tanto.test.js skills/tanto/scripts/boundary.js
```

Expected: one commit.

### Task 12: `SKILL.md` part 1: "The roster" (its columns, the Name cell, the archive, the status words, the census table) and "The address" (the beat sentence)

Spec 1.1 (one table of twenty columns keyed by `sessionId`, the Name cell a
record), 1.2 (the archive's twenty-one columns, each row copied whole), 1.3
(the five status words, `cleared` no word of the roster's, `replaced` never
re-marked), 2.1 and 2.3 (`record` the one writer, the template the schema,
`--suffix`), and section 3 (the census's seven headings as one table, the
header line, the census before `archive`), carried into `SKILL.md`'s "The
roster" and its bold "The census" paragraph; and section 3's removal of the
`ack` op from "The address"'s beat sentence. After this task the contract
names the twenty columns and the key, says the Name cell is rewritten by
`record --rename`, describes the archive's shape, gives the status words
with their writers, carries the census table of spec section 3 in place of
the bullet list, and names no `ack`.

**Files:**

- Modify: `skills/tanto/SKILL.md` — "The roster" (its first paragraph, the
  Status paragraph and a new archive paragraph after it, the bold "The
  census" paragraph with its bullet list and the paragraph after it) and
  "The address" (the `seat` line's paragraph under "How Kanri sends a seat
  a line", and the "The beat comes before every request" paragraph).

**Interfaces:**

- Consumes: the twenty-column header and the archive's twenty-one (Task 1);
  the `sessionId` key and `--suffix` (Task 2); `--seat`, `--rename`,
  `--roster-event`, `--succeeds` (Task 3); `migrate` (Task 5); the census's
  seven headings, Returned, and the `queued; its batch line wakes it` line
  (Task 7); `archive` (Task 9); the spawner without `ack` (Task 10).
- Produces: the census table that `roles/kanri.md`'s "Session lifecycle"
  points at (Task 16); the status words `roles/kanri.md`'s Handover case and
  Release row use (Tasks 14, 15); the "The roster" pointer Task 13's
  scripts paragraph cites.

**Named-mechanism sites.** The twenty columns are also
`templates/roster.md` and `scripts/boundary.js`'s header check (Task 1),
`templates/roster-archive.md`'s twenty-one (Task 1), and `SKILL.md`'s
Artifacts rows for the roster and the archive (Task 13). The `sessionId`
key is also every roster writer of `boundary.js` (Tasks 2, 3) and
`roles/kanri.md`'s Start (Task 14). `--rename` is also `boundary.js`
(Task 3), the "Yours" case (Task 14), and "Session lifecycle"'s Listed
bullet (Task 16). `--suffix` is also `boundary.js` (Task 2) and
`roles/kanri.md`'s `(idle since)` and `(blocked since)` sentences
(Task 15). The status words are also `record --status` (Task 2), the
Handover case (Task 14), the Release row (Task 15), and "Session
lifecycle" (Task 16). The seven headings and **Returned** are also
`boundary.js census` (Task 7), `SKILL.md`'s scripts paragraph (Task 13),
`roles/kanri.md`'s "Session lifecycle" and Recovery step 1 (Task 16), and
the README's Layout (Task 18). The census's header line is also
`boundary.js` (Task 1). `migrate` is also `boundary.js` (Task 5),
`SKILL.md` rule 11 and its scripts paragraph (Task 13), Start step 4
(Task 14), and the README (Task 18). `archive` is also `boundary.js`
(Task 9), `SKILL.md`'s Artifacts (Task 13), the Release row (Task 15), and
`templates/roster.md`'s keeping rule (Task 1). The `ack` op is also
`spawner.js` (Task 10), `SKILL.md`'s Artifacts row for `.tanto/spawner/`
(Task 13), `roles/kanri.md`'s beat sentence (Task 14), and
`templates/spawn-request.md` (Task 10). The `seat` line's sixth field is
also `boundary.js seat` and `wake` (Task 2), `roles/kanri.md`'s "Sending
to a seat" (Task 14), and its boundary dispatch, which resolves a peer's
name at receipt (Task 6). `--roster-event` is also
`boundary.js` (Task 3) and `roles/kanri.md` (Tasks 14, 16). `SKILL.md`
is also edited by Task 13, over "Messages", "Artifacts", and "Rules"; this
task's passages lie under "The roster" alone, "The address" included.

**O12.1** `Columns are Role, Topic,` — the sentence listing eleven columns with the `[ref]` header (spec 1.1, Old values "`Name [ref]` as a header cell … `SKILL.md` The roster"); raw count: 1 in `skills/tanto/SKILL.md`, 0 elsewhere under `skills/tanto/`; after: 0. The header cell itself carries backticks here, which a needle cannot, and is swept by Task 18's fence.

**O12.2** `— and then six` — the census's six headings (spec 3); raw count: 1 in `skills/tanto/SKILL.md`; after: 0. The scripts paragraph's own count is O13.4's.

**O12.3** `- **No session id** — a row whose` — the census bullet list, replaced by the table (spec 3, "in place of its bullet list"); raw count: 1 in `skills/tanto/SKILL.md`; after: 0.

**O12.4** `- **Not held** — a session under the root` — the same list's last bullet; raw count: 1 in `skills/tanto/SKILL.md`; after: 0.

**O12.5** ` a Kanri that handed over;` — `replaced`'s definition, which said nothing of the process (spec 1.3); raw count: 1 in `skills/tanto/SKILL.md`; after: 0.

**O12.6** `gone and that is not parked` — `dead`'s definition (spec 1.3, "not replaced"); raw count: 1 in `skills/tanto/SKILL.md`; after: 0.

**O12.7** `Kanri runs it before a ` — the beat sentence that lists the `ack` op (spec 3, Old values "`` `ack` `` — `SKILL.md` … "The address""); raw count: 1 in `skills/tanto/SKILL.md`; after: 0. The op word itself carries backticks and is swept by Task 18's fence.

**O12.8** `open ledger, in the roster` — the `unsent:` line written "through `record --event`" in the roster, which `--event` never writes (spec 2.4, `--roster-event`); raw count: 1 in `skills/tanto/SKILL.md` and 1 in `skills/tanto/roles/kanri.md` (Task 14's, O14.10); after: 0 here.

**O12.14** `prints one line from the state file` — the five-field `seat` line, `<status> <name> <kind> <role> <turn>`, which a needle cannot quote whole since the new line keeps it as its prefix (spec 2.3, "`boundary.js seat <name>` prints the `sessionId` as a sixth field"); raw count: 1 in `skills/tanto/SKILL.md`; `roles/kanri.md`'s own five-field line is O14.16's; after: 0.

**A12.9** `skills/tanto/SKILL.md` — `node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/SKILL.md "The roster" | grep -c -F -e 'Columns are Role, Topic,' -e '— and then six' -e '- **No session id** — a row whose' -e '- **Not held** — a session under the root' -e ' a Kanri that handed over;' -e 'gone and that is not parked' -e 'Kanri runs it before a ' -e 'open ledger, in the roster' -e 'prints one line from the state file'` — before: 9, after: 0

- [ ] **Step 1: Count the old values in this task's sections (red)**

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/SKILL.md "The roster" | grep -c -F -e 'Columns are Role, Topic,' -e '— and then six' -e '- **No session id** — a row whose' -e '- **Not held** — a session under the root' -e ' a Kanri that handed over;' -e 'gone and that is not parked' -e 'Kanri runs it before a ' -e 'open ledger, in the roster' -e 'prints one line from the state file'
```

Expected: `9` — A12.9's before value. A `no section` line on stderr means the heading was renamed, which no passage of this plan does: stop and report.

- [ ] **Step 2: Apply the passages**

Apply P12.10 to P12.13, and P12.15.

**P12.10** `skills/tanto/SKILL.md` — replace exactly these 17 lines

```markdown
The roster lives at `.tanto/roster.md`, is written only by Kanri from
`templates/roster.md`, and has Kanri's row first. Columns are Role, Topic,
Name `[ref]`, cwd, Model, Effort, Branch, Mode, Started, Status, and
Transcript. A row is written from the spawner's result file, by
`boundary.js record --seat`: for a seat Kanri requested, when the result
lands; for a seat the launcher started — a Kikaku, a Hosa — at the census
whose **Not held** first prints it, Kanri not being woken for it. A
standalone Kaiseki and the messenger get no row, and a row that does not
exist yet while its seat works is not an error. The Name cell holds the bare
name the listing printed when the row was written — a record, not an
address ("The address") — and no seat writes a `[ref]` about itself. Topic
is the topic word the seat's own prompt keys gave it — for a Jisso, the
topic whose queue it was spawned into: the plan whose batches are in
flight, or, with none in flight, the plan whose landing requested the
queue, since the shared checkout carries one topic's batches at a time and
the next plan's queue opens at its predecessor's close — or `—` for Kanri,
Kikaku, Hosa, and a standalone Kaiseki.
```

**P12.10 →**

```markdown
The roster lives at `.tanto/roster.md`, from `templates/roster.md`, is
written only by Kanri and only through `boundary.js record` — never by
hand — and has Kanri's row first. It is one table, one row per seat, of
twenty columns: Role, Topic, Name, cwd, Model, Effort, Branch, Mode,
Started, Status, and Transcript, then the nine reading columns — Read at,
Bytes, Records, Wake-ups, Compactions, Context, Batches, Plans, and
Noticed — which hold `—` until the seat's first reading lands, and on
Kikaku's row for good. A row is keyed by its `sessionId`, the basename of
its Transcript cell without `.jsonl`, and every writer finds a row by that
key and by nothing else. `record` compares the header of every table it
writes with its template's and, on a mismatch, writes nothing and prints
one line naming `boundary.js migrate`, which brings a roster, an archive,
or a ledger of an older shape to the template's once. A row is written
from the spawner's result file, or from the state file's entry for its
`sessionId`, by `boundary.js record --seat`: for a seat Kanri requested,
when the result lands; for a seat the launcher started — a Kikaku, a
Hosa — at the census whose **Not held** first prints it, Kanri not being
woken for it. A standalone Kaiseki and the messenger get no row, and a row
that does not exist yet while its seat works is not an error. The Name
cell holds the bare name the listing printed, rewritten by
`record --rename` at every `— renamed` the census prints — a record, never
a key and not an address ("The address") — and no seat writes a `[ref]`
about itself. The Model cell holds the family the spawn request named, as
the result carries it. Topic is the topic word the seat's own prompt keys
gave it — for a Jisso, the topic whose queue it was spawned into: the plan
whose batches are in flight, or, with none in flight, the plan whose
landing requested the queue, since the shared checkout carries one topic's
batches at a time and the next plan's queue opens at its predecessor's
close — or `—` for Kanri, Kikaku, Hosa, and a standalone Kaiseki.
```

**P12.11** `skills/tanto/SKILL.md` — replace exactly these 16 lines

```markdown
The Status column carries one of five words: `queued` a Jisso of a
skill-editing plan waiting for its batch prompt; `live`, which may carry one
suffix: `(idle since <HH:MM>)`, or `(blocked since <HH:MM>)`, which Kanri
appends when the census's Listed line for the seat carries `— blocked` and
removes when a later census's does not — the last census that saw the seat
blocked, not its state now; the cause, `— blocked (<waitingFor>)`, is in the
census line and the notice and not in the cell, and every reader tests the
cell's first word; `stopped` a seat the run ended — by Kanri's `stop`
request, by `taiseki`, by `tanto teishi --seats`, by the spawner's guard, or
on a second `no-role` ("Messages") — its conversation kept and nothing sent
to it again; `replaced` a Kanri that handed over; `dead` a seat whose
process is gone and that is not parked — its conversation on disk and not
final, since a wake puts the row back to `live` when a line is next due to
it ("Resuming") — or a row of the old contract that Kanri retired at its
census (`roles/kanri.md`). A dialogue seat that is parked keeps its row
`live`: a park is its ordinary state between turns ("The faces of a seat").
```

**P12.11 →**

```markdown
The Status column carries one of five words, and `record --status` writes
no other: `queued` a Jisso of a skill-editing plan waiting for its batch
prompt; `live`, which may carry one suffix, written by `record --suffix`:
`(idle since <HH:MM>)`, or `(blocked since <HH:MM>)`, which Kanri appends
when the census's Listed line for the seat carries `— blocked` and removes
when a later census's does not — the last census that saw the seat
blocked, not its state now; the cause, `— blocked (<waitingFor>)`, is in the
census line and the notice and not in the cell, and every reader tests the
cell's first word; `stopped` a seat the run ended — by Kanri's `stop`
request, by `taiseki`, by `tanto teishi --seats`, by the spawner's guard, or
on a second `no-role` ("Messages") — its conversation kept and nothing sent
to it again; `replaced` every Kanri that handed over, whatever its process
is doing, and never marked again by the census; `dead` the census's word
for a seat whose process is gone and that was not replaced — its
conversation on disk and not final, since a wake puts the row back to
`live` when a line is next due to it ("Resuming") — or a row of the old
contract that Kanri retired at its census (`roles/kanri.md`). One status
per fact. A dialogue seat that is parked keeps its row `live`: a park is
its ordinary state between turns ("The faces of a seat"). `cleared` is no
word of this roster's — an old contract's row that carries it is moved to
the archive by `migrate`, its status as it stands.

The archive, `.tanto/roster-archive.md`, keeps one `## Sessions` table of
the roster's twenty columns and one more, Ended, last, and an `## Events`
section. At a plan close `boundary.js archive` copies every `stopped`,
`dead`, and `replaced` row there whole, Ended the day of the move — nothing
dropped and nothing joined, since the row already carries its last
reading — and moves every line under the roster's `## Events` to the
archive's, verbatim and in order; it writes both files or neither.
```

**P12.12** `skills/tanto/SKILL.md` — replace exactly these 44 lines

```markdown
**The census.** A seat is its `sessionId`, and a roster row's is the
basename of its Transcript column without `.jsonl`. Every match of a session
to a row — the census, a result file, Kanri's start — compares `sessionId`s,
never a name, a `[ref]`, or a full path: a name changes when a tab takes the
seat and at every window reload, one file has two paths under a changed
config directory, and a transcript moves when its session enters a
worktree. `node "$TANTO/scripts/boundary.js" census` reads the spawner's
state file, `.tanto/spawner/seats.json`, beside the listing, and prints the
`spawner:` line — `spawner: beating`, or `spawner: stale` — and then six
headings, in this order:

- **Listed** — a `live` or `queued` row whose session is listed, its line
  ending `— renamed` when the listed name is not the row's Name cell, and
  `— blocked (<waitingFor>)` for a background seat on a prompt. A seat open
  in a tab is never `blocked`: its prompt is in front of the human already.
- **Parked** — a `live` row whose seat the state file holds `parked`, with
  `— mid-turn` when its last turn did not end by itself and `— waiting`
  when a question of its to the human stands. Nothing is marked, and the row
  stays `live`; a seat with a topic marked `— mid-turn` is woken in Kanri's
  Recovery alone, never at a boundary's census ("Resuming").
- **Ended** — a `live` or `queued` row whose seat the state file holds
  `stopped` or `removed`; the line ends in `by taiseki` when the seat ended
  itself. Kanri writes the row `stopped`, with an Events line naming what
  ended it — `taiseki`, or its own request.
- **Not listed** — a row whose seat the state file does not hold, or holds
  `running`, `blocked`, or `gone`, and the listing does not show. Kanri marks
  a `live` row `dead` on that signal alone — no timeout, no inference, no
  name; a `queued` row stays `queued`, since a waiting Jisso's absence is
  expected and the send of its prompt wakes it. An entry with no `pid` is
  not listed, whatever its `state` says: its process is gone, and its line
  ends `— listed without a pid (a stale entry)`.
- **No session id** — a row whose Transcript cell carries no `sessionId`.
- **Not held** — a session under the root that no row holds; and, for every
  seat the state file holds that no row holds, listed or not, the line
  `— spawned as <role> <topic>, result <id>`, from whose result Kanri writes
  the row.

On `spawner: stale` the state file has stopped moving and Kanri marks
nothing, as on `census: unavailable`; a listing that fails is no signal
either. Kanri runs the census at its start; at every boundary, in loop step
6, before the next request; at every wake-up whose line comes from a name no
row holds — a Hosa's `slot-needed:` or `kessai answer:`, a Kikaku's
`decision:` — before it handles the line; and when `seat` prints `no entry`
("The address").
```

**P12.12 →**

```markdown
**The census.** A seat is its `sessionId`, and a roster row's is the
basename of its Transcript column without `.jsonl`. Every match of a session
to a row — the census, a result file, Kanri's start — compares `sessionId`s,
never a name, a `[ref]`, or a full path: a name changes when a tab takes the
seat and at every window reload, one file has two paths under a changed
config directory, and a transcript moves when its session enters a
worktree. `node "$TANTO/scripts/boundary.js" census` reads the spawner's
state file, `.tanto/spawner/seats.json`, beside the listing, and prints the
`spawner:` line — `spawner: beating`, or `spawner: stale` — and then seven
headings, in this order: **Listed**, **Parked**, **Ended**, **Returned**,
**Not listed**, **No session id**, **Not held**. It writes nothing. Each
rule is one row of this table — the row's status, what the state file
holds, what the listing shows, the heading the row is printed under, and
Kanri's one act:

| Row status | State file | Listing | Heading | Kanri's act |
| --- | --- | --- | --- | --- |
| `live`, `queued` | any but `stopped`, `removed` | listed | Listed, with `— renamed` when the listed name is not the Name cell, `— blocked (<cause>)` for a background seat on a prompt | rewrite the Name cell on `— renamed`; append or remove the `(blocked since)` suffix |
| `live` | `parked` | not listed | Parked, with `— mid-turn`, `— waiting` | nothing; Recovery wakes a `— mid-turn` seat with a topic |
| `live`, `queued` | `stopped`, `removed` | any | Ended, `by taiseki` when the seat ended itself | `--status "<id> stopped"` and a `--roster-event` naming what ended it |
| `stopped`, `dead` | `running`, `blocked`, or listed while the state file has not ended it (`stopped`, `removed`) | listed or held | **Returned** — `<row status>; seat <state>` | for `dead`: `--status "<id> live"`, the seat is back and nobody wrote it (007e's fifth case); for `stopped`: a `stop` request unless `requests/` already holds one for that `sessionId`, the run ended it and the process stayed (cd46) |
| `stopped`, `dead` | `parked` | not listed | Not held, `— row <status>` | nothing; a wake is its line's |
| `live` | absent, `running`, `blocked`, `gone` | not listed | Not listed, `— listed without a pid (a stale entry)` for a pid-less entry | `--status "<id> dead"`, with a `--roster-event`; the row goes `live` again at the wake that sends it a line, as decision-39fb says |
| `queued` | any, `gone` included | not listed | Not listed, `— queued; its batch line wakes it` | nothing (78b3) |
| any | — | — | No session id — the Transcript cell has no `sessionId` | nothing — a row no key finds; `migrate` prints it `suspect:`, and the human repairs or retires it once |
| none | held `running`, `blocked`, `parked` | any | Not held, `— spawned as <role> <topic>, result <id>` | `record --seat <that sessionId>` |
| `replaced` | — | listed | Not held, `— row replaced` | nothing; the successor's `stop` request ends it |

A seat open in a tab is never `blocked`: its prompt is in front of the
human already. A seat with a topic marked `— mid-turn` is woken in Kanri's
Recovery alone, never at a boundary's census ("Resuming"). An entry with no
`pid` is not listed, whatever its `state` says: its process is gone. `dead`
is marked on the Not listed signal alone — no timeout, no inference, no
name — and a `replaced` row is never marked again; a `dead` row goes `live`
at the wake that sends it a line, and **Returned** catches the case where
nobody wrote it. The Name cell's `— renamed` is derived from the listed
name against the cell, and from nothing the spawner marks.

On a roster whose header is not the template's the census prints
`census: roster header is not the template's — run boundary.js migrate`
and exits 1. On `spawner: stale` the state file has stopped moving and
Kanri marks nothing, as on `census: unavailable`; a listing that fails is
no signal either. Kanri runs the census at its start; at every boundary, in
loop step 6, before the next request; at a plan close, before
`boundary.js archive`, so that **Returned**'s acts are done before the
move; at every wake-up whose line comes from a name no row holds — a
Hosa's `slot-needed:` or `kessai answer:`, a Kikaku's `decision:` — before
it handles the line; and when `seat` prints `no entry` ("The address").
```

**P12.13** `skills/tanto/SKILL.md` — replace exactly these 7 lines

```markdown
Kanri runs it before a `spawn`, a `stop`, an `attention`, or an `ack`;
`wake` runs it itself. On `spawner: stale` Kanri writes no request, records
what it owes as the Events line
`unsent: <sessionId or op> — <the line or the request>` — through
`record --event` in the open ledger, in the roster's Events when none is
open — and tells the human in one line to run `tanto fukki`, saying that a
stale spawner raises no notice of its own. Kanri's Recovery sends every
```

**P12.13 →**

```markdown
Kanri runs it before every `spawn`, `stop`, and `attention` request;
`wake` runs it itself. On `spawner: stale` Kanri writes no request, records
what it owes as the Events line
`unsent: <sessionId or op> — <the line or the request>` — through
`record --event` in the open ledger, and through `record --roster-event`
in the roster's Events when none is open — and tells the human in one line
to run `tanto fukki`, saying that a stale spawner raises no notice of its
own. Kanri's Recovery sends every
```

**P12.15** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```markdown
`seat` prints one line from the state file,
`<status> <name> <kind> <role> <turn>` — the kind `background`,
`interactive`, or `-` when the seat is not listed; the turn `ended` or
`open` by the spawner's own test over the seat's transcript, or `-` when
none is found — and `spawner: beating` or `spawner: stale` under it. For a
```

**P12.15 →**

```markdown
`seat` prints one line of six fields from the state file,
`<status> <name> <kind> <role> <turn> <sessionId>` — the kind `background`,
`interactive`, or `-` when the seat is not listed; the turn `ended` or
`open` by the spawner's own test over the seat's transcript, or `-` when
none is found; the sixth field the seat's `sessionId`, the key every
`record` call takes — and `spawner: beating` or `spawner: stale` under it.
For a
```

- [ ] **Step 3: Count the old values again**

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/SKILL.md "The roster" | grep -c -F -e 'Columns are Role, Topic,' -e '— and then six' -e '- **No session id** — a row whose' -e '- **Not held** — a session under the root' -e ' a Kanri that handed over;' -e 'gone and that is not parked' -e 'Kanri runs it before a ' -e 'open ledger, in the roster' -e 'prints one line from the state file'
```

Expected: `0` — A12.9's after value; `grep -c` exits 1 on a count of 0, which is this step's pass, read from the printed figure.

- [ ] **Step 4: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 12
```

Expected: `task 12: verify clean`.

- [ ] **Step 5: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
```

Expected: every hook `Passed` or `Skipped`, exit 0, no file changed.

- [ ] **Step 6: Commit**

```bash
git commit --only -m "docs: the contract's roster is one table keyed by sessionId, with the census as one table" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/SKILL.md
```

Expected: one commit, one file changed.

### Task 13: `SKILL.md` part 2: "Messages" (the intake route's roster read), "Artifacts" (the roster, archive, and spawner rows, the twenty templates, the scripts paragraph), rule 11; the same roster read in `roles/kaiseki.md` and `templates/bug-report.md`

Spec section 7's `SKILL.md` bullets for "Messages", the Artifacts rows,
rule 11, and the scripts paragraph, carrying 1.1 and 2.2 (another
workspace's roster read by its third column, whichever header it carries,
since the target may not have migrated), 1.2 and 5 (the archive row),
section 3 (eight spawner ops, no `ack`; seven census headings), 2.1 and 2.6
(the twentieth template; the three roster and ledger templates read at
every `record` call), and 1.4, 4.1, and 5 (`roster show`, `archive`, and
`migrate` among `boundary.js`'s subcommands). The same intake read stands in
two more files the spec's section 7 does not list, `roles/kaiseki.md`'s
report to another repository and `templates/bug-report.md`'s lead, and this
task carries it there in the same words. After this task no file under
`skills/tanto/` but `roles/kanri.md` (Task 16) and the roster templates and
scripts (Tasks 1, 5, 11) names a `Name [ref]` column, and the contract lists
twenty templates and ten `boundary.js` subcommands.

**Files:**

- Modify: `skills/tanto/SKILL.md` — "Messages" (the route paragraph's
  roster read), "Artifacts" (the rows for `.tanto/roster.md`,
  `.tanto/roster-archive.md`, and `.tanto/spawner/`; the templates
  paragraph; the scripts paragraph's `boundary.js` sentence), and "Rules"
  (rule 11's "The run-time templates land with the role files" paragraph).
- Modify: `skills/tanto/roles/kaiseki.md` — the paragraph that reports a
  defect to another repository (its roster read).
- Modify: `skills/tanto/templates/bug-report.md` — the lead paragraph (its
  roster read).

**Interfaces:**

- Consumes: the twenty-column roster and twenty-one-column archive and the
  header check (Task 1); `migrate` (Task 5); the census's seven headings
  (Task 7); `roster show` (Task 8); `archive` (Task 9); the spawner without
  `ack` (Task 10); `templates/shoroku-direction.md` (Task 1).
- Produces: the subcommand list the README's Layout mirrors (Task 18); rule
  11's sentence on the three templates `record` reads, which every later
  plan that edits them obeys.

**Named-mechanism sites.** The intake route's roster read is also
`roles/kanri.md`'s "Reporting from the other side" (Task 16), and the
`Name` header itself `templates/roster.md` and `templates/roster-archive.md`
(Task 1) and `scripts/boundary.js` (Tasks 1, 5). The roster's and the
archive's columns are also "The roster" (Task 12). The eight ops are also
`scripts/spawner.js` and `templates/spawn-request.md` (Task 10);
the beat sentences that listed `ack` are Task 12's and Task 14's. The seven
headings are also "The roster" (Task 12), `boundary.js census` (Task 7),
`roles/kanri.md`'s "Session lifecycle" and Recovery (Task 16), and the
README's Layout (Task 18). The twentieth template is also
`templates/shoroku-direction.md` (Task 1), `roles/kanri.md`'s Check step
(Task 16), and the README's Layout (Task 18). The subcommand list is also
`boundary.js`'s usage line (Tasks 5, 8, 9) and the README's Layout
(Task 18). Rule 11's three read-at-every-call templates are also
`boundary.js`'s header check (Task 1). `SKILL.md` is also edited by
Task 12, under "The roster" alone; this task's passages lie under
"Messages", "Artifacts", and "Rules".

**O13.1** `Name [ref]` — the intake route's read of another workspace's roster by a header no roster carries after Task 1 (spec section 7, "Messages"; Old values "`Name [ref]`"); raw count across `skills/tanto/`: `SKILL.md` 1, `roles/kaiseki.md` 1, `templates/bug-report.md` 1 — this task's three, after: 0 in each — and `roles/kanri.md` 1 (Task 16's, O16.9), `templates/roster.md` 2 and `templates/roster-archive.md` 1 (Task 1's), `scripts/boundary.js` 3 and `scripts/boundary.test.js` 1 (Task 1's, O1.40, after: 0 in both), `scripts/tanto.test.js` 1 (Task 11's). A hit that any Task 18 sweep finds in any file is a finding to stop and report.

**O13.2** `one row per seat, written from the spawner` — the roster's Artifacts row (spec 1.1, 2.4); raw count: 1 in `skills/tanto/SKILL.md`; after: 0.

**O13.3** `rows with their last readings, and the closed` — the archive's Artifacts row, rows joined with their readings (spec 1.2, 5); raw count: 1 in `skills/tanto/SKILL.md`; after: 0.

**O13.4** `the ops being ` — the spawner row's nine ops with `ack` (spec 3, "lists eight ops"); raw count: 1 in `skills/tanto/SKILL.md`; after: 0. The op word itself is swept by Task 18's fence.

**O13.5** `Nineteen of them` — the templates count (spec 2.6, "the twentieth"); raw count: 1 in `skills/tanto/SKILL.md`; after: 0. The README's list is Task 18's.

**O13.6** `its seven subcommands are` — `boundary.js`'s subcommand count (spec section 7); raw count: 1 in `skills/tanto/SKILL.md` — `passage-check.js`'s "its seven subcommands" wraps before `are` and stays; after: 0.

**O13.7** `line and the roster` — the census said to print `live` and `queued` rows alone (spec 3, "say the census prints `live` and `queued` rows alone"); raw count: 1 in `skills/tanto/SKILL.md`; after: 0.

**O13.8** `Listed, Parked, Ended, Not listed` — the six headings without Returned, spanning the point where Returned enters; raw count: 1 in `skills/tanto/SKILL.md` (this task's) and 1 in `skills/tanto/roles/kanri.md` (Task 16's, O16.12); after: 0 here.

**O13.9** `reads once —` — rule 11's list of "the templates a session reads once" naming `roster.md`, `roster-archive.md`, and `kanri.md` (spec, Old values; the spec's own needle wraps in the file and counts 0, so this is its unwrapped tail); raw count: 1 in `skills/tanto/SKILL.md`; after: 0.

**A13.10** `skills/tanto/SKILL.md` — `node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/SKILL.md "Messages" "Artifacts" "Rules" | grep -c -F -e 'Name [ref]' -e 'one row per seat, written from the spawner' -e 'rows with their last readings, and the closed' -e 'the ops being ' -e 'Nineteen of them' -e 'its seven subcommands are' -e 'line and the roster' -e 'Listed, Parked, Ended, Not listed' -e 'reads once —'` — before: 9, after: 0

**A13.11** `skills/tanto/roles/kaiseki.md` — `cat skills/tanto/roles/kaiseki.md skills/tanto/templates/bug-report.md | grep -c -F 'Name [ref]'` — before: 2, after: 0

- [ ] **Step 1: Count the old values (red)**

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/SKILL.md "Messages" "Artifacts" "Rules" | grep -c -F -e 'Name [ref]' -e 'one row per seat, written from the spawner' -e 'rows with their last readings, and the closed' -e 'the ops being ' -e 'Nineteen of them' -e 'its seven subcommands are' -e 'line and the roster' -e 'Listed, Parked, Ended, Not listed' -e 'reads once —'
```

Expected: `9` — A13.10's before value. A `no section` line on stderr means a heading was renamed: stop and report.

```bash
cat skills/tanto/roles/kaiseki.md skills/tanto/templates/bug-report.md | grep -c -F 'Name [ref]'
```

Expected: `2` — A13.11's before value, one in each file.

- [ ] **Step 2: Apply the passages**

Apply P13.12 to P13.20.

**P13.12** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```markdown
`<workspace>/.tanto/roster.md`, takes the bare `<name>` before the bracket
of the `Name [ref]` column of the row whose Role is `hosa` and whose Status
```

**P13.12 →**

```markdown
`<workspace>/.tanto/roster.md`, takes the bare `<name>` in the third
column, before any bracket, whichever header that roster carries — the
target may not have migrated yet — of the row whose Role is `hosa` and
whose Status
```

**P13.13** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
| `.tanto/roster.md` | Kanri | all roles; another repository's intake-line sender, its listed Hosa row or its first data row, and a Kikaku sending a consult line, its `kikaku` row | one row per seat, written from the spawner's result file; a standalone Kaiseki and the messenger get none |
```

**P13.13 →**

```markdown
| `.tanto/roster.md` | Kanri, through `boundary.js record` alone | all roles, through `boundary.js roster show`; another repository's intake-line sender, its listed Hosa row or its first data row, and a Kikaku sending a consult line, its `kikaku` row | one table of twenty columns, one row per seat keyed by its `sessionId`, each written from the spawner's result file or the state file's entry; a standalone Kaiseki and the messenger get none |
```

**P13.14** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
| `.tanto/roster-archive.md` | Kanri | Kanri | from `templates/roster-archive.md`; the roster's stopped, dead, and replaced rows with their last readings, and the closed plans' Events lines, appended at each plan close |
```

**P13.14 →**

```markdown
| `.tanto/roster-archive.md` | Kanri, through `boundary.js archive` | Kanri | from `templates/roster-archive.md`; the roster's twenty columns and Ended: its `stopped`, `dead`, and `replaced` rows, each copied whole with its last reading, and the closed plans' Events lines, moved at each plan close |
```

**P13.15** `skills/tanto/SKILL.md` — replace exactly this 1 line

```markdown
| `.tanto/spawner/` — `pid`, `heartbeat`, `contract`, `log`, `seats.json`, `requests/<id>.json`, `results/<id>.json` | the spawner; a request file by Kanri, by the launcher, or by a seat through `boundary.js request` | the launcher, Kanri, `boundary.js`; `usage.js`, for a topic's seats | the spawner's own state: one seat entry per session it started — its status, its listed name and kind, and the contract mark of the request that spawned it; one request and one result per act, the ops being `spawn`, `stop`, `resume`, `rm`, `ack`, `attention`, `park`, `hold`, and `release`; the heartbeat — the epoch milliseconds of its last beat, which the launcher trusts over `pid`; and `contract`, holding `2`, which the spawner writes at its start and the launcher reads to know the spawner is of this contract. The roster is not here and the spawner never reads it |
```

**P13.15 →**

```markdown
| `.tanto/spawner/` — `pid`, `heartbeat`, `contract`, `log`, `seats.json`, `requests/<id>.json`, `results/<id>.json` | the spawner; a request file by Kanri, by the launcher, or by a seat through `boundary.js request` | the launcher, Kanri, `boundary.js`; `usage.js`, for a topic's seats | the spawner's own state: one seat entry per session it started — its status, its listed name and kind, its branch, and the contract mark of the request that spawned it; one request and one result per act, the eight ops being `spawn`, `stop`, `resume`, `rm`, `attention`, `park`, `hold`, and `release`; the heartbeat — the epoch milliseconds of its last beat, which the launcher trusts over `pid`; and `contract`, holding `2`, which the spawner writes at its start and the launcher reads to know the spawner is of this contract. The roster is not here and the spawner never reads it |
```

**P13.16** `skills/tanto/SKILL.md` — replace exactly these 10 lines

```markdown
Templates are copied and filled, never restated in prose. Nineteen of them:
`templates/roster.md`, `templates/roster-archive.md`, `templates/kanri.md`,
`templates/kanri-handover.md`, `templates/bug-report.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/boundary-brief.md`, `templates/kaiseki-brief.md`,
`templates/kaiseki-report.md`, `templates/review-brief.md`,
`templates/shoroku-brief.md`, `templates/shoki-brief.md`,
`templates/shoroku-feedback.md`, `templates/consult.md`,
`templates/spawn-request.md`, `templates/tanto.json`,
`templates/kikaku-decision.md`, and `templates/agent.md`.
```

**P13.16 →**

```markdown
Templates are copied and filled, never restated in prose. Twenty of them:
`templates/roster.md`, `templates/roster-archive.md`, `templates/kanri.md`,
`templates/kanri-handover.md`, `templates/bug-report.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/boundary-brief.md`, `templates/kaiseki-brief.md`,
`templates/kaiseki-report.md`, `templates/review-brief.md`,
`templates/shoroku-brief.md`, `templates/shoroku-direction.md`,
`templates/shoki-brief.md`, `templates/shoroku-feedback.md`,
`templates/consult.md`, `templates/spawn-request.md`,
`templates/tanto.json`, `templates/kikaku-decision.md`, and
`templates/agent.md`. The roster's, the archive's, and the ledger's are
also the schema `boundary.js record` checks every write against.
```

**P13.17** `skills/tanto/SKILL.md` — replace exactly these 14 lines

```markdown
brief; its seven subcommands are `check`, which runs the boundary's
read-only commands and prints their output under fixed headings; `record`,
which writes the ledger's and the roster's rows idempotently; `census`,
which Kanri runs itself: read-only, it reads the spawner's state file and
prints the `spawner:` line and the roster's `live` and `queued` rows against
the sessions `claude agents --json` lists under the root, under six
headings — Listed, Parked, Ended, Not listed, No session id, and Not held
("The roster"); `request`, whose `park` and `leave` a seat runs for
itself, the first at the end of a dialogue seat's turn and the second for
`taiseki`, and whose `attention --message` the intake runs on a consult
line, writing an `attention` request that names no seat ("Messages");
`seat`, which prints one seat's line from the state file; `wake`,
which resumes parked seats with no prompt; and `beat`, which prints the
`spawner:` line ("The address").
```

**P13.17 →**

```markdown
brief; its ten subcommands are `check`, which runs the boundary's
read-only commands and prints their output under fixed headings; `record`,
the one writer of the ledger's and the roster's rows, idempotent, which
finds a roster row by its `sessionId` and writes nothing when a table's
header is not its template's; `census`, which Kanri runs itself:
read-only, it reads the spawner's state file and prints the `spawner:`
line and every roster row it places against the sessions
`claude agents --json` lists under the root, under seven headings —
Listed, Parked, Ended, Returned, Not listed, No session id, and Not held
("The roster"); `roster show`, read-only, which prints the roster's first
row with Kanri's counts, its `live` and `queued` rows, its items count,
and its Events tail — what a Start and a handover read in place of the
file; `archive`, which moves the ended rows and the Events lines to the
archive at a plan close; `migrate`, run once per file, which brings a
roster, an archive, or a ledger of an older shape to the templates', keeps
a `.pre-migrate` copy, and refuses a shape it does not know; `request`,
whose `park` and `leave` a seat runs for itself, the first at the end of a
dialogue seat's turn and the second for `taiseki`, and whose
`attention --message` the intake runs on a consult line, writing an
`attention` request that names no seat ("Messages"); `seat`, which prints
one seat's line from the state file, its `sessionId` last; `wake`, which
resumes parked seats with no prompt; and `beat`, which prints the
`spawner:` line ("The address").
```

**P13.18** `skills/tanto/SKILL.md` — replace exactly these 8 lines

```markdown
    **The run-time templates land with the role files.** A role file is
    loaded once, at session start, but the `boundary.verify` subagent reads
    `templates/boundary-brief.md` and renders `templates/batch-prompt.md`
    from disk at **every** boundary, the plan's own included. A plan that
    edits either, or `templates/kanri-handover.md`, therefore lands it in
    the same batch as the role files that key on it; the templates a session
    reads once — `roster.md`, `roster-archive.md`, `kanri.md`,
    `shoki-brief.md`, `spawn-request.md` — may land earlier.
```

**P13.18 →**

```markdown
    **The run-time templates land with the role files.** A role file is
    loaded once, at session start, but the `boundary.verify` subagent reads
    `templates/boundary-brief.md` and renders `templates/batch-prompt.md`
    from disk at **every** boundary, the plan's own included. A plan that
    edits either, or `templates/kanri-handover.md`, therefore lands it in
    the same batch as the role files that key on it. `templates/roster.md`,
    `templates/roster-archive.md`, and `templates/kanri.md` are read at
    every `boundary.js record` call, which compares each table's header with
    theirs: a plan that changes a header in any of them makes every write
    refuse, in every workspace that loads the skill, until
    `boundary.js migrate` has run there, and its Global Constraints say
    when that is.
    The templates a session reads once, `shoki-brief.md` and
    `spawn-request.md`, may land earlier.
```

**P13.19** `skills/tanto/roles/kaiseki.md` — replace exactly these 2 lines

```markdown
intake's bare name — the `<name>` before
the bracket of the `Name [ref]` column — from that
```

**P13.19 →**

```markdown
intake's bare name — the `<name>` in the third column, before any
bracket, whichever header that roster carries — from that
```

**P13.20** `skills/tanto/templates/bug-report.md` — replace exactly this 1 line

```markdown
`<name>` before the bracket of the `Name [ref]` column — of the roster row
```

**P13.20 →**

```markdown
`<name>` in the third column, before any bracket, whichever header that
roster carries — of the roster row
```

- [ ] **Step 3: Count the old values again**

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/SKILL.md "Messages" "Artifacts" "Rules" | grep -c -F -e 'Name [ref]' -e 'one row per seat, written from the spawner' -e 'rows with their last readings, and the closed' -e 'the ops being ' -e 'Nineteen of them' -e 'its seven subcommands are' -e 'line and the roster' -e 'Listed, Parked, Ended, Not listed' -e 'reads once —'
```

Expected: `0` — A13.10's after value.

```bash
cat skills/tanto/roles/kaiseki.md skills/tanto/templates/bug-report.md | grep -c -F 'Name [ref]'
```

Expected: `0` — A13.11's after value.

- [ ] **Step 4: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 13
```

Expected: `task 13: verify clean`.

- [ ] **Step 5: Lint the changed paths**

```bash
./scripts/lint.sh skills/tanto/SKILL.md skills/tanto/roles/kaiseki.md skills/tanto/templates/bug-report.md
```

Expected: every hook `Passed` or `Skipped`, exit 0, no file changed.

- [ ] **Step 6: Commit**

```bash
git commit --only -m "docs: the contract's artifacts, rule 11, and intake read name the twenty-column roster and its commands" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/SKILL.md skills/tanto/roles/kaiseki.md skills/tanto/templates/bug-report.md
```

Expected: one commit, three files changed.

### Task 14: `roles/kanri.md` part 1: Start steps 3 and 4, the Handover and "Yours" cases, the beat sentence

Spec 2.4 (`--init` from the state file's entry, `--succeeds`, `--rename`,
`--roster-event`), 2.3 (the first reading by `--read-at`), 4.1 and 4.2
(`roster show` in place of the cold read, the first row's `sessionId` from
`show`'s first line, the old-contract rows from `show`'s `— no state entry`
lines), 1.3 (the predecessor `replaced` whatever its process is doing, the
`or dead` clause gone), 1.4 (`migrate` on the line that names it), and
section 3 (no `ack`), carried into `roles/kanri.md`'s "Start" and "Sending
to a seat". After this task Kanri's Start writes no roster row by hand: the
bootstrap is one `record --init`, the handover one `record --succeeds`, the
"Yours" rename one `record --rename`, and a Start reads the roster through
`roster show`.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — "Start" (steps 3 and 4), "The
  four cases" (the **Handover** paragraph whole, the **Yours** paragraph's
  last five lines), and "Sending to a seat" (the `seat` line's paragraph, and the "The
  beat comes before every request" paragraph's first five lines after its
  opening two).

**Interfaces:**

- Consumes: `record --kanri <sessionId> --kanri-reading … --read-at`
  (Task 2); `--init`, `--seat <sessionId>`, `--succeeds`, `--rename`,
  `--roster-event`, and `--ledger` optional for roster-only calls (Task 3);
  `migrate` (Task 5); `roster show`'s first line and its `— no state entry`
  and `cleared:` lines (Task 8); the spawner without `ack` (Task 10).
- Produces: the Start that `templates/kanri-handover.md`'s `## Reading` and
  `## Next step` point a successor at (Task 17), and the README's "Moving a
  run" names (Task 18).

**Named-mechanism sites.** `--init`, `--succeeds`, `--rename`, and
`--roster-event` are also `scripts/boundary.js` (Task 3), `SKILL.md`'s "The
roster" (Task 12), and `roles/kanri.md`'s "Session lifecycle" (Task 16, the
Listed `— renamed` bullet's `--rename` and the Ended and Not listed
bullets' `--roster-event`). `roster show` is also `boundary.js` (Task 8),
`SKILL.md`'s scripts paragraph (Task 13), and `templates/kanri-handover.md`
(Task 17). The `seat` line's sixth field is also `boundary.js seat` and `wake`
(Task 2), `SKILL.md`'s "The address" (Task 12), and the boundary dispatch's
readings line, which resolves a peer's name at receipt (Task 6). Kanri's
own transcript path, taken from its scratchpad path and never from the
roster's Transcript cell (spec 2.2), is also Task 6's dispatch block,
`kanri-transcript=`, in the same words.
`--read-at` is also `boundary.js` (Task 2) and "The trigger" and
"Readings" (Task 15). `migrate` is also `boundary.js` (Task 5), `SKILL.md`
(Tasks 12, 13), and the README (Task 18). The `ack` op is also `SKILL.md`'s
beat sentence (Task 12) and its Artifacts row (Task 13),
`scripts/spawner.js` and `templates/spawn-request.md` (Task 10). The status `replaced` is also `SKILL.md`'s Status paragraph
(Task 12) and the Release row (Task 15). `roles/kanri.md` is also edited
by Task 6 (the boundary dispatch block, its readings line, and loop step
6's `record` call, under "The batch loop"), Task 15 (loop step 4, "The
trigger", "The residency line", "The handover file", the `(blocked since)`
bullet, the Replace paragraph, the Release row, "Readings"), and Task 16
("Sending to a seat"'s `decision:` paragraph, "The handover, in a plan and
between plans" step 3, "Shoroku"'s Check and step 4, the landing, "A
seat's exit", "Reporting from the other side", "Session lifecycle"'s census
paragraph and bullets, the paragraph after the Release table, Recovery step
1); this task's passages lie under "Start" and in "Sending to a seat"'s
`seat` and beat paragraphs alone, and quote no line another task writes.

**O14.1** `the bootstrap: create it` — the bootstrap that wrote the roster by hand (spec 2.4, `--init`; 4.2); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O14.2** `cold-read the roster` — Start step 4 (spec, Old values; 4.2); raw count: 1 in `skills/tanto/roles/kanri.md`, 0 elsewhere under `skills/tanto/`; after: 0.

**O14.3** `rows: a row whose Status is` — the old-contract read that took `cleared` rows from a cold read (spec 4.1, `— no state entry` and `cleared:`); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O14.4** ` row is left as it is, for` — the `cleared` row left for the archive by hand (spec 1.3, `migrate` moves it); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O14.5** `rewrite the roster` — the Handover case (spec, Old values; 2.4, `--succeeds`); raw count: 1 in `skills/tanto/roles/kanri.md`, 0 elsewhere under `skills/tanto/`; after: 0.

**O14.6** `when the census does not list` — the Handover case's `or dead` clause (spec, Old values; 1.3); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O14.7** `Residency row` — the bootstrap's and the Handover case's Residency rows (spec 1.1, Old values "`Residency`"; narrowed from the bare word, which A14.11 counts); raw count: 7 lines in `skills/tanto/roles/kanri.md` — 2 in this task's sections, 5 in Task 15's (O15.1) — and across `skills/tanto/` also `templates/kanri-handover.md` 1 (Task 17), `templates/roster.md` 1 and `templates/roster-archive.md` 1 (Task 1), `scripts/boundary.js` 3 and `scripts/boundary.test.js` 5 (Tasks 1, 5). The bare word, 9 lines in `roles/kanri.md` (the spec's "10 times" re-run reads 9) and 8 lines in `scripts/boundary.js` (12 occurrences), is A14.11's and Task 18's sweep's; after: 0 in this task's sections.

**O14.8** `rewrite it in place with your name` — the "Yours" case's by-hand Name rewrite (spec 2.4, `--rename`); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O14.9** `before you write a ` — the beat sentence that lists the `ack` op (spec, Old values "`` `ack` `` — … `roles/kanri.md`'s beat sentence"); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0. The op word itself carries backticks and is swept by Task 18's fence.

**O14.10** `open ledger, in the roster` — the `unsent:` line written "through `record --event`" in the roster (spec 2.4, `--roster-event`, `unsent:`); raw count: 1 in `skills/tanto/roles/kanri.md` and 1 in `skills/tanto/SKILL.md` (Task 12's, O12.8); after: 0 here.

**O14.16** `prints one line, ` — "Sending to a seat"'s five-field `seat` line, `<status> <name> <kind> <role> <turn>`, which a needle cannot quote whole since the new line keeps it as its prefix (spec 2.3, the sixth field); raw count: 1 in `skills/tanto/roles/kanri.md`; `SKILL.md`'s is O12.14's; after: 0.

**A14.11** `skills/tanto/roles/kanri.md` — `node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/roles/kanri.md "Start" "Sending to a seat" | grep -c -F -e 'the bootstrap: create it' -e 'cold-read the roster' -e 'rows: a row whose Status is' -e ' row is left as it is, for' -e 'rewrite the roster' -e 'when the census does not list' -e 'Residency' -e 'rewrite it in place with your name' -e 'before you write a ' -e 'open ledger, in the roster' -e 'prints one line, '` — before: 11, after: 0

- [ ] **Step 1: Count the old values in this task's sections (red)**

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/roles/kanri.md "Start" "Sending to a seat" | grep -c -F -e 'the bootstrap: create it' -e 'cold-read the roster' -e 'rows: a row whose Status is' -e ' row is left as it is, for' -e 'rewrite the roster' -e 'when the census does not list' -e 'Residency' -e 'rewrite it in place with your name' -e 'before you write a ' -e 'open ledger, in the roster' -e 'prints one line, '
```

Expected: `11` — A14.11's before value; eleven lines, one of them carrying two needles. A `no section` line on stderr means a heading was renamed: stop and report.

- [ ] **Step 2: Apply the passages**

Apply P14.12 to P14.15, and P14.17.

**P14.12** `skills/tanto/roles/kanri.md` — replace exactly these 20 lines

```markdown
3. If `.tanto/roster.md` is absent, this is the bootstrap: create it
   from `templates/roster.md` with your row first — its Topic column `—`,
   because a topic is a peer's; its Model and Effort columns the two values
   step 1 checked; its Transcript column your own transcript path — and a
   Residency row carrying today's date, your own reading, and zero counts,
   then go to step 5.
4. Otherwise cold-read the roster, run the census
   (`node "$TANTO/scripts/boundary.js" census`, from the repository root;
   "Session lifecycle" says what it prints), and compare your own
   `sessionId`, the basename of your transcript path, with the first data
   row's, the basename of its Transcript column; then take exactly one case
   from "The four cases" below. In the same read, find the old-contract
   rows: a row whose Status is `cleared`, and a `live` or `queued` row whose
   `sessionId` has no entry in the state file, `.tanto/spawner/seats.json`
   — a window of a run started before this contract, which is no seat of
   the run. Say in your start line
   `old-contract rows in .tanto/roster.md (<roles>): those windows are no longer seats of this run — see the README, "Moving a run"`,
   send those rows nothing, and at the census mark the `live` and `queued`
   ones `dead` ("Session lifecycle"); a `cleared` row is left as it is, for
   the archive.
```

**P14.12 →**

````markdown
3. If `.tanto/roster.md` is absent, this is the bootstrap: one call, from
   the repository root, creates it with your row first, `<own>` being your
   `sessionId`, the basename of your own transcript path — the path your
   scratchpad path gives (`SKILL.md`, "The transcript reading"), never the
   roster's Transcript cell, which holds the bare `<sessionId>.jsonl` when
   the state entry had no path yet:

   ```bash
   node "$TANTO/scripts/boundary.js" record --init --roster .tanto/roster.md --seat <own>
   ```

   `record` writes the roster from `templates/roster.md` and your row from
   your entry in the spawner's state file — its Topic `—`, because a topic
   is a peer's; its Model and Effort the spawn request's, which step 1
   checked; its Transcript the entry's path, or `<own>.jsonl` while the
   entry has none; its counts `0 0 0`.
   Then take your own reading into that row,
   `record --roster .tanto/roster.md --kanri <own> --kanri-reading "<reading>" --read-at start`,
   and go to step 5. No row of the roster is written by hand.
4. Otherwise run, from the repository root,
   `node "$TANTO/scripts/boundary.js" roster show` and then the census
   (`node "$TANTO/scripts/boundary.js" census`; "Session lifecycle" says
   what it prints), and compare your own `sessionId`, the basename of your
   own transcript path from your scratchpad path, with the one `show`'s
   first line prints,
   `first: <name> — <sessionId> — <status> — counts <batches> <plans> <noticed>`;
   then take exactly one case from "The four cases" below. A `show` that
   ends with the line naming `boundary.js migrate` — a roster of an older
   shape — or prints `cleared: <n> rows — run boundary.js migrate` is
   answered first, before the census, by one
   `node "$TANTO/scripts/boundary.js" migrate --roster .tanto/roster.md --archive .tanto/roster-archive.md`
   (with `--ledger <the open ledger>` added when a topic is open),
   whose `suspect:` and `unplaced:` lines are the human's to settle once.
   In the same read, find the old-contract rows: a `live` or `queued` line
   of `show`'s that ends `— no state entry` — a window of a run started
   before this contract, which is no seat of the run. Say in your start
   line
   `old-contract rows in .tanto/roster.md (<roles>): those windows are no longer seats of this run — see the README, "Moving a run"`,
   send those rows nothing, and at the census mark them `dead` ("Session
   lifecycle").
````

**P14.13** `skills/tanto/roles/kanri.md` — replace exactly these 23 lines

```markdown
**Handover** — `.tanto/kanri-handover.md` exists. In order: read the
handover and the ledger it names, and `progress.md` if a plan is in flight;
note whether the census lists the outgoing Kanri's `sessionId`, the
basename of the first data row's Transcript column — a census that lists
two Kanris during a handover is this case, the outgoing one alive until
your `stop` request below; rewrite the roster —
your own row first with status `live`, your own name, your own transcript
path in its Transcript column, and today, your model, and your effort in
its Started, Model, and Effort columns — the old Kanri's row `replaced` (or
`dead` when the census does not list its `sessionId`), the Residency row
reset to your name and today with zero counts and your own reading, and
one Events line "handover accepted by `<you>` from `<old>`"; read the
ledger's Session events for `unanswered:` lines that have no `answered:`
pair, and the handover file's Live peers for its marks, and answer those
lines first — you announce nothing, and a peer whose send to the outgoing
Kanri errors once it has stopped re-sends to the roster's first row on its
own next wake-up; delete the handover file, because the Events line
is the record and a stale file must not start a false handover at the next
Kanri start; write a `stop` request for the predecessor's `sessionId`, which
is the whole of its retirement — its conversation is kept, and a human
attached to it through `tanto` is taken to you by the launcher when the
stop lands, with nothing typed; continue at the handover's Next step, which
decides whether a plan is in flight.
```

**P14.13 →**

````markdown
**Handover** — `.tanto/kanri-handover.md` exists. In order: read the
handover and the ledger it names, and `progress.md` if a plan is in flight;
note whether the census lists the outgoing Kanri's `sessionId`, the one
`show`'s first line printed — a census that lists two Kanris during a
handover is this case, the outgoing one alive until your `stop` request
below; write the handover with one call, `<own>` your `sessionId` — the
basename of your own transcript path, from your scratchpad path and never
from the roster — and `<old>` the outgoing Kanri's:

```bash
node "$TANTO/scripts/boundary.js" record --roster .tanto/roster.md --seat <own> --succeeds <old>
```

It writes your row first in the table, `live`, from your entry in the
spawner's state file, its counts `0 0 0` and its reading columns blank; the
old Kanri's row `replaced`, whatever its process is doing, every other cell
kept; and the Events line
`handover accepted by <your name> from <its name> — <its Transcript cell>`.
Then take your own reading into your row,
`record --roster .tanto/roster.md --kanri <own> --kanri-reading "<reading>" --read-at handover`;
read the ledger's Session events for `unanswered:` lines that have no
`answered:` pair, and the handover file's Live peers for its marks, and
answer those lines first — you announce nothing, and a peer whose send to
the outgoing Kanri errors once it has stopped re-sends to the roster's
first row on its own next wake-up; delete the handover file, because the
Events line is the record and a stale file must not start a false handover
at the next Kanri start; write a `stop` request for the predecessor's
`sessionId`, which is the whole of its retirement — its conversation is
kept, and a human attached to it through `tanto` is taken to you by the
launcher when the stop lands, with nothing typed; continue at the
handover's Next step, which decides whether a plan is in flight.
````

**P14.14** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```markdown
next work is and open the topic as step 5 says. When the row's Name is not
your name, rewrite it in place with your name, status `live`, and write the
Events line `resumed: <old name> → <new name>` under the roster's `## Events`
heading, after its last line. No row is marked `dead` on
this case alone, and there is no tree recovery beyond `git status`.
```

**P14.14 →**

```markdown
next work is and open the topic as step 5 says. When the row's Name is not
your name, run
`record --roster .tanto/roster.md --rename "<own> <your name>"`, `<own>`
your `sessionId`, which rewrites the Name cell and writes the Events line
`resumed: <old name> → <new name>` itself; add `--status "<own> live"` to
the call when the row's Status is not `live`. No row is marked `dead` on
this case alone, and there is no tree recovery beyond `git status`.
```

**P14.15** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```markdown
before you write a `spawn`, a `stop`, an `attention`, or an `ack`; `wake`
runs it itself. On `spawner: stale` write no request: record what you owe
as the Events line `unsent: <sessionId or op> — <the line or the request>`
— through `record --event` in the open ledger, in the roster's Events when
none is open — and tell the human in one line to run `tanto fukki`, saying
```

**P14.15 →**

```markdown
before every `spawn`, `stop`, and `attention` request you write; `wake`
runs it itself. On `spawner: stale` write no request: record what you owe
as the Events line `unsent: <sessionId or op> — <the line or the request>`
— through `record --event` in the open ledger, and through
`record --roster-event` in the roster's Events when none is open — and
tell the human in one line to run `tanto fukki`, saying
```

**P14.17** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```markdown
`seat` prints one line, `<status> <name> <kind> <role> <turn>` — `<kind>`
is `background`, `interactive`, or `-` when the listing does not show the
seat; `<turn>` is `ended` or `open`, or `-` when no transcript is found —
and `spawner: beating` or `spawner: stale` under it. `wake` checks the beat,
```

**P14.17 →**

```markdown
`seat` prints one line of six fields,
`<status> <name> <kind> <role> <turn> <sessionId>` — `<kind>` is
`background`, `interactive`, or `-` when the listing does not show the
seat; `<turn>` is `ended` or `open`, or `-` when no transcript is found;
the sixth field is the seat's `sessionId`, the key every `record` call
takes — and `spawner: beating` or `spawner: stale` under it. `wake`
checks the beat,
```

- [ ] **Step 3: Count the old values again**

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/roles/kanri.md "Start" "Sending to a seat" | grep -c -F -e 'the bootstrap: create it' -e 'cold-read the roster' -e 'rows: a row whose Status is' -e ' row is left as it is, for' -e 'rewrite the roster' -e 'when the census does not list' -e 'Residency' -e 'rewrite it in place with your name' -e 'before you write a ' -e 'open ledger, in the roster' -e 'prints one line, '
```

Expected: `0` — A14.11's after value.

- [ ] **Step 4: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 14
```

Expected: `task 14: verify clean`.

- [ ] **Step 5: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: every hook `Passed` or `Skipped`, exit 0, no file changed.

- [ ] **Step 6: Commit**

```bash
git commit --only -m "docs: Kanri's Start writes the roster by record --init, --succeeds, and --rename and reads it by roster show" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/roles/kanri.md
```

Expected: one commit, one file changed.

### Task 15: `roles/kanri.md` part 2: loop step 4, "The trigger", "The residency line", "The handover file", the suffix sentences, the Replace paragraph, the Release row, "Readings"

Spec 1.1 (the reading columns are cells of the seat's own row; no Residency
table), 2.3 (`--read-at`, `--kanri-count`, `--suffix`, the readings keyed by
`sessionId`), 4.1 (`roster show`'s first line carries Kanri's counts), 4.2
(the handover file's `## Reading` section), 5 (the Release row's archive
move is `boundary.js archive`, its statuses lose `refused` and `cleared`,
its items-table sentence goes), and section 3 (the census and its acts
before the move), carried into `roles/kanri.md` wherever the role names the
Residency table, the counts, a suffix, or the archive move. After this task
`roles/kanri.md` names no Residency row outside "Start" (Task 14's), every
suffix and count and reading outside a boundary has its `record` flag, and
the close's archive move is one command.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — "The batch loop" step 4 (the
  sentence on what the brief writes, and the idle block's `(idle since)`
  sentence), "The trigger" (the paragraph on a reading outside a
  boundary), "The residency line" (the counts paragraph), "The handover
  file" (its sections list), "Session lifecycle"'s **Listed** `— blocked`
  bullet, "Replace" (the paragraph after its table), "Release" (the plan
  close's row), and "Readings" (its first paragraph).

**Interfaces:**

- Consumes: the reading columns of the twenty-column row (Task 1); the
  readings, `--suffix`, `--read-at`, `--kanri-count`, and `--kanri-counts`
  keyed by `sessionId` (Task 2); `roster show`'s first line (Task 8);
  `archive` (Task 9); the census's **Returned** (Task 7); loop step 2's
  readings line resolved at receipt and loop step 6's call carrying
  `--kanri-count batches` (Task 6).
- Produces: the `## Reading` name `templates/kanri-handover.md` takes
  (Task 17); the Release row Task 16's "Session lifecycle" paragraph and
  README's "Moving a run" lean on (Tasks 16, 18).

**Named-mechanism sites.** `--suffix` is also `scripts/boundary.js`
(Task 2) and `SKILL.md`'s Status paragraph (Task 12). `--read-at` is also
`boundary.js` (Task 2), Start steps 3 and the Handover case (Task 14), and
`templates/boundary-brief.md` (Task 6). `--kanri-count` and
`--kanri-counts` are also `boundary.js` (Task 2), loop step 6's `record`
call (Task 6), and `roster show`'s first line (Task 8); the spec's section
7 writes "`--kanri-counts` for the Plans count", and this task writes
`--kanri-count plans`, the increment 2.3 and Constraint 2 give for a count
that moves. The `## Reading` section is also `templates/kanri-handover.md`
(Task 17). `archive` is also `boundary.js` (Task 9), `SKILL.md`'s "The
roster" and Artifacts (Tasks 12, 13), and `templates/roster.md`'s keeping
rule (Task 1); "the archive move" as the act's name stands in "The
trigger" signal 1, "Timing", the landing, and the close of a topic ended
early, none of which describes the move's mechanics, and stays. The status
words of the Release row are also `SKILL.md` (Task 12) and `record
--status` (Task 2). The census's acts the Release row cites are "Session
lifecycle"'s (Task 16) and `SKILL.md`'s table (Task 12). `roles/kanri.md` is
also edited by Task 6 (the boundary dispatch, its readings line, and step
6's call, all in "The batch loop" but none in step 4), Task 14 ("Start",
"The four cases", the beat paragraph), and Task 16 (the `decision:`
paragraph, the handover step 3, "Shoroku", the landing, "A seat's exit",
"Reporting from the other side", "Session lifecycle"'s census paragraph and
its other bullets, the paragraph after the Release table, Recovery step 1);
this task's passages lie in the ranges this task's Files list names and
quote no line another task writes.

**O15.1** `Residency row` — the seat's Residency row, now its own row's reading columns (spec 1.1, Old values "`Residency`", narrowed as O14.7 says); raw count: 7 lines in `skills/tanto/roles/kanri.md` — 5 in this task's sections, 2 in Task 14's (O14.7); after: 0 in this task's sections, and 0 in the file once Task 14 has landed. The bare word, which A15.9 counts, has 9 lines in the file: these 5, Task 14's 2, and O15.19's and O15.20's.

**O15.19** `Residency table` — the counts' table (spec 1.1, 2.3); raw count: 1 in `skills/tanto/roles/kanri.md`, and 1 in `skills/tanto/scripts/boundary.js` (Task 1's); after: 0 here.

**O15.20** `inherits, Residency` — the handover file's sections list (spec 4.2, `## Reading`); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O15.2** `reports to you and goes idle, so that` — the idle suffix written by hand (spec 2.3, `--suffix`); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O15.3** `census's time, to the row's` — the blocked suffix written by hand (spec 2.3, `--suffix`); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O15.4** `at a later census whose Listed line for that seat does not carry` — the blocked suffix removed by hand (spec 2.3, `--suffix … none`); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O15.5** `replaced, refused` — `refused` and `cleared` as movable statuses (spec 5, Old values "`refused` as a roster status"); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O15.6** `bring the roster's Shoroku proposal items table` — the Release row's by-hand repair of the items table (spec 5, "its sentence about bringing the items table … goes"); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O15.7** `with their last readings and this plan's Events lines` — the archive move by hand, rows joined with their readings (spec 5, `boundary.js archive`); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O15.8** `outside a boundary you write the row yourself` — "Readings" (spec 2.3, "reads 'you run `record` yourself'"); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**A15.9** `skills/tanto/roles/kanri.md` — `node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/roles/kanri.md "The batch loop" "Handover" "Session lifecycle" | grep -c -F -e 'Residency' -e 'reports to you and goes idle, so that' -e "census's time, to the row's" -e 'at a later census whose Listed line for that seat does not carry' -e 'replaced, refused' -e "bring the roster's Shoroku proposal items table" -e 'outside a boundary you write the row yourself' -e "with their last readings and this plan's Events lines"` — before: 12, after: 0

- [ ] **Step 1: Count the old values in this task's sections (red)**

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/roles/kanri.md "The batch loop" "Handover" "Session lifecycle" | grep -c -F -e 'Residency' -e 'reports to you and goes idle, so that' -e "census's time, to the row's" -e 'at a later census whose Listed line for that seat does not carry' -e 'replaced, refused' -e "bring the roster's Shoroku proposal items table" -e 'outside a boundary you write the row yourself' -e "with their last readings and this plan's Events lines"
```

Expected: `12` — A15.9's before value; twelve lines, the Release row carrying three needles. A `no section` line on stderr means a heading was renamed: stop and report.

- [ ] **Step 2: Apply the passages**

Apply P15.10 to P15.18.

**P15.10** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```markdown
   the figure is what the archive keeps. The readings themselves, the
   Residency rows, the Measurements per-boundary entry, and the next batch's
   `planned` row with its Prompt cell are the brief's,
   written by `record` from the dispatch you sent at step 2 — at a boundary you
   take no reading and rewrite no row.
```

**P15.10 →**

```markdown
   the figure is what the archive keeps. The readings themselves, written
   into the reading columns of each seat's own row, the Measurements
   per-boundary entry, and the next batch's `planned` row with its Prompt
   cell are the brief's, written by `record` from the dispatch you sent at
   step 2 — at a boundary you take no reading and rewrite no row.
```

**P15.11** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
   — append `(idle since <HH:MM>)` to a `live` cell the moment a Kikaku,
   Hosa, or Kaiseki reports to you and goes idle, so that the reminder is
   not forgotten across a wake-up — and each open ledger's `## Open questions for the human`,
```

**P15.11 →**

```markdown
   — append `(idle since <HH:MM>)` to a `live` cell the moment a Kikaku,
   Hosa, or Kaiseki reports to you and goes idle, with
   `record --roster .tanto/roster.md --suffix "<sessionId> idle <HH:MM>"`,
   so that the reminder is not forgotten across a wake-up — and each open
   ledger's `## Open questions for the human`,
```

**P15.12** `skills/tanto/roles/kanri.md` — replace exactly these 14 lines

```markdown
is the token figure issue-40ed asked for. At every check outside a boundary
take your own reading (`SKILL.md`, "The transcript
reading") and rewrite your Residency row with it — at a boundary you take
none: that row is `record`'s, written from the reading the dispatch
carried. A compactions figure of `1`
where you noticed none is signal 3, seen in a file, and counts as noticed.
After a compaction your context drops below your own baseline for a turn or
two and the ceiling verdict reads `under`, which is right: signal 3 is the
compaction and signal 4 is the growth before it, and one handover answers both
when it runs. The
Residency rows, and the archive's Context column across runs, are the data any
ceiling for the roles that only measure would be chosen from; yours and
Jisso's are `tanto.json`'s, and issue-40ed's halves closed with decision-b6cb
and with that map.
```

**P15.12 →**

```markdown
is the token figure issue-40ed asked for. At every check outside a boundary
take your own reading (`SKILL.md`, "The transcript reading") and write it
into your own row's reading columns with one call,
`record --roster .tanto/roster.md --kanri <your sessionId> --kanri-reading "<reading>" --read-at "<the moment>"`,
the moment being `start`, `handover`, `plan close`, or `turn <HH:MM>` for
the start of a turn between plans — at a boundary you take none: your row
is `record`'s, written from the reading the dispatch carried. A
compactions figure of `1` where you noticed none is signal 3, seen in a
file, and counts as noticed. After a compaction your context drops below
your own baseline for a turn or two and the ceiling verdict reads `under`,
which is right: signal 3 is the compaction and signal 4 is the growth
before it, and one handover answers both when it runs. The roster's
Context column, and the archive's across runs, are the data any ceiling
for the roles that only measure would be chosen from; yours and Jisso's
are `tanto.json`'s, and issue-40ed's halves closed with decision-b6cb and
with that map.
```

**P15.13** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

```markdown
The same counts go into the roster's Residency table, in your own row, which
you rewrite at every boundary and plan close: `<n>` increments when you accept
a batch, `<m>` when a plan closes, `<k>` when you notice a compaction, all
three cumulative since your own start. A declined handover leaves `<k>`
incremented, so the count stays a record. The reading's compactions figure is a
separate column, and a `1` there that you had not noticed increments `<k>` when
you read it.
```

**P15.13 →**

```markdown
The same counts are your own row's Batches, Plans, and Noticed cells, which
`roster show`'s first line prints as `counts <n> <m> <k>`: read them there,
never off the table. Each moves by one call that adds one to that cell
alone and reads nothing,
`record --roster .tanto/roster.md --kanri <your sessionId> --kanri-count batches|plans|noticed`:
`batches` in loop step 6's call when you accept a batch, `plans` at the
Release row when a plan closes, `noticed` when you notice a compaction —
all three cumulative since your own start, `0 0 0` as `--init` or
`--succeeds` wrote them. A declined handover leaves `<k>` incremented, so
the count stays a record. The reading's compactions figure is a separate
column, and a `1` there that you had not noticed increments `<k>` when you
read it. `--kanri-counts "<n> <m> <k>"` sets the three at once, for a
repair alone.
```

**P15.14** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
the next batch inherits, Residency, Next step, Not reconstructed, and Commands
```

**P15.14 →**

```markdown
the next batch inherits, Reading, Next step, Not reconstructed, and Commands
```

**P15.15** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

```markdown
- **Listed**, carrying `— blocked` — append `(blocked since <HH:MM>)`, this
  census's time, to the row's `live` cell only where the cell carries no
  suffix — a cell already carrying `(blocked since …)` or `(idle since <HH:MM>)`
  keeps it, since a `live` cell carries one suffix (`SKILL.md`) and the idle
  one is written on the seat's own report, the more specific fact — and remove `(blocked since …)`
  at a later census whose Listed line for that seat does not carry
  `— blocked`. The suffix records the last census that saw the seat
```

**P15.15 →**

```markdown
- **Listed**, carrying `— blocked` — append `(blocked since <HH:MM>)`, this
  census's time, with
  `record --roster .tanto/roster.md --suffix "<sessionId> blocked <HH:MM>"`,
  to the row's `live` cell only where the cell carries no suffix — a cell
  already carrying `(blocked since …)` or `(idle since <HH:MM>)` keeps it,
  since a `live` cell carries one suffix (`SKILL.md`) and the idle one is
  written on the seat's own report, the more specific fact — and remove
  `(blocked since …)`, with `--suffix "<sessionId> none"`, at a later census
  whose Listed line for that seat does not carry `— blocked`. The suffix
  records the last census that saw the seat
```

**P15.16** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
boundary. The figures are recorded in its Residency row and kept by the
archive. Never replace mid-batch on suspicion. Wait for the boundary, or
```

**P15.16 →**

```markdown
boundary. The figures are recorded in its row's reading columns and kept
by the archive, which copies the row whole. Never replace mid-batch on
suspicion. Wait for the boundary, or
```

**P15.17** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
| the kessai is answered, shusei's batch is verified, the merge is done, and the ledger's Progress line says closed | this plan is closed. Run the census, write `stopped` every row it prints under **Ended**, and mark `dead` every row it prints under "Not listed"; bring the roster's Shoroku proposal items table to the template's shape if it still has its pre-rename heading or the retired seventh column, its rows kept; move the stopped, dead, replaced, refused, and cleared rows — the last two an old contract's, kept until the archive takes them — with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet — move the topic's result files to `.tanto/<topic>/spawner-results/`, fill the ledger's Measurements row of the top-family peak — its usage row is the landing's, filled from `usage.js close` ("Shusei, shoki, and the landing") — and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb), the landing still ahead, its `usage.js close` with it, named in the handover file's In flight |
```

**P15.17 →**

```markdown
| the kessai is answered, shusei's batch is verified, the merge is done, and the ledger's Progress line says closed | this plan is closed. Run the census and do, before the move, every act its table gives ("Session lifecycle") — `stopped` for each row under **Ended**, `dead` for each `live` row under "Not listed", and **Returned**'s `--status` or `stop` request — a `queued` Jisso that never ran already written `stopped`; then move the rows with one `node "$TANTO/scripts/boundary.js" archive`, which copies every `stopped`, `dead`, and `replaced` row to `roster-archive.md` whole, its last reading with it, and every line under the roster's `## Events` after them, and creates the archive from `templates/roster-archive.md` when the file does not exist yet; read the rows it prints. Add the closed plan to your own counts, `record --roster .tanto/roster.md --kanri <your sessionId> --kanri-count plans`, move the topic's result files to `.tanto/<topic>/spawner-results/`, fill the ledger's Measurements row of the top-family peak — its usage row is the landing's, filled from `usage.js close` ("Shusei, shoki, and the landing") — and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb), the landing still ahead, its `usage.js close` with it, named in the handover file's In flight |
```

**P15.18** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```markdown
and Kaiseki's reports carry it; pass each as a `--peer-reading` of the
boundary's dispatch and `record` writes that role's Residency row, with the
boundary it was read at and the `context=` figure in the Context column;
outside a boundary you write the row yourself. A reading you doubt — a
```

**P15.18 →**

```markdown
and Kaiseki's reports carry it; pass each as a `--peer-reading` of the
boundary's dispatch, keyed by the `sessionId` you resolved at receipt ("The
batch loop", step 2), and `record` writes the reading columns of that
seat's row, with the boundary it was read at in Read at and the `context=`
figure in the Context column; outside a boundary you run `record`
yourself, with `--read-at "<the moment>"` in place of `--batch` ("The
trigger"). A reading you doubt — a
```

- [ ] **Step 3: Count the old values again**

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/roles/kanri.md "The batch loop" "Handover" "Session lifecycle" | grep -c -F -e 'Residency' -e 'reports to you and goes idle, so that' -e "census's time, to the row's" -e 'at a later census whose Listed line for that seat does not carry' -e 'replaced, refused' -e "bring the roster's Shoroku proposal items table" -e 'outside a boundary you write the row yourself' -e "with their last readings and this plan's Events lines"
```

Expected: `0` — A15.9's after value.

- [ ] **Step 4: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 15
```

Expected: `task 15: verify clean`.

- [ ] **Step 5: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: every hook `Passed` or `Skipped`, exit 0, no file changed.

- [ ] **Step 6: Commit**

```bash
git commit --only -m "docs: Kanri's readings, counts, suffixes, and archive move go through record and boundary.js archive" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/roles/kanri.md
```

Expected: one commit, one file changed.

### Task 16: `roles/kanri.md` part 3: the direction's template and write-back, the roster Events lines' writer, "Reporting from the other side", "Session lifecycle"'s census, Recovery step 1

Spec 2.6 (the direction file from `templates/shoroku-direction.md`;
`record --direction`, `--written`, `--only`, `--written-feedback`), 2.4
(`--roster-event` for every roster Events line, `--rename` for the census's
`— renamed`, `--seat <sessionId>` for a Not held seat), 2.2 and section 7
(another workspace's roster read by its third column, whichever header),
and section 3 (seven headings, the table pointer, **Returned**'s two acts,
the `queued; its batch line wakes it` line, No session id's act, Not held's
`— row <status>`, the census before `archive`, the header line), and 4.2
(the next topic read by `roster show`, not "cold-read as if fresh"),
carried into `roles/kanri.md`. After this task no roster Events line, no
Name cell, no Adopted cell, and no Written cell is written by hand
anywhere in the role, and "Session lifecycle" counts seven headings and
points at `SKILL.md`'s table.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — "Sending to a seat" (the
  `decision:` paragraph's roster Events line); "The handover, in a plan and
  between plans" (step 3's `handover written by` line); "The four steps"
  (step 3's direction file, step 4's Written column); "Shusei, shoki, and
  the landing" (shoki's landing, the landing's last act, the between-plans
  sweep's Events line); "A seat's exit" (the forced exit's Events line);
  "Reporting from the other side" (its roster read); "Session lifecycle"
  (the census paragraph, the **Ended**, **Not listed**, **Listed** `—
  renamed`, `— no first turn`, **Not held**, and **No session id** bullets,
  and a new **Returned** bullet); "Release" (the paragraph after the
  table); "Recovery" (step 1). And every other roster Events line the role
  names, each naming `--roster-event` where it names the line: "The four
  cases" (the **Recovery** case's per-row line), "Sending to a seat" (the
  second `no-role`'s line), "A seat's exit" (the gone Jisso's or shoki's
  line), "Session lifecycle"'s **Not listed** bullet (its two other
  lines), "Create" (the set-aside row), "Replace" (the gone Jisso's row
  and the Sekkei, Keikaku, and Kaiseki rows), and "Recovery" (the `fukki:`
  line from another sender, and step 2's `sent:` pair); and the `unsent:`
  line named in "Sending to a seat"'s send-error paragraph and in "Session
  lifecycle"'s closing paragraph.

**Interfaces:**

- Consumes: `templates/shoroku-direction.md` (Task 1); `--status`,
  `--suffix`, keyed by `sessionId` (Task 2); `--seat <sessionId>`,
  `--rename`, `--roster-event` (Task 3); `--direction`, `--written`,
  `--only`, `--written-feedback` (Task 4); `migrate` (Task 5); the census's
  seven headings, Returned, the `queued` line, and its header line (Tasks
  1, 7); `roster show` (Task 8); `archive` (Task 9); `SKILL.md`'s census
  table (Task 12).
- Produces: the census rules the Release row's "Session lifecycle"
  pointer (Task 15) and Start step 4 (Task 14) lean on.

**Named-mechanism sites.** `--direction`, `--written`, `--only`, and
`--written-feedback` are also `scripts/boundary.js` (Task 4) and the
direction template (Task 1). `--roster-event` is also `boundary.js`
(Task 3), `SKILL.md`'s beat paragraph and census table (Task 12), and this
file's beat paragraph, Handover case, and "Yours" case (Task 14); a roster
Events line inside Task 14's ranges is written there, Task 15's ranges name
none, and every other one — the Recovery case's per-row line under "The
four cases", the second `no-role`'s line, "A seat's exit"'s lines, the Not
listed bullet's three, the Create table's set-aside line, the Replace
table's four rows, "Recovery"'s `fukki:` line and `sent:` pair, and the
`unsent:` line of the send-error paragraph and the census's closing
paragraph — names the flag in this
task's own passages, the census paragraph stating the rule once beside
them. `--rename` is also
`boundary.js` (Task 3), `SKILL.md`'s "The roster" (Task 12), and the
"Yours" case (Task 14). The intake's roster read is also `SKILL.md`'s
"Messages", `roles/kaiseki.md`, and `templates/bug-report.md` (Task 13),
in the same words. The seven headings and **Returned** are also
`boundary.js census` (Task 7), `SKILL.md`'s "The roster" and scripts
paragraph (Tasks 12, 13), and the README's Layout (Task 18); the `(blocked
since)` bullet of the same list is Task 15's. `roster show` is also Start
step 4 (Task 14) and `templates/kanri-handover.md` (Task 17). `archive` is
also the Release row (Task 15). `roles/kanri.md` is also edited by Task 6
(the boundary dispatch, its readings line, step 6's call), Task 14
("Start", "The four cases", the beat paragraph), and Task 15 (loop step 4,
"The trigger", "The residency line", "The handover file", the `— blocked`
bullet, the Replace paragraph, the Release row, "Readings"); this task's
passages lie in the ranges its Files list names and quote no line another
task writes.

**O16.1** `in the roster's Events either way. You` — the `decision: … received from` line written by hand (spec 2.4); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.2** `your bare name, as a roster Events line. ` — the `handover written by` line (spec 2.4); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.3** `rows in the ledger: Adopted from the answer.` — the direction file with no template and the Adopted cells by hand (spec 2.6); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.4** `the docs subject for an adopted row` — step 4's Written column by hand (spec 2.6, `--written`, `--only`); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.5** ` rows written — a row whose` — shoki's landing marking the rows by hand (spec 2.6); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.6** `; and fill the ledger's Measurements` — the landing's `feedback <basename>` written by hand (spec 2.6, `--written-feedback`); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.7** `line of the roster. A sweep` — the sweep's Events line (spec 2.4, 2.6 "runs neither flag"); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.8** `gets a roster Events line saying` — the forced exit's Events line (spec 2.4); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.9** `Name [ref]` — "Reporting from the other side"'s roster read (spec section 7; Old values); raw count: 1 in `skills/tanto/roles/kanri.md`; the other sites across `skills/tanto/` are O13.1's; after: 0 here.

**O16.10** `repository root, prints the roster's` — the census said to print `live` and `queued` rows alone (spec 3); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.11** `then six headings` — "Session lifecycle"'s count (spec 3); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.12** `Listed, Parked, Ended, Not listed` — the six without Returned; raw count: 1 in `skills/tanto/roles/kanri.md` and 1 in `skills/tanto/SKILL.md` (Task 13's, O13.8); after: 0 here.

**O16.13** `Start step 1's read of your own name` — the census's place in a Start that read the roster itself (spec 4.2); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.14** `, with an Events line naming what ended` — **Ended**'s by-hand row and Events line (spec 3, `--status`, `--roster-event`); raw count: 1 in `skills/tanto/roles/kanri.md`, and 1 in `skills/tanto/scripts/boundary.js` (the census's code comment, Task 7's); after: 0 here.

**O16.15** `prompt wakes it. Any other row is marked` — **Not listed** without the `queued` line and its writer (spec 3, 78b3); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.16** `rewrite the row's Name column with the` — the census's `— renamed` act by hand (spec 2.4, `--rename`); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.17** `you write with the request,` — the `no first turn:` line by hand (spec 2.4); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.18** `write its row from that result file with` — Not held's act, now `--seat <sessionId>` from the state file (spec 2.4, section 3's table); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.19** `- **No session id** — nothing.` — No session id's act (spec 3, "say 'No session id — nothing'"); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.20** `cold-read as if fresh` — the next topic's start (spec, Old values; 4.2); raw count: 1 in `skills/tanto/roles/kanri.md`, 0 elsewhere under `skills/tanto/`; after: 0.

**O16.21** `act on its six headings` — Recovery step 1 (spec section 7, "Recovery step 1's 'six headings'"); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**A16.22** `skills/tanto/roles/kanri.md` — `node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/roles/kanri.md "Sending to a seat" "Handover" "Shoroku" "Bug intake" "Session lifecycle" | grep -c -F -e "in the roster's Events either way. You" -e 'your bare name, as a roster Events line. ' -e 'rows in the ledger: Adopted from the answer.' -e 'the docs subject for an adopted row' -e ' rows written — a row whose' -e "; and fill the ledger's Measurements" -e 'line of the roster. A sweep' -e 'gets a roster Events line saying' -e 'Name [ref]' -e "repository root, prints the roster's" -e 'then six headings' -e 'Listed, Parked, Ended, Not listed' -e "Start step 1's read of your own name" -e ', with an Events line naming what ended' -e 'prompt wakes it. Any other row is marked' -e "rewrite the row's Name column with the" -e 'you write with the request,' -e 'write its row from that result file with' -e '- **No session id** — nothing.' -e 'cold-read as if fresh' -e 'act on its six headings'` — before: 21, after: 0

**O16.40** `with an Events line per row` — the **Recovery** case's per-row line, named without its writer (spec 2.4, "the role text names the flag where it names the line"); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.41** `Write the Events line` — the second `no-role`'s line written by Kanri itself (spec 2.4); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.42** ` with an Events line naming what showed its process gone` — a gone Jisso's or shoki's `dead` line, in "A seat's exit" and in the Replace table's first row (spec 2.4); raw count: 2 lines in `skills/tanto/roles/kanri.md`; after: 0.

**O16.43** `not final: its Events line names what` — the Not listed bullet's `dead` line (spec 2.4); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.44** `wake fails gets the Events line a seat` — the Not listed bullet's failed-wake line (spec 2.4); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.45** ` with an Events line quoting the human` — the Create table's set-aside line (spec 2.4); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.46** `with an Events line naming the guard` — the Replace table's guard-stopped line (spec 2.4); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.47** `is the seat lost: its Events line says` — the Replace table's lost-seat line (spec 2.4); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**O16.48** `otherwise record in the roster's Events that` — the Sekkei, Keikaku, and Kaiseki rows of the Replace table, which record the line themselves (spec 2.4); raw count: 3 lines in `skills/tanto/roles/kanri.md`; after: 0.

**O16.49** `gets no answer and an Events` — "Recovery"'s line for a `fukki:` from another sender (spec 2.4); raw count: 1 in `skills/tanto/roles/kanri.md`; after: 0.

**A16.50** `skills/tanto/roles/kanri.md` — `node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/roles/kanri.md "Start" "Sending to a seat" "Shoroku" "Session lifecycle" | grep -c -F -e 'with an Events line per row' -e 'Write the Events line' -e ' with an Events line naming what showed its process gone' -e 'not final: its Events line names what' -e 'wake fails gets the Events line a seat' -e ' with an Events line quoting the human' -e 'with an Events line naming the guard' -e 'is the seat lost: its Events line says' -e "otherwise record in the roster's Events that" -e 'gets no answer and an Events'` — before: 11, after: 0

**A16.51** `skills/tanto/roles/kanri.md` — `node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/roles/kanri.md "Start" "Sending to a seat" "Shoroku" "Session lifecycle" | grep -c -F -e '--roster-event'` — before: 1, after: 23

A16.51's values are task-local, read at this task's own boundary on a file other tasks change: `before: 1` is the count with Tasks 1 to 15 applied in order and none of this task's blocks (Step 1 runs before Step 2 applies any) — the one line is Task 14's beat paragraph (P14.15); `after: 23` is the count once this task's blocks land, no later task touching these sections. At `main` the same command reads 0, since the flag does not exist in the base file.

- [ ] **Step 1: Count the old values in this task's sections (red)**

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/roles/kanri.md "Sending to a seat" "Handover" "Shoroku" "Bug intake" "Session lifecycle" | grep -c -F -e "in the roster's Events either way. You" -e 'your bare name, as a roster Events line. ' -e 'rows in the ledger: Adopted from the answer.' -e 'the docs subject for an adopted row' -e ' rows written — a row whose' -e "; and fill the ledger's Measurements" -e 'line of the roster. A sweep' -e 'gets a roster Events line saying' -e 'Name [ref]' -e "repository root, prints the roster's" -e 'then six headings' -e 'Listed, Parked, Ended, Not listed' -e "Start step 1's read of your own name" -e ', with an Events line naming what ended' -e 'prompt wakes it. Any other row is marked' -e "rewrite the row's Name column with the" -e 'you write with the request,' -e 'write its row from that result file with' -e '- **No session id** — nothing.' -e 'cold-read as if fresh' -e 'act on its six headings'
```

Expected: `21` — A16.22's before value, one line per needle. A `no section` line on stderr means a heading was renamed: stop and report.

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/roles/kanri.md "Start" "Sending to a seat" "Shoroku" "Session lifecycle" | grep -c -F -e 'with an Events line per row' -e 'Write the Events line' -e ' with an Events line naming what showed its process gone' -e 'not final: its Events line names what' -e 'wake fails gets the Events line a seat' -e ' with an Events line quoting the human' -e 'with an Events line naming the guard' -e 'is the seat lost: its Events line says' -e "otherwise record in the roster's Events that" -e 'gets no answer and an Events'
```

Expected: `11` — A16.50's before value; eleven lines, the Replace table's first row carrying three needles.

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/roles/kanri.md "Start" "Sending to a seat" "Shoroku" "Session lifecycle" | grep -c -F -e '--roster-event'
```

Expected: `1` — A16.51's before value, the `--roster-event` lines Tasks 14 and 16's earlier passages do not yet add here.

- [ ] **Step 2: Apply the passages**

Apply P16.23 to P16.39 and P16.52 to P16.65.

**P16.23** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
cannot check is relayed marked `(unverified)`. Note `decision: <path>
received from <name>` in the roster's Events either way. You
```

**P16.23 →**

```markdown
cannot check is relayed marked `(unverified)`. Write the roster Events
line `decision: <path> received from <name>` either way, with
`record --roster .tanto/roster.md --roster-event`. You
```

**P16.24** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
   Release table's row keys on, so leave it and record "handover written by
   `<name>`", your bare name, as a roster Events line. **Between plans** there is no
```

**P16.24 →**

```markdown
   Release table's row keys on, so leave it and write "handover written by
   `<name>`", your bare name, as a roster Events line, with
   `record --roster .tanto/roster.md --roster-event`. **Between plans** there is no
```

**P16.25** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
   and the merge is no longer a second question. Write `shoroku-direction.md`
   beside the recommendation,
   item by item, with the `S-n` rows in the ledger: Adopted from the answer.
```

**P16.25 →**

```markdown
   and the merge is no longer a second question. Write `shoroku-direction.md`
   beside the recommendation from `templates/shoroku-direction.md`, item by
   item — one `## Items` line per item, `- <n> — <group> — yes|no — <topic> S-<n>`
   for a ledger row and `- <n> — <group> — yes|no — (inbox <basename>[ #<m>])`
   for an inbox or feedback item — and then write the Adopted cells of the
   ledger's `S-n` rows from it with one call,
   `node "$TANTO/scripts/boundary.js" record --ledger .tanto/<topic>/kanri.md --direction .tanto/<topic>/shoroku-direction.md`,
   which prints each row it wrote, a `direction: no S-n` line for each inbox
   item, and a `direction: unmatched` line for each pointer the table does
   not hold; settle an `unmatched` line before shoki's request.
```

**P16.26** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

```markdown
   which `collect` appends beside them, lint on them (again,
   whole-repository if that is what the script does) — and fill the Written
   column: the docs subject for an adopted row, a row with a compound
   destination included, and shusei's commit subject for a `fix` row, taken
   from the boundary's verdict; a row whose only destination is `feedback`
   is filled at the landing's last act instead ("Shusei, shoki, and the
   landing"). An inbox item has no
```

**P16.26 →**

```markdown
   which `collect` appends beside them, lint on them (again,
   whole-repository if that is what the script does) — and fill the Written
   column by `record`, never by hand. At shusei's boundary its commit
   subject, taken from the verdict, goes into the `fix` rows alone, the
   rows the direction file's `fix` group names:
   `record --ledger <ledger> --written "<shusei's subject>" --only S-a,S-b,…`.
   At shoki's landing the docs subject goes into every other row whose
   Adopted is `yes` and whose Written is `no`, a row with a compound
   destination included:
   `record --ledger <ledger> --written "<the docs subject>"`, which skips a
   row whose Destination is exactly `feedback`; that row is filled at the
   landing's last act instead ("Shusei, shoki, and the landing"). An inbox
   item has no
```

**P16.27** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
`.tanto/<topic>/spawner-results/`, mark the `S-n` rows written — a row whose
only destination is `feedback` waits for the last act below — and write
the Events line. A landing check that fails is a follow-up `docs:` commit
```

**P16.27 →**

```markdown
`.tanto/<topic>/spawner-results/`, write the docs subject into the `S-n`
rows with `record --written`, as "The four steps" step 4 says — a row
whose only destination is `feedback` waits for the last act below — and
write the Events line. A landing check that fails is a follow-up `docs:` commit
```

**P16.28** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
line second; write `feedback <basename>` into the Written cell of each row
whose only destination is `feedback`; and fill the ledger's Measurements
```

**P16.28 →**

```markdown
line second; write `feedback <basename>` into the Written cell of each row
whose only destination is `feedback` with one
`record --ledger <ledger> --written-feedback "<basename>"`, `<basename>`
the placed file's, once `close` has placed it, and fill the ledger's Measurements
```

**P16.29** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
an inbox item's record is its copy's Triage. Write the sweep as one Events
line of the roster. A sweep has no topic, so it measures nothing and
```

**P16.29 →**

```markdown
an inbox item's record is its copy's Triage, and `record --direction` and
`--written` do not run. Write the sweep as one Events line of the roster,
with `record --roster .tanto/roster.md --roster-event`. A sweep has no
topic, so it measures nothing and
```

**P16.30** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
exit — a failed wake, a second `no-role` — gets a roster Events line saying
its shoroku proposal was not written and what was lost as far as you know,
```

**P16.30 →**

```markdown
exit — a failed wake, a second `no-role` — gets a roster Events line,
written by `record --roster-event`, saying its shoroku proposal was not
written and what was lost as far as you know,
```

**P16.31** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
intake's bare name — the `<name>` before the bracket of the `Name [ref]`
column — from `<target workspace>/.tanto/roster.md`, the row whose Role is
```

**P16.31 →**

```markdown
intake's bare name — the `<name>` in the third column, before any bracket,
whichever header that roster carries — from
`<target workspace>/.tanto/roster.md`, the row whose Role is
```

**P16.32** `skills/tanto/roles/kanri.md` — replace exactly these 18 lines

```markdown
**The census.** `node "$TANTO/scripts/boundary.js" census`, from the
repository root, prints the roster's `live` and `queued` rows against the
state file and the sessions `claude agents --json` lists under the root:
the `spawner:` line first, `beating` or `stale`, then six headings —
Listed, Parked, Ended, Not listed, No session id, and Not held — and writes
nothing: you, the roster's one writer, act on what it prints. A session is
its `sessionId`, a row's being the basename of its Transcript column, and
every match of a session to a row compares `sessionId`s, never a name, a
`[ref]`, or a full path. Run the census at your start, before taking a case
(Start step 1's read of your own name stays, and the census follows it); at
every boundary, in loop step 6 before the next request; at every wake-up
whose line comes from a name no roster row holds — a Hosa's
`slot-needed:` or `kessai answer:`, a Kikaku's `decision:` — before you
handle the line; when `seat` prints `no entry`; in "Recovery"; at the plan
close, before the archive move; and before you say anything about a listed
session your roster does not hold. On `spawner: stale` mark nothing, as on
`census: unavailable`: the state file has stopped moving. Otherwise what it
prints decides:
```

**P16.32 →**

```markdown
**The census.** `node "$TANTO/scripts/boundary.js" census`, from the
repository root, prints every roster row it places against the state file
and the sessions `claude agents --json` lists under the root: the
`spawner:` line first, `beating` or `stale`, then seven headings — Listed,
Parked, Ended, Returned, Not listed, No session id, and Not held — and
writes nothing: you, the roster's one writer, act on what it prints,
through `record`. Which row goes under which heading, and your one act for
it, is the table of `SKILL.md`'s "The census"; the bullets below carry the
rules the table does not. A session is its `sessionId`, a row's being the
basename of its Transcript column, and every match of a session to a row
compares `sessionId`s, never a name, a `[ref]`, or a full path. Every
roster Events line this file asks for is written by
`record --roster .tanto/roster.md --roster-event "<text>"`, and none by
hand. Run the census at your start, after `roster show` and before taking
a case (Start step 4); at every boundary, in loop step 6 before the next
request; at every wake-up whose line comes from a name no roster row
holds — a Hosa's `slot-needed:` or `kessai answer:`, a Kikaku's
`decision:` — before you handle the line; when `seat` prints `no entry`;
in "Recovery"; at the plan close, before `boundary.js archive`, with
**Returned**'s acts done before the move; and before you say anything
about a listed session your roster does not hold. On a roster whose header
is not the template's it prints
`census: roster header is not the template's — run boundary.js migrate`
and exits 1: run `migrate` as Start step 4 says. On `spawner: stale` mark
nothing, as on `census: unavailable`: the state file has stopped moving.
Otherwise what it prints decides:
```

**P16.33** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
  itself. Write the row `stopped`, with an Events line naming what ended
  it — `taiseki`, or your own request.
```

**P16.33 →**

```markdown
  itself. Write the row `stopped`, `--status "<sessionId> stopped"`, and a
  `--roster-event` naming what ended it — `taiseki`, or your own request.
- **Returned** — a `stopped` or `dead` row whose seat the state file holds
  `running` or `blocked`, or the listing shows while the state file has not
  ended it (`stopped`, `removed`), its line ending
  `— <row status>; seat <state>`. For `dead`, the seat is back and nobody
  wrote it: `--status "<sessionId> live"`. For `stopped`, the run ended it
  and its process stayed: run `beat`, then write a `stop` request for its
  `sessionId` unless `.tanto/spawner/requests/` already holds one for it.
```

**P16.34** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```markdown
  `blocked`, or `gone`, and the listing does not show. An old-contract row (Start, step 4), `live` or
  `queued`, is marked `dead` with the Events line
  `old-contract row retired: <name>`. Otherwise a `queued` row stays
  `queued`: a waiting seat's absence is expected, and the send of its
  prompt wakes it. Any other row is marked `dead`. For a seat whose
```

**P16.34 →**

```markdown
  `blocked`, or `gone`, and the listing does not show. An old-contract row (Start, step 4), `live` or
  `queued`, is marked `dead` — `--status "<sessionId> dead"` — with the
  `--roster-event` line `old-contract row retired: <name>`. Otherwise a `queued` row
  stays `queued`, its line ending `— queued; its batch line wakes it`,
  whatever the state file holds, `gone` included: a waiting seat's absence
  is expected, and the send of its prompt wakes it. Any other row is
  marked `dead` with `--status` and a `--roster-event`. For a seat whose
```

**P16.35** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
- **Listed**, marked `renamed` — rewrite the row's Name column with the
  listed name, bare, and write `resumed: <old name> → <new name>`; that is
  all. The cell is a record: a line still goes to the name `seat` reads at the send.
```

**P16.35 →**

```markdown
- **Listed**, marked `renamed` — run
  `record --roster .tanto/roster.md --rename "<sessionId> <listed name>"`,
  the name bare, which rewrites the row's Name cell and writes
  `resumed: <old name> → <new name>` itself; that is all. The cell is a
  record: a line still goes to the name `seat` reads at the send.
```

**P16.36** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
  the roster Events line `no first turn: <name>` you write with the request,
  and a later census that prints the suffix for a seat that line names writes
```

**P16.36 →**

```markdown
  the roster Events line `no first turn: <name>`, which `--roster-event`
  writes with the request, and a later census that prints the suffix for a
  seat that line names writes
```

**P16.37** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```markdown
- **Not held** — nothing to the human. A session becomes the run's through
  a result file, never by being listed. A line carrying
  `— spawned as <role> <topic>, result <id>` is a seat the launcher started
  that no row holds: write its row from that result file with
  `boundary.js record --seat`, as you do for the seats you request. A
  standalone Kaiseki, whose topic is `—`, and a messenger, `denrei`, get no
  row.
- **No session id** — nothing.
```

**P16.37 →**

```markdown
- **Not held** — nothing to the human. A session becomes the run's through
  a result file, never by being listed. A line carrying
  `— spawned as <role> <topic>, result <id>` is a seat the launcher started
  that no row holds: write its row from the state file's entry with
  `boundary.js record --roster .tanto/roster.md --seat <that sessionId>`, as
  you do for the seats you request. A standalone Kaiseki, whose topic is
  `—`, and a messenger, `denrei`, get no row. A line ending
  `— row <status>` is a row's own seat — a `stopped` or `dead` row whose
  seat is parked, a `replaced` row whose seat is listed — and asks for
  nothing: a wake is its line's, and the successor's `stop` request ends a
  replaced Kanri.
- **No session id** — a row no key finds, its Transcript cell carrying no
  `sessionId`: nothing is written to it. `migrate` prints it `suspect:`,
  and the human repairs or retires it once.
```

**P16.38** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
directory and a new ledger under the same roster, cold-read as if fresh —
```

**P16.38 →**

```markdown
directory and a new ledger under the same roster, read by `roster show` as
at any start —
```

**P16.39** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
1. Run the census and act on its six headings. Wake, in one `wake` call,
```

**P16.39 →**

```markdown
1. Run the census and act on its seven headings. Wake, in one `wake` call,
```

**P16.52** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
census marks `dead` at once every `live` row it prints under **Not
listed**, with an Events line per row saying whether its shoroku proposal
was written and what was lost — no tab holds state the run needs, so there
```

**P16.52 →**

```markdown
census marks `dead` at once every `live` row it prints under **Not
listed**, with one `record --roster-event` line per row saying whether its
shoroku proposal was written and what was lost — no tab holds state the
run needs, so there
```

**P16.53** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```markdown
the human cleared is a bare window under a known row. Write the Events line
a shoroku proposal not written gets — what was lost, as far as you know —
and the row `stopped`; when the row was the live Jisso's, verify the tree
```

**P16.53 →**

```markdown
the human cleared is a bare window under a known row. With
`record --roster-event`, write the roster Events line a shoroku proposal
not written gets — what was lost, as far as you know — and, with
`--status`, the row `stopped`; when the row was the live Jisso's, verify the tree
```

**P16.54** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
is marked `dead` with an Events line naming what showed its process gone —
```

**P16.54 →**

```markdown
is marked `dead`, with a `--roster-event` line naming what showed its process gone —
```

**P16.55** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
  transcript is on disk, `dead` is not final: its Events line names what
```

**P16.55 →**

```markdown
  transcript is on disk, `dead` is not final: that `--roster-event` line names what
```

**P16.56** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
  wake fails gets the Events line a seat whose shoroku proposal was not
```

**P16.56 →**

```markdown
  wake fails gets, by `--roster-event`, the Events line a seat whose
  shoroku proposal was not
```

**P16.57** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
| the human asks you for a live seat to be set aside for a while — a priority call, not a lifecycle signal | one `stop` for that seat, its row `stopped` with an Events line quoting the human's word, its conversation kept and no shoroku proposal asked, since nothing of the seat's is lost; when the human says so, one `wake` on the same `sessionId`, the woken seat sent the Resuming line for its role, its row `live` again | — |
```

**P16.57 →**

```markdown
| the human asks you for a live seat to be set aside for a while — a priority call, not a lifecycle signal | one `stop` for that seat, its row `stopped` by `--status` and a `--roster-event` line quoting the human's word, its conversation kept and no shoroku proposal asked, since nothing of the seat's is lost; when the human says so, one `wake` on the same `sessionId`, the woken seat sent the Resuming line for its role, its row `live` again by `--status` | — |
```

**P16.58** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
| the live Jisso is gone — the spawner's census marked it `gone`, or the spawner's guard stopped it (`strayed` in `seats.json`), the census does not list it, `wake` fails, or a subscription made when the report was overdue expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers). A seat the spawner's guard stopped is marked `stopped`, its conversation kept, with an Events line naming the guard and the worktree's branch, whose commits, if any, go to the human as a ruling, and is not resumed. Any other gone Jisso whose `wake` has not already failed is **resumed first**: mark the row `dead` with an Events line naming what showed its process gone and saying its conversation is kept, `wake` it (`boundary.js wake <sessionId>`), and when the result lands send the resumed seat `resume batch X from task N`, the line `SKILL.md`'s Resuming gives a Jisso resumed after a restart, its row `live` again. Only when that wake fails — its result carries an error, or the seat's transcript is not on disk — is the seat lost: its Events line says its shoroku proposal was not written and what was lost. For a lost seat, and for a guard-stopped one, write a `spawn` request with the same `batch=` file, its resume line rewritten to `resume batch X from task N`, or, under a skill-editing plan's queue, send that line to the next `queued` seat and put the lost seat to the human as a ruling, since the queue cannot be refilled early |
```

**P16.58 →**

```markdown
| the live Jisso is gone — the spawner's census marked it `gone`, or the spawner's guard stopped it (`strayed` in `seats.json`), the census does not list it, `wake` fails, or a subscription made when the report was overdue expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers). A seat the spawner's guard stopped is marked `stopped` by `--status`, its conversation kept, with a `--roster-event` line naming the guard and the worktree's branch, whose commits, if any, go to the human as a ruling, and is not resumed. Any other gone Jisso whose `wake` has not already failed is **resumed first**: mark the row `dead` by `--status`, with a `--roster-event` line naming what showed its process gone and saying its conversation is kept, `wake` it (`boundary.js wake <sessionId>`), and when the result lands send the resumed seat `resume batch X from task N`, the line `SKILL.md`'s Resuming gives a Jisso resumed after a restart, its row `live` again by `--status`. Only when that wake fails — its result carries an error, or the seat's transcript is not on disk — is the seat lost: its `--roster-event` line says its shoroku proposal was not written and what was lost. For a lost seat, and for a guard-stopped one, write a `spawn` request with the same `batch=` file, its resume line rewritten to `resume batch X from task N`, or, under a skill-editing plan's queue, send that line to the next `queued` seat and put the lost seat to the human as a ruling, since the queue cannot be refilled early |
```

**P16.59** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
| Sekkei is gone before the spec review is accepted | a `spawn` request with the same keys; the spec or its draft, the spec inputs, and `dialogue.md` on disk are the recovery point; run "A seat's exit" first if the session is alive and coherent, otherwise record in the roster's Events that its shoroku proposal was not written and what was lost |
```

**P16.59 →**

```markdown
| Sekkei is gone before the spec review is accepted | a `spawn` request with the same keys; the spec or its draft, the spec inputs, and `dialogue.md` on disk are the recovery point; run "A seat's exit" first if the session is alive and coherent, otherwise write, by `record --roster-event`, the roster Events line saying its shoroku proposal was not written and what was lost |
```

**P16.60** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
| Keikaku is gone before the plan is committed | a `spawn` request with the same three keys; the spec on the branch and the plan draft on disk are the recovery point; run "A seat's exit" first if the session is alive and coherent, otherwise record in the roster's Events that its shoroku proposal was not written and what was lost |
```

**P16.60 →**

```markdown
| Keikaku is gone before the plan is committed | a `spawn` request with the same three keys; the spec on the branch and the plan draft on disk are the recovery point; run "A seat's exit" first if the session is alive and coherent, otherwise write, by `record --roster-event`, the roster Events line saying its shoroku proposal was not written and what was lost |
```

**P16.61** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
| Kaiseki is gone before its report | verify `git status` is clean, and revert stray instrumentation if it is not; a `spawn` request with the same brief; the brief and the WIP commit are the recovery point; run "A seat's exit" first if the session is alive and coherent, otherwise record in the roster's Events that its shoroku proposal was not written and what was lost |
```

**P16.61 →**

```markdown
| Kaiseki is gone before its report | verify `git status` is clean, and revert stray instrumentation if it is not; a `spawn` request with the same brief; the brief and the WIP commit are the recovery point; run "A seat's exit" first if the session is alive and coherent, otherwise write, by `record --roster-event`, the roster Events line saying its shoroku proposal was not written and what was lost |
```

**P16.62** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
name too; from any other sender the line gets no answer and an Events
line. There is nothing to wait for: no tab holds state the run needs, so
```

**P16.62 →**

```markdown
name too; from any other sender the line gets no answer and a
`record --roster-event` line. There is nothing to wait for: no tab holds
state the run needs, so
```

**P16.63** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```markdown
`seat` again and following what it prints, once. A second failure is the
Events line `unsent: <sessionId> — <the line>` and one line to the human. A
```

**P16.63 →**

```markdown
`seat` again and following what it prints, once. A second failure is the
Events line `unsent: <sessionId> — <the line>` — through `record --event`
in the open ledger, and through `record --roster-event` in the roster's
Events when none is open — and one line to the human. A
```

**P16.64** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
the Events line `unsent:` — and not by a census of its own. `ListAgents`
```

**P16.64 →**

```markdown
the Events line `unsent:`, by `record --event` or `record --roster-event`
as that section says — and not by a census of its own. `ListAgents`
```

**P16.65** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```markdown
   Send every `unsent:` line that has no `sent:` pair, writing the pair;
```

**P16.65 →**

```markdown
   Send every `unsent:` line that has no `sent:` pair, writing the pair
   where its `unsent:` line stands — `record --event` in the open ledger,
   `record --roster-event` in the roster's Events;
```

- [ ] **Step 3: Count the old values again**

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/roles/kanri.md "Sending to a seat" "Handover" "Shoroku" "Bug intake" "Session lifecycle" | grep -c -F -e "in the roster's Events either way. You" -e 'your bare name, as a roster Events line. ' -e 'rows in the ledger: Adopted from the answer.' -e 'the docs subject for an adopted row' -e ' rows written — a row whose' -e "; and fill the ledger's Measurements" -e 'line of the roster. A sweep' -e 'gets a roster Events line saying' -e 'Name [ref]' -e "repository root, prints the roster's" -e 'then six headings' -e 'Listed, Parked, Ended, Not listed' -e "Start step 1's read of your own name" -e ', with an Events line naming what ended' -e 'prompt wakes it. Any other row is marked' -e "rewrite the row's Name column with the" -e 'you write with the request,' -e 'write its row from that result file with' -e '- **No session id** — nothing.' -e 'cold-read as if fresh' -e 'act on its six headings'
```

Expected: `0` — A16.22's after value.

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/roles/kanri.md "Start" "Sending to a seat" "Shoroku" "Session lifecycle" | grep -c -F -e 'with an Events line per row' -e 'Write the Events line' -e ' with an Events line naming what showed its process gone' -e 'not final: its Events line names what' -e 'wake fails gets the Events line a seat' -e ' with an Events line quoting the human' -e 'with an Events line naming the guard' -e 'is the seat lost: its Events line says' -e "otherwise record in the roster's Events that" -e 'gets no answer and an Events'
```

Expected: `0` — A16.50's after value.

```bash
node "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto/scripts/passage-check.js" sections --file skills/tanto/roles/kanri.md "Start" "Sending to a seat" "Shoroku" "Session lifecycle" | grep -c -F -e '--roster-event'
```

Expected: `23` — A16.51's after value: every roster Events line in these sections names its flag.

- [ ] **Step 4: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 16
```

Expected: `task 16: verify clean`.

- [ ] **Step 5: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: every hook `Passed` or `Skipped`, exit 0, no file changed.

- [ ] **Step 6: Commit**

```bash
git commit --only -m "docs: Kanri's census, Events lines, and direction write-back go through record" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/roles/kanri.md
```

Expected: one commit, one file changed.

### Task 17: the handover template

Spec 4.2: `templates/kanri-handover.md`'s `## Residency` becomes
`## Reading`, one line, the roster read by `roster show`; its `## Next
step` loses "after its cold read" and names the ledger sections a successor
reads through `passage-check.js sections`, closing 401e's second half. After
this task the handover file a Kanri writes from the template has no
Residency section and points its successor at `roster show` and four named
ledger sections.

**Files:**

- Modify: `skills/tanto/templates/kanri-handover.md` — `## Residency`
  (heading and body) and `## Next step` (body, and a sections line).

**Interfaces:**

- Consumes: `roster show` (Task 8); the ledger's section headings
  `Progress`, `Open questions for the human`, `Session events`, and
  `Measurements` (unchanged, `templates/kanri.md`).
- Produces: the `## Reading` section `roles/kanri.md`'s "The handover file"
  names (Task 15) and the Next step a successor's Handover case continues
  at (Task 14).

**Named-mechanism sites.** The `## Reading` section is also
`roles/kanri.md`'s "The handover file" sections list (Task 15); `roster
show` is also Start step 4 and the Handover case (Task 14), `SKILL.md`'s
scripts paragraph (Task 13), and `boundary.js` (Task 8); the Residency word
elsewhere is O14.7's and O15.1's. No other task edits this file.

**O17.1** `## Residency` — the handover template's section (spec 4.2, Old values "`Residency`"); raw count: 1 in `skills/tanto/templates/kanri-handover.md`, and 1 in `skills/tanto/templates/roster.md` (Task 1's); after: 0 here. The bare word's two lines here are A17.8's.

**O17.14** `Kanri's Residency row in` — the section's body; raw count: 1 in `skills/tanto/templates/kanri-handover.md`; after: 0.

**O17.2** `after its cold read` — `## Next step` (spec, Old values; 4.2); raw count: 1 in `skills/tanto/templates/kanri-handover.md`, 0 elsewhere under `skills/tanto/`; after: 0.

**A17.8** `skills/tanto/templates/kanri-handover.md` — `grep -c -F -e 'Residency' -e 'after its cold read' skills/tanto/templates/kanri-handover.md` — before: 3, after: 0

- [ ] **Step 1: Count the old values (red)**

```bash
grep -c -F -e 'Residency' -e 'after its cold read' skills/tanto/templates/kanri-handover.md
```

Expected: `3` — A17.8's before value.

- [ ] **Step 2: Apply the passage**

Apply P17.9.

**P17.9** `skills/tanto/templates/kanri-handover.md` — replace exactly these 8 lines

```markdown
## Residency

<One line: Kanri's Residency row in `.tanto/roster.md`, by heading, and the
reading taken when this handover was written.>

## Next step

<One line — the successor's first act after its cold read, named as an act and not as a step order: the successor follows the role text it read, which may be newer than the one this file was written from.>
```

**P17.9 →**

```markdown
## Reading

<One line: the reading taken when this handover was written. The successor
reads the roster by `boundary.js roster show`, never the file itself.>

## Next step

<One line — the successor's first act after `roster show` and the census, named as an act and not as a step order: the successor follows the role text it read, which may be newer than the one this file was written from.>

Of each ledger that In flight names, the successor reads four sections and no
more, with one call per ledger:
`node "$TANTO/scripts/passage-check.js" sections --file <ledger> Progress "Open questions for the human" "Session events" Measurements`
— the Session events by their tail.
```

- [ ] **Step 3: Count the old values again**

```bash
grep -c -F -e 'Residency' -e 'after its cold read' skills/tanto/templates/kanri-handover.md
```

Expected: `0` — A17.8's after value.

- [ ] **Step 4: Verify the passage**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 17
```

Expected: `task 17: verify clean`.

- [ ] **Step 5: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/templates/kanri-handover.md
```

Expected: every hook `Passed` or `Skipped`, exit 0, no file changed.

- [ ] **Step 6: Commit**

```bash
git commit --only -m "docs: the handover template reads the roster by roster show and names the ledger sections to read" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/templates/kanri-handover.md
```

Expected: one commit, one file changed.

### Task 18: `README.md` ("Moving a run", the Layout's drift) and the plan-wide sweep

Spec section 7's README bullet and section 9's six-workspace paragraph:
"Moving a run" names `migrate` for a roster of an older shape and says the
first `record` or census in each other workspace after this plan merges
refuses once and names `migrate`. The README review for drift that
`AGENTS.md` asks for after a `SKILL.md` edit is this task's and no other's
(Tasks 12 and 13 edited `SKILL.md`): it finds the Layout's templates list
without the twentieth template and its `boundary.js` entry without `roster
show`, `archive`, `migrate`, the header refusal, and the seven headings,
and carries them. Then the sweep the spec's "Old values this plan
contradicts" asks for: every needle at zero over the files it names, and
its first six over `skills/tanto/` as a whole. The task is the batch's
last; after it the repository's whole skill agrees with the code of
batches A and B.

**Files:**

- Modify: `skills/tanto/README.md` — "Moving a run" (a paragraph after its
  last) and "Layout" (the `templates/` bullet's line naming
  `shoroku-feedback.md`, the `scripts/boundary.js` bullet's `record` and
  `census` lines).

**Interfaces:**

- Consumes: `migrate`, its `.pre-migrate` copy, and its refusal line
  (Task 5); `record`'s header refusal (Task 1); `roster show` (Task 8);
  `archive` (Task 9); the census's seven headings (Task 7);
  `templates/shoroku-direction.md` (Task 1); `SKILL.md` as Tasks 12 and 13
  leave it; every earlier task's passages, which the sweep reads.
- Produces: the README sentence the spec's "What the plan must contain"
  asks for; the sweep's output, which is the batch's acceptance record.

**Named-mechanism sites.** `migrate` is also `scripts/boundary.js`
(Task 5), `SKILL.md`'s "The roster", scripts paragraph, and rule 11
(Tasks 12, 13), and Start step 4 (Task 14). The refusal line is also
`boundary.js` (Task 1) and the census's header line (Tasks 1, 12, 16).
The `boundary.js` subcommands are also `SKILL.md`'s scripts paragraph
(Task 13) and `boundary.js`'s usage line (Tasks 5, 8, 9). The twentieth
template is also `SKILL.md`'s templates paragraph (Task 13). The README
names no Residency table, no `ack`, and no census heading list at the
base, and no other passage of this plan touches it.

**O18.1** ` (the file a close sends the skill's` — the Layout's templates list without `shoroku-direction.md`, at the point where it enters (spec 2.6, "the twentieth"); raw count: 1 in `skills/tanto/README.md`; after: 0.

**O18.2** `rows idempotently;` — the Layout's `boundary.js` entry that stops at `record` and `census` (spec section 7, "the usage line's list of subcommands"); raw count: 1 in `skills/tanto/README.md`, and 1 in `skills/tanto/SKILL.md` (removed by P13.17); after: 0 in both.

**A18.3** `skills/tanto/README.md` — `grep -c -F -e " (the file a close sends the skill's" -e 'rows idempotently;' skills/tanto/README.md` — before: 2, after: 0

**A18.4** `skills/tanto/README.md` — `grep -c -F 'boundary.js migrate --roster' skills/tanto/README.md` — before: 0, after: 1

- [ ] **Step 1: Count the old values (red)**

```bash
grep -c -F -e " (the file a close sends the skill's" -e 'rows idempotently;' skills/tanto/README.md
```

Expected: `2` — A18.3's before value.

```bash
grep -c -F 'boundary.js migrate --roster' skills/tanto/README.md
```

Expected: `0` — A18.4's before value.

- [ ] **Step 2: Apply the passages**

Apply P18.5 to P18.7.

**P18.5** `skills/tanto/README.md` — insert after these 2 lines

```markdown
of the old contract that Kanri leaves for the archive keeps it printing until the
plan's close.
```

**P18.5 →**

```markdown

A roster of an older shape — two tables, with a reading table under its
own heading, or an archive of sixteen columns — is brought to the current
one by one command, run once from the repository root:
`node <skill directory>/scripts/boundary.js migrate --roster .tanto/roster.md --archive .tanto/roster-archive.md`,
with `--ledger <path>` for a ledger still open. It keeps one copy of each
file it rewrites beside it, `<path>.pre-migrate`, refuses a shape it does
not know, and prints the rows it could not place, which are the human's to
keep or drop. Every workspace that uses tanto reads this one skill
directory, so after the plan that made the roster one table merges, the
first `record` or census in each other workspace refuses once, with a line
naming `boundary.js migrate`: run it there then, and the run goes on.
```

**P18.6** `skills/tanto/README.md` — replace exactly these 2 lines

```markdown
  check brief), `shoroku-feedback.md` (the file a close sends the skill's
  repository), `consult.md` (one turn of a consult thread), `tanto.json`
```

**P18.6 →**

```markdown
  check brief), `shoroku-direction.md` (the human's answer to it, item by
  item, which `record --direction` reads), `shoroku-feedback.md` (the file
  a close sends the skill's repository), `consult.md` (one turn of a
  consult thread), `tanto.json`
```

**P18.7** `skills/tanto/README.md` — replace exactly these 5 lines

```markdown
  commands and prints their output under fixed headings, and `record`, which
  writes the conductor ledger's and the roster's rows idempotently;
  `census`, which Kanri runs itself, read-only, to place the roster's rows
  against the spawner's `seats.json` and the sessions `claude agents --json`
  lists under the repository; `request`, the park or leave request a seat
```

**P18.7 →**

```markdown
  commands and prints their output under fixed headings, and `record`, which
  writes the conductor ledger's and the roster's rows idempotently, keyed
  by `sessionId`, and refuses a table whose header is not its template's;
  `census`, which Kanri runs itself, read-only, to place the roster's rows
  under seven headings against the spawner's `seats.json` and the sessions
  `claude agents --json` lists under the repository; `roster show`, which
  prints what a Start reads of the roster; `archive`, which moves the ended
  rows and the Events lines to the archive at a plan close; `migrate`,
  which brings an older roster, archive, or ledger to the templates' shape
  once; `request`, the park or leave request a seat
```

- [ ] **Step 3: Count the old values again**

```bash
grep -c -F -e " (the file a close sends the skill's" -e 'rows idempotently;' skills/tanto/README.md
```

Expected: `0` — A18.3's after value.

```bash
grep -c -F 'boundary.js migrate --roster' skills/tanto/README.md
```

Expected: `1` — A18.4's after value.

- [ ] **Step 4: Verify the passages**

```bash
TANTO="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/tanto"; node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-10-07-roster-ledger.md --task 18
```

Expected: `task 18: verify clean`.

- [ ] **Step 5: The plan-wide sweep of the spec's "Old values this plan contradicts"**

The spec's first six needles — `Residency`; `Name [ref]` in both
spellings; `cleared` as a `record --status` word; `"ack"`, `seat.renamed`,
`` `ack` ``, and the `acked` field; `rewrite the roster`; `cold-read the
roster`, `after its cold read`, and `cold-read as if fresh` — over
`skills/tanto/` as a whole, every file:

```bash
! grep -rn -F -e 'Residency' -e 'Name [ref]' -e 'Name `[ref]`' -e '"ack"' -e 'seat.renamed' -e '`ack`' -e '`acked`' -e 'rewrite the roster' -e 'cold-read the roster' -e 'after its cold read' -e 'cold-read as if fresh' skills/tanto/
```

Expected: no output, exit 0. A printed line is a site no task carried: stop and report it.

`scripts/boundary.js`, by the spec's needles for it — `cleared` in the
`--status` pattern, `Stag[e]`, `RETIRED_COLUMN`, `"t2"`, `matched by the
Name column` — and `writeResidency`, which Task 1 removes:

```bash
! grep -n -F -e 'live|cleared' -e 'Stag[e]' -e 'RETIRED_COLUMN' -e '"t2"' -e 'matched by the Name column' -e 'writeResidency' skills/tanto/scripts/boundary.js
```

Expected: no output, exit 0.

The rest of the spec's list over the files it names: rule 11's "templates
a session reads once" (its unwrapped tail, O13.9), `Transcript is
dropped`, the peer line and the name-keyed flags, `refused` as a status,
the `or dead` clause, and the brief's `<name [ref]>` and `<kanri name>`
(0 at the base already, measured again):

```bash
! grep -n -F -e 'reads once —' -e 'Transcript is dropped' -e '<role> <name> <reading>' -e '--kanri "<name>"' -e '--jisso "<name>"' -e '--status "<name>' -e 'replaced, refused' -e 'when the census does not list' -e '<name [ref]>' -e '<kanri name>' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/templates/roster-archive.md skills/tanto/templates/boundary-brief.md
```

Expected: no output, exit 0.

`scripts/boundary.js` and the test files are inside the first fence's scope, not placed apart: Tasks 5, 8, 9, and 10 spell every retired string the old shape's fixtures and `migrate`'s recognition need in two parts (`OLD_NAME`, `OLD_READINGS`, `RETIRED_ITEMS_COLUMN`, and the joined fixture strings), so that none of the eleven needles survives in them, and any hit the first fence prints is a finding.

- [ ] **Step 6: Lint the changed path**

```bash
./scripts/lint.sh skills/tanto/README.md
```

Expected: every hook `Passed` or `Skipped`, exit 0, no file changed.

- [ ] **Step 7: Commit**

```bash
git commit --only -m "docs: the README names boundary.js migrate for an older roster, and the new boundary.js subcommands" -m "Co-Authored-By: Claude <noreply@anthropic.com>" -- skills/tanto/README.md
```

Expected: one commit, one file changed.

## Self-Review

**Spec coverage.** Spec section 1 is carried by Task 1 (the templates, the one-row model, 1.1-1.3) and Task 5 (`migrate`, 1.4); section 2 by Tasks 1-4 (2.1 and 2.2 and the readings of 2.3 in Task 1, the status, suffix, counts, and peer line in Task 2, 2.4 in Task 3 — with the `--seat` rewrite that keeps what the result lacks in Task 1 — 2.5 and 2.6 in Task 4) and Task 6 (the brief and the three `roles/kanri.md` paragraphs, 2.3's last paragraph); section 3 by Task 7 (the census) with the contract's table in Task 12 and the role's census paragraph in Task 16; section 4 by Task 8 (`roster show`), Task 14 (Start), and Task 17 (the handover template); section 5 by Task 9 (`archive`) with Task 15's Release row; section 6 and 2.2's `tanto.js` readers by Task 11; section 7's file list by the tasks above, file by file (the table under the Batches heading and each task's Files); section 8's three batches and five constraints by the Batches table and Global Constraints; section 9's six-workspace paragraph by the Global Constraints' "A batch reaches every workspace" and Task 18's README sentence; "Old values this plan contradicts" by every task's O blocks and fences 4 and 5; "What the plan must contain" by the fixtures of Tasks 1, 4, 5, and 11 and the sweep of Task 18. The spec's two ADRs, its Requirements, and its Deferred items are the close's, not a task's.

**Sizes.** The largest task is Task 1 at 1697 lines and nine steps; Task 16 follows at 755, and five more pass 550 lines — Tasks 2 (554), 3 (628), 4 (551), 5 (631), and 11 (604). Task 1 is the one the drafter was asked to cut only if it could say why: the roster and archive templates, the schema check, the cell grammar, and the one-row model had to land together because the tests copy the templates and the old two-table tests had to be rewritten in the same commit for the suite to be green; Task 16 stays one task although the cold read added fourteen passages to it, since they are one mechanism (`--roster-event`) in one file and a Task 16b would split its sites across two reviews. Every script task has seven to nine steps (tests red, passages, Verify, the test file green, lint, commit). Task 18 is partly a **sweep-and-check** shape — its Step 5 records output beside its README passages; no other task is. No threshold is set: the sizes are recorded until one can be chosen (issue-7281).

**Interfaces between the tasks**, fixed here because three drafters wrote them at once from the spec and then reconciled:

- Task 1 produces the header helpers `TEMPLATES`, `headerAt(lines, heading)`, `templateHeader(template, heading)`, `headerMismatch(file, template, heading)`, `SESSIONS_HEADER` (now the template's whole header), and `seatRowAt(doc, sessionId)`; Tasks 8 and 9 read them, and Task 5's `archiveFromTemplate(file)`, `sessionsEnd(lines)`, `separatorOf`, and `OLD_NAME`.
- `boundary.js seat` and `wake` print the `sessionId` as a sixth field (Task 2); every `record` flag that took a name takes it (Tasks 1-2); Kanri resolves a peer's name at receipt (Task 6's brief, Task 14's and Task 16's role text).
- Task 9 owns `boundary.js`'s header comment, usage line, and the unknown-subcommand test and lists all ten subcommands; Task 5 leaves them. Task 11 owns `boundary.js`'s last line (`module.exports = { cells }` behind a `require.main` guard), so that `tanto.js` takes the one cell grammar.
- `roles/kanri.md` is edited by Tasks 6, 14, 15, and 16 over disjoint ranges of the base blob, `SKILL.md` by Tasks 12 and 13, `templates/spawn-request.md` by Task 10 alone, and `templates/kanri.md` by Task 1 alone.

**Sites the spec's section 7 does not name, taken so that no file contradicts another** — each flagged again in its task and filed in the dialogue: `roles/kaiseki.md` and `templates/bug-report.md`, one line each in Task 13, for the intake route's read of "the `Name [ref]` column" (D-7); `templates/spawn-request.md`'s four `ack` sites, in Task 10 with the spawner change that retires the op (D-8); the `seat` line's five-word form in `SKILL.md` "The address" (Task 12) and `roles/kanri.md` "Sending to a seat" (Task 14), for the sixth field; the README's Layout drift, in Task 18. The human may override D-7 and D-8 in Kanri's window or a Kikaku decision.

**Where the spec left a choice, and what the plan chose** — each stated in its task, listed for the cold read:

- Content moved between the tasks the brief gave: the readings' `sessionId` key, `--read-at`, and the `--seat` rewrite that keeps what the result lacks moved into Task 1 (removing `writeResidency` rewrites both writers); `sItemCells`, `RETIRED_COLUMN`, and `"t2"` go in Task 4, which owns `writeSItem`'s lines; `--s-item --roster` is Task 3's, beside the `--ledger` exception; `--suffix` takes one value per call, since Task 3 owns `REPEATABLE`.
- The live `.tanto/roster-archive.md` is not one 16-column table: it holds a 15-column and a 16-column table under `## Sessions` and a section per closed plan. `migrate` converts every table under `## Sessions` in place (Context `—` where a row had none), leaves the per-plan sections as history, and appends moved rows after the last Sessions table; checked against copies of the live roster, archive, and ledger — every row joined, no `unplaced:` or `suspect:` line, a second run current.
- `seat` prints the sixth field and so does `wake`, since the role text says `wake` prints what `seat` would.
- The Release row's Plans count uses `--kanri-count plans`, an increment, following spec 2.3, the human's answer I-3, and Constraint 2, not section 7's `--kanri-counts`.
- The census's No session id test is a census-side `rowSessionId` (letters, digits, dashes), not the strict UUID of the write-side check, so existing `sess-*` fixtures stay valid and f07a's cell is still caught; it reads rows of any status, as the table says. A `stopped` or `dead` row is Returned only when its seat is held `running` or `blocked`, or listed while the state file has not ended it; the contract carries that clause in the census table (P12.12) and in the role's Returned bullet (P16.33), so code and text agree.
- The launcher's `held:` entry applies only when no handover file exists, which keeps the existing handover test.
- `roster show` and `archive` take `--root` (the census's convention) to find `seats.json`, and read the header through Task 1's helpers; a refusal prints `record wrote nothing` with the command's own name.
- Task 5's tests and `migrate` spell the retired strings in two parts (`OLD_NAME`, `OLD_READINGS`, `RETIRED_ITEMS_COLUMN`), and Task 10's rewritten tests spell the retired op in two, so that the whole-skill sweep, scripts and tests included, finds no fixture and no hit needs placing.
- The Residency needles are narrowed to `Residency row`, `Residency table`, `inherits, Residency`, and `## Residency` in `roles/kanri.md`, so that `migrate`'s own code text cannot trip the needle-in-new-text check; the anchors still count the bare word, nine lines in `roles/kanri.md` where the spec says ten.
- Start step 4 runs `migrate` when `show` prints the migrate or `cleared:` line, "Session lifecycle" gains a **Returned** bullet, and the between-plans reading uses `--read-at "turn <HH:MM>"`.
- The anchor on the new `shoroku-direction.md` is dropped: replay runs `git show main:` on every anchor's path and the file does not exist on `main`.

**The cold read, and what it changed** (`.tanto/roster-ledger/coldread.md`, six questions, D-9 to D-14 in the dialogue): a stop condition of batch B that no fence backed is now fence 8 of How a batch is verified, which the verifier runs (the census's seven `## <heading>` lines and `roster show` under a second, against the live roster, gated on `spawner.js` having changed); Global Constraints say what a handover written inside this plan carries for each of its three windows and that the four Jissos' rows are written by the old `record --seat` before batch A's line is sent; Kanri takes its own transcript path from its scratchpad path and never from a roster row whose Transcript cell may be the bare `<sessionId>.jsonl` (Tasks 1, 3, 6, 14, with a test that pins the rewrite); O13.1's stale "may keep the old header" is gone, so O1.40 and fence 5 are the one binding rule; and Task 16 names `--roster-event` at every roster Events line of the role file (P16.52 to P16.65) — four Events lines whose target may be a ledger line are left to the census paragraph's general rule.

**Needle counts are measured, not copied.** Every O block's `before:` count is a `git grep -F` count at `2fe109a` by its drafter — occurrences where a line holds the needle twice (O3.14, O6.11), which `git grep -c` shows as lines; nothing consumes the figure, since fence 4 tests for 0 afterwards — and the spec's own counts were not used for any number a command consumes — the spec's "Residency occurs … 10 times" in `roles/kanri.md` reads 9, and `boundary.js` 8 where it says 12. Fence 4's needle list is written from the O blocks by script at assembly, each needle over the files where it was found at the base and gated per file on the batch that rewrites it.

**What is not checked here.** No test was run against the plan's passages as a whole: each drafter simulated its tasks over a scratch assembly (boundary.test.js green at each of Tasks 1-9 as far as that goes, 80 tests at Task 11; spawner.test.js 83 of 83 at Task 10; tanto.test.js 68 of 68 at Task 11; the whole suite 380 of 380 on batch A's final stage), and `replay` applies every passage and every anchor. Its eleven DIFFERS lines are all artifacts of running a plan's commands on the fully applied scratch tree: eight are a step's before-count (the tree already holds the after text; each re-run on the base printed its stated value, or, for A16.51, the task-local value its block says) and three are `! grep` sweeps that print nothing and exit 0. The `rm … && git checkout` restore of the created `shoroku-direction.md` is named by a `replay-skip:` declaration. `./scripts/lint.sh` and the `node --test` fences are skipped by `replay` and first run at batch A's boundary, as is `boundary --plan` itself. The run-time behavior of the new commands against the real roster is Kanri's act at batch A's boundary (`migrate`) and the plan's close (`archive`, `--direction`, `--written`).
