# Design: tanto-context-ceiling — a token reading, a ceiling derived from it and gated on the human's presence, and the exit proposal written unasked

Sekkei `dotskills-c3 [61616e]` (resumed mid-dialogue as
`dotskills-46 [5d01aa]`), 2026-09-14. Written from the spec inputs I-1 and
I-2 (`.tanto/tanto-context-ceiling/spec-inputs.md`, relayed from the Kikaku
decision `.tanto/kikaku/2026-09-14-tanto-small-items-and-next-topic.md`,
items 4 and 5), from the spec dialogue Q1 to Q8 and the design presentation
(`.tanto/tanto-context-ceiling/dialogue.md`), and from the T0 shoroku
committed before this Sekkei existed (`docs: T0 shoroku for
tanto-context-ceiling`: the issue-40ed data point, the
`docs/notes/claude-code-sessions-observed.md` section on the `usage` sum
and the auto-compact default, and req-04f5's ceiling bullet). Kanri's
rulings R-1 to R-6 in `.tanto/tanto-context-ceiling/kanri.md` fix the scope
this spec starts from.

The problem in one paragraph. The skill's only cost signal is the transcript
reading — bytes, records, wake-ups, compactions — and its only lifecycle
signals for a grown session are the plan close, the human's word, and a
compaction the session notices. On a 1M-window model a compaction fires
near 967k tokens, so the previous Kanri grew to 950k over one plan without
any signal firing, and the Account & Usage view attributed 74% of a day's
usage to contexts over 150k. The transcript carries a better instrument:
every `assistant` record's `usage` object sums to that turn's context in
tokens. The design below adds that figure to the reading, derives a ceiling
from it — a measured baseline plus a chosen number of batches of measured
consumption — and fires Kanri's handover or Jisso's replacement at the next
boundary once the ceiling is crossed, but only when the human is there to
create the successor; when the human is absent the run continues to the
plan close, which already hands over, and the harness's own
`autoCompactWindow` is the net beneath it. The 150k figure is the human's
operating ceiling and a cost bucket, not a documented quality threshold
(I-1), and the spec says so wherever it names it. Riding with it, because
it is cost-driven and touches the same report lines: a Sekkei or Keikaku
writes its exit proposal unasked at its final boundary, so the seat is not
left waiting across the one-hour cache TTL for an `exit:` line whose only
remaining act is the exit (I-2, issue-19d4).

What lands, at a glance:

- a second executable, `scripts/reading.js`, Node with no dependencies and
  tests beside it, which prints the reading — now five figures, the fifth
  `context=<n>` from the `usage` sum — and, on request, the ceiling line,
  the presence line, the backstop line, and the >150k share; the shell
  pipeline in `SKILL.md` becomes one call to it;
- a `ceiling` map in `tanto.json`: batches and per-batch tokens for Kanri
  and for Jisso, the presence window, and the share threshold, with
  built-in defaults overlaid field by field like the two maps that exist;
- a fourth handover signal for Kanri — the ceiling crossed — checked at
  every boundary with the reading, and fired only when the human's last
  turn in Kanri's own window is within the presence window; otherwise
  recorded as deferred and re-checked at each boundary, with the plan
  close handing over as it already does; the compaction signal gated the
  same way;
- Jisso replaced at the next boundary on the same terms, by the Replace
  procedure that exists; every other role measures and sends the fifth
  figure and is not replaced on it;
- the `autoCompactWindow` read and reported in Kanri's start line against
  the ceiling, with a recommended value, and nothing set by the skill;
- the >150k usage share as the operational metric — the transcript proxy
  computed at the plan close, the Account & Usage figure asked of the
  human, a target of 30% or less — and the per-batch consumption of Kanri
  and Jisso measured at every boundary of this plan's own run and written
  into its dogfood report;
- the exit proposal written unasked by Sekkei and Keikaku, named in their
  final report lines, with Kanri dispatching the recommender at once and
  sending no `exit:` to those two roles.

## Fixed inputs

These are settled. Nothing below re-argues them; the plan inherits them
whole. Each names the dialogue question that settled it and the
requirement bullet of req-04f5 it serves, or says that none does.

1. **The ceiling is a derived value, baseline plus N batches of measured
   consumption, and crossing it fires Kanri's handover at the next
   boundary — when the human is there** (Q1, the human's own protocol in
   place of A, B, and C; Q2, A). The human's words: "kanri の前に human
   がいる（と推測される）ときは B で handover させて、いない（と推測される）
   ときは、plan close まで継続させるようなプロトコルはないかな". A handover
   the human is not there to complete stalls the run, since the successor
   sends the next batch prompt; a plan close stalls on the human anyway.
   Serves "Kanri is resident, but its context cost does not grow with its
   tenure" and "A seat stays under an operating context ceiling the run
   chooses".
2. **Presence is read from Kanri's own transcript**: the last wake-up
   record whose `origin.kind` is `human`, present when its timestamp is
   within the presence window of now, 60 minutes by default (Q2, A over B
   explicit words and C their combination). Measured 2026-09-14 while
   composing Q2: every wake-up record carries `timestamp` and `origin`,
   with `origin.kind` one of `human`, `peer` (with the sender's `name`),
   and `task-notification`. Serves "A session's cost is measured, not
   guessed".
3. **No hard ceiling in the protocol; `autoCompactWindow` is the backstop**
   (Q3, B over A no backstop and C a protocol hard ceiling that stalls the
   run when absent). The human sets it; the skill reads it and reports at
   Kanri's start whether it sits above the ceiling. Serves no bullet
   directly; "A seat stays under an operating context ceiling" says the
   ceiling's derivation is a recorded decision, and this is part of it.
4. **Kanri and Jisso are the ceiling's subjects; Sekkei, Keikaku, Kaiseki,
   Kikaku, and Hosa measure only** (Q4, B over A Kanri alone and C every
   role). Jisso is the one peer that runs a whole plan of batches; the
   others end with their document or their report. Serves "A session's
   cost is measured, not guessed" for the measuring roles and the residency
   bullet for Kanri.
5. **I-2 rides in this topic** (Q5, A over B waiting for `tanto-sweep-2`):
   a Sekkei or Keikaku writes its exit proposal as the last act of its
   final boundary and names it in the same report line; Kanri sends no
   `exit:` to those two roles. Serves "A run is affordable to keep
   running".
6. **The operational metric is the share of usage at contexts over 150k,
   with a target of 30% or less** (Q6, A over B no target yet and C
   another value): the transcript proxy computed by `reading.js` over the
   run's transcripts at the plan close, and the Account & Usage figure the
   human reads, both in the dogfood report and the ledger's Measurements
   table. Serves "A session's cost is measured, not guessed".
7. **The role-file diet is deferred**: an issue at T1, named as a candidate
   for `tanto-sweep-2` (Q7, A over B `kanri.md` alone here and C a topic
   of its own before sweep-2). Serves no bullet.
8. **The instrument is a new script, `scripts/reading.js`** (Q8, B over A
   more shell in `SKILL.md` and C a `reading` subcommand of
   `passage-check.js`): Node, no dependencies, tests beside it run by
   `node --test`, and the `SKILL.md` pipeline replaced by one call. Serves
   no bullet; it serves the plan's verification.
9. **150k is the human's chosen operating ceiling, not Anthropic's view**
   (I-1, and the T0 correction on issue-40ed). No Anthropic document names
   150k as a quality threshold; the closest describes recall degrading
   with context as a gradient, not a cliff. Every place this spec or the
   skill names 150k says which it is. Serves "A seat stays under an
   operating context ceiling the run chooses".
10. **The ceiling's defaults come from the 2026-09-14 measurement** (I-1):
    a seat's first turn is 72 to 83k, Kanri's per-batch consumption is
    roughly 60 to 70k, so N = 2 gives about 200 to 220k and N = 1 about
    150k. The plan's dogfood measures both figures again and the defaults
    are corrected from it (section 5). Serves "A session's cost is
    measured, not guessed".

## 1. The instrument: `scripts/reading.js`

### 1.1 The command and its lines

```bash
node "$TANTO/scripts/reading.js" <transcript> [--role kanri|jisso] [--presence] [--backstop]
node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...] [--config <path>]
```

`$TANTO` is the skill's own directory, set in the same tool call as the
command, exactly as `passage-check.js` is invoked; the file carries no
shebang and `node` is part of the command. The first form prints two lines
always and up to three more on request, each on its own line, in this
order:

```text
transcript: <b> B, <r> records, <w> wake-ups, <c> compactions, context=<n>
effort=<level|unknown>
ceiling: <role> baseline=<b0> + <N> x <per-batch> = <ceiling> — context=<n> <under|over>
human: last=<ISO timestamp|none> <m> min ago — <present|absent> (window <P> min)
backstop: autoCompactWindow=<n|default 967000> (<env|settings|default>) — <above|below> ceiling <ceiling>
```

The first line is the reading, and it travels as the reading travels today:
appended after ` — ` to every boundary and exit line, and into the report
templates' Transcript slot. The second is the effort, read as today, and
not part of the reading. The third, fourth, and fifth are the lines the
sections below assign to Kanri and Jisso; a role that was not told to
print them does not.

Three switches beyond the role: `--now <ISO>` fixes the clock for the
presence line, `--config <path>` names the personal `tanto.json` in place
of `$CLAUDE_CONFIG_DIR/tanto.json` or `~/.claude/tanto.json`, and
`--settings <path>` names the settings file the backstop reads in place of
`$CLAUDE_CONFIG_DIR/settings.json` or `~/.claude/settings.json`. All three
exist for the tests and for a Kanri verifying a peer's reading; the role
files never pass them. The `--share` form takes `--config` for the
threshold and ignores `--now` and `--settings`.

### 1.2 The five figures

The four existing figures keep their definitions from `SKILL.md`'s "The
transcript reading", now computed by parsing each line as JSON rather than
by substring:

- **bytes** and **records**: the file's size and its line count;
- **wake-ups**: the records of `type` `user` whose `message.content` is
  not an array containing a `tool_result` block — one per human message,
  peer message, idle notice, or subagent completion;
- **compactions**: the wake-ups whose text — `message.content` when it is a
  string, or the first `text` block's text when it is an array — begins
  with the harness's phrase `This session is being continued from a
  previous conversation`. The phrase is the harness's and may change; a
  reworded one reads as `0`, and a compaction the session notices for
  itself is still the signal it always was.

A line that does not parse as JSON is counted in records and nowhere else,
so a truncated last line while the harness is mid-write does not fail the
reading.

The fifth figure, **context**, is the last `assistant` record's
`message.usage`, summing `input_tokens`, `cache_creation_input_tokens`, and
`cache_read_input_tokens`, each taken as `0` when absent; `context=0` when
no `assistant` record carries a `usage` object. It is that turn's whole
prompt in tokens, cached part included — the figure the harness's
`tokens left` reminder was rejected for not being (issue-40ed) — and it is
the first of the five that is a token count. The four older figures stay
because the archive's rows across runs are in them, and because bytes and
records are the shape of the file where context is the shape of the
prompt; nothing reads the bytes as a threshold from here on.

**effort** is the last `assistant` record's `perTurnEffort` when it is a
string, else its `effort` when that is a string, else `unknown` — the same
rule as today, now on the parsed record rather than a regex.

### 1.3 The ceiling line

`--role <role>` prints the ceiling line. The **baseline** `<b0>` is the
first `assistant` record's `usage` sum in the same transcript — the
session's fixed load at its first turn, which the 2026-09-14 measurement
put at 72 to 83k — and it is measured, not configured, so a change in the
harness's system prompt or the skill's own size moves it without anyone
editing a number. `<N>` and `<per-batch>` are `ceiling.<role>.batches` and
`ceiling.<role>.per_batch` from the merged `tanto.json` (section 2). The
ceiling is `b0 + N x per_batch`, and the verdict is `over` when the
reading's context is greater than or equal to it, `under` otherwise.

A resumed session keeps its transcript and so its baseline. A compacted
session's context drops below its baseline for a turn or two; the verdict
is `under` then, which is right — the compaction is its own signal, and
section 3.5 says how the two combine.

### 1.4 The presence line

`--presence` prints the human line, and it is meaningful only on Kanri's
own transcript, where the human's turns are the human's turns in Kanri's
window. The record is the last wake-up whose `origin.kind` is `human`;
`<m>` is the whole minutes between its `timestamp` and now (`--now` or
the clock); the verdict is `present` when `m` is less than or equal to
`ceiling.presence_minutes`, `absent` otherwise, and `absent` with
`last=none` when no such record exists. A record whose `origin` is absent
— the older harness, measured before 2026-09-14 — is not a human turn for
this line; the presence line then reads `absent`, and Kanri's rule in 3.1
treats `absent` as "defer", which is the conservative side for a run and
the same as today's behavior.

Why the last human turn in Kanri's window and not any other trace: it is
the one signal that says the human was *at this run*, and it is in a file
Kanri already reads. A `/tanto fukki`, a ruling, an "OK" — each is a
human turn. The window's default is 60 minutes, the prompt-cache TTL: a
handover written to a human who has been away longer than that pays a
cold read on the successor's first wake-up in any case, and a human away
that long is, for this rule's purpose, absent.

### 1.5 The backstop line

`--backstop` prints the backstop line and requires `--role`. The value is
`CLAUDE_CODE_AUTO_COMPACT_WINDOW` when the environment carries it,
otherwise `autoCompactWindow` from the settings file when present,
otherwise `default 967000` — the documented auto-compact point for the
1M-window models (`docs/notes/claude-code-sessions-observed.md`, and
`code.claude.com/docs/en/model-config.md`). The source is named in
parentheses. The verdict compares it with the ceiling of 1.3: `above` when
it is strictly greater, `below` otherwise. A window `below` the ceiling
means compaction would fire before the handover, and Kanri's start line
(2.2) says what to do about it.

The script sets nothing: `/autocompact`, the flag, and the variable are the
human's, and "composes without modifying" covers the harness's own setting
as it covers the skills.

### 1.6 The share line

The second form, `--share`, takes one or more transcripts and prints:

```text
share: <pct>% of usage at context > <threshold> over <k> transcripts (<over> / <total> tokens)
```

For every `assistant` record with a `usage` object across the transcripts
named, `total` is the sum of the record's context (the three fields), and
`over` is that sum restricted to the records whose context exceeds
`ceiling.share_threshold`, 150000 by default; `pct` is `over / total`,
rounded to a whole number, `0%` when `total` is zero. This is the
transcript proxy for the Account & Usage view's "N% of your usage was at
>150k context": the same shape — usage weighted by context, so an idle
seat counts nothing and a wake-up of a large context counts its whole
size — over the transcripts the roster names, which is the run's sessions
and not the account's. The two figures are compared, not equated; the
Account & Usage figure includes every other workspace's sessions and the
subagents, which have transcripts of their own that no roster names.

### 1.7 Unavailable, errors, and exit codes

A transcript path that does not exist or cannot be read prints
`transcript: unavailable — <one line why>` as the first line, `effort=unknown`
as the second, and no ceiling, presence, or backstop line; exit code 0,
because the reading's unavailable form is a value the roles send, not a
failure. A missing ceiling line is no signal — Kanri treats it as `under`
and records `unavailable` where the verdict would go; a missing presence
line reads as `absent`, the conservative side, as 1.4 says for a record
with no `origin`; and the Ceiling slot of a batch report carries
`unavailable` when Jisso's script printed no ceiling line. A session on
which `node` itself will not run sends the same `unavailable` form with
the reason, as `SKILL.md` already provides for a transcript that is not
where it says; the four-figure shell pipeline is not kept as a fallback,
because two instruments that can disagree are worse than one that says
it could not read. In the `--share` form a path that cannot be read is
skipped and the `<k> transcripts` figure counts only the ones read, with
the skipped paths named after it in parentheses. A missing or unparsable `tanto.json` at the config path is the
all-defaults case, as for the two maps that exist; a personal file whose
`ceiling` map carries a key that names no role and no field is ignored
and named on `stderr` as `unknown key ceiling.<name>, ignored`, which the
start line reports. A usage error — no transcript and no `--share`,
`--backstop` without `--role`, a `--role` value that is not `kanri` or
`jisso`, an unknown switch — prints the usage line and exits 2. Nothing else exits non-zero: `over`, `absent`, and `below`
are words the roles read, and a script that failed on them would make the
roles' next step a guess about why.

### 1.8 Tests

`scripts/reading.test.js`, beside the script, run by `node --test` on the
pinned Node like `passage-check.test.js`, and structured like it: fixtures
are synthetic `.jsonl` files written to a temporary directory the test
removes at teardown. The cases, one `test` each:

1. the four older figures on a fixture with tool results, peer messages,
   and one compaction record — the compaction counted once, a tool-output
   line that contains the phrase not counted;
2. `context=` as the sum of the three fields of the last `assistant`
   record, with one field absent;
3. `effort=` from `perTurnEffort` over `effort`, `null` falling through,
   neither giving `unknown`;
4. the ceiling line with a fixture baseline and both verdicts, `--config`
   naming a personal file that overrides `batches` and keeps the default
   `per_batch`;
5. the presence line with `--now`, `present` inside the window, `absent`
   outside it, `absent` with `last=none` when no `origin.kind: human`
   record exists, and a `peer` record after the human's not counted;
6. the backstop line from the environment, from `--settings`, and from
   neither, with both verdicts;
7. the share line over two fixtures, with the threshold from `--config`;
8. the unavailable form and exit 0 on a missing path; exit 2 on
   `--backstop` without `--role` and on `--role sekkei`;
9. a fixture whose last line is a half-written record: counted in records,
   the reading otherwise intact;
10. `context=0` on a fixture with no `assistant` record carrying `usage`;
11. a `--config` file that is missing, and one that is not JSON: the
    all-defaults case, the ceiling line computed from the template's
    values;
12. a `--config` file with `ceiling.sekkei` and `ceiling.kanri.window`:
    both ignored, each named on `stderr` as
    `unknown key ceiling.<name>, ignored`, the ceiling line unchanged;
13. `--share` over one readable fixture and one missing path: the readable
    one counted, `1 transcripts`, the missing path named.

The tests are the specification of the figures; the prose above is what
the roles read. The fixtures are synthetic so that no real transcript —
a file that carries the human's words — is committed.

## 2. `tanto.json`: the `ceiling` map

### 2.1 The shape

`templates/tanto.json` gains a third top-level map beside `sessions` and
`subagents`:

```json
"ceiling": {
  "kanri": { "batches": 2, "per_batch": 65000 },
  "jisso": { "batches": 2, "per_batch": 65000 },
  "presence_minutes": 60,
  "share_threshold": 150000
}
```

The personal file overlays it field by field, as the other two maps: a
personal `{"ceiling": {"kanri": {"batches": 1}}}` sets Kanri's N to 1 and
keeps every other value. The map is **effective** in the sense
`subagents` is: `reading.js` reads it, and the verdicts the roles act on
come from it. The values are the human's operating choice, and
`SKILL.md`'s config section says so in the sentence that names 150k: a
ceiling at that value is the human's, not a documented threshold.

Why per role and why two roles: Kanri's and Jisso's per-batch consumption
differ — Kanri reads reports by section and verifies a tree; Jisso runs
the SDD loop and dispatches the implementers — and only those two are the
ceiling's subjects (fixed input 4). Jisso's `per_batch` default is Kanri's
measured figure for want of a Jisso measurement; the plan's dogfood
supplies one (section 5.2), and the default is corrected from it at T2. A
`ceiling.<role>` for any other role is an unknown key.

Why `per_batch` is configured and the baseline is not: the baseline is in
the transcript at every turn; the per-batch figure is a property of the
run's shape — batch size, report length, the plan's verification list —
and the one number the human tunes. Reducing consumption lowers the
ceiling at the same N, which is I-1's direction: the ceiling is derived,
so that the diet and the raw-output levers (issue-2e52) pay off in the
same instrument without anyone moving a threshold.

### 2.2 The start line

Every role's start line already says which config file it read and which
keys came from the defaults; the `ceiling` map's fields join that report
on the same terms, in every role, because the config report is the start
sequence's in `SKILL.md` and no role file restates it — so no role file
changes for this, and an unknown key under the map is reported as
`unknown key ceiling.<name>, ignored`.

Kanri's start line — step 1 of `roles/kanri.md`'s Start — gains the
backstop: Kanri runs `reading.js` on its own transcript with
`--role kanri --backstop` and quotes the backstop line. When the verdict is
`below`, one further line to the human, in the chat's language, saying
that auto-compact would fire before the handover and recommending
`/autocompact <value>` with the value `ceiling + 2 x per_batch`, rounded
up to the nearest 50k — about 350k at the defaults. A recommendation, not
a lifecycle request: the human sets the window or does not, and the
roster records nothing about it. The line is printed once, at start;
nothing re-checks the window mid-run, because the human can change it in
any window at any time and the skill would not see it.

## 3. The ceiling rule

### 3.1 Kanri: the fourth signal and the presence gate

`roles/kanri.md`'s "The trigger" gains a fourth signal:

4. **The ceiling crossed.** At every check — loop step 6 at a boundary,
   and the start of every turn while no batch is in flight, a topic's spec
   or plan stage included — take your own reading with `--role kanri`; a
   verdict of `over` is this signal.

The sentence "A topic in its spec or plan stage neither fires the check nor
blocks it" is narrowed to signals 1 and 3: signal 4 is checked in that
stage too, at the start of every turn, because Kanri's context grows there
— a T0 shoroku, a bug-report triage, the handshakes, a resume — with no
batch boundary to catch it (I-3, gap A). A handover in that stage is safe
on the Timing section's own terms: nothing is in flight, and a Sekkei or
Keikaku whose line went unanswered re-sends it to the successor's
address.

And a gate on signals 3 and 4, in the same section:

> Signals 3 and 4 fire a handover only when the human is present. Run
> `reading.js` on your own transcript with `--presence` at the check where
> the signal fired: `present` means the handover runs at this check — by
> the in-plan procedure at a boundary, and as between plans when no batch
> is in flight; `absent` means it is **deferred** — record it as 3.2 says,
> continue (the next batch prompt at a boundary, the turn's own work
> otherwise), and re-check at every later check, where a `present` verdict
> runs the handover then. The plan
> close (signal 1) hands over regardless, as decision-b6cb made it; the
> human's word (signal 2) is presence itself.

The reason is fixed input 1: a handover is complete only when the human
creates the successor, and the successor sends the next batch prompt; a
handover written to an empty room stops the run for as long as the room is
empty, while the batches could have run. Idle costs nothing, but a stalled
run costs the time the human was away. The cost of continuing is what the
ceiling measures — per-wake-up context — and the backstop (section 4)
bounds it.

The check is on Kanri's own reading, and the reading is taken where it is
taken today; what changes is that the line Kanri prints and writes into its
Residency row carries `context=`, and that the row's verdict is a rule
rather than a data point waiting for an ADR. The residency line's two
forms are unchanged in shape; the reading inside them is the five-figure
one.

### 3.2 The deferred state

A deferred handover is written in three places, so a successor or a cold
reader sees it:

- the ledger's Progress line gains the clause
  `handover deferred (absent, context=<n>, since <batch X | the spec stage | the plan stage>)`,
  kept until the handover runs or the plan closes;
- a roster Events line,
  `<date> — handover deferred at <batch X | the spec stage | the plan stage>: ceiling <c> crossed at context=<n>, human absent (last turn <m> min ago)`;
  and at the check where it finally runs, the ordinary
  `handover written by` line, whose Events entry names where the deferral
  began;
- the next batch prompt's "Previous batch verdict" section carries one
  line, `Kanri's handover is deferred since <batch X | the spec stage | the plan stage> — the ceiling is crossed and the human
  is absent; this batch runs under the same Kanri`, so that the prompt file
  the human may paste says what the run's state is. A deferred Jisso
  replacement (3.3) gets the same line in the same section,
  `Your replacement is deferred since batch <X> — your ceiling is crossed and the human is absent; run this batch and report as usual`,
  because Jisso is the seat that reads the prompt and the one whose report
  showed the crossing.

A deferral counts nothing in the Residency row's Noticed column — that
column is compactions the session noticed, and a crossed ceiling is not
one — but the ledger's Measurements table gains a row for it (5.3). When
the human returns and speaks in Kanri's window, the next boundary's check
finds `present` and the handover runs; the human's "continue" at that
boundary declines it as the Handover section already describes, and the
decline ends the deferral for this plan rather than continuing it — the
human can still call the handover at any check by word (signal 2), and
signal 1 (the plan close) hands over regardless.

### 3.3 Jisso: replacement at the boundary

Jisso runs `reading.js` with `--role jisso` when it writes its batch report,
and `templates/batch-report.md`'s header gains one slot under the
Transcript line:

```text
- Ceiling — <the ceiling line>
```

At loop step 6 Kanri reads that line with the report's other header lines.
A verdict of `over` is a Replace symptom, and the Replace table gains a
row:

| Symptom | Action |
| --- | --- |
| Jisso's ceiling line says `over` | run `--presence` on your own transcript; `present` — at this boundary, run "Exit shoroku" and ask the human to delete and create, the next prompt saying `resume batch X from task N` as for any replacement; `absent` — defer, write the ledger's Progress clause `Jisso replacement deferred (absent, context=<n>, since batch <X>)` and an Events line of the same shape as Kanri's, and re-check at the next boundary. Never at the final batch's boundary: Jisso exits after T2 in any case |

The existing row "Jisso has carried the batches the plan expects of one
session" stays; the ceiling row is the measured form of the same idea, and
a plan that names a batch count still binds. A Jisso replaced on the
ceiling hands over as any replaced Jisso does — the SDD ledger and the
batch reports are the recovery point — and the new Jisso's baseline is its
own first turn, so a replacement resets the ceiling the way a Kanri
handover does.

Kanri may verify a Jisso reading it doubts by running `reading.js` on the
path the roster's Transcript column holds, when that path is one its
session may read — the Readings rule as it stands, with the script in
place of the pipeline; a read that is denied or fails leaves the
self-report standing, marked `(unverified)`. It never asks Jisso to read a
transcript for it.

### 3.4 The roles that only measure

Sekkei, Keikaku, Kaiseki, and Hosa run `reading.js` with no `--role` and
send the five-figure reading where they send the reading today: the
boundary reply (Hosa's `committed <subject> — <reading>` included), the
report lines, the exit line, the Kaiseki report's Transcript slot. Kikaku
sends no reading today and gains no site: its Residency row's reading
columns stay blank, as they are, since it is the human's seat and its
cost is the human's own pacing. The Residency rows gain the context column
(section 7.6) and nothing acts on it: Sekkei and Keikaku end with their
document, Kaiseki with its report, Kikaku and Hosa are the human's and are
`/clear`ed. The Replace table's compaction rows for these roles stand as
they are. The rows across runs are the dataset issue-40ed's replacement
half asked for, now in tokens; whether a ceiling for these roles is
wanted is a question for that data, and this spec closes 40ed's Kanri and
Jisso halves and leaves the rest as a note on the issue's resolution
(section "Issues this design closes").

### 3.5 The compaction signal under the gate

Signal 3, a compaction noticed, keeps its meaning — the harness's own
statement that the session grew past the window — and gains the presence
gate of 3.1, which is what fixed input 3 implies: with no hard ceiling,
the compaction is the backstop while the human is absent, and a Kanri
that compacted while the human was away continues to the plan close on
its summary, with `SKILL.md`'s compaction rule applying as today — Kanri's
own case is its handover file, and the human's words are in the ledger
and the dialogue files, not in the summary. A compaction the human is
present for hands over at that boundary as it does now. The Noticed column
counts it either way.

This gate on signal 3 amends decision-6dea for **Kanri only**, and it is
a point the brief puts to the human, because the dialogue did not: 6dea
made a compaction a replacement condition on the ground that "a summary
standing in place of the conversation is itself the loss, and its size
cannot be known from inside". The alternative is to leave signal 3
ungated: a Kanri that compacts while the human is away writes its
handover file from the ledger and the roster — not from the summary —
and stops, and the run stalls until the human returns, paying no more
context and running on no summary. The spec recommends the gate, on the
same ground as Q1: idle costs nothing but a stalled run costs the time the
human was away, and state lives in files. The peers' compaction rows in
the Replace table are not gated in either case: a peer's replacement
falls at its next commit or report, which is human-paced already.

After a compaction the reading's `context=` is small and the ceiling
verdict is `under`; the compactions figure is `1` and the Noticed column
carries it, so the two signals do not double-fire: signal 3 is the
compaction, signal 4 is the growth before it, and one handover answers
both when it runs.

## 4. The backstop

The `autoCompactWindow` is the last net, sitting above the ceiling so that
the handover fires first when the human is present, and compaction fires
when the human is absent and the run has grown past the window. The
skill's part is 1.5 and 2.2: read, compare, recommend once. The
recommended value, `ceiling + 2 x per_batch`, leaves two batches between
the ceiling and the compaction — room for one deferral and the boundary
after it — and is stated in the start line in tokens so the human can
paste it into `/autocompact`.

Rejected in the dialogue (Q3): a protocol hard ceiling above the soft one,
at which Kanri hands over regardless of presence and the run stalls. It
would keep the state in the handover file rather than in a compaction
summary, and it would bound cost with no dependence on a harness setting;
the human preferred the harness's own net to a second protocol state,
and this spec records the alternative for the day the data says the
compaction summary lost something a handover file would have kept.

## 5. The operational metric and the dogfood

### 5.1 The share

At every plan close, Kanri runs `reading.js --share` over the transcripts
**of this topic**: the sessions the ledger's Session events name — every
handshake accepted for this topic (Sekkei, Keikaku, Jisso, Kaiseki), and
every Kanri whose tenure overlapped the topic's life, the current one and
any predecessor the Events' handover lines name — each transcript path
taken from its roster or archive row. A refused handshake has no row and
no transcript, and is not in the list; rows of another plan that a shared
roster still holds, and Kikaku's and Hosa's, whose Topic is `—`, are not
of this topic and are left out (I-3, gap B). The run happens **before**
the close's archive move, while every row still carries its Transcript
column — the Delete table's plan-close row is reordered to say so — and
over the paths Kanri's session may read: a path that is denied,
`unavailable`, or on another host is skipped and named, as 1.7 says, so
that the Readings rule stands — a peer's transcript is read by Kanri
only where it may, and never by asking the peer. Kanri records the share
line in the ledger's Measurements table (5.3), with the list of names it
ran over and the ones skipped. The target is **30% or less**, the
human's, from the Kikaku consultation, against 74% on 2026-09-14 (and 89%
on 2026-09-09, on issue-40ed). Kanri asks the human one line at the same
close, in the chat's language, for the Account & Usage view's own figure
for the day, and records it beside the proxy; the human answers or does
not, and a blank is a blank. The close is already a checkpoint at which
the human is asked (the merge decision), the figure is one only the human
can read, and silence is an answer, so the line is not a new
interruption; "Requirements" says so in the checkpoint bullet.

The share is an indicator of cost, not of quality (I-1): it measures how
often a large context is woken. The levers are the ceiling (the largest),
wake-up hygiene (issue-d725 removed the exit subscriptions), the role-file
diet (deferred, fixed input 7), and the raw-output levers of issue-2e52,
in that order of effect; the share is how their effect is seen.

### 5.2 The dogfood report

The plan's dogfood task writes `docs/reports/<date>-tanto-context-ceiling-dogfood.md`
per `docs/reports/AGENTS.md`, and it is the first run whose Kanri and Jisso
take the five-figure reading at every boundary. The report **must** carry,
as fixed sections:

1. **Per-batch consumption**: a table with one row per batch boundary of
   the run — batch letter, Kanri's `context=` at that boundary, Jisso's
   `context=` from its report, and the delta of each from the previous
   boundary — with the first row the two baselines, and, before batch A's
   row, two rows for Kanri alone: its context at the topic's opening and
   at the plan's landing, so that the spec-and-plan-stage growth (I-3,
   gap A) is a measured figure and not a gap in the table. A boundary that
   follows a seat change — a Kanri handover, a Jisso replacement — records
   the successor's baseline in place of a delta, and the mean is taken
   over same-seat deltas only. The last line of the section states the
   mean delta per role over the batch rows, which is the measured
   `per_batch` for each, and the spec-and-plan-stage growth as its own
   figure.
2. **The ceiling as it ran**: the ceiling each of the two computed at its
   first check, every boundary's verdict, every presence verdict taken,
   every deferral and the boundary at which the handover or replacement
   ran or the close arrived.
3. **The share**: the proxy at the close, the Account & Usage figure if the
   human gave one, and the two side by side against 74%.
4. **The backstop line** Kanri's start printed, and whether the human
   changed the window.
5. **What the harness listed**: whether the sessions started during the
   run saw the twelve agent definitions, as the measurement discipline of
   issue-f2ec requires of every dogfood.

Section 1's mean deltas are a T2 shoroku candidate: `templates/tanto.json`'s
`per_batch` defaults are corrected to the measured figures, rounded to the
nearest 5k, in a commit by explicit path, and the recommendation names it.
A plan that runs under this skill and whose dogfood omits section 1 has
not run the dogfood.

### 5.3 The Measurements table

`templates/kanri.md`'s Measurements table gains three fixed rows after the
four that exist:

| What | When | Value |
| --- | --- | --- |
| Kanri's context at the topic's opening and at the plan's landing, then Kanri's and Jisso's at each boundary, with the delta per batch | `<YYYY-MM-DD, each check>` | `<opening: kanri context=<n>; landing: kanri context=<n> (+<d>); batch letter: kanri context=<n> (+<d>), jisso context=<n> (+<d>)>`, one entry per check |
| deferrals: where, the role, the context, and the presence verdict | `<YYYY-MM-DD, the check>` | `<batch letter or stage, kanri or jisso, context=<n>, last human turn <m> min ago>`, one entry per deferral, or `none` |
| the share of usage at context over the threshold, proxy and Account & Usage | `<YYYY-MM-DD, the plan close>` | `<the share line, the names it ran over, and the human's figure or blank>` |

The template's paragraph under the table names the three rows and says
which step fills each: the first at the topic's opening (Start step 5),
at the plan's landing, and at loop step 6 from the two readings; the
second at any deferral, in whichever stage; the third at the close from
`--share`. The rows are fixed and always present, so that a plan whose
Kanri never deferred still shows `none`.

## 6. The exit proposal written unasked (I-2)

### 6.1 Sekkei

`roles/sekkei.md`'s "Your tenure ends here" paragraph changes: when the
human's answers are in `dialogue.md` and the edits they asked for are
committed (or in the draft), Sekkei writes its exit proposal to
`.tanto/<topic>/exit-sekkei-proposal.md` — the delta, opening with the
exclusion line, as its exit rule already describes — runs the resume
self-check, and sends Kanri one line:

```text
spec accepted: <spec path>; exit proposal: <path> — <reading>
```

Then it idles. The "Your exit shoroku" bullet under the commit rule is
rewritten to say that the proposal is written unasked at that boundary and
named in that line, that Kanri sends no `exit:`, and that a second,
incremental proposal (6.4) is the answer when more work arrives after it.

### 6.2 Keikaku

`roles/keikaku.md`'s Handoff section changes: Kanri's cold-read questions
arrive as one message, numbered, or as the line `coldread: none`. Keikaku
answers by editing the plan or the spec, as today, and sends **one** line
back carrying every pointer and the exit clause:

```text
coldread answered: <pointer, one per question, or none>; exit proposal: <path> — <reading>
```

The proposal is `.tanto/<topic>/exit-keikaku-proposal.md`, written after
the edits and before the line, with the same delta rule. The
`plan committed:` line itself is unchanged — the cold read has not run
when it is sent, and the human may still not want the plan — and the
"or earlier, when the human does not want the plan now" case keeps
Kanri's `exit:` line, because there the trigger is Kanri's ruling and not
a boundary Keikaku can see. The "Your exit shoroku" bullet is rewritten
accordingly.

This carrier line is a departure from I-2's literal text, which put the
clause on `plan committed:` "once the cold read is answered" — two
moments that are one line apart in the words and a dispatch apart in the
run — and it changes the cold read's message shape from one line per
question to one numbered message, because Keikaku cannot otherwise know
which per-question line is the last. The brief puts it to the human as a
choice. The alternative: the clause rides on `plan committed:` itself,
before the cold read, and every cold-read edit is answered with an
incremental `exit-keikaku-2` proposal (6.4); the cold read's per-question
lines stay as they are. That is closer to the input's words and touches
one site fewer; it costs a second proposal and a second recommender run
whenever the cold read finds anything, which it usually does.

### 6.3 Kanri

`roles/kanri.md` changes in four places:

- "When the plan lands", step 1: the cold read's questions go to Keikaku as
  one numbered message, or `coldread: none`; Kanri waits for the
  `coldread answered:` line, checks each pointer against the tree as it
  checks a pointer today, and takes the exit proposal's path from the same
  line.
- "Exit shoroku", step 1: for Sekkei and Keikaku **at their own final
  boundary** the proposal arrives named in their report line and no
  `exit:` is sent; step 2's form check and the recommender dispatch follow
  at once. For every other exit — Jisso, an attached Kaiseki, Kanri's own,
  and a Sekkei or Keikaku exited away from its final boundary (a
  compaction in its reading, decision-6dea; a replacement from the Replace
  table; the human not wanting the plan now) — step 1 stands as written
  and the `exit:` line is sent, so both role files keep the line for that
  case.
- The batch loop, step 6: "send the `exit:` lines" becomes "send the
  `exit:` lines to the sessions whose proposal is not already named".
- The Delete table's Sekkei row: "the spec review is accepted, the human's
  answers are in `dialogue.md`, and the `spec accepted:` line named the
  exit proposal"; the Keikaku row: "the `coldread answered:` line named
  the exit proposal, or the human does not want the plan now and the
  `exit:` line was answered".
- "The five cases" and the Handover's "Live peers": a Sekkei or Keikaku
  whose last line named an exit proposal is waiting for nothing but its
  deletion, and a successor Kanri's first act for it is the recommender
  dispatch if the recommendation is not on disk.

`SKILL.md`'s "Session exit" paragraph on the lines gains the two forms:
the `exit:` line for Jisso, Kaiseki, and Kanri; the report line carrying
`; exit proposal: <path>` for Sekkei and Keikaku, with the sentence that
the timing moves and nothing else does — the proposal is written in either
flow, the recommender runs once, the human's check is on the
recommendation, and the seat idles through one recommender run and no
longer through the gap to an `exit:` whose only remaining act is the
exit. The 1-hour cache TTL and the cold-read cost it implies are the
reason, in one sentence, citing issue-19d4.

### 6.4 The incremental proposal

A Sekkei or Keikaku that has named its exit proposal and is then given more
work — a cold-read question that changes the spec, a review answer that
changes the plan — writes a second proposal at `exit-<role>-2-proposal.md`
holding only the delta since the first, and names it in the line that
reports the work: `...; exit proposal: <path-2> — <reading>`. Kanri
dispatches the recommender over the second file as over the first; the
stage word is `exit-<role>-2`, the pattern the tanto-cost run already used.
No proposal is rewritten after it is named, because the recommender may
already have read it.

## 7. The files, and what changes in each

### 7.1 `skills/tanto/SKILL.md`

- "The transcript reading": the pipeline block is replaced by the
  `reading.js` invocation of 1.1, the four bullets become five with
  `context` defined as 1.2 says, the effort bullet points at the script,
  and the sentence "the figures are compared with each other across
  sessions, never with a token count" is corrected: bytes and records are
  compared across sessions; `context` **is** a token count and is compared
  with the ceiling. The compaction bullet's "a plain grep for the phrase
  over-counts" becomes a note on why the script parses the record.
- "The expected-model config": the `ceiling` map described as 2.1, its
  overlay rule, its unknown-key report, and the sentence on 150k as the
  human's ceiling.
- "Session exit": the two line forms of 6.3.
- "Artifacts": the executables paragraph names two scripts —
  `passage-check.js` with its seven subcommands, and `reading.js` with
  its two forms and six switches — and the `$TANTO` sentence covers both;
  the table gains no row, since the script writes no file.
- The frontmatter is unchanged: the `description` gains no `: ` and the
  `argument-hint` gains no word.

### 7.2 `skills/tanto/roles/kanri.md`

- Start, step 1: the backstop line and its recommendation (2.2).
- "The trigger": the fourth signal, the presence gate, and the paragraph
  after the list rewritten — "not a threshold on the reading, because the
  plan close arrives first in practice and no number was needed" becomes
  the ceiling of 1.3 and the reason it is derived; the sentence sending
  issue-40ed's other half to a future ADR becomes a pointer at this
  spec's ADR; and the sentence "A topic in its spec or plan stage neither
  fires the check nor blocks it" is narrowed to signals 1 and 3, with
  signal 4 checked at the start of every turn in that stage (3.1).
- Start, step 5, and "When the plan lands", step 2: Kanri takes its own
  reading at the topic's opening and at the plan's landing and writes the
  Measurements row of 5.3.
- "Timing": unchanged in its rule; one sentence that a deferred handover
  is not a due one and does not stop the loop.
- "The residency line": the reading inside it is the five-figure one; no
  change in shape.
- The batch loop, step 6: the ceiling check and the presence check named,
  the Measurements rows of 5.3 filled, Jisso's ceiling line read with the
  report's header.
- "Replace": the Jisso ceiling row of 3.3.
- "Delete": the Sekkei and Keikaku rows of 6.3; the plan-close row gains
  the `--share` run and the one-line question to the human (5.1), placed
  **before** the archive move in the row's order, since the move drops the
  Transcript paths the run reads.
- "When the plan lands" and "Exit shoroku": 6.3.
- "Readings": `reading.js` in place of "the same pipeline", and the
  verification of a peer's reading by running it on the roster's path.

### 7.3 `skills/tanto/roles/jisso.md`

The batch report step names `reading.js --role jisso` and the Ceiling
slot; the exit rule is unchanged (Jisso keeps the `exit:` line). Nothing
else.

### 7.4 `skills/tanto/roles/sekkei.md` and `roles/keikaku.md`

6.1 and 6.2. The `reading` each sends is the script's first line.

### 7.5 `skills/tanto/roles/kaiseki.md`, `roles/kikaku.md`, `roles/hosa.md`

The reading pointer, where each names "The transcript reading", now names
the script; no rule changes.

### 7.6 The templates

- `templates/tanto.json`: the `ceiling` map (2.1).
- `templates/batch-report.md`: the Ceiling slot (3.3).
- `templates/roster.md` and `templates/roster-archive.md`: a `Context`
  column after `Compactions` in the Residency and Sessions tables, holding
  the reading's `context=` figure; the paragraph under each names it by
  that spelling, `context=`, which is what the Verification grep counts;
  the archive's paragraph on dropped columns lists Transcript among them,
  since it is dropped today and the sentence does not say so.
- `templates/kanri.md`: the three Measurements rows (5.3) and the Progress
  line's deferred clause named in the section's guidance.
- `templates/kanri-handover.md`: the Residency section's table — the
  roster's row copied verbatim — gains the same `Context` column, and In
  flight carries the deferred clause when one stands, so that the
  successor knows the ceiling was crossed and why the handover waited.
- `templates/batch-prompt.md`: the one-line deferral notice in the
  previous-batch-verdict section, when a deferral stands (3.2).

### 7.7 `skills/tanto/scripts/reading.js` and `reading.test.js`

New, per section 1. `passage-check.js` is untouched.

### 7.8 `skills/tanto/README.md`

The Layout section lists the second script and its tests; the Usage
section's sentence on the reading names five figures and the ceiling in
one line; the Prerequisites bullet on Node — "Only a plan that carries
passages needs it ... everything else in the skill is Markdown" — is
rewritten, because every role now runs `reading.js` at every boundary,
and a session without `node` sends the `unavailable` form (1.7). After
the `SKILL.md` edits, the README is reviewed for drift, as the
repository's rule requires.

### 7.9 `docs/notes/tanto-consistency-checks.md`

One check added: the reading's five-figure form appears in exactly the
places that carry a reading — a grep of `context=` across `skills/tanto`
against the list of lines and slots this spec names. Three structural
sites amended, as the note's own rule for a plan that adds a script
requires: the "twenty-four skill files, thirteen of them templates"
bullet and check 1's path list and expected count become twenty-six
files, with `scripts/reading.js` and `scripts/reading.test.js` listed;
check 2's expected `ok` count becomes twenty-four. Both counts are
confirmed by running the commands, per check 2's own warning
(issue-9d84), not copied from here. And one check amended: the
executables sentence in `SKILL.md` names both scripts and the Layout in
the README agrees.

## 8. The boundary, the batch cut, and rule 11

The files that change: `SKILL.md`; five role files (`kanri.md`,
`jisso.md`, `sekkei.md`, `keikaku.md`, `kaiseki.md` — `kikaku.md` and
`hosa.md` carry no reading pointer and are untouched); seven templates
(`tanto.json`, `batch-report.md`, `roster.md`, `roster-archive.md`,
`kanri.md`, `kanri-handover.md`, `batch-prompt.md`); the README; and two
new scripts. `passage-check.js`, its test, and the six other templates do
not change. A session started mid-plan reads whatever is on disk
(rule 11). The
plan names in Global Constraints and in Batches the authority sentence —
the run's sessions follow the constraints, Kanri's orders line, and the
batch prompts, not the role text on disk — and the boundary from which a
role may be started or replaced. Because `SKILL.md`'s reading section, the
role files' pointers, the templates' slots, and the script must agree,
that boundary is the final one, and the plan says so; Kanri's handover
proceeds when due and its successor takes the authority ruling from the
handover file.

The run's own Kanri and Jisso read today's skill: they take the four-figure
reading, and the ceiling rule does not bind them — the plan's Global
Constraints say so, and the dogfood task measures the five figures by
running the new script on their transcripts at every boundary from the
batch that lands it, which is how section 5.2's table is filled for a run
that predates its own instrument.

The batch cut the plan is expected to make, in this order, three or four
tasks each; the plan decides the exact cut and the review checks that no
cut leaves the tree inconsistent at its boundary beyond what rule 11
covers:

- **A — the script and its tests**: `reading.js` and `reading.test.js`
  whole, TDD, with the `ceiling` map in `templates/tanto.json` as the
  config they read. The tree is consistent at this boundary: nothing else
  names the script yet.
- **B — the reading and the config in `SKILL.md`**: "The transcript
  reading", the config section, "Artifacts"; the templates' reading slots
  and columns (7.6, except the deferred clause and the notice).
- **C — the ceiling rule in `roles/kanri.md` and `roles/jisso.md`**: the
  trigger, the gate, the deferred state, the Replace row, the loop's step
  6, the Measurements rows, the handover file and the batch prompt
  additions.
- **D — the exit proposal unasked**: `SKILL.md`'s "Session exit",
  `roles/sekkei.md`, `roles/keikaku.md`, the Kanri sites of 6.3.
- **E — the sweep, the README, the consistency note, and the dogfood**:
  the pointers in the three remaining role files, the README's drift
  review, 7.9, and the dogfood report with its five sections — the
  measurement of the run itself, so it runs last.

## Old values this plan contradicts

One per entity the plan changes; the plan's `O` blocks are written from
this list, each needle spanning the point where the text changes, each run
as it is written.

1. **Four figures.** `SKILL.md`'s "The **reading** is four figures" (a
   sentence that wraps across two lines in the file, so its `O` block
   spans the wrap and no single-line grep sees it), "**Effort** is not one
   of the four figures", the pipeline block, "the figures are compared
   with each other across sessions, never with a token count";
   `templates/roster.md`'s "`unavailable` stands in the four figures"; the
   README's reading sentence and its Prerequisites bullet "Only a plan
   that carries passages needs it"; `roles/kanri.md`'s "Readings" ("the
   same pipeline").
2. **Three signals.** `roles/kanri.md`'s "Three signals fire a handover",
   "not a threshold on the reading, because the plan close arrives first
   in practice and no number was needed", and "the data a threshold for
   **replacing a peer** will be chosen from, by an ADR, once enough
   sessions have ended"; `templates/roster.md`'s sentence of the same
   content under Residency.
3. **One executable.** `SKILL.md`'s "The skill also ships one executable";
   the README's Layout.
4. **Two maps.** `SKILL.md`'s "Two maps, two mechanisms" and every
   sentence that enumerates `sessions` and `subagents` as the whole file.
5. **The `exit:` line for every role.** `SKILL.md`'s "Kanri sends
   `exit: propose your shoroku; write it to <path>`; the session writes
   the proposal"; `roles/sekkei.md`'s "Kanri answers with `exit:`" and its
   "Your exit shoroku" bullet's "Before the human deletes you, Kanri
   sends"; `roles/keikaku.md`'s "Kanri sends
   `exit: propose your shoroku; write it to <path>` at the plan's landing,
   once the cold read is answered" (wrapped across three lines in the
   file); `roles/kanri.md`'s "Exit shoroku" step 1, the Delete table's
   Sekkei and Keikaku rows, and loop step 6's "send the `exit:` lines".
