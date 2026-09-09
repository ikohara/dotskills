---
id: "1f5f"
title: under tanto the shoroku Direction step is answered by Kanri as the human's delegate, and the final write-out is split into propose and apply
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: ["ace0"]
created: 2026-09-06
updated: 2026-09-09
---

## Context

`shoroku` proposes a numbered list of document changes, ends with a direction
prompt, and waits: req-3c4d makes the human's explicit confirmation the gate,
and the skill never starts a run without it. That works when one session talks
to one human.

`tanto` breaks both halves of that assumption. Its write-out happens at three
staged points across a run, not once at the end, and at the last of them the
context the write-out needs — the rulings, the parked findings, the deferred
minors, everything the batch reports compressed — is held by the executor
session, which by design talks only to the manager session and never to the
human. Meanwhile the manager holds the conductor ledger, where every candidate
has already been recorded and classified as the run went along.

So the question was forced: who answers the direction prompt when the session
that must answer it cannot reach the human, and the session that can reach the
human does not hold the material?

Doing nothing was not neutral. A run of fourteen tasks produced roughly sixty
candidates; putting every one to the human would have made the write-out the
most human-expensive step of a protocol whose whole point is that the human is
interrupted only at defined checkpoints (req-04f5).

## Options

- **(a) The human answers every direction prompt**, as `shoroku` prescribes and
  req-3c4d requires. Faithful to the existing requirement and to the skill, and
  the human sees every item. It also puts the human in the loop for design
  entries, issues, notes and reports that the manager has already classified in
  its own ledger, and it does not solve the structural problem: the executor
  cannot present its proposal to the human at all.
- **(b) The manager answers as the human's delegate**, escalating only items
  that add to or change a requirement or an ADR, plus anything it cannot
  classify with confidence. The human keeps what the project must do and why a
  choice was made; the manager decides how the system is described, what is
  broken, and what is worth freezing. The write-out is split into two rounds of
  files: the executor proposes to one file, the manager answers item by item in
  another, the executor applies the accepted subset and commits once.
- **(c) The executor proposes and the human answers directly.** Rejected by
  construction: one of `tanto`'s standing rules is that the manager is the only
  session that messages the executor, and the executor messages no one else.
  Allowing this one exception would give the executor a second source of
  instructions, which is the interleaving the one-boss rule exists to prevent.

## Decision

Option (b).

Adoption is a manager ruling at every stage of the write-out. The manager
escalates to the human, as one numbered list, exactly two kinds of item: one
that adds to or changes a **requirement** or an **ADR**, and one it cannot
classify or is unsure about. Everything else — design, issues, notes, reports —
the manager decides and records in its ledger, and the human sees the result in
the commit.

The final stage is split into three steps. The executor runs `shoroku` in file
mode over the conductor ledger up to the proposal and writes the numbered list
to a file instead of printing it. The manager rules on every item, escalates the
two kinds above, and writes its answer item by item to a second file. The
executor applies the accepted subset, lints, makes one commit, and reports; the
manager verifies the diff as it verifies any batch.

The human's confirmation, which req-3c4d requires, is preserved at two points
rather than one prompt: the approval of the plan the run executes, and the
escalated items at each stage.

## Consequences

- The human is interrupted for requirements and ADRs and for genuine
  ambiguity, and for nothing else. On the run that produced this record that
  was three questions against roughly sixty candidates.
- A misclassification by the manager now lands in a commit rather than being
  asked about. The mitigation is that the commit is a single reviewable diff
  and the manager verifies it, but the failure mode is real and is the price of
  the rule.
- The direction prompt becomes a file exchange rather than a conversation, so
  it survives compaction and a restart, and it is auditable afterwards. It also
  costs one extra round trip between two sessions.
- `shoroku` itself is not modified. The override is written into `tanto`'s own
  role files, alongside its other deviations from the skills it composes, so a
  session running `shoroku` outside `tanto` is unaffected and req-3c4d's flow
  still describes it.
- Reversing this — putting the human back on every item — would need a
  superseding ADR, because the escalation rule is what makes the protocol's
  interrupt budget predictable.
- Nothing in decision-08bc or decision-9a3a is amended; both concern the model
  configuration and are untouched by this.
