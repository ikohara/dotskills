---
id: "daf5"
title: "`scripts/issues-by-finder.js` still prints a stack trace for four `--json` inputs, and its new check says \"directory\" while testing existence only"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-126

The tanto-issue-triage fix wave closed only the missing-directory case of
`--json <path>`. `scripts/issues-by-finder.js` still prints a stack trace
after the tables for:

- `--json ""`;
- `--json <an existing directory>`;
- a `--json` path whose parent is a file;
- an unwritable target.

The new check also says "directory" in its message while it tests existence
only (`scripts/issues-by-finder.js`, around line 552).

Fix: wrap the write's errors in a `UsageError`, or move the write ahead of
the render; either covers all four. Make the message say what the check
tests.
