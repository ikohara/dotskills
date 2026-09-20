# Design: tanto-bg-seats — the machine-facing seats are `claude --bg` sessions started by a spawner outside any session; the human starts and resumes a run with one command; the run is unattended from the spec's kessai to the close's kessai; the fix group is a Jisso batch before the merge and the docs write-out a scribe after it; the handover loses its presence gate; identity is the sessionId

Written by Sekkei `dotskills-9d [f72029]` on 2026-09-20 on the branch
`tanto-bg-seats`, cut from `main` with no batch in flight (Kanri's orders
line: write and commit normally, no draft). The dialogue is
`.tanto/tanto-bg-seats/dialogue.md`, decisions D-0 to D-5.

## Fixed inputs

Each decision below names the requirement bullet it serves, from
`docs/requirements/04f5-tanto.md` (req-04f5), or says that none does. The
three Kikaku files of 2026-09-20 are one decision in three parts, and the
topic-order file places this topic and disposes of `parallel-close`; this
spec takes their decided items as given and fixes what they left to the
Sekkei.

- **Two kinds of seat, drawn by who the seat talks to**
  (`.tanto/kikaku/2026-09-20-terminal-and-tab-seats.md` §1): terminal
  seats — Kanri in every generation, Keikaku, Jisso, the shusei batch, shoki
  — are started by the machine and visited by `claude attach`; tab seats —
  Kikaku, Hosa, Sekkei, Kaiseki — are opened by the human in VS Code as
  today. Serves req-04f5 "Roles in separate sessions, at the human's hand",
  which this spec rewrites (Requirements below), and "The human's counterpart
  is Kanri".
- **The spawner is the only process that runs `claude --bg`** (third file
  §3; the second file's §6 on the classifier): Kanri writes a request file
  under `.tanto/` and a Node process outside any Claude session runs the
  command, so the auto-mode classifier — which refused
  `claude --bg "/tanto jisso …"` from a session's own Bash tool as
  `[Create Unsafe Agents]` regardless of `--permission-mode`
  (`docs/reports/2026-09-20-tanto-bg-seats-probe.md`, item 1) — judges
  nothing, and no allow rule is placed. A prompt shape chosen to slip past
  the classifier is excluded (second file §6). Serves the rewritten
  "Roles in separate sessions" bullet.
- **The launcher ships with the skill, never with a consuming project**
  (third file §2): `.bat` and `.sh` wrappers around a Node script beside
  `reading.js`, recommended for `PATH`, the root being the cwd or the one
  argument; idempotent, so it is also fukki. Serves req-04f5 "tanto's own
  state lives in its own directory" and the new bullet "A repository that
  uses tanto carries nothing of it".
- **Kessai — two signing sites; the plan brief is written and not waited
  for** (`.tanto/kikaku/2026-09-20-kessai-shusei-shoki.md` §1, §2): the
  spec kessai is Sekkei's review as today; the close kessai is one message
  in Kanri's window — the T2 brief, the merge decision, the merge's default
  form (`--no-ff`, the local branch deleted, nothing pushed) — answered by
  exception, one answer being the direction and the merge approval;
  Keikaku decides every `choose` and `decide` point of the plan brief by its
  `— If unanswered:` clause and records the defaults in `dialogue.md`. The
  ledgers' record behind it: five plan reviews, zero edits, one explicit
  decision (second file §0). Serves req-04f5 "The human is interrupted only
  at defined checkpoints", rewritten below.
- **Shusei before the merge, shoki after** (second file §3, §4): the
  recommendation's `fix` group is a Jisso batch on the topic branch,
  verified by Kanri, before the merge; the `docs/` write-out is a
  brief-driven `claude --bg -w` scribe off the critical path, in a worktree,
  with `--add-dir` to the main checkout for `.tanto/`. The line: no worktree
  for batches; a worktree for the docs-only scribe. Serves req-04f5 "Docs
  are kept current as part of the flow" and "A one-sentence repair is
  applied, not filed".
- **The handover loses its presence gate** (second file §7): measure →
  over → write the handover → spawn the successor → the successor accepts →
  the predecessor stops; the gate existed for the hands the design removes,
  and it read `absent` at eighteen boundaries in a row while Kanri grew to
  835k. Serves req-04f5 "Kanri is resident, but its context cost does not
  grow with its tenure" and "A seat stays under an operating context
  ceiling the run chooses", whose last clause this spec rewrites.
- **Spawned seats do not handshake; identity is the `sessionId`; a
  wake-up is spent only on a decision** (third file §4, §5, §6). Serves
  req-04f5 "A run is affordable to keep running" and "A session resumed
  under a new name rejoins the run as easily as possible", rewritten below.
- **Kanri alone cuts, switches, merges, and deletes the branch**
  (`.tanto/kikaku/2026-09-18-parallel-close-and-tanto-feedback.md` §4 D,
  transferred intact by `2026-09-20-topic-order-bg-seats-eighth.md` §2).
  Sekkei and Keikaku commit on the branch the tree is on. Serves no
  requirement bullet directly; it is the shared-checkout rule made
  one-owner.
- **The CLI ↔ VS Code requirement is met by terminal attach only**
  (`.tanto/kikaku/2026-09-20-native-bg-seats.md` §5; second file §6, items
  8 and 9; third file §7): the extension's "Activate session" is not a
  premise — its bundled binary and the standalone CLI drift with every
  release — and the human opens no terminal outside VS Code. Serves the new
  bullet "The human reaches any seat from the editor".
- **Nine probe findings taken as given**
  (`docs/reports/2026-09-20-tanto-bg-seats-probe.md`): a gated tool blocks
  for real and `claude agents --json` shows `state: blocked`,
  `waitingFor: permission prompt`; the `Notification` hook fires on
  `permission_prompt` with `session_id` and `transcript_path`; `--session-id`
  is ignored with `--bg` and the id is one `claude agents --json` call away
  after the spawn; `--agents <json>` is Task-tool subagent definitions and
  changes nothing here; `claude stop <id>` then `claude --resume <id> --bg`
  with no other flag keeps the id, any extra flag or prompt starts a copy;
  a `--bg` session under `manual` mode once reported its cwd under
  `.claude/worktrees/` with no `-w` (issue-aa37); `claude attach` works in
  the integrated terminal. Serves req-04f5 "A session's cost is measured,
  not guessed" (the transcript is where `reading.js` reads it).
- **The dialogue's five answers** (`.tanto/tanto-bg-seats/dialogue.md`):
  D-1 the spawner is the notifier, the hook optional; D-2 a self-editing
  plan spawns all its Jissos at the landing, other plans per batch, and this
  plan runs on the old mechanism with the final boundary the safe one; D-3
  one command `tanto`, with `tanto down [--seats]`; D-4 `shoroku.review` is
  a step in shoki's brief, a fifteenth kind; D-5 the twelve-section outline
  stands.
- **Standing decisions this spec amends, and names.** decision-eee2 (the
  handover fires on a derived ceiling gated on the human's presence) loses
  its gate; decision-de63 (Kanri resident with a handover) keeps its event
  and gets a spawned successor; decision-ea95 (one fresh Jisso per batch
  from a queue of N filled at the landing) keeps its rotation and loses the
  queue for every plan but a self-editing one; decision-76a6 (a queued Jisso
  reads nothing until its batch prompt) narrows to that case; decision-a1ae
  (the close's recommend, check, and apply are a live Hosa's) is
  superseded — the recommend is Kanri's dispatch, the check is the kessai in
  Kanri's window, the apply is shoki's; decision-ce83 (the write-out is
  applied from files by a dispatch) keeps its files and moves the dispatch
  into shoki; decision-83aa (a `fix` group with a commit of its own) keeps
  its commit, made by shusei; decision-73c3 and decision-0775 (born names,
  the address read from the roster's first row) stand, the row's name now
  the harness's for a background seat; decision-5c8e (a self-editing plan
  runs on the skill it edits) gains D-2's rule; decision-0352 (the shoroku
  kind is two kinds) gains a third, `shoroku.review`. Serves req-04f5 "Model
  discipline" (no model moves; a new kind carries its own model and effort,
  decision-03f9).

## Measured while designing

1. CLI **2.1.278** (`claude --version`, 2026-09-20). `claude attach --help`
   reads: "← returns to agent view, Ctrl+Z drops back to your shell. The
   session keeps running either way" — the detach question the third file's
   §6 left open is answered by the CLI's own text. `--permission-mode`
   accepts `acceptEdits`, `auto`, `bypassPermissions`, `manual`, `dontAsk`,
   `plan`. `--effort <level>` and `--model <model>` are session flags.
   `claude rm` "works on already-exited sessions" and keeps the worktree's
   branch when it removes the worktree. `claude agents` without `--json`
   requires a TTY.
2. `claude agents --json --cwd .` lists eleven interactive sessions of this
   repository with the keys `pid, cwd, kind, startedAt, sessionId, name,
   status`; a background session adds `state` and `waitingFor` (probe item
   2). `claude` is a native binary at `~/.local/bin/claude` (237 MB), so a
   Node `child_process.spawn` needs no shell.
3. `.git/info/exclude` already carries `**/.claude/worktrees/` (the
   harness's own entry) and `.claude/tanto.json` (this repository's local
   choice for the project config). `~/.claude/settings.json` carries a
   `Notification` hook entry — the probe's item 3, still placed.
