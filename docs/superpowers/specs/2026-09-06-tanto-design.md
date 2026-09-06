# Design: `tanto` — four-session orchestration for Claude Code

`tanto` (担当, "take charge of") runs one implementation plan through up to
four interactive Claude Code sessions in the same repository: Kanri (管理)
manages, Sekkei (設計) designs, Jisso (実装) implements, Kaiseki (解析)
root-causes. This document is the design the `skills/tanto/` skill is built
from. It formalizes the practice of kuchidome M1 and M2 (2026-09-05 and
2026-09-06), where one Fable session directed one Opus session through
subagent-driven development by `SendMessage`, reading batch reports from the
SDD workspace.

Its input is the tanto handover notes of 2026-09-06, an untracked file at the
repo root that is deleted once this design and its shoroku have landed. The
handover's decided items are fixed inputs here; its open items are resolved
or deferred in "Open items from the handover". This spec restates what it
needs from the handover so that it is self-contained; where it changes a
handover decision, the change is marked **(new)**.

## Fixed inputs

Decided before this spec, not reopened:

- **Names.** Skill `tanto`; roles `kanri`, `sekkei`, `jisso`, `kaiseki`.
  Romaji ids drop long vowels and keep doubled consonants (じっそう → jisso),
  as `shoroku` does. In prose: Kanri, Sekkei, Jisso, Kaiseki, kanji at first
  mention, no honorific suffix.
- **Home.** `skills/tanto/` in dotskills, with `SKILL.md` and the sibling
  `README.md`. `tanto` composes `kisou` (the `docs/` document-management
  system that the write-out fills), superpowers (brainstorming,
  writing-plans, subagent-driven development, systematic-debugging, whose
  `sdd-workspace` script owns `.superpowers/sdd/`), and `shoroku` (the
  write-out); it sits in the same layer and depends on nothing personal. What stays
  personal, the expected-model config and the permission setup, lives
  outside this repo.
- **Kaiseki is a session, not a subagent.** The strong model leads hard
  debugging interactively; a strong-model subagent is what died on a 429 in
  M1. It is on demand, so it costs nothing while no bug is open.
- **The model check warns only** (decision-08bc): the session checks itself
  at `/tanto <role>`, Kanri checks again at the handshake, and nothing
  switches a model.

| Role | Count per repo | Owns | Talks to |
| --- | --- | --- | --- |
| Kanri | exactly 1 | roster, conductor ledger, batch prompts, rulings, shoroku adoption (and the T0 and T1 write-outs), lifecycle requests | human, Sekkei, Jisso, Kaiseki |
| Sekkei | 0 or 1 | spec, plan (with its Batches section), spec and plan review | human, Kanri |
| Jisso | 0 or 1 | the SDD run, batch reports, commits, the T2 shoroku proposal and write-out | Kanri only |
| Kaiseki | 0 or 1, on demand | root-cause reports; never a fix, never a commit | human, Kanri |

Why Kanri and Sekkei are separate: a spec dialogue and batch conducting have
different context shapes, and in one session the dialogue crowds out the
rulings at compaction. Two sessions also pipeline: Sekkei drafts plan n+1
while Kanri runs plan n. The human's three windows: "what to build" is
Sekkei, "how far along" is Kanri, "what is going on" is Kaiseki. Jisso is
watched and never addressed.

## Skill layout

`tanto` is Claude Code only: it needs `ListAgents` and `SendMessage`. Both
`SKILL.md` and the README's prerequisites say so; `kisou`, `shoroku`, and
`wayaku` stay host-agnostic.

```text
skills/tanto/
  SKILL.md                    the shared contract, read by every role
  README.md                   what it does, prerequisites, usage, layout
  roles/kanri.md              Kanri's loop, lifecycle tables, shoroku staging
  roles/sekkei.md             spec, spec review, plan, plan review
  roles/jisso.md              the SDD run under tanto, the report contract
  roles/kaiseki.md            root-cause analysis, standalone mode
  templates/roster.md
  templates/kanri.md          the conductor ledger
  templates/batch-prompt.md
  templates/batch-report.md
  templates/kaiseki-brief.md
  templates/kaiseki-report.md
  templates/tanto.json        built-in defaults for the expected-model config
```

- `SKILL.md` holds only what every role needs: invocation, role
  normalization, the model check and `tanto.json`, `/rename`, the handshake,
  the roster, the message rules, the artifacts table, the rules, and the
  branch "now read `roles/<role>.md`". A session loads one role file, not
  four.
- `roles/<role>.md` holds that role's procedure and nothing another role
  needs.
- `templates/` are copied and filled, never restated in prose. markdownlint
  ignores `skills/**/templates/**` (the kisou precedent), so skeletons carry
  `<...>` blanks; the other pre-commit hooks (trailing whitespace, end of
  file, line endings) still apply. There is no JSON hook.
- Paths inside the skill (`roles/<role>.md`, `templates/<name>`) are
  relative to the skill directory, the base directory Claude Code reports
  when `/tanto` loads. The skill's runtime text never names `skills/tanto/`:
  that is only where dotskills keeps the source, and the skill runs in any
  repo from wherever that repo's Claude Code finds it (a user-level link or
  a project `.claude/skills/`).

Rejected: one `SKILL.md` with four role sections (every session reads three
roles it never plays, and the file passes 400 lines); a single `protocol.md`
with the skeletons inline (skeletons stop being copyable and the file is
linted).

The skill's own wording (`description`, the `SKILL.md` opening, the README)
says **multi-session orchestration**; "four" appears only where the current
role set is listed, so the wording survives a role being added or dropped.
This spec keeps its title.

Repo-root touch points, approved by the human on 2026-09-06: `README.md`
gets one line for `tanto` in its Skills list and one sentence saying
`tanto` is Claude Code only (the README advertises other Agent Skills
hosts, and `copy-project` copies every skill). `CHANGELOG.md` is left to
the release procedure. No other repo-root Markdown is touched.

## Invocation

