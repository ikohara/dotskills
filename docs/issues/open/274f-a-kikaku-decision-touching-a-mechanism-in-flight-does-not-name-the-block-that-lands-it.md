---
id: "274f"
title: a Kikaku decision that touches a mechanism in flight does not name the block or plan section that lands it
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-18
updated: 2026-09-19
---

Source: shoroku seat-lineage

A Kikaku decision is written against the skill text the human and the seat can
read, which is the text on disk. When a plan is in flight over that same text,
the disk is stale by design (rule 11, decision-5c8e), so a decision can reason
from a mechanism the landing plan has already removed — and nothing in
`roles/kikaku.md` asks the decision to name the block or plan section that
lands the change it is reasoning about.

Measured on `seat-lineage`: the `shoroku-at-close` plan removed the question-
back step, and the Kikaku decision I-1 kept a step behind a line that removal
had already taken out. The decision was not wrong about what it wanted; it was
reasoning from a tree that no longer existed at the moment its ruling would
apply.

The fix is a drafting rule for `roles/kikaku.md`: a decision that touches a
mechanism in flight names the block, or the plan section, that lands it — the
way the `seat-lineage` decision file's own section 5 did for its topic order.

Related: issue-7b7b (a Kikaku decision can cite a list that exists on disk
nowhere) is the neighbouring gap, about a citation rather than about a
mechanism in flight.

A drafting-process gap, not a user-stated need, so no paired requirement.
