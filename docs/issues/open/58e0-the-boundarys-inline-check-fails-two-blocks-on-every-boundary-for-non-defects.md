---
id: "58e0"
title: the boundary's inline `check` fails two blocks on every boundary for reasons that are not defects, and the ruled failure's excerpt costs about 17 KB
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-84

On tanto-issue-triage the boundary's inline `check` failed two of the
plan's verification blocks at every boundary, neither for a defect:

- the plan's awk block, because the Bash tool collapses a doubled backslash
  in an inline command (S-59, S-76; see
  `docs/notes/bash-tool-and-script-pitfalls.md`);
- another block, because the host shell exports `FORCE_COLOR=3`, so a number
  printed by `node -e` and captured by `$(…)` carries ANSI codes (S-70; the
  same note).

Each needed a ruling of about 1500 tokens and a ledger line, at eight
boundaries (R-4, R-6, R-9, R-11 to R-13, R-15, R-16).

**The ruled failure's excerpt is the most expensive read of a boundary**
(S-128). At the fix wave's boundary one `sections` call for "Failures"
returned the pass 6 output whole — 50 false `bad line` reports of about 300
characters each plus the awk warnings, roughly 17 KB — and that single read
carried the Kanri from `context=187357` to `context=224905`, over its
ceiling of 218112. The cost of a ruled, known failure is paid again at
every boundary.

Proposed, one or more of:

- `boundary.js check` runs a fenced block from a file, not inline;
- `check` sets `FORCE_COLOR=0`;
- `templates/boundary-brief.md` caps a failure excerpt (the first ten lines
  and a count) when its pass is a ruled artifact.

Which side changes is a decision.
