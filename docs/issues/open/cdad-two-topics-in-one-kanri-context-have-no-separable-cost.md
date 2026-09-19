---
id: "cdad"
title: two topics in one resident Kanri context leave no instrument separating their shares
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku bug-report-hold S-55

Rule 4 lets a second topic open once every open topic has passed its spec
stage, and every peer message from **either** topic lands in the same resident
Kanri context. A single ceiling check's `context=` figure is therefore a sum
over both topics, with no way after the fact to attribute the growth to one or
the other.

Measured: one tenure ran exactly that shape — one topic in its batch phase,
another in its plan stage — and went from `context=132416` at handover receipt
to `255421` at a batch boundary, Δ≈123005. Of that, three messages belonging to
the *other* topic (a plan review, a review-ready, and a plan-accepted line)
were pure bookkeeping unrelated to the batch-verification cost the figure is
usually read as. Nothing in the run separates the two shares.

Two answers, and the choice is a measurement-design decision rather than a bug
fix: a per-topic breakdown of a resident Kanri's context growth, or a stated
rule that a ceiling check's `context=` is read as a sum under rule 4 and not as
one topic's cost. `tanto-diet`'s Sekkei should find this filed rather than
re-derive it from a ledger.

Alongside issue-6c44 (deferred — a queued window's own idle cost is
unmeasured).
