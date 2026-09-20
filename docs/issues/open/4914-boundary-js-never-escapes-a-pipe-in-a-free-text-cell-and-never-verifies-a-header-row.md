---
id: "4914"
title: "`boundary.js` never escapes a `|` in a free-text cell value and never verifies a table's header row before writing into it"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku tanto-diet S-44

Two data-integrity gaps in `skills/tanto/scripts/boundary.js`, found by batch
A's code-quality review, confirmed real by independent trace, and ruled out of
that batch's scope because `record` is not used in production until the next
topic opens. The first real user of `record` — the next topic's Kanri —
should inherit them as a known limitation rather than as a silent corruption.

1. **No escaping of `|` in a free-text cell.** `row()` and `cells()` never
   escape a literal `|` in a value, so an `--s-item`, `--verdict` or
   `--deferred` value containing one silently mis-columns the row it writes.
   Not a one-line fix: escaping touches `row()`, `cells()` and every reader of
   the cells, which must unescape symmetrically.
2. **No header-row verification.** The ledger and roster table writers locate
   a table by its heading but never check the header row itself, so a column
   added to `templates/kanri.md` or `templates/roster.md` would send every
   subsequent write into the wrong cell with no error. Fixing it needs the
   expected headers carried as data beside each writer.

issue-9c6f is the roster-shape sibling: a roster's table shape is never diffed
against its template, which is the same class of silent drift seen from the
reader's side.
