---
id: "dace"
title: "`reading.js` accepts unvalidated numbers, and a malformed one silently reads `under`"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-10-01
---

Source: shoroku tanto-context-ceiling

Measured at the `tanto-context-ceiling` run's T2 (2026-09-14), over the
shipped `skills/tanto/scripts/reading.js`.

Three numeric inputs reach the script without validation: the `--now` flag,
the auto-compact window environment variable, and the personal config's
`ceiling.*` fields. A malformed value — a typo, a stray unit suffix, an empty
string where a number was meant — produces `NaN` rather than an error. For the
ceiling line specifically, the comparison against `NaN` is false, so the line
reads `under` regardless of the session's actual context. A mistyped ceiling
therefore silently disables the ceiling this whole topic exists to enforce,
and prints a verdict that looks correct.

**The open design question, not answered here:** what a malformed numeric
value should do. Two candidate answers, both defensible:

- **Warn and fall back to the built-in default.** The reading keeps printing,
  a run never loses its instrument to a typo, and the warning is the signal.
  The cost is that a warning in a line a role reads mechanically may go
  unread, leaving the effective ceiling silently different from the
  configured one.
- **Exit 2.** The misconfiguration is loud and cannot be ignored, matching
  how the script already treats an unusable transcript path. The cost is that
  a personal-config typo stops every role's boundary check until a human
  fixes it, including roles whose work has nothing to do with the ceiling.

A future plan touching `reading.js`'s argument handling should settle this
explicitly rather than pick one in passing; the answer also decides what the
`unavailable` ceiling value means, since a failed read and a malformed
configuration are not the same condition.

Related: exp-06b2, decision-eee2, decision-9a3a, issue-40ed.
