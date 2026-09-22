---
id: "1ab5"
title: three seats join the roles — Keikaku, Kikaku, and Hosa — the spec and the plan are two roles, and the boundary is the spec review accepted
status: accepted
supersedes: []
superseded_by: null
amends: ["2f36"]
amended_by: ["c322", "363c"]
created: 2026-09-13
updated: 2026-09-22
---

## Context

issue-3c7a asked for the spec and the plan to be written by two sessions: the
spec is the design judgment and wants the top family, the plan is long output
that `lint` and `replay` check mechanically and wants a cheaper one. The cost
work of 2026-09-12 added two more seats the run had been improvising: the
human's own thinking about what comes next was happening in Kanri's window
(spec input I-1 is a file of exactly that kind, written before the seat
existed), and the small chores — the intake's issue filings, note updates,
the hotfix lane's edits — were Kanri's to hold or to drop.

## Options

- **A mid-session `/model` switch** when the work changes from spec to plan.
  Rejected: the thinking blocks an older model cannot read.
- **One Sekkei carried across topics**, so that the spec seat's context is
  paid for once. Rejected by decision-f496.
- **A tanto-own recommender template** rather than the seats and a `shoroku`
  feature. Rejected: it duplicates a skill tanto composes.
- **Three seats join the roles** — Keikaku (計画) for the plan, Kikaku (企画)
  for the human's thinking, Hosa (補佐) for the small jobs — and the spec/plan
  boundary is drawn where a natural gate already exists.

## Decision

The three seats join, and the spec and the plan become two roles: Sekkei
keeps the spec and the spec review, Keikaku takes the plan, the plan review,
and the handoff, and the boundary between them is **the spec review
accepted**. Kikaku is the seat the human opens to think in, and Hosa is a
place to hand small jobs.

This amends decision-2f36 in one part: its consequence "Kanri becomes the one
role that edits source outside a plan" now reads as one **ruling** with one
**hand** — the hotfix lane stays Kanri's ruling, with Kanri's conditions, its
`R-n`, and its commit subject, and Hosa may be the hand that edits and
commits in Kanri's slot. The rest of 2f36 stands: the lane is open only
between batches or between plans, never on a file the in-flight plan lists,
one commit by explicit path, no issue filed, and the three paths for a fix to
a plan-listed file.

issue-3c7a's "first measurement is Sekkei on `fable` and Keikaku on `opus`"
is replaced by the role matrix's Keikaku on `sonnet`: the matrix was written
a day later with the cost data in view, and supersedes the issue's earlier
guess.

## Consequences

- A Sekkei drafting a spec while another topic's batches are in flight
  commits nothing — it writes a draft under `.tanto/` — and Keikaku makes the
  branch's first commits, the spec's included.
- Kikaku and Hosa have no lifecycle: no create or delete request, no exit
  shoroku, no replace row. The human `/clear`s them, and the next invocation
  re-handshakes as a new session while Kanri marks the old row `cleared`.
- decision-6dea, a peer compaction as a replacement condition, extends to
  Keikaku without amendment.
- When no Hosa is live, Kanri does its own chores as before.
- The reasoning is the tanto-cost design of 2026-09-12; design-4807 records
  the seats and their lifecycles.
