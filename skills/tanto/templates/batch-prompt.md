# Batch <X> — tasks <N> to <M>

Guard — this prompt belongs to the tanto workspace `.tanto/<topic>/` in
`<repo path>` on branch `<branch>`. If that is not your workspace, reply
`not me` to `<kanri-address>` and stop.

## Previous batch verdict

<One line per point: what Kanri verified in the tree, what was accepted, what
was returned for rework and why. For the first batch, write "First batch, no
previous verdict.">
<When a deferral stands at this boundary, one further line, verbatim — both
when both stand:
"Kanri's handover is deferred since <batch X | the spec stage | the plan
stage> — the ceiling is crossed and the human is absent; this batch runs under
the same Kanri", and
"Your replacement is deferred since batch <X> — your ceiling is crossed and
the human is absent; run this batch and report as usual".>

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
- <Only after a replacement: "resume batch <X> from task <N>". Otherwise drop
  this line.>

## Rulings to carry into dispatches

- R-<n> — <the ruling, one line> — applies to tasks <N and M>
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

Write `.tanto/<topic>/batch-<X>-report.md` from the tanto skill's
`templates/batch-report.md`, then send `<kanri-address>` one line with its
path. Kanri reads these sections first, in this order — For Kanri, Rulings,
Questions for the human, Deviations from the plan.
