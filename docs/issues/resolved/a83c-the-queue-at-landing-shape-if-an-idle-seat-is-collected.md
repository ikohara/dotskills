---
id: "a83c"
title: the queue-at-landing shape, if an idle seat is collected — just-in-time resume or a keep-alive
severity: medium
depends_on: ["1368"]
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-24
updated: 2026-10-03
---

Source: shoroku bg-seat-ergonomics S-33

The row points at the Kikaku decision `2026-09-24-queued-seats-issues.md`;
this is its issue 3.

Rule 11's device — every Jisso of a skill-editing plan spawned at the landing
and left `queued` for hours — assumes an idle seat waits indefinitely. If
issue-1368's measurement shows it does not, the queue-at-landing shape is not
viable as it stands, and two shapes are on the table:

- **Just-in-time resume**, which normalizes the bg-seat-ergonomics run's
  workaround: the seats are spawned at the landing so that each reads the
  skill before batch A, stopped at once, and resumed one at a time at the
  boundary that sends its batch prompt.
- **A keep-alive**: the spawner addresses every `queued` seat at an interval
  under the limit. It costs one context re-read per seat per interval and
  adds a message the roles must learn to ignore.

Kikaku's expectation, for a later Sekkei to weigh: the first, because it costs
nothing while a seat waits and keeps rule 11's reason intact — the seat's
context is still the one that read the skill as it stood before batch A.

This issue is a question, not a decision: its answer needs issue-1368's
measurement and is a spec's. The Kikaku decision `2026-09-24-bg-seat-fixes.md`
item 5 places it on `bg-seat-fixes`; if the measurement finds that an idle
seat survives indefinitely, that topic closes this issue with the measurement
and changes nothing.

The event's third part — the census keeping a dead seat alive when the
listing keeps a stale, pid-less entry for it — landed in the
bg-seat-ergonomics fix wave, and its residue in a fourth reader is
issue-b7bf.

Resolved by "docs: shoroku for bg-seat-fixes" — found by the tanto-issue-triage liveness check, 2026-10-03.
