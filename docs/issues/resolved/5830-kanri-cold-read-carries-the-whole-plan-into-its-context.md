---
id: "5830"
title: Kanri's cold read carries the whole plan into its context for the rest of the run
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-10
---

At the review-brief landing on 2026-09-09 Kanri read the plan (3090 lines)
and the spec (1022 lines) whole for its cold read — about 65k tokens that
stay in its context for every wake-up of the plan. The same day the
machine's Account & Usage view (the VS Code extension, Day view) attributed
89% of usage to sessions over 150k context, with the note that longer
sessions are more expensive even when cached. The cost of a resident Kanri is
context length first and wake-up count second, and the cold read is the
largest single input Kanri takes.

About eight tenths of a passage plan are the passage blocks and the heredoc
needles that Sekkei's dry run (`plan-dryrun.md` in the topic directory)
verified mechanically before the commit. What Kanri's judgment used at the
cold read was the frame: Global Constraints, File structure, Batches, How a
batch is verified, the two sweeps, each task's head (Files, Interfaces, the
passage list), the Self-Review, and the spec whole. The passage blocks
themselves were confirmed by a spot check of every anchor on the tree
(review-brief ledger R-6), which took one command.

Proposed rule for `roles/kanri.md`, "When the plan lands" step 1: the cold
read reads the spec whole and the plan's frame — everything outside the
fenced blocks of the task steps — and takes the passage blocks on the dry-run
report plus a spot check of the anchors on the tree; a plan that has no
dry-run report is read whole. The rule halves Kanri's context for a passage
plan and changes nothing for a plan whose blocks were never run. The human
asked for this to be filed (2026-09-09).

Related: issue-e5a2 (the transcript as the cost record), issue-40ed (the
handover threshold), decision-de63 (Kanri resident with a handover), req-04f5
(Kanri hands over before it decays).

Resolution (context-cost, 2026-09-09): the cold read reads the plan's **frame**
— everything outside the task steps — printed by a sixteen-line `awk` command
that lives in `roles/kanri.md` and replaces each task's steps with one
`[steps: N lines]` marker, tracking fences so a heading quoted inside a block
does not end the skip. Measured: 631 of 1891 lines, 497 of 1796, 582 of 3090,
and **850 of 6032** on the context-cost plan itself — a third or less each, and
14 percent on the step-heaviest.

The cut is wider than this issue proposed, and the measurement is why. Cutting
only the fenced blocks, as proposed here, prints 1508 of 1891 — 20 percent
saved — because in a passage plan the step prose outweighs the blocks; cutting
the whole step prints 631, or 67 percent.

Two caveats are part of the resolution, not footnotes to it. The steps'
commands and outputs come from Sekkei's dry-run report and a passage block is
read from the plan **by its id, on demand** — the report carries commands,
outputs and expectations, not the blocks, which the whole-branch review
confirmed by sampling. And the report is not free: for this plan it is 5038
lines, **5.9× the frame**, so the saving is a function of two artifacts and
holds only if the report is consulted selectively rather than read whole. A
plan in another shape prints whole, which is the safe failure.

design-4807's Kanri-loop section records the shape; the dogfood report at
`docs/reports/2026-09-10-tanto-context-cost-dogfood.md` records the figures.
