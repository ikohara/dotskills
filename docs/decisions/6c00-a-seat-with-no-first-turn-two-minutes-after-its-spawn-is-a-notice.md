---
id: "6c00"
title: a seat with no first turn two minutes after its spawn is a notice
status: accepted
supersedes: []
superseded_by: null
amends: ["1c07"]
amended_by: []
created: 2026-10-04
updated: 2026-10-04
---

## Context

A seat that never runs its first turn is listed `blocked` with no transcript,
and nothing told anyone: across eight shoki spawns the detector was the human,
who found each stalled seat by looking, after half an hour to five and a half
hours. decision-b282 closes the one cause known, but a cause not yet seen
would look the same, and the close that spawns shoki is the run's one
unattended stretch (decision-26fd). Healthy starts in the probes took up to
about a minute. Decided in the shoki-seat design of 2026-10-03.

## Options

- **A first-turn budget in the spawner's census, two minutes, raising a
  notice once and stopping nothing** (chosen).
- **One minute.** Rejected: a slow model load could raise a false notice,
  since healthy starts took up to about a minute.
- **Five minutes.** Rejected: sure, but it lengthens the one unattended
  stretch of the run.
- **A budget on the close's wait for shoki's report.** Rejected: the close is
  the one unattended stretch and has no clock to hold it.
- **The human's observation as the detector.** Rejected: the record of eight
  spawns says what that costs.

## Decision

At every census pass, a seat `seats.json` holds `running` or `blocked` with
no transcript under any project slug, and whose `startedAtMs` is at least
`FIRST_TURN_WAIT_MS` (120000) before now, gets a `noFirstTurn` mark, one
toast and one log line, once; a seat the listing drops before it wrote a
transcript is marked the same way. The seat is not stopped.
`boundary.js census` prints the mark on that seat's line, and Kanri writes
one `attention` request for it. Two minutes is twice the longest healthy start
and eight census passes.

This amends decision-1c07 in one part: the spawner's census raises a toast on
a further signal, the no-first-turn mark, beside `blocked` and an `attention`
request — and on the strayed seat of the bg-seat-ergonomics design's §1.4,
which no decision had recorded and this one does. The rest of decision-1c07
stands.

## Consequences

- A stalled start reaches the human within about two minutes of the spawn,
  with nothing configured, and reaches Kanri through the census.
- A seat with no `startedAtMs` — one recorded before this change — is never
  judged, so no old entry raises a notice.
- As built after the whole-branch review: the toast offers `claude attach`
  only for a seat the listing still holds, and a seat whose prompt was never
  delivered (decision-b282) is removed rather than marked.
- What the notice cannot do is name its cause; telling a permission prompt
  from a usage-limit pause stays open in issue-feac.
