# Design: tanto-feedback — a record is placed by who acts on it: the close's recommender gets a `feedback` destination and each close sends one feedback file to the skill's repository; usage is measured from transcripts by `usage.js`, never copied from a seat's report, and kept as one tracked row per close; the intake carries four line kinds, and two Kikakus consult each other over it under a per-thread approval

Written by Sekkei on 2026-10-06. Begun as a draft at
`.tanto/tanto-feedback/spec-draft.md` while another topic's close held the
checkout, and committed by Sekkei at
`docs/superpowers/specs/2026-10-06-tanto-feedback-design.md`, on the branch
`tanto-feedback`, once that topic had merged and Kanri had cut the branch.

Every path below is relative to the repository root unless it says
otherwise; `<config dir>` is `$CLAUDE_CONFIG_DIR` when set and `~/.claude`
otherwise; `K` is `skills/tanto/roles/kanri.md` and `S` is
`skills/tanto/SKILL.md`. The surveys read the `run-owned-seats` branch at
the commit whose subject begins "fix: the README's backticked cleared
goes"; the spec reviewer and the Old values list read `tanto-feedback` at
"merge: run-owned-seats — the run owns its seats". The plan re-reads every
quoted sentence at its own base.

The tracked-write rule binds this document: it names no repository but this
one, no path or session of another, and quotes no other repository's
documents. Where the input documents give an example from another
repository, this text restates it against this repository's files.

## Fixed inputs

The input document is
`.tanto/kikaku/2026-10-06-tanto-feedback-fifteenth-and-the-consult-line.md`,
read whole; it places the topic fifteenth, gives its scope in full, and
decides the consult line and its per-thread approval. Behind it, as it
lists them: `.tanto/kikaku/2026-10-06-tanto-feedback-by-actor.md`, read
whole — the axis, mechanisms A and B, the expectations E1 to E9, and the
interim; `.tanto/kikaku/2026-10-06-kikaku-handover-tanto-feedback.md`;
§4 of `2026-09-16-fable-diet-and-shoroku-feedback.md`, §5 of
`2026-09-18-parallel-close-and-tanto-feedback.md`, §4 of
`2026-10-01-topics-after-experience-layer.md`, and §4 of
`2026-10-03-topics-after-triage.md`, all under `.tanto/kikaku/`; and the
decisions c322, 62dd, 1708, and 1ab5 under `docs/decisions/`.
`.tanto/tanto-feedback/spec-inputs.md` holds Kanri's I-1, answered under
"Answers to the spec inputs".
The spec dialogue is `.tanto/tanto-feedback/dialogue.md`, Q-1 to Q-10 and
D-1.

