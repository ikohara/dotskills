---
id: "cd67"
title: "a fresh clone with unrecorded folder trust refuses a `claude --bg` spawn outright"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-ergonomics S-37

Its further lines come from the same ledger's S-8 (item 2), S-34 (the row
whose source is `batch-B-report.md`; the ledger assigned S-34 twice), and
S-55.

The bg-seat-ergonomics batch B's Task 4 measured the spawner's own command
against the real CLI in a fresh, non-worktree git clone whose folder trust
`.claude.json` does not record. `claude --bg` refused within seconds with an
explicit, actionable stderr message ("Workspace not trusted… retry"), and no
seat was created.

This is neither of the two filed trust or startup issues: not issue-b7e1 (the
agent view's dialog after a detach, with the seat running) and not
issue-fd4b (a worktree spawn hanging with no error). The citation trail of
that batch attributed it to issue-b7e1 through four artifacts before a scoped
re-review caught it. The launcher's trust hint (the bg-seat-ergonomics plan's
Task 2) works around the refusal; this issue files it.

Three further lines belong with it:

- **The measured counter-case.** The same design's own measurements found
  that a background seat does not need its folder's recorded trust: the run's
  Kanri runs `auto` in this repository with `hasTrustDialogAccepted: false`,
  and a sonnet seat ran in a folder never trusted.
- **The tension, and the untested distinction.** That counter-case and Task
  4's refusal are in tension. The untested distinction is a recorded
  `hasTrustDialogAccepted: false` against an absent key; this issue's first
  measurement separates them.
- **Why a measurement task cannot work around it.** A sandboxed session has
  no in-policy, non-interactive way to record trust for a fresh clone: the
  CLI's `-p` skips the dialog per invocation only and records nothing, and
  editing `~/.claude.json` by hand is self-modification outside a subagent's
  permission scope. Any future measurement task that spawns a real seat in a
  fresh directory hits the same wall, which is why Task 4 could not exercise
  its Steps 3-5 at all.

Related: issue-b7e1, issue-fd4b.
