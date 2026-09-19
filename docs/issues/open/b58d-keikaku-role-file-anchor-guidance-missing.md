---
id: "b58d"
title: "roles/keikaku.md doesn't generalize \"an anchor's after: is run, never counted\""
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-19
---

Source: session 2026-09-14

Reported from `C:\Users\0000105523\devel\kuchidome` (tanto, topic
`residency-retention`, keikaku): `plan.review`'s full per-task replay found
three wrong anchor `after:` values that the drafter's own earlier
cross-check had missed. All three, and a fourth introduced during the very
next fix round, were the same root cause: a value counted by reading the
file rather than produced by running the anchor's own command against the
applied text. The lesson was written into that plan's own Global
Constraints, but it applies to every tanto plan that uses the passage
format, not only that one — and `roles/keikaku.md` has no guidance
sentence saying so directly, so it gets rediscovered per plan instead of
being taught up front.

Not hotfixed: `roles/keikaku.md` is in `tanto-context-ceiling`'s own
File-structure table, and that plan has not closed yet.

Proposed fix: add a sentence to `roles/keikaku.md`'s passage-writing
guidance — an anchor's `after:` value is produced by running its own
command against the applied text, never by counting from a read.

**2026-09-16, the `tanto-sweep-2` run — a second missing sentence, about where
a passage lands rather than what its `after:` counts.** Two independent
instances in one plan of a textually-correct passage landing at a structurally
awkward point, because the **anchor**, not the words, was wrong:

- Task 8: a plan-declared insertion point split a bulleted list in
  `roles/keikaku.md`, where the identical text in `roles/sekkei.md` sat between
  prose paragraphs and read fine — the same needle, two different structural
  contexts.
- Task 4: the parked "already been deleted" finding, the same shape (see
  issue-7ba4, which carries that sentence's own tail).

Worth one shared follow-up sweep rather than two small ones. The guidance this
issue asks for therefore has two halves, not one: an anchor's `after:` value is
run rather than counted, **and** an anchor is chosen for where its passage
*lands* — the structure at the insertion point — not only for where its needle
matches.
