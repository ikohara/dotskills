---
id: "5a81"
title: a fable reviewer, measured through the personal tanto.json overlay before decision-9a3a's review tier changes
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-19
---

Source: shoroku review-brief

Raised by the human in the review-brief spec dialogue (2026-09-08, D-1): would
writing on `opus` and reviewing on `fable` be better and cheaper than the
defaults? The spec answered from the cached price table of the Claude API
skill (2026-06-24): a review is input-heavy and short, and `fable` is twice
the price of `opus` per token on both input and output (10 and 50 against 5
and 25 dollars per million), so it would be neither cheaper nor faster; a
top-family subagent is also what a real run lost to a rate limit
(decision-9a3a). The write half of the question is already the default —
`subagents.drafter` is `opus` in `templates/tanto.json` and the implementers
are `sonnet`; the top family writes only the spec, which is the design
judgment itself. So the defaults stayed, and the brief writer runs on
`subagents.reviewer`.

What is deferred is the measurement, not the argument. Run one or two
reviews on `fable` through the personal `tanto.json` overlay
(`subagents.reviewer: fable`), record whether a 429 occurs and how long the
review takes against the `opus` baseline, and only then decide whether
decision-9a3a's consequence — every review runs one tier below the top
family — should change. A change would be a superseding or amending ADR,
not an edit to the defaults.

Baselines to compare against, from the review-brief run: the spec brief on
`opus` took about 3 minutes and 78k subagent tokens for a 758-line spec plus
inputs; the plan brief about 6 minutes and 110k tokens for a 3087-line plan
plus the spec (the review-brief ledger's Measurements, 2026-09-08 and
2026-09-09).

Related: decision-9a3a, decision-08bc, req-04f5 (model discipline), and the
review-brief design of 2026-09-08 (Fixed inputs, "The models stay as they
are").
