---
id: "84c8"
title: the launcher ships with the skill, never with a consuming project, as one command that is also fukki
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: ["cdc4", "362e"]
created: 2026-09-22
updated: 2026-09-24
---

## Context

A run now needs something the human types to start it: a process that brings
up the spawner and the first Kanri. Where that something lives decides
whether a repository which merely uses tanto carries any of tanto's own
machinery in its tree, which req-04f5 answers — a repository that uses tanto
carries no launcher of it.

The second question is how many commands the human learns. Starting a run and
rejoining one after a restart are the same act from the human's side: "put me
back where the run is."

## Options

- **The launcher ships with the skill, as one command that is also fukki.**
  The command starts a run if none is live and rejoins the live one if one
  is.
- **A script in the consuming project's `scripts/`.** Rejected (D-3): every
  consuming repository would carry, and have to keep current, a copy of the
  skill's own entry point.
- **Two commands, one to start and one to rejoin.** Rejected: the human
  cannot always tell which case they are in, and guessing wrong should not be
  a different command.
- **A listing subcommand** for the run's seats. Rejected: `claude agents` is
  that view already.

## Decision

The launcher and the spawner ship with the skill. A consuming repository's
tree holds the untracked state directory, the project config it chooses to
keep, and the ignored project-scope definitions — nothing else, and no
script (D-6, S-6). The launcher is one command, and that command is also
fukki: it resumes a run as readily as it starts one.

## Consequences

- Upgrading the skill upgrades the launcher, with nothing to re-copy into any
  consuming repository.
- The human learns one command for four situations — first start, restart
  after a reboot, restart after an editor crash, and rejoining a run they
  walked away from.
- The launcher has to decide spawn-or-attach correctly, which is a real
  discrimination problem rather than a formality; the mechanism it uses is
  decision-345b's.
- The reasoning is the tanto-bg-seats design spec of 2026-09-20.
