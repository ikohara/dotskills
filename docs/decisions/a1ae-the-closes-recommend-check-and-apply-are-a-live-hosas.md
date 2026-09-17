---
id: "a1ae"
title: the close's recommend, check, and apply are a live Hosa's, and Kanri hands over without waiting for them
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-17
updated: 2026-09-17
---

## Context

The close's three steps after the form check — the recommend, the human's
check, and the apply — were Kanri's, as the `shoroku-at-close` spec first
drafted them. The human reversed that after the spec review: the human's check
has unbounded latency, and every minute of it and every file of it sat in
Kanri's tenure and context between the final batch and the handover —
「Kanri はさっさと handover した方がスループットが上がる」.

## Options

- **This decision** — a live Hosa runs steps 2 to 4 under one `close:` line.
- **Kanri runs the three steps itself**, as the spec first drafted. Rejected by
  the human after the review, for the reason quoted above.
- **Hosa pastes the brief and returns the answer only.** Rejected: Kanri still
  dispatches both subagents and still waits.
- **A new seat for the close.** Rejected: Hosa exists, is on a cheap family, and
  already holds the human's chores grant in its own window.
- **Kikaku.** Rejected: it is the human's own seat, and it writes under
  `.tanto/kikaku/` and nowhere else.

## Decision

The close's recommend, check, and apply are a live Hosa's. Kanri checks the
proposal's form, records the rows, sends one `close:` line naming the proposal,
the ledger, the recommendation, the brief, the direction file, the commit
subject, and the slot, and is then free to hand over without waiting. Hosa
answers `close done: <commit subject> — <reading>` or `close blocked: <one
line>`. With no Hosa live, Kanri runs the three steps itself.

## Consequences

A Hosa is worth opening before a close, and Kanri's close line says so. The
successor inherits a delegated write-out where it previously inherited a
verified commit, and the handover file names the delegation. `roles/hosa.md`'s
"Not yours" narrows from "the shoroku write-outs" to the candidates and the
ledger. This narrows nothing decision-1ab5 states about the Hosa seat.
