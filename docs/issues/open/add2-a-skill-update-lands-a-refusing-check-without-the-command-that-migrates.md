---
id: "add2"
title: a skill update that changes a file the conductor owns lands a refusing check without the command that migrates
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: inbox 2026-10-08-feedback-ec9eae4

Item #36 of that copy.

A skill update that changes a file the conductor owns should land the
migrating command in the same step as the check that refuses, and say so in
the files the conductor reads. In the measured run, for seven hours the census
and every roster write were refused with no command to run.

The rule — a check that refuses lands in the same step as the command that
migrates, named in the files the conductor reads — is a plan-shape rule for a
skill-editing plan. It sits beside issue-1298 (no migration rule for a resume
under a skill revision) and issue-b45f (no route between amending a
skill-editing plan and the fix wave).

Related: issue-1298, issue-b45f, issue-9c6f.
