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

**The reviewer half, from `tanto-bg-seats` (2026-09-22).** The `spec.review`
dispatch on fable read the spec, thirty-six ADRs, the requirements, every skill
file the spec touches, and the four Kikaku files, and returned **31 findings in
18 minutes for about 397k subagent tokens**; four were high. One of the four
(F-1: the launcher would have attached to the outgoing interactive Kanri and
never spawned the first background one) closed the one path by which the design
comes into existence. A reviewer that re-runs the spec's own "Measured" figures
and reads the files the change list touches earns the top family's cost at a
spec that rewires the run's lifecycle.

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

**Where `tanto-bg-seats`'s were, across three passes (2026-09-22).** The single
most repeated defect class in that topic was a `P` block's *old* text
transcribed from memory or from a paraphrase instead of copied verbatim from
the file on disk: **six** such mismatches at the dry run (three truncated
lead-ins, one fabricated phrase, two miscounted or malformed anchors), and the
plan review's own major finding was the same error in reverse — **nine missing
passages**, text the drafter correctly identified for retirement but never
wrote a block for, because what was being transcribed was the spec's "Old
values" list, itself written from *a reading* of the file rather than from a
fresh sweep of it. `replay`'s residual-needle sweep catches only a retirement
that already has a declared `O` needle; it is structurally blind to one that
was never named at all. Dry run, plan review, and Kanri's own cold read each
found sites the other two did not — **three passes were not redundant here**.

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

## The cold read is the one layer that reads a plan as prose (2026-09-23)

In the `bg-seat-ergonomics` plan stage, Kanri's `plan.coldread` caught a
contradiction in Keikaku's own added Global Constraints prose: a claim that
Task 6 and the `SKILL.md` tasks land in "the same batch", where the plan's own
batch cut puts them one batch apart. Neither Keikaku's dry run (`lint`,
`replay`, `frame`, `boundary`, which check passages and headings against each
other, not narrative claims about batch scheduling) nor the dispatched
`plan.review`'s independent re-run of the same checks surfaced it.

Both of those are re-execution checks. A prose inconsistency about which batch
a task lands in is not checked against the Batches table by any tool today;
the cold read is the one layer that reads the plan as prose rather than
re-running it, and it is what caught this one. Beside the sampling entry
above, for the same review-depth decision.

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

**Five more instances, from `tanto-bg-seats` (2026-09-22).** Four of the five
are convergence readings — independently dispatched reviewers, no shared
context, reaching the same verdict from the source rather than from each
other's output.

- **A finding a spec reading had no reason to look for.** Task 2's
  `task.review-quality` reviewer surfaced a security-flavored finding (a darwin
  AppleScript injection) that a spec-scoped reading of the same diff would never
  have gone looking for, since it is invisible from "does this match the brief"
  alone. The split paid for itself at least once on that batch.
- **Convergence on an implementer's own declared deviation.** Task 6's
  implementer returned `DONE_WITH_CONCERNS` over a `readSeats` reordering,
  surfaced honestly with a reproducible before/after (both orderings rerun 3×
  each) and a named root cause in another task's already-landed code. Both
  reviewers independently traced the same `spawner.js` census/`readSeats`
  interaction from source and reached the same verdict — a stronger form of
  confirmation than either review alone, and the pattern's first case.
- **Convergence on a plan-authored bug.** Task 16's pairing-key mismatch: both
  reviewers converged on the identical root cause, derived from the actual
  behavior of `writeEvent` rather than from reading each other's output. The
  second convergence of the plan, on a different class of defect from task 6's.
- **Convergence on a regression the fix wave itself introduced.** Task 25: both
  reviewers converged on the identical root cause *and* produced independent
  reproductions of the same regression — the R-12 fix keying on `seats.json`'s
  file mtime rather than on per-seat identity, which would have attached the
  human to the outgoing Kanri and suppressed the successor spawn at every real
  handover. The first case of the convergence pattern catching a genuine
  functional regression introduced by a fix wave, rather than a pre-existing
  defect the plan shipped.
- **The methods differ, not only the scopes.** Task 27's ten-site enumeration
  was read two ways: one reviewer verified each site in turn against its cited
  cross-reference, catching every arithmetic and citation error but reading the
  addressing fix as complete once `roles/kanri.md`'s own text checked out; the
  other ran a deliberate side-by-side cross-file consistency pass and caught
  that `SKILL.md`'s own copy of the same fact had been left stale. "Does every
  site agree with every other site" is a distinct check from "is each site
  individually correct".

One more from `bg-seat-ergonomics` (2026-09-24): Task 3's `task.review-quality`
reviewer independently re-derived the "malformed listing read as empty"
failure mode of `boundary.js census` that the plan review had already found
and accepted as a known gap (issue-5e5b) — two readers, at two stages,
catching the same thing, which is the pipeline's redundancy working as
intended rather than wasted effort.

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

**The mechanism's last major tenure, from `tanto-bg-seats` (2026-09-22).** The
presence-gated deferral worked exactly as designed in what may be its final
tenure before decision-345b retires it. Signal 4 (ceiling crossed) fired at
every boundary from batch A1 through batch B1 — that tenure never once dropped
below `ceiling.kanri`'s threshold after the plan landed — and deferred each
time because the human was genuinely absent: `reading.js --presence` read
**243, 315 and 406 minutes** since the last human turn. The moment the human
returned and drove the reboot-recovery exchange directly, the very next
boundary (B2) read `present` and the handover ran for real rather than
deferring a fourth time. Never stall the run while the human is away, never let
a resident grow past its close unnoticed once the human is back — the
before-picture for whatever measures the gate's removal.

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

**The opposite reading, from `tanto-bg-seats` (2026-09-22).** That plan's fix
wave closed **all four tasks — 29 findings — at one boundary**, with exactly
one fix round per task that needed one (three of the four), none reaching a
second round and no Kaiseki trigger: every fix round's own scoped re-review
verdicted all findings addressed on its first attempt. The fastest per-task
convergence of any multi-task batch in that plan, against batch D's two fix
rounds on two of its four tasks. Beside the two figures above, it is the third
shape a fix wave has taken in this note, and the cheapest.

## Six of six dialogue questions, 28 of 28 brief points, all as recommended (2026-09-22)

