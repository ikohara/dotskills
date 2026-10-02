---
id: "65e4"
title: "`record --seat` matches a roster row by its Name string and appends a duplicate"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-10-03
---

Source: shoroku bg-seat-ergonomics S-30

Also from the same ledger's S-35 (the first exit-kanri proposal's item 2) and
S-63. The ledger assigned S-30 and S-35 twice each; these are the rows whose
sources are `batch-A-verdict.md` and that exit-kanri proposal.

`skills/tanto/scripts/boundary.js`'s `writeSeatRow` matches a roster row by
`cells(line)[2] === seat.name`. A seat result file's `name` is the session's
raw, pre-rename name, while the roster's row carries the name the session
went by later, so the match fails and `record --seat` appends a second row
for the same live session — same transcript path, cwd, model, branch, and
mode, differing only in Name and Started. Both rows read `live`, so a reader
or a census of the Sessions table can double-count one seat.

Four reproductions in one plan's run (bg-seat-ergonomics), each removed by
hand:

- **Batch A's boundary.** A spawn result's `name` (`/tanto jisso
  queue=bg-seat-ergonomics`, the raw invocation prompt) against the roster's
  `bg-seat-ergonomics bash invocation [e92e99]`.
- **Batch B's boundary.** The same defect on a `resume` result rather than a
  `spawn`'s.
- **A Kanri's handover acceptance.** Found by the census: a duplicate named
  `bg-seat-ergonomics read invoke`, Transcript `unavailable`.
- **Batch D's boundary.** Inside the `boundary.verify` subagent's own
  `record` call: a duplicate named `bg-seat-ergonomics bash glob`.

Four occurrences is no longer an isolated glitch. The fix: key the match on
the seat result file's own `sessionId` — which `record --seat`'s caller
already has — against the row's Transcript basename, not on the raw `name`;
with a test whose fixture renames the session between the spawn and the
record.

**2026-09-24, `bg-seat-fixes` — a fourth-plus instance, on a second topic**
(shoroku bg-seat-fixes S-30). A resumed and renamed Jisso left a second
roster row under its pre-rename placeholder name, `live`, beside its
correct, already-`stopped` row under its renamed identity. Found and removed
by hand at a routine census pass, not at a boundary. The defect has now
recurred across two topics (`bg-seat-ergonomics`, `bg-seat-fixes`) and
several Kanri tenures within each: severity `medium`, and the fix scheduled
rather than noted again.

Merged into issue-dfb3 (tanto-issue-triage, 2026-10-03).
