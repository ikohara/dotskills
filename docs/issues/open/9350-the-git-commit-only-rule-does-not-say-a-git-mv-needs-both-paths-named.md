---
id: "9350"
title: "the repository's `git commit --only` guidance does not say that a `git mv` must name the old path as well as the new one"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-19
---

Source: shoroku shoroku-at-close

Measured on `shoroku-at-close`'s Task 11, where the implementer self-caught and
self-corrected the mistake mid-task. Its first commit named the **new** path of
a `git mv` — an issue's move into `docs/issues/resolved/` — but omitted the
**old**, now-vacated path, leaving a stale duplicate object in `HEAD` until a
second, explicit fix-up commit named exactly that one path. It was caught by the
implementer itself through an ordinary `git status` and `git show HEAD:<path>`
sanity check before handing back, not by a reviewer.

The repository's own `AGENTS.md` says to commit by explicit path with
`git commit --only <paths>` and that new files need `git add` first. It says
nothing about a rename, where `--only` needs **both** sides named or the commit
is silently incomplete. This recurs at every issue status move, and a shoroku
close that resolves a batch of issues performs many at once — this very close
performs thirteen.

`AGENTS.md` is repo-root Markdown an agent may not edit without approval, so
this is filed for the human to approve rather than applied directly. One line
is enough.

Worth keeping as a positive data point for `subagent-driven-development`'s own
self-review guidance too: an implementer's post-work sanity check caught a
`--only`-specific failure mode this repository's workflow is otherwise silent
about.

A documentation gap, not a user-stated need, so no paired requirement.
