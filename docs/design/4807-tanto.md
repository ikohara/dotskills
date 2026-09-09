---
id: "4807"
title: tanto — multi-session orchestration as built
created: 2026-09-06
updated: 2026-09-09
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
eleven rules, the four SDD stop classes, and the workspace policy. It ends by
branching to exactly one `roles/<role>.md`. A session reads its own role file and
never the other three — which is why any term two or more roles route on has to
live in `SKILL.md` itself.

The same rule places a command: the transcript reading is in `SKILL.md`
because every role runs it, and the frame command is in `roles/kanri.md`
because Kanri alone reads it — one command per reader set, not one section for
both (the context-cost spec dialogue, 2026-09-09).

Ten templates are copied and filled, never restated in prose: the roster, the
conductor ledger, the handover, the bug report, the batch prompt, the batch
report, the Kaiseki brief, the Kaiseki report, the review brief, and the
built-in expected-model defaults. With `SKILL.md`, the README, and the four role
files, the skill is sixteen files. The templates directory is
markdownlint-ignored, so skeletons carry bare blanks; the whitespace and
line-ending hooks still apply to them.

The templates are written in English like the rest of the repository, with two
exceptions, both addressed to the human. The batch report's "Questions for the
human" may take the chat language, since a question the human must answer is
worth putting in the language they are being asked in. The review brief is
rendered wholly into the chat's language, headings included, and its template is
the English source the writer renders — except for the form markers, which stay
as the template writes them so that Kanri's form check can match them: the
bracketed tag words, the `Q:` / `A:` / `Serves:` / `Adds or changes:` / `See:`
labels, the `## <n>.` numbers, and the pointer after `See:`, which is the
document's own heading text.

The skill's mechanical consistency checks live outside the skill, in
`docs/notes/tanto-consistency-checks.md`. A plan that edits `skills/tanto/`
schedules them by naming that note in its verification section, so a future
plan's consistency pass is one line and adding a check is an edit to the note
rather than to a plan.

Every path the skill names at runtime is relative to the skill directory, the
base directory Claude Code reports when the skill loads. The skill's own text
never names its source location, so it runs unchanged from a user-level link or
from a project's local skills directory in any repository.

That link has a consequence for this repository, and rule 11 draws it: when the
skill the sessions load is the working tree's own copy, a plan that edits
`skills/tanto/` changes the skill its own sessions are running, and a session
started mid-plan reads whatever is on disk at that moment. So while such a plan
is in flight the authority for the run's sessions is the plan's Global
Constraints, Kanri's orders line, and the batch prompts, not the role text on
disk; Kanri records that as a ruling when the plan lands. The rule states the
premise conditionally, because `SKILL.md` ships to hosts where the skill is
installed as a copy and the hazard does not arise there. decision-5c8e holds the
reasoning and the alternative that was rejected.

Measured on 2026-09-09, during the review-brief plan: rule 11's creation
clause was crossed once, knowingly, by the human — a Sekkei for the next topic
was created during batch A while a task was editing `SKILL.md` — and no defect
followed; the orders line's authority sentence covered it, and that Sekkei's
topic touched no `tanto` file. The same day showed the cheaper path for a
known next topic: a Sekkei deleted on Kanri's keep-or-delete question and
recreated ten minutes later cost one session's context for nothing, where a
kept Sekkei given the next topic costs none.

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

Two more workspace artifacts belong to the spec phase. **`dialogue.md`**, under
the topic directory, is Sekkei's: each question it put to the human and the
human's answer, verbatim, in order. Kanri, the brief writer, and the T1
write-out read it, which is the point — the human's own words reach them
without Sekkei's paraphrase in between. Its caveat is worth stating, because the
skill calls it the one record of the human's own words while it lives untracked
under `.superpowers/sdd/`: it survives only as long as the workspace, and its
content becomes durable only when T1 writes it out. **`review-brief-spec.md`**
and **`review-brief-plan.md`**, beside the review reports in the same directory,
are the brief writer's, written from `templates/review-brief.md` in the chat's
language; Kanri reads them for form and the human reads them through Sekkei.

## Kanri's loop, with its entry and its side channel

The loop has three parts, and the first two are what a steady-state description
of it leaves out.

