---
id: "c706"
title: the passage-check boundary matches a replay-skip pattern as a substring and skips the fence silently
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: inbox 2026-10-08-feedback-454d742

Item #25 of that copy.

The passage-check boundary matches a `replay-skip:` pattern as a substring of
a fence's command, so a fence that merely contains a skipped word is silently
skipped at every boundary. The Keikaku role could say so, or the script could
print the fences it skipped and why.

A check silently skipped at every boundary is a measured defect in
`scripts/passage-check.js`'s skip matcher. issue-1d95 records the skip's
fence-wide scope and issue-2d69 that a pattern names no subject; neither names
the substring match or the silent skip, so this is a third defect of the same
matcher.

Related: issue-1d95, issue-2d69.
