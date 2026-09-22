---
id: "8016"
title: a dispatcher's own suggested fix wording is not said to go through the review loop like an implementer's draft
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-18
updated: 2026-09-22
---

Source: shoroku seat-lineage

`roles/jisso.md`'s dispatch guidance does not say that a controller's verbatim
fix wording, handed to an implementer inside a resume message, is subject to
the same review loop as anything the implementer drafts itself. A plan's own
quoted `P`-block text is exempt because it passed the plan review; a
controller's improvised wording never did, and reads as if it had.

Three measured slips in the `seat-lineage` run, all of them problems the Jisso
introduced through its own dispatch instructions rather than the implementer's
work:

- an unverified causal claim, later grounded properly;
- an ungrammatical suggested phrase;
- a self-contradiction from editing a cross-reference without editing what it
  pointed at.

Two of the three were in Task 35's fix rounds and one in the fix wave's own
direct-fix rounds. Every one was caught by a subsequent review pass, not by the
Jisso re-reading its own dispatch text before sending it.

The fix is one sentence in `roles/jisso.md`'s dispatch guidance. It is not a
change to `subagent-driven-development`: that is a composed skill this
repository does not edit (design-4807, "Deviations from the composed skills").

A process gap, not a user-stated need, so no paired requirement.

**2026-09-22, `tanto-bg-seats` — the same class, on a review's own remedy text.**
Task 26's brief specified `git worktree remove --force <path>` verbatim, copied
from the whole-branch review's own suggested fix. That suggested fix was itself
technically incomplete: git needs `--force` twice for a *locked* worktree, and
the same brief's own sentence establishes the worktree as locked. A further
ruling and fix round followed.

This is the first case in this run where a *review's own remedy text*, rather
than the original defect, needed the fix round — which widens the issue by one
author. The dispatcher's improvised wording is one source of unreviewed text; a
reviewer's suggested fix, copied verbatim into a task brief, is another, and it
arrives carrying a reviewer's authority. Whether a review's suggested fix should
be spot-checked against the tool's own documented behavior before it is quoted
into a brief is the same sentence's work.
