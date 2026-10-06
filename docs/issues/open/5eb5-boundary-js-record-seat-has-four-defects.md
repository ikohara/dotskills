---
id: "5eb5"
title: "`boundary.js record --seat` has four defects: a needless `--ledger`, one file per call, a fixed `live`, and no successor form"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-07
updated: 2026-10-07
---

Source: shoroku tanto-feedback S-20

The `record --seat <result file>` form of `skills/tanto/scripts/boundary.js`
writes a seat's roster row from a spawn result. Four defects of the one form,
each met in the tanto-feedback run:

1. **It demands a `--ledger` it does not use.** Given only `--roster`, it
   exits `boundary.js: record needs --ledger`, although the seat row it writes
   lives in the roster alone; the successor tenure wrote Keikaku's row only
   after adding a `--ledger` it did not need.
2. **It takes one result file per call.** Seating seven queued Jissos took
   seven calls.
3. **It always writes the Status `live`.** Six of those seven calls needed a
   `--status "<name> queued"` to put the cell back.
4. **It cannot write a successor Kanri's row.** A successor's row goes first
   in the roster, with the predecessor's row marked `replaced`, and the form
   has no way to say so; the successor writes its own row by hand, which is
   the path that mangled a row in issue-f07a.

Direction: accept `--roster` alone; take several result files in one call;
take the Status from the result (a queued spawn writes `queued`); and add a
successor form, such as `record --seat <result> --succeeds <sessionId>`,
that writes the new row first and marks the named one `replaced`, with
`roles/kanri.md`'s Handover case naming it.

Kin issue-20de (the row's cells) and issue-5a68 (no ledger schema).
