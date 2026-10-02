---
id: "d13d"
title: a rework prompt overwrote the original at the same path, and the Jisso read it as a duplicate
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-10-03
---

Source: shoroku bg-seat-ergonomics S-39

No rule names a rework prompt's path. `roles/jisso.md` says a rework "comes
back to you as a prompt for the same batch", `roles/kanri.md` says the Jisso
"stays live for the rework prompt", and the Artifacts table knows
`batch-<X>-prompt.md` only.

In the bg-seat-ergonomics run, Kanri rendered batch B's rework over
`batch-B-prompt.md`. The Jisso, holding the original in memory and seeing the
`batch:` line arrive from a different Kanri name (a handover had happened in
between), judged it a duplicate without re-reading the file and replied
pointing at its already-sent report, until the real rework instruction
followed. No work was lost or duplicated, but the overwrite destroyed the
original prompt, which the topic directory exists to keep.

The fix the Kikaku decision `2026-09-24-bg-seat-fixes.md` item 1 assigns to
`bg-seat-fixes`: a rework prompt is `batch-<X>-rework-<n>-prompt.md`, `<n>`
from 1, rendered from the same template, named in the ledger's Batches row
and in the Artifacts table, never overwriting the original; and
`roles/jisso.md` says that every `batch:` line is read from disk, whatever its
path, before anything is judged a duplicate.

The run's second render-then-send defect, a prompt shipped with its slots
unfilled, is issue-8f5a.

Resolved by "docs: Jisso reads every batch: file from disk and bounds a dispatch that hands back nothing" — found by the tanto-issue-triage liveness check, 2026-10-03.
