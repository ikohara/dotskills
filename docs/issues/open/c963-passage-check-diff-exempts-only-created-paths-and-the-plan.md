---
id: "c963"
title: "`passage-check diff` exempts only `created:` paths and the plan, and `verify` without `--task` prints bare usage"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-03
---

Source: shoroku experience-layer S-35

`diffPlan` exempts two things before it classifies an added or removed line
as unaccounted: the paths the plan declares `created:`, and the plan's own
path. Nothing else can be declared. Every boundary of the `experience-layer`
plan filtered whole path trees by regex in its own `diff` fence to get a
clean exit, which hides real errors there. Carrier topic:
`passage-check-hardening`. Three measurements of the same missing
declaration:

- **The spec's path** (S-33). `passage-check diff --base <merge base>` on a
  branch that already holds the committed spec flags every added line of the
  spec as `unaccounted-added`: the plan's path is exempt, the spec's is not,
  and nothing in the tooling or the boundary brief mentions it. The tool
  could exempt the spec path as it exempts the plan's.
- **Run-time paths** (S-35). A plan whose later tasks write what a subagent
  recommended at run time — the apply, the sweep — cannot quote the added or
  removed lines, so `diff` cannot account for them. A `diff`-side
  declaration for paths whose content is run-time (`exempt-paths:` beside
  `created:`, with the reason) would say so without a regex in a fence.
- **Prose-specified paths** (inbox 2026-09-25-passage-check-diff-and-verify-gaps).
  A plan whose test appends, reports or documentation rewrites are
  prose-specified rather than quoted produces a large
  `unaccounted-added`/`unexplained-removed` count at every boundary.
  `replay` already has a path-scoped declaration for this shape,
  `replay-skip:` (`REPLAY_SKIP_RE`, declared in a plan's Global Constraints);
  `diff` has no equivalent. Proposed: a per-path "prose-specified"
  declaration of the same shape, treated by `diffPlan` as it treats a
  `created:` path.

A second, small gap from the same inbox copy: `runVerify`'s first check,
`if (!values.plan || !values.task)`, sends an absent `--task` down the same
branch as an absent `--plan` and prints only the usage line, while a present
but non-numeric `--task` is named (`invalid --task '<value>'`).
`node scripts/passage-check.js verify --plan <any plan path>` prints only the
usage line and exits 2. Proposed: a `--plan` present with `--task` absent
prints `verify needs --task` before the usage.

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
