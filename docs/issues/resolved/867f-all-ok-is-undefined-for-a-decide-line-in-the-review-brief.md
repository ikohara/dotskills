---
id: "867f"
title: the review brief's `all OK` is undefined for a decide line
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-10
---

`skills/tanto/templates/review-brief.md`'s "How to answer" defines `all OK`
as confirming every point tagged **confirm**, with the points not mentioned
counted as confirmed. A point tagged **decide** has no document answer to
confirm — the document left it open and the human's reply is what settles
it — so a bare `all OK` on a brief that carries one leaves the decide line
formally unanswered, and the template does not say what Sekkei does with it.

It happened twice in the requirement-extraction run, both on 2026-09-09.
The spec brief's last line asked whether the two req-3c4d bullets are worded
now or at T1's escalation; the human answered `all OK`, and Sekkei took the
spec's own answer (T1). The plan brief's last line asked whether a direct
execution of kisou's Step 3, when the Skill tool is unavailable in the
subagent's turn, still counts as the refresh-path dogfood; the human answered
`all OK`, and Sekkei took the recommendation it had stated in the review
request, then wrote it into the plan. Both readings are recorded in
`dialogue.md` (D-5, D-6) beside the answers, so nothing was lost — but the
reading was Sekkei's, and a different Sekkei could have read the same
`all OK` as "not covered, ask again".

The fix is one sentence in the template's "How to answer": either the
document's own answer where one exists, else the recommendation Sekkei
stated with the brief, stands under `all OK`; or a decide line is never
covered by `all OK` and must be answered on its own line. The first matches
what happened; the second is stricter and costs the human one line per
decide point.

Related: decision-ace0 (the answers to the brief are the confirmation),
design-4807, issue-a1c9 (resolved; the brief's origin).

Resolved by the tanto-sweep plan's task 12, which adds an
`— If unanswered: <what>` clause to every decide point in
`templates/review-brief.md` (stated in both the answering paragraph and the
point-form paragraph) and a fourth part to `roles/kanri.md`'s brief-form
check that enforces it, so a bare `all OK` on a decide line selects the
default the human saw before answering rather than an undefined reading.

From the `2026-09-10-tanto-sweep` conductor ledger:

- S-35: this issue was half-fixed before it was filed — the strict reading
  landed in the 13:17 fix wave of 2026-09-09, the issue was written at 15:34
  against it — so an issue written after a fix wave on the same file is now
  re-read against the tree before it is planned.
