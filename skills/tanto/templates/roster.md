# tanto roster

Kept by Kanri at `.tanto/roster.md`. Kanri is the only writer.

## Keeping rule

- One row per seat, Kanri's own row first. Every row is written from the
  spawner's result file, by `boundary.js record --seat <results path>`:
  Kanri writes it for a seat it requested when the result lands, and for a
  seat the launcher started — a Kikaku, a Hosa — when its census prints
  that seat under Not held with
  `— spawned as <role> <topic>, result <id>`. A standalone Kaiseki and a
  messenger get no row. A row that does not exist yet while its seat is
  already working is not an error: nothing is sent to a seat by its row.
- One held seat per role and topic; Kanri, Kikaku, and Hosa one each. The
  spawner refuses a second Kanri, Kikaku, or Hosa while it holds one
  (`held: <sessionId>`), unless the request names the Kanri it succeeds,
  and Kanri requests no second seat of a role and topic. A plan that edits
  the tanto skill has all its Jissos spawned at its landing and their rows
  `queued`; every other plan has one Jisso at a time, spawned per batch.
- A `renamed` mark in the spawner's `seats.json` — a known `sessionId` under
  a new name — is Kanri's to reconcile: rewrite the row's Name column, write
  the Events line `resumed: <old name> → <new name>`, and clear the mark
  with an `ack` request. A seat open in a VS Code tab carries the editor's
  name, and a new one after every window reload; Kanri's census finds its
  `sessionId` under that name and rewrites the cell the same way, and
  nothing is typed in the tab.
- A row whose session has gone gets status `dead`: a `live` row the census
  prints under Not listed — a crash, a seat whose process was collected.
  A row the census prints under Parked stays `live`: its seat is the run's,
  its conversation on disk, and a wake brings it back when a line is due.
  A row under Ended is written `stopped`, with an Events line naming what
  ended it. A `queued` row the census does not list stays `queued`, since
  the send of its prompt resumes it, and a `dead` row whose transcript is on
  disk goes `live` again when a line due to it resumes it. A stopped, dead,
  or replaced row stays, with its Residency row, until the plan closes, then
  both move to `roster-archive.md` as one row, so the run stays readable
  after a replacement and the roster stays short.
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

| Role | Topic | Name [ref] | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> | <absolute path> | <model id> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path, <sessionId>.jsonl, or unavailable> |
| <role> | <topic> | <name> | <absolute path> | <model id> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path, <sessionId>.jsonl, or unavailable> |

Topic is the topic the seat's spawn request named, as its result file
carries it — for a Jisso, the topic whose queue it was spawned into: the
plan whose batches are in flight, or, with none in flight, the plan whose
landing requested the queue — or `—` for Kanri, Kikaku, Hosa, and a
standalone Kaiseki. Effort is the spawn's, as the result file records it.

The status words are five: `queued`, `live`, `stopped`, `replaced`, and
`dead`. A `live` cell may carry the suffix
`(idle since <HH:MM>)`, which Kanri appends while a Kikaku, Hosa, or Kaiseki
idles and the intake's address rule reads, or the suffix
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

## Residency

| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | context=<n> | <n> | <m> | <k> |
| <role> | <topic> | <name> | <YYYY-MM-DD> | <boundary> | <n> | <n> | <n> | <n> | context=<n> | — | — | — |

One row per session of the current run, live or not, Kanri's first, rewritten
in place by Kanri at every boundary and plan close from the readings the
sessions send (`SKILL.md`, "The transcript reading"): a role's row from its
latest boundary or exit line, Kanri's own from the reading it takes at the
trigger check. Context holds the reading's fifth figure in the spelling the
reading itself prints, `context=<n>`, so that a sweep for that spelling finds
every place a reading lands. Kikaku sends no reading and its reading columns
stay blank: it is the human's own seat, and its cost is the human's own
pacing. A `queued` row's stay blank until its boundary, and one that never
ran moves to the archive as `stopped`, with its blanks. The last three columns
are Kanri's only — batches accepted,
plans closed, and compactions noticed by the session itself, cumulative since
its own start; a declined handover leaves Noticed incremented, so the count
stays a record, and a handover resets Kanri's row to the successor with zero
counts. A reading Kanri doubted and could not verify carries `(unverified)`
after its Compactions figure; when the session sent `transcript: unavailable`,
`—` stands in the four figure columns and `context=unavailable` in Context, so
that a `context=` sweep still finds the row. At the plan close every row whose session is stopped,
dead, or replaced moves to `roster-archive.md`, joined with its
status row above, and the archive's Context column across runs is the data any
later ceiling for the roles that only measure would be read from — Kanri's and
Jisso's come from `tanto.json`'s `ceiling` map, and issue-40ed's two halves
closed with decision-b6cb and with that map.

## Shoroku proposal items

Between plans there is no conductor ledger, so an item raised then — by a
Kikaku file belonging to no topic, by Kanri's own
between-plans exit, or by a close's further proposal file — is recorded here
with the same six columns the ledger uses. When a topic opens, Kanri moves
the rows into the new ledger's table; nothing is written out from this table
itself, so every row here says `no` until it moves.

Columns as the ledger's, with Source the file, report, or session that
raised it; Destination one of experience, design, decisions, issues, notes,
or reports; Adopted one of `pending`, `yes`, and `no`; and Written `no` or
the subject of the commit that wrote the row out. The placeholder row stays
until the first item arrives.

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
