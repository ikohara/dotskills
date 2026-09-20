# Design: tanto-diet — the boundary runs in a context that is thrown away, the resident Kanri keeps one line; the batch prompt travels as a path; the handover keeps its event and loses its ceremony; the reading says which cache regime the session is in

Written by Sekkei `dotskills-cb [5b79c2]` on 2026-09-19 as a draft at
`.tanto/tanto-diet/spec-draft.md` (R-2: the shared checkout is
`bug-report-hold`'s). The Keikaku that follows commits this text unchanged at
`docs/superpowers/specs/2026-09-19-tanto-diet-design.md` and cuts the
`tanto-diet` branch from `main` before its first commit.

## Fixed inputs

Each decision below names the requirement bullet it serves, from
`docs/requirements/04f5-tanto.md` (req-04f5), or says that none does.

- **The cost is the resident's context, re-read at every wake-up and every
  tool call.** Measured in `.tanto/kikaku/2026-09-19-ttl-regimes-issue-yield-and-kanri-daemon.md`
  §0 and taken as given here (a Sekkei may cite it without re-measuring):
  Kanri's context grew from 84k at `/tanto kanri` to 145k after the start
  sequence to 835k at the seat-lineage close; Kanri made about 16 tool calls
  per boundary, six of them Edits to the ledger's and the roster's tables;
  the batch prompt, sent and written in full, put 98 KB plus 104 KB into
  Kanri's context per plan; in the 5-minute cache regime every wake-up after
  a gap over five minutes re-creates the whole context. Serves req-04f5
  "Kanri is resident, but its context cost does not grow with its tenure"
  and "A seat that waits holds the minimum context".
- **Shape 1 is the structural direction; shape 2 is a design target only
  at its seam.** The same decision file, §3: the thin resident whose
  boundary runs in a fresh subagent is decided; the headless-Kanri-per-
  boundary is a live target because the spike
  (`docs/reports/2026-09-19-tanto-daemon-spike.md`) showed a `claude --bg`
  session is a first-class `ListAgents` / `SendMessage` peer. Q1 of the
  dialogue: this spec designs shape 1 and fixes the seam — the boundary
  brief's argument list and the verdict file — so that shape 2 is "run the
  same brief headless". The controller and the spike's three unmeasured
  points are deferred. Serves the same two bullets.
- **Four levers, all in scope**, from §1 of the same file: the boundary
  moved into a subagent; the boundary fold (one command for the checks, one
  for the row appends); a `ttl=` line in `reading.js`; path-only batch
  prompts. Serves req-04f5 "A session's cost is measured, not guessed" (the
  `ttl=` line) and the two bullets above (the other three).
- **The handover keeps its event and loses its ceremony**, from
  `.tanto/kikaku/2026-09-18-parallel-close-and-tanto-feedback.md` §2: the
  successor starts in the outgoing Kanri's own window; no `kanri-address:`
  broadcast; no role caches Kanri's address; the handover file shrinks to
  what the ledger does not hold. Serves req-04f5 "Kanri is resident, but its
  context cost does not grow with its tenure" (the handover stays the reset)
  and rule 3, state in files.
- **Two standing decisions are amended, and named.** decision-73c3 (tanto
  sessions addressed by born name) gave Kanri's address three routes — the
  `kanri-address:` line, the command-line argument, the roster's first row —
  and decision-de63 (Kanri resident with a handover) made the successor
  announce its address with that line, "because under decision-73c3 an
  address dies with its session". The premise fell on 2026-09-16, when a
  window was measured to keep its name and `[ref]` across `/clear`; the
  09-18 Kikaku decision §2 is the human's word on what follows, and ADR 2
  below carries `amends: [73c3, de63]`. decision-76a6 (a queued Jisso reads
  nothing and is sent nothing until its batch prompt) is unchanged in
  substance: the prompt becomes a path, and the file the path names still
  carries the `Kanri — <name> [<ref>]` line the Jisso reads it for. Serves
  req-04f5 "Kanri is resident, but its context cost does not grow with its
  tenure", as the previous bullet does.
- **No model or effort moves for cost** (decision-1708), **the plan close
  still hands over** (decision-b6cb), and **a kind carries a model and an
  effort** (decision-03f9), which is why the boundary work gets a kind of
  its own and not a bare `default` dispatch. Serves req-04f5 "A seat stays
  under an operating context ceiling the run chooses": the ceiling's numbers
  are not touched here; the diet lowers what they measure.
- **The dialogue's five answers** (`.tanto/tanto-diet/dialogue.md`, Q1 to
  Q5, each answered "推奨で", and the four design sections, each "OK"): shape
  1 with the seam fixed; the mechanical part of the boundary to the
  subagent and the rulings to the resident; a new script `boundary.js` with
  `check` and `record`; a new kind `boundary.verify` on sonnet/high; the
  boundary's procedure moved out of `roles/kanri.md` into a brief the
  subagent reads, the policy sentences staying.

## Measured while designing

1. `roles/kanri.md` is 1,424 lines, `SKILL.md` 1,095, `passage-check.js`
   1,477, `reading.js` 440 (`wc -l`, 2026-09-19).
2. `kanri-address` appears at 20 sites: `SKILL.md` 5 (lines 34, 391, 409,
   537, 607), `roles/kanri.md` 4 (128, 148, 161, 844), one each in
   `roles/hosa.md`, `jisso.md`, `kaiseki.md`, `keikaku.md`, `kikaku.md`,
   `sekkei.md`, and 5 in templates (`batch-prompt.md` 7 and 65,
   `kaiseki-brief.md` 39, `kanri-handover.md` 37 and 43). After this plan
   `grep -rc kanri-address skills/tanto` is zero at every path.
3. "thirteen" appears at 6 sites of `SKILL.md` (lines 110, 187, 203, 215,
   238, 258); "Fourteen of them" once (935, the templates); "two
   executables" once (944).
4. `reading.js` prints two lines always (`transcript: …` and `effort=…`,
   lines 284 to 289) and three more on request; its cold/warm rule does not
   exist yet. Its records carry `timestamp` and `usage`, but its loop counts
   wake-ups and reads `usage` from every `assistant` record independently:
   the pairing of a wake-up with the next `assistant` record's `usage` and
   the gap before it, which the `ttl=` derivation needs, is new work.
5. The batch loop's mechanical steps are step 2 (two `passage-check`
   commands), step 3 (one `sections` call and the `S-n` and Batches rows),
   step 6 (the reading, the Residency rows, the Measurements rows, the
   `dispatch:` events lines), and step 8's rendering of the next prompt; the
   judgment is step 3's ruling on each item, step 5's line to the human,
   step 6's handover check and the exits, step 7's commit window, and step
   8's send.
6. The boundary subagent cannot know two things the resident holds as text:
   the readings peers' last lines carried since the previous boundary, and
   the top-family dispatches a peer's line implied (`review-ready:`, a
   review path). Both travel in the dispatch prompt as lines and go through
   `record`.

