---
id: "4cec"
title: a usage-limit pause has no measured reading in the session listing
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-32

A deferred item of the run-owned-seats design (spec 2.6): how a seat paused
on a usage limit reads in `claude agents --json` is unmeasured, since a limit
cannot be produced on demand. The spawner's census reads the listing's
`status` and `state` for `blocked` and for a park; a paused seat may read as
either, and nothing says which.

Carrier: Kept — the spawner's listing reading, unmeasured.
