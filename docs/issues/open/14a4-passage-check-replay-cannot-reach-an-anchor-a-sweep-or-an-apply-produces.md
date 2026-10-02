---
id: "14a4"
title: "`passage-check replay` cannot reach an anchor whose `after:` value a script sweep or an apply produces"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-82

`passage-check replay` cannot reach a plan anchor whose `after:` value is
produced by a script sweep or an apply rather than by passage blocks. On the
`experience-layer` plan it prints
`anchor-after: A8.1 — expected after: 0, got: 17` as its first line and
exits 1, where 17 is the base's 22 less Task 7's five heading passages; the
live tree has 0. The line comes first, before the 49 skips, so a reader
takes it for a defect. A per-anchor `replay-skip:` marker, or scoping
anchors to passage-produced files, would let `replay` exit 0 on such a plan.
Carrier topic: `passage-check-hardening`. Distinct from issue-f11c, which is
about phase-conditional fences, not anchors.
