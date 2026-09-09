---
id: "acc0"
title: the notes and reports AGENTS.md copies already drift from their templates, and nothing tracks it
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-09
---

This repository's doc-system files are kisou-installed copies, and the
requirement-extraction plan brought four of them level with their templates
through `kisou migrate`. The two **flat**-type copies were outside that plan's
scope, and they had already drifted.

Measured 2026-09-09, against each template with the seven `{{…}}` variables
expanded and `diff --strip-trailing-cr`:

- `docs/notes/AGENTS.md` — 6 differing lines.
- `docs/reports/AGENTS.md` — 4 differing lines.
- `docs/decisions/AGENTS.md` — identical.

So the drift is not a single stale file but a scattered condition, and it is
invisible day to day: nothing computes this comparison, no lint hook covers it,
and a reader of either copy has no way to tell it apart from the template it
came from. The four copies the plan refreshed were identical to their templates
before the plan changed the templates — which is why that comparison worked as
a verification there and why nobody had reason to check these two.

The direction of the drift is not established here. Either copy may carry an
edit made downstream and never fed back, or a template improvement never
pulled down; the diff alone does not say which, and the fix differs. A
`kisou migrate` in docs-only scope over the two files would surface it as a
proposal — subject to issue-e19f, since a per-type `AGENTS.md` matches no
fingerprint and may draw a `.bak`-and-rewrite offer rather than a refresh.

Two things worth having beyond the one-off fix: the template-versus-expanded-
copy diff as a check something actually runs, and a statement of who owns the
direction when a copy and its template disagree.

Related: req-1a2b, design-c1d2, decision-281f, issue-e19f, issue-da04
(resolved — the earlier instance of copies drifting from the template).
