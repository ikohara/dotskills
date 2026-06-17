---
id: "281f"
title: stateless structural refresh in kisou migrate (no version stamp)
status: accepted
supersedes: []
superseded_by: null
created: 2026-06-17
updated: 2026-06-17
---

## Context

kisou migrate could add what an existing repo was missing but had no way to
bring a repo *scaffolded by an older kisou* up to the current template — such
projects drift from the template forever (issue `5e7f`). The merge granularity
for the existing stub-shaped Present branch (auto-merge vs. always ask) was also
never pinned (issue `c6d7`).

## Options

- **Version stamp (stateful).** Write a `kisou-template-version` into generated
  files; migrate compares versions and offers a refresh. Adds persistent state
  to every project, demands a bump on every template change, and still needs
  content comparison to say *what* changed — and already-deployed repos carry no
  stamp, so the projects that most need upgrading cannot be recognized.
- **Stateless structural comparison.** No stamp; recognize kisou-managed files
  by a template fingerprint and compare structure against the current template
  at migrate time.

## Decision

Adopt **stateless structural comparison**. Refresh is a sub-case of the migrate
Present branch — no new mode, no new trigger: a kisou-managed file is refreshed
toward the current template by adding missing fixed sections / blocks and
updating **fixed-text** sections that diverged, always via numbered
partial-accept. Free-text (`<...>`) sections and author-added sections are never
flagged or removed — this is the `c6d7` granularity answer and what bounds false
positives. Real-content files keep the `7d5f` `.bak` + fresh-write path.

## Consequences

- Re-running `kisou migrate` is the upgrade path; it works on any kisou-shaped
  repo regardless of scaffold-time version, including pre-existing ones.
- No manifest / version field is introduced; kisou stays a thin, stateless
  shell.
- Refresh fidelity depends on the fingerprint and the fixed-text / free-text
  line; ambiguous sections err toward leaving the author's content untouched.
- Resolves issues `5e7f` and `c6d7`; complements `e8f9` (three-state doc-system
  detection) and `b2a4` (scripts intent prompt) landed in the same change.
