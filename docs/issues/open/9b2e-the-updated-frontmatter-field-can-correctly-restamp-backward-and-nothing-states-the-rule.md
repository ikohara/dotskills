---
id: "9b2e"
title: "a `docs/` document's `updated:` frontmatter field can correctly restamp backward relative to its most recent commit, and nothing states the rule"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

Not a defect in the tanto skill — a generalizable document-management
convention this repository has been following by observation, never written
down, found in kuchidome's `residency-retention` run (Task 29): a `docs/`
document's `updated:` frontmatter field is sometimes correctly *restamped
backward* relative to the most recent commit that touched the file.

Task 29 found two documents whose `updated:` frontmatter had been bumped
past a milestone's own canonical date by an earlier, unrelated session's
exit-shoroku apply, which used its own literal commit day instead of the
shared milestone date every other document in that plan used. The
generalizable rule, previously unwritten anywhere: when a later task
substantively rewrites a document's entire content for a milestone (not just
a paragraph), restamping `updated:` to that milestone's own canonical date
is correct even if it reads "earlier" than a commit the reader can see
touched the file more recently — the stamp describes when the *content* was
finalized for that milestone, not the literal day of the most recent touch.
Every session before Task 29 followed this by observation; nothing states it
as a rule.

Routed here rather than to an edit of `docs/AGENTS.md` or
`docs/design/AGENTS.md` per the human's own direct instruction during this
repository's T2 close check: an agent instruction file may not be edited
without explicit human approval, and that approval was not given for this
item. Proposed fix, left unapplied: add one line to whichever `AGENTS.md` (or
a `docs/notes/` file, if that is this repository's preferred home for a
cross-cutting convention rather than an agent-instruction file) governs the
`updated:` field, stating the rule above.

Reported by `kuchidome-a8 [d83828]` from `C:\Users\0000105523\devel\kuchidome`,
2026-09-17.
