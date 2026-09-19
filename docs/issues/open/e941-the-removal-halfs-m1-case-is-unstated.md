---
id: "e941"
title: "the removal half's M1 case is unstated, so a session that removes a definition still dispatches against it"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-19
---

Source: shoroku tanto-project-config

Found by the whole-branch reviewer of the `tanto-project-config` run as Minor 2
(2026-09-16) and carried as S-48 in that run's ledger.

The skill states M1 — that the harness loads the agent definitions at session
start and does not watch the directory for changes — for the writing half of
the project pass. It says nothing about the removal half, where the same fact
bites harder: a project-scope definition that **this** session's own pass
removed was already loaded at start, and still wins for every dispatch this
session makes. The session sees a directory in which the file is gone and an
agent list in which its effort is still in force.

One sentence after the M1 sentence would say so. It belongs in
`skills/tanto/SKILL.md`, outside shoroku's write scope, so filing it is the
only move available to this write-out.

The omission is a real trap rather than a documentation nicety: a role that
runs the pass, sees the removal succeed, and then dispatches, gets the old
effort with no signal that anything is stale.

Related: issue-91fa ("not visible to this session" not accounting for a
mid-session agent-type cache refresh), issue-e2db (the project pass measured
end to end — its check 2 is exactly the removal this case concerns).
