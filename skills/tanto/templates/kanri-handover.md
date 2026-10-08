# tanto Kanri handover

Written by the outgoing Kanri at `.tanto/kanri-handover.md`, next to the
roster and untracked under `.tanto/.gitignore`. The successor reads it, acts
on it, and deletes it. Everything not listed below is a pointer to the roster
and the ledgers, never a copy.

## Why

<The trigger that fired — the plan close, the human's word, a compaction noticed, or the ceiling crossed — and when.>

## In flight

One block per open ledger, in the order the topics opened, each under its
topic word; write "none — between plans, last plan closed <YYYY-MM-DD>" when
no topic is open. The line after the blocks is written once.

- <topic>
  - Plan — <the plan basename, or "not yet written">
  - Ledger — <.tanto/<topic>/kanri.md>
  - Batch state — <"batch <X> accepted, batch <Y> prompt not sent", or "at the
    spec or plan stage, no batches yet">
  - Branch — <the branch this topic's tree is on, and whether it has been
    merged>
- Agents of this session still running — <label and what it was to deliver,
  one per line, or "none">; lost with this session
- A shoki in flight — <`<topic>`, the worktree path, the time it was
  spawned — always after this topic's merge — and `shoroku ready: not yet
  arrived`, or "none">; the successor runs the landing checks on that line,
  fast-forwards `main`, takes shoki's reading and then writes the `rm`
  request, fills the ledger, and runs `usage.js close --topic <topic>`, the
  landing's last act
- A `close` not finished — <`<topic>`, its `to:` line, and its `send:` lines
  not yet sent, or its `feedback: held` line,
  `.tanto/<topic>/shoroku-feedback-held.md`, and the remedy offered the
  human — an edit, or `--release` on his word — with his answer if he
  gave one, or "none">; the successor sends the lines, or runs `close`
  again on that answer

## Live peers

Every `live` peer of every open topic, with its Topic as the roster carries
it; the successor answers the marked lines first and announces nothing. A
peer is its `sessionId`: the name beside it is the one the listing printed
when this file was written, and the successor reads the name again by the
`sessionId` at each send — `boundary.js seat` — waking a parked peer first.
Then the `queued` Jissos, which exist only under a plan that edits the tanto
skill, by `sessionId` and place — the successor sends them nothing;
their batch prompt is a path they read at their own wake-up.

- <role> — <topic> — <sessionId> — <name, as last read> — <running, or
  parked> — <what that session is waiting for> —
  <"answered", or the last line it sent that this session did not answer,
  which the successor answers first and which the ledger's Session events
  carry as an `unanswered:` line with no `answered:` pair>
- <topic> — <sessionId> — <name, as last read> — queued, <n>th of the plan's
  queue, one line per queued Jisso, in queue order; the successor sends none
  of them anything

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

## Reading

<One line: the reading taken when this handover was written. The successor
reads the roster by `boundary.js roster show`, never the file itself.>

## Next step

<One line — the successor's first act after `roster show` and the census, named as an act and not as a step order: the successor follows the role text it read, which may be newer than the one this file was written from.>

Of each ledger that In flight names, the successor reads four sections and no
more, with one call per ledger:
`node "$TANTO/scripts/passage-check.js" sections --file <ledger> Progress "Open questions for the human" "Session events" Measurements`
— the Session events by their tail.

## Not reconstructed

- <The ledger that holds the outgoing Kanri's exit rows as `pending`, by
  path, when a ledger was open at the exit; then a proposal item the
  outgoing Kanri could not classify or reconstruct, one line each, for the
  successor to raise at its first boundary. Write "none" when there is
  none.>

## Commands for the human

The successor is spawned; nothing is typed. A human attached to this Kanri
through `tanto` is taken to the successor by the launcher.
