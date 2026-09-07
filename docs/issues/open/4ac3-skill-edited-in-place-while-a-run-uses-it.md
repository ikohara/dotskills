---
id: "4ac3"
title: the skill is edited in place while a run uses it
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-07
updated: 2026-09-07
---

The user-level `tanto` link points into this working tree, so a plan that
edits `skills/tanto/` changes the skill the run's own sessions load. A role
started mid-plan reads whatever is on disk at that moment: after the
kanri-lifecycle plan's batch A, for example, the contract forbids rename while
the role files still demand it.

The kanri-lifecycle plan of 2026-09-07 answers this for itself: no role
replacement before the batch B boundary, where the delivered skill first
holds together (its spec review's F-5). The general answer is open. Two
shapes: a copy of the skill for the running roles (link the last landed
version, run the plan on the working tree), or a rule every skill-editing
plan states, naming the boundary from which a role may be started. Kanri's
replacement (decision-de63) has the same exposure, since the successor reads
`roles/kanri.md` from disk.

Related: issue-770d (the dogfood that surfaced it), decision-de63.
