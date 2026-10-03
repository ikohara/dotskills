---
id: "61a3"
title: a triage round's recommendation is an ordinary SDD task checked by the opus reviewers, and the human's answers are direction files between batches
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-03
updated: 2026-10-03
---

## Context

decision-eda7 put the reorganization of the issue pile in recommend rounds
inside a plan, with the human answering by exception. Each round needs a
judgment seat, a check on that judgment, and a way for the human's answer to
reach the next batch. decision-bba6 already decides a recommend → answer →
apply cycle inside a plan, but says nothing of how the brief reaches the
human. The 2026-10-01 Kikaku decision on the topics after `experience-layer`
(its section 2) named `task.review-quality` or a project-overridden
`shoroku.recommend` — opus either way — as the grouping seat. Decided in the
`tanto-issue-triage` design of 2026-10-02.

## Options

- **Kanri runs the close's shape between batches, with the brief verbatim.**
  Rejected: a verbatim brief cost a sonnet Kanri about 94000 tokens in one
  kessai turn (measured 2026-10-01), a cost paid at every sitting, and the
  plan would be instructing Kanri.
- **The Kikaku decision's own two seats** — a `task.review-quality` dispatch,
  or a project-overridden `shoroku.recommend`, opus either way — as the
  round's judgment. Rejected: an opus first pass still needs a review, so the
  round would buy opus twice, and the shoroku skill's recommend mode is shaped
  for proposals into `docs/`, not for five triage destinations.
- **A Jisso-dispatched opus recommender on a borrowed kind**, as
  `experience-layer`'s batch C dispatched the recommender inside its task.
  Rejected: the kind's name and its work diverge, and the opus cost per round
  is the same.
- **SDD tasks on sonnet with the opus reviews the loop already carries, the
  brief read as a file** (chosen).

## Decision

A round's recommendation is an ordinary SDD task: `task.implement` writes it
and the two SDD reviewers on opus check it. The human's answers arrive between
batches as direction files Kanri writes, not as a recommender dispatch and not
as a kessai in Kanri's window. The brief is read in the editor; Kanri prints
paths and counts, never a brief verbatim. This departs from the Kikaku
decision's section 2, and the human confirmed the departure in the spec
dialogue (its Q-10).

This extends decision-bba6 and replaces no part of it: bba6 decides the
cycle, and this decision adds how the brief reaches the human.

## Consequences

- A sitting costs Kanri paths and counts, not a brief's length.
- The opus judgment of a round is the two reviews, so a rule a round reads two
  ways passes review under either reading; the triage's own run met this
  (issue-d0d7).
- The direction file is the form the apply consumes, so its line form is
  pinned in one place for producer and consumer.

## Sources

- [61a3] 「よい」 (spec dialogue Q-2, 2026-10-02)
- [61a3] 「推奨で」 (spec dialogue Q-3, 2026-10-02)
