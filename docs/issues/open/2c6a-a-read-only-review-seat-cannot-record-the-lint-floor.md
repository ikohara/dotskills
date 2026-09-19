---
id: "2c6a"
title: a read-only review seat cannot record the lint floor, and the reviewer brief does not name the non-fixing form
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-09-19
---

Source: shoroku kisou-refresh

Measured at the kisou-refresh whole-branch review (2026-09-11).
`./scripts/lint.sh` runs pre-commit, and several of its hooks rewrite files
(markdownlint runs with `--fix`, mixed-line-ending with `--fix=auto`, and
the whitespace and end-of-file hooks fix what they find). A review seat that is told both "run lint" and "do not mutate the tree"
cannot obey both: running the repository's lint entry point may change the
tree it is reviewing, and refusing to run it leaves the lint floor
unrecorded in the review.

The reviewer can run the non-fixing hooks individually — each by id without
`--fix`, or the markdownlint-cli2 from the pre-commit cache on a scratch copy,
as `docs/notes/tanto-consistency-checks.md`'s check 9 describes — but the
role text and the reviewer brief do not say so, so each reviewer rediscovers
the constraint or picks one of the two instructions to break. The fix is one
sentence in the reviewer brief naming the non-fixing form the seat is to use.

Related: req-04f5, design-4807 (the review brief), issue-4eef (another
boundary-time measurement from the same run).
