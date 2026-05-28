# requirements/ — AGENTS

A `requirements` file captures user-perspective wishes: **what the project must
do for its users, and why**. Not how it is built — that is `design/`.

## File

- Path: `docs/requirements/<id>-<slug>.md`. Reference prefix: `req`. See the
  top-level `AGENTS.md` for `<id>` generation, slug rules, and the `<type>-<id>`
  reference convention.
- Granularity: **coarse — one file per topic/area** (e.g., authentication, rate
  limiting). A file may hold several related `## Section`s. Do not create one
  file per atomic sentence.
- No index file.

## Frontmatter

```yaml
id: "d4e5"
title: <topic title>
created: 2026-05-27
updated: 2026-05-27
```

- `id` is a quoted string.
- `created` / `updated` are `YYYY-MM-DD` (UTC). Set `updated` to today on edit.

## Body

- Start the narrative directly after the frontmatter. Do **not** repeat
  `title:` as a body `# heading` (avoids markdownlint `MD025`).
- Use `## Section` headings to separate concerns within the topic.
- State the wish and the why. Keep it about user-visible behavior and intent,
  not implementation.

## Growth

If a topic file grows unwieldy, split it into two topic files (each gets a new
`id`). There is no automatic threshold — use judgment.
