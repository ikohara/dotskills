---
id: "fcd3"
title: a spawned Kanri is told to read its own `[ref]` from `claude agents --json`, which carries none
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: shoroku shoki-seat S-13

`roles/kanri.md` Start step 1 has a spawned Kanri read its own
`name [ref]` from `claude agents --json` by its `sessionId`. That listing
carries `id`, `name`, `pid`, `kind`, `status` and `state`, and no `[ref]`.
The `[ref]` the roster's Name column needs was available only from
`ListAgents`' first line, which `SKILL.md`'s closing-line rule says a
terminal seat never reads for its own identity, and the spawner's result file
carries the name alone. The two rules disagree about where a spawned Kanri's
own `[ref]` comes from.

The choice is a decision: a bare-name row for a spawned Kanri, or
`ListAgents` allowed for one's own identity at start. A related lifecycle
report (issue-75a9, part 4) met the same defect.

Carrier topic: `roster-ledger` — the roster's Name cell and its matching key.
