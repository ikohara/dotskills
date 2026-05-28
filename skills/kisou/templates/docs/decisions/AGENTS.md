# {{decisions}}/ — AGENTS

A `decisions` file is an **Architecture Decision Record (ADR)**: a point-in-time
record of a significant choice — its context, the options considered, the
decision, and the consequences accepted. ADRs are **append-only and immutable**
once accepted; you never rewrite the body. To reverse a decision, write a new
ADR that supersedes the old one.

## When to write an ADR

Record an ADR only when **both** hold:

1. it was a choice among real alternatives, and
2. it has lasting consequences worth recording (costly to reverse, or likely to
   be questioned later).

Trivial choices stay in `{{design}}/`. A significant decision typically produces
both an ADR (the record) and a `{{design}}/` update (the new current state) — not a
duplication: `{{design}}/` holds the operational truth, the ADR holds the reasoning
and the roads not taken.

## File

- Path: `{{docs}}/{{decisions}}/<id>-<slug>.md`. Reference prefix: `decision`.
- One decision per file. No index file.

## Frontmatter

```yaml
id: "a3f7"
title: <decision title>
status: accepted          # proposed | accepted | superseded | deprecated | rejected
supersedes: []            # decision ids this replaces
superseded_by: null       # decision id that replaced this, or null
created: 2026-05-27
updated: 2026-05-27        # changes only on a status flip
```

- `id` is a quoted string; dates are `YYYY-MM-DD` (UTC).
- Default `status` is `accepted` (a recorded decision was already made). Use
  `proposed` only while genuinely tentative.

## Body (MADR-lite)

Narrative starts directly after the frontmatter. Use these sections; keep them
short, or omit any for a trivial decision:

```text
## Context       — what forced a decision
## Options       — the alternatives considered
## Decision      — the choice
## Consequences  — what we accept; trade-offs; follow-ups
```

## Superseding (the only edit to an accepted ADR)

To reverse or replace a decision:

1. Write a **new** ADR; set its `supersedes: [<old-id>]`.
2. On the **old** ADR, set `status: superseded`, `superseded_by: <new-id>`, and
   bump `updated:`. Do **not** change its body.

Status and supersede links are the only mutable parts of an accepted ADR.
