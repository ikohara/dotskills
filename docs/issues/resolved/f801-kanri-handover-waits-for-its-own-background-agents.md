---
id: "f801"
title: a Kanri handover must wait for the session's own background agents and promised commit lines
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-07
updated: 2026-09-08
---

The Kanri role file's handover section (design-4807, the kanri-lifecycle
design of 2026-09-07) fires the handover on a noticed compaction and times
it "only at a boundary: a batch accepted and the next prompt not yet sent",
with the rule that "a handover that is due stops the loop at that point".
It does not say what happens to work the session itself still owns at that
moment.

Observed 2026-09-07 at the batch C boundary of the kanri-lifecycle plan: the
resident Kanri noticed a compaction while (a) the whole-branch reviewer it
had dispatched was still running as a background subagent of its own
session, and (b) Sekkei was holding its exit shoroku commit for Kanri's
promised line `exit: commit now`. A subagent belongs to its session and dies
with it; the successor inherits only the report file the agent writes, and
never the completion notice. Had Kanri written the handover at once and the
human deleted the session, the review would have been lost and Sekkei left
waiting on a line nobody would send. Kanri ruled (R-22 in that ledger) to
let the in-flight work return first and only then write the handover, and
recorded the case here because the role file is a plan-listed file that the
hotfix lane excludes.

Proposed fix: one paragraph in the role file's Timing rule, and a line in
design-4807's lifecycle section: the trigger is checked at the boundary, and
a due handover is written after the session's own background agents have
reported and after every commit line Kanri has promised a peer at that
boundary has been sent and verified; nothing new is dispatched in between.
The handover file's "In flight" section could also gain a line for "agents
of this session still running", so a successor that finds one knows it is
lost rather than pending.

Related: issue-77a1 (the residency and the trigger), decision-de63 (Kanri
resident with a handover).

Resolved by the boundary-rules design of 2026-09-07 and its plan. The Timing
subsection of the Kanri role file now carries the wait as a rule — the handover
file is written only after every background agent the session dispatched has
returned and every commit line it promised a peer at that boundary has been sent
and verified, with nothing new dispatched in between and the human's word the
only override ("feat(tanto): a due Kanri handover waits for what the session
still owns"). The loop's step 6 defers a create request that falls due at a
handover boundary to the successor, and step 7 routes the handover through the
wait. The handover template gained the "Agents of this session still running"
line under In flight, so a handover written on the override says what is lost
rather than pending ("feat(tanto): the handover file lists the agents lost with
the session"). design-4807's Handover section states the rule; the wait is
unbounded, because the harness gives no signal to bound it by.
