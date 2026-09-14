# tanto's token reading, its presence-gated ceiling, and the exit proposal written unasked Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the skill a token instrument and a rule that acts on it. A second
executable, `scripts/reading.js`, prints the reading — now five figures, the
fifth `context=` summed from the harness's own `usage` object — and, on request,
a ceiling derived from the session's measured baseline, a presence verdict read
from the human's last turn in Kanri's own transcript, the `autoCompactWindow`
backstop, and the share of usage spent at a large context. Kanri gains a fourth
handover signal and Jisso a Replace symptom, both fired at the next boundary
once the ceiling is crossed and both gated on the human being there to create
the successor; when the human is absent the crossing is a recorded **deferral**
and the run continues to the plan close, which already hands over. Riding with
it, because it is the same cost line: a Sekkei or Keikaku writes its exit
proposal unasked at its own final boundary and names it in the same report line,
so no seat idles across the one-hour cache TTL waiting for an `exit:` whose only
remaining act is the exit.

**Architecture:** Two shapes, and the batch cut follows them. **Batch A is
code**: `scripts/reading.js` and `scripts/reading.test.js`, both written whole
as `W` blocks, test-first — the test file lands and is watched to fail, then the
script lands and is watched to pass — over a `ceiling` map added to
`templates/tanto.json` first, because the script reads it. **Batches B to E are
passages**: each task carries the old passage and the new passage verbatim,
replaces exactly the one for the other, and changes no other byte, so a touched
file's diff against the base is the union of the passages landed in it so far.
Each block appears in this plan exactly once and is cited by its id wherever it
is needed again.

**Tech Stack:** Markdown and Node. `node "$TANTO/scripts/passage-check.js"`
(Node 22 or newer) for `lint`, `replay`, `diff`, `verify`, `frame` and
`boundary`; `node "$TANTO/scripts/reading.js"` from batch A onward; `node --test`
on the pinned Node 22 through `mise x node@22`; `pre-commit` through
`./scripts/lint.sh` (Windows: `scripts\lint.bat`); `git diff` against the base,
`git ls-files --eol`, and `grep -rn` / `grep -rcF` for the sweeps.

**Spec:** `docs/superpowers/specs/2026-09-14-tanto-context-ceiling-design.md`

## Global Constraints

Built from `AGENTS.md`, `docs/AGENTS.md`, `tanto.json`, and the spec's own
scope statements. Every batch prompt restates these; trust the prompt over
recollection.

### The shell

**Every fenced block in this plan runs in Git Bash.** The host's primary shell
is PowerShell, where a POSIX `grep -c '...'` with single quotes is unrunnable.
Every dispatch says so. Where a step names `./scripts/lint.sh`,
`scripts\lint.bat` with the same arguments is the Windows equivalent and is run
from PowerShell or `cmd`.

### Repository rules

- American English for everything in the repo — code, messages, comments,
  docs, commits, branch names.
- Run `./scripts/lint.sh` on the changed paths, each named individually.
  `roles/keikaku.md` now also allows a whole-repository run where the script
  takes no path arguments; this repository's script always takes explicit
  paths, so that alternative does not apply here — name every path.
- Commit by explicit path with `git commit --only <paths>`; the index is
  shared. This plan creates two tracked files (`scripts/reading.js`,
  `scripts/reading.test.js`); the two tasks that create one run `git add
  <path>` first — `--only` cannot pick up an untracked path.
- Every commit message ends with a `Co-Authored-By:` trailer identifying the
  agent. **The check greps the prefix `Co-Authored-By: Claude`, per commit, in
  a loop** — an aggregate `grep -c` over the branch counts trailer lines, so
  whichever model actually implements a task satisfies it under its own name,
  not only the name a task's own draft commit message happens to carry.
  **Every commit fence in this plan was written by the drafter, on `opus`, and
  ends `Co-Authored-By: Claude Opus 5 (1M context)`.** The Models table above
  dispatches `task.implement` on `sonnet`: substitute whatever model actually
  ran the dispatch, by name, in every commit fence's trailer before running
  it — copying the fence's own name verbatim writes a false attribution.
- **A modification in the shared tree that this task, or a subagent it
  dispatched, did not make is not its to discard.** It is reported — one line
  to Jisso from a `task.implement` dispatch, one line to Kanri from Jisso — and
  never run through `git checkout --` or `git clean` on the implementer's own
  judgment; only Kanri decides whether it is stray.
- Never `git add -A`, `.`, or `-u`; never a bare `git commit`; never
  `git commit -a`. Never amend a published commit. Never push to
  `origin/main`. Never bypass a hook (`--no-verify`, a `core.hooksPath`
  override).
- Do not edit agent instruction files, repo-root Markdown, or
  linter/formatter configuration. This plan touches none of them:
  `skills/tanto/*` is the skill's own content, not a repo-root instruction
  file, and `.markdownlint-cli2.yaml` / `.gitattributes` are read by this
  plan's checks and written by nobody.

### Models

Every dispatch names both a `model` and a `subagent_type`, from
`subagents.<kind>` in the merged `tanto.json`. **All twelve
`tanto-<object>-<act>` definitions already exist on this machine and are
visible to this run's sessions** — confirmed at Keikaku's own start sequence
(12 current, 0 written, 0 not visible) — so, unlike a run that has to build
them, no dispatch here omits `subagent_type` for want of a definition to name.

| Dispatch | kind | `subagent_type` | model | effort |
| --- | --- | --- | --- | --- |
| implementer, fix rounds 1-3 | `task.implement` | `tanto-task-implement` | `sonnet` | `high` |
| task reviewer, spec conformance | `task.review-spec` | `tanto-task-review-spec` | `opus` | `medium` |
| task reviewer, quality pass | `task.review-quality` | `tanto-task-review-quality` | `opus` | `medium` |
| fix rounds 4-5 (the escalation) | `task.escalate` | `tanto-task-escalate` | `opus` | `high` |
| anything else — an ad-hoc search, a one-off exploration | `default` | `tanto-default` | `sonnet` | `medium` |

**Every dispatch names a `model`.** An omitted `model` inherits the
dispatching session's own — `sonnet` for Jisso and for this run's Kanri — which
is not the failure the reference run recorded, but the rule does not bend for
that: name it every time regardless.

### `$TANTO`

`$TANTO` is the tanto skill's own directory, which the harness names when it
invokes the skill. It is set **in the same tool call as the command that uses
it**; shell state does not persist between calls, and an unset variable makes
the command read a path at the filesystem root. In this repository the skill
is linked into the working tree at `skills/tanto`, so `TANTO=skills/tanto` is
the form every command in this plan spells.

### The created paths

Two tracked files, created by tasks 2 and 3 of batch A: `scripts/reading.js`
and `scripts/reading.test.js` (File structure table above). `diff` exempts a
`created:` path from its added-line check, and **a created path carries no `P`
and no `A` block** — `replay` builds its list of base blobs from every block
that names a path and is not a `W`, so a `P` or `A` block on a path absent at
the base makes the whole dry run exit 2 before a single check runs. Each new
file is therefore one `W` block, checked by an ordinary fenced `node --test`
step in its own task, never by an anchor.

Task 17's dogfood report is a third new path and is **deliberately not**
declared `created:`, because its name carries the date it is written, which
this plan cannot know — see File structure's rule on its `unaccounted-added`
lines at batch E's boundary.

### `diff`'s base is the commit before this plan's own first commit — which is *not* the first commit touching these paths

