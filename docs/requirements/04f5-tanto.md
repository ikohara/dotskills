---
id: "04f5"
title: tanto — multi-session orchestration of one implementation plan in Claude Code
created: 2026-09-06
updated: 2026-09-07
---

## Purpose

A Claude Code skill that lets one person run an implementation plan through
several interactive Claude Code sessions with distinct responsibilities:
Kanri (管理) manages, Sekkei (設計) designs, Jisso (実装) implements, and
Kaiseki (解析) finds root causes. The split exists so that judgment stays on
the strongest model, long output goes to a cheaper one, and scope stays with
the human, without any one session's context having to hold the whole run.
It formalizes a practice that worked by hand (kuchidome M1 and M2, 2026-09-05
and 2026-09-06). How it is built now is design-4807; that entry originates in
the tanto design of 2026-09-06, kept with the project's superpowers working
artifacts.

## Required behavior

- **Roles in separate sessions, at the human's hand.** Each role is its own
  session on the same repository and branch. The human creates and deletes
  sessions; Kanri is the only role that asks, and every request is a numbered
  list of commands the human can paste as they are.
- **Kanri is resident and hands over before it decays.** Kanri stays in its
  session across plans for as long as the session lasts; a plan ending does
  not end Kanri. When its context has grown long, ideally by its own
  detection and always at a boundary with no batch in flight, it writes a
  handover for its successor and asks the human to create the new Kanri and
  retire the old one, so that a replacement is a planned step and never a
  mid-batch loss.
- **The human is interrupted only at defined checkpoints.** The spec dialogue;
  one OK before the plan is committed; batch boundaries, and there only for the
  stop classes of subagent-driven development, a scope or spec change, and a
  shoroku item that adds to or changes a requirement or a decision; and the
  merge decision. Beyond those, the human is asked only for what only the
  human can do: create or retire a session when Kanri requests it, and settle
  a triage or handover question Kanri cannot decide alone. Everything else is
  a ruling a role records in a file.
- **Trouble reports reach the repository's Kanri, and Kanri answers them.**
  What a human notices while using a skill, and what another repository's
  run suspects is a defect in a skill this repository ships, has one intake:
  the resident Kanri. Kanri classifies each report and files it, fixes it
  when the fix is small and no batch is in flight, sends it where it belongs
  when it is not this repository's, or asks for a root-cause pass when the
  cause is unknown. The reporter learns the outcome in one line, and no
  report waits for the next plan to be heard.
- **Model discipline.** Every role runs on an expected model, and a mismatch is
  reported to the human and never switched silently (decision-08bc). Every
  subagent a role dispatches gets an explicit model from a personal config that
  overlays built-in defaults (decision-9a3a), so no long-output work lands on
  the strongest model by accident.
- **State lives in files, not in sessions.** Everything a role needs to resume
  is in the repository's workspace, so any session can be replaced or recreated
  and the run continues from disk. A message between sessions carries one line
  and a path, nothing that would be lost with the session.
- **Root cause before more fixing.** When fix rounds fail for a reason nobody
  can name, the strong model leads an interactive root-cause pass; the fix it
  prescribes goes through the ordinary implementation review.
- **Small batches.** Work is delivered in batches of a few tasks, so that each
  boundary is a checkpoint for rulings and for the sessions' lifecycle.
- **Docs are kept current as part of the flow.** Excerpting into the project's
  `docs/` happens at staged points of the run, not as an afterthought, and the
  human sees only the items that change what the project must do or why.
  Every planned exit of a session, in any role, carries its own shoroku
  before the human closes it: the session lists its candidates, Kanri rules
  on them and escalates what the human owns, and the session that raised
  them writes out the accepted ones. An exit forced by a failure is the
  exception, and the record says what was lost.
- **Composes without modifying.** superpowers, the `kisou` document system, and
  `shoroku` are used as they are; every override tanto needs is written into
  tanto's own files.
- **Claude Code only, and says so.** The skill depends on session discovery and
  cross-session messaging that no other Agent Skills host provides, and its
  documentation states this next to the host-agnostic skills in this repo.

## Out of scope

- Changes to the superpowers skills.
- How the personal model config reaches the user's config directory.
- Custom subagent definitions.
- A progress view across repositories.
