# Design: run-owned-seats — every seat is spawned by the run and the tab seat goes; a dialogue seat is parked while it waits for the human, at its own request, once its turn has ended; a seat is addressed by its `sessionId`, its name looked up at the send; the launcher enters a seat by role, follows a handover, and takes four words — `fukki`, `taiseki`, `teishi`, `jokyo`

Written by Sekkei (fable, high; `sessionId` `2664b3f0`, named
`dotskills-05`, then `dotskills-23`, then `dotskills-7b` across two editor
restarts on the day) on 2026-10-05 on the branch `run-owned-seats`, cut from
`main` at the topic's opening with no batch in flight, so this spec is not a
draft and is committed at this path. The dialogue is
`.tanto/run-owned-seats/dialogue.md`: the human's answers D-1 to D-16, and
the answers to the review brief. The spike of the same day is
`.tanto/run-owned-seats/notes-spike.md`.

**The skill this spec read.** `main`'s tip when the branch was cut, the
commit "fix: a request taken by two spawners on one root is handled twice".
Every site below is named by its file and heading, never by a line number;
a quoted phrase is a needle to find the site, not the text to replace.

**Words.** A *dialogue seat* is a Sekkei, a Keikaku, a Kikaku, a Hosa, or a
Kaiseki: a seat whose work includes turns that end on a question to the
human. *Parked* means the seat's process is stopped, its conversation is
kept, and the run expects to resume it. The *listing* is
`claude agents --json`, filtered to the sessions whose `cwd` is the
repository root or under it. The *state file* is
`.tanto/spawner/seats.json`. A *face* is a place the human talks to a seat
from: a terminal attach, a VS Code tab, Remote Control.

## Fixed inputs

The input document is `.tanto/kikaku/2026-10-05-run-owned-seats.md`, read
whole; it places the topic fourteenth and is the order's holder. Behind it,
as its last section lists them:
`.tanto/kikaku/2026-10-04-shoki-seat-kessai-and-run-scenes.md`;
`docs/experience.md`, `docs/experience/06b2-*.md`, and `57f4-*.md`;
`docs/design/4807-tanto.md`; the decisions 363c, 8320, cdc4, 0ea5, ded8,
39fb, 1ea3, 84c8, 362e, 7c87, ebbd, 1c07, 73c3, and 08bc under
`docs/decisions/`; `docs/reports/2026-09-20-tanto-bg-seats-probe.md`;
`skills/tanto/SKILL.md`, the seven role files, `scripts/spawner.js`,
`tanto.js`, and `boundary.js`, `templates/roster.md` and
`templates/spawn-request.md`; and the kin issues, taken or left under
"Issues this design closes". No `spec-inputs.md`: no `I-n` reached this
seat.