`tanto-bg-seats`'s spec dialogue asked the human six design questions, and each
was answered as recommended in a single word of assent (D-1 through D-6, three
distinct one-word forms between them); the spec brief's 28 points came back as
one `all OK`. The same pattern the
second Kikaku file measured for plan briefs — five reviews, zero edits.

One topic is one data point. If it repeats, the question it raises is whether
the spec dialogue's design questions could be answered by default too, with the
human overriding by exception, the way a plan brief's `— If unanswered:`
clauses already work. That question belongs to a Kikaku consultation, not to a
spec, and nothing here decides it.

## Two self-handshakes into new roles, covered by the re-invocation rule (2026-09-22)

Two peers (`dotskills-9d`, `dotskills-03`) self-handshook into new roles on
`tanto-bg-seats` with no Kanri create request going out first — both were
windows the human had open from the previous topic and reused directly.
`SKILL.md`'s "On a handshake" re-invocation handling (a name already on a row,
different transcript → mark the old row `cleared`, accept the new handshake as
any other) covered both cleanly, with no special-casing needed.

A positive reading of a standing mechanism, worth one line and no change. It is
distinct from the create-request path, which that tenure never used at all:
Keikaku's handshake arrived before any create request had been sent for it.

## An `O`-needle count grew 116 → 129 → 132 across three passes (2026-09-22)

