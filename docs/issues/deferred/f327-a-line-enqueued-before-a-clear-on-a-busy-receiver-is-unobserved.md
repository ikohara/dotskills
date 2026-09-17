---
id: "f327"
title: "a line enqueued before a `/clear`, on a busy receiver, is unobserved"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-18
updated: 2026-09-18
---

What happens to a tanto line that is **enqueued before** a window is `/clear`ed,
when that window is mid-turn at the moment the clear lands, has never been
observed. `docs/notes/claude-code-sessions-observed.md` records the other half —
a line sent to a cleared window's name **after** the clear is delivered into the
bare conversation, and the window answers the human rather than the sender —
and says in as many words that the before-a-clear case has not been observed.

It is deferred rather than open because decision-78e4's `no-role` second line
makes either outcome safe: a bare window that receives the line reads the guard
and does not act.

**The measurement to make**, when a Jisso is cleared mid-turn by accident:
whether the enqueued line is delivered to the pre-clear conversation, to the
bare one, or dropped. One observation settles it, and the sessions note is
where it belongs.

A harness behavior gap with a named measurement, not a user-stated need, so no
paired requirement.
