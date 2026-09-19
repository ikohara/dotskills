---
id: "e2b1"
title: "passage-check parses an anchor's `before:` value and never reads it"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-15
updated: 2026-09-19
---

Source: session 2026-09-15

Measured directly against `skills/tanto/scripts/passage-check.js`,
2026-09-15. The parser matches an `A` block's anchor line with
`ANCHOR_FULL_RE` (`` `cmd` — before: X, after: Y ``) or `ANCHOR_PARTIAL_RE`
(`` `cmd` — before: X ``) and stores the parsed `before` on the block — and
nothing reads it afterwards. `replayPlan`'s step 3 compares only `after:`
against the replayed tree; `verifyTask` never touches `before` at all. The
`before:` value every plan author writes for every anchor is dead data today.

The gap showed at `tanto-sweep-2`'s plan-landing cold read: Kanri needed to
confirm that all 13 anchors' declared `before:` state matched the tree right
after the plan committed and before any task ran, and no subcommand does it.
The check was a one-off `node -e` script built by hand — reusing `parsePlan`
from `passage-check.js`, running each anchor's command once, with the output
verified by hand — and thrown away. A plan-landing sanity check on every
anchor's starting state is generic, not specific to this plan.

Proposed: a first-class `verify --before` (or a `replay` step run before the
edits are applied) that runs each anchor's command against the current tree
and compares the result to the parsed `before:` — the value's first consumer.
A note for the implementer: `grep -c` exits 1 when it counts zero matches, so
a `before: 0` anchor must treat exit 1 with output `0` as a match rather than
as a command failure; the hand-run check above tripped on exactly this.

Non-duplicate against the open passage-check issues: issue-3e94 is about
needle measurement, issue-b58d about `after:` being run rather than counted,
issue-58fe about `W` blocks, issue-91f6 about `boundary`'s task fence. None
of them reads `before:`.

The queued `passage-check-hardening` topic is this issue's carrier, per
issue-13a1: the fix lives in that topic's spec, and this issue is a note to
nobody unless its Sekkei reads `docs/issues/open/` whole.
