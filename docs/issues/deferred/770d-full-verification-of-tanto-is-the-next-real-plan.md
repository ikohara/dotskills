---
id: "770d"
title: full verification of tanto is the next real plan run under /tanto
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-06
updated: 2026-09-06
---

The tanto implementation plan of 2026-09-06 verifies a Markdown-only skill by
lint, structural greps against the design and the superpowers 6.3.0 text, a
JSON and a YAML parse, and a handshake smoke test the human runs by hand. None
of that exercises a batch loop, a Kaiseki case, a session replacement, or a
recovery after a VS Code restart.

Full verification is the first real plan run under `/tanto`, with its
conductor ledger as the record; that ledger's Measurements table also feeds
issue-9a68 and issue-15bf. Deferred until the skill has landed on `main`.
