---
id: "1f2b"
title: "`roles/sekkei.md` has no rule for a scope change that arrives after the spec review"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-19
---

Source: shoroku shoroku-at-close

Measured on `shoroku-at-close`. The human's scope change — the close's steps 2
to 4 delegated to a live Hosa — arrived after the spec review, in the same
message that answered the review's own scope finding. About nine passages
across six files and one ADR were therefore written with no reviewer. The
review brief flagged each of them as unreviewed, and the human answered
`all OK`.

`roles/sekkei.md` carries no rule for a post-review change of that size. The
options are a second, scoped `spec.review` dispatch over the delta, the brief's
flag alone, or nothing. This run chose the flag; the whole-branch review's
Minor 1 landed on exactly the unreviewed Hosa passages, which is one data point
that the flag alone is thin, and the plan's cold read found nothing further.

What the role file should say is which of the three is the default and at what
size the default changes.

A process gap, not a user-stated need, so no paired requirement.
