---
id: "afed"
title: kisou's tidy slot is conditional in Step 2 and unconditional in Step 3's migrate prompt
severity: low
depends_on: []
blocks: []
claimed_by: tanto kisou-refresh (Kanri dotskills-28)
claimed_at: 2026-09-11T00:43:15Z
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
