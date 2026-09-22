---
id: "363c"
title: two kinds of seat, drawn by whether the seat's work is dialogue with the human
status: accepted
supersedes: []
superseded_by: null
amends: ["1ab5"]
amended_by: []
created: 2026-09-22
updated: 2026-09-22
---

## Context

Once the spawner owns every session-lifecycle command (decision-1ea3), the
run has to say which seats it starts and which the human opens. The line
could be drawn by role, by cost, or by what the seat actually does. Only one
of those survives a rename of the roles: a seat whose work is a conversation
with the human needs a window the human is typing into, and every other seat
does not.

The VS Code extension offered a third way — its "Activate session" command
would let the human reach a background session from the editor's session
list — and the design deliberately declined to lean on it. Probe item 8
measured CLI 2.1.277 against the extension's bundled binary one release
behind, so the two drift, and a premise that drifts is not a premise.

## Options

- **Two kinds of seat, drawn by whether the seat's work is dialogue with the
  human.** Terminal seats are spawned and visited by `claude attach`; tab
  seats are opened by the human in the editor.
- **Draw the line by role**, naming the seats that are spawned. Rejected: the
  list would have to be re-decided every time a role is added, and it hides
  the property that actually decides the case.
- **Every seat spawned, the human reaching all of them through the
  extension's session list.** Rejected on the measurement above: the
  extension's bundled binary and the CLI drift, so the session list is not
  something the design can rest on.

## Decision

There are two kinds of seat, and the discriminator is whether the seat's work
is dialogue with the human. Terminal seats are spawned by the spawner and
visited by `claude attach` from the editor's integrated terminal. Tab seats
are opened by the human. Kaiseki is a tab seat, because its brief is a
dialogue. The extension's "Activate session" is not a premise of the design.

**This ADR amends decision-1ab5** in one part: its descriptions of the seats
it added — Keikaku, Kikaku, and Hosa — are now read through the terminal/tab
split, so that each seat's description says which kind it is and who opens
it. Everything else 1ab5 decided stands on its own recorded reasoning: the
three seats themselves, the spec and the plan as two roles, and the spec
review accepted as the boundary between them.

## Consequences

- The human opens fewer windows, and the ones they open are the ones they
  talk into.
- Reaching a terminal seat is the CLI's own `attach`, from the editor's
  integrated terminal, so no editor extension version is load-bearing.
- A role that changes what it does — a seat that gains a dialogue, or loses
  one — changes kind by the same rule, without a new decision.
- The reasoning is the tanto-bg-seats design spec of 2026-09-20.
