# Design: roster-ledger — the roster is one row per seat, keyed by `sessionId`; `boundary.js record` validates every table against its template and refuses what does not fit; the handover, the bootstrap, the archive move, and the direction's write-back are commands; the census gains **Returned**; the launcher enters the Kanri the spawner holds

Written by Sekkei `dotskills-sekkei-roster-ledger-fc0f` (sessionId
`365a63dc`) from the dialogue at `.tanto/roster-ledger/dialogue.md`
(decisions D-1 to D-4). The topic is the sixteenth of the order held by
`.tanto/kikaku/2026-10-07-roster-ledger-sixteenth.md`.

## Fixed inputs

The input document is `.tanto/kikaku/2026-10-07-roster-ledger-sixteenth.md`,
read whole; its section 3 is the scope. Behind it, as its last section
lists them: `.tanto/kikaku/2026-10-03-topics-after-triage.md` sections 3
and 6; `.tanto/kikaku/2026-10-05-run-owned-seats.md` section 1;
`.tanto/kikaku/2026-10-07-tanto-feedback-kessai-answer.md` sections 1 and
2; `docs/superpowers/specs/2026-10-05-run-owned-seats-design.md` (sections
1.3 and 2.7 read whole, the rest by heading) and its plan; the fourteen
issues of the input's section 3 and the four it names from the post-triage
pile; `skills/tanto/scripts/boundary.js` (`record` and `census` read
whole) and `boundary.test.js`; `templates/roster.md`, `roster-archive.md`,
`kanri.md`, and `kanri-handover.md`; `roles/kanri.md`'s Start section;
`SKILL.md`'s "The roster", "The census", and "The address"; decisions 39fb
and ded8; and one run of `scripts/issue-liveness.js`. No
`.tanto/roster-ledger/spec-inputs.md` existed while this spec was written.

