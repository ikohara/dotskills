---
id: "1c07"
title: the spawner is the notifier; the hook is optional
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: ["ebbd", "6c00"]
created: 2026-09-22
updated: 2026-10-04
---

## Context

req-04f5 asks that the run tell the human when it needs them. With every
machine seat in the background, a seat that blocks on a prompt only the human
can answer, or a kessai that waits, is invisible: there is no window anyone
is watching. Something has to raise a notice on the machine, and it has to do
so without the human configuring anything, because a design that requires a
setting is a design that silently fails for whoever did not apply it.

The spawner is already resident for the length of a run and already polls
`claude agents --json` for its own census, so it is the process that knows
first.

## Options

- **The spawner is the notifier**, raising a toast from its own census; a
  harness hook may be added by the human for immediacy and is never required.
- **A harness hook as the mechanism.** Rejected: the run would have to place
  something in the human's settings, which decision-1ea3's own reasoning
  refuses for the permission case and which is no more welcome here.
- **No notice at all**, with the human checking `claude agents`. Rejected
  against req-04f5.

## Decision

The spawner is the notifier; the hook is optional (D-1). Its census of
`claude agents --json` raises a toast on a `blocked` state and on an
`attention` request. The run places nothing in settings.

## Consequences

- Notices work on a machine where nothing was configured, which is the
  property that makes them trustworthy.
- A human who wants immediacy rather than poll latency adds a hook
  themselves, and the skill neither needs nor writes it.
- The census's poll interval becomes the notice's worst-case latency, and the
  poll's own cost on the machine is unmeasured — recorded in the
  tanto-bg-seats dogfood report rather than assumed away.
- A failure mode the census cannot see — a foreground tool call hung inside
  an otherwise-normal turn — is not covered by this decision, and is filed as
  its own issue.
- The reasoning is the tanto-bg-seats design spec of 2026-09-20.