## 1. The principle, and the artifacts

A boundary is the moment Kanri reads the most and rules the least. Everything
it reads there — the two `passage-check` outputs, the report's sections, two
readings, the tables it appends to — is discarded knowledge the moment the
next prompt is sent, yet today it stays in the resident's context for the
rest of the plan and is re-read at every later wake-up and tool call. This
design moves the reading into a subagent whose context ends with its turn,
and keeps in the resident what a resident is for: the ruling, the human's
line, the commit window, and the send. Six artifacts carry it.

### 1.1 The boundary dispatch

At every batch boundary, after Jisso's one-line report and before anything
else, Kanri dispatches one subagent — kind `boundary.verify`,
`subagent_type: tanto-boundary-verify`, `model` from the merged `tanto.json`
(built-in `sonnet`) — with a prompt that names the brief and its arguments
and nothing more:

```text
Run the tanto boundary brief at <skill dir>/templates/boundary-brief.md with:
topic=<topic> batch=<X> plan=<plan path> report=<report path>
ledger=<.tanto/<topic>/kanri.md> roster=<.tanto/roster.md> base=<merge base>
kanri-transcript=<Kanri's transcript path, from the roster's first data row>
tanto=<skill dir>
peer readings since the last boundary, one per line, or none: <…>
top-family dispatches since the last boundary, one per line, or none: <…>
Write .tanto/<topic>/batch-<X>-verdict.md in your own turn. Dispatch no agents.
Reply with the verdict line only.
```

The dispatch is the one act of the boundary the resident performs before the
verdict line comes back. Kanri does not run `passage-check`, `reading.js`, or
`sections` at a boundary any more; it does not open the report; it edits no
table by hand — the one `record` call of 3.2 step 6 writes what its ruling
decides. It waits for one line.

### 1.2 `templates/boundary-brief.md`

A new template, the fifteenth. It is the procedure the subagent follows,
copied out of `roles/kanri.md`'s loop steps 2, 3, and 6 and made
self-contained: the argument list above, the two commands below, the order
the sections are read in, the rule for each row, the verdict file's form,
and the one line to reply with. Its opening paragraph says it is run by the
`boundary.verify` kind on Kanri's dispatch and, under shape 2, by a headless
session — the same text, the same arguments, the same output — and that it
dispatches nothing and writes one file. Its procedure, in order:

1. `node "<tanto>/scripts/boundary.js" check --plan <plan> --report <report>
   --base <base> --kanri-transcript <t> --tanto <tanto>` once — with
   `--measurement <path>` added when the batch carried a measurement task
   whose report is a separate file — and read its output whole: it is this
   subagent's whole reason to exist. Run it from the repository root, the
   cwd every dispatch inherits, since `passage-check boundary` runs the
   plan's checks in `process.cwd()`.
2. From the output: the `check:` line's pass or fail; the failing output of
   `boundary` and `diff`, if any; the report's sections — `Rulings needed`
   and `Verify in the tree` among them, inside For Kanri; Jisso's reading
   from the report's header; Kanri's reading with its ceiling, presence, and
   `ttl=` lines.
3. Run each check the report's `Verify in the tree` names — a test command,
   a file to look at — and note its pass or fail; a failure goes under the
   verdict file's Failures as well.
4. `node "<tanto>/scripts/boundary.js" record …` once, with the Batches row
   (state `reported`, the `check:` line as its Verdict — see 1.4), the
   per-boundary Measurements entry, one `--s-item` per item of the report's
   Shoroku proposal section, the Kanri and Jisso Residency rows from the two
   readings, one `--peer-reading` per line the dispatch carried, one
   `--event` per top-family dispatch line the dispatch carried. Read what it
   prints: the rows it wrote.
5. Render `.tanto/<topic>/batch-<Y>-prompt.md` for the next batch from
   `templates/batch-prompt.md` — the plan's Batches table gives the next
   batch's tasks, the roster's `queued` rows in handshake order give the
   Jisso — with the Previous batch verdict section's first line from the
   `check:` line and the report's For Kanri section, and three slots left
   as `<Kanri fills>`: that section's ruling line (what was accepted, what
   was returned and why), its deferral line, and the Rulings section's first
   line. When the batch is the plan's last, write no prompt and say so in
   the verdict file's Next prompt section.
6. Write `.tanto/<topic>/batch-<X>-verdict.md` (1.3).
7. Reply with the one line, and nothing else.

The brief names what the subagent never does: rule on an item, message any
session, edit a tracked file, run `git checkout --` or `git clean`, dispatch
an agent. A tracked-file modification the check finds that the plan does not
account for goes into the Failures section, not into the tree (rule 5). The
`ListAgents` self-check of `SKILL.md`'s Resuming is not the brief's either:
the listing shows the resident's own name, which only the resident can
compare with its roster row, so it stays a resident act (3.2 step 6) — the
one item of the decision file's fold list that the fold does not take.

### 1.3 `.tanto/<topic>/batch-<X>-verdict.md`

The subagent's one deliverable, with ten fixed `##` headings in this order —
and an eleventh, `Measurement`, when the batch carried a measurement task —
so that the resident reads it with `passage-check sections` and never whole:

| Heading | Body |
| --- | --- |
| `Verdict` | one line: `pass` or `fail`, then the `check:` line verbatim |
| `Failures` | the failing output of `boundary` and `diff`, and each `Verify in the tree` check that failed, or `none` |
| `Rulings applied` | the report's Rulings section, verbatim, or `none` |
| `Rulings needed` | the report's Rulings needed subsection, verbatim, or `none` |
| `Questions for the human` | the report's section, verbatim, or `none` |
| `Deviations` | the report's Deviations from the plan section, verbatim, or `none` |
| `Verify in the tree` | each check the report named, with the pass or fail the subagent got, or `none` |
| `Ceiling` | Kanri's reading, ceiling line, presence line, and `ttl=` line, as `check` printed them; Jisso's reading line |
| `Rows written` | what `record` printed |
| `Next prompt` | the path of the rendered prompt, or `none — final batch` |
| `Measurement` | only when the batch carried a measurement task: that report's Tasks and Verification sections, verbatim, for the contradiction Kanri reads them for |

Its first lines, before the headings, carry the report's
`git hash-object` and the plan's, as a review brief does, so that a line
number quoted in Failures has a fixed referent.

The reply line is:

```text
verdict: <verdict path> — pass|fail — rulings needed: <n>; human questions: <m>; compactions: <c>; ceiling: under|over, present|absent
```

`<n>` and `<m>` count items under those two headings; `<c>` is the
compactions figure of Kanri's reading, so that signal 3 is read off the line
on a clean boundary too; `ceiling:` copies the two verdicts from Kanri's
ceiling and presence lines, `unavailable` and `absent` respectively when a
line is missing, as `SKILL.md`'s reading section already reads them.

### 1.4 `scripts/boundary.js`

