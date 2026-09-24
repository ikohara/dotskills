---
id: "29fd"
title: "`passage-check.js verify --task N`'s anchor check is unconditional"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-fixes S-18

`skills/tanto/scripts/passage-check.js`'s `runVerify` checks a task's `A`
blocks' live command output against their declared `after:` value whether
or not that task's own `P` / `W` blocks have landed. So `verify --task N`,
run against a pristine, pre-landing tree for any task that carries an
anchor, always reports a spurious `anchor-after` mismatch: the anchor reads
true only from within that task's own Step 3, after its own Step 2 has
applied the edit. The `bg-seat-fixes` plan's Task 11 (`A11.2`) surfaced it
during the Keikaku's post-review reverify, reproduced twice.

The same plan's review (`.tanto/bg-seat-fixes/plan-review.md`, "What was
checked") states that `verify --task N` for N in 1-12 reported only
`passage-absent` for the new passages, with "no old-text or anchor
complaint" — a claim the Keikaku's own direct rerun of the identical
command contradicted. Which run is the artifact (a stale run, a different
tree state, a summarization slip) is not determined. A reviewer's "ran live
and it matched" deserves an independent spot-rerun before it settles a
verdict, the same discipline a "Checked and fine" section applies to
everything else.

The repair is a doc-comment on `runVerify` or a `SKILL.md` note, so that a
future Keikaku reads the spurious failure correctly on sight, or the anchor
check gated on the task's own passages having landed.

Related: issue-3e94 (an anchor's needle is measured before the edit and
never against its own new passage) and issue-a449 (`verify` goes red when a
later task rewrites an earlier task's span), the anchor's other two timing
defects.
