---
id: "a433"
title: "the \"every session sends a reading\" claim has two documentation holes"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-10-01
---

Source: shoroku tanto-context-ceiling

Measured at the `tanto-context-ceiling` run's T2 (2026-09-14). The reading
rule this topic extended with a fifth figure is stated in two places that do
not agree with the role files, and neither was fixed in the run's own fix
wave (both sites are passage-carrying paths, held per the standing in-run
rule).

Two sites, one root — the contract claim about the reading and the role
files disagree:

- **`skills/tanto/README.md`** says every role runs `reading.js` at every
  boundary and exit. Kikaku does not: `templates/roster.md`'s own rule is
  that Kikaku sends no reading. The exact replacement wording is **"every
  role but Kikaku"**.
- **`skills/tanto/roles/kikaku.md` has no occurrence of "reading" at all,
  and `skills/tanto/roles/hosa.md` exactly one.** The two roles whose
  reading obligation is least obvious are the two whose role files say least
  about it — a pre-existing hole, older than this spec's fifth figure.

Both are unfixed text defects in shipped documentation, with the replacement
for the first already established. They are filed together because a reader
fixing either one wants to see the other.

Related: exp-06b2, design-4807, issue-40ed (the reading's own figures).
