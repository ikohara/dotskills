# Kaiseki brief <n> — task <N>

Written by Kanri at `.tanto/<topic>/kaiseki-<n>-brief.md`.
Read it first, then start.

## Symptom

<What is wrong, in one or two lines — what was expected, and what happened.>

## Reproduction

```console
<the exact command, copy-pasteable, run from the repo root>
```

<What that command prints when it fails.>

## Task

- Task number — <N>
- Batch report — <.tanto/<topic>/batch-<key>-report.md>
- SDD ledger — <.superpowers/sdd/<plan-basename>/progress.md>
- WIP commit — <the subject of the commit holding the failing state>
- Branch — <branch>

## Human access

<granted — the debugging conversation in this window — until the report is
written; or none, and why. Anything beyond it is a `human-needed:` line to
Kanri first.>

## What the fix rounds tried

1. Round <r> — <what was changed> — <what the re-review still found open>

## Report

Write `.tanto/<topic>/kaiseki-<n>.md` from the tanto skill's
`templates/kaiseki-report.md`, then send the roster's first data row, read at
that moment, one line with its path.
