---
id: "0775"
title: Kanri's address is read, never announced
status: accepted
supersedes: []
superseded_by: null
amends: ["73c3", "de63"]
amended_by: []
created: 2026-09-20
updated: 2026-09-20
---

## Context

decision-73c3 made the roster the address book and gave Kanri's address three
channels, the first of them a `kanri-address:` line a successor broadcasts;
decision-de63 made announcing that line a consequence of every handover. The
reason recorded for the announcement was that an address dies with its
session. That premise was measured away on 2026-09-16: a window keeps its name
and its `[ref]` across `/clear`, so a successor's address is the one the
roster's first data row already holds.

The forcing evidence is a measured gap. Three Kanri handovers fell during one
spec stage (`dotskills-79` → `dotskills-ce` → `dotskills-fa` → `dotskills-10`,
the middle one an editor restart). The first successor found the ledger with no
record of a peer's pending line; the second and third found the lines recorded.
The `unanswered:` / `answered:` Events pair below is the rule that would have
made the first case like the other two. Observed in the same stage: a Kanri
handover fell while a seat's `passage-check:` line was unanswered and the
ledger held no record of it, so a successor's cold read would not have found
it — the `kanri-address:` broadcast is what made that seat re-send, which is
why the re-send-at-next-wake-up rule below is part of the design and not only
the successor's ledger read.

Serves req-04f5's "a role reads Kanri's address from the roster at the moment
of sending".

## Options

- **Keep the `kanri-address:` broadcast.** Rejected: its premise no longer
  holds, and it costs one send per live peer at every handover.
- **A session list in a project JSON** (the 2026-09-18 Kikaku decision, §7).
  Rejected: a second copy of the roster's own data, with its own staleness.

## Decision

The roster's first data row, read at the moment of sending, is the address.
The `kanri-address:` line and its two broadcasts are retired; the command-line
argument stays as the bootstrap for a workspace with no roster; the successor
starts in the outgoing window; the batch prompt travels as `batch: <path>`.

This replaces, in decision-73c3, the `kanri-address:` line as an address
channel — the rest of 73c3, the born-name rule and the roster as the address
book, stands on its own recorded reasoning. It replaces, in decision-de63, the
"tell every live peer its address" consequence of a handover; the rest of de63
stands. decision-76a6 is unchanged in substance: a queued seat is still sent
nothing, and now there is no broadcast for it to be spared.

## Consequences

- A peer that sent into a handover gap re-sends on its own next wake-up, which
  in a handover-less gap is the human's word in its window or a line from the
  new Kanri.
- Kanri records every peer line it does not answer in the same turn as an
  `unanswered:` Session events line and pairs it with `answered:`; the
  successor answers the open ones first. The receiving Kanri's own procedure
  does not yet say to write that event — issue-3f38.
- No role caches the address, and no line announces it, so a role file that
  still says Kanri "answers with its address" is drift to repair.
