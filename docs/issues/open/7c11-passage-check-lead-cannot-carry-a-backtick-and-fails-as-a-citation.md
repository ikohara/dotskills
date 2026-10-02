---
id: "7c11"
title: a passage-check `O` needle or `A` command cannot carry a backtick, and the failure is reported as a missing block, not a malformed lead
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-10-03
---

Source: inbox 2026-09-11-passage-check-lead-grammar

`skills/tanto/scripts/passage-check.js` delimits a lead's content with a
single backtick: `LEAD_START_RE` matches `` **O<n>.<n>** `[^`]*` `` and
`ANCHOR_FULL_RE` matches `` `[^`]*` — before: …, after: … ``. An `O` needle
whose text contains a backtick, or an `A` command containing one, therefore
does not parse as a lead. Nothing says so: the line is skipped, its
`O4.7`-shaped id is then read as a citation in prose, and `lint` reports
`missing-block: O4.7 — cited in prose but has no block` — a message that
names neither the line nor the cause. An `A` line with a backtick in its
command reaches `malformed-lead`, which at least names the id, but not why.

This bites exactly where the grammar is most needed. `roles/sekkei.md`
requires an `O` needle to span the point where the text changes, and in a
Markdown file under edit that point very often sits inside backticked
notation. The kisou-refresh plan (2026-09-11) named two needles by
measurement and could write neither:

```text
**O1.1** ``(`setup` / `run` /`` — gone by P1.1
**A1.2** `CONTRIBUTING.md` — `grep -cF 'runs `node`' CONTRIBUTING.md` — before: 0, after: 1
```

Reported by the plan Sekkei of that run as a bug report (inbox
`2026-09-11-passage-check-lead-grammar.md`, defect 2); defect 1 of the same
report, the `verify` skip rule not matching the quoted `$TANTO` form, was
hotfixed on the spot.

Proposed fix, in the reporter's words: accept a double-backtick delimiter in
a lead the way Markdown itself does — `` ``…`` `` around content that carries
a single backtick — for `O` needles and `A` commands both, with tests for
each. Failing that, at minimum report the cause: a line that starts
`**O<n>.<n>**` or `**A<n>.<n>**` but does not parse is a `malformed-lead`
that names the line, never silently a citation. `roles/sekkei.md`'s block
grammar then says what a needle with a backtick looks like.

This edits the tanto skill's own instrument, so it belongs to a plan that
runs under contract rule 11 — the Keikaku split (issue-3c7a) or the small
tanto items after it.

Assigned to passage-check-hardening (tanto-issue-triage, 2026-10-03).
