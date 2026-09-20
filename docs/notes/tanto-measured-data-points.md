# tanto measured data points

A register of measured figures about `tanto`'s own seats, instruments and
review patterns — the numbers a later design or model-choice decision wants to
read, and that are neither a defect (which would be an issue) nor the current
shape of the system (which would be design-4807). One dated entry per
measurement, appended at a topic's close. A figure here is a reading, not a
rule: nothing cites an entry as authority, and a later measurement that
disagrees is added beside it rather than replacing it.

## Kanri-side verification caught zero defects across a whole plan (2026-09-18)

From `seat-lineage`'s close, the outgoing Kanri's own exit proposal. A whole
plan's worth of independent Kanri-side verification at every boundary — 17
batches, a whole-branch review, a fix wave — caught **zero** real defects in
the executing Jisso's own claims; every independent re-check confirmed the
report exactly.

A cost/value data point for a long, reliable single-Jisso tenure, beside
decision-b6cb's own reasoning. It is not an argument to verify less: the
reading is what the verification cost bought on one run, and a run whose Jisso
is less reliable is exactly the run no one can identify in advance.

## One run's wake-ups, its cold/warm split, and its close timeline (2026-09-19)

Three transcripts of the `seat-lineage` run were read whole by a script, at the
paths the roster's Transcript column holds. A wake-up is a `type: user` record
whose content is not a `tool_result` array, as `scripts/reading.js` counts
them. Its cost was read from the next `assistant` record's `usage`: a wake-up
is **cold** when `cache_creation_input_tokens` plus `input_tokens` exceeds
`cache_read_input_tokens`, which is a whole re-read of the context at the
cache-write price.

| Seat | Wake-ups | Cold | Cache-creation tokens | Cache-read tokens |
| --- | --- | --- | --- | --- |
| Kanri | 32 | 27 | 10.77M | 2.9M |
| Jisso | 112 | 10 | 2.35M | 57.8M |
| Hosa | 11 | 9 | 0.63M | 0.68M |

Kanri's context at its wake-ups: 145k at the handshake, 278k at batch A1's
report, 672k at the `close` line. Jisso's 112 wake-ups are 94 peer lines, 15
subagent completions, and 3 others; 10 were cold. The cache-write price is
about twelve times the cache-read price on the same family, so the largest cost
item of the run is Kanri's cold re-read at each batch boundary, and its size is
Kanri's context, not the number of boundaries. The cache TTL of Kanri's session
is not knowable from the transcript; the cold count says the batches outlast
it.

The close's own timeline, from the Hosa and Kanri transcripts (2026-09-17 to
18, local time):

| Time | Event |
| --- | --- |
| 22:22 | Kanri receives Jisso's T2 proposal |
| 22:23 | Kanri sends Hosa the `close:` line |
| 23:51 | Hosa answers `close done:` |
| 00:06 | Kanri merges `seat-lineage` into `main` |

The next Jisso was idle for about 1 h 45 min of that close — the cost a close
run off the critical path removes.

The two cache regimes behind the cold counts, and the tool-call multiplier that
sits beside them, are in `docs/notes/claude-code-sessions-observed.md`, since
they are facts about the harness rather than about a seat.

## A Kanri tenure's context growth is bookkeeping, not batch work (2026-09-17)

Three tenures, measured independently, all pointing the same way:

- Most of one tenure's own growth came from handshake and Events bookkeeping
  around a four-window simultaneous resume, not batch work — nine Events
  entries and 25+ new `S-n` rows before any Jisso could queue.
- A second tenure grew from `context=119092` at its opening to `285342` at its
  exit (Δ≈166000), nearly all of it cross-session relay bookkeeping and
  `AskUserQuestion` round-trips; no batch had even started.
- A third grew from `125956` to `266162` (Δ≈140000) in a **single** boundary,
  almost entirely from bookkeeping around a burst of near-simultaneous
  handshakes and re-handshakes (two Jisso windows `/clear`ed and re-run under
  their old names, four fresh Jisso handshakes, one Keikaku handshake, one
  Sekkei exit) rather than from any batch verification of its own.

For whatever design next weighs a thin resident conductor against the present
one: the growth a Kanri pays for is not proportional to the work it verifies.

## The pre-review relay of a rewritten role procedure (2026-09-19)

The first measured run of `roles/sekkei.md` Step 2's clause — a passage
rewriting another role's procedure goes to that role's live session before the
reviewer. Run for `roles/hosa.md`: Kanri relayed, Hosa answered as `I-1` with a
flag (its "Not yours" section) that the spec took as a new passage. One round,
yield one passage.

## A fable Sekkei's figure for one topic (2026-09-20)

