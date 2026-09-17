---
id: "7e0d"
title: the human's shoroku check runs once per topic, at its close; every other moment writes candidates only
status: accepted
supersedes: []
superseded_by: null
amends: ["ce83", "d538"]
amended_by: []
created: 2026-09-17
updated: 2026-09-17
---

## Context

The staged write-out ran the same four steps — candidates, recommend, check,
apply — at T0, at T1, at T2, and at every session exit. Measured over the runs
under this repository's `.tanto/`: six human checks per topic, four applies held
waiting for a commit slot in a single day, a `question back to the session` path
with a zero count across every run, 52 KB of recommendation text, and three
checks answered through Kikaku rather than in Kanri's window.

## Options

- **A, this decision** — the check happens at exactly one kind of moment, a
  topic's close; every other moment records candidates as `pending` rows and
  nothing else.
- **B, the stages as they are**, with only the model and the brief changed.
  Rejected: it leaves six synchronous human waits per topic and the applies
  still held for a slot.
- **C, the check answered by silence.** Rejected: the recommended-reject group
  is then read by no one, and T1 item 11 of 2026-09-14 shows a recommended
  reject can be wrong in a way only a source read catches. Reconsider once a
  fable recommendation's reject group has been measured against the human's
  overrides across a few topics.
- **Kikaku as the formal recommender.** Rejected: interactivity was 10% of the
  reason and the follow-ups are small.
- **Keeping the recommender run before a Sekkei's or Keikaku's deletion.**
  Rejected: its only purpose is the question-back path, which has never fired.
- **Jisso kept alive through the merge decision.** Rejected: nothing the merge
  needs is in Jisso's context.

## Decision

The human's shoroku check runs once per topic, at its close. Every other moment
— a spec accepted, a plan landed, a session's exit, a batch boundary, a review,
a Kaiseki report — writes candidates only, as `pending` rows of the ledger's
`S-n` table.

This amends decision-ce83 in one part: its four steps "at every stage of the
write-out — T0, T1, T2, and every exit" become the same four steps at one
stage. The rest of ce83 — adoption as a recommendation checked by exception,
and the write-out applied from files by a dispatched subagent — stands on its
own recorded reasoning.

It amends decision-d538 in one part: Kanri "dispatches the recommender at once"
becomes "checks the form and asks for the deletion at once". The rest of d538 —
a Sekkei or Keikaku writing its exit proposal unasked at its final boundary —
stands.

decision-d831 stands unamended: every planned exit still carries its own
shoroku, now as a proposal on disk that waits for the close.

T0 is folded into the close. The `question back to the session` path is
dropped, and with it the recommender run before a deletion.

## Consequences

`docs/` lags a topic's spec and plan until that topic's close. A concurrent
topic's Sekkei reads the spec on the branch, or the Kikaku decision file its
orders line names, for what `docs/` does not yet hold. The human judged this
acceptable.
