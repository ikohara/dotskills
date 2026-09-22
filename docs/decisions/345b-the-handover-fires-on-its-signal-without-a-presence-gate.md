---
id: "345b"
title: the handover fires on its signal without a presence gate; the successor is spawned
status: accepted
supersedes: []
superseded_by: null
amends: ["eee2", "de63", "b6cb", "5ec7"]
amended_by: []
created: 2026-09-22
updated: 2026-09-22
---

## Context

decision-eee2 gated the ceiling-crossed handover on the human's presence, for
one stated reason: a handover is complete only when the human creates the
successor, and the successor is what sends the next batch prompt, so a
handover written to an empty room stalls the run for as long as the room is
empty. The gate existed for the hands the bg-seats design removes.

With the successor spawned rather than created by the human, the reason is
gone. The gate's own record confirms it was already costing more than it
bought: `reading.js --presence` read `absent` at eighteen boundaries in a
row.

## Options

- **The handover fires on its signal, with no presence gate, and the
  successor is spawned.**
- **Keep the gate.** Rejected: its premise — that a handover needs the
  human's hands to complete — is exactly what decision-1ea3 removes, and the
  measured effect of keeping it is a resident session held past its ceiling
  whenever the human is away, which is most of the time.

## Decision

The handover fires on its signal without a presence gate, and the successor
is spawned by the spawner.

**This ADR amends four accepted ADRs; each stands in every respect not named
here.**

- **decision-eee2** — its presence gate. The ceiling crossing and the noticed
  compaction still fire the handover at the next boundary; they no longer ask
  whether the human is present, and the `deferred` state they produced has no
  case left. eee2's derived ceiling, its `autoCompactWindow` backstop, and
  its `declined` terminal state stand.
- **decision-de63** — nothing of its residency or its procedure changes; what
  changes is that "the human creates the successor" becomes the spawner's
  act on the outgoing Kanri's request. Its two signals, its boundary-only
  timing, and its handover file stand.
- **decision-b6cb** — its "the human creates the successor and deletes the
  old session" clause, for the same reason. b6cb's decision itself — hand
  over at every plan close, without a threshold and without asking — stands,
  and is now the more nearly free for it.
- **decision-5ec7** — its "one create request at the landing". Requests are
  written per seat as the seat's work appears, not batched at the landing.
  5ec7's decision — Kanri's proposal is written at every plan close, before
  the recommender, with no between-plans write-out — stands.

## Consequences

- A resident seat no longer grows past its ceiling because the human happened
  to be asleep; the handover is a machine act end to end.
- The eighteen-boundary `absent` reading is the before-picture this change
  will be measured against.
- A handover that fires with nobody watching has to tell the human where the
  run went; the handover's last line naming no destination is filed as its
  own issue rather than solved here.
- The successor spawn is now on the critical path of every handover, so the
  launcher's spawn-or-attach discrimination has to be right in the one window
  where both a live Kanri and a pending successor exist.
- The reasoning is the tanto-bg-seats design spec of 2026-09-20.
