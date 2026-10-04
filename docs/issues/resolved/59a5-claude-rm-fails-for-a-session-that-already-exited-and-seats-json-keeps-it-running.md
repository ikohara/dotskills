---
id: "59a5"
title: "`claude rm` fails for a session that already exited, and `seats.json` keeps it `running`"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-04
---

Source: shoroku experience-layer S-2

`claude rm <sessionId>` failed twice, in two different ways, for the same
shoki session at a plan close on 2026-09-22: once through the
spawner (`"error": "claude rm: "`, empty stderr, the seat left `running` in
`seats.json`), and once run directly (`No job matching '<sessionId>'`, exit
1), after the session had already exited on its own following the human's
direct interaction.

This is not issue-8016's case, the locked worktree that needs
`--force --force` (which still applied and still worked by hand). Here the
CLI's own job tracking had already dropped the session before `rm` was
attempted, so `rm` had nothing to target, and the spawner's `seats.json`
never learned it: a stale `running` entry with no session behind it.

Resolved by the shoki-seat design
(`docs/superpowers/specs/2026-10-03-shoki-seat-design.md`, section 5.1): when
`claude rm` or `claude stop` fails with `No job matching`, the CLI has
already dropped the session and the op is not an error — the seat goes
`removed` or `stopped`, the result carries `note: "already exited"`, and the
log says so; for every other failure the error text is the stderr, or the
stdout when the stderr is empty. CLI 2.1.288's `rm` help now says it "Works on
sessions that have already exited"
(`docs/notes/claude-code-sessions-observed.md`).
