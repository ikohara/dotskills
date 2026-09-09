# tanto's context-cost run, measured on itself

The `context-cost` topic gave every `tanto` session a reading of its own
transcript, turned Kanri's cold read into a read of the plan's frame, made a
peer's compaction a replacement condition, ended the reuse of a Sekkei across
topics, and let a resumed session rejoin the run. It is the first `tanto` run
whose subject was its own cost, so it is also the first that can be priced
against itself. The work ran on 2026-09-09 and this report was written at the
close of that day; the figures below are all from that run.

Everything here is measured. Where a number is an instrument's own output it is
quoted as the instrument printed it.

## The run's shape

The spec and plan phase ran 15:37 to 20:41 — about five hours — with twelve
human turns: six questions, two review briefs, four confirmations. The
implementation ran eight tasks in two batches, plus the whole-branch review's
fix wave.

- **Eight tasks, eight implementer seats on `sonnet`, eight task-review seats
  on `opus`, and zero fix rounds** in either batch. No Kaiseki was created, the
  fix-loop breaker never tripped, and no finding was parked.
- **Three `DONE_WITH_CONCERNS` returns**, all three right to raise, and none
  requiring a change to the tree: two were defects in the plan's stated counts
  and one was a spec expectation the plan itself already contradicted more
  precisely.
- **Two escalations** from Jisso to Kanri. One became a plan edit — a passage
  the plan's own passage set had missed — and one was ruled as the record.
- **No resumes.** The three name changes of that day belong to the previous
  plan's close and are recorded in its report; no session in this plan was
  resumed.
- The whole-branch review returned **Ready to merge with fixes**: Critical 0,
  Important 3, Minor 8. The fix wave closed eight of those in **one dispatch
  and one commit**, followed by exactly one scoped re-review, which found all
  eight addressed and no new breakage.
- Batch A alone: four `sonnet` implementers, four `opus` reviews, zero fix
  rounds, two of the three `DONE_WITH_CONCERNS` returns, 72 passage checks and
  43 post-edit re-runs.

Across the whole run **the controller never read a task body into its own
context**: briefs and review packages were handed to subagents as files, and
the plan — 5950 lines, 6032 after the mid-run edit — was read once as its
frame.

## Measurements

### The readings of this run

One row per reading taken. The roster's archive keeps only the last per
session, which is why they are frozen here.

| Role | Name [ref] | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | dotskills-08 [88587d] | batch A boundary | 4531421 | 1702 | 43 | 0 | 3 | 1 | 0 |
| kanri | dotskills-08 [88587d] | batch B boundary | 4766406 | 1805 | 46 | 0 | 4 | 1 | 0 |
| kanri | dotskills-08 [88587d] | T2 direction | 5287752 | 1979 | 49 | 0 | 5 | 1 | 0 |
| sekkei | dotskills-04 [77f43d] | exit proposal | 2903375 | 962 | 24 | 0 | — | — | — |
| sekkei | dotskills-04 [77f43d] | exit write-out | 3202907 | 1087 | 26 | 0 | — | — | — |
| jisso | dotskills-67 [b55832] | batch A boundary | 1858705 | 430 | 4 | 0 | — | — | — |
| jisso | dotskills-67 [b55832] | batch B boundary | 2742782 | 665 | 5 | 0 | — | — | — |
| jisso | dotskills-67 [b55832] | fix-wave boundary | 3019368 | 738 | 6 | 0 | — | — | — |

Kanri's row is the resumed `dotskills-e0`'s conversation and its counters run
from 2026-09-09. **No session compacted at any point in the run.**

The two seats diverge in a way worth keeping. Kanri's wake-ups run to 49 across
five batches because a conductor is woken by every report, notice and human
turn, and each wake-up re-reads its whole context. Jisso's run to **6** across
eight tasks and a fix wave, because a controller that dispatches subagents is
woken only when one returns. Bytes tell the same story from the other side:
Kanri reaches 5.3 MB and Jisso 3.0 MB for work that produced nine commits.

