---
id: "7b7b"
title: "a Kikaku decision can cite a list that exists on disk nowhere"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

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