A new instrument beside `passage-check.js` and `reading.js`: Node, no
dependencies, no shebang, invoked as `node "$TANTO/scripts/boundary.js"`,
with `scripts/boundary.test.js` beside it run by `node --test`. Two
subcommands.

**`check`** — the arguments `--plan`, `--report`, `--base` (the merge base),
and the optional `--kanri-transcript`, `--measurement`, and `--tanto`. Runs,
as child processes and in this order, `passage-check boundary --plan`,
`passage-check diff --plan --base`, and `passage-check sections --file` on
the report with the five headings today's loop step 3 names — For Kanri,
Rulings, Questions for the human, Deviations from the plan, Shoroku
proposal; `Rulings needed` and `Verify in the tree` are `###` headings
inside For Kanri and print with it, since `sections` ends a section at the
next heading of equal or shallower depth, so neither is named a second time
— then, with `--measurement`, `sections` on that file for Tasks and
Verification, and, with `--kanri-transcript`,
`reading.js <t> --role kanri --presence`. It reads the report's header for
the reading line beside its Transcript line. It prints one line first —
`check: pass|fail — boundary pass|fail; diff pass|fail (informational)` —
then each child's output unchanged under a fixed `##`
heading: `## boundary`, `## diff`, `## sections`, `## measurement` (when
asked), `## jisso reading`, `## kanri reading`. **The verdict word is
`boundary`'s exit status alone.** `diff` runs and prints in full, and the
resident or a human reads every residual under its heading, but its exit code
never flips the verdict: a plan whose own spec and plan commits sit on the
branch it verifies makes `diff` fail at every boundary that plan will ever
have, and a verdict that can never read `pass` is a verdict nobody reads.
It judges nothing and edits
nothing. Child processes, so that `boundary.js` depends on what the two
scripts print and not on their internals; the plan may call
`passage-check.js`'s exports in-process where that is simpler, the printed
form being the contract the brief reads. `--tanto` defaults to the script's
own directory's parent. Its exit code is the `check:` line's verdict word: 0
on pass, 1 on fail, 2 when an input path is missing — so it, too, follows
`boundary` alone.

**`record`** — `--ledger <l> --batch <X>` always; every other argument is
optional, and each names the cells or rows the call writes, so that a call
touches nothing its arguments do not name:

- `--tasks <N-M>`, `--state <state>`, `--report <path>`,
  `--verdict "<one line>"` — the Batches table's row for batch `<X>`,
  replaced when a row for that batch exists and appended when not, with only
  the cells whose arguments are given rewritten;
- `--kanri "<name [ref]>" --kanri-reading "<reading>"` and
  `--jisso "<name [ref]>" --jisso-reading "<reading>"`, with `--roster <ro>`
  — the roster's Residency rows for the two, each replaced in place by Name
  (Read at `batch <X>`, the five figures split out of the reading string,
  Context `context=<n>`), and, when both readings are given, the
  Measurements per-boundary entry: inside the Value cell of the row "Kanri's
  context at the topic's opening …", one `batch <X>: kanri context=<n>,
  jisso context=<n>, ttl=<v>` entry per batch separated by `;`, the batch's
  own entry replaced and every other entry — the opening and the landing
  entries Kanri writes by hand — left untouched;
- repeatable `--peer-reading "<role> <name [ref]> <reading>"` — that peer's
  Residency row, the same way;
- repeatable `--s-item "<source> | <item>"` — one `S-n` row each, numbered
  from the table's highest existing `S-n`, Adopted `pending`, Stage `t2`,
  Written `no`;
- repeatable `--event "<line>"` — one Session events line each;
- `--progress "<one line>"` — the ledger's Progress line, replaced whole;
- repeatable `--status "<name [ref]> <live|cleared|queued>"`, with
  `--roster <ro>` — that roster row's Status cell.

It prints every row it wrote, as written. Re-running it with the same
arguments changes nothing and prints the same rows; a table whose heading it
cannot find makes it write nothing and exit 1, naming the table.

`--state` takes one of the five values the ledger template's Batches table
names — planned, sent, reported, accepted, rework. The brief writes
`reported`, with the `check:` line in the Verdict cell; acceptance is a
ruling, so the resident makes **one** `record` call per boundary, at 3.2
step 6, carrying the state its ruling gives with its verdict line, the
Progress line, the Status changes the boundary decided — the retiring Jisso
`cleared`, the Jisso just sent `live`, a seat released at step 4 `cleared` —
and one `--s-item` per item of an exit proposal recorded at that boundary.
That call is the whole of the resident's table writing; at a boundary no
table is edited by hand.

The `S-n` counter reads the table it appends to, so a `pending` row a Kanri
exit wrote there since the last boundary is counted and not overwritten.

### 1.5 `reading.js`: the `ttl=` line

The reading's command prints a third line always, after `effort=`:
`ttl=5m|1h|unknown`. For each wake-up, the gap since the most recent record
that carried a timestamp — a wake-up included, not only an `assistant`
record, because two wake-ups can arrive with no `assistant` record between
them and measuring from the earlier `assistant` record would then report idle
time that did not pass — is paired with the next `assistant` record's
`usage`; the
wake-up is **cold** when `cache_creation_input_tokens + input_tokens` exceeds
`cache_read_input_tokens`, warm otherwise (§0's rule). Among the wake-ups
whose gap is between 5 and 60 minutes, the most recent one decides: cold
reads `5m`, warm reads `1h`; no such wake-up yet reads `unknown`. The line
travels nowhere by itself — the reading that is appended to boundary and
exit lines stays the first line — but `check` prints it under
`## kanri reading`, the verdict file's Ceiling section carries it, and the
Measurements per-boundary entry gets it in its value cell, so that a Kanri
and a human reading a boundary can see when context costs ten times. The
`--share` form is unchanged. `reading.test.js` gains cases for the three
values and for the 5-to-60-minute window's edges.

### 1.6 The `batch:` line

Kanri (its subagent, under 1.2 step 4; Kanri itself for a rework prompt)
writes `.tanto/<topic>/batch-<X>-prompt.md` as today. What is sent is:

```text
batch: <path>
(tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)
```

Jisso reads the file the path names. The human's paste fallback pastes that
one line. The file is a file a line points at, so it carries no `no-role`
line of its own any more (`templates/batch-prompt.md` line 3 goes). The
Guard paragraph stays and its `not me` goes to the roster's first data row,
read at that moment; the Report section's send goes there too; the Setup on
resume section's `Kanri — <name> [<ref>]` line stays as information. A
rework prompt is the same file rewritten and the same line re-sent.

### 1.7 The handover without ceremony

- **The successor starts in the outgoing Kanri's own window.** The handover
  file's Commands for the human become three lines — `/clear` this window;
  `/model` and `/effort` as `sessions.kanri` says; `/tanto kanri` — and the
  "or pick any free window" alternative goes. The roster's first data row
  is rewritten for its Transcript, Started, Model, and Effort columns; Name
  `[ref]` stays, because the window keeps it across `/clear` (measured
  2026-09-16). A successor that the human nevertheless starts in another
  window rewrites the Name column too, and nothing else changes: every peer
  reads the row.
