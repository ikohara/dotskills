---
id: "a5d0"
title: a mid-batch blocker file has no template
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-15
updated: 2026-09-19
---

Source: session 2026-09-15

Surfaced by `tanto-sweep-2`'s task 11 mid-batch escalation (2026-09-15).
`skills/tanto/templates/batch-prompt.md` and
`skills/tanto/templates/batch-report.md` exist, but nothing shapes a mid-batch
**blocker** — the file an implementer writes when a task is stopped dead by
something outside its own authority, before the batch's own boundary is
reached.

Jisso invented the shape ad hoc this tenure, in that topic's workspace file
`batch-D-blocker.md`: a "For Kanri" summary, a "Rulings needed" section
mirroring the batch report's own heading (so Kanri can read it by `sections`
the same way), "Questions for the human", "Tree state" (confirming what was
reverted vs. committed), and "Next" (what Kanri's ruling should unblock and
how). It worked well — the ruling that followed was fast because the file
already gave every fact needed — but the next Jisso that hits a mid-batch
block has no template to start from and may shape it differently, making a
sections-based read less reliable.

Two candidate shapes; the choice belongs to the Sekkei of the plan that lands
this, not to this issue:

- (a) A new `skills/tanto/templates/batch-blocker.md` carrying the five
  sections above, referenced from `roles/jisso.md`'s stop-classification text.
- (b) No new template: `skills/tanto/templates/batch-report.md` gains a
  blocked state — a marker line naming the task the batch stopped at, the
  "Rulings needed" section it already has, and the "Tree state" / "Next"
  content folded into its existing slots — so a blocked batch writes its
  report early instead of a second artifact, and Kanri's `sections` read stays
  the one it already makes.

No existing issue covers this. `SKILL.md`, `roles/jisso.md` and
`roles/kanri.md` carry no mid-batch blocker text, and the four open issues
containing the word "blocker" — issue-36c0, issue-45f8, issue-9627,
issue-b6d3 — use it for review findings. issue-a5a3 and issue-7275 touch
`templates/batch-report.md`'s slots, not a blocker file.

Belongs to a plan editing `skills/tanto/` under contract rule 11, as
issue-13a1's case does.

A system gap, not a user-stated need, so no paired requirement.
