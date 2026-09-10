---
name: tanto
description: Use when the user starts or joins a tanto multi-session orchestration run in Claude Code, invoked as `/tanto <role>`, `担当して <role>`, or `tantoして <role>`, where the role word is kanri (管理), sekkei (設計), jisso (実装), or kaiseki (解析) in hiragana, kanji, or romaji. Drives one implementation plan through separate interactive sessions that message each other, composing superpowers brainstorming, writing-plans, subagent-driven development, systematic-debugging, and the shoroku write-out. Claude Code only, because it needs ListAgents and SendMessage.
argument-hint: kanri | sekkei | jisso | kaiseki
---

# tanto

担当 — "take charge of." Multi-session orchestration for one implementation
plan. Each role is its own interactive Claude Code session on the same
repository and the same branch; the sessions address each other by name with
`SendMessage` and hand real work over as files.

`tanto` is **Claude Code only**. It needs `ListAgents` to see the live sessions
and `SendMessage` to address them. No other Agent Skills host provides both.

This file is the shared contract. Every role reads it, then reads exactly one
`roles/<role>.md` — never the other three.

## The roles

| Role | Count per repo | Owns | Talks to |
| --- | --- | --- | --- |
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, shoroku adoption and the T0 and T1 write-outs, the exit directions, the bug intake, lifecycle requests | human, Sekkei, Jisso, Kaiseki |
| Sekkei (設計) | 0 or 1 | spec, plan, spec and plan review | Kanri; the human by grant |
| Jisso (実装) | 0 or 1 | the SDD run, batch reports, commits, the T2 shoroku proposal and write-out | Kanri; the human by grant |
| Kaiseki (解析) | 0 or 1, on demand | root-cause reports; never a fix; no commit but its exit shoroku | Kanri; the human by grant |

## Invocation

`/tanto <role> [<kanri-address>]`, or `担当して <role>` / `tantoして <role>`.

Normalize the role word to its romaji id before anything else.

| Accepted | Id |
| --- | --- |
| `かんり`, `管理`, `kanri` | `kanri` |
| `せっけい`, `設計`, `sekkei` | `sekkei` |
| `じっそう`, `実装`, `jisso` | `jisso` |
| `かいせき`, `解析`, `kaiseki` | `kaiseki` |
| `resume` | `resume` |

Any other word: say the role is unknown, list those five ids, and stop.

`/tanto resume` skips the start sequence — no model check, no first
handshake — and runs "Resuming" below.

The optional second argument is Kanri's address, pasted by the human from
Kanri's lifecycle request. Kanri runs `/tanto kanri` with no address.
`/tanto kaiseki` with no address is standalone Kaiseki — see `roles/kaiseki.md`.

## Start sequence

Two steps, in this order, before any role work.

### 1. Model check

Read the expected-model config below and compare `sessions.<role>` with your
own model id, which your system prompt states. A value matches when it is a
substring of that id. On a mismatch, tell the human what was expected and what
is running, ask them to run `/model <family>` and then `/tanto` again, and
stop. The check warns only. Never switch a model.

### 2. Handshake

Kanri skips the handshake and runs the start sequence in `roles/kanri.md`
instead. Every other role does the handshake below.

## The expected-model config

`$CLAUDE_CONFIG_DIR/tanto.json`, or `~/.claude/tanto.json` when that variable
is unset. Two maps, two mechanisms.

- `sessions.<role>` is **advisory**. The model check above and Kanri's
  handshake check compare against it. Nothing switches a session's model.
- `subagents.<kind>` is **effective**. Its value goes into the `model`
  parameter of every subagent that role dispatches. The fixed kinds are
  `implementer`, `reviewer`, `drafter`, `escalation`, and `default`.
- A key inside `subagents` whose name is a **skill name** means "run that skill
  in a subagent on that model instead of inline". When the key is absent, the
  skill runs inline on the session's model. No skill uses this today;
  skill-name keys are personal additions and are not in the built-in defaults.

The skill ships built-in defaults at `templates/tanto.json`, derived from the
family ladder `fable > opus > sonnet > haiku` (as of 2026-09). Read the
personal file and overlay it on the defaults **key by key**, at the granularity
`sessions.<role>` and `subagents.<kind>`. A partial personal file is complete;
an absent file is the case where every key is a default.

