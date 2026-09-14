---
id: "7c39"
title: a resumed session's `CLAUDE_CONFIG_DIR` move hides the twelve `tanto-<object>-<act>` agent types from the harness, even with byte-identical definition files on disk
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

A subagent dispatch naming a `tanto-<object>-<act>` `subagent_type` can fail
with "Agent type not found" after a resumed session's `CLAUDE_CONFIG_DIR`
changes mid-conversation (for example an editor-wide restart moving it from
`~/.claude` to a different directory), even when byte-identical
`tanto-*.md` definition files exist on disk at the new path. Reported:
after a `/tanto fukki` resume moved `CLAUDE_CONFIG_DIR` from `~/.claude` to
`C:\Users\0000105523\.claude-priv`, every dispatch naming a `tanto-*`
`subagent_type` failed immediately, and the harness's "Available agent
types" listing showed only the six built-in generic agents — none of the
twelve `tanto-*` kinds — even though the definition files were present,
byte-identical, under both config directories. The harness's own
agent-type snapshot for the resumed session simply did not include them.

`SKILL.md`'s existing fallback ("a kind this session cannot see is
dispatched with `model` alone, and its effort is the session's own")
already covers this functionally, but silently: the dispatched effort
silently comes from the session's own effort rather than the kind's
configured effort, and a caller only notices by diffing `tanto.json`
against what actually ran.

Not diagnosed to a fix — likely a harness-level agent-type cache issue
outside the skill's control. Two candidate mitigations, neither chosen:
re-run the twelve-definitions write-and-check as part of `/tanto fukki`
too (in case re-writing nudges a harness re-scan); and/or have the "kind
this session cannot see" fallback warn the human once per session instead
of running silently.

Note: the Kanri session handling this same repository's bug intake hit the
identical symptom firsthand during this very run (dispatching the
`shoroku` kind for Sekkei's exit shoroku after its own config-directory
move) — corroborating evidence, not a separate incident.

Reporter: `kuchidome-eb [443469]`, repo `C:\Users\0000105523\devel\kuchidome`,
2026-09-14
(`.tanto/inbox/2026-09-14-agent-type-not-visible-after-config-dir-move.md`).