**Start, before anything is asked.** Kanri's start runs its branch before it
opens a topic, because a successor taking over mid-plan must not create a second
ledger: read the config and the listing, ensure the workspace ignore file
exists, bootstrap the roster if it is absent, and otherwise cold-read the roster
and take exactly one of four cases — a handover to accept, a kept Kanri
continuing, a second Kanri that must stop and ask, or a recovery whose sessions
are gone.

The recovery's floor is one `/tanto resume` per window, typed by the human
(req-04f5, a resumed session rejoins as easily as possible). A cheaper-looking
path was put and rejected in the context-cost dialogue of 2026-09-09: Kanri
probing every session the listing shows and the roster does not know with a
one-line "handshake if you are a tanto role", so that resumed peers answer on
their own. It wakes every unrelated session on the machine — three of the five
peers listed during that dialogue belonged to other repositories — at the cost
of each one's whole context, and it breaks the roster's rule that Kanri
dispatches nothing to a session without a row.

**Kanri derives the topic word; it never asks for one.** When no plan is in
flight, Kanri takes the topic from whatever the human said the next work is — an
issue id, a sentence, a name — derives a kebab-case slug of one to three words,
checks the three places a stale word would collide (the topic directory, the
spec file name, and the branch), and **states** the slug in its reply rather
than asking for it. A Kanri with nothing said yet waits for the human to say
what the next work is; it does not ask for a word. The human may override the
slug until the orders line has gone to Sekkei, after which it is fixed, because
Sekkei's file names carry it. Nothing about the word needs the human's judgment
beyond its being short and unique, and under req-04f5 the human is interrupted
only at defined checkpoints.

The word reaches five places, which is why it is fixed at the orders line: the
topic directory, the spec and plan file names, the plan basename and so the
workspace, the branch, and the roster's Events prose. issue-f2c4 proposes
collapsing the first three by making the topic the plan basename.

**When the plan lands.** Cold-read the committed plan and spec and send Sekkei
one line per open question; move the ledger to the plan's workspace and note the
move in the roster's events; do the T1 write-out; ask the human to create Jisso;
on Jisso's handshake reply with the standing-orders line, then write the first
batch prompt from its template and send it.

**The loop, per batch**, in this order: wait for the report line, never poll;
verify the tree *before* reading the report; read the report
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

**The report line is the signal, and the subscription is the overdue fallback.**
Kanri sends batch prompts and Kaiseki briefs without an idle subscription and
waits for the one-line report; it subscribes — a pure `notify_when_idle`, no
message — only when a signal is overdue, and treats a notice arriving before the
report as a reason to check the workspace rather than as the signal, because a
peer's turn ends whenever it dispatches a subagent and most notices are
therefore false idles. The measurement behind the rule: across two days one
Kanri took 394 wake-ups against 77 peer messages, with **81 idle notices** —
about half its wake-ups — and every wake-up re-reads the session's whole context
as input. Only the exit lines keep their subscription, because there the idle
notice is the forced-exit signal by design.

Dropping the subscription removed the only event that woke Kanri to notice a
silent peer, and "overdue" has neither a threshold nor a clock: a session holding
no subscription has no timer. **The human in Kanri's window is the detector.** A
report is overdue when the human says the batch has gone quiet, or when Kanri's
window wakes for anything else and the report has not arrived; Kanri's boundary
line to the human names which signal it is waiting for, which is what makes the
human able to play that part. The alternative — keeping a subscription as a
watchdog — is what the measurement rejected.

**The side channel.** If Sekkei is live, tell it when a boundary has been
verified and whenever Kaiseki is created or deleted — Sekkei's commit rule and
its pause both depend on facts only Kanri holds, and Sekkei is forbidden to poll
for them. Sekkei answers that line with `committed <subject>` or
`nothing to commit`, which is the pair Kanri waits for before moving on.

The side channel runs the other way too, through a file rather than a message:
the spec dialogue happens in Sekkei's window under a standing grant, and its
words reach Kanri through `dialogue.md`, not through Sekkei's summary of them.
That is what lets Kanri's T1 reading be mechanical and what gives the brief
writer the human's own answers to select from.

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