`/tanto <role> [<kanri-address>]`. Frontmatter: `name: tanto`,
`argument-hint: kanri | sekkei | jisso | kaiseki`, and a `description` with
no colon followed by a space (it silently breaks frontmatter parsing). The
description names the triggers: `/tanto <role>`, and `担当して <role>` /
`tantoして <role>` as the same entry. The role word is accepted in hiragana,
kanji, or romaji (かんり / 管理 / kanri) and normalized to the romaji id; an
unknown role word stops with the four ids listed. Only the skill name must
be ASCII (the Agent Skills spec limits `name` to `[a-z0-9-]`); arguments are
free text.

Kanri runs `/tanto kanri` with no address. Kaiseki outside SDD runs
`/tanto kaiseki` with no address (see "Standalone Kaiseki"). Every other
invocation carries Kanri's address as the human pasted it from Kanri's
lifecycle request.

Starting a role is three fixed steps, in this order:

1. **Model check** against `tanto.json` (next section). On a mismatch: tell
   the human what was expected and what is running, ask for
   `/model <family>` and a re-run of `/tanto`, and stop.
2. **`/rename <role>`** **(new)**. Ask the human to run it in this session
   (the skill cannot rename), wait for their "done", run `ListAgents`, and
   confirm the session's own name is now the role id. If it is not, continue
   with the observed name and say so in the handshake.
3. **Handshake** (section "Handshake and roster"). Kanri skips it and
   instead runs its start sequence.

## Expected-model config: `tanto.json`

### Location and format

`$CLAUDE_CONFIG_DIR/tanto.json`, or `~/.claude/tanto.json` when the variable
is unset. JSON: it sits next to `settings.json` and uses the same family
vocabulary as the Agent tool's `model` parameter (`fable`, `opus`, `sonnet`,
`haiku`). TOML was rejected because nothing else in that directory is TOML.

### Schema

The author's personal file, as an example of every kind of key:

```json
{
  "sessions": {
    "kanri": "fable", "sekkei": "fable", "jisso": "opus", "kaiseki": "fable"
  },
  "subagents": {
    "implementer": "sonnet",
    "reviewer": "opus",
    "drafter": "opus",
    "escalation": "opus",
    "default": "sonnet"
  }
}
```

Two maps, two mechanisms:

- `sessions` is **advisory**: a value matches when it is a substring of the
  session's model id (the system prompt states it). Checked at
  `/tanto <role>` and again by Kanri at the handshake; a mismatch warns and
  refuses the roster row, per decision-08bc. The skill never switches a
  session's model.
- `subagents` is **effective**: the value goes into the `model` parameter of
  every subagent a role dispatches. Keys are task kinds, not roles, because
  kinds recur across roles:
  - `implementer`: SDD's per-task implementer, and the fixer for rounds 1-3.
  - `reviewer`: every review: task, scoped re-review, spec, plan, and
    whole-branch.
  - `drafter`: the plan drafter under Sekkei.
  - `escalation`: SDD's fix rounds 4-5, "a model at least one tier above".
  - a skill name: **(new)** when present, a role that runs that skill
    runs it in a subagent on that model instead of inline; when absent,
    the skill runs inline on the session's model. No skill uses this today:
    `shoroku` is not a candidate, because under `tanto` Jisso runs it
    inline (Jisso's context is the point of the T2 write-out, and its
    `Direction?` is answered by Kanri through a file). Skill-name keys are
    not in the built-in defaults; they are personal additions.
  - `default`: the fallback for any kind not in the map (an ad-hoc Explore,
    a one-off search). A dispatch **never omits `model`**: an omitted model
    inherits the session's, which on a Kanri, Sekkei, or Kaiseki session is
    the strongest family, the exact failure mode of M1.
A per-role override inside `subagents` is not designed; add it when a real
case appears (deferred item 3).

### Built-in defaults and per-key overlay **(new)**

The skill ships `templates/tanto.json` with a value for every fixed key: the
**built-in defaults**, derived from the ladder `SKILL.md` states in one line,
`fable > opus > sonnet > haiku` (as of 2026-09): the top family for Kanri,
Sekkei, and Kaiseki; the second for Jisso, `reviewer`, `drafter`, and
`escalation`; the third for `implementer` and `default`. When a family
ships or retires, the ladder line and the template change together. After the overlay, the role checks that `escalation` sits
above `implementer` on the ladder and says so in its start line if not:
SDD's rounds 4-5 are an escalation only if it does.

Reading the config overlays the personal file on the built-in defaults key
by key, at the granularity `sessions.<role>` / `subagents.<kind>`. A
personal file may be partial (`{"sessions": {"jisso": "sonnet"}}` is
complete); an absent file is the case where every key is a default. The
role says once, at start, which file it read and which keys came from the
defaults, or "no tanto.json at <path>, all keys built-in defaults". This is
information, not a warning (decision-08bc left the choice open).

### Mapping to superpowers' tiers

