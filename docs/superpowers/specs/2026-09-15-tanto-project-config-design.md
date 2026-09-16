# Design: tanto-project-config — a project overlay of `tanto.json`, and project-scope agent definitions for a project-level effort

Written by Sekkei `dotskills-24 [5f7c44]` on 2026-09-15 as a **draft** at
`.tanto/tanto-project-config/spec-draft.md` (ledger R-1, R-5: the shared
checkout is another topic's; no branch is cut and nothing is committed until
this topic's Keikaku commits this text unchanged at
`docs/superpowers/specs/2026-09-15-tanto-project-config-design.md`). The
opening scope is item 2 of the Kikaku decision
`.tanto/kikaku/2026-09-14-project-config-before-hardening.md`; the topic
extends issue-6a29 and must answer issue-cae3. The dialogue that produced
this spec is `.tanto/tanto-project-config/dialogue.md`.

The problem is one measured on 2026-09-11 (issue-6a29): `tanto` reads its
expected-model config from one place, the personal
`$CLAUDE_CONFIG_DIR/tanto.json`, so a repository that wants one of its seats
on a different family has to change the check for every repository the
human runs `tanto` in — the workaround was a personal file written before
`/tanto sekkei` and deleted after the handshake. The design question that
bounds the fix is issue-cae3: a kind's effort reaches a subagent only
through an agent definition, and the roles write those at user scope, so a
project overlay could carry a project-specific model but, as things stood,
not a project-specific effort.

This spec adds a third source, `<cwd>/.claude/tanto.json`, overlaid on the
personal file at the same granularity; makes each role render a
project-scope agent definition for exactly the kinds whose effort the
project file changes, which the harness prefers over the user-scope one of
the same name (measured, section "Measured while designing"); and extends
`scripts/reading.js`, which reads the `ceiling` map, to the same third
source. It changes `SKILL.md`'s config section, two lines of
`roles/kanri.md`, the README, `templates/agent.md`, `reading.js` and its
tests, and one subsection of the consistency note. It ships no project file
for this repository.

## Fixed inputs

Each input names the requirement bullet it serves, in
`docs/requirements/04f5-tanto.md` (req-04f5), or says that none does. The
human's words are in `dialogue.md`; the question numbers below are its.

1. **Three sources, the project file tracked.** The sources are the
   built-in `templates/tanto.json`, the personal
   `$CLAUDE_CONFIG_DIR/tanto.json` (or `~/.claude/tanto.json`), and the
   project `<cwd>/.claude/tanto.json`, in that order of precedence, the
   project file winning. Whether the repository commits that file is the
   repository's own decision: `tanto` assumes neither, requires it tracked
   no more than it ignores it, and ships no `.local` variant — a
   repository that wants the file local ignores it itself (Q1: (a), refined
   at the review gate). Serves req-04f5
   **Model discipline**, whose scope sentence says a repository can pin
   the models its own runs check against without changing the check in
   the human's other repositories.
2. **The overlay is field by field, and a bare string sets the model
   only.** The three maps and their shapes are unchanged; a value written
   as a bare family name sets `model` and leaves `effort` to the layers
   below, which for the personal file is what "the effort from the
   defaults" already meant (D1). Serves req-04f5 **Model discipline**
   (the human decides both values, and nothing is silently reset).
3. **A project-level effort is honored, through project-scope
   definitions.** When the three-layer effort of a kind differs from the
   effort the user-scope definition carries, the role writes that kind's
   definition to `<cwd>/.claude/agents/tanto-<object>-<act>.md`, which the
   harness prefers over the user-scope one of the same name (M2); the
   user-scope definitions keep being rendered from the built-in and
   personal layers only, so a repository's effort never leaks to another
   (Q2: (a)). This is the answer to issue-cae3. Serves req-04f5 **Model
   discipline**: a subagent never inherits an effort by accident.
