---
id: "126e"
title: "`replay` runs fenced commands with no `spawnSync` timeout"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-22
updated: 2026-10-03
---

Source: shoroku tanto-bg-seats S-22

`replayPlan`'s `runShellResult` calls `spawnSync("bash", [...], {cwd, encoding:
"utf8"})` with no `timeout` option. A fenced command that starts a resident
process therefore hangs `replay` forever.

Measured on this plan: the fence was this plan's own `spawner.js run` with no
`--once`, eligible for `replay-skip` but not actually skipped, because the
declared skip pattern was a prose paraphrase rather than a literal substring of
the fence (issue-2d69 carries that half). The hung process was 86 minutes into
wall-clock time with 8 seconds of accumulated CPU time — the diagnostic that
separates "slow" from "blocked" without inspecting the command, read via
`Get-Process -Id <winpid> | Select CPU` against the real Windows PID (`ps -W`'s
WINPID column, not the MSYS/Cygwin PID `ps aux` prints). Two real `claude --bg`
background sessions were spawned before this was caught; both self-terminated
and were `claude rm`ed once found.

A `spawnSync` timeout — even a generous one, 60s and up — on every fenced
execution inside `replayPlan` turns a silent multi-hour hang into a fast,
visible failure. This session had to build that protection ad hoc, in a
throwaway wrapper script, rather than finding it in the instrument.

Related: issue-7fa4 (the notice half: nothing in the run sees a hung foreground
tool call), issue-2d69 (the skip declaration that let the fence run at all).

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
