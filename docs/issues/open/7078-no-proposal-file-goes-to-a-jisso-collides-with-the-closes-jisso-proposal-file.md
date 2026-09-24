---
id: "7078"
title: "\"No `exit:` line and no proposal file go to a Jisso\" collides with the close's own Jisso proposal file"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-ergonomics S-42

`skills/tanto/SKILL.md` (around line 987) says "No `exit:` line and no
proposal file go to a Jisso" one sentence before the close's own Jisso
proposal file. The bg-seat-ergonomics batch C reviews parked the same slip
twice, once in `SKILL.md` (Task 11) and once in the twin sentence Task 9
landed in `skills/tanto/roles/kanri.md`. At this issue's filing a literal grep
found only `SKILL.md`'s line; whoever fixes it checks `roles/kanri.md`'s
"Shoroku" section for the same claim in other words.

Every site that carries it needs the qualifier "at a boundary". A fix
touches both files at once.
