---
id: "a881"
title: a worktree's Windows file lock defeated the sanctioned cleanup and every fallback
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-10-04
---

Source: shoroku bg-seat-fixes S-24

At `bg-seat-ergonomics`'s landing, `git worktree remove --force --force` on
`.claude/worktrees/shoki-bg-seat-ergonomics` succeeded at the git level —
the path dropped out of `git worktree list` — but left the directory on
disk with `Permission denied`. A plain recursive delete (`rm -rf`) was
refused by the sandbox's own deny pattern, and the PowerShell equivalent
(`Remove-Item -Recurse -Force`) was refused in turn by the auto-mode
classifier.

`roles/kanri.md`'s "Shusei, shoki, and the landing" step that removes the
worktree `claude rm` leaves locked assumes the command succeeds outright. On
this host it needed the human's own hands, so every close on this host
blocks on the human at that step until something changes.

Two repairs: a documented Windows caveat in "Shusei, shoki, and the
landing" naming the leftover directory and who removes it, or a
narrower-scoped delete permission that a landing Kanri can actually use.

Related: issue-4724 (the auto-mode classifier blocks sanctioned Kanri acts),
which carries the classifier's half of the same denial.

**A pruned worktree's directory stayed with no process in it** (shoki-seat
S-19, 2026-10-03). A probe worktree cut by hand for the shoki-seat design
(`probe-g`) was pruned, and its directory stayed on disk hours later with no
process whose cwd was inside it. That is this issue's shape without a shoki,
which weakens "the shoki process holds the lock" as the whole account and
leaves the mechanism open. The shoki-seat design closes this issue only if
its landing's removal of shoki's worktree returns without
`Permission denied`; that measurement is the landing's, and is recorded with
the close's records.
