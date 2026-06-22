# {{issues}}/ — AGENTS

An `issues` file records a known problem or deferred decision: something is
wrong or missing, but is not being fixed right now. Status is encoded by
**directory**, not a frontmatter field.

## Lifecycle (by directory)

- `{{docs}}/{{issues}}/open/` — actionable now.
- `{{docs}}/{{issues}}/deferred/` — known, not acting on currently.
- `{{docs}}/{{issues}}/resolved/` — done (excluded from new reading by default).

There is no `in-progress` directory: an `open` issue with `claimed_by:` set is
in progress. Change status with `git mv` (preserves history); bump `updated:`.

Because status is a directory, a status change **moves the issue's path**. After
a `git mv` the issue's `<type>-<id>` references stay valid, but any inbound
**path link** is now dead. Fix the inbound path links in **living** documents as
part of the move; references from immutable / frozen documents are already
`<type>-<id>` only (see Cross-references in `{{docs}}/AGENTS.md`), so they need
nothing.

## File

- Path: `{{docs}}/{{issues}}/<status>/<id>-<slug>.md`. Reference prefix: `issue`.
- One issue per file.

## Frontmatter

```yaml
id: "b9c2"
title: cache invalidation on rename
severity: medium                   # low / medium / high (soft hint)
depends_on: []                     # list of issue ids
blocks: []                         # list of issue ids
claimed_by: null                   # agent name or null
claimed_at: null                   # ISO 8601 timestamp or null
created: 2026-05-27
updated: 2026-05-27
```

- `id` is a quoted string. No `status:` field — the directory is the truth.
- No `tags:` / `labels:` — re-derive classification from content as needed.
- `severity` is a soft hint; do not build load-bearing logic on it.
- `claimed_by` + `claimed_at` coordinate multiple agents. A claim older than the
  staleness threshold (initial value: 6 hours) may be ignored by others.
- `depends_on` / `blocks` are best-effort; a reference whose target is in
  `resolved/` counts as satisfied.

## Body

Narrative starts directly after the frontmatter — no body `# heading` (avoids
`MD025` against the frontmatter `title:`).

## Issues are hints, not contracts

Do not auto-clean stale `claimed_by`, broken `depends_on` / `blocks`, or
auto-move resolved issues. Leave them for human / agent judgment.
