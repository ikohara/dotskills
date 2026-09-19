---
id: "e2db"
title: "the project pass, measured end to end in the first repository that carries a project effort"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-16
updated: 2026-09-19
---

Source: shoroku tanto-project-config

Deferred item 1 of the `tanto-project-config` design spec
(`2026-09-15-tanto-project-config-design.md`, recorded at T2 as that spec
instructs). Section 2 of the design — the project pass over the agent
definitions — is implemented and unit-tested, but has never run end to end in
a repository that actually carries a project effort. The first run that does
measures these four checks, and this issue closes on that run's report:

1. **The files written** — a project-scope definition appears under
   `<cwd>/.claude/agents/` for each kind whose project effort differs from the
   user-scope one, and for no other kind.
2. **The stale one removed** — after the project `tanto.json` is edited back so
   a kind's effort again matches user scope, the next pass deletes that kind's
   project-scope definition rather than leaving it to win silently.
3. **The `.gitignore` written once** — the ignore under
   `<cwd>/.claude/agents/` is created on the pass that writes its first
   definition, and is not rewritten on later passes.
4. **`<s>` reading `0` in the first session and the differing count in the
   second** — the start line's scope figure, across two consecutive sessions
   of the same repository.

The measurement M2 already ran, in the whole-branch review of the
`tanto-project-config` run (2026-09-16), and its result is stronger than the
spec's own M2 statement — it is the starting point this issue inherits rather
than a check still to make. With both scopes present on Claude Code 2.1.231, a
project-scope `tanto-default.md` carrying the marker **shadows** the
user-scope file of the same name in the agent list a session sees; the
user-scope copy does not appear at all. That shadowing is the fact the removal
sweep of check 2 above rests on: without it, a stale project-scope definition
would merely sit beside the user-scope one, and removing it would be tidiness
rather than correctness.

Related: issue-cae3 (the agent definitions being user-scope, which this design
answers), issue-6a29 (tanto reading `tanto.json` from the personal config
directory only), issue-5f98 (the harness measurements the plan's dogfood
makes).
