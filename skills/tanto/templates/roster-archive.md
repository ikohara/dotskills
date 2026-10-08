# tanto roster archive

Kept at `.tanto/roster-archive.md`, next to the roster, and written by
`boundary.js archive` alone, at a plan close: every roster row whose status
is `stopped`, `dead`, or `replaced` — a `queued` row that never ran moves
as `stopped` — copied whole, and the closed plan's Events lines, verbatim,
so that the roster holds only the live run and this file holds the record
across runs. Events lines of a topic that ran concurrently, interleaved
with the closed plan's, move with them and sit under the closing plan's
heading — so a topic's own opening history may be filed under a sibling
topic's heading, by design, not by error. Nothing is rewritten here; rows
and lines are appended in the order they arrive.

## Sessions

| Role | Topic | Name | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed | Ended |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <role> | <topic> | <name> | <absolute path> | <family> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | <stopped, dead, or replaced> | <absolute path or <sessionId>.jsonl> | <last reading's label> | <n> | <n> | <n> | <n> | context=<n> | <n or —> | <m or —> | <k or —> | <YYYY-MM-DD> |

An archive row is the roster's row for that session copied whole — its
last reading among its cells, nothing joined and nothing dropped — and
Ended the date of the move. Context keeps the reading's `context=<n>`
figure, and it is the one column of this table a later design will be read
from. An archive in an older shape — the fifteen and sixteen columns of
2026-09 — is brought to this one by `boundary.js migrate`, each table
under `## Sessions` in place, its Topic, cwd, Effort, Mode, and Transcript
cells `—`; a closed plan's own section stays as it was written.

## Events

- <YYYY-MM-DD> <the roster's Events line, moved verbatim>
