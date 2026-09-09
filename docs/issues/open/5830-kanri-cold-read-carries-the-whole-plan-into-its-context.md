---
id: "5830"
title: Kanri's cold read carries the whole plan into its context for the rest of the run
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-09
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
