# tanto's second prose sweep and the shoroku check brief Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close twenty-nine issues in the `tanto` skill's prose. Twenty-eight of
them are inconsistencies — an enumeration stale at its second site, a rule whose
number no longer matches its restatements, a mechanism edited at one site and
not at the other four — and each is fixed as a passage. The twenty-ninth is the
one feature the human asked for: the **shoroku check brief**, a second file the
`shoroku` recommender writes beside the recommendation, already in the chat's
language, so that Kanri checks a form by `grep` and pastes it verbatim instead
of reading every recommendation whole.

**Architecture:** Five batches, cut by the **kind** of inconsistency rather than
by file (spec Fixed input 4). A string that must read the same in two files
lands in **one task**; a pair whose halves refer to each other without sharing
bytes lands in **one batch**. Every change is a passage: an old text quoted
exactly from this branch's tree and a new text that replaces it, an insertion
anchored on quoted lines, or a new file. Each block appears in this plan once,
carries an id, and is cited by that id wherever it is needed again. Batch A
lands the contract's rules and the enumerations; B all of Kanri's role file
except the shoroku steps; C the authoring and thinking seats; D the check brief,
which is the only batch that changes behavior; E the whole-tree old-value sweep
and the dogfood report.

**Tech Stack:** Markdown. `node "$TANTO/scripts/passage-check.js"` (Node 22 or
newer) for `lint`, `replay`, `diff`, `verify`, `frame` and `boundary`, with
`$TANTO` set to `skills/tanto` in the same call as the command; `node --test` on
the pinned Node 22 through `mise x node@22` for the untouched scripts;
`pre-commit` through `./scripts/lint.sh` (Windows: `scripts\lint.bat`);
`git diff` against the base, `git ls-files --eol`, and `grep -rn` / `grep -rcF`
for the sweeps. Every fenced block runs in **Git Bash**.

**Spec:** `docs/superpowers/specs/2026-09-15-tanto-sweep-2-design.md`

---

## File structure

Seventeen paths appear below; sixteen carry a block or are created, and the
seventeenth, `roles/hosa.md`, carries neither — see its own row. The table
says which task lands each and in which batch.

```text
created: skills/tanto/templates/shoroku-brief.md
created: docs/reports/2026-09-15-tanto-sweep-2-dogfood.md
```

| Path | Task | Batch | What changes |
| --- | --- | --- | --- |
| `skills/tanto/SKILL.md` | 1, 2, 10, 11 | A, D | rules 3 and 9, the dispatch paragraph, the dotless kind, the brief writer's seat; the status enumeration; the template count and list; "Session exit" whole, the Artifacts rows, the exit's `unsure` read |
| `skills/tanto/roles/sekkei.md` | 1, 7 | A, C | the cap; Step 1's dialogue rule, Step 2's reviewer, its third input, the hash sentences |
| `skills/tanto/roles/keikaku.md` | 1, 8 | A, C | the cap; the reviewer's seat, the dialogue rule, the hash sentences, two drafting conventions |
| `skills/tanto/roles/kikaku.md` | 1, 9 | A, C | the cap; the write scope, the model rule |
| `skills/tanto/templates/kanri.md` | 1, 2, 6 | A, B | the peak row's breach; the stage examples; the Progress line's pre-spec clause |
| `skills/tanto/roles/kanri.md` | 2, 4, 6, 9, 11 | A, B, C, D | the status enumeration and `continue:`; the commit window, the third shoroku dispatch, Hosa's two lines; the workspace listing, the dispatch tally, the pre-spec ruling; the baseline clause; the shoroku steps 2 and 3 and Exit shoroku step 3 |
| `skills/tanto/roles/jisso.md` | 2 | A | the opening line |
| `skills/tanto/templates/kanri-handover.md` | 2, 5 | A, B | the Models bullet's `subagent_type:` form; the unanswered mark moves to Live peers |
| `skills/tanto/templates/batch-prompt.md` | 2 | A | the Models bullet's `subagent_type:` form |
| `docs/notes/tanto-consistency-checks.md` | 3, 10, 12 | A, D | checks 20 and 21 appended; the four structural counts; checks 18 and 19 inserted before 20 |
| `skills/tanto/templates/review-brief.md` | 7 | C | the `Document:` line's hash slot |
| `skills/shoroku/SKILL.md` | 9, 10 | C, D | the baseline sentence; recommend mode's four changes |
| `skills/tanto/templates/shoroku-brief.md` | 10 | D | **created** — the check brief's English source |
| `skills/tanto/README.md` | 12 | D | the template list, and what else the drift review finds |
| `skills/shoroku/README.md` | 12 | D | the recommend sentence, and what else the drift review finds |
| `docs/reports/2026-09-15-tanto-sweep-2-dogfood.md` | 14 | E | **created** — the dogfood |
| `skills/tanto/roles/hosa.md` | — | E | none by design; the `O` sweep of task 13 covers it |

`skills/tanto/roles/kaiseki.md`, `skills/tanto/scripts/`, and
`skills/tanto/templates/tanto.json` do not change.

---

## Open points from the post-merge re-grep

Spec Fixed input 6 and section 9 require every old text to be re-quoted from the
merged tree. It was, file by file, before any block below was written. Six sites
the spec quotes from `tanto-context-ceiling`'s own replacement blocks were
re-read on the merged tree; **four read as the spec assumed and two do not.**
Neither miss was guessed at — both blocks below quote what the tree holds, and
both are named here so that Kanri can rule on the difference.

1. **Spec 6.7, `templates/kanri.md`'s Progress line (`tanto-context-ceiling`
   P10.2).** The spec assumes the placeholder ends
   `kept until that handover or replacement runs or the plan closes>`. On the
   merged tree the placeholder runs three lines further, through the
   `handover declined (present, …)` clause, and ends `place>`. P6.4 therefore
   appends the pre-spec clause at the **end of the whole placeholder**, which is
   where the spec's sentence belongs, rather than mid-placeholder where the
   spec's quotation would have put it. The sentence's text is the spec's,
   unchanged.
2. **Spec 6.7's companion sentence in `roles/kanri.md`.**
   `grep -n 'pre-spec' skills/tanto/roles/kanri.md` returns nothing, which the
   spec anticipated: the spec names no single paragraph by fixed text (no
   "Rulings paragraph of 'When the plan lands'" exists under that name on this
   tree), only the section "When the plan lands" as the right neighborhood,
   because a pre-spec act is ruled **before** Sekkei's spec and that section is
   later than that. P6.3 anchors on that section's own rule-11 ruling sentence
   (`roles/kanri.md`, where rulings-at-landing are written already) — a
   defensible reading, not the spec's own literal words. Whether the site is
   right is Kanri's to rule.

Two further differences of wrapping, recorded because they change what a block
quotes but not what it means: `roles/kanri.md`'s step 6 wraps
`Delete requests wait for step 7.` across two lines after `answered.` (P4.4
quotes both), and its Timing paragraph wraps
`…supplies no boundary of this kind and holds no handover of yours.` so that the
insertion point of spec 2.4 falls **mid-line**; P5.1 is therefore a replacement
rather than an insertion. The other four section 9 sites — 2.1's step 6, 2.2's
Live peers sentence (unchanged here by design), 3's Delete row, and 6.6's
Measurements sentence — read as the spec assumed.

One consequence of the spec's own task cut, for the reviewer to see rather than
discover: check 3's new MAP row, `templates/shoroku-brief.md` against
`roles/kanri.md`, lands in **task 10**, while the citation in `roles/kanri.md`
that satisfies it lands in **task 11**. Check 3 is therefore green at batch D's
boundary and not at task 10's. Fixed input 4 puts those two in one batch and
different tasks, and this is where that shows.

---

## Global Constraints

Built from `AGENTS.md` and the concrete model families from `tanto.json`, plus
what the spec itself fixes (Fixed input 6, section 10). Every batch prompt
restates these; trust the prompt over recollection.

### The shell

**Every fenced block in this plan runs in Git Bash.** The host's primary shell
is PowerShell, where a POSIX `grep -c '...'` with single quotes is unrunnable.
Every dispatch says so. Where a step names `./scripts/lint.sh`,
`scripts\lint.bat` with the same arguments is the Windows equivalent and is
run from PowerShell or `cmd`.

### Repository rules

- American English for everything in the repo — code, messages, comments,
  docs, commits, branch names.
- Run `./scripts/lint.sh` on the changed paths, each named individually
  (Windows: `scripts\lint.bat`); this repository's script always takes
  explicit paths — name every one.
- Commit by explicit path with `git commit --only <paths>`; the index is
  shared. This plan creates one tracked file inside a task's own passage
  block, `skills/tanto/templates/shoroku-brief.md` (task 10); that task runs
  `git add <path>` first — `--only` cannot pick up an untracked path. Task
  14's dogfood report is a second new file, added the same way, but is not
  part of the `created:` accounting below (see "The created path").
- Every commit message ends with a `Co-Authored-By:` trailer identifying the
  agent. **Every commit fence in this plan was written by the drafter, on
  `opus`, and ends `Co-Authored-By: Claude Opus 5 (1M context)
  <noreply@anthropic.com>`.** The Models table below dispatches
  `task.implement` on `sonnet`: substitute whatever model actually ran the
  dispatch, by name and by that session's own attribution convention, in
  every commit fence's trailer before running it — copying the fence's own
  name verbatim writes a false attribution. The boundary check greps the
  prefix `Co-Authored-By: Claude`, per commit, so whichever model implements
  a task satisfies it under its own name.
- After editing a skill's `SKILL.md`, review its sibling `README.md` for
  drift. This plan edits two: `skills/tanto/SKILL.md` and
  `skills/shoroku/SKILL.md`. Task 12 is that review for both, explicitly
  (spec 1.7); nothing later re-touches either README.
- **A modification in the shared tree that this task, or a subagent it
  dispatched, did not make is not its to discard.** It is reported — one line
  to Jisso from a `task.implement` dispatch, one line to Kanri from Jisso —
  and never run through `git checkout --` or `git clean` on the implementer's
  own judgment; only Kanri decides whether it is stray
  (`tanto-context-ceiling` R-11, which every plan now carries).
- Never `git add -A`, `.`, or `-u`; never a bare `git commit`; never
  `git commit -a`. Never amend a published commit. Never push to
  `origin/main`. Never bypass a hook (`--no-verify`, a `core.hooksPath`
  override).
- Do not edit agent instruction files, repo-root Markdown, or
  linter/formatter configuration without explicit human approval. This
  plan's edits to `skills/tanto/**` and `skills/shoroku/SKILL.md` are the
  topic's own scope, not an incidental touch — the human's approval is the
  spec review and this plan's own review-brief OK, both gates this run
  passes through before any task lands. This plan touches no repo-root
  Markdown and no linter/formatter configuration:
  `.markdownlint-cli2.yaml` is explicitly out of scope (spec Fixed input 2;
  issue-e047 is deferred to a lane the human opens).

### Models

Every dispatch names both a `model` and a `subagent_type`, from
`subagents.<kind>` in the merged `tanto.json`. All twelve `tanto-<object>-<act>`
definitions exist on this machine and were visible to this run's Keikaku at
its own start sequence (12 current, 0 written, 0 not visible), so no dispatch
here omits `subagent_type` for want of a definition to name.

| Dispatch | kind | `subagent_type` | model | effort |
| --- | --- | --- | --- | --- |
| implementer, fix rounds 1-3 | `task.implement` | `tanto-task-implement` | `sonnet` | `high` |
| task reviewer, spec conformance | `task.review-spec` | `tanto-task-review-spec` | `opus` | `medium` |
| task reviewer, quality pass | `task.review-quality` | `tanto-task-review-quality` | `opus` | `medium` |
| fix rounds 4-5 (the escalation) | `task.escalate` | `tanto-task-escalate` | `opus` | `high` |
| anything else — an ad-hoc search, a one-off exploration | `default` | `tanto-default` | `sonnet` | `medium` |

**Every dispatch names a `model`.** An omitted `model` inherits the
dispatching session's own — `sonnet` for Jisso and for this run's Kanri —
which is not a failure this rule bends for: name it every time regardless.

### `$TANTO`

`$TANTO` is the tanto skill's own directory, set **in the same tool call as
the command that uses it** — shell state does not persist between calls, and
an unset variable makes the command read a path at the filesystem root. In
this repository the skill is linked into the working tree at `skills/tanto`,
so `TANTO=skills/tanto` is the form every command in this plan spells.

### The created paths

Two tracked files are created, verbatim as the spec's own "What the plan
must contain" gives the list, because `diff` reads it:

```text
created: skills/tanto/templates/shoroku-brief.md
created: docs/reports/2026-09-15-tanto-sweep-2-dogfood.md
```

`diffPlan` exempts a `created:` path from **both** its added- and
removed-line check and needs no `W` block for it. Task 10's block for
`shoroku-brief.md` is a `W` (whole file) regardless, checked by an ordinary
fenced step, because that file's content is fully designed text known at
draft time. Task 14's dogfood report carries no block at all — its content
is recorded output, measured at batch E's own boundary, not designed
text — and `created:`'s exemption is exactly the case for that: nothing
about it needs to match a passage, and `diff` stays silent on its lines
throughout, not merely at batch E.

### `diff`'s base is resolved once, at the plan's landing — not `git merge-base main HEAD`

This branch (`tanto-sweep-2`) carries two commits before task 1: the spec
commit ("docs: commit tanto-sweep-2 design spec", touching only the spec
file — none of the seventeen File-structure paths) and, landed on the shared
checkout after it, Hosa's chore commit ("docs(issues): file issue-a4c7 from
a kuchidome bug report", touching `docs/issues/open/a4c7-*.md` — also none
of the seventeen paths, and not this topic's to account for). `diff` diffs
the **whole repository** against
its base, with no path scoping beyond `created:` and the plan's own path, so
neither commit's lines may sit inside the diffed range at any boundary, or
every one of them reports as `unaccounted-added` forever. `git merge-base
main HEAD` does **not** exclude them — that resolves to `main`'s own tip,
before either commit.

The right base is the **current tip, resolved once, right before task 1's
first commit** — after which it is a fixed value, not re-derived at each
boundary (HEAD moves; the base must not). Kanri runs this at the plan's
landing, the same moment Rule 11's authority ruling is recorded, and writes
the resolved value into the ledger:

```bash
git log --format=%H main..HEAD -- skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates docs/notes/tanto-consistency-checks.md skills/shoroku/SKILL.md skills/tanto/README.md skills/shoroku/README.md docs/reports | head -1
```

A hash printed here is the base directly — the newest commit on the branch
that already touches one of these paths, correctly excluded from the diffed
range. Measured 2026-09-15, before task 1: this instead returns nothing
(neither pre-existing commit touches these paths), so the resolved base is
the plain tip, `git rev-parse HEAD`, at that moment Hosa's chore commit.
**No commit hash is written here** — a hash in tracked content goes stale
the first rebase — the ledger carries the resolved value, and every `diff`
call in "How a batch is verified" below is a hand-run check that names it
explicitly rather than a fence, because the value cannot be re-derived live
inside a static fence once later tasks' own commits move `HEAD` further.
**A later re-derivation
that yields a different hash is a stop, not a recompute**: nothing should
land on these paths between boundaries while this plan is in flight
(`SKILL.md` Rule 5).

### The commands `replay` does not run

Declared once here, not line by line — `replay` (and `boundary`, which
honors the same patterns) skip a fence matching one of these:

```text
replay-skip: ./scripts/lint.sh — pre-commit needs the repository and its hook cache, which the applied tree is not
replay-skip: mise x node@22 — the test suite is run against the real repository's Node toolchain, not a scratch tree
replay-skip: .tanto/ — the topic's state is the working tree's, and an applied copy of the plan's blobs has no such directory
replay-skip: /tmp/tanto-checks.sh — the note's own checks read the whole skill's current file set and need the real git repository, neither of which the applied tree provides
```

### Rule 11 — the authority sentence and the safe-replacement boundary

This plan edits the skill its own sessions run on (`skills/tanto/**`,
`skills/shoroku/SKILL.md`; the loaded skill at this machine's skill directory
is a symlink into this working tree, confirmed by Keikaku before drafting): a
session started mid-plan reads whatever is on disk at that moment. **Until
every task has landed, the authority for this run's sessions is this Global
Constraints section, Kanri's orders line, and the batch prompts — not the
role files' on-disk text**, which this very plan is mid-editing. Because the
check brief's template (D1), `shoroku`'s recommend mode (D1), Kanri's check
step and the contract's "Session exit" (D2) must agree with each other, and
because the enumerations of batch A are counted across every file that names
them, **the boundary from which a role may be started or replaced is the
final one — after batch E lands, not after batch D.** No planned replacement
is expected before then. Two exceptions stand regardless, per rule 11:
Kanri's own handover proceeds when due, and its successor takes the
authority ruling from the handover file; and a further role needed before
the final boundary — Kaiseki — is a Kanri ruling, recorded as an `R-n`, made
with the half-edited skill in view.

