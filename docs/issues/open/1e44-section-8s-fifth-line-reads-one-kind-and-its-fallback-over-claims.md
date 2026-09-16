---
id: "1e44"
title: "§8's fifth line reads one kind only, and its fallback over-claims for the host"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-16
---

Found by the whole-branch reviewer of the `tanto-project-config` run as Minor 1
(2026-09-16) and carried as S-47 in that run's ledger.

The fifth line of `docs/notes/tanto-consistency-checks.md` §8 reads the
project-scope copy of `tanto-task-implement.md` and nothing else, then falls
back to printing "no project-scope definition on this host" when that one file
is absent. The statement is false whenever another of the twelve kinds does
have a project-scope definition — the check can print a claim about the host
from the evidence of a single kind.

Two named fixes, either sufficient:

- glob `tanto-*.md` under the project-scope directory, so the check sees every
  kind before speaking about the host; or
- reword the fallback per-kind — "no project-scope definition for
  `task.implement` on this host" — so the narrower read matches the narrower
  claim.

Related: issue-f3e2 (check 16 is circular) and issue-c526 (check 3 asserts a
pattern the design does not use) — the same class, both filed against this
note; issue-9d84 (the note's hand-maintained expected values go stale).
