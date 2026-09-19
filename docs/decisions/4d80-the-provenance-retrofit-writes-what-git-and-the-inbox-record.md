---
id: "4d80"
title: the provenance retrofit writes what git and the inbox copies record, and the check binds open/ and deferred/ only
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-20
updated: 2026-09-20
---

## Context

decision-76b5 made an issue's provenance one fixed body line with a closed set
of kinds. That leaves two questions for the existing tree: what the retrofit
writes onto 234 issues that predate the rule, and which status directories the
hook checks.

## Options

For what the retrofit writes:

- **`session <created>` for everything but inbox and hotfix.** Rejected: it
  discards the topic that `git log --follow` recovers for 102 write-outs, for
  nothing.
- **A subagent reading the closed ledgers against the issues to recover each
  `S-n` row.** Rejected: the ledgers are untracked and local, so the recovered
  pointer would name a file most readers cannot open, and the topic pointer is
  already true.
- **Write what git and the inbox copies record, and `session <created>`
  otherwise.** Chosen.

For the check's scope:

- **A whole-tree check, with a 305-file retrofit.** Rejected: a rule with no
  exception, bought with 71 restamps of files the docs rules already exclude
  from new reading.
- **Bind `open/` and `deferred/`; leave `resolved/` alone.** Chosen.

## Decision

The retrofit derives each issue's `Source:` line from what is actually
recorded — the commit that added the file, for the topic; an inbox copy, where
one names the issue; a hotfix commit, where the subject says so — and falls
back to `session <created>` where nothing else is recorded. The hook checks
`docs/issues/open/` and `docs/issues/deferred/` and does not check
`docs/issues/resolved/`.

## Consequences

A resolved issue may carry no provenance line, and one moved out of `resolved/`
would fail the hook until a line is added — an acceptable edge, since a
resolved issue is excluded from new reading by default. The retrofitted
`shoroku <topic>` lines name a topic rather than a row; recovering the row is
recorded as a deferred item rather than done here.
