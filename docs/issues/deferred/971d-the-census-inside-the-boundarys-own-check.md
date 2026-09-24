---
id: "971d"
title: the census inside the boundary's own `check`
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
its "Deferred items": run `boundary.js census` inside the boundary's own
`check`, so that a stale tab row is noticed at every batch boundary.

It is not needed while a send error or the next handshake notices a stale
row. The trigger that would make it worth doing is a stale tab row that
neither of those noticed in time to matter.
