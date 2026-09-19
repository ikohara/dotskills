---
id: "1096"
title: a second live Sekkei's spec reviewer sees the first topic's draft and files
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-19
---

Source: shoroku tanto-cost

Deferred by the tanto-cost design
(`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`, "Deferred items"
5). When two topics are in flight, a Sekkei drafting the second topic's spec
dispatches a spec reviewer that can read the whole tree, the first topic's
draft and `.tanto/` files included. Nothing scopes the reviewer to its own
topic.

The design pre-empts it by protocol: Kanri's orders line names the
out-of-scope paths, and Sekkei passes them to the reviewer. That depends on
Kanri writing the line correctly each time. An instrument could list the
other topics' paths from the roster's Topic column instead, which is where
the truth already is; deferred until a run has two topics live often enough
for the hand-written line to be measured wrong.
