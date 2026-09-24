---
id: "b7bf"
title: "`findResumed` accepts a pid-less listing entry on `sessionId` alone"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-ergonomics S-60

The bg-seat-ergonomics fix wave made the census read a `claude agents --json`
entry with no `pid` as a session that is not running (the commit "fix: a
pid-less claude agents --json entry is not read as a living session"). A
fourth reader of the same listing was not in its scope:
`skills/tanto/scripts/spawner.js`'s `findResumed` still matches on
`s.sessionId === sessionId` with no `pid` test, so a stale entry can be taken
for a resumed session. It is self-healing, since the census corrects the seat
on its next pass.

The fix is the same one-line `&& s.pid` guard, with a test whose fake listing
returns a pid-less entry. The Kikaku decision `2026-09-24-bg-seat-fixes.md`
item 3 takes it on `bg-seat-fixes` as that item's verify-only residue.

**Resolved 2026-09-24 on the `bg-seat-fixes` branch** (shoroku bg-seat-fixes
S-1). The spec review measured `findResumed` as the one reader the
`bg-seat-ergonomics` fix wave missed, and the plan wrote the condition, per
the design's section 3.4: `spawner.js`'s `findResumed` now reads
`s.sessionId === sessionId && s.pid`, with its test. decision-ebbd records
the rule for all four readers.
