---
id: "d3bc"
title: whether `ceiling.kanri.per_batch` (65000) still describes a thin resident's growth — read from the next topic's Measurements
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-24
---

Source: shoroku tanto-diet S-20

`ceiling.kanri.per_batch` is 65000: the per-batch consumption figure the
derived context ceiling multiplies, chosen when Kanri ran every boundary's
verification, reading and table edits in its own context. decision-a8cc moves
all of that into a `boundary.verify` subagent, so the resident's growth per
batch should be a dispatch, a verdict read, and the rulings it makes — a
different quantity from the one the number was fitted to.

Deferred rather than open because nothing decides it but data: the figure is
read from the next topic's Measurements table, where the per-boundary deltas
of a thin resident are recorded for the first time. Until that run exists, any
new value would be a guess replacing a measured one.

Related: issue-c44b (a ceiling for the measuring roles), issue-40ed (the count
threshold the ceiling replaced for the handover).

**2026-09-22, `tanto-bg-seats` — the data this issue asked the next topic for,
in three readings from one run.** All three crossed the ceiling, and no two
crossed it by the same mechanism.

- **A spec/plan-stage tenure, no batch at all.** The tenure accepted the
  2026-09-20 handover at `context=157061` and had reached `context=280500` by
  the time its own handover was written — Δ=123439 from spec/plan-stage
  bookkeeping alone (opening the topic, two role handshakes, one scope-input
  relay, one spec-review recording, one exit-proposal recording), with zero
  subagent dispatches of its own. No boundary was ever crossed, because no batch
  ran under it. The `per_batch` term is calibrated against batch-boundary
  dispatch cost; this growth was pure turn count.
- **A batch-boundary-only span.** The next tenure's span (batch C's
  handover-accept through batch D's accept) crossed the ceiling a second time
  within roughly the same number of turns as its first span (batch A1 through
  batch C), this time with no spec/plan-stage growth in it at all — purely
  batch-boundary dispatch cost, one `boundary.verify` retry included.
- **Two one-shot dispatches.** The stretch from that handover's acceptance
  through the fix-wave batch's acceptance crossed the ceiling again almost
  immediately, on two large dispatches (the whole-branch review's 329k subagent
  tokens, the fix-wave draft's 137k) and their verification reads alone, with no
  batch-boundary bookkeeping added on top yet.

Together they say the `per_batch` term describes one of three growth mechanisms.
A spec/plan-stage tenure accrues by turn count, a batch-boundary tenure by
dispatch overhead, and a review-heavy stretch faster than either. Whether the
ceiling model should separate them, or fit one number to the worst of the three,
is now a question with measurements behind it rather than a guess.

**2026-09-24, `bg-seat-fixes` — ten tenures in one day, each paying the
fixed per-start cost** (shoroku bg-seat-fixes S-36). The roster shows roughly
ten `replaced` Kanri rows within 2026-09-24 alone, several lasting one batch
boundary, one handing over at the boundary after accepting its own handover.
Each tenure pays the same fixed cost however little it does before handing
over again: reading both `tanto.json` files, writing and checking fifteen
agent definitions at two scopes, reading the full role file, and, on a
handover, every open ledger and the handover file. The measurement that
would decide `ceiling.kanri.batches=2`: the fixed per-tenure share of a day's
Kanri cost against its boundary work — whether the default multiplies the
fixed cost across more tenures than the batch cadence needs.

**2026-09-24, a received report — resumes with no batch progress**
(inbox 2026-09-24-ceiling-kanri-many-resumes-no-progress). Two measured data
points from another repository's run, restated against this repository's
`roles/kanri.md` Handover derivation and `scripts/reading.js --role kanri`:

- A stalled batch resumed at least seven times by `/tanto fukki` across
  roughly two days, with no batch boundary between the resumes, crossed the
  derived ceiling (baseline + 2 × 65000) past three times over from resume
  overhead alone — each resume pays a config re-read, a definitions
  write-and-count pass, and a tree and roster cold-read.
- A handover-accepting Kanri's first turn crossed the ceiling before any
  batch: baseline 91177 + 2 × 65000 = 221177 against a first-turn context of
  254579, since the baseline is captured from the handover-acceptance turn.

The reporter proposes no fix; both are data for whoever derives `per_batch`.
