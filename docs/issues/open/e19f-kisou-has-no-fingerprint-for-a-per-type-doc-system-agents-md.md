---
id: "e19f"
title: kisou has no template fingerprint for a per-type doc-system AGENTS.md
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-09
---

Found in the requirement-extraction spec review (2026-09-09).

`skills/kisou/SKILL.md` Step 3 (migrate) decides whether a present file is
kisou-managed by a template fingerprint, and lists four: `CLAUDE.md` (the
`@AGENTS.md` pointer plus its body), `AGENTS.md` (the `@CONTRIBUTING.md or
read …` line), `{docs,Documents}/AGENTS.md` (the type path table plus the
"Document management" heading), and "any layer-B file whose heading set
substantially matches the template". A per-type
`{docs,Documents}/<type>/AGENTS.md` — requirements, design, decisions,
issues — is named by none of them: it is not the docs root, and it is not a
layer-B file. So the kisou-managed classification of the four per-type rule
files, which kisou itself installs and which the doc-system detection counts
when it classifies a doc-system as `full`, is undefined.

The consequence is the branch the skill takes when a file is **not**
kisou-managed: with approval, rename the original to `<file>.bak` and write a
fresh template-filled file. Offered on a per-type rule file, that is the wrong
operation for a file whose every byte came from the template. The
requirement-extraction plan tells its refresh-run implementer to reject any
such offer on the four installed copies and hand-mirror the passages instead,
and to leave no `.bak` in the tree; the run measures whether the offer
appears.

The fix is one more fingerprint line — the per-type file's fixed heading set
(`## File`, `## Frontmatter`, `## Body`, and the type's own sections), or the
opening definition sentence each per-type template carries.

Related: req-1a2b, design-c1d2, decision-281f, issue-ad1a, issue-2bf9,
issue-f50d.
