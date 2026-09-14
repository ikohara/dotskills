---
id: "11db"
title: "rule 11 says nothing about a live session of another topic whose skill file changes mid-tenure"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

Observed in the `tanto-sweep-2` spec stage (2026-09-14), while
`tanto-context-ceiling` was running concurrently on the shared branch.

`skills/tanto/roles/sekkei.md` changed on disk mid-tenure, when
`tanto-context-ceiling`'s Task 12 landed (the exit-proposal-unasked change).
The session that was reading it was a Sekkei of a *different* topic: it was
bound by neither that plan's Global Constraints nor by any orders line about
it, and learned of the change only because the harness reported the file as
changed. It then followed the new text for its own exit — a reasonable call,
but an unruled one.

Rule 11 in `skills/tanto/SKILL.md` covers the *editing* plan's own sessions: a
plan that edits the tanto skill says what its own roles do about the text
moving under them. It says nothing about a session of another topic that is
already running when the skill it loaded changes. Kanri's orders line for a
concurrent topic does not cover it either.

A candidate sentence for rule 11:

```text
a session of another topic that is live when the skill changes follows the
text on disk from the change on, and says so in its next line to Kanri
```

Not a duplicate of the nearest existing entries, which are about a different
concurrency hazard: issue-1096 (a second live Sekkei's spec reviewer reading
the first topic's draft) and issue-bf75 (a plan moving under review).

A system gap, not a user-stated need, so no paired requirement.
