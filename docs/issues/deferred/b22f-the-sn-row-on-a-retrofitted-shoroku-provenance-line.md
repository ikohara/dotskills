---
id: "b22f"
title: a retrofitted `shoroku` provenance line names the topic and not the ledger row
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku bug-report-hold S-26

The provenance retrofit wrote `Source: shoroku <topic>` for 102 issues, naming
the topic and not the `S-n` row within it. A later pass could match issue
titles against the closed ledgers' Item columns, wherever the ledger still
survives under `.tanto/`, and write the row.

Deferred deliberately, and the limit is recorded here so that it is not
re-derived: the ledgers are untracked and local, so a recovered row would point
at a file most readers of `docs/` cannot open, and the topic pointer the
retrofit wrote is already true. This is a refinement of a correct line, not a
repair of a wrong one.
