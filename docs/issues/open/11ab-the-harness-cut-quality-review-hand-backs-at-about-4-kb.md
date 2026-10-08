---
id: "11ab"
title: the harness cut four quality-review hand-backs at about 4 KB, inside their closing line
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: shoroku roster-ledger S-66

In `roster-ledger`'s batch C (2026-10-08) the harness cut four quality-review
hand-backs (Tasks 12, 13, 14, 16) at about 4 KB with
`[result truncated — ask the agent for the rest via SendMessage]`, each time
inside the closing "Cannot verify" line. Asking for "under 45 lines" was not
enough; "keep Cannot verify to two lines and finish the whole hand-back"
helped for Tasks 15, 17, and 18. The batch's own proposal was a character
bound in the reviewer prompt, around 3500, rather than a line count.

The remedy that worked (S-91 of the same run): in the fix wave every reviewer
was told to write its full report to
`.superpowers/sdd/<plan>/rev-<task>-<kind>.md` and hand back only the verdict
and the counts. None of the eight reviews was truncated, the review bodies
never had to pass through the hand-back, and it costs the controller one read
per file. That pattern, not the character bound, is the repair: it changes
the reviewer dispatch text in `roles/jisso.md` and the SDD recipe.

Carrier: Kept.
