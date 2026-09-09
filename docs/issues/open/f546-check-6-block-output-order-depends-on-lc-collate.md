---
id: "f546"
title: check 6's sixth block has an output order that depends on LC_COLLATE
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-09
---

The sixth block of check 6 in `docs/notes/tanto-consistency-checks.md` counts
the two routed lines and the idle subscription per file:

```bash
for f in skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/*.md skills/tanto/templates/*.md; do
```

The globs expand in the shell's collation order, and that order is not fixed.
During the review-brief run two executions on **the same machine** disagreed on
whether `skills/tanto/templates/kanri.md` or
`skills/tanto/templates/kanri-handover.md` came first — the difference between a
locale that ignores the hyphen and one that does not. Both runs printed the same
fifteen lines with the same values.

Nothing fails today. The block's Expected text names the three non-zero lines
and closes with "every other line ending `review-ready 0 brief 0 idle 0`", which
is order-independent, so the check is decided by a set rather than by a
sequence. The trap is latent: a future check that diffs this block's output as
**text** — against a recorded baseline, or between two trees — would flap on the
locale rather than on the tree.

This is the shape of every `*.md` glob loop in the note, not something the
review-brief plan introduced; the fix wave only widened this one loop's file
list. Two fixes are available if it ever matters: pipe the expansion through
`LC_ALL=C sort`, or state in the note that the block's output is a set and must
never be compared as ordered text. The second is cheaper and matches how the
Expected text already reads.

Related: `docs/notes/tanto-consistency-checks.md` (check 6), design-4807 (plan
conventions — a check two files must agree on is one block cited, not two
copies).
