---
id: "d125"
title: a retiring Jisso's exit shoroku is its report's Shoroku proposal section
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: ["9162"]
created: 2026-09-18
updated: 2026-09-24
---

## Context

decision-d831 requires every planned session exit to carry its own shoroku.
Under the per-batch rotation (decision-ea95) a Jisso exits at every batch
boundary, so the form that exit shoroku takes is paid for once per batch
rather than once per plan, and a separate exit proposal file per seat would
be the most frequent artifact of the run.

## Options

- **The batch report's own Shoroku proposal section** — the retiring seat
  writes its items where it is already writing, and nothing new is created.
- **A separate exit proposal file per retiring Jisso**, as Sekkei and Keikaku
  write under decision-d538.
- **Dropping the T2 proposal too and naming the SDD ledger as a source** —
  the design spec's Q1 option (c).

## Decision

A retiring Jisso's exit shoroku is its report's Shoroku proposal section (the
seat-lineage design spec of 2026-09-17, Q1 = (b)).

Option (c) is rejected **for now**, not on its merits: it changes the `close:`
line's `proposal <path>` slot, which is pinned byte for byte in three files
that the `shoroku-at-close` work is landing. It is recorded as issue-915a with
the trigger that frees it.

## Consequences

- A batch boundary creates no shoroku file of its own; the report the boundary
  already requires carries the section.
- Kanri's form check at the boundary covers the exit shoroku, so the seat is
  releasable as soon as its report is on disk.
- The T2 proposal remains, written by the last Jisso, until issue-915a is
  revisited.
