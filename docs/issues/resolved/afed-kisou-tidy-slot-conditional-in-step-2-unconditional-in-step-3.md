---
id: "afed"
title: kisou's tidy slot is conditional in Step 2 and unconditional in Step 3's migrate prompt
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-11
---

Found in the requirement-extraction plan review (2026-09-09), while writing the
stand-in answers for a `kisou migrate` run on this repository.

`skills/kisou/SKILL.md` Step 2 says to "offer `scripts/tidy` (clang-tidy) only
for clang + CMake projects", while Step 3's migrate prompt lists the script
slots the repository lacks — `build` / `test` / `lint` / `tidy` — and lets the
user opt into any, with no condition on `tidy`. On a repository that is not a
clang + CMake project the two steps disagree about whether `tidy` is offered,
so a migrate run's prompt is not predictable from the text: the
requirement-extraction plan has to write "and `tidy` if kisou offers it" into
its decline list.

The fix is to state the condition once and have the migrate prompt reference
it, or to drop the condition and offer `tidy` everywhere as an opt-in.

Related: req-1a2b, design-c1d2, issue-ad1a.

Resolved by the kisou refresh design spec of 2026-09-11, fixed input 6: the
condition is stated once, in Step 2, as a `CMakeLists.txt` at the repository
root, and Step 3's migrate prompt refers to it. Measured on 2026-09-11: the
scripts prompt offered `setup`, `run`, `build`, and `test`, and did not offer
`tidy`, on that condition (`ls CMakeLists.txt` → none) —
`docs/reports/2026-09-11-kisou-refresh-dogfood.md`.
