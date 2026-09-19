---
id: "a9a8"
title: shoroku's recommend mode does not cross-check an exit proposal against already-pending `S-n` rows
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: inbox 2026-09-17-shoroku-recommend-mode-no-pending-sn-crosscheck

A recommend-mode dispatch over a session's exit-shoroku proposal judges each
candidate against the current `docs/` tree, which is the documented baseline.
It does not read what is **already queued** for the same close.

Measured by the reporter, in one tenure: two separate exit proposals
substantially restated facts a different mechanism had already queued for T2 —
a session's own batch or case report carries a mandatory "Shoroku candidates"
section, copied into the ledger's `S-n` table at the boundary, while that same
session's later exit proposal is written independently from the same
investigation with no visibility into what was already copied. A Jisso's exit
proposal (1 of 4 items) and a Kaiseki's (**11 of 12**) both needed this caught.
Neither time did the dispatch catch it: Kanri noticed the overlap by eye and
then instructed the dispatch, by hand, to read the ledger's `S-n` table and
reject duplicates.

Medium by measurement — 11 of 12 items would otherwise have gone into `docs/`
twice — and no duplicate content actually landed only because Kanri added the
instruction each time.

Proposed: when the source is a session's own exit-shoroku proposal, the
recommend mode also reads the calling ledger's `S-n` table for rows sourced
from the same session or topic, and classifies a duplicate as `reject` with the
reason `duplicate/superseded by S-<n> (already pending)` rather than proposing
a fresh destination. The open point is whether that sentence belongs in the
shoroku skill's own contract or in Kanri's dispatch prompt.

Alongside issue-a8c2, its mirror: the recommender missing a batch report's
uncopied candidates.
