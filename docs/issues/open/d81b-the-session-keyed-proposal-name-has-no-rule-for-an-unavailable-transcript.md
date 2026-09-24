---
id: "d81b"
title: the session-keyed proposal name has no rule for a Transcript that reads `unavailable`
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-ergonomics S-57

`skills/tanto/SKILL.md`'s "The files" rule names a proposal file by
`<short id>`, the first eight digits of the writing session's `sessionId`. A
session whose roster Transcript reads `unavailable` has no `sessionId` to key
on — a case the census's "No session id" heading anticipates and the naming
rule does not. The whole-branch review raised it (Important 2a) and R-11
parked it for the close.

The fix needs a choice, not a sentence: key on the `[ref]`, add a date
suffix, or refuse to name the file until the session id is known.
