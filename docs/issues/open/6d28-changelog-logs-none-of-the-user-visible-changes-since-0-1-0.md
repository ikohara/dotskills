---
id: "6d28"
title: "`CHANGELOG.md` logs none of the user-visible changes since 0.1.0"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-87

`CHANGELOG.md` has one entry, 0.1.0 of 2026-05-28, and nothing since. The
type rename `requirements → experience`, the issue `Source:` line rule, the
ADR `## Sources` section and the branch-ADR correction exception are all
user-visible changes to what kisou scaffolds and shoroku writes, and none is
logged. The next release's entry is where a downstream kisou project would
learn the hand migration exists. The CHANGELOG is the user's to write
(exp-259d); this issue is the reminder, not the entry.
