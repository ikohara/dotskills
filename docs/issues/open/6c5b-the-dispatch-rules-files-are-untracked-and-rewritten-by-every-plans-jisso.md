---
id: "6c5b"
title: the two dispatch rules files every implementer and reviewer reads are untracked and rewritten by every plan's Jisso
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-08
---

Source: shoroku shoki-seat S-88

The two rules files that every implementer dispatch and every review dispatch
read — written once per batch in the SDD workspace and passed by path — were
the most reused artifact of the `shoki-seat` run. Copied from the previous
batch and adapted for the fix wave in minutes, they kept each dispatch prompt
to one task and one rules path, and the nine implementer runs returned no
`NEEDS_CONTEXT` or `BLOCKED` (the measured value is in
`docs/notes/tanto-measured-data-points.md`). They are untracked, in a
workspace nobody is asked to keep after the close, so a Jisso of a later plan
writes them again.

Whether the two files become templates of the skill is the decision.

Carrier: Kept.

**2026-10-08, inbox sweep — nine rows a dispatch prompt carries landed in
`roles/jisso.md`** (inbox 2026-10-08-feedback-ec9eae4 #15, #16, #17, #21, #24, #26 and
inbox 2026-10-08-feedback-454d742 #33, #34, #45). Nine rows were
added to `roles/jisso.md`'s "What tanto overrides" table by `fix: text
corrections from the inbox sweep 2026-10-08`, taking it from 12 rows to 21.
They are sentences a dispatch prompt carries, not overrides of an SDD step,
and they are candidate contents of the rules-file templates this issue
decides; moving them out of `roles/jisso.md` is part of this decision.
