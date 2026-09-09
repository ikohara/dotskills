---
id: "40ed"
title: a count threshold for the Kanri handover
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-07
updated: 2026-09-09
---

decision-de63 fires a Kanri handover on two signals only, the human's word
and a compaction the session notices. A count of batches or plans since the
Kanri's start would let the handover run before a compaction rather than
after one, but there is one data point so far (a Kanri that conducted a full
plan and started a second without a compaction), so no threshold was chosen.

The roster's Residency line records, per Kanri, the batches accepted, the
plans closed, and the compactions noticed, cumulative since that Kanri's
start. Once a few Kanri lifetimes are on record, choose a batch or plan count
that triggers a handover before a compaction, or decide none is needed.

The tokens-left figure the harness prints in its reminders was rejected as a
signal: its unit is not documented as the context window and its presence is
not guaranteed.

Two more data points, 2026-09-09. The kanri-lifecycle Kanri noticed its
compaction at 8 batches and 1 plan close on its second day, at 8.6 MB and
618 wake-ups of transcript. Its successor conducted the boundary-rules plan
and the review-brief spec phase — 4 batches, 2 plan closes, 1.7 days, 5.3 MB
and 394 wake-ups — with no compaction, and handed over on the human's word
for a reason the two signals do not name: cost. Each wake-up re-reads the
whole context, so a resident Kanri's per-turn cost grows with its age, and
the human feels it as the 5-hour usage window filling across the workspaces
that run tanto. A third candidate signal, then, beside the human's word and a
noticed compaction: a cost threshold on wake-ups times context size, readable
from the transcript (issue-e5a2's method), with a handover at the next plan
close once it is crossed — cheaper than waiting for the compaction it
predicts.

Two refinements from the review-brief run, both recorded in fuller form on
issue-e5a2. First, a threshold on wake-ups **alone** under-counts: the
Account & Usage view of 2026-09-09 attributes 89% of a day's usage to contexts
over 150k and only 23% to parallel sessions, so the charge scales with context
size and the candidate signal above — wake-ups times context size — is the
right shape rather than a wake-up count with a bigger number. Second, a
resident Kanri is not the only thing that can exhaust a session's budget: an
`opus` reviewer subagent was killed mid-review by a session limit during this
run, independently of the conductor's own wake-ups. A handover trigger read off
Kanri's transcript will not see that, so the cost threshold and the handover
threshold are not quite the same instrument.