- **No `kanri-address:` line exists.** The `handover accepted` broadcast,
  the `resumed` broadcast, the "Kept Kanri" gap's broadcast, and the peers'
  re-send on receiving one are removed at all 20 sites (Measured 2). A peer
  that sent a line into a gap and got `no-role` holds it and re-sends it to
  the roster's first data row, read fresh, at its next wake-up, until it is
  answered. A peer waiting on Kanri holds no subscription and is messaged by
  Kanri alone, so that wake-up is the human's word in its window or a line
  from the new Kanri — later than a broadcast would have reached it, and the
  price of not caching. On Kanri's side, every peer line it receives and does
  not answer in the same turn becomes a Session events line,
  `unanswered: <from> — <line>`, through `record --event`, and
  `answered: <from> — <line>` when it is; the successor's cold read — after a
  handover, or in the Kept Kanri gap, which has no handover file — pairs
  them and answers the open ones first, and the handover file's Live peers
  carries the same mark for the peers it lists.
- **No role caches Kanri's address.** `SKILL.md`'s "The address" bullet
  reads: Kanri's address is the roster's first data row, read at the moment
  of sending; the second argument of `/tanto <role> <address>` is the
  bootstrap for a workspace whose roster does not yet exist, and is
  otherwise not given. Kanri's create requests drop the `<name>` argument.
- **The handover file shrinks.** In flight, Live peers (with the unanswered
  mark, without the re-send clause), Open questions for the human, Next
  step, and Not reconstructed stay as they are. Rulings the next batch
  inherits becomes one line pointing at the ledger's Rulings section plus
  the Models line; Residency becomes one line pointing at the roster's
  Residency row and the reading taken; Why stays one line.

## 2. `skills/tanto/SKILL.md`

### 2.1 The expected-model config

Line 110's sentence lists fourteen kinds, `boundary.verify` after
`branch.review`. Every "thirteen" (Measured 3) becomes "fourteen"; the
retired-file clause is unchanged. The built-in defaults paragraph names
`boundary.verify` among the resident-side kinds that run on the cheaper
families.

### 2.2 "Handshake and roster": The address

