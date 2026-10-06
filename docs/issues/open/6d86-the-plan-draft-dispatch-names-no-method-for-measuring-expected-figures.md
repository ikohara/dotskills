---
id: "6d86"
title: "the `plan.draft` dispatch names no method for making a plan's `Expected:` figures measured"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-07
updated: 2026-10-07
---

Source: inbox 2026-10-06-plan-draft-method-and-fix-wave-cost

`roles/keikaku.md` tells Keikaku to dispatch `plan.draft` to write the plan
from the spec with superpowers writing-plans, naming the four block shapes
and the `replay-skip:` declarations. It names no method for making the
plan's `Expected:` figures. The nearest text is `roles/kanri.md`'s rule that
a fix-wave list is drafted under the same conditions as a plan — run each
command once before dispatching it — which asks for the check without the
method.

Measured in one run: the drafter (opus) copied the tree with `git archive`
into its own throwaway git repository, ran the project's offline dependency
sync there, applied each task's code and tests in order, and recorded the
red run, the green run, the suite count, and the lint run per task. The
plan's expected counts (a suite going from 766 to 962) were therefore
measured, not predicted. Across five batches every task reproduced its
expected counts exactly, the timing-sensitive tasks included; the only misses
were two sentences of prose describing a state a later step changes, and the
one defect class that got through was the plan's fences, which the method
does not exercise. The draft cost about 2 hours, 344 tool calls and 845,000
subagent tokens for 17 tasks and 8,062 lines; the plan review 15 minutes, 32
tool calls and 440,000 tokens.

The tanto-feedback plan's own Part A drafter used the same method in a
scratch directory (`docs/notes/authoring-a-passage-plan.md`, the parallel
drafting entries).

The decision to take: whether `roles/keikaku.md`'s `plan.draft` dispatch
carries the method for a code plan — apply each task, in order, to a scratch
copy of the tree, recording the red run, the green run, the suite count and
the lint run, so every `Expected:` figure is measured — with the note that
the plan's fences are what it does not exercise.