**This branch already carries a commit that touches several of the paths this
plan writes**, landed deliberately *before* this plan was drafted, to keep it
out of this plan's own passages rather than colliding with them: `5c84d68`
("stray-edit rule, check-brief interim form, tanto.json re-read, config-dir
mitigations, lint-scope wording") touches `skills/tanto/SKILL.md`,
`roles/jisso.md`, `roles/kanri.md`, `roles/keikaku.md`, and
`templates/kanri.md` — five of the fifteen paths in the File structure table.
Measured 2026-09-14: `git log --format=%H --reverse main..HEAD -- <the fifteen
paths, the two created ones included>` returns exactly that one hash, and
nothing else.

The tanto-cost run's derivation — the parent of the **first** commit in the
range — assumed no commit touched those paths before task 1, which does not
hold here. The right anchor is the **last** commit in the range **as of right
now, before task 1's first commit** — a base that already includes `5c84d68`,
so its lines are not in the diffed range at all and no passage need account
for them:

```bash
BASE="$(git log --format=%H main..HEAD -- skills/tanto/templates/tanto.json skills/tanto/SKILL.md skills/tanto/templates/batch-report.md skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md skills/tanto/templates/kanri-handover.md skills/tanto/roles/kanri.md skills/tanto/roles/jisso.md skills/tanto/templates/kanri.md skills/tanto/templates/batch-prompt.md skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md skills/tanto/roles/kaiseki.md skills/tanto/README.md docs/notes/tanto-consistency-checks.md | head -1)" && echo "$BASE"
```

No `--reverse` and no trailing `^`: `head -1` on a plain (newest-first) log is
the most recent commit touching any of these paths so far, used **as** the
base, not as the commit whose parent is the base. **No commit hash is written
here** — a hash in tracked content goes stale the first rebase — the command
is what the plan carries, and it resolves to `5c84d68` only until task 1
commits, after which it resolves to whatever task 1 landed — so it must be run
and recorded **before** task 1's first commit, not at batch A's boundary,
which comes after it. Kanri runs it once, at the plan's landing, the same
moment Rule 11 says the authority ruling is recorded, and writes the resolved
value into the ledger. **A later re-derivation that yields a different hash
is a stop, not a recompute**: the
hotfix lane is closed for every path this plan lists in its File structure
table while this plan is in flight (`SKILL.md`'s Rules item 5, the "never on a
file the in-flight plan lists" clause), so nothing else should land on these
paths between boundaries.

### The commands `replay` does not run

`replay` reads this list the way it reads `created:` — declared once here
rather than marked line by line. `git`-first commands and `passage-check.js
verify` invocations are skipped by the script's own built-in rules and need no
declaration; measured 2026-09-14 running `replay --base HEAD` against this
plan as drafted, before this declaration existed, every other class of
command that cannot run against a scratch tree came back `DIFFERS`, not a
plan defect — each is declared here instead of quietly left to differ:

```text
replay-skip: ./scripts/lint.sh — pre-commit needs the repository and its hook cache, which the applied tree is not
replay-skip: mise x node@22 — the test suite is run against the real repository's Node toolchain, not a scratch tree
replay-skip: node --test — the applied tree carries the instrument's blobs but not its node_modules or its runner's cwd assumptions, and a real test run's TAP output is not the kind of text a prose Expected: paragraph can quote verbatim
replay-skip: .tanto/ — the topic's state is the working tree's, and an applied copy of the plan's blobs has no such directory
replay-skip: <your own transcript path> — the transcript is the running session's own, unavailable to a scratch-tree replay
replay-skip: <kanri's transcript> — both transcript paths are the run's own sessions', unavailable to a scratch-tree replay
replay-skip: /tmp/tanto-checks.sh — the note's own checks read the whole skill's current file set and need the real git repository, neither of which the applied tree provides
```

**A pattern that names a filename matches almost every command a plan runs,
and that is the shape to avoid** — none of the seven above does: each matches
only the command class it names. The dogfood commit's
`docs/reports/<date>-tanto-context-ceiling-dogfood.md` fence is already caught
by the `./scripts/lint.sh` pattern, since that fence opens with a lint
invocation; no eighth pattern is needed for it.

**The whole-tree sweeps are deliberately *not* skipped where they can run.**
Task 16's per-needle `grep -rcF` loop over `skills/tanto` and
`docs/notes/tanto-consistency-checks.md` runs against the applied tree — every
file that carries an `O` needle also carries a passage, so the applied tree
holds the same text the real tree will hold after the plan, and the sweep is a
real test of the thirty-one needles' stated dispositions. Only the *loading*
of that needle list from `.tanto/` is skipped, per the pattern above — the
needles themselves are read from this plan's own `O` blocks when `replay`
runs, not from the untracked file a live run writes for its own convenience.

### Rule 11 — the authority for this run's sessions, and where a role may be started

This plan edits `skills/tanto/` files that the run's own sessions read, and
this repository links the skill into the working tree, so a session started
mid-plan reads whatever is on disk at that moment. **Until batch E's boundary,
the authority for every session of this run is this Global Constraints
section, Kanri's orders line, and the batch prompts — not the role text on
disk.** Kanri records that as a ruling when the plan lands, and every batch
prompt and any handover file carries it.

**The replacement boundary is batch E's — the final one.** It is not a choice
of caution: `SKILL.md`'s reading section (batch B) and the templates' slots
(batch B and C) must agree with the role files' own reading pointers, and the
last of those pointers — `roles/kaiseki.md`'s — does not land until batch E;
`roles/kanri.md`'s ceiling rule (batch C) reads a `ceiling` map that lands in
batch A but is not described in `SKILL.md`'s config section until batch B; and
the exit-proposal-unasked change (batch D) touches `SKILL.md`, two role files,
and `roles/kanri.md`'s own sites together, none of which is complete alone. At
every boundary before E, some file of the skill contradicts another — exactly
the half-edited-skill case rule 11 exists for. So:

- No role of this run is replaced, and no further role is created, before
  batch E's boundary.
- The two standing exceptions hold. **Kanri's own handover proceeds when it is
  due**, and its successor takes this authority sentence from the handover
  file rather than from the tree. **A Kaiseki, if one is needed**, is a Kanri
  ruling recorded as `R-n`, made with the half-edited skill in view; its brief
  says which text it must not trust.
- The sweep that shows E is the boundary: every term a later batch lands is
  greppable in this plan's own new-passage blocks, and plan review's item 4
  runs it. Stated here as a property, not as a promise.

**This run's own Kanri and Jisso take the four-figure reading and are not
bound by the ceiling rule until this plan lands.** Task 17's dogfood measures
the five figures on their transcripts from the batch that lands the script
(batch A, once task 3 commits) onward — the run that builds the instrument is
also its first subject, per the spec's own section 8.

### The workspace

**No worktree.** All roles share the working tree and the branch
`tanto-context-ceiling`, already cut from `main` by Sekkei. Kanri verifies the
tree in place and the human can watch it. The merge decision is the human's.

---

## File structure

Fifteen paths carry a block, and the table says which task lands each and in
which batch.

| Path | Task | Batch | What changes |
| --- | --- | --- | --- |
| `skills/tanto/templates/tanto.json` | 1 | A | the third top-level map, `ceiling` |
| `skills/tanto/scripts/reading.test.js` | 2 | A | **created** — the thirteen cases that specify the five figures and the four lines |
| `skills/tanto/scripts/reading.js` | 3 | A | **created** — the instrument itself |
| `skills/tanto/SKILL.md` | 4, 5, 11, 13 | B, D | the reading, the `ceiling` map, Artifacts, Session exit, one Artifacts row |
| `skills/tanto/templates/batch-report.md` | 6 | B | the Ceiling slot under Transcript |
| `skills/tanto/templates/roster.md` | 6 | B | the Context column and the paragraph under Residency |
| `skills/tanto/templates/roster-archive.md` | 6 | B | the Context column and the dropped-columns sentence |
| `skills/tanto/templates/kanri-handover.md` | 6, 10 | B, C | the Context column; the In flight Deferred line |
| `skills/tanto/roles/kanri.md` | 7, 8, 9, 13 | C, D | the backstop, the measurement points, the fourth signal and its gate, the deferred state, loop step 6, Replace, the exit sites, Delete |
| `skills/tanto/roles/jisso.md` | 10 | C | the batch-report step's `--role jisso` run and the Ceiling slot |
| `skills/tanto/templates/kanri.md` | 10 | C | the three Measurements rows and the Progress line's deferred clause |
| `skills/tanto/templates/batch-prompt.md` | 10 | C | the deferral notice in the previous-batch-verdict section |
| `skills/tanto/roles/sekkei.md` | 12 | D | the tenure-ends line and the exit shoroku bullet |
| `skills/tanto/roles/keikaku.md` | 12 | D | Handoff and the exit shoroku bullet |
| `skills/tanto/roles/kaiseki.md` | 14 | E | the reading pointer |
| `skills/tanto/README.md` | 14 | E | the reading bullet, the Node bullet, the Layout |
| `docs/notes/tanto-consistency-checks.md` | 15 | E | the three structural counts, check 16 amended, check 17 added |

Tasks 16 and 17 carry no path: task 16's deliverable is the recorded output of
the old-value sweep and the note's own checks, and task 17's is the dogfood
report and the measurements in it.

**Two paths are created by this plan**, and `diff` exempts a `created:` path
from its added-line check, because there is no base blob for a passage to be
measured against:

```text
created: skills/tanto/scripts/reading.js
created: skills/tanto/scripts/reading.test.js
```

**A created path carries no `P` and no `A` block, and that is the instrument's
limit rather than a choice.** `replay` builds its list of base blobs from every
block that names a path and is not a `W`, so a `P` or an `A` block on a file
that does not exist at the base makes the whole dry run exit 2 —
`fatal: path '…' does not exist in '<base>'` — before a single check runs. Each
of the two new files therefore appears exactly once, as one `W` block, and is
checked by an ordinary fenced `grep`/`node --test` step in its own task rather
than by an anchor.

**Task 17's report is a third new path, and it is deliberately not declared
`created:`.** Its name carries the date it is written, which this plan cannot
know, so its added lines are `unaccounted-added` at batch E's boundary. The rule
at that boundary: an `unaccounted-added` line is accepted when its path is
`docs/reports/<date>-tanto-context-ceiling-dogfood.md`; anywhere else it is the
defect the check exists for.

**This plan touches nothing under `docs/decisions/`, `docs/requirements/`, or
`docs/issues/`, and nothing in `docs/design/4807-tanto.md`.** Those are T1's,
which Kanri runs from the spec's own sections after the plan lands, per
`docs/AGENTS.md`'s rule that project context documents are written by an agent
at a shoroku stage and not by a plan task. The T1 list is at the end of this
plan, so that the recommender and the human see what is owed.

`passage-check.js`, its test file, and the six templates this plan does not
name — `bug-report.md`, `kaiseki-brief.md`, `kaiseki-report.md`,
`review-brief.md`, `kikaku-decision.md`, `agent.md` — are untouched, and so are
`roles/kikaku.md` and `roles/hosa.md`, which carry no reading pointer.

---

## Batches

Five batches, seventeen tasks, in the order spec section 8 fixes: A's
instrument is what every later boundary measures itself with, B fixes the
vocabulary the role files use, C and D each land one whole rule, and E closes
over everything the others left pointing or unswept. Every batch is a Kanri
directive: no worktree (Global Constraints), lint on the changed paths named
individually, and `boundary --plan` before the human is told the batch is
verified.

| Batch | Tasks | Delivers | Stop conditions at the boundary |
| --- | --- | --- | --- |
| A | 1 `templates/tanto.json`'s `ceiling` map; 2 `scripts/reading.test.js` (created); 3 `scripts/reading.js` (created) | the instrument and its config, tested — nothing else names the script yet | `verify --task 1..3` clean (task 1 reports its passage, tasks 2 and 3 report `no passages` — the two `W` blocks, not `P`); `node --test skills/tanto/scripts/reading.test.js` — 13/13 pass; the `tanto.json` JSON-parse check prints `tanto.json ok 3 4`; `node skills/tanto/scripts/reading.js <a real transcript>` prints its five-figure line; `diff --base <the resolved base>` clean, the two created paths exempt; lint clean on the three changed paths |
| B | 4 `SKILL.md`'s "The transcript reading"; 5 `SKILL.md`'s config section and Artifacts; 6 the four templates' reading slots and columns | the reading and the config, as every role reads them | `verify --task 4..6` clean; `diff` clean under the base rule; lint clean; `SKILL.md`'s frontmatter loads through a real YAML parser (no `: ` in `description`); the Residency header row identical across `templates/roster.md` and `templates/kanri-handover.md`, which both copy it verbatim (P6.2/P6.6, cited again at task 15) — `templates/roster-archive.md`'s Sessions table is a different row, with `Model`, `Branch`, `Started`, `Ended`, and `Status` columns Residency does not carry (O6.2, P6.4) |
| C | 7 Kanri's backstop, its two measurement points, and Readings; 8 the fourth signal, the presence gate, the deferred state; 9 loop step 6, the Replace row, the handover's Deferred line; 10 `roles/jisso.md` and the three templates the rule fills | the ceiling rule, whole and self-consistent in `roles/kanri.md` and `roles/jisso.md` | `verify --task 7..10` clean; `diff` clean under the base rule; lint clean; `node skills/tanto/scripts/reading.js <transcript> --role kanri --presence --backstop` prints all five lines the spec's Verification names |
| D | 11 `SKILL.md`'s "Session exit"; 12 `roles/sekkei.md` and `roles/keikaku.md`; 13 the Kanri sites and the `coldread.md` Artifacts row | the exit proposal written unasked, in `SKILL.md` and all three role files it touches | `verify --task 11..13` clean; `diff` clean under the base rule; lint clean; the carrier line `coldread answered: <pointer, one per question, or none>; exit proposal: <path> — <reading>` byte-identical across `SKILL.md`, `roles/keikaku.md`, and `roles/kanri.md` |
| E | 14 `roles/kaiseki.md` and `README.md`; 15 the consistency note; 16 the `O` sweep and the note's own checks (sweep-and-check); 17 the dogfood (sweep-and-check) | the last reading pointer, the README after its drift review, the standing checks widened, and the proof that the run stayed under its own ceiling | **the replacement boundary opens here**, per Rule 11; `verify --task 14..15` clean (tasks 16 and 17 report `no passages`, a result, not a failure); `diff` clean under the base rule, task 17's report path exempt as `unaccounted-added` there and nowhere else; lint clean; all 31 `O` needles at their stated disposition, hits printed; the consistency note's mechanical set (checks 1 to 9, 16, and the new 17) runs with its output recorded, the three this plan moved read first (26 files, 24 `ok` lines); the dogfood's five sections recorded as the harness printed them, including the twelve-definitions count of "What the harness listed" |

**Batch internal order.** A is sequential: the `ceiling` map lands first
because the script reads it, the test lands second and is watched to fail,
the script lands third and is watched to pass. B, C, and D are each
sequential by file region — several tasks edit `SKILL.md` or `roles/kanri.md`
in turn, and a later task's passage is measured against the file as the
previous task left it; task 10 is independent of 7 to 9 and may run in either
order within C. E is sequential: 15 depends on 14 having landed (the reading
pointer count), 16 sweeps what every earlier batch landed, and 17 needs the
whole run's own boundaries to have happened.

**No planned replacement before E.** One Jisso is expected to carry A through
D. If its reading shows a compaction, decision-6dea's replacement waits for
batch E's boundary like any other, and Kanri records the wait as a ruling —
Rule 11 is why.

**Two tasks are a sweep-and-check shape**, both in batch E, called out because
their size is the data issue-7281 asks for, not because anything is wrong with
them:

- **Task 16** — its deliverable is recorded output; it modifies nothing, and
  "it changed a tracked file" is its failure condition.
- **Task 17** — the dogfood; its deliverable is recorded measurement, one new
  report under `docs/reports/`, and it runs last because what it measures is
  this plan's own run.

Both dispatches tell the reviewer to **re-run** the commands rather than read
the report, per the consistency note's check 14.

---

## How a batch is verified

Named by name and split by **who runs it**: `boundary --plan` runs every
fenced `bash` or `console` block under this heading (down to, and not
including, the "Tasks" heading that closes it) and judges each by its exit
status alone; Kanri runs the rest by hand, because a `replay-skip:` pattern
`boundary` also honours would silently remove a check from the fenced set
(the instrument's own tests, below) or because the command needs a value —
a task range, a transcript path — no fence can carry.

Every fence below, and every fence a later revision adds under this heading,
has three properties: it opens at column 0 (an indented fence is invisible to
both `boundary` and `replay`); it exits non-zero when it fails (a loop's
status is its last iteration's, so each one below carries `|| exit 1`); and it
is not matched by any of Global Constraints' seven `replay-skip:` patterns —
checked directly, not asserted: of the two fenced checks below, neither
contains `./scripts/lint.sh`, `mise x node@22`, `node --test`, `.tanto/`,
`<your own transcript path>`, `<kanri's transcript>`, or `/tmp/tanto-checks.sh`.
**The instrument's own tests are deliberately not a fence here for exactly
this reason**: a fence reading `node --test …` would be silently skipped by
the `node --test` pattern declared for the task steps' own test runs, and a
verification section that has been silently emptied of a check is worse than
one that states the check runs elsewhere.

### What `boundary --plan` runs

`git status --porcelain` is `boundary`'s own first check, empty on pass, and
is not repeated below.

**1. Every commit of this batch carries its trailer.**

```bash
git log --format=%H main..HEAD -- skills/tanto docs/notes/tanto-consistency-checks.md docs/reports | while IFS= read -r c; do git log -1 --format=%B "$c" | grep -q 'Co-Authored-By: Claude' || { printf 'missing trailer: %s\n' "$c"; exit 1; }; done && echo "every commit of this plan carries its trailer"
```

Expected: `every commit of this plan carries its trailer`. Scoped to the
three paths this plan writes; the range also catches the pre-existing hotfix
commit (`5c84d68`, Global Constraints' "`diff`'s base"), which is not a
problem — it carries a proper trailer of its own and this check does not care
which commit wrote it, only that every commit in range has one.

**2. The `ceiling` map parses and has the shape the script reads — from batch
A onward.**

```bash
node -e 'const t=require("./skills/tanto/templates/tanto.json");const c=t.ceiling;if(!c||Object.keys(t).length!==3)process.exit(1);for(const r of ["kanri","jisso"])if(!(c[r]&&c[r].batches>0&&c[r].per_batch>0))process.exit(1);if(!(c.presence_minutes>0&&c.share_threshold>0))process.exit(1);console.log("tanto.json ok",Object.keys(t).length,Object.keys(c).length)'
```

Expected: `tanto.json ok 3 4`.

**3. `SKILL.md`'s frontmatter loads through a real parser — from batch B
onward**, the one failure mode a Markdown linter cannot see.

```bash
uv run --no-project --with pyyaml python -c "import pathlib,re,yaml;d=yaml.safe_load(re.match(r'(?s)\A---\n(.*?)\n---\n', pathlib.Path('skills/tanto/SKILL.md').read_text(encoding='utf-8')).group(1));assert ': ' not in d['description'];print('frontmatter ok', len(d))"
```

Expected: `frontmatter ok 3` — three keys (`name`, `description`,
`argument-hint`), no colon-and-space inside `description`.

**`boundary --plan` is itself named in the Batches table and never fenced
here.** Neither is the spec's own "Verification" section's set of greps (the
three old-value phrase counts, the `context=` count over four files, the
`reading.js` usage line, and the five-line real-transcript run): those are
true only from specific later boundaries — two of the phrase counts are not
`0` until batch E, and a `grep | wc -l` exits 0 whatever number it prints, so
it cannot fail under `boundary` in any case. They are run instead as task 16's
`O`-needle sweep and the consistency note's checks 16 and 17 (both at batch
E), and as task 3's own smoke test (below); this section declares the
deviation rather than carrying commands that would pass at every boundary
whether or not they were true.

### What Kanri runs by hand, at every boundary

Four checks, each outside the fenced set for a stated reason.

**Lint, on every changed path, each named individually:**
`./scripts/lint.sh <path> [<path> ...]`. Expected: exit 0, none `Failed`. Not
a fence, because the paths differ per batch and a fence cannot carry a
placeholder; `replay` cannot run it either, since pre-commit needs the
repository and its hook cache.

**Every task's passages are still where the plan says**, on the pinned Node,
the range being this boundary's own tasks (batch A's is `1`, batch B's is
`4 5 6`, and so on — the Batches table names each batch's tasks):

```text
TANTO=skills/tanto && for t in <this boundary's task numbers>; do node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task "$t" || exit 1; done
```

Expected: `task <n>: verify clean` for every task that carries a `P`
passage, and `task <n>: no passages` for tasks 1 to 3 and 16 to 17 — a
result, not a failure, since 2 and 3 are whole-file `W` blocks `verify` has
nothing pre-existing to measure against and 16 and 17 write nothing. Not a
fence, for the same reason lint is not one: the range differs per batch, a
fence cannot carry a placeholder, and this is the value this plan's own text
does not fix in advance — Kanri names it from the Batches table at each
boundary, and no further commit is needed to do so, unlike an edit to the
plan file itself.

**The instrument's own tests, and the plan's own tests, on the pinned Node —
from batch A onward:**

```text
mise x node@22 -- node --version && mise x node@22 -- node --test skills/tanto/scripts/reading.test.js && mise x node@22 -- node --test skills/tanto/scripts/passage-check.test.js
```

Expected: the pinned version, then every test in both files passing, `# fail
0` in each summary. `mise x node@22` and `node --test` are both declared
`replay-skip:` patterns (Global Constraints), so this is Kanri's to run for
real rather than a fence `replay` or `boundary` would either skip silently or
report `DIFFERS` on real TAP output a prose `Expected:` cannot quote.

**The instrument on Kanri's own transcript, and on Jisso's — from batch A
onward, once task 3 has landed:**

```text
TANTO=skills/tanto && node "$TANTO/scripts/reading.js" <Kanri's own transcript path> --role kanri --presence --backstop
TANTO=skills/tanto && node "$TANTO/scripts/reading.js" <Jisso's transcript path, from the roster's Transcript column> --role jisso
```

Expected: five lines from the first (the reading, the effort, the ceiling, the
presence, and the backstop line) and two from the second (the reading and the
ceiling line, `--presence`/`--backstop` being meaningful only on Kanri's own
transcript per spec 1.4). Kanri runs both **at every boundary from A on**, not
once at the close, because the per-boundary delta is what task 17's dogfood
measures (spec 5.2, section 1): the two `context=` figures and their deltas
from the previous boundary go into the ledger's Measurements per-boundary row
(`templates/kanri.md`, from batch C on; before C, into the ledger's own
Progress text, since the row itself does not exist yet). Task 3 step 3's own
run of `reading.js` against a real transcript is a smoke test of the script —
that it runs against a real session's file at all — and is not this
measurement, which belongs to the seat being measured and is a Kanri
directive, not a task step.

**The unaccounted-line check:**

```text
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" diff --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --base <the base Global Constraints resolves and records at the plan's landing>
```

Expected: `2 paths exempt as created:` followed by `diff: clean`, or, at batch
E's boundary only, one further `unaccounted-added` block whose path is
`docs/reports/<date>-tanto-context-ceiling-dogfood.md` (task 17's report,
deliberately not `created:` — File structure). Any other line is a defect.
This is Kanri's to read, not `boundary`'s to judge: at every boundary before E
a clean `diff` is the only correct output, so the `console` fence documents a
command a human runs and reads rather than one `boundary` judges by exit
status.

---

## Tasks

`sectionEnd` in `passage-check.js` ends "How a batch is verified" at the next
non-fenced heading of the same or a shallower depth. Without this one, the
next such heading is "The T1 list, for Kanri" at the very end of the plan, and
`boundary --plan` would read every task's own fences — every `git commit
--only`, every `git ls-files --eol`, every per-task `verify` invocation — as
part of the verification list, and try to run every one of them at every
boundary. On a clean tree the commits fail harmless ("nothing to commit") and
the whole run exits 1 regardless of the batch; on a tree carrying a stray
uncommitted edit to any listed path, it would commit that edit under the
task's own message and trailer. This heading exists only to close the section
one level below it; nothing under it belongs to "How a batch is verified".

### Task 1: `templates/tanto.json` — the `ceiling` map

**Batch:** A. **Blocks:** A1.1, P1.1.

The config the instrument reads, landed before the instrument, because
`reading.js` takes its built-in defaults from this file: `templates/tanto.json`
is the skill's built-in default set, the personal
`$CLAUDE_CONFIG_DIR/tanto.json` overlays it field by field, and every ceiling,
presence window and share threshold the later batches act on comes from the
merge. Spec 2.1 is the shape; spec 7.6's first bullet is the change list.

The map is **effective** in the sense `subagents` is — the script reads it and
the roles act on its verdicts — and its two role keys are `kanri` and `jisso`
and no others, because those are the only two seats the ceiling replaces
(spec fixed input 4). Jisso's `per_batch` default is Kanri's measured figure for
want of a Jisso measurement; task 17's dogfood supplies one, and the default is
corrected from it at T2 (spec 5.2), which is why the two are written as separate
keys with the same value rather than as one shared number.

**Files:**

- Modify: `skills/tanto/templates/tanto.json` — one passage, closing the
  `subagents` map with a comma and adding the third top-level map after it.

**Interfaces:**

- Produces, for task 3: the field names `ceiling.<role>.batches`,
  `ceiling.<role>.per_batch`, `ceiling.presence_minutes` and
  `ceiling.share_threshold`, and the defaults `2`, `65000`, `60` and `150000`.
  Task 3's tests assert the ceiling line computed from exactly these values, so
  a different number here fails that task, not this one.
- markdownlint does not lint this path; biome's JSON formatter does, with
  `trailingCommas: "none"`, which the passage below obeys.
- The file is `i/lf w/lf attr/text eol=lf`, unlike every Markdown path in this
  plan.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/templates/tanto.json
```

Expected: `i/lf w/lf attr/text eol=lf`, and never `w/mixed`.

- [ ] **Step 2: The anchor and the map**

**A1.1** `skills/tanto/templates/tanto.json` — `grep -cF '"share_threshold": 150000' skills/tanto/templates/tanto.json` — before: 0, after: 1

**P1.1** `skills/tanto/templates/tanto.json` — replace exactly these 2 lines

```text
  }
}
```

**P1.1 →**

```text
  },
  "ceiling": {
    "kanri": { "batches": 2, "per_batch": 65000 },
    "jisso": { "batches": 2, "per_batch": 65000 },
    "presence_minutes": 60,
    "share_threshold": 150000
  }
}
```

The old block is the close of the `subagents` map followed by the close of the
file, and it occurs exactly once: the `sessions` map closes with `  },`, which
carries a comma and does not match.

- [ ] **Step 3: Prove the file rather than assert it**

```bash
node -e 'const t=require("./skills/tanto/templates/tanto.json");const c=t.ceiling;if(!c||Object.keys(t).length!==3)process.exit(1);for(const r of ["kanri","jisso"])if(!(c[r]&&c[r].batches>0&&c[r].per_batch>0))process.exit(1);if(!(c.presence_minutes>0&&c.share_threshold>0))process.exit(1);console.log("tanto.json ok",Object.keys(t).length,Object.keys(c).length)'
```

Expected: `tanto.json ok 3 4`. Three top-level maps, four keys under `ceiling`.
This is the same command the boundary runs, and it is run here so that a broken
JSON file is found by the task that wrote it rather than by the batch.

- [ ] **Step 4: Lint**

```bash
./scripts/lint.sh skills/tanto/templates/tanto.json
```

Expected: exit 0, none `Failed`. **This step runs before the Verify step
below, not after.** biome runs with `--write`, and a fix that rewrote a line
inside the passage would leave `passage-check verify` reading text the plan
does not contain. If it fixes anything, re-author the block it touched rather
than leaving the file and the plan disagreeing.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/templates/tanto.json -m "feat(tanto): the ceiling map in the built-in config" -m "A third top-level map beside sessions and subagents, effective as subagents is: batches and per-batch tokens for Kanri and for Jisso, the presence window, and the share threshold. Spec 2.1 and 7.6." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 6: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 7: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 1
```

Expected: `task 1: verify clean`.

**Done when:** `templates/tanto.json` carries the `ceiling` map, the node parse
prints `tanto.json ok 3 4`, `git ls-files --eol` still reports `i/lf w/lf`,
lint is clean, and the commit carries its `Co-Authored-By:` trailer.

---

### Task 2: `scripts/reading.test.js` — the thirteen cases, written first

**Batch:** A. **Blocks:** W2.1.

The tests are the specification of the figures; the prose of `SKILL.md` is what
the roles read (spec 1.8). This task writes them **before** the script exists
and watches every one of them fail, which is the point of the ordering: a test
file that passes against a missing module is a test file that tests nothing.

Thirteen cases, one `test` each, in the order spec 1.8 lists them: the four
older figures on a fixture with tool results, peer messages and one compaction;
`context=` as the sum of the three `usage` fields with one absent; `effort=`
taking `perTurnEffort` over `effort` with `null` falling through; the ceiling
line with both verdicts and a `--config` that overrides `batches` and keeps the
default `per_batch`; the presence line with `--now`, inside and outside the
window, with `last=none`, and with a `peer` record after the human's that is
not counted; the backstop line from the environment, from `--settings`, and
from neither; the share line over two fixtures with the threshold from
`--config`; the unavailable form at exit 0 and three exit-2 usage errors; a
half-written last record; `context=0`; a missing and an unparsable `--config`;
an unknown key under the `ceiling` map named on `stderr`; and `--share` over
one readable fixture and one missing path.

Every fixture is **synthetic**, written to a temporary directory the file
removes at teardown, so that no real transcript — a file that carries the
human's words — is ever committed. Every run is given a `CLAUDE_CONFIG_DIR`
pointing at an empty temporary directory, so that the host's own personal
`tanto.json` and `settings.json` can never decide a test's result; the one case
that needs an environment variable sets it per run.

The file's shape follows `scripts/passage-check.test.js`: `node:test` with an
`after` teardown over an array of temporary directories, per-entry `rmSync` in a
`try`/`catch` so that one locked directory does not stop the rest, and a
`run()` helper that shells out to the script under test. It differs in one
respect, deliberately: `run()` uses `spawnSync` and returns `out` and `err`
**separately**, where `passage-check.test.js`'s own helper concatenates them —
case 12 asserts that the unknown-key report goes to `stderr` while the ceiling
line goes to `stdout`, and a concatenating helper cannot tell those apart.

**Files:**

- Create: `skills/tanto/scripts/reading.test.js`.

**Interfaces:**

- Consumes, from task 1: the `ceiling` defaults `batches: 2`,
  `per_batch: 65000`, `presence_minutes: 60`, `share_threshold: 150000`. The
  ceiling assertions are written against a fixture baseline of `1000`, so the
  expected ceiling is `1000 + 2 x 65000 = 131000` in four cases.
- Produces, for task 3, the exact output contract the script must satisfy —
  every line spelling, every verdict word, every exit code. Task 3 writes no
  test of its own and asserts nothing this file does not already assert.
- The file is invoked as `node --test skills/tanto/scripts/reading.test.js`,
  and it spawns `process.execPath` against `reading.js` in its own directory.
- biome lints this path, formats at `lineWidth: 120`, and its `--write` is what
  produced the wrapping below; markdownlint does not see it.
- `.gitattributes` pins `*.js` to `eol=lf`, so this file is `i/lf w/lf` in both
  the index and the working tree, unlike every Markdown path in this plan.

#### Steps

- [ ] **Step 1: Write the file**

**W2.1** `skills/tanto/scripts/reading.test.js` — new file, 284 lines

````js
const test = require("node:test");
const { after } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const SCRIPT = path.join(__dirname, "reading.js");

// Every temporary directory a helper below creates, so this file's own
// fixtures leave nothing behind under the OS temp dir.
const tmpDirs = [];
function tmpDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tanto-reading-"));
  tmpDirs.push(dir);
  return dir;
}
function cleanupTmpDirs() {
  for (const dir of tmpDirs) {
    // Per-entry, so one locked directory does not stop every entry after it.
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // Best-effort teardown -- see above.
    }
  }
}
after(cleanupTmpDirs);

// A config directory with no `tanto.json` and no `settings.json`, so that
// every run below reads the defaults unless it names a file of its own. The
// host's real personal config must never decide a test's result.
const EMPTY_CONFIG_DIR = tmpDir();

/**
 * Write a synthetic transcript. `records` are objects, serialized one per
 * line, or strings, written as they are -- which is how the half-written
 * last line of the truncation case is built. The fixtures are synthetic so
 * that no real transcript, a file that carries the human's words, is ever
 * committed.
 */
function writeTranscript(records, { trailingNewline = true } = {}) {
  const file = path.join(tmpDir(), "transcript.jsonl");
  const body = records.map((r) => (typeof r === "string" ? r : JSON.stringify(r))).join("\n");
  fs.writeFileSync(file, trailingNewline ? `${body}\n` : body, "utf8");
  return file;
}

function writeJson(name, value) {
  const file = path.join(tmpDir(), name);
  fs.writeFileSync(file, typeof value === "string" ? value : JSON.stringify(value), "utf8");
  return file;
}

function run(args, extraEnv = {}) {
  const env = { ...process.env, CLAUDE_CONFIG_DIR: EMPTY_CONFIG_DIR };
  delete env.CLAUDE_CODE_AUTO_COMPACT_WINDOW;
  for (const [key, value] of Object.entries(extraEnv)) env[key] = value;
  const result = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8", env });
  return { code: result.status, out: result.stdout || "", err: result.stderr || "" };
}

function human(timestamp, text) {
  return {
    type: "user",
    timestamp,
    origin: { kind: "human" },
    message: { role: "user", content: text },
  };
}

function assistant(usage, extra = {}) {
  return { type: "assistant", message: { role: "assistant", usage }, ...extra };
}

const PHRASE = "This session is being continued from a previous conversation";

test("the four older figures count wake-ups and one compaction, and skip tool results", () => {
  const file = writeTranscript([
    human("2026-09-14T00:00:00.000Z", "start"),
    assistant({ input_tokens: 1, cache_creation_input_tokens: 2, cache_read_input_tokens: 3 }),
    {
      type: "user",
      message: { role: "user", content: [{ type: "tool_result", content: "ok" }] },
    },
    {
      type: "user",
      timestamp: "2026-09-14T00:10:00.000Z",
      origin: { kind: "peer", name: "kanri" },
      message: { role: "user", content: [{ type: "text", text: "boundary verified" }] },
    },
    {
      type: "user",
      message: {
        role: "user",
        content: [{ type: "tool_result", content: `${PHRASE} and the tool said so` }],
      },
    },
    { type: "user", message: { role: "user", content: `${PHRASE}. Below is a summary.` } },
  ]);

  const result = run([file]);
  assert.strictEqual(result.code, 0);
  const first = result.out.split("\n")[0];
  assert.match(first, /^transcript: \d+ B, 6 records, 3 wake-ups, 1 compactions, context=6$/);
});

test("context is the sum of the three usage fields of the last assistant record", () => {
  const file = writeTranscript([
    assistant({ input_tokens: 1, cache_creation_input_tokens: 1, cache_read_input_tokens: 1 }),
    assistant({ input_tokens: 10, cache_read_input_tokens: 5 }),
  ]);
  const result = run([file]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /context=15$/m);
});

test("effort takes perTurnEffort over effort, null falls through, and neither is unknown", () => {
  const both = writeTranscript([assistant({ input_tokens: 1 }, { perTurnEffort: "xhigh", effort: "high" })]);
  assert.match(run([both]).out, /^effort=xhigh$/m);

  const nulled = writeTranscript([assistant({ input_tokens: 1 }, { perTurnEffort: null, effort: "medium" })]);
  assert.match(run([nulled]).out, /^effort=medium$/m);

  const neither = writeTranscript([assistant({ input_tokens: 1 })]);
  assert.match(run([neither]).out, /^effort=unknown$/m);
});

test("the ceiling line is the measured baseline plus N batches, and --config overrides a field", () => {
  const under = writeTranscript([assistant({ input_tokens: 1000 }), assistant({ input_tokens: 2000 })]);
  const over = writeTranscript([assistant({ input_tokens: 1000 }), assistant({ input_tokens: 200000 })]);

  assert.match(
    run([under, "--role", "kanri"]).out,
    /^ceiling: kanri baseline=1000 \+ 2 x 65000 = 131000 — context=2000 under$/m,
  );
  assert.match(
    run([over, "--role", "jisso"]).out,
    /^ceiling: jisso baseline=1000 \+ 2 x 65000 = 131000 — context=200000 over$/m,
  );

  const config = writeJson("tanto.json", { ceiling: { kanri: { batches: 1 } } });
  assert.match(
    run([under, "--role", "kanri", "--config", config]).out,
    /^ceiling: kanri baseline=1000 \+ 1 x 65000 = 66000 — context=2000 under$/m,
  );
});

test("the presence line reads the last human wake-up and not a peer's", () => {
  const file = writeTranscript([
    human("2026-09-14T00:00:00.000Z", "a ruling"),
    assistant({ input_tokens: 1 }),
    {
      type: "user",
      timestamp: "2026-09-14T05:00:00.000Z",
      origin: { kind: "peer", name: "jisso" },
      message: { role: "user", content: "batch B reported" },
    },
  ]);

  assert.match(
    run([file, "--presence", "--now", "2026-09-14T00:30:00.000Z"]).out,
    /^human: last=2026-09-14T00:00:00\.000Z 30 min ago — present \(window 60 min\)$/m,
  );
  assert.match(
    run([file, "--presence", "--now", "2026-09-14T02:00:00.000Z"]).out,
    /^human: last=2026-09-14T00:00:00\.000Z 120 min ago — absent \(window 60 min\)$/m,
  );

  const noHuman = writeTranscript([
    assistant({ input_tokens: 1 }),
    { type: "user", message: { role: "user", content: "an older harness record" } },
  ]);
  assert.match(
    run([noHuman, "--presence", "--now", "2026-09-14T02:00:00.000Z"]).out,
    /^human: last=none — absent \(window 60 min\)$/m,
  );
});

test("the backstop line reads the environment, then the settings file, then the default", () => {
  const file = writeTranscript([assistant({ input_tokens: 1000 }), assistant({ input_tokens: 2000 })]);

  assert.match(
    run([file, "--role", "kanri", "--backstop"], {
      CLAUDE_CODE_AUTO_COMPACT_WINDOW: "400000",
    }).out,
    /^backstop: autoCompactWindow=400000 \(env\) — above ceiling 131000$/m,
  );

  const settings = writeJson("settings.json", { autoCompactWindow: 100000 });
  assert.match(
    run([file, "--role", "kanri", "--backstop", "--settings", settings]).out,
    /^backstop: autoCompactWindow=100000 \(settings\) — below ceiling 131000$/m,
  );

  assert.match(
    run([file, "--role", "kanri", "--backstop"]).out,
    /^backstop: autoCompactWindow=967000 \(default\) — above ceiling 131000$/m,
  );
});

test("the share line weights usage by context across transcripts, with the threshold from --config", () => {
  const one = writeTranscript([assistant({ input_tokens: 100 }), assistant({ input_tokens: 300 })]);
  const two = writeTranscript([assistant({ input_tokens: 600 })]);
  const config = writeJson("tanto.json", { ceiling: { share_threshold: 200 } });

  const result = run(["--share", one, two, "--config", config]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /^share: 90% of usage at context > 200 over 2 transcripts \(900 \/ 1000 tokens\)$/m);
});

test("a missing transcript is the unavailable form at exit 0, and a usage error is exit 2", () => {
  const missing = path.join(tmpDir(), "not-here.jsonl");
  const unavailable = run([missing]);
  assert.strictEqual(unavailable.code, 0);
  assert.match(unavailable.out, /^transcript: unavailable — .+$/m);
  assert.match(unavailable.out, /^effort=unknown$/m);
  assert.doesNotMatch(unavailable.out, /^ceiling:/m);

  const file = writeTranscript([assistant({ input_tokens: 1 })]);
  const noRole = run([file, "--backstop"]);
  assert.strictEqual(noRole.code, 2);
  assert.match(noRole.err, /Usage: reading\.js/);

  const badRole = run([file, "--role", "sekkei"]);
  assert.strictEqual(badRole.code, 2);
  assert.match(badRole.err, /invalid --role 'sekkei'/);

  const noArgs = run([]);
  assert.strictEqual(noArgs.code, 2);
});

test("a half-written last record is counted in records and nowhere else", () => {
  const file = writeTranscript(
    [human("2026-09-14T00:00:00.000Z", "start"), assistant({ input_tokens: 7 }), '{"type":"assis'],
    { trailingNewline: false },
  );
  const result = run([file]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /^transcript: \d+ B, 3 records, 1 wake-ups, 0 compactions, context=7$/m);
});

test("context is 0 when no assistant record carries a usage object", () => {
  const file = writeTranscript([
    human("2026-09-14T00:00:00.000Z", "start"),
    { type: "assistant", message: { role: "assistant", content: [] } },
  ]);
  assert.match(run([file]).out, /context=0$/m);
});

test("a missing or unparsable --config file is the all-defaults case", () => {
  const file = writeTranscript([assistant({ input_tokens: 1000 }), assistant({ input_tokens: 2000 })]);
  const expected = /^ceiling: kanri baseline=1000 \+ 2 x 65000 = 131000 — context=2000 under$/m;

  const missing = path.join(tmpDir(), "no-tanto.json");
  assert.match(run([file, "--role", "kanri", "--config", missing]).out, expected);

  const broken = writeJson("tanto.json", "{ not json at all");
  assert.match(run([file, "--role", "kanri", "--config", broken]).out, expected);
});

test("an unknown key under the ceiling map is ignored and named on stderr", () => {
  const file = writeTranscript([assistant({ input_tokens: 1000 }), assistant({ input_tokens: 2000 })]);
  const config = writeJson("tanto.json", {
    ceiling: { sekkei: { batches: 3 }, kanri: { window: 30 } },
  });

  const result = run([file, "--role", "kanri", "--config", config]);
  assert.strictEqual(result.code, 0);
  assert.match(result.err, /^unknown key ceiling\.sekkei, ignored$/m);
  assert.match(result.err, /^unknown key ceiling\.kanri\.window, ignored$/m);
  assert.match(result.out, /^ceiling: kanri baseline=1000 \+ 2 x 65000 = 131000 — context=2000 under$/m);
});

test("--share skips a path it cannot read, counts only the ones read, and names the skipped", () => {
  const readable = writeTranscript([assistant({ input_tokens: 400000 })]);
  const missing = path.join(tmpDir(), "gone.jsonl");

  const result = run(["--share", readable, missing]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /over 1 transcripts \(400000 \/ 400000 tokens\)/);
  assert.match(result.out, /\(skipped .*gone\.jsonl\)/);
});
````

- [ ] **Step 2: Run the tests and watch every one of them fail**

```bash
mise x node@22 -- node --test skills/tanto/scripts/reading.test.js; echo "exit=$?"
```

Expected: `exit=1`, with thirteen failures. Each one fails in `run()`, because
`spawnSync` cannot start a script that does not exist: `result.status` is
`null`, `result.stdout` is empty, and the first assertion of each test — an
`assert.strictEqual(result.code, 0)` or an `assert.match` against an empty
string — is what reports it. **A passing run here is the failure**: it would
mean the file asserts something that is true of nothing.

- [ ] **Step 3: Lint**

```bash
./scripts/lint.sh skills/tanto/scripts/reading.test.js
```

Expected: exit 0, none `Failed`. biome runs with `--write` at
`lineWidth: 120`; the block above is already in the shape biome produces, so
nothing should be rewritten. If anything is, re-author `W2.1` to match what is
on disk rather than leaving the file and the plan disagreeing.

- [ ] **Step 4: Stage the new file and check its line endings**

```bash
git add skills/tanto/scripts/reading.test.js && git check-attr text eol -- skills/tanto/scripts/reading.test.js && git ls-files --eol skills/tanto/scripts/reading.test.js
```

Expected: `text: set` and `eol: lf`, then `i/lf w/lf attr/text eol=lf`.
`--only` cannot pick up an untracked path, so the `git add` is what makes the
commit below possible.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/scripts/reading.test.js -m "test(tanto): the thirteen cases that specify the reading" -m "The five figures, the effort rule, the ceiling, presence, backstop and share lines, the unavailable form and the exit codes, on synthetic fixtures in a temporary directory. Written before the script, and failing until it lands. Spec 1.8." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 6: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 7: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 2
```

Expected: `task 2: no passages` — this task carries a `W` block and no `P`
block, which `verify` reports at exit 0. It is a result, not a failure: there
is no pre-existing text for a "new passage" to be measured against.

**Done when:** `skills/tanto/scripts/reading.test.js` exists with the thirteen
tests, `node --test` on it exits non-zero with thirteen failures and no other
kind of error, `git ls-files --eol` reports `i/lf w/lf`, lint is clean, and the
commit carries its `Co-Authored-By:` trailer.

---

### Task 3: `scripts/reading.js` — the instrument

**Batch:** A. **Blocks:** W3.1.

The script task 2's thirteen cases describe. Node with no dependencies, no
shebang — it is always invoked as `node <path>`, and the runtime text spells
`node "$TANTO/scripts/reading.js"`, so a reader setting `$TANTO` needs the
interpreter named rather than implied. Spec 1.1 to 1.7 is the whole
specification; the tests are its executable form, and this task adds no
behaviour they do not assert.

Four things in the file are worth naming before reading it, because each is a
decision the spec argues for and the code alone does not:

- **The baseline is measured, not configured.** `ceilingOf` takes the *first*
  `assistant` record's `usage` sum in the same transcript — the session's fixed
  load at its first turn, 72k to 83k in the 2026-09-14 measurement — so a change
  in the harness's system prompt or in the skill's own size moves every ceiling
  without anyone editing a number.
- **The defaults come from the shipped template, not from a constant.**
  `loadCeiling` reads `templates/tanto.json` relative to the script's own
  directory and overlays the personal file on it; `BUILT_IN_CEILING` is a
  last-resort copy for a tree whose template cannot be read, and the template's
  own keys are never reported as unknown, because a template this script cannot
  parse is a defect of the skill and not of the human's file.
- **Nothing exits non-zero on a verdict.** `over`, `absent` and `below` are
  words the roles read; an unreadable transcript is the `unavailable` form at
  exit 0, because that form is a value the roles send. Only a usage error —
  no transcript and no `--share`, `--backstop` without `--role`, a `--role`
  that is neither `kanri` nor `jisso`, an unknown switch — exits 2.
- **The usage line is one line.** `passage-check.js` spells its usage over one
  line and the consistency note's check 16 reads it with `head -n 1`; this
  script's two forms are therefore joined into one string rather than wrapped,
  so that a reader who runs it bare and takes the first line sees both.

**Files:**

- Create: `skills/tanto/scripts/reading.js`.

**Interfaces:**

- Consumes, from task 1: `ceiling.kanri`, `ceiling.jisso`,
  `ceiling.presence_minutes`, `ceiling.share_threshold` in
  `templates/tanto.json`, read at `path.join(__dirname, "..", "templates",
  "tanto.json")`.
- Consumes, from task 2: the output contract, verbatim. Every line spelling
  below is the one those tests match.
- Produces, for batches B to E: the five-figure first line, `effort=` on the
  second, and the `ceiling:`, `human:`, `backstop:` and `share:` lines that
  `SKILL.md`, `roles/kanri.md`, `roles/jisso.md` and the templates go on to
  name. Exported for any later test: `readTranscript`, `loadCeiling`,
  `ceilingOf`, `main`.
- biome lints and formats this path at `lineWidth: 120`; markdownlint does not
  see it. `.gitattributes` pins it to `eol=lf`.

#### Steps

- [ ] **Step 1: Write the file**

**W3.1** `skills/tanto/scripts/reading.js` — new file, 419 lines

````js
// No shebang: this file is always invoked as `node <path>`, exactly as
// `passage-check.js` is. The runtime text spells the command
// `node "$TANTO/scripts/reading.js"`, and a reader who is setting `$TANTO`
// needs the interpreter named rather than implied.

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { parseArgs } = require("node:util");

// One line, so that a reader who runs the script bare and takes the first
// line of its output sees both forms.
const USAGE =
  "Usage: reading.js <transcript> [--role kanri|jisso] [--presence] [--backstop] [--now <ISO>] [--config <path>] [--settings <path>], or reading.js --share <transcript> [<transcript>...] [--config <path>]";

// The documented auto-compact point for the 1M-window models
// (docs/notes/claude-code-sessions-observed.md, and
// code.claude.com/docs/en/model-config.md). The skill never sets it.
const DEFAULT_AUTO_COMPACT_WINDOW = 967000;

// The last-resort copy of `templates/tanto.json`'s `ceiling` map, used only
// when the shipped template cannot be read. The template is the built-in
// default; this keeps the instrument working when it is missing.
const BUILT_IN_CEILING = {
  kanri: { batches: 2, per_batch: 65000 },
  jisso: { batches: 2, per_batch: 65000 },
  presence_minutes: 60,
  share_threshold: 150000,
};

const CEILING_ROLES = ["kanri", "jisso"];
const ROLE_FIELDS = ["batches", "per_batch"];
const SCALAR_FIELDS = ["presence_minutes", "share_threshold"];

// The harness's own opening phrase for a compaction. It may change: a
// reworded one reads as `0`, and a compaction the session notices for itself
// is still the signal it always was.
const COMPACTION_PHRASE = "This session is being continued from a previous conversation";

/** JSON at `file`, or null when it is absent or does not parse. */
function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

/** The config directory the harness names, or `~/.claude`. */
function configDir() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
}

function configPathOf(explicit) {
  return explicit || path.join(configDir(), "tanto.json");
}

function settingsPathOf(explicit) {
  return explicit || path.join(configDir(), "settings.json");
}

/** A deep-enough copy of the ceiling map's two levels. */
function cloneCeiling(source) {
  return {
    kanri: { ...source.kanri },
    jisso: { ...source.jisso },
    presence_minutes: source.presence_minutes,
    share_threshold: source.share_threshold,
  };
}

/**
 * Overlay one `ceiling` map onto `target`, field by field, the way the two
 * maps that already exist are overlaid. A key that names no role and no
 * field is ignored and reported through `warn`.
 */
function overlayCeiling(target, source, warn) {
  if (!source || typeof source !== "object") return;
  for (const [key, value] of Object.entries(source)) {
    if (CEILING_ROLES.includes(key)) {
      if (!value || typeof value !== "object") {
        warn(key);
        continue;
      }
      for (const [field, fieldValue] of Object.entries(value)) {
        if (ROLE_FIELDS.includes(field)) {
          target[key][field] = fieldValue;
        } else {
          warn(`${key}.${field}`);
        }
      }
    } else if (SCALAR_FIELDS.includes(key)) {
      target[key] = value;
    } else {
      warn(key);
    }
  }
}

/**
 * The merged `ceiling` map: the built-in copy, then the shipped
 * `templates/tanto.json`, then the personal file. Returns
 * { ceiling, warnings, path } -- `warnings` the unknown keys of the personal
 * file, which the caller writes to stderr.
 */
function loadCeiling(explicitConfig) {
  const ceiling = cloneCeiling(BUILT_IN_CEILING);
  const template = readJson(path.join(__dirname, "..", "templates", "tanto.json"));
  // The shipped template is the built-in default, so its own keys are never
  // reported as unknown: a template this script cannot read is a defect of
  // the skill, not of the human's file.
  overlayCeiling(ceiling, template?.ceiling, () => {});

  const configFile = configPathOf(explicitConfig);
  const personal = readJson(configFile);
  const warnings = [];
  overlayCeiling(ceiling, personal?.ceiling, (name) => {
    warnings.push(`unknown key ceiling.${name}, ignored`);
  });
  return { ceiling, warnings, path: configFile };
}

/** A usage field as a number, or 0 when it is absent or not one. */
function tokens(value) {
  return typeof value === "number" ? value : 0;
}

/**
 * One `assistant` record's whole prompt in tokens, cached part included, or
 * null when the record carries no `usage` object.
 */
function contextOf(record) {
  const usage = record.message?.usage;
  if (!usage || typeof usage !== "object") return null;
  return tokens(usage.input_tokens) + tokens(usage.cache_creation_input_tokens) + tokens(usage.cache_read_input_tokens);
}

/** Every line of a transcript, with a trailing empty line dropped. */
function recordLines(raw) {
  const lines = raw.split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

/** A record of `type` `user` that carries no `tool_result` block. */
function isWakeUp(record) {
  if (record.type !== "user") return false;
  const content = record.message?.content;
  if (Array.isArray(content) && content.some((block) => block && block.type === "tool_result")) {
    return false;
  }
  return true;
}

/** A wake-up's text: the string content, or the first `text` block's text. */
function wakeUpText(record) {
  const content = record.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    const block = content.find((b) => b && typeof b.text === "string");
    if (block) return block.text;
  }
  return "";
}

/**
 * The five figures, the effort, the baseline, and the last human turn, from
 * one transcript. Throws when the file cannot be read, which the caller
 * reports as the `unavailable` form.
 */
function readTranscript(file) {
  const raw = fs.readFileSync(file, "utf8");
  const bytes = fs.statSync(file).size;
  const lines = recordLines(raw);

  let wakeUps = 0;
  let compactions = 0;
  let context = 0;
  let baseline = 0;
  let baselineSeen = false;
  let effort = "unknown";
  let lastHuman = null;

  for (const line of lines) {
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      // A line that does not parse is counted in records and nowhere else,
      // so a truncated last line while the harness is mid-write does not
      // fail the reading.
      continue;
    }
    if (!record || typeof record !== "object") continue;

    if (isWakeUp(record)) {
      wakeUps++;
      if (wakeUpText(record).startsWith(COMPACTION_PHRASE)) compactions++;
      if (record.origin && record.origin.kind === "human" && record.timestamp) {
        lastHuman = record.timestamp;
      }
      continue;
    }

    if (record.type === "assistant") {
      effort =
        typeof record.perTurnEffort === "string"
          ? record.perTurnEffort
          : typeof record.effort === "string"
            ? record.effort
            : "unknown";
      const turn = contextOf(record);
      if (turn !== null) {
        context = turn;
        if (!baselineSeen) {
          baseline = turn;
          baselineSeen = true;
        }
      }
    }
  }

  return {
    bytes,
    records: lines.length,
    wakeUps,
    compactions,
    context,
    baseline,
    effort,
    lastHuman,
  };
}

/** An error message flattened to the one line the reading carries. */
function oneLine(message) {
  return String(message).replace(/\s+/g, " ").trim();
}

function printWarnings(warnings) {
  for (const warning of warnings) {
    process.stderr.write(`${warning}\n`);
  }
}

/** `<role>`'s ceiling: the measured baseline plus N batches of consumption. */
function ceilingOf(ceiling, role, baseline) {
  const batches = ceiling[role].batches;
  const perBatch = ceiling[role].per_batch;
  return { batches, perBatch, value: baseline + batches * perBatch };
}

function runReading(file, values) {
  let reading;
  try {
    reading = readTranscript(file);
  } catch (err) {
    // The unavailable form is a value the roles send, not a failure.
    console.log(`transcript: unavailable — ${oneLine(err.message)}`);
    console.log("effort=unknown");
    return 0;
  }

  console.log(
    `transcript: ${reading.bytes} B, ${reading.records} records, ` +
      `${reading.wakeUps} wake-ups, ${reading.compactions} compactions, ` +
      `context=${reading.context}`,
  );
  console.log(`effort=${reading.effort}`);

  const { ceiling, warnings } = loadCeiling(values.config);
  printWarnings(warnings);

  let ceilingValue = null;
  if (values.role) {
    const derived = ceilingOf(ceiling, values.role, reading.baseline);
    ceilingValue = derived.value;
    const verdict = reading.context >= derived.value ? "over" : "under";
    console.log(
      `ceiling: ${values.role} baseline=${reading.baseline} + ${derived.batches} x ` +
        `${derived.perBatch} = ${derived.value} — context=${reading.context} ${verdict}`,
    );
  }

  if (values.presence) {
    const windowMinutes = ceiling.presence_minutes;
    if (reading.lastHuman === null) {
      console.log(`human: last=none — absent (window ${windowMinutes} min)`);
    } else {
      const now = values.now ? new Date(values.now) : new Date();
      const minutes = Math.floor((now.getTime() - new Date(reading.lastHuman).getTime()) / 60000);
      const verdict = minutes <= windowMinutes ? "present" : "absent";
      console.log(
        `human: last=${reading.lastHuman} ${minutes} min ago — ${verdict} ` + `(window ${windowMinutes} min)`,
      );
    }
  }

  if (values.backstop) {
    const fromEnv = process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW;
    let window;
    let source;
    if (fromEnv !== undefined && fromEnv !== "") {
      window = Number(fromEnv);
      source = "env";
    } else {
      const settings = readJson(settingsPathOf(values.settings));
      if (settings && typeof settings.autoCompactWindow === "number") {
        window = settings.autoCompactWindow;
        source = "settings";
      } else {
        window = DEFAULT_AUTO_COMPACT_WINDOW;
        source = "default";
      }
    }
    const verdict = window > ceilingValue ? "above" : "below";
    console.log(`backstop: autoCompactWindow=${window} (${source}) — ${verdict} ceiling ${ceilingValue}`);
  }

  return 0;
}

function runShare(paths, values) {
  if (paths.length === 0) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  const { ceiling, warnings } = loadCeiling(values.config);
  printWarnings(warnings);
  const threshold = ceiling.share_threshold;

  let total = 0;
  let over = 0;
  let read = 0;
  const skipped = [];

  for (const file of paths) {
    let raw;
    try {
      raw = fs.readFileSync(file, "utf8");
    } catch {
      skipped.push(file);
      continue;
    }
    read++;
    for (const line of recordLines(raw)) {
      let record;
      try {
        record = JSON.parse(line);
      } catch {
        continue;
      }
      if (!record || record.type !== "assistant") continue;
      const turn = contextOf(record);
      if (turn === null) continue;
      total += turn;
      if (turn > threshold) over += turn;
    }
  }

  const pct = total === 0 ? 0 : Math.round((over / total) * 100);
  let line =
    `share: ${pct}% of usage at context > ${threshold} over ${read} transcripts ` + `(${over} / ${total} tokens)`;
  if (skipped.length > 0) line += ` (skipped ${skipped.join(", ")})`;
  console.log(line);
  return 0;
}

/** Dispatch. Returns the process exit code. */
function main(argv) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        role: { type: "string" },
        presence: { type: "boolean" },
        backstop: { type: "boolean" },
        share: { type: "boolean" },
        now: { type: "string" },
        config: { type: "string" },
        settings: { type: "string" },
      },
    });
  } catch (err) {
    process.stderr.write(`${err.message}\n${USAGE}\n`);
    return 2;
  }

  const values = parsed.values;
  if (values.role !== undefined && !CEILING_ROLES.includes(values.role)) {
    process.stderr.write(`invalid --role '${values.role}'\n${USAGE}\n`);
    return 2;
  }
  if (values.share) {
    return runShare(parsed.positionals, values);
  }
  if (parsed.positionals.length !== 1) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  if (values.backstop && values.role === undefined) {
    process.stderr.write(`--backstop needs --role\n${USAGE}\n`);
    return 2;
  }
  return runReading(parsed.positionals[0], values);
}

