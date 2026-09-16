---
name: tanto
description: Use when the user starts or joins a tanto multi-session orchestration run in Claude Code, invoked as `/tanto <role>`, `担当して <role>`, or `tantoして <role>`, where the role word is kanri (管理), sekkei (設計), keikaku (計画), jisso (実装), kaiseki (解析), kikaku (企画), or hosa (補佐) in hiragana, kanji, or romaji. Drives one implementation plan through separate interactive sessions that message each other, composing superpowers brainstorming, writing-plans, subagent-driven development, systematic-debugging, and the shoroku write-out. Claude Code only, because it needs ListAgents and SendMessage.
argument-hint: kanri | sekkei | keikaku | jisso | kaiseki | kikaku | hosa | fukki
---

# tanto

担当 — "take charge of." Multi-session orchestration for one implementation
plan. Each role is its own interactive Claude Code session on the same
repository and the same branch; the sessions address each other by name with
`SendMessage` and hand real work over as files.

`tanto` is **Claude Code only**. It needs `ListAgents` to see the live sessions
and `SendMessage` to address them. No other Agent Skills host provides both.

This file is the shared contract. Every role reads it, then reads exactly one
`roles/<role>.md` — never the other six.

## The roles

| Role | Count | Owns | Talks to |
| --- | --- | --- | --- |
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, the recommendations and the directions, the bug intake, lifecycle requests | human, Sekkei, Keikaku, Jisso, Kaiseki, Hosa; Kikaku at its handshake only |
| Sekkei (設計) | 0 or 1 per topic | the spec and its review | Kanri; the human by grant |
| Keikaku (計画) | 0 or 1 per topic | the plan, its dry run, and its review | Kanri; the human by grant |
| Jisso (実装) | 0 or 1 | the SDD run, batch reports, commits, the T2 shoroku proposal | Kanri; the human by grant |
| Kaiseki (解析) | 0 or 1, on demand | root-cause reports; never a fix; no commit | Kanri; the human by grant |
| Kikaku (企画) | 0 or 1, opened by the human | the consultation, and the decision files under `.tanto/kikaku/` | the human; Kanri, one `decision:` line |
| Hosa (補佐) | 0 or 1, opened by the human | the human's small chores and Kanri's filings, each in a slot Kanri gives | the human; Kanri |

## Invocation

`/tanto <role> [<kanri-address>]`, or `担当して <role>` / `tantoして <role>`.

Normalize the role word to its romaji id before anything else.

| Accepted | Id |
| --- | --- |
| `かんり`, `管理`, `kanri` | `kanri` |
| `せっけい`, `設計`, `sekkei` | `sekkei` |
| `けいかく`, `計画`, `keikaku` | `keikaku` |
| `じっそう`, `実装`, `jisso` | `jisso` |
| `かいせき`, `解析`, `kaiseki` | `kaiseki` |
| `きかく`, `企画`, `kikaku` | `kikaku` |
| `ほさ`, `補佐`, `hosa` | `hosa` |
| `ふっき`, `復帰`, `fukki` | `fukki` |

Any other word: say the role is unknown, list those eight ids, and stop.

`/tanto fukki` skips the start sequence — no model check, no first
handshake — and runs "Resuming" below.

The optional second argument is Kanri's address, pasted by the human from
Kanri's lifecycle request. Kanri runs `/tanto kanri` with no address.
`/tanto kaiseki` with no address is standalone Kaiseki — see `roles/kaiseki.md`.

## Start sequence

Two steps, in this order, before any role work.

### 1. Model check

Read the expected-model config below and compare `sessions.<role>.model` with
your own model id, which your system prompt states; a configured family
matches when it occurs inside that id. On a mismatch, tell the human what was
expected and what is running, ask them to run `/model <family>` and then
`/tanto` again, and stop.

Then read your own effort as "The transcript reading" below says, and compare
it with `sessions.<role>.effort`. Say both results in your start line —
Kanri's own start line included, though Kanri sends no handshake. Every other
role reads the same field again for its handshake, so Kanri checks the effort
a second time, as it checks the model.

The effort check warns only, and `unknown` is not a mismatch. Never switch a
model, and never switch an effort: the effort is the human's to change with
`/effort` in that window, and the roster records what runs.

### 2. Handshake

Kanri skips the handshake and runs the start sequence in `roles/kanri.md`
instead. Every other role does the handshake below.

## The expected-model config

`$CLAUDE_CONFIG_DIR/tanto.json`, or `~/.claude/tanto.json` when that variable
is unset. Three maps, three mechanisms. Every value of the first two is
`{ "model": <family>, "effort": <level> }`, or a bare string, which means that
model with the effort from the defaults.

- `sessions.<role>` is **advisory**. The checks above and Kanri's handshake
  check compare against it, read at the moment of each comparison — the
  file's presence as much as its content, since a personal override can be
  created, edited, or deleted at any time, and "it existed when I last
  checked" is never evidence that it exists now. Nothing switches a
  session's model or its effort.
- `subagents.<kind>` is **effective**. Its `model` goes into the `model`
  parameter of every subagent that role dispatches, and its `effort` into the
  agent definition below. The twelve kinds are `task.implement`,
  `task.escalate`, `task.review-spec`, `task.review-quality`, `plan.draft`,
  `plan.review`, `plan.coldread`, `spec.review`, `branch.review`,
  `brief.write`, `shoroku`, and `default`.
