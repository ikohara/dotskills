---
id: "8b1f"
title: `case` applies to script and dir names via a built-in mapping with abbreviation expansion
status: accepted
supersedes: []
superseded_by: null
created: 2026-05-28
updated: 2026-05-28
---

## Context

After introducing the `case` convention (`snake_case` / `PascalCase`) for
script base names via `{{setup}}` / `{{run}}` / etc. placeholders, the
question of **structural directory names** came up: should `docs/` become
`Documents/` in PascalCase projects? `src/` → `Source/`? In .NET-style
PascalCase conventions, abbreviations are typically **expanded** (full
words), not just title-cased — i.e., `Documents`, not `Docs`.

## Options

- **Scripts only.** Apply `case` only to script names; leave structural
  dir names lowercase regardless. Cost: PascalCase projects have an
  inconsistent look (`Source/` doesn't exist; you keep using `src/`).
- **Title-case only.** Apply `case` to both, with mechanical title-casing
  (e.g., `Docs` for snake `docs`). Cost: doesn't match the .NET
  convention authors expect.
- **Built-in mapping with abbreviation expansion.** Apply `case` to
  both, where `docs` ↔ `Documents` and `src` ↔ `Source` expand
  abbreviations; the rest (`tests`, `scripts`, `requirements`, `design`,
  `decisions`, `issues` + the script names) just title-cases.

## Decision

**Built-in mapping with abbreviation expansion.** The snake ↔ PascalCase
pairs embedded in kisou:

- **Script names** (title-cased): `setup` ↔ `Setup`, `run` ↔ `Run`,
  `bootstrap` ↔ `Bootstrap`, `build` ↔ `Build`, `test` ↔ `Test`,
  `lint` ↔ `Lint`.
- **Dir names with abbreviation expansion:** `docs` ↔ **`Documents`**,
  `src` ↔ **`Source`**.
- **Dir names title-cased:** `tests` ↔ `Tests`, `scripts` ↔ `Scripts`,
  `requirements` ↔ `Requirements`, `design` ↔ `Design`,
  `decisions` ↔ `Decisions`, `issues` ↔ `Issues`.

## Consequences

- `{{name}}` is uniform: both script and dir placeholders go through the
  same case-aware lookup.
- The same mapping drives kisou's **destination directory names** when
  writing the doc-system to disk (a PascalCase scaffold ends up at
  `Documents/AGENTS.md`, `Documents/Requirements/AGENTS.md`, etc.).
- Issue-status subdir names (`open` / `deferred` / `resolved`) are
  explicit exceptions — not in the mapping, stay lowercase under any
  `case`. See issue `f9b3-type-subdir-case-clarity` for ergonomic
  followup.
- New / custom dir names (anything not in the mapping table) are NOT
  case-flipped by kisou. Adding a project-specific dir under
  `{{docs}}/` follows the rule in `docs/AGENTS.md` (add to Markdown
  linter ignore, etc.) and stays whatever case the author wrote.
