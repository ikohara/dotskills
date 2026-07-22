---
id: "3544"
title: notes/ and reports/ join the doc-system as flat types
status: accepted
supersedes: []
superseded_by: null
created: 2026-07-22
updated: 2026-07-22
---

## Context

An existing project ran two extra directories under `docs/` — `notes/`
(maintained references) and `reports/` (dated investigations) — as
non-standard subdirectories. Useful, but two defects surfaced: `notes/` read
as free space that agents dropped working artifacts into, and the frontmatter
story was ambiguous — AIs added, skipped, or varied frontmatter, and report
dates drifted between prose and file names. Formal adoption into the kisou
template forced the choices below.

## Options

- Frontmatter: none / minimal (`date:` only) / the managed types' full block.
- Name: keep `notes/` vs. rename (`references/` and friends).
- Enforcement: AGENTS.md prose only vs. a custom lint guard.
- shoroku: exclude the flat dirs vs. target them.
- References: mint `<id>`s / prose descriptors / path links.

## Decision

`notes/` and `reports/` become standard **flat** types — six types total,
four managed plus two flat:

- **No `<id>`, no frontmatter.** A note's slug is its identity; a report's is
  its file-name date + slug. `.md` → the `# H1` is the title;
  `.toml`/`.yaml` → a leading comment states scope.
- **A report's date lives only in the file name**, never restated in the
  body — a second copy only drifts.
- **The name stays `notes/`**, with a sharpened definition (maintained
  single-concern reference, not a scratchpad) and a top-level "Not a scratch
  space" clause routing tool/skill working artifacts to their own `docs/`
  subdirectories.
- **No custom lint guard** — prose rules in AGENTS.md, like the managed
  types.
- **shoroku targets all six types**: fragments fold into the managed four;
  the flat two take whole files.
- **Flat types are cited by path, from any document.** The frozen-document
  id-only rule exists because issue status moves change paths against
  everyone's will (issue-d7de); flat types have no status directories, so a
  flat path changes only on a deliberate rename — and the renamer owns fixing
  inbound links repo-wide. That mechanical link repair is allowed even in an
  accepted ADR's body; it does not alter the recorded decision.

## Consequences

- Frontmatter add/skip drift and file-name/prose date divergence are
  structurally excluded, not policed.
- Other tools' artifacts have an explicit home outside the six types.
- Renaming a note is an identity change and carries the cost of updating
  inbound references; reports are frozen, so renames stay rare.
- kisou stamps both dirs on scaffold and offers their `AGENTS.md` as refresh
  additions on migrate, outside the `none`/`partial`/`full` tally.
