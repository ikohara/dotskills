---
id: "0d6c"
title: Sekkei's self-review remit excludes a mechanism change, and a failed form check is repaired by SendMessage — neither is stated
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: inbox 2026-09-15-review-and-sekkei-self-review-guidance

Two sentences are missing, in two files, and they are filed together because
the report raised them together and the repair spans both.

- **`roles/sekkei.md`: a self-review edit that changes a *mechanism* after the
  human approved the design is outside the self-review's remit.** It needs a
  further dialogue question, or at least a line in the spec's status that the
  human's review points at. The remit is placeholders, contradictions and
  ambiguity; a mechanism change is the edit most likely to carry a new defect,
  precisely because nothing reviews it. Measured: a hook-placement command was
  switched in self-review from `--git-dir` plus `/hooks` (the approved form) to
  `--git-path hooks` for worktree correctness, and that switch was the spec
  review's one **Critical** finding — on a machine whose global git
  configuration sets `core.hooksPath`, the switched form resolves outside the
  repository.
- **`SKILL.md`'s "The brief's form": a form-check failure is repaired by
  `SendMessage` to the same subagent, not by a re-dispatch.** A `brief.write`
  subagent that kept the template's English sample headings re-rendered the
  seven headings in 12 seconds, body byte-for-byte unchanged, on a follow-up
  message. The agent still holds the context a fresh dispatch would have to
  rebuild, so the correction costs a message rather than a run.

Medium rather than low because the first one let a Critical spec defect through
a review undetected until the formal pass — a measured consequence, not a
hypothetical. Alongside issue-1f2b (no rule for a post-review scope change).
