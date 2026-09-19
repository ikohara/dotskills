---
id: "bf89"
title: presence read from more than Kanri's own window
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-20
---

Source: shoroku tanto-context-ceiling

The human's turns in the other roles' windows, readable from the roster's
transcript paths, would sharpen the presence verdict; not done, because the
one window is enough for the rule and every further read is a cost.

decision-eee2 gates the handover and the replacement on the human's presence,
and reads presence from the last wake-up record in **Kanri's own** transcript
whose `origin.kind` is `human`. A human who is present in a Sekkei's or a
Jisso's window but has not spoken to Kanri inside the presence window reads as
absent, and the handover is deferred when it could have run.

The wider read is possible at all because of the `origin.kind` fact recorded
in `docs/notes/claude-code-sessions-observed.md` — a session can tell the
human's turns from a peer's in any transcript it may read, and the roster's
Transcript column holds the peers' paths.

Deferred: the one window satisfies the rule as written, and every additional
transcript read is paid at every boundary check.

**2026-09-20, `bug-report-hold` — two further measured instances, both at a
larger scale than the one this issue was filed from.** A single continuous
Kanri tenure carried an **entire plan's batch phase** under a deferred
handover, unbroken from its first batch through the T2 close, on an `absent`
verdict throughout — while the human was in fact present and active in Jisso's
window, mid-fix-wave, for that whole span. A second tenure of the same plan
carried batches C through E, the whole-branch review and the fix wave the same
way: the ceiling crossed at batch C's own boundary (`context=233817` against
`218104`), and batch D, batch E, the review dispatch, the fix wave and the
close all read the same `absent` verdict on the same metric, with context
growing from `91312` at handover receipt to `393204` — roughly 300000 tokens
across five boundary-equivalent checks with no reset.

Nothing was lost either time, because the close hands over regardless. What
the two add to R-18's original instance is scale: the gap is not a single
deferred boundary but, under a run whose human works in a peer's window, the
whole back half of a plan. issue-b409 is the narrower sibling found in the same
topic — a human message sent mid-turn is not a wake-up the presence read can
see at all.