Under the experience layer the requirement register is `docs/experience/`;
each decision names the expectation it serves — of the scenes `exp-09c2`
("a skill lives in other repositories"), `exp-06b2` ("a plan handed to a
run"), and `exp-57f4` ("reaching a run, and being reached by it"), and of
the driver `d4d7` in `docs/experience.md` — or says that none does.

From the input documents:

- **The axis** (by-actor §1). A record a run leaves is placed by who
  changes behavior by reading it, never by what it is about. Extends
  `exp-1c7a`, which speaks of a defect he notices while using a skill,
  dropped off in one line and decided later at a checkpoint he checks
  anyway: here the finding is the run's own, and the drop-off is the
  close's.
- **Mechanism A** (by-actor §2). `feedback` is a destination of the close's
  recommend dispatch; one file and one line per close travel to the intake
  of the repository that ships the skill; nothing is sent from that
  repository itself. Extends `exp-1c7a` and serves `exp-1c02` (nothing
  this repository commits says which other repositories use its skills).
- **Mechanism B** (by-actor §3, E1 to E9). The usage extract is measured
  from transcripts and never copied from a seat's report; it is keyed by
  the model id the transcript records; the limit is not reconstructed.
  Serves `exp-178d` (a run affordable to leave running: judgment bought
  where it is needed) and `exp-3e3b` (whether the stream is falling or
  rising, per topic and per seat, so that a change of model or effort can
  be read in it).
- **The consult line** (the input document §2, §3). The third kind on the
  intake route; consultations flow and decisions do not; the approval is
  per thread, with a scope. Serves `exp-c53d` (he is not the run's
  operator) and `d4d7` (he is asked only for judgment, and the mechanical
  steps stay off his hands).
- **Decision-1708 stands** (by-actor §7). Nothing here switches a model or
  an effort; E7's profile switch is deferred. No expectation is served by
  restating it.

From the dialogue:

- **Q-1 — a consult's arrival raises a notice and wakes nobody.** The
  intake writes one `attention` request; the human enters the Kikaku.
  Serves `exp-26d5` (he is interrupted only at checkpoints he knows of).
- **Q-2 — the quality counters are the derivable ones.** Nothing new is
  written by any seat for them. Serves `exp-3e3b`.
- **Q-3 — the `plans` table is the human's, and the skill ships one
  interval sum.** No expectation; it is E9's instrument.
- **Q-4 — two measurements, and Kanri sends.** One before the kessai for
  the cost line, one after the landing; shoki's contract is unchanged.
  Serves `exp-178d`.
- **D-1 — the consult's identity check.** The two repositories' effective
  `user.email` are compared; a difference stops the consult. Serves
  `exp-1c02`.
- **Q-7 — the workspace id is a salted hash of the root commit.** Serves
  `exp-1c02`, and the human's words of 2026-10-06:
  「repo名を直接残したくないけど、一貫性 (このcost結果とあのcost結果は時期が違うけど同じrepo) は確保したい」.
- **Q-8 — the cross-repository usage record is tracked, one row per
  close, with the quality counters in the row.** Serves `exp-3e3b`; the
  human's words:
  「長期（といっても数ヶ月単位）の統計はコスト最適化の戦略策定で見たくなると思うんだよなあ」.
- **Q-5, Q-6, Q-9, Q-10 — the four design sections**, approved as put,
  Q-9, the measurement, "for now" in the human's word.
- **Q-11 — the by-finder count stays out of the measurement.**
  Decision-62dd keeps that script out of the close until two or three
  closes have run it by hand, and it stands. No expectation.
- **Q-12 — what travels and what is tracked carries no instant.** A
  date and durations only; instants stay in the local file. Serves
  `exp-1c02`.
- **Q-14 — the tracked record is JSON Lines, and CSV is an export.**
  Decided at the review, on the brief's one open point: `report --csv`
  writes four flat tables on demand, untracked. Serves `exp-3e3b`.

## Measured while designing

Read from the tree and from one Jisso session's transcript with its
`subagents/` directory, by two surveys kept beside the dialogue
(`survey-scripts.md`, `survey-contract.md`); only key names, types, and
counts were printed from the transcript.

- **One API response is several records.** 422 `assistant` records carried
  173 distinct `message.id`; the records of one id carry byte-identical
  `usage` objects and successive `apiBlockIndex` values. Summed per record,
  `output_tokens` came to 766517; counted once per `message.id`, 236756 —
  3.2 times. `reading.js --share` sums per record and so overweights a
  response of several blocks.
- **`message.usage` carries** `input_tokens`,
  `cache_creation_input_tokens`, `cache_read_input_tokens`,
  `output_tokens`, and a `cache_creation` object splitting the creation
  count into `ephemeral_5m_input_tokens` and `ephemeral_1h_input_tokens`.
  `message.model` is on every `assistant` record, in a seat's transcript
  and in a subagent's.
- **A wake-up's source is recorded.** `user` records carry
  `origin.kind`: `human` (1), `peer` (32), `task-notification` (15), and
  no `origin` on tool results and local prompts.
- **A dispatch is joinable to its transcript.**
  `<sessionId>/subagents/agent-<id>.meta.json` holds `agentType`,
  `description`, `toolUseId`, `spawnDepth`, and `model` — a family alias,
  not a model id; `toolUseId` matched the parent's `Agent` `tool_use` block
  in 28 of 28. A resume of an agent appears in the parent as a
  `toolUseResult` with `resumedAgentId`.
- **Fix rounds are not machine-readable** in the SDD ledger, whose event
  lines are prose; "defects carried to the fix wave" exists only inside a
  Verdict cell; no trigger field records a Kaiseki. The Batches table's
  Batch, Tasks, and State cells are regular.
- **A topic's seats are enumerable** from the spawner's result files,
  whose spawn results carry role, topic, `sessionId`, model, effort, and
  `startedAt`.
- **The intake is keyed on the literal `bug-report:`** at every site
  (`roles/hosa.md`, K "Bug intake", S "Messages"), and no rule says what an
  intake does with another line.
- **Shoki sends one line**, to Kanri, and its brief forbids a tracked write
  outside its worktree; untracked writes into the main checkout's
  `.tanto/` already happen (the Triage fill, `shoroku-review.md`).
- **The skill directory's real path** resolves, on the machine this was
  written on, into this repository's `skills/tanto`.
- **`boundary.js seat` takes `--root <dir>`**, so a seat of another
  workspace can be looked up from outside it.
- **This repository's `.tanto/`** holds 120 inbox copies, all triaged, one
  sent file, and four recommendation and direction pairs.
- **`.yamllint` caps a line at 120**, so one-row-per-line YAML cannot hold
  a usage row; `docs/notes/AGENTS.md` allows `docs/notes/<slug>.<ext>` and
  a Markdown sibling of the same stem.

## 1. The axis, and the `feedback` destination

A record a run leaves has one of three places, decided by who acts on it.

| Class | Who acts on it | Where it lives | Route |
| --- | --- | --- | --- |
| repository-only | the repository's next Sekkei, Keikaku, or operator | the repository's `docs/` | shoroku, as today |
| both | the repository's next Keikaku, and a rule of the skill | the repository, in its own words; the skill, as one paraphrased line | one item, two destinations |
| tanto-only | the skill's built-in defaults, a role file, a template, the recommender | not in the repository's `docs/` | the feedback file |

**1.1 The recommender's rule.** K's recommend dispatch (step 2) gains one
destination and one rule. An item whose citing document would be a tanto
role file, a tanto template, `SKILL.md`, a tanto script, or
`templates/tanto.json` has the destination `feedback`. An item the
repository's own documents will also cite — the repository can say it in
its own words and one of its documents will cite it — has the compound
destination `<docs destination>; feedback`. When in doubt the recommender
sends: an item wrongly kept fails silently, and an item wrongly sent is
caught at the receiving close and returned as `redirect`.

**1.2 The line that travels.** For every item whose destination carries
`feedback`, the recommendation holds one more line under the item's
heading, `Feedback: <one line>`: the item paraphrased in tanto's terms — a
role, a kind, a template, a step — under the anonymity rule of 2.3. That
line, and nothing else of the item, travels.

**1.3 The brief.** `templates/shoroku-brief.md`'s item line gains one
optional clause, before `See:`, on an item whose destination carries
`feedback`:

```text
<n>. [adopt] <destination> — <the item in one sentence> — <the one-line reason> — Feedback: <the line that travels> — See: <the item's heading text, without its ### marker>
```

The human sees the split and the travelling line before anything is
written, and answers by exception as for any item; "How to answer" gains
one example, taking the feedback half off an item (`3 は feedback なし`).
The direction file records, for every such item, whether its feedback half
was kept. Kanri's form check is unchanged: it tests headings and `See:`.
The clause sits last before `See:`; on an `[unsure]` item it follows the
unsettled question. Only an `[adopt]` or an `[unsure]` item carries it: a
`[reject]` item sends nothing, and a `[fix]` item's paths are the
repository's own. The kessai message's answer line, which today offers
"the item numbers that go the other way", is reworded to take an item
changed in part; its four counts are by group, as today, an item with a
feedback half counted once, in the group it is recommended in.

**1.4 The skill's own repository.** Where the repository that closes is the
one that ships the skill, there is no `feedback` destination: such an item
is an ordinary `S-n` item with a `docs/` destination or a `fix`. Kanri
learns which case holds from `usage.js id` (6.3) and says so in the
dispatch. Where that command prints `skill repository: none`, the
destination applies as anywhere else, and the file is kept (2.7).

**1.5 The ledger.** The `S-n` table's Destination vocabulary gains
`feedback` and the compound form. The Written column gains one value a
filter can read, `feedback <basename>`, for an item whose only destination
is `feedback`: Kanri writes it once `close` has placed the file, whether
or not a line could be sent, since delivery is 2.8's concern; the cell
stays `no` while the file is held (2.6). A compound item's Written is its
commit subject, as today.

**1.6 The shoroku skill is not edited.** The destination is defined where
the inbox destinations already are: in K's dispatch text and the brief's
template. The skill's recommend mode already takes caller-named
destinations — `fix`'s paths, the inbox's six words.

## 2. The feedback file, and the close's sequence

One file and one line per close. The file is written in two hands and sent
by a third, because the measurement it carries cannot be finished before
the scribe is.

**2.1 The template.** `templates/shoroku-feedback.md`, new:

```markdown
# Shoroku feedback — <workspace id> <YYYY-MM-DD>

- Workspace — <workspace id>
- Closed — <YYYY-MM-DD>

## Items

<n>. <the line that travels> — Class: tanto-only | both

## Departures

<n>. <override | retyped | unsure-resolved | rejected-as-recommended> — recommended <type, and adopt or reject> — directed <type, and adopt or reject> — <the reason, paraphrased> — rule: <the rule it suggests, or none yet>

## Usage

<one fenced json block: the usage extract of 4.6>

## Received

## Triage

- Outcome — <feedback>
- Items — <n>: <issue | fix | redirect | kaiseki | relay | dismissed> — <reference>
- Date — <YYYY-MM-DD>
```

A section with nothing in it carries the single line `none`. The lead
paragraph of the template states the anonymity rule and says which hand
fills which section.

**2.2 The four classes of departure**, each read from one close's
recommendation and direction and from nothing else: an override (a
recommended adopt directed to reject, or the reverse); a re-typing or
re-destination; an unsure item and how the human resolved it; an item
rejected as recommended, with the paraphrased reason. A type is one of the
six `docs/` type words, `fix`, or `feedback` — never a document's id,
title, or path.

**2.3 The anonymity rule.** Nothing in a feedback file names the
repository, its path, its topics, or its sessions, and nothing quotes the
human, an item's source text, or the repository's documents. The workspace
is named by its id (section 6). The file's name follows the same rule:
`<YYYY-MM-DD>-feedback-<workspace id>.md`, with `-2`, `-3` before `.md`
for a further file of the same day.

**2.4 Shoki writes the first two sections.** `templates/shoki-brief.md`
gains one argument, `Feedback — <.tanto/<topic>/shoroku-feedback.md>`, an
absolute path in the main checkout — or `none`, at an inbox sweep (3.6) —
and step 2's `shoroku.apply` dispatch
gains one output: the file at that path, from the template, with Items —
the `Feedback:` line of every item the direction kept the feedback half
of, copied from the recommendation and never paraphrased again — and
Departures, written under 2.2 and 2.3. Usage, Received, and Triage are left
as the template has them. The file is untracked; shoki's three conditions
and its report line are unchanged, and "What you never do" names the file
beside the inbox copies as an untracked file shoki writes in the main
checkout. The brief gains a third argument,
`Skill directory — <absolute path>`, which its report text and 3.5's
command already assume. In the skill's own repository Items is `none` and
Departures is written all the same.

**2.5 The sequence at a close.**

1. *Before the kessai.* Kanri runs
   `node "$TANTO/scripts/usage.js" measure --topic <topic>` and prints its
   one line in the kessai message, between the `kessai:` line and the
   `merge:` line (5.4). A measurement that fails prints
   `cost: unavailable — <reason>` there and holds nothing up.
2. *Shusei, the merge, shoki* — as today, with 2.4. K's plan-close row,
   which fires at the merge and ends in the handover, loses its
   `reading.js --share` step and gains nothing in its place.
3. *At the landing*, as its last act — after shoki's `shoroku ready:`
   line, the landing checks, and the fast-forward (K "Shusei, shoki, and
   the landing") — whichever Kanri lands runs
   `node "$TANTO/scripts/usage.js" close --topic <topic>`. The command
   measures again, final; writes `.tanto/<topic>/usage.json`; assembles the
   feedback file from shoki's and the usage extract; checks it (2.6);
   resolves the skill's repository (6.3); and prints:

   ```text
   usage: .tanto/<topic>/usage.json — <the cost line, final>
   feedback: <absolute path of the assembled file>
   to: <the skill repository's workspace root>
   send: shoroku-feedback: <absolute path>
   ```

4. Kanri sends each `send:` line to the intake of the workspace the `to:`
   line names, read as K's "Reporting from the other side" reads a bug
   report's — the `live`, listed Hosa row, else the first data row, checked
   against `ListAgents` — with the `no-role` line second; writes
   `feedback <basename>` into the Written cell of each feedback-only row
   (1.5); and fills the Measurements usage row from the `usage:` line
   (section 9). Two things differ from a bug report's send: it is Kanri's
   own act, not one the human asks for; and where the target's roster is
   absent or no listed row remains, Kanri asks the human nothing and sends
   nothing (2.8).

The close's handover does not wait for shoki, so the landing is
ordinarily a successor's: the handover file's In flight block, which
already names a landing still ahead, names `usage.js close` with it, and
a held file (2.6) when there is one. A topic the human ends before its
final batch gets its close as today, and with it `measure` and `close`,
unchanged.

When shoki's file is absent, or lacks its `## Items` or its
`## Departures` heading — a brief rendered before the template changed, a
shoki that reported `shoroku blocked:` — `close` assembles the file with
`none` in both sections, prints one more line,
`feedback: shoki's part absent — <path>`, and goes on. When the final
measurement itself fails, `close` prints `usage: unavailable — <reason>`
in the `usage:` line's place, writes no `usage.json`, and still assembles
and places the file, its Usage block the one object
`{ "measured": false, "reason": "<reason>" }`; `collect` appends no row
for a block that has no `seats`.

**2.6 The mechanical check.** Before a file is placed under
`.tanto/sent/`, `close` searches it for what would name the workspace:
two needle classes, over two scopes.

- *Anywhere in the file*: the workspace root's absolute path in either
  slash form, the harness's project slug, the home directory's path, and
  every seat name, `sessionId`, and eight-digit short id the spawner's
  files hold for the repository; and, in the Usage block, any ISO instant
  (4.6).
- *In the bodies of Items and Departures only*: the root's basename and
  the topic slug, as whole words. The template's own lines and the Usage
  block are not searched for these two, so that a repository or a topic
  named after a word of the skill's own vocabulary does not hold every
  file.

On a hit nothing is placed or printed for sending: the command prints
`feedback: held — <n> lines name this workspace` with the lines, leaves
the assembled text at `.tanto/<topic>/shoroku-feedback-held.md`, and exits
1. Kanri writes one Events line and one line in the ledger's Open
questions. The human has two remedies, and Kanri runs `close` again after
either, the command being idempotent: he edits
`.tanto/<topic>/shoroku-feedback.md`; or, having read the held lines, he
says they may go, and Kanri runs `close --topic <topic> --release`, which
places the file as it stands. `--release` is run on the human's word
alone. The check does not run for 2.7's own-repository placement, where
nothing leaves.

**2.7 Where the file is placed.** By what 6.3 resolves:

- *Another repository ships the skill, and it has a `.tanto/`*: the file
  goes to `.tanto/sent/`, and the `to:` and `send:` lines are printed.
- *This repository ships the skill*: the file goes straight to
  `.tanto/inbox/`, its Received line `- this repository's own close,
  <YYYY-MM-DD>` and its Triage filled — Outcome `feedback`, Items `none` —
  and the command prints `feedback: own repository — <inbox path>`;
  nothing is sent.
- *No skill repository on this machine, or one with no `.tanto/`*: the file
  goes to `.tanto/sent/` and the command prints
  `feedback: kept — <reason> — <path>`; nothing is sent.

**2.8 A file that did not arrive is offered again.** `close` prints one
more `send:` line for every feedback file under `.tanto/sent/` whose
basename is not under the target's `.tanto/inbox/`. Delivery is the
existence of the copy; no state is kept, and no line asks the human for
anything. An intake that cannot be reached — no roster, or no listed row —
gets nothing, and the file is offered at the next close.

**2.9 Outside a close.** A Hosa, as a chore the human hands it, may send a
feedback file for a topic already closed, and the file takes the same
path as a close's, so that 2.6's check and 2.7's placement are one code:
the Hosa writes `.tanto/<topic>/shoroku-feedback.md` from the template —
Items from what the human tells it, paraphrased under 2.3; Departures
`none`, since the close is not a Hosa's to read — and runs
`usage.js close --topic <topic>`, with `--transcripts` where the spawner
kept no results for the topic. Where the topic's transcripts are gone, it
writes the figures the repository kept into the file's Usage block
itself, with `"measured": false`, and runs `close --keep-usage`, which
measures nothing and takes the block as it stands. It then sends the
`send:` line as it sends a bug report today. This is the form the
by-actor file's interim needs; the chore itself is no task of this plan.

## 3. The receiving side

**3.1 The intake** treats the line as section 7 says: one copy, one
Received line, `received:`, nothing read.

**3.2 The close reads it.** A feedback copy is untriaged while its Triage
Outcome is not `feedback`. At the next close or inbox sweep the recommend
dispatch takes each untriaged feedback copy by path, and each line under
its `## Items` is one item of the recommendation, its heading's pointer
`(inbox <YYYY-MM-DD>-feedback-<workspace id> #<n>)`, its destination one of
the inbox's six — `issue`, `fix — <file>`, `redirect — <where it belongs>`,
`kaiseki — <one line>`, `relay — <topic>`, `dismissed — <one line>`. The
apply fills the copy's Triage: Outcome `feedback`, one Items line per item,
the date. A copy whose Items is `none` is triaged by the apply the same
way, with no Items line. `templates/shoki-brief.md`'s step 1, which reads
every `inbox <YYYY-MM-DD>-<slug>` token of the recommendation's headings,
takes the token with or without a trailing ` #<n>`; the copy is the one
the token names without the number, read once however many headings name
it. Step 2's sentence on the Triage fill names the feedback copy's shape.

**3.3 The tracked-write rule gains the item number.** A tracked file names
such an item's source as `inbox <YYYY-MM-DD>-feedback-<workspace id> #<n>`
and nothing more.

**3.4 Departures stay in the copies.** The Departures section is no item
and is recommended on by nobody. Inbox copies are never deleted, so the
copies are the raw record; the repository's Kikaku reads them — one
`sections` call per copy — when the human sits down to distill rules, and
what that produces is a Kikaku decision file. Nothing is distilled
automatically, and no tracked list of departures is kept: no document
would cite a raw row.

**3.5 Usage is collected into a tracked file.** The skill's repository
keeps `docs/notes/tanto-usage.jsonl`: one line per close, the usage
extract of 4.6 with one added field, `"source"`, the feedback file's
basename without `.md`. `templates/shoki-brief.md` gains a second
argument, `Usage record — <absolute path in the worktree, or none>`, set
only in the repository that ships the skill; when it is set, shoki's step
2 runs, after the apply and before the lint and the commit,

```bash
node "<skill dir>/scripts/usage.js" collect --into <the path> --inbox <main checkout>/.tanto/inbox
```

which appends a row for every feedback copy in the inbox whose `source` is
not already in the file, creating the file when it is absent, and prints
`collected: <n> rows, <m> already present`. The file rides in the
`docs: shoroku for <topic>` commit; it is under `docs/notes/`, so shoki's
first condition holds. Step 3's review is told that the file is
`collect`'s and is not reviewed, and K's landing checks, which lint and
verify the paths the direction names, take the file beside them. The
skill repository's own close reaches the file
one close late, since its final measurement is taken after its shoki has
reported.

JSON Lines is chosen under `docs/notes/AGENTS.md`'s "format fits the
concern": a row is one append, a merge never rewrites a line, and no
parser is needed. A YAML or TOML note would need either rows longer than
`.yamllint` allows or a hand-written parser. CSV as the tracked form was
weighed at the review and set aside (Q-14): a row is nested, so it would
be four files for one concern, a new field would be a column old rows
lack, and `collect` and `report` would each grow; a spreadsheet's or a
dataframe's need for flat tables is met by an export instead (4.7). The
note's scope, which a
`.jsonl` file cannot state in a comment, is stated in a Markdown sibling,
`docs/notes/tanto-usage.md`, written by this topic's close (the last
section's item 6).

**3.6 A between-plans inbox sweep** has no topic, so it measures nothing
and writes no feedback file: `measure` and `close` are not run, its shoki
brief's Feedback argument is `none`, and its kessai carries no cost line.
It reads feedback copies as 3.2 says and, in the skill's repository, runs
`collect` as 3.5 says. A sweep's own departures are not recorded.

## 4. The measurement — `scripts/usage.js`

A new script beside `reading.js`, Node with no dependencies, never invoked
bare. It reuses nothing of `reading.js` by import that would bind it to
that file's passages; it exports its pure functions for its tests.

**4.1 The six forms.**

```text
usage.js measure --topic <topic> [--final] [--transcripts <path>...]
usage.js close   --topic <topic> [--release] [--keep-usage] [--transcripts <path>...]
usage.js report  [--json] [--csv <dir>]
usage.js between <from> <to>
usage.js collect --into <path> --inbox <dir>
usage.js id
```

Every form takes `--root <dir>` (the workspace root, else the cwd), and,
for the tests, `--config`, `--project-config`, `--config-dir`,
`--skill-dir`, and `--now`.

**4.2 Which sessions a topic's measurement covers.** The seat list is the
union of the spawn results under `.tanto/spawner/results/` and
`.tanto/<topic>/spawner-results/` and the entries of
`.tanto/spawner/seats.json`, by `sessionId`:

- every seat whose topic is `<topic>` — Sekkei, Keikaku, every Jisso,
  queued ones that never ran included, an attached Kaiseki, and shoki —
  whole;
- every seat whose role is `kanri`, over the topic's **window** only: from
  the earliest start among the topic's own seats to the moment of
  measuring. A Kanri resident across two topics is counted in both over
  the stretch their windows share, and the file says which seats are
  windowed.

Kikaku, Hosa, a standalone Kaiseki, and the messenger belong to no topic
and are in no topic's measurement; `between` counts them. A transcript is
found by the result's path, else by searching every slug under
`<config dir>/projects/` for `<sessionId>.jsonl`; one that cannot be read
is named in the file's `skipped` list and fails nothing. With
`--transcripts` the list is the paths given, each seat's role read from
the spawner's files when its `sessionId` is there and `unknown` otherwise
— the form for a topic closed before the spawner kept results.

**4.3 What is counted, and how.** A response is counted once: records
sharing a `message.id` are one response, and its `usage` is taken once.
Five token classes: `input`, `cache_write_5m`, `cache_write_1h`,
`cache_read`, `output` — the creation count split by the `cache_creation`
object, and counted whole as `cache_write_5m` where a record has no such
object. The by-actor file names four counts; the split is the transcript's
own, and the two halves are priced differently. The key is the recorded
`message.model`, whatever it is.

Per seat: role; effort, the last recorded; the five classes per model id;
wake-ups by source — `human`, `peer`, `task` (a `task-notification`),
`other` — under `reading.js`'s definition of a wake-up; the cold and warm
counts, by `reading.js`'s rule applied to every wake-up whose gap is
between 5 and 60 minutes; context at the first and the last response and
its maximum; compactions; the first and the last timestamp.

Per dispatch, from each `subagents/agent-<id>.jsonl` and its
`.meta.json`: the kind — `tanto-<object>-<act>` read back as
`<object>.<act>` when that is one of the fifteen kinds, the `agentType` as
it stands otherwise; the five classes per model id; tool uses, the count
of `tool_use` blocks; wall time, from its first to its last record;
resumes, the parent's `toolUseResult` records naming it as
`resumedAgentId`; and the seat that dispatched it.

**4.4 The quality counters** (Q-2), per batch and for the topic:

- a Jisso's batch is the `<key>` of the `batch-<key>-report.md` its own
  transcript shows it writing — a `Write` `tool_use` whose `file_path`
  ends so — and `unknown` when it wrote none;
- per batch: the task count, from the Batches table's Tasks cell (`1-4` is
  four, `F1-F7` seven, a comma list its sum, anything else null); the
  `task.implement` dispatches; the resumes of those agents; the
  `task.review-spec` and `task.review-quality` dispatches; the
  `task.escalate` dispatches;
- for the topic: the rework batches, the rows whose Batch cell contains
  `rework-`; the fix wave's task count, the Tasks cell of the row whose
  Batch cell is `fix wave`; and the Kaiseki count, the number of
  `.tanto/<topic>/kaiseki-<n>-brief.md` files.

No task number is joined to a dispatch, and nothing is read from the SDD
ledger. The by-finder count of decision-62dd is not among the counters:
wiring that script into the close waits for the data that decision asks
for (Q-11).

**4.5 `usage.json`.** `.tanto/<topic>/usage.json`, untracked, written
whole. `measure` writes it with `"stage": "kessai"`; `measure --final` and
`close` write `"stage": "final"`; a `measure` without `--final` never
overwrites a final file — it prints its line from the fresh measurement
and the note `usage: final kept`. Its keys are these and no others,
`<counts>` standing for one object of six integers — `responses`,
`input`, `cache_write_5m`, `cache_write_1h`, `cache_read`, `output` — and
`n` for an integer:

```text
{
  "schema": 1,
  "topic": "<topic>",
  "stage": "kessai" | "final",
  "measured_at": "<ISO>",
  "window": { "from": "<ISO>", "to": "<ISO>" },
  "active_hours": <number>,
  "seats": [ {
    "session": "<sessionId>",
    "role": "<role>" | "unknown",
    "windowed": <boolean>,
    "effort": "<level>" | "unknown",
    "models": { "<model id>": <counts> },
    "wakeups": { "human": n, "peer": n, "task": n, "other": n, "cold": n, "warm": n },
    "context": { "first": n, "last": n, "max": n },
    "compactions": n,
    "first": "<ISO>",
    "last": "<ISO>"
  } ],
  "dispatches": [ {
    "session": "<the dispatching seat's sessionId>",
    "agent": "<agent id>",
    "kind": "<kind>" | "<agent type>",
    "models": { "<model id>": <counts> },
    "tool_uses": n,
    "wall_ms": n,
    "resumes": n
  } ],
  "quality": {
    "batches": [ {
      "key": "<key>" | "unknown",
      "tasks": n | null,
      "state": "<the State cell>" | null,
      "implement": n,
      "implement_resumes": n,
      "review_spec": n,
      "review_quality": n,
      "escalate": n
    } ],
    "rework_batches": n,
    "fix_wave_tasks": n | null,
    "kaiseki": n
  },
  "share": { "threshold": n, "over": n, "total": n, "pct": n },
  "totals": {
    "by_model": { "<model id>": <counts, and "amount": <number> | null> },
    "amount": <number>,
    "unit": "<rates.unit>",
    "unpriced": [ "<model id>" ],
    "rates_as_of": "<YYYY-MM-DD>"
  },
  "skipped": [ { "session": "<sessionId>", "reason": "<one line>" } ]
}
```

`windowed` is true for a Kanri seat, which is counted over `window`
alone. `share` is what `--share` printed, over the topic's seat
transcripts and `ceiling.share_threshold`, with a response counted once.
A seat's entry carries its `sessionId`, so that the human can find a
transcript again; that is why the file is local.

**4.6 The extract.** What travels in the feedback file's Usage block, and
what a row of `docs/notes/tanto-usage.jsonl` is. It is built from
`usage.json` and carries no topic, no session, and no instant — a date
and durations only, since an instant can be matched against another
repository's commit times (Q-12):

```text
{
  "schema": 1,
  "workspace": "<workspace id>",
  "closed": "<YYYY-MM-DD>",
  "measured": true,
  "span_hours": <number>,
  "active_hours": <number>,
  "seats": [ {
    "role": "<role>" | "unknown",
    "windowed": <boolean>,
    "effort": "<level>" | "unknown",
    "models": { "<model id>": <counts> },
    "wakeups": { "human": n, "peer": n, "task": n, "other": n, "cold": n, "warm": n },
    "context": { "first": n, "last": n, "max": n },
    "compactions": n,
    "hours": <number>
  } ],
  "dispatches": [ {
    "role": "<the dispatching seat's role>",
    "kind": "<kind>" | "<agent type>",
    "model": "<model id>",
    "n": n,
    "counts": <counts>,
    "tool_uses": n,
    "wall_ms": n,
    "resumes": n
  } ],
  "quality": <as in 4.5>,
  "share": <as in 4.5>,
  "totals": <as in 4.5>
}
```

A seat's entry is `usage.json`'s without `session`, `first`, and `last`,
with `hours` — from its first response to its last — in their place. The
dispatches are summed per dispatching role, kind, and model id, `n` the
number summed. `measured_at` and `window` become `closed` and
`span_hours`. Batch keys — a letter, `fix wave` — stay. The quality
counters are in it whole: a model's cost and what it bought are read in
one row.

**4.7 `report`.** Reads every `.tanto/*/usage.json` of the workspace, and
`docs/notes/tanto-usage.jsonl` where the workspace has one, and prints
Markdown tables: per topic, the active hours and the amount by model id;
per kind, the dispatches, tokens, amount, and mean wall time; per topic,
the quality counters as rates per task; the plans table's hours (5.3);
and, in the skill's repository, the rows grouped by workspace id.
`--json` prints the same as one object. `--csv <dir>` writes, for
statistics in a spreadsheet or a dataframe, four flat tables into a
directory the human names — `closes.csv`, `seats.csv`, `dispatches.csv`,
and `batches.csv`, one row per close, per seat and model id, per
dispatching role, kind, and model id, and per batch, each row carrying
the close's `source` or topic as its key — from the same inputs; the
export is untracked, is written whole at every run, and is never read
back. No tracked report is written from
it. Its readers are the two the by-actor file names: the human, in the
repository's Kikaku, when touching `.claude/tanto.json` or — in the
skill's repository — the built-in defaults; and the next Keikaku, when it
sizes batches. `roles/kikaku.md` and `roles/keikaku.md` each gain one
sentence naming the command and that moment.

**4.8 `between`.** `usage.js between <from> <to>` sums every response
stamped in the interval across every transcript under
`<config dir>/projects/`, subagents included, and prints the five classes
and the amount by model id, the total, and the rates' date. It is the one
instrument of a calibration (5.3) and writes nothing.

## 5. The two tables, the unit, and E9

Two top-level keys join `tanto.json`, overlaid across the three layers
like every other key.

**5.1 `rates`.**

```json
"rates": {
  "as_of": "<YYYY-MM-DD>",
  "source": "<where the figures were read>",
  "unit": "USD",
  "per_mtok": {
    "<model id>": { "input": 0, "cache_write_5m": 0, "cache_write_1h": 0, "cache_read": 0, "output": 0 }
  }
}
```

An amount is the sum, over the five classes, of tokens times the class's
rate, divided by a million. A model id is matched exactly, else by the
longest table key that is a prefix of it; an id that matches nothing is
**unpriced** — reported in tokens, left out of every amount, and named in
`totals.unpriced`, so that a future, local, or third-party model is still
measured (E6). The built-in file ships a table: the plan's task reads the
vendor's published list prices on the day it runs, for the model ids the
built-in families resolve to, and records the date and the page. This
document fixes no figure. A later layer replaces a model's row whole and
sets `as_of`, `source`, or `unit` when it carries them. Every amount the
script prints is followed by the table's date; an amount is a view, and
the tokens are the record (E3).

**5.2 `plans`.**

```json
"plans": [
  { "name": "<the plan's name>", "window": "5h | 7d", "budget": 0, "as_of": "<YYYY-MM-DD>" }
]
```

The human's table: the built-in ships `[]`, and the last layer that sets
the key replaces the list. `budget` is in `rates.unit`, per window,
however the human obtained it. The skill writes this table never (Q-3).

**5.3 E9.** A topic's **pace** is its amount divided by its **active
hours**: the measurement's window is cut into five-minute slots, a slot is
active when any seat or dispatch of the topic has a response stamped in
it, and twelve active slots are an hour — so that a night the run sat idle
does not thin the pace. For each row of `plans`, `report` prints

```text
plan <name> (<window>): about <h> h at <topic>'s pace — an upper bound: the plan is shared with other products (rates <as_of>, budget <as_of>)
```

with `<h>` the budget divided by the pace, for the newest final
measurement and for the mean over the workspace's topics. A calibration is
the human's arithmetic: two readings of the vendor's own usage view, the
`between` sum over the same interval, and a division. The remaining budget
of a window is never reconstructed, and nothing here acts on any of these
numbers (decision-1708).

**5.4 The kessai's cost line.** `measure` prints, and Kanri puts between
the kessai message's `kessai:` line and its `merge:` line, in the human's
language:

```text
cost: <topic> as of the kessai — <model id> <amount>; <model id> <amount>; <model id> unpriced (<n> tokens) — total <amount> <unit> (rates <as_of>)
```

A between-plans inbox sweep's kessai has no topic and carries no cost
line (3.6).

**5.5 The config's prose.** S's "The expected-model config" names the two
keys beside the three maps and `language`, so that neither is reported as
an unknown key, and says what reads them: `usage.js`, and no seat.
`usage.js` warns on `stderr`, in `reading.js`'s form, on a field of either
table it does not know.

## 6. The workspace id

**6.1 What it is.** Seven hexadecimal digits: the head of SHA-256 over a
per-machine salt, a newline, and the repository's **root commit** hash —
the smallest of `git rev-list --max-parents=0 HEAD` when there are
several. Outside git, or with no commit, the input is the harness's
project slug in the commit hash's place. The commit hash itself appears in
no file.

**6.2 The salt.** `<config dir>/tanto-salt`: 32 random bytes in
hexadecimal, written once by `usage.js` when the file is absent, readable
by the owner alone where the platform has file modes. It is a personal
file, beside the personal `tanto.json`, and no script writes it under a
repository. Whoever holds it can guess an id back to a repository, so it
is never committed to a repository that uses or ships the skill; a config
directory the human versions or syncs privately may hold it, and that is
how a second machine gets the same ids. A lost salt changes every id.

**6.3 `usage.js id`** prints two lines:

```text
workspace: <id>
skill repository: this one | <absolute root> | none
```

The second is resolved from the skill directory's real path: the nearest
enclosing directory that holds a `.git` entry is the skill repository's
root; `this one` when that root is the workspace root, `none` when no
directory encloses it — a copied install. Kanri reads it before the
recommend dispatch (1.4), and `close` resolves the same way (2.7).

**6.4 What the id is not.** It is stable across a move or a rename of the
directory and across clones on one machine; a shallow clone, whose root
commit is its graft, gets another. It replaces the 09-18 file's "hash of
the project slug" on the human's word (Q-7).

## 7. The intake's four lines

**7.1 The lines.** An **intake line** is one of `bug-report:`,
`shoroku-feedback:`, `consult:`, and `consult-answer:`, each followed by
one absolute path, each with the `no-role` line second. The intake — a
Hosa whose row is `live` and whose name the listing shows, else Kanri —
answers every one with the one act it has today and reads nothing: the
file copied to `.tanto/inbox/<basename>`, one line appended under the
copy's `## Received` heading, and `received: <inbox path>` sent back, the
envelope's `from` copied into `to`. A burst is answered line by line, as
today.

**7.2 The notice.** For `consult:` and `consult-answer:`, and for those
two alone, the intake adds one command after the copy:

```bash
node "$TANTO/scripts/boundary.js" request attention --message "consult: waiting — tanto kikaku"
```

`request attention`, new beside `request park` and `request leave`, takes
`--message` and `--root` and no `--transcript`, since an `attention`
request names no seat. It checks the beat and writes the request file
`templates/spawn-request.md` describes for the op — the file Kanri writes
by hand today for the kessai and for a human-access grant; the spawner
already serves the op and is not changed, and K's own `attention` sites
are left as they are (Deferred items). It is a request of its own and
leaves a seat's park request as it stands. On `spawner: stale` it writes
nothing, prints the `spawner:` line, and exits 1, and the intake goes on
— the copy is the record, and the Kikaku finds it at its next turn (8.5).
Nobody wakes the Kikaku: Kanri never addresses it first (S, "The
address"), and the human enters it (Q-1).

**7.3 What a file is, and who reads it**, is decided by its first line
and by nothing else — one rule, used by K's untriaged test, by `collect`,
by 2.8's re-offer, and by the Kikaku: a file whose first line begins
`# Consult` is a consult turn; one whose first line begins
`# Shoroku feedback` is a feedback file; every other is a bug report. A
consult copy is read by the repository's Kikaku and is never an input to
a recommend dispatch; every other copy is the close's, as today.
K's "The close reads the inbox" and step 2, and S's "Messages", say so; a
bug report's six Outcome words stand, and `feedback` joins them as the
word that marks a feedback copy triaged (3.2).

**7.4 The sender's side is one rule.** Whoever sends an intake line reads
the target workspace's roster as a bug report's sender does. S's
"Messages" states the route once, for the four lines, and names per line
who may send it: a bug report, any session; a feedback line, Kanri at the
plan close, or a Hosa on a chore (2.9); a consult line, a Kikaku (section
8).

## 8. The consult thread

The pattern: repository A depends on repository B — a library, a
development tool, this skill — and A's Kikaku has a question B must
answer or a change B must decide. Both are the human's own. Today he
carries the two Kikakus' lines between two windows by hand.

**8.1 The file.** `templates/consult.md`, new. A turn of a thread is one
file under its writer's `.tanto/sent/`, named
`<YYYY-MM-DD>-consult-<thread>-<nn>.md` — `<thread>` a kebab-case slug of
one to four words chosen by the Kikaku that opens it, `<nn>` the turn's
two-digit number, running across both sides.

```markdown
# Consult — <thread> <nn> — <the question or the answer in one line>

- Thread — <thread>
- Turn — <nn>, question | answer | closing
- From — <the writer's workspace root, absolute>
- To — <the other workspace's root, absolute>
- State — open | answered | closed

## Scope

> <the human's approval, verbatim — in turn 01; later turns say "as turn 01">

## Read before asking

- <each path of the other repository the writer read first>

## Body

## Received

## Read
```

A question turn travels as `consult: <absolute path>`, an answer or a
closing turn as `consult-answer: <absolute path>`. The thread is the two
`sent/` directories, each side's inbox holding the other's turns; the
human can read either side in either window at any time.

**8.2 The approval** is per thread (the input document §3). The human
approves once, in the sender's window, with the scope in his own words;
the Kikaku writes those words verbatim into turn 01's Scope and sends.
Within the scope, turns go back and forth without a further word from
him. A question outside the scope is a new thread and waits for a new
word. The thread ends when the scope's question is answered, or when the
human says so in either window, where that Kikaku writes a closing turn.

**8.3 Read first.** A question the other repository's `docs/` or code
answers is read by the asking Kikaku itself, by path. A consult goes out
only for what the other repository must decide or change, and its "Read
before asking" names what was read.

**8.4 Where a turn is sent.** The writer reads the other workspace's
`.tanto/roster.md`:

- a `kikaku` row whose Status begins `live`, for whose `sessionId` — its
  Transcript cell's basename —
  `boundary.js seat <sessionId> --root <that workspace>` prints a seat
  line, `<status> <name> <kind> <role> <turn>`, whose first word is
  `running` and whose fourth is `kikaku`: the line goes to the `<name>` in
  it, direct;
- otherwise that workspace's intake, read as a bug report's sender reads
  it;
- no roster, or no listed row: nothing is sent. The Kikaku's closing line
  names the file and the one line the human types in the other
  repository's Kikaku, `consult: <absolute path>`, and a Kikaku takes that
  line from the human as it takes one from a peer;
- a repository without tanto: no route, and the human relays as today.

A Kikaku that receives a line direct does the intake's act itself — the
copy, the Received line `- <from-name>, <YYYY-MM-DD>, direct`, and
`received:` — and no notice is raised. A send that errors, or is answered
`no-role`, is tried once more after the roster is read again — a direct
send falling back to the intake — and after a second failure nothing is
sent, and the closing line names the file and the line to type, as for a
workspace with no roster.

**8.5 Reading a turn.** A consult copy is **unread** while its last
non-empty line is the `## Read` heading, which the template ends with.
At its start, and at the head of every turn the human begins, a Kikaku
lists the unread copies in `.tanto/inbox/` with the one command its role
file carries — a `grep -l '^# Consult'` over `.tanto/inbox/*.md`, filtered
by that last line — so that no copy is read to find out. It names
each in the first line of its reply; it reads it and appends
`- <YYYY-MM-DD>` under `## Read`; and it answers it in that turn, within
the thread's scope, after the human's own subject, unless he says to hold
it. A turn that arrived direct is read and answered in the turn it
started.

**8.6 The identity check** (D-1). Before the first turn it sends in a
thread — the opening question on one side, the first answer on the other —
a Kikaku compares `git -C <root> config user.email` for its own workspace
and the other's. When the two differ it sends nothing and answers
nothing, says so in its window with both values, and stops: there is no
override, and the human relays by hand or uses a bug report. When either
value cannot be read — no git, no value, a failing command — it says so
in one line and goes on. The check is a second guard, not the first: a
third party's repository cloned with no identity of its own carries the
human's global value and passes. So the template's lead says in one
sentence that a consult is for the human's own workspaces, and that a
repository he does not own gets a bug report.

**8.7 Consultations flow; decisions do not.** The other Kikaku's lines are
data, never the human's words. A decision file in either repository
quotes only what the human said in that window, and nothing is decided on
the strength of a consult alone.

**8.8 Anonymity.** The feedback file's rule does not bind a consult: both
workspaces are the human's, and a turn names paths and repositories
freely. The tracked-write rule is untouched on the receiving side: a
tracked file written from a consult names it as
`inbox <YYYY-MM-DD>-consult-<thread>-<nn>` and nothing more.

**8.9 What Kikaku's contract becomes.** `roles/kikaku.md`'s "you never
message Sekkei, Keikaku, Jisso, Kaiseki, or Hosa" stands as a rule about
its own run's seats, and says so: another repository's intake may be a
Hosa, and the line it gets is the intake's. "You send Kanri one line when
something is decided, and nothing else" gains the consult: on the human's
word a Kikaku sends one line and a path to another repository's intake,
or to its listed Kikaku, and answers a consult that reaches it. "No grant
to stay inside" gains the thread's scope, which is one. It reads another
repository by path (8.3); it writes under `.tanto/kikaku/`, a consult's
turns under `.tanto/sent/`, and its Received and Read lines under
`.tanto/inbox/`. At `/tanto taiseki` a turn written and not sent is sent
or named in the closing line, and an open thread stays open: the next
Kikaku continues it from the files. The role file also gains the
sentence of 3.4 — that it reads the Departures sections when the human
distills — and that of 4.7. Rule 1 is untouched — a Kikaku is nobody's
boss, and a consult carries no instruction — and so is S's rule that
Kanri never addresses a Kikaku first; K's opening, "Kikaku is the human's
seat and hears nothing from you", is narrowed by one clause, since as the
intake Kanri answers another repository's Kikaku with `received:`, which
is a reply.

## 9. What the measurement replaces

Removed, because `usage.json` holds it measured:

- **`reading.js --share`**, its `runShare`, and its tests. K's plan-close
  row loses the step — its transcript list, its "while every row still
  carries its Transcript column", and its record in the share row — and
  `usage.js close` runs at the landing instead (2.5), needing no list.
  `ceiling.share_threshold` stays, read by `usage.js`.
- **The Measurements row "the share of usage at context over the
  threshold"**, and the two hand-filled rows beside it: "top-family
  one-shots per plan, counted by kind" and "each role's last reading".
- **The `dispatch: <kind> on <family>` event lines** Kanri writes for the
  one-shots row: in K's batch loop, step 2's dispatch prompt line and the
  prose that feeds it, and step 4's mention among the brief's writes; and
  `templates/boundary-brief.md`'s example argument.
- **The Residency rows appended to the direction file** for a tracked
  report's Measurements table (K "The close", step 2): a cost record
  tracked in the repository that ran is what the by-actor file rejects,
  and the reason it was kept — the archive is untracked and local — is now
  served by the feedback file and the tracked row.

Kept: the five-figure reading every seat appends to its boundary and exit
lines, since a rule acts on `context=`; the Measurements row of Kanri's
context at the opening, the landing, and each boundary; the row of the
peak of top-family sessions and whether a 429 was seen, the one limit
signal a run keeps; the `paused:` rows; the roster's Residency table and
the archive.

Added: one fixed Measurements row, "usage — the file, and the cost line",
filled at the landing from `close`'s `usage:` line. The table's fixed
rows are then three.

The share's definition changes with the instrument: a response is counted
once. Figures recorded before this plan were taken per record and are not
comparable; the 30% target is read again after two closes under the new
definition (Deferred items).

## 10. File by file

All under `skills/tanto/`. The cut into tasks is Keikaku's.

- **`scripts/usage.js`, `scripts/usage.test.js`** — new; sections 4, 5, 6,
  and 2.5 to 2.8.
- **`scripts/boundary.js`, its test** — `request attention --message`
  (7.2); the comment that takes `dispatch:` as its example of a recurring
  event takes another.
- **`scripts/reading.js`, its test** — `--share` goes (section 9); the
  usage string, `runShare`, and the tests of the form.
- **`templates/shoroku-feedback.md`, `templates/consult.md`** — new (2.1,
  8.1).
- **`templates/tanto.json`** — `rates` with its dated table, and
  `plans: []` (section 5).
- **`templates/shoroku-brief.md`** — the `Feedback:` clause and the
  answering example (1.3).
- **`templates/shoki-brief.md`** — the three arguments; step 1's token;
  step 2's feedback file, Triage shape, and `collect` command; step 3's
  exclusion; and "What you never do" (2.4, 3.2, 3.5).
- **`templates/kanri.md`** — the Measurements table's fixed rows and the
  prose under it (section 9); the `S-n` table's Destination and Written
  vocabularies (1.5).
- **`templates/boundary-brief.md`** — the `dispatch:` example argument
  goes (section 9).
- **`templates/roster-archive.md`** — its sentence on running `--share`
  before the move names `usage.js close`.
- **`templates/roster.md`** — its copy of the `S-n` Destination
  vocabulary (1.5).
- **`scripts/spawner.js`** — one comment that names `reading.js --share`;
  no code.
- **`SKILL.md`** — the roles table's Kikaku and Hosa rows; "The
  expected-model config" (5.5); "The transcript reading", which loses the
  second form; "Messages", which states the intake route for four lines
  and the item number of 3.3; "Session exit", steps 2 to 4, for the
  destination, the feedback file, and the measurement; Rule 5's sentence
  on where Kikaku writes; the Artifacts table — rows for
  `.tanto/<topic>/usage.json`, `.tanto/<topic>/shoroku-feedback.md`, the
  feedback and consult files under `sent/` and `inbox/`,
  `docs/notes/tanto-usage.jsonl`, and `<config dir>/tanto-salt`, and the
  inbox and sent rows reworded; the templates' count and list, nineteen;
  the scripts' paragraph, six scripts, with `usage.js`'s forms and
  `boundary.js`'s `request attention`.
- **`roles/kanri.md`** — the opening's clause on Kikaku (8.9); the batch
  loop's steps 2 and 4 (section 9); "The four steps": step 2, the
  recommend dispatch, its destinations and its pointer (1.1, 1.2, 1.4,
  3.2); step 3, the kessai message, its cost line and its answer line,
  the `measure` before it, and the direction's record of a feedback half
  (1.3, 5.4); step 4, the shoki brief's arguments, the `Source:` line's
  item number, the Triage fill, and when a Written cell is filled (1.5,
  2.4, 3.2, 3.3); the sentence on the Written column's values (1.5); "The
  close", step 2 (section 9); "Shusei, shoki, and the landing", for
  `close`, its sends, the landing checks' one more path, and the
  handover's In flight (2.5, 3.5); the inbox sweep (3.6); "Bug intake",
  "The close reads the inbox", and "Reporting from the other side"
  (section 7, 2.5); the plan-close row (section 9).
- **`roles/hosa.md`** — the opening's exception, worded for any intake
  line; the intake's passage, for four lines and the notice; the sender's
  route, stated once in `SKILL.md`; the chore of 2.9.
- **`roles/kikaku.md`** — section 8, with 8.9's list, and the sentences
  of 3.4 and 4.7.
- **`roles/keikaku.md`** — the sentence of 4.7.
- **`README.md`** — the scripts and templates it lists, the two config
  keys, and one paragraph each for the feedback file and the consult.

Not edited: `skills/shoroku/`, `skills/kisou/`, `scripts/` at the
repository root, and everything under `docs/`, which the close's apply
writes.

## 11. Rule 11 and this plan

This plan edits the skill it runs on, so every Jisso is spawned at its
landing with `queue=tanto-feedback`, and the authority for the run's
sessions is the plan's Global Constraints, each seat's prompt keys, and
the batch prompts. The plan's Global Constraints say, in substance:

1. `usage.js`, `boundary.js`'s `request attention`, the two new templates,
   and `templates/tanto.json`'s two keys are read by no session until a
   role file names them, and may land in an early batch.
2. `reading.js`'s `--share` goes in the same batch as the K row that stops
   calling it, and `templates/boundary-brief.md`'s change lands in the same
   batch as `roles/kanri.md`'s (Rule 11's run-time templates).
3. That batch is the safe boundary: no role is started or replaced before
   it, Kanri's own handover excepted.
4. From that batch on, a Kanri whose role text predates it runs, at this
   plan's own close, `usage.js measure --topic tanto-feedback` before the
   kessai, skips the `--share` step its text names, and runs
   `usage.js close --topic tanto-feedback` as the landing's last act, by
   this constraint; and it renders the shoki brief from the template on
   disk, as it does every template.
5. This plan's own close is the first run of the mechanism: its feedback
   file lands in this repository's inbox, and its row reaches
   `docs/notes/tanto-usage.jsonl` at the following close.

## 12. Constraints, costs, and risks

- **Kanri's context.** The close gains two commands and their few lines of
  output, and loses the `--share` step's hand-built transcript list and
  three Measurements rows. The intake's notice is one command more for the
  two consult lines.
- **Transcript retention.** A topic whose transcripts the harness has
  swept can no longer be measured; `measure` names what it skipped. The
  measurement is taken at the close for that reason, and 2.9's
  `"measured": false` is the form for what was lost.
- **The harness's record shapes** — `message.id`, `origin.kind`, the
  `subagents/` directory, `meta.json`'s `agentType`, `toolUseResult`'s
  `resumedAgentId`, the `cache_creation` split — are observed, not
  documented. A field that is absent reads as zero or `other` and is never
  an error, and the tests pin each reading to a synthetic fixture.
- **A Kanri across two topics** is counted in both over the shared
  stretch. The measurement does not split a context by subject.
- **The id is seven digits.** Two repositories colliding in 28 bits is
  accepted for the handful a human runs.
- **The salt is a file to keep.** Section 6.2.
- **Rates go stale.** Every amount carries the table's date, and the
  tokens under it are unaffected.
- **A tracked row reveals activity**, not identity: a date, durations,
  volumes, and a salted id, and no instant (Q-12).
- **The identity check passes a clone with no identity of its own.**
  Section 8.6.
- **`docs/notes/` and JSON Lines.** `docs/notes/AGENTS.md` names Markdown,
  TOML, and YAML; this design adds a `.jsonl` note under its "format fits
  the concern" and its path rule, with a Markdown sibling for the scope.
  The human confirmed that reading at the review (Q-14), against a
  hand-written parser for a restricted TOML and against CSV as the
  tracked form.

## Old values this plan contradicts

Sentences in the touched files that this design makes false. Each needle
below is a fixed string found on one line of every file named after it —
produced by a line-based fixed-string search of the tree at "merge:
run-owned-seats — the run owns its seats", never quoted from reading — and
each is measured at zero over the files named at the boundary that
rewrites its site. Paths are under `skills/tanto/`.

1. `--share` — `SKILL.md`, `roles/kanri.md`, `templates/kanri.md`,
   `templates/roster-archive.md`, `README.md`, `scripts/reading.js`,
   `scripts/spawner.js`; the form, wherever it is named; in
   `scripts/spawner.js`, a comment.
2. `one-shots` — `roles/kanri.md`, `templates/kanri.md`; the row and what
   feeds it.
3. `one-shot lines by kind` — `templates/kanri.md`; the prose under the
   Measurements table.
4. `dispatch: <kind> on <family>` — `roles/kanri.md`,
   `templates/boundary-brief.md`; the event line.
5. `` `dispatch:` events `` — `roles/kanri.md`; the batch loop's step 4.
6. `top-family dispatches since the last boundary` — `roles/kanri.md`; the
   batch loop's step 2, the dispatch prompt.
7. `appended to the direction file for the dogfood report's` —
   `roles/kanri.md`; "The close", step 2; K's other mention of the dogfood
   report, for the hotfix lines, stands.
8. `These five rows are always present` — `templates/kanri.md`.
9. `the third by copying the roster's Residency rows` —
   `templates/kanri.md`.
10. `the fifth at the plan` — `templates/kanri.md`.
11. `Three maps and one scalar` — `SKILL.md`; "The expected-model config".
12. `the one top-level key that is not a map` — `SKILL.md`.
13. `five Node scripts` — `SKILL.md`; "Artifacts".
14. `All five are Node` — `SKILL.md`.
15. `None of the five` — `SKILL.md`.
16. `All five scripts are Node` — `README.md`.
17. `Seventeen of them` — `SKILL.md`.
18. `You send Kanri one line when something is decided` — `roles/kikaku.md`;
    8.9.
19. `else; you never message Sekkei` — `roles/kikaku.md`; the sentence
    stays, reworded as a rule about its own run's seats.
20. `and no grant to stay` — `roles/kikaku.md`.
21. `You write only under` — `roles/kikaku.md`.
22. `` `.tanto/kikaku/` and nowhere else `` — `SKILL.md`; Rule 5.
23. `` `bug-report: <path>` line for this repository is addressed to you ``
    — `roles/hosa.md`.
24. `the inbox for a close, and Kanri learns of it there` — `roles/hosa.md`;
    false for a consult copy.
25. `sent the report and instructs nothing` — `roles/hosa.md`; the opening's
    exception.
26. `` Outcome is none of `issue`, `fix`, `redirect`, `` — `roles/kanri.md`;
    step 2's test of an untriaged copy.
27. `its Outcome none of` — `roles/kanri.md`; "The close reads the inbox".
28. `` On `bug-report: <path>`: copy the file `` — `roles/kanri.md`; "The
    one act".
29. `` `inbox <YYYY-MM-DD>-<slug>` and nothing more `` — `SKILL.md`;
    "Messages", for a feedback copy's item (3.3).
30. `` `inbox <YYYY-MM-DD>-<slug>` token of its headings `` —
    `templates/shoki-brief.md`; step 1.
31. `one of experience, design, decisions,` — `templates/kanri.md`,
    `templates/roster.md`; the `S-n` Destination vocabulary.
32. `` filter can read: `no`, a commit subject, or `superseded: <topic> R-n`
    `` — `roles/kanri.md`, `templates/kanri.md`; the Written column's
    values.
33. `while every row still carries its Transcript column` —
    `roles/kanri.md`; the plan-close row.
34. `Shoki's transcript is not in the list` — `roles/kanri.md`.
35. `Record the share line, the sessions it ran over` — `roles/kanri.md`.
36. `Answer OK, or the item numbers that go the other way` —
    `roles/kanri.md`; the kessai message.
37. `` Kanri, one `decision:` line `` — `SKILL.md`; the roles table.
38. `` `request park` and `request leave`, which a seat runs `` —
    `SKILL.md`; the scripts' paragraph.
39. `a bug report received, under the sender's basename` — `SKILL.md`;
    "Artifacts".
40. `a bug report sent, from` — `SKILL.md`.
41. `request needs park or leave` — `scripts/boundary.js`.
42. `Kikaku is the human's seat and hears` — `roles/kanri.md`; the opening.
43. `readable and is not yours to change; the inbox copies you fill are` —
    `templates/shoki-brief.md`; "What you never do".

## Requirements

Under the experience layer the requirement register is `docs/experience/`,
and this section names the expectations. This design extends `exp-1c7a`
and serves `exp-1c02` and `exp-3e3b` of `exp-09c2`, `exp-178d` and
`exp-c53d` of `exp-06b2`, `exp-26d5` of `exp-57f4`, and the driver `d4d7`,
each named in Fixed inputs with the decision that serves it; it edits
none. Four candidates stand for the close's recommender, to be grouped
`Unsure` and put to the human, each in the register's form with the scene
it would join; all four are `stated`, their sources the human's words:

- `[stated]` SHOULD let him know, after a run, what each seat and each
  kind cost and what it bought, by model, without anyone copying a
  figure. Scene `exp-06b2`. Source:
  「何はなくとも measure は必要なんじゃないかと思うわけ」 (Kikaku,
  2026-10-06). Its neighbor is `exp-3e3b`, which names the issue stream
  alone.
- `[stated]` SHOULD NOT make him carry the text of a consultation he has
  approved between two of his repositories. Scene `exp-09c2`. Source:
  「ぼくの承認のもと、直接やりとりしてくれると助かるなあ」 (Kikaku,
  2026-10-06). Its neighbor is `exp-c53d`.
- `[stated]` SHOULD keep a repository recognizable as the same one across
  closes without its name appearing. Scene `exp-09c2`. Source: the words
  quoted under Q-7 in Fixed inputs. It sharpens `exp-1c02`.
- `[stated]` SHOULD keep usage, and what it bought, long enough — months —
  to be read as a trend. Scene `exp-06b2`. Source: the words quoted under
  Q-8 in Fixed inputs. Its neighbor is `exp-3e3b`.

## The ADRs

Written by the close's apply under `docs/decisions/`. Four, cut by
subject, so that each can be amended alone. Where one says "the rest
stands", that is the amended ADR's remaining decision on its own recorded
reasoning.

### ADR 1 — a record is placed by who acts on it, and each close sends one feedback file

**Decision.** Sections 1 to 3. The recommender's `feedback` destination
and its compound form; the line that travels, shown in the kessai brief;
one file and one line per close, written by shoki's apply and by
`usage.js close`, sent by Kanri; the human's departures from a
recommendation ride in it in four classes; nothing is sent from the
repository that ships the skill; departures stay in the inbox copies and
are distilled by Kikaku, never automatically.

**Amends decision-c322** in three parts: the intake's line was the bug
report's alone, and it is one of four (section 7); a copy that is a
consult turn is the Kikaku's and is decided at no close; and for the two
consult lines the intake's act, which read nothing and did nothing else,
adds one `request attention`. A feedback copy's items take the inbox's
six destinations, and `feedback` is the Outcome word that marks such a
copy triaged. The rest stands: the cheapest listed seat copies and reads
nothing, and every bug report and every feedback item is decided at a
close.

**Rejected.** Classifying by subject — that is how a cost report lands
where nobody cites it. A tracked list of departures — no document cites a
raw row. Shoki as the sender — its contract is one line to Kanri, and the
measurement it would carry cannot include itself (Q-4). A Hosa chore
after the close — a hand of the human's at every close. Sending the
human's words — the paraphrase is the recommender's, shown before it is
written.

### ADR 2 — usage is measured from transcripts, and kept as one tracked row per close

**Decision.** Sections 4, 5, and 9, and 3.5. The measure is taken after
the fact from the transcripts on disk, a response counted once, keyed by
the recorded model id, with the quality counters that can be derived
beside the tokens; it costs no seat any context. The local file is
untracked; the extract travels in the feedback file and is collected into
`docs/notes/tanto-usage.jsonl` in the skill's repository. A dated `rates`
table turns tokens into one comparable amount as a view; a `plans` table
the human keeps gives one derived number, an upper bound. The limit's
remaining budget is never reconstructed, and nothing switches a model or
an effort on any of it: decision-1708 stands whole.

**Supersedes in practice**, with no ADR amended: the `--share` form and
three Measurements rows, and the Residency rows a close appended for a
tracked report.

**Rejected.** Copying figures from seats' reports — two batches of one
measured run had no per-dispatch figure at all. Keeping the
cross-repository record in the inbox copies alone — a trend over months
cannot rest on one untracked directory (Q-8). Calibrating the plans table
automatically — only the human knows what else drew on the plan in the
interval (Q-3). A numeric field in the boundary's verdict — deferred
(Q-2). The by-finder count in the measurement — decision-62dd keeps that
script out of the close until two or three closes have run it by hand,
and it stands (Q-11). Instants in the row — a date and durations serve a
trend, and an instant is a second way to tell a repository (Q-12). CSV
as the tracked form — four files for one concern and columns that drift;
it is an export (Q-14).

### ADR 3 — two Kikakus consult each other over the intake, under a per-thread approval

**Decision.** Sections 7.2 and 8. A consult is a file and one line to the
other repository's intake, or direct to its Kikaku when that is listed;
the approval is the human's, per thread, with a scope in his words;
arrival raises a notice and wakes nobody; an identity check stops a
consult between repositories kept under different identities;
consultations flow and decisions do not.

**Amends no ADR.** Kikaku's messaging contract is in no decision: "You
send Kanri one line when something is decided, and nothing else" is
`roles/kikaku.md`'s, and that Kanri never addresses a Kikaku first is
`SKILL.md`'s; this ADR is the first to record either — the first changed
as 8.9 says, the second kept. Decision-1ab5's "Kikaku is the seat the
human opens to think in" stands whole. The intake's side of a consult is
ADR 1's amendment of decision-c322.

**Rejected.** A relay seat or a synchronous channel — a parked seat is
unreachable and files with an inbox already fit a seat the human paces.
Kanri as the Kikaku's messenger, and the intake waking the Kikaku (Q-1's
third option). One Kikaku reading both repositories as the whole answer —
it covers reading and nothing a repository must decide. One approval per
send — it keeps the human as the relay in all but the copying.

