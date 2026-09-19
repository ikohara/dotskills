---
id: "af82"
title: the tanto skill names one ADR in its text, so an ADR change is found only by a sentence sweep
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-19
---

Source: shoroku tanto-cost

Raised by the spec review (candidate 3) and deferred by the tanto-cost design
(`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`, "Deferred items"
9). `skills/tanto/` names exactly one ADR in its runtime text; every other
decision reaches the skill as unattributed prose. When an ADR is amended or
superseded, nothing in the skill points back at it, so finding the sentences
that have to change is a sweep of the prose rather than a lookup.

A candidate for design-4807's notation section — a convention for when a
skill's text may carry a `decision-<id>` and when it must not — deferred
there rather than settled here.
