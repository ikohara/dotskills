---
id: "c3d1"
title: two repositories on different skill versions clobber each other's user-scope agent definitions
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

`$CLAUDE_CONFIG_DIR/agents/` is per-OS-user, not per-repository: tanto's "User
scope" pass renders each kind's agent definition from **that repository's own
on-disk copy** of the skill into one machine-wide directory, at every session's
Start sequence, with no version check and no ownership record. Two repositories
running tanto at the same time therefore write the same filenames from
potentially different skill versions, and the last writer wins silently.

Observed during the `shoroku-at-close` run, 2026-09-17, mid kind-split. This
repository's Jisso wrote `tanto-shoroku-recommend.md` and
`tanto-shoroku-apply.md` and removed the retired `tanto-shoroku.md` at its own
Start, and touched that directory exactly once, at Start. A later harness notice
in the same session nonetheless showed `tanto-shoroku` available again as an
agent type, and a still later one showed it gone again. Other tanto sessions
were live throughout the run on a sibling repository (`kuchidome`, visible in
every `ListAgents` call this session made) whose own on-disk skill copy had not
yet landed the kind split, so each of its Start sequences rewrote the bare
`tanto-shoroku.md` this repository had just retired — and this repository's next
Start would clobber the sibling's definitions in the same way, in the other
direction. Neither side can see the other.

The consequence is worse than a stale name: a dispatch can land on a definition
rendered from a **different** repository's skill version, so the seat's model,
tools, or instructions may not be the ones the dispatching repository's skill
text describes.

Neighboring but different, and deliberately not merged into any of them:

- issue-cae3 — the same shared directory, but about a kind's *effort* not being
  able to differ per repository. That is an expressiveness limit of user scope;
  this is a write race between two writers.
- issue-91fa — a mid-session agent-type list refresh after a config-dir switch.
  This observation corroborates that the list does refresh mid-session, from a
  second, independent cause (another repository's write), but the issue itself
  is about the harness cache, not the file contents.
- issue-264d — the project-scope `.claude/agents/` namespace reserving nothing.
  This collision never reaches project scope; it is entirely within user scope.

Companion finding: `issue-b7a2` reports the same underlying hazard — two agent
definition files for one kind coexisting with no branch-provenance record —
found independently from the Kanri seat rather than the Jisso seat. The two are
kept separate per the human's own instruction not to fold them; whoever fixes
either should read both.

Candidate directions, none chosen: stamp each rendered definition with the
repository and skill revision that wrote it and refuse to overwrite a foreign
stamp; or move the rendering to project scope where it cannot collide; or have
the Start sequence reconcile rather than overwrite.

**2026-09-17, a dated occurrence.** `tanto-shoroku` — the retired, unsplit kind
— reappeared in a live Kanri session's own visible agent-type list after a
Hosa's chore commits, on the first day the removal of `tanto-shoroku.md` was
live. That Kanri went on dispatching the correctly split
`tanto-shoroku-recommend` and `tanto-shoroku-apply` kinds regardless and nothing
was lost, but the reappearance is this issue's clobber pattern exactly.
