---
id: "e448"
title: a dispatch hands back with a status, never with work of its own running
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-24
updated: 2026-09-24
---

## Context

Two reports from another repository's run, received on 2026-09-24
(`inbox 2026-09-24-task-implement-completed-handback-stalled` and
`inbox 2026-09-24-task-implement-phantom-background-wait`), show one family:
a dispatched `task.implement` subagent ends its turn with work of its own
still running, or waiting on work nothing tracks, and the Jisso — which has
no clock — idles on a promise with no bound. In the first, an interim
`completed` notification promised a second one that never came, for about
11 hours 25 minutes; a direct message to the agent's id brought the
hand-back in about three minutes. In the second, a wait budget the Jisso
added to its dispatch prompts was followed inconsistently. The design
"bg-seat-fixes" (2026-09-24), section 2, sets the rule.

## Options

- **Prevention in every dispatch prompt, detection at the Jisso, and a bound
  of two messages.** Chosen.
- **A Kaiseki case first (Q9).** Rejected: the first report names the cause.
- **The input decision's fallback, a check of an overdue hand-back against
  the listing and the tree.** Rejected: an idle Jisso has no clock to find it
  overdue, and the notification itself is the signal.
- **A wait budget in each dispatch prompt with nothing behind it.** Rejected:
  followed inconsistently (the second report); the chosen rule keeps the
  prompt as best effort and puts detection behind it.
- **A bound on the harness's promise of a second notification.** Rejected:
  the harness's to make.

## Decision

Every dispatch the Jisso sends — `task.implement`, `task.escalate`, and the
two task reviews — tells the subagent to run every command in the foreground
with an explicit timeout, ten minutes at most, never as a background job; to
never end a turn while a command of its own is still running or while
"waiting" on anything; and to end every turn with a hand-back (2.2).

A notification that carries no hand-back — an interim `completed` whose note
says background work is still running, or a result that says the agent is
waiting — is answered in the same turn by a message to that agent's id: stop
any command still running, run what remains in the foreground with a
timeout, and hand back with its status (2.3). At most two such messages to
one dispatch; a third notification without a hand-back is that task's
`BLOCKED` (2.4).

This amends no earlier decision.

## Consequences

- A command that hangs inside a dispatch cannot hold a batch for hours with
  no signal: the Jisso's own turn answers the notice that carries no
  hand-back.
- The rule covers the Jisso's dispatches only. The same rule for the other
  roles' dispatches is deferred until one is reported stalled
  (issue-a25c).
- A timeout in a repository's own test runner stays that repository's.
