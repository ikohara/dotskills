---
id: "9a68"
title: measure the rate limit for two or three strong-model sessions at once
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-06
updated: 2026-09-07
---

The tanto design of 2026-09-06 caps strong-model sessions at two (rule 9:
Sekkei pauses while Kaiseki is active). The cap is a guess. The rate limit for
two or three interactive top-family sessions has not been measured; what was
observed is the death of a top-family *subagent* on a 429 (kuchidome M1).

Data so far: on 2026-09-06 Kanri and Sekkei ran as two Fable sessions for
several hours, with `opus` subagents under Sekkei, and no 429 occurred.

To do: record every run's peak count of concurrent strong-model sessions and
any 429 in the conductor ledger's Measurements table. The first Kaiseki case
under a real plan is the first three-session data point. With data, keep
rule 9, relax it, or replace the count with a measured budget. Relaxing it
changes a rule the skill states, so that is an ADR, not a design edit.

Measured 2026-09-07, during the spec and plan work of the kanri-lifecycle
run: two Fable sessions (Kanri and Sekkei) ran for about eleven hours with,
at the peak, two `opus` subagents under Sekkei (a reviewer and the plan
drafter) and five `sonnet` grandchildren of a translation subagent alive at
once. No 429 was observed by either session or reported by any subagent.
Still no Kaiseki case, so still no three-session data point.
