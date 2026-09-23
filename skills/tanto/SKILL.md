---
name: tanto
description: Use when the user starts or joins a tanto multi-session orchestration run in Claude Code, invoked as `/tanto <role>`, `担当して <role>`, or `tantoして <role>`, where the role word is kanri (管理), sekkei (設計), keikaku (計画), jisso (実装), kaiseki (解析), kikaku (企画), or hosa (補佐) in hiragana, kanji, or romaji. Drives one implementation plan through separate sessions, background and interactive, that message each other, composing superpowers brainstorming, writing-plans, subagent-driven development, systematic-debugging, and the shoroku write-out. Claude Code only, because it needs ListAgents and SendMessage.
argument-hint: kanri | sekkei | keikaku | jisso | kaiseki | kikaku | hosa | fukki
---

# tanto

担当 — "take charge of." Multi-session orchestration for one implementation
plan. Each role is its own session, background or interactive, on the same
repository and the same branch; the sessions address each other by name with
`SendMessage` and hand real work over as files.

`tanto` is **Claude Code only**. It needs `ListAgents` to see the live sessions
and `SendMessage` to address them. No other Agent Skills host provides both.

This file is the shared contract. Every role reads it, then reads exactly one
`roles/<role>.md` — never the other six.

## The roles

| Role | Count | Owns | Talks to |
| --- | --- | --- | --- |
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, the recommendations and the directions, the bug intake when no Hosa is live, the spawn, stop, and attention requests, the kessai, and the `release:` lines to tab seats | human, Sekkei, Keikaku, Jisso, Kaiseki, Hosa; Kikaku at its handshake only |
| Sekkei (設計) | 0 or 1 per topic | the spec and its review | Kanri; the human by grant |
| Keikaku (計画) | 0 or 1 per topic | the plan, its dry run, and its review | Kanri; the human by grant |
| Jisso (実装) | 1 live per topic, spawned per batch — a self-editing plan's all at its landing | one batch of the SDD run each, its batch report and its commits; the last one, the T2 shoroku proposal | Kanri; the human by grant |
| Kaiseki (解析) | 0 or 1, on demand | root-cause reports; never a fix; no commit | Kanri; the human by grant |
| Kikaku (企画) | 0 or 1, opened by the human | the consultation, and the decision files under `.tanto/kikaku/` | the human; Kanri, one `decision:` line |
| Hosa (補佐) | 0 or 1, opened by the human | the human's small chores, the bug intake, the hotfix lane's edits Kanri hands over in a slot Kanri gives, and the kessai relay | the human; Kanri |

## Invocation

`/tanto <role> [<key>=<value> …]`, or `担当して <role>` / `tantoして <role>`.

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
handshake — and runs "Resuming" below. It is typed in a **tab seat**; a
terminal seat is resumed by the launcher, `tanto`, and is told to run
`/tanto fukki` only when it is the Kanri the human then attaches to.

There is no address argument: Kanri's address is the roster's first data
row, for every role, and a workspace with no roster yet has no peer to
bootstrap — its first session is the Kanri the launcher spawns, and Kanri
writes the roster. The keys carry a spawned seat's orders, which a tab seat
gets in Kanri's reply to its handshake instead:

| seat | the prompt |
| --- | --- |
| Kanri, first or successor | `/tanto kanri` — the handover file, when one exists, is the Start section's Handover case |
| Keikaku | `/tanto keikaku topic=<topic> spec=<path> plan=<path> ledger=<path>` — `ledger=` only when another topic's batch is in flight, naming that ledger |
| Jisso, an ordinary plan | `/tanto jisso batch=<.tanto/<topic>/batch-<X>-prompt.md>` — the prompt file is its orders |
| Jisso, a plan that edits this skill | `/tanto jisso queue=<topic>` — reads nothing and waits for the one line `batch: <path>` |
| Kaiseki, attached | `/tanto kaiseki topic=<topic>` — the key is what makes it attached; `/tanto kaiseki` with no key is standalone Kaiseki, roster or no roster |
| shoki | not a `/tanto` invocation at all: the prompt is the one line `brief: <.tanto/<topic>/shoki-brief.md>`, and shoki reads no role file and no `SKILL.md` |

## Start sequence

Two steps, in this order, before any role work.

### 1. Model check

Read the expected-model config below and compare `sessions.<role>.model` with
your own model id, which your system prompt states; a configured family
matches when it occurs inside that id. On a mismatch in a **tab seat**, tell
the human what was expected and what is running, ask them to run
`/model <family>` and then `/tanto` again, and stop. A mismatch in a
**spawned seat** never stops it: it appends `model: expected <a>, running
<b>` to the first tanto line it sends, and Kanri writes an `attention`
request on reading it (decision-08bc: the mismatch reaches the human either
way).

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
instead. A **tab seat** — Kikaku, Hosa, Sekkei, Kaiseki — does the handshake
below. A **spawned seat** — Keikaku, Jisso, and a spawned Kanri —
sends none: its role, topic, model, effort, branch, and mode are in the
request Kanri wrote, and its `sessionId`, name, cwd, and transcript are in
the result the spawner wrote back. It runs the model check and the
definitions write-out, then does what its keys say. Shoki is neither: its
prompt is not a `/tanto` invocation, it reads no role file and no contract,
and it runs no start sequence at all — its brief is the whole of it.

## The expected-model config

Three files, each overlaid on the one before it and the last one winning: the
built-in defaults at `templates/tanto.json` in the skill; the personal
`$CLAUDE_CONFIG_DIR/tanto.json`, or `~/.claude/tanto.json` when that variable
is unset; and the project `<cwd>/.claude/tanto.json`. `<cwd>` is the session's
working directory — the one rule 4 binds the session to, and the one the
roster's cwd column records. The skill does not search upward for a repository
root, so a session started outside the repository root reads no project file
and says so. Whether a repository commits its own file is that repository's
decision: the skill only reads it, requires it tracked no more than it ignores
it, and ships no `.local` variant.

Three maps, three mechanisms. Every value of the first two maps is
`{ "model": <family>, "effort": <level> }`, or a bare string, which sets
`model` and leaves `effort` to the layers below.

- `sessions.<role>` is **advisory**. The checks above and Kanri's handshake
  check compare against it, read at the moment of each comparison — each
  file's presence as much as its content, since a personal or a project
  override can be created, edited, or deleted at any time, and "it existed
  when I last checked" is never evidence that it exists now. Nothing switches
  a session's model or its effort. Its eight keys are the seven roles and
  `sessions.shoki`, the scribe the close spawns, which is a seat with a
  family and an effort and no role file; the launcher reads
  `sessions.kanri` from it through `reading.js`'s `loadSessions`, and Kanri
  reads the rest when it writes a spawn request.
- `subagents.<kind>` is **effective**. Its `model` goes into the `model`
  parameter of every subagent that role dispatches, and its `effort` into the
  agent definition below. The fifteen kinds are `task.implement`,
  `task.escalate`, `task.review-spec`, `task.review-quality`, `plan.draft`,
  `plan.review`, `plan.coldread`, `spec.review`, `branch.review`,
  `boundary.verify`, `brief.write`, `shoroku.recommend`, `shoroku.apply`,
  `shoroku.review`, and `default`.
- A key inside `subagents` whose `<object>` is a **skill name** and whose
  `<act>` is one of that skill's modes means "run that mode of the skill in a
  subagent on that model instead of inline". When the key is absent, the mode
  runs inline on the session's model. `shoroku.recommend`, `shoroku.apply`,
  and `shoroku.review` are the three built-in skill-name keys, naming the
  `shoroku` skill's recommend and apply modes and the review shoki runs over
  its own diff before it reports; any other is a personal addition.
