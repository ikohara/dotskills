---
id: "77a1"
title: Kanri is resident across plans and hands over at a boundary when its context grows long
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-06
updated: 2026-09-06
---

The human's direction on 2026-09-06, after the first plan closed: Kanri is
meant to be a resident session, conducting plan after plan until the session
itself reaches its limit, and when it gets long it should, ideally on its own
and at a good boundary, put out a handover prompt and ask the human to carry
the session over to a new Kanri. req-04f5 now states this ("Kanri is resident
and hands over before it decays"). The skill and its design say the opposite
default and need to change.

What the skill says today (design-4807, the Kanri role file): Kanri's default
lifetime is one plan; the Delete table ends with "this plan is closed; delete
Kanri, or keep it for the next plan"; the Replace table has a row for Kanri's
own context decay ("two consecutive batches needed escalation to the human, or
you notice you lost rulings at compaction") that asks to be replaced with the
roster and ledger as the recovery point; and the Start section already has the
kept-Kanri path (cold-read the roster and the ledger, mark dead rows). The
2026-09-06 design document gave the one-plan default a rationale, that a fresh
Kanri's cold read is one more self-containment check; the requirement now
outweighs it, and the Kanri that closed this repository's first plan was told
by the skill it could be deleted, which is the behavior to remove.

What has to change:

1. **Lifecycle default.** A plan closing does not close Kanri. The Delete
   table's last row becomes "this plan is closed; Kanri stays and waits for the
   next topic"; the only exit is the handover below. A kept Kanri starts the
   next plan with a new topic directory and a new ledger and keeps the roster,
   as the design already describes.
2. **A handover trigger.** Kanri needs a signal that its context has grown
   long. Candidates to measure before choosing: the token budget the harness
   states in its own reminders, if a session can read it; a count of plans or
   batches conducted since start; a noticed compaction (rulings missing from
   memory that the ledger still holds); and the human's own word. The check
   runs at every boundary, and the first reliable signal that trips it starts
   the handover.
3. **A handover artifact.** Kanri writes `.superpowers/sdd/kanri-handover.md`
   (untracked, next to the roster): what is in flight, the open questions for
   the human, the rulings the next batch inherits, the next step, and the
   numbered pasteable commands for the human: create the new Kanri with
   `/tanto kanri`, let it cold-read the roster, the ledgers, and the handover,
   then delete the old session. The successor confirms the handover in the
   roster's Events and the old row is marked replaced.
4. **Timing.** Only at a boundary: a batch accepted and the next prompt not yet
   sent, or between plans. Never mid-batch; the existing "never replace
   mid-batch on suspicion" rule extends to Kanri itself.
5. **The successor's name.** With issue-1c70's workaround in use, the successor
   renames to the repository-qualified name, and every live peer is told the
   new address, since a rename invalidates held addresses (measured
   2026-09-06).
6. **Documents.** design-4807's lifecycle section and the Kanri role file's
   Start, Replace, and Delete tables change together; the batch-prompt and
   roster templates may need a handover line. Whether reversing the one-plan
   default is recorded as an ADR is for the fix's own shoroku; the requirement
   is the human's and is already changed.

Related: req-04f5, design-4807, issue-1c70 (the name the successor takes),
issue-770d (the dogfood that surfaced this).