Across the dry run's fixes, the plan review's fixes, and the cold read's fixes,
`tanto-bg-seats`'s plan grew its own `O`-needle count from **116 to 129 to
132** (the exit's last reading), tracking almost exactly the number of
retirements found missing at each stage.

A rough proxy, across one topic, for how much of a plan's real coverage a first
draft actually has, against how much is found only by a reviewer or a cold
read. Worth a second reading if the measurement is ever repeated on another
plan.

## A pre-flight conflict scan reads a plan's headers, not its bodies (2026-09-22)

A pre-flight producer/consumer scan over a large plan (**9893 lines, 23 tasks,
~442KB**) is tractable without reading every task's full code. Extracting only
each task's Files, Interfaces, Named-mechanism-sites and
Old-values-contradicted sections — stopping before the Whole-file, Passages and
Anchors bodies — with a small Node script cut the read from ~442KB to **~99KB**
while still catching every producer/consumer pair the scan needs.

A technique figure for the next Jisso 1 facing a plan of that size.

## The commit-trailer drift stopped when the dispatch wording got forceful (2026-09-22)

Task 2 of `tanto-bg-seats` wrote `Co-Authored-By: Claude Sonnet 5
<noreply@anthropic.com>` although both the dispatch prompt and the plan's
Global Constraints specified the shorter exact text. It reproduced **once** and
did not reproduce again once the dispatch prompt was made more forceful and
explicit about overriding the implementer's own environment default.

The fix is in the dispatch wording, not in `task.implement`'s model or effort —
which is the reading a later model-choice decision would otherwise reach for.

## The review layer earned its cost with no subagent-produced artifact (2026-09-22)

Batch B2's two direct-execution tasks — the ones whose defining act only the
controller session could perform — still each got the full two-reviewer
treatment (`task.review-spec`, `task.review-quality`) against the report they
produced. Task 12's review loop caught **two real Important gaps** its Jisso's
own first draft had not noticed: a silently substituted acceptance criterion,
and a missing negative control.

The review layer's value did not depend on a subagent having produced the
artifact. A data point against "no subagent means no review" as a safe
simplification — it would not have been one here.

## Twenty-five neighbor sentences contradicted a landed passage (2026-09-22)

Every one of batch D's four tasks turned up the identical defect class on
review: an old sentence sitting just *outside* a passage's own stated old-text
scope, now contradicting a neighboring passage the same task had just landed.
**7 sites in task 20, 5 in task 21, 11 in task 22, and 2 fixed plus 4 more
found-but-out-of-scope in task 23 — 25+ sites across one batch.**

Every one was caught by the two-reviewer pass, and none by the plan's own three
earlier passes (dry run, plan review, cold read) or by any needle sweep,
because none of these sentences was itself the *target* of a passage — each was
a neighbor of one. A plan authored as literal old-text/new-text passages may
have a structural blind spot at exactly this seam, distinct from batch C's
task-16 case (a passage's own mandated text being wrong on arrival): here the
passage's own text was right, and the damage was in what it left standing next
to itself. `docs/notes/authoring-a-passage-plan.md` carries the authoring half.

## "Name, not fix" for stray text, across four tasks (2026-09-22)

Instructing each implementer to *name, not fix* any stray text it noticed —
rather than silently leaving it, or silently fixing it — worked cleanly across
all four of batch D's tasks. Every one of the implementers' own self-flagged
spots (4 of 4 in task 20, implicitly via its own concern; 4 in task 22; 2 in
task 23) was independently confirmed real by both reviewers, and one (task 23's
"three slots") was upgraded from the implementer's own framing to **Critical**
on independent grounds: the file is read from disk at every real boundary,
including the plan's own next one.

The reviewers' own further sweeps then found more of the same class the
implementers had missed — 2 more in task 20, 1 in task 21, 3 in task 22, 4 in
task 23. The two-reviewer pass caught, consistently, what a single
implementer's self-check did not.

## The whole-tree sweep read zero on the final batch's first landing (2026-09-22)

The whole-tree sweep — fence 4 of "How a batch is verified", and the single
property batch D's four tasks exist to deliver — read `0` across **all six
needles and all 36 files** of `skills/tanto/` on task 23's very first landing,
before any fix round ran.

The plan's own needle set, built across three review passes before
implementation began, held on first contact with the applied tree.

## A subagent told to verify a fact before writing it did not (2026-09-22)

A `plan.draft` dispatch drafting the fix-wave batch prompt was explicitly
instructed to verify its stated base commit's subject against `git log -1
--format=%s` before writing it, and did not: the file it returned named a stale
subject, several commits behind HEAD. The controller's own independent check
before sending caught and fixed it.

A data point on whether an environment-fact instruction inside a subagent's
prompt ("check X before writing Y") is reliably followed — or whether a
dispatcher should re-verify any fact a brief asked a subagent to look up, even
when it was told to.

## The two free-form dispatches had no form defect; three templated ones did (2026-09-22)

The whole-branch review (36 findings) and the fix-wave draft (a 29-item
coverage table) both arrived internally consistent and needed no second
dispatch to fix a form failure — unlike three of the same plan's earlier
subagent artifacts (the review brief's Japanese-heading defect, the
passage-check heading-format defect, and `exit-sekkei`'s own two).

Both of the clean dispatches carried substantially more free-form judgment —
severity triage, task grouping — than a templated brief render does. The
correlation runs against the direction that would be guessed: more room for
judgment did not produce more form defects here.

## A plan-mandated passage carried a functional bug no static pass could see (2026-09-22)

A plan-mandated passage (P16.5) containing a genuine *functional* bug, rather
than an inconsistency or a stale reference, is a new category for this run: the
plan's own literal, verbatim-required text was wrong on arrival, not merely out
of date. The plan's earlier plan-defect rulings — R-3, and batch D's own case —
were about implementation choices diverging from stale plan text.

It was invisible to all three of the plan's static passes (dry run, plan
review, cold read) because nothing in the plan exercises `--ledger` until task
23. A load-bearing defect in **not-yet-wired** code is structurally harder for
a static review to catch than one in code a test suite already exercises — a
bound on what a static pass can be expected to find in additive,
forward-declared mechanisms.

## Every reviewer of a prose-only task re-ran the suite or the sweep itself (2026-09-22)

Batch C's tasks 17-19 (templates and prose, zero application code) each still
received the full two-reviewer treatment, and every one of the **six review
dispatches** — two per task across three tasks, beside task 16's initial two
and its one scoped re-review — independently re-ran the relevant test suite or
grep sweep itself rather than trusting the implementer's report.

A consistent, load-bearing pattern across a documentation-only stretch of a
batch, not only across its code-bearing task.

## The opening restatement caught three premise errors of one decision (2026-09-24)

`roles/sekkei.md`'s rule — restate the mechanism a Kikaku decision
presupposes before the first design question — found three premise errors in
the `bg-seat-fixes` input decision in the Sekkei's first turn: item 1's
overwrite reached three files rather than one; item 4's "sixty-minute
collector" was not what other background sessions on the machine showed; and
item 6's "`reading.js` learns the key" rested on an audit the script does not
make. A fourth, item 2's premise of a cause unknown, fell later when its
report arrived. The human corrected nothing of the restatement and extended
two items from it.

## A "coincides with" claim compared the wrong interval (2026-09-24)

The `bg-seat-fixes` retrospective measurement's first report tied three
exits of the 2026-09-23 sweep to a CLI version change by comparing the
version on the records before each exit with the version on the seat's
resume, hours later. The install time — read from
`~/.local/share/claude/versions/` and the renamed old binary's epoch suffix —
put the update two hours after the sweep. A "coincides with" claim needs the
event's own time on both sides, and a brief for a measurement asks for it.

## The passage check found one behavior change; the reviewer's third input found five neighbors (2026-09-24)

On `bg-seat-fixes`, Kanri's passage check (P-1) answered on the spec's §1,
§3, §5, and §6 passages and found one behavior change. The spec review then
found five Old values and ADR amendments the draft had missed, all in
neighboring procedure of `roles/kanri.md` the check was never shown — the
Replace table's gone-Jisso row, "A seat's exit", the census paragraph — and
in decisions ded8, 9a3a, and a8cc. The reviewer's third input, the files the
change list touches with the question which sentences the design
contradicts, is what found them: the passage check covers the passages sent,
and the third input covers their neighbors. The same seam as "Twenty-five
neighbor sentences contradicted a landed passage" above, one stage earlier.

## Half of a skill-editing plan's Jissos read the live text (2026-09-24)

`bg-seat-fixes`'s R-3 stated the plan's invariant: every Jisso is spawned at
the landing with `queue=bg-seat-fixes`, reading nothing until its batch
prompt reaches it, so every one reads the skill as it stood before batch A.
It held for the `queue=`-spawned seats, whose Start read `roles/jisso.md` at
the landing. It did not hold for the two fresh Jissos R-4 spawned directly
with `batch=` — batch C's, after Tasks 1-7 had landed, and the fix wave's,
after all eleven tasks and the whole-branch review: a `batch=`-spawned seat
runs its ordinary Start whenever the spawn executes, so both read the live,
already self-edited `roles/jisso.md`.

Nothing went wrong, and the fix wave's Jisso needed the live text, since its
fixes were checked against the post-Task-11 wording. But a future
skill-editing plan whose correctness depends on every Jisso reading identical
pre-batch-A text does not get that from an R-4-style fresh respawn.
Cross-reference decision-b909 (the queue at the landing) and issue-28f2
(whether a session adopts its own role-file text once it has landed).

## experience-layer: costs by stage (2026-10-01)

The `experience-layer` topic's measured costs, seat by seat, from its spec
stage to its last batch. The figures are the harness's own `usage` lines and
the seats' own readings; parallel reviewers overlap in time.

### The spec stage

The `spec.review` dispatch on fable/high took 21.5 minutes, 342k subagent
tokens and 61 tool uses over a 1,278-line spec and 246 open issues read whole,
and returned 22 findings, of which 7 Important and 3 SCOPE. The `brief.write`
dispatch on sonnet took 147 s and 101k tokens, plus two resumes of 19 s and
69 s. Sekkei put 4 questions and 3 design sections (7 turns) before the spec,
and 1 review gate after — the secondary criterion's first data point for
this topic.

### The plan stage

`plan.draft` on opus/high took about 53 minutes, 531k subagent tokens and 140
tool uses for a 3,400-line plan (nine tasks, 133 blocks), and carried 1,270
lines in one task. `plan.review` on fable/high took about 17 minutes, 309k
tokens and 37 tool uses, and found 8 findings, none blocking. `brief.write`
on sonnet took 82 seconds, 75k tokens and no resume. The drafter simulated
its own passages against scratch copies before lint, which is why the review
found no block that failed to apply.

### Batch A's pre-flight and Task 1

The scan of Tasks 2-9 on `tanto-default` (sonnet, medium) took about 645
seconds, 27 tool uses and 222k subagent tokens, and found one real conflict
(Task 6 Step 4's fix-commit path filter against the dispatch's own FIX
paragraph) and five smaller doubts. The Task 1 implementer (sonnet) took
about 160 seconds, 18 tool uses and 86k tokens for 35 passages, because the
brief's P-blocks are machine-parseable; each opus reviewer took 90 to 100
seconds and 73k to 82k tokens. The spec reviewer rebuilt every touched file
from base by script — the review the passage format makes cheap and a
hand-read diff of 725 added lines does not.

### Batch B

Task 2's implementer took 93 s, 16 tool uses and 65k subagent tokens; Task
3's 78 s, 14 and 61k; Task 4's 179 s, 28 and 106k (nine tracked files and a
checker). The three pairs of opus reviewers took 37 to 119 s and 57k to 99k
tokens each. No review came back with a Critical, the five Important findings
(two on Task 2, three on Task 4) were all plan-mandated and spec-verbatim, and
no fix round ran — the boundary's cost was the reviews, not the fixes. The
Jisso's own context passed the ceiling (251k against 215k) at the third task,
mostly from the Task 4 review reports and the pasted dispatches.

### Batch C

The fable recommender over 101 items took 59 tool uses, 222,484 subagent
tokens and about 17 minutes; the two opus reviewers 141,185 tokens in about
4.5 minutes (spec) and 150,662 in about 6.5 minutes (quality). The Jisso's own
context went from 105,229 at its first reading to 197,283 at its boundary,
under the ceiling.

### Batch D

From the task notifications' `usage` lines (subagent tokens, tool uses, wall
time): the apply on `shoroku.apply` (opus) 132,714 tokens, 39 tool uses,
293 s; Task 6 spec review 104,392, 19, 301 s and quality review 112,092, 12,
272 s; Task 7 implementer 65,285, 13, 96 s, spec review 72,692, 8, 50 s,
quality review 79,038, 10, 106 s; Task 8 implementer 119,040, 25, 301 s, spec
review 122,096, 16, 205 s, quality review 93,263, 14, 156 s, fix round
138,554, 9, 129 s, re-review 58,667, 7, 71 s; Task 9 implementer 137,644, 42,
405 s, spec review 99,355, 22, 261 s, quality review 71,198, 8, 125 s, fix
round 149,610, 9, 78 s, re-review 58,871, 5, 57 s. Sixteen dispatches in all,
about 1.61 million subagent tokens and about 48 minutes of subagent time; the
fix rounds (two implementer resumes, two re-reviews) cost about 405,700 of
those tokens.

### The whole-branch review

The review ran in one turn on fable, with 23 tool calls: it read every
changed file outside `docs/issues/**` whole and the issues diff as its changed
lines, and ran the replay, nine verifies, the kisou suite, the doc-system
check, a 110-line consistency script over the scenes and design pairings, and
the frontmatter check. The context-mode sandbox (`ctx_execute`) was denied
access on this host, and the consistency script ran from a temp file through
Bash instead.

## experience-layer: a recorded check is the command as run (2026-10-01)

In batch D a check script's exit status disagreed with the record:
`direction-verbatim.js` exited 1 on two one-line scene paragraphs (no fold of
the wraps) while the controller's record said it passed, and the spec
reviewer, who re-ran the script as checked in, caught it. A recorded check is
the command as run, not the comparison done by hand beside it.

## experience-layer: the spec reviewer and the quality reviewer find different things in a sweep-and-edit task (2026-10-01)

In a sweep-and-edit task the spec reviewer's reading (does the result follow
the rule, do the figures recount) and the quality reviewer's reading (is the
result true as written) find different things. In batch D, Task 6's spec
review was compliant while its quality review found two untrue `Serves`
lines; Task 8's spec review judged every destination compliant with the rule
and called the rule's effect plan-mandated, while its quality review's four
Important findings became the D-5 fix round; Task 9's spec review recounted
every figure and found them right, while its quality review found a
mislabeled limit and an ambiguous name (the D-7 round). Both fix rounds
followed from findings of truth: the reviewer such a task needs is the one
that opens the cited target and reads whether it says what the sentence
claims.

## experience-layer: the exit criterion's first count (2026-10-01)

The first count of the primary criterion in
`docs/notes/experience-layer-exit-criterion.md`, run by hand at the topic's
close because the topic's dogfood report preceded it. The grep
`grep -o 'exp-[0-9a-f]\{4\}'` over the spec, the plan and the two review
briefs, minus the same grep over `dialogue.md`, `spec-inputs.md` and the
Kikaku files the topic cites, gives 12 ids. Of them, `exp-d4e5` is
`docs/AGENTS.md`'s illustrative id, and the other eleven (06d2, 0cfa, 1fb1,
37c2, 48b2, 51d2, 58f1, 59eb, 75bc, 81aa, b6bf) are items of the 2026-09-15
input, which lists them as bare `**<id>**` lines. So the count by the note's
sense is **0** unprompted citations, and by the literal grep 11.

## The share-of-usage target met its first two data points: 92% and 87% (2026-09-20, 2026-10-02)

`SKILL.md` names a target of 30% or less of a topic's usage spent at context
over 150000; no completed topic had a figure until these two.

- `tanto-diet`, measured at its close: `reading.js --share` over 10 of the
  topic's transcripts (Sekkei, Keikaku, the six Jissos, the closing Kanri's
  tenure and its predecessor's) returned **92%** of usage at context over
  150000 (490,943,351 of 531,253,697 tokens). Not exhaustive: the opening
  tenure and any between it and the predecessor could not be reached without
  an archive lookup, so the true figure is likely similar or higher.
- `experience-layer`, measured at its close: **87%** over 15 transcripts (the
  ledger's Measurements row).

Both are about three times the target. One resident Kanri tenure that ran
five boundaries under a deferred handover is a visible contributor, but a
share this high says the growth is broad across roles, not one seat's. These
are the figures behind issue-40ed and decision-b6cb's cost question.

## What a Kanri tenure's turns cost on tanto-issue-triage (2026-10-02, 2026-10-03)

Seven context readings from four Kanri tenures of `tanto-issue-triage`, each
the difference across one act:

| Act | Context | Cost |
| --- | --- | --- |
| A kessai that read a 42 KB brief whole and printed it verbatim, as the contract requires | 184,625 → 279,268 (ceiling 215,167) | about 94,000, one and a half times `ceiling.kanri.per_batch` |
| A plan landing: the stage 1 frame (43 KB) printed whole, plus spec sections 2-4 and the plan's Global Constraints | 139,355 → 280,567 (ceiling 218,526), about ten turns, no batch | about 141,000 |
| A successor's cold start: `roles/kanri.md` (1,757 lines, two reads past the Read tool's page) plus `SKILL.md` (about 28,000) read whole | 157,495 at start; another tenure 143,472 | — |
| Batch boundary A (rulings and a prompt write included), then B | 157,495 → 211,707 → 232,592 (ceiling 88,383 + 2 × 65,000 = 218,383) | 54,212, then 20,885 |
| Two rework boundaries | 183,482 → 210,998 → 246,849 | 27,515, then 35,851 |
| Three Kikaku decision files read and checked by script | 209,162 → 234,360 | about 20,000 whole; 12,000 by their "What Kanri should do with it" sections |

Three readings they support:

- A handover start at 143k to 157k leaves about one boundary under the
  derived ceiling, not two: the second boundary crossed it in both tenures
  that started there. The ceiling is derived from the first turn's context,
  so the derivation holds only if the start is lean (issue-db0c). The role
  file's size, the largest single read of a start, is issue-cca9 and
  issue-fb90's finding 4; the handover's "read by sections" instruction has
  no heading list to select from.
- The stage 1 frame and a verbatim brief each cost a batch's worth; the frame
  is better read by sections, or only written to a file for the cold-read
  subagent.
- A Kikaku decision file's action section is the part Kanri reads; the
  discussion above it is Kikaku's record and costs the same context again.

## The tanto suite takes about six minutes on this host, and a quiet stretch is not a stall (2026-10-01)

`skills/tanto/scripts/spawner.test.js` alone takes about 301 seconds on this
host (37 tests, all pass), and the whole tanto suite about six minutes. A
280-second limit kills the file and reads as "179 tests, 178 pass, 1 fail"
with no output of its own — it looks like a hang. A full run of
`node --test skills/tanto/scripts/*.test.js` also goes quiet for about 70
seconds while the spawner tests cycle child processes, then finishes (192
pass, 0 fail at the time). A dispatch that runs the suite needs a limit above
600 seconds, and judges a stall by output growth and CPU, not elapsed time —
the rule `roles/jisso.md` states. Beside issue-46d3.

## An opening restatement that carries the mechanism and not the reason gets asked for the reason (2026-10-02)

At `tanto-issue-triage`'s spec stage, the human asked after sections 1 and 2
for the topic's background, purpose and approach to be restated (Q-7): the
Sekkei's opening restatement (Q-1) of the Kikaku input had covered the
mechanism and the behavior, not the why. A Sekkei's opening on a Kikaku input
can carry the decision's own reason in two sentences beside the mechanism.

## tanto-issue-triage: costs by stage (2026-10-02, 2026-10-03)

Figures from the task notifications' usage lines (subagent tokens, wall time)
and the seats' own readings.

### The plan stage

`plan.draft` (opus) took 252,072 tokens and 20 minutes for a 947-line plan
skeleton and a 198-line round template; `plan.review` (fable) 222,831 tokens
and 16 minutes; `brief.write` (sonnet) 82,883 tokens and 73 seconds.
Keikaku's own context stood at 392,749 at its first line to Kanri, after five
wake-ups and no compaction. The finished plan is 3,229 lines, because ten
round tasks are carried whole, as the spec asks.

### A round task

Round 1 (50 rows): sonnet implementer 172,960 tokens and 432 s. Round 2a (40
rows): 150,113 tokens and 384 s, then 159,184 and 60 s on a resumed fix round
(that figure may count the re-read context). Round 2b (39 rows): 188,753 and
595 s. Rounds 3, 4a and 4b: 146k, 177k and 206k tokens (383, 559 and 736 s;
25, 44 and 54 tool calls). In rounds 1 to 2b each opus review or re-review
took 69,843 to 106,627 tokens and 84 to 156 s, the two reviews of a task
running in parallel, so a round without a fix round cost about 350,000
subagent tokens and 10 to 13 minutes of wall time. In rounds 3 to 4b the
review pairs took 109k + 83k, 118k + 88k and 127k + 95k, so a round of about
30 rows cost 340k to 430k tokens before any fix. A one-finding
fix round by resume took 36 to 56 s and added 4k to 8k to the implementer's
count; its scoped re-review 57k to 74k.

### The apply batch

Four implementer dispatches, eight reviews, no fix round: the implementers
used 119,793, 80,185, 115,358 and 139,169 tokens in 387, 190, 346 and 404 s;
the eight reviews 82,000 to 111,000 each, about 745,000 together — about 1.2
million subagent tokens in all. The Jisso's own context grew from 107k to
355k.

### A task review's floor

The fixed cost of a task review is about 50k subagent tokens whatever the
diff. Two reviews of a nine-line diff in a 2,992-byte review package took
52,426 and 52,947 tokens (35 and 46 s, six tool calls each); two reviews of a
54-line diff in a 30,716-byte package took 76,418 and 69,807 (62 and 73 s,
eight tool calls each). A fix wave of two tasks costs four reviews, about
250k tokens, most of it fixed context and not diff.

### A fix wave on the Jisso's own context

`reading.js --role jisso` printed `context=109455` (83 records, 2 wake-ups)
after the contract, the role file and the config reads, and `context=208844`
(373 records, 11 wake-ups) at the report: two tasks with six dispatches (two
implementers, four reviews) and their hand-backs added 99,389 tokens, about
16,600 per dispatch, against a ceiling of 88,194 + 2 × 65,000 = 218,194. The
batch ended 9,350 under the line with no rework round — about half of one
dispatch's margin, so one rework round would likely have crossed it. The
ceiling's per-batch figure (65,000) is about two-thirds of this batch's
measured consumption; a plan with a two-task fix wave can weigh that before
it sets `ceiling.jisso` (beside issue-6620 and issue-d3bc).

## What the triage's reviews caught, and what only a reading of Rulings needed caught (2026-10-02)

Three observations from `tanto-issue-triage`'s round tasks:

- In round 2a the implementers reached a wrong "already closed on `main`"
  reason and a Kept for a want a scene line states; the spec reviewer found
  both by reading the live file and the scene lines. Carrying those two
  lessons into the next round's dispatch (check the want against the scene
  lines; check the live file before writing a Reason) gave a round with no
  Important finding at first review.
- The spec reviewer corrected the controller's own ruling premise (the spec
  does have a Kept sentence, in its Deferred item 5) — caught only because
  the ruling was put to the reviewer as a reading to judge, not a finding to
  skip.
- When an implementer read a recommend task's rule against its plain text,
  both opus reviewers still passed a divergent reading (the rule later
  overruled as R-7; see issue-d0d7). A brief's form greps cannot see a wrong
  default; only the Kanri's read of the report's Rulings needed can.

The habit they argue for: put a ruling to the reviewer as a reading to judge.

## A rule over a table is a check to run: four controller-side scripts on tanto-issue-triage (2026-10-02, 2026-10-03)

Four times a short script checked what the reviews could not:

- A ruling keyed on a column of the liveness table (every gone item reads
  `no commit found`) was computable: a script listed the covered rows exactly
  (22, 17 and 16 in three rounds) and showed one Merged row and one Kept
  Reason that the ruling's premise said did not exist.
- On a Kikaku decision whose overrides are item numbers, a script matched
  every `R<n>: <item> は <destination>` line to the recommendation heading of
  that number and compared issue ids (44 of 44 matched), and looked up every
  Landed subject in `git log main --format=%s` (11 of 11).
- Before the apply, a recount of the nine round files by the real answer form
  found a form mismatch before any dispatch and gave the implementers and both
  reviewers per-round figures to agree with (landed 15, merged 5, assigned 60,
  re-hung 19, kept 209); three of the four reviews used it as a cross-check.
- After the apply, a 90-line Node script re-derived every issue's effective
  destination from the nine recommendation and nine direction files and
  compared it with the nine commits' renames, appended lines, `updated:`
  fields and subject counts: 0 discrepancies over 308 items, in under five
  seconds. The eight per-task reviews had done the same by hand.

An apply task over answers by exception can carry such a recount in its
dispatch, and its Verify or closing boundary the end-to-end one. The
"checkable claim" rule applied; beside check 10 of
`docs/notes/tanto-consistency-checks.md`.

## A rework by resuming the implementer costs about a third of a first pass (2026-10-02)

Resuming a finished implementer with `SendMessage` (context intact) for a
rework took about two minutes: 135 s and 121 s for two tasks (192,226 and
178,596 tokens as the notifications count them, which may include the re-read
context), and 125 s and 209,452 tokens for a two-edit rework of round 2b,
against 6 to 10 minutes for a fresh dispatch. Each opus review of a rework
took 67,134 to 101,802 tokens and 61 to 110 s. A narrow rework costs about a
third of a first pass and turns around in one boundary, so a ruling that
finds a premise wrong is cheaper to rework than to carry as a named
exception; R-9 of that run chose the rework for that reason.

## Diagnosed findings made a seventeen-item fix wave one dispatch each (2026-10-03)

`tanto-issue-triage`'s whole-branch review gave every finding as a line, a
"Reads" text and a "Should read" text. The fix wave that followed was cheap:
seventeen edits took one implementer dispatch (about 170 s, 23 tool calls)
and the script fix one more (about 88 s, 14 tool calls), with no fix round in
either, and the reviews found only Minors. Whether
`templates/branch-review.md` adopts the diagnosed-findings form is a later
choice this informs.

## Reading a plan-keyed `fail` verdict's Failures section costs about 14k tokens (2026-10-03)

`passage-check.js sections --file <verdict> Failures` on a `fail` verdict
prints the whole verbatim `boundary` output — at a `tanto-issue-triage`
boundary about 14k tokens, 50 of them false `bad line` reports from one
inline-awk artifact — and moved the Kanri from 178762 to about 199000 in one
turn. A Kanri that reads Failures at a plan-keyed `fail` pays that every
time. When the rulings already explain the failing passes, a head-limited
read (`| head -30`) or a read of `Rulings needed` alone is enough.

## A Kanri's cold start and its ceiling, tenure by tenure (2026-10-03, 2026-10-04)

Eight readings from the Kanri tenures of the `tanto-issue-triage` close and
of `shoki-seat`, each the session's own `reading.js` figure:

| Tenure | Start | Baseline and ceiling | What followed |
| --- | --- | --- | --- |
| `tanto-issue-triage` close, first | 122,874 at the first reading (the contract, the role file to line 939, the handover, the roster); 161,482 after the ledger's Rulings (about 12k) and the direction file, before any act | — | The handover had said not to read the Rulings whole; the direction file and the `S-n` mapping were all the next step needed |
| `tanto-issue-triage` close, successor | 155,253 after the role file (two reads), the roster, the handover and the proposals | ceiling 218,092 | Crossed at 219,189 after two hotfix commits, a roster rewrite and a delegated chore, with the shoki landing still ahead: about 60k of room before the first act |
| `shoki-seat` opening | 140,019 before any act | baseline 88,272, the first turn's context, taken before the role file was read; ceiling 218,272 | One handshake, two decision files, a topic opening and the Shoroku-table move: 219,250, so the handover fired at the spec stage's entrance with no batch, Sekkei or Jisso yet |
| `shoki-seat` spec to landing | 126,941 | baseline 88,102, ceiling 218,102 | Crossed at 224,533 about three hours later with no batch in flight: one handshake and release, one spawn and stop, one cold-read dispatch, two proposals' form checks, 46 `S-n` rows, and later sections of the role file |
| `shoki-seat` landing and batch A | 130,631 | baseline 86,169, ceiling 216,169 | 249,153 at the rework's boundary, about three hours later: one landing (prompt and three spawns), two boundary dispatches and verdicts, one `fail` with three rulings, one human question through Kikaku, one Keikaku resume, a handshake |
| `shoki-seat` batch B and the whole-branch review | 161,551 after 2 wake-ups | baseline 88,190 | 221,135 after one boundary (the Jisso report, one `boundary.verify` dispatch and its verdict, a ruling) and one `branch.review` dispatch with its 19 KB report: about 60,000 against `per_batch` 65,000 |
| `shoki-seat` fix wave and close | 156,129 at the start line | baseline 88,634, ceiling 218,634 | About 207,000 by the Jisso's proposal, after the handover's acceptance, the fix wave's prompt, its boundary dispatch and the close's opening |

What the series says:

- **The baseline does not see the role file.** It is the first turn's
  context, taken before `roles/kanri.md` is read, so a spawned Kanri's
  headroom is about half of what `ceiling.kanri` states: the role file's two
  reads and the start commands are a fixed load of about 50k the derivation
  leaves out.
- **The role file costs two Reads, and a plain Read cannot select a
  section.** The harness caps one read at 25,000 tokens and
  `roles/kanri.md` is 1,757 lines, about 40,000 tokens. A handover's "read
  only the role file's Start, The batch loop, Session lifecycle's Create
  table and Handover" cannot be honored by Read; `passage-check.js sections`
  takes a Markdown file's headings and works on the role file. Beside
  issue-401e.
- **A start leaves one boundary of headroom.** Four `shoki-seat` tenures in a
  row crossed the ceiling inside the plan's own stages — the spec entrance,
  the plan stage, the first boundary, the whole-branch review — and a successor
  that starts at a boundary reaches its own handover after about one more. A
  spec-to-landing stretch, which counts no boundary, costs about a full
  handover cycle.
- **Delegation keeps a dispatch out of the context.** The last tenure gave
  the fix wave's prompt to a `default` subagent, which ran each command once
  and returned a 20-line report (138,050 subagent tokens, none in the
  Kanri's context); it kept about 40,000 out of the Kanri.

The retuning decision these feed is issue-306f.

## A Kikaku decision's claim about the tree was stale on arrival, and one grep caught it (2026-10-03)

The decision that opened `shoki-seat` said the previous close's ten swept
inbox copies had unfilled Triage sections. The previous Kanri had filled all
thirteen at the landing, and one grep of `.tanto/inbox/` showed one blank
copy, received after the sweep. The Start rule that a decision's checkable
claim is checked before it is relayed caught it, for one grep and a read of
the archive's landing line. The decision's Kikaku had read the ledger row
that said shoki could not write Triage, but not the landing line that closed
it. Kin issue-7b7b.

## A three-minute probe settled what a spec had deferred to the landing (2026-10-03)

The `shoki-seat` spec deferred one point to the plan's landing as a
measurement. A by-hand probe of about three minutes (its probe 4) settled it
in the spec stage, and the human offered it as soon as it was named. A spec
that lists "measured at the landing" items can offer the by-hand probe first
where one exists, since the landing is the run's one unattended stretch.

## Four of five tasks drew an Important finding on a passage the plan mandates (2026-10-04)

In `shoki-seat`'s batch A, four of the five tasks drew an Important finding
on a passage the plan mandates, and none could be fixed in the batch: any
edit to a plan-mandated block fails `verify` and the boundary's `diff`, and
only Kanri or Keikaku can amend the plan. The rubric's "Important means
block" and the plan's block-for-block discipline do not meet inside a batch;
each such finding became a ruling and an entry in Rulings needed. A plan
review that runs the quality lens over the plan's blocks, before the batch,
is where these would be cheap to fix. Kin issue-cabf.

The same batch's review dispatches also reported the plan's literal trailer
text as a "finding" every time (`Claude` against the harness's model-named
line plus `Claude-Session`). The plan allows the harness's line, so a
dispatch that says so once removes the repeated non-defect.

## A Jisso that kept its context across a rework verdict resumed cheaply (2026-10-04)

After `shoki-seat`'s batch A was returned for rework, its Jisso — which had
held its context across the verdict, at 21 wake-ups and context=393556
against a ceiling of 218217 — resumed on the plan's two new commits and the
ledger's rulings with no re-read of Tasks 1 to 9. A data point for
decision-aacb's "a batch that ran keeps its files".

## Two rules files named by path kept twelve dispatch prompts to 15-30 lines (2026-10-04)

`shoki-seat`'s batch B Jisso put the implementer rules and the review rules
in two files under the SDD workspace and named them by path in every
dispatch. Each of the twelve dispatch prompts stayed at 15 to 30 lines and
still carried the foreground-command sentences, the verification substitutes
for documents, and the Part 1 / Part 2 split without re-pasting them. The
quality reviewers followed "read the sibling files at HEAD and name which",
and each checked every named fact against the scripts, which is where the
batch's one Important finding came from. Whether such files become templates
of the skill is issue-6c5b.

## shoki-seat: costs by stage (2026-10-03, 2026-10-04)

Figures from the task notifications' usage lines; the batches' figures are in
`docs/reports/2026-10-04-shoki-seat-dogfood.md`.

- **The spec review** (`spec.review`, fable, high): 190,096 tokens, 37 tool
  uses, 10 minutes; fifteen findings — one critical, four important, ten
  minor — every one accepted. The spec's brief writer (`brief.write`,
  sonnet): 69,700 tokens, 8 tool uses, 86 s, and the form check passed first
  time.
- **The plan stage.** `plan.draft` (opus, high): 504,065 tokens, 274 tool
  uses and 4,126 s (about 69 minutes) for a 3,609-line plan of nine tasks
  and 135 blocks, applying every passage in a scratch copy with one commit
  per task and the suite run at each. `plan.review` (fable, high): 278,323
  tokens, 33 tool uses, 854 s (about 14 minutes); 0 critical, 2 important,
  7 minor. The plan's brief writer (sonnet): 67,816 tokens, 10 tool uses,
  74 s, and the form check passed first time.

## A Kanri tenure's context through a close, step by step (2026-10-04)

The `shoki-seat` close's Kanri, measured against its baseline of 88,743
(ceiling 218,743, or 283,743 once `ceiling.kanri.batches` is 3):

| Step | `context=` |
| --- | --- |
| The start line | 130,251 |
| After the handover's acceptance (roster, ledger head, Shoroku section) | 153,903 |
| After the recommender's files were checked and the brief (about 25,000 characters) was read and printed once at the kessai | 188,403 |
| After reading the Kikaku decision file (about 24 KB) and writing the direction and the ledger rows | 248,206 |
| After the shusei prompt's render, its boundary, the merge and the shoki spawn | 306,545 |

The ceiling was crossed at 306,545 with the close's tail — the landing
checks, the archive move, `--share` — still ahead. The two whole-file reads
of one document each, the brief and the decision, were the largest single
steps, about 35,000 and 25,000. The data behind issue-76df.

The successor that took the tail started at 130,461 and paid for the
acceptance, shoki's landing checks (lint, frontmatter, Source, Triage), the
fast-forward, the `rm`, the share reading, the archive move (a node script
over both files), the Measurements fill, the issue-f03b hotfix with its
tests and its own proposal. The hotfix's tests were the two long suites —
the spawner suite, 52 tests in about 7 minutes, and the launcher suite, 34
tests in about 3 minutes — the price of a hotfix to a script, and a hotfix
of that kind belongs to the hotfix lane's "no batch in flight" condition.

## The shoki spawn after a merge ran with no human act (2026-10-04)

At the `shoki-seat` close the shoki spawn after the merge — the worktree
cut, the brief's render and the `spawn` request — took four tool calls and
one script. Shoki's first turn ran with no human act: its transcript under
the `…--claude-worktrees-shoki-shoki-seat` slug appeared within 40 seconds
of the request, state busy. The three restart acts the human took earlier
meant the spawn was taken once.

## A Kanri tenure's context through a spec stage and a cold read (2026-10-05)

The `run-owned-seats` opening Kanri read 132,792 at its start, 164,303 at
the topic's opening, 297,026 at the plan's landing and 311,537 at the
handover, through a spec stage of two Kanri checks over a spec that grew
from 1,068 to about 2,000 lines and a stage 1 frame of 47 KB. Its ceiling
(283,892) was crossed during the cold read, so the handover waited for the
cold-read subagent, about 18 minutes, before it could be written.

## A cold-read dispatch's interim notice, and its cost (2026-10-05)

The `run-owned-seats` cold-read subagent's completion notice read
"completed", with a note that it still had background work and its result
might be interim, while `coldread.md` was already written: the file was the
check, as the contract says. The dispatch took 65 tool uses and 304,456
subagent tokens, most of it running the suite three times to measure the
cold read's question 3.

## run-owned-seats: the suite's duration and each batch's cycle (2026-10-05, 2026-10-06)

The whole suite, `node --test skills/tanto/scripts/*.test.js`, on this host,
one run at a time unless noted:

| When | Tests | Time |
| --- | --- | --- |
| Batch A, Tasks 1 to 4 | 243, 249, 256, 262 | 422, 440, 450, 452 s |
| Batch B, Tasks 5 to 7 | 263, 270, 270 | 451, 452, 452 s |
| Batch C, Tasks 8 to 11 | 280, 285, 292, 296 | 452 s each |
| End of Task 11, the plan's dry run | 296 | 461 s; 539 to 545 s with three suites at once |
| Batch D, the one whole run | — | 457 s |
| The whole-branch review, in the foreground under a replay and the lint | 296 | 462 s |
| The fix wave | — | 512 to 520 s quiet, 594 s under load |

Per file at the dry run: `spawner.test.js` alone 449 to 497 s,
`tanto.test.js` 2 to 3 minutes, `boundary.test.js` and `reading.test.js`
10 to 20 s. A Bash call is cut at ten minutes, so a boundary that runs the
suite and six more fences in one `boundary --plan` call cannot finish in the
foreground. The figure held at about 7.5 minutes across the branch, so the
plan's Global Constraints' "nine minutes" and fence 2's "ten" (the ledger's
F-5) were never measured.

Each batch's cycle:

- **Batch A** (2026-10-05): one implementer 280 to 440 s, two reviews 45 to
  130 s, the suite 7 to 7.5 minutes — about one hour from the `batch:` line
  to the last suite for four tasks.
- **Batch B** (2026-10-05): an implementer 124 to 180 s, a review 49 to
  146 s; the two reviews of a task ran during its suite, and the next
  implementer waited for the suite to end because the suite reads the tree;
  about 33 minutes from the first dispatch to the last suite.
- **Batch C** (2026-10-06): implementers 268, 253, 312 and 293 s, a spec
  review 55 to 89 s and a quality review 98 to 170 s, the same overlap and
  wait as B; the batch added 10, 5, 7 and 4 tests; about 55 minutes from the
  first dispatch (00:04) to the last suite (00:58:39). The Jisso's context
  went from 106,316 at the start of its window to 332,106 at the boundary.
- **Batch D** (2026-10-06): twelve document tasks in about 80 minutes from
  the first dispatch (01:17 by the shell clock) to the last review (02:37);
  an implementer 66 to 190 s, a spec review 33 to 117 s, a quality review 93
  to 280 s (the subagents' own duration figures). The Jisso's context went
  from 104,301 at its start, before the batch line, to 472,436 at the
  boundary, with no compaction.

## A fix-wave Jisso grew 5.3 times the per-batch figure (2026-10-06)

The `run-owned-seats` fix-wave Jisso's context went from a baseline of
88,675 to 435,531 over 44 wake-ups, about 346,856 tokens — roughly 5.3
times the 65,000 the ceiling counts for one batch. Every implementer and
reviewer wrote its full report to a file and returned under 25 lines, and
the review lines were appended to the ledger by `grep`. A fix wave of eight
tasks — twenty-five dispatches, each hand-back and each wake-up re-read in
full — on one Jisso is not a batch of three or four tasks (rule 7):
file-first hand-backs slowed the growth but did not stop it, and the
ceiling's `per_batch` is not a figure for a wave this size. The measurement
under issue-dccb.

The one-task rework that followed (one implementer and two reviewers) cost
the same Jisso about 39,754 tokens over 5 wake-ups, from 440,724 at the fix
wave's report to 480,478.

## The review yield of a fix wave over diagnosed fixes (2026-10-06)

The `run-owned-seats` fix wave and its rework: eighteen review halves (nine
tasks, the rework's R1 included), no Critical, three Important — all in the
fix wave itself — and thirty minors (twenty-eight and two), no fix round.
The three Importants were all in text the batch prompt or a verdict had
pasted (the failed-wake count twice, the "(3.1)" pointer), labeled
plan-mandated and ruled to stand for Kanri; the three script tasks (F1 to
F3) drew only minors, and F3's code was not what failed the suite. For a
wave whose findings arrive with their old and new text, the reviews found
problems in the pasted words and none in the transcription. Whether a
combined review would do for the pasted-text tasks is a question these
numbers pose and do not answer.

## A wave's instruments were cheap enough to run after every task (2026-10-06)

In the `run-owned-seats` fix wave: `verify-all.sh` (`passage-check.js
verify` for all 23 plan tasks) took 6.0 s, `replay` 6.5 s,
`passage-check.js lint` of the 15,000-line plan 0.25 s, and the plan's
whole-skill sweep 2.5 s, against 512 to 594 s for the whole suite. The
controller's per-task `verify-all.sh` showed 1 passage superseded after F1
and 33 after F6, so the prompt's "amend no other passage" was known false
after the third task and not at the boundary.