`bug-report-hold`'s Sekkei, on fable: six questions to the human (Q2, Q3, Q4 as
nine design points answered `OK`, Q5, Q6, and the brief's `all OK`), one spec
review of 22 findings (2 out of scope, 20 taken), one `brief.write`
re-dispatch, four spec commits, no `I-n` beyond the relay above. The first
fable-Sekkei cost figure, beside the opus/max Sekkei figure the `seat-lineage`
dogfood report holds.

## Where a plan review's defects were, and what the review read (2026-09-19)

Every defect that review found lives in prose no tool reads — a stop condition,
an `Expected:` line, a sweep instruction, a Self-Review mapping — and every
passage block it sampled (55 `O` needles, 2 whole-section replacements, ~30 `P`
blocks) was exact. The drafting rule "re-quote from the tree, measure every
count" is working for the layer it covers; the non-passage layer is where a
`plan.review` seat earns its cost, and the checks that found the defects were
executions (a `pre-commit` run, a `verify` run, a `grep -c`), not reading.

For calibration: the review read roughly 1,900 of the plan's 3,359 lines and
700 of the spec's 2,076, and ran ten command batches.

## Sampling a plan versus reading it whole, at one cost tier (2026-09-19)

`bug-report-hold`'s `plan.review` dispatch (fable/high, sampling four or five
tasks' blocks closely) missed **all nine** of the defects Kanri's
`plan.coldread` dispatch (fable/high, reading the whole landed plan) found:
a same-mechanism anchor bug, two script-logic gaps in a one-off retrofit
script, a frozen-report design tension, a role-authority timing gap for the
topic's own close, a live-Hosa routing gap, an artifact-routing gap for a
plan-internal finding, a user-home-path leak, and a commit-pathspec style
inconsistency. None overlapped with the five items `plan.review` did find.

Both dispatches ran on the same model and effort, so what is measured here is
*sampling* against *reading whole* at one cost tier — for whatever future
decision weighs `plan.review`'s sampling depth against its cost, beside
`roles/keikaku.md`'s existing instruction that it "spot-checks a few of its
commands rather than re-running the set."

## The ceiling-crossed handover deferred once, then fired (2026-09-19)

The handover signal deferred once on an `absent` presence verdict (the known
gap this topic filed as issue-b409) and then fired cleanly at the very next
turn-start check, once presence read `present` again. A second, cleaner
confirmation that the defer-then-fire mechanism of decision-b6cb and
decision-eee2 works as designed.

## A pure-transcription documentation plan, across three batches (2026-09-20)

Three readings from `bug-report-hold`'s own batches, which belong together:

- **Batch B.** All four tasks were pure Markdown transcription (no code, no
  tests) with plan text so literal that all four implementers reported zero
  old-text mismatches and both reviewers of every task independently
  reconstructed the same line-by-line diff-to-brief mapping. A
  passage-governed documentation plan of this shape appears to need less
  reviewer judgment than an ordinary code task and might tolerate a cheaper
  review tier in a future plan of the same kind — a data point for the
  model-selection guidance, not an argument to change a plan's own pinned
  families.
- **Batch E, reproducibility.** Three independent subagents — Task 15's
  implementer running the plan's line-count Verification block as a real gate
  for the first time, and Task 17's implementer plus both its reviewers
  independently reproducing the same 42-needle sweep and the same 10-command
  Verification block — landed on identical figures byte-for-byte, with zero
  discrepancy.
- **Batch E, the counterweight.** Both of that batch's fix rounds (Tasks 16 and
  17) came from real, non-plan-mandated defects a per-task reviewer caught that
  no earlier task or review pass had surfaced: a stale positional reference
  invalidated by an earlier task's own insertion, and a wrong causal
  explanation for a measured number in an otherwise-correct bullet. A
  report-writing task, as opposed to a pure-transcription one, still earned its
  two reviewers.

## A report's self-citation can name a source that does not exist (2026-09-20)

Two different implementer subagents in one batch (Tasks 9 and 10) independently
cited "the brief's Git-Bash workaround note" as the reason for substituting a
literal in-repo `passage-check.js` path. No such note exists in either brief
file: the workaround text was given only in the dispatch prompt. Both
substitutions were harmless and produced the correct result.

For whoever tunes the implementer-prompt template: dispatch-prompt-only context
can get misattributed to "the brief" in an implementer's own report, which
lowers the evidentiary weight of a report's self-citations. A controller
reading a report closely catches it; one that trusts the report at face value
does not.

## What a pre-diagnosed, single-clause fix wave cost (2026-09-20)

`bug-report-hold`'s fix wave, measured on both halves.

