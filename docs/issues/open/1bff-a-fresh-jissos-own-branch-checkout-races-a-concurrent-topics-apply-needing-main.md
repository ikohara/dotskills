---
id: "1bff"
title: "a fresh Jisso's own branch checkout races a concurrent topic's apply needing `main`"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-19
---

Source: session 2026-09-17

Observed 2026-09-17 in this repository's own run, as the `dotskills-1a` Kanri's
tenure, with `shoroku-at-close` and `seat-lineage` both open. A fresh Jisso
(`shoroku-at-close`) checked the one shared working tree out onto its own
`shoroku-at-close` branch immediately on handshake, before any batch prompt —
reasonable on its own, since its orders name the branch — while the other
topic's T0 shoroku apply still had to land on `main`. Neither side was warned:
nothing in `roles/jisso.md` says a fresh Jisso should hold the tree at whatever
branch it lands on until Kanri confirms no other topic needs the checkout, and
nothing in `roles/kanri.md` tells Kanri to check the tree's current branch
before switching it for an unrelated commit.

Nothing was lost. This tenure caught it only incidentally — a `docs/issues/`
file that looked stale on disk triggered a "changed on disk" notice — not
because either role file flagged the hazard. The recovery that worked is the
one the Workspace section already prescribes for a stray modification: message
the other session, confirm it is not mid-edit, switch the branch, dispatch the
apply, switch back.

The gap is anticipation rather than recovery. Nothing prompts a Kanri running
two concurrent topics to expect this specific collision — a fresh Jisso's own
branch checkout on handshake against a concurrent topic's T0/T1/exit apply that
must land on `main` — *before* the first branch switch happens. Fix candidate: a
line in `roles/kanri.md`'s "When the plan lands" or its Workspace section naming
the sequence as a known collision to check for, and/or a line in
`roles/jisso.md` telling a fresh Jisso to confirm the checkout is free before
taking it.

Related: issue-c3a9 and issue-bb8c as the same no-worktree concurrency class,
and issue-11db as a further member of it. This one is distinct from both —
issue-c3a9 is a between-plans intake commit landing on a concurrently cut
branch (one branch cut racing one chore commit), issue-bb8c is two branch cuts
racing each other from one broadcast signal; this is a role's *onboarding*
checkout racing a shoroku apply, with its fix site in the handshake and
branch-switch language rather than in the chore-approval check or the
queued-topic send.
