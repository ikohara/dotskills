---
id: "26fd"
title: shusei before the merge, shoki after — the product is verified before it lands, the records at their landing
status: accepted
supersedes: ["a1ae"]
superseded_by: null
amends: ["83aa", "ce83"]
amended_by: []
created: 2026-09-22
updated: 2026-09-22
---

## Context

decision-83aa gave the close's `Recommended fix` group a commit of its own,
and recorded a gap with it: a `fix` lands on the topic branch after the
whole-branch review and is therefore unreviewed by a subagent. decision-ce83
put the docs write-out in a dispatched subagent's hands. decision-a1ae then
delegated the close's recommend, check, and apply to a live Hosa so that
Kanri could hand over without waiting for the human's unbounded latency.

The bg-seats design re-asks all three at once, because it changes who is
present. With the run unattended, "a live Hosa" is not a thing the close can
count on, and the question of what is verified before the merge and what
after has to be answered by what the two halves actually are. The fixes
change shipped product text; the write-out changes records. Those are not the
same risk and do not belong on the same side of the merge.

## Options

- **Shusei before the merge, shoki after.** The `fix` group becomes a Jisso
  batch of one task, with the batch's two reviews; the docs write-out is a
  brief-driven seat in a worktree, landing after the merge and verified at
  its landing.
- **A `shusei` role of its own.** Rejected: the work is a task in a batch,
  and the batch machinery — the prompt, the two reviewers, the boundary —
  already exists.
- **The docs commit on the topic branch before the merge.** Rejected: it puts
  the records on the critical path, which is the thing the design is removing
  from it.
- **Shoki resolves a conflict.** Rejected: a scribe that reconciles two lines
  of history is making product decisions in a seat with no ruling authority.
- **Shoki merges into `main` itself** (the second Kikaku file's §4).
  Rejected, with the human's word (D-6, S-2): a merge commit needs `main`
  checked out, and Kanri alone owns the branch.

## Decision

Shusei runs before the merge and shoki after it: the product is verified
before it lands, the records at their landing.

The `fix` group is a Jisso batch of one task, so it carries the batch's two
reviews. The docs write-out is a brief-driven seat working in a worktree —
the one worktree this design admits, because a scribe holds no runtime
resource and so cannot collide with the run over one. Shoki reports
`shoroku ready:` and Kanri fast-forwards `main` on that line.

**This ADR supersedes decision-a1ae in full.** a1ae's premise was a live Hosa
present at the close; under this design the close's halves are a Jisso batch
and a spawned scribe, so nothing of a1ae's delegation remains to keep. What
a1ae was protecting — Kanri not holding the human's unbounded latency in its
own tenure — is preserved here by the kessai of decision-969a and by the
write-out leaving the critical path.

**It amends decision-83aa** in one part: 83aa's recorded consequence that "a
`fix` lands unreviewed by a subagent" closes, because shusei's batch carries
two reviews. The rest of 83aa stands: the `Recommended fix` group with its
own commit, its `Old:`/`New:` form, and `fix` as the sixth triage outcome.

**It amends decision-ce83** in one part: the stage at which the apply's
commit is verified. The write-out's commit is verified at its landing, after
the merge, rather than on the topic branch before it. The rest of ce83 stands
— the recommendation checked by exception, the apply from files, and no role
but the write-out's own seat writing under `docs/`.

## Consequences

- Every byte that changes shipped behavior passes two reviewers before it
  reaches `main`.
- The records land after the merge, so a slow write-out never delays a
  branch; the price is that `main` briefly holds work whose record is still
  being written.
- The design admits exactly one worktree, and the reason is stated, so a
  later reader does not read it as a general permission.
- Kanri fast-forwards rather than merging on shoki's line, so the branch
  keeps one owner.
- The reasoning is the tanto-bg-seats design spec of 2026-09-20, amending the
  second Kikaku file's §4 with the human's word (D-6, S-2).
