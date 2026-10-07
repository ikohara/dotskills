# tanto roster

Kept by Kanri at `.tanto/roster.md`. Kanri is the only writer.

## Keeping rule

- One row per seat, Kanri's own row first, found by its `sessionId` — its
  Transcript cell's basename without `.jsonl` — and by nothing else. Every
  row is written from the spawner's result file, by
  `boundary.js record --seat <results path or sessionId>`: Kanri writes it
  for a seat it requested when the result lands, and for a seat the
  launcher started — a Kikaku, a Hosa — when its census prints that seat
  under Not held with `— spawned as <role> <topic>, result <id>`. Kanri's
  own row is written by `record --init` at its bootstrap and by
  `record --succeeds <sessionId>` at a handover. A standalone Kaiseki and a
  messenger get no row. A row that does not exist yet while its seat is
  already working is not an error: nothing is sent to a seat by its row.
- `boundary.js record` is this file's one writer, and no cell and no Events
  line is edited by hand: a status by `--status "<sessionId> <word>"`, a
  `live` cell's suffix by `--suffix`, a Name cell by `--rename`, an Events
  line by `--roster-event`, and a reading by the reading flags with
  `--batch` or `--read-at`. Every call compares the header of each table
  it touches with this template's and writes nothing when they differ,
  naming `boundary.js migrate`, which brings an older roster to this shape
  once. `boundary.js roster show` prints what a Start reads, and
  `boundary.js archive` moves the ended rows at a plan close.
- One held seat per role and topic; Kanri, Kikaku, and Hosa one each. The
  spawner refuses a second Kanri, Kikaku, or Hosa while it holds one
  (`held: <sessionId>`), unless the request names the Kanri it succeeds,
  and Kanri requests no second seat of a role and topic. A plan that edits
  the tanto skill has all its Jissos spawned at its landing and their rows
  `queued`; every other plan has one Jisso at a time, spawned per batch.
- A seat the census prints with the suffix `— renamed` — a known
  `sessionId` whose listed name is not the row's Name cell — is Kanri's to
  reconcile with `record --rename "<sessionId> <new name>"`, which rewrites
  the Name cell and writes the Events line
  `resumed: <old name> → <new name>` itself; nothing else is asked of it,
  and the suffix goes at the next census. A seat open in a VS Code tab
  carries the editor's name, and a new one after every window reload;
  Kanri's census finds its `sessionId` under that name and rewrites the
  cell the same way, and nothing is typed in the tab.
- A row whose session has gone gets status `dead`: a `live` row the census
  prints under Not listed — a crash, a seat whose process was collected.
  A row the census prints under Parked stays `live`: its seat is the run's,
  its conversation on disk, and a wake brings it back when a line is due.
  A row under Ended is written `stopped`, with an Events line naming what
  ended it. A `queued` row the census does not list stays `queued`, since
  the send of its prompt resumes it, and a `dead` row whose transcript is on
  disk goes `live` again when a line due to it resumes it. A stopped, dead,
  or replaced row stays until the plan closes, when `boundary.js archive`
  moves it, whole, to `roster-archive.md`, so the run stays readable after
  a replacement and the roster stays short.
- This is the record of the run's seats, not an address book. A seat is its
  `sessionId` — its Transcript cell's basename — and Kanri reads the name it
  sends to from the spawner's state file at the moment of sending
  (`boundary.js seat`), waking a parked seat first. The one address still
  stored is the first data row's, Kanri's own, which every seat reads when
  it sends to Kanri. The Name column holds the bare name the listing printed
  when the row was last written, with no `[ref]`, and Kanri rewrites it at
  every rename the census shows.
- Kanri sends to no session that has no row here: a line from a name no row
  holds — a Kikaku's `decision:`, a Hosa's `slot-needed:` — is preceded by a
  census, which prints that seat under Not held for Kanri to record.

| Role | Topic | Name | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> | <absolute path> | <family, as the spawn request named it> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path or <sessionId>.jsonl> | <batch <X>, start, handover, or plan close> | <n> | <n> | <n> | <n> | context=<n> | <n> | <m> | <k> |
| <role> | <topic> | <name> | <absolute path> | <family, as the spawn request named it> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path or <sessionId>.jsonl> | <batch <X>> | <n> | <n> | <n> | <n> | context=<n> | — | — | — |

Topic is the topic the seat's spawn request named, as its result file
carries it — for a Jisso, the topic whose queue it was spawned into: the
plan whose batches are in flight, or, with none in flight, the plan whose
landing requested the queue — or `—` for Kanri, Kikaku, and Hosa. Model is
the family the spawn request named, as the result file carries it: the full
model id is known to the seat alone. Effort is the spawn's, as the result
file records it.

