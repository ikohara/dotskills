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

A fourth residency data point, 2026-09-09: the successor Kanri (`dotskills-8c`)
closed one plan — 3 batches, 1 plan close, 0 compactions — in under a day, at
2.9 MB and 851 transcript records, and handed over at the plan close on the
human's word, so that the next plan starts on a short context. With the idle
subscriptions gone its wake-ups were on the order of thirty, a tenth of its
predecessor's, which puts the weight of the cost signal on context size — the
plan's cold read above all — rather than on the wake-up count.

The instrument, 2026-09-09. The context-cost design (its T1) delivers the
measurement and not the number: every session takes a **reading** of its own
transcript — bytes, records, wake-ups, compactions — at its boundaries and
sends it with the lines it already sends; the roster's Residency becomes a
table of those readings, and at each plan close the rows of dead, replaced,
and refused sessions move to an untracked `roster-archive.md` next to the
roster, whose rows across runs are the dataset this threshold is read from.
Because that archive is untracked and local, each plan's dogfood report under
`docs/reports/` carries the rows the archive gained, so the dataset survives a
workspace wipe. Two corrections to the figures above: a wake-up is a user
record **without** a tool result, so the 618 of the kanri-lifecycle Kanri is
84 wake-ups (the rest were tool results), and the 394 and 851 are record
counts of the same kind; the readings from here on use the corrected form.
This issue stays open, blocked on the data, until enough sessions have ended
for an ADR to choose the number — or to decide that none is needed. Whether
bytes and records are comparable across hosts stays open too; on one host the
sessions are compared with each other.
