---
id: "4807"
title: tanto — multi-session orchestration as built
created: 2026-09-06
updated: 2026-10-08
---

## Purpose and shape

Serves exp-06b2 and exp-57f4.

`tanto` (担当, "take charge of") runs implementation plans through up to seven
interactive Claude Code sessions on the same repository, the same working tree,
and the same branch. Kanri (管理) manages, Sekkei (設計) designs the spec,
Keikaku (計画) writes the plan, Jisso (実装) implements, Kaiseki (解析) finds
root causes, Kikaku (企画) is where the human thinks about what comes next, and
Hosa (補佐) takes the small jobs. The experience scenes (chiefly exp-06b2) state
what its user expects; this entry states how it is built.

Five of the seven are lifecycle roles, created and deleted around a plan.
**Kikaku and Hosa are seats outside the lifecycle**: the human opens each one
directly, Kanri never requests one, neither carries an exit shoroku, and each is
`/clear`ed rather than deleted, its roster row marked `cleared`.

The human is the only actor who creates or deletes a session, and Kanri is the
only role that asks. Every request is a numbered list carrying the exact command
the human pastes. Kanri exists once per repository and is **resident across
plans** — decision-de63 — so a plan's end is a boundary like any other and the
next topic opens under the same roster. The other six are optional, and Kaiseki
is on demand, so it costs nothing while no bug is open.

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

