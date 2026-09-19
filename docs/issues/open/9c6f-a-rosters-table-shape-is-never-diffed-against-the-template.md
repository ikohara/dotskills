---
id: "9c6f"
title: a roster's own table shape is never diffed against the skill's current template
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: inbox 2026-09-16-roster-table-shape-never-diffed-against-template

`.tanto/roster.md`'s Residency table header was missing the `Context` column
that `templates/roster.md` had carried for at least one prior tenure: rows had
been silently writing a 13th value (`context=<n>`) against a 12-column header
since at least the handover before the one that found it.

Neither the model and effort check at handshake time nor the handover
acceptance procedure asks a new Kanri to sanity-check the roster it inherits
against the skill's current templates. A Kanri only ever **reads** the roster;
it never diffs its table shape. So a template that gains a column has no way to
reach an existing, long-running roster except by luck.

Proposed fix: a one-line shape check at the point a Kanri first reads a roster
it did not itself create — either the handshake step, before writing or
rewriting a role's row, or the handover acceptance, before rewriting the first
row — comparing the roster's table headers against `templates/roster.md`'s
current headers, **header text only**, and fixing a drifted header in place,
moving any misplaced value into its own column and losing nothing. The fix
names the general form, not this one column.

Alongside issue-9ca6 (the archive drops the Transcript column) and issue-7f28
(three roster template vocabulary drifts) — three faces of the same "the
template moved, the file did not" problem.
