---
id: "d604"
title: "rule 9's cap of two top-family sessions is unreachable as `SKILL.md` now states it"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-19
---

Source: session 2026-09-13

Found by the tanto-cost run's batch B task 8 reviewer (2026-09-13), recorded
in `.tanto/tanto-cost/batch-B-report.md`, "Parked and deferred minors" and
"Shoroku candidates".

`skills/tanto/SKILL.md:660-662`, landed by the tanto-cost plan's task 8,
reads: "At most two top-family sessions active at once, Kikaku excepted as
human-paced: Sekkei pauses while Kaiseki is active; Keikaku and Hosa, on the
cheaper families, do not count." After Kikaku, Keikaku, and Hosa are
excluded, the counted set is exactly `{Sekkei, Kaiseki}` — and the same
sentence forbids both being active at once. A cap of two over a set of two
mutually-exclusive members can never be reached; the rule reads as a limit
but states a rule that already makes concurrency impossible on the top
family.

The pre-tanto-cost text had the same shape (the pre-existing rule 9 already
paired "Sekkei pauses while Kaiseki is active" with a cap of two); this
plan's own change was to narrow the counted set to exactly `{Sekkei,
Kaiseki}` by moving Kanri to `sonnet` and adding Keikaku and Hosa as
excluded cheaper-family seats — which sharpens the tension into a plain
contradiction rather than creating it fresh.

Not fixable inside the tanto-cost plan: the sentence is that plan's own `P`
block (`P8.x`), and any further edit to it — including simplifying "at most
two" — would be a second, unquoted change to a path `diff` already treats as
fully accounted for, which is a defect by the plan's own rule.

Two fixes, either closes it: reword to "at most one" (matching what the set
already enforces), or state explicitly that Jisso and Kanri also count
toward the cap (in which case two becomes reachable — Jisso plus one of
Sekkei/Kaiseki, or Kanri plus one of them — and the sentence needs the
counted set restated to include them).

Related: issue-9a68 (the cap's *value* has never been measured against a
real rate limit; this issue is about the sentence being self-contradictory
regardless of what the right value turns out to be — the two should likely
be fixed together, in whichever plan next touches this rule).
