---
id: "4807"
title: tanto — multi-session orchestration as built
created: 2026-09-06
updated: 2026-09-07
---

## Purpose and shape

`tanto` (担当, "take charge of") runs implementation plans through up to four
interactive Claude Code sessions on the same repository, the same working tree,
and the same branch. Kanri (管理) manages, Sekkei (設計) designs, Jisso (実装)
implements, Kaiseki (解析) finds root causes. req-04f5 states what the skill
must do for its user; this entry states how it is built.

The human is the only actor who creates or deletes a session, and Kanri is the
only role that asks. Every request is a numbered list carrying the exact command
the human pastes. Kanri exists once per repository and is **resident across
plans** — decision-de63 — so a plan's end is a boundary like any other and the
next topic opens under the same roster. The other three roles are optional and
Kaiseki is on demand, so it costs nothing while no bug is open.

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
normalization, the model check, the handshake, the address rule, the roster, the
message rules, human access, the session-exit protocol, the artifacts table, the
ten rules, the four SDD stop classes, and the workspace policy. It ends by
branching to exactly one `roles/<role>.md`. A session reads its own role file and
never the other three — which is why any term two or more roles route on has to
live in `SKILL.md` itself.

Nine templates are copied and filled, never restated in prose: the roster, the
conductor ledger, the handover, the bug report, the batch prompt, the batch
report, the Kaiseki brief, the Kaiseki report, and the built-in expected-model
defaults. The templates directory is markdownlint-ignored, so skeletons carry
bare blanks; the whitespace and line-ending hooks still apply to them.

The skill's mechanical consistency checks live outside the skill, in
`docs/notes/tanto-consistency-checks.md`. A plan that edits `skills/tanto/`
schedules them by naming that note in its verification section, so a future
plan's consistency pass is one line and adding a check is an edit to the note
rather than to a plan.

Every path the skill names at runtime is relative to the skill directory, the
base directory Claude Code reports when the skill loads. The skill's own text
never names its source location, so it runs unchanged from a user-level link or
from a project's local skills directory in any repository.

## The start sequence

Two steps, in this order, before any role work:

1. **Model check** against the expected-model config. On a mismatch the session
   tells the human what was expected and what is running, asks for a model
   switch and a re-run, and stops. It warns only and never switches a model —
   decision-08bc.
2. **Handshake** — one line carrying the role, the name and ref, the working
   directory, the model id, the branch, and what the session can see of its own
   permission mode.

There is no rename step. A session is addressed by the name it was born with,
and no `tanto` session is renamed after it has started — decision-73c3. Kanri
skips the handshake and receives them; its start line prints its own name and
ref, which is the address every lifecycle request carries. Standalone Kaiseki
sends no handshake.

## Addressing, and why by born name

The address of a session is the **bare name** its handshake carried. A name that
matches exactly one live session delivers; when the send reports the name
ambiguous, the sender runs the listing once and appends the reference. A name
written `<name> [<ref>]` is used as the bare name — the reference is an identity,
shown wherever a session is named so the listing, the roster and the handover
agree on which session is meant, and never pasted into an address.

The reasoning is a measurement. A rename changes the name the listing shows and
the name on the message envelope, the session reference does not change, and the
**old name stops delivering** — even when the reference is supplied. So a rename
invalidates every address a peer holds. The alternative considered was a
mandatory rename to a per-repository role name, and it had one real property the
chosen design gives up: a replacement session could take the same name, so
addresses peers already held would keep delivering. Three things outweighed it —
a replacement arrives through a handover or a handshake, which rewrites the
address anyway; the rename costs one human command per session; and in the VS
Code extension the rename does not even reach the tab title the human reads.
decision-73c3 records the choice; the human declined to amend it with this
property on 2026-09-07, judging the rationale sufficient as written.

Kanri's address reaches a role in one of three ways, in order of precedence: a
`kanri-address:` line from a successor Kanri, the second argument of the
invocation as the human pasted it, and the roster's first data row. Every other
role's address is known only to Kanri, from the handshake, and Kanri is the only
session that sends to Sekkei, Jisso or Kaiseki.

## The expected-model config

