---
id: "d0c9"
title: a `created:` file is never checked against the plan again after its own task's review
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-10-03
---

Source: session 2026-09-13

Found by the tanto-cost run's batch D (2026-09-13), recorded in
`.tanto/tanto-cost/batch-D-report.md`, "Shoroku candidates".

A `created:` path carries a `W` block, not a `P` block. `verify` treats a
`W` block the way it treats an absent one — it prints `no passages` for
that task — and `diff` exempts the path by name (per its own `created:`
declaration mechanism). Both are correct for what they were built to do:
`verify` checks that a task's declared passages landed, and a `created:`
file has none; `diff` checks for lines a plan does not account for, and
every line of a fresh file is accounted for by definition once its `W`
block is credited.

The gap is what happens **after** the file lands: nothing in the plan's
own instruments ever again compares a `created:` file's committed content
against the `W` block that specified it. The tanto-cost run's batch D
review had to prove this by hand for all four of its created files
(`roles/keikaku.md`, `roles/kikaku.md`, `roles/hosa.md`,
`templates/kikaku-decision.md`) — a byte-for-byte comparison against each
`W` block — because no `verify`/`diff` combination does it automatically.
The check paid off immediately: `roles/keikaku.md` was found to differ
from its `W14.1` block by exactly one character (a deliberate, ruled fix;
see the tanto-cost ledger's R for that batch), a divergence no instrument
would ever have surfaced again once that task's review closed.

A `verify` mode that compares a `W` block's content against the file at
its declared path — the same mechanical check a `P` block already gets,
adapted for "the whole file must equal this text" instead of "this old
text becomes this new text" — would close the gap for every future plan
that creates files.

Related: issue-a7d2 (the sibling gap on the `replay`/anchor side of a
`created:` path), issue-5cf3 (the mechanical reconstruction method this
run used by hand for passage tasks — the same principle, applied here to
whole-file creation).

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
