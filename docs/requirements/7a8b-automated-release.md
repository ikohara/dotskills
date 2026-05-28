---
id: "7a8b"
title: automated release flow for the dotskills repo
created: 2026-05-28
updated: 2026-05-28
---

## Purpose

Cutting a release of this repository should automate the mechanical
steps — update the install line in README, commit, tag, push — and
leave the human responsible only for the substantive part (writing the
new CHANGELOG entry).

## Required behavior

- A single script (`scripts/release.ps1`) that:
  1. Reads the new `## [X.Y.Z] - YYYY-MM-DD` heading from `CHANGELOG.md`
     (skipping `## [Unreleased]`).
  2. Verifies the git tag `v<version>` does not already exist
     (prevents double-release).
  3. Checks the working tree is clean.
  4. Updates the install line in `README.md` to reference the new
     version where applicable.
  5. Commits, tags, and pushes — **with a confirmation prompt before
     any remote action**.
- The script reads but never writes `CHANGELOG.md`. The user is
  responsible for writing and committing the new entry before invoking
  the script.

## Out of scope

- Generating release notes (the user writes them in `CHANGELOG.md`).
- Publishing to external package registries (this repo ships skills,
  not packages).
