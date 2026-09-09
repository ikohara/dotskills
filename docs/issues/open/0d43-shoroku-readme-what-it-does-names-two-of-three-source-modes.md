---
id: "0d43"
title: shoroku's README "What it does" names two of the three source modes
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-09
---

Found in the requirement-extraction spec review (2026-09-09), during the README
drift check the spec asks of the plan.

`skills/shoroku/README.md`'s "What it does" section says the skill "excerpts
the current **session** (default) or **memory** (explicit) into those docs".
The skill has three source modes — session, memory, and file — and req-3c4d
lists all three under Required behavior; the README's own Usage section
describes the file mode (`<path> を抄録` / `shoroku from <path>`), so the
omission is in the summary bullet only.

The requirement-extraction plan's README check covers only the passages that
plan changes, so it records this as a shoroku candidate rather than editing
the README. The fix is the word "file" and its parenthetical in that bullet,
matching Usage and req-3c4d.

Related: req-3c4d, design-e3f4, issue-ad1a.
