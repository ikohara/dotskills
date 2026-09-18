---
id: "2db1"
title: the names are Propose / Recommend / Check / Apply and "Shoroku proposal", and the whole skill is swept
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-18
updated: 2026-09-18
---

## Context

The close's four steps and the sections that feed them were called by two
vocabularies at once: "candidates" for what a seat raises, and step names that
did not match the headings a `sections` read keys on. A heading is a machine
pointer in this skill (`docs/notes/tanto-consistency-checks.md` check 22), so
two words for one thing is a silent failure rather than a style matter.

## Options

- **Rename the steps and the headings together, and sweep the whole skill** —
  Propose / Recommend / Check / Apply, "Shoroku proposal" for a seat's section,
  "Shoroku proposal items" for the two tables.
- **Rename the step names only and leave the headings** — the cheaper edit.

## Decision

The names are Propose / Recommend / Check / Apply, "Shoroku proposal" for a
seat's section, "Shoroku proposal items" for the two tables, and the whole
skill is swept (the seat-lineage decision file of 2026-09-16 §3, Q1's rider).

The half-measure is rejected: leaving the headings keeps two words for one
thing across exactly the files a `sections` call reads by heading.

## Consequences

- Every `sections` argument and every form check keys on one spelling, and
  check 24 of the consistency note holds the pair.
- Ledgers written before the rename keep the old word in their own rows; the
  rename is forward-looking and no historical workspace is rewritten.
- decision-7e0d's T0 recommendation deferred this record until the names
  existed in the skill; they now do, which is what makes the ADR writable.
