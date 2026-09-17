---
id: "a8c2"
title: "the `shoroku.recommend` kind reads only named `S-n` sources, silently missing a batch report's own uncopied candidates"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

The `shoroku.recommend` kind reads only the sources it is named against
(typically the ledger's own `S-n` table), not every batch report on disk. If
nobody has copied a batch report's own "Shoroku candidates" section into the
ledger's `S-n` table first, the recommender silently misses those items —
there is no cross-check that a batch report's candidates section was ever
transcribed.

Measured in kuchidome's `residency-retention` run (M6b): the fix-wave
batch's own report carried four shoroku candidates that sat uncopied from
that batch's acceptance through a full Kanri handover, caught only because
Jisso's own T2 exit proposal happened to flag the gap as a process-safety
check. Nothing in the ordinary batch-loop or handover procedure would have
caught it otherwise.

Proposed fix: either the batch-acceptance step itself copies a report's
Shoroku candidates section into the ledger's `S-n` table before the boundary
is marked accepted, or the `shoroku.recommend` dispatch is told to read every
accepted batch report on disk (not only the ledger's own table) so an
uncopied candidate is not silently dropped.

Reported by Hosa `kuchidome-6b [d17de0]` from `C:\Users\0000105523\devel\kuchidome`,
2026-09-15 (delayed in transit — original addressee no longer live; relayed
by this repository's own Kanri 2026-09-17).
