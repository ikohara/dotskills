---
id: "a331"
title: kisou's `none` bullet says all seven targets are absent, but the doc-system tally is over five
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-09-11
---

Measured at the kisou-refresh whole-branch review (2026-09-11, ruling 3),
and left outside the fix wave as a minor. `skills/kisou/SKILL.md`'s migrate
detection, the `none` bullet, says "all seven targets are absent"; the
`none` / `partial` / `full` tally it belongs to is over the five managed
artifacts — `docs/AGENTS.md` and the four per-type `AGENTS.md` for
`requirements`, `design`, `decisions`, and `issues` — and the two flat
copies, `notes` and `reports`, sit outside the tally by the same step's
own wording. So a repository holding only `docs/notes/AGENTS.md` classifies
`none` with six `create` items, and the bullet's "seven" is wrong for it.

The fix is one word in the bullet — "all five" — or a clause that the two
flat copies are counted separately.

Related: req-1a2b, design-c1d2 (the three-state detection; the flat copies
outside the tally).