### ADR 4 — a workspace is named by a salted hash of its root commit

**Decision.** Section 6. Seven digits of SHA-256 over a per-machine salt
and the root commit hash; the salt is a personal file, never in a
repository that uses or ships the skill.

**Rejected.** The project slug's hash — it changes when the directory
moves, and whoever knows the path can guess it. The slug's hash with a
salt — unguessable, and still broken by a move. The commit hash bare — a
public value for a published repository.

## What the plan must contain

- The Global Constraints of section 11, in substance.
- `usage.js` and its tests in one task or in consecutive tasks of one
  batch, the script never landing without the tests of what it then does;
  the same for `boundary.js`'s `request attention` and for `reading.js`'s
  removal.
- The `rates` table's figures read from the vendor's published list on
  the day the task runs, the date and the page recorded in the table; no
  figure taken from memory, from this document, or from a model's
  recollection.
- The Old values list, each needle measured at zero over the touched
  files at the boundary that rewrites its site.
- `node --test skills/tanto/scripts/*.test.js` green at every task that
  touches a script.
- One measurement task, run by Jisso in this repository after `usage.js`
  lands: `usage.js measure --topic run-owned-seats`, or the newest closed
  topic whose spawn results are on disk, with the output's seat count
  checked against the ledger's Session events and one seat's `output`
  total checked against a de-duplicated count taken independently. Its
  result is in the batch report; no alternative block hangs on it.
