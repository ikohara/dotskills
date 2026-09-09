# tanto roster archive

Kept by Kanri at `.superpowers/sdd/roster-archive.md`, next to the roster.
Kanri is the only writer, and writes it at a plan close: the roster rows whose
status is `dead`, `replaced`, or `refused`, each with its last Residency
reading, and the closed plan's Events lines move here, so that the roster
holds only the live run and this file holds the record across runs. Nothing
is rewritten here; rows and lines are appended in the order they arrive.

## Sessions

| Role | Name [ref] | Model | Branch | Started | Ended | Status | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <role> | <name> [<ref>] | <model id> | <branch> | <YYYY-MM-DD> | <YYYY-MM-DD> | <dead, replaced, or refused> | <last boundary> | <n> | <n> | <n> | <n> | <n or —> | <m or —> | <k or —> |

An archive row is the roster's status row for that session joined with its
last Residency row; the cwd and Mode columns are dropped, Ended is the date
the row's status changed.

## Events

- <YYYY-MM-DD> <the roster's Events line, moved verbatim>
