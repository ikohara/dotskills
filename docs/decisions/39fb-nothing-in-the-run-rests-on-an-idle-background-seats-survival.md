---
id: "39fb"
title: nothing in the run rests on an idle background seat's survival
status: accepted
supersedes: []
superseded_by: null
amends: ["b909", "ded8"]
amended_by: []
created: 2026-09-24
updated: 2026-09-24
---

## Context

An idle `claude --bg` seat is sometimes collected — once four together, at
about sixty minutes of idleness, by one sweep of unknown cause — and
sometimes lives eleven hours (issue-1368). decision-b909 has a plan that
edits the skill spawn all its Jissos at the landing and wait, and the
queued-seats-issues decision's interim rule treated sixty minutes of
idleness as the ceiling. A send to a session that is gone returns "No agent
named … is reachable". The design "bg-seat-fixes" (2026-09-24), sections 4
and 5, sets a rule that rests on no idle time at all (Measured 3, 8).

## Options

- **A line to a terminal seat that errors, or to a row recorded `dead`,
  sends Kanri to the census, and a seat the census does not list is resumed
  and the line sent again.** Chosen.
- **A keep-alive** — the spawner addressing each queued seat at an interval.
  Rejected: its premise, a sixty-minute timer, is not what was measured; it
  would not protect a seat from a sweep of another cause; and every ping
  re-reads the seat's whole context.
- **A stop at the landing and a resume at the boundary (Q6).** Rejected: the
  stop has to come after the seat's first turn, which needs a new spawner
  feature or Kanri waiting on idle notices.
- **A census before every send (Q8).** Rejected: its output would accumulate
  in Kanri's context at every send, while a send to a gone seat already
  errors.
- **A throwaway-seat measurement before deciding (Q6).** Rejected: the rule
  is correct whatever the collection's condition is.
- **`stopped` for a collected seat.** Rejected: `stopped` is a stop the run
  made, and the census's mark stays mechanical (5.3).

## Decision

Kanri sends a line to a terminal seat on the roster as recorded, with no
census first. A send that errors, or a row the roster records `dead`, sends
Kanri to the census; a terminal seat the census then does not list — a stale
entry with no `pid` included — gets a `resume` request, which keeps the
`sessionId` and the whole conversation, and the line is sent again when the
result lands. A resume is never a spawn and never a replacement. A `queued`
row whose session is not listed stays `queued`, and goes `live` before its
`batch:` line is sent. When a resume fails, the seat is lost and the Replace
table's row for its role applies.

This amends decision-b909 in one part: the Jissos that wait at the landing,
reading nothing, are resumed with their conversation when collected, before
their prompt reaches them; the rest of decision-b909 stands. It amends
decision-ded8 in one part: `dead` stays the census's mark for a session it
no longer lists, and a terminal seat's `dead` row whose transcript is on
disk is resumed when a line is due to it and goes `live` again; the rest of
decision-ded8 stands. decision-76a6 stands unchanged: a `queued` row goes
`live` before its line is sent.

## Consequences

- The rule costs nothing for a seat that is alive, and covers every line to a
  terminal seat — a queued Jisso's `batch:` line, a rework prompt's, the
  close's line to the plan's last Jisso, a `coldread:` line to Keikaku.
- A skill-editing plan's queued seat keeps the context that read the skill
  before batch A, so rule 11's reason holds across a collection.
- The collection's condition stays open (issue-1368); no design rests on it.
