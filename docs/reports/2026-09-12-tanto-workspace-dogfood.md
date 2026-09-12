# The tanto-workspace run, measured

What it cost and what it turned up to move every path at which `tanto` keeps
its own state out of `.superpowers/sdd/` and into `<workspace>/.tanto/`, one
directory per topic. The run was a `tanto` protocol run over a passage plan:
Kanri, a spec Sekkei, a plan Sekkei, and one Jisso, on one working tree and one
branch. Figures are as measured during the run; the shape of the skill after it
is in design-4807, and the rules the run produced are in
`docs/notes/authoring-a-passage-plan.md` and
`docs/notes/tanto-consistency-checks.md`.

## The shape of the run

Six plan tasks in two batches, plus the whole-branch review's fix wave as a
third. Seven commits on the branch.

- **Zero fix rounds inside the task loop.** Every one of the six task reviews
  came back clean on its first pass, and no task parked a finding. The only
  fix round of the whole run was the final fix wave, which is a batch by
  design rather than a failure.
- **Two controller rulings**, both traceable to one root cause: a plan block
  that could not survive its destination's linter. Both are now filed — see
  issue-f851 (the cause) and issue-7c28 (what the workaround leaves behind).
- **One Minor parked**, at the very end, in text the controller itself had
  specified verbatim in the fix-wave dispatch.

| Batch | Tasks | Commits | Fix rounds | Parked |
| --- | --- | --- | --- | --- |
| A | 1-4, every file a session loads | 5 | 0 | 0 |
| B | 5-6, the README, the note, the sweep | 1 | 0 | 0 |
| C | the whole-branch review's fix wave | 1 | 1 wave, 1 scoped re-review | 1 Minor |

## What the move was measured against

The plan's subject was counted three times, by three different readers, and the
third count is the one the plan used.

- The spec's own first figure: `.superpowers/sdd` on about 90 lines.
- The spec reviewer's re-measurement (2026-09-11): **92 lines / 96 occurrences**
  across 15 files of `skills/tanto` plus the consistency note, and
  `plan-basename` on **36 lines / 40 occurrences**.
- The plan reviewer's independent re-measurement (2026-09-12), per file:
  `SKILL.md` 31, `roles/kanri.md` 24, `roles/sekkei.md` 8, `roles/kaiseki.md` 4,
  `README.md` 1, the note 2, and 23 across the nine templates.

That three readers produced three different totals for the same grep is the
useful part: the counts differ by what they count — lines against occurrences,
and which files are in scope — so a plan that states a count states the command
that produced it, or the number cannot be reproduced.

After the plan, the surviving allowlist is three lines and one line, and the
standing check for it is in `docs/notes/tanto-consistency-checks.md` section 7.

## The plan stage: five parallel drafters

The plan was drafted by fanning out one drafter per destination file on `opus`,
with Sekkei writing the frame and assembling.

- Five drafters: **75,585 / 99,352 / 96,126 / 106,524 / 109,770 tokens**, 11 to
  22 tool uses each, 6m08s to 12m16s each.
- **487,357 tokens in 12m16s of wall clock**, against 49m14s if run serially.
- `lint` clean and `replay` exit 0 on the **first** assembly of 107 blocks
  (71 passages, 16 anchors).
- The plan reviewer: **157,358 tokens, 48 tool uses, 12m04s**, returning 1
  blocker, 7 should-fix and 5 nits over 3,122 lines, with the coverage
  re-measured independently rather than taken from the plan.

What made the fan-out work was a written conventions file every drafter read —
block grammar, wrap column, the uniqueness check, the no-`O`/no-grep rule, the
step skeleton, and the facts not to re-derive. Five sections needed no
reconciliation at assembly.

## What the execution cost

Per-seat usage, in tokens, as each subagent reported it.

| Task | Implementer | Reviewer |
| --- | --- | --- |
| 1 — `SKILL.md`, 11 passages | 101k | 85k |
| 2 — `roles/kanri.md`, 23 passages | 163k + 171k (one re-author) | 99k |
| 3 — three role files, 14 passages | 117k | 98k |
| 4 — nine templates, 20 passages | 106k | 95k |
| 5 — README and the note, 3 passages | 71k | 73k |
| 6 — the whole-tree sweep, no file | 84k | 85k |
| fix wave — two findings | 73k | 61k |

Task 2 was the heaviest in both seats: it carried the most passages and it hit
the linter conflict. **Task 6 is the interesting one**: a verification-only
sweep was expected, on the context-cost run's measurement, to cost about 1.93×
a median implementer and 1.39× a median reviewer, and it did not — it came in
at roughly a mid-sized passage task in both seats, even though its reviewer was
told to re-run all twelve steps rather than trust the report. That data point,
and a hypothesis about why, are recorded in issue-7281.

Jisso's own transcript at each boundary: 1.83 MB / 469 records / 12 wake-ups at
batch A, 2.25 MB / 610 / 17 at batch B, 2.53 MB / 703 / 20 at batch C. No
compaction at any point.

## What `replay` could and could not exercise

`replay` **skipped 33 commands** on this plan — every `git` invocation,
`./scripts/lint.sh`, `verify`, the reads of the plan's own text, and the
pinned-quote check that reaches outside the repository. That bounds how much of
a plan's `O`-block set `replay` can actually test: the sweeps it does run are
real tests of the expected counts, but a third of the plan's commands are
verified only by being run for real at a boundary.

A related limit, worth stating because it cost the whole-branch reviewer time:
`replay`'s `DIFFERS` is a literal string comparison of output against the
`Expected:` **paragraph**, so any expectation written as prose reports
`DIFFERS` even when it is fully satisfied. Five of that review's six `DIFFERS`
were semantic passes adjudicated by hand.

## The review method worth keeping

Task 4's reviewer, facing nine files and twenty passages, did not read the diff
hunk by hunk. It **reconstructed** each file from its base blob plus only the
brief's declared substitutions, and compared the result with `HEAD`:
`reconstructed == HEAD` for all nine.

That is a complete proof that a diff is exactly the union of its passages —
stronger than a reading, and cheap. For a passage plan it is probably the right
default for any task touching more than two or three files.

Task 6's reviewer added the other half of a sweep's proof, unprompted: it
counted all twenty `O` needles on the **pre-plan** tree as well as at head, and
found every one non-zero and equal to the plan's own block list. Without that,
nineteen zeroes at head prove nothing about whether anything was removed. That
is now a standing rule in `docs/notes/authoring-a-passage-plan.md`.

## The bug the whole-branch review caught

`SKILL.md`'s Artifacts table named a reader — "the human" — for the compaction
file, for two session kinds that the same document says never write that file
at all: Kanri itself, whose case is its handover file, and a standalone
Kaiseki, which puts the items to the human in its own window.

The defect was inherited from the old scheme rather than introduced by this
plan, but the plan made it conspicuous, because it gave the adjacent
exit-proposal row a `.tanto/`-level fallback path and left this row without
one. Six task reviews read the table without catching it; a whole-branch pass
that could see the row and its governing paragraph at once did. It was fixed in
the fix wave.

## One process note

A spec drafted for this run described an ADR amendment as something written
"beside" the ADR, which the document system forbids. A spec that proposes an
ADR change should cite the amend mechanics in `docs/decisions/AGENTS.md` rather
than describe the move from memory — the mechanics are two specific legal
moves, and neither is "write it beside".
