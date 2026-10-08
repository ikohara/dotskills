---
id: "2a80"
title: Plan-mandated Importants come from passages narrower or looser than their source
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-08
---

Source: shoroku run-owned-seats S-73

Batch D of the run-owned-seats plan drew eight plan-mandated Importants in
twelve document tasks. None was a defect of the implementation; all were of
one kind: a passage's wording was narrower or looser than the spec's sentence
it carries or the script it describes (the renamed trigger, "Not listed",
"until then", the writers). A plan-review pass that diffs each document
passage against the script it quotes would catch them before a Jisso runs.

Related: issue-5cf3, the mechanical reconstruction of a passage task's diff.

Carrier: Kept — a plan-review pass in `roles/keikaku.md`'s review brief;
5cf3's mechanical reconstruction is `passage-plan-generation`'s, held by the
2026-10-03 order decision.

**2026-10-08, `roster-ledger` — a second data set, twelve Importants in two
script batches and five sentences the code contradicts** (shoroku
roster-ledger S-57 and S-65). Plan-mandated Importants recurred: all five of
batch B's (Tasks 8, 9, 11) and seven of batch A's sit in the plan's own
passages — a duplicated table scan, a two-step write with no rollback, a
refusal that names a command that cannot repair it, an attach that skips the
tab rule, a skip that drops when two values are set. The SDD fix loop did not
run in two batches (decision-ca6d sends such findings to the fix wave). The
text side of the same gap, from batch C: every quality reviewer found, in a
passage, a sentence the code contradicts (`archive` "copies", `migrate`
"prints suspect:", rule 11's "record reads the archive's template",
single-writer Writer cells, "sixteen columns"); the plan's cold read checked
structure and the passages' own consistency, not each behavioral sentence
against the code the earlier batches had landed.

Two remedies, both for the plan review's brief: apply the plan review's or
the dry run's rubric to the passages for quality, not only against the spec,
which would catch the code class before batch A; and, for a passage plan that
documents commands it also writes, a plan-review pass that greps each such
behavioral sentence against the script at the batch before. The quality
rubric is new; the second is this issue's original remedy, now with a second
data set.
