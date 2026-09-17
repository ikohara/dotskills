---
id: "5b8e"
title: a read-only reviewer seat has no file-writing tool, so a role step that ends "write `<path>`" cannot be completed by the reviewer it dispatches
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-12
updated: 2026-09-17
---

`skills/tanto/roles/kanri.md`, Human access step 5, dispatches the review
brief writer on `subagents.reviewer` as "a read-only subagent" and in the same
sentence has it write `review-brief-spec.md` or `review-brief-plan.md`. The
whole-branch review Kanri dispatches at the final batch is described the same
way — a reviewer whose report is a file. A subagent given only read tools
cannot end a step whose deliverable is a file: either the dispatcher grants
it a write tool for the one output path, or the dispatcher saves the text
the subagent returns. The role text says neither, and a Kanri that follows it
literally dispatches a seat that cannot finish.

Measured on the tanto-workspace plan review of 2026-09-12: the plan reviewer
raised it, and Kanri's brief-writer dispatch of the same day had to say
explicitly "read files; write exactly one file, the output named below". The
same holds for Sekkei's spec and plan reviewers, whose reports are files
under the topic directory.

The fix is one sentence at each seat that dispatches a reviewer whose
deliverable is a file: name the one path the seat may write, or have the
dispatcher save the returned text and say which. Under contract rule 11, with
the next plan that edits the role files.

Related: issue-2e52 (a sections tool — the same seats read reports whole),
the tanto-workspace plan review of 2026-09-12.

**Resolved 2026-09-17.** No role file names `subagents.reviewer` or "a read-only
subagent" any more. `roles/sekkei.md` and `roles/keikaku.md` both dispatch their
reviewers as agents that "read files; write exactly one file, the output named
below", and the brief writer is the `brief.write` kind under the same one-file
rule — the sentence this issue asked for, present at each seat that dispatches a
reviewer.
