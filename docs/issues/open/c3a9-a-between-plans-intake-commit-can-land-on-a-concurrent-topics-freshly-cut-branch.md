---
id: "c3a9"
title: "a between-plans intake commit can land on a concurrent topic's freshly cut branch instead of `main`"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-15
updated: 2026-09-15
---

Observed in this repository's own run, 2026-09-15, while `tanto-sweep-2` and
`tanto-project-config` were both open and no batch was in flight anywhere.
Kanri triaged a kuchidome bug report as an issue (issue-a4c7) and handed the
filing to a live Hosa as a chore, expecting the between-plans convention —
`SKILL.md`'s Artifacts table names `main` as where a between-plans commit
lands. In the few minutes between the chore being sent and Hosa running it,
`tanto-sweep-2`'s Keikaku committed its spec and cut the `tanto-sweep-2`
branch, moving the one shared checkout off `main`. Hosa correctly flagged
the branch mismatch against its own roster row before committing (Rule 5's
"report it, never discard it" reflex worked as intended) — but Kanri, ruling
on the flag, judged only whether the branch *change* was expected (it was:
Keikaku's own orders caused it) and did not separately ask whether the
*commit's destination* should follow the checkout wherever it now was. It
answered "expected, not stray" and let the commit proceed, landing
`docs(issues): file issue-a4c7 …` on `tanto-sweep-2` rather than `main`.

No data was lost and no passage broke: the commit touches only
`docs/issues/open/a4c7-*.md`, outside every open plan's File structure
table, and `tanto-sweep-2`'s own Keikaku absorbed the consequence by hand —
excluding both this commit and the spec commit from `diff`'s resolved base
in the plan's Global Constraints (see that plan's own "`diff`'s base is
resolved once" section). But the fix was per-plan and manual, not a rule
this skill states anywhere: nothing in `SKILL.md`'s Bug intake, hotfix lane,
or Rule 5 tells Kanri to check a chore's intended landing branch against the
*current* checkout before approving it as non-stray, and nothing tells a
Keikaku drafting concurrently that an intake commit might land on its own
branch before task 1's first commit.

Two independent gaps, either of which would have caught this:

1. **Kanri's own check.** "Is this modification expected?" and "does this
   commit belong on the branch it is about to land on?" are two different
   questions; the hotfix lane and the Artifacts table both name a landing
   branch, but nothing prompts Kanri to compare it against the tree's
   current branch before approving a pending chore or hotfix.
2. **A newly-cut branch's own hygiene.** Nothing in the Workspace section or
   Rule 5 says a Keikaku (or Sekkei) that is about to cut a topic branch
   should check whether an unrelated commit is about to land on the shared
   checkout in the same window, or that a plan drafted just after a branch
   cut should expect to find one there and account for it, the way this
   plan's Keikaku had to work out for itself.

No proposed fix text yet — worth deciding whether the rule belongs on
Kanri's side (check the destination branch before approving), the
branch-cutter's side (a brief settling window, or an explicit check), or
both. Related: issue-11db (a different concurrency gap from the same
no-worktree, concurrent-topics class), `tanto-sweep-2`'s own plan (the
worked mitigation).
