---
id: "4ac3"
title: the skill is edited in place while a run uses it
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-07
updated: 2026-09-08
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

One measured instance, from the kanri-lifecycle run of 2026-09-07: Task 6 of that
plan rewrote `skills/tanto/roles/jisso.md` while the Jisso session was executing
from it, and the harness reported the file changing on disk mid-run. Nothing
broke, because a Kanri ruling had already put the authority in the batch prompts
rather than in the file — the sessions of that run followed the constraints,
their orders, and the prompts, not the role text on disk. That is one data point
for the second shape above, the rule a skill-editing plan states: the mitigation
that worked was not a copy of the skill but a declaration of where authority
lives while the files are in motion.

Resolved by the boundary-rules design of 2026-09-07 and its plan, which chose
the second of the two shapes above: a rule every skill-editing plan states,
rather than a copy of the skill for the running roles. decision-5c8e records the
choice and the rejected alternatives. `SKILL.md` gained contract rule 11
("feat(tanto): contract rule 11, a plan that edits this skill in place"), and
the two obligations it assigns went to the role files that perform them — Kanri
records the authority ruling as an `R-n` before any batch prompt or subagent is
dispatched, and Sekkei states the boundary from which a role may be started or
replaced in Global Constraints and in the Batches section ("feat(tanto): the
rule-11 obligations in Kanri's and Sekkei's procedures"). The rule was in force
during the run that wrote it: both batch prompts carried the authority ruling,
and the plan named its batch A boundary as the safe one, proved at each boundary
by a command rather than asserted.
