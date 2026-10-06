# tanto spawn request

Written at `.tanto/spawner/requests/<id>.json` by three writers, and by no
other. Kanri writes the `spawn` of every seat it starts — a Sekkei, a
Keikaku, a Jisso, an attached Kaiseki, shoki, and its own successor — its
`stop`, `rm`, `attention`, `ack`, and `release`, and, through
`boundary.js wake`, a `resume` and a `hold`. The launcher writes the `spawn`
of a Kanri when the run has none, of a Kikaku, a Hosa, a standalone
Kaiseki, and the messenger of `tanto fukki`; the `hold` and the `release`
around its attach to a dialogue seat; the `resume`s of `tanto` and `tanto fukki`; and
the `stop`s of `tanto teishi --seats`. A dialogue seat writes its own
`park`, and a Kikaku, a Hosa, or a standalone Kaiseki its own `stop` with
`self`, through `boundary.js request`. Every seat of a run is spawned on a
request. `<id>` is `<ISO time>-<random>`, so a directory listing
in name order is the write order. Write the file atomically — write `<id>.json.tmp`, or the whole file in a
directory the spawner does not watch, then rename or `mv` it to
`<id>.json` as the last step, never `<id>.json` in place — because the
spawner takes any `*.json` the moment it appears: a `<id>.json` written
there by a heredoc was read before it was closed and came back `request
did not parse`, three times in one session.

The spawner writes `.tanto/spawner/results/<id>.json`, the request's own
fields with the op's fields added, and deletes the request. Kanri reads a
result when it next acts and waits for none, but for the sixty seconds
`boundary.js wake` gives its `resume`s; the launcher waits for the result of
each request it writes, up to its `--timeout`.

JSON carries no comments, so the schema is one fenced example with every
field explained beside it.

```json
{
  "op": "spawn",
  "role": "jisso",
  "topic": "<topic word, or — for Kanri>",
  "model": "<family, from sessions.<role>.model>",
  "effort": "<level, from sessions.<role>.effort>",
  "branch": "<the branch the shared tree is on>",
  "mode": "auto",
  "prompt": "/tanto jisso batch=.tanto/<topic>/batch-A-prompt.md",
  "contract": 2,
  "succeeds": "<for a Kanri's handover spawn: the outgoing Kanri's sessionId>",
  "once": "<true, for the messenger alone>",
  "worktree": "shoki-<topic>",
  "addDir": ["<repository root>"],
  "sessionId": "<for every op but spawn>",
  "message": "<for attention: one line, in the human's language>",
  "after": "<for park, and for stop with self: a transcript record's uuid>",
  "waiting": "<for park: true, or absent>",
  "notice": "<for park: true, or absent>",
  "self": "<for stop: true when the seat asks to end itself>",
  "pid": "<for hold: the launcher's pid>",
  "forMs": "<for hold: 3300000, from Kanri's wake for the human>"
}
```

- `op` — one of `spawn`, `stop`, `rm`, `resume`, `attention`, `ack`,
  `park`, `hold`, and `release`. `rm` is written for shoki alone; the
  conversation of every other stopped seat is kept.
- `role` — `kanri`, `sekkei`, `keikaku`, `jisso`, `kaiseki`, `kikaku`,
  `hosa`, `shoki`, or `denrei`, the launcher's messenger, which has no role
  file and no roster row.
- `topic` — the topic word, or `—` for Kanri.
- `model`, `effort` — the family and the level from `sessions.<role>` in the
  merged `tanto.json`, named on the request as every dispatch names a model.
- `branch` — the branch the shared tree is on when the request is written.
  Informational: `spawnArgs` never reads it; it is carried into the result
  and then into `record --seat`'s Branch column.
- `mode` — passed to the spawned session as `--permission-mode`; `auto` is
  the default when absent, and is what Kanri and the launcher set for every
  seat they spawn. `manual` appears in a measurement and nowhere else.
