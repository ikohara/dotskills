# The shoki-seat dogfood

This report covers the `shoki-seat` plan's run, 2026-10-03 to 2026-10-04: the
design that found the shoki start block's cause in the `--add-dir` argument
order (decision-b282), had Kanri cut the scribe's worktree
(decision-598a), turned a seat with no first turn into a notice
(decision-6c00), and made the launcher trust a heartbeat rather than a PID
(decision-262a). It records the cost of every stage's dispatches, the
seats' context readings, and the residency rows of the run, the facts that
belong to a dated, frozen record. The plan ran two implementation batches
(A, tasks 1 to 5, the scripts; B, tasks 6 to 9, the documents), one rework
of batch A (task 10), a fix wave of eight tasks (11 to 18), and the close's
shusei.

Figures are from the task notifications' usage lines (subagent tokens, tool
uses, wall time) and from each seat's own `reading.js` line
(`context=<n>`, the session's context in tokens at that moment). A ceiling
is the derived one: the session's first-turn context plus two batches of
`per_batch` 65,000.

## The spec stage

The spec review (`spec.review`, fable, high) took 190,096 tokens, 37 tool
uses and 10 minutes, and returned fifteen findings — one critical, four
important, ten minor — every one accepted. The critical finding was a defect
in the Sekkei's own section 7 that the human's answer to one dialogue
question had created: the review, not the author, caught it. The brief
writer (`brief.write`, sonnet) took 69,700 tokens, 8 tool uses and 86 s, and
passed the form check first time.

## The plan stage

The drafter (`plan.draft`, opus, high) took 504,065 tokens, 274 tool uses and
4,126 s (about 69 minutes) to write a 3,609-line plan of nine tasks and 135
blocks, applying every passage in a scratch copy with one commit per task and
running the suite at each. The reviewer (`plan.review`, fable, high) took
278,323 tokens, 33 tool uses and 854 s (about 14 minutes), and returned 0
critical, 2 important and 7 minor. The brief writer (sonnet) took 67,816
tokens, 10 tool uses and 74 s, and passed the form check first time.

## Batch A

Five implementers (Tasks 1 to 5) took 603 s, 687 s, 578 s, 592 s and 79 s on
79,761, 74,061, 100,471, 69,264 and 57,496 tokens; the spec reviews 42 to
54 s each on 59,820 to 83,483 tokens; the quality reviews 45 to 126 s on
63,082 to 81,827 tokens. Fifteen dispatches in all, about 1.1 million
subagent tokens.

The two spawner suites together took 5 min 42 s, 6 min 2 s, 6 min 54 s and
about 7 min across Tasks 1 to 4, and the whole suite (231 tests) 7 min 10 s.
The plan's "about six minutes" became seven, and a foreground command's
ten-minute ceiling has little room left (issue-46d3).

The boundary verdict was `fail` on one check, the plan's own fence holding
two backspace bytes where `\b` was meant (issue-b873), and the batch was
returned for rework when the human answered a question on the census
contract.

## The rework

The rework (`A-rework-1`, Task 10, a one-line code change, two tests and a
comment line) cost one implementer (79 s, 58,920 tokens, 17 tool uses), a
spec review (32 s, 63,606 tokens) and a quality review (55 s, 60,956
tokens): about 183,000 subagent tokens. The whole suite (233 tests) took
6 min 51 s. The Jisso, which had kept its context across the verdict, read
`context=393556` at the rework's boundary against its ceiling of 218,217.

## Batch B

Twelve dispatches — four implementers, four spec reviews, four quality
reviews — cost about 736,800 subagent tokens: implementers 64,104, 64,395,
55,535 and 51,791; spec reviews 57,394, 60,901, 56,668 and 51,762; quality
reviews 71,350, 73,975, 70,065 and 58,888. Implementers took 47 to 117 s and
reviews 19 to 69 s. They found no spec defect and one Important finding, a
plan-mandated one; the four documents tasks, pure transcription, needed no
fix round.

The Jisso's boundary reading was `context=280920` against a ceiling of
218,398 (baseline 88,398), after 745 records and 18 wake-ups for four tasks
and twelve dispatches. The cost was the reads of the plan's header and its
"How a batch is verified" (about 380 lines), the two ledgers, four task
briefs, and every hand-back.

## The fix wave

Twenty-six dispatches: nine implementer runs (eight tasks and one resumed
fix round), sixteen first reviews and one scoped re-review. Subagent tokens
from the hand-backs' usage lines: about 0.51 million for the implementers
and about 0.96 million for the reviewers, 1.46 million in all, for 71
insertions and 21 deletions in five files. The two one-line tasks cost about
0.16 million each. Only Task 14 — prose that Kanri wrote into the prompt, for
an agent instruction file — drew a finding above Minor (issue-8df8); the four
code tasks and the other three documents tasks drew none.

The Jisso's own context went from 107k to 361k — 253k, about 3.9 times
`ceiling.jisso.per_batch` — over 40 wake-ups: each hand-back arrived as a
message and again as a completion notice, and the reviewers' reports (2k to
4k tokens each) and the dispatch prompts (1k to 2k each) were re-read at
every wake-up. As measured, eight small tasks were more than three batches'
worth of Jisso context, where Rule 7 sizes a batch at three or four tasks
(issue-dccb).

