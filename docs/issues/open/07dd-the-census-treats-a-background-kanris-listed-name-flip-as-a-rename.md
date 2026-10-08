---
id: "07dd"
title: the census treats a background Kanri's listed-name flip as a rename at every wake-up
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: inbox 2026-10-08-feedback-454d742

Item #46 of that copy.

A background Kanri's listed name flips between the spawner's name and a
harness-generated title across wake-ups, and the census treats each flip as a
rename, costing a roster rewrite and an Events line for a seat whose session
id never changed.

The cost is measured per wake-up, in `boundary.js census`'s `— renamed` rule,
which `roster-ledger` kept. The repair — ignore a listed name not of the
spawner's form, or skip Name reconciliation for a Kanri — is a decision beside
issue-c330 (the renamed mark has no reader) and issue-ce16's sender rule.

Related: issue-c330, issue-007e, issue-ce16.
