---
id: "55a3"
title: a non-fast-forward plan-close merge has no named pre-flight check
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-19
---

Source: session 2026-09-17

A real, reproduced merge divergence this run's own precedent didn't cover.
Every earlier plan close in this run merged with `--ff-only` because `main`
had not moved since the branch cut. This close's own `main` had moved by one
commit (this Kanri's own between-plans exit, made *after* the branch cut but
*before* the merge) — the first case this run measured where the merge is a
real three-way merge, not a fast-forward.

`git merge-tree` before the real merge (no working-tree risk) was the right
check and worked cleanly; worth naming in the Workspace section as the
general form ("the merge decision is the human's" already covers the choice,
but not the pre-flight check for the non-fast-forward case).

The adjacent case that produced this divergence is issue-c3a9 — a
between-plans intake commit landing on a concurrent topic's freshly cut
branch.
