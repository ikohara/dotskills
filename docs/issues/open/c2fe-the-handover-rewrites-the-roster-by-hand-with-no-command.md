---
id: "c2fe"
title: The handover rewrites the roster by hand, with no command
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-102

The handover case says "rewrite the roster" and gives no command for it: the
Kanri row, the Residency row, and the Events line are edited by a script of
the successor's own. In the run-owned-seats run the first such script wrote
the row's Transcript and cwd paths with their backslashes collapsed, which the
census would have read as a different seat; the row was rewritten by copying
the predecessor's row and substituting the three fields.

A `boundary.js record --handover <predecessor sessionId>` that writes the
successor's row, marks the predecessor `replaced`, and resets the Residency
row would take the step out of free-hand Markdown editing, as `record --seat`
took the spawn rows out.

Kin: issue-f07a (the escape-corrupted handover row) and issue-dfb3.

Carrier topic: `roster-ledger` — `record` would write the handover's three
rows as it writes the spawn rows.
