---
id: "e29c"
title: a hold ruling made in one topic's ledger is not mirrored into the held topic's ledger
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-8

`bg-seat-ergonomics`'s R-7 and R-8 re-held `experience-layer`'s Sekkei
create request behind `bg-seat-fixes`'s spec review, but
`experience-layer`'s own ledger R-1 still read "Lifted 2026-09-23… live
again", with no trace of the re-hold, until a Kanri noticed the discrepancy
while preparing to ask the human to queue that Sekkei and added an R-2 by
hand. A Kanri reading only the held topic's ledger — the natural place to
look before asking the human to act — would have acted on stale
information.

Nothing in the contract makes one topic's ruling write into another topic's
ledger. The rule to decide: a hold ruling that names another topic is
mirrored into the held topic's ledger at the moment it is made — a line in
`roles/kanri.md`'s Ask table, or a note.
