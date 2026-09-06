# tanto dogfood — the first plan run under the protocol

The `tanto` skill was built by running its own protocol by hand. Three
interactive sessions — a manager, a designer, and an executor — took one
implementation plan from spec to merge-ready while the skill that describes them
was the thing being implemented. No root-cause session was needed. This report
freezes what was measured, so that design-4807 and later work can cite it
instead of re-deriving it.

## Rename and addressing

A rename changes the name the session listing shows and the `from-name` on the
message envelope. The session reference does not change. The **old name stops
delivering** — a send to it errors with "no agent named ... is reachable" — and
this holds **even when the reference is supplied alongside the old name**.

Measured in both directions: after the designer session was renamed, the
manager's listing showed the new name; after the manager itself was renamed, the
designer's send to the manager's old name-plus-reference errored, and the bare
new name delivered.

The consequence is structural, not cosmetic: a rename invalidates every address
a peer holds. That is why the roster in this protocol is a uniqueness check —
one live session per role name — rather than an address book, and why peers
address each other by bare name.

## The message envelope's mode attribute is not the permission mode

The handshake line carries a `mode=` field a session fills from what it can see
of its own permission mode. The message envelope separately carries a
`from-mode` attribute, and it was tempting to treat the second as a better
source than the first.

It is not. The executor's handshake reported `mode=auto` while the envelope of
that same message carried `from-mode="prompting"`. Every message from the
designer session carried `prompting` too, in both directions, and no permission
prompt was observed anywhere in the run. The attribute most plausibly means "the
sender is mid-turn". Only the `mode=` self-report carries the permission mode.
This corrected the premise of issue-15bf, which had assumed the opposite.

## Idle notices

Every batch was sent with an idle subscription as a backstop, and every batch
also ended with the executor sending one line naming its report file.

The report line arrived first every time. The idle notice followed at 19:11,
19:41, 19:59 and 20:27 for the four batches — in the first case after the batch
had already been verified, accepted, and succeeded by the next prompt. The
notice carries the end time of the turn it refers to, which is what lets a late
notice be told apart from the current batch.

So the one-line report is the primary signal and the subscription is the
backstop, not the other way round.

## Wall clock and cost

| Batch | Window | Tasks | Dispatches | Reviews |
| --- | --- | --- | --- | --- |
| A | 18:33-19:10, 37 min | 4 | 4 | 4 |
| B | 19:13-19:40, 27 min | 4 | 3 | 3 |
| C | 19:43-19:58, 15 min | 3 | 2 | 2 |
| D | 20:01-20:27, 26 min | 3 | 3 | 3 |

The whole-branch review took about 13 minutes, 48 tool uses, and roughly 179k
tokens on the review model. The fix wave that followed it was one fixer and one
scoped re-review.

## Totals

Fourteen plan tasks plus one fix wave. Twenty-six commits on the branch, every
one carrying the co-authorship trailer. Twelve implementer or fixer dispatches
and twelve reviews.

**Zero fix rounds across the four implementation batches.** Zero escalations to
a more capable model, zero blocked returns, nothing parked before the final
batch and seven parked at it. No permission prompt in auto mode at any point in
the run.

## What produced the zero fix rounds

The plan carried the **complete final content of every file in fenced blocks**.
That turned thirteen of the fourteen tasks into transcription plus verification
rather than authorship, and it produced thirteen byte-exact files.

It also changed what review could be. The whole-branch reviewer verified plan
alignment mechanically — extracting every fenced block from the plan, joining
the multi-part files as the plan's own constraints prescribe, and diffing the
result against the tree — rather than reading for fidelity. Plan alignment
stopped being a judgment call and became a check.

The cost is that such a plan is long and that its structural expectations go
stale when a later review mandates a new section; see the last section.

## Batching same-shape tasks

Three pairs of same-shape tasks shared one implementer dispatch and one review,
with the reviewer told to check the diff file by file and to report per file.
Each task kept its own commit and its own verification steps.

The seat count halved for those pairs, but the more interesting dividend was
different: two of the three pairs were **coupled**, and one reviewer holding
both files verified the contract between them against the delivered bytes. Two
separate reviews could each only have assumed it. Coupling, not similarity, is
the better reason to batch.

## The whole-branch review

Verdict: with fixes. Zero critical, four important, eight minor. Every file
byte-identical to the plan, every mechanical invariant verified independently,
both verbatim upstream quotes intact.

Every finding was of one kind — an obligation or a term written in the wrong
file, or written nowhere. That is the characteristic failure of a skill
assembled from files no single session reads in full, and it is the reason
design-4807 records two rules about where an obligation and a routed term
belong. Two of the four important findings were the design document's gaps
faithfully reproduced rather than executor errors.

## The fix wave

One fix subagent applied all sixteen items, then exactly one scoped re-review.
Three things about it are worth keeping.

**It ran on the escalation tier rather than the implementer tier.** The wave was
cross-file prose authoring under a no-second-pass constraint, not transcription;
a weaker pass would have produced text that reads well and puts an obligation in
the wrong file, which is precisely the defect class being fixed.

**The fixer was briefed on the invariants its edits could break, not only on the
findings.** Four fixed-string checks sat exactly where it was editing, and the
findings list named none of them as hazards — it said "write this word in
lowercase" without saying that a count depended on it. All four survived.

**The re-review missed one instance of a defect class it had itself reported.**
It found that a mandated new section had invalidated one file's heading-count
expectation; it did not find the second file with the same problem. Re-running
the full set of task-time checks at the boundary, rather than only the checks
the boundary asked for, is what caught it.

## Checks that paid for themselves

- A quoted-text invariant checked three times — before dispatch, inside the
  task, and at the boundary — at roughly one tool call each. Its whole value is
  catching an upstream change, and it is cheap enough to run redundantly.
- Front-loading a drift check before dispatching, twice, so the implementer's
  result could be compared against an independent run instead of trusted.
- Verifying the plan's own expectations against the tree during the pre-flight
  scan. Two of them could not be settled from the plan text alone, and both
  held.
- Reviewing a verification-only task by **re-running** its checks — the inverse
  of the standing instruction to reviewers — because for such a task the
  recorded output is the deliverable rather than a claim about code.

## The manual bootstrap

This run started before the skill existed: an orders file plus a line pasted by
the human, with no slash-command entry point and no personal model config. Every
role's start needs — the model check, the rename, the handshake, the plan and
ledger paths, the overrides, the report skeleton — fit in one file, and the
executor started from it without a round trip.

This is recorded because it is the only account of the bootstrap case once the
handover document that seeded the work is deleted, and because the skill's own
start sequence does not cover it.

## Concurrency

Two sessions on the strongest model family ran concurrently for most of the run,
and a third joined for the implementation phase. No rate-limit error was
observed at any point.

That is one data point, on one day, against issue-9a68, which asks for the
concurrency limit to be measured. It is not a resolution: the run never
deliberately pushed for a limit, so the absence of an error bounds nothing.

## Handshake smoke test

The last stop condition of the implementation work is a live handshake test the
executor cannot run: it needs a new interactive session and a rename no skill
can issue for itself. It was prepared and handed to the human with its three
commands and its pass criterion, and deliberately scheduled to run **after** the
fix wave landed, because the wave edited the two files the handshake path reads.

The test had not reported back when this report was frozen. Its result is
recorded in the run's conductor ledger.
