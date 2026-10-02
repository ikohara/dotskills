---
id: "5e6b"
title: the chat side emits a handover and never writes scene files; shoroku's file mode ingests it
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-02
updated: 2026-10-02
---

## Context

A project often starts in a chat with an AI, where the reasons are said, and
the repository is created afterwards. The experience layer wants those
reasons in its scenes. The input questions f33b and 2b72 (exp-2b72) asked
whether the chat should write scene files directly or always go through the
handover. Decided in the `experience-layer` spec of 2026-09-30.

## Options

- **The chat writes scenes directly** into a fresh repository.
- **The chat emits scene-format drafts in a handover**, which shoroku's file
  mode ingests into the repository (chosen).

## Decision

The chat side emits a handover and never writes scene files. Shoroku's file
mode reads the handover and writes the scenes, under the repository's own
rules.

## Consequences

- Id de-collision happens at ingestion: an id from the handover that
  collides is re-rolled, and the bundle's references to it rewritten, before
  anything is written.
- The two files given to the chat must stand alone, since the chat cannot
  read the repository.
