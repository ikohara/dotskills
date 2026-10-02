---
id: "36c0"
title: roles/sekkei.md Step 2 names too narrow a review input, and "before the review" does not say whether that is before the spec commit
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-10-03
---

Source: session 2026-09-13

Two defects in `skills/tanto/roles/sekkei.md`, Step 2 ("spec review"), both
measured on the tanto-cost spec review of 2026-09-13
(`.tanto/tanto-cost/spec-review.md`, an `opus` read-only reviewer over a
1404-line spec).

**The review's inputs are too narrow.** Step 2 tells Sekkei to give the
reviewer "the spec and the repo's `docs/decisions/` and
`docs/requirements/`" and to "ask it to check the spec against them". For a
design whose plan will carry passages, the review's most valuable output was
none of that: it was a sweep of the files the design changes —
`skills/tanto/**` and `skills/shoroku/SKILL.md` — for sentences the design
contradicts that the spec's "Old values this plan contradicts" list did not
name. That sweep found 27 such sentences, and it ran only because the Sekkei
added those paths and that question to the dispatch on its own. The step
should name, as a third input, the files the spec's per-file change list
touches, with the question "which sentences in them does the design
contradict that the spec's Old values list does not name", so that the
sweep is the procedure's and not one Sekkei's habit.

**"Before the review" does not say before what.** Step 2 opens: "Before the
review, a passage in the spec that rewrites another role's procedure goes
to that role's session for a check, when that session is live". It does not
say whether "before the review" is also before the spec commit. On
2026-09-13 the Sekkei committed the spec, then sent Kanri the check and
dispatched the reviewer in the same turn; Kanri's answer arrived as spec
input I-2 after the reviewer had started, and the reviewer's blocker 3 was
"I-2 is unanswered" — an artifact of the ordering, not a gap in the design.
The sentence should read "before the spec commit and before the reviewer is
dispatched", and Kanri's answer is then an `I-n` the reviewer reads with the
spec.

Both edits touch `roles/sekkei.md`, so they run under contract rule 11.
The tanto-cost implementation plan rewrites that file (its Sekkei is
narrowed to the spec and the spec review), and its `roles/sekkei.md`
passage is the natural carrier; otherwise the next plan to touch the file.

Related: exp-27e8 (the human reviews through a brief of the judgment
points — the brief reads the review), design-4807, decision-5c8e (rule 11),
the tanto-cost design of 2026-09-12.

Resolved by "docs(tanto): Sekkei's review gates, the dialogue rule, and the fixed referent" — found by the tanto-issue-triage liveness check, 2026-10-03.
