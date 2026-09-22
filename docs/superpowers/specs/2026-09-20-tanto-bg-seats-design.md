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
- **One decided item is reversed with the human's word, and named.** The
  third file's §3 had the spawner append the roster's identity rows itself;
  this spec has it write result files and keeps Kanri the roster's only
  writer, so that one file has one writer (1.3, 1.7). The reviewer flagged
  the reversal (S-1) and the human accepted it (dialogue Q6, D-6); ADR 6
  carries both sides. The second file's §4 self-merge is amended the same
  way (2.6, S-2, D-6).
- **Standing decisions this spec amends, and names — the one list; "The
  ADRs" points here.** decision-eee2 (the handover fires on a derived
  ceiling gated on the human's presence) loses its gate; decision-de63
  (Kanri resident with a handover) keeps its event and gets a spawned
  successor; decision-b6cb (Kanri hands over at every plan close) loses its
  clause "the human creates the successor and deletes the old session" and
  its close sequence gains the kessai, shusei, and shoki; decision-5ec7
  loses "one create request at the plan's landing and one `release:` per
  seat"; decision-ea95 (one fresh Jisso per batch from a queue of N filled
  at the landing) keeps its rotation and loses the queue for every plan but
  a self-editing one; decision-76a6 (a queued Jisso reads nothing until its
  batch prompt) narrows to that case; decision-6930 (retired Jissos are
  released at their boundary) stands as stop-at-boundary with its reason —
  "a released window is the queue's next seat" — superseded; decision-0ea5
  (`release:` follows the form check directly) keeps its timing and changes
  its mechanism to a `stop` request for a terminal seat, and its consequence
  about decision-a1ae no longer applies; decision-a1ae (the close's
  recommend, check, and apply are a live Hosa's) is **superseded by ADR 5**
  — the recommend is Kanri's dispatch, the check is the kessai in Kanri's
  window, the apply is shoki's; decision-ce83 (the write-out is applied
  from files by a dispatch) keeps its files and moves the dispatch into
  shoki; decision-83aa (a `fix` group with a commit of its own) keeps its
  commit, made by shusei, and its consequence "a `fix` lands unreviewed by
  a subagent" closes; decision-1f5f loses its first preservation point —
  the human's approval of the plan — and decision-ace0 its confirmation
  clause for the plan brief (2.2); decision-2b1a's `review-ready:` line
  becomes the author's ledger event (2.3); decision-73c3 (born names) loses
  its command-line channel for Kanri's address and decision-0775 its
  bootstrap-argument clause (1.6), the roster's first row standing as the
  one route, its name now the harness's for a background seat;
  decision-ded8 (the clear rule is every role's) gains `stopped` beside
  `cleared`; decision-1ab5's seat descriptions gain the two kinds;
  decision-5c8e (a self-editing plan runs on the skill it edits) gains D-2's
  rule; decision-0352 (the shoroku kind is two kinds) gains a third,
  `shoroku.review`. Serves req-04f5 "Model discipline" (no model moves; a
  new kind carries its own model and effort, decision-03f9).

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
6. `reading.js` exports exactly `readTranscript`, `loadCeiling`,
   `ceilingOf`, and `main` (`module.exports` at line 464); its config
   helpers `readJson` (48), `configDir` (57), `configPathOf` (61), and
   `projectConfigPathOf` (70) exist unexported, and `loadCeiling` returns
   the ceiling map, not `sessions`. The launcher therefore needs one export
   added (4.5), not a copy. `boundary.js record` validates `--status` as
   ending in `live`, `cleared`, or `queued` (line 557), so the new status
   `stopped` is a change to that check; `record --event` without `--batch`
   appends the bare text and dedupes by text (379–382), so a peer-written
   event needs a discriminator (2.3).
7. Open issues that name a term this design retires, one grep per term:
   `presence` 6 (1a9a, 261c, 40ed, b409, c204, fab7); `fukki` 8; `queued`
   16; `create request` 2 (1a9a, 909c); `Activate session` 1 (7607);
   `.claude/worktrees` 1 (aa37); `kanri-address` 4 (40ed, 894d, 9d84, f5d8,
   all already retired by tanto-diet); `checkout free` 2 (2b9c, bb8c);
   `spawn` 3 (629b, aa37, f1a4). "Issues this design closes" rules on
   each, and on four more the greps did not surface (caba, 43a8, c0d0 by
   their titles; d92f from the `fukki` grep), named there with their
   provenance.

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

1. Read the three-layer `tanto.json` for that root through
   `reading.js`'s new export `loadSessions(root)` (4.5), for
   `sessions.kanri`'s family and effort.
2. Make sure `<root>/.tanto/`, `.tanto/.gitignore` (`*`), and
   `.tanto/.markdownlint-cli2.yaml` exist, writing each only when absent —
   the same two files Kanri's Start step 2 writes; the launcher runs before
   any Kanri exists.
3. Start the spawner (1.3) for that root when `.tanto/spawner/pid` names no
   live process: a detached child (`detached: true`, `stdio` to
   `.tanto/spawner/log`, `windowsHide: true`, `unref()`), cwd the root.
4. Find Kanri. **When `.tanto/kanri-handover.md` exists, write the `spawn`
   request regardless of the roster**: the `live` first row is the outgoing
   Kanri — an interactive one at this plan's close (section 3) — and the
   successor marks it `replaced`. Otherwise: a `live` first data row of
   `.tanto/roster.md` whose `sessionId` (1.7) `claude agents --json --cwd
   <root>` lists **as `kind: background`** is the running Kanri; a first
   row the listing shows as an interactive session is reported in one line
   ("Kanri is an interactive tab; hand over first") and not attached to.
   When the first row's `sessionId` is in neither listing but the
   spawner's own `seats.json` (1.3) holds it as `running` or `blocked` —
   the reboot or crash case, unreached by `claude agents --json` until the
   spawner's own resume brings it back, 1.8 — write a `resume` request for
   it, never a `spawn`, and wait for its result the same way. Only when the
   first row's `sessionId` is in neither `claude agents --json` nor a
   `running`/`blocked` `seats.json` entry does step 4 write a fresh `spawn`
   request (1.4) for `/tanto kanri` on `sessions.kanri`'s family and
   effort, permission mode `auto`, and wait for its result file, up to
   sixty seconds.
5. When the spawner's `seats.json` (1.3) lists a **terminal seat other
   than Kanri** with status `running` or `blocked` whose `sessionId` is
   not in `claude agents --json`, write a `resume` request for each — the
   editor-restart or reboot case, 1.8; step 4 already resumed Kanri, if
   resuming was what it needed. A `stopped` seat is not resumed.
6. Print, in English (a script has no chat language), the one line the
   human needs: `claude attach <id>` for the running, resumed, or new
   Kanri, and, on any resume (Kanri's at step 4, or another seat's at step
   5), the second line "then type `/tanto fukki` there once".

`tanto down [<root>] [--seats]` — stop the spawner (its pidfile, then the
process); with `--seats`, first write a `stop` request for every terminal
seat `seats.json` lists as running and wait for the results. Every
conversation is kept, on the same terms a `stopped` seat's always is
(issue-12d3) — but a `stopped` seat is not resumed by step 5, so
`tanto down --seats` retires the whole run: the next `tanto` finds no
running Kanri and no handover file, and step 4 writes a fresh `spawn` for
one against whatever the roster's first row still names.

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
  block; a seat the spawner did not stop that the listing lost is marked
  `gone` with the time — a `stopped` seat is exempt, whatever the listing
  shows for it (Verification 8); a known `sessionId` under a new `name`
  gets the new name and a `renamed` mark that Kanri reads (1.7). The census
  is the only place the spawner reads the CLI's list; the roster it never
  reads and never writes (D-6, S-1).
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
| `stop` | `claude stop <id>` — the short id, mapped from the request's `sessionId` through `seats.json` when the CLI takes only that form (Verification 8) | `stopped: <time>`; the conversation is kept |
| `rm` | `claude rm <id>`, the same mapping — written by Kanri for shoki alone (D-6, S-4) | `removed: <time>`, and the worktree path it removed |
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
  "branch": "<the branch the shared tree is on>",
  "mode": "auto | manual — auto for every seat Kanri spawns; manual only in Verification 2",
  "prompt": "/tanto <role> key=value …, or the shoki brief's path prefixed as its brief line",
  "worktree": "shoki-<topic>, for shoki; else absent",
  "addDir": "[<root>], for shoki; else absent",
  "sessionId": "<for stop, rm, resume, ack>",
  "message": "<for attention: one line, in the chat's language; a bare <id> in it is filled by the spawner from seats.json>"
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

The request file is Kanri's only act toward a **terminal** seat's
lifecycle. `SKILL.md`'s "Session lifecycle" and `roles/kanri.md`'s "Create",
"Replace", and "Release" become, for those seats: write the request — no
create request to the human, no queue. The two tab seats Kanri asks for —
Sekkei, at "every open topic has passed its spec stage", and Kaiseki, on an
unknown cause — keep the numbered list as it is, for the measured reason it
exists (`/clear` resets the effort while it keeps the model), its line 5
now `/tanto <role> topic=<topic>`; Kikaku and Hosa are never requested, as
today. "Create" becomes two tables, the requests Kanri writes and the asks
it makes; "Replace" says which of its rows become a `spawn` — a Jisso gone
mid-batch is a `spawn` with the same `batch=` file, the prompt's resume line
rewritten to `resume batch X from task N`; a Keikaku gone before the plan is
committed is a `spawn` with the same three keys — and which stay asks
(Sekkei, Kaiseki).

### 1.5 The notice (D-1)

The spawner raises a desktop notice, without configuration by the human, on
two events: a seat's `state: blocked` in the census — a permission prompt,
an `AskUserQuestion`, anything the harness renders and waits on — and an
`attention` request Kanri writes. The request has two uses: the close
kessai (2.4), and a `human-access: granted` to a terminal seat, whose
message is `human-needed: <role> <topic> — claude attach <id>` — a seat
that idles on a grant is not `blocked` in the harness's sense, so the census
alone would miss it. The notice's text is the seat's role, topic, and name,
and the one command that reaches it, `claude attach <id>`, the spawner
filling `<id>` from `seats.json` when the message carries it bare. The
grant's numbered list to the human (`SKILL.md`, "Human access") reads:
1. `claude attach <id>` for a terminal seat, or go to `<name> [<ref>]` for a
tab seat; 2. do `<what>`; 3. ← back to the agent view, or the tab.

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
| Kaiseki, attached (a tab seat, typed by the human) | `/tanto kaiseki topic=<topic>` — the key is what makes it attached; `/tanto kaiseki` with no key is standalone Kaiseki, roster or no roster (D-6, S-7) |

A spawned seat runs the start sequence's model check and the definitions
write-out, and **sends no handshake**: its role, topic, model, effort,
branch, and mode are in the request Kanri wrote, its `sessionId`, name,
cwd, and transcript in the result. Then it does what its keys say. Four
rules follow from having no handshake and no window anyone watches:

- **A mismatch never stops it.** A spawned seat whose model or effort
  differs from the request appends `model: expected <a>, running <b>` to
  the first tanto line it sends — `plan committed:` or the report path —
  and Kanri writes an `attention` request on reading it; the start
  sequence's "ask them to run `/model <family>` and then `/tanto` again, and
  stop" is a tab seat's sentence (decision-08bc: the mismatch reaches the
  human either way).