Two maps and two mechanisms, recorded in full as decision-9a3a.
`sessions.<role>` is **advisory**: it feeds the model check and Kanri's check at
the handshake, and nothing ever switches a session's model. `subagents.<kind>`
is **effective**: its value goes into the `model` parameter of every subagent
that role dispatches, and no dispatch omits it — an omitted model inherits the
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
with the eight fields the handshake carries. It is the **address book**: the
name-and-ref column is the address the row's session answers to, used as the
bare name, and it stays correct because nothing renames a session.

The roster also carries a **Residency** line, the only cross-plan counter the
skill keeps — batches accepted, plans closed, compactions noticed, since this
Kanri's own start — because the roster is the only file that outlives a plan. A
handover resets it to the successor with zero counts. Between plans there is no
ledger, so the roster also carries a Shoroku candidates table with the ledger's
columns, and Kanri moves the unwritten rows into the new ledger when a topic
opens.

The conductor ledger is Kanri's, and Sekkei, Jisso and Kaiseki read it without
ever writing it. It holds the progress line, the plan's locations and the
hotfixes since the previous plan, the batches table, the rulings, the shoroku
candidates, the session events, the open questions for the human, and the
measurements. No plan basename exists before the plan is committed, so the
ledger starts under a topic directory and moves to the plan's workspace when the
plan lands; only the ledger moves, and the topic directory stays as the
spec-phase record.

The ledger's shoroku-candidate table has a **Written** column, holding `no` or
the subject of the commit that wrote the row out, and a Stage column that accepts
`T0`, `T1`, `T2` and `exit:<role>[-<suffix>]`. Every write-out takes only adopted
rows marked `no`, so nothing is written twice. Both live in
`templates/kanri.md`; the ledger of the 2026-09-07 run predates the column and
carries the same state inside its Adopted cell, so a reader of that workspace
should not expect the seventh column there.

## Kanri's loop, with its entry and its side channel

The loop has three parts, and the first two are what a steady-state description
of it leaves out.

**Start, before anything is asked.** Kanri's start runs its branch before it asks
for a topic, because a successor taking over mid-plan must not create a second
ledger: read the config and the listing, ensure the workspace ignore file
exists, bootstrap the roster if it is absent, and otherwise cold-read the roster
and take exactly one of four cases — a handover to accept, a kept Kanri
continuing, a second Kanri that must stop and ask, or a recovery whose sessions
are gone.

**When the plan lands.** Cold-read the committed plan and spec and send Sekkei
one line per open question; move the ledger to the plan's workspace and note the
move in the roster's events; do the T1 write-out; ask the human to create Jisso;
on Jisso's handshake reply with the standing-orders line, then write the first
batch prompt from its template and send it.

**The loop, per batch**, in this order: wait for the idle notice or the report
line, never poll; verify the tree *before* reading the report; read the report
and rule, adopting or rejecting each shoroku candidate; **triage any bug report
that arrived during the batch**; report one line to the human; **check the
lifecycle tables and the handover trigger**, running the proposal half of a
session exit if one is due; **the commit window**, one committer at a time with
Jisso idle throughout — each exiting session commits first, then Kanri's own
edits, then Sekkei's boundary reply; and only then write and send the next batch
prompt.

The order is the point. Everything that needs Jisso idle or the index free —
the triage's issues, the exits, Kanri's own commits, Sekkei's — happens before
the prompt that wakes Jisso, and the pre-commit hooks stash every unstaged change
while they run, so nobody edits a tracked file outside its own slot.

**The side channel.** If Sekkei is live, tell it when a boundary has been
verified and whenever Kaiseki is created or deleted — Sekkei's commit rule and
its pause both depend on facts only Kanri holds, and Sekkei is forbidden to poll
for them. Sekkei answers that line with `committed <subject>` or
`nothing to commit`, which is the pair Kanri waits for before moving on.

Sekkei may write under its two directories at any time, which is what lets it
draft the next plan while the current one's batches run, but it **commits** only
at a verified boundary while a batch is in flight; with no batch in flight it
commits when the work is ready. The reason is the shared index and the
pre-commit hooks' stashing, which would disturb an implementer mid-task — a
reason that only applies while an implementer exists.

## Handover

Kanri is resident, so its only exit is a handover — decision-de63. Two signals
fire one, checked at every boundary: the human's word, which always overrides,
and a **compaction noticed**, which is the one signal a session can see about
itself. State lives in files, so a compaction loses nothing a successor cannot
read back; it is the harness's own evidence that the session has grown long. The
token figure the harness prints is deliberately not used — its unit is not
documented as the context window. A count threshold is deferred as issue-40ed,
and the Residency counters exist so one can be chosen later.