A session's cost is **measured, not guessed**. Every role takes a **reading** of
its own transcript — bytes, records, wake-ups, compactions — at its boundaries
and sends it with the lines it already sends; the roster keeps the readings of
the current run and an archive keeps them across runs. The instrument is four
figures from a `wc`-and-`grep` pipeline defined once in `SKILL.md`, run by the
session on its own file. A script under the skill was rejected (it would be the
skill's first non-Markdown file, a lint and a runtime surface), and so was Kanri
reading its peers' transcripts as the primary source: a peer's config directory
and the host's permission class are not Kanri's to assume, and on this host
alone the project's transcripts sit under two config paths that resolve to one
store. That is why the path travels in the handshake — the `[ref]` a session
can see is not the session id, so nothing a peer holds leads to the file.
No threshold is chosen: the archive's rows are the dataset, and the number that
would fire a handover or a replacement on cost is a later ADR's (issue-40ed).

## Skill layout

Serves no expectation; internal shape.

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

Fifteen templates are copied and filled, never restated in prose: the roster
and its archive, the conductor ledger, the handover, the bug report, the batch
prompt, the batch report, the boundary brief, the Kaiseki brief, the Kaiseki
report, the review brief, the shoroku brief, the Kikaku decision, the agent
definition, and the built-in expected-model defaults. Three non-test scripts
sit beside them — `scripts/passage-check.js`, `scripts/reading.js`, and
`scripts/boundary.js` — and `tanto.json` carries fourteen `subagents` keys,
`boundary.verify` the newest: the kind Kanri dispatches once per boundary,
whose brief is `templates/boundary-brief.md`. The templates directory is
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

The rule was violated once and fixed: five passages of the tanto-sweep plan
wrote the repository-relative `node skills/tanto/scripts/passage-check.js`
into three role files, naming this repository's own layout in runtime text
that any repository must be able to run. The reason is stronger than tidiness
— tanto runs in any repository, where that path does not exist — so the fix
keeps the runtime text skill-relative (`scripts/passage-check.js`) and has
`SKILL.md` say how to resolve it; `docs/notes/tanto-consistency-checks.md`
carries the sweep for it as its own check.

A skill-relative path is runnable only if the skill also says how a variable
holding it reaches the same shell as the command that uses it, because shell
state does not persist between tool calls. `$TANTO` needs an assignment
convention and not only a definition: naming it once and reading it six
commands later fails silently, so runtime text sets it in the same tool call
as every command that reads it.

That link has a consequence for this repository, and rule 11 draws it: when the
skill the sessions load is the working tree's own copy, a plan that edits
`skills/tanto/` changes the skill its own sessions are running, and a session
started mid-plan reads whatever is on disk at that moment. So while such a plan
is in flight the authority for the run's sessions is the plan's Global
Constraints, Kanri's orders line, and the batch prompts, not the role text on
disk; Kanri records that as a ruling when the plan lands. The rule speaks of
this repository's own sessions, and there is a second class of reader it does
not name: **another repository's sender reads the linked tree mid-plan too**
(exp-06b2). A reporter that resolves the intake's address out of this
repository's `.tanto/roster.md`, or that reads the report template to write
from it, is reading files a plan may be halfway through rewriting, and it is
bound by no orders line. The route survives it because both artifacts are
readable in either state and the act they lead to is one harmless line; a plan
that changes what the sender must *do*, rather than what it reads, has to land
that change at a boundary the sender can be told about. The rule states the
premise conditionally, because `SKILL.md` ships to hosts where the skill is
installed as a copy and the hazard does not arise there. decision-5c8e holds the
reasoning and the alternative that was rejected.

The link reaches further than rule 11 says, and for scripts more sharply than
for sessions (exp-09c2). `~/.claude/skills/tanto` links into this
repository's working tree, so a topic branch checked out there reaches every
repository's launcher calls and new sessions at each commit, and at each
uncommitted edit — not at the merge. Rule 11 says so for sessions, which load
the text once at their start; the launcher (`scripts/tanto.js`) and
`scripts/boundary.js` are executed fresh at every call, so every repository
that types `tanto` or runs a boundary command runs whatever the tree holds at
that second. The resident spawner is the exception: `scripts/spawner.js` runs
the code it loaded, so a plan that edits it takes effect at the spawner's next
restart, and until then the process the launcher started answers with the old
code — measured on 2026-10-08, when a task removed the `ack` op and the
running spawner kept answering `ack` until it restarted.

The boundary that ADR defines — "the first boundary at which every file the
plan touches agrees with every other" — is read as **every file a session
loads**: `SKILL.md`, the role files, and the templates. A README or a note is
read by people and by a plan's verification commands, never loaded by a
session, so a session started while those two still carry the old wording is
not half-instructed. The tanto-workspace plan of 2026-09-12 named batch A's
boundary on that reading, with the README and the consistency note in batch B;
the human chose to record the narrowing here rather than amend decision-5c8e,
on the precedent of the creation clause above. A permitted boundary is
nominal unless the state the new text names exists at that boundary, which is
why that plan's migration of tanto's own state runs at the same boundary, as a
Kanri directive under the prompts' authority.

Measured on 2026-09-09, during the review-brief plan: rule 11's creation
clause was crossed once, knowingly, by the human — a Sekkei for the next topic
was created during batch A while a task was editing `SKILL.md` — and no defect
followed; the orders line's authority sentence covered it, and that Sekkei's
topic touched no `tanto` file.

**A Sekkei is never reused across topics** — decision-f496. An earlier
measurement here read the other way: a Sekkei deleted on Kanri's
keep-or-delete question and recreated ten minutes later cost one session's
context for nothing, "where a kept Sekkei given the next topic costs none".
That bullet is **reversed**, on the human's rule of 2026-09-09. Reuse spares
the human nothing, because the next spec needs its dialogue whether the session
is old or new; what the old session carries — the previous spec, plan and
reviews — is on disk and in the spec inputs; and its context would be re-read
at every wake-up of the new topic, which is the cost this design now measures.
The saving the earlier bullet counted was one session creation; the charge it
did not count was every subsequent turn. The other reuse conditions were
reviewed from the same viewpoint and stand: Jisso within a plan, Kanri across
plans, Kaiseki per case, and a resume after a restart, which is the same
context under a new name and not a reuse at all.

## The start sequence

Serves no expectation; internal shape.

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

The run's first Kanri is started the same way as every other terminal seat —
the launcher asks the spawner for it rather than running `claude --bg` itself
— so that the rule that the spawner is the only process that runs
`claude --bg` has no exception a reader has to remember.

## The session listing's one key

Serves exp-173f.

Three scripts read `claude agents --json`: the spawner (`listAgents` in
`scripts/spawner.js`, behind its spawn, resume and census), the launcher
(`scripts/tanto.js`, which decides whether to write a `resume`), and
`scripts/boundary.js census`, Kanri's one signal for the roster. All three
run the listing with no `--cwd` and keep the entries whose **listed `cwd` is
the root or under it** — one test, `underRoot`, which `spawner.js` defines
and exports and `tanto.js` imports; `boundary.js` carries its own copy. Until
the shoki-seat topic the census already keyed on the listed `cwd` while the
spawner and the launcher passed `--cwd <root>` to the CLI: three readers of
one listing with two keys. The CLI's own filter is measured for the root
alone, and a seat whose process cwd is a worktree under the root — the shoki
seat, run in the worktree Kanri cuts (decision-598a) — may be keyed by it on
something else, which is unmeasured (`docs/notes/claude-code-sessions-observed.md`).
Filtering on the listed `cwd` finds such a seat whatever the CLI's key is,
and excludes a session another repository spawns in the same moment. One
listing call per pass, as before.

## The spawner's state file, its clock, and its blocked

Serves exp-173f.

Every seat is spawned by the run (decision-7a19), and a dialogue seat is
parked between its turns by the spawner (decision-97cc), so the state file
`.tanto/spawner/seats.json` and the result files are what the run continues
from. Two facts of `scripts/spawner.js` bind every reader of them.

**The stamp is minute-resolution local time.** `stamp()` gives the state and
result files a local time to the minute, and the only other time they carry
is `startedAtMs`, in epoch milliseconds. A rule that compares times across
files — a request against a turn, a handover file against a seat — needs the
epoch form; the minute stamp cannot order two events inside one minute and
is not comparable across hosts.

**A new seat enters `seats.json` after its transcript poll.** The spawner
writes a new seat into the state file only after polling for its
transcript, up to ten seconds after the session is first listed. Anything
that reads the state file from inside the new seat's first turn — the
seat's own `seat` check, a census Kanri runs at that moment — can run ahead
of the write and find no entry.

**`blocked` carries its cause, and no longer means an idle seat**
(exp-3a9e). Until decision-97cc the spawner's `blocked` was the listing's
`state: "blocked"`, which a seat that has answered and waits for its next
message also carries, so every idle seat with a `pid` read as blocked and
its toast was raised on that. `blocked` is now a background entry's
`status: "waiting"`, with its cause, and the census notice carries the
cause (decision-1c07 as decision-97cc amends it).

## The launcher's attach

Serves exp-1c96.

The launcher enters a seat by role and runs `claude attach` itself, with the
terminal's standard streams inherited (decision-4d44). Before that, it
printed `claude attach <id>` for the human to type, and every line printed
before it — the trust hint, the leave line — stayed on screen. Now **nothing
printed before an inherited-stdio attach is readable**: the attach takes the
screen with no scrollback, so any line the launcher writes before
`spawnSync(attach, stdio inherit)` is a flash. The acceptance scene saw one
instance — the `context=` line — and the fix wave moved it; the class binds
every line the launcher adds later. A figure the human must read goes after
the attach returns, or into `tanto jokyo`.

**The launcher enters the Kanri the spawner holds** (exp-c53d). When the
spawner refuses a Kanri spawn request with `error: held: <sessionId>`, or the
roster's first row names a `sessionId` that neither the listing nor the state
file holds, the launcher looks up the held Kanri (`running`, `blocked`, or
`gone`) and enters it — attached when the listing shows it, and otherwise by
the one `resume` request with its `/tanto fukki` prompt, since the spawner
counts a `gone` Kanri as the holder and a `gone` seat has nothing to attach
to. It writes no second spawn request, so a corrupted or stale first row no
longer locks the human out of Kanri.

## Addressing, and why by born name

Serves exp-173f.

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

**Kanri's address is read, never announced** — decision-0775. The roster's
first data row, read at the moment of sending, is the address; no role caches
it and no line carries it. The invocation's address argument survives as the
**bootstrap** for a workspace whose roster does not exist yet, and nothing
else. Every other role's address is known only to Kanri, from the handshake,
and Kanri is the only session that sends to Sekkei, Jisso or Kaiseki.

**Kanri sends only to `live` rows, and a queued seat reads nothing until its
batch prompt** — decision-76a6. The Jisso queue (below) puts N windows on the
roster at the plan's landing, and a queued row is an address that exists and is
deliberately never used: the window is sent nothing at all — there is no
broadcast of any kind to send it — and it reads no plan and no spec while it
waits. A broadcast to the run's windows therefore costs the waiting ones
nothing, which is what lets a seat that waits hold the minimum context
(exp-178d). The batch prompt is the whole start contract for a rotating Jisso,
which is why it carries the setup a resume would otherwise supply, Kanri's own
name and ref included.

**Every tanto line carries a `no-role` second line** — decision-78e4. Because
windows are reused rather than closed, a line can reach a window that has been
`/clear`ed and not yet given its next role; a bare window answers the human in
its own window and replies nothing to the sender, so the run cannot learn of it
from the wire. The guard is therefore in the message rather than in the host: the
second line of every line tells a window with no role to say so and act on
nothing. Three configuration placements were declined — the personal
`CLAUDE.md`, the repository `AGENTS.md`, and both — because a rule in either
file cannot ride to the other repositories the human runs tanto in.

A name is not durable, and that is why the **transcript path** is the identity a
resume keeps. Measured 2026-09-09: a resumed conversation keeps its context, its
session id and its transcript file, comes back under a new name and `[ref]`, and
leaves **no record of the resume in the transcript** — the only `SessionStart`
hook records are `startup` at a true start, and `SessionStart:compact` marks a
compaction rather than a resume. So a session sees its own resume only in the
listing. `/tanto resume`, the fifth invocation word, and the self-check every
role runs at each of its boundaries are the same act: one listing, then compare
the name it prints for this session against the roster row whose Transcript
column is this session's own path. A peer that differs re-sends its handshake
and Kanri rewrites the row in place — status `live`, no `dead` row, one Events
line `resumed: <old> → <new>`; Kanri rewrites its own first row and tells no
one — the row is the announcement, and a peer reads it at its next send. The self-check runs at boundaries and not at every
wake-up, because one listing per turn was the alternative and it costs a turn's
worth of context for a state that changes once. A standalone Kaiseki has no
roster and therefore no self-check. The Transcript column that all of this keys
on is written by the handshake for the peers and by Kanri itself for its own
row, as the roster section above says.

## The expected-model config

Serves exp-178d.

Three maps, three mechanisms — the first two recorded in full as
decision-9a3a, the third added by decision-eee2.
`sessions.<role>` is **advisory**: it feeds the model check and Kanri's check at
the handshake, and nothing ever switches a session's model. `subagents.<kind>`
is **effective**: its value goes into the `model` parameter of every subagent
that role dispatches, and no dispatch omits it — an omitted model inherits the
session's, which on three of the seven roles is the strongest family. `ceiling`
is **effective** in the same sense: `scripts/reading.js` reads it and the
residency verdicts Kanri and Jisso act on come out of it — `ceiling.kanri` and
`ceiling.jisso` as `{ "batches": <N>, "per_batch": <tokens> }`, plus
`ceiling.presence_minutes` and `ceiling.share_threshold`.

**A kind carries an effort as well as a model, and the two bind by different
routes.** The thirteen kinds are named `<object>.<act>`, and each role renders one
agent definition per kind at its start, into `~/.claude/agents/tanto-<object>-<act>.md`
(the `.` becoming a `-`; `$CLAUDE_CONFIG_DIR/agents/` when that variable is
set). The definition carries the kind's `effort` and no `model`: the family
comes from the dispatch's own `model` parameter, which takes precedence, while
the effort comes from the file. A dispatch therefore names
`subagent_type: tanto-<object>-<act>` and `model: <family>` together.

**Where the set of kinds is actually pinned.** No script enumerates it:
`scripts/reading.js` reads only the `ceiling` map, so a plan that adds or
splits a kind has no script to edit. The set lives in exactly three places —
the skill's own prose, `templates/tanto.json`'s `subagents` map, and check 8
of `docs/notes/tanto-consistency-checks.md`, whose assertion is the only
mechanical guard. A kind split — `shoroku` into `shoroku.recommend` and
`shoroku.apply`, decision-0352 — is therefore a prose-and-JSON edit plus one
check's expected value, and nothing else.

The effort half is **measured-unconfirmed**, and this entry states that rather
than asserting it works. The 2026-09-14 dogfood dispatched a probe on a
definition carrying `effort: low` and read that subagent's own transcript: the
dispatch resolved and the model bound, but the transcript records
`perTurnEffort: null` and no `effort` key at all. The evidence leans negative —
the same record writes the model down twice and the effort never — but it cannot
separate "the harness ignored the key" from "it honored it without recording
it". The instrument was wrong for the question: settling it needs a behavioral
probe, a task whose output differs by effort level, not a transcript-field read.
See `docs/reports/2026-09-14-tanto-cost-dogfood.md`, section 8.

**The effort check's `warns only` is what makes a reused window safe.**
Measured 2026-09-16 and recorded in `docs/notes/claude-code-sessions-observed.md`:
a `/clear` **keeps the model and resets the effort**. Under window reuse
(exp-06b2) a seat therefore starts its next role on the right family and at
whatever effort the window fell back to, so a check that switched or stopped on
an effort mismatch would stop a correctly-reused window at every role change.
decision-08bc's warn-only rule, chosen for the model check, is what carries the
effort half safely.

The skill ships built-in defaults, one value per fixed key, derived as the
next paragraph says. A personal file overlays them key by key, so a partial file is
complete and an absent file is the all-defaults case. Each role says once, at
start, which file it read and which keys came from the defaults. It then checks
that the escalation kind sits above the implementer kind on the ladder, because
the fix loop's late rounds are an escalation only if it does.

**The shipped values follow decision-03f9's split, with Sekkei the `max`
exception** (decision-3c47). The one-shots — `plan.review`, `plan.coldread`,
`branch.review`, `spec.review`, `shoroku.recommend` — buy the top family; the
resident seats run on the cheaper families. `sessions.sekkei` ships as `opus`
at `max`, `subagents.spec.review` as `fable` at `high`, and
`subagents.brief.write` as `sonnet` at `high`. Kikaku and Kaiseki are the two
resident seats left on the top family (`fable` at `xhigh`), named as
exceptions; whether Kaiseki should follow Sekkei is open (issue-54e5). The
ladder `fable > opus > sonnet > haiku` still orders the families for the
escalate-above-implement check.

How the personal file reaches the user's config directory is deliberately out of
scope: the skill only reads it. That is why the config-deployment item carries
no issue, unlike the other deferred items of the design work.

**Kanri on `sonnet` has now been measured twice, with the same result.** The
personal override that put Kanri on `sonnet` first ran across the
`tanto-workspace` plan (2026-09-12): zero fix rounds, zero parked findings,
one whole-branch Important finding, caught and fixed. The `tanto-cost` plan
itself — spec through T2 and the merge, 23 tasks in six batches, one
whole-branch review, one fix wave — ran under the same `sonnet` Kanri with
the same qualitative outcome: zero fix rounds of Kanri's own, zero findings
left unresolved at the close, no compaction noticed across either run. The
second measurement is on a plan roughly seven times larger by task count
than the first, which is the direction a model-choice measurement should
move in before it is trusted.

## The roster and the conductor ledger

Serves exp-173f, exp-19c1.

The roster is kept at a fixed path, `.tanto/roster.md`, Kanri's row first,
**one row per seat** in one table of twenty columns: the seat's role, topic,
name, cwd, model family, effort, branch, mode, start, status, and transcript,
then its latest reading — the boundary or moment it was read at, the five
figures — and, for Kanri's row only, the cross-plan counters the skill keeps
(batches accepted, plans closed, compactions noticed since this Kanri's own
start), because the roster is the only file that outlives a plan
(decision-357d). A row is **keyed by its Transcript cell's `sessionId`**
(decision-cdc4) and found by nothing else; the Name cell is the address the
seat answers to as a bare name, a record rewritten at every rename the census
prints, never a key. The separate Residency table, joined to the sessions
table by the name string, is gone: that join was the source of every recorded
roster defect, from duplicated rows on a rename to a corrupted handover row.

**`boundary.js record` is the roster's only writer, with `archive` and
`migrate` for the moves they make, and it refuses what the template does
not name.** Before any write it compares the header of every
table it touches, cell for cell, with the same table in the skill's
`templates/` — the roster, the ledger, the archive — and on a mismatch writes
nothing and names `boundary.js migrate`, which rewrites an old-shape file
once, keeping a `.pre-migrate` copy. A pipe in a value is escaped by the one
cell grammar every reader in `boundary.js` and `tanto.js` shares, and a
Transcript cell that is not `<uuid>.jsonl`, or a cell with a newline or a
control character, is refused. Rows are created by `--seat` (from a spawn
result or the state file's entry), by `--init` (Kanri's bootstrap, which
creates the roster from the template), and by `--succeeds` (the handover:
the successor's row first, the predecessor's `replaced`, one Events line).
The readings, Kanri's counts, a status, a `live` suffix, a rename, and every
roster Events line are `record` flags too, so no cell and no Events line is
hand-written. At a boundary `record` also writes the Measurements table's
per-boundary entry with its `ttl=` cache regime, the `S-n` rows and the
Session events, all idempotently, from the readings its dispatch carried
(decision-a8cc). A peer's reading names the peer by `sessionId`, which Kanri
resolves from the bare name at receipt with `boundary.js seat`; a name `seat`
cannot resolve becomes an `unresolved reading:` ledger event, not a row.
`boundary.js roster show` prints the first row, the live and queued rows, and
the Events tail, so that a Start or a handover reads the roster by one
command.

At a plan close `boundary.js archive` moves every `stopped`, `dead`, or
`replaced` row, copied whole with an `Ended` date, and the roster's Events
lines verbatim, to `roster-archive.md`, writing both files or neither. Nothing
is joined and nothing is dropped, since the row already carries its last
reading. The archive is untracked and dies with the workspace, so each
plan's T2 direction carries the run's readings into the dogfood report,
which is where they survive.

**Five status words, one per fact.** `queued`, `live`, `stopped`,
`replaced`, `dead`. `cleared` is no word of the roster's since decision-7a19,
and `record --status` refuses it; a `cleared` row of the old contract is
moved to the archive by `migrate` as it stands. `replaced` is every Kanri that
handed over, whatever its process is doing; `dead` is the census's word for a
seat whose process is gone and that was not replaced. The census prints seven
headings, each one row of a table that names Kanri's one act
(decision-158b); its **Returned** heading catches a `stopped` or `dead` row
whose seat runs, and a `queued` seat the listing does not show is marked by
nobody. decision-39fb stands whole: a `dead` row goes `live` at the wake that
sends it a line.

**A `live` cell carries one suffix, and the idle one wins** (exp-3a9e). No
status word was added for a seat the census sees `blocked`; Kanri appends
`(blocked since <HH:MM>)` to its `live` cell through `record --suffix`, the
convention
`(idle since <HH:MM>)` already used, and removes it at a later census that
does not see the seat blocked. The suffix is the last census that saw the seat blocked,
not its state now, and names no cause: a permission prompt, a usage-limit
pause and a seat idling on a kessai all read `blocked`, and telling them
apart is deferred, recorded in issue-feac's resolution. When both would apply — an idle
Kikaku whose window shows a permission prompt — the cell keeps the suffix it
already carries: the blocked suffix is added only to a `live` cell with no
suffix, because the idle one is written on the seat's own report and is the
more specific fact. The shoki-seat design left that precedence open, and the
fix wave's clause in `roles/kanri.md`'s census bullets decided it. Every
reader still tests the cell's first word.

The **Transcript** column holds each seat's transcript path, and it is the
identity that survives a resume, which is why it became the row's key: a
seat whose `sessionId` matches a row is that row's session resumed, and its
row is rewritten in place. Kanri's own row is written by `record --init` at
the bootstrap and by `record --succeeds` at a handover, from the state file's
entry for its `sessionId`. That identity was
exercised whole on 2026-09-14, when a profile switch — an editor-wide restart
that moved the personal Claude Code configuration directory — landed mid-topic.
Within about an hour every peer of the topic in flight was back: four roster
rows across four roles, each resumed or freshly created under a new name, and
no work was lost. The ledger, the roster and the already-committed write-outs
carried every fact forward, and the only thing any successor needed was its own
re-handshake — state in files rather than in memory, tested by the exact
disruption the rule exists for. The same window disrupted other tanto runs on
sibling repositories of the same machine, whose bug reports converged on closely
related findings and reached this repository's intake within the same hour.

Between plans there is no
ledger, so the roster also carries a Shoroku proposal items table with the
ledger's columns, written by `record --s-item` given `--roster` and no
`--ledger`, and Kanri moves the unwritten rows into the new ledger when a
topic opens.

The conductor ledger is Kanri's, and Sekkei, Jisso and Kaiseki read it without
ever writing it. It holds the progress line, the plan's locations and the
hotfixes since the previous plan, the batches table, the rulings, the shoroku
proposal items, the session events, the open questions for the human, and the
measurements. No plan basename exists before the plan is committed, so the
ledger starts under a topic directory and moves to the plan's workspace when the
plan lands; only the ledger moves, and the topic directory stays as the
spec-phase record.

The ledger's Shoroku proposal items table has a **Written** column, holding `no` or
the subject of the commit that wrote the row out, and a Stage column that now
carries `t2` for every row, whichever moment raised it, since the close is the
one stage that recommends a ledger's rows; `exit-<role>[-<suffix>]` names a
proposal file and is never a Stage value. Every write-out takes only adopted
rows marked `no`, so nothing is written twice. Both live in
`templates/kanri.md`; the ledger of the 2026-09-07 run predates the column and
carries the same state inside its Adopted cell, so a reader of that workspace
should not expect the seventh column there.

Two more workspace artifacts belong to the spec phase. **`dialogue.md`**, under
the topic directory, is Sekkei's: each question it put to the human and the
human's answer, verbatim, in order. Kanri, the brief writer, and the close's
write-out read it, which is the point — the human's own words reach them
without Sekkei's paraphrase in between. Its caveat is worth stating, because the
skill calls it the one record of the human's own words while it lives untracked
under `.superpowers/sdd/`: it survives only as long as the workspace, and its
content becomes durable only when the topic's close writes it out. It also
**outlives the seat that wrote it**, and that is worth writing even when the
seat is discarded: on `bug-report-hold` a first Sekkei was discarded and its
`dialogue.md` became the successor's recovery point — the measurements and the
one open question were read rather than re-measured, and the question had been
answered by a Kikaku file before the successor started. A dialogue file is a
recovery point, not only a record. **`review-brief-spec.md`**
and **`review-brief-plan.md`**, beside the review reports in the same directory,
are the brief writer's, written from `templates/review-brief.md` in the chat's
language; Kanri reads them for form and the human reads them through Sekkei.

**The tree keeps itself quiet.** An untracked agent tree silences the editor's
markdownlint entirely by carrying its own `.markdownlint-cli2.yaml` holding
`config:` and, indented two spaces beneath it, `default: false` — no change to
the repository's root configuration and no addition to its `ignores`. With a
`.gitignore` of `*` beside it, the directory is invisible to git and to the
linter at once, and neither of the repository's own configuration files is
touched, which is what keeps the arrangement inside the never-edit-without-
approval rule. The shape is reusable for any untracked workspace; it sidesteps
issue-6aa8 rather than resolving it, since `.superpowers/**` is still absent
from the root `ignores` and that file is out of a tanto plan's scope.

**Why one directory per topic, and not two.** The two-place scheme this
replaced — a topic directory before the plan landed, a plan-basename directory
after — existed because no plan basename is known while the spec is being
written. The answer was not to move the ledger at landing but to keep the topic
slug as the sole key for the whole run and to record the SDD skill's own
ledger path inside the conductor ledger's Plan section, where a reader needs it
anyway. The move disappears, and the topic word names exactly one directory
from the topic's opening to the plan's close.

## Kanri's loop, with its entry and its side channel

Serves exp-26d5, exp-173f.

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
(exp-173f, a resumed session rejoins as easily as possible). A cheaper-looking
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
beyond its being short and unique, and under exp-57f4 the human is interrupted
only at defined checkpoints.

The word reaches five places, which is why it is fixed at the orders line: the
topic directory, the spec and plan file names, the plan basename and so the
workspace, the branch, and the roster's Events prose. issue-f2c4 proposes
collapsing the first three by making the topic the plan basename.

**When the plan lands.** Cold-read the committed spec whole and the plan's
**frame** and send Sekkei one line per open question; move the ledger to the
plan's workspace and note the move in the roster's events; record Keikaku's exit
proposal as `pending` rows and ask for its release; ask the human to create the
**whole Jisso queue** in one list — nothing gates a Jisso's start but the plan;
on the first Jisso's handshake reply with the
standing-orders line, then write the first batch prompt from its template and
send it.

**The Jisso queue** — decision-ea95. The create request at the landing asks for
N = batches + 1 windows, and the rotation is fixed: one fresh Jisso per batch,
in queue order, with the spare seat standing in for a Jisso lost mid-batch.
That is what removes the replacement decision from every boundary and puts the
whole ask in front of the human while they are present (exp-57f4). The queued
windows cost nothing while they wait, under the addressing rule above; what
the editor pays for N idle windows is unmeasured and is issue-6c44. One case
takes the full N and cannot be topped up: a plan that edits this skill and
names its final boundary as the only safe one for a start cannot open a window
mid-plan under rule 11, so a Jisso lost on such a plan is a ruling put to the
human rather than a routine request. Each batch's Jisso is **released at its
own boundary**, not held for a list at the close — decision-6930 — because a
released window is the queue's next seat.

The cold read is Kanri's largest single input and it stays in context for the
rest of the run, so it reads the **frame** — everything outside the task steps,
printed by a sixteen-line `awk` command in the role file that replaces each
task's steps with one `[steps: N lines]` marker and tracks fences so a heading
quoted inside a block does not end the skip. Measured: 631 of 1891 lines, 497 of
1796, 582 of 3090, and 850 of 6032 on the context-cost plan itself — a third or
less, and the ratio falls as a plan gets more step-heavy. The cut is the whole
step, not only its fenced blocks, and that choice is measured too: the
blocks-only cut saves 20 percent where the whole-step cut saves 67, because in a
passage plan the step prose outweighs the blocks. A plan in another shape prints
whole, which is the safe failure.

What the frame read gives up it takes from two other artifacts, and the split
matters. The steps' **commands and their outputs** come from Sekkei's dry-run
report; a **passage block** is read from the plan by its id, on demand. The
report is not a substitute for the plan here — it carries commands, outputs and
expectations and not the blocks, which the whole-branch review confirmed by
sampling new-passage lines that occur zero times in it. Nor is the report cheap:
for the context-cost plan it is 5038 lines, 5.9 times the frame, so the saving
is a function of two artifacts and depends on consulting it selectively rather
than reading it whole.

**The loop, per batch**, in this order: wait for the report line, never poll;
**dispatch the boundary** and read its verdict *before* reading the report;
read the report
and rule, adopting or rejecting each shoroku proposal item; **triage any bug report
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

**The boundary runs in a thrown-away context** — decision-a8cc. Kanri
dispatches one `boundary.verify` subagent per boundary, on
`templates/boundary-brief.md`, and that subagent does the whole mechanical
half: `scripts/boundary.js check`, then `scripts/boundary.js record`, then the
next batch prompt rendered from its template, then a verdict file. Kanri reads
the verdict by `sections` — a line, not a transcript — and rules on it. At a
boundary Kanri takes **no reading of its own** and edits **no table by hand**:
the reading the dispatch carried is what `record` writes into the Residency
row, and the ledger's Batches, Measurements, `S-n` and Session events rows are
`record`'s too, written idempotently, which is what makes a rework one re-run
of the same command instead of another Edit. The resident's own single
`record` call is the exception the handover case needs, when the loop stops
before the step that would have made it.

Two things the subagent cannot see have to ride in the dispatch prompt: the
peers' readings since the last boundary, and the resident's own top-family
one-shot dispatches. A design that wanted them out of the resident's hands
too would need peers to write their readings to a file, which no line does
today.

The Batches table's State is `planned` when the brief renders the next prompt,
and no `record` call ever writes the word `sent`; the next state a call writes
is `reported`.

**The report line is the signal, and no tanto line carries a subscription.**
Kanri sends every line — batch prompts, Kaiseki briefs, and the exit lines
alike — without an idle subscription and waits for the one-line report; it
subscribes — a pure `notify_when_idle`, no message — only when a signal is
overdue, and treats a notice arriving before the report as a reason to check
the workspace rather than as the signal, because a peer's turn ends whenever it
dispatches a subagent and most notices are therefore false idles. The
measurement behind the rule: across two days one Kanri took 394 wake-ups
against 77 peer messages, with **81 idle notices** — about half its wake-ups —
and every wake-up re-reads the session's whole context as input. The exit
lines carried a subscription until 2026-09-10, on the reasoning that there the
idle notice is the forced-exit signal by design; measured across two Sekkei
exits it woke Kanri four times and signalled nothing, because both sessions
answered normally and every notice arrived after its answer (issue-d725). A
session that has stopped answering is now learned the way a missing batch
report is learned — the human says the session is gone, or the window wakes
for another reason and the answer has not arrived — and the forced exit
follows from that.

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
`nothing to commit`, which is the pair Kanri waits for before moving on. The
wake-up table that first sized this channel called that reply droppable, on
the reasoning that `git log` carries the same fact; the reply gates Kanri's
next prompt, so it is kept for the peers that write a `commit-ready:` ledger
event and dropped for the rest.

The side channel runs the other way too, through a file rather than a message:
the spec dialogue happens in Sekkei's window under a standing grant, and its
words reach Kanri through `dialogue.md`, not through Sekkei's summary of them.
That is what lets Kanri's reading at the plan's landing be mechanical and what gives the brief
writer the human's own answers to select from. One step of Sekkei's own
belongs between the last design section and the spec: sweep every settled
option for a "when" or "who" that rode inside the option text unexamined —
in the tanto-workspace dialogue of 2026-09-11 the answer "move live state
only" carried "at the close" inside it, accepted with the option, and only
when set beside the boundary answer did the gap show and need a question of
its own.

Sekkei may write under its two directories at any time, which is what lets it
draft the next plan while the current one's batches run, but it **commits** only
at a verified boundary while a batch is in flight; with no batch in flight it
commits when the work is ready. The reason is the shared index and the
pre-commit hooks' stashing, which would disturb an implementer mid-task — a
reason that only applies while an implementer exists.

## Handover

Serves exp-19c1, exp-173f.

Kanri is resident, so its only exit is a handover — decision-de63. Four
signals fire one, checked at every boundary: at loop step 6 while a plan is in
flight, and between plans at the start of every turn. **The plan close** is the
ordinary one of the four — decision-b6cb, as decision-5ec7 amends it: after T2,
the merge decision, the peers' **release**, and the archive move, the handover
runs without a threshold
and without asking, because the close is the moment with nothing in flight and
the record complete, and a resident session's per-turn cost is its age, so the
reset is a planned step rather than a question put to the human once a plan
(exp-57f4). **The human's word**, which always overrides, at any boundary. And
a **compaction noticed**, which is the one signal a session can see about
itself and is the mid-plan case — a human who says "continue" at a plan close
declines that close's handover the way this section already describes, which a
mid-plan compaction never gets asked. State lives in files, so a compaction
loses nothing a successor cannot read back; it is the harness's own evidence
that the session has grown long. And the **context ceiling crossed** —
decision-eee2, the fourth signal — which fires on the reading's own token
figure, a derived baseline plus a chosen number of batches of measured
consumption. The last two are the gated pair: both the ceiling crossing and
the noticed compaction fire only when the human's last turn in Kanri's own
window is inside the presence window, because a handover written to an empty
room stalls the run until someone returns to create the successor. A crossing
that finds the human away is recorded as deferred; when the human returns and
declines it, `declined` is terminal for that plan and the crossing is not put
to them again. The token figure the harness prints is
deliberately not used — its unit is not documented as the context window. A
count threshold for **replacing a peer** is deferred as issue-40ed's other half
— its handover half closed with decision-b6cb — and the Residency counters
exist so one can be chosen later. Kanri now sees its
own compaction two ways: as it always did, and as a `1` in the Compactions
figure of the reading it takes at every trigger check — a figure it had not
noticed counts as noticed when it reads it.

**A peer's compaction is a replacement condition too** — decision-6dea, which
amends decision-de63 by symmetry. One compaction in Sekkei's reading means
replacement at its next commit, in Kaiseki's at its report, and in each case the
exit shoroku runs first. Jisso's half of that rule no longer has a case:
decision-ea95 replaces every Jisso at its own boundary regardless, so a
compaction in a Jisso's reading is a measurement rather than a trigger, and
whether `ceiling.jisso` still earns its keep is issue-6620. The rejected
alternative was to keep the evidence-of-loss condition and merely record the
compaction; the reason for symmetry is that a summary standing in place of the
conversation is the loss, whatever its size. The trade is real and was made
knowingly: a compacted session is the *cheap* one in context terms, and
replacing it pays a fresh cold read.

What a compaction summary attributes to the human is **unverified until the
human confirms it**. A session whose reading shows a compaction it has not yet
reported writes every item its summary ascribes to the human — said, ruled,
saw, confirmed — to `compaction-<role>-<n>.md`, names it to Kanri as
`compacted: <path>`, and acts on none of those items beyond the task in hand
until `confirmed: <path>` comes back; Kanri puts each item to the human, records
the answers as rulings, and marks the file `confirmed`, `corrected`, or
`denied`. Two sessions have no Kanri to answer: Kanri itself, whose case is the
handover file's `(unverified)` marking, and a standalone Kaiseki, which asks the
human in its own window. What the harness summarizes is not the human's words;
the human's words are in the dialogue file, the ledger, and the human's own
window. The loop is a new interrupt class, outside the checkpoints exp-26d5
lets the user know of, and it was accepted because the alternative is acting
on words the human did not say.

**A handover file's own summary of a referenced input is not a substitute for
reading that input.** Measured on 2026-09-12: the successor Kanri answered a
question about the next topic's scope from the handover's one-line pointer to
a spec-input file, and understated what the file itself already settled — the
human corrected it, and the file, read whole, confirmed the correction. The
handover file is a pointer, never a copy, precisely so that its reader goes to
the source; treating the pointer's own gloss as the source is the failure
mode this guards against.

Timing is a boundary only: a batch accepted and the next prompt not yet sent, or
between plans. The outgoing Kanri writes its own exit shoroku first, then the
handover file from its template, sets the ledger's progress line or a roster
event, prints the residency line with the human's numbered commands, and stops.
The successor **starts in the outgoing window** — decision-0775 — so the
address the roster's first data row already holds is the successor's too. It
reads the handover, rewrites the roster, answers the `unanswered:` Session
events lines first, announces nothing, and deletes the handover file so a stale
one cannot start a false handover. A peer that sent into the gap re-sends at
its own next wake-up; in a handover-less gap that wake-up is the human's word
in its window or a line from the new Kanri.

**A topic's spec or plan stage takes the in-plan procedure and the
between-plans timing.** Two rules used to pick which handover procedure follows
a "present" verdict — one keyed on whether a batch is in flight, the other on
whether a ledger is open — and they disagreed exactly in the case the ceiling
signal makes real: a topic open and a ledger open, but no batch dispatched yet.
The single rule is **whether a ledger is open**: with one open, the in-plan
procedure runs, because the ledger is the state a successor inherits and it
exists before the first batch does. *When* Kanri checks is the other half, and
there the spec/plan stage counts as **between plans** — the check falls at the
start of every turn rather than at loop step 6, which is what Timing's own
boundary list admits. One rule for which procedure, the other for when; they
are not in competition because they answer different questions. This resolves
gap 2 of issue-1a9a.

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
yet named safe for a replacement. The handover proceeds when due —
decision-de63 makes it mandatory at a boundary — and the successor takes the
authority ruling from the handover file's "Rulings the next batch inherits"
rather than from the tree.

The rule is the 2026-09-07 handover's own ruling, generalized. That handover ran
mid-plan rather than after the merge decision, on a compaction noticed on the
session's second day; it waited for the session's own background agent to return
before writing the file, and the successor's Handover case then ran as
specified, with the human deleting the old session afterwards. The numbers are
in `docs/reports/2026-09-07-kanri-lifecycle-dogfood.md`.

**Sekkei's and Keikaku's away-from-boundary escapes are symmetric**, and both
generalize to any session-level cause: a role that is not at a boundary when
its exit shoroku would be due says so and continues, whatever the cause — the
human not wanting the plan now, a decision still open, a peer's work not
landed. The generality is the rule; the specific cause is never the test. They
were not symmetric at first only because the plan that landed them wrote the
two roles' bullets in independent passages, and Keikaku's named one cause where
Sekkei's named the class.

**"Waiting for nothing but its deletion" lives with the Live peers, and
nowhere else.** The rule has one site by design: the handover's Live peers
listing, which is where a successor reads what each peer is doing and therefore
the only place the distinction changes an action. A second copy was drafted
beside the five exit cases and deliberately not landed, because the cases
enumerate *when* a session exits and this is a fact about a session's state
after its exit lines are answered. A later reader who finds it absent from the
five cases should not restore it there. The nearby disagreement between
`templates/handover.md`'s Live peers placement and `roles/kanri.md`'s
(issue-f5d8) is a separate matter and is not resolved by this.

## The shared checkout, and when a queued topic may commit

Serves exp-38e5.

A second topic may open once every open topic has passed its spec stage, and
its Sekkei and Keikaku write documents anywhere; what they cannot do is commit
into the one checkout another topic's implementation holds. The release
condition is the occupying topic's **plan closing** — not "a Jisso takes the
tree". The two readings are opposites: once a Jisso is running that topic's
batches the shared tree is occupied *more* exclusively, not freed, and no other
topic's Keikaku can commit until that whole plan closes. Measured across at
least three topics, the standing ruling for a queued topic was phrased the
wrong way round ("the plan lands and a Jisso takes the tree, or Keikaku hands
the draft to a fresh commit"), and one tenure had to write the correction as an
explicit amendment for its own Keikaku, because the inherited wording read as
permission to commit the instant the occupying topic's first batch began. The
queued Keikaku therefore parks its draft as a `spec-draft.md` under its own
topic directory and takes it to its final path when Kanri says the checkout is
free.

## Bug intake

Serves exp-1c02, exp-1c7a.

The rule that nothing tracked names another repository (exp-1c02) is not
tidiness: it was measured. Before it, thirty tracked files and eight commit
subjects carried a sibling repository's name or the user's home path, traced to
the report template's own fields and to one sentence of the hotfix lane. The
template drops the identifying fields at the source and the tracked-write rule
stands behind it as the second defence, because a rule alone leans on every
later writer's compliance.

The intake is the cheapest seat that is live, and the reason is that **an
intake's cost is the receiving session's context re-read, not the act** — the
act is one line and reads nothing of the report, so what a report costs is
whatever the woken session has to re-read to answer it (exp-06b2). That is why
the intake moves to the seat with the smallest context rather than to the seat
with the least to do.

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
ledger so they reach the documents once. While a plan that lists every file of
`skills/tanto/` in its file structure is in flight — the tanto-workspace plan
of 2026-09-12 is one — the lane is closed for the whole skill, and a report
against it takes the issue outcome or the whole-branch review's fix wave; that
plan is also the one that makes bug reports easier to deliver.

**The intake address became readable rather than relayed.** A reporter that
knows the target repository's path reads the intake's bare name from the first
data row of that repository's `.tanto/roster.md` — Kanri's row by construction,
since the roster is written with it first — and checks the name against
`ListAgents` before sending. The human's residual job shrinks from "tell the
reporter Kanri's name", which only the human could know, to "tell the reporter
which repository", which the reporter often knows already. The failure path is
named rather than hidden: a resumed Kanri has a new name and its row is
rewritten only when it notices, so a name absent from `ListAgents` sends the
reporter back to the human, which is the route that existed before. The
alternative, a per-user registry file, was not built — it adds a second address
book beside the roster and a second staleness rule, and it remains the live
option if the human's remaining step is ever worth removing too.

**An interim ruling over this route fixes a line's form, not only its outcome
word** (exp-06b2). The 2026-09-15 interim protocol named the outcomes and left
the reply's shape open, and the inbox's Reference lines came back in at least
four shapes — `issue-<id>`, a `docs/issues/open/<id>-…` path, a bare id, and
prose — so the retrofit that read them could only look for the `issue-<id>`
token. The template that replaced the ruling lists the five references
literally. A ruling that expects to be read by a script later states the form
it expects.

**A new intake line is a sentence, not a route.** The intake had no rule for
a line it did not know: every site keyed on the literal `bug-report:`, and
nothing said what to do with anything else. The tanto-feedback design added
three lines (decision-73cc, decision-de65) by naming each in one sentence of
`SKILL.md` beside the first, with the same act — one copy, one `received:`,
nothing read — rather than by a new route; a fifth line would be added the
same way (exp-09c2).

**A delivered feedback file is guarded at both ends** (exp-09c2). A re-run of
`close` after its file was delivered — a Hosa's chore for a closed topic, or
a successor running `close` again from the handover — must not overwrite the
triaged copy in the receiving inbox. `usage.js close` allocates a new stem
when the file it placed has reached the receiving inbox, and the intake
leaves a copy that is already there as it is and names it in its reply. Each
half alone was weighed and rejected: guarding at the intake alone leaves the
sender's file mis-dated and its new Items undelivered; a new stem in `close`
alone leaves a re-run after delivery free to clobber. The intake's half is
the last line of defense.

## Human access

Serves exp-26d5.

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

**The review brief** is dispatched by the document's own author — Sekkei for
the spec, Keikaku for the plan — never by Kanri; this amends decision-ace0's
dispatcher clause, since the third-party property the design wants comes from
the subagent's own context isolation, not from whose hand does the
dispatching. On the document's own review gate the author dispatches a
**read-only** subagent on `brief.write` with five inputs: the document's path;
what to read beside it (for a spec, `spec-inputs.md` and `dialogue.md`; for a
plan, the spec); the output path, `review-brief-spec.md` or
`review-brief-plan.md`; the template; and the chat's language, which is the
language of the human's own messages. The writer writes the brief file and
nothing else, so it takes no commit slot and disturbs no implementer.

The author then checks the brief's **form**, never its content: eight
headings — the title, the how-to-answer section, the five numbered sections,
and the unsettled section — present and in that order, the headings
themselves in the chat's language; every point opening with one of the four
tags, and every unsettled line saying whether an answer is needed; every point
in its three parts, the two before `See:` and the pointer after it, which may
itself carry the ` — ` separator as a plan's task headings do; and every
pointer the document's own heading text, verbatim and untranslated.
`grep '^#'` on the document for its headings is the **whole** read the author
makes — reading its prose would be the pre-read the design rejects. A failing
form is dispatched once more; a second failure is sent as it stands with one
line to the human. The author never edits the brief.

The author then sends Kanri one line, `review-ready: <document path>;
brief: <brief path>`, which waits for nothing: Kanri records it in the
ledger's Session events and does nothing else — no reply, no
idle-until-brief wait, and no copy of the brief in Kanri's own context. This
removed two message hops and the resident-context copy the earlier design
paid for at every review; the handover concern the earlier design carried (a
writer still running when a handover is written, listed under In flight) now
belongs to whichever session is the document's own author, not to Kanri. A
point that misreads the document is caught by the human's answer or by Kanri's
cold read after the commit. The one-line-per-point shape also catches a wrong
claim that a multi-bullet design section's `OK` passes: on 2026-09-11 an
assertion inherited from an issue body reached the gate unchecked inside a
section the human had accepted whole, and the brief's own decide point on it
drew the correction. decision-ace0 holds the reasoning and the alternatives
that were rejected.

**A decision the human makes between `review-ready:` and `brief:` is invisible
to the writer by construction**, because the writer reads `dialogue.md` and that
window is not yet in it. It happened once, on 2026-09-13: the human decided in
Kanri's window that a second Sekkei on `opus` would write the plan, after
`review-ready:` had been sent and before `brief:` arrived, so the brief's point
1.2 asked a question already answered. The cost was one sentence of explanation
before the brief, and no rule is needed — but the habit that avoids it is to
note such a decision before the brief is put to the human, and to ask for a new
brief only when it changes a judgment point.

**A `decide` point may close by its own default, and that is the design
working.** The plan brief of the tanto-cost run carried two: the human answered
one and left the other untouched, so its `— If unanswered:` clause decided it —
the first time in this repository a `decide` has closed by default rather than
by an answer. The clause is a decision mechanism, not a fallback for an
unanswered question.

## The batch contracts

Serves no expectation; internal shape.

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
results, the mandatory shoroku proposal items, a section for Kanri with the rulings
it needs and what to verify in the tree, the questions for the human, and one
line on what comes next. Kanri reads four of those sections first, and the batch
prompt names which four. The questions section is the only one written in the
human's chat language.

**When a plan-mandated finding is fixed now, and when it is parked.** Fix it
in the batch only when the change is both mechanically verifiable against
downstream code the executor has already read and confined to prose or test
assertions rather than to runtime behavior; a finding in production code that
carries an architectural trade-off — an event-loop serialization assumption,
an error-handling contract — is parked for the fix wave, which judges it once
against the whole branch instead of rippling a mid-batch patch into the
measurements the later batches take (exp-06b2).

## The Kaiseki branch and standalone mode

Serves exp-178d.

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
shoroku proposal item Kaiseki writes out itself at its exit.

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

Serves exp-37ce, exp-27e8.

After the last implementation batch is accepted, **Kanri** dispatches the
whole-branch review — not Jisso — so the executor never commissions its own
final review. The reviewer gets a review package over the merge base and a
pointer to the parked findings and deferred minors, and it is asked for a
Shoroku proposal section like every other report.

Its findings become one more batch prompt. Jisso dispatches **one** fix subagent
with the complete findings list, runs **exactly one** scoped re-review of the fix
wave, adjudicates residuals in the SDD ledger, and reports. There is no second
fix wave; residual load-bearing findings reach the human through Kanri's merge
question.

A ruling that hands a fix to the fix wave names the fix's **mechanism**, not
only its outcome, whenever the fix is itself an identity or a race question: a
ruling that asked for a `seats.json` entry "newer than the handover file's
mtime" was implemented against the file's own mtime rather than per row, and
inverted the behavior it was written to produce.

**Why the step earns its seat after every per-batch check has passed clean.** A
check that reruns the derivation the drafting itself used re-derives the
drafting's error; it does not catch it. Measured on `bug-report-hold`: the
plan's own disposition for one needle misread a shipped phrase before any text
landed; the dogfood report, written after all four sites had landed,
independently re-derived the same misreading from the live tree and found a
plausible-looking extra site that made the claim look *more* corroborated; and
the batch's own Shoroku proposal then carried it forward as a proposed fix for
the close. Three authors, three independent checks, one shared wrong premise,
each pass reinforcing it rather than testing it. What caught it was the
whole-branch review's plain re-read of the cited paragraph — no script, no
re-derivation. Independent re-derivation compounds an error rather than
correcting it, which is the failure mode a final reading seat is positioned
against, and the reason per-task and per-batch review alone was judged
insufficient (exp-06b2).

## What the executor's loop assumes

Serves exp-173f.

Three properties the SDD fix loop rests on, each measured in
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

**A controller's ruling is handed to the review seat to judge, not to accept.**
When Jisso rules on a conflict between the plan and the tree, the dispatch that
follows states the ruling, the measurement behind it, and — in as many words —
that disagreement is in scope and will not be treated as out of bounds. The two
alternatives are both worse: ruling silently spends a review seat rediscovering
a question already answered, and telling the reviewer not to flag the point is
pre-judging, which the reviewer's own template forbids the dispatcher from
doing. Measured three times in the tanto-workspace run — two task reviews and
the fix wave's re-review — each reviewer agreed with the ruling independently,
and one weighed three alternatives before doing so, which is evidence the seat
was genuinely free to disagree rather than merely told it was.

**A dependent task is dispatched against the file as committed, not against
the plan's text.** Whenever an earlier task's fix round diverges a file from
its own plan-mandated block, the very next task that depends on that file
carries, in as many words, the instruction to satisfy it as committed on disk
rather than as the plan's now-stale text.

**A task whose implementer must be the controlling session is still reviewed
twice.** A measurement task whose defining act needs the controller's own
identity — a `SendMessage` whose reply routes to the sender, a reboot the
controlling session carries across — cannot be delegated to a subagent, so
the executor performs it itself. The Model Selection table's premise that the
implementer is always a dispatched subagent has this one exception, and it is
an exception in the implementer alone: the record the task produces goes to
the two review seats exactly as a subagent's diff would, which is what caught
the gaps the executor's own first draft did not see.

## Shoroku staging, session exits, and the adoption rule

Serves exp-37ce, exp-27e8.

**The write-out into this document system happens once per topic, at its
close** — decision-7e0d. The stage keeps the word `t2`. Every other moment of
a run — a spec accepted, a plan landed, a session's exit, a batch boundary, a
review, a Kaiseki report — produces proposal items and nothing else. T0 and T1 no
longer exist: the input document's decided items become ADRs at the topic's own
close, and the experience and issues the spec produced land there too.

**The four steps are Propose, Recommend, Check and Apply**, a seat's section is
a "Shoroku proposal" and the ledger's and roster's two tables are "Shoroku
proposal items" — decision-2db1. The word "candidate" is retired throughout the
skill, because a heading is a machine pointer here and two words for one thing
is a silent miss rather than a matter of style; renaming the steps and leaving
the headings was weighed and rejected for exactly that reason.

A proposal item is recorded as a `pending` row of the conductor ledger's `S-n`
table, and **the row is a pointer, not the item**: one line whose Source
column names the file the item lives in and the item within it — a
report's path and item number, an exit proposal's path and number, a spec's
path and section heading. Nothing is quoted into the ledger, so recording an
item costs the recording session one line.

**The rows are what carry a seat's lineage** — decision-c787. With one Jisso
per batch, a topic's implementation seat is a succession of sessions rather
than one, and the `pending` rows are how their items reach the single close:
no proposal file rolls from seat to seat and none is renamed at the close.
Each retiring Jisso's own exit shoroku is the **Shoroku proposal section of its
batch report** — decision-d125 — so a batch boundary creates no file of its
own, and the form check the boundary already runs covers the exit.

The close runs the four steps of decision-ce83 once. The last Jisso **writes**
`.tanto/<topic>/shoroku-proposal.md` — the `pending` rows listed by number
without re-quotation, plus what its own context holds that no file does — and
idles; Kanri checks the proposal's form and releases the seat at once. Dropping
the T2 proposal too, and naming the SDD ledger as a source in its place, is a
real option parked for a stated reason as issue-915a.

**`release:` follows the form check directly, at every seat** —
decision-0ea5. Nothing runs at an exit that a session could be asked back for,
so the recommender is never placed before the release; a recommender that finds
an item unclear resolves it from the sources the row points at.
The proposal is a **pointer list plus the delta** rather than a re-quotation
because the re-quotation would run through Jisso's context, which is exactly
what the writer/applier split exists to avoid. Then one **recommend**: the
`shoroku.recommend` kind over Jisso's proposal and every source the `pending`
rows name, with `docs/` as the baseline, writing the recommendation and the
check brief. One **check**: the brief, verbatim, answered by exception — or by
a Kikaku decision file whose third section names the recommendation and answers
it, which is that stage's Check answer (decision-9cc5). One **apply**: the
`shoroku.apply` kind, on the topic's branch, before the merge decision.
Adoption is therefore a recommendation the human checks rather than a ruling
Kanri makes as their delegate — the amendment to decision-1f5f, which holds the
original reasoning and the alternatives.

**Steps 2 to 4 are a live Hosa's** — decision-a1ae. Kanri delegates them with
one `close:` line naming the proposal, the ledger, the recommendation, the
brief, the direction file, the commit subject, and the slot, and is then free
to hand over: the human's check has unbounded latency, and paying for it out of
Kanri's tenure and context is what this delegation removes. Hosa pastes the
brief in its own window under the chores grant it already holds, writes the
direction file, dispatches the apply, and answers `close done:` or
`close blocked:`. Kanri, or the successor it handed over to meanwhile, verifies
the commit and fills the ledger's Adopted and Written columns. With no Hosa
live, Kanri runs the three steps itself, and its close line suggests opening
one.

**Kanri's own in-plan exit writes rows, not a stage.** While any ledger is
open, Kanri writes its proposal from the ledger and the roster and records its
items as `pending` rows in **one** ledger — the in-flight topic's, else the
oldest open one — and hands over; the rows wait for that topic's close. An item
that plainly belongs to another open topic is still recorded there and named
`<topic> S-n` from the other, as the ledger rule already allows. The rows are
not split by topic at the exit, because the outgoing Kanri is the seat least
able to afford the read that splitting them would take.

**There is no between-plans write-out** — decision-5ec7, amending
decision-b6cb. Kanri's proposal is written at every plan close, before the
recommender runs, and that is the only occasion on which its items leave the
ledger. The between-plans lane the `shoroku-at-close` design carried is gone,
because it was a second human check per close against the one-check-per-topic
rule of decision-7e0d. A Kanri that retires with no ledger open leaves its rows
for the next topic's close.

**A topic the human ends before its final batch closes the same way**: Kanri
runs the close over what is on disk, writing the T2 proposal in Jisso's
absence, and the apply lands on the topic's branch whether or not the merge
decision takes that branch.

The check arrives in the chat's language at the check step, and the reason it
had to is a fact about the text rather than about the checker: the measured
cost was the protocol text itself, so a later reader must not try to make a
slow check faster by giving the checking session a stronger model. What is
being checked serves two readers at once — the apply subagent, which quotes the
recommendation in full and needs it in the repository's language, and the
human, who only has to decide — which is the same reader/input split the review
brief already makes. That split is now built: the recommendation is the apply's
input and the check brief is the human's, written from the same judgment in the
same run.

**Cost accepted.** `docs/` reflects a topic's experience, ADRs, and issues
only at its close. A concurrent topic's Sekkei reads the spec on the branch, or
the Kikaku decision file its orders line names, for what `docs/` does not yet
hold.

**The writer of a write-out is a dispatched subagent, not the session that
raised the items.** No session applies the accepted subset of its own
proposal, at any stage or at any exit. Two things follow: a session is
**releasable as soon as its proposal is on disk**, which is what lets an exit
stop waiting for its own write-out; and the clerical work of applying
frontmatter rules never runs on a resident context of the strongest family,
which is the cost this shape exists to avoid.

**A T2 proposal that classifies an item against an existing open issue is
a claim to verify, not to accept on its framing.** Measured on 2026-09-12: the
executor proposed appending a finding to an existing issue and flagged its own
uncertainty; Kanri read that issue's actual body — not only the proposal's
one-line description of it — and directed a new issue instead, because the
two problems shared a surface but differed in the moment they arise and the
shape of their fix. The executor's uncertainty was the signal to read the
source rather than rule from the proposal alone.

**Every planned session exit carries its own shoroku** — decision-d831 — using
that same split for the roles that cannot reach the human, and Kanri's direct
ruling on itself for its own exit. The proposal and direction files are named
after the role and its occasion, they live where the role's other files live, and
the write-out commit's subject carries a fixed prefix so the whole-branch review
package can exclude exactly those commits. A session that does not answer its
exit lines before its idle notice is treated as a forced exit, and the roster's
events say what was lost.

**A seat's closing line is two facts and a negative rule** — decision-2497,
which closes issue-f293's cause. The line names where the seat's work landed
and which step of the contract, if any, still runs through it, and states no
opinion of the seat's own necessity. It is written from an English form and
rendered in the chat's language, which is the same reader/input split the
review brief makes: the form is what the skill pins and checks, the rendering
is what the human reads.

**The second check this design removes is the close's and the between-plans
one, not the in-plan handover's.** The measured wait the decision file cites —
4 to 128 minutes for a seat held for a document check — was already solved for
the in-plan handover case by `shoroku-at-close`, before this topic opened. What
this topic removes is the remaining two. The attribution matters because a later
reader comparing the before and after figures would otherwise credit one topic
with the whole of a gain that two produced.

**A close no longer carries Residency rows into a tracked report**
(exp-09c2) — decision-73cc's by-actor axis, decision-32e5's measurement. The
skill had told a close to append the run's Residency rows to a tracked report, which is
the class of record the axis rejects: no document cites a raw row, and the
reader that acts on a run's cost is the skill's measurement, not the
repository's `docs/`. The instruction predated the axis, and the
measurement from transcripts supersedes it in practice.

## Deviations from the composed skills

Serves no expectation; internal shape.

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

Serves exp-173f.

`<plan-basename>` is the single notation for the plan's workspace directory;
`<plan>` was retired from the skill's prose because it was never defined and
read as a path to the plan file.

The word **"candidate" was retired the same way** — decision-2db1. A seat's
section is a "Shoroku proposal", the ledger's and the roster's tables are
"Shoroku proposal items", and the four steps are Propose, Recommend, Check and
Apply. The sweep covered the whole skill rather than the step names alone,
because these headings are what a `sections` call matches on, so a second
spelling left anywhere reads as an absent section rather than as a style
inconsistency. Ledgers written before the rename keep the old word in their own
rows.

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

Serves exp-26d5.

A plan for this protocol carries, beyond the usual conventions, a Batches
section of three or four tasks each with the stop conditions at every boundary,
the Global Constraints the batch prompts are built from, and a statement of how
a batch is verified. The report and prompt skeletons are not in the plan: the
plan says they follow the skill's templates and names nothing else.

A plan that carries **complete file contents in fenced blocks** turns each task
into transcription plus verification, and lets a reviewer check plan alignment
by extracting the blocks and diffing rather than by judgment.

**Parallel drafters share one working tree, and the fan-out needs a stated
rule.** Twelve drafters wrote the tanto-cost plan at once, and two collided:
one overwrote another's scratch file mid-validation, and one wrote 959 lines of
a `docs/notes/` file over `skills/tanto/SKILL.md` — the live skill every session
of that run reads. It surfaced only because a third drafter reported that its
checks had to run against the `HEAD` blob; `git checkout --` restored the file
and every affected count was re-measured against the restored tree. The rule the
shape needs: a drafter writes its own output path and its own scratch directory
and nothing else, and the author verifies `git status` before assembling.

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
  obligations, so the review still has to run. Measured yield on 2026-09-11
  (tanto-workspace): four additions from Kanri's reading of its own passages,
  and three passages Jisso found in its role file that the spec had missed —
  in a file with zero spellings of the path being changed, because the
  entity, "the workspace", was named by no path at all (issue-10bc's lesson
  in a new form).
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

The context-cost run added seven more, all of them found by a reviewer or a
boundary rather than by the plan's own instruments.

- **An anchor check inverts only when the new passage wholly supersedes the
  needle.** When the needle is the passage's *unchanged opening* it still
  returns `1` after a correct edit — 15 of 32 invert in one plan, 31 of 66
  across another — so every anchor step states the value it returns
  afterwards, and a boundary that re-runs the blocks mechanically reads the
  non-inverting half as a failure without it.
- **An explicit "Old passage — replace exactly these N lines" block is what
  makes reconstruct-and-compare a real check.** A 73-passage plan was
  replayable end to end by an independent seat because 44 of its passages
  carried one, each matching exactly once, with the needle in a quoted
  heredoc.
- **The reconstruct-and-compare harness must be durable, not session-local.**
  design-4807 already called that check "cheap enough to schedule by name" and
  no plan schedules it; the context-cost run found the sharper problem — the
  dry run's application script lived in the drafting session's scratchpad and
  was gone by the final boundary, the one that most needs it. The boundary
  used a cheaper form instead, which needs no edit engine: **every changed
  line of the merge-base diff must be text the plan literally quotes** (443
  added lines, 0 unaccounted, across thirteen files). Its one caveat is that a
  plan states some replacements in prose rather than in a fence, so three
  removals were accounted for by prose and a fence-only reconstruction must
  expect them.
- **`diff` is unscoped by path, so its base is the plan's, not the branch's.**
  The instrument runs `git diff <base>` with no pathspec and exempts only the
  paths a plan declares `created:` plus the plan's own file, so every added line
  of every commit after the base is its subject — including commits no task of
  the plan wrote. On a branch that already carries a spec commit and an exit
  shoroku, the merge base therefore reports those commits' lines as unaccounted
  at every boundary. The base that works is **the parent of the plan's own first
  commit**, derived rather than written down — a hash in tracked content goes
  stale at the first rebase — and derivable only because no earlier commit
  touches the plan's subject directory. Kanri records the resolved value at the
  first boundary and every later prompt carries it; a re-derivation that yields
  a different hash, or nothing, is a stop rather than a recompute, because a
  base that moves silently turns the check into one that passes for the wrong
  reason.
- **The `created:` route was weighed for this and rejected.** Declaring the
  spec's path and the known shoroku paths as `created:` would let `diff` keep
  the merge base and shrink the hand-triage to the paths nobody can name in
  advance. It is the wrong trade: `created:` exempts a **path**, so it exempts
  every change to that path — including one the plan should have caught — and a
  shoroku commit's paths are chosen at the moment it is written, so an exemption
  list that is right at the landing is wrong at the close. A triage rule stated
  once and applied by eye is weaker per line but does not go quietly wrong.
- **A "where each change lives" table drifts in both directions, and a sweep
  catches only one.** It lists the passage that *defines* a line and misses
  the passages that *quote* it — six of nine misses in one spec, nine found by
  the review — which a whole-tree sweep does catch. It does not catch the
  other direction: **old prose that a new term contradicts**. A sweep for
  introduced terms is not a sweep for contradicted ones, and the one instance
  in this run (a column list enumerated without the column the new resume
  protocol keys on) was found by a task reviewer and by nothing else. Write
  the sweep terms first and the table from them.
- **An absence sweep must state its scope, and scope it to the tree it asserts
  about.** A sweep written over `skills docs` to prove a superseded string is
  gone collides with the write-out the same plan produces: a topic's close
  writes ADRs and design records that *necessarily quote the text
  they supersede*, so the check goes red on a clean tree by construction.
- **A plan's count prose is not a checksum.** Six count defects landed across
  one plan — a step's expected counts, four "the N that follow" leads, a
  baseline off by one, and two in a sweep narrative — and a dry run that
  applied 72 of 72 passages caught none of them, because it applies blocks and
  runs commands and does not audit prose *about* them. Counts no command
  consumes are unverified text, and a sweep narrative that states counts ages
  faster than the sweep.
- **A pre-edit anchor sweep over the whole plan, before task 1, is cheap and
  load-bearing.** 64 blocks at one batch and 31 at the next, all matching: it
  converts the plan's "measured" claims from an assumption about authoring
  time into a measurement at execution time, for one command. It is the dry
  run's complement — the dry run proves the edits apply, this proves the tree
  has not moved under them.

The tanto-sweep run of 2026-09-10 added the rest of this document's plan
conventions, drawn from every phase of the plan: the spec review, two plan
reviews, the spec dialogue's own candidates, Sekkei's human-contact lines,
four batch reports, and the whole-branch review that closed it. Two are about
where a passage plan's defects actually sit.

- **The verbatim passages are the part that does not fail; the prose around
  them is where every defect lives.** Across that run's plan phase the 38
  passages and 8 anchor steps were checked by six independent parsers over four
  rounds of edits and never once failed — every old passage resolved its stated
  number of times, every declared count matched its block, every anchor returned
  its stated value. Every defect of the phase was outside the blocks: in a lead
  line's count, a needle, an expectation's prose, a test's assertion, an
  interface sentence, a heading's uniqueness, a trailing blank line. That is the
  case for keeping the old and new passages verbatim and once, and it predicts
  where the next run's defects will be, which is the more useful half.
- **When a fix to runtime text cannot be run, say which test you could not
  perform**, and treat the choice as provisional until a seat that can run it
  does. In that run a shell variable for the skill's own directory was set aside
  as over-engineering in favour of a bare skill-relative path; the bare path
  dropped the interpreter along with the repository prefix, and five passages
  went on to order a shebang-less file to run itself. The rejection was made on
  the shape of the fix rather than on whether the result ran, which is a taste
  judgment substituted for a test and not declared as one.

The rest, roughly in the order the run produced them:

- **Write the `O` needles from the entities changed, then sweep the files the
  plan does not touch, first.** All three old-value misses of the tanto-sweep
  spec review sat in files the plan carried no passage for — the operational
  form of the context-cost run's "drifts in both directions" finding, above: a
  sweep that only reads touched files cannot see the direction it never looked
  at.
- **A document that defines a machine grammar should be parseable by the
  parser it defines.** The spec's own passage ids must obey the id grammar it
  states once, rather than being exempt from the rule they introduce.
- **An anchor needle never contains a backtick.** Nested backticks render as
  fragments and silently dropped one anchor from the spec review's own parse;
  pick a backtick-free substring, or `grep -cF` a plain fragment instead of the
  marked-up line.
- **A dialogue turn that reverses a decision lists the earlier `D-n` answers
  it invalidates** — the mirror of the rule recorded above (`What makes a
  convention bind`) that a decision reaches `dialogue.md` before it reaches
  any document. D-11 overturned D-9's Python premise but left D-9 itself
  quotable, and the Node floor that `mise` later restored did so by a route
  the dialogue never recorded as a reversal; an overturning turn that skips
  the back-reference leaves a later reader unable to tell which turns are
  still live.
- **A dry-run "artifact" ruling is checkable only when it enumerates the
  differing ids and accounts for each exactly once.** Two of three such
  rulings on the tanto-sweep plan named items that had not in fact differed,
  and the two that had — T14S1, T14S2 — went un-adjudicated; a ruling that
  just says "artifact" is unfalsifiable.
- **When one commit edits both the spec and the plan, diff the shared blocks;
  do not assert them equal.** "38 passages byte for byte" held for 37 of
  them — the one that diverged was the block the same commit had edited on
  the spec side.
- **A grammar a document both describes and instantiates states which of its
  own conventions the parser is bound by, and an anchored match is what a
  global replacement means.** 79 of the tanto-sweep plan's 80 command blocks
  used four backticks while the instrument's only extraction fixture used
  three — a fence-width convention the parser silently was not bound by; and
  unanchored, `P12.4`'s old line still read `4` after a correct edit because
  the new line extended the old, so a global block's verification anchors, or
  a partial replacement is invisible to it.
- **An anchor step at `before: 1, after: 1` proves only that the anchor was
  not deleted.** Placement needs a `grep -n` pair with a stated offset, and
  `+1` holds only when the needle is the anchor block's last line — which the
  grammar does not guarantee. Beside the rule above that a checklist item is
  worth its line only if it can fail.
- **An insert passage states which end carries the blank line** — `insert
  after` opens with the separator its destination needs, `insert before`
  closes with it — because none of the grammar, the anchors, or the greps can
  see a missing trailing blank line on their own: `P-J2`'s went unnoticed
  through four passes and surfaced only once the applied tree was linted.
- **A specification section added late must be wired into the step that
  implements it.** When a spec grows a section, the audit is "which step now
  has two sources of truth", not "is the new text correct".
- **A crude comparison and a non-zero exit are incompatible design choices
  for an instrument's contract**: either a check decides or it reports, and
  the exit-code table is where the choice shows — and the row that gets
  forgotten, in `replay`'s case.
- **A plan that records a measurement of the world outside it ages the
  moment the world moves, and a gate must read zero on today's tree before
  it is trusted** — you have to run it to find out. The fix for the first is
  to name who measures it and when, rather than keep the number fresh in a
  document that outlives the date (Kanri, at the batch A prompt, for this
  run); the second is the mirror of the absence rule already stated above —
  a word-list gate that matched the exclude patterns and was open before the
  thing it gates existed proved only that nobody had run it, and a presence
  check is worth its line only if it reads empty before the thing it checks
  for arrives.
- **A skill may assume its host's runtime, and only its host's runtime.**
  superpowers ships `.js` and `.sh` payload, invokes bare `node`, and carries
  no `package.json`; the question to check is which runtime the host
  guarantees, not which language best suits the task. (A Python-with-`uv`
  alternative for the plan's own instrument was considered and reversed
  during the spec dialogue, D-2/D-7/D-11.)
- **This repository's line endings are, at the time of writing, uniform
  rather than mixed file by file** — `i/lf w/crlf` for every Markdown file,
  `eol=lf` pinned for the JS family since the Biome commit — which updates
  the "mixed file by file" premise stated above; the instrument still must
  not assume uniformity, since the premise is a fact about this tree's
  history and not a property the grammar guarantees.
- **An instrument is worth building before it is specified.** A thirty-line
  pre-flight, written before the spec review, found all five count defects
  among the tanto-sweep spec's 22 hand-written leads — the same off-by-one
  shape as the context-cost run's six — and writing blocks under a checker
  prevents defects rather than catching them after. Third instance of the
  premise behind issue-88d3 and issue-7481.
- **A document that specifies a grammar contains text shaped like it, and a
  self-describing plan needs its parser to know use from mention**: a lead
  inside a fenced block is text, a `<...>` placeholder is documentation, and
  a lead resolves only inside a task body.
- **Write one needle per changed entity, before the passages are drafted, not
  after.** The tanto-sweep spec's own instrument failed against its own spec
  twice on needles written from the terms the plan changes rather than from
  the entity spelled every way the tree spells it; the role whose procedure a
  passage rewrites detects this class better than the author's own sweep,
  which is why the role-check now runs before the spec review, not instead of
  it.
- **An `O` needle must span the point where the text changes.** Where a
  change inserts, the needle straddles the insertion point; where it
  replaces, the needle is text the replacement does not reproduce. This is
  mechanical — `lint` searches the plan's new-passage text for every needle
  — and found exactly the two dead needles the dry run had already found by
  hand.
- **The floor is declared twice once `.mise.toml` exists, and it should not
  be**: the file says `node = "22"` and the plan's own command says `mise x
  node@22`, the version-pin instance of "one block cited, not two copies"
  above. The command should read `mise x -- node --test skills/tanto/scripts/`
  so the file stays the single declaration — not edited into the gated plan,
  but for the next plan's conventions and for the verification bullet the
  next time it changes.
- **A plan's verbatim-mandated test can contradict the plan's own prose, and
  the test wins by default because it is the executable one.** The
  residual-`O` heading's noun disagreed with the test file the same plan
  mandated verbatim — a hazard worth naming beside the block grammar wherever
  a plan writes test files into itself.
- **A plan may knowingly break a structural count mid-run, if the batch that
  breaks it says so** — `docs/notes/tanto-consistency-checks.md`'s own
  provision for a count that goes stale by construction, used for the first
  time on the tanto-sweep plan's batch A, and it held exactly as written.
- **A session's permission settings can refuse a directed step the human
  approved in another window, and that refusal is correctly reported rather
  than routed around.** A batch prompt directing a recursive deletion was
  blocked by Jisso's own settings; its "if it fails, say so" clause is what
  kept the batch from stalling. Beside decision-2f36's stop classes: a
  directed step a session's settings block is reported, and Kanri does not
  take it up in its own session either.
- **A branch claim in runtime text is checked against the step's position in
  the procedure, not read on its own.** The spec's `P-K10` wrote that a
  commit "lands on the plan's branch" for a step that in fact runs after the
  merge decision is executed, so the claim contradicted the close's own
  ordering — caught by Jisso reading three passages of one file against each
  other, not by any parser. `P-K10`'s wording is superseded by the fix wave's
  form of the same passage.
- **A plan that builds a checker carries one late task whose Verify step is
  the checker run against the plan's own earlier tasks.** The tanto-sweep
  plan's instrument was never run against the plan that built it, and the
  first real `verify` failed — a false `passage-repeated` at task 12 —
  because batch D, the opportunity to run it, used hand-written greps
  instead. The fix wave's task 16 step 6 is that run; the human declined an
  ADR for the rule (2026-09-10), so it stands as a plan convention here.
- **`verifyTask`'s expected count is the post-replay invariant because it
  reuses `replayPlan`'s own formula** — the sum of declared occurrence counts
  per identical new text and path — stated as the reason the two agree, not
  as a coincidence that happens to hold.
- **A fix wave gets the plan's instrument by being written in the plan's own
  block grammar.** The tanto-sweep fix wave was checked before dispatch
  (`lint` caught a false citation, `replay` a partial anchor) and after
  landing (`verify` clean, `diff` clean) — the first fix wave of the run
  whose Verify step was the instrument itself, and the measured answer to
  issue-96f2.

Jisso's own dispatches to its fix subagents carry a matching set of
conventions, measured during the same run:

- **A controller's fix instruction is a hypothesis, not an order: the
  dispatch says test this, and report if it is wrong, rather than asking the
  implementer to comply as given.** An `execSync` `stdio` instruction meant to
  capture stderr would in fact have discarded it — `execSync` returns stdout
  only, whatever the `stdio` array says — and the implementer tested it,
  reported that it did not work, and substituted `spawnSync`. A dispatch to
  confirm the suite was green at 62 measured 61, because the fix had extended
  an existing test's assertion rather than added a new `test()` call, and the
  implementer reported the measured number rather than the expected one.
- **A dispatch states the rule and its source, not a consequence it has not
  measured.** One batch prompt fixed a task's block order correctly and added
  a reason of its own invention — that reversing it would land a blank line
  wrong — which a reviewer tested and found false: the blocks were
  commutative, byte-identical either way, and the reviewer spent effort
  disproving a claim nobody needed to make.
- **A completion notice is not evidence the work landed.** A task's fix round
  can end its turn mid-verification with correct, uncommitted work already in
  the tree; the notice alone reads as a finished handoff, and `git status`
  and `git log -1` are the cheap check that tells "done" from "stopped early"
  before a task is treated as reported.
- **A dispatch requires the trailer's prefix, `Co-Authored-By: Claude`, not
  its exact text** — the dispatch-level form of the per-commit trailer check
  already stated above. One dispatch quoted the trailer verbatim; the
  implementer's own session mandated a longer identity, committed the
  brief's text, and then amended to its own, disclosing the judgment call
  rather than hiding it. Two identities already satisfy `AGENTS.md`, which is
  exactly why the check is a prefix grep and not an equality test, and the
  dispatch should ask for only what the check tests.

The third passage plan — tanto-workspace, sixteen files and 71 passages — added
two more, and both are about how such a plan is **written** rather than how it
is checked:

- **A passage plan may be drafted by one drafter per destination file, in
  parallel, with Sekkei writing the frame and assembling.** The convention
  reads "dispatch a drafter", singular, and the plural is the shape that
  scales: five `subagents.drafter` dispatches at once, each given one file set,
  one line range of the spec, and one output file under the topic directory;
  Sekkei wrote the Global Constraints, the Batches section, the verification
  section, the boundary, the sweep task and the Self-Review, and concatenated
  the six task sections into the plan. `lint` was clean on the first assembly
  and `replay` exited 0 on the first run — no occurrence-count failure across
  the 71 passages, no anchor failure across the 16 anchors — and the five
  independently written sections needed no reconciliation. What makes that
  possible is not longer prompts but **one written conventions file every
  drafter reads**: the block grammar, the destination wrap column, the
  uniqueness check as a runnable command, the rule that a task carries no `O`
  block and no hand-written grep, the step skeleton, and the facts a drafter
  must not re-derive. The invariants go in that file; the prompts carry only
  what differs per file. One hazard comes with the shape: **after the plan
  commit the fragment files are dead.** The committed plan is the artifact, and
  every later edit — a review ruling, a cold-read answer — must be made there,
  so the fragments are either deleted or never re-assembled from.
- **A task's `Done when:` is a second copy of its steps' `Expected:`, and an
  edit to one silently falsifies the other.** The same structure as a hunk
  count's explanation: a second claim that can be wrong while the first is
  right. In this run a step was rewritten from a range-based sweep to an
  extraction of the plan's own new-passage text, its expected output changed
  from "nothing" to two numbers, and the gate below still said "prints
  nothing" — the plan review's only blocker. An author who edits a command
  re-reads the gate.

**A plan that edits the contract's own close carries an "old-text Kanri's
close" checklist from its first draft** (exp-06b2). The tanto-feedback plan's
cold read asked ten questions, all of one class: what a Kanri whose role text
predates the plan's last batch does at that plan's own close — the acts of
the new close its text cannot supply, an old-shape ledger meeting a new-text
Kanri, the boundary of the batch that retires its own brief's lines, the
first run's empty tracked file — and none was about a task's content. Such a
plan answers those questions in its Global Constraints before the cold read
asks them. issue-1298 is the different case of a consuming repository's
migration, not the run's own Kanri.

Three alternatives were weighed and rejected while these conventions were
derived, and the reasons are worth keeping. A **bounded** handover wait was
rejected because the harness gives no signal to bound it by, so a bound would be
a guess written as a rule. A **date prefix on the topic word** was rejected
because the spec, the plan, and the workspace already carry a date, so a dated
topic either doubles it in every file name or becomes the larger unification now
filed as issue-f2c4. And **whole-file blocks for a passage-shaped plan** were
rejected because they would have meant transcribing a 580-line file to change
seven places in it.

## What a measurement can settle, and what it cannot

Serves no expectation; internal shape.

The spec dialogue's judgment is the human's and the design is Sekkei's, and a
measurement is how Sekkei keeps a claim honest. The tanto-sweep dialogue of
2026-09-10 found the failure mode twice in one session, and both times the
measurement itself was accurate.

- Sekkei set out to measure which Python interpreters the machine carried. The
  human stopped it — 「いや、既存のインタプリタを調べても仕方ない。uv を使えば、
  任意のバージョンを指定して実行できるんだから、決めの問題だよ」, that measuring
  the interpreters already installed settles nothing, since `uv` runs any
  version on request, so the floor is a decision and not an observation. The
  reading would have been correct and irrelevant.
- Sekkei measured the installed plugin cache, found JavaScript skill payload,
  and read it as confirming that skills ship scripts — the premise it had
  offered for shipping Python. The human asked the question it had not:
  「それは、skill を動かす環境 (harness) が Node.js だからじゃない？」, whether
  that was so only because the environment the skill runs in is Node. The same
  measurement, asked the other question, reversed the language choice.

**A measurement answers the question it was given, so a measurement that
confirms a premise has said nothing about the premise.** Before measuring to
confirm, write down what result would change the answer; if none would, the
question is wrong and the reading is decoration. This sits beside the related
failure of recalling a fact about a different host — there the recollection was
wrong, here it was right and the question was not. The question form the
dialogue uses carries the same warning: in the `tanto-context-ceiling` dialogue
of 2026-09-14 the human's answer to Q1 was a protocol none of the three options
offered, and it became the design's center — so the options a dialogue puts are
a prompt, not a menu.

## What makes a convention bind

Serves exp-173f.

A run continues from what is on disk (exp-173f), rulings are recorded rather
than remembered, and this document is where the plan conventions accumulate.
The tanto-sweep run measured what actually makes one of them hold, and the
answer is not care.

In that run one Sekkei wrote three conventions and then broke all three, each
inside the document that states it, twice quoting a rule in the same paragraph
where it was broken:

| The rule, as written | Broken after writing it | Found by |
| --- | --- | --- |
| a decision reaches `dialogue.md` before the document | 2 | the spec review; Kanri's cold read |
| a count in prose is written only where a command consumes it | 4 | Sekkei's own pre-flight; the plan review; the dry run; a re-sync pass |
| an old-value needle must span the point where the text changes | 3 | Kanri's role-check; the dry run, twice |

Nine violations of three rules by the rules' own author. What separates the
rules that stopped recurring from those that did not is **what runs them**:

- **Prose binds nobody.** All nine violations were of rules that existed only
  as prose at the moment of the violation.
- **A step binds whoever runs the step**, and only at the moment they run it.
- **A command binds everyone, the author included, and it binds while the
  document is being written rather than at review.** The needle rule became a
  one-line search of the plan's own replacement text and found the two
  outstanding instances at once; the count rule became a thirty-line pre-flight
  and found five defects before the first commit.

So a convention derived here **says which of the three it is, and if it is
prose, says what would make it a command.** Two of this repository's most
expensive plan findings — the needle trap and the count trap — sat in this
document as prose for two runs and were broken in the interval by the people
who had read them.

The review layers that run these conventions are not interchangeable, and the
`plan.coldread` seat exists because they are not. In the tanto-sweep-2 run a
cold read of the committed plan caught three drift classes that `lint`,
`replay`, and the `plan.review` dispatch had all passed: stale scaffolding text
left from an earlier draft, a CLI argument shape that no command actually
accepts, and a cross-reference inside the spec pointing at the wrong item. Each
is a defect only a reader with the whole document in view can see — the
instruments check what a rule names, and the review dispatch checks what the
plan claims, while the cold read checks the plan against itself with no prior
expectation of what it should say. The "found by" column of the table above
credits a cold read for the same reason: it is a distinct layer, not a slower
copy of the dry run or the review.

## The five triage outcomes, and why five

Serves exp-1c7a.

Four would be the obvious set — file it, send it away, fix it, or investigate.
The fifth, the relay into a spec in progress, exists because a defect that
arrives while a spec is being written has a cheaper home than an issue: the spec
input list, where it is answered by design rather than tracked as a defect. The
outcomes are also the reply vocabulary, one line each, so the reporter learns
which of the five happened without reading the ledger.

## Why the exit shoroku has no template of its own

Serves no expectation; internal shape.

The proposal and direction files are the close's own two files under different
names, and the batch report already prescribes their shape. A tenth template
would restate a skeleton that two role files and the ledger's stage values
already fix, and a skeleton nobody copies drifts from the procedure that does the
work.

## Where the delivered skill differs from the design documents

Serves exp-518b.

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

**The context-cost design of 2026-09-09.** Its plan carried passages, and the
delivered skill matches them; the divergences are in the **spec's own
Verification section**, which the tree contradicts and which was deliberately
left as the record rather than edited during the run:

- **The `compaction-<role>` item cannot pass as the spec words it.** The spec
  asks for "at least `1` in `SKILL.md` and `roles/kanri.md`"; the tree gives
  `SKILL.md` twice and `roles/kanri.md` zero, because `roles/kanri.md` answers
  the compaction file through `compacted: <path>` rather than by spelling the
  pattern. The plan says exactly that at its step 26 and then reprints the
  spec's looser wording at step 28, so the plan contradicts itself and the
  tree agrees with the more precise half. Nothing in the skill is wrong; the
  expectation is.
- **The check-1 wording.** The spec's Verification says check 1 yields
  "seventeen `ok`" lines; check 1 emits paths, not `ok` lines — the `ok` count
  belongs to check 2. Both were ruled as the record, not fixed, because a spec
  is a frozen argument and a plan's own text is not edited mid-run to make a
  check read better.

The lesson generalizes past these two: a spec's Verification section is prose
about commands, and prose about commands is not run. Where the plan and the
spec disagree about a value, the tree settles it and the more precise of the
two is usually the plan's, because the plan is the document whose steps were
actually executed.
