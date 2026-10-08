---
id: "2c87"
title: a dialogue fact that must not reach a tracked file has no "never copy" line in the prompts that read the dialogue
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: inbox 2026-10-08-feedback-ec9eae4

Item #2 of that copy.

A fact the human gives in a dialogue that must not reach a tracked file — a
host name, an address — needs a "never copy" line in every later prompt that
reads the dialogue: the reviewer's, the brief writer's, the recommender's and
the apply's. No dispatch carries one today, so each seat that reads
`dialogue.md` may copy the fact into a spec, a plan, or a `docs/` entry.

A leak of a dialogue fact into a tracked file is the class issue-229c (no
pre-commit check for a user-home path) guards one half of. The other half, a
standing "never copy" line in every prompt that reads `dialogue.md`, is a rule
across four dispatches, and where it lives — each template, or one rule the
templates point to — is the decision.

Related: issue-229c, issue-52ef.
