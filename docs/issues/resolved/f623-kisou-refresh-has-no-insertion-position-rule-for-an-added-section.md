---
id: "f623"
title: kisou's refresh has no insertion-position rule for a section it adds
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-11
---

Found in the requirement-extraction spec review (2026-09-09).

`skills/kisou/SKILL.md` Step 3 (migrate), the kisou-managed refresh, says of
"a **missing** fixed section / block → add it, template-filled" and nothing
about where the section lands in the file. The template fixes an order — in
the requirements template the new `## requirements vs issues` section sits
between `## Body` and `## Growth` — and a heading check (`grep '^#'`) passes
wherever the section is appended, so an added section at the end of the file
passes the check a reader would naturally run and fails only a whole-file
comparison against the expanded template.

The requirement-extraction plan uses the expanded-template diff, not the
heading grep, to decide its refresh run for this reason, and measures where
kisou puts the added section. The fix is one sentence in the refresh rule: an
added fixed section takes the position the template gives it, relative to the
fixed sections around it; an author-added section stays where the author put
it.

The refresh run of 2026-09-09 left this untested. The one file that reached the
refresh branch, `docs/AGENTS.md`, needed no new section — only two replacements
in place — and the file that did need one,
`docs/requirements/AGENTS.md`, never got there (issue-e19f). The section was
placed by hand at the template's own position. A discarded first attempt at
that task simulated kisou rather than running it and appended the section after
`## Growth`; that is a guess about the behavior, not a measurement of it, and
is not evidence either way.

Related: req-1a2b, design-c1d2, decision-281f, issue-ad1a, issue-2bf9.

Resolved by the kisou refresh design spec of 2026-09-11 and the instrument's
`apply`: an added section lands after the nearest preceding template section
present, else before the nearest following one, else at the end of the file;
an author section stays where the author put it. The evidence is the
instrument's suite, test case 5 — six tests on the real requirements
template and on miniature fixtures, covering all three positions — and not
the dogfood, which produced no `add` item because nothing was missing from
any of this repository's seven copies; the report says so plainly and quotes
the six tests: `docs/reports/2026-09-11-kisou-refresh-dogfood.md`.
