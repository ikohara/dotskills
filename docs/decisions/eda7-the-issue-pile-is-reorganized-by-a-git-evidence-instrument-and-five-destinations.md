---
id: "eda7"
title: the issue pile is reorganized by a git-evidence instrument and five body-line destinations, on the cheaper seats, with the human answering by exception
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-03
updated: 2026-10-03
---

## Context

By 2026-10-02 the open and deferred issues numbered 308, grown from 259 the
day before, and the next topics were to open on that list. A probe over 52
issues had found most of them stale against `main`, so a reader could no
longer tell which issues still described a gap. The Kikaku decision of
2026-10-01 on the topics after `experience-layer` placed the reorganization
as its own topic, and the human asked for the issue state to be looked at and
reorganized with it. Decided in the `tanto-issue-triage` design of
2026-10-02.

## Options

- **A top-family read of the pile.** Rejected by the 2026-09-19 Kikaku
  decision on issue yield (its section 2) as a cost, and kept only as to the
  method by the 2026-10-01 decision (its section 6).
- **A between-plans sweep with no topic.** Rejected: 308 items is too many for
  one kessai, and the instrument did not exist.
- **Folding the reorganization into each next Sekkei's input.** Rejected: the
  clusters that no placed topic holds would stay stale.
- **An instrument plus recommend rounds inside a plan** (chosen).

## Decision

The issue pile is reorganized by an instrument that reads git evidence and by
five destinations written as body lines — Landed, Merged, Assigned, Re-hung
on a scene, Kept — one per issue, each with a one-line reason. The rounds run
on the cheaper seats, and the human answers by exception.

## Consequences

- The repository owns a `scripts/` tool for the purpose (decision-62dd says
  where it lives and when it is wired into a close).
- The next topics open on a settled list.
- Every tracked line the triage writes names a commit by its subject, never by
  hash.
- The carrier topic, the scene, and the resolution are body lines, so no
  frontmatter field is added to the issue type.

## Sources

- [eda7] 「tanto の issueの状況も見て、その再編も含め」 (Kikaku, 2026-10-01)
- [eda7] 「推奨で行こう」 (Kikaku, 2026-10-01)
