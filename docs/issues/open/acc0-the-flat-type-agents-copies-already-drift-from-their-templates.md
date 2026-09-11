---
id: "acc0"
title: the notes and reports AGENTS.md copies already drift from their templates, and nothing tracks it
severity: low
depends_on: []
blocks: []
claimed_by: tanto kisou-refresh (Kanri dotskills-28)
claimed_at: 2026-09-11T00:43:15Z
created: 2026-09-09
updated: 2026-09-11
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

The drift also has a **standing mechanical generator**, independent of anyone
hand-editing a copy. The two files bound by the byte-equality invariant sit
under different lint regimes: `.markdownlint-cli2.yaml` ignores
`skills/**/templates/**` but not `docs/**`, and the markdownlint hook runs with
`--fix`. So a commit that touches an installed copy can have markdownlint
rewrite it toward the linter's preference, and nothing ever moves the template
to match — the copy is pushed off its template and never pushed back (measured
2026-09-11 at the kisou-refresh spec review). Closing it by changing the lint
configuration would need the human's approval under this repository's
`AGENTS.md`. The kisou-refresh spec answers it from the other side instead, by
requiring every template to be markdownlint-clean **as expanded**, checked by
the pre-commit hook that plan adds.

Related: req-1a2b, design-c1d2, decision-281f, issue-e19f, issue-da04
(resolved — the earlier instance of copies drifting from the template).
