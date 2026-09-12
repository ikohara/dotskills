---
id: "63b0"
title: a dispatched subagent that fans out ends its turn with nothing written, and its reply reads as progress
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-12
updated: 2026-09-12
---

Every `tanto` role dispatches subagents, and every one of the four role files
names a `subagents.<kind>` key for it: `roles/kanri.md` for the review-brief
writer and the whole-branch reviewer, `roles/sekkei.md` for the plan drafter
and the two review reports, `roles/jisso.md` for the implementers, the task
reviewers and the fix rounds, and `roles/kaiseki.md` for its ad-hoc
`subagents.default` dispatch. In almost all of them the deliverable is **a
file at a named path**, and the dispatcher's next step reads that file.

Nothing in the skill says what happens when the dispatched subagent dispatches
further agents of its own. Measured on 2026-09-12, in a `subagents.default`
dispatch during the tanto-workspace plan stage: the subagent split its work
into three background agents of its own and ended its turn with

> All three translation agents are running in the background. I'll wait for
> their completion notifications before merging the parts and writing the final
> cache file.

The dispatcher received a completion notification for that subagent — its
children did not keep its turn alive — and the output file did not exist. The
reply reads as progress, not as a stop, and a dispatcher that trusts the reply
proceeds on a file that is not there. The recovery was one message back to the
same agent, telling it to finish in that turn without dispatching further; that
worked, at the cost of one round trip and a wall-clock delay the dispatcher had
budgeted for something else.

Two halves of the fix, and they are independent:

- **The dispatch says it.** A dispatch whose deliverable is a file states the
  path, says the agent must write it in its own turn, and forbids the fan-out.
  The role files' dispatch conventions are where that belongs, beside the
  standing rule that every dispatch names a `model`.
- **The dispatcher verifies the file, not the reply.** This is the same shape
  design-4807 already records for a fix round — "a completion notice is not
  evidence the work landed", where `git status` and `git log -1` tell "done"
  from "stopped early". The subagent case is that rule applied to a path
  instead of to a commit, and the skill states it for the commit only.

The second half is the load-bearing one: it holds whatever the dispatched agent
does, while the first only reduces how often it is needed.
