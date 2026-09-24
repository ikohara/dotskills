---
id: "1368"
title: an idle `claude --bg` seat may be collected after about sixty minutes
severity: medium
depends_on: []
blocks: ["a83c"]
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-ergonomics S-32

The row points at the Kikaku decision `2026-09-24-queued-seats-vanished.md`;
S-33 (`2026-09-24-queued-seats-issues.md`, issue 2) is its second source.

During the bg-seat-ergonomics run, the four queued background Jissos of a
plan that queues at its landing exited together, at one sweep, sixty minutes
after going idle, with no stop from any session:

- All four transcripts end with a `cost-state` record, written only when the
  process exits, and all four were written within 21 ms of each other. The
  exit was orderly (a crash writes no `cost-state`) and simultaneous across
  four processes — one external event.
- Neither the spawner nor either Kanri stopped them: the spawner log has no
  stop or rm at that time, and the Kanris' transcripts ran no `claude stop`,
  `rm`, or kill.
- The four went idle within sixteen seconds of each other and were collected
  sixty minutes later. A Kanri waiting on an `AskUserQuestion` for hours
  survived, so a seat blocked on input seems to stay while a purely idle one
  is collected.

The queue-at-landing design (decision-b909) assumes an idle background seat
waits for hours, and nothing has measured that. The run worked around it by
resuming the four sessions one at a time, each right before its batch prompt
went out.

What this issue asks, as its first step: measure whether an idle
`claude --bg` seat that nothing addresses survives past sixty minutes and, if
it does not, whether the CLI documents the limit and whether a setting moves
it. The procedure must not pass through the agent view's folder-trust
question (issue-b7e1): spawn a throwaway seat, address it with nothing, and
read `claude agents --json` and the transcript's last record at intervals
past sixty minutes. R-4 declined the measurement for the bg-seat-ergonomics
batch B's Task 4; the Kikaku decision `2026-09-24-bg-seat-fixes.md` item 4
assigns it to `bg-seat-fixes`. Until it is measured, the run treats sixty
minutes of idleness as the ceiling.

Related: issue-6c44 (a queued window's own idle cost is unmeasured) — that
one is the cost of waiting, this one is whether the seat survives it.

**2026-09-24, `bg-seat-fixes` — two more data points, about 64 and about 119
minutes** (shoroku bg-seat-fixes S-40). That plan's two queued Jissos,
spawned at 15:11-15:12, were found `gone` by the spawner's census at 16:16
(`4d212332…`, about 64 minutes) and 17:11 (`c0726f0d…`, about 119 minutes) —
one at the sixty-minute mark, one well past it, in the same run, on the same
host, with the same prompt. `goneAt` is when the spawner noticed, not the
exit; the transcripts' `cost-state` records (the design's Measured 2) give
the exit times. The design "bg-seat-fixes" (2026-09-24) replaced the
sixty-minute interim rule with decision-39fb, which rests on no idle time;
this issue stays open for the collection's condition alone, and the design's
section 4 is the procedure a later measurement follows (shoroku
bg-seat-fixes S-16, deferred item 1).