- A key inside `subagents` whose name is a **skill name** means "run that skill
  in a subagent on that model instead of inline". When the key is absent, the
  skill runs inline on the session's model. `shoroku` is the one built-in
  skill-name key; any other is a personal addition.
- `ceiling` is **effective** in the sense `subagents` is: `scripts/reading.js`
  reads it, and the verdicts `roles/kanri.md` and `roles/jisso.md` act on come
  out of it. `ceiling.kanri` and `ceiling.jisso` are each
  `{ "batches": <N>, "per_batch": <tokens> }` — how many batches of measured
  consumption that seat may grow by above its own measured baseline, and what
  one batch costs it. `ceiling.presence_minutes` is the window inside which
  the human's last turn in Kanri's own transcript still counts as present, and
  `ceiling.share_threshold` the context above which a wake-up's usage counts
  toward the share Kanri reports at the plan close. A `ceiling.<role>` for any
  role but those two is an unknown key: Kanri and Jisso are the only seats the
  ceiling replaces, because they are the two that run a whole plan of batches,
  and every other role measures and sends the five figures and is replaced on
  none of them.

The ceilings and the threshold are the **human's operating choice**, not a
documented quality limit. No Anthropic document names 150000 tokens as a point
at which a model's recall falls off; the closest describes recall degrading
with context as a gradient rather than a cliff. 150000 is where the human's own
account view buckets usage, and what the run is choosing to spend per wake-up.
Reducing consumption lowers the ceiling at the same `batches`, which is the
point of deriving it: a shorter role file or a quieter boundary pays off in
this instrument without anyone moving a threshold.

The effort vocabulary is the harness's — `low`, `medium`, `high`, `xhigh`,
`max` — and the family vocabulary is the Agent tool's.

The skill ships built-in defaults at `templates/tanto.json`, derived from the
family ladder `fable > opus > sonnet > haiku` (as of 2026-09). Read the
personal file and overlay it on the defaults **field by field**: a personal
`{"effort":"medium"}` under `subagents.task.implement` changes that effort and
keeps the default model. A partial personal file is complete; an absent file
is the case where every key is a default. The `ceiling` map overlays the same
way and at the same granularity: a personal
`{"ceiling": {"kanri": {"batches": 1}}}` sets Kanri's batch count to 1 and
leaves every other value of all three maps alone. A key that names no role, no
kind and no ceiling field — an older file's, for instance — is reported in
your start line as `unknown key <name>, ignored`, or as
`unknown key ceiling.<name>, ignored` for one under that map, which
`scripts/reading.js` writes on `stderr` every time it reads the file; either
way it is otherwise ignored.

Then check that `subagents.task.escalate` sits above
`subagents.task.implement` on that ladder — SDD's fix rounds 4-5 are an
escalation only if it does.

A kind's effort cannot ride in a dispatch; it rides in an agent definition,
which the harness reads when a session starts. So, after reading the merged
config and before any other work, write for each of the twelve kinds the file
`~/.claude/agents/tanto-<object>-<act>.md` — the kind's name with its `.`
turned into a `-`, under `$CLAUDE_CONFIG_DIR/agents/` when that variable is
set — from `templates/agent.md`, when the file is absent or its content
differs from what the template renders. A file that already matches is left
alone.

The rendered file is `name`, a `description` saying the seat is dispatched by
name through `subagent_type` and is never to be selected from that
description, and `effort`, over one paragraph telling the subagent to follow
the prompt of the dispatch that named it. It carries no `model` and no
`tools`: the dispatch's own `model` parameter binds the family and takes
precedence over a definition's by the Agent tool's contract, and the prompts
assume every tool. The description is protocol against the harness's
proactive agent selection, not enforcement.

Then read your own system prompt's list of available agent types and count
the twelve names in it. A definition written during a session is not visible
to that session, so the first session on a machine that writes them
dispatches without them; from then on a dispatch names its kind as
`subagent_type: tanto-<object>-<act>` — or `tanto-<kind>` for a kind with no
dot in its name, `tanto-shoroku` and `tanto-default`.

Say once, in your start line, which file you read; which keys came from the
defaults, at the granularity of a field, or `no tanto.json at <path>, all
keys built-in defaults`; the ladder result if the check failed; and
`agents: <n> current, <m> written, <k> not visible to this session`, with the
kinds named when `<k>` is above zero. This is information, not a warning: the
human is told once and the session carries on.

**Every subagent dispatch names a `model`**, and a `subagent_type` from the
definitions when this session sees them. An omitted `model` inherits the
session's model, which on a Sekkei, Kikaku, or Kaiseki session is the
strongest family — the exact failure this rule prevents. A kind this session
cannot see is dispatched with `model` alone, and its effort is the session's;
the dispatching role tells the human once per session, in its next line, that
the dispatched effort came from the session's own effort and not the kind's
configured one.

A dispatch whose deliverable is a file names the path, says the agent writes
it in its own turn, and forbids the agent from dispatching agents of its own —
a subagent that fans out ends its turn with nothing written and a reply that
reads as progress. The dispatcher verifies the file, not the reply.

**A limit is a pause, never a model change.**

- No role switches its own session model or effort on a limit, and no
  dispatch is retried on a lower family; the models are what `tanto.json`
  says until the human changes the file.
