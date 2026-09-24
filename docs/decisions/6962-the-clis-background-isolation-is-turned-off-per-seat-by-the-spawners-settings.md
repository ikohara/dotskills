---
id: "6962"
title: the CLI's background isolation is turned off per seat by the spawner's `--settings`; no settings file is written
status: accepted
supersedes: []
superseded_by: null
amends: ["1ea3"]
amended_by: []
created: 2026-09-24
updated: 2026-09-24
---

## Context

The CLI isolates a background session into a worktree at its first write.
A tanto seat works in the shared checkout, so a seat that relocated wrote
where no other seat looked (issue-aa37). The bg-seat-ergonomics design spec
of 2026-09-23 reproduced it: a control seat went into a worktree at its first
write, while a seat started with the isolation turned off wrote in the root,
before and after a flag-less resume.

## Options

- **The spawner turns the isolation off per seat with `--settings` on the
  spawn.** Chosen.
- **The launcher asks and writes `.claude/settings.local.json`** (the Kikaku
  decision's item 3, reversed with the human's word, D-2). Rejected: it edits
  the repository's configuration, which req-04f5 forbids, and turns the
  isolation off for every background session in the repository.
- **The user scope.** Rejected: it changes every repository.
- **The variable `CLAUDE_BG_ISOLATION`.** Rejected: the CLI sets it itself in
  a job's environment, and a requester's value is not carried.
- **Worktrees for the seats.** Rejected: a rewrite of the workspace contract.

## Decision

The CLI's background isolation is turned off for each seat, and for that seat
alone, by the spawner's `--settings` on the spawn; no settings file is
written. The guard that notices a seat outside the root moves to every pass
of the spawner's census, since the relocation happens mid-turn.

**This ADR amends decision-1ea3** in what the spawner passes at a spawn and
in where its guard runs. 1ea3's rule — the spawner is the only process that
runs `claude --bg`, `stop`, and `rm`, and a session writes a request file —
stands.

## Consequences

- A seat writes in the shared checkout, and no repository or user
  configuration changes for it.
- The setting rides on the job's saved options, so a resume must stay
  flag-less to keep it.
- A seat that still strays is found by the census on its next pass, not only
  at the spawn.
- The reasoning is the bg-seat-ergonomics design spec of 2026-09-23.
