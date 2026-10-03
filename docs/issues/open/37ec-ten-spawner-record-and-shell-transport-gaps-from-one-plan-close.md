---
id: "37ec"
title: ten spawner, record and shell-transport gaps from one plan close
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: inbox 2026-10-02-spawner-record-and-shell-mechanics-gaps-from-a-plan-close

Ten defects in the launcher, the spawner, `record` and the role text, each
with a reproduction or an observation. Medium overall; item 6 stood out (a
seat lost across a restart, and a line sent to it went unread), and item 3
(a corrupted roster silently turning binary).

1. **`record --status "<name> stopped"` stops nothing** (beside issue-59ac).
   `scripts/boundary.js record` only rewrites the roster row. `roles/kanri.md`
   says to write the Jisso's `stop` request and let step 6's `record` mark
   the row, but nothing enforces the order and `record` never looks for a
   `stop` result. Twice a Jisso's row was marked `stopped` without the
   request written; both seats were found still `running` or `blocked` only
   by chance. Fix: `record --status … stopped` warns when no `stop` result
   exists for the row's `sessionId`, or the role text says "request first,
   `record` after its `ok`". Reproduction: against copies of
   `templates/roster.md` and `templates/kanri.md`, a row whose Name is `x`,
   then `node scripts/boundary.js record --ledger <kanri.md> --roster
   <roster.md> --status "x stopped"` rewrites the row and exits 0 with no
   `stop` result anywhere.
2. **An unparsable spawn request gets a bare error.** `scripts/spawner.js`
   (around line 442) answers `{"error": "request did not parse"}`,
   discarding the parser's message and the request's path. A request written
   through a Bash heredoc lost its doubled backslashes (a Windows path in
   `addDir`) and hit this; a copy written with the Write tool worked. Fix:
   the result carries `readJson`'s error text and the file name, and
   `templates/spawn-request.md` says a request is written with the Write
   tool, never a heredoc.
3. **No skill text covers writing a roster row or request that holds a
   Windows path.** Three roster rows were damaged in one plan. A path
   through a Bash tool call loses its backslashes even from a quoted heredoc
   or a doubled `\\` in single quotes; `"\0000123456"` (a user name that
   starts with digits) in JavaScript source is an octal escape, so the row
   got a NUL byte plus `0123456`, and `grep`
   then called the roster binary. `grep -n -i 'backslash' roles/ SKILL.md
   templates/` finds nothing. Observed: `node -e
   'console.log(JSON.stringify("C:\\Users\\0000123456"))'` printed
   `"C:Users\u00000123456"`, and the same literal from a file written by a
   quoted heredoc printed the same. Fix: `roles/kanri.md` and the handover
   template say a roster row or request with a path is written and edited
   only with the Write or Edit tool, including a script that edits an
   existing row; a script that must build one joins forward-slash parts
   with `String.fromCharCode(92)`. The same case (tanto-issue-triage S-130)
   proposed a `record --self` that writes Kanri's own roster row, removing
   the hand-written row and its transport altogether. See
   `docs/notes/bash-tool-and-script-pitfalls.md` for the collapse itself.
4. **The spawner's `rm` result drops `claude rm`'s stdout** (beside
   issue-59a5). `claude rm` of shoki's session kept the worktree, refusing
   while `main` held commits no remote had (`kept <id> … unpushed commits …
   or --discard-unpushed`); the result carried only `claude rm:` because
   `scripts/spawner.js` (line 389) returns `got.err` and the refusal was on
   stdout. `roles/kanri.md` ("Shusei, shoki, and the landing") gives the
   manual `git worktree remove --force --force` and branch delete as the
   step after a successful rm, not for a refusal. Where `main` is pushed
   only at releases, the refusal recurs at every close. Fix: return stdout
   when stderr is empty, and say in that section what to do when the rm
   keeps the worktree.
5. **A Bash `cd` into a worktree persists** and moves the harness's primary
   working directory. Seen by Kanri (a `cd` into shoki's worktree for a
   `git log`) and by a Jisso reading the skill's templates, noticed only from
   the harness's environment-update line; no role warns. The tool behavior
   is recorded in `docs/notes/bash-tool-and-script-pitfalls.md`. Fix: one
   line in `roles/kanri.md`'s landing paragraph and `roles/jisso.md`: look
   elsewhere with `( cd <dir> && … )` or `git -C <dir>`.