module.exports = {
  readTranscript,
  loadCeiling,
  ceilingOf,
  main,
};

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}
````

- [ ] **Step 2: Run the tests and watch all thirteen pass**

```bash
mise x node@22 -- node --version && mise x node@22 -- node --test skills/tanto/scripts/reading.test.js
```

Expected: a `v22.` version line, then `pass 13` and `fail 0`. The version is
part of the result: the machine's own `node` is newer, so a claim about the
pinned floor is a run and not an assertion.

- [ ] **Step 3: Run the instrument on a real transcript**

```bash
T="<your own transcript path>" && TANTO=skills/tanto && node "$TANTO/scripts/reading.js" "$T" --role kanri --presence --backstop
```

Expected: five lines, in this order — `transcript: … context=<n>`,
`effort=<level>`, `ceiling: kanri baseline=<b0> + 2 x 65000 = <c> — context=<n>
<under|over>`, `human: last=… — <present|absent> (window 60 min)`, and
`backstop: autoCompactWindow=967000 (default) — <above|below> ceiling <c>`.
Record the five lines in the batch report's Verification section: this is a
**smoke test** — that the script runs at all against a real session's file on
this host, where a synthetic fixture cannot show that the `usage` object is
where it expects it — and nothing more. It is not task 17's own measurement:
the transcript named here is this `task.implement` dispatch's own, which is
neither Kanri's nor Jisso's, and the dogfood's baselines come from "How a
batch is verified"'s own instrument runs, on Kanri's and Jisso's transcripts,
at every boundary from this batch on.

- [ ] **Step 4: Lint**

```bash
./scripts/lint.sh skills/tanto/scripts/reading.js
```

Expected: exit 0, none `Failed`. As in task 2, a biome `--write` that rewrites
a line inside `W3.1` means the block must be re-authored, not left disagreeing.

- [ ] **Step 5: Stage the new file and check its line endings**

```bash
git add skills/tanto/scripts/reading.js && git check-attr text eol -- skills/tanto/scripts/reading.js && git ls-files --eol skills/tanto/scripts/reading.js
```

Expected: `text: set` and `eol: lf`, then `i/lf w/lf attr/text eol=lf`.

- [ ] **Step 6: Commit**

```bash
git commit --only skills/tanto/scripts/reading.js -m "feat(tanto): reading.js, the five-figure reading and the derived ceiling" -m "The four existing figures parsed rather than grepped, plus context= summed from the last assistant record's usage object; on request the ceiling line from a measured baseline, the presence line from the last human wake-up, the backstop line from the environment or the settings file, and a --share form over several transcripts. Node, no dependencies. Spec 1.1 to 1.7." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 7: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 8: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 3
```

Expected: `task 3: no passages`, for the same reason task 2 reports it.

**Done when:** `node --test skills/tanto/scripts/reading.test.js` passes all
thirteen on the pinned Node, the five-line run against a real transcript is
recorded, `git ls-files --eol` reports `i/lf w/lf`, lint is clean, and the
commit carries its `Co-Authored-By:` trailer.

---

### Task 4: `SKILL.md` — the reading becomes five figures and one command

**Batch:** B. **Blocks:** O4.1, O4.2, O4.3, O4.4, O4.5, P4.1, P4.2, P4.3, P4.4, P4.5.

The contract's "The transcript reading" section, which every role points at and
none restates. Five passages, in file order: the sentence that says how many
figures there are; the locating paragraph and the shell pipeline, which becomes
one call to the script task 3 landed; the four bullets, which become five plus
the effort rule; the paragraph on how the reading travels and what may be
compared with what; and the `unavailable` paragraph. Spec 7.1's first bullet is
the change list, and spec 1.2 defines the fifth figure.

The one judgment in this task is the correction at the end of P4.4. Today's
sentence — "the figures are compared with each other across sessions, never
with a token count" — was right about bytes and records and is now wrong about
the reading as a whole: `context=` **is** a token count, it is the harness's own
`usage` accounting for the turn, and it is the only figure of the five that a
rule acts on. The passage keeps the old caution where it belongs and drops it
where it no longer holds.

**Files:**

- Modify: `skills/tanto/SKILL.md` — five passages inside "The transcript
  reading", and no byte outside it. Tasks 5, 11 and 13 edit this same file in
  other sections and touch none of these lines.

**Interfaces:**

- Consumes, from task 3: the two always-printed lines and the three optional
  ones, and the `unavailable` form at exit 0.
- Produces, for batches C, D and E: the spelling `context=`, which the roster's
  Context column, the ledger's Measurements rows and the consistency note's new
  check 17 all sweep for; the phrase "The transcript reading", which every role
  file cites by name; and the sentence that the ceiling is what `context=` is
  compared with, which `roles/kanri.md` and `roles/jisso.md` then act on.
- markdownlint **does** run on `skills/tanto/SKILL.md` — the ignore list covers
  `docs/superpowers/**` and `skills/tanto/templates/**`, not this file — so the
  lint step is a real markdownlint run with `--fix`.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/SKILL.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`. Read the file as
UTF-8 and normalize CRLF to LF before comparing anything: a block written LF
against a file checked out CRLF never matches, and the failure looks like a
missing passage.

- [ ] **Step 2: The old values this task contradicts**

Each needle was run against the tree as it was written, and the count stated is
the count the command returned.

**O4.1** `The **reading** is four` — `skills/tanto/SKILL.md` 1 → 0 at P4.1. The sentence wraps across two lines in the file, so no single-line grep sees it whole; this is its first line's tail, which is the half that changes.

**O4.2** `four figures` — `skills/tanto/SKILL.md` 1 (the Effort bullet), `skills/tanto/templates/roster.md` 1 → 0 at P4.3 and at P6.3 in task 6. One needle, two files, two tasks; a hit left in either after batch B is a site this plan forgot.

**O4.3** `b=$(wc -c < "$T"); r=$(wc -l < "$T")` — `skills/tanto/SKILL.md` 1 → 0 at P4.2. The first line of the shell pipeline the script replaces. The four-figure pipeline is not kept as a fallback: two instruments that can disagree are worse than one that says it could not read (spec 1.7).

**O4.4** `never with a token count` — `skills/tanto/SKILL.md` 1 → 0 at P4.4.

**O4.5** `The test is a substring of the line, so` — `skills/tanto/SKILL.md` 1 → 0 at P4.3. The wake-up count's old caveat, true of a grep over the raw line and false of a parsed record.

- [ ] **Step 3: How many figures the reading is**

**P4.1** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```text
Every session can measure its own context from its transcript, the file the
harness appends to on disk as the session runs. The **reading** is four
figures from that file, taken by the session itself, and it is the only cost
signal the skill uses. The `tokens left` figure the harness prints is not one:
its unit is not documented as the context window.
```

**P4.1 →**

```text
Every session can measure its own context from its transcript, the file the
harness appends to on disk as the session runs. The **reading** is five
figures from that file, taken by the session itself, and it is the only cost
signal the skill uses. The `tokens left` figure the harness prints is not one:
its unit is not documented as the context window (issue-40ed). The fifth
figure below is a token count, and a documented one: it is the harness's own
`usage` accounting for the turn it just billed.
```

- [ ] **Step 4: One command in place of the pipeline**

**P4.2** `skills/tanto/SKILL.md` — replace exactly these 13 lines

````text
Locate the file from the scratchpad path the system prompt names,
`<...>/<project slug>/<session id>/scratchpad`: the transcript is
`<config dir>/projects/<project slug>/<session id>.jsonl`, where the config
directory is `$CLAUDE_CONFIG_DIR` when set and `~/.claude` otherwise. Then, in
a POSIX shell with `T` the transcript path:

```bash
b=$(wc -c < "$T"); r=$(wc -l < "$T")
w=$(grep '"type":"user"' "$T" | grep -vc '"tool_result"')
c=$(grep '"type":"user"' "$T" | grep -v '"tool_result"' | grep -Ec '"(content|text)":"This session is being continued from a previous conversation')
echo "transcript: $b B, $r records, $w wake-ups, $c compactions"
e=$(grep '"type":"assistant"' "$T" | tail -n 1 | grep -oE '"(perTurnEffort|effort)":"[a-z]+"' | sort -r | head -n 1 | cut -d'"' -f4); echo "effort=${e:-unknown}"
```
````

**P4.2 →**

````text
Locate the file from the scratchpad path the system prompt names,
`<...>/<project slug>/<session id>/scratchpad`: the transcript is
`<config dir>/projects/<project slug>/<session id>.jsonl`, where the config
directory is `$CLAUDE_CONFIG_DIR` when set and `~/.claude` otherwise. Then,
with `T` the transcript path and `$TANTO` the skill's own directory, **both
set in the same tool call as the command**:

```bash
node "$TANTO/scripts/reading.js" "$T"
```

That prints two lines always: the reading, then the effort. Three more are
printed only when asked for, and the sections that ask name the switch:
`--role kanri|jisso` prints the ceiling line, `--presence` the human line, and
`--backstop` the auto-compact line, which needs `--role` because its verdict is
against the ceiling. A second form,
`node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]`,
prints the share of usage spent at a large context across several transcripts,
and Kanri runs it once, at the plan close. Three further switches — `--now`,
`--config`, `--settings` — fix the clock, the personal config and the settings
file; they exist for the tests and for a Kanri verifying a peer's reading, and
no role file passes them.
````

- [ ] **Step 5: The five figures and the effort**

**P4.3** `skills/tanto/SKILL.md` — replace exactly these 21 lines

```text
- **Bytes** and **records** are the file's size and its line count, one JSON
  record per line.
- **Wake-ups** are the records of `type: user` that carry no tool result: one
  per human message, peer message, or idle notice, each the start of a turn
  that re-reads the whole context. The test is a substring of the line, so
  the count may be off by one.
- **Compactions** are the wake-ups whose text begins with the harness's
  phrase. The check is on the record type and the text's first characters; a
  plain grep for the phrase over-counts, because the phrase also appears in
  tool output and in this file. The phrase is the harness's and may change: a
  reworded one reads as `0`, and a compaction the session notices for itself
  is still the signal it always was.
- **Effort** is not one of the four figures. It is the last `assistant`
  record's `perTurnEffort`, or its `effort` when `perTurnEffort` is absent or
  is not a quoted string: the pattern matches only a quoted value, so a
  `perTurnEffort` of `null` falls through to `effort`, and the `sort -r`
  puts `perTurnEffort` first when the record carries both as strings — and
  `unknown` when the transcript is unavailable or has neither in a readable
  form. The start
  sequence's check and the handshake's `effort=` take it; the reading itself
  travels without it.
