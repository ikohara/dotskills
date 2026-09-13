---
id: "5f98"
title: four harness measurements the plan's dogfood makes
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-13
---

Deferred by the tanto-cost design
(`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`, "Deferred items"
2). Four facts about the harness are assumed by the design and not yet
measured here:

1. whether a new session sees an agent definition written moments before it
   starts (expected from the harness's documentation);
2. which transcript field follows a `/effort` change — `perTurnEffort` or
   `effort`; the handshake reads `perTurnEffort` with `effort` as the
   fallback;
3. whether a definition's `effort:` key is honored by a dispatch that names
   the definition (documented, not measured here) — the probe dispatches one
   subagent on a definition with `effort: low` and reads the effort field of
   that subagent's own transcript;
4. whether `/clear` changes a session's name as well as its transcript.

The effort half of decision-03f9 rests on the third, so the plan's dogfood
makes these measurements. This issue closes with the dogfood report, or
records what was found when a measurement goes the other way.
