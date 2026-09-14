---
id: "b6d3"
title: a measurement tracker for where the brief-based review gate's substantive changes actually come from
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

A data point to accumulate across topics, not a defect with a proposed fix
(reported explicitly as a process observation on tanto's own economics, in
the style of issue-40ed).

First data point, 2026-09-14, from the `ellmx` repository's Sekkei seat on a
topic with a ~150-line parser change plus ~250 lines of tests: the spec and
plan work took 20 wake-ups and a 2.2 MB transcript on opus (0 compactions),
plus four subagent dispatches totalling roughly 676k tokens — spec review
~171k (opus, 27 tool uses, prototyped the rule and ran the existing 40 tests
before the plan existed), the plan drafter ~140k (opus, 20 tool uses), the
scratch-copy dry run ~204k (sonnet, 126 tool uses), and plan review ~161k
(opus, 53 tool uses).

The human answered all five gates — Q1, Q2, Q3 (the brainstorming-style
questions), the spec review brief, and the plan review brief — either by
picking the recommended option or with a bare "all OK". Every substantive
change actually made to the spec (a content-free-logging blocker, the
residual's cost framing, a sticky-match follower) and to the plan (a
boundary-sweep fix, a typecheck condition, a Biome line-width and 180s
fact) traces back to a subagent's review or the dry run — not to the
human's own gate answers. The brief-based review gate's design assumes the
human's answers are where quality control happens; on this topic, that is
not where it happened.

## Reproduction

Not a command — a measurement over one topic's session history:
`dialogue.md` (the human's five gate answers, all "recommended option" or
"all OK"), `spec-review.md` and `plan-review.md` (the reports whose findings
actually changed the documents), and the reporting session's own transcript
reading (2.2 MB / 777 records / 25 wake-ups / 0 compactions) for the
seat-level cost. Compare the diffs the two review reports caused against the
diffs (if any) the human's own five answers caused.

## Where seen

Reported from the `ellmx` repository — the brief-based review gate as
described in `SKILL.md`'s "Messages" section (the review-brief protocol) and
`roles/sekkei.md`; role or mode: Sekkei, exit shoroku.

## Proposed fix

None proposed by the reporter. Worth accumulating across more topics before
concluding anything about the brief-based gate's actual division of labor
between the human and the review subagents.

Reporter: `ellmx-fd [05a76d]`, repo `ellmx` (a sibling repository on the same
machine), 2026-09-14
(`.tanto/inbox/2026-09-14-sekkei-review-load-measurement.md`).
