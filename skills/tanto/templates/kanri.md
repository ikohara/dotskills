# Conductor ledger — <topic>

Kept by Kanri. Sekkei, Keikaku, Jisso, Kaiseki, Kikaku, and Hosa read it;
none of them writes it. Lives at `.tanto/<topic>/kanri.md` from the topic's
opening to the plan's close, and never moves.

## Progress

<one line, rewritten in place: which batch is in flight or accepted, what is
being waited on, "handover written", or "closed"; plus, while one stands, the
clause `handover deferred (absent, context=<n>, since <batch X | the spec
stage | the plan stage>)` or
`Jisso replacement deferred (absent, context=<n>, since batch <X>)`, kept
until that handover or replacement runs or the plan closes>

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

## Shoroku candidates

Columns: S-n, the row id; Source, the report or session that raised it;
Candidate, one line; Destination, one of requirements, design, decisions,
issues, notes, or reports; Adopted, one of `pending`, `yes`, and `no`; Stage,
the stage word — `t0`, `t1`, `t2`, or `exit-<role>[-<suffix>]`, as in
`exit-jisso-B`, `exit-sekkei`, `exit-kaiseki-1`, and
`exit-kanri-<YYYY-MM-DD>-<name>`; Written, `no` or the subject of the commit
that wrote the row out. The placeholder row stays until the first candidate
arrives.

| S-n | Source | Candidate | Destination | Adopted | Stage | Written |
| --- | --- | --- | --- | --- | --- | --- |
| (no candidate yet) | | | | | | |

Nothing is adopted here by a ruling. A candidate copied in at a boundary —
from a batch report's Shoroku candidates, a Kaiseki report's
`blocks this task: no` items, or a review report — arrives with Adopted
`pending` and Stage `t2`, and stays `pending` until the stage that recommends
it. At every stage Kanri dispatches the `shoroku` kind to write
`<stage>-recommendation.md`, which lists every item once in three groups —
recommended adopt, recommended reject, unsure; tells the human that path, the
three counts, and the items themselves as a numbered list in the chat's
language; and writes `<stage>-direction.md` from the human's answer,
and these rows with it, Adopted `yes` or `no` as the direction says and Stage
the stage word. No item is put to the human apart from the rest and none is
settled by Kanri alone: the human sees the whole list, grouped, and answers by
exception.

Every write-out, T2 included, writes only the adopted rows whose Written column
says `no`, and fills that column with the commit subject. So nothing is written
twice, and T2 keeps everything adopted but not yet written.

A reference to an `S-n` or an `R-n` from outside its own ledger — the roster, a
handover file, another ledger — names the topic first, `<topic> S-n`; bare
numbers stay bare inside a ledger. The Written column takes only a value a
filter can read: `no`, a commit subject, or `superseded: <topic> R-n`, the last
counting as written; a candidate with two stages is split into two rows when
the second stage is identified, never written as a compound value.

## Session events

- <YYYY-MM-DD HH:MM> — <a create, replace, or delete request and the human's
  answer; a handshake accepted or refused; a session declared dead and what was
  verified; a recovery after a VS Code restart; a handover written or accepted;
  a bug report triaged and its outcome; an exit shoroku committed, or not run
  and what was lost; a human access grant and the human-access: done line that
  closed it; a human-contact: line and what was said>

## Open questions for the human

1. <one line each. Only the four SDD stop classes, a scope or spec change, and
   escalated shoroku items belong here. Everything else is a ruling.>

## Measurements

| What | When | Value |
| --- | --- | --- |
| top-family sessions active at once, the peak, and whether a 429 was seen | <YYYY-MM-DD, the plan close> | <the peak count, and yes or no for the 429> |
| top-family one-shots per plan, counted by kind | <YYYY-MM-DD, the plan close> | <one count per kind dispatched on the top family> |
| each role's last reading | <YYYY-MM-DD, the plan close> | <the roster's Residency figures, copied, one role per line> |
| the day's cost, uncached input, cache miss, cache hit, and hit rate | <YYYY-MM-DD> | <the five figures as the human pastes them from the Claude Code Usage extension> |
| Kanri's context at the topic's opening and at the plan's landing, then Kanri's and Jisso's at each boundary, with the delta per batch | <YYYY-MM-DD, each check> | <opening: kanri context=<n>; landing: kanri context=<n> (+<d>); batch letter: kanri context=<n> (+<d>), jisso context=<n> (+<d>)>, one entry per check |
| deferrals: where, the role, the context, and the presence verdict | <YYYY-MM-DD, the check> | <batch letter or stage, kanri or jisso, context=<n>, last human turn <m> min ago>, one entry per deferral, or `none` |
| the share of usage at context over the threshold, proxy and Account & Usage | <YYYY-MM-DD, the plan close> | <the share line, the names it ran over, and the human's figure or blank> |

These seven rows are fixed and always present. Kanri fills the first at the
plan close from this ledger's Session events, where it writes one line each
time a third top-family session goes live; the second by counting those same
events' one-shot lines by kind and not by stage, since one kind is dispatched
at several stages; the third by copying the roster's Residency rows; the
fourth from what the human pastes. The fifth is filled at the topic's opening
(Start step 5), at the plan's landing, and at every boundary from the two
readings of loop step 6; the sixth at any deferral, in whichever stage, and
carries `none` when a plan's Kanri and Jisso never deferred; the seventh at
the plan close from `reading.js --share`, with the sessions it ran over, the
ones it skipped, and the figure the human read from the Account & Usage view,
or a blank where the human did not answer. The fifth and sixth are the record
behind a rule — the ceiling of `roles/kanri.md`'s trigger — and the other five
are the record the next measurement starts from.

A `paused: <dispatch> on <family> — resets <time>` line a role sends is
recorded as a row of its own: What the line as it arrived, When the date, and
Value the reset time Kanri told the human, joined by the
`continue: <dispatch> — same model` that ended the pause. Further rows are
added as they are measured.
