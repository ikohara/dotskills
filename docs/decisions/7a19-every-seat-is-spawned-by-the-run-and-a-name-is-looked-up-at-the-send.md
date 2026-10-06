---
id: "7a19"
title: every seat is spawned by the run; a seat is its sessionId, and a name is looked up at the send
status: accepted
supersedes: ["363c", "ded8"]
superseded_by: null
amends: ["1ab5", "8320", "cdc4", "0ea5", "d831", "ce83", "5ec7", "7c87", "73c3", "08bc"]
amended_by: []
created: 2026-10-06
updated: 2026-10-06
---

## Context

Until this decision a run had two kinds of seat (decision-363c): seats the
spawner started in the background, and dialogue seats the human opened in an
editor tab. A tab seat sent a handshake, was `/clear`ed and re-handshaken at
its end, and was told `release:`; its name was whatever the editor gave the
tab, and an editor reload renamed it. The human named the chores — clearing
a seat and reporting it to Kanri, retyping the launcher at every handover —
and said a reload runs once every day or two on its own (D-9), so every
rename asked someone for a repair (exp-c53d, exp-9d8f). The measurements of
2026-10-05 showed that a background session can be opened in a tab once its
process is stopped, keeping one transcript and one `sessionId`, so the
dialogue seats need not leave the chat panel to be spawned. Decided in the
run-owned-seats design of 2026-10-05, sections 1, 3, and 5.1.

## Options

- **Every seat spawned by the run, addressed by the name the listing prints
  for its `sessionId` at the send** (chosen).
- **Keeping tab seats beside spawned ones.** Rejected: the handshake,
  `release:`, and `/clear` rules would stay, and exp-c53d and exp-9d8f would
  stay unmet for those seats.
- **The tab as the only face.** Rejected: it presupposes one editor, against
  exp-1c96.
- **No tab at all.** Rejected: it gives up the chat panel for the dialogue
  seats, and the spike shows it need not be given up.
- **A compatibility period in which a new Kanri also handles old tab
  seats.** Rejected: the rules this design removes would stay in Kanri for
  the migration's sake (D-7).
- **A name stored as a seat's address and repaired on a rename.** Rejected:
  an editor reload is ordinary, and every repair is an act asked of someone
  (D-9).
- **Leaving a hand-typed `/tanto <role>` to proceed.** Rejected: it would be
  a seat the run does not hold and the one-holder guard never sees.

## Decision

No seat is opened by the human and none sends a handshake; a seat's orders
are its prompt's keys. A session the state file does not hold stops at
`/tanto <role>`. There is one holder per role, refused at the spawner for a
request that carries the contract's mark, which every request written under
this text does. A seat's end is a `stop` request that follows the form check
directly, with nothing said to the seat or to the human; `release:`,
`cleared`, and every `/clear` rule go. The address of a seat is the name the
listing prints for its `sessionId` at the moment of sending, the roster's
first row staying Kanri's stored address. The `no-role` second line stays,
for a name that moved in a reload and for a sender reading another
repository's roster.

**Supersedes** decision-363c (two kinds of seat) and decision-ded8 (the clear
rule is every role's): nothing of either remains but ded8's "`dead` for a
session the census no longer lists", which decision-cdc4 holds in its own
words and decision-97cc narrows.

**Amends**, in these parts and no others:

- decision-1ab5 — "Kikaku is the seat the human opens to think in", and its
  account of Kikaku's and Hosa's lifecycle (opened by the human, `/clear`ed
  by him, re-handshaking, the old row `cleared`): a Kikaku and a Hosa are
  started by the spawner on the launcher's request, are parked between
  turns, and end on `taiseki`. The rest stands: the three seats, the spec
  and the plan as two roles, the boundary at the spec review accepted, and
  Hosa as Kanri's hand in the hotfix lane.
- decision-8320 — "Spawned seats do not handshake" is every seat's; "its
  status vocabulary gains `stopped` beside `cleared`" is `stopped` alone;
  "`release:` still follows the form check directly, at every seat" is the
  `stop` request. The rest stands: a seat's identity is its `sessionId`, and
  the roster is Kanri's, written from the spawner's result files.
- decision-cdc4 — "the ones the human opens as the ones the run starts" and
  "The tab seats type nothing after a restart": there are none. The rest
  stands: the `sessionId` is every seat's identity, and the census is its
  signal — as decision-97cc narrows its `dead` rule.
- decision-0ea5 — "`release:` follows the form check directly, at every
  seat": what follows it directly is the `stop` request. The rest stands:
  the slot, its reason, and that a seat is never re-woken to explain an
  item.
- decision-d831 and decision-ce83, each in its own words, since
  decision-ded8's reading of them is retired with it — d831's "before the
  delete request", and ce83's "with its proposal on disk before the session
  is deleted": a session is not deleted; it is stopped by a `stop` request,
  and its conversation is kept. The rest of each stands.
- decision-5ec7 — in its amendment of decision-b6cb, "a window is `/clear`ed
  and reused, not closed" and "one `release:` per seat": a seat is stopped
  and its conversation kept, one `stop` request per seat. The rest stands:
  Kanri's proposal at every plan close, before the recommender, and no
  between-plans write-out.
- decision-7c87 — "a terminal seat is named by the spawner": every seat is.
  The rest stands, the flag-less resume among it; decision-97cc's prompt for
  a Kanri is a positional argument and not a flag.
- decision-73c3 — "The address of a session is the bare name its handshake
  carried": it is the name the listing prints for the seat's `sessionId`
  when the line is sent. What stands is two rules: the `[ref]` is appended
  only after `SendMessage` reports a name ambiguous, and the roster's first
  data row is Kanri's address.
- decision-08bc — "does not handshake" on a mismatch at `/tanto <role>`, and
  "refuses the roster row" at the handshake: the spawner starts the seat on
  the configured family, the seat checks once at its start, and a mismatch
  is a warning carried on its first line. The rest stands: an expected model
  per role from a per-user config, matched by substring, and no session's
  model switched by the skill.

## Consequences

- The human types no handshake, no `/clear`, and no report of what he did
  to a seat; a tab renamed by a reload costs nothing, since no name is
  stored as an address.
- Every dialogue seat now lives in the background and is opened in a tab
  only while its process is stopped, which is what decision-97cc's park
  provides.
- The roster's Name cell becomes a record, not an address; whether the
  `renamed` mark and the `ack` op are still worth keeping is left to the
  `roster-ledger` topic.
- A run not yet moved to this contract is kept working by a `contract` mark
  on each seat and `.tanto/spawner/contract`, code to be removed once every
  repository that reads the skill has moved.
