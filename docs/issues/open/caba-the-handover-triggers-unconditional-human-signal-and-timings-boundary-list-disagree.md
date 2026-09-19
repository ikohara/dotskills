---
id: "caba"
title: the handover trigger's unconditional human signal and Timing's boundary list disagree
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-19
---

Source: session 2026-09-14

Two sentences in `skills/tanto/roles/kanri.md` read oppositely about whether an
explicit human handover order can be obeyed while a topic is in its spec or plan
stage. "The trigger" makes the human's word unconditional — "signal 2 is any
time at all", after listing it as "**The human's word.** Always, and at any
boundary" — while "Timing" restricts the handover to a boundary of the topic
whose batches are in flight and adds that "Another topic's spec or plan stage
supplies no boundary of this kind and holds no handover of yours." Read
literally, the second sentence withholds the boundary the first says is always
available.

This is a live instance, not a hypothesis. A Kanri tenure was told to hand over
right at a Keikaku handshake, with the topic's plan stage just starting and no
batch of that topic having ever run, and proceeded on the reading that "Timing"
constrains only where the *automatic* signals may fire — a compaction the
session notices, and the ceiling-crossed signal a separate in-progress design
adds — and not the human's explicit word.

design-4807's Handover section already settles the substance in that direction:
"**The human's word**, which always overrides, at any boundary." And "The
trigger" itself says a topic in its spec or plan stage "neither fires the check
nor blocks it", which is the same reading stated about the check rather than
about the timing. So the gap is in the role file's text alone, and the likely
fix is one clarifying clause in "Timing" — saying that the boundary list governs
the automatic signals, and that the human's word is obeyed wherever it is given
— rather than a rewrite of either section.

Nothing is being fixed now; a reader of the role file today can reach either
reading, and the filed shape matches issue-7ba4 and issue-2e19.