- `ceiling` is **effective** in the sense `subagents` is: `scripts/reading.js`
  reads it, and the verdict `roles/kanri.md` acts on comes out of it — Jisso's
  is measured and kept, and acts on nothing, since one Jisso runs one batch.
  `ceiling.kanri` and `ceiling.jisso` are each
  `{ "batches": <N>, "per_batch": <tokens> }` — how many batches of measured
  consumption that seat may grow by above its own measured baseline, and what
  one batch costs it. `ceiling.presence_minutes` is the window inside which
  the human's last turn in Kanri's own transcript still counts as present —
  **informational only**: `reading.js --presence` still prints the verdict
  and the ledger still records it, and no rule acts on it, the handover
  having lost its presence gate — and
  `ceiling.share_threshold` the context above which a wake-up's usage counts
  toward the share Kanri reports at the plan close. A `ceiling.<role>` for any
  role but those two is an unknown key: Kanri is the one seat the ceiling
  replaces, because it is the one that runs a whole plan of batches; Jisso's
  line is kept for the archive, its rotation being its replacement; and
  every other role measures and sends the five figures and is replaced on
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

The skill ships built-in defaults at `templates/tanto.json`, decided
per-kind rather than off one ladder: the one-shot kinds a topic pays for
once — `plan.review`, `plan.coldread`, `branch.review`, `spec.review`,
`shoroku.recommend` — buy the top family, and the resident seats that carry
a whole plan or session — Kanri, Sekkei, Keikaku, Jisso, Hosa — run on the
cheaper families, with Sekkei's effort alone raised to `max`. The
resident-side `boundary.verify`, dispatched once per batch boundary in
Kanri's place, runs there too, at `high`. Kikaku, which
the human paces and rule 9 excepts, and Kaiseki, opened on demand, are the
two seats that stay on the top family regardless. The ladder
`fable > opus > sonnet > haiku` (as of 2026-09) still orders the families
for the `subagents.task.escalate`-above-`subagents.task.implement` check
below. Read the
personal file and overlay it on the defaults **field by field**, then read the
project file and overlay it on that result the same way: a personal
`{"effort":"medium"}` under `subagents.task.implement` changes that effort and
keeps the default model, and a project `{"effort":"xhigh"}` under
`sessions.sekkei` changes that one effort and keeps the model of the layer
below. A partial file is complete at either layer; an absent file is the case
where every key comes from the layers below it. The `ceiling` map overlays the
same way and at the same granularity: a personal
`{"ceiling": {"kanri": {"batches": 1}}}` sets Kanri's batch count to 1 and
leaves every other value of all three maps alone. A key that names no role, no
kind and no ceiling field — an older file's, for instance — is reported in
your start line as `unknown key <name> in <path>, ignored` —
`subagents.shoroku`, the kind's name before it was split into
`shoroku.recommend` and `shoroku.apply`, is one such key, and a personal file
that still carries it sets neither half — or as
`unknown key ceiling.<name> in <path>, ignored` for one under that map, which
`scripts/reading.js` writes on `stderr` every time it reads a file; either
way it is otherwise ignored.

Then check that `subagents.task.escalate` sits above
`subagents.task.implement` on that ladder — SDD's fix rounds 4-5 are an
escalation only if it does.

<!-- markdownlint-disable MD038 -->
A kind's effort cannot ride in a dispatch; it rides in an agent definition,
which the harness reads when a session starts. So, after reading the merged
config and before any other work, make two passes.

**User scope.** Write for each of the fifteen kinds the file
`~/.claude/agents/tanto-<object>-<act>.md` — the kind's name with its `.`
turned into a `-`, under `$CLAUDE_CONFIG_DIR/agents/` when that variable is
set — from `templates/agent.md`, when the file is absent or its content
differs from what the template renders. A file that already matches is left
alone. `tanto-shoroku.md` in that directory, the definition of the kind
before it was split, is removed in the same pass when it exists, so that no
session is offered a seat the config no longer has; the same removal runs at
the project scope when that scope has the file. This rendering takes its
effort from the merge of the **built-in and
personal layers only**, never from the project file, and its `<scope>` slot
renders empty. That merge is the one every role in every repository computes
identically for the same personal file, and it is what keeps the user-scope
files stable across repositories: a project's effort written where every other
project reads it is the failure this whole mechanism exists to prevent.

**Project scope.** Then compute, for each of the fifteen kinds, the three-layer
effort. For every kind whose three-layer effort **differs** from the
user-scope effort, write `<cwd>/.claude/agents/tanto-<object>-<act>.md` from
the same template with that effort and with the `<scope>` slot rendered as
` Project-scope copy for this repository.` — one leading space, and no other
change from the user-scope rendering above, which renders the same slot as
the empty string — when that file is absent or its content differs; a file
that already matches is left alone. A model difference alone produces no project-scope file: the model
rides in the dispatch's own `model` parameter, and a definition carries none.
For every kind whose three-layer effort does **not** differ, remove
`<cwd>/.claude/agents/tanto-<object>-<act>.md` if it exists. That removal
sweep runs whenever `<cwd>/.claude/agents/` exists, whether or not a project
file does, and only those fifteen names and the retired `tanto-shoroku.md`
are ever removed — nothing else under
that directory is touched. Without it, a project file edited to drop an effort
would leave a project-scope copy that keeps winning while your start line
reports the personal effort, which is the silent override the requirement
forbids. When the project pass writes its first definition and
`<cwd>/.claude/agents/.gitignore` is absent, write that file with the two
lines `tanto-*.md` and `.gitignore`; when it exists it is never overwritten,
whatever it holds, and it is not removed when the last project definition is.
When the project file is absent, or sets no effort that differs, the write
half writes nothing and creates no directory; the removal half still runs.
<!-- markdownlint-enable MD038 -->

The rendered file is `name`, a `description` saying the seat is dispatched by
name through `subagent_type` and is never to be selected from that
description, and `effort`, over one paragraph telling the subagent to follow
the prompt of the dispatch that named it. It carries no `model` and no
`tools`: the dispatch's own `model` parameter binds the family and takes
precedence over a definition's by the Agent tool's contract, and the prompts
assume every tool. The description is protocol against the harness's
proactive agent selection, not enforcement.

Then read your own system prompt's list of available agent types and count
the fifteen names in it, and among them the ones whose description carries the
project-scope clause. A definition written during a session is not visible to
that session at either scope, so the first session on a machine that writes
them dispatches without them, and a project effort takes effect from the
second session started in that repository after the project file changed;
from then on a dispatch names its kind as
`subagent_type: tanto-<object>-<act>` — or `tanto-<kind>` for a kind with no
dot in its name, which is `tanto-default`. A kind visible at user
scope but not yet at project scope dispatches with the user-scope effort, and
the dispatching role says so once, as it does for a kind it cannot see at all.

Say once, in your start line: the two config files with their state, as
`personal <path> present` or `personal <path> absent`, and as
`project <path> present` or `project <path> absent`; which fields came from
the project file, at the granularity of a field — for instance
`project: subagents.task.implement.effort, ceiling.kanri.batches` — which
fields came from the personal file, and that the rest are built-in defaults,
or `all keys built-in defaults` when both files are absent; the unknown keys,
each named with its file; the ladder result if the check failed; and
`agents: <n> current, <m> written, <k> not visible to this session; project: <p> current, <q> written, <r> removed, <s> in effect`,
with `<s>` the number of the fifteen names whose description in this session's
own agent list carries the project-scope clause, and with the kinds named when
`<k>` is above zero. The `project:` half is printed even when all four of its
numbers are zero, so that a start line always says which scope the session
runs on. This
is information, not a warning: the
human is told once and the session carries on.

A field the project file sets to the same value the personal file sets is
reported as the project's: the report is about where the effective value was
read from, and precedence decides that.

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

This is a **tab seat's** act. Kikaku, Hosa, Sekkei, and an attached Kaiseki
read the first data row of `.tanto/roster.md`, which is Kanri's own row, and
send it the one line below. A spawned seat sends none: the request that
created it carried its orders, and the result carried its identity. A
Kaiseki started with no `topic=` key is standalone and does not shake hands,
roster or no roster.

Send Kanri exactly one message:

```text
handshake role=<role> topic=<topic|—> name=<name [ref]> cwd=<path> model=<model id> effort=<level|unknown> branch=<branch> mode=<auto|unknown> transcript=<absolute path|unavailable>
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
records what runs. A model mismatch in a tab seat's handshake is refused, as
today; a spawned seat's mismatch is not refusable — it arrives appended to a
line the seat has already acted on — and becomes an `attention` request
instead.

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

Sekkei, Kikaku, Hosa, and an attached Kaiseki start reading while they wait —
the human is in the room, and the reply arrives as a
`<cross-session-message>`. Keikaku and Jisso wait for nothing and no longer
appear here: both are spawned, both take their orders from the keys of their
own prompt, and neither sends a handshake to be answered.

The roster lives at `.tanto/roster.md`, is written only by Kanri from
`templates/roster.md`, and has Kanri's row first. Columns are Role, Topic,
Name `[ref]`, cwd, Model, Effort, Branch, Mode, Started, Status, and
Transcript. Topic is the topic word the session's own orders gave it — a
tab seat's orders line, a spawned seat's own prompt keys — for a Jisso,
the topic whose queue it was spawned into: the plan whose
batches are in flight, or, with none in flight, the plan whose landing
requested the queue, since the shared checkout carries one topic's batches
at a time and the next plan's queue opens at its predecessor's close — or
`—` for Kanri, Kikaku, Hosa, and a standalone Kaiseki. The Status column
carries one of seven
words: `queued` a Jisso of a skill-editing plan waiting for its batch prompt;
`live`, which may carry the suffix `(idle since <HH:MM>)`; `stopped` a
terminal seat the spawner stopped on Kanri's request or the spawner's guard
stopped, its conversation kept; `cleared` a tab seat Kanri released with
`release:`, or whose `/clear` a `no-role` reply revealed; `replaced` a
Kanri that handed over; `dead` a session the census no longer lists;
`refused` a handshake that got no row. A terminal seat's row is written from
the spawner's result file rather than from a handshake — by
`boundary.js record --seat` for a Jisso, by Kanri's own hand for a Keikaku
or a successor — and a row that does not exist yet while its seat works is
not an error. The keeping rule is one live seat per role and topic; Kanri,
Kikaku, and Hosa one each. `ListAgents` shows name, `[ref]`, kind, and start
time for every session on the machine — not the cwd, the model, or the
role; the handshake carries those, and the census places a session under
this repository by its cwd.

**The census.** A session is its `sessionId`, and a roster row's is the
basename of its Transcript column without `.jsonl`. Every match of a
session to a row — a handshake, `/tanto fukki`, Kanri's start, the census —
compares `sessionId`s, never a name, a `[ref]`, or a full path: a name and
a `[ref]` pass to another session across a `/clear`, one file has two paths
under a changed config directory, and a transcript moves when its session
enters a worktree. `node "$TANTO/scripts/boundary.js" census` lists every
session under the repository, the tab seats included, and Kanri marks a
`live` or `queued` row whose `sessionId` it does not list `dead` on that
signal alone — no timeout, no inference, no name — except while a restart
is being recovered (`roles/kanri.md`). A listing that fails is no signal,
and nothing is marked on it. A send error is a reason to run the census,
not a signal of its own: a send that errors to a session the census still
lists is a message failure, the row stays, and Kanri tells the human in one
line.

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
  and never pasted from a file. Every `to` value and every "Send to" blank
  carries the bare name — no command line carries an address at all (there
  is no address argument, "Invocation" above).
- **Kanri's address** is the first data row of `.tanto/roster.md`,
  read at the moment of sending. No role caches it, no line announces it,
  and no command line carries it. A workspace whose roster does not exist
  yet has no peer to bootstrap: its first session is the Kanri the launcher
  spawns, and that Kanri writes the roster.
- **Every other role's address** is known only to Kanri, from the handshake,
  and Kanri is the only session that sends to Sekkei, Keikaku, Jisso,
  Kaiseki, or Hosa. Kikaku is the human's seat: it sends Kanri a
  `decision: <path>` line and Kanri answers, but Kanri never addresses it
  first. A reply copies the envelope's `from` into `to` and needs no name at
  all.
- **Kanri sends only to the names of `live` roster rows** — never to a
  `queued` Jisso, which reads Kanri's row when its prompt wakes it, and never
  to a `cleared` one, which is a bare window. The roster
  is the address book; `ListAgents` confirms that a name is listed and
  nothing more. A window keeps its name and `[ref]` across a `/clear`
  (measured 2026-09-16), so a listed name is no evidence that a role is
  behind it.

Kanri's address is the first data row of the roster,
read at the moment of sending. A role whose send to Kanri errors, or gets
`no-role` back, holds its line and re-sends it to that row, read fresh, at
its next wake-up. No line announces a successor's address: a window keeps its
name and `[ref]` across a `/clear` (measured 2026-09-16), so the row the
successor rewrites already holds the address every peer would have been told.
On Kanri's side, a peer line it receives and does not answer in the same turn
becomes the ledger's `unanswered: <from> — <line>` events line, written
through `record --event` and paired with `answered: <from> — <line>` when it
is answered.

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

That prints three lines always: the reading, the effort, then
`ttl=5m|1h|unknown`, which says which cache regime the session is in: among
the wake-ups whose gap since the previous record is between 5 and 60 minutes,
the most recent one decides, cold reading `5m` and warm `1h`, and no such
wake-up yet reading `unknown`. That line travels nowhere by itself — the
reading appended to a boundary or an exit line is the first line only — and
reaches a reader through the boundary's verdict file and the ledger's
Measurements per-boundary entry. Three more are
printed only when asked for, and the sections that ask name the switch:
`--role kanri|jisso` prints the ceiling line, `--presence` the human line, and
`--backstop` the auto-compact line, which needs `--role` because its verdict is
against the ceiling. A second form,
`node "$TANTO/scripts/reading.js" --share <transcript> [<transcript>...]`,
prints the share of usage spent at a large context across several transcripts,
and Kanri runs it once, at the plan close. Four further switches — `--now`,
`--config`, `--project-config`, `--settings` — fix the clock, the personal
config, the project config and the settings file; they exist for the tests and
for a Kanri verifying a peer's reading from another working directory, and no
role file passes them.

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
none of those items beyond finishing the task in hand. Three sessions have
no Kanri to answer: Kanri itself, whose own case is its handover file; a
standalone Kaiseki, which puts the items to the human in its own window;
and a Hosa, whose counterpart under its chores grant is the human in its
own window — it puts the items there before its next job, and Kanri learns
of the compaction from the count in its next reading.
What the harness summarizes is not the human's words; the human's words
are in the dialogue file, the ledger, and the human's own window.

## Resuming

**Identity is the `sessionId`**, for every seat, the tab seats included. The
transcript path is a function of it —
`<config dir>/projects/<project slug>/<sessionId>.jsonl` — and the name is
what `claude agents --json` and `ListAgents` currently print for it. The
editor's resume of a tab seat keeps the id and changes the name; a terminal
seat's flag-less resume keeps both, since the spawner named it at its spawn.
The roster's Transcript column holds the path and therefore the id — the
basename, which holds when the path does not — and no `Sess` column is
added, because it would duplicate the basename.

| what happened | what the run does |
| --- | --- |
| a tab seat resumed by the editor | nothing is typed there: Kanri's census finds the row's `sessionId` under a new name, rewrites that row's name in place, and writes `resumed: <old name> → <new name>`. `/tanto fukki` stays accepted there, and its handshake rewrites the same row with the same values |
| a terminal seat renamed | the spawner's census sees a known `sessionId` under a new name and marks `renamed` in `seats.json`; Kanri rewrites the row, writes the same Events line, and clears the mark with an `ack` request. The seat itself does nothing and checks nothing |
| an editor restart | the terminal seats are still running — separate processes, unreached by the restart. Only the tab seats came back renamed |
| a reboot or a crash | `tanto` writes a `resume` request for every terminal seat `seats.json` lists as `running` or `blocked`, with `claude --resume <sessionId> --bg` and no other flag. The roster's first row is settled first and separately, so a Kanri the listing has lost but `seats.json` still holds — `gone` included, a Kanri the human `/stop`ped or one that crashed while the spawner ran — is **resumed and never spawned again**. A seat `seats.json` holds as `running` or `blocked` — or, for Kanri alone, `gone` — is resumed; one it holds as `stopped` or `removed` is not, which is why `tanto down --seats` retires a run rather than pausing it |

`tanto` is fukki. It is idempotent: run twice it starts nothing twice, and it
puts back what a restart took. A resumed background Kanri idles until a line
reaches it, so the launcher prints the one act that is the human's —
`claude attach <id>`, and `/tanto fukki` typed there once. That Kanri's fukki
reconciles the roster with `seats.json`'s `renamed` marks and
the census, answers the ledger's unanswered lines, sends a Jisso
resumed mid-batch the one line `resume batch X from task N`, and continues
where the Progress line says.

`/tanto fukki` is a **tab seat's** word everywhere else, and the
`ListAgents` self-check that used to run at every boundary is a tab seat's
too: a terminal seat's rename is for the spawner's census to detect, and a
seat with no roster row yet would otherwise handshake, which it must not.
The self-check stays the tab seat's own trigger to re-handshake after its
name changed; the match that follows is Kanri's, by `sessionId`. A tab
seat's `/tanto fukki` reads this file and nothing else — its role file is
already in the session's context, which is what a resume preserves —
re-reads its own name for its closing line, and re-runs the Start
sequence's definitions write-and-count in both scopes, saying the result
the same way the Start sequence does. Its match is the row whose Transcript
basename is its own `sessionId`; a session whose `sessionId` is no row's
Transcript basename is not a resumed role: `/tanto fukki` says so and stops,
and the human runs `/tanto <role>` there as for a new session.

## Messages

- One boss. Only Kanri messages Jisso; Sekkei, Keikaku, Kaiseki, Kikaku, and
  Hosa never do — inbound messages queue and drain in order, and a second
  boss interleaves instructions. The one exception is the intake's
  `received:` line, `from` copied into `to`: a reply to a line the receiver
  sent, carrying no instruction, and the one line a Hosa sends to a role
  other than Kanri.
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
- **Every tanto line carries the `no-role` line as its second line** — the
  lines this file names and the ones the role files name, in both
  directions, the handshake, the bug-report route and its `received:` answer
  included:

  ```text
  <the tanto line>
  (tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)
  ```

  A role skips the second line. A bare window — one the human `/clear`ed
  and has not yet given a role — finds in it the whole of what is asked of
  it, so "act on the teammate's request" and "do nothing" coincide. In a
  message longer than one line the `no-role` line follows the first: a
  batch prompt travels as the one line `batch: <path>`, and the file that
  path names carries no such line of its own; a `close:` line
  with its clauses, or a handshake with its fields, is one line. A file a
  line points at — a report, a brief, a bug report — is not a message and
  carries no such line. The
  `no-role` reply is the one word, carries no second line of its own, and
  is the signal that a window was cleared under a role; a send error is a
  reason to run the census, whose "Not listed" is the signal that a session
  is gone. What each side does on `no-role`: Kanri marks the sender's row
  `cleared`, writes the Events line a shoroku proposal not written gets
  — what was lost, as far as it knows — and treats the exit as forced, a
  live Jisso's after verifying the tree; a role that receives `no-role` from
  Kanri's own name is in a handover gap, holds the line it sent, and
  re-sends it to the roster's first data row, read fresh, at its next
  wake-up, until it is answered — this holds a
  line only for a role with an established roster row to hold one on
  behalf of. A session with no row yet — a tab seat's own first
  handshake, landing in the same gap — has no line to hold: it treats the
  `no-role` the way a send error is already treated, re-reads the roster's
  first data row, and re-handshakes there once a `live` Kanri answers it. A
  spawned seat never reaches this gap: it sends no handshake, and its row,
  when it exists, comes from the spawner's result file rather than from one.
- **`release: /clear this window`** is a **tab seat's** last line, sent by
  Kanri right after the seat's proposal passes its form check, and the last
  line that name is ever sent: the row is `cleared` at that moment. The seat
  tells the human, in its own window, to `/clear` it, and ends its turn;
  nothing else is expected of it. A **terminal seat** gets no such line: at
  the same moment, and on the same form check, Kanri writes a `stop`
  request, the spawner stops the session, the conversation is kept, and the
  row goes `stopped`. Nothing is `/clear`ed and nothing is said to the
  human.
- **A seat's turn ends with its closing line**, in its own window and in the
  chat's language: an identity, then two facts, and never an opinion. The
  identity is `<name> [<ref>]` — for a tab seat, the word its own last
  `ListAgents` printed for it, at the handshake or at `/tanto fukki`; for a
  terminal seat, the `name` its request's result carried, or the one
  `claude agents --json` prints for its own `sessionId`, never a
  `ListAgents` reading of its own — so the window and Kanri's own lines
  about it (its idle block, its released line to the human, the roster)
  always name it the same way — then
  `<role>[/<topic>]` (the topic named for a Sekkei, Keikaku, Jisso, or
  attached Kaiseki; bare for Kanri, Kikaku, Hosa) and `<family>`, the model
  word its own system prompt currently reads, fresh across a `/model`
  switch. It is as of the seat's own last self-check: a resumed session
  shows its old name until its next boundary or `/tanto fukki`, and the
  human, who restarted the editor, knows which day that is — no mechanism
  is added for this. The two facts, as before: where its work is — the
  paths its output went to, or the commit subject — and the contract step
  that still needs this seat, named by step and site, or `none`. A seat
  never names a step it is not needed for: the recommender's run, the human's
  check, the apply, and Kanri's verification are not waits of the seat's and
  are never listed. After `release:` the second fact is
  `none — /clear this window`. A turn that sends Kanri a line adds it,
  unchanged and reading included, on a `sent:` line under the closing line —
  absent on a turn that sends nothing. Kanri's own idle block carries the
  same identity as its first line after `---`; it needs no `sent:`, since
  Kanri's own lines are already files or `R-n` text. The form, rendered in
  the chat's language:

  ```text
  <name> [<ref>] · <role>[/<topic>] · <family> — Work: <paths, or the commit subject>. Still needs this seat: <step — its site> | none.
  sent: <the one line sent to Kanri this turn, verbatim>
  ```

  Two examples — a Jisso at its boundary, `<name> [<ref>] · jisso/<topic> ·
  sonnet — Work: .tanto/<topic>/batch-B-report.md, commits b81f677..dba2562.
  Still needs this seat: the boundary's verdict — roles/jisso.md, "The run".`
  `sent: .tanto/<topic>/batch-B-report.md — <reading>` (the one line a Jisso
  sends Kanri at its boundary is that path — `roles/jisso.md`, "The run");
  the same Jisso after `release:`,
  `<name> [<ref>] · jisso/<topic> · sonnet — Work: the same. Still needs this
  seat: none — /clear this window.` This shapes the text the harness already
  requires when a turn ends; it opens no channel, and "Human access" stands
  as it is.
