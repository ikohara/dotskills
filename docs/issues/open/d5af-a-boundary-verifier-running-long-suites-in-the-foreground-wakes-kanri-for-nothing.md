---
id: "d5af"
title: a boundary verifier running long test suites in the foreground wakes Kanri for nothing
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: inbox 2026-10-08-feedback-454d742

Item #43 of that copy.

A boundary verifier running long test suites in the foreground delivered
interim "has not reported yet" notices and a duplicate hand-back, each waking
Kanri for nothing. The brief could name the suites the batch report already
ran and have the verifier re-run only a sampled subset.

Which suites the verifier re-runs, and whether a sampled subset is enough at a
boundary, is a decision for `templates/boundary-brief.md`, beside issue-076b
(a text-only rework's boundary still runs the whole suite) and issue-bf3e (the
background suite rule and the foreground-only dispatch rule meet at every
task).

Related: issue-076b, issue-bf3e.
