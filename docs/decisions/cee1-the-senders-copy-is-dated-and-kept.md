---
id: "cee1"
title: the sender keeps a dated copy of every report it sends, with no deletion rule
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-20
updated: 2026-09-20
---

## Context

A workspace that reports a defect to another workspace writes the report file
itself. Where that file lives on the sending side, and whether it is ever
deleted, had no rule — and under the held-until-a-close intake the sender hears
only `received:`, so its own copy is the only record it has of what it
reported.

## Options

- **A flat, undated file deleted when `received:` comes back.** Rejected: the
  sender is then left with no record of what it reported, and the rule depends
  on a reply arriving at all.
- **A dated file deleted when `received:` comes back.** Rejected: the same
  loss, one directory later.
- **A dated file under `.tanto/sent/`, kept.** Chosen.

## Decision

The sender writes its copy as `.tanto/sent/<YYYY-MM-DD>-<slug>.md` and keeps
it. There is no deletion rule.

## Consequences

`.tanto/sent/` grows without bound, which is consistent with decision-7e21's
"disk is the only cost" and is bounded in practice by how often a workspace
reports. The sender can answer "what did we report, and when" from its own
tree, without depending on the receiving repository's inbox or on a reply.
