---
id: "7281"
title: a plan task can be right-sized for review and still too large for one dispatch's context
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-10-01
---

Source: shoroku context-cost

Observed by the context-cost plan review (2026-09-09). In that plan task 1 is
875 lines and 48 steps and task 7 is 767 lines and 44 steps; under
subagent-driven development each task is one implementer dispatch that reads
its whole task text, and the reviewer reads it again. The step granularity is
right — one action per step, every anchor and passage verbatim — and no
review reason asks for a split. The cost is the per-task read: near the point
where a task boundary is worth drawing for the implementer's context rather
than for review, which is a variable writing-plans' "task right-sizing" does
not name (it sizes by what a reviewer can check and by dependency, not by the
bytes one dispatch must hold).

Nothing failed here: both tasks ran under `sonnet` with a 1M-context Jisso
dispatching them. The observation is for the plan-authoring rules: a passage
plan whose task exceeds some line count splits it by file or by section, and
the plan's Self-Review states the largest task's size so that the reader can
judge it. What the count should be is unknown until a task fails or degrades
for size; record the sizes in the dogfood reports until then.

Related: exp-06b2, issue-5830, design-4807 (the passage-plan conventions),
superpowers writing-plans.

The first numbers, from the context-cost run (2026-09-09), recorded here
because this issue asked for sizes until a threshold can be chosen. The
outlier was **task 8, the verification-only task** — its deliverable was the
recorded output of the whole-tree sweeps and the note's checks, and it edited
the note that governs the plan's own verification:

- its implementer cost **194,495 tokens over 86 tool uses** — 1.93× the median
  implementer of the run (100,540) and 2.5× its tool uses;
- its reviewer cost **126,234 over 29 uses** — 1.39× the median reviewer
  (90,925) and 3.6× its tool uses, because that reviewer was told to *re-run*
  the checks rather than read the report of them.

So the variable this issue is looking for has two components, not one. Line
count is the visible one — task 1 was 875 lines and 48 steps, task 7 was 767
and 44. But the sweep-and-check shape is the more expensive one at equal
length, and it costs on **both** seats, because a verification-only deliverable
inverts the reviewer's standing instruction. A plan that right-sizes by lines
alone will keep producing task 8s.

Full figures in `docs/reports/2026-09-10-tanto-context-cost-dogfood.md`.

More sizes, this time from the tanto-sweep plan's own Self-Review item 4, per
its own new rule (2026-09-10). Size again has two components and they do not
pick the same task: by **line count** the largest is **task 1**, at 458 lines
and 8 steps; by **block count** the largest is **task 9**, at eight blocks —
342 lines and 14 steps. Then task 7 at 248 lines and 13 steps, task 12 at
242 lines and 12 steps, task 2 at 229 lines and 6 steps, task 10 at 227 lines
and 11 steps, and task 14 at 208 lines and 9 steps; the smallest is task 6,
at 109 lines and 6 steps. The whole plan is 3949 lines. Task 14 is again the
sweep-and-check outlier: its deliverable is recorded output rather than a
file, it makes no commit, and its reviewer is told to re-run the checks
rather than read the report — the same shape context-cost's task 8 already
showed here.

The per-batch cost shape that run measured (Jisso's context cost per batch,
from the T2 shoroku proposal's Part B item 9):

| Boundary | Bytes | Records | Wake-ups | Compactions |
| --- | --- | --- | --- | --- |
| batch A | 2,141,746 | 772 | 19 | 0 |
| batch B | 3,280,714 | 1,264 | 36 | 0 |
| batch C | 3,787,339 | 1,464 | 43 | 0 |
| batch D | 4,384,655 | 1,721 | 51 | 0 |
| final | 4,928,098 | 1,969 | 57 | 0 |

The shape, not the total, is the finding: **batch A alone is 43% of the
whole run's transcript** (2.14 of 4.93 MB) for 4 of 16 tasks, and the four
batches after it add only 1.14, 0.51, 0.59 and 0.54 MB, because batch A
built the instrument under TDD (two of its four tasks took two fix rounds
each) while every later batch is passage edits, which are cheap — the ten
passage tasks (5, 6, 7, 8, 9, 10, 11, 12, 13, 15) took zero fix rounds
between them, across 60-odd blocks. A plan that front-loads its executable
work should expect its first batch to cost as much as the rest combined.

A data point against the sweep-and-check shape's expected cost, from the
tanto-workspace run (2026-09-12). The context-cost run had measured that shape
at 1.93x the median implementer and 1.39x the median reviewer, and the plan
warned that its task 6 — a twelve-step whole-tree sweep that modifies nothing
— would cost more than its line count suggests. It did not: 84k tokens in the
implementer seat and 85k in the reviewer's, against that plan's per-task spread
of 71k-171k and 73k-99k. The sweep came in at about the cost of a mid-sized
passage task in **both** seats, even though its reviewer was told to re-run all
twelve steps rather than trust the report.

One reading, offered as a hypothesis rather than a finding: the earlier
multiplier may track a sweep task's **uncertainty** — how much the agent has to
discover about where to look — rather than its step count, and this plan's task
6 carried every command it needed, with expected values, in its brief. If that
holds, the variable this issue wants is not "is it a sweep" but "how much does
the task have to find out before it can start".

**2026-09-20, `bug-report-hold` — the sharpest instance yet, and it is
file count.** That plan's batch A (tasks 1-3), nominally the smallest batch by
its own Self-Review, read `context=370806` at the plan's **very first**
boundary against a Jisso ceiling of `216943` — 1.7× over, before any other
batch had run. The likely driver is Task 1's bulk retrofit, which touches 234
files.

This is the cleanest separation so far between the variable the plan measures
and the variable that costs: the task-sizing language ("largest task", the
Self-Review) is line-count-based throughout and did not flag this batch at all,
because a 234-file retrofit is short to *state* and expensive to *run*. A
file-count or file-read term, beside the line count and the uncertainty
hypothesis above, is what the next design weighing task size should carry.
