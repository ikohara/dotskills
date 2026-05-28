---
id: "2a5e"
title: scripts/bootstrap is always created; not a valid `scripts=` value
status: accepted
supersedes: []
superseded_by: null
created: 2026-05-28
updated: 2026-05-28
---

## Context

kisou's Step 2 originally treated `bootstrap` as one of several optional
scripts the user could opt into via the `scripts` selection (alongside
`setup` / `run` / `build` / `test` / `lint`). In practice, the universal
first-run step for projects in this repo's family is to install
pre-commit (and any other initial hooks / dev-only deps), which is
exactly what `scripts/bootstrap.{bat,sh}` does. There is essentially no
case where the author wants the scaffold without that step.

## Options

- Keep `bootstrap` as an optional script in the `scripts=` selection.
- Make `bootstrap` mandatory; remove from valid `scripts=` values and
  drop the section-scope `<!-- OPTIONAL scripts=bootstrap -->` gate from
  the Development setup section.

## Decision

**Mandatory.** kisou always creates `scripts/bootstrap.{bat,sh}` as
empty files (per the broader "kisou never auto-generates script content"
rule). `bootstrap` is NOT a valid value for `<!-- OPTIONAL scripts=... -->`
markers; the only valid `scripts=` values are `setup` / `run` / `build` /
`test` / `lint`.

## Consequences

- The pre-commit install ritual is enforced for every scaffold.
- CONTRIBUTING.md's `## Development setup` is unconditionally present
  (no gating marker). Per-OS lines inside it remain gated by
  `<!-- OPTIONAL os=... -->`.
- The `{{bootstrap}}` placeholder is unconditional — always expanded and
  shipped.
- Cost: project types that don't use pre-commit (e.g., a simple shell-script
  collection or a docs-only repo) get an unwanted bootstrap stub. Acceptable
  for now; revisit if the assumption breaks. See related issue
  `5e7f-kisou-template-upgrade-path` for the broader "template evolves"
  discussion.
