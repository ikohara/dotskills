---
id: "3c47"
title: Sekkei ships on opus at max effort, with spec.review on fable and brief.write on sonnet
status: accepted
supersedes: []
superseded_by: null
amends: ["03f9"]
amended_by: []
created: 2026-10-03
updated: 2026-10-03
---

## Context

decision-03f9 put the top family in the one-shots and the resident seats on
the cheaper families, but the built-in defaults still had Sekkei, a resident
seat, on `fable` at `high`, and the human ran it on `opus` at `max` through a
personal override. The 2026-09-17 trial settled the figure by the human's
impression after `seat-lineage`'s dialogue, and the human then asked whether
the personal value was only a workaround until it became the skill's default.
A Kikaku decision of 2026-09-17 ordered the change, and the hotfix
`docs(tanto): ship Sekkei opus/max and its paired defaults` landed it on
`main`; this record is written at the first close that writes `docs/` after
the hotfix.

## Options

- **Ship three changed defaults** — `sessions.sekkei` to `opus`/`max`,
  `subagents.spec.review` to `fable`/`high`, `subagents.brief.write` to
  `sonnet`/`high` (chosen).
- **Leave it in the personal file for good.** Rejected: a default that every
  repository must override in the same direction is the wrong default, and
  decision-03f9 already says which way.
- **Fold it into `bug-report-hold`'s or `tanto-diet`'s plan.** Rejected: three
  lines and a sentence would wait weeks for a topic with no reason to own
  them; the hotfix lane exists for this size.
- **Change `plan.coldread`'s default too.** Rejected: it is a one-shot, and the
  cost reason is the human's account, not the skill's.
- **Remove the `fable > opus > sonnet > haiku` ladder from `SKILL.md`.**
  Rejected: the check that `task.escalate` sits above `task.implement` still
  reads it.

## Decision

The shipped defaults change in three values. `sessions.sekkei` is `opus` at
`max`: a resident seat, so a cheaper family per decision-03f9, with `max`
because effort buys deliberation per turn and serves a spec's consistency
work. `subagents.spec.review` is `fable` at `high`: the one-shot at the
design's last gate, paired with the cheaper draft as its safety net.
`subagents.brief.write` is `sonnet` at `high`: mechanical work, checked by
form, whose misreads the human's answer or the cold read catches, and the
most frequent `fable` kind before the change.

The sentence that derives the built-in defaults is rewritten in 03f9's own
terms: the one-shots (`plan.review`, `plan.coldread`, `branch.review`,
`spec.review`, `shoroku.recommend`) buy the top family; the resident seats
(Kanri, Sekkei, Keikaku, Jisso, Hosa) run on the cheaper families, with
Sekkei's effort raised to `max`; the ladder still orders the families for the
escalate-above-implement check. Kikaku, human-paced, and Kaiseki are named as
the two resident seats left on the top family, as exceptions.

This amends decision-03f9 in one part: its list of resident seats on the
cheaper families now carries Sekkei's `max` effort and names Kikaku and
Kaiseki as exceptions on the top family. The rest of 03f9 — the top family
bought in one-shots, the kinds, and an effort carried by a generated agent
definition — stands.

## Consequences

- `plan.coldread` stays `fable`/`high`, and `sessions.kikaku` and
  `sessions.kaiseki` stay `fable`/`xhigh`.
- Whether Kaiseki should also move to `opus` under 03f9's own reasoning has no
  measurement; it is an open question filed as issue-54e5.
- design-4807 records the shipped values; this ADR holds the reasoning.

## Sources

- [3c47] 「ところで、sessions.sekkei の opus-max の件だけど、これ、skill のデフォルトにしていいんじゃないか、と思ったの。いま、個人設定に書いているやつって、これからのtopic で デフォルトになるまでのWAだと思っていたんだけど、違うっけ？」 (Kikaku, 2026-09-17)
- [3c47] 「OK」 (Kikaku, 2026-09-17)
