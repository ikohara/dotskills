---
id: "d3f1"
title: seat and stage cost measurements worth carrying in the skill
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-10-03
---

Source: inbox 2026-09-17-seat-and-stage-cost-measurements

Not a defect — reference cost data measured running kuchidome's M6a/M6b/M8
and `residency-retention` topics, better carried in the skill's own
reference material (the shoroku flow, `roles/sekkei.md`, `roles/keikaku.md`)
than left in a downstream repository's notes:

1. **A four-step shoroku's cost.** A whole-topic write-out, 42 items:
   recommender (opus) 126k tokens/23 tool uses/5.6 min; apply (opus) 136k/59/
   7.8 min; against one human line. A role's exit, 7 items: 74k/13/2.3 min
   and 69k/16/2.4 min; against one human word. Both recommendations adopted
   everything — a proposal that already excludes what's in a file leaves
   the recommender little to reject.
2. **A Sekkei seat's floor.** Measured over an M8 spec: `spec.review`
   (opus) 183,670 tokens/52 tool uses/14 min for 15 findings; `brief.write`
   (fable) 114,516 tokens/12 tool uses/4 min; Sekkei's own context stood at
   296,845 tokens when the spec was accepted, after 7 wake-ups and 0
   compactions. The floor is structural: the draft, the whole review, and
   the whole brief each cross the session's own context exactly once by
   construction — plan against that sum, not a per-dispatch budget.
3. **A Keikaku seat's cost (large plan).** A 31-task plan, 8 deliverables,
   ~9,700 lines: ~82 minutes of `plan.draft` dispatch time across four
   rounds (opus: ~49/15/12.5/5.5 min), plus ~13 min `plan.review` and ~5 min
   `brief.write` (both fable). Fix rounds ran roughly a third of drafting
   cost.
4. **A Keikaku seat's cost (small, queued-topic plan).** An 8-task,
   2-batch plan against a 19-section spec under the R-4 queued-topic
   protocol: five dispatches, ~60 minutes total (`plan.draft` opus ~20.75
   min, `plan.review` fable ~9.8 min, a review fix round opus ~11.9 min/11
   findings, `brief.write` fable ~5.25 min, a cold-read fix round opus
   ~12.0 min/6 findings) — plus the protocol's own overhead (a projection
   dry run, three `replay --base <tip>` re-checks against a moving branch
   tip with one collision, both fix rounds re-verified against `HEAD`).

5. **A cost data point for the passage-check-obligations mechanism**
   (measured in this repository, 2026-09-17). Verifying 35 quoted "before"
   fragments across two concurrently-open topics' role-file rewrites —
   `shoroku-at-close`'s own plan and `seat-lineage`'s spec draft — with a
   `default`-kind dispatch on sonnet reading both documents whole plus the
   live role files, cost 161,041 subagent tokens and 48 tool uses over
   roughly 10 minutes, for a "no I-n needed" verdict: no genuine conflict
   found. Worth citing as a rough cost bound for this recurring "two topics
   editing the same skill files" check, alongside a dispatch-granularity
   data point in a kuchidome bug report relayed to Hosa on 2026-09-17.