- `prompt` — the seat's whole orders. `/tanto kanri` for a Kanri;
  `/tanto sekkei topic=<topic> spec=<path> branch=<branch> input=<path>`,
  `input=` only when an input document exists, with `ledger=<path>` added
  when another topic's batch is in flight and `spec=` then naming the draft
  path; `/tanto keikaku topic=<topic> spec=<path> plan=<path>`, with
  `ledger=<path>` added when another topic's batch is in flight, naming that
  ledger; `/tanto jisso batch=<path>` for an ordinary plan and
  `/tanto jisso queue=<topic>` for a plan that edits this skill;
  `/tanto kaiseki topic=<topic> brief=<path>` for an attached Kaiseki, its
  brief written before the request; the launcher's `/tanto kikaku`,
  `/tanto hosa`, and `/tanto kaiseki` with no key; for shoki, the one line
  `brief: <.tanto/<topic>/shoki-brief.md>`, and for the messenger its fixed
  forwarding prompt, neither of which is a `/tanto` invocation at all. A
  `resume` takes a `prompt` for a Kanri alone — `/tanto fukki`, from the
  launcher — and is refused one for any other role.
  A slash command in a `--bg` initial prompt invokes the skill, measured
  2026-09-21 against CLI 2.1.278; no other form is needed. The spawner puts
  the prompt after the fixed flags and before every `--add-dir`: that
  option is variadic, so a prompt after it is read as one more directory and
  the seat starts with no first turn.
- `worktree` — shoki's `shoki-<topic>`, and absent for every other seat: the
  name of the directory Kanri cut under `<root>/.claude/worktrees/` in the
  merge act. The spawner runs `claude --bg` with that directory as its cwd
  and never passes `-w`, and a directory that is not there is an `error`
  before `claude --bg` runs.
- `addDir` — a list of directories, shoki's being the repository root, so
  that the scribe in its worktree can read `.tanto/`. Absent otherwise.
- `contract` — `2` on every `spawn` written under this contract, which the
  spawner records on the seat. A seat spawned without it keeps the older
  behavior to its end: it is never parked or held, its handover is never
  refused, and it is `gone`, not `parked`, when it leaves the listing.
- `succeeds` — on a Kanri's handover `spawn`, the outgoing Kanri's
  `sessionId`. A `spawn` with `contract: 2` whose `role` is `kanri`,
  `kikaku`, or `hosa`, while `seats.json` holds a seat of that role, is
  refused with `error: "held: <sessionId>"`, unless it names that holder
  here.
- `once` — `true` on the messenger's `spawn` alone: the spawner stops and
  removes the seat once its turn has ended, and five minutes after its spawn
  in any case.
- `after` — on a `park`, and on a `stop` with `self`, the `uuid` of the last
  record of the seat's transcript that carries one when the request was
  written; `boundary.js request` reads it. The spawner acts once the turn
  has ended since that record.
- `waiting`, `notice` — on a `park`: a question the seat put to the human is
  unanswered, and the turn was not started by the human. The spawner records
  `waiting` on the seat and, when it goes from unset to set with `notice`
  given, raises one desktop notice,
  `waiting: <role> <topic> — tanto <role> [<topic>]`. A `park` without
  `waiting` clears it.
- `self` — on a `stop`, `true` when the seat asks to end itself
  (`/tanto taiseki`): honored for a Kikaku, a Hosa, or a Kaiseki whose topic
  is `—`, and `error: "not a seat the human paces"` for any other.
- `pid`, `forMs` — on a `hold`: the launcher's `pid`, the mark lasting while
  that process answers; or, from `boundary.js wake --hold`,
  `forMs: 3300000`, the mark lasting until the seat's transcript has not
  been written for that long. `release` deletes either mark.
- No field carries the seat's name or its settings: the spawner adds both
  to every spawn itself — `--name <repo>-<role>[-<topic>]-<hex>`, from the
  root's basename, `role`, and `topic`, and
  `--settings '{"worktree":{"bgIsolation":"none"}}'`, which turns the CLI's
  background isolation off for that seat alone — so a request carries
  neither. A `resume` passes no flag at all: the CLI brings back the options
  the spawn passed, as its note on the resume, which the spawner logs, lists
  them — measured for the name, the setting, the model, and the permission
  mode; whether it also brings back the effort is unmeasured. The
  bg-seat-ergonomics design's own by-hand probe never listed it, and the
  bg-seat-ergonomics plan's own measurement task could not check: a
  workspace-trust gate refused the spawn — a fresh clone's folder trust
  unset in `.claude.json` — before the resume step was reached.
- `sessionId` — the seat's identity, for `stop`, `rm`, `resume`, `ack`,
  `attention`, `park`, `hold`, and `release`.
  Never a short id: the spawner maps one to the other from `seats.json`.
