---
id: "76b5"
title: an issue records its provenance in the body and still carries no tags
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-17
updated: 2026-09-17
---

## Context

`docs/issues/AGENTS.md` has said from the start that an issue carries no
`tags:` or `labels:` field — classification is re-derived from content as
needed. A Kikaku decision of 2026-09-17 adds a `Source:` provenance line to an
issue's body, naming where the issue came from. The proposal to add tags was
raised again on the strength of it: if one new per-issue field lands, why not
the other.

## Options

- **This decision** — the `Source:` line lands and the `tags:` rejection
  stands; the two are different kinds of field.
- **Tags land with the provenance line**, on the argument that both are small
  per-issue metadata. Rejected for the reason below.
- **Neither lands**, keeping the body free of any standing line. Rejected: the
  provenance question is real and asking every reader to reconstruct where an
  issue came from is the cost the `Source:` line removes.

## Decision

An issue records its provenance and still carries no tags.

Provenance is an **immutable fact**. It is true at write time, it is stated
once, and nothing that happens to the issue afterwards can falsify it — so a
line that records it never needs maintenance and never rots.

A tag is a **mutable judgment** about a subject that keeps moving. Its truth
depends on how the issue is currently understood, which is exactly what changes
as the issue is appended to, re-scoped, or partly resolved. A tag nobody
revisits is worse than no tag, because it reads as current. That is the same
distinction the provenance decision itself draws, and adding the one is not an
argument for the other.

## Consequences

`docs/issues/AGENTS.md` keeps its "No `tags:` / `labels:`" rule unchanged when
the `Source:` line is added to the issue body. A future proposal for tags is
answered by this record rather than re-argued.