Items 1 to 4 reported by Hosa `kuchidome-6b [d17de0]` from `C:\Users\0000105523\devel\kuchidome`,
2026-09-15 (delayed in transit — original addressee no longer live; relayed
by this repository's own Kanri 2026-09-17).

**A second data set** (inbox
`2026-10-02-seat-stage-and-task-size-measurements-second-data-set`,
appended 2026-10-03). Not a defect: three groups of measurements from one
plan that price the skill's own seats, ceiling, and plan-size rule. All
figures are subagent tokens, tool uses, and wall time as the dispatch
reported them, or context readings as the Kanri recorded them.

*1. Subagent and one-shot costs, one plan.*

| Dispatch | Model | Wall time | Tool uses | Tokens | Result |
| --- | --- | --- | --- | --- | --- |
| `spec.review` | fable | 749 s | 32 | 275,614 | 1 blocking, 8 should-fix, 12 notes |
| `brief.write` (spec stage) | sonnet | 99 s | 13 | 112,456 | failed the form check once; a resume of the same agent fixed it in 5 s |
| `plan.review` | fable | 1,067 s | 48 | 328,216 | 0 blocking, 8 should-fix, 10 notes |
| `brief.write` (plan stage) | sonnet | 143 s | 16 | 92,923 | passed the form check first time |

The `spec.review` blocking finding was a cross-check of a schema constraint
against a later pass's behavior, which the dialogue could not have caught.

Pre-flight scan on four sonnet readers, 892,839 tokens in all, 7 findings (0
blocking; 4 of them real and ruled):

| Reader | Tokens | Wall time |
| --- | --- | --- |
| pair rows | 177,288 | 324 s |
| Tasks 1-6 | 175,465 | 377 s |
| Tasks 7-12 | 290,389 | 806 s |
| Tasks 13-18 | 249,697 | 658 s |

The first dispatch of the same four readers hit the session limit before
any file was written; the table is the repeat.

Batch D, three tasks, zero fix rounds, about 781k tokens over nine
dispatches:

| Task (plan lines) | Implementer | Spec reviewer | Quality reviewer |
| --- | --- | --- | --- |
| 12 (1268) | 86.5k, 22 tool uses, 204 s | 103.9k | 103.5k |
| 13 (875) | 71.9k, 15, 138 s | 98.6k | 91.2k |
| 14 (468) | 65.5k, 14, 72 s | 80.4k | 79.3k |

One fix wave, 17 items over 27 files, one fix round, about 745k tokens over
five dispatches:

| Dispatch | Tokens | Tool uses | Wall time |
| --- | --- | --- | --- |
| implementer, first | 207,380 | 110 | 938 s (two commits) |
| implementer, round-1 resume | about 7,700 more (215,031 cumulative) | 6 | 61 s (one commit) |
| spec review | 126,962 | 14 | 158 s |
| quality review | 130,040 | 12 | 171 s |
| scoped re-review | 57,915 | 5 | 57 s |

The project's test script took 308,848 ms for 858 tests. The file holding
the one new failure took 83 s alone; the failing describe took 155 s inside
the full run. That Jisso's context was 109,275 at its first reading (after
the start sequence and the role file) and 260,131 at its report, over ten
wake-ups, against a derived ceiling of 216,868: `over`, acting on nothing,
as designed. Part of the growth was two outputs it printed instead of
aggregating.

*2. Kanri context readings against the ceiling, four tenures of one topic*
(beside issue-db0c).

| Tenure | Start reading | What it did | Ceiling |
| --- | --- | --- | --- |
| 1 | 144,313 | a close landing and a spec stage; five peer lines (landing checks, a handshake, a resumed handshake, two answers) each added 3-5k | headroom 130,000 (`batches` 2, `per_batch` 65,000) gone after about 70,000 of work |
| 2 | 155,240 (a handover) | handshake, decision, two receipts, plan landing (194,289), cold read, restart recovery, one boundary; about 14 wake-ups | crossed 216,588 at 257,644 on the post-restart resume |
| 3 | 130,304 | batches B, C, D: 186,049, 209,062, 227,547 (about 25-55k per boundary against `per_batch` 65,000) | derived 216,606, crossed at batch D |
| 4 (a spawned successor) | 153,919 at its second wake-up | start reads only | derived 216,795, so 63k of headroom, about one batch |

The baseline in tenure 1 was 86,580; the role file read in two pages plus
the handover, ledger, and roster reads are the cost above it (about 53k).
Every Jisso reported `over` (270-280k) at every boundary, with no effect, as
designed. Tenure 4 read `SKILL.md` (about 17k tokens) and `roles/kanri.md`
(about 36k tokens, two reads because the Read tool truncates at 950 lines).

*3. Task sizes, a data point for issue-7281.* The plan's largest task is
1,268 plan lines and 7 steps; then 990 (6 steps), 969 (6), 875 (6); the
other fourteen run 138 to 610. Four tasks exceed the 650-line mark the brief
set. Each is one test-first change to one or two files that cannot be left
half-edited. The only sweep-and-check task is Task 1. All four large tasks
landed with at most two fix rounds and a clean `verify`; Batch D's two of
them (1,268 and 875 lines) took the highest implementer costs in its table
with no fix round.

The reporter's three readings:

1. Costs: carry the table as reference data beside the earlier set, for
   sizing a Kanri's wall time and token budget. `spec.review` and
   `plan.review` on fable cost 275k-328k tokens and 12-18 minutes each, and
   `brief.write` on sonnet cost 90k-112k; plan for a four-reader pre-flight
   at about 900k and a three-task batch with two reviewers each at about
   780k.
2. Ceiling (issue-db0c): a Kanri that starts at a handover with 130k-155k
   and a derived ceiling of about 216k has one to two batches of room, and
   the close crossed it in three of four tenures. The earlier delivery
   (inbox `2026-10-01-tanto-findings-from-a-plan-close`, items 4 and 5)
   already asked that the baseline include the forced cold read, or the role
   file name a two-read start; these four readings are more evidence for
   either choice, and for `batches` 3 as the default if neither is adopted.
3. issue-7281: the data suggests no cap below about 1,300 plan lines when
   each task is one test-first change to one or two files; any cap should be
   keyed to files and steps (whether the task can be half-edited), not to
   lines alone.
