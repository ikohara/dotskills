---
id: "320e"
title: backfill the requirement each existing design section serves, once the pairing rule lands
severity: low
depends_on: ["ad1a"]
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-19
---

Source: shoroku requirement-extraction

Deferred by the requirement-extraction design (2026-09-09, its Deferred
items 1). That design adds a bullet-level pairing rule to the docs system:
each `## Section` of a design entry names the `req-<id>` it serves, or says
"serves no requirement; internal shape", and a shoroku proposal flags the
unpaired entries among the entries it carries. The rule applies to new and
edited entries from the moment it lands; the standing tree is not swept, by
the Propose step's own text, because a whole-tree sweep at that moment would
flag every section of every design entry.

The existing design entries — design-4807 (tanto), design-c1d2 (kisou),
design-e3f4 (shoroku), design-a5b6 (automated release), design-dc5d (install
scripts) — therefore name no requirement per section. Bringing them under the
rule is a shoroku run of its own, item by item under `Direction?`, after the
requirement-extraction plan lands. The first such run also measures how many
sections end up saying "serves no requirement", which is the first data on
whether the explicit "none" earns its place.

One wording point for that run to settle as it goes. The design template's new
Body bullet — "Name the requirement each `## Section` serves with `req-<id>`" —
reads unconditionally on its own, as though every section of every entry owed
one immediately; the scope that makes it tractable, the entries a proposal
carries rather than the standing tree, lives in `docs/AGENTS.md`'s Propose step
instead. A reader who meets the bullet without the step will over-apply it.
Either the bullet gains the scope or the backfill run establishes by example
that it is per-proposal.

Related: req-1a2b, req-3c4d, req-04f5, issue-ad1a.
