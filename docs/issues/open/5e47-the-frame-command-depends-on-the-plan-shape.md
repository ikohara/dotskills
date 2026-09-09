---
id: "5e47"
title: the cold read's frame command depends on the plan shape writing-plans produces
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-09
---

Deferred by the context-cost design (2026-09-09, its Deferred items). Kanri's
cold read of a landed plan reads the plan's frame — everything outside the
task steps — through an `awk` command in `roles/kanri.md` that replaces each
task's steps, from the first `- [ ] **Step` line to the next heading, with a
`[steps: N lines]` marker, tracking fences so a heading quoted inside a block
does not end the skip. It depends on two conventions: tasks under `### Task`
headings and steps as `- [ ] **Step` checkbox lines, which are what
superpowers' writing-plans produces and what this repository's passage plans
keep.

A plan in another shape — no `### Task` headings, steps not written as
checkbox lines, a heading level shifted — prints whole, which is the safe
failure: Kanri reads more, not less. Measured 2026-09-09 on three plans of
this repository: 631 of 1891 lines, 497 of 1796, 582 of 3090, and the marker
count equals the `### Task` count in each.

Take it up if a plan shape other than writing-plans' becomes ordinary here,
or if writing-plans changes its step syntax; the remedy is either a second
pattern in the command or a note in the plan's frame that names the shape it
was written in.

Related: req-04f5, issue-5830, design-4807.