- `message` — `attention`'s one line, sent as written. A way in that it
  names is `tanto <role> [<topic>]`, which no handover changes, so the
  spawner fills nothing in it.

A result carries the request's fields and the op's own: `spawn` adds `id`,
`sessionId`, `name` — the seat's name from its spawn, as the listing's first
sighting carries it — `cwd`, `transcript`, and `startedAt`; `stop` adds
`stopped`; `rm` adds `removed` and, when `claude rm` printed one, the
worktree it removed — never for shoki, whose worktree is Kanri's; `resume`
adds the `id` and the `name` under the same `sessionId`, the name the one
the spawn gave; `attention` adds `notified` and `channel`; `ack` adds
`acked`. A `stop` or `rm` whose session the CLI had already dropped —
`No job matching` — is not a failure: it adds `stopped` or `removed` and
`note: "already exited"`. An op that failed adds `error`, which carries the
command's stderr, or its stdout when the stderr is empty, and nothing
else, with two exceptions. A `spawn` whose `claude --bg` printed the CLI's idle note
`(idle — send a prompt to start)` returns
`error: "prompt not delivered: <that line>"`, and the seat, recorded with
`undelivered: <that line>`, is removed with `claude rm` and marked
`removed` — or kept `running`, for the census, when that `rm` fails. And
the ad hoc-worktree guard at a spawn's first sighting also records the seat
as `stopped`, with `strayed: <cwd>`, before returning `error`. The same guard at a pass of the spawner's census
writes no result file at all: `strayed: <cwd>` beside the seat's `stopped`
in `seats.json`, the log line, and the toast
`strayed: <role> <topic> <name> — <cwd>` carry it.

What the ops of the run-owned seats add:

- `spawn` records `contract`, `once`, and the request's id on the seat, and
  writes `seats.json` as soon as it sees the new session, before it looks
  for the transcript. A second holder is `error: "held: <sessionId>"`
  (`succeeds` above).
- `park` adds `parkRequested`, the epoch milliseconds it was recorded at, at
  once; the park itself follows when the turn has ended and the listing
  shows the seat idle and unheld. Its errors: `not a dialogue seat`, for a
  seat that is not a contract-2 Sekkei, Keikaku, Kikaku, Hosa, or Kaiseki;
  `ended`, for a seat `stopped` or `removed`.
- `hold` answers once the mark is set, waiting out a stop that is still
  finishing. Its errors: `unknown seat <sessionId>`, for a `sessionId` the
  state file does not hold; `old-contract seat`, for a seat without
  `contract`; `ended`; `a hold names a pid or forMs`, when the request
  carries neither; `held by another terminal`, when a launcher whose `pid`
  still answers holds it; `claude agents: <error>`, when the listing could
  not be read; `in a tab`, when the listing shows the seat `interactive`;
  `still listed`, when a park that was finishing never let go. `release`
  deletes the mark and does nothing else.
- `resume` runs `claude --resume <sessionId> --bg` only when the listing
  does not show the seat. Its errors: `no prompt for this role`; `removed`,
  for a seat the spawner has removed; `claude agents: <error>`, when the
  listing could not be read; `listed`, with the entry's `name` and `kind`,
  when a tab or a live process holds it; `still listed`, when a stop that
  was finishing never let go; `copy <id> removed`, when the CLI started a
  copy, which the spawner stops and removes; `copy <id> not removed: <cause>`,
  when the copy could not be removed, the CLI's words following; `prompt
  not delivered`, when a Kanri's prompt did not reach it, and the session
  it resumed is stopped first. Otherwise the seat is `running`, and the
  result adds `id` and `name`.
- `stop` runs `claude stop` only for a seat the listing shows in the
  background. A seat a tab holds is recorded `stopped` with
  `note: "in a tab"`, and a seat not listed, a `parked` one included, with
  `note: "already exited"`. A `stop` with `self` waits, for a seat in the
  background, until the turn has ended since `after`, and is dropped ten
  minutes after it was written, with a log line and the notice
  `taiseki not done: <role> — tanto <role>`. A stopped seat records
  `stoppedAtMs`, and a `self` stop `endedBy: "taiseki"`.

At the plan close the topic's results move to
`.tanto/<topic>/spawner-results/` with the archive move. The spawner deletes
nothing under `results/`.
