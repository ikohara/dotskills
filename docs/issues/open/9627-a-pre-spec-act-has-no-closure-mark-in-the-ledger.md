---
id: "9627"
title: a pre-spec act Kanri rules before the spec has no closure mark in the ledger, so a spec can build on a result that does not exist yet
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-09-19
---

Source: inbox 2026-09-11-tanto-pre-spec-act-closure

Kanri may rule, before Sekkei's spec, that some act — a diagnosis, a crash
dump analysis, a measurement — is a pre-spec act whose result lands in a
named file under the topic directory (`R-n` in the conductor ledger). Nothing
then says whether that act is closed. `templates/kanri.md`'s Progress line is
free text, the act's result file is named only inside a ruling, and
`roles/kanri.md`'s Start step 6 and batch loop have no slot for a pre-spec
act's closure. So the spec can refer to "the finding" as an input while the
file does not exist, and the run discovers it at Sekkei's spec review, not
at the ledger.

Reported 2026-09-11 by the Kanri of the mpm-playground-console repository
(inbox `2026-09-11-tanto-pre-spec-act-closure.md`): two pre-spec acts had no
result yet — the executor's finding file did not exist, and a dialogue
item's Result read "pending" — while the spec's forward-looking prose treated
both as done; the spec review caught it (its finding H-1 and its shoroku
candidate "a pre-spec act with an unfilled result silently becomes a plan
blocker").

The fix, in the reporter's words: a convention plus one template line. A
pre-spec act is not closed until its result file exists; the ledger's Plan
section (or the Progress line) lists each open pre-spec act as
`<act> — result: <path> (absent | present)`, and Kanri rewrites it when the
file lands. Sekkei's spec-review checklist — the "inputs read" line — then
has something to check against, and the review brief's unsettled section can
name an open act.

Touches `templates/kanri.md`, `roles/kanri.md`, and `roles/sekkei.md`, so it
runs under contract rule 11 with a tanto plan — the `.tanto/` workspace move
(issue-0b97) or the Keikaku split (issue-3c7a).
