---
id: "0cbb"
title: the report template drops every identifying field at the source, and the tracked-write rule stands second
status: accepted
supersedes: []
superseded_by: null
amends: ["7e21"]
amended_by: []
created: 2026-09-20
updated: 2026-09-20
---

## Context

A leak was measured before this decision: thirty tracked files and eight commit
subjects carried a sibling repository's name or the user's home path. Both
sources were structural — fields in `templates/bug-report.md` that ask the
sender to identify itself, and one sentence of the hotfix lane. The
requirement is that what this repository commits says nothing about the
repositories that use its skills.

## Options

- **Keep the repository name in the report file and rely on the tracked-write
  rule alone.** Rejected: it leans on every later writer's compliance,
  including an apply subagent's, and the measured leak is exactly what that
  reliance produces.
- **A Sensitivity line the sender sets.** Rejected: machinery that none of
  sixty reports would have needed, and a field a sender can get wrong.
- **Drop the identifying fields at the source, with the tracked-write rule as
  the second defence.** Chosen.

## Decision

The report template carries no field that identifies the sending workspace —
no name, path, session, or topic, and no quotation of its documents — so the
information never exists in the receiving repository to leak. The rule that a
tracked file or commit written from a report names it by the receiving inbox's
dated slug alone stands second, as the defence against what a sender writes
into free prose anyway.

**Amends decision-7e21** in one part only: the list of what `.tanto/` holds
gains `sent/` beside `inbox/`. The rest of decision-7e21 stands.

## Consequences

A receiving reader cannot tell which workspace a report came from, so a pattern
across one sender's reports is not visible from the tracked record; the inbox
copy's date and slug are the only handle. The gain is that the leak class is
removed where it originates rather than being caught by review, and the rule
that remains has one job instead of two.
