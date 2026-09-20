---
id: "de63"
title: Kanri is resident across plans and hands over at a boundary
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: ["6dea", "b6cb", "eee2", "0775"]
created: 2026-09-07
updated: 2026-09-20
---

## Context

The tanto design of 2026-09-06 gave Kanri a default lifetime of one plan, on
two grounds: a plan's reports and rulings fill one context budget, and a fresh
Kanri's cold read of the roster and the ledger is one more test that the
files are self-contained. When the first plan closed, the skill told its Kanri
it could be deleted. The human then set the opposite requirement (req-04f5,
"Kanri is resident and hands over before it decays", 2026-09-06): Kanri stays
for as long as its session lasts, spanning plans, and a replacement is a
planned step at a boundary, never a mid-batch loss. issue-77a1 recorded the
gap.

## Options

- **One plan per Kanri**, the previous default; continuity is lost at every
  plan end and the human recreates the conductor each time.
- **Resident, with a handover procedure** fired at a boundary by a signal the
  session can see: the human's word, or a noticed compaction.
- **Resident with no handover**, relying on the recovery path after a session
  dies; loses whatever the ledger did not hold at the moment of death.

## Decision

Resident, with a handover. A plan's end is a boundary like any other: the
next topic gets a new ledger under the same roster, and Kanri prints a
residency line as information. Kanri's only exit is the handover: its own
exit shoroku first, then `.superpowers/sdd/kanri-handover.md` written from
a template (why, what is in flight, the live peers, the open questions, the
rulings the next batch inherits, the residency line, the next step, what
could not be reconstructed, the human's two commands), then the "Kanri hands
over" line, and it stops. The successor's Start takes the Handover case:
cold-read, rewrite the roster with itself first and the old row `replaced`,
tell every live peer its address with a `kanri-address:` line, delete the
handover file, ask the human to delete the old session, and continue at the
handover's next step. Two signals fire it, checked at every boundary: the
human's word, and a compaction the session notices. Not used: the tokens-left
figure the harness prints, whose meaning is undocumented, and a batch or
plan count, for which there is one data point (issue-40ed). The roster's
Residency line is the only cross-plan counter. Timing is boundary-only:
never mid-batch, and a handover that is due stops the loop before the next
prompt.

## Consequences

- The roster outlives every plan and gains a Residency line and a
  between-plans candidates table; a ledger is still deleted with its plan.
- A successor must announce its address, because under decision-73c3 an
  address dies with its session.
- A role started while the skill it runs is being edited in place reads a
  half-edited skill; a skill-editing plan therefore names the boundary from
  which a replacement is safe (issue-4ac3).
- The self-containment test the one-plan default gave for free now happens
  only at a handover; the ledger and the roster are written as if for a cold
  reader anyway.
- A declined handover leaves its trigger counted, so the record shows how
  often the signal fired.
