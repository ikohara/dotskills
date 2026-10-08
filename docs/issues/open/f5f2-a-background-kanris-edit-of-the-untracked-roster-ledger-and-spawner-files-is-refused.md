---
id: "f5f2"
title: a background Kanri's Edit/Write of the untracked roster, ledger, and spawner files is refused by the background isolation guard
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: inbox 2026-10-08-feedback-454d742

Item #1 of that copy.

A background Kanri's Edit/Write of the untracked roster, ledger, and spawner
files is refused by the harness's background isolation guard, which asks for
a worktree Kanri cannot take: those files must stay in the shared checkout.
The Kanri role could name the Bash/node write as the route.

A Kanri whose roster and ledger writes are refused is a stopped run.
`scripts/spawner.js` already spawns every seat with the CLI's background
isolation off (`bgIsolation: none`, decision-6962), so the first act is to
establish whether the guard still fires for a spawner-started Kanri and, if it
does, to name the `boundary.js record` and Bash write as the route in
`roles/kanri.md`.

Related: issue-4724, issue-a881.
