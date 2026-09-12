# tanto Kanri handover

Written by the outgoing Kanri at `.tanto/kanri-handover.md`, next to the
roster and untracked under `.tanto/.gitignore`. The successor reads it, acts
on it, and deletes it. Everything not listed below is a pointer to the roster
and the ledgers, never a copy.

## Why

<The trigger that fired — the plan close, the human's word, or a compaction noticed — and when.>

## In flight

- Plan — <the plan basename, or "none">
- Ledger — <.tanto/<topic>/kanri.md, or "none">
- Batch state — <"batch <X> accepted, batch <Y> prompt not sent", or "between
  plans, last plan closed <YYYY-MM-DD>">
- Agents of this session still running — <label and what it was to deliver,
  one per line, or "none">; lost with this session

## Live peers

- <role> — <name> [<ref>] — <what that session is waiting for>

## Open questions for the human

- <The ledger section that holds them, by path and heading, plus anything not
  yet written there, one line each.>
- <A `compacted: <path>` line a peer sent that has no `confirmed:` answer yet,
  by path; the successor answers it at its first boundary.>

## Rulings the next batch inherits

- R-<n> — <the ruling, one line, copied verbatim as compaction insurance>; a
  ruling known only from a compaction summary is marked `(unverified)` on its
  line, and the successor puts it to the human at its first boundary
- Models the next prompt must restate — implementers on
  <the subagents.implementer family>, every review on <the subagents.reviewer
  family>, fix rounds 4-5 on <the subagents.escalation family>.

## Residency

Kanri's Residency row from the roster, verbatim, with its last reading.

| Role | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | <name> [<ref>] | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | <n> | <m> | <k> |

- The reading taken when this handover was written — <reading>

## Next step

<One line — the successor's first act after its cold read.>

## Not reconstructed

- <A shoroku candidate the outgoing Kanri could not classify or reconstruct at
  its exit, one line each, for the successor to raise at its first boundary.
  Write "none" when there is none.>

## Commands for the human

1. Open a new session in <repo path> and run `/tanto kanri`.
2. When the new Kanri asks, delete this session.