**A due handover waits for what the session still owns.** The handover file is
written only after every background agent the session dispatched has returned,
and after every commit line it promised a peer at that boundary has been sent
and its commit verified. A subagent belongs to its session and dies with it, and
so does an idle subscription the session holds: the successor inherits a report
file, never a completion notice. Between the last of those and the handover
file, nothing new is dispatched — no batch prompt, no review, no create request;
the commit window's own slots are not new dispatches, and a create request that
fell due at that boundary is the successor's to make. The wait is unbounded,
because the harness gives no signal to bound it by, and the human's word is the
only override. A handover written on that override lists every agent still
running under the handover file's **In flight** section, so the successor knows
those results are lost rather than pending.

One case does not hold a handover: a boundary that a skill-editing plan has not
yet named safe for a replacement. The handover proceeds when due — req-04f5 and
decision-de63 make it mandatory at a boundary — and the successor takes the
authority ruling from the handover file's "Rulings the next batch inherits"
rather than from the tree.

The rule is the 2026-09-07 handover's own ruling, generalized. That handover ran
mid-plan rather than after the merge decision, on a compaction noticed on the
session's second day; it waited for the session's own background agent to return
before writing the file, and the successor's Handover case then ran as
specified, with the human deleting the old session afterwards. The numbers are
in `docs/reports/2026-09-07-kanri-lifecycle-dogfood.md`.

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

**The review brief** is the one piece of human-facing work Kanri produces rather
than relays, and it sits in this section because it is what the human reads
before the review gate. On `review-ready: <path>` from Sekkei — sent before each
spec and plan review, a batch in flight or not — Kanri dispatches a **read-only**
subagent on `subagents.reviewer` with five inputs: the document's path; what to
read beside it (for a spec, `spec-inputs.md` and `dialogue.md`; for a plan, the
spec); the output path; the template; and the chat's language, which is the
language of the human's own messages to Kanri. The writer writes the brief file
and nothing else, so it takes no commit slot and disturbs no implementer. A
handover that is due is the one exception: Timing's wait forbids every new
subagent, so the successor dispatches the writer from the handover's Next step,
and a writer still running when a handover is written is listed under In flight.

Kanri then checks the brief's **form**, never its content: eight headings — the
title, the how-to-answer section, the five numbered sections, and the unsettled
section — present and in that order, the headings themselves in the chat's
language; every point opening with one of the four tags, and every unsettled line
saying whether an answer is needed; every point in its three parts, the two
before `See:` and the pointer after it, which may itself carry the ` — `
separator as a plan's task headings do; and every pointer the document's own
heading text, verbatim and untranslated. `grep '^#'` on the document for its
headings is the **whole** read Kanri makes — reading its prose would be the
pre-read the design rejects and would contaminate the cold read. A failing form
is dispatched once more; a second failure is sent as it stands with one line to
the human. Kanri never edits the brief, and answers Sekkei `brief: <path>`. A
point that misreads the document is caught by the human's answer or by Kanri's
cold read after the commit. decision-ace0 holds the reasoning and the
alternatives that were rejected.

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

## What the executor's loop assumes

Serves `req-04f5`. Three properties the SDD fix loop rests on, each measured in
the requirement-extraction run of 2026-09-09 rather than assumed.

**An implementer can die mid-task, and the clean tree is the executor's to
restore.** A subagent that hits an API session limit stops wherever it is: no
report, no commit, and a working tree carrying half an edit. The handoff
invariant — a clean status — is then the executor's responsibility, not the
next implementer's, and a task brief that tells an implementer to stop if the
tree is dirty is right to do so. Before reverting, write the partial work to a
diff in the workspace: the revert becomes reversible, the evidence survives,
and a finding about *how* the attempt went wrong can afterwards be stated from
the artifact instead of from memory. That mattered here — the discarded attempt
had stopped running the tool it was measuring and begun simulating it, and the
preserved diff is what let the claim be checked rather than recalled.

**A resumed implementer keeps its context across a host restart.** Rounds one
to three of the fix loop resume the original implementer rather than dispatch a
fresh one, which is worth nothing if the handle dies with the session; measured
here, it does not — the session was restarted and renamed mid-run, and two
further fix rounds ran on the same agent with its context intact.

**A fix loop can run entirely on prose.** Where a task's deliverable is a
record — a measurement, a set of recorded check outputs — its findings land in
that record and touch no tracked byte, so the fix rounds produce no commits and
the scoped re-review has no diff to read. Point that re-review at the
deliverable itself, and tell it that the **empty** diff is one of the things it
confirms.

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

