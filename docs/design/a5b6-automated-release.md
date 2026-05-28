---
id: "a5b6"
title: automated release — release.ps1 flow
created: 2026-05-28
updated: 2026-05-28
---

## Shape

A single PowerShell script at `scripts/release.ps1` that automates the
mechanical steps of cutting a release. The human is responsible for
writing the `## [X.Y.Z] - YYYY-MM-DD` entry in `CHANGELOG.md` and
committing it; everything after that is automatic, with a confirmation
prompt before remote action.

## Flow

1. **Read version** — parse `CHANGELOG.md` for the first `## [X.Y.Z]`
   heading (skip `## [Unreleased]`). Extract `$version`. Error if no
   version is found.
2. **Tag-collision check** — verify `git tag v$version` does not
   already exist. Error if it does (prevents double-release).
3. **Clean-tree check** — verify `git status --porcelain` is empty.
4. **Patch the install line in `README.md`** — update any version
   reference that needs to track the new release.
5. **Stage + commit** — one commit, message follows the repo convention.
6. **Tag** — `git tag v$version`.
7. **Confirm + push** — prompt the user before `git push` and the
   `git push --tags` of the new tag.

## Invariants

- The script **reads** but never **writes** `CHANGELOG.md`. The user
  writes the entry; the script consumes it.
- Errors are emitted before any state-changing step runs (read /
  check phase is read-only).
- Remote push is gated by an explicit user confirmation prompt.

## Location and tooling

- Path: `scripts/release.ps1` (alongside `bootstrap.bat` /
  `bootstrap.sh`).
- PowerShell — chosen for cross-platform (`pwsh`) availability and
  the existing repo's PSScriptAnalyzer / PSScriptAnalyzerSettings
  setup.
- Tests: `scripts/release.Tests.ps1` (Pester).

## Related

- `req-7a8b` — automated release purpose and behavior.