Under the experience layer the requirement register is `docs/experience/`;
each decision names the expectation it serves — of the scenes `exp-06b2`
("a plan handed to a run") and `exp-57f4` ("reaching a run, and being
reached by it") — or says that none does.

- **The scope** (D-1). The ten issues of the input's mechanical subset —
  5a68, 4914, f07a, e84c, dfb3, b106, 9ca6, 9c6f, 401e, 007e — plus c2fe,
  cd46, e525, d502 of the kin and 11de, 20de, 78b3, c330, f02c (its
  archive half), a14f (its second case) of the post-triage pile; fcd3 and
  7c35 close as overtaken; b106 is left with its reason under "Out of
  scope"; 3b01, c18a, a89a, and the other 44 cluster rows are left;
  `scripts/tanto.js`'s `held:` fallback is in scope although the 10-03
  shape named `boundary.js` and the templates alone, because it is the
  lock-out's remedy. Serves no expectation by itself; it is the cut.
- **One row per seat** (D-2). The roster's Residency table goes; its nine
  reading columns join the sessions table, and the archive table is the
  roster's columns plus Ended. Serves `exp-173f`: a run that continues from
  disk needs rows that one key finds whatever name the seat now carries.
- **`record` refuses and names** (D-3 point 1). The template is the schema;
  a mismatch writes nothing and prints one line naming it; a `|` in a cell
  is escaped; the five status words are the only ones; a Transcript cell
  is checked for shape; an `S-n` number in use is refused. Serves
  `exp-c53d`: a row the run writes is never a hand edit, and the human
  never repairs the file by hand (three times for f07a).
- **The census's seventh heading** (D-3 point 2). **Returned** names a
  `stopped` or `dead` row whose seat is listed or held running, with the
  act for each; a `queued` row whose entry is `gone` is marked by nobody;
  the spawner's `renamed` mark and `ack` op go. Serves `exp-c53d`: the run
  learns what happened to its own seats without the human's report.
- **The handover by command** (D-3 point 3). `record --seat <result>
  --succeeds <sessionId>` writes the successor's row first and the
  predecessor's `replaced`, with the Events line carrying the old
  transcript path. Serves `exp-c53d` and `exp-173f`.
- **What a Start reads** (D-4 point 1). `boundary.js roster show` prints
  the first row, the live and queued rows, the items count, and the Events
  tail; Start and the handover template name it in place of a cold read.
  Serves `exp-19c1`: a successor's first act costs a fixed figure, not the
  roster's size.
- **The archive move by command** (D-4 point 2). `boundary.js archive`
  moves the ended rows and the Events lines. Serves `exp-c53d`; and
  `exp-a0fb` in passing, since the archived row keeps its Transcript cell.
- **The direction's write-back by command** (D-4 point 3). `record
  --direction <path>` and `record --written <subject>`. Serves `exp-c53d`.
- **The writer's remaining forms** (D-4 point 4). `--seat` repeatable;
  `--init`; `--s-item` with a destination; the Model cell as the family the
  result carries. Serves no expectation directly; it closes 11de and 20de.
- **The launcher enters the Kanri the spawner holds** (D-4 point 5).
  Serves `exp-1c96`: the human steps into Kanri the same way each time,
  whichever row is right.

## Measured while designing

- `node scripts/issue-liveness.js --out <scratch> --ref main` on
  2026-10-07: 91.4 s; verdicts alive 169, gone 21, partly 155, none 51; the
  clusters `kanri / ledger / handover / boundary` and
  `roster / handshake / address` hold 51 open rows created on or after
  2026-10-02 (the input counted 49; the two more carry an `updated` date
  the counter read differently). Seven of the 51 name a mechanism of this
  topic by title (11de, 20de, 78b3, c330, fcd3, f02c, a14f); the rest are
  prose, spawner, launcher-test, or cost rows.
- The live roster `.tanto/roster.md` on 2026-10-07: 11132 bytes, 12 table
  rows across its two tables; `.tanto/roster-archive.md`: 388174 bytes, in
  the 16-column archive shape of 2026-09-14, with no Transcript column.
- `boundary.js`: 50820 bytes; `boundary.test.js`: 65441 bytes, 54 tests.
  `writeSeatRow`, `writeStatus`, and `writeResidency` each match a row by
  `cells(line)[2] === name`; `sessionIdOf()` exists and is used by the
  census alone. `sItemCells` writes `""` for a column it does not know and
  `t2` for `Stage`. `writeSItem` numbers from the table's highest `S-n` and
  deduplicates on Source and Item.
- The word "Residency" occurs in `roles/kanri.md` 10 times,
  `templates/kanri-handover.md` 2, `templates/roster.md` 2,
  `templates/roster-archive.md` 2, `boundary.js` 12, `boundary.test.js` 5.
- The spawner's `renamed` mark is set at `spawner.js:1440` and deleted by
  the `ack` op at line 1015; no other code reads it. `tanto.js` never
  reads it.
- A direction file's Items lines read
  `- <n> — <group> — yes|no — <topic> S-<n>`
  (`.tanto/tanto-feedback/shoroku-direction.md`).
- The f07a path, verified by the kessai-answer file: a successor Kanri's
  inline `node -e` under the Bash tool, the doubled backslash collapsed,
  `\U` and `\000` read as escapes; two NUL bytes in the roster; the
  launcher then took `path.basename(cells[10], ".jsonl")` of a cell with no
  separator, matched nothing, wrote a spawn request, and printed
  `held: <sessionId>` three times.
- This Sekkei's context at the spec write: `context=228224` after nine
  wake-ups, the input and the fourteen issues read whole.

## 1. One row per seat

### 1.1 The roster's table

The roster keeps one table, under no heading of its own as today, with
these columns in this order:

```text
| Role | Topic | Name | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |
```

The first eleven are today's sessions columns, the header `Name [ref]`
renamed `Name` because the cell has held a bare name since run-owned-seats
and a header that names what the cell never holds is the drift 9c6f
describes. The last nine are today's Residency columns less `Since`, whose
date Started already carries. The `## Residency` heading and its table go.
A seat's reading columns are blank (`—`) until its first reading lands;
Kikaku's stay blank for good, as today.

A row is keyed by its Transcript cell's basename without `.jsonl`, the
`sessionId` — the identity `SKILL.md`'s "The census" already states — and
every writer in section 2 finds a row by it and by nothing else. The Name
cell is a record, rewritten at every `— renamed` the census prints, and
never a key.

### 1.2 The archive's table

`roster-archive.md` keeps one `## Sessions` table with the roster's twenty
columns and one more, `Ended`, last:

```text
| Role | Topic | Name | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed | Ended |
```

An archive row is the roster row copied whole, Ended the day of the move.
Nothing is dropped and nothing is joined: the roster row already carries
its last reading. The template's paragraph that explains why Transcript is
dropped goes; the column is kept because it costs nothing to keep and
because the one measurement that needed it (9ca6's `--share`, since
replaced by `usage.js`) could not be made twice for its absence. `## Events`
stays as today, the roster's lines moved verbatim.

### 1.3 The status words

Five, as today: `queued`, `live`, `stopped`, `replaced`, `dead`. The two
`live` suffixes stay. `cleared` is no word of the roster's: `record
--status` refuses it, and a `cleared` row of the old contract is moved to
the archive by `migrate` (1.4) with its status as it stands, which is what
decision-ded8 asked of the archive. `replaced` is the status of every Kanri
that handed over, whatever its process is doing; `dead` is the census's
word for a seat whose process is gone and that was not replaced — one
status per fact, which is the reconciliation 007e asked for and section 3
writes out as a table.

### 1.4 `boundary.js migrate`

```bash
node "$TANTO/scripts/boundary.js" migrate --roster <path> --archive <path> [--ledger <path>] [--now <YYYY-MM-DD>]
```

One command, run once per file, idempotent. For the roster: it finds the
sessions table by its header's first cells and the Residency table by its
own, joins each Residency row into the sessions row that carries the same
Name cell — the one join by name this design makes, because the old shape
has no other key, and the last — writes the twenty-column header, drops
the Residency heading and table, moves every `cleared` row to the archive,
and prints each row it wrote and each Residency row it could not place
(`unplaced: <role> <name> — no sessions row carries that name`), which
are then the human's to drop or keep. A `live` or `queued` row whose
Transcript basename is not a UUID is printed as
`suspect: <role> <name> — Transcript <cell>` and left as it stands, since
the command cannot know the right value; `record` will refuse the file
until the row is repaired or marked `dead` by hand, once. For the archive:
it rewrites the 16-column header to the 21-column one, filling Topic, cwd,
Effort, Mode, and Transcript with `—` on every old row. For the ledger: it
renames the `S-n` table's `Candidate` column to `Item` and drops a `Stage`
column, moving no value, and reports a Measurements table without the
`Kanri's context at the topic's opening` row as `missing row:` without
adding it. A file already in the template's shape is read and left as it
is, and the command prints `migrate: <path> is current`.

`migrate` reads the template headers from the skill's own
`templates/` directory, as `record` does (2.1); the two cannot disagree.

## 2. `record` validates, escapes, and refuses

### 2.1 The template is the schema

Before writing, `record` reads the header row of every table it is about
to touch and compares it, cell for cell, with the header of the same table
in the template — `templates/roster.md` for the roster, `templates/kanri.md`
for the ledger, `templates/roster-archive.md` for the archive when
`archive` (5) writes it — located as `path.join(__dirname, "..",
"templates")`. In the repository that ships the skill the skill directory
is a link into the tree, so the template is the working tree's own. For
the ledger it also checks that the Measurements table carries the row it
keys on. On any mismatch it writes nothing and prints one line, exit 1:

```text
record wrote nothing — <path>: the <table> header is not the template's — expected | A | B | … |, found | A | C | … | — run boundary.js migrate
```

A blank cell written for a column the writer does not know (5a68's second
shape) cannot occur: the writer knows every column the template names,
and the check above is what makes that true. `sItemCells`'s fixed map, the
`RETIRED_COLUMN` test, and `t2` go.

### 2.2 The cell grammar

A `|` inside a value is written as `\|` and read back as `|` by `cells()`;
the two functions are the only place the escape lives, and every reader of
a cell in `boundary.js` and `tanto.js` goes through `cells()`. A value with
a newline is refused (`a cell with no newline (got …)`). A Transcript cell
whose basename is not `<uuid>.jsonl` — eight-four-four-four-twelve
hexadecimal digits — and is not the word `unavailable` is refused:
`a Transcript cell whose basename is <uuid>.jsonl (got <cell>)`. A cwd
cell that contains a control character is refused the same way. These two
checks are what the inline-script path of f07a would have hit.

### 2.3 The key

`--kanri`, `--jisso`, `--peer-reading`, and `--status` take a `sessionId`
where they took a name:

```text
--kanri <sessionId> --kanri-reading "<reading>" [--kanri-counts "<batches> <plans> <noticed>"]
--jisso <sessionId> --jisso-reading "<reading>"
--peer-reading "<role> <topic> <reading>"
--status "<sessionId> <word>"
--read-at "<label>"
```

A row is found by `sessionIdOf(cells[10]) === sessionId`; none found is
`a roster row for <sessionId>`, and nothing is appended by a reading or a
status — a row is created by `--seat` alone. `--peer-reading` is the one
writer keyed otherwise: by role and topic, which name exactly one `live`
or `queued` row under the keeping rule (one held seat per role and topic;
`—` for Kanri, Kikaku, and Hosa), so that a peer's reading line, which
carries the peer's name and no `sessionId`, needs no lookup — the brief
rewrites `<role> <name> <reading>` as `<role> <topic> <reading>`, the
topic being the dispatch's own. Two such rows is refused
(`one live row for <role> <topic>`).

The reading writers fill the row's nine reading columns in place: Read at
is `batch <X>` when `--batch` is given and the value of `--read-at`
otherwise — `start`, `handover`, `plan close` — and a reading with neither
is refused; the five figures as today; and for Kanri the three counts from
`--kanri-counts`, kept as they stand when the flag is absent and `0 0 0`
when `--init` or `--succeeds` writes the row. A reading taken outside a
boundary — Kanri's at its start, at a handover, at a close — is this call
with `--read-at`, and "outside a boundary you write the row yourself" in
`roles/kanri.md` reads "you run `record` yourself".

`templates/boundary-brief.md`'s `record` call carries Kanri's
`sessionId` — the basename of the `kanri-transcript=` path the dispatch
already names, which the brief derives — and the Jisso's, from the
`seat=` result when one is named and from a new `jisso=<sessionId>` key
when `seat=none` (a `queued` seat under rule 11); its peer-reading lines
carry the topic. Kanri's own `record` calls — loop step 6's `--status`
lines, the handover's, the close's — carry `sessionId`s the same way, read
from the roster rows; `roles/kanri.md`'s dispatch block, its readings
line, and its step-6 call say so.

### 2.4 `--seat`, `--init`, and `--succeeds`

`--seat <result>` is repeatable: each file writes one row, matched by the
`sessionId` the result carries (`seat.sessionId`), appended when no row
holds it, rewritten in place when one does — Status `live` as today, since
`--seat` is called from a spawn or a resume result alone — with the nine
reading columns kept as they stand on a rewrite. The value may be a
`sessionId` instead of a path: `record` then reads the state file's entry
for it and opens `results/<requestId>.json`, which is how a Kanri the
launcher spawned writes its own row at the bootstrap and at a handover
without knowing its result's file name. The Model cell
holds `seat.model` as the result carries it, the family the request named;
`templates/roster.md` says `<family, as the spawn request named it>` in
that cell, closing 20de's second half by the template and not by the
script, because the full model id is known to the seat alone and no result
file carries it. The Transcript cell is `seat.transcript`, or
`<sessionId>.jsonl` when the result found no path, or `unavailable` when
it held neither — as today — and 2.2's shape check runs on it.

`--init`, with `--roster <path>` and at least one `--seat`, creates the
roster from `templates/roster.md` when the path is absent — the template's
prose and the empty table, the placeholder rows dropped — and then writes
the seats. Kanri's bootstrap (Start step 3) is one such call with its own
spawn result; no Kanri writes a row by hand. `--init` on a roster that
exists is refused.

`--succeeds <sessionId>`, with exactly one `--seat` whose result's role is
`kanri`, is the handover write: the successor's row is written first in
the table; the predecessor's row — found by the `sessionId` given — gets
Status `replaced` with every other cell kept, its reading columns among
them; and the Events line
`handover accepted by <successor name> from <predecessor name> — <predecessor Transcript cell>`
is written under the roster's `## Events` heading, stamped as `record`
stamps every event. A `--succeeds` whose `sessionId` no row holds is
refused. `roles/kanri.md`'s Handover case names this call in place of
"rewrite the roster", and its clause "or `dead` when the census does not
list its `sessionId`" goes (1.3); the Residency reset it asked for is the
successor's blank reading columns and `0 0 0` counts, its first reading
landing by the `--read-at handover` call that follows.

Two more roster writers, so that no Events line and no Name cell of the
roster is edited by hand:

- `--roster-event "<text>"` writes one line under the roster's `## Events`
  heading, stamped and deduplicated as the ledger's `--event` is. Every
  roster Events line `roles/kanri.md` asks for goes through it — `resumed:`,
  `old-contract row retired:`, `no first turn:`, `handover written by`,
  `decision: … received from`, a hotfix between plans, `unsent:` and
  `sent:` — and the role text names the flag where it names the line.
- `--rename "<sessionId> <new name>"` rewrites the Name cell of that row
  and writes the roster Events line `resumed: <old name> → <new name>`
  itself; it is the act the census's `— renamed` asks for and the "Yours"
  case's rewrite.

A call that names no ledger-keyed flag — `--seat`, `--status`, `--rename`,
`--roster-event`, a reading with `--read-at` — needs no `--ledger`, since
a bootstrap, a handover between plans, and a close's last census have
none; `--ledger` stays required by the flags that write the ledger.

### 2.5 `S-n`

`--s-item "<source> | <destination> | <item>"`: three fields split on the
first two unescaped pipes; the destination may be empty and is then
written `—`, and a two-field value is read as source and item with the
destination `—`, so that a brief rendered before batch A's text change
still writes. The row is numbered from the highest `S-n` in the table, as
today, and before any row is written `record` reads every `S-n` cell: a
number that occurs twice in the table as found is refused —
`an S-n table with no number used twice (S-28 twice)` — so that a table a
hand edit has collided is repaired once and never grows. The dedup on
Source and Item stays.

### 2.6 `--direction` and `--written`

`--direction <path>` reads the direction file's `## Items` lines, matches
each on `— (yes|no) — <topic> S-(\d+)$`, and writes `yes` or `no` into the
Adopted cell of that `S-n` row of the ledger given by `--ledger`. An Items
line that carries no `S-n` — an inbox item's or a feedback copy's, whose
pointer is `(inbox …)` — is expected and printed as
`direction: no S-n — <line>`, exit 0; a line with an `S-n` the table does
not hold is `direction: unmatched — <line>`, and the call goes on; the pass
prints each row it wrote. The between-plans sweep has no ledger and no
`S-n` rows, and runs neither flag.

`--written "<subject>" [--only S-a,S-b,…]` writes the subject into the
Written cell of every row whose Adopted is `yes` and whose Written is `no`,
skipping a row whose Destination is exactly `feedback`; with `--only` it
writes the rows named and no other, which is how shusei's commit subject
reaches the `fix` rows and shoki's reaches the rest — the direction file's
groups give Kanri the two lists. `--written-feedback "<basename>"` writes
`feedback <basename>` into the feedback-only rows, run once `usage.js
close` has placed the file and not while it holds it, so a held file's rows
keep `no` as today. Shoki's brief and the landing name these in place of
the by-hand rewrite; d502's second carrier, a sentence in the Check step,
is not needed.

### 2.7 What stays

`--batch`, the five Batches cells, `--event`, `--progress`, `--deferred`,
`--now`, the two readings' joint Measurements entry, the `unavailable`
reading's `—` columns, the per-file line ending, and the all-or-nothing
write stay as they are. Idempotency stays: a second call with the same
arguments prints the same rows and changes nothing.

## 3. The census

Seven headings, in this order: **Listed**, **Parked**, **Ended**,
**Returned**, **Not listed**, **No session id**, **Not held**. The rule for
each is one row of this table, which `SKILL.md`'s "The census" carries in
place of its bullet list, and `roles/kanri.md`'s "Session lifecycle"
points at:

| Row status | State file | Listing | Heading | Kanri's act |
| --- | --- | --- | --- | --- |
| `live`, `queued` | any but `stopped`, `removed` | listed | Listed, with `— renamed` when the listed name is not the Name cell, `— blocked (<cause>)` for a background seat on a prompt | rewrite the Name cell on `— renamed`; append or remove the `(blocked since)` suffix |
| `live` | `parked` | not listed | Parked, with `— mid-turn`, `— waiting` | nothing; Recovery wakes a `— mid-turn` seat with a topic |
| `live`, `queued` | `stopped`, `removed` | any | Ended, `by taiseki` when the seat ended itself | `--status "<id> stopped"` and an Events line naming what ended it |
| `stopped`, `dead` | `running`, `blocked`, or listed | listed or held | **Returned** — `<row status>; seat <state>` | for `dead`: `--status "<id> live"`, the seat is back; for `stopped`: a `stop` request, the run ended it and the process stayed (cd46) |
| `live` | absent, `running`, `blocked`, `gone` | not listed | Not listed, `— listed without a pid (a stale entry)` for a pid-less entry | `--status "<id> dead"`, with an Events line; the row goes `live` again by a wake |
| `queued` | any, `gone` included | not listed | Not listed, `— queued; its batch line wakes it` | nothing (78b3) |
| any | — | — | No session id — the Transcript cell has no `sessionId` | repair the cell by hand, once; `record` refuses the file until then |
| none | held `running`, `blocked`, `parked` | any | Not held, `— spawned as <role> <topic>, result <id>` | `record --seat <that result>` |
| none, or `stopped`/`dead`/`replaced` | — | listed | Not held, `— row <status>` for a row that holds it | a `replaced` row's seat still listed waits for the successor's `stop` request; the two others are Returned's cases and print there instead |

`dead` is marked on the Not listed signal alone, as today; a `replaced` row
is never re-marked by the census. The rules the role file carries beside
the table stay there — the `— no first turn since <stamp>` suffix and its
one request, the Parked seat woken in Recovery alone, the `(idle since)`
suffix's precedence — and the role's sentences that count the headings
("six"), that say the census prints `live` and `queued` rows alone, that
say "No session id — nothing", and that say a `dead` row goes `live` "when
a line is next due" (the Replace table's first row, "Sending to a seat",
"Session lifecycle") are rewritten to the table; section 7 lists them. The
census runs before `archive` at a close, and Returned's acts are done
before the move, so that a `stopped` row whose seat still runs gets its
`stop` request before its row leaves the roster. The census's `— renamed` suffix is
derived, as today, from the listed name against the Name cell; the
spawner's `renamed` mark and its `ack` op go (c330): `OPS` loses `ack`,
the spawner's census stops setting `seat.renamed`, and `SKILL.md`'s
Artifacts row for `.tanto/spawner/` lists eight ops. On `spawner: stale`
and `census: unavailable` Kanri marks nothing, as today.

