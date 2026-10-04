---
id: "368a"
title: a shoroku `redirect` item's bug report has no named sender, so the close leaves it to the human
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: inbox 2026-10-03-redirect-items-left-to-human-to-send

The skill has a route for a defect of another repository: a report from
`templates/bug-report.md` under `.tanto/sent/`, and one
`bug-report: <path>` line to the target's intake. But the shoroku recommend
mode (`skills/shoroku/SKILL.md`), `templates/shoroku-brief.md` and
`roles/kanri.md` "Shoroku" step 4 do not name the send as Kanri's act at the
direction, although step 4 lists `redirect` among the outcomes. A recommender
then defaults to "the human sends it", and a `redirect` item is a task the
close drops: 39 of 83 items in one close.

Name the route beside the `relay` and `kaiseki` outcomes: a `redirect` item
is sent by Kanri as a bug report, one per distinct defect, and as an addendum
for a defect already reported. Who sends, and in what shape, is the decision.

Carrier: Kept.
