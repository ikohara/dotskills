---
id: "dff9"
title: a `--bg` spawn's initial prompt goes undelivered behind a `blocked` state, with no signal
severity: high
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-1

A `claude --bg -w <worktree> --add-dir <main checkout> --permission-mode auto`
spawn of a `shoki` seat can start a session that never processes its
initial prompt, the one line `brief: <.tanto/<topic>/shoki-brief.md>` that
`templates/spawn-request.md` documents as the seat's `prompt`. The spawn
request itself succeeds — the result file carries a normal `id`,
`sessionId`, `name` and `startedAt`, and no `error` — and nothing after it
says anything went wrong. The issue-fd4b the sources cite is not a file in
this repository's `docs/issues/`; this issue holds the data points.

Three measurements:

- **2026-09-22, a plan close's own shoki** (S-1). The spawn
  sat `blocked` for about 5.5 hours with no signal reaching the spawning
  Kanri; the spawner's census logged it once and raised nothing further.
  `claude attach` showed a session that had never processed its `--bg`
  initial prompt at all — a bare, un-briefed window, not one paused
  mid-task. The human pasted the brief's absolute path into the attached
  window, and the session, otherwise clean (correct worktree, correct
  branch, no stray state), proceeded.
- **`shoki-bg-seat-ergonomics`** (S-5). `claude agents --json` read
  `state: "blocked"`; asked directly once attached, the session answered
  conversationally that it had received no particular instructions — which
  rules out a modal permission or folder-trust dialog, which would not take
  a normal reply. The human pasted the `brief:` line and it proceeded.
  Neither the spawner's log nor its result file flagged anything.
- **Inbox 2026-09-25-bg-w-spawn-initial-prompt-not-delivered** (a reporter
  repository's first spawned `shoki`). Three failures in three attempts
  across two worktree instances, the worktree removed and recreated between
  attempts once. Each time `claude agents --json` reported `status: "idle",
  state: "blocked"`; the process was alive and responsive with non-zero CPU
  time; no transcript file existed anywhere under the config directory for
  that `sessionId`; and `claude attach <id>` showed an empty chat history
  with no pending permission or trust prompt. Retyping the same
  `brief: <path>` line while attached un-stuck it every time: `state`
  flipped to `"working"` and a transcript appeared. A workspace trust gate
  and a `mise` config-trust gate were both ruled out. The reporter reads it
  as a delivery race or drop, not a crash or a gate.

So `blocked` now covers at least two distinct causes under one word — a
startup dialog, and an undelivered initial prompt — and the two may need to
be told apart before a fix is designed. Reproduction:
`claude --bg -w <worktree-name> --add-dir <main-repo-path> --permission-mode auto "brief: <path>"`,
then poll `claude agents --json`; a session that lands on `"blocked"` with
no transcript file anywhere is this defect. Where seen: `scripts/spawner.js`'s
`spawn` op for a `shoki` seat, `templates/spawn-request.md`, and `SKILL.md`'s
"The transcript reading". Issue-fb90's finding 21 is the same occurrence
reported in a bundle.

A second finding from the inbox copy: once a spawned session in a git
worktree does produce a transcript, it lives under a **worktree-scoped**
project slug, `<repo-slug>--claude-worktrees-<worktree-name>`, not the main
repository's slug. `SKILL.md`'s "The transcript reading" gives the path as
`<config dir>/projects/<project slug>/<session id>.jsonl` with no mention
that a worktree cwd changes the slug, so a Kanri searching under the main
repository's slug — the natural guess, since every other seat used it —
finds nothing, and may take a working shoki for dead or a stuck one for not
yet started.
