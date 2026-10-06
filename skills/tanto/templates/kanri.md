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

Columns: Batch, the batch's key — its letter, `fix wave` for the fix wave,
or `<X>-rework-<n>` for a batch returned for rework; Tasks, the plan's task
numbers, or for a rework the tasks it runs again; State, one of planned, reported, accepted, or rework; Prompt and
Report, the two file names under `.tanto/<topic>/`; Verdict, one line —
accepted, or what must change. One row per batch, added as the batch is
planned, and one per rework: a batch returned for rework keeps its row,
State `rework` and its Verdict the reason, and the rework runs under a row
of its own, with its own Prompt, Report, and Verdict. The placeholder row
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
Item, one line; Destination, one of the six `docs/` types — experience,
design, decisions, issues, notes, or reports — or `feedback`, for an item
only the skill's own files would cite, or the compound
`<docs destination>; feedback`, for one this repository's documents will
cite as well; Adopted, one of `pending`, `yes`, and `no`; Written, `no`,
the subject of the commit that wrote the row out, or `feedback <basename>`
for an item whose only destination is `feedback`. The placeholder row
stays until the first item arrives.

| S-n | Source | Item | Destination | Adopted | Written |
| --- | --- | --- | --- | --- | --- |
| (no item yet) | | | | | |

Nothing is adopted here by a ruling. Every row arrives `pending` — from a
batch report's Shoroku proposal, a Kaiseki report's
`blocks this task: no` items, a review report, a session's shoroku proposal,
the spec's four sections, or a Kanri exit that fell while this ledger was
open — and stays `pending` until the close. At the close Kanri dispatches
the `shoroku.recommend` kind over Jisso's proposal and every source these
rows name, to write `shoroku-recommendation.md` and `shoroku-brief.md`;
gives the human both paths, the four counts by group, and the brief verbatim; and
writes `shoroku-direction.md` from the human's answer, and these rows with it, Adopted
`yes` or `no` as the direction says. No item is put to the human apart from
the rest and none is settled by Kanri alone: the human sees the whole list,
grouped, once, and answers by exception.

The close writes only the adopted rows whose Written column says `no`, and
fills that column with the commit subject — or, for a row whose only
destination is `feedback`, with `feedback <basename>` once `usage.js close`
has placed the feedback file, whether or not its line could be sent, the
cell staying `no` while the file is held; a row a Kanri exit recorded here
is written by this topic's close like any other. So nothing is written
twice.

A reference to an `S-n` or an `R-n` from outside its own ledger — the roster, a
handover file, another ledger — names the topic first, `<topic> S-n`; bare
numbers stay bare inside a ledger. The Written column takes only a value a
filter can read: `no`, a commit subject, `superseded: <topic> R-n`, or
`feedback <basename>`, the last two counting as written; an item with the
compound destination is written by its commit subject; an item two closes
could claim is one row in the ledger of the topic that raised it, never a
compound value.

## Session events

- <YYYY-MM-DD HH:MM> — <a spawn, stop, rm, or resume request, or a `wake`,
  and its result; an ask of the human and their answer; a `no-role`
  received, and a second one from the same `sessionId`, which ends that
  seat; a seat ended and by what — `taiseki`, or your own `stop` request; a
  session declared dead and what was verified; a recovery (`fukki`) and
  what it put back; a handover written or accepted; a second top-family
  session gone live, spawned or woken;
  a peer line you received and did not answer in the same turn, as
  `unanswered: <from> — <line>`, paired with `answered: <from> — <line>`
  when it is answered; a line or a request you owed while the spawner was
  stale, as `unsent: <sessionId or op> — <the line or the request>`, paired
  with `sent: <sessionId or op> — <the line or the request>` when `fukki`
  sends it; all four written through `record --event`, which stamps the
  time itself — the text carries no date — and ends a
  line it writes at a boundary with `(batch <X>)` so that the same event in
  two batches is two lines and twice in one batch is one, and a pair is
  matched on the text after its prefix, without that suffix; a shoroku
  proposal form-checked and its
  rows recorded, or a shoroku proposal not written and what was lost; a human access
  grant and the human-access: done line that
  closed it; a human-contact: line and what was said>

## Open questions for the human

1. <one line each, added when the request is made and removed when it is
   done: the four SDD stop classes, a scope or spec change, escalated
   shoroku items, and every other open act asked of the human — a tab to
   close before a replacement, a `tanto fukki` after a stale spawner, an
   answer waited on — the idle block's own source for its `for you:` list.
   Everything else is a ruling.>

## Measurements

| What | When | Value |
| --- | --- | --- |
| top-family sessions active at once, the peak, and whether a 429 was seen | <YYYY-MM-DD, the plan close> | <the peak count, and yes or no for the 429> |
| Kanri's context at the topic's opening and at the plan's landing with the landing's delta, then Kanri's and each Jisso's at each boundary with the cache regime | <YYYY-MM-DD, each check> | <opening: kanri context=<n>; landing: kanri context=<n> (+<d>); batch <X>: kanri context=<n>, jisso context=<n>, ttl=<v>>, entries separated by `;` — the opening and the landing written by Kanri, every `batch <X>` entry by `boundary.js record`, which replaces its own batch's entry and leaves every other entry alone |
| usage — the file, and the cost line | <YYYY-MM-DD, the close's landing> | <the path and the final cost line of the `usage:` line `usage.js close` printed, or `kept — the file's own Usage block` after a `--keep-usage` run, or `unavailable — <reason>`> |

These three rows are always present; the rows the last paragraph adds sit
below them. Kanri fills the first at the plan close from this ledger's
Session events, where it writes one line each time a second top-family
session goes live. The second is filled at the topic's opening
(Start step 5), at the plan's landing, and at every boundary by
`boundary.js record`, from the two readings the boundary's dispatch
carried. The third is filled at the close's landing, by whichever Kanri
lands it, from the `usage:` line `usage.js close` prints as that landing's
last act: the path of `.tanto/<topic>/usage.json` and the final cost line,
`kept — the file's own Usage block` after a `--keep-usage` run, or
`unavailable — <reason>` when no usage could be measured or kept. The second
is the record behind a rule — the ceiling of `roles/kanri.md`'s trigger,
which fires without asking whether anyone is present — the first is the
one limit signal a run keeps, and the third names the file that holds the
topic's measurement, every seat and every dispatch counted from the
transcripts.

A `paused: <dispatch> on <family> — resets <time>` line a role sends is
recorded as a row of its own: What the line as it arrived, When the date, and
Value the reset time Kanri told the human, joined by the
`continue: <dispatch> — same model` that ended the pause. Further rows are
added as they are measured.
