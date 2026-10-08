---
id: "b4e7"
title: "a data point on how large one fix dispatch can usefully get"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-10-08
---

Source: session 2026-09-17

Not a defect — a data point on dispatch granularity, measured in kuchidome's
`residency-retention` run (M6b), worth citing the next time "how big can one
fix dispatch get" comes up against the skill's own standing rule against
one-dispatch-per-finding.

An 11-finding, 19-file, two-area whole-branch-review fix wave was dispatched
as **one** `task.implement` subagent. It completed cleanly in a single pass
(two commits, roughly 250K subagent tokens, no blocked items), and the one
scoped re-review this wave got caught every substantive issue there was to
catch. This is a larger scale (11 unrelated findings in one dispatch) than
the skill's rule against per-finding dispatches has previously been
evidenced against.

Reported by Hosa `kuchidome-6b [d17de0]` from `C:\Users\0000105523\devel\kuchidome`,
2026-09-15 (delayed in transit — original addressee no longer live; relayed
by this repository's own Kanri 2026-09-17).

Resolved 2026-10-08 at roster-ledger's close: not a defect — its figure (eleven findings, nineteen files, one `task.implement`, about 250k tokens, one scoped re-review) joins the fix-wave section of `docs/notes/authoring-a-passage-plan.md` as a second reading of dispatch size.
