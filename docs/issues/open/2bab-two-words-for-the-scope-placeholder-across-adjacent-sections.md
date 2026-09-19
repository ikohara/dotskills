---
id: "2bab"
title: "two words for the `<scope>` placeholder across adjacent sections"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-19
---

Source: shoroku tanto-project-config

Found by the Jisso of the `tanto-project-config` run at Batch B (2026-09-16),
parked as a plan-mandated quality minor on task 6 and carried as S-35 in that
run's ledger.

Terminology drift across three adjacent sites, for one entity:

- `skills/tanto/templates/agent.md`'s own prose calls the frontmatter
  placeholder a "`<scope>` slot";
- `skills/tanto/SKILL.md`'s task 6 addition calls the rendered marker a
  "project-scope clause";
- one cell of the Artifacts table calls the template's placeholder itself a
  "clause".

Two words for one thing, in sections a reader passes through in order. The fix
is a one-line wording pass picking a single term — which the live Jisso could
not take, because every one of the three strings is byte-exact plan text and
rephrasing it needs a plan amendment.

Not issue-cca9's territory: that one is a byte-count diet of `roles/kanri.md`,
`SKILL.md` and `passage-check.js`, carried by a topic of its own, not a carrier
for wording-correctness fixes.

Related: issue-0e74 (one word carrying three senses in tanto's runtime text —
the precedent for filing terminology drift as an issue rather than a note).
