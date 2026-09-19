---
id: "b409"
title: a human message sent mid-turn is invisible to `reading.js --presence`
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku bug-report-hold S-33

`reading.js --presence` reads the last **wake-up** record whose origin is the
human. A human message that lands while the session is mid-turn is not a
wake-up, so the reader never sees it: the verdict is computed from a human turn
that may be hours old while the human is typing into the same window.

Measured: two `--presence` runs a minute apart both reported a 290-minute-stale
"last human turn", and the handover gate deferred on a human who was present.

Distinct from the two neighbouring presence issues. issue-bf89 is about reading
presence from *more windows than Kanri's own*; issue-1a9a is about the reader's
internal consistency. This one is a blind spot inside the single window the
rule already reads — the right transcript, the wrong record set.

The fix direction is a record kind rather than a wider read: count a human
message anywhere in the transcript, not only one that woke the session.
