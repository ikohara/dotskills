---
id: "4eef"
title: tanto's diff cannot account for a change a plan describes but does not quote, and Kanri's own filings are the boundary's noise floor
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-10-03
---

Source: shoroku kisou-refresh

Two measurements from the kisou-refresh run (2026-09-11), both about what
`diff --plan <plan> --base <base>` counts as unaccounted, and both under rule
11's passage-level boundary.

**A change a plan describes in prose but does not quote.** `diff`'s rule
accounts for an added line only when a passage of the plan carries it. The
dogfood task wrote two files through a tool — the instrument's `apply`
rewrapped the H1 paragraphs of `docs/notes/AGENTS.md` and
`docs/reports/AGENTS.md` — and the plan described that outcome in prose
without quoting the lines, so the batch C boundary reported the rewrap's 5
added and 5 removed lines as unaccounted although the plan had said it would
happen; they were accounted by explanation — every added line a verbatim
line of the template — rather than by rule. A task that writes a
file through a tool should quote the tool's expected `+` lines in a fence, or
the plan should declare the path the way `created:` is declared — a
`rewritten:` declaration — so the boundary is clean by rule rather than by a
reviewer's reading.

**The conductor's own filings.** At the whole-branch boundary, 324 added
lines were unaccounted, and every one of them was an issue Kanri had filed
under `docs/issues/open/` during the run. `diff` has no notion of the
conductor's filing directory, so the noise floor of every boundary Kanri
files across is Kanri's own work. Three answers, any of which closes it: an
`exempt:` declaration for `docs/issues/open/` (the same mechanism as
`rewritten:` above), or `rewritten:` on each filed path, or a rule that Kanri
files between plans rather than during one.

Related: exp-06b2, design-4807 (rule 11; the `created:` declaration), the
kisou refresh dogfood report at
`docs/reports/2026-09-11-kisou-refresh-dogfood.md`.

**2026-09-13, the tanto-cost run's batch A — the removed side of the same
gap.** `diff`'s rule names an accepted set only for **added** lines on
`skills/tanto/scripts/passage-check.js` (Global Constraints); it says
nothing about removed ones. Task 3 split `runShell` into `runShellResult`
plus a one-line wrapper, a mandated but unquoted refactor, and produced nine
`unexplained-removed` lines with no rule to accept them — only a paragraph
of prose in the batch report accounts for them
(`.tanto/tanto-cost/batch-A-report.md`, "The nine removed lines, accounted
for"). A `rewritten:` declaration, covering both the added and the removed
side of a mandated-but-unquoted change, is exactly what this instance needs
too.

**2026-09-18, `seat-lineage` — the fix wave's own boundary check, and the
shared root cause with `replay`.** `diff` produces a long, fully expected
"unaccounted" list for any batch that is not one of the plan's own numbered
tasks: Task 34's frontmatter bump, and the whole fix wave's own text, both
authorized and neither quoted as a `P` block. The tool has no notion of any
authorized edit outside the plan's own quoted passages, which is the same
underlying gap `replay` has from the other side — issue-a7d2, where the
instrument assumes every path it handles existed at `--base`.

Stated once for both commands: the tool understands the plan's own passages and
nothing else that is authorized. A `rewritten:` declaration, already proposed
above, is the `diff` half; the `A`-block tolerance is the `replay` half.

**2026-09-20, `bug-report-hold` — the boundary check's totals are blind on
both sides, measured as a pair.** This is about the accounting `diff` reports
rather than about an unquoted change, and the two halves are symmetric.

- **Added side.** The boundary's `diff` totals (1309/234) did not grow at all
  across two consecutive batch boundaries, A and B, although four more tasks'
  real changes landed between them. Every one of batch B's edits *was*
  correctly recognized as passage-governed, which is the tool working — but it
  means the count alone cannot distinguish "nothing new happened" from
  "everything new was properly declared". Confirming which it was took a
  per-file grep the tool does not run.
- **Removed side.** The next batch's boundary needed the same manual per-file
  classification in the other direction. Task 12's old `bug-report.md` content,
  26 lines, showed as `unexplained-removed` exactly as Task 1's 234-file
  `updated:` substitution had, and nothing in the output flags a `W`-block
  target as expected-removed the way it might for a passage-governed file.

So the reporting, not only the rule, is what a reader has to work around:
whoever next tunes `diff`'s output should make the accounted and the
expected-removed sets visible, not only their totals. Alongside issue-f94f and
issue-f1a4.

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
