---
id: "621b"
title: "`boundary --plan` before any batch lands prints three expected failure kinds, and its exit code cannot be read"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-04
updated: 2026-10-04
---

Source: shoroku shoki-seat S-40

`passage-check.js boundary --plan` run on the tree before any batch lands
prints three kinds of failure, all expected: the plan itself untracked, the
old values the batches will replace still present, and the whole-skill sweep
hitting the text a passage replaces. A Keikaku reading its exit 1 needs the
per-check list to see that; the `shoki-seat` dry-run report carried that list
by hand. The same holds before the plan is committed: `roles/keikaku.md`
Step 4.2 says the command exits `2` when the plan or its heading is missing,
but an uncommitted plan makes it exit `1` on its porcelain check naming the
plan itself (issue-6d55, part c).

The instrument's shape is the decision: a `boundary --plan --pre-landing`
mode that names the expected failures, or per-check output a report can
quote. Kin issue-45f8.

Carrier topic: `passage-check-hardening`.
