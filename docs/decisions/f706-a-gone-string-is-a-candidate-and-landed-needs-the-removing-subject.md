---
id: "f706"
title: a gone string is a candidate; Landed needs the removing commit's subject read against the gap
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-03
updated: 2026-10-03
---

## Context

The triage instrument of decision-eda7 reads each issue's quoted strings and
paths against `main` and marks those no longer present as `gone`, tracing the
commit that removed each. A `gone` string can mean the gap closed, or only
that the words around it were rewritten. A Landed issue moves to
`docs/issues/resolved/`, the directory excluded from new reading. The working
note behind the triage carried the caveat that gone is not resolved. Decided
in the `tanto-issue-triage` design of 2026-10-02.

## Options

- **Every `gone` is Landed unless the human stops it.** Rejected: `resolved/`
  is excluded from reading, so a wrong move is the one error nobody re-finds.
- **The instrument alone decides nothing; the recommender reads the removing
  commit's subject against the issue's gap** (chosen).

## Decision

A `gone` string is a candidate, never the verdict. An issue is Landed only
when the recommender reads the subject of the commit that removed the string
against the issue's gap and finds the gap closed, and the brief's Landed line
carries that subject.

## Consequences

- The Landed rule rests on traced subjects, which proved rare: in rounds 1 to
  4b, 97 of 221 rows had every gone item trace to no commit (see
  `docs/notes/triaging-the-issue-pile.md`).
- The sentence that a row whose gone items all read `no commit found` is Kept
  was read as closing the Assigned and Merged destinations too. The human
  answered the sittings with 44 overrides, and moved all 33 rows the
  recommender had kept under that default while saying they would otherwise
  be Assigned or Merged; which destinations the sentence closes is the open
  question issue-d0d7 carries.
- An issue closed on `main` with no removing subject has no destination that
  moves it; issue-8aa6 carries that gap and the lack of a field for a
  hand-Landed row's closing commit.

## Sources

- [f706] 「よい」 (spec dialogue Q-5, 2026-10-02)
