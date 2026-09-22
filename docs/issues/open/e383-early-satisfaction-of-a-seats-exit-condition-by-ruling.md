---
id: "e383"
title: early satisfaction of a seat's exit condition, by ruling
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-22
updated: 2026-09-22
---

Source: inbox 2026-09-17-kaiseki-delete-condition-is-a-floor-not-fixed

The Kaiseki branch's step 6 and the Delete table in Session lifecycle state one
fixed condition for exiting a Kaiseki case: "Jisso's fix … passes review and
tests, and no `blocks this task: yes` item is open", with the reasoning "Not
before: a fix that misses goes back to the same Kaiseki with its context
intact." Both read as a fixed gate.

Twice in one tenure, the gate was satisfied early by ruling instead. In
`residency-retention`, ruling R-28 exited Kaiseki 2 before the fix was reviewed,
because the diagnostic value was already fully captured in a complete, precisely
specified report and a concrete fallback existed — a fresh Kaiseki 3 reading the
same report, the same recovery shape the Replace table already uses for a
compaction. Ruling R-25 replaced Jisso ahead of the plan's own "has carried the
batches the plan expects of one session" row, on the same reasoning shape:
ceiling crossed, no further live work pending, a precedented recovery path.

Because neither text names early satisfaction as legitimate, the human had to
propose the deviation from scratch and Kanri had to reconstruct the
justification each time.

The deferred decision is whether early satisfaction by ruling becomes a standing
option of the protocol. The human's answer at this close is that early
satisfaction should be written into the protocol as a formal standing option, so
what remains is the wording and its site. The proposed shape, from the report: a line
at the Kaiseki branch's step 6 and/or the Delete table generally — a session's
own exit condition may be satisfied early, by Kanri's ruling, once its own
report or proposal is a complete, precedented recovery point (a fresh session
could pick up from it with no loss) and the cost of holding the live session
open — a top-family seat under Rule 9, a re-identification cost across `/tanto
fukki` cycles, or any other concrete, ongoing cost — is itself concrete rather
than theoretical. That is the shape both R-25 and R-28 independently derived
from first principles.

The landed background-seats design changes the mechanism this would operate
through — `stopped` as a state, a `stop` request for a terminal seat
(decision-8320) — but not the question.