6. **The cold read answered one line per question.** `roles/kanri.md`'s
   "send Keikaku one line per question, and wait for its pointer";
   `roles/keikaku.md`'s "sends you its questions, one line each".
7. **Four Measurements rows.** `templates/kanri.md`'s "These four rows are
   fixed and always present".
8. **The Transcript slot alone.** `templates/batch-report.md`'s header,
   which ends at `- Transcript — <reading>`.

## Requirements

Settled with the human in the dialogue; T1 copies these texts, and nothing
here is reworded at T1.

**req-04f5, the ceiling bullet** — the bullet T0 added is amended, its
last sentence kept:

> - **A seat stays under an operating context ceiling the run chooses.** No
>   session is allowed to grow without a bound the run has set for it, so
>   that both what the human pays per wake-up and what the model can still
>   attend to stay inside known limits rather than being discovered after
>   the fact. The bound is measured in the unit the harness bills — tokens
>   of context per turn — and the run's response to crossing it is timed
>   to the human, since the seat's replacement is the human's act. What the
>   ceiling is, and how it is arrived at, is a recorded decision, not a
>   requirement.

**req-04f5, the cost bullet** — "A session's cost is measured, not guessed"
gains one sentence:

> The reading includes the turn's context in tokens, so a cost figure and a
> ceiling share one instrument.

