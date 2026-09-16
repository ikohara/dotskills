---
id: "9ca6"
title: the roster archive's table shape drops the Transcript column on every archive move
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-16
---

`roster-archive.md`'s single "## Sessions" table still uses the pre-2026-09-14
16-column shape (no Topic, Effort, cwd, Mode, or Transcript columns), even
though `roster.md`'s own live table gained those columns at that migration.
Every archive move since then — including the `dotskills-e0` tenure's own,
moving 20 rows — has been lossy: a session's Transcript is dropped the moment
its row is archived.

That tenure hit the gap directly while running the plan-close `--share`
measurement. Sekkei `dotskills-50`'s row, archived at the
`tanto-context-ceiling` close under the old shape, carries no Transcript, so
its own share of usage could not be measured and had to be skipped and named
rather than included.

Fix candidates: extend the archive table's columns to match `roster.md`'s, or
keep the Transcript column specifically even where the other new columns do
not apply.

Related: issue-40ed (the replacement-threshold measurement this data loss
directly weakens — the archive is its dataset), issue-e496 (the other half of
the same Residency dataset). Distinct from issue-e18b, which is about a stale
status enumeration in `SKILL.md`'s Artifacts row rather than the table's
columns.
