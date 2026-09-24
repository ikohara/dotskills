---
id: "362e"
title: "`tanto` resumes a Kanri that left the listing without the run's request, and the census revives a seat that returns"
status: accepted
supersedes: []
superseded_by: null
amends: ["84c8"]
amended_by: []
created: 2026-09-24
updated: 2026-09-24
---

## Context

A Kanri the human `/stop`s, or one that crashes while the spawner runs, left
the listing, and the launcher replaced it with a fresh spawn (the
bg-seat-ergonomics design spec's Measured 7). The resident's context and its
id were lost to an act that the human meant as a pause, or that no one meant
at all.

## Options

- **`tanto` resumes a Kanri that left the listing without the run's request,
  and the census revives any seat that returns.** Chosen.
- **Resume every seat that left the listing.** Rejected: a Jisso's
  replacement is the Replace table's, whose verification of the tree comes
  first.
- **Keep the fresh spawn.** Rejected: it discards the resident's context for
  an exit no one asked for.

## Decision

`tanto` resumes a Kanri that left the listing without the run's request,
rather than spawning a fresh one, and the census revives a seat that returns
to the listing. A resident the run itself retired, by `tanto down --seats`,
stays retired (D-11).

**This ADR amends decision-84c8** in what its one command does with a Kanri
that left the listing: it resumes it. 84c8's rule that the launcher and the
spawner ship with the skill, and that the one command is also fukki, stands.

## Consequences

- Every way out of the resident's terminal leaves the run resumable by the
  one command, which req-04f5 now asks for.
- A Jisso that leaves the listing still goes through the Replace table.
- The reasoning is the bg-seat-ergonomics design spec of 2026-09-23.
