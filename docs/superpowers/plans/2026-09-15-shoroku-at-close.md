# One shoroku check per topic, at its close, and the `shoroku` kind split in two Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the text say what the run already does by ruling. The human's
shoroku check happens **once per topic, at its close**; every other moment of a
run — a spec accepted, a plan landed, a session's exit, a batch boundary —
produces candidates and nothing else, recorded as `pending` rows of the
ledger's `S-n` table that point at the files where the candidates live. The one
recommend runs on the top family over every source those rows name, the one
check is the human's on the check brief, and the one apply lands on the topic's
branch before the merge decision. T0 and T1 are gone; the `shoroku` kind
becomes two, `shoroku.recommend` on `fable` and `shoroku.apply` on `opus`, so
twelve kinds become thirteen; and the close's recommend, check and apply are a
live Hosa's, so that Kanri hands over without waiting for the human's answer.

**Architecture:** Four batches. **A** lands the config and the contract — the
thirteenth kind, the definition set's removal of `tanto-shoroku.md`, "Session
exit" whole, the Artifacts rows, and the note's count assertion, so that the
count and the assertion move together. **B** lands `roles/kanri.md` and its
templates: "Shoroku" whole with the ledger and roster templates, then the Start
and loop sites, then the Handover and the Delete table. **C** lands the other
seats and the two READMEs. **D** is the whole-tree old-value sweep, the note's
new check 24, and the dogfood report. Every change is a passage: an old text
quoted exactly from the tree this plan is applied to, a new text that replaces
it, an insertion anchored on quoted lines, or a section replaced whole between
two headings. Each block appears once, carries an id, and is cited by that id
wherever it is needed again.

**Tech Stack:** Markdown and one JSON file. `node "$TANTO/scripts/passage-check.js"`
(`$TANTO` set to the skill's own directory in the same command; `TANTO=skills/tanto`
in this repository — see "$TANTO" in Global Constraints) (Node 22 or newer)
for `lint`, `replay`, `diff`, `verify`, `frame` and `boundary`;
`node --test` on the pinned Node 22 through `mise x node@22` for the untouched
scripts; `pre-commit` through `./scripts/lint.sh` (Windows:
`scripts\lint.bat`); `git diff` against the base, `git ls-files --eol`, and
`grep -rn` / `grep -rcF` / `grep -rcE` for the sweeps. Every fenced block runs
in **Git Bash**.

**Spec:** `docs/superpowers/specs/2026-09-15-shoroku-at-close-design.md`

---

## The baseline these blocks were quoted from

Spec section 9 and "What the plan must contain" require every old text to be
re-quoted from the merged tree — the tree after `tanto-sweep-2` merges and
`tanto-project-config` lands. Neither had landed when this plan was drafted, so
the old texts below were quoted from a **projected** baseline built
mechanically, not by hand:

- the committed tip `9e4e984` for every file, with the three files a Jisso was
  mid-edit on (`skills/tanto/SKILL.md`, `skills/tanto/roles/kanri.md`,
  `skills/tanto/templates/kanri.md`) read from that commit rather than from the
  working tree;
- plus every `P11.x` block of `docs/superpowers/plans/2026-09-15-tanto-sweep-2.md`
  (its task 11, batch D, uncommitted at drafting time) applied to those three;
- plus every `P` block of `docs/superpowers/plans/2026-09-15-tanto-project-config.md`
  (a draft on disk, untracked) applied on top of that, for
  `skills/tanto/SKILL.md`, `skills/tanto/roles/kanri.md`,
  `skills/tanto/README.md` and `docs/notes/tanto-consistency-checks.md`.

All twenty-seven of those blocks resolved exactly once against that baseline.
What the projection does **not** contain is `tanto-sweep-2`'s tasks 12, 13 and
14 — checks 18 and 19 inserted into the note before check 20, the two READMEs'
drift review, the `O` sweep, and that plan's own dogfood report. Tasks 9 and 10
below say where that matters. Every mismatch found while drafting is recorded
in "Open points for Kanri" at the end of this file, with no old text guessed at.

---

## The created paths

```text
created: docs/reports/2026-09-15-shoroku-at-close-dogfood.md
```

One tracked file is created, by task 11; that task runs `git add` before
`git commit --only`, which cannot pick up an untracked path.

---

## Global Constraints

Built from `AGENTS.md` and the concrete model families from `tanto.json`,
plus what the spec itself fixes (section 10). Every batch prompt restates
these; trust the prompt over recollection. This plan does not start
executing until Kanri sends `checkout free: main at <sha>` (queued-topic
flow, ledger R-4) — everything below governs the batches that run then, on
the branch `shoroku-at-close` cut from `main` at that point.

### The shell

**Every fenced block in this plan runs in Git Bash.** The host's primary
shell is PowerShell, where a POSIX `grep -c '...'` with single quotes is
unrunnable. Where a step names `./scripts/lint.sh`, `scripts\lint.bat` with
the same arguments is the Windows equivalent, run from PowerShell or `cmd`.

### Repository rules

- American English for everything in the repo — code, messages, comments,
  docs, commits, branch names.
- Run `./scripts/lint.sh` on the changed paths, each named individually
  (Windows: `scripts\lint.bat`); this repository's script always takes
  explicit paths — name every one.