**The shoroku check-brief switch is a separate, earlier point**, about which
*form* Kanri's own shoroku stages use, not about role replacement: this run's
Kanri uses the **interim form** (rendering the whole recommendation itself,
the 2026-09-14 hotfix) for any shoroku stage that falls before batch D's
tasks land, and the **full form** (the check brief, checked by `grep`) from
the first shoroku stage after batch D is accepted. Task 14's dogfood report
records which form ran at that first stage.

---

## Batches

Five batches, fourteen tasks, cut by the kind of inconsistency (spec Fixed
input 4): A lands the contract's rules and the enumeration sweep; B is
`roles/kanri.md` and its template outside the shoroku steps; C is the
authoring and thinking seats; D is the check brief, the only batch that
changes behavior, and the batch issue-c17a asked to stand alone, second to
last; E closes over the whole tree and measures the run that shipped D.
Every batch is a Kanri directive: no worktree (Global Constraints), lint on
the changed paths named individually, and `boundary --plan` before the human
is told the batch is verified.

| Batch | Tasks | Delivers | Stop conditions at the boundary |
| --- | --- | --- | --- |
| A | 1 `SKILL.md`'s two rules, the cap's five sites, three dispatch sentences; 2 the enumeration and copied-string sweep across six files; 3 checks 20 and 21 in the note | the contract's rules at one number each, and six stale enumerations re-synchronized (check 20's `Fourteen of them:` line reads `0` until batch D lands it) | `verify --task 1..3` clean; `diff --base <the ledger's resolved value>` clean (Kanri, by hand); lint clean on the batch's own changed paths, named individually from File structure (Kanri, by hand); `mise x node@22 -- node --test skills/tanto/scripts/` passes (Kanri, by hand — Global Constraints' `replay-skip`); checks 20 and 21's content greps (`docs/notes/tanto-consistency-checks.md`) print their recorded values, `Fourteen of them:` expected `0` until D (Kanri, by hand) |
| B | 4 the commit window, the third shoroku dispatch, Hosa's two lines; 5 Timing and the handover template's unanswered mark; 6 the workspace listing, the dispatch tally, the pre-spec closure clause | `roles/kanri.md` and `templates/kanri.md` fully consistent on the commit window, Hosa's channel, Timing, and the two post-merge placements `old-text-check.md` ruled | `verify --task 4..6` clean; `diff --base <the ledger's resolved value>` clean (Kanri, by hand); lint clean on the batch's own changed paths (Kanri, by hand); `mise x node@22 -- node --test skills/tanto/scripts/` passes (Kanri, by hand); `grep -c 'pre-spec' skills/tanto/roles/kanri.md` and a read of `templates/kanri.md`'s Progress placeholder confirm P6.3 and P6.4 landed exactly where `old-text-check.md` ruled (Kanri, by hand) |
| C | 7 `roles/sekkei.md`'s review gates and the fixed referent; 8 `roles/keikaku.md`, the same plus two drafting conventions; 9 `roles/kikaku.md`'s scope and model rule, and the `shoroku` baseline sentence on both sides | the three authoring/thinking role files under the same review-gate, dialogue, and fixed-referent rules, and Kikaku narrowed to what it actually writes | `verify --task 7..9` clean; `diff --base <the ledger's resolved value>` clean (Kanri, by hand); lint clean on the batch's own changed paths (Kanri, by hand); `mise x node@22 -- node --test skills/tanto/scripts/` passes (Kanri, by hand); the string `git hash-object` present once each in `roles/sekkei.md`, `roles/keikaku.md`, and `templates/review-brief.md`'s `Document:` line — `grep -c 'git hash-object'` → `1 1 1` (Kanri, by hand, one `grep -c`) |
| D | 10 `templates/shoroku-brief.md` (created), `shoroku`'s recommend mode, the note's four structural counts; 11 `roles/kanri.md`'s check step and Exit shoroku step 3, `SKILL.md`'s "Session exit" whole, and the `Unsure` spelling at every reader; 12 checks 18 and 19, and both READMEs' drift review | the check brief, whole — the one batch that changes behavior. **From this boundary, this run's own Kanri switches to the full check-brief form** (Global Constraints, "the shoroku check-brief switch") | `verify --task 10..12` clean; `diff --base <the ledger's resolved value>` clean except any extra lines in the two READMEs from task 12 Step 5's own drift review, each traceable to that step's record in the batch report (Kanri, by hand); lint clean on the batch's own changed paths (Kanri, by hand); `mise x node@22 -- node --test skills/tanto/scripts/` passes (Kanri, by hand); `git ls-files --eol skills/tanto/templates/shoroku-brief.md` reports `i/lf w/crlf` (Kanri, by hand); checks 18 and 19's content greps print their recorded values, and both READMEs' drift-review finding is recorded in task 12's own batch report (Kanri, by hand) |
| E | 13 the whole-tree `O` sweep and the note's checks re-run (sweep-and-check); 14 the dogfood report (sweep-and-check) | the proof that no old text or old enumeration survives anywhere in `skills/tanto/`, `skills/shoroku/`, or the consistency note, and the dogfood measurement recorded once a stage has actually run under the full check-brief form (see Task 14's own note on timing — open point, blocking finding 1 of the plan review) | `verify --task 13..14` clean (both report `no passages`, a result and not a failure); `diff --base <the ledger's resolved value>` clean, `docs/reports/2026-09-15-tanto-sweep-2-dogfood.md` reported exempt as `created:` (Kanri, by hand); lint clean on the changed/created paths (Kanri, by hand); all 32 `O` needles at their stated disposition, including O2.4's documented residual (Kanri, by hand); the note's checks 1 to 9 and 16 to 21 re-run with output recorded (Kanri, by hand); `git ls-files --eol docs/reports/2026-09-15-tanto-sweep-2-dogfood.md` reports `i/lf w/crlf` (Kanri, by hand) |

**Batch internal order.** A is sequential: task 1 lands the rules and cap
sites every later task's review reads against, task 2 the enumeration sweep,
task 3 the note entries the sweep's own checks live in. B and C are each
sequential by file region. D is sequential: task 10 creates the template and
the recommend-mode changes it depends on, task 11 depends on 10's group
headings and item-heading contract, task 12 depends on both existing to
review. E is sequential: task 13 sweeps what every earlier batch landed,
task 14 needs the whole run's own boundaries — including a shoroku stage run
under D's check brief — to have already happened.

**No planned replacement before batch E's boundary.** One Jisso is expected
to carry A through E. If its reading shows a compaction, Rule 11's
authority sentence is why the replacement still waits for E's boundary, and
Kanri records the wait as a ruling.

**Two tasks are a sweep-and-check shape**, both in batch E, adjacent so that
one reviewer carries the inversion once (Self-Review, "Sweep-and-check
tasks"): task 13's deliverable is recorded output, and "it changed a tracked
file it did not mean to" is its own failure condition; task 14's deliverable
is a report under `docs/reports/`, and it runs last because what it measures
is this plan's own run. Both dispatches tell the reviewer to **re-run** the
commands rather than read the report, per the consistency note's check 14.

---

## How a batch is verified

Named by name and split by **who runs it**: `boundary --plan` runs every
fenced `bash` or `console` block under this heading (down to, and not
including, the `## Tasks` heading that closes it) and judges each by its
exit status alone; Kanri runs the rest by hand, because a `replay-skip:`
pattern `boundary` also honors would silently remove a check from the fenced
set (`./scripts/lint.sh` and `mise x node@22` are both declared skip
patterns in Global Constraints, and the lint and test-suite checks below
would be silently skipped if fenced here — so they are not fenced) or
because the command needs a value — a task range, a batch's own changed-path
list, the `diff` base Global Constraints has Kanri resolve once and record in
the ledger rather than re-derive live inside a fence — no fixed fence can
carry.

The one fence below has three properties: it opens at column 0 (an indented
fence is invisible to both `boundary` and `replay`); it exits non-zero when
it fails; and it is not matched by any of Global Constraints' four
`replay-skip:` patterns — checked directly: it contains none of
`./scripts/lint.sh`, `mise x node@22`, `.tanto/`, or `/tmp/tanto-checks.sh`.

`git status --porcelain` is `boundary`'s own first check, empty on pass, and
is not repeated below.

**1. Every commit of this batch carries its trailer.**

```bash
git log --format=%H main..HEAD -- skills/tanto skills/shoroku docs/notes/tanto-consistency-checks.md docs/reports | while IFS= read -r c; do git log -1 --format=%B "$c" | grep -q 'Co-Authored-By: Claude' || { printf 'missing trailer: %s\n' "$c"; exit 1; }; done && echo "every commit of this plan carries its trailer"
```

Expected: `every commit of this plan carries its trailer`. Scoped to the
paths this plan writes; the range also catches the two pre-existing commits
Global Constraints' "`diff`'s base" names (the spec commit and Hosa's chore
commit), which is not a problem — each carries its own proper trailer and
this check does not care which commit wrote it, only that every commit in
range has one.

**What Kanri runs by hand, and why it is not a fence.** `diff --plan
docs/superpowers/plans/2026-09-15-tanto-sweep-2.md --base <the value Global
Constraints has Kanri resolve once, at the plan's landing, and record in the
ledger>` — never `git merge-base main HEAD`, which would resurface both
pre-existing commits as `unaccounted-added` forever; expected output is
`diff: clean` (plus its `created:` line) at **every** boundary, A through
E — both `skills/tanto/templates/shoroku-brief.md` (from D) and
`docs/reports/2026-09-15-tanto-sweep-2-dogfood.md` (from E) are declared
`created:`, so neither's content is ever checked against a passage or shows
as unaccounted, at that boundary or any later one — **except** at batch D's
own boundary, where task 12 Step 5's README drift review may add lines
beyond its own quoted passages, each traceable to that step's record in the
batch report; any other `unaccounted-added` or `unexplained-removed` line at
any boundary is a real failure. `./scripts/lint.sh` on that batch's own
changed paths, named individually from the Batches table's Delivers column
and File structure — the paths differ per batch, a value no fixed fence
carries, and the command is a declared `replay-skip:` pattern besides.
`mise x node@22 -- node --test skills/tanto/scripts/` once per boundary, to
show the untouched scripts still pass — also a declared skip pattern.
`git ls-files --eol <path>` on whichever file that boundary's own tasks
created (`skills/tanto/templates/shoroku-brief.md` at D,
`docs/reports/2026-09-15-tanto-sweep-2-dogfood.md` at E), expecting `i/lf
w/crlf`. The content greps of `docs/notes/tanto-consistency-checks.md`'s own
numbered checks that the boundary's own batch lands, named in the Batches
table's Stop conditions column, each run and its output recorded rather than
only its exit status read. `verify --plan docs/superpowers/plans/2026-09-15-tanto-sweep-2.md
--task <the batch's task range>`, which needs the range as a value.

---

## Tasks

`sectionEnd` in `passage-check.js` ends a section at the next non-fenced heading
of the same or a shallower depth. This `## Tasks` heading is what closes "How a
batch is verified" once Keikaku writes it; without it, `boundary --plan` would
read every task's own `git commit`, `git ls-files --eol` and `verify` fence as
part of the verification list and try to run them all at every boundary. Nothing
under this heading belongs to "How a batch is verified".

Every task's **Verify** step is one invocation of `passage-check.js verify`, and
never a hand-written check: the needles, the anchor values and the line counts
are all determined by the blocks above it.

### Task 1: `SKILL.md`'s two rules, the cap at its five sites, and three dispatch sentences

**Batch:** A. **Blocks:** A1.1, O1.1, O1.2, O1.3, P1.1 to P1.9.

