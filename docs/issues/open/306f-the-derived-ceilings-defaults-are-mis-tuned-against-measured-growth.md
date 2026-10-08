---
id: "306f"
title: the derived ceiling's defaults are mis-tuned against measured Kanri and Jisso context growth
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-08
---

Source: inbox 2026-10-03-ceiling-tuning-numbers-measured

The derived ceiling (`roles/kanri.md` "The trigger"; `scripts/reading.js`
defaults `batches: 2, per_batch: 65000`) is mis-tuned against measurements
from two runs:

- A Kanri's context grows by about 200k across a topic's spec and plan
  stages, which count no boundary, so the handover fires at the plan's
  landing before any batch.
- A spawned Kanri has about 58k of headroom at its first turn, because the
  baseline is taken before the role file's two Reads, and it hands over at
  its second boundary.
- A four-task Jisso batch consumes 190k to 280k against a `per_batch` of
  65000.

The `shoki-seat` run measured the same on its own tenures: four Kanri
tenures in a row crossed the ceiling inside the plan's own stages, and a
Jisso read about four times `per_batch` at a boundary. The figures are in
`docs/notes/tanto-measured-data-points.md` ("A Kanri's cold start and its
ceiling, tenure by tenure") and
`docs/reports/2026-10-04-shoki-seat-dogfood.md` (batch B and the fix wave).

Retune the defaults or size batches by tasks, account in the Kanri ceiling
for the pre-batch stage, and document the spawned-Kanri headroom where the
ceiling is explained. Kin issue-6620 (deferred: whether `ceiling.jisso` earns
its keep), issue-40ed, issue-7281 and issue-d3f1.

Carrier: Kept.

**2026-10-08, `roster-ledger` — five readings of growth the ceiling does not
model** (shoroku roster-ledger S-3, S-24, S-30, S-34, S-90). The first two
below are Kanri's growth with no batch in flight, the reading issue-db0c
names ("the ceiling's only growth term is the batch count"); the last is the
Jisso-side reading issue-dccb names ("the fix wave is one unbounded list that runs past a
Jisso's ceiling").

- **Kanri across the spec stage** (S-30): from 247369 at the topic's opening
  to 294823 over the spec stage, about +47000 in one session across a hotfix,
  the topic opening, a subagent report, three Kikaku and Sekkei relays, and
  the Sekkei and Keikaku requests, crossing the ceiling of 293591 there. The
  spec stage has no batch boundary, yet it spent roughly one `per_batch` of
  the ceiling in four relays.
- **Kanri across a tenure with four skill loads** (S-34): from 149704 (start,
  16:30) to 436248 (22:01) with no batch in flight. Each `/tanto fukki`
  re-injects `SKILL.md` and its Recovery reads `roles/kanri.md`, so a tenure
  with four skill loads and one 105 KB frame spends its ceiling before the
  plan lands. Not isolated by a measurement; the ledger's Measurements row has
  both figures, and a `/tanto fukki` after a lost service is the likely
  driver. The cause is the open role-file diet issue, issue-cca9 (`roles/kanri.md` and
  `SKILL.md` are 15 to 27k of every seat's baseline).
- **Kanri reading the check brief at the kessai** (S-3): reading the 51 KB
  check brief (116 lines) and printing it verbatim took the Kanri from
  context=225912 to context=273516, 47604 tokens, 0.73 of one
  `ceiling.kanri.per_batch`, in one turn pair. A Kanri that starts the close
  at the ceiling's lower half cannot afford the kessai without a handover
  right after the shusei boundary.
- **A Sekkei on cut reads** (S-24): the Sekkei's reads were cut to the input
  document, the fourteen issues whole, `record` and `census` whole, the Start
  section, and the previous spec by heading, and still reached
  `context=228224` before the spec was written; the three inputs that arrived
  afterwards (spec-check 23 KB, review 28 KB, Kikaku 14 KB) were read whole,
  as the role requires of a review report.
- **A Jisso across the fix wave** (S-90): from 112,905 at the batch line to
  316,555 at its report, 203,650 tokens over three tasks and two fix rounds,
  about 68,000 per task. The reviewers' report bodies were read from files at
  3,000 to 6,000 tokens each and the implementers' reports never entered it;
  the growth is the dispatch prompts, the idle notices, the reviews read once,
  and the boundary's output. The `per_batch` of 65,000 is therefore nearer a
  per-task figure for a wave of this shape: three diagnosed tasks with fix
  rounds cost a Jisso about three "batches" of the ceiling.
