---
id: "fa61"
title: a background subagent stalled silently for seven and a half hours, with the human as the only detector
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: shoroku roster-ledger S-54

Observed on `roster-ledger`'s batch A, 2026-10-07 to 2026-10-08: a background
`task.review-quality` subagent (opus) of a Jisso's Task 2 stopped producing
output mid-work and was never reported complete. Its last transcript record
was an assistant tool call with no result after it, written at 23:26; the
Jisso ended its turn at 23:27 waiting on its notification
("pendingBackgroundAgentCount" above zero), and the seat listed as `waiting`
(`boundary.js seat` printed `blocked`, turn `open`) for about seven and a half
hours, until the human asked Kanri whether the Jisso was alive. No notice
reached the human, Kanri held no clock, and the Jisso could not wake itself.

The cause is unknown: no limit message, no error record, no later write (a
lost background service overnight, an opus limit, and a plain hang all fit).
A re-dispatch of the same review finished in 93 seconds; the stalled one was
stopped with `TaskStop` after Kanri's `resume batch A from task 2` line woke
the Jisso. A `SendMessage` nudge to the stalled subagent was queued until its
next tool round and did nothing.

Proposed handlings that do not depend on the cause, none chosen:

- **A timer armed with every dispatch.** The seat that dispatches a subagent
  (Jisso for its implementers and reviewers, Kanri for `boundary.verify`)
  arms one background watcher in the same act, for a few times the measured
  time of that kind of dispatch (a review ran 75 to 105 seconds in this plan;
  a boundary ran 10 minutes), whose completion wakes the seat. On wake, a
  dispatch with no completion is stopped with `TaskStop` and dispatched once
  more; a second silence goes to Kanri as one line. `roles/jisso.md`, "The
  run", and `roles/kanri.md`, loop step 2, would carry the sentence; the
  contract already makes Kanri arm a watcher per promised event.
- **A liveness check on the seat from outside.** A seat the census holds
  `running` or `blocked` whose transcript has had no write for longer than a
  stated bound (30 minutes, say) while its last turn is ended or open with
  background agents pending is printed by the census as `— quiet <minutes>`,
  and the spawner raises one desktop notice for it, as it does for a blocked
  seat. Kanri's idle block names it under `for you:` until it is answered, so
  the human is no longer the detector.
- **The nudge itself.** A `SendMessage` to a stalled subagent is never read;
  only `TaskStop` ends it. The Jisso's text on a silent subagent should say
  so.

Lineage: the inbox copies 2026-09-24-task-implement-phantom-background-wait
and 2026-09-24-task-implement-completed-handback-stalled were triaged
`relay` into the bg-seat-fixes spec; this is the recurrence after that topic
landed. Sources: the human's question about the Jisso on 2026-10-08 and the
batch A report's Rulings entry on "the stalled Task 2 quality reviewer".

Carrier topic: `park-in-flight` — its `limited` mark is the seat that cannot
say what happened to it, and the quiet mark is its kin.