- **The commit window opens only for a peer with a commit waiting.** A
  Sekkei or Keikaku of another topic whose work is ready while a batch runs
  writes the ledger event
  `commit-ready: <role> <topic> — <subject> — <YYYY-MM-DD HH:MM>` through
  `boundary.js record --event`, to the ledger a `ledger=` key its own
  prompt carries names — Sekkei's orders line, Keikaku's own spawn prompt.
  The boundary's `check` prints every such event with no
  `commit-done:` pair; Kanri sends "the boundary is verified — commit" only
  to those peers, waits for `committed <subject> — <reading>`, and pairs the
  event with `commit-done: <role> <topic> — <subject>` in its own `record`
  call. A peer with no event is sent nothing and answers nothing, and the
  `nothing to commit` reply is retired with the question.
- Before the human reviews a spec or a plan, the document's author dispatches
  the **review brief** on `brief.write` — a subagent that reads, and writes
  exactly one file,
  `.tanto/<topic>/review-brief-spec.md` for Sekkei, or `review-brief-plan.md`
  for Keikaku, from `templates/review-brief.md`, in the chat's language —
  checks its form against "The brief's form" below, and writes the ledger
  event `review-ready: <document path>; brief: <brief path>` itself, through
  `boundary.js record --event` — not a message, and no wake-up of Kanri's.
  The author puts the brief's text verbatim in its review request, with
  both paths. The human's answers to the brief's points are the confirmation
  that review asks for; the document is what the points point into, and the
  human reads it where a point sends them. When a lookup the document
  depends on is still in flight, the author holds `review-ready:` until it
  lands, or the brief's Document line names the inputs it predates, so that
  the human knows a second brief may follow.
