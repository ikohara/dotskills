---
id: "32e5"
title: usage is measured from transcripts, and kept as one tracked row per close
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-07
updated: 2026-10-07
---

## Context

What a run cost was copied by hand from seats' reports and completion
notices into the ledger and into tracked reports, and two batches of one
measured run had no per-dispatch figure at all. The share figure summed
usage per transcript record, while one API response is written as several
records with identical `usage`, so it overweighted responses of several
blocks. Nothing kept a cost across repositories long enough to read a trend.
The tanto-feedback design (2026-10-06), sections 3.5, 4, 5, and 9, takes the
measurement. Serves exp-178d and exp-3e3b.

## Options

- **Copy figures from seats' reports.** Rejected: two batches of one
  measured run had no per-dispatch figure at all.
- **Keep the cross-repository record in the inbox copies alone.** Rejected: a
  trend over months cannot rest on one untracked directory (Q-8).
- **Calibrate the plans table automatically.** Rejected: only the human knows
  what else drew on the plan in the interval (Q-3).
- **A numeric field in the boundary's verdict.** Deferred (Q-2;
  issue-357f).
- **The by-finder count in the measurement.** Rejected: decision-62dd keeps
  that script out of the close until two or three closes have run it by
  hand, and it stands (Q-11).
- **Instants in the row.** Rejected: a date and durations serve a trend, and
  an instant is a second way to tell a repository (Q-12).
- **CSV as the tracked form.** Rejected: four files for one concern and
  columns that drift; it is an export (Q-14).
- **Measure from transcripts after the fact, and keep one JSON Lines row per
  close.** Chosen.

## Decision

The measure is taken after the fact from the transcripts on disk, a
response counted once, keyed by the recorded model id, with the quality
counters that can be derived beside the tokens; it costs no seat any
context. The local file is untracked; the extract travels in the feedback
file and is collected into `docs/notes/tanto-usage.jsonl` in the skill's
repository. A dated `rates` table turns tokens into one comparable amount as
a view; a `plans` table the human keeps gives one derived number, an upper
bound. The limit's remaining budget is never reconstructed, and nothing
switches a model or an effort on any of it: decision-1708 stands whole.

**Supersedes in practice**, with no ADR amended: the `--share` form and three
Measurements rows, and the Residency rows a close appended for a tracked
report.

## Consequences

No seat copies a figure, and a cost is comparable across closes and
repositories by model id. The record of the repository that ships the skill
reaches the file one close late, since its shoki collects before its own
close places the file. The 30% share target, set on per-record figures, is
to be read again after two closes under the once-per-response definition
(issue-357f).