**req-04f5, the affordability bullet** — "A run is affordable to keep
running" gains one sentence:

> A seat whose remaining act is its own exit does not wait for a line that
> asks for it.

**req-04f5, the checkpoint bullet** — "The human is interrupted only at
defined checkpoints" gains one clause in its list of what the human is
asked beyond the checkpoints:

> ... and give, at a plan close, a figure only the human's own account
> view shows, answerable with silence.

## The ADRs

Decided in the dialogue; written at T1 with the requirements. The human
decides at the review whether the second is an ADR or design.

1. **The handover and the replacement fire on a derived context ceiling,
   gated on the human's presence, with the harness's auto-compact window
   as the backstop** — amends decision-de63 (the two signals become
   four; "not a batch or plan count" stands, and the reading's token figure
   is the instrument 40ed asked for), decision-b6cb (the plan close
   stays the ordinary trigger, and a ceiling crossing hands over at an
   earlier boundary only when the human is present), decision-6dea for
   Kanri only (its noticed compaction is gated on presence; the peers'
   rows stand — or not, as the human answers the brief, 3.5), and
   decision-9a3a in one part (`tanto.json` carries three maps, the third
   effective like `subagents`; the overlay, the defaults in the skill,
   and the personal file outside stand). T1 puts the `amended_by`
   bookkeeping on all four. Options: a fixed
   150k; a derived ceiling with a handover regardless of presence; the
   derived ceiling gated on presence (chosen); a protocol hard ceiling
   above it (rejected, Q3). Consequences: the ceiling moves when
   consumption moves; a deferral is a recorded state; the compaction
   summary is the state a Kanri runs on while the human is away; the
   `autoCompactWindow` is the human's to set and the skill's to report.
