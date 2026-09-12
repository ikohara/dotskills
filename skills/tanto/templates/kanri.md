# Conductor ledger — <topic>

Kept by Kanri. Sekkei, Jisso, and Kaiseki read it; none of them writes it.
Lives at `.tanto/<topic>/kanri.md` from the topic's opening to the plan's
close, and never moves.

## Progress

<one line, rewritten in place: which batch is in flight or accepted, what is
being waited on, "handover written", or "closed">

## Plan

- Spec — <the spec's path, or "not yet written">
- Plan — <the plan's path, or "not yet written">
- Branch — <branch name, cut from main by Sekkei>
- Topic directory — <.tanto/<topic>/>
- SDD ledger — <.superpowers/sdd/<plan-basename>/progress.md, written by Jisso>
- Hotfixes since the previous plan — <the hotfix lines copied from the roster's
  Events since the previous plan closed, one per line, or "none">

## Batches

| Batch | Tasks | State | Prompt | Report | Verdict |
| --- | --- | --- | --- | --- | --- |
| <A> | <1-4> | <planned, sent, reported, accepted, or rework> | <batch-A-prompt.md> | <batch-A-report.md> | <one line — accepted, or what must change> |

## Rulings

- R-1 — <the question> — <what was decided> — <what it costs if wrong> —
  inherited by <the tasks or batches whose dispatches carry it>

## Shoroku candidates

| S-n | Source | Candidate | Destination | Adopted | Stage | Written |
| --- | --- | --- | --- | --- | --- | --- |
| S-1 | <the report or session that raised it> | <one line> | <requirements, design, decisions, issues, notes, or reports> | <yes, no, or escalated> | <T0, T1, T2, or exit:<role>[-<suffix>] — exit:jisso-B, exit:sekkei, exit:kaiseki-1, exit:kanri-<YYYY-MM-DD>-<name>> | <no, or the subject of the commit that wrote the row out> |

Adoption is a Kanri ruling at every stage. Escalate to the human, as one
numbered list, only an item that adds to or changes a requirement or an ADR,
and an item that cannot be classified with confidence. Everything else is
decided here and the human sees the result in the commit.

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
| strong-model sessions active at once, the peak, and whether a 429 was seen | <YYYY-MM-DD, the plan close> | <the peak count, and yes or no for the 429> |

The first row is fixed and always present. Kanri fills it at the plan close
from this ledger's Session events, where it writes one line each time a third
strong-model session goes live; further rows are added as they are measured.
