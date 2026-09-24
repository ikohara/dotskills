---
id: "8320"
title: spawned seats do not handshake; identity is the `sessionId`; the roster stays Kanri's, written from the spawner's result files
status: accepted
supersedes: []
superseded_by: null
amends: ["73c3", "0775", "ded8", "0ea5"]
amended_by: ["cdc4"]
created: 2026-09-22
updated: 2026-09-24
---

## Context

The handshake existed because a session the human opened had to announce
itself: nothing else knew it was there, and its name was the only address.
Once the spawner starts a seat (decision-1ea3), the spawner already knows
what it started and can say so in a result file, and the seat's `sessionId`
— readable from the CLI, stable across a rename — is a better identity than
a name that changes whenever the editor restarts.

That leaves the roster. Two designs were live, and both had real arguments.
The third Kikaku file's §3 had the spawner append the roster's identity rows
itself, as the first bookkeeping to leave the LLM, with its §5 wake-up
argument behind it: every line Kanri writes costs a wake-up, and identity
rows are the most mechanical lines there are. The counter-argument is the
repository's own one-writer-per-file rule.

## Options

- **The spawner writes its own `seats.json` and result files; Kanri reads
  them at its next act and keeps writing the roster.** The wake-up count is
  the same, because Kanri is woken by the act, not by the read, and there is
  no race over a file with two writers.
- **The spawner appends the roster's identity rows directly** (the third
  Kikaku file's §3). Recorded, not chosen: it would be the first bookkeeping
  to leave the LLM, and its §5 wake-up argument is real — but it puts two
  writers on one file for no measured saving.
- **Keep the handshake for spawned seats.** Rejected: it is a round trip to
  learn something the spawner already recorded.

## Decision

Spawned seats do not handshake. A seat's identity is its `sessionId`. The
roster stays Kanri's — one writer per file — and Kanri writes it from the
spawner's own `seats.json` and result files, read at its next act. Chosen
with the human's word (D-6, S-1).

**This ADR amends four accepted ADRs; each stands in every respect not named
here.**

- **decision-73c3** — its command-line channel for Kanri's address. The
  spawner's result files are how a spawned seat's identity reaches the
  roster, so the bootstrap argument is no longer the channel it was. 73c3's
  born-name rule, its no-rename rule, and the roster as the address book
  stand.
- **decision-0775** — its bootstrap-argument clause (D-6, S-7), for the same
  reason. 0775's decision itself — the roster's first data row, read at the
  moment of sending, is the address — stands.
- **decision-ded8** — its status vocabulary gains `stopped` beside
  `cleared`: a terminal seat is stopped by the spawner, not `/clear`ed by the
  human, and one status per fact is ded8's own rule. The rest of ded8 stands,
  including `dead` for the unlisted.
- **decision-0ea5** — its mechanism only. A terminal seat's release is a
  `stop` request to the spawner rather than the human's `/clear`. 0ea5's
  timing is unchanged: `release:` still follows the form check directly, at
  every seat.

## Consequences

- A seat's identity survives its renaming, which is what req-04f5 asks for
  and what an editor restart repeatedly tested.
- The roster keeps one writer, so a handover's cold read still has a single
  authority for who is live.
- Kanri now reads two files it did not read before, and a spawner result that
  never arrives is a new failure mode with no handshake to fall back on.
- The rejected option keeps its reason on record, so the "move bookkeeping
  off the LLM" argument can be re-opened with the measurement it needs rather
  than re-argued from scratch.
- The reasoning is the tanto-bg-seats design spec of 2026-09-20.
