# tanto roster

Kept by Kanri at `.tanto/roster.md`. Kanri is the only writer.

## Keeping rule

- One row per role and topic, Kanri's own row first.
- One live session per role and topic; Kanri, Kikaku, and Hosa one each. A
  second handshake for a role and topic that already has a live row gets no
  row and is reported to the human.
- Every handshake rewrites that role's row in full. A handshake whose
  `transcript=` matches a row's Transcript column is that row's session
  resumed, and rewrites the row in place with the new name and `[ref]`, status
  `live`.
- A row whose session is no longer listed by `ListAgents` gets status `dead`.
  A dead, replaced, refused, or cleared row stays, with its Residency row,
  until the plan closes, then both move to `roster-archive.md` as one row, so
  the run stays readable after a replacement and the roster stays short.
- This is the address book: one row per live role and topic, Kanri's row
  first, the `Name [ref]` column being the address the row's session answers
  to, used as the bare name. It stays correct because nothing renames a
  session. The `[ref]` is load-bearing: it identifies a session across the
  listing, the roster, and the handover.
- Kanri dispatches nothing to a session that has no accepted row here.

| Role | Topic | Name [ref] | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> [<ref>] | <absolute path> | <model id> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path or unavailable> |
| <role> | <topic> | <name> [<ref>] | <absolute path> | <model id> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path or unavailable> |

Topic is the topic word Kanri's orders line gave that session, or `—` for
Kanri, Kikaku, Hosa, and a standalone Kaiseki. Effort is what the handshake's
`effort=` carried.

Status is one of `live`, `dead`, `replaced`, `refused`, and `cleared`.
`refused` records a handshake that got no row — a second live session for the
same role and topic, or a model that did not match `sessions.<role>` — and is
always followed by an Events line saying which; a second Sekkei or Keikaku
whose topic differs from the live one's is not a duplicate and gets its own
row. `cleared` records a Kikaku or Hosa row the human's `/clear` ended: a
handshake whose `transcript=` matches no row, or whose name is already here
with a different transcript, and whose role is Kikaku or Hosa, writes a new
row and marks the old one `cleared`.

## Residency

| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> [<ref>] | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | <n> | <m> | <k> |
| <role> | <topic> | <name> [<ref>] | <YYYY-MM-DD> | <boundary> | <n> | <n> | <n> | <n> | — | — | — |

One row per session of the current run, live or not, Kanri's first, rewritten
in place by Kanri at every boundary and plan close from the readings the
sessions send (`SKILL.md`, "The transcript reading"): a role's row from its
latest boundary or exit line, Kanri's own from the reading it takes at the
trigger check. The last three columns are Kanri's only — batches accepted,
plans closed, and compactions noticed by the session itself, cumulative since
its own start; a declined handover leaves Noticed incremented, so the count
stays a record, and a handover resets Kanri's row to the successor with zero
counts. A reading Kanri doubted and could not verify carries `(unverified)`
after its Compactions figure; `unavailable` stands in the four figures when
the session sent that. At the plan close every row whose session is dead,
replaced, refused, or cleared moves to `roster-archive.md`, joined with its
status row above, and it is the archive's rows across runs that a threshold
for replacing a peer will be read from (issue-40ed's other half; the handover
half closed with decision-b6cb, which made the plan close the ordinary
trigger).

## Shoroku candidates

Between plans there is no conductor ledger, so a candidate raised by a
between-plans triage, or by Kanri's own between-plans exit, is recorded here
with the same seven columns the ledger uses. When a topic opens, Kanri moves
the rows whose Written column says `no` into the new ledger's table and leaves
the written ones here as the record.

Columns as the ledger's, with Source the triage, report, or session that
raised it; Destination one of requirements, design, decisions, issues, notes,
or reports; Adopted one of `pending`, `yes`, and `no`; Stage the stage word —
`t0`, `t1`, `t2`, or `exit-<role>[-<suffix>]`; and Written `no` or the subject
of the commit that wrote the row out. The placeholder row stays until the
first candidate arrives.

| S-n | Source | Candidate | Destination | Adopted | Stage | Written |
| --- | --- | --- | --- | --- | --- | --- |
| (no candidate yet) | | | | | | |

## Events

At a plan close the closed plan's lines move to `roster-archive.md`, so this
list holds the current run.

- <YYYY-MM-DD HH:MM> — <one line: a handshake accepted, or refused and why; a
  session declared dead and what was verified; the plan landed and the SDD
  ledger's path recorded; a VS Code restart and which roles were recreated;
  resumed: <old name> → <new name>;
  cleared: <old name> → <new name>;
  a handover written by <name> [<ref>];
  a handover accepted by <name> [<ref>] from <name> [<ref>]; an exit shoroku
  committed by <name> [<ref>], or not run and what was lost; a bug report
  received, or sent to <name> [<ref>];
  decision: <path> received from <name>;
  a hotfix committed between plans>
