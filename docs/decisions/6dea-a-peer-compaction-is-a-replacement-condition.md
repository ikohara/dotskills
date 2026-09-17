---
id: "6dea"
title: a peer's compaction is a replacement condition, symmetric with Kanri's own trigger
status: accepted
supersedes: []
superseded_by: null
amends: ["de63"]
amended_by: ["eee2", "ea95"]
created: 2026-09-09
updated: 2026-09-14
---

## Context

decision-de63 fires Kanri's handover on two signals, the human's word and a
compaction Kanri notices in itself. For the other roles the skill had one
row, Jisso's "context decay" in the Replace table — two consecutive batches
needed escalation, or a report says the compaction lost rulings — and no row
for Sekkei or Kaiseki: a peer was replaced only once there was evidence that
its compaction had lost something. The context-cost design (2026-09-09)
gives every session a reading of its own transcript, taken at its boundaries
and sent with the lines it already sends, whose fourth figure is the number
of compactions; a peer's compaction becomes a number Kanri sees, not a loss
Kanri waits to be told about.

The case that made the difference visible is on issue-e5a2: a session in
another repository fabricated a human turn two minutes before it compacted,
and the compaction summary carried the fabrication as the human's words;
the session, its Kanri, and a research subagent acted on it until the human
doubted it. The loss was invisible from inside — no report could have said
"the compaction lost rulings", because the session did not know.

## Options

- **Evidence of loss only**, the standing rule: record the compaction in the
  Residency row and replace only when a report or an escalation shows the
  loss. Cheapest in replacements; blind to the loss that leaves no trace.
- **Jisso only**: extend the trigger to Jisso, where escalation evidence
  already exists, and leave Sekkei and Kaiseki on evidence of loss — the plan
  review's alternative.
- **Symmetric**: one compaction in any peer's reading is a replacement
  condition at that role's next natural boundary, as Kanri's own noticed
  compaction already is.

## Decision

Symmetric, the human's ruling in the context-cost dialogue (Q-3) and again on
2026-09-09 after the options were put in detail. One compaction in Jisso's
reading means replacement at the next batch boundary, exit shoroku first;
one in Sekkei's, at its next commit — a verified boundary, or, with no batch
in flight, when its work is ready; one in Kaiseki's, at its report, the
report as it stands being the recovery point. The reason is that a summary
standing in place of the conversation is itself the loss, and its size cannot
be known from inside; the evidence-of-loss condition stays as a further
ruling, not as the gate. Sekkei is included deliberately: it holds the most
of the human's own words in its context, and a summary that rewrites them
costs the most there.

This record amends decision-de63 in one part: its second trigger, a noticed
compaction, now applies to Jisso, Sekkei, and Kaiseki through their readings
as it applies to Kanri through its own. Everything else in decision-de63 —
Kanri resident, the handover procedure, the human's word as the first
trigger, the rejected token figure and count — stands unchanged.

## Consequences

- More replacements, each paying an exit shoroku and a successor's cold
  read; a compacted session is the cheap one in context terms, and the rule
  trades that for context the human can trust. The replacement waits for the
  role's natural boundary, never mid-task.
- Until the successor arrives, and for a session whose compaction is not yet
  a replacement, the items a compaction summary attributes to the human are
  written to a file, put to the human by Kanri, and acted on only once
  confirmed (req-04f5, the checkpoint bullet; the context-cost design, "What a
  compaction summary says the human said") — the rule that covers the interval
  this one leaves.
- Under contract rule 11 the rule takes effect only when the plan that lands
  it has passed its final boundary; during the context-cost plan's own batch
  A a Jisso compaction does not trigger a replacement, by the human's answer
  at that plan's review brief.
- The Replace table gains the Sekkei and Kaiseki rows and the Jisso row gains
  the reading as its first symptom; the Residency readings and the archive
  are the data from which a threshold on cost, distinct from this trigger,
  may later be chosen (issue-40ed).
- Related: req-04f5, decision-de63 (amended), decision-d831 (every planned
  exit carries its own shoroku), design-4807, issue-e5a2, the context-cost
  design of 2026-09-09.