4. Sizes: `SKILL.md` 80,190 bytes, `roles/kanri.md` 99,928,
   `roles/keikaku.md` 23,615, `roles/jisso.md` 21,075, `roles/sekkei.md`
   12,933, `roles/hosa.md` 8,514, `roles/kaiseki.md` 7,395,
   `roles/kikaku.md` 3,472 (`wc -c`, 2026-09-20).
5. Sites the design retires or rewrites, by `grep -c`: `create request`
   15 in `roles/kanri.md` and 4 in `SKILL.md`; `queued` 22 and 11;
   `release:` 18 and 7; `/clear` 22 and 13; `fukki` 11 in `SKILL.md`;
   `presence` 5 and 5, plus 3 in `templates/boundary-brief.md`; `handshake`
   26 and 29; `ListAgents` 10 and 11; `close:` 5 in `roles/hosa.md` and 5
   in `roles/kanri.md`; `sweep:` 5 and 1. The plan's `O` rows measure each
   over every path it touches.
6. `reading.js` exports its functions (`module.exports` at line 464), among
   them `readJson`, `configDir`, `configPathOf`, `projectConfigPathOf`, and
   `loadCeiling`; the launcher reuses the config reading rather than copying
   it. `boundary.js record` validates `--status` as ending in `live`,
   `cleared`, or `queued` (line 559), so the new status `stopped` is a
   change to that check.
7. Open issues that name a term this design retires, one grep per term:
   `presence` 6 (1a9a, 261c, 40ed, b409, c204, fab7); `fukki` 8; `queued`
   16; `create request` 2 (1a9a, 909c); `Activate session` 1 (7607);
   `.claude/worktrees` 1 (aa37); `kanri-address` 4 (40ed, 894d, 9d84, f5d8,
   all already retired by tanto-diet); `checkout free` 2 (2b9c, bb8c);
   `spawn` 3 (629b, aa37, f1a4). "Issues this design closes" rules on each.

## 1. The two instruments, and the seat they make

### 1.1 Two kinds of seat

| kind | seats | started by | stopped by | the human's way in |
| --- | --- | --- | --- | --- |
| terminal seat | Kanri in every generation; Keikaku; Jisso, the shusei batch included; shoki | the spawner, on a request file Kanri writes — the first Kanri on the launcher's request | the spawner, on a `stop` request | `claude attach <id>` in VS Code's integrated terminal; `claude logs <id>` to look without waking it |
| tab seat | Kikaku; Hosa; Sekkei; Kaiseki | the human, `/tanto <role>` in a VS Code tab | the human's `/clear`, after Kanri's `release:` | the tab, always visible |

A terminal seat's whole existence is in `claude agents --json`: its
`sessionId`, its harness-given `name`, its `cwd`, its `state`. A tab seat's
is in its handshake. The roster holds both kinds in one table (1.7).

### 1.2 The launcher: `scripts/tanto.js`, `tanto.bat`, `tanto.sh`

One Node script with no dependencies, beside `reading.js`, and two wrappers
that run it — `node "%~dp0tanto.js" %*` and
`node "$(dirname "$0")/tanto.js" "$@"` — so that `tanto` on `PATH` is the
human's one command. The README recommends putting `skills/tanto/scripts/`
on `PATH`; without it, `node "<skill>/scripts/tanto.js"` works the same.

`tanto [<root>]` — the root is the cwd when no argument is given, else the
path given; it must be a git repository's top level. In order:

1. Read the three-layer `tanto.json` for that root through `reading.js`'s
   exported loader, for `sessions.kanri`'s family and effort.
2. Make sure `<root>/.tanto/`, `.tanto/.gitignore` (`*`), and
   `.tanto/.markdownlint-cli2.yaml` exist, writing each only when absent —
   the same two files Kanri's Start step 2 writes; the launcher runs before
   any Kanri exists.
3. Start the spawner (1.3) for that root when `.tanto/spawner/pid` names no
   live process: a detached child (`detached: true`, `stdio` to
   `.tanto/spawner/log`, `windowsHide: true`, `unref()`), cwd the root.
4. Find Kanri: a `live` first data row of `.tanto/roster.md` whose
   `sessionId` (1.7) `claude agents --json --cwd <root>` lists is the
   running Kanri. When there is none, write a `spawn` request (1.4) for
   `/tanto kanri` on `sessions.kanri`'s family and effort, permission mode
   `auto`, and wait for its result file, up to sixty seconds.
5. When the spawner's `seats.json` (1.3) lists terminal seats whose
   `sessionId` is not in `claude agents --json`, write a `resume` request
   for each — the editor-restart or reboot case, 1.8.
6. Print, in the chat's language, the one line the human needs:
   `claude attach <id>` for the running or new Kanri, and, on a resume,
   the second line "then type `/tanto fukki` there once".

`tanto down [<root>] [--seats]` — stop the spawner (its pidfile, then the
process); with `--seats`, first write a `stop` request for every terminal
seat `seats.json` lists as running and wait for the results. The
conversations are kept; `tanto` resumes them.

The launcher is idempotent: run twice, it starts nothing twice, and it puts
back what a restart took. It never runs `claude --bg` itself — its Kanri
goes through the spawner like every other seat, so that "the spawner is the
only process that runs `claude --bg`" has no exception, and a launcher run
inside a Claude session's terminal (which the human may do from VS Code's
integrated terminal, outside any session, but a session's Bash could too)
still issues no session-creating command.

### 1.3 The spawner: `scripts/spawner.js`

A resident Node process, one per root, started by the launcher and never by
a Claude session. Its files are under `<root>/.tanto/spawner/`: `pid`,
`log`, `seats.json`, `requests/`, `results/`. Its loop:

- **Requests.** Every two seconds, and on `fs.watch` of `requests/`, take
  each `requests/<id>.json` in name order (ids are `<ISO time>-<random>`,
  so the order is the write order), run its `op`, write
  `results/<id>.json`, and delete the request. An op that fails writes a
  result with `error` and the command's stderr, and nothing else.
- **The census.** Every fifteen seconds, run
  `claude agents --json --cwd <root>` and reconcile `seats.json` with it:
  a seat whose `state` turned `blocked` raises the notice (1.5) once per
  block; a seat no longer listed is marked `gone` with the time; a known
  `sessionId` under a new `name` gets the new name and a `renamed` mark
  that Kanri reads (1.7). The census is the only place the spawner reads
  the CLI's list; the roster it never reads and never writes.
- **The guard.** After a `spawn` with no `worktree`, the census's first
  sighting of the new `sessionId` compares its `cwd` with the root; a cwd
  under `<root>/.claude/worktrees/` is the ad hoc worktree of issue-aa37,
  and the spawner runs `claude stop <id>` at once and writes the result
  with `error: ad hoc worktree <cwd>`. The guard the second file §6 gave
  Kanri is this check, made mechanical where the field is read anyway.

The ops:

| `op` | the command | the result |
| --- | --- | --- |
| `spawn` | `claude --bg --model <model> --effort <effort> --permission-mode <mode> [-w <worktree>] [--add-dir <dir>]… "<prompt>"`, cwd the root | `id` (the short id `--bg` prints), then from the census: `sessionId`, `name`, `cwd`, `transcript` (`<config dir>/projects/<slug>/<sessionId>.jsonl`, the same derivation `SKILL.md`'s reading section gives), `startedAt` |
| `stop` | `claude stop <id>` | `stopped: <time>`; the conversation is kept |
| `rm` | `claude rm <id>` | `removed: <time>`, and the worktree path it removed when the seat had one |
| `resume` | `claude --resume <sessionId> --bg`, **no other flag** (probe item 6: any extra flag or prompt starts a copy) | the new `id` and `name`, the same `sessionId` |
| `attention` | none — the notice (1.5) | `notified: <time>`, and the channel used |
| `ack` | none — clears the `renamed` mark of the named `sessionId` in `seats.json` (1.7) | `acked: <time>` |

`seats.json` is the spawner's own ledger: one entry per seat it spawned or
resumed — `sessionId`, `id`, `name`, `role`, `topic`, `model`, `effort`,
`mode`, `worktree`, `startedAt`, `status` (`running`, `blocked`, `stopped`,
`gone`, `removed`), `renamed` (the previous name, until Kanri clears it by
a `resume`-acknowledging request, 1.7). It is what the launcher's resume
step and `tanto down --seats` read. It is not the roster: the roster stays
Kanri's, written from the result files, so that one file has one writer and
no race.

Platform notes the plan verifies (Verification): the detached child must
survive the closing of the integrated terminal that ran the launcher on
Windows (`windowsHide`, `unref`, the log file as `stdio`); `claude` is a
native binary here, spawned without a shell, its arguments passed as an
array so that a prompt with quotes needs no escaping; on macOS and Linux
the same code path.

### 1.4 Request and result files

`.tanto/spawner/requests/<id>.json`, written by Kanri — or by the launcher
for the first Kanri — atomically (write `<id>.json.tmp`, rename). The
schema, as `templates/spawn-request.md` ships it — the JSON in a fence,
every field explained beside it:

```json
{
  "op": "spawn | stop | rm | resume | attention | ack",
  "role": "kanri | keikaku | jisso | shoki",
  "topic": "<topic word, or — for Kanri>",
  "model": "<family, from sessions.<role>.model>",
  "effort": "<level, from sessions.<role>.effort>",
  "mode": "auto",
  "prompt": "/tanto <role> key=value …, or the shoki brief's path prefixed as its brief line",
  "worktree": "shoki-<topic> | null",
  "addDir": ["<root>"],
  "sessionId": "<for stop, rm, resume>",
  "message": "<for attention: one line, in the chat's language>"
}
```

`results/<id>.json` carries the request's fields back with the fields the
op's row in 1.3 names, or `error`. Kanri reads a result when it next acts —
after writing a `spawn` request for a Jisso it has nothing to wait for, since
the seat's orders are in its prompt (1.6) and the seat's report is what wakes
Kanri next; after a `spawn` for a Kanri successor the outgoing Kanri reads
nothing, since the successor takes over; after `stop`, `rm`, and `attention`
nothing is read unless the next census shows the seat still running. A
result older than the plan's close is the archive's; the spawner deletes
nothing under `results/`, and the plan close moves the topic's results into
`.tanto/<topic>/spawner-results/` with the archive move.

The request file is Kanri's only act toward a seat's lifecycle. `SKILL.md`'s
"Session lifecycle" and `roles/kanri.md`'s "Create", "Replace", and
"Release" become: write the request. There is no create request to the
human, no numbered list of commands, no queue.

### 1.5 The notice (D-1)

The spawner raises a desktop notice, without configuration by the human, on
two events: a seat's `state: blocked` in the census — a permission prompt,
an `AskUserQuestion`, anything the harness renders and waits on — and an
`attention` request Kanri writes, whose one use in this design is the close
kessai (2.4). The notice's text is the seat's role, topic, and name, and the
one command that reaches it, `claude attach <id>`.

The channel, by platform, each a child process with no dependency:
Windows, `powershell -NoProfile -Command` with an inline script that loads
`Windows.UI.Notifications.ToastNotificationManager` and shows a text toast
under the app id PowerShell registers; macOS,
`osascript -e 'display notification "<text>" with title "tanto"'`; Linux,
`notify-send tanto "<text>"`. When the channel's process fails, the
spawner logs the notice and writes `channel: log` into the result, and the
run continues — the notice is a convenience, and `claude agents` in a
terminal is the view that needs nothing.

The `Notification` hook is optional, and the spec writes it so that the
human who wants an immediate, harness-native notice for permission prompts
can place it — the human's own act, since every seat's attempt is
`[Self-Modification]` (probe item 3). In `~/.claude/settings.json`, or the
project's `.claude/settings.local.json`:

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "permission_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "node \"<skill>/scripts/spawner.js\" notify --stdin"
          }
        ]
      }
    ]
  }
}
```

`spawner.js notify --stdin` reads the hook's JSON payload (`session_id`,
`cwd`, `transcript_path`, `notification_type`) and raises the same notice
the census would, without waiting for the census's fifteen seconds. It runs
as a one-shot in the hook's process and touches no file of the spawner's.
Nothing in the design depends on the hook being placed.

### 1.6 Invocation for a spawned seat, and its start sequence

The command's grammar becomes `/tanto <role> [<key>=<value> …]`. The
second positional argument `<address>` is retired: Kanri's address is the
roster's first data row for every role, and a workspace with no roster yet
has no peer to bootstrap — its first session is the Kanri the launcher
spawns, and Kanri writes the roster. The keys carry a spawned seat's orders,
which today travel in Kanri's reply to its handshake:

| seat | the prompt |
| --- | --- |
| Kanri, first or successor | `/tanto kanri` — the handover file, when one exists, is the Start section's Handover case as today |
| Keikaku | `/tanto keikaku topic=<topic> spec=<path> plan=<path>` — the orders line's three variables; the standing grant is implied by the role, as `roles/keikaku.md` states it |
| Jisso, an ordinary plan | `/tanto jisso batch=<.tanto/<topic>/batch-<X>-prompt.md>` — the prompt file is its orders, as the `batch:` line's path is today |
| Jisso, a self-editing plan (D-2) | `/tanto jisso queue=<topic>` — reads nothing and waits for the one line `batch: <path>`, as a queued Jisso does today |
| shoki | not a `/tanto` invocation: the prompt is the one line `brief: <.tanto/<topic>/shoki-brief.md>` and the file it names (2.6); shoki reads no role file and no `SKILL.md` |

A spawned seat runs the start sequence's model check (warn only — the
request named the model, and a mismatch means the CLI ran something else,
which is one line in its own window and in its first report) and the
definitions write-out, and **sends no handshake**: its role, topic, model,
effort, branch, and mode are in the request Kanri wrote, its `sessionId`,
name, cwd, and transcript in the result. Then it does what its keys say. A
tab seat's start sequence is unchanged, and its handshake gains one field,
`topic=<topic|—>`, so that a Sekkei's or a Kaiseki's handshake names the
topic it was opened for (issue-43a8) — Kanri's orders line still names it,
and the field lets Kanri refuse a second Sekkei for the same topic without a
round trip.

**Unverified, and the plan's first task**: that the initial prompt of a
`claude --bg` session invokes the `tanto` skill when it reads
`/tanto kanri`. The probe never reached this — item 1's process was refused
before it started, and the spike's prompt was plain text. The fallback,
should a slash command in a `--bg` prompt not resolve, is the prompt
`Invoke the Skill tool with skill "tanto" and args "<role> <keys>", and follow it`,
which names the same skill through the harness's own tool; the request's
`prompt` field carries whichever form the verification settled, and the
role files never see the difference. Rule 6 of `SKILL.md`'s "Rules" — every
dispatch names a `model` — is unchanged; a spawn request's `model` is the
same discipline one level up.

### 1.7 Identity, the roster, and the address

**Identity is the `sessionId`.** The transcript path is a function of it,
the name is what `claude agents --json` and `ListAgents` currently print for
it, and a resume (`claude --resume <sessionId> --bg`, or the editor's own
resume of a tab) keeps it while it changes the name. `SKILL.md`'s
"Resuming" shrinks to the third file's §6 table: the roster's Transcript
column stays and gains no sibling, since `sessionId` is the basename of what
it holds; a `Sess` column would duplicate it.

**The roster** keeps its columns — Role, Topic, Name `[ref]`, cwd, Model,
Effort, Branch, Mode, Started, Status, Transcript — and Kanri stays its
only writer. What changes:

- A terminal seat's row is written by Kanri from the result file, at the
  next act after the request — for a Jisso, when its report arrives, by the
  boundary's `record` call, which takes `--seat <results path>` and reads
  the identity columns from it; for a Keikaku or a Kanri successor, by
  Kanri's own hand when it next touches the roster. A row that does not
  exist yet when a seat is already working is not an error: the seat's
  address is not needed until Kanri sends to it, and Kanri sends to a Jisso
  nothing before its report.
- Status gains `stopped` — a terminal seat the spawner stopped, its
  conversation kept — and `boundary.js record`'s `--status` check accepts
  it. `cleared` stays for tab seats, `dead` for a seat the census marked
  `gone` that no resume brought back, `replaced` for a Kanri that handed
  over, `refused` for a tab seat's refused handshake. `queued` stays for
  D-2's case only.
- A `renamed` mark in `seats.json` — a known `sessionId` under a new name —
  is read by Kanri at its next act: it rewrites the row's Name column and
  writes the Events line `resumed: <old name> → <new name>`, as today's
  re-handshake did, and clears the mark by writing a `resume`-acknowledging
  line into the request the spawner accepts as `op: ack` — an op that
  writes no command and only clears the mark. A tab seat that was resumed
  still re-handshakes with `/tanto fukki`, as today.
- Mode for a terminal seat is the request's `auto`. The warning for a Jisso
  whose mode is not `auto` moves from the handshake to the request: Kanri
  writes `auto` and there is nothing to warn about.

**The address** is unchanged: Kanri's is the roster's first data row, read
at the moment of sending; every other seat's is known only to Kanri, from
the result file rather than a handshake. A `SendMessage` to a background
session's name delivers as to an interactive one (the spike, and the probe's
item 1's `pong` session), and the `[ref]` rule stands. The `no-role` second
line stays on every tanto line: a tab seat may still be a bare window, and a
terminal seat, which is never bare, ignores it. What goes is the `no-role`
reply's role as the signal that a window was cleared under a role — for a
terminal seat the signal is the census's `gone`, or a `stop` result.

### 1.8 fukki

`tanto` is fukki (D-3). After an editor restart the terminal seats are still
running — separate processes, unreached by the restart — and only the tab
seats came back renamed; after a reboot or a crash the launcher's step 5
resumes every terminal seat `seats.json` lists as `running` or `blocked`
with `claude --resume <sessionId> --bg` and no other flag. A resumed
background Kanri idles until a line reaches it, so the launcher prints the
one act that is the human's: `claude attach <id>`, then `/tanto fukki`
typed there once. Kanri's fukki reconciles the roster with `seats.json`'s
`renamed` marks and `claude agents --json`, answers the ledger's unanswered
lines, and continues where the Progress line says; it re-runs no definitions
write-out and sends no broadcast. A tab seat's `/tanto fukki` is unchanged
in shape — the re-handshake with the same `transcript=` — and is typed only
in tab seats. `roles/kanri.md`'s "Recovery after a VS Code restart" becomes
this paragraph: the roles to ask the human for are the tab seats whose
work is open, Sekkei and Kaiseki; Kikaku and Hosa are the human's.

## 2. The run without the human's waits

### 2.1 The topic opens; Kanri cuts the branch; the spec kessai

Unchanged: the human names the next work in Kanri's window — by `attach`
now — Kanri derives the slug, checks it against the reserved names, creates
the ledger, and the human opens a Sekkei tab. New: **Kanri cuts the branch**
`<topic>` from `main` at the opening when no batch is in flight, and moves
the shared tree to it; when a batch is in flight, Kanri cuts it right after
the predecessor's merge, before the topic's Keikaku commits the spec. The
orders line's `branch=` names the branch the tree is on; Sekkei's "cut the
branch from `main` … before the spec commit" and Keikaku's "The branch and
the spec commit" lose their cut and keep their commit. The tree sits on
`<topic>` through the spec dialogue, and a hotfix in that window lands on
the topic branch and is named in the close kessai, as the 09-18 file's §4 D
accepted.

The spec kessai — Sekkei's review through its brief, the human's answers by
exception in Sekkei's tab — is unchanged in every step. Sekkei's
`review-ready:` line becomes a ledger event Sekkei writes itself (2.3), and
its `spec accepted:` line stays a message, since Kanri acts on it: it
records the rows, sends `release:`, and writes the `spawn` request for
Keikaku.

### 2.2 The plan stage: Keikaku spawned; the brief written, not waited for

Keikaku is a terminal seat, spawned on `spec accepted:` with the three keys
of 1.6. Its Step 3 and Step 4 are unchanged through the dry run, the
`plan.review` dispatch, its rulings, and the brief writer's dispatch. Then,
instead of asking the human for the one OK:

- it reads every `choose` and `decide` point of the brief and takes the
  point's `— If unanswered:` clause as the answer, every `confirm` point as
  confirmed, and records them in `dialogue.md` in the brief's reply shape
  under the heading `Plan brief — answered by default`, one line per point
  naming the clause taken;
- it writes the ledger event `review-ready: <plan path>; brief: <brief path>`
  through `boundary.js record --event` (2.3) — the human reads the brief
  when they like, and an override is a line in Kanri's window or a Kikaku
  decision file, as any ruling is;
- it commits under its commit rule and sends Kanri the one line
  `plan committed: <plan path>; dryrun: <dry-run path> — <reading>`, as
  today.

Kanri's "When the plan lands" keeps its cold read — the one dispatch, the
numbered message, `coldread answered:` — and its steps 1 to 3. Step 4
becomes: **write the `spawn` request for batch A's Jisso** with
`batch=.tanto/<topic>/batch-A-prompt.md`, the prompt rendered as today with
its addressee slot reading `Jisso <n> of this plan` and no name — the seat
that reads the file is the one the request created, and the Guard paragraph
of `templates/batch-prompt.md` binds it by workspace and branch alone. On a
plan whose Global Constraints say it edits this skill's own files (D-2),
step 4 writes N requests at once, N the rows of the Batches table plus one
for the fix wave, each with `queue=<topic>`, and sends batch A's Jisso the
one line `batch: <path>` as today; the others wait, reading nothing, and
each later batch's prompt goes to the next as a line. Step 5 — the
`queued:` replies — goes; the `queued` rows for D-2's case are written from
the result files.

Keikaku's tenure ends as today at `coldread answered:` — exit proposal
written unasked, `release:` on its form check — except that `release:` to a
terminal seat is a `stop` request, not a line (2.3), and that a Keikaku of a
topic whose spec was a draft persists past the cold read until it has
committed the spec and the plan at their final paths when the checkout
frees (issue-2b9c): its stop follows that commit's verification.

### 2.3 The batch loop: what a boundary sends, and the wake-up floor

The boundary is `tanto-diet`'s: the `boundary.verify` dispatch, the verdict
file, the resident's one `record` call. Three changes:

- **The next prompt is a spawn, not a send.** Loop step 8's "send the one
  line `batch: <path>`" becomes "write the `spawn` request for the next
  Jisso with `batch=<path>`", and the brief's step 5 renders the prompt with
  no addressee name. Under D-2's queue the send stays for that plan.
- **`release:` to a Jisso is a `stop` request.** The row goes `stopped` by
  the resident's `record` call, and the released line to the human goes;
  nothing is `/clear`ed. At the plan close, after `reading.js --share` has
  read every transcript, Kanri writes `rm` requests for the topic's
  stopped Jissos and its Keikaku — `claude rm` removes the session's record
  from `claude agents`, and whether it removes the transcript the plan
  verifies before this step is written (Verification); until then the
  close's step is `stop` only.
- **The commit window is opened only for a peer with a commit waiting.** A
  Sekkei or Keikaku of another topic whose work is ready while a batch runs
  writes the ledger event `commit-ready: <role> <topic> — <subject>`
  through `record --event`; the boundary's `check` prints the events since
  the last boundary, and Kanri sends the "boundary verified — commit" line
  only to a peer with such an event unanswered, and waits for its
  `committed <subject> — <reading>` before the next spawn. A peer with no
  event is sent nothing and answers nothing (issue-c0d0). The `nothing to
  commit` reply goes.

**Peers write fixed bookkeeping lines to the ledger themselves**, through
`node "$TANTO/scripts/boundary.js" record --ledger <path> --event "<line>"`,
which is idempotent and appends one Session events line. The lines are a
closed set — `review-ready: …`, `commit-ready: …`, `shoroku ready: …` is
not one (2.6, a message) — and rule 3 of `SKILL.md` reads: "State in files,
not in memory: the roster and the ledgers. Kanri is their only hand; a
peer appends to a ledger's Session events only through `boundary.js record
--event`, and only the lines its role file names." Everything that Kanri
must act on stays a message. The floor, per batch:

| line | today | under this spec |
| --- | --- | --- |
| a Jisso's handshake, `queued: <n>` | one wake-up, one reply | gone — the request and its result |
| the batch report's path | one wake-up; then the verifier's return | stays: two wake-ups, the decision |
| `release:` and the released line | Kanri's own sends | a `stop` request; no line |
| `committed` / `nothing to commit` at the boundary | one wake-up per live Sekkei or Keikaku | one wake-up per peer with a `commit-ready:` event; none otherwise |
| `review-ready:` (spec, plan) | one wake-up, "do nothing else" | a ledger event, no wake-up |
| `plan committed:`, `coldread answered:`, `spec accepted:` | one wake-up each | stay: Kanri acts on each |
| `human-needed:`, a ruling, `compacted:` | one wake-up | stay |
| the kessai answer | today the human's answer in Hosa's window, then `close done:` | one wake-up: the human's line, by `attach` or a decision file |
| `shoroku ready:` (2.6) | — | one wake-up per close: Kanri lands and verifies |

### 2.4 The close kessai

After the final batch is accepted and the T2 proposal is written (Jisso's,
then Kanri's own, as "The close" step 1 says today), Kanri:

1. dispatches the `shoroku.recommend` kind itself — `subagent_type:
   tanto-shoroku-recommend`, fable — over the `pending` rows' sources and
   the untriaged inbox copies, as "The four steps" step 2 says, and
   form-checks the brief by `grep` as step 3 says (one re-dispatch on a
   failure, pasted as it stands on a second);
2. writes an `attention` request whose message is
   `kessai: <topic> — claude attach <id>`; and
3. prints in its own window the kessai message, in the chat's language:

   ```text
   kessai: <topic> — recommendation <path>; brief <path>; adopt <a>, fix <f>, reject <r>, unsure <u>.
   merge: --no-ff into main, delete the local branch, push nothing.
   Answer OK, or the item numbers that go the other way with your word for each, or a merge override; the brief follows.
   <the brief's text verbatim>
   ```

The human answers in that window — `claude attach <id>`, type, ← back to
the agent view — or through a Kikaku decision file whose third section
names the recommendation and answers it (decision-9cc5), which reaches Kanri
as `decision: <path>`, or by telling a live Hosa, whose chore is then the one
line `kessai answer: <topic> — <the human's words verbatim>` to Kanri. That
one answer is the direction and the merge approval. Kanri writes
`t2-direction.md` item by item, adds the Residency rows to it as today,
records the `S-n` rows' Adopted, and starts two seats (2.5, 2.6). Until the
answer arrives nothing else happens in that topic; the next topic's spec
dialogue is not blocked by it.