Timing is a boundary only: a batch accepted and the next prompt not yet sent, or
between plans. The outgoing Kanri writes its own exit shoroku first, then the
handover file from its template, sets the ledger's progress line or a roster
event, prints the residency line with the human's numbered commands, and stops.
The successor reads the handover, rewrites the roster, sends every live peer the
`kanri-address:` line, deletes the handover file so a stale one cannot start a
false handover, and asks the human to delete the old session.

The first handover ran on 2026-09-07, mid-plan rather than after the merge
decision. The trigger was a compaction noticed on the session's second day. It
waited for the session's own background agent to return before writing the file
— a subagent dies with its session and a successor inherits only its report file,
which is issue-f801 — and the successor's Handover case then ran as specified,
with the human deleting the old session afterwards. The numbers are in
`docs/reports/2026-09-07-kanri-lifecycle-dogfood.md`.

## Bug intake

A defect noticed in a skill reaches the repository that ships it through Kanri,
which is the intake. A report is a file written from `templates/bug-report.md`
plus one line naming its absolute path; the human supplies the intake's address,
because no session outside the repository can discover it and automatic
discovery would rest on resolving the skill link's real path, which breaks when
the skill is copied. Kanri copies the report into an inbox directory and reads
only the copy, since the reporter's file may vanish; the inbox is the log and
copies are never deleted.

Triage is a Kanri ruling with exactly five outcomes, answered in one line: an
issue filed under `docs/issues/open/`; a redirect, when the problem belongs
elsewhere; a Kaiseki request, when the cause is unknown and worth a root-cause
pass; a hotfix; or a relay into a spec in progress as the next `I-n`. A defect
that surfaces in a spec dialogue travels the `I-n` channel rather than the
bug-report channel.

The **hotfix lane** — decision-2f36 — is open only while no batch is in flight,
and never on a file the in-flight plan lists in its file structure. In the lane
Kanri edits the skill file directly, lints, commits once by explicit path, and
records a ruling; no issue is filed, because the commit is the durable record, so
its subject names the symptom. Hotfixes are carried forward into the next plan's
ledger so they reach the documents once.

## Human access

By default a role has no human access. A role addresses the human directly only
for what needs the human's eyes or hands — a visual check, an OS dialog, a
credential — and only after Kanri has judged it necessary and granted it for that
scope. The request, the grant and the closing report are three fixed lines in the
shared contract, so every role routes on the same spelling.

This is protocol, not enforcement: every session has its own window and the human
can type into any of them. Two things stay outside the rule and the contract says
so — the harness's own prompts, which cannot go through Kanri, and a human who
speaks in a role's window unprompted, who gets an answer, after which the role
tells Kanri in one line and treats nothing further as granted.

Two standing grants are given without a request, so the two windows the human
already used survive as grants rather than as exceptions: Sekkei's spec and plan
dialogue, given in Kanri's orders line, and an attached Kaiseki's debugging
conversation, written into its brief. A standalone Kaiseki has no Kanri and the
human in the room is its counterpart, so the term does not apply.

## The batch contracts

A **batch prompt** carries a guard line naming the workspace it belongs to, the
previous batch's verdict, what changed since the last prompt, the setup needed
on resume including Kanri's own name and ref, the rulings the next tasks inherit
with the concrete model families restated as compaction insurance, the standing
overrides (no worktree, stop at the boundary, no human access unless granted),
the task range, and the report contract. It is saved as a file as well as sent,
so the human can paste it if the message did not arrive.

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
never fixes and leaves the tree clean, reverting instrumentation and resetting a
bisect. It **commits once, at its own exit, and only the accepted subset of its
exit shoroku under `docs/`** — the earlier rule that Kaiseki never commits and
never writes documents is retired by decision-d831. Its report tags every other
defect it noticed as blocking this task or not, and a non-blocking one becomes a
shoroku candidate Kaiseki writes out itself at its exit.

Kaiseki is a **session rather than a subagent** because the strong model leads
hard debugging interactively, with the human free to join — debugging often
needs what only they know about the environment — and because a strong-model
subagent is what died on a rate limit in the practice this skill formalizes,
while an on-demand session costs nothing while no bug is open.

