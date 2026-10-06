---
name: tanto
description: Use when the user starts or joins a tanto multi-session orchestration run in Claude Code, invoked as `/tanto <role>`, `担当して <role>`, or `tantoして <role>`, where the role word is kanri (管理), sekkei (設計), keikaku (計画), jisso (実装), kaiseki (解析), kikaku (企画), or hosa (補佐) in hiragana, kanji, or romaji. Drives one implementation plan through separate sessions, background and interactive, that message each other, composing superpowers brainstorming, writing-plans, subagent-driven development, systematic-debugging, and the shoroku write-out. Claude Code only, because it needs ListAgents and SendMessage.
argument-hint: kanri | sekkei | keikaku | jisso | kaiseki | kikaku | hosa | fukki | taiseki
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
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, the recommendations and the directions, the bug intake when no Hosa is listed, the spawn, stop, wake, and attention requests, and the kessai | human, Sekkei, Keikaku, Jisso, Kaiseki, Hosa; Kikaku, answering its `decision:` lines |
| Sekkei (設計) | 0 or 1 per topic | the spec and its review | Kanri; the human by grant |
| Keikaku (計画) | 0 or 1 per topic | the plan, its dry run, and its review | Kanri; the human by grant |
| Jisso (実装) | 1 live per topic, spawned per batch — a self-editing plan's all at its landing | one batch of the SDD run each, its batch report and its commits; the last one, the close's shoroku proposal | Kanri; the human by grant |
| Kaiseki (解析) | 0 or 1, on demand | root-cause reports; never a fix; no commit | Kanri; the human by grant |
| Kikaku (企画) | 0 or 1, started by the human with `tanto kikaku` | the consultation, and the decision files under `.tanto/kikaku/` | the human; Kanri, one `decision:` line |
| Hosa (補佐) | 0 or 1, started by the human with `tanto hosa` | the human's small chores, the bug intake while it is listed, the hotfix lane's edits Kanri hands over in a slot Kanri gives, and the kessai relay | the human; Kanri |

## Invocation

`/tanto <role> [<key>=<value> …]`, or `担当して <role>` / `tantoして <role>`.

Normalize the word to its romaji id before anything else. One table serves
`/tanto` and the launcher, `tanto`, typed in a terminal: the seven roles,
and four words, each accepted in romaji, kana, kanji, or its English alias.

| Accepted | Id |
| --- | --- |
| `かんり`, `管理`, `kanri` | `kanri` |
| `せっけい`, `設計`, `sekkei` | `sekkei` |
| `けいかく`, `計画`, `keikaku` | `keikaku` |
| `じっそう`, `実装`, `jisso` | `jisso` |
| `かいせき`, `解析`, `kaiseki` | `kaiseki` |
| `きかく`, `企画`, `kikaku` | `kikaku` |
| `ほさ`, `補佐`, `hosa` | `hosa` |
| `ふっき`, `復帰`, `fukki`, `resume` | `fukki` |
| `たいせき`, `退席`, `taiseki`, `leave` | `taiseki` |
| `ていし`, `停止`, `teishi`, `stop` | `teishi` |
| `じょうきょう`, `状況`, `jokyo`, `status` | `jokyo` |

Any other word: say it is unknown, list the seven role ids and the four
words, and stop. `down` is retired and has no alias.

Each of the four words is taken in one place:

- `fukki` — at the launcher, `tanto fukki`, and in Kanri, `/tanto fukki`:
  it puts the run back after a restart, a stale spawner, or a quota's
  return. In Kanri it skips the start sequence and runs "Resuming" below.
  In any other seat `/tanto fukki` is answered with one line naming
  `tanto fukki`, and nothing else is done.
