---
id: "a89a"
title: "a Kanri's close does its write-outs itself, a landing with two open topics has no tie rule, and a one-token answer to two lists is recorded unasked"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-07
updated: 2026-10-07
---

Source: inbox 2026-10-06-kanri-context-cost-and-close-gaps

A bug report from one finished run names eight observations on where a
Kanri's context is spent and on the close. Four add measurements to open
issues and are recorded there: the re-injected `SKILL.md` on each
`/tanto fukki` in issue-cca9, the next Sekkei opened mid-batch in
issue-3c08, the verbatim kessai brief in issue-76df and issue-f000, and the
spawned Kanri's start in issue-401e. One is stale: the 30% share target and
`reading.js --share` it measured left the role text with the tanto-feedback
plan, so there is nothing left to repair. Three are new, and each needs a
decision:

1. **The close's write-outs run in Kanri's own context.** A spawned Kanri's
   close ran from `context=127858` (ceiling 219,077) to 228,166 at the
   shusei boundary, after about 35 calls; the largest single costs were three
   memory-file edits made by hand and the bug-report send, about 25,000 tokens
   by the run's estimate. `roles/kanri.md`'s "Reporting from the other side"
   has Kanri write the report and send `bug-report: <absolute path>` with no
   delegation, and a memory write-out is no step of the skill at all — a
   repository whose close adds one meets the cost with no guidance.
   Direction: a line permitting Kanri to hand the file-writing of bug reports
   and of any memory entries the close adds to a `default` subagent, with the
   items and the paths named.
2. **With two open topics at a landing, which gets the branch is not
   stated.** `roles/kanri.md`'s landing says to cut the next topic's branch
   from `main` if it is not cut yet. With two candidates — one with its plan
   committed and first in the human's order, one with a Sekkei's draft spec —
   the Kanri cut the first by the human's order, reading the draft's spec
   commit as the in-flight topic's commit window's to take. Direction: one
   sentence — with two open topics, the next by the human's order gets the
   branch.
3. **A one-token answer to two numbered lists was read as answering both.**
   The human answered a Kanri message that carried two numbered lists with
   the single word "1"; the Kanri read it as answering both, the human meant
   the first question only, and the wrong reading had already been written
   into a ruling, which was withdrawn. `roles/kanri.md` writes numbered items
   in two places that can land in one message — the `for you:` list and the
   kessai's item numbers. Direction: a message that holds two lists labels
   them differently (letters and numbers), and a one-token answer to such a
   message is asked back before it is recorded.