- On a 429 that names a weekly or daily quota: stop retrying, commit nothing
  half-done, send Kanri `paused: <dispatch> on <family> — resets <time>` (or
  write it in the report's Rulings needed when a report is due), and idle
  with the work in hand. On a per-minute 429: one retry after the interval
  the message names, then the same.
- Kanri records the line in the ledger's Measurements table and tells the
  human the reset time. The pause has no upper bound this skill can state;
  only the human's word ends it.
- When the human says, in Kanri's window and in any words, that the quota is
  back, Kanri may probe the family once with a trivial `default` subagent and
  then sends `continue: <dispatch> — same model`, the dispatch being the one
  the `paused:` line named; the role re-dispatches identically from where it
  stopped. With no `paused:` marker to bind to, Kanri asks the human what to
  continue. A human who speaks in the role's window instead is answered and
  reported as `human-contact:`; a bare 再開 there is ambiguous by
  construction, and the role asks.
- Not detected: a `/model` or `/effort` change mid-run; the rule is protocol.

## Handshake and roster

A Sekkei, Keikaku, or Jisso started with no address on the command line reads
the first data row of `.tanto/roster.md`, which is Kanri's own row, for it,
and so do a Kikaku and a Hosa, whose address argument is optional because the
human opens them and Kanri never requests them.
Kaiseki with no address is standalone and does not shake hands; an attached
Kaiseki always receives the address on the command line.

Send Kanri exactly one message:

```text
handshake role=<role> name=<name [ref]> cwd=<path> model=<model id> effort=<level|unknown> branch=<branch> mode=<auto|unknown> transcript=<absolute path|unavailable>
```

`name [ref]` is what `ListAgents` prints for this session on its first line
("This session is `<name> [<ref>]`").

`effort=` is read from this session's own transcript: the last record of
`type` `assistant`, its `perTurnEffort` field, or its `effort` field when
`perTurnEffort` is absent or is not a quoted string — a `null` value is
present and unreadable, and falls through the same way; `unknown` when the
transcript is unavailable. The same
read is the effort half of the start sequence's model check. Kanri compares
`model=` with `sessions.<role>.model` and `effort=` with
`sessions.<role>.effort`; a mismatch of either is one line to the human, and
the handshake still gets its roster row when only the effort differs — the
effort is the human's to change with `/effort` in that window, and the roster
records what runs. A model mismatch is refused, as today.

`mode=` is what you can see about your own permission mode — `auto` when your
system prompt says auto mode is active, otherwise `unknown`. It is advisory,
and `unknown` is the measured ceiling rather than a gap: a session outside auto
mode carries no statement of which mode is active, only the harness's line that
tools run behind a user-selected one, so nothing better than `unknown` can be
reported and Kanri's warning stays keyed on the absence of `auto` (measured
2026-09-10, issue-15bf).

`transcript=` is the path of this session's own transcript per "The transcript
reading", so that Kanri can record it and, where its session may read that
path, verify a reading it doubts.

Jisso and Keikaku then **wait** for Kanri's reply. It carries the plan path
and the ledger path Jisso cannot start without, and the topic, the spec path,
and the plan path Keikaku cannot start without. Sekkei, Kikaku, Hosa, and
Kaiseki start reading while they wait — the human is in the room, and the
reply arrives as a `<cross-session-message>`.

The roster lives at `.tanto/roster.md`, is written only by Kanri from
`templates/roster.md`, and has Kanri's row first. Columns are Role, Topic,
Name `[ref]`, cwd, Model, Effort, Branch, Mode, Started, Status, and
Transcript. Topic is the topic word Kanri's orders line gave that session, or
`—` for Kanri, Kikaku, Hosa, and a standalone Kaiseki. Status is `live`,
`dead`, `replaced`, `refused`, or `cleared`, the last for a Kikaku or Hosa
row that a re-handshake after a `/clear` has replaced. The keeping rule is
one live session per role and topic; Kanri, Kikaku, and Hosa one each.
`ListAgents` shows name, `[ref]`, kind, and start time — not the cwd, the
model, or the role; the handshake carries those.

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
  first data row of `.tanto/roster.md`.
- **Every other role's address** is known only to Kanri, from the handshake,
  and Kanri is the only session that sends to Sekkei, Keikaku, Jisso,
  Kaiseki, or Hosa. Kikaku is the human's seat: it sends Kanri a
  `decision: <path>` line and Kanri answers, but Kanri never addresses it
  first. A reply copies the envelope's `from` into `to` and needs no name at
  all.

Kanri's address is the first data row of the roster. A message whose first line
is `kanri-address: <name> [<ref>] — handover accepted; the roster's first row is rewritten`
comes from a successor Kanri and replaces Kanri's address from then on; the
roster's first row says the same. A role whose send to Kanri errors re-reads
that row.

## The transcript reading

Every session can measure its own context from its transcript, the file the
harness appends to on disk as the session runs. The **reading** is five
figures from that file, taken by the session itself, and it is the only cost
signal the skill uses. The `tokens left` figure the harness prints is not one:
its unit is not documented as the context window (issue-40ed). The fifth
figure below is a token count, and a documented one: it is the harness's own
`usage` accounting for the turn it just billed.

Locate the file from the scratchpad path the system prompt names,
`<...>/<project slug>/<session id>/scratchpad`: the transcript is
`<config dir>/projects/<project slug>/<session id>.jsonl`, where the config
directory is `$CLAUDE_CONFIG_DIR` when set and `~/.claude` otherwise. Then,
with `T` the transcript path and `$TANTO` the skill's own directory, **both
set in the same tool call as the command**:

```bash
node "$TANTO/scripts/reading.js" "$T"
```