4. **The generated project definitions are ignored by a self-ignoring
   `.gitignore`.** The role that writes the first project-scope definition
   also writes `<cwd>/.claude/agents/.gitignore`, holding `tanto-*.md` and
   `.gitignore`, when it is absent, and never overwrites it — the pattern
   `.tanto/.gitignore` already uses (Q3: (a)). Serves no bullet directly;
   the reason is Kanri's boundary verification, which expects `git status`
   clean, and the two alternatives (tracked, or the human's own ignore)
   each dirty it in a different way — see "Old values" and the rejected
   alternatives in "Shoroku candidates".
5. **No project file ships for this repository.** The mechanism lands;
   the first `.claude/tanto.json` is written when a run needs one (Q4:
   (a)). The write path of section 2 is therefore measured by the first
   run that carries a project effort, and "Deferred items" says so.
   Serves no bullet.
6. **The measurements of "Measured while designing" are inputs.** In
   particular M1: a definition written during a session is not
   dispatchable in that session, whatever the docs say, so a project
   effort takes effect from the second session in that repository, as a
   fresh machine's definitions do today.
7. **Rule 11 applies.** This plan edits the skill's own files, and the
   sessions that run it load the working tree's copy of the skill; the
   plan's Global Constraints, Kanri's orders line, and the batch prompts
   are the authority for the run's sessions, and section 5 names the
   boundary from which a role may be started or replaced. Serves req-04f5
   **Composes without modifying** only in that nothing here changes a
   composed skill.
8. **The plan is drafted after `tanto-sweep-2` lands.** That topic
   restructures `SKILL.md` and the role files; this spec names its sites
   by the headings and phrases that identify them today, and Keikaku
   re-reads each site as it stands when the plan is drafted. The two
   topics share the Artifacts table and `SKILL.md`'s Rules, and no row or
   rule both edit.

## Measured while designing

All on 2026-09-15, Claude Code 2.1.231, on the machine that runs this
repository. The docs quoted are `code.claude.com/docs/en/sub-agents.md`
and `code.claude.com/docs/en/settings.md`, fetched that day.

- **M1 — a definition written during a session is not dispatchable in that
  session.** A user-scope definition
  `$CLAUDE_CONFIG_DIR/agents/tanto-probe-hotreload.md` was written from
  this Sekkei session and dispatched about a minute later; the Agent tool
  answered `Agent type 'tanto-probe-hotreload' not found` and listed the
  twelve `tanto-*` definitions that existed at the session's start. The
  docs say the harness "watches `~/.claude/agents/` and `.claude/agents/`
  for changes", detects an edit "within a few seconds", and needs "no
  restart"; measured otherwise for the dispatch path. The skill's own
  sentence — "A definition written during a session is not visible to
  that session" — stands, and this spec extends it to project scope
  without measuring that scope separately, since nothing in the docs
  distinguishes the two.
- **M2 — a project-scope definition wins over a user-scope one of the same
  name.** `claude -p --model haiku` was run in a scratch directory holding
  `.claude/agents/tanto-default.md` whose description was a distinct
  marker string, while the user-scope `tanto-default.md` existed; asked to
  print the description of `tanto-default` from its system prompt, the
  headless session printed the project copy's. This matches the docs'
  priority order (project `.claude/agents/` above user `~/.claude/agents/`;
  "When multiple subagents share the same `name` field, Claude Code uses
  the one from the highest-priority location"). It is the harness fact
  the Kikaku decision asked to be measured at spec time.
- **M3 — `effort` is a documented frontmatter field** of a subagent
  definition, with the values `low`, `medium`, `high`, `xhigh`, `max`
  ("available levels depend on the model"). Whether the harness honors it
  remains measured-unconfirmed, as design-4807 records; this spec does
  not settle that, and nothing here depends on it beyond what decision-03f9
  already assumed.
- **M4 — the harness ignores only its own local file.** The first time it
  writes `.claude/settings.local.json` in a repository that does not
  ignore it, it adds `**/.claude/settings.local.json` to the *global* git
  excludes file; this machine's `~/.config/git/ignore` carries that line
  and no other `.claude/` pattern. A local `tanto.local.json` would have
  had to be ignored by hand, which weighed against it in Q1.
- **M5 — `CLAUDE_CONFIG_DIR` relocates the home-directory files only.**
  The docs say it moves settings, session history, and plugins; they say
  nothing about project-scope `.claude/`, and this spec reads the project
  file and writes the project definitions relative to the session's
  working directory regardless of that variable.
- **M6 — the description survives into the agent list.** The system
  prompt's list of available agent types prints each definition's
  `description`, which is how M2 could tell the two copies apart, and
  which section 2.2's marker relies on.

## 1. The sources and the merge

### 1.1 The three files

| Layer | Path | Who writes it | Precedence |
| --- | --- | --- | --- |
| built-in | `templates/tanto.json`, in the skill | the skill | lowest |
| personal | `$CLAUDE_CONFIG_DIR/tanto.json`, or `~/.claude/tanto.json` when that variable is unset | the human, outside the skill | middle |
| project | `<cwd>/.claude/tanto.json` | the repository; committed or ignored as it decides | highest |

`<cwd>` is the session's working directory — the one rule 4 binds the
session to, the one the roster's cwd column records, and the one
`reading.js` runs in. The skill does not search upward for a git root:
every `tanto` session runs at the repository root by the roster's own
convention, and a session started elsewhere reads no project file, which
the start line then says. Deployment of the project file is the
repository's own business, as the personal file's is the human's, and so
is whether it is committed: the skill only reads it, and neither requires
it tracked nor ignores it. An absent project file is the case where every key
comes from the two layers below; an absent personal file is the case it is
today.

### 1.2 The overlay rule

The three maps — `sessions`, `subagents`, `ceiling` — and their value
shapes are unchanged. The overlay is field by field, in the order of the
table: a project `{"sessions": {"sekkei": {"effort": "xhigh"}}}` changes
that one effort and keeps the personal or built-in model; a project
`{"ceiling": {"kanri": {"batches": 1}}}` changes that one field. A value
written as a **bare string** sets the `model` field and leaves `effort` to
the layers below. For the personal file this is what the existing sentence
"a bare string means that model with the effort from the defaults" already
meant, since the defaults are the only layer below it; the new wording
says "from the layers below" so that the same sentence holds for the
project file, where a bare string over a personal `{model, effort}` keeps
the personal effort.

A key that names no role, no kind, and no ceiling field is reported and
otherwise ignored, as today; the report now names the file:
`unknown key <name> in <path>, ignored`, or
`unknown key ceiling.<name> in <path>, ignored` for one under that map.
`<path>` is the file's path as the start line prints it. This is a change
to a phrase `reading.js` writes on stderr, and section 3.3 carries it.

### 1.3 The start line

The start line today says which file was read and which keys came from
the defaults. It now says, in one line:

- the two files with their state — `personal <path> present` or
  `personal <path> absent`, and `project <path> present` or
  `project <path> absent`;
- which fields came from the project file, at the granularity of a field
  (`project: subagents.task.implement.effort, ceiling.kanri.batches`),
  which from the personal file, and that the rest are built-in defaults —
  or `all keys built-in defaults` when both files are absent;
- the unknown keys, each with its file, as 1.2 says;
- the ladder result if that check failed; the agents phrase of 2.5.

A field the project file sets to the same value the personal file sets is
reported as the project's: the report is about where the effective value
was read from, and precedence decides that.

### 1.4 Kanri's handshake check

Kanri reads the config "at this moment — its presence as much as its
content" at every handshake; it now reads **both** files at that moment
and compares `model=` and `effort=` against the merged `sessions.<role>`.
The sentence in `roles/kanri.md` gains the word "both" and nothing else,
because it defers to `SKILL.md` for what "read `tanto.json`" means. A
project file added, edited, or deleted between two handshakes is seen by
the second, as a personal one is today.

### 1.5 The ladder check

`subagents.task.escalate` above `subagents.task.implement` on the family
ladder is checked on the merged result of the three layers, once per
session start, as today.

### 1.6 The skill-name key at the project level

A key inside `subagents` whose name is a skill's means "run that skill in
a subagent on that model" at whichever layer it appears. At the project
level it is a repository-wide statement of the same thing, overlaid on the
personal one by the same rule, and the skill treats it no differently.
issue-6a29's second open question is answered by that sentence: yes, it is
meaningful, and it costs nothing more.

## 2. The definitions

### 2.1 User scope, unchanged in content

Each role writes, at its start, one definition per kind to
`$CLAUDE_CONFIG_DIR/agents/tanto-<object>-<act>.md` (or `~/.claude/agents/`),
rendered from `templates/agent.md`, when absent or differing. The rendering
takes its effort from the merge of the **built-in and personal layers
only**. That is the merge every role in every repository computes
identically for the same personal file, which is the property that keeps
the user-scope files stable across repositories: a project's effort must
not be written where every other project reads it, or issue-6a29's failure
returns by another route.

### 2.2 Project scope: which kinds, where, and the marker

After the user-scope pass, the role computes, for each of the twelve
kinds, the three-layer effort. For every kind whose three-layer effort
**differs** from the user-scope effort, it writes
`<cwd>/.claude/agents/tanto-<object>-<act>.md` from the same template, with
that effort, when the file is absent or its content differs; a file that
already matches is left alone. The description of a project-scope
rendering carries a scope marker so that M6 makes it visible: the
template's description gains a slot, rendered empty at user scope and as
one clause at project scope, placed and worded in section 4.4. A model
difference alone produces no project-scope file: the model rides in the
dispatch's own `model` parameter, and a definition carries none.

When the project file is absent, or sets no effort that differs, the
write half of the project pass writes nothing and creates no directory;
the removal half of 2.3 still runs.

### 2.3 Removal of stale project definitions

For every kind whose three-layer effort does **not** differ from the
user-scope effort, the role removes `<cwd>/.claude/agents/tanto-<object>-<act>.md`
if it exists. The removal sweep runs whenever `<cwd>/.claude/agents/`
exists, whether or not a project file does — the absent-file case is the
one it exists for. Only the twelve names are ever removed, and nothing else
under `.claude/agents/` is touched. Without this rule, a project file
edited to drop an effort would leave a project-scope copy that keeps
winning by M2 while the start line reports the effort as the personal
one's — the silent override the requirement forbids.

### 2.4 `.claude/agents/.gitignore`

When the project pass writes its first definition and
`<cwd>/.claude/agents/.gitignore` is absent, the role writes it with the
two lines `tanto-*.md` and `.gitignore`; when the file exists it is never
overwritten, whatever it holds. The file ignores the generated definitions
and itself, as `.tanto/.gitignore`'s `*` ignores that directory and itself.
A repository that tracks its own definitions under `.claude/agents/` is not
affected: a tracked file matching an ignore pattern stays tracked, and the
two patterns name only `tanto`'s files. The file is not removed when the
last project definition is removed; it is inert then.

This is the one place `tanto` writes for itself outside `.tanto/`, and
decision-7e21 — everything `tanto` writes for itself lives under
`<workspace>/.tanto/`, self-ignored and self-lint-silenced — is not
amended by it: the definitions are addressed to the harness, which reads
project-scope definitions from `.claude/agents/` and nowhere else (M2), so
the location is the harness's, not `tanto`'s to choose. No lint silencer
is needed there: the repository's lint runs over tracked files, and these
are ignored.

### 2.5 The count line and `/tanto fukki`

The start line's agents phrase becomes
`agents: <n> current, <m> written, <k> not visible to this session; project: <p> current, <q> written, <r> removed, <s> in effect`,
with `<s>` the number of the twelve names whose description in this
session's own agent list carries the project-scope marker, and with the
kinds named when `<k>` is above zero, as today. The `project:` half is
printed even when all four are zero, so that a start line always says
which scope the session runs on. `/tanto fukki` re-runs both passes and
says the result the same way, as it re-runs the user-scope pass today.

### 2.6 Visibility

M1 holds for both scopes: a project-scope definition written during a
session is not dispatchable in that session, and a session that dispatched
on the user-scope copy is telling the truth in `<s>`. So a project effort
takes effect from the second session started in that repository after the
file changed, exactly as a fresh machine's definitions take effect from the
second session there. The existing sentence that tells the dispatching
role to say once, in its next line, that a dispatched effort came from the
session's own effort when the kind is not visible, covers the project case
too: a kind visible at user scope but not yet at project scope dispatches
with the user-scope effort, and the role says so once — `<s>` is where it
reads that from.

## 3. `scripts/reading.js`

### 3.1 The third layer in `loadCeiling`

`loadCeiling` overlays, in order, the built-in copy, the shipped
`templates/tanto.json`, the personal file, and then the project file at
`path.join(process.cwd(), ".claude", "tanto.json")`. A project file that is
missing or does not parse is the no-op case, as the personal one is. The
returned `path` field — which no caller in `reading.js` reads today, and
nothing prints — becomes `paths`, an object with `personal` and `project`,
kept for a module caller and for the tests; the script still prints no
config path.

### 3.2 `--project-config <path>`

A new switch, the pair of `--config`: it fixes the project file's path for
the tests and for a Kanri verifying a peer's reading from another working
directory. Both forms take it — the single-transcript reading and
`--share`. The `USAGE` string names it; no role file passes it, as none
passes `--config`.

### 3.3 The warnings

An unknown key under the `ceiling` map is reported on stderr as
`unknown key ceiling.<name> in <path>, ignored`, with `<path>` the file it
came from. The phrase changes for the personal file too, so that the two
sources are told apart; `SKILL.md`'s config section quotes the same phrase
(1.2), and the two must agree.

### 3.4 Tests

Five cases join `reading.test.js`, in its existing style (a fixture
directory per test, `run([...])` on the script, exact-line assertions):

1. the project file overlays the personal one — a field set in both takes
   the project's value, a field set only in the personal keeps it;
2. a missing project file is the all-lower-layers case;
3. an unparsable project file is the same, with no line on stderr beyond
   what the personal file produces;
4. `--project-config` fixes the path, in both forms;
5. an unknown key in the project file is named with that file's path, and
   one in the personal file with its own, in one run that has both — the
   expected lines are built from the fixture's own path, regex-escaped,
   since the existing assertions are `$`-anchored lines and the path is
   absolute and, on Windows, backslashed.

The existing `--config` tests are untouched; the two assertions on the old
warning phrase, `/^unknown key ceiling\.sekkei, ignored$/m` and
`/^unknown key ceiling\.kanri\.window, ignored$/m`, are updated to the new
one.

## 4. The files, and what changes in each

### 4.1 `skills/tanto/SKILL.md`

The sub-changes are numbered so that section 5 can cite them.

1. "The expected-model config", the section's opening paragraph: its
   first sentence, which names one location
   ("`$CLAUDE_CONFIG_DIR/tanto.json`, or `~/.claude/tanto.json` when that
   variable is unset"), becomes the three files of 1.1 with their
   precedence; its bare-string sentence ("or a bare string, which means
   that model with the effort from the defaults") is reworded as 1.2 says.
2. The same section, the `sessions.<role>` bullet: "since a personal
   override can be created, edited, or deleted at any time" says "a
   personal or a project override", so that 1.4's read of both files at
   each comparison is stated where the rule is.
3. The same section, the paragraph beginning "The skill ships built-in
   defaults": the overlay sentence "Read the personal file and overlay it
   on the defaults **field by field**" becomes the three layers of 1.1 and
   1.2; the unknown-key phrases gain `in <path>` as 1.2 says.
4. The same section, the paragraph beginning "Say once, in your start
   line": rewritten to 1.3, replacing "which file you read; which keys
   came from the defaults" and the absent-file phrase
   "`no tanto.json at <path>, all keys built-in defaults`".
5. The same section, the paragraph beginning "A kind's effort cannot ride
   in a dispatch": the user-scope pass renders from the built-in and
   personal layers (2.1), and the project pass of 2.2–2.4 follows it.
6. The same section, the paragraph beginning "Then read your own system
   prompt's list": the count line gains the `project:` half of 2.5, and
   the M1 sentence is extended to both scopes as 2.6 says.
7. "The transcript reading": the sentence "Three further switches —
   `--now`, `--config`, `--settings`" becomes four, naming
   `--project-config`.
8. "Resuming": the sentence on `/tanto fukki` re-running the
   twelve-definitions write-and-count says "both scopes".
9. "Artifacts", the executables paragraph: the list of `reading.js`
   switches gains `--project-config`.
10. "Artifacts", the table: the `$CLAUDE_CONFIG_DIR/tanto.json` row is
    joined by a `<cwd>/.claude/tanto.json` row (writer: the repository;
    readers: every role at start, Kanri at each handshake, `reading.js`);
    the `~/.claude/agents/tanto-*.md` row's writer cell "every role at its
    start, from the merged config" becomes "from the built-in and
    personal layers", and the row is joined by a
    `<cwd>/.claude/agents/tanto-*.md` and `.claude/agents/.gitignore` row
    (writer: every role at its start, for the kinds whose effort the
    project file changes; readers: the harness at the next session start;
    git).
11. Rule 6: "the definitions at `~/.claude/agents/tanto-<object>-<act>.md`"
    becomes "at `~/.claude/agents/` or `<cwd>/.claude/agents/`".

The frontmatter is unchanged: the `description` gains no `: ` and the
`argument-hint` gains no word. The two phrases of 1.2 and the count line
of 2.5 are each written on one line, since "Verification" greps them.

### 4.2 `skills/tanto/roles/kanri.md`

- Start, step 1: "Read `tanto.json` as `SKILL.md` describes" is unchanged
  in form; "write the twelve agent definitions from the merged config"
  becomes "write the agent definitions of both scopes"; the enumeration
  "the config file, the keys that came from the defaults" becomes "the two
  config files and which fields came from which"; and the literal count
  line `agents: <n> current, <m> written, <k> not visible to this session`
  becomes the line of 2.5.
- On a handshake, step 1: "Read `tanto.json` at this moment" becomes
  "Read both `tanto.json` files at this moment", the rest unchanged.
- No other role file names the personal path or the agents directory;
  the six other role files are untouched. Kanri confirmed the two sites
  (I-1), and that its other references say "the merged config" without
  counting layers.

### 4.3 `skills/tanto/README.md`

- The feature bullet "Checks each session's model and effort against a
  personal `tanto.json`" says "a personal and a project `tanto.json`".
- The Prerequisites bullet "**Optional** — a personal
  `$CLAUDE_CONFIG_DIR/tanto.json`" gains the project file: a
  `<repo>/.claude/tanto.json`, overlaid on the personal one, committed or
  ignored as the repository decides, and one
  sentence that a project effort is carried by project-scope definitions
  the roles generate under `<repo>/.claude/agents/`, ignored by a
  `.gitignore` they write there.
- The templates list is unchanged: `agent.md` is still one template.

### 4.4 `skills/tanto/templates/agent.md`

The description line becomes
`description: tanto's <object>.<act> seat.<scope> Dispatched by a tanto role by name through subagent_type, and never to be selected from this description.`
with `<scope>` rendered as the empty string at user scope and as
` Project-scope copy for this repository.` at project scope — one space
before the clause, so the user-scope rendering is byte-identical to
today's. The clause carries no `: `, which the consistency note's
frontmatter check guards. The body is unchanged.

### 4.5 `skills/tanto/scripts/reading.js` and `reading.test.js`

Section 3 whole.

### 4.6 `docs/notes/tanto-consistency-checks.md`

§8's fourth line, which reads the rendered `tanto-task-implement.md` at
user scope, gains a fifth that reads `.claude/agents/tanto-task-implement.md`
relative to the repository root when it exists, and records
`no project-scope definition on this host` when it does not. §16, "The
usage line names every subcommand", greps `reading.js`'s one-line usage
for a fixed alternation of seven switches and expects `7`; the alternation
gains `\-\-project-config` and the expectation becomes `8` — `--config`
does not match inside `--project-config`, so without this the check keeps
passing and stops covering the interface. The note's structural counts
are untouched.

## 5. The boundary, the batch cut, and rule 11

The files that change: `SKILL.md`; `roles/kanri.md`; `README.md`;
`templates/agent.md`; `scripts/reading.js` and `reading.test.js`; and
`docs/notes/tanto-consistency-checks.md`. The other six role files, the
other twelve templates, `passage-check.js` and its test do not change. A
session started mid-plan reads whatever is on disk (rule 11). The plan
names in Global Constraints and in Batches the authority sentence — the
run's sessions follow the constraints, Kanri's orders line, and the batch
prompts, not the role text on disk — and the boundary from which a role
may be started or replaced. Because the config section, the start line,
the template, and the script must agree, that boundary is the final one,
and the plan says so; Kanri's handover proceeds when due and its successor
takes the authority ruling from the handover file.

The run's own sessions read today's skill: they read one config file and
write one scope of definitions, which is consistent as long as this
repository ships no project file (Fixed input 5), and it ships none.

The batch cut the plan is expected to make, in this order, three or four
tasks each; the plan decides the exact cut and the review checks that no
cut leaves the tree inconsistent at its boundary beyond what rule 11
covers:

- **A — the sources**: `reading.js` and `reading.test.js` (section 3,
  TDD); `SKILL.md`'s sub-changes 1, 2, 3, 4, 7, 9 and the config-file row
  of 10 (4.1); `roles/kanri.md`'s handshake line and start-line
  enumeration (4.2); the README's two bullets (4.3), without the sentence
  on the project definitions; the §16 alternation of 4.6. The start line
  of 1.3 lands here without its agents phrase, which is 2.5's and lands
  with B. The tree is consistent at this boundary: the definitions
  paragraphs still describe one scope, and no project file exists to
  exercise the other.
- **B — the definitions**: `templates/agent.md` (4.4); `SKILL.md`'s
  sub-changes 5, 6, 8, 11 and the definitions rows of 10 (4.1);
  `roles/kanri.md`'s "both scopes" and count line (4.2); the README's
  sentence on the project definitions (4.3); the §8 fifth line of 4.6;
  and the sweep-and-check task of "Verification".

## Old values this plan contradicts

Each is an `O` block in the plan, with the needle spanning the change
point.

- `SKILL.md`, "The expected-model config", opening paragraph:
  "`$CLAUDE_CONFIG_DIR/tanto.json`, or `~/.claude/tanto.json` when that
  variable is unset" — now three files; and "or a bare string, which means
  that model with the effort from the defaults" — now "from the layers
  below".
- `SKILL.md`, same section, the `sessions.<role>` bullet: "since a
  personal override can be created, edited, or deleted at any time" — now
  a personal or a project override.
- `SKILL.md`, same section: "Read the personal file and overlay it on the
  defaults **field by field**" — now three files.
- `SKILL.md`, same section: "`unknown key <name>, ignored`" and
  "`unknown key ceiling.<name>, ignored`" — now with `in <path>`.
- `SKILL.md`, same section: "Say once, in your start line, which file you
  read; which keys came from the defaults" and
  "`no tanto.json at <path>, all keys built-in defaults`" — now two files
  and which fields came from which.
- `SKILL.md`, same section: "write for each of the twelve kinds the file
  `~/.claude/agents/tanto-<object>-<act>.md`" — the user-scope pass now
  renders from the built-in and personal layers only, and a project pass
  follows.
- `SKILL.md`, same section: "`agents: <n> current, <m> written, <k> not
  visible to this session`" — now with the `project:` half.
- `SKILL.md`, "The transcript reading": "Three further switches — `--now`,
  `--config`, `--settings`" — now four.
- `SKILL.md`, "Artifacts", the definitions row: "every role at its start,
  from the merged config" — now from the built-in and personal layers.
- `SKILL.md`, Rule 6: "the definitions at
  `~/.claude/agents/tanto-<object>-<act>.md`" — now either scope.
- `roles/kanri.md`, Start step 1: "write the twelve agent definitions from
  the merged config" — now both scopes; and "`agents: <n> current, <m>
  written, <k> not visible to this session`" — now the line of 2.5.
- `roles/kanri.md`, On a handshake: "Read `tanto.json` at this moment" —
  now both files.
- `README.md`: "against a personal `tanto.json`" and "**Optional** — a
  personal `$CLAUDE_CONFIG_DIR/tanto.json`" — now a personal and a project
  file.
- `templates/agent.md`: the description line — now with the `<scope>`
  slot.
- `reading.js`, the comment over `loadCeiling`, quoted with its
  continuation markers as it stands:
  ` * The merged `ceiling` map: the built-in copy, then the shipped` /
  ` * `templates/tanto.json`, then the personal file. Returns` — now then
  the project file; and the one-line `USAGE` string — now with
  `--project-config` in both forms.
- `reading.test.js`: the two assertions
  `/^unknown key ceiling\.sekkei, ignored$/m` and
  `/^unknown key ceiling\.kanri\.window, ignored$/m` — now with the file.

## Requirements

No bullet of req-04f5 is added or reworded: the scope sentence T0 appended
to **Model discipline** (ledger S-1) already states the need this spec
meets, and its wording guard — the need only, none of the design — is
what this spec fills in. T2 records that the bullet is now served, and
bumps nothing but `updated:` if the ADR's cross-reference is added there.

## The ADRs

One ADR, at T2, amending decision-9a3a and decision-03f9:

- **Context**: issue-6a29's measurement of 2026-09-11 and its workaround;
  issue-cae3's bound; the Kikaku decision that opened the topic; M1 and
  M2.
- **Options**: one project file or a shared-plus-local pair (Q1); a
  project effort honored through project-scope definitions or ignored
  with a line (Q2); the generated files ignored by a self-ignoring
  `.gitignore`, tracked, or left to the human (Q3); a project file shipped
  for this repository or not (Q4).
- **Decision**: 1.1's table and precedence, with whether the project file
  is committed left to the repository; 1.2's overlay and bare-string
  rule; 1.3's start line, which replaces 9a3a's "a role says once at
  start which file it read and which keys came from the defaults";
  2.1–2.5; the phrase and switch of section 3.
- **Consequences**: a project effort takes effect from the second session
  (M1); the user-scope definitions are stable across repositories by
  construction; `.claude/agents/` gains a generated file per differing
  kind and one `.gitignore`, the one thing `tanto` writes for itself
  outside `.tanto/`, because the harness reads project-scope definitions
  there and nowhere else; the two unknown-key phrases change; a
  repository whose `tanto` sessions run outside its root reads no project
  file; the docs' hot-reload sentence and M1 disagree on 2.1.231, and the
  skill stands on the measurement.
- Frontmatter: `amends: ["9a3a", "03f9"]`, and `amended_by` on both.

Three decisions are touched and not amended, and the ADR says so in one
sentence each: decision-08bc, because the check is the same check on a
merged value with one more layer; decision-eee2, because its three
statements — the key-by-key overlay, the defaults in the skill, the
personal file outside the repository — all still hold, and the `ceiling`
map's third layer follows the overlay rule eee2 fixed; decision-7e21,
because its location rule is about `tanto`'s own state and the
definitions are harness-addressed (2.4).

## What the plan must contain

- Global Constraints: the repo's `AGENTS.md` rules; the concrete families
  and efforts for the run's own dispatches from `tanto.json`; **Git Bash**
  as the shell every fenced command runs in, with `$TANTO` set in the same
  call as any script it names; the authority sentence and the replacement
  boundary (section 5); the statement that the run's own sessions read one
  config file and write one scope, and that this repository ships no
  project file.
- A Batches section as section 5 sketches, each batch with its stop
  conditions, and the boundary at which a role may be started or replaced
  named as the final one.
- How a batch is verified: lint on the changed paths by name;
  `node --test skills/tanto/scripts/reading.test.js` and
  `node --test skills/tanto/scripts/passage-check.test.js` on the pinned
  Node; the consistency note's §8 lines; the greps of "Verification"
  below; `node "$TANTO/scripts/passage-check.js" diff` as the boundary
  check.
- Passages in the block grammar for every file that changes in part, and
  the `O` blocks of "Old values" — written before the passages, one per
  entity, each needle spanning the change point and run as written.
- Every Verify step as one `verify --plan <path> --task <N>` invocation;
  the Self-Review's largest-task figures; the sweep-and-check task named.
- The T2 list for Kanri (per ledger R-4, this topic runs no T1: every
  shoroku item consolidates at T2): the ADR of "The ADRs" with its
  frontmatter bookkeeping on 9a3a and 03f9; the issues of "Issues this
  design closes"; the Deferred items as new issues; and the
  `docs/design/4807-tanto.md` sections that go stale — "The expected-model
  config" (the two-maps paragraph and the definitions paragraph, rewritten
  to sections 1 and 2) and "The start sequence" (the start line's three
  sources).
- Nothing about report or prompt skeletons beyond "follow the tanto
  templates".

## Verification

- `node --test skills/tanto/scripts/reading.test.js` — every case of 3.4
  passes, on the pinned Node.
- `grep -c -- '--project-config' skills/tanto/SKILL.md skills/tanto/scripts/reading.js`
  — `2` (the reading section and the Artifacts paragraph) and `1`
  (`reading.js` spells its whole usage on one line, and `grep -c` counts
  lines); and the consistency note's §16 line prints `8`.
- `grep -c 'unknown key ceiling.<name> in <path>, ignored' skills/tanto/SKILL.md`
  — `1`; and `grep -c 'in <path>, ignored' skills/tanto/SKILL.md` — `2`
  (the two phrases of 1.2). Each phrase is written on one line, and the
  plan's passage keeps it so; a reflow that wraps it leaves the text right
  and this check red.
- `grep -c '<scope>' skills/tanto/templates/agent.md` — `1`; and the
  consistency note's §8 frontmatter parse of the template still prints
  `ok`.
- `grep -c 'both scopes' skills/tanto/SKILL.md` — at least `1`, in
  "Resuming".
- `grep -c 'Read both' skills/tanto/roles/kanri.md` — `1`; and
  `grep -c 'project: <p> current' skills/tanto/SKILL.md skills/tanto/roles/kanri.md`
  — `1` and `1`, the count line of 2.5 at both sites.
- The M2 probe, re-run by the whole-branch reviewer in a scratch
  directory outside the repository: a `.claude/agents/tanto-default.md`
  whose description carries the marker clause of 4.4, then
  `claude -p --model haiku` asked to print `tanto-default`'s description
  from its system prompt; expected: the marker. This re-measures the
  harness fact the design stands on, on the harness version the plan
  lands under, and the report names that version.
- The consistency pass: the greps above and the note's §8 lines, run by
  the sweep-and-check task at batch B.

The roles' project pass itself — the write, the removal, the `.gitignore`,
the `project:` half of the count line — is prose the roles execute, and
this repository ships no project file to run it against; "Deferred items"
names the measurement that settles it.

## Out of scope

- A second, local-only project file (`.claude/tanto.local.json`, or a
  file under `.tanto/`): rejected in Q1 until a case appears where a
  repository wants both a shared file and a per-machine override of it. A
  repository that wants its one file local ignores it itself.
- Any edit to the global git excludes file, or to a repository's
  `.gitignore`: the self-ignoring `.claude/agents/.gitignore` is the whole
  of the ignore machinery.
- A per-role override of a kind's model or effort (decision-9a3a left it
  for a real case; none has appeared).
- Whether the harness honors the `effort` frontmatter field
  (design-4807's measured-unconfirmed note stands).
- The harness's file watching (M1): a harness fact, recorded, not worked
  around.
- Searching upward from `<cwd>` for a repository root.
- The `tanto-diet`'s cut of the config section: it runs after this topic
  and cuts what this spec writes, by the Kikaku decision's own ordering.

## Issues this design closes

- **issue-6a29** — the project overlay is section 1; both of its open
  questions are answered (Q1: one file, committed or not as the
  repository decides; 1.6: a skill-name key is meaningful at the project
  level).
- **issue-cae3** — a project-level effort is honored through project-scope
  definitions (section 2), measured by M2; the issue's `blocks: ["6a29"]`
  is discharged with it.

## Answers to the spec inputs

- **I-1** — Kanri's answer to the passage check on 4.2. (1) The three-way
  start line is stated once, in `SKILL.md` (4.1, sub-change 4), and every
  role inherits it; `roles/kanri.md` restates only its own enumeration,
  as it does today. (2) The precedence is explicit: 1.1's table, project
  highest; "the merged config" everywhere else means the three-layer
  result. (3) The project file's tracking is the repository's (Fixed input 1,
  Q1, refined at the review gate): whether it is committed is the
  repository's own decision, and `tanto` assumes neither — it does not
  require the file tracked, and it does not ignore it. `AGENTS.md`'s
  "Never do" on local-only configuration binds whatever a repository
  decides is local, and that repository ignores the file itself. What
  `tanto` itself keeps out of commits is the generated definitions (2.4).

## Deferred items

1. **The project pass, measured.** The first run in any repository that
   carries a project effort measures section 2 end to end: the files
   written, the stale one removed after the file is edited back, the
   `.gitignore` written once, and `<s>` reading `0` in the first session
   and the differing count in the second. Recorded at T2 as an issue
   naming those four checks, closed by that run's report.
2. **A second project layer**, when a repository wants both a shared file
   and a per-machine override of it: precedence local > shared > personal
   > built-in, one more path in `loadCeiling`, one more `--*-config`
   switch, and an ignore the repository owns (M4). Recorded at T2 as an
   issue with severity `low`.
3. **M1 against the docs.** The docs' "watches for changes" sentence and
   the measured dispatch failure disagree on 2.1.231; the skill's sentence
   stands on the measurement. Not an issue of this repository: one line in
   the ADR's Consequences and nothing under `docs/notes/` — decided at the
   review gate by the brief's default, the human leaving the point
   unanswered.

## The reviews this spec has had, and what each found

- **Spec review, 2026-09-15** (`spec.review` on `opus`, report at
  `.tanto/tanto-project-config/spec-review.md`): verdict "accept with the
  Important fixes"; 17 findings, 10 Important, 6 Minor, 1 clean bill.
  Every Important and Minor finding was accepted and is in this text:
  decision-eee2 and decision-7e21 named in "The ADRs" (1, 2); the
  `reading.js` grep expectation and the §16 alternation (3, 4); the
  marker "carries" rather than "ends with" (5); four `SKILL.md` sites and
  the bare-string paragraph's attribution (6); `roles/kanri.md`'s count
  line and "from the merged config" (7); the removal sweep independent
  of the project file (8); 1.3 and 2.5 in the ADR's Decision (9); 4.1's
  sub-changes numbered and the README's sentence in one batch (10, 11);
  `loadCeiling`'s `path` field (12); the two needles quoted as they stand
  (13); the fixture path in the fifth test (14); the one-line phrases
  (15); D3's answer recorded (16). The review's Shoroku candidates are
  Kanri's to adopt from the report.

## Shoroku candidates from this spec work

The proposal is the delta: the spec, the review, and `dialogue.md` are
read by T2 directly and are not restated.

1. **M1** — a definition written during a session is not dispatchable in
   it (Claude Code 2.1.231), against the docs' hot-reload sentence; the
   instrument was a real dispatch, not a transcript read.
2. **M2** — project scope wins over user scope for a same-named
   definition, measured with a headless `claude -p` in a scratch directory
   and a distinct description; the description is the instrument (M6),
   and it is cheap enough to re-run at every harness upgrade.
3. **Rejected: a local project file** (Q1) — no case where a repository
   needs both a shared file and a per-machine override; the personal file
   is the per-machine knob; M4 shows the harness ignores only its own local
   file. Refined at the review gate: whether the one project file is
   committed is the repository's decision, and `tanto` assumes neither —
   the reason it neither requires the file tracked nor ignores it.
4. **Rejected: ignoring a project effort with a line** (Q2) — M2 made the
   honoring route measurable, and the requirement's "never inherits an
   effort by accident" is better served by honoring than by reporting.
5. **Rejected: tracking the generated definitions, or leaving the ignore
   to the human** (Q3) — tracked files dirty Kanri's boundary check at
   every effort change; a human-owned ignore shows untracked files in
   every repository until the human acts; the self-ignoring `.gitignore`
   is the pattern `.tanto/` already uses.
6. **Rejected: a dogfood project file in this repository** (Q4) — the
   `shoroku: fable` override is the human's machine-level choice, not the
   repository's; the write path is measured by the first real use instead.
7. **The bare-string rule restated as "the layers below"** — the old
   wording "from the defaults" was correct only while there was one layer
   below; a third layer exposed the ambiguity.
8. **The stale-definition removal (2.3)** — a project-scope copy that keeps
   winning after the project file drops its effort is a silent override,
   the exact failure the requirement names; removal is the only rule that
   makes the start line's report true.
9. **`<cwd>`, not a git root** — every `tanto` session runs at the
   repository root by the roster's convention; a search upward would add a
   rule for a case the run never produces.
10. **The spec was written as a draft under R-5** — a Sekkei whose
    checkout is another topic's writes `.tanto/<topic>/spec-draft.md`,
    which the contract already provides for; nothing in this topic's flow
    needed the checkout.
