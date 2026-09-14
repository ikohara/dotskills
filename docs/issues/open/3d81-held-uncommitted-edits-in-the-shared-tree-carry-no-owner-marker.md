---
id: "3d81"
title: an uncommitted edit a peer deliberately holds in the shared working tree carries no owner/intent marker, and another session can discard it
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

Per Rule 5, Sekkei or Keikaku may edit a tracked file (e.g. the committed plan,
to answer a Kanri cold-read question) and hold it uncommitted in the shared
working tree until Kanri verifies the next batch boundary. Nothing marks that
edit as deliberately held, so another session sharing the same tree cannot
tell it apart from stray output of its own.

Reported from `ellmx`: while Batch A ran, Jisso's `task.implement` subagent
for Task 2 found the plan file modified, could not attribute the change
(the plan's Global Constraints forbid a task from touching anything under
`docs/`), assumed it was an out-of-scope leftover from its own work, and
discarded it with `git checkout -- <path>` before starting Task 3. No content
was actually lost that time only because Kanri's ledger already carried the
edit's substance independently (as rulings R-6/R-7), and Kanri asked Sekkei to
redo and immediately commit the same edit once the boundary was reached. In a
run where the held edit's content existed only in the working tree, this would
have been a silent, unrecoverable loss.

Two proposed fixes, neither chosen yet:

- A small untracked `.tanto/<topic>/held-edits.md` note naming the path, the
  holding session, and why, checked before any cleanup step discards an
  unrecognized modification.
- A rule that only Kanri may decide to discard a stray change in the shared
  tree, with every other role raising a `human-needed`-style question to
  Kanri instead of unilaterally running `git checkout --` / `git clean` on
  something it did not itself create.

Sites: `SKILL.md`'s Workspace section (one shared tree, no worktree by
default) and Rule 5; `roles/jisso.md`, wherever a `task.implement` subagent
is told to keep the tree clean of files outside its own task.

Reporter: `ellmx-b5 [d337fe]`, repo `C:\Users\0000105523\devel\ellmx`,
2026-09-14 (`.tanto/inbox/2026-09-14-shared-tree-held-edit-discarded.md`).