2. **A Sekkei or Keikaku writes its exit proposal unasked at its final
   boundary** — amends decision-d831 (every planned exit carries its own
   shoroku, and Kanri opens it) and decision-ce83 (the four-step flow
   whose step 1 is the `exit:` line) for those two roles only; the exit
   still carries its shoroku and the flow still has four steps, and only
   who opens it changes.
   Options: the `exit:` line for every role; the proposal in the final
   report line for the roles whose final boundary they can see (chosen);
   a proposal before the human's check with the write-out by another role
   (the human's first thought in the consultation, subsumed — the four-step
   flow already does the write-out elsewhere). Consequences: the seat
   idles through one recommender run and no gap; a second, incremental
   proposal answers late work.

## What the plan must contain

- Global Constraints: the repo's `AGENTS.md` rules; the concrete families
  and efforts for the run's own dispatches; the authority sentence and the
  replacement boundary (section 8); the statement that the run's own Kanri
  and Jisso take the four-figure reading and are not bound by the ceiling
  rule until the plan lands, and that the dogfood task measures the five
  figures on their transcripts from the batch that lands the script.
- A Batches section as section 8 sketches, each batch with its stop
  conditions, and the boundary at which a role may be started or replaced
  named as the final one.
- How a batch is verified: lint on the changed paths by name;
  `node --test skills/tanto/scripts/reading.test.js` and
  `node --test skills/tanto/scripts/passage-check.test.js` on the pinned
  Node; a JSON parse of `templates/tanto.json` asserting the three maps,
  the two ceiling roles, and the four fields; the greps of "Verification"
  below; `node "$TANTO/scripts/passage-check.js" diff` as the boundary
  check; and, from batch A on, the script run on Kanri's own transcript as
  Kanri's first measurement of the instrument.
