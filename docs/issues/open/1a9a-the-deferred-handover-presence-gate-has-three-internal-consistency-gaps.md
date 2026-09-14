---
id: "1a9a"
title: the deferred-handover / presence-gate logic has three internal consistency gaps
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

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
