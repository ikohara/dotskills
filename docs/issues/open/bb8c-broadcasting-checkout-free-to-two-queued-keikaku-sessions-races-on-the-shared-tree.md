---
id: "bb8c"
title: "broadcasting `checkout free:` to two queued Keikaku sessions races on the shared tree"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-16
---

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
