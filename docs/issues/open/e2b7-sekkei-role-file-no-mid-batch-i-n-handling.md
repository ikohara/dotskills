---
id: "e2b7"
title: roles/sekkei.md has no sentence for a scope input (I-n) that lands mid-batch
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

Reported from `C:\Users\0000105523\devel\kuchidome` (tanto, topic
`boundary-hardening`): a scope input (`I-2`) arrived from Kanri after
Sekkei had already put a batch of dialogue questions (Q2) to the human and
before the human answered. Sekkei appended the new point as point 7 of
that batch; the human's `OK` crossed with the append (the human answered
what was on screen before the append landed); Sekkei then re-put the new
point alone as Q3. The handling worked, but `roles/sekkei.md` has no
sentence covering this case — a future Sekkei has to improvise it.

Proposed fix, already exercised successfully in the reporting run: document
the handling that worked — re-put the new point alone as its own question,
and count a crossed `OK` as covering only what was on screen at the time it
was given, not the point appended after.
