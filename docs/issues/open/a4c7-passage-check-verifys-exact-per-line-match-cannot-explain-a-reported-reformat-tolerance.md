---
id: "a4c7"
title: "`passage-check.js verify`'s exact per-line match cannot explain a reported biome-reformat tolerance"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-15
updated: 2026-10-01
---

Source: inbox 2026-09-15-passage-check-verify-tolerates-reformatting

Reported from `kuchidome`'s `residency-retention` topic (Batch A, 2026-09-15,
`.tanto/inbox/2026-09-15-passage-check-verify-tolerates-reformatting.md` in
this repository): a plan's Global Constraints warn that `scripts\lint.bat`
reformatting a `P` block's quoted text is a plan defect that would desync the
next `verify` — "never absorb the reformatting silently, because the next
`verify` would then fail on a file that is in fact correct." Re-running lint
on Task 3's four files had biome rewrap one `assert.deepEqual(...)` call from
one line to three; `passage-check.js verify --task 3` still read clean
afterward, contrary to the warning's implied general risk. The reporter's own
guess was that the comparison is whitespace/AST-normalized.

That guess does not match what the code does. `verifyTask` matches a passage
via `findMatches` (`skills/tanto/scripts/passage-check.js:427-441`), which
compares the target file's lines and the block's `new` lines by exact,
line-by-line string equality — no whitespace or AST normalization anywhere in
the path. A biome rewrap that actually changes the matched lines' text should
make `findMatches` return zero matches and `verifyTask` report
`passage-absent`, exactly as the Global Constraints warn. The report's
observation is therefore unexplained by the visible code: either the
reformat did not actually land inside the matched span this time (a
reproduction gap, not a tool gap), or there is a real path through `verify`
that tolerates a reformat that the code above does not show.

Worth a closer reproduction before treating this as a fix: capture the exact
before/after text of the file at the matched lines and confirm whether
`findMatches`' literal comparison was truly exercised against the
reformatted text or against a copy lint had not yet touched. If the
tolerance turns out real, the fix is on the documentation side — narrow the
Global Constraints' warning to what actually breaks `verify` rather than
implying every reformat is at risk; if it does not reproduce, no code or
prose changes are needed. Either way this issue is where the finding lands.

Related: design-4807 (`passage-check.js`'s own design), exp-06b2.
