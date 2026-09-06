---
id: "3ca4"
title: cross-repo progress view as a reader of per-repo ledgers
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-06
updated: 2026-09-06
---

The tanto design of 2026-09-06 puts a progress view across repositories out
of scope. A session is bound to its cwd (rule 4), so a Kanri that spans
repositories gets a permission prompt on every foreign operation and mixes
memory and instructions from two projects.

If a view across repositories is wanted, it is a reader of the per-repo
conductor ledgers and rosters, never a Kanri that spans repos. Deferred until
tanto runs in enough repositories at once for someone to want it.
