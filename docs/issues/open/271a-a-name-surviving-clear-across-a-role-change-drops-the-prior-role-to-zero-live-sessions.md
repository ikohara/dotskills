---
id: "271a"
title: "a name surviving `/clear` across a role change silently drops the prior role to zero live sessions"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-24
---

Source: session 2026-09-17

A third face of the name-reuse pattern, with its own fix site.

This tenure's own `name [ref]` (`dotskills-26 [0e38fd]`) was, at handover
acceptance, byte-identical to the roster's existing **live kikaku** row — the
window had evidently been `/clear`ed and reused for a `/tanto kanri`
invocation rather than for another `/tanto kikaku`. The roster's own
`cleared` state already anticipates a name surviving `/clear` for the *same*
role (a hosa case in the `seat-lineage` ledger, 2026-09-17). This is the same
mechanism one level up: a name surviving `/clear` across a *role change*,
which silently drops the prior role to zero live sessions — here, no live
Kikaku until a fresh handshake — unless the accepting session notices the
collision itself.

Nothing in the two checklists that would catch it asks for the check. The
Start sequence's roster cold-read step in `skills/tanto/roles/kanri.md`
compares the session's own `name [ref]` with the roster's first data row —
its own role's row. The Handshake section of `skills/tanto/SKILL.md` likewise
covers only the role being started. Neither asks a new session of any role to
check its own `name [ref]` against every *other* role's live rows, so a
cross-role collision is noticed only by chance.

Proposed: have the Start sequence's roster cold-read check the incoming
session's own `name [ref]` against every live row of every role, not only the
row for the role being started, and report a match to the human as a
collision rather than leave it to be spotted by eye.

Related: issue-894d, issue-c820.

**2026-09-24, a received report — the same reuse seen from the other side**
(inbox bug-report-roster-progress-order-resumed-role-exit-shoroku-gaps, its
item 2). A Kikaku handshake arrived from the exact name and ref of a
just-replaced Kanri session, with a different transcript path — most likely
the human running `/clear` and then `/tanto kikaku` in that window, the
harness reusing the name and ref. The Handshake section's "no live roster row
for that role" check resolved it correctly by treating the transcript path as
authoritative, but the Resuming section covers a name or ref changing for the
*same* role and transcript, and nothing states that a name and ref recurring
for a *different* role is not evidence of role continuity. The report's
proposed line: name-and-ref reuse is not evidence of role continuity; only
the transcript path is — under decision-cdc4, the `sessionId`.
