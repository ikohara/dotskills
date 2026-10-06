---
id: "3c08"
title: "topics cannot run as a pipeline: the next topic's Sekkei cannot overlap the previous topic's close"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-07
---

Source: shoroku experience-layer S-96

The next topic's Sekkei cannot overlap the previous topic's close, so topics
cannot run as a pipeline. The close writes `docs/issues`, and the topic's
branch cut waits for the merge; a spec-draft path exists only while a batch
is in flight, not during the close. On 2026-10-01 Kanri advised waiting for
`experience-layer`'s merge before opening `tanto-issue-triage`'s Sekkei, and
the human answered that pipelined running is then impossible and asked for
this issue. No open issue names the close as the serialization point
(issue-2065 is a prose pass).

**2026-10-07, from inbox 2026-10-06-kanri-context-cost-and-close-gaps — what
opening the next Sekkei mid-batch costs.** From one batch boundary,
`context=207530`, to the next, 233,610, a Kanri handled one decision file,
a "can we start the next Sekkei?" answer, a Sekkei handshake with a ledger
opened from the template, the roster and Residency rows, the ledger
placeholders and the orders line: about 26,000 tokens. A spawned Kanri
starts near 155,000 against a ceiling of 219,217, so pipelining the next
topic's Sekkei guarantees the signal-4 handover at the next boundary. The
rule that allows the opening is `roles/kanri.md`'s (the first batch of the
current plan accepted, or every open topic past its spec stage), yet two
decision files of that run worded the next topic as "after the previous
topic's close", and the human had to ask whether the skill allowed it
earlier. The idle block carries only `for you:` acts and says nothing of an
open possibility. The report's direction: from the first accepted batch, a
standing idle line `next Sekkei possible: <topic>`, carrying the measured
cost (about 26,000 tokens of Kanri's context, and a handover at the next
boundary) so the human can weigh it.

Serves exp-bb08 (tanto-issue-triage, 2026-10-03).
