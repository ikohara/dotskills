---
id: "4807"
title: tanto — multi-session orchestration as built
created: 2026-09-06
updated: 2026-09-06
---

## Purpose and shape

`tanto` (担当, "take charge of") runs one implementation plan through up to four
interactive Claude Code sessions on the same repository, the same working tree,
and the same branch. Kanri (管理) manages, Sekkei (設計) designs, Jisso (実装)
implements, Kaiseki (解析) finds root causes. req-04f5 states what the skill
must do for its user; this entry states how it is built.

The human is the only actor who creates or deletes a session, and Kanri is the
only role that asks. Every request is a numbered list carrying the exact command
the human pastes. Kanri exists once per repository; the other three are optional
and Kaiseki is on demand, so it costs nothing while no bug is open.

All roles share one tree and one branch — **no worktree by default**. Kanri
verifies the tree in place and the human can watch it, and the price is a write
discipline: Kanri edits no tracked file while a batch runs, Sekkei writes only
under its own two directories, Kaiseki edits only to instrument and leaves the
tree clean, and Jisso idles while Kaiseki works. The policy is a Kanri directive
the human approves per run rather than a fixed rule; a worktree for Kaiseki, so
that Jisso can continue, stays open as issue-0673.

`tanto` is **Claude Code only**. It needs session discovery to see the live
sessions and cross-session messaging to address them by name; no other Agent
Skills host provides both. The repo's other skills stay host-agnostic, and the
root README says which is which.

## Skill layout

`SKILL.md` is the shared contract every role reads: invocation and role-word
normalization, the model check, the rename, the handshake, the roster, the
message rules, the artifacts table, the nine rules, the four SDD stop classes,
and the workspace policy. It ends by branching to exactly one `roles/<role>.md`.
A session reads its own role file and never the other three — which is why any
term two or more roles route on has to live in `SKILL.md` itself.

Seven templates are copied and filled, never restated in prose: the roster, the
conductor ledger, the batch prompt, the batch report, the Kaiseki brief, the
Kaiseki report, and the built-in expected-model defaults. The templates
directory is markdownlint-ignored, so skeletons carry bare blanks; the
whitespace and line-ending hooks still apply to them.

Every path the skill names at runtime is relative to the skill directory, the
base directory Claude Code reports when the skill loads. The skill's own text
never names its source location, so it runs unchanged from a user-level link or
from a project's local skills directory in any repository.

## The start sequence

Three steps, in this order, before any role work:

1. **Model check** against the expected-model config. On a mismatch the session
   tells the human what was expected and what is running, asks for a model
   switch and a re-run, and stops. It warns only and never switches a model —
   decision-08bc.
2. **Rename.** The session asks the human to rename it to the role id, because
   a skill cannot rename its own session, then confirms the new name. If the
   rename did not happen it continues under the observed name and says so.
3. **Handshake** — one line carrying the role, the name and ref, the working
   directory, the model id, the branch, and what the session can see of its own
   permission mode.

Kanri skips the handshake and receives them. Standalone Kaiseki sends none.

## The expected-model config

Two maps and two mechanisms, recorded in full as decision-9a3a. `sessions.<role>`
is **advisory**: it feeds the model check and Kanri's check at the handshake,
and nothing ever switches a session's model. `subagents.<kind>` is
**effective**: its value goes into the `model` parameter of every subagent that
role dispatches, and no dispatch omits it — an omitted model inherits the
session's, which on three of the four roles is the strongest family.

The skill ships built-in defaults, one value per fixed key, derived from the
family ladder. A personal file overlays them key by key, so a partial file is
complete and an absent file is the all-defaults case. Each role says once, at
start, which file it read and which keys came from the defaults. It then checks
that the escalation kind sits above the implementer kind on the ladder, because
the fix loop's late rounds are an escalation only if it does.

How the personal file reaches the user's config directory is deliberately out of
scope: the skill only reads it. That is why the config-deployment item carries
no issue, unlike the other deferred items of the design work.

## The roster and the conductor ledger

The roster is kept by Kanri at a fixed path, its own row first, one row per role
with the eight fields the handshake carries. It is a **uniqueness check, not an
address book**: peers address a role by its bare name, and two live sessions
sharing a name make the send fail and ask for a disambiguator, which is the
refusal the design wants.

That distinction exists because of a measurement. A rename changes the name the
listing shows and the name on the message envelope, the session reference does
not change, and the **old name stops delivering** — even when the reference is
supplied. So a rename invalidates every address a peer holds, and the roster
cannot be an address book without going stale the first time a session is
renamed.

