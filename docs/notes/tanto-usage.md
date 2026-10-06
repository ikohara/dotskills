# tanto usage record

The Markdown sibling of `docs/notes/tanto-usage.jsonl`, which states the
record's scope because a JSON Lines file cannot carry a comment.

## Scope

One line per close of any repository whose feedback file reached this
repository's `.tanto/inbox/`: the usage extract that travelled in the
feedback file's Usage block, so that cost and what it bought can be read as
a trend over months, by model id, across repositories (decision-32e5,
exp-06b2). The record names no repository: a row is keyed by its workspace
id (decision-b8af) and carries no topic, no session, and no instant — a date
and durations only.

The repository that ships the skill reaches the file one close late: its
shoki's `collect` runs before its own close places its feedback file, so the
newest own row arrives with the next close.

## A row

One JSON object per line, the extract with one added field:

- `source` — the feedback file's basename without `.md`, for example
  `<YYYY-MM-DD>-feedback-<workspace id>`; the key a row is collected by.
- `schema`, `workspace`, `closed` (the close's date), `measured`,
  `span_hours`, `active_hours`.
- `seats` — one entry per seat: `role`, `windowed`, `effort`, `models` (the
  token counts by model id), `wakeups` (`human`, `peer`, `task`, `other`,
  `cold`, `warm`), `context` (`first`, `last`, `max`), `compactions`, and
  `hours` from its first response to its last.
- `dispatches` — summed per dispatching role, kind, and model id: `role`,
  `kind`, `model`, `n` (the number summed), `counts`, `tool_uses`,
  `wall_ms`, `resumes`.
- `quality`, `share`, `totals` — as the local `usage.json` has them; the
  quality counters ride whole, so a model's cost and what it bought are read
  in one row.

A response is counted once, by its `message.id`
(`docs/notes/claude-code-sessions-observed.md`).

## Writer and reader

- **Writer:** `usage.js collect` alone, run by this repository's shoki in
  the close's worktree. It appends a row for every feedback copy in the inbox
  whose `source` is not already in the file, creates the file when it is
  absent, and prints `collected: <n> rows, <m> already present`. A row is
  one append and is never rewritten; the file is not edited by hand and is
  not reviewed.
- **Reader:** `usage.js report`, which prints Markdown tables (the rows
  grouped by workspace id among them), `--json` for one object, and
  `--csv <dir>` for four flat tables in an untracked directory the human
  names. Its readers are the human, in the Kikaku, when touching the
  expected-model config or the built-in defaults, and the next Keikaku when
  it sizes batches.

JSON Lines rather than YAML, TOML or CSV: a row is one append and a merge
never rewrites a line; `.yamllint`'s line cap cannot hold a row, and CSV
would be four files for one nested concern (decision-32e5).
