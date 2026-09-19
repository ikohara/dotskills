---
id: "e28c"
title: a Python pre-commit hook that prints a non-ASCII character dies with UnicodeEncodeError under cp932
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku bug-report-hold S-14

A Python pre-commit hook that prints a non-ASCII character to a cp932 stdout —
this host's default — dies with `UnicodeEncodeError` instead of printing its
message, so the contributor sees a traceback where the hook meant to explain
what to fix.

Nothing under `scripts/` or in `.pre-commit-config.yaml` sets `PYTHONUTF8` or
`PYTHONIOENCODING`, and the one hint string the repository has today is ASCII
by luck rather than by rule.

Two fixes, either sufficient: set `PYTHONUTF8=1` (or `PYTHONIOENCODING`) in the
hook entry, or rule that a hook's hint strings are ASCII and check it. The
first covers hooks not yet written; the second is free but has to be
remembered.
