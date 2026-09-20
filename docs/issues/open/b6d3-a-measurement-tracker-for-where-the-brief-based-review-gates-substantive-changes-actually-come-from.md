---
id: "b6d3"
title: a measurement tracker for where the brief-based review gate's substantive changes actually come from
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-20
---

Source: inbox 2026-09-14-sekkei-review-load-measurement

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

## Second data point, 2026-09-20, from `tanto-diet`'s own run

Three measurements from one topic in this repository, all pointing the same
way as the first.

**The spec gate's cost, and what it changed.** Every dialogue question was
answered by the recommendation and every design section by `OK`, the review
gate included (`all OK`, with both decide points falling to their defaults).
Nine of the human's turns for a 974-line spec, and none of the nine changed
the document; the human's time had gone to the Kikaku decisions taken before
the topic opened.

**A content misread the gate passed.** The plan review brief's point 2.2
misread the spec — it listed `Rulings needed` among "today's five headings"
where the spec's `check` names `Rulings`, and said "six headings" where the
verdict file has ten — and the human answered `all OK`. The form check cannot
catch a content misread, by design; the human's answer did not; the author's
own one line beside the brief was the only correction. A negative data point:
the gate passed something wrong, so no fix is proposed for the form check
itself.

**Five plan reviews across five topics.** Every plan review whose answer is
written down in a ledger: `tanto-project-config` — `all OK` (18/0/0/10, no
defaults needed); `tanto-cost` — `all OK`, one `decide` answered explicitly
(5.5), one closed by its default (4.4); `seat-lineage` — `all OK`, the one
`choose` point defaulted; `bug-report-hold` — `all OK`, both choose/decide
points defaulted per their "If unanswered"; `tanto-diet` — `all OK`, no
edits. **Five reviews, zero edits, one explicit decision.** This is the
tracker's headline figure across topics, and the rationale of the Kikaku
decision that would make the plan review written rather than waited for; that
decision's own ADR belongs to the topic that takes it.