- The README's drift review in the task that edits `SKILL.md`, as the
  repository's `AGENTS.md` asks after a `SKILL.md` edit.
- No task that writes under `docs/`.

## Verification

- **`usage.js`, on synthetic fixtures** in `reading.test.js`'s style, no
  real transcript committed: a response of three records counted once;
  the five classes, with and without the `cache_creation` object; a
  subagent directory summed per kind, with a resume; a Kanri transcript
  cut to the topic's window; an unknown model id reported unpriced and
  left out of the amount; the prefix match of a dated id; wake-ups by
  `origin.kind`; the batch key read from a `Write` block; the Tasks cell's
  four forms; `share` equal to a hand count; active hours over a gap.
- **The id**: the same for one repository at two paths; different under
  two salts; the slug's fallback outside git; the salt file created once
  and never rewritten.
- **`close`**: the three placements of 2.7; the held case of 2.6 for each
  needle class, with nothing placed; the re-offer of 2.8; a second run
  changing nothing but the measurement.
- **`collect`**: a row appended once and not twice; a file created when
  absent; a copy that is no feedback file ignored.
- **`between`**: responses inside and outside the interval.
- **`measure`**: the `cost:` line; `cost: unavailable` on a failure;
  `--transcripts` with a role read as `unknown`; a final file not
  overwritten by a later `measure` without `--final`; the cold and warm
  counts.
