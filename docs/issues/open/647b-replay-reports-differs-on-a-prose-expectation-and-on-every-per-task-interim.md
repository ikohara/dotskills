---
id: "647b"
title: "`passage-check.js replay` reports `DIFFERS` on any prose Expected and on every per-task interim expectation, so most of its `DIFFERS` lines are noise"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

Measured by `shoroku-at-close`'s whole-branch review. `replay` reports
`DIFFERS` on any fence whose Expected is prose or holds more than one literal,
and on every per-task interim expectation, because it applies all passages
first and then compares against the end state. Seven of that plan's nine
`DIFFERS` lines were false positives — enough noise to hide a real drift in the
other two.

Two fixes, either of which closes it, both named in the review's own
Recommendations:

- an `Expected-literal:` marker, so a fence declares that its Expected is an
  exact literal and everything else is not compared that way;
- a per-task replay, so an interim expectation is compared against the state
  that task actually produces.

Adjacent but not the same: issue-a4e2 is `replay`'s noise on every skip line,
not the `DIFFERS` comparison.

For `passage-check-hardening`'s instrument list.

A tooling gap, not a user-stated need, so no paired requirement.

**2026-09-18, `seat-lineage` — the figure for a second plan, and a concrete
`MATCH` rule.** Ten of ten `DIFFERS` lines on that plan were benign: every one
came from a multi-file `grep -c` fence, where the `Expected:` is a prose
statement and the actual output is one line per file. The comparison is an
artifact of the prose-against-multi-line shape, not a mismatch. Against the
seven of nine one topic earlier, that is a second measurement in the same
direction and a larger absolute count of noise.

A third fix, narrower than the two above and sufficient for this shape: treat
an `Expected:` of the form "`N` on each of the files" as a `MATCH` when every
output line carries `N`.
