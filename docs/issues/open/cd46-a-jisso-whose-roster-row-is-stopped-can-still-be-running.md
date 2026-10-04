---
id: "cd46"
title: a Jisso whose roster row is `stopped` can still be running, and no rule acts on the census's "row stopped" line
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: shoroku shoki-seat S-9

A Jisso whose roster row is `stopped` can still be running. The fix-wave
Jisso of `tanto-issue-triage` was recorded `stopped` in the roster at the
close, but no `stop` request had been written: `seats.json` held it
`running`, and `claude agents` listed it idle for about seven hours until the
next Kanri tenure wrote the request. The census printed it under "Not held"
as `— row stopped`, which is the only signal, and nothing in
`roles/kanri.md` says to act on that line.

Two repairs, one to choose: the close's `stop` request for the last live
Jisso is written by `boundary.js record --status` together with the row
change; or the census prints a stopped-row session that is still listed under
a heading of its own, with an act named for it. Beside issue-007e (the
census's marks).

Carrier topic: `roster-ledger`.