Rule 9's cap goes from two to one (spec Fixed input 3 and 6.3), and it says
"one" at all five sites in the same task, because a reader who finds two numbers
cannot tell which is the rule. Rule 3 gains the sentence that a project memory
rule is not a role's authority (6.2). The dispatch paragraph gains the two
sentences that a dispatch whose deliverable is a file names the path and forbids
its own fan-out (6.1) — stated once, here, because every role reads this file.
The kind-naming sentence gains the dotless form (2.3's contract half), and the
review-brief bullet stops calling a seat that writes a file read-only (5.2's
contract half).

**Files:**

- Modify: `skills/tanto/SKILL.md`
- Modify: `skills/tanto/roles/sekkei.md`
- Modify: `skills/tanto/roles/keikaku.md`
- Modify: `skills/tanto/roles/kikaku.md`
- Modify: `skills/tanto/templates/kanri.md`

**Named mechanisms this task changes, and every other site that names them:**
rule 9's cap is named in `SKILL.md` rule 9, `roles/sekkei.md`'s write-and-commit
rule, `roles/keikaku.md`'s write-and-commit rule, `roles/kikaku.md`'s "Rule 9"
section, and `templates/kanri.md`'s paragraph under the Measurements table — all
five are in this task. The reviewer checks them together.

markdownlint **does** run on `skills/tanto/SKILL.md` and the role files — the
ignore list covers `docs/superpowers/**` and `skills/tanto/templates/**`, not
those — so the lint step is a real markdownlint run with `--fix`.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/SKILL.md skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md skills/tanto/roles/kikaku.md skills/tanto/templates/kanri.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`. Read every
file as UTF-8 and normalize CRLF to LF before comparing anything: a block
written LF against a file checked out CRLF never matches, and the failure looks
like a missing passage.

- [ ] **Step 2: The old values this task contradicts**

Each needle was run against this branch's tree as it was written, and the count
stated is the count the command returned.

**O1.1** `two top-family session` — `skills/tanto/SKILL.md` 1,
`skills/tanto/roles/sekkei.md` 1, `skills/tanto/roles/keikaku.md` 1,
`skills/tanto/roles/kikaku.md` 1 → 0 at P1.2, P1.3, P1.4 and P1.5. One needle,
four files, one task; it matches the singular and the plural, and a hit left in
any of the four after this task is a site the cap did not reach.
`skills/tanto/roles/hosa.md` carries no restatement — the sweep found none —
which is why `hosa.md` has no block in this plan.

**O1.2** `a third top-family session` — `skills/tanto/templates/kanri.md` 1 → 0
at P1.6. Under a cap of one the breach the peak row counts is a **second**
session, so the ledger's own instruction for filling that row is the fifth site
of the cap and is reached by no wording the other four use.

**O1.3** `a read-only subagent that writes` — `skills/tanto/SKILL.md` 1 → 0 at
P1.9. The contract's own description of the brief writer, which the two role
files restate in their own words; those two are O7.2 in task 7.

- [ ] **Step 3: A project memory rule is not a role's authority**

**P1.1** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
3. State in files, not in memory: the roster and the ledgers. Memory holds at
   most a pointer to them.
```

**P1.1 →**

```text
3. State in files, not in memory: the roster and the ledgers. Memory holds at
   most a pointer to them. A role's authority is this file, its role file,
   Kanri's lines, and the batch prompts; a project memory rule that would add
   a dispatch or a document is put to Kanri as one line before it is acted
   on, since the same memory is loaded by every session in the repository.
```

- [ ] **Step 4: The cap is one**

**P1.2** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```text
9. At most two top-family sessions active at once, Kikaku excepted as
   human-paced: Sekkei pauses while Kaiseki is active; Keikaku and Hosa, on
   the cheaper families, do not count.
```

**P1.2 →**

```text
9. At most one top-family session active at once, Kikaku excepted as
   human-paced: Sekkei pauses while Kaiseki is active, which is that rule's
   whole content today; Keikaku and Hosa, on the cheaper families, do not
   count. A second one under concurrent topics is a Kanri ruling, recorded as
   `R-n`.
```

- [ ] **Step 5: Sekkei's restatement**

**P1.3** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```text
- You pause entirely while Kaiseki is active. At most two top-family sessions
  are active at once, Kikaku excepted as human-paced; Keikaku and Hosa, on the
  cheaper families, do not count.
```

**P1.3 →**

```text
- You pause entirely while Kaiseki is active. At most one top-family session
  is active at once, Kikaku excepted as human-paced; Keikaku and Hosa, on the
  cheaper families, do not count.
```

- [ ] **Step 6: Keikaku's restatement**

**P1.4** `skills/tanto/roles/keikaku.md` — replace exactly these 3 lines

```text
- You pause while Kaiseki is active. Your family is a cheap one, so you do not
  count toward the two top-family sessions rule 9 allows, but the checkout is
  shared and that is what the pause is for.
```

**P1.4 →**

```text
- You pause while Kaiseki is active. Your family is a cheap one, so you do not
  count toward the one top-family session rule 9 allows, but the checkout is
  shared and that is what the pause is for.
```

- [ ] **Step 7: Kikaku's restatement, and the state the cap makes impossible**

**P1.5** `skills/tanto/roles/kikaku.md` — replace exactly these 3 lines

```text
You are on the top family and human-paced, and you are not counted: at most
two top-family sessions are active at once, with you excepted. The human
keeps this window quiet while Sekkei and Kaiseki are both active.
```

**P1.5 →**

```text
You are on the top family and human-paced, and you are not counted: at most
one top-family session is active at once, with you excepted.
```

- [ ] **Step 8: The peak row counts a second session**

**P1.6** `skills/tanto/templates/kanri.md` — replace exactly these 2 lines

```text
plan close from this ledger's Session events, where it writes one line each
time a third top-family session goes live; the second by counting those same
```

**P1.6 →**

```text
plan close from this ledger's Session events, where it writes one line each
time a second top-family session goes live; the second by counting those same
```

- [ ] **Step 9: A dispatch whose deliverable is a file**

**P1.7** `skills/tanto/SKILL.md` — insert after these 3 lines

```text
the dispatching role tells the human once per session, in its next line, that
the dispatched effort came from the session's own effort and not the kind's
configured one.
```

**P1.7 →**

```text
A dispatch whose deliverable is a file names the path, says the agent writes
it in its own turn, and forbids the agent from dispatching agents of its own —
a subagent that fans out ends its turn with nothing written and a reply that
reads as progress. The dispatcher verifies the file, not the reply.
```

- [ ] **Step 10: A kind with no dot in its name**

**P1.8** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
dispatches without them; from then on a dispatch names its kind as
`subagent_type: tanto-<object>-<act>`.
```

**P1.8 →**

```text
dispatches without them; from then on a dispatch names its kind as
`subagent_type: tanto-<object>-<act>` — or `tanto-<kind>` for a kind with no
dot in its name, `tanto-shoroku` and `tanto-default`.
```

- [ ] **Step 11: A seat that must write names its one file**

**P1.9** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
  the **review brief** on `brief.write` — a read-only subagent that writes
```

**P1.9 →**

```text
  the **review brief** on `brief.write` — a subagent that reads, and writes
  exactly one file,
```

- [ ] **Step 12: The anchor for this task's insertion**

**A1.1** `skills/tanto/SKILL.md` — `grep -c 'A dispatch whose deliverable is a file' skills/tanto/SKILL.md` — before: 0, after: 1

- [ ] **Step 13: Lint**

```bash
./scripts/lint.sh skills/tanto/SKILL.md skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md skills/tanto/roles/kikaku.md skills/tanto/templates/kanri.md
```

Expected: exit 0, none `Failed`. **This step runs before the Verify step below,
not after.** markdownlint runs with `--fix`, and a fix that rewrote a line
inside a passage would leave `passage-check verify` reading text the plan does
not contain. If it fixes anything, re-author the block it touched rather than
leaving the file and the plan disagreeing.

- [ ] **Step 14: Commit**

```bash
git commit --only skills/tanto/SKILL.md skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md skills/tanto/roles/kikaku.md skills/tanto/templates/kanri.md -m "docs(tanto): rule 9's cap is one, and three dispatch sentences" -m "Rule 9 caps top-family sessions at one and the four restatements follow it; rule 3 says a project memory rule is not a role's authority; the dispatch paragraph states that a deliverable is a file and that the agent does not fan out; the kind-naming sentence covers a dotless kind; the brief writer is no longer called read-only. Spec 2.3, 5.2, 6.1, 6.2, 6.3." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 15: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 16: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-sweep-2.md --task 1
```

Expected: `task 1: verify clean`.

**Done when:** the nine passages are present, A1.1 returns `1`, the needles of
O1.1, O1.2 and O1.3 return `0` everywhere, `git ls-files --eol` still reports
`i/lf w/crlf` on all five files, lint is clean, and the commit carries its
`Co-Authored-By:` trailer.

---

### Task 2: the enumerations and the copied strings

**Batch:** A. **Blocks:** A2.1, A2.2, O2.1, O2.3 to O2.7, P2.1 to P2.7.

The same shape seven times: a list or a string spelled at one site went stale at
a second, unquoted one (spec section 3). Two of them are cross-file pairs that
must read the same byte for byte — the status enumeration in `SKILL.md` and
`roles/kanri.md`, and the `subagent_type:` form in the two templates — which is
why all seven land in one task rather than in the file-shaped batches that
follow.

**Files:**

- Modify: `skills/tanto/SKILL.md`
- Modify: `skills/tanto/roles/kanri.md`
- Modify: `skills/tanto/roles/jisso.md`
- Modify: `skills/tanto/templates/kanri.md`
- Modify: `skills/tanto/templates/kanri-handover.md`
- Modify: `skills/tanto/templates/batch-prompt.md`

**Named mechanisms this task changes, and every other site that names them:**
the roster's status words are named in `SKILL.md`'s `roster-archive.md`
Artifacts row and in `roles/kanri.md`'s Delete table's plan-close row — both
here. The dispatch string a prompt restates is named in
`templates/kanri-handover.md`'s Models bullet and
`templates/batch-prompt.md`'s Models bullet — both here; the file-naming rule
those two used to spell out stays stated once, in `SKILL.md`, and is not
restated.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/jisso.md skills/tanto/templates/kanri.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/batch-prompt.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O2.1** `dead, replaced, and refused rows` — `skills/tanto/SKILL.md` 1,
`skills/tanto/roles/kanri.md` 1 → 0 at P2.1 and P2.2. The set of statuses an
archive move takes is the entity; `cleared` was added to the roster when Kikaku
and Hosa got `/clear`ed windows and never reached either sentence that lists
them. No new term reaches this pair — the cardinality changed, not the wording —
so the needle is the old list itself.

The stage-word example list of `templates/kanri.md` (P2.3) has **no valid `O`
needle**: the passage only *inserts* an item into a backtick-quoted list, and an
`O` needle is itself delimited by backticks and so cannot carry one. Every
backtick-free substring of that line either survives the insertion or is `, `.
Its entity is checked by an anchor instead, A2.2 below, which is the same
instrument stated the other way round.

**O2.3** `continue: <the dispatch` — `skills/tanto/roles/kanri.md` 1 → 0 at P2.4. The `continue:` line is a string one role sends and another parses, so the two spellings must be one; `SKILL.md`'s is the one kept. The needle starts at `continue:` rather than at the placeholder, because a needle that begins with `<` is read as documentation and never resolved.

**O2.4** `tanto-task-implement.md` — `skills/tanto/templates/batch-prompt.md` 1,
`skills/tanto/templates/kanri-handover.md` 1 → 0 at P2.5 and P2.6.
`docs/notes/tanto-consistency-checks.md` also returns 1, and **that hit stays**:
check 8 loads
`"${CLAUDE_CONFIG_DIR:-$HOME/.claude}/agents/tanto-task-implement.md"` as a real
file on disk, which is the definition file the naming rule produces, not the
string a dispatch passes.

**O2.5** `tanto-task-review-spec.md` — `skills/tanto/templates/batch-prompt.md`
1, `skills/tanto/templates/kanri-handover.md` 1 → 0 at P2.5 and P2.6. The spec
asks the plan's author to read the same bullets' `task.review-spec` and
`task.review-quality` clauses for the same form; they carry it, so they change
in the same blocks.

**O2.6** `tanto-task-escalate.md` — `skills/tanto/templates/batch-prompt.md` 1,
`skills/tanto/templates/kanri-handover.md` 1 → 0 at P2.5 and P2.6. The third
clause of the same two bullets, found by the same read.

**O2.7** `T2 shoroku proposal and write-out` — `skills/tanto/roles/jisso.md` 1 →
0 at P2.7. Jisso proposes; the apply subagent writes out. The file's own T2
section already says so, and `SKILL.md`'s roles table agrees; only the opening
line disagreed.

- [ ] **Step 3: The fifth status, in the contract**

**P2.1** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
| `.tanto/roster-archive.md` | Kanri | Kanri | from `templates/roster-archive.md`; the roster's dead, replaced, and refused rows with their last readings, and the closed plans' Events lines, appended at each plan close |
```

**P2.1 →**

```text
| `.tanto/roster-archive.md` | Kanri | Kanri | from `templates/roster-archive.md`; the roster's dead, replaced, refused, and cleared rows with their last readings, and the closed plans' Events lines, appended at each plan close |
```

- [ ] **Step 4: The fifth status, in the Delete table**

**P2.2** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
| Jisso is deleted and the ledger's Progress line says closed | this plan is closed. **First, while every row still carries its Transcript column**, run `node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]` over the sessions of **this topic**: every handshake the ledger's Session events accepted for it — Sekkei, Keikaku, Jisso, an attached Kaiseki — and every Kanri whose tenure overlapped it, the current one and any predecessor the Events' handover lines name, each path taken from its roster or archive row. A refused handshake has no row and no transcript and is not in the list; rows of another plan that a shared roster still holds, and Kikaku's and Hosa's, whose Topic is `—`, are not of this topic and are left out. A path that is denied, `unavailable`, or on another host is skipped and named by the script, and is never read by asking the peer. Record the share line, the sessions it ran over, and the ones it skipped in the Measurements share row; the target is 30% or less. Then ask the human, in one line and in the chat's language, for the Account & Usage view's own figure for the day, and record it beside the proxy — the two are compared, not equated, since that view counts every other workspace and every subagent — and a silence is an answer and a blank. Then mark `dead` the rows of the sessions deleted at this close, move the dead, replaced, and refused rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet, fill the ledger's remaining Measurements fixed rows, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |
```

**P2.2 →**

```text
| Jisso is deleted and the ledger's Progress line says closed | this plan is closed. **First, while every row still carries its Transcript column**, run `node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]` over the sessions of **this topic**: every handshake the ledger's Session events accepted for it — Sekkei, Keikaku, Jisso, an attached Kaiseki — and every Kanri whose tenure overlapped it, the current one and any predecessor the Events' handover lines name, each path taken from its roster or archive row. A refused handshake has no row and no transcript and is not in the list; rows of another plan that a shared roster still holds, and Kikaku's and Hosa's, whose Topic is `—`, are not of this topic and are left out. A path that is denied, `unavailable`, or on another host is skipped and named by the script, and is never read by asking the peer. Record the share line, the sessions it ran over, and the ones it skipped in the Measurements share row; the target is 30% or less. Then ask the human, in one line and in the chat's language, for the Account & Usage view's own figure for the day, and record it beside the proxy — the two are compared, not equated, since that view counts every other workspace and every subagent — and a silence is an answer and a blank. Then mark `dead` the rows of the sessions deleted at this close, move the dead, replaced, refused, and cleared rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet, fill the ledger's remaining Measurements fixed rows, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |
```

- [ ] **Step 5: The fifth stage example**

**P2.3** `skills/tanto/templates/kanri.md` — replace exactly this 1 line

```text
`exit-jisso-B`, `exit-sekkei`, `exit-kaiseki-1`, and
```

**P2.3 →**

```text
`exit-jisso-B`, `exit-sekkei`, `exit-keikaku`, `exit-kaiseki-1`, and
```

- [ ] **Step 6: One spelling of `continue:`**

**P2.4** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
   `continue: <the dispatch the pause named> — same model`. The role
```

**P2.4 →**

```text
   `continue: <dispatch> — same model`. The role
```

- [ ] **Step 7: The handover file restates the string a dispatch passes**

**P2.5** `skills/tanto/templates/kanri-handover.md` — replace exactly these 5 lines

```text
- Models the next prompt must restate — the task implementation on
  `task.implement` (sonnet, `tanto-task-implement.md`); the per-task reviews
  on `task.review-spec` and `task.review-quality` (opus,
  `tanto-task-review-spec.md` and `tanto-task-review-quality.md`); fix rounds
  4-5 on `task.escalate` (opus, `tanto-task-escalate.md`).
```

**P2.5 →**

```text
- Models the next prompt must restate — the task implementation on
  `task.implement` (sonnet, `subagent_type: tanto-task-implement`); the
  per-task reviews on `task.review-spec` and `task.review-quality` (opus,
  `subagent_type: tanto-task-review-spec` and
  `subagent_type: tanto-task-review-quality`); fix rounds 4-5 on
  `task.escalate` (opus, `subagent_type: tanto-task-escalate`).
```

- [ ] **Step 8: The batch prompt restates the same string**

**P2.6** `skills/tanto/templates/batch-prompt.md` — replace exactly these 6 lines

```text
- Models, restated here so they survive compaction — the task implementation
  on `task.implement` (sonnet, `tanto-task-implement.md`); the per-task
  reviews on `task.review-spec` and `task.review-quality` (opus,
  `tanto-task-review-spec.md` and `tanto-task-review-quality.md`); fix rounds
  4-5 on `task.escalate` (opus, `tanto-task-escalate.md`). Every dispatch
  names its model. None omits it.
```

**P2.6 →**

```text
- Models, restated here so they survive compaction — the task implementation
  on `task.implement` (sonnet, `subagent_type: tanto-task-implement`); the
  per-task reviews on `task.review-spec` and `task.review-quality` (opus,
  `subagent_type: tanto-task-review-spec` and
  `subagent_type: tanto-task-review-quality`); fix rounds 4-5 on
  `task.escalate` (opus, `subagent_type: tanto-task-escalate`). Every dispatch
  names its model. None omits it.
```

- [ ] **Step 9: Jisso proposes; the apply writes out**

**P2.7** `skills/tanto/roles/jisso.md` — replace exactly this 1 line

```text
commits, and the T2 shoroku proposal and write-out.
```

**P2.7 →**

```text
commits, and the T2 shoroku proposal.
```

- [ ] **Step 10: The anchor for this task**

**A2.1** `skills/tanto/templates/batch-prompt.md` — `grep -cF 'subagent_type: tanto-task-implement' skills/tanto/templates/batch-prompt.md` — before: 0, after: 1

**A2.2** `skills/tanto/templates/kanri.md` — `grep -c exit-keikaku skills/tanto/templates/kanri.md` — before: 0, after: 1

- [ ] **Step 11: Lint**

```bash
./scripts/lint.sh skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/jisso.md skills/tanto/templates/kanri.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/batch-prompt.md
```

Expected: exit 0, none `Failed`. This step runs before the Verify step below.

- [ ] **Step 12: Commit**

```bash
git commit --only skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/jisso.md skills/tanto/templates/kanri.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/batch-prompt.md -m "docs(tanto): re-synchronize six enumerations and copied strings" -m "The archive move names the cleared status on both sides; the stage examples name exit-keikaku; continue: is spelled as the contract spells it; the two Models bullets pass the subagent_type a dispatch passes rather than the definition file's name; Jisso's opening line drops the write-out. Spec 3." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 13: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 14: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-sweep-2.md --task 2
```

Expected: `task 2: verify clean`.

**Done when:** the seven passages are present, A2.1 and A2.2 each return `1`,
the needles of O2.1, O2.3 and O2.7 return `0` everywhere and those of O2.4, O2.5
and O2.6 return `0` in `skills/tanto/` with the note's one documented hit of
O2.4 remaining, lint is clean, and the commit carries its trailer.

---

### Task 3: `docs/notes/tanto-consistency-checks.md` — checks 20 and 21

**Batch:** A. **Blocks:** A3.1, P3.1.

The note is one numbered run of `## <n>.` sections whose numbers are cited by
plans, so nothing is renumbered and nothing is inserted between existing
entries. This task appends `## 20.` and `## 21.` at the end — the check that
makes batch A's and batch B's drift loud, and the lesson that no `grep` can
state. Checks 18 and 19, which belong to the check brief, are inserted **before**
`## 20.` in task 12, so that the file's final order is 18, 19, 20, 21.

`docs/notes/**` is linted by markdownlint; `skills/tanto/templates/**` is not.

**Files:**

- Modify: `docs/notes/tanto-consistency-checks.md`

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol docs/notes/tanto-consistency-checks.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: Append the two entries**

**P3.1** `docs/notes/tanto-consistency-checks.md` — insert after these 2 lines

```text
the file it checks moves its own numbers, and its expected value is wrong the
moment it is written.
```

**P3.1 →**

````text

## 20. The enumerations the second sweep re-synchronized

```bash
grep -c 'dead, replaced, refused, and cleared' skills/tanto/SKILL.md
grep -c 'dead, replaced, refused, and cleared' skills/tanto/roles/kanri.md
grep -rc 'dead, replaced, and refused' skills/tanto/
grep -cF '`exit-keikaku`' skills/tanto/templates/kanri.md
grep -cF '`exit-keikaku`' skills/tanto/SKILL.md
grep -rcF 'continue: <dispatch> — same model' skills/tanto/SKILL.md skills/tanto/roles/kanri.md
grep -rcF 'task-implement.md' skills/tanto/templates/
grep -cF 'Fourteen of them:' skills/tanto/SKILL.md
grep -rcF 'At most one top-family session' skills/tanto/SKILL.md skills/tanto/roles/sekkei.md
grep -rc 'two top-family' skills/tanto/
grep -rcF 'third top-family' skills/tanto/
```

Expected: `1 1`, then `0` on every file of the old enumeration, `1 1`, `1 1`
for the `continue:` spelling, `0` on every template for the `.md` form, `1`,
`1 1`, then `0` on every file for the two spellings of the old cap. The five
sites of the cap are `SKILL.md` rule 9, `roles/sekkei.md`, `roles/keikaku.md`,
`roles/kikaku.md`, and `templates/kanri.md`'s paragraph under the Measurements
table; the last two say "one" in their own words, which is why the sweep is for
the old spellings and not for the new one. A definition file's own name stays
legitimate outside `skills/tanto/templates/`: check 8 loads one of them as a
real path under `$CLAUDE_CONFIG_DIR/agents/`, which is what the naming rule
produces and not what a dispatch passes. The three `.md`/`top-family` lines
run shorter forms than spec 8.3's own three needles (O2.4 and O1.1/O1.2 name
the full spec text, cited by id rather than re-quoted here), because `lint`
forbids a task's new text from containing the very `O` needle that task
declares; each shortened form here is a superset of the spec's fuller one,
so nothing the longer form would have caught escapes it.

