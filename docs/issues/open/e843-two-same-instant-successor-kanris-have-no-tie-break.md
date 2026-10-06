---
id: "e843"
title: two same-instant successor Kanris have no tie-break in the skill
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-07
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

**2026-10-07, from inbox 2026-10-06-spawner-roster-and-handover-contract — a
second tie, settled by the handover file's move.** In another run two
successors started together from one handover (issue-f03b's amendment of the
same date). What worked: the spawn result file and
`.tanto/spawner/seats.json` named one `sessionId`; that one was the
successor, and it moved the handover file aside before writing anything — an
atomic claim — then told the other by one line; the other acked and wrote
nothing. The "Second Kanri" reading, taken for a handover file that is still
present, would have been the wrong one: it assumes a predecessor still
`busy`, when the file is the very thing being claimed. The report's
direction, as an alternative to the lower-`sessionId` rule: in the Handover
case, the Kanri the spawn result and `seats.json` name moves the file aside
before writing anything and tells the other by one line, the other acks and
writes nothing; and in "Second Kanri", a handover file still present because
another Kanri is claiming it is not a predecessor still busy.

Carrier: Kept.
