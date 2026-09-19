---
id: "c391"
title: "passage-check.js's lint has no check for a decorated `created:` line"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-20
---

Source: inbox 2026-09-14-passage-check-created-line-lint-gap

Reported from `C:\Users\0000105523\devel\kuchidome` (tanto, topic
`residency-retention`, keikaku): `passage-check.js`'s `CREATED_RE` is
`^created: (.+)$` — a bare line, no markdown decoration. On that plan's
first draft, every one of the first 20 new files' `created:` declarations
was instead written as a bulleted, backtick-quoted path (matching the
surrounding `Files:` bullet list's own style) instead of a bare `created:`
line followed by the plain path — neither form matches `CREATED_RE`, so
`parsed.created` was silently empty.
Had this reached a real boundary, `diff` would have flagged every line of
every new file as unaccounted-added. `lint` reports nothing wrong in this
state; nothing currently detects "a line that reads like a `created:`
declaration but is decorated in a way that doesn't parse."

This is in `passage-check-hardening`'s own scope — a defect in the
instrument itself — but no single tracking issue for that topic exists yet
at the time of filing, so this stands alone.

Proposed fix: `lint` should flag a line matching `created:\s*` with a
leading `-`, surrounding backticks, or other markdown decoration around it,
as a probable-miss — even though it doesn't match `CREATED_RE` — rather
than silently ignoring it.

Reproduction: run `node passage-check.js lint --plan` against a plan whose
Files table writes its `created:` lines decorated (a leading `-` bullet,
or wrapped in backticks) instead of bare. `lint` prints no warning about
the malformed `created:` lines; the miss only surfaces at `diff` time
against a real boundary, when every new-file line is flagged
unaccounted-added.
