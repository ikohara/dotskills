---
id: "e843"
title: two same-instant successor Kanris have no tie-break in the skill
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: shoroku shoki-seat S-90

`roles/kanri.md`'s Handover case and Second Kanri case both assume that one
session reads the roster or the handover file first. Two sessions that start
together — the two successors of issue-f03b's doubled request — both take the
Handover case. The `shoki-seat` run settled it by message: the lower
`sessionId` proceeded, and the other stood down having changed nothing. It
worked because both read the roster and the handover before writing.

A written rule belongs in the Handover case: the lower `sessionId` wins, and
a session that finds another Kanri row in `Not held` with a start time within
seconds of its own messages it before it writes anything. Kin issue-a14f.

Carrier: Kept.
