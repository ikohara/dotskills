# tanto Kanri handover

Written by the outgoing Kanri at `.superpowers/sdd/kanri-handover.md`, next to
the roster and untracked under `.superpowers/sdd/.gitignore`. The successor
reads it, acts on it, and deletes it. Everything not listed below is a pointer
to the roster and the ledgers, never a copy.

## Why

<The trigger that fired — the human's word, or a compaction noticed — and when.>

## In flight

- Plan — <the plan basename, or "none">
- Ledger — <.superpowers/sdd/<plan-basename>/kanri.md, or "none">
- Batch state — <"batch <X> accepted, batch <Y> prompt not sent", or "between
  plans, last plan closed <YYYY-MM-DD>">

## Live peers

- <role> — <name> [<ref>] — <what that session is waiting for>

## Open questions for the human

- <The ledger section that holds them, by path and heading, plus anything not
  yet written there, one line each.>

## Rulings the next batch inherits

- R-<n> — <the ruling, one line, copied verbatim as compaction insurance>
- Models the next prompt must restate — implementers on
  <the subagents.implementer family>, every review on <the subagents.reviewer
  family>, fix rounds 4-5 on <the subagents.escalation family>.

## Residency

Kanri <name> [<ref>] since <YYYY-MM-DD>: <n> batches, <m> plans, <k> compactions noticed.

## Next step

<One line — the successor's first act after its cold read.>

## Not reconstructed

- <A shoroku candidate the outgoing Kanri could not classify or reconstruct at
  its exit, one line each, for the successor to raise at its first boundary.
  Write "none" when there is none.>

## Commands for the human

1. Open a new session in <repo path> and run `/tanto kanri`.
2. When the new Kanri asks, delete this session.