The conductor ledger is Kanri's, and Sekkei, Jisso and Kaiseki read it without
ever writing it. It holds the progress line, the plan's locations, the batches
table, the rulings, the shoroku candidates, the session events, the open
questions for the human, and the measurements. No plan basename exists before
the plan is committed, so the ledger starts under a topic directory and moves to
the plan's workspace when the plan lands; only the ledger moves, and the topic
directory stays as the spec-phase record.

## Kanri's loop, with its entry and its side channel

The loop has three parts, and the first two are what a steady-state description
of it leaves out.

**When the plan lands.** Cold-read the committed plan and spec and send Sekkei
one line per open question; move the ledger to the plan's workspace and note the
move in the roster's events; do the T1 write-out; ask the human to create Jisso;
on Jisso's handshake reply with the standing-orders line, then write the first
batch prompt from its template and send it. Then enter the loop below. Without
this entry a cold Kanri and a cold Jisso both wait for each other.

**The loop, per batch.** Wait for the idle notice or the report line, never
poll. Verify the tree *before* reading the report. Read the report and rule on
each item: a known cause is Kanri's ruling, an unknown cause opens the Kaiseki
branch, a scope or spec change goes to the human. Adopt or reject each shoroku
candidate. Report one line to the human. Write and send the next batch prompt.
Check the lifecycle tables.

**The side channel.** If Sekkei is live, tell it when a boundary has been
verified and whenever Kaiseki is created or deleted — Sekkei's commit rule and
its pause both depend on facts only Kanri holds, and Sekkei is forbidden to poll
for them. Sekkei's own file carries the other half: if its work is ready and it
has not heard, it asks in one line and waits.

Sekkei may write under its two directories at any time, which is what lets it
draft the next plan while the current one's batches run, but it **commits** only
at a verified boundary while a batch is in flight; with no batch in flight it
commits when the work is ready. The reason is the shared index and the
pre-commit hooks' stashing, which would disturb an implementer mid-task — a
reason that only applies while an implementer exists.

## The batch contracts

A **batch prompt** carries a guard line naming the workspace it belongs to, the
previous batch's verdict, what changed since the last prompt, the setup needed
on resume, the rulings the next tasks inherit with the concrete model families
restated as compaction insurance, the two standing overrides (no worktree, stop
at the boundary), the task range, and the report contract. It is saved as a file
as well as sent, so the human can paste it if the message did not arrive.

A **batch report** carries the plan and branch header, a tasks table, every
ruling made in order with what it costs if wrong, deviations from the plan,
parked findings and deferred minors, the verification commands and their
results, the mandatory shoroku candidates, a section for Kanri with the rulings
it needs and what to verify in the tree, the questions for the human, and one
line on what comes next. Kanri reads four of those sections first, and the batch
prompt names which four. The questions section is the only one written in the
human's chat language.

## The Kaiseki branch and standalone mode

The branch runs **only when the cause of a failure is unknown**. A known cause
with a decision to make is a Kanri ruling, not a Kaiseki case; that sentence is
the classification rule.

The trigger fires when a second-round re-review still leaves a finding open and
Jisso cannot name its cause, or when an implementer reports itself blocked for a
cause nobody can name, at any round. Jisso then commits the failing state as a
work-in-progress commit, records it in the SDD ledger, reports, and idles: a
clean status is the handoff invariant, so the failing state is committed rather
than left in the tree. The commit is ordinary and is folded by the follow-up fix
and its regression test; nothing is amended.

Kaiseki runs systematic debugging up to the root cause and **stops before its
fix phase**. Its report carries the minimal fix and the regression test as text,
and Jisso applies both, so the fix goes through the ordinary review. Kaiseki
never commits, never fixes, and leaves the tree clean, reverting instrumentation
and resetting a bisect. Its report tags every other defect it noticed as
blocking this task or not, and Kanri routes on that exact string.

Kaiseki is a **session rather than a subagent** because the strong model leads
hard debugging interactively, with the human free to join — debugging often
needs what only they know about the environment — and because a strong-model
subagent is what died on a rate limit in the practice this skill formalizes,
while an on-demand session costs nothing while no bug is open.

Standalone mode is the same role without the batch loop: no roster, no
handshake, no brief, no send. The human supplies the symptom and the
reproduction, and the report goes to the human in that session, under a fixed
directory of its own.

## The final batch