Hosa's `close:` and `sweep:` lines, and "Delegation to Hosa", go: the
recommend is Kanri's dispatch, the check is this message, the apply is
shoki's. Hosa keeps the human's chores, the bug intake, the hotfix lane's
edits, and gains the relay above (2.8).

### 2.5 Shusei — the fix batch

When the direction accepts a non-empty `fix` group, Kanri renders
`.tanto/<topic>/batch-shusei-prompt.md` from `templates/batch-prompt.md`
with one task — apply the direction's `fix` items, each a file, the text as
it reads, and the text as it should read, with
`passage-check.js verify` over the result; commit once by explicit path as
`fix: text corrections from <topic>'s close` — and writes a `spawn` request
for a Jisso with `batch=` that path, on `sessions.jisso`. The batch runs as
any batch: one implement, its two reviews, the batch report, the
`boundary.verify` dispatch, the resident's `record` call, `stop`. Its
report's Shoroku proposal section is recorded as any Jisso's; an item it
raises reaches `docs/` at the next topic's close, which is the accepted
consequence of a proposal written after the recommender ran.

Then **Kanri merges**: `git merge --no-ff <topic>` on `main` in the shared
checkout, the local branch deleted, nothing pushed — the default form the
kessai stated, or the override the answer gave. An empty `fix` group merges
on the answer directly. The checkout is free; the next topic lands (its
Keikaku's commit of a draft spec and the plan, Kanri's cut of its branch if
not yet cut) and its batch A request is written.