The status words are five: `queued`, `live`, `stopped`, `replaced`, and
`dead`. A `live` cell may carry the suffix
`(idle since <HH:MM>)`, which Kanri appends while a Kikaku, Hosa, or Kaiseki
idles, or the suffix
`(blocked since <HH:MM>)`, which Kanri appends when the census's Listed line
for the seat carries `— blocked (<cause>)` and removes when a later
census's does not. The blocked suffix records the last census that saw the
seat blocked, not its state now — the census runs at the moments Kanri's
role names, so the cell can lag the seat by a batch — and keeps no cause,
which the census's line and the spawner's notice carry. Either way a
reader tests the cell's first word, not the whole cell. `queued` is a Jisso
of a skill-editing plan waiting for its batch prompt, in spawn order.
`stopped` is a seat that has ended — on Kanri's `stop` request, by its own
`taiseki`, or by the spawner's guard — its conversation kept, or a
`queued` row that never ran; Kanri writes it as it writes the request, or
when its census prints the row under Ended. `dead` is a session the census
prints under Not listed — not final when its transcript is on disk: a
resume puts it back to `live`. `replaced` is the old row of a Kanri that
handed over. A second Sekkei or Keikaku whose topic differs from the live
one's is not a duplicate and gets its own row.

Read at and the eight columns after it are the seat's reading, written into
its own row by `record` from the readings the sessions send (`SKILL.md`,
"The transcript reading"): a role's from its latest boundary or exit line,
Kanri's own from the reading it takes at the trigger check. Read at is
`batch <X>` for a boundary's reading and `start`, `handover`, `plan close`,
or `turn <HH:MM>` for one Kanri takes outside a boundary. Context holds the
reading's fifth figure in the spelling the reading itself prints,
`context=<n>`, so that a sweep for that spelling finds every place a
reading lands. The nine stay `—` until the seat's first reading lands.
Kikaku sends no reading and its reading columns stay `—`: it is the
human's own seat, and its cost is the human's own pacing. A `queued` row's
stay `—` until its boundary, and one that never ran moves to the archive as
`stopped`, with its blanks. Batches, Plans, and Noticed are Kanri's only —
batches accepted, plans closed, and compactions noticed by the session
itself, cumulative since its own start, `0` on the row `--init` or
`--succeeds` writes and moved by `record --kanri-count`, and `—` on every
other row; a declined handover leaves Noticed incremented, so the count
stays a record. A reading Kanri doubted and could not verify carries
`(unverified)` after its Compactions figure; when the session sent
`transcript: unavailable`, `—` stands in the four figure columns and
`context=unavailable` in Context, so that a `context=` sweep still finds
the row. The archive's Context column across runs is the data any later
ceiling for the roles that only measure would be read from — Kanri's and
Jisso's come from `tanto.json`'s `ceiling` map, and issue-40ed's two
halves closed with decision-b6cb and with that map.

## Shoroku proposal items

Between plans there is no conductor ledger, so an item raised then — by a
Kikaku file belonging to no topic, by Kanri's own
between-plans exit, or by a close's further proposal file — is recorded here
with the same six columns the ledger uses. When a topic opens, Kanri moves
the rows into the new ledger's table; nothing is written out from this table
itself, so every row here says `no` until it moves.

Columns as the ledger's, with Source the file, report, or session that
raised it; Destination one of the six `docs/` types — experience, design,
decisions, issues, notes, or reports — or `feedback`, or the compound
`<docs destination>; feedback`; Adopted one of `pending`, `yes`, and `no`;
and Written `no` or the subject of the commit that
wrote the row out. The placeholder row stays until the first item arrives.

| S-n | Source | Item | Destination | Adopted | Written |
| --- | --- | --- | --- | --- | --- |
| (no item yet) | | | | | |

## Events

At a plan close the closed plan's lines move to `roster-archive.md`, so this
list holds the current run.

- <YYYY-MM-DD HH:MM> — <one line: a seat's row written from its result,
  and a seat ended and by what — `taiseki`, or Kanri's own request; a
  session declared dead and what was verified; the plan landed and the SDD
  ledger's path recorded; a recovery (`fukki`) and what it put back;
  resumed: <old name> → <new name>;
  queued: <name> as Jisso <n> of <topic>;
  a second `no-role` from <sessionId> — the seat ended, and what was lost;
  old-contract row retired: <name>;
  unsent: <sessionId or op> — <the line or the request>, owed while the
  spawner was stale and no ledger was open, and its pair
  sent: <sessionId or op> — <the line or the request> once `fukki` sends it;
  a seat the spawner's guard stopped, and its worktree's branch;
  a handover written by <name>;
  a handover accepted by <name> from <name>; a shoroku
  proposal written by <name>, or not written and what was lost;
  an inbox sweep: its three files and its commit subjects;
  decision: <path> received from <name>;
  a hotfix committed between plans>
