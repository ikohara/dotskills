---
id: "d538"
title: a Sekkei or Keikaku writes its exit proposal unasked at its final boundary
status: accepted
supersedes: []
superseded_by: null
amends: ["d831", "ce83"]
amended_by: []
created: 2026-09-14
updated: 2026-09-14
---

## Context

decision-d831 gives every planned session exit its own shoroku, opened by
Kanri as the human's delegate, and decision-ce83 fixed the four-step flow
whose step 1 is Kanri's `exit:` line to the exiting session. Under that flow a
Sekkei or a Keikaku that has finished its document idles until the `exit:`
line arrives — a gap whose only remaining act is the exit.

The gap is not free. The seat's own wake-up after it crosses the one-hour
prompt-cache TTL and pays a cold read: a cache write at 1.25x against a cache
read at 0.1x, about twelve warm wake-ups' worth, paid once per such gap.
issue-19d4 recorded this, with the sites it would change, as decided but
unscheduled; the spec dialogue of "tanto-context-ceiling — a token reading, a
ceiling derived from it and gated on the human's presence, and the exit
proposal written unasked" (2026-09-14) decided at Q5 that it rides with that
topic, because it is cost-driven and touches the same report lines.

Sekkei and Keikaku are distinguished from the other roles by being able to see
their own final boundary: Sekkei's is the accepted spec with the human's
answers in `dialogue.md`, Keikaku's is the answered cold read. Jisso and an
attached Kaiseki are Kanri-paced and cannot.

## Options

- **Keep the `exit:` line for every role.** One flow, one trigger, nothing to
  explain — and the gap stays for the two roles that could have closed it
  themselves.
- **The proposal in the final report line, for the roles whose final boundary
  they can see (chosen).** Sekkei names it on `spec accepted:`, Keikaku on the
  line that answers the cold read; Kanri sends no `exit:` to those two and
  dispatches the recommender at once.
- **A proposal before the human's check, with the write-out by another role**
  (the human's first thought in the consultation). Subsumed: the four-step
  flow of decision-ce83 already does the write-out elsewhere, so this asks for
  something the flow already has.

## Decision

A Sekkei or Keikaku writes its exit proposal unasked, as the last act of its
final boundary, and names it in the same report line; Kanri sends no `exit:`
line to those two roles at that boundary and dispatches the recommender at
once.

This amends decision-d831 and decision-ce83 for those two roles only, and only
in who opens the exit shoroku. Every planned exit still carries its own
shoroku, as d831 requires; the flow still has four steps, with the same form
check, the same recommender dispatch, and the same check by exception, as ce83
fixed them. What changes is that step 1's `exit:` line is not sent when the
role has already named its proposal. Both role files keep the `exit:` line for
every other exit — a compaction in the reading (decision-6dea), a replacement
from the Replace table, or the human not wanting the plan now — and for Jisso,
an attached Kaiseki, and Kanri's own exit the flow stands exactly as written.

## Consequences

- The seat idles through one recommender run and through no gap whose only
  remaining act is its own exit, so the cold read that gap paid for is gone.
- Work that arrives after a proposal is named is answered by a second,
  incremental proposal holding only the delta; no proposal is rewritten after
  it is named, because the recommender may already have read it.
- Two exit shapes now exist where there was one, and the role files and
  `SKILL.md` must say which applies where — the cost of the timing change.
- issue-19d4 stays open: it tracks the change to the sites, which this record
  does not make.
