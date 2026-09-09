---
id: "c1d2"
title: kisou skill — modes, template syntax, case mapping, migrate detection
created: 2026-05-28
updated: 2026-09-09
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

The doc-system spans six types — four managed (`requirements` / `design` /
`decisions` / `issues`) plus two flat (`notes` / `reports`; decision `3544`).
Both flat dirs are stamped on scaffold, and `{{notes}}` / `{{reports}}`
participate in the `case` mapping (plain title-case, no abbreviation
expansion).

The bundled top-level `AGENTS.md` tells agents to run `lint` *on the changed
paths* before committing — this assumes the project's `lint` script accepts
file-path arguments (lint only those). Because kisou ships `lint` as an empty
stub (never auto-generates script content), this is a contract the
author-filled script must satisfy, not something kisou enforces.

How the bundle's own Markdown is verified, and by whom:

- The templates are **not** markdownlint-checked where they live. This
  repository's `.markdownlint-cli2.yaml` ignores `skills/**/templates/**`, so
  only the installed copies under `docs/` are linted and a template-only change
  ships unlinted. Linting a template's Markdown therefore means copying it to a
  non-ignored path with the `{{…}}` names expanded and running the linter there.
- Four pre-commit hooks do bind on `skills/**/templates/**` — frontmatter,
  trailing-whitespace, end-of-file, and mixed-line-ending — because
  markdownlint-cli2 is the one Markdown hook the configuration gives an ignore.
  So a template is checked for shape and hygiene but not for Markdown.
- The installed `docs/**/AGENTS.md` copies are **agent instruction files** in
  the sense of this repository's own `AGENTS.md`, which forbids editing them
  without explicit human approval. A refresh of them therefore needs a recorded
  approval before any task touches them — not because kisou requires it, but
  because the files it installs are governed by the rule they themselves state.
  The requirement-extraction plan had that approval through its review brief.

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
   if all of `build` / `test` / `lint` / `tidy` are declined. The lint
   row is labeled **Format & Lint** (one script covers both; still backed
   by the `lint` script).

Then **all TEMPLATE FILL blocks are deleted** before writing.

## Inputs (gathered up front; auto-detected in migrate)

- `os` — `windows` / `unix` (asked, multi-select).
- `os.mode` — `both` / `single` (derived from `os`).
- `scripts` — `setup` / `run` / `build` / `test` / `lint` / `tidy`
  (asked, multi-select; `bootstrap` always created per decision `2a5e`;
  `tidy` is the clang-tidy step, offered mainly for clang + CMake
  projects).
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
  Doc-system detection is **three-state** (`none` / `partial` / `full`); on
  `partial`, only the missing artifacts are added and non-standard subdirs are
  kept (naming-exempt). The flat `notes` / `reports` `AGENTS.md` sit outside
  the tally; on any migrate, an absent one is offered as a refresh addition. Detected values are surfaced for confirmation; beyond
  them, migrate also **asks once about scripts the repo lacks** (`dirs` stays
  existence-only). Scope is **full** (層B + doc-system) or **docs-only**. Per
  artifact: absent → create; a present **kisou-managed** README/AGENTS/CLAUDE
  (or doc-system `AGENTS.md`) → **refresh toward the current template** — add
  missing sections and update diverged fixed-text ones via shown diff + explicit
  approval, never touching free-text or removing author sections (the upgrade
  path for older scaffolds); a present **real-content** file → `.bak` + fresh
  write; `scripts/` → add missing requested scripts, never overwrite; existing
  doc-system → leave intact, add only around it.

  The refresh compares **section structure against the template** and reads no
  `docs/` content; kisou has no consistency check over what the documents say.
  Its gate is a per-file fingerprint, and where the fingerprint does not match
  it falls through to the `.bak`-and-fresh-write branch — which means an
  unrecognized file is not left alone but replaced, the most destructive of the
  available outcomes. The rejection has to come from the operator, so a refresh
  is only as safe as the person answering its prompts. Refreshing a downstream
  copy by hand instead was considered and rejected: it would leave this path
  (decision-281f) unexercised, so the plan runs `kisou migrate` in docs-only
  scope and hand-mirrors only what the refresh misses. Leaving a missed passage
  un-mirrored, to display the failure in the tree, was also rejected — the
  template-versus-copy diff is the invariant that makes an installed copy
  trustworthy, and a finding is carried by an issue and by the run's record,
  never by a knowingly wrong file.

Because refresh keys on **section identity (the heading)** and never removes an
author section, fixed-section headings in `skills/kisou/templates/**` are
stable identifiers: a template change goes inside the existing section's body,
never into a renamed heading. A renamed heading lands downstream as a duplicate
(the old section kept, the new one added); rename detection is deferred
(issue-9ab0). The ADR template's `## Superseding (the only edit to an accepted
ADR)` heading was kept verbatim for this reason when partial supersession was
added (decision-89da).

## Refresh (measured 2026-09-09)

Serves `req-1a2b` — re-running migrate refreshes a kisou-managed file toward
the current template.

The refresh path had never been exercised until the requirement-extraction plan
ran it on this repository's own four installed `docs/**/AGENTS.md` copies, in
docs-only scope, after the templates had gained six passages. Measured shape:

- **Two of the six passages went through the real refresh path**, both in
  `docs/AGENTS.md` — the one file whose fingerprint matched. The refresh found
  the diverged fixed-text section, proposed replacing it, and once accepted
  produced the exact template text; it misplaced and mangled nothing it
  actually touched.
- **The other four were never offered.** `docs/requirements/AGENTS.md`,
  `docs/design/AGENTS.md`, and `docs/issues/AGENTS.md` were classified
  not-kisou-managed, because no fingerprint covers a per-type
  `docs/<type>/AGENTS.md` (issue-e19f), and each drew a `.bak`-and-rewrite
  offer instead. Two thirds of the refresh the plan needed did not happen.
- **Two open questions stayed open**, and the run is not evidence about them:
  the fingerprint gap diverted three files before the fixed-text test ever ran
  (issue-2bf9, masked rather than disproved), and the one file that did reach
  the refresh branch needed no new section, so insertion position went untested
  (issue-f623).
- Every migrate on **this** repository offers the script slots `scripts/` lacks
  — `setup`, `run`, `build`, `test`, and `tidy` — since it holds only
  `bootstrap` and `lint`, so a dogfood here always carries a decline step.

The run is written up in
`docs/reports/2026-09-09-requirement-extraction-dogfood.md`.

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
- `decision-281f` — stateless structural refresh in migrate.
- `decision-89da` — partial supersession links; why fixed-section headings in
  the template stay stable.
- `decision-3544` — notes/reports adopted as flat types.
