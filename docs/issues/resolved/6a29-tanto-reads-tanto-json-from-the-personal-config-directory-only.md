---
id: "6a29"
title: tanto reads tanto.json from the personal config directory only, so one repository cannot pin a role's model without touching every other repository's runs
severity: medium
depends_on: ["cae3"]
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-09-17
---

`skills/tanto/SKILL.md` names one location for the expected-model config:
`$CLAUDE_CONFIG_DIR/tanto.json`, or `~/.claude/tanto.json` when the variable
is unset, overlaid key by key on the built-in defaults at
`templates/tanto.json`. Nothing reads a repository-level file.

The gap surfaced on 2026-09-11, at the start of the kisou-refresh run. The
human wanted this run's plan written by a second Sekkei on `opus` while the
spec's Sekkei stayed on `fable` (the Keikaku split of issue-3c7a, run by hand
before the skill carries it). Pinning `sessions.sekkei = "opus"` in the
personal file changes the check for every repository the human runs tanto in,
and the human asked whether `.claude/tanto.json` in this repository would do
instead. It would not: the model check at a role's start and Kanri's
handshake check both read the personal path only, and a repository file is
ignored. The workaround chosen for the run: write the personal file just
before `/tanto sekkei` and delete it once Kanri reports the handshake
accepted, because the file is read only at those two points (kisou-refresh
ledger R-5).

What is missing is a project overlay: `<repo>/.claude/tanto.json`, read after
the personal file and overlaid at the same granularity, `sessions.<role>` and
`subagents.<kind>`, so that precedence is project > personal > built-in
defaults, mirroring how the harness itself layers `.claude/settings.json`
over the user's settings. A start line would then name three sources instead
of two. Open questions for the change: whether the project file is tracked
(a repository-wide decision on models, visible to every contributor) or local
only (`.claude/tanto.local.json`, gitignored, the way `settings.local.json`
is), or both; and whether a skill-name key — the "run this skill in a
subagent on that model" mechanism — is meaningful at the project level.

This is a change to `SKILL.md`'s config section and to every role's start
sequence, so it belongs to a plan that edits `skills/tanto/` under contract
rule 11 — a small topic of its own is the carrier, rather than a rider on a
plan opened for something else.

**Resolved 2026-09-17.** `skills/tanto/SKILL.md` names the project file
`<cwd>/.claude/tanto.json`, overlaid on the personal one, and the Artifacts table
records it as "committed or ignored as the repository decides". The overlay, its
precedence, and the tracked-or-local question this issue left open all landed with
`tanto-project-config`, so one repository can now pin a role's model without
touching every other repository's runs.
