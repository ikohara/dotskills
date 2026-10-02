---
id: "db0c"
title: "the ceiling's only growth term is the batch count: a plan-stage tenure crosses it unseen, and a batch's cost scales with its dispatches"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-03
---

Source: shoroku experience-layer S-43

`roles/kanri.md`'s ceiling (Handover, signal 4) is the seat's first-turn
context baseline plus `ceiling.kanri.batches` batches of
`ceiling.kanri.per_batch`. Its only per-tenure growth term is the batch
count. Four measurements of the gap:

- **A plan-stage tenure crosses it unseen** (S-43). One Kanri tenure ran
  `experience-layer`'s whole spec → plan → cold-read arc in one session with
  no compaction, its context growing from 137,188 at the topic's opening to
  402,605 at the plan's landing (2026-09-30). The ceiling trigger is what
  ended it, not a compaction. Between those readings lay one topic's whole
  spec and plan stage, several unrelated bug-report bursts, a
  `/tanto fukki` recovery and a Sekkei/Hosa handshake pair — a large span
  for the `batches`/`per_batch` derivation to absorb, during stages with no
  boundary reading to catch growth early.
- **The landing steps name no check before the first prompt** (S-44). Signal
  4 is checked at the start of every turn while no batch is in flight, so the
  check should come before batch A's prompt is written. That tenure took its
  reading only after batch A's prompt was written and its Jisso spawned,
  found `ceiling: over`, and so hit the "never mid-batch" bar: the handover
  was due but barred until batch A's boundary. Nothing was lost, but
  "When the plan lands" does not say "take this reading, and check the
  ceiling, before step 4"; step 2's reading reads as Measurements
  bookkeeping. A sentence naming the ceiling check before step 4 would catch
  it.
- **A batch's cost scales with its dispatches** (S-92). The batch-D Jisso
  read `context=419327` at its boundary against `baseline=85242` and a
  `per_batch` of 65000: one four-task batch with sixteen dispatches and two
  fix rounds consumed about 334,000 tokens above baseline, where batch C (one
  task, one recommender dispatch, two reviews) consumed about 111,000
  (`context=197283` over `baseline=85761`). `per_batch` is one number; a
  batch's real cost scales with its dispatches, not its task count.
- **A ledger-heavy, batch-light tenure**
  (inbox 2026-09-25-ceiling-batches-undercounts-ledger-heavy-tenure). A
  tenure that accepts zero batches can still cross the ceiling: accepting a
  handover (the handover file and the whole roster), ruling once on an open
  topic (its whole ledger), and reading another topic's plan-landing
  materials (its ledger, the plan's stage-1 frame, its cold-read report) are
  ordinary Kanri work the formula does not model. With several topics open,
  as `SKILL.md` allows, this shape is routine. Reproduction: run those three
  acts in one tenure with no batch, and compare
  `node scripts/reading.js <transcript> --role kanri` against
  `baseline + batches × per_batch`. The reporter proposes no one-sentence
  fix: a second growth term (per turn or per ruling), or a "ledger-heavy"
  ceiling variant for several open topics.

Related, not duplicates: issue-40ed, and the two reports the inbox copy
names on the same formula (the final batch's own consumption, and a wake-up
mid-decision). Issue-fb90's finding 5 — the baseline counts the first turn,
not the forced cold read — belongs here too.

Serves exp-19c1 (tanto-issue-triage, 2026-10-03).
