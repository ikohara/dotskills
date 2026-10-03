---
id: "45f8"
title: boundary --plan's exit code alone misses what its check count would have caught
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-10-03
---

Source: session 2026-09-14

`lint: clean` and `replay` clean did not catch either of the
`tanto-context-ceiling` plan review's two blockers, and reading `boundary
--plan`'s exit code alone would not have either. Both required reading the
command's printed **check count** against what the "How a batch is verified"
heading's own fences should produce:

- finding 1 — a missing closing heading;
- finding 2 — a `replay-skip:` pattern silently removing a fence.

Both leave `lint` and `replay` silent, and both leave `boundary --plan`
exiting non-zero for a reason that looks, from the exit code alone, like an
ordinary pre-batch-A failure. Keikaku's own dry-run pass, before the plan
review caught these, ran `boundary --plan` and read its exit status without
counting its checks.

Proposed fix: a step in `roles/keikaku.md`'s Step 4 naming the check —
count the checks `boundary --plan` prints and compare against the fences under
the heading. That would have caught both without a second dispatch.

Distinct from the adjacent open issues — issue-f208 (a check must exit
non-zero), issue-91f6 (a stale pinned verify fence), issue-1d95
(`replay-skip` is per-fence): none of them says the *count* is the signal.

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
