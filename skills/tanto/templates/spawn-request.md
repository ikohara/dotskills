# tanto spawn request

Written by Kanri at `.tanto/spawner/requests/<id>.json`, and by the launcher
for the first Kanri. `<id>` is `<ISO time>-<random>`, so a directory listing
in name order is the write order. Write the file atomically — write `<id>.json.tmp`, or the whole file in a
directory the spawner does not watch, then rename or `mv` it to
`<id>.json` as the last step, never `<id>.json` in place — because the
spawner takes any `*.json` the moment it appears: a `<id>.json` written
there by a heredoc was read before it was closed and came back `request
did not parse`, three times in one session.

The spawner writes `.tanto/spawner/results/<id>.json`, the request's own
fields with the op's fields added, and deletes the request. Kanri reads a
result when it next acts; it waits for none of them.

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
  "worktree": "shoki-<topic>",
  "addDir": ["<repository root>"],
  "sessionId": "<for stop, rm, resume, ack>",
  "message": "<for attention: one line, in the human's language>"
}
```

- `op` — one of `spawn`, `stop`, `rm`, `resume`, `attention`, `ack`. `rm` is
  written for shoki alone; a stopped Jisso's or Keikaku's conversation is
  kept.
- `role` — `kanri`, `keikaku`, `jisso`, or `shoki`. A tab seat is never
  spawned and never has a request.
- `topic` — the topic word, or `—` for Kanri.
- `model`, `effort` — the family and the level from `sessions.<role>` in the
  merged `tanto.json`, named on the request as every dispatch names a model.
- `branch` — the branch the shared tree is on when the request is written.
  Informational: `spawnArgs` never reads it; it is carried into the result
  and then into `record --seat`'s Branch column.
- `mode` — passed to the spawned session as `--permission-mode`; `auto` is
  the default when absent, and is what Kanri sets for every seat it spawns.
  `manual` appears in a measurement and nowhere else.
- `prompt` — the seat's whole orders. `/tanto kanri` for a Kanri;
  `/tanto keikaku topic=<topic> spec=<path> plan=<path>`, with `ledger=<path>`
  added when another topic's batch is in flight, naming that ledger;
  `/tanto jisso batch=<path>` for an ordinary plan and
  `/tanto jisso queue=<topic>` for a plan that edits this skill; for shoki,
  the one line `brief: <.tanto/<topic>/shoki-brief.md>`, which is not a
  `/tanto` invocation at all.
  A slash command in a `--bg` initial prompt invokes the skill, measured
  2026-09-21 against CLI 2.1.278; no other form is needed.
- `worktree` — shoki's `shoki-<topic>`, and absent for every other seat. The
  spawner passes it as `-w`, and the worktree is the CLI's own, under
  `.claude/worktrees/`.
- `addDir` — a list of directories, shoki's being the repository root, so
  that the scribe in its worktree can read `.tanto/`. Absent otherwise.
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
- `sessionId` — the seat's identity, for `stop`, `rm`, `resume`, and `ack`.
  Never a short id: the spawner maps one to the other from `seats.json`.
- `message` — `attention`'s one line. A bare `<id>` in it is filled by the
  spawner from `seats.json`, so that Kanri, which holds its own `sessionId`
  and not its short id, can still write the command the human types.

A result carries the request's fields and the op's own: `spawn` adds `id`,
`sessionId`, `name` — the seat's name from its spawn, as the listing's first
sighting carries it — `cwd`, `transcript`, and `startedAt`; `stop` adds
`stopped`; `rm` adds `removed` and the worktree it removed; `resume` adds
the `id` and the `name` under the same `sessionId`, the name the one the
spawn gave; `attention` adds `notified` and `channel`; `ack` adds `acked`.
An op that failed adds `error`, which carries the command's stderr, and
nothing else — except the ad hoc-worktree guard at a spawn's first
sighting, which also records the seat as `stopped`, with `strayed: <cwd>`,
before returning `error`. The same guard at a pass of the spawner's census
writes no result file at all: `strayed: <cwd>` beside the seat's `stopped`
in `seats.json`, the log line, and the toast
`strayed: <role> <topic> <name> — <cwd>` carry it.

At the plan close the topic's results move to
`.tanto/<topic>/spawner-results/` with the archive move. The spawner deletes
nothing under `results/`.