The first rule has a second face, found when a convention this document itself
recorded failed to run: **a convention that no role file carries is not in
force.** The convention that a spec passage rewriting another role's procedure
goes to that role's live session for a check lived only here and inside a spec's
own block; no role file scheduled it, and the first spec written after it landed
did not apply it — a defect the spec review caught. A convention recorded in a
design document is a description of what the files do; if no file does it,
nothing does. The fix shipped as a passage in Sekkei's Step 2, where the
obligation now lives.

## Plan conventions under tanto

A plan for this protocol carries, beyond the usual conventions, a Batches
section of three or four tasks each with the stop conditions at every boundary,
the Global Constraints the batch prompts are built from, and a statement of how
a batch is verified. The report and prompt skeletons are not in the plan: the
plan says they follow the skill's templates and names nothing else.

A plan that carries **complete file contents in fenced blocks** turns each task
into transcription plus verification, and lets a reviewer check plan alignment
by extracting the blocks and diffing rather than by judgment.

The alternative is a plan that carries **passages**: for each edit an anchor
line that occurs once, the old passage verbatim, and the new passage verbatim.
A task then replaces exactly the old passage and changes no other byte, which is
what a 580-line file gains over a whole-file block when the plan touches seven
places in it. The alignment check changes with the shape: there is no extracted
tree, and instead the diff of each touched file against the merge base must be
exactly that file's passages so far. The form is
`git diff "$(git merge-base main HEAD)" -- <file>`, which compares the working
tree with the merge base and is therefore right both before and after a task's
commit; `git diff main...HEAD` compares commits only and misses an uncommitted
edit, and the two-dot form differs again. The stronger check, cheap enough to
schedule by name, is **reconstruct-and-compare**: replay the plan's old/new
pairs onto the merge-base file and diff against the tree, or classify every
`-U0` added and removed line against the union of the blocks — the second form
needs no knowledge of each passage's shape. One trap: an insertion's new block
omits its anchor, so a naive replace drops it.

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
  piped count, or `od -c` — never by a grep for a control character. **State the
  procedure, never a table of endings.** `core.autocrlf=true` is global here and
  `.gitattributes` gives `.md` only `* text=auto`, with per-file `eol=` for
  `*.sh` and `*.bat` alone, so the working tree's split is an artifact of how
  each file happened to be written and a fresh clone checks out every `.md` as
  CRLF. A per-file table is a snapshot of one working tree; the deciding command
  is `git ls-files --eol` on the file before and after the edit, which must show
  the same value and never `w/mixed`.
- **A whole-file replacement preserves pre-existing wording defects by
  construction.** A plan that rewrites a file whole needs an explicit pass for
  them.
- **A fix-wave list is drafted under the same conditions as a plan** and
  deserves the same pre-flight: run each specified command once before
  dispatching it, **and compare its output with what the list expects** —
  running without comparing catches nothing. That is the command level. The
  level above it is that the pre-flight must also read **the replacement joined
  to the unchanged text around it, as prose**: splice each item's stated change
  into its old text and word-diff the result against its new text. A list item
  can pass every command it specifies — old text present, new text absent, line
  numbers holding — and still drop a word when its replacement meets the line
  that follows it.
- **Spend the review seat on the half the controller cannot prove.** Establish
  byte identity mechanically first, then point the reviewer at the cross-file
  contracts and the human-facing questions; that is where the reviews of that
  plan found what no grep would.
- **The plan drafter's transcription is a second spec review.** A byte-exact
  transcription of the spec's blocks, with the plan's own commands run
  against them, catches what a reading review does not: in
  requirement-extraction the spec reviewer's twenty findings missed a grep
  needle wrapped across a line break in one passage, and the drafter found it
  because the plan's grep failed. It cost nothing because the spec was still
  an untracked draft under the parallel-topic rule and Sekkei re-wrapped the
  block before the commit; on a committed spec it would have been a
  whole-branch-review item.
- **A drafter told to leave a heading empty is also told not to describe
  it.** Sekkei's three sections were drafted in a scratch file while the
  drafter ran and merged into its placeholder headings by script — a turn
  saved — and the drafter's Self-Review had described the placeholders it was
  told to leave, so that sentence had to be rewritten after the merge.

