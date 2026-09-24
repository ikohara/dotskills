---
id: "a14a"
title: recovering a `strayed` seat's commits beyond the Replace table's row
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-ergonomics S-7

The bg-seat-ergonomics design spec of 2026-09-23 deferred this by name, in
its "Deferred items": a seat the spawner's census finds outside the root is
`strayed`, and the Replace table's row replaces it, but nothing recovers the
commits such a seat may have made in the worktree it strayed into.

The spawner now turns the CLI's background isolation off per seat
(decision-6962), so a stray should be rare; this issue is the place to record
the first one that carries commits.