- **It runs no resume self-check.** The `ListAgents` comparison of
  `SKILL.md`'s Resuming, at a boundary or before an exit line, is a tab
  seat's: a terminal seat's rename is the census's to detect (1.7), and a
  seat with no roster row yet (1.7) would otherwise handshake, which this
  section forbids.
- **Its closing line's identity** is the `name` its request's result
  carried, or the one `claude agents --json` prints for its own `sessionId`
  — never a `ListAgents` reading of its own.
- **Its exit ends with its closing line.** The `stop` follows, and the seat
  tells no human to `/clear` anything; `release: /clear this window` and
  its "tell the human" sentences are a tab seat's. Keikaku's standing grant
  is implied by the role, as `roles/keikaku.md` states it, and not named in
  an orders line that no longer exists; a `human-needed:` from a terminal
  Keikaku is answered as any other.

A tab seat's start sequence is unchanged, and its handshake gains one
field, `topic=<topic|—>`, so that a Sekkei's or a Kaiseki's handshake names
the topic it was opened for (issue-43a8) — Kanri's orders line still names
it, and the field lets Kanri refuse a second Sekkei for the same topic
without a round trip.

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
  D-2's case only, and a D-2 seat that never ran goes `stopped`, not
  `cleared`. **A `stopped` row moves to the archive** at the plan close
  with the dead, replaced, refused, and cleared rows, joined with its
  Residency row: every enumeration of the archived statuses —
  `templates/roster-archive.md`, `templates/roster.md`, `SKILL.md`'s roster
  paragraph and Artifacts row, `roles/kanri.md`'s close row — gains the
  word, as decision-ded8 added `cleared`.
