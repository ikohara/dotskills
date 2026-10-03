---
id: "c529"
title: the ledgerless topics — 25 issues whose finder the counter reads as unresolved
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-56

The by-finder counter (`scripts/issues-by-finder.js`) reads `unresolved`
for a topic whose `.tanto/<topic>/` directory is gone: seven topics and 25
issues as of 2026-10-02, all of them without an `S-n` in their `Source:`
line (the `tanto-issue-triage` spec, Deferred items, item 6). The lineage
of those rows still exists in the roster archive's Events lines; that topic
did not reconstruct it.

Whether to reconstruct the lineage from the archive, and in what form, is a
decision for a later run.
