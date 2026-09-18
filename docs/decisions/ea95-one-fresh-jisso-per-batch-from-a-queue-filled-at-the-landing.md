---
id: "ea95"
title: one fresh Jisso per batch, from a queue of N = batches + 1 filled at the landing, in fixed rotation
status: accepted
supersedes: []
superseded_by: null
amends: ["6dea", "eee2", "f496"]
amended_by: []
created: 2026-09-18
updated: 2026-09-18
---

## Context

A Jisso that carries a whole plan grows through every batch, and the run's
answer until now was to notice a symptom — a compaction, a ceiling crossing —
and replace the seat at the next boundary. That leaves a decision at every
boundary and a human request at an unpredictable moment. req-04f5 asks instead
that the sessions a plan needs be opened while the human is present, and that a
seat that waits hold the minimum context.

## Options

- **A queue of fresh Jissos, one per batch, in fixed rotation**, filled at the
  plan's landing, with the queue doubling as the spare for a Jisso lost
  mid-batch.
- **A Jisso standby** — one spare window plus a detection mode at each
  boundary; the boundary decision survives.
- **A ceiling-governed rotation** — replace on the measured ceiling; the
  boundary decision survives in another form.
- **A create request for a gone Jisso** — ask the human at the moment of loss,
  where the queue need not.

## Decision

One fresh Jisso per batch, from a queue of N = batches + 1 filled at the
landing; fixed rotation; the queue is the spare for a Jisso gone mid-batch (the
seat-lineage decision file of 2026-09-16 §2; the design spec of 2026-09-17,
Q3 = (i)).

**This ADR amends three accepted ADRs.**

- decision-6dea: its "one compaction in Jisso's reading means replacement at
  the next batch boundary" no longer has a case — every Jisso is replaced at
  its boundary. The rule stands for Sekkei, Keikaku and Kaiseki.
- decision-eee2: its "Kanri and Jisso are its subjects" becomes Kanri alone.
  Jisso's line is still measured and kept, and whether `ceiling.jisso` earns
  its keep is issue-6620.
- decision-f496: its "Jisso within a plan" reuse note ends — a Jisso is reused
  across nothing. The Sekkei rule the ADR is named for is untouched.

## Consequences

- Every batch starts on a cold seat, and the plan's cold-read cost is paid N
  times rather than once; the trade is that no boundary carries a replacement
  decision and no request reaches the human at an unpredictable moment.
- **A skill-editing plan cannot refill its queue mid-plan.** Under rule 11
  (decision-5c8e) a plan that names its final boundary as the only safe one for
  a start or a replacement cannot open a Jisso window mid-plan, so its create
  request at the landing asks for the **full** N. A Jisso lost on such a plan is
  a ruling put to the human, not the routine "one more window".
- The queue is the spare, so a seat lost mid-batch costs the rotation one
  window rather than a human round trip.
- A `queued` window is idle for hours; what the editor pays for N of them is
  unmeasured and is issue-6c44.
