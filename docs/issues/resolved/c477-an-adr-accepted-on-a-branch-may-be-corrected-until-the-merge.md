---
id: "c477"
title: the decisions rules say nothing about an accepted ADR that has not left its branch, and the human applied a convention once — correct in place until the merge
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-12
updated: 2026-09-30
---

Source: session 2026-09-12

`docs/decisions/AGENTS.md` — a kisou-managed copy of
`skills/kisou/templates/docs/decisions/AGENTS.md` — makes an accepted ADR's
body immutable and names two moves, amend and supersede. It says nothing
about an ADR accepted on a branch that has not reached `main`.

The case arose on 2026-09-11 in the kisou-refresh run: decision-19ea (the
template as the source of an installed doc-system copy) was written at T1
in the morning and, the same evening, the whole-branch review measured a
fourth exemption its Decision section had not counted. The human ruled
("19ea も訂正") that the ADR's body be corrected in place on the branch,
before the merge, and the fix wave did so with the correction dated in the
text (kisou-refresh ledger R-36; the wave's P13.5). On 2026-09-12 the human
agreed to record the convention rather than leave it as a one-off.

The rule, for the template's "append-only and immutable" paragraph: an ADR
accepted on a branch may be corrected in place until that branch is merged,
with the correction dated in its own text; once the ADR has reached `main`,
the only moves are amend and supersede. The reason: an unmerged ADR has no
reader outside the run that wrote it, so a correction there rewrites nobody's
record, while a merged one may already be cited.

This edits the kisou template, so the copy follows by `kisou migrate` (the
instrument's `replace` item), never by hand. It sits beside the other rule
the same file lacks — paths in an ADR body are as-of-then (tanto-workspace
ledger S-4, to be filed at that plan's T1) — and the two can land in one
template edit. Related: decision-19ea, decision-0590, issue-0b97.
