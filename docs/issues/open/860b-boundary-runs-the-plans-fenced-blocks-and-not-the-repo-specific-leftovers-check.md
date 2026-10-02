---
id: "860b"
title: boundary runs the plan's fenced blocks and not the repo-specific leftovers check loop step 2 names in prose
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-10-03
---

Source: shoroku tanto-cost

Deferred by the tanto-cost design
(`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`, "Deferred items"
3). The `boundary --plan <path>` instrument runs `git status --porcelain`
and then every fenced `bash` or `console` block under the plan's "How a batch
is verified" heading. Loop step 2 also names, in prose, a repo-specific
leftovers check — stray processes, temp directories — and the instrument has
no way to reach it: it runs what the plan carries as a block, and nothing
else.

For now a plan that needs a leftovers check writes it as a fenced block under
that heading, so that the instrument runs it like any other. Whether the
prose in loop step 2 should be narrowed to say exactly that, or the
instrument should gain a place for repo-specific checks that no plan carries,
is the open question.

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