Then check that `subagents.escalation` sits above `subagents.implementer` on
that ladder — SDD's fix rounds 4-5 are an escalation only if it does.

Say once, in your start line, which file you read and which keys came from the
defaults, or `no tanto.json at <path>, all keys built-in defaults`, and add the
escalation-ladder result if the check failed. This is information, not a
warning.

**Every subagent dispatch names a `model`.** An omitted `model` inherits the
session's model, which on a Kanri, Sekkei, or Kaiseki session is the strongest
family — the exact failure this rule prevents.

## Handshake and roster

Sekkei and Jisso started with no address on the command line read the first
data row of `.superpowers/sdd/roster.md`, which is Kanri's own row, for it.
Kaiseki with no address is standalone and does not shake hands; an attached
Kaiseki always receives the address on the command line.

Send Kanri exactly one message:

```text
handshake role=<role> name=<name [ref]> cwd=<path> model=<model id> branch=<branch> mode=<permission mode|unknown> transcript=<absolute path|unavailable>
```

`name [ref]` is what `ListAgents` prints for this session on its first line
("This session is `<name> [<ref>]`").

`mode=` is what you can see about your own permission mode — `auto` when your
system prompt says auto mode is active, otherwise `unknown`. It is advisory.

`transcript=` is the path of this session's own transcript per "The transcript
reading", so that Kanri can record it and, where its session may read that
path, verify a reading it doubts.

Jisso then **waits** for Kanri's reply. It carries the plan path and the ledger
path Jisso cannot start without. Sekkei and Kaiseki start reading while they
wait — the human is in the room, and the reply arrives as a
`<cross-session-message>`.

The roster lives at `.superpowers/sdd/roster.md`, is written only by Kanri from
`templates/roster.md`, and has Kanri's row first. Columns are role, name
`[ref]`, cwd, model, branch, mode, started, status, transcript. `ListAgents`
shows name, `[ref]`, kind, and start time — not the cwd, the model, or the
role; the handshake carries those.

### The address

- The address of a session is the **bare name** its handshake carried:
  `dotskills-0d`, not `kanri`. `SendMessage` delivers a bare name that matches
  exactly one live session. When it reports the name ambiguous, run
  `ListAgents` once and append the `[ref]` from that listing, with the space
  that precedes it.
- **An address written `<name> [<ref>]` is used as the bare `<name>`.** The
  `[ref]` is an identity, shown wherever a session is named so that the
  listing, the roster, and the handover agree on which session is meant; it is
  appended to a `to` value only after `SendMessage` reports the name ambiguous,
  and never pasted from a file. Every command line (`/tanto <role> <address>`),
  every `to` value, and every "Send to" blank carries the bare name.
- **Kanri's address** reaches a role in one of three ways, in this order of
  precedence: the `kanri-address:` line below; the second argument of
  `/tanto <role> <address>`, pasted by the human from Kanri's request; the
  first data row of `.superpowers/sdd/roster.md`.
- **Every other role's address** is known only to Kanri, from the handshake,
  and Kanri is the only session that sends to Jisso, Sekkei, or Kaiseki. A
  reply copies the envelope's `from` into `to` and needs no name at all.

Kanri's address is the first data row of the roster. A message whose first line
is `kanri-address: <name> [<ref>] — handover accepted; the roster's first row is rewritten`
comes from a successor Kanri and replaces Kanri's address from then on; the
roster's first row says the same. A role whose send to Kanri errors re-reads
that row.

## The transcript reading

Every session can measure its own context from its transcript, the file the
harness appends to on disk as the session runs. The **reading** is four
figures from that file, taken by the session itself, and it is the only cost
signal the skill uses. The `tokens left` figure the harness prints is not one:
its unit is not documented as the context window.

Locate the file from the scratchpad path the system prompt names,
`<...>/<project slug>/<session id>/scratchpad`: the transcript is
`<config dir>/projects/<project slug>/<session id>.jsonl`, where the config
directory is `$CLAUDE_CONFIG_DIR` when set and `~/.claude` otherwise. Then, in
a POSIX shell with `T` the transcript path:

