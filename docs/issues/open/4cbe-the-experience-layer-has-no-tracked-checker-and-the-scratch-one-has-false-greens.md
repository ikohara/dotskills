---
id: "4cbe"
title: the experience layer has no tracked checker, and the scratch one has false greens and went blind after the fold
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-52

The only verbatim check over the scenes is
`.tanto/experience-layer/scene-check.js`, the `experience-layer` plan's own
untracked block. A later topic that migrates or writes scenes, or reuses the
recommend/apply migration, needs a tracked checker. Four measurements:

- **Its false greens** (S-52, batch B). The Task 4 quality reviewer found by
  reading that a `[stated]` line whose Sources entry has the inferred form
  passes; a wrapped Sources entry is skipped, so an altered quote that wraps
  passes the verbatim check; and Sources order and duplicates are unchecked.
- **Blind after the fold** (S-84). After batch D, `scene-check.js --seven`
  reports 51 problems over the ten scenes, all `quote not verbatim in the
  input or the decision file`: the folded lines' Sources quote the deleted
  `docs/requirements/*.md` files and the migration direction and kessai,
  which the script does not read (it reads only the two 2026-09-15 Kikaku
  files). The check went blind at exactly the batch that added 22 lines. A
  `git show <merge-base>:docs/requirements/<file>` lookup and the direction
  file as a third source would restore it; the scenes' quotes were checked
  by eye in batch D.
- **The plan's check was not the check the task needed** (S-94). Task 6
  Step 4's plain `node .tanto/experience-layer/scene-check.js` reads no
  quotation: the verbatim check lives under `--seven`, which fails after
  batch D. The apply's 49 Sources entries were checked verbatim only by the
  Jisso's own scratch script (`batch-D-checks/extra-checks.js`), which found
  nothing. Whether that script should become the experience checker is open.
- **The lint the spec deferred** (S-29, the spec's Deferred item 4): the
  `[inferred]`-cap and vocabulary checks as lint, in
  `check_md_frontmatter.py` or a kisou instrument, for a tooling topic.