## 4. What a Start and a handover read

### 4.1 `boundary.js roster show`

```bash
node "$TANTO/scripts/boundary.js" roster show [--roster <path>] [--events <n>|all] [--items]
```

Prints, and writes nothing: the first data row as
`first: <name> — <sessionId> — <status>`; every `live` and `queued` row as
`<role> <topic> <name> — <status> — <sessionId>`, with `— no state entry`
when the spawner's state file holds no entry for it (the old-contract row
Start step 4 looks for); `cleared: <n> rows — run boundary.js migrate`
when any `cleared` row remains; the count of rows in the roster's Shoroku
proposal items table as `items: <n>`, or the rows themselves with
`--items`, for the opening that moves them into a ledger; and the last
`<n>` Events lines (ten by default, `all` for a reader that looks for an
unpaired `unsent:` or a hotfix line) under `events:`. On a roster whose
header is not the template's it prints the rows it can and ends with the
`migrate` line of 2.1, exit 1, so that a successor on an old-shape roster
learns it from its first command. Whether a topic's ledger exists is
`ls .tanto/*/kanri.md`, not an Events read.

### 4.2 Where it is named

`roles/kanri.md` Start step 4 reads "run `roster show` and the census" in
place of "cold-read the roster"; the four cases read the first row's
`sessionId` from `show`'s first line; step 3's bootstrap is
`record --init --roster .tanto/roster.md --seat <own sessionId>` followed
by the `--read-at start` reading. `templates/kanri-handover.md`'s
`## Residency` section becomes `## Reading`, one line: the reading taken
when the handover was written, with the roster read by `roster show`; and
its `## Next step` section, whose "after its cold read" goes, names the
ledger sections a successor reads — Progress, Open questions for the
human, the Session events tail, and Measurements — through
`passage-check.js sections`, which closes 401e's second half.