- Permission boundaries are per session. Never ask a peer for work that was
  denied in your own session or would be blocked there. Blocked work goes to
  Kanri, which rules on human access.

A defect noticed in a skill goes to the repository that ships that skill, as
a **bug report**: a file written from `templates/bug-report.md` at
`.tanto/sent/<YYYY-MM-DD>-<slug>.md` under the reporter's own repository, and
one line, `bug-report: <absolute path>`. Any session may write and send one;
when the human noticed the defect, they hand it to a live Hosa as a chore, or
say it in Kanri's window. **The intake is the target repository's `live`
Hosa, else its Kanri**: the sender reads `<workspace>/.tanto/roster.md`,
takes the bare `<name>` before the bracket of the `Name [ref]` column of the
row whose Role is `hosa` and whose Status begins with `live` — Kanri appends
the suffix `(idle since <HH:MM>)` to that cell while a Hosa idles — or, when there is
none, of the first data row, the human supplying the workspace's path where the sender
does not know it; checks that name against `ListAgents`; and asks the human
for the address when the roster is absent — a workspace not yet migrated, or
an older skill — or the name is not listed, since a resumed session carries a
new name until it rewrites its row. The roster is Kanri's to write and the
sender's only to read; the read is of a file outside the sender's own working
directory, and outside auto mode the harness may put a permission prompt for
it in the sender's window — the harness's own prompt, like the model-mismatch
stop, and not a failure of the route. A defect that surfaces in a spec
dialogue reaches Kanri as an `I-n` in `spec-inputs.md`, not as a bug report.

The intake answers with one line, `received: <inbox path>`, after one act
that reads nothing of the report: the file is copied to
`.tanto/inbox/<YYYY-MM-DD>-<slug>.md` under the same basename, and one line
is appended under its `## Received` heading. No triage, no ruling, no filing,
no Events line: a report pends nothing until a **close**, where the
recommender reads every untriaged inbox copy beside the proposal items
("Session exit"). A fix the human wants sooner is the hotfix lane, opened by
the human's word in Kanri's window, never by a report.

**The tracked-write rule.** A tracked file or a commit message names a
report's source as `inbox <YYYY-MM-DD>-<slug>` and nothing more — no
repository name or path, no session name, no topic name of the reporter's,
no quotation of the reporter repository's own documents; what a reproduction
needs is restated against this repository's files or an inline fixture. It
binds the issue filed at the close and its `Source:` line, the close's two
commits, the hotfix lane's commit, the dogfood report, and any ADR. The
template drops the identifying fields at the source, so that what is not in
the file cannot be leaked by the subagent that writes the issue; the rule
stands second.

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
matches it. Dispatch once more if the form fails — a resume of the same agent
with the one failure named is that dispatch, and the cheaper one (measured:
24 seconds and 3 tool uses); if it fails again, send the
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
standing grants exist: Sekkei's spec dialogue, named in Kanri's orders line
at its handshake, and Keikaku's plan dialogue, implied by the role and
stated in `roles/keikaku.md`, since a spawned seat has no orders line; an
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
tells the human, as a numbered list: 1. `claude attach <id>` for a terminal
seat, or go to `<name> [<ref>]` for a tab seat; 2. do `<what>`; 3. ← back to
the agent view, or the tab. For a terminal seat Kanri also writes an
`attention` request, whose message is
`human-needed: <role> <topic> — claude attach <id>`, because a seat that
idles on a grant is not `blocked` in the harness's sense and the spawner's
census alone would miss it. The role's direct exchange
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

A session's items reach `docs/` once, at its topic's **close**, stage word
`t2`, after the final batch. An exit — a seat done with its work, a Kanri
handing over, a Jisso retiring at its boundary — writes those items to a
file and nothing more; nothing is recommended, checked, or applied at an
exit. `R-n` numbers Kanri's rulings and `S-n` the proposal items, both in
the conductor ledger, and every row of a ledger's `S-n` table carries Stage
`t2`, the stage that recommends it.

The close runs four steps — **propose, recommend, check, apply** — and every
other moment runs only the first:

1. **Propose.** The seat that holds the items writes them: a numbered list
   opening with the line that says what the proposal excludes, or, for a
   retiring Jisso, the **Shoroku proposal** section of the batch report it
   writes at that boundary. Only this step needs a resident context. Kanri
   checks the file's form — the exclusion line and the numbered list, or the
   report's section — records each item as a `pending` row of the ledger's
   `S-n` table whose Source names the file and the item, and sends the
   seat `release:` for a tab seat or writes its `stop` request for a
   terminal one — a retiring Jisso's is always the latter. The spec's
   four sections — Requirements, The ADRs, Deferred
   items, and Shoroku proposal from this spec work — are recorded the same
   way when the spec is accepted, four rows whose Source names the spec and
   the heading; a review report's and a Kaiseki report's items are recorded
   at the boundary that reads them. Nothing is copied: a row is one line and
   a pointer, and the rows are the lineage — however many sessions carried a
   seat, its items are in one table.
2. **Recommend.** At the close, Kanri dispatches the `shoroku.recommend`
   kind over the T2 proposal, every source the `pending` rows name — the
   spec's sections by heading, each proposal by path, each report by path
   and item, each with its `S-n` — and every untriaged copy under
   `.tanto/inbox/`, by path, names `skills/` as the paths a `fix` item may
   touch, and names the output, `t2-recommendation.md`:
   every item once, quoted in full from its source, its heading carrying the
   pointer its `Source:` line will take, in four groups — Recommended adopt,
   Recommended fix, Recommended reject, Unsure — each with its destination
   and its one-line reason. An inbox item's destination is one of `issue`,
   `fix — <file>`, `redirect — <where it belongs>`, `kaiseki — <one line>`,
   `relay — <topic>`, or `dismissed — <one line>`; a `fix` item carries the
   file, the text as it reads, and the text as it should read.
   The same dispatch names the brief path, `t2-brief.md` beside the
   recommendation, the template `templates/shoroku-brief.md`, and the chat's
   language; the recommender writes both files in one run.
   <!-- markdownlint-disable MD038 -->
3. **Check — the close kessai.** Kanri checks the brief's form by `grep` —
   the five headings present and in order, every `###` item heading's text,
   its `### ` marker stripped, appearing exactly once after `See:` in the
   brief — dispatches the recommender once more on a failure and pastes the
   brief as it stands on a second. Then it writes an `attention` request
   whose message is `kessai: <topic> — claude attach <id>`, and prints in its
   own window **one** question carrying the recommendation's path, the
   brief's path, the three counts, the merge decision, and the merge's
   default form — `--no-ff` into `main`, the local branch deleted, nothing
   pushed — with the brief's text verbatim below it. The human answers by
   exception: in Kanri's window by `claude attach`, through a Kikaku decision
   file whose third section names this recommendation and answers it, or by
   telling a live Hosa, whose chore is then the one line
   `kessai answer: <topic> — <the human's words verbatim>`. That one answer
   is the direction and the merge approval. Kanri writes `t2-direction.md`
   beside the recommendation, item by item, with the `S-n` rows in the
   conductor ledger.
   <!-- markdownlint-enable MD038 -->
4. **Apply — shusei, then the merge, then shoki.** A non-empty `fix` group
   is a **Jisso batch of one task** on the topic branch, rendered from
   `templates/batch-prompt.md` and spawned like any batch, committed once as
   `fix: text corrections from <topic>'s close` and verified at its boundary
   like any batch. Then Kanri merges. Then the `docs/` write-out is
   **shoki**, a seat spawned into a worktree with `--add-dir` to the main
   checkout, whose whole contract is `templates/shoki-brief.md`: it
   dispatches `shoroku.apply` for the accepted subset per `docs/AGENTS.md` —
   every issue opening with the `Source:` line its item's heading names, the
   Triage section of every swept inbox copy filled — commits once as
   `docs: T2 shoroku for <topic>`, dispatches `shoroku.review` over its own
   diff and applies its findings once, rebases onto `main`, and reports
   `shoroku ready:` or `shoroku blocked:`. Kanri runs the landing checks and
   fast-forwards `main` onto that branch. No session applies the accepted
   subset of its own proposal, and no machine ever resolves a conflict.

