---
id: "7b7b"
title: "a Kikaku decision can cite a list that exists on disk nowhere"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-19
---

Source: shoroku tanto-sweep-2

Measured during `tanto-sweep-2`'s spec stage (2026-09-14).

A Kikaku decision file cited "the morning's list of 24" role-file
inconsistencies as the topic's scope. That list is on disk nowhere: it was
produced in a session window and never written. The decision file names 15
issue ids "and their kin", which is not a set — so the spec stage had to
reconstruct the intended set by surveying `docs/issues/open/` (41 candidates)
with a dedicated subagent, and can only claim to have approximated it.

The cost is measurable (a 41-issue survey to rebuild a cited list of 24) and
the correctness is not recoverable: nobody can now confirm which 24 were
meant.

The missing rule belongs in `skills/tanto/templates/kikaku-decision.md`, or in
Kikaku's role text at `skills/tanto/roles/kikaku.md`:

```text
a list a decision cites is written into the decision file, or the file names
the path that holds it
```

Nothing in `docs/issues/` covers this. issue-e047 touches the same template
file, but only for its lint exposure.

Kikaku's own practice from 2026-09-14 on already follows the rule above; this
issue tracks landing it in the skill text, for whichever topic picks it up.

A process gap, not a user-stated need, so no paired requirement.

**2026-09-17, two more instances of the same failure, both from
`shoroku-at-close`'s spec work.**

- **A wrong `<type>-<id>` reference.** That topic's Kikaku decision file cited
  "decision-19d4's mechanism"; `19d4` is an issue, and the decision is d538. It
  was corrected silently in the spec. A decision file's id references want
  checking before Kanri relays them — the same one fix, in `roles/kikaku.md` or
  `templates/kikaku-decision.md`, that this issue already tracks.
- **A site list read as the scope.** The same decision file's section 7 named
  the sites the topic would touch and said "the Sekkei measures the exact
  list"; the measurement found two it missed (`roles/kanri.md` Start step 2's
  `t0-*` root listing, `templates/kikaku-decision.md`'s "three handlings"
  placeholder) and one it named that does not exist (`scripts/reading.js`'s
  "known-key list", which the script has only for `ceiling`). A decision file's
  site list is a starting point the spec re-measures, and one line in the
  template could say so, so a reader does not take the list as the scope.