- **The topic's quality counters**: rework rows, the fix wave's Tasks
  cell, and the Kaiseki count.
- **The extract**: no `session`, `first`, `last`, `measured_at`, or
  `window` key, and no ISO instant anywhere in it.
- **`report`**: the per-topic and per-kind tables from two `usage.json`
  fixtures, and 5.3's plan line from a `plans` row; `--csv`'s four files,
  their headers, and one row of each checked against the fixture.
- **The two tables' layering**: a later layer replacing one model's row
  whole; `plans` replaced as a list; the warning on an unknown field.
- **`id`**: its second line in each of the three cases.
- **`collect`**: a block that is `none`, and one with `"measured": false`
  and no `seats`, appending no row.
- **`request attention`**: a request file written on a beating spawner;
  nothing written and exit 1 on a stale one.
- **The contract text**: the Old values at zero; the four intake lines
  named at every site that named `bug-report:`; `passage-check.js` as the
  plan's own instrument.
- **By hand, after the landing**: one consult thread between two
  workspaces of the human's, once direct and once through the intake with
  the notice; and this plan's own close as the first feedback file.

## Out of scope

- The migration of another repository's hand-written cost reports — a
  Hosa chore there, on the form 2.9 provides.
- Distilling departures into rules — Kikaku's work, human-paced.
- Any change to `skills/shoroku/` or to kisou's templates.
- The bug report's own route, its template, and its sender (issue-368a).
- A model or effort switch of any kind.

