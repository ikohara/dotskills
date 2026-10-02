---
id: "5e63"
title: "three untested behaviors in `passage-check.js`'s new subcommands are exactly where the whole-branch review found real defects"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-10-03
---

Source: session 2026-09-14

Found by the tanto-cost whole-branch review (2026-09-14), naming a pattern
rather than a single defect.

Three behaviors the shipped skill's prose depends on are unpinned by any
test in `passage-check.test.js`, and one of them is the exact failure mode
behind the whole-branch review's Critical finding (fixed directly in the
fix wave, not filed):

1. **`sections`' exit code when a named heading is absent from an
   otherwise readable file.** The suite covers "no heading named at all"
   and "file unreadable" (both exit 2) but not "heading absent, file
   fine" (exit 1, no output) — which is exactly the shape that let
   `shoroku`'s bold-label recommendation groups silently fail every
   `sections --file <rec> unsure` call. A test asserting this exit/output
   pair would have caught the mismatch between `shoroku/SKILL.md`'s
   format and `roles/kanri.md`'s reading instruction before either landed.
2. **Heading matching is exact and case-sensitive.** Nothing asserts that
   `Unsure` ≠ `unsure`. A test pinning this as a contract, not an
   implementation detail, would make the case-sensitivity a stated
   guarantee rather than a surprise the next reader has to discover by
   reading `findSection`'s source.
3. **`boundary`'s surprising half: output contradicting a fence's
   `Expected:` paragraph still exits 0 and reads `pass`.** Only the
   converse (output matching, exit 0, `pass`) is tested. A test for this
   direction would turn the whole-branch review's `I1` finding — that
   `boundary` never compares against `Expected:`, only judges exit status
   — into an executable statement instead of something a reviewer has to
   trace through the source to confirm.

None of these are code defects by themselves — `sections` and `boundary`
both behave as designed in every case above. The gap is that the design's
own least-obvious behaviors (a partial-absence exit code, case
sensitivity, an intentionally-ignored field) are exactly the ones with no
test holding them in place, and this run measured that the first and
third of the three are also where real, shipped documentation went wrong.

Related: the whole-branch review's Critical and Important findings (fixed
in the fix wave), issue-2d84 (the dead `expectation` field these tests
would pin).

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
