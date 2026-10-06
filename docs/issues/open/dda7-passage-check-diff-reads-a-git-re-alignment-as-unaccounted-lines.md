---
id: "dda7"
title: passage-check diff reads a git re-alignment as unaccounted lines
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-56

When a passage inserts about ninety lines before an unchanged function, git
aligns that function's first ten lines as removed and re-added, and
`passage-check.js diff` prints them as ten `unaccounted-added` and ten
`unexplained-removed` lines. Fence 7 then exits 1 for a tree that matches the
plan. In the run-owned-seats run this failed fence 7 at three boundaries
(batches B, C, and D), each accepted by a ruling (R-4 onward); the batch B
output is `.superpowers/sdd/2026-10-05-run-owned-seats/boundary-b-diff.out`.

A second instance (S-70, batch D): the heading `## Start sequence` in
`SKILL.md`, unchanged at the base and the head, printed as unaccounted-added
plus unexplained-removed once a passage inserted about forty lines after it.

Pairing identical removed and added lines as moved would make `diff` exact
and clear both instances together. Kin: issue-f1a4, the same subcommand's
large-range failure; the 1 MiB `maxBuffer` exit is issue-473e.

Carrier topic: `passage-check-hardening` — `diff`'s pairing of moved lines.
