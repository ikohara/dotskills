---
id: "02ab"
title: a stale `live` row read as superseded by inference, with no mechanical signal
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku bug-report-hold S-35

`SKILL.md`'s "On a handshake" and "Resuming" cases decide whether a roster row
is still that session's by a mechanical signal — a `no-role` reply, or a send
error. During a mass editor-restart resume, one tenure twice treated a stale
`live` row as superseded by **inference** instead: the old name was gone from
`ListAgents`, and a fresh handshake was doing the same role and the same topic,
so the row was rewritten without the signal being obtained.

The inference was right both times, and it is not obviously wrong as a rule —
during a mass resume the mechanical signal costs a send to a name that no
longer exists. But it is a third path the contract does not describe, taken
under time pressure, and what it risks is exactly the case issue-c820 names:
resuming onto a live peer's bare name, where the inference would be wrong and
there is no proactive warning.

The decision this needs from the human: does the protocol accept the inference
as a third path, with its conditions written down, or must the mechanical
signal always be obtained first?
