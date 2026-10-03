# Design: shoki-seat — the shoki start block is the `--add-dir` argument order; the prompt moves before it and a lost prompt is an error; Kanri cuts the worktree and the seat runs with it as cwd, not worktree-isolated; a seat with no first turn after two minutes is a notice; the launcher trusts a heartbeat, not a PID

Written by Sekkei `dotskills-9a [42a7cf]` (fable, high) on 2026-10-03 on the
branch `shoki-seat`, cut from `main` at the topic's opening with no batch in
flight, so this spec is not a draft and is committed at this path. The
dialogue is `.tanto/shoki-seat/dialogue.md`: the human's answers D-1 to D-5,
Sekkei's measurements M-1 to M-5, and the answers to the review brief.

**The skill this spec read.** Pinned at `b8bca1b` ("docs: shoroku for
tanto-issue-triage, review fixes"), `main`'s tip when the branch was cut.
Every site below is named by its file and heading, never by a line number;
a quoted phrase is a needle to find the site, not the text to replace.

## Fixed inputs

The input document is `.tanto/kikaku/2026-10-03-shoki-seat.md`, read whole;
its place in the order is `.tanto/kikaku/2026-10-03-topics-after-triage.md`.
Behind it: `docs/issues/open/dff9-*.md`, `fd4b-*.md`, `59a5-*.md`,
`a881-*.md`, `feac-*.md`, the kin `73d6-*.md` and `a14f-*.md`;
`docs/decisions/26fd-*.md`, `39fb-*.md`, `1c07-*.md`;
`skills/tanto/scripts/spawner.js`, `spawner.test.js`, `tanto.js`,
`boundary.js`; `roles/kanri.md` "Shusei, shoki, and the landing" and
"Create"; `templates/shoki-brief.md` and `spawn-request.md`; `SKILL.md`
Artifacts, Workspace, "The transcript reading"; the bg-seat-ergonomics
design §1.2 and §1.4; `docs/notes/claude-code-sessions-observed.md`'s
worktree entry; and
`.tanto/inbox/2026-09-25-bg-w-spawn-initial-prompt-not-delivered.md`,
dff9's source. No `spec-inputs.md`: no topic is in its spec stage.

Under the experience layer the requirement register is `docs/experience/`;
each decision names the expectation of `exp-06b2` ("a run in flight while
the user is elsewhere") it serves, or says that none does.

- **The cause, and the four points** (the decision's sections 1 and 2):
  the prompt's position, the worktree cut by Kanri, the no-first-turn
  notice, the documents. The three probes of section 1 are the human's own
  runs, relayed as the decision states them and not re-measured. Serves
  `exp-26d5` — the close's shoki asked the human for a kick that only the
  argument order made necessary — and `exp-3a9e`, for the notice.
- **The kin** (D-1): `73d6` taken, `a14f` not carried, `feac` taken in its
  roster half. `73d6` serves `exp-173f`: a launcher that cannot restart its
  spawner cannot put the run back from disk.
- **The budget** (D-2): two minutes, once, a mark in `seats.json`, a line in
  the census for Kanri. Serves `exp-3a9e`.
- **The listing's key** (D-3): without `--cwd`, filtered by the listed `cwd`
  under the root — M-1 left the server-side filter's key unmeasured for a
  seat started with a worktree as its process cwd, and the design must not
  rest on it. Serves no expectation; it is what makes section 2 hold.
- **No signal to a stale PID** (D-4, option (a)): `73d6`'s "`tanto down` can
  signal an unrelated process" is closed in full, at the price that a real
  spawner whose heartbeat went stale is left running beside the new one
  until the next `tanto down`. Serves `exp-173f`.
- **This plan's own close runs on the new spawner** (D-5): the human
  restarts it at the final boundary, and the heartbeat is the proof. Serves
  `exp-26d5` — one act, asked for in a form the human can run as it is, in
  place of a kick at every close.
- **The worktree stays** (the decision's section 2, and decision-26fd):
  the one worktree the design admits, for the scribe alone. Serves
  `exp-38e5`; nothing here builds the project twice.

## Measured while designing

The human's three probes (the decision's section 1) are taken as stated:
probe 1, a worktree cwd with the prompt after `--add-dir`, blocked with the
CLI's note `(idle — send a prompt to start)`; probe 2, the main checkout
with the prompt before `--add-dir`, ran; probe 3, a Kanri-cut worktree as
cwd with the prompt before `--add-dir`, ran, wrote into the main checkout
unrefused, and put its transcript under
`<repo slug>--claude-worktrees-probe-g`. Sekkei's own reads, 2026-10-03,
CLI 2.1.288:

- **M-1** — `claude agents --json --cwd <root>` lists a `-w` seat whose
  listed `cwd` is `<root>/.claude/worktrees/<name>` (kuchidome's
  `kuchidome-shoki-suite-hardening-53ed`); `--cwd` set to that worktree
  path itself lists nothing. Whether a seat whose process cwd is the
  worktree appears under `--cwd <root>` is unmeasured. `boundary.js census`
  already lists without `--cwd` and keeps the entries whose `cwd` is at or
  under the root (`underRoot`); section 2 gives the spawner the same key.
- **M-2** — `claude --help`: `--add-dir <directories...>` is variadic;
  `-w, --worktree [name]` takes one optional value; `rm <id>` reads "Delete
  a background session, and its worktree when that is safe. Works on
  sessions that have already exited" — so the `rm` failure 59a5 measured on
  2026-09-22 may already be gone in this build; section 5 handles it either
  way.
- **M-3** — `seats.json` holds five shoki entries, every one with `cwd` the
  main checkout at its first sighting (the `-w` move comes after it), and
  the spawner's log has `census: <sessionId> blocked` within a minute of
  every shoki spawn; the one `attention` the run raised for a shoki was
  Kanri's, four minutes after the spawn.
- **M-4** — `spawner.js`: `cmdRun` does `process.chdir(root)` and
  `runClaude` passes no `cwd`, so every child inherits the root; `findNew`,
  `findResumed`, and `runCensus` all go through `listAgents(root)`, which
  is `claude agents --json --cwd <root>`; `transcriptOf` polls
  `findTranscript` twenty times at 500 ms and the result carries the path
  but the seat does not; `censusSeat` sets `blocked` from the listing's
  `state` and toasts once per transition; `startedAt` is kept as
  `stamp()`'s minute-precision string. `shortIdOf`'s comment already knows
  the idle note as the resume's line.
- **M-5** — `tanto.js`: `livePid` is `process.kill(pid, 0)` on
  `.tanto/spawner/pid`; `startSpawner` returns false on it and `cmdDown`
  SIGTERMs it; the spawner writes `pid` once at `cmdRun` and nothing after.
  `tanto.js` has its own `listAgents(root)` with `--cwd <root>`, and
  already imports `readSeats` and `spawnerDir` from `spawner.js`.

## 1. The command line, and a prompt that was not delivered

### 1.1 The order

`spawnArgs` builds `--bg`, `--name <name>`, `--settings <json>`,
`--model <m>` and `--effort <e>` when the request names them,
`--permission-mode <mode>`, **then the prompt**, then one `--add-dir <dir>`
per `addDir` entry. The prompt sits before every variadic option, in the
form probes 2 and 3 ran; no `-w` is pushed (section 2). The options that
take one value are safe on either side of the prompt and keep their order.

### 1.2 The CLI's note is an error

`opSpawn` reads `claude --bg`'s stdout. When it contains the CLI's note
`(idle — send a prompt to start)` — the line a session started with no
prompt prints — the spawn has failed: the result is
`error: "prompt not delivered: <the stdout line>"`. The seat exists, so it
is still found (`findNew`), recorded in `seats.json` as `stopped` with
`undelivered: <the stdout line>` beside its status, and stopped by its
short id, the log saying `guard stopped <sessionId> — prompt not
delivered`; a seat `findNew` cannot find within its poll is reported in the
same error with no row, as today's "listed no new session" case is. The
check is `opSpawn`'s alone: on a `resume` the same note is the CLI's normal
line (M-4), and `opResume` is untouched. A regression of 1.1 is therefore a
result file with `error` that Kanri reads at its next act, and a `stopped`
seat — never a `blocked` row that waits for the human.

### 1.3 Tests

The argv test "a spawn's command line carries the name, the isolation
setting, and the flags the request names" expects the new order: no `-w`,
the prompt after `--permission-mode auto` and before `--add-dir <root>`.
One test is added: the fake `claude`, told through its state
(`next.idleNote`) to print the note after the spawn line, yields a result
with `error` matching `prompt not delivered`, a `stop` call in its log, and
a seat `stopped` with `undelivered`.

## 2. The worktree Kanri cuts

### 2.1 Kanri's act

In the merge act of "Shusei, shoki, and the landing", after the merge and
before the shoki `spawn` request, Kanri runs

```console
git worktree add <root>/.claude/worktrees/shoki-<topic> -b worktree-shoki-<topic> main
```

from the shared checkout, whatever branch it is on. The branch name is the
one every landing step already uses; the worktree is cut from `main`'s tip,
so shoki's `git rebase main` (its step 4) is a no-op unless `main` moved
while it wrote — and the rebase stays in the brief, because it may have.
Section 6 names the two sentences of `roles/kanri.md` this changes.

### 2.2 The spawner's cwd

The request's `worktree` field keeps its name and its value,
`shoki-<topic>`, and changes meaning: it is **the name of a directory Kanri
has cut under `<root>/.claude/worktrees/`, which the spawner makes the
child's `cwd`**. `opSpawn` resolves `<root>/.claude/worktrees/<worktree>`,
returns `error: "worktree <path> is not a directory"` without calling
`claude` when it is not one, and otherwise runs `claude --bg` with that
path as `spawnSync`'s `cwd` — `runClaude` gains an optional `cwd`, every
other caller passing none and inheriting the root as today. No `-w` is
passed for any seat. The field stays because the ad hoc-worktree guard's
exemption, the `rm` op's result, and `seats.json` key on it.

The seat is then an ordinary session whose cwd is a worktree (probe 3):
the harness's worktree isolation — the Edit refusal on a path outside the
worktree and the git-command verifier the decision's section 1 quotes —
does not apply, so the brief's writes into the main checkout (the inbox
copies' Triage, `.tanto/<topic>/shoroku-review.md`) and its `git rebase
main` need no change. The seat's `seats.json` `cwd` is the worktree path;
`underAdHocWorktree` exempts it by `seat.worktree`, as today. Its
transcript lands under the worktree's slug (probe 3), which
`findTranscript` already searches.

### 2.3 The listing's key

`listAgents` in `spawner.js` runs `claude agents --json` with no `--cwd`
and keeps the entries whose listed `cwd` is the root or under it — the
`underRoot` test `boundary.js census` already applies, written into
`spawner.js` beside its `comparablePath`. `findNew`'s `before` set, the
fresh entry it looks for, `findResumed`, and `runCensus` all read this one
function, so a worktree seat is found whichever key the CLI's own filter
uses (M-1), and a session another repository spawns in the same thirty
seconds is excluded by its cwd. `tanto.js`'s `listAgents` takes the same
filter — or imports `spawner.js`'s, from which it already imports two
functions — so that `tanto` does not write a `resume` for a live shoki it
failed to list. One `claude agents` call per pass, as today.

### 2.4 The landing

Unchanged in its steps: `claude rm` deletes the session and, having no
worktree of the CLI's own to delete, leaves Kanri's; the result's
`Removed worktree` parse stays and reads empty; Kanri's
`git worktree remove --force --force <root>/.claude/worktrees/shoki-<topic>`
and `git branch -D worktree-shoki-<topic>` stand. The CLI no longer holds
the worktree locked, which is where a881's `Permission denied` is expected
to ease; whether it does is a measurement of this plan's own landing
(Verification), not a promise of this design.

### 2.5 Tests

The fake `claude` already records the cwd it was run in (`cwdSeen`) and
lists a session with the `cwd` its state names. Three tests: a request
with `worktree` whose directory exists under the root's `.claude/worktrees/`
is spawned with that directory as `cwdSeen` and no `-w` in its argv, and
its seat's `cwd` is the worktree path; the same request with no such
directory yields `error` matching `is not a directory` and no `--bg` call;
a listing holding one session with `cwd` under the root's worktrees and one
with a cwd outside the root makes `findNew` adopt the first and never the
second.

## 3. A seat with no first turn is a notice

### 3.1 The rule

At every pass of the spawner's census, for a seat `seats.json` holds
`running` or `blocked` whose `transcript` is unset, `censusSeat` looks for
the transcript once (`findTranscript`, every project slug). Found, it
writes `seat.transcript` — the path the spawn's ten-second poll missed now
reaches the seat, and with it `boundary.js record --seat` and the roster's
Transcript column at the next boundary — and, when the seat carried a
`noFirstTurn` mark, deletes the mark and logs
`census: <sessionId> first turn`. Not found, and the seat's `startedAtMs`
at least `FIRST_TURN_WAIT_MS` (120000) before now, and no mark yet: the
seat gets `noFirstTurn: <stamp>`, one toast
`no first turn: <role> <topic> <name> — claude attach <id>`, and the log
line `census: <sessionId> no first turn after 2m`. A marked seat is not
re-judged, so the toast is raised once. The seat is **not stopped**: the
one cause this design knows is closed at the spawn by 1.2, and what reaches
this rule is a cause not yet seen, for the human to look at.

The budget is twice the longest healthy start the probes saw (about one
minute) and eight census passes; `FIRST_TURN_WAIT_MS` is a constant beside
the spawner's other intervals.

### 3.2 Two fields

`opSpawn` writes two fields it did not: `transcript`, from `transcriptOf`
(null when the poll missed it, which is the case 3.1 fills later), and
`startedAtMs`, the listing's epoch-millisecond `startedAt` as a number
beside the formatted `startedAt` the roster wants. A seat with no
`startedAtMs` — one predating this change — is never judged under 3.1, so
no old entry raises a notice. `nowMs()` reads `TANTO_NOW_MS` when set, a
test seam like `TANTO_CLAUDE_NODE`, else `Date.now()`.

### 3.3 The census line for Kanri

`boundary.js census` reads `<root>/.tanto/spawner/seats.json` when it
exists — absent, nothing changes — and appends
` — no first turn since <stamp>` to the Listed line of a seat that carries
`noFirstTurn`. The same Listed line also gains ` — blocked` when the
listing's `state` is `blocked` (section 5.2 reads it). Kanri's part is the
existing one: on a census line that says `no first turn`, write an
`attention` request whose message is
`no first turn: <role> <topic> — claude attach <id>`, since Kanri does not
see the toast and the human may have missed it. One sentence in
`roles/kanri.md`'s "Session lifecycle" census paragraph (section 6).

### 3.4 Tests

Three, with `TANTO_NOW_MS` fixed: under two minutes a seat with no
transcript gets no mark, no toast, no log line; past two minutes it gets
the mark, one toast in `TANTO_NOTICE_LOG`, one log line, and a second pass
adds neither; a transcript file written under any project slug clears the
mark, fills `seat.transcript`, and logs `first turn`. One `boundary.test.js`
case: a `seats.json` beside the roster with a marked seat makes `census`
print the suffix on that seat's Listed line.

## 4. The launcher trusts a heartbeat, not a PID

### 4.1 The spawner beats

The spawner writes `.tanto/spawner/heartbeat` — the epoch milliseconds as
text, through a temp file and rename — at the start of its first `pass`,
before and after every request `takeRequests` handles, and at every
`runCensus`. The longest stretch it blocks without one is one spawn's
listing poll plus its transcript poll, about forty seconds (M-4's
`sleepSync` note), so a beat older than `HEARTBEAT_STALE_MS` (60000) means
the process behind `pid` is not this spawner, or is a spawner that has
stopped working.

### 4.2 The launcher reads it

`tanto.js`'s `livePid` becomes `liveSpawner(root)`: the PID in
`.tanto/spawner/pid` answers `process.kill(pid, 0)` **and** the heartbeat
file exists and is within `HEARTBEAT_STALE_MS` of now. A missing heartbeat
— a spawner on the code before this change — reads as stale.
`startSpawner` on a stale heartbeat with a live PID writes
`stale spawner pid <n> ignored` to `.tanto/spawner/log` and starts a new
spawner; **it sends no signal** to the recorded PID (D-4, option (a)):
73d6's "`tanto down` can signal an unrelated process" is closed in full,
and the one cost — a real spawner whose heartbeat went stale is left
running beside the new one, both taking requests by rename, so none is
handled twice — ends at the next `tanto down`, which stops the one that
beats. `cmdDown` on a stale heartbeat removes `pid` and `heartbeat`, prints
`no spawner running`, and sends nothing; on a fresh one it SIGTERMs as
today and removes both files after. `startSpawner`'s wait after launching
waits for `liveSpawner`, which the new process satisfies at its first
`pass`.

### 4.3 Tests

In `tanto.test.js`: a `pid` file holding the test's own PID and no
heartbeat makes `tanto` start a spawner and log the stale line; the same
PID with a heartbeat of now makes it start none; `down` with a stale
heartbeat removes the two files, prints `no spawner running`, and the
test's own process is still alive. In `spawner.test.js`: `run --once`
leaves a heartbeat whose value is within the test's clock.

## 5. Two landing points

### 5.1 `rm` and `stop` on a session that has exited

When `claude rm` or `claude stop` fails and its stderr contains
`No job matching`, the CLI has already dropped the session: the op is not
an error. The seat goes `removed` (for `rm`) or `stopped` (for `stop`), the
result carries `removed`/`stopped` as on success and `note: "already
exited"`, and the log says `rm <name> ok (already exited)`. For every other
failure the error text is the stderr, **or the stdout when the stderr is
empty** — 37ec's item 4 measured a `claude rm` refusal printed on stdout
that reached Kanri as `claude rm:` and nothing more. The rest of 37ec's
item 4 (what Kanri does when `rm` keeps a worktree) is moot for shoki once
the worktree is Kanri's, and is not taken here.

### 5.2 The roster's `live (blocked since <HH:MM>)`

No eighth status word. The annotation-on-`live` convention `idle since`
already uses is written down for `blocked`: Kanri appends
`(blocked since <HH:MM>)` to a `live` cell when the census's Listed line
for that seat carries ` — blocked` (3.3), and removes it when a later
census does not; the intake's address rule and every other reader test the
cell's first word, as they do for `idle since`. The cell names no cause,
because the census sees none: a permission prompt, a usage-limit pause, and
a seat idling on a kessai all read `blocked`, and telling them apart is
feac's other half, deferred.

### 5.3 Tests

One each in `spawner.test.js`: the fake's `stop`/`rm` failing with
`No job matching <id>` yields a success result with the note and the seat
`removed`/`stopped`; a failure with empty stderr and a stdout line yields
an error carrying that line.

## 6. File by file

Every site by file and heading; the plan writes the passages.

- `skills/tanto/scripts/spawner.js` — `spawnArgs` (1.1); `opSpawn` (1.2,
  2.2, 3.2); `runClaude`'s optional `cwd` and `listAgents` with `underRoot`
  (2.2, 2.3); `censusSeat` and the two constants (3.1, 3.2); the heartbeat
  in `cmdRun`'s passes and `takeRequests` (4.1); `handleRequest`'s `stop`
  and `rm` branches (5.1); `shortIdOf`'s comment, which now names the
  spawn's lost-prompt case beside the resume's; the `NO_BG_ISOLATION` and
  `spawnArgs` comments, which say "a worktree seat's real branch is the
  CLI's own" — now Kanri's `worktree-shoki-<topic>`.
- `skills/tanto/scripts/spawner.test.js` — the argv test's expected list;
  the tests of 1.3, 2.5, 3.4, 4.3, 5.3.
- `skills/tanto/scripts/tanto.js` — `liveSpawner`, `startSpawner`,
  `cmdDown` (4.2); `listAgents` (2.3).
- `skills/tanto/scripts/tanto.test.js` — the tests of 4.3.
- `skills/tanto/scripts/boundary.js` — `cmdCensus` reads `seats.json` and
  prints the two suffixes (3.3); `boundary.test.js` — its case.
- `skills/tanto/SKILL.md` — Artifacts, the row
  `<root>/.claude/worktrees/shoki-<topic>`: writer "the CLI, on
  `claude --bg -w`" becomes "Kanri, by `git worktree add` in the merge act";
  Workspace: "works in the CLI's own worktree under" becomes "works in the
  worktree Kanri cuts at"; "The transcript reading": one sentence after the
  path formula — a session whose cwd is a worktree under the repository
  writes its transcript under the slug `<repo slug>--claude-worktrees-<name>`,
  the harness's encoding of that cwd, and `findTranscript` searches every
  slug; "Handshake and roster", the Status words: `live` "may carry the
  suffix `(idle since <HH:MM>)`" gains "or `(blocked since <HH:MM>)`" with
  5.2's one sentence; the `scripts/spawner.js` paragraph: the notice list
  gains "on a seat with no first turn two minutes after its spawn", and
  "keeps `seats.json`" gains "and a heartbeat"; the `scripts/tanto.js`
  sentence: "starts the spawner" becomes "starts the spawner when none
  beats".
- `skills/tanto/templates/spawn-request.md` — the `worktree` bullet: "The
  spawner passes it as `-w`, and the worktree is the CLI's own, under
  `.claude/worktrees/`" becomes 2.2's meaning — a directory Kanri has cut,
  the spawner's `cwd`, never `-w`, an error when absent; the `prompt`
  bullet gains the position and its reason (`--add-dir` is variadic; a
  prompt after it is a directory); the result paragraph gains `note:
  "already exited"` on `stop` and `rm`, and the `spawn` error
  `prompt not delivered` with the seat's `undelivered` and `stopped`.
- `skills/tanto/templates/shoki-brief.md` — the Worktree argument: "the
  CLI's own, at …, cut in the same act as Kanri's merge; your `git rebase
  main` (step 4) is what makes it carry this topic's product, whatever HEAD
  the CLI cut it from" becomes "cut by Kanri from `main`'s tip in the same
  act as its merge, at `<root>/.claude/worktrees/shoki-<topic>`; your
  `git rebase main` (step 4) picks up anything `main` gained while you
  wrote". Nothing else of the brief changes: its writes into the main
  checkout were right and are now unrefused.
- `skills/tanto/templates/roster.md` — the Status paragraph: the `live`
  suffix sentence gains `(blocked since <HH:MM>)` (5.2).
- `skills/tanto/roles/kanri.md` — "Shusei, shoki, and the landing": the
  merge act gains the `git worktree add` line before the `spawn` request,
  and "Whatever HEAD the CLI cuts that worktree from, shoki's own
  `git rebase main` is what lands the product's fixes before the records"
  becomes the worktree being cut from `main`'s tip, the rebase kept for
  what `main` gains meanwhile; "remove the worktree `claude rm` leaves
  locked" becomes "remove the worktree you cut"; "Create", the merge row:
  "one `spawn` for shoki, in the same act as the merge and never before it"
  gains "after `git worktree add`"; "Session lifecycle", the census
  paragraph: 3.3's sentence on `no first turn` and 5.2's on the `blocked`
  annotation.
- `skills/tanto/README.md` — the paragraph on `tanto` and `tanto down`:
  one sentence, the launcher starts a spawner when none has beaten within
  a minute, and `tanto down` signals only one that has.

Not changed: `templates/boundary-brief.md`, `templates/batch-prompt.md`,
`templates/kanri-handover.md` (the three run-time templates), the six
other role files, `reading.js`, `passage-check.js`.

## 7. Rule 11, and this plan

This plan edits the skill's scripts, `SKILL.md`, `roles/kanri.md`, and
templates, so rule 11 governs it: its Jissos are all spawned at the landing
with `queue=shoki-seat`, reading nothing until their `batch:` line; the
authority while it is in flight is its Global Constraints, Kanri's orders
line, and the batch prompts; the safe boundary, from which a role may be
started or replaced, is the final batch's — or the fix wave's landing when
the whole-branch review's findings touch `SKILL.md`, a role file, or a
template. None of the three run-time templates changes.

Two facts of this plan's own run, which its Global Constraints state:

- **The resident spawner keeps the code it started with**, and this plan's
  own close is the first that needs the new code: on the old spawner its
  shoki blocks again at its start, and worse — Kanri, on the landed text,
  cuts `shoki-shoki-seat` and the old spawner then passes
  `-w shoki-shoki-seat` over an existing directory. So, after the final
  batch (the fix wave included) is accepted and **before the kessai**,
  Kanri's line asks the human to run `tanto down` then `tanto` in a
  terminal — the seats keep running, Kanri included; only the spawner
  restarts, and `tanto` finds the live Kanri and prints its attach line —
  and Kanri, before it writes the shoki `spawn` request, checks that
  `.tanto/spawner/heartbeat` exists and is within sixty seconds of now: the
  file only the new code writes is the proof that the restart happened. A
  heartbeat absent or stale holds the merge act and is one line to the
  human, asking for the two commands again.
- **This plan's close runs on the landed text.** Kanri re-reads
  `roles/kanri.md`'s "Shusei, shoki, and the landing" from disk before the
  merge act, as the bg-seat-ergonomics plan had its Kanri re-read the close
  sections; the Kanri in seat read the section as it stood before batch A.

## Old values this plan contradicts

Needles, each with its file and heading; the plan measures each at zero
over the files it touches.

- `scripts/spawner.js`, `spawnArgs`: `args.push("-w", request.worktree)` and
  `args.push(request.prompt)` as the last push — the prompt precedes
  `--add-dir`, and nothing pushes `-w` (1.1, 2.2).
- `scripts/spawner.js`, `shortIdOf`'s comment: "the same line with
  ` (idle — send a prompt to start)` after it on a resume" — also on a
  spawn whose prompt was lost, which 1.2 treats as an error.
- `scripts/spawner.js`, `spawnArgs`'s comment and `NO_BG_ISOLATION`'s: "a
  worktree seat's real branch is the CLI's own" — it is Kanri's
  `worktree-shoki-<topic>` (2.1).
- `scripts/spawner.test.js`: the expected argv list carrying `"-w",
  "shoki-t"` and `SPAWN.prompt` last (1.3).
- `scripts/tanto.js`, `livePid`: `process.kill(pid, 0)` as the whole test
  (4.2).
- `templates/spawn-request.md`, the `worktree` bullet: "The spawner passes
  it as `-w`, and the worktree is the CLI's own, under `.claude/worktrees/`"
  (2.2).
- `templates/shoki-brief.md`, the Worktree argument: "the CLI's own" and
  "whatever HEAD the CLI cut it from" (2.1).
- `SKILL.md`, Artifacts, the worktree row: "the CLI, on `claude --bg -w`"
  (2.1).
- `SKILL.md`, Workspace: "works in the CLI's own worktree under" (2.1).
- `roles/kanri.md`, "Shusei, shoki, and the landing": "Whatever HEAD the CLI
  cuts that worktree from" and "the worktree `claude rm` leaves locked"
  (2.1, 2.4).
- `SKILL.md`, "Handshake and roster": "`live`, which may carry the suffix
  `(idle since <HH:MM>)`" as the only suffix (5.2).

## Requirements

Under the experience layer the requirement register is `docs/experience/`,
and this section names the expectations. This design serves `exp-26d5`,
`exp-3a9e`, `exp-173f`, and `exp-38e5` of `exp-06b2`, each named in Fixed
inputs; it adds none and edits none. One candidate stands for the close's
recommender, to be grouped `Unsure` and put to the human: *a seat the run
starts must start on its own, with no act of the human's between the
request and the seat's first turn* — the decision's own words, "the shoki
start block … should be fixed soon", are its source; it is close to
`exp-26d5`'s "ask him only for what only he can do", and the recommender
proposes whether it is a sharpening of that line or a line of its own.

## The ADRs

Written by the close's apply under `docs/decisions/`.

1. **A `--bg` spawn's prompt precedes every variadic option, and the CLI's
   idle note on a spawn is a failed delivery.** The prompt before
   `--add-dir`; `(idle — send a prompt to start)` in `claude --bg`'s stdout
   is `error: prompt not delivered`, the seat stopped and recorded
   (section 1). Rejected: re-sending the `brief:` line by `SendMessage`
   after a `blocked` sighting — the cause is an argument order, not a
   delivery, and whether a message reaches a session that never ran a turn
   is unmeasured (the decision's section 4); a headless shoki — not listed,
   not attachable, a redesign where a reorder suffices. Amends none.
2. **Shoki's worktree is Kanri's cut, and the seat is not
   worktree-isolated.** `git worktree add … -b worktree-shoki-<topic> main`
   in the merge act; the spawner runs `claude --bg` with that directory as
   the child's cwd and passes no `-w`; the request's `worktree` field stays
   as a name (section 2). Rejected: keeping `-w` and fixing the order alone
   — the isolation guard refuses the brief's writes into the main checkout,
   so every close's Triage fill and review file fail as 2026-10-03's did;
   sanctioning a shell write around the Edit guard — a brief telling a seat
   to bypass a harness rule; `EnterWorktree` with `path` after an ordinary
   spawn — viable, but worktree-isolated by construction, so the brief's
   writes would move to Kanri; recorded as **the fallback** if a later CLI
   isolates a session on detecting that its cwd is a worktree, together
   with moving the inbox Triage fill to Kanri, which rides with it. Amends
   decision-26fd in one part: the one worktree the design admits is cut by
   Kanri, not by the CLI on `claude --bg -w`; the rest of 26fd stands —
   shoki after the merge, in a worktree, reporting `shoroku ready:`, Kanri
   fast-forwarding. The bg-seat-ergonomics design's §1.2 setting stands
   unchanged: `--settings '{"worktree":{"bgIsolation":"none"}}'` on every
   spawn, shoki's included.
3. **A seat with no first turn two minutes after its spawn is a notice.**
   The spawner's census, a seat `running` or `blocked` with no transcript
   under any slug, `FIRST_TURN_WAIT_MS` 120000, once, a mark in
   `seats.json`, a line in the census for Kanri; the seat not stopped
   (section 3). Rejected: a budget on the close's wait for shoki's report —
   the close is the one unattended stretch and has no clock; the human's
   observation as the detector — the record of eight spawns says what that
   costs. Amends decision-1c07 in one part: the spawner's census raises a
   toast on a third signal, the no-first-turn mark, beside `blocked` and an
   `attention` request; the rest of 1c07 stands.
4. **The launcher trusts a heartbeat, not a PID.** `.tanto/spawner/heartbeat`
   written at every pass; `liveSpawner` is PID alive and heartbeat within
   sixty seconds; a stale heartbeat is ignored and logged, never signalled
   (section 4). Rejected: a random token re-affirmed each pass — a timestamp
   carries recency as well as identity, and recency is what `startSpawner`
   needs; signalling the stale PID before starting — the exact act 73d6
   files, against an unrelated process. Amends none.

## What the plan must contain

- Tasks cut by file, in two batches: **A** the three scripts and their
  tests (`spawner.js`, `tanto.js`, `boundary.js`, each with its `.test.js`),
  `node --test` green at every task; **B** the documents of section 6
  (`SKILL.md`, the two templates, `templates/roster.md`, `roles/kanri.md`,
  `README.md`). Batch B is the safe boundary. Sections 1 to 5 each name
  their tests; a task lands its code and its tests together.
- The Global Constraints carry rule 11's authority sentence, the queue, the
  safe boundary, and the two facts of section 7 — the spawner restart asked
  for before the kessai and checked by the heartbeat, and the re-read of
  the landing section.
- The Old values list above, measured at zero over the touched files at
  every boundary; the needles of `-w` and `the CLI's own` grepped across
  `skills/tanto/` as a whole, since the sites of section 6 are the ones the
  Sekkei found and a passage the plan did not name may hold another.
- No task touches `templates/boundary-brief.md`, `templates/batch-prompt.md`,
  or `templates/kanri-handover.md`.

## Verification

- `node --test skills/tanto/scripts/` green, the new tests of sections 1 to
  5 among them, at every boundary.
- The Old values at zero over the touched files.
- `./scripts/lint.sh` on the changed paths.
- **At this plan's own landing**, Kanri records four measurements in the
  ledger's Measurements table, for the dogfood report the close's shoroku
  writes: whether shoki ran its first turn with no act of the human's;
  whether its transcript appeared under `<repo slug>--claude-worktrees-shoki-shoki-seat`;
  whether its Triage fills and `shoroku-review.md` write were unrefused —
  the landing check "every swept inbox copy's Triage filled" passing is the
  evidence; and whether `git worktree remove --force --force` returned
  without `Permission denied` (a881). The restart's heartbeat check is a
  fifth, implicit: the spawn request was written only after it held.

## Out of scope

- `a14f` (a second Kanri spawned beside a live one, twice): the request's
  writer is unidentified, and finding it is an investigation, not a design;
  the issue stays open with its two data points (D-1).
- `feac`'s other half: telling a usage-limit block from a permission
  prompt from a kessai wait. The census sees one word, and this design adds
  only the one cause it can know (5.2).
- 37ec's item 4 beyond its first half, and the rest of the two bundles
  `fb90` and `37ec`, which this design touches at one item each.
- The ad hoc-worktree guard, `bgIsolation`, the queue at a skill-editing
  plan's landing, and the resume rule of decision-39fb — all unchanged.
- A `tanto restart` command: the two commands the human already has do it,
  once, for this plan; a later plan may fold them.

## Issues this design closes

Each term the design retires was grepped once across `docs/issues/open/`:
"add-dir" (dff9 alone), "-w " (dff9), "initial prompt" (dff9, fb90, feac),
"first turn" (40ed, cca9, db0c, dff9, fb90, fd4b — the first three on the
reading's wake-ups, not a seat's start), "slug" (05ee, a23a, dff9, f9b3 —
only dff9 on a transcript's), "pid" and "heartbeat" and "livePid" (73d6),
"No job matching" (13ab, 59a5 — 13ab's is a prose item), "claude rm" (126e,
37ec, 59a5, a881), "Permission denied" (a881), "blocked" (eighteen issues,
read for the two carried: feac, and a14f's use of the word).

- **dff9** — closes: the cause is 1.1, the detection 1.2, the slug finding
  6's `SKILL.md` sentence. Its resolution note names the argument order as
  the cause and the "delivery race" as a hypothesis the probes retired.
- **fd4b** — closes: the "startup dialog" of its title did not exist (the
  decision's section 1); its detection half is section 3.
- **59a5** — closes by 5.1, with M-2 noted in its resolution: the CLI's
  `rm` help now says it works on exited sessions.
- **a881** — closes when the landing's fourth measurement passes; stays
  open with that measurement when it does not. The dogfood report carries
  the result either way.
- **feac** — closes for its roster half by 5.2; its cause-distinction half
  is re-filed by the close's recommender as a narrower issue if the human
  wants it kept (Deferred items).
- **73d6** — closes by section 4.
- **fb90** item 5 and **37ec** item 4 (first half) are answered here; the
  bundles stay open for their other items, and the close's apply notes the
  two items as resolved in their text.

## Answers to the spec inputs

No `spec-inputs.md` exists and no `I-n` reached this seat. Sections 2.1,
2.4, 3.3, and 5.2 rewrite Kanri's own procedure — the merge act, the
landing's worktree removal, the census line, the roster annotation — and
there is no one to relay to; the passages are what Kanri reads at its next
start, and this plan's own Kanri re-reads the landing section from disk
(section 7).

## Deferred items

- `feac`'s cause distinction (Out of scope).
- `a14f` (Out of scope).
- The `EnterWorktree` fallback of ADR 2, with its trigger: a CLI that
  isolates a session on detecting a worktree cwd.
- 37ec item 4's second half: what Kanri does when `claude rm` keeps a
  worktree of the CLI's — no seat of the run has one after this design.

## Shoroku proposal from this spec work

This section excludes the spec's own sections above, the spec review, and
the dialogue, which the close's recommender reads for itself.

1. Measured (M-1): `claude agents --json --cwd <root>` lists a `-w`
   seat under the root while its listed `cwd` is the worktree path, and
   `--cwd <that worktree path>` lists nothing — the filter keys on
   something other than the listed `cwd`; which, is unmeasured.
   Destination: notes (`claude-code-sessions-observed.md`).
2. Measured (M-2): CLI 2.1.288's `rm <id>` help says "Works on sessions
   that have already exited" — the data point against 59a5's 2026-09-22
   failure. Destination: notes.
3. Observation: `boundary.js census` already keyed the listing on the
   listed `cwd` under the root (`underRoot`), while `spawner.js` and
   `tanto.js` kept `--cwd <root>`; three readers of one listing with two
   keys. Destination: design (design-4807, the spawner's section).
4. Observation on the process: this Sekkei window started on opus and was
   stopped by the model check, because the project `.claude/tanto.json`
   had set `sessions.sekkei = fable/high` on 2026-09-24 while the Kanri's
   ask named no family; the ask could carry `/model <family>` read from
   the merged config at that moment. Destination: issues.
5. Measured (M-4): `seats.json`'s `startedAt` is a minute-precision string,
   so any rule that measures a seat's age needs the epoch value beside it —
   section 3.2's `startedAtMs`. Destination: notes.