## 5. `boundary.js archive`

```bash
node "$TANTO/scripts/boundary.js" archive [--roster <path>] [--archive <path>] [--now <YYYY-MM-DD>]
```

Moves every row whose Status is `stopped`, `dead`, or `replaced` from the
roster to the archive's Sessions table, Ended `--now` or today, each copied
whole; then moves every line under the roster's `## Events` to the
archive's `## Events`, verbatim, in order; validates both files' headers
first (2.1) and writes both or neither; prints each row moved. A `queued`
row that never ran moves as `stopped` once Kanri has written it so, which
the close's step already asks. `roles/kanri.md`'s close names the command in
place of "the archive move", and the roster template's keeping rule says
the move is this command's. The Release row's list of movable statuses
loses `refused` and `cleared` — the first is no word of the roster's, the
second is `migrate`'s to move — and its sentence about bringing the items
table to the template's shape goes, since `record` refuses a drifted table
and `migrate` repairs it.

## 6. The launcher

Two changes to `scripts/tanto.js`, both in the Kanri branch:

- When the spawner answers a Kanri spawn request with
  `error: held: <sessionId>`, the launcher attaches to that `sessionId` —
  by the spawner's own record it is the run's live Kanri — and prints one
  line first: `tanto: the roster's first row does not name the live Kanri
  <sessionId>; entering it — run boundary.js roster show`. It writes no
  second request.
