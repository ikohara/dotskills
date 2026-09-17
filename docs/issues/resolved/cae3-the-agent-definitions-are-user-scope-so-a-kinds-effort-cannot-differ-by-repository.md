---
id: "cae3"
title: the agent definitions are user-scope, so a kind's effort cannot differ by repository and a project overlay of tanto.json cannot carry an effort
severity: medium
depends_on: []
blocks: ["6a29"]
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-17
---

Deferred by the tanto-cost design
(`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`, "Deferred items"
1). Under decision-03f9 a subagent kind's effort is carried by an agent
definition the roles generate at `~/.claude/agents/tanto-<object>-<act>.md`,
or under `$CLAUDE_CONFIG_DIR/agents/`. Both locations are user-scope: the
definitions are shared by every repository the human runs tanto in, so one
repository cannot give a kind a different effort without changing it for all
of them.

This bounds the project overlay of issue-6a29. Even once
`<repo>/.claude/tanto.json` is read after the personal file, its
`subagents.<kind>` values can carry a project-specific **model** — the model
goes into the dispatch — but not a project-specific **effort**, because the
effort reaches the subagent only through the user-scope definition file.
Whoever designs the overlay has to answer what a project-level `effort:` key
means: ignored with a line in the start report, or honored by some mechanism
that does not yet exist.

**Resolved 2026-09-17.** `skills/tanto/SKILL.md` now defines project-scope agent
definitions at `<cwd>/.claude/agents/tanto-*.md`, written when the project file's
effort differs from the personal one, with the `.gitignore` beside them recorded in
the Artifacts table. That is the mechanism this issue said "does not yet exist", so
a kind's effort can now differ by repository. Its `blocks: ["6a29"]` link is
satisfied — issue-6a29 resolves in the same close.
