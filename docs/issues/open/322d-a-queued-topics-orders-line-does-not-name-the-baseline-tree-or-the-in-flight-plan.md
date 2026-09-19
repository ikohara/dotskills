---
id: "322d"
title: "a queued topic's Sekkei orders line does not name the baseline tree or the in-flight plan whose sites it edits"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-19
---

Source: shoroku shoroku-at-close

Measured twice. `tanto-sweep-2`'s Sekkei needed a clarify round-trip to
establish which tree its spec was written against, because the topic ran
behind another topic's in-flight plan and the sites it quotes were being
rewritten under it. `shoroku-at-close`'s orders line stated the baseline and
the scope up front, citing that clarify as the precedent, and no round-trip was
needed.

The landed orders-line text in `roles/kanri.md` — and the template in
`templates/kanri.md` — does not carry that sentence. A queued topic's orders
line should name the baseline tree the Sekkei drafts against and the in-flight
plan whose sites it edits, so that the Sekkei does not have to ask.

Adjacent but not the same: issue-dadc is about the phrase forbidding a second
topic that shares the in-flight plan's paths, not about naming the baseline.

A process gap, not a user-stated need, so no paired requirement.
