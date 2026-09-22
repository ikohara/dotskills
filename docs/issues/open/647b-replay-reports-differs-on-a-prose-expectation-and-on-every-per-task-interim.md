---
id: "647b"
title: "`passage-check.js replay` reports `DIFFERS` on any prose Expected and on every per-task interim expectation, so most of its `DIFFERS` lines are noise"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-22
---

Source: shoroku shoroku-at-close

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

**2026-09-20, `bug-report-hold` — three faces of one missing idea, and the
count of the environmental noise.** All three came out of the same plan, and
they are the same gap seen from three sides.

- **The anchor side.** `replay` applies every task's passages to one synthetic
  tree *before* checking any anchor, so it compares every `after:` against the
  plan's **final** state regardless of which task declares it. A mechanism two
  tasks build up therefore fails on a correct interim value: `roles/kanri.md`'s
  `sent/` count goes `0 → 1` at Task 9 and `1 → 2` at Task 14, so A9.2's
  `after: 1` is exactly what `verify --task 9` sees on the real tree at batch
  C's boundary — and `replay` reports it as a mismatch expecting `1` and
  finding `2`. Nothing is wrong.
- **The grammar side.** The plan grammar has no way to say "superseded by
  A15.x", so a later task's legitimate supersession of an earlier anchor
  (A9.2 by Task 15's `MATCH … -ge 2`) can only print as a failure.
- **The environmental side, measured.** `replay`'s command stage runs every
  stated command in the applied tree, which has no `.git`, no `scripts/`, and
  none of the paths the plan does not write. For a documentation plan that
  makes nearly every `W` or verification command print `DIFFERS` for
  environmental reasons: **42 of 42 on this plan, all noise**, burying the
  handful whose `actual:` is a real content value.

Two mechanisms close all three. A `--through-batch` (or `--through-task`) mode
that replays only up to a cut, which also fixes issue-e2b1's unread `before:`
value; and either a `--repo <checkout>` option or a "needs git / needs paths
outside the written set → skipped" classification, like the one `replay`
already has for `git` fences, so the output is readable at all.

**2026-09-22, `tanto-bg-seats` — a second cause, and a remedy the plan author
writes.** This run's replay printed `DIFFERS` 22 times on a run with **zero**
passage failures. Two causes, both structural: the fences that sweep for the
*old* text before an edit run in the *applied* tree, where those needles are
already gone by construction; and a multi-line output compared to prose by
substring, the shape already measured twice above.

The first cause is new here, and it points at a remedy none of the fixes above
names. Rejected alternative, with its reason: tightening the comparison inside
`passage-check.js` would turn a crude but honest "look here" into a false
`MATCH`. What helps instead is a fence annotation the plan author writes —
`before:` / `after:` — so that `replay` knows which sweeps it should expect to
read zero. That puts the knowledge where it exists: the author knows which side
of the edit a sweep belongs to; the instrument cannot infer it.
