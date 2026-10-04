# tanto roster

Kept by Kanri at `.tanto/roster.md`. Kanri is the only writer.

## Keeping rule

- One row per seat, Kanri's own row first. A tab seat's row is written from
  its handshake; a terminal seat's is written from the spawner's result
  file, by `boundary.js record --seat <results path>` for a Jisso and by
  Kanri's own hand for a Keikaku or a Kanri successor. A row that does not
  exist yet while its seat is already working is not an error: the address
  is not needed until Kanri sends to it.
- One live session per role and topic; Kanri, Kikaku, and Hosa one each. A
  second handshake for a role and topic that already has a live row gets no
  row and is reported to the human. A plan that edits the tanto skill has
  all its Jissos spawned at its landing and their rows `queued`; every other
  plan has one Jisso at a time, spawned per batch.
- A `renamed` mark in the spawner's `seats.json` — a known `sessionId` under
  a new name — is Kanri's to reconcile: rewrite the row's Name column, write
  the Events line `resumed: <old name> → <new name>`, and clear the mark
  with an `ack` request. A tab seat the editor resumed is renamed the same
  way by Kanri's census, which finds its `sessionId` under the new name;
  nothing is typed in the tab.
- Every handshake rewrites that role's row in full. A handshake whose
  `sessionId` — the basename of its `transcript=` — is a row's Transcript
  basename is that row's session resumed, and rewrites the row in place with
  the new name and `[ref]`, its status unchanged.
- A row whose session has gone gets status `dead`: a `live` row whose
  `sessionId` the census does not list — a closed tab, a crash, a
  `/clear`ed window, whose session is no longer the one listed, a terminal
  seat whose process was collected — except while a restart is being
  recovered. A `queued` row the census does not list stays `queued`, since
  the send of its prompt resumes it, and a terminal seat's `dead` row whose
  transcript is on disk goes `live` again when a line due to it resumes it.
  A stopped, dead, replaced, refused, or
  cleared row stays, with its Residency row, until the plan closes, then
  both move to `roster-archive.md` as one row, so the run stays readable
  after a replacement and the roster stays short.
- This is the address book: one row per seat, Kanri's row first, the
  `Name [ref]` column being the address the row's session answers to, used
  as the bare name, and Kanri sends only to `live` rows. It stays correct
  because Kanri rewrites the Name column at every rename the census or a
  handshake shows, and a `/clear` keeps the name. The
  `[ref]` is load-bearing: it identifies a window across the listing, the
  roster, and the handover.
- Kanri sends only to `live` rows, and dispatches nothing to a session that
  has no accepted row here.

| Role | Topic | Name [ref] | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> [<ref>] | <absolute path> | <model id> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path, <sessionId>.jsonl, or unavailable> |
| <role> | <topic> | <name> [<ref>] | <absolute path> | <model id> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path, <sessionId>.jsonl, or unavailable> |

Topic is the topic word Kanri's orders line gave that session — for a Jisso,
the topic whose queue its handshake joined: the plan whose batches are in
flight, or, with none in flight, the plan whose landing requested the queue
— or `—` for Kanri, Kikaku, Hosa, and a standalone Kaiseki. Effort is what
the handshake's `effort=` carried.

The status words are seven: `queued`, `live`, `stopped`, `cleared`,
`replaced`, `dead`, and `refused`. A `live` cell may carry the suffix
`(idle since <HH:MM>)`, which Kanri appends while a Kikaku, Hosa, or Kaiseki
idles and the intake's address rule reads, or the suffix
`(blocked since <HH:MM>)`, which Kanri appends when the census's Listed line
for the seat carries `— blocked` and removes when a later census's does
not. The blocked suffix records the last census that saw the seat blocked,
not its state now — the census runs at the moments Kanri's role names, so
the cell can lag the seat by a batch — and names no cause. Either way a
reader tests the cell's first word, not the whole cell. `queued` is a Jisso
of a skill-editing plan waiting for its batch prompt, in spawn order.
`stopped` is a terminal seat
the spawner stopped on Kanri's request or the spawner's guard stopped, its
conversation kept, or a `queued` row that never ran. `cleared` records a
tab seat Kanri released — `release:` sent, the row marked as the line goes
out — or whose `/clear` a `no-role` reply to a line Kanri sent revealed;
whichever of that reply and the census sees a `/clear` first sets the
status. `dead` is a session the census no longer lists — for a terminal seat whose transcript is on disk, not final: a resume puts it back to `live`. `replaced` is the old row of a Kanri
that handed over. `refused` records a handshake that got no row — a second
live session for the same role and topic, or a model that did not match
`sessions.<role>` — and is always followed by an Events line saying which; a
second Sekkei or Keikaku whose topic differs from the live one's is not a
duplicate and gets its own row.

## Residency

| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> [<ref>] | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | context=<n> | <n> | <m> | <k> |
| <role> | <topic> | <name> [<ref>] | <YYYY-MM-DD> | <boundary> | <n> | <n> | <n> | <n> | context=<n> | — | — | — |

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
dead, replaced, refused, or cleared moves to `roster-archive.md`, joined with its
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

- <YYYY-MM-DD HH:MM> — <one line: a handshake accepted, or refused and why; a
  session declared dead and what was verified; the plan landed and the SDD
  ledger's path recorded; a VS Code restart and which roles were recreated;
  recovery: begun; recovery: windows back;
  resumed: <old name> → <new name>;
  queued: <name> [<ref>] as Jisso <n> of <topic>;
  released: <name> [<ref>] — <role>, <what it left on disk>;
  no-role from <name> [<ref>] — <what was lost>;
  a seat the spawner's guard stopped, and its worktree's branch;
  a handover written by <name> [<ref>];
  a handover accepted by <name> [<ref>] from <name> [<ref>]; a shoroku
  proposal written by <name> [<ref>], or not written and what was lost;
  an inbox sweep: its three files and its commit subjects;
  decision: <path> received from <name>;
  a hotfix committed between plans>
