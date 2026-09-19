---
id: "e36d"
title: the review brief's unsettled section may raise a point of its own, and the template does not say
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-19
---

Source: session 2026-09-09

`skills/tanto/templates/review-brief.md` says the brief "selects and
translates the judgment points, does no new analysis, and proposes no
change". At the context-cost plan review of 2026-09-09 the brief's closing
section, "the points the writer could not settle", carried a `[decide]` the
plan had not raised: what happens when Jisso compacts during batch A, while
the peer-compaction replacement rule that plan lands is not yet in force and
rule 11 holds every replacement to batch B's boundary. The point was the
writer's own — the plan's Batches section said nothing about it — and it
was useful: the human answered it in the same reply as `all OK`, and the
plan gained one sentence before its commit.

So the rule was crossed once, and the crossing improved the document. The
template does not say whether the unsettled section is allowed to raise a
point the document lacks, or whether such a point is a `[decide]` (the
answer decides the document) or a `[nothing]` (information only). Left as it
is, one writer will raise such points and the next will not, and the human
will not know which kind of brief they are reading.

Proposed, for a later plan: one line in the template's rule for the
unsettled section, either forbidding new points there (the writer sends the
gap to Kanri as a finding instead) or allowing them under a tag that marks
them as the writer's, so that the document's own points and the writer's
stay distinguishable. The design entry for the brief (design-4807, "The
review brief") records the choice.

Related: decision-ace0 (the brief by a third party; the answers as the
confirmation), design-4807, issue-867f (`all OK` is undefined for a decide
line), and the context-cost plan
(`docs/superpowers/plans/2026-09-09-context-cost.md`, the Batches sentence
the answer produced).