### 2.6 Shoki — the scribe, in a worktree, after the merge

On the kessai answer, in the same act as shusei's request, Kanri writes
`.tanto/<topic>/shoki-brief.md` from `templates/shoki-brief.md` and a
`spawn` request: `role: shoki`, `worktree: shoki-<topic>`, `addDir: [<root>]`,
`sessions.shoki`'s model and effort (a new key, default `sonnet`/`medium`,
the scribe being a seat that dispatches and runs git), mode `auto`, the
prompt `brief: <that path>`. The worktree is the CLI's, at
`<root>/.claude/worktrees/shoki-<topic>` (already under
`.git/info/exclude`), cut from the tree's HEAD at that moment — the topic
branch's tip after the last batch, which is what "shusei 直前の commit"
names; the `.tanto/worktrees/` location the 09-18 file chose is not taken,
because `claude -w` and `claude rm` own the lifecycle at the CLI's path and
a second location would need a second mechanism.

The brief is shoki's whole contract — the four SDD stop classes, the
`no-role` line, the report line — and its steps:

1. Read, at absolute paths in the main checkout, `t2-recommendation.md`,
   `t2-direction.md`, and the untriaged inbox copies the recommendation
   names; read `docs/AGENTS.md` in the worktree.
2. Dispatch `shoroku.apply` (`subagent_type: tanto-shoroku-apply`, opus) as
   "The four steps" step 4 says — the accepted subset written per
   `docs/AGENTS.md`, every issue opening with its `Source:` line, the Triage
   section of every swept inbox copy filled at its absolute path in the
   main checkout — with the worktree as the only place it writes tracked
   files; run the repository's lint on the changed paths; commit once by
   explicit path as `docs: T2 shoroku for <topic>` on the worktree's branch.
3. Dispatch `shoroku.review` (D-4; `subagent_type: tanto-shoroku-review`,
   opus/medium, the fifteenth kind) over the worktree's diff against `main`,
   the direction, and `docs/AGENTS.md`; it writes
   `.tanto/<topic>/t2-review.md`. On findings, dispatch `shoroku.apply`
   once more with them and commit as `docs: T2 shoroku for <topic>, review
   fixes`; never a third time.
4. `git rebase main` in the worktree. A conflict stops shoki: it aborts the
   rebase, reports `shoroku blocked: conflict on <paths>`, and resolves
   nothing — "コンフリクトは絶対にしない" made true by rule.
5. Check the three conditions: only paths under the six `docs/` types
   changed against `main`; the rebase applied clean; the worktree is clean.
   Then report to Kanri — the roster's first data row, read from the main
   checkout — the one line
   `shoroku ready: shoki-<topic> at <sha> — fast-forward onto main clean — <reading>`,
   and end the turn.

**Kanri lands it.** On that line — one wake-up, as 2.3's table says — Kanri
runs the landing checks on the worktree's tip (the repository's lint on the
changed paths, the frontmatter check, every new or amended issue carrying
`Source:`, every swept inbox copy's Triage filled), fast-forwards `main` to
it — `git merge --ff-only shoki-<topic>` when the shared checkout is on
`main`, `git push . shoki-<topic>:main` when it is on another branch —
writes the `rm` request (which removes the worktree; Kanri then deletes the
branch `shoki-<topic>`, which `claude rm` keeps), marks the `S-n` rows
written, and writes the Events line. A landing check that fails is a
follow-up `docs:` commit through the hotfix lane, never a re-run of shoki.

This amends the second file's §4 in one respect and states why: shoki does
not merge into `main` itself. A `--no-ff` merge commit needs `main` checked
out, and between plans the shared checkout is on `main`, which git refuses
to update from another worktree; a fast-forward from the worktree would
need the same push form and would still be a second seat writing the
branch Kanri alone owns (§4 D). So shoki's "merge" is the fast-forward
Kanri performs on shoki's line, the same act the 09-18 file's §3 step 5
described; Kanri still waits for nothing — it acts when the line arrives —
and the landing is linear, which the whole-branch review's exclusion of the
`docs: T2 shoroku` prefix already assumes. The human's word "完了し次第、
mainに（本物の）マージ" is met in substance: shoki's commits land on `main`
as soon as they are ready, with no conflict ever resolved by a machine.

**The between-plans inbox sweep** runs in the same shape on the human's
word in Kanri's window: the recommend dispatch, the kessai message with no
merge question, an `attention` request, the direction, a shoki spawn whose
brief names the sweep's three files beside the roster and the subject
`docs: inbox sweep <YYYY-MM-DD>`; `fix` items of a sweep are a shusei batch
on `main` with the subject `fix: text corrections from the inbox sweep
<YYYY-MM-DD>`, as today's subjects say, verified by a `boundary.verify`
dispatch against no plan.

### 2.7 The handover without the presence gate

The four signals stand. Signals 3 and 4 fire the handover when read, human
present or not; the `--presence` reading and `ceiling.presence_minutes`
stay as an instrument and a ledger figure, and every rule that acted on them
goes: the deferral clause in the Progress line, the deferral Events line,
the batch prompt's deferral slot, the Measurements deferrals row, the
"declined" clause, and the `present|absent` half of the verdict line's
`ceiling:`. The procedure, at a boundary or between plans:

1. write `.tanto/kanri-handover.md` as today, its "Commands for the human"
   section replaced by one line, `The successor is spawned; nothing is
   typed`;
2. write a `spawn` request for `/tanto kanri` on `sessions.kanri`;
3. idle. Lines that reach the outgoing Kanri from now on are answered as
   today, since the session is alive until stopped, and any it does not
   answer are `unanswered:` events the successor pairs.

The successor's Start finds the handover file — the Handover case — reads
it and the ledger, rewrites the roster's first row with its own name from
`claude agents --json`, its own transcript, today, its model and effort, the
old Kanri's row `replaced`, writes the Events line, deletes the handover
file, and writes a `stop` request for the predecessor's `sessionId`. The
human's next `claude attach` id is the successor's; the launcher prints the
current one, and the kessai's `attention` message carries it.

The "Kept Kanri" case narrows to a `/tanto kanri` typed by the human in an
attached Kanri, and its stale-transcript sub-case goes: a terminal seat has
no `/clear`. The "Second Kanri" case stands (the launcher's step 4 prevents
it; a human who spawns one by hand gets the same stop). The "Resumed Kanri"
case is fukki (1.8). The "Recovery" case is the launcher's resume plus
fukki. The handover between plans and the close's handover (decision-b6cb)
are unchanged in what they write; only the ceremony is the request.

### 2.8 Hosa after this design

Hosa keeps the human's chores under its grant, the bug intake, and the
hotfix lane's edits as Kanri's hand, and gains one relay: the human's
kessai answer spoken in Hosa's tab, sent as
`kessai answer: <topic> — <verbatim>`. It loses the `close:` and `sweep:`
lines, the recommender's and the apply's dispatch, and the direction file;
its Models section keeps `default` only. Its roster row, its `/clear`, and
its compaction rule are unchanged.

## 3. Rule 11, and this plan

This plan edits the skill's own files, and the sessions that run it load the
working tree's copy (rule 11, decision-5c8e). It runs **on the old
mechanism**: the interactive Kanri of today, its create requests, the
hand-queued Jissos, the boundary of `tanto-diet`. Its Global Constraints say:
the authority for the run's sessions is the plan, Kanri's orders line, and
the batch prompts, not the role text on disk; **the safe boundary is the
final one**; no role is started or replaced before it. Three consequences:

- **The launcher and the spawner exist on disk from batch A on but run for
  the first time at this plan's close.** The close's handover (decision-b6cb)
  is where the mechanism changes hands: the outgoing Kanri writes the
  handover file as today, and its "Commands for the human" say
  `tanto`, in the integrated terminal, at the repository root — the
  launcher spawns the first background Kanri, which reads the handover.
  From that Kanri on, every terminal seat is spawned.
- **The role files change in the final batch**, together: `SKILL.md`'s
  Invocation, Handshake, Resuming, Messages, Session exit, and Workspace
  sections; `roles/kanri.md`'s Start, On a handshake, When the plan lands,
  The batch loop, Handover, Shoroku, Session lifecycle; the six other role
  files; the templates that carry a slot. A peer live during this plan — its
  Jissos, a Sekkei of the next topic — holds the old rule until then.
- **D-2 is this plan's own rule as well as the design's.** Every later
  self-editing plan spawns its Jissos at the landing under `queue=`; this
  one queues them by hand, as the last plan to do so.

## 4. File by file

### 4.1 `skills/tanto/SKILL.md`

- **The roles table**: Kanri's Owns column gains "the spawn, stop, and
  attention requests, the kessai"; Jisso's Count column reads "1 live per
  topic, spawned per batch — a self-editing plan's all at its landing";
  Hosa's Owns loses "the close's recommend, check, and apply" and gains "the
  kessai relay".
- **Invocation**: `/tanto <role> [<key>=<value> …]`; the address argument
  and its bootstrap sentence go; the keys of 1.6 are listed; `fukki` stays
  as the tab seat's word, and the section says a terminal seat is resumed
  by the launcher.
- **Start sequence**: unchanged for the checks and the definitions
  write-out; the Handshake step reads "a tab seat handshakes; a spawned seat
  does not".
- **Handshake and roster**: the first paragraph names the two kinds; the
  handshake line gains `topic=`; the roster paragraph names `stopped` and
  the result file as a terminal seat's identity source; "The address"
  loses the command-line-argument sentence.
