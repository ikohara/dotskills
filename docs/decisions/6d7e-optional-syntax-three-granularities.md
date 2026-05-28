---
id: "6d7e"
title: OPTIONAL syntax has three granularities, with AND across multiple markers
status: accepted
supersedes: []
superseded_by: null
created: 2026-05-28
updated: 2026-05-28
---

## Context

kisou's template uses HTML-comment markers (`<!-- OPTIONAL ... -->`) to
gate sections, blocks, or lines based on the user's answers. The
question was how many granularities to support and how to combine
multiple conditions.

## Options

- **Single granularity (section-only).** Simple to spec, but forces
  authors to split content across sections to express line-level
  options. Limited.
- **Two granularities (section + line).** Covers most cases. Line-scope
  enables per-OS or per-script gating on individual list items.
- **Three granularities (section + block + line).** Adds *block-scope*:
  a marker on its own line before a non-heading block gates the next
  contiguous non-blank block. Enables one-of-N branching (e.g.,
  switching between a labeled bullet list and an unlabeled `console`
  block based on `os.mode`).

## Decision

**Three granularities,** with **AND across multiple markers on the
same line** (whether marker-line or content line). Specifically:

- **Section-scope.** Marker on its own line before a heading. Bare
  `<!-- OPTIONAL -->` = author-omittable (kisou drops if the body
  still contains unfilled `<...>` placeholders). With `key=value` =
  kisou drops the whole section unless the condition is met.
- **Block-scope.** Marker on its own line before a non-heading block.
  Gates the **next contiguous non-blank lines** (until a blank line,
  heading, or another marker line).
- **Line-scope.** Marker at the end of a content line. Drops the line
  unless the condition is met.

Multiple markers chained on the same line are **AND** (all conditions
must hold).

## Consequences

- Block-scope enables the *one-of-N branching* pattern used in
  Setup / Usage / Development setup: each variant lives in its own
  block, gated by mutually exclusive conditions
  (`os.mode=both` vs. `os.mode=single` + `os=windows` vs.
  `os.mode=single` + `os=unix`); exactly one block survives pruning.
- Defined OPTIONAL keys: `os`, `os.mode`, `scripts`, `dirs`.
- The `CONTRIBUTING.md` workflow table is too dense for inline
  markers; that file's TEMPLATE FILL block instructs kisou to prune
  table rows / columns separately (see decision `4f5a` for related
  detection details).
- Implementation complexity in kisou: it has to parse three marker
  positions and an AND combinator, plus implement two non-inline
  pruning rules for tables. The cost is real but bounded.
