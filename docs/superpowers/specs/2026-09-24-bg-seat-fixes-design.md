# Design: bg-seat-fixes — a rework keeps its own files; a dispatch hands back with a status, never with work of its own running; a listing entry with no `pid` is not a live session; a terminal seat that has gone is resumed before a line is sent to it; the human's language is a setting

Written by Sekkei `dotskills-1a [240a33]` (opus, max) on 2026-09-24 as a
draft at `.tanto/bg-seat-fixes/spec-draft.md`, while `bg-seat-ergonomics`'s
batch C was in flight (Kanri's orders line; `bg-seat-ergonomics` R-8, this
topic's R-1). Nothing is committed until the checkout frees: the Keikaku
spawned after `bg-seat-ergonomics`'s merge commits this text unchanged at
`docs/superpowers/specs/2026-09-24-bg-seat-fixes-design.md`. The dialogue is
`.tanto/bg-seat-fixes/dialogue.md`: the human's answers Q1 to Q9, the
measurement M-1, Kanri's passage check P-1, and the reports' arrival E-1.

**The skill this spec read.** Pinned at commit `a062698` ("docs: the
contract's shoroku vocabulary — shoroku proposal, the close's files by the
step, no stage word"): at this seat's start HEAD was `00a1ab9` with that
commit's `SKILL.md` edit already in the tree, and the skill the sessions load
is a link to the working tree. In flight at that moment: `bg-seat-ergonomics`
batch C (its Tasks 8 to 11 — `roles/kanri.md` and `SKILL.md`); after it,
batch D (Tasks 12 to 15 — the templates of that design's §6.4, the six other
role files, and its identity and vocabulary issue groups), then its
whole-branch review and fix wave. Batches C and D rewrite most of the files
this spec touches, so every site below is named by its file and heading,
never by a line number, and a quoted phrase is a needle to find the site, not
the text to replace. The plan re-reads every site at `bg-seat-ergonomics`'s
merge commit before it writes a passage.

**Item 2 was written last.** Its two reports reached this repository's inbox
while the other items were designed; the first names its cause, so its
section was written from them with no Kaiseki case (Q9), before this spec's
one review (Q7).

## Fixed inputs

The input document is `.tanto/kikaku/2026-09-24-bg-seat-fixes.md` (the topic
and its six items), amended by `.tanto/kikaku/2026-09-24-bg-seat-fixes-sekkei-now.md`
(this spec opens now, pinned, sites by heading, a `decide` point on re-reading
them). Behind them: `.tanto/kikaku/2026-09-24-queued-seats-vanished.md` and
`.tanto/kikaku/2026-09-24-queued-seats-issues.md`;
`.tanto/bg-seat-ergonomics/kanri.md`'s R-4, R-5, R-8, S-32, S-33, and S-39;
and item 2's two reports, `inbox 2026-09-24-task-implement-completed-handback-stalled`
and `inbox 2026-09-24-task-implement-phantom-background-wait`.
Each decision below names the requirement bullet of
`docs/requirements/04f5-tanto.md` (req-04f5) it serves, or says that none
does.

- **The topic and its place** (the input decision, section 1): after
  `bg-seat-ergonomics`, before `experience-layer`, whose Sekkei request stays
  held until this spec's review is accepted. Serves no bullet; it is the
  order.
- **Item 1 — a rework keeps its own files** (section 1). **Extended with the
  human's word (Q1, A1-2):** the decision's rework *prompt* path becomes the
  prompt, the report, and the verdict, since all three were overwritten
  (1.6). Serves req-04f5 "State lives in files, not in sessions", amended
  below.
- **Item 2 — a dispatch that completes with no handback** (section 2).
  **Reversed with the human's word (Q9):** the decision's Kaiseki case, and
  its fallback for when the case finds nothing, give way to a design written
  from the reports, since the first names its cause (2.1). Serves a new
  bullet (Requirements).
- **Item 3 — a listing entry with no `pid` is not a live session** (section
  3). **Widened with measured cause (Q4):** four readers of the listing, not
  the decision's two. Serves "A run is resumed with one command, and a
  session's identity survives its renaming", whose body reads "The identity
  is the session's id, read from the CLI": an identity read from a listing
  that keeps stale entries is misread. `bg-seat-ergonomics`'s close rewrites
  that bullet's body; the plan reads it as landed.
- **Item 4 — whether an idle background seat survives past sixty minutes**
  (section 4). **Measured in the dialogue (Q3, M-1)**, retrospectively over
  this machine's transcripts; no throwaway seat (Q6). Serves no bullet; it is
  the measurement item 5 stands on.
- **Item 5 — the queue at a skill-editing plan's landing** (section 5). The
  decision's two shapes were just-in-time resume and a keep-alive, with
  just-in-time resume expected; **chosen with the human's word (Q6, Q8):** a
  resume of any terminal seat that a send or the roster finds gone and the
  census does not list, the line sent again after it, with no stop at the
  landing and no census before a send. Serves "A seat is started when its
  work exists", amended below.
- **Item 6 — the human's language is a setting** (section 6): the key, its
  layers, and its scope as the decision's section 3 and Q5 give them.
  **Corrected (Q1, A1-4):** the decision's "`scripts/reading.js` learns the
  key" rests on a check the script does not make — it audits no top-level
  key — so the script is unchanged and `SKILL.md`'s key list learns it.
  **Extended with the human's word and approval (Q2, option b):** the
  repository's own first-message rule changes in `AGENTS.md` and in the kisou
  template it comes from (6.6). Serves a new bullet and amends three
  (below).
  It also changes a composed skill for tanto's need, which req-04f5's
  "Composes without modifying" does not allow as it reads: that bullet gains
  the narrow exception the human's Q2 made (Requirements), and every
  tanto-specific part — the key, its scope, its sites — stays in tanto's own
  files (6.6).
- **Excluded** (the decision's section 5): a sweep over the open issues;
  issue-c3d1 and issue-337b; the language of the launcher's printed lines, and
  any change to the `docs/` language rule; the other unsent bug reports of the
  repository item 2's reports come from.

## Measured while designing

Measured by this seat or by the `default` subagent it dispatched, 2026-09-24,
CLI `2.1.281`. The dialogue's M-1 entry has the detail; the measurement
report is `.tanto/bg-seat-fixes/measurement-idle-retro.md`.

1. **The listing.** In `claude agents --json`, every entry of a running
   session carried a `pid` and a `status` (`idle` or `busy`); a background
   entry also carries `id` and `state` (`working`, `done`, or `blocked`). The
   queued Jisso `5847650f`, collected at 2026-09-23T17:40:09Z, was still
   listed about seven hours later as `kind: background`, `state: blocked`,
   with no `pid` and no `status`.
2. **The transcript's exit record.** A background seat's records carry
   `sessionKind: "bg"`, and each process exit appends a `cost-state` record
   with no timestamp. Its `startTime` is the session's first start and its
   `totalDuration` accumulates across resumes, so `startTime + totalDuration`
   is the exit time: validated against two spawner `stop` requests, both
   within a second, and against the four queued Jissos' simultaneous exit.
3. **Idle survival (M-1).** Over every transcript on this machine — 447
   transcripts, 47 background sessions, 203 idle intervals (a turn end to the
   next wake-up or exit), 49 exits:
   - Idle intervals whose turn ended with nothing pending survived 680.5 and
     459.0 minutes (two background sessions of another repository on this
     machine) and 190.2 and 116.0 minutes (this repository's spawned Kanri
     `02d25208`). There is no universal sixty-minute collector.
   - 21 exits that no stop request explains, all after a turn that ended with
     nothing pending. Five came at 58 to 62 minutes of idleness: the four
     queued Jissos of `bg-seat-ergonomics`, which went idle between 16:39:20Z
     and 16:39:57Z and exited within 30 ms of each other at 17:40:09Z — one
     sweep, not four timers — and one scratch session on 2026-09-21 at 60.9
     minutes.
   - The sweep was not the CLI's update: `2.1.281` was installed at
     2026-09-23T19:37:51Z (its file under `~/.local/share/claude/versions/`,
     and the old binary renamed at 19:37:56Z), two hours after it. A separate
     cluster of short exits on 2026-09-19 at 23:17 to 23:19Z does meet an
     update, `2.1.277` to `2.1.278`.
   - The collection's condition is not determinable from transcripts: the
     transcript-derived state can disagree with the CLI's own `state`, a stop
     can end a session with no `cost-state` in its transcript, and a seat
     waiting on an AskUserQuestion is mid-turn, so no idle interval measures
     it.
4. **The rework overwrite.** `.tanto/bg-seat-ergonomics/batch-B-prompt.md`,
   `batch-B-report.md`, and `batch-B-verdict.md` all hold batch B's rework
   (Task 5); the first pass's three files (Tasks 4 to 7) are not on disk
   (1.6).
5. **The config audit.** `scripts/reading.js` reports an unknown key only
   under `ceiling` (its `loadCeiling`); its `loadSessions` says "the start
   sequence is where a config file is audited". A top-level key is audited by
   each role's own reading under `SKILL.md`'s "The expected-model config".
6. **The listing's readers.** Four places read `claude agents --json` for a
   session that already existed: the spawner's census and its `findResumed`
   (`scripts/spawner.js`), `boundary.js census`, and the launcher's Kanri check
   (`scripts/tanto.js`). None checks `pid` at `a062698`.
7. **The language sites.** "the chat's language" and its variants — "the
   chat language", "the human's chat language", the phrase wrapped across a
   line — occur 22 times in 10 files of `skills/tanto/` at `de267f3` (6.5).
   The repository's rule "Chat with the agent: use the language of the user's
   first message" is `AGENTS.md`'s Language section and
   `skills/kisou/templates/AGENTS.md`'s, the second the source of the first.
8. **A send to a gone session errors.** The passage check's first send, to
   the name of a Kanri replaced minutes before, returned "No agent named
   'tanto kanri invoke' is reachable"; and `ListAgents`, unlike
   `claude agents --json`, left out the stale entry of Measured 1.

## 1. A rework keeps its own files

### 1.1 The key

A batch's **key** is its letter for its first pass. A batch returned for
rework runs again under the key `<X>-rework-<n>`: `<n>` is 1 for the
batch's first rework, and one more than its highest rework so far after that
— a rework returned for rework again is `B-rework-2`, never
`B-rework-1-rework-1`. The key stands wherever a path, a row, or an argument
names the batch: `batch-<key>-prompt.md`, `batch-<key>-report.md`,
`batch-<key>-verdict.md`, the Batches table's Batch cell, `boundary.js
record --batch <key>`, and the boundary dispatch's `batch=<key>`.

### 1.2 What is never rewritten

A prompt, a report, or a verdict under `.tanto/<topic>/` that belongs to a
batch a seat has run is never written again: a rework's three files are new
files beside the first pass's. The one file that may be written again is the
next batch's prompt while it is rendered and not yet sent — the boundary
brief renders it at every boundary, as today, and a rework's boundary renders
it once more; no seat has read it. The send is what freezes a prompt.

### 1.3 The ledger's Batches table

The first pass's row stays: State `rework`, Verdict the reason it was
returned, Prompt and Report its own files. Each rework has a row of its own —
Batch `<X>-rework-<n>`, Tasks the tasks it runs again, its own Prompt,
Report, and Verdict — and moves `planned`, `reported`, then `accepted` or
`rework`, like any row. `boundary.js record --batch <key>` appends a row
when no row's first cell matches the key, so the script is unchanged; the
plan adds the test that holds it: a `record --batch B-rework-1` call against
a ledger that has a `B` row appends a row and leaves `B`'s cells as they were.

### 1.4 Who writes what

- **The rework prompt** — Kanri, from `templates/batch-prompt.md`, as today,
  for the same Jisso, at `batch-<X>-rework-<n>-prompt.md`. Its title names
  the key, its Report section names `batch-<X>-rework-<n>-report.md`, and its
  Previous batch verdict's ruling line says what was returned and why. Kanri
  adds the rework's row with a second `record` call of that boundary,
  `record --ledger <ledger> --batch <X>-rework-<n> --tasks <N-M> --state
  planned --prompt <path>`, beside its step-6 call that writes the first
  pass's State `rework` — as the boundary brief's second call writes the next
  batch's `planned` row.
- **The report** — the Jisso, at the path the rework prompt's Report section
  names.
- **The verdict** — the `boundary.verify` subagent at the rework's boundary:
  the dispatch's `batch=` carries the key, the verdict file is
  `batch-<key>-verdict.md`, and its `record --batch <key> --state reported`
  writes the rework's row, the rework's tasks read from its prompt's title,
  since the plan's Batches table has no row for a rework.
- **The next batch's prompt** — rendered again by the rework's boundary
  brief, as at the first pass's boundary: the brief's step 5 finds the next
  batch as the one after the letter before `-rework-` in the key, and the
  `planned` row it writes for that batch replaces, by `record`'s own
  idempotency, the one the first pass's boundary wrote.

### 1.5 A Jisso reads every `batch:` line's file

A Jisso that receives `batch: <path>` reads that file from disk before it
judges anything — whatever the path, and whether or not it has read a file at
that path before — and acts on what the file says, never on its memory of an
earlier prompt. A file that is the prompt of a batch it has already reported
is answered as today, with its report's path. This is the rule `roles/jisso.md`
gains in its Start (the `queue=` wait for the `batch:` line) and in The run,
step 3, whose sentence on a batch returned for rework ("comes back to you as a
prompt for the same batch") becomes the rework prompt at its own path.

### 1.6 What the rule's absence cost

The record, as the human asked (Q1, A1-2). At `bg-seat-ergonomics`'s batch B,
the first pass ran Tasks 4 to 7 and reported. Kanri returned Task 5 for
rework (that ledger's R-5) and rendered the rework prompt over
`batch-B-prompt.md`. The Jisso, holding the first prompt in its context, read
the `batch:` line as a duplicate and did not read the file again (S-39, and
that ledger's Session events of 2026-09-24). The rework's report was then
written over `batch-B-report.md`, and its boundary's verdict over
`batch-B-verdict.md`.

On disk today all three files hold the rework's versions: the first pass's
prompt, report, and verdict are gone and cannot be restored. The ledger rows
recorded from the first pass's Shoroku proposal — that ledger's second
S-34, S-35, and S-36 — carry a destination word, not a file, in their Source
cells, and the one path the ledger gives for their source, batch B's Report
cell, names a file that now holds the rework's report, whose own three items
are S-37 to S-39. The close's recommender can quote those three rows' one
line each, and nothing more of them.

## 2. A dispatch hands back with a status, never with work of its own running

### 2.1 What happened

Two reports from another repository's run, received on 2026-09-24 and named
here by their inbox slugs alone:

- `inbox 2026-09-24-task-implement-completed-handback-stalled` — an
  asynchronous `task.implement` dispatch; about seven minutes later, a
  notification with status `completed` whose note said the agent had stopped
  with background work of its own still running, that the same task id would
  notify again if that work finished, and that the result might be interim.
  No second notification came for about 11 hours 25 minutes: the Jisso had
  ended its turn on the note's promise. A direct message to the agent's id,
  sent after the human noticed, brought a `DONE_WITH_CONCERNS` hand-back in
  about three minutes. **The cause**, in the subagent's own diagnosis and
  confirmed by its fix: it had started a test run before finishing the edits
  the test needed, the test hung, and that repository's test runner has no
  timeout. CLI 2.1.280.
- `inbox 2026-09-24-task-implement-phantom-background-wait` — across four
  tasks of one batch, a `task.implement` dispatch ended its turn saying it was
  waiting on a test run in the background that nothing tracked, and sat until
  the Jisso messaged it — up to about a dozen times in one task. A wait budget the
  Jisso added to its dispatch prompts was followed inconsistently.

One family: a dispatched subagent ends its turn with work of its own still
running, or waiting on work nothing tracks, and the Jisso — which has no
clock — idles on a promise with no bound. The input decision opened this item
with a Kaiseki case because the cause was unknown; the first report names it,
so there is none (Q9).

### 2.2 Prevention, at the dispatch

Every dispatch the Jisso sends — `task.implement`, `task.escalate`, and the
two task reviews — tells the subagent three things:

- run every command in the foreground with an explicit timeout — the Bash
  tool's `timeout`, ten minutes at most — never as a background job; a
  command that cannot finish inside that ceiling is not started, and is named
  in the hand-back for the Jisso to rule on;
- never end a turn while a command of its own is still running, or while
  "waiting" on anything;
- end every turn with a hand-back: an implementer's one of the four
  implementer statuses, a reviewer's verdict.

SDD's own prompts are used as they are: the Jisso adds the three sentences to
each dispatch, as it already adds the sentence that has an implementer report
a modification it did not make (`roles/jisso.md`'s "What tanto overrides").

The three sentences are best effort: a prompt is followed inconsistently, as
the second report shows of the wait budget its Jisso added. 2.3 and 2.4 are
the bound — the detection that budget lacked.

### 2.3 Detection, at the Jisso

A notification that carries no hand-back — an interim `completed` whose note
says the agent stopped with background work of its own still running, or a
result that says the agent is waiting — is not a hand-back. The Jisso answers
it in the same turn, by `SendMessage` to that agent's id: stop any command of
its own still running, run what remains in the foreground with a timeout, and
hand back with its status. It never ends its turn on such a notification
without that message: the promised second notice comes only if the
background work ends, and nothing in the run notices when it does not.

### 2.4 The bound

At most two such messages to one dispatch. A third notification without a
hand-back is that task's `BLOCKED`, handled as subagent-driven development
says. Its cause is named — the dispatch will not finish in the foreground — so
it is not the Kaiseki trigger of "The four implementer statuses".

### 2.5 Not taken

- A bound or a heartbeat on the harness's promise of a second notification —
  the first report's own first proposal; the harness's to make, and a report
  to anthropics/claude-code is the human's.
- The same rule for other roles' dispatches — Kanri's `boundary.verify` and
  `branch.review`, Keikaku's `plan.draft` and `plan.review`. None has been
  reported stalled; each takes the rule when one is.
- A timeout in a repository's own test runner — that repository's.
- A foreground call that hangs inside a seat's own turn (issue-7fa4): 2.2's
  timeout bounds such a call inside a dispatch, and the seat-level notice
  stays that issue's.

## 3. A listing entry with no `pid` is not a live session

### 3.1 The rule

An entry of `claude agents --json` that carries no `pid` is not a live
session: its process is gone, whatever its `state` says (Measured 1). The rule
applies wherever the run asks whether a session that already existed is
running.

### 3.2 The four readers

1. **The spawner's census** — `runCensus` in `scripts/spawner.js`. The map it
   builds from the listing keeps only entries that carry a `pid`, so a seat
   whose one entry has none goes `gone` through `censusSeat`, as a seat not
   listed does, and a `gone` seat is revived only by an entry that carries a
   `pid`.
2. **The spawner's resume** — `findResumed` in `scripts/spawner.js`. After
   `claude --resume <sessionId> --bg`, it waits for an entry of that
   `sessionId` that carries a `pid`. A seat whose process was collected leaves
   a stale entry of its own `sessionId`, which today's lookup returns at once,
   before the resumed process registers — with the old name and id.
3. **`boundary.js census`** — `cmdCensus`. A roster row whose session's entry
   has no `pid` prints under Not listed, followed by
   ` — listed without a pid (a stale entry)`, so that Kanri marks the row on
   the signal the heading names; Not held lists no entry without a `pid`.
4. **The launcher's Kanri check** — `scripts/tanto.js`. The map it builds from
   the listing, which today leaves out `state: "stopped"`, also leaves out an
   entry with no `pid`, so that a Kanri whose process is gone and whose entry
   stays is resumed, not taken for a running one.

`findNew` in `scripts/spawner.js` is unchanged: a spawn's session has no
earlier process to leave an entry behind.

### 3.3 Tests

One per reader, each against a fake listing that returns an entry with no
`pid` for a session the test holds: the census marks the seat `gone`;
`findResumed` does not return the stale entry, and returns the entry with a
`pid` once the fake listing adds it; `census` prints the row under Not listed
with the stale-entry note; the launcher resumes the Kanri. The fake `claude`
the tests run already lists an entry without a `pid` when the test's state
holds one. No test runs the real CLI.

### 3.4 If `bg-seat-ergonomics`'s fix wave takes it first

It has, for three of the four readers. The `pid` filter is
`bg-seat-ergonomics`'s whole-branch review's Important 1, ruled there as R-11
(that ledger's S-33 and S-54, P-1), and at `f50056d` its fix wave has landed
it in `runCensus`, `cmdCensus`, and the launcher's map, with a test for each,
and `SKILL.md`'s sentence "An entry with no `pid` is not listed." — not in
`findResumed`, whose lookup still takes the first entry of the `sessionId`.
What landed is verified here, not written again: the plan checks it against
3.2 and 3.3 at `bg-seat-ergonomics`'s merge commit and writes what is still
missing — at `f50056d`, `findResumed`'s `pid` condition and its test, and
3.2 item 3's Not listed note.

## 4. Whether an idle background seat survives — measured

The question, issue 2 of the queued-seats-issues decision: does an idle
`claude --bg` seat that nothing addresses survive past sixty minutes — and,
the human added (A1-3), does its `state` decide it?

**The answer (Measured 3).** Sometimes it is collected — once four together,
at about sixty minutes of idleness, by one sweep of unknown cause — and
sometimes it lives eleven hours. Whether `state` decides it is not
determinable from the transcripts, which carry no `state` and can disagree
with it. So no idle time is safe to rest on: the run's interim rule of the
queued-seats-issues decision, "sixty minutes of idleness as the ceiling", is
replaced by section 5, which rests on no idle time at all.

**No throwaway seat (Q6).** Section 5 is correct whatever the condition is,
so finding it would change no design. The issue that `bg-seat-ergonomics`'s
close files from its S-33 for this question records the measurement, the open
condition, and the procedure a later measurement would follow: a throwaway
background seat spawned in a folder whose trust the CLI has recorded (an
untrusted fresh folder refuses a `--bg` spawn), given a trivial prompt that
ends its turn, never attached (leaving an attached seat can raise the
folder-trust question of issue-b7e1), and read at 45, 55, 60, 65, and 90
minutes — its `pid` and `state` in `claude agents --json`, and its
transcript's last record and any `cost-state`.

## 5. A terminal seat that has gone is resumed before a line is sent to it

### 5.1 The rule

Kanri sends a line to a terminal seat — a Jisso, a Keikaku, any seat the
spawner started — on the roster as recorded, with no census first (Q8). Two
things send it to the census instead:

- **the send errors** — a send to a session that is gone returns "No agent
  named … is reachable" (Measured 8), and the contract already reads a send
  error as the reason to run the census;
- **the roster records the row `dead`** — an earlier census's mark, or a
  predecessor's handover.

A terminal seat the census then does not list — a stale entry with no `pid`
included (section 3) — gets a `resume` request, `claude --resume <sessionId>
--bg` with no other flag, which keeps the `sessionId` and the whole
conversation; the line is sent again when the result lands, to the name the
result carries, and the row goes `live` with it. A seat the census does list
after a send error is today's message failure: the row stays, and Kanri tells
the human in one line. A resume is never a spawn and never a replacement:
this is `bg-seat-ergonomics`'s R-3 and Kanri's present practice (P-1), made
the contract's rule. It covers every line to a terminal seat — a queued
Jisso's `batch:` line, a rework prompt's, the close's line to the plan's last
Jisso, a `coldread:` line to Keikaku, a `continue:` after a pause — and costs
nothing for a seat that is alive.

A result that carries no name — the resumed process not yet registered when
the spawner's lookup gave up — is answered by the census again, which names
the session by its `sessionId`. A `queued` row goes `live` before its
`batch:` line is sent, whether or not a resume was needed, so that Kanri
still sends only to `live` rows (`SKILL.md`'s "Messages").

### 5.2 The queue at a skill-editing plan's landing

Unchanged in shape: every Jisso of a plan that edits the skill is spawned at
the landing with `queue=<topic>`, reads the skill before batch A, and is not
stopped. Such a seat may be collected while it waits (section 4). When its
batch prompt is due, 5.1 resumes it with the context that read the skill
before batch A, so rule 11's reason holds. `bg-seat-ergonomics`'s four queued
seats were resumed this way (R-3) and ran their batches.

### 5.3 The census and the rows

- A `queued` row whose session the census does not list stays `queued`: its
  absence while it waits is expected, and the send of its prompt resumes it.
- A `live` row not listed is marked `dead`, as today: the census's mark stays
  mechanical, whatever the seat. For a terminal seat whose transcript is on
  disk, `dead` is not final — when a line is next due to that seat, 5.1
  resumes it and the row goes `live` again (decision-ded8, amended in one
  part; `stopped` keeps meaning a stop the run made, which is what tells a
  seat the run retired from one that vanished). The Events line of such a
  `dead` names what showed the process gone — the stale entry, the send
  error — and says the conversation is kept. The line of a seat whose shoroku
  proposal was not written is written only when the resume fails (5.4), or
  for a tab seat, which the run cannot resume.
- The spawner's census marks either seat `gone` in `seats.json`, as today, and
  `tanto` after a restart resumes only `running` and `blocked` seats and the
  Kanri, so a collected queued seat stays down until its prompt is due.

### 5.4 When a resume fails

The Replace table's row for a gone Jisso — today a `spawn` request with the
same `batch=` file, or, under a skill-editing plan's queue, that line sent to
the next `queued` seat and the lost seat put to the human — opens with 5.1's
resume: a Jisso gone mid-batch is resumed and sent `resume batch <X> from
task <N>`, the line `SKILL.md`'s "Resuming" already gives a Jisso resumed
after a restart. Today's action is the fall-through, taken only when the
resume fails.

A resume fails when its result carries an error, or when the seat's
transcript is not on disk. The seat is then lost: its row stays `dead`, with
the Events line of a seat whose shoroku proposal was not written; for a
queued seat of a skill-editing plan, the ruling rule 11 leaves to the human
(R-3's last sentence); for any other seat, the Replace table's row for its
role, as today.

### 5.5 What is not added

- **A keep-alive** — the spawner addressing each queued seat at an interval
  under the limit. Its premise, a sixty-minute timer, is not what Measured 3
  found; it would not protect a seat from a sweep of another cause; and every
  ping re-reads the seat's whole context.
- **A stop at the landing and a resume at the boundary** — the input
  decision's shape (Q6, option B). The stop has to come after the seat's first
  turn, once its role file is read, which needs a new spawner feature or Kanri
  waiting on idle notices; 5.1 covers the same case without either.
- **A census before every send** — this draft's first 5.1 (Q8, option i).
  Its output, ten to fifteen lines, would accumulate in Kanri's context at
  every send, while a send to a gone seat already errors and a seat alive
  needs no check.

## 6. The human's language

### 6.1 The key

`language`, at the top level of `tanto.json` beside `sessions`, `subagents`,
and `ceiling`; its value is a BCP 47 tag — `"ja"`, `"en"`. It overlays across
the three layers like every other key, the last one winning, and the built-in
`templates/tanto.json` sets none. The personal file is where the human sets
it — one file for every repository — and a project file may override it.

It is the file's first top-level key that is not a map. `SKILL.md`'s "Three
maps, three mechanisms." becomes three maps and one scalar: `language`, whose
mechanism is the definition of 6.2 and whose effect is on the human-facing
text of 6.3 alone. The overlay and the built-in defaults stand
(decision-9a3a, amended in one part, as decision-eee2 amended it when
`ceiling` was added).

### 6.2 The definition

Written once, in `SKILL.md`'s "The expected-model config": **the human's
language** is the merged `language` when one is set; otherwise it is what
the repository's own language rule gives — after 6.6, a language the user
has configured elsewhere, such as in a user-level instruction file, else the
language of the human's first message in the window — and English only when
nothing names a language (Q8). Under the repository's rule the key is how a
tanto seat reads "the language the user has configured": a user-level
instruction file is read only when the key is unset, so the two never
compete. Every other site says "the human's language" and points nowhere
else.

A keyless seat does not speak English today by rule: the present Kanri, a
spawned seat whose first message is its predecessor's prompt, has written its
closing lines, notices, and idle block in Japanese all its tenure, following
the user's own global instruction file (P-1), while the seats the human had
to ask for Japanese did not. The key is what makes every seat agree; the
human's act of 6.7 sets it.

### 6.3 What it governs, and what it does not

It governs the human-facing text only:

- every seat's closing line;
- the review briefs, `review-brief-spec.md` and `review-brief-plan.md`;
- the shoroku briefs — the close's check brief and the inbox sweep's;
- the kessai question, and every line Kanri prints for the human in its own
  window — its start line, the `R-n` notices, the released lines, the
  human-access steps, and the idle block, its fixed labels included;
- an `attention` request's message;
- the batch report's Questions for the human section;
- the dialogues a seat holds with the human — Sekkei's spec dialogue,
  Keikaku's plan dialogue, Kaiseki's debugging conversation, Hosa's chores,
  and a `human-contact:` exchange;
- the text of every AskUserQuestion.

It does not govern the tanto lines between sessions, which stay fixed English
forms; anything under `docs/`, which the repository's own language rule
covers; the ledger, the roster, the reports, the subagent prompts, and the
decision files, which stay agent-facing English with the human's words quoted
verbatim; or the launcher's printed lines.

### 6.4 Every role reads it at start

With the rest of the config, in the start sequence's model check, a spawned
seat included — which is the point: a seat with no human first message to
detect from still knows the language. The start line says
`language: <tag> (<layer>)`, the layer being the file the effective value
was read from, or `language: — (unset)`. `language` leaves the unknown-key
rule of "The expected-model config" ("A key that names no role, no kind and no
ceiling field"). `scripts/reading.js` is unchanged (Measured 5): it audits no
top-level key, and no script needs the language.

### 6.5 The sites

Every occurrence of "the chat's language" and its variants becomes "the
human's language", and every dispatch that names a brief's language names the
one 6.2 defines. At `de267f3`, by file and heading:

- `SKILL.md` — "Messages" (the closing line's rendering, twice, and the
  review brief), "The brief's form" (the headings), "Session exit" (the check
  brief's dispatch), and "Artifacts" (the rows of the review briefs and the
  check brief);
- `roles/kanri.md` — "Start" (the handover's line to the human), and
  "Shoroku", its "The four steps" (the recommend dispatch, the brief's
  dispatch, and the kessai printed in Kanri's window);
- `roles/sekkei.md` — "Step 2 — spec review"; `roles/keikaku.md` — "Step 4 —
  plan review";
- `templates/review-brief.md` — its opening paragraph and header line ("for
  the chat language `<language>`"), and "How to answer" (twice);
  `templates/shoroku-brief.md` — its opening paragraph and header line;
  `templates/batch-report.md` — "Questions for the human" ("the human's chat
  language"); `templates/spawn-request.md` — the `attention` message;
- `README.md` — "What it does" (the brief), and the prerequisites' Optional
  paragraph on `tanto.json`, which also names the `language` key and the
  personal file as its site.

The count is 22 in 10 files. The plan takes the grep again after
`bg-seat-ergonomics`'s merge; this list is what it is checked against, not
what it edits from.

### 6.6 The sentence outside the skill

`AGENTS.md`'s Language section and `skills/kisou/templates/AGENTS.md`'s read
"Chat with the agent: use the language of the user's first message"; both
become **"Chat with the agent: use the language the user has configured, else
the language of the user's first message"** (Q2, option b). Q2's answer is
the human's explicit approval for this one sentence of `AGENTS.md` and for
nothing else in that file. The kisou template's heading stays and only the
body line changes, since kisou's refresh keys sections by heading; the
repositories kisou manages take it through `kisou migrate`.

Why it is in scope: `AGENTS.md` outranks a skill, and a spawned seat's first
message is Kanri's prompt — English keys and paths, not the human's words —
so the repository's rule, read as written, points a spawned seat at that
prompt whatever `tanto.json` says, and which other instruction a seat then
follows varies from seat to seat (6.2). The sentence names no tool: it
stands as kisou's own rule for any agent, of which tanto's key is one
configuration. It is still a composed skill changed for tanto's need, so
req-04f5's "Composes without modifying" gains the exception that allows it
(Requirements). Its reach is wider than tanto, as Q2 said: a user-level instruction such as a global
`CLAUDE.md`'s "Chat in Japanese" reads as a configured language under it, so
every chat in those repositories leans the same way — the human's stated
intent.

### 6.7 The human's act after the landing

`{"language": "ja"}` in `$CLAUDE_CONFIG_DIR/tanto.json`, the personal file,
which does not exist today. The README's Optional paragraph says so.

## 7. File by file

Sites by heading, as of `a062698` and `de267f3`; the plan re-reads each at
`bg-seat-ergonomics`'s merge commit.

- `skills/tanto/SKILL.md` — "The expected-model config" (6.1, its "Three
  maps" sentence; 6.2; 6.4); "Handshake and roster": the Status column's
  definitions (5.3 — a terminal seat's `dead` is resumable) and the paragraph
  opening **The census.** (3.1; 5.1's send error, which now ends in a resume
  for a terminal seat the census does not list; 5.3's `queued` row);
  "Resuming" (5.1, as the resume a terminal seat gets when a send or the
  roster finds it gone);
  "Messages" (5.1 at Kanri's sends; 6.5); "Session exit" (6.5); "Artifacts"
  (1.1's key in the three `batch-<X>-…` rows, the rework's files; 6.5);
  "Rules", rule 11's queue paragraph (5.2).
- `skills/tanto/roles/kanri.md` — "Start" (6.4, 6.5); the batch boundary's
  steps 4 and 6 (1.3, 1.4; 5.1 at each send to a terminal seat); "The final
  batch" (5.1 at the close's line to the last Jisso); "A seat's exit" (5.3's
  Events line); "Session lifecycle", the paragraph opening **The census.**
  (3.2's note, 5.3); "Replace", its first row (5.4); "Shoroku", its "The four
  steps" (6.5).
- `skills/tanto/roles/jisso.md` — "Start" (1.5; 5.2: a queued seat may be
  collected and resumed while it waits, and does nothing about it); "The run",
  step 3 (1.5); "The four implementer statuses" (2.3, 2.4: a notification
  with no hand-back, and the bound); "What tanto overrides" (2.2: a row for
  the three sentences every dispatch carries).
- `skills/tanto/roles/sekkei.md`, `skills/tanto/roles/keikaku.md` — their
  review steps (6.5).
- `skills/tanto/templates/batch-prompt.md` — the title and "Report" (1.1).
- `skills/tanto/templates/boundary-brief.md` — the dispatch's arguments
  (`batch=<key>`), the procedure's `record` calls, its step 5 (the next batch
  found from a rework's key), and "The verdict file" (1.1, 1.4).
- `skills/tanto/templates/kanri.md` — "Batches", the Batch column's
  description (1.3).
- `skills/tanto/templates/batch-report.md`, `review-brief.md`,
  `shoroku-brief.md`, `spawn-request.md` — 6.5.
- `skills/tanto/scripts/spawner.js`, `boundary.js`, `tanto.js`, and their
  tests — section 3; `boundary.test.js` also 1.3's test.
- `skills/tanto/README.md` — 6.5, 6.7.
- `AGENTS.md`, `skills/kisou/templates/AGENTS.md` — 6.6.
- `docs/` — by the close: the Requirements and ADRs below, and the issues.

## Old values this plan contradicts

Needles, each with its file and heading; the plan measures each at zero over
the files it touches, after re-reading the sites at the merge commit.

- `SKILL.md`, "The expected-model config": "A key that names no role, no kind
  and no ceiling field" — `language` is none of those and is known.
- `SKILL.md`, "The expected-model config": "Three maps, three mechanisms." —
  three maps and one top-level scalar (6.1).
- `SKILL.md`, "Handshake and roster", the paragraph opening **The census.**:
  "Kanri marks a `live` or `queued` row whose `sessionId` it does not list
  `dead`" — a `queued` row stays `queued` (5.3).
- `roles/kanri.md`, "Replace", its first row: "write a `spawn` request with
  the **same** `batch=` file" and "send that line to the next `queued` seat
  instead" — the resume comes first (5.4).
- `roles/kanri.md`, "A seat's exit": "A session that has stopped answering is
  past answering" and "The same Events line goes in whenever you mark a row
  `dead`" — a terminal seat's `dead` is resumable (5.3).
- `roles/kanri.md`, "Session lifecycle", the paragraph opening **The
  census.**: "mark the row `dead`, with the Events line a seat whose shoroku
  proposal was not written gets" — that line only when the resume fails
  (5.3, 5.4).
- `SKILL.md`, "Artifacts", the `batch-<X>-prompt.md` row: "and for a rework
  prompt" — a rework prompt has its own path.
- `roles/kanri.md`, the boundary's step 6: "and send the same way" and "That
  call is the whole of your table writing" — a rework's path and its second
  `record` call.
- `roles/jisso.md`, "The run", step 3: "comes back to you as a prompt for the
  same batch".
- `roles/jisso.md`, "The four implementer statuses": "with one addition" —
  2.3 and 2.4 are a second.
- `templates/kanri.md`, "Batches": "Batch, the letter".
- `skills/tanto/`, every file: "chat's language", "chat language" — zero.
- `AGENTS.md` and `skills/kisou/templates/AGENTS.md`: "use the language of the
  user's first message" — zero.

## Requirements

Edits to `docs/requirements/04f5-tanto.md`, req-04f5, written by the close's
apply.

- **Amend** "State lives in files, not in sessions" with: "A file a seat has
  acted on keeps its content: a batch that runs again is given new files, so
  that what every seat read and wrote stays on disk."
- **Add** "**A batch never waits on a promise without a bound.** A subagent
  the run dispatches ends its turn with its hand-back, never with work of its
  own still running, and a notice that carries no hand-back is answered at
  once, so that a command that hangs inside a dispatch cannot hold a batch for
  hours with no signal."
- **Amend** "A seat is started when its work exists" with: "A seat that has
  gone while it waits is resumed with its whole conversation, never replaced,
  and its work reaches it after the resume, so that nothing in the run rests
  on an idle seat's survival."
- **Add** "**The run speaks to the human in the human's language.** The
  language the human has configured, for every repository or for one — else
  what the repository's own language rule gives — is the language of every
  word a seat addresses to the human: its closing line, a brief, a question, a
  notice. The lines between sessions keep their fixed forms, and the
  repository's documents keep the repository's language."
- **Amend** "Composes without modifying" with: "The one exception is a
  composed skill's own rule on how a setting the human made is read, where
  that rule would otherwise overrule tanto's use of the setting: it is
  changed in that skill on the human's explicit word, in words that name no
  tool, and stands as that skill's own rule — as the kisou template's
  language rule puts a configured language before the first message."
- **Amend** "The human reviews through a brief of the judgment points": "in
  the chat's language" becomes "in the human's language".
- **Amend** "Escalated wording reaches the human in the chat's language too.",
  its bold lead and its body: "the chat's" becomes "the human's" throughout.

## The ADRs

Written by the close's apply under `docs/decisions/`.

1. **A rework is a batch of its own key, and a batch that ran keeps its
   files.** `<X>-rework-<n>`; three new files; a row of its own; a Jisso reads
   every `batch:` line's file from disk. Rejected: a new path for the prompt
   alone — the report and the verdict were overwritten too (A1-2); one row
   listing every pass's paths in its cells — `record` writes one value per
   cell; trusting the Jisso to notice a changed file at an old path — its
   memory of the path is the failure (1.6). Amends decision-a8cc in one part:
   its "`record`'s idempotency is what makes the rework path one command
   re-run" — the rework path is still one `record` command, now writing a
   row of its own key; the rest of a8cc stands.
2. **A dispatch hands back with a status, never with work of its own
   running.** Every command in the foreground with a timeout; a notification
   with no hand-back answered at once by a message to the agent's id; at
   most two such messages, then the task's `BLOCKED` (2.2 to 2.4). Rejected:
   a Kaiseki case first (Q9) — the report names the cause; the input
   decision's fallback, a check of an overdue hand-back against the listing
   and the tree — an idle Jisso has no clock to find it overdue, and the
   notification itself is the signal; a wait budget in each dispatch prompt
   with nothing behind it — followed inconsistently (the second report), where
   2.2 keeps the prompt as best effort and puts 2.3's detection behind it; a
   bound on the harness's promise — the harness's to make. Amends none.
3. **An entry of the CLI's listing with no `pid` is not a live session.** For
   every reader that asks whether a session that already existed is running.
   Rejected: reading `state` or `status` — a stale entry keeps
   `state: blocked`; a timeout — identity takes no timeout. Amends
   decision-1c07 in one part — the spawner reads a `blocked` state for its
   notice only from an entry that carries a `pid`, so a stale entry raises
   none; the rest stands — and ADR 3 of the `bg-seat-ergonomics` design
   (identity is the `sessionId`, the census its one signal), under the id its
   close gives it, in one part: the census lists no entry without a `pid`.
4. **Nothing in the run rests on an idle background seat's survival.** A
   line to a terminal seat that errors, or to a row recorded `dead`, sends
   Kanri to the census, and a seat the census does not list is resumed and
   the line sent again (Measured 3, 8). Rejected: a keep-alive; a stop at the
   landing and a resume at the boundary (Q6); a census before every send
   (Q8); a throwaway-seat measurement before deciding (Q6); `stopped` for a
   collected seat — `stopped` is a stop the run made, and the census's mark
   stays mechanical (5.3). Amends decision-b909 in one part — the Jissos that
   wait at the landing, reading nothing, are resumed with their conversation
   when collected, before their prompt reaches them — and decision-ded8 in one
   part — `dead` stays the census's mark for a session it no longer lists, and
   a terminal seat's `dead` row whose transcript is on disk is resumed when a
   line is due to it and goes `live` again; the rest of both stands.
   decision-76a6 stands unchanged: a `queued` row goes `live` before its line
   is sent (5.1).
5. **The human's language is a setting.** The `language` key, its definition,
   its scope, its sites; `scripts/reading.js` unchanged; the repository's
   first-message rule puts a configured language first. Rejected: `SKILL.md`
   reading the repository's rule as satisfied by the key alone (Q2, option a)
   — the rule outranks the skill, and precedence would rest on
   interpretation; leaving the rule out of scope (Q2, option c) — the spawned
   seats would keep speaking English; a project-only key — the human wants one
   file for every repository; the script printing the language — no script
   needs it. Amends, each in one part: decision-2497 — the closing line is
   rendered in the human's language, not the chat's; decision-ace0 — the
   brief is written in the human's language; decision-9a3a, as decision-eee2
   amended it — the file carries three maps and one top-level scalar,
   `language`, and its overlay and defaults stand.

## What the plan must contain

- Global Constraints: this plan edits the tanto skill, so rule 11 holds — its
  Jissos are all spawned at its landing with `queue=`, and the plan names its
  safe boundary, the batch that lands the role files and the templates. 5.1 is
  already this run's practice (R-3, P-1), so the plan's own queued seats are
  handled by it from the start. The plan cites Q2 as the
  approval for `AGENTS.md`'s one sentence.
- Before any passage: every site of section 7 re-read at
  `bg-seat-ergonomics`'s merge commit, and any site that batch C, batch D, or
  that topic's fix wave moved or rewrote named in the plan — the review brief's
  `decide` point.
- A batch of the instruments: section 3's four readers and their tests, and
  1.3's `record` test. The tests run with the fake `claude` and a fake config
  directory, never the real CLI. No measurement task: M-1 is the measurement
  (Q6).
- The contract, the role files, and the templates: sections 1, 2, 5, and 6 —
  in one batch or two, the safe boundary among them.
- The README, `AGENTS.md`, and the kisou template; and the issues.
- The whole-branch review and its fix wave, as every plan.
- How a batch is verified: `node --test skills/tanto/scripts/*.test.js`;
  `passage-check.js verify` over the plan's passages; `./scripts/lint.sh` on
  every path touched; the Old values' needles at zero; and, for the two
  `AGENTS.md` files, which no doc-system check binds, lint on both, the
  needle at zero in both, and the two edited lines compared byte for byte.

## Verification

Measured in the dialogue, taken as given by the plan: the listing's `pid`
facts (Measured 1), the exit record (2), idle survival (3), the overwrite (4),
the config audit (5), the listing's readers (6), and the send to a gone
session (8). Not yet observed: a
`resume` of a collected seat that fails — `bg-seat-ergonomics`'s R-3 ran
three and all three succeeded; the dogfood report records the first failure.

## Out of scope

- A sweep over the open issues; issue-c3d1 and issue-337b; the launcher's
  lines' language; the `docs/` language rule (the input decision, section 5).
- The collection's condition — the throwaway-seat measurement (Q6), carried
  by its issue.
- What 2.5 leaves: a bound on the harness's promise of a second notification,
  the other roles' dispatches, and a repository's own test runner.
- issue-d19f (the brief writer copies the template's sample headings instead
  of translating them) — a neighbor of 6.5's templates, not taken: a rendering
  defect the form check already catches, not a language source.
- The duplicate `S-n` numbers of `bg-seat-ergonomics`'s ledger — issue-e84c's
  defect recurring; the Sekkei's exit proposal carries it.
- issue-11db (rule 11 and another topic's live session) —
  `bg-seat-ergonomics`'s R-8 feeds it at that topic's close.

## Issues this design closes

Each term the design retires was grepped once across `docs/issues/open/`:
"rework", "overwrit", "pid", "60 minutes", "collected", "queued", "language",
"chat's language", "first message", "handback", "phantom", "background",
"interim", "timeout", "hand-back", "waiting on". None of the hits names these
mechanisms — "rework" is issue-22e9's retiring Jisso, "60 minutes"
issue-d3f1's cost figures, "queued" the queued-topic issues, "timeout"
issue-126e's `replay` and issue-7fa4's hung foreground call, which 2.5 leaves
open — so no open issue closes today. The issues this topic takes are filed at
`bg-seat-ergonomics`'s close, under the ids that close gives them:

- from its S-33, **issue 1** (the census keeps a dead seat alive when the
  listing keeps a stale entry) — closed by section 3;
- from its S-33, **issue 2** (whether an idle background seat is collected
  after about sixty minutes) — its question answered by section 4; it stays
  open for the collection's condition, with the procedure of section 4;
- from its S-33, **issue 3** (the queue-at-landing shape) — closed by section
  5;
- from its S-39, if that close files one (a rework prompt written over the
  batch's own) — closed by section 1.

The two inbox reports of item 2 are this spec's inputs: at the close that
triages them, their expected outcome is `relay` to `bg-seat-fixes`, and
section 2 is the change that takes them.

## Answers to the spec inputs

No `spec-inputs.md` exists. Sections 1, 3, 5, and 6 rewrite procedures of
Kanri's and Jisso's; the passage check went to Kanri on 2026-09-24, and Kanri
`tanto kanri role initialization [b2ec0d]` answered by message (the
dialogue's P-1):

- §1.3-1.5 match its obligations and name the gap batch B hit; no rework is
  in flight in either open topic.
- §3.2 is in flight in `bg-seat-ergonomics`'s fix wave (R-11 there) — taken
  into 3.4.
- §5.1 as first drafted — a census before every send — changed how it works:
  it sends on the roster's recorded status and resumes a seat recorded
  `dead`. Put to the human (Q8), who chose that practice, extended to a send
  that errors: 5.1 as it now reads.
- §6.2's "English, today's behavior" did not describe it: a keyless spawned
  Kanri has written Japanese all tenure, following the user's global
  instruction file. Put to the human (Q8): 6.2 as it now reads.

Kanri also recorded, as R-2 of this topic's ledger, a standing watch for
item 2's two reports and for `bg-seat-ergonomics`'s close (Q7).

Section 2, written after that check, rewrites Jisso's procedure alone. No
Jisso of this topic is live — the one live Jisso runs `bg-seat-ergonomics`'s
fix wave — so no session holds the procedure to check it against; the spec
review's third input, the files the change list touches, is its check.

## Deferred items

- The collection's condition (section 4).
- 2.5's rule for the dispatches of the other roles.
- issue-d19f.

## Shoroku proposal from this spec work

This section excludes the spec's own sections above, which the close's
recommender reads for itself.

1. The CLI's listing keeps a collected background seat's entry, with no `pid`,
   no `status`, and `state: blocked`, for hours (CLI `2.1.281`). Destination:
   notes.
2. A background seat's exit is readable after the fact: its transcript's
   `cost-state` record carries the session's first `startTime` and a
   `totalDuration` that accumulates across resumes, and their sum is the exit
   time, to within a second of a recorded `stop`. Destination: notes.
3. On this machine `$CLAUDE_CONFIG_DIR/projects` is a link to
   `~/.claude/projects`: one set of transcripts under two config directories.
   Destination: notes.
4. The CLI's install times are readable from
   `~/.local/share/claude/versions/<version>`'s modification time and the
   renamed old binary's epoch suffix — the way to test an "it was the update"
   hypothesis against an exit time. Destination: notes.
5. A seat waiting on an AskUserQuestion is mid-turn, so a transcript's
   turn-end measure never sees it idle: `blocked` has no idle interval to
   measure. Destination: notes.
