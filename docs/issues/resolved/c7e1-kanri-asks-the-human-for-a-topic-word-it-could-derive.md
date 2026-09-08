---
id: "c7e1"
title: Kanri asks the human for a topic word it could derive itself
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-07
updated: 2026-09-08
---

The Kanri role file's Start sequence (step 5) says that when no plan is in
flight Kanri asks the human for "the topic word" and then creates
`.superpowers/sdd/<topic>/kanri.md`. The word is used in five places: that
directory's name, the spec and plan file names Sekkei writes
(`<date>-<topic>-design.md`, `<date>-<topic>.md`), the plan basename and so the
SDD workspace, the branch Sekkei cuts, and the roster's Events prose. (This
issue said "three places only" when it was filed; the count was corrected to
five at its resolution.) Every one of them is reached through Kanri — the
directory is Kanri's, and Sekkei takes the topic from Kanri's orders line — so
nothing about the word needs the human's judgment beyond its being a short,
unique slug.

Observed 2026-09-07, at the close of the kanri-lifecycle plan: the resident
Kanri printed its residency line and, following step 5, asked the human for
the next topic word. The human objected to having to invent one each time.
The step was written at the first bootstrap, where the human named the topic
in the same breath as the request, and it has been read since as a question
Kanri must put. Under req-04f5 the human is interrupted only at defined
checkpoints, and a slug is not a decision worth one.

Proposed fix: step 5 of the Kanri role file's Start sequence takes the topic
from whatever the human said the next work is — an issue id, a sentence, a
name — derives a kebab-case slug from it, states the slug in its reply, and
proceeds unless the human overrides it; the same rule for a kept Kanri
between plans. design-4807's start-sequence section changes to match. The
orders line to Sekkei is unchanged: it already carries the topic. The Kanri
role file is plan-listed, so this is a plan item rather than a hotfix while
a tanto plan is in flight; between plans it is one sentence.

Related: req-04f5 (the interrupt budget), design-4807 (the start sequence).

Resolved by the boundary-rules design of 2026-09-07 and its plan, in
"feat(tanto): Kanri derives the topic word instead of asking for it". Start
step 5 now takes the topic from whatever the human said the next work is,
derives a kebab-case slug of one to three words, checks the three places a stale
word would collide, and **states** the slug in its reply; the human may override
it until the orders line has gone to Sekkei, after which it is fixed. A Kanri
with nothing said yet waits for the human rather than asking for a word, which
is the Kept Kanri case. design-4807's "Kanri's loop" section records the
procedure and the five places the word reaches. The larger change — making the
topic equal to the plan basename, so the topic directory and the workspace are
one — was deferred and is issue-f2c4.
