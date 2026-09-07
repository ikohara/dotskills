# tanto roster

Kept by Kanri at `.superpowers/sdd/roster.md`. Kanri is the only writer.

## Keeping rule

- One row per role, Kanri's own row first.
- One live session per role. A second handshake for a role that already has a
  live row gets no row and is reported to the human.
- Every handshake rewrites that role's row in full.
- A row whose session is no longer listed by `ListAgents` gets status `dead`.
  Rows are never deleted, so the run stays readable after a replacement.
- This is the address book: one row per live role, Kanri's row first, the
  `Name [ref]` column being the address the row's session answers to, used as
  the bare name. It stays correct because nothing renames a session. The
  `[ref]` is load-bearing: it identifies a session across the listing, the
  roster, and the handover.
- Kanri dispatches nothing to a session that has no accepted row here.

| Role | Name [ref] | cwd | Model | Branch | Mode | Started | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | <name> [<ref>] | <absolute path> | <model id> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live |
| <role> | <name> [<ref>] | <absolute path> | <model id> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live |

Status is one of `live`, `dead`, `replaced`, `refused`. `refused` records a
handshake that got no row — a duplicate role, or a model that did not match
`sessions.<role>` — and is always followed by an Events line saying which.

## Residency

Kanri <name> [<ref>] since <YYYY-MM-DD>: <n> batches, <m> plans, <k> compactions noticed.

One line, rewritten in place by Kanri at every boundary and plan close, and the
only cross-plan counter the skill keeps. The counts are cumulative since this
Kanri's own start: `<n>` increments when Kanri accepts a batch, `<m>` when a
plan closes, `<k>` when Kanri notices a compaction. A declined handover leaves
`<k>` incremented, so the count stays a record. A handover resets the line to
the successor's name and date with zero counts.

## Shoroku candidates

Between plans there is no conductor ledger, so a candidate raised by a
between-plans triage, or by Kanri's own between-plans exit, is recorded here
with the same seven columns the ledger uses. When a topic opens, Kanri moves
the rows whose Written column says `no` into the new ledger's table and leaves
the written ones here as the record.

| S-n | Source | Candidate | Destination | Adopted | Stage | Written |
| --- | --- | --- | --- | --- | --- | --- |
| S-1 | <the triage, report, or session that raised it> | <one line> | <requirements, design, decisions, issues, notes, or reports> | <yes, no, or escalated> | <T0, T1, T2, or exit:<role>[-<suffix>]> | <no, or the subject of the commit that wrote the row out> |

## Events

- <YYYY-MM-DD HH:MM> — <one line: a handshake accepted, or refused and why; a
  session declared dead and what was verified; the conductor ledger moved from
  .superpowers/sdd/<topic>/ to .superpowers/sdd/<plan-basename>/; a VS Code
  restart and which roles were recreated; a handover written by <name> [<ref>];
  a handover accepted by <name> [<ref>] from <name> [<ref>]; an exit shoroku
  committed by <name> [<ref>], or not run and what was lost; a bug report
  received, or sent to <name> [<ref>]; a hotfix committed between plans>