That prints two lines always: the reading, then the effort. Three more are
printed only when asked for, and the sections that ask name the switch:
`--role kanri|jisso` prints the ceiling line, `--presence` the human line, and
`--backstop` the auto-compact line, which needs `--role` because its verdict is
against the ceiling. A second form,
`node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]`,
prints the share of usage spent at a large context across several transcripts,
and Kanri runs it once, at the plan close. Three further switches — `--now`,
`--config`, `--settings` — fix the clock, the personal config and the settings
file; they exist for the tests and for a Kanri verifying a peer's reading, and
no role file passes them.

- **Bytes** and **records** are the file's size and its line count, one JSON
  record per line. A line that does not parse as JSON is counted in records
  and nowhere else, so a truncated last line written while the harness is
  mid-write does not fail the reading.
- **Wake-ups** are the records of `type: user` whose `message.content` is not
  an array carrying a `tool_result` block: one per human message, peer
  message, idle notice, or subagent completion, each the start of a turn that
  re-reads the whole context.
- **Compactions** are the wake-ups whose text begins with the harness's
  phrase — `message.content` when it is a string, the first `text` block's
  text when it is an array. The script parses the record instead of grepping
  the file, because the phrase also appears in tool output and in this file.
  The phrase is the harness's and may change: a reworded one reads as `0`, and
  a compaction the session notices for itself is still the signal it always
  was.
- **Context** is the last `assistant` record's `message.usage`, summing
  `input_tokens`, `cache_creation_input_tokens` and
  `cache_read_input_tokens`, each taken as `0` when absent, and `0` when no
  `assistant` record carries a `usage` object. It is that turn's whole prompt
  in tokens, the cached part included — what the harness billed for that
  wake-up — and it is the one figure of the five that is a token count.
- **Effort** is not one of the five figures. It is the last `assistant`
  record's `perTurnEffort` when that is a string, else its `effort` when that
  is a string, else `unknown` — so a `perTurnEffort` of `null` falls through
  to `effort`, and an unavailable transcript reads as `unknown`. The start
  sequence's check and the handshake's `effort=` take it; the reading itself
  travels without it.

The first line the command prints is the reading, and it travels as it is:
appended after ` — ` to the boundary and exit lines the roles already send,
and written into the batch and Kaiseki reports where their templates have a
slot. A compaction does not shrink the file, and a tool result is stored at
full size, so bytes overstate what the context holds: bytes and records are
compared with each other across sessions and with no token count. `context=`
is the exception, and it is why it was added — it is a token count, it is
compared with the ceiling `roles/kanri.md` and `roles/jisso.md` derive from
`tanto.json`'s `ceiling` map, and it is the one figure in this reading that a
rule acts on.

A session whose transcript is not where this says — another host, a config
directory the environment does not name, a read the session is not permitted
— sends `transcript: unavailable — <one line why>` in its place, which is what
the script itself prints, at exit 0, followed by `effort=unknown` and no
further line. That form is a value the roles send, not a failure, and a
session on which `node` will not run sends it with that as the reason. A
missing ceiling line is no signal — it is read as `under`, and `unavailable`
goes where the verdict would; a missing presence line reads as `absent`, which
is the conservative side. There is no four-figure fallback.

A session whose reading shows a compaction it has not yet reported writes
every item its summary attributes to the human — "the human said", "ruled",
"saw", "confirmed" — one per line, to
`.tanto/<topic>/compaction-<role>-<n>.md` (`<n>` one more than the highest
such file for that role, so that a second compaction or a replaced session
does not overwrite the first), names the file in its next line to Kanri as
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

`/tanto fukki`, typed by the human in a window, and the self-check every
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
  was resumed too, and re-handshakes on its own `/tanto fukki`, finding the
  new first row.

After an editor restart, which resumes every window at once, the human types
`/tanto fukki` in Kanri's window first and then in each other window, in any
order; no address is pasted. A session whose path matches no row is not a
resumed role: `/tanto fukki` says so and stops, and the human runs
`/tanto <role> <address>` there as for a new session.

`/tanto fukki` reads this file and nothing else. The role file is already in
the session's context, which is what a resume preserves. It also re-runs the
Start sequence's twelve-definitions write-and-count (a resume can carry a new
`CLAUDE_CONFIG_DIR`, and re-writing may nudge the harness to re-scan) and says
the result the same way the Start sequence does.

## Messages

- One boss. Only Kanri messages Jisso; Sekkei, Keikaku, Kaiseki, Kikaku, and
  Hosa never do — inbound messages queue and drain in order, and a second
  boss interleaves instructions.
- A message is one line plus a path. Report bodies, rulings, briefs, and plans
  live in files: a message dies with the session, a file survives compaction
  and a VS Code restart.
- Kanri sends every line **without** an idle subscription — batch prompts,
  Kaiseki briefs, and the `exit:` lines alike — and waits for the receiver's
  one-line report. It subscribes — a pure `notify_when_idle`, no message —
  only when an expected signal is overdue, which is the human's observation
  or a wake-up for another reason, since a session holding no subscription
  has no clock; and it treats a notice that arrives before the report as a
  reason to check the workspace, never as the signal: a peer's turn ends
  whenever it dispatches a subagent, so most notices are false idles. The
  `exit:` lines carried a subscription until 2026-09-10, on the reasoning
  that there the idle notice is the forced-exit signal; measured, it woke
  Kanri four times across two exits and signalled nothing, because both
  sessions answered normally and every notice arrived after its answer
  (issue-d725).
- Never poll `ListAgents`; never send "are you done". Check the listing only
  when an expected signal did not arrive.
