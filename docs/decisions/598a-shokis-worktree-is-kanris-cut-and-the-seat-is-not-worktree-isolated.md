---
id: "598a"
title: shoki's worktree is Kanri's cut, and the seat is not worktree-isolated
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-04
updated: 2026-10-04
---

## Context

decision-26fd admits one worktree, for the close's scribe, and never says who
cuts it. The `-w` form lived in the bg-seats and bg-seat-ergonomics designs
and the skill text alone: the spawner ran shoki as `claude --bg -w`. A `-w`
session is worktree-isolated, and the harness refuses two kinds of act in it
— an Edit of a path in the main checkout, and a git command it cannot verify
as staying inside the worktree. The shoki brief has the apply fill the
Triage section of every swept inbox copy in the main checkout and the review
write its file there; under `-w` both are refused, and the 2026-10-03 close
landed with the swept copies' Triage sections unfilled. A probe that ran a
seat with a Kanri-cut worktree as its cwd and no `-w` wrote into the main
checkout unrefused. Decided in the shoki-seat design of 2026-10-03.

## Options

- **Kanri cuts the worktree; the spawner runs the seat with it as cwd and no
  `-w`** (chosen).
- **Keep `-w` and fix the prompt order alone** (decision-b282). Rejected: the
  isolation guard stays, so every close's Triage fill and review file fail as
  2026-10-03's did.
- **Sanction a shell write around the Edit guard.** Rejected: the brief would
  tell a seat to bypass a harness rule, and the rule may extend to shell
  writes in a later CLI.
- **`EnterWorktree` with `path` after an ordinary spawn.** Viable — a
  background seat has been measured entering a worktree — but the session is
  worktree-isolated by construction, so the guard returns and the brief's
  writes would move to Kanri. Kept as the fallback below.
- **Move the inbox Triage fill to Kanri now.** Rejected as unneeded once the
  seat is not isolated; it rides with the fallback.

## Decision

In the merge act Kanri runs
`git worktree add <root>/.claude/worktrees/shoki-<topic> -b worktree-shoki-<topic> main`,
removing first a worktree or branch of that name a crashed close left. The
spawn request's `worktree` field keeps its name and now names that directory;
the spawner runs `claude --bg` with it as the child's cwd and passes no `-w`
for any seat. The seat is an ordinary session whose cwd is a worktree, so the
brief's writes into the main checkout and its `git rebase main` need no
change. The bg-seat-ergonomics design's setting
`--settings '{"worktree":{"bgIsolation":"none"}}'` stays on every spawn,
shoki's included.

**The fallback**, if a later CLI isolates a session on detecting that its cwd
is a worktree: `EnterWorktree` with `path` after an ordinary spawn, with the
inbox Triage fill moved to Kanri (from the direction file, at the landing) and
the review file written inside the worktree.

## Consequences

- decision-26fd stands whole; this decision supplies the cut it left unsaid.
- The worktree's branch is Kanri's own from its cut, so the landing's
  `git worktree remove --force --force` and `git branch -D` stand as written;
  `claude rm` leaves a worktree it did not cut.
- The seat's transcript lands under the worktree's project slug.
- The listing's key had to stop resting on the CLI's `--cwd` filter, which is
  unmeasured for a seat whose cwd is a worktree; the three readers now share
  the listed-`cwd` test design-4807 describes.
