---
id: "da2f"
title: passage-check replay prints 377 lines where a summary line would do
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: shoroku roster-ledger S-72

Measured on the `roster-ledger` plan (2026-10-08):
`passage-check.js replay --base <merge base>` prints 377 lines — 89 skipped
commands, 147 needle lines, 11 DIFFERS, 2 MATCH — and every DIFFERS was the
one the plan's Self-Review predicted. At review time the output carried no
information beyond exit 0 and the DIFFERS count.

Remedy: a one-line summary (the counts of skipped commands, needle lines,
DIFFERS, and MATCH), with the per-line output unchanged behind a flag or
below the summary.

Carrier topic: `passage-check-hardening`.