## Issues this design closes

Each term the design retires was grepped once across `docs/issues/open/`
(312 files): "--share" (four issues), "one-shots" (three),
"dispatch: \<kind\>" (one), "top-family one-shots" (one), "dogfood report"
(seven), "Residency rows" (one), "bug-report:" (three), "share row"
(none); and, for the topic's own words, "usage.json", "feedback",
"run-costs", "departure", and "cleanupPeriodDays" (none each).

- **b673** — closes: the row that could not be filled is gone, and the
  count it asked for is `usage.json`'s dispatches by kind and model id.
- **ac65** — closes: which Kanri tenures a topic's measurement covers is
  a lookup — every Kanri seat, over the topic's window (4.2).
- **e525** — closes: the measurement finds a predecessor Kanri by the
  `sessionId` its spawn result holds, and needs no path kept in the
  roster.
- **cdad** — narrowed, not closed: a resident Kanri's tokens are now
  attributed per topic by window, and the stretch two topics share is
  counted in both; a split of one context by subject is still not made.
- **f02c** — narrowed: the tail's share step is one command with no
  transcript list; the census, the archive move, and their carrier,
  `roster-ledger`, stand.
- **9ca6** — narrowed: the archive's missing Transcript column no longer
  costs a measurement; the archive's shape stands as filed.
