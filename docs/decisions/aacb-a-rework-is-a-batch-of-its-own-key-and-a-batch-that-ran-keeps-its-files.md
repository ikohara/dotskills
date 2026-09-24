---
id: "aacb"
title: a rework is a batch of its own key, and a batch that ran keeps its files
status: accepted
supersedes: []
superseded_by: null
amends: ["a8cc"]
amended_by: []
created: 2026-09-24
updated: 2026-09-24
---

## Context

At `bg-seat-ergonomics`'s batch B, Kanri returned Task 5 for rework and
rendered the rework prompt over `batch-B-prompt.md`. The Jisso, holding the
first prompt in its context, read the `batch:` line as a duplicate and did
not read the file again. The rework's report was then written over
`batch-B-report.md`, and its boundary's verdict over `batch-B-verdict.md`.
The first pass's prompt, report, and verdict are gone, and the ledger rows
recorded from the first pass's Shoroku proposal point at a file that now
holds the rework's report. The design "bg-seat-fixes" (2026-09-24), section
1, sets the rule.

## Options

- **A rework runs under a key of its own, `<X>-rework-<n>`, with three new
  files, a Batches row of its own, and a Jisso that reads every `batch:`
  line's file from disk.** Chosen.
- **A new path for the prompt alone.** Rejected: the report and the verdict
  were overwritten too (A1-2).
- **One row listing every pass's paths in its cells.** Rejected: `record`
  writes one value per cell.
- **Trusting the Jisso to notice a changed file at an old path.** Rejected:
  its memory of the path is the failure (1.6).

## Decision

A batch's key is its letter for its first pass; a batch returned for rework
runs again under `<X>-rework-<n>` — `<n>` is 1 for the first rework and one
more than the highest so far after that, and the fix wave's rework is
`fixwave-rework-<n>`. The key stands wherever a path, a row, or an argument
names the batch. A prompt, a report, or a verdict of a batch a seat has run
is never written again; the one file that may be written again is the next
batch's prompt while it is rendered and not yet sent. The first pass's row
stays, State `rework`; each rework has a row of its own. A Jisso that
receives `batch: <path>` reads that file from disk before it judges
anything, whether or not it has read a file at that path before.

This amends decision-a8cc in one part: its "`record`'s idempotency is what
makes the rework path one command re-run" — the rework path is still one
`record` command, now writing a row of its own key. The rest of
decision-a8cc stands.

## Consequences

- What every seat read and wrote stays on disk, and a close's recommender
  can quote a first pass's items from their own file.
- `boundary.js record --batch <key>` appends a row when no row's first cell
  matches the key, so the script is unchanged; a test pins that a rework's
  `record` leaves the first pass's row as it was.