- When a first row exists but its `sessionId` matches neither the listing
  nor the state file — a corrupt cell, or a row of a run the state file no
  longer holds — the launcher looks for a state-file Kanri held `running`
  or `blocked` by role before writing a spawn request, as the no-row branch
  does today, and enters it with the same line.

Both are tested in `tanto.test.js` with the fake listing and state file
its tests already use. The second is what a14f's second occurrence hit
(a handover row the launcher could not match); its first occurrence, a
Kanri `blocked` for hours, is outside this design and the issue stays
open for it.

## 7. File by file

Scripts, each with its tests in the same task:

- `skills/tanto/scripts/boundary.js` — sections 1.4, 2, 3, 4.1, 5: the
  template-header check and the escape; the `sessionId` key in every
  roster writer; `--seat` repeatable, `--init`, `--succeeds`; the
  three-field `--s-item` and the duplicate-number refusal; `--direction`,
  `--written`, `--written-feedback`; the seventh heading and the 78b3 line;
  `roster show`, `archive`, `migrate`; the usage line's list of
  subcommands.
- `skills/tanto/scripts/boundary.test.js` — one test per refusal line, the
  escape round trip, the key, the handover write, `migrate` over a fixture
  in today's two-table shape and over the 16-column archive, `show`,
  `archive`, the census's Returned row for each of its two cases, the
  `queued`/`gone` line.
- `skills/tanto/scripts/spawner.js` and `spawner.test.js` — `ack` and the
  `renamed` mark removed.
- `skills/tanto/scripts/tanto.js` and `tanto.test.js` — section 6.

Templates:

- `templates/roster.md` — the twenty-column header, the Residency section
  gone, the keeping rule's bullets rewritten for the key and the commands,
  the Model cell's wording.
- `templates/roster-archive.md` — the 21-column header, the dropped-columns
  paragraph gone.
- `templates/kanri.md` — unchanged in shape; its `S-n` prose names the
  three-field `--s-item` and the refusal.
- `templates/kanri-handover.md` — `## Reading` for `## Residency`; the
  sections to read, in `## Next step`; lands in batch C with the role text
  that reads it.
- `templates/boundary-brief.md` — the `record` call's two `sessionId`s
  and the `jisso=` key; its peer-reading lines as `<role> <topic>
  <reading>`; its `--s-item` lines with the destination field.

Contract text, only where a mechanism it names changes:

- `SKILL.md` — "The roster" (the columns, the Name cell, the archive's
  shape, the status words), "The census" (the table of section 3), the
  Artifacts rows for the roster, the archive, and the spawner directory,
  the Resuming table's renamed row (unchanged in rule; the `ack` reference
  goes), and the scripts paragraph's list of `boundary.js` subcommands.
