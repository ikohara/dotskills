---
id: "f94f"
title: "`diff`'s boundary-check base and the branch's merge base are two different things, and `roles/kanri.md` calls both `<merge base>`"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-17
---

Found in the tanto-sweep-2 run and recorded in that run's ledger (S-65), with
a measured near-miss behind it.

Two different commits are needed at two different moments, and `roles/kanri.md`
names both of them `<merge base>` without distinguishing them: the base the
boundary `diff` check resolves (the plan's own base, re-resolved as the run
goes), and the branch's merge base against `main`, which a `branch.review`
dispatch needs. The two sites are the boundary-check step of Kanri's batch
loop and the `branch.review` dispatch section; they are described here by
section rather than by line number so the issue survives the file moving under
it.

The near-miss: this topic's own whole-branch-review dispatch handed the
boundary base as the merge base (R-19). The reviewer noticed and self-corrected,
so no harm was done, but the dispatch was wrong as sent and nothing in the
protocol would have caught it.

Proposed: give the two bases distinct names in `roles/kanri.md`, and record
both in the ledger's Plan section, named apart, so the next `branch.review`
dispatch reads the right one rather than the nearer one.

Not issue-909c's territory: 909c tracks the `diff` instrument's own base form
and path scope, while the fix here is wording in `roles/kanri.md` and a slot
in the ledger template.

Related: issue-909c.

2026-09-17 — A second near-miss, and a refinement of where the slot belongs.
At batch C's boundary of the `shoroku-at-close` run, Kanri first ran
`passage-check.js diff` with batch A's own exit commit as `--base` — two
boundaries back — instead of batch B's own exit commit, the correct one. The
wrong base produced dozens of `unaccounted-added` lines from every commit in
between, all attributable to prior exit-shoroku applies rather than to any
real problem, but reading exactly like the genuine noise class issue-909c
already tracks. It was caught only because the volume looked implausible for
a three-task batch, and a re-read of the ledger's Batches table row for the
*previous* batch surfaced the right commit. Nothing wrong landed, but a less
careful read of a large `unaccounted-added` dump at a real boundary could
read as "batch is dirty, hold it" on a false signal.

The refinement: the base moves per batch, so the ledger slot proposed above
belongs in the Batches table as a per-row column rather than in the Plan
section as a single value. The template's Batches table in
`skills/tanto/templates/kanri.md` today has the columns Batch, Tasks, State,
Prompt and Report, so the fix is one added column there — carrying the
batch's own exit/boundary commit — plus the boundary-check step in
`skills/tanto/roles/kanri.md` reading it mechanically as the `--base` for the
*next* batch's `diff`, rather than relying on the prose narrative to carry it
forward correctly every time.
