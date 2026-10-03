---
id: "c204"
title: a shoroku.apply dispatch can commit successfully and then hit a quota 429 on its own report-back, reading as nothing landed
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-10-03
---

Source: inbox 2026-09-17-shoroku-apply-429-after-commit

Reported from a live occurrence in another repository's `question-responder`
T2 close, 2026-09-17: at that close, Hosa dispatched `shoroku.apply` (a
commit-then-report subagent) with the recommendation, direction, and commit
subject. The subagent wrote the accepted subset and committed. Hosa then
reported a weekly quota `429` mid-turn as `paused: ... apply dispatched and
hit a weekly quota 429 mid-turn before any commit — nothing landed, tree
untouched.` That report was wrong: the apply had in fact committed
successfully. The 429 almost certainly hit *after* the commit, most likely on
the subagent's own final report-back to its dispatcher, which then read a
turn that simply never returned a result as "failure before commit" rather
than "success, then cut off."

## Symptom

A `shoroku.apply` (or, more generally, any commit-then-report subagent
dispatch) can end its turn on a `429` (weekly/daily quota) *after* its
filesystem writes and `git commit` have already succeeded. The dispatcher has
no built-in way to distinguish "committed, then cut off before reporting"
from "cut off before committing" except by independently re-checking
`git log` / `git status` itself, which the Limits procedure for recording a
`paused:` line does not currently instruct it to do.

## Reproduction

No minimal repro — observed live, once, mid-run. The shape to look for: a
commit-then-report subagent dispatch that ends on a `429` after its writes
and commit have already succeeded, where the dispatcher records a `paused:`
line without independently checking the tree first:

```console
git log --oneline -3
git status --porcelain
git show --stat <the commit the direction file's subject names>
```

On the occurrence this issue is filed from, the commit was present, complete,
and matched the direction exactly, while the dispatcher's own report said
otherwise.

## Proposed fix

Before a dispatcher records a `paused:` line for a commit-then-report kind
whose dispatch instructions include "commit ... and report the subject," it
should independently check `git log` / `git status` against the direction's
expected paths and commit subject — the same check already prescribed for a
*successful* report, applied symmetrically to a report that claims failure.
If the check finds a matching commit, the report should be corrected to a
normal success rather than recorded as a pause. Making this an explicit step
(rather than relying on a dispatcher's own ad hoc diligence) would catch the
case even under presence pressure or a resumed/replaced dispatcher — and
guards against a worse failure mode: a naive retry of the same apply after
the "pause" resets could re-run the write-and-commit steps against a tree
that already has them, risking a duplicate or conflicting second commit.

## 2026-09-20 — the other half: a cutoff *before* the commit

The paragraphs above are about a cutoff after the commit, which reads as
failure. The mirror case was then reported: an apply-mode dispatch given a
direction covering several new documents in one commit was cut off by the
model's own session or quota limit **after** finishing one document in full — a
new ADR — and before touching the second write, let alone the two after it, the
lint pass, or the commit.

Nothing was lost that time only because the cutoff happened to land on a
document boundary and the finished document was genuinely complete. A cutoff
one write earlier, mid-file inside the ADR, would have left a half-written
document on disk with no signal distinguishing it from a finished one.

So the dispatch's atomicity is "all or nothing" only by luck: it should either
finish every document or fail with nothing written, and today it can do
neither. Proposed by the reporter: have the apply dispatch — Kanri's prompt, or
the apply mode's own internal instructions — checkpoint **per document** rather
than per commit when a direction names more than one, writing and verifying
document 1, reporting a one-line checkpoint back to the dispatcher or writing a
marker file, then proceeding, and committing only once all documents are
written. That is the same instrument the fix above wants and it answers both
halves: a checkpoint trail tells a dispatcher exactly how far the run got,
whichever side of the commit the cutoff fell on.

Serves exp-1b75 (tanto-issue-triage, 2026-10-03).
