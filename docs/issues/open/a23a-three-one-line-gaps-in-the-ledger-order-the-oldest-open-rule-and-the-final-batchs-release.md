---
id: "a23a"
title: three one-line gaps — the ledger's section order, the oldest-open rule, and the final batch's release
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-09-24
---

Source: shoroku bg-seat-ergonomics

Triaged at that close from the received report whose inbox copy is
`bug-report-roster-progress-order-resumed-role-exit-shoroku-gaps` (an
undated slug, which the `inbox` Source form cannot carry).

Three documentation gaps, each navigated correctly by the tenure that hit it
but none named in the skill's own text:

1. **The conductor ledger's two orderings.** `templates/kanri.md` states no
   ordering for the Progress section (newest first) against the Session
   events (newest last). A Kanri inferred the Progress ordering from its
   predecessor's entries, a plausible way for a later one to guess wrong and
   interleave entries out of order.
2. **"Else the oldest open" topic.** `SKILL.md`'s rule for where a handover's
   Shoroku proposal items go does not exclude a topic whose close has already
   run its check. A tenure found the oldest open topic mid-close, with its
   direction written and its apply pending; rows written there could have
   been neither recommended nor applied, so the tenure used another ledger.
3. **The final batch's release timing.** `roles/kanri.md`'s "The final
   batch" step 2 states that the prior Jisso's release goes out when the
   fix-wave prompt goes to its successor, but has no line at the point of
   execution. A tenure sent the fix-wave prompt without the release in the
   same turn and caught it several turns later.

Each fix is one line in the section named. The report's fourth gap — a name
and ref recurring for a different role after a `/clear` — is issue-271a's.