## 21. A named mechanism is edited at every site that names it

A task that introduces or changes a named mechanism — a slot letter, a grant
clause, a status word, a section pointer — lists in its own text every other
site, in the same file and in the files the plan touches, that names the same
mechanism, so that its reviewer checks them together. No `grep` states this;
`roles/keikaku.md` Step 3 carries it as a drafting convention, and this entry is
why it exists.

Two issues of the second sweep are what it catches. issue-7ba4 spanned four
sites of one slot letter, two of which disagreed with the other two, and no
single task's review could see the disagreement because the task that changed
the mechanism did not list the others. issue-c30e was the same shape one file
apart: Hosa's standing grant is given at the handshake by "Human access" step 3,
and the handshake step that gives it did not name it. Both survived a spec
review and a plan review of the wave that introduced them.
````

- [ ] **Step 3: The anchor for this task's insertion**

**A3.1** `docs/notes/tanto-consistency-checks.md` — `grep -c '^## 21\.' docs/notes/tanto-consistency-checks.md` — before: 0, after: 1

- [ ] **Step 4: Lint**

```bash
./scripts/lint.sh docs/notes/tanto-consistency-checks.md
```

Expected: exit 0, none `Failed`. This step runs before the Verify step below.

- [ ] **Step 5: Commit**

```bash
git commit --only docs/notes/tanto-consistency-checks.md -m "docs(notes): add checks 20 and 21 to the tanto consistency note" -m "Check 20 is the grep over the six enumerations the second sweep re-synchronized; entry 21 is the lesson that a named mechanism is edited at every site that names it, which no grep can state. Numbers are appended, never reused. Spec 8.3, 8.4." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 6: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 7: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-sweep-2.md --task 3
```

Expected: `task 3: verify clean`.

**Done when:** the note ends with `## 20.` and `## 21.`, A3.1 returns `1`, no
existing section number changed, lint is clean, and the commit carries its
trailer. Check 20's own figures are recorded in the note by task 13, which is
where they are measured on the finished tree.

---

### Task 4: `roles/kanri.md` — the commit window, the third shoroku dispatch, and Hosa's two lines

**Batch:** B. **Blocks:** A4.1, O4.1 to O4.5, P4.1 to P4.6.

Kanri's own exit shoroku is applied in **slot (a)** like every other stage's,
and the delete request for an exiting session goes out as soon as the
recommendation and its brief are on disk (spec 2.1). The third of the three
shoroku dispatches names its `subagent_type` like the other two (2.3's role
half). Hosa's `slot-needed:` gains a receiver (4.1) and its standing grant is
given where the contract says it is (4.2).

**Files:**

- Modify: `skills/tanto/roles/kanri.md`

**Named mechanisms this task changes, and every other site that names them:**
the **slot letters** of step 7's commit window are named in step 7 itself (a),
(b) and (c), in "The handover, in a plan and between plans", and in "The hotfix
lane". The first two change here. **"The hotfix lane" does not**: its sentence,
`the edit and the commit happen in slot (b) of step 7's commit window`, is
already right, because the hotfix is Kanri's own edit and slot (b) is where
Kanri's own edits are committed. issue-7ba4 counts it among the wrong sites and
it is not — that is recorded here so that no reviewer re-opens it. The sentence
at the end of step 7, `your exit shoroku was step 6's proposal and slot (a)'s
commit`, is likewise already right and stays. **Hosa's standing grant** is named
in `roles/hosa.md`'s own text, in "Human access" step 3 of this file, and in the
handshake step P4.5 changes; "Human access" step 3 already says the grant is
given "in the line you answer its handshake with" and is unchanged.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kanri.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O4.1** `and your own exit shoroku` — `skills/tanto/roles/kanri.md` 1 → 0 at
P4.2. Slot (b)'s list of Kanri's own edits, which named the exit shoroku that
slot (a) applies.

**O4.2** `step 7's slot (b) apply` — `skills/tanto/roles/kanri.md` 1 → 0 at
P4.3. The handover section's statement of which slot applied it. The needle
spans the letter and the word after it on purpose: `slot (b)` alone would still
match "The hotfix lane", which is right as it stands.

**O4.3** `is written, dispatch the` — `skills/tanto/roles/kanri.md` 1 → 0 at P4.1. The one dispatch of the three that named a kind instead of a `subagent_type`. The needle is the backtick-free half of the clause, because the kind's own name is backticked in the file and an `O` needle cannot carry a backtick.

**O4.4** `slot I give". You request` — `skills/tanto/roles/kanri.md` 1 → 0 at P4.5. The needle is the join across the point where the sentence gains the grant clause, narrower than the whole quoted phrase because that phrase alone also occurs, unchanged, in `roles/hosa.md:17` (Hosa's own restatement, which this task does not touch) — the join spans the insertion point and that second file does not carry it.

**O4.5** `once the human has answered. Delete` — `skills/tanto/roles/kanri.md`
1 → 0 at P4.4. Step 6's sentence wraps after `Delete`, so no single-line needle
sees `Delete requests wait for step 7.` whole; this one spans the join, which is
exactly where the text changes.

- [ ] **Step 3: The third shoroku dispatch names its seat**

**P4.1** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
   is written, dispatch the `shoroku` kind in apply mode with the
```

**P4.1 →**

```text
   is written, dispatch `subagent_type: tanto-shoroku` in apply mode with the
```

- [ ] **Step 4: Slot (b) is Kanri's own edits, and not its exit shoroku**

**P4.2** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
   been deleted; it waits for nothing. (b) Your
   own edits — the hotfix, the issues from step 4, and your own exit shoroku
   when a handover is due — each committed by you in its turn, or handed to a
```

**P4.2 →**

```text
   been deleted; it waits for nothing. (b) Your
   own edits — the hotfix and the issues from step 4 — each committed by you
   in its turn, or handed to a
```

- [ ] **Step 5: The handover names slot (a)**

**P4.3** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
   proposal and recommendation and step 7's slot (b) apply, already done when
```

**P4.3 →**

```text
   proposal and recommendation and step 7's slot (a) apply, already done when
```

- [ ] **Step 6: The delete request is early; the apply waits**

**P4.4** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
   recommender, and write the direction once the human has answered. Delete
   requests wait for step 7.
```

**P4.4 →**

```text
   recommender, and write the direction once the human has answered. A delete
   request goes out as soon as that session's recommendation and brief are on
   disk ("Exit shoroku", step 3); the apply waits for step 7.
```

- [ ] **Step 7: Hosa's standing grant at the handshake**

**P4.5** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
   - Kikaku gets your address and the open topics, if any. Hosa gets your
     address and one line, "tracked files only in a slot I give". You request
```

**P4.5 →**

```text
   - Kikaku gets your address and the open topics, if any. Hosa gets your
     address, one line, "tracked files only in a slot I give", and its
     standing grant,
     `human-access: granted — the chores the human hands you in your window — until this session ends`.
     You request
```

- [ ] **Step 8: `slot-needed:` gains a receiver**

**P4.6** `skills/tanto/roles/kanri.md` — insert after this 1 line

```text
   ruling and the commit subject stay yours, and you verify the diff.
```

**P4.6 →**

```text
   A `slot-needed: <what> — <paths>` from Hosa is answered the moment it
   arrives: `slot: now — commit and report` when no batch is in flight and the
   paths are not the in-flight plan's, `slot: at the next boundary` otherwise,
   the slot being this step at that boundary; Hosa's
   `committed <subject> — <reading>` is verified here like a chore's.
```

- [ ] **Step 9: The anchor for this task's insertion**

**A4.1** `skills/tanto/roles/kanri.md` — `grep -cF 'slot-needed: <what> — <paths>' skills/tanto/roles/kanri.md` — before: 0, after: 1

- [ ] **Step 10: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: exit 0, none `Failed`. This step runs before the Verify step below.

- [ ] **Step 11: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md -m "docs(tanto): Kanri's commit window, the third shoroku dispatch, and Hosa's two lines" -m "Kanri's own exit shoroku is applied in slot (a) and slot (b) is its own edits; the delete request goes out once the recommendation and brief are on disk; the apply dispatch names subagent_type: tanto-shoroku; step 7 answers Hosa's slot-needed:; the handshake gives Hosa its standing grant. The hotfix lane's slot (b) is right and is unchanged. Spec 2.1, 2.3, 4.1, 4.2." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 12: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 13: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-sweep-2.md --task 4
```

Expected: `task 4: verify clean`.

**Done when:** the six passages are present, A4.1 returns `1`, the needles of
O4.1 to O4.5 return `0`, "The hotfix lane" still says `slot (b)`, lint is clean,
and the commit carries its trailer.

---

### Task 5: Timing governs the automatic signals, and the handover file's unanswered mark

**Batch:** B. **Blocks:** A5.1, O5.1, P5.1 to P5.3.

The Timing list says which boundaries a handover signal may fire at; the human's
word is not one of those signals and is obeyed at whichever boundary comes next
(spec 2.4). The handover template puts the unanswered-line mark under In flight
while the role file puts it under Live peers, and the role file is right, so the
template moves (2.2).

**Files:**

- Modify: `skills/tanto/roles/kanri.md`
- Modify: `skills/tanto/templates/kanri-handover.md`

**Named mechanisms this task changes, and every other site that names them:**
the **unanswered-line mark** is named in `roles/kanri.md`'s handover section
(`Live peers lists every peer of every open topic, each with its Topic and what
it is waiting for, and marks the ones whose last line you had not answered`),
in `templates/kanri-handover.md`'s In flight section, and in its Live peers
section. Only the template changes; the role file's sentence is the one both
sides now agree with, and it is deliberately untouched.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kanri.md skills/tanto/templates/kanri-handover.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`.

- [ ] **Step 2: The old value this task contradicts**

**O5.1** `Peers whose last line this session did not answer` — `skills/tanto/templates/kanri-handover.md` 1 → 0 at P5.2. The In flight bullet
that duplicated Live peers' mark in the wrong section. The role file's own
wording, `marks the ones whose last line you had not answered`, is **not** a
needle: it is the sentence both sides now agree with.

- [ ] **Step 3: The human's word is obeyed at the next boundary of any topic**

**P5.1** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
kind and holds no handover of yours. Because the trigger is
checked before the next prompt is written, a handover that is due stops the
```

**P5.1 →**

```text
kind and holds no handover of yours. That list governs the signals you check
for yourself — the tenure, a compaction, the ceiling; the human's word,
signal 2, is obeyed at whichever boundary comes next, of any topic, and is
never deferred. Because the trigger is checked before the next prompt is
written, a handover that is due stops the
```

- [ ] **Step 4: The In flight bullet goes**

**P5.2** `skills/tanto/templates/kanri-handover.md` — replace exactly these 4 lines

```text
- Peers whose last line this session did not answer — <name> [<ref>] — <the
  line, one per line, or "none">; each re-sends it to the successor's
  `kanri-address:`
- Agents of this session still running — <label and what it was to deliver,
```

**P5.2 →**

```text
- Agents of this session still running — <label and what it was to deliver,
```

- [ ] **Step 5: Live peers carries the mark**

**P5.3** `skills/tanto/templates/kanri-handover.md` — replace exactly this 1 line

```text
- <role> — <topic> — <name> [<ref>] — <what that session is waiting for>
```

**P5.3 →**

```text
- <role> — <topic> — <name> [<ref>] — <what that session is waiting for> —
  <"answered", or the last line it sent that this session did not answer;
  that peer re-sends it to the successor's `kanri-address:`>
```

- [ ] **Step 6: The anchor for this task**

**A5.1** `skills/tanto/roles/kanri.md` — `grep -c 'is obeyed at whichever boundary comes next' skills/tanto/roles/kanri.md` — before: 0, after: 1

- [ ] **Step 7: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md skills/tanto/templates/kanri-handover.md
```

Expected: exit 0, none `Failed`. This step runs before the Verify step below.

- [ ] **Step 8: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md skills/tanto/templates/kanri-handover.md -m "docs(tanto): Timing governs the automatic signals; the unanswered mark moves to Live peers" -m "The Timing list is about the signals Kanri checks for itself; the human's word is obeyed at whichever boundary comes next, of any topic. The handover template's In flight bullet for unanswered lines is deleted and its content moves into the Live peers line, which is where the role file already puts it. Spec 2.2, 2.4." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 9: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 10: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-sweep-2.md --task 5
```

Expected: `task 5: verify clean`.

**Done when:** the three passages are present, A5.1 returns `1`, O5.1's needle
returns `0`, the role file's Live peers sentence is unchanged, lint is clean,
and the commit carries its trailer.

---

### Task 6: the workspace listing, the top-family tally, and the pre-spec act's closure mark

**Batch:** B. **Blocks:** A6.1, O6.1, P6.1 to P6.4.

Three obligations with no writer. Kanri lists `.tanto/` itself at its start and
at every plan close and reports what does not belong (spec 6.4). The ledger's
fixed row "top-family one-shots per plan, counted by kind" gains the Session
events lines it is counted from (6.6). A pre-spec act ruled before Sekkei's spec
gains a closure mark in the Progress line (6.7).

**Files:**

- Modify: `skills/tanto/roles/kanri.md`
- Modify: `skills/tanto/templates/kanri.md`

**Named mechanisms this task changes, and every other site that names them:**
the **Progress line's standing clauses** are named in `templates/kanri.md`'s
Progress placeholder, which P6.4 extends, and in `roles/kanri.md` wherever a
clause is written or dropped; P6.3 adds the one sentence that writes the new
clause. The **one-shots row** is named in `templates/kanri.md`'s Measurements
table, whose row text is unchanged, and in `roles/kanri.md` step 6, which P6.2
gives it a writer in.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kanri.md skills/tanto/templates/kanri.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`.

- [ ] **Step 2: The old value this task contradicts**

**O6.1** `place>` — `skills/tanto/templates/kanri.md` 1 → 0 at P6.4. The
Progress placeholder's closing angle bracket, which is the point where the
standing clauses end and therefore the point the new clause is appended at. The
placeholder's earlier text is unchanged, so no needle taken from its middle
would span the change; this one is the last two characters of the whole
placeholder and nothing else in the file.

- [ ] **Step 3: Kanri lists the workspace root**

**P6.1** `skills/tanto/roles/kanri.md` — insert after this 1 line

```text
   every run, and that is no longer your concern.
```

**P6.1 →**

```text
   Then list `.tanto/` itself and report in your start line every entry that
   is none of these: `.gitignore`, `.markdownlint-cli2.yaml`, `roster.md`,
   `roster-archive.md`, `kanri-handover.md`, `inbox/`, `kikaku/`, `kaiseki/`,
   one directory per topic the roster or the archive names — open, or closed
   and kept under the Workspace section's retention rule — and your
   predecessors' `t0-*` and `exit-kanri-*` files; the human decides what to do
   with the rest, and an entry the human has once said to keep is listed
   under the ledger's Rulings and not reported again. Make the same listing
   at every plan close, in the close's own line.
```

- [ ] **Step 4: The top-family dispatches are tallied as they happen**

**P6.2** `skills/tanto/roles/kanri.md` — insert after these 2 lines

```text
   Measurements per-boundary entry from the two readings, and a Measurements
   deferrals entry for anything deferred here.
```

**P6.2 →**

```text
   Write a Session events line `dispatch: <kind> on <family>` for every
   dispatch since the last boundary whose kind `tanto.json` puts on the top
   family of the ladder — `fable` today, and the merged config decides, not
   the family a session happens to run on, so an `opus` `shoroku` dispatch
   does not count while a `fable` `plan.coldread` does: your own
   `plan.coldread` and `branch.review`, and the ones a peer's line implies —
   `review-ready:` is one `brief.write`, a plan-review path is one
   `plan.review`, a spec-review path is one `spec.review` if the config puts
   it there — and fill the one-shots row at the close by counting those lines
   by kind.
```

- [ ] **Step 5: A pre-spec act names its result path in the ruling**

**P6.3** `skills/tanto/roles/kanri.md` — insert after these 3 lines

```text
   batch prompts rather than the role text on disk, and the boundary the plan
   names for a role start or replacement (contract rule 11); every batch
   prompt and a handover file then carry it.
```

**P6.3 →**

```text
   A pre-spec act you rule — a diagnosis, a dump analysis, before Sekkei's
   spec — names its result path in the ruling, and the ledger's Progress line
   carries `<act> — result: <path> (absent | present)` until the spec cites
   the file.
```

- [ ] **Step 6: The Progress line carries the closure mark**

**P6.4** `skills/tanto/templates/kanri.md` — replace exactly these 2 lines

```text
context=<n>, at <batch X | the spec stage | the plan stage>)` in its
place>
```

**P6.4 →**

```text
context=<n>, at <batch X | the spec stage | the plan stage>)` in its
place; and, for each pre-spec act ruled before Sekkei's spec — a diagnosis, a
dump analysis — the clause `<act> — result: <path> (absent | present)`,
rewritten to `present` when the file lands and dropped once the spec cites it>
```

- [ ] **Step 7: The anchor for this task's insertions**

**A6.1** `skills/tanto/roles/kanri.md` — `grep -cF 'dispatch: <kind> on <family>' skills/tanto/roles/kanri.md` — before: 0, after: 1

- [ ] **Step 8: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md skills/tanto/templates/kanri.md
```