```bash
b=$(wc -c < "$T"); r=$(wc -l < "$T")
w=$(grep '"type":"user"' "$T" | grep -vc '"tool_result"')
c=$(grep '"type":"user"' "$T" | grep -v '"tool_result"' | grep -Ec '"(content|text)":"This session is being continued from a previous conversation')
echo "transcript: $b B, $r records, $w wake-ups, $c compactions"
```

- **Bytes** and **records** are the file's size and its line count, one JSON
  record per line.
- **Wake-ups** are the records of `type: user` that carry no tool result: one
  per human message, peer message, or idle notice, each the start of a turn
  that re-reads the whole context. The test is a substring of the line, so
  the count may be off by one.
- **Compactions** are the wake-ups whose text begins with the harness's
  phrase. The check is on the record type and the text's first characters; a
  plain grep for the phrase over-counts, because the phrase also appears in
  tool output and in this file. The phrase is the harness's and may change: a
  reworded one reads as `0`, and a compaction the session notices for itself
  is still the signal it always was.

The line the command prints is the reading, and it travels as it is: appended
after ` — ` to the boundary and exit lines the roles already send, and written
into the batch and Kaiseki reports where their templates have a slot. A
compaction does not shrink the file, and a tool result is stored at full size,
so bytes overstate what the context holds; the figures are compared with each
other across sessions, never with a token count.

A session whose transcript is not where this says — another host, a config
directory the environment does not name, a read the session is not permitted
— sends `transcript: unavailable — <one line why>` in its place.

A session whose reading shows a compaction it has not yet reported writes
every item its summary attributes to the human — "the human said", "ruled",
"saw", "confirmed" — one per line, to
`.superpowers/sdd/<plan-basename>/compaction-<role>-<n>.md` (the topic
directory for Sekkei; `<n>` one more than the highest such file for that
role, so that a second compaction or a replaced session does not overwrite
the first), names the file in its next line to Kanri as
`compacted: <path>`, and until Kanri answers `confirmed: <path>` acts on
none of those items beyond finishing the task in hand. Two sessions have no
Kanri to answer: Kanri itself, whose own case is its handover file, and a
standalone Kaiseki, which puts the items to the human in its own window.
What the harness summarizes is not the human's words; the human's words
are in the dialogue file, the ledger, and the human's own window.

## Resuming

A Claude Code conversation that is resumed — after an editor restart, a
closed tab, an ended terminal — keeps its context, its session id, and its
transcript, and comes back under a new name and `[ref]`; nothing in the
transcript marks the resume (measured 2026-09-09). Its old address is dead
from then on. The transcript path the handshake carried is the identity that
survives, and the roster's Transcript column holds it.

`/tanto resume`, typed by the human in a window, and the self-check every
role runs at each of its boundaries are the same act: run `ListAgents` once;
find the roster row whose Transcript column is this session's own transcript
path; if the name the listing prints for this session is that row's, nothing
happened. If it differs, this session was resumed:

- A role sends its handshake line again, to the roster's first data row,
  with the same `transcript=`. Kanri matches the path, rewrites the row in
  place with the new name and `[ref]` — status `live`, no `dead` row — writes
  an Events line `resumed: <old name> → <new name>`, and answers with its own
  address. The role continues where it was; its context is the same. A row a
  recovery had already marked `dead` returns to `live` the same way, and the
  Events line corrects the earlier one.
- Kanri rewrites the roster's first data row with its new name and `[ref]`,
  and sends `kanri-address: <name> [<ref>] — resumed; the roster's first row is rewritten`
  to every live peer whose name `ListAgents` still lists. A peer not listed
  was resumed too, and re-handshakes on its own `/tanto resume`, finding the
  new first row.

After an editor restart, which resumes every window at once, the human types
`/tanto resume` in Kanri's window first and then in each other window, in any
order; no address is pasted. A session whose path matches no row is not a
resumed role: `/tanto resume` says so and stops, and the human runs
`/tanto <role> <address>` there as for a new session.

`/tanto resume` reads this file and nothing else. The role file is already in
the session's context, which is what a resume preserves.

## Messages

