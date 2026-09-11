---
id: "f851"
title: a plan or wave block that writes a YAML line is not checked against the repository's yamllint before dispatch
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-09-11
---

Measured in the kisou-refresh fix wave (2026-09-11, task 13). The wave's
P13.7 carried an approved `files:` line for `.pre-commit-config.yaml` at 132
columns; the repository's yamllint (`line-length` `max: 120`) rejected the
fix commit, and the task blocked mid-batch until Kanri amended the block to
an equivalent factored 118-column regex (R-40) — one ruling request and one
`amended:` reply, and a second round of `verify` against the amended wave.

The gap is structural under rule 11. `lint` and `replay` validate the block
grammar and the anchors, not the target file's own linters, and the
pre-commit run on the applied tree — the one check that would have caught
the line — is exactly what `replay` skips by declaration. So a block that
writes a line into a linted non-Markdown file (YAML here; a shell or
PowerShell script would meet shellcheck, shfmt, or PSScriptAnalyzer the same
way) reaches dispatch unchecked against the linter that will judge the
commit.

The fix, at Sekkei's plan review or Kanri's wave `lint`: for each block whose
target has a linter beyond markdownlint, run that linter on the block's new
text (for YAML, the line length is a one-line check) before dispatch, or
declare in the plan that the block's text has been checked and how.

Related: req-04f5, design-4807 (rule 11; `lint` and `replay`), the kisou
refresh dogfood report at `docs/reports/2026-09-11-kisou-refresh-dogfood.md`.