- `roles/kanri.md` — Start steps 3 and 4 (`--init`, `roster show`, the
  old-contract read from `show`'s lines); the Handover case
  (`--succeeds`, the `or dead` clause gone, the counts); the "Yours" case
  (`--rename`); the dispatch block, the readings line, and loop step 6's
  `--status` call (`sessionId`s, `<role> <topic> <reading>`, the
  three-field `--s-item`); the beat sentence's `ack`; "Sending to a
  seat"'s and the Replace table's "goes `live` when a line is next due"
  (Returned); the Residency wording of loop step 4, "The trigger", "The
  residency line", "The handover file", "Readings", and the Release row;
  "Readings"' "write the row yourself" (`--read-at`); the Release row's
  statuses and the archive move (`archive`); the Check step's and step 4's
  write-back (`--direction`, `--written`, `--only`, `--written-feedback`),
  and the landing's `feedback <basename>` line; "Session lifecycle"'s
  census paragraph (seven headings, the table pointer, No session id's
  act, Not held's `— row <status>`); Recovery step 1's "six headings";
  every roster Events line's writer (`--roster-event`); "after its cold
  read" wherever it stands.
- `README.md` — "Moving a run" names `migrate` for an old-shape roster.

## 8. Migration, rule 11, and this plan

The plan edits this skill's own files and runs under rule 11: its Jissos
are spawned at the landing with `queue=roster-ledger`, and the authority
for the run's sessions is the plan's Global Constraints, the prompt keys,
and the batch prompts. Three batches:

- **A — the shape, the key, and the writer.** `boundary.js` sections 1.4
  and 2 with its tests; `templates/roster.md`, `roster-archive.md`,
  `kanri.md`'s prose, and `boundary-brief.md`. The brief's `record` call
  changes in this batch because `record`'s arguments do, and the run-time
  template lands with the code that keys on it.
- **B — the census, the commands, the spawner, the launcher.** Section 3,
  4.1, 5, and 6 with their tests.
- **C — the contract's text.** `SKILL.md`, `roles/kanri.md`,
  `templates/kanri-handover.md`, `README.md`; the Old values list measured
  at zero.

Global Constraints the plan carries, in substance:

1. **The live roster is migrated at batch A's boundary.** Before Kanri
   dispatches A's `boundary.verify`, it runs `migrate` once over
   `.tanto/roster.md` and `.tanto/roster-archive.md` (and the open ledger),
   and reads what it prints; `record` refuses the old shape with the line
   that names `migrate`, so a forgotten run is caught at the first write
   and costs one more dispatch. `migrate`'s `suspect:` and `unplaced:`
   lines are Kanri's to settle by hand before the dispatch, once.
2. **Every `record` call carries `sessionId`s from A's boundary on** —
   the brief's and Kanri's own (loop step 6's `--status` lines among
   them), with `<role> <topic> <reading>` peer lines and the three-field
   `--s-item`. A's batch prompt's Kanri directive says so, since
   `roles/kanri.md`'s text changes in C; Kanri's own `sessionId` is its
   transcript basename, every other seat's is its row's, and `record`
   refuses a name with a line that says so.
3. **No role is started or replaced before C's landing**, except Kanri's
   own handover when due — its successor takes this ruling and
   Constraint 2 from the handover file, and runs the Handover case with
   `--succeeds` once A has landed, by hand before; between B and C the
   handover template's `## Reading` still says "Residency" and the
   successor reads the roster by `roster show` all the same — and a
   Kaiseki, a Kanri ruling. `migrate`'s `suspect:` and `unplaced:` lines
   are the one hand edit of the plan, at A, and the role's "you edit no
   table by hand" stands for every other moment.
4. **The archive move at this plan's close is `boundary.js archive`**, and
   the close's direction write-back is `--direction` and `--written`:
   the plan's own close is the first run of both, and their output is the
   close's acceptance check.
5. **A task that changes `record`'s refusal lines brings its tests with
   it**, and `node --test skills/tanto/scripts/*.test.js` is green at every
   task that touches a script.

## 9. Constraints, costs, and risks

- **One join by name, once.** `migrate` joins Residency rows to sessions
  rows by Name, the key this design retires, because the old shape has no
  other. A Residency row under a stale name is printed `unplaced:` and
  dropped or kept by hand; nothing is guessed.
- **A refusal is a stop.** `record` refusing at a boundary stops that
  boundary until the file is right. The line names the file, the table,
  and the command that repairs it, so the stop is one command long; the
  alternative, writing past a drift, is what 5a68, 4914, and 9c6f measured
  as silent corruption.
- **The brief changes arguments mid-plan.** Rule 11 is the cover: the
  template and the code land in one batch, and the batch prompt carries
  the `sessionId`s. A `boundary.verify` that renders the old call fails on
  `record`'s refusal and names it, not silently.
- **Width.** A twenty-column row is read by `show`, the census, and
  `record`, never by a cold read; the human reads `show`'s lines.
- **`cleared` rows.** The old contract's rows move to the archive with
  `cleared` as they stand; nothing rewrites history.
- **The escape touches every reader.** `cells()` is the one reader in
  `boundary.js`; `tanto.js`'s `firstRosterRow` splits on `|` itself today
  and is changed to use the same grammar, tested with a cell carrying
  `\|`.

## Old values this plan contradicts

Needles, each with its file and heading; the plan measures each at zero
over the files it touches at every boundary, and greps the first six
across `skills/tanto/` as a whole.

- `Residency` — `SKILL.md`, `roles/kanri.md`, `templates/roster.md`,
  `templates/roster-archive.md`, `templates/kanri-handover.md`,
  `boundary.js`, `boundary.test.js`.
- `Name [ref]` as a header cell — the two roster templates, `SKILL.md`
  "The roster" ("Columns are …"), `boundary.js`'s `SESSIONS_HEADER` and
  `RESIDENCY_HEADER`.
- `cleared` as a `record --status` word — `boundary.js` (`live|cleared|
  stopped|queued`), its test, `roles/kanri.md`.
- `"ack"` and `seat.renamed` — `spawner.js`, `SKILL.md` Artifacts.
- `rewrite the roster` — `roles/kanri.md` Handover case.
- `cold-read the roster`, `after its cold read` — `roles/kanri.md` Start
  step 4 and its handover text, `templates/kanri-handover.md` Next step.
- `<role> <name> <reading>`, `--kanri "<name>"`, `--jisso "<name>"`,
  `--status "<name>` — `templates/boundary-brief.md`, `roles/kanri.md`'s
  dispatch block, readings line, and loop step 6.
- `refused` as a roster status — `roles/kanri.md` Release row.
- `or `dead` when the census does not list` — `roles/kanri.md` Handover
  case.
- `Stag[e]`, `RETIRED_COLUMN`, `"t2"` — `boundary.js`.
- `matched by the Name column` — `boundary.js`'s `writeSeatRow` comment.
- `<name [ref]>` and `<kanri name>` in the `record` call —
  `templates/boundary-brief.md`.
- "Transcript is dropped" — `templates/roster-archive.md`.

## Requirements

Under the experience layer the requirement register is `docs/experience/`,
and this section names the expectations. This design serves `exp-173f`,
`exp-19c1`, `exp-c53d`, and `exp-a0fb` of `exp-06b2`, and `exp-1c96` of
`exp-57f4`, each named in Fixed inputs with the decision that serves it; it
edits none and proposes none.

## The ADRs

Written by the close's apply under `docs/decisions/`. Two.

### ADR 1 — the roster is one row per seat, keyed by `sessionId`, and `record` is its only writer, refusing what the template does not name

Context: dfb3's seven measured duplicate rows, f07a's three corrupted
handover rows, e84c's three collided ledgers, 9ca6's two partial
measurements, and 5a68, 4914, and 9c6f's silent drift, all from a writer
that matched by name, validated nothing, and left two writes to hand.
Decision: sections 1 and 2. Rejected: a `Session` column added to a kept
Residency table (dialogue Q-4 option A — the join stays, and so does the
"move both as one row" rule the archive move must implement); warn-and-
write on a header mismatch (5a68's proposal's second half — a warning on
stderr at a boundary is read by nobody, and a blank cell written past it
is the defect); a `[ref]` kept in the roster for disambiguation (retired
by run-owned-seats; `SendMessage`'s own error asks for it at the send).
Amends decision-ded8 in one part: `cleared` is no status of the roster's,
and the old contract's `cleared` rows are the archive's as they stand;
the rest stands. Amends decision-39fb in no part: a `dead` row's resume
still puts it back to `live`, now by `--status`.

### ADR 2 — the census has seven headings, each with one act, and a `queued` seat's absence is marked by nobody

Context: 007e's four unreconciled findings and its fifth case, cd46's
`stopped` row whose seat ran seven hours, 78b3's `queued` row against a
`gone` entry, c330's mark with no reader. Decision: section 3's table.
Rejected: `record --status stopped` writing the `stop` request itself
(cd46's first repair — a file writer that also writes spawner requests
mixes two instruments, and the census heading catches the case whichever
side forgot); a keep-alive or a timeout for the `queued` seat (decision-
39fb's rejections stand). Amends decision-39fb in one part: a `dead` row's
seat that is listed again is the census's **Returned**, and Kanri writes
the row `live` there rather than at the next line due; the rest stands.

## What the plan must contain

- Three batches, A to C, as section 8 cuts them; the cut inside a batch is
  Keikaku's, by file for the scripts and by heading for `SKILL.md` and
  `roles/kanri.md`.
- The five Global Constraints of section 8, word for word in substance.
- No measurement task: every figure this design rests on is in "Measured
  while designing".
- A fixture for `migrate` in today's two-table roster shape with at least
  one Residency row under a stale name, and one in the 16-column archive
  shape; a fixture roster with a `\|` in a cell and one with a Transcript
  cell missing its separators, each refused by the line section 2 names.
- The Old values list, measured at zero over the touched files at every
  boundary; its first six needles grepped across `skills/tanto/`.
- `node --test skills/tanto/scripts/*.test.js` green at every task that
  touches a script.
- The README's "Moving a run" sentence for `migrate`.

## Verification

- `node --test skills/tanto/scripts/*.test.js` green, with the new tests
  listed under section 7.
- At batch A's boundary: `migrate` run over the live roster and archive
  prints its rows and no `suspect:` line, or the ones it prints are
  settled; the boundary's `record` call, with `sessionId`s, writes the
  twenty-column rows, which the verdict file quotes.
- At batch B's boundary: `boundary.js census` prints seven headings;
  `roster show` prints the first row and the live rows in under a second;
  `tanto.test.js`'s two new tests pass.
- At the close: `boundary.js archive` moves this plan's ended rows and the
  Events lines, and `record --direction` and `--written` fill the ledger's
  two columns from the direction file — the close's own output is the
  acceptance check, read by Kanri and quoted in the ledger's Progress line.
- Every needle of the Old values list at zero over the touched files.

## Out of scope

- **b106** — a Jisso's report line reached a Kanri that was replaced before
  it read it, and no error fired. The address rule now reads the first row
  at the moment of sending, and the predecessor's inbox is lost with its
  stop; the remedy is the handover file's In flight list, which names the
  reports the successor expects and is Kanri's to keep — a handover
  mechanism, not a roster one. The issue stays open with this note.
- **3b01** (the agent-definition instrument), **c18a** (the spawner
  bundle), **a89a** (three prose directions), the prose bundles 13ab,
  2f88, e3ce, fb90, 37ec, bdad, and the 44 other post-triage cluster rows
  — the sweep's, as the input's section 3 holds them.
- **a14f's first occurrence** — a Kanri `blocked` for hours and a spawn
  request nobody wrote; the writer is not identified and this design does
  not guess.
- **The ledger's shape** — unchanged; `migrate --ledger` renames two
  columns of an older ledger and otherwise reports.
- **`usage.js`** — reads the spawner's result files and the transcripts,
  not the roster; unaffected.

## Issues this design closes

Each term the design retires was grepped once across `docs/issues/open/`:
"Residency" (14 issues), "cleared" (12), "renamed" (10), "ack op" (1),
"archive move" (10), "Name string" (1), "Name cell" (6), "rewrite the
roster" (1), "Start step 4" (1), "held:" (2). The hits outside the list
below are prose bundles or issues of other mechanisms (28f2, 2a80, 7bd1,
147e, 40ed, 76df, f8e6, acdb among them) and stay for the sweep.

- **5a68** — closes: the template is the schema, and a mismatch is a named
  refusal, never a blank cell (2.1).
- **4914** — closes: `\|` in `cells()` and `row()`, and the header check
  (2.1, 2.2).
- **f07a** — closes: the handover row is `--succeeds`, the Transcript and
  cwd cells are checked for shape, and the launcher enters the held Kanri
  (2.2, 2.4, 6).
- **e84c** — closes: a number used twice is refused before any write
  (2.5).
- **dfb3** — closes: every writer finds a row by `sessionId` (2.3, 2.4),
  and the archive move is a command (5).
- **9ca6** — closes: the archive keeps every column (1.2).
- **9c6f** — closes: the header check at every write, and `migrate` for
  the drift it finds (2.1, 1.4).
- **401e** — closes: `roster show` and the handover template's sections
  (4).
- **007e** — closes: the census's table, one act per row, `replaced`
  never re-marked (3, 1.3).
- **c2fe** — closes: `--succeeds` (2.4).
- **cd46** — closes: **Returned**'s `stopped` case (3).
- **e525** — closes: the handover Events line carries the predecessor's
  Transcript cell (2.4).
- **d502** — closes: `--direction` and `--written` (2.6).
- **11de** — closes: `--seat` repeatable; `dead` is a `--status` word (2.4,
  1.3).
- **20de** — closes: the three-field `--s-item`, and the Model cell's
  wording in the template (2.5, 2.4).
- **78b3** — closes: the `queued; its batch line wakes it` line, marked by
  nobody (3).
- **c330** — closes: the `renamed` mark and the `ack` op go (3).
- **f02c** — closes: the archive move is `archive` (5); the share half
  left with `reading.js --share` and is `usage.js`'s.
- **fcd3** — closes as overtaken: run-owned-seats 1.3 settled the bare
  name, and the header now says `Name`.
- **7c35** — closes as overtaken: no handshake exists; a live row whose
  seat is not listed is the census's Not listed row.
- **a14f** — amended, not closed: its second occurrence is section 6's
  second change; the first stays.
- **b106** — not closed; "Out of scope" says why.

## Answers to the spec inputs

No `spec-inputs.md` was written. One input reached this Sekkei by Kanri's
answer to the `spec-check:` line, `.tanto/roster-ledger/spec-check-kanri.md`
(I-1): 37 findings U1 to U37 on what the first draft did not name, and a
list of every Residency and name-keyed place in the role file, the
handover template, the brief, and the script. Each is answered in the
text, in this order:

- U1, U9 — `--ledger` optional for roster-only calls (2.4).
- U2, U8 — `--kanri-counts`, `0 0 0` at `--init` and `--succeeds`, the
  first reading by `--read-at` (2.3, 2.4).
- U3, U9 — `--seat <sessionId>` reads the result through the state file
  (2.4).
- U4 — `show` prints `— no state entry` and the `cleared:` count (4.1).
- U5 — `show --events all`, `--items`; the ledger's existence by `ls`
  (4.1).
- U6, U12, U37 — "after its cold read" in the Old values list; the
  sections line in `## Next step` (4.2).
- U7 — the `or dead` clause goes (2.4, Old values).
- U10 — `--roster-event` (2.4).
- U11 — `--rename`; `--seat` keeps the reading columns on a rewrite (2.4).
- U13, U17 — `--peer-reading` by role and topic; the two-field `--s-item`
  tolerated; the brief's lines named (2.3, 2.5, 7).
- U14 — the `jisso=` key for `seat=none`; Kanri's `sessionId` from
  `kanri-transcript=` (2.3).
- U15, U36 — Constraint 2 covers Kanri's own calls (8).
- U16 — `--read-at` defined (2.3).
- U18, U28, U32, U34 — no change needed; noted.
- U19 to U23, U25, U26 — the role file's places listed (3, 7).
- U24 — the census and Returned's acts before `archive` (3).
- U27 — `refused` and `cleared` out of the Release row; the items table
  is `record`'s to refuse and `migrate`'s to repair (5).
- U29 — `--only`, the feedback-only skip, `--written-feedback` after
  placement (2.6).
- U30, U31 — `direction: no S-n` for inbox lines; the sweep runs neither
  flag (2.6).
- U33 — the one hand edit, at A (8, Constraint 3).
- U35 — `kanri-handover.md` moves to batch C (7, 8).

## Deferred items

- The collided `S-n` tables of closed ledgers (`bg-seat-ergonomics`,
  `bg-seat-fixes`) are history; nothing renumbers them, and a cross-ledger
  reference to them is disambiguated by Source as today.
- A `--written` form that takes the direction file's own commit subject
  from `git log` rather than an argument.
- The `Returned` heading's `stopped` case could, in a later design, write
  the `stop` request itself from the census; this design keeps the census
  read-only.

## Shoroku proposal from this spec work

Excluded: the spec, the dialogue, and the spec review, which the close's
recommender reads for itself.

1. Rejected (Q-4 A): a `Session` column on a kept Residency table — the
   join stays, and the archive move has to implement it.
2. Rejected: warn-and-write on a header mismatch — a warning at a boundary
   is read by nobody, and the blank cell is the defect.
3. Rejected: `record --status stopped` writing the `stop` request — two
   instruments in one writer; the census heading catches the case.
4. Measured: the liveness run's 51 cluster rows against the input's 49;
   seven name a mechanism of this topic by title.
5. Observed: a one-word answer to two open questions was asked back (Q-3),
   as issue-a89a's third direction says; the ask-back cost one turn and
   recorded nothing wrong.
6. Observed: the Sekkei's context was 228224 at the spec write after
   reading the input and the fourteen issues whole, with the previous
   topic's spec read by heading alone; the input document's
   list-the-rest form made that cut possible.
