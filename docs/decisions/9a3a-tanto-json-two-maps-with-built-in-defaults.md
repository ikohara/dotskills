---
id: "9a3a"
title: tanto.json is JSON with two maps, sessions advisory and subagents effective, overlaid key by key on built-in defaults
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-06
updated: 2026-09-06
---

## Context

decision-08bc fixed the expected-model check for `tanto` roles (warn only,
checked at `/tanto` and at the handshake) and left to the design the config
file's name and format, how it is deployed, what happens when it is absent,
and by implication what else the file may hold. During the spec work of
2026-09-06 the human asked that the same file also name the model for each
kind of subagent a role dispatches (implementer, reviewer, plan drafter) and
for skill-run work: the practice `tanto` formalizes had those hardcoded as the
author's settings (sonnet implementers, `opus` reviewers and fix-round
escalation, no top-family subagents). A subagent that inherits its session's
model is the failure that practice hit: a top-family subagent died on a 429 in
kuchidome M1.

## Options

- **One map or two.** One flat role-to-family map, as decision-08bc words it,
  or two maps: `sessions`, which the skill can only check, and `subagents`,
  whose values the skill actually passes as the Agent tool's `model`.
- **Subagent keys by role or by task kind.** Kinds recur across roles
  (Sekkei's spec reviewer and Kanri's whole-branch reviewer are both
  reviewers), so keys by kind, with a per-role override left for a real case.
- **JSON or TOML.** The file sits next to `settings.json` and uses the Agent
  tool's family vocabulary (`fable`, `opus`, `sonnet`, `haiku`); nothing else
  in that directory is TOML.
- **A complete personal file, or built-in defaults with a per-key overlay.**
  The skill ships defaults derived from the family ladder
  `fable > opus > sonnet > haiku` (as of 2026-09) and overlays the personal
  file on them key by key, so a partial file is complete and an absent file is
  the all-defaults case.
- **Skill-name keys now, or when a second case appears.** A key named after a
  skill means "run that skill in a subagent on that model"; no skill uses it
  today, so it is allowed as a personal addition and kept out of the defaults.
- **Amend decision-08bc, or a standalone ADR.** Nothing in 08bc is retired:
  `sessions` is its map, and the rest is what it left open. Amending would
  record a partial replacement that did not happen.

## Decision

- Location and format: `$CLAUDE_CONFIG_DIR/tanto.json`, or
  `~/.claude/tanto.json` when the variable is unset. JSON.
- Two maps. `sessions.<role>` is advisory: it feeds the check in
  decision-08bc and never switches a model. `subagents.<kind>` is effective:
  its value goes into the `model` parameter of every subagent the role
  dispatches, and no dispatch omits `model`. The fixed kinds are
  `implementer`, `reviewer`, `drafter`, `escalation`, and `default`; a key
  named after a skill is a personal addition.
- Built-in defaults ship with the skill, one value per fixed key, derived from
  a family ladder the skill states in one line; the personal file overlays them
  key by key. A role says once at start which file it read and which keys came
  from the defaults; an absent file is information, not a warning. The role
  also checks that `escalation` sits above `implementer` on the ladder and says
  so if it does not.
- Deployment of the personal file is outside the skill; the skill only reads
  the file.
- This ADR stands alone; decision-08bc is not amended.

## Consequences

- Every review runs on the one `reviewer` key, so under the defaults the final
  whole-branch review runs one tier below the top family. This is a deliberate
  deviation from subagent-driven development's "most capable available model"
  for that review, accepted because a top-family subagent is what rate-limited
  a real run.
- When a family ships or retires, the ladder line and the defaults file change
  together. Substring matching on family names means a model id that drops the
  family name needs a config update.
- A personal file can be partial. The skill-name rule exists before a second
  case does, a small speculative cost accepted for one consistent overlay.
- How the personal file reaches the config directory is the user's own tooling
  and is not tracked in this repo.
