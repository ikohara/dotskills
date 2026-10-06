---
id: "f000"
title: a pending kessai larger than the ceiling's headroom is not a handover signal
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-07
---

Source: shoroku experience-layer S-62

At an `experience-layer` boundary on 2026-10-01, the ceiling verdict read
`under` (211,701 of 215,153), and the next act — the migration kessai,
printing a 35 KB brief verbatim — would itself cross the ceiling. The
trigger keys on the reading, not on the size of the next act, so the
handover Kanri ran before the kessai was a judgment outside the written
rule. The rule change to decide, for `roles/kanri.md`'s Handover section: a
pending kessai larger than the headroom counts as signal 4.

**2026-10-07, from inbox 2026-10-06-kanri-context-cost-and-close-gaps — the
case measured twice more.** Two Kanri tenures of one run met a kessai whose
printed brief would cross the ceiling: one printed a 43 KB brief from
`context=162496` and ended at 251,798 against a ceiling of 218,933; the other
reached 268,700 against 284,797 before a close of 84 rows and judged a
handover before the print the better act. The figures are in
issue-76df's amendment of the same date.

Serves exp-19c1 (tanto-issue-triage, 2026-10-03).
