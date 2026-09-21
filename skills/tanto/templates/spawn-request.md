# tanto spawn request

Written by Kanri at `.tanto/spawner/requests/<id>.json`, and by the launcher
for the first Kanri. `<id>` is `<ISO time>-<random>`, so a directory listing
in name order is the write order. Write the file atomically — write
`<id>.json.tmp`, then rename — because the spawner watches the directory and
takes a file the moment it appears.

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
  "message": "<for attention: one line, in the chat's language>"
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
- `mode` — `auto` for every seat Kanri spawns. `manual` appears in a
  measurement and nowhere else.
- `prompt` — the seat's whole orders. `/tanto kanri` for a Kanri;
  `/tanto keikaku topic=<topic> spec=<path> plan=<path>`;
  `/tanto jisso batch=<path>` for an ordinary plan and
  `/tanto jisso queue=<topic>` for a plan that edits this skill; for shoki,
  the one line `brief: <.tanto/<topic>/shoki-brief.md>`, which is not a
  `/tanto` invocation at all.
- `worktree` — shoki's `shoki-<topic>`, and absent for every other seat. The
  spawner passes it as `-w`, and the worktree is the CLI's own, under
  `.claude/worktrees/`.
- `addDir` — a list of directories, shoki's being the repository root, so
  that the scribe in its worktree can read `.tanto/`. Absent otherwise.
- `sessionId` — the seat's identity, for `stop`, `rm`, `resume`, and `ack`.
  Never a short id: the spawner maps one to the other from `seats.json`.
- `message` — `attention`'s one line. A bare `<id>` in it is filled by the
  spawner from `seats.json`, so that Kanri, which holds its own `sessionId`
  and not its short id, can still write the command the human types.

A result carries the request's fields and the op's own: `spawn` adds `id`,
`sessionId`, `name`, `cwd`, `transcript`, and `startedAt`; `stop` adds
`stopped`; `rm` adds `removed` and the worktree it removed; `resume` adds the
new `id` and `name` under the same `sessionId`; `attention` adds `notified`
and `channel`; `ack` adds `acked`. An op that failed adds `error`, which
carries the command's stderr, and nothing else.

At the plan close the topic's results move to
`.tanto/<topic>/spawner-results/` with the archive move. The spawner deletes
nothing under `results/`.
