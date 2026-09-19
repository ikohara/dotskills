---
id: "bb86"
title: a dogfood whose measurement is a dialogue runs with pre-decided answers, and the plan does not say which it is measuring
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-09-19
---

Source: shoroku kisou-refresh

Measured in the kisou-refresh run (2026-09-11, batch C). The dogfood task ran
`起草して migrate` against this repository, and every answer in the dialogue —
confirm the detection, decline every script slot, docs-only scope, accept
both items — was the batch prompt's pre-decided answer, given by Jisso itself
in place of a user, because under `tanto` Jisso has no human access. The run
measured the skill text against fixed answers, not a live user, and the
report says so in its opening paragraph. Nothing in the plan said which of
the two it wanted.

A dogfood whose measurement *is* a dialogue wants one of two things stated
up front: either the plan says that fixed answers are the measurement (and
lists them, so the run is reproducible and the reviewer can check the answers
against the prompts), or Kanri grants a human window for the run, so a live
user answers the prompts and the skill text is measured against what a user
actually types. Today the first happens by default and silently; the second
has no mechanism.

Related: req-04f5, design-4807 (Jisso has no human access), the kisou refresh
dogfood report at `docs/reports/2026-09-11-kisou-refresh-dogfood.md`.
