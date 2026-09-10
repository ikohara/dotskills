---
id: "f813"
title: a passage plan repeats its blocks by design, and every seat pays to read the repetition
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-10
updated: 2026-09-10
---

Measured across the two plans of 2026-09-09. The context-cost plan is 6032
lines for 405 changed lines in thirteen files; its drafter was the largest
single seat of the run (406,000 tokens on `opus`), and nine implementers and
nine reviewers each read their task's text, so the plan's length is paid
about twenty times. Part of the length is load-bearing: the old passage and
the new passage verbatim, once, are what make Kanri's pre-check (the old
needle returns `1`), the whole-branch reviewer's replay (44 replacements
matched exactly once), and the implementer's handoff invariant ("keep the
mandated text and report a mismatch") possible, and they stay. The rest is
repetition and narration: the requirement-extraction plan repeated task 1's
six template blocks verbatim in task 3 so that "a task may be read out of
order"; every Verify step writes out the flattened-needle command that the
block itself determines; the step prose restates what the block shows, and
that prose is where the count defects lived (six "replace exactly these N
lines" leads off by one, none caught by a 72/72 dry run).

Proposed, for writing-plans as tanto uses it: keep every old and new
passage verbatim exactly once; a later task cites a block by its id instead
of re-quoting it; the Verify steps and the anchor checks are generated from
the blocks by the passage script (issue-7481) rather than written by the
drafter; a count in prose is stated only where a command consumes it. The
plan's Self-Review states the largest task's size (issue-7281). Cons: a task
read out of order needs one lookup into another task; a reader without the
script falls back to the plan whole, which is what the frame read already
assumes for a plan without a dry-run report.

Related: req-04f5, issue-7281, issue-7481, issue-88d3, design-4807 (plan
conventions), superpowers writing-plans.

Resolved by the tanto-sweep plan's task 5 (P5.1), which states the rule
this issue asked for in `roles/sekkei.md`'s Step 3: each block appears once
and a later task cites it by id rather than re-quoting it, and every Verify
step is one invocation of `passage-check.js verify` rather than hand-written
commands, so the needles, anchor values, and line counts cannot drift from
the blocks that determine them; the Self-Review's sizes (issue-7281)
accompany it.