Expected: exit 0, none `Failed`. This step runs before the Verify step below.

- [ ] **Step 9: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md skills/tanto/templates/kanri.md -m "docs(tanto): the workspace listing, the top-family tally, and a pre-spec act's closure mark" -m "Kanri lists .tanto/ at its start and at every plan close and reports what is not in the known set; loop step 6 writes the Session events lines the one-shots row is counted from; a pre-spec act names its result path in the ruling and the Progress line carries it until the spec cites the file. Spec 6.4, 6.6, 6.7." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 10: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 11: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-sweep-2.md --task 6
```

Expected: `task 6: verify clean`.

**Done when:** the four passages are present, A6.1 returns `1`, O6.1's needle
returns `0`, lint is clean, and the commit carries its trailer.

---

### Task 7: `roles/sekkei.md` — the review gates, the dialogue rule, and the document that holds still

**Batch:** C. **Blocks:** A7.1, O7.1, O7.2, P7.1 to P7.5.

Four issues in Sekkei's two steps. "Before the review" is made exact and the
spec reviewer gains a third input (spec 5.1); the reviewer is no longer called
read-only while being handed a file to write (5.2); a decision reaches
`dialogue.md` before it reaches any document (5.3); the document under review
holds still and the review records the hash it read (5.4), which
`templates/review-brief.md`'s `Document:` line gains a slot for.

**Files:**

- Modify: `skills/tanto/roles/sekkei.md`
- Modify: `skills/tanto/templates/review-brief.md`

**Named mechanisms this task changes, and every other site that names them:**
the **"read-only" seat** is named in `SKILL.md`'s review-brief bullet (task 1,
P1.9), in `roles/sekkei.md` Step 2 (P7.2), and in `roles/keikaku.md` Step 4
item 3 (task 8, P8.1). Kanri's cold-read dispatch names no "read-only" and is
unchanged. The **`Document:` line's fields** are named in
`templates/review-brief.md` (P7.5) and in the two dispatches that name the hash
line as part of the output — P7.4 here and P8.3 in task 8.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/sekkei.md skills/tanto/templates/review-brief.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O7.1** `Before the review, a passage` — `skills/tanto/roles/sekkei.md` 1 → 0
at P7.1. "Before the review" named no event a session can point at: the review
is a dispatch, a report and a ruling, and the check has to precede the spec
commit as well.

**O7.2** `read-only** reviewer` — `skills/tanto/roles/sekkei.md` 1,
`skills/tanto/roles/keikaku.md` 1 → 0 at P7.2 and at P8.1 in task 8. One needle,
two files, two tasks in one batch; a hit left in either after batch C is a seat
still called read-only while being handed a file to write.

- [ ] **Step 3: "Before" made exact**

**P7.1** `skills/tanto/roles/sekkei.md` — replace exactly these 2 lines

```text
Before the review, a passage in the spec that rewrites another role's
procedure goes to that role's session for a check, when that session is live:
```

**P7.1 →**

```text
Before the spec commit and before the reviewer is dispatched, a passage in the
spec that rewrites another role's procedure goes to that role's session for a
check, when that session is live:
```

- [ ] **Step 4: The reviewer's seat and its third input**

**P7.2** `skills/tanto/roles/sekkei.md` — replace exactly these 4 lines

```text
Dispatch a **read-only** reviewer on `spec.review`, naming
`subagent_type: tanto-spec-review` and its `model` together. Give it the spec
and the repo's `docs/decisions/` and `docs/requirements/`, ask it to check the
spec against them, and have it write its report to
```

**P7.2 →**

```text
Dispatch a reviewer on `spec.review` — read files; write exactly one file, the
report named below — naming
`subagent_type: tanto-spec-review` and its `model` together. Give it the spec,
the repo's `docs/decisions/` and `docs/requirements/`, and — as a third input
— the files the spec's per-file change list touches, with the question which
sentences in them the design contradicts that the spec's Old values list does
not name; ask it to check the spec against all three, and have it write its
report to
```

- [ ] **Step 5: A decision reaches `dialogue.md` first**

**P7.3** `skills/tanto/roles/sekkei.md` — insert after these 2 lines

```text
brief writer reads it, and T1's shoroku takes it as an input — under this
protocol it is the one record of the human's own words.
```

**P7.3 →**

```text

**A decision reaches `dialogue.md` before it reaches any document.** Write the
turn — the question you put, the human's answer verbatim, and your reading of
it — and only then edit the spec, the plan, or a block. The case that breaks
this is the decision that arrives **mid-turn**, in a message answering nothing
you asked: it has no question to file it under, so file it under the work it
interrupted, and give it a `D-n` of its own. A decision you acted on and did
not record is indistinguishable, to every later reader, from one you invented
— and the reader who finds it is a reviewer filing a scope finding against
your own document.
```

- [ ] **Step 6: The document holds still, and the review records what it read**

**P7.4** `skills/tanto/roles/sekkei.md` — insert after these 2 lines

```text
Then send Kanri one line with the report path: Kanri adopts from its Shoroku
candidates.
```

**P7.4 →**

```text

Between the reviewer's dispatch and its report, and between the brief writer's
dispatch and the human's answers, you do not edit the document; a change you
need waits for the answers and is a further commit, or a further edit to the
draft. The reviewer and the brief writer each record, in their file's first
lines, the document's `git hash-object <path>` at the moment they read it, so
that a line number in a finding has a fixed referent.
```

- [ ] **Step 7: The brief's `Document:` line gains the hash slot**

**P7.5** `skills/tanto/templates/review-brief.md` — replace exactly this 1 line

```text
Document: <path> — brief written <YYYY-MM-DD> on <model family> for the chat
```

**P7.5 →**

```text
Document: <path> — hash <git hash-object of the document as read> — brief
written <YYYY-MM-DD> on <model family> for the chat
```

- [ ] **Step 8: The anchor for this task's insertions**

**A7.1** `skills/tanto/roles/sekkei.md` — `grep -c 'A decision reaches' skills/tanto/roles/sekkei.md` — before: 0, after: 1

- [ ] **Step 9: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/sekkei.md skills/tanto/templates/review-brief.md
```

Expected: exit 0, none `Failed`. This step runs before the Verify step below.

- [ ] **Step 10: Commit**

```bash
git commit --only skills/tanto/roles/sekkei.md skills/tanto/templates/review-brief.md -m "docs(tanto): Sekkei's review gates, the dialogue rule, and the fixed referent" -m "The role-procedure check precedes the spec commit and the reviewer dispatch; the spec reviewer takes the files the change list touches as a third input; a seat that must write names its one file; a decision reaches dialogue.md before any document; the document under review holds still and the brief records the hash it read, which the review-brief template's Document: line now has a slot for. Spec 5.1, 5.2, 5.3, 5.4." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 11: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 12: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-sweep-2.md --task 7
```

Expected: `task 7: verify clean`.

**Done when:** the five passages are present, A7.1 returns `1`, O7.1's needle
returns `0` and O7.2's remaining hit is only in `roles/keikaku.md`, lint is
clean, and the commit carries its trailer.

---

### Task 8: `roles/keikaku.md` — the reviewer's seat, the dialogue rule, the fixed referent, and two drafting conventions

**Batch:** C. **Blocks:** A8.1, P8.1 to P8.4.

Keikaku's half of the three rules Sekkei took in task 7, plus the two drafting
conventions the second sweep's own experience asks for (spec 6.5): a task that
changes a named mechanism lists every other site that names it, and a task that
creates a Markdown file writes the line-ending restore into its own steps.

The `O` needle for the reviewer's seat is **O7.2** in task 7; it is not
re-declared here.

**Files:**

- Modify: `skills/tanto/roles/keikaku.md`

**Named mechanisms this task changes, and every other site that names them:**
the **"read-only" seat**, as task 7 lists it — `SKILL.md` (P1.9),
`roles/sekkei.md` (P7.2), and this file (P8.1). The **list of what Keikaku adds
to the plan** is named only here, in Step 3's bullets, and gains two of them.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/keikaku.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The reviewer's seat**

**P8.1** `skills/tanto/roles/keikaku.md` — replace exactly this 1 line

```text
3. Dispatch a **read-only** reviewer on `plan.review`, naming
```

**P8.1 →**

```text
3. Dispatch a reviewer on `plan.review` — read files; write exactly one file,
   the report named below — naming
```

- [ ] **Step 3: A decision reaches `dialogue.md` first, here too**

**P8.2** `skills/tanto/roles/keikaku.md` — insert after these 2 lines

```text
  whole topic; Kanri may read it at any time, the brief writer reads it, and
  T1's shoroku takes it as an input.
```

**P8.2 →**

```text

**A decision reaches `dialogue.md` before it reaches any document.** Write the
turn — the question you put, the human's answer verbatim, and your reading of
it — and only then edit the spec, the plan, or a block. The case that breaks
this is the decision that arrives **mid-turn**, in a message answering nothing
you asked: it has no question to file it under, so file it under the work it
interrupted, and give it a `D-n` of its own. A decision you acted on and did
not record is indistinguishable, to every later reader, from one you invented
— and the reader who finds it is a reviewer filing a scope finding against
your own document.
```

- [ ] **Step 4: The plan holds still, and the review records what it read**

**P8.3** `skills/tanto/roles/keikaku.md` — insert after this 1 line

```text
   send Kanri one line with the report path.
```

**P8.3 →**

```text
   Between the reviewer's dispatch and its report, and between the brief
   writer's dispatch and the human's answers, you do not edit the plan; a
   change you need waits for the answers and is a further edit before the
   commit. The reviewer and the brief writer each record, in their file's
   first lines, the plan's `git hash-object <path>` at the moment they read
   it, so that a line number in a finding has a fixed referent.
```

- [ ] **Step 5: Two drafting conventions**

**P8.4** `skills/tanto/roles/keikaku.md` — insert after these 2 lines

```text
  constraints, Kanri's orders line, and the batch prompts (contract rule
  11).
```

**P8.4 →**

```text
- a **named-mechanism** rule for the tasks: a task that introduces or changes
  a named mechanism — a slot letter, a grant clause, a status word, a section
  pointer — lists in its own text every other site in the same file, and in
  the files the plan touches, that names the same mechanism, so that its
  reviewer checks them together (issue-7ba4 and issue-c30e are what this
  catches);
- a **line-ending** rule for the tasks: a task that creates a Markdown file
  and later checks its line endings writes the restore —
  `git checkout -- <path>` after the commit, or the repository's equivalent —
  into the task's own steps, not only into the stop condition, because a
  created file lands `w/lf` on this host every time (measured five of five in
  the tanto-cost run).
```

- [ ] **Step 6: The anchor for this task's insertions**

**A8.1** `skills/tanto/roles/keikaku.md` — `grep -c 'A decision reaches' skills/tanto/roles/keikaku.md` — before: 0, after: 1

- [ ] **Step 7: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/keikaku.md
```

Expected: exit 0, none `Failed`. This step runs before the Verify step below.

- [ ] **Step 8: Commit**

```bash
git commit --only skills/tanto/roles/keikaku.md -m "docs(tanto): Keikaku's reviewer seat, dialogue rule, fixed referent, and two drafting conventions" -m "The plan reviewer is a seat that writes exactly one file; a decision reaches dialogue.md before any document; the plan holds still between the dispatch and the answers and the review records the hash it read; Step 3 gains the named-mechanism rule and the line-ending rule. Spec 5.2, 5.3, 5.4, 6.5." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 9: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 10: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-sweep-2.md --task 8
```

Expected: `task 8: verify clean`.

**Done when:** the four passages are present, A8.1 returns `1`, O7.2's needle
now returns `0` in both role files and in `SKILL.md`, lint is clean, and the
commit carries its trailer.

---

### Task 9: `roles/kikaku.md`'s scope and model rule, and the baseline sentence on both sides

**Batch:** C. **Blocks:** A9.1, O9.1, P9.1 to P9.4.

Kikaku says it writes only under `.tanto/kikaku/` and then creates two files
elsewhere; the narrow reading wins, because a Kanri has always started before
any Kikaku and Kanri's Start step 2 has written them (spec 4.3). Kikaku is the
one role file with no model sentence, and on `fable` an inherited model is the
costliest (4.4). And the word "baseline", which Kanri's dispatch passes and
`shoroku` reads, means the tree an item's destination and reason are judged
against, never a filter that drops the item (section 7) — a cross-file pair, so
both halves land here.

**Files:**

- Modify: `skills/tanto/roles/kikaku.md`
- Modify: `skills/shoroku/SKILL.md`
- Modify: `skills/tanto/roles/kanri.md`

**Named mechanisms this task changes, and every other site that names them:**
the **two workspace files** `.tanto/.gitignore` and `.tanto/.markdownlint-cli2.yaml`
are named in `roles/kanri.md`'s Start step 2, in `roles/kikaku.md`'s "The
output" (deleted here), and in `SKILL.md`'s Artifacts row, which names Kanri, a
standalone Kaiseki, and a bug-report writer as their writers. That row is right
once Kikaku's paragraph is gone and is **unchanged**. The **baseline** is named
in `roles/kanri.md`'s step 2 and in `skills/shoroku/SKILL.md`'s "File source
specifics"; both are here.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kikaku.md skills/shoroku/SKILL.md skills/tanto/roles/kanri.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`.

- [ ] **Step 2: The old value this task contradicts**

**O9.1** `untracked, the second keeps the editor` — `skills/tanto/roles/kikaku.md` 1 → 0 at P9.1. Kanri's Start step 2 states the same obligation in its own words — `untracked without touching the repository's own .gitignore, the` / `second keeps the editor's markdownlint quiet` — and returns `0` on this needle already, which is why a needle taken from Kikaku's own wrapping is the one that spans the deletion. Kanri's sentence is the one both roles now rely on and **stays**.

- [ ] **Step 3: Kikaku's write scope is what it says**

**P9.1** `skills/tanto/roles/kikaku.md` — replace exactly these 8 lines

```text
Make sure `.tanto/.gitignore` exists and holds `*`, and
`.tanto/.markdownlint-cli2.yaml` exists and holds `config:` with
`default: false` indented two spaces beneath it. Write each only when it is
absent and never overwrite either: the first keeps everything under
`.tanto/` untracked, the second keeps the editor's markdownlint quiet on
files the commit path never lints.

When something is decided, write `.tanto/kikaku/<YYYY-MM-DD>-<slug>.md`
```

**P9.1 →**

```text
When something is decided, write `.tanto/kikaku/<YYYY-MM-DD>-<slug>.md`
```

- [ ] **Step 4: Kikaku restates the model rule**

**P9.2** `skills/tanto/roles/kikaku.md` — insert after these 3 lines

```text
You read the repository, `docs/`, and `.tanto/`. You write only under
`.tanto/kikaku/`, and never under `docs/`: what is settled here reaches a
requirement, a decision, or an issue through Kanri, not by your hand.
```

**P9.2 →**

```text

You dispatch nothing as a rule; a read you need, you make yourself. If you
ever dispatch — an ad-hoc search — the contract's rule applies unchanged:
`subagent_type: tanto-default` with the `model` `tanto.json` gives `default`,
never an omitted `model`, which would inherit this session's fable.
```

- [ ] **Step 5: What a baseline is, on `shoroku`'s side**

**P9.3** `skills/shoroku/SKILL.md` — replace exactly these 2 lines

