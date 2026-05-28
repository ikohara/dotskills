# design/ — AGENTS

A `design` file records the **current** chosen approach: how the system is built
now, and why this shape. It is living — overwrite it as the approach evolves.
The *why we chose A over B*, with alternatives and consequences, goes in
`decisions/` (ADRs), not here.

## File

- Path: `docs/design/<id>-<slug>.md`. Reference prefix: `design`. See the
  top-level `AGENTS.md` for `<id>` / slug / reference rules.
- Granularity: **coarse — one file per topic/area**. A file may hold several
  `## Section`s.
- No index file.

## Frontmatter

```yaml
id: "f6a1"
title: <topic title>
created: 2026-05-27
updated: 2026-05-27
```

- `id` is a quoted string; `created` / `updated` are `YYYY-MM-DD` (UTC).

## Body

- Narrative starts directly after the frontmatter (no body `# heading`).
- Describe the operational truth: structure, components, data flow, and the
  reasoning for the current shape.
- Link to a recorded choice with `decision-<id>` where relevant.

## design vs decisions

- `design/` = what the architecture *is* now (mutable).
- `decisions/` = why a specific choice was made, when, with alternatives and
  consequences (immutable record).
- A significant choice often updates `design/` **and** adds an ADR. That is not
  duplication: `design/` holds the operational truth; the ADR holds the
  reasoning and the roads not taken.

## Growth

Split an oversized topic file into two (each a new `id`); no automatic
threshold.
