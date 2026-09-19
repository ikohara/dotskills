---
id: "a7d2"
title: "`replay` aborts on an anchor naming a `created:` path, so a plan that creates a file cannot be dry-run with anchors on it"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-19
---

Source: session 2026-09-13

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

## The scope is broader than `parsed.created`, 2026-09-17

Reported from `kuchidome`
(bug-report-passage-check-replay-aborts-on-non-w-block-paths): the same
`fatal: path '...' exists on disk, but not in '<base>'` abort, from the
**whole-branch review's** `replay --base <merge base>` call — `SKILL.md`'s
one documented use of `replay` against something other than the plan's own
starting commit. On a 36-task plan whose later tasks were authored as
in-flight amendments, the abort fired on a path a *later task's own `W`
block* created (not one declared `created:` at the top), and the same
report names two further cases the proposed `parsed.created`-skip in this
issue's own original text would not cover: a path created by an ordinary
fenced step or a `git mv` with no passage block naming it at all. All three
share the one root cause already named above — `replayPlan`'s base-copy
step assumes every named path existed at `--base` — but the fix needs to be
broader than skipping `parsed.created`: also skip a path that some `W`
block anywhere in the plan creates, and a path named in no block at all
that a `created:`-adjacent declaration or a `git mv` line accounts for: per
this report's own proposed spelling, record such a block's result as
`absent-at-base` and continue, rather than aborting. This is the only
place a from-base `replay` is mandated by contract (a whole-branch review),
and a plan long enough to need fix rounds or a mid-plan Kaiseki case is
exactly the kind likely to hit it — the reviewer here had to patch a
scratch copy by hand to get any signal at all, and the patch was not kept.

**2026-09-18, `seat-lineage` — a second measured instance, the `git mv`
destination case, and a reviewer's confirmation.** That plan's Tasks 34 and 35
name anchors (`A34.1`, `A34.2`, `A35.1`) whose `<path>` does not exist at
`--base` — one a `git mv` destination, one a brand-new file — and `replay`'s
base-copy step threw on the first of them, aborting the whole run. `--task`
does not narrow the copy step, so scoping the run does not avoid it. The
workaround used was a **scratch copy of the plan truncated before those two
tasks** for every dry run; it cost the plan itself nothing, because `verify` —
what actually runs at execution — never reads an anchor's `path` field.

The whole-branch reviewer hit the same abort independently and added the
consequence that matters beyond the tooling: the whole-branch review step's own
prescribed `replay` command is **not runnable as written** on a plan of this
shape, so a role file prescribes a command that fails.

The proposed tolerance is the one `W`-kind whole-file blocks already have,
extended to `A`-kind anchors: where the path does not exist at base, skip the
copy and continue — the anchor's own command is self-contained.

`passage-check.js`'s `diff` command shares the same root cause from the other
side; that half is issue-4eef.