- **Resuming**: replaced by 1.8's text, with the third file's §6 table.
- **Messages**: `release: /clear this window` is a tab seat's line, a `stop`
  request a terminal seat's; the boundary reply bullet gains the
  `commit-ready:` event; the `review-ready:` bullet becomes an event.
- **Session exit**: the close runs propose, recommend, kessai, apply — the
  kessai in Kanri's window, the apply by shoki; the "When a Hosa is live"
  paragraph and the between-plans `sweep:` line go, replaced by 2.4 and
  2.6's sweep paragraph.
- **Artifacts**: rows for `.tanto/spawner/` (`pid`, `log`, `seats.json`,
  `requests/`, `results/`), `.tanto/<topic>/shoki-brief.md`,
  `.tanto/<topic>/t2-review.md`, `.tanto/<topic>/batch-shusei-prompt.md`,
  `.claude/worktrees/shoki-<topic>` (the CLI's, never written by a role),
  `templates/shoki-brief.md`, `templates/spawn-request.md`; the counts
  "Fifteen of them" → seventeen, "three executables" → five, with
  `tanto.js` and `spawner.js` described; `.tanto/` reserves `spawner`.
- **Rules**: rule 3 as 2.3 rewrites it; rule 4's "one live Jisso per
  topic, the plan's other Jissos queued" → "spawned per batch, or all at the
  landing under D-2"; rule 11 gains the D-2 paragraph and loses its
  "started at its landing and rotate" paragraph.
- **Workspace**: "Kanri alone cuts, switches, merges, and deletes the
  branch"; the worktree sentence gains shoki's exception.
- **The expected-model config**: fifteen kinds, `shoroku.review` named;
  `sessions.shoki`; `ceiling.presence_minutes` described as informational.

### 4.2 `skills/tanto/roles/kanri.md`

- **Start**: step 1 loses its `ListAgents` self-check sentence for the name
  and reads the name from `claude agents --json` by its own `sessionId`
  (the transcript path's basename); step 3's bootstrap row is written the
  same way; the five cases as 2.7 rewrites them.
- **On a handshake**: "a tab seat's handshake" throughout; the Jisso and
  Keikaku bullets go; the Sekkei bullet gains `branch=` as the branch the
  tree is on after Kanri's cut.
- **When the plan lands**: step 4 and 5 as 2.2.
- **The batch loop**: step 8 as 2.3; the commit window as 2.3; the deferral
  lines go.
- **The final batch**, **Shoroku**: "The close" as 2.4 to 2.6;
  "Delegation to Hosa" goes; "The four steps" step 3 is the kessai, step 4
  is shoki.
- **Handover**: as 2.7; "The residency line" loses "followed by the
  numbered commands from the handover file".
- **Session lifecycle**: the numbered create request goes; "Create",
  "Replace", "Release" are rewritten as request tables — When → the request
  Kanri writes; "Readings" unchanged; "Recovery after a VS Code restart" as
  1.8.

### 4.3 The other role files

- `roles/sekkei.md`: the cut sentence goes; `review-ready:` is an event;
  the handshake's `topic=`.
- `roles/keikaku.md`: "The branch and the spec commit" keeps the commit and
  loses the cut; Step 4 item 6 as 2.2; the Start reads the three keys;
  `review-ready:` is an event; the persistence rule of 2.2's last sentence.
- `roles/jisso.md`: "Start" reads `batch=` or `queue=` and sends no
  handshake; "T2 and the exit" loses "`release:`" as a line and says the
  seat is stopped; a "Shusei" paragraph names the one-task batch.
- `roles/hosa.md`: as 2.8, in the same batch as `roles/kanri.md`'s close:
  the "Whose work you take" paragraphs **The close's** and **The inbox
  sweep's** are removed whole, "Not yours" loses its recommendation, brief,
  and direction sentence, "Lifecycle" loses the `close:` / `sweep:` clauses
  and the closing-line sentence about the direction file, and "Models"
  keeps `default` alone — no sentence of the close protocol is left beside
  the new one (I-1).
- `roles/kaiseki.md`, `roles/kikaku.md`: the handshake's `topic=`; no other
  change.

### 4.4 Templates

- `templates/spawn-request.md` — new, 1.4's schema as a documented example:
  the JSON in a fence, each field explained beside it, since JSON carries
  no comments.
- `templates/shoki-brief.md` — new, 2.6's steps as a brief in the shape of
  `templates/boundary-brief.md`: the arguments, "What you never do", the
  procedure, the report line.
- `templates/batch-prompt.md` — the title's `to <name> [<ref>]` becomes
  `Jisso <n> of this plan`; the Guard paragraph binds by workspace and
  branch; the deferral slot goes; the `Kanri — <name> [<ref>]` line stays,
  written from the roster's first row at render.
- `templates/boundary-brief.md` — the reply line's `ceiling: under|over`
  only; step 5 renders no addressee and, under D-2's queue, names the next
  `queued` row as today; `record` gains `--seat <results path>`.
- `templates/kanri-handover.md` — "Commands for the human" is one line;
  Live peers' `queued` paragraph is D-2's case only.
- `templates/roster.md` — the keeping rule names the two kinds, the result
  file, `stopped`, and the `renamed` reconciliation.
- `templates/kanri.md` — the Measurements deferrals row goes; a
  `spawner results moved` line in the close's Progress vocabulary.
- `templates/tanto.json` — `subagents.shoroku.review: {opus, medium}`,
  `sessions.shoki: {sonnet, medium}`.
- `templates/agent.md` — unchanged; the fifteenth definition renders from
  it.

### 4.5 Scripts

- `scripts/tanto.js`, `scripts/tanto.bat`, `scripts/tanto.sh` — new (1.2).
- `scripts/spawner.js` — new (1.3, 1.5), with `notify --stdin`.
- `scripts/boundary.js` — `record` accepts `--status … stopped` and
  `--seat <results path>`; `check` prints the ledger's Session events since
  the last boundary under a fixed heading.
- `scripts/reading.js` — unchanged; the `--presence` switch stays as an
  instrument.
- Tests beside each: `tanto.test.js` and `spawner.test.js` with a fake
  `claude` on `PATH` (a Node script that records its arguments and prints
  what the CLI prints), so that no test spawns a real session.

### 4.6 `skills/tanto/README.md`

"Usage" is rewritten: install the wrappers on `PATH`; `tanto` in the
integrated terminal at the repository root; `claude attach <id>`; the tab
seats by `/tanto <role>`; `tanto down`; the hook, optional. The
"Prerequisites" section names Node 22 or later and Claude Code CLI 2.1.277
or later (`--bg`, `agents --json`, `attach`, `--resume … --bg`). The
Claude Code only sentence gains "and its CLI's background sessions".

### 4.7 `docs/requirements/04f5-tanto.md`

Rewritten as "Requirements" below says; the close's apply writes it, since
requirements live under `docs/`.

## Where each change lives

| Change | Files | Section |
| --- | --- | --- |
| launcher | `scripts/tanto.js`, `tanto.bat`, `tanto.sh`, `tanto.test.js`, README | 1.2, 4.5, 4.6 |
| spawner, notice, hook one-shot | `scripts/spawner.js`, `spawner.test.js`, `templates/spawn-request.md` | 1.3–1.5 |
| invocation grammar, no handshake for spawned seats, `topic=` | `SKILL.md`, every role file | 1.6 |
| identity, roster, `stopped`, `--seat` | `SKILL.md`, `templates/roster.md`, `scripts/boundary.js`, `templates/boundary-brief.md` | 1.7 |
| fukki | `SKILL.md`, `roles/kanri.md`, README | 1.8 |
| Kanri cuts the branch | `SKILL.md` Workspace, `roles/kanri.md`, `roles/sekkei.md`, `roles/keikaku.md` | 2.1 |
| plan brief not waited for, Keikaku spawned | `roles/keikaku.md`, `roles/kanri.md` | 2.2 |
| spawn instead of send, stop instead of release, commit-ready, events by peers | `roles/kanri.md`, `SKILL.md` rules and Messages, `roles/sekkei.md`, `roles/keikaku.md`, `templates/boundary-brief.md` | 2.3 |
| kessai | `roles/kanri.md`, `SKILL.md` Session exit, `roles/hosa.md` | 2.4, 2.8 |
| shusei | `roles/kanri.md`, `roles/jisso.md`, `templates/batch-prompt.md` | 2.5 |
| shoki, `shoroku.review`, `sessions.shoki` | `templates/shoki-brief.md`, `templates/tanto.json`, `SKILL.md` config and Artifacts, `roles/kanri.md` | 2.6 |
| handover without the gate | `roles/kanri.md`, `templates/kanri-handover.md`, `templates/batch-prompt.md`, `templates/boundary-brief.md`, `templates/kanri.md` | 2.7 |
| rule 11 and D-2 | `SKILL.md` rules, the plan's Global Constraints | 3 |

## Old values this plan contradicts

Quoted as they read on 2026-09-20, with the file and, where read, the line.

- `SKILL.md` 34: `` `/tanto <role> [<address>]`, or `担当して <role>` / `tantoして <role>`. ``
- `SKILL.md` 27: `| Jisso (実装) | 1 live per topic, the plan's others queued | …`
- `SKILL.md` 82–83: "Kanri skips the handshake and runs the start sequence in `roles/kanri.md` instead. Every other role does the handshake below."
- `SKILL.md` 312: "A Sekkei, Keikaku, or Jisso started with no address on the command line reads the first data row of `.tanto/roster.md`, which is Kanri's own row, for it …"
- `SKILL.md` 538: "`/tanto fukki`, typed by the human in a window, and the self-check every role runs at each of its boundaries are the same act: run `ListAgents` once; find the roster row whose Transcript column is this session's own transcript path …"
- `SKILL.md`, Messages: "**`release: /clear this window`** is the line that ends every exit, sent by Kanri right after the seat's proposal passes its form check, and the last line that name is ever sent"
- `SKILL.md` 868: "When a Hosa is live, steps 2 to 4 are its: Kanri sends one line, `close: <topic> — …`"
- `SKILL.md` 1002: "Templates are copied and filled, never restated in prose. Fifteen of them:"
- `SKILL.md` 1011: "The skill also ships three executables."
- `SKILL.md` 1058: "3. State in files, not in memory: the roster and the ledgers. Memory holds at most a pointer to them."
- `SKILL.md`, Workspace: "Sekkei, or Keikaku when the spec was a draft, cuts the branch from `main` before the first commit, named after the topic"
- `SKILL.md`, Rule 11: "The plan's Jissos are all started at its landing and rotate one per batch, which is neither a replacement nor a creation under this rule"
- `roles/kanri.md`, Handover: "**Signals 3 and 4 fire a handover only when the human is present.** Run `reading.js` on your own transcript with `--presence` at the check where the signal fired."
- `roles/kanri.md`, Handover: "The reason is that a handover is complete only when the human creates the successor, and the successor is what sends the next batch prompt"
- `roles/kanri.md`, Session lifecycle: "The human is the only actor who can give a window a role or take one away, and you are the only role that asks. … Every create request is this numbered list, which the human can paste:"
- `roles/kanri.md`, When the plan lands, step 4: "Ask the human to queue the plan's Jissos, as the Create table below prescribes: N windows …"
- `roles/kanri.md`, When the plan lands, step 5: "Answer each handshake `queued: <n>` with a `queued` row."
- `roles/kanri.md`, Delegation to Hosa: "When the roster has a `live` Hosa row at a close, steps 2 to 4 are Hosa's."
- `roles/kanri.md`, Recovery after a VS Code restart: "Every window is resumed at once rather than recreated, and the human types `/tanto fukki` in your window first …"
- `roles/sekkei.md`, Step 1: "When Kanri's orders line says no batch is in flight, cut the branch from `main`, named after the topic, **before** the spec commit"
- `roles/keikaku.md`, The branch and the spec commit: "Cut the branch from `main`, named after the topic, and commit the spec at the final path the orders line names"
- `roles/keikaku.md`, Step 4 item 6: "Then put the brief's text verbatim in your request for the one OK, with both paths, and record the answers in `dialogue.md` in the brief's reply shape. On the human's OK, commit under your commit rule below."
- `roles/jisso.md`, Start: "You have done the model check and sent the handshake. Kanri answers `queued: <n>` — your place in this plan's queue — and nothing else until your batch prompt."
- `roles/hosa.md`, Whose work you take: "**The close's.** Sent as one line, `close: <topic> — …` — this is the topic's one shoroku stage, and you run its three dispatched steps while Kanri goes on."
- `templates/batch-prompt.md` 1: "# Batch <X> — tasks <N> to <M> — to <name> [<ref>], Jisso <n> of this plan"
- `templates/boundary-brief.md`, The reply: "`ceiling: under|over, present|absent`"
- `templates/kanri-handover.md`, Commands for the human: "1. /clear this window. 2. /model <family> and /effort <level> … 3. /tanto kanri"
- `templates/roster.md` 3: "Kept by Kanri at `.tanto/roster.md`. Kanri is the only writer." (kept true; the sentence gains "from the spawner's result files for a terminal seat")
- `README.md`, Usage: "Open one session per role and run `/tanto <role>` in each"
- `docs/requirements/04f5-tanto.md`: the bullets "Requirements" below rewrites.

## Requirements

Edits to `docs/requirements/04f5-tanto.md`, req-04f5, written by the close's
apply. The original wording is English, the chat's language is Japanese; the
brief's third section carries a reference translation where it asks about
one.

- **Rewrite** "Roles in separate sessions, at the human's hand" as **"Roles
  in separate sessions; the human opens the seats that talk to them, the run
  starts the rest."** Each role is its own session on the same repository
  and branch. A seat whose work is dialogue with the human is opened by the
  human in the editor; every other seat is started, stopped, and resumed by
  an instrument of the skill's that runs outside any Claude session, on a
  request the run writes to a file, so that no session issues a
  session-creating command and the human opens no window for a machine
  seat.
- **Rewrite** "The human is interrupted only at defined checkpoints" as:
  the spec dialogue and its kessai; the close kessai — the recommendation,
  the merge decision, and the merge's form as one question, answered by
  exception; a batch boundary only for the stop classes of subagent-driven
  development and a scope or spec change; and a seat that blocks on a
  prompt only the human can answer. The plan's brief is written for the
  human to read and is not waited for. Beyond those, the human is asked
  only to confirm the items a compaction summary attributes to them, to
  settle a question Kanri cannot decide alone, and to give, at a plan close,
  a figure only their account view shows.
- **Rewrite** the last clause of "A seat stays under an operating context
  ceiling the run chooses": "… and the run's response to crossing it is a
  handover that needs no one present, since the successor is started by
  the run."
- **Rewrite** "A session resumed under a new name rejoins the run as easily
  as possible" as **"A run is resumed with one command, and a session's
  identity survives its renaming."** The identity is the session's id, read
  from the CLI; the human's part after a restart is one command and, for
  the resident, one word in its terminal.
- **Retire** "The sessions a plan needs are opened while the human is
  present" and **replace** with **"A seat is started when its work
  exists."** An executor is started for one batch when that batch's prompt
  exists, and stopped at its boundary; the one exception is a plan that
  edits the skill the seats read, whose executors are all started at its
  landing and wait, reading nothing, so that every one of them read the
  same skill.
- **Narrow** "A run's windows are reused, not multiplied" to the seats the
  human opens.
- **Add** **"The human reaches any seat from the editor."** A machine seat
  is reachable from the editor's integrated terminal by the CLI's own
  attach; the editor extension's session list is not a premise, because its
  binary and the CLI's drift.
- **Add** **"The run tells the human when it needs them."** A seat that
  blocks, and a kessai that waits, raise a notice on the machine without the
  human configuring anything; a harness hook may be added for immediacy and
  is never required.
- **Add** **"A repository that uses tanto carries nothing of it."** The
  launcher and the spawner ship with the skill; a consuming repository's
  tree holds only the untracked state directory.
- **Add** to "Docs are kept current as part of the flow": "The write-out
  leaves the critical path: the product's fixes land before the merge, the
  records after it, and the records are verified at their landing."
- **Amend** "Claude Code only, and says so" with "and its CLI's background
  sessions, which the documentation names with the version that first
  carried them."

## The ADRs

Written by the close's apply under `docs/decisions/`, each with the
`amends` links named.

1. **The spawner is the only process that runs `claude --bg`, `stop`, and
   `rm`; a session writes a request file.** The auto-mode classifier refuses
   a session-issued `claude --bg "/tanto …"` as unsafe agent creation, and
   the design uses the front door or a process the classifier does not
   judge, never a disguise. Rejected: a settings allow rule the human places
   per repository; a prompt shape that slips past.
2. **Two kinds of seat, drawn by whether the seat's work is dialogue with
   the human.** Terminal seats are spawned and visited by `attach`; tab
   seats are opened by the human. Kaiseki is a tab seat for its brief's
   dialogue. The extension's "Activate session" is not a premise (probe item
   8, CLI 2.1.277 against the bundled binary one release behind). Amends
   decision-1ab5's seat descriptions.
3. **The launcher ships with the skill, never with a consuming project, as
   one command that is also fukki.** Rejected: a script in the project's
   `scripts/`; two commands; a listing subcommand (`claude agents` is the
   view). D-3.
4. **Kessai: two signing sites, and the plan brief is written and not
   waited for.** Five plan reviews, zero edits, one explicit decision; the
   spec review decides things and stays. The close kessai is one question
   in Kanri's window carrying the recommendation, the merge decision, and
   the merge's default form. Rejected: apply first and review at the merge.
   Amends decision-ace0 (the brief's answers are the confirmation — for the
   plan, the defaults are the answers) and decision-a1ae.
5. **Shusei before the merge, shoki after: the product is verified before it
   lands, the records at their landing.** The `fix` group is a Jisso batch
   of one task; the docs write-out is a brief-driven seat in a worktree —
   the one worktree the design admits, because a scribe holds no runtime
   resource. Shoki reports `shoroku ready:` and Kanri fast-forwards `main`,
   because a merge commit needs `main` checked out and Kanri alone owns the
   branch. Rejected: a `shusei` role; the docs commit on the topic branch
   before the merge; shoki resolving a conflict. Amends decision-83aa,
   decision-ce83, decision-1f5f; supersedes decision-a1ae.
6. **Spawned seats do not handshake; identity is the `sessionId`; the
   roster stays Kanri's, written from the spawner's result files.**
   Rejected: the spawner appending roster rows (two writers, one file).
   Amends decision-73c3 and decision-ded8.
7. **The handover fires on its signal without a presence gate; the
   successor is spawned.** The gate existed for the hands the design
   removes, and it read `absent` at eighteen boundaries in a row. Amends
   decision-eee2 and decision-de63.
8. **A wake-up is spent only on a decision: fixed bookkeeping lines go to
   the ledger through `boundary.js record --event`, written by the peer.**
   The set is closed and named in the role files; everything Kanri acts on
   stays a message. Amends rule 3's "Kanri is the only writer".
9. **Kanri alone cuts, switches, merges, and deletes the branch.** From the
   09-18 file's §4 D. Sekkei and Keikaku commit on the branch the tree is
   on.
10. **A plan that edits the skill spawns all its Jissos at the landing;
    every other plan spawns one per batch.** D-2. Rejected: a pinned skill
    snapshot (no per-session load path without moving the shared symlink);
    the authority clause alone. Amends decision-ea95, decision-76a6,
    decision-5c8e.
11. **The spawner is the notifier; the hook is optional.** D-1. A census of
    `claude agents --json` toasts on `blocked` and on an `attention`
    request; nothing is placed in settings by the run.
12. **`shoroku.review` is a step in shoki's brief, a fifteenth kind on
    opus/medium.** D-4: the one seat that lands unattended gets a review
    before its landing. Amends decision-0352.

## What the plan must contain

- Global Constraints: rule 11's authority sentence; the safe boundary is
  the final one; this plan's Kanri runs today's mechanism and its close's
  handover commands say `tanto`; the D-2 statement that this is the last
  plan to queue its Jissos by hand.
- Batch A — the instruments: `spawner.js` with its ops, census, guard, and
  notice, `tanto.js` and the two wrappers, `templates/spawn-request.md`,
  their tests with a fake `claude`; `templates/tanto.json`'s two keys.
- Batch B — the verifications below, each a measurement task with its
  report under `.tanto/<topic>/`, run by hand against a real CLI, none of
  which touches a role file; the spawn path's prompt form settled and
  written into `templates/spawn-request.md`.
- Batch C — `boundary.js` (`stopped`, `--seat`, the events in `check`),
  `templates/boundary-brief.md`, `templates/batch-prompt.md`,
  `templates/kanri-handover.md`, `templates/roster.md`, `templates/kanri.md`,
  `templates/shoki-brief.md`.
- Batch D — the final batch: `SKILL.md`, the seven role files, README, in
  one batch, with the `O` rows for every retired term measured over every
  path.
- The whole-branch review and its fix wave, as every plan.
- How a batch is verified: `node --test` over the five scripts' tests;
  `passage-check.js verify` over the plan's passages; the `O` rows' zero
  counts for `create request`, `queued: <n>`, `present|absent`,
  `close: <topic>`, `sweep: inbox`, `/tanto <role> [<address>]`; the
  fifteen definitions rendered in a fresh session's start line.

## Verification

Measured in batch B, each with the command typed and the answer in one
line, before any role file changes:

1. **A `--bg` initial prompt of `/tanto kanri` invokes the skill** — or the
   fallback prompt of 1.6 does. Run through the spawner, never from a
   session; a fresh roster in a scratch clone.
2. **A real Jisso batch under `--permission-mode auto` stays in the single
   tree** (issue-aa37): a `--bg` session spawned by the spawner runs one
   Write, one Edit, one Bash commit in the repository root, and
   `claude agents --json` reports its `cwd` as the root throughout. The
   guard of 1.3 is exercised by a session spawned with `manual` and a gated
   Write, which the probe showed lands under `.claude/worktrees/`.
3. **The Windows toast shows without a module**, and the macOS and Linux
   commands are documented as untested on this machine.
4. **A terminal seat survives the closing of the integrated terminal that
   ran `tanto`**, and the spawner too; after a reboot, `tanto` resumes a
   stopped seat under the same `sessionId` (probe item 6 measured
   `stop` → `--resume --bg`; the reboot is new).
5. **`claude rm` and the transcript**: whether the file under
   `projects/<slug>/` survives `rm`; the close's `rm` step is written only
   if `reading.js --share` can read it after, else the close stops at
   `stop`.
6. **`git push . shoki-<topic>:main` from the worktree while the shared
   checkout is on another branch**, and `git merge --ff-only` when it is on
   `main` — the two landing forms of 2.6.
7. **`SendMessage` to a background session by the name `ListAgents`
   prints**, and its `[ref]`, from a tab seat and from Kanri — the spike
   measured one direction with a plain prompt; this measures a seat that
   ran `/tanto`.

## Out of scope

- Agent Teams as a host; local backends for `subagents.<kind>`; shape 3, the
  deterministic conductor; psmux; `--brief` and `SendUserMessage`.
- The extension's "Activate session" failure (issue-7607): recorded, not
  relied on, not fixed here.
- The token weight of a wake-up — `tanto-diet`'s work, landed; this spec
  lowers the count.
- Changing the ceilings, the families, or the efforts in `tanto.json`
  beyond the two new keys.
- The superpowers skills.

## Issues this design closes

Each term grepped once across `docs/issues/open/` (Measured 7).

- **issue-629b** (a Jisso spawned per batch reads the previous batch's
  edits) — D-2, ADR 10.
- **issue-aa37** (the ad hoc worktree) — the guard of 1.3 and Verification
  2; closes when the measurement passes, and stays open with the guard as
  its interim otherwise.
- **issue-1a9a**, **issue-caba**, **issue-b409** (the presence gate's gaps,
  the trigger's disagreement with Timing, the mid-turn message invisible to
  `--presence`) — the gate goes, ADR 7.
- **issue-d92f** (the transcript-path identity under a config-dir change) —
  identity is the `sessionId`, 1.7.
- **issue-43a8** (a handshake without a topic field) — the `topic=` field,
  1.6.
- **issue-c0d0** (a draft-only Sekkei woken at every boundary) — the
  commit window opens only on `commit-ready:`, 2.3.
- **issue-bb8c** (a `checkout free:` broadcast racing two queued Keikaku
  sessions) — there is no queued Keikaku; the next topic's Keikaku commits
  when Kanri has merged and cut, 2.2 and 2.5.
- **issue-2b9c** (a queued topic's Keikaku must persist past
  `coldread answered:`) — 2.2's persistence rule.
- **issue-7607** (the extension's Activate session) — closed as not a
  premise, ADR 2; the two version numbers stay in the ADR's rationale.

Kept open, named so that the plan does not pick them up: issue-bed3 (a
fukki that finds an un-consumed handover — the successor is now spawned on
the request, and the file is consumed by it; the case where the request was
never written is a Kanri that died mid-handover, which fukki's Recovery
still infers), issue-322d, issue-26ef, issue-0b5f (the queued-topic
mechanics are unchanged here), issue-fab7, issue-f5d8 (the handover file's
tree assertion and Live peers placement — the file shrinks and the plan may
touch them, but this spec does not rule on them).

## Answers to the spec inputs

- **I-1** (Hosa's answer to the §2.8 passage check, relayed by Kanri):
  no open obligation of Hosa's is touched; its completeness note — that
  `roles/hosa.md`'s close section becomes dead text under this design and
  must be rewritten or removed in the same change — is taken: 4.3 names
  the four sections of `roles/hosa.md` that change and puts them in the
  batch that rewrites `roles/kanri.md`'s close, so that no stale sentence
  stands beside the new procedure. The relay itself is the one
  `kessai answer:` line 2.8 gives Hosa.

## Deferred items

- The second file's `--brief` / `SendUserMessage` as a notice channel.
- A dashboard of seats beyond `claude agents`'s own view.
- Agent Teams' shared task list as a roster and ledger replacement.
- A pinned skill snapshot per plan, should a load path per session appear
  in the CLI.
- The reboot-survival question for background sessions if Verification 4
  answers no: `tanto` resumes them either way, and the open question
  becomes whether anything is lost between the crash and the resume.

## Shoroku proposal from this spec work

This section excludes the spec, the spec review, and the dialogue, which
the close's recommender reads for itself.

1. `claude attach --help` (CLI 2.1.278) documents the detach — "← returns
   to agent view, Ctrl+Z drops back to your shell. The session keeps running
   either way" — which closes the third Kikaku file's §6 open question
   without a probe.
2. `claude agents` without `--json` requires a TTY; a session's Bash tool
   gets the refusal text, so the TUI view is the human's only.
3. `.git/info/exclude` in this repository excludes `.claude/tanto.json`,
   which is the local form of the repository's "committed or ignored"
   decision for the project config, worth a note beside decision-9a3a.
4. The third Kikaku file's wake-up table called the boundary's `committed`
   reply "droppable — read from `git log`"; the reply gates the next
   prompt, so it is kept for peers with a `commit-ready:` event and dropped
   for the rest — the refinement, and the reason.
5. The second Kikaku file's §4 had shoki merge into `main` itself; the
   design has Kanri fast-forward on shoki's line, because a merge commit
   needs `main` checked out and the branch has one owner — a rejected
   alternative with its reason, for the ADR.
6. The spawner's census polls `claude agents --json` every fifteen seconds;
   the cost of that process on the machine is unmeasured and worth one line
   in the dogfood report.
7. The launcher spawns the first Kanri through the spawner rather than
   directly, so that the rule "the spawner is the only process that runs
   `claude --bg`" has no exception a reader has to remember.
8. A fact for the report: the probe's `--permission-mode auto` was never
   accepted or refused by the CLI, since the classifier stopped the process
   first; `claude --help` on 2.1.278 lists `auto` among the six modes.