The Kanri tenure that ran the wave started at `context=156129` against a
ceiling of 218,634 (baseline 88,634) — `roles/kanri.md` read in two Reads,
past the Read tool's 25,000-token cap — and reached about 207,000 by the
Jisso's proposal, after the handover's acceptance, the wave's prompt, its
boundary dispatch and the close's opening: one boundary of headroom. Giving
the wave's prompt to a `default` subagent (one run of each command, a
20-line report, 138,050 subagent tokens) kept about 40,000 out of the Kanri's
context.

## The previous close's tail, measured at this topic's opening

The `tanto-issue-triage` close's tail — the share, the census, the archive
move, the Measurements rows, the direction append — cost its Kanri about
47,000 tokens of context on a cold start of `context=157243`, about 25,000
of it one read of the roster's Residency and Events sections, and ended at
`context=203953`, 14,000 under the ceiling. Every step was a hand-written
script (issue-f02c).

## Measurements

The ledger's per-boundary readings (Kanri's, then the boundary's Jisso's;
every one in the one-hour cache regime):

| Moment | Kanri | Jisso |
| --- | --- | --- |
| The topic's opening, 2026-10-03 | 208,173 | — |
| The plan's landing (a successor session) | 192,045 | — |
| Landing steps 4 to 6, 2026-10-04 (a third session, baseline 86,169) | 130,631 at its start | — |
| Batch A | 192,246 | 339,091 |
| Batch A-rework-1 | 249,153 | 393,556 |
| Batch B | 196,933 | 280,920 |
| The fix wave | 202,925 | 360,630 |
| The shusei | 282,165 | 183,765 |

The opening and landing figures are two sessions', so their difference is
not a growth.

The residency rows of the run, taken from the roster when the close's
direction was written. The live Kanri's row (the first) is its start reading,
rewritten at the close; the archive of earlier rows is untracked, and this
table is where the readings survive.

| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Context | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | dotskills-kanri-f9de [94f2fc] | 2026-10-04 | handover accepted | 820087 | 171 | 2 | 0 | context=153903 | 0 | 0 | 0 |
| kanri | — | dotskills-kanri-d941 [5151aa] | 2026-10-04 | handover written | 1400405 | 413 | 6 | 0 | context=219773 | 2 | 0 | 0 |
| kanri | — | dotskills-kanri-ba1b [839255] | 2026-10-04 | handover written | 1361097 | 371 | 6 | 0 | context=221135 | 1 | 0 | 0 |
| kanri | — | dotskills-kanri-eedc [75a982] | 2026-10-04 | batch A-rework-1 | 1646922 | 580 | 10 | 0 | context=249153 | 0 | 0 | 0 |
| kanri | — | dotskills-kanri-a1f1 [6c4d13] | 2026-10-03 | handover written | 1470479 | 538 | 11 | 0 | context=224533 | 0 | 0 | 0 |
| kanri | — | dotskills-kanri-f504 [9838ba] | 2026-10-03 | handover written | 1309767 | 365 | 6 | 0 | context=219250 | 0 | 0 | 0 |
| kanri | — | dotskills-kanri-6e75 [7fec55] | 2026-10-03 | handover written | 1188707 | 252 | 2 | 0 | context=213217 | 0 | 1 | 0 |
| jisso | — | dotskills-jisso-shoki-seat-39f8 [9e2efd] | 2026-10-04 | batch A-rework-1 | 3115965 | 1066 | 21 | 0 | context=393556 | — | — | — |
| keikaku | — | dotskills-keikaku-shoki-seat-acb3 [15479d] | 2026-10-04 | batch A-rework-1 | 2320536 | 824 | 8 | 0 | context=327316 | — | — | — |
| jisso | — | dotskills-jisso-shoki-seat-8f6a [8c678c] | 2026-10-04 | batch B | 2091505 | 745 | 18 | 0 | context=280920 | — | — | — |
| jisso | — | dotskills-jisso-shoki-seat-ac74 [94910b] | 2026-10-04 | batch fix wave | 3083751 | 1215 | 40 | 0 | context=360630 | — | — | — |

Not in this report: the share of usage at context over the threshold, which
the close measures with `reading.js --share`, and the four measurements the
landing takes after this report is written — whether shoki ran its first
turn with no act of the human's, whether its transcript appeared under the
worktree's project slug, whether its Triage fills and review file were
unrefused, and whether the removal of its worktree returned without
`Permission denied` (issue-a881).
