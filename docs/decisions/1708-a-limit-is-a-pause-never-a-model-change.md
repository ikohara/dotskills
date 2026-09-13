---
id: "1708"
title: a rate limit is a pause, never a model change
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-13
updated: 2026-09-13
---

## Context

issue-5a17 recorded that tanto says nothing about a rate limit: a role that
meets a 429 has no rule to follow, and the obvious improvisation — continue
on a lower family — silently breaks the model discipline req-04f5 asks for.
With the cost design putting the top family in one-shots against a five-hour
limit, a limit is no longer a rare accident but an expected event.

## Options

- **Continue on a lower family** when the quota is out. Rejected: it was
  measured once in another repository and called out by the human — the work
  changes quality without anyone deciding that it should, which is exactly
  the silent switch decision-08bc forbids for a session.
- **Stop and pause**, with the work in hand kept, nothing half-done
  committed, and the human's word as the only thing that ends the pause.

## Decision

A limit is a pause, never a model change. No role switches its own session's
model or effort on a limit, and no dispatch is retried on a lower family; the
models are what `tanto.json` says until the human changes the file. On a 429
that names a daily or weekly quota the role stops retrying, commits nothing
half-done, tells Kanri `paused: <dispatch> on <family> — resets <time>`, and
idles with the work in hand; on a per-minute 429 it retries once after the
message's interval and then does the same. Kanri records the line and tells
the human the reset time, and resumes only on the human's word, with the same
model, from where the dispatch stopped.

## Consequences

- A pause has no upper bound the skill can state: it may outlive the run, and
  only the human's word ends it.
- A `/model` or `/effort` change made mid-run is not detected; the rule is
  protocol, not enforcement.
- The reasoning is the tanto-cost design of 2026-09-12; design-4807 records
  the procedure.
