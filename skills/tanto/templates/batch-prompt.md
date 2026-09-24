# Batch <key> — tasks <N> to <M> — Jisso <n> of this plan

<!-- Sent as the one line `batch: <path>` naming this file. The file carries no
`no-role` line of its own, because a file a line points at is not a message.
`<key>` is the batch's letter — `fixwave` in the fix wave's paths — or, for a
batch returned for rework, `<X>-rework-<n>`: a rework's prompt, report, and
verdict are new files beside the first pass's, and the tasks in this title
are the ones it runs again. -->

Guard — this prompt belongs to the tanto workspace `.tanto/<topic>/` in
`<repo path>` on branch `<branch>`. If that is not your workspace or your
branch, reply `not me` to the roster's first data
row, read at that moment, and stop. No name binds it: the seat that reads
this file is the one the request that named it created.

## Previous batch verdict

<The render writes this first line: the boundary's `check:` line, verbatim,
then the report's For Kanri section, one line per point.>
<Kanri fills — the ruling line: what was accepted, what was returned for
rework and why. For the first batch, write "First batch, no previous
verdict, no check: line.">
<!-- The deferral line is gone with the presence gate: a handover that is due
runs at the boundary that found it, and its successor is spawned. -->

## What changes in this batch

<One line per point: rulings made since the last prompt, plan or spec edits and
where they are, anything the previous batch parked that these tasks touch.>

## Setup on resume

- Plan — <the plan's path>
- Spec — <the spec's path>
- SDD ledger — <.superpowers/sdd/<plan-basename>/progress.md>
- Conductor ledger, read only — <.tanto/<topic>/kanri.md>
- Kanri — <name> [<ref>]
- Branch — <branch>, base is the commit with subject <commit subject>
- Jisso — <"the first of this plan: run Start steps 1 to 4, the pre-flight
  scan included", or "the <n>th of this plan: run Start steps 1 to 3, resume
  `progress.md` through `sdd-workspace`, and start at task <N> — no scan", or,
  for the fix wave, "the fix wave's: run Start steps 1 to 3, reading the plan
  and the spec only where a finding cites them — the findings arrive
  diagnosed, and this prompt's fix section is the brief";
  after a Jisso gone mid-batch, the second form's "start at task <N>" is
  replaced, not joined, by "resume batch <X> from task <N>", naming the
  batch the departed Jisso left mid-run rather than a new one>

## Rulings to carry into dispatches

Two slots in this file read `<Kanri fills>` in the rendered draft and are
filled by Kanri after it rules: the Previous batch verdict's ruling line and
the first line below.

- <Kanri fills — the first ruling line: R-<n> — <the ruling, one line> — applies to tasks <N and M>>
- Models, restated here so they survive compaction — the task implementation
  on `task.implement` (sonnet, `subagent_type: tanto-task-implement`); the
  per-task reviews on `task.review-spec` and `task.review-quality` (opus,
  `subagent_type: tanto-task-review-spec` and
  `subagent_type: tanto-task-review-quality`); fix rounds 4-5 on
  `task.escalate` (opus, `subagent_type: tanto-task-escalate`). Every dispatch
  names its model. None omits it.
- No worktree. Kanri directive, human-approved — work in this tree on
  <branch>.
- Stop at this batch boundary and idle. Continuous execution across batches is
  overridden here; the boundary is Kanri's ruling and lifecycle checkpoint.
- Human access: none unless granted. What needs the human's eyes or hands goes
  to Kanri as `human-needed:` first; idle until the answer.

## Execute

Execute tasks <N> to <M>, then stop. Do not start task <M plus 1>. At the
boundary, write the report and go idle.

## Report

Write `.tanto/<topic>/batch-<key>-report.md` from the tanto skill's
`templates/batch-report.md`, then send the roster's first data row, read at
that moment, one line with its
path. Kanri reads these sections first, in this order — For Kanri, Rulings,
Questions for the human, Deviations from the plan.