6. **After a machine restart `tanto` did not resume a pid-less `blocked`
   terminal seat** (beside issue-73d6). `scripts/tanto.js`'s resume loop
   (around line 393) skips any seat that `byId.has(seat.sessionId)`, and
   `byId` holds every listing row whose `state` is not `stopped`; a
   `blocked` seat still listed (no pid, stale for hours after a session
   limit) is never resumed, though the loop's comment says every other
   running or blocked seat is. A `SendMessage` to the seat's bare name went
   to a Remote Control record of the same name ("offline, delivery queued")
   and was never read; a Kanri-written `resume` request then worked at once.
   Fix: the loop resumes a listed seat whose `pid` is absent, and
   `roles/kanri.md`'s "Recovery after a VS Code restart" says a pid-less
   `blocked` seat gets a `resume` request before any line is sent to it.
   Reproduction: seed a `seats.json` row with `status: "blocked"` and a
   listing row with the same `sessionId`, `state: "blocked"` and no `pid`;
   `tanto` writes no `resume` request for it.
7. **`roles/hosa.md` does not say `ListAgents` is machine-wide.** A resumed
   tab seat read other repositories' Kanri sessions as part of its run; the
   `cwd` column of `claude agents --json` told them apart. Fix: a seat takes
   Kanri's address from the roster's first data row and filters the listing
   by its own `cwd` before calling a peer part of its run.
8. **The `$TANTO` form** — an addendum to the earlier inbox report on the
   `TANTO=<dir> node "$TANTO/…"` one-liner (its item 2). `SKILL.md`'s
   invocation text tells the reader to set `$TANTO` "in the same tool call
   as the command", which both the prefix-assignment form and the
   `export TANTO=<dir>;` form satisfy, and shows the one that fails
   (`MODULE_NOT_FOUND` under the Git Bash install directory). Seen twice
   more in a Jisso's batch. Fix: `SKILL.md` spells the form once as
   `export TANTO=<dir>; node "$TANTO/scripts/…"`.
9. **`record --seat` writes the spawn prompt as the Name** — an addendum to
   issue-fb90 (its spawner finding 2) and issue-dfb3. Two more occurrences
   of `record --seat` writing the spawn result's `name` (the prompt `/tanto
   jisso batch=<path>`) as the Name cell, each leaving a duplicate live
   Jisso row tidied by hand. The half about `--peer-reading` writing a
   second Residency row for a spaced name no longer holds: `PEER` now makes
   such a line fail with `a --peer-reading that parses` and nothing is
   written. Still open: no `--name` or census lookup gives `--seat` a name
   matching the census, and a spaced name cannot be recorded at all. Fix:
   `--seat` takes `--name`, or the census name plus `[ref]`, and `PEER`
   parses a name up to its `[ref]`. Reproduction: `--peer-reading "kanri
   some derived name [abc123] transcript: 1 B, 2 records, 0 wake-ups, 0
   compactions, context=5"` against the copied templates exits 1 with `a
   --peer-reading that parses`.
10. **A spawned Kanri's name is a sentence from its first prompt, and the
    roster `[ref]` differs from `ListAgents`'s.** The spawner passes no
    name; the census prints the session's derived name (the same sentence
    for two successive Kanri tenures of one topic), `ListAgents` shows a
    six-character ref, and the roster writes the sessionId's eight-character
    prefix. The first roster row is the address every seat reads and
    `SendMessage` takes a bare name, so a reused sentence-shaped name is
    ambiguous while the old session is listed. `templates/spawn-request.md`
    has no `name` key. Fix: the spawner passes a name at spawn time, or the
    contract makes the roster's sessionId-prefix `[ref]` the address a seat
    resolves and says it is not `ListAgents`'s ref.

Files: `scripts/boundary.js`, `scripts/spawner.js`, `scripts/tanto.js`,
`roles/kanri.md`, `roles/hosa.md`, `roles/jisso.md`,
`templates/spawn-request.md`, `SKILL.md`.
