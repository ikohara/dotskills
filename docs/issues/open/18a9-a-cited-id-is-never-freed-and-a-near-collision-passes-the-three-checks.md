---
id: "18a9"
title: the id rule — an id once cited from a frozen document is never freed, and a near-collision passes the three checks
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-19

Two gaps in `docs/AGENTS.md`'s `<id>` bullet and the type rules'
Identifiers checks, each a decision.

**Retiring a cited id for every managed type.** A living type whose items
are removed on supersession, cited by immutable ADRs through `exp-<id>`, has
an id-reuse hole the per-type pools never had: a deleted requirement file's
id was equally reusable, but files were rarely deleted, and expectations are
meant to be. The `experience-layer` spec review (2026-09-30) proposed the
general rule — an id once cited from a frozen document is retired, never
freed — for the `<id>` bullet of every managed type.

**Near-collisions** (S-58). The three checks stop a collision, not a
near-collision: the migration recommendation carried three id pairs one
character apart (26c5/26d5, 0eda/0ed2, 06b2/06d2), which a human answering by
id, or an apply re-checking ids, can mix up. The pairs 26c5/26d5 and
0eda/0ed2 are now in tracked scene files. Whether a new id one character from
an existing one is re-rolled is undecided.