Two sizing rules complete the set. Batches are sized so that one executor
carries a batch without growing long, and the plan says at which boundaries a
planned replacement is expected — the bound is the number of reviews the
executor must read, not the size of the files. And a stop condition worded as a
property of the whole tree is backed by a command that sweeps the whole tree,
not only the files the batch wrote.

The conventions below came out of the third plan, the first to carry passages
rather than whole files.

- **A plan that edits this skill's own files names the boundary from which a
  role may be started or replaced**, in its Global Constraints and in its
  Batches section — where one is *permitted*, which is a different question from
  where one is *expected*. The answer may be the final boundary, and then a
  replacement waits for it and the plan says so. Rule 11 is the term; Kanri's
  recording step and Sekkei's plan convention are the obligations.
- **A passage's wrap column belongs to the destination file and is chosen when
  the spec block is authored.** The carrying task cannot re-wrap without
  breaking byte identity, so a block authored at 68-76 columns for a file whose
  prose runs to 79 stays narrow forever, and a wording flaw in the spec's block
  reaches the tree verbatim. In a passage plan the task that carries such a flaw
  is the one place it cannot be fixed; it is a whole-branch-review item.
- **A replacement that widens a line inside a wrapped block at the file's
  ceiling pays for the width with a word.** The narrower the ceiling, the
  likelier. A fix that touches one line and leaves its neighbours alone avoids
  the failure structurally, which is why it is worth preferring even when a
  three-line re-wrap reads better.
- **An absence check must be falsifiable at repository scope.** A `grep -rn`
  over the skill that prints nothing decides the old form is gone everywhere;
  a check on the new form decides only that it arrived somewhere. Both halves
  are needed and both must be able to fail.
- **The trailer check is per commit.** An aggregate `grep -c` over a branch
  counts trailer *lines*, so a commit carrying two and a commit carrying none
  balance out; loop over the commits instead. Two trailer identities coexist in
  practice — `Claude <noreply@anthropic.com>` from a plan's commit templates and
  `Claude Fable 5.1 <noreply@anthropic.com>` from a Fable session's harness —
  and both satisfy `AGENTS.md`, which is why the check greps the prefix.
- **A plan names the shell its fenced blocks run in.** On a Windows host with
  PowerShell primary, a plan built from quoted heredocs is unrunnable until the
  implementer guesses Git Bash.
- **The reviewer's brief says what the review package cannot show.** A reviewer
  of a transcription task verifies by a command rather than by eye; and the
  package is written with `-U10`, so adjacent changed regions appear merged and
  the plan's default-context hunk count is invisible in it, while CR bytes are
  stripped, so line endings are invisible too. On a plan whose constraints turn
  on per-file endings, the dispatch says so and the reviewer runs one byte
  check. The hunk count belongs to the controller's boundary sweep.
- **The brief carries the bytes; a dispatch's prose is orientation.** When a
  dispatch's summary of a passage disagrees with the brief's block, the brief
  wins and the implementer says so. A summary is written from memory of the
  block and drifts from it in exactly the way transcription must not.
- **`--numstat` is the instrument for a line count.** `grep -c '^+[^+]'`
  undercounts an added blank line, which is a bare `+`.
- **When a spec names a boundary as safe, grep the spec's own new-passage blocks
  for every term a later batch lands**, and record the forward-reference set
  rather than asserting it empty.
- **A passage that rewrites another role's procedure goes to that role's live
  session** with the question "which of your obligations does this touch",
  before the spec review rather than instead of it. The role checks the clause
  it is asked about and does not re-derive the rule against its own lifecycle
  obligations, so the review still has to run.
- **A plan that edits the note governing its own verification licenses its own
  omission.** Legitimate when the spec ratified it at plan review and the
  pre-edit baseline skipped the same check for the same reason — and a pattern
  to watch, since the warrant and the thing warranted arrive in one branch.
- **decision-2f36's hotfix-lane exclusion holds for a passage plan on a
  different reason.** The ADR reasons from whole-file blocks, where a later task
  would overwrite the fix; a passage plan keeps the rule because a hotfix
  collides with the file's in-flight edits and verification, block shape aside.

The second passage plan added eleven more, most of them about the **instruments**
a passage plan checks itself with rather than about its shape — which is where
that run's only weakness turned out to live:

