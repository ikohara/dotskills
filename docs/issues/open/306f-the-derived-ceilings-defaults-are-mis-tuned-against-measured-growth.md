---
id: "306f"
title: the derived ceiling's defaults are mis-tuned against measured Kanri and Jisso context growth
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
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
