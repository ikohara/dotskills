---
id: "483c"
title: "`replay` cannot run a plan's `sections` fences, because `$TANTO` resolves inside the scratch tree where the scripts are not copied"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-10-03
---

Source: shoroku tanto-sweep-2

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

2026-09-16 — the general case, with a measurement. The `tanto-project-config`
whole-branch review found the cause above is not specific to `sections` or to
`$TANTO`: the scratch tree holds **only the plan's own files**, so *any* fence
that calls something the plan does not itself carry fails there. Named in that
run: `scripts/lint.sh`, `scripts/passage-check.js` and its test, and
`skills/tanto/templates/tanto.json`.

The measurement puts a size on it — **15 of that run's 24 `DIFFERS`** came
from this single cause, not from any passage being wrong. That is the majority
of the instrument's own noise on a run whose passages all landed clean, which
is the argument for the first candidate fix above over the second: the scratch
tree should carry the repository's tooling and the skill's untouched files,
because declaring fifteen fences `replay-skip:` per plan only moves the cost to
the plan author.

For `passage-check-hardening`, as above.

**2026-09-17 — the cheapest mitigation has a name.** A whole-branch reviewer's
dispatch prompt had to carry a sentence naming this issue so the reviewer would
not report the two `sections` crash lines as findings. Correct for that run, but
a `replay-skip` marker on those two fences in the plan — the instrument already
honors one for `boundary` — would make the exclusion mechanical instead of a
per-dispatch sentence. `shoroku-at-close`'s Batch E report names the same marker
independently, as its second candidate.

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
