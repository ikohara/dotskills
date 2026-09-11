---
id: "260c"
title: tanto's `resume` is the one argument that is not a Japanese word in romaji, and it is missing from the command's argument candidates
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-09-11
---

`skills/tanto/SKILL.md` accepts five arguments: the four roles — `kanri`,
`sekkei`, `jisso`, `kaiseki`, each a Japanese word in romaji with its kana
and kanji forms — and `resume`, plain English. The frontmatter's
`argument-hint` lists only the four roles, so `/tanto` completion never
offers `resume`, the one argument the human types by hand after every editor
restart, in every window.

The human noticed both on 2026-09-11, at the first editor restart of the
kisou-refresh run, and asked for them to be fixed when Keikaku is added
(issue-3c7a): the resume word becomes a Japanese word in romaji with its kana
and kanji forms in the invocation table, like the roles (candidates: `saikai`
再開 / さいかい, or `fukki` 復帰 / ふっき — the split's spec chooses), and the
`argument-hint` carries every accepted argument, the new role and the resume
word included. The English `resume` may stay as an accepted alias or go; the
split's spec decides that too.

Both edits touch `SKILL.md`, so they run under contract rule 11 with the
split. Nothing else depends on them.