### The subagent seats

Eighteen seats, dispatched by Jisso across the eight tasks and the fix wave.

| Seat | Tokens | Tool uses |
| --- | --- | --- |
| task 1 implementer / reviewer | 100,540 / 90,925 | 25 / 13 |
| task 2 implementer / reviewer | 83,067 / 71,183 | 25 / 5 |
| task 3 implementer / reviewer | 79,775 / 69,203 | 24 / 4 |
| task 4 implementer / reviewer | 104,781 / 93,813 | 34 / 4 |
| task 5 implementer / reviewer | 95,710 / 82,734 | 32 / 13 |
| task 6 implementer / reviewer | 96,157 / 84,782 | 37 / 8 |
| task 7 implementer / reviewer | 120,266 / 97,272 | 34 / 5 |
| task 8 implementer / reviewer | 194,495 / 126,234 | 86 / 29 |
| fix wave implementer / re-review | 109,165 / 98,798 | 64 / 30 |

**Totals: 1,798,900 subagent tokens over 472 tool uses.** Implementers, nine
seats: 983,956 tokens, median 100,540. Reviewers, nine seats: 814,944 tokens,
median 90,925. The controller session that dispatched all eighteen ended at
3,019,368 bytes and 738 records — roughly 2,400 subagent tokens for every
record in the controller's own transcript.

Only a controller can produce this table. Each subagent knows its own cost and
nothing else, and each dies with its report.

**Task 8 is the outlier on both seats, and it is the verification-only task.**
Its deliverable was the recorded output of the whole-tree sweeps and the note's
checks, and it edited the note that governs the plan's own verification. Its
implementer cost 194,495 tokens over 86 tool uses — **1.93×** the median
implementer and 2.5× its tool uses — and its reviewer cost 126,234 over 29
uses, **1.39×** the median reviewer and 3.6× its tool uses, because that
reviewer was told to *re-run* the checks rather than read the report of them.
Both figures are the price of that instruction, and both are worth having
before a plan decides how large a verification task may be (issue-7281).

### The spec and plan phase

Sekkei's seat, the first per-topic data point for it: five subagents against a
2.9 MB Sekkei transcript, about **1.26M subagent tokens** —

| Seat | Model | Tokens | Tool uses | Wall clock |
| --- | --- | --- | --- | --- |
| the background brief | sonnet | 66k | 21 | 2 min |
| the spec reviewer | opus | 193k | 39 | 13 min |
| the plan drafter | opus | 406k | 84 | 37 min |
| the dry run | sonnet | 362k | 155 | 49 min |
| the plan reviewer | opus | 231k | 70 | 19 min |

**The drafter and the dry run are the cost centres, not the strong-model
session.** That inverts the intuition the model ladder invites.

Kanri's own read-only seats, for comparison: the spec brief `opus`, ~5 minutes,
96k tokens, 10 tool uses; the plan brief `opus`, ~7 minutes, 115k tokens, 18
tool uses; and the whole-branch review `opus`, ~22 minutes, **233k tokens, 77
tool uses** over a 1091-line package covering thirteen paths plus the spec, the
plan's frame, both batch reports and the dry run — it replayed 44 replacement
passages, closed the rest by line coverage, and re-ran every check.

### The instruments

- **The frame.** 631 of 1891 lines, 497 of 1796, 582 of 3090, and **850 of
  6032** on this plan itself — a third or less each, and 14 percent on the
  step-heaviest. The `[steps:` marker count equals the `### Task` count.
- **The two cuts.** issue-5830 proposed cutting only the fenced blocks, which
  prints 1508 of 1891 — 20 percent saved. Cutting the whole step prints 631, or
  67 percent. In a passage plan the step prose outweighs the blocks, which is
  why the wider cut was chosen.