- **The review half.** The finding arrived from Kanri's batch prompt already
  fully diagnosed — exact old text, exact source-of-truth paragraph and line
  range, and the shape of the fix — yet closing it still cost one
  `task.implement` dispatch plus two full opus `task.review-spec` /
  `task.review-quality` dispatches, roughly 150k combined subagent tokens
  across three dispatches, for a three-line, one-clause wording change
  verified by direct textual comparison against a paragraph both reviewers
  were pointed at explicitly. The two-reviewer gate caught nothing a single
  reviewer plus the implementer's own diff-level self-check would not likely
  have caught.
- **The Start half.** That fix wave's Jisso read the full 3387-line plan,
  roughly 1125 of the spec's 2076 lines, and roughly 507 of the ledger's 696
  lines before touching the one fix — pushing its own reading to
  `context=235575` against its `218234` ceiling before any dispatch ran, for a
  fix that touched none of the plan's 17 numbered tasks.

Both halves are instances, not rulings, for a future decision on a lighter gate
and a lighter Start for a Kanri-pre-diagnosed, single-clause fix wave
specifically — as distinct from a whole-branch review's less precisely scoped
findings. issue-96f2 is the sibling gap (a fix wave has no instrument aimed at
it); the Start-side sentence landed at this close in `roles/jisso.md`.

## A mid-tenure Kanri handover cost a Sekkei nothing (2026-09-14)

The first Sekkei-side observation of a Kanri handover in this repository,
offered by a reporter as evidence rather than as a defect. Kanri changed names
between that Sekkei's `spec-review:` line and its `review-ready:` line; the
`kanri-address:` line arrived as a cross-session message, the next three sends
from that Sekkei went to the new name, and nothing was lost or repeated.

Confirming evidence for decision-de63's handover claim.

## What the tanto-diet spec and plan stages cost, seat by seat (2026-09-20)

**The Sekkei.** A fable Sekkei writing a 974-line spec whose inputs were read
section-wise: `context=239298` at its resume and `context=333845` at its
exit, on a transcript of 2,253,437 B, 700 records, 23 wake-ups, 0
compactions. Its two dispatched subagents cost 192,984 and 139,706 tokens.
The second fable-Sekkei figure in this note, and the first with a context
reading beside it.

**The Keikaku.** Drafting, reviewing, post-merge re-authoring, and
cold-read-answering one plan cost **seven `plan.draft` dispatches** — one
initial and six resumes of the same subagent — totalling roughly 3.16M
subagent tokens, averaging about 34 minutes of wall time each, plus one
`plan.review` dispatch (~273K) and one `brief.write` dispatch (~133K). The
seat's own context grew from `context=89791` at its handshake to
`context=401875` at its exit, over 4×, entirely from reading the spec, the
dialogue, the reviews and the cold-read reports, and from the text of eight
resumed-agent hand-back messages. That last item is itself the measurement: a
**resumed** subagent's report stays in the parent's transcript permanently,
where a fresh dispatch's context would have been thrown away — the resume
buys continuity at the price of the parent's own context.

**The cold read.** The `plan.coldread` dispatch for the same plan (fable, one
run, no resumes) cost 238,355 subagent tokens, 20 tool uses and about 12
minutes, reading the spec whole, both frame stages, the dry-run report, and
running one pre-flight `diff --base`. It returned 7 independently-verified
questions, all 7 of which led to a real plan or spec edit. 238K against the
drafting cycle's ~3.16M is the evidence for keeping the cold read a single
dispatch rather than folding it into Kanri's own resident reading.

## How much contract a Kanri reads before its first word (2026-09-20)

File sizes in this tree: `skills/tanto/SKILL.md` 76,301 bytes,
`roles/kanri.md` 97,484, `roles/keikaku.md` 22,208, `roles/jisso.md` 20,274,
`roles/sekkei.md` 12,187; the whole skill's prose 287,489. At four bytes a
token, a Kanri reads about **43,000 tokens of contract before its first
word**. A Kikaku seat's first reading in the same tree was `context=80670`
before any work at all.

The figure a later diet or model-choice decision wants, and the reason the
role-file diet (issue-cca9) is measured in bytes of prose rather than in
sections.

## What the split reviewer pair caught, and where its view is narrow (2026-09-20)

Three observations from `tanto-diet`'s four content batches on the split of
SDD's combined task-reviewer role into `task.review-spec` and
`task.review-quality`, dispatched as two separate subagents per task.

