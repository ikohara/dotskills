---
id: "c0d0"
title: "a draft-only Sekkei is woken at every commit boundary for a reply its own ledger rule already determines"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-22
---

Source: shoroku shoroku-at-close

Measured on `shoroku-at-close`. That topic's Sekkei ran under a ruling that
made it draft-only — commit nothing, because another topic held the shared
checkout — and still received `tanto-sweep-2`'s batch B boundary line under
`roles/kanri.md`'s commit window step 7 (c). It answered `nothing to commit`
with a reading: one wake-up of a fable session holding about 226k tokens of
context at the time, for a reply the ledger's own ruling made certain before
the line was sent.

Two shapes of fix, either enough: Kanri skips step 7 (c) for a session whose
ledger records it as draft-only, or the boundary line carries
`draft-only: reply not needed` so the session can answer nothing. Neither word
appears in `roles/kanri.md` today.

A cost gap, not a user-stated need, so no paired requirement.

Resolved by decision-b59a: a wake-up is spent only on a decision, and the
boundary's `committed` reply is kept only for the peers that write a
`commit-ready:` ledger event and dropped for the rest. A draft-only Sekkei
writes no such event, so it is no longer asked for a reply its own ledger rule
already determines. The second shape of fix this issue named — a `draft-only:`
annotation on the boundary line — was not needed: the event the peer does or
does not write carries the same fact, and it is written by the peer rather than
inferred by Kanri.