After the last implementation batch is accepted, **Kanri** dispatches the
whole-branch review — not Jisso — so the executor never commissions its own
final review. The reviewer gets a review package over the merge base and a
pointer to the parked findings and deferred minors, and it is asked for a
shoroku-candidates section like every other report.

Its findings become one more batch prompt. Jisso dispatches **one** fix subagent
with the complete findings list, runs **exactly one** scoped re-review of the fix
wave, adjudicates residuals in the SDD ledger, and reports. There is no second
fix wave; residual load-bearing findings reach the human through Kanri's merge
question.

## Shoroku staging and the adoption rule

The write-out into this document system is staged rather than done once at the
end. T0, before the design session is created, turns the input document's
decided items into ADRs on the main branch. T1, after the plan commit and before
the executor is created, files the requirements and issues the spec produced.
T2, after the final batch, records the design, the rulings, and the dogfood
report.

Adoption is a Kanri ruling at every stage. Kanri escalates to the human only two
kinds of item — one that adds to or changes a requirement or an ADR, and one it
cannot classify — and decides everything else itself, with the human seeing the
result in the commit.

T2 is split, because the executor holds the context the write-out needs and
cannot talk to the human: the executor proposes to a file, Kanri answers item by
item in a second file, and the executor applies the accepted subset and commits
once. The reasoning and the alternatives are decision-1f5f.

## Deviations from the composed skills

`tanto` composes superpowers brainstorming, writing-plans, subagent-driven
development, systematic debugging and requesting-code-review, the `kisou`
document system, and `shoroku` **without editing any of them**. Every override
is written into tanto's own role files, and each is restated where it is needed
at runtime:

- work in the shared tree rather than an isolated worktree;
- stop at every batch boundary instead of executing continuously;
- never delete the workspace, because it holds the ledger, the reports and the
  T2 source;
- put rulings in every batch report rather than in one final message, and never
  run the branch-finishing skill — the merge decision is the human's, put by
  Kanri;
- take model tiers from the config's kinds, with one reviewer key for every
  review and no subagent on the top family;
- add the root-cause trigger on top of the unchanged five-round fix loop;
- stop the debugging role before its fix phase;
- answer the write-out's confirmation prompt through a file, as decision-1f5f
  records.

Two blocks of the executor's role file are quoted from the upstream skill
**character for character**, so that an upstream change shows up as drift under
a fixed-string search rather than as silent divergence. They are checked against
the source, not only against themselves.

## Notation and the two design rules

`<plan-basename>` is the single notation for the plan's workspace directory;
`<plan>` was retired from the skill's prose because it was never defined and
read as a path to the plan file.

Two rules were derived from real defects found on this branch, and both are
cheap to check mechanically:

- **An obligation lives in the file of the role that performs it.** Writing one
  role's duty into another role's file is invisible at runtime, because no role
  reads another role's file.
- **A term two or more roles route on lives in the shared contract.** The four
  stop classes were defined in the executor's file while three other files
  routed on them.

## Plan conventions under tanto

A plan for this protocol carries, beyond the usual conventions, a Batches
section of three or four tasks each with the stop conditions at every boundary,
the Global Constraints the batch prompts are built from, and a statement of how
a batch is verified. The report and prompt skeletons are not in the plan: the
plan says they follow the skill's templates and names nothing else.

A plan that carries **complete file contents in fenced blocks** turns each task
into transcription plus verification, and lets a reviewer check plan alignment
by extracting the blocks and diffing rather than by judgment.

A structural count written into a task's steps — a heading count, an occurrence
count — is a **task-time check, not an invariant**. A later review can mandate a
new section, and a fix wave forbidden to edit the plan cannot repair the count,
so such counts go stale by construction. Treat them as lower bounds, or give the
fix wave a sanctioned way to update the plan's own checks.

## Where the delivered skill differs from the design document

The design document for this work is the tanto design of 2026-09-06, kept with
the project's superpowers working artifacts. It is outside the six managed types
and is therefore named here rather than linked. Three differences remain, and
all three are additions the skill makes:

- **Kanri's loop entry.** The design document's per-batch loop also begins at
  "wait for the notice", and its handoff is a row in a table rather than a step
  in Kanri's procedure. The skill has the entry section; the design document
  does not.
- **The Sekkei signals.** The design document binds Sekkei to two facts only
  Kanri holds without telling Kanri to send them. The skill adds the step and
  its counterpart.
- **The standalone clauses.** The design document is silent on who receives a
  standalone root-cause report, so the skill's qualifications add what it left
  out rather than contradicting it.

The commit-rule scoping is **not** a difference: the design document was edited
to match before the whole-branch review ran.
