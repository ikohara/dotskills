# tanto roster

Kept by Kanri at `.tanto/roster.md`. Kanri is the only writer.

## Keeping rule

- One row per session that handshook, Kanri's own row first — a plan's
  queued Jissos each have one.
- One live session per role and topic, the plan's other Jissos `queued`;
  Kanri, Kikaku, and Hosa one each. A second handshake for a role and topic
  that already has a live row gets no row and is reported to the human; a
  Jisso handshake while one is live is queued, not refused.
- Every handshake rewrites that role's row in full. A handshake whose
  `transcript=` matches a row's Transcript column is that row's session
  resumed, and rewrites the row in place with the new name and `[ref]`, its
  status unchanged. A handshake whose name is on a `live` or `queued` row
  with a different transcript is that window `/clear`ed and re-invoked, in
  any role: the old row goes `cleared`, and a new row is written.
- A row whose session is no longer listed by `ListAgents` gets status `dead`
  — a closed tab, a crash, an editor restart before `/tanto fukki`; a
  cleared window stays listed under its name, so this never detects a
  `/clear`. A dead, replaced, refused, or cleared row stays, with its
  Residency row, until the plan closes, then both move to
  `roster-archive.md` as one row, so the run stays readable after a
  replacement and the roster stays short.
- This is the address book: one row per session, Kanri's row first, the
  `Name [ref]` column being the address the row's session answers to, used
  as the bare name, and Kanri sends only to `live` rows. It stays correct
  because nothing renames a session, and a `/clear` keeps the name. The
  `[ref]` is load-bearing: it identifies a window across the listing, the
  roster, and the handover.
- Kanri sends only to `live` rows, and dispatches nothing to a session that
  has no accepted row here.

| Role | Topic | Name [ref] | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> [<ref>] | <absolute path> | <model id> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path or unavailable> |
| <role> | <topic> | <name> [<ref>] | <absolute path> | <model id> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path or unavailable> |

Topic is the topic word Kanri's orders line gave that session — for a Jisso,
the topic whose queue its handshake joined: the plan whose batches are in
flight, or, with none in flight, the plan whose landing requested the queue
— or `—` for Kanri, Kikaku, Hosa, and a standalone Kaiseki. Effort is what
the handshake's `effort=` carried.

Status is one of `queued`, `live`, `cleared`, `replaced`, `dead`, and
`refused`; a `live` cell may carry the suffix `(idle since <HH:MM>)`, which
Kanri writes while a Kikaku, Hosa, or Kaiseki idles and the intake's
address rule reads, so a reader tests the cell's first word, not the whole
cell. `queued` is a Jisso waiting for its batch prompt, in handshake
order. `cleared` records a window Kanri released — `release:` sent, the row
marked as the line goes out — or whose `/clear` came to light another way: a
handshake under a name already here with a different transcript, in any
role, or a `no-role` reply to a line Kanri sent. `replaced` is the old row
of a Kanri that handed over. `refused` records a handshake that got no row —
a second live session for the same role and topic, or a model that did not
match `sessions.<role>` — and is always followed by an Events line saying
which; a second Sekkei or Keikaku whose topic differs from the live one's is
not a duplicate and gets its own row.

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
pacing. A queued Jisso's stay blank until its boundary, and a queued row
that never ran moves to the archive with its blanks. The last three columns
are Kanri's only — batches accepted,
plans closed, and compactions noticed by the session itself, cumulative since
its own start; a declined handover leaves Noticed incremented, so the count
stays a record, and a handover resets Kanri's row to the successor with zero
counts. A reading Kanri doubted and could not verify carries `(unverified)`
after its Compactions figure; when the session sent `transcript: unavailable`,
`—` stands in the four figure columns and `context=unavailable` in Context, so
that a `context=` sweep still finds the row. At the plan close every row whose session is dead,
replaced, refused, or cleared moves to `roster-archive.md`, joined with its
status row above, and the archive's Context column across runs is the data any
later ceiling for the roles that only measure would be read from — Kanri's and
Jisso's come from `tanto.json`'s `ceiling` map, and issue-40ed's two halves
closed with decision-b6cb and with that map.

## Shoroku proposal items

Between plans there is no conductor ledger, so an item raised then — by a
Kikaku file belonging to no topic, by Kanri's own
between-plans exit, or by a close's `-2-proposal.md` — is recorded here with
the same seven columns the ledger uses. When a topic opens, Kanri moves the
rows into the new ledger's table; nothing is written out from this table
itself, so every row here says `no` until it moves.

Columns as the ledger's, with Source the file, report, or session that
raised it; Destination one of requirements, design, decisions, issues, notes,
or reports; Adopted one of `pending`, `yes`, and `no`; Stage the stage word
`t2` for every row, the close of the topic the row moves into being what
recommends it; and Written `no` or the subject of the commit that wrote the
row out. The placeholder row stays until the first item arrives.

| S-n | Source | Item | Destination | Adopted | Stage | Written |
| --- | --- | --- | --- | --- | --- | --- |
| (no item yet) | | | | | | |

## Events

At a plan close the closed plan's lines move to `roster-archive.md`, so this
list holds the current run.

- <YYYY-MM-DD HH:MM> — <one line: a handshake accepted, or refused and why; a
  session declared dead and what was verified; the plan landed and the SDD
  ledger's path recorded; a VS Code restart and which roles were recreated;
  resumed: <old name> → <new name>;
  cleared: <old name> → <new name>;
  queued: <name> [<ref>] as Jisso <n> of <topic>;
  released: <name> [<ref>] — <role>, <what it left on disk>;
  no-role from <name> [<ref>] — <what was lost>;
  a handover written by <name> [<ref>];
  a handover accepted by <name> [<ref>] from <name> [<ref>]; an exit shoroku
  proposed by <name> [<ref>], or not run and what was lost;
  an inbox sweep: its three files and its commit subjects;
  decision: <path> received from <name>;
  a hotfix committed between plans>
