---
id: "a7d2"
title: "`replay` aborts on an anchor naming a `created:` path, so a plan that creates a file cannot be dry-run with anchors on it"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-13
---

Found by the Sekkei of the tanto-cost run while drafting
`docs/superpowers/plans/2026-09-12-tanto-cost.md` (2026-09-13), confirmed on
the assembled plan, and recorded as that run's dry-run failure 5
(`.tanto/tanto-cost/plan-dryrun.md`) and as deviation 3 of the plan's own
Self-Review.

`replayPlan` builds its list of base blobs from every block that names a path
and is not a `W`:

```javascript
for (const block of parsed.blocks) {
  if (block.path && block.kind !== "W") basePaths.add(block.path);
}
```

An `A` block names a path. A plan that creates a file declares it `created:`,
writes it with a `W` block — and, following the anchor rule every drafting
convention in this repository states, gives that file an anchor step. The
anchor's path has no blob at the base, so `git show <base>:<path>` throws and
the **whole** dry run exits 2 —
`fatal: path 'skills/tanto/templates/agent.md' does not exist in '<base>'` —
before a single passage is applied or a single check is run. It is not a
per-block failure; nothing else in the plan is examined.

Measured on the tanto-cost plan, which creates five files: with the five
created-path anchors present, `replay --plan <the whole plan>` exits 2 and
prints nothing but the `git` error; with them removed, it exits 0 and reports
every other check.

The fix is one condition — `basePaths` skipping the `parsed.created` set,
which `diffPlan` already collects for its own exemption — and it is small
enough that the cost of the workaround exceeds it. Until it lands, a plan that
creates a file must verify each created file with an ordinary fenced
`grep -cF` step on the needle an anchor would have used: `replay` runs that
command against the applied tree, which does hold the `W` file, and the
boundary runs it for real. That is what the tanto-cost plan does, and it means
`verify --task <n>` reports `no passages` for those tasks with no anchor to
check either.

The spec of the tanto-cost design puts `passage-check.js`'s existing
subcommands out of scope, which is why that plan works around this rather than
fixing it.

Related: issue-d0f4 (an `O` block has no survivor form), issue-c841 (the
fences `replay` and `boundary` can see at all), issue-4eef (`diff` has no
`exempt:` / `rewritten:` declaration, the same shape of gap on the other
subcommand).
