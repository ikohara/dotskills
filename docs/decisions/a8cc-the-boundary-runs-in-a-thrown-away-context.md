---
id: "a8cc"
title: the boundary runs in a thrown-away context
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: ["aacb"]
created: 2026-09-20
updated: 2026-09-24
---

## Context

Kanri is resident, and a resident session's per-turn cost is its age. The
2026-09-19 Kikaku decision measured where that age comes from: the boundary.
At every boundary Kanri ran the verification commands, took a reading, and
hand-edited six tables — the ledger's Batches, Measurements, `S-n` and Session
events rows and the roster's two — and the old and new text of every one of
those edits stayed in the resident's context for the rest of its tenure. Tool
calls are the second multiplier: every call re-reads the whole context at the
cache-read price, and one measured Kanri made about sixteen tool calls per
boundary, six of them Edits.

The work of a boundary is verification and bookkeeping, both of which produce a
verdict a resident can act on in one line. Nothing about them needs the
resident's own context, and everything about them grows it.

This serves req-04f5's "Kanri is resident, but its context cost does not grow
with its tenure" and its "a session's cost is measured, not guessed".

## Options

- **The resident keeps the reading and writes the rows itself** — today's
  shape. Rejected: the six Edits' old and new text stay in its context, which
  is half the diet.
- **The subagent also rules on known causes.** Rejected: it moves `R-n`
  judgment out of the seat that owns it and rewrites the premise of rule 1.
- **A headless Kanri per boundary now** (shape 2: a controller that watches
  `.tanto/<topic>/` and spawns a headless session per boundary). Rejected for
  now: the 2026-09-19 daemon spike left three points unmeasured, and designing
  shape 2 now would make those three unmeasured points the spec's premises.
- **Shape 2 directly, with no shape 1 first.** Rejected: it moves the human's
  counterpart to another window at the same time as the mechanism changes.
- **No fold script; the brief lists today's commands.** Rejected: the
  hand-edited tables keep their error rate.
- **A superset subcommand in `passage-check.js`** instead of a script of its
  own. Rejected: a Keikaku instrument would carry Kanri's ledger writing.
- **`default` for the boundary subagent.** Rejected: medium effort for a
  verdict, and no independent knob.
- **opus for the boundary subagent.** Rejected: a per-batch top-family
  one-shot runs against the diet this decision exists for.
- **`roles/kanri.md` rewritten whole.** Rejected: beyond the topic, and too
  wide a rule-11 diff.

## Decision

Kanri dispatches a `boundary.verify` subagent per boundary. The subagent runs
`boundary.js check` and `boundary.js record`, renders the next batch prompt,
and writes a verdict file. The resident reads a line of that verdict and rules.
`record`'s idempotency is what makes the rework path one command re-run instead
of another hand edit of a table.

## Consequences

- `roles/kanri.md`'s loop loses its procedure text to a brief, and the same
  brief is what shape 2 would run headless when it is designed.
- The boundary subagent cannot see peers' readings or the resident's own
  top-family dispatches, so both must ride in the dispatch prompt. A design
  that wanted them out of the resident's hands entirely would need peers to
  write their readings to a file, which no line does today.
- The resident's per-boundary tool calls fall to one dispatch plus the verdict
  read; whether `ceiling.kanri.per_batch` (65000) still describes a thin
  resident's growth is read from the next topic's Measurements (issue-d3bc).
- A Jisso spawned per batch under a later design reads the previous batch's
  edits of a self-editing skill; rule 11's boundary needs a pinned copy or a
  rewritten clause (issue-629b).
