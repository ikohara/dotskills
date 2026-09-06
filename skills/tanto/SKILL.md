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
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, shoroku adoption and the T0 and T1 write-outs, lifecycle requests | human, Sekkei, Jisso, Kaiseki |
| Sekkei (設計) | 0 or 1 | spec, plan, spec and plan review | human, Kanri |
| Jisso (実装) | 0 or 1 | the SDD run, batch reports, commits, the T2 shoroku proposal and write-out | Kanri only |
| Kaiseki (解析) | 0 or 1, on demand | root-cause reports; never a fix, never a commit | human, Kanri |

## Invocation

`/tanto <role> [<kanri-address>]`, or `担当して <role>` / `tantoして <role>`.

Normalize the role word to its romaji id before anything else.

| Accepted | Id |
| --- | --- |
| `かんり`, `管理`, `kanri` | `kanri` |
| `せっけい`, `設計`, `sekkei` | `sekkei` |
| `じっそう`, `実装`, `jisso` | `jisso` |
| `かいせき`, `解析`, `kaiseki` | `kaiseki` |

Any other word: say the role is unknown, list those four ids, and stop.

The optional second argument is Kanri's address, pasted by the human from
Kanri's lifecycle request. Kanri runs `/tanto kanri` with no address.
`/tanto kaiseki` with no address is standalone Kaiseki — see `roles/kaiseki.md`.

## Start sequence

Three steps, in this order, before any role work.

### 1. Model check

Read the expected-model config below and compare `sessions.<role>` with your
own model id, which your system prompt states. A value matches when it is a
substring of that id. On a mismatch, tell the human what was expected and what
is running, ask them to run `/model <family>` and then `/tanto` again, and
stop. The check warns only. Never switch a model.

### 2. Rename

Ask the human to run `/rename <role>` in this session — a skill cannot rename
its own session. Wait for their confirmation, run `ListAgents`, and check that
this session's name is now the role id. If it is not, continue under the
observed name and say so in the handshake.

### 3. Handshake

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
Kaiseki with no address is standalone and does not hand shake; an attached
Kaiseki always receives the address on the command line.

Send Kanri exactly one message:

```text
handshake role=<role> name=<name [ref]> cwd=<path> model=<model id> branch=<branch> mode=<permission mode|unknown>
```

`mode=` is what you can see about your own permission mode — `auto` when your
system prompt says auto mode is active, otherwise `unknown`. It is advisory.

Jisso then **waits** for Kanri's reply. It carries the plan path and the ledger
path Jisso cannot start without. Sekkei and Kaiseki start reading while they
wait — the human is in the room, and the reply arrives as a
`<cross-session-message>`.

The roster lives at `.superpowers/sdd/roster.md`, is written only by Kanri from
`templates/roster.md`, and has Kanri's row first. Columns are role, name
`[ref]`, cwd, model, branch, mode, started, status. `ListAgents` shows name,
`[ref]`, kind, and start time — not the cwd, the model, or the role; the
handshake carries those.

Address a peer by its **bare name**: `to` is `kanri`, `sekkei`, `jisso`, or
`kaiseki`. A `/rename` changes the name `ListAgents` shows and the envelope's
`from-name`; the `[ref]` does not change; the **old** name stops delivering.
So the roster is a uniqueness check — exactly one live session per role name —
and not an address book. Two live sessions sharing a name make `SendMessage`
error and ask for the ref, which is the refusal we want.

## Messages

- One boss. Only Kanri messages Jisso. Sekkei and Kaiseki never do — inbound
  messages queue and drain in order, and a second boss interleaves
  instructions.
- A message is one line plus a path. Report bodies, rulings, briefs, and plans
  live in files: a message dies with the session, a file survives compaction
  and a VS Code restart.
- Kanri sends every batch prompt and every Kaiseki brief with
  `notify_when_idle: true`. The receiver also sends one line back when its
  report is written. Either signal is enough to proceed.
- Never poll `ListAgents`; never send "are you done". Check the listing only
  when an expected signal did not arrive.
- A reply copies the incoming message's `from` into `to`.
- Permission boundaries are per session. Never ask a peer for work that was
  denied in your own session or would be blocked there. Blocked work goes to
  the human.

## Artifacts

| Path | Writer | Readers | Content |
| --- | --- | --- | --- |
| `docs/superpowers/specs/<date>-<topic>-design.md` | Sekkei | Kanri, Jisso | the spec; committed |
| `docs/superpowers/plans/<date>-<topic>.md` | Sekkei | Kanri, Jisso | the plan; committed; carries Global Constraints, a Batches section, and how a batch is verified |
| `.superpowers/sdd/roster.md` | Kanri | all roles | one row per role |
| `.superpowers/sdd/<topic>/kanri.md`, then `.superpowers/sdd/<plan-basename>/kanri.md` | Kanri | Sekkei, Jisso, Kaiseki | the conductor ledger |
| `.superpowers/sdd/<topic>/spec-inputs.md` (optional) | Kanri | Sekkei | scope inputs the human gave Kanri during spec work, numbered `I-n`, each with Kanri's advisory notes |
| `.superpowers/sdd/<plan-basename>/batch-<X>-prompt.md` | Kanri | Jisso, human | the same text as the `SendMessage`, so the human can paste it if the message did not arrive |
| `.superpowers/sdd/<plan-basename>/batch-<X>-report.md` | Jisso | Kanri | fixed skeleton |
| `.superpowers/sdd/<plan-basename>/kaiseki-<n>-brief.md` | Kanri | Kaiseki | fixed skeleton |
| `.superpowers/sdd/<plan-basename>/kaiseki-<n>.md` | Kaiseki | Kanri, Jisso | fixed skeleton |
| `.superpowers/sdd/<plan-basename>/shoroku-proposal.md` | Jisso | Kanri | the T2 proposal, written to a file instead of printed |
| `.superpowers/sdd/<plan-basename>/shoroku-direction.md` | Kanri | Jisso | Kanri's answer to that proposal, item by item |
| `.superpowers/sdd/<plan-basename>/progress.md` | Jisso, through the SDD skill | Kanri | the SDD ledger; Kanri reads it and never writes it |
| `.superpowers/sdd/.gitignore` holding `*` | the SDD skill's `sdd-workspace` script, or Kanri at start when it runs first | git | keeps everything above untracked, so nothing is ever staged |
| `$CLAUDE_CONFIG_DIR/tanto.json` | the user | every role at start, Kanri at each handshake | the personal expected-model config |

Templates are copied and filled, never restated in prose: `templates/roster.md`,
`templates/kanri.md`, `templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`, and
`templates/tanto.json`.

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
   to instrument and leaves the tree clean.
6. Every subagent dispatch names a `model` from `tanto.json`; none omits it.
7. Small batches of three or four tasks. Each boundary is a ruling checkpoint
   and a lifecycle checkpoint.
8. Fix rounds stop at the Kaiseki trigger when the cause is unknown; root cause
   before more fixing.
9. At most two strong-model sessions active at once: Sekkei pauses while
   Kaiseki is active.

## The four SDD stop classes

subagent-driven-development names four things that stop an executor, and only
these: an irreversible or destructive operation; a security-sensitive action; a
side effect outside this worktree that norms say you ask about first (a merge, a
push to a shared branch, a publish); and a plan so broken that every path
forward is a guess. Under `tanto` those four plus a scope or spec change
are the only items that reach the human, and they reach the human through
Kanri. `roles/jisso.md` quotes the source text verbatim; this restatement is
for the roles that route on it.

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
