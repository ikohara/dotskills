---
id: "0239"
title: a resumed or replaced Jisso that exits at the same batch letter as its predecessor collides on the exit file name
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-09
---

Deferred by the context-cost design (2026-09-09, its Deferred items). Jisso's
exit shoroku files are named by the batch letter at which it leaves —
`exit-jisso-B-proposal.md`, `exit-jisso-B-direction.md` — under the plan
workspace. Two Jissos can leave at the same letter: a replacement whose
successor is itself replaced before the next boundary, or a resumed session
that exits at the boundary its predecessor's exit was planned for. The second
file would overwrite the first.

Not yet seen: the three replacements so far each left at a different letter
or at T2, and the one resumed Jisso (requirement-extraction, 2026-09-09)
carried its predecessor's batch to the end. The context-cost design renamed
Kanri's exit files to carry the bare name (issue-b9a4) and left Jisso's,
Sekkei's, and Kaiseki's patterns unchanged, so this case stays open.

The fix, when it is needed, is the same as Kanri's: the bare name in the
pattern (`exit-jisso-<X>-<name>`), or a sequence when the letter is taken.

Related: req-04f5, issue-b9a4, decision-d831, design-4807.
