---
id: "6930"
title: retired Jissos are released at their boundary, not at the close's list
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-18
updated: 2026-09-18
---

## Context

The seat-lineage decision file of 2026-09-16 §2 proposed holding every retired
Jisso until the close and asking the human to dispose of them in one list, on
the reasoning that a list is one interruption rather than N. The human's I-1 §2
answered the other way, and the reason is the window-reuse requirement of
req-04f5.

## Options

- **Release at the boundary** — the retiring seat's window is freed as soon as
  its report and form check are done, and becomes the queue's next seat.
- **The close's deletion list** — hold every retired seat and dispose of them
  together at the topic's close.

## Decision

Retired Jissos are released at their boundary, not at the close's list (I-1 §2,
over the seat-lineage decision file §2).

The close's list is rejected: with windows reused rather than closed, a
released window **is** the queue's next seat, so holding it gains nothing and
costs the run a window per batch.

## Consequences

- The roster's `cleared` rows appear through the plan rather than all at its
  close.
- The queue can be refilled from released windows on a plan where rule 11
  allows a mid-plan start, which is the ordinary case (the exception is in
  decision-ea95's consequences).
- The close's own list shrinks to the seats that are still live at it.
