---
id: "d0f4"
title: passage-check has no survivor form for an `O` block — a declared expected count instead of an implied zero
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-12
updated: 2026-09-19
---

Source: shoroku tanto-workspace

An `O` block in a passage plan names an old value the plan contradicts, and
`skills/tanto/scripts/passage-check.js` sweeps it with one implied
disposition: gone, a count of zero after the plan. `lint` enforces the same
reading from the other side — a needle that occurs in the plan's own
new-passage text fails `needle-in-new-text`, since a needle whose disposition
is "gone" must not be reintroduced.

A needle that **survives by design** has no form. The tanto-workspace plan of
2026-09-12 carries twenty-seven needles, and five of them survive inside its
own new passages — `.superpowers/sdd` and `plan-basename` in the SDD ledger's
path, the two default spec and plan locations now preceded by "by default",
and one kept sentence. Writing them as `O` blocks would make `lint`
permanently red on five known findings, so the plan counts them in prose:
Verification items 3, 4 and 5 state the expected per-file counts, `replay`
prints `DIFFERS` on each, and a human reads the `DIFFERS` lines against the
prose. Two more needles, substrings of those five, are grepped for absence by
hand for the same reason. Every needle is checked, but seven of twenty-seven
are checked by a reader rather than by the instrument, and the plan review
flagged the dichotomy (its Deviation 1 finding).

The fix is a survivor form for the `O` lead — a declared expected count, per
file or in total, in place of the implied zero, for example
``**O<id>** `<needle>` — stays at <n>: <why>``, so that `lint` accepts the
needle in new text when the declared count allows it and `replay`'s sweep
compares the count rather than asserting zero. The plan's own Global
Constraints names this as the better option and rules it out of scope because
no task of that plan touches `scripts/`.

Related: issue-58fe (a `W` block verified by nothing), issue-4f5c (`verify`
on a task with no passages), issue-2f17 (`replay`'s skip keys), the
tanto-workspace plan of 2026-09-12 (Global Constraints, "The `O` needles this
plan carries, and the seven it does not").
