---
id: "bf3e"
title: The background suite rule and the foreground-only dispatch rule meet at every task
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-51

A skill-editing plan's Global Constraints say, under "Running the suite and
the boundary", that every suite and test-file run goes to the background;
`roles/jisso.md` says, in three sentences for every implementer and reviewer
dispatch, foreground only and never a background job. The two meet at every
task's Steps 4 and 5, and a Jisso must rule on them again each time. In the
run-owned-seats run the Jisso ran the long command itself, after the
implementer's commit.

To decide: where the rule lives — the batch prompt template or
`roles/jisso.md` — and that it says who runs a long command.

Carrier: Kept — `roles/jisso.md` and the batch prompt template.
