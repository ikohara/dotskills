---
id: "52fd"
title: the apply half of shoroku on sonnet, the second measurement's first variable
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-16
---

Deferred by the tanto-cost design
(`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`, "Deferred items"
4). The `shoroku` kind runs on `opus` for both halves under the defaults of
decision-03f9, and it is the most frequently dispatched top-family kind —
recommend and apply at T1, T2, and every exit. The apply half is the most
clerical of the twelve kinds: it writes the accepted subset from a
recommendation that already quotes every item in full, lints the changed
paths, and commits once.

So it is the first variable the second measurement should change: the apply
half to `sonnet`, with the recommend half on `opus` — its placement as of the
`tanto-sweep-2` run's R-20, corrected here because the premise this item was
originally written against no longer holds. Not changed now, because the first
measured run has to establish the baseline it would be measured against.

**2026-09-16, the `tanto-sweep-2` run — the second measurement's order is now
partly executed, with two deviations and one reversal.** decision-03f9 records
an order for the second measurement; what has actually been put in place
departs from it at three points, recorded here rather than against the ADR,
whose accepted body is not rewritten:

- **`brief.write` went to `sonnet`, not `opus`** as the recorded order has it.
- **`plan.coldread` went to `opus`**, which the recorded order does not list at
  all.
- **The recommend half went to `opus`** (R-20) — a reversal of the at-close
  design, and the configuration this very topic's own T2 dispatch runs under.

The reversal is why the sentence above was corrected. Taken together these
mean the second measurement, when it is read, is not measuring the variable
set decision-03f9 names: three of its inputs moved for reasons outside the
measurement's own design, and a reading that assumes the recorded order will
mis-attribute the difference.
