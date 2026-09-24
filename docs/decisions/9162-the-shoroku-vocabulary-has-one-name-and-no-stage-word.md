---
id: "9162"
title: the shoroku vocabulary has one name and no stage word
status: accepted
supersedes: []
superseded_by: null
amends: ["2db1", "1f5f", "d831", "d538", "d125"]
amended_by: []
created: 2026-09-24
updated: 2026-09-24
---

## Context

The skill had grown several words for one thing: a seat's "exit proposal",
its report's "Shoroku proposal" section, the close's "T2" files, and a Stage
column that said which of them a ledger row came from. A reader had to hold
the mapping, and a `sections` call that reads by heading missed whichever
word a file used.

## Options

- **"Shoroku proposal" for every seat's proposal, the files named by the
  step and keyed on the writing session, the commit subject
  `docs: shoroku for <topic>`, and no Stage column.** Chosen.
- **"Exit proposal"** (the 2026-09-16 Kikaku decision's term, replaced with
  the human's word, D-7). Rejected: it reads as a proposal to exit.
- **"Exit notes".** Rejected: it collides with `docs/notes/`.
- **"Handoff notes".** Rejected: it collides with Kanri's handover.
- **申し送り.** Rejected: it implies a successor, where the items go to the
  close's recommender.
- **A prose-only pass that keeps "T2" as a name** (Q5's B). Rejected: it
  leaves the stage word in the files a reader navigates by.

## Decision

The shoroku vocabulary has one name and no stage word. Every seat's proposal
is a "Shoroku proposal"; the files are named by the step and keyed on the
writing session; the close's commit subject is `docs: shoroku for <topic>`;
the ledger's table has no Stage column.

**This ADR amends five accepted ADRs; each stands in every respect not named
here.**

- **decision-2db1** — its names, where they carry a stage word. Its four step
  names and "Shoroku proposal" stand.
- **decision-1f5f** — the name "T2" for the final write-out. The split into
  propose and apply, and the adoption rule, stand.
- **decision-d831** — its `exit-<role>[-<suffix>]` file names, its
  `docs: exit shoroku` subject, and its exit stage values in the candidates
  table. Its rule that every planned exit carries its own shoroku stands.
- **decision-d538** — its term "exit proposal". Its rule that a Sekkei or
  Keikaku writes its proposal unasked at its final boundary stands.
- **decision-d125** — its term "exit shoroku". Its rule that a retiring
  Jisso's proposal is its report's Shoroku proposal section stands.

## Consequences

- One heading reads every seat's proposal, so a `sections` call finds all of
  them.
- The older ADRs, reports, and ledgers keep their words as history; a reader
  maps "exit proposal" and "T2" to the current names through this ADR.
- The reasoning is the bg-seat-ergonomics design spec of 2026-09-23.
