---
id: "7d5f"
title: kisou migrate policy unclear for non-stub existing README/etc.
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-05-28
updated: 2026-05-28
---

`kisou` migrate's per-artifact rule for layer-B files says:

> **Present** (`README` / `AGENTS.md` / `CLAUDE.md`) → section / block merge:
> show the diff, get explicit approval, insert only what is missing.

This implicitly assumes the existing file is **template-shaped** (filled stub).
The merge proposal degenerates when the existing file is **real
project-specific content** with sections that don't map to the kisou template
(custom headings, prose, no `<...>` placeholders to replace).

Observed during the first real migrate on `dotskills` (commit `1caf975`):
`README.md` had `## Skills` / `## Versioning` sections custom to this project,
plus `## Install` and a one-paragraph overview. The kisou template's
`Prerequisites / Setup / Install / Usage / Configuration / Contributing /
License` shape does not align. The user manually overrode to
`mv README.md README.md.bak` + write a fresh `README.md` from the template +
graft back the project-specific sections.

## Suggested spec update

Decide an explicit policy. Options:

- (a) **Default to rename-to-`.bak` + fresh write** for any non-stub layer-B
  file. Author re-grafts wanted sections manually. This matches the actual
  workflow used on `dotskills`.
- (b) Show a structured diff: keep existing sections, list missing template
  sections, ask the user to pick which (if any) to add.
- (c) Skip the file entirely and require the author to invoke kisou again per
  file with explicit `--force-overwrite` style flag.

(a) is the most predictable; (b) is the most user-friendly; (c) keeps kisou
purely additive. Pick one and add to the spec.
