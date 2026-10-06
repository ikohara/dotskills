---
id: "4be6"
title: a wake by attach or by a tab loses the conversation's cache
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-32

A deferred item of the run-owned-seats design: why a wake by `claude attach`
or by a tab loses the conversation's cache where a `--resume --bg` keeps it,
after the acceptance scene's figures.

The acceptance scene's step 9 (2026-10-06, Kikaku `92cf1230` on fable and
Hosa `4c0ff6bf` on sonnet), the `usage` of the first assistant record after
each wake, as cache_creation / cache_read tokens and minutes idle since the
seat's last assistant record:

- First turns (spawn): Kikaku 94589 / 0; Hosa 60457 / 32295.
- Launcher attach and a typed turn: Kikaku after 92 minutes 125893 / 0; Hosa
  after 95 minutes 121862 / 32295.
- Tab: Kikaku after 25 minutes 118150 / 0; Kikaku after 8 minutes
  47093 / 126478.
- Kanri's `wake` and a `chore:` line: Hosa after 1 minute 3532 / 103811.

The wakes themselves cost nothing — the launcher's attaches and Kanri's
`wake` each started no turn — and the bill on the first turn after followed
the idle time (warm at 1 and 8 minutes, cold at 25, 92, and 95), not the
kind of wake. The three kinds were not measured at one idle time, so no
kind-against-kind comparison stands, and the question the design deferred is
still open: a controlled measurement at one idle time per kind would settle
it. The 32295 read on the Hosa's cold turns is taken to be a shared prefix
read from other sessions on the same family, an inference. `reading.js`
printed `ttl=5m` for the Kikaku, and its 8-minute tab turn still read the
cache, which that figure does not explain.

Carrier: Kept — a CLI measurement, no topic's file.
