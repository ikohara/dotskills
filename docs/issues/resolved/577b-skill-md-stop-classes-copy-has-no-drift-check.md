---
id: "577b"
title: the SKILL.md copy of the four SDD stop classes has no drift check
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-06
updated: 2026-09-07
---

The four stop classes of subagent-driven development exist twice in
`skills/tanto/`, and only one copy is checked against its source.

- `skills/tanto/roles/jisso.md` quotes the upstream sentence **character for
  character**, and two fixed-string searches — one against that file, one
  against the installed superpowers skill — assert that the two still match.
  That copy is the drift canary and it works.
- `skills/tanto/SKILL.md` carries a **restatement** of the same four classes,
  added so that the roles which route on the term can read it without opening
  another role's file. It is a paraphrase, not a quote, and nothing checks it
  against anything.

If superpowers changes the wording or the number of stop classes, the canary in
`roles/jisso.md` fires and the paraphrase in `SKILL.md` does not. The two copies
would then disagree, with the paraphrase — the one three files actually route on
— silently wrong. That is the failure the shared-contract restatement was added
to prevent, reintroduced one level up.

The whole-branch review that requested the restatement asked for both halves:
add the paragraph, and add it to the consistency pass's grep list so the two
copies are checked together. Only the first half landed. The second is an edit
to the plan's own consistency pass — the plan of 2026-09-06 under the project's
superpowers working artifacts, at its Task 14 Step 4 — and the fix wave was
forbidden to touch the plan, correctly, since a dated plan is the record of what
ran and is not rewritten afterwards.

To do: give the `SKILL.md` restatement a check of its own. Either assert the two
copies against each other (they are a quote and a paraphrase, so the assertion
has to be on the load-bearing content — the count and the four class names — not
on the wording), or make the restatement a second verbatim quote with its own
fixed-string search. Whichever is chosen, the check belongs wherever this skill's
consistency pass lives next, not in the plan that has already run.

Resolution (kanri-lifecycle, 2026-09-07): `skills/tanto/SKILL.md` now carries the
four stop classes as the **same blockquote** `roles/jisso.md` carries, byte for
byte including the line breaks, introduced by a sentence saying so. One
fixed-string search therefore reaches both copies and the superpowers source, and
the drift the second copy could hide is gone.

The checks themselves moved out of the plan and into
`docs/notes/tanto-consistency-checks.md`, a living note whose check 5 pins the
line in all three files. That check's heading was corrected in the same plan's
fix wave: it now says the pinned lines are present in every copy, rather than
claiming byte identity, which a single-line grep of a five-line quote does not
verify. The overclaim in its body is a pending between-plans hotfix.