- **A term sweep selects the plan's own new-passage blocks, not a line range,
  and prints its hits.** A range-based sweep of a passage plan is dominated by
  the plan's own `Run`, `git add`, and needle lines — 47 hits against a true set
  of seven — and a sweep that ends in `wc -l` leaves no record of what it found.
- **A plan whose passages are byte-identical to the spec inherits the spec's
  wrap flaws, and must name them**, so that neither the implementer re-wraps nor
  the reviewer files them. A flattened `grep -cF` cannot catch a re-wrap, so
  byte identity has no mechanical guard beyond the merge-base diff read by eye —
  or the reconstruction check below.
- **A hunk count is meaningless without the context width that produced it.**
  Measured three times in one run at three widths: `SKILL.md` gave 2 at `-U10`
  against the task-time 3 at `-U3`; `roles/kanri.md` gave 3 at `-U8` against 4
  at `-U3`; the whole-branch review read `1/2/2/5/2/3` at `-U10` and
  `1/3/5/7/7/9` at `-U0` against the same task-time `1/3/3/4/5/6`. A plan or a
  report states the width with the count, or states no count and reads the
  hunks. A hunk-count **explanation** is a second claim beside the number and can
  be wrong while the number is right, so a fix wave checks the arithmetic and not
  only the total.
- **When a replacement's anchor is the old passage, the step names the shape.**
  Otherwise the pre-edit check reads as a failure the moment anyone re-runs it,
  because after a correct replacement it must return `0`. A boundary that
  re-runs a batch's verification blocks mechanically sees exactly those invert —
  6 of 51 blocks in this run — and its procedure should say so.
- **The reconstruction check.** A reviewer extracts the brief's old and new
  blocks programmatically, applies them to the base blob as the stated shapes
  say, and compares the result with the committed blob. It proves byte identity
  and "no other byte moved" in one move, is stronger than reading hunks, removes
  the reviewer's own transcription from the loop, and scales — ten replacements
  across five files at once in the fix wave. Its by-product is the load-bearing
  half: it proves each old passage occurs **exactly once** in the base, which is
  the assumption a passage plan silently rests on.
- **A verification-only task's reviewer re-extracts the instrument before
  re-running it**, diffing the report's transcribed command blocks against its
  own extraction from the source. That is what makes "run the commands as
  written" checkable at all; without it a paraphrase that happens to produce the
  right answer passes.
- **Dispatches say "show the output, do not summarize it", and reviewers are
  told to re-establish what they verify** rather than read it. Every one of the
  run's fourteen task-level findings was in an implementer's report prose, and
  every one was caught by a reviewer re-deriving the fact.
- **A sweep's expected-output prose is a claim about sources** and can
  misattribute a hit while the set the sweep decides is right — the same shape as
  the hunk-count explanation, one level up.
- **A qualifier that lives in the spec's prose but not in its fenced block never
  reaches the runtime file.** When a block's meaning depends on a gloss around
  it, the gloss belongs in the block.
- **A check that a plan and a note must agree on is one block cited, not two
  copies.** The plan's raw sweep and the note's check 6 were the same command
  copied twice, and both omitted the same path.
- **A method a reviewer invents mid-run spreads only if the controller carries
  it forward.** The reconstruction check appeared in one task's review, was
  written into the next task's dispatch, and was used by every review after it.

Three alternatives were weighed and rejected while these conventions were
derived, and the reasons are worth keeping. A **bounded** handover wait was
rejected because the harness gives no signal to bound it by, so a bound would be
a guess written as a rule. A **date prefix on the topic word** was rejected
because the spec, the plan, and the workspace already carry a date, so a dated
topic either doubles it in every file name or becomes the larger unification now
filed as issue-f2c4. And **whole-file blocks for a passage-shaped plan** were
rejected because they would have meant transcribing a 580-line file to change
seven places in it.

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

**The boundary-rules design of 2026-09-07.** Its plan carried passages rather
than whole files, so the delivered skill matches those blocks except at five
points, each a ruled correction made in the whole-branch review's fix wave and
deliberately not re-synced into the plan or the spec:

- `roles/kanri.md`, "When the plan lands" step 1 — "your orders line", singular,
  where the plan's block had the plural. It was the sole plural of eight
  occurrences in the skill and sat in one of three copies of the authority triad
  that are meant to agree.
