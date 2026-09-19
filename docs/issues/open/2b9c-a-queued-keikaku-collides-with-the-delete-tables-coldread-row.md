---
id: "2b9c"
title: a queued topic's Keikaku must persist past `coldread answered:`, which the Delete table reads as done
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: inbox 2026-09-16-queued-keikaku-coldread-delete-collision

The queued-topic protocol has a queued topic's Keikaku run through
`plan.review`, `brief.write`, the human's dialogue and `review-ready:`, then
cold-read the draft and answer `coldread answered:`, and then idle — the
**same** session is meant to come back later and cut the branch once Kanri
sends `checkout free: main at <sha>`.

`roles/kanri.md`'s standard Delete table reads that exact line — `coldread
answered:` naming an exit proposal — as "Keikaku is done; ask for its deletion
once the recommendation over its exit proposal is on disk." A queued Keikaku,
following the ordinary convention, submitted its own exit proposal alongside
its `coldread answered:` line, exactly as a non-queued Keikaku would. Had this
not been caught, the human would have been asked to delete a session the
protocol's own design requires to persist — losing the only context that
remembers the plan's review history.

Caught before any deletion, but the collision is structural rather than a
one-off: the row keys on that line alone, and the queued protocol reuses it.

Proposed fix, stated in two places: a queued Keikaku's seat persists through
`coldread answered:` plus its exit proposal, and is deleted only after the
branch-cut step completes at `checkout free:` — (a) in the queued-topic
protocol's own permanent text, once it lands, and (b) as an "unless the topic
runs under the queued-topic protocol" exception on `roles/kanri.md`'s Delete
table row for Keikaku.

Alongside issue-bb8c (broadcasting `checkout free:` to two queued Keikaku
sessions), the precedent `shoroku-at-close`'s own R-18 named.
