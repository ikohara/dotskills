---
id: "2e19"
title: "`roles/kanri.md:952` is stale on two counts: it still names three roster statuses, and calls the Measurements table's row singular where there are now four"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-13
---

Found by the tanto-cost run's batch E task 17 reviewer (2026-09-13),
recorded in `.tanto/tanto-cost/batch-E-report.md`, "Rulings" (landed as
written; not fixable inside this plan).

Two counts at `roles/kanri.md:952` are out of date, both landed by earlier
batches without a matching update here (task 17, batch E, is the one that
touches `templates/kanri.md` and `templates/roster.md`; `roles/kanri.md`
itself is closed after batch C):

- `templates/roster.md:16` and `:63` say a `cleared` row (task 7's fifth
  roster status) archives at the plan close alongside `dead`, `replaced`,
  and `refused`. `roles/kanri.md:952` still names only three statuses for
  that same archival move — the same "task 7 added a status, an older
  summary sentence didn't" drift issue-e18b already found at
  `SKILL.md:575`, here at a second site.
- The same line calls the ledger's Measurements table entry a "fixed row"
  (singular), where the template — after this design's section 8.4 —
  carries four fixed rows.

Not fixable inside the tanto-cost plan: `roles/kanri.md`'s passages closed
after batch C; an edit now would be an unquoted line on `skills/tanto/`.

Related: issue-e18b (the first instance of the "cleared" omission, at
`SKILL.md:575`), issue-a5e9 (the general shape — an enumeration a `P` block
changes goes stale at every other unquoted site).
