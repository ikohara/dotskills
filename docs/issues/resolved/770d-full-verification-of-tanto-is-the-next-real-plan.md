---
id: "770d"
title: full verification of tanto is the next real plan run under /tanto
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-06
updated: 2026-09-07
---

The tanto implementation plan of 2026-09-06 verifies a Markdown-only skill by
lint, structural greps against the design and the superpowers 6.3.0 text, a
JSON and a YAML parse, and a handshake smoke test the human runs by hand. None
of that exercises a batch loop, a Kaiseki case, a session replacement, or a
recovery after a VS Code restart.

Full verification is the first real plan run under `/tanto`, with its
conductor ledger as the record; that ledger's Measurements table also feeds
issue-9a68 and issue-15bf. Deferred until the skill has landed on `main`.

Resolution (2026-09-07): the dogfood ran. The kanri-lifecycle plan was the first
plan conducted entirely under `/tanto` — nine tasks in three batches, a
whole-branch review, and a single fix wave — and it exercised what the previous
plan's verification could not: the batch loop across five boundaries, a session
replacement in the form of Kanri's own handover mid-plan, the session-exit
shoroku for three roles, and the bug intake's first real case. The record is
`docs/reports/2026-09-07-kanri-lifecycle-dogfood.md`, drawn from the conductor
ledger this issue asked for.

Two of the things named above are still not exercised and are not carried by a
new issue: a Kaiseki case, which needs a failure whose cause is unknown, and a
recovery after a VS Code restart. Both remain latent rather than open — the next
plan that hits either will be the first evidence.
