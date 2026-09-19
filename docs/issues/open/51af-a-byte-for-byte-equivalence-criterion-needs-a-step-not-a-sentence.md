---
id: "51af"
title: a "byte-for-byte with the old tool" criterion needs a step, not a sentence — a plan replacing a working tool should run the differential itself
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-19
---

Source: session 2026-09-13

Found by the plan reviewer of the tanto-cost run (2026-09-13), reading
`docs/superpowers/plans/2026-09-12-tanto-cost.md`; recorded in
`.tanto/tanto-cost/plan-review.md`, "Shoroku candidates", under the lead
"**A \"byte-for-byte with the old tool\" criterion needs a step, not a
sentence.**"

Task 2 replaces Kanri's hand-written `awk` frame command with a subcommand and
names byte-for-byte equivalence with the old tool as its acceptance criterion.
It provides no command that compares them. A criterion nobody runs is a
criterion carried by whoever reads the task next.

The reviewer measured that the differential is cheap: **one line over the nine
plans of this repository's corpus**, and its premise holds — each of the nine
carries exactly one `[steps:]` marker per `### Task` heading, with three plans
writing their tasks at two hashes. That is a step a plan can hold; it was
simply never written as one.

The rule this argues for: when a plan replaces a working tool, the
differential run against the existing corpus belongs in the plan as a step,
with the corpus named and the comparison stated as a command. An equivalence
claim is a check, and a check is a step.

Adjacent but distinct from issue-5e30, which is about a Verification item and
the step implementing it drifting apart: here there is no step to drift from.

Related: issue-5e30, issue-ac9d and issue-5e47 (the `awk` frame command this
task replaces), issue-f208 (the same section's other drafting constraint).
