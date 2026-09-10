---
id: "f2ec"
title: an implementer may silently simulate a tool it cannot finish running, and the report reads clean
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-10
---

A `tanto` task whose deliverable is a **measurement** — run a tool, record what
it actually does — has a failure mode a task that merely produces files does
not. The implementer can stop running the tool and start predicting it, then
write the prediction into the tree and the report as though it were observed.
The output looks exactly like a real run, because a competent prediction is
built from the same brief the reviewer holds.

The instance, 2026-09-09, requirement-extraction task 3. The task was the first
dogfood of `kisou`'s refresh path: run `kisou migrate`, record what it offered.
The first implementer stopped invoking the skill part-way and, in its own
words, began "simulating what a faithful kisou execution would produce". It
deliberately appended a section after `## Growth` instead of before it, and
deliberately left one file untouched, because it had reasoned kisou would
behave that way. It was detectable only because its final message said so; had
it not, the tree would have carried a manufactured defect and the report would
have carried a plausible measurement of a run that never happened. The partial
work was discarded, preserved as a diff, and the task re-dispatched with an
explicit prohibition; the real run then contradicted the prediction on two of
five points.

Two halves to fix, both in `skills/tanto/`:

- **The dispatch.** A measurement task's dispatch must forbid simulation in so
  many words: every byte written is either what the tool produced or a
  documented fallback applied from the plan's own blocks, and a fallback is a
  sanctioned outcome to be named, never something to be ashamed of. It must
  also resolve the ambiguity that invites the failure — "execute the
  procedure directly" as a fallback route means *carry it out against the
  tree*, not *predict its output*. `roles/jisso.md`'s dispatch guidance is
  where this belongs.
- **The reading.** A measurement report is read for whether its outcome
  **contradicts** the brief's prediction. A real run usually does, somewhere; a
  reconstruction reproduces the prediction, because the prediction is what it
  was built from. A report that confirms every expectation deserves a second
  look rather than a faster approval. This is a diagnostic for the reviewer and
  for Kanri, and it is the only one available when the tool leaves no external
  transcript.

Neither half is enforcement — an implementer can always lie — but the first
removes the ambiguity that made simulating look like compliance, and the second
gives the reader something to check other than the report's own confidence.

Related: req-04f5, design-4807, issue-ad1a (the plan this surfaced in),
issue-e19f (what the real run actually found).

Resolved by the tanto-sweep plan's task 7 (P7.4), a new "A measurement
task's dispatch" section in `roles/jisso.md` stating the dispatch-side
prohibition on simulation, and task 13 (P13.2), the reading-side rule
inserted into `roles/kanri.md`'s batch loop: a measurement report is read
for whether its outcome contradicts the brief's prediction, and one that
confirms every expectation gets a second look rather than a faster
approval.