The recommend is Kanri's own dispatch, the check is the kessai in Kanri's
window, and the apply is shusei's and shoki's. A live Hosa is delegated none
of it and relays one line when the human answers in its tab,
`kessai answer: <topic> — <the human's words verbatim>`. **Between plans**,
when the human asks in Kanri's window for the inbox to be swept, the same
shape runs over the inbox alone — the recommend dispatch, a kessai message
with no merge question, an `attention` request, the direction, and a shoki
spawn whose brief names the three files
`.tanto/inbox-<YYYY-MM-DD>-recommendation.md`, `-brief.md`, and
`-direction.md` beside the roster and the subject
`docs: inbox sweep <YYYY-MM-DD>`; a sweep's `fix` items are a shusei batch
on `main` with the subject
`fix: text corrections from the inbox sweep <YYYY-MM-DD>`, verified by a
`boundary.verify` dispatch against no plan.

Nothing is adopted before the close, and no item is decided by Kanri alone:
the human sees the whole recommendation, grouped, once per topic. Proposal
items are what is not yet in any file — a rejected alternative and its
reason, a fact measured, a defect noticed, an observation about the run —
never a restatement of a spec, a plan, a report, or a ledger. Kikaku and
Hosa have no exit shoroku; the human `/clear`s those windows at will. A
standalone Kaiseki has no Kanri, and its role file says how.

**Who proposes when.**

- **Jisso** proposes at every boundary, in its report's Shoroku proposal
  section, and that section is its exit shoroku: one Jisso runs one batch,
  and the boundary Kanri accepts is where it retires. No `exit:` line and no
  exit file go to a Jisso. At the close the plan's last live Jisso writes
  `.tanto/<topic>/shoroku-proposal.md` on Kanri's `T2:` line — the `pending`
  rows by number and what its own context holds that no file does — and is
  stopped on its form check: no `/clear`, its conversation kept.
- **Sekkei and Keikaku** write their proposal unasked at their own final
  boundary and name it in the report line — `spec accepted: <spec path>;
  exit proposal: <path> — <reading>` for Sekkei,
  `coldread answered: <pointer, one per question, or none>; exit proposal: <path> — <reading>`
  for Keikaku. An exit that falls away from that boundary — a compaction in
  the reading, the human not wanting the plan now — takes the `exit:` line
  like a Kaiseki's.
- **Kaiseki**, attached, is sent `exit: propose your shoroku; write it to <path>`
  when its case closes, writes the proposal, runs the resume self-check, and
  answers `exit proposal: <path> — <reading>`.
- **Kanri** writes its own proposal from the ledger and the roster, never
  from recollection, at two kinds of moment. **At every plan close**, after
  Jisso's T2 proposal and before the recommender is dispatched, so that the
  close's one check covers Kanri's items with everything else — whether or
  not the close's handover is then declined; what the close teaches after
  that file is written goes to a second file, `-2-proposal.md`, whose rows
  go to the roster's Shoroku proposal items table. **At a handover** that is
  not a close: while any ledger is open, the items are `pending` rows in the
  ledger of the topic whose batches are in flight, else the oldest open;
  between plans, with no ledger open, they are rows of the roster's table,
  which move into the next topic's ledger when it opens. No Kanri exit runs
  a recommend, a check, or an apply of its own. A topic the human ends
  before its final batch still gets its close, over what is on disk, with
  Kanri writing the T2 proposal in Jisso's absence.

**The files.** A proposal is `exit-<role>[-<suffix>]-proposal.md` in
`.tanto/<topic>/` — no suffix for Sekkei (`exit-sekkei`) and Keikaku
(`exit-keikaku`), the case number for Kaiseki (`exit-kaiseki-1`), and a
second file at the same boundary takes `-2` before `-proposal` — or, for
Kanri, `.tanto/exit-kanri-<YYYY-MM-DD>-<name>[-2]-proposal.md` next to the
roster. A Jisso has no proposal file but the close's
`.tanto/<topic>/shoroku-proposal.md`. The close's six files —
`t2-recommendation.md`, `t2-brief.md`, `t2-direction.md`, `t2-review.md`,
`shoki-brief.md`, and `batch-shusei-prompt.md` — live in the topic
directory; there are no others. The close's commit subjects are
`docs: T2 shoroku for <topic>`, `docs: T2 shoroku for <topic>, review fixes`
when shoki's review found anything, and, when the direction accepted a `fix`
item, `fix: text corrections from <topic>'s close` — the two fixed prefixes,
`docs: T2 shoroku` and `fix: text corrections`, that the whole-branch review
package excludes.

**The exit itself.** Every line above is sent without an idle
subscription, like every other tanto line. Kanri checks that the proposal
exists and opens with the exclusion line and a numbered list — a direct
read, since the proposal carries no headings for `sections` to select by —
or, for a Jisso, reads the report's Shoroku proposal section with the
report's others; records the rows; and sends a tab seat
`release: /clear this window` — the row going `cleared` as the line goes
out, its closing line `none — /clear this window` — or writes a terminal
seat's `stop` request, its row going `stopped`, nothing `/clear`ed and
nothing said to it. Either way Kanri tells
the human, in its own window, `<role> <name> released — its work is in
<paths>; no step needs it — /clear its window when convenient`. Nothing
waits on the human's `/clear`: the roster no longer addresses that name,
and the next `/tanto <role>` typed in that window handshakes as a new
session under the same name, which the roster's clear rule expects. A seat
that has stopped answering is past answering, and Kanri learns it the way it
learns of a missing batch report — the human says the window is gone, a
send errors, a `no-role` comes back, or Kanri's window wakes for another
reason and the answer has not arrived. Kanri then treats the exit as forced
— the roster's Events line says the exit shoroku did not run and what was
lost, as far as Kanri knows — marks the row `cleared` or `dead` as the
signal says, and continues.

## Artifacts

