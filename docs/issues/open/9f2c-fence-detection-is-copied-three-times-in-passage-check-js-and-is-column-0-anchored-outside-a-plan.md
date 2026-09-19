---
id: "9f2c"
title: fence detection is copied three times in passage-check.js, and it is column-0-anchored and whitespace-sensitive outside a plan's own fences
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-19
---

Source: session 2026-09-13

Found by the batch A task 1 reviewer of the tanto-cost run (2026-09-13),
recorded in `.tanto/tanto-cost/batch-A-report.md`, "Shoroku candidates".

`skills/tanto/scripts/passage-check.js` now reads "is this line inside a
fence" in three places: `parsePlan`'s own fence-skip block (around line
107-123), `fenceFlags` (task 1's new helper for `sections`, ~1068-1088), and
`fencedLineSet` (~809-825, pre-existing). All three are the same reading,
copied rather than shared, so a fix to one leaves the other two as they are.

`fenceFlags` inherits two blind spots from that reading, both newly exposed
because `sections` runs against **agent-written reports**, not only against
plans, whose fences are column-0 by construction:

- **The open pattern is anchored at column 0.** A fence indented under a
  list item is not detected, so a `#`-prefixed line inside it is read as a
  real heading — the opposite of a false negative, and the failure the
  helper exists to prevent. (Same class as issue-c841's finding on
  `extractCommandFences`, a different function, a second site.)
- **The close pattern rejects a closing fence with trailing whitespace.**
  Every heading after such a fence is then read as still inside it, so
  `sections` reports `no section <name>` for real headings that follow.

The task review found this during a batch that could not fix it: task 1's
plan quotes every test verbatim, and the fix touches the shared parser that
`lint`, `replay`, `diff`, and `verify` all depend on, which the tanto-cost
spec's Out of scope keeps this plan away from ("any change to
`passage-check.js`'s existing four subcommands beyond the usage line").

The fix has two independent parts: hoist the three copies into one shared
helper, and widen that helper to accept an indented open fence and a closing
fence with trailing whitespace — the second part matters most for `sections`,
since a review report or a brief is not written at column 0 the way a plan's
verification section is (mostly; see issue-c841 for that side too).

Related: issue-c841 (`extractCommandFences`'s own column-0 limit), issue-860b
(what `boundary` runs).
