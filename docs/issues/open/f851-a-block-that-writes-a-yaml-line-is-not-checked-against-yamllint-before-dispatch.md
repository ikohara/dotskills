---
id: "f851"
title: a plan or wave block that writes a YAML line is not checked against the repository's yamllint before dispatch
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-10-01
---

Source: shoroku kisou-refresh

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

**This issue's scope is wider than its own text says.** The paragraph above
excludes markdownlint — "a block whose target has a linter beyond markdownlint"
— on the assumption that a Markdown block is already covered by the checks a
passage plan runs. It is not. `lint` and `replay` validate the block grammar
and the anchors; neither runs markdownlint over a block's **new text**, so a
Markdown block meets its linter for the first time at the commit, exactly as a
YAML one does.

Measured in the tanto-workspace run (2026-09-12), twice in one plan. Blocks
`P2.1` (`roles/kanri.md`) and `P3.8` (`roles/kaiseki.md`) each spelled a YAML
line as the inline code span `` `  default: false` ``, with two leading spaces
that are load-bearing content. `MD038`'s `--fix` strips leading space inside a
code span and then reports zero errors, so the text that reaches the commit is
not the text the plan carries and the passage can never match — and the plan's
own note beside `P3.8` insisted the span "carries its two leading spaces". Both
blocks had to be re-authored by a controller ruling, putting the indentation in
prose, and both report `passage-absent` for the life of the plan (issue-7c28).
The counter-case confirms the mechanism: `skills/**/templates/**` is in this
repository's markdownlint ignore list, and the identical span landed byte-exact
in a template.

So the fix generalizes: for each block, run the **destination's own** lint
configuration over the block's new text before dispatch — not the repository's
default, since the ignore list is what decides whether markdownlint sees the
file at all.

Related: exp-06b2, design-4807 (rule 11; `lint` and `replay`), the kisou
refresh dogfood report at `docs/reports/2026-09-11-kisou-refresh-dogfood.md`,
`docs/notes/authoring-a-passage-plan.md` ("A block must survive its
destination's linter"), issue-7c28, issue-ea3c.
