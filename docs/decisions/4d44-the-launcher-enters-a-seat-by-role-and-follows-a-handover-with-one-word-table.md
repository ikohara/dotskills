---
id: "4d44"
title: the launcher enters a seat by role and follows a handover; one word table for the launcher and /tanto
status: accepted
supersedes: []
superseded_by: null
amends: ["84c8"]
amended_by: []
created: 2026-10-06
updated: 2026-10-06
---

## Context

Once every seat is spawned by the run (decision-7a19) and a dialogue seat is
parked between its turns (decision-97cc), the human needs one way to enter
any seat from a terminal, and a handover of Kanri had cost him one retyped
`tanto` each time. The launcher was one command that was also fukki
(decision-84c8), printed `claude attach <id>` for the human to type, and
carried `down` and a positional root. The human's answers in the design
dialogue (D-2, D-4, D-5, D-10, D-12, D-14, D-15) fixed the words and the
defaults. Decided in the run-owned-seats design of 2026-10-05, section 4.

## Options

- **`tanto [<role>] [<topic>]`, attach by default, follow a handover, four
  words in one table** (chosen).
- **`-fg` / `-bg` as the switch names.** Rejected: a seat is always a
  background session, and the names read as how it is started.
- **Dialogue seats not attaching by default.** Rejected: a fresh seat is not
  in the editor's list, so the default would start a seat the human cannot
  open without a reload, and it would presuppose VS Code (D-10).
- **A default that depends on whether the seat was just started.** Rejected:
  the outcome is unknown until the command is typed.
- **The launcher exiting at a handover, to be typed again.** Rejected: one
  typed act per handover is the chore the topic removes.
- **`--new` on the launcher for a fresh Kikaku.** Rejected: the end is said
  in the seat, which works from any face (D-2).
- **A free-form word in the seat for the end.** Rejected: 「終わり」 also
  reads as "for today" (D-4).
- **English words at the launcher and Japanese ones in sessions.** Rejected:
  two words for one act.
- **`down` kept as an alias.** Rejected: it has no pair, since `up` does not
  exist, and it reads as a teardown while the act keeps every conversation.
  And `suspend` for `teishi`: without `--seats` the seats keep running, so
  the word promises more than the act does (D-12).
- **`tanto -n` as the status listing.** Rejected: it starts a Kanri when none
  exists. Printing the listing only around an attach: there is then no way
  to look when he wants to (D-14).
- **For fukki with Kanri alive, two steps — the human typing `/tanto fukki`
  inside.** Rejected: it does not meet D-5's "either one". Stopping and
  resuming the live Kanri to carry the word: it stops a working Kanri and
  whatever it has in flight. A signal file: Kanri wakes only on a line, so
  the file would be read at an unknown later time (D-15).
- **A messenger on `haiku`.** Rejected: it answered the `no-role` line
  itself (P-5).

## Decision

`tanto [<role>] [<topic>]`, the role omitted meaning `kanri`. Every role
attaches by default, `--no-attach` the explicit switch. The launcher runs
the attach itself, under a hold for a dialogue seat, and decides from the
files whether to follow a successor. Four words — `fukki`, `taiseki`,
`teishi`, `jokyo` — each with kana, kanji, and an English alias, in one
table for the launcher and `/tanto`. `tanto fukki` tells Kanri in every
case, by the resume's prompt or by a messenger. `tanto jokyo` prints the
run's seats from disk, with what waits on the human and each dialogue
seat's size. `down` and the positional root are retired.

**Amends** decision-84c8, in these parts and no others: "The launcher is one
command" — it is one program that takes a role and four words; and its
rejected alternative "A listing subcommand for the run's seats:
`claude agents` is that view already" is reversed for `jokyo`, since
`claude agents` shows neither a role, nor a parked seat, nor what waits on
the human. The rest stands: the launcher and the spawner ship with the skill
and never with a consuming project, and the bare command is still fukki —
it starts a run when none is live and rejoins the live one.

## Consequences

- A handover of Kanri takes the attached human to the successor with
  nothing typed.
- Since the launcher runs the attach with inherited stdio, any line it
  prints before the attach flashes by and cannot be read back; a figure the
  human must read goes after the attach or into `tanto jokyo`.
- `tanto <role> --new` stays deferred, should saying the end in the seat
  prove not enough.
