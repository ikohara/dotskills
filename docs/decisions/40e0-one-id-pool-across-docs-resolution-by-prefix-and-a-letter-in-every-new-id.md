---
id: "40e0"
title: one id pool across `docs/`, resolution by prefix, and a letter in every new id
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-02
updated: 2026-10-02
---

## Context

The experience layer gives ids to items inside a file — expectations,
drivers, open questions, Won't lines — and references them with the same
`exp-<id>` form as a scene. With one pool per type, an item id could equal a
design or issue id, and a reference resolved by lookup would have two
targets. An all-digit id also autolinks to a GitHub issue. Decided in the
`experience-layer` spec of 2026-09-30.

## Options

- **Per-type pools**, as before.
- **A global pool with a prefix-less reference.**
- **A global pool with prefixed references** (chosen).

## Decision

One id pool across `docs/`, documents and items alike: a new id is one no
file `docs/<type>/**/<id>-*.md` and no `**<id>**` line under
`docs/experience/` or in the hub carries. References keep the type prefix and
resolve by it. A new id contains at least one of `a` to `f`; existing
all-digit ids stay.

## Consequences

- One word in the rules changes, and the uniqueness check is a wider grep.
- An older project's cross-type collisions are harmless, since the prefix
  still resolves them.
