---
id: "2764"
title: the repository pins Node 22 in prose and nowhere in a file
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-ergonomics S-28

The ledger assigned S-28 twice; this is the row whose source is
`batch-A-verdict.md`.

`CONTRIBUTING.md` says the tanto plans test on the pinned Node 22 via mise,
and a plan's Tech Stack line repeats it ("Node 22 with no dependencies"). No
`.mise.toml` or `mise.toml` in the repository pins it. At the
bg-seat-ergonomics batch A boundary, `node --version` read `v24.16.0`: mise
listed 22.23.2, 24.15.0, and 24.16.0, and the shell's active node was the
user's global `lts` pin. The suite passed in full under it.

A decision is needed: commit a mise pin for Node 22, or drop the claim from
`CONTRIBUTING.md` and the plans' Tech Stack lines.
