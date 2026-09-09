# Kaiseki <n> — task <N>

## Symptom

<What is wrong — what was expected, and what happened.>

## Reproduction

```console
<the exact command that reproduces it, run from the repo root>
```

<What it prints. If it could not be reproduced, say so here and say what was
tried. "Cannot reproduce" is still a report.>

## Root cause

<The mechanism, not the symptom. Name the file and the line, and show the
evidence that proves it — the instrumentation output, the failing assertion,
the bisect result.>

## Why the fix rounds missed it

<One or two lines — what the rounds were looking at, and why the real cause was
not visible from there.>

## Minimal fix

<A patch, or a precise description of one. The smallest change that removes the
root cause. You do not apply it; Jisso does.>

## Regression test

<What the test must assert, where it belongs, and why it fails before the fix
and passes after. Jisso writes it.>

## Other defects observed

- <the defect, one line> — blocks this task: yes
- <the defect, one line> — blocks this task: no

<Keep one bullet per defect, carrying the tag that applies, and delete the
example bullets that do not. An empty list is fine. Never leave an example
bullet standing.>

## Uncertainties

- <What is still unproven, and what would prove it.>

## Tree state on exit

- WIP commit — <the subject of the commit holding the failing state>
- Instrumentation — <removed, or "none added">
- `git status` — clean
- Transcript — <reading>

## Shoroku candidates

- <requirements, design, decisions, issues, notes, or reports> — <one line on
  what is worth keeping and why>
