---
id: "ccd3"
title: "`skills/tanto/README.md` carries two drift gaps, both surfaced by one plan's reviews and both ruled out of its scope"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-19
---

Source: shoroku tanto-sweep-2

Found in the tanto-sweep-2 run and recorded in that run's ledger (S-43 and
the task 12 quality review's second minor). Both gaps were raised by that
plan's own reviews and both were explicitly ruled outside the reviewing task's
scope, so they are collected here for the README's next drift review rather
than filed one at a time.

- **The design-doc citation list is missing a pre-existing entry.**
  `2026-09-14-tanto-context-ceiling-design.md` is absent from the list, and its
  absence predates the tanto-sweep-2 plan entirely — it is standing drift, not
  something that run introduced.
- **The check-brief feature is never described in prose.** The README lists
  `shoroku-brief.md` in its templates bullet (task 12's own fix landed that
  line), but it never describes the check brief as a *feature*, the way the
  README describes its other named mechanisms. A reader meets the template's
  file name with nothing that says what it is for.

Both are the same shape — `skills/tanto/README.md` falling behind the skill it
documents — so one issue carries them to the same review.

**2026-09-17 — a third, cosmetic defect in the same file.** The designs list has
a doubled serial "and" across three items, the last of them interacting with the
pre-existing line above it, so two consecutive list lines both end in ", and".
Found by `shoroku-at-close`'s Task 9 review and confirmed still at that branch's
tip by its whole-branch review. It wants the same wording pass as the two gaps
above, whenever the list is next touched.
