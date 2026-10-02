---
id: "5a68"
title: "`boundary.js record` validates no ledger schema: a drifted heading fails the whole atomic write, an unrecognized `S-n` column is written blank"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: inbox 2026-09-25-record-fails-or-blanks-on-schema-drift

`scripts/boundary.js`'s `record` writes a ledger and a roster in one atomic,
all-or-nothing act, with no check of the ledger's table shape against the
current `templates/kanri.md` first. Two failure shapes follow, both
confirmed against the script by the reporter:

1. **A missing expected row or heading fails the whole call.**
   `writeCellEntry(ledger, MEASUREMENT_ROW, …)`, on `record`'s
   `--kanri-reading`/`--jisso-reading` path, keys the Measurements
   opening-context row by the literal `"Kanri's context at the topic's
   opening"`. A ledger without that row, or whose `S-n` or Batches tables
   carry a heading the template has since renamed, fails that boundary's
   whole write — and the boundary-verify verdict reports it as a bare
   `fail`, indistinguishable from a defect in the batch's work.
2. **An unrecognized `S-n` column is written blank, silently.**
   `sItemCells` builds an `S-n` row's cells from a fixed map — `S-n`,
   `Source`, `Item`, `Destination`, `Adopted`, `Written` — plus one
   exception, `RETIRED_COLUMN` (`Stage`), mapped to `"t2"`. Any other column
   the ledger's header carries falls through to `""`: the cell is written
   blank, exit 0, no diagnostic.

Reproduction: a ledger whose `S-n` header reads
`| S-n | Source | Candidate | Destination | Adopted | Written |` (the old
`Candidate` for `Item`), then
`node scripts/boundary.js record --ledger <fixture> --roster <roster fixture> --s-item "some source | some item text"`
— exit 0, the item's text dropped. And a ledger with no
`Kanri's context at the topic's opening` row, with `record` given both
readings and a `--batch` naming an existing Batches row — the whole write
fails, with nothing distinguishing a stale schema from a failed batch.

Proposed (the reporter's): validate the ledger's table shape — heading
names, the `S-n` column names, the `MEASUREMENT_ROW` row — against the
current template before writing, and report a mismatch as its own line; or,
short of that, have `sItemCells` warn on any unrecognized column instead of
returning `""`.
