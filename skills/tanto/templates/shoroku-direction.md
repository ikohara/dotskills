# Shoroku direction — <topic>

Written by Kanri at the close, at `.tanto/<topic>/shoroku-direction.md`,
from the human's answer to the shoroku brief: the recommendation as the
human left it, with what the answer changed. Item numbers are the
recommendation's (`.tanto/<topic>/shoroku-recommendation.md`). Everything
not named under Overrides and notes is as recommended.
`boundary.js record --direction <this path> --ledger <the ledger>` reads
the Items section and writes each `S-n` line's `yes` or `no` into the
Adopted cell of that row; a line whose pointer is `(inbox …)` it prints and
writes nothing for.

## Overrides and notes

- <item number> — <group> — <what the human's answer changed, and why>
- <Merge, a Departure, the hotfixes since the previous plan — one line
  each, or none>

## Items

Each line: item number — group — Adopted (`yes` adopts or fixes it, `no`
does not) — pointer: `<topic> S-<n>` for a row of the topic's ledger, or
`(inbox <basename>)`, with ` #<m>` for one item of a file that carries
several, for an inbox or feedback item.

- <n> — <adopt, fix, reject, or unsure> — <yes or no> — <topic> S-<n>
- <n> — <adopt, fix, reject, or unsure> — <yes or no> — (inbox <basename>[ #<m>])

The line grammar is fixed: `- <n> — <group> — yes|no — <topic> S-<n>` or
`- <n> — <group> — yes|no — (inbox <basename>[ #<m>])`, one line per item,
nothing after the pointer.
