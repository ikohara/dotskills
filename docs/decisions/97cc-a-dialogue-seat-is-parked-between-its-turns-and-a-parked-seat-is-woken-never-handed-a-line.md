---
id: "97cc"
title: a dialogue seat is parked between its turns, at its own request, by the spawner; a parked seat is woken and never handed a line
status: accepted
supersedes: []
superseded_by: null
amends: ["39fb", "cdc4", "362e", "1c07", "b282"]
amended_by: []
created: 2026-10-06
updated: 2026-10-06
---

## Context

Once every seat is spawned by the run (decision-7a19), a dialogue seat lives
as a background session, and the editor shows the notice "This conversation
is still open somewhere else" for a row whose process is alive. The human
wants to open such a row by clicking it. The measurements of 2026-10-05
showed that a tab opens a stopped session normally and that a resume of the
session in the background afterwards keeps its options and its transcript;
they also showed that a resume issued while a tab holds the session starts a
copy holding the whole conversation (P-8). A tab's turn writes no
`turn_duration` record, so "the turn ended" cannot be keyed on it. Decided
in the run-owned-seats design of 2026-10-05, section 2.

## Options

- **The seat asks to be parked at the end of every turn; the spawner stops
  it once the turn has ended** (chosen).
- **Seats kept alive and the launcher stopping one on request.** Rejected:
  the row shows the editor's notice whenever the human clicks it directly,
  which is how he wants to open it.
- **The spawner parking on its own reading of the listing, at a detach or on
  a timer.** Rejected: an idle seat may hold work in flight, and only the
  seat knows that its turn ended with nothing running; a park no seat asked
  for is R-1 by the design's own hand.
- **Kanri parking.** Rejected: a wake-up of Kanri's per park.
- **Parking Kanri too, always or at a kessai.** Rejected: every peer line
  would need a wake, and the copy is likeliest there (D-1).
- **"The turn ended" keyed on the `turn_duration` record, or on a clock
  comparison with the request's time.** Rejected: a tab's turn writes no
  such record, and the spawner's clock at the moment it handles a request is
  not the seat's at the moment it wrote it.
- **A line carried as a resume's prompt.** Rejected: a resume issued in the
  second a tab takes the seat starts a copy that holds the seat's whole
  conversation and acts on the line (P-8). A copy started with no prompt
  waits, and is removed.
- **A link from outside the editor to open a tab.** Rejected: three attempts
  opened nothing, and the editor went down once around them.
- **The new behavior switched on for a whole spawner, not seat by seat.**
  Rejected: a spawner restarted under a run that has not moved — by a
  reboot, in any repository, from the first batch on — would refuse that
  run's next handover and park a Keikaku its Kanri knows only as gone.
- **A park at every turn's end with no hold but the launcher's.** Rejected:
  a dialogue seat would be one turn long from Remote Control, which the
  Kikaku file's cost — offline until something wakes it — did not say.
- **A request dropped once it is honored.** Rejected: a seat woken that
  takes no turn would stay alive until the supervisor's idle hour, its row
  showing the editor's notice to the human who had just looked in and left.

## Decision

A dialogue seat writes a park request at the end of every turn unless work
it dispatched is running, with `--waiting` while a question to the human
stands and `--notice` when the run started the turn. The spawner stops the
seat only when the turn has ended since the request — a last message that is
an `assistant` with `stop_reason: end_turn`, settled — and the listing shows
it in the background, `idle`, and not held; the state is written before the
stop. An honored request stands until a new turn begins, so a seat woken
that takes no turn is stopped again. The launcher's hold and release do
nothing but set and clear a mark, and Kanri's hold for a face with no
launcher expires 55 minutes after the seat's last turn. A wake carries no
prompt for any seat but Kanri, waits out a stop in progress, refuses a seat
the listing holds, and removes a copy; a line is sent by `SendMessage` after
the wake, in the same turn. `blocked` is a background entry's
`status: "waiting"` with its cause. A dialogue seat the listing no longer
holds is `parked`, its row `live`. All of it applies to a seat whose `spawn`
carried the contract's mark, and to no other.

An attach that wakes a parked seat is admitted. decision-1ea3 gives the
spawner alone `claude --bg`, `stop`, and `rm`, so that no session starts
one; `claude attach` is the human's own act, run for him by the launcher on
a seat the spawner already holds, and it stands outside that rule in letter
and in reason. It is preferred to a resume through the spawner before the
attach because it was measured to work (P-4) and takes one process out of
the second in which a resume makes a copy (S-5).

**Amends**, in these parts and no others:

- decision-39fb — "Kanri sends a line to a terminal seat on the roster as
  recorded, with no census first": Kanri reads the seat's state before every
  send and wakes a seat that is parked or gone; and a wake of a parked seat
  is an expected path, not a recovery. The rest stands: nothing rests on an
  idle seat's survival, a resume keeps the `sessionId` and the conversation
  and is never a spawn, and a failed resume is the Replace table's.
- decision-cdc4 — "a row whose `sessionId` it does not list is `dead`":
  except a dialogue seat the state file holds `parked`, whose row stays
  `live`; the census reads the state file as a second input. The rest
  stands, as decision-7a19 leaves it.
- decision-362e — "the census revives a seat that returns": a `gone` seat,
  as it says, and a `parked` one is `running` again while the listing holds
  it. The rest stands.
- decision-1c07 — the spawner's census raises a notice on a further signal,
  a turn the run started that ended on a question to the human (`waiting:`),
  and its `blocked:` notice carries the cause. The rest stands: the spawner
  is the notifier, and the hook is optional.
- decision-b282 — "on a `resume` the same note is the CLI's normal line": on
  a resume that carries a prompt — Kanri's alone — the note is a failed
  delivery, as on a spawn. The rest stands.

## Consequences

- A dialogue seat's row opens normally from the editor's list whenever the
  seat is parked, and the run pays for no idle process between turns.
- Every line to a dialogue seat costs a wake first; the bill of the first
  turn after a wake follows the seat's idle time, not the kind of wake.
- The standing request rests on one state-file field, stated as a narrative
  and not as an invariant over the field; the acceptance scene found that a
  seat a tab has held loses it.
- Waking a parked seat from Remote Control without Kanri, and why an attach
  or a tab wake loses the conversation's cache where a `--resume --bg` keeps
  it, are left open.