The superpowers skills name tiers, not families, and say only "always
specify the model explicitly". `roles/jisso.md` and `roles/sekkei.md` pin
the mapping, and every batch prompt restates the concrete families
(compaction insurance, as M2 did with "implementers stay sonnet, reviews
opus"):

| superpowers says | tanto key |
| --- | --- |
| implementer, "cheap" or "standard" model, fix rounds 1-3 | `subagents.implementer` |
| task reviewer, scoped re-review, final whole-branch review "on the most capable available model" | `subagents.reviewer` |
| fix rounds 4-5, "one tier above the implementer that got stuck" | `subagents.escalation` |
| the plan drafter | `subagents.drafter` |
| the spec reviewer, the plan reviewer | `subagents.reviewer` |

One key for every review is a deliberate deviation: SDD scales the review
model to the diff and wants the final whole-branch review on the most
capable model, but no `tanto` subagent runs on the top family (see
"Deviations from the composed skills").

The config binds only sessions started through `/tanto`. A session that
uses superpowers on its own is untouched, and the superpowers skills are not
edited.

### Deployment and the ADR

The personal file is the user's own. How it reaches `$CLAUDE_CONFIG_DIR`
is outside this spec: the skill only reads the file and does not depend on
how it got there. "Do not map any kind to `fable`" is a note in the
personal file, not a rule in the shared skill.

decision-08bc fixed the check and left the file's name and format, the
deployment, and the no-config behavior to this spec. Those, the two maps,
the built-in defaults with the overlay, and the skill-name keys are choices
among real alternatives with lasting consequences, so Kanri records them as
one new standalone ADR at T1. Nothing in decision-08bc is retired, so there
is no `amends` link.

## Handshake and roster

### Kanri's start

`/tanto kanri`, then the model check and the rename. Then Kanri reads
`tanto.json`, makes sure `.superpowers/sdd/.gitignore` holds `*` (the SDD
skill's `sdd-workspace` script writes the same line on every run; Kanri
only runs first), creates `.superpowers/sdd/roster.md` from the template
with its own row if absent, and creates the conductor ledger under
`.superpowers/sdd/<topic>/` once the topic is known. It then waits for
handshakes and for the human.

### The session's side

After the model check and the rename:

1. Sekkei and Jisso: if no address was given, read the first data row of
   `.superpowers/sdd/roster.md` (Kanri's own row) for it. Kaiseki: no
   address means standalone (see "Standalone Kaiseki"); an attached
   Kaiseki always gets the address on the command line.
2. Send Kanri exactly one message:

   ```text
   handshake role=<role> name=<name [ref]> cwd=<path> model=<model id> branch=<branch> mode=<permission mode|unknown>
   ```

   `mode=` **(new)** is what the session can see about its own permission
   mode (`auto` when the system prompt says auto mode is active; otherwise
   `unknown`). Advisory.
3. Jisso waits for Kanri's reply, which carries the plan path and the
   ledger path it cannot start without. Sekkei and Kaiseki start reading:
   the human is in the room, and the reply arrives as a
   `<cross-session-message>`.

### Kanri's side

On a handshake, Kanri:

1. checks `model=` against `sessions.<role>`;
2. checks uniqueness: no live roster row for that role, and exactly one
   `ListAgents` row with that name;
3. writes or rewrites the roster row;
4. replies with the role's standing orders as one line carrying the
   variables, no orders file. Sekkei gets the topic and the spec and plan
   locations. Jisso gets
   `orders: plan=<path> ledger=<path> branch=<b>; read roles/jisso.md in the tanto skill directory`.
   Kaiseki gets the brief path, or "no brief, stop" in a smoke test.

A second handshake for a role with a live row, or a model mismatch, gets no
row and is reported to the human. A Jisso whose `mode=` is not `auto` gets
a one-line warning to the human that a batch may stall on a Bash or commit
prompt; peer messages themselves are not affected (measured: a session in
default mode received peer messages without a click).

Kanri dispatches nothing to a session without an accepted roster row.

### The roster

`.superpowers/sdd/roster.md`, kept by Kanri, Kanri's own row first. Columns:
role, name `[ref]`, cwd, model, branch, mode, started, status. Skeleton in
`templates/roster.md`. `ListAgents` shows name, `[ref]`, kind, and start
time, not the cwd, the model, or the role; the handshake carries those.

Measured 2026-09-06, and what follows for the design:

- `/rename <role>` changes the name `ListAgents` shows; the `[ref]` stays;
  the envelope's `from-name` follows the new name.
- After a rename, the **old** name no longer delivers (`No agent named ...
  is reachable`); the bare new name does.
- So peers address a role by its bare name (`to: "kanri"`, `to: "jisso"`),
  the pasted command in every lifecycle request reads `/tanto <role> kanri`,
  and the roster is a uniqueness check (exactly one live session per role
  name), not an address book. The `[ref]` column stays for the case where a
  rename was skipped and two sessions share a directory-derived name.
- One session per role is now mechanical: two live sessions named `jisso`
  make `SendMessage` error and ask for the ref, which is the refusal the
  handover wanted.

### Permission modes

The skill cannot set a mode and does not try. Measured: a session in
default (prompting) mode and one in auto mode both received peer messages
without a click, so the mode does not gate messaging. The only role that
needs a permissive mode is Jisso, whose batch would stall on per-command
prompts; the `mode=` field catches the obvious case. A permissive setup
is the user's own and is not restated here.

## Messages

- Only Kanri messages Jisso. Sekkei and Kaiseki never do: inbound messages
  queue and drain in order, and a second boss interleaves instructions.
- A message is one line plus a path. Report bodies, rulings, briefs, and
  plans live in files: a message dies with the session, a file survives
  compaction and a VS Code restart.
- Kanri sends every batch prompt and every Kaiseki brief with
  `notify_when_idle: true`. The receiver also sends one line back when its
  report is written. Either signal is enough to proceed.
- Never poll `ListAgents`; never send "are you done". Check the listing only
  when an expected signal did not arrive.
- Replies copy the incoming message's `from` into `to`.
- Permission boundaries are per session. No role asks a peer for work that
  was denied or would be blocked in its own session; blocked work goes to
  the human.

## Artifacts and templates

| Path | Writer | Readers | Content |
| --- | --- | --- | --- |
| `docs/superpowers/specs/<date>-<topic>-design.md` | Sekkei | Kanri, Jisso | the spec; committed |
| `docs/superpowers/plans/<date>-<topic>.md` | Sekkei | Kanri, Jisso | the plan; committed; carries a Batches section, Global Constraints, and the verification method |
| `.superpowers/sdd/roster.md` | Kanri | all roles | one row per role |
| `.superpowers/sdd/<topic>/kanri.md`, then `.superpowers/sdd/<plan-basename>/kanri.md` | Kanri | Sekkei, Jisso, Kaiseki | the conductor ledger |
| `.superpowers/sdd/<topic>/spec-inputs.md` **(new, optional)** | Kanri | Sekkei | scope inputs the human gave Kanri during spec work, numbered `I-n`, each with Kanri's advisory notes |
| `.superpowers/sdd/<plan>/batch-<X>-prompt.md` | Kanri | Jisso, human | the same text as the `SendMessage`; the human can paste it if the message did not arrive |
| `.superpowers/sdd/<plan>/batch-<X>-report.md` | Jisso | Kanri | fixed skeleton |
| `.superpowers/sdd/<plan>/kaiseki-<n>-brief.md` | Kanri | Kaiseki | fixed skeleton |
| `.superpowers/sdd/<plan>/kaiseki-<n>.md` | Kaiseki | Kanri, Jisso | fixed skeleton |
| `.superpowers/sdd/<plan>/shoroku-proposal.md` **(new)** | Jisso | Kanri | the T2 shoroku proposal: the numbered list `shoroku` would print, written to a file instead |
| `.superpowers/sdd/<plan>/shoroku-direction.md` **(new)** | Kanri | Jisso | Kanri's answer to that proposal, item by item: accept, reject, or accept with an edit |
| `.superpowers/sdd/<plan>/progress.md` | Jisso (the SDD skill) | Kanri | the SDD ledger; Kanri reads it and never writes it |
| `.superpowers/sdd/.gitignore` (`*`) | the SDD skill's `sdd-workspace` script, or Kanri at start when it runs first | git | keeps everything above untracked, so nothing is ever staged |
| `$CLAUDE_CONFIG_DIR/tanto.json` | the user | every role at start, Kanri at each handshake | the personal expected-model config |

**Pre-plan ledger location (new).** No `<plan-basename>` exists before the
plan is committed, so the ledger starts under `.superpowers/sdd/<topic>/`
(the topic word Sekkei's spec will use) and Kanri moves it to
`.superpowers/sdd/<plan-basename>/kanri.md` when the plan lands, noting the
move in the roster's Events. Jisso then finds it next to its own
`progress.md`. Only the ledger moves: `spec-inputs.md` and the rest of the
topic directory stay as the spec-phase record, and the moved ledger's Plan
section names the topic directory.

### Templates

Each template is the skeleton copied into the artifact of the same name.
The section lists below are normative; the plan carries the full text.
Their source is the kuchidome M2 SDD workspace of 2026-09-05 (its batch
prompts, batch reports, global constraints, and SDD ledger), outside this
repo and named here only; the plan drafter reads it where it is available
and generalizes, and the section lists are what the templates must satisfy
either way.

- **`roster.md`**: title, the keeping rule (one row per role, one session
  per role, Kanri first, the row rewritten on every handshake), the table
  with the eight columns above, and an Events list.
- **`kanri.md`** (conductor ledger): Progress (one line); Plan (spec path,
  plan path, branch); Batches table (batch, tasks, state, prompt, report,
  verdict); Rulings (`R-n`, each naming the tasks that inherit it); Shoroku
  candidates table (`S-n`: source, candidate, destination, adopted, stage);
  Session events; Open questions for the human; Measurements.
- **`batch-prompt.md`**: title with batch id and task range; a guard line
  naming the workspace it belongs to and telling any other session to reply
  `not me` to `kanri` and stop; previous batch verdict; what changes in
  this batch; setup on resume; rulings to carry into dispatches, including
  the concrete model families from `tanto.json`; the no-worktree line;
  execute tasks N..M and stop; the report sections Kanri reads first.
- **`batch-report.md`**: header (plan, plan commit subject, branch base and
  head, ledger); Tasks table (task, status, commits as sha7 plus subject,
  fix rounds, spec, quality, tests); Rulings (all, in the order made, each
  with what it costs if wrong); Deviations from the plan; Parked and
  deferred minors; Verification; Shoroku candidates; For Kanri; Questions
  for the human; Next. Two renames from M2: "For the conductor (Fable)" is
  now "For Kanri", and the human's question section is "Questions for the
  human" and is the only section written in the human's chat language.
- **`kaiseki-brief.md`**: symptom; exact reproduction command; task number;
  the batch report path; the WIP commit subject; what the fix rounds tried.
- **`kaiseki-report.md`**: Symptom; Reproduction (exact command); Root cause
  with evidence; Why the fix rounds missed it; Minimal fix (patch or
  description); Regression test (what it asserts); **Other defects observed
  (new)**, each tagged `blocks this task: yes | no`; Uncertainties; Tree
  state on exit (WIP commit, `git status` clean); Shoroku candidates.
- **`tanto.json`**: the built-in defaults.

### Workspace policy

All roles share one working tree and one branch. Sekkei creates the branch
from `main` before the spec commit, named after the topic; Jisso continues
on it; the merge decision is the human's. No worktree by default: Kanri
verifies the tree in place and the human can watch it. The SDD skill's
worktree step is overridden by one line in every batch prompt ("no
worktree, Kanri directive, human-approved"), as M2 did. The price:

- Kanri edits no tracked file while a batch runs, and writes under `docs/`
  only while Jisso is idle or absent.
- Sekkei writes only under `docs/superpowers/` and `.superpowers/sdd/`,
  and may write there at any time: no plan task touches those paths, which
  is what lets Sekkei draft plan n+1 while a batch of plan n runs. Sekkei
  **commits** only at a batch boundary, after Kanri has verified the tree
  and said so: the index is shared, and the pre-commit hooks stash
  unstaged changes while they run, which would disturb an implementer
  mid-task. The commit lands on the shared branch and rides with it.
- Kaiseki edits only to instrument and leaves `git status` clean.
- Jisso idles while Kaiseki works on the same tree.

The workspace `.superpowers/sdd/<plan-basename>/` outlives the SDD run:
Jisso never deletes it (a deviation from SDD's Finish step, see
"Deviations from the composed skills"). After T2 and the merge decision,
Kanri asks the human whether to delete it; the T2 write-out is the durable
record, and the roster stays.

A worktree for Kaiseki, so that Jisso can continue, remains Kanri's option
when the environment is cheap to duplicate; the default is idle (deferred
item 2).

## The nine steps

| # | Step | Who | Human |
| --- | --- | --- | --- |
| 1 | Spec | Sekkei with the human, superpowers brainstorming, architectural path | the dialogue |
| 2 | Spec review | Sekkei dispatches a read-only `subagents.reviewer`; checks against `docs/decisions/` and `docs/requirements/`; rules on the findings | scope findings only |
| 3 | Plan | a `subagents.drafter` under Sekkei drafts it with writing-plans; Sekkei adds the Batches section and the Global Constraints | none |
| 4 | Plan review | a `subagents.reviewer` runs the writing-plans checklist; Sekkei checks spec conformance and the batch cuts; lint; commit | one OK before the commit |
| — | Handoff | Kanri cold-reads the committed plan; questions go to Sekkei by message, answered by editing the plan or spec and sending a pointer | none |
| 5 | Development | Jisso runs subagent-driven development batch by batch; Kanri verifies the tree and rules at each boundary | SDD stop classes and scope changes |
| 5a | Hard bug | Kaiseki finds the root cause; Jisso applies the fix | may join the debugging conversation |
| 6 | Development review | per task: `subagents.reviewer` under Jisso; whole branch: a `subagents.reviewer` that **Kanri** dispatches after the last implementation batch, so the executor does not commission its own final review; its findings go to Jisso as the final batch (below) | merge decision |
| 7 | Shoroku candidates | every report in steps 2, 4, 5, 5a, and 6 has a mandatory Shoroku candidates section | none |
| 8 | Shoroku adoption | Kanri, at each batch boundary, in the ledger's `S-n` table; a ruling, escalated only per the adoption rule | the escalated items |
| 9 | Shoroku write-out | staged: T0 and T1 by Kanri; T2 proposed and written by Jisso with Kanri answering `Direction?`, see "Shoroku flow" | the escalated items; the diff at the merge decision |

Two cold reads of the plan, by Kanri and then by Jisso, test that the plan
is self-contained. What Sekkei knew and did not write down is lost by
design.

### The final batch **(new)**

After the last implementation batch is accepted, Kanri dispatches the
whole-branch review (`subagents.reviewer`, superpowers'
requesting-code-review prompt, the review package over the merge base,
pointed at the SDD ledger's parked and deferred-minor lines). Its findings
become one more batch prompt, the final batch: Jisso dispatches one fix
subagent with the complete findings list, runs exactly one scoped
re-review of the fix wave, adjudicates residuals in the SDD ledger, and
reports. There is no second fix wave; residual load-bearing findings reach
the human through Kanri's merge question. Then Kanri sends the T2 prompt
(see "Shoroku flow"), verifies the write-out, and puts the merge decision
to the human.

### Deviations from the composed skills **(new)**

`tanto` composes the superpowers skills and `shoroku` without editing
them. Every mandate it overrides is named here with the reason and the
place the override is restated at runtime; the role files are written from
this table, and Verification item 4 checks the superpowers rows against
the 6.3.0 text.

| superpowers mandate | tanto | Why | Restated in |
| --- | --- | --- | --- |
| SDD Setup: work in a worktree | same tree, shared branch | Kanri verifies in place; the human watches | every batch prompt |
| SDD: continuous execution, stop only for the four classes | stop at each batch boundary and idle | the boundary is Kanri's ruling and lifecycle checkpoint | every batch prompt |
| SDD Finish: delete the workspace when the final review is clean | never; Kanri asks the human after T2 and the merge decision | the workspace holds the conductor ledger, the reports, and the T2 source | `roles/jisso.md` |
| SDD Finish: "Rulings I made" in the final message, then finishing-a-development-branch | rulings go into every batch report's Rulings section; the merge decision is the human's, put by Kanri; Jisso never runs finishing-a-development-branch | Jisso talks to Kanri only; reports are read from files | `roles/jisso.md`, `templates/batch-report.md` |
| SDD Model Selection: tiers scaled per dispatch, the final review on the most capable model | `tanto.json` kinds; one `reviewer` key for every review, never the top family | M1's 429 on a top-family subagent; the personal file sets the tiers | `roles/jisso.md`, every batch prompt |
| SDD fix loop: five rounds, then the breaker | unchanged, plus the Kaiseki trigger at round 2 with an unknown cause | root cause before more fixing | `roles/jisso.md` |
| systematic-debugging Phase 4: write the failing test, implement the fix, verify | Kaiseki stops before Phase 4: the report carries the minimal fix and the regression test as text; Jisso applies both | Kaiseki never commits or fixes; the fix goes through SDD review | `roles/kaiseki.md` |
| `shoroku`: propose in chat, wait for the human's `Direction?`, never start without the human's explicit confirmation | under `tanto` the proposal and the direction are files, Kanri answers `Direction?` as the human's delegate per the adoption rule, and the human's confirmation is the plan's OK plus the escalated items | Jisso cannot talk to the human, and adoption is a Kanri ruling by design | `roles/kanri.md`, `roles/jisso.md`, the T2 prompt |

### What the plan must contain

Beyond the writing-plans conventions: a **Batches** section (batch id,
three or four tasks each, stop conditions); the **Global Constraints** the
batch prompts are built from (the repo's `AGENTS.md` rules and the
`tanto.json` families); and **how a batch is verified**. The report and
prompt skeletons are not in the plan: the plan says "reports and prompts
follow the tanto templates" and names nothing else (M2 carried them inline
in a "Reporting protocol" section; that moves into the skill).

### SDD stop classes, pinned by name

superpowers 6.3.0's subagent-driven-development names four things that stop
an executor, and only these:

1. an irreversible or destructive operation;
2. a security-sensitive action;
3. a side effect outside this worktree that norms say you ask about first
   (a merge, a push to a shared branch, a publish);
4. a plan so broken that every path forward is a guess.

Its implementers report one of four statuses: `DONE`, `DONE_WITH_CONCERNS`,
`NEEDS_CONTEXT`, `BLOCKED`. `roles/jisso.md` quotes the four stop classes
verbatim so that a later superpowers change shows up as drift, and the
report's "Questions for the human" may contain only those four plus a scope
or spec change. Everything else is a ruling: Jisso's own, recorded in the
SDD ledger as the skill prescribes, or Kanri's, on the report's "Rulings
needed" items. Kanri forwards to the human the same set and nothing else.
That makes the escalation rule mechanical.

### Fix rounds and the Kaiseki trigger

The SDD fix loop stays as it is: five rounds per task, rounds 1-3 resume the
implementer, rounds 4-5 dispatch a fresh implementer on
`subagents.escalation`, the breaker adjudicates at five. `tanto` adds one
condition on top:

> When round 2's re-review still leaves a finding open **and Jisso cannot
> name its cause**, or an implementer returns `BLOCKED` with an unknown
> cause at any round, Jisso stops the loop for that task, commits the
> failing state as `wip(task N): failing state for kaiseki`, appends
> `Task N: kaiseki — wip <sha7>, awaiting brief` to the SDD ledger, writes
> the batch report, and goes idle.

A known cause continues the SDD rounds. A clean `git status` is the handoff
invariant, so the failing state is committed rather than left in the tree.
The WIP commit is an ordinary commit inside the task's range: the SDD
completion line still cites `base..head`, the fix and its regression test
land as follow-up commits, and finishing squashes them (an interactive
rebase, or a skill such as `seisho`). Nothing is amended. If the human
declines to create Kaiseki, Kanri rules "continue the SDD rounds": the
loop resumes at round 3 with the resumed implementer, and rounds 4-5 go to
`subagents.escalation`, the M2 fallback.

### Jisso's subagent layer

The built-in Agent tool with the `model` from `tanto.json`; no custom
`.claude/agents` definitions. Prompts are the SDD skill's own templates.
Implementers never dispatch subagents (an SDD rule).

### Kanri's loop, per batch

1. Wait for the idle notice or the one-line report message.
2. Verify the tree before reading the report: `git status` clean, commits
   and trailers as claimed, plan file state, repo-specific leftovers
   (processes, temp directories), a spot check of the claimed tests.
3. Read the report. For each "Rulings needed" item: known cause, rule;
   unknown cause, open the Kaiseki branch; scope, escalate to the human.
   Adopt or reject each shoroku candidate per the adoption rule. Update the
   conductor ledger.
4. Report one line to the human. Ask numbered questions only for the SDD
   stop classes and scope changes.
5. Write the next batch prompt from the template with the rulings the next
   tasks inherit; send it with `notify_when_idle: true`.
6. Check the lifecycle tables: is a create, replace, or delete request due?

## The Kaiseki branch

The branch runs only when the cause of a failure is unknown. A known cause
with a decision to make is a Kanri ruling, not a Kaiseki case. That sentence
is the classification rule.

1. Jisso hits the trigger above, commits the WIP, reports, idles.
2. Kanri classifies. Known cause: ruling, back to Jisso. Unknown: ask the
   human to create Kaiseki; after the handshake, write
   `kaiseki-<n>-brief.md` from the template and send its path with
   `notify_when_idle: true`.
3. Kaiseki runs superpowers systematic-debugging up to the root cause and
   stops before its fix phase (see "Deviations from the composed skills").
   It may use the tree freely: run tests, add temporary instrumentation,
   bisect. It does not commit, does not fix, and leaves `git status` clean
   on exit. The human
   may talk to Kaiseki directly; debugging often needs what only the human
   knows about the environment.
4. Kaiseki writes `kaiseki-<n>.md` from the template and sends Kanri one
   line with the path.
5. Kanri records `R-n: fix per kaiseki-<n>.md` and sends Jisso: resume task
   N, apply the report, add the regression test, fix-round counter back to
   zero. The fix goes through Jisso because the SDD review and the
   regression test live there.
6. **Other defects observed (new).** For each item in that section: `blocks
   this task: yes` goes through the classification rule (known cause, a
   ruling; unknown, `kaiseki-<n+1>-brief.md` to the same Kaiseki, which is
   not deleted yet); `no` goes into the ledger's `S-n` table as an issue
   candidate and reaches `docs/issues/` at T1 or T2. Kaiseki itself never
   writes under `docs/`.
7. When Jisso's fix passes review and tests, Kanri asks the human to delete
   Kaiseki, or keep it if more of the same bug is expected. Not before: a
   fix that misses goes back to the same Kaiseki with its context intact.

Decisions carried from the handover: the escalation ladder is
`subagents.implementer` rounds, then Kaiseki, with `subagents.escalation`
as the fallback when the human declines Kaiseki; Jisso idles while Kaiseki
works; a report that conflicts with the plan or spec is a cold-read question
from Kanri to Sekkei, and a numbered question to the human if the spec
moves; "cannot reproduce" is still a report, and Kanri decides whether Jisso
reruns or the human is asked about the environment; Sekkei pauses while
Kaiseki is active (rule 9).

### Standalone Kaiseki

`/tanto kaiseki` with no address: no roster, no handshake, the same report
skeleton, output under `.superpowers/sdd/kaiseki/kaiseki-<n>.md`. The entry
point for "let the strong model lead this debugging" is not tied to the
batch loop.

## Session lifecycle

The human is the only actor who can create or delete a session. Kanri is
the only role that asks. Every request is a numbered list, one line per
item, carrying the exact command the human will run in the new session,
with Kanri's bare name as the address (`/tanto jisso kanri`).

### Create

| When | Kanri asks the human to | The request line carries |
| --- | --- | --- |
| bootstrap | nothing; the human opens a session and runs `/tanto kanri` | — |
| a plan is committed and Kanri's cold read has no open questions | create Jisso | `/tanto jisso kanri`, the plan path, the branch |
| the first batch of the current plan is accepted, or no plan is in flight | create Sekkei for the next spec, if there is one; the human may decline | `/tanto sekkei kanri`, the topic if known |
| Jisso reports the Kaiseki trigger with an unknown cause | create Kaiseki | `/tanto kaiseki kanri`; the brief follows the handshake |

Kanri dispatches nothing to a session until its handshake is in the roster
and its model matches the config.

### Replace

| Symptom | Action |
| --- | --- |
| Jisso is gone: not in `ListAgents`, `SendMessage` errors, or the idle subscription expired with no report | verify the tree (`git status`, last commit against the SDD ledger, leftovers); ask the human to delete the dead session and create a new Jisso; the next prompt says "resume batch X from task N" |
| Jisso context decay: two consecutive batches needed escalation, or a report says compaction lost rulings | at the batch boundary, ask the human to delete and create |
| **Kanri context decay (new)**: two consecutive batches needed escalation to the human, or Kanri notices it lost rulings at compaction | at the batch boundary, Kanri tells the human and asks to be replaced; the ledger and the roster are the recovery point, and the new Kanri cold-reads both |
| Sekkei is gone before the plan is committed | ask the human to create a new Sekkei; the spec and plan drafts on disk are the recovery point |
| Kaiseki is gone before its report | verify `git status` is clean (revert stray instrumentation if not); ask the human to create a new Kaiseki; the brief and the WIP commit are the recovery point |

Never replace mid-batch on suspicion. Wait for the boundary or confirm the
session is dead first: uncommitted work may be in the tree.

### Delete

| When | Kanri says |
| --- | --- |
| the plan is committed, the cold-read questions are answered, and the human does not want a next spec now | Sekkei is done; delete it, or keep it for the next spec |
| Jisso's fix from the Kaiseki report passed review and tests, and no `blocks this task: yes` item is open | Kaiseki is done; delete it, or keep it if more of the same bug is expected |
| the final batch is accepted, T2 is written, leftovers are clean, and the human has executed the merge decision | Jisso is done; delete it |
| Jisso is deleted and the ledger's progress line says closed | this plan is closed; **(new)** delete Kanri, or keep it for the next plan. A kept Kanri starts the next plan with a new topic directory and a new ledger, keeps the roster, and re-reads both as if fresh |

Kanri's default lifetime is one plan: a plan's reports and rulings fill one
context budget, and a fresh Kanri's cold read of the roster and the ledger
is one more self-containment check. Keeping it is the human's call, made
with the Replace row above in view.

### Recovery after a VS Code restart

All sessions die together. The human recreates Kanri first. Kanri runs
`ListAgents`, marks every roster row that is no longer listed as dead,
verifies the tree if a batch was in flight, and then asks for the missing
roles in this order: Jisso only if a batch is in flight, Kaiseki only if a
bug is open, Sekkei only if a spec or plan is in progress.

## Shoroku flow

Every report has a mandatory Shoroku candidates section (step 7). Kanri
adopts or rejects each candidate at the batch boundary in the ledger's
`S-n` table (step 8). The write-out (step 9) is staged **(new)**,
generalizing what Kanri did on this very plan:

| Stage | When | Who | What |
| --- | --- | --- | --- |
| T0 | before Sekkei is created | Kanri | the decided items of the input document become ADRs, on `main`, before the branch is cut |
| T1 | after the plan commit, before Jisso is created | Kanri | requirements and issues from the spec; the spec's deferred items become issues one to one |
| T2 | after the final batch | Jisso proposes and writes, Kanri directs | design, rulings, and the dogfood report from the conductor ledger and Jisso's own context |

### The adoption rule **(new)**

Adoption is a Kanri ruling at every stage. Kanri escalates to the human,
as one numbered list, only two kinds of item: one that adds to or changes
a requirement or an ADR (what the project must do, and why a choice was
made, stay the human's), and one Kanri cannot classify or is unsure about.
Everything else (design, issues, notes, reports) Kanri decides and records
in the `S-n` table, and the human sees the result in the commit.

### T2 in three steps **(new)**

Jisso holds the context the T2 write-out needs (the SDD ledger's rulings,
parked findings, and deferred minors, plus everything the batch reports
compressed), and Jisso cannot talk to the human. So the `shoroku` run is
split, with its `Direction?` answered by Kanri through a file:

1. **Propose (Jisso).** Kanri sends the T2 prompt. Jisso runs
   `shoroku from <ledger>` (file mode) up to the proposal and writes the
   numbered list to `<workspace>/shoroku-proposal.md` instead of printing
   it, seeded by the `S-n` table's adopted rows and extended from its own
   context; then one line to Kanri.
2. **Direct (Kanri).** Kanri rules on every item per the adoption rule,
   records the rulings in the `S-n` table, asks the human the escalated
   items, and writes the answer, item by item, to
   `<workspace>/shoroku-direction.md`; then one line to Jisso.
3. **Apply (Jisso).** Jisso applies the accepted subset per
   `docs/AGENTS.md` and the per-type files, lints, makes one commit, and
   reports. Kanri verifies the diff and the commit as it does for any
   batch; the human sees the result at the merge decision.

T0 and T1 are the same run collapsed into one session: Kanri proposes to
itself, applies the adoption rule, asks the human the escalated items, and
commits. Rule 5 holds at every stage: at T0 Jisso does not exist, at T1 it
is not yet created, at T2 it is the writer while Kanri stays out of `docs/`.
This changes the handover's step 9 (Jisso runs `shoroku`, the human sees
the diff before the commit) only in who answers `Direction?`; the
deviation from the `shoroku` skill is named in "Deviations from the
composed skills". Kaiseki reports feed the `S-n` table like any other
report.

## Rules

1. One boss: only Kanri messages Jisso.
2. Files between the strong-model sessions: the spec, the plan, the
   conductor ledger, the spec inputs, and the Kaiseki reports are the only
   channel.
3. State in files, not in memory: the roster and the ledgers. Memory holds
   at most a pointer to them.
4. One set of roles per repo. A session is bound to its cwd: CLAUDE.md,
   memory, and permissions all come from it. A Kanri that spans repos gets
   a prompt on every foreign operation.
5. Kanri does not edit tracked files while a batch runs, and writes under
   `docs/` only while Jisso is idle or absent. Sekkei writes only under
   `docs/superpowers/` and `.superpowers/sdd/`, at any time, and commits
   only at a batch boundary Kanri has verified. Kaiseki edits only to
   instrument and leaves the tree clean.
6. Every subagent dispatch names a `model` from `tanto.json`; none omits it.
7. Small batches: three or four tasks. Each boundary is a ruling checkpoint
   and a lifecycle checkpoint.
8. Fix rounds stop at the Kaiseki trigger when the cause is unknown; root
   cause before more fixing.
9. At most two strong-model sessions active at once: Sekkei pauses while
   Kaiseki is active.

## Verification

For a Markdown-only skill, a batch is verified by:

1. `./scripts/lint.{bat,sh}` on the changed paths, every hook `Passed` or
   `Skipped`. There is no JSON hook, so the task that writes
   `templates/tanto.json` also parses it (a one-line `json.load` in Python
   or `ConvertFrom-Json` in PowerShell) and records the result.
2. The `superpowers:writing-skills` checks: the frontmatter parses through
   a real YAML load (no colon-space in `description`), the description
   states the triggers, and the skill reads as instructions an agent can
   follow without this spec.
3. README drift: a task that edits `SKILL.md` reviews `README.md` in the
   same task (the repo's `AGENTS.md` rule).
4. A consistency pass in the last batch: every path `SKILL.md` and
   `roles/*.md` name exists; every template is referenced from the role
   that copies it; the four stop classes quoted in `roles/jisso.md` and the
   mandates in the deviations table match the superpowers 6.3.0 text. The
   grep runs against the plugin cache on the machine that executes the
   plan (the plan names the path as an input); where the cache is absent,
   the check is manual and the version stamp is the record.
5. A handshake smoke test as the last batch's stop condition, run by the
   human: link `tanto` into the user-level skills directory
   (`link-user`), open a new session, run `/tanto kaiseki kanri`. Pass: the
   hand-run Kanri of this plan (`ListAgents` name `kanri`), following
   `roles/kanri.md`, receives the handshake line in the specified form,
   writes the roster row, and replies "no brief, stop". The session is then
   deleted.

Full verification is the dogfood: the next real plan runs under `/tanto`
and its conductor ledger is the record (deferred item 7).

## Out of scope

Changes to the superpowers skills; how the personal `tanto.json` is
deployed; custom `.claude/agents` definitions; a cross-repo progress
view.

## Open items from the handover

| Open item | Resolution |
| --- | --- |
| Does `/rename` change the `ListAgents` name? | Resolved, measured: yes, and the old name stops delivering. "Handshake and roster". |
| Fable sessions active at once | Deferred 1. |
| Same workspace or a worktree | Resolved: same tree, same branch, no worktree by default. "Workspace policy". A Kaiseki worktree is deferred 2. |
| Permission mode per role; inbound messages held for approval | Resolved, measured: neither default nor auto mode holds peer messages; `mode=` in the handshake; the setup itself is personal. "Permission modes". |
| Subagent layer under Jisso | Resolved: the built-in Agent tool with `tanto.json` models, no custom agents. |
| Pin the SDD stop classes by name | Resolved: quoted in `roles/jisso.md`; the human-question set is the four classes plus scope. |
| Fix-round cap and the WIP commit | Resolved: SDD's five rounds stay; the Kaiseki trigger is round 2 plus an unknown cause; the WIP is a normal commit, folded by follow-up commits and squashed at finishing. |
| `tanto.json` format and deployment | Resolved: JSON at `$CLAUDE_CONFIG_DIR/tanto.json`; built-in defaults with a per-key overlay; deployment is the user's own, deferred 5. |
| Plan author | Resolved: `subagents.drafter` under Sekkei; Sekkei adds the Batches section. |
| Cross-repo progress view | Out of scope, deferred 6. |
| Report and prompt skeletons | Resolved: `templates/` in the skill; the plan references them. |

## Deferred items

Each becomes an issue at T1.

1. **Fable concurrency.** Rule 9 is a guess; the rate limit for two or
   three strong-model sessions needs measuring on a real plan. Kanri's
   ledger has the measurement table; Kanri plus Sekkei on 2026-09-06 is the
   first data point (no 429).
2. **Kaiseki in a worktree.** The default is Jisso idle; the environment
   duplication cost is unknown per repo.
3. **Per-role override in `subagents`.** Not until a real case appears.
4. **`mode=` self-report outside auto mode.** Whether a session in another
   mode reports anything better than `unknown`; measure at the first Jisso
   handshake.
5. **`tanto.json` deployment.** How the personal file reaches
   `$CLAUDE_CONFIG_DIR` is the user's own tooling; the skill only reads
   it.
6. **Cross-repo progress view.** Out of scope; if wanted, a reader of the
   per-repo ledgers, never a Kanri that spans repos.
7. **Dogfood.** Full verification is the next real plan under `/tanto`.

## Shoroku candidates from this spec work

For Kanri's `S-n` table:

- decision: a standalone ADR for `tanto.json` (name, format, the two
  maps, built-in defaults with per-key overlay, the no-config line, the
  deployment recommendation), written by Kanri at T1; nothing in
  decision-08bc is amended.
- design: the adoption rule and the split T2 (Jisso proposes and writes,
  Kanri directs through a file, the human gets only requirement and ADR
  items and the unsure ones); the final batch (whole-branch review, one
  fix wave, one re-review) precedes it.
- design or report: the manual bootstrap of this plan deviated from the
  handshake (an orders file plus a pasted line, no `/tanto`); the skill's
  bootstrap row covers the "no skill yet" case only through this record.
- design: the pre-plan ledger location and the move at plan commit.
- report: the three `/rename` measurements (name changes, ref stays,
  `from-name` follows; the old name is unreachable; the bare new name
  delivers).
- report: peer messages arrive without a click in default and auto mode.
- design: `spec-inputs.md` as the Kanri-to-Sekkei relay for human input
  during spec work.
- design: the T0 / T1 / T2 shoroku staging.
- decision or note: the handover's list of superseded names (the skill and
  role names that were considered and dropped, kept so they do not come
  back) has no home once the handover is deleted.
