---
id: "fff8"
title: a protocol hard ceiling above the soft one
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

The alternative rejected at Q3 of the `tanto-context-ceiling` spec dialogue,
filed so that the day a compaction summary loses a ruling the option is on
record with its reason.

The option: a hard ceiling in the protocol above the derived soft one, at
which Kanri hands over regardless of the human's presence and the run stalls
until the human creates the successor. It would keep the state in the handover
file rather than in a compaction summary, and it would bound cost without
depending on a harness setting the skill does not own.

Why it was not taken: the human preferred the harness's own net — the
`autoCompactWindow` — to a second protocol state, on the ground that idle
costs nothing but a stalled run costs the time the human was away. The
consequence accepted is that while the human is absent a Kanri continues on
its compaction summary. decision-eee2's Options section records the rejection;
this issue is where the option waits.

Deferred: it is reconsidered only if the accepted consequence actually bites —
a summary standing in for a ruling that a handover file would have kept.
