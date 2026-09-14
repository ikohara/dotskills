---
id: "eee2"
title: the handover and the replacement fire on a derived context ceiling, gated on the human's presence, with the harness's auto-compact window as the backstop
status: accepted
supersedes: []
superseded_by: null
amends: ["de63", "b6cb", "6dea", "9a3a"]
amended_by: []
created: 2026-09-14
updated: 2026-09-14
---

## Context

req-04f5 requires that a seat stay under an operating context ceiling the run
chooses, and leaves what the ceiling is and how it is arrived at to a recorded
decision. Until now the skill had no such ceiling. Its lifecycle signals for a
grown session were the plan close, the human's word, and a compaction the
session notices; its only cost instrument was the transcript reading in bytes,
records, wake-ups and compactions, which issue-40ed had already asked to
replace with a threshold it could act on.

The 2026-09-14 token measurement (recorded on issue-40ed and in
`docs/notes/claude-code-sessions-observed.md`) closed the instrument question:
every `assistant` record's `usage` object sums to that turn's context in
tokens, and auto-compact on a 1M-window model does not fire until roughly
967k. One Kanri grew to 950k across a single plan with no signal firing at
all, while the Account & Usage view attributed most of a day's cost to
contexts over 150k. A ceiling was therefore needed, and the two questions it
raised — what number, and what happens when it is crossed while the human is
away — were settled in the spec dialogue of the design
"tanto-context-ceiling — a token reading, a ceiling derived from it and gated
on the human's presence, and the exit proposal written unasked" (2026-09-14).

## Options

- **A fixed 150k ceiling.** Simple to state, but 150k is the Account & Usage
  view's cost bucket rather than a documented quality threshold, and a fixed
  number goes stale as a seat's baseline and per-batch consumption move.
- **A derived ceiling with a handover regardless of presence.** The ceiling is
  a measured baseline plus a chosen number of batches of measured consumption.
  Crossing it hands over at the next boundary whether or not the human is
  there — but a handover is complete only when the human creates the
  successor, and the successor is what sends the next batch prompt, so a
  handover written to an empty room stalls the run for as long as the room is
  empty.
- **The derived ceiling, gated on the human's presence (chosen).** The same
  derivation, with the handover or replacement firing at the next boundary
  only when the human's last turn in Kanri's own window is inside the presence
  window; otherwise the crossing is recorded as deferred, and the plan close
  hands over as it already does.
- **Re-checking a deferred crossing at every later boundary the human is
  present and declining (rejected).** The deferral would have no terminal
  state: each later boundary would re-fire the exit shoroku, paying a full
  recommender run and a human check for an answer the human had already given.
  Rejected for that cost; the terminal `declined` state below is what replaced
  it.
- **A protocol hard ceiling above the soft one (rejected in the dialogue, Q3).**
  Kanri would hand over regardless of presence and the run would stall,
  keeping the state in a handover file rather than in a compaction summary and
  bounding cost without depending on a harness setting. The human preferred
  the harness's own net to a second protocol state. Filed as a deferred issue
  so the option keeps its reason on record.

## Decision

The handover and the replacement fire on a derived context ceiling, gated on
the human's presence, with the harness's `autoCompactWindow` as the backstop.
This amends four accepted ADRs in part; each stands in every respect not named
here.

- **decision-de63** — Kanri's two handover signals become four. The added
  signals are the ceiling crossed and, under the same gate, the compaction
  already recorded. de63's "not a batch or plan count" stands: the new signal
  is not a count either, and the reading's token figure is the instrument
  issue-40ed asked for. Everything else de63 decided stands.
- **decision-b6cb** — the plan close stays the ordinary trigger and still
  hands over without a threshold and without asking. What is added is that a
  ceiling crossing can hand over at an earlier boundary, and only when the
  human is present.
- **decision-6dea** — amended for **Kanri only**: Kanri's noticed compaction
  is gated on the human's presence, so a Kanri that compacts while the human
  is away continues to the plan close on its summary. The peers' rows of the
  Replace table stand ungated, because a peer's replacement falls at its next
  commit or report, which is human-paced already.
- **decision-9a3a** — amended in one part: `tanto.json` carries three maps
  rather than two, the third (`ceiling`) effective like `subagents`. The
  key-by-key overlay onto built-in defaults, the defaults living in the skill,
  and the personal file outside the repository all stand.

**A deferred handover's deferral ends when the human, present, declines it.**
The `declined` state is terminal for this plan: the exit shoroku does not
re-fire at later boundaries, and the crossing is not put to the human again.
This matches a declined plan-close handover, which is not re-asked either. The
alternative — re-checking at every boundary while the human is present and
declining — was rejected as paying a full recommender run and a human check for
an answer already given.

The ceiling itself is a measured baseline plus a chosen number of batches of
measured consumption, and Kanri and Jisso are its subjects; the other roles
measure and are not replaced on it. 150k is named throughout as the human's
chosen operating ceiling and a cost bucket, not a documented quality
threshold.

## Consequences

- The ceiling moves when consumption moves: it is derived from figures the run
  re-measures, so a lighter baseline or a cheaper batch lowers it without an
  edit.
- A deferral is a recorded state, not a silence — it is written in the
  ledger's Progress line, a roster Events line, and the next batch prompt, so
  a successor or a cold reader sees it.
- While the human is away, the compaction summary is the state a Kanri runs
  on. That is the cost accepted for not stalling the run, and the day a
  summary loses a ruling is the day the rejected hard ceiling is reconsidered.
- The `autoCompactWindow` is the human's to set and the skill's to report:
  Kanri's start line compares it against the ceiling and recommends a value,
  and the skill sets nothing.
- issue-40ed's Kanri and Jisso halves are answered; the question of a ceiling
  for the measuring roles waits on the archive's Context column.
