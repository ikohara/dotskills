---
id: "a9c3"
title: the decisions AGENTS file has no rule for an ADR body that names a path which no longer exists
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-12
updated: 2026-09-19
---

Source: shoroku tanto-workspace

`docs/decisions/AGENTS.md` makes an accepted ADR's body immutable and asks that
managed entries be cited by `<type>-<id>`, but an ADR body also names plain
paths — decision-de63 names `.superpowers/sdd/kanri-handover.md`, decision-ace0
names `.superpowers/sdd/<topic>/review-brief-spec.md` — and the file says
nothing about what a reader does when such a path stops existing. The
tanto-workspace plan of 2026-09-12 moves every one of those paths under
`.tanto/`, so both bodies become false as descriptions of the tree while
staying true as records of what was decided.

The spec review of that plan (2026-09-11) ruled the paths historical — "paths
in an ADR body are as-of-then; the current shape is `design/`'s job" — and
decision-7e21 says so in its Consequences. That is a rule of the document
system, not of one ADR, and it belongs in the file every ADR writer reads:
one sentence under "Superseding (the only edit to an accepted ADR)" or beside
the `<type>-<id>` paragraph, saying that a path named in an accepted body is
read as of the ADR's date and is never repaired, and that the living shape is
`design/`'s.

`docs/decisions/AGENTS.md` is a `kisou`-managed copy, so the sentence goes
into the `kisou` skill's template for that file and reaches this repository's
copy by `kisou migrate` (the refresh), not by a hand edit here.

Related: decision-7e21, the tanto-workspace design of 2026-09-11 (Out of
scope), design-f607 if it names the doc-system templates.
