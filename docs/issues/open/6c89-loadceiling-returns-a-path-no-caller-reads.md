---
id: "6c89"
title: "`loadCeiling` returns a `path` no caller reads"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-16
---

Found by the spec reviewer of the `tanto-project-config` run (2026-09-16) and
carried as S-4 in that run's ledger.

`loadCeiling` in `skills/tanto/scripts/reading.js` returns `path: configFile`
alongside the values it resolves, and no caller reads that field. It has been
dead since it was written. The `tanto-project-config` topic widened this very
function — it now resolves a project file beside the personal one — so the
returned `path` is not merely unused but also newly ambiguous: with two files
in play, one `path` cannot say which was read, and the role files report the
scope from their own start line instead.

Either drop the field, or make it the pair of paths the widened function
actually consulted and have the start line read it. Nobody has ruled which.

Related: issue-e2b1 (an anchor's `before` value parsed and never read — the
same shape, filed the same way), issue-dace (`reading.js` accepting
unvalidated numbers).
