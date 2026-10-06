---
id: "b8af"
title: a workspace is named by a salted hash of its root commit
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-10-07
updated: 2026-10-07
---

## Context

A feedback file and a usage row must say which workspace they came from, so
that two closes of one repository months apart read as the same one, and
must not say which repository it is. The tanto-feedback design (2026-10-06),
section 6, takes the name. Serves exp-1c02.

## Options

- **The project slug's hash.** Rejected: it changes when the directory moves,
  and whoever knows the path can guess it.
- **The slug's hash with a salt.** Rejected: unguessable, and still broken by
  a move.
- **The commit hash bare.** Rejected: a public value for a published
  repository.
- **A salted hash of the root commit.** Chosen.

## Decision

Seven digits of SHA-256 over a per-machine salt and the root commit hash;
the salt is a personal file, never in a repository that uses or ships the
skill.

## Consequences

The id survives a move or a rename of the directory and reveals nothing to
whoever knows the path or the published history. A lost salt changes every
id of that machine, so the salt is backed up with the private config
directory it lives in. Two machines give one repository two ids.
