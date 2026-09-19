---
id: "d072"
title: a ruling that no topic ledger owns has no stated home or numbering scheme
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-15
updated: 2026-09-19
---

Source: session 2026-09-15

Observed in this repository's own run, 2026-09-15, by a Kanri whose tenure was
mostly multi-topic coordination while `tanto-sweep-2` and
`tanto-project-config` were both open. Two gaps surfaced in that tenure, and
they are one gap: a ruling that belongs to no topic specifically — a
between-plans bug-report triage, or a session-wide signal such as a
ceiling-crossed deferred-handover note — has no home and no numbering scheme
that the skill text states.

`SKILL.md`'s Bug intake says a triage is "recorded as `R-n` in the current
ledger, or in the roster's Events when no plan is open". With no ledger to
anchor the sequence, this tenure invented "Roster R-1" on the spot for
issue-a4c7's triage, unsure whether such a sequence resets per tenure,
persists across a handover, or is meant to exist at all as a namespace
distinct from a ledger's `R-n`. The practical precedent, though, was already
on record: `roster-archive.md`'s 2026-09-09 line records a between-plans
triage (issue-12d3) in the roster's Events, **unnumbered**. So an
Events-recorded ruling carries no `R-n`; "Roster R-1" was this tenure's own
invention, not a continuation of anything.

The placement half looks the same on inspection. The Handover section's prose
reads as written for a single open ledger at a time, and the ceiling-crossed
deferred-handover note was first thought to have gone into `tanto-sweep-2`'s
ledger alone (the topic whose boundary triggered the check, though
`tanto-project-config` was equally open and the ceiling belongs to Kanri's
whole session, not to one topic). In fact the roster's Events carries the same
2026-09-15 line too. The session-level location distinct from any topic's
ledger already exists in practice — the roster's Events — and the gap is only
that the skill text never names it as such, nor says whether a session-wide
signal is also mirrored into every open ledger, the most-recently-active one,
or none.

Proposed: a sentence in `SKILL.md`'s Bug intake and Handover text, or in
`roles/kanri.md`, naming the roster's Events as the home of a ruling no topic
ledger owns, stating that such an entry carries no `R-n` (the sequence is a
ledger's, and a successor Kanri neither continues nor restarts one for the
roster), and saying whether a session-wide signal is mirrored into open
ledgers at all.

Filed under `open/` rather than `deferred/`: the deferral condition the
observation itself named — "once concurrent topics are common enough to
specify for" — is already met, with two or three topics open at once since
2026-09-14. Related: issue-c3a9, issue-11db (other gaps of the same
concurrent-topic class), issue-077b (how Events are appended), issue-ac65 (a
different roster-read rule).
