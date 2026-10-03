---
id: "6c44"
title: a queued window's own idle cost is unmeasured
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-18
updated: 2026-10-03
---

Source: shoroku seat-lineage

decision-ea95 opens N = batches + 1 Jisso windows at the plan's landing, and
decision-76a6 keeps each of them reading nothing and receiving nothing until its
batch prompt. So a queued window costs no context — but nothing here measures
what the **editor** pays for N windows sitting idle for hours: memory, process
count, or any per-window overhead the host carries whether or not the session
is doing work.

This is the rotation's one unmeasured cost. The human's own observation that
prompted the design was about open/close **cycles**, not about a number of
windows held open, so it does not answer the question either.

issue-d3f1 carries the seat and stage cost measurements the run already takes;
this gap is outside that instrument, since a queued session takes no reading.

A measurement gap, not a user-stated need, so no paired requirement.

Serves exp-178d (tanto-issue-triage, 2026-10-03).
