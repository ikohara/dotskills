# Batch <X> report — tasks <N> to <M>

- Plan — <the plan's path>
- Plan commit — <the plan commit's subject line>
- Branch — <branch>, base <base commit subject>, head <head commit subject>
- SDD ledger — <.superpowers/sdd/<plan-basename>/progress.md>
- Transcript — <reading>
- Ceiling — <the ceiling line, ending `context=<n> <under|over>`>

## Tasks

| Task | Status | Commits | Fix rounds | Spec | Quality | Tests |
| --- | --- | --- | --- | --- | --- | --- |
| <N> | <complete, complete with parked findings, or kaiseki> | <sha7 plus subject, one entry per commit> | <0 to 5> | <pass or fail> | <pass or fail> | <what ran and the result> |

## Rulings

Every ruling made in this batch, in the order made.

- <what was decided> — <why> — <what it costs if wrong> — task <N>

## Deviations from the plan

- <what the plan said> — <what was done instead> — <why>

## Parked and deferred minors

- Task <N> parked — <the finding> — <the ruling that lets the code stand>
- Task <N> minor, deferred — <one line>

## Verification

- <the exact command run> — <the result>

## Shoroku proposal

<This section is this Jisso's shoroku proposal: the items this batch raised
that no file holds — a rejected alternative and its reason, a fact measured,
a defect noticed, an observation about the run — never a restatement of the
plan, the SDD ledger, or this report. Kanri records each as a `pending` row;
the close's recommender quotes it from here. Nothing else is written at
your exit.>

- <experience, design, decisions, issues, notes, or reports> — <one line on
  what is worth keeping and why>

## For Kanri

<One line on the state of the batch, then the two lists below.>

### Rulings needed

1. <the question> — <the cause, if it is known> — <what stays blocked until it
   is answered>; a correction this item proposes names its file, line, old
   text and new text here, never by a pointer to another section, so that a
   delegate told to read this subsection alone can make it

### Verify in the tree

- <what Kanri should check that this report cannot prove on its own>

## Questions for the human

<Only the four SDD stop classes and a scope or spec change belong here.
Numbered, one line each. This is the only section written in the human's
language.>

## Next

<One line — what the next batch should pick up, or "final batch, nothing
follows".>
