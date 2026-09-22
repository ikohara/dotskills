# Conductor ledger — <topic>

Kept by Kanri. Sekkei, Keikaku, Jisso, Kaiseki, Kikaku, and Hosa read it;
none of them writes it. The `boundary.verify` subagent Kanri dispatches at a
boundary writes it as Kanri's hand, through `boundary.js record`, and writes
nothing else. Lives at `.tanto/<topic>/kanri.md` from the topic's opening to
the plan's close, and never moves.

## Progress

<one line, rewritten in place: which batch is in flight or accepted, what is
being waited on, "handover written", "spawner results moved", or "closed";
and, for each pre-spec act ruled before Sekkei's spec — a diagnosis, a
dump analysis — the clause `<act> — result: <path> (absent | present)`,
rewritten to `present` when the file lands and dropped once the spec cites it>

## Plan

- Spec — <the spec's path, or "not yet written">
- Plan — <the plan's path, or "not yet written">
- Branch — <branch name; Kanri cuts it from main at the topic's opening when
  no batch is in flight, and right after the predecessor's merge otherwise>
- Topic directory — <.tanto/<topic>/>
- SDD ledger — <.superpowers/sdd/<plan-basename>/progress.md, written by Jisso>
- Hotfixes since the previous plan — <the hotfix lines copied from the roster's
  Events since the previous plan closed, one per line, or "none">

## Batches

Columns: Batch, the letter; Tasks, the plan's task numbers; State, one of
planned, reported, accepted, or rework; Prompt and Report, the two file
names under `.tanto/<topic>/`; Verdict, one line — accepted, or what must
change. One row per batch, added as the batch is planned; the placeholder row
stays until the first one is.

The boundary-verify brief writes a next batch's row as `planned` once it has
rendered that batch's prompt file, because rendering is not sending; no
`record` call ever writes a row `sent` — its next explicit write is
`reported`, from that batch's own boundary's brief once its report lands.

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

- <YYYY-MM-DD HH:MM> — <a spawn, stop, rm, or resume request and its result; an
  ask of the human and their answer; a `release:` sent to a tab seat, a
  `no-role` received; a handshake accepted or refused; a session declared dead and what was
  verified; a recovery after a VS Code restart; a handover written or accepted;
  a peer line you received and did not answer in the same turn, as
  `unanswered: <from> — <line>`, paired with `answered: <from> — <line>`
  when it is answered, both written through `record --event`, which ends a
  line it writes at a boundary with `(batch <X>)` so that the same event in
  two batches is two lines and twice in one batch is one; an exit
  proposal form-checked and its
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
| Kanri's context at the topic's opening and at the plan's landing with the landing's delta, then Kanri's and each Jisso's at each boundary with the cache regime | <YYYY-MM-DD, each check> | <opening: kanri context=<n>; landing: kanri context=<n> (+<d>); batch <X>: kanri context=<n>, jisso context=<n>, ttl=<v>>, entries separated by `;` — the opening and the landing written by Kanri, every `batch <X>` entry by `boundary.js record`, which replaces its own batch's entry and leaves every other entry alone |
| the share of usage at context over the threshold | <YYYY-MM-DD, the plan close> | <the share line, the names it ran over> |

These six rows are always present; the rows the last paragraph adds sit
below them. Kanri fills the first at the
plan close from this ledger's Session events, where it writes one line each
time a second top-family session goes live; the second by counting those same
events' one-shot lines by kind and not by stage, since one kind is dispatched
at several stages; the third by copying the roster's Residency rows; the
fourth from what the human pastes. The fifth is filled at the topic's opening
(Start step 5), at the plan's landing, and at every boundary by
`boundary.js record`, from the two readings the boundary's dispatch carried;
the sixth at the plan close from `reading.js --share`, with the sessions it
ran over and the ones it skipped. The fifth is the record
behind a rule — the ceiling of `roles/kanri.md`'s trigger, which fires
without asking whether anyone is present — and the other five
are the record the next measurement starts from.

A `paused: <dispatch> on <family> — resets <time>` line a role sends is
recorded as a row of its own: What the line as it arrived, When the date, and
Value the reset time Kanri told the human, joined by the
`continue: <dispatch> — same model` that ended the pause. Further rows are
added as they are measured.
