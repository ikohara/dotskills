---
id: "f5d8"
title: "the handover template's Live peers row disagrees with `roles/kanri.md` about where an unanswered peer is marked"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-13
---

Found by the tanto-cost run's batch E task 18 reviewer (2026-09-13),
recorded in `.tanto/tanto-cost/batch-E-report.md`, "Rulings" (landed as
written; not fixable inside this plan).

`roles/kanri.md:534-537` says the handover's Live peers section "marks the
ones whose last line you had not answered." `templates/kanri-handover.md`
does not do that: its Live peers row carries no mark for an unanswered
peer, and puts those peers in a separate **In flight** bullet instead.

No information is lost either way — the `kanri-address:` re-send rule and
the peer's identity both land somewhere in the handover file — but the two
documents disagree about which section carries the mark, so a Kanri
writing a handover from the template produces a Live peers section its own
role file's text does not describe.

Not fixable inside the tanto-cost plan: `templates/kanri-handover.md`'s
passage under task 18 has already landed; `roles/kanri.md` is closed since
batch C. Either an edit to the template (re-landing a passage, which fails
`verify`) or to the role file (an unquoted line on `skills/tanto/`) is
needed to reconcile them.

Related: issue-4d8a (nothing checks a role file's own cross-references
against the templates it describes).
