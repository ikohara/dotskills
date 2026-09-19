---
id: "13a1"
title: an open issue whose fix lives in a document not yet written needs a carrier, or it is a note to nobody
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-09-19
---

Source: shoroku kisou-refresh

issue-235b's proposal reads "the next passage plan that ships a `node --test`
verification command names the glob". That is addressed to a **future
document**, and no mechanism exists to deliver it there: nothing in the spec
or plan stages reads the open issues, so the addressee never learns it was
addressed. The next such document — the kisou-refresh spec — duly repeated the
defect, and it was caught only because its reviewer happened to read
`docs/issues/open/` and recognized the case.

That is the general shape. An issue whose remedy is "the next X does Y" is a
note to nobody unless something carries it to the writer of the next X, and an
issue that proposes a rule for future authoring is the common case, not a rare
one.

The carrier that actually worked here cost nothing: the spec reviewer's prompt
listed `docs/issues/open/` **whole** as an input to read. It is the cheapest
carrier there is — no index, no per-issue routing, no field to keep current —
and it works because the open set is small and an open issue is by definition
still live.

Proposed: `roles/sekkei.md`'s reviewer dispatch — for both the spec review and
the plan review — names `docs/issues/open/` as an input to read whole, and/or a
spec-phase checklist item does. Also possible, and narrower, a lint rule over
`docs/superpowers/**` for the known-bad forms an issue has already named.

Belongs to a plan editing `skills/tanto/` under contract rule 11.

Related: issue-235b.
