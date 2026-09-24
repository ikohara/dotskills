---
id: "8808"
title: "a `replay-skip:` declaration silently defeats the same command in `boundary --plan`"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-ergonomics S-25

`skills/tanto/scripts/passage-check.js` reads `replay-skip:` declarations
once, in `extractReplaySkipPatterns`, and both `replayPlan` and
`boundaryPlan` use them. A skip meant for the scratch-tree dry run therefore
also skips the identically matched fenced command at every real boundary,
and there is no way to scope a declaration to the dry run alone.

`roles/keikaku.md`'s Step 4 guidance on writing "How a batch is verified"
does not warn of this, and it cost the bg-seat-ergonomics plan one rework
pass: a fenced `node --test skills/tanto/scripts/*.test.js` in that section,
declared skipped so that `replay`'s own dry run would not run it, was then
also silently skipped by every real `boundary --plan` run. It was moved to
prose, run by Kanri's own judgment. A future Keikaku drafting the same
section is likely to make the same mistake.

Two shapes for the fix, which need a choice: a scope word on the declaration
(dry run only, boundary only, both), or a warning in the guidance and in the
instrument's own output when a boundary skips a command. Related:
issue-1d95 (the declaration's grain is the fence, not the line) and
issue-2d69 (a declaration names a pattern, not its subject).