- **What the frame does not save on its own.** The dry-run report for this plan
  is 5038 lines, **5.9× the frame**. The cold read's economics are a function
  of two artifacts, and the saving holds only if the report is consulted
  selectively.
- **The reading against a JSON parse.** On the 8.6 MB kanri-lifecycle
  transcript the grep-only pipeline and a JSON parse agree **exactly**: 618
  user records, 534 tool results, 84 wake-ups, 1 compaction — stronger than the
  spec's claim of "within one". A wake-up is a user record carrying no tool
  result; counting every user record, as issue-e5a2 originally did, over-counts
  by the tool calls, and on that session the headline 618 was really 84.
- **Both instruments reproduce when extracted rather than retyped** — the
  reading pipeline from `SKILL.md` and the sixteen-line frame command from
  `roles/kanri.md`, printing 631/4 and 497/7 on the two reference plans.

## The plan, as a plan

72 passages across 13 files — 26 of them in one file across three tasks, with
zero anchor or old-passage overlaps. 66 anchor steps and 70 commands each
returning exactly `1`; 33 "replace exactly these N lines" leads matching; 7
spec fenced blocks and 4 of 5 blockquotes byte-identical; 3 authored lines over
80 columns, declared. A mid-run edit added a 73rd passage.

The review's method is worth recording separately from its findings: it
**reproduced the plan's edits by parsing its fenced blocks**, which made a
17-anchor finding visible in one pass with no re-run of the dry run's 211
commands. That is the intended division of labour for issue-7d14 — Sekkei runs
the commands once and writes `plan-dryrun.md`; the reviewer replays the edits
and audits the claims about them.

## What the process caught, and what it missed

It caught: every count defect that a command consumed, every passage
misplacement, and both wording problems in the fix wave — the last because the
re-review was told to judge wording against the finding rather than only the
diff.

It missed, and something else caught:

- **Old prose contradicted by a new term.** The plan's whole-tree sweep greps
  the terms the plan *introduces*; nothing grepped for prose the new terms
  contradict. `SKILL.md` enumerated the roster's columns without the one the
  new resume protocol keys on, and a task reviewer found it — no instrument of
  the plan did.
- **Prose about counts.** Six count defects survived a dry run that applied 72
  of 72 passages, because a dry run applies blocks and runs commands and does
  not audit the prose written about them.
- **An absence sweep's scope.** Two sweeps written over `skills docs` report
  red on a clean skill, because the same plan's write-out lane produces ADRs
  and design records that necessarily quote the text they supersede.
- **The reconstruct-and-compare harness.** The plan names the dry run's
  application script as the replay for its strongest alignment check; that
  script lived in the drafting session's scratchpad and was gone by the final
  boundary. The boundary substituted a cheaper durable form — every changed
  line of the merge-base diff must be text the plan literally quotes — which
  gave 443 added lines and 0 unaccounted across the thirteen files.

The through-line is that the plan's instruments verify what the plan asserts,
and the things they missed are all cases where the plan asserted nothing: an
absent column, a number no command reads, a scope never stated, a tool assumed
to outlive the session that built it.

## What this run says about cost

The design's claim is that a session's cost is measured, not guessed. Measured
here, the ranking is not what the model ladder suggests. The largest single
consumers were a `sonnet` dry run at 362k tokens and an `opus` plan drafter at
406k — both subagent seats, both in the spec phase — against 1.8M tokens spread
over eighteen implementation seats. The interactive sessions, which are the
expensive ones per turn because each wake-up re-reads everything, stayed
moderate precisely because their work was pushed into files and subagents:
Jisso orchestrated eight tasks and a fix wave in 6 wake-ups and 3.0 MB.

That is the argument for the frame read and for handing artifacts over as files,
and it is the first run in which both were true at once and measured. No
threshold follows from a single run; the rows above are the dataset's first
entries, and the number that would fire a handover or a replacement on cost
stays open as issue-40ed.
