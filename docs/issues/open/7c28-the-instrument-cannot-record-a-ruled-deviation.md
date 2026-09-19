---
id: "7c28"
title: verify and diff have no way to record a deviation a controller ruled on during the run
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-12
updated: 2026-09-19
---

Source: shoroku tanto-workspace

`passage-check.js verify` and `diff` compare the tree against the plan as
committed. When a controller rules mid-run that a passage must land differently
from the plan's text — because the plan's text cannot land at all — the
instrument has no way to record that the difference is sanctioned. `verify`
reports `passage-absent: <id>` and `diff` reports the replacement's lines as
`unaccounted-added`, for the life of the plan, with nothing to distinguish them
from a passage that was simply missed.

Measured in the tanto-workspace run (2026-09-12). Blocks `P2.1` and `P3.8` were
re-authored by ruling after `MD038` proved their text unlandable (issue-f851);
from that boundary to the end of the run, every `verify` reported two absent
passages and every boundary `diff` reported ten `unaccounted-added` lines that
were known-good. Each boundary report had to restate which findings were the
ruled ones so that a real defect arriving later would still be visible — the
noise floor was carried in prose, by hand, across three batch reports.

This is adjacent to two issues but is neither of them. **issue-4eef** is about a
change a plan *describes but does not quote*, whose fixes are plan-time
declarations decided before dispatch; the need for those can be anticipated
while the plan is being written. **issue-d0f4** asks for a survivor form for an
`O` block — a declared expected count instead of an implied zero. This issue is
about a deviation whose necessity is discovered **after** the plan is committed,
which no plan-time declaration can anticipate, because at plan time nobody knows
the block will have to change.

A runtime deviation marker would separate the two readings: something the
controller records once — the block id, the ruling, and the text that actually
landed — which `verify` reads to report the passage as *deviated* rather than
*absent*, and `diff` reads to account for its lines. The marker belongs outside
the plan, since the plan is committed and (by the same run's ruling) not amended
mid-flight; the conductor ledger or a sibling file is the natural home.

Until then the workaround is what that run did: name the ruled deviations in
every boundary report, and say explicitly that any finding beyond that set is
new.

Related: req-04f5, design-4807, issue-4eef, issue-d0f4, issue-f851,
`docs/notes/tanto-consistency-checks.md` section 12.
