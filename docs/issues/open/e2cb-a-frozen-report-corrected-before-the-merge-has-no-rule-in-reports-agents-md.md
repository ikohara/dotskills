---
id: "e2cb"
title: a frozen report was corrected by a second commit before the merge, and `docs/reports/AGENTS.md` has no rule for it
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-72

`docs/reports/2026-10-01-experience-layer-dogfood.md`, a report the type
calls frozen, was fixed by a second commit on the unpublished
`experience-layer` branch (batch D's D-7 round), because two reviewers found
a mislabeled limit and an ambiguous name. `docs/reports/AGENTS.md` says
nothing about a defect found by review before the merge. `docs/decisions/AGENTS.md`
has the counterpart for ADRs — an ADR accepted on an unmerged branch may be
corrected in place until the merge, the correction dated in its text — and
reports have none. A close's integration step may also squash the two
commits either way. The rule to decide: whether the ADR exception extends to
reports.
