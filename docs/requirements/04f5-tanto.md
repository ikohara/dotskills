---
id: "04f5"
title: tanto — multi-session orchestration of one implementation plan in Claude Code
created: 2026-09-06
updated: 2026-09-22
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
- **Roles in separate sessions; the human opens the seats that talk to them,
  the run starts the rest.** Each role is its own session on the same
  repository and branch. A seat whose work is dialogue with the human is
  opened by the human in the editor; every other seat is started, stopped, and
  resumed by an instrument of the skill's that runs outside any Claude
  session, on a request the run writes to a file, so that no session issues a
  session-creating command and the human opens no window for a machine seat.
- **Kanri is resident, but its context cost does not grow with its tenure.**
  Kanri's role stays across plans; the session that carries it is reset so
  that the human never pays for a conductor's accumulated context beyond the
  work in hand. Whatever resets it is a planned step — a handover to a
  successor at a boundary with no batch in flight — never a mid-batch loss
  and never a decision left to the human. When the reset happens is a
  recorded decision, not a requirement. The boundary's verification, reading,
  and row appends run in a context that ends with the boundary; the resident
  keeps one line and the rulings it makes on it.
- **Kanri's address is read, never announced.** A role reads Kanri's address
  from the roster at the moment of sending; no role caches it and no line
  announces it.
- **The human is interrupted only at defined checkpoints.** The spec dialogue
  and its kessai; the close kessai — the recommendation, the merge decision,
  and the merge's form as one question, answered by exception; a batch
  boundary only for the stop classes of subagent-driven development and a
  scope or spec change; and a seat that blocks on a prompt only the human can
  answer. The plan's brief is written for the human to read and is not waited
  for. Beyond those, the human is asked only to confirm the items a compaction
  summary attributes to them, to settle a question Kanri cannot decide alone,
  and to give, at a plan close, a figure only their account view shows.
  Everything else is a ruling a role records in a file.
- **The run tells the human when it needs them.** A seat that blocks, and a
  kessai that waits, raise a notice on the machine without the human
  configuring anything; a harness hook may be added for immediacy and is
  never required.
- **The human's counterpart is Kanri.** A role addresses the human directly
  only for what needs the human's eyes or hands, such as a visual check in a
  browser or a GUI, an OS dialog, or a credential, and only after Kanri has
  judged it necessary and granted it for that scope; the harness's own
  prompts are outside this rule. The human may still speak to any session,
  and that session answers and tells Kanri in one line. Kikaku, the seat the
  human opens to think in, is the exception: its counterpart is the human by
  definition, and what it decides reaches Kanri.
- **Trouble reports have one intake, and are decided at a close.**
  What a human notices while using a skill, and what another repository's
  run suspects is a defect in a skill this repository ships, has one intake:
  the cheapest seat that is live, which answers receipt in one line and reads
  nothing of the report. No report is lost and none is decided on arrival:
  every report is decided at the next topic's close, by the same
  recommendation the human checks by exception, into an issue, a fix applied,
  a redirect, a root-cause pass, an input to a spec, or a dismissal. Two
  workspaces running this skill report to each other through the skill
  itself: a reporter that knows the target workspace's path finds the
  intake's address in that workspace, and asks the human only when that
  address is stale.
- **Nothing tracked names another repository.** A report from another
  workspace carries nothing that identifies it — no name, path, session, or
  topic, and no quotation of its documents — and a tracked file or commit
  written from a report names it by the receiving inbox's dated slug alone,
  so that what this repository commits says nothing about the repositories
  that use its skills.
- **A one-sentence repair is applied, not filed.** A gap or drift in a
  skill's own prose whose whole repair is a sentence, and which needs no
  decision, is applied to the text at the close — in a commit of its own that
  the human approved by exception — instead of opening an issue that a later
  plan must pick up.
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
- **A repository that uses tanto carries no launcher of it.** The launcher and
  the spawner ship with the skill; a consuming repository's tree holds the
  untracked state directory, the project config it chooses to keep, and the
  ignored project-scope definitions — nothing else, and no script.
- **A run is resumed with one command, and a session's identity survives its
  renaming.** The identity is the session's id, read from the CLI; the human's
  part after a restart is one command and, for the resident, one word in its
  terminal.
- **A seat's last words say whether the seat can be released.** Whenever a
  session ends a turn by going idle, the text it leaves in its own window
  names where its work landed and which step of the contract, if any, still
  runs through it — facts a human or another seat can check against a file.
  A seat never offers its own opinion of whether it is still needed, and
  never names a step it is not needed for.
