---
id: "2b5b"
title: a plan fence that computes its diff base as the plan's last commit drifts forward at every re-commit
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: inbox 2026-10-08-feedback-454d742

Item #27 of that copy.

A plan fence that computes its diff base as the plan's last commit drifts
forward at every re-commit of the plan, and makes the sweep pass trivially.
The Keikaku role could prescribe pinning the base to the plan's adding commit
(`--diff-filter=A`, last line).

This is a measured defect — a sweep that passes trivially after the plan's
first re-commit — with a concrete pin to decide for `roles/keikaku.md`.
issue-909c asks the plan to name its base commit and issue-f94f separates the
two bases `roles/kanri.md` conflates; neither records the drift.

Related: issue-909c, issue-f94f, issue-1c97.
