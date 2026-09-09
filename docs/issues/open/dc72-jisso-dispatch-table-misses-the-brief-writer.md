---
id: "dc72"
title: roles/jisso.md's dispatch table has no row for the brief writer
severity: medium
depends_on: []
blocks: []
claimed_by: tanto context-cost plan (Kanri, dotskills)
claimed_at: 2026-09-09T17:30:00+09:00
created: 2026-09-09
updated: 2026-09-09
---

`skills/tanto/roles/jisso.md` carries a Models table — "The skill says" against
"tanto key" — that is the skill's **only** enumeration of which dispatch runs on
which `tanto.json` key. It lists the implementer, the task reviewer and the
whole-branch review, the fix-round escalation, the plan drafter, the spec and
plan reviewers, and the catch-all, marking for each whether the dispatch is
Jisso's or someone else's.

The review-brief design of 2026-09-08 added a dispatch that table does not
mention: the **review brief writer**, run by Kanri on `subagents.reviewer`. Its
plan put `roles/jisso.md` on the never-edit list, so the row was never added;
the whole-branch review found it as M-7 and Kanri filed it rather than widening
the wave's scope.

The gap is structural rather than accidental. A Kanri-dispatched subagent added
by a plan that declares Jisso's file unchanged can never reach the one table
that enumerates dispatches, because the file the table lives in is out of that
plan's scope by construction. Anyone reading the table to answer "what runs on
`subagents.reviewer`?" now gets an incomplete answer, and the next plan that
adds a Kanri-side dispatch will hit the same wall.

The fix is one row — the brief writer, `subagents.reviewer`, Kanri's dispatch
and not Jisso's — in whichever plan next has `roles/jisso.md` in scope. Worth
considering at the same time: whether that table belongs in `SKILL.md` instead,
since it enumerates dispatches every role's conductor makes and not only
Jisso's, which is the second design rule of design-4807 applied to a table
rather than to a term.

Related: design-4807 (Human access, the brief writer; Skill layout),
decision-9a3a (the two maps of the expected-model config), decision-ace0 (the
brief writer on the reviewer tier).
