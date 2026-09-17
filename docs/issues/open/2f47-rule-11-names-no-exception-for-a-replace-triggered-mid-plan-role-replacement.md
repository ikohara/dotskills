---
id: "2f47"
title: "rule 11's boundary for a mid-plan role replacement names no exception for a ceiling-triggered Replace, and the Replace table does not name the boundary"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

Caught after the fact on `shoroku-at-close`. A ruling earlier in that tenure
had already named the plan's own boundary for a role replacement as Batch D's
acceptance, with exactly two exceptions — Kanri's own due handover, and a
Kaiseki ruling. A Jisso ceiling-replacement is not one of them, and that Kanri
initiated exactly one at batch A's boundary, three batches early, before
noticing the conflict. By the time it was caught the human had already deleted
the old Jisso and created the fresh one, which cannot be undone.

Ruled: proceed, rather than attempt a reversal with nothing left to reverse.
Two facts mitigated but did not excuse the miss — `roles/jisso.md` was untouched
by that plan until Batch C, so the specific risk the boundary rule guards
against (a role reading a half-edited file) did not materialize for that role at
that moment; and every batch prompt restates the authority statement in full,
which is what actually insulates a dispatched session from the tree's edit
state, boundary or no boundary.

The gap the incident exposes: the Replace table fires on a context ceiling, the
plan's boundary rule forbids a mid-plan replacement, and **neither text names
the other**. Rule 11's general statement should name a Replace-triggered
replacement as a third exception, or the Replace table should say it waits for
the plan's boundary.

Adjacent but not the same: issue-11db is another topic's live session under a
changing skill, and issue-28f2 is a session adopting its own role file; neither
is a Replace-triggered replacement of a role the editing plan itself touches.

A system gap, not a user-stated need, so no paired requirement.
