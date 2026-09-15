---
id: "dadc"
title: "Kanri's Sekkei orders phrase \"the in-flight plan's paths are out of scope\" forbids a whole second topic that shares those paths"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-15
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

A data point the other way, 2026-09-15: stating a new topic's design
orientation explicitly, up front, prevents the clarify round-trip it would
otherwise cost. The failing case above is one half of the pair —
`tanto-sweep-2`'s own Sekkei needed a clarify exchange on 2026-09-14 because
the orders line's "out of scope" wording read as excluding `skills/tanto/**`
wholesale, when the topic's actual scope *was* that tree; the real ask was
"design against the tree as it reads after the other topic merges," not "don't
touch these paths." The `shoroku-at-close` Sekkei handshake overlaps the same
class of situation even more directly: its own "Sites this topic will touch"
(the decision file's section 7) names nearly the same files `tanto-sweep-2`'s
in-flight plan is mid-rewriting. Stating the distinction in the orders line
itself — "nothing is out of scope to design against; draft-only is only about
landing; design against the post-merge tree, using the in-flight plan's own
committed text as the current preview" — produced no clarify question from
that Sekkei on the point.

One data point each way (needed once, avoided once) is thin, but the mechanism
is now named, and it is wider than this issue's single phrase: a Kanri
orders-line drafting convention of stating a cheap guard up front, next to the
`tanto-project-config` ledger's S-9 (grep the spec for a gate ruling's key
words before dispatching a brief) as the same pattern seen elsewhere. The
rewording above is the narrow fix; the convention is what the two data points
together suggest.

A process gap, not a user-stated need, so no paired requirement.