| Path | Writer | Readers | Content |
| --- | --- | --- | --- |
| the spec, at the path the orders line names — by default `docs/superpowers/specs/<date>-<topic>-design.md` | Sekkei | Kanri, Keikaku, Jisso | the spec; committed by Sekkei, or by the Keikaku created after the merge when it was a draft |
| `.tanto/<topic>/spec-draft.md` | Sekkei | the spec reviewer, Kanri, Keikaku | the spec while another topic's batch is in flight; nothing is committed and no branch is cut until Keikaku commits it at its final path |
| the plan, at the path the orders line names — by default `docs/superpowers/plans/<date>-<topic>.md` | Keikaku | Kanri, Jisso | the plan; committed; carries Global Constraints, a Batches section, and how a batch is verified |
| `.tanto/roster.md` | Kanri | all roles; a bug-report sender, its live Hosa row or its first data row | one row per seat — a tab seat's from its handshake, a terminal seat's from the spawner's result file |
| `.tanto/roster-archive.md` | Kanri | Kanri | from `templates/roster-archive.md`; the roster's stopped, dead, replaced, refused, and cleared rows with their last readings, and the closed plans' Events lines, appended at each plan close |
| `.tanto/kanri-handover.md` | the outgoing Kanri | the successor Kanri | the handover; deleted by the successor once accepted. In flight, Live peers, and Not reconstructed in full; the rest pointers |
| `.tanto/inbox/<date>-<slug>.md` | the intake — a live Hosa, else Kanri | the close's recommender, by path; the apply, for the Triage section | a bug report received, under the sender's basename, with its Received line; its Triage section is filled by the close's apply and marks the copy triaged |
| `.tanto/sent/<date>-<slug>.md` | the session that noticed the defect — any role, or Hosa from the human's words | the intake of the target workspace, by the path the `bug-report:` line carries | a bug report sent, from `templates/bug-report.md`; kept, never deleted by a rule |
| `.tanto/inbox-<date>-recommendation.md`, `-brief.md`, `-direction.md` | the between-plans inbox sweep's recommender, and Kanri or Hosa for the direction | Kanri, the human, the apply | the sweep's three files when no topic is open, beside the roster |
| `.tanto/kikaku/<YYYY-MM-DD>-<slug>.md` | Kikaku | Kanri | one decision from the human's consultation, from `templates/kikaku-decision.md`; named to Kanri as `decision: <path>`, and from there the next topic's input document, an `I-n`, an `S-n` source, or a stage's Check answer |
| `.tanto/<topic>/kanri.md` | Kanri, or the `boundary.verify` subagent it dispatches, through `boundary.js record` | Sekkei, Keikaku, Jisso, Kaiseki, Kikaku, Hosa | the conductor ledger; it never moves |
| `.tanto/<topic>/spec-inputs.md` (optional) | Kanri | Sekkei | scope inputs the human gave Kanri during spec work, numbered `I-n`, each with Kanri's advisory notes |
| `.tanto/<topic>/dialogue.md` | Sekkei | Kanri, the brief writer, the close's recommender | the spec dialogue: each question Sekkei put and the human's answer, verbatim, in order |
| `.tanto/<topic>/review-brief-spec.md`, `.tanto/<topic>/review-brief-plan.md` | the brief writer the document's author dispatches | the author, then the human; Kanri by the path in `review-ready:` | the review brief, from `templates/review-brief.md`, in the chat's language |
| `.tanto/<topic>/plan-dryrun.md` | Keikaku | the plan reviewer, Kanri | from `lint` and `replay` — the two commands, each one's output, and Keikaku's ruling on every failure |
| `.tanto/<topic>/coldread.md` | the `plan.coldread` subagent Kanri dispatches | Kanri, by `sections` | the cold read of the committed plan: a numbered list of open questions, or `none`; Kanri sends Keikaku one numbered message carrying all of them, or `coldread: none`, and Keikaku answers with one `coldread answered:` line |
| `.tanto/<topic>/batch-<X>-prompt.md` | the `boundary.verify` subagent, from `templates/batch-prompt.md`; Kanri for its two `<Kanri fills>` slots and for a rework prompt | the seat the `spawn` request creates, or the `queued` seat under a skill-editing plan; human | the prompt; sent as the one line `batch: <path>`, which the human pastes if the message did not arrive |
| `.tanto/<topic>/batch-<X>-verdict.md` | the `boundary.verify` kind Kanri dispatches | Kanri, by `sections` | the boundary's verdict: eleven fixed sections, and a twelfth, `Measurement`, when the batch carried a measurement task |
| `.tanto/<topic>/batch-<X>-report.md` | the Jisso of that batch | Kanri; the close's recommender, its Shoroku proposal section by path and item | fixed skeleton; its Shoroku proposal section is that Jisso's exit shoroku |
| `.tanto/<topic>/kaiseki-<n>-brief.md` | Kanri | Kaiseki | fixed skeleton |
| `.tanto/<topic>/kaiseki-<n>.md` | Kaiseki | Kanri, Jisso | fixed skeleton |
| `.tanto/<topic>/shoroku-proposal.md` | the plan's last live Jisso | Kanri, for its form; the close's recommender, by path | the close's proposal: the `pending` rows by number and what that Jisso's own context holds that no file does, written to a file instead of printed |
| `.tanto/<topic>/exit-<role>[-<suffix>][-2]-proposal.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>[-2]-proposal.md` | the exiting session — Sekkei, Keikaku, an attached Kaiseki; Kanri at every plan close and at every handover; never Jisso, whose proposal is its report's section | Kanri, for its form; the close's recommender, by path | the exit shoroku proposal, opening with the line that says what it excludes; `-2` a second file at the same boundary, never a rewrite of the first |
| `.tanto/<topic>/t2-recommendation.md` | the `shoroku.recommend` kind Kanri dispatches at the close | Kanri, the human, the apply subagent | every proposal item once, quoted in full from the source its `pending` row names, in four groups — Recommended adopt, Recommended fix, Recommended reject, Unsure — each with its destination and its one-line reason |
| `.tanto/<topic>/t2-brief.md` | the `shoroku.recommend` kind, in the same dispatch as the recommendation | Kanri, by `grep` for its form and by `sections` (its bare heading text) for the `Unsure` group; the human, verbatim | the check brief, from `templates/shoroku-brief.md`, in the chat's language: one line per item, grouped as the recommendation groups them, each pointing at the item's `###` heading |
| `.tanto/<topic>/t2-direction.md`, beside the recommendation | Kanri, from the human's answer — in its window, or a Kikaku decision file whose third section answers the recommendation | the `shoroku.apply` kind | what the human accepted, item by item; the apply never runs without it |
| `.tanto/<topic>/compaction-<role>-<n>.md` | the compacted session | Kanri | every item a compaction summary attributes to the human, one per line, rewritten with the human's answers |
| `.tanto/kaiseki/kaiseki-<n>.md` | a standalone Kaiseki | the human | its report, outside any run |
| `.superpowers/sdd/<plan-basename>/progress.md` | Jisso, through the SDD skill | Kanri | the SDD ledger; Kanri reads it and never writes it; the one artifact tanto reads under `.superpowers/` |
| `.tanto/.gitignore` holding `*`, and `.tanto/.markdownlint-cli2.yaml` holding `config:` / `default: false` | Kanri at start, a standalone Kaiseki, or a bug-report writer — whichever finds them absent first; never overwritten | git; the editor's markdownlint | keeps everything above untracked, so nothing is ever staged, and keeps the editor quiet on files the commit path never lints |
| `$CLAUDE_CONFIG_DIR/tanto.json` | the user | every role at start, Kanri at each handshake | the personal expected-model config |
| `<cwd>/.claude/tanto.json` | the repository | every role at start, Kanri at each handshake, `scripts/reading.js` | the project expected-model config, overlaid on the personal one; committed or ignored as the repository decides |
| `~/.claude/agents/tanto-*.md`, or `$CLAUDE_CONFIG_DIR/agents/` when that variable is set | every role at its start, from the built-in and personal layers | the harness, at the next session start | one definition per kind, from `templates/agent.md`; a definition is dispatchable only from the sessions started after it was written |
| `<cwd>/.claude/agents/tanto-*.md`, and `<cwd>/.claude/agents/.gitignore` beside them | every role at its start, for the kinds whose effort the project file changes | the harness, at the next session start; git | the project-scope definitions, from the same template with its `<scope>` clause rendered; the `.gitignore` holds `tanto-*.md` and `.gitignore`, is written once and never overwritten |
| `.tanto/spawner/` — `pid`, `log`, `seats.json`, `requests/<id>.json`, `results/<id>.json` | the spawner, and Kanri for a request file | the launcher, Kanri | the spawner's own state: one seat entry per session it started, one request and one result per act. The roster is not here and the spawner never reads it |
| `.tanto/<topic>/spawner-results/` | Kanri, at the plan close | Kanri | the topic's result files, moved with the archive move |
| `.tanto/<topic>/shoki-brief.md` | Kanri, from `templates/shoki-brief.md` | shoki, as its whole prompt | the scribe's contract: the arguments, what it never does, the five steps, the report line |
| `.tanto/<topic>/t2-review.md` | the `shoroku.review` kind shoki dispatches | shoki, then Kanri | the review of shoki's own diff against `main`, before it reports |
| `.tanto/<topic>/batch-shusei-prompt.md` | Kanri, from `templates/batch-prompt.md` | the shusei Jisso | the one-task fix batch of the close |
| `<root>/.claude/worktrees/shoki-<topic>` | the CLI, on `claude --bg -w` | shoki | shoki's worktree; never written by a role, removed by Kanri (`git worktree remove --force --force`) along with its branch, after the `rm` request |

Templates are copied and filled, never restated in prose. Seventeen of them:
`templates/roster.md`, `templates/roster-archive.md`, `templates/kanri.md`,
`templates/kanri-handover.md`, `templates/bug-report.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/boundary-brief.md`, `templates/kaiseki-brief.md`,
`templates/kaiseki-report.md`, `templates/review-brief.md`,
`templates/shoroku-brief.md`, `templates/shoki-brief.md`,
`templates/spawn-request.md`, `templates/tanto.json`,
`templates/kikaku-decision.md`, and `templates/agent.md`.

