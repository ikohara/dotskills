---
id: "4e81"
title: "\"re-read `tanto.json` at every handshake\" is satisfied by a stale read carried forward — the rule doesn't name the file's existence, not only its content, as something that can change"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

Resolution (hotfix bundle, 2026-09-14, R-13): reworded `roles/kanri.md`'s
handshake check (step 1 of "On a handshake") and `SKILL.md`'s "The expected-model
config" sentence on `sessions.<role>` to name the moment: `tanto.json` is read
at the moment of each comparison — its presence as much as its content — and
"it existed when I last checked" is never evidence that it exists now.

Kanri's convention of re-reading `tanto.json` at every handshake gets
satisfied, in practice, by a session that read the file once (for example
at its own start) and treats that as sufficient — but the file's presence
itself, not only its content, can change between that read and a later
handshake, since a personal override can be created, edited, or deleted by
the human at any time.

Reported as the second recurrence, in the `kuchidome` repository, of this
exact failure mode: a Kanri refused a Sekkei handshake as a model mismatch
against a value it had read roughly thirty minutes earlier, when the
personal `tanto.json` had since been deleted and the handshake's model
actually matched the built-in default; the refusal was reversed on a
fresh re-read. The first recurrence (2026-09-10) is the incident that
produced the existing "re-read `tanto.json` at every handshake" lesson;
this second one shows the lesson, read narrowly, was satisfied by
re-reading the file's *content* once per handshake, while Kanri still
carried forward a value read at its own start across roughly thirty
minutes of work without re-reading at the handshake itself.

Proposed fix: strengthen `SKILL.md`'s / `roles/kanri.md`'s wording from
"re-read at every handshake" to something that names the failure mode
explicitly — re-read at the moment of each comparison, never treating "it
existed when I last checked" as evidence that it exists now. The
`kuchidome` repository's `docs/notes/agent-plan-and-dispatch-conventions.md`
already carries a note bullet for "a configuration file that gates a
decision is re-read at the decision point, not carried from the reader's
start"; this incident is that bullet's second, sharper recurrence, and
suggests the general lesson belongs in the skill itself.

Reporter: `kuchidome-eb [443469]`, repo `kuchidome` (a sibling repository on
the same machine), 2026-09-14
(`.tanto/inbox/2026-09-14-tanto-json-existence-not-rechecked-at-handshake.md`).