- A reply copies the incoming message's `from` into `to`.
- At a batch boundary Kanri has verified, Sekkei or Keikaku answers in one
  line, `committed <subject>` or `nothing to commit`, each with its reading
  appended after ` — `; Kanri sends the next batch prompt only after that
  reply, or, when the reply is overdue, after the notice of a subscription
  made then.
- Before the human reviews a spec or a plan, the document's author dispatches
  the **review brief** on `brief.write` — a subagent that reads, and writes
  exactly one file,
  `.tanto/<topic>/review-brief-spec.md` for Sekkei, or `review-brief-plan.md`
  for Keikaku, from `templates/review-brief.md`, in the chat's language —
  checks its form against "The brief's form" below, and sends Kanri one line,
  `review-ready: <document path>; brief: <brief path>`, which waits for
  nothing: Kanri records it in the ledger's Session events and does nothing
  else. The author puts the brief's text verbatim in its review request, with
  both paths. The human's answers to the brief's points are the confirmation
  that review asks for; the document is what the points point into, and the
  human reads it where a point sends them.
- Permission boundaries are per session. Never ask a peer for work that was
  denied in your own session or would be blocked there. Blocked work goes to
  Kanri, which rules on human access.

A defect noticed in a skill goes to the Kanri of the repository that ships that
skill, as a **bug report**: a file written from `templates/bug-report.md` and
one line, `bug-report: <absolute path>`. Kanri is the intake, and its address
is read from the target workspace's roster: the sender reads the first data
row of `<workspace>/.tanto/roster.md` and takes the bare `<name>` before the
bracket of its `Name [ref]` column, the human supplying the workspace's path
where the sender does not know it; the sender checks that name against
`ListAgents` before sending, and asks the human for the address when the
roster is absent — a workspace not yet migrated, or an older skill — or the
name is not listed, since a resumed Kanri carries a new name until it
rewrites its row. The roster is Kanri's to write and the sender's only to
read; the read is of a file outside the sender's own working directory, and
outside auto mode the harness may put a permission prompt for it in the
sender's window — the harness's own prompt, like the model-mismatch stop, and
not a failure of the route. A defect that surfaces in a spec dialogue reaches
Kanri as an `I-n` in `spec-inputs.md`, not as a bug report.

Kanri answers a bug report with one line, in one of five forms:
`triage: issue-<id>`, `triage: redirect — <one line>`,
`triage: kaiseki requested`, `triage: hotfix — <commit subject>`, and
`triage: relayed as I-<n>`.

### The brief's form

The document's author checks the brief's form, not the document: eight
headings — the title, the how-to-answer section, the five numbered sections,
and the unsettled section — present and in that order, the headings
themselves in the chat's language (for a spec, section 5's body is the one
line the template gives, rendered); every point opening with one of the four
tags — confirm, choose, decide, nothing — and every unsettled line saying
whether an answer is needed, and a decide line among them carrying the
`— If unanswered:` clause after that; every point in its parts — the two
before `See:`, then the pointer, and on a choose or decide point the
`— If unanswered:` clause after it, so three parts or four, any of which may
carry the ` — ` separator, as a plan's task headings do; a choose or decide
point without that clause failing the check; every pointer the document's own
heading text, verbatim and untranslated, so that `grep '^#'` on the document
matches it. Dispatch once more if the form fails; if it fails again, send the
brief as it stands and tell the human in one line. Never edit it, and do not
read the document's prose to validate it — `grep '^#'` for its headings is
the whole read you make; a point that misreads the document is caught by the
human's answer or by Kanri's cold read, which stays where it is.

## Human access

The human's counterpart is Kanri. By default a role has no human access:
Jisso and an attached Kaiseki never address the human unless granted, and a
role addresses the human directly only for what needs the human's eyes or
hands — a visual check in a browser or a GUI, an OS dialog, a credential — and
only after Kanri has judged it necessary and granted it for that scope. Four
standing grants exist: Sekkei's spec dialogue and Keikaku's plan dialogue,
each given at that session's creation and named in Kanri's orders line; an
attached Kaiseki's debugging conversation, written in its brief; and Hosa's
chores, named in Kanri's answer to its handshake. Kikaku needs no grant: it
is the human's own seat, and the human in that window is its counterpart by
definition. A standalone Kaiseki has no Kanri, and the human in the room is
its counterpart.

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
`S-n` its shoroku candidates, both in the conductor ledger. The stage word is
`t0`, `t1`, `t2`, or `exit-<role>[-<suffix>]`.

Every stage runs the same four steps, and an exit is that flow applied to one
session:

1. **Candidates.** The session that holds them writes them as a numbered
   list, opening with the line that says what the proposal excludes; an exit
   writes `exit-<role>[-<suffix>]-proposal.md`. Only this step needs a
   resident context.
2. **Recommend.** Kanri dispatches the `shoroku` kind over that file and
   names the output, `<stage>-recommendation.md`: every item once, quoted in
   full, in three groups — Recommended adopt, Recommended reject, Unsure —
   each with its destination and its one-line reason. The same dispatch names
   the brief path, `<stage>-brief.md` beside the recommendation, the template
   `templates/shoroku-brief.md`, and the chat's language; the recommender
   writes both files in one run.
   <!-- markdownlint-disable MD038 -->
