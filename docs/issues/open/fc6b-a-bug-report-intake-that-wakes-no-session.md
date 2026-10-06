---
id: "fc6b"
title: a bug-report intake that wakes no session
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-32

A deferred item of the run-owned-seats design (D-23), the one the spec
itself files at the close: an intake that wakes no session — the spawner
taking a `bug-report:` as a request, copying it to the inbox, and answering
with its result file. Under that design a parked Kanri-less run, or a
dialogue seat offline between turns, is woken by every line sent to it; an
intake through the spawner would take a report without a wake. It redoes
decision-c322's route, and it needs the sender to write into another
repository's `.tanto/`.

Carrier topic: `tanto-feedback` — it redoes decision-c322's intake route,
which that topic's scope carries as the `bug-report:` line.
