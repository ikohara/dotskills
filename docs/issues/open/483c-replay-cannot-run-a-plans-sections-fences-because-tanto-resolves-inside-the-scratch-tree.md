---
id: "483c"
title: "`replay` cannot run a plan's `sections` fences, because `$TANTO` resolves inside the scratch tree where the scripts are not copied"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-16
---

Found in the tanto-sweep-2 run and recorded in that run's ledger (S-69).

`replay` runs a plan's fenced blocks in a scratch tree. A `sections` fence
spells its script path through `$TANTO`, which is `skills/tanto` — a
repository-relative path — so inside the scratch tree it resolves to a
directory that has no `scripts/` under it, and the fence cannot run. The
result is not a wrong answer but an unrunnable check: every `sections` fence a
plan carries is dead weight under `replay`.

Three candidate fixes, none applied:

- `replay` copies `scripts/` into the scratch tree, so repository-relative
  script paths resolve there;
- such fences carry their own `replay-skip:`, so the failure is declared
  rather than discovered; or
- `$TANTO` is written absolute in a fence that `replay` runs.

For `passage-check-hardening`.

Related: issue-ebd9 (`replay` auto-skips `verify` but not `diff` or the plan's
own path — the same "which fences `replay` can actually run" question),
issue-1d95 (`replay-skip:` is per fence, not per line, which constrains the
second candidate fix above).
