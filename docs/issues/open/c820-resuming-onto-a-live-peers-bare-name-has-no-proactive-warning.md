---
id: "c820"
title: resuming onto a live peer's bare name has no proactive warning
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

A name collision this tenure caused directly, not just observed. Resuming
under `/tanto fukki` landed this session on `dotskills-27` — the exact bare
name a live Kikaku (`efc2a5`) already answered to (issue-894d's pattern,
again, but this time the *colliding* name was Kanri's own, not a peer's).
Every peer this tenure addressed afterward had to be told explicitly to
append the `[ref]`, in every message, for the rest of the session — a
standing tax the skill's own address rule already handles correctly (append
`[ref]` once `SendMessage` reports ambiguous), but nothing warns the
*colliding* session itself to start doing this proactively before the first
ambiguous-send error actually happens.

Worth a sentence in the Resuming section: on landing on a name a live peer
already holds, say so in the next line to every peer addressed, not only
after the first collision.

This is a skill-text gap, distinct from issue-894d. issue-894d records a
*harness* behavior — one dead-and-recreated session getting the same name
and ref — and is explicitly not diagnosed to a cause, outside the skill's
control. This issue is about two **concurrently live** sessions sharing a
bare name, and its fix is a sentence in `skills/tanto/SKILL.md`'s Resuming
section.
