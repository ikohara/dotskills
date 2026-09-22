---
id: "bb8c"
title: "broadcasting `checkout free:` to two queued Keikaku sessions races on the shared tree"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-22
---

Source: session 2026-09-16

Observed 2026-09-16 as the `dotskills-e0` Kanri's own mistake, caught and fixed
the same tenure. Sending `checkout free:` to both queued Keikaku sessions
(`tanto-project-config`, `shoroku-at-close`) at once, right after
`tanto-sweep-2` closed, let them cut branches and commit on the same shared
working tree concurrently. Nothing in `roles/kanri.md`'s queued-topic language
(R-9/R-4) says the signal must go one at a time, but the shared-tree model
("no worktree by default") only tolerates one branch operation in flight.

The race: `dotskills-1d` cut `tanto-project-config` and committed its spec,
then `dotskills-0b` cut `shoroku-at-close` — switching the shared tree's HEAD
out from under the first session — and `dotskills-1d`'s next commit (the plan)
landed on `shoroku-at-close` instead of its own branch, with `dotskills-0b`'s
spec commit stacked on top.

Nothing was lost: both commits were content-addressable and touched disjoint
files, and Kanri recovered directly (cherry-pick the plan onto the right
branch, `git rebase --onto` to drop it from the wrong one, content verified by
diff and `hash-object` both ways) rather than asking the human, after
confirming the other live session was idle and holding.

Fix candidate: `roles/kanri.md`'s queued-topic protocol should say
`checkout free:` goes to one queued Keikaku at a time, not broadcast, until
that session's own branch-cut-plus-commit is confirmed done.

Related: issue-c3a9 and issue-11db as the same no-worktree concurrency class.
This one is distinct from issue-c3a9 — that is a between-plans intake commit
landing on a concurrently cut branch, one branch cut racing one chore commit;
this is two branch cuts racing each other, caused by one broadcast signal from
Kanri, with a different fix site (the queued-topic protocol's send, not the
chore-approval check).

**2026-09-17 — the drafting Keikaku's own side of the same event.** Two
queued-topic Keikakus (`shoroku-at-close`'s and `tanto-project-config`'s)
received `checkout free:` from the same Kanri near-simultaneously and both cut
branches from `main` at close to the same moment; a commit from one topic's plan
landed momentarily on the other's branch before Kanri caught and rebased it
away. No data was lost, but the queued-topic design's assumption that a branch
cut is a clean, isolated act does not hold when two queued topics are released
at once. The fix that Keikaku asked for is the one this issue already names: a
sequencing point Kanri serializes by hand, a few seconds apart, rather than a
design gap a plan's own text has to cover.

Resolved by decision-6b6b: Kanri alone cuts, switches, merges, and deletes the
branch. Sekkei and Keikaku commit on the branch the tree is already on and cut
none of their own, so two released Keikaku sessions have no branch cut to race
on. The serialization this issue asked Kanri to perform by hand is now the only
shape the design admits.
