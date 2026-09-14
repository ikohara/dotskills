---
id: "dadc"
title: "Kanri's Sekkei orders phrase \"the in-flight plan's paths are out of scope\" forbids a whole second topic that shares those paths"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

Hit in a live run on 2026-09-14: `tanto-sweep-2`'s spec stage opened while
`tanto-context-ceiling` was in flight, and both topics' scope is
`skills/tanto/**` — the same paths.

Kanri's orders line for the second concurrent topic said, in effect, "treat
every path the in-flight plan touches as out of scope … don't plan edits
there". Read literally that forbids the entire new topic, since every file it
would touch is a file the in-flight plan touches. One `clarify:` line settled
it ad hoc, as "design against the post-merge tree, take today's wording at
overlapping sites as moving" — but the wording that produced the problem is
still in the skill.

The source of the phrase is the Sekkei orders bullet in
`skills/tanto/roles/kanri.md`, which tells Kanri to tell the spec reviewer
that the in-flight plan's paths are out of scope:

```text
the in-flight plan's paths are out of scope
```

Proposed rewording, for the case where the new topic edits the same files:

```text
the in-flight plan's *edits* are the baseline, not its paths
```

Not covered by issue-1096, which is about a second live Sekkei's reviewer
*read* scope under two live topics, not about the orders line's wording when
the two topics share paths.

A process gap, not a user-stated need, so no paired requirement.
