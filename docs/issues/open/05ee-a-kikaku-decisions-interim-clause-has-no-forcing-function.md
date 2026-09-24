---
id: "05ee"
title: a Kikaku decision's interim clause has no forcing function and can go unadopted for days
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-24
---

Source: shoroku bug-report-hold S-5

A Kikaku decision may carry an **interim clause** — a rule to run "in each open
ledger, until the topic lands" — and nothing makes any tenure adopt it. No
`R-n` cites it until a later tenure happens to read the decision file.

Measured: a Kikaku decision of 2026-09-15 ruled an interim bug-intake protocol
with three parts (a report is copied to the inbox and answered `received:` with
no filing and no per-report ruling; a tracked write from a report names its
source as the inbox slug only; the topic's own close triages the untriaged
copies). Checked against the ledger and the roster at that topic's close, on
2026-09-19: **never adopted** by any predecessor tenure. No `R-n` cited it, no
reply read `received:`, and the run's own bug-report handling — individual
`triage: issue-<id>` replies, sibling repository names in commit subjects and
issue bodies — ran the pre-decision way throughout, for four days. The tenure
that noticed adopted it by ruling for the remainder of the topic; nothing
already committed was undone.

What is missing is a mechanism, not a sentence: something that puts an interim
clause in front of the tenures it binds, or that makes an unadopted clause
visible at a boundary. Alongside issue-c1e5 (non-docs relay items have no
cross-tenure forcing function) and issue-274f (a decision touching a mechanism
in flight does not name the block that lands it) — the same family, from three
directions.

**2026-09-24, `bg-seat-ergonomics` — a decision addressed to a later topic
has no check that the topic took it** (shoroku bg-seat-ergonomics S-8). The
same gap one step removed: a Kikaku decision that places an item on a later
topic has nothing that confirms the topic took it. Two instances, neither of
which landed: the 2026-09-16 term change was placed on `seat-lineage`, and
issue-e3e4 on `tanto-diet`. Both surfaced only when the bg-seat-ergonomics
spec dialogue read the decisions again.
