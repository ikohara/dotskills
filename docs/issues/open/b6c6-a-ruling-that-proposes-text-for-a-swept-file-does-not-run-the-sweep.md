---
id: "b6c6"
title: A ruling that proposes text for a swept file does not run the sweep
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-97

The run-owned-seats boundary caught what two review halves did not. Item 26's
README sentence was text Kanri's batch D verdict proposed, applied verbatim as
R-11 asked; it passed the spec half and the quality half, and then failed the
plan's whole-skill sweep, a fixed-string `git grep` for the backticked word
`cleared`. Neither reviewer's brief named the sweep, and the fix wave went
back for a rework.

To decide: either a ruling that proposes new text for a swept file runs the
sweep on its own text first, or the reviewers' briefs name the sweep's fixed
strings.

Carrier: Kept — a ruling and review-brief practice in `roles/kanri.md` and
`roles/jisso.md`; the sweep is the plan's own fence, not the instrument.
