---
id: "5e7f"
title: no upgrade path for projects already scaffolded by an older kisou
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-05-28
updated: 2026-05-28
---

`kisou` migrate mode is specified as "retrofit the structure onto an
**arbitrary** existing repo" — non-destructive add what's missing. It is
**not** specified for the related but distinct case: **a repo that was
scaffolded by an older version of kisou, and now wants to pick up template
changes from a newer version**.

The current migrate flow detects existing structure and adds what's missing.
If the existing structure was kisou-installed but predates a template change
(e.g., new sections in `CONTRIBUTING.md`, new `<!-- OPTIONAL ... -->` rules,
the addition of `dirs` markers in Project structure), migrate will leave
the existing files intact — the project drifts from the current template
forever.

## Why this matters

The kisou template itself is expected to evolve (this very repo has churned
through 8+ template improvements during initial development). Without an
upgrade story, every kisou-using project effectively gets frozen at its
scaffold-time template version.

## Possible directions

- (a) **Template version field** in the bundled files (e.g., a frontmatter
  `kisou-template-version:` or a comment marker), so migrate can detect
  staleness and offer to refresh.
- (b) **Section-by-section diff propose** in migrate mode: compare each
  kisou-managed file against the current template, show what would change,
  let the user accept/reject sections.
- (c) Defer: keep kisou as install-only; require manual edits to bring
  scaffolded projects up to date.

Cheapest is (c) for now; (b) is most useful long-term.