- **A run is affordable to keep running.** The sessions that wait — the
  conductor, the executor between batches, a planner between reviews —
  hold the cheap families' contexts; the strongest model is used where it
  reads once and answers, and its runs per plan are counted. A seat whose
  remaining act is its own exit does not wait for a line that asks for it.
- **A seat that waits holds the minimum context.** A queued session reads
  nothing until the work that names it arrives, and is sent nothing before
  that, so that a broadcast to the run's windows costs the waiting ones
  nothing.
- **A run's windows are reused, not multiplied, among the seats the human
  opens.** Such a session, once it has finished, is released to be `/clear`ed
  and given its next role by the human, never closed, and the run's lines
  reach only the windows the roster says hold a role, so that a bare window is
  never asked to act.
- **A seat is started when its work exists.** An executor is started for one
  batch when that batch's prompt exists, and stopped at its boundary; the one
  exception is a plan that edits the skill the seats read, whose executors are
  all started at its landing and wait, reading nothing, so that every one of
  them read the same skill.
- **The human reaches any seat from the editor.** A machine seat is reachable
  from the editor's integrated terminal by the CLI's own attach; the editor
  extension's session list is not a premise, because its binary and the CLI's
  drift.
- **A session's cost is measured, not guessed.** Every role reads its own
  transcript at its boundaries, the roster keeps the readings of the current
  run, and the archive keeps them across runs. The reading includes the turn's
  context in tokens, so a cost figure and a ceiling share one instrument. The
  reading says which cache regime the session is in.
- **A seat stays under an operating context ceiling the run chooses.** No
  session is allowed to grow without a bound the run has set for it, so that
  both what the human pays per wake-up and what the model can still attend to
  stay inside known limits rather than being discovered after the fact. The
  bound is measured in the unit the harness bills — tokens of context per
  turn — and the run's response to crossing it is a handover that needs no one
  present, since the successor is started by the run. What the ceiling is, and
  how it is arrived at, is a recorded decision, not a requirement.
- **Root cause before more fixing.** When fix rounds fail for a reason nobody
  can name, the strong model leads an interactive root-cause pass; the fix it
  prescribes goes through the ordinary implementation review.
- **Small batches.** Work is delivered in batches of a few tasks, so that each
  boundary is a checkpoint for rulings and for the sessions' lifecycle.
- **Docs are kept current as part of the flow.** Excerpting into the project's
  `docs/` happens once per topic, at its close, not as an afterthought, and the
  human confirms what lands without having to read every item cold. Every
  planned exit of a session, in any role, carries its own shoroku before the
  human closes it, so that nothing a session learned is lost with it. An exit
  forced by a failure is the exception, and the record says what was lost. The
  write-out leaves the critical path: the product's fixes land before the
  merge, the records after it, and the records are verified at their landing.
- **A seat's replacement never waits on a document review.** What a retiring
  seat has to excerpt accumulates where its successor can add to it, and the
  human checks that material once per plan, not once per seat change. Nothing
  a seat learned is lost by the deferral, and no handover is held for a check.
- **Composes without modifying.** The skills tanto composes — superpowers, the
  `kisou` document system, `shoroku`, and the like — are used as they are;
  every override tanto needs is written into tanto's own files.
- **The human reviews through a brief of the judgment points.** Before the
  human reads a spec or a plan, a third party that shares no context with the
  author writes a brief, in the chat's language, of only the points that need
  the human's judgment, each with a pointer into the document. The human's
  answers to a spec brief's points are the confirmation that review asks for;
  a plan brief is written for the human to read, and its `— If unanswered:`
  clauses are the plan's answers unless the human overrides one in Kanri's
  window or by a decision file. The human reads the document where a point
  sends them. The human's own words in the spec dialogue are kept as a record,
  so that Kanri and the write-outs read them rather than a paraphrase.
- **Escalated wording reaches the human in the chat's language too.** When
  the wording of a requirement or an ADR that Kanri escalates is in a language
  other than the chat's, the escalation carries the original followed by a
  reference translation in the chat's language; the original is what is
  written, the translation is what the human reads it by.
- **Claude Code only, and says so.** The skill depends on session discovery,
  cross-session messaging, and its CLI's background sessions, which no other
  Agent Skills host provides, and its documentation states this next to the
  host-agnostic skills in this repo, naming the background sessions with the
  version that first carried them.

## Out of scope

- Changes to the superpowers skills.
- How the personal model config, and the agent definitions tanto generates
  beside it, reach the user's config directory.
- A progress view across repositories.
