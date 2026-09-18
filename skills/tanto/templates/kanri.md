# Conductor ledger — <topic>

Kept by Kanri. Sekkei, Keikaku, Jisso, Kaiseki, Kikaku, and Hosa read it;
none of them writes it. Lives at `.tanto/<topic>/kanri.md` from the topic's
opening to the plan's close, and never moves.

## Progress

<one line, rewritten in place: which batch is in flight or accepted, what is
being waited on, "handover written", or "closed"; plus, while one stands, the
clause `handover deferred (absent, context=<n>, since <batch X | the spec
stage | the plan stage>)`, kept
until that handover runs or the plan closes; or, once a
deferred handover's decline is recorded, `handover declined (present,
context=<n>, at <batch X | the spec stage | the plan stage>)` in its
place; and, for each pre-spec act ruled before Sekkei's spec — a diagnosis, a
dump analysis — the clause `<act> — result: <path> (absent | present)`,
rewritten to `present` when the file lands and dropped once the spec cites it>

## Plan

- Spec — <the spec's path, or "not yet written">
- Plan — <the plan's path, or "not yet written">
- Branch — <branch name; Sekkei cuts it from main when no batch is in flight,
  Keikaku after the merge otherwise>
- Topic directory — <.tanto/<topic>/>
- SDD ledger — <.superpowers/sdd/<plan-basename>/progress.md, written by Jisso>
- Hotfixes since the previous plan — <the hotfix lines copied from the roster's
  Events since the previous plan closed, one per line, or "none">

## Batches

Columns: Batch, the letter; Tasks, the plan's task numbers; State, one of
planned, sent, reported, accepted, or rework; Prompt and Report, the two file
names under `.tanto/<topic>/`; Verdict, one line — accepted, or what must
change. One row per batch, added as the batch is planned; the placeholder row
stays until the first one is.

| Batch | Tasks | State | Prompt | Report | Verdict |
| --- | --- | --- | --- | --- | --- |
| (no batch yet) | | | | | |

## Rulings

- R-1 — <the question> — <what was decided> — <what it costs if wrong> —
  inherited by <the tasks or batches whose dispatches carry it>

## Shoroku proposal items

Columns: S-n, the row id; Source, the file the item lives in and its place there — a report and its item, a proposal and its number, the spec and a section heading — so that the close's recommender can follow it;
Item, one line; Destination, one of requirements, design, decisions,
issues, notes, or reports; Adopted, one of `pending`, `yes`, and `no`; Stage,
the stage word — `t2` for every row of this table, whichever moment raised
it, since the close is the one stage that recommends a ledger's rows, and
`exit-<role>[-<suffix>]` names a proposal file, never a Stage value; Written,
`no` or the subject of the commit
that wrote the row out. The placeholder row stays until the first item
arrives.

| S-n | Source | Item | Destination | Adopted | Stage | Written |
| --- | --- | --- | --- | --- | --- | --- |
| (no item yet) | | | | | | |

Nothing is adopted here by a ruling. Every row arrives `pending` — from a
batch report's Shoroku proposal, a Kaiseki report's
`blocks this task: no` items, a review report, a session's exit proposal,
the spec's four sections, or a Kanri exit that fell while this ledger was
open — and stays `pending` until the close. At the close Kanri dispatches
the `shoroku.recommend` kind over Jisso's proposal and every source these
rows name, to write `t2-recommendation.md` and `t2-brief.md`; gives the
human both paths, the three counts, and the brief verbatim; and writes
`t2-direction.md` from the human's answer, and these rows with it, Adopted
`yes` or `no` as the direction says. No item is put to the human apart from
the rest and none is settled by Kanri alone: the human sees the whole list,
grouped, once, and answers by exception.

The close writes only the adopted rows whose Written column says `no`, and
fills that column with the commit subject; a row a Kanri exit recorded here is
written by this topic's close like any other. So nothing is written twice.

A reference to an `S-n` or an `R-n` from outside its own ledger — the roster, a
handover file, another ledger — names the topic first, `<topic> S-n`; bare
numbers stay bare inside a ledger. The Written column takes only a value a
filter can read: `no`, a commit subject, or `superseded: <topic> R-n`, the last
counting as written; an item two closes could claim is one row in the
ledger of the topic that raised it, never a compound value.

## Session events

- <YYYY-MM-DD HH:MM> — <a create request and the human's answer, a `release:`
  sent, a `queued: <n>` answered, a `no-role` received; a replace and the human's
  answer; a handshake accepted or refused; a session declared dead and what was
  verified; a recovery after a VS Code restart; a handover written or accepted;
  a bug report triaged and its outcome; an exit proposal form-checked and its
  rows recorded, or an exit shoroku not run and what was lost; a human access
  grant and the human-access: done line that
  closed it; a human-contact: line and what was said>

## Open questions for the human

1. <one line each, added when the request is made and removed when it is
   done: the four SDD stop classes, a scope or spec change, escalated
   shoroku items, and every other open act asked of the human — a `/clear`,
   a window to queue, an answer waited on — the idle block's own source for
   its `for you:` list. Everything else is a ruling.>

## Measurements

| What | When | Value |
| --- | --- | --- |
| top-family sessions active at once, the peak, and whether a 429 was seen | <YYYY-MM-DD, the plan close> | <the peak count, and yes or no for the 429> |
| top-family one-shots per plan, counted by kind | <YYYY-MM-DD, the plan close> | <one count per kind dispatched on the top family> |
| each role's last reading | <YYYY-MM-DD, the plan close> | <the roster's Residency figures, copied, one role per line> |
| the day's cost, uncached input, cache miss, cache hit, and hit rate | <YYYY-MM-DD> | <the five figures as the human pastes them from the Claude Code Usage extension> |
| Kanri's context at the topic's opening and at the plan's landing, then Kanri's at each boundary with the delta per batch, and each Jisso's at its own boundary | <YYYY-MM-DD, each check> | <opening: kanri context=<n>; landing: kanri context=<n> (+<d>); batch letter: kanri context=<n> (+<d>), jisso <name> context=<n>>, one entry per check |
| deferrals: where, the context, and the presence verdict | <YYYY-MM-DD, the check> | <batch letter or stage, context=<n>, last human turn <m> min ago>, one entry per deferred handover, or `none` |
| the share of usage at context over the threshold | <YYYY-MM-DD, the plan close> | <the share line, the names it ran over> |

These seven rows are fixed and always present. Kanri fills the first at the
plan close from this ledger's Session events, where it writes one line each
time a second top-family session goes live; the second by counting those same
events' one-shot lines by kind and not by stage, since one kind is dispatched
at several stages; the third by copying the roster's Residency rows; the
fourth from what the human pastes. The fifth is filled at the topic's opening
(Start step 5), at the plan's landing, and at every boundary from the two
readings of loop step 6; the sixth at any deferred handover, in whichever
stage, and carries `none` when a plan's Kanri never deferred; the seventh at
the plan close from `reading.js --share`, with the sessions it ran over and the
ones it skipped. The fifth and sixth are the record
behind a rule — the ceiling of `roles/kanri.md`'s trigger — and the other five
are the record the next measurement starts from.

A `paused: <dispatch> on <family> — resets <time>` line a role sends is
recorded as a row of its own: What the line as it arrived, When the date, and
Value the reset time Kanri told the human, joined by the
`continue: <dispatch> — same model` that ended the pause. Further rows are
added as they are measured.
