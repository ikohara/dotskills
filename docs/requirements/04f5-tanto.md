---
id: "04f5"
title: tanto — multi-session orchestration of one implementation plan in Claude Code
created: 2026-09-06
updated: 2026-09-14
---

## Purpose

A Claude Code skill that lets one person run an implementation plan through
several interactive Claude Code sessions with distinct responsibilities:
Kanri (管理) manages, Sekkei (設計) designs the spec, Keikaku (計画)
writes the plan, Jisso (実装) implements, Kaiseki (解析) finds root
causes, Kikaku (企画) is where the human thinks about what comes next,
and Hosa (補佐) takes the small jobs. The split exists so that judgment
stays on the strongest model, long output goes to a cheaper one, a
session that waits holds a cheap context, and scope stays with the human,
without any one session's context having to hold the whole run.
It formalizes a practice that worked by hand (kuchidome M1 and M2, 2026-09-05
and 2026-09-06). How it is built now is design-4807; that entry originates in
the tanto design of 2026-09-06, kept with the project's superpowers working
artifacts.

## Required behavior

- **The calling repository is not assumed to build or run in a git worktree.**
  Whether a second checkout builds and runs depends on the repository, so no
  role that builds or runs is placed where that would be assumed; roles that
  write only documents may draft anywhere, and the checkout belongs to the
  role whose batches are in flight.
- **Roles in separate sessions, at the human's hand.** Each role is its own
  session on the same repository and branch. The human creates and deletes
  sessions; Kanri is the only role that asks, and every request is a numbered
  list of commands the human can paste as they are.
- **Kanri is resident, but its context cost does not grow with its tenure.**
  Kanri's role stays across plans; the session that carries it is reset so
  that the human never pays for a conductor's accumulated context beyond the
  work in hand. Whatever resets it is a planned step — a handover to a
  successor at a boundary with no batch in flight — never a mid-batch loss
  and never a decision left to the human. When the reset happens is a
  recorded decision, not a requirement.
- **The human is interrupted only at defined checkpoints.** The spec dialogue;
  one OK before the plan is committed; batch boundaries, and there only for
  the stop classes of subagent-driven development and a scope or spec change;
  the shoroku recommendation at each stage, answered by exception — `OK` as
  recommended, or the items that go the other way; and the merge decision.
  Beyond those, the human is asked only for what only the human can do:
  create or retire a session when Kanri requests it, confirm the items a
  compaction summary attributes to the human, settle a triage or handover
  question Kanri cannot decide alone, and give, at a plan close, a figure
  only the human's own account view shows, answerable with silence.
  Everything else is a ruling a role records in a file.
- **The human's counterpart is Kanri.** A role addresses the human directly
  only for what needs the human's eyes or hands, such as a visual check in a
  browser or a GUI, an OS dialog, or a credential, and only after Kanri has
  judged it necessary and granted it for that scope; the harness's own
  prompts are outside this rule. The human may still speak to any session,
  and that session answers and tells Kanri in one line. Kikaku, the seat the
  human opens to think in, is the exception: its counterpart is the human by
  definition, and what it decides reaches Kanri.
- **Trouble reports reach the repository's Kanri, and Kanri answers them.**
  What a human notices while using a skill, and what another repository's
  run suspects is a defect in a skill this repository ships, has one intake:
  the resident Kanri. Kanri classifies each report and files it, fixes it
  when the fix is small and no batch is in flight, sends it where it belongs
  when it is not this repository's, or asks for a root-cause pass when the
  cause is unknown. The reporter learns the outcome in one line, and no
  report waits for the next plan to be heard. Two workspaces running this
  skill report defects to each other through the skill itself: a reporter
  that knows the target workspace's path finds the intake's address in that
  workspace, and asks the human only when that address is stale.
