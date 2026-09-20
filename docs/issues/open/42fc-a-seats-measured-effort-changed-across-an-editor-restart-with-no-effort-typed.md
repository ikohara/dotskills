---
id: "42fc"
title: a seat's measured effort changed across an editor restart with no `/effort` typed
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku tanto-diet S-12

Measured on `tanto-diet`'s Sekkei seat: the seat's effort read `high` before an
editor restart and `xhigh` after it, on the same transcript, with no `/effort`
typed in that window by the human's own report. The roster now records `xhigh`
against a configured `high`, so the effort check reads as a mismatch nobody
caused.

Two candidate causes, neither established from one observation: a resume
changes the per-turn effort the harness records, or the human's setting differs
across editor restarts. Which one holds is a question for the next observation
of the same shape — a seat whose effort is read on both sides of a restart.

Until then, an effort mismatch found at a handshake or a boundary that follows
an editor restart is worth checking against this issue before it is reported as
a seat running on the wrong setting.
