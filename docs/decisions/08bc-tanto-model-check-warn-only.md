---
id: "08bc"
title: tanto checks the expected model per role twice, warns only, and never switches models
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-06
updated: 2026-09-06
---

## Context

`tanto` runs its four roles as separate interactive Claude Code sessions, and
each role has an expected model: judgment goes to the strongest model, long
output to a cheaper one. The practice `tanto` formalizes (kuchidome M1 and
M2, 2026-09-05 and 2026-09-06) ran one Fable session directing one Opus
session. A role on the wrong model either spends the strong model on long
output or hands rulings to a weaker one, and nothing in the output says so
until quality drops.

The skill cannot set a session's model. `/model` is a human command. The
`model:` field in `SKILL.md` frontmatter cannot serve one skill with four
roles, and whether it applies to the turn or to the whole session is
unverified.

## Options

- **Switch from the skill** through the `model:` frontmatter field. One
  field, four roles; scope unverified.
- **No check.** Trust the human to pick the model at session start. A wrong
  model runs a role silently.
- **Warn only, checked twice.** The session compares its own model with an
  expected-model config at `/tanto <role>`; Kanri compares again at the
  handshake. The human switches the model.

## Decision

Warn only, checked twice.

- A per-user config file outside the repo maps each role id to a model
  family name (`fable`, `opus`, `sonnet`). A value matches when it is a
  substring of the session's model id, which the session's system prompt
  states. The author deploys this file from `dotagents`; the skill ships a
  generic default for when no config is present: the strongest available
  model for Kanri, Sekkei, and Kaiseki, one step down for Jisso.
- At `/tanto <role>`, the session compares its own model with the config. On
  a mismatch it tells the human what was expected and what is running, asks
  for `/model <family>` and a re-run of `/tanto`, and does not handshake.
- At the handshake, Kanri compares the `model=` field of the incoming message
  with the same config and refuses the roster row on a mismatch. Kanri
  dispatches nothing to a session without an accepted roster row.
- The skill never switches a model itself.

## Consequences

- A role does not run on the wrong model unnoticed. The cost is one extra
  `/model` and `/tanto` round for the human.
- The check is advisory. Nothing stops a human who ignores the warning
  except Kanri's refusal at the handshake.
- Not decided here, left to the spec: the config file's name and format
  (JSON or TOML), whether `dotagents` deploys it by copy or by per-key merge,
  and whether a session warns when no config is found or silently uses the
  generic default.
- Substring matching ties the config to model family names. A model id that
  drops the family name breaks the check and needs a config update.
