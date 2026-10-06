---
id: "de65"
title: two Kikakus consult each other over the intake, under a per-thread approval
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-07
updated: 2026-10-07
---

## Context

When a question in one repository needs another repository's answer, the
human carried it: he copied the text from one Kikaku to the other and back.
A Kikaku sent Kanri one line when something was decided and nothing else,
and Kanri never addressed a Kikaku first, so no seat could carry a question
between repositories. The tanto-feedback design (2026-10-06), sections 7.2
and 8, takes the consult. Serves exp-c53d and the driver d4d7.

## Options

- **A relay seat or a synchronous channel.** Rejected: a parked seat is
  unreachable, and files with an inbox already fit a seat the human paces.
- **Kanri as the Kikaku's messenger, or the intake waking the Kikaku** (Q-1's
  third option). Rejected.
- **One Kikaku reading both repositories, as the whole answer.** Rejected: it
  covers reading and nothing a repository must decide.
- **One approval per send.** Rejected: it keeps the human as the relay in all
  but the copying.
- **A consult as a file and one line over the intake, under a per-thread
  approval.** Chosen.

## Decision

The design's sections 7.2 and 8. A consult is a file and one line to the
other repository's intake, or direct to its Kikaku when that is listed; the
approval is the human's, per thread, with a scope in his words; arrival
raises a notice and wakes nobody; an identity check stops a consult between
repositories kept under different identities; consultations flow and
decisions do not.

**Amends no ADR.** Kikaku's messaging contract is in no decision: "You send
Kanri one line when something is decided, and nothing else" is
`roles/kikaku.md`'s, and that Kanri never addresses a Kikaku first is
`SKILL.md`'s; this ADR is the first to record either — the first changed as
the design's 8.9 says, the second kept. Decision-1ab5's "Kikaku is the seat
the human opens to think in" stands whole. The intake's side of a consult is
decision-73cc's amendment of decision-c322.

## Consequences

The human approves a thread once and no longer carries its text. A consult
waits for the human to enter the receiving Kikaku, since its arrival wakes
nobody; waking a Kikaku on arrival, should the notice prove too slow, and a
consult to a repository the human does not own are deferred (issue-357f).
