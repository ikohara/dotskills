---
id: "9f4b"
title: kisou is the sole installer of the doc-system; shoroku carries no bundle
status: accepted
supersedes: []
superseded_by: null
created: 2026-05-28
updated: 2026-05-28
---

## Context

Two skills need to interact with the doc-management system: `kisou`
(scaffold / migrate) and `shoroku` (excerpt session / memory / file into
the docs). An early design had `shoroku` own and install the
doc-management `AGENTS.md` set itself. When `kisou` was added as the
broader project scaffolder, the question of doc-system ownership
re-opened: which skill bundles and installs the doc-system files?

## Options

- **Option X.** `shoroku` continues to own the bundle. kisou composes
  / copies from it at scaffold time. shoroku stays self-sufficient
  (bootstrap + fallback work without kisou).
- **Option Y.** kisou owns the bundle outright. shoroku has no bundle —
  at excerpt time it defers to the repo's committed `docs/AGENTS.md`. If
  shoroku is invoked in an unprepared repo, it stops and points the user
  at kisou.

## Decision

**Option Y.** kisou is the sole installer of the project structure
including the doc-system. shoroku is a pure behavioral skill with no
bundled assets.

## Consequences

- Single authored source for every doc-system file (kisou's bundle).
- No cross-skill file reads at runtime.
- shoroku becomes thinner: trigger + memory/file source modes + excerpt
  workflow + commit.
- shoroku no longer has a bootstrap/fallback path. In an unprepared repo
  it delegates to `kisou` (docs-only migrate scope) and stops.
- The minor authorship oddity: `docs/AGENTS.md`'s "Session shoroku
  (excerpting)" section describes shoroku's behavior but is authored in
  kisou's bundle. Convention manages this; no automated drift check (see
  issue `2c4d-cross-skill-bundle-coordination`).
- Cost: a user who installs only shoroku (not kisou) cannot scaffold the
  doc-system; they have to install kisou first.