- One boss. Only Kanri messages Jisso. Sekkei and Kaiseki never do — inbound
  messages queue and drain in order, and a second boss interleaves
  instructions.
- A message is one line plus a path. Report bodies, rulings, briefs, and plans
  live in files: a message dies with the session, a file survives compaction
  and a VS Code restart.
- Kanri sends batch prompts and Kaiseki briefs **without** an idle
  subscription and waits for the receiver's one-line report. It subscribes —
  a pure `notify_when_idle`, no message — only when an expected signal is
  overdue, which is the human's observation or a wake-up for another reason,
  since a session holding no subscription has no clock; and it treats a
  notice that arrives before the report as a reason to check the workspace,
  never as the signal: a peer's turn ends whenever it dispatches a subagent,
  so most notices are false idles. The exit lines keep their
  `notify_when_idle: true`, because there the idle notice is the forced-exit
  signal by design.
- Never poll `ListAgents`; never send "are you done". Check the listing only
  when an expected signal did not arrive.
- A reply copies the incoming message's `from` into `to`.
- At a batch boundary Kanri has verified, Sekkei answers in one line,
  `committed <subject>` or `nothing to commit`, each with its reading appended
  after ` — `; Kanri sends the next batch prompt only after that reply, or,
  when the reply is overdue, after the notice of a subscription made then.
- Before the human reviews a spec or a plan, Sekkei sends Kanri
  `review-ready: <path>`. Kanri dispatches the **review brief** on
  `subagents.reviewer` — a read-only subagent that writes
  `.superpowers/sdd/<topic>/review-brief-spec.md` or `review-brief-plan.md`
  from `templates/review-brief.md`, in the chat's language — checks its form,
  and answers `brief: <path>`. Sekkei puts the brief's text verbatim in its
  review request, with both paths. The human's answers to the brief's points
  are the confirmation that review asks for; the document is what the points
  point into, and the human reads it where a point sends them.
- Permission boundaries are per session. Never ask a peer for work that was
  denied in your own session or would be blocked there. Blocked work goes to
  Kanri, which rules on human access.

A defect noticed in a skill goes to the Kanri of the repository that ships that
skill, as a **bug report**: a file written from `templates/bug-report.md` and
one line, `bug-report: <absolute path>`. Kanri is the intake, and the human
supplies the intake's address. A defect that surfaces in a spec dialogue
reaches Kanri as an `I-n` in `spec-inputs.md`, not as a bug report.

Kanri answers a bug report with one line, in one of five forms:
`triage: issue-<id>`, `triage: redirect — <one line>`,
`triage: kaiseki requested`, `triage: hotfix — <commit subject>`, and
`triage: relayed as I-<n>`.

## Human access

The human's counterpart is Kanri. By default a role has no human access:
Jisso and an attached Kaiseki never address the human unless granted, and a
role addresses the human directly only for what needs the human's eyes or
hands — a visual check in a browser or a GUI, an OS dialog, a credential — and
only after Kanri has judged it necessary and granted it for that scope. Two
standing grants exist: Sekkei's spec and plan dialogue, given at its creation
and named in Kanri's orders line; and an attached Kaiseki's debugging
conversation, written in its brief. A standalone Kaiseki has no Kanri, and the
human in the room is its counterpart.

The request is one line to Kanri,
`human-needed: <what the human must do> — <why no other way> — <where: this window>`,
and the role idles until the answer. Kanri answers in one line,
`human-access: granted — <scope> — <until>` or
`human-access: denied — <alternative>`, recorded as `R-n`. On a grant Kanri
tells the human, as a numbered list, to go to the role's window
(`<name> [<ref>]`), do `<what>`, and come back. The role's direct exchange
stays within the scope and ends with one line to Kanri,
`human-access: done — <what the human did or decided>`.

This is protocol, not enforcement: every role has its own window, and two
things stay outside the rule. The harness's own prompts — a permission dialog,
the model-mismatch stop of the start sequence — reach the human in the role's
window and cannot be routed through Kanri. And when the human speaks in a
role's window unprompted, the role answers, because silence costs more than
the exception, and sends Kanri one line,
`human-contact: <one line on what was said>`; that is not a grant for anything
beyond the exchange.