The second bullet is replaced by the text 1.7's third item gives. The
paragraph after the bullets ("Kanri's address is the first data row of the
roster. A message whose first line is `kanri-address: …`") becomes: "Kanri's
address is the first data row of the roster, read at the moment of sending. A
role whose send to Kanri errors, or gets `no-role` back, holds its line and
re-sends it to that row, read fresh, at its next wake-up." The fourth
bullet's clause "which learns Kanri's name from the batch prompt that makes
it live" becomes "which reads Kanri's row when its prompt wakes it". The
Invocation line, `/tanto <role> [<kanri-address>]`, becomes
`/tanto <role> [<address>]`, the argument being the bootstrap 1.7 describes.

### 2.3 "Resuming"

The Kanri bullet drops the broadcast: "Kanri rewrites the roster's first data
row with its new name and `[ref]`. A peer not listed was resumed too, and
re-handshakes on its own `/tanto fukki`, finding the new first row." The
role bullet is unchanged.

### 2.4 "Messages"

The `no-role` bullet's clause "re-sends it when the next `kanri-address:`
line arrives" becomes "re-sends it to the roster's first data row, read
fresh, at its next wake-up, until it is answered". Its clause on the batch
prompt — "a batch prompt, whose text is what `templates/batch-prompt.md`
renders, carries it after its title line, and the file carries it there too,
so that a pasted file and a sent message are the same bytes" — becomes "a
batch prompt travels as the one line `batch: <path>`, and the file it names
carries no such line". The idle-subscription bullet's "batch prompts" example
stays: the `batch:` line is sent without one.

### 2.5 "Artifacts"

- The `batch-<X>-prompt.md` row's Content: "the prompt; sent as
  `batch: <path>`, which the human pastes if the message did not arrive".
- A new row `.tanto/<topic>/batch-<X>-verdict.md` — Writer: the
  `boundary.verify` kind Kanri dispatches; Readers: Kanri, by `sections`;
  Content: the boundary's verdict, ten fixed sections and an eleventh when
  the batch carried a measurement task (1.3).
- The `kanri-handover.md` row's Content adds "In flight, Live peers, and Not
  reconstructed in full; the rest pointers".
- The `.tanto/<topic>/kanri.md` row's Writer: "Kanri, or the `boundary.verify`
  subagent it dispatches, through `boundary.js record`".
- The templates sentence says fifteen and adds `templates/boundary-brief.md`.
- The executables paragraph says three, adds `scripts/boundary.js` with its
  two subcommands and who runs it (the `boundary.verify` subagent, and under
  shape 2 a headless session), names `passage-check.js`'s runners as
  Keikaku, Jisso, the `boundary.verify` subagent at every boundary in
  Kanri's place, and the whole-branch reviewer — "by Kanri at every boundary
  it rules on" goes — and says `reading.js` prints three lines always.

### 2.6 "The transcript reading"

"That prints two lines always: the reading, then the effort" becomes "three
lines always: the reading, the effort, then `ttl=`", with one sentence for
what `ttl=` means and that it travels in the verdict file and the
Measurements entry, not on the boundary line.

### 2.7 Rule 3 and rule 6

Rule 3 gains the clause "a subagent Kanri dispatches to a boundary writes the
ledger and the roster as Kanri's hand, through `boundary.js record`, and
nothing else". Rule 6 is unchanged; it already binds the new kind.

## 3. `skills/tanto/roles/kanri.md`

### 3.1 "Start": the five cases

The **Handover accepted** case loses the sentence beginning "send every
`live` peer, to its bare name from the roster, one line `kanri-address: …`"
through "is what tells it to re-send"; in its place: "read the ledger's
Session events for `unanswered:` lines without their `answered:` pair, and
the handover file's Live peers for its marks, and answer those lines first". The **Kept Kanri** gap paragraph loses "and
send every `live` peer the same `kanri-address:` line Handover sends, so a
line a peer sent into the gap and got `no-role` back knows to re-send" — the
peer re-sends on its own. The **Resumed Kanri** case loses "send the
`kanri-address:` line of `SKILL.md`'s Resuming to every `live` row,".

### 3.2 "The batch loop", replaced whole

The eight steps become six, and the mechanical text moves to the brief:

1. Wait for Jisso's one-line report, as today (the text of step 1 stays).
2. **Dispatch the boundary** (1.1). Wait for the verdict line.
3. **Rule.** When `rulings needed` or `human questions` is above zero, the
   verdict is `fail`, or `ceiling:` says `over, present`, read the verdict
   file's sections that apply — Rulings needed, Questions for the human,
   Deviations, Failures, Verify in the tree, Ceiling, Measurement — with
   one `sections` call, and rule as today: a known cause is an `R-n` in the
   ledger; an unknown cause opens the Kaiseki branch; a scope or spec change
   goes to the human; a `fail` is a rework or an acceptance over it. Bug
   reports need nothing from you here: a report received during the batch
   sits in `.tanto/inbox/`, answered `received:` by its intake, and is read
   at the close ("Bug intake" below); a fix the human orders on one is the
   hotfix lane, in slot (b) of step 5 — the sentence `bug-report-hold` put
   at its step 4, carried into this step with its step number changed. Then
   report one line to the human, as today's step 5 says.
4. **Lifecycle.** The handover trigger is read off the verdict line:
   `ceiling: over, present` runs the handover; `over, absent` defers it with
   the three writings the Handover section prescribes; a `compactions:`
   figure above the count you have noticed is signal 3. Create requests,
   exits, and `release:` as today's step 6 says, without the reading and the
   row writing it prescribed — the brief has done them, and your `record`
   call at step 6 finishes them. The idle block, unchanged.
5. **The commit window**, today's step 7 with its text unchanged.
6. **Record and send.** Fill the rendered prompt's three `<Kanri fills>`
   slots — the Previous batch verdict's ruling line and deferral line, and
   the Rulings section — and save it. Run the `ListAgents` self-check of
   `SKILL.md`'s Resuming, once. Send `batch: <path>` with the `no-role` line
   to the Jisso the prompt names. Then the one `record` call of 1.4: the
   Batches row's state and verdict, the Progress line, the Status changes —
   the retiring Jisso `cleared`, the Jisso just sent `live`, any seat
   released at step 4 `cleared` — and the `--s-item` rows of any exit
   proposal step 4 recorded. A rework prompt is written by you from the same
   template, for the same Jisso, and sent the same way.

**The renumbering.** `bug-report-hold` kept its step 4's number and left the
renumbering to this topic (its 3.2: "renumbering is `tanto-diet`'s, D-7").
The map from today's eight to these six: 1 → 1; 2 and 3 → 2 and 3 (the
verification and the reading to the dispatch, the ruling to step 3); 4 →
gone, its sentence inside step 3; 5 → the last sentence of step 3; 6 → 4;
7 → 5; 8 → 6. Every `step n` and `loop step n` reference outside the loop is
renumbered by that map — in `roles/kanri.md` at today's lines 573 ("loop
step 6's release"), 654 and 682 ("loop step 6"), 869 ("loop step 6's
proposal"), 892 ("loop step 8"), 1188 ("commit window at loop step 7"), 1370
("accepted at loop step 6"), and 1391 to 1393 (Readings), with 577 and 579
("step 3's `T2:` line") checked and left when they name the final batch's
own numbering; in `templates/kanri.md` at 125 to 126 ("the two readings of
loop step 6"). Two of them change meaning as well as number: Readings' "copy
each into that role's Residency row at loop step 6" becomes "pass each as a
`--peer-reading` of the boundary's dispatch, and `record` writes the row",
and the trigger's "At every check take your own reading … and rewrite your
Residency row with it" (3.3) applies to the checks outside a boundary only,
the boundary's row being `record`'s. The paragraph after the steps ("Steps
4, 6, and 7 are everything that needs Jisso idle …") reads "Steps 3 to 6".
The plan verifies with `grep -n 'loop step [78]' roles/kanri.md` empty and
every remaining `loop step n` read against the map. The measurement-report
paragraph of today's step 3 moves into the brief, which passes that report
to `check --measurement`; the verdict file's Measurement section carries the
two sections Kanri reads for the contradiction.

### 3.3 "Handover"

"The trigger" keeps its four signals and the presence gate; the sentence
"take your own reading with `--role kanri` and read its ceiling line" at
signal 4 becomes "read the verdict line's `ceiling:` at a boundary, and take
your own reading with `--role kanri --presence` at the start of every turn
while no batch is in flight"; the same section's "At every check take your
own reading … and rewrite your Residency row with it" gains "outside a
boundary — at a boundary the row is the `record` call's" (3.2, the
renumbering). "The handover file" loses the clause "the
successor sends `kanri-address:` to all of them — the `live` rows; … and
each answers by re-sending its last unanswered line, which is also what a
peer does with a line that got `no-role` back in the gap" and says instead
that the successor answers the marked lines first. "The handover, in a plan
and between plans", step 4: "the human `/clear`s this window and runs
`/tanto kanri` in it" — the "or in any free window" goes.

### 3.4 "Session lifecycle": Create

Every request line drops `<name>`: `/tanto jisso`, `/tanto keikaku`,
`/tanto sekkei`, `/tanto kaiseki`. The bootstrap row is unchanged. The
column's heading stays. Five more sites carry the argument and change with
the table: today's lines 337 ("`/tanto jisso <name>`; the human may open
more"), 532 ("queued by the same `/tanto jisso <name>`"), 810 (the residency
line's "the human copies the bare name into the next
`/tanto <role> <name>`"), and the create request's numbered list at 1308 to
1319, whose
line 5 becomes `/tanto <role>` and whose two sentences — "with your own bare
name as your start line printed it in place of `<name>`" and "Line 5 carries,
after the command, what the Create table's third column names" — go, the
third column's other items (the plan path, the branch, the topic, the spec
path) staying on the line. The README's matching lines are section 7's. All
of these land in the final batch (section 8).

### 3.5 The dispatch sites

The loop's step 2 (3.2) is the one dispatch site of the new kind: it names
`boundary.verify`, `subagent_type: tanto-boundary-verify`, and that the
model comes from the merged config and is named on every dispatch. The file
has no list of kinds to extend — each kind is named where it is dispatched
(the cold read at the landing, the branch review at the final batch, the
recommend and the apply at the close) — and those sites are unchanged.

## 4. The other role files

`roles/jisso.md`, `sekkei.md`, `keikaku.md`, `kaiseki.md`, `kikaku.md`,
`hosa.md`: the sentence "A message whose first line is
`kanri-address: <name> [<ref>]` replaces Kanri's address from then on; if a
send to Kanri errors, re-read the roster's first data row" becomes "Kanri's
address is the roster's first data row, read at the moment of sending; a
send that errors or gets `no-role` back is held and re-sent to that row,
read fresh, at your next wake-up". `roles/jisso.md`'s Start section: "your
batch prompt … it is your orders" gains "it arrives as one line,
`batch: <path>`; read that file".

## 5. The templates

- **`templates/boundary-brief.md`** — new (1.2).
- **`templates/batch-prompt.md`** — line 3's `no-role` line removed; the
  Guard's `<kanri-address>` and the Report section's become "the roster's
  first data row, read at that moment"; the Previous batch verdict's ruling
  line and deferral line and the Rulings section's first line read
  `<Kanri fills>` in the rendered draft, and the template says which three
  slots those are (1.2 step 5, 3.2 step 6).
- **`templates/kanri-handover.md`** — Live peers' clauses on
  `kanri-address:` and the re-send removed; Rulings the next batch inherits
  and Residency reduced to pointers (1.7); Commands for the human reduced to
  three lines.
