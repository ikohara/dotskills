---
id: "6b6b"
title: Kanri alone cuts, switches, merges, and deletes the branch
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-22
updated: 2026-09-22
---

## Context

The run's seats share one checkout. Until now, which seat moved the branch
was settled case by case: Sekkei cut its own branch on some topics, Keikaku
on others, and the close's merge belonged to whoever was holding the tree.
That works while a human is watching the terminal and stops working the
moment the seats are unattended background sessions, because two seats that
each believe they may switch the checkout will eventually do it at the same
time.

The 2026-09-18 Kikaku file's §4 D had already named the rule; this design is
where it becomes a decision.

## Options

- **Kanri alone cuts, switches, merges, and deletes the branch**; every other
  seat commits on whatever branch the tree is already on.
- **The seat that starts a topic cuts its branch.** Rejected: it spreads an
  exclusive act across seats that do not know about each other.
- **A lock file over the checkout.** Rejected: a lock is a mechanism for
  coordinating peers, and the cheaper answer is to have one owner.

## Decision

Kanri alone cuts, switches, merges, and deletes the branch (the 2026-09-18
Kikaku file's §4 D). Sekkei and Keikaku commit on the branch the tree is
already on, and neither moves it.

## Consequences

- The shared checkout has exactly one seat that can change what it is, so a
  branch operation never races another seat's commit.
- A seat that needs a branch asks Kanri for it, which is one message rather
  than an act; the request is a decision, so it is worth a wake-up under
  decision-b59a.
- The close's merge is Kanri's by the same rule, which is why shoki reports
  `shoroku ready:` and Kanri fast-forwards rather than merging itself
  (decision-26fd).
- The reasoning is the tanto-bg-seats design spec of 2026-09-20.
