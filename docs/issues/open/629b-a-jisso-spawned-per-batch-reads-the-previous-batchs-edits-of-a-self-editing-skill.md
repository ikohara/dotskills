---
id: "629b"
title: a Jisso spawned per batch reads the previous batch's edits of a self-editing skill — rule 11's boundary needs a pinned copy or a rewritten clause
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku tanto-diet S-25

Rule 11 — the safe boundary for a plan that edits the skill it runs on — rests
today on when a Jisso's window starts. Every Jisso of a plan is queued before
batch A and reads the skill as it stood then, so a plan that rewrites
`skills/tanto/` under itself still has every implementer working from one
consistent text.

A design that spawns a Jisso per batch removes that property: batch C's Jisso
starts after batch B landed, so it reads batch B's edits of the skill it is
running on. The rule's premise — one pinned reading per plan — no longer
holds, and nothing in the current wording says what should.

The follow-on spec chooses between two shapes:

1. **A pinned copy handed at spawn** — `--plugin-dir` or `--add-dir` pointed
   at a snapshot of the skill as it stood at the plan's landing.
2. **A rewritten safe-boundary clause** that states what a per-batch spawn may
   and may not read, in place of the "queued before batch A" premise.

Filed now so the constraint is tracked in `docs/` rather than only in an
untracked Kikaku decision file. Related: issue-11db (rule 11 does not cover a
live session of another topic when the skill changes under it) and issue-28f2
(whether a session adopts its own role file's text once it has landed
mid-tenure) — the same family, both about which text a session is running on.
