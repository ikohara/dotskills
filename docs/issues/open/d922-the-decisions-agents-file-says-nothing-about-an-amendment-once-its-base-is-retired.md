---
id: "d922"
title: docs/decisions/AGENTS.md says nothing about what an amendment means once its base is retired
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-19
---

Source: shoroku tanto-cost

Raised by the spec review (candidate 2) and deferred by the tanto-cost design
(`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`, "Deferred items"
7). `docs/decisions/AGENTS.md` says that superseding an amended ADR in full
retires that ADR alone and that its amendments stay accepted unless the new
ADR names them too. It does not say what such an orphaned amendment then
means: it replaces parts of a document that is no longer in force, and a
reader following `amends:` lands on a superseded file with no rule for how to
read the pair.

A gap in the document system rather than in tanto, parallel to the one
issue-a9c3 files about a path that no longer exists. Not exercised by this
design: no ADR here is superseded, only amended, so every base stays
accepted. Decide it when a base is first retired, or when the rules are next
revised.
