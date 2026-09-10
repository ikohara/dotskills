---
id: "d725"
title: the exit lines' idle subscription woke Kanri four times and told it nothing
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-10
updated: 2026-09-10
---

Measured on 2026-09-09, the day the review-brief rule dropped the idle
subscription from batch prompts and briefs (the report line is the signal)
while keeping it on the `exit:` lines "because there the idle notice is the
forced-exit signal by design". Two Sekkei exits ran under that rule. Each
produced two idle notices at Kanri — after the proposal and after the
direction, when the session went idle as instructed — four wake-ups in all,
each re-reading Kanri's whole context (about 5 MB of transcript at the time),
none of them the forced-exit signal: both sessions answered every exit line
normally, and the notices arrived after the answers. The context-cost
design's thesis is that a session's cost is its context times its wake-ups;
these four wake-ups bought nothing.

The forced-exit case the subscription was kept for is detected the way a
missing batch report is: the human says the session is gone, or Kanri's
window wakes for another reason and the answer has not arrived. The roster's
Events line for a forced exit ("its exit shoroku did not run and what was
lost") is written on that word either way.

Proposed: drop `notify_when_idle` from the `exit:` lines in `SKILL.md`'s
Messages and Session exit sections and in `roles/kanri.md`'s Exit shoroku
steps, so that no tanto line carries a subscription; keep the sentence that
a session past answering is a forced exit, with the human's word as the
detector. Con: a session that dies mid-exit is noticed at the human's next
word rather than at once — the latency the batch-report rule already accepts.

Related: req-04f5 (a session's cost is measured), issue-e5a2 (resolved: the
394 wake-ups of which 81 were idle notices), decision-6dea, design-4807
(Messages).

Resolved by the tanto-sweep plan's task 10, which drops
`notify_when_idle` from the `exit:` lines in `SKILL.md`'s Messages and
Session-exit sections and from `roles/kanri.md`'s Exit shoroku steps, so
that no tanto line carries a subscription; a forced exit is detected by the
human's word, or by another wake-up finding no answer, per this issue's
proposal.
