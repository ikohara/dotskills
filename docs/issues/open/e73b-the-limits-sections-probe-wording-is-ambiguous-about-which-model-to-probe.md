---
id: "e73b"
title: "the Limits section's \"probe the family once with a trivial `default` subagent\" is ambiguous about which model to probe"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-20
---

Source: inbox 2026-09-14-limits-probe-wording-ambiguous

Expected: unambiguous instructions for what to dispatch when checking
whether a paused family's quota has recovered.

What happened: `SKILL.md`'s Limits section says (and `roles/kanri.md`
repeats near-verbatim) "Kanri may probe the family once with a trivial
`default` subagent and then sends `continue: <dispatch> — same model`." Read
literally, "a trivial `default` subagent" names the `default` **kind** from
`tanto.json` (`subagents.default`), which in one run's config resolves to
`sonnet` — but the paused dispatch that needed probing was on `opus`
(`subagents.shoroku`). Probing `sonnet` says nothing about whether `opus`
has recovered. The reporting session read the sentence as "a trivial probe,
on the paused family" instead (dispatched a bare one-word-reply agent with
`model: opus` directly, not `subagent_type: tanto-default`), which is the
only reading that actually tests the right thing — but the text supports
both readings, and a reader who takes it literally would probe the wrong
model.

## Reproduction

Not a command — read the text:

```console
grep -n "probe the family once" "$TANTO/SKILL.md" "$TANTO/roles/kanri.md"
```

Both occurrences say "a trivial `default` subagent" without saying which
model it should run on.

## Where seen

Reported from the `ellmx` repository — `SKILL.md`, "Limits" section;
`roles/kanri.md`, "Limits" section (near-duplicate wording); role or mode:
Kanri, recovering from a 429 on the `shoroku` kind (opus) during a topic's
T2 apply.

## Proposed fix

Reword to make the probed model explicit, e.g. "Kanri may probe the paused
family once with a trivial one-off dispatch on that same model (not the
`default` kind, which may resolve to a different family) and then sends
`continue: ...`".

Reporter: `ellmx-fd [05a76d]`, repo `ellmx` (a sibling repository on the same
machine), 2026-09-14
(`.tanto/inbox/2026-09-14-limits-probe-wording-ambiguous.md`).
