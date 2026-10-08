---
id: "9f67"
title: live-check plan shapes — the whole-branch review before a pinned last batch, and a check's restore merged with the next check's edit
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: inbox 2026-10-08-feedback-ec9eae4

Item #30 of that copy.

Two plan-shape choices for a plan whose batches are live checks, neither
stated in `roles/keikaku.md` or in `roles/kanri.md`'s final batch.

**The review before a pinned last batch.** When a plan's last batch is a live
check that pins a hash, the whole-branch review and its fix wave run before
that batch, so that its deploy runs the code that will merge — at the cost
that the review does not see that batch's report. Reordering the review and a
batch is a decision. Kin: issue-afea (a self-measuring final task cannot see
its own boundary) and issue-7275 (a task whose only proof is the next batch's
first act).

**Merged restores** (inbox 2026-10-08-feedback-ec9eae4 #32). A plan with N
live checks costs about 2N human deploys when it restores after every check;
merging a check's restore with the next check's edit saves deploys at the
price of one clean state per check. Whether a plan merges them is a sizing
decision for the plan drafter.

Related: issue-afea, issue-7275.
