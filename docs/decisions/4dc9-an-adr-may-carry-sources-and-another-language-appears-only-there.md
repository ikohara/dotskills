---
id: "4dc9"
title: "an ADR may carry `## Sources`, and a language other than the documents' appears only there"
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-02
updated: 2026-10-02
---

## Context

A decision taken from the human's own words is most trustworthy when the
words are kept, and the human speaks Japanese while the documents are in
English. A scene keeps its quotes under `## Sources`; an ADR had no place for
them. Decided in the `experience-layer` spec of 2026-09-30.

## Options

- **Parallel `.ja.md`** documents.
- **Quotes inline** in Context.
- **A Sources section** after Consequences (chosen).

## Decision

An ADR may carry an optional `## Sources` section after Consequences:
verbatim quotes keyed by the item ids they back, in the language they were
said in. It is the one place in an ADR where a language other than the
documents' appears.

## Consequences

- MADR-lite gains an optional section.
- A heading-wise reader skips it, and reads it only to verify where a line
  came from.