- **d3f1** — left: its figures are reference data; this design makes such
  figures measurable and carries none of them.
- **368a**, **d2ce**, **9a68**, **40ed** — left: a bug report's sender,
  an intake that reached Kanri beside a live Hosa row, the concurrency
  measurement, and the handover threshold. 40ed's dataset moves: what a
  close appended to a tracked report is in the tracked row's seat entries.

## Answers to the spec inputs

**I-1 — which obligations of each role the passages touch.** Kanri's
answer is `.tanto/tanto-feedback/obligations-draft.md`, a map by role of
the sentences this design's passages touch, built on the draft as first
written. No Hosa, Kikaku, or Keikaku session was live to ask, so the map
is the one check those roles' text had before the review. Kanri's five
notes, in its order:

1. *Where `close` runs.* Taken as advised: the plan-close row fires at
   the merge and ends in the handover, before shoki reports, so `close`
   runs as the landing's last act, and a landing still ahead at a
   handover carries it in In flight (2.5). The row's `--share` step goes
   and nothing replaces it there (section 9).
2. *The sweep, and a topic ended early.* A sweep measures nothing and
   writes no feedback file (3.6); a topic ended before its final batch
   closes as any other (2.5).
3. *The kessai message.* The cost line sits between the `kessai:` and the
   `merge:` lines (5.4), and the answer line is reworded for an item
   changed in part (1.3). The fixed text is in K alone; `SKILL.md` and the
   README restate neither line.