Under the experience layer the requirement register is `docs/experience/`;
each decision names the expectation it serves — of the scenes `exp-06b2`
("a plan handed to a run") and `exp-57f4` ("reaching a run, and being
reached by it") — or says that none does.

- **One kind of seat** (the decision's 2.1). Sekkei, Kikaku, Hosa, and
  Kaiseki are spawned by the run and stopped by the run. Serves `exp-c53d`:
  the run starts and clears away its own sessions.
- **The human enters by role, two ways** (2.2): the launcher, and asking
  Kanri. Serves `exp-1c96`.
- **A dialogue seat is parked while it waits for the human** (2.3), with
  the tab constraints the human accepted (2.4). Serves `exp-1c96` — the tab,
  the attach, and the run's own resume are faces of one seat — and
  `exp-9d8f`, since nothing is reported when he leaves.
- **Kanri is never parked** (D-1). Its face is the terminal attach through
  the launcher; it stays reachable by peers and by Remote Control. Serves
  `exp-1c96` and `exp-173f`.
- **A seat the human paces ends on an explicit command** (D-2 as revised
  by D-4, D-6): `/tanto taiseki`, typed in the seat. Serves `exp-c53d` —
  the run learns of the end from the seat's own request, not from a report.
- **`fukki` stays and is extended** (D-5, D-15): whatever the cause,
  `tanto fukki` alone, or `/tanto fukki` in Kanri alone, makes the expected
  resumption proceed. Serves `exp-173f` and `exp-c53d`.
- **The launcher's form** (D-3, D-10): `tanto [<role>] [<switch>]`, the
  role omitted meaning `kanri`, every role attaching by default,
  `--no-attach` the explicit switch; the launcher follows a Kanri handover
  by itself. Serves `exp-1c96` ("the same way each time, whichever session
  now holds the part") and `exp-c53d`.
- **One word table** (D-12, D-14): `fukki`/`resume`, `taiseki`/`leave`,
  `teishi`/`stop`, `jokyo`/`status`; `down` retired with no alias. Serves
  no expectation by itself; it is what keeps the launcher's form learnable.
- **An editor reload asks nothing** (D-9): it happens every day or two and
  is ordinary. Serves `exp-c53d` ("learns what he did without his reporting
  it") and `exp-173f`.
- **No compatibility code** (D-7): each run moves by hand at its own
  break; one safeguard line on an old-shape roster. Serves none; it is the
  price of leaving no tab-seat rule behind.
- **The risks of section 2 are known and accepted** (D-11), R-1 the
  heaviest. Serves none.

## Measured while designing

The spike's table is `notes-spike.md`; the Kikaku file's own measurements
are its M-1 to M-7. What this design builds a rule on, each under the
definition the rule uses (CLI 2.1.289, Windows 11):

| # | Fact | Rule built on it |
| --- | --- | --- |
| S-1 | A seat that answered and waits lists `status: idle`; a seat on a permission prompt lists `status: waiting` with `waitingFor: "permission prompt"`. Both list `state: blocked`. | 2.3's second condition; 2.6's `blocked` |
| S-2 | After a turn ends the transcript's last records are `system`/`stop_hook_summary` and `system`/`turn_duration`; on a prompt the last message record is an `assistant` with `stop_reason: tool_use`. The listing's `status` stayed `busy` for 15 s or more after the turn ended. | 2.3's first condition |
| S-3 | `claude stop`, then `claude --resume <sessionId> --bg "<prompt>"`: same id, same name, the prompt ran. | 2.5; 4.4 |
| S-4 | A seat stopped on a permission prompt and resumed is idle with its `tool_use` dangling; the prompt is not presented again. | 2.3's second condition |
| S-5 | A resume issued in the same second as the stop: `already running in the background, so this started a copy`. | 2.5's second guard |
| M-6 | A resume issued while a tab holds the conversation starts a copy under a new id (the Kikaku file). | 2.5's first guard |
| H-1a | While a terminal is attached the listing shows nothing for it: `status: idle`, no attached mark. | 2.4 |
| H-1b | `claude stop` of an attached session ends the attach with exit 0; a wrapper then attached the next id with nothing typed. | 4.3 |
| H-1c | ← leaves the attach for the agent view, which opens in the terminal's cwd and asks to trust it when it is not trusted; "No" exits 1. | 4.3 |
| H-2d, H-2e, H-2f | A stopped background session that no tab had opened is in the editor's list after a window reload; a double-click opens it with no notice; after the tab is closed a resume with a prompt brings it back under the same id with the tab's turn in its conversation. | 2.1 |
| H-2g | A tab's turn runs at the editor's effort (`high`); the background turn after it at the spawn's (`low`). | C-4 |
| H-2a, H-2h, H-2i | A session started after the editor's list was loaded is not in the list — reopening and searching do not show it; `Developer: Reload Window` does, and reconnects every tab of the window under a new name. | C-3; 3.1 |

Not measured, and carried to the plan as P-1 to P-7 (section 8).

## 1. One kind of seat

### 1.1 Who starts what

Every seat is started by the spawner on a request file (decision-1ea3
stands whole). Two writers of `spawn` requests exist, and no other:

| Writer | Seats | The prompt |
| --- | --- | --- |
| Kanri | Sekkei | `/tanto sekkei topic=<topic> spec=<path> branch=<branch> input=<path>` — `input=` only when an input document exists; `ledger=<path>` added when another topic's batch is in flight, and `spec=` is then the draft path |
| Kanri | Keikaku, Jisso, shoki, its own successor | unchanged |
| Kanri | an attached Kaiseki | `/tanto kaiseki topic=<topic> brief=<path>` |
| the launcher | Kanri, when the run has none | `/tanto kanri`, unchanged |
| the launcher | Kikaku, Hosa | `/tanto kikaku`, `/tanto hosa` |
| the launcher | a standalone Kaiseki | `/tanto kaiseki`, no key |

A seat's orders are its prompt's keys, as Keikaku's are today; there is no
orders line and no handshake. The standing grants move into the role
files, where Keikaku's already is: `roles/sekkei.md` states the spec
dialogue's, `roles/hosa.md` the chores', and an attached Kaiseki's stays in
its brief. What Kanri's reply told a Kikaku — the open topics — the Kikaku
reads from the roster and the ledgers; what it told a Hosa — "tracked files
only in a slot I give" — is already `roles/hosa.md`'s "The slot".

The Asks table and the numbered list of `roles/kanri.md`'s "Session
lifecycle" go: Kanri asks the human for no seat. Where it asked for a
Sekkei or a Kaiseki it writes the `spawn` request, at the same moments. A
Sekkei the human may decline is declined by saying so to Kanri before the
moment, or by `claude stop`; nothing asks first.

### 1.2 One holder per role

The spawner refuses a `spawn` whose `role` is `kanri`, `kikaku`, or `hosa`
while the state file holds a seat of that role whose status is `running`,
`blocked`, or `parked`, with `error: "held: <sessionId>"`. A handover's
request carries `successor: <the outgoing Kanri's sessionId>`, and a
request naming the holder it succeeds is not refused. The launcher reads
the same state before it writes, and enters the holder instead of asking
for a second. This is the guard issue-a14f lacked: whoever wrote the two
stray Kanri requests, the second one now returns an error.

### 1.3 The roster row

A seat's row is written from the spawner's result file, by
`boundary.js record --seat`, which is role-agnostic already. Kanri writes
it for the seats it requested when the result lands, as today. For a seat
the launcher started, Kanri learns of it at its next census: the census
prints, under **Not held**, ` — spawned as <role> <topic>, result <id>`
for a listed session the state file holds, and Kanri records that result.
Kanri is not woken for it.

The roster keeps its columns; the `Name [ref]` cells hold bare names, as
`record --seat` already writes them. A seat reads its own name from the
listing by its `sessionId` and never from `ListAgents`, and no seat writes
a `[ref]` about itself — the closing line, the roster, and Kanri's start
line carry `<name>` alone. The `[ref]` stays what `SendMessage`'s error
asks for when a name is ambiguous, read from one `ListAgents` call at that
moment (issue-fcd3).

### 1.4 The model and the effort

The spawner starts every seat on `sessions.<role>` from the merged
`tanto.json`. The start sequence's model check stays as a spawned seat's is
today: a mismatch never stops the seat, is appended to its first tanto
line as `model: expected <a>, running <b>`, and becomes Kanri's
`attention` request. The tab seat's stop — "ask them to run `/model
<family>` and then `/tanto` again" — goes, and with it the handshake's
refusal. A Kikaku, a Hosa, and a standalone Kaiseki, which send Kanri no
first line, say the mismatch in their start line.

A turn taken in a tab runs at the editor's effort, not the spawn's (H-2g).
The start line reports what the first turn ran at; nothing checks later
turns, and nothing is asked of the human (C-4).

## 2. The park

### 2.1 What it is for

A background seat that is alive shows the editor's "still open somewhere
else" notice on its row; one whose process is stopped opens in a tab with a
normal prompt box (H-2e). Parking a dialogue seat while it waits for the
human is what makes the tab a face of the seat with no rule between the
human and it. Kanri (D-1), Jisso, and shoki are never parked.

### 2.2 The request

A dialogue seat writes a `park` request as the last act of a turn that
ends on a question to the human, and only when nothing it dispatched is
still running — no subagent, no background command. It writes it with

```bash
node "$TANTO/scripts/boundary.js" request park --transcript "$T" [--notice]
```

which derives the `sessionId` from the transcript's basename and writes
the file atomically. `--notice` says the turn was started by the run — a
peer's line, a subagent's completion — and not by the human's own message;
the spawner then raises one desktop notice,
`waiting: <role> <topic> — tanto <role> [<topic>]`, when the park is done.
A park that follows the human's own message raises none (`exp-9d8f`).

The seat writes no request when its turn ends for another reason — a line
sent to Kanri and awaited, a subagent in flight. Such a seat stays alive;
the supervisor may collect it after its idle hour, and 2.7 says what the
census makes of that.

### 2.3 The spawner's act

On a `park` request for a seat whose role is not a dialogue seat's, the
result is `error: "not a dialogue seat"`. Otherwise the spawner records
`parkRequest: { at, notice }` on the seat, writes the result at once
(`parkRequested: <stamp>`), and from then on tries the park at every pass
until it is done or void. It stops the seat only when all of these hold,
read fresh:

1. **The turn ended.** The transcript's last record is `system` with
   `subtype: "turn_duration"`, and that record's `timestamp` is later than
   `parkRequest.at`.
2. **Nothing is waited for.** The listing's entry for the `sessionId`
   carries a `pid`, `kind: "background"`, and `status: "idle"` — not
   `waiting` (a prompt, S-4), not `busy`.
3. **No attach holds it.** The seat carries no `held` mark (2.4).

Then, in this order: write the state file with the seat `parked` and
`parkedAt`, `waiting: true`; run `claude stop <sessionId>`; on a failure
put the seat back to `running` and log; on success raise the notice if
`parkRequest.notice`, and delete `parkRequest`. The state is written
before the stop so that a sender who reads the state during the stop takes
the resume path, whose guard waits (2.5).

The request is **void**, and deleted with a log line, when a record of
`type` `user` or `assistant` follows the turn's `turn_duration` — a new
turn began, and its own end will ask again — or when ten minutes pass with
the conditions unmet. A seat the listing shows with `kind: "interactive"`
is held by a tab: there is no background process to stop, the request is
void, and nothing is marked.

When a condition cannot be read — no transcript found, a listing entry
without `status` — the spawner does not park. The failure of this section
is a seat left alive, whose row shows the editor's notice; no work and no
conversation is lost that way (R-3).

### 2.4 The hold

The listing does not show an attach (H-1a), so the launcher says it: a
`hold` request before `claude attach`, a `release` request after it.

- `hold` sets `held: { at, pid: <the launcher's pid> }` on the seat. When
  the seat is `parked` the spawner resumes it first (2.5, no prompt) and
  the result carries its `id`; when the listing shows it with
  `kind: "interactive"` the result is `error: "in a tab"`.
- `release` deletes the mark, and, for a dialogue seat, records a
  `parkRequest` with no notice, so that a seat whose turn has ended is
  parked as the human leaves and its row opens in a tab with no notice.
- A `held` mark whose `pid` no longer answers signal 0 is deleted by the
  spawner's census: a launcher that died released nothing.

A bare `claude attach`, typed without the launcher, sets no mark, and the
seat's own park at its turn's end closes that terminal under the human
(H-1b). That is constraint C-1, stated in the README: a dialogue seat is
entered from a terminal by `tanto <role>`.

### 2.5 Resuming, and a line for a parked seat

The `resume` op takes an optional `prompt`, which the spawner passes as
the one positional argument after `--bg` — still no flag, as decision-7c87
requires (S-3). Two guards, both before the command:

1. **Listed.** A fresh listing that holds the `sessionId` with a `pid`
   means the conversation is open somewhere — in the background, or in a
   tab — and a resume would start a copy (M-6). No command runs; the
   result is `error: "listed"` with the entry's `name` and `kind`.
2. **Just stopped.** When the seat's `parkedAt` or `stopped` stamp is
   younger than thirty seconds, the spawner polls the listing, once a
   second up to thirty times, until the `sessionId` is gone, and only then
   resumes (S-5).

After the command: stdout carrying `started a copy as <id>` is a failure —
the spawner runs `claude stop` and `claude rm` on the copy and returns
`error: "copy <id> removed"`; a `prompt` given and stdout carrying
`(idle — send a prompt to start)` is `error: "prompt not delivered"`.
Otherwise the seat is `running`, `parkedAt` and `waiting` are deleted, and
the result carries `id` and `name`.

**How Kanri sends a seat a line.** One rule, replacing "Kanri sends only to
the names of `live` roster rows":

```bash
node "$TANTO/scripts/boundary.js" seat <sessionId>
```

prints one line from the state file, `<status> <name> <kind>`, and
`spawner: beating` or `spawner: stale` under it. On `running` or
`blocked`, send to `<name>` with `SendMessage`. On `parked`, write a
`resume` request whose `prompt` is the line with its `no-role` second line;
on its result's `error: "listed"`, send to the `name` the result carries.
A `SendMessage` that errors is answered by running the command again and
following what it prints, once. On `spawner: stale` Kanri writes no
request, holds the line as an `unanswered:` event of its own, and tells
the human in one line to run `tanto fukki` (R-2).

A line that reached a seat in the seconds of its stop and was not read is
caught as every unanswered line is: the answer does not arrive, and the
census and the state file say why (R-5; P-2 measures it).

### 2.6 `blocked` carries its cause

The spawner's census marks a seat `blocked` when the listing's entry
carries a `pid` and `status: "waiting"`, and records the entry's
`waitingFor` on the seat; it no longer reads `state`. A seat that answered
and waits is `idle` there (S-1) and is not blocked — today every such seat
reads `blocked`, which is the half of issue feac that asked for the cause.
The notice becomes
`blocked: <role> <topic> <name> — <waitingFor> — tanto <role> [<topic>]`.
`boundary.js census` prints ` — blocked (<waitingFor>)` on the same
condition, and the roster's `(blocked since <HH:MM>)` suffix keeps its
form. What a usage-limit pause lists is not measured; whatever
`waitingFor` it carries is printed as it is, and a pause that lists as
`idle` is, as now, known from the seat's own `paused:` line.

### 2.7 The census and a seat that is not listed

A dialogue seat that leaves the listing — parked by the spawner, held in a
tab that was closed, collected after its idle hour — is `parked` in the
state file, never `gone`: its conversation is on disk and decision-39fb's
resume brings it back when a line is due. `gone` stays for Kanri, Jisso,
and shoki. The spawner's census sets `midTurn: true` on such a seat when
the transcript's tail is not a `turn_duration`, so that `tanto jokyo` can
say so; nothing acts on it.

`boundary.js census` reads the state file and prints six headings, in this
order: **Listed**, **Parked**, **Ended**, **Not listed**, **No session
id**, **Not held**.

- **Parked** — a `live` row whose seat the state file holds `parked`.
  Nothing to do; the row stays `live`. A park costs no wake-up of Kanri's.
- **Ended** — a `live` or `queued` row whose seat the state file holds
  `stopped` or `removed`. Kanri writes the row `stopped`, with an Events
  line naming what ended it — `taiseki`, or its own request.
- **Not listed** — as today, for a row the state file does not hold, or
  holds `running`, `blocked`, or `gone`.

## 3. Identity and address

### 3.1 The `sessionId` alone

A seat is its `sessionId`. Its name is whatever the listing prints for
that id now: the spawner's `<repo>-<role>[-<topic>]-<hex>` while it runs in
the background, the editor's `<repo>-<2 hex>` while a tab holds it, and a
new one of those after every window reload (H-2i). The spawner's census
writes the listed name into the state file at every pass, for an entry of
any `kind`, and 2.5's command reads it there at the moment of sending.
Nothing else in the run stores a name as an address.

An editor reload therefore asks nothing of anyone (D-9): no handshake, no
fukki, no report. A tab the human does not reopen is a parked seat. A turn
the reload cut is continued by a word in the tab, which is the harness's
behavior and not a rule of this skill (P-7 measures it).

The roster's Name cell is a record, not an address. The spawner's
`renamed` mark and the `ack` op stay as they are, and Kanri rewrites the
cell at a census as today; the bug-report route, which reads another
repository's roster for a name, falls back to that roster's first data row
— a Kanri, whose name does not change — exactly as it does now when a name
is not listed.

### 3.2 What stays of the `no-role` line

Every tanto line keeps its second line. No window is `/clear`ed under a
role any more, but two senders can still reach a session that holds no
role: one that read a name from the state file seconds before a reload
gave that name to another window, and a bug-report sender reading another
repository's roster. On a `no-role` reply the sender re-reads the address
and sends once more; it marks no row.

## 4. The launcher

### 4.1 The form and the words

```console
tanto [<role>] [<topic>] [--attach | --no-attach] [--root <path>] [--timeout <ms>]
tanto fukki
tanto teishi [--seats]
tanto jokyo
```

One word table serves the launcher and `/tanto`, each word accepted in
romaji, kana, kanji, and its English alias:

| Word | Also | Where | Does |
| --- | --- | --- | --- |
| `fukki` | ふっき, 復帰, `resume` | the launcher; Kanri | puts the run back (4.4) |
| `taiseki` | たいせき, 退席, `leave` | a Kikaku, a Hosa, a standalone Kaiseki | ends the seat (5.2) |
| `teishi` | ていし, 停止, `stop` | the launcher | stops the spawner; with `--seats`, the seats too |
| `jokyo` | じょうきょう, 状況, `status` | the launcher | prints the run's seats, read-only (4.5) |

A launcher word typed as `/tanto <word>` in a session is answered with one
line naming the terminal command, and a session word typed at the launcher
likewise. `down` is retired with no alias (D-12). The role words are the
seven of `SKILL.md`'s Invocation table. The positional `<root>` is retired
for `--root`, since a role word now stands first.

`-a` and `-n` are the short forms. With neither, every role attaches
(D-10). `--no-attach` starts or ensures the seat, prints its name and the
two ways in — `tanto <role>` and, for a dialogue seat, the editor's list
after a window reload (C-3) — and exits.

### 4.2 Resolving a role

- `kanri`, or no role: as `cmdUp` does today — the roster's first row, the
  state file, a handover's successor.
- `kikaku`, `hosa`: the state file's seat of that role whose status is
  `running`, `blocked`, or `parked`; when there is none, the launcher
  writes the `spawn` request and waits for its result.
- `kaiseki`: with a `<topic>`, that topic's attached Kaiseki; with none,
  the one Kaiseki the state file holds, attached or standalone; when there
  is none, a standalone Kaiseki is spawned.
- `sekkei`, `keikaku`, `jisso`: the seat of that role, by `<topic>` when
  more than one is held — the launcher then prints them and exits 2. When
  there is none it prints
  `no <role> is held; Kanri starts one — tanto kanri` and exits 1.

The launcher starts the spawner when none beats, for every form but
`jokyo`. It starts a Kanri only for `kanri` and `fukki`: `tanto kikaku` in
a repository with no run starts the spawner and the Kikaku and no Kanri,
and that Kikaku holds its `decision:` line until a roster exists.

### 4.3 The attach, and following a handover

1. Write `hold` and wait for its result. `error: "in a tab"` prints
   `<role> is open in a VS Code tab; close the tab and run this again` and
   exits 1 — a seat is in one place at a time.
2. Run `claude attach <id>` with the repository root as its cwd and the
   terminal's stdio inherited (H-1c: the agent view that ← opens runs in
   that cwd, which is trusted).
3. When it exits, whatever its code, write `release`.
4. **Follow.** Read the state file and the roster. When the seat just left
   is a Kanri that is now `stopped` and a successor exists — the roster's
   first row names another `sessionId`, or `kanriSuccessor` finds a pending
   or finished handover spawn — go to step 1 with the successor, waiting
   for its result up to `--timeout`. The human types nothing (D-3, H-1b).
   Otherwise print the listing of 4.5 once and exit 0.

The decision in step 4 is taken from the files, never from the exit code:
a stopped session ends the attach with 0 (H-1b), and a detach followed by
leaving the agent view ends it with 1 or 0 as the human's last key decides.

### 4.4 fukki

`tanto fukki` does, in order: start the spawner when none beats; write a
`resume` request for every seat the state file holds `running` or
`blocked` that the listing does not hold with a `pid` — and for a Kanri
held `gone` — never for a `parked`, `stopped`, or `removed` seat; then
tell Kanri; then attach to Kanri unless `--no-attach`.

Telling Kanri takes one of two forms, and the human types nothing in
either (D-15):

- **Kanri was resumed** by this run of the launcher: its `resume` request
  carries `prompt: "/tanto fukki"` (S-3).
- **Kanri is alive**: the launcher writes a `spawn` for a **messenger** —
  `role: "denrei"`, `once: true`, the family and effort of
  `sessions.denrei`, and a prompt that is not a `/tanto` invocation: send
  the session named `<Kanri's name>` the line
  `fukki: requested at the launcher` with its `no-role` second line, by
  `SendMessage`, and end. The spawner stops and removes a `once` seat when
  its first turn has ended, by the test of 2.3's first condition. `denrei`
  (伝令) is a seat with no role file, as shoki is; `templates/tanto.json`
  gains `sessions.denrei`, `{ "model": "haiku", "effort": "low" }`.

A bare `tanto` keeps doing what it does: it starts the spawner, resumes
what a restart took, and enters Kanri; it passes the fukki word to a Kanri
it resumed and sends no messenger. `tanto fukki` is the same recovery with
Kanri told in every case.

`/tanto fukki` in Kanri, and the `fukki:` line, and a resume whose prompt
is `/tanto fukki`, are one procedure, `roles/kanri.md`'s rewritten
"Recovery": run the census and act on its six headings; reconcile the
`renamed` marks; answer every `unanswered:` line; for every `paused:` line
the ledger's Measurements holds unanswered, probe the family once and send
`continue: <dispatch> — same model`; send a Jisso resumed mid-batch
`resume batch X from task N`; and print, in the idle block, what was put
back. A Kanri that finds `.tanto/kanri-handover.md` naming itself as the
outgoing session asks the human whether to continue or hand over, and
infers neither (issue-bed3). There is no "windows are back" to wait for:
no tab holds state the run needs, so the `recovery: begun` and `recovery:
windows back` events go, and the census marks at once.

A token limit is the case D-5 names beside a stopped process: the paused
roles idle, and `fukki` is the human's word that the quota is back.

### 4.5 jokyo

`tanto jokyo` reads the state file, the listing, and the roster's first
row, starts nothing, writes nothing, and prints one line per seat that is
not `stopped` or `removed`:

```text
kanri    —                 working
sekkei   run-owned-seats   parked — waiting for you       tanto sekkei
jisso    run-owned-seats   blocked — permission prompt    tanto jisso
kikaku   —                 in a tab
hosa     —                 parked
```

The third column is `working` (listed, `busy`), `idle`, `blocked — <cause>`,
`parked`, `parked — waiting for you` (`waiting: true`),
`parked — mid-turn`, `in a tab`, or `gone`; the fourth is the command, for
a line that waits on the human. It is printed in English, as the
launcher's lines are. With no spawner beating it says so on its first
line and prints what the state file holds. The same listing is printed
once when an attach is left (4.3). This is where "what waits on him" is
read from disk and not from Kanri's last message (`exp-9d8f`).

### 4.6 teishi

`cmdDown` under its new word. `--seats` writes a `stop` for every
`running` or `blocked` seat; a `parked` seat is already stopped and stays
`parked`. Nothing else changes.

### 4.7 An old-shape roster

At a start the launcher reads the roster once, and so does Kanri at step 4
of its Start: a row whose status is `cleared`, or a `live` or `queued` row
whose `sessionId` the state file does not hold, is an old-contract row.
The launcher prints
`old-contract rows in .tanto/roster.md (<roles>): run tanto teishi --seats, then tanto`
and goes on. Kanri says the same in its start line, sends nothing to those
rows, and marks them `dead` at its census with the Events line
`old-contract row retired: <name>`. That is the whole of the migration's
code (D-7).

## 5. A seat's end

### 5.1 At a boundary

`release:` and `cleared` go. Every seat that ends at a boundary — Sekkei,
Keikaku, Jisso, an attached Kaiseki, shoki — ends as a terminal seat does
today: Kanri checks the proposal's form, records its items, and writes the
`stop` request, the row going `stopped`. Nothing is said to the seat and
nothing to the human: the line "`<role> <name>` released — … /clear its
window when convenient" goes with the window (`exp-9d8f`).

`stop` on a seat the listing shows with `kind: "interactive"` stops
nothing — `claude stop` does not reach the editor's process — and the seat
is recorded `stopped` with `note: "in a tab"`; on a `parked` seat it
records `stopped` with `note: "already exited"`. Ending means that nothing
is sent to the seat again. The seat's own closing line at its final
boundary reads `Still needs this seat: none — this seat has ended; close
its tab if one is open`, in place of `none — /clear this window` (R-7).

### 5.2 taiseki

`/tanto taiseki` is accepted by a Kikaku, a Hosa, and a standalone
Kaiseki; any other role answers `this seat ends at its boundary, by the
run` and does nothing. The seat:

1. Writes out what is unsent. A Kikaku with something decided and no file
   writes the decision file and sends its `decision:` line. A Hosa with a
   `chore:` open or a `slot-needed:` unanswered says which, and does not
   leave. A standalone Kaiseki runs its shoroku and commits, as
   `roles/kaiseki.md` already asks before the human closes it.
2. Runs
   `node "$TANTO/scripts/boundary.js" request leave --transcript "$T"`,
   which writes a `stop` request for its own `sessionId` with
   `self: true`.
3. Ends its turn with its closing line, the second fact as 5.1's.

The spawner acts on a `self` stop only once the seat's turn has ended
(2.3's first condition), so the closing line is written. The seat is
`stopped` with `endedBy: "taiseki"`; the next `tanto kikaku` finds no
holder and starts a new conversation; Kanri writes the row `stopped` at
its next census (2.7, **Ended**). A seat never left this way stays parked,
at no cost, and the next entry by role continues it.

Kikaku and Hosa still write no shoroku proposal.

## 6. File by file

Scripts, each with its `.test.js` in the same task.

- **`scripts/spawner.js`** — `OPS` gains `park`, `hold`, `release`;
  `handleRequest`'s branches for them (2.3, 2.4); `resume` takes `prompt`
  and the two guards and the copy check (2.5); `spawn` refuses a second
  holder (1.2), accepts `once` and stops and removes such a seat after its
  first turn (4.4), and records the request's id on the seat; `stop`
  accepts `self` and waits for the turn's end, and records `in a tab` and
  `already exited` (5.1, 5.2); the seat schema gains `parked`, `parkedAt`,
  `waiting`, `midTurn`, `parkRequest`, `held`, `kind`, `waitingFor`,
  `endedBy`, `requestId`; a `tryPark` run at every pass; a `turnEnded`
  reader over the transcript's tail; the census reads `kind`, `status`,
  and `waitingFor`, writes the listed name of an entry of any kind, keys
  `blocked` on `status: "waiting"` (2.6), turns a dialogue seat's absence
  into `parked` (2.7), and clears a dead launcher's `held`; `noticeText`
  for `waiting:` and for `blocked:` with its cause; the header comment's
  "terminal seats".
- **`scripts/tanto.js`** — `main` dispatches the four words with their
  aliases, a role word, `--attach`/`--no-attach`, `--root`; `cmdUp` loses
  its positional root, runs the attach itself (4.3) with the follow loop,
  and no longer prints `claude attach <id>` or `then type /tanto fukki
  there once`; role resolution (4.2); `cmdFukki` (4.4); `cmdJokyo` (4.5);
  `cmdDown` renamed `cmdTeishi`; the old-shape check (4.7); the branch
  "Kanri is an interactive tab; hand over first" goes, since no Kanri is a
  tab; `LEAVE_LINE` rewritten for ← and the agent view.
- **`scripts/boundary.js`** — `census` reads the state file and prints the
  six headings with the suffixes of 1.3 and 2.6 (2.7); two new
  subcommands, `request <park|leave> --transcript <path> [--notice]` and
  `seat <sessionId>` (2.2, 2.5, 5.2); `record --status` loses `cleared`
  from its vocabulary; `writeSeatRow`'s comment.
- **`scripts/reading.js`** — nothing but `loadSessions` returning
  `sessions.denrei` with the other eight keys, which it does by reading
  the map whole; its test gains the key.
- **`templates/tanto.json`** — `sessions.denrei`.

Documents.

- **`SKILL.md`** — the frontmatter description's role list is unchanged.
  "The roles": the Count and Talks-to cells that say "opened by the human"
  and "the `release:` lines to tab seats". "Invocation": the word table of
  4.1 beside the roles; the fukki paragraph; the prompt table gains
  Sekkei, Kikaku, Hosa, and both Kaisekis. "Start sequence": step 1 loses
  the tab seat's stop; step 2, "Handshake", is replaced by one paragraph —
  no seat sends one. "The expected-model config": `sessions`' key count
  and list gain `denrei`; the launcher's printed lines are unchanged in
  language. "Handshake and roster" becomes "The roster": the handshake
  line, its fields, and its matching go; the status words lose `cleared`;
  `refused`, a handshake that got no row, goes with the handshake unless
  the plan's grep finds another use, which this spec expects it will not,
  leaving `queued`, `live`, `stopped`, `replaced`, and `dead`; the census
  paragraph takes 2.7's headings; "The address"
  takes 2.5's rule and 3.1. "Resuming": the table's first row (a tab seat
  resumed by the editor) becomes 3.1's sentence; the fukki paragraphs take
  4.4; the `ListAgents` self-check goes. "Messages": the `no-role` bullet
  per 3.2; the `release:` bullet goes; the closing line's identity is the
  bare name and its last fact is 5.1's. "Human access": the grant's steps
  name `tanto <role>` for every seat; the four standing grants' sites per
  1.1. "Session exit": every `release:` and `/clear` clause per 5.1;
  Kikaku's and Hosa's end per 5.2. "Artifacts": the roster row, the
  spawner row (the new ops), the launcher sentence. "Rules": 4 (no "opened
  by the human"), 10 (a tab's name is the editor's and changes; nothing
  keys on it). "Workspace": unchanged. A new short section, "The faces of
  a seat", carries 2.1, C-1 to C-4, and the one-place-at-a-time rule.
- **`roles/kanri.md`** — "Start": step 1's two ways of reading its own
  name become one; step 6's "wait for … handshakes" and the `/tanto
  kikaku` suggestion (now `tanto kikaku`); "The four cases": the
  same-window Handover clauses, the "interactive tab" reminder, "Yours" as
  a typed `/tanto kanri`, "Second Kanri"'s `/clear`ed window. "On a
  handshake" is deleted but for its last three paragraphs — the scope
  input relay, the `decision:` handling, and "Send nothing to …", which
  becomes 2.5's rule; the orders that were its step 4 move to "Create".
  "A seat's exit": step 2's `release:` half and the released line; the
  tab-seat paragraph. "Human access": step 2's two forms become one; step
  3's sites. "Session lifecycle": the opening paragraph and the numbered
  list go; "The census" takes the six headings; "While a restart is being
  recovered" goes; "Create": the requests table gains Sekkei and the
  attached Kaiseki at the Asks table's moments, and the Asks table goes;
  a row for "the human asks, from anywhere, for a parked seat to be woken"
  — one `resume` with no prompt, which makes the seat reachable from
  Remote Control (the Kikaku file's open item 7); "Replace": the three
  "the ask" cells become `spawn` requests, and the Kikaku row goes
  (issue-5601's row can no longer be written at all); "Release": every
  `release:` and `/clear`; "Recovery after a VS Code restart" becomes
  "Recovery", 4.4's procedure. The Handover section's spawn of the
  successor gains `successor:` (1.2).
- **`roles/sekkei.md`** — the opening's grant sentence and "You have done
  the model check and sent the handshake"; the keys in place of the orders
  line throughout; the park rule (2.2), at Step 1's questions and at the
  review gate; "The boundary reply" loses the self-check; the tenure's end
  loses `release:` and the `/clear`, and gains 5.1's closing line.
- **`roles/keikaku.md`** — the park rule at its plan dialogue and its
  review gate; the self-check where it has one.
- **`roles/kikaku.md`** — "How you start" (`tanto kikaku`, no handshake,
  the open topics read from disk); "Lifecycle" (parked between the human's
  visits, `taiseki`, no `/clear`); the park rule.
- **`roles/hosa.md`** — "How you start", with its standing grant stated
  here; "Lifecycle" (`taiseki`; `/compact` stays as it is); the park rule;
  the intake's "checked against `ListAgents`" stays.
- **`roles/kaiseki.md`** — "Two ways you are started" (the `brief=` key;
  `tanto kaiseki` for the standalone); the exit's `release:` and `/clear`;
  the report's self-check; `taiseki` for the standalone; the park rule.
- **`roles/jisso.md`** — the self-check and any "terminal seat" wording;
  no behavior changes.
- **`templates/roster.md`** — the keeping rule's handshake sentences; the
  status paragraph.
- **`templates/spawn-request.md`** — the writers; the ops and their
  fields; `role`'s list and the sentence "A tab seat is never spawned and
  never has a request"; the results.
- **`templates/kanri-handover.md`** — its Live peers section's wording
  where it names windows; it lands with the role files (rule 11).
- **`README.md`** — the way in (`tanto`, `tanto <role>`, the four words);
  the faces and C-1 to C-4; the migration paragraph of section 7.

Not touched: `templates/boundary-brief.md`, `templates/batch-prompt.md`,
`templates/shoki-brief.md`, `scripts/passage-check.js`.

## 7. Migration, rule 11, and this plan

**Other repositories** (D-7). The skill is read through a link, so the
merge reaches every new session at once. A run in flight elsewhere moves
when the human chooses: `tanto teishi --seats`, then `tanto`, once, and he
closes the windows of that run's old tab seats. Until then such a run is on
seats that read the old text and a spawner on old code, and 4.7's line is
what a new launcher or a new Kanri says on meeting its roster. The README
carries the paragraph. Between this plan's merge and a repository's
switch, the old `tanto down` is no longer a word of the launcher on disk:
the paragraph says `tanto teishi`.

**This plan** edits the skill it runs on, so rule 11 governs it: its
Jissos are all spawned at the landing with `queue=run-owned-seats`; the
authority while it is in flight is its Global Constraints, Kanri's orders,
and the batch prompts; `SKILL.md`, the seven role files, and
`templates/kanri-handover.md` land in one batch, the last; the safe
boundary, from which a role may be started or replaced, is that batch's —
or the fix wave's when the whole-branch review's findings touch `SKILL.md`,
a role file, or a template. This run's own Kikaku and Sekkei are tab seats
of the old contract to the end, and this run's close runs on the old
`release:` for them. After the close, this repository moves as every other
does.

**The resident spawner keeps the code it started with.** The scripts'
batch is verified by `node --test` and by P-3 on a spawner started for the
measurement in a scratch root, never on the resident one. The human
restarts the resident spawner (`tanto teishi`, `tanto`) once, after the
final batch is accepted and before the acceptance scene of "Verification",
which needs the new code.

## 8. Constraints, risks, and what the plan measures first

Constraints, stated in the README and in `SKILL.md`'s "The faces of a
seat":

- **C-1** — a dialogue seat is entered from a terminal by `tanto <role>`,
  not by a bare `claude attach` (2.4).
- **C-2** — a parked seat is offline to Remote Control until something
  wakes it; from there the human asks Kanri.
- **C-3** — a seat started after the editor's list was loaded is in the
  list after `Developer: Reload Window`.
- **C-4** — a tab's turn runs at the editor's effort and on the
  extension's bundled binary; a version gap that keeps a tab from opening
  is accepted, since the terminal remains.

Risks, as put to the human (D-11): R-1, a park that takes background work
with it — role text (2.2) and condition 2 of 2.3, whose `busy` reading is
P-1's; R-2, delivery to a parked seat depends on the spawner — 2.5's
heartbeat line; R-3, undocumented listing fields and transcript records —
when unsure, no park; R-4, the copy race — 2.5's guards and the copy's
removal; R-5, a line arriving during a stop — the state written first;
R-6, the parts that are protocol — a forgotten park costs a notice on a
row, and the supervisor's idle hour stops the process anyway; R-7, a
stopped seat's open tab — 5.1.

The plan's first task measures, each with what the design does when the
measurement goes the other way:

| # | Measure | If it fails |
| --- | --- | --- |
| P-1 | What the listing shows for a seat whose turn ended with a subagent, or a background command, still running. | Condition 2 keeps `status: "idle"` and the README says the guard is the role text alone. |
| P-2 | What becomes of a `SendMessage` delivered while its receiver is being stopped. | 2.5's rule gains: a line unanswered by a seat the state file showed `parked` within the minute is sent again by `resume`. |
| P-3 | The round trip for a seat the spawner spawned: park, a tab, the tab closed, a resume with a prompt. | The differing step is fixed; the design is not expected to move. |
| P-4 | A bare `claude attach` to a parked seat. | C-1's sentence is rewritten to what was seen. |
| P-5 | The messenger: that a `once` seat sends its one line under `--permission-mode auto`, and its cost. | `tanto fukki` with Kanri alive prints `Kanri is alive — type /tanto fukki there` before the attach, and `denrei` is not shipped. |
| P-6 | `claude attach` run by Node with no shell, on Windows. | The attach keeps the shell, with its arguments fixed to an id matching `^[0-9a-f-]+$`. |
| P-7 | A window reload while a tab's seat is mid-turn (the human's hands). | The README's C-3 sentence says what was seen; the design does not move. |

## Old values this plan contradicts

Needles, each with its file and heading; the plan measures each at zero
over the files it touches, and greps the first eight across
`skills/tanto/` as a whole, since the sites of section 6 are the ones this
Sekkei found.

- `tab seat`, `terminal seat` — `SKILL.md`, the role files, the two
  templates, the scripts' comments.
- `handshake` — everywhere but a sentence that says no seat sends one.
- `release:` and `released —` — `SKILL.md` "Messages" and "Session exit";
  `roles/kanri.md` "A seat's exit", "Session lifecycle", "Release";
  `roles/sekkei.md`; `roles/kaiseki.md`.
- `/clear` — every site; `/compact` in `roles/hosa.md` stays.
- `cleared` — `SKILL.md`, `roles/kanri.md`, `templates/roster.md`,
  `boundary.js`'s `--status` vocabulary.
- `orders line` — `SKILL.md`, `roles/kanri.md`, `roles/sekkei.md`.
- `tanto down` and `cmdDown` — `SKILL.md`, `README.md`, `tanto.js`.
- `self-check` — `SKILL.md` "Resuming" and "Messages"; `roles/sekkei.md`;
  `roles/kaiseki.md`; `roles/keikaku.md`; `roles/jisso.md`.
- `SKILL.md`, "Start sequence": "ask them to run `/model <family>` and
  then `/tanto` again, and stop".
- `SKILL.md`, "The address": "Kanri sends only to the names of `live`
  roster rows".
- `SKILL.md`, "Resuming": "`/tanto fukki` is a **tab seat's** word
  everywhere else".
- `SKILL.md`, "Messages": "`none — /clear this window`".
- `SKILL.md`, "The expected-model config": "Its eight keys are the seven
  roles and `sessions.shoki`".
- `roles/kanri.md`, "Session lifecycle": "you ask the human for", "Every
  ask is this numbered list", "**Asks**, which are the numbered list
  above", "until the human says the windows are back".
- `roles/kanri.md`, "Start": "and from `ListAgents` when the human typed
  `/tanto kanri` in a tab"; "Wait for the human and for handshakes".
- `roles/kikaku.md`: "Kanri never asks for a Kikaku and never spawns one";
  "The human `/clear`s this window when the subject changes".
- `roles/hosa.md`: "Kanri never requests a Hosa. The human opens one".
- `templates/spawn-request.md`: "A tab seat is never spawned and never has
  a request"; "`role` — `kanri`, `keikaku`, `jisso`, or `shoki`".
- `scripts/tanto.js`: "Kanri is an interactive tab; hand over first";
  "then type /tanto fukki there once"; `resolveRoot(positionals[0])`.
- `scripts/spawner.js`, `censusSeat`: `session.state === "blocked"` as the
  test for `blocked`.
- `scripts/boundary.js`, `cmdCensus`: `session.state === "blocked"`;
  `CENSUS_HEADINGS` as four.

## Requirements

Under the experience layer the requirement register is `docs/experience/`,
and this section names the expectations. This design serves `exp-c53d`,
`exp-173f` of `exp-06b2`, and `exp-9d8f`, `exp-1c96`, `exp-3a9e`,
`exp-26d5` of `exp-57f4`, each named in Fixed inputs or in the section
that serves it; it edits none. One candidate stands for the close's
recommender, to be grouped `Unsure` and put to the human: *an ordinary act
of his tools — an editor reload, a tab closed — asks nothing of him and
nothing of the run* — its source is D-9, 「VSCode側の都合（本体や拡張の更新）で
reload 相当の処理が走ることは1,2日に1回はあると思っていい」; it is close to
`exp-c53d`'s "learns what he did without his reporting it", and the
recommender proposes whether it sharpens that line or stands beside it.

## The ADRs

Written by the close's apply under `docs/decisions/`. Three, cut by
subject, so that each can be amended alone.

1. **Every seat is spawned by the run; identity is the `sessionId`, and a
   name is looked up at the send.** Sections 1, 3, and 5.1: no tab seat,
   no handshake, no `release:`, no `cleared`; the `stop` follows the form
   check at every seat; orders in the prompt's keys; one holder per role
   at the spawner; the `no-role` line kept for the two senders of 3.2.
   Rejected: keeping tab seats beside spawned ones — the handshake,
   `release:`, and `/clear` rules would stay and `exp-c53d` and `exp-9d8f`
   stay unmet for those seats (the Kikaku file's section 6); the tab as
   the only face, or no tab at all (the same section); a compatibility
   period in which a new Kanri handles old tab seats — the rules this
   topic removes would stay in Kanri for the migration's sake (D-7); a
   name stored as the address and repaired on a rename — an editor reload
   is ordinary, and every repair is an act asked of someone (D-9).
   **Supersedes** decision-363c. **Amends** decision-8320 ("spawned seats
   do not handshake" is every seat's; the `cleared`/`stopped` pair is
   `stopped` alone), decision-cdc4 (no seat the human opens; its census
   gains the state file as a second input), decision-0ea5 (what follows
   the form check directly is the `stop` request), decision-ded8 (the
   clear rule and `cleared` go; `dead` and `replaced` stand),
   decision-7c87 (the spawner names every seat; a resume may carry a
   prompt, which is not a flag), decision-73c3 (the address is not a
   stored name; the roster stays the record, its first row Kanri's), and
   decision-08bc (no stop on a mismatch and no refusal; the spawner starts
   the seat on the configured family, and the check warns).
2. **A dialogue seat is parked while it waits for the human, at its own
   request, by the spawner, once its turn has ended.** Section 2: the
   request and its `--notice`; the three conditions; the state written
   before the stop; the hold; the resume's two guards and the copy's
   removal; `blocked` keyed on `status: "waiting"` with its cause; a
   dialogue seat's absence read as `parked`. Rejected: seats kept alive
   and the launcher stopping one on request — the row shows the notice
   whenever the human clicks it directly (the Kikaku file's section 6);
   the spawner parking on its own reading of the listing — an idle seat
   may hold a subagent in flight or await Kanri, and only the seat knows
   its turn ended on a question; Kanri parking — a wake-up of Kanri's per
   park; parking Kanri too, or only at a kessai — every peer line would
   need a resume, and the copy race is likeliest there (D-1); a link from
   outside the editor to open the tab — three attempts opened nothing and
   the editor went down once (H-2b, H-2c). **Amends** decision-39fb (a
   parked seat's resume is an expected path, not a recovery; `stopped`
   remains a stop that ends a seat), decision-362e (the census revives a
   `gone` seat that returns, and a `parked` one is `running` again when it
   is listed in the background), and decision-1c07 (two further notices,
   `waiting:` and the cause on `blocked:`).
3. **The launcher enters a seat by role and follows a handover; one word
   table for the launcher and `/tanto`.** Section 4: the form; attach by
   default for every role; the hold around the attach; the follow decided
   from the files; `fukki` with the messenger; `jokyo`; `teishi`; `down`
   retired; the positional root retired. Rejected: `-fg`/`-bg` as the
   switch names — a seat is always a background session; dialogue seats
   not attaching by default — a fresh seat is not in the editor's list, so
   the default would start a seat the human cannot open, and it would
   presuppose VS Code (D-10); a default that depends on whether the seat
   was just started — the outcome is unknown until typed; `--new` on the
   launcher for a fresh Kikaku — the end is said in the seat, from any
   face (D-2); a free-form word in the seat for the end — 「終わり」 also
   reads as "for today" (D-4); English at the launcher and Japanese in
   sessions — two words for one act; `down` kept as an alias, and
   `suspend` for `teishi` — the first has no pair and reads as a
   teardown, the second promises more than `teishi` without `--seats` does
   (D-12); `tanto -n` as the status listing — it starts a Kanri when none
   exists (D-14); two steps for fukki when Kanri is alive, a deliberate
   stop-and-resume of a live Kanri, and a signal file read at Kanri's next
   wake-up (D-15). **Amends** decision-84c8: the launcher is still one
   program that ships with the skill and is still fukki when typed bare;
   it takes a role and four words, and its "rejected: a listing
   subcommand" is reversed for `jokyo`, since `claude agents` shows
   neither a role nor a parked seat.

## What the plan must contain

- Four batches, cut by what must land together: **A** the measurements
  P-1 to P-6 as its first task, their results written to
  `.tanto/run-owned-seats/` and each fallback of section 8 applied to the
  tasks after it, then `spawner.js` with its tests; **B** `tanto.js`,
  `boundary.js`, `reading.js`'s test, and `templates/tanto.json`, with
  their tests; **C** `templates/roster.md`, `templates/spawn-request.md`,
  and `README.md`; **D** `SKILL.md`, the seven role files, and
  `templates/kanri-handover.md`, in one batch, which is the safe boundary.
  The cut inside a batch is Keikaku's.
- The Global Constraints carry rule 11's authority sentence, the queue,
  the safe boundary, and section 7's two facts: this run's own tab seats
  stay old-contract to the close, and the resident spawner is restarted by
  the human after the final batch and before the acceptance scene.
- The Old values list, measured at zero over the touched files at every
  boundary; its first eight needles grepped across `skills/tanto/`.
- `node --test skills/tanto/scripts/` green at every task that touches a
  script; a task lands its code and its tests together, and the task that
  changes `blocked`'s key brings every fixture that sets `state:
  "blocked"` with it.
- The status words of `SKILL.md`'s roster section decided by grep in the
  task that rewrites it: `refused` stays only if a use remains.
- A last task, the acceptance scene of "Verification", with P-7 in it.

## Verification

- `node --test skills/tanto/scripts/` green at every boundary, with new
  tests for: each of 2.3's three conditions holding the park alone; a void
  request; the state written before the stop; `hold` on a parked seat and
  on a seat in a tab; a dead launcher's hold cleared; the resume's two
  guards and the copy's removal; `blocked` on `status: "waiting"` and not
  on `state: "blocked"`; a dialogue seat's absence read as `parked` and a
  Jisso's as `gone`; the second-holder refusal and `successor`; a `once`
  seat removed after its turn; a `self` stop waiting for the turn's end;
  the census's six headings; `request park`, `request leave`, and `seat`;
  the word table with every alias; role resolution for each row of 4.2;
  the follow loop taking a successor and exiting on a detach; each of `jokyo`'s
  third-column values; the old-shape roster line.
- The Old values at zero; `./scripts/lint.sh` on the changed paths.
- **The acceptance scene**, by the human's hands on the landed text and a
  restarted spawner, its seven observations recorded in the ledger's
  Measurements for the dogfood report: `tanto kikaku` starts a Kikaku and
  attaches; a turn, then ← and leaving the agent view, and the launcher
  prints the listing; `Developer: Reload Window`, and the Kikaku's row
  opens by a double-click with no notice; the tab closed, and `tanto
  jokyo` reads `parked`; a `resume` request with a prompt, written by
  Kanri, brings it back and the line is answered; `/tanto taiseki` ends
  it, and `tanto jokyo` no longer lists it; a reload while a tab's seat is
  mid-turn (P-7).

## Out of scope

- The roster's own shape — the row's matching key, a status tied to the
  `stop` request, a predecessor's transcript trail: `roster-ledger`
  (issues dfb3, cd46, e525, and what is left of 007e).
- A tie-break between two same-instant successors (issue-e843): 1.2's
  refusal makes the second request an error, which removes the case this
  design can see; the rule for a case that still gets through stays that
  issue's.
- Hosa's slot protocol and its line for a Kanri-only act (issues 3a7c,
  a016); the workspace-root sweep (9d17); the three gaps of 75a9.
- `claudeProcessWrapper` as a remedy for a version gap (the Kikaku file's
  open item 9): not measured, not named.
- Any act on a tab's effort (its open item 4): C-4 states it.
- Starting a session from another device (`claude remote-control`).
- `passage-check.js` and the passage instrument: this plan runs on it as
  it is.

## Issues this design closes

Each term the design retires was grepped once across `docs/issues/open/`
(312 files): "handshake" (sixteen issues), "release:" (three), "cleared"
(seven), "/clear" (six), "fukki" (eight), "tab seat" (three), "tanto down"
(one), "self-check" (none), "orders line" (seven), "no-role" (four),
"refused" (eight), "idle since" (three), "blocked" (seventeen). The kin
the input document names are read in `notes-issues.md`, the others the
greps named in `notes-issues-2.md`.

- **bd69** — closes: there is no `/clear` to be reminded of, and a seat
  that waits is parked.
- **7c35** — closes: no handshake arrives for a role whose row's session
  is not listed.
- **127d** — closes: the spawner starts a Sekkei on the configured family,
  and no ask names one.
- **c30e** — closes: Hosa's grant is stated in `roles/hosa.md` (1.1).
- **fcd3** — closes: a seat's own name is the bare name from the listing,
  and no seat writes a `[ref]` about itself (1.3).
- **5601** — closes: the Replace table's Kikaku row goes.
- **feac**, resolved, whose cause half its text defers — answered by 2.6;
  the close's apply notes it in the resolved issue's text and files
  nothing new.
- **a14f** — closes for its symptom by 1.2; its resolution names the
  writer as never identified.
- **1c9d**, **2e19**, **bdad**, **bed3**, **007e** — closed in part: the
  `/clear` gap of 1c9d and its `no-role` delivery; 2e19's `cleared` count;
  bdad's fukki item; bed3's rule, carried into 4.4; 007e's `cleared` half
  and its fifth case. The close's apply marks the items in each text, and
  each stays open for the rest.
- **2065**, **5f98**, **37ec** — closed in part, from the greps: 2065's
  findings whose sites are text this design deletes (its Tasks 2, 6, 7, 8,
  12, 22, 23, 25, 26, where they name `cleared`, the handshake, or
  `release:`); 5f98's Q4, the `/clear` identity note; 37ec's item 7, a
  resumed tab seat reading `ListAgents` machine-wide.
- **Stale in wording, not closed** — the close's apply rewrites the named
  phrase in each text and leaves the issue open: "orders line" in dadc,
  322d, 1096, and 28f2 is the seat's own prompt keys; "`tanto down`" in
  f03b is `tanto teishi`; "handshake" as the site of a check in 1298,
  42fc, 9c6f, and 1bff is the seat's start; `/tanto fukki` as a resumed
  seat's word in c820 is Kanri's and the launcher's; a retiring Jisso's
  "`release:`" in 22e9 and a23a's item 3 is its `stop` request, and the
  timing those two ask about is unchanged by this design; and the items of
  13ab, fb90, and 2f88 that name `cleared`, a cached address, or a tab
  seat. 1368 and b106 are untouched in substance: an idle seat's
  collection is now 2.7's `parked` for a dialogue seat, and a send to a
  `replaced` Kanri's name is still answered by the roster's first row.

## Answers to the spec inputs

No `spec-inputs.md` exists and no `I-n` reached this seat. Sections 1.1,
2.5, 2.7, 4.4, and 5.1 rewrite Kanri's own procedure; Step 2 puts those
passages to Kanri before the reviewer is dispatched, and its answer is
recorded here.

## Deferred items

- The effort of a tab's turn (C-4): whether a seat configured for `max`
  should say so when a tab turn ran at another level.
- `claudeProcessWrapper`, after a measurement of its own.
- A usage-limit pause's reading in the listing (2.6): unmeasured, since a
  limit cannot be produced on demand.
- `tanto <role> --new`, should saying the end in the seat prove not
  enough (D-2).
- Waking a parked seat from Remote Control without Kanri.
- Whether `renamed` and `ack` are still worth keeping once nothing
  addresses by name: `roster-ledger`'s to decide.

## Shoroku proposal from this spec work

This section excludes the spec's own sections above, the spec review, and
the dialogue, which the close's recommender reads for itself.

1. Measured (S-1 to S-5, H-1a to H-2i): the spike's table in
   `.tanto/run-owned-seats/notes-spike.md`, whole, with the Kikaku file's
   M-1 to M-7. Destination: notes (`claude-code-sessions-observed.md`).
2. Observation: until this design the spawner's `blocked` was the
   listing's `state: "blocked"`, which a seat that answered and waits also
   carries (S-1) — every idle seat with a `pid` read as blocked, and its
   toast was raised on that. Destination: design (design-4807, the
   spawner's section).
3. Observation: the editor's session list is loaded once per window and is
   not refreshed by reopening it or by its search; a reload, or a restart,
   refreshes it (H-2a, H-2h, H-2i). Destination: notes.
4. Observation on the process: three `vscode://anthropic.claude-code/open`
   attempts from outside the editor opened nothing, one printed a crashpad
   `CreateFile` error, and VS Code went down once around them; cause not
   established. Destination: notes, as a caution beside the Kikaku file's
   M-2.
5. Observation on the process: this Sekkei was re-handshaken twice in one
   day, after an editor crash and after a window reload — the cost this
   design removes, counted once. Destination: reports (the dogfood
   report).
6. Observation on the process: Sekkei twice chose the smaller change over
   the right one and the human named it — `down` kept as an alias, and the
   two-step fukki. A recommendation that keeps an old name or an extra
   step should say that keeping it is the reason. Destination: issues.
