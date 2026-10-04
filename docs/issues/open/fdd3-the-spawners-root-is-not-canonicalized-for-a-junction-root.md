---
id: "fdd3"
title: the spawner's root is compared as given, and the listing's string for a junction root is unmeasured
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: shoroku shoki-seat S-70

The `shoki-seat` batch A review parked an Important finding: the spawner
compares the listing's `cwd` against its root as given, and a root reached
through a junction may be listed under another string. `realpathSync.native`
on the root was proposed and rejected for the fix wave, because `cmdRun`
makes the root the process cwd and the string the CLI lists for a junction
root is unmeasured, so a canonical form could mismatch exactly there.

A one-session probe with a junction root decides it. `boundary.js census`
shares the exposure through its own `underRoot`.

Carrier: Kept.
