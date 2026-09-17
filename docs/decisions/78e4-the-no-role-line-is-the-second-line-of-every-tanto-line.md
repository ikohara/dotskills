---
id: "78e4"
title: "the `no-role` line is the second line of every tanto line"
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-18
updated: 2026-09-18
---

## Context

Once windows are reused rather than closed (req-04f5), a run's line can reach a
window that has been `/clear`ed and not yet given its next role. A bare window
answers the human in its own window and replies nothing to the sender, so the
run needs a guard that a bare window itself can act on rather than a rule the
sender must remember.

## Options

- **A second line on every tanto line** — each line carries, immediately after
  the first, a `no-role` instruction telling a window with no role what to do.
- **A rule in the personal `CLAUDE.md`**, so every window of the machine holds
  it.
- **A rule in the repository `AGENTS.md`**, so every window of the repository
  holds it.
- **Both files.**
- **No second line, with a human promise** to `/clear` and re-role in one act.

## Decision

The `no-role` line is the second line of every tanto line (I-1 §3, its
"guard").

The human declined all three configuration placements: a rule in a personal or
repository instruction file cannot ride to the other repositories the human
runs tanto in, and a repository rule is an edit to an agent instruction file for
a skill's benefit. The human promise was rejected because one forgotten word
leaves a bare window running a batch.

## Consequences

- Every line the run sends carries two lines' worth of form, and the form check
  at each receiver has one more thing to match.
- The guard travels with the message rather than with the host, so it holds in
  any repository the skill runs in.
- The unobserved case — a line enqueued **before** a `/clear`, on a busy
  receiver — is safe either way under this guard, and is issue-f327.
