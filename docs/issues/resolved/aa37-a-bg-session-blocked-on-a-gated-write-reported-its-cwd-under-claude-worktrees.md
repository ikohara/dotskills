---
id: "aa37"
title: a `claude --bg` session blocked on a gated Write reported its cwd under `.claude/worktrees/` with no `-w` flag — the single tree is not established
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-23
---

Source: shoroku tanto-diet S-30

An unplanned finding of the background-seats probe. A `--bg` session running
under `manual` mode, blocked on a Write, reported its `cwd` under
`.claude\worktrees\<generated-name>` — with no `-w` flag given anywhere. The
premise "no `--worktree` keeps the single tree" is therefore **not
established**, and every worktree-free rule of the skill rests on it.

Medium because a seat that landed in a hidden worktree commits to a tree
nobody watches: the commit is not on the branch the roster says the run is on,
no lint or replay of the main checkout sees it, and the human finds it, if at
all, by noticing a missing commit.

Two responses, and only the first is a fix:

1. **Re-verification.** The follow-on topic re-runs this under the exact mode
   and tool set a real Jisso batch runs with, before anything relies on the
   single tree.
2. **An interim guard, not a fix.** Kanri compares a spawned seat's `cwd`,
   from `claude agents --json`, against the main checkout at the handshake and
   stops a seat that landed under `.claude/worktrees/`. It costs one field
   read against a column the roster already has, and it is the design's answer
   while the cause is unknown — it does not remove the cause.

Related: issue-0673 (a Kaiseki in a worktree) and issue-1bff (a fresh Jisso's
own branch checkout racing a concurrent topic's apply).

Resolved by the bg-seat-ergonomics design
(`docs/superpowers/specs/2026-09-23-bg-seat-ergonomics-design.md`, 1.2 and
1.4). The cause was the CLI's default `worktree.bgIsolation`: a seat's first
Write fails its guard, and the model moves the seat into
`.claude/worktrees/` with `EnterWorktree` — reproduced with no `-w`. The
spawner passes `--settings '{"worktree":{"bgIsolation":"none"}}'` on every
spawn, which a flag-less resume keeps, and its ad hoc-worktree guard now
runs at every pass of the spawner's census rather than at the first sighting
alone.
