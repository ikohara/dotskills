---
id: "df83"
title: Kanri's stop and spawn requests have no command and are hand-written JSON files
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: inbox 2026-10-08-feedback-ec9eae4

Item #43 of that copy.

Kanri's `stop` and `spawn` requests have no command in the request tool, so
each is a hand-written JSON file moved into place.

`boundary.js request` has `attention` alone; every `spawn`, `stop`, `wake`,
and `release` of `roles/kanri.md`'s Create and Replace tables is a JSON file
Kanri writes by hand from `templates/spawn-request.md`. That is the free-hand
editing `roster-ledger` took out of the roster and left in the requests
directory.

Related: issue-37ec (ten spawner, record and shell-transport gaps),
issue-1a27 (no record path for a ruling), issue-4724.