- **`templates/kaiseki-brief.md`** — line 39's `<kanri-address>` becomes
  "the roster's first data row, read at that moment".
- **`templates/tanto.json`** — `"boundary.verify": { "model": "sonnet",
  "effort": "high" }` under `subagents`, after `branch.review`.
- **`templates/kanri.md`** — the ledger's opening sentence names the
  boundary subagent as Kanri's hand; the Measurements per-boundary row's
  description gains the entry form `batch <X>: kanri context=<n>, jisso
  context=<n>, ttl=<v>`, entries separated by `;`, the opening and landing
  entries written by Kanri and the batch entries by `record`; the Session
  events description gains the `unanswered: <from> — <line>` /
  `answered: <from> — <line>` pair (1.7); its "loop step 6" at 125 to 126
  is renumbered (3.2).

## 6. The scripts and their tests

- `scripts/boundary.js` and `scripts/boundary.test.js` — new (1.4). The
  tests build a scratch ledger and roster from the templates, run `record`
  twice, and assert the second run changes nothing; run `check` against a
  fixture plan and report and assert the `check:` line and the five
  headings; assert exit 1 with the table's name when a heading is missing.
- `scripts/reading.js` and `scripts/reading.test.js` — the `ttl=` line
  (1.5).

## 7. `skills/tanto/README.md`

Layout gains `scripts/boundary.js` with its two subcommands and
`templates/boundary-brief.md`; the `reading.js` bullet says three lines; the
Prerequisites bullet names the third script; the "What it does" paragraph on
Kanri's residency says the boundary runs in a subagent. Usage's lines 99 to
116 lose `<kanri>`: the roles start with `/tanto <role>` and read the
roster's first row, and the sentence "`<kanri>` is the bare name Kanri's
request prints" goes — in the final batch, with 3.4. The list of designs
this skill implements, at the file's end, gains
`2026-09-19-tanto-diet-design.md`. After the plan, `SKILL.md` and the README
agree on fifteen templates and three executables.

## 8. The boundary, and rule 11

This plan edits the skill's own files, and the sessions that run it load the
working tree's copy (rule 11, decision-5c8e). Its Global Constraints therefore say: the
authority for the run's sessions is the plan, Kanri's orders line, and the
batch prompts, not the role text on disk; **the safe boundary is the final
one** — no role is started or replaced before it. Three consequences the plan
states:

- **The Kanri that runs this plan runs the old boundary.** It verifies in
  place with the two commands, reads the report by sections, writes its own
  rows, and sends the full prompt text, exactly as the role file said before
  batch A — because the brief, `boundary.js`, and the new kind's definition
  do not exist in the tree until this plan writes them, and a definition
  written during a session is not visible to it. The new procedure is first
  run by the Kanri of the topic that opens after this plan's merge.
- **`kanri-address:` is removed in the final batch.** Peers live during this
  plan — its own Jissos, a Sekkei or Keikaku of another topic — hold the old
  re-send rule; removing the line before they are released would leave a
  successor Kanri with peers waiting for a broadcast the file no longer
  prescribes. The final batch changes `SKILL.md` 2.2 to 2.4, `roles/kanri.md`
  3.1 and 3.3, the six role files of section 4, and the three templates that
  carry the slot, together.
- **The create requests keep their `<name>` argument until the merge**, for
  the same reason: the human pastes what the running Kanri's file says. So
  3.4, and the README's `<kanri>` lines of section 7, are in the final batch
  too.

## Where each change lives

| Path | Sections above |
| --- | --- |
| `skills/tanto/SKILL.md` | 2.1 to 2.7 |
| `skills/tanto/roles/kanri.md` | 3.1 to 3.5 |
| `skills/tanto/roles/jisso.md`, `sekkei.md`, `keikaku.md`, `kaiseki.md`, `kikaku.md`, `hosa.md` | 4 |
| `skills/tanto/templates/boundary-brief.md` (new) | 1.2, 5 |
| `skills/tanto/templates/batch-prompt.md` | 1.6, 5 |
| `skills/tanto/templates/kanri-handover.md` | 1.7, 5 |
| `skills/tanto/templates/kaiseki-brief.md` | 5 |
| `skills/tanto/templates/tanto.json` | 5 |
| `skills/tanto/templates/kanri.md` | 5 |
| `skills/tanto/scripts/boundary.js`, `boundary.test.js` (new) | 1.4, 6 |
| `skills/tanto/scripts/reading.js`, `reading.test.js` | 1.5, 6 |
| `skills/tanto/README.md` | 7 |

## Old values this plan contradicts

Sentences on disk today that the design replaces; a reviewer checks the plan
changes each.

- `SKILL.md` line 110: "The thirteen kinds are …" (and lines 187, 203, 215,
  238, 258).
- `SKILL.md` lines 391 to 393: "in this order of precedence: the
  `kanri-address:` line below; the second argument of
  `/tanto <role> <address>`, pasted by the human from Kanri's request; the
  first data row of `.tanto/roster.md`."
- `SKILL.md` lines 408 to 411: "A message whose first line is
  `kanri-address: <name> [<ref>] — handover accepted; the roster's first row
  is rewritten` comes from a successor Kanri and replaces Kanri's address
  from then on".
- `SKILL.md` lines 536 to 538: "and sends `kanri-address: <name> [<ref>] —
  resumed; the roster's first row is rewritten` to every `live` roster row".
- `SKILL.md` lines 590 to 596: "a batch prompt, whose text is what
  `templates/batch-prompt.md` renders, carries it after its title line, and
  the file carries it there too, so that a pasted file and a sent message are
  the same bytes".
- `SKILL.md` lines 606 to 607: "re-sends it when the next `kanri-address:`
  line arrives".
- `SKILL.md` line 917 (Artifacts): "the same text as the `SendMessage`, so
  the human can paste it if the message did not arrive".
- `SKILL.md` line 935: "Fourteen of them"; line 944: "The skill also ships
  two executables"; "The transcript reading": "That prints two lines always:
  the reading, then the effort."
- `roles/kanri.md` lines 127 to 131: "send every `live` peer, to its bare
  name from the roster, one line `kanri-address: … handover accepted …`";
  line 148: "send every `live` peer the same `kanri-address:` line Handover
  sends"; line 161: "send the `kanri-address:` line of `SKILL.md`'s Resuming
  to every `live` row".
- `roles/kanri.md`, "The batch loop", step 2: "Verify the tree before
  reading the report, with two commands"; step 3: "Read the report by its
  sections, never whole, … with one call"; step 6: "Take your own reading
  with `--role kanri`, read Jisso's ceiling line from its report's header …
  and rewrite the roster's Residency rows"; step 8: "send the same text to
  that name, without an idle subscription".
- `roles/kanri.md` line 844: "the successor sends `kanri-address:` to all of
  them"; "The handover, in a plan and between plans" step 4: "or in any free
  window".
