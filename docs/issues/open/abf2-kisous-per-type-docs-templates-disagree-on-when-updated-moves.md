---
id: "abf2"
title: kisou's per-type docs `AGENTS.md` templates disagree on when `updated:` moves
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: inbox 2026-10-03-kisou-updated-rule-differs-by-type

The per-type `docs/<type>/AGENTS.md` templates kisou scaffolds
(`skills/kisou/templates/docs/*/AGENTS.md`) disagree on when `updated:`
moves: the design template shows the field with no rule, the issues template
bumps it on a status move, the decisions template only on a status flip or a
link change, and the experience template on every edit. An agent editing
documents across types has no stated rule to follow.

Give the templates one shared rule in the same words, or state each type's
rule explicitly; the design template at least must stop being silent. This
repository's own `docs/<type>/AGENTS.md` copies follow the templates and are
refreshed from them.

Carrier: Kept.