Standalone mode is the same role without the batch loop: no roster, no
handshake, no brief, no send. The human supplies the symptom and the
reproduction, the report goes to the human in that session under a fixed
directory of its own, and the role ensures that directory's ignore file exists so
the report stays untracked. A standalone Kaiseki is also a bug reporter: when the
human asks for a defect to be reported to another repository, it writes the
report from the template and sends it to the address the human gives.

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

## Shoroku staging, session exits, and the adoption rule

The write-out into this document system is staged rather than done once at the
end. T0, before the design session is created, turns the input document's
decided items into ADRs on the main branch. T1, after the plan commit and before
the executor is created, files the requirements and issues the spec produced.
T2, after the final batch, records the design, the rulings, and the dogfood
report.

Adoption is a Kanri ruling at every stage. Kanri escalates to the human only two
kinds of item — one that adds to or changes a requirement or an ADR, and one it
cannot classify or is unsure about — and decides everything else itself, with the
human seeing the result in the commit.

T2 is split, because the executor holds the context the write-out needs and
cannot talk to the human: the executor proposes to a file, Kanri answers item by
item in a second file, and the executor applies the accepted subset and commits
once. The reasoning and the alternatives are decision-1f5f.

**Every planned session exit carries its own shoroku** — decision-d831 — using
that same split for the roles that cannot reach the human, and Kanri's direct
ruling on itself for its own exit. The proposal and direction files are named
after the role and its occasion, they live where the role's other files live, and
the write-out commit's subject carries a fixed prefix so the whole-branch review
package can exclude exactly those commits. A session that does not answer its
exit lines before its idle notice is treated as a forced exit, and the roster's
events say what was lost.

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
  records;
- **invert the task reviewer's standing instruction for a verification-only
  task**: the upstream prompt tells a reviewer not to re-run the suite to
  confirm the report, but where the recorded output *is* the deliverable, a
  reviewer that trusts the report verifies nothing.

Two blocks of the executor's role file are quoted from the upstream skill
**character for character**, so that an upstream change shows up as drift under
a fixed-string search rather than as silent divergence. They are checked against
the source, not only against themselves. The overrides table and the note's
upstream-sentence check are kept one-to-one, so an override with no pinned
sentence is itself a defect.

The peer role files never carry the inbound `exit: direction at <path>` form,
only "Kanri answers with the path". That is safe because the shared contract owns
the line and every role reads the contract.

## Notation and the two design rules

`<plan-basename>` is the single notation for the plan's workspace directory;
`<plan>` was retired from the skill's prose because it was never defined and
read as a path to the plan file.

Two rules were derived from real defects, and both are cheap to check
mechanically; both held under a second plan:

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

The conventions below were derived from defects found while running the second
plan under this protocol.

- **A plan review reads the meta-prose against the body first.** Both of that
  plan's own defects were claims it made about itself — its self-review's
  heading counts and its batches table — rather than errors in its content.
- **A plan cut by file lands the contract a batch before the roles that act on
  it.** Name the full forward-reference set in the Batches section, so the
  boundary at which the tree is deliberately inconsistent is stated rather than
  discovered.
- **A cross-role line that must stay byte-identical needs one spelling and one
  full-string `grep -cF` per copy** — and a line that **wraps** cannot be pinned
  that way at all, because no raw line carries it, so keep such a line on one
  line or make its check flatten the file first.
- **Pair the spec's "where each change lives" table with its mapping
  paragraph** in a check; the two drift.
- **A constraint stated as an absolute names the command that decides it.**
  Three in that plan did not, including a commit-trailer constraint that
  specified an exact string while every check greps a prefix — and two different
  strings were in use, one per model family.
- **An absence check is worth its line only if it could have matched the thing
  it forbids, and a checklist item only if it can fail.** Ask of every check: if
  the thing this guards actually went wrong, would this output change?
- **Extract the blocks, run the plan's commands, and lint every extracted file
  whose target path is linted.** A plan that mandates byte-for-byte transcription
  into a linted path must have lint-clean blocks, or the two obligations
  contradict and the implementer resolves the contradiction silently.
- **An artifact meant for use after a plan closes must not live in the directory
  the close proposes deleting.**
- **An untracked deliverable has no fix wave**; a plan that ships one says where
  its late corrections land.
- **Line endings: the index is LF throughout, and the working tree is mixed file
  by file.** A command that flattens a file strips CR unconditionally, and a
  line-ending claim is settled by byte counts — `git cat-file -s` against the
  piped count, or `od -c` — never by a grep for a control character.
