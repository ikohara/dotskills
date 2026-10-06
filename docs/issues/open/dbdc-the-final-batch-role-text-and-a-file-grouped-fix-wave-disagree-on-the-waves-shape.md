---
id: "dbdc"
title: The final-batch role text and a file-grouped fix wave disagree on the wave's shape
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-105

`roles/jisso.md`'s "The final batch" says one fix subagent, never one fixer
per finding, and exactly one scoped re-review. The run-owned-seats fix wave's
batch prompt had seven file-grouped tasks, each with its own two review
halves. The wave ran the prompt — grouping by file is what "never one fixer
per finding" is for — as a ledgered ruling. The role file does not say that a
prompt may group a wave by file, nor what the "one scoped re-review" is when
every group is reviewed; the next fix wave on a prompt like this one meets the
same conflict.

To decide: whether the role text names the grouped wave as an allowed shape.
The Jisso proposed it as a decision; the rule is not yet decided.

Kin: issue-96f2 (a fix wave has no instrument aimed at it).

Carrier: Kept — "The final batch" of `roles/jisso.md` and `roles/kanri.md`.
