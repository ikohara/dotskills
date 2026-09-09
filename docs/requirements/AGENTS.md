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
- A `## Section` or a bullet may name the `design-<id>` that serves it. One
  that no design names is either unmet — see "requirements vs issues" — or
  met but not yet described.

## requirements vs issues

- `requirements/` = what the user needs and why — whether or not the
  system meets it yet (living).
- `issues/` = what is wrong or missing and is not being fixed now.
- A need the user states is a requirement fragment **even when it is unmet**.
  The gap it leaves is a separate issue fragment. One statement yielding two
  entries is not duplication: the requirement outlives the fix, the issue
  closes with it. Filing the issue alone loses the requirement.
- Two tests for "this is a requirement": the need survives a change of design
  — it would still hold if the system were built another way; and its reason
  is the user's own situation — time, trust, language, authority — not the
  system's coherence. A statement that fails either is design or an issue.
- The granularity rule above applies to classification too: a small need folds
  into an existing topic file as one bullet under a `## Section`, or is
  design; a new file only for a new topic. Never one file per sentence.
- The user's confirmation is the gate. A requirement candidate is proposed
  and accepted at `Direction?`; it is never written on the classifier's own
  judgment.

## Growth

If a topic file grows unwieldy, split it into two topic files (each gets a new
`id`). There is no automatic threshold — use judgment.