- **A whole-file replacement preserves pre-existing wording defects by
  construction.** A plan that rewrites a file whole needs an explicit pass for
  them.
- **A fix-wave list is drafted under the same conditions as a plan** and
  deserves the same pre-flight: run each specified command once before
  dispatching it.
- **Spend the review seat on the half the controller cannot prove.** Establish
  byte identity mechanically first, then point the reviewer at the cross-file
  contracts and the human-facing questions; that is where the reviews of that
  plan found what no grep would.

Two sizing rules complete the set. Batches are sized so that one executor
carries a batch without growing long, and the plan says at which boundaries a
planned replacement is expected — the bound is the number of reviews the
executor must read, not the size of the files. And a stop condition worded as a
property of the whole tree is backed by a command that sweeps the whole tree,
not only the files the batch wrote.

## The five triage outcomes, and why five

Four would be the obvious set — file it, send it away, fix it, or investigate.
The fifth, the relay into a spec in progress, exists because a defect that
arrives while a spec is being written has a cheaper home than an issue: the spec
input list, where it is answered by design rather than tracked as a defect. The
outcomes are also the reply vocabulary, one line each, so the reporter learns
which of the five happened without reading the ledger.

## Why the exit shoroku has no template of its own

The proposal and direction files are the T2 split's two files under different
names, and the batch report already prescribes their shape. A tenth template
would restate a skeleton that two role files and the ledger's stage values
already fix, and a skeleton nobody copies drifts from the procedure that does the
work.

## Where the delivered skill differs from the design documents

Two design documents describe this skill, both kept with the project's
superpowers working artifacts. Both are outside the six managed types and are
therefore named here rather than linked.

**The tanto design of 2026-09-06.** Three differences remain, and all three are
additions the skill makes:

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

**The kanri-lifecycle design of 2026-09-07.** Its plan carried the complete
contents of every file it wrote, so the delivered skill matches those blocks
except at sixteen points, each a ruled correction made in the whole-branch
review's fix wave and deliberately not re-synced into the plan:

- `SKILL.md` rule 5 — "the `docs/` document-management tree outside
  `docs/superpowers/`", replacing a sentence that contradicted its own preceding
  clause.
- `SKILL.md` artifacts row — `exit-kanri-<YYYY-MM-DD>-proposal.md`, matching the
  spelling the same file's session-exit paragraph already used.
- `roles/kanri.md` loop step 5 — "a scope or spec change", restoring the word
  three other files carried.
- `roles/kanri.md` declined handover — resume at loop step 8, not step 7, whose
  commit window has already run.
- The note, check 7 — the seventh command gains the bold-marker strip, and the
  expected paragraph is rewritten with a double-backtick nested span, because the
  single-backtick form was rewritten by the linter into text that no longer
  named the string its own command searched for.
- The note, opening — "three moments a plan schedules", replacing a claim that
  three role procedures already scheduled the checks; none does.
- `roles/jisso.md` — an eighth overrides row, for the verification-only task's
  inversion of the reviewer's standing instruction.
- The note, check 4 — the command pinning that upstream sentence, **in its ruled
  form**: a flatten pipeline, not the specified fixed-string grep, which returned
  zero because the source sentence wraps and would have pinned nothing while
  turning the check red.
- `roles/sekkei.md` — a gloss on the stage name T1, which was defined only in
  another role's file.
- `SKILL.md` session exit — a sentence defining the stages, the ruling and
  candidate ids, and the adoption rule. It landed with the adoption rule's
  **second** escalation class still missing; the correction is a pending
  between-plans hotfix.
- `roles/kaiseki.md` — the standalone role ensures the workspace ignore file
  exists, so its report stays untracked.
- `templates/bug-report.md` — the same for an external reporter.
- `SKILL.md` and `roles/kanri.md` — "shake hands", the verb, replacing a
  pre-existing malformation the whole-file rewrite had preserved.
- `SKILL.md` — the `I-n` carve-out names the spec-inputs file rather than
  reading as though a peer were the conduit.
- The note, check 5 heading — the pinned lines are present in every copy, rather
  than a claim of byte identity the command does not verify.
- The note, checks 1, 3, 6 and 7 — the existence check reports its failure on
  standard output, the template check matches fixed strings, the triage block
  states its expectation, and the flattened greps print the matched phrase
  instead of the whole file.
