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