- Commit by explicit path with `git commit --only <paths>`; the index is
  shared. This plan creates one tracked file, `created:` (see "The created
  paths"): `docs/reports/2026-09-15-shoroku-at-close-dogfood.md` (Task 11);
  that task runs `git add <path>` first — `--only` cannot pick up an
  untracked path.
- Every commit message ends with a `Co-Authored-By:` trailer identifying the
  agent. **Every commit fence in this plan was written by the drafter, on
  `opus`, and ends `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.**
  The Models table below dispatches `task.implement` on `sonnet`: substitute
  whatever model actually ran the dispatch, by name and by that session's
  own attribution convention, in every commit fence's trailer before running
  it — copying the fence's own name verbatim writes a false attribution.
- **A modification in the shared tree that this task, or a subagent it
  dispatched, did not make is not its to discard.** It is reported — one
  line to Jisso from a `task.implement` dispatch, one line to Kanri from
  Jisso — and never run through `git checkout --` or `git clean` on the
  implementer's own judgment; only Kanri decides whether it is stray.
- Never `git add -A`, `.`, or `-u`; never a bare `git commit`; never
  `git commit -a`. Never amend a published commit. Never push to
  `origin/main`. Never bypass a hook (`--no-verify`, a `core.hooksPath`
  override).
- Do not edit agent instruction files, repo-root Markdown, or
  linter/formatter configuration without explicit human approval. This
  plan's edits to `skills/tanto/**` and `skills/shoroku/SKILL.md` are the
  topic's own scope, not an incidental touch — the human's approval is the
  spec review and this plan's own review-brief OK, both gates this run
  passes through before any task lands.

### Models

Every dispatch names both a `model` and a `subagent_type`, from
`subagents.<kind>` in the merged `tanto.json`.

| Dispatch | kind | `subagent_type` | model | effort |
| --- | --- | --- | --- | --- |
| implementer, fix rounds 1-3 | `task.implement` | `tanto-task-implement` | `sonnet` | `high` |
| task reviewer, spec conformance | `task.review-spec` | `tanto-task-review-spec` | `opus` | `medium` |
| task reviewer, quality pass | `task.review-quality` | `tanto-task-review-quality` | `opus` | `medium` |
| fix rounds 4-5 (the escalation) | `task.escalate` | `tanto-task-escalate` | `opus` | `high` |
| anything else — an ad-hoc search, a one-off exploration | `default` | `tanto-default` | `sonnet` | `medium` |

**Every dispatch names a `model`.** An omitted `model` inherits the
dispatching session's own, which this rule bends for nothing: name it every
time regardless.

### `$TANTO`

`$TANTO` is the tanto skill's own directory, set **in the same tool call as
the command that uses it** — shell state does not persist between calls, and
an unset variable makes the command read a path at the filesystem root. In
this repository the skill is linked into the working tree at `skills/tanto`,
so `TANTO=skills/tanto` is the form every command in this plan spells.

### The created paths

One tracked file is created, verbatim as "The created paths" above gives it,
because `diff` reads it:

```text
created: docs/reports/2026-09-15-shoroku-at-close-dogfood.md
```

`diffPlan` exempts a `created:` path from both its added- and removed-line
check and needs no `W` block for it. Task 11's dogfood report carries no
passage at all — its content is recorded output, measured at the batch's
own boundary, not designed text — and this exemption is exactly the case
for that: nothing about it needs to match a passage, and `diff` stays
silent on its lines.

### The `tanto-project-config` catch-up, before Task 1

This branch was cut from `main` at `2e16584` — after `tanto-sweep-2` closed,
but **before `tanto-project-config` landed**. That topic's own plan is
committed on its own branch (`main..tanto-project-config`), not yet merged,
and several of this plan's old texts were quoted from its *draft* (Task 1's
P1.3 to P1.8, Task 3's P3.2, anchors A1.2 and A3.1, and the two `twelve`
survivors with no needle — `roles/kanri.md`'s "twelve agent" and
`SKILL.md`'s "twelve-definitions", both Open point 2). Batch A cannot start
until this gap closes, and closing it is **not** Jisso's to discover mid-task
by the ordinary "a modification in the shared tree it did not make is not
its to discard" rule — the plan's own old texts are stale by design here,
known in advance, not a stray edit.

**Who, and when.** Under R-7, the drafting Keikaku's deletion is not held
for this catch-up — it exited at the cold-read boundary
(`coldread answered:`, its exit proposal on disk) like any other Keikaku.
Once `tanto-project-config` merges to `main` (the human's own merge
decision), Kanri creates a fresh Keikaku, orders scoped to only this
section, who:

1. Rebases `shoroku-at-close` onto the new `main` (a rebase, not a merge —
   the branch carries only the spec and plan commits so far, no Jisso work
   to preserve a merge commit for).
2. Re-runs `lint` and `replay --base main` exactly as at the branch cut,
   and re-anchors whatever fails the same way this plan's own release-time
   re-anchor did (`plan-dryrun.md`'s own record of that pass is the worked
   example) — including the two `twelve` sites, which should now read
   `thirteen` for real and need no needle either way.
3. Resolves the `diff` base (below) against the rebased tip, and reports
   both the clean `replay --base main` and the resolved value to Kanri in
   one line, so Kanri can record it as an `R-n` and write Batch A's prompt.
   `replay --base main` must print **clean** — the residual gap fully
   closed, not merely "still `tanto-project-config`'s" — before that
   prompt goes out.

Measured result: rebase landed at `425040e`; `lint` and `replay --base main`
both clean on the first run, no re-anchor needed — this ledger's own `R-n`
carries the resolved `diff` base.

Keikaku is deleted after that report, under the ordinary Delete table rule,
once its own exit proposal (below) is on disk.

### `diff`'s base is resolved once, after the catch-up — not `git merge-base main HEAD`

Not at the branch cut (which happened early, before `tanto-project-config`
landed): the catch-up above is what makes the tree the base is measured
against real, and Keikaku is who resolves it, in the same step as the
catch-up's own re-anchor, reporting the value to Kanri to record as an
`R-n` in the ledger — the branch-cut moment produces no resolved value of
its own. The commit to run the same way `tanto-sweep-2`'s own plan does —
the newest commit already on the branch (there should be none but the spec
and plan commits) that touches one of this plan's File-structure paths, or
the plain tip if none does:

```bash
git log --format=%H main..HEAD -- skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates docs/notes/tanto-consistency-checks.md skills/shoroku/SKILL.md docs/reports | head -1
```

Every `diff` call in "How a batch is verified" below names the resolved
value explicitly, not `git merge-base main HEAD`, and a later re-derivation
that yields a different hash is a stop, not a recompute — nothing should
land on these paths between boundaries while this plan is in flight
(`SKILL.md` Rule 5).

### The commands `replay` does not run

Declared once here — `replay` (and `boundary`, which honors the same
patterns) skip a fence matching one of these:

```text
replay-skip: ./scripts/lint.sh — pre-commit needs the repository and its hook cache, which the applied tree is not
replay-skip: mise x node@22 — the test suite is run against the real repository's Node toolchain, not a scratch tree
replay-skip: .tanto/ — the topic's state is the working tree's, and an applied copy of the plan's blobs has no such directory
```

### Rule 11 — the authority sentence and the safe-replacement boundary

This plan edits the skill its own sessions run on (`skills/tanto/**`; the
loaded skill at this machine's skill directory is a symlink into this
working tree). **Until every task has landed, the authority for this run's
sessions is this Global Constraints section, Kanri's orders line, and the
batch prompts — not the role files' on-disk text**, which this very plan is
mid-editing. Because `templates/tanto.json`'s kind count, the definition
set's removal rule, the contract's "Session exit", and Kanri's own "Shoroku"
section must all agree with each other — a session started between Batch A
and Batch B would read thirteen kinds in the config bullet but a Kanri
role-file section that still dispatches `tanto-shoroku` — **the boundary
from which a role may be started or replaced is the final one, after Batch D
(Task 11) lands, not any earlier batch boundary.** No planned replacement is
expected before then. Two exceptions stand regardless, per rule 11: Kanri's
own handover proceeds when due, and its successor takes the authority ruling
from the handover file; and a further role needed before the final
boundary — Kaiseki — is a Kanri ruling, recorded as an `R-n`, made with the
half-edited skill in view.

The spec's own "Verification" section asks for a fresh `/tanto` start on any
role at **batch A's** boundary, to exercise the definition-set removal P1.3
and P1.5 write. Starting a role is exactly what this section forbids before
the final boundary, so that check moves to the Batches table's row D
instead, run once, at the boundary where it is actually safe.

**This run's own Kanri already runs under approach A by ruling** —
`tanto-sweep-2` R-4, `tanto-project-config` R-4, and this topic's own R-3
(the same T2-consolidated treatment already applied to this topic's own
Sekkei exit) — so no stage of this run switches form at a boundary: the
text this plan writes catches up with the practice already in effect.

## Batches

Four batches, eleven tasks, cut by the kind of inconsistency (spec section
10): **A** lands the config and the contract — the thirteenth kind, the
definition set's removal of `tanto-shoroku.md`, "Session exit" whole, the
Artifacts rows, and the note's count assertion, so that the count and the
assertion move together. **B** lands `roles/kanri.md` and its templates:
"Shoroku" whole with the ledger and roster templates, then the Start and
loop sites, then the Handover and the Delete table. **C** lands the other
seats and the two READMEs. **D** is the whole-tree old-value sweep, the
note's new check 24, and the dogfood report. Every batch is a Kanri
directive: no worktree (Global Constraints), lint on the changed paths named
individually, and `boundary --plan` before the human is told the batch is
verified.

| Batch | Tasks | Delivers | Stop conditions at the boundary |
| --- | --- | --- | --- |
| A | 1 `templates/tanto.json`, the definitions paragraph's removal sentence, the count lines, and the `tanto-<kind>` clause; 2 "Session exit" whole, the Artifacts rows, the roles table's Hosa row, `roles/kaiseki.md`'s one sentence, `skills/shoroku/SKILL.md`'s input sentence, and the note's check 8 and tenth-needle lines; 3 the skill-name-key bullet, the unknown-key example, and the note's write-out lane paragraph | the config and the contract agree on thirteen kinds, the retired `tanto-shoroku.md` definition, and the close's single-stage mechanism | one `verify --task <N>` call per task, 1 to 3, each clean; `diff --base <the ledger's resolved value>` clean (Kanri, by hand); lint clean on the batch's own changed paths, named individually (Kanri, by hand); `mise x node@22 -- node --test skills/tanto/scripts/` passes (Kanri, by hand) |
| B | 4 `roles/kanri.md`'s "Shoroku" whole (with "Delegation to Hosa"), `templates/kanri.md`'s two paragraphs, `templates/roster.md`'s stage line; 5 Start steps 2 and 6, the decision-file handlings, "When the plan lands" step 3, the loop's three sites, "The final batch" step 3, the Kaiseki branch's two; 6 the Handover's three sites, `templates/kanri-handover.md`'s two edits, and the Delete table's five rows | `roles/kanri.md` and its templates fully consistent on the close's one recommend/check/apply, the spec's four sections, and every `Delete` row's trigger | one `verify --task <N>` call per task, 4 to 6, each clean; `diff --base <the ledger's resolved value>` clean (Kanri, by hand); lint clean on the batch's own changed paths (Kanri, by hand); `mise x node@22 -- node --test skills/tanto/scripts/` passes (Kanri, by hand); `grep -cF '<the close: line, verbatim>' skills/tanto/SKILL.md skills/tanto/roles/kanri.md` prints `1` on each — `roles/hosa.md`'s own copy does not exist until Task 8 (Kanri, by hand) |
| C | 7 `roles/sekkei.md` and `roles/keikaku.md`; 8 `roles/jisso.md`, `roles/kikaku.md` with `templates/kikaku-decision.md`, and `roles/hosa.md`; 9 the two READMEs' passages and drift review | every seat's own file agrees that the close is the one human-check moment, and both READMEs reflect it | one `verify --task <N>` call per task, 7 to 9, each clean; `diff --base <the ledger's resolved value>` clean except any extra lines from Task 9's own drift review, traceable to that step's record in the batch report (Kanri, by hand); lint clean on the batch's own changed paths (Kanri, by hand); `mise x node@22 -- node --test skills/tanto/scripts/` passes (Kanri, by hand); `grep -cF '<the close: line, verbatim>' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md` prints `1` on all three (Kanri, by hand — the same grep Task 4 step 10, Task 8 step 7, and Task 10 step 1 already run) |
| D | 10 the whole-tree `O` sweep, the note's check 24 and its lesson line, and checks 1-9, 16, 18-23 re-run with output recorded; 11 the dogfood report (sweep-and-check, no passage) | the proof that no old text or old enumeration survives anywhere in `skills/tanto/`, `skills/shoroku/`, or the consistency note, and the dogfood's issues-closed and readings sections | one `verify --task <N>` call for Task 10, clean; Task 11 reports `no passages`, a result and not a failure; `diff --base <the ledger's resolved value>` clean except any figure Task 10's own step corrects in the note, traceable to that step's own commit or "nothing to commit" in the batch report; `docs/reports/2026-09-15-shoroku-at-close-dogfood.md` reported exempt as `created:` (Kanri, by hand); lint clean on the changed/created paths (Kanri, by hand); every `O` needle at its stated disposition (Kanri, by hand); the note's checks re-run with output recorded (Kanri, by hand); `git ls-files --eol docs/reports/2026-09-15-shoroku-at-close-dogfood.md` reports `i/lf w/crlf` (Kanri, by hand); **the spec's fresh-`/tanto`-start check** (Verification, batch A), deferred here from batch A because rule 11's authority section forbids starting or replacing a role before this, the final boundary — the human runs `/tanto` fresh on any role once this batch is accepted and reports its start line: `agents: 13 current` or `11 current, 2 written`, and the definitions directory now has `tanto-shoroku-recommend.md` and `tanto-shoroku-apply.md` but not `tanto-shoroku.md` (Kanri, by hand, human-run); **the close's own recommend and apply dispatches (`shoroku.recommend`, `shoroku.apply`) run only from a session started after that fresh start** — a definition written during a session is not visible to that session (`SKILL.md`, Start sequence), so the live Kanri and the live Hosa at this boundary, both started before Batch D, cannot dispatch either kind; the fresh-start check above is what makes one visible, so the close (whether this topic's own T2 or any later stage) is Kanri's or Hosa's only once a session has restarted since. If neither a fresh Kanri nor a fresh Hosa exists when the close is due, the human is asked to open one (`/tanto kanri` or `/tanto hosa` in a new window) before the close's recommend dispatch, not after — the same way a role missing entirely is asked for today (Kanri, by hand) |

**Batch internal order.** Each batch's tasks touch largely disjoint files
(Task 1's `tanto.json`/`SKILL.md` sites do not overlap Task 2's or Task 3's
own `SKILL.md` sites at the line level, per their own passages) and may run
in numeric order without a stricter sequencing rule than "one Jisso, tasks
in order" already gives; Batch D's Task 10 must land before Task 11, since
Task 11's dogfood report counts what Task 10's sweep found.

## How a batch is verified

Named by name and split by **who runs it**: `boundary --plan` runs every
fenced `bash` or `console` block under this heading (down to, and not
including, the `## Tasks` heading that closes it) and judges each by its
exit status alone; Kanri runs the rest by hand, because a `replay-skip:`
pattern `boundary` also honors would silently remove a check from the
fenced set (`./scripts/lint.sh`, `mise x node@22`, and `.tanto/` are all
declared skip patterns in Global Constraints, and the lint and test-suite
checks below would be silently skipped if fenced here — so they are not
fenced) or because the command needs a value — a task number (`verify`
takes one, never a range), a batch's own changed-path list, the `diff` base
Global Constraints has Kanri resolve once and record in the ledger rather
than re-derive live inside a fence — no fixed fence can carry.

The one fence below has three properties: it opens at column 0 (an indented
fence is invisible to both `boundary` and `replay`); it exits non-zero when
it fails; and it is not matched by any of Global Constraints' three
`replay-skip:` patterns — checked directly: it contains none of
`./scripts/lint.sh`, `mise x node@22`, or `.tanto/`.

`git status --porcelain` is `boundary`'s own first check, empty on pass, and
is not repeated below.

**1. Every commit of this batch carries its trailer.**

```bash
git log --format=%H main..HEAD -- skills/tanto docs/notes/tanto-consistency-checks.md docs/reports | while IFS= read -r c; do git log -1 --format=%B "$c" | grep -q 'Co-Authored-By: Claude' || { printf 'missing trailer: %s\n' "$c"; exit 1; }; done && echo "every commit of this plan carries its trailer"
```

Expected: `every commit of this plan carries its trailer`. Scoped to the
paths this plan writes; the range also catches the branch's own spec
commit and any commit before this plan's own that Global Constraints'
"`diff`'s base" describes, which is not a problem — each carries its own
proper trailer and this check does not care which commit wrote it, only
that every commit in range has one.

**What Kanri runs by hand, and why it is not a fence.** `diff --plan
docs/superpowers/plans/2026-09-15-shoroku-at-close.md --base <the value
Global Constraints has Keikaku resolve once, at the branch cut, and record
in the ledger>` — never `git merge-base main HEAD`; expected output is
`diff: clean` (plus its `created:` line) at every boundary, A through D —
`docs/reports/2026-09-15-shoroku-at-close-dogfood.md` (from Task 11) is
declared `created:`, so its content is never checked against a passage or
shows as unaccounted — **except** at Batch D's own boundary, where Task 10's
own note-figure correction (spec's own caveat, this plan's own "Open points
for Kanri" item 7) may add lines beyond its own quoted passages, each traceable
to that step's own commit or "nothing to commit" in the batch report; any
other `unaccounted-added` or `unexplained-removed` line at any boundary is a
real failure. `./scripts/lint.sh` on that batch's own changed paths, named
individually from the Batches table's Delivers column and "Where each
change lives" — the paths differ per batch, a value no fixed fence carries,
and the command is a declared `replay-skip:` pattern besides.
`mise x node@22 -- node --test skills/tanto/scripts/` once per boundary, to
show the untouched scripts still pass — also a declared skip pattern.
`git ls-files --eol docs/reports/2026-09-15-shoroku-at-close-dogfood.md` at
Batch D's own boundary (the file Task 11 creates), expecting `i/lf w/crlf`.
The content greps of `docs/notes/tanto-consistency-checks.md`'s own numbered
checks that the boundary's own batch lands, named in the Batches table's
Stop conditions column, each run and its output recorded rather than only
its exit status read. One `verify --plan
docs/superpowers/plans/2026-09-15-shoroku-at-close.md --task <N>` call per
task of the batch — `verify` takes a single task number, never a range —
which needs each task's own number as a value.

---

## Tasks

### Task 1: the thirteenth kind — `tanto.json`, the kinds list, the definition passes, and the dotless kind

**Batch:** A. **Blocks:** A1.1, A1.2, O1.1 to O1.3, P1.1 to P1.8.

`subagents.shoroku` becomes `subagents.shoroku.recommend`
(`{ "model": "fable", "effort": "high" }`) and `subagents.shoroku.apply`
(`{ "model": "opus", "effort": "medium" }`), and twelve kinds become thirteen
(spec 7.1, 2.1). The definition set gains two files and loses one: the start
sequence removes `tanto-shoroku.md` at both scopes, so that no session is
offered a seat the config no longer has (7.2). The dotless-kind clause loses
`tanto-shoroku` and keeps only `tanto-default`.

**Files:**

- Modify: `skills/tanto/templates/tanto.json`
- Modify: `skills/tanto/SKILL.md`

**Named mechanisms this task changes, and every other site that names them:**
the **kind count** is stated in `SKILL.md`'s `subagents.<kind>` bullet (P1.2),
in the user-scope pass (P1.3), in the project-scope pass (P1.4), in the removal
rule (P1.5), in the agent-list count (P1.6) and in the start line's `<s>` clause
(P1.8) — all six are here — and in `docs/notes/tanto-consistency-checks.md`'s
check 8, its Expected paragraph, its explanation and its tenth-needle
explanation, which are **task 2**, in the same batch, so that the assertion and
the file it asserts on move together. `roles/kanri.md`'s own copy of the count
line no longer carries a number: `tanto-project-config` rewrites it to "the
agent definitions of both scopes". The **two kind names**
`shoroku.recommend` and `shoroku.apply` are named here and in `roles/kanri.md`
(task 4), `roles/hosa.md` (task 8), `SKILL.md`'s "Session exit" (task 2) and
`templates/kanri.md` (task 4); their `subagent_type` spellings
`tanto-shoroku-recommend` and `tanto-shoroku-apply` are named in
`roles/kanri.md` and `roles/hosa.md` only, which check 24 pins (task 10).

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/templates/tanto.json skills/tanto/SKILL.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O1.1** `"shoroku": { "model"` — `skills/tanto/templates/tanto.json` 1 → 0 at
P1.1. The key before the split. The needle stops after `"model"` because the
new keys begin with the same seven characters and only the quote-and-dot tells
them apart.

**O1.2** `twelve kinds` — `skills/tanto/SKILL.md` 3 → 0 at P1.2, P1.3 and P1.4;
`docs/notes/tanto-consistency-checks.md` 2 → 0 at P2.13 and P2.14, in task 2.
Counted on the projected baseline: `tanto-project-config` writes two of the
three `SKILL.md` hits itself, in its two-pass definitions paragraph.

**O1.3** `twelve names` — `skills/tanto/SKILL.md` 3 → 0 at P1.5, P1.6 and P1.8.
Nowhere else in the swept set. All three are `tanto-project-config`'s own text.

- [ ] **Step 3: The config carries two shoroku kinds**

**P1.1** `skills/tanto/templates/tanto.json` — replace exactly this 1 line

```text
    "shoroku": { "model": "opus", "effort": "medium" },
```

**P1.1 →**

```text
    "shoroku.recommend": { "model": "fable", "effort": "high" },
    "shoroku.apply": { "model": "opus", "effort": "medium" },
```

- [ ] **Step 4: The kinds list**

**P1.2** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```text
  agent definition below. The twelve kinds are `task.implement`,
  `task.escalate`, `task.review-spec`, `task.review-quality`, `plan.draft`,
  `plan.review`, `plan.coldread`, `spec.review`, `branch.review`,
  `brief.write`, `shoroku`, and `default`.
```

**P1.2 →**

```text
  agent definition below. The thirteen kinds are `task.implement`,
  `task.escalate`, `task.review-spec`, `task.review-quality`, `plan.draft`,
  `plan.review`, `plan.coldread`, `spec.review`, `branch.review`,
  `brief.write`, `shoroku.recommend`, `shoroku.apply`, and `default`.
```

- [ ] **Step 5: The user-scope pass, and the file it removes**

**P1.3** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```text
**User scope.** Write for each of the twelve kinds the file
`~/.claude/agents/tanto-<object>-<act>.md` — the kind's name with its `.`
turned into a `-`, under `$CLAUDE_CONFIG_DIR/agents/` when that variable is
set — from `templates/agent.md`, when the file is absent or its content
differs from what the template renders. A file that already matches is left
alone. This rendering takes its effort from the merge of the **built-in and
```

**P1.3 →**

```text
**User scope.** Write for each of the thirteen kinds the file
`~/.claude/agents/tanto-<object>-<act>.md` — the kind's name with its `.`
turned into a `-`, under `$CLAUDE_CONFIG_DIR/agents/` when that variable is
set — from `templates/agent.md`, when the file is absent or its content
differs from what the template renders. A file that already matches is left
alone. `tanto-shoroku.md` in that directory, the definition of the kind
before it was split, is removed in the same pass when it exists, so that no
session is offered a seat the config no longer has; the same removal runs at
the project scope when that scope has the file. This rendering takes its
effort from the merge of the **built-in and
```

- [ ] **Step 6: The project-scope pass and its removal rule**

**P1.4** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
**Project scope.** Then compute, for each of the twelve kinds, the three-layer
```

**P1.4 →**

```text
**Project scope.** Then compute, for each of the thirteen kinds, the three-layer
```

**P1.5** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
file does, and only those twelve names are ever removed — nothing else under
```

**P1.5 →**

```text
file does, and only those thirteen names and the retired `tanto-shoroku.md`
are ever removed — nothing else under
```

- [ ] **Step 7: The agent-list count and the dotless kind**

**P1.6** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
the twelve names in it, and among them the ones whose description carries the
```

**P1.6 →**

```text
the thirteen names in it, and among them the ones whose description carries the
```

**P1.7** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
dot in its name, `tanto-shoroku` and `tanto-default`. A kind visible at user
```

**P1.7 →**

```text
dot in its name, which is `tanto-default`. A kind visible at user
```

- [ ] **Step 8: The start line's `<s>` clause**

**P1.8** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
with `<s>` the number of the twelve names whose description in this session's
```

**P1.8 →**

```text
with `<s>` the number of the thirteen names whose description in this session's
```

- [ ] **Step 9: The anchors for this task**

**A1.1** `skills/tanto/templates/tanto.json` — `grep -c 'shoroku.recommend' skills/tanto/templates/tanto.json` — before: 0, after: 1

**A1.2** `skills/tanto/SKILL.md` — `grep -c 'tanto-shoroku.md' skills/tanto/SKILL.md` — before: 0, after: 2

The two hits after P1.3 and P1.5 land are the user-scope pass's removal sentence and the project-scope removal rule's exception.

- [ ] **Step 10: The config still parses and counts thirteen**

```bash
node -e 'const t=require("./skills/tanto/templates/tanto.json");const r=Object.keys(t.sessions),k=Object.keys(t.subagents);if(r.length!==7||k.length!==13)process.exit(1);for(const m of [t.sessions,t.subagents])for(const v of Object.values(m))if(!v.model||!v.effort)process.exit(1);console.log("tanto.json ok",r.length,k.length)'
```

Expected: `tanto.json ok 7 13`. This is check 8's second line with the number
task 2 moves it to; running it here is what makes batch A's boundary green
rather than task 2's alone.

- [ ] **Step 11: Lint**

```bash
./scripts/lint.sh skills/tanto/templates/tanto.json skills/tanto/SKILL.md
```

Expected: exit 0, none `Failed`. `markdownlint-cli2` ignores
`skills/tanto/templates/**`, so only `SKILL.md` is linted as Markdown here.

- [ ] **Step 12: Commit**

```bash
git commit --only skills/tanto/templates/tanto.json skills/tanto/SKILL.md -m "docs(tanto): the shoroku kind splits in two and twelve kinds become thirteen" -m "subagents.shoroku becomes shoroku.recommend on fable and shoroku.apply on opus; the kinds list, both definition passes, the removal rule, the agent-list count and the start line's <s> clause all say thirteen; the start sequence removes the retired tanto-shoroku.md at both scopes, and the dotless-kind clause keeps only tanto-default. Spec 2.1, 7.1, 7.2." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 13: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 14: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-shoroku-at-close.md --task 1
```

Expected: `task 1: verify clean`.

**Done when:** the eight passages are present, A1.1 returns `1` and A1.2 `2`, the
needles of O1.1 to O1.3 return `0` in `skills/tanto/`, step 10 prints
`tanto.json ok 7 13`, lint is clean, and the commit carries its trailer.

---

### Task 2: the contract's "Session exit", the Artifacts rows, Hosa's row, and the count's assertion

**Batch:** A. **Blocks:** A2.1, O2.1 to O2.17, P2.1 to P2.18.

The contract's own statement of the mechanism. "Session exit" is replaced
whole: the four steps stay, but **only the first runs at an exit** — the
session writes its candidates, Kanri checks the form and records `pending`
rows, and the session is deleted at once; the close is the one stage that
recommends, checks and applies, and a live Hosa runs its last three steps (spec
2.2). The Artifacts table's six rows follow the file names and the two kinds
(2.3), Hosa's row in "The roles" gains the close (2.4), `roles/kaiseki.md`'s
one sentence stops promising a recommendation at an exit (5.2),
`skills/shoroku/SKILL.md`'s recommend mode takes more than one source (8.2),
and the note's check 8 asserts thirteen kinds (8.3) — in this task, and so in
this batch, because the assertion and `tanto.json` must move together.
`templates/shoroku-brief.md` joins here too, on Kanri's own ruling (not the
spec's, which predates the file): it already landed with the interim
multi-stage wording, and Task 10's whole-tree sweep would otherwise find it
as a residual (plan-dryrun, Open point 4).

**Files:**

- Modify: `skills/tanto/SKILL.md`
- Modify: `skills/tanto/roles/kaiseki.md`
- Modify: `skills/tanto/templates/shoroku-brief.md`
- Modify: `skills/shoroku/SKILL.md`
- Modify: `docs/notes/tanto-consistency-checks.md`

**Named mechanisms this task changes, and every other site that names them:**
the **`close:` line** — `close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`
— is written here in P2.1, in `roles/kanri.md`'s "Delegation to Hosa" (task 4,
P4.1) and in `roles/hosa.md` (task 8, P8.4), and must read the same in all
three; check 24's fourth grep (task 10) pins it. The **answers** `close done:`
and `close blocked:` are named at those same three sites and nowhere else. The
**stage vocabulary** — `t2` for every ledger row, `exit-<role>[-<suffix>]`
naming a proposal file and never a Stage value — is stated here, in
`roles/kanri.md` (task 4), in `templates/kanri.md` and `templates/roster.md`
(task 4); `roles/sekkei.md` and `roles/keikaku.md` each carry one sentence that
still calls the exit word a stage word, which no spec section rewrites and
which is Open point 8. The **kind count's assertion** is check 8's `node -e`
line here and `templates/tanto.json` in task 1.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/SKILL.md skills/tanto/roles/kaiseki.md skills/shoroku/SKILL.md skills/tanto/templates/shoroku-brief.md docs/notes/tanto-consistency-checks.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O2.1** `T0 (` — `skills/tanto/SKILL.md` 1 → 0 at P2.1. The stage list's first
entry, in the paragraph the whole-section replacement removes.

**O2.2** `T1 (` — `skills/tanto/SKILL.md` 1 → 0 at P2.1. Its second.

**O2.3** `the brief writer, T1` — `skills/tanto/SKILL.md` 1 → 0 at P2.3. The
`dialogue.md` row's Readers column, the one Artifacts cell that named T1 as a
reader.

**O2.4** `question back to the session` — `skills/tanto/SKILL.md` 1 → 0 at
P2.1; `skills/tanto/roles/kanri.md` 1 → 0 at P4.1, in task 4. The path that
has never fired, dropped with the recommender run before a deletion.

**O2.5** `could not be read as written` — `skills/tanto/SKILL.md` 1 → 0 at
P2.1; `skills/tanto/roles/kanri.md` 2 → 0 at P4.1, in task 4. The same path's
own question text.

**O2.6** `dispatches the recommender at once` — `skills/tanto/SKILL.md` 1 → 0
at P2.1. `roles/sekkei.md` wraps its copy after `dispatches the`, so no needle
taken from this phrase sees it; O7.5 is that file's own, in task 7.

**O2.7** `at every stage` — `skills/tanto/SKILL.md` 2 → 0 at P2.1;
`skills/tanto/roles/kanri.md` 4 → 0 at P4.1 (three) and P5.12 (one);
`skills/tanto/templates/kanri.md` 1 → 0 at P4.4; `skills/tanto/README.md` 1 →
0 at P9.2. Spec's Old values row says the plan reads each hit, and it did:
every one of the eight means the stages of the write-out.
`skills/tanto/templates/shoroku-brief.md` carries a ninth, wrapped across a
line break so that no single-line needle sees it — retired at P2.17.

**O2.8** `t0-recommendation.md` — `skills/tanto/SKILL.md` 1 → 0 at P2.6;
`skills/tanto/roles/kanri.md` 1 → 0 at P4.1, in task 4.

**O2.9** `T0 input` — `skills/tanto/SKILL.md` 1 → 0 at P2.2;
`skills/tanto/roles/kikaku.md` 1 → 0 at P8.2 and
`skills/tanto/templates/kikaku-decision.md` 1 → 0 at P8.3, both in task 8.

**O2.10** `| Kanri, the recommender |` — `skills/tanto/SKILL.md` 2 → 0 at P2.4
and P2.5. The two proposal rows' Readers value, which is the same string in
both, so neither row is quoted alone.

**O2.11** `stage>-recommendation.md` — `skills/tanto/SKILL.md` 2 → 0 at P2.1
and P2.6; `skills/tanto/roles/kanri.md` 1 → 0 at P4.1;
`skills/tanto/templates/kanri.md` 1 → 0 at P4.4, both in task 4.

**O2.12** `stage>-brief.md` — `skills/tanto/SKILL.md` 2 → 0 at P2.1 and P2.6;
`skills/tanto/roles/kanri.md` 1 → 0 at P4.1, in task 4. Two further hits in
`skills/tanto/templates/shoroku-brief.md` are retired at P2.15, this same
task — Kanri's own ruling on Open point 4, folded in after the drafter
found it in no section of the spec.

**O2.13** `stage>-direction.md` — `skills/tanto/SKILL.md` 2 → 0 at P2.1 and
P2.7; `skills/tanto/roles/kanri.md` 1 → 0 at P4.1;
`skills/tanto/templates/kanri.md` 1 → 0 at P4.4, both in task 4. One further
hit in `templates/shoroku-brief.md`, retired at P2.18 — as O2.12.

**O2.14** `tanto.json ok 7 12` — `docs/notes/tanto-consistency-checks.md` 1 →
0 at P2.12. The Expected paragraph's stale count.

**O2.15** `Invoked with a source` — `skills/shoroku/SKILL.md` 1 → 0 at P2.10.

**O2.16** `recommendation, the human's check, and the apply are dispatched` — `skills/tanto/roles/kaiseki.md` 1 → 0 at P2.9.

**O2.17** `k.length!==12` — `docs/notes/tanto-consistency-checks.md` 1 → 0 at
P2.11. Check 8's assertion itself.

- [ ] **Step 3: "Session exit", replaced whole**

**P2.1** `skills/tanto/SKILL.md` — replace exactly these 102 lines

```text
## Session exit

Before the human deletes a session in the normal flow, the session's **exit
shoroku** runs. The shoroku stages are T0 (decisions, on `main` before Sekkei
exists), T1 (requirements and issues, after the plan commit), and T2
(everything else, after the final batch); `R-n` numbers Kanri's rulings and
`S-n` its shoroku candidates, both in the conductor ledger. The stage word is
`t0`, `t1`, `t2`, or `exit-<role>[-<suffix>]`.

Every stage runs the same four steps, and an exit is that flow applied to one
session:

1. **Candidates.** The session that holds them writes them as a numbered
   list, opening with the line that says what the proposal excludes; an exit
   writes `exit-<role>[-<suffix>]-proposal.md`. Only this step needs a
   resident context.
2. **Recommend.** Kanri dispatches the `shoroku` kind over that file and
   names the output, `<stage>-recommendation.md`: every item once, quoted in
   full, in three groups — Recommended adopt, Recommended reject, Unsure —
   each with its destination and its one-line reason. The same dispatch names
   the brief path, `<stage>-brief.md` beside the recommendation, the template
   `templates/shoroku-brief.md`, and the chat's language; the recommender
   writes both files in one run.
   <!-- markdownlint-disable MD038 -->
3. **Check.** Kanri checks the brief's form by `grep` — the four headings
   present and in order, every `###` item heading's text, its `### ` marker
   stripped, appearing exactly once after `See:` in the brief — dispatches
   the recommender once more
   on a failure and pastes the brief as it stands on a second, then gives the
   human both paths, the three counts, and the brief's text verbatim; the
   human answers by exception; Kanri writes `<stage>-direction.md` beside the
   recommendation, item by item, with the `S-n` rows in the conductor ledger.
   <!-- markdownlint-enable MD038 -->
4. **Apply.** Kanri dispatches the `shoroku` kind again, in apply mode, with
   the recommendation, the direction, and the commit subject; that subagent
   writes the accepted subset per `docs/AGENTS.md`, runs the repository's
   lint on the changed paths — or on the whole repository where the lint
   script takes no path arguments, which satisfies the step — and commits
   once by explicit path in a slot. No session applies the
   accepted subset of its own proposal. Kanri verifies the diff as for any
   commit and marks the `S-n` rows written.

Nothing is adopted between stages, and no item is decided by Kanri alone: the
human sees the whole recommendation, grouped, at every stage. Candidates are
what is not yet in any file — a rejected alternative and its reason, a fact
measured, a defect noticed, an observation about the run — never a
restatement of a spec, a plan, a report, or a ledger. Kikaku and Hosa have no
exit shoroku; the human `/clear`s those windows instead. A standalone Kaiseki
has no Kanri, and its role file says how.

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
dispatches the recommender at once. When the recommendation and its brief
are on disk, Kanri reads the brief's `## Unsure` group (`sections …
Unsure`): a line there carrying a "could not be read as written" question is
one question
back to the session, one line, answered by a rewrite of the proposal;
otherwise Kanri asks the human, as a numbered list, to delete the session.
The session idles through
one subagent run, and steps 3 and 4 run without it — the human's check works
on the recommendation's full quotation of each item, which is what the
session would have been asked about. A session that has stopped
answering is past answering, and Kanri learns it the way it learns of a missing
batch report — the human says the session is gone, or Kanri's window wakes for
another reason and the answer has not arrived. Kanri then treats the exit as
forced — the roster's Events line says the exit shoroku did not run and what
was lost, as far as Kanri knows — asks the human to delete it, and continues.
Jisso idles through the proposal and one recommender run, not through a
boundary.

The file pattern is `exit-<role>[-<suffix>]`, with the suffix the batch letter
for Jisso (`exit-jisso-B`, a Jisso leaving at batch B's boundary), the case
number for Kaiseki (`exit-kaiseki-1`), absent for Sekkei (`exit-sekkei`) and
for Keikaku (`exit-keikaku`), and the date and the bare name for Kanri
(`exit-kanri-<YYYY-MM-DD>-<name>`); the conductor ledger's Stage values mirror
it. The files live in the topic directory, `.tanto/<topic>/`, for Jisso,
Sekkei, Keikaku, and an attached Kaiseki, and next to the roster, at
`.tanto/`, for Kanri. Kanri's own exit has a recommendation and a direction
file like every other, with the human checking as at every stage.

The apply subagent's commit subject begins with `docs: exit shoroku` or
`docs: T<n> shoroku` — `docs: exit shoroku for jisso at B`,
`docs: T2 shoroku for <topic>` — which is the fixed prefix the whole-branch
review package excludes.
```

**P2.1 →**

```text
## Session exit

Before the human deletes a session in the normal flow, the session's **exit
shoroku** runs: the session writes its candidates to a file, and the file
outlives it. Nothing is recommended, checked, or applied at an exit. The
one stage at which candidates are recommended, checked by the human, and
applied is the topic's **close**, stage word `t2`, after the final batch;
the word `exit-<role>[-<suffix>]` names a session's proposal file and
nothing else — every row of a ledger's `S-n` table carries Stage `t2`, the
stage that recommends it. `R-n` numbers Kanri's rulings and `S-n` its
shoroku candidates, both in the conductor ledger.

The close runs four steps, and every other moment runs only the first:

1. **Candidates.** The session that holds them writes them as a numbered
   list, opening with the line that says what the proposal excludes; an
   exit writes `exit-<role>[-<suffix>]-proposal.md`, the close's Jisso
   writes `shoroku-proposal.md`. Only this step needs a resident context.
   Kanri checks the file's form — the exclusion line and the numbered list
   — records each item as a `pending` row of the ledger's `S-n` table whose
   Source names the file and the item, and asks the human to delete the
   session. The spec's four sections — Requirements, The ADRs, Deferred
   items, and Shoroku candidates from this spec work — are recorded the same
   way when the spec is accepted, four rows whose Source names the spec and
   the heading; a batch report's, a review report's, and a Kaiseki report's
   candidates are recorded at the boundary that reads them. Nothing is
   copied: a row is one line and a pointer.
2. **Recommend.** At the close, Kanri dispatches the `shoroku.recommend`
   kind over Jisso's proposal and every source the `pending` rows name —
   the spec's sections by heading, each proposal by path, each report by
   path and item — and names the output, `t2-recommendation.md`: every item
   once, quoted in full from its source, in three groups — Recommended
   adopt, Recommended reject, Unsure — each with its destination and its
   one-line reason. The same dispatch names the brief path, `t2-brief.md`
   beside the recommendation, the template `templates/shoroku-brief.md`,
   and the chat's language; the recommender writes both files in one run.
   <!-- markdownlint-disable MD038 -->
3. **Check.** Kanri checks the brief's form by `grep` — the four headings
   present and in order, every `###` item heading's text, its `### ` marker
   stripped, appearing exactly once after `See:` in the brief — dispatches
   the recommender once more on a failure and pastes the brief as it stands on a second, then
   gives the human both paths, the three counts, and the brief's text
   verbatim; the human answers by exception, in Kanri's window or through a
   Kikaku decision file whose third section names this recommendation and
   answers it; Kanri writes `t2-direction.md` beside the recommendation,
   item by item, with the `S-n` rows in the conductor ledger.
   <!-- markdownlint-enable MD038 -->
4. **Apply.** Kanri dispatches the `shoroku.apply` kind with the
   recommendation, the direction, and the commit subject; that subagent
   writes the accepted subset per `docs/AGENTS.md`, runs the repository's
   lint on the changed paths — or on the whole repository where the lint
   script takes no path arguments, which satisfies the step — and commits
   once by explicit path, on the topic's branch, before the merge decision.
   No session applies the accepted subset of its own proposal. Kanri
   verifies the diff as for any commit and marks the `S-n` rows written.

When a Hosa is live, steps 2 to 4 are its: Kanri sends one line,
`close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`,
and Hosa dispatches the recommender, form-checks and pastes the brief in
its own window under its chores grant, writes the direction from the
human's answer — or from a `decision: <path>` line Kanri relays — dispatches
the apply in that slot, and answers `close done: <commit subject> — <reading>`
or `close blocked: <one line>`; Kanri, or the successor it has handed over
to, verifies the commit and fills the ledger. With no Hosa live, Kanri runs
the three steps itself.

Nothing is adopted before the close, and no item is decided by Kanri alone:
the human sees the whole recommendation, grouped, once per topic.
Candidates are what is not yet in any file — a rejected alternative and its
reason, a fact measured, a defect noticed, an observation about the run —
never a restatement of a spec, a plan, a report, or a ledger. Kikaku and
Hosa have no exit shoroku; the human `/clear`s those windows instead. A
standalone Kaiseki has no Kanri, and its role file says how.

Kanri's own exit is the one exception to "only the first step": between
plans, with no ledger open, it runs all four steps — steps 2 to 4 through
a live Hosa by the same `close:` line, with `kanri` for the topic — and its
apply lands on `main`; while a ledger is open, its items are `pending` rows
in that ledger — the topic whose batches are in flight, else the oldest
open — and wait for that topic's close. A topic the human ends before its final batch still
gets its close, over what is on disk, with Kanri writing the proposal in
Jisso's absence.

The lines, each sent without an idle subscription, like every other tanto
line, and in one of two forms. For Jisso, a Kaiseki, and Kanri's own exit,
Kanri sends `exit: propose your shoroku; write it to <path>`; the session
writes the proposal, runs the resume self-check, and answers
`exit proposal: <path> — <reading>`. For a **Sekkei or a Keikaku at its own
final boundary**, no `exit:` line is sent: that seat writes the proposal
unasked as the last act of the boundary and names it in the same report
line — `spec accepted: <spec path>; exit proposal: <path> — <reading>` for
Sekkei, `coldread answered: <pointer, one per question, or none>; exit proposal: <path> — <reading>`
for Keikaku — and then idles. An exit that falls **away** from that
boundary — a compaction in the reading, a replacement, the human not
wanting the plan now — takes the `exit:` line like every other role. Kanri
checks that the file exists and opens with the exclusion line and a
numbered list — a direct read, since the proposal carries no headings for
`sections` to select by — records the rows, and asks the human, as a
numbered list, to delete the session at once. The session idles through
nothing: its judgment is in the file, and the file is what the close's
recommender quotes. A session that has stopped answering is past answering,
and Kanri learns it the way it learns of a missing batch report — the human
says the session is gone, or Kanri's window wakes for another reason and
the answer has not arrived. Kanri then treats the exit as forced — the
roster's Events line says the exit shoroku did not run and what was lost,
as far as Kanri knows — asks the human to delete it, and continues.

The file pattern is `exit-<role>[-<suffix>]`, with the suffix the batch
letter for Jisso (`exit-jisso-B`, a Jisso leaving at batch B's boundary),
the case number for Kaiseki (`exit-kaiseki-1`), absent for Sekkei
(`exit-sekkei`) and for Keikaku (`exit-keikaku`), and the date and the bare
name for Kanri (`exit-kanri-<YYYY-MM-DD>-<name>`); the roster's Shoroku
candidates rows that a between-plans Kanri exit recommends carry that word
as their Stage, and a ledger's rows carry `t2`. The files live in the topic
directory,
`.tanto/<topic>/`, for Jisso, Sekkei, Keikaku, and an attached Kaiseki, and
next to the roster, at `.tanto/`, for Kanri. The close's three files —
`t2-recommendation.md`, `t2-brief.md`, `t2-direction.md` — live in the
topic directory; Kanri's between-plans exit has its own three at `.tanto/`,
named `exit-kanri-<YYYY-MM-DD>-<name>-recommendation.md`, `-brief.md`, and
`-direction.md`.

The apply subagent's commit subject is `docs: T2 shoroku for <topic>` at
the close, or `docs: exit shoroku for kanri` at Kanri's between-plans exit
— the two fixed prefixes, `docs: T2 shoroku` and `docs: exit shoroku`, that
the whole-branch review package excludes.
```

- [ ] **Step 4: The Artifacts table — the decision file and the dialogue**

**P2.2** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
| `.tanto/kikaku/<YYYY-MM-DD>-<slug>.md` | Kikaku | Kanri | one decision from the human's consultation, from `templates/kikaku-decision.md`; named to Kanri as `decision: <path>`, and from there a T0 input, an `I-n`, or an `S-n` source |
```

**P2.2 →**

```text
| `.tanto/kikaku/<YYYY-MM-DD>-<slug>.md` | Kikaku | Kanri | one decision from the human's consultation, from `templates/kikaku-decision.md`; named to Kanri as `decision: <path>`, and from there the next topic's input document, an `I-n`, an `S-n` source, or a stage's Check answer |
```

**P2.3** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
| `.tanto/<topic>/dialogue.md` | Sekkei | Kanri, the brief writer, T1 | the spec dialogue: each question Sekkei put and the human's answer, verbatim, in order |
```

**P2.3 →**

```text
| `.tanto/<topic>/dialogue.md` | Sekkei | Kanri, the brief writer, the close's recommender | the spec dialogue: each question Sekkei put and the human's answer, verbatim, in order |
```

- [ ] **Step 5: The Artifacts table — the two proposal rows**

**P2.4** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
| `.tanto/<topic>/shoroku-proposal.md` | Jisso | Kanri, the recommender | the T2 proposal, written to a file instead of printed |
```

**P2.4 →**

```text
| `.tanto/<topic>/shoroku-proposal.md` | Jisso | Kanri, for its form; the close's recommender, by path | the close's proposal: the `pending` rows by number and what Jisso's own context holds that no file does, written to a file instead of printed |
```

**P2.5** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
| `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | the exiting session | Kanri, the recommender | the exit shoroku proposal, opening with the line that says what it excludes |
```

**P2.5 →**

```text
| `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | the exiting session | Kanri, for its form; the close's recommender, by path | the exit shoroku proposal, opening with the line that says what it excludes |
```

- [ ] **Step 6: The Artifacts table — the recommendation, the brief, the direction**

**P2.6** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
| `.tanto/<topic>/<stage>-recommendation.md`, or `.tanto/t0-recommendation.md` and Kanri's own exit at `.tanto/` | the `shoroku` recommender Kanri dispatches | Kanri, the human, the apply subagent | every candidate once, quoted in full, in three groups — Recommended adopt, Recommended reject, Unsure — each with its destination and its one-line reason |
| `.tanto/<topic>/<stage>-brief.md`, or `.tanto/<stage>-brief.md` for T0 and Kanri's own exit | the `shoroku` recommender, in the same dispatch as the recommendation | Kanri, by `grep` for its form and by `sections` (its bare heading text) for the `Unsure` group; the human, verbatim | the check brief, from `templates/shoroku-brief.md`, in the chat's language: one line per item, grouped as the recommendation groups them, each pointing at the item's `###` heading |
```

**P2.6 →**

```text
| `.tanto/<topic>/t2-recommendation.md`, or Kanri's between-plans exit at `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-recommendation.md` | the `shoroku.recommend` kind Kanri dispatches at the close | Kanri, the human, the apply subagent | every candidate once, quoted in full from the source its `pending` row names, in three groups — Recommended adopt, Recommended reject, Unsure — each with its destination and its one-line reason |
| `.tanto/<topic>/t2-brief.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-brief.md` for Kanri's between-plans exit | the `shoroku.recommend` kind, in the same dispatch as the recommendation | Kanri, by `grep` for its form and by `sections` (its bare heading text) for the `Unsure` group; the human, verbatim | the check brief, from `templates/shoroku-brief.md`, in the chat's language: one line per item, grouped as the recommendation groups them, each pointing at the item's `###` heading |
```

**P2.7** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
| `.tanto/<topic>/<stage>-direction.md`, beside the recommendation | Kanri, from the human's answer | the apply subagent | what the human accepted, item by item; the apply never runs without it |
```

**P2.7 →**

```text
| `.tanto/<topic>/t2-direction.md`, beside the recommendation, or Kanri's between-plans exit at `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-direction.md` | Kanri, from the human's answer — in its window, or a Kikaku decision file whose third section answers the recommendation | the `shoroku.apply` kind | what the human accepted, item by item; the apply never runs without it |
```

- [ ] **Step 7: `templates/shoroku-brief.md`'s own retired strings**

`tanto-sweep-2` task 10 already landed this template with the interim,
multi-stage wording — `<stage>-brief.md`, `<stage>-direction.md`, "for T0
and Kanri's own exit", and "at every stage" — and no section of the spec
lists the file, since it did not exist when the spec was drafted (Open
point 4 of the plan-dryrun). It is swept by Task 10's own whole-tree needle
list regardless, so it is fixed here rather than left as a documented
exception.

**P2.15** `skills/tanto/templates/shoroku-brief.md` — replace exactly these 6 lines

```text
# Shoroku check brief — <stage> — <topic or Kanri's name>

Written by the `shoroku` recommender in the same dispatch as the
recommendation, at `.tanto/<topic>/<stage>-brief.md`, or
`.tanto/<stage>-brief.md` for T0 and Kanri's own exit, beside the
recommendation and untracked under `.tanto/.gitignore`. Every part of the
```

**P2.15 →**

```text
# Shoroku check brief — <topic or Kanri's name>

Written by the `shoroku.recommend` kind in the same dispatch as the
recommendation, at `.tanto/<topic>/t2-brief.md`, or
`.tanto/exit-kanri-<YYYY-MM-DD>-<name>-brief.md` for Kanri's between-plans
exit, beside the recommendation and untracked under `.tanto/.gitignore`.
Every part of the
```

**P2.16** `skills/tanto/templates/shoroku-brief.md` — replace exactly these 2 lines

```text
Document: <the recommendation's path> — <stage> — written <YYYY-MM-DD> on
<model family> for the chat language <language>.
```

**P2.16 →**

```text
Document: <the recommendation's path> — t2, or the Kanri exit's own
stage word — written <YYYY-MM-DD> on <model family> for the chat language
<language>.
```

**P2.17** `skills/tanto/templates/shoroku-brief.md` — replace exactly these 2 lines

```text
the single rendered line `none`, so that the four headings are present at
every stage.
```

**P2.17 →**

```text
the single rendered line `none`, so that the four headings are always
present.
```

**P2.18** `skills/tanto/templates/shoroku-brief.md` — replace exactly these 2 lines

```text
What you answer is what Kanri writes into `<stage>-direction.md`, item by
item; the apply reads that file and the recommendation, never this brief.
```

**P2.18 →**

```text
What you answer is what Kanri writes into `t2-direction.md`, or the Kanri
exit's own `-direction.md`, item by item; the apply reads that file and the
recommendation, never this brief.
```

- [ ] **Step 8: Hosa's row in "The roles"**

**P2.8** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
| Hosa (補佐) | 0 or 1, opened by the human | the human's small chores and Kanri's filings, each in a slot Kanri gives | the human; Kanri |
```

**P2.8 →**

```text
| Hosa (補佐) | 0 or 1, opened by the human | the human's small chores, Kanri's filings, and the close's recommend, check, and apply, each in a slot Kanri gives | the human; Kanri |
```

Kanri's row keeps `the recommendations and the directions`: Kanri owns them,
and hands their writing to Hosa as it hands a filing (spec 2.4).

- [ ] **Step 9: Kaiseki's attached exit**

**P2.9** `skills/tanto/roles/kaiseki.md` — replace exactly these 2 lines

```text
idle: the recommendation, the human's check, and the apply are dispatched
work, and your deletion follows.
```

**P2.9 →**

```text
idle: your items are recommended and checked at the topic's close, with
everything else, and your deletion follows the form check.
```

- [ ] **Step 10: `shoroku`'s recommend mode takes more than one source**

**P2.10** `skills/shoroku/SKILL.md` — replace exactly these 5 lines

```text
**Recommend mode.** Invoked with a source — a file, or a file and the names
of the sections to read — an output path, and a baseline, the `docs/` tree an
item's destination and reason are judged against; and, when the caller wants
the check brief, a brief path, a template, and a chat language. Run the
workflow up to the
```

**P2.10 →**

```text
**Recommend mode.** Invoked with one or more sources — each a file, or a file
and the names of the sections to read — an output path, and a baseline, the
`docs/` tree an item's destination and reason are judged against; and, when
the caller wants the check brief, a brief path, a template, and a chat
language. A caller that names several sources reads every one, since the
proposal it writes is the only proposal there is. Run the
workflow up to the
```

The rest of the section, the group headings included, is unchanged; the note's
check 18 pairs those headings with `tanto`'s side and is unaffected (spec 8.2).

- [ ] **Step 11: The note's check 8 asserts thirteen**

**P2.11** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```text
node -e 'const t=require("./skills/tanto/templates/tanto.json");const r=Object.keys(t.sessions),k=Object.keys(t.subagents);if(r.length!==7||k.length!==12)process.exit(1);for(const m of [t.sessions,t.subagents])for(const v of Object.values(m))if(!v.model||!v.effort)process.exit(1);console.log("tanto.json ok",r.length,k.length)'
```

**P2.11 →**

```text
node -e 'const t=require("./skills/tanto/templates/tanto.json");const r=Object.keys(t.sessions),k=Object.keys(t.subagents);if(r.length!==7||k.length!==13)process.exit(1);for(const m of [t.sessions,t.subagents])for(const v of Object.values(m))if(!v.model||!v.effort)process.exit(1);console.log("tanto.json ok",r.length,k.length)'
```

**P2.12** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```text
`tanto.json ok 7 12`; then `['description', 'effort', 'name']` and `ok`;
```

**P2.12 →**

```text
`tanto.json ok 7 13`; then `['description', 'effort', 'name']` and `ok`;
```

**P2.13** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```text
The second line is a parse and two assertions in one: the twelve kinds, the
```

**P2.13 →**

```text
The second line is a parse and two assertions in one: the thirteen kinds, the
```

**P2.14** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```text
that are gone — `default` survives as one of the twelve kinds and is not
```

**P2.14 →**

```text
that are gone — `default` survives as one of the thirteen kinds and is not
```

- [ ] **Step 12: The anchor for this task**

**A2.1** `skills/tanto/SKILL.md` — `grep -cF 'close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' skills/tanto/SKILL.md` — before: 0, after: 1

- [ ] **Step 13: Check 8's own second line, re-run**

```bash
node -e 'const t=require("./skills/tanto/templates/tanto.json");const r=Object.keys(t.sessions),k=Object.keys(t.subagents);if(r.length!==7||k.length!==13)process.exit(1);for(const m of [t.sessions,t.subagents])for(const v of Object.values(m))if(!v.model||!v.effort)process.exit(1);console.log("tanto.json ok",r.length,k.length)'
```

Expected: `tanto.json ok 7 13` — the same line P2.11 lands, run from the
repository root, so that the note and the file it checks are green together.

- [ ] **Step 14: Lint**

```bash
./scripts/lint.sh skills/tanto/SKILL.md skills/tanto/roles/kaiseki.md skills/shoroku/SKILL.md skills/tanto/templates/shoroku-brief.md docs/notes/tanto-consistency-checks.md
```

Expected: exit 0, none `Failed`. `markdownlint-cli2` ignores
`skills/tanto/templates/**`, so the template is linted only by this step's
own frontmatter-free plain-text pass, not as Markdown. This step runs before
the Verify step below.

- [ ] **Step 15: Commit**

```bash
git commit --only skills/tanto/SKILL.md skills/tanto/roles/kaiseki.md skills/shoroku/SKILL.md skills/tanto/templates/shoroku-brief.md docs/notes/tanto-consistency-checks.md -m "docs(tanto): an exit writes candidates and nothing else, and the close is the one check" -m "Session exit is replaced whole: the four steps run once per topic at its close, an exit runs only the first, a live Hosa runs steps 2 to 4 under the close: line, and the stage word is t2 for every ledger row while exit-<role> names a file. The Artifacts rows take the t2 file names and the two kinds; the check-brief template itself drops the interim multi-stage wording it landed with; Hosa's role row gains the close; Kaiseki's exit sentence and shoroku's recommend-mode input follow; check 8 asserts thirteen kinds. Spec 2.2, 2.3, 2.4, 5.2, 8.2, 8.3." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 16: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 17: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-shoroku-at-close.md --task 2
```

Expected: `task 2: verify clean`.

**Done when:** the eighteen passages are present, A2.1 returns `1`, the needles
of O2.1 to O2.17 return `0` in the files this task touches, step 13 prints
`tanto.json ok 7 13`, lint is clean, and the commit carries its trailer.

---

### Task 3: the skill-name key is an object and an act, and the write-out lane

**Batch:** A. **Blocks:** A3.1, O3.1, O3.2, P3.1 to P3.3.

`subagents.shoroku` was "the one built-in skill-name key"; after the split a
skill-name key's `<object>` is the skill and its `<act>` is one of that skill's
modes, so a skill with two modes has two keys (spec 2.1, ADR 2). The old key is
an unknown key from then on — reported once in the start line, setting neither
half — and the unknown-key sentence carries that as its worked example. The
consistency note's write-out lane paragraph stops naming T1 and T2 as the
stages that write under `docs/` (8.3).

**Files:**

- Modify: `skills/tanto/SKILL.md`
- Modify: `docs/notes/tanto-consistency-checks.md`

**Named mechanisms this task changes, and every other site that names them:**
the **unknown-key report** is spelled in `SKILL.md`'s overlay paragraph (P3.2)
and, as `unknown key ceiling.<name> in <path>, ignored`, in the line beneath
it, which is `tanto-project-config`'s and is unchanged here; `scripts/reading.js`
writes the `ceiling` form on `stderr` and reads no `subagents` key at all, so
neither script nor test changes (spec "Measured while designing"). The
**skill-name key's shape** is stated only in the bullet P3.1 rewrites; the two
keys it names are `templates/tanto.json`'s, task 1.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/SKILL.md docs/notes/tanto-consistency-checks.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O3.1** `is the one built-in` — `skills/tanto/SKILL.md` 1 → 0 at P3.1. The
claim that one key is the whole built-in set of skill-name keys. The needle
stops before the backticked name, which a needle cannot carry, and it spans the
change: the new sentence reads "are the two built-in skill-name keys".

**O3.2** `T1, T2 and every exit shoroku` — `docs/notes/tanto-consistency-checks.md`
1 → 0 at P3.3. The note's own account of which stages write under `docs/`.

- [ ] **Step 3: A skill-name key is an object and an act**

**P3.1** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```text
- A key inside `subagents` whose name is a **skill name** means "run that skill
  in a subagent on that model instead of inline". When the key is absent, the
  skill runs inline on the session's model. `shoroku` is the one built-in
  skill-name key; any other is a personal addition.
```

**P3.1 →**

```text
- A key inside `subagents` whose `<object>` is a **skill name** and whose
  `<act>` is one of that skill's modes means "run that mode of the skill in a
  subagent on that model instead of inline". When the key is absent, the mode
  runs inline on the session's model. `shoroku.recommend` and `shoroku.apply`
  are the two built-in skill-name keys, naming the `shoroku` skill's
  recommend and apply modes; any other is a personal addition.
```

- [ ] **Step 4: The unknown-key sentence gains its example**

**P3.2** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
your start line as `unknown key <name> in <path>, ignored`, or as
```

**P3.2 →**

```text
your start line as `unknown key <name> in <path>, ignored` —
`subagents.shoroku`, the kind's name before it was split into
`shoroku.recommend` and `shoroku.apply`, is one such key, and a personal file
that still carries it sets neither half — or as
```

The spec quotes this line without `in <path>`, which is the spelling before
`tanto-project-config` lands; the old text above is that plan's own new text,
and the example is grafted onto it unchanged in sense. Open point 1.

- [ ] **Step 5: The note's write-out lane**

**P3.3** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```text
T1, T2 and every exit shoroku write ADRs, design entries and issue resolutions
```

**P3.3 →**

```text
the close of every topic writes ADRs, design entries and issue resolutions
```

- [ ] **Step 6: The anchor for this task**

**A3.1** `skills/tanto/SKILL.md` — `grep -c 'is one such key' skills/tanto/SKILL.md` — before: 0, after: 1

- [ ] **Step 7: The contract's frontmatter still parses**

```bash
uv run --no-project --with pyyaml python -c "import yaml;t=open('skills/tanto/SKILL.md',encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')"
```

Expected: `['argument-hint', 'description', 'name']`, then `ok`. Use
`uv run --no-project`, never a bare `python`. A `BAD` means a colon followed by
a space reached the `description`, which breaks frontmatter parsing silently;
nothing this task writes touches the frontmatter, and this is the evidence.

- [ ] **Step 8: Lint**

```bash
./scripts/lint.sh skills/tanto/SKILL.md docs/notes/tanto-consistency-checks.md
```

Expected: exit 0, none `Failed`.

- [ ] **Step 9: Commit**

```bash
git commit --only skills/tanto/SKILL.md docs/notes/tanto-consistency-checks.md -m "docs(tanto): a skill-name key names a mode, and the old key is an unknown key" -m "The subagents bullet says a skill-name key is <object>.<act>, and the two built-in ones are shoroku.recommend and shoroku.apply; the unknown-key sentence carries subagents.shoroku as its worked example, setting neither half. The note's write-out lane paragraph names the close instead of T1 and T2. Spec 2.1, 8.3." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 10: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 11: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-shoroku-at-close.md --task 3
```

Expected: `task 3: verify clean`.

**Done when:** the three passages are present, A3.1 returns `1`, the needles of
O3.1 and O3.2 return `0`, the frontmatter check prints `ok`, lint is clean, and
the commit carries its trailer.

---

### Task 4: Kanri's "Shoroku" replaced whole, with the ledger and roster templates

**Batch:** B. **Blocks:** A4.1, A4.2, O4.1 to O4.4, O4.6, P4.1 to P4.8.

The role file's account of the mechanism. "Shoroku" is replaced whole: one
stage per topic, the close, in four steps; every other moment runs the first
only; a `pending` row is one line and a pointer, and the close's recommender
follows Source to quote the item in full. "T0 and T1" and "T2" go; "The close"
and "Delegation to Hosa" take their place, and "Exit shoroku" ends at the form
check (spec 3.8). `templates/kanri.md` is in the same task because the ledger's
Shoroku candidates paragraph states the same Stage vocabulary and the same
four steps (7.3), and `templates/roster.md` because its Stage clause is the
other half of that vocabulary (7.5).

**Files:**

- Modify: `skills/tanto/roles/kanri.md`
- Modify: `skills/tanto/templates/kanri.md`
- Modify: `skills/tanto/templates/roster.md`

**Named mechanisms this task changes, and every other site that names them:**
the **`close:` line** is A2.1's string, written here in "Delegation to Hosa"
and in `roles/hosa.md` (task 8, P8.4); all three copies must agree byte for
byte, which check 24's fourth grep pins. The **`shoroku.recommend` and
`shoroku.apply` kinds** and their `subagent_type` spellings are named here
(steps 2 and 4, and "Delegation to Hosa"), in `roles/hosa.md`'s Models section
(task 8, P8.6) and, as kinds without the `subagent_type` spelling, in
`SKILL.md` (task 2) and `templates/tanto.json` (task 1). The **Stage
vocabulary** — `t2` on every ledger row, the exit word naming a file — is
stated here, in `templates/kanri.md` (P4.2), in `templates/roster.md` (P4.6),
in `SKILL.md` (task 2, P2.1) and in the Exit shoroku steps of this same
section; `roles/sekkei.md` and `roles/keikaku.md` each carry one sentence that
still calls the exit word a stage word — Open point 8. The **close's three
file names** `t2-recommendation.md`, `t2-brief.md` and `t2-direction.md` are
written here, in `SKILL.md` (task 2) and in `templates/kanri.md` (P4.4);
`templates/shoroku-brief.md`'s own `<stage>-` forms are retired in task 2
(P2.15, P2.18), Kanri's own ruling on Open point 4.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kanri.md skills/tanto/templates/kanri.md skills/tanto/templates/roster.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O4.1** `Between stages nothing is adopted` — `skills/tanto/roles/kanri.md` 1
→ 0 at P4.1. The section's own between-stages paragraph, which the principle
replaces: nothing is adopted **before the close**, and there are no stages to
be between.

**O4.2** `The session idles through one` — `skills/tanto/roles/kanri.md` 1 → 0
at P4.1. What an exiting session used to pay: one recommender run. It now
idles through nothing. The needle stops before the wrap, since the phrase
continues on the next line and a needle never spans one.

**O4.3** `once the recommendation over` — `skills/tanto/roles/kanri.md` 5 → 0
at P4.1 (one, in "Exit shoroku") and at P6.6, P6.7, P6.8 and P6.9 (four, the
Delete table's rows), in task 6. The condition for a delete request, which
becomes the form check.

**O4.4** `Every write-out, T2 included` — `skills/tanto/templates/kanri.md` 1 →
0 at P4.5.

There is **no needle for the Stage clause's list of exit words as example Stage
values**, which P4.2 retires. Every candidate is unusable: each of
`exit-jisso-B`, `exit-sekkei`, `exit-keikaku` and `exit-kaiseki-1` is written,
legitimately, by P2.1's own new text as a **file** name; the clause's
backtick-free runs are either generic or byte-identical in the new text; and a
needle may carry no backtick. **A4.2** is the instrument instead.

**O4.6** `an exit shoroku committed, or not run` — `skills/tanto/templates/kanri.md` 1 → 0 at P4.7. The Session events
placeholder's old event: a commit at an exit, which no longer happens.

There is **no needle for `a candidate with two stages`**, which P4.1 retires in
`roles/kanri.md` and which `templates/kanri.md` states in a paragraph no
section of the spec rewrites. The two files disagree after this task, and the
spec's Old values table does not list the string; that is Open point 5, not a
block written on this plan's own judgment.

- [ ] **Step 3: "Shoroku", replaced whole**

**P4.1** `skills/tanto/roles/kanri.md` — replace exactly these 185 lines

```text
## Shoroku

One flow at every stage — T0, T1, T2, and every exit — in four steps. The
stage word is `t0`, `t1`, `t2`, or `exit-<role>[-<suffix>]`. You rule on no
item: you dispatch the recommender, the human checks by exception, and a
subagent applies. The `S-n` table's Adopted column takes `pending`, `yes`, or
`no`.

Between stages nothing is adopted. A batch report's mandatory Shoroku
candidates section, a Kaiseki report's `blocks this task: no` items, and a
review report's candidates — the spec review's, the plan review's, and the
whole-branch review's — are copied into the ledger's `S-n` table at the
boundary with Adopted `pending` and Stage `t2`, the bookkeeping you already do
minus the ruling; T2's proposal, which Jisso seeds from that table, is where
they are recommended and checked.

### The four steps

1. **Candidates.** The session that holds them writes them, and only this step
   needs a resident context. T0: the input document — a Kikaku decision file,
   or a file of that kind. T1: the spec itself, whose four sections
   Requirements, The ADRs, Deferred items, and Shoroku candidates from this
   spec work are the candidates; nothing is copied. T2:
   `.tanto/<topic>/shoroku-proposal.md`, written by Jisso. An exit:
   `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`, or
   `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` for your own.
2. **Recommend.** Dispatch `subagent_type: tanto-shoroku` in the skill's
   recommend mode over the candidate file — for T1, over the spec with the four section names
   — with `docs/` as the baseline for destinations and reasons, and name the
   output:
   `.tanto/<topic>/<stage>-recommendation.md`, or
   `.tanto/t0-recommendation.md`, and your own exit at `.tanto/`. The file
   lists every item once in three groups — Recommended adopt, Recommended
   reject, Unsure — each item quoted in full from its source, so that the file
   stands alone as the apply's input, with its destination, its one-line
   reason, and for a `design` entry the `req-<id>` it serves; a requirement or
   an ADR item carries the original wording followed by a reference
   translation in the chat's language.
   Name in the same dispatch the brief path —
   `.tanto/<topic>/<stage>-brief.md`, or `.tanto/<stage>-brief.md` for T0 and
   your own exit — the template `templates/shoroku-brief.md` in the skill
   directory, and the chat's language; the recommender writes both files in
   one run.
   <!-- markdownlint-disable MD038 -->
3. **Check.** Check the brief's form, not its judgment, and never by reading
   the recommendation's prose: `grep -c '^## '` on the brief is `4` and the
   four headings are `## How to answer`, `## Recommended adopt`,
   `## Recommended reject`, `## Unsure`, in that order; every `### ` heading
   of the recommendation appears exactly once in the brief after `See: `, and
   the brief names no heading the recommendation lacks — count both with
   `grep '^### '` on the recommendation, each line stripped of its `### `
   marker, and `grep -cF 'See: <heading text>'` on the brief, one line per
   heading: the pointer is the heading's text, not the heading line. On a failure dispatch the recommender
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
   <!-- markdownlint-enable MD038 -->
4. **Apply.** Dispatch `subagent_type: tanto-shoroku` in apply mode with the
   recommendation, the direction, and the commit subject —
   `docs: T<n> shoroku for <topic>` or
   `docs: exit shoroku for <role>[ at <suffix>]` — in a slot of the commit
   window under the hotfix lane's rule. The subagent writes the accepted subset
   per `docs/AGENTS.md` and the per-type files, runs the repository's lint on
   the changed paths by name — or on the whole repository where the lint
   script takes no path arguments, which satisfies this step — commits once by
   explicit path with the trailer, and reports the subject. Verify that commit
   as you verify any — `git status` clean, the diff's paths those the
   direction names, lint on them (again, whole-repository if that is what the
   script does) — and fill the Written column.

Where the commit lands: on the topic's branch for T1, T2, and the exits of
that topic's sessions; on `main` for T0 and for your own between-plans exit. A
Sekkei exit of a topic whose branch does not exist yet waits — the direction is
written, and the apply is dispatched once Keikaku has cut the branch, so that
the topic's write-outs travel with the topic; hold the pending apply in the
ledger's Progress line.

The apply subagent is the writer at every stage. You write under `docs/` only
through the intake's filings and the hotfix lane, and you hand those to Hosa
when one is live.

A reference to an `S-n` or an `R-n` from outside its own ledger — the roster, a
handover file, another ledger — names the topic first, `<topic> S-n`; bare
numbers stay bare inside a ledger. The Written column takes only a value a
filter can read: `no`, a commit subject, or `superseded: <topic> R-n`, the last
counting as written; a candidate with two stages is split into two rows when
the second stage is identified, never written as a compound value.

### T0 and T1

Both are steps 2 to 4 over a document that already exists, so step 1 is not
yours at either.

- **T0**, before Sekkei is created — the decided items of the input document
  become ADRs, on `main`, before the branch is cut.
- **T1**, after the plan commit and before Jisso is created — requirements and
  issues from the spec, whose four section names the recommend dispatch
  carries. The spec's deferred items become issues one to one.

### T2

1. **Jisso proposes.** You send that line; Jisso writes the numbered list to
   `.tanto/<topic>/shoroku-proposal.md`, seeded from the `pending` rows of the
   `S-n` table and from its own context, and sends you one line.
2. **You recommend and check.** Steps 2 and 3 above, with the roster's
   Residency rows of this run appended to the direction file for the dogfood
   report's Measurements table — the readings the archive will hold, kept
   under `docs/reports/` (issue-40ed).
3. **The apply subagent writes.** Step 4 above. The human sees the result at
   the merge decision.

`shoroku-direction.md` no longer reaches Jisso: its T2 is the proposal only.

### Exit shoroku

Every planned exit of a session, in any role, carries its own shoroku, and the
session is deleted once the recommendation over its proposal is written: steps
3 and 4 run without it. `SKILL.md`'s "Session exit" defines the mechanism and
the file pattern `exit-<role>[-<suffix>]`; these are your steps.

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
2. Check the file's form, not its judgment: a direct read, since the
   proposal carries no headings for `sections` to select by, for the
   exclusion line it opens with and the numbered list under it. Then
   dispatch the recommender at once — step 2 above.
3. When the recommendation and its brief are on disk, read the brief's
   `## Unsure` group (`sections … Unsure`). A line there carrying a "could
   not be read as written" question is one question back to the session,
   one line,
   answered by a rewrite of the proposal. Otherwise ask the human, as a
   numbered list, to delete the session.
4. Steps 3 and 4 above then run with the session gone. Record the rows with
   Stage `exit-<role>[-<suffix>]` and fill their Written column from the
   apply's commit subject.

The human's check works on the recommendation's full quotation of each item,
which is what the session would have been asked about: its judgment was spent
writing the proposal, and the file holds it. The session idles through one
recommender run and no longer through the human's check and the apply, so what
another session pays for an exit is the proposal and one recommender run.

A session that has stopped answering is past answering, and you learn it the
way you learn of a missing batch report: the human says the session is gone, or
your window wakes for another reason and the answer has not arrived. Treat the
exit as forced, write a roster Events line saying its exit shoroku did not run
and what was lost as far as you know, ask the human to delete it, and continue.
The same Events line goes in whenever you mark a row `dead`.

**Your own exit.** Steps 1 to 4 with you writing the proposal and the human
checking, as at every stage: propose from the ledger and the roster rather than
from recollection to
`.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`, `<name>` being your own
bare name, then the recommender, the human's check, the direction beside it,
and the apply. Your exit has a recommendation and a direction file like every
other, and the rows' Stage is `exit-kanri-<YYYY-MM-DD>-<name>`. It is step 1 of
the Handover above, and the apply's commit is verified before the handover file
is written.

**Between plans** there is no ledger, so record candidates in the roster's
Shoroku candidates section instead, and move the rows whose Written column says
`no` into the new ledger's table when a topic opens.

Every apply, T2 included, writes only the accepted rows whose Written column
says `no`, so nothing is written twice.
```

**P4.1 →**

```text
## Shoroku

One stage per topic, the **close**, stage word `t2`, in four steps —
candidates, recommend, check, apply. Every other moment of the run runs the
first step only: a session's exit, a batch boundary, a review, a Kaiseki
report, the spec's acceptance, and the plan's landing each add `pending`
rows to the `S-n` table, and the close recommends and checks the whole
table at once. You rule on no item: you dispatch the recommender, the human
checks by exception, and a subagent applies. The `S-n` table's Adopted
column takes `pending`, `yes`, or `no`.

A `pending` row is one line and a pointer: Source names the file the
candidate lives in — a report and its item, a proposal and its number, the
spec and a section heading — and Candidate is the one-line rendering. The
close's recommender follows Source to quote the item in full; nothing is
copied into the ledger, and no session re-quotes another's candidates.

### The four steps

1. **Candidates.** The session that holds them writes them, and only this
   step needs a resident context. An exit:
   `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`, or
   `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` for your own. The
   close: `.tanto/<topic>/shoroku-proposal.md`, written by Jisso — the
   `pending` rows by number and what its own context holds that no file
   does. The spec's four sections — Requirements, The ADRs, Deferred items,
   and Shoroku candidates from this spec work — are four rows whose Source is
   the spec and the heading, recorded when the spec is accepted. A batch
   report's, a review report's, and a Kaiseki report's candidates are rows
   recorded at the boundary that reads the report. Check every proposal's
   form as "Exit shoroku" step 2 says; record its rows; then the delete
   request.
2. **Recommend.** At the close, dispatch `subagent_type: tanto-shoroku-recommend`
   in the skill's recommend mode over Jisso's proposal and every source the
   `pending` rows name — the spec with its four section names, each proposal
   by path, each report by path and item — with `docs/` as the baseline, and
   name the output: `.tanto/<topic>/t2-recommendation.md`, or
   `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-recommendation.md` for your own
   between-plans exit. The file lists every item once in three groups —
   Recommended adopt, Recommended reject, Unsure — each item quoted in full
   from its source, so that the file stands alone as the apply's input, with
   its destination, its one-line reason, and for a `design` entry the
   `req-<id>` it serves; a requirement or an ADR item carries the original
   wording followed by a reference translation in the chat's language. Name
   in the same dispatch the brief path — `.tanto/<topic>/t2-brief.md`, or
   `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-brief.md` — the template
   `templates/shoroku-brief.md` in the skill directory, and the chat's
   language; the recommender writes both files in one run.
   <!-- markdownlint-disable MD038 -->
3. **Check.** Check the brief's form, not its judgment, and never by reading
   the recommendation's prose: `grep -c '^## '` on the brief is `4` and the
   four headings are `## How to answer`, `## Recommended adopt`,
   `## Recommended reject`, `## Unsure`, in that order; every `### ` heading
   of the recommendation appears exactly once in the brief after `See: `, and
   the brief names no heading the recommendation lacks — count both with
   `grep '^### '` on the recommendation, each line stripped of its `### `
   marker, and `grep -cF 'See: <heading text>'` on the brief, one line per
   heading: the pointer is the heading's text, not the heading line. On a failure dispatch the recommender
   once more, naming what failed; on a second failure paste the brief as it
   stands and tell the human in one line what is wrong with it. Then give the
   human, in one message: the recommendation's path, the brief's path, the
   three counts, and the brief's text verbatim below them. The human answers
   as the `shoroku` skill already parses — `OK` for "as recommended", or the
   numbers that go the other way, or an edit — in your window, or through a
   Kikaku decision file whose "What Kanri should do with it" section names
   this recommendation and answers it by exception: that file is the answer,
   read whole, its item numbers the recommendation's, everything it does not
   list as recommended, every override with its reason, and you need no word
   in your own window. Write `t2-direction.md` beside the recommendation
   (`exit-kanri-<YYYY-MM-DD>-<name>-direction.md` for your own between-plans
   exit), item by item, with the `S-n` rows in the ledger: Adopted from the
   answer. No item is escalated apart from the rest and none is decided by
   you alone; the human sees the whole list, grouped, and answers by
   exception.
   <!-- markdownlint-enable MD038 -->
4. **Apply.** Dispatch `subagent_type: tanto-shoroku-apply` in apply mode with
   the recommendation, the direction, and the commit subject —
   `docs: T2 shoroku for <topic>`, or `docs: exit shoroku for kanri` for your
   own between-plans exit — in slot (a) of the commit window. The subagent
   writes the accepted subset per `docs/AGENTS.md` and the per-type files,
   runs the repository's lint on the changed paths by name — or on the whole
   repository where the lint script takes no path arguments, which satisfies
   this step — commits once by explicit path with the trailer, and reports
   the subject. Verify that commit as you verify any — `git status` clean,
   the diff's paths those the direction names, lint on them (again,
   whole-repository if that is what the script does) — and fill the Written
   column.

Where the commit lands: on the topic's branch for the close, before the
merge decision; on `main` for your own between-plans exit, the only stage
that lands there.

The apply subagent is the writer at the close. You write under `docs/` only
through the intake's filings and the hotfix lane, and you hand those to Hosa
when one is live.

A reference to an `S-n` or an `R-n` from outside its own ledger — the roster, a
handover file, another ledger — names the topic first, `<topic> S-n`; bare
numbers stay bare inside a ledger. The Written column takes only a value a
filter can read: `no`, a commit subject, or `superseded: <topic> R-n`, the last
counting as written; a candidate two closes could claim is one row in the
ledger of the topic that raised it, never a compound value.

### The close

1. **Jisso proposes.** You send the `T2:` line; Jisso writes the numbered list
   to `.tanto/<topic>/shoroku-proposal.md` — the `pending` rows of the `S-n`
   table listed by number, and what its own context holds that no file does
   — and sends you one line. Check the file's form as "Exit shoroku" step 2
   says, and ask the human to delete Jisso: the close is its exit, and it
   idles through nothing.
2. **Recommend and check.** Steps 2 and 3 above — a live Hosa's, by
   "Delegation to Hosa" below, or yours — with the roster's Residency rows
   of this run appended to the direction file for the dogfood report's
   Measurements table — the readings the archive will hold, kept under
   `docs/reports/` (issue-40ed); when Hosa holds the close, you append them
   to the direction file after its `close done:`, before the successor or
   you fill the ledger.
3. **The apply subagent writes.** Step 4 above, on this branch. The human
   sees the result at the merge decision.

### Delegation to Hosa

When the roster has a `live` Hosa row at a close, or at your own
between-plans exit, steps 2 to 4 are Hosa's. After step 1 send Hosa one
line, without an idle subscription:
`close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`.
`<topic>` is the topic word, or `kanri` for your own exit, and the paths
are the close's three files under `.tanto/<topic>/` or your exit's three
under `.tanto/`; the slot is `now` because no batch is in flight at a close
and Jisso is deleted. Hosa reads the ledger's `pending` rows for the
sources the recommend dispatch names, dispatches the recommender and then
the apply on their own kinds, form-checks and pastes the brief in its own
window, and writes the direction from the human's answer there; a Kikaku
decision file that answers the check reaches Hosa as `decision: <path>`,
one line from you. Hosa answers `close done: <commit subject> — <reading>`,
or `close blocked: <one line>` when a form check fails twice or the answer
does not arrive. On `close done:` verify the commit as you verify any —
`git status` clean, the diff's paths those the direction names, lint on
them — and fill Adopted from the direction file and Written from the
subject. You wait for none of it: a close delegated is carried in the
handover file's In flight block, and the successor verifies. With no Hosa
live, run the three steps yourself, and add to your close line the
suggestion to open one (`/tanto hosa`), in the shape of the between-plans
Kikaku suggestion.

**A topic the human ends before its final batch** — the plan not wanted,
the branch abandoned — still gets its close, over what is on disk: write
the proposal yourself, in Jisso's absence, as you write your own — the
`pending` rows by number and what the ledger's Session events and Rulings
hold that no row does — and run steps 2 to 4; the apply lands on the
topic's branch, and the merge decision says whether that branch lands.

### Exit shoroku

Every planned exit of a session, in any role, carries its own shoroku, and
the session is deleted once its proposal is on disk and form-checked: its
items are recommended and checked at the close, with the session gone.
`SKILL.md`'s "Session exit" defines the mechanism and the file pattern
`exit-<role>[-<suffix>]`; these are your steps.

1. At the boundary where the exit falls, send that session
   `exit: propose your shoroku; write it to <path>`, without an idle
   subscription, as with every other line you send. The path is
   `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`. The session writes it,
   runs its resume self-check, and answers
   `exit proposal: <path> — <reading>`. **Two roles are the exception, at one
   boundary each**: a Sekkei at its own final boundary names its proposal in
   its `spec accepted:` line, and a Keikaku at its own names it in its
   `coldread answered:` line, both unasked and both without being sent
   anything — for those two, skip this step and go to step 2. Every other
   exit takes the line, this pair included whenever the exit falls elsewhere:
   a compaction in the reading (decision-6dea), a replacement from the
   Replace table, or the human not wanting the plan now.
2. Check the file's form, not its judgment: a direct read, since the
   proposal carries no headings for `sections` to select by, for the
   exclusion line it opens with and the numbered list under it. A file that
   fails the form is one line back to the session, answered by a rewrite;
   a file that passes is recorded — one `pending` row per item, Source the
   proposal's path and the item's number, Stage `t2`, since the close is
   what recommends it — and you ask the human, as a numbered list, to delete
   the session at once.
   No recommender runs here.
3. The rows wait for the close, where steps 2 to 4 of "The four steps" run
   over them with everything else; fill their Written column from the
   close's commit subject.

The session's judgment was spent writing the proposal, and the file holds
it: the close's recommender quotes every item in full from that file, which
is what the human checks. What another session pays for an exit is the
proposal.

A session that has stopped answering is past answering, and you learn it the
way you learn of a missing batch report: the human says the session is gone, or
your window wakes for another reason and the answer has not arrived. Treat the
exit as forced, write a roster Events line saying its exit shoroku did not run
and what was lost as far as you know, ask the human to delete it, and continue.
The same Events line goes in whenever you mark a row `dead`.

**Your own exit.** Propose from the ledger and the roster rather than from
recollection, to `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`,
`<name>` being your own bare name. While any ledger is open, the proposal's
items are `pending` rows, Stage `t2`, in the ledger of the topic whose
batches are in flight, else the oldest open topic's, and the handover file
names the ledger; nothing else runs, and the rows wait for that topic's
close. Between plans, with no ledger open, steps 2 to 4 of "The four steps"
run over your proposal alone — a live Hosa's by "Delegation to Hosa", with
the successor verifying, or yours with the commit verified before the
handover file is written — and the apply's commit lands on `main`; the rows
are the roster's, Stage `exit-kanri-<YYYY-MM-DD>-<name>`. Either way this
is step 1 of the Handover above.

**Between plans** there is no ledger, so record candidates that reach you
then — a Kikaku decision file belonging to no topic, a triage's observation
— in the roster's Shoroku candidates section instead, and move the rows
whose Written column says `no` into the new ledger's table, with Stage
`t2`, when a topic opens.

The close writes only the accepted rows whose Written column says `no`, so
nothing is written twice.
```

- [ ] **Step 4: The ledger template's Source and Stage columns**

**P4.2** `skills/tanto/templates/kanri.md` — replace exactly these 4 lines

```text
issues, notes, or reports; Adopted, one of `pending`, `yes`, and `no`; Stage,
the stage word — `t0`, `t1`, `t2`, or `exit-<role>[-<suffix>]`, as in
`exit-jisso-B`, `exit-sekkei`, `exit-keikaku`, `exit-kaiseki-1`, and
`exit-kanri-<YYYY-MM-DD>-<name>`; Written, `no` or the subject of the commit
```

**P4.2 →**

```text
issues, notes, or reports; Adopted, one of `pending`, `yes`, and `no`; Stage,
the stage word — `t2` for every row of this table, whichever moment raised
it, since the close is the one stage that recommends a ledger's rows, and
`exit-<role>[-<suffix>]` names a proposal file, never a Stage value; Written,
`no` or the subject of the commit
```

**P4.3** `skills/tanto/templates/kanri.md` — replace exactly this 1 line

```text
Columns: S-n, the row id; Source, the report or session that raised it;
```

**P4.3 →**

```text
Columns: S-n, the row id; Source, the file the candidate lives in and its place there — a report and its item, a proposal and its number, the spec and a section heading — so that the close's recommender can follow it;
```

- [ ] **Step 5: The ledger template's two paragraphs**

**P4.4** `skills/tanto/templates/kanri.md` — replace exactly these 13 lines

```text
Nothing is adopted here by a ruling. A candidate copied in at a boundary —
from a batch report's Shoroku candidates, a Kaiseki report's
`blocks this task: no` items, or a review report — arrives with Adopted
`pending` and Stage `t2`, and stays `pending` until the stage that recommends
it. At every stage Kanri dispatches the `shoroku` kind to write
`<stage>-recommendation.md`, which lists every item once in three groups —
Recommended adopt, Recommended reject, Unsure; tells the human that path, the
three counts, and the items themselves as a numbered list in the chat's
language; and writes `<stage>-direction.md` from the human's answer,
and these rows with it, Adopted `yes` or `no` as the direction says and Stage
the stage word. No item is put to the human apart from the rest and none is
settled by Kanri alone: the human sees the whole list, grouped, and answers by
exception.
```

**P4.4 →**

```text
Nothing is adopted here by a ruling. Every row arrives `pending` — from a
batch report's Shoroku candidates, a Kaiseki report's
`blocks this task: no` items, a review report, a session's exit proposal,
the spec's four sections, or a Kanri exit that fell while this ledger was
open — and stays `pending` until the close. At the close Kanri dispatches
the `shoroku.recommend` kind over Jisso's proposal and every source these
rows name, to write `t2-recommendation.md` and `t2-brief.md`; gives the
human both paths, the three counts, and the brief verbatim; and writes
`t2-direction.md` from the human's answer, and these rows with it, Adopted
`yes` or `no` as the direction says. No item is put to the human apart from
the rest and none is settled by Kanri alone: the human sees the whole list,
grouped, once, and answers by exception.
```

**P4.5** `skills/tanto/templates/kanri.md` — replace exactly these 3 lines

```text
Every write-out, T2 included, writes only the adopted rows whose Written column
says `no`, and fills that column with the commit subject. So nothing is written
twice, and T2 keeps everything adopted but not yet written.
```

**P4.5 →**

```text
The close writes only the adopted rows whose Written column says `no`, and
fills that column with the commit subject; a row a Kanri exit recorded here is
written by this topic's close like any other. So nothing is written twice.
```

- [ ] **Step 6: The roster template's Stage clause**

**P4.6** `skills/tanto/templates/roster.md` — replace exactly these 2 lines

```text
or reports; Adopted one of `pending`, `yes`, and `no`; Stage the stage word —
`t0`, `t1`, `t2`, or `exit-<role>[-<suffix>]`; and Written `no` or the subject
```

**P4.6 →**

```text
or reports; Adopted one of `pending`, `yes`, and `no`; Stage the stage word —
`exit-kanri-<YYYY-MM-DD>-<name>` for a row a between-plans Kanri exit
recommends, and `t2` once a row moves into a ledger; and Written `no` or the subject
```

- [ ] **Step 7: The ledger template's Session events placeholder**

**P4.7** `skills/tanto/templates/kanri.md` — replace exactly these 2 lines

```text
  a bug report triaged and its outcome; an exit shoroku committed, or not run
  and what was lost; a human access grant and the human-access: done line that
```

**P4.7 →**

```text
  a bug report triaged and its outcome; an exit proposal form-checked and its
  rows recorded, or an exit shoroku not run and what was lost; a human access
  grant and the human-access: done line that
```

The Progress placeholder is unchanged (spec 7.3).

- [ ] **Step 8: The ledger template's Written-column sentence**

`roles/kanri.md`'s own copy of this sentence is P4.1's — the close
consolidates every topic's shoroku to one stage, so "a candidate with two
stages" is no longer a case the template's own reader needs to picture; the
close's own case (raised at one topic's close but adopted only once
another candidate resolves an ambiguity) is a single row in the ledger of
the topic that raised it, per Open point 5 of the plan-dryrun.

**P4.8** `skills/tanto/templates/kanri.md` — replace exactly these 2 lines

```text
counting as written; a candidate with two stages is split into two rows when
the second stage is identified, never written as a compound value.
```

**P4.8 →**

```text
counting as written; a candidate two closes could claim is one row in the
ledger of the topic that raised it, never a compound value.
```

- [ ] **Step 9: The anchor for this task**

**A4.1** `skills/tanto/templates/roster.md` — `grep -c 'a row a between-plans Kanri exit' skills/tanto/templates/roster.md` — before: 0, after: 1

**A4.2** `skills/tanto/templates/kanri.md` — `grep -c 'for every row of this table' skills/tanto/templates/kanri.md` — before: 0, after: 1

- [ ] **Step 10: The two `subagent_type` spellings, and the one `close:` line**

```bash
grep -c 'subagent_type: tanto-shoroku-recommend' skills/tanto/roles/kanri.md
grep -c 'subagent_type: tanto-shoroku-apply' skills/tanto/roles/kanri.md
grep -cE 'tanto-shoroku([^-.]|$)' skills/tanto/roles/kanri.md
grep -cF 'close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' skills/tanto/roles/kanri.md
```

Expected: `1`, then `1`, then `1`, then `1` — **not** check 24's final values
yet. This task's own P4.1 writes the first `subagent_type: tanto-shoroku-apply`
(step 4 of "The four steps"); the bare `subagent_type: tanto-shoroku` that the
third grep still counts, and the second `-apply` copy, are both Task 5's
P5.7 (loop step 7 (a)), which has not landed here. Task 5's own Step 6 runs
this same set of four greps again once P5.7 lands, expecting `1`, `2`, `0`,
`1`; task 10 installs the check permanently and runs it over the whole set.

- [ ] **Step 11: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md skills/tanto/templates/kanri.md skills/tanto/templates/roster.md
```

Expected: exit 0, none `Failed`. `markdownlint-cli2` ignores
`skills/tanto/templates/**`, so only the role file is linted as Markdown here.

- [ ] **Step 12: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md skills/tanto/templates/kanri.md skills/tanto/templates/roster.md -m "docs(tanto): Kanri's Shoroku section is one stage per topic, and Hosa may hold it" -m "The section is replaced whole: four steps at the close, the first step alone at every other moment, an S-n row as a pointer its recommender follows, the two kinds by subagent_type, the close's three t2 file names, Delegation to Hosa with the close: line, a topic ended early, and an Exit shoroku that ends at the form check. The ledger template's Source and Stage columns, its two paragraphs, its Written-column sentence and its Session events placeholder follow, and the roster's Stage clause with them. Spec 3.8, 7.3, 7.5." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 13: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 14: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-shoroku-at-close.md --task 4
```

Expected: `task 4: verify clean`.

**Done when:** the eight passages are present, A4.1 and A4.2 return `1`, step 10
prints `1`, `1`, `1`, `1` (not check 24's final `1`, `2`, `0`, `1`, which
Task 5's own P5.7 is what makes true), the needles of O4.1 to O4.4 and O4.6
return `0` in the files this task touches, lint is clean, and the commit
carries its trailer.

---

### Task 5: Kanri's Start, the decision file's four handlings, the plan's landing, the loop, the final batch, and the Kaiseki branch

**Batch:** B. **Blocks:** O5.1 to O5.11, P5.1 to P5.12.

Everything in `roles/kanri.md` outside "Shoroku" and the Handover. T0 goes from
Start step 6 and from the root listing's known entries; a decision file's
handlings become four, the fourth being a stage's Check answer; "When the plan
lands" records the spec's four sections as rows instead of running T1; the
batch loop's step 3 stops saying "between stages", its step 6 runs only the
proposal half of an exit, its step 7 (a) is the close's slot alone and names
`tanto-shoroku-apply`, and its last sentence stops claiming a commit that no
longer happens at a handover; "The final batch" step 3 is the close; and the
Kaiseki branch's two sentences follow (spec 3.1 to 3.6, 3.12).

**Files:**

- Modify: `skills/tanto/roles/kanri.md`

**Named mechanisms this task changes, and every other site that names them:**
the **slot letters** of step 7's commit window are named in step 7 itself (a),
(b) and (c), in "The handover, in a plan and between plans" (task 6, P6.3), in
"The hotfix lane", and in "Shoroku" step 4 (task 4, P4.1, which says slot (a)).
Slot (a) changes meaning here — it is the **close's** slot and is empty at
every other boundary — and the hotfix lane's slot (b) is right as it stands and
is unchanged. The **four handlings of a decision file** are stated here (P5.3),
in `roles/kikaku.md` (task 8, P8.2) and in `templates/kikaku-decision.md` (task
8, P8.3); all three must say four. The **`T2:` line** Kanri sends Jisso is
written here (P5.9), in "The close" step 1 (task 4, P4.1) and in
`roles/jisso.md` (task 8, P8.1).

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kanri.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O5.1** `t0-*` — `skills/tanto/roles/kanri.md` 1 → 0 at P5.1. The root
listing's known-entry set, as `tanto-sweep-2`'s own sweep left it. A `t0-*`
file left by a run before this design is then reported like any other unknown
entry, once, and the human says whether to keep it.

**O5.2** `Do the T0 write-out` — `skills/tanto/roles/kanri.md` 1 → 0 at P5.2.

**O5.3** `handling is one of three` — `skills/tanto/roles/kanri.md` 1 → 0 at
P5.3; `skills/tanto/roles/kikaku.md` 1 → 0 at P8.2, in task 8. The bare phrase
`one of three` has two legitimate survivors in this file — the hotfix lane's
three paths and the contract's three ways an address reaches a role — which is
why the needle carries the word before it.

**O5.4** `Run T1` — `skills/tanto/roles/kanri.md` 1 → 0 at P5.4.

**O5.5** `between stages, and the recommendation` — `skills/tanto/roles/kanri.md`
1 → 0 at P5.5. The batch loop's bookkeeping sentence, which wraps in the file,
so the needle is the line's own head.

**O5.6** `dispatch its` — `skills/tanto/roles/kanri.md` 1 → 0 at P5.6. Step 6's
recommender dispatch at an exit; the sentence wraps after these two words,
which is exactly where it stops being true.

**O5.7** `The session whose shoroku it is has already` — `skills/tanto/roles/kanri.md` 1 → 0 at P5.7. Step 7 (a)'s account of who is
waiting; at the close it is Jisso, by name.

**O5.8** `shoroku was step 6's proposal and slot` — `skills/tanto/roles/kanri.md`
1 → 0 at P5.8. The loop's closing claim that a handover's exit shoroku was
already applied. The needle starts mid-word-boundary because the sentence wraps
after `your exit`.

**O5.9** `run T2: the four steps` — `skills/tanto/roles/kanri.md` 1 → 0 at
P5.9.

**O5.10** `and T2's proposal is where it` — `skills/tanto/roles/kanri.md` 1 → 0
at P5.10.

**O5.11** `then the recommendation, then the deletion` — `skills/tanto/roles/kanri.md` 1 → 0 at P5.11.

The needle for `subagent_type: tanto-shoroku`, which P5.7 retires, **cannot be
written as an `O` block**: every literal form of it is a prefix of
`subagent_type: tanto-shoroku-apply`, which this plan's own new text writes, and
`lint` refuses a needle that occurs in a new-passage block. It is a regular
expression instead — `grep -cE 'tanto-shoroku([^-.]|$)'` — first run in task 4
step 10 (where it still returns `1`, since P5.7 has not landed), again below
in this task's own Step 6 once P5.7 lands (where it returns `0`), in task 10,
and permanently as check 24's third grep.

- [ ] **Step 3: Start — the root listing and the T0 write-out**

**P5.1** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
   predecessors' `t0-*` and `exit-kanri-*` files; the human decides what to do
```

**P5.1 →**

```text
   predecessors' `exit-kanri-*` files; the human decides what to do
```

**P5.2** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
6. Do the T0 write-out if an input document with decided items exists (see
   "Shoroku"). Then wait for the human and for handshakes. When no next work
```

**P5.2 →**

```text
6. Wait for the human and for handshakes. An input document with decided
   items — a Kikaku decision file — is named in Sekkei's orders line for
   Sekkei to read directly, and its decided items reach `docs/` at the
   topic's close with everything else (see "Shoroku"); nothing is written
   out before Sekkei exists. When no next work
```

- [ ] **Step 4: A decision file's four handlings**

**P5.3** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
file, and your handling is one of three: a topic in its spec stage takes it as
the next `I-n` in that topic's `spec-inputs.md`; between plans it is a T0
input document; otherwise it is a source row in the `S-n` table. Note
```

**P5.3 →**

```text
file, and your handling is one of four: a topic in its spec stage takes it as
the next `I-n` in that topic's `spec-inputs.md`; between plans it is the
next topic's input document, named in its Sekkei's orders line; a file
whose "What Kanri should do with it" section names a stage's recommendation
and answers it by exception is that stage's Check answer, read whole (the
Check step of "Shoroku"); otherwise it is a source row in the `S-n` table. Note
```

- [ ] **Step 5: When the plan lands — four rows, not a stage**

**P5.4** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
3. Run T1: the four steps of "Shoroku" below, whose candidates are the spec's
   own four sections — Requirements, The ADRs, Deferred items, and Shoroku
   candidates from this spec work. Nothing is copied; the recommender reads
   those four sections of the spec by name.
```

**P5.4 →**

```text
3. Record the spec's own four sections — Requirements, The ADRs, Deferred
   items, and Shoroku candidates from this spec work — as four `pending`
   rows of the `S-n` table, Source the spec's path and the section's
   heading, Stage `t2`, if the spec's acceptance did not already (Sekkei's
   Delete row). Nothing is copied and nothing is recommended: the close's
   recommender reads those four sections of the spec by name, and Keikaku's
   exit proposal, named in the `coldread answered:` line, is form-checked
   and recorded the same way ("Exit shoroku", step 2).
```

Step 4, `Ask the human to create Jisso`, stays; nothing gates it but the plan.

- [ ] **Step 6: The batch loop's three sites**

**P5.5** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
   between stages, and the recommendation and the human's check at T2 rule on
```

**P5.5 →**

```text
   before the close, and the recommendation and the human's check at T2 rule on
```

**P5.6** `skills/tanto/roles/kanri.md` — replace exactly these 9 lines

```text
   is due, or a handover trigger has fired and is not deferred, run the
   proposal half of "Exit
   shoroku" now: send the `exit:` lines to the sessions whose proposal is not
   already named — a Sekkei or Keikaku at its own final boundary named it in
   its report line and is waiting for nothing — check each proposal and
   dispatch its
   recommender, and write the direction once the human has answered. A delete
   request goes out as soon as that session's recommendation and brief are on
   disk ("Exit shoroku", step 3); the apply waits for step 7.
```

**P5.6 →**

```text
   is due, or a handover trigger has fired and is not deferred, run "Exit
   shoroku" now: send the `exit:` lines to the sessions whose proposal is not
   already named — a Sekkei or Keikaku at its own final boundary named it in
   its report line and is waiting for nothing — check each proposal's form
   and record its items as `pending` rows. A delete request goes out as soon
   as that session's proposal passes the form check ("Exit shoroku", step
   2); nothing is recommended or applied before the close.
```

**P5.7** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```text
7. **The commit window.** One committer at a time, in this order, Jisso idle
   throughout. (a) The apply subagent's slot: for each stage whose direction
   is written, dispatch `subagent_type: tanto-shoroku` in apply mode with the
   recommendation, the direction, and the commit subject, and verify its
   commit as you verify any — `git status` clean, the diff's paths those the
   direction names, lint on them (or on the whole repository where the lint
   script takes no path arguments). The session whose shoroku it is has already
   been deleted; it waits for nothing. (b) Your
```

**P5.7 →**

```text
7. **The commit window.** One committer at a time, in this order, Jisso idle
   throughout. (a) The apply subagent's slot, which only the close fills: at
   the final batch's boundary, once `t2-direction.md` is written, dispatch
   `subagent_type: tanto-shoroku-apply` with the recommendation, the
   direction, and the commit subject, and verify its commit as you verify any
   — `git status` clean, the diff's paths those the direction names, lint on
   them (or on the whole repository where the lint script takes no path
   arguments). Jisso has already been deleted; it waits for nothing. At every
   other boundary this slot is empty. (b) Your
```

**P5.8** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
   steps 2 to 4 of "The handover, in a plan and between plans" — your exit
   shoroku was step 6's proposal and slot (a)'s commit — and the loop stops
   here; the next prompt is the successor's.
```

**P5.8 →**

```text
   steps 2 to 4 of "The handover, in a plan and between plans" — your exit
   proposal was step 6's, and its items are `pending` rows in this ledger —
   and the loop stops here; the next prompt is the successor's.
```

**Now that P5.7 has landed, check 24's four greps reach their final values**
(the same four Task 4's step 10 ran early, at `1`, `1`, `1`, `1`):

```bash
grep -c 'subagent_type: tanto-shoroku-recommend' skills/tanto/roles/kanri.md
grep -c 'subagent_type: tanto-shoroku-apply' skills/tanto/roles/kanri.md
grep -cE 'tanto-shoroku([^-.]|$)' skills/tanto/roles/kanri.md
grep -cF 'close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' skills/tanto/roles/kanri.md
```

Expected: `1`, then `2`, then `0`, then `1`. The second `-apply` copy and the
retirement of the bare `subagent_type: tanto-shoroku` are both P5.7's; the
first `-apply` copy and the `close:` line are unchanged from Task 4. Task 10
installs this same set of four greps permanently, as check 24's first through
fourth.

- [ ] **Step 7: The final batch runs the close**

**P5.9** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```text
3. When the final batch is accepted, run T2: the four steps of "Shoroku"
   below, whose first step is Jisso's. Send it one line —
   `T2: propose the shoroku write-out; write it to .tanto/<topic>/shoroku-proposal.md`
   — and the recommendation, the human's check, and the apply follow as at
   every other stage. Then put the merge
   decision to the human.
```

**P5.9 →**

```text
3. When the final batch is accepted, run the close: the four steps of
   "Shoroku" below, whose first step is Jisso's. Send it one line —
   `T2: propose the shoroku write-out; write it to .tanto/<topic>/shoroku-proposal.md`
   — check the proposal's form and ask the human to delete Jisso; then the
   one recommendation over the proposal and every source the `pending` rows
   name, the human's check on the brief, the direction, and the apply on
   this branch, in that order and with Jisso gone — a live Hosa's three
   steps, by the `close:` line "Delegation to Hosa" gives, or yours. Then
   put the merge decision to the human, once the commit is verified.
```

- [ ] **Step 8: The Kaiseki branch's two sentences**

**P5.10** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
   here, and T2's proposal is where it is recommended and checked.
```

**P5.10 →**

```text
   here, and the close is where it is recommended and checked.
```

**P5.11** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
   is open, run Kaiseki's exit as "Exit shoroku" below prescribes — its
   proposal, then the recommendation, then the deletion request — or keep it if
   more of the same bug is expected. Not before: a fix that misses goes back to
```

**P5.11 →**

```text
   is open, run Kaiseki's exit as "Exit shoroku" below prescribes — its
   proposal, its form check, then the deletion request — or keep it if
   more of the same bug is expected. Not before: a fix that misses goes back to
```

- [ ] **Step 9: The opening paragraph's own "at every stage"**

**P5.12** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
the write-out itself is the apply subagent's work, at every stage.
```

**P5.12 →**

```text
the write-out itself is the apply subagent's work, at the topic's close.
```

This line is a hit of O2.7 in a paragraph no section of the spec names. The
spec's Old values table says of `at every stage` that "the plan reads each
hit"; this hit means the stages of the write-out, and this is the reading.

- [ ] **Step 10: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: exit 0, none `Failed`.

- [ ] **Step 11: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md -m "docs(tanto): Kanri's Start, loop, final batch and Kaiseki branch under one close" -m "No T0 write-out and no t0-* in the root listing; a decision file has four handlings, the fourth a stage's Check answer; the plan's landing records the spec's four sections as pending rows instead of running T1; the loop's step 6 runs only the proposal half of an exit, step 7 (a) is the close's slot alone and dispatches tanto-shoroku-apply, and its last sentence claims no commit; the final batch runs the close; the Kaiseki branch points at it. Spec 3.1-3.6, 3.12." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 12: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 13: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-shoroku-at-close.md --task 5
```

Expected: `task 5: verify clean`.

**Done when:** the twelve passages are present, the needles of O5.1 to O5.11
return `0` in `skills/tanto/roles/kanri.md`, check 24's four greps (Step 6's
own check, after P5.7) print `1`, `2`, `0`, `1`, "The hotfix lane" still says
slot (b), lint is clean, and the commit carries its trailer.

---

### Task 6: the Handover, the handover file, and the Delete table

**Batch:** B. **Blocks:** A6.1, O6.1 to O6.6, P6.1 to P6.10.

Kanri's own exit is the last thing in the role file that still ran a stage of
its own. While any ledger is open it writes its proposal and records `pending`
rows in **one** ledger — the topic whose batches are in flight, else the oldest
open topic's — and hands over; between plans, with no ledger, the four steps run
and the apply lands on `main`, with steps 2 to 4 a live Hosa's by the same
`close:` line (spec 3.7). The handover file names the ledger that holds the rows
and, when a close is delegated, what Hosa is holding (7.4). The Delete table's
four seat rows stop waiting for a recommendation, and the plan-closed row keys
on the merge decision instead of on Jisso's deletion, because Jisso now goes
before the close's last three steps and the human's check between them has no
bounded latency (3.9).

**Files:**

- Modify: `skills/tanto/roles/kanri.md`
- Modify: `skills/tanto/templates/kanri-handover.md`

**Named mechanisms this task changes, and every other site that names them:**
the **delegated close** is named in the handover file's In flight block (P6.5),
in "Delegation to Hosa" (task 4, P4.1), in `SKILL.md`'s "Session exit" (task 2,
P2.1) and in `roles/hosa.md` (task 8, P8.4); the handover template's Live peers
sentence is unchanged, and a Hosa holding a delegated close is listed there
with that as what it is waiting for. **Slot (a)** is named in step 7 (task 5,
P5.7), in "Shoroku" step 4 (task 4) and in P6.3 here. The **Replace table's
five rows** that say `run "Exit shoroku" first if the session is alive and
coherent` are unchanged: "Exit shoroku" is still the section, and its steps now
end at the form check (spec 3.10). "Recovery"'s sentence about a gone session's
row is unchanged: the proposal is what "ran" means (3.11).

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kanri.md skills/tanto/templates/kanri-handover.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O6.1** `a T0 shoroku, a bug-report triage` — `skills/tanto/roles/kanri.md` 1 →
0 at P6.1. The list of what grows Kanri's context between plans. The spec calls
this site "Timing"; on this tree the line sits in "The trigger", one subsection
above, and the line itself is what the passage resolves on.

**O6.2** `first act for it is the recommender` — `skills/tanto/roles/kanri.md` 1
→ 0 at P6.2. The handover file's Live peers sentence, as `tanto-sweep-2` leaves
it.

**O6.3** `dispatch the recommender, put the recommendation to the human` — `skills/tanto/roles/kanri.md` 1 → 0 at P6.3. Handover step 1's old shape: a
whole stage inside the outgoing session's tenure.

**O6.4** `A shoroku candidate the outgoing Kanri could not classify` — `skills/tanto/templates/kanri-handover.md` 1 → 0 at P6.4.

**O6.5** `T2's proposal is written, leftovers are clean` — `skills/tanto/roles/kanri.md` 1 → 0 at P6.9. Jisso's Delete row's When column.

**O6.6** `Jisso is deleted and the ledger's Progress line says closed` — `skills/tanto/roles/kanri.md` 1 → 0 at P6.10. The plan-closed row's When
column, which Jisso's earlier deletion makes wrong.

O4.3 (`once the recommendation over`), declared in task 4, loses its four
remaining hits here, at P6.6 to P6.9.

- [ ] **Step 3: What grows a between-plans Kanri's context**

**P6.1** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
there — a T0 shoroku, a bug-report triage, the handshakes, a resume — with no
```

**P6.1 →**

```text
there — a bug-report triage, the handshakes, a resume — with no
```

- [ ] **Step 4: The handover file's Live peers sentence**

**P6.2** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
or Keikaku whose last line named an exit proposal is waiting for nothing but
its deletion, and your successor's first act for it is the recommender
dispatch, if the recommendation is not already on disk.
```

**P6.2 →**

```text
or Keikaku whose last line named an exit proposal is waiting for nothing but
its deletion, and your successor's first act for it is the delete request,
if the proposal's form check is recorded in the ledger and the request was
not sent.
```

- [ ] **Step 5: Handover step 1, replaced whole**

**P6.3** `skills/tanto/roles/kanri.md` — replace exactly these 15 lines

```text
1. **Exit shoroku first** — the Kanri case under "Exit shoroku": write your own
   proposal from the ledger and the roster rather than from recollection,
   dispatch the recommender, put the recommendation to the human, write the
   direction and the `S-n` rows, and dispatch the apply, which commits and
   reports its subject. What you cannot reconstruct goes into the handover
   file's "Not reconstructed" section. Verify that commit **before** the
   handover file is written, so that the successor inherits a commit and not a
   pending write-out. At a **batch boundary** this step is loop step 6's
   proposal and recommendation and step 7's slot (a) apply, already done when
   the window reaches this list. At a **plan close** it is a fresh act, run
   after T2, the merge decision, the peers' deletion and the archive move, and
   its commit lands where the tree is once the merge decision is executed — on
   `main` after a merge, on the plan's branch only when the human declined the
   merge (decision-b6cb). **Between plans** it is one act too, and the commit
   lands on `main`.
```

**P6.3 →**

```text
1. **Exit shoroku first** — the Kanri case under "Exit shoroku": write your
   own proposal from the ledger and the roster rather than from recollection,
   to `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`. What you cannot
   reconstruct goes into the handover file's "Not reconstructed" section.
   Then one of two. **While any ledger is open** — at a batch boundary, at a
   plan close with another topic open, or in a topic's spec or plan stage —
   record the proposal's items as `pending` rows, Stage `t2`, Source the
   proposal's path and the item's number, in the ledger of the topic whose
   batches are in flight, else the oldest open topic's; nothing is recommended,
   checked, or applied, and the rows wait for that topic's close. At a batch
   boundary this is loop step 6's proposal and its rows, already done when
   the window reaches this list. **Between plans**, with no ledger open,
   run the close's steps 2 to 4 over your proposal alone — the recommender
   to `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-recommendation.md` and
   `-brief.md`, the human's check, the direction beside them, and the
   apply, whose commit lands on `main` (decision-b6cb). When a Hosa is
   live, send it the `close:` line of "Delegation to Hosa" with `kanri` for
   the topic and those paths, name the delegation in the handover file's In
   flight block, and go on to step 2 without waiting: the successor
   verifies the commit on Hosa's `close done:`. When none is live, run the
   three steps yourself and verify that commit **before** the handover file
   is written, so that the successor inherits a commit and not a pending
   write-out. A plan close with no other topic open is between plans: the
   close's own T2, the merge decision, the peers' deletion, and the archive
   move come first, and your exit lands where the tree is once the merge
   decision is executed — on `main` after a merge, on the plan's branch
   only when the human declined the merge.
```

- [ ] **Step 6: The handover template's two placeholders**

**P6.4** `skills/tanto/templates/kanri-handover.md` — replace exactly these 3 lines

```text
- <A shoroku candidate the outgoing Kanri could not classify or reconstruct at
  its exit, one line each, for the successor to raise at its first boundary.
  Write "none" when there is none.>
```

**P6.4 →**

```text
- <The ledger that holds the outgoing Kanri's exit rows as `pending`, by
  path, when a ledger was open at the exit; then a shoroku candidate the
  outgoing Kanri could not classify or reconstruct, one line each, for the
  successor to raise at its first boundary. Write "none" when there is
  none.>
```

**P6.5** `skills/tanto/templates/kanri-handover.md` — insert after this 1 line

```text
  one per line, or "none">; lost with this session
```

**P6.5 →**

```text
- A close delegated to Hosa — <`<topic>` or `kanri`, Hosa's `<name> [<ref>]`,
  the `close:` line's paths and subject, and whether `close done:` has
  arrived, or "none">; the successor verifies the commit on `close done:`
  and fills the ledger, or the roster for a Kanri exit
```

- [ ] **Step 7: The Delete table's five rows**

**P6.6** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
| the spec review is accepted, the human's answers to the spec brief are in `dialogue.md`, and the `spec accepted:` line named the exit proposal | Sekkei is done; ask for its deletion once the recommendation over its exit proposal is on disk — a Sekkei is never kept for the next topic: the next spec needs the human's dialogue whether the session is old or new, what it carries is on disk and in the spec inputs, and its context would be re-read at every wake-up of the new topic |
```

**P6.6 →**

```text
| the spec review is accepted, the human's answers to the spec brief are in `dialogue.md`, and the `spec accepted:` line named the exit proposal | Sekkei is done; record its proposal's items and the spec's four sections as `pending` rows and ask for its deletion as soon as the proposal passes the form check — a Sekkei is never kept for the next topic: the next spec needs the human's dialogue whether the session is old or new, what it carries is on disk and in the spec inputs, and its context would be re-read at every wake-up of the new topic |
```

**P6.7** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
| the `coldread answered:` line named the exit proposal, or the human does not want the plan now and the `exit:` line was answered | Keikaku is done; ask for its deletion once the recommendation over its exit proposal is on disk; a Keikaku is never reused across topics (decision-f496) |
```

**P6.7 →**

```text
| the `coldread answered:` line named the exit proposal, or the human does not want the plan now and the `exit:` line was answered | Keikaku is done; record its proposal's items as `pending` rows and ask for its deletion as soon as the proposal passes the form check; a Keikaku is never reused across topics (decision-f496) |
```

**P6.8** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
| Jisso's fix from the Kaiseki report passed review and tests, and no `blocks this task: yes` item is open | Kaiseki is done; ask for its deletion once the recommendation over its exit proposal is on disk, or keep it if more of the same bug is expected |
```

**P6.8 →**

```text
| Jisso's fix from the Kaiseki report passed review and tests, and no `blocks this task: yes` item is open | Kaiseki is done; record its proposal's items as `pending` rows and ask for its deletion as soon as the proposal passes the form check, or keep it if more of the same bug is expected |
```

**P6.9** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
| the final batch is accepted, T2's proposal is written, leftovers are clean, and the human has executed the merge decision | Jisso is done; ask for its deletion once the recommendation over that proposal is on disk, T2 being its exit |
```

**P6.9 →**

```text
| the final batch is accepted, T2's proposal is written and passes the form check, and leftovers are clean | Jisso is done; ask for its deletion at once, T2 being its exit — the recommendation, the human's check, the apply, and the merge decision run with it gone, and a merge declined with fixes wanted is a new batch on a new Jisso either way |
```

**P6.10** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
| Jisso is deleted and the ledger's Progress line says closed | this plan is closed. **First, while every row still carries its Transcript column**, run `node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]` over the sessions of **this topic**: every handshake the ledger's Session events accepted for it — Sekkei, Keikaku, Jisso, an attached Kaiseki — and every Kanri whose tenure overlapped it, the current one and any predecessor the Events' handover lines name, each path taken from its roster or archive row. A refused handshake has no row and no transcript and is not in the list; rows of another plan that a shared roster still holds, and Kikaku's and Hosa's, whose Topic is `—`, are not of this topic and are left out. A path that is denied, `unavailable`, or on another host is skipped and named by the script, and is never read by asking the peer. Record the share line, the sessions it ran over, and the ones it skipped in the Measurements share row; the target is 30% or less. Then ask the human, in one line and in the chat's language, for the Account & Usage view's own figure for the day, and record it beside the proxy — the two are compared, not equated, since that view counts every other workspace and every subagent — and a silence is an answer and a blank. Then mark `dead` the rows of the sessions deleted at this close, move the dead, replaced, refused, and cleared rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet, fill the ledger's remaining Measurements fixed rows, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |
```

**P6.10 →**

```text
| the close's apply is verified, the human has executed the merge decision, and the ledger's Progress line says closed | this plan is closed. **First, while every row still carries its Transcript column**, run `node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]` over the sessions of **this topic**: every handshake the ledger's Session events accepted for it — Sekkei, Keikaku, Jisso, an attached Kaiseki — and every Kanri whose tenure overlapped it, the current one and any predecessor the Events' handover lines name, each path taken from its roster or archive row. A refused handshake has no row and no transcript and is not in the list; rows of another plan that a shared roster still holds, and Kikaku's and Hosa's, whose Topic is `—`, are not of this topic and are left out. A path that is denied, `unavailable`, or on another host is skipped and named by the script, and is never read by asking the peer. Record the share line, the sessions it ran over, and the ones it skipped in the Measurements share row; the target is 30% or less. Then ask the human, in one line and in the chat's language, for the Account & Usage view's own figure for the day, and record it beside the proxy — the two are compared, not equated, since that view counts every other workspace and every subagent — and a silence is an answer and a blank. Then mark `dead` the rows of the sessions deleted at this close, move the dead, replaced, refused, and cleared rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet, fill the ledger's remaining Measurements fixed rows, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |
```

The plan-closed row's Say column — the share, the archive move, the handover —
is unchanged; it names neither the recommendation nor Jisso's presence, which
this step confirms by reading it (spec 3.9).

- [ ] **Step 8: The anchor for this task's insertion**

**A6.1** `skills/tanto/templates/kanri-handover.md` — `grep -c 'A close delegated to Hosa' skills/tanto/templates/kanri-handover.md` — before: 0, after: 1

- [ ] **Step 9: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md skills/tanto/templates/kanri-handover.md
```

Expected: exit 0, none `Failed`. `markdownlint-cli2` ignores
`skills/tanto/templates/**`, so only the role file is linted as Markdown here.

- [ ] **Step 10: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md skills/tanto/templates/kanri-handover.md -m "docs(tanto): Kanri's own exit is a proposal and rows while a ledger is open" -m "Handover step 1 records pending rows in one ledger and hands over; between plans the four steps run and the apply lands on main, delegated to a live Hosa by the close: line. The handover file names that ledger and any delegated close; the Live peers sentence points at the delete request; the Delete table's four seat rows end at the form check and the plan-closed row keys on the merge decision. Spec 3.7, 3.9, 7.4." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 11: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 12: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-shoroku-at-close.md --task 6
```

Expected: `task 6: verify clean`.

**Done when:** the ten passages are present, A6.1 returns `1`, the needles of
O6.1 to O6.6 and of O4.3 return `0` in the two files, the Replace table's five
rows and "Recovery"'s sentence are unchanged, lint is clean, and the commit
carries its trailer.

---

### Task 7: `roles/sekkei.md` and `roles/keikaku.md` — the final boundary ends at the form check

**Batch:** C. **Blocks:** O7.1 to O7.7, P7.1 to P7.10.

The two authoring seats promise their reader a recommendation over their exit
proposal, and a wait for it. Neither happens now: Kanri checks the form,
records the items as `pending` rows, and asks for the deletion at once, and the
items are recommended at the topic's close with everything else (spec 4.1,
4.2). The dialogue's third reader is the close's recommender, not T1.
`tanto-sweep-2`'s section 5 rewrote both files' review gates; none of the lines
quoted below is in a passage that section rewrote, and each was re-read on the
merged tree.

**Files:**

- Modify: `skills/tanto/roles/sekkei.md`
- Modify: `skills/tanto/roles/keikaku.md`

**Named mechanisms this task changes, and every other site that names them:**
the **unasked proposal at a final boundary** is stated in `SKILL.md`'s "Session
exit" (task 2, P2.1), in `roles/kanri.md`'s "Exit shoroku" step 1 (task 4,
P4.1), in the Delete table's Sekkei and Keikaku rows (task 6, P6.6 and P6.7),
and in these two files' own exit bullets (P7.5, P7.9). The **second proposal**
rule — a named proposal is never rewritten — is stated once in each file
(P7.6, P7.10) and nowhere else; its reason changes from "the recommender may
already have read it" to "Kanri may already have recorded its items". Both
files still call `exit-sekkei` and `exit-keikaku` "the stage word", which no
section of the spec rewrites — Open point 8.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O7.1** `T1's shoroku` — `skills/tanto/roles/sekkei.md` 1 → 0 at P7.1;
`skills/tanto/roles/keikaku.md` 1 → 0 at P7.7. The dialogue's third reader,
named as a stage that no longer exists.

**O7.2** `Kanri adopts from its Shoroku` — `skills/tanto/roles/sekkei.md` 1 → 0
at P7.2. The spec review's report line, which said Kanri adopts where it
records.

**O7.3** `T1 has not run` — `skills/tanto/roles/sekkei.md` 1 → 0 at P7.4.

**O7.4** `because the recommender may already have read it` — `skills/tanto/roles/sekkei.md` 1 → 0 at P7.6; `skills/tanto/roles/keikaku.md` 1
→ 0 at P7.10. The reason a named proposal is never rewritten. The two files
wrap the sentence differently, which is why it is two passages and one needle.

**O7.5** `it dispatches the` — `skills/tanto/roles/sekkei.md` 1 → 0 at P7.3.
Sekkei's copy of O2.6's entity; its sentence wraps after these three words.

**O7.6** `dispatches the recommender over your proposal` — `skills/tanto/roles/sekkei.md` 1 → 0 at P7.5; `skills/tanto/roles/keikaku.md` 1
→ 0 at P7.9.

**O7.7** `at this boundary. The ` — `skills/tanto/roles/keikaku.md` 1 → 0 at
P7.8. Keikaku's Handoff paragraph, whose sentence ends at a full stop where
Sekkei's runs on; the needle spans exactly the point the clause is added at.

- [ ] **Step 3: `roles/sekkei.md` — the dialogue's third reader**

**P7.1** `skills/tanto/roles/sekkei.md` — replace exactly this 1 line

```text
brief writer reads it, and T1's shoroku takes it as an input — under this
```

**P7.1 →**

```text
brief writer reads it, and the close's recommender takes it as an input — under this
```

- [ ] **Step 4: `roles/sekkei.md` — the review report line**

**P7.2** `skills/tanto/roles/sekkei.md` — replace exactly these 2 lines

```text
Then send Kanri one line with the report path: Kanri adopts from its Shoroku
candidates.
```

**P7.2 →**

```text
Then send Kanri one line with the report path: Kanri records its Shoroku
candidates as `pending` rows.
```

- [ ] **Step 5: `roles/sekkei.md` — the tenure paragraph**

**P7.3** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```text
idle. Kanri sends you no `exit:` at this boundary; it dispatches the
recommender at once, and the
plan is Keikaku's from then on.
```

**P7.3 →**

```text
idle. Kanri sends you no `exit:` at this boundary; it checks the proposal's
form, records its items, and asks for your deletion at once, and the
plan is Keikaku's from then on.
```

- [ ] **Step 6: `roles/sekkei.md` — the exit bullet**

**P7.4** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```text
  **delta**. T1 has not run when you exit, so the proposal's first line says
  what it excludes — the spec, the spec review, and the dialogue, which T1
  reads for itself — and the items are the dialogue's rejected alternatives
```

**P7.4 →**

```text
  **delta**. The close has not run when you exit, so the proposal's first
  line says what it excludes — the spec, the spec review, and the dialogue,
  which the close's recommender reads for itself — and the items are the
  dialogue's rejected alternatives
```

**P7.5** `skills/tanto/roles/sekkei.md` — replace exactly these 4 lines

```text
  `.tanto/<topic>/exit-sekkei-proposal.md`. Then stop
  there: Kanri dispatches the recommender over your proposal, and once its
  recommendation is on disk Kanri asks the human to delete you; the deletion
  may lag that ask. If more work reaches you in that gap — a cold-read
```

**P7.5 →**

```text
  `.tanto/<topic>/exit-sekkei-proposal.md`. Then stop
  there: Kanri checks the proposal's form, records its items as `pending`
  rows, and asks the human to delete you at once — no recommender runs before
  the topic's close, where your items are recommended and checked with
  everything else; the deletion may lag that ask. If more work reaches you in
  that gap — a cold-read
```

**P7.6** `skills/tanto/roles/sekkei.md` — replace exactly these 2 lines

```text
  first, and name it in the line that reports the work; a proposal you have
  named is never rewritten, because the recommender may already have read it.
```

**P7.6 →**

```text
  first, and name it in the line that reports the work; a proposal you have
  named is never rewritten, because Kanri may already have recorded its items.
```

- [ ] **Step 7: `roles/keikaku.md` — the dialogue and the Handoff**

**P7.7** `skills/tanto/roles/keikaku.md` — replace exactly this 1 line

```text
  T1's shoroku takes it as an input.
```

**P7.7 →**

```text
  the close's recommender takes it as an input.
```

**P7.8** `skills/tanto/roles/keikaku.md` — replace exactly this 1 line

```text
Then idle. Kanri sends you no `exit:` at this boundary. The `plan committed:`
```

**P7.8 →**

```text
Then idle. Kanri sends you no `exit:` at this boundary; it checks the
proposal's form, records its items, and asks for your deletion at once. The
`plan committed:`
```

- [ ] **Step 8: `roles/keikaku.md` — the exit bullet**

**P7.9** `skills/tanto/roles/keikaku.md` — replace exactly these 5 lines

```text
  process, and the defects noticed. Then stop there: Kanri
  dispatches the recommender over your proposal, and once its recommendation
  is on disk Kanri asks the human to delete you; the deletion may lag that
  ask, and work that reaches you in the gap — a report that conflicts with
  the plan, a second cold-read question — is answered with a second proposal
```

**P7.9 →**

```text
  process, and the defects noticed. Then stop there: Kanri checks the
  proposal's form, records its items as `pending` rows, and asks the human
  to delete you at once — no recommender runs before the topic's close,
  where your items are recommended and checked with everything else; the
  deletion may lag that ask, and work that reaches you in the gap — a report
  that conflicts with
  the plan, a second cold-read question — is answered with a second proposal
```

**P7.10** `skills/tanto/roles/keikaku.md` — replace exactly these 2 lines

```text
  first, named in the line that reports the work; a proposal you have named is
  never rewritten, because the recommender may already have read it. An exit that falls away from this boundary — the human not wanting the plan
```

**P7.10 →**

```text
  first, named in the line that reports the work; a proposal you have named is
  never rewritten, because Kanri may already have recorded its items. An exit that falls away from this boundary — the human not wanting the plan
```

- [ ] **Step 9: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md
```

Expected: exit 0, none `Failed`.

- [ ] **Step 10: Commit**

```bash
git commit --only skills/tanto/roles/sekkei.md skills/tanto/roles/keikaku.md -m "docs(tanto): Sekkei's and Keikaku's final boundary ends at the proposal's form check" -m "Neither seat waits for a recommendation over its exit proposal: Kanri checks the form, records the items as pending rows and asks for the deletion at once, and the items are recommended at the topic's close. The dialogue's third reader is the close's recommender, and a named proposal is never rewritten because Kanri may already have recorded its items. Spec 4.1, 4.2." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 11: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 12: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-shoroku-at-close.md --task 7
```

Expected: `task 7: verify clean`.

**Done when:** the ten passages are present, the needles of O7.1 to O7.7 return
`0` in the two files, lint is clean, and the commit carries its trailer.

---

### Task 8: `roles/jisso.md`, `roles/kikaku.md` with its template, and `roles/hosa.md`

**Batch:** C. **Blocks:** A8.1, A8.2, O8.1 to O8.3, O8.5, P8.1 to P8.6.

Jisso's close proposal becomes a pointer list plus the delta: the `pending`
rows by number, **without re-quoting them**, and then what its own context
holds that no file does — the re-quotation would run through the context the
split exists to protect (spec 5.1). Kikaku's handlings become four, and the
fourth is a decision file that answers a stage's check; the template's third
section says the same four (6.1, 7.5). Hosa gains the close as a chore: the
`close:` line, the three dispatched steps, the brief pasted in its own window
under the standing grant, and the two answers (6.2).

**Files:**

- Modify: `skills/tanto/roles/jisso.md`
- Modify: `skills/tanto/roles/kikaku.md`
- Modify: `skills/tanto/templates/kikaku-decision.md`
- Modify: `skills/tanto/roles/hosa.md`

**Named mechanisms this task changes, and every other site that names them:**
`roles/hosa.md`'s **`close:` line** must agree **byte for byte** with
`roles/kanri.md`'s (task 4, P4.1) and `SKILL.md`'s (task 2, P2.1); step 7 below
greps all three, and check 24's fourth grep pins them permanently. The
**answers** `close done: <commit subject> — <reading>` and
`close blocked: <one line>` are written at those same three sites. The **four
handlings** are stated in `roles/kanri.md` (task 5, P5.3), here in
`roles/kikaku.md` (P8.2) and in `templates/kikaku-decision.md` (P8.3). Hosa's
**standing grant** is unchanged — the close's check is a chore Kanri sends, and
the human answers it in Hosa's window under the grant "Human access" already
gives (spec 2.4).

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/jisso.md skills/tanto/roles/kikaku.md skills/tanto/templates/kikaku-decision.md skills/tanto/roles/hosa.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O8.1** `in file mode over the` — `skills/tanto/roles/jisso.md` 1 → 0 at P8.1.
Jisso's inline `shoroku` run over the ledger, which the pointer list replaces.
The needle omits the backticked skill name, which a needle cannot carry.

**O8.2** `the three handlings` — `skills/tanto/templates/kikaku-decision.md` 1 →
0 at P8.3.

**O8.3** `You never write a recommendation, a direction` — `skills/tanto/roles/hosa.md` 1 → 0 at P8.5. "Not yours" as it stood before a
close could be Hosa's.

There is **no needle for Hosa's one-clause Models sentence**, which P8.6
retires: its only backtick-free runs are `Any subagent you dispatch takes `,
which P8.6's own new text opens with, and `; you never omit the`, which
`roles/kaiseki.md` also carries and which this plan does not touch there.
**A8.2** is the instrument instead.

**O8.5** `The shoroku write-outs.` — `skills/tanto/roles/hosa.md` 1 → 0 at
P8.5. The lead of the same paragraph, which narrows to the candidates and the
ledger (ADR 4).

O5.3 (`handling is one of three`), declared in task 5, loses its
`roles/kikaku.md` hit here, at P8.2.

- [ ] **Step 3: Jisso's proposal is a pointer list plus the delta**

**P8.1** `skills/tanto/roles/jisso.md` — replace exactly these 7 lines

```text
**Propose.** On Kanri's T2 prompt, run `shoroku` in file mode over the
conductor ledger, inline in this session, up to the proposal. Write the
numbered list to `shoroku-proposal.md` in the topic directory,
`.tanto/<topic>/`, **instead of printing it**, seeded by the conductor
ledger's adopted `S-n` rows whose Written column says `no` — so nothing is
proposed twice — and extended from your own context. Then send Kanri one line
with the path, and idle.
```

**P8.1 →**

```text
**Propose.** On Kanri's T2 prompt, write the numbered list to
`shoroku-proposal.md` in the topic directory, `.tanto/<topic>/`, **instead
of printing it**, in two parts: first the conductor ledger's `pending`
`S-n` rows listed by number, one line each, **without re-quoting them** —
the close's recommender reads each from the source its row names, and
nothing you copy would be read twice; then, from your own context, what no
file holds — the SDD ledger's rulings, parked findings, and deferred minors
as you understood them, and what the batch reports compressed. Open with
the line that says what the proposal excludes, as every proposal does.
Then send Kanri one line with the path, and idle: your deletion follows the
form check, and the recommendation, the check, and the apply run with you
gone.
```

The paragraph that follows, **Your exit**, keeps its text; its last sentence is
right as it stands (spec 5.1).

- [ ] **Step 4: Kikaku's four handlings, and its template**

**P8.2** `skills/tanto/roles/kikaku.md` — replace exactly these 5 lines

```text
Kanri's handling is one of three, and the file's third section is where you
say which one you expect: a topic in its spec stage relays it as the next
`I-n` in that topic's `spec-inputs.md`; between plans it is a T0 input
document; otherwise it is a source row in the `S-n` table. Nothing else
carries the discussion forward, so what you leave out of the file is lost.
```

**P8.2 →**

```text
Kanri's handling is one of four, and the file's third section is where you
say which one you expect: a topic in its spec stage relays it as the next
`I-n` in that topic's `spec-inputs.md`; between plans it is the next
topic's input document, read by that topic's Sekkei directly; a file whose
third section names a stage's recommendation and answers it by exception
is that stage's Check answer, read whole by Kanri, which writes the
direction from it — the item numbers are the recommendation's, everything
not listed is as recommended, and every override carries its reason;
otherwise it is a source row in the `S-n` table. Nothing else carries the
discussion forward, so what you leave out of the file is lost.
```

**P8.3** `skills/tanto/templates/kikaku-decision.md` — replace exactly these 4 lines

```text
<Which of the three handlings you expect, and for which topic: the next
`I-n` in that topic's `spec-inputs.md` while the topic is in its spec
stage; a T0 input document between plans; or a source row in the `S-n`
table. Kanri rules; this is what you expect, and why.>
```

**P8.3 →**

```text
<Which of the four handlings you expect, and for which topic: the next
`I-n` in that topic's `spec-inputs.md` while the topic is in its spec
stage; the next topic's input document between plans; a stage's Check
answer, when this file names that stage's recommendation and answers it by
exception — item numbers the recommendation's, everything not listed as
recommended, every override with its reason; or a source row in the `S-n`
table. Kanri rules; this is what you expect, and why.>
```

- [ ] **Step 5: Hosa takes the close**

**P8.4** `skills/tanto/roles/hosa.md` — insert after this 1 line

```text
Kanri's. You make the edit and nothing around it.
```

**P8.4 →**

```text

**The close's.** Sent as one line,
`close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now`
— `<topic>` a topic word, or `kanri` for Kanri's own between-plans exit.
This is the topic's one shoroku stage, and you run its three dispatched
steps while Kanri goes on. Read the ledger's Shoroku candidates table for
the `pending` rows and the source each names; dispatch
`subagent_type: tanto-shoroku-recommend` in the `shoroku` skill's recommend
mode over the proposal and every one of those sources, with `docs/` as the
baseline, the recommendation path, the brief path, the template
`templates/shoroku-brief.md`, and the chat's language; check the brief's
form by `grep` as `roles/kanri.md`'s Check step says — the four headings
in order, every `###` heading of the recommendation once after `See:` —
and on a failure dispatch once more, then paste it as it stands; give the
human, here, the recommendation's path, the brief's path, the three
counts, and the brief's text verbatim, and take the answer as the `shoroku`
skill parses it — `OK`, the numbers that go the other way, or an edit — or
a `decision: <path>` line Kanri relays, which is the answer read whole;
write the direction file beside the recommendation, item by item; dispatch
`subagent_type: tanto-shoroku-apply` in apply mode with the recommendation,
the direction, and the subject, in the slot the line gave — no
`slot-needed:` is sent, the slot is in the line; and answer Kanri
`close done: <commit subject> — <reading>`. When the brief fails its form
twice, or the human does not answer, answer `close blocked: <one line>`
instead and idle. Kanri verifies the commit and writes the ledger; you
write neither.
```

- [ ] **Step 6: Hosa's "Not yours" and "Models"**

**P8.5** `skills/tanto/roles/hosa.md` — replace exactly these 5 lines

```text
## Not yours

The shoroku write-outs. You never write a recommendation, a direction, or
an `S-n` row: the session that holds the candidates writes the proposal,
Kanri writes the direction and the rows, and a subagent applies them.
```

**P8.5 →**

```text
## Not yours

The candidates and the ledger. You never write a proposal or an `S-n` row:
the session that holds the candidates writes the proposal, and Kanri
writes the rows. A recommendation, a brief, and a direction you write only
under a `close:` line, and only a subagent applies them.
```

**P8.6** `skills/tanto/roles/hosa.md` — replace exactly these 4 lines

```text
## Models

Any subagent you dispatch takes `subagents.default`; you never omit the
model.
```

**P8.6 →**

```text
## Models

Any subagent you dispatch takes `subagents.default`, except the close's
two: the recommender takes `subagents.shoroku.recommend` and is dispatched
as `subagent_type: tanto-shoroku-recommend`, the apply
`subagents.shoroku.apply` as `subagent_type: tanto-shoroku-apply`. You never
omit the model.
```

The role's first paragraph — "A place to hand small jobs you can forget right
away" — stays; a close is the one job that waits on the human, and the line
says so (spec 6.2).

- [ ] **Step 7: The anchor, and the `close:` line in all three files**

**A8.1** `skills/tanto/roles/hosa.md` — `grep -c 'The close' skills/tanto/roles/hosa.md` — before: 0, after: 1

**A8.2** `skills/tanto/roles/hosa.md` — `grep -c 'except the close' skills/tanto/roles/hosa.md` — before: 0, after: 1

```bash
grep -cF 'close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md
```

Expected: `1` for each of the three files. This is check 24's fourth grep, run
at the task that completes it; a `0` on `roles/hosa.md` means P8.4 did not
land, and anything but `1` elsewhere means the line was reflowed in an earlier
task and must be restored, not re-spelled.

- [ ] **Step 8: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/jisso.md skills/tanto/roles/kikaku.md skills/tanto/templates/kikaku-decision.md skills/tanto/roles/hosa.md
```

Expected: exit 0, none `Failed`. `markdownlint-cli2` ignores
`skills/tanto/templates/**`, so the decision template is not linted as Markdown
here; `check-md-frontmatter` still reads it.

- [ ] **Step 9: Commit**

```bash
git commit --only skills/tanto/roles/jisso.md skills/tanto/roles/kikaku.md skills/tanto/templates/kikaku-decision.md skills/tanto/roles/hosa.md -m "docs(tanto): Jisso's proposal is a pointer list, Kikaku's handlings are four, and Hosa takes the close" -m "Jisso lists the pending rows by number without re-quoting them and adds only what no file holds; a decision file that names a stage's recommendation and answers it by exception is that stage's Check answer, in the role file and the template; Hosa runs the close's recommend, check and apply under one close: line, writes neither the rows nor the ledger, and dispatches the two kinds by name. Spec 5.1, 6.1, 6.2, 7.5." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 10: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 11: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-shoroku-at-close.md --task 8
```

Expected: `task 8: verify clean`.

**Done when:** the six passages are present, A8.1 and A8.2 return `1`, step 7's
grep returns `1` in each of the three files, the needles of O8.1 to O8.3, O8.5
and O5.3 return `0`, lint is clean, and the commit carries its trailer.

---

### Task 9: the two READMEs' passages and their drift review

**Batch:** C. **Blocks:** O9.1, O9.2, P9.1 to P9.3.

`skills/tanto/README.md` says the `docs/` system is filled at T0, T1 and T2 and
that `shoroku` recommends at every stage; both become the close, and the
recommend half runs on the top family while the apply runs on a cheaper one
(spec 8.1). `skills/shoroku/README.md` is a **drift review only**: its
recommend/apply bullet describes the halves without naming `tanto`'s stages or
the source count, and is expected to stand; the reviewer records "no drift" or
the fix (8.2).

**Files:**

- Modify: `skills/tanto/README.md`
- Review, and modify only if the review finds drift: `skills/shoroku/README.md`

**Named mechanisms this task changes, and every other site that names them:**
the **two halves and their families** are named here, in
`templates/tanto.json` (task 1), in `SKILL.md`'s kinds list (task 1) and in
`roles/hosa.md`'s Models section (task 8). `AGENTS.md` requires a sibling
README review after a `SKILL.md` edit; this plan edits two — `skills/tanto/SKILL.md`
(tasks 1, 2, 3) and `skills/shoroku/SKILL.md` (task 2) — and this task is that
review for both, explicitly. Nothing later re-touches either README.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/README.md skills/shoroku/README.md
```

Expected: `i/lf w/crlf attr/text=auto` on each, and never `w/mixed`.

- [ ] **Step 2: The old values this task contradicts**

**O9.1** `write-out at T0, T1, and T2` — `skills/tanto/README.md` 1 → 0 at
P9.1. The Prerequisites bullet's account of when `docs/` is written.

**O9.2** `every stage the session holding the candidates` — `skills/tanto/README.md` 1 → 0 at P9.2. The relationship section's account of
who writes and when; it is also O2.7's README hit, and the two needles retire
together at the same passage.

- [ ] **Step 3: The prerequisite bullet**

**P9.1** `skills/tanto/README.md` — replace exactly these 2 lines

```text
- **A `kisou`-style `docs/` system** in the target repo, for the `shoroku`
  write-out at T0, T1, and T2. Without `docs/AGENTS.md` the adopted candidates
```

**P9.1 →**

```text
- **A `kisou`-style `docs/` system** in the target repo, for the `shoroku`
  write-out at each topic's close. Without `docs/AGENTS.md` the adopted candidates
```

- [ ] **Step 4: What `tanto` decides about the filling**

**P9.2** `skills/tanto/README.md` — replace exactly these 4 lines

```text
`tanto` decides **when** it is filled and how each filling is checked: at
every stage the session holding the candidates writes them, `shoroku`
recommends in a subagent, the human answers by exception, and `shoroku`
applies and commits the accepted subset. superpowers supplies the spec, plan,
```

**P9.2 →**

```text
`tanto` decides **when** it is filled and how each filling is checked: at
every exit and every boundary the session holding the candidates writes
them, and once per topic, at its close, `shoroku` recommends in a subagent
on the top family, the human answers by exception, and `shoroku` applies
and commits the accepted subset on a cheaper one. superpowers supplies the spec, plan,
```

- [ ] **Step 5: The designs list**

**P9.3** `skills/tanto/README.md` — replace exactly this 1 line

```text
`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`.
```

**P9.3 →**

```text
`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`, and
`docs/superpowers/specs/2026-09-15-shoroku-at-close-design.md`.
```

This block quotes the list's **last line as it stands today**. Two plans ahead
of this one could have appended their own designs in their drift reviews —
`tanto-sweep-2` task 12 was one candidate, now landed for real on `main`
(that topic closed at `2e16584`) — but its drift review did not touch this
line: the real `main` still ends the list at `2026-09-12-tanto-cost-design.md`,
confirmed at this plan's release-time re-anchor (Open point 6, resolved).
`tanto-project-config`'s own plan is the one still ahead and not yet landed;
the Task-1 catch-up in Global Constraints re-checks this same line along with
everything else that topic could still move, so if it does append a design
here, that catch-up is where it surfaces, not this task. Should this old text
still fail to resolve when Task 9 actually runs (a further plan queued after
`tanto-project-config` also touching this line, say), **report that to Kanri
and stop**; do not re-target the block on your own judgment.

- [ ] **Step 6: The drift review for both READMEs**

Read `skills/tanto/README.md` whole against what this plan and its two
predecessors changed in `skills/tanto/SKILL.md`, and `skills/shoroku/README.md`
whole against `skills/shoroku/SKILL.md`. The spec names two things to look for
in the first — the feature bullets' "recommend and apply halves" and the
definitions sentence's count — and expects the second to stand as it is. Record
in the batch report, for each README, either "no drift" or the exact lines
changed and why; a fix found here is part of this task's own commit. Nothing
later in this plan touches either file.

- [ ] **Step 7: Lint**

```bash
./scripts/lint.sh skills/tanto/README.md skills/shoroku/README.md
```

Expected: exit 0, none `Failed`. Name both paths whether or not the second
changed.

- [ ] **Step 8: Commit**

```bash
git commit --only skills/tanto/README.md skills/shoroku/README.md -m "docs(tanto): the READMEs say the docs are filled once per topic, at its close" -m "The prerequisite bullet and the relationship sentence name the close instead of T0, T1 and T2, and say which family each half runs on; the designs list gains this topic's spec. The drift review of both READMEs against their SKILL.md files is recorded in this task's report. Spec 8.1, 8.2." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

If the drift review found nothing in `skills/shoroku/README.md`, drop that path
from the commit rather than making an empty change to it.

- [ ] **Step 9: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 10: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-shoroku-at-close.md --task 9
```

Expected: `task 9: verify clean`.

**Done when:** the three passages are present, the needles of O9.1 and O9.2
return `0`, the drift review of both READMEs is recorded line by line in the
batch report, lint is clean, and the commit carries its trailer.

---

### Task 10: the whole-tree old-value sweep, the note's check 24, and the checks re-run

**Batch:** D. **Blocks:** A10.1, P10.1 — and it cites every `O` block above.

**A sweep-and-check task**: its deliverable is recorded output and one appended
check, not a rewrite. It runs after every passage has landed, and it is the only
place where this plan's needles are swept over paths **no task's own passages
name** — `skills/tanto/templates/batch-prompt.md`, the scripts, and the note
itself; `templates/shoroku-brief.md` is now one of Task 2's own files (P2.15
to P2.18), so this sweep is what confirms its fix left no residual, not what
finds a new one.

**Files:**

- Modify: `docs/notes/tanto-consistency-checks.md`

**Named mechanisms this task changes, and every other site that names them:**
check 24 is the standing instrument for the **two `subagent_type` spellings**
(`roles/kanri.md`, `roles/hosa.md`), the **retired bare `tanto-shoroku`**
(`SKILL.md`, `roles/kanri.md`), the **retired stage words `t0` and `t1`**
(the whole skill), and the **`close:` line's three copies**; each of those is
written by tasks 1 to 8 and by no later task.

The needles, fifty-seven of them: **O1.1**, **O1.2**, **O1.3**, **O2.1**,
**O2.2**, **O2.3**, **O2.4**, **O2.5**, **O2.6**, **O2.7**, **O2.8**, **O2.9**,
**O2.10**, **O2.11**, **O2.12**, **O2.13**, **O2.14**, **O2.15**, **O2.16**,
**O2.17**, **O3.1**, **O3.2**, **O4.1**, **O4.2**, **O4.3**, **O4.4**,
**O4.6**, **O5.1**, **O5.2**, **O5.3**, **O5.4**, **O5.5**, **O5.6**, **O5.7**,
**O5.8**, **O5.9**, **O5.10**, **O5.11**, **O6.1**, **O6.2**, **O6.3**,
**O6.4**, **O6.5**, **O6.6**, **O7.1**, **O7.2**, **O7.3**, **O7.4**, **O7.5**,
**O7.6**, **O7.7**, **O8.1**, **O8.2**, **O8.3**, **O8.5**, **O9.1**,
**O9.2** — every `O` block this plan declares, each swept over the three
scopes. Four further old values carry no needle at all, for the reasons their
own tasks give — the bare `tanto-shoroku` dispatch name (task 5), the ledger
template's Stage-word list (task 4), Hosa's Models sentence (task 8), and
`a candidate with two stages` (task 4, Open point 5) — and step 2's regular
expressions and the anchors A4.2 and A8.2 stand in for the first three. The
regular-expression sweeps
below carry what no literal needle can: `tanto-shoroku` followed by neither `-`
nor `.`, and `t0`/`t1` as stage words.

#### Steps

- [ ] **Step 1: Sweep every needle over the whole set**

```bash
set -- '"shoroku": { "model"' 'twelve kinds' 'twelve names' 'T0 (' 'T1 (' 'the brief writer, T1' 'question back to the session' 'could not be read as written' 'dispatches the recommender at once' 'at every stage' 't0-recommendation.md' 'T0 input' '| Kanri, the recommender |' 'stage>-recommendation.md' 'stage>-brief.md' 'stage>-direction.md' 'tanto.json ok 7 12' 'Invoked with a source' "recommendation, the human's check, and the apply are dispatched" 'k.length!==12' 'is the one built-in' 'T1, T2 and every exit shoroku' 'Between stages nothing is adopted' 'The session idles through one' 'once the recommendation over' 'Every write-out, T2 included' 'an exit shoroku committed, or not run' 't0-*' 'Do the T0 write-out' 'handling is one of three' 'Run T1' 'between stages, and the recommendation' 'dispatch its' 'The session whose shoroku it is has already' "shoroku was step 6's proposal and slot" 'run T2: the four steps' "and T2's proposal is where it" 'then the recommendation, then the deletion' 'a T0 shoroku, a bug-report triage' 'first act for it is the recommender' 'dispatch the recommender, put the recommendation to the human' 'A shoroku candidate the outgoing Kanri could not classify' "T2's proposal is written, leftovers are clean" "Jisso is deleted and the ledger's Progress line says closed" "T1's shoroku" 'Kanri adopts from its Shoroku' 'T1 has not run' 'because the recommender may already have read it' 'it dispatches the' 'dispatches the recommender over your proposal' 'at this boundary. The ' 'in file mode over the' 'the three handlings' 'You never write a recommendation, a direction' 'The shoroku write-outs.' 'write-out at T0, T1, and T2' 'every stage the session holding the candidates' || exit 1
for n in "$@"; do printf '%s\t' "$n"; grep -rcF -- "$n" skills/tanto/ skills/shoroku/ docs/notes/tanto-consistency-checks.md 2>/dev/null | grep -v ':0$' | tr '\n' ' '; echo; done || exit 1
```

Expected: every needle returns nothing, with **two documented hits that are
not defects and are not adjudicated here**:

1. `at every stage` wherever the phrase does **not** mean the stages of the
   write-out; every one of the eight hits this plan read did mean them, and any
   ninth is read the same way before it is called a survivor.
2. `handling is one of three` must be **absent**, but the bare phrase
   `one of three` has two legitimate survivors in `roles/kanri.md` — the hotfix
   lane's three paths and the contract's three ways an address reaches a role —
   which is why no bare needle is swept for.

`<stage>-brief.md` and `<stage>-direction.md` in
`skills/tanto/templates/shoroku-brief.md` are **no longer** an expected
survivor: Task 2 (P2.15 to P2.18) now retires the interim multi-stage
wording that file landed with, so both needles return `0` there too, unlike
the plan-dryrun's Open point 4.

Record the raw output, hit by hit with its disposition, in the batch report; a
single verdict line is not the deliverable.

- [ ] **Step 2: The three sweeps no literal needle can carry**

```bash
grep -rcE 'tanto-shoroku([^-.]|$)' skills/tanto/SKILL.md skills/tanto/roles/kanri.md
grep -rcE '\bt[01]\b|\bT[01]\b' skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/*.md skills/tanto/templates/*.md
grep -rc 'subagent_type: tanto-shoroku-recommend' skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md
grep -rc 'subagent_type: tanto-shoroku-apply' skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md
```

Expected: `0` from the first on both files — the `.` is excluded so that task
1's `tanto-shoroku.md` removal sentence is not a hit, while
`subagent_type: tanto-shoroku` followed by a space or a period-and-space is.
`0` from the second on every file listed; the note itself and `docs/` are
outside the scope, for the reason check 10's paragraph gives — a record whose
subject is "we stopped saying X" must quote X. At least `1` and at least `2`
from the third and fourth on `roles/kanri.md`, and at least `1` each on
`roles/hosa.md`. Record the measured values: they are check 24's own expected
values, and P10.1 states them as measured, not as predicted.

- [ ] **Step 3: The `close:` line's three copies**

```bash
grep -cF 'close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md
```

Expected: `1` in each. This is what pins a named mechanism to one spelling, as
check 21 asks.

- [ ] **Step 4: Append check 24 and its two lesson lines**

**P10.1** `docs/notes/tanto-consistency-checks.md` — insert after this 1 line

```text
not trip it.
```

**P10.1 →**

````text

## 24. The two shoroku kinds, and the stage word that is left

```bash
grep -c 'subagent_type: tanto-shoroku-recommend' skills/tanto/roles/kanri.md
grep -c 'subagent_type: tanto-shoroku-apply' skills/tanto/roles/kanri.md
grep -cE 'tanto-shoroku([^-.]|$)' skills/tanto/SKILL.md skills/tanto/roles/kanri.md
grep -cF 'close: <topic> — proposal <path>; ledger <path>; recommendation <path>; brief <path>; direction <path>; subject <commit subject>; slot: now' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/hosa.md
grep -cE '\bt[01]\b|\bT[01]\b' skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/*.md skills/tanto/templates/*.md
```

Expected: at least `1` from the first and at least `2` from the second —
`SKILL.md` names the kinds, not the `subagent_type` spellings, and is not in
those two. `0` from the third, on both files: the `.` is excluded so that the
contract's `tanto-shoroku.md` removal sentence is not a hit, while
`subagent_type: tanto-shoroku` followed by a space or a period-and-space is.
`1` from the fourth in each of the three files, which pins the `close:` line's
three copies to one spelling, as §21 asks of a named mechanism. `0` from the
fifth in every file: the stage words `t0` and `t1` are retired, and the root
listing's glob for a predecessor's stage files is gone. This file and `docs/` are outside
the fifth line's scope, for the reason §10's paragraph gives: a record whose
subject is "we stopped saying X" must quote X.

Two lessons under it. **A definition-vs-template comparison through `$(...)`
on Git Bash strips the CR** and reports every CRLF file as differing: the
rendered definitions under `$CLAUDE_CONFIG_DIR/agents/` are CRLF on disk, as
`templates/agent.md` is, so compare with `tr -d '\r'` on both sides, or read
the start sequence's "content differs" modulo line endings. Measured while the
`shoroku-at-close` design was written: all of that host's definitions were
current, and a naive comparison called every one of them stale. **A retirement
needle has to be written against the new text as well as the old.** Two of that
design's first needles matched strings its own new text writes
(`tanto-shoroku.md`) or its unedited text kept (the root listing's retired
glob for a predecessor's stage files), and only a run of the grep against the
draft found them; a third could not be written as a literal at all, because
every form of it is a prefix of the spelling that replaces it, which is why
the third line above is a regular expression.
````

- [ ] **Step 5: The anchor for this task's insertion**

**A10.1** `docs/notes/tanto-consistency-checks.md` — `grep -c '## 24. The two shoroku kinds' docs/notes/tanto-consistency-checks.md` — before: 0, after: 1

- [ ] **Step 6: Re-run the note's checks 1 to 9 and record their output**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" sections --file docs/notes/tanto-consistency-checks.md '1. Every file of the layout exists' '2. Every in-skill path named by the contract or a role file resolves' '3. Every template is cited by the role that copies it'
```

Expected: the three sections print with their `bash` blocks and their
`Expected:` paragraphs. Run every block of checks 1 to 9 by hand from the
repository root and compare. Check 8's second line must print
`tanto.json ok 7 13`. Where a measured figure differs from an entry's stated
expectation, fix the **entry**, in this task's own commit, and say in the batch
report which number moved and why; a figure that differs because a passage is
missing is a defect of the batch that was to land it, not of the entry.

- [ ] **Step 7: Re-run checks 16 and 18 to 23 and record their figures**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" sections --file docs/notes/tanto-consistency-checks.md '16. The usage line names every subcommand' "18. The recommendation's headings, on both sides" "19. The check brief's form markers" '20. The enumerations the second sweep re-synchronized' '21. A named mechanism is edited at every site that names it' '22. A heading contract says whether the marker is part of the pointer' '23. A `sections` argument in prose is the bare heading'
```

Expected: the seven sections print (checks 22 and 23 landed on `main` after
this plan was drafted, per the T2 shoroku write-out for `tanto-sweep-2` — this
plan neither added nor is required to touch either, and this step re-runs them
as standing checks, consistent with "One numbering namespace"). Run each block
from the repository root. Check 18 pairs the recommendation's three group
headings with `tanto`'s side and is unaffected by this plan; check 20 carries
no kinds enumeration among its greps, measured by the spec review, so nothing
there moves — the plan re-runs it as it stands. Record every figure.

- [ ] **Step 8: The scripts still pass**

```bash
mise x node@22 -- node --test skills/tanto/scripts/
```

Expected: all tests pass. `passage-check.js`, `reading.js` and their tests are
out of scope for this plan and are untouched; this run is the evidence of that.
`scripts/reading.js` holds no list of kinds — it reads only the `ceiling` map —
which is why the thirteenth kind reaches no script.

- [ ] **Step 9: `diff` accounts for the branch**

Run "How a batch is verified"'s own hand-run `diff` check, with the base the
ledger's resolved value and never `git merge-base main HEAD`.

Expected: every changed line accounted for by a block of this plan, with any
line task 9's drift review added reported as `unaccounted-added` and traceable
to that step's record. The dogfood report's own `created:` path does not exist
yet — task 11 runs after this one.

- [ ] **Step 10: Lint and commit**

```bash
./scripts/lint.sh docs/notes/tanto-consistency-checks.md
```

Expected: exit 0, none `Failed`.

```bash
git commit --only docs/notes/tanto-consistency-checks.md -m "docs(notes): check 24 pins the two shoroku kinds, the close: line, and the retired stage words" -m "Five greps and two lessons: the two subagent_type spellings, the bare tanto-shoroku retired as a regular expression because no literal can be written against a prefix of its replacement, the close: line's three copies at one spelling, and t0 and t1 gone from the skill. The expected values are the ones this task measured. Spec 8.3, 10 D1." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 11: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 12: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-shoroku-at-close.md --task 10
```

Expected: `task 10: verify clean`.

**Done when:** the sweep's raw output and the disposition of every hit are in
the batch report, the three regular-expression sweeps and the `close:` line's
three counts are recorded, check 24 is in the note with A10.1 returning `1` and
its expected values measured rather than reasoned to, checks 1 to 9 and 16 and
18 to 23 have been run and their outcomes recorded, `node --test` passes on the
untouched scripts, `diff` accounts for the branch, lint is clean, and the
commit carries its trailer.

---

### Task 11: the dogfood report

**Batch:** D. **Blocks:** none — this task's deliverable is one report under
`docs/reports/` and the measurements in it.

**A sweep-and-check task**, the second of the two. It writes one file, but that
file's content is recorded output rather than designed text, and nothing in the
skill changes. It runs **last**.

`docs/reports/2026-09-15-shoroku-at-close-dogfood.md`, written per
`docs/reports/AGENTS.md` — a dated, frozen investigation, which is what a
dogfood is. It is declared `created:` (see "The created paths"), so `diff` never
checks its lines against a passage, at this boundary or any other.

**This report is written mid-batch D, before the plan's own close.** The close
this plan describes — the one recommend, the one check, the one apply — has not
happened when this task runs, and `docs/reports/` is frozen once written. The
spec says so itself: this run's own close is the first run of the text it wrote,
and the ledger's Measurements table records it, not this report.

**Files:**

- Create: `docs/reports/2026-09-15-shoroku-at-close-dogfood.md`

#### Steps

- [ ] **Step 1: Confirm whether the close has run**

```bash
ls -1 .tanto/shoroku-at-close/t2-*.md 2>/dev/null | head -n 1
```

Expected: nothing — no `t2-recommendation.md`, `t2-brief.md` or
`t2-direction.md` exists yet, because the close comes after this batch. If this
instead prints a path, the close **has** run: read it and write measurement 2
below from the real run rather than deferring it. The two cases are mutually
exclusive, and the batch report says which one happened.

- [ ] **Step 2: Gather the three measurements**

The three the spec names, each from a file and not from recollection:

1. **Exits form-checked with no recommender run.** From
   `.tanto/shoroku-at-close/kanri.md`'s Session events and its `S-n` table: how
   many sessions of this topic wrote an exit proposal, had its form checked,
   and were deleted with no recommender dispatched — the number, and the roles.
   The interim ran under the same rule by ruling (`tanto-sweep-2` R-4,
   `tanto-project-config` R-4, and this topic's own), so the count covers the
   whole run and not only the text's own lifetime.
2. **The close's one recommend.** The number of sources the dispatch named, the
   number of items the recommendation quoted, and the subagent's token count —
   from the recommendation file and the dispatch's own reply. Deferred to the
   ledger's Measurements table when step 1 found no `t2-` file, with this report
   saying so and pointing at where it lands.
3. **The human's shoroku checks in this topic, expected `1`**, and **whether
   the close was delegated to a Hosa** — with, if it was, the time from Kanri's
   `close:` line to its handover file. Neither `tanto-sweep-2`'s nor
   `tanto-project-config`'s close had a `close:` line or a Hosa delegation
   to compare against — this design is what introduces both — so there is
   no prior figure of the same shape. Measure instead, from each of those
   two ledgers' Session events, the closest analogous interval: the time
   from the final batch's acceptance to Kanri's handover file (the closest
   prior close came to this one's own start and end points), and record
   this run's own delegated-close time beside it as the new baseline —
   not a like-for-like comparison, but the first measurement of the shape
   this plan's own design creates, for a later topic's close to compare
   against for real.

Plus the issues closed and the readings.

- [ ] **Step 3: Write the report**

Write `docs/reports/2026-09-15-shoroku-at-close-dogfood.md` per
`docs/reports/AGENTS.md` — a `# H1` title, the date carried only in the file
name, no frontmatter. Sections:

1. **The three measurements** of step 2, each with the file it came from, and
   each deferred measurement named as deferred with its destination.
2. **Issues closed.** issue-19d4, which this plan's sweep confirms: no site
   still has a Sekkei or Keikaku waiting for an `exit:` line at its final
   boundary. The close moves it from `docs/issues/open/` to `resolved/` with
   that as the resolution note; this task files nothing under `docs/issues/`.
   Record also that issue-52fd stays open with its subject re-pointed at
   `shoroku.apply`.
3. **The readings.** Each batch boundary's `context=` figure from the ledger's
   Measurements per-boundary row, and the top-family one-shot tally from its
   Session events lines — a run in which the recommend half is on the top
   family and the apply half is not, which is itself the data point ADR 2 rests
   on.
4. **What this report does not cover, and why.** One paragraph on the close
   that had not run when the report was written. Add one sentence flagging
   a stale citation for whoever runs the close: the spec's own Shoroku
   candidate 10 (section 8.3) says "check 22", but real `main`'s checks 22
   and 23 landed after this plan's review, and this plan's own new check is
   24 — the close's recommender quotes the spec verbatim, so it will write
   "check 22" for that candidate; the human's check on the brief, or Kanri's
   own read of the recommendation, is where that gets corrected to 24, not
   a plan defect and not this task's to fix in the spec.

- [ ] **Step 4: Lint**

```bash
./scripts/lint.sh docs/reports/2026-09-15-shoroku-at-close-dogfood.md
```

Expected: exit 0, none `Failed`. `docs/reports/AGENTS.md` gives reports no
frontmatter to check, so the linter's frontmatter hook has nothing to look at
here.

- [ ] **Step 5: Commit**

```bash
git add docs/reports/2026-09-15-shoroku-at-close-dogfood.md && git commit --only docs/reports/2026-09-15-shoroku-at-close-dogfood.md -m "docs(reports): the shoroku-at-close dogfood" -m "The exits form-checked with no recommender run, the close's one recommend where it has run, the human's one check and whether Hosa held it, the issue closed, and the readings. The close itself falls after this batch, so its own figures land in the ledger's Measurements table. Spec 10 D2." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 6: Restore the created file's line ending**

```bash
git checkout -- docs/reports/2026-09-15-shoroku-at-close-dogfood.md && git ls-files --eol docs/reports/2026-09-15-shoroku-at-close-dogfood.md
```

Expected: `i/lf w/crlf attr/text=auto`.

- [ ] **Step 7: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 8: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-15-shoroku-at-close.md --task 11
```

Expected: `task 11: no passages`. This task carries none; the line is a result,
not a failure.

**Done when:** the report exists with its four sections and the three
measurements (or their named deferrals), the `# H1` is the title with the date
carried only in the file name, `git ls-files --eol` reports `i/lf w/crlf` on
it, lint is clean, and the commit carries its trailer.

---

## Self-Review

**The largest task.** Task 4 — `roles/kanri.md`'s "Shoroku" replaced whole,
with `templates/kanri.md` and `templates/roster.md`, plus the ledger
template's Written-column fix (P4.8, Open point 5). It runs **705 lines**
of this plan and **14 steps**, and carries fifteen blocks: two `A`, five
`O` and eight `P`. Task 2 is the next largest at 672 lines and **17
steps** — the contract's own "Session exit" replacement, four other files'
one-sentence edits, and the check-brief template's own fix (P2.15 to
P2.18, Open point 4), each its own step — with thirty-six blocks (one `A`,
seventeen `O`, eighteen `P`). Task 5 follows at 379 lines and 13 steps
with twenty-three blocks — the plan.review finding B-1's fix added a
verification block to Step 6, without a new step or block. The smallest
are Task 11 (131 lines, no blocks — a sweep-and-check task) and Task 3
(154 lines, six blocks). No threshold is set for either measure; these are
recorded until one can be chosen (issue-7281).

**Sweep-and-check tasks: two.** Task 10, whose deliverable is the recorded
output of the whole-tree old-value sweep and the note's own checks 1-9, 16
and 18-23 (plus the new check 24 itself, its one passage — checks 22 and 23
landed for real between this plan's drafting and its branch cut, per the
real-tree re-anchor; see Global Constraints), and Task 11,
whose deliverable is the dogfood report. Both invert the reviewer's
standing instruction — there is no file edit to read against a block for
most of what each task does — and both cost on the implementer's seat and
the reviewer's. They are the last two tasks of Batch D, adjacent, so that
one reviewer carries the inversion once. Task 10 must land before Task 11,
since the report counts what the sweep found.

**Placeholder scan.** No step says "TBD", "similar to task N", or "handle
the rest": every passage carries its old and new text in full, and the two
sweep-and-check tasks name exactly which commands produce their output and
what is done with each hit. Task 9's own drift review of
`skills/shoroku/README.md` is the one deliberately open-ended step — the
spec assigns it to the implementer's reading rather than to a passage — and
it requires the finding (drift, or none) to be recorded either way.

**Consistency.** Block ids are unique and every citation resolves: the `O`
needles cited in Task 10 are all declared in Tasks 1 to 9, and Task 10 also
carries `A10.1` and `P10.1` of its own (the new check 24). Every passage's
old text was re-read from the tree this plan's own drafting note
("The baseline these blocks were quoted from") describes, not from the
spec's quotation verbatim — the nine places where the two differ are the
"Open points for Kanri" below, seven of them informational and two (items 4
and 5, the check-brief template and the ledger template's Written-column
sentence) real scope gaps, put to Kanri ahead of `plan.review` and ruled
theirs to fold in (see `.tanto/shoroku-at-close/plan-dryrun.md`) — Task 2
(P2.15 to P2.18) and Task 4 (P4.8) now carry them.

**Dry run.** `node "$TANTO/scripts/passage-check.js" lint` is clean.
`replay` against the projected merged tree — the real `tanto-sweep-2` tip
plus `tanto-project-config`'s full draft plan applied on top — is clean (0
failures); against today's bare tip or `main` it is not, which is expected
under the queued-topic flow (ledger R-4) and is not evidence against this
plan. Full commands and output: `.tanto/shoroku-at-close/plan-dryrun.md`.

**Review.** `plan.review` (`.tanto/shoroku-at-close/plan-review.md`) found
one blocking item (B-1, a boundary-scoped grep expectation copied into the
wrong task — fixed: Task 4 step 10 expects its own real values, Task 5's
Step 6 carries the boundary values once P5.7 lands), five should-fix items
(the fourteen absolute-path fences S-1 were already fixed independently
before the review returned; the Batches table's unusable `close:`-line hand
check S-2, the spec's deferred batch-A verification with no home S-3, four
prose sites left describing the pre-fold-in state of Open points 4/5 S-4,
and a stale needle count S-5, all fixed), and minor wording fixes (M-1
through M-3, M-7); one minor item (M-5, a spec residue in P2.6's own
Readers cell that conforms to spec 2.3's own "unchanged" instruction) is
left for the human's own read, not edited on Keikaku's judgment alone; one
(M-4, "six rows" vs. seven, inherited from the spec's own wording) and one
(M-6, a 190-character template line, outside markdownlint's scope) are left
as the review found them.

---

## Open points for Kanri

Nine, each found while re-quoting the old texts on the projected baseline
described at the top of this file. None is guessed at; each names the task, the
site, and what did not match.

1. **Task 3, P3.2 — the unknown-key sentence has already moved.** The spec's
   2.1 quotes the line as ``your start line as `unknown key <name>, ignored`, or as``
   and treats it as today's text. `tanto-project-config`'s draft plan rewrites
   that whole paragraph (its P2.3) and the line becomes
   ``your start line as `unknown key <name> in <path>, ignored`, or as`` — the
   report now names the file the key came from. Spec section 9's table does not
   list this site as one that plan rewrites. P3.2 quotes the landed line and
   grafts the spec's example onto it with the landed spelling, changing nothing
   else. If Kanri prefers the spec's own spelling, the block changes, not the
   tree.

2. **Task 1 — the Resuming sentence has no count left to change.** Spec 2.1
   asks for ``Start sequence's twelve-definitions write-and-count`` →
   `thirteen-definitions`. `tanto-project-config`'s P6.5 rewrites that line to
   "the Start sequence's definitions write-and-count in both scopes", dropping
   the count entirely. No passage is written for this site, and no needle is
   declared for `twelve-definitions`: it is already `0` before this plan starts.
   The same holds for `twelve agent` in `roles/kanri.md`, which that plan's P7.1
   removes.

3. **Task 3, P3.1 — the skill-name-key bullet is today's text after all.**
   Spec section 9 says `tanto-project-config` 1.6 rewrites this bullet first,
   and that the plan's author should merge the two. That plan's draft carries
   **no passage over this bullet** (`grep -n 'skill name'` on it returns
   nothing), so the spec's own old text stands and P3.1 uses it unchanged. Worth
   a word to Kanri only because section 9 predicted otherwise.

4. **Resolved — folded into Task 2 (P2.15 to P2.18).** `skills/tanto/templates/shoroku-brief.md`
   was in the sweep's scope and in no task: created by `tanto-sweep-2` task 10,
   it carried `<stage>-brief.md` twice, `<stage>-direction.md` once,
   `for T0 and Kanri's own exit` in its own path sentence, `— <stage> —` in its
   title and its `Document:` line, and "at every stage" in the paragraph about
   the four headings — none of it in the spec's file list, since the file did
   not exist when the spec was drafted. Kanri ruled this plan-scope drafting
   judgment, not something needing a Kanri ruling in general, and to fold it
   into Task 2 rather than open a new batch or task; done, and Task 10's own
   documented-exceptions list no longer carries it.

5. **Resolved — folded into Task 4 (P4.8).** `templates/kanri.md`'s
   "candidate with two stages" sentence disagreed with `roles/kanri.md`'s
   after P4.1 rewrote the latter to "a candidate two closes could claim is
   one row in the ledger of the topic that raised it"; spec 7.3 did not list
   the template's own closing-paragraph copy among its edits. Kanri ruled the
   same way as item 4: fold it in, Keikaku's own call where in the plan.

6. **Resolved (release-time re-anchor).** Task 9, P9.3's old line
   (``docs/superpowers/specs/2026-09-12-tanto-cost-design.md`.`` as the
   designs list's final line) was drafted against a projection that could
   not see `tanto-sweep-2`'s task 12 (a drift review of the same README).
   `tanto-sweep-2` has since closed (`2e16584`), and its task 12 did not
   append a design here — the real `main` still ends the list at that same
   line, confirmed directly. Nothing to change; Task 9's own step now says
   so and keeps the "report and stop" rule for whatever `tanto-project-config`
   might still do to this line, covered by the Global Constraints catch-up.

7. **Resolved (release-time re-anchor).** Task 9 and Task 10's blocks in
   the note and the READMEs were drafted against a projection missing
   `tanto-sweep-2`'s tasks 12 (checks 18 and 19 inserted before check 20;
   both READMEs' drift review) and 13 (its own `O` sweep). `tanto-sweep-2`
   has since closed, and the release-time re-anchor re-quoted every block
   this plan touches against the real, fully-landed tree — `replay --base
   main` is clean on every site this plan itself is responsible for. What
   remains open is `tanto-project-config`'s own not-yet-landed effect on
   these same files, which is the Global Constraints catch-up's job, not a
   separate re-check of this item.

8. **Tasks 2, 4 and 7 — `exit-sekkei` and `exit-keikaku` are still called
   "the stage word".** `roles/sekkei.md` and `roles/keikaku.md` each carry one
   such sentence. The spec's F-1 settles the vocabulary the other way — `t2` on
   every ledger row, and `exit-<role>[-<suffix>]` naming a proposal file, never
   a Stage value — and this plan writes that into `SKILL.md`,
   `roles/kanri.md`, `templates/kanri.md` and `templates/roster.md`. Neither
   sekkei nor keikaku sentence is in any passage the spec gives, and no needle
   in its Old values table reaches them. They are left as they are.

9. **Task 2, P2.10 — a mismatch drafting itself found and re-flowed, not
   recorded here until the review caught the gap.** Spec 8.2 quotes the
   recommend-mode sentence ending "— and an output path. Run the workflow up
   to the"; the real tree's sentence also carries the baseline and the brief
   inputs `tanto-sweep-2` added ("an output path, and a baseline, the `docs/`
   tree … a brief path, a template, and a chat language"), and spec section 9
   does not list this site as one either ahead plan rewrites. P2.10 quotes the
   landed line and re-flows the spec's new sentence after the fuller list,
   which reads correctly — the informational fact is only that "every
   mismatch found while drafting is recorded in Open points" was one short.
