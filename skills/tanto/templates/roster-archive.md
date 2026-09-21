# tanto roster archive

Kept by Kanri at `.tanto/roster-archive.md`, next to the roster.
Kanri is the only writer, and writes it at a plan close: the rows of the roster
whose status is `stopped`, `dead`, `replaced`, `refused`, or `cleared` — a
`queued` row that never ran moves as `stopped` — each with its last Residency
reading, and the closed plan's Events lines move here, so that the roster
holds only the live run and this file holds the record across runs. Events
lines of a topic that ran concurrently, interleaved with the closed plan's,
move with them and sit under the closing plan's heading — so a topic's own
opening history may be filed under a sibling topic's heading, by design, not
by error. Nothing
is rewritten here; rows and lines are appended in the order they arrive.

## Sessions

| Role | Name [ref] | Model | Branch | Started | Ended | Status | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <role> | <name> [<ref>] | <model id> | <branch> | <YYYY-MM-DD> | <YYYY-MM-DD> | <stopped, dead, replaced, refused, or cleared> | <last boundary> | <n> | <n> | <n> | <n> | context=<n> | <n or —> | <m or —> | <k or —> |

An archive row is the roster's status row for that session joined with its
last Residency row; the Topic, cwd, Effort, Mode and Transcript columns are
dropped, Started keeps the date and drops the time, Ended is the date the
row's status changed. Transcript is dropped because the file it names is
local to one machine and outlives nothing; the plan close therefore runs
`reading.js --share` over those paths **before** this move, while they are
still in the roster. Context keeps the reading's `context=<n>` figure, and it
is the one column of this table a later design will be read from.

## Events

- <YYYY-MM-DD> <the roster's Events line, moved verbatim>
