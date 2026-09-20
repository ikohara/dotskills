# tanto Kanri handover

Written by the outgoing Kanri at `.tanto/kanri-handover.md`, next to the
roster and untracked under `.tanto/.gitignore`. The successor reads it, acts
on it, and deletes it. Everything not listed below is a pointer to the roster
and the ledgers, never a copy.

## Why

<The trigger that fired — the plan close, the human's word, or a compaction noticed — and when.>

## In flight

One block per open ledger, in the order the topics opened, each under its
topic word; write "none — between plans, last plan closed <YYYY-MM-DD>" when
no topic is open. The line after the blocks is written once.

- <topic>
  - Plan — <the plan basename, or "not yet written">
  - Ledger — <.tanto/<topic>/kanri.md>
  - Batch state — <"batch <X> accepted, batch <Y> prompt not sent", or "at the
    spec or plan stage, no batches yet">
  - Deferred — <the ledger's Progress clause, verbatim, when a handover
    stands deferred on the ceiling and the human's absence; "none"
    otherwise. The successor re-checks it at its own first check, where a
    `present` verdict runs what the outgoing session could not.>
- Agents of this session still running — <label and what it was to deliver,
  one per line, or "none">; lost with this session
- A close delegated to Hosa — <`<topic>`, Hosa's `<name> [<ref>]`, the
  `close:` line's paths and subject, and whether `close done:` has arrived,
  or "none">; the successor verifies the commit on `close done:` and fills
  the ledger

## Live peers

Every `live` peer of every open topic, with its Topic as the roster carries
it; the successor answers the marked lines first and announces nothing. Then
the `queued` Jissos, by name and place — the successor sends them nothing;
their batch prompt is a path they read at their own wake-up.

- <role> — <topic> — <name> [<ref>] — <what that session is waiting for> —
  <"answered", or the last line it sent that this session did not answer,
  which the successor answers first and which the ledger's Session events
  carry as an `unanswered:` line with no `answered:` pair>
- <topic> — <name> [<ref>] — queued: <n>, one line per queued Jisso, in
  queue order; the successor sends none of them anything

## Open questions for the human

- <The ledger section that holds them, by path and heading, plus anything not
  yet written there, one line each.>
- <A `compacted: <path>` line a peer sent that has no `confirmed:` answer yet,
  by path; the successor answers it at its first boundary.>

## Rulings the next batch inherits

- <One line: the ledger's Rulings section, by path and heading. A ruling known
  only from a compaction summary is marked `(unverified)` there, and the
  successor puts it to the human at its first boundary; a finding still
  undecided because the dispatch that raised it returned on this handover's
  own wake-up names that dispatch and its report's path.>
- Models the next prompt must restate — the task implementation on
  `task.implement` (sonnet, `subagent_type: tanto-task-implement`); the
  per-task reviews on `task.review-spec` and `task.review-quality` (opus,
  `subagent_type: tanto-task-review-spec` and
  `subagent_type: tanto-task-review-quality`); fix rounds 4-5 on
  `task.escalate` (opus, `subagent_type: tanto-task-escalate`).

## Residency

<One line: Kanri's Residency row in `.tanto/roster.md`, by heading, and the
reading taken when this handover was written.>

## Next step

<One line — the successor's first act after its cold read.>

## Not reconstructed

- <The ledger that holds the outgoing Kanri's exit rows as `pending`, by
  path, when a ledger was open at the exit; then a proposal item the
  outgoing Kanri could not classify or reconstruct, one line each, for the
  successor to raise at its first boundary. Write "none" when there is
  none.>

## Commands for the human

1. /clear this window.
2. /model <family> and /effort <level>, as `sessions.kanri` says; /clear
   keeps the model and resets the effort.
3. /tanto kanri
