---
id: "d3f1"
title: seat and stage cost measurements worth carrying in the skill
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-19
---

Source: session 2026-09-17

Not a defect — reference cost data measured running kuchidome's M6a/M6b/M8
and `residency-retention` topics, better carried in the skill's own
reference material (the shoroku flow, `roles/sekkei.md`, `roles/keikaku.md`)
than left in a downstream repository's notes:

1. **A four-step shoroku's cost.** A whole-topic write-out, 42 items:
   recommender (opus) 126k tokens/23 tool uses/5.6 min; apply (opus) 136k/59/
   7.8 min; against one human line. A role's exit, 7 items: 74k/13/2.3 min
   and 69k/16/2.4 min; against one human word. Both recommendations adopted
   everything — a proposal that already excludes what's in a file leaves
   the recommender little to reject.
2. **A Sekkei seat's floor.** Measured over an M8 spec: `spec.review`
   (opus) 183,670 tokens/52 tool uses/14 min for 15 findings; `brief.write`
   (fable) 114,516 tokens/12 tool uses/4 min; Sekkei's own context stood at
   296,845 tokens when the spec was accepted, after 7 wake-ups and 0
   compactions. The floor is structural: the draft, the whole review, and
   the whole brief each cross the session's own context exactly once by
   construction — plan against that sum, not a per-dispatch budget.
3. **A Keikaku seat's cost (large plan).** A 31-task plan, 8 deliverables,
   ~9,700 lines: ~82 minutes of `plan.draft` dispatch time across four
   rounds (opus: ~49/15/12.5/5.5 min), plus ~13 min `plan.review` and ~5 min
   `brief.write` (both fable). Fix rounds ran roughly a third of drafting
   cost.
4. **A Keikaku seat's cost (small, queued-topic plan).** An 8-task,
   2-batch plan against a 19-section spec under the R-4 queued-topic
   protocol: five dispatches, ~60 minutes total (`plan.draft` opus ~20.75
   min, `plan.review` fable ~9.8 min, a review fix round opus ~11.9 min/11
   findings, `brief.write` fable ~5.25 min, a cold-read fix round opus
   ~12.0 min/6 findings) — plus the protocol's own overhead (a projection
   dry run, three `replay --base <tip>` re-checks against a moving branch
   tip with one collision, both fix rounds re-verified against `HEAD`).

5. **A cost data point for the passage-check-obligations mechanism**
   (measured in this repository, 2026-09-17). Verifying 35 quoted "before"
   fragments across two concurrently-open topics' role-file rewrites —
   `shoroku-at-close`'s own plan and `seat-lineage`'s spec draft — with a
   `default`-kind dispatch on sonnet reading both documents whole plus the
   live role files, cost 161,041 subagent tokens and 48 tool uses over
   roughly 10 minutes, for a "no I-n needed" verdict: no genuine conflict
   found. Worth citing as a rough cost bound for this recurring "two topics
   editing the same skill files" check, alongside a dispatch-granularity
   data point in a kuchidome bug report relayed to Hosa on 2026-09-17.

Items 1 to 4 reported by Hosa `kuchidome-6b [d17de0]` from `C:\Users\0000105523\devel\kuchidome`,
2026-09-15 (delayed in transit — original addressee no longer live; relayed
by this repository's own Kanri 2026-09-17).