3. **Check.** Kanri checks the brief's form by `grep` — the four headings
   present and in order, every `###` item heading's text, its `### ` marker
   stripped, appearing exactly once after `See:` in the brief — dispatches
   the recommender once more
   on a failure and pastes the brief as it stands on a second, then gives the
   human both paths, the three counts, and the brief's text verbatim; the
   human answers by exception; Kanri writes `<stage>-direction.md` beside the
   recommendation, item by item, with the `S-n` rows in the conductor ledger.
   <!-- markdownlint-enable MD038 -->
4. **Apply.** Kanri dispatches the `shoroku` kind again, in apply mode, with
   the recommendation, the direction, and the commit subject; that subagent
   writes the accepted subset per `docs/AGENTS.md`, runs the repository's
   lint on the changed paths — or on the whole repository where the lint
   script takes no path arguments, which satisfies the step — and commits
   once by explicit path in a slot. No session applies the
   accepted subset of its own proposal. Kanri verifies the diff as for any
   commit and marks the `S-n` rows written.

Nothing is adopted between stages, and no item is decided by Kanri alone: the
human sees the whole recommendation, grouped, at every stage. Candidates are
what is not yet in any file — a rejected alternative and its reason, a fact
measured, a defect noticed, an observation about the run — never a
restatement of a spec, a plan, a report, or a ledger. Kikaku and Hosa have no
exit shoroku; the human `/clear`s those windows instead. A standalone Kaiseki
has no Kanri, and its role file says how.

The lines, each sent without an idle subscription, like every other tanto line,
and in one of two forms. For Jisso, a Kaiseki, and Kanri's own exit, Kanri
sends `exit: propose your shoroku; write it to <path>`; the session writes the
proposal, runs the resume self-check, and answers
`exit proposal: <path> — <reading>`. For a **Sekkei or a Keikaku at its own
final boundary**, no `exit:` line is sent: that seat writes the proposal
unasked as the last act of the boundary and names it in the same report line —
`spec accepted: <spec path>; exit proposal: <path> — <reading>` for Sekkei,
`coldread answered: <pointer, one per question, or none>; exit proposal: <path> — <reading>`
for Keikaku — and then idles. Only the timing moves: the proposal is written
in either flow, the recommender runs once over it, the human's check is on the
recommendation, and the apply is a subagent's. What the move buys is the gap —
a seat whose only remaining act is its own exit no longer waits across the
one-hour prompt-cache TTL for a line that asks for it, and pays no cold read to
answer (issue-19d4). An exit that falls **away** from that boundary — a
compaction in the reading, a replacement, the human not wanting the plan now —
takes the `exit:` line like every other role.
Kanri checks that the file exists and
opens with the exclusion line and a numbered list — a direct read, since the
proposal carries no headings for `sections` to select by — and
dispatches the recommender at once. When the recommendation and its brief
are on disk, Kanri reads the brief's `## Unsure` group by `sections`: a line
there carrying a "could not be read as written" question is one question
back to the session, one line, answered by a rewrite of the proposal;
otherwise Kanri asks the human, as a numbered list, to delete the session.
The session idles through
one subagent run, and steps 3 and 4 run without it — the human's check works
on the recommendation's full quotation of each item, which is what the
session would have been asked about. A session that has stopped
answering is past answering, and Kanri learns it the way it learns of a missing
batch report — the human says the session is gone, or Kanri's window wakes for
another reason and the answer has not arrived. Kanri then treats the exit as
forced — the roster's Events line says the exit shoroku did not run and what
was lost, as far as Kanri knows — asks the human to delete it, and continues.
Jisso idles through the proposal and one recommender run, not through a
boundary.