- Passages in the block grammar for every file that changes in part, `W`
  blocks with `created:` declarations for the two new files, and the `O`
  blocks of "Old values" — written before the passages, one per entity,
  each needle spanning the change point and run as written.
- Every Verify step as one `verify --plan <path> --task <N>` invocation;
  the Self-Review's largest-task figures; the sweep-and-check tasks named
  (the consistency pass and the dogfood are two).
- The dogfood task's five fixed sections (5.2), its measurement
  discipline (issue-f2ec), and the `human-needed:` line for the Account &
  Usage figure.
- The T1 list for Kanri: the requirement edits of "Requirements", the two
  ADRs with their frontmatter bookkeeping, the issues of "Issues this
  design closes", the Deferred items as new issues, and the
  `docs/design/4807-tanto.md` sections that go stale — the `tanto.json`
  paragraph ("Two maps and two mechanisms"), the reading paragraph ("the
  four figures of that session's latest reading"), the Handover section,
  and "Shoroku staging, session exits, and the adoption rule" — each
  rewritten to this spec's sections 2, 1, 3, and 6.
- The T2 candidate for the `per_batch` defaults (5.2), named so the
  recommender sees it.
- Nothing about the report or prompt skeletons beyond "follow the tanto
  templates".

## Verification

The commands the plan's How a batch is verified section carries, so that
`boundary` can run them:

```bash
./scripts/lint.sh <changed paths, each by name>
node --test skills/tanto/scripts/reading.test.js
node --test skills/tanto/scripts/passage-check.test.js
node -e 'const t=require("./skills/tanto/templates/tanto.json");const c=t.ceiling;if(!c||Object.keys(t).length!==3)process.exit(1);for(const r of ["kanri","jisso"])if(!(c[r]&&c[r].batches>0&&c[r].per_batch>0))process.exit(1);if(!(c.presence_minutes>0&&c.share_threshold>0))process.exit(1);console.log("tanto.json ok",Object.keys(t).length,Object.keys(c).length)'
grep -rn 'four figures' skills/tanto | wc -l
grep -rn 'Three signals fire' skills/tanto | wc -l
grep -rn 'ships one executable' skills/tanto | wc -l
grep -rn -c 'context=' skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/templates/batch-report.md skills/tanto/templates/roster.md
node skills/tanto/scripts/reading.js 2>&1 | head -n 1
node skills/tanto/scripts/reading.js "$T" --role kanri --presence --backstop | wc -l
```

Expected: lint clean; both test files pass; `tanto.json ok 3 4`; the three
old-value counts `0` — the `four figures` grep sees the two single-line
sites, and the wrapped `SKILL.md` sentence is checked by its `O` block; a
`context=` count of at least one in each of the four files; the usage line
naming both forms; five lines from the last command on any real
transcript `$T`. The consistency note's checks run as one task
in batch E.

## Out of scope

- The role-file diet (fixed input 7; a Deferred item).
- The raw-output levers of issue-2e52 beyond what exists; the share will
  show their effect when they land.
- A ceiling for Sekkei, Keikaku, Kaiseki, Kikaku, or Hosa (fixed input 4).
- Setting `autoCompactWindow` from the skill (fixed input 3).
- The subagents' own transcripts, which no roster names; the share is the
  run's sessions.
- The Account & Usage view's figure as anything but a number the human
  reads and Kanri records.
- `passage-check.js`: untouched, its defects `passage-check-hardening`'s.

## Issues this design closes

Each moves to `resolved/` at T1 with a resolution line naming this spec.

- **issue-40ed** — the Kanri handover half closed with decision-b6cb; the
  replacement half closes here for Jisso (3.3) with the token instrument
  the issue's 2026-09-14 addition named, and the resolution line says the
  measuring roles' rows across runs remain the data for any later ceiling
  of theirs.
- **issue-19d4** — section 6, whole.

## Answers to the spec inputs

- **I-1** — sections 1 to 5: the `usage` sum is the fifth figure (1.2);
  the ceiling is derived, baseline plus N batches (1.3, 2.1); the
  backstop sits above it and is reported (1.5, 2.2, 4); the per-batch
  measurement is mandatory in the dogfood (5.2); the share is the
  operational metric with a 30% target (5.1); 150k is the human's ceiling
  wherever named (fixed input 9); the diet is deferred by name (fixed
  input 7, Deferred item 1). The measurements table and the direction
  travel into this spec in the fixed inputs and section 1, so the
  instrument is not lost, as R-4 asked.
- **I-2** — it rides here (fixed input 5), section 6.
- **I-3** — gap A: signal 4 is checked at the start of every turn while no
  batch is in flight, the spec and plan stages included, and Kanri's
  context at the topic's opening and the plan's landing are measured
  points (3.1, 5.2, 5.3, 7.2); gap B: the share runs over the sessions
  this topic's ledger names, refused handshakes and other plans' rows
  excluded (5.1).

## Deferred items

Each becomes an issue at T1, one to one.

1. **The role-file diet**: `roles/kanri.md` at 62 KB and `SKILL.md` at
   47 KB are 15 to 27k of every seat's 72 to 83k baseline; a diet in
   passage-check form, `kanri.md` first, is a candidate for
   `tanto-sweep-2` and lowers every ceiling at the same N.
2. **A ceiling for the measuring roles**: whether Sekkei, Keikaku, or an
   attached Kaiseki should be replaced on the fifth figure, to be read
   from the archive's Context column once a few runs have filled it.
3. **A protocol hard ceiling**: the alternative rejected at Q3, filed so
   that the day a compaction summary loses a ruling the option is on
   record with its reason.
4. **Presence from more than Kanri's window**: the human's turns in the
   other roles' windows, readable from the roster's transcript paths,
   would sharpen the presence verdict; not done, because the one window
   is enough for the rule and every further read is a cost.

## The reviews this spec has had, and what each found

1. **Kanri's passage check** (I-3, 2026-09-14): two gaps, both taken —
   the spec-stage check and the share's session list (3.1, 5.1).
2. **The `spec.review` reviewer** (`.tanto/tanto-context-ceiling/spec-review.md`,
   opus, 2026-09-14): 24 findings. Two `scope`, put to the human in the
   brief — F-2, the presence gate on the compaction signal against
   decision-6dea (3.5); F-4, Keikaku's carrier line and the cold read's
   message shape against I-2's words (6.2). Twenty-two `design`, all
   taken: F-1 (ADR 1 amends 9a3a), F-3 and F-22 (the share runs before
   the archive move, over readable paths), F-5 (the checkpoint bullet),
   F-6 (the true file set in section 8), F-7 and F-8 (the "Old values"
   needles), F-9 and F-10 (the `Context` column in three templates), F-11
   (`--config` on `--share`), F-12 (Kikaku sends no reading), F-13 (every
   role reports the `ceiling` keys through the start sequence), F-14 and
   F-15 (missing lines and an unknown `--role`), F-16 (deltas across a
   seat change), F-17 and F-18 (the `exit:` line kept for non-final exits
   and loop step 6 named), F-19 (the consistency note's counts), F-20
   (design-4807 at T1), F-21 (the README's Node bullet and a missing
   `node`), F-23 (four more tests), F-24 (Jisso's deferral notice). Its
   eight shoroku candidates go to Kanri from the report's own section.

## Shoroku candidates from this spec work

For Kanri's `S-n` table; the exit proposal will carry the ones not adopted
here.

1. Measured 2026-09-14: every wake-up record of a transcript carries
   `timestamp` and `origin`, with `origin.kind` one of `human`, `peer`
   (with `name`, `msg_id`, `body`), and `task-notification`; a session
   can therefore tell the human's turns from a peer's in its own file — a
   fact for `docs/notes/claude-code-sessions-observed.md`.
2. Measured 2026-09-14: after an editor restart the config directory had
   moved to `.claude-priv`, the transcript existed under both directories
   at the same size, and the `agents/` directory under the new one held
   no `tanto-*.md`; a resumed session's dispatches run without the
   definitions until a fresh session writes them — a note for the same
   file, and a data point for issue-6a29's kin.
3. Observation: the human's answer to Q1 was a protocol none of the three
   options offered, and it became the design's center; the dialogue's
   options are a prompt, not a menu — a note for the tanto design record.