4. *The Written column's rule.* Its sentence, in K and in
   `templates/kanri.md`, is in the Old values list, and the new value is
   `feedback <basename>` (1.5). "Never a compound value" speaks of the
   Written cell and stands; a compound Destination is another column.
5. *The `dispatch:` needle.* The list now carries the three strings the
   lines are written with, and section 9 places them in the batch loop's
   steps 2 and 4.

The map's other rows, by role. *Kanri*: the direction's record of a
feedback half, the pointer and the `Source:` line with `#<n>`, the Triage
fill, the shoki brief's arguments, and when a Written cell is filled are
named in section 10; "Reporting from the other side" differs for the
feedback send in the two ways 2.5 names; the opening's sentence on Kikaku
is narrowed (8.9); the landing checks take the usage record (3.5); the
hotfix lines' sentence on the dogfood report stands, since the direction
still names them. *Hosa*: the opening's exception and the intake passage
are reworded for four lines; a `request attention` is no park request and
no chore, and leaves both rules as they are (7.2); the chore of 2.9 runs
`close`, so that a hand-written file meets the same check. *Kikaku*: 8.9
lists what the role file's contract becomes — the rule about its own
run's seats, the scope as a grant, where it reads and writes, `taiseki`,
and the reader's sentences of 3.4 and 4.7; a direct send that fails falls
back to the intake (8.4). *Keikaku*: the one sentence is an addition;
`report`'s output is a command's and not a document read by sections, and
it supplements the Batches rule. *Shoki's brief*: "What you never do"
gains the feedback file, the arguments are three, step 1 reads a copy
once, step 2 names the Triage shape, and step 3 leaves the usage record
alone (2.4, 3.2, 3.5).

## Deferred items

- A numeric carried-defects field in the boundary's verdict and in
  `boundary.js record` (Q-2).
- The by-finder count in `usage.json` and in the row, with
  `issues-by-finder.js` shipped in the skill: both wait for
  decision-62dd's condition (Q-2, Q-11).
- A backfill of departures from the recommendation and direction pairs
  already on disk.
- Fix rounds joined to a task number.
- E7: a one-word profile switch, never automatic.
- The bug report's target resolved as 6.3 resolves the feedback file's.
- A `feedback.to` override for a skill repository the real path does not
  find.
- The 30% share target, read again after two closes under the
  once-per-response definition.
- A consult to a repository the human does not own.
- Waking a Kikaku on a consult's arrival, should the notice prove too
  slow (Q-1).
- K's hand-written `attention` requests moved to `request attention`.
- A record of an inbox sweep's own departures.

## Shoroku proposal from this spec work

This section excludes the spec's own sections above, the spec review, and
the dialogue, which the close's recommender reads for itself.

1. Measured: one API response is split over several `assistant` records
   with identical `usage`; in one Jisso session, 422 records for 173
   responses, `output_tokens` 766517 per record against 236756 per
   response. Destination: notes (`claude-code-sessions-observed.md`).
2. Measured: `user` records carry `origin.kind` — `human`, `peer`,
   `task-notification`; a subagent's `meta.json` carries a family alias
   and its transcript the model id; `toolUseId` joins a dispatch to its
   transcript; a background dispatch's totals are in the completion
   notice's text, a foreground one's in `toolUseResult`. Destination:
   notes (`claude-code-sessions-observed.md`).
3. Observation: every share figure recorded before this plan was summed
   per record, so it overweights responses of several blocks, and the 30%
   target was set on such figures. Destination: notes
   (`tanto-measured-data-points.md`).
4. Observation: the skill itself told a close to carry Residency rows
   into a tracked report, the class of record the by-actor axis rejects;
   the instruction predates the axis. Destination: design-4807.
5. Observation: the intake had no rule for a line it did not know, and a
   new intake line is added by naming it in one sentence of `SKILL.md`,
   not by a new route. Destination: design-4807.
6. To write: `docs/notes/tanto-usage.md`, the Markdown sibling of
   `docs/notes/tanto-usage.jsonl` — its scope, a row's fields, that
   `usage.js collect` is its only writer and `usage.js report` its
   reader. Destination: notes.
7. Defect noticed: `.yamllint`'s 120-column cap makes YAML unusable for a
   note of one long row per line, and `docs/notes/AGENTS.md` names only
   Markdown, TOML, and YAML as formats. Destination: issues (kisou's
   notes rule, low).
