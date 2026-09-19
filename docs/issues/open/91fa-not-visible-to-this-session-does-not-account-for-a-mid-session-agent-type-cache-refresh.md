---
id: "91fa"
title: "SKILL.md's \"not visible to this session\" claim doesn't account for the harness refreshing its agent-type cache mid-session"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-20
---

Source: inbox 2026-09-14-agent-definition-visibility-mid-session

Expected, per `SKILL.md`: "A definition written during a session is not
visible to that session, so the first session on a machine that writes them
dispatches without them; from then on a dispatch names its kind as
`subagent_type: tanto-<object>-<act>`." — i.e., once a session's agent-type
list is fixed (at session start), it stays fixed until that session ends.

What happened: after a mid-session `CLAUDE_CONFIG_DIR` switch (see
issue-d92f), a session's first two `shoroku`-kind dispatches had to omit
`subagent_type` ("Agent type 'tanto-shoroku' not found" — expected, since
this session had not itself written the new config dir's `agents/tanto-*.md`
files; an earlier session, under the other config dir, had). But a later
dispatch in the **same session**, with no restart, named
`subagent_type: tanto-shoroku` and succeeded — and a system notification
("New agent types are now available for the Agent tool", listing all twelve
tanto-* kinds) appeared in between, unprompted.

`SKILL.md`'s own Limits section hedges the opposite way in a different
context: "...write for each of the twelve kinds the file
`~/.claude/agents/tanto-<object>-<act>.md`... from `templates/agent.md`,
when the file is absent or its content differs from what the template
renders" ends with a note that a rewrite "may prompt the harness to
rescan" — but the flat "not visible to this session" line elsewhere doesn't
carry that qualifier, and the reporting session had not rewritten anything;
the definitions simply became visible partway through, apparently because
the harness periodically refreshes its agent-type cache independent of any
session-side write.

## Reproduction

Not reliably reproducible on demand — observed once, timing not controlled:

1. Start a session under a config dir whose `agents/` directory already has
   `tanto-shoroku.md` written by an *earlier, different* session.
2. Dispatch on `subagent_type: tanto-shoroku` early — it fails, "not found".
3. Continue the session without restarting. At some later point (in this
   case, tens of minutes and several unrelated tool calls later), dispatch
   the same `subagent_type` again — it succeeds, with a system notification
   about newly available agent types appearing just before.

## Where seen

Reported from the `ellmx` repository — `SKILL.md`, the expected-model config
section ("A definition written during a session is not visible to that
session"); role or mode: Kanri, dispatching the `shoroku` kind for T2 apply
and later for an exit shoroku.

## Proposed fix

Soften "not visible to this session" to acknowledge the harness may refresh
its agent-type cache at an unpredictable point mid-session (not only at
session start), so a Kanri that hits "not found" knows to fall back to
`model`-only for that one call rather than assuming every future dispatch in
the same session will also lack `subagent_type`.

Reporter: `ellmx-fd [05a76d]`, repo `ellmx` (a sibling repository on the same
machine), 2026-09-14
(`.tanto/inbox/2026-09-14-agent-definition-visibility-mid-session.md`).
