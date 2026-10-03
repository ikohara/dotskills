---
id: "e18b"
title: "`SKILL.md`'s roster-archive Artifacts row names three roster statuses where there are now five"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-10-03
---

Source: session 2026-09-13

Found by the tanto-cost run's batch B task 8 reviewer (2026-09-13), recorded
in `.tanto/tanto-cost/batch-B-report.md`, "Rulings needed" and "Parked and
deferred minors".

`skills/tanto/SKILL.md:575`'s Artifacts table names `roster-archive.md`'s
content as "the roster's dead, replaced, and refused rows" — three statuses.
Task 7 of the tanto-cost plan (batch B) added a fifth roster status,
`cleared`, for a Kikaku or Hosa row replaced after `/clear`. The Artifacts
row was not updated to match, because `SKILL.md` is touched by batch B alone
under the tanto-cost plan and no later task revisits it; editing the row now
would add an `unaccounted-added` line on a path where the plan's own rule
makes any such line a defect (the passage grammar; see design-4807). The
templates that actually do the archiving are current:
`templates/kanri-handover.md` and `templates/roster.md` are touched by task
17 and 18, and task 17's own text says "replaced, refused, or cleared moves
to `roster-archive.md`".

So the drift is one sentence, in one summary table, and does not affect
behavior — the templates it's summarizing are correct. Kanri (tanto-cost
R-24) ruled to carry this as an issue rather than authorize an off-plan edit
mid-run, matching the discipline the plan's own passage rule enforces.

Fix: one line in `SKILL.md`'s Artifacts table, adding `cleared` to the
enumeration. Small enough for the hotfix lane between batches or plans, or
the next plan that touches `SKILL.md`.

Related: issue-a5e9 (the general shape — an unquoted enumeration site goes
stale when a `P` block changes the enumeration elsewhere in the same file).

Resolved by "docs(tanto): re-synchronize six enumerations and copied strings" — found by the tanto-issue-triage liveness check, 2026-10-03.
