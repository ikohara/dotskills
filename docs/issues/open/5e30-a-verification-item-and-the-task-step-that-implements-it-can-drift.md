---
id: "5e30"
title: a plan's Verification item and the task step that carries it out can drift
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-12
updated: 2026-10-01
---

Source: shoroku tanto-workspace

A plan states its checks twice: once in the numbered "How a batch is verified"
section, and once inside the task step that performs the check. Nothing ties the
two copies together, so they drift — and because both still run, the drift is
silent.

Measured in the tanto-workspace run (2026-09-12). Verification item 6 names the
pinned-floor form, `mise x node@22 -- node --test …`, and says to record the
version it resolved beside the result. Task 6's Step 6, the step that actually
runs the suite, carried only "record the Node version the run resolved" — the
pinning was gone. So the task ran the unpinned interpreter (v24.16.0) and
recorded that honestly, and the floor was exercised only by the batch-level
boundary check, which the controller runs separately. The reviewer caught the
divergence; no harm followed, because the suite passes on both versions and the
boundary check was run three times, but the task's own evidence did not say what
the plan asked it to say.

The rule that avoids it: **a task step implementing a numbered Verification item
quotes that item's command, and cites the item by number.** A paraphrase is a
second source that can drift; a quotation cannot, and the citation lets a
reviewer check the two against each other in one look. This is the same argument
`docs/notes/tanto-consistency-checks.md` section 13 makes for scheduling a
note's checks by extracting the note's own fenced block rather than copying it.

Related: exp-06b2, design-4807 (plan conventions under tanto), issue-235b,
`docs/notes/tanto-consistency-checks.md` section 13.