```text
entries. Do **not** deduplicate against existing `docs/<type>/*.md` —
overlaps surface in the proposal and the user accepts or rejects per item.
```

**P9.3 →**

```text
entries. Do **not** deduplicate against existing `docs/<type>/*.md` —
overlaps surface in the proposal and the user accepts or rejects per item; in
recommend mode the baseline a caller names is what an item's destination and
reason are judged against, never a filter that drops it.
```

- [ ] **Step 6: What a baseline is, on Kanri's side**

**P9.4** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
   — with `docs/` as the baseline, and name the output:
```

**P9.4 →**

```text
   — with `docs/` as the baseline for destinations and reasons, and name the
   output:
```

- [ ] **Step 7: The anchor for this task's insertion**

**A9.1** `skills/tanto/roles/kikaku.md` — `grep -c 'You dispatch nothing as a rule' skills/tanto/roles/kikaku.md` — before: 0, after: 1

- [ ] **Step 8: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kikaku.md skills/shoroku/SKILL.md skills/tanto/roles/kanri.md
```

Expected: exit 0, none `Failed`. This step runs before the Verify step below.

- [ ] **Step 9: Commit**

```bash
git commit --only skills/tanto/roles/kikaku.md skills/shoroku/SKILL.md skills/tanto/roles/kanri.md -m "docs(tanto): Kikaku's scope and model rule, and what a shoroku baseline is" -m "Kikaku no longer creates the two workspace files Kanri's start already writes, and restates the model rule for the dispatch it does not normally make; the baseline a recommend-mode caller names is what a destination and a reason are judged against, on both sides of the dispatch. Spec 4.3, 4.4, 7." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 10: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 11: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-sweep-2.md --task 9
```

Expected: `task 9: verify clean`.

**Done when:** the four passages are present, A9.1 returns `1`, O9.1's needle
returns `0` in `roles/kikaku.md` (and already reads `0` in `roles/kanri.md`,
which states the same obligation in different words and is not a residual),
`SKILL.md`'s Artifacts row for the two files is unchanged, lint is clean, and
the commit carries its trailer.

---

### Task 10: `templates/shoroku-brief.md`, `shoroku`'s recommend mode, and the counts a new template moves

**Batch:** D. **Blocks:** A10.1, O10.1 to O10.7, W10.1, P10.2 to P10.13.

The check brief's English source is created, `shoroku`'s recommend mode learns
to write it, the contract's template count and list take it in, and the four
structural counts the consistency note keeps for the skill's file layout move
with it. The note's own preamble states the rule this task obeys: *every plan
that adds a template edits four of them — this bullet, check 1's path list and
its expected count, check 2's expected count, and check 3's map.*

Check 3's new MAP row names `roles/kanri.md` as the template's reader, and the
citation that satisfies it lands in **task 11**. Check 3 is therefore green at
batch D's boundary, not at this task's. That is the spec's own cut (Fixed input
4) and is stated in Open points above.

`skills/tanto/templates/**` is **not** linted by markdownlint; `skills/shoroku/`
and `docs/notes/` are.

**Files:**

- Create: `skills/tanto/templates/shoroku-brief.md`
- Modify: `skills/tanto/SKILL.md`
- Modify: `skills/shoroku/SKILL.md`
- Modify: `docs/notes/tanto-consistency-checks.md`

**Named mechanisms this task changes, and every other site that names them:**
the **template count** is named in `SKILL.md`'s "Thirteen of them:" sentence and
in the note's "Versions these checks assume" bullet, check 1's `Expected:`
paragraph and check 2's — all four here. The **group headings' spelling** is
fixed on `shoroku`'s side here and at every `tanto` reader in task 11; check 18,
landed in task 12, is the pairing's guard on both sides.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/SKILL.md skills/shoroku/SKILL.md docs/notes/tanto-consistency-checks.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`. The created
template has no `i/` entry yet; step 12 restores its working-tree ending after
the commit.

- [ ] **Step 2: The old values this task contradicts**

**O10.1** `Thirteen of them:` — `skills/tanto/SKILL.md` 1 → 0 at P10.2. A set
whose cardinality changes is reached by no new term at all, which is why the
needle is the old count's own words.

**O10.2** `## recommended adopt` — `skills/shoroku/SKILL.md` 1 → 0 at P10.3. The contract for the recommendation's three group headings, stated in lowercase on the one side that writes them while both recommendations on disk were written capitalized. That mismatch is the failure issue-e916 predicted, and it made Kanri's `sections` read of `unsure` return nothing. The needle keeps the `##` so that it is the *heading* spelling and not the prose one the `tanto` readers carry, which O11.3 and O11.4 take.

**O10.3** `Twenty-six skill files` — `docs/notes/tanto-consistency-checks.md` 1
→ 0 at P10.6.

**O10.4** `all twenty-six paths` — `docs/notes/tanto-consistency-checks.md` 1 →
0 at P10.8.

**O10.5** `Seven role files, thirteen templates` — `docs/notes/tanto-consistency-checks.md` 1 → 0 at P10.8. The same paragraph's breakdown, which no needle taken from the count alone would reach.

**O10.6** `Expected: twenty-four` — `docs/notes/tanto-consistency-checks.md` 1 →
0 at P10.9. The needle stops before the backtick-quoted `ok`, because an `O`
lead's needle is itself written inside backticks and cannot contain one.

**O10.7** `Eight of the twenty are Kanri` — `docs/notes/tanto-consistency-checks.md` 1 → 0 at P10.12. Check 3's tally spans both numbers this task moves, the total and Kanri's share, and is the only needle that does.

- [ ] **Step 3: The check brief's English source**

**W10.1** `skills/tanto/templates/shoroku-brief.md` — new file, 47 lines

```text
# Shoroku check brief — <stage> — <topic or Kanri's name>

Written by the `shoroku` recommender in the same dispatch as the
recommendation, at `.tanto/<topic>/<stage>-brief.md`, or
`.tanto/<stage>-brief.md` for T0 and Kanri's own exit, beside the
recommendation and untracked under `.tanto/.gitignore`. Every part of the
brief is written in the chat's language, which the dispatch names; this
template is the English source the recommender renders. The form markers are
the exception and stay exactly as they are here: the four `##` headings, the
bracketed tag word, the `<n>.` numbers, and the label `See:` with the heading
that follows it. The brief selects and renders the recommendation's own
judgment; it does not analyze anew, and the recommendation stays the file the
apply reads.

Document: <the recommendation's path> — <stage> — written <YYYY-MM-DD> on
<model family> for the chat language <language>.

Each group below holds one line per item of that group, in the
recommendation's order, in this shape:

    <n>. [adopt | reject | unsure] <destination> — <the candidate in one sentence> — <the one-line reason> — See: <the item's ### heading, verbatim>

The numbers are the recommendation's own, one run across the whole file, never
restarted per group, and every `###` heading of the recommendation appears
after exactly one `See:`. A group with no item keeps its heading and carries
the single rendered line `none`, so that the four headings are present at
every stage.

## How to answer

Answer `OK` to take every item as recommended. Name the numbers that go the
other way instead — `2 と 5 だけ`, `3 はやめて` — or give an edit,
`5 の severity は high で`. An item you do not mention goes as recommended.
What you answer is what Kanri writes into `<stage>-direction.md`, item by
item; the apply reads that file and the recommendation, never this brief.

## Recommended adopt

<n>. [adopt] <destination> — <the candidate in one sentence> — <the one-line reason> — See: <the item's ### heading, verbatim>

## Recommended reject

<n>. [reject] <destination> — <the candidate in one sentence> — <the one-line reason> — See: <the item's ### heading, verbatim>

## Unsure

<n>. [unsure] <destination> — <the candidate in one sentence> — <the one-line reason> — <the question this item could not settle, one clause> — See: <the item's ### heading, verbatim>
```

- [ ] **Step 4: Fourteen templates**

**P10.2** `skills/tanto/SKILL.md` — replace exactly these 7 lines

```text
Templates are copied and filled, never restated in prose. Thirteen of them:
`templates/roster.md`, `templates/roster-archive.md`, `templates/kanri.md`,
`templates/kanri-handover.md`, `templates/bug-report.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/review-brief.md`, `templates/tanto.json`,
`templates/kikaku-decision.md`, and `templates/agent.md`.
```

**P10.2 →**

```text
Templates are copied and filled, never restated in prose. Fourteen of them:
`templates/roster.md`, `templates/roster-archive.md`, `templates/kanri.md`,
`templates/kanri-handover.md`, `templates/bug-report.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/review-brief.md`, `templates/shoroku-brief.md`,
`templates/tanto.json`, `templates/kikaku-decision.md`, and
`templates/agent.md`.
```

- [ ] **Step 5: The three group headings, as they are written**

**P10.3** `skills/shoroku/SKILL.md` — replace exactly this 1 line

```text
text — `## recommended adopt`, `## recommended reject`, `## unsure` —
```

**P10.3 →**

```text
text — `## Recommended adopt`, `## Recommended reject`, `## Unsure` —
```

- [ ] **Step 6: One `###` heading per item**

**P10.4** `skills/shoroku/SKILL.md` — replace exactly these 2 lines

```text
each item quoted in full from its source so that the
file stands alone as the apply's input, and each carrying its destination, a
```

**P10.4 →**

```text
each item quoted in full from its source so that the
file stands alone as the apply's input, each item under its own `###`
heading, `### <n> — <title>`, `<n>` being the item's number in the proposal —
unique across the file, never restarted per group; where the source is not a
numbered proposal, as at T1, a running number in the order the items are
written — so that a reader can point at an item by its heading and the
human's answer names the item by the number the proposal gave it, and each
carrying its destination, a
```

- [ ] **Step 7: The mode's inputs**

**P10.5** `skills/shoroku/SKILL.md` — replace exactly these 2 lines

```text
**Recommend mode.** Invoked with a source — a file, or a file and the names
of the sections to read — and an output path. Run the workflow up to the
```

**P10.5 →**

```text
**Recommend mode.** Invoked with a source — a file, or a file and the names
of the sections to read — an output path, and a baseline, the `docs/` tree an
item's destination and reason are judged against; and, when the caller wants
the check brief, a brief path, a template, and a chat language. Run the
workflow up to the
```

- [ ] **Step 8: The second output**

**P10.13** `skills/shoroku/SKILL.md` — insert after these 2 lines

```text
translation in the chat's language. Do not wait for `Direction?`, and write
nothing under `docs/`.
```

**P10.13 →**

```text
When the caller also names a brief path, a template, and a chat language,
write the check brief from that template at that path, rendered in that
language, in the same run and from the same judgment: one line per item under
the same three headings, each ending in `See:` and the item's `###` heading
verbatim. The brief is the second and last file this mode writes.
```

The apply-mode paragraph is unchanged: it reads the recommendation and the
direction, never the brief.

- [ ] **Step 9: The note's structural bullet**

**P10.6** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```text
- **Twenty-six skill files, thirteen of them templates**, as check 1 lists
```

**P10.6 →**

```text
- **Twenty-seven skill files, fourteen of them templates**, as check 1 lists
```

- [ ] **Step 10: Check 1's path list and its expected count**

**P10.7** `docs/notes/tanto-consistency-checks.md` — insert after this 1 line

```text
  skills/tanto/templates/review-brief.md \
```

**P10.7 →**

```text
  skills/tanto/templates/shoroku-brief.md \
```

**P10.8** `docs/notes/tanto-consistency-checks.md` — replace exactly these 3 lines

```text
Expected: all twenty-six paths listed, no `No such file or directory`.
Seven role files, thirteen templates, four scripts, the contract and the
skill's own `README.md`.
```

**P10.8 →**

```text
Expected: all twenty-seven paths listed, no `No such file or directory`.
Seven role files, fourteen templates, four scripts, the contract and the
skill's own `README.md`.
```

- [ ] **Step 11: Check 2's expected count and its list**

**P10.9** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```text
Expected: twenty-four `ok` lines — `roles/hosa.md`, `roles/jisso.md`,
```

**P10.9 →**

```text
Expected: twenty-five `ok` lines — `roles/hosa.md`, `roles/jisso.md`,
```

**P10.10** `docs/notes/tanto-consistency-checks.md` — replace exactly these 2 lines

```text
`templates/review-brief.md`, `templates/roster-archive.md`,
`templates/roster.md`, and `templates/tanto.json`, whose relative order for the
```

**P10.10 →**

```text
`templates/review-brief.md`, `templates/roster-archive.md`,
`templates/roster.md`, `templates/shoroku-brief.md`, and
`templates/tanto.json`, whose relative order for the
```

- [ ] **Step 12: Check 3's map and its tally**

**P10.11** `docs/notes/tanto-consistency-checks.md` — insert after this 1 line

```text
templates/kaiseki-brief.md skills/tanto/roles/kanri.md
```

**P10.11 →**

```text
templates/shoroku-brief.md skills/tanto/roles/kanri.md
```

**P10.12** `docs/notes/tanto-consistency-checks.md` — replace exactly these 2 lines

```text
Expected: twenty `ok` lines, no `UNCITED`. Eight of the twenty are Kanri's —
seven templates Kanri copies itself, plus the agent definition, which every
```

**P10.12 →**

```text
Expected: twenty-one `ok` lines, no `UNCITED`. Nine of the twenty-one are
Kanri's — eight templates Kanri copies itself, plus the agent definition,
which every
```

- [ ] **Step 13: The anchor for this task's insertions**

**A10.1** `skills/tanto/SKILL.md` — `grep -c 'Fourteen of them:' skills/tanto/SKILL.md` — before: 0, after: 1

- [ ] **Step 14: Lint**

```bash
./scripts/lint.sh skills/tanto/SKILL.md skills/shoroku/SKILL.md docs/notes/tanto-consistency-checks.md skills/tanto/templates/shoroku-brief.md
```

Expected: exit 0, none `Failed`. This step runs before the Verify step below.
The template is under `skills/tanto/templates/**`, which markdownlint ignores;
it is named here so the other pre-commit hooks see it.

- [ ] **Step 15: Commit**

```bash
git add skills/tanto/templates/shoroku-brief.md && git commit --only skills/tanto/templates/shoroku-brief.md skills/tanto/SKILL.md skills/shoroku/SKILL.md docs/notes/tanto-consistency-checks.md -m "docs(tanto): the shoroku check brief's template and the recommend mode that writes it" -m "templates/shoroku-brief.md is the English source the recommender renders in the chat's language; recommend mode names its inputs, writes one ### heading per item, spells the three group headings as they are written on disk, and writes the brief as its second and last file; the contract's template count and the note's four structural counts move with it. Spec 1.2, 1.3, 1.6, 8.5." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 16: Restore the created file's line ending**

```bash
git checkout -- skills/tanto/templates/shoroku-brief.md && git ls-files --eol skills/tanto/templates/shoroku-brief.md
```

Expected: `i/lf w/crlf attr/text=auto`. A file created in this tree lands `w/lf`
and the checkout is what puts the working copy back on the host's convention;
this step is in the task's own text, not only in the stop condition, which is
the rule P8.4 landed in `roles/keikaku.md`.

- [ ] **Step 17: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 18: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-sweep-2.md --task 10
```

Expected: `task 10: verify clean`.

**Done when:** `skills/tanto/templates/shoroku-brief.md` exists with its
forty-seven lines, the `W` block and its twelve `P` passages are present,
A10.1 returns `1`, the needles of O10.1 to O10.7 return `0`,
`git ls-files --eol skills/tanto/templates/shoroku-brief.md` reports
`i/lf w/crlf`, lint is clean, and the commit carries its trailer. Check 3's new
MAP row reports `UNCITED` until task 11 lands the citation, which is expected
and is not a defect of this task.

---

### Task 11: Kanri's check step, the contract's "Session exit", and the spelling `Unsure` at every reader

**Batch:** D. **Blocks:** A11.1, O11.1 to O11.6, P11.1 to P11.9.

The behavior change. Kanri stops reading recommendations whole: it checks the
brief's **form** by `grep`, pastes the brief verbatim, and reads the brief's
`## Unsure` group where it used to read the recommendation's (spec 1.4, 1.6).
The three group names are spelled at every `tanto` reader as the headings are
spelled, so that a reader who copies the word into `sections` gets the group
(1.5). Every one of those is a byte-for-byte pair across files, which is why
they are one task.

**Files:**

- Modify: `skills/tanto/roles/kanri.md`
- Modify: `skills/tanto/SKILL.md`
- Modify: `skills/tanto/templates/kanri.md`

**Named mechanisms this task changes, and every other site that names them:**
the **three group headings** are named in `skills/shoroku/SKILL.md` (task 10,
P10.3), in `templates/shoroku-brief.md` (task 10, W10.1), in `SKILL.md`'s
"Session exit" step 2 and its Artifacts recommendation row (P11.4, P11.6), in
`roles/kanri.md`'s step 2 (P11.3), and in `templates/kanri.md`'s Shoroku
candidates paragraph (P11.7). The **check step** is stated in
`roles/kanri.md`'s "The four steps" step 3 (P11.2) and in `SKILL.md`'s "Session
exit" step 3 (P11.5), which is the contract's copy of it. The **`unsure` read
at an exit** is stated in `roles/kanri.md`'s "Exit shoroku" step 3 (P11.9) and
in `SKILL.md`'s "Session exit" (P11.8). All of them are here.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kanri.md skills/tanto/SKILL.md skills/tanto/templates/kanri.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O11.1** `Read the whole recommendation once` — `skills/tanto/roles/kanri.md` 1
→ 0 at P11.2. The interim form of the 2026-09-14 hotfix, which this task
replaces with the brief's form check.

**O11.2** `reads the whole recommendation once` — `skills/tanto/SKILL.md` 1 → 0
at P11.5. The contract's copy of the same act, in the third person; the two
spellings are why this rule needs two needles.

**O11.3** `reject, unsure —` — `skills/tanto/SKILL.md` 2, `skills/tanto/roles/kanri.md` 1 → 0 at P11.3, P11.4 and P11.6. Any case but the capitalized one is the drift issue-e916 named. The needle is the phrase's tail rather than its whole, because `roles/kanri.md` wraps it after `recommended` and no needle taken from the head sees both files; check 18, landed in task 12, runs a shorter case-insensitive phrase (`reject, unsure`) rather than this exact tail, since `lint` forbids this needle's own text inside a task's new-text block — the shorter phrase is a superset and check 18's own text says so.

**O11.4** `unsure; tells the human` — `skills/tanto/templates/kanri.md` 1 → 0 at P11.7. The ledger template's copy of the same three names, whose sentence continues with a semicolon instead of an em dash and which O11.3's needle therefore does not reach.

**O11.5** `Kanri reads its` — `skills/tanto/SKILL.md` 1 → 0 at P11.8. The contract's own `unsure` read at a session exit. The needle stops before the backticked word because an `O` needle cannot contain a backtick, and it spans the change point: the new sentence reads `Kanri reads the brief's`.

**O11.6** `3. When the recommendation is on disk, read its` — `skills/tanto/roles/kanri.md` 1 → 0 at P11.9. "Exit shoroku" step 3's own opening, for the same reason and with the same constraint.

- [ ] **Step 3: The dispatch names the brief, the template, and the language**

**P11.1** `skills/tanto/roles/kanri.md` — insert after these 2 lines

```text
   an ADR item carries the original wording followed by a reference
   translation in the chat's language.
```

**P11.1 →**

```text
   Name in the same dispatch the brief path —
   `.tanto/<topic>/<stage>-brief.md`, or `.tanto/<stage>-brief.md` for T0 and
   your own exit — the template `templates/shoroku-brief.md` in the skill
   directory, and the chat's language; the recommender writes both files in
   one run.
```

- [ ] **Step 4: The three groups, as the headings are spelled**

**P11.3** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
   lists every item once in three groups — recommended adopt, recommended
   reject, unsure — each item quoted in full from its source, so that the file
```

**P11.3 →**

```text
   lists every item once in three groups — Recommended adopt, Recommended
   reject, Unsure — each item quoted in full from its source, so that the file
```

- [ ] **Step 5: Kanri checks a form, not a judgment**

**P11.2** `skills/tanto/roles/kanri.md` — replace exactly these 13 lines

```text
3. **Check.** Read the whole recommendation once and tell the human, in one
   line plus a numbered list under it: the path, the three counts, and then
   the recommendation's items in the chat's language, grouped as the file
   groups them — one line per item, its number, its group, its destination, a
   one-sentence rendering of the candidate, and the one-line reason (the
   `unsure` group's "could not be read as written" question still comes from
   its own read by `sections`). The
   human answers as the `shoroku` skill already parses — `OK` for "as
   recommended", or the numbers that go the other way, or an edit — and you
   write `<stage>-direction.md` beside the recommendation, item by item, with
   the `S-n` rows in the ledger: Stage the stage word, Adopted from the human's
   answer. No item is escalated apart from the rest and none is decided by you
   alone; the human sees the whole list, grouped, and answers by exception.
```

**P11.2 →**

```text
3. **Check.** Check the brief's form, not its judgment, and never by reading
   the recommendation's prose: `grep -c '^## '` on the brief is `4` and the
   four headings are `## How to answer`, `## Recommended adopt`,
   `## Recommended reject`, `## Unsure`, in that order; every `### ` heading
   of the recommendation appears exactly once in the brief after `See: `, and
   the brief names no heading the recommendation lacks — count both with
   `grep -c '^### '` on the recommendation and `grep -cF 'See: <heading>'`
   on the brief, one line per heading. On a failure dispatch the recommender
   once more, naming what failed; on a second failure paste the brief as it
   stands and tell the human in one line what is wrong with it. Then give the
   human, in one message: the recommendation's path, the brief's path, the
   three counts, and the brief's text verbatim below them. The human answers
   as the `shoroku` skill already parses — `OK` for "as recommended", or the
   numbers that go the other way, or an edit — and you write
   `<stage>-direction.md` beside the recommendation, item by item, with the
   `S-n` rows in the ledger: Stage the stage word, Adopted from the human's
   answer. No item is escalated apart from the rest and none is decided by
   you alone; the human sees the whole list, grouped, and answers by
   exception.
```

- [ ] **Step 6: The exit's `unsure` read, on Kanri's side**

**P11.9** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```text
3. When the recommendation is on disk, read its `unsure` group with
   `sections`. An item there saying the candidate could not be read as written
   is one question back to the session, one line, answered by a rewrite of the
   proposal. Otherwise ask the human, as a numbered list, to delete the
   session.
```

**P11.9 →**

```text
3. When the recommendation and its brief are on disk, read the brief's
   `## Unsure` group with `sections`. A line there carrying a "could not be
   read as written" question is one question back to the session, one line,
   answered by a rewrite of the proposal. Otherwise ask the human, as a
   numbered list, to delete the session.
```

- [ ] **Step 7: "Session exit" step 2 names the brief**

**P11.4** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
   full, in three groups — recommended adopt, recommended reject, unsure —
   each with its destination and its one-line reason.
```

**P11.4 →**

```text
   full, in three groups — Recommended adopt, Recommended reject, Unsure —
   each with its destination and its one-line reason. The same dispatch names
   the brief path, `<stage>-brief.md` beside the recommendation, the template
   `templates/shoroku-brief.md`, and the chat's language; the recommender
   writes both files in one run.
```

- [ ] **Step 8: "Session exit" step 3 is the check step's contract**

**P11.5** `skills/tanto/SKILL.md` — replace exactly these 7 lines

```text
3. **Check.** Kanri reads the whole recommendation once and gives the human
   the path, the three counts, and under them the recommendation's items as a
   numbered list in the chat's language, grouped as the file groups them —
   one line per item: its number, its group, its destination, a one-sentence
   rendering of the candidate, and the one-line reason; the human answers by
   exception; Kanri writes `<stage>-direction.md` beside the recommendation,
   item by item, with the `S-n` rows in the conductor ledger.
```

**P11.5 →**

```text
3. **Check.** Kanri checks the brief's form by `grep` — the four headings
   present and in order, every `###` item heading of the recommendation
   appearing exactly once after `See:` — dispatches the recommender once more
   on a failure and pastes the brief as it stands on a second, then gives the
   human both paths, the three counts, and the brief's text verbatim; the
   human answers by exception; Kanri writes `<stage>-direction.md` beside the
   recommendation, item by item, with the `S-n` rows in the conductor ledger.
```

- [ ] **Step 9: The exit's `unsure` read, in the contract**

**P11.8** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```text
dispatches the recommender at once. When the recommendation is on
disk, Kanri reads its `unsure` group by `sections`: an item there saying the
candidate could not be read as written is one question back to the session,
one line, answered by a rewrite of the proposal; otherwise Kanri asks the
human, as a numbered list, to delete the session. The session idles through
```

**P11.8 →**

```text
dispatches the recommender at once. When the recommendation and its brief
are on disk, Kanri reads the brief's `## Unsure` group by `sections`: a line
there carrying a "could not be read as written" question is one question
back to the session, one line, answered by a rewrite of the proposal;
otherwise Kanri asks the human, as a numbered list, to delete the session.
The session idles through
```

- [ ] **Step 10: The Artifacts table gains the brief**

**P11.6** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
| `.tanto/<topic>/<stage>-recommendation.md`, or `.tanto/t0-recommendation.md` and Kanri's own exit at `.tanto/` | the `shoroku` recommender Kanri dispatches | Kanri, the human, the apply subagent | every candidate once, quoted in full, in three groups — recommended adopt, recommended reject, unsure — each with its destination and its one-line reason |
```

**P11.6 →**

```text
| `.tanto/<topic>/<stage>-recommendation.md`, or `.tanto/t0-recommendation.md` and Kanri's own exit at `.tanto/` | the `shoroku` recommender Kanri dispatches | Kanri, the human, the apply subagent | every candidate once, quoted in full, in three groups — Recommended adopt, Recommended reject, Unsure — each with its destination and its one-line reason |
| `.tanto/<topic>/<stage>-brief.md`, or `.tanto/<stage>-brief.md` for T0 and Kanri's own exit | the `shoroku` recommender, in the same dispatch as the recommendation | Kanri, by `grep` for its form and by `sections` for `## Unsure`; the human, verbatim | the check brief, from `templates/shoroku-brief.md`, in the chat's language: one line per item, grouped as the recommendation groups them, each pointing at the item's `###` heading |
```

- [ ] **Step 11: The ledger template's Shoroku candidates paragraph**

**P11.7** `skills/tanto/templates/kanri.md` — replace exactly this 1 line

```text
recommended adopt, recommended reject, unsure; tells the human that path, the
```

**P11.7 →**

```text
Recommended adopt, Recommended reject, Unsure; tells the human that path, the
```

- [ ] **Step 12: The anchor for this task's insertions**

**A11.1** `skills/tanto/roles/kanri.md` — `grep -cF 'templates/shoroku-brief.md' skills/tanto/roles/kanri.md` — before: 0, after: 1

- [ ] **Step 13: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md skills/tanto/SKILL.md skills/tanto/templates/kanri.md
```

Expected: exit 0, none `Failed`. This step runs before the Verify step below.

- [ ] **Step 14: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md skills/tanto/SKILL.md skills/tanto/templates/kanri.md -m "docs(tanto): Kanri checks the brief's form and pastes it, and Unsure is spelled as written" -m "The shoroku dispatch names the brief path, the template and the chat's language; step 3 checks four headings and the See: pointers by grep and pastes the brief verbatim instead of reading the recommendation whole; the exits read the brief's ## Unsure group; the three group names are capitalized at every tanto reader, and the Artifacts table gains the brief's row. Spec 1.4, 1.5, 1.6." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 15: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 16: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-sweep-2.md --task 11
```

Expected: `task 11: verify clean`.

**Done when:** the nine passages are present, A11.1 returns `1`, the needles of
O11.1 to O11.6 return `0`, check 3's MAP row for the new template now reports
`ok`, lint is clean, and the commit carries its trailer.

---

### Task 12: checks 18 and 19, and the two READMEs' drift review

**Batch:** D. **Blocks:** A12.1, P12.1 to P12.3.

The two checks that guard the heading contract issue-e916 asks for and the form
markers of the new template, inserted **before** `## 20.` so that the note reads
18, 19, 20, 21. Then the drift review the two READMEs are owed: the tanto
README's template list gains `shoroku-brief.md` and the shoroku README's
recommend sentence says the recommender also writes the check brief when asked.
What else has drifted in either file is the implementer's to find and to fix in
this task; the two passages below are the minimum, not the whole of it.

**Files:**

- Modify: `docs/notes/tanto-consistency-checks.md`
- Modify: `skills/tanto/README.md`
- Modify: `skills/shoroku/README.md`

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol docs/notes/tanto-consistency-checks.md skills/tanto/README.md skills/shoroku/README.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`.

- [ ] **Step 2: Checks 18 and 19, before check 20**

**P12.1** `docs/notes/tanto-consistency-checks.md` — insert before this 1 line

```text
## 20. The enumerations the second sweep re-synchronized
```

**P12.1 →**

````text
## 18. The recommendation's headings, on both sides

```bash
grep -cF '`## Recommended adopt`, `## Recommended reject`, `## Unsure`' skills/shoroku/SKILL.md
grep -cF '## Recommended adopt' skills/tanto/templates/shoroku-brief.md
grep -cF '## Recommended reject' skills/tanto/templates/shoroku-brief.md
grep -cF '## Unsure' skills/tanto/templates/shoroku-brief.md
grep -cF 'Recommended adopt, Recommended reject, Unsure' skills/tanto/SKILL.md
grep -cF 'reject, Unsure —' skills/tanto/roles/kanri.md
grep -cF 'Recommended adopt, Recommended reject, Unsure' skills/tanto/templates/kanri.md
grep -rciF 'recommended adopt, recommended reject' skills/tanto/SKILL.md skills/tanto/templates/kanri.md skills/shoroku/SKILL.md
grep -ci 'reject, unsure' skills/tanto/roles/kanri.md
grep -c 'reads its `unsure` group' skills/tanto/SKILL.md
```

Expected: `1 1 1 1 2 1 1`, then the two case-insensitive counts equal to the
case-sensitive ones above them — `3` summed over the three files, and `1` — a
lowercase spelling anywhere being the drift issue-e916 named; and `0`, the
contract's lowercase read of "Session exit" being gone. `roles/kanri.md`'s
phrase wraps after `recommended`, so its check is on the second line's form, as
check 6 pins a wrapped line by its own text. `sections` matches heading text
exactly and is not changed: that exactness is what made the mismatch visible,
and the fix is on the two sides that spell the heading, never in the matcher.
The two case-insensitive lines above run shorter phrases than spec 8.1's own
two needles (one of them O11.3, cited by id rather than re-quoted here):
`lint`'s rule that a task's new text may not contain the very `O` needle that
task declares forbids quoting the longer form verbatim, and the shorter form
is a superset — anything the longer form would catch, this catches too.

## 19. The check brief's form markers

```bash
grep -c '^## How to answer$' skills/tanto/templates/shoroku-brief.md
grep -cF 'See:' skills/tanto/templates/shoroku-brief.md
grep -cF '[adopt | reject | unsure]' skills/tanto/templates/shoroku-brief.md
grep -cF 'templates/shoroku-brief.md' skills/tanto/SKILL.md
grep -cF 'templates/shoroku-brief.md' skills/tanto/roles/kanri.md
grep -cF 'shoroku-brief.md' skills/tanto/README.md
```

Expected: `1`, a non-zero count, `1`, then non-zero on the three citations —
the template exists, carries its markers, and is named where it is copied from,
which is check 3's rule for every other template. The tag line's alternatives
are written once, in the shape the groups' lines are rendered from; the three
group sections carry the concrete tag instead, which is why the third count is
`1` and not `3`.

````

- [ ] **Step 3: The tanto README's template list**

**P12.2** `skills/tanto/README.md` — replace exactly these 6 lines

```text
- `templates/` — copy-and-fill skeletons: `roster.md`, `roster-archive.md`,
  `kanri.md` (the conductor ledger), `kanri-handover.md`, `bug-report.md`,
  `batch-prompt.md`, `batch-report.md`, `kaiseki-brief.md`,
  `kaiseki-report.md`, `review-brief.md`, `tanto.json` (the built-in model
  and effort defaults), `kikaku-decision.md`, and `agent.md`, the subagent
  definition every role generates from.
```

**P12.2 →**

```text
- `templates/` — copy-and-fill skeletons: `roster.md`, `roster-archive.md`,
  `kanri.md` (the conductor ledger), `kanri-handover.md`, `bug-report.md`,
  `batch-prompt.md`, `batch-report.md`, `kaiseki-brief.md`,
  `kaiseki-report.md`, `review-brief.md`, `shoroku-brief.md` (the shoroku
  check brief), `tanto.json` (the built-in model and effort defaults),
  `kikaku-decision.md`, and `agent.md`, the subagent definition every role
  generates from.
```

- [ ] **Step 4: The shoroku README's recommend sentence**

**P12.3** `skills/shoroku/README.md` — replace exactly these 5 lines

```text
- For a caller that answers through files — an orchestrator running the skill
  in a subagent — the same workflow splits into two halves at `Direction?`:
  **recommend** writes the numbered proposal, each item marked adopt, reject,
  or unsure, to a path the caller names; **apply** reads that file with a
  direction file and makes the one commit.
```

**P12.3 →**

```text
- For a caller that answers through files — an orchestrator running the skill
  in a subagent — the same workflow splits into two halves at `Direction?`:
  **recommend** writes the numbered proposal, each item under its own `###`
  heading and marked adopt, reject, or unsure, to a path the caller names —
  and, when the caller names a brief path, a template and a chat language, a
  check brief beside it, one line per item in that language; **apply** reads
  the proposal with a direction file and makes the one commit.
```

- [ ] **Step 5: The rest of the drift review**

Read `skills/tanto/README.md` and `skills/shoroku/README.md` whole against the
tree as batch D leaves it, and fix anything else this plan has made stale — the
tanto README's counts, its Layout section, its bullet on what `shoroku` writes,
and the shoroku README's description of what recommend mode is invoked with.
Record in the batch report what was found and what was changed, including
"nothing further" if that is the answer. This step is why this task's commit
may touch more lines in the two READMEs than P12.2 and P12.3 carry; those extra
lines are `unaccounted-added` in `diff` at batch D's boundary and are accounted
for by this step's record.

- [ ] **Step 6: The anchor for this task's insertion**

**A12.1** `docs/notes/tanto-consistency-checks.md` — `grep -c '^## 18\.' docs/notes/tanto-consistency-checks.md` — before: 0, after: 1

- [ ] **Step 7: Lint**

```bash
./scripts/lint.sh docs/notes/tanto-consistency-checks.md skills/tanto/README.md skills/shoroku/README.md
```

Expected: exit 0, none `Failed`. This step runs before the Verify step below.

- [ ] **Step 8: Commit**

```bash
git commit --only docs/notes/tanto-consistency-checks.md skills/tanto/README.md skills/shoroku/README.md -m "docs(tanto): checks 18 and 19, and the two READMEs' drift review" -m "Check 18 pins the recommendation's three headings on both sides of the dispatch, check 19 the check brief's form markers and its citations; both are inserted before check 20 so the note reads 18 to 21 in order. The tanto README lists the new template and the shoroku README says recommend mode also writes the brief. Spec 1.7, 8.1, 8.2." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 9: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 10: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-sweep-2.md --task 12
```

Expected: `task 12: verify clean`.

**Done when:** the note's sections run `## 18.`, `## 19.`, `## 20.`, `## 21.` in
that order, A12.1 returns `1`, the three passages are present, the drift review
is recorded in the batch report, lint is clean, and the commit carries its
trailer.

---

### Task 13: the whole-tree old-value sweep and the note's own checks

**Batch:** E. **Blocks:** none of its own — it cites every `O` block above.

**A sweep-and-check task**, and the first of the two in this plan: its
deliverable is recorded output and a handful of recorded figures, not a file
edit. It runs after every passage has landed, and it is the only place where the
plan's needles are swept over paths **no task touched** — `roles/hosa.md`,
`roles/kaiseki.md`, the scripts, and the note itself.

Every needle below is expected at **zero** across the sweep set, with one
documented exception that is expected to remain and is not a defect: O2.4's
hit in `docs/notes/tanto-consistency-checks.md`, which is check 8 loading a
real file under `$CLAUDE_CONFIG_DIR/agents/`. O9.1 already reads `0` in
`skills/tanto/roles/kanri.md` today — Kanri's Start step 2 never carried the
old phrase — so it is not a second exception; task 9's own Done-when does
not claim one either.

The needles, thirty-two of them: **O1.1**, **O1.2**, **O1.3**, **O2.1**,
**O2.3**, **O2.4**, **O2.5**, **O2.6**, **O2.7**, **O4.1**, **O4.2**, **O4.3**,
**O4.4**, **O4.5**, **O5.1**, **O6.1**, **O7.1**, **O7.2**, **O9.1**,
**O10.1**, **O10.2**, **O10.3**, **O10.4**, **O10.5**, **O10.6**, **O10.7**,
**O11.1**, **O11.2**, **O11.3**, **O11.4**, **O11.5**, **O11.6**. The stage-word
list of P2.3 carries no needle, for the reason task 2 states; **A2.2** is its
instrument and is re-run here.

**Files:** none modified except `docs/notes/tanto-consistency-checks.md`, and
that only to record measured figures where a check's `Expected:` paragraph says
the plan records what it measured — checks 18 and 20 say so in their own text.

#### Steps

- [ ] **Step 1: Sweep every needle over the whole set**

```bash
set -- 'two top-family session' 'a third top-family session' 'a read-only subagent that writes' 'dead, replaced, and refused rows' 'continue: <the dispatch' 'tanto-task-implement.md' 'tanto-task-review-spec.md' 'tanto-task-escalate.md' 'T2 shoroku proposal and write-out' 'and your own exit shoroku' "step 7's slot (b) apply" 'is written, dispatch the' 'slot I give". You request' 'once the human has answered. Delete' 'Peers whose last line this session did not answer' 'place>' 'Before the review, a passage' 'read-only** reviewer' 'untracked, the second keeps the editor' 'Thirteen of them:' '## recommended adopt' 'Twenty-six skill files' 'all twenty-six paths' 'Seven role files, thirteen templates' 'Expected: twenty-four' 'Eight of the twenty are Kanri' 'Read the whole recommendation once' 'reads the whole recommendation once' 'reject, unsure —' 'unsure; tells the human' 'Kanri reads its' '3. When the recommendation is on disk, read its' || exit 1
for n in "$@"; do printf '%s\t' "$n"; grep -rcF -- "$n" skills/tanto/ skills/shoroku/ docs/notes/tanto-consistency-checks.md 2>/dev/null | grep -v ':0$' | tr '\n' ' '; echo; done || exit 1
grep -rc 'recommended adopt' skills/tanto/ skills/shoroku/ | grep -v ':0$' || true
```

Expected: every needle returns nothing but the one documented hit —
`docs/notes/tanto-consistency-checks.md` for `tanto-task-implement.md` — and
the case-**sensitive** sweep for the lowercase group name (issue-e916's own
drift) returns nothing at all — it is deliberately not `-i`, since `-i` would
also match the correctly capitalized `Recommended adopt` this plan lands,
which is expected to appear and is not the drift being swept for. The
thirty-two needles are the thirty-two `O` blocks cited above, in their order.
Record the raw output, hit by hit with its disposition, in the batch report; a
single verdict line is not the deliverable.

- [ ] **Step 2: Re-run the note's own checks 1 to 9**

```bash
node "skills/tanto/scripts/passage-check.js" sections --file docs/notes/tanto-consistency-checks.md '1. Every file of the layout exists' '2. Every in-skill path named by the contract or a role file resolves' '3. Every template is cited by the role that copies it'
```

Expected: the three sections print with their `bash` blocks and their
`Expected:` paragraphs. Run each block by hand from the repository root and
compare: check 1 lists twenty-seven paths, check 2 returns twenty-five `ok`
lines including `templates/shoroku-brief.md`, check 3 returns twenty-one `ok`
and no `UNCITED`. Then run checks 4 to 9 the same way — check 4's `shoroku` line
still returns `1`, and check 7's absent-strings list is re-read against the
words this plan introduced.

- [ ] **Step 3: Re-run checks 16 to 20 and record their figures**

```bash
node "skills/tanto/scripts/passage-check.js" sections --file docs/notes/tanto-consistency-checks.md '16. The usage line names every subcommand' "17. The reading's fifth figure is in every place a reading lands" "18. The recommendation's headings, on both sides" "19. The check brief's form markers" '20. The enumerations the second sweep re-synchronized'
```

Expected: the five sections print. Run each block from the repository root.
Checks 18 and 20 say in their own text that the plan records the figures it
measured: where a measured figure differs from the entry's stated expectation,
fix the **entry**, in this task's own commit, and say in the batch report which
number moved and why. A figure that differs because a passage is missing is a
defect of the batch that was to land it, not of the entry.

- [ ] **Step 4: The scripts still pass**

```bash
mise x node@22 -- node --test skills/tanto/scripts/
```

Expected: all tests pass. `passage-check.js`, `reading.js` and their tests are
out of scope for this plan and are untouched; this run is the evidence of that.

- [ ] **Step 5: `diff` accounts for the branch**

Run "How a batch is verified"'s own hand-run `diff` check (its base is the
ledger's resolved value, never `git merge-base main HEAD` — that would
resurface the pre-existing spec and Hosa chore commits as `unaccounted-added`
forever; not fenced here for the same reason it is not fenced there, since a
placeholder value cannot be a literal, runnable command).

Expected: every changed line accounted for by a block of this plan, with
both `created:` paths recognized (`skills/tanto/templates/shoroku-brief.md`
and, from task 14, not yet landed) and the two READMEs' extra lines from
task 12's drift review reported as `unaccounted-added`, each traceable to
that step's record.

- [ ] **Step 6: Lint and commit whatever the recorded figures changed**

```bash
./scripts/lint.sh docs/notes/tanto-consistency-checks.md
```

Expected: exit 0, none `Failed`. If no figure moved, there is nothing to commit
and the task says so in the report rather than making an empty commit.

```bash
git commit --only docs/notes/tanto-consistency-checks.md -m "docs(notes): record the figures checks 18 and 20 measured" -m "The two entries the second sweep added say the plan records what it measured; these are the values the finished tree returns. Spec 8.1, 8.3, and the plan's verification step 4." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 7: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-sweep-2.md --task 13
```

Expected: `task 13: no passages`. This task carries none; the line is a result,
not a failure.

**Done when:** the sweep's raw output and the disposition of every hit are in
the batch report, the note's checks 1 to 9 and 16 to 20 have been run and their
outcomes recorded, `node --test` passes on the untouched scripts, `diff`
accounts for the branch, and any figure the note now states was measured rather
than reasoned to.

---

### Task 14: the dogfood report

**Batch:** E. **Blocks:** none — this task's deliverable is one report under
`docs/reports/` and the measurements in it.

**A sweep-and-check task**, and the second of the two. It writes one file, but
that file's content is recorded output rather than designed text, and nothing in
the skill changes. It runs **last**.

**Open point, unresolved as this plan is committed — Kanri's to rule
before this task runs (plan review finding 1).** Spec section 10's E2 assumes
"the check brief as run at the first stage after batch D is accepted," but no
shoroku stage the contract schedules (T1 at plan landing, an exit at its own
boundary, T2 after the final batch) falls between batch D's boundary and this
task — and this topic's own ledger R-4 additionally consolidates every
check to this topic's eventual T2, so no interim stage runs at all before
then. **This task cannot measure a check-brief run that has not happened by
the time it runs.** Keikaku's recommendation, pending Kanri's ruling: this
task writes only sections 4 and 5 below (issues closed, the readings), which
are knowable at batch E's own boundary; sections 1 to 3 (the check brief as
run, the timing comparison, the `Unsure` read) are recorded instead at T2 —
the first point in this run a check-brief stage actually happens — as part
of T2's own write-out or a note in the whole-branch review, not by rewriting
this report (`docs/reports/` is dated and frozen). If Kanri rules otherwise —
a stage inserted between D and E, or the dogfood deferred out of the plan
entirely to a Kanri chore at T2 — this task's steps below are edited to
match before it runs; the current text implements the recommendation above.

`docs/reports/<date>-tanto-sweep-2-dogfood.md`, written per
`docs/reports/AGENTS.md` — a dated, frozen investigation, which is what a
dogfood is. It is declared `created:` (Global Constraints), so `diff` never
checks its lines against a passage, at this boundary or any other.

**This report is written mid-batch E, before the plan's actual close.** T2,
Jisso's exit and the merge decision are later events this task cannot wait
for, and — per the open point above — so is the check brief's own first
real run.

**Files:**

- Create: `docs/reports/2026-09-15-tanto-sweep-2-dogfood.md`

#### Steps

- [ ] **Step 1: Confirm no check-brief stage has run yet**

```bash
ls -1 .tanto/tanto-sweep-2/*-brief.md .tanto/*-brief.md 2>/dev/null | head -n 1
```

Expected (per the open point above, until Kanri rules otherwise): nothing —
no brief file exists yet, because no shoroku stage has run since batch D
landed. If this instead prints a path, a stage **has** run (Kanri ruled
one in, or the schedule moved) — read that stage's recommendation, brief,
and direction from the ledger's `S-n` rows and Session events, and write
sections 1 to 3 below from it instead of deferring them; the two cases are
mutually exclusive, and the batch report says which one happened.

- [ ] **Step 2: Write the report**

Write `docs/reports/2026-09-15-tanto-sweep-2-dogfood.md` per
`docs/reports/AGENTS.md`. Two sections, per the open point above, unless
Step 1 found a stage had run (then all five, in the shape spec 10/E2
describes — the stage, the two paths, the three counts of a Kanri form
check re-run, whether the recommender was re-dispatched, the human's
answer, whether Kanri read any of the recommendation's prose — it must not
have —, the time against the 2026-09-14 interim-form hotfix, and the
`Unsure` read re-verified with `node "skills/tanto/scripts/passage-check.js"
sections --file <the brief> Unsure`):

1. **Issues closed.** Twenty-nine, each traced to the block id that closed
   it, from the Self-Review's table below. T2 moves each to `resolved/`.
2. **The readings.** Each batch boundary's `context=` figure from the
   ledger's Measurements per-boundary row, and the top-family one-shot
   tally from the Session events lines P6.2 landed — the first run in
   which that row has a writer, which is itself a data point.
3. **What this report does not cover, and why.** One paragraph: no shoroku
   stage has run since batch D landed (Step 1's empty result, or R-4's own
   consolidation to T2), so the check brief's own first real use — the
   form check's counts, the human's answer, the timing comparison, and the
   `Unsure` read — is recorded at T2 instead, not here; point at where (T2's
   own write-out or the whole-branch review) once that is known.

- [ ] **Step 3: Lint**

```bash
./scripts/lint.sh docs/reports/2026-09-15-tanto-sweep-2-dogfood.md
```

Expected: exit 0, none `Failed`. `docs/reports/AGENTS.md` gives reports no
frontmatter to check — the `# H1` is the title and the date lives only in the
file name — so the linter's frontmatter hook has nothing to look at here.

- [ ] **Step 4: Commit**

The commit message below is written for the deferred case (Step 1 found no
brief); if Step 1 found a stage had run, replace the second `-m` with the
five-section version instead.

```bash
git add docs/reports/2026-09-15-tanto-sweep-2-dogfood.md && git commit --only docs/reports/2026-09-15-tanto-sweep-2-dogfood.md -m "docs(reports): the tanto-sweep-2 dogfood" -m "The twenty-nine issues traced to their blocks and the readings; the check brief's own first real run is deferred to T2, since no shoroku stage has run since batch D landed. Spec 10 and verification points 4 to 5; points 2 and 3 deferred, plan review finding 1." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 5: Restore the created file's line ending**

```bash
git checkout -- docs/reports/2026-09-15-tanto-sweep-2-dogfood.md && git ls-files --eol docs/reports/2026-09-15-tanto-sweep-2-dogfood.md
```

Expected: `i/lf w/crlf attr/text=auto`. Written into this task's own steps, not
only into the stop condition, per the rule P8.4 landed.

- [ ] **Step 6: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 7: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-tanto-sweep-2.md --task 14
```

Expected: `task 14: no passages`.

**Done when:** the report exists with its two sections (or five, if Step 1
found a stage had already run), the `# H1` is the title with the date
carried only in the file name (no frontmatter), `git ls-files --eol` reports
`i/lf w/crlf` on it, lint is clean, and the commit carries its trailer.

---

## Self-Review

**Spec coverage.** Every section of the spec maps to a task. 1.2, 1.3 and 1.6's
count → task 10; 1.4, 1.5 and the rest of 1.6 → task 11; 1.7 → task 12; 2.1,
2.3's role half, 4.1 and 4.2 → task 4; 2.2 and 2.4 → task 5; 2.3's contract
half, 5.2's contract half, 6.1, 6.2 and 6.3 → task 1; section 3 → task 2; 4.3,
4.4 and section 7 → task 9; 5.1, 5.2's Sekkei half, 5.3 and 5.4 → task 7; 5.2's
Keikaku half, 5.3, 5.4 and 6.5 → task 8; 6.4, 6.6 and 6.7 → task 6; 8.3 and 8.4
→ task 3; 8.1 and 8.2 → task 12; 8.5 → task 10; the sweep of "Old values this
plan contradicts" → task 13; section 10's E2 → task 14.

**The twenty-nine issues, each traced to a block.**

| Issue | Spec | Block |
| --- | --- | --- |
| c17a, e916 | 1 | W10.1, P10.3, P10.4, P10.5, P10.13, P11.1 to P11.9, P12.1 |
| 7ba4 | 2.1 | P4.2, P4.3, P4.4 |
| f5d8 | 2.2 | P5.2, P5.3 |
| c583 | 2.3 | P1.8, P4.1 |
| caba | 2.4 | P5.1 |
| e18b, 2e19 | 3 | P2.1, P2.2 |
| 8c74 | 3 | P2.3 |
| 62e7 | 3 | P2.4 |
| 1c9a | 3 | P2.5, P2.6 |
| 5a2d | 3 | P2.7 |
| 3a7c | 4.1 | P4.6 |
| c30e | 4.2 | P4.5 |
| f902 | 4.3 | P9.1 |
| 8e51 | 4.4 | P9.2 |
| 36c0 | 5.1 | P7.1, P7.2 |
| 5b8e | 5.2 | P1.9, P7.2, P8.1 |
| 5e9c | 5.3 | P7.3, P8.2 |
| bf75 | 5.4 | P7.4, P7.5, P8.3 |
| 63b0 | 6.1 | P1.7 |
| c2d7 | 6.2 | P1.1 |
| d604 | 6.3 | P1.2 to P1.6 |
| 9d17 | 6.4 | P6.1 |
| 4d8a, 6f3d | 6.5, 8 | P8.4, P3.1 |
| b673 | 6.6 | P6.2 |
| 9627 | 6.7 | P6.3, P6.4 |
| 4b91 | 1.3, 7 | P9.3, P9.4, P10.5 |

**The largest task.** Task 10 — `templates/shoroku-brief.md`, `shoroku`'s
recommend mode, the template count, and the note's four structural counts. It
runs **384 lines** of this plan and **18 steps**, and carries twenty-one blocks:
one `W`, twelve `P`, seven `O` and one `A`. Task 11 is the next largest at 295
lines and 16 steps with sixteen blocks, then task 1 at 271 lines and 16 steps
with thirteen. The smallest are tasks 13 and 3, at 123 and 126 lines and 7 steps
each. No threshold is set; these are recorded until one can be chosen
(issue-7281).

**Sweep-and-check tasks: two.** Task 13, whose deliverable is the recorded
output of the old-value sweep and the note's own checks, and task 14, whose
deliverable is a report of measurements. Both invert the reviewer's standing
instruction — there is no file edit to read against a block — and both cost on
the implementer's seat and the reviewer's. They are the last two tasks of batch
E, adjacent, so that one reviewer carries the inversion once.

**Placeholder scan.** No step says "TBD", "similar to task N", or "handle the
rest": every passage carries its old and new text in full, and the two tasks
whose deliverable is recorded output say exactly which commands produce it and
what is done with each hit. The one step that is deliberately open-ended is task
12's step 5, the READMEs' drift review, which the spec assigns to the
implementer's reading rather than to a passage; it names the four places to look
and requires the finding to be recorded either way.

**Consistency.** Block ids are unique and every citation resolves: the `O`
needles cited in task 13 are all declared in tasks 1 to 11, and O7.2 is declared
in task 7 and cited — not re-quoted — in task 8. Each passage's old text was
re-read from this branch's tree rather than from the spec's quotation, as Fixed
input 6 requires; the two sites where the tree and the spec differ are under
"Open points from the post-merge re-grep" above, with what each block does
instead.

**Reports and prompts** follow the tanto templates. This plan names nothing
else.
