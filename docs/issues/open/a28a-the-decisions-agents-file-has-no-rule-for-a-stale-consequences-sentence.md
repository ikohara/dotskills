---
id: "a28a"
title: "`docs/decisions/AGENTS.md` says nothing about a Consequences sentence a later ADR has falsified"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

Observed while reviewing `shoroku-at-close`'s spec. decision-ce83's
Consequences say "the most clerical of the twelve kinds" and decision-03f9's
name "the `shoroku` apply half to `sonnet`". Both go stale with that topic's
design, and both sit outside any `O` sweep, because a sweep is written over the
skill's own files.

`docs/decisions/AGENTS.md` says the body of an accepted ADR is immutable and
defines the supersede and amend links, but it does not say what a reader — or a
write-out — does with a Consequences sentence a later ADR has falsified:
corrected in place as a factual repair, or left standing and answered only by
the amending ADR's own body. Today a writer has to guess, and the two guesses
produce different trees.

Adjacent but not the same: issue-d922 is about an amendment whose base is
retired, not about a stale Consequences sentence in a base that stays accepted.

A document-system gap, not a user-stated need, so no paired requirement.