- `roles/kanri.md`, Start step 5 — the creation sentence gains "where the
  `<topic>` is that slug", binding a placeholder the step used but never
  introduced after deriving the slug under a different name.
- `templates/kanri-handover.md`, the fourth In flight bullet — wrapped onto two
  lines to match its peers, where the plan's block had one line of 124 columns.
  The trailing clause "; lost with this session" stays: the Handover section's
  wait depends on it.
- `roles/sekkei.md`, Step 3's fourth bullet — "the Batches bullet" for "the
  second bullet", so an ordinal cross-reference into a list the plan tells
  Sekkei to add to cannot rot when a bullet is inserted ahead of it.
- `roles/kanri.md`, "The final batch" step 2 — the fix-wave pre-flight sentence
  gains "and compare its output with what the list expects", the comparing half
  of the condition it invokes.

Four of the plan's own needles for those passages therefore no longer match the
tree. The handover bullet's still does, because its check flattens the file and
flattening collapses a re-wrap; the spec's handover-file block and the plan's
Task 3 both still carry the one-line form.

Two wordings stay as the spec's bytes, for its next revision rather than for a
fix wave: "a handover file" in rule 11 and in Kanri's step 1, where "any
handover file" would read better; and rule 11's "no further role is created",
whose scope — beyond the roles that start the plan — is resolved two sentences
later rather than where the clause is read.

**The review-brief design of 2026-09-08.** Its plan carried passages rather than
whole file contents, and the whole-branch review found spec conformance exact —
all eighteen fenced blocks of the spec's seven binding sections byte-identical,
flattened, to the delivered passages, with zero stray bytes. So the delivered
skill differs from that spec in exactly nine places, and every one of them is a
correction the whole-branch review's fix wave made **after** the spec was
committed: the plan's Sekkei had already left, the defects the review found were
in the spec's own blocks rather than in their transcription, and the ruling was
that the fix wave edits the tree while this document keeps the record. The spec
was not re-synced.

- `templates/review-brief.md`, the header paragraph — the **form markers** are
  named as an exception to rendering: the bracketed tag words, the `Q:` / `A:` /
  `Serves:` / `Adds or changes:` / `See:` labels, the `## <n>.` numbers, and the
  pointer. A form check naming English literals cannot run against a brief the
  template says is rendered whole; the earlier revision had closed this for the
  pointer alone and left the tags, the labels, and the fixed headings open.
- The same file, the `all OK` sentence — a point tagged **choose** or **decide**
  needs its own line and stays open if unanswered. As written, `all OK` and the
  "a point not mentioned counts as confirmed" clause together closed an open
  decision by silence.
- The same file, the pointer sentence and section 5's line — the exception is
  generalized past the pointer to the labels and the tags, and section 5's line
  for a spec is the literal `not applicable — a spec` without brackets, because
  `<...>` served in the template both as a fill slot and, once, as a literal.
- `roles/kanri.md`, Human access item 5 — the form check is **eight headings in
  that order in the chat's language**, and `grep '^#'` for the document's
  headings is the whole read Kanri makes. The old text looked for English
  literals and, in the same sentence, forbade the read it required.
- `roles/kanri.md`, the batch loop's step 1 — the **overdue detector** is named:
  the human's word that the batch has gone quiet, or a wake-up for another
  reason, with the boundary line saying which signal Kanri waits for.
- `roles/kanri.md`, the commit window's slot (c) — re-wrapped so
  `committed <subject>` sits on one line. No word changed; the previous wrap had
  split the string across a line break, which is lint-clean and valid CommonMark
  and silently defeated the note's one-line rule for a counted string.
- `SKILL.md`, the Messages idle bullet — the same overdue detector, in the
  contract.
- `roles/sekkei.md`, Step 2 and Step 4 item 5 — "**the document's** judgment
  points" for "the spec's", and the new-brief rule added to the plan gate too,
  naming a changed batch cut and the re-send of `review-ready:`. The spec's prose
  meant both documents; only its Step 2 block said so.
- `docs/notes/tanto-consistency-checks.md`, check 6's sixth block — the loop
  reads `skills/tanto/README.md` as well, so the note differs from the spec's
  block by one path. The block's prose claimed to count every Markdown file of
  the skill while its loop skipped one; the ruling widened the loop rather than
  narrowing the prose, and the block's Expected text is unchanged because
  `README.md` scores zero on all three strings.
