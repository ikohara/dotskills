---
id: "71f4"
title: A Global Constraint on unmarked-seat tests binds every task but no passage carries it
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-60

The run-owned-seats plan wrote "a test per behavior for a seat with no
`contract` mark, beside the one for a marked seat" as a Global Constraint on
every task, while the passages that carry the tests wrote only the marked
half. Tasks 9, 10, and 11 of batch C and Task 5 of batch B were each flagged by
a reviewer with an Important labeled plan-mandated, and each was ruled to
stand over fence 7, because adding the test is text outside the passages.

A plan should either carry the unmarked test in the task's passages, or say in
the constraint that the fix wave writes the missing halves, so that a reviewer
does not raise the same Important four times. Kin: issue-5e30 (a
verification item and its task step can drift).

Carrier: Kept — a plan-authoring rule for `roles/keikaku.md` and the Global
Constraints' form, not the instrument.
