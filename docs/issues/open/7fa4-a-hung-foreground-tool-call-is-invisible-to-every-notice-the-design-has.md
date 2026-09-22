---
id: "7fa4"
title: a hung foreground tool call is invisible to every notice the design has
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-22
updated: 2026-09-22
---

Source: shoroku tanto-bg-seats S-21

A seat can reach a point where it needs the human's attention with no formal
`human-needed:` grant having fired. The human noticed this directly, mid-session:
a `passage-check.js replay` run hung for 86 minutes with no progress signal
visible, and the human asked, partway through, whether it was not taking rather
too long.

The human's own reading, recorded here because it names the cost: this is
*harder* to notice under the very `tanto-bg-seats` design this plan landed,
where a seat runs in the background with no window the human is watching by
default.

The landed design gives terminal seats a notice mechanism for a `blocked` state
and for `human-needed:` grants, and the spawner's census is the notifier
(decision-1c07). This incident was neither: a foreground tool call inside an
otherwise-normal turn, hung on a subprocess with no timeout, invisible to any
census. A seat in that state is `running` by every signal the run has.

What needs deciding is whether the notice mechanism gains a third case — a seat
whose turn has not advanced for some span — and where it would live: in the
census, in the seat's own act, or in a reading the boundary already takes.

Related: issue-126e (the mechanical half of this same incident: `replay` runs
fenced commands with no `spawnSync` timeout), issue-fd4b (a `--bg` worktree
spawn stuck on a startup dialog, which the close waits on with no timeout of
its own).
