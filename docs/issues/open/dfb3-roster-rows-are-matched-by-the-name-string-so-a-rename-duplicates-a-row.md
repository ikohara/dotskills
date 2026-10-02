---
id: "dfb3"
title: roster rows are matched by the Name string, so a rename duplicates a row and an archive move leaves one behind
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-3

`SKILL.md`'s "The census" states the identity rule: a session is its
`sessionId`, a roster row's is the basename of its Transcript column, and
every match of a session to a row compares `sessionId`s, never a name, a
`[ref]`, or a full path. `scripts/boundary.js` does not follow it where it
writes a terminal seat's row. `writeSeatRow` (used by `record --seat`)
finds an existing row by testing the `Name [ref]` column against the seat's
name as a literal string, and appends a new row when none matches;
`writeStatus` (used by `record --status`) matches the same way. Neither
reads a `sessionId`, although `sessionIdOf()` in the same file does exactly
that for the census's own matching (inbox
2026-09-25-roster-row-duplicated-after-rename names the functions and
lines).

So when a row is written under one Name string (a pre-rename name, or a
placeholder written before the seat's first boundary) and a later call
carries another for the same session, `writeSeatRow` appends a second row
with the same Transcript, and the two rows may end up with the same Status.
Measured four ways:

- **The archive move** (S-3, 2026-09-22). A Residency row under a Jisso's
  pre-rename name (`dotskills-43`, its batch D reading) survived in the live
  roster after the final-name row (`dotskills-99`, same transcript, same
  reading) moved to the archive, because the move matched rows by current
  name only. Caught and fixed by hand. A scripted archive-move helper in
  `boundary.js` would catch it the way `record`'s invariants catch `S-n`
  collisions.
- **Two more pairs at the next archive move** (S-10). `bg-seat-fixes`'s
  shusei Jisso held two Sessions rows under different names for one session
  (the renamed identity, and its `/tanto jisso batch=…` placeholder), and its
  batch-C Jisso two identical Residency entries under its renamed and
  placeholder names. Both pairs moved to `roster-archive.md` intact, since no
  tenure could be certain a placeholder-named row carried nothing the
  renamed one lacked.
- **The inbox copy**, which traces both functions against the rule.
- **Issue-fb90's finding 18**: `record --seat` writes the spawn prompt as the
  Name cell without `[ref]`, and `--status` finds the row by that name text,
  which the census then renames; a rename between two calls leaves a
  duplicate `live` row.

Proposed fix (the inbox copy's): match a roster row by `sessionId` — the
Transcript column's basename, already computed by `sessionIdOf()` — in both
`writeSeatRow` and `writeStatus`, as every other session-to-row match in the
skill does.
