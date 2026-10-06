---
id: "902e"
title: cleared stays in record --status's vocabulary after the clear rules are gone
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-32

A deferred item of the run-owned-seats design: `cleared` stays in
`boundary.js`'s `record --status` vocabulary, kept for that run's own close,
though the design retires every `/clear` rule and the `cleared` status with
them. It is to be removed once no run writes it. Kin issue-007e (the
census's `dead` and `cleared` rules against the four cases); the same
vocabulary cannot write `dead`, which the roster's Status column uses (issue-11de).

Carrier topic: `roster-ledger` — `boundary.js record`'s status vocabulary is
the roster's writer.
