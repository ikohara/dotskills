---
id: "5c8e"
title: a plan that edits the tanto skill runs on the skill it is editing, with the sessions' authority in the constraints, the orders, and the prompts
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-08
updated: 2026-09-08
---

## Context

In the repository that ships `tanto`, the user-level skill directory is a
link into the working tree, so a plan that edits `skills/tanto/` changes the
skill the run's own sessions load, and a role started mid-plan reads whatever
is on disk at that moment. The kanri-lifecycle plan of 2026-09-07 answered
this for itself — no role replacement before its batch B boundary, where the
delivered skill first held together — and decision-de63 asked every
skill-editing plan to name such a boundary, leaving the general answer open
(issue-4ac3). One instance was then measured: a task of that plan rewrote
`roles/jisso.md` while the Jisso session was executing from it, the harness
reported the file changing on disk, and nothing broke, because a Kanri
ruling had already put the authority in the batch prompts rather than in
the file.

## Options

- **A copy of the skill for the running roles**: link the last landed
  version, run the plan on the working tree, re-link after the merge. The
  run would then verify a skill it does not run, and the two previous plans
  found their defects by running what they delivered; the re-link is a human
  step outside the protocol at a moment the protocol does not mark.
- **A rule every skill-editing plan states**: the authority for the run's
  sessions is the plan's Global Constraints, Kanri's orders line, and the
  batch prompts, not the role text on disk; the plan names the boundary from
  which a role may be started or replaced; before it, no role is replaced
  and no further role is created. The measured instance shows the rule
  suffices.
- **No role start or replacement at all while a skill-editing plan is in
  flight**: rejected because req-04f5 and decision-de63 make Kanri's
  handover mandatory at a boundary when its trigger fires, and a compacted
  Kanri held for several batches is the worse risk.

## Decision

The rule, as contract rule 11 of `tanto`. A plan that edits this skill's own
files runs on the skill it is editing. While it is in flight, the authority
for the run's sessions is the plan's Global Constraints, Kanri's orders
line, and the batch prompts, not the role text on disk; Kanri records that
as a ruling when the plan lands, so every batch prompt and any handover file
carry it. The plan names, in its Global Constraints and its Batches section,
the boundary from which a role may be started or replaced — the first
boundary at which every file the plan touches agrees with every other, which
may be the last. Before that boundary no role is replaced and no further
role is created, with two exceptions: Kanri's own handover proceeds when it
is due, its successor taking the authority ruling from the handover file
rather than from the tree; and a further role needed before the boundary,
Kaiseki, is a Kanri ruling made with the half-edited skill in view. The
roles that start the plan — Sekkei before the landing, Jisso at it — read
the skill as it stands then, and the authority sentence covers them.

## Consequences

- The run keeps dogfooding the skill it delivers, and a plan pays for that
  with one more sentence in its constraints and one more sweep at each
  boundary.
- A handover that falls due before the safe boundary is not held; the
  successor's cold read starts from the handover file's rulings, which is
  what the handover file is for.
- A Kaiseki created before the safe boundary reads a half-edited skill; the
  ruling that creates it says so, and its brief carries the authority
  sentence.
- The rule is stated conditionally in the contract — "when the skill the
  sessions load is the working tree's own copy" — because `SKILL.md` ships
  to hosts where the skill is installed as a copy and the hazard does not
  arise.
- decision-de63's consequence bullet, which asked a skill-editing plan to
  name the boundary, is now the general rule; nothing in that ADR is
  amended.
- The first plan run under this rule is the one that lands it
  (boundary-rules, 2026-09-07); its authority ruling was recorded by hand
  before its first batch, as the rule will require of every later plan.