- **Model discipline.** The human decides which model, and how much effort,
  each seat and each kind of subagent runs on. A session that runs on
  something else is reported to the human and never switched silently
  (decision-08bc); a subagent never inherits a model or an effort by
  accident, so no long-output work lands on the strongest model
  (decision-9a3a). That decision also has a scope: a repository can pin the
  models its own runs check against without changing the check in the human's
  other repositories, because the alternative is a personal file written and
  deleted around every handshake that needs a different model, in every
  repository the human runs tanto in, where one stale copy silently changes
  the check everywhere.
- **State lives in files, not in sessions.** Everything a role needs to resume
  is in the repository's workspace, so any session can be replaced or recreated
  and the run continues from disk. A message between sessions carries one line
  and a path, nothing that would be lost with the session.
- **tanto's own state lives in its own directory.** Everything a role writes
  for tanto sits in one directory of tanto's own inside the workspace, apart
  from the directories of the skills tanto composes. That directory is kept
  out of version control and out of the editor's linting by files tanto
  writes there itself, so the repository's own configuration is never edited
  for it. The artifacts of the composed skills stay where those skills put
  them and are reached by the path Kanri names, so that a spec or a plan
  written by another skill changes nothing in tanto.
- **A session resumed under a new name rejoins the run as easily as
  possible.**
- **A run is affordable to keep running.** The sessions that wait — the
  conductor, the executor between batches, a planner between reviews —
  hold the cheap families' contexts; the strongest model is used where it
  reads once and answers, and its runs per plan are counted. A seat whose
  remaining act is its own exit does not wait for a line that asks for it.
- **A session's cost is measured, not guessed.** Every role reads its own
  transcript at its boundaries, the roster keeps the readings of the current
  run, and the archive keeps them across runs. The reading includes the turn's
  context in tokens, so a cost figure and a ceiling share one instrument.
- **A seat stays under an operating context ceiling the run chooses.** No
  session is allowed to grow without a bound the run has set for it, so that
  both what the human pays per wake-up and what the model can still attend to
  stay inside known limits rather than being discovered after the fact. The
  bound is measured in the unit the harness bills — tokens of context per
  turn — and the run's response to crossing it is timed to the human, since
  the seat's replacement is the human's act. What the ceiling is, and how it
  is arrived at, is a recorded decision, not a requirement.
- **Root cause before more fixing.** When fix rounds fail for a reason nobody
  can name, the strong model leads an interactive root-cause pass; the fix it
  prescribes goes through the ordinary implementation review.
- **Small batches.** Work is delivered in batches of a few tasks, so that each
  boundary is a checkpoint for rulings and for the sessions' lifecycle.
- **Docs are kept current as part of the flow.** Excerpting into the project's
  `docs/` happens at staged points of the run, not as an afterthought, and the
  human confirms what lands without having to read every item cold. Every
  planned exit of a session, in any role, carries its own shoroku before the
  human closes it, so that nothing a session learned is lost with it. An exit
  forced by a failure is the exception, and the record says what was lost.
- **Composes without modifying.** The skills tanto composes — superpowers, the
  `kisou` document system, `shoroku`, and the like — are used as they are;
  every override tanto needs is written into tanto's own files.
- **The human reviews through a brief of the judgment points.** Before the
  human reads a spec or a plan, a third party that shares no context with the
  author writes a brief, in the chat's language, of only the points that need
  the human's judgment, each with a pointer into the document. The human's answers to those points
  are the confirmation the review asks for, and the human reads the document
  where a point sends them. The human's own words in the spec dialogue are
  kept as a record, so that Kanri and the write-outs read them rather than a
  paraphrase.
- **Escalated wording reaches the human in the chat's language too.** When
  the wording of a requirement or an ADR that Kanri escalates is in a language
  other than the chat's, the escalation carries the original followed by a
  reference translation in the chat's language; the original is what is
  written, the translation is what the human reads it by.
- **Claude Code only, and says so.** The skill depends on session discovery and
  cross-session messaging that no other Agent Skills host provides, and its
  documentation states this next to the host-agnostic skills in this repo.

## Out of scope

- Changes to the superpowers skills.
- How the personal model config, and the agent definitions tanto generates
  beside it, reach the user's config directory.
- A progress view across repositories.