## Session exit

Before the human deletes a session in the normal flow, the session's **exit
shoroku** runs. The shoroku stages are T0 (decisions, on `main` before Sekkei
exists), T1 (requirements and issues, after the plan commit), and T2
(everything else, after the final batch); `R-n` numbers Kanri's rulings and
`S-n` its shoroku candidates, both in the conductor ledger; the adoption rule
is that requirement and ADR items, and any item Kanri cannot classify or is
unsure about, go to the human, and Kanri decides the rest.
It is the T2 split applied to that session: the session writes
its candidates as a numbered list to `exit-<role>[-<suffix>]-proposal.md`;
Kanri rules per the adoption rule, escalates requirement and ADR items to the
human, and answers item by item in `exit-<role>[-<suffix>]-direction.md`; the
session applies the accepted subset per `docs/AGENTS.md`, lints, commits once
by explicit path in the slot Kanri gives it, and sends Kanri one line. Kanri
verifies the diff as for any batch, marks the `S-n` rows written, and only then
asks the human to delete the session. An exit whose candidates carry no
requirement or ADR item asks the human nothing; the human sees the delete
request and the commit. Candidates are what is not yet in any file — a rejected
alternative and its reason, a fact measured, a defect noticed, an observation
about the run — never a restatement of a spec, a plan, a report, or a ledger.
Kanri's own exit and a standalone Kaiseki have no second session to rule; each
role file says how.

The lines, each sent with `notify_when_idle: true`. Kanri sends
`exit: propose your shoroku; write it to <path>`; the session answers with one
line and the path; Kanri sends `exit: direction at <path>`; the session answers
`exit write-out committed: <subject> — <reading>` or
`exit write-out: nothing accepted — <reading>`. A
session that has not answered when its idle notice arrives is past answering:
Kanri treats the exit as forced — the roster's Events line says the exit
shoroku did not run and what was lost, as far as Kanri knows — asks the human
to delete it, and continues. Jisso idles through another session's exit; the
cost is one boundary.

