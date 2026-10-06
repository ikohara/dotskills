---
id: "a8ad"
title: "a fix wave's tasks are bullets in its prompt, so `task-brief` cannot cut them"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-07
updated: 2026-10-07
---

Source: shoroku tanto-feedback S-101

The fix wave's tasks live in the batch prompt as bullets of "What changes in
this batch" (F1, F2), not under `### Task F1:` headings, so the SDD
`scripts/task-brief` cannot cut them. In the tanto-feedback fix wave the two
briefs were written by hand into the SDD workspace, each quoting its findings
verbatim from the whole-branch review. That cost about as much as a cut would
have, but it is a step the Jisso override table already names for a prompt
whose tasks sit under `### Task N:` headings, and this prompt did not offer
them; every wave pays it.

Direction: the fix wave's rendering in `templates/batch-prompt.md` puts each
wave task under a `### Task F<n>:` heading with the finding's old and new
text beneath it, so `task-brief` and the implementer's single source of
requirements work as they do for a plan task. A template change, so it needs
a decision.

Kin issue-96f2 (no instrument aimed at the fix wave).
