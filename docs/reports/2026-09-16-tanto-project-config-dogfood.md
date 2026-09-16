# The tanto-project-config dogfood

The `tanto-project-config` run gave a kind's effort a project-level layer: a
project `tanto.json` beside the personal one, and a project-scope agent
definition that a repository can carry for itself. This report records one
thing about that run which would otherwise rot: the **per-dispatch subagent
cost of Batch B**, tasks 5 to 8 — the plan's final task-numbered batch. The
figures come from the Jisso's own Batch B report under `.tanto/`, which is
untracked and does not survive the topic; Batch A's equivalent record lives in
that batch's report in the same untracked place and is not copied here.

Batch B closed four tasks with **zero fix rounds** on any of them, and 17
parked minors, every one of which was either plan-mandated byte-exact wording
or presentational polish. Task 8 was verification-only — no commit, no diff —
and both of its reviewers re-ran all eight of its steps independently rather
than reviewing a package.

## The dispatches

Three dispatches per task for tasks 5 to 7 — one implementer and two reviewers
— and the same three for task 8, whose implementer measured rather than
edited. Twelve dispatches in all. `task.implement` ran on `sonnet`;
`task.review-spec` and `task.review-quality` on `opus`.

| Task | Kind | Model | Tokens | Tool uses | Wall clock |
| --- | --- | --- | --- | --- | --- |
| 5 | `task.implement` | sonnet | 111523 | 46 | 306s |
| 5 | `task.review-spec` | opus | 49195 | 4 | 66s |
| 5 | `task.review-quality` | opus | 48911 | 5 | 71s |
| 6 | `task.implement` | sonnet | 63697 | 25 | 123s |
| 6 | `task.review-spec` | opus | 49500 | 4 | 56s |
| 6 | `task.review-quality` | opus | 51593 | 7 | 66s |
| 7 | `task.implement` | sonnet | 113684 | 25 | 151s |
| 7 | `task.review-spec` | opus | 49909 | 6 | 63s |
| 7 | `task.review-quality` | opus | 50950 | 4 | 82s |
| 8 | `task.implement` | sonnet | 90963 | 19 | 243s |
| 8 | `task.review-spec` | opus | 56372 | 10 | 180s |
| 8 | `task.review-quality` | opus | 53127 | 6 | 87s |

Totals: **789424 tokens over 161 tool uses and 1494 seconds** of subagent wall
clock. The four implementers account for 379867 tokens, 115 tool uses and 823
seconds; the eight reviewers for 409557 tokens, 46 tool uses and 671 seconds.

## What the figures say

**The reviewers cost more than the implementers, in tokens, on a batch with no
fix rounds.** Two reviewers per task at roughly 50000 tokens each outweighs one
implementer at a median of about 101000, and they do it on a third of the tool
uses — a reviewer reads a package and answers, where an implementer edits,
lints, greps and commits. The review half of the loop is not the cheap half
just because it returns `pass`.

**The reviewers are the tight distribution; the implementers are the spread
one.** All eight reviewer dispatches fall in a narrow band, 48911 to 56372 —
about 1.15x from cheapest to dearest — while the implementers run 63697 to
113684, about 1.79x. A reviewer's cost is set by the package it is handed,
which the protocol keeps to a similar size every time; an implementer's is set
by the task, which varies by design.

**A verification-only task is not a cheap task.** Task 8 committed nothing and
still cost its implementer 90963 tokens over 243 seconds — third of the four
implementers by tokens, but the **longest** of them in wall clock, because its
work was 27 whole-tree needle sweeps plus eight check steps rather than a few
edits. Its reviewer pair was the dearest of the four pairs (109499 tokens
against 98106 to 101093 for tasks 5 to 7), and for a structural reason: with no
diff to package, each reviewer re-ran every check itself, re-deriving the
27-needle list from the plan file rather than trusting the report. Independent
re-verification is the substitute for a diff, and it prices like one.

## What this report does not cover

The cross-batch comparison — Batch A's review load against Batch B's — is
deliberately not made here. Batch A's own context figure sits at an open fork
that issue-cb19 records as unfiled, between decision-eee2's per-batch constant
and issue-7281; `docs/reports/` is frozen once written, so freezing a number
whose owner is undecided would be the wrong way round. When that fork is
settled the comparison belongs wherever the figure lands, not in a later edit
of this file.
