---
id: "1c9d"
title: a report line that hit a `/clear` gap with no handover has no `unanswered:` event and `kanri.md` step 1 never says to look at the disk
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-10-03
---

Source: shoroku tanto-diet S-62

Found by the whole-branch review of `tanto-diet` and parked rather than fixed,
because the repair decides something the spec's liveness reasoning did not.

The spec accepts the liveness cost of a handover gap: a peer that sent into
one re-sends at its next wake-up, and in a handover-less gap that wake-up is
"the human's word in its window or a line from the new Kanri". But in the
Kept-Kanri gap — a `/clear` with no handover file — a Jisso's `report:` line
got `no-role` from *no* Kanri at all. So no `unanswered:` Session event exists
for the successor to pair with an `answered:`, and the new Kanri "will not
message" a Jisso it is waiting on. Loop step 1 says "Do not poll" and makes
the human the detector.

The report **file** is on disk the whole time.

The reviewer's proposed repair is one clause, in the Kept-Kanri paragraph or
in loop step 1: *a Batches row in state `sent` whose `batch-<X>-report.md`
already exists on disk is a report whose line was lost; treat it as arrived.*
That turns a human-detected stall into a cold-read check. It is filed rather
than applied because it decides that the successor reads the disk — a new
source of truth beside the events, which the liveness design did not give it.

This is a plan- and spec-level gap, not an implementer deviation. Related:
issue-894d (a `/clear` can reuse the same name and ref for a genuinely new
session), the scenario this one lands inside.

Serves exp-173f (tanto-issue-triage, 2026-10-03).
