---
id: "e13a"
title: "a spec's quoted old texts have no mechanical pre-flight, and a wrapped line quoted as one is the recurring cause"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-10-03
---

Source: shoroku shoroku-at-close

Measured on `shoroku-at-close`'s spec, and recurring from the sweep specs
before it. The first draft quoted about sixty old texts and six did not
resolve — every one of them because a line the file wraps was quoted as a
single line. The spec reviewer's mechanical pre-flight found all six.

Sekkei then wrote a twelve-line Node script — extract every fenced `text`
block, strip its trailing newline, count exact occurrences in the files the
spec names — and re-ran it after every round of edits: 44 old texts resolved
exactly once, and the only `NONE`s were new texts and the two sites the spec
declares as another plan's block. The script lives in that session's scratchpad
and nowhere in the repository, so the next Sekkei starts from zero.

Two candidate fixes, either of which closes it:

- a `lint --spec` mode of `scripts/passage-check.js` doing the same extraction
  and counting, for `passage-check-hardening`;
- until then, a one-line command in `roles/sekkei.md`'s drafting rule, so the
  pre-flight is something the role file tells the drafter to run.

No open issue names a spec-side pre-flight today; `passage-check.js` checks a
plan's passages, after the spec is already written.

A tooling gap, not a user-stated need, so no paired requirement.

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
