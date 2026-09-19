---
id: "fab7"
title: a Kanri handover's own tree-branch assertion can already be stale by the time the successor reads it
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-19
---

Source: session 2026-09-17

A Kanri handover file states where the shared tree sits — "once the tree is
confirmed on `<branch>` (it is, as of this writing)" — and a successor that
takes the sentence at face value can act on a branch the tree is not on. The
Handover section's own pre-write checklist in `roles/kanri.md` says to write
the handover file only after every commit has been verified, but verifying
commits is not the same as verifying the branch: nothing in the checklist
requires re-confirming the shared tree's actual current branch immediately
before the file is written.

Measured 2026-09-17 on this repository. A predecessor's handover claimed the
tree was on `shoroku-at-close`; the successor's own `git status` at start
showed `main`. The plausible cause is in the predecessor's own Events trail —
a Hosa commit landed on `main` shortly before the handover file was written,
and nothing re-confirmed the branch afterward. No work was lost, since
`git status` was clean either way, but a successor that trusted the assertion
instead of checking independently would have sent a batch prompt naming the
wrong branch.

The fix is one explicit step, not a successor's defensive habit: the Handover
section's own "write the handover file only after ..." checklist should add
"and after re-confirming the shared tree's actual branch matches what this
file is about to claim".

Related: issue-1a9a (internal consistency gaps in the deferred-handover
presence gate) and issue-c3a9 (a between-plans chore commit landing on a
concurrent topic's branch) are neighboring branch/handover hazards, neither of
them this one — 1a9a is about the gate's own logic, c3a9 about where a commit
lands, while this is about the handover text's own branch claim going stale.
