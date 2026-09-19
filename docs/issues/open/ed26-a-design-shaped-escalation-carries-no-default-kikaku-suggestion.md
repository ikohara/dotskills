---
id: "ed26"
title: Kanri's escalation guidance has no default suggestion to take a design-shaped question to Kikaku
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: inbox 2026-09-16-kanri-escalation-kikaku-suggestion

Twice in one run, Kikaku read the actual source directly — not just an
escalation's prose summary — and found real gaps Kanri's own escalation and
recommendation had missed. Both times Kikaku was looped in only because the
human happened to paste the escalation into Kikaku's window. Nothing in
`roles/kanri.md` suggests this as a default step, so a design-shaped question
the human does not think to route ships on Kanri's recommendation alone,
unchecked.

The reporter's proposed shape, with a concrete trigger rather than a vague
stakes threshold: an escalation whose recommendation changes a file format, an
on-disk shape, a public interface, or an invariant's reading is
**design-shaped**, and carries, by default, a suggestion in Kanri's own words
to take it to Kikaku with the source files named — the human decides. One that
only picks a batch order, a task insertion, or a dispatch order is operational
and needs no suggestion. Not "route it through Kikaku": Kanri's role contract
never sends to Kikaku directly.

Filed rather than applied because it changes who Kanri points the human at,
which is the human's decision. No defect has shipped from the gap yet, but it
is a repeatable near-miss pattern with a concrete trigger, not a one-off.