The skill also ships five Node scripts and two wrappers.
`scripts/passage-check.js` is the
instrument a plan that carries passages checks itself with, run by Keikaku in
place of an agent dry run, by Jisso at every batch boundary, by the
`boundary.verify` subagent at every boundary in Kanri's place, and by the
whole-branch reviewer; its seven subcommands
are `lint`, `replay`, `diff`, `verify`, `sections`, `frame`, and `boundary`,
and `roles/keikaku.md`, `roles/jisso.md` and `roles/kanri.md` name them.
`scripts/reading.js` is the instrument every role measures itself with, run at
every exit and every boundary — at a boundary Kanri's is run by the
`boundary.verify` subagent on its behalf; it prints three lines always, and its two forms
are the reading of one transcript
— with `--role kanri|jisso`, `--presence` and `--backstop` each adding a line,
and `--now`, `--config`, `--project-config` and `--settings` fixing what the
tests and a verifying Kanri need fixed — and `--share` over several
transcripts, which Kanri runs at
the plan close; it also exports `loadSessions(root)`, which the launcher
reads a seat's family and effort from. `scripts/boundary.js` is the
boundary's own instrument, run by
the `boundary.verify` subagent Kanri dispatches — and, under the shape 2 the
tanto-diet design leaves as a seam, by a headless session running the same
brief; its three subcommands are `check`, which runs the boundary's
read-only commands and prints their output under fixed headings, `record`,
which writes the ledger's and the roster's rows idempotently, and `census`,
which Kanri runs itself: read-only, it prints the roster's `live` and
`queued` rows against the sessions `claude agents --json` lists under the
root, under four headings — Listed, Not listed, No session id, and Not held.
`scripts/spawner.js` is the one process in a run that issues `claude --bg`,
`claude stop`, `claude rm`, and `claude --resume`: a resident started by the
launcher and never by a session, which takes request files, writes result
files, keeps `seats.json`, names each seat it spawns, runs the spawner's
census of `claude agents --json` every fifteen seconds — which revives a
seat that returns to the listing and stops one that strays into
`.claude/worktrees/` — and raises a desktop notice on a blocked seat, on a
strayed one, and on an `attention` request; `spawner.js notify --stdin` is the one-shot an optional
harness hook may call. `scripts/tanto.js` is the human's one command — it
starts the spawner, finds or asks for a Kanri, resumes what a restart took,
and prints `claude attach <id>`; `tanto down [--seats]` stops it all and
keeps every conversation.
All five are Node with no dependencies, and all five have their tests
beside them, run by `node --test`. Their paths are written skill-relative,
like every other path in
this skill, and the role files spell the runnable form `$TANTO`: set it to the
skill's own directory, which the harness names when it invokes the skill,
**in the same tool call as the command** — shell state does not persist
between calls, and an unset `$TANTO` makes every one of these commands read a
path at the filesystem root. None of the five is ever invoked bare —
no `.js` file of the skill carries a shebang, so `node` is part of the
command and not decoration. The two wrappers, `scripts/tanto.bat` and
`scripts/tanto.sh`, exist to be invoked bare: they are what the human puts on
`PATH` as `tanto`, and `tanto.sh` carries the skill's one shebang.

`.tanto/<topic>/` is created by Kanri when the topic opens — its first file is
the conductor ledger — and holds every per-topic file from then to the plan's
close; nothing in it moves when the plan lands. The SDD ledger is the one
artifact tanto reads under `.superpowers/sdd/`: the SDD skill writes it
there, and the conductor ledger's Plan section and every batch prompt name
its path.

## Rules

1. One boss: only Kanri messages Jisso; the intake's `received:` reply is a
   reply, not a boss's line.
2. Files between the sessions: the spec, the plan, the conductor ledger, the
   spec inputs, the Kaiseki reports, and the shoroku recommendations and
   directions are the only channel. Every role is on it, not only the ones on
   the top family — Keikaku and Hosa hand over files as the others do.
3. State in files, not in memory: the roster and the ledgers. Kanri is their
   only hand; a peer appends to a ledger's Session events only through
   `boundary.js record --event`, and only the lines its role file names — a
   closed set of two, `review-ready:` and `commit-ready:`. Everything Kanri
   must act on stays a message. Memory holds at
   most a pointer to them. A subagent Kanri dispatches to a boundary writes
   the ledger and the roster as Kanri's hand, through `boundary.js record`,
   and nothing else. A role's authority is this file, its role file,
   Kanri's lines, and the batch prompts; a project memory rule that would add
   a dispatch or a document is put to Kanri as one line before it is acted
   on, since the same memory is loaded by every session in the repository.
4. One Kanri, one Kikaku, and one Hosa per repo; one Sekkei, one Keikaku, and
   one Kaiseki per topic; one **live** Jisso per topic, spawned per batch, or
   all of them spawned at the plan's landing and `queued` when the plan edits
   this skill. A session is bound to its
   cwd — CLAUDE.md, memory, and permissions all come from it.
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
   and it names a `subagent_type` from the definitions this session sees,
   whether they are at `~/.claude/agents/` or at `<cwd>/.claude/agents/`.
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
    is. The spawner names a terminal seat at its spawn, before its prompt
    runs, and nothing renames it after.
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
    in view.

    **A plan that edits this skill spawns all its Jissos at its landing**,
    each with `queue=<topic>`, reading nothing until its own batch prompt
    reaches it as the one line `batch: <path>` — so that every one of them
    read the skill as it stood before batch A. That is neither a
    replacement nor a creation under this rule. Every other plan spawns one
    Jisso per batch, at the boundary, from the batch prompt itself.

    **The run-time templates land with the role files.** A role file is
    loaded once, at session start, but the `boundary.verify` subagent reads
    `templates/boundary-brief.md` and renders `templates/batch-prompt.md`
    from disk at **every** boundary, the plan's own included. A plan that
    edits either, or `templates/kanri-handover.md`, therefore lands it in
    the same batch as the role files that key on it; the templates a session
    reads once — `roster.md`, `roster-archive.md`, `kanri.md`,
    `shoki-brief.md`, `spawn-request.md` — may land earlier.

    The roles that start the plan — Jisso at the plan's landing,
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

All roles share one working tree and one branch. **Kanri alone cuts,
switches, merges, and deletes the branch**: it cuts `<topic>` from `main` at
the topic's opening when no batch is in flight, and right after the
predecessor's merge otherwise, and Sekkei and Keikaku commit on the branch
the tree is on. Jisso continues on it;
the merge decision is the human's, taken with the close kessai's one answer.
**No worktree by default** — Kanri verifies
the tree in place and the human can watch it. The one exception is shoki, the
close's scribe, which works in the CLI's own worktree under
`.claude/worktrees/shoki-<topic>` and holds no runtime resource. Every batch
prompt restates that
as a Kanri directive. A modification in the shared tree that a session or its
own subagent did not make is not its to discard (Rule 5): it is reported, never
run through `git checkout --` or `git clean` on its own judgment, and only
Kanri decides whether it is stray.

`.tanto/<topic>/` outlives the plan, and so does the SDD workspace
`.superpowers/sdd/<plan-basename>/`. Jisso never deletes either, and nothing
asks the human to delete either: after T2 the two have the same standing —
untracked, local to one machine, useful only for a later re-read — and disk
is the only cost (issue-12d3).

`.tanto/` reserves these names, and a topic slug is none of them and begins
with neither prefix: the
directories `inbox`, `sent`, `kikaku`, `kaiseki`, and `spawner`; the files
`roster.md`, `roster-archive.md`, `kanri-handover.md`, `.gitignore`, and
`.markdownlint-cli2.yaml`; and the prefixes `exit-kanri-` and `inbox-`.
Kanri checks a new slug against this list by name, before any directory
exists, and lists the root against the same names at every start and every
close.

## Now read your role file

- `kanri` → `roles/kanri.md`
- `sekkei` → `roles/sekkei.md`
- `keikaku` → `roles/keikaku.md`
- `jisso` → `roles/jisso.md`
- `kaiseki` → `roles/kaiseki.md`
- `kikaku` → `roles/kikaku.md`
- `hosa` → `roles/hosa.md`

Read exactly one. The other six are not yours.
