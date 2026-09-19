---
id: "387c"
title: "`D-n` is used in two role files and defined in neither, and no other site in the skill defines it"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-19
---

Source: shoroku tanto-sweep-2

Found in the tanto-sweep-2 run's own review of the tasks that introduced the
notation.

`D-n` — the mid-turn-decision numbering that `roles/sekkei.md` and
`roles/keikaku.md` both gained in that run — is used in both files and defined
in neither, and no other file in the skill defines it either. A reader meets
the letter twice and has to infer what it stands for from context both times.

Two fixes, either sufficient and neither applied:

- give it one definition in `SKILL.md`, since both roles use it identically and
  `SKILL.md` is the file that holds what every role shares; or
- drop the letter and let each site say "a decision number of its own" in
  words.

A minor documentation gap, but it is the shape that check 21's named-mechanism
rule exists to catch: a term introduced at two sites at once, with no site
owning its meaning.
