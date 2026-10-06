---
id: "78b3"
title: A queued Jisso's stale entry is marked gone while its roster row stays queued
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-77

A queued Jisso of a skill-editing plan is listed without a pid after several
hours, and the run-owned-seats spawner's census marks it `gone` while its
roster row stays `queued`. The contract says a queued seat's absence is
expected and a send resumes it, and the new census shows no heading for it.
The census and the roster disagree on the seat's state with no rule saying
which one a reader takes.

The wake itself worked: the fifth Jisso, `gone` by the next morning, was woken
by `boundary.js wake` after about twelve hours and ran the whole fix wave on
its kept conversation (S-96, recorded in
`docs/notes/claude-code-sessions-observed.md`). Kin: issue-007e, which names
the census's reconciliation against the roster.

Carrier topic: `roster-ledger` — the census's marks against the roster's
`queued` status.