The file pattern is `exit-<role>[-<suffix>]`, with the suffix the batch letter
for Jisso (`exit-jisso-B`, a Jisso leaving at batch B's boundary), the case
number for Kaiseki (`exit-kaiseki-1`), absent for Sekkei (`exit-sekkei`), and
the date and the bare name for Kanri (`exit-kanri-<YYYY-MM-DD>-<name>`); the
conductor ledger's Stage values mirror it. The files live where the role's
other files live: Jisso's and
an attached Kaiseki's under `.superpowers/sdd/<plan-basename>/`, Sekkei's under
`.superpowers/sdd/<topic>/`, Kanri's own next to the roster. Kanri's exit has a
proposal file but no direction file, because it rules on itself.

The write-out commit's subject begins with `docs: exit shoroku` or
`docs: T<n> shoroku` — `docs: exit shoroku for jisso at B`,
`docs: T2 shoroku for <topic>` — which is the fixed prefix the whole-branch
review package excludes.

## Artifacts

| Path | Writer | Readers | Content |
| --- | --- | --- | --- |
| `docs/superpowers/specs/<date>-<topic>-design.md` | Sekkei | Kanri, Jisso | the spec; committed |
| `docs/superpowers/plans/<date>-<topic>.md` | Sekkei | Kanri, Jisso | the plan; committed; carries Global Constraints, a Batches section, and how a batch is verified |
| `.superpowers/sdd/roster.md` | Kanri | all roles | one row per role |
| `.superpowers/sdd/roster-archive.md` | Kanri | Kanri | from `templates/roster-archive.md`; the roster's dead, replaced, and refused rows with their last readings, and the closed plans' Events lines, appended at each plan close |
| `.superpowers/sdd/kanri-handover.md` | the outgoing Kanri | the successor Kanri | the handover; deleted by the successor once accepted |
| `.superpowers/sdd/inbox/<date>-<slug>.md` | Kanri | Kanri | a bug report received, with its Triage section |
| `.superpowers/sdd/<topic>/kanri.md`, then `.superpowers/sdd/<plan-basename>/kanri.md` | Kanri | Sekkei, Jisso, Kaiseki | the conductor ledger |
| `.superpowers/sdd/<topic>/spec-inputs.md` (optional) | Kanri | Sekkei | scope inputs the human gave Kanri during spec work, numbered `I-n`, each with Kanri's advisory notes |
| `.superpowers/sdd/<topic>/dialogue.md` | Sekkei | Kanri, the brief writer, T1 | the spec dialogue: each question Sekkei put and the human's answer, verbatim, in order |
| `.superpowers/sdd/<topic>/review-brief-spec.md`, `.superpowers/sdd/<topic>/review-brief-plan.md` | the brief writer Kanri dispatches | Kanri, then the human through Sekkei | the review brief, from `templates/review-brief.md`, in the chat's language |
| `.superpowers/sdd/<topic>/plan-dryrun.md` | Sekkei | the plan reviewer, Kanri | each verification command of the plan run once on scratch copies, with its output and the expectation |
| `.superpowers/sdd/<plan-basename>/batch-<X>-prompt.md` | Kanri | Jisso, human | the same text as the `SendMessage`, so the human can paste it if the message did not arrive |
| `.superpowers/sdd/<plan-basename>/batch-<X>-report.md` | Jisso | Kanri | fixed skeleton |
| `.superpowers/sdd/<plan-basename>/kaiseki-<n>-brief.md` | Kanri | Kaiseki | fixed skeleton |
| `.superpowers/sdd/<plan-basename>/kaiseki-<n>.md` | Kaiseki | Kanri, Jisso | fixed skeleton |
| `.superpowers/sdd/<plan-basename>/shoroku-proposal.md` | Jisso | Kanri | the T2 proposal, written to a file instead of printed |
| `.superpowers/sdd/<plan-basename>/shoroku-direction.md` | Kanri | Jisso | Kanri's answer to that proposal, item by item |
| `.superpowers/sdd/<plan-basename>/exit-<role>[-<suffix>]-proposal.md`, or the topic directory for Sekkei, or `.superpowers/sdd/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | the exiting session | Kanri | the exit shoroku proposal |
| `.superpowers/sdd/<plan-basename>/exit-<role>[-<suffix>]-direction.md`, or the topic directory for Sekkei | Kanri | the exiting session | Kanri's answer, item by item |
| `.superpowers/sdd/<plan-basename>/compaction-<role>-<n>.md`, or the topic directory for Sekkei | the compacted session | Kanri, or the human for Kanri itself and a standalone Kaiseki | every item a compaction summary attributes to the human, one per line, rewritten with the human's answers |
| `.superpowers/sdd/<plan-basename>/progress.md` | Jisso, through the SDD skill | Kanri | the SDD ledger; Kanri reads it and never writes it |
| `.superpowers/sdd/.gitignore` holding `*` | the SDD skill's `sdd-workspace` script, or Kanri at start when it runs first | git | keeps everything above untracked, so nothing is ever staged |
| `$CLAUDE_CONFIG_DIR/tanto.json` | the user | every role at start, Kanri at each handshake | the personal expected-model config |

Templates are copied and filled, never restated in prose. There are eleven:
`templates/roster.md`, `templates/roster-archive.md`, `templates/kanri.md`,
`templates/kanri-handover.md`, `templates/bug-report.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/review-brief.md`, and `templates/tanto.json`.

The skill also ships one executable, `scripts/passage-check.js`: the instrument
a plan that carries passages checks itself with, run by Sekkei in place of an
agent dry run, by Jisso at every batch boundary, and by the whole-branch
reviewer. It is Node with no dependencies, its tests are beside it and run by
`node --test`, and `roles/sekkei.md` and `roles/jisso.md` name its
subcommands. Its path is written skill-relative, like every other path in
this skill, and the role files spell the runnable form `$TANTO`: set that to
the skill's own directory, which the harness names when it invokes the skill,
and every command in this skill runs as written. It is never invoked bare —
the file carries no shebang, so `node` is part of the command and not
decoration.

No `<plan-basename>` exists before the plan is committed, so the conductor
ledger starts under `.superpowers/sdd/<topic>/` and Kanri moves it to
`.superpowers/sdd/<plan-basename>/kanri.md` when the plan lands. Only the
ledger moves; the topic directory stays as the spec-phase record.

## Rules

1. One boss: only Kanri messages Jisso.
2. Files between the strong-model sessions: the spec, the plan, the conductor
   ledger, the spec inputs, and the Kaiseki reports are the only channel.
3. State in files, not in memory: the roster and the ledgers. Memory holds at
   most a pointer to them.
4. One set of roles per repo. A session is bound to its cwd — CLAUDE.md,
   memory, and permissions all come from it.
5. Kanri does not edit tracked files while a batch runs, and writes under
   `docs/` only while Jisso is idle or absent. Sekkei writes only under
   `docs/superpowers/` and `.superpowers/sdd/`, at any time, and, while a batch
   is in flight, commits only at a batch boundary Kanri has verified; while no
   batch is in flight it commits whenever its work is ready. Kaiseki edits only
   to instrument and leaves the tree clean. Neither writes under the `docs/`
   document-management tree outside `docs/superpowers/`, except the accepted subset of its own exit shoroku, at its exit.
6. Every subagent dispatch names a `model` from `tanto.json`; none omits it.
7. Small batches of three or four tasks. Each boundary is a ruling checkpoint
   and a lifecycle checkpoint.
8. Fix rounds stop at the Kaiseki trigger when the cause is unknown; root cause
   before more fixing.
9. At most two strong-model sessions active at once: Sekkei pauses while
   Kaiseki is active.
10. No `tanto` session is renamed after it has started under `/tanto` — Kanri
    included, from its start line onward. A rename changes the name the listing
    shows and the envelope's `from-name`, the ref does not change, and the old
    name stops delivering even with the ref attached (measured 2026-09-06). A
    rename before `/tanto <role>` is the human's own choice: the skill neither
    asks for one nor forbids it, and the handshake carries whatever the name
    is.
11. A plan that edits this skill's own files runs on the skill it is
    editing: when the skill the sessions load is the working tree's own
    copy — a link into it, as in the repository that ships this skill — a
    session started mid-plan reads whatever is on disk at that moment.
    While such a plan is in flight, the authority for the run's sessions is
    the plan's Global Constraints, Kanri's orders line, and the batch
    prompts, not the role text on disk; Kanri records that as a ruling when
    the plan lands, so every batch prompt and a handover file carry it. The
    plan names, in its Global Constraints and its Batches section, the
    boundary from which a role may be started or replaced. Before that
    boundary no role is replaced and no further role is created, with two
    exceptions: Kanri's own handover proceeds when it is due, and its
    successor takes the authority ruling from the handover file rather than
    from the tree; and a further role needed before the boundary — Kaiseki
    — is a Kanri ruling, recorded as `R-n`, made with the half-edited skill
    in view. The roles that start the plan — Jisso at the plan's landing,
    Sekkei before it — read the skill as it stands then, and the authority
    sentence above is what covers them.

## The four SDD stop classes

Quoted verbatim, the same bytes as `roles/jisso.md` carries, so that one
fixed-string search checks both copies against the source:

> Four things stop you, and only these: an irreversible or destructive
> operation; a security-sensitive action; a side effect outside this worktree
> that norms say you ask about first (a merge, a push to a shared branch, a
> publish); and a plan so broken that every path forward is a guess. For those,
> stop and ask.

Under `tanto` those four plus a scope or spec change are the only stops that
reach the human, and they reach the human through Kanri.

## Workspace

All roles share one working tree and one branch. Sekkei cuts the branch from
`main` before the spec commit, named after the topic; Jisso continues on it;
the merge decision is the human's. **No worktree by default** — Kanri verifies
the tree in place and the human can watch it. Every batch prompt restates that
as a Kanri directive.

`.superpowers/sdd/<plan-basename>/` outlives the SDD run. Jisso never deletes
it. After T2 and the merge decision, Kanri asks the human whether to delete it.

## Now read your role file

- `kanri` → `roles/kanri.md`
- `sekkei` → `roles/sekkei.md`
- `jisso` → `roles/jisso.md`
- `kaiseki` → `roles/kaiseki.md`

Read exactly one. The other three are not yours.