- `roles/kanri.md`, Create table: "`/tanto jisso <name>`", "`/tanto keikaku
  <name>`", "`/tanto sekkei <name>`", "`/tanto kaiseki <name>`".
- `roles/jisso.md` lines 15 to 17, and the matching sentence in `sekkei.md`
  14, `keikaku.md` 13, `kaiseki.md` 15, `kikaku.md` 10, `hosa.md` 9: "A
  message whose first line is `kanri-address: <name> [<ref>]` replaces
  Kanri's address from then on".
- `templates/batch-prompt.md` line 3 (the `no-role` line), line 7: "reply
  `not me` to `<kanri-address>`", line 65: "then send `<kanri-address>` one
  line with its path"; `templates/kaiseki-brief.md` line 39, the same.
- `templates/kanri-handover.md` line 37: "the successor sends
  `kanri-address:` to all of them"; line 43: "that peer re-sends it to the
  successor's `kanri-address:`"; Commands for the human line 1: "or pick any
  free window of `<repo path>`".
- `README.md`, Layout: the two script bullets and "Both scripts are Node";
  Usage lines 99 to 108: "with Kanri's name as its request prints it:
  `/tanto sekkei <kanri>` …", and 114 to 116: "`<kanri>` is the bare name
  Kanri's request prints".
- `SKILL.md` line 34: "`/tanto <role> [<kanri-address>]`"; lines 400 to
  402: "never to a `queued` Jisso, which learns Kanri's name from the batch
  prompt that makes it live"; lines 944 to 947: "run by Keikaku … by Jisso
  at every batch boundary, by Kanri at every boundary it rules on".
- `roles/kanri.md`, the `loop step n` references outside the loop, at
  today's lines 573, 654, 682, 869, 892, 1188, 1370, and Readings 1391 to
  1393 ("copy each into that role's Residency row at loop step 6"); the
  trigger's "At every check take your own reading … and rewrite your
  Residency row with it" (745 to 747); `templates/kanri.md` 125 to 126
  ("the two readings of loop step 6").
- `roles/kanri.md` line 337: "`/tanto jisso <name>`; the human may open
  more"; 532: "queued by the same `/tanto jisso <name>`"; 810: "the human
  copies the bare name into the next `/tanto <role> <name>`"; 1308 to 1319:
  "with your own bare name as your start line printed it in place of
  `<name>`", "`5. /tanto <role> <name>`", "Line 5 carries, after the
  command, what the Create table's third column names".
- `roles/kanri.md`, "The batch loop", step 4 as `bug-report-hold` writes
  it: "a fix the human orders on one is the hotfix lane, in slot (b) of
  step 7" — the number changes here.

## Requirements

For the T2 shoroku, to `docs/requirements/04f5-tanto.md`:

- Under "Kanri is resident, but its context cost does not grow with its
  tenure": *The boundary's verification, reading, and row appends run in a
  context that ends with the boundary; the resident keeps one line and the
  rulings it makes on it.*
- A new bullet: *A role reads Kanri's address from the roster at the moment
  of sending; no role caches it and no line announces it.*
- Under "A session's cost is measured, not guessed": *The reading says which
  cache regime the session is in.*

## The ADRs

Two decisions, for `docs/decisions/`:

1. **The boundary runs in a thrown-away context.** Kanri dispatches a
   `boundary.verify` subagent per boundary, which runs `boundary.js check`
   and `record`, renders the next prompt, and writes a verdict file; the
   resident reads a line and rules. Alternatives rejected: the resident
   keeps the reading and writes the rows itself (the six Edits' old and new
   text stay in its context, half the diet); the subagent also rules on
   known causes (moves `R-n` judgment out of the seat that owns it and
   rewrites rule 1's premise); a headless Kanri per boundary now (three
   points the spike left unmeasured). Consequence: `roles/kanri.md`'s loop
   loses its procedure text to a brief, and the same brief is what shape 2
   would run headless.
2. **Kanri's address is read, never announced** — `amends: [73c3, de63]`.
   The roster's first data row, read at the moment of sending, is the
   address; the `kanri-address:` line and its two broadcasts are retired;
   the command-line argument stays as the bootstrap for a workspace with no
   roster; the successor starts in the outgoing window; the batch prompt
   travels as `batch: <path>`. Why de63's "must announce" no longer holds:
   its reason was that an address dies with its session, and a window keeps
   its name and `[ref]` across `/clear` (measured 2026-09-16), so the
   successor's address is the one the row already holds. Alternative
   rejected: a session list in a project JSON (the 09-18 decision §7).
   Consequences: a peer that sent into a gap re-sends on its own next
   wake-up, which in a handover-less gap is the human's word in its window
   or a line from the new Kanri; Kanri records every peer line it does not
   answer in the same turn as an `unanswered:` Session events line and
   pairs it with `answered:`; the successor answers the open ones first.
   decision-76a6 is unchanged in substance.

## What the plan must contain

- Global Constraints: rule 11's authority sentence; the safe boundary is the
  final one; the Kanri running this plan uses the old boundary and sends
  full prompts; the `kanri-address:` removal and the create-request change
  are in the final batch (section 8).
- Task order: `boundary.js` with its tests and `reading.js`'s `ttl=` with
  its tests first (section 6); then `templates/boundary-brief.md`,
  `tanto.json`, `batch-prompt.md`, `kanri.md` (section 5); then
  `roles/kanri.md` 3.2 and 3.5 (the loop, its renumbering, and the dispatch
  site), `SKILL.md` 2.1, 2.5, 2.6, 2.7, and the README's Layout,
  Prerequisites, and design list; the final batch holds 2.2 to 2.4, 3.1,
  3.3, 3.4, section 4, the three templates' `<kanri-address>` slots, and
  the README's `<kanri>` lines together.
- Every change site is located by its quoted sentence as it stands after
  `bug-report-hold`'s merge, never by today's line number: that plan's
  Artifacts rows, Shoroku steps, and Bug intake replacement shift every
  `SKILL.md` line after 30 and every `roles/kanri.md` line after 405 that
  this spec cites. Two sites both specs edit — `SKILL.md`'s `no-role` bullet
  (`bug-report-hold` 2.3 changes its bug-report clause; this spec its
  re-send and batch-prompt clauses) and `roles/hosa.md`'s opening paragraph
  (`bug-report-hold` 4.5 rewrites the sentences before the address
  sentence; this spec the address sentence) — take this spec's edit on
  `bug-report-hold`'s text.
- Every task that edits `SKILL.md` or a role file ends with the
  repository's lint on the changed paths and a commit by explicit path.
- A verification list per batch as under Verification, and a final task that
  runs the whole list.
- No measurement task: this plan's own Kanri runs the old boundary. The
  spec names the measurement for the next topic instead (Verification, last
  item).

## Verification

- `node --test 'skills/tanto/scripts/*.test.js'` passes — the quoted glob,
  since `node --test <directory>` fails on this host (issue-235b) —
  `boundary.test.js` and the new `reading.test.js` cases included.
- `node "$TANTO/scripts/boundary.js" check` run against an existing report
  and plan on disk — `.tanto/seat-lineage/batch-fixwave-report.md`, the one
  report on disk that carries the 2026-09-16 heading `## Shoroku proposal`,
  with `docs/superpowers/plans/2026-09-17-seat-lineage.md`, both present on
  2026-09-19 — prints the `check:` line and the five headings (the
  `boundary` and `diff` halves may fail against a landed plan; the
  verification is that the command runs and prints, not that it passes).
