---
id: "b909"
title: a plan that edits the skill spawns all its Jissos at the landing; every other plan spawns one per batch
status: accepted
supersedes: []
superseded_by: null
amends: ["ea95", "76a6", "5c8e"]
amended_by: []
created: 2026-09-22
updated: 2026-09-22
---

## Context

decision-ea95 fills a queue of N = batches + 1 Jisso windows at the plan's
landing, because the human was the one opening windows and could only be
asked while present. req-04f5's replacement for that premise is blunter: a
seat is started when its work exists. With the spawner starting seats
(decision-1ea3), an executor can be spawned for one batch when that batch's
prompt exists and stopped at its boundary, and nothing idles.

One case resists. Under rule 11 (decision-5c8e) a plan that edits this
skill's own files runs on the skill it is editing, so a Jisso spawned at
batch C's prompt would load a skill three batches' worth of edits ahead of
the one its siblings loaded. The property that matters there is not freshness
but agreement: every executor of such a plan must have read the same skill.

## Options

- **Per-batch spawning as the rule, with skill-editing plans spawning all
  their Jissos at the landing**, where they wait, reading nothing.
- **A pinned skill snapshot per plan.** Rejected: there is no per-session
  load path without moving the shared symlink, which would change the skill
  for every other session on the machine.
- **The authority clause alone** — rule 11's "the authority is the plan's
  constraints and the batch prompts, not the role text on disk" — with no
  special spawning. Rejected: the clause covers what a seat obeys, not what
  it has already read, and a half-edited role file still shapes a seat's
  first reading.

## Decision

A plan that edits the skill spawns all its Jissos at the landing; every other
plan spawns one per batch (D-2). The skill-editing plan's executors wait,
reading nothing, so that every one of them reads the same skill.

**This ADR amends three accepted ADRs; each stands in every respect not named
here.**

- **decision-ea95** — its queue of N = batches + 1 filled at the landing
  becomes the skill-editing case only; the ordinary plan spawns one Jisso per
  batch and stops it at its boundary. ea95's one-fresh-Jisso-per-batch
  principle, its fixed rotation within a queue, and its amendments to 6dea,
  eee2 and f496 stand.
- **decision-76a6** — its subject. A waiting seat is now a spawned terminal
  seat rather than a window the human opened, and the rule that it reads
  nothing and is sent nothing until its batch prompt is exactly what makes
  the skill-editing case work. 76a6's decision stands, with its subject
  widened.
- **decision-5c8e** — its consequence that a plan names the boundary from
  which a role may be started or replaced. For a skill-editing plan there is
  now no mid-plan start to govern, because every executor is already
  spawned. 5c8e's rule 11 itself — the authority sentence, and the run
  dogfooding the skill it delivers — stands.

## Consequences

- An ordinary plan holds no idle windows, so the editor pays for nothing that
  is waiting, which is what issue-6c44 was asking about.
- A skill-editing plan still pays for N waiting seats, and now they are
  background sessions rather than tabs, so the cost is the machine's rather
  than the editor's.
- "Reading nothing" is load-bearing for the skill-editing case: a waiting
  executor that reads the tree early would defeat the whole arrangement.
- The reasoning is the tanto-bg-seats design spec of 2026-09-20.
