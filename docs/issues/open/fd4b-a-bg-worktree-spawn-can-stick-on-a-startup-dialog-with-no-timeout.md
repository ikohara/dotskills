---
id: "fd4b"
title: a `--bg` worktree spawn can stick on a startup dialog, and the close waits on it with no timeout
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-22
updated: 2026-09-22
---

Source: shoroku tanto-bg-seats S-45

Task 13's measurement is the first hard evidence that a `--bg` worktree spawn
can fail in a way distinct from every previously catalogued block — not
`bgIsolation`'s Write guard, not a permission prompt, not the cwd-relocation
incident, but a permanent "stuck on a startup dialog" state that pre-empts the
prompt entirely. The session exists and is listed; it simply never reads what it
was started with.

The landed close takes exactly that path: it spawns shoki through a fresh
worktree and waits on its first turn. Nothing in the design detects this state
or times out of it, and the close is the one stretch that runs unattended by
construction (decision-26fd). A close that meets this failure mode waits
forever, and the human learns of it only by looking.

What needs deciding: whether the spawner's census can distinguish this state
from an ordinary slow start, and what the close does when a spawned seat's first
turn has not arrived within some budget.

Related: issue-7fa4 (a hung foreground call is invisible to every notice the
design has — the same blind spot from the seat's side).
