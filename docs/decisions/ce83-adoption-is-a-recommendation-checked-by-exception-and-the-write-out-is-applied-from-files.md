---
id: "ce83"
title: adoption is a recommendation the human checks by exception, and the write-out is applied from files by a dispatched subagent
status: accepted
supersedes: []
superseded_by: null
amends: ["1f5f", "d831"]
amended_by: []
created: 2026-09-13
updated: 2026-09-13
---

## Context

decision-1f5f made adoption a manager ruling: Kanri answers `Direction?` as
the human's delegate and escalates only an item that adds to or changes a
requirement or an ADR, plus anything it cannot classify. decision-d831
extended the same shape to every planned session exit, with the exiting
session applying the accepted subset and committing, Kanri verifying the diff
before the delete request, and an attached Kaiseki committing its own exit
subset.

Both ADRs recorded the price. 1f5f's was that a misclassification by the
manager lands in a commit rather than being asked about. d831's was that each
planned exit costs one boundary, because the session that raised the
candidates must stay alive through the ruling, the apply, and the commit.
The cost work of 2026-09-12 added a third: the apply is long output written
in a resident session's context, and it was the costliest thing those
sessions did. Meanwhile the human's own requirement had moved — the human
confirms what lands without having to read every item cold, which neither
"answer sixty items" nor "trust the delegate" gives.

## Options

- **(a) The human answers every item cold**, 1f5f's rejected option. Every
  item passes the human's eyes, at the price the interrupt budget exists to
  avoid.
- **(b) The manager decides all but two kinds**, the rule 1f5f chose. Cheap
  for the human and blind where the manager is wrong.
- **(c) A recommendation the human checks by exception.** A subagent reads
  the candidates and groups them — recommended adopt, recommended reject,
  unsure — each item quoted in full; the human answers `OK` or names the
  items that go the other way.
- **(d) Each role dispatches its own recommender.** Rejected: a top-family
  context receives the text anyway, it adds two hops, and the author would be
  commissioning the judge of its own candidates.

## Decision

Option (c), applied at every stage of the write-out — T0, T1, T2, and every
exit. The `shoroku` skill's recommend half proposes and groups over the
candidate file; Kanri tells the human the path and the three counts; the
human answers `OK` or the exceptions; Kanri writes the direction file; the
skill's apply half, dispatched as a subagent, writes the accepted subset,
lints, and commits once. Kanri verifies that commit as it verifies any.

From decision-1f5f this replaces **the adoption rule**: the manager no longer
answers `Direction?` as the human's delegate, and no item is escalated apart
from the rest. What stands is 1f5f's propose-and-apply split through files —
generalized here from T2 to every stage — and its rejection, on the one-boss
rule, of an executor that answers to the human directly. 1f5f's standing
`amended_by: ["ace0"]` is untouched: 1f5f stays accepted, so that amendment
keeps its base.

From decision-d831 this replaces **four clauses**: that the exiting session
applies and commits; that Kanri rules on the items as the human's delegate;
that Kanri verifies the diff before the delete request; and that an attached
Kaiseki commits its own exit subset. What stands is d831's decision itself —
every planned exit of a session, in any role, carries its own shoroku, with
its proposal on disk before the session is deleted — and its treatment of a
forced exit, which says what was lost.

## Consequences

- Every item passes the human's eyes, and the interrupt is one grouped list
  per stage rather than a scattering of escalations.
- The session that raised the candidates is deletable once they are on disk:
  it idles through one subagent run instead of through the human's check and
  the apply, and the boundary another session's exit costs shrinks with it.
- No role but Kanri writes under `docs/` any more, and the apply's long
  output leaves every resident context.
- The Adopted column's `escalated` value loses its meaning, because every
  item now reaches the human.
- The family the apply half runs on is the first variable of the second
  measurement, since the apply is the most clerical of the twelve kinds.
- The recommendation quotes every item in full, so it stands alone as the
  apply's input and as what the human checks; the judgment of the session
  that wrote the proposal is held by that file and not by the session.
- The reasoning is the tanto-cost design of 2026-09-12; design-4807 records
  the resulting flow.
