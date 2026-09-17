---
id: "5144"
title: "a queued-topic plan's release-time re-anchor checks the old text only, so a convention fixed after drafting is silently regressed by the new text"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

Measured on `shoroku-at-close`. Two convention-hardening commits landed on
`main` in roughly the twenty hours between that plan's human-review `OK` and
its branch cut, and both changed prose *inside* sections this plan replaces
whole — `SKILL.md`'s "Session exit" and `roles/kanri.md`'s "Shoroku". That
plan's own ledger names the two commits by subject.

A queued-topic plan's release-time re-anchor, as `roles/keikaku.md` states it,
is "check the old text still matches". That is not enough when the tree the
plan drafted against keeps moving under a fast concurrent-topic run: a
whole-section replacement's **new** text can silently regress a convention the
human fixed after the plan's own drafting read the section, and the old-text
check cannot see it, because the old text is being discarded anyway.

Here it was caught only because `replay`'s occurrence-count failure led to
reading the real commit — not because any check looks for convention drift in a
plan's new text.

The re-anchor step should also diff the prose of every section the plan
replaces whole, between the plan's drafting base and the release tree.

Adjacent but not the same: issue-bf75 is about the plan itself moving under
review, not about the conventions under a whole-section replacement.

A protocol gap, not a user-stated need, so no paired requirement.
