---
id: "d4dc"
title: wayaku's cache is per clone, excluded locally, never in the shared ignore file
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-02
updated: 2026-10-02
---

## Context

wayaku writes a translation of a file to a cache under `<root>/.wayaku/`,
which must stay out of the repository. A translation is one reader's
convenience, and a shared ignore line would make every clone carry a rule for
a tool one person uses. The choice was recorded only in the wayaku
requirement file the `experience-layer` migration removed.

## Options

- **The shared `.gitignore`.**
- **The per-clone exclude**, `<root>/.git/info/exclude` (chosen).
- **Committing the cache.**

## Decision

wayaku's cache is excluded per clone, through `<root>/.git/info/exclude`,
and never through the shared `.gitignore`.

## Consequences

- The cache is invisible to the repository and to collaborators.
- Each clone excludes it once.
