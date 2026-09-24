---
id: "a881"
title: a worktree's Windows file lock defeated the sanctioned cleanup and every fallback
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
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