- **Real redundancy on a mechanical task.** Both reviewers of task 4
  independently verified a byte-exact 172-line transcription against the
  plan's own `W4.1` block by two different methods — one wrote a Python diff,
  one did a manual line-by-line extraction and count — and reached the same
  zero-mismatch result. The first data point in this note that shows the
  split buying redundancy rather than doubled cost.
- **Different things caught on the same diff.** Both task-12 reviewers and
  both task-13 reviewers re-derived the batch's `grep` count expectations
  from the diff's own content rather than trusting the report's printed
  numbers; the "cannot verify from diff" items each pair raised did not
  always overlap, even though their nominal split is spec-versus-quality.
- **The narrow view's false alarm.** A task-11 quality reviewer raised, as a
  warning-shaped question, whether `boundary.verify` is a `boundary.js`
  subcommand distinct from `check`/`record`. It is not — `boundary.verify` is
  the dispatch *kind*, and `boundary.js` has exactly two subcommands. The
  Jisso resolved it from its own reading of the plan, without a ruling. A
  reviewer scoped to one diff at a time has no way to settle a cross-task
  naming question on its own, and this was the second batch in a row where
  the narrow view produced a resolvable-but-real-looking question.

issue-cb19 is the standing question these feed: the two-dispatch reviewer
split is an inference rather than an instruction.

## Four batches whose every substantive finding pointed at the plan, not the implementer (2026-09-20)

The fix-round rate against task type, from `tanto-diet`'s four content
batches, beside this note's pure-transcription figure from `bug-report-hold`.

- **Batch C (tasks 8–11).** Zero fix rounds and zero Critical or Important
  findings across all eight dispatched reviews, two per task — the highest
  clean-run density of the three batches to that point (batch A had one fix
  round on task 1 and two parked findings on task 2; batch B had none). All
  four tasks were pure prose-passage applications with no new code, which may
  be the more relevant variable than task count or reviewer count.
- **Batch D (tasks 12–15).** The plan's largest batch by file count — task 15
  alone touched nine files across sixteen passages — and it landed with zero
  fix rounds across all four tasks and all eight reviews. Every finding was
  either Minor or an Important finding explicitly traced to the plan's own
  mandated passage text, never to a deviation by an implementer.

Four batches in a row (B, C, D and the pattern's start) where the
implementers' work was clean and every substantive finding pointed at the
plan's authorship. At that point it stops being a batch-sizing figure and
becomes a signal about where a passage plan's defects actually live.

## One plan's boundary readings under a five-boundary deferral (2026-09-20)

The per-seat context figures at every boundary of one plan — the comparison
set a future topic's Kanri measures the new boundary procedure against. The
ledger holds them, and the ledger is untracked.

**The Jissos, each at its own boundary.** Batch A: `context=346643` (its own
boundary reading, not directly comparable to the others). Batch B: 299295.
Batch C: not carried in that Jisso's report line, per the ledger's own note.
Batch D: `context=373937`, the highest of the four.

**The fix wave's Jisso.** `context=349445`, far over that seat's ceiling of
218943, and it grew substantially across the three fixes plus the
self-caught correction. A fix wave dispatching six implementer rounds and six
review rounds plus a direct investigation of its own costs a lot more context
than an ordinary content batch.

**The resident Kanri, across all five.** The tenure accepted its handover at
`context=133500` and reached `context=407157` at the fix-wave boundary — a
**Δ=273657 single-tenure growth** across four content batches, one
whole-branch review dispatch and one fix wave, with no handover to reset the
count. No handover ran because the ceiling was crossed at every one of the
five boundaries while the human was away: presence was checked at 68, 106,
144, 199 and 300 minutes since the last human turn. decision-b6cb's deferral
exists precisely to trade this growth against stalling the run, and this is
the first full five-boundary example of what that trade costs one resident in
one sitting.

## What a three-fix wave landing inside mandated spans cost (2026-09-20)

`tanto-diet`'s fix wave, beside this note's single-clause fix-wave figure.
Six implementer dispatches and six review dispatches across three fixes, plus
a self-caught regression that required reverting one file and re-running the
plan's full sixteen-task verification sweep to confirm the fix —
substantially more dispatch overhead than any of the plan's four-task content
batches needed.

The cost came from the passage gate itself, which is what makes this figure
different from the pre-diagnosed one above: two of the three fixes landed
squarely inside task 8's `P8.2`, `P8.3` and `P8.4` exact-text-mandated spans,
so a correct fix still broke `verify` and had to be reverted. A batch that
edits inside an earlier task's mandated span is a materially different shape
of work from one that does not, and this plan's own batch prompt did not flag
that risk in advance for either fix. For whoever scopes the next plan's
post-review fix wave. issue-96f2 is the standing gap: a fix wave has no
instrument aimed at it.
