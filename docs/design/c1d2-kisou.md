---
id: "c1d2"
title: kisou skill — modes, template syntax, case mapping, migrate detection
created: 2026-05-28
updated: 2026-05-28
---

## Shape

A **thin shell over a bundled project template** at
`skills/kisou/templates/`. The skill itself is mostly trigger / mode
detection / orchestration; the substance is in the bundle.

The bundle produces (always, when scaffolding): `README.md`,
`CONTRIBUTING.md`, `CLAUDE.md`, a slim top-level `AGENTS.md`, the
`docs/` doc-management system (`docs/AGENTS.md` +
`docs/<type>/AGENTS.md` + the `docs/issues/{open,deferred,resolved}/`
skeleton), and `scripts/bootstrap.{bat,sh}`. Optional, on user request:
`setup.{bat,sh}`, `run.{bat,sh}`, and the other `scripts/*.{bat,sh}`.
Never produces `src/` or `tests/` (neither content nor empty dirs);
never runs `git init`; never auto-generates script content.

## Template syntax (three categories, processed in order)

1. **Substitution.** `<...>` = free-text user fill. `{{name}}` = project
   entity name (script or dir), expanded by kisou per a built-in
   `case`-aware mapping (see decision `8b1f`).
2. **OPTIONAL gating** in three granularities (see decision `6d7e`):
   *section-scope*, *block-scope*, *line-scope*. Bare
   `<!-- OPTIONAL -->` = author-omittable; `<!-- OPTIONAL key=value -->`
   = kisou auto-drops unless condition met. Multiple markers on one
   line are AND.
3. **Table pruning** (instruction-based via TEMPLATE FILL): the
   `CONTRIBUTING.md` workflow table is too dense for inline markers;
   kisou prunes rows for declined scripts and the column for an
   unselected OS, and drops the whole `## Development workflow` section
   if all of `build` / `test` / `lint` are declined.

Then **all TEMPLATE FILL blocks are deleted** before writing.

## Inputs (gathered up front; auto-detected in migrate)

- `os` — `windows` / `unix` (asked, multi-select).
- `os.mode` — `both` / `single` (derived from `os`).
- `scripts` — `setup` / `run` / `build` / `test` / `lint` (asked,
  multi-select; `bootstrap` always created per decision `2a5e`).
- `dirs` — `src` / `tests` (asked, multi-select; see decision `4f5a`).
- `case` — `snake_case` (default) / `PascalCase` (asked; drives
  `{{name}}` expansion via the mapping in decision `8b1f`).

## Modes

- **scaffold** — empty target. Gather all inputs in Step 2, write
  the structure (placeholders resolved → OPTIONAL pruned → TEMPLATE
  FILL deleted), one git commit, no auto-push.
- **migrate** — existing repository. **Pre-flight detection** scans the
  target for existing dirs, case-flavored names, scripts, OS-script
  presence, and doc-system files, and pre-populates the inputs above.
  Only undetermined inputs are asked; detected values are surfaced for
  confirmation. Scope is **full** (層B + doc-system) or **docs-only**
  (installing only the doc-system into an existing repo). Per artifact: absent →
  create; present README/AGENTS/CLAUDE → section / block merge with
  shown diff + explicit approval; `scripts/` → add missing requested
  scripts as empty files, never overwrite; existing doc-system → leave
  intact, add only around it.

## File output paths

Destination directory names are **case-correct** per `case` (a
PascalCase scaffold writes to `Documents/AGENTS.md`,
`Documents/Requirements/AGENTS.md`, `Documents/Issues/{open,deferred,
resolved}/`, etc.). The bundle inside this repo is authored in canonical
(snake) form; case is applied at scaffold time.

## Related

- `req-1a2b` — kisou's scope and required behavior.
- `decision-9f4b` — kisou as sole installer (Option X rejected).
- `decision-8b1f` — case mapping with abbreviation expansion.
- `decision-2a5e` — bootstrap is mandatory.
- `decision-6d7e` — OPTIONAL syntax three granularities.
- `decision-4f5a` — `dirs` key + migrate auto-detection.