- `taiseki` — typed by the human as `/tanto taiseki` in a Kikaku, a Hosa,
  or a standalone Kaiseki, the seats he paces: it ends that seat ("Session
  exit"). Any other role answers `this seat ends at its boundary, by the
  run` and does nothing; `tanto taiseki` at the launcher is answered with
  one line naming `/tanto taiseki`.
- `teishi` and `jokyo` — at the launcher alone: `tanto teishi [--seats]`
  stops the spawner, and with `--seats` the run's seats; `tanto jokyo`
  prints the run's seats, read-only. Typed as `/tanto <word>` in a session,
  either is answered with one line naming the terminal command.

There is no address argument: Kanri's address is the roster's first data
row, for every role ("The address"). A workspace with no roster yet has no
Kanri to address: `tanto` spawns its first Kanri, and that Kanri writes the
roster. Every seat is spawned on a request, and its prompt's keys are its
orders — nothing else carries them:

| seat | written by | the prompt |
| --- | --- | --- |
| Kanri, first or successor | the launcher, when the run has none; Kanri, for its successor | `/tanto kanri` — the handover file, when one exists, is the Start section's Handover case |
| Sekkei | Kanri, for a topic it has opened | `/tanto sekkei topic=<topic> spec=<path> branch=<branch> input=<path>` — `input=` only when an input document exists, naming the one that lists the rest; `ledger=<path>` added when another topic's batch is in flight, and `spec=` is then the draft path |
| Keikaku | Kanri | `/tanto keikaku topic=<topic> spec=<path> plan=<path> ledger=<path>` — `ledger=` only when another topic's batch is in flight, naming that ledger |
| Jisso, an ordinary plan | Kanri | `/tanto jisso batch=<.tanto/<topic>/batch-<key>-prompt.md>` — the prompt file is its orders |
| Jisso, a plan that edits this skill | Kanri | `/tanto jisso queue=<topic>` — reads nothing and waits for the one line `batch: <path>` |
| Kaiseki, attached | Kanri, once the brief is written | `/tanto kaiseki topic=<topic> brief=<path>` — the keys are what make it attached |
| Kaiseki, standalone | the launcher, `tanto kaiseki` | `/tanto kaiseki` with no key, roster or no roster |
| Kikaku | the launcher, `tanto kikaku` | `/tanto kikaku` |
| Hosa | the launcher, `tanto hosa` | `/tanto hosa` |
| shoki | Kanri, at the close | not a `/tanto` invocation at all: the prompt is the one line `brief: <.tanto/<topic>/shoki-brief.md>`, and shoki reads no role file and no `SKILL.md` |
| denrei, the messenger | the launcher's `tanto fukki`, when Kanri is alive | not a `/tanto` invocation: a fixed prompt that forwards the one line `fukki: requested at the launcher` to Kanri; it reads no role file and no `SKILL.md`, gets no roster row, and is stopped and removed when its turn ends ("Resuming") |

## Start sequence

Two steps, in this order, before any role work, and one check before them.

**The seat check** is your first act. Run
`node "$TANTO/scripts/boundary.js" seat <your sessionId>`, the `sessionId`
being your transcript's basename ("The transcript reading"). Go on when it
prints an entry, and when it prints `no entry background`: that listing
entry is a background session's, which nobody typed into, and the spawner
records a new seat a moment after it starts. On `no entry interactive` or
`no entry -` — a tab opened from habit, or a tab of a run that has not
moved — say this, in the human's language, and stop, reading no role file,
writing nothing, and sending nothing:

```text
seats are started by tanto <role> in a terminal, or by Kanri; a run started before this contract is moved first — README, "Moving a run"
```

A `seat` that exits 1 because the listing failed prints no entry line, and
that exit is no signal, as a failed listing is none for the census:
the session runs `seat` once more, and on a second exit 1 goes on — the
check guards against a tab opened by hand, and a listing that failed is no
evidence of one — and says so, appending `seat: listing failed — <reason>`
to its start line and to the first tanto line it sends, as a model mismatch
is said. A tab that slipped through is a session under the root that no row
holds, and Kanri's next census prints it under **Not held**.

The check holds for every role, Kanri and a standalone Kaiseki included:
`tanto` and `tanto kaiseki` are their ways in.

### 1. Model check

Read the expected-model config below and compare `sessions.<role>.model` with
your own model id, which your system prompt states; a configured family
matches when it occurs inside that id. A mismatch never stops the seat: it
appends `model: expected <a>, running <b>` to the first tanto line it sends,
and Kanri writes an `attention` request on reading it (decision-08bc: the
mismatch reaches the human). A Kikaku, a Hosa, and a standalone Kaiseki,
which send Kanri no first line, say the mismatch in their start line.

Then read your own effort as "The transcript reading" below says, and compare
it with `sessions.<role>.effort`. Say both results in your start line, Kanri's
included. The reading is of the turn that runs the start sequence: a turn the
human takes in a tab runs at the editor's effort, not the spawn's, and nothing
checks the later turns or asks the human about them ("The faces of a seat",
C-4).

The effort check warns only, and `unknown` is not a mismatch. Never switch a
model, and never switch an effort: the effort is the human's to change with
`/effort` in that window, and the roster records what runs.

### 2. Handshake

No seat sends one. Every seat is spawned on a request — the launcher's for
Kanri when the run has none, Kikaku, Hosa, a standalone Kaiseki, and the
messenger; Kanri's for every other seat, its own successor among them — so
its role, topic, model, effort, branch, and mode are in the request, and its
`sessionId`, name, cwd, and transcript are in the result the spawner wrote
back. After the seat check, the model check, and the definitions write-out
below, it does what its keys say; Kanri runs its start in `roles/kanri.md`.
Shoki and the messenger are neither: their prompt is not a `/tanto`
invocation, they read no role file and no contract, and they run no start
sequence at all — shoki's brief is the whole of it.

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

Three maps and one scalar, each with its own mechanism. Every value of the
first two maps is `{ "model": <family>, "effort": <level> }`, or a bare
string, which sets `model` and leaves `effort` to the layers below.

- `sessions.<role>` is **advisory**. The checks above compare against it,
  read at the moment of each comparison — each
  file's presence as much as its content, since a personal or a project
  override can be created, edited, or deleted at any time, and "it existed
  when I last checked" is never evidence that it exists now. A value stated to
  the human between comparisons — a recommendation, a seat's family — is read
  the same way at that moment, never recalled. Nothing switches a session's
  model or its effort. Its nine keys are the seven roles and two seats with
  a family, an effort, and no role file: `sessions.shoki`, the scribe the
  close spawns, and `sessions.denrei`, the messenger `tanto fukki` spawns
  ("Resuming"). Whoever writes a seat's spawn request reads its key then —
  the launcher, through `reading.js`'s `loadSessions`, for Kanri, Kikaku,
  Hosa, a standalone Kaiseki, and the messenger; Kanri for every other.
- `subagents.<kind>` is **effective**. Its `model` goes into the `model`
  parameter of every subagent that role dispatches, and its `effort` into the
  agent definition below. The fifteen kinds are `task.implement`,
  `task.escalate`, `task.review-spec`, `task.review-quality`, `plan.draft`,
  `plan.review`, `plan.coldread`, `spec.review`, `branch.review`,
  `boundary.verify`, `brief.write`, `shoroku.recommend`, `shoroku.apply`,
  `shoroku.review`, and `default`.
- A key inside `subagents` whose `<object>` is a **skill name** and whose
  `<act>` is one of that skill's modes means "run that mode of the skill in a
  subagent on that model instead of inline" — at every dispatch of that mode,
  whichever stage runs it, not the close's alone. When the key is absent, the
  mode runs inline on the session's model. `shoroku.recommend`, `shoroku.apply`,
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
- `language`, the one top-level key that is not a map, is a BCP 47 tag —
  `"ja"`, `"en"` — overlaid across the three layers like every other key,
  the last one winning; the built-in file sets none, the personal file is
  where the human sets it for every repository, and a project file may
  override it. Its mechanism is one definition, written here and nowhere
  else: **the human's language** is the merged `language` when one is set;
  otherwise it is what the repository's own language rule gives — a
  language the user has configured elsewhere, such as in a user-level
  instruction file, else the language of the human's first message in the
  window — and English only when nothing names a language. Under such a
  rule the key is how a tanto seat reads "the language the user has
  configured": a user-level instruction file is read only when the key is
  unset, so the two never compete. Every other site says "the human's
  language" and points nowhere else. It governs the human-facing text
  alone: every seat's closing line; the review briefs; the shoroku briefs,
  the close's check brief and the inbox sweep's; the kessai question and
  every line Kanri prints for the human in its own window — its start line,
  the `R-n` notices, the human-access steps, and the
  idle block, its fixed labels included; an `attention` request's message;
  the batch report's Questions for the human section; the dialogues a seat
  holds with the human — Sekkei's spec dialogue, Keikaku's plan dialogue,
  Kaiseki's debugging conversation, Hosa's chores, and a `human-contact:`
  exchange; and the text of every AskUserQuestion. It does not govern the
  tanto lines between sessions, which keep their fixed English forms;
  anything under `docs/`, which the repository's own language rule covers;
  the ledger, the roster, the reports, the subagent prompts, and the
  decision files, which stay agent-facing English with the human's words
  quoted verbatim; or the launcher's printed lines. Every role reads it at
  start with the rest of this file, a spawned seat included — which is the
  point: a seat with no human first message to detect from still knows the
  language — and no script reads it.

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
leaves every other value of all three maps alone; `language` overlays as
one value. A key that is not `language` and names no role, no kind, and no
ceiling field — an older file's, for instance — is reported in
your start line as `unknown key <name> in <path>, ignored` —
`subagents.shoroku`, the kind's name before it was split into
`shoroku.recommend` and `shoroku.apply`, is one such key, and a personal file
that still carries it sets neither half, and a top-level key whose own name
is a role's or a kind's, `kikaku` or `task.implement`, is reported as
`unknown key <name> in <path>, ignored — likely meant sessions.<name>` or
`subagents.<name>`, since a hand-edited override that drops the nesting is
the common mistake and sets nothing — or as
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
or `all keys built-in defaults` when both files are absent;
`language: <tag> (<layer>)`, the layer being the file the effective value
was read from — `personal` or `project` — or `language: — (unset)`; the
unknown keys, each named with its file; the ladder result if the check
failed; and
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
- The human's word that the quota is back is `fukki` — `tanto fukki` at the
  launcher, or `/tanto fukki` in Kanri. Its procedure, `roles/kanri.md`'s
  "Recovery", is the one place the probe is written: one trivial `default`
  subagent on the family, then `continue: <dispatch> — same model` for every
  `paused:` line still unanswered, the dispatch being the one that line
  named, and the role re-dispatches identically from where it stopped; a
  probe that fails sends nothing and tells the human the reset time again.
  A human who says it in a role's own window is answered, reported as
  `human-contact:`, and pointed to `fukki`; the role continues nothing on
  its own.
- Not detected: a `/model` or `/effort` change mid-run; the rule is protocol.

## The roster

The roster lives at `.tanto/roster.md`, is written only by Kanri from
`templates/roster.md`, and has Kanri's row first. Columns are Role, Topic,
Name `[ref]`, cwd, Model, Effort, Branch, Mode, Started, Status, and
Transcript. A row is written from the spawner's result file, by
`boundary.js record --seat`: for a seat Kanri requested, when the result
lands; for a seat the launcher started — a Kikaku, a Hosa — at the census
whose **Not held** first prints it, Kanri not being woken for it. A
standalone Kaiseki and the messenger get no row, and a row that does not
exist yet while its seat works is not an error. The Name cell holds the bare
name the listing printed when the row was written — a record, not an
address ("The address") — and no seat writes a `[ref]` about itself. Topic
is the topic word the seat's own prompt keys gave it — for a Jisso, the
topic whose queue it was spawned into: the plan whose batches are in
flight, or, with none in flight, the plan whose landing requested the
queue, since the shared checkout carries one topic's batches at a time and
the next plan's queue opens at its predecessor's close — or `—` for Kanri,
Kikaku, Hosa, and a standalone Kaiseki.

The Status column carries one of five words: `queued` a Jisso of a
skill-editing plan waiting for its batch prompt; `live`, which may carry one
suffix: `(idle since <HH:MM>)`, or `(blocked since <HH:MM>)`, which Kanri
appends when the census's Listed line for the seat carries `— blocked` and
removes when a later census's does not — the last census that saw the seat
blocked, not its state now; the cause, `— blocked (<waitingFor>)`, is in the
census line and the notice and not in the cell, and every reader tests the
cell's first word; `stopped` a seat the run ended — by Kanri's `stop`
request, by `taiseki`, by `tanto teishi --seats`, by the spawner's guard, or
on a second `no-role` ("Messages") — its conversation kept and nothing sent
to it again; `replaced` a Kanri that handed over; `dead` a seat whose
process is gone and that is not parked — its conversation on disk and not
final, since a wake puts the row back to `live` when a line is next due to
it ("Resuming") — or a row of the old contract that Kanri retired at its
census (`roles/kanri.md`). A dialogue seat that is parked keeps its row
`live`: a park is its ordinary state between turns ("The faces of a seat").

The keeping rule is one held seat per role and topic, and one Kanri, one
Kikaku, and one Hosa per repository; the spawner refuses a request for a
second Kanri, Kikaku, or Hosa while it holds one, a handover's successor
excepted (rule 4). `ListAgents` shows name, `[ref]`, kind, and start time
for every session on the machine — not the cwd, the model, or the role; the
spawn request and its result carry those, and the census places a session
under this repository by its cwd.

**The census.** A seat is its `sessionId`, and a roster row's is the
basename of its Transcript column without `.jsonl`. Every match of a session
to a row — the census, a result file, Kanri's start — compares `sessionId`s,
never a name, a `[ref]`, or a full path: a name changes when a tab takes the
seat and at every window reload, one file has two paths under a changed
config directory, and a transcript moves when its session enters a
worktree. `node "$TANTO/scripts/boundary.js" census` reads the spawner's
state file, `.tanto/spawner/seats.json`, beside the listing, and prints the
`spawner:` line — `spawner: beating`, or `spawner: stale` — and then six
headings, in this order:

- **Listed** — a `live` or `queued` row whose session is listed, its line
  ending `— renamed` when the listed name is not the row's Name cell, and
  `— blocked (<waitingFor>)` for a background seat on a prompt. A seat open
  in a tab is never `blocked`: its prompt is in front of the human already.
- **Parked** — a `live` row whose seat the state file holds `parked`, with
  `— mid-turn` when its last turn did not end by itself and `— waiting`
  when a question of its to the human stands. Nothing is marked, and the row
  stays `live`; a seat with a topic marked `— mid-turn` is woken in Kanri's
  Recovery alone, never at a boundary's census ("Resuming").
- **Ended** — a `live` or `queued` row whose seat the state file holds
  `stopped` or `removed`; the line ends in `by taiseki` when the seat ended
  itself. Kanri writes the row `stopped`, with an Events line naming what
  ended it — `taiseki`, or its own request.
- **Not listed** — a row whose seat the state file does not hold, or holds
  `running`, `blocked`, or `gone`, and the listing does not show. Kanri marks
  a `live` row `dead` on that signal alone — no timeout, no inference, no
  name; a `queued` row stays `queued`, since a waiting Jisso's absence is
  expected and the send of its prompt wakes it. An entry with no `pid` is
  not listed, whatever its `state` says: its process is gone, and its line
  ends `— listed without a pid (a stale entry)`.
- **No session id** — a row whose Transcript cell carries no `sessionId`.
- **Not held** — a session under the root that no row holds; and, for every
  seat the state file holds that no row holds, listed or not, the line
  `— spawned as <role> <topic>, result <id>`, from whose result Kanri writes
  the row.

On `spawner: stale` the state file has stopped moving and Kanri marks
nothing, as on `census: unavailable`; a listing that fails is no signal
either. Kanri runs the census at its start; at every boundary, in loop step
6, before the next request; at every wake-up whose line comes from a name no
row holds — a Hosa's `slot-needed:` or `kessai answer:`, a Kikaku's
`decision:` — before it handles the line; and when `seat` prints `no entry`
("The address").

### The address

- **A seat is its `sessionId`.** Its name is whatever the listing prints for
  that id now: the spawner's `<repo>-<role>[-<topic>]-<hex>` while it runs in
  the background, the editor's `<repo>-<2 hex>` while a tab holds it, and a
  new one of those after every window reload. The spawner's census writes
  the listed name into its state file at every pass, and the commands below
  read it there at the moment of sending. A name is looked up at the send
  and never stored as an address; the roster's Name cell is a record.
- `SendMessage` delivers a bare name that matches exactly one live session.
  When it reports the name ambiguous, run `ListAgents` once and append the
  `[ref]` from that listing, with the space that precedes it. That is the
  one use of a `[ref]`: no seat writes one about itself — its closing line,
  the roster, Kanri's start line, the handover file's Live peers, and a
  batch prompt's Kanri line carry the bare name — none is pasted from a
  file, and no command line carries an address at all ("Invocation").
- **Kanri's address** is the first data row of `.tanto/roster.md`, read at
  the moment of sending — the one address still stored, and a safe one:
  Kanri is named by the spawner, is never parked, and is never opened in a
  tab, and the launcher refuses a Kanri the listing shows `interactive`. No
  role caches it and no line announces it. A workspace whose roster does not
  exist yet has no Kanri to address.
- **Every other seat** is addressed by Kanri alone, the only session that
  sends to Sekkei, Keikaku, Jisso, Kaiseki, or Hosa. Kikaku is the human's
  seat: it sends Kanri a `decision: <path>` line and Kanri answers, but
  Kanri never addresses it first. A reply copies the envelope's `from` into
  `to` and needs no name at all.

**How Kanri sends a seat a line.** Two commands, with `$TANTO` set in the
same tool call:

```bash
node "$TANTO/scripts/boundary.js" seat <sessionId or name>
node "$TANTO/scripts/boundary.js" wake [--hold] <sessionId> [<sessionId> ...]
```

`seat` prints one line from the state file,
`<status> <name> <kind> <role> <turn>` — the kind `background`,
`interactive`, or `-` when the seat is not listed; the turn `ended` or
`open` by the spawner's own test over the seat's transcript, or `-` when
none is found — and `spawner: beating` or `spawner: stale` under it. For a
`sessionId` the state file does not hold it prints `no entry <kind>`, the
kind being the listing's. `wake` checks the beat, writes a `resume` request
with no prompt for each `sessionId` at once, waits up to sixty seconds in
all, and prints one line per seat: what `seat` would print then, or
`error: <the result's error>` with the name. A parked seat is woken, never
handed a line: a resume carries a prompt for a Kanri alone. By what `seat`
prints:

- `running`, `blocked` — send to `<name>` with `SendMessage`.
- `parked`; and `gone`, for any seat but a Kanri — run `wake`, then send to
  the name it prints, in the same turn; several seats are woken in one call
  and sent to afterwards. On `error: listed` the seat is alive after all —
  in a tab, or woken by the human — and the line goes to the name printed
  with it. `--hold` is for a wake the human asked for, from Remote Control
  or from anywhere else: it keeps the seat awake until 55 minutes after its
  last turn ("The faces of a seat", C-2).
- `stopped` — nothing is sent, but to a seat whose row's Events line says
  Kanri stopped it to hold it on the human's word, which is woken once he
  has lifted the hold.
- `removed` — never. `no entry` — run the census; the row's status then
  decides.

Any other error from `wake` that is not a `resume` result carrying an error
(that one is a failed wake, and "Resuming" says a seat whose wake fails is
lost), and a `SendMessage` that errors, is answered by running `seat` again
and following what it prints, once. A second failure is the Events line
`unsent: <sessionId> — <the line>` and one line to the human. A line whose
answer does not come, from a seat that `seat` now shows `parked`, was caught
by its stop: Kanri wakes the seat and sends the line again, and the seat
reads it twice and answers once.

**The beat comes before every request.**
`node "$TANTO/scripts/boundary.js" beat` prints the `spawner:` line, and
Kanri runs it before a `spawn`, a `stop`, an `attention`, or an `ack`;
`wake` runs it itself. On `spawner: stale` Kanri writes no request, records
what it owes as the Events line
`unsent: <sessionId or op> — <the line or the request>` — through
`record --event` in the open ledger, in the roster's Events when none is
open — and tells the human in one line to run `tanto fukki`, saying that a
stale spawner raises no notice of its own. Kanri's Recovery sends every
`unsent:` line with no `sent:` pair and writes the pair. A pair is matched
on the text after the prefix, without the `(batch <X>)` that
`record --event` appends at a boundary, and two different lines to one seat
are two events.

**A peer's line to Kanri.** A role whose send to Kanri errors, or gets
`no-role` back, holds its line and re-sends it to the roster's first data
row, read fresh, at its next wake-up. No line announces a successor's
address: the successor rewrites the first row at its start, and that row is
what every peer reads. On Kanri's side, a peer line it receives and does not
answer in the same turn becomes the ledger's `unanswered: <from> — <line>`
events line, written through `record --event` and paired with
`answered: <from> — <line>` when it is answered.

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
directory is `$CLAUDE_CONFIG_DIR` when set and `~/.claude` otherwise. A
session whose cwd is a worktree under the repository — shoki's — writes its
transcript under the slug `<repo slug>--claude-worktrees-<name>`, the
harness's encoding of that cwd, and the spawner's `findTranscript` searches
every slug. Then, with `T` the transcript path and `$TANTO` the skill's own
directory, **both set in the same tool call as the command**:

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
  sequence's effort check takes it, and the start line reports it; the
  reading itself travels without it.

The first line the command prints is the reading, and it travels as it is:
appended after ` — ` to the boundary and exit lines the roles already send,
and written into the batch and Kaiseki reports where their templates have a
slot. A reading appended to an answer line is the output of a run made after
the file that line points at was written, in the step that sends the line —
never one recalled from an earlier run. A compaction does not shrink the file, and a tool result is stored at
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

**Identity is the `sessionId`**, for every seat. The transcript path is a
function of it — `<config dir>/projects/<project slug>/<sessionId>.jsonl` —
and the name is what `claude agents --json` and `ListAgents` currently print
for it ("The address"). The spawner names a seat at its spawn; a tab that
holds the seat shows the editor's name instead, and a resume keeps the id.
The roster's Transcript column holds the path — or, for a seat whose
transcript the spawner had not found when it wrote its result, the bare
`<sessionId>.jsonl` — and therefore the id: the basename, which holds when
the path does not. `unavailable` stands only where there is neither, and no
`Sess` column is added, because it would duplicate the basename.

| what happened | what the run does |
| --- | --- |
| an editor reload or restart, or a tab closed | nothing is asked of anyone: no fukki, no report. The background processes are unreached by it; a tab the human does not reopen is a parked seat, woken when a line is next due to it; a turn the reload cut is continued by a word in the tab ("The faces of a seat", C-5). A seat a tab held is listed again under a new name, which the next row covers |
| a seat renamed | the census prints the seat's line ending `— renamed`, its listed name not being the row's Name cell; Kanri rewrites the row's Name cell and writes `resumed: <old name> → <new name>`, and that is all. The seat itself does nothing and checks nothing |
| a line due to a seat that is not running — parked, or gone | Kanri runs `seat` and follows "The address": a `parked` seat, or a `gone` one that is not a Kanri — a stale entry with no `pid` included — is woken by `wake`, a `resume` request run as `claude --resume <sessionId> --bg` with no prompt and no flag, which keeps the `sessionId` and the whole conversation, and the line goes to the name `wake` prints. A `queued` row goes `live` before its `batch:` line is sent, woken or not. A wake is never a spawn and never a replacement; it covers every line to a seat — a queued Jisso's `batch:` line, a rework prompt's, the `close:` line, a `coldread:` line, a `continue:` after a pause — and costs nothing for a seat that is alive, which `wake` answers `listed`. A seat whose wake fails, or whose transcript is not on disk, is lost: `roles/kanri.md`'s Replace table decides what follows |
| a reboot, a crash, or a spawner that died | `tanto`, or `tanto fukki`, reads the state file, starts the spawner when none beats, and writes a `resume` request for every seat it holds as `running` or `blocked` that is not a dialogue seat and that the listing does not hold, and for a Kanri it holds `gone`; never for a `parked`, `stopped`, or `removed` seat. A dialogue seat the reboot took is `parked` at the new spawner's first census pass, with `— mid-turn` when its turn was cut, and Kanri's Recovery wakes it. The roster's first row is settled first and separately, so a Kanri the listing has lost but the state file still holds — `gone` included, a Kanri the human `/stop`ped or one that crashed while the spawner ran — is **resumed and never spawned again**. A seat held as `stopped` or `removed` is not resumed, which is why `tanto teishi --seats` retires a run rather than pausing it |

`tanto` and `tanto fukki` are idempotent: run twice, they start nothing
twice. `tanto` puts back what a restart took and enters Kanri; `tanto fukki`
is the same recovery with Kanri told in every case, and the human types
nothing in Kanri for it. A Kanri the launcher resumed gets `/tanto fukki` as
its resume's prompt — the one role a resume carries a prompt for; a Kanri
that is alive gets the line `fukki: requested at the launcher` from the
messenger, a `denrei` seat on `sessions.denrei` that forwards that one line
and is stopped and removed when its turn ends. A bare `tanto` passes the
word to a Kanri it resumed and sends no messenger.

`/tanto fukki` typed in Kanri, the `fukki:` line, and a resume whose prompt
is `/tanto fukki` are one procedure, `roles/kanri.md`'s "Recovery": the
census acted on at once, with no window to wait for; one `wake` for every
seat with a topic marked `— mid-turn` under **Parked**, each sent the one
`resume:` line that continues a cut turn; a Jisso resumed mid-batch sent
`resume batch X from task N`; the `renamed` marks reconciled; every
`unsent:` line with no `sent:` pair sent, and every `unanswered:` line
answered; every `paused:` line still unanswered probed once; and what was
put back printed in the idle block. Kanri acts on a `fukki:` line only when
`boundary.js seat <the envelope's from-name>` prints a seat whose role is
`denrei`. `fukki` is Kanri's word alone among the sessions ("Invocation").

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
  directions, the bug-report route and its `received:` answer included:

  ```text
  <the tanto line>
  (tanto line — if this window has not run /tanto, reply no-role to the sender and do nothing else)
  ```

  A role skips the second line. The run no longer asks for a window to be
  wiped under a role, but two senders can still reach a session that holds
  no role: one that read a name from the state file seconds before a window
  reload gave that name to another window, and a bug-report sender reading
  another repository's roster. A session that holds no role finds in the
  line the whole of what is asked of it. In a message longer than one line
  the `no-role` line follows the first: a batch prompt travels as the one
  line `batch: <path>`, and the file that path names carries no such line of
  its own; a `close:` line is one line. A file a line points at — a report,
  a brief, a bug report — is not a message and carries no such line. The
  `no-role` reply is the one word and carries no second line of its own.
  On a `no-role` the sender re-reads the address — Kanri, the seat's name by
  `seat` ("The address"); a role, the roster's first data row — and sends
  once more, marking no row. A role that gets `no-role` again from Kanri's
  address is in a handover gap: it holds the line and re-sends it to the
  first data row, read fresh, at its next wake-up, until it is answered —
  or, when that row's own name is stale, to the name `claude agents --json`
  prints for the `sessionId` its Transcript basename carries. A second
  `no-role` from one `sessionId` is, for Kanri, the end of that seat: a seat
  held in a tab whose conversation the human wiped in his own chat is a bare
  window under a known row. Kanri writes an Events line with what was lost
  as far as it knows, writes the row `stopped` — verifying the tree first
  when the row was the live Jisso's — and follows `roles/kanri.md`'s Replace
  table.
- **A seat's turn ends with its closing line**, in its own window and in the
  human's language: an identity, then two facts, and never an opinion. The
  identity is the seat's bare name — the one `claude agents --json` prints
  for its own `sessionId` when the line is written, never a `ListAgents`
  reading of its own and never a `[ref]` — then `<role>[/<topic>]` (the
  topic named for a Sekkei, Keikaku, Jisso, or attached Kaiseki; bare for
  Kanri, Kikaku, Hosa) and `<family>`, the model word its own system prompt
  currently reads, fresh across a `/model` switch. A seat open in a tab is
  listed under the editor's name, which changes at every window reload; the
  line names whatever is listed then, and nothing keys on it ("The
  address"). The two facts, as before: where its work is — the paths its
  output went to, or the commit subject — and the contract step that still
  needs this seat, named by step and site, or `none`. A seat never names a
  step it is not needed for: the recommender's run, the human's check, the
  apply, and Kanri's verification are not waits of the seat's and are never
  listed. At its final boundary — its last report line sent, or `taiseki` —
  (a seat with a tab, which shoki, spawned into a worktree and reading no
  role file, is not) the second fact is
  `none — this seat has ended; close its tab if one is open`, and a seat
  that has written that line answers any later message with the same line
  and nothing else: an ended seat's row stays in the editor's list, opens
  with a normal prompt box, and has its role in its context. A turn that
  sends Kanri a line adds it, unchanged and reading included, on a `sent:`
  line under the closing line — absent on a turn that sends nothing.
  Kanri's own idle block carries the same identity as its first line after
  `---`; it needs no `sent:`, since Kanri's own lines are already files or
  `R-n` text. The form, rendered in the human's language:

  ```text
  <name> · <role>[/<topic>] · <family> — Work: <paths, or the commit subject>. Still needs this seat: <step — its site> | none.
  sent: <the one line sent to Kanri this turn, verbatim>
  ```

  Two examples — a Jisso at its boundary, `<name> · jisso/<topic> · sonnet
  — Work: .tanto/<topic>/batch-B-report.md, commits b81f677..dba2562. Still
  needs this seat: the boundary's verdict — roles/jisso.md, "The run".`
  `sent: .tanto/<topic>/batch-B-report.md — <reading>` (the one line a Jisso
  sends Kanri at its boundary is that path — `roles/jisso.md`, "The run");
  a Sekkei at its final boundary, `<name> · sekkei/<topic> · fable — Work:
  <spec path>, .tanto/<topic>/dialogue.md. Still needs this seat: none —
  this seat has ended; close its tab if one is open.` This shapes the text
  the harness already requires when a turn ends; it opens no channel, and
  "Human access" stands as it is.
- **The commit window opens only for a peer with a commit waiting.** A
  Sekkei or Keikaku of another topic whose work is ready while a batch runs
  writes the ledger event
  `commit-ready: <role> <topic> — <subject> — <YYYY-MM-DD HH:MM>` through
  `boundary.js record --event`, to the ledger its own prompt's `ledger=`
  key names.
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
  for Keikaku, from `templates/review-brief.md`, in the human's language —
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
when the human noticed the defect, they hand it to a Hosa as a chore, or
say it in Kanri's window. **The intake is the target repository's Hosa while
one is listed, else its Kanri**: the sender reads
`<workspace>/.tanto/roster.md`, takes the bare `<name>` before the bracket
of the `Name [ref]` column of the row whose Role is `hosa` and whose Status
begins with `live` — Kanri appends one of the two suffixes the Status column
names to that cell — and checks it against `ListAgents`. A Hosa is parked
between its turns and its name is then not listed, so when it is not, or
there is no such row, the sender takes the first data row's name instead;
in practice the intake is Kanri, a Hosa being named only for the minutes it
is in a turn or held — decision-c322's "the cheapest seat that is live",
live read as listed, which is what a sender can check. The human supplies
the workspace's path where the sender does not know it, and the address
when the roster is absent — a workspace not yet migrated, or an older
skill — or the first row's name is not listed either. The roster is
Kanri's to write and the sender's only to read; the read is of a file
outside the sender's own working directory, and outside auto mode the
harness may put a permission prompt for it in the sender's window — the
harness's own prompt, and not a failure of the route. A defect that
surfaces in a spec dialogue reaches Kanri as an `I-n` in `spec-inputs.md`,
not as a bug report.

The intake answers with one line, `received: <inbox path>` — a burst of
reports from one sender in one message carrying one such line per report,
each pairing with its `bug-report:` line by path — after one act that
reads nothing of the report: the file is copied to
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
themselves in the human's language (for a spec, section 5's body is the one
line the template gives, rendered); every point opening with one of the four
tags — confirm, choose, decide, nothing — and every unsettled line opening with one of them too and
saying whether an answer is needed, and a decide line among them carrying the
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
standing grants exist, each stated where its seat reads it at its start:
Sekkei's spec dialogue, in `roles/sekkei.md`; Keikaku's plan dialogue, in
`roles/keikaku.md`; an attached Kaiseki's debugging conversation, in its
brief; and Hosa's chores, in `roles/hosa.md`. Kikaku needs no grant: it is
the human's own seat, and the human in that window is its counterpart by
definition. A standalone Kaiseki has no Kanri, and the human in the room is
its counterpart.

The request is one line to Kanri,
`human-needed: <what the human must do> — <why no other way> — <where: this window>`,
and the role waits for the answer. Kanri answers in one line,
`human-access: granted — <scope> — <until>` or
`human-access: denied — <alternative>`, recorded as `R-n`. On a grant Kanri
tells the human, as a numbered list: 1. `tanto <role> [<topic>]` in a
terminal, or, for a dialogue seat, a click on its row in the editor's list;
2. do `<what>`; 3. ← and leave the agent view, or close the tab. Kanri also
writes an `attention` request, whose message is
`human-needed: <role> <topic> — tanto <role> [<topic>]`, because a seat that
waits on a grant is not `blocked` in the listing's sense, and the spawner's
census alone would miss it. The role's direct exchange
stays within the scope and ends with one line to Kanri,
`human-access: done — <what the human did or decided>`.

This is protocol, not enforcement: every role has its own window, and two
things stay outside the rule. The harness's own prompts, a permission dialog
among them, reach the human in the role's window and cannot be routed
through Kanri. And when the human speaks in a
role's window unprompted, the role answers, because silence costs more than
the exception, and sends Kanri one line,
`human-contact: <one line on what was said>`; that is not a grant for anything
beyond the exchange.

## Session exit

A session's items reach `docs/` once, at its topic's **close**, after the
final batch. An exit — a seat done with its work, a Kanri handing over, a
Jisso retiring at its boundary — writes those items to a file, its
**shoroku proposal**, and nothing more; nothing is recommended, checked, or
applied at an exit. `R-n` numbers Kanri's rulings and `S-n` the proposal
items, both in the conductor ledger, whose `S-n` table's columns are S-n,
Source, Item, Destination, Adopted, and Written.

The close runs four steps — **propose, recommend, check, apply** — and every
other moment runs only the first:

1. **Propose.** The seat that holds the items writes them: a numbered list
   opening with the line that says what the proposal excludes, or, for a
   retiring Jisso, the **Shoroku proposal** section of the batch report it
   writes at that boundary. Only this step needs a resident context. Kanri
   checks the file's form — the exclusion line and the numbered list, or the
   report's section — records each item as a `pending` row of the ledger's
   `S-n` table whose Source names the file and the item, and writes the
   seat's `stop` request, a retiring Jisso's as every other's. The spec's
   four sections — Requirements, The ADRs, Deferred
   items, and Shoroku proposal from this spec work — are recorded the same
   way when the spec is accepted, four rows whose Source names the spec and
   the heading; a review report's and a Kaiseki report's items are recorded
   at the boundary that reads them. Nothing is copied: a row is one line and
   a pointer, and the rows are the lineage — however many sessions carried a
   seat, its items are in one table.
2. **Recommend.** At the close, Kanri dispatches the `shoroku.recommend`
   kind over the close's shoroku proposal, every source the `pending` rows
   name — the spec's sections by heading, each proposal by path, each report
   by path and item, each with its `S-n` — and every untriaged copy under
   `.tanto/inbox/`, by path, names `skills/` as the paths a `fix` item may
   touch, and names the output, `shoroku-recommendation.md`:
   every item once, quoted in full from its source, its heading carrying the
   pointer its `Source:` line will take, in four groups — Recommended adopt,
   Recommended fix, Recommended reject, Unsure — each with its destination
   and its one-line reason. An inbox item's destination is one of `issue`,
   `fix — <file>`, `redirect — <where it belongs>`, `kaiseki — <one line>`,
   `relay — <topic>`, or `dismissed — <one line>`; a `fix` item carries the
   file, the text as it reads, and the text as it should read.
   The same dispatch names the brief path, `shoroku-brief.md` beside the
   recommendation, the template `templates/shoroku-brief.md`, and the human's
   language; the recommender writes both files in one run.
   <!-- markdownlint-disable MD038 -->
3. **Check — the close kessai.** Kanri checks the brief's form by `grep` —
   the five headings present and in order, every `###` item heading's text,
   its `### ` marker stripped, appearing exactly once after `See:` in the
   brief — dispatches the recommender once more on a failure and pastes the
   brief as it stands on a second. Then it writes an `attention` request
   whose message is `kessai: <topic> — tanto kanri`, and prints in its
   own window **one** question carrying the recommendation's path, the
   brief's path, the three counts, the merge decision, and the merge's
   default form — `--no-ff` into `main`, the local branch deleted, nothing
   pushed — with the brief's text verbatim below it. The human answers by
   exception: in Kanri's own session, entered by `tanto`, through a Kikaku
   decision file whose third section names this recommendation and answers
   it, or by telling a Hosa, whose chore is then the one line
   `kessai answer: <topic> — <the human's words verbatim>`. That one answer
   is the direction and the merge approval. Kanri writes `shoroku-direction.md`
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
   `docs: shoroku for <topic>`, dispatches `shoroku.review` over its own
   diff and applies its findings once, rebases onto `main`, and reports
   `shoroku ready:` or `shoroku blocked:`. Kanri runs the landing checks and
   fast-forwards `main` onto that branch. No session applies the accepted
   subset of its own proposal, and no machine ever resolves a conflict.

The recommend is Kanri's own dispatch, the check is the kessai in Kanri's
window, and the apply is shusei's and shoki's. A Hosa is delegated none of
it and relays one line when the human gives it his answer,
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
Hosa write no shoroku proposal. A standalone Kaiseki has no Kanri, and its
role file says how.

**`taiseki`.** A Kikaku, a Hosa, and a standalone Kaiseki — the seats the
human paces — end only when he types `/tanto taiseki` in one, from a
terminal, a tab, or Remote Control alike. One never left that way stays
parked, at no cost, and the next `tanto <role>` continues it, its
`context=` printed as he enters. The seat:

1. Writes out what is unsent. A Kikaku with something decided and no file
   writes the decision file and sends its `decision:` line. A Hosa with a
   `chore:` open or a `slot-needed:` unanswered says which, and does not
   leave. A standalone Kaiseki runs its shoroku and commits, as its role
   file asks.
2. Runs `node "$TANTO/scripts/boundary.js" request leave --transcript "$T"`,
   which writes a `stop` request for its own `sessionId`, marked `self`,
   with the `after` a park request carries.
3. Ends its turn with its closing line, whose second fact is the ended
   seat's ("Messages").

The spawner honors such a stop for those three seats alone. It stops a
background seat once its turn has ended, so that the closing line is
written, and records the end at once for a seat a tab holds or one that is
not listed. A closing turn that never ends is dropped ten minutes on, with
the notice `taiseki not done: <role> — tanto <role>`, so that the word
never fails in silence. The seat is `stopped`, Kanri writes its row
`stopped` at its next census (**Ended**), and the next `tanto <role>` finds
no holder and starts a new conversation, whether or not the ended seat's
tab is still open.

**Who proposes when.**

- **Jisso** proposes at every boundary, in its report's Shoroku proposal
  section, and that section is its shoroku proposal: one Jisso runs one
  batch, and the boundary Kanri accepts is where it retires. No `exit:` line
  and no proposal file go to a Jisso. At the close the plan's last live
  Jisso writes the close's shoroku proposal on Kanri's line
  `close: propose; write it to .tanto/<topic>/shoroku-proposal-jisso-<short id>.md`
  — the `pending` rows by number and what its own context holds that no
  file does — and is stopped on its form check, its conversation kept.
- **Sekkei and Keikaku** write their proposal unasked at their own final
  boundary and name it in the report line —
  `spec accepted: <spec path>; shoroku proposal: <path> — <reading>` for
  Sekkei,
  `coldread answered: <pointer, one per question, or none>; shoroku proposal: <path> — <reading>`
  for Keikaku. An exit that falls away from that boundary — a compaction in
  the reading, the human not wanting the plan now — takes the `exit:` line
  like a Kaiseki's.
- **Kaiseki**, attached, is sent `exit: propose; write it to <path>` when
  its case closes, writes the proposal, and answers
  `shoroku proposal: <path> — <reading>`.
- **Kanri** writes its own proposal from the ledger and the roster, never
  from recollection, at two kinds of moment. **At every plan close**, after
  Jisso's proposal and before the recommender is dispatched, so that the
  close's one check covers Kanri's items with everything else — whether or
  not the close's handover is then declined; what the close teaches after
  that file is written goes to a further file, the next `-<n>`, whose rows
  go to the roster's Shoroku proposal items table. **At a handover** that is
  not a close: while any ledger is open, the items are `pending` rows in the
  ledger of the topic whose batches are in flight, else the oldest open;
  between plans, with no ledger open, they are rows of the roster's table,
  which move into the next topic's ledger when it opens. No Kanri exit runs
  a recommend, a check, or an apply of its own. A topic the human ends
  before its final batch still gets its close, over what is on disk, with
  Kanri writing the close's shoroku proposal in Jisso's absence.

**The files.** Every proposal file is
`shoroku-proposal-<role>-<short id>.md`, `<short id>` being the first eight
hexadecimal digits of the writing session's `sessionId` — the same eight
digits as a background seat's CLI short id — with `-<n>` before `.md`, `n`
from 2 upward, for a further file by the same session, never a rewrite of
one already written. A proposal file lives in the topic directory,
`.tanto/<topic>/`, and Kanri's in `.tanto/` beside the roster. A session
knows its own `sessionId` from its transcript path; Kanri knows a seat's
from the Transcript column of its row. A Jisso's proposal is its report's
section, and the close's is
`.tanto/<topic>/shoroku-proposal-jisso-<short id>.md`, the last live
Jisso's. The close's other files are named by the step —
`shoroku-recommendation.md`, `shoroku-brief.md`, `shoroku-direction.md`,
`shoroku-review.md`, `shoki-brief.md`, and `batch-shusei-prompt.md` — and
live in the topic directory; there are no others. The close's commit
subjects are `docs: shoroku for <topic>`,
`docs: shoroku for <topic>, review fixes` when shoki's review found
anything, and, when the direction accepted a `fix` item,
`fix: text corrections from <topic>'s close` — the two fixed prefixes,
`docs: shoroku for` and `fix: text corrections`, that the whole-branch
review package excludes.

**The exit itself.** Every line above is sent without an idle
subscription, like every other tanto line. Kanri checks that the proposal
exists and opens with the exclusion line and a numbered list — a direct
read, since the proposal carries no headings for `sections` to select by —
or, for a Jisso, reads the report's Shoroku proposal section with the
report's others; records the rows; and writes the seat's `stop` request,
its row going `stopped`. Nothing is said to the seat and nothing to the
human: the seat's own closing line has said that it has ended. The spawner
runs no command for a seat a tab holds — `claude stop` reports success
there and stops nothing — and records it `stopped` with
`note: "in a tab"`; a `parked` seat is recorded `stopped` with
`note: "already exited"`. Ending a seat means that nothing is sent to it
again, and two obligations rest on that. A write or a `commit-ready:` event
from a seat Kanri has ended is stray, and goes by rule 5's report path. And
a `spawn` that replaces a seat — the Replace table's Sekkei, Keikaku, and
Kaiseki rows — waits while `boundary.js seat <the old sessionId>` prints
`interactive`: Kanri tells the human in one line which tab to close, and
writes the request when a later reading no longer does, so that no two
seats of one role and topic are held at once (rule 4).

A seat that stops answering before its exit is looked for, not waited on.
Kanri learns of it the way it learns of a missing batch report — the human
says so, a send errors, `seat` no longer shows it running, the census's
"Not listed" names it, or Kanri's session wakes for another reason and the
answer has not arrived. A seat whose transcript is on disk is not lost: a
parked one keeps its row `live` and is woken when a line is next due to it,
and one the census marks `dead` — with an Events line naming what showed
its process gone and saying its conversation is kept — is woken the same
way ("Resuming"). A seat whose wake failed, or that answered
`no-role` twice, is a forced exit: the roster's Events line says its
shoroku proposal was not written and what was lost, as far as Kanri knows;
the row goes `stopped` on the second `no-role` or stays `dead`; and Kanri
continues.

## The faces of a seat

Every seat is a background session the spawner started. A **face** is a
place the human talks to it from: a terminal attach, entered by
`tanto <role> [<topic>]`; a VS Code tab, opened by a click on the seat's row
in the editor's list; and Remote Control. They are faces of one seat, and
the seat is in one place at a time: the launcher refuses a seat a tab holds,
and tells the human to close the tab first.

**A dialogue seat is parked between its turns.** Sekkei, Keikaku, Kikaku,
Hosa, and Kaiseki end every turn — unless something they dispatched, a
subagent or a background command, is still running — with
`boundary.js request park`, adding `--waiting` while a question of theirs to
the human stands; their role files carry the rule. Once the turn has ended,
and the listing shows the seat idle and not held, the spawner
stops its process and keeps its conversation. That is what makes the tab a
face: a background seat that is alive shows the editor's "still open
somewhere else" notice on its row, and one that is stopped opens there with
a normal prompt box. A parked seat is woken — by the launcher's attach, a
click on its row, or Kanri's `wake` — and never handed a line: a wake
carries no prompt, and the line follows it. One woken that takes no turn is
parked again two minutes later, its own last request carried out again.
Kanri, Jisso, shoki, and the messenger are never parked; Kanri's faces are
the terminal attach and Remote Control, and it is never opened in a tab.

When a turn the run started — a peer's line, a subagent's completion — ends
on a question to the human, the spawner raises one desktop notice,
`waiting: <role> <topic> — tanto <role> [<topic>]`. A turn he started
himself raises none, and a question that already stood raises none again.

The faces come with five constraints, which the README states too:

- **C-1** — a dialogue seat is entered from a terminal by `tanto <role>`,
  not by a bare `claude attach`, and not from the agent view that ← opens:
  neither tells the spawner that the human is there, and the seat's own park
  at its turn's end closes that screen under him. Kanri is entered by
  `tanto`, and is not opened in a tab.
- **C-2** — a parked seat is offline to Remote Control until something
  wakes it. From there the human asks Kanri, which wakes it and holds it
  awake until 55 minutes after its last turn; without that hold a dialogue
  seat would be one turn long from that face.
- **C-3** — a seat started after the editor's list was loaded is in the list
  after `Developer: Reload Window`; a click on its row opens it. For about
  half a minute after a turn ends the row may still show the "open somewhere
  else" notice.
- **C-4** — a tab's turn runs at the editor's effort and on the extension's
  bundled binary; a version gap that keeps a tab from opening is accepted,
  since the terminal remains.
- **C-5** — a window reload cuts the turn of a seat open in a tab, with its
  background work; a word in the tab continues it.

## Artifacts

| Path | Writer | Readers | Content |
| --- | --- | --- | --- |
| the spec, at the path Sekkei's `spec=` key names — by default `docs/superpowers/specs/<date>-<topic>-design.md` | Sekkei | Kanri, Keikaku, Jisso | the spec; committed by Sekkei, or by the Keikaku created after the merge when it was a draft |
| `.tanto/<topic>/spec-draft.md` | Sekkei | the spec reviewer, Kanri, Keikaku | the spec while another topic's batch is in flight; nothing is committed and no branch is cut until Keikaku commits it at its final path |
| the plan, at the path Keikaku's `plan=` key names — by default `docs/superpowers/plans/<date>-<topic>.md` | Keikaku | Kanri, Jisso | the plan; committed; carries Global Constraints, a Batches section, and how a batch is verified |
| `.tanto/roster.md` | Kanri | all roles; a bug-report sender, its listed Hosa row or its first data row | one row per seat, written from the spawner's result file; a standalone Kaiseki and the messenger get none |
| `.tanto/roster-archive.md` | Kanri | Kanri | from `templates/roster-archive.md`; the roster's stopped, dead, and replaced rows with their last readings, and the closed plans' Events lines, appended at each plan close |
| `.tanto/kanri-handover.md` | the outgoing Kanri | the successor Kanri | the handover; deleted by the successor once accepted. In flight, Live peers, and Not reconstructed in full; the rest pointers |
| `.tanto/inbox/<date>-<slug>.md` | the intake — a Hosa while it is listed, else Kanri | the close's recommender, by path; the apply, for the Triage section | a bug report received, under the sender's basename, with its Received line; its Triage section is filled by the close's apply and marks the copy triaged |
| `.tanto/sent/<date>-<slug>.md` | the session that noticed the defect — any role, or Hosa from the human's words | the intake of the target workspace, by the path the `bug-report:` line carries | a bug report sent, from `templates/bug-report.md`; kept, never deleted by a rule |
| `.tanto/inbox-<date>-recommendation.md`, `-brief.md`, `-direction.md` | the between-plans inbox sweep's recommender, and Kanri or Hosa for the direction | Kanri, the human, the apply | the sweep's three files when no topic is open, beside the roster |
| `.tanto/kikaku/<YYYY-MM-DD>-<slug>.md` | Kikaku | Kanri | one decision from the human's consultation, from `templates/kikaku-decision.md`; named to Kanri as `decision: <path>`, and from there the next topic's input document, an `I-n`, an `S-n` source, or a stage's Check answer |
| `.tanto/<topic>/kanri.md` | Kanri, or the `boundary.verify` subagent it dispatches, through `boundary.js record` | Sekkei, Keikaku, Jisso, Kaiseki, Kikaku, Hosa | the conductor ledger; it never moves |
| `.tanto/<topic>/spec-inputs.md` (optional) | Kanri | Sekkei | scope inputs the human gave Kanri during spec work, numbered `I-n`, each with Kanri's advisory notes |
| `.tanto/<topic>/dialogue.md` | Sekkei | Kanri, the brief writer, the close's recommender | the spec dialogue: each question Sekkei put and the human's answer, verbatim, in order |
| `.tanto/<topic>/review-brief-spec.md`, `.tanto/<topic>/review-brief-plan.md` | the brief writer the document's author dispatches | the author, then the human; Kanri by the path in `review-ready:` | the review brief, from `templates/review-brief.md`, in the human's language |
| `.tanto/<topic>/plan-dryrun.md` | Keikaku | the plan reviewer, Kanri | from `lint` and `replay` — the two commands, each one's output, and Keikaku's ruling on every failure |
| `.tanto/<topic>/coldread.md` | the `plan.coldread` subagent Kanri dispatches | Kanri, by `sections` | the cold read of the committed plan: a numbered list of open questions, or `none`; Kanri sends Keikaku one numbered message carrying all of them, or `coldread: none`, and Keikaku answers with one `coldread answered:` line |
| `.tanto/<topic>/batch-<key>-prompt.md` — `<key>` the batch's letter, `fixwave` for the fix wave, or `<X>-rework-<n>` for a batch returned for rework, `<n>` 1 for its first rework and one more than its highest so far after that | the `boundary.verify` subagent, from `templates/batch-prompt.md`; Kanri for its two `<Kanri fills>` slots, and for a rework's own prompt at `batch-<X>-rework-<n>-prompt.md` | the seat the `spawn` request creates, or the `queued` seat under a skill-editing plan; for a rework, the Jisso of the batch it runs again; human | the prompt; sent as the one line `batch: <path>`, which the human pastes if the message did not arrive. The send freezes it: a prompt, a report, or a verdict of a batch a seat has run is never written again, and a rework's three files are new files beside the first pass's. The one file written again is the next batch's prompt, rendered at every boundary and not yet sent |
| `.tanto/<topic>/batch-<key>-verdict.md` | the `boundary.verify` kind Kanri dispatches, the dispatch's `batch=` carrying the key | Kanri, by `sections` | the boundary's verdict: eleven fixed sections, and a twelfth, `Measurement`, when the batch carried a measurement task |
| `.tanto/<topic>/batch-<key>-report.md` | the Jisso of that batch, at the path its prompt's Report section names | Kanri; the close's recommender, its Shoroku proposal section by path and item | fixed skeleton; its Shoroku proposal section is that Jisso's shoroku proposal |
| `.tanto/<topic>/kaiseki-<n>-brief.md` | Kanri | Kaiseki | fixed skeleton |
| `.tanto/<topic>/kaiseki-<n>.md` | Kaiseki | Kanri, Jisso | fixed skeleton |
| `.tanto/<topic>/shoroku-proposal-jisso-<short id>.md` | the plan's last live Jisso | Kanri, for its form; the close's recommender, by path | the close's shoroku proposal: the `pending` rows by number and what that Jisso's own context holds that no file does, written to a file instead of printed |
| `.tanto/<topic>/shoroku-proposal-<role>-<short id>[-<n>].md`, or `.tanto/shoroku-proposal-kanri-<short id>[-<n>].md` | the exiting session — Sekkei, Keikaku, an attached Kaiseki; Kanri at every plan close and at every handover; never Jisso, whose proposal is its report's section | Kanri, for its form; the close's recommender, by path | the session's shoroku proposal, opening with the line that says what it excludes; `-<n>` a further file by the same session, never a rewrite of one already written |
| `.tanto/<topic>/shoroku-recommendation.md` | the `shoroku.recommend` kind Kanri dispatches at the close | Kanri, the human, the apply subagent | every proposal item once, quoted in full from the source its `pending` row names, in four groups — Recommended adopt, Recommended fix, Recommended reject, Unsure — each with its destination and its one-line reason |
| `.tanto/<topic>/shoroku-brief.md` | the `shoroku.recommend` kind, in the same dispatch as the recommendation | Kanri, by `grep` for its form and by `sections` (its bare heading text) for the `Unsure` group; the human, verbatim | the check brief, from `templates/shoroku-brief.md`, in the human's language: one line per item, grouped as the recommendation groups them, each pointing at the item's `###` heading |
| `.tanto/<topic>/shoroku-direction.md`, beside the recommendation | Kanri, from the human's answer — in its window, or a Kikaku decision file whose third section answers the recommendation | the `shoroku.apply` kind | what the human accepted, item by item; the apply never runs without it |
| `.tanto/<topic>/compaction-<role>-<n>.md` | the compacted session | Kanri | every item a compaction summary attributes to the human, one per line, rewritten with the human's answers |
| `.tanto/kaiseki/kaiseki-<n>.md` | a standalone Kaiseki | the human | its report, outside any run |
| `.superpowers/sdd/<plan-basename>/progress.md` | Jisso, through the SDD skill | Kanri | the SDD ledger; Kanri reads it and never writes it; the one artifact tanto reads under `.superpowers/` |
| `.tanto/.gitignore` holding `*`, and `.tanto/.markdownlint-cli2.yaml` holding `config:` / `default: false` | Kanri at start, a standalone Kaiseki, or a bug-report writer — whichever finds them absent first; never overwritten | git; the editor's markdownlint | keeps everything above untracked, so nothing is ever staged, and keeps the editor quiet on files the commit path never lints |
| `$CLAUDE_CONFIG_DIR/tanto.json` | the user | every role at start; the writer of a spawn request — Kanri, or the launcher through `scripts/reading.js` | the personal expected-model config, and where the human sets `language` for every repository |
| `<cwd>/.claude/tanto.json` | the repository | every role at start; the writer of a spawn request — Kanri, or the launcher through `scripts/reading.js` | the project expected-model config, overlaid on the personal one; committed or ignored as the repository decides |
| `~/.claude/agents/tanto-*.md`, or `$CLAUDE_CONFIG_DIR/agents/` when that variable is set | every role at its start, from the built-in and personal layers | the harness, at the next session start | one definition per kind, from `templates/agent.md`; a definition is dispatchable only from the sessions started after it was written |
| `<cwd>/.claude/agents/tanto-*.md`, and `<cwd>/.claude/agents/.gitignore` beside them | every role at its start, for the kinds whose effort the project file changes | the harness, at the next session start; git | the project-scope definitions, from the same template with its `<scope>` clause rendered; the `.gitignore` holds `tanto-*.md` and `.gitignore`, is written once and never overwritten |
| `.tanto/spawner/` — `pid`, `heartbeat`, `contract`, `log`, `seats.json`, `requests/<id>.json`, `results/<id>.json` | the spawner; a request file by Kanri, by the launcher, or by a seat through `boundary.js request` | the launcher, Kanri, `boundary.js` | the spawner's own state: one seat entry per session it started — its status, its listed name and kind, and the contract mark of the request that spawned it; one request and one result per act, the ops being `spawn`, `stop`, `resume`, `rm`, `ack`, `attention`, `park`, `hold`, and `release`; the heartbeat — the epoch milliseconds of its last beat, which the launcher trusts over `pid`; and `contract`, holding `2`, which the spawner writes at its start and the launcher reads to know the spawner is of this contract. The roster is not here and the spawner never reads it |
| `.tanto/<topic>/spawner-results/` | Kanri, at the plan close | Kanri | the topic's result files, moved with the archive move |
| `.tanto/<topic>/shoki-brief.md` | Kanri, from `templates/shoki-brief.md` | shoki, as its whole prompt | the scribe's contract: the arguments, what it never does, the five steps, the report line |
| `.tanto/<topic>/shoroku-review.md` | the `shoroku.review` kind shoki dispatches | shoki, then Kanri | the review of shoki's own diff against `main`, before it reports |
| `.tanto/<topic>/batch-shusei-prompt.md` | Kanri, from `templates/batch-prompt.md` | the shusei Jisso | the one-task fix batch of the close |
| `<root>/.claude/worktrees/shoki-<topic>` | Kanri, by `git worktree add` in the merge act | shoki | shoki's worktree and its cwd, on the branch `worktree-shoki-<topic>` cut from `main`'s tip; the spawner runs the seat in it and passes no `-w`; removed by Kanri (`git worktree remove --force --force`) along with its branch, after the `rm` request, which leaves both |

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
brief; its seven subcommands are `check`, which runs the boundary's
read-only commands and prints their output under fixed headings; `record`,
which writes the ledger's and the roster's rows idempotently; `census`,
which Kanri runs itself: read-only, it reads the spawner's state file and
prints the `spawner:` line and the roster's `live` and `queued` rows against
the sessions `claude agents --json` lists under the root, under six
headings — Listed, Parked, Ended, Not listed, No session id, and Not held
("The roster"); `request park` and `request leave`, which a seat runs for
itself, the first at the end of a dialogue seat's turn and the second for
`taiseki`; `seat`, which prints one seat's line from the state file; `wake`,
which resumes parked seats with no prompt; and `beat`, which prints the
`spawner:` line ("The address").
`scripts/spawner.js` is the one process in a run that issues `claude --bg`,
`claude stop`, `claude rm`, and `claude --resume`: a resident started by the
launcher and never by a session, which takes request files, writes result
files, keeps `seats.json`, a heartbeat, and the `contract` file, and names
each seat it spawns; refuses a second Kanri, Kikaku, or Hosa; parks a
dialogue seat once the turn its request named has ended, and stops it again
when it is woken and takes no turn; runs the spawner's census of
`claude agents --json` every fifteen seconds — which revives a seat that
returns to the listing, records a dialogue seat that leaves it `parked`, and
stops one that strays into `.claude/worktrees/` — and raises a desktop
notice on a seat blocked on a prompt, with its cause; on a turn the run
started that ends waiting on the human; on a strayed seat; on a seat with
no first turn two minutes after its spawn; on a `taiseki` not done; and on
an `attention` request, each naming the way in, `tanto <role> [<topic>]`;
`spawner.js notify --stdin` is the one-shot an optional harness hook may
call. `scripts/tanto.js` is the human's one command,
`tanto [<role>] [<topic>]`: it starts the spawner when none beats, enters
the seat of that role — Kanri when none is named — by attaching to it,
follows a Kanri handover to the successor with nothing typed, and starts a
Kanri, a Kikaku, a Hosa, or a standalone Kaiseki when none is held. Its
four words are `fukki`, which puts back what a restart took and tells
Kanri ("Resuming"); `teishi [--seats]`, which stops the spawner that beats,
and with `--seats` the run's seats, keeping every conversation; `jokyo`,
which prints the run's seats and what waits on the human, read-only; and
`taiseki`, which it answers with one line naming `/tanto taiseki`.
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
   this skill. The count is of seats held, not of tabs: the spawner refuses a
   request for a second Kanri, Kikaku, or Hosa while it holds one, a
   handover's successor excepted, and the launcher enters the holder instead
   of asking for another. A session is bound to its
   cwd — CLAUDE.md, memory, and permissions all come from it.
5. Kanri does not edit tracked files while a batch runs, and writes under
   `docs/` only while Jisso is idle or absent. Sekkei and Keikaku write only
   under the spec and plan directory their own prompt's keys name — by default
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
10. No seat is renamed after it starts — Kanri included, from its start line
    onward. A rename changes the name the listing shows and the envelope's
    `from-name`, the ref does not change, and the old name stops delivering
    even with the ref attached (measured 2026-09-06). The spawner names a
    seat at its spawn, before its prompt runs, and no role renames it after;
    a tab that holds the seat shows the editor's name, which changes at every
    window reload. Nothing keys on a name: a seat is its `sessionId`, and its
    name is looked up at the send ("The address").
11. A plan that edits this skill's own files runs on the skill it is
    editing: when the skill the sessions load is the working tree's own
    copy — a link into it, as in the repository that ships this skill — a
    session started mid-plan reads whatever is on disk at that moment.
    While such a plan is in flight, the authority for the run's sessions is
    the plan's Global Constraints, each seat's own prompt keys, and the batch
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
    replacement nor a creation under this rule. Such a seat is never
    stopped while it waits, and may still be collected: when its prompt is
    due it is resumed with the conversation that read the skill before
    batch A ("Resuming"), so the reason above holds, and a resume is neither
    a replacement nor a creation either. Every other plan spawns one Jisso
    per batch, at the boundary, from the batch prompt itself.

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
close's scribe, which works in the worktree Kanri cuts at
`.claude/worktrees/shoki-<topic>` and holds no runtime resource. Every batch
prompt restates that
as a Kanri directive. A modification in the shared tree that a session or its
own subagent did not make is not its to discard (Rule 5): it is reported, never
run through `git checkout --` or `git clean` on its own judgment, and only
Kanri decides whether it is stray.

`.tanto/<topic>/` outlives the plan, and so does the SDD workspace
`.superpowers/sdd/<plan-basename>/`. Jisso never deletes either, and nothing
asks the human to delete either: after the close the two have the same standing —
untracked, local to one machine, useful only for a later re-read — and disk
is the only cost (issue-12d3).

`.tanto/` reserves these names, and a topic slug is none of them and begins
with none of the prefixes: the
directories `inbox`, `sent`, `kikaku`, `kaiseki`, and `spawner`; the files
`roster.md`, `roster-archive.md`, `kanri-handover.md`, `.gitignore`, and
`.markdownlint-cli2.yaml`; and the prefixes `shoroku-proposal-kanri-` and
`inbox-`, with `exit-kanri-` kept for the files written before the shoroku
proposal was named, so that a start's listing of `.tanto/` does not report
a predecessor's old file.
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