- A `renamed` mark in `seats.json` — a known `sessionId` under a new name —
  is read by Kanri at its next act: it rewrites the row's Name column,
  writes the Events line `resumed: <old name> → <new name>`, as today's
  re-handshake did, and clears the mark by writing the request
  `{op: ack, sessionId}`. A tab seat that was resumed still re-handshakes
  with `/tanto fukki`, as today.
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
typed there once — **one word more than the third file's §6 "none"**, taken
with the human's word (D-6, S-8) over the alternative of spawning a fresh
Kanri that recovers from files, which costs a contract read and abandons
the resumed context. Kanri's fukki reconciles the roster with `seats.json`'s
`renamed` marks and `claude agents --json`, answers the ledger's unanswered
lines, sends a Jisso resumed mid-batch the Replace table's line
`resume batch X from task N` — a resumed seat with no prompt idles at its
last message — and continues where the Progress line says; it re-runs no
definitions write-out and sends no broadcast. A tab seat's `/tanto fukki` is
unchanged in shape — the re-handshake with the same `transcript=` — is typed
only in tab seats, and re-runs no definitions write-out either: that
write-out runs at the start sequence only, for every seat (the third file's
§6 table). `roles/kanri.md`'s "Recovery after a VS Code restart" becomes
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

- **The next prompt is a spawn, not a send.** Loop step 6's "send the one
  line `batch: <path>`" becomes "write the `spawn` request for the next
  Jisso with `batch=<path>`", and the brief's step 5 renders the prompt with
  no addressee name. Under D-2's queue the send stays for that plan. The
  boundary dispatch gains one argument, `seat=<results path>`: the brief
  passes it as `--seat` on its first `record` call, which writes the Jisso's
  roster row from the result's `role`, `topic`, `name`, `cwd`, `model`,
  `effort`, `branch`, `mode`, `startedAt`, and `transcript`; the brief itself
  reads that same file's `name` and passes it explicitly as `--jisso`, so
  neither flag derives from the other inside `record` — the resident's
  step-6 call names the seat by the result's `name` the same explicit way.
- **`release:` to a Jisso is a `stop` request.** The row goes `stopped` by
  the resident's `record` call, and the released line to the human goes;
  nothing is `/clear`ed. A stopped Jisso's or Keikaku's session is **never
  `rm`ed** (D-6, S-4): its conversation is kept on the same terms as
  `.tanto/<topic>/` and the SDD workspace (issue-12d3) — untracked, local,
  useful for a later re-read — and `reading.js --share` reads its transcript
  at the close as today. `rm` is shoki's alone, for its worktree (2.6).
- **The commit window is opened only for a peer with a commit waiting.** A
  Sekkei or Keikaku of another topic whose work is ready while a batch runs
  writes the ledger event
  `commit-ready: <role> <topic> — <subject> — <YYYY-MM-DD HH:MM>` through
  `record --event` — to the ledger of the topic whose batches are in
  flight, whose path Kanri's orders line to that peer carries as `ledger=`
  beside the out-of-scope paths it already names, the timestamp making two
  events two lines under `record`'s text dedupe. **A peer that outlives the
  topic its `ledger=` names re-reads nothing on its own**: when that topic
  closes and a new one's batch A lands, Kanri sends every still-live Sekkei
  or Keikaku of another topic a fresh `ledger=` pointing at the new
  in-flight ledger, in the same act as batch A's own request, so a
  `commit-ready:` a peer writes always reaches a ledger some boundary's
  `check` still reads. The boundary's `check`
  prints every `commit-ready:` line with no `commit-done:` pair; Kanri sends
  the "boundary verified — commit" line only to such a peer, waits for its
  `committed <subject> — <reading>` before the next spawn, and its own
  `record` call pairs the event with
  `--event "commit-done: <role> <topic> — <subject>"`. A peer with no event
  is sent nothing and answers nothing (issue-c0d0); the peers' sentence "If
  your work is ready and you have not heard, ask Kanri in one line and wait"
  is replaced by the event. The `nothing to commit` reply goes.

**Peers write fixed bookkeeping lines to the ledger themselves**, through
`node "$TANTO/scripts/boundary.js" record --ledger <path> --event "<line>"`,
which is idempotent and appends one Session events line. The lines are a
closed set — `review-ready: …` and `commit-ready: …`; `shoroku ready: …` is
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
| the kessai answer | today the human's answer in Hosa's window, then `close done:` | one wake-up: the human's line, by `attach`, a decision file, or Hosa's `kessai answer:` relay |
| `shoroku ready:` or `shoroku blocked:` (2.6) | — | one wake-up per close: Kanri lands and verifies, or rules on the block |

