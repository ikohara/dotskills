---
id: "bf89"
title: presence read from more than Kanri's own window
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

The human's turns in the other roles' windows, readable from the roster's
transcript paths, would sharpen the presence verdict; not done, because the
one window is enough for the rule and every further read is a cost.

decision-eee2 gates the handover and the replacement on the human's presence,
and reads presence from the last wake-up record in **Kanri's own** transcript
whose `origin.kind` is `human`. A human who is present in a Sekkei's or a
Jisso's window but has not spoken to Kanri inside the presence window reads as
absent, and the handover is deferred when it could have run.

The wider read is possible at all because of the `origin.kind` fact recorded
in `docs/notes/claude-code-sessions-observed.md` — a session can tell the
human's turns from a peer's in any transcript it may read, and the roster's
Transcript column holds the peers' paths.

Deferred: the one window satisfies the rule as written, and every additional
transcript read is paid at every boundary check.
