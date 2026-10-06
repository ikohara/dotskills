---
id: "cdc4"
title: identity is the `sessionId` for every seat, and the census is its one signal
status: accepted
supersedes: []
superseded_by: null
amends: ["8320", "ded8", "84c8"]
amended_by: ["ebbd", "7a19", "97cc"]
created: 2026-09-24
updated: 2026-10-06
---

## Context

decision-8320 made the `sessionId` a spawned seat's identity, but the seats
the human opens were still matched by name, and an editor restart renames
every tab seat. A seat whose session had gone was known only by a wait, a
guess, or a name that no longer matched. Three open issues proposed three
different keys (issue-261c, issue-d92f, issue-894d).

## Options

- **`boundary.js census` reads `claude agents --json` and keeps the sessions
  whose cwd is the root or under it, by its own comparison; a row whose
  `sessionId` it does not list is `dead`.** Chosen.
- **A timeout** (issue-261c's proposal). Rejected: it guesses.
- **Resolving paths through the filesystem** (issue-d92f's first proposal).
  Rejected: the census's own comparison is enough.
- **A name-and-transcript key** (issue-894d's). Rejected: the name adds
  nothing the id does not settle.
- **The census as a file the spawner writes.** Rejected: it needs the spawner
  running, and a tab Kanri could not read it.
- **Kanri matching the listing by hand.** Rejected: the census exists so that
  no session does this.

## Decision

Identity is the `sessionId` for every seat, the ones the human opens as the
ones the run starts, and the census is its one signal. `boundary.js census`
reads `claude agents --json` and keeps the sessions whose cwd is the root or
under it; a row whose `sessionId` it does not list is `dead` — no timeout, no
inference, no name match. The tab seats type nothing after a restart. A
session the census does not place under the root is another repository's and
is never reported.

**This ADR amends three accepted ADRs; each stands in every respect not named
here.**

- **decision-8320** — its identity rule, widened from the spawned seats to
  every seat. 8320's no-handshake rule for spawned seats and its one-writer
  roster stand.
- **decision-ded8** — how `dead` is decided: by the census's listing, not by
  a reading or a wait. ded8's clear rule and `dead` for the unlisted stand.
- **decision-84c8** — what the launcher's resume asks of the tab seats after
  a restart: nothing typed in them. 84c8's one command that is also fukki
  stands.

## Consequences

- A restart costs the human one command and, for the resident, one word; no
  tab is re-introduced by hand.
- Two repositories' runs on one machine are never mistaken for each other.
- The census depends on the listing's own truth; a stale entry in it keeps a
  dead seat alive, which the fix wave's `pid` filter addresses.
- The reasoning is the bg-seat-ergonomics design spec of 2026-09-23.