```

**P4.3 →**

```text
- **Bytes** and **records** are the file's size and its line count, one JSON
  record per line. A line that does not parse as JSON is counted in records
  and nowhere else, so a truncated last line written while the harness is
  mid-write does not fail the reading.
- **Wake-ups** are the records of `type: user` whose `message.content` is not
  an array carrying a `tool_result` block: one per human message, peer
  message, idle notice, or subagent completion, each the start of a turn that
  re-reads the whole context.
- **Compactions** are the wake-ups whose text begins with the harness's
  phrase — `message.content` when it is a string, the first `text` block's
  text when it is an array. The script parses the record instead of grepping
  the file, because the phrase also appears in tool output and in this file.
  The phrase is the harness's and may change: a reworded one reads as `0`, and
  a compaction the session notices for itself is still the signal it always
  was.
- **Context** is the last `assistant` record's `message.usage`, summing
  `input_tokens`, `cache_creation_input_tokens` and
  `cache_read_input_tokens`, each taken as `0` when absent, and `0` when no
  `assistant` record carries a `usage` object. It is that turn's whole prompt
  in tokens, the cached part included — what the harness billed for that
  wake-up — and it is the one figure of the five that is a token count.
- **Effort** is not one of the five figures. It is the last `assistant`
  record's `perTurnEffort` when that is a string, else its `effort` when that
  is a string, else `unknown` — so a `perTurnEffort` of `null` falls through
  to `effort`, and an unavailable transcript reads as `unknown`. The start
  sequence's check and the handshake's `effort=` take it; the reading itself
  travels without it.
```

- [ ] **Step 6: How the reading travels, and what may be compared with what**

**P4.4** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```text
The line the command prints is the reading, and it travels as it is: appended
after ` — ` to the boundary and exit lines the roles already send, and written
into the batch and Kaiseki reports where their templates have a slot. A
compaction does not shrink the file, and a tool result is stored at full size,
so bytes overstate what the context holds; the figures are compared with each
other across sessions, never with a token count.
```

**P4.4 →**

```text
The first line the command prints is the reading, and it travels as it is:
appended after ` — ` to the boundary and exit lines the roles already send,
and written into the batch and Kaiseki reports where their templates have a
slot. A compaction does not shrink the file, and a tool result is stored at
full size, so bytes overstate what the context holds: bytes and records are
compared with each other across sessions and with no token count. `context=`
is the exception, and it is why it was added — it is a token count, it is
compared with the ceiling `roles/kanri.md` and `roles/jisso.md` derive from
`tanto.json`'s `ceiling` map, and it is the one figure in this reading that a
rule acts on.
```

- [ ] **Step 7: The unavailable form**

**P4.5** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```text
A session whose transcript is not where this says — another host, a config
directory the environment does not name, a read the session is not permitted
— sends `transcript: unavailable — <one line why>` in its place.
```

**P4.5 →**

```text
A session whose transcript is not where this says — another host, a config
directory the environment does not name, a read the session is not permitted
— sends `transcript: unavailable — <one line why>` in its place, which is what
the script itself prints, at exit 0, followed by `effort=unknown` and no
further line. That form is a value the roles send, not a failure, and a
session on which `node` will not run sends it with that as the reason. A
missing ceiling line is no signal — it is read as `under`, and `unavailable`
goes where the verdict would; a missing presence line reads as `absent`, which
is the conservative side. There is no four-figure fallback.
```

- [ ] **Step 8: Lint**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
```

Expected: exit 0, none `Failed`. **This step runs before the Verify step below,
not after.** markdownlint runs with `--fix`, and a fix that rewrote a line
inside a passage would leave `passage-check verify` reading text the plan does
not contain. If it fixes anything, re-author the block it touched rather than
leaving the file and the plan disagreeing.

- [ ] **Step 9: Commit**

```bash
git commit --only skills/tanto/SKILL.md -m "docs(tanto): the reading becomes five figures and one command" -m "The shell pipeline becomes one call to scripts/reading.js; the fifth figure, context=, is the last assistant record's usage sum; the bullets say what each figure is now that the script parses the records; and the comparison rule is corrected, since context= is a token count and is compared with the ceiling. Spec 1.1, 1.2, 1.7 and 7.1." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 10: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 11: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 4
```

Expected: `task 4: verify clean`.

**Done when:** the five passages are present in `skills/tanto/SKILL.md`, the
needles of O4.1, O4.3, O4.4 and O4.5 return `0` in that file and O4.2 returns
its one remaining hit in `templates/roster.md`, `git ls-files --eol` still
reports `i/lf w/crlf`, lint is clean, and the commit carries its
`Co-Authored-By:` trailer.

---

### Task 5: `SKILL.md` — the `ceiling` map and the second executable

**Batch:** B. **Blocks:** A5.1, O5.1, O5.2, O5.3, P5.1, P5.2, P5.3.

Two sections, three passages. "The expected-model config" gains the third map —
its shape, its two role keys, its two scalars, and the sentence that says whose
choice 150000 is — and its overlay paragraph gains the `ceiling` granularity and
the `unknown key ceiling.<name>, ignored` report. "Artifacts" stops saying the
skill ships one executable. Spec 2.1 and 2.2, and spec 7.1's second and fourth
bullets.

**No role file changes for the config report**, and that is deliberate: the
start line's "which file I read and which keys came from the defaults" is the
start sequence's own rule in `SKILL.md`, restated by no role file, so the
`ceiling` map's fields join that report on the same terms everywhere at once
(spec 2.2). The one role-file addition the config drives — Kanri quoting the
backstop line in its start line — is task 7's, in batch C, because it is part of
the ceiling rule and not part of the config.

Task 4 edits the same file and owns "The transcript reading" whole. This task
touches none of those lines, and tasks 11 and 13 touch neither of ours.

**Files:**

- Modify: `skills/tanto/SKILL.md` — three passages: the opening and the bullets
  of "The expected-model config", the tail of its overlay paragraph, and the
  executables paragraph of "Artifacts".

**Interfaces:**

- Consumes, from task 1: the field names and defaults, which this section
  describes in prose and must not contradict.
- Consumes, from task 3: the `unknown key ceiling.<name>, ignored` wording,
  which the script writes on `stderr` and this section quotes.
- Produces, for batches C and D: the vocabulary the role files use —
  `ceiling.kanri.batches`, `ceiling.kanri.per_batch`,
  `ceiling.presence_minutes`, `ceiling.share_threshold` — and the sentence that
  the ceiling replaces Kanri and Jisso only, which is why the Replace table
  gains one row and not six.
- markdownlint runs on this file.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/SKILL.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O5.1** `ships one executable` — `skills/tanto/SKILL.md` 1 → 0 at P5.3.

**O5.2** `Two maps, two mechanisms` — `skills/tanto/SKILL.md` 1 → 0 at P5.1. Every sentence that enumerates `sessions` and `subagents` as the whole file is this one; the Artifacts table's `tanto.json` row says only "the personal expected-model config" and stays as it is.

**O5.3** `every key is a default. A key that names no role` — `skills/tanto/SKILL.md` 1 → 0 at P5.2. The unknown-key sentence, which now has a third kind of key to name. The needle carries the five words before the sentence on purpose: `scripts/reading.js`'s own doc comment for `overlayCeiling` opens with the same clause, and a needle that matched it would survive this plan at a site the plan is right to leave alone.

- [ ] **Step 3: The anchor and the third map**

**A5.1** `skills/tanto/SKILL.md` — `grep -cF 'Three maps, three mechanisms' skills/tanto/SKILL.md` — before: 0, after: 1

**P5.1** `skills/tanto/SKILL.md` — replace exactly these 21 lines

```text
`$CLAUDE_CONFIG_DIR/tanto.json`, or `~/.claude/tanto.json` when that variable
is unset. Two maps, two mechanisms. Every value is
`{ "model": <family>, "effort": <level> }`, or a bare string, which means that
model with the effort from the defaults.

- `sessions.<role>` is **advisory**. The checks above and Kanri's handshake
  check compare against it, read at the moment of each comparison — the
  file's presence as much as its content, since a personal override can be
  created, edited, or deleted at any time, and "it existed when I last
  checked" is never evidence that it exists now. Nothing switches a
  session's model or its effort.
- `subagents.<kind>` is **effective**. Its `model` goes into the `model`
  parameter of every subagent that role dispatches, and its `effort` into the
  agent definition below. The twelve kinds are `task.implement`,
  `task.escalate`, `task.review-spec`, `task.review-quality`, `plan.draft`,
  `plan.review`, `plan.coldread`, `spec.review`, `branch.review`,
  `brief.write`, `shoroku`, and `default`.
- A key inside `subagents` whose name is a **skill name** means "run that skill
  in a subagent on that model instead of inline". When the key is absent, the
  skill runs inline on the session's model. `shoroku` is the one built-in
  skill-name key; any other is a personal addition.
```

**P5.1 →**

```text
`$CLAUDE_CONFIG_DIR/tanto.json`, or `~/.claude/tanto.json` when that variable
is unset. Three maps, three mechanisms. Every value of the first two is
`{ "model": <family>, "effort": <level> }`, or a bare string, which means that
model with the effort from the defaults.

- `sessions.<role>` is **advisory**. The checks above and Kanri's handshake
  check compare against it, read at the moment of each comparison — the
  file's presence as much as its content, since a personal override can be
  created, edited, or deleted at any time, and "it existed when I last
  checked" is never evidence that it exists now. Nothing switches a
  session's model or its effort.
- `subagents.<kind>` is **effective**. Its `model` goes into the `model`
  parameter of every subagent that role dispatches, and its `effort` into the
  agent definition below. The twelve kinds are `task.implement`,
  `task.escalate`, `task.review-spec`, `task.review-quality`, `plan.draft`,
  `plan.review`, `plan.coldread`, `spec.review`, `branch.review`,
  `brief.write`, `shoroku`, and `default`.
- A key inside `subagents` whose name is a **skill name** means "run that skill
  in a subagent on that model instead of inline". When the key is absent, the
  skill runs inline on the session's model. `shoroku` is the one built-in
  skill-name key; any other is a personal addition.
- `ceiling` is **effective** in the sense `subagents` is: `scripts/reading.js`
  reads it, and the verdicts `roles/kanri.md` and `roles/jisso.md` act on come
  out of it. `ceiling.kanri` and `ceiling.jisso` are each
  `{ "batches": <N>, "per_batch": <tokens> }` — how many batches of measured
  consumption that seat may grow by above its own measured baseline, and what
  one batch costs it. `ceiling.presence_minutes` is the window inside which
  the human's last turn in Kanri's own transcript still counts as present, and
  `ceiling.share_threshold` the context above which a wake-up's usage counts
  toward the share Kanri reports at the plan close. A `ceiling.<role>` for any
  role but those two is an unknown key: Kanri and Jisso are the only seats the
  ceiling replaces, because they are the two that run a whole plan of batches,
  and every other role measures and sends the five figures and is replaced on
  none of them.

The ceilings and the threshold are the **human's operating choice**, not a
documented quality limit. No Anthropic document names 150000 tokens as a point
at which a model's recall falls off; the closest describes recall degrading
with context as a gradient rather than a cliff. 150000 is where the human's own
account view buckets usage, and what the run is choosing to spend per wake-up.
Reducing consumption lowers the ceiling at the same `batches`, which is the
point of deriving it: a shorter role file or a quieter boundary pays off in
this instrument without anyone moving a threshold.
```

- [ ] **Step 4: The overlay, and the unknown key under the map**

**P5.2** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```text
is the case where every key is a default. A key that names no role and no
kind — an older file's, for instance — is reported in your start line as
`unknown key <name>, ignored` and otherwise ignored.
```

**P5.2 →**

```text
is the case where every key is a default. The `ceiling` map overlays the same
way and at the same granularity: a personal
`{"ceiling": {"kanri": {"batches": 1}}}` sets Kanri's batch count to 1 and
leaves every other value of all three maps alone. A key that names no role, no
kind and no ceiling field — an older file's, for instance — is reported in
your start line as `unknown key <name>, ignored`, or as
`unknown key ceiling.<name>, ignored` for one under that map, which
`scripts/reading.js` writes on `stderr` every time it reads the file; either
way it is otherwise ignored.
```

- [ ] **Step 5: Two executables**

**P5.3** `skills/tanto/SKILL.md` — replace exactly these 15 lines

```text
The skill also ships one executable, `scripts/passage-check.js`: the instrument
a plan that carries passages checks itself with, run by Keikaku in place of an
agent dry run, by Jisso at every batch boundary, by Kanri at every boundary it
rules on, and by the whole-branch reviewer. Its seven subcommands are `lint`,
`replay`, `diff`, `verify`, `sections`, `frame`, and `boundary`. It is Node
with no dependencies, its tests are beside it and run by `node --test`, and
`roles/keikaku.md`, `roles/jisso.md`, and `roles/kanri.md` name its
subcommands. Its path is written skill-relative, like every other path in
this skill, and the role files spell the runnable form `$TANTO`: set it to the
skill's own directory, which the harness names when it invokes the skill,
**in the same tool call as the command** — shell state does not persist
between calls, and an unset `$TANTO` makes every one of these commands read a
path at the filesystem root. It is never invoked bare —
the file carries no shebang, so `node` is part of the command and not
decoration.
```

**P5.3 →**

```text
The skill also ships two executables. `scripts/passage-check.js` is the
instrument a plan that carries passages checks itself with, run by Keikaku in
place of an agent dry run, by Jisso at every batch boundary, by Kanri at every
boundary it rules on, and by the whole-branch reviewer; its seven subcommands
are `lint`, `replay`, `diff`, `verify`, `sections`, `frame`, and `boundary`,
and `roles/keikaku.md`, `roles/jisso.md` and `roles/kanri.md` name them.
`scripts/reading.js` is the instrument every role measures itself with, run at
every boundary and every exit; its two forms are the reading of one transcript
— with `--role kanri|jisso`, `--presence` and `--backstop` each adding a line,
and `--now`, `--config` and `--settings` fixing what the tests and a verifying
Kanri need fixed — and `--share` over several transcripts, which Kanri runs at
the plan close. Both are Node with no dependencies, and both have their tests
beside them, run by `node --test`. Their paths are written skill-relative,
like every other path in
this skill, and the role files spell the runnable form `$TANTO`: set it to the
skill's own directory, which the harness names when it invokes the skill,
**in the same tool call as the command** — shell state does not persist
between calls, and an unset `$TANTO` makes every one of these commands read a
path at the filesystem root. Neither is ever invoked bare —
neither file carries a shebang, so `node` is part of the command and not
decoration.
```

