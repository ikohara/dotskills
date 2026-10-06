---
id: "a42b"
title: "`passage-check.js boundary` names every fence by the same guard line, so a `fail` names no fence"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-07
updated: 2026-10-07
---

Source: shoroku tanto-feedback S-102

`passage-check.js boundary` prints each fence by the first line of its
command. Every fence of the tanto-feedback plan opens with the same
`git rev-parse --show-toplevel >/dev/null || exit 1` guard, so the output
reads `pass 3: git rev-parse …` through `fail 8: git rev-parse …` and names
no fence. The plan itself had to say that a `fail` line names the check, not
the fence, and that check N is fence N-1; reading the verdict means counting
against the plan's numbering, in every boundary verdict of a guarded plan.

Direction: print a title for each fence — its bold lead-in in How a batch is
verified, for example `7. The passages against the branch` — so the failing
fence is legible without the plan open.

Not covered by issue-45f8 or issue-621b, which are about the exit code.
