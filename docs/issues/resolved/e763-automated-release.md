---
id: "e763"
title: automated release flow (tag + push)
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-05-21
updated: 2026-05-22
---

Releases (bump version, tag `vX.Y.Z`, push tag) are currently manual.
There is no GitHub Action, no `make release`, no version-bump script.

Defer automation until release frequency justifies it. With a personal
skills repo at low release cadence, manual is fine — and reduces the
surface area for accidental releases.

If automated later, target shape: a script that reads `CHANGELOG.md`
for the latest `## [X.Y.Z]` header, bumps the install line in
`README.md`, creates the tag, and pushes. Trigger left to the user
(no auto-tagging on merge).