- [ ] **Step 6: Lint**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
```

Expected: exit 0, none `Failed`. This step runs before the Verify step below,
for the reason task 4's lint step states.

- [ ] **Step 7: Commit**

```bash
git commit --only skills/tanto/SKILL.md -m "docs(tanto): the ceiling map in the config, and a second executable" -m "tanto.json's third top-level map described where the other two are, with its overlay granularity, its unknown-key report, and the sentence saying that 150000 is the human's operating choice and not a documented quality limit; Artifacts stops saying the skill ships one executable. Spec 2.1, 2.2 and 7.1." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 8: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 9: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 5
```

Expected: `task 5: verify clean`.

**Done when:** the three passages are present, `grep -cF 'Three maps, three mechanisms' skills/tanto/SKILL.md`
prints `1`, the needles of O5.1, O5.2 and O5.3 return `0`, lint is clean, and
the commit carries its `Co-Authored-By:` trailer.

---

### Task 6: the templates' reading slots and columns

**Batch:** B. **Blocks:** A6.1, O6.1, O6.2, O6.3, P6.1, P6.2, P6.3, P6.4, P6.5, P6.6.

Four templates, six passages, and no rule: this task moves the slots and the
columns that hold the fifth figure, so that by batch B's boundary every place a
reading lands can carry it. `templates/batch-report.md` gains the Ceiling slot
under Transcript; `templates/roster.md` and `templates/roster-archive.md` gain a
Context column after Compactions, and the paragraph under each names the figure
by the spelling the reading itself prints; `templates/kanri-handover.md`'s
Residency table, which is the roster's row copied verbatim, gains the same
column. Spec 7.6, except the deferred clause and the batch-prompt notice, which
belong to the rule and land in task 10.

Two judgments here beyond the spec's list. First, `templates/roster.md`'s
Residency paragraph carries the sentence that a threshold for replacing a peer
"will be read from" the archive; with this plan that threshold exists for Kanri
and Jisso and comes from `tanto.json`, so the sentence is rewritten rather than
left to contradict the rule batch C lands. Second, Kikaku sends no reading and
gains no site (spec 3.4), which was true before and was written nowhere — the
paragraph now says so, because a blank pair of columns with no explanation reads
as a Kanri that forgot to fill them.

**Files:**

- Modify: `skills/tanto/templates/batch-report.md` — one insertion in the
  header.
- Modify: `skills/tanto/templates/roster.md` — the Residency table and the
  paragraph under it.
- Modify: `skills/tanto/templates/roster-archive.md` — the Sessions table and
  the paragraph on which columns are dropped.
- Modify: `skills/tanto/templates/kanri-handover.md` — the Residency table.

**Interfaces:**

- Consumes, from task 4: the spelling `context=`, which every one of these
  columns and slots carries and which the consistency note's new check 17
  sweeps for in task 15.
- Produces, for tasks 9 and 10: the `- Ceiling — <the ceiling line>` slot that
  `roles/jisso.md` fills and Kanri reads at loop step 6, and the Context column
  that Kanri rewrites from both readings.
- The Residency header row must stay **identical** in `templates/roster.md` and
  `templates/kanri-handover.md`: the handover's copy is declared verbatim from
  the roster's, and the consistency note's check 6 greps the same literal
  against both files. P6.2 and P6.6 write the same header, and task 15 updates
  the note's two copies of it.
- markdownlint does not lint `skills/tanto/templates/**`; the hooks that decide
  this task's lint step are trailing whitespace, end-of-file, and mixed line
  ending.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/templates/batch-report.md skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md skills/tanto/templates/kanri-handover.md
```

Expected: `i/lf w/crlf attr/text=auto` on each of the four, and never
`w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O6.1** `| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |` — `skills/tanto/templates/roster.md` 1, `skills/tanto/templates/kanri-handover.md` 1, `docs/notes/tanto-consistency-checks.md` 2 → 0 in the two templates at P6.2 and P6.6, and 0 in the note at task 15, which holds the note's two copies as check 6's expected literals. Four copies of one header row, and this needle is what holds them together.

**O6.2** `| Role | Name [ref] | Model | Branch | Started | Ended | Status | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |` — `skills/tanto/templates/roster-archive.md` 1 → 0 at P6.4.

**O6.3** `the cwd and Mode columns are dropped` — `skills/tanto/templates/roster-archive.md` 1 → 0 at P6.5. Today the sentence names two of the five columns an archive row actually drops, and the spec asks for Transcript to be named among them.

O4.2's second hit, `four figures` in `templates/roster.md`, goes at P6.3.

**The spec's eighth old value, "the Transcript slot alone", has no writable `O`
needle, and this is stated rather than quietly skipped.** The slot itself does
not change — a line is added after it — so a one-line needle on
`- Transcript — <reading>` survives the insertion untouched, which is exactly
what the grammar forbids; and any needle that did span the insertion point would
appear in this plan's own new-passage text, which `passage-check lint` rejects
as `needle-in-new-text`. A6.1 is the check instead: it is `0` before this task
and `1` after, and `verify --task 6` measures the inserted line itself.

- [ ] **Step 3: The anchor and the Ceiling slot**

**A6.1** `skills/tanto/templates/batch-report.md` — `grep -cF -- '- Ceiling — <the ceiling line, ending' skills/tanto/templates/batch-report.md` — before: 0, after: 1

The `--` is load-bearing: the needle begins with a hyphen, and without it
`grep` reads the pattern as an option bundle and exits 2.

**P6.1** `skills/tanto/templates/batch-report.md` — insert after this 1 line

```text
- Transcript — <reading>
```

**P6.1 →**

```text
- Ceiling — <the ceiling line, ending `context=<n> <under|over>`>
```

The anchor line is the last of the report header's five, and it occurs once in
this file. `templates/kaiseki-report.md` carries the same line and is not
touched: a Kaiseki measures and is never replaced on the fifth figure. Naming
`context=` here, and not only in the reading line above it, is what puts this
file among the eight the consistency note's check 17 (task 15) expects it in
— a slot description that never spells the figure it carries is invisible to
a grep for that figure, and to the reader who runs one.

- [ ] **Step 4: The roster's Residency table**

**P6.2** `skills/tanto/templates/roster.md` — replace exactly these 4 lines

```text
| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> [<ref>] | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | <n> | <m> | <k> |
| <role> | <topic> | <name> [<ref>] | <YYYY-MM-DD> | <boundary> | <n> | <n> | <n> | <n> | — | — | — |
```

**P6.2 →**

```text
| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> [<ref>] | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | context=<n> | <n> | <m> | <k> |
| <role> | <topic> | <name> [<ref>] | <YYYY-MM-DD> | <boundary> | <n> | <n> | <n> | <n> | context=<n> | — | — | — |
```

- [ ] **Step 5: The paragraph under it**

**P6.3** `skills/tanto/templates/roster.md` — replace exactly these 16 lines

```text
One row per session of the current run, live or not, Kanri's first, rewritten
in place by Kanri at every boundary and plan close from the readings the
sessions send (`SKILL.md`, "The transcript reading"): a role's row from its
latest boundary or exit line, Kanri's own from the reading it takes at the
trigger check. The last three columns are Kanri's only — batches accepted,
plans closed, and compactions noticed by the session itself, cumulative since
its own start; a declined handover leaves Noticed incremented, so the count
stays a record, and a handover resets Kanri's row to the successor with zero
counts. A reading Kanri doubted and could not verify carries `(unverified)`
after its Compactions figure; `unavailable` stands in the four figures when
the session sent that. At the plan close every row whose session is dead,
replaced, refused, or cleared moves to `roster-archive.md`, joined with its
status row above, and it is the archive's rows across runs that a threshold
for replacing a peer will be read from (issue-40ed's other half; the handover
half closed with decision-b6cb, which made the plan close the ordinary
trigger).
```

**P6.3 →**

```text
One row per session of the current run, live or not, Kanri's first, rewritten
in place by Kanri at every boundary and plan close from the readings the
sessions send (`SKILL.md`, "The transcript reading"): a role's row from its
latest boundary or exit line, Kanri's own from the reading it takes at the
trigger check. Context holds the reading's fifth figure in the spelling the
reading itself prints, `context=<n>`, so that a sweep for that spelling finds
every place a reading lands. Kikaku sends no reading and its reading columns
stay blank: it is the human's own seat, and its cost is the human's own
pacing. The last three columns are Kanri's only — batches accepted,
plans closed, and compactions noticed by the session itself, cumulative since
its own start; a declined handover leaves Noticed incremented, so the count
stays a record, and a handover resets Kanri's row to the successor with zero
counts. A reading Kanri doubted and could not verify carries `(unverified)`
after its Compactions figure; `unavailable` stands in every reading column
when the session sent that. At the plan close every row whose session is dead,
replaced, refused, or cleared moves to `roster-archive.md`, joined with its
status row above, and the archive's Context column across runs is the data any
later ceiling for the roles that only measure would be read from — Kanri's and
Jisso's come from `tanto.json`'s `ceiling` map, and issue-40ed's two halves
closed with decision-b6cb and with that map.
```

- [ ] **Step 6: The archive's Sessions table**

**P6.4** `skills/tanto/templates/roster-archive.md` — replace exactly these 3 lines

```text
| Role | Name [ref] | Model | Branch | Started | Ended | Status | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <role> | <name> [<ref>] | <model id> | <branch> | <YYYY-MM-DD> | <YYYY-MM-DD> | <dead, replaced, or refused> | <last boundary> | <n> | <n> | <n> | <n> | <n or —> | <m or —> | <k or —> |
```

**P6.4 →**

```text
| Role | Name [ref] | Model | Branch | Started | Ended | Status | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <role> | <name> [<ref>] | <model id> | <branch> | <YYYY-MM-DD> | <YYYY-MM-DD> | <dead, replaced, or refused> | <last boundary> | <n> | <n> | <n> | <n> | context=<n> | <n or —> | <m or —> | <k or —> |
```

- [ ] **Step 7: Which columns an archive row drops**

**P6.5** `skills/tanto/templates/roster-archive.md` — replace exactly these 3 lines

```text
An archive row is the roster's status row for that session joined with its
last Residency row; the cwd and Mode columns are dropped, Started keeps the
date and drops the time, Ended is the date the row's status changed.
```

**P6.5 →**

```text
An archive row is the roster's status row for that session joined with its
last Residency row; the Topic, cwd, Effort, Mode and Transcript columns are
dropped, Started keeps the date and drops the time, Ended is the date the
row's status changed. Transcript is dropped because the file it names is
local to one machine and outlives nothing; the plan close therefore runs
`reading.js --share` over those paths **before** this move, while they are
still in the roster. Context keeps the reading's `context=<n>` figure, and it
is the one column of this table a later design will be read from.
```

- [ ] **Step 8: The handover file's copy of the row**

**P6.6** `skills/tanto/templates/kanri-handover.md` — replace exactly these 3 lines

```text
| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> [<ref>] | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | <n> | <m> | <k> |
```

**P6.6 →**

```text
| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> [<ref>] | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | context=<n> | <n> | <m> | <k> |
```

The first two lines of this block are byte-identical to the first two of P6.2,
which is what "the roster's row, verbatim" means and what the consistency
note's check 6 measures.

- [ ] **Step 9: Lint**

```bash
./scripts/lint.sh skills/tanto/templates/batch-report.md skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md skills/tanto/templates/kanri-handover.md
```

Expected: exit 0, none `Failed`. Each path is named individually; a directory
argument makes every hook skip and proves nothing.

- [ ] **Step 10: Commit**

```bash
git commit --only skills/tanto/templates/batch-report.md skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md skills/tanto/templates/kanri-handover.md -m "docs(tanto): the Ceiling slot and the Context column in four templates" -m "The batch report's header gains a Ceiling slot under Transcript; the roster, its archive, and the handover file gain a Context column after Compactions holding the reading's context= figure; the archive's dropped-columns sentence names all five it drops, Transcript included. Spec 3.3 and 7.6." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 11: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 12: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 6
```

Expected: `task 6: verify clean`.

**Done when:** the six passages are present in the four templates,
`grep -cF -- '- Ceiling — <the ceiling line, ending' skills/tanto/templates/batch-report.md`
prints `1`, the Residency header row is byte-identical in
`templates/roster.md` and `templates/kanri-handover.md`, O6.1's needle returns
`0` in both templates and its two remaining hits are in the consistency note,
O6.2 and O6.3 return `0`, `git ls-files --eol` still reports `i/lf w/crlf` on
all four, lint is clean, and the commit carries its `Co-Authored-By:` trailer.

---

### Task 7: Kanri's backstop, its two measurement points, and Readings

**Batch:** C. **Blocks:** A7.1, O7.1, P7.1, P7.2, P7.3, P7.4.

The three places in `roles/kanri.md` that are about the instrument rather than
about the rule, so that task 8 can be about the rule alone. Start step 1 gains
the backstop line and the one recommendation it may make; Start step 5 and "When
the plan lands" step 2 gain the two measurement points that make the
spec-and-plan-stage growth a figure instead of a gap; and "Readings" names the
script in place of "the same pipeline". Spec 2.2, 5.3, and spec 7.2's first,
third and last bullets.

**The backstop is read once and set never.** `/autocompact`, the flag and the
environment variable are the human's; "composes without modifying" covers the
harness's own setting as it covers the skills (spec 1.5). Nothing re-checks the
window mid-run either, and the passage says why: the human can change it in any
window at any time and the skill would not see it, so a mid-run re-check would
report a stale value with more confidence than a start-line one.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — four passages: Start step 1, the tail
  of Start step 5, "When the plan lands" step 2, and the first paragraph of
  "Readings".

**Interfaces:**

- Consumes, from task 3: `--role kanri --backstop`, the backstop line's shape,
  and the `above`/`below` verdict.
- Consumes, from task 1: `ceiling.kanri.per_batch`, which the recommended
  `/autocompact` value is two of.
- Produces, for task 10: the two Measurements entries — "the topic's opening"
  and "the plan's landing" — that `templates/kanri.md`'s fifth row is shaped to
  hold, and which task 17's dogfood reads back as its own first two rows.
- markdownlint runs on `skills/tanto/roles/kanri.md`.
- Tasks 8, 9 and 13 edit this same file in other sections. None of them touches
  these four regions, and this task touches none of theirs.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kanri.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The old value this task contradicts**

**O7.1** `the same pipeline` — `skills/tanto/roles/kanri.md` 1 → 0 at P7.4. The verification of a peer's reading named the shell pipeline that no longer exists; it names the script now, and the rule around it — a path this session may read, never a peer asked to read for you — is unchanged.

- [ ] **Step 3: The anchor and the backstop in the start line**

**A7.1** `skills/tanto/roles/kanri.md` — `grep -cF 'auto-compact would fire before your handover' skills/tanto/roles/kanri.md` — before: 0, after: 1

**P7.1** `skills/tanto/roles/kanri.md` — replace exactly these 10 lines

````text
1. Read `tanto.json` as `SKILL.md` describes, write the twelve agent
   definitions from the merged config as its start sequence prescribes, run
   `ListAgents` once for your own `name [ref]`, and say your start line: the
   config file, the keys that came from the defaults, the ladder result if
   that check failed, and
   `agents: <n> current, <m> written, <k> not visible to this session`; your
   own `model` and `effort` against `sessions.kanri`, since you send no
   handshake and this line is the only place your own two values are checked,
   a mismatch of either being one line to the human and nothing switched; and
   your `name [ref]`, with your bare name as the address.
````

**P7.1 →**

````text
1. Read `tanto.json` as `SKILL.md` describes, write the twelve agent
   definitions from the merged config as its start sequence prescribes, run
   `ListAgents` once for your own `name [ref]`, and say your start line: the
   config file, the keys that came from the defaults, the ladder result if
   that check failed, and
   `agents: <n> current, <m> written, <k> not visible to this session`; your
   own `model` and `effort` against `sessions.kanri`, since you send no
   handshake and this line is the only place your own two values are checked,
   a mismatch of either being one line to the human and nothing switched; and
   your `name [ref]`, with your bare name as the address. Then locate your own
   transcript as `SKILL.md`'s "The transcript reading" says and take the
   reading with the backstop, quoting its line in the same start line:

   ```bash
   node "$TANTO/scripts/reading.js" "$T" --role kanri --backstop
   ```

   When the backstop's verdict is `below`, add one more line to the human, in
   the chat's language: auto-compact would fire before your handover, and
   `/autocompact <value>` — `<value>` being the ceiling plus two more of
   `ceiling.kanri.per_batch`, rounded up to the nearest 50000, about 350000 at
   the defaults — would leave two batches between the ceiling and the
   compaction, room for one deferral and the boundary after it. It is a
   recommendation and not a lifecycle request: the human sets the window or
   does not, the roster records nothing about it, and nothing re-checks it
   mid-run, because the human can change it in any window at any time and you
   would not see it. The skill never sets `autoCompactWindow` itself, here or
   anywhere.
````

- [ ] **Step 4: The first measurement, at the topic's opening**

**P7.2** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```text
   fixed, because Sekkei's file names carry it. Each topic keeps its own
   `.tanto/<topic>/kanri.md`, its own Progress line, and its own Batches
   table, and the roster's Topic column says which session belongs to which;
   a topic whose ledger already exists is named by the handover or the
   roster's Events and is not opened again.
```

**P7.2 →**

```text
   fixed, because Sekkei's file names carry it. Each topic keeps its own
   `.tanto/<topic>/kanri.md`, its own Progress line, and its own Batches
   table, and the roster's Topic column says which session belongs to which;
   a topic whose ledger already exists is named by the handover or the
   roster's Events and is not opened again. As you create the ledger, take
   your own reading and write its `context=` figure into the Measurements
   per-boundary row as that topic's opening entry: your context grows through
   the spec and plan stages with no batch boundary to record it, and this
   entry and the one at the plan's landing are what make that growth a
   measured figure rather than a hole in the table.
```

- [ ] **Step 5: The second measurement, at the plan's landing**

**P7.3** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
2. Record in the ledger's Plan section the plan's path and the SDD ledger's,
   `.superpowers/sdd/<plan-basename>/progress.md`, which Jisso's
   `sdd-workspace` run will create, and note the landing in the roster's
   Events list. Nothing moves: the ledger stays at `.tanto/<topic>/kanri.md`.
```

**P7.3 →**

```text
2. Record in the ledger's Plan section the plan's path and the SDD ledger's,
   `.superpowers/sdd/<plan-basename>/progress.md`, which Jisso's
   `sdd-workspace` run will create, and note the landing in the roster's
   Events list. Take your own reading again and add its `context=` figure to
   the Measurements per-boundary row as that topic's landing entry, beside the
   opening one, with the delta between them. Nothing moves: the ledger stays
   at `.tanto/<topic>/kanri.md`.
```

- [ ] **Step 6: Verifying a peer's reading**

**P7.4** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```text
Every role sends its reading with its boundary and exit lines, and Jisso's
and Kaiseki's reports carry it; copy each into that role's Residency row at
loop step 6, with the boundary it was read at. A reading you doubt — a
session whose report lost a ruling with `0 compactions`, or one that sent
`unavailable` — you may verify with the same pipeline on the path its
handshake carried, when that path is one your session may read; a read
that is denied or fails leaves the self-report standing, marked
`(unverified)`. Never ask a peer to read a transcript for you.
```

**P7.4 →**

```text
Every role sends its reading with its boundary and exit lines, and Jisso's
and Kaiseki's reports carry it; copy each into that role's Residency row at
loop step 6, with the boundary it was read at and the `context=` figure in the
Context column. A reading you doubt — a
session whose report lost a ruling with `0 compactions`, one whose ceiling
line decides a replacement, or one that sent
`unavailable` — you may verify by running `node "$TANTO/scripts/reading.js"`
yourself on the path that role's Transcript column holds, with `--role jisso`
when it is Jisso's ceiling line you are checking, and only when that path is
one your session may read; a read
that is denied or fails leaves the self-report standing, marked
`(unverified)`. Never ask a peer to read a transcript for you.
```

- [ ] **Step 7: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: exit 0, none `Failed`. This step runs before the Verify step below,
for the reason task 4's lint step states.

- [ ] **Step 8: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md -m "docs(tanto): Kanri reads the backstop and measures at two more points" -m "The start line quotes the backstop line and, when it sits below the ceiling, recommends an autocompact window once; the topic's opening and the plan's landing each write a Measurements entry, so the spec-and-plan-stage growth is measured; Readings names reading.js in place of the shell pipeline. Spec 2.2, 5.3 and 7.2." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 9: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 10: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 7
```

Expected: `task 7: verify clean`.

**Done when:** the four passages are present,
`grep -cF 'auto-compact would fire before your handover' skills/tanto/roles/kanri.md`
prints `1`, O7.1's needle returns `0`, lint is clean, and the commit carries
its `Co-Authored-By:` trailer.

---

### Task 8: the fourth signal, the presence gate, and the deferred state

**Batch:** C. **Blocks:** A8.1, O8.1, O8.2, O8.3, P8.1, P8.2, P8.3, P8.4.

The rule itself, in `roles/kanri.md`'s Handover section. Four passages: the
paragraph that says how many signals there are and where each is checked; the
fourth signal and, inserted with it, the presence gate and the three places a
deferral is written; the paragraph after the list, which stops saying that no
threshold was needed; and one sentence in Timing saying that a deferred handover
is not a due one. Spec 3.1, 3.2 and 3.5, and spec 7.2's second and fourth
bullets.

Three things this task decides that the old text decided otherwise.

**Signal 4 is checked in a topic's spec or plan stage; signals 1 and 3 still are
not.** Today's sentence — "A topic in its spec or plan stage neither fires the
check nor blocks it" — is narrowed rather than deleted, because it is right
about the other two: a Sekkei or Keikaku holds nothing Kanri must wait for. It
is wrong about signal 4, because Kanri's context grows in that stage — a T0
shoroku, a bug-report triage, the handshakes, a resume — with no batch boundary
to catch it (spec's I-3, gap A).

**The gate also covers signal 3, and that amends decision-6dea for Kanri only.**
6dea made a noticed compaction a replacement condition on the ground that a
summary standing in place of the conversation is itself the loss. The gate says
that a Kanri who compacts while the human is away continues on that summary to
the plan close rather than stalling the run, on the same ground as the
presence gate itself: state lives in files — the ledger, the dialogue files, the
roster — and idle costs nothing while a stalled run costs the time the human was
away. **This is one of the two points the spec's own brief puts to the human**,
and if the human rejects it the fix is small and local: strike the words "and 4"
from the gate's first sentence and leave signal 3 ungated. The peers' compaction
rows in the Replace table are not gated in either case.

**A deferral is a recorded state in three files, not a note in one.** The ledger
says it so a cold reader sees it, the roster's Events say it so the archive
keeps it, and the batch prompt says it so the file the human may paste is not
silently wrong about who is running the batch.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — four passages, three in "The trigger"
  and one in "Timing".

**Interfaces:**

- Consumes, from task 3: `--role kanri`, the ceiling line's `over`/`under`
  verdict, `--presence`, and the `present`/`absent` verdict.
- Consumes, from task 1: `ceiling.kanri.batches` and `ceiling.kanri.per_batch`,
  named in the fourth signal as what the ceiling is derived from.
- Produces, for task 9: the presence gate and the term "deferred" itself —
  task 9's own new text is what writes the exact clause "and is not deferred"
  into loop step 6's handover branch, testing the state this task defines; for
  task 10: the exact Progress clause and Events line
  shapes that `templates/kanri.md` and `templates/batch-prompt.md` hold, and
  the "Measurements deferrals row" this text names; and for task 13: nothing —
  task 13's passages are elsewhere in the file.
- markdownlint runs on this file.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kanri.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O8.1** `Three signals fire` — `skills/tanto/roles/kanri.md` 1 → 0 at P8.1. `templates/roster.md` carries a sentence of the same content under Residency, and O4.2 and P6.3 in task 6 took it.

**O8.2** `reading, because the plan close arrives first in practice and no number was` — `skills/tanto/roles/kanri.md` 1 → 0 at P8.3. The sentence wraps across two lines, and this is its second line, which is the half that changes; the first line ends with "and not a threshold on the", which survives in no form.

**O8.3** `for **replacing a peer** will be chosen from, by an ADR, once enough sessions` — `skills/tanto/roles/kanri.md` 1 → 0 at P8.3. The promise of a future ADR that this spec's own ADR keeps for Kanri and Jisso and defers, as an issue, for everyone else.

- [ ] **Step 3: Four signals, and where each is checked**

**P8.1** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```text
Three signals fire a handover. Check them at the boundaries of the topic whose
batches are in flight — at loop step 6 — and, between plans, at the start of
every turn you get, a message or the human speaking. A topic in its spec or
plan stage neither fires the check nor blocks it: its Sekkei or Keikaku holds
nothing you must wait for beyond an unanswered line, which that peer re-sends
to your successor's address. Run the self-check of `SKILL.md`'s Resuming at the
same points — one `ListAgents`; a name that is not your row's means you were
resumed, and the roster's first row is rewritten before anything else.
```

**P8.1 →**

```text
Four signals fire a handover. Check them at the boundaries of the topic whose
batches are in flight — at loop step 6 — and, between plans, at the start of
every turn you get, a message or the human speaking. For signals 1 and 3, a
topic in its spec or
plan stage neither fires the check nor blocks it: its Sekkei or Keikaku holds
nothing you must wait for beyond an unanswered line, which that peer re-sends
to your successor's address. Signal 4 **is** checked in that stage, at the
start of every turn while no batch is in flight, because your context grows
there — a T0 shoroku, a bug-report triage, the handshakes, a resume — with no
batch boundary to catch it; and a handover there is safe on Timing's own
terms, since nothing is in flight and an unanswered line is re-sent to your
successor. Run the self-check of `SKILL.md`'s Resuming at the
same points — one `ListAgents`; a name that is not your row's means you were
resumed, and the roster's first row is rewritten before anything else.
```

- [ ] **Step 4: The fourth signal, the gate, and the deferred state**

**A8.1** `skills/tanto/roles/kanri.md` — `grep -cF 'The ceiling crossed' skills/tanto/roles/kanri.md` — before: 0, after: 1

**P8.2** `skills/tanto/roles/kanri.md` — insert after these 6 lines

```text
3. **A compaction noticed.** Your context now begins with a summary of earlier
   conversation instead of the conversation itself, or a ruling the ledger
   holds is one you do not remember making. State lives in files, so a
   compaction loses nothing the successor cannot read back; it is the harness's
   own signal that the session has grown long, and it is the one signal a
   session can see for itself.
```

**P8.2 →**

```text
4. **The ceiling crossed.** At every check — loop step 6 at a boundary, and
   the start of every turn while no batch is in flight, a topic's spec or plan
   stage included — take your own reading with `--role kanri` and read its
   ceiling line. A verdict of `over` is this signal. The ceiling is derived,
   not configured: your own first turn's context in this transcript, measured
   from the transcript itself, plus `ceiling.kanri.batches` batches of
   `ceiling.kanri.per_batch`. It moves when the seat's fixed load moves and
   when the run's per-batch consumption moves, so a shorter role file or a
   quieter boundary lowers it without anyone editing a number. A resumed
   session keeps its transcript and so its baseline.

**Signals 3 and 4 fire a handover only when the human is present.** Run
`reading.js` on your own transcript with `--presence` at the check where the
signal fired. `present` means the handover runs at this check — by the in-plan
procedure at a boundary, and as between plans when no batch is in flight.
`absent` means it is **deferred**: record it as below, continue — the next
batch prompt at a boundary, the turn's own work otherwise — and re-check at
every later check, where a `present` verdict runs the handover then. Signal 1,
the plan close, hands over regardless, as decision-b6cb made it; signal 2, the
human's word, is presence itself. The reason is that a handover is complete
only when the human creates the successor, and the successor is what sends the
next batch prompt: a handover written to an empty room stops the run for as
long as the room is empty, while the batches could have run. Idle costs
nothing; a stalled run costs the time the human was away. The
`autoCompactWindow` your start line reported is the net beneath this, and a
compaction while the human is away is that net doing its work.

A deferred handover is written in three places, so that a successor or a cold
reader sees it:

- the ledger's Progress line gains the clause
  `handover deferred (absent, context=<n>, since <batch X | the spec stage | the plan stage>)`,
  kept until the handover runs or the plan closes;
- a roster Events line,
  `<date> — handover deferred at <batch X | the spec stage | the plan stage>: ceiling <c> crossed at context=<n>, human absent (last turn <m> min ago)`;
  and at the check where it finally runs, the ordinary `handover written by`
  line, whose Events entry names where the deferral began;
- the next batch prompt's previous-batch-verdict section carries the one line
  `templates/batch-prompt.md` holds for it, so that the prompt file the human
  may paste says what the run's state is.

A deferral counts nothing in the Residency row's Noticed column — that column
is compactions the session noticed, and a crossed ceiling is not one — but the
ledger's Measurements deferrals row takes an entry for it, naming the stage or
the batch, the role, the context, and how long ago the human's last turn was.
When the human returns and speaks in your window, the next check finds
`present` and the handover runs; a human who says "continue" there declines it
the way the Handover section already describes, and the deferral stands until
the next check or the close.
```

- [ ] **Step 5: What the instrument is, now that there is one**

**P8.3** `skills/tanto/roles/kanri.md` — replace exactly these 13 lines

```text
Signal 3 is the mid-plan case; signal 2 is any time at all, and a human who
says "continue" at a plan close declines that close's handover the way the
Handover section already describes. Not the `tokens left` figure the
harness prints in its reminders, whose unit is not documented as the context
window and whose presence is not guaranteed; and not a threshold on the
reading, because the plan close arrives first in practice and no number was
needed. At every check take your own reading (`SKILL.md`, "The transcript
reading") and rewrite your Residency row with it: a compactions figure of `1`
where you noticed none is signal 3, seen in a file, and counts as noticed. The
Residency rows, and the archive's rows across runs, are the data a threshold
for **replacing a peer** will be chosen from, by an ADR, once enough sessions
have ended (issue-40ed's other half; its handover half closed with
decision-b6cb).
```

**P8.3 →**

```text
Signals 3 and 4 are the mid-plan cases; signal 2 is any time at all, and a
human who says "continue" at a plan close declines that close's handover the
way the Handover section already describes. Not the `tokens left` figure the
harness prints in its reminders, whose unit is not documented as the context
window and whose presence is not guaranteed: the instrument is the reading's
own `context=`, the harness's `usage` accounting for the turn it billed, which
is the token figure issue-40ed asked for. At every check take your own reading
(`SKILL.md`, "The transcript
reading") and rewrite your Residency row with it: a compactions figure of `1`
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

- [ ] **Step 6: A deferred handover does not stop the loop**

**P8.4** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

```text
Only at a boundary of the topic whose batches are in flight: a batch accepted
and the next prompt not yet sent, that topic's close once the archive move is
done, or between plans. Never mid-batch — "never replace mid-batch on
suspicion" names you too. Another topic's spec or plan stage supplies no
boundary of this kind and holds no handover of yours. Because the trigger is
checked before the next prompt is written, a handover that is due stops the
loop at that point, and the next prompt is the successor's to send.
```

**P8.4 →**

```text
Only at a boundary of the topic whose batches are in flight: a batch accepted
and the next prompt not yet sent, that topic's close once the archive move is
done, or between plans. Never mid-batch — "never replace mid-batch on
suspicion" names you too. Another topic's spec or plan stage supplies no
boundary of this kind and holds no handover of yours. Because the trigger is
checked before the next prompt is written, a handover that is due stops the
loop at that point, and the next prompt is the successor's to send. A
**deferred** handover is not a due one: the ceiling is crossed and the human is
not there to create your successor, so nothing stops here, the next prompt goes
out under you, and the deferral is re-checked at the boundary after it.
```

- [ ] **Step 7: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: exit 0, none `Failed`.

- [ ] **Step 8: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md -m "docs(tanto): the fourth handover signal, its presence gate, and the deferred state" -m "A ceiling crossing is signal 4, checked at every boundary and, in a topic's spec or plan stage, at the start of every turn; signals 3 and 4 fire only when the human's last turn in Kanri's own window is inside the presence window, and otherwise are deferred and recorded in the ledger, the roster and the next batch prompt. Amends decision-6dea for Kanri only. Spec 3.1, 3.2, 3.5 and 7.2." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 9: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 10: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 8
```

Expected: `task 8: verify clean`.

**Done when:** the four passages are present,
`grep -cF 'The ceiling crossed' skills/tanto/roles/kanri.md` prints `1`, the
needles of O8.1, O8.2 and O8.3 return `0`, lint is clean, and the commit
carries its `Co-Authored-By:` trailer.

---

### Task 9: loop step 6, the Replace row, and the handover file's Deferred line

**Batch:** C. **Blocks:** A9.1, P9.1, P9.2, P9.3.

Where the rule is actually run. Loop step 6 is the one place a boundary's two
readings are taken and both verdicts acted on, so it says so; the Replace table
gains the Jisso row spec 3.3 writes; and the handover file's own description
gains the Deferred line, so that a successor inherits a standing deferral
instead of rediscovering it. Spec 3.3 and spec 7.2's sixth and seventh bullets.

**Jisso's ceiling is read from its report, not measured by Kanri.** Jisso runs
the script with `--role jisso` when it writes the batch report (task 10) and
Kanri reads that line with the report's other header lines. Kanri may re-run the
script itself on the path the roster's Transcript column holds when it doubts
the line — task 7's Readings passage says how — and never asks Jisso to read a
transcript for it.

**The existing Replace row stays.** "Jisso has carried the batches the plan
expects of one session" is a plan's own statement of the same idea, and a plan
that names a batch count still binds; the ceiling row is its measured form, and
the new row says so rather than leaving a reader to guess which wins.

**One sentence of P9.1's new text is replaced again in task 13**, in batch D,
when the `exit:` lines become "the lines to the sessions whose proposal is not
already named". That task quotes this task's new text as its old block, so the
two must be applied in plan order, which is the order a batch cut already
imposes.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — three passages: the first paragraph
  of the batch loop's step 6, the Replace table, and the handover file's
  In flight / Live peers paragraph.

**Interfaces:**

- Consumes, from task 8: the gate, the word "deferred", and the three places a
  deferral is written.
- Consumes, from task 6: the `- Ceiling — <the ceiling line>` slot in the batch
  report header, and the Context column in the Residency table.
- Produces, for task 10: the Progress clause
  `Jisso replacement deferred (absent, context=<n>, since batch <X>)`, which
  `templates/kanri.md` holds and `templates/batch-prompt.md` notices; and the
  `Deferred` bullet name that `templates/kanri-handover.md`'s In flight block
  gains.
- Produces, for task 13: the exact three lines of P9.1's new text that task 13
  replaces.
- markdownlint runs on this file.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kanri.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The anchor and the boundary's two readings**

**A9.1** `skills/tanto/roles/kanri.md` — `grep -cF "Jisso's ceiling line says" skills/tanto/roles/kanri.md` — before: 0, after: 1

**P9.1** `skills/tanto/roles/kanri.md` — replace exactly these 9 lines

```text
6. **Check the lifecycle tables and the handover trigger.** Rewrite the
   roster's Residency row from your own reading and from the readings the peers
   sent. If a create request is due, make it, unless a
   handover trigger has fired, in which case the successor makes it from the
   handover's Next step. If a delete or a replace of a live, coherent session
   is due, or a handover trigger has fired, run the proposal half of "Exit
   shoroku" now: send the `exit:` lines, check each proposal and dispatch its
   recommender, and write the direction once the human has answered. Delete
   requests wait for step 7.
```

**P9.1 →**

```text
6. **Check the lifecycle tables and the handover trigger.** Take your own
   reading with `--role kanri`, read Jisso's ceiling line from its report's
   header beside the Transcript line, and rewrite
   the roster's Residency rows from both, each `context=` figure into that
   row's Context column. A verdict of `over` on your own ceiling line is
   handover signal 4; a verdict of `over` on Jisso's is a Replace symptom.
   Either one is gated on `--presence`, run on your own transcript at this
   check, and an `absent` verdict defers it rather than firing it. Write the
   Measurements per-boundary entry from the two readings, and a Measurements
   deferrals entry for anything deferred here.
   If a create request is due, make it, unless a
   handover trigger has fired, in which case the successor makes it from the
   handover's Next step. If a delete or a replace of a live, coherent session
   is due, or a handover trigger has fired and is not deferred, run the
   proposal half of "Exit
   shoroku" now: send the `exit:` lines, check each proposal and dispatch its
   recommender, and write the direction once the human has answered. Delete
   requests wait for step 7.
```

- [ ] **Step 3: The Replace table's ceiling row**

**P9.2** `skills/tanto/roles/kanri.md` — insert after this 1 line

```text
| Jisso context decay — its reading shows a compaction, two consecutive batches needed escalation, or a report says compaction lost rulings | at the batch boundary, ask the human to delete and create; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
```

**P9.2 →**

```text
| Jisso's ceiling line says `over` | run `--presence` on your own transcript at that boundary. `present` — run "Exit shoroku" and ask the human to delete and create, the next prompt saying `resume batch X from task N` as for any replacement. `absent` — defer: write the ledger's Progress clause `Jisso replacement deferred (absent, context=<n>, since batch <X>)`, a roster Events line of the same shape as a deferred handover's, and the batch prompt's one-line notice, then re-check at the next boundary. Never at the final batch's boundary: Jisso exits after T2 in any case. The row above it stays — a plan that names the batch count one session should carry still binds — and this row is the measured form of the same idea; a replaced Jisso's baseline is its own first turn, so the ceiling resets with the seat, and the SDD ledger and the batch reports are the recovery point as for any replacement |
```

- [ ] **Step 4: The handover file carries a standing deferral**

**P9.3** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```text
In flight carries one block — Plan, Ledger, Batch state — **per open ledger**,
so that a topic still in its spec or plan stage is handed over together with
the topic whose batches were in flight. Live peers lists every peer of every
open topic, each with its Topic and what it is waiting for, and marks the ones
whose last line you had not answered: the successor sends `kanri-address:` to
all of them, and each answers by re-sending its last unanswered line.
```

**P9.3 →**

```text
In flight carries one block — Plan, Ledger, Batch state, Deferred — **per open
ledger**,
so that a topic still in its spec or plan stage is handed over together with
the topic whose batches were in flight. Deferred is the ledger's Progress
clause, verbatim, when a handover or a Jisso replacement stands deferred on the
ceiling and the human's absence, and `none` otherwise: the successor re-checks
it at its own first check, where a `present` verdict runs what this session
could not. Live peers lists every peer of every
open topic, each with its Topic and what it is waiting for, and marks the ones
whose last line you had not answered: the successor sends `kanri-address:` to
all of them, and each answers by re-sending its last unanswered line.
```

- [ ] **Step 5: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: exit 0, none `Failed`.

- [ ] **Step 6: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md -m "docs(tanto): the ceiling checked at the boundary, and Jisso replaced on it" -m "Loop step 6 takes both readings, acts on both verdicts under one presence check, and fills the two Measurements rows; the Replace table gains Jisso's ceiling row beside the batch-count row it measures; the handover file carries a standing deferral so the successor inherits it. Spec 3.3 and 7.2." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 7: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 8: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 9
```

Expected: `task 9: verify clean`.

**Done when:** the three passages are present,
`grep -cF "Jisso's ceiling line says" skills/tanto/roles/kanri.md` prints `1`,
the Replace table has twelve data rows where it had eleven, lint is clean, and
the commit carries its `Co-Authored-By:` trailer.

---

### Task 10: Jisso's reading, and the three templates the rule fills

**Batch:** C. **Blocks:** A10.1, O10.1, P10.1, P10.2, P10.3, P10.4, P10.5, P10.6.

The other side of task 9. `roles/jisso.md`'s batch-report step runs the script
with `--role jisso` and fills the Ceiling slot task 6 added;
`templates/kanri.md` gains the three Measurements rows and the Progress line's
deferred clause; `templates/kanri-handover.md`'s In flight block gains the
Deferred bullet task 9 named; and `templates/batch-prompt.md` gains the one-line
notice a standing deferral writes. Spec 3.2, 3.3, 5.3, and spec 7.3 and 7.6.

**`roles/jisso.md` changes in exactly one place**, and its exit rule does not
change at all: Jisso keeps the `exit:` line, because Jisso's exit is not a
boundary it can see coming — T2 decides it, and Kanri runs T2 (spec 7.3).

**Jisso never acts on its own ceiling line.** It prints it and reports it; the
verdict is Kanri's to read, gate on presence, and act on. A Jisso that replaced
itself would be a session deciding its own deletion, which the human does.

**Files:**

- Modify: `skills/tanto/roles/jisso.md` — the batch-report step.
- Modify: `skills/tanto/templates/kanri.md` — the Progress section's guidance
  and the Measurements table and its paragraph.
- Modify: `skills/tanto/templates/kanri-handover.md` — the In flight block.
- Modify: `skills/tanto/templates/batch-prompt.md` — the previous-batch-verdict
  section.

**Interfaces:**

- Consumes, from task 3: `--role jisso` and the ceiling line.
- Consumes, from task 6: the `- Ceiling — <the ceiling line>` slot.
- Consumes, from tasks 8 and 9: the Progress clauses, the Events line shape,
  the name "Deferred", and the two notice lines, all quoted here verbatim so
  that the template and the role file cannot drift apart.
- Produces, for task 17: the three Measurements rows the dogfood report reads
  back as its sections 1, 2 and 3.
- markdownlint runs on `skills/tanto/roles/jisso.md` and on no other path in
  this task; the three templates are decided by trailing whitespace,
  end-of-file, and mixed line ending.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/jisso.md skills/tanto/templates/kanri.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/batch-prompt.md
```

Expected: `i/lf w/crlf attr/text=auto` on each of the four, and never
`w/mixed`.

- [ ] **Step 2: The old value this task contradicts**

**O10.1** `These four rows are fixed` — `skills/tanto/templates/kanri.md` 1 → 0 at P10.3.

- [ ] **Step 3: Jisso's batch-report step**

**P10.1** `skills/tanto/roles/jisso.md` — replace exactly these 4 lines

````text
1. Write `batch-<X>-report.md` in the topic directory, `.tanto/<topic>/`, from
   the tanto skill's `templates/batch-report.md`, taking your own reading
   (`SKILL.md`, "The transcript reading") into its `- Transcript — <reading>`
   line.
````

**P10.1 →**

````text
1. Write `batch-<X>-report.md` in the topic directory, `.tanto/<topic>/`, from
   the tanto skill's `templates/batch-report.md`, taking your own reading
   (`SKILL.md`, "The transcript reading") into its `- Transcript — <reading>`
   line and your own ceiling line — ending `context=<n> <under|over>` — into
   the `- Ceiling` slot beneath it. One run gives both, with `T` your
   transcript path and `$TANTO` the skill's own directory, set in the same
   tool call as the command:

   ```bash
   node "$TANTO/scripts/reading.js" "$T" --role jisso
   ```

   You act on neither: Kanri reads the ceiling line with the report's other
   header lines, and a verdict of `over` there is a Replace symptom on Kanri's
   side, gated on the human's presence and never your own decision. When the
   script prints no ceiling line — an unavailable transcript, a `node` that
   will not run — the Ceiling slot carries `unavailable`, which is a value and
   not a failure.
````

- [ ] **Step 4: The ledger's Progress line carries a deferral**

**P10.2** `skills/tanto/templates/kanri.md` — replace exactly these 2 lines

```text
<one line, rewritten in place: which batch is in flight or accepted, what is
being waited on, "handover written", or "closed">
```

**P10.2 →**

```text
<one line, rewritten in place: which batch is in flight or accepted, what is
being waited on, "handover written", or "closed"; plus, while one stands, the
clause `handover deferred (absent, context=<n>, since <batch X | the spec
stage | the plan stage>)` or
`Jisso replacement deferred (absent, context=<n>, since batch <X>)`, kept
until that handover or replacement runs or the plan closes>
```

- [ ] **Step 5: The anchor and the three Measurements rows**

**A10.1** `skills/tanto/templates/kanri.md` — `grep -cF 'deferrals: where, the role, the context, and the presence verdict' skills/tanto/templates/kanri.md` — before: 0, after: 1

**P10.3** `skills/tanto/templates/kanri.md` — insert after this 1 line

```text
| the day's cost, uncached input, cache miss, cache hit, and hit rate | <YYYY-MM-DD> | <the five figures as the human pastes them from the Claude Code Usage extension> |
```

**P10.3 →**

```text
| Kanri's context at the topic's opening and at the plan's landing, then Kanri's and Jisso's at each boundary, with the delta per batch | <YYYY-MM-DD, each check> | <opening: kanri context=<n>; landing: kanri context=<n> (+<d>); batch letter: kanri context=<n> (+<d>), jisso context=<n> (+<d>)>, one entry per check |
| deferrals: where, the role, the context, and the presence verdict | <YYYY-MM-DD, the check> | <batch letter or stage, kanri or jisso, context=<n>, last human turn <m> min ago>, one entry per deferral, or `none` |
| the share of usage at context over the threshold, proxy and Account & Usage | <YYYY-MM-DD, the plan close> | <the share line, the names it ran over, and the human's figure or blank> |
```

- [ ] **Step 6: Which step fills each row**

**P10.4** `skills/tanto/templates/kanri.md` — replace exactly these 7 lines

```text
These four rows are fixed and always present. Kanri fills the first at the
plan close from this ledger's Session events, where it writes one line each
time a third top-family session goes live; the second by counting those same
events' one-shot lines by kind and not by stage, since one kind is dispatched
at several stages; the third by copying the roster's Residency rows; the
fourth from what the human pastes. None of the four is a threshold — they are
the record the next measurement starts from.
```

**P10.4 →**

```text
These seven rows are fixed and always present. Kanri fills the first at the
plan close from this ledger's Session events, where it writes one line each
time a third top-family session goes live; the second by counting those same
events' one-shot lines by kind and not by stage, since one kind is dispatched
at several stages; the third by copying the roster's Residency rows; the
fourth from what the human pastes. The fifth is filled at the topic's opening
(Start step 5), at the plan's landing, and at every boundary from the two
readings of loop step 6; the sixth at any deferral, in whichever stage, and
carries `none` when a plan's Kanri and Jisso never deferred; the seventh at
the plan close from `reading.js --share`, with the sessions it ran over, the
ones it skipped, and the figure the human read from the Account & Usage view,
or a blank where the human did not answer. The fifth and sixth are the record
behind a rule — the ceiling of `roles/kanri.md`'s trigger — and the other five
are the record the next measurement starts from.
```

- [ ] **Step 7: The handover file's Deferred line**

**P10.5** `skills/tanto/templates/kanri-handover.md` — insert after these 2 lines

```text
  - Batch state — <"batch <X> accepted, batch <Y> prompt not sent", or "at the
    spec or plan stage, no batches yet">
```

**P10.5 →**

```text
  - Deferred — <the ledger's Progress clause, verbatim, when a handover or a
    Jisso replacement stands deferred on the ceiling and the human's absence;
    "none" otherwise. The successor re-checks it at its own first check, where
    a `present` verdict runs what the outgoing session could not.>
```

- [ ] **Step 8: The batch prompt's deferral notice**

**P10.6** `skills/tanto/templates/batch-prompt.md` — replace exactly these 3 lines

```text
<One line per point: what Kanri verified in the tree, what was accepted, what
was returned for rework and why. For the first batch, write "First batch, no
previous verdict.">
```

**P10.6 →**

```text
<One line per point: what Kanri verified in the tree, what was accepted, what
was returned for rework and why. For the first batch, write "First batch, no
previous verdict.">
<When a deferral stands at this boundary, one further line, verbatim — both
when both stand:
"Kanri's handover is deferred since <batch X | the spec stage | the plan
stage> — the ceiling is crossed and the human is absent; this batch runs under
the same Kanri", and
"Your replacement is deferred since batch <X> — your ceiling is crossed and
the human is absent; run this batch and report as usual".>
```

- [ ] **Step 9: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/jisso.md skills/tanto/templates/kanri.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/batch-prompt.md
```

Expected: exit 0, none `Failed`. Each path named individually.

- [ ] **Step 10: Commit**

```bash
git commit --only skills/tanto/roles/jisso.md skills/tanto/templates/kanri.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/batch-prompt.md -m "docs(tanto): Jisso's ceiling line, and the three templates a deferral is written in" -m "Jisso runs reading.js with --role jisso at its batch report and fills the Ceiling slot, acting on it never; the ledger gains three fixed Measurements rows and a Progress clause for a standing deferral; the handover file gains a Deferred line; the batch prompt gains the notice the human may paste. Spec 3.2, 3.3, 5.3, 7.3 and 7.6." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 11: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 12: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 10
```

Expected: `task 10: verify clean`.

**Done when:** the six passages are present in the four files,
`grep -cF 'deferrals: where, the role, the context, and the presence verdict' skills/tanto/templates/kanri.md`
prints `1`, the Measurements table has seven data rows, O10.1's needle returns
`0`, lint is clean, and the commit carries its `Co-Authored-By:` trailer.

---

### Task 11: `SKILL.md` — the exit line has two forms

**Batch:** D. **Blocks:** A11.1, O11.1, P11.1.

One passage, in "Session exit", and it is the contract half of section 6: the
`exit:` line for Jisso, a Kaiseki and Kanri's own exit; the report line carrying
`; exit proposal: <path>` for a Sekkei or Keikaku **at its own final boundary**;
and the sentence saying that the timing moves and nothing else does. Spec 6.3's
last paragraph, and spec 7.1's third bullet.

**Nothing about the four steps changes.** The proposal is written in either
flow, the recommender runs once over it, the human's check is on the
recommendation, and the apply is a subagent's. What the new timing buys is the
gap: a seat whose only remaining act was its own exit used to idle across the
one-hour prompt-cache TTL waiting for a line that asked for it, and paid a cold
read to answer (issue-19d4). The passage states that as the reason, in one
sentence, because a reader who does not know it will read the two forms as an
inconsistency.

**The `exit:` line is kept, not removed**, and the passage says for whom. A
Sekkei or Keikaku exited away from its final boundary — a compaction in its
reading, a replacement from the Replace table, the human not wanting the plan
now — takes the line like every other role, which is why `roles/sekkei.md` and
`roles/keikaku.md` keep their own description of answering it (task 12).

**Files:**

- Modify: `skills/tanto/SKILL.md` — the first seven lines of the paragraph that
  begins "The lines, each sent without an idle subscription". Tasks 4 and 5
  edited other sections of this file and task 13 edits one Artifacts row;
  none of them touches these lines.

**Interfaces:**

- Consumes, from nothing: this passage introduces the two report-line shapes,
  and tasks 12 and 13 quote them back.
- Produces, for task 12: the exact line shapes
  `spec accepted: <spec path>; exit proposal: <path> — <reading>` and
  `coldread answered: <pointer, one per question, or none>; exit proposal: <path> — <reading>`,
  which `roles/sekkei.md` and `roles/keikaku.md` must spell identically.
- Produces, for task 13: the phrase "at its own final boundary", which Kanri's
  Exit shoroku step 1 and the Delete table both turn on.
- markdownlint runs on this file.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/SKILL.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The old value this task contradicts**

**O11.1** `writes the proposal, runs the resume self-check, and answers` — `skills/tanto/SKILL.md` 1 → 0 at P11.1. The sentence survives in substance and is rewrapped around the clause naming whom the `exit:` line goes to, so this needle spans the change point exactly: the words stay, the line they sat on does not.

The spec's fifth old value, `exit: propose your shoroku; write it to <path>`,
is deliberately **not** an `O` block anywhere in this plan. It stands at six
sites today and at four after batch D — `SKILL.md`, `roles/jisso.md`,
`roles/kaiseki.md` and `roles/kanri.md` all keep it for the exits that are not
a Sekkei's or a Keikaku's own final boundary — so it is not an old value that
must be gone; and because this plan's own new text re-states it,
`passage-check lint` would reject it as `needle-in-new-text`. O12.2 and O12.4
in task 12 take the two sites that actually lose it.

- [ ] **Step 3: The anchor and the two forms**

**A11.1** `skills/tanto/SKILL.md` — `grep -cF 'line is sent: that seat writes the proposal' skills/tanto/SKILL.md` — before: 0, after: 1

The needle avoids the backticks around `exit:` on that line on purpose: an
anchor's command is itself written inside backticks, so a command containing one
is not a lead the grammar recognizes.

**P11.1** `skills/tanto/SKILL.md` — replace exactly these 7 lines

```text
The lines, each sent without an idle subscription, like every other tanto line.
Kanri sends `exit: propose your shoroku; write it to <path>`; the session
writes the proposal, runs the resume self-check, and answers
`exit proposal: <path> — <reading>`. Kanri checks that the file exists and
opens with the exclusion line and a numbered list — a direct read, since the
proposal carries no headings for `sections` to select by — and
dispatches the recommender at once. When the recommendation is on
```

**P11.1 →**

```text
The lines, each sent without an idle subscription, like every other tanto line,
and in one of two forms. For Jisso, a Kaiseki, and Kanri's own exit, Kanri
sends `exit: propose your shoroku; write it to <path>`; the session writes the
proposal, runs the resume self-check, and answers
`exit proposal: <path> — <reading>`. For a **Sekkei or a Keikaku at its own
final boundary**, no `exit:` line is sent: that seat writes the proposal
unasked as the last act of the boundary and names it in the same report line —
`spec accepted: <spec path>; exit proposal: <path> — <reading>` for Sekkei,
`coldread answered: <pointer, one per question, or none>; exit proposal: <path> — <reading>`
for Keikaku — and then idles. Only the timing moves: the proposal is written
in either flow, the recommender runs once over it, the human's check is on the
recommendation, and the apply is a subagent's. What the move buys is the gap —
a seat whose only remaining act is its own exit no longer waits across the
one-hour prompt-cache TTL for a line that asks for it, and pays no cold read to
answer (issue-19d4). An exit that falls **away** from that boundary — a
compaction in the reading, a replacement, the human not wanting the plan now —
takes the `exit:` line like every other role.
Kanri checks that the file exists and
opens with the exclusion line and a numbered list — a direct read, since the
proposal carries no headings for `sections` to select by — and
dispatches the recommender at once. When the recommendation is on
```

- [ ] **Step 4: Lint**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
```

Expected: exit 0, none `Failed`.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/tanto/SKILL.md -m "docs(tanto): the exit line has two forms" -m "Jisso, a Kaiseki and Kanri take the exit: line; a Sekkei or Keikaku at its own final boundary writes the proposal unasked and names it in its report line, and no exit: is sent there. Only the timing moves, and the one-hour cache TTL is why. Spec 6.3 and 7.1; issue-19d4." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 6: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 7: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 11
```

Expected: `task 11: verify clean`.

**Done when:** P11.1 is present, O11.1's needle returns `0`, the `exit:` line
itself still stands in `SKILL.md`, lint is clean, and the commit carries its
`Co-Authored-By:` trailer.

---

### Task 12: `roles/sekkei.md` and `roles/keikaku.md` — the proposal written unasked

**Batch:** D. **Blocks:** A12.1, O12.1, O12.2, O12.3, O12.4, P12.1, P12.2, P12.3, P12.4.

The two seats that can see their own final boundary. Sekkei's is the moment the
human's answers are in `dialogue.md` and the asked-for edits are committed;
Keikaku's is the moment it has answered the cold read. Each writes its exit
proposal there, unasked, and names it in the same line. Spec 6.1, 6.2, 6.4 and
7.4.

**Keikaku's cold read changes shape, and that is a real departure from the
input's words.** I-2 put the exit clause on `plan committed:` "once the cold
read is answered" — two moments that are one line apart in the words and a
dispatch apart in the run. This plan follows the spec: the clause rides on a new
`coldread answered:` line, and Kanri's questions arrive as **one numbered
message** rather than one line per question, because Keikaku cannot otherwise
know which per-question line is the last. **This is the second of the two points
the spec's brief puts to the human.** If the human prefers the input's words,
the alternative is written in spec 6.2 and costs one site fewer here and one
extra recommender run whenever the cold read finds anything: the clause rides on
`plan committed:`, the per-question lines stay, and every cold-read edit is
answered with an incremental `exit-keikaku-2` proposal.

**The incremental proposal is the general answer to late work** (spec 6.4), and
both bullets carry it: a second file holding only the delta since the first,
named in the line that reports the work, and never a rewrite of a proposal
already named, because the recommender may already have read it.

**Files:**

- Modify: `skills/tanto/roles/sekkei.md` — the "Your tenure ends here"
  paragraph and the "Your exit shoroku" bullet.
- Modify: `skills/tanto/roles/keikaku.md` — the Handoff section and the "Your
  exit shoroku" bullet.

**Interfaces:**

- Consumes, from task 11: both report-line shapes, spelled here identically.
- Produces, for task 13: the `coldread answered:` line Kanri waits for, and the
  `coldread: none` form Kanri sends when the cold read found nothing.
- The `plan committed:` line in `roles/keikaku.md` is **unchanged**, and so is
  Kanri's reading of it: the cold read has not run when it is sent, and the
  human may still not want the plan.
- markdownlint runs on both files.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md
```

Expected: `i/lf w/crlf attr/text=auto` on both, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O12.1** `edits they asked for are committed — or in the draft — send Kanri` — `skills/tanto/roles/sekkei.md` 1 → 0 at P12.1. The line that sent `spec accepted:` and then waited for an `exit:`.

**O12.2** `Before the human deletes you, Kanri sends` — `skills/tanto/roles/sekkei.md` 1 → 0 at P12.2. Sekkei's own statement that the `exit:` line opens its shoroku.

**O12.3** `sends you its questions, one line each` — `skills/tanto/roles/keikaku.md` 1 → 0 at P12.3.

**O12.4** `at the plan's landing, once` — `skills/tanto/roles/keikaku.md` 1 → 0 at P12.4. Keikaku's own statement of when the `exit:` line arrives.

- [ ] **Step 3: The anchor and Sekkei's tenure**

**A12.1** `skills/tanto/roles/sekkei.md` — `grep -cF 'exit proposal: <path> — <reading>' skills/tanto/roles/sekkei.md` — before: 1, after: 2

One occurrence today, in the sentence that answers Kanri's `exit:` line; two
after this task, because the clause now also rides inside the `spec accepted:`
line of P12.1 while the `exit:` answer survives in P12.2 for an exit that falls
away from the final boundary. A count of `1` after this task would mean one of
the two cases was dropped, which is the failure this anchor exists to catch.

**P12.1** `skills/tanto/roles/sekkei.md` — replace exactly these 4 lines

```text
Your tenure ends here. When the human's answers are in `dialogue.md` and the
edits they asked for are committed — or in the draft — send Kanri
`spec accepted: <spec path> — <reading>`. Kanri answers with `exit:`, and the
plan is Keikaku's from then on.
```

**P12.1 →**

```text
Your tenure ends here, and your exit shoroku is part of it. When the human's
answers are in `dialogue.md` and the edits they asked for are committed — or
are in the draft — write your exit proposal as the bullet below describes, run
the self-check of `SKILL.md`'s Resuming, and send Kanri **one** line naming
both: `spec accepted: <spec path>; exit proposal: <path> — <reading>`. Then
idle. Kanri sends you no `exit:` at this boundary; it dispatches the
recommender at once, and the
plan is Keikaku's from then on.
```

- [ ] **Step 4: Sekkei's exit shoroku bullet**

**P12.2** `skills/tanto/roles/sekkei.md` — replace exactly these 14 lines

```text
- **Your exit shoroku.** Before the human deletes you, Kanri sends
  `exit: propose your shoroku; write it to <path>`. Your candidates are the
  **delta**. T1 has not run when you exit, so the proposal's first line says
  what it excludes — the spec, the spec review, and the dialogue, which T1
  reads for itself — and the items are the dialogue's rejected alternatives
  with their reasons, the facts measured during the dialogue, the
  observations about the process, and the defects noticed. The stage word is
  `exit-sekkei`, no suffix, and the proposal goes to
  `.tanto/<topic>/exit-sekkei-proposal.md`. Run the self-check of
  `SKILL.md`'s Resuming, answer `exit proposal: <path> — <reading>`, and stop
  there: Kanri dispatches the recommender over your proposal, and once it is
  on disk and its recommendation written you are deleted. You write nothing
  under `docs/` — not at your exit, not ever. A subagent applies the accepted
  subset in Kanri's slot, and your judgment is already in the file.
```

**P12.2 →**

```text
- **Your exit shoroku.** You write it **unasked**, at your own final boundary,
  as the last act before the `spec accepted:` line above, and you name it in
  that same line.
  Your candidates are the
  **delta**. T1 has not run when you exit, so the proposal's first line says
  what it excludes — the spec, the spec review, and the dialogue, which T1
  reads for itself — and the items are the dialogue's rejected alternatives
  with their reasons, the facts measured during the dialogue, the
  observations about the process, and the defects noticed. The stage word is
  `exit-sekkei`, no suffix, and the proposal goes to
  `.tanto/<topic>/exit-sekkei-proposal.md`. Then stop
  there: Kanri dispatches the recommender over your proposal, and once it is
  on disk and its recommendation written you are deleted. If more work reaches
  you after that line — a cold-read question that changes the spec, a review
  answer that changes it — write a second proposal at
  `.tanto/<topic>/exit-sekkei-2-proposal.md` holding only the delta since the
  first, and name it in the line that reports the work; a proposal you have
  named is never rewritten, because the recommender may already have read it.
  An exit that falls away from this boundary — a compaction in your reading, a
  replacement — still arrives as Kanri's
  `exit: propose your shoroku; write it to <path>`, and you answer
  `exit proposal: <path> — <reading>` as any other role does. You write nothing
  under `docs/` — not at your exit, not ever. A subagent applies the accepted
  subset in Kanri's slot, and your judgment is already in the file.
```

- [ ] **Step 5: Keikaku's Handoff**

**P12.3** `skills/tanto/roles/keikaku.md` — replace exactly these 7 lines

````text
## Handoff

Kanri cold-reads the committed plan and sends you its questions, one line each.
Answer by **editing the plan or the spec** and sending back a pointer — never
by explaining in a message. The spec is on the branch and Sekkei is gone, so
both documents are yours to correct. What you knew and did not write down is
lost by design; that is what the cold read is for.
````

**P12.3 →**

````text
## Handoff

Kanri cold-reads the committed plan and sends you its questions as **one
message, numbered** — or the single line `coldread: none`.
Answer by **editing the plan or the spec** — never
by explaining in a message. The spec is on the branch and Sekkei is gone, so
both documents are yours to correct. What you knew and did not write down is
lost by design; that is what the cold read is for.

That message is your own final boundary, and it is the one boundary you can see
coming: one message in, one line back. So, after the edits, write your exit
proposal as the bullet below describes, run the self-check of `SKILL.md`'s
Resuming, and send **one** line carrying every pointer and the proposal:

```text
coldread answered: <pointer, one per question, or none>; exit proposal: <path> — <reading>
```

Then idle. Kanri sends you no `exit:` at this boundary. The `plan committed:`
line is unchanged and still carries no exit clause: the cold read has not run
when it is sent, and the human may still not want the plan.
````

- [ ] **Step 6: Keikaku's exit shoroku bullet**

**P12.4** `skills/tanto/roles/keikaku.md` — replace exactly these 15 lines

```text
- **Your exit shoroku.** Kanri sends
  `exit: propose your shoroku; write it to <path>` at the plan's landing, once
  the cold read is answered — or earlier, when the human does not want the
  plan now. The stage word is `exit-keikaku`, no suffix, and the proposal goes
  to `.tanto/<topic>/exit-keikaku-proposal.md`. Your candidates are the
  **delta**: the first line says what the proposal excludes — the plan, the
  dry-run report, and the plan review, which are on disk for anyone to read —
  and the items are the plan dialogue's rejected alternatives with their
  reasons, the facts measured while drafting, the observations about the
  process, and the defects noticed. Run the self-check of `SKILL.md`'s
  Resuming, answer `exit proposal: <path> — <reading>`, and stop there: Kanri
  dispatches the recommender over your proposal, and once it is on disk and
  its recommendation written you are deleted. You write nothing under `docs/`
  — not at your exit, not ever. A subagent applies the accepted subset in
  Kanri's slot, and your judgment is already in the file.
```

**P12.4 →**

```text
- **Your exit shoroku.** You write it **unasked**, after the cold-read edits
  and before the `coldread answered:` line above, and you name it in that same
  line. The stage word is `exit-keikaku`, no suffix, and the proposal goes
  to `.tanto/<topic>/exit-keikaku-proposal.md`. Your candidates are the
  **delta**: the first line says what the proposal excludes — the plan, the
  dry-run report, and the plan review, which are on disk for anyone to read —
  and the items are the plan dialogue's rejected alternatives with their
  reasons, the facts measured while drafting, the observations about the
  process, and the defects noticed. Then stop there: Kanri
  dispatches the recommender over your proposal, and once it is on disk and
  its recommendation written you are deleted. Work that reaches you after that
  line — a report that conflicts with the plan, a second cold-read question —
  is answered with a second proposal at
  `.tanto/<topic>/exit-keikaku-2-proposal.md` holding only the delta since the
  first, named in the line that reports the work; a proposal you have named is
  never rewritten, because the recommender may already have read it. When the
  human does not want the plan now, your exit falls away from this boundary
  and Kanri sends `exit: propose your shoroku; write it to <path>` as it does
  for every other role; answer `exit proposal: <path> — <reading>` then.
  You write nothing under `docs/`
  — not at your exit, not ever. A subagent applies the accepted subset in
  Kanri's slot, and your judgment is already in the file.
```

- [ ] **Step 7: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md
```

Expected: exit 0, none `Failed`.

- [ ] **Step 8: Commit**

```bash
git commit --only skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md -m "docs(tanto): Sekkei and Keikaku write the exit proposal unasked" -m "Each writes it at its own final boundary and names it in the same report line — spec accepted: for Sekkei, a new coldread answered: for Keikaku, whose cold read now arrives as one numbered message. Both keep the exit: line for an exit that falls elsewhere, and both answer late work with an incremental second proposal. Spec 6.1, 6.2, 6.4 and 7.4." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 9: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 10: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 12
```

Expected: `task 12: verify clean`.

**Done when:** the four passages are present, A12.1's count has gone `1` → `2`, the
needles of O12.1 to O12.4 return `0`, lint is clean, and the commit carries its
`Co-Authored-By:` trailer.

---

### Task 13: Kanri's side of the exit proposal, and the share at the plan close

**Batch:** D. **Blocks:** A13.1, O13.1, O13.2, O13.3, O13.4, P13.1, P13.2, P13.3, P13.4, P13.5, P13.6, P13.7.

The last of batch D, and the largest task of the plan by passage count. Seven
passages across two files: the cold read becomes one numbered message and Kanri
takes Keikaku's proposal path from the reply; Exit shoroku step 1 names the two
roles that are the exception at one boundary each; loop step 6's `exit:` clause
is narrowed; the Delete table's Sekkei and Keikaku rows turn on the named
proposal; the Delete table's plan-close row gains the `--share` run, placed
before the archive move; the handover file's Live peers paragraph says what a
successor owes a seat that has already named its proposal; and `SKILL.md`'s
Artifacts row for `coldread.md` stops saying one line per question. Spec 5.1,
6.3, and spec 7.2's eighth and ninth bullets.

**The `--share` run goes before the archive move, and that ordering is the
whole reason the plan-close row is touched.** The move drops the Transcript
column, and the share is computed over exactly those paths (spec 5.1, and the
spec review's F-3 and F-22). The row also fixes the session list: the sessions
**of this topic** — every handshake the ledger's Session events accepted for it,
and every Kanri whose tenure overlapped it — and not Kikaku's, not Hosa's, not
another plan's rows in a shared roster, and not a refused handshake, which has
no row and no transcript.

**One passage here shares its old text with task 9's.** P13.3's three old
lines are the last three lines of *both* P9.1's old block and P9.1's new
block — task 9 does not touch them — so they occur, unchanged, in the live
file today, before batch C lands. The order still matters, for the opposite
reason a shared old block might suggest: applying task 13 before task 9 would
still find P13.3's own three lines, but it would leave P9.1's own nine-line
old block one line short of what it expects once P13.3's replacement has run,
so task 9 would then fail to find its own passage. Apply the plan in order,
which `verify` and `replay` both assume.

**Spec 6.3's last bullet names two sites — "'The five cases' and the
Handover's 'Live peers'" — and this task lands one.** P13.6 writes the
sentence into the handover file's Live peers paragraph (`roles/kanri.md`).
"The five cases" (the section above Live peers) states each case's
procedure once, and a successor Kanri reads the handover file before it acts
on any of them, so the rule reaches every case through the one site a
successor actually reads first; a second copy in "The five cases" itself
would be the same sentence twice for no reader who is not already reading the
handover file. Declared here rather than landed, since the spec's own
argument for a second site is not stated and this plan's own reading finds
none.

**One site the spec's section 7 does not name, added here on the same
reasoning**: `SKILL.md`'s Artifacts table row for `.tanto/<topic>/coldread.md`
ends with "Kanri sends Keikaku one line per question", which is the sixth old
value's content in a table cell. Leaving it would make the contract's own table
contradict the contract's own Handoff protocol.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — six passages: "When the plan lands"
  step 1, "Exit shoroku" step 1, the batch loop's step 6 as task 9 left it, the
  Delete table's Sekkei and Keikaku rows, the Delete table's plan-close row,
  and the last two lines of the handover file's Live peers paragraph as task 9
  left it.
- Modify: `skills/tanto/SKILL.md` — one passage, the Artifacts table's
  `coldread.md` row.

**Interfaces:**

- Consumes, from task 11: "at its own final boundary", and the two report-line
  shapes.
- Consumes, from task 12: `coldread answered:` and `coldread: none`.
- Consumes, from task 9: the exact text of P9.1's new middle three lines, and
  the exact last two lines of P9.3's new text.
- Consumes, from task 3: the `--share` form and its output line.
- Consumes, from task 10: the Measurements share row this close fills.
- markdownlint runs on both files.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kanri.md skills/tanto/SKILL.md
```

Expected: `i/lf w/crlf attr/text=auto` on both, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O13.1** `send Keikaku one line per question, and wait for its` — `skills/tanto/roles/kanri.md` 1 → 0 at P13.1.

**O13.2** `Kanri sends Keikaku one line per question` — `skills/tanto/SKILL.md` 1 → 0 at P13.7. The same old value in the Artifacts table, which spec 7.1 does not list and which would otherwise contradict the protocol this batch lands.

**O13.3** `the spec review is accepted and the human's answers to the spec brief are in` — `skills/tanto/roles/kanri.md` 1 → 0 at P13.4. The Delete table's Sekkei condition, which now also requires that the `spec accepted:` line named the proposal.

**O13.4** `the plan has landed and the cold read is answered, or the human does not want the` — `skills/tanto/roles/kanri.md` 1 → 0 at P13.4. The Keikaku condition, for the same reason.

Kanri's loop step 6 and its Exit shoroku step 1 carry no `O` needle of their
own, and the reason is the grammar rather than an oversight: both keep the
literal `exit:` line, so every needle that spans their change point also appears
in this plan's own new text, which `passage-check lint` rejects. A13.1 is the
check for both.

- [ ] **Step 3: The anchor and the cold read as one message**

**A13.1** `skills/tanto/roles/kanri.md` — `grep -cF 'to the sessions whose proposal is not' skills/tanto/roles/kanri.md` — before: 0, after: 1

**P13.1** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
   file by `sections`, send Keikaku one line per question, and wait for its
   pointer: it answers by editing the plan or the spec, never by explaining in
   a message — the spec is on the branch and Sekkei is gone. If the plan
```

**P13.1 →**

```text
   file by `sections`, send Keikaku **one message** carrying every question,
   numbered, or the single line `coldread: none`, and wait for its answer:

   `coldread answered: <pointer, one per question, or none>; exit proposal: <path> — <reading>`

   It answers by editing the plan or the spec, never by explaining in
   a message — the spec is on the branch and Sekkei is gone. Check each
   pointer against the tree as you check any pointer, and take Keikaku's exit
   proposal path from that same line — it wrote the proposal unasked, and no
   `exit:` goes to it at this boundary. If the plan
```

- [ ] **Step 4: Exit shoroku step 1 names the exception**

**P13.2** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```text
1. At the boundary where the exit falls, send that session
   `exit: propose your shoroku; write it to <path>`, without an idle
   subscription, as with every other line you send. The path is
   `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`. The session writes it,
   runs its resume self-check, and answers
   `exit proposal: <path> — <reading>`.
```

**P13.2 →**

```text
1. At the boundary where the exit falls, send that session
   `exit: propose your shoroku; write it to <path>`, without an idle
   subscription, as with every other line you send. The path is
   `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`. The session writes it,
   runs its resume self-check, and answers
   `exit proposal: <path> — <reading>`. **Two roles are the exception, at one
   boundary each**: a Sekkei at its own final boundary names its proposal in
   its `spec accepted:` line, and a Keikaku at its own names it in its
   `coldread answered:` line, both unasked and both without being sent
   anything — for those two, skip this step and go to step 2, whose form check
   and recommender dispatch follow at once. Every other exit takes the line,
   this pair included whenever the exit falls elsewhere: a compaction in the
   reading (decision-6dea), a replacement from the Replace table, or the human
   not wanting the plan now.
```

- [ ] **Step 5: Loop step 6's `exit:` lines, as task 9 left them**

**P13.3** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
   shoroku" now: send the `exit:` lines, check each proposal and dispatch its
   recommender, and write the direction once the human has answered. Delete
   requests wait for step 7.
```

**P13.3 →**

```text
   shoroku" now: send the `exit:` lines to the sessions whose proposal is not
   already named — a Sekkei or Keikaku at its own final boundary named it in
   its report line and is waiting for nothing — check each proposal and
   dispatch its
   recommender, and write the direction once the human has answered. Delete
   requests wait for step 7.
```

- [ ] **Step 6: The Delete table's two rows**

**P13.4** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
| the spec review is accepted and the human's answers to the spec brief are in `dialogue.md` | Sekkei is done; ask for its deletion once the recommendation over its exit proposal is on disk — a Sekkei is never kept for the next topic: the next spec needs the human's dialogue whether the session is old or new, what it carries is on disk and in the spec inputs, and its context would be re-read at every wake-up of the new topic |
| the plan has landed and the cold read is answered, or the human does not want the plan now | Keikaku is done; ask for its deletion once the recommendation over its exit proposal is on disk; a Keikaku is never reused across topics (decision-f496) |
```

**P13.4 →**

```text
| the spec review is accepted, the human's answers to the spec brief are in `dialogue.md`, and the `spec accepted:` line named the exit proposal | Sekkei is done; ask for its deletion once the recommendation over its exit proposal is on disk — a Sekkei is never kept for the next topic: the next spec needs the human's dialogue whether the session is old or new, what it carries is on disk and in the spec inputs, and its context would be re-read at every wake-up of the new topic |
| the `coldread answered:` line named the exit proposal, or the human does not want the plan now and the `exit:` line was answered | Keikaku is done; ask for its deletion once the recommendation over its exit proposal is on disk; a Keikaku is never reused across topics (decision-f496) |
```

- [ ] **Step 7: The plan close runs the share before the archive move**

**P13.5** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
| Jisso is deleted and the ledger's Progress line says closed | this plan is closed; mark `dead` the rows of the sessions deleted at this close, move the dead, replaced, and refused rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet, fill the ledger's Measurements fixed row, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |
```

**P13.5 →**

```text
| Jisso is deleted and the ledger's Progress line says closed | this plan is closed. **First, while every row still carries its Transcript column**, run `node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]` over the sessions of **this topic**: every handshake the ledger's Session events accepted for it — Sekkei, Keikaku, Jisso, an attached Kaiseki — and every Kanri whose tenure overlapped it, the current one and any predecessor the Events' handover lines name, each path taken from its roster or archive row. A refused handshake has no row and no transcript and is not in the list; rows of another plan that a shared roster still holds, and Kikaku's and Hosa's, whose Topic is `—`, are not of this topic and are left out. A path that is denied, `unavailable`, or on another host is skipped and named by the script, and is never read by asking the peer. Record the share line, the sessions it ran over, and the ones it skipped in the Measurements share row; the target is 30% or less. Then ask the human, in one line and in the chat's language, for the Account & Usage view's own figure for the day, and record it beside the proxy — the two are compared, not equated, since that view counts every other workspace and every subagent — and a silence is an answer and a blank. Then mark `dead` the rows of the sessions deleted at this close, move the dead, replaced, and refused rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet, fill the ledger's Measurements fixed rows, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |
```

- [ ] **Step 8: What a successor owes a seat that has already named its proposal**

**P13.6** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
all of them, and each answers by re-sending its last unanswered line.
```

**P13.6 →**

```text
all of them, and each answers by re-sending its last unanswered line. A Sekkei
or Keikaku whose last line named an exit proposal is waiting for nothing but
its deletion, and your successor's first act for it is the recommender
dispatch, if the recommendation is not already on disk.
```

- [ ] **Step 9: The Artifacts row for the cold read**

**P13.7** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
| `.tanto/<topic>/coldread.md` | the `plan.coldread` subagent Kanri dispatches | Kanri, by `sections` | the cold read of the committed plan: a numbered list of open questions, or `none`; Kanri sends Keikaku one line per question |
```

**P13.7 →**

```text
| `.tanto/<topic>/coldread.md` | the `plan.coldread` subagent Kanri dispatches | Kanri, by `sections` | the cold read of the committed plan: a numbered list of open questions, or `none`; Kanri sends Keikaku one numbered message carrying all of them, or `coldread: none`, and Keikaku answers with one `coldread answered:` line |
```

- [ ] **Step 10: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md skills/tanto/SKILL.md
```

Expected: exit 0, none `Failed`.

- [ ] **Step 11: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md skills/tanto/SKILL.md -m "docs(tanto): Kanri's side of the unasked exit proposal, and the share at the close" -m "The cold read goes to Keikaku as one numbered message and its answer carries the exit proposal's path; Exit shoroku step 1 and loop step 6 skip the exit: line for the two roles that named theirs; the Delete rows turn on the named proposal; and the plan close runs reading.js --share over this topic's sessions before the archive move drops their transcript paths, then asks the human for the Account & Usage figure. Spec 5.1, 6.3 and 7.2." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 12: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 13: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 13
```

Expected: `task 13: verify clean`.

**Done when:** the seven passages are present,
`grep -cF 'to the sessions whose proposal is not' skills/tanto/roles/kanri.md`
prints `1`, the needles of O13.1 to O13.4 return `0`, lint is clean, and the
commit carries its `Co-Authored-By:` trailer.

---

### Task 14: the last reading pointer, and the README's drift review

**Batch:** E. **Blocks:** A14.1, O14.1, O14.2, P14.1, P14.2, P14.3, P14.4.

The sweep across the role files that only measure, and the file a newcomer
reads. `roles/kaiseki.md` is the only one of the three that carries a reading
pointer at all — `roles/kikaku.md` and `roles/hosa.md` carry none, Kikaku
because it sends no reading and Hosa because its boundary reply names the
reading without pointing at how to take it — so this task touches one role file
and not three (spec 7.5, and the spec review's F-6 and F-12). Then the README,
reviewed for drift after `SKILL.md` changed, which this repository's `AGENTS.md`
requires of every skill edit. Spec 7.8.

**The Prerequisites bullet on Node is the one real change of standing in the
README.** "Only a plan that carries passages needs it" was true while
`passage-check.js` was the single executable; every role now runs `reading.js`
at every boundary and every exit, so `node` is no longer optional, and the
bullet says what a session without it does instead — the `unavailable` form,
and carry on (spec 1.7, and the spec review's F-21).

**Files:**

- Modify: `skills/tanto/roles/kaiseki.md` — the "Tree state on exit" bullet.
- Modify: `skills/tanto/README.md` — the reading bullet under "What it does",
  the Node bullet under Prerequisites, and the scripts entry under Layout.

**Interfaces:**

- Consumes, from tasks 3, 4 and 5: the command form, the five figures, and the
  sentence that the ceiling's subjects are Kanri and Jisso alone.
- Produces, for task 15: `scripts/reading.js` and `scripts/reading.test.js` as
  literal strings in `README.md`, which the consistency note's check 2 sweeps
  out of this file and check 16 counts.
- markdownlint runs on both files.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kaiseki.md skills/tanto/README.md
```

Expected: `i/lf w/crlf attr/text=auto` on both, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O14.1** `records, wake-ups, compactions — and sends that reading` — `skills/tanto/README.md` 1 → 0 at P14.2. The four-figure list in the file a newcomer reads first.

**O14.2** `Only a plan` — `skills/tanto/README.md` 1 → 0 at P14.3. The Node bullet's claim that only a plan with passages needs `node`.

- [ ] **Step 3: Kaiseki's reading pointer**

**P14.1** `skills/tanto/roles/kaiseki.md` — replace exactly these 4 lines

```text
- **Tree state on exit.** Name the WIP commit by its subject, say whether
  instrumentation was removed, confirm `git status` is clean, and take your own
  reading (`SKILL.md`, "The transcript reading") into the section's
  `- Transcript — <reading>` line.
```

**P14.1 →**

```text
- **Tree state on exit.** Name the WIP commit by its subject, say whether
  instrumentation was removed, confirm `git status` is clean, and take your own
  reading — `node "$TANTO/scripts/reading.js" "$T"`, both set in the same tool
  call, as `SKILL.md`'s "The transcript reading" says — into the section's
  `- Transcript — <reading>` line. You pass no `--role`: the ceiling replaces
  Kanri and Jisso only, and every other role measures the five figures, sends
  them, and is replaced on none of them.
```

- [ ] **Step 4: The anchor and the README's reading bullet**

**A14.1** `skills/tanto/README.md` — `grep -cF 'scripts/reading.test.js' skills/tanto/README.md` — before: 0, after: 1

**P14.2** `skills/tanto/README.md` — replace exactly these 4 lines

```text
  Every session also measures its own context from its own transcript — bytes,
  records, wake-ups, compactions — and sends that reading with the lines it
  already sends, so the roster holds what the current run costs and its archive
  holds what earlier runs cost.
```

**P14.2 →**

```text
  Every session also measures its own context from its own transcript — bytes,
  records, wake-ups, compactions, and the turn's context in tokens — and sends
  that reading with the lines it
  already sends, so the roster holds what the current run costs and its archive
  holds what earlier runs cost.
- Holds **Kanri** and **Jisso** under a context ceiling derived from that last
  figure — each seat's own measured baseline plus a chosen number of batches of
  measured consumption — and hands the one over or replaces the other at the
  next boundary once it is crossed, but only while the human is there to create
  the successor; otherwise the crossing is recorded as deferred and the run
  continues to the plan close, which hands over in any case.
```

- [ ] **Step 5: The Node bullet**

**P14.3** `skills/tanto/README.md` — replace exactly these 4 lines

```text
- **Node 22 or newer on `PATH`**, for `scripts/passage-check.js`. Only a plan
  that carries passages needs it, and only at the moments that check such a
  plan; everything else in the skill is Markdown. Claude Code is itself a Node
  application, and the first-party skills assume `node` the same way.
```

**P14.3 →**

```text
- **Node 22 or newer on `PATH`**, for `scripts/passage-check.js` and
  `scripts/reading.js`. Every role runs the second at every boundary and every
  exit, so it is no longer needed only by a plan that carries passages; a
  session on which `node` will not run sends
  `transcript: unavailable — <one line why>` in place of its reading and
  carries on, which costs the run its cost signal and nothing else. Claude Code
  is itself a Node
  application, and the first-party skills assume `node` the same way.
```

- [ ] **Step 6: The Layout**

**P14.4** `skills/tanto/README.md` — replace exactly these 4 lines

```text
- `scripts/passage-check.js` — the instrument a plan that carries passages
  checks itself with: `lint`, `replay`, `diff`, `verify`, `sections`,
  `frame`, and `boundary`, with `scripts/passage-check.test.js` beside it.
  Node, no dependencies, invoked as `node <path>`.
```

**P14.4 →**

```text
- `scripts/passage-check.js` — the instrument a plan that carries passages
  checks itself with: `lint`, `replay`, `diff`, `verify`, `sections`,
  `frame`, and `boundary`, with `scripts/passage-check.test.js` beside it.
- `scripts/reading.js` — the instrument every role measures itself with: the
  five-figure reading of one transcript, with the ceiling, presence and
  backstop lines on request, and a `--share` form over several transcripts
  that Kanri runs at the plan close, with `scripts/reading.test.js` beside it.
- Both scripts are Node, no dependencies, invoked as `node <path>`.
```

- [ ] **Step 7: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kaiseki.md skills/tanto/README.md
```

Expected: exit 0, none `Failed`.

- [ ] **Step 8: Commit**

```bash
git commit --only skills/tanto/roles/kaiseki.md skills/tanto/README.md -m "docs(tanto): the last reading pointer, and the README after the drift review" -m "Kaiseki's exit section names reading.js and says why it passes no --role; the README's reading bullet names the fifth figure and the ceiling, the Node bullet stops calling node optional, and the Layout lists the second script and its tests. Spec 7.5 and 7.8." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 9: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 10: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 14
```

Expected: `task 14: verify clean`.

**Done when:** the four passages are present,
`grep -cF 'scripts/reading.test.js' skills/tanto/README.md` prints `1`, O14.1
and O14.2 return `0`, lint is clean, and the commit carries its
`Co-Authored-By:` trailer.

---

### Task 15: `docs/notes/tanto-consistency-checks.md` — the counts, check 16, check 17

**Batch:** E. **Blocks:** A15.1, O15.1, O15.2, O15.3, O15.4, P15.1, P15.2, P15.3, P15.4, P15.5, P15.6, P15.7.

The note's own rule for a plan that adds a script: the structural-count bullet,
check 1's path list and its expected count, and check 2's expected count all
move, "since a script is not a template". Check 6's two Residency-header
literals move with the templates task 6 changed. Check 16 grows to cover the
second script's usage line and the agreement between the contract's executables
paragraph and the README's Layout. And one check is added, check 17, sweeping
the reading's fifth figure into exactly the places that carry a reading. Spec
7.9.

**Every count below is stated as the command returns it, not as arithmetic
predicts it.** The note carries its own warning about this (issue-9d84): one
plan's stated expectation for check 2 went 15 → 17 on the reasoning "the plan
adds two files", when the value the check actually returns is 16, and the wrong
model survived a spec review, a dry run and an adjudication. The two figures
written into the passages below were produced by running the commands against
the tree on 2026-09-14 and adding the two files this plan creates: check 1 lists
**24 paths today and 26 after**; check 2 returns **22 `ok` lines today and 24
after**. Step 2 of task 16 runs both for real and stops the batch if either
disagrees.

**Check 17 does not count itself**, and that is the note's other standing trap:
a check written into the file it checks moves its own numbers. This one greps
`skills/tanto` and nothing under `docs/`, so its own text — which contains
`context=` five times — is outside its own sweep.

**Files:**

- Modify: `docs/notes/tanto-consistency-checks.md` — seven passages: the
  structural-count bullet, check 1's path list, check 1's expectation, check
  2's expectation, check 6's two Residency-header greps, check 16, and the
  insertion of check 17 at the end of the file.

**Interfaces:**

- Consumes, from tasks 2 and 3: the two created paths, spelled exactly as
  `git` records them.
- Consumes, from task 6: the Residency header row, which check 6's two literals
  must match byte for byte in both templates.
- Consumes, from tasks 5 and 14: `scripts/reading.js` as a literal string in
  `SKILL.md` and in `README.md`, which check 16's last command counts.
- Produces, for task 16: checks 1, 2, 6, 16 and 17 as the note now carries
  them, which task 16 runs out of this file rather than from a transcription.
- markdownlint runs on this file.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol docs/notes/tanto-consistency-checks.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O15.1** `Twenty-four skill files` — `docs/notes/tanto-consistency-checks.md` 1 → 0 at P15.1.

**O15.2** `all twenty-four paths` — `docs/notes/tanto-consistency-checks.md` 1 → 0 at P15.3.

**O15.3** `Expected: twenty-two` — `docs/notes/tanto-consistency-checks.md` 1 → 0 at P15.4. The needle stops before the backtick-quoted `ok`, because an `O` lead's needle is itself written inside backticks and cannot contain one.

**O15.4** `Seven role files, thirteen templates, two scripts` — `docs/notes/tanto-consistency-checks.md` 1 → 0 at P15.3.

O6.1's two remaining hits, the Residency header row in check 6's two grep
commands, go at P15.5. After this task the needle returns `0` everywhere.

- [ ] **Step 3: The structural-count bullet**

**P15.1** `docs/notes/tanto-consistency-checks.md` — replace exactly these 2 lines

```text
- **Twenty-four skill files, thirteen of them templates**, as check 1 lists
  them.
```

**P15.1 →**

```text
- **Twenty-six skill files, thirteen of them templates**, as check 1 lists
  them.
```

- [ ] **Step 4: Check 1's path list**

**P15.2** `docs/notes/tanto-consistency-checks.md` — replace exactly these 2 lines

```text
  skills/tanto/scripts/passage-check.js \
  skills/tanto/scripts/passage-check.test.js 2>&1
```

**P15.2 →**

```text
  skills/tanto/scripts/passage-check.js \
  skills/tanto/scripts/passage-check.test.js \
  skills/tanto/scripts/reading.js \
  skills/tanto/scripts/reading.test.js 2>&1
```

- [ ] **Step 5: Check 1's expectation**

**P15.3** `docs/notes/tanto-consistency-checks.md` — replace exactly these 3 lines

```text
Expected: all twenty-four paths listed, no `No such file or directory`.
Seven role files, thirteen templates, two scripts, the contract and the
skill's own `README.md`.
```

**P15.3 →**

```text
Expected: all twenty-six paths listed, no `No such file or directory`.
Seven role files, thirteen templates, four scripts, the contract and the
skill's own `README.md`.
```

- [ ] **Step 6: Check 2's expectation**

**P15.4** `docs/notes/tanto-consistency-checks.md` — replace exactly these 4 lines

```text
Expected: twenty-two `ok` lines — `roles/hosa.md`, `roles/jisso.md`,
`roles/kaiseki.md`, `roles/kanri.md`, `roles/keikaku.md`,
`roles/kikaku.md`, `roles/sekkei.md`, `scripts/passage-check.js`,
`scripts/passage-check.test.js`, `templates/agent.md`,
```

**P15.4 →**

```text
Expected: twenty-four `ok` lines — `roles/hosa.md`, `roles/jisso.md`,
`roles/kaiseki.md`, `roles/kanri.md`, `roles/keikaku.md`,
`roles/kikaku.md`, `roles/sekkei.md`, `scripts/passage-check.js`,
`scripts/passage-check.test.js`, `scripts/reading.js`,
`scripts/reading.test.js`, `templates/agent.md`,
```

- [ ] **Step 7: Check 6's two Residency-header literals**

**P15.5** `docs/notes/tanto-consistency-checks.md` — replace exactly these 2 lines

```text
grep -cF '| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |' skills/tanto/templates/roster.md
grep -cF '| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |' skills/tanto/templates/kanri-handover.md
```

**P15.5 →**

```text
grep -cF '| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |' skills/tanto/templates/roster.md
grep -cF '| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |' skills/tanto/templates/kanri-handover.md
```

Check 6's expected per-line counts do not move: each literal still occurs once
in each file, and it is the literal that changed, not the count. The two lines
are what hold `templates/roster.md`'s header and
`templates/kanri-handover.md`'s declared-verbatim copy of it together.

- [ ] **Step 8: Check 16 covers both scripts**

**P15.6** `docs/notes/tanto-consistency-checks.md` — replace exactly these 12 lines

````text
```bash
node skills/tanto/scripts/passage-check.js 2>&1 | head -n 1
node skills/tanto/scripts/passage-check.js 2>&1 | head -n 1 | grep -oE 'lint|replay|diff|verify|sections|frame|boundary' | sort -u | wc -l
```

Expected: the script's usage line, then `7`. The first line is read, not
matched: the wording belongs to the script, and a plan that rewords it is not
wrong for doing so. The second is the check. A subcommand the script
implements and the usage line omits is invisible to every reader who has only
the usage line, and a role that never learns of it keeps doing the work by
hand — which is the whole reason the three new ones were added. `sort -u`
before the count so a name the line spells twice is counted once.
````

**P15.6 →**

````text
```bash
node skills/tanto/scripts/passage-check.js 2>&1 | head -n 1
node skills/tanto/scripts/passage-check.js 2>&1 | head -n 1 | grep -oE 'lint|replay|diff|verify|sections|frame|boundary' | sort -u | wc -l
node skills/tanto/scripts/reading.js 2>&1 | head -n 1
node skills/tanto/scripts/reading.js 2>&1 | head -n 1 | grep -oE '\-\-role|\-\-presence|\-\-backstop|\-\-share|\-\-now|\-\-config|\-\-settings' | sort -u | wc -l
grep -cF 'scripts/reading.js' skills/tanto/SKILL.md skills/tanto/README.md
```

Expected: the first script's usage line, then `7`; the second script's usage
line, naming **both** its forms on that one line, then `7`; then one
`<path>:<n>` line per file with `<n>` at least `1`. The usage lines are read,
not
matched: the wording belongs to each script, and a plan that rewords one is not
wrong for doing so. The counts are the check. A subcommand or a switch the
script
implements and the usage line omits is invisible to every reader who has only
the usage line, and a role that never learns of it keeps doing the work by
hand — which is the whole reason the three new subcommands were added.
`sort -u`
before the count so a name the line spells twice is counted once. The last
command is the presence check between the contract's executables paragraph,
which must name both scripts, and the README's Layout, which must list both: a
zero on either side is the drift this check exists for. `reading.js` spells its
usage over one line for exactly this reason — a `head -n 1` that showed only
the first of two forms would pass while hiding half the interface.
````

- [ ] **Step 9: The anchor and check 17**

**A15.1** `docs/notes/tanto-consistency-checks.md` — `grep -cF '## 17. The reading' docs/notes/tanto-consistency-checks.md` — before: 0, after: 1

**P15.7** `docs/notes/tanto-consistency-checks.md` — insert after these 4 lines

````text
This check is numbered after the lessons above rather than beside checks 1 to
9 because the numbers here are cited by plans; renumbering a check would make
every earlier citation point at something else. A plan that schedules the
mechanical set schedules checks 1 to 9 and this one.
````

**P15.7 →**

````text

## 17. The reading's fifth figure is in every place a reading lands

```bash
grep -rc 'context=' skills/tanto/SKILL.md skills/tanto/roles/kanri.md \
  skills/tanto/roles/jisso.md skills/tanto/templates/batch-report.md \
  skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md \
  skills/tanto/templates/kanri-handover.md skills/tanto/templates/kanri.md
grep -rlF 'context=' skills/tanto | sort
```

Expected: a nonzero count on each of the eight files named, and a file list
that is those eight plus `skills/tanto/scripts/reading.js` and
`skills/tanto/scripts/reading.test.js`, and nothing else. The spelling
`context=` is the one the reading itself prints, which is why the sweep is for
that and not for the word "context": a template that gained a Context column
whose paragraph spells the figure another way is invisible to this check and to
the reader who greps for it. A file in the list that is not one of the ten is a
place a reading landed that no design names — report it rather than adding it
here.

This check does not count itself: its subject is `skills/tanto`, and this note
lives under `docs/`. That is deliberate, and it is the standing trap the
paragraph under "Versions these checks assume" describes — a check written into
the file it checks moves its own numbers, and its expected value is wrong the
moment it is written.
````

- [ ] **Step 10: Lint**

```bash
./scripts/lint.sh docs/notes/tanto-consistency-checks.md
```

Expected: exit 0, none `Failed`.

- [ ] **Step 11: Commit**

```bash
git commit --only docs/notes/tanto-consistency-checks.md -m "docs(notes): the counts this plan moves, check 16 widened, check 17 added" -m "Twenty-six skill files and four scripts in the structural bullet and check 1; twenty-four ok lines in check 2; check 6's two Residency-header literals gain the Context column; check 16 covers reading.js's usage line and the executables-paragraph-to-Layout agreement; check 17 sweeps context= across the skill. Counts stated as the commands return them, per issue-9d84. Spec 7.9." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 12: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 13: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 15
```

Expected: `task 15: verify clean`.

**Done when:** the seven passages are present,
`grep -cF '## 17. The reading' docs/notes/tanto-consistency-checks.md` prints
`1`, the needles of O15.1 to O15.4 and of O6.1 all return `0` across the tree,
lint is clean, and the commit carries its `Co-Authored-By:` trailer. The checks
themselves are **not** run here — task 16 runs them, because check 1 and check
2 only become true once every file this plan creates has landed.

---

### Task 16: the old-value sweep and the note's own checks

**Batch:** E. **Blocks:** none — this task cites every `O` block of this plan and writes no file.

**A sweep-and-check task.** Its deliverable is **recorded output**, not an edit:
it modifies nothing, and "it changed a tracked file" is its failure condition.
Dispatch it with the reviewer told to **re-run** the commands rather than read
the report, per the consistency note's check 14.

Two sweeps. The first is this plan's own thirty-one `O` needles, each run
against the whole tree and each expected at the disposition its block states.
The second is the note's mechanical set — checks 1 to 9 and 16, plus the new
check 17 — extracted from the note itself and piped to `bash`, never
transcribed, per the note's check 13: a copy is a second source that drifts from
the first the moment either is edited, and the drift is silent because both
still run.

**Every count is recorded as the command returned it.** Two of them are numbers
this plan predicted in task 15 and has not yet run against the finished tree —
check 1's twenty-six paths and check 2's twenty-four `ok` lines — and if either
comes back different, that is a stop and not a number to adjust in the note. The
note's own warning (issue-9d84) is about exactly this pair.

**Files:** none. This task writes nothing tracked.

#### Steps

- [ ] **Step 1: Sweep every old value this plan contradicts**

The thirty-one needles, with the disposition each block states: **O4.1**,
**O4.2**, **O4.3**, **O4.4**, **O4.5**, **O5.1**, **O5.2**, **O5.3**, **O6.1**,
**O6.2**, **O6.3**, **O7.1**, **O8.1**, **O8.2**, **O8.3**, **O10.1**,
**O11.1**, **O12.1**, **O12.2**, **O12.3**, **O12.4**, **O13.1**, **O13.2**,
**O13.3**, **O13.4**, **O14.1**, **O14.2**, **O15.1**, **O15.2**, **O15.3**,
**O15.4**. Every one of them is expected at **zero** across the whole sweep set;
this plan declares no needle that is allowed to survive.

```bash
fail=0; while IFS= read -r n; do c=$(grep -rcF -- "$n" skills/tanto docs/notes/tanto-consistency-checks.md 2>/dev/null | grep -v ':0$' | wc -l); printf '%s\t%s\n' "$c" "$n"; [ "$c" -eq 0 ] || fail=1; done < .tanto/tanto-context-ceiling/o-needles.txt; echo "files-with-hits total: $fail"; exit "$fail"
```

Expected: a `0` in the first column of all thirty-one lines, then
`files-with-hits total: 0`, at exit 0. Write the thirty-one needles, one per
line, to `.tanto/tanto-context-ceiling/o-needles.txt` first — that directory is
untracked under `.tanto/.gitignore`, so the list is working state and not a
second copy of the plan. Take each needle from its own `O` block in this plan by
`frame --task <N>`; do not retype it from memory, because a needle that is
mistyped returns `0` for the wrong reason. A nonzero first column names a file
this plan forgot: report the file and the line, and do not edit it here.

- [ ] **Step 2: Run the note's mechanical set out of the note itself**

```bash
awk '/^## (1|2|3|4|5|6|7|8|9|16|17)\. /,0' docs/notes/tanto-consistency-checks.md | awk '/^```bash$/{f=1;next} /^```$/{f=0;next} f' > /tmp/tanto-checks.sh && bash /tmp/tanto-checks.sh 2>&1 | tee /tmp/tanto-checks.out; echo "---"; wc -l < /tmp/tanto-checks.out
```

Expected: the output of every fenced `bash` block under checks 1 to 9, 16 and
17, in file order. Read it against each check's own stated expectation and
record the result of each in the batch report's Verification section, check by
check. The three this plan moved are the ones to read first: **check 1** must
list twenty-six paths with no `No such file or directory`, **check 2** must
return twenty-four `ok` lines and no `MISSING`, and **check 17** must show a
nonzero count on each of its eight files and a file list of exactly ten. **Check
6** must still return its stated per-line counts with the two Residency-header
literals task 15 rewrote. A count that differs from the note's expectation is
reported as a difference, never "fixed" by editing the note here.

- [ ] **Step 3: Confirm this task changed nothing**

```bash
git status --porcelain && echo "tree clean" && git diff --stat HEAD -- skills/ docs/ | tail -1
```

Expected: no output from `git status --porcelain`, then `tree clean`, then no
diff stat line. A tracked file changed by this task is this task's failure
condition, whatever the change was.

- [ ] **Step 4: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 16
```

Expected: `task 16: no passages` — this task carries no block at all, which
`verify` reports at exit 0.

**Done when:** all thirty-one needles returned zero files with hits, the note's
checks 1 to 9, 16 and 17 ran with their output recorded check by check in the
batch report, the two predicted counts came back as twenty-six and twenty-four,
and `git status --porcelain` is empty.

---

### Task 17: the dogfood report

**Batch:** E. **Blocks:** none — this task's deliverable is one report under `docs/reports/` and the measurements in it.

**A sweep-and-check task**, and the second of the two in this plan. It writes
one file, but that file's content is recorded output rather than designed text,
and nothing in the skill changes. It runs **last**, because what it measures is
this plan's own run. Spec 5.2 is its contract.

`docs/reports/<date>-tanto-context-ceiling-dogfood.md`, written per
`docs/reports/AGENTS.md` — a dated, frozen investigation, which is what a
dogfood is. Its added lines are `unaccounted-added` in `diff` at this boundary
by construction, because the plan cannot know the date in its name; File
structure states the rule that accepts them at this one path and nowhere else.

**This run's own Kanri and Jisso predate the instrument.** They read the skill as
it stood when the plan landed: they take the four-figure reading and the ceiling
rule does not bind them. So the figures below are gathered by **running the new
script on their transcripts** from the batch that lands it — batch A — onward,
which is how a run that predates its own instrument fills this table.

**Files:**

- Create: `docs/reports/<date>-tanto-context-ceiling-dogfood.md`, where
  `<date>` is the day it is written, in `YYYY-MM-DD`.

#### Steps

- [ ] **Step 1: Gather the per-batch figures**

```bash
TANTO=skills/tanto && for T in <kanri's transcript> <jisso's transcript>; do node "$TANTO/scripts/reading.js" "$T"; done
```

Expected: two reading lines — this run of the fence is the *last* one, at the
plan's close; the deltas are the point, and a transcript read only at the
close gives one number and no delta. The figures for the boundaries already
passed come from the ledger's Measurements per-boundary row, which Kanri has
been filling from batch A on, per "How a batch is verified"'s own hand-run
instrument commands — a Kanri directive this plan states directly, and so
binding on this run from A regardless of whether `roles/kanri.md`'s own text
carries it yet (Rule 11); the ones for boundaries before batch A come from the
four-figure readings in the roster's Residency rows, which carry no
`context=` and are recorded as absent rather than guessed.

- [ ] **Step 2: Ask the human for the one figure only the human can read**

Send Kanri one line: `human-needed: the Account & Usage view's share of the
day's usage at contexts over 150k, for the day this plan closed`. It is one
line at a checkpoint the human is already at — the plan close — and silence is
an answer: the report records a blank and says so. The target is 30% or less,
against 74% measured on 2026-09-14 and 89% on 2026-09-09.

- [ ] **Step 3: Write the report, with these five sections and no fewer**

The report **must** carry all five. A plan that runs under this skill and whose
dogfood omits section 1 has not run the dogfood.

1. **Per-batch consumption.** A table with one row per batch boundary of this
   run: batch letter, Kanri's `context=` at that boundary, Jisso's `context=`
   from its report, and each one's delta from the previous boundary. The first
   row is the two baselines. **Before batch A's row, two rows for Kanri alone**:
   its context at this topic's opening and at the plan's landing, so that the
   spec-and-plan-stage growth is a measured figure and not a gap. A boundary
   that follows a seat change — a Kanri handover, a Jisso replacement — records
   the successor's baseline in place of a delta, and the mean is taken over
   same-seat deltas only. The last line of the section states the mean delta
   per role over the batch rows, which is the measured `per_batch` for each,
   and the spec-and-plan-stage growth as its own figure.
2. **The ceiling as it ran.** The ceiling each of the two computed at its first
   check; every boundary's verdict; every presence verdict taken; every
   deferral, and the boundary at which the handover or the replacement ran, or
   the close arrived first.
3. **The share.** The proxy `reading.js --share` computed at the close, the
   Account & Usage figure if the human gave one, and the two side by side
   against 74%. Say which sessions the proxy ran over and which paths it
   skipped; the two figures are compared, not equated, since the account view
   counts every other workspace and every subagent, whose transcripts no roster
   names.
4. **The backstop line** Kanri's start printed, its verdict, and whether the
   human changed the window after the recommendation.
5. **What the harness listed.** Whether the sessions started during this run
   saw the twelve agent definitions, as the measurement discipline of
   issue-f2ec requires of every dogfood.

- [ ] **Step 4: Name the T2 candidate the measurement creates**

Section 1's two mean deltas are a T2 shoroku candidate, and the report's
recommendation names it: `templates/tanto.json`'s `ceiling.kanri.per_batch` and
`ceiling.jisso.per_batch` are corrected to the measured figures, rounded to the
nearest 5000, in a commit by explicit path. Jisso's default is Kanri's measured
figure today for want of a Jisso measurement, and this run is the first to
supply one.

- [ ] **Step 5: Lint and commit**

```bash
./scripts/lint.sh docs/reports/<date>-tanto-context-ceiling-dogfood.md && git add docs/reports/<date>-tanto-context-ceiling-dogfood.md && git commit --only docs/reports/<date>-tanto-context-ceiling-dogfood.md -m "docs(reports): the tanto-context-ceiling dogfood" -m "Per-batch consumption for Kanri and Jisso with the spec-and-plan-stage growth, the ceiling as it ran with every presence verdict and deferral, the share against 74%, the backstop line, and whether the harness listed the twelve definitions. Spec 5.2; issue-f2ec." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

Expected: lint exit 0, then one commit. `--only` cannot pick up an untracked
path, so the `git add` comes first.

- [ ] **Step 6: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-14-tanto-context-ceiling.md --task 17
```

Expected: `task 17: no passages`.

**Done when:** the report exists at `docs/reports/` with all five sections,
section 1's table has one row per boundary of this run plus the two Kanri-only
rows and states both mean deltas, the T2 candidate is named, lint is clean, and
the commit carries its `Co-Authored-By:` trailer.

---

## The T1 list, for Kanri

T1 runs after the plan lands, from the spec's own four sections, and no task of
this plan writes any of it. It is listed here so that the recommender and the
human see what is owed, and so that a reader of this plan does not mistake its
silence under `docs/requirements/`, `docs/decisions/`, `docs/issues/` and
`docs/design/` for an omission.

- **`req-04f5`**, four bullets, each the spec's own text copied and not
  reworded: the ceiling bullet amended with its last sentence kept; one
  sentence added to "A session's cost is measured, not guessed"; one sentence
  added to "A run is affordable to keep running"; and one clause added to "The
  human is interrupted only at defined checkpoints".
- **Two ADRs.** The first: the handover and the replacement fire on a derived
  context ceiling, gated on the human's presence, with the harness's
  auto-compact window as the backstop — amending decision-de63, decision-b6cb,
  decision-6dea for Kanri only, and decision-9a3a in one part, with the
  `amended_by` bookkeeping on all four (and on decision-03f9, which amends
  9a3a). The second: a Sekkei or Keikaku writes its exit proposal unasked at
  its final boundary — amending decision-d831 and decision-ce83 for those two
  roles only. The human decides at the review whether the second is an ADR or
  design.
- **Two issues closed**, each moved to `resolved/` with a resolution line
  naming the spec: **issue-40ed**, whose replacement half closes here for Jisso
  with the token instrument, the resolution line saying that the measuring
  roles' rows across runs remain the data for any later ceiling of theirs; and
  **issue-19d4**, closed by section 6 whole.
- **Four issues filed**, one per Deferred item: the role-file diet, named as a
  candidate for `tanto-sweep-2`; a ceiling for the measuring roles, to be read
  from the archive's Context column; a protocol hard ceiling, filed with the
  reason it was rejected at Q3; and presence read from more than Kanri's
  window.
- **`docs/design/4807-tanto.md`**, four sections that go stale and are rewritten
  to this spec's sections 2, 1, 3 and 6 respectively: the `tanto.json`
  paragraph ("Two maps and two mechanisms"), the reading paragraph ("the four
  figures of that session's latest reading"), the Handover section, and
  "Shoroku staging, session exits, and the adoption rule".

## The T2 candidate this plan creates

`templates/tanto.json`'s `ceiling.kanri.per_batch` and
`ceiling.jisso.per_batch` corrected to task 17's measured mean deltas, rounded
to the nearest 5000, in a commit by explicit path. Named here so that the T2
recommender sees it without reading the dogfood report whole.

## Self-Review

**Spec coverage.** Every section of the spec has a task. Sections 1.1 to 1.8 are
tasks 2 and 3; section 2 is tasks 1 and 5; section 3.1, 3.2 and 3.5 are task 8;
3.3 is tasks 9 and 10; 3.4 is tasks 6 and 14; section 4 is task 7's backstop;
5.1 is task 13's plan-close row; 5.2 is task 17; 5.3 is tasks 7, 9 and 10;
section 6.1 and 6.2 and 6.4 are task 12, 6.3 is tasks 11 and 13. Section 7's
change list maps one to one onto the File structure table, with two additions
this plan makes and the spec's section 7 does not name, both stated in the task
that makes them: `SKILL.md`'s Artifacts row for `coldread.md` (task 13), and the
consistency note's check 6, whose two Residency-header literals move with the
templates (task 15). Section 8's batch cut is followed exactly, A to E in order.
The "What the plan must contain" list is covered, including the three
sections Keikaku writes — Global Constraints, Batches, and How a batch is
verified — with one stated deviation: the spec's own "Verification" greps are
not fenced under How a batch is verified, because two of the three phrase
counts are not `0` until batch E and a `grep | wc -l` cannot fail under
`boundary` regardless of what it counts; they run instead as task 16's needle
sweep and the consistency note's checks 16 and 17, both declared in "How a
batch is verified" itself.

**Task sizes, re-measured after the plan review's fixes.** By raw line count
the two largest are still tasks 3 and 2, at **558 lines / 8 steps** and
**417 lines / 7 steps**, and almost all of that is the one `W` block each
carries — 419 and 284 lines of quoted file, one block and one decision apiece,
which is why they are not the largest by the measure a reviewer feels. By
that measure — passages to check and steps to run — **task 13 is now the
largest, at 277 lines and 13 steps with seven passages** (finding 7 and
finding 8's fixes added a full carrier-line quote and two paragraphs), tied on
passages and steps with **task 15, at 231 lines and 13 steps, also seven
passages**; then task 6 (279 lines, 12 steps, six passages), task 10 (241
lines, 12 steps, six passages), task 4 (292 lines, 11 steps, five passages),
and task 8 (289 lines, 10 steps, four passages). No task carries more than
seven passages, no passage replaces more than 21 lines, and the smallest
passage-carrying task is 1 at 124 lines — a single passage on a config file,
smaller than either sweep-and-check task (16 at 93 lines, 17 at 118). The
whole plan is 4907 lines.

**Two tasks are a sweep-and-check shape**, and both are in batch E:

- **Task 16** — the `O` sweep and the note's mechanical checks. Its deliverable
  is recorded output; it modifies nothing, and "it changed a tracked file" is
  its failure condition.
- **Task 17** — the dogfood. Its deliverable is recorded measurement; it writes
  one report under `docs/reports/` and changes nothing in the skill, and it
  runs last because what it measures is this plan's own run.

No other task has that shape: tasks 1 and 4 to 15 each land passages in a named
file, and tasks 2 and 3 each create one.

**Placeholder scan.** No task carries "TBD", "similar to task N", "add
appropriate error handling", or a step that says what to do without showing how.
Three values are deliberately written as angle-bracket placeholders and are
filled at run time rather than by this plan: `<your own transcript path>` in
task 3's step 3 and task 17's step 1, because the path is the running session's;
`<date>` in task 17, because the report is named for the day it is written; and
the transcript list in task 13's `--share` passage, because it is the roster's
at the close. Each is named in prose where it appears.

**Type consistency.** The line spellings are the plan's interface, and they were
checked across tasks: `context=<n>` in the reading, the roster's Context column,
the archive's, the handover's, and the Measurements rows; the `- Ceiling` slot's
`context=<n> <under|over>` ending in `templates/batch-report.md` (task 6), the
anchor A6.1, and `roles/jisso.md` (task 10)'s own prose; `spec accepted: <spec path>; exit proposal:
<path> — <reading>` in `SKILL.md` (task 11) and `roles/sekkei.md` (task 12);
`coldread answered: <pointer, one per question, or none>; exit proposal: <path>
— <reading>` in `SKILL.md` (task 11), `roles/keikaku.md` (task 12) and
`roles/kanri.md` (task 13); the two Progress clauses in `roles/kanri.md` (tasks
8 and 9) and `templates/kanri.md` (task 10); and the two batch-prompt notice
lines in `roles/kanri.md` (task 8, by reference) and `templates/batch-prompt.md`
(task 10, verbatim). The Residency header row is byte-identical in P6.2, P6.6
and P15.5.

**The plan was dry-run as it was written.** `passage-check.js lint` reports
`lint: clean`, and `replay --base <the branch head before task 1>` applies every
passage with no `occurrence-count` failure and no `anchor-after` failure, which
means every "before" block quoted here occurs exactly once in the live file and
every anchor returns the value its block states. The two `W` blocks were
compared line by line against the files they were written and tested from: 284
and 419 lines, zero differences.
