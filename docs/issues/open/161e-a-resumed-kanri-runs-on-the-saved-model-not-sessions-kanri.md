---
id: "161e"
title: a Kanri resumed by the launcher runs on the last saved /model, not on sessions.kanri, and no check sees it
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: shoroku roster-ledger S-33

A Kanri resumed by the launcher after a lost background service comes back on
the model of the last `/model` the human typed (the spawner log reads "woke
session … with its saved options (--model)"), not on `sessions.kanri`. After
the 21:46 resume of 2026-10-07 the `roster-ledger` Kanri ran on `fable` until
the human typed `/model sonnet`, which also saved sonnet as the default for
new sessions.

The start sequence's model check (decision-08bc) runs only in the start
turn, so a resume's drift is seen by nobody unless the Kanri notices its own
system prompt; a limit is never a model change (decision-1708), yet a resume
changes the family silently. The open issue on Kanri's ask for a Sekkei
naming no model family is the spawn path; this is the resume path.

Carrier topic: `park-in-flight`.
