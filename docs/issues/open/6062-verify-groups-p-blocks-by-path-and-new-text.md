---
id: "6062"
title: "`verify` groups P blocks by (path, new-text), so two identical legitimate passages fail"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku bug-report-hold S-61

`passage-check.js verify`'s occurrence counting groups `P` blocks by the pair
`(path, new-text)`, with no per-block attribution. Two independent,
legitimately identical passages therefore collide and produce a false
"expected 1, found 2".

Measured: P16.4 and P16.9 of the `bug-report-hold` plan both insert the same
literal `grep` line into two different consistency checks in the same file.
Both landed correctly; `verify` failed them, and the failure had to be ruled
past by hand (R-12).

Same family as the instrument's other blind spots — `verify` not reading `W`
blocks, and an anchor's `before:` value never being evaluated (issue-e2b1) —
but a distinct mechanism, and distinct from issue-a449, which is a later task
rewriting an earlier span.

Two fixes, either sufficient: associate several `P` blocks that share one new
text with their own expected counts, or document an escape hatch for this exact
shape so the ruling does not have to be reconstructed each time.
