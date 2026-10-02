---
id: "a4e2"
title: "`passage-check.js replay` verifies nothing for a plan that ships code, and is noisy on every skip"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-10-03
---

Source: inbox 2026-09-14-replay-vacuous-for-code-plans

Expected: `replay` gives some evidence about whether a plan's claimed test
counts and behavior actually hold, the way it does for a plan carrying
`passage-check.js` passages.

What happened: `replay` executes only fenced `bash` / `console` blocks in the
plan, and skips any fence whose first word is `git`. A code-shipping plan's
actual verification steps are `Run:` lines with an `Expected:` paragraph in
prose, not fenced shell blocks `replay` can run — and one such plan's only
fenced blocks were its four task commit commands (`git add ...; git commit
...`), all skipped. `replay` printed four skips and "0 residual O needles"
and proved nothing about the test-count ledger the plan actually cared
about; the dry run that did prove it was a separate scratch-copy execution
by a `default` subagent, which no role text asks for. Additionally, for
every skipped `git` fence `replay` echoes the whole commit message (four
messages of roughly 10 lines each in this case) — noise where a one-line
"skipped: git fence" would do. Both parts belong in this one issue: the
design choice of what `replay` should do for a plan with no
`passage-check.js` passages, and the smaller git-fence skip-noise fix.

## Reproduction

```console
node "$TANTO/scripts/passage-check.js" replay --plan docs/superpowers/plans/2026-09-11-mismatched-closer.md --base <merge base>
```

Output: four "skipped (git fence)" blocks, each echoing the full commit
message text, followed by a summary reporting 0 residual needles — for a
plan whose real verification (`node --test`, `tsc --noEmit`, the scope
sweeps) is never touched by `replay` at all, because none of it is expressed
as a `bash`/`console` fence.

## Where seen

Reported from the `ellmx` repository — `scripts/passage-check.js`, the
`replay` subcommand; role or mode: Sekkei, exit shoroku for a topic whose
plan carried no passages ("This plan carries no passages, so
`passage-check.js` is not part of the boundary," per the plan's own text).

## Proposed fix

Either have `replay` recognize `Run:` / `Expected:` prose pairs (a code
plan's actual verification unit) as well as fenced shell blocks, or have it
say plainly "this plan carries no passages / no runnable fences; replay has
nothing to check" instead of printing a vacuous 0-residual pass. Separately,
collapse a skipped `git` fence to one line instead of echoing the full
commit message.

Reporter: `ellmx-fd [05a76d]`, repo `ellmx` (a sibling repository on the same
machine), 2026-09-14
(`.tanto/inbox/2026-09-14-replay-vacuous-for-code-plans.md`).

2026-09-20, `tanto-diet`'s whole-branch review: the other side of the same
complaint. `replay` prints **no headline tally** — a reader learns the verdict
from the exit code and by scanning 513 lines for `DIFFERS:` and the needle
sweep. One closing line — `N passages applied, M commands differed from
Expected, K residual hits` — would let a boundary or a review read the result
at a glance, as `boundary.js check` already does with its `check:` line. Lands
here rather than as a text correction because it is a code change of several
lines, in the same output path as the skip noise above.

**2026-09-24, a received report — a clean run prints nothing to read**
(inbox bug-report-dispatch-mechanics-isolation-tanto-var-replay-silence, its
item 3). On a plan whose `P` blocks and `A` anchors all pass, `replay` prints
nothing but the `O` sweep. A reviewer told to "read every `P` block's
presence, every `A` value" has no line to read, and the silence that means a
pass is easy to misread as "the tool produced no output". One summary line,
`replay: N passages, M anchors clean`, would make a clean run legible to a
reader who did not write the tool — the same headline the paragraph above
asks for, from the passing side.

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
