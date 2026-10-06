---
id: "d831"
title: every planned session exit carries its own shoroku, ruled by Kanri as the human's delegate
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: ["ce83", "d538", "ded8", "9162", "7a19"]
created: 2026-09-07
updated: 2026-10-06
---

## Context

The tanto design of 2026-09-06 bound the shoroku write-out to plan phases:
T0 before Sekkei exists, T1 after the plan commit, T2 after the final batch.
Only Jisso, at T2, wrote out what it had learned; Sekkei was deleted after
T1 and Kaiseki after its report, and whatever they held that no report
carried — a rejected alternative and its reason, a fact measured in the
dialogue, a defect noticed on the way — died with the session. On the first
run the human set the requirement the other way (req-04f5's docs bullet as
updated on 2026-09-07, spec input I-6): every planned exit of a session, in
any role, carries its own shoroku before the session is closed, and an exit
forced by a failure says what was lost.

Two constraints shaped the answer. Jisso and an attached Kaiseki cannot
reach the human, because the human's counterpart is Kanri. And putting the
human on every candidate of every exit would undo the interrupt budget
decision-1f5f set for T2.

## Options

- **Keep shoroku bound to the plan phases** and have Kanri harvest a peer's
  candidates from its reports at the batch boundary. Cheapest, and it loses
  exactly what is not in a report: the dialogue's roads not taken, and
  anything measured after the last report.
- **Every planned exit carries its own shoroku, on decision-1f5f's split**:
  the exiting session proposes to a file, Kanri rules item by item as the
  human's delegate and answers in a second file, the session applies the
  accepted subset, commits once in a slot Kanri gives it, and only then is
  the human asked to delete it. Kanri's own exit and a standalone Kaiseki
  have no second session to rule them and rule on themselves, with the human
  in the room.
- **The exiting session runs `shoroku` in its ordinary mode**, the human
  answering the direction prompt directly. Rejected by construction for
  Jisso and an attached Kaiseki, which have no human access, and it puts the
  human back on every item for the roles that do.

## Decision

The second option. Every planned session exit carries its own shoroku,
ruled by Kanri as the human's delegate. Kanri escalates to the human, as one
numbered list, an item that adds to or changes a requirement or an ADR, and
any item it is unsure about; everything else — design, issues, notes,
reports — Kanri decides and the human sees in the commit. An exit whose
candidates carry neither kind asks the human nothing.

The mechanism is T2's split, unchanged in shape: `exit-<role>[-<suffix>]`
proposal and direction files where the role's other files live, one commit
by explicit path whose subject begins `docs: exit shoroku`, and Kanri's
verification of the diff before the delete request. The conductor ledger's
candidates table gains a Written column and exit stage values, so every
write-out, T2 included, writes only adopted rows not yet written. An
attached Kaiseki commits once, at its exit, and only the accepted subset
under `docs/`, which retires the previous design's "Kaiseki never commits,
never writes docs". A session that has not answered its exit lines when its
idle notice arrives is past answering: the exit is forced, and the roster's
Events line says its shoroku did not run and what was lost as far as Kanri
knows. Kanri's own exit is the first step of its handover; between plans its
candidates live in the roster and its commit lands on `main`.

## Consequences

- Each planned exit costs one boundary: Jisso idles while another session
  proposes, is ruled on, and commits.
- The self-ruling at Kanri's own exit carries decision-1f5f's known risk in
  a sharper form: a misclassification is not caught by a second session
  before it lands, and the mitigation is the same single reviewable diff.
- Kaiseki's tree discipline narrows from "never commits" to "commits only
  its exit shoroku"; its instrumentation rule is unchanged.
- The Written column makes the ledger the record of what reached `docs/`
  and lets T2 stay complete without writing anything twice.
- The first run under this decision (2026-09-07) exercised Sekkei's exit
  (ten candidates, one escalated) and Kanri's own; the rule held without a
  question to the human on the design, issue, and report items.
- design-4807 records the new current state at T2; this ADR holds the
  reasoning and the two roads not taken.
