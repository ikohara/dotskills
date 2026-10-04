---
id: "3d01"
title: a plan that has Kanri amend a value in the batch prompt has no slot for it
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: inbox 2026-10-03-batch-prompt-has-no-slot-for-kanri-amendment

A plan sentence that has Kanri amend a value "in the batch's prompt" has no
slot in `templates/batch-prompt.md`, whose two `<Kanri fills>` lines are the
verdict's ruling line and the Rulings section's first line, neither meant for
a ruling the plan assigns to Kanri. In one run a plan had Kanri amend the
creation and update dates of three tasks' texts, written with one day's date
for tasks landing the next; the rendered prompt carried no such line, the
Jisso kept the plan's date, the miss reached the boundary as a ruling needed,
and the fix cost a seventeen-file edit in the fix wave.

Reproduction, against an inline fixture: a plan task holding
`Kanri amends the date 2026-10-02 to the run date in this batch's prompt.`;
render the batch prompt from the template; the only fillable slots are the
two `<Kanri fills ...>` lines, and nothing in the template or
`roles/kanri.md` says where the amendment goes.

Either a plan writes no literal date for a text that lands on a later day
(Keikaku's side), or the boundary brief greps the plan for "Kanri amends" and
lists each match in the ruling lines (the render's side); the skill picks one
and says so in the matching file. Kin issue-8f5a and issue-2f88.

Carrier: Kept.
