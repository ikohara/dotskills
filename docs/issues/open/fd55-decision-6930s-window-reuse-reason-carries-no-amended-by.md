---
id: "fd55"
title: decision-6930's window-reuse reason carries no amended_by
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-17

decision-6930's reason — "a released window **is** the queue's next seat" —
describes window reuse that ended when Jissos became spawned per batch, and
the ADR carries no `amended_by` for it. The run-owned-seats spec review found
the same of decision-5ec7's amendment text of decision-b6cb; that half is
closed at the run-owned-seats close, where decision-7a19 amends 5ec7 ("a
window is `/clear`ed and reused, not closed"). The 6930 half stays open.

A decision whose reason describes a mechanism that no longer exists, with no
link to say so, is issue-a28a's class: `docs/decisions/AGENTS.md` forbids an
amendment that only fixes wording, and has no other way to mark a stale
reason. Whether 6930 is amended, or the stale reason is left for `design/`
to contradict, needs a decision.

Carrier: Kept — `docs/decisions/AGENTS.md`'s marking rule, no topic's scope.
