---
id: "b6cb"
title: Kanri hands over at every plan close, without a threshold and without asking
status: accepted
supersedes: []
superseded_by: null
amends: ["de63"]
amended_by: ["eee2", "5ec7"]
created: 2026-09-10
updated: 2026-09-14
---

## Context

req-04f5 requires that a resident Kanri's context cost does not grow with its
tenure, and that whatever resets it is a planned step and never a decision
left to the human. decision-de63 made Kanri resident with a handover fired
by two signals, the human's word and a compaction the session notices;
issue-40ed asked for a count or reading threshold as a third, and the
context-cost design (2026-09-09) built the instrument — the transcript
reading — and the archive the threshold would be read from.

The data arrived faster than the threshold. Three handovers ran in three
days: one on a noticed compaction (2026-09-07, at 8.6 MB of transcript), two
on the human's word for cost (2026-09-09, at 2.9 MB and again at a plan
close); the fourth, at the context-cost close on 2026-09-10, found the
session at 5.3 MB and 49 wake-ups with no compaction, and the human answered
the handover question "yes" for the fourth time, then asked why it was a
question at all. Every wake-up re-reads the session's whole context, so a
resident Kanri's per-turn cost is its age; a plan close is the moment with
nothing in flight and the record complete; and the readings had already
shown the cost sits in context size, not in the count of turns.

## Options

- **A threshold on the reading**, chosen once the archive holds enough
  sessions (issue-40ed's handover half): principled, but it waits for data,
  and any number chosen would fire at or before the plan close in practice.
- **Ask the human at every plan close**, as the residency line did: one
  question per plan, answered "yes" four times out of four, and a question
  the requirement says the human should not have to answer.
- **Hand over at every plan close**, without a threshold and without asking;
  the two standing signals stay for the mid-plan case.

## Decision

Hand over at every plan close. The plan close becomes the third trigger and
the ordinary one: after T2, the merge decision, the peers' deletion, and the
archive move, Kanri runs its own exit shoroku, writes the handover file, prints
the "Kanri hands over" line, and stops; the human creates the successor and
deletes the old session. The human's word and a noticed compaction remain
the triggers inside a plan, at a batch boundary as before. The residency
counts stay as the record, and the reading keeps being taken — the archive
now serves the replacement threshold for peers (issue-40ed's other half), not
the handover.

This record amends decision-de63 in one part: its trigger set gains the plan
close as the ordinary trigger. Its residency, its handover procedure, and its
rejection of the token figure stand unchanged; decision-6dea's extension of
the compaction trigger to peers stands.

## Consequences

- One session creation and one deletion per plan for the human — the cost
  the human chose over answering a question per plan.
- A successor's cold start at every close: the roster, the ledger, the
  handover file, and any topic already in dialogue; measured at the
  review-brief close of 2026-09-09 as the shape that works, since state lives
  in files (req-04f5).
- A between-plans Kanri — the one that opens the next topic and runs its
  spec phase — is always a fresh session, so the spec phase starts on a short
  context; the cost of a long spec phase falls on Sekkei's seat, which the
  context-cost report measured separately.
- issue-40ed's handover half closes without a number; its replacement half
  keeps the data.
- design-4807's Handover section and `roles/kanri.md`'s plan-close row and
  trigger paragraph carry the procedure (the tanto small-items sweep, from
  2026-09-10); until they land, this record and req-04f5 are the authority.
- Related: req-04f5, decision-de63 (amended), decision-6dea, decision-f496,
  issue-40ed, the context-cost design of 2026-09-09.
