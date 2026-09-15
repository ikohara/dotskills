---
id: "11db"
title: "rule 11 says nothing about a live session of another topic whose skill file changes mid-tenure"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-15
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

The notifier's side of the same gap, 2026-09-15 (`tanto-sweep-2`). The
sentence above is written from the *reader's* side — what a live session of
another topic does when its skill file changes under it. The other half is the
duty to tell it: in batch C, ruling R-13 told three concurrent-topic peers
that their own role file was about to change mid-tenure; in batch D, R-16
applied the identical reasoning to `SKILL.md` itself — the shared contract
every role reads, not a per-role file — because rule 11's authority sentence
protects only the editing topic's own sessions and says nothing about a
concurrent peer reading the same shared file mid-edit.

Rule 11's text, and R-13's own precedent, are phrased around "a role's own
file". Worth a sentence in `SKILL.md`'s rule 11 or in `roles/kanri.md`'s
rule-11 handling saying explicitly that a concurrent peer must be notified
before *any* shared file it reads changes mid-tenure — `SKILL.md` included,
not only `roles/<role>.md` — so that a future Kanri does not re-derive the
extension the way this tenure did, twice.

The notice has now run twice under Kanri rulings without incident, so the fix
on this side is the codification of a working practice, not a new mechanism;
the reader-side sentence proposed above is its counterpart. One gap, two
sides, one issue.
