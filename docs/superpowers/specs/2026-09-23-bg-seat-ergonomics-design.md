# Design: bg-seat-ergonomics — a background seat is named and kept out of the CLI's worktree isolation at its spawn; identity is the sessionId for every seat, read from a census; the shoroku vocabulary drops its stage word and says "shoroku proposal"; leaving a seat never stops it

Written by Sekkei `dotskills-1a [240a33]` (opus, max) on 2026-09-23 on the
branch `bg-seat-ergonomics`, cut from `main` with no batch in flight
(Kanri's orders line: write and commit normally, no draft). The dialogue is
`.tanto/bg-seat-ergonomics/dialogue.md`, decisions D-0 to D-11; the
measurements it ran are its "Measurements under D-1" section and its Q9
entries.

## Fixed inputs

Each decision names the requirement bullet of
`docs/requirements/04f5-tanto.md` (req-04f5) it serves, or says that none
does. The input document is
`.tanto/kikaku/2026-09-23-bg-seat-ergonomics-before-experience-layer.md`
(the Kikaku decision below); this spec takes its decided items as given
except where a line here names a reversal and the human's word for it.

- **The topic and its place** (the Kikaku decision, "The topic"): after
  `tanto-bg-seats`, before `experience-layer`, inserted into the order that
  `.tanto/kikaku/2026-09-20-topic-order-bg-seats-eighth.md` holds. Serves no
  bullet; it is the order.
- **Item 1 — a background seat's name says its repository, role, and topic**
  (1.1). Serves req-04f5 "Roles in separate sessions; the human opens the
  seats that talk to them, the run starts the rest", amended below.
  **Narrowed with measured cause:** the decision's "on every `claude --bg`
  and `--resume … --bg`" becomes the spawn only, because a flag on
  `--resume … --bg` starts a copy under a new id
  (`docs/reports/2026-09-20-tanto-bg-seats-probe.md`, item 6) and a
  flag-less resume keeps the name (Measured 4). The name ends in four
  random hexadecimal digits where the decision has `<short id>`, since the
  CLI assigns the short id only after the spawn (D-3).
- **Item 2 — Kanri reports no session that its listing does not place under
  the repository** (2.7). Serves the new bullet "A session another
  repository runs is never reported as this run's" (Requirements). Where
  the decision names `claude agents --json --cwd <root>`, the census reads
  the unfiltered listing and keeps the sessions under the root by its own
  path comparison (2.2), since the CLI's filter is measured for the root
  itself only (the spec review's F-20).
- **Item 3 — the CLI's background isolation is settled before any seat
  runs, and Kanri no longer asks** — settled by the spawner, per seat, with
  `--settings`, and nothing written to a settings file (1.2). **Reversed with
  the human's word (D-2):** the decision's launcher that asks once and
  writes `.claude/settings.local.json`. req-04f5 "tanto's own state lives in
  its own directory … so the repository's own configuration is never edited
  for it" stands as written. Item 5's user-scope measurement is moot with it.
  The README's note is as short as D-8 asks and keeps what the decision and
  Q2's B named: the setting and its two values, why the seats need `none`,
  that the setting is undocumented upstream, and that a managed policy
  forcing `worktree` wins over the flag (4.4).
- **Item 4 — every way out of an attached seat but `/stop` leaves it
  running, and the README and the attach line say so** (4.1, 4.4). Serves
  req-04f5 "The human reaches any seat from the editor", amended below.
  Item 5's measurement of the detach keys ran in the dialogue (Measured 5),
  not in the plan. The decision's operating note — the agent view or
  terminal panes for watching several seats, no multiplexer needed — is one
  sentence of the README (4.4).
- **The four issue groups** (the decision's "Scope, the four issue groups
  fixed alongside"): issue-aa37 (1.2, 1.4); issue-02ab, issue-894d,
  issue-d92f, and issue-261c on one rule (section 2); issue-7f28 (2.8).
  **issue-7607 needs nothing:** it is already under `docs/issues/resolved/`,
  closed by decision-363c at the `tanto-bg-seats` close, so the decision's
  re-measurement has no issue to close or keep. Serves req-04f5 "A run is
  resumed with one command, and a session's identity survives its
  renaming", rewritten below. As the decision expects, the plan carries a
  task per issue group, each in the batch that lands its fix ("What the plan
  must contain").
- **Added with the human's word (D-5 to D-7, D-9) — the shoroku vocabulary**
  (section 3). "Exit shoroku", which
  `.tanto/kikaku/2026-09-16-exit-proposal-term-and-brief-rendering.md` §2
  retired and `seat-lineage` never swept, and the stage word `t2`, left as
  the one value when `shoroku-at-close` removed T0 and T1 and addressed by
  issue-e3e4 to `tanto-diet`, which did not take it, both go. "Shoroku
  proposal" is the one name — **replacing, with the human's word, the 09-16
  decision's "the exit proposal"** (D-7) — the close's files are named by
  the step, and every proposal file by the session that wrote it (D-9).
  Serves req-04f5 "Docs are kept current as part of the flow", whose
  wording follows (Requirements).
- **Added with the human's word (D-3, D-8):** the spawner's census revives
  a seat that returns to the listing (1.3) and runs the ad hoc-worktree
  guard at every pass (1.4); the launcher resumes a Kanri that left the
  listing (4.2). Serve req-04f5 "The human reaches any seat from the
  editor".
- **Added with the human's word (D-10):** the launcher's one-line hint when
  the repository's folder trust is not recorded (4.3), and a new issue for
  the CLI's unanswerable trust question ("Issues this design closes").
  Serves "The human reaches any seat from the editor".
- **Added by Sekkei, taken with the human's word (D-11): a census marks
  nothing `dead` while a restart is being recovered** (2.3). It carries into
  the census what `roles/kanri.md`'s "Recovery after a VS Code restart"
  already does — "Mark `dead` only a row whose session neither `ListAgents`
  lists nor re-handshakes by the time the human says the windows are done"
  — since a census run before the editor restores the tabs would mark them
  `dead`, and it keeps the window in the roster's Events lines, so that it
  survives a handover. Serves req-04f5 "State lives in files, not in
  sessions".
- **The README stays short** (D-8): the additions of 4.4 and nothing else.
- **Standing decisions this spec amends — the one list; "The ADRs" points
  here.** decision-73c3 (tanto sessions addressed by born name): a terminal
  seat's born name is the spawner's. decision-1ea3 (the spawner is the only
  process that runs `claude --bg`, `stop`, and `rm`): its `--bg` command
  line gains `--name` and `--settings`. decision-8320 (spawned seats do not
  handshake and identity is the session id): the identity extends to every
  seat, the tab seats included, read from the census. decision-ded8 (the
  clear rule is every role's, and dead stays for the unlisted): the
  handshake-by-name route to `cleared` retires, `cleared` keeps `release:`
  and `no-role`, and a `/clear` reads as `dead` through the census; its
  consequence "one status per fact" holds by order — whichever of a
  `no-role` and a census sees the `/clear` first sets the status, and the
  other leaves a row that is no longer `live` alone (2.8); and `stopped`
  gains the seat the spawner's guard stopped (1.4).
  decision-84c8 (the launcher is one command that is also fukki): it
  resumes a Kanri that left the listing, the tab seats type nothing after a
  restart, and it prints the trust hint. decision-2db1 (the names are
  Propose / Recommend / Check / Apply and the whole skill is swept): its
  sweep reaches the exit and the close. decision-1f5f (the shoroku adoption
  rule and split T2): "T2" is "the close". decision-d831, decision-d538,
  and decision-d125 (a seat's exit carries its own shoroku; Sekkei and
  Keikaku write theirs unasked; a retiring Jisso's is its report's
  section): their "exit shoroku" and "exit proposal" become "shoroku
  proposal", their substance unchanged.

## Measured while designing

1. CLI **2.1.280** (`claude --version`, 2026-09-23): `-n, --name <name>`
   ("Set a display name for this session"); `--settings <file-or-json>`;
   `claude agents --json` "Print active sessions (interactive and
   background)"; `--cwd <path>`. `claude stop`'s help: "Its conversation is
   kept: `claude attach <id>` opens it again, `claude --resume` works once
   it is stopped". `claude attach --help`: "← returns to agent view, Ctrl+Z
   drops back to your shell. The session keeps running either way."
2. `claude agents --json --cwd <this root>` lists this window
   (`dotskills-1a`, `kind: interactive`, its `sessionId`) and every other
   session under the root, and none of the sessions under
   `C:\Users\0000105523\devel\kuchidome` that the unfiltered listing shows.
   An interactive entry carries no `id` and no `state`. The Hosa row
   `dotskills-a0 [ea5a16]`'s `sessionId` is listed under the name
   `dotskills-4d`: a tab resumed under a new name the roster does not know
   yet.
3. The CLI binary (2.1.280): a background job's name is the `--name` value,
   else its derived intent, else its short id, and is registered with the
   source `user`; the auto-title replaces only a name whose source is
   `derived` (or `auto`); on a background launch the name is `--name` or the
   saved job state's. `worktree.bgIsolation` is `"worktree" | "none"`,
   described as "'worktree' (default) blocks Edit/Write in the main
   checkout until EnterWorktree is called. 'none' lets background jobs edit
   the working copy directly", and is read from the variable
   `CLAUDE_BG_ISOLATION`, then a takeover state, then the merged settings;
   a job's environment is built from a whitelist that sets that variable
   itself, so a requester's value is not carried. `--settings` is among the
   flags a job keeps for its respawn. The guard's own message: "To disable
   this guard for this repo, set `"worktree": {"bgIsolation": "none"}` in
   .claude/settings.json." Auto mode carries the refusal "auto mode
   unavailable for this model". A process registers its current session id
   and rewrites it when the session changes, so a `/clear` moves a window to
   a new id in the listing.
4. Probe, in a scratch git repository with no `.claude/` settings, no
   managed settings on the machine, and a user scope that sets no `worktree`
   key; every `claude` call made by `spawnSync` with an argument array, as
   `spawner.js` makes it (dialogue, "Measurements under D-1"):
   - S2 (`--name`, no `--settings`): `Write` failed ("Error writing
     file"), the model called `EnterWorktree`, "Switched to worktree on
     branch worktree-probe-task"; its listed `cwd` became
     `…\.claude\worktrees\probe-task` within nine seconds of the spawn, and
     its transcript moved to that path's project directory. **issue-aa37
     reproduced with no `-w`.**
   - S1 (`--name`, `--settings '{"worktree":{"bgIsolation":"none"}}'`):
     `Write` went to the root with no guard error and no worktree. After the
     first turn, and after `claude stop` then
     `claude --resume <sessionId> --bg` with no other flag, the name and
     the `sessionId` were unchanged; the CLI printed
     `note: woke session ced66c9a with its saved options (--name, --settings, --model, --permission-mode).`,
     and a second `Write` after the resume again went to the root.
   - `claude --bg` printed `backgrounded · <short id> · <name>`, and the
     first listing carried the name.
   - S1 and S2 ran on haiku, and their transcripts record
     `permissionMode: default` although `auto` was passed; S3, sonnet, in
     the same never-trusted folder, ran `auto` and finished unprompted. The
     run's own Kanri, sonnet, runs `auto` in this repository.
5. Leaving an attached seat (the human's hands; VS Code's integrated
   terminal on Windows): `←`, `Ctrl+Z`, `/exit`, and `Ctrl+C` twice each
   left the seat listed and running; `/stop` alone removed it from the
   listing. `←`, `/exit`, and `Ctrl+C` twice return to the agent view (the
   `claude agents` screen); `Ctrl+Z` returns to the shell.
6. Folder trust. `$CLAUDE_CONFIG_DIR/.claude.json` holds
   `projects[<path>].hasTrustDialogAccepted`, and the CLI's text names the
   two ways to set it: accept the trust question of an interactive start in
   that folder once, or set the flag. This repository's key was `false`
   under both `c:/Users/…/dotskills` (the key the editor's sessions write)
   and `C:/Users/…/dotskills`, and the run's background Kanri ran
   regardless. While it was `false`, returning to the agent view from an
   attached seat showed "Quick safety check: Is this a project you created
   or one you trust?" for the terminal's folder, and **the question took no
   input** — neither answer could be selected; `Ctrl+Z`, which skips the
   agent view, did not show it. An interactive `claude` started in the root
   showed the same question at its start and took input; after "Yes, I
   trust this folder" the `C:/…` key read `true` (the `c:/…` key stayed
   `false`), and none of the four ways out showed the question again.
7. Earlier measurements taken as given: `claude stop` removes a session
   from `claude agents --json` entirely
   (`.tanto/tanto-bg-seats/verification-8-ids.md`), so the spawner's census
   marks it `gone`, and `tanto.js` resumes only a seat `seats.json` holds as
   `running` or `blocked` — a Kanri the human stops is replaced by a fresh
   spawn today. `stop` and `rm` take the short id; `--resume` takes the
   `sessionId`.
8. The spawner's ad hoc-worktree guard runs at the first sighting only
   (`opSpawn`: "The listing's first sighting is where the ad hoc-worktree
   guard runs"), a second or two after the spawn — before a seat's first
   write, which is where Measured 4's S2 moved.
9. The terms, in lines, each a case-insensitive `grep` over
   `skills/tanto/SKILL.md`, `skills/tanto/roles/`, `skills/tanto/templates/`,
   and `skills/tanto/README.md` unless a scope is named: "exit shoroku" 36
   in 10 files, among them the heading `### Exit shoroku` of
   `roles/kanri.md` and thirteen pointers to it, six of them in its Replace
   table; "candidate" 0 (decision-2db1's sweep held there; over the whole of
   `skills/tanto/`, 15 lines in 2 files, `scripts/tanto.js`'s identifiers
   and a `scripts/passage-check.test.js` fixture; this repository's live
   `.tanto/roster.md` still carries the pre-rename "Shoroku candidates"
   table); "stage word" 6; `\bt2\b` 65 lines in 7 files, and 66 in 8 over
   the whole of `skills/tanto/`, `scripts/boundary.js` line 405 the eighth
   — among them the heading `## T2 and the exit — the shoroku write-out` of
   `roles/jisso.md`; `exit: propose your shoroku; write it to <path>` 5; the
   Stage column in two templates and in `scripts/boundary.js` line 405, the
   one script that writes a Stage cell. No other script keys on any of these
   strings, and the `shoroku` skill keys on none.
   `docs/notes/tanto-consistency-checks.md` pins several (its checks 6, 7,
   20, and 24).
10. Open issues naming a term this design retires, one case-insensitive
    `grep -l -E` per pattern over `docs/issues/open/`: `exit shoroku` 9 and
    `exit proposal` 8, each in passing; `stage word` cca9, e3e4; `cleared:`
    7f28; `idle since` 7f28, bd69; `transcript path` 5f98, 894d, ce69, d92f,
    dace; `ListAgents` 02ab, 2065, 261c, 894d, c3d1, d92f; `fukki` 9;
    `bgIsolation|worktree isolation` cafd, fd4b; `\.claude/worktrees` aa37;
    `Stage column|Stage value` 7f28, 8c74, d502, de29, e3e4; `timeout` 126e,
    261c, 7fa4, fd4b; `inference|inferred` 02ab and five unrelated.
    "Issues this design closes" rules on every one the design touches.

## 1. The spawner

### 1.1 A seat's name

`spawnArgs` passes `--name <name>` on a spawn — never on a resume, which
stays `claude --resume <sessionId> --bg` with no other flag, since any flag
there starts a copy under a new id and the saved options bring the name back
without it (Measured 4, 7).

`<name>` is `<repo>-<role>[-<topic>]-<hex>`:

- `<repo>` — the root's basename, lower-cased, every run of characters
  outside `a-z0-9` turned into one `-`, with no `-` at either end;
- `<role>` — the request's `role`: `kanri`, `keikaku`, `jisso`, or `shoki`;
- `<topic>` — the request's `topic`, treated the same way, left out when it
  is absent or `—`;
- `<hex>` — four random lower-case hexadecimal digits, drawn again while a
  seat in `seats.json` carries the whole name.

For instance `dotskills-jisso-bg-seat-ergonomics-3f2a` and
`dotskills-kanri-9c01`. The name is the seat's for its life: the CLI
registers it as the user's own, which no auto-title replaces (Measured 3,
4). The result's `name` — the listing's first sighting — is that name, and
`boundary.js record --seat` writes it into the roster as today. The
`renamed` mark of the spawner's census stays, as the net for a human's
`/rename`.

`shortIdOf`, the fallback parse of `--bg`'s output for a listing that
carries no `id`, is rewritten to read the two lines the CLI prints today —
`backgrounded · <short id> · <name>` on a spawn, and
`backgrounded · <short id> · <name> (idle — send a prompt to start)` on a
resume (Measured 4); today's pattern, `session\s+<id>`, matches neither.

Rule 10 gains one sentence: the spawner names a terminal seat at its spawn,
before its prompt runs, and nothing renames it after.

### 1.2 The CLI's background isolation, off per seat

`spawnArgs` passes `--settings '{"worktree":{"bgIsolation":"none"}}'` on
every spawn, shoki's included — its `-w` worktree is its cwd, which the
guard accepts either way. The seat edits the shared checkout, as the
contract's Workspace section requires ("No worktree by default"), and a
flag-less resume keeps the setting (Measured 4). Nothing is written to any
settings file, the launcher asks nothing, and Kanri asks nothing; the
human's own background sessions in the repository keep the CLI's default.

A flag layer outranks the user, project, and local settings files. A
managed policy that forces `worktree` does not yield to it; the guard of 1.4
then stops the seat that moved and says so.

The `.claude/settings.local.json` entries written for this setting before
the change — this repository's and kuchidome's — are not needed once the new
spawner runs; section 5 says when this repository's may go.

### 1.3 A seat that returns to the listing

This spec calls the spawner's fifteen-second pass over `seats.json` **the
spawner's census**, and `boundary.js census` (section 2) **the census**.

The spawner's census revives a seat `seats.json` holds as `gone` when the
listing holds its `sessionId` again — a seat the human `/stop`ped and reopened with
`claude attach <id>`: its status becomes `running`, or `blocked` as the
listing's `state` says, `goneAt` is deleted, and the log says
`census: <sessionId> back`. A seat the run's own `stop` request stopped
(`stopped`) and one removed (`removed`) are not revived. With it, the
blocked-seat notice and `tanto down --seats` reach the reopened seat.

### 1.4 The ad hoc-worktree guard at every pass of the spawner's census

The guard moves from the first sighting alone to every pass of the
spawner's census, because a seat reaches `.claude/worktrees/` at its first
write, after the first sighting (Measured 4, 8). On each pass, a `running`
or `blocked` seat whose request carried no `worktree` and whose listed `cwd`
is under `<root>/.claude/worktrees/` — the paths compared with the
separators unified and, on Windows, the case folded — is stopped with its
short id, marked `stopped` with `strayed: <cwd>` beside its status, logged,
and toasted once: `strayed: <role> <topic> <name> — <cwd>`. The
first-sighting check stays; it costs nothing.

Kanri marks the seat's row `stopped` too — its conversation is kept, and
`SKILL.md`'s and `templates/roster.md`'s `stopped` gain "or the spawner's
guard" beside "on Kanri's request" — with an Events line naming the guard
and the worktree's branch. For a Jisso the Replace table's first row
applies (6.2): the tree verified, the batch spawned again with its resume
line, and the worktree branch's commits, if any, put to the human as a
ruling.

### 1.5 `templates/spawn-request.md`

The schema says that the spawner adds `--name` and `--settings` itself, so
a request carries neither; that a spawn result's `name` is the seat's name
from its spawn; that a `resume` passes no flag, the CLI bringing back the
options the spawn passed, as its note on the resume lists them — measured
for the name, the setting, the model, and the permission mode (Measured 4),
and for the effort by the plan's measurement task; and that a guard stop at
a pass of the spawner's census writes no result file — `strayed: <cwd>` in
`seats.json`, the log line, and the toast carry it — where the schema's
sentence today, "except `spawn`'s ad hoc-worktree guard, which also records
the seat as `stopped` before returning `error`", names the first-sighting
stop alone.

## 2. Identity and the census

### 2.1 The rule

A session is its `sessionId`, and a roster row's `sessionId` is the basename
of its Transcript column without `.jsonl`. Every match of a session to a row
— a handshake, `/tanto fukki`, Kanri's start, the census — compares
`sessionId`s, never a name, a `[ref]`, or a full path: a name and a `[ref]`
pass to another session across a `/clear` or a delete-and-recreate
(issue-894d), one file has two paths under a changed config directory
(issue-d92f), and a transcript moves when its session enters a worktree
(Measured 4). The census lists every session under the repository, the tab
seats included (Measured 2). A `live` or `queued` row whose `sessionId` it
does not list has gone, and Kanri marks it `dead` on that signal alone — no
timeout (issue-261c), no inference (issue-02ab), no name. A listing that
fails is no signal: nothing is marked on it.

A send error is a reason to run the census, not a signal of its own: the
census's "Not listed" marks the row `dead`, and a send that errors to a
session the census still lists is a message failure — the row stays, and
Kanri tells the human in one line. A tab seat's own `ListAgents` self-check
of `SKILL.md`'s Resuming stays as it is: it is the seat's trigger to
re-handshake after its name changed, and the match that follows is Kanri's,
by `sessionId`.

### 2.2 `boundary.js census`

A third subcommand, read-only:

```bash
node "$TANTO/scripts/boundary.js" census [--root <dir>] [--roster <path>]
```

`--root` defaults to the current directory and `--roster` to
`<root>/.tanto/roster.md`. It runs `claude agents --json` through the seam
`spawner.js` and `tanto.js` already use (`TANTO_CLAUDE_NODE`,
`TANTO_CLAUDE`) and keeps the sessions whose `cwd` is the root or a path
under it, the paths compared with the separators unified and, on Windows,
the case folded — the set `--cwd <root>` returned for the root (Measured
2), with a subdirectory and the drive letter's two spellings settled by the
census's own comparison rather than by the CLI's filter, which is measured
for the root itself only. It reads the roster's session table —
the table whose header begins `| Role | Topic | Name [ref] | cwd |` — and
prints four headings in this order, in the `## <heading>` form `check`
already prints, each followed by one line per entry, or by `none`:

| Heading | One line per entry |
| --- | --- |
| Listed | `<role> <topic> <roster name> — <sessionId> — listed as <name> (<kind>)`, with ` — renamed` appended when the names differ |
| Not listed | `<role> <topic> <roster name> — <sessionId>` |
| No session id | `<role> <topic> <roster name>` |
| Not held | `<name> (<kind>) — <sessionId>`, with ` — row <status>` appended when a row of another status names it |

The first three cover the rows whose Status's first word is `live` or
`queued`. `renamed` marks a listed name that differs from the roster's bare
name. "No session id" is a row whose Transcript is `unavailable`, which the
census cannot place and leaves alone. "Not held" is a listed session that no
`live` or `queued` row holds, with the status of any other row that names
its `sessionId`. The command exits 0 when it read a listing; 1, printing the
one line `census: unavailable — <reason>`, when `claude agents` fails or
prints no JSON; 2 on a usage error or a roster it cannot read. It writes
nothing: Kanri, the roster's one writer, acts on what it prints.

### 2.3 When Kanri runs it

At its start, before taking a case (2.4) — Start step 1's read of its own
name stays as it is, and the census follows it; at every handshake (2.5);
after a send to a peer errors (2.1); once the human says the windows are
back after a restart (2.6); at the plan close, before the archive move,
where the close row's "mark `dead` the rows of any session the census lost
and no resume brought back" — the spawner's census today — becomes the
census's "Not listed", which covers the tab seats too; and before it says
anything about a listed session it does not hold (2.7). What it does with
the output:

- **Not listed** — mark the row `dead`, with the Events line a seat whose
  shoroku proposal was not written gets, and what was lost as far as Kanri
  knows; a row that was the live Jisso's is the Replace table's first row,
  the tree verified first.
- **Listed, renamed** — rewrite the row's Name column with the listed name
  and the `[ref]` one `ListAgents` call prints, and write
  `resumed: <old name> → <new name>`; for a terminal seat, clear the
  spawner's `renamed` mark with an `ack` request, as today.
- **Not held** — nothing to the human. A session becomes the run's through a
  handshake or a result file, never by being listed.
- **No session id** — nothing.
- **`census: unavailable`** — nothing is marked; the next census decides.

**While a restart is being recovered** — from Kanri's own `/tanto fukki`,
or its Recovery case, until the human says the windows are back — a census
places sessions and marks nothing `dead`: a tab the editor has not restored
yet is not listed, and has not gone. The window lives in the roster, not in
Kanri's context: Kanri opens it with the Events line `recovery: begun` and
closes it with `recovery: windows back` on the human's word, a successor
reads the last of the two before it marks anything, and until the word
comes the human's part is an open act in the idle block's `for you:` list.

### 2.4 Kanri's start: four cases

"The five cases" of `roles/kanri.md` become four, each keyed on the
`sessionId`:

- **Handover** — `.tanto/kanri-handover.md` exists: as today, with the
  census, not `ListAgents`, saying whether the first row's session is still
  there.
- **Yours** — no handover file, and the first row's `sessionId` is yours:
  continue where the ledger's Progress line says; when the row's Name is not
  your name, rewrite it and write `resumed: <old name> → <new name>`. It
  replaces the Kept Kanri and the Resumed Kanri, which differed only in the
  name.
- **Second Kanri** — no handover file, the first row's `sessionId` is
  another's, and the census lists it: stop, tell the human, write nothing.
- **Recovery** — no handover file, the first row's `sessionId` is another's,
  and the census does not list it: run "Recovery after a VS Code restart",
  whose census, once the human says the windows are back, marks `dead`
  every `live` row it does not list, one Events line each.

### 2.5 On a handshake

Step 2 runs the census and places the handshake's `sessionId` — the
basename of its `transcript=` — in it. A handshake whose `sessionId` the
census does not list is not a session under this repository (2.2) and gets
no row: `refused`, an Events line, one line to the human.
`transcript=unavailable` is accepted as today; its row carries `unavailable`
and the census leaves it alone.

Every `live` or `queued` row the census does not list is marked `dead`
before the new row is written — except while a restart is being recovered
(2.3) — so that a stale row of the same role and topic no longer refuses a
fresh handshake as a duplicate: the case issue-02ab's tenure settled by
inference.

A handshake whose `sessionId` equals a row's Transcript basename is that
row's session resumed: rewrite the row in place, as today, whatever path its
`transcript=` spells. The paragraph "A handshake whose name is already on a
`live` or `queued` row with a different transcript is that window `/clear`ed
and re-invoked" retires: the census decides the old row, and a `/clear`ed
window's old session is simply not listed (Measured 3).

### 2.6 After a restart

A tab seat the editor resumed keeps its `sessionId` and gets a new name.
Kanri's census finds it under the new name and rewrites the row (2.3), and
**the human types nothing in the tab**. `/tanto fukki` stays accepted there:
the seat re-reads its own name for its closing line and re-runs the
definitions write-out, and its match is the row whose Transcript basename is
its own `sessionId` — which closes issue-d92f for the tab seats that
`tanto-bg-seats` left it open for. When typed, it still sends the handshake:
a handshake whose row the census already renamed rewrites the row in place
with the same values, so that the two orders end the same.

`roles/kanri.md`'s "Recovery after a VS Code restart": the human types
`/tanto fukki` once, in Kanri's window — after `claude attach` for a
terminal Kanri — and nowhere else. Kanri writes `recovery: begun` (2.3),
runs the census once the human says the windows are back, writes
`recovery: windows back`, renames what the census lists under a new name,
and marks `dead` what it does not list; a terminal seat's `renamed` marks
and their acks are as today.

### 2.7 A session the roster does not hold

`ListAgents` lists every session on the machine and shows no cwd. Kanri
says nothing about a listed session its roster does not hold: the census
lists only the sessions under this repository, so a session it does not list
is another repository's, and one it lists that no row holds is a window not
yet handshaken or the human's own. Neither is reported (the Kikaku
decision's finding 1: the two background sessions Kanri warned about were
kuchidome's).

### 2.8 `cleared` and `idle since`

`cleared` keeps two routes: Kanri's `release:`, and a `no-role` reply to a
line Kanri sent. The third — a handshake under a name already on a row with
another transcript — retires with 2.5. `SKILL.md`'s status list,
`templates/roster.md`'s keeping rule and status paragraph, and
`roles/kanri.md` say so, and the Events shape
`cleared: <old name> → <new name>` leaves `templates/roster.md` with its
last writer (issue-7f28, item 1). A row the census marked `dead` takes the
existing Events shape "a session declared dead and what was verified".

One `/clear` can reach Kanri by either route first, and whichever does sets
the status: a `no-role` from a row the census already marked `dead` changes
nothing, and the census leaves a row a `no-role` already marked `cleared`
alone, since it marks only `live` and `queued` rows. decision-ded8's "one
status per fact" holds by that order.

`idle since` is the suffix ` (idle since <HH:MM>)` of a `live` cell:
`roles/kanri.md` says "append" where it says "write `idle since <HH:MM>`
there", and `SKILL.md`'s status list names the suffix beside the seven
words, as `templates/roster.md` already does (item 3). Item 2,
`cleared: stale transcript, row rewritten in place`, is already gone from
`roles/kanri.md`.

## 3. The shoroku vocabulary

### 3.1 One name: shoroku proposal

What a seat proposes for the write-out, whichever seat and whenever, is its
**shoroku proposal** — the propose step's output, named with the step's
verb, as the batch report's `Shoroku proposal` section, the spec's
`Shoroku proposal from this spec work`, and the close's
`shoroku-proposal.md` already are. "At its exit", "at the close", and "at a
boundary" say when; they are not part of the name. "Exit shoroku" and "exit
proposal", as nouns, leave the skill.

| Today | After |
| --- | --- |
| a seat's exit shoroku | a seat's shoroku proposal |
| "Kikaku and Hosa have no exit shoroku" | "Kikaku and Hosa write no shoroku proposal" |
| "its exit shoroku did not run" (an Events line) | "its shoroku proposal was not written" |
| "Every planned exit of a session, in any role, carries its own shoroku" | "Every planned exit of a session, in any role, writes its shoroku proposal first" |
| the close's "T2", "at T2", "the T2 proposal" | "the close", "at the close", "the close's shoroku proposal" |

### 3.2 The files

Every proposal file is `shoroku-proposal-<role>-<short id>.md`, `<short id>`
being the first eight hexadecimal digits of the writing session's
`sessionId` — the same eight digits as a background seat's CLI short id —
and `-<n>` before `.md`, `n` from 2 upward, a further file by the same
session, never a rewrite of one already written: a Sekkei answering a
second cold-read question, or a Kanri whose close handover was declined and
which proposes again at its next close, takes the next `n`. A proposal file
lives in the topic directory, Kanri's beside the roster. The close's other
files are named by the step.

| Today | After |
| --- | --- |
| `.tanto/<topic>/exit-sekkei-proposal.md`, `exit-sekkei-2-proposal.md` | `.tanto/<topic>/shoroku-proposal-sekkei-<short id>.md`, `…-<short id>-<n>.md` |
| `.tanto/<topic>/exit-keikaku-proposal.md` | `.tanto/<topic>/shoroku-proposal-keikaku-<short id>.md` |
| `.tanto/<topic>/exit-kaiseki-<n>-proposal.md` | `.tanto/<topic>/shoroku-proposal-kaiseki-<short id>.md` |
| `.tanto/exit-kanri-<YYYY-MM-DD>-<name>[-2]-proposal.md` | `.tanto/shoroku-proposal-kanri-<short id>[-<n>].md` |
| `.tanto/<topic>/shoroku-proposal.md` (the close's, the last Jisso's) | `.tanto/<topic>/shoroku-proposal-jisso-<short id>.md` |
| `.tanto/<topic>/t2-recommendation.md` | `.tanto/<topic>/shoroku-recommendation.md` |
| `.tanto/<topic>/t2-brief.md` | `.tanto/<topic>/shoroku-brief.md` |
| `.tanto/<topic>/t2-direction.md` | `.tanto/<topic>/shoroku-direction.md` |
| `.tanto/<topic>/t2-review.md` | `.tanto/<topic>/shoroku-review.md` |

The key closes issue-ce69 (Kanri's file, keyed on the date and the window's
name, collided across same-day tenures of one window) and the third item of
issue-bdad (a second Sekkei or Keikaku of one topic collided on the bare
name). A session knows its own `sessionId` from its transcript path; Kanri
knows a seat's from the Transcript column of its row. The between-plans
inbox sweep's `.tanto/inbox-<YYYY-MM-DD>-recommendation.md`, `-brief.md`,
and `-direction.md` are already step-named and stay.

### 3.3 The lines

| Today | After |
| --- | --- |
| `exit: propose your shoroku; write it to <path>` | `exit: propose; write it to <path>` |
| `exit proposal: <path> — <reading>` | `shoroku proposal: <path> — <reading>` |
| `spec accepted: <spec path>; exit proposal: <path> — <reading>` | `spec accepted: <spec path>; shoroku proposal: <path> — <reading>` |
| `coldread answered: <pointer, one per question, or none>; exit proposal: <path> — <reading>` | `coldread answered: <pointer, one per question, or none>; shoroku proposal: <path> — <reading>` |
| `T2: propose the shoroku write-out; write it to .tanto/<topic>/shoroku-proposal.md` | `close: propose; write it to .tanto/<topic>/shoroku-proposal-jisso-<short id>.md` |

`close:` is free: `SKILL.md`'s Messages still names "a `close:` line with
its clauses", which was Hosa's line under decision-a1ae until
decision-26fd superseded it and `tanto-bg-seats` retired it; the sentence
becomes "a `close:` line, or a handshake with its fields, is one line".

### 3.4 The commit subjects

| Today | After |
| --- | --- |
| `docs: T2 shoroku for <topic>` | `docs: shoroku for <topic>` |
| `docs: T2 shoroku for <topic>, review fixes` | `docs: shoroku for <topic>, review fixes` |
| the whole-branch review's excluded prefixes `docs: T2 shoroku` and `fix: text corrections` | `docs: shoroku for` and `fix: text corrections` |

`docs: shoroku for <topic>` matches the issues' `Source: shoroku <topic>`
lines. `fix: text corrections from <topic>'s close`,
`docs: inbox sweep <YYYY-MM-DD>`, and
`fix: text corrections from the inbox sweep <YYYY-MM-DD>` stay.

### 3.5 No Stage column

Both `S-n` tables — the ledger's (`templates/kanri.md`) and the roster's
(`templates/roster.md`) — lose their Stage column, which has held `t2` in
every row since the close became the one stage, and the sentences that
define the stage word go with it. The tables' columns are S-n, Source, Item,
Destination, Adopted, and Written.

`boundary.js record` writes an `S-n` row by the header it finds: a table
with a Stage column gets `t2` in it, one without gets no such cell. A ledger
or a roster opened before the change keeps its seven columns and stays
consistent; nothing is migrated by a script. Kanri migrates a roster whose
table is still headed "Shoroku candidates" or carries a Stage column to the
template's shape at the next plan close, when it moves the archived rows.

### 3.6 Headings, and the pointers to them

| File | Today | After |
| --- | --- | --- |
| `roles/kanri.md` | `### Exit shoroku`, and each `"Exit shoroku"` pointer (thirteen) | `### A seat's exit`, and each pointer |
| `roles/kanri.md` | `### The five cases` | `### The four cases` |
| `roles/jisso.md` | `## T2 and the exit — the shoroku write-out` | `## The close and the exit — the shoroku proposal` |
| `roles/sekkei.md`, `roles/keikaku.md` | the bullet `**Your exit shoroku.**` | `**Your shoroku proposal.**` |

A heading is a machine pointer in this skill (decision-2db1), so each change
moves its pointers in the same commit.

### 3.7 Reserved names

`SKILL.md`'s Workspace section and `roles/kanri.md`'s start step 2 reserve,
in `.tanto/`, the prefixes `shoroku-proposal-kanri-` and `inbox-`, and keep
`exit-kanri-` for the files written before this change, so that a start's
listing of `.tanto/` does not report a predecessor's old file. A topic slug
begins with none of the three, where `SKILL.md` says "begins with neither
prefix" and `roles/kanri.md` "begins with neither of its prefixes".

### 3.8 What is not renamed

The files, ledgers, and commit subjects of closed topics; ledger and roster
rows written before the change, Stage cells included; decision and issue
files that quote the old terms, which are history; the `shoroku` skill,
which keys on none of them (Measured 9); and the kind names in `tanto.json`
(`shoroku.recommend`, `shoroku.apply`, `shoroku.review`).

## 4. The launcher and the README

### 4.1 The attach line

Wherever `tanto` prints `claude attach <id>`, it prints one line after it:

```text
← or /exit returns to the agent view, Ctrl+Z to the shell; the seat keeps running — /stop alone stops it, and a Kanri you /stop comes back with tanto
```

and, as today, `then type /tanto fukki there once` when it resumed a seat.

### 4.2 A Kanri that left the listing is resumed

`cmdUp` treats a Kanri that `seats.json` holds as `gone` like one it holds
as `running` or `blocked`: when the listing does not show it, it writes a
`resume` request rather than a spawn. A `gone` Kanri is one the human
`/stop`ped or one that crashed while the spawner ran (Measured 7). When the
resume fails, `tanto` prints
`tanto: the Kanri resume failed — <error>; spawning a new Kanri` and writes
the spawn request as today. A Kanri the run's own request stopped
(`stopped`, as after `tanto down --seats` or a handover) is not resumed:
`tanto down --seats` still retires a run. The loop over the other seats is
unchanged; a Jisso or a Keikaku that left the listing is Kanri's Replace
table's.

The rule, in the one sentence `SKILL.md`'s Resuming and the README both
copy: a seat `seats.json` holds as `running` or `blocked` — or, for Kanri
alone, `gone` — is resumed; one it holds as `stopped` or `removed` is not. A
resumed Kanri idles until a line reaches it, so `then type /tanto fukki
there once` follows its attach line, as it does for a Kanri a reboot took.

### 4.3 The trust hint

`cmdUp` reads `.claude.json` — `$CLAUDE_CONFIG_DIR/.claude.json` when that
variable is set, `~/.claude.json` otherwise — and, when
`projects[<key>].hasTrustDialogAccepted` is not `true` for `<key>`, the root
as `tanto` resolved it with every `\` turned into `/` and its drive letter
as given, prints one line — before the attach line, when there is one:

```text
this folder's trust is not recorded: run claude here once and answer "Yes, I trust this folder" — the agent view's own trust question after ← or /exit takes no input
```

The key mirrors the one the CLI in the same terminal would look up
(Measured 6). A missing or unparsable file prints nothing. `tanto` never
writes the file.

### 4.4 The README

As short as it can be (D-8):

- **Prerequisites** — "Claude Code CLI 2.1.277 or newer" becomes 2.1.280,
  and the bullet gains one sentence: the spawner names each background seat
  and passes it `--settings '{"worktree":{"bgIsolation":"none"}}'` — the
  CLI's `worktree.bgIsolation`, `worktree` by default and undocumented
  upstream (anthropics/claude-code#59580) — because the seats share one
  checkout that the default would move them out of; a managed policy that
  forces `worktree` wins over the flag, and no settings file is written.
- **Usage** — "`←` returns to the agent view and `Ctrl+Z` drops back to the
  shell; the session keeps running either way." becomes: every way out —
  `←` or `/exit` to the agent view, `Ctrl+Z` to the shell, closing the
  terminal — leaves the seat running; `/stop` alone stops it, and a Kanri
  you `/stop` comes back with `tanto` (D-11). `claude agents` lists every
  seat by name,
  `<repo>-<role>[-<topic>]-<hex>`, and terminal panes, one
  `claude attach <id>` each, show several at once; no multiplexer is
  needed, since a seat outlives its terminal.
- **Usage** — "a stopped seat is not resumed, and the next `tanto` starts a
  fresh Kanri" becomes "a seat the run stopped is not resumed", after 4.2's
  rule.
- **Usage** — the restart sentence: a tab keeps its context and transcript
  and gets a new name, which Kanri matches to its roster row by its session
  id; nothing is typed there.
- **Layout** — `scripts/boundary.js` gains `census`.
- **The designs** list gains this spec.

Nothing about the trust question: the launcher's hint carries it.

## 5. Rule 11, and this plan

This plan edits the skill — its scripts, `SKILL.md`, the role files, and
templates — so rule 11 governs it: the plan's Jissos are all spawned at its
landing with `queue=<topic>`; its Global Constraints and Kanri's orders line
carry the authority sentence; the safe boundary, from which a role may be
started or replaced, is the final batch's. None of the three run-time
templates (`templates/boundary-brief.md`, `templates/batch-prompt.md`,
`templates/kanri-handover.md`) needs a change under this design; one the
plan chooses to touch lands with the role files.

Four facts of this plan's own run, which its Global Constraints state:

- **The resident spawner keeps the code it started with.** Every seat this
  plan spawns — its Jissos at the landing, the close's shusei and shoki, and
  Kanri's successor — is spawned with no `--name` and no `--settings`, so
  this repository's `.claude/settings.local.json` stays until this plan's
  close. After the close, the human runs `tanto down` then `tanto` — the
  seats keep running, only the spawner restarts — and Kanri's close line
  asks for it.
- **`boundary.js` runs from disk at every boundary.** Its `census` is
  additive and its `S-n` writer keys on the header it finds (3.5), so the
  boundaries of this plan, which write this topic's seven-column ledger,
  run unchanged whichever batch lands them.
- **This plan's close runs on the landed text.** Kanri re-reads `SKILL.md`'s
  Session exit and `roles/kanri.md`'s close sections from disk before the
  close's first step; its line to the last Jisso is `close:`; the close's
  files take the names of 3.2 and its commits the subjects of 3.4. The last
  Jisso, spawned at the landing on the old text, follows the line, which
  names the path it writes.
- **The live roster** migrates at this plan's close (3.5).

## 6. File by file

### 6.1 `skills/tanto/SKILL.md`

- The role table's Jisso row: "the last one, the T2 shoroku proposal" → "the
  last one, the close's shoroku proposal".
- Handshake and roster: the census paragraph (2.1) beside the `ListAgents`
  sentence; the status list (2.8: `cleared`'s two routes, the `idle since`
  suffix; `dead`'s "a restart before `/tanto fukki`" becomes "a session the
  census no longer lists"; `stopped` gains "or the spawner's guard", 1.4).
- Resuming: the identity paragraph for every seat, whose "a resume keeps the
  id while it changes the name" holds for a tab seat and no longer for a
  terminal seat (1.1); the table's tab-seat row (2.6); the reboot row gains
  4.2's rule; `/tanto fukki`'s match by the Transcript basename.
- Messages: the `close:` sentence (3.3); "the Events line an unrun exit
  shoroku gets" → "… an unwritten shoroku proposal gets"; "a send error
  stays the signal that a session is gone" → a send error is a reason to run
  the census (2.1).
- The intake: Kanri "writes `idle since <HH:MM>` into that cell" →
  "appends".
- Session exit: the stage word and the Stage sentences; the four steps'
  file names, lines, and subjects (3.2 to 3.4); "Who proposes when"; "The
  files"; "The exit itself", whose signals gain the census's "Not listed".
- Artifacts: the rows of every renamed file; the scripts paragraph's
  `boundary.js` gains `census` ("its two subcommands" → three).
- Rule 10: the spawner's naming sentence (1.1).
- Workspace: the reserved prefixes, and "begins with neither prefix" →
  "none" (3.7).

### 6.2 `skills/tanto/roles/kanri.md`

- Start step 2's listing of `.tanto/` and step 5's slug check: the reserved
  prefixes, and "begins with neither of its prefixes" → "none" (3.7).
- Start step 4's "compare your own `name [ref]` with its first data row" →
  its `sessionId`; "The five cases" → "The four cases" (2.4), the Handover
  case's `ListAgents` clauses and the Second Kanri's and the Recovery's
  name-keyed conditions with them.
- On a handshake: step 2 (2.5), the resumed paragraph by basename, the
  `/clear`-by-name paragraph retired, and the `no-role` paragraph's
  wording (3.1).
- The idle block: the `idle since` suffix (2.8), and the open act of a
  restart's recovery (2.3).
- A new paragraph under Session lifecycle: a session the roster does not
  hold (2.7), the census's moments (2.3), a send error as a reason to run it
  (2.1), and the Events lines `recovery: begun` and `recovery: windows back`
  (2.3).
- The final batch and the close: the `close:` line (3.3), Kanri's own
  proposal path (3.2), the file names and the subjects (3.2, 3.4), and "One
  stage per topic, the **close**, stage word `t2`" → "One stage per topic,
  the **close**".
- Every "Stage `t2`" clause that tells Kanri to write the cell — lines 340,
  445, 639, 720, 925, 932, 1121, 1267, and 1296 — goes (3.5); every bare
  "exit proposal" — 347, 906, 1549, and 1550 — becomes "shoroku proposal";
  `shoroku-proposal.md` at 987 and 1138, and the `-2-proposal` of 688, 916,
  1119, and 1292–1293, take 3.2's names.
- `### Exit shoroku` → `### A seat's exit` and its thirteen pointers (3.6);
  step 1's lines (3.3); step 2's "Stage `t2`" clause goes, and its release
  sentence gains the terminal seat's `stop` request, as `SKILL.md`'s "The
  exit itself" already has it; the forced-exit paragraph's "`dead` on a send
  error or an empty listing" becomes the census's "Not listed" (2.1), and it
  says "its shoroku proposal was not written".
- Replace table: the first row's "the census marked it `gone`" → "the
  spawner's census marked it `gone`", and its symptoms gain "or the
  spawner's guard stopped it (`strayed` in `seats.json`)", whose row goes
  `stopped` (1.4); the "Exit shoroku" pointers.
- Release table, the close row: "mark `dead` the rows of any session the
  census lost and no resume brought back" → the census's "Not listed" (2.3),
  and the roster migration (3.5).
- "Recovery after a VS Code restart" (2.6).

### 6.3 The other role files

- `roles/sekkei.md` — "exit shoroku" and the bare "exit proposal" of 144
  (3.1); `**Your exit shoroku.**` (3.6); the stage-word sentence goes and the
  path is `shoroku-proposal-sekkei-<short id>.md`, with `-<n>` for a further
  one — the literal `exit-sekkei` of 199 and 210 with it (3.2); the
  `spec accepted:` line and the `exit:` line (3.3).
- `roles/keikaku.md` — the same, for Keikaku: the bare "exit proposal" of
  305–306, the literal `exit-keikaku` of 357 and 374, and its
  `coldread answered:` line.
- `roles/jisso.md` — line 5 (3.1); the heading (3.6); the `T2:` lines and
  "at T2" (3.3); the close's file, `shoroku-proposal.md` at 289 and 323
  (3.2).
- `roles/kaiseki.md` — the `exit:` line and the answer (3.3); its file,
  the literal `exit-kaiseki` of 85 (3.2).
- `roles/hosa.md`, `roles/kikaku.md` — "no exit shoroku" (3.1).

### 6.4 Templates

- `templates/roster.md` — the keeping rule's bullets on the resumed tab
  seat (21–22), the handshake by basename (23–25), and the census's `dead`,
  whose "an editor restart before `/tanto fukki` for a tab seat" and
  "neither route detects a `/clear`" no longer hold (2.1, 2.5, 2.6); the
  status paragraph — `cleared`'s routes (66–67, 2.8) and `stopped`'s "or the
  spawner's guard" (62–63, 1.4); the Shoroku proposal items table without
  Stage, its sentence, and its `-2-proposal` (110) (3.2, 3.5); the Events
  catalogue without `cleared: <old name> → <new name>` and with "a shoroku
  proposal written by <name> [<ref>], or not written and what was lost"
  (3.1).
- `templates/kanri.md` — the Shoroku proposal items table without Stage and
  its sentences (3.5); "an exit shoroku not run" → "a shoroku proposal not
  written", and the bare "exit proposal" of 68 and 101 → "shoroku
  proposal".
- `templates/batch-report.md` — "This section is this Jisso's exit shoroku"
  → "… this Jisso's shoroku proposal".
- `templates/shoki-brief.md` — the file names and the subjects (3.2, 3.4).
- `templates/shoroku-brief.md` — `t2-brief.md` and `t2-direction.md` (3.2);
  its Document line drops `— t2 —`.
- `templates/spawn-request.md` — 1.5.

### 6.5 Scripts

- `scripts/spawner.js` — 1.1 to 1.4 and `shortIdOf`; tests in
  `spawner.test.js` with the fake `claude`: the name's shape and its
  re-draw, `--settings` on every spawn, a resume with no flag, the revived
  seat, and the guard at a pass of the spawner's census.
- `scripts/tanto.js` — 4.1 to 4.3; tests in `tanto.test.js`: the attach
  line, a `gone` Kanri resumed and the spawn on a failed resume, and the
  trust hint against a fake config directory (recorded, unrecorded, missing
  file).
- `scripts/boundary.js` — `census` (2.2) with its usage line, and the
  header-driven `S-n` writer (3.5); tests in `boundary.test.js`: every
  heading and exit code of `census` against a fake listing and a fixture
  roster; its own path comparison — the root, a subdirectory, another
  repository, and the drive letter's other case; and an `S-n` row written to
  a six-column and to a seven-column table.

### 6.6 `skills/tanto/README.md`

4.4.

### 6.7 `docs/`

- `docs/notes/tanto-consistency-checks.md` — the checks that pin the old
  strings follow them: check 6 (the `exit-<role>` counts, the `S-n` header
  with Stage, `cleared: <old name> → <new name>`, `exit proposal:`), check 7
  (the strings that must be absent gain the retired ones), check 16 (the
  usage line names `census`), check 20, and check 24 — "the stage word that
  is left" is gone, and its fourth grep, which has read `0` against its
  expected `1` since `tanto-bg-seats` retired Hosa's `close:` line
  (decision-26fd superseding decision-a1ae), is re-pinned to the new
  `close:` line of 3.3 in each file that sends or receives it —
  `SKILL.md`, `roles/kanri.md`, and `roles/jisso.md` — at the count the
  landed text has, as check 21 wants for a named mechanism.
- `docs/issues/` — the resolutions and the new issue listed under "Issues
  this design closes", each moved with `git mv` and its `updated:` bumped,
  as `docs/issues/AGENTS.md` prescribes.

## Where each change lives

| Change | Files | Section |
| --- | --- | --- |
| the seat's name, the isolation off, the revive, the guard | `scripts/spawner.js`, `spawner.test.js`, `templates/spawn-request.md`, `SKILL.md` rule 10 | 1 |
| the census | `scripts/boundary.js`, `boundary.test.js`, `SKILL.md`, `roles/kanri.md`, `templates/roster.md`, README | 2.1 to 2.3 |
| Kanri's start, the handshake, the restart, the unheld session | `roles/kanri.md`, `SKILL.md` Resuming, `templates/roster.md` | 2.4 to 2.7 |
| `cleared` and `idle since` | `SKILL.md`, `roles/kanri.md`, `templates/roster.md` | 2.8 |
| the shoroku vocabulary | `SKILL.md`, the seven role files, `templates/roster.md`, `templates/kanri.md`, `templates/batch-report.md`, `templates/shoki-brief.md`, `templates/shoroku-brief.md`, `scripts/boundary.js`, `docs/notes/tanto-consistency-checks.md` | 3 |
| the attach line, the resumed Kanri, the trust hint | `scripts/tanto.js`, `tanto.test.js` | 4.1 to 4.3 |
| the README | `skills/tanto/README.md` | 4.4 |
| the issues | `docs/issues/` | Issues |

## Old values this plan contradicts

Quoted as they read on 2026-09-23, with the file and the line. Each is an
`O` needle for the plan, measured over every path it touches; the renamed
strings of section 3 are needles too, over `skills/tanto/`.

- `SKILL.md` 27, the role table: "the last one, the T2 shoroku proposal"
- `SKILL.md` 405: "`stopped` a terminal seat the spawner stopped on Kanri's
  request, its conversation kept"
- `SKILL.md` 406–408: "`cleared` a tab seat Kanri released with `release:`,
  or whose `/clear` a re-handshake under a new transcript or a `no-role`
  reply revealed"
- `SKILL.md` 408–409: "`dead` a session that has gone — a closed tab, a
  crash, a restart before `/tanto fukki`, or a terminal seat …"
- `SKILL.md` 416–417: "`ListAgents` shows name, `[ref]`, kind, and start time
  — not the cwd, the model, or the role; the handshake carries those."
- `SKILL.md` 571–574: "the name is what `claude agents --json` and
  `ListAgents` currently print for it, and a resume keeps the id while it
  changes the name."
- `SKILL.md` 580: "| a tab seat resumed by the editor | the human types
  `/tanto fukki` there; the seat re-handshakes with the same `transcript=`,
  and Kanri rewrites that row's name in place …"
- `SKILL.md` 583: "`tanto` writes a `resume` request for every terminal seat
  `seats.json` lists as `running` or `blocked` … a `stopped` seat is not
  resumed at all, which is why `tanto down --seats` retires a run rather
  than pausing it"
- `SKILL.md` 601–603: "A session whose transcript path matches no row is not
  a resumed role"
- `SKILL.md` 647: "a `close:` line with its clauses"
- `SKILL.md` 652–653: "a send error stays the signal that a session is gone"
- `SKILL.md` 654: "writes the Events line an unrun exit shoroku gets"
- `SKILL.md` 759: "Kanri writes `idle since <HH:MM>` into that cell"
- `SKILL.md` 856: "at its topic's **close**, stage word `t2`"
- `SKILL.md` 861–862: "every row of a ledger's `S-n` table carries Stage
  `t2`, the stage that recommends it"
- `SKILL.md` 954: "Kikaku and Hosa have no exit shoroku"
- `SKILL.md` 960: "and that section is its exit shoroku"
- `SKILL.md` 963: "`.tanto/<topic>/shoroku-proposal.md` on Kanri's `T2:`
  line"
- `SKILL.md` 973: "`exit: propose your shoroku; write it to <path>`"
- `SKILL.md` 991–995: "A proposal is `exit-<role>[-<suffix>]-proposal.md` in
  `.tanto/<topic>/` — no suffix for Sekkei (`exit-sekkei`) and Keikaku
  (`exit-keikaku`), the case number for Kaiseki (`exit-kaiseki-1`) … or,
  for Kanri, `.tanto/exit-kanri-<YYYY-MM-DD>-<name>[-2]-proposal.md`"
- `SKILL.md` 997–998: "The close's six files — `t2-recommendation.md`,
  `t2-brief.md`, `t2-direction.md`, `t2-review.md`"
- `SKILL.md` 1001–1004: "`docs: T2 shoroku for <topic>` … the two fixed
  prefixes, `docs: T2 shoroku` and `fix: text corrections`"
- `SKILL.md` 1106: "its two subcommands are `check`, … and `record`"
- `SKILL.md` 1189–1195, rule 10: "A rename before `/tanto <role>` is the
  human's own choice: the skill neither asks for one nor forbids it" (kept;
  the spawner's sentence joins it)
- `SKILL.md` 1271–1272: "a topic slug is none of them and begins with
  neither prefix"
- `SKILL.md` 1275: "and the prefixes `exit-kanri-` and `inbox-`."
- `roles/kanri.md` 83–84: "cold-read the roster and compare your own
  `name [ref]` with its first data row, then take exactly one case from
  "The five cases" below."
- `roles/kanri.md` 94: "begins with neither of its prefixes"
- `roles/kanri.md` 132: "### The five cases"
- `roles/kanri.md` 139: "for another's, whether `ListAgents` still lists it"
- `roles/kanri.md` 145: "(or `dead` when it is another name and not
  listed)"
- `roles/kanri.md` 162–164: "**Kept Kanri** — no handover file, the first
  data row is you, and that row's Transcript column is this session's own
  transcript path."
- `roles/kanri.md` 171–172: "**Second Kanri** — no handover file, the first
  data row is another name, and that session is still listed."
- `roles/kanri.md` 176–178: "**Resumed Kanri** — no handover file, the first
  data row is another name that `ListAgents` does not list, and that row's
  Transcript column is your own transcript path."
- `roles/kanri.md` 184–185: "**Recovery** — no handover file, the first data
  row is another name, that session is not listed, and its Transcript column
  is not your own path."
- `roles/kanri.md` 200–202: "2. Check the roster and the listing — no live
  roster row for that role and topic, and the `name [ref]` the handshake
  carries appears in `ListAgents`."
- `roles/kanri.md` 228–229: "A handshake whose `transcript=` equals a row's
  Transcript column is that session resumed under a new name"
- `roles/kanri.md` 237–239: "A handshake whose name is already on a `live`
  or `queued` row with a different transcript is that window `/clear`ed and
  re-invoked, in any role"
- `roles/kanri.md` 531–533: "write `idle since <HH:MM>` there the moment a
  Kikaku, Hosa, or Kaiseki reports to you and goes idle"
- `roles/kanri.md` 672: "`T2: propose the shoroku write-out; write it to
  .tanto/<topic>/shoroku-proposal.md`"
- `roles/kanri.md` 962: "One stage per topic, the **close**, stage word
  `t2`, in four steps"
- `roles/kanri.md` 1238: "### Exit shoroku"
- `roles/kanri.md` 1240: "Every planned exit of a session, in any role,
  carries its own shoroku"
- `roles/kanri.md` 1266–1268: "Stage `t2`, since the close is what
  recommends it — and you send the session `release: /clear this window`"
- `roles/kanri.md` 1286–1287: "mark the row `cleared` on a `no-role` or
  `dead` on a send error or an empty listing"
- `roles/kanri.md` 1527, the Replace table's first row: "the census marked
  it `gone`"
- `roles/kanri.md` 1553, the Release table's close row: "mark `dead` the
  rows of any session the census lost and no resume brought back"
- `roles/kanri.md` 1595–1597: "The human types `/tanto fukki` once, in your
  window, after `claude attach`, and then in each tab seat's window, in any
  order. Mark `dead` only a row whose session neither `ListAgents` lists nor
  re-handshakes"
- `roles/sekkei.md` 142: "Your tenure ends here, and your exit shoroku is
  part of it."
- `roles/sekkei.md` 146: "`spec accepted: <spec path>; exit proposal: <path>
  — <reading>`"
- `roles/sekkei.md` 197–199: "The stage word is `exit-sekkei`, no suffix,
  and the proposal goes to `.tanto/<topic>/exit-sekkei-proposal.md`."
- `roles/keikaku.md` 354–356: "**Your exit shoroku.** … The stage word is
  `exit-keikaku`, no suffix"
- `roles/jisso.md` 5: "the plan's last Jisso owns the T2 shoroku proposal"
- `roles/jisso.md` 313: "## T2 and the exit — the shoroku write-out"
- `roles/kaiseki.md` 84–85: "`exit: propose your shoroku; write it to
  <path>`, write them to `.tanto/<topic>/exit-kaiseki-<n>-proposal.md`"
- `templates/roster.md` 21–22: "A tab seat that was resumed re-handshakes
  with `/tanto fukki` instead, as it always did."
- `templates/roster.md` 23–25: "A handshake whose `transcript=` matches a
  row's Transcript column is that row's session resumed"
- `templates/roster.md` 26–28: "A handshake whose name is on a `live` or
  `queued` row with a different transcript is that window `/clear`ed and
  re-invoked, in any role: the old row goes `cleared`"
- `templates/roster.md` 29–30: "a closed tab, a crash, an editor restart
  before `/tanto fukki` for a tab seat"
- `templates/roster.md` 31–33: "A cleared window stays listed under its
  name, so neither route detects a `/clear`."
- `templates/roster.md` 62–63: "`stopped` is a terminal seat the spawner
  stopped on Kanri's request, its conversation kept"
- `templates/roster.md` 66–67: "or whose `/clear` came to light another way:
  a handshake under a name already here with a different transcript, in any
  role"
- `templates/roster.md` 117: "Stage the stage word `t2` for every row"
- `templates/roster.md` 135: "`cleared: <old name> → <new name>;`"
- `templates/kanri.md` 55: "the stage word — `t2` for every row of this
  table"
- `templates/spawn-request.md` 72–74: "except `spawn`'s ad hoc-worktree
  guard, which also records the seat as `stopped` before returning `error`"
- `README.md` 75: "**Claude Code CLI 2.1.277 or newer**"
- `README.md` 127–128: "`←` returns to the agent view and `Ctrl+Z` drops back
  to the shell; the session keeps running either way."
- `README.md` 133: "stopped seat is not resumed, and the next `tanto` starts
  a fresh Kanri."
- `README.md` 153–155: "and `/tanto fukki` (復帰), typed there, matches it to
  its roster row and rejoins it to the run."
- `scripts/spawner.js` 325–329: the ad hoc-worktree guard "at the first
  sighting"; 468: `if (!LIVE.includes(seat.status)) continue;` in
  `runCensus`
- `scripts/tanto.js` 340: `const kanriHeld = Boolean(held && (held.status ===
  "running" || held.status === "blocked"));`
- `scripts/boundary.js` 405: `row([\`S-${highest + 1}\`, source, text, "",
  "pending", "t2", "no"])`

## Requirements

Edits to `docs/requirements/04f5-tanto.md`, req-04f5, written by the close's
apply. The wording is English; the brief's third section carries a
reference translation where it asks about one.

- **Amend** "Roles in separate sessions; the human opens the seats that talk
  to them, the run starts the rest" with: "A seat the run starts carries its
  repository, its role, and its topic in its name, and works in the shared
  checkout: the instrument that starts it turns off, for that seat alone,
  the CLI's isolation of background sessions into worktrees, and writes no
  settings file to do so."
- **Rewrite** the body of "**A run is resumed with one command, and a
  session's identity survives its renaming.**", its bold lead kept, as: "The
  identity is the session's own id, whichever name the session goes by, for
  the seats the human opens as for the ones the run starts; a seat whose
  session has gone is known to have gone without a wait or a guess. The
  human's part after a restart is one command and, for the resident, one
  word in its terminal; nothing is typed in the other tabs." The mechanism —
  the listing, the census, no timeout — is ADR 3's.
- **Add** "**A session another repository runs is never reported as this
  run's.** The run speaks only of the sessions its listing places under the
  repository, so that two repositories' runs on one machine are never
  mistaken for each other."
- **Amend** "The human reaches any seat from the editor" with: "Every way
  out of a seat's terminal leaves the seat running; the seat's own stop
  command is the one way to stop it, and a resident the human stopped that
  way comes back with the run's one command." (D-11: a resident the run
  itself retired, by `tanto down --seats`, stays retired.)
- **Amend** "Docs are kept current as part of the flow": "Every planned exit
  of a session, in any role, carries its own shoroku before the human closes
  it" → "Every planned exit of a session, in any role, writes its shoroku
  proposal before the seat is released".

## The ADRs

Written by the close's apply under `docs/decisions/`; the `amends` links are
the Fixed inputs' one list, repeated here per ADR.

1. **A terminal seat is named by the spawner at its spawn, never at its
   resume.** `<repo>-<role>[-<topic>]-<hex>`. The name is registered as the
   user's own, which no auto-title replaces, and a flag-less resume brings it
   back from the job's saved options (Measured 3, 4). Rejected: `--name` on
   the resume — any flag on `--resume … --bg` starts a copy under a new id;
   the harness's auto-title — it names no repository and changes after the
   spawn; a name in Kanri's request — the scheme belongs in the one process
   that runs `claude --bg`. Amends decision-73c3 and decision-1ea3.
2. **The CLI's background isolation is turned off per seat by the spawner's
   `--settings`; no settings file is written.** A control seat went into a
   worktree at its first write (issue-aa37 reproduced); the flagged seat
   wrote in the root, before and after a flag-less resume. The guard moves
   to every pass of the spawner's census, since the relocation happens
   mid-turn. Rejected:
   the launcher asking and writing `.claude/settings.local.json` (the Kikaku
   decision's item 3, reversed with the human's word, D-2) — it edits the
   repository's configuration, which req-04f5 forbids, and turns the
   isolation off for every background session in the repository; the user
   scope — every repository; the variable `CLAUDE_BG_ISOLATION` — the CLI
   sets it itself in a job's environment, and a requester's value is not
   carried; worktrees for the seats — a rewrite of the workspace contract.
   Amends decision-1ea3.
3. **Identity is the `sessionId` for every seat, and the census is its one
   signal.** `boundary.js census` reads `claude agents --json` and keeps the
   sessions whose cwd is the root or under it, by its own comparison; a row
   whose `sessionId` it does not list is `dead` — no timeout, no
   inference, no name match; the tab seats type nothing after a restart; a
   session the census does not place under the root is another
   repository's and is never reported. Rejected: a timeout (issue-261c's
   proposal); resolving paths through the filesystem (issue-d92f's first
   proposal); a name-and-transcript key (issue-894d's) — the name adds
   nothing the id does not settle; the census as a file the spawner writes —
   it needs the spawner running, and a tab Kanri could not read it; Kanri
   matching the listing by hand. Amends decision-8320, decision-ded8, and
   decision-84c8.
4. **The shoroku vocabulary has one name and no stage word.** "Shoroku
   proposal" for every seat's proposal; the files named by the step and
   keyed on the writing session; the commit subject
   `docs: shoroku for <topic>`; no Stage column. Rejected: "exit proposal"
   (the 2026-09-16 Kikaku decision's term, replaced with the human's word,
   D-7) — it reads as a proposal to exit; "exit notes" — `docs/notes/`;
   "handoff notes" — Kanri's handover; 申し送り — it implies a successor,
   where the items go to the close's recommender; a prose-only pass that
   keeps "T2" as a name (Q5's B). Amends decision-2db1, decision-1f5f,
   decision-d831, decision-d538, and decision-d125.
5. **`tanto` resumes a Kanri that left the listing without the run's
   request, and the census revives a seat that returns.** A Kanri the human
   `/stop`s, or one that crashes while the spawner runs, was replaced by a
   fresh spawn (Measured 7). Rejected: resuming every seat that left the
   listing — a Jisso's replacement is the Replace table's, whose
   verification of the tree comes first. Amends decision-84c8.

## What the plan must contain

- Global Constraints: rule 11's authority sentence and the final batch as
  the safe boundary; the four facts of section 5; the README's shortness
  (D-8).
- A batch of the instruments: `spawner.js`, `tanto.js`, `boundary.js`, and
  `templates/spawn-request.md`, with their tests — the tests run with the
  fake `claude` and a fake config directory, never the real CLI.
- A measurement task, against the real CLI in a scratch clone, through a
  spawner run from the working tree's `scripts/spawner.js` on the clone,
  never through the resident one, every act a request file: a `spawn`
  request's result carries a name of 1.1's shape; the seat, on sonnet
  (haiku has no auto mode, Measured 4), writes a file in the clone's root
  with no worktree; a `stop` request, then a `resume` request, keeps the
  `sessionId` and the name, and the CLI's note on the resume lists the
  effort among the saved options; a second write lands in the root. No
  session issues `claude --bg`, `claude stop`, or `claude rm` itself
  (decision-1ea3). Its report goes to `.tanto/<topic>/`.
- The contract and the roles: `SKILL.md`, the seven role files, and the
  templates of 6.4 — in one batch or two, the final batch among them.
- The docs: the README (4.4) and `docs/notes/tanto-consistency-checks.md`.
- The issues — a task per issue group, as the Kikaku decision expects, each
  in the batch that lands its fix: aa37 with the spawner; 02ab, 894d, d92f,
  261c, and 7f28 with the identity rule; e3e4, 5a2d, de29, 8c74, ce69, and
  bdad's third item with the vocabulary; and the new issue with the
  launcher's trust hint.
- The whole-branch review and its fix wave, as every plan.
- How a batch is verified: `node --test` over the scripts' tests;
  `passage-check.js verify` over the plan's passages; the `O` needles above
  at zero over `skills/tanto/SKILL.md`, `skills/tanto/roles/`,
  `skills/tanto/templates/`, and `skills/tanto/README.md` — among them
  `exit shoroku`, `exit proposal`, `exit: propose your shoroku`,
  `stage word`, `` Stage `t2` ``, `` `T2:` ``, `T2 proposal`,
  `t2-recommendation`, `t2-brief`, `t2-direction`, `t2-review`,
  `docs: T2 shoroku`, `| Stage |`, `shoroku-proposal.md`, `-2-proposal`,
  `exit-kanri-<`, `exit-<role>`, `exit-sekkei`, `exit-keikaku`,
  `exit-kaiseki`, `candidate`, `cleared: <old name>`, and `The five cases`;
  the scripts' test fixtures keep their strings, which are data a test
  writes, not the skill's vocabulary; and `boundary.js census` run against
  this repository's live roster, read-only, printing its four headings.

## Verification

Measured in the dialogue, taken as given by the plan: the name's survival
and the isolation's, both across a flag-less resume (Measured 4); the ways
out of a seat (Measured 5); the trust question and its workaround (Measured
6). The plan measures once more, through its own code: the measurement task
above. Two claims are read from the CLI binary and not yet observed, and the
dogfood report records them the first time the run meets them: a `/clear`
moves a window's session id out of the listing (2.5), and a managed policy
that forces `worktree` outranks the flag (1.2).

## Out of scope

- The CLI's unanswerable trust question itself — upstream's to fix; this
  repository files it ("Issues this design closes"), and a report to
  anthropics/claude-code is the human's to make.
- issue-cca9 (the role-file diet), issue-c3d1 and issue-337b (two
  repositories clobbering each other's agent definitions), issue-6880,
  issue-483c, issue-e73b, and every other open issue the Kikaku decision
  excluded; a wider prose polish (issue-2065).
- issue-fd4b (a `--bg` worktree spawn stuck on a startup dialog, the
  seat-side neighbor of the new issue), issue-c820 (two live sessions
  sharing a bare name), issue-cafd, and issue-bdad's first two items.
- A multiplexer, and a `tanto watch` view: `claude agents` is the view, and
  a seat outlives its terminal.
- The `addDir` backslash corruption the tanto-bg-seats close saw (roster
  `S-8`), a pending proposal item of its own.

## Issues this design closes

Each retired term grepped once across `docs/issues/open/` (Measured 10).

- **issue-aa37** (a `--bg` session reported its cwd under
  `.claude/worktrees/` with no `-w`) — the cause measured (Measured 4: the
  default isolation's guard, then `EnterWorktree`), removed per seat (1.2),
  and the guard at every pass of the spawner's census (1.4).
- **issue-02ab** (a stale `live` row read as superseded by inference) — the
  census is the mechanical signal (2.1, 2.5).
- **issue-894d** (a `/clear` can reuse a name and a ref for a new session) —
  no match is by a name or a ref (2.1).
- **issue-d92f** (fukki's transcript-path check under a changed config
  directory) — the match is the Transcript basename, for the tab seats too
  (2.6).
- **issue-261c** (a live but unreachable Kikaku or Hosa row has no timeout)
  — the census signal, with no timeout (2.1).
- **issue-7f28** (three roster vocabulary drifts) — items 1 and 3 here
  (2.8); item 2 already gone.
- **issue-e3e4** (`exit-sekkei` and `exit-keikaku` called the stage word) —
  no stage word (3.5, 6.3).
- **issue-5a2d** (`roles/jisso.md:5` on the T2 proposal and write-out) — "and
  write-out" was already gone, and "T2" goes (3.1).
- **issue-de29** (the roster template's Stage values miss a triage-raised
  row) — already closed in substance by "`t2` for every row", and the
  column goes (3.5).
- **issue-8c74** (the ledger template's Stage example list omits
  `exit-keikaku`) — the list and the column go (3.5).
- **issue-ce69** (Kanri's proposal file name collides across same-day
  tenures) — the file is keyed on the session (3.2).
- **issue-bdad**, its third item only (a second Sekkei or Keikaku collides on
  its proposal file) — keyed on the session (3.2); the issue stays open with
  its first two items, the third struck with a pointer to this design.
- **issue-7607** — already resolved by decision-363c; nothing to do.

Opened by the plan, beside these: **the agent view's folder-trust question
after a detach takes no input** — the reproduction (a repository whose trust
`.claude.json` does not record; attach; `←`, `/exit`, or `Ctrl+C` twice),
the environment (Windows, VS Code's integrated terminal, CLI 2.1.280), the
start-up question taking input where this one does not, the two drive-letter
keys, the workaround (answer the start-up question once) and the launcher's
hint, and issue-fd4b as related.

## Answers to the spec inputs

No `spec-inputs.md` exists. The passage check went to Kanri, whose procedure
§2.3 to §2.7, §3.2 to §3.5, §4.2, and §5 rewrite, and Kanri answered by
message on 2026-09-23: no obligation of its conflicts; nothing changes how
it runs this plan's ordinary batches; the changes reach it at this topic's
own close, where it re-reads the landed text first (§5); and §2.7 closes the
gap it fell into this session, reporting two sessions `ListAgents` listed
without a cwd (the Kikaku decision's finding 1). It read §2.3 as replacing
its Start step 1's read of its own name with the census; §2.3 now says that
step stays and the census follows it.

## Deferred items

- The trust question's own fix, upstream's (Out of scope); the launcher's
  hint is the workaround until then.
- issue-915a (drop the close's Jisso proposal and name the SDD ledger as a
  source) stays deferred; its title's "T2" is history.
- The census inside the boundary's own `check`, so that a stale tab row is
  noticed at every batch boundary — not needed while a send error or the
  next handshake notices it.
- Recovering a `strayed` seat's commits beyond the Replace table's row.

## Shoroku proposal from this spec work

This section excludes the spec's own sections above, which the close's
recommender reads for itself.

1. `--permission-mode auto` on a haiku `--bg` seat runs as `default` — the
   CLI's "auto mode unavailable for this model" — so a real-CLI measurement
   that needs auto mode runs on sonnet (Measured 4). Destination: notes.
2. A background seat does not need its folder's recorded trust: the run's
   Kanri runs `auto` in this repository with `hasTrustDialogAccepted: false`,
   and a sonnet seat ran in a folder never trusted (Measured 4, 6).
   Destination: notes.
3. A session that enters a worktree moves its transcript to the worktree
   path's project directory (Measured 4), so a Transcript column's full path
   can go stale mid-session while its basename holds. Destination: notes.
4. `.claude.json` keeps one folder under two keys that differ in the drive
   letter's case — `c:/…` from the editor's sessions, `C:/…` from a terminal
   — and a trust recorded under one is not read under the other (Measured
   6). Destination: the new issue.
5. A decision addressed to a later topic has no check that the topic took
   it: the 2026-09-16 term change was placed on `seat-lineage`, and
   issue-e3e4 on `tanto-diet`, and neither landed. Destination: issues.
6. `claude attach --help` names `←` and `Ctrl+Z` only; `/exit` and `Ctrl+C`
   twice also leave a seat running (Measured 5), and `claude stop`'s help
   says `claude attach <id>` reopens a stopped session. Destination: notes.