### 2.4 The close kessai

After the final batch is accepted and the T2 proposal is written (Jisso's,
then Kanri's own, as "The close" step 1 says today), Kanri:

1. dispatches the `shoroku.recommend` kind itself — `subagent_type:
   tanto-shoroku-recommend`, fable — over the `pending` rows' sources and
   the untriaged inbox copies, as "The four steps" step 2 says, and
   form-checks the brief by `grep` as step 3 says (one re-dispatch on a
   failure, pasted as it stands on a second);
2. writes an `attention` request whose message is
   `kessai: <topic> — claude attach <id>`, the spawner filling `<id>` from
   `seats.json` (Kanri holds its own `sessionId`, not its short id); and
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
records the `S-n` rows' Adopted, and starts shusei (2.5); shoki is spawned
there too, but only once the merge lands, never in this same act (2.6).
Until the answer arrives nothing else happens in that topic; the next
topic's spec dialogue is not blocked by it.

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

When Kanri accepts the batch it fills the `fix` rows' Written column with
shusei's commit subject — today the apply's report carried it; now the
boundary's verdict does. Then **Kanri merges**: `git merge --no-ff <topic>`
on `main` in the shared checkout, the local branch deleted, nothing pushed
— the default form the kessai stated, or the override the answer gave. An
empty `fix` group merges on the answer directly. **The merge is where shoki
is spawned, never before it**: in the same act as the merge, whichever form
it took, Kanri writes `.tanto/<topic>/shoki-brief.md` from
`templates/shoki-brief.md` and shoki's `spawn` request (2.6), so that
shoki's `git rebase main` always rebases onto a `main` that already carries
shusei's fix — the product lands before the records, never the other way,
as Requirements now states. The checkout is free; Kanri
cuts the next topic's branch if not yet cut and, when that topic's spec was
a draft, sends its persisting Keikaku (2.2) the one line
`checkout free: branch=<topic> — commit the spec and the plan`, waits for
its `committed <subject> — <reading>`, and then writes batch A's request.
The line goes to one named seat, never to a broadcast (issue-bb8c).

A topic the human ends before its final batch still gets its kessai over
what is on disk, as "The close" says today; its shoki runs, since records
land on `main` whatever the branch's fate; its live and queued Jissos get
`stop` requests, not a released line; and the merge question says whether
the branch lands.

### 2.6 Shoki — the scribe, in a worktree, after the merge

Right after Kanri's merge (2.5) — never in the same act as shusei's own
`spawn` request, which runs and is verified first — Kanri writes
`.tanto/<topic>/shoki-brief.md` from `templates/shoki-brief.md` and a
`spawn` request: `role: shoki`, `worktree: shoki-<topic>`, `addDir: [<root>]`,
`sessions.shoki`'s model and effort (a new key, default `sonnet`/`medium`,
the scribe being a seat that dispatches and runs git), mode `auto`, the
prompt `brief: <that path>`. The worktree is the CLI's, at
`<root>/.claude/worktrees/shoki-<topic>` (already under
`.git/info/exclude`), cut from the tree's HEAD at that moment — `main`,
right after Kanri's merge has landed there, so the worktree already
carries shusei's fix before shoki's own `git rebase main` ever runs; the
`.tanto/worktrees/` location the 09-18 file chose is not taken,
because `claude -w` and `claude rm` own the lifecycle at the CLI's path and
a second location would need a second mechanism.

The brief is shoki's whole contract — the four SDD stop classes, the
`no-role` line, the report line, and a Models line Kanri renders from the
merged `tanto.json` at render time (`shoroku.apply` on `<family>`,
`shoroku.review` on `<family>`, the families below being the built-in
defaults), with the sentence that the project-scope effort is not in effect
in the worktree, since `<cwd>/.claude/agents/` is the main checkout's and
shoki's cwd is the worktree; the user-scope definition's effort applies —
and its steps:

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
branch `shoki-<topic>`, which `claude rm` keeps), moves shoki's result
file to `.tanto/<topic>/spawner-results/`, marks the `S-n` rows written,
and writes the Events line. A landing check that fails is a follow-up
`docs:` commit through the hotfix lane, never a re-run of shoki. A
`shoroku blocked:` line is a ruling: Kanri reads the conflict's paths and
either resolves it by hand in the worktree — a hotfix-lane act, since the
tree is Kanri's — or hands the human the question at its next line.

**The close's handover does not wait for shoki.** The handover fires after
the merge and the archive move (decision-b6cb), and shoki's line arrives
after the merge, so in the ordinary case it reaches the **successor**. The
handover file's In flight block therefore carries
`A shoki in flight — <topic>, worktree <path>, spawned <time>, shoroku ready: not yet arrived`
in the place today's "A close delegated to Hosa" line holds, and the
successor lands it. Shoki's transcript is not in `reading.js --share`'s
list — it is not a session of the ledger's Session events — and its result
file moves at the landing, whoever performs it.

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
the batch prompt's deferral slot, the handover template's Deferred line,
the Measurements deferrals row, the "declined" clause, and the
`present|absent` half of the verdict line's `ceiling:`. The template's Why
line names four triggers, not three. The procedure, at a boundary or
between plans:

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

- **The launcher and the spawner exist on disk from batch A on and run for
  the first time in this repository's run at this plan's close** — batch
  B runs them against a scratch clone. The close's handover (decision-b6cb)
  is where the mechanism changes hands: the outgoing Kanri writes the
  handover file as today, **before** it prints its commands, and its
  "Commands for the human" say `tanto`, in the integrated terminal, at the
  repository root — the launcher finds the handover file, spawns the first
  background Kanri regardless of the interactive Kanri's `live` row (1.2
  step 4), and that Kanri reads the handover and marks the tab Kanri
  `replaced`. From that Kanri on, every terminal seat is spawned.
