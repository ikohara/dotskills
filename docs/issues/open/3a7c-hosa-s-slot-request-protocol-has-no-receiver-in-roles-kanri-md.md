---
id: "3a7c"
title: "Hosa's `slot-needed:` / `slot:` protocol has no receiving rule in `roles/kanri.md`, so a Hosa that sends it idles forever"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-13
---

Found by the tanto-cost run's batch D task 15 reviewer (2026-09-13),
recorded in `.tanto/tanto-cost/batch-D-report.md`, "Rulings" (landed as
written; not fixable inside this plan) and "Rulings needed" (part of
finding 1, the ten-form contract check).

`skills/tanto/roles/hosa.md:39-42` has Hosa send Kanri
`slot-needed: <what> — <paths>` when it needs to commit a tracked edit,
then idle for one of two replies: `slot: now — commit and report` or
`slot: at the next boundary`. None of these three message forms exists
anywhere else in the skill, and `roles/kanri.md` states no rule for
receiving a `slot-needed:` line or for answering it with either `slot:`
form — its only documented slot mechanic is the **push**, where Kanri
hands Hosa a chore with the slot already named
(`chore: <what> — <paths> — slot: now | at the next boundary`).

The consequence is concrete, not theoretical: a Hosa that follows its own
role file and sends `slot-needed:` for work it took on its own initiative
receives no reply, because Kanri has no instruction to send one. This
surfaced independently as part of the tanto-cost run's own consistency
check (the "ten canonical message forms" check task 21/22 run): of the ten
forms, `slot-needed:`, `slot: now — commit and report`, and
`slot: at the next boundary` are the three that appear zero times in
`SKILL.md` — because the receiving side was never written anywhere.

Not fixable inside the tanto-cost plan: the fix is in `roles/kanri.md`
(and possibly `SKILL.md`'s Messages section), both finished and
passage-pinned by the time this was found; any edit would be an
`unaccounted-added` line on `skills/tanto/`, the defect `diff` exists to
catch.

Related: issue-c30e (Hosa's other batch-D gap, the ungranted standing
grant — same file, same run), the tanto-cost plan's own task 21/22
findings (Kanri's "Rulings needed" on the ten-form check).
