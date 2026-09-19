---
id: "38f5"
title: a needle whose first character is `<` cannot be expressed — the placeholder rule reads the lead's content, and the drop is silent
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-19
---

Source: session 2026-09-13

Confirmed by the plan reviewer of the tanto-cost run (2026-09-13), reading
`docs/superpowers/plans/2026-09-12-tanto-cost.md`; recorded in
`.tanto/tanto-cost/plan-review.md`, "Shoroku candidates", under the lead
"**A needle whose first character is `<` cannot be expressed, and nothing
warns.**" The mechanism was first ruled on as the run's dry-run failure 4;
the reviewer verified it is still live.

`skills/tanto/scripts/passage-check.js` skips a lead as documentation when
**either** its id **or its content** starts with `<`:

```javascript
if (idBody.startsWith("<") || content.startsWith("<")) {
  // A lead whose id or path is a placeholder is documentation.
```

The id test is the real one — a lead written `**O<n>.<n>**` in a role file or
template is documentation. The content test catches a legitimate needle whose
first character happens to be `<`, which in this repository's Markdown and
template work is an ordinary thing for a needle to be. The lead parses, is
discarded, and nothing is reported: no `malformed-lead`, no count, no line.

The only signal left is a number in the plan's prose disagreeing with a
number in the output — and the tanto-cost plan then states that number
wrongly in one place (the review's finding 11), so the signal is disarmed in
both directions at once.

The fix is one condition: the placeholder rule looks at the **lead's id
only**, never at its content. A needle is then always either parsed or
reported.

This is a sibling of issue-7c11 — a needle the lead grammar cannot express,
dropped without a message — but a different code path and a different fix:
7c11's double-backtick delimiter would leave this case exactly as it is.
Filed separately for that reason.

Under contract rule 11. Related: issue-7c11, issue-d0f4, issue-87fd (the
count-in-prose signal this one relies on).

**2026-09-13, the same run's Sekkei, at the drafting stage.** The concrete
instance, found before the plan review ran and recorded as the run's dry-run
failure 4: `O22.45`'s needle was written `<lint|replay|diff|verify> --plan` —
the old usage line of `passage-check.js` itself, whose first character is an
angle bracket because that is how the usage line spells its subcommand list.
The lead parsed, the block vanished, and the sweep ran **63 of the plan's 64
needles**. Nothing in `lint` or `replay` said so; the only signal was
`replay` printing "63 residual `O` needles swept" against a prose count of 64,
noticed because the plan states its own block counts. The needle was re-cut to
begin at `lint`, which costs the opening bracket and works. The general shape
is worth keeping beside the fix: the needles most likely to start with `<` are
exactly the ones taken from a usage line, a template placeholder row or a
`<path>` form — the machine-readable text a plan most often contradicts.
