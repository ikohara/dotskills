---
id: "42b5"
title: A needle cannot carry a backtick, open with an angle bracket, or share a word with new text
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-39

`passage-check.js` accepts no needle that contains a backtick or opens with
`<`, and `lint`'s `needle-in-new-text` rejects any needle that occurs in any
new block. So a status word (`cleared`, `refused`) or a generic term
(`handshake`) cannot be an O needle while the plan's own new text uses it.
In the run-owned-seats plan ten needles failed this way at the first
assembly; each was narrowed to a phrase spanning its old site, and the status
words were swept by a fence instead. A lint that accepted a needle scoped to
named files, or a needle with backticks, would have saved the narrowing.

The backtick half is issue-7c11 and the `<` half is issue-38f5; this issue
adds the `needle-in-new-text` half, and issue-4210 lists the other lint checks
the O-needle set deserves.

Carrier topic: `passage-check-hardening` — `lint`'s needle rules; 7c11, 38f5,
and 4210 are in its list.
