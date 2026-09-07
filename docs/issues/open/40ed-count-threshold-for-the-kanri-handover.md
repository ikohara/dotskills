---
id: "40ed"
title: a count threshold for the Kanri handover
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-07
updated: 2026-09-07
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
