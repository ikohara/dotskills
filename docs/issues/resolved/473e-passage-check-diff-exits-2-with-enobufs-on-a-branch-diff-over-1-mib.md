---
id: "473e"
title: passage-check diff exits 2 with ENOBUFS on a branch diff over 1 MiB
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-07
---

Source: shoroku run-owned-seats S-59

`passage-check.js` reads `git diff <base>` (line 871) through `execFileSync`
with Node's default 1 MiB `maxBuffer`, so the instrument exits 2
(`spawnSync git ENOBUFS`) once the branch's diff passes 1 MiB. The
run-owned-seats branch's diff reached 1,109,122 bytes at batch C, because the
plan (14,920 lines) and the spec (2,073 lines) are in it; line 586
(`git show <base>:<path>`) has the same default. The boundary's fence 7 reads
exit 2 as a failure and prints nothing else, hiding even the known
re-alignment lines of issue-dda7. From batch C on, every boundary ran the
fence again under a preload that widened the buffer.

The fix, as ruled: one named constant for `maxBuffer` with a comment naming
the ENOBUFS at Node's 1 MiB default, passed to both `execFileSync` sites
(64 MiB is enough); lint on the path and no new test. `diff` should also say
"output too large" rather than print the Node error text. Commit subject in
the shape `fix: passage-check diff reads a branch diff over 1 MiB without
ENOBUFS`.

Carrier: the hotfix lane, taken on `main` right after the run-owned-seats
close's merge and before the next topic opens, per R-9 and the human's ruling
of 2026-10-06 (the three rulings, item 3); not a `fix` of that close, since
the plan's fences forbade touching the file on the branch.

Resolved by the hotfix lane on main, 2026-10-07: both `execFileSync` git reads in `passage-check.js` (the base-file show and the branch diff) pass one named `maxBuffer` constant of 64 MiB, so a branch diff past 1 MiB no longer exits 2 with ENOBUFS. Not done, and not needed for the symptom: `diff` still prints the Node error text rather than "output too large" once a diff passes 64 MiB.
