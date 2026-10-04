---
id: "6d55"
title: two Keikaku-side gaps — text after `See:` in a brief, and `boundary --plan` before the plan is committed
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: inbox 2026-10-03-keikaku-side-skill-gaps-restore-see-boundary

The report named three gaps; one is satisfied by the tree and two remain,
each one sentence in its own file.

- **(a) The restore form** — satisfied. `roles/keikaku.md` names
  `rm <path> && git checkout -- <path>` at its one restore site, and its other
  `git checkout --` mention is about not discarding, not restoring.
- **(b) Nothing may follow the pointer after `See:`.**
  `templates/review-brief.md` names "the pointer after `See:`" among the form
  markers but does not say that nothing may follow it. A brief writer twice
  put a parenthetical after the pointer, and the cheap repair was a resume
  naming exactly that failure. Add the sentence, and name that resume as the
  repair.
- **(c) `boundary --plan` before the plan is committed.** `roles/keikaku.md`
  Step 4.2 says `boundary --plan <path>` exits `2` when the plan or its
  heading is missing; before the plan is committed it exits `1` on its
  porcelain check, naming the plan itself, so the exit code cannot be read.
  Say so, and that Keikaku reads the failing check's name or commits the plan
  first. issue-621b is the same observation from the dry run's side.

Carrier: Kept.