- `record` run twice on scratch copies of a ledger and the roster leaves the
  second run's diff empty.
- `grep -rc kanri-address skills/tanto` is zero at every path;
  `grep -c thirteen skills/tanto/SKILL.md` is zero; `grep -c
  'tanto-boundary-verify' skills/tanto/roles/kanri.md` is at least one;
  `grep -n 'loop step [78]' skills/tanto/roles/kanri.md` is empty and every
  remaining `loop step n` there and in `templates/kanri.md` reads against
  3.2's map; `grep -c '<kanri>' skills/tanto/README.md` is zero;
  `templates/tanto.json` parses and has fourteen `subagents` keys.
- `./scripts/lint.sh` on the changed paths passes.
- **For the next topic's Kanri, not this plan**: at each boundary of its
  first plan, its tool calls per boundary (target: 16 to 5 or fewer), its
  `context=` delta per batch, its `context=` at the plan's landing and
  close against 145k, and the `ttl=` values — into that ledger's
  Measurements table.

## Out of scope

- The shape 2 controller, and whether a headless session runs a role file
  end to end, survives a host restart, or what its permission mode is.
- Shape 3, the deterministic conductor.
- Any change to `ceiling.kanri`, `ceiling.jisso`, `presence_minutes`, or
  `share_threshold`.
- Any model or effort change (decision-1708).
- Kikaku's own footprint (the 09-19 decision §1 says it is not a topic).
- `reading.js --usage` (the `tanto-feedback` topic's).
- A rewrite of `roles/kanri.md` beyond the sections named.

## Issues this design closes

- **issue-f5d8** ("the handover template's Live peers row disagrees with
  `roles/kanri.md` about where an unanswered peer is marked") — closed by
  1.7: the mark sits in the handover file's Live peers row, as the template
  has it, and 3.1 and 3.3 say the successor answers the marked lines first;
  the re-send rule that made the two disagree is gone.
- **issue-43a8** (a non-Kanri handshake carries no topic field; proposes
  `/tanto <role> <kanri-address> [<topic>]`) — touched, not closed: the
  address argument becomes the bootstrap only (1.7), so the proposed form
  would read `/tanto <role> [<topic>]`; the issue's question stands.
- **issue-894d** (a `/clear` can reuse the same name and ref for a new
  session) — touched: it relies on "`no-role`, then wait for
  `kanri-address:`"; under 1.7 the peer re-sends at its next wake-up, and
  the issue's scenario is answered by the roster row's Transcript column as
  before.
- **issue-40ed** (a count threshold for the Kanri handover) — unaffected;
  its count of `kanri-address:` sends in the handover's cost falls to zero,
  which the next Measurements table shows.

Open issues on the batch prompt's size or the boundary's tool-call count:
none found (grep of `docs/issues/open/` for `batch prompt`, `tool call`,
`kanri-address`, 2026-09-19).

## Answers to the spec inputs

`.tanto/tanto-diet/spec-inputs.md` holds two, both answers to the passage
check of section 4 and 1.7, relayed verbatim.

- **I-1 (Hosa):** the change touches `roles/hosa.md` line 9 directly; Hosa
  would drop the `kanri-address:` handling and read the roster's first row
  fresh at send time, holding and re-sending on an error or a `no-role` at
  its next wake-up. Answered by section 4 as written: that is the sentence
  the six role files get.
- **I-2 (Keikaku):** the change touches Keikaku directly; it holds a
  `kanri-address:` value received mid-coldread and would instead re-read the
  roster at each send, never expecting an unprompted broadcast; no
  objection. Answered by section 4, and by section 8's second consequence:
  the removal lands in the final batch, so a peer holding a broadcast value
  today keeps a rule that still describes its file until it is released,
  and no live peer is asked to switch rules mid-tenure. Neither answer
  changes the design.

## Deferred items

1. Shape 2: the controller that watches `.tanto/<topic>/` and spawns a
   headless session per boundary with this spec's brief; the three
   unmeasured points of the spike.
2. Whether `ceiling.kanri.per_batch` (65000) still describes a thin
   resident's growth — decided from the next topic's Measurements.
3. Whether `check` should also run the repo-specific leftovers check (stray
   processes, temp directories) that today's step 2 leaves to Kanri's eye;
   today it stays a sentence in the brief.
4. Whether the verdict file's `Rows written` section makes the ledger's own
   Session events line per boundary redundant.

## Shoroku proposal from this spec work

The exclusions: this spec, the spec review to come, and `dialogue.md`, which
the close's recommender reads for itself.

1. Rejected: shape 2 designed now (Q1 b) — the spike's three unmeasured
   points would be the spec's premises. Rejected: shape 2 directly, no shape
   1 (Q1 c) — moves the human's counterpart to another window at the same
   time.
2. Rejected: the subagent does verification and reading only (Q2 b) — the
   row appends' old and new text would stay in the resident. Rejected: the
   subagent rules on known causes (Q2 c) — `R-n` ownership leaves the seat.
3. Rejected: no fold script, the brief lists today's commands (Q3 b) — the
   hand-edited tables keep their error rate. Rejected: a superset subcommand
   in `passage-check.js` (Q3 c) — a Keikaku instrument would carry Kanri's
   ledger writing.
4. Rejected: `default` for the boundary (Q4 b) — medium effort for a
   verdict, and no independent knob. Rejected: opus (Q4 c) — a per-batch
   top-family one-shot against the diet.
5. Rejected: `roles/kanri.md` rewritten whole (Q5 c) — beyond the topic and
   too wide a rule-11 diff.
6. Measured: 20 `kanri-address` sites across 11 files; 6 "thirteen" sites.
7. Observed: the boundary subagent cannot see peers' readings or the
   resident's top-family dispatches; they must ride in the dispatch prompt
   (Measured 6). A design that wanted them out of the resident's hands would
   need peers to write their readings to a file, which no line does today.
8. Observed: `record`'s idempotency is what makes the rework path one
   command instead of an Edit; without it the resident would edit a table
   again.
9. Observed: the five dialogue questions were each answered by the
   recommendation; the four design sections each by "OK". The human's cost
   for this spec was nine turns.
10. Observed, during this spec work: a Kanri handover fell while this seat's
    passage-check line was unanswered, and the ledger held no record of the
    line, so a successor's cold read would not have found it. The
    `kanri-address:` broadcast made this seat re-send; under 1.7 the
    re-send-at-next-wake-up rule covers the same gap, which is why that rule
    is in the design and not only the successor's ledger read.