- **The role files and the run-time templates change in the final batch**,
  together: `SKILL.md`'s Invocation, Handshake, Resuming, Messages, Session
  exit, and Workspace sections; `roles/kanri.md`'s Start, On a handshake,
  When the plan lands, The batch loop, Handover, Shoroku, Session lifecycle;
  the six other role files; and `templates/boundary-brief.md`,
  `templates/batch-prompt.md`, and `templates/kanri-handover.md`. The
  templates land with the roles that read them for a reason rule 11 does
  not state: a role file is loaded once, at session start, but the
  `boundary.verify` subagent reads the brief and renders the prompt from
  disk at **every** boundary, this plan's included — a new brief in an
  earlier batch would hand this plan's own Kanri a verdict line its loaded
  role file cannot key on. A peer live during this plan — its Jissos, a
  Sekkei of the next topic — holds the old rule until then. The templates a
  session reads once — `roster.md`, `roster-archive.md`, `kanri.md`,
  `shoki-brief.md`, `spawn-request.md` — may land earlier.
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
  `requests/`, `results/`), `.tanto/<topic>/spawner-results/`,
  `.tanto/<topic>/shoki-brief.md`, `.tanto/<topic>/t2-review.md`,
  `.tanto/<topic>/batch-shusei-prompt.md`, `.claude/worktrees/shoki-<topic>`
  (the CLI's, never written by a role), `templates/shoki-brief.md`,
  `templates/spawn-request.md`; the counts "Fifteen of them" → seventeen,
  "three executables" → five Node scripts and two wrappers — the wrappers
  are invoked bare by design, so the "None is ever invoked bare" sentence
  names the five scripts; "The close's three files … there are no others"
  → six, `t2-review.md`, `shoki-brief.md`, and `batch-shusei-prompt.md`
  added; the archive row's status list gains `stopped`; `.tanto/` reserves
  `spawner`.
- **Human access**: the grant's numbered list as 1.5 gives it; Keikaku's
  grant "given at that session's creation and named in Kanri's orders line"
  → "implied by the role".
- **Rules**: rule 3 as 2.3 rewrites it; rule 4's "one live Jisso per
  topic, the plan's other Jissos queued" → "spawned per batch, or all at the
  landing under D-2"; rule 11 gains the D-2 paragraph, loses its "started
  at its landing and rotate" paragraph, and gains the run-time-template
  sentence of section 3.
- **Workspace**: "Kanri alone cuts, switches, merges, and deletes the
  branch"; the worktree sentence gains shoki's exception.
- **The expected-model config**: "fourteen" → fifteen at its six sites,
  `shoroku.review` named; "the two built-in skill-name keys" → three;
  `sessions.shoki`; `ceiling.presence_minutes` described as informational.
- **Standalone Kaiseki**: "`/tanto kaiseki` with no address is standalone"
  and "an attached Kaiseki always receives the address on the command line"
  → the `topic=` key of 1.6.
- **The frontmatter description**: "separate interactive sessions" →
  "separate sessions, background and interactive", kept free of colon-space.

### 4.2 `skills/tanto/roles/kanri.md`

- **Start**: step 1 loses its `ListAgents` self-check sentence for the name
  and reads the name from `claude agents --json` by its own `sessionId`
  (the transcript path's basename); step 3's bootstrap row is written the
  same way; the five cases as 2.7 rewrites them.
- **On a handshake**: "a tab seat's handshake" throughout; the Jisso and
  Keikaku bullets go; the Sekkei bullet gains `branch=` as the branch the
  tree is on after Kanri's cut, and `ledger=` for the in-flight topic's
  ledger when one is (2.3).
- **When the plan lands**: steps 4 and 5 as 2.2; the dispatch prompt of the
  boundary gains `seat=`.
- **The batch loop**: step 6 as 2.3 — the spawn, the `--seat`, the
  `commit-done:` pairing — and its self-check sentence (loop step 6) is a
  tab seat's; the deferral lines go.
- **The final batch**, **Shoroku**: "The close" as 2.4 to 2.6;
  "Delegation to Hosa" goes; "The four steps" step 3 is the kessai, step 4
  is shoki, whose "Where the commit lands: on the topic's branch, before the
  merge decision" and "The apply subagent writes … on this branch" become
  "on `main`, by Kanri's fast-forward of shoki's branch, after the merge";
  the apply's fix pass and "fills Written with the fix subject from the
  apply's report" become shusei's commit and its verdict (2.5).
- **Handover**: as 2.7; the trigger's self-check sentence is a tab seat's;
  "The residency line" loses "followed by the numbered commands from the
  handover file".
- **Session lifecycle**: the numbered create request stays for Sekkei and
  Kaiseki with line 5 `/tanto <role> topic=<topic>`; "Create" becomes two
  tables, the requests Kanri writes and the asks it makes; "Replace" names
  which rows become a `spawn` (1.4); "Release" is `stop` requests for
  terminal seats and `release:` for tab seats, and its close row's archive
  list gains `stopped`; "Readings" unchanged; "Recovery after a VS Code
  restart" as 1.8; "Human access" as 1.5.

### 4.3 The other role files

- `roles/sekkei.md`: the cut sentence goes; `review-ready:` is an event;
  the handshake's `topic=`; "If your work is ready and you have not heard,
  ask Kanri in one line and wait" → the `commit-ready:` event, written to
  the ledger the orders line's `ledger=` names.
- `roles/keikaku.md`: "The branch and the spec commit" keeps the commit and
  loses the cut, and gains the `checkout free:` line of 2.5; Step 4 item 6
  as 2.2; the Start reads the three keys and loses "Kanri asked for you …
  its orders line carries … your grant"; `review-ready:` is an event; the
  "ask Kanri in one line" sentence → `commit-ready:`; its two boundary
  self-check sites and the Handoff's are a tab seat's and go; its two
  `release: /clear this window` sites → the `stop`; the persistence rule of
  2.2's last sentence.
- `roles/jisso.md`: "Start" reads `batch=` or `queue=` and sends no
  handshake; "The run" step 3's self-check and its `release:` /
  "tell the human to `/clear`" sentences go; "T2 and the exit" loses
  "`release:`" as a line and says the seat is stopped; a "Shusei" paragraph
  names the one-task batch.
- `roles/hosa.md`: as 2.8, in the same batch as `roles/kanri.md`'s close:
  the "Whose work you take" paragraphs **The close's** and **The inbox
  sweep's** are removed whole, "Not yours" loses its recommendation, brief,
  and direction sentence, "Lifecycle" loses the `close:` / `sweep:` clauses
  and the closing-line sentence about the direction file, and "Models"
  keeps `default` alone — no sentence of the close protocol is left beside
  the new one (I-1).
- `roles/kaiseki.md`: "Two ways you are started" — attached is
  `/tanto kaiseki topic=<topic>`, standalone the bare command; the
  handshake's `topic=`.
- `roles/kikaku.md`, `roles/hosa.md` "How you start": `[<address>]` goes;
  the handshake's `topic=` (`—`).

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
  Live peers' `queued` paragraph is D-2's case only; the In flight block's
  "A close delegated to Hosa" line becomes the shoki-in-flight line of 2.6
  and its Deferred line goes; the Why line names the four triggers.
- `templates/roster.md` — the keeping rule names the two kinds ("One row
  per session that handshook" → "per seat, from a handshake or a result
  file"), the result file, `stopped` in the status list, and the `renamed`
  reconciliation.
- `templates/roster-archive.md` — both enumerations of the archived
  statuses gain `stopped`; the `queued`-that-never-ran clause moves it as
  `stopped`.
- `templates/kanri.md` — the Measurements deferrals row goes ("These seven
  rows are always present" → six); the Plan section's Branch line reads
  "Kanri cuts it from `main` at the opening, or after the predecessor's
  merge"; a `spawner results moved` line in the close's Progress
  vocabulary.
- `templates/tanto.json` — `subagents.shoroku.review: {opus, medium}`,
  `sessions.shoki: {sonnet, medium}` (D-6, S-3).
- `templates/agent.md` — unchanged; the fifteenth definition renders from
  it.

### 4.5 Scripts

- `scripts/tanto.js`, `scripts/tanto.bat`, `scripts/tanto.sh` — new (1.2).
- `scripts/spawner.js` — new (1.3, 1.5), with `notify --stdin`.
- `scripts/boundary.js` — `record` accepts `--status … stopped` and
  `--seat <results path>` (writing the roster row from the file); `check`
  prints, under a fixed heading, the ledger's `commit-ready:` events that
  have no `commit-done:` pair.
- `scripts/reading.js` — one change: export `loadSessions(root)`, built on
  the unexported config helpers, returning the merged `sessions` map for
  the launcher; no behavior change; `reading.test.js` gains its test. The
  `--presence` switch stays as an instrument.
- Tests beside each: `tanto.test.js` and `spawner.test.js` with a fake
  `claude` on `PATH` (a Node script that records its arguments and prints
  what the CLI prints), so that no test spawns a real session.

### 4.6 `skills/tanto/README.md`

"Usage" is rewritten: install the wrappers on `PATH`; `tanto` in the
integrated terminal at the repository root; `claude attach <id>`; the tab
seats by `/tanto <role>`; `tanto down`; the hook, optional. "What it does"
bullets 1 ("The human gives a window its role and takes it away; Kanri is
the only role that asks") and 6 (the handover "only while the human is
there to start the successor", the queue "the human fills at the plan's
landing") are rewritten to the two kinds of seat and the spawned successor;
"Layout"'s "All three scripts are Node" → five. The "Prerequisites" section
names Node 22 or later and Claude Code CLI 2.1.277 or later (`--bg`,
`agents --json`, `attach`, `--resume … --bg`). The Claude Code only
sentence gains "and its CLI's background sessions".

### 4.7 `docs/requirements/04f5-tanto.md`

Rewritten as "Requirements" below says; the close's apply writes it, since
requirements live under `docs/`.

## Where each change lives

| Change | Files | Section |
| --- | --- | --- |
| launcher | `scripts/tanto.js`, `tanto.bat`, `tanto.sh`, `tanto.test.js`, `scripts/reading.js` (the export), README | 1.2, 4.5, 4.6 |
| spawner, notice, hook one-shot | `scripts/spawner.js`, `spawner.test.js`, `templates/spawn-request.md` | 1.3–1.5 |
| invocation grammar, no handshake for spawned seats, `topic=` | `SKILL.md`, every role file | 1.6 |
| identity, roster, `stopped`, `--seat` | `SKILL.md`, `templates/roster.md`, `templates/roster-archive.md`, `scripts/boundary.js`, `templates/boundary-brief.md` | 1.7 |
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

Added after the spec review (`.tanto/tanto-bg-seats/spec-review.md`,
F-8, F-11 to F-13, F-15 to F-18, F-25, F-31), each contradicted and to be
an `O` needle of the plan:

- `SKILL.md` 66–68: "On a mismatch, tell the human what was expected and what is running, ask them to run `/model <family>` and then `/tanto` again, and stop." (a tab seat's sentence; 1.6)
- `SKILL.md` 338: "A model mismatch is refused, as today."
- `SKILL.md` 56: "`/tanto kaiseki` with no address is standalone Kaiseki — see `roles/kaiseki.md`."; 316–317: "Kaiseki with no address is standalone and does not shake hands; an attached Kaiseki always receives the address on the command line."
- `SKILL.md` 110: "The fourteen kinds are" (and "fourteen" at 190, 206, 219, 241, 261); 118–120: "`shoroku.recommend` and `shoroku.apply` are the two built-in skill-name keys"
- `SKILL.md` 368–369: "Status is `queued`, `live`, `cleared`, `replaced`, `dead`, or `refused`"; 971: "the roster's dead, replaced, refused, and cleared rows"
- `SKILL.md` 635–641: the closing line's identity is "the word its own last `ListAgents` printed for it, at the handshake, at its latest boundary self-check, or at `/tanto fukki`"
- `SKILL.md` 770–772: "Four standing grants exist: Sekkei's spec dialogue and Keikaku's plan dialogue, each given at that session's creation and named in Kanri's orders line"; 784–786: "On a grant Kanri tells the human, as a numbered list, to go to the role's window (`<name> [<ref>]`), do `<what>`, and come back"
- `SKILL.md` 861–864: "commits once by explicit path, on the topic's branch, before the merge decision; then, when the direction accepted a `fix` item, applies those sentences to their files under `skills/` and commits them once more as `fix: text corrections from <topic>'s close`"; 934–940: "The close's three files — `t2-recommendation.md`, `t2-brief.md`, `t2-direction.md` — live in the topic directory; there are no others." and "The apply subagent's commit subjects are …"
- `SKILL.md` 1032: "All three are Node with no dependencies, and all three have their tests beside them"; 1039–1041: "None is ever invoked bare — no file of the three carries a shebang"
- `SKILL.md` 3, the frontmatter description: "separate interactive sessions"
- `roles/kanri.md` 562–564 and 724–726: the loop's and the trigger's `ListAgents` self-check sentences
- `roles/kanri.md` 1075–1079 (the apply's fix pass); 1084–1085: Written filled with "the fix subject for a `fix` row"; 1094–1095: "Where the commit lands: on the topic's branch, before the merge decision. No other stage commits under `docs/` through this section."; 1131–1132: "**The apply subagent writes.** Step 4 above, on this branch."
- `roles/kanri.md` 1172–1180: the abandoned topic's "naming every live and queued Jisso of the topic in the close's released line for the human to `/clear` … the apply lands on the topic's branch"
- `roles/kanri.md` 1376–1377: the grant's numbered list; 1476: "move the dead, replaced, refused, and cleared rows"
- `roles/jisso.md` 76–78: "run the self-check of `SKILL.md`'s Resuming — one `ListAgents`; a name that is not your row's means you were resumed, and the handshake goes first"; 84–91: "Kanri's `release: /clear this window` follows … On `release:`, tell the human to `/clear` this window and end your turn"
- `roles/keikaku.md` 4–6 and 16–19: "Kanri asked for you at the boundary 'the spec review is accepted', and its orders line carries the topic, the spec's path …, the plan's path, and your grant."; 296–297 and 333–335: the self-check sentences; 303–306 and 349–353: the `release: /clear this window` sentences; 327–328 and `roles/sekkei.md` 161–162: "If your work is ready and you have not heard, ask Kanri in one line and wait."
- `roles/kaiseki.md` 20–25: "**Attached.** `/tanto kaiseki` in a workspace whose `.tanto/roster.md` exists" / "**Standalone.** `/tanto kaiseki` with no address — no roster"
- `roles/hosa.md` 16 and `roles/kikaku.md` 16: "`/tanto hosa [<address>]`" / "`/tanto kikaku [<address>]`"
- `templates/roster-archive.md` 4–6: "the roster rows whose status is `dead`, `replaced`, `refused`, or `cleared` — a `queued` row that never ran moving as `cleared`"; 17–19 the same set
- `templates/roster.md` 7–12: "One row per session that handshook", "the plan's other Jissos `queued`"; 46: the status list
- `templates/kanri.md` 26–27: "Branch — <branch name; Sekkei cuts it from main when no batch is in flight, Keikaku after the merge otherwise>"; 131: "These seven rows are always present"
- `templates/kanri-handover.md` 10: "Why — <the trigger that fired — the plan close, the human's word, or a compaction noticed>"; 23–26: the Deferred line; 29–32: "A close delegated to Hosa — …"
- `README.md` 11–12: "The human gives a window its role and takes it away; Kanri is the only role that asks."; 34–40: the handover "only while the human is there to start the successor … from a queue the human fills at the plan's landing"; 171: "All three scripts are Node"

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
- **Add** **"A repository that uses tanto carries no launcher of it."** The
  launcher and the spawner ship with the skill; a consuming repository's
  tree holds the untracked state directory, the project config it chooses
  to keep, and the ignored project-scope definitions — nothing else, and no
  script (D-6, S-6).
- **Amend** "The human reviews through a brief of the judgment points":
  "… The human's answers to a spec brief's points are the confirmation that
  review asks for; a plan brief is written for the human to read, and its
  `— If unanswered:` clauses are the plan's answers unless the human
  overrides one in Kanri's window or by a decision file." (D-6, S-5)
- **Add** to "Docs are kept current as part of the flow": "The write-out
  leaves the critical path: the product's fixes land before the merge, the
  records after it, and the records are verified at their landing."
- **Amend** "Claude Code only, and says so" with "and its CLI's background
  sessions, which the documentation names with the version that first
  carried them."

## The ADRs

Written by the close's apply under `docs/decisions/`; the `amends` links
are the Fixed inputs' one list, repeated here per ADR.

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
   Amends decision-ace0's confirmation clause for the plan brief (the
   defaults are the answers) and decision-1f5f's first preservation point
   (the human's approval of the plan); decision-a1ae is superseded by ADR 5.
5. **Shusei before the merge, shoki after: the product is verified before it
   lands, the records at their landing.** The `fix` group is a Jisso batch
   of one task; the docs write-out is a brief-driven seat in a worktree —
   the one worktree the design admits, because a scribe holds no runtime
   resource. Shoki reports `shoroku ready:` and Kanri fast-forwards `main`,
   because a merge commit needs `main` checked out and Kanri alone owns the
   branch. Rejected: a `shusei` role; the docs commit on the topic branch
   before the merge; shoki resolving a conflict; shoki merging into `main`
   itself (the second Kikaku file's §4, amended with the human's word,
   D-6 S-2). Amends decision-83aa (its "a `fix` lands unreviewed by a
   subagent" consequence closes: shusei's batch carries two reviews) and
   decision-ce83; supersedes decision-a1ae.
6. **Spawned seats do not handshake; identity is the `sessionId`; the
   roster stays Kanri's, written from the spawner's result files.**
   Options, both recorded: the third Kikaku file's §3 had the spawner
   append the roster's identity rows itself, as the first bookkeeping to
   leave the LLM (its §5 wake-up argument); the spec keeps one writer per
   file and gives the spawner its own `seats.json` and result files, which
   Kanri reads at its next act — the same wake-up count, no race. Chosen
   with the human's word (D-6, S-1). Amends decision-73c3 (its
   command-line channel), decision-0775 (its bootstrap-argument clause, D-6
   S-7), decision-ded8 (`stopped` beside `cleared`), and decision-0ea5's
   mechanism (a `stop` request for a terminal seat, its timing unchanged).
7. **The handover fires on its signal without a presence gate; the
   successor is spawned.** The gate existed for the hands the design
   removes, and it read `absent` at eighteen boundaries in a row. Amends
   decision-eee2, decision-de63, decision-b6cb's "the human creates the
   successor" clause, and decision-5ec7's "one create request at the
   landing".
8. **A wake-up is spent only on a decision: fixed bookkeeping lines go to
   the ledger through `boundary.js record --event`, written by the peer.**
   The set is closed and named in the role files; everything Kanri acts on
   stays a message. Amends rule 3's "Kanri is the only writer" and
   decision-2b1a's `review-ready:` line, which becomes the author's ledger
   event.
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
  the final one; this plan's Kanri runs today's mechanism, writes its
  close's handover file before its commands, and those commands say
  `tanto`; the D-2 statement that this is the last plan to queue its Jissos
  by hand; the run-time-template sentence of section 3.
- Batch A — the instruments: `spawner.js` with its ops, census, guard, and
  notice, `tanto.js` and the two wrappers, `reading.js`'s `loadSessions`
  export, `templates/spawn-request.md`, their tests with a fake `claude`;
  `templates/tanto.json`'s two keys.
- Batch B — the verifications below, each a measurement task with its
  report under `.tanto/<topic>/`, run by hand against a real CLI in a
  scratch clone, none of which touches a role file; the spawn path's
  prompt form settled and written into `templates/spawn-request.md`.
- Batch C — `boundary.js` (`stopped`, `--seat`, the unpaired
  `commit-ready:` lines in `check`) and the templates a session reads
  once: `templates/roster.md`, `templates/roster-archive.md`,
  `templates/kanri.md`, `templates/shoki-brief.md`. `boundary.js`'s new
  flags are additive, so this plan's own boundaries, which pass neither,
  run unchanged.
- Batch D — the final batch: `SKILL.md`, the seven role files, README, and
  the run-time templates `templates/boundary-brief.md`,
  `templates/batch-prompt.md`, `templates/kanri-handover.md`, in one batch,
  with the `O` rows for every retired term and every enumeration sentence
  of Old values measured over every path.
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
   seat that was `running` or `blocked` under the same `sessionId` (probe
   item 6 measured `stop` → `--resume --bg`; the reboot is new).
5. **`claude rm` and the transcript**: whether the file under
   `projects/<slug>/` survives `rm`. The design runs `rm` for shoki alone
   (D-6, S-4), after the landing; if the transcript does not survive, shoki's
   `rm` waits until Kanri has taken shoki's reading for the archive.
6. **`git push . shoki-<topic>:main` from the worktree while the shared
   checkout is on another branch**, and `git merge --ff-only` when it is on
   `main` — the two landing forms of 2.6.
7. **`SendMessage` to a background session by the name `ListAgents`
   prints**, and its `[ref]`, from a tab seat and from Kanri — the spike
   measured one direction with a plain prompt; this measures a seat that
   ran `/tanto`.
8. **The stopped session in the listing, and the id forms**: whether
   `claude agents --json` lists a session after `claude stop`, and with
   what `state`; whether `stop`, `rm`, `attach`, and `--resume` accept the
   `sessionId` or only the short id — the spawner maps one to the other
   from `seats.json` if not.
9. **`claude --bg -w <name>`**: the worktree's branch name and its base
   commit (the shared checkout's HEAD, or the default branch), and
   `claude rm`'s effect on the worktree and the branch.

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

Each term grepped once across `docs/issues/open/` (Measured 7); issue-caba,
issue-43a8, and issue-c0d0 come from their titles in the open list and
issue-d92f from the `fukki` grep.

- **issue-629b** (a Jisso spawned per batch reads the previous batch's
  edits) — D-2, ADR 10.
- **issue-aa37** (the ad hoc worktree) — the guard of 1.3 and Verification
  2; closes when the measurement passes, and stays open with the guard as
  its interim otherwise.
- **issue-1a9a**, **issue-caba**, **issue-b409** (the presence gate's gaps,
  the trigger's disagreement with Timing, the mid-turn message invisible to
  `--presence`) — the gate goes, ADR 7.
- **issue-d92f** (the transcript-path identity under a config-dir change) —
  **narrowed**, not closed: terminal seats are identified by `sessionId`
  (1.7); tab seats keep the transcript-path re-handshake (1.8), where the
  case persists.
- **issue-43a8** (a handshake without a topic field) — the `topic=` field,
  1.6.
- **issue-c0d0** (a draft-only Sekkei woken at every boundary) — the
  commit window opens only on `commit-ready:`, 2.3.
- **issue-bb8c** (a `checkout free:` broadcast racing two queued Keikaku
  sessions) — the line goes to the one named Keikaku of the topic Kanri
  has just cut the branch for, never to a broadcast, 2.5.
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
