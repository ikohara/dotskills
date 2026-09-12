---
id: "59c9"
title: "`.tanto/` is one flat namespace and nothing reserves its fixed names against a topic slug"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-12
updated: 2026-09-12
---

Since the tanto-workspace plan (2026-09-12), everything tanto writes for itself
lives under `<workspace>/.tanto/`, with one directory per topic at
`.tanto/<topic>/`. The fixed entries — `inbox/`, `kaiseki/`, `roster.md`,
`roster-archive.md`, `kanri-handover.md` and the `exit-kanri-*.md` proposals —
are **siblings** of the topic directories, in one flat namespace, and nothing
reserves those words against a topic slug.

A topic called `inbox` or `kaiseki` would collide with a fixed directory; a
topic whose slug produced `roster.md` cannot arise, since topics are
directories, but the directory cases can. Kanri's uniqueness check at Start
step 5 only catches a directory that **already exists**, so it happens to catch
`inbox` and `kaiseki` once those have been created, and catches nothing before
that — the check is incidental rather than intended, and it does not know it is
protecting reserved words.

No collision has occurred; topic slugs so far are descriptive multi-word names.
The fix is small whenever someone wants it: a reserved-word list in the contract
that Kanri's topic-opening step checks by name rather than by directory
existence.

Related: req-04f5, design-4807 (the roster and the conductor ledger),
issue-f2c4.
