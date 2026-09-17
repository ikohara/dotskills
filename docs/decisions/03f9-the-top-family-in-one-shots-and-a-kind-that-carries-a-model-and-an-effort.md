---
id: "03f9"
title: the top family is bought in one-shots, the resident seats run on the cheaper families, and a subagent kind carries a model and an effort
status: accepted
supersedes: []
superseded_by: null
amends: ["9a3a"]
amended_by: ["0352"]
created: 2026-09-13
updated: 2026-09-17
---

## Context

decision-9a3a fixed `tanto.json`: two maps, JSON, a per-key overlay on
built-in defaults that ship with the skill, the personal file outside it, and
five fixed subagent kinds — `implementer`, `reviewer`, `drafter`,
`escalation`, `default` — each carrying a model. Its consequence was that no
subagent runs on the top family, because a top-family subagent was what a 429
killed in kuchidome M1.

The cost work of 2026-09-12 measured a run instead of guessing: the
2026-09-11 run cost 2.3 times the 2026-09-02 run for 1.1 times the messages,
and the growth is in input cache misses — five times as many, against twice
as many hits — with a miss on the top family costing about eighty times a hit
under the one-hour cache TTL. The misses come from resident sessions that
wait and rewrite their whole context when they wake, and the most expensive
such context was Kanri's: the top family, used mostly clerically. So what
costs is a session that holds the top family, not a subagent that reads once
and answers — the opposite of what 9a3a assumed. The harness had also gained
a per-seat effort setting, which 9a3a could not name because it did not exist
when 9a3a was written.

## Options

- **Five kinds, or twelve.** The five old words no longer separate seats that
  differ in family and in effort — a spec review, a plan review, a cold read
  and a whole-branch review are all `reviewer`. Kinds named
  `<object>.<act>` name the act instead, and the ladder check becomes
  `task.escalate` above `task.implement`.
- **Where an effort lives.** The Agent tool's dispatch carries a `model`
  parameter and no effort, so an effort can only ride in an agent definition
  the roles generate. The definition then carries the effort and no `model`,
  because the dispatch's `model` takes precedence by the tool's own contract.
  The alternative — a subagent inheriting its session's effort — is the
  accident the requirement forbids.
- **The top family banned from subagents (9a3a's consequence), or reserved
  for them.** A one-shot that reads once and dies is exactly what the top
  family is worth paying for; a resident session is what it must not be spent
  on.
- **Haiku for the cheap seats.** Ruled out for anything that reads a plan
  whole: a 200K window and no effort control.
- **Amend decision-08bc too.** Not needed: the effort check extends 08bc's
  model check on the same terms — checked at `/tanto <role>` and at the
  handshake, warn only, never switched — so this ADR states that extension
  and leaves 08bc in force.

## Decision

This amends decision-9a3a in three parts.

- **The kinds.** The five fixed kinds are replaced by twelve
  `<object>.<act>` kinds — `task.implement`, `task.escalate`,
  `task.review-spec`, `task.review-quality`, `plan.draft`, `plan.review`,
  `plan.coldread`, `spec.review`, `branch.review`, `brief.write`, `shoroku`,
  `default` — and a value is `{model, effort}` rather than a family alone. A
  bare string stays valid and means the model with the default effort, and
  the overlay is per field. A personal file that still names one of the five
  old kinds is reported in the start line as `unknown key <name>, ignored`.
- **The top-family consequence is inverted.** The top family is what a
  one-shot buys — the cold read, the plan review, the briefs, the
  whole-branch review — and is what a resident session must not hold. The
  resident seats run on the cheaper families.
- **The effort is carried by a generated agent definition.** Every role
  writes `~/.claude/agents/tanto-<object>-<act>.md` for the twelve kinds at
  its start, and each dispatch names `subagent_type` and `model` together.
  The definition carries the effort and no `model`.

The `shoroku` key, which 9a3a allowed only as a personal addition, becomes a
built-in default: it is the skill-name key in exactly the sense 9a3a defined,
and the write-out flow now needs it.

The rest of 9a3a stands: two maps, `sessions` advisory and `subagents`
effective, JSON at `$CLAUDE_CONFIG_DIR/tanto.json`, the per-key overlay, the
defaults shipped with the skill, the ladder line, and deployment of the
personal file left outside the skill. decision-08bc is not amended; the
effort check extends its model check on the same terms.

## Consequences

- The top family runs five to six times per plan in one-shots, plus ten to
  fourteen `shoroku` dispatches on `opus`; the count against the five-hour
  limit is the number the first measured run watches.
- A definition written during a session is not visible to that session, so a
  kind a session cannot see is dispatched with `model` alone and its effort
  inherited from the session's; the human is told once in the start line and
  not warned.
- Whether a definition's `effort:` is honored by a dispatch is documented but
  not yet measured here, so the plan's dogfood dispatches a probe and reads
  the subagent's own transcript — the effort half of this design is a
  measurement, not an assertion.
- The order of the next changes is written down rather than guessed:
  `brief.write` to `opus`, `task.review-quality` to `sonnet`, Kanri to
  `sonnet` medium, Keikaku to `sonnet` medium, Sekkei to `opus` with
  `spec.review` on `fable`, and the `shoroku` apply half to `sonnet`.
- The agent definitions are user-scope, so an effort cannot differ by
  repository; that gap is filed as an issue against the project-overlay work.
- design-4807 records the new current state; this ADR holds the reasoning.
  The reasoning is the tanto-cost design of 2026-09-12.
