---
id: "db7f"
title: "`record --event` dedupes a peer event by its text alone"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-22
updated: 2026-09-22
---

Source: shoroku tanto-bg-seats S-3

`boundary.js`'s `writeEvent` dedupes an appended event by the line's own
trailing text: the key is `${text}` (or `${text} (batch ${batch})`), matched by
`endsWith`. Every written line does carry a `${now}` timestamp prefix, but the
dedup check never looks at it — it compares only the suffix. Two identical peer
events therefore collapse into one line, and a legitimate repeat is dropped
silently.

The `--seat` flag that batch C's task 16 landed does not close this: it feeds
`writeSeatRow`, a different function, not `writeEvent`. So a `commit-ready:`
line is protected only because its own format happens to embed
`<YYYY-MM-DD HH:MM>` in the peer-authored text; any other peer event without a
self-embedded timestamp — `commit-done:` is the clearest case — still collapses
two identical same-batch occurrences into one.

A peer-written event needs a discriminator of its own: the seat's name in the
event line, or a timestamp the dedup key actually reads. Until then, a second
`commit-ready:` after a second commit, or the same status line re-asserted by
two different peers in one batch, leaves no second record.

Related: issue-e84c (the `S-n` table's own integrity invariant, the same
instrument), and the harness-side sibling of this class — an identical
`SendMessage` resend silently dropped — recorded in
`docs/notes/claude-code-sessions-observed.md`.
