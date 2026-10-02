---
id: "78a5"
title: kisou migrate learns no type rename; the pilot repository migrates by hand inside its own plan, under the doc-system hook
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-02
updated: 2026-10-02
---

## Context

Renaming `requirements` to `experience` (decision-1ef9) changes the template
kisou installs and every project's installed copies. This repository is the
first to move, and kisou migrate has no notion of a type rename. Decided in
the `experience-layer` spec of 2026-09-30.

## Options

- **Teach migrate to rename a type.** The 2026-09-09 dogfood measured migrate
  misclassifying every per-type file, so not yet.
- **A `.bak` rename path**, rejected by decision-0590's uncertainty rule.
- **The hand migration**: the pilot repository migrates by hand inside its
  own plan, under the doc-system pre-commit hook (chosen).

## Decision

kisou migrate learns no type rename. This repository migrates by hand inside
its own plan, and the doc-system hook, which pins every installed copy byte
for byte to its template, keeps the template and the copies level.

## Consequences

- Other kisou projects migrate lazily, as their own topic each.
- Until migrate learns the rename, a project's old `requirements/` type rules
  file can outlive the fold beside the new one.
