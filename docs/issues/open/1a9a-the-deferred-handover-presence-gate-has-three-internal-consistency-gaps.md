---
id: "1a9a"
title: the deferred-handover / presence-gate logic has six internal consistency gaps
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-19
---

Source: session 2026-09-14

Found while landing `roles/kanri.md`'s deferred-handover / presence-gate
machinery (context-ceiling task 8; see design-4807 and decision-eee2 for the
mechanism these gaps are in). All three are inherited verbatim from the
plan's own P8.1/P8.2 text, confirmed not an implementer deviation.

1. A deferred handover's recorded "absent" reason can go stale once the
   human returns and declines to hand over ("continue"): no distinct
   "declined" state exists to update it to, so the record keeps saying
   "absent" after the human has, in fact, been present and answered.
2. Two different rules pick which handover procedure follows a "present"
   verdict — one keyed on "batch in flight", the other on "ledger open" —
   and they disagree exactly in the spec/plan-stage case that this task's
   own new machinery makes real (a topic open, ledger open, but no batch in
   flight yet).
3. The task's own prose claims the spec/plan-stage check is "safe on
   Timing's own terms", but the unedited Timing section does not actually
   say that.

Severity is medium: this is the new ceiling/presence-gate mechanism's own
internal consistency, not a cosmetic nit.

**2026-09-14, the run's T2 — three further gaps of the same kind.** Found
across the plan's later batches and its whole-branch review; the title's count
is raised from three to six. One of them is already fixed in the protocol and
is recorded here because this issue is the only place a reader would look for
the count.

- **Gap 4 — what resets the Progress line after a decline, and what a declined
  Events line looks like, are both unstated.** The decline paragraph's own
   human-approved wording says a decline is recorded, but the deferral has an
   explicit format in `roles/kanri.md`'s Progress guidance and the decline has
   none — so a Kanri that records a decline has no form to write and no rule
   for clearing "handover written" from the Progress line. Not fixed in the
   run's fix wave: the text sits inside the human's own already-decided
   wording, which the wave was not authorized to rewrite. It should be filled
   wherever that text is next opened.
- **Gap 5 — the create-request clause's missing "and is not deferred", found
  and fixed.** Loop step 6's create-request clause originally had no qualifier
  excluding a deferred handover, so a deferred trigger would still push a due
  create request to a successor who is not coming. Fixed in the plan's own
  fix wave (batch F, F6). Recorded here as the historical fact that a fourth
  gap of this kind existed, since the three above were filed as the complete
  set.
- **Gap 6 — `roles/kanri.md`'s "Signals 3 and 4 are the mid-plan cases" is
  wrong about signal 4** (line 570). Since task 8, signal 4 also fires in a
  topic's spec or plan stage, which is not "mid-plan" in the sense the
  sentence implies. The whole-branch review's Minor list suggested F3's
  adjacent edit would absorb it; that was checked directly against F3's two
  landed edits (the Timing-section sentences), which do not touch this
  sentence — so it was not absorbed and remains open. A wording fix on the
  scale of a clause, wherever `roles/kanri.md`'s "The trigger" is next opened.
