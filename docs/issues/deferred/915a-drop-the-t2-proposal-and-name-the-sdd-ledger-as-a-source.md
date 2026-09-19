---
id: "915a"
title: drop the T2 proposal and name the SDD ledger as a source
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-18
updated: 2026-09-19
---

Source: shoroku seat-lineage

A real design option the `seat-lineage` spec weighed and parked (its Deferred
1; the option is Q1's (c) of that dialogue, and decision-d125 records the
choice it lost to).

With one Jisso per batch (decision-ea95), the last Jisso's context is one
batch, so the "delta no file holds" it writes at T2 is the fix wave's own; the
rest of the T2 proposal is a pointer list, which is bookkeeping Kanri's
dispatch already carries. Dropping the T2 proposal entirely and naming the SDD
ledger as a source for the recommender would remove one artifact and one form
check per close.

**Why it is deferred, and the revisit trigger.** The change rewrites the
`close:` line's `proposal <path>` slot, which is pinned byte for byte across
three files that the `shoroku-at-close` work is landing. Revisit once that slot
is free to change — that is, once no in-flight plan pins the `close:` line.

A design option parked for a stated reason, not a user-stated need, so no
paired requirement.
