---
id: "314b"
title: "`.tanto/.markdownlint-cli2.yaml` does not keep the editor quiet under a topic subdirectory, and the Artifacts row claims it does"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-18
updated: 2026-09-18
---

`SKILL.md`'s Artifacts row says the workspace's own `.markdownlint-cli2.yaml`
"keeps the editor quiet on files the commit path never lints". Measured while
drafting under `.tanto/seat-lineage/`: the editor still raised MD038 and MD033
diagnostics on the draft at every edit, so the extension is not reading that
directory's config — or reads the repository root's first.

Harmless for the run that found it: the draft was linted by hand with the root
config on a scratch copy and was clean. But the row's claim is false for this
editor, so either the wording or the config's placement is wrong.

Two directions, either of which closes it:

- correct the Artifacts row to say what the file actually does (it keeps the
  **commit path's** lint off the directory, via the `.gitignore` beside it),
  and drop the editor claim; or
- place the config where the extension reads it for files under a topic
  subdirectory, and keep the claim.

Related: issue-6aa8 (markdownlint ignores lack the superpowers workspace) and
issue-e047 (`skills/tanto/templates/` is unlinted) are the neighbouring
lint-scope gaps; neither covers the editor-side config under `.tanto/`.

A documentation-accuracy gap, not a user-stated need, so no paired requirement.
