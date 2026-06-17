---
id: "1a2b"
title: kisou — scaffold and migrate a project's standard structure
created: 2026-05-28
updated: 2026-06-17
---

## Purpose

A Claude Agent Skill that stands up a project's standard structure
from a bundled template (greenfield), or retrofits the same structure onto
an existing repository (migrate). Authors get a consistent project
skeleton — `README.md`, `CONTRIBUTING.md`, `CLAUDE.md`, a slim
`AGENTS.md`, the `docs/` document-management system, and optional empty
script files — without re-deriving conventions per project.

## Required behavior

- Two modes: **scaffold** (empty target) and **migrate** (existing
  repository, non-destructive).
- Single source of truth — kisou owns the entire bundled template
  including the `docs/` doc-management system (see decision `9f4b`).
- Migrate is non-destructive — show diffs and ask before modifying
  existing files; never silently overwrite.
- Migrate auto-detects existing project state (dirs, case, scripts, OS
  support, doc-system presence) and only asks the user about inputs it
  cannot determine.
- Re-running migrate on a project kisou previously set up refreshes it
  toward the current template — picking up template improvements made
  since it was first scaffolded — so kisou-using projects do not freeze at
  their scaffold-time template version (see decision `281f`).
- Project naming follows a configurable `case` convention (`snake_case`
  default, `PascalCase` opt-in with abbreviation expansion — see
  decision `8b1f`).
- `scripts/bootstrap.{bat,sh}` is always created — pre-commit install is
  the universal first-run step (see decision `2a5e`).

## Out of scope

- Generating `src/` or `tests/` content — these are the author's
  responsibility.
- Running `git init` — kisou operates on an existing or empty directory
  but does not initialize the repository.
- Auto-generating script content beyond empty stubs.
