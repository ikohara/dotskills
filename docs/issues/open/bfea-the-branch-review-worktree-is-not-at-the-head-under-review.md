---
id: "bfea"
title: the `branch.review` dispatch does not say where replay runs or where the report goes when its worktree is not the shared checkout
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku bug-report-hold S-66

`roles/kanri.md`'s "The final batch" step 1 dispatches the whole-branch review
into an isolated worktree and forbids `cd` to the repository root, but says
nothing about where `replay` runs or where the report is written when that
worktree is not the shared checkout.

Measured on `bug-report-hold`: the review worktree sat on `main`, not at the
head under review. The plan file the replay command names did not exist there;
the requested output path under `.tanto/<topic>/` did not exist there either;
and the shared checkout's copy is write-blocked from an isolated worktree. The
reviewer improvised — a detached scratch worktree at the head commit under the
scratchpad to run the replay, removed afterwards, and the report written under
the review worktree's own `.tanto/<topic>/`, which is a path Kanri did not name
and did not read from.

The decision this needs is which of the two mechanisms the skill adopts:
check the `branch.review` worktree out **at the head commit**, so the plan and
the output path both exist; or leave the worktree where it is and have the
dispatch prompt name both paths — where the replay runs, and where the report
goes. Improvising per dispatch is what produced a report at an unnamed path.
