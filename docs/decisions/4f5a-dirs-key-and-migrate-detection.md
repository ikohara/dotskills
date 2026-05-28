---
id: "4f5a"
title: `dirs` OPTIONAL key + migrate-mode auto-detection of existing state
status: accepted
supersedes: []
superseded_by: null
created: 2026-05-28
updated: 2026-05-28
---

## Context

kisou never creates `src/` or `tests/` (the author owns those), but
the bundled templates reference them — `CONTRIBUTING.md`'s `## Project
structure` lists them, the `## Testing` section assumes `tests/`, etc.
For projects that lack one or both, those references should not ship.
Separately, in migrate mode, asking the user about every input
(`dirs`, `case`, `scripts`, `os`) is tedious when the answers are
sitting on disk already.

## Options for `dirs`

- **New OPTIONAL key.** Add `dirs` with values `src` / `tests`. Templates
  gate the relevant lines via `<!-- OPTIONAL dirs=src -->` /
  `<!-- OPTIONAL dirs=tests -->`. Parallels `scripts=`.
- **Section bare-OPTIONAL only.** Use bare `<!-- OPTIONAL -->` markers
  for the affected sections and let the author drop them by hand.
  Cheaper, but inconsistent with the auto-pruning style used
  elsewhere.

## Options for migrate-mode questioning

- **Always ask.** Step 2 collects all inputs interactively, even in
  migrate mode. Predictable but tedious; user repeats answers obvious
  from disk state.
- **Pre-flight detection.** Before Step 2, scan the target and
  pre-populate any answer that can be inferred (existing dirs,
  case-flavored names, scripts, OS-script presence, doc-system files).
  Ask only the undetermined inputs; surface detected values for
  confirmation before applying.

## Decision

Both. **Add the `dirs` OPTIONAL key** (values `src` / `tests`) used at
line-scope on the Project-structure lines and at section-scope on the
`## Testing` heading. **Add a pre-flight detection step** to migrate
mode that pre-populates `dirs` / `case` / `scripts` / `os` /
doc-system presence from disk inspection.

## Consequences

- `dirs` joins `os` / `os.mode` / `scripts` as a defined OPTIONAL key.
- The `CONTRIBUTING.md` Project-structure lines for `{{src}}/` and
  `{{tests}}/` ship only when the matching `dirs=` is selected.
- The `## Testing` section is gated by section-scope
  `<!-- OPTIONAL dirs=tests -->` (replaces the prior bare
  `<!-- OPTIONAL -->`); auto-drops for projects with no `tests/`.
- Migrate UX drops dramatically — for a repo that already has every
  observable input (case, dirs, scripts, OS), kisou asks effectively
  nothing and goes straight to the numbered plan.
- Detection is heuristic and case-sensitive — see issue
  `e3a1-kisou-case-detection-on-case-insensitive-fs` for a known
  Windows / macOS pitfall.
