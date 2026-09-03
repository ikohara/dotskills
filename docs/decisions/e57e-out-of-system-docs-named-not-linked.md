---
id: "e57e"
title: documents outside the six types are named, never path-linked, from frozen documents
status: accepted
supersedes: []
superseded_by: null
created: 2026-09-03
updated: 2026-09-03
---

## Context

The Cross-references rule (issue-d7de) covers the managed types — cite by
`<type>-<id>`, never by path, from an ADR or report — and the flat types
(decision-3544) — `notes/` and `reports/` are cited by path, and the renamer
owns inbound links. It was silent on documents that live under `docs/` but
outside the six types: a tool's own subdirectory such as
`docs/superpowers/specs/`, or a project's `docs/schemas/`. Such files have no
`<id>`, and whoever renames them is not bound by the rename-repair duty, so a
path link to them from a frozen document can neither survive nor be repaired.
A downstream ADR cited a superpowers spec by path; the user ruled on
2026-09-03: from an ADR, name reference only, no path, with `docs/reports/`
the only path exception.

## Options

- **Allow the path link** as a clickable convenience, accepting permanent rot.
- **Name reference only** — the document's title and date, in prose.
- **Forbid citing them at all** from frozen documents.
- **Require freezing first** — the material must be moved into `docs/reports/`
  before an ADR may refer to it.

## Decision

Name reference only, with freezing as the escape hatch: from an ADR or report,
refer to a document outside the six types by its title and date, never by path.
If the material must stay durably citable, freeze it as a `docs/reports/` entry
and cite that path instead. Living documents are unchanged by this rule.

## Consequences

- Recorded in the template's `docs/AGENTS.md` Cross-references and summarized
  in the template's ADR type rules; downstream picks it up via `kisou migrate`.
- The `notes/` path exception stands alongside `reports/`. The ruling text
  named `reports/` alone; that is read as a statement made in a repo that has
  no `notes/`, not as a narrowing of decision-3544.
- Extends the resolution of issue-d7de to a class of targets it did not name.