The file pattern is `exit-<role>[-<suffix>]`, with the suffix the batch letter
for Jisso (`exit-jisso-B`, a Jisso leaving at batch B's boundary), the case
number for Kaiseki (`exit-kaiseki-1`), absent for Sekkei (`exit-sekkei`) and
for Keikaku (`exit-keikaku`), and the date and the bare name for Kanri
(`exit-kanri-<YYYY-MM-DD>-<name>`); the conductor ledger's Stage values mirror
it. The files live in the topic directory, `.tanto/<topic>/`, for Jisso,
Sekkei, Keikaku, and an attached Kaiseki, and next to the roster, at
`.tanto/`, for Kanri. Kanri's own exit has a recommendation and a direction
file like every other, with the human checking as at every stage.

The apply subagent's commit subject begins with `docs: exit shoroku` or
`docs: T<n> shoroku` — `docs: exit shoroku for jisso at B`,
`docs: T2 shoroku for <topic>` — which is the fixed prefix the whole-branch
review package excludes.

## Artifacts

| Path | Writer | Readers | Content |
| --- | --- | --- | --- |
| the spec, at the path the orders line names — by default `docs/superpowers/specs/<date>-<topic>-design.md` | Sekkei | Kanri, Keikaku, Jisso | the spec; committed by Sekkei, or by the Keikaku created after the merge when it was a draft |
| `.tanto/<topic>/spec-draft.md` | Sekkei | the spec reviewer, Kanri, Keikaku | the spec while another topic's batch is in flight; nothing is committed and no branch is cut until Keikaku commits it at its final path |
| the plan, at the path the orders line names — by default `docs/superpowers/plans/<date>-<topic>.md` | Keikaku | Kanri, Jisso | the plan; committed; carries Global Constraints, a Batches section, and how a batch is verified |
| `.tanto/roster.md` | Kanri | all roles; a bug-report sender, its first data row | one row per role |
| `.tanto/roster-archive.md` | Kanri | Kanri | from `templates/roster-archive.md`; the roster's dead, replaced, refused, and cleared rows with their last readings, and the closed plans' Events lines, appended at each plan close |
| `.tanto/kanri-handover.md` | the outgoing Kanri | the successor Kanri | the handover; deleted by the successor once accepted |
| `.tanto/inbox/<date>-<slug>.md` | Kanri | Kanri | a bug report received, with its Triage section |
| `.tanto/kikaku/<YYYY-MM-DD>-<slug>.md` | Kikaku | Kanri | one decision from the human's consultation, from `templates/kikaku-decision.md`; named to Kanri as `decision: <path>`, and from there a T0 input, an `I-n`, or an `S-n` source |
| `.tanto/<topic>/kanri.md` | Kanri | Sekkei, Keikaku, Jisso, Kaiseki, Kikaku, Hosa | the conductor ledger; it never moves |
| `.tanto/<topic>/spec-inputs.md` (optional) | Kanri | Sekkei | scope inputs the human gave Kanri during spec work, numbered `I-n`, each with Kanri's advisory notes |
| `.tanto/<topic>/dialogue.md` | Sekkei | Kanri, the brief writer, T1 | the spec dialogue: each question Sekkei put and the human's answer, verbatim, in order |
| `.tanto/<topic>/review-brief-spec.md`, `.tanto/<topic>/review-brief-plan.md` | the brief writer the document's author dispatches | the author, then the human; Kanri by the path in `review-ready:` | the review brief, from `templates/review-brief.md`, in the chat's language |
| `.tanto/<topic>/plan-dryrun.md` | Keikaku | the plan reviewer, Kanri | from `lint` and `replay` — the two commands, each one's output, and Keikaku's ruling on every failure |
| `.tanto/<topic>/coldread.md` | the `plan.coldread` subagent Kanri dispatches | Kanri, by `sections` | the cold read of the committed plan: a numbered list of open questions, or `none`; Kanri sends Keikaku one numbered message carrying all of them, or `coldread: none`, and Keikaku answers with one `coldread answered:` line |
| `.tanto/<topic>/batch-<X>-prompt.md` | Kanri | Jisso, human | the same text as the `SendMessage`, so the human can paste it if the message did not arrive |
| `.tanto/<topic>/batch-<X>-report.md` | Jisso | Kanri | fixed skeleton |
| `.tanto/<topic>/kaiseki-<n>-brief.md` | Kanri | Kaiseki | fixed skeleton |
| `.tanto/<topic>/kaiseki-<n>.md` | Kaiseki | Kanri, Jisso | fixed skeleton |
| `.tanto/<topic>/shoroku-proposal.md` | Jisso | Kanri, the recommender | the T2 proposal, written to a file instead of printed |
| `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | the exiting session | Kanri, the recommender | the exit shoroku proposal, opening with the line that says what it excludes |
| `.tanto/<topic>/<stage>-recommendation.md`, or `.tanto/t0-recommendation.md` and Kanri's own exit at `.tanto/` | the `shoroku` recommender Kanri dispatches | Kanri, the human, the apply subagent | every candidate once, quoted in full, in three groups — Recommended adopt, Recommended reject, Unsure — each with its destination and its one-line reason |
| `.tanto/<topic>/<stage>-brief.md`, or `.tanto/<stage>-brief.md` for T0 and Kanri's own exit | the `shoroku` recommender, in the same dispatch as the recommendation | Kanri, by `grep` for its form and by `sections` for `## Unsure`; the human, verbatim | the check brief, from `templates/shoroku-brief.md`, in the chat's language: one line per item, grouped as the recommendation groups them, each pointing at the item's `###` heading |
| `.tanto/<topic>/<stage>-direction.md`, beside the recommendation | Kanri, from the human's answer | the apply subagent | what the human accepted, item by item; the apply never runs without it |
| `.tanto/<topic>/compaction-<role>-<n>.md` | the compacted session | Kanri | every item a compaction summary attributes to the human, one per line, rewritten with the human's answers |
| `.tanto/kaiseki/kaiseki-<n>.md` | a standalone Kaiseki | the human | its report, outside any run |
| `.superpowers/sdd/<plan-basename>/progress.md` | Jisso, through the SDD skill | Kanri | the SDD ledger; Kanri reads it and never writes it; the one artifact tanto reads under `.superpowers/` |
| `.tanto/.gitignore` holding `*`, and `.tanto/.markdownlint-cli2.yaml` holding `config:` / `default: false` | Kanri at start, a standalone Kaiseki, or a bug-report writer — whichever finds them absent first; never overwritten | git; the editor's markdownlint | keeps everything above untracked, so nothing is ever staged, and keeps the editor quiet on files the commit path never lints |
| `$CLAUDE_CONFIG_DIR/tanto.json` | the user | every role at start, Kanri at each handshake | the personal expected-model config |
| `~/.claude/agents/tanto-*.md`, or `$CLAUDE_CONFIG_DIR/agents/` when that variable is set | every role at its start, from the merged config | the harness, at the next session start | one definition per kind, from `templates/agent.md`; a definition is dispatchable only from the sessions started after it was written |

Templates are copied and filled, never restated in prose. Fourteen of them:
`templates/roster.md`, `templates/roster-archive.md`, `templates/kanri.md`,
`templates/kanri-handover.md`, `templates/bug-report.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/review-brief.md`, `templates/shoroku-brief.md`,
`templates/tanto.json`, `templates/kikaku-decision.md`, and
`templates/agent.md`.

The skill also ships two executables. `scripts/passage-check.js` is the
instrument a plan that carries passages checks itself with, run by Keikaku in
place of an agent dry run, by Jisso at every batch boundary, by Kanri at every
boundary it rules on, and by the whole-branch reviewer; its seven subcommands
are `lint`, `replay`, `diff`, `verify`, `sections`, `frame`, and `boundary`,
and `roles/keikaku.md`, `roles/jisso.md` and `roles/kanri.md` name them.
`scripts/reading.js` is the instrument every role measures itself with, run at
every boundary and every exit; its two forms are the reading of one transcript
— with `--role kanri|jisso`, `--presence` and `--backstop` each adding a line,
and `--now`, `--config` and `--settings` fixing what the tests and a verifying
Kanri need fixed — and `--share` over several transcripts, which Kanri runs at
the plan close. Both are Node with no dependencies, and both have their tests
beside them, run by `node --test`. Their paths are written skill-relative,
like every other path in
this skill, and the role files spell the runnable form `$TANTO`: set it to the
skill's own directory, which the harness names when it invokes the skill,
**in the same tool call as the command** — shell state does not persist
between calls, and an unset `$TANTO` makes every one of these commands read a
path at the filesystem root. Neither is ever invoked bare —
neither file carries a shebang, so `node` is part of the command and not
decoration.

`.tanto/<topic>/` is created by Kanri when the topic opens — its first file is
the conductor ledger — and holds every per-topic file from then to the plan's
close; nothing in it moves when the plan lands. The SDD ledger is the one
artifact tanto reads under `.superpowers/sdd/`: the SDD skill writes it
there, and the conductor ledger's Plan section and every batch prompt name
its path.

## Rules

1. One boss: only Kanri messages Jisso.
2. Files between the sessions: the spec, the plan, the conductor ledger, the
   spec inputs, the Kaiseki reports, and the shoroku recommendations and
   directions are the only channel. Every role is on it, not only the ones on
   the top family — Keikaku and Hosa hand over files as the others do.
3. State in files, not in memory: the roster and the ledgers. Memory holds at
   most a pointer to them. A role's authority is this file, its role file,
   Kanri's lines, and the batch prompts; a project memory rule that would add
   a dispatch or a document is put to Kanri as one line before it is acted
   on, since the same memory is loaded by every session in the repository.
4. One Kanri, one Kikaku, and one Hosa per repo; one Sekkei, one Keikaku, one
   Jisso, and one Kaiseki per topic. A session is bound to its cwd —
   CLAUDE.md, memory, and permissions all come from it.
5. Kanri does not edit tracked files while a batch runs, and writes under
   `docs/` only while Jisso is idle or absent. Sekkei and Keikaku write only
   under the spec and plan directory the orders line names — by default
   `docs/superpowers/` — and `.tanto/`, at any time, and, while a batch is in
   flight, commit only at a batch boundary Kanri has verified; while no batch
   is in flight each commits whenever its work is ready. Kikaku writes under
   `.tanto/kikaku/` and nowhere else.
   Hosa edits a tracked file only in a slot Kanri gives, and commits it there.
   Kaiseki edits only to instrument and leaves the tree clean. None of these
   five writes under the `docs/` document-management tree. A modification any
   of these finds in the shared tree that it or its own subagent did not make
   is not its to discard: it is reported — a `task.implement` subagent tells
   its role one line, the role tells Kanri one line — and only Kanri decides
   whether it is stray.
6. Every subagent dispatch names a `model` from `tanto.json`; none omits it,
   and it names a `subagent_type` from the definitions at
   `~/.claude/agents/tanto-<object>-<act>.md` when this session sees them.
7. Small batches of three or four tasks. Each boundary is a ruling checkpoint
   and a lifecycle checkpoint.
8. Fix rounds stop at the Kaiseki trigger when the cause is unknown; root cause
   before more fixing.
9. At most one top-family session active at once, Kikaku excepted as
   human-paced: Sekkei pauses while Kaiseki is active, which is that rule's
   whole content today; Keikaku and Hosa, on the cheaper families, do not
   count. A second one under concurrent topics is a Kanri ruling, recorded as
   `R-n`.
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
    Keikaku before it, Sekkei before that — read the skill as it stands then,
    and the authority sentence above is what covers them.

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

All roles share one working tree and one branch. Sekkei, or Keikaku when the
spec was a draft, cuts the branch from `main` before the first commit, named
after the topic; Jisso continues on it;
the merge decision is the human's. **No worktree by default** — Kanri verifies
the tree in place and the human can watch it. Every batch prompt restates that
as a Kanri directive. A modification in the shared tree that a session or its
own subagent did not make is not its to discard (Rule 5): it is reported, never
run through `git checkout --` or `git clean` on its own judgment, and only
Kanri decides whether it is stray.

`.tanto/<topic>/` outlives the plan, and so does the SDD workspace
`.superpowers/sdd/<plan-basename>/`. Jisso never deletes either, and nothing
asks the human to delete either: after T2 the two have the same standing —
untracked, local to one machine, useful only for a later re-read — and disk
is the only cost (issue-12d3).

## Now read your role file

- `kanri` → `roles/kanri.md`
- `sekkei` → `roles/sekkei.md`
- `keikaku` → `roles/keikaku.md`
- `jisso` → `roles/jisso.md`
- `kaiseki` → `roles/kaiseki.md`
- `kikaku` → `roles/kikaku.md`
- `hosa` → `roles/hosa.md`

Read exactly one. The other six are not yours.
