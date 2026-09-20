---
id: "43a8"
title: a non-Kanri, non-Jisso handshake carries no topic field, so an ambiguous handshake costs a round-trip
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-20
---

Source: session 2026-09-17

Keikaku `dotskills-f0 [ecb7ac]` handshook with neither open topic obviously
needing a new Keikaku — `shoroku-at-close` was already past plan-committed,
and `seat-lineage`'s spec was not yet accepted. The handshake line itself,
per `skills/tanto/SKILL.md`, states role, name, cwd, model, effort, branch,
mode and transcript, but never a topic, because topic is normally supplied in
Kanri's own orders reply, inferred from context.

When that inference fails — more than one plausible topic, or none — Kanri
must accept the row provisionally and ask the human directly, costing one
full message round-trip that a topic hint would avoid: either on the human's
own invocation, or in the handshake line itself when the human already knows
which topic they mean.

Proposed: let the invocation carry an optional topic argument for a role
whose topic is not inferable. Since decision-0775 the address argument is no
longer an address channel — it survives only as the bootstrap for a workspace
with no roster — so the proposed form is `/tanto <role> [<topic>]`, surfaced
in the handshake line as `topic=<word>` when given.
