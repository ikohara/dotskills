# tanto's seven seats, twelve kinds, and the write-outs done from files Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the cost of a `tanto` run off the top family's resident
contexts. Seven seats replace four, each with a model **and** an effort checked
at both ends; twelve `<object>.<act>` subagent kinds replace five, carried by
agent definitions the roles generate beside `tanto.json`; the shoroku flow
becomes one shape at every stage — the session that holds the candidates writes
them, a subagent recommends, the human checks by exception, a subagent applies
and commits — so a session is deletable as soon as its proposal is on disk; the
review brief is dispatched by the document's author; and three new subcommands
of `passage-check.js` let a report be read by section, a plan's frame be staged,
and a boundary be one command.

**Architecture:** Two shapes, and the batch cut follows them. **Batch A is
code**: three subcommands of `skills/tanto/scripts/passage-check.js`, each
written test-first, with the tests quoted verbatim in the plan and the
implementation left to the implementer against a stated interface. **Batches B
to F are passages**: each task carries the old passage and the new passage
verbatim, replaces exactly the one for the other, and changes no other byte, so
a touched file's diff against the base is the union of the passages landed in
it so far. Five files are created whole (`W` blocks with `created:`
declarations); `SKILL.md` and `roles/kanri.md` are rewritten in passages rather
than whole, because their unchanged text is most of them. Each block appears in
this plan exactly once and is cited by its id wherever it is needed again.

**Tech Stack:** Markdown and Node. `node "$TANTO/scripts/passage-check.js"`
(Node 22 or newer) for `lint`, `replay`, `diff` and `verify`, and — from batch
A onward — for `sections`, `frame` and `boundary`; `node --test` on the pinned
Node 22 through `mise x node@22`; `pre-commit` through `./scripts/lint.sh`
(Windows: `scripts\lint.bat`); `git diff` against the base derived below,
`git ls-files --eol`, and `grep -rn` / `grep -rcF` for the sweeps.

**Spec:** `docs/superpowers/specs/2026-09-12-tanto-cost-design.md`

## Global Constraints

Built from `AGENTS.md`, the spec's Fixed inputs, and `tanto.json`. Every batch
prompt restates these; trust the prompt over recollection.

### The shell

**Every fenced block in this plan runs in Git Bash.** The host's primary shell
is PowerShell, where a POSIX `grep -c '...'` with single quotes is unrunnable.
Every dispatch says so. Where a step names `./scripts/lint.sh`,
`scripts\lint.bat` with the same arguments is the Windows equivalent and is run
from PowerShell or `cmd`.

### Repository rules

- American English for everything in the repo — code, messages, comments, docs,
  commits, branch names.
- Run `./scripts/lint.sh` on the changed paths, **each named individually**. A
  directory argument makes every hook skip and proves nothing.
- Commit by explicit path with `git commit --only <paths>`; the index is
  shared. This plan creates five tracked files, and each of the three tasks
  that creates one runs `git add <path>` first — `--only` cannot pick up an
  untracked path.
- Every commit message ends with a `Co-Authored-By:` trailer identifying the
  agent. Two identities coexist in practice and both satisfy `AGENTS.md`, so
  **the check greps the prefix `Co-Authored-By: Claude`, per commit, in a
  loop** — an aggregate `grep -c` over the branch counts trailer lines, so a
  commit carrying two and a commit carrying none balance out.
- Never `git add -A`, `.`, or `-u`; never a bare `git commit`; never
  `git commit -a`. Never amend a published commit. Never push to `origin/main`.
  Never bypass a hook (`--no-verify`, a `core.hooksPath` override).
- Do not edit agent instruction files, repo-root Markdown, or linter/formatter
  configuration. This plan touches none of them: `.markdownlint-cli2.yaml` and
  `.gitattributes` are read by it and written by nobody.

### Models

From `tanto.json`, and from its `subagents` keys alone. **This run's sessions
read the skill as it stands at the plan's landing, so the kinds they dispatch
are today's five, not the twelve this plan lands** (spec section 12). Every
`subagents` key this run uses is a built-in default; nothing in the personal
file at `$CLAUDE_CONFIG_DIR/tanto.json` overrides one, so the table below holds
for every batch. The `sessions.<role>` keys are a different mechanism —
advisory, checked only by a session's own start sequence and Kanri's handshake
— and they are the human's to place and remove as a stage needs them; this
section names none.

| Dispatch | Model |
| --- | --- |
| implementer, fix rounds 1-3 | `sonnet` |
| task reviewer, scoped re-review, whole-branch review | `opus` |
| fix rounds 4-5 | `opus` |
| anything else | `sonnet` |

**Every dispatch names a `model`.** An omitted `model` inherits the session's,
which on Jisso is `sonnet` and on Kanri is `sonnet` — and on the Sekkei that
wrote this plan is the strongest family, which is the failure the rule prevents.

**No dispatch of this run names a `subagent_type` from the twelve
definitions.** They do not exist on this machine until task 23 writes them, and
a session that started before they were written cannot see them in any case
(spec Fixed input 6). The definitions are this plan's product, not its tooling.

### `$TANTO`

`$TANTO` is the tanto skill's own directory, which the harness names when it
invokes the skill. It is set **in the same tool call as the command that uses
it**; shell state does not persist between calls, and an unset variable makes
the command read a path at the filesystem root. In this repository the skill is
linked into the working tree at `skills/tanto`, so `TANTO=skills/tanto` is the
form every command in this plan spells.

### The created paths

Five tracked files, created by three tasks of batches A and D. `diff` exempts a
`created:` path from its added-line check, because there is no base blob for a
passage to be measured against:

```text
created: skills/tanto/templates/agent.md
created: skills/tanto/roles/keikaku.md
created: skills/tanto/roles/kikaku.md
created: skills/tanto/roles/hosa.md
created: skills/tanto/templates/kikaku-decision.md
```

Task 23 writes twelve more files **outside the working tree**, into
`~/.claude/agents/`. They are personal configuration beside `tanto.json`, not
repository state (spec Fixed input 6), `git` never sees them, and no other task
of this plan writes anything outside the tree.

**A created path carries no anchor step, and that is the instrument's limit
rather than a choice.** `replay` builds its list of base blobs from every block
that names a path and is not a `W`, so an `A` block on a file that does not
exist at the base makes the whole dry run exit 2 —
`fatal: path '…' does not exist in '<base>'` — before a single check runs
(measured 2026-09-13 on this plan's own assembly). The five tasks that create a
file therefore verify it with an ordinary fenced `grep -cF` step instead, on the
same needle an anchor would have used: `replay` runs that command against the
applied tree, which *does* hold the `W` file, and the boundary runs it for real.
The one-line fix belongs in `replayPlan`, which the spec's Out of scope keeps
this plan away from; it goes to Kanri as a shoroku candidate instead.

### `diff`'s base is the last commit before task 1, not the merge base

The branch `tanto-cost` already carries six commits over `main` that no task of
this plan wrote — the spec, its revisions, an issue filed mid-dialogue, T1, and
the spec Sekkei's exit shoroku — and more will land before the plan closes.
`diff` is unscoped by path, so every added line of those commits would read as
`unaccounted-added` at every boundary.

**No commit hash is written here.** A hash in tracked content goes stale the
first time the branch is rebased. The base is derived instead, and the
derivation holds because **no commit before task 1 touches any path this plan
writes** (measured 2026-09-13: `git log main..HEAD -- skills/tanto
skills/shoroku docs/notes` is empty), and decision-2f36's hotfix lane is closed
for every `skills/tanto/` file while this plan is in flight, because the plan
lists them all:

```bash
BASE="$(git log --format=%H --reverse main..HEAD -- skills/tanto skills/shoroku docs/notes | head -1)^" && echo "$BASE"
```

That is the parent of task 1's first commit. It resolves to nothing until task
1 has committed, which is correct: `diff` runs at a boundary, after commits.

**Kanri records the resolved value in the ledger at the first boundary, and
every batch prompt carries it. A later re-derivation that yields a different
hash — or nothing — is a stop, not a recompute.** `main..HEAD` is re-evaluated
every time the command runs: a commit touching one of those three paths landing
on `main` mid-plan moves the first commit in the range, and a `main`
fast-forwarded past this branch empties it. Neither should happen, but "should
not" is not a check, and a base that moves silently turns `diff` into a check
that passes for the wrong reason.

**One class of line will show up in `diff` and is not a defect.** A
`docs: exit shoroku …` or `docs: T<n> shoroku …` commit that lands after the
base — a role leaving at a boundary, T2 at the close — writes under `docs/`
outside this plan's one `docs/` path, and its lines are `unaccounted-added`
because no block quotes them. Kanri places each against the commit that wrote
it. The check's subject is `skills/tanto/`, `skills/shoroku/` and
`docs/notes/tanto-consistency-checks.md`; a line outside those three,
attributable to a shoroku commit, is noise, and a line **inside** them that no
block explains is the defect the check exists for.

### Batch A's implementation lines are `unaccounted-added`, and that is stated, not hidden

`diff` accounts for an added line by finding it quoted somewhere in the plan.
Batch A's three tasks are test-first: the plan quotes every **test** verbatim,
so those lines are accounted for, and it does **not** quote the implementation
of `sections`, `frame` and `boundary`, which is the implementer's to write
against a stated interface. Every line of that implementation is therefore an
`unaccounted-added` line at batch A's boundary and at every boundary after it.

**The rule at batch A's boundary, and at every later one:** an
`unaccounted-added` line is accepted only when its path is
`skills/tanto/scripts/passage-check.js`; anywhere else it is the defect the
check exists for. The evidence that those lines are right is not `diff` — it is
the test suite the plan quotes, which fails before them and passes after, and
which runs at every later boundary too.

The alternative — quoting the implementation in the plan — was rejected: it
makes the implementer a transcriber of code no one has run, and a plan that
carries unrun code in a fence is the "placeholder in a command's shape" this
repository already has a rule against. The right fix is an `exempt:` or
`rewritten:` declaration for `diff`, which is issue-4eef and is out of this
plan's scope by the spec's own Out of scope; this plan states the rule in prose
instead, and the exit shoroku carries what it cost.

### The commands `replay` does not run

`replay` reads this list the way it reads `created:`. Declared once here rather
than marked line by line:

```text
replay-skip: ./scripts/lint.sh — pre-commit needs the repository and its hook cache, which the applied tree is not
replay-skip: mise x node@22 — the test suite is run against the real repository's Node toolchain, not a scratch tree
replay-skip: node --test — the applied tree carries the instrument's blobs but not its node_modules or its runner's cwd assumptions
replay-skip: .tanto/ — the topic's state is the working tree's, and an applied copy of the plan's blobs has no such directory
replay-skip: ~/.claude/agents — task 23 writes outside the repository, which a replay of this plan's passages does not test
replay-skip: passage-check.js diff — diff's subject is this branch's history, which the applied tree is not; verify is skipped by the script's own rule, diff is not
replay-skip: passage-check.js boundary — boundary runs this plan's own verification commands; running them inside a replay of the same plan is a loop, not a test
replay-skip: git log --format=%H --reverse — the base derivation reads the branch history, which the applied tree does not have
replay-skip: $(git ls-files — a sweep scoped by the repository's own file list, which the applied tree, not being a git repository, cannot produce
replay-skip: frame-awk.sh — task 2 compares the new frame against the awk over every plan in docs/superpowers/plans/, which the applied tree does not carry
```

`git` and `passage-check.js verify` are skipped by the script's own rules and
need no declaration. **That built-in pair is load-bearing here**, because
`boundary` does not inherit it (task 3): a `git`-first command and a `verify`
invocation are skipped in a scratch tree and run in the working tree, which is
exactly what the two boundary checks that use them need.

**Two patterns a first draft of this list carried are deliberately absent.**
`uv run` would have removed the frontmatter load from the boundary as well as
from the replay — and the applied tree does carry both `SKILL.md` blobs, so the
load is a real check there. `2026-09-12-tanto-cost.md` would have removed every
command that names the plan, which is `verify` and `diff` — the two the boundary
exists to run; what it was there to protect, task 22's sweep of a needle file
under `.tanto/`, the `.tanto/` pattern already covers. A skip pattern that names
a **filename** matches almost every command a plan runs, and that is the shape
to avoid.

**The whole-tree sweeps are deliberately *not* skipped.** Every file that
carries an `O` needle also carries a passage, so `replay`'s applied tree holds
the same text the real tree will hold after the plan; running the sweeps there
is a real test of the expected counts rather than noise.

### The tree encoding and line endings this work must preserve

Measured in this repository on 2026-09-13. `.gitattributes` carries
`* text=auto`, with `eol=lf` for `*.sh` and the JavaScript and JSON family and
`eol=crlf` for `*.bat`. Every Markdown file this plan touches reports
`i/lf w/crlf attr/text=auto` under `git ls-files --eol` — index LF, working
tree CRLF, nothing mixed. `skills/tanto/scripts/passage-check.js`,
`passage-check.test.js` and `templates/tanto.json` report `i/lf w/lf`.

- Read as UTF-8 and normalize CRLF to LF before any comparison, search, or line
  count. A block written LF against a file checked out CRLF never matches, and
  the failure looks like a missing passage.
- Write each passage with the target file's own ending, and use an edit tool
  that rewrites only the lines you name rather than one that rewrites the whole
  file.
- A file whose endings are mixed is reported, never silently normalized.
  `git ls-files --eol` decides, before and after — never a grep for a control
  character. `w/mixed` on any path is a failure.
- A **created** file inherits the ending its extension's attribute gives it:
  the four new Markdown files are written LF in the index and appear CRLF in
  the working tree, like every other Markdown file here. Check each with
  `git check-attr text --` before the commit and `git ls-files --eol` after.

### Rule 11 — the authority for this run's sessions, and where a role may be started

This plan edits `skills/tanto/` files that the run's own sessions read, and
this repository links the skill into the working tree, so a session started
mid-plan reads whatever is on disk at that moment. **Until batch F's boundary,
the authority for every session of this run is this Global Constraints section,
Kanri's orders line, and the batch prompts — not the role text on disk.** Kanri
records that as a ruling when the plan lands, and every batch prompt and any
handover file carries it.

**The replacement boundary is batch F's — the final one.** It is not a choice
of caution: `SKILL.md` names seven roles from batch B onward, and three of the
role files those names point to land in batch D; `roles/kanri.md` dispatches
`plan.coldread` from batch C, and the `tanto.json` that carries the kind landed
in batch A while the `shoroku` feature that kind calls lands in batch F. At
every boundary before F, some file of the skill contradicts another, which is
exactly the half-edited skill rule 11 exists for. So:

- No role of this run is replaced, and no further role is created, before batch
  F's boundary.
- The two standing exceptions hold. **Kanri's own handover proceeds when it is
  due**, and its successor takes this authority sentence from the handover file
  rather than from the tree. **A Kaiseki, if one is needed**, is a Kanri ruling
  recorded as `R-n`, made with the half-edited skill in view; its brief says
  which text it must not trust.
- The sweep that shows F is the boundary: every term a later batch lands is
  greppable in this plan's own new-passage blocks, and the plan review's item 3
  runs it. It is stated here as a property, not as a promise.

**This run's own sessions run on the skill as it stands today**: the review
brief is Kanri's dispatch, an exiting session writes out its own accepted
subset, the kinds are the five of the Models table above, and `/tanto resume`
is the resume word. The batch prompts say so.

### The workspace

**No worktree.** All roles share the working tree and the branch `tanto-cost`,
cut from `main` at the tanto-workspace T2 head. Kanri verifies the tree in place
and the human can watch it. The merge decision is the human's.

---

## File structure

Twenty-one paths carry a block, and the table says which task lands each and in
which batch. It is the plan's own copy of what `.tanto/tanto-cost/plan-map.md`
records for the drafting; the map is untracked and this is not.

| Path | Task | Batch | What changes |
| --- | --- | --- | --- |
| `skills/tanto/scripts/passage-check.js` | 1, 2, 3 | A | three new subcommands, and one passage on the usage line |
| `skills/tanto/scripts/passage-check.test.js` | 1, 2, 3 | A | the tests for them, quoted verbatim in the plan |
| `skills/tanto/templates/tanto.json` | 4 | A | replaced whole: seven sessions, twelve kinds, `{model, effort}` |
| `skills/tanto/templates/agent.md` | 4 | A | **created** — the definition template the roles render |
| `skills/tanto/SKILL.md` | 5, 6, 7, 8 | B | the contract: the seats, the config, the handshake, the exit, the rules |
| `skills/tanto/roles/kanri.md` | 9, 10, 11, 12 | C | every section; the cold read, the boundary, the shoroku flow, the lifecycle |
| `skills/tanto/roles/sekkei.md` | 13 | D | narrowed to the spec and its review |
| `skills/tanto/roles/keikaku.md` | 14 | D | **created** — the plan seat |
| `skills/tanto/roles/kikaku.md` | 15 | D | **created** — the human's consultation seat |
| `skills/tanto/roles/hosa.md` | 15 | D | **created** — the chores seat |
| `skills/tanto/templates/kikaku-decision.md` | 15 | D | **created** — Kikaku's output template |
| `skills/tanto/roles/jisso.md` | 16 | E | the four `task.*` kinds, the definitions, T2 as a proposal only |
| `skills/tanto/roles/kaiseki.md` | 16 | E | its exit, and its `default` key |
| `skills/tanto/templates/kanri.md` | 17 | E | the ledger: the recommendation, the placeholders, the measurements |
| `skills/tanto/templates/roster.md` | 17 | E | the columns, the statuses, the keeping rule |
| `skills/tanto/templates/kanri-handover.md` | 18 | E | In flight per open ledger, the Residency row, the kinds |
| `skills/tanto/templates/batch-prompt.md` | 18 | E | the Models line |
| `skills/tanto/templates/review-brief.md` | 18 | E | the author dispatches the brief |
| `skills/tanto/README.md` | 19 | E | seven roles, the two seats, `fukki`, the new flow |
| `skills/shoroku/SKILL.md` | 20 | F | the recommend and apply halves, and three re-scoped rules |
| `skills/shoroku/README.md` | 20 | F | one bullet naming the two halves |
| `docs/notes/tanto-consistency-checks.md` | 21 | F | checks 1, 3, 6, 7, 8 amended and check 16 added |

Tasks 22 and 23 carry no path: task 22's deliverable is the recorded output of
the old-value sweep and the note's checks, and task 23's is twelve files
outside the working tree and four harness measurements.

Five templates are named nowhere above because the plan does not touch them —
`batch-report.md`, `bug-report.md`, `kaiseki-brief.md`, `kaiseki-report.md` and
`roster-archive.md` — and neither does it touch anything under `docs/` but the
consistency note.

---

## Batches

Six batches, twenty-three tasks. The order is fixed: A's instruments are what
the later boundaries are checked with, B fixes the vocabulary the role files
use, and F closes over everything the others landed.

| Batch | Tasks | Delivers | Stop conditions at the boundary |
| --- | --- | --- | --- |
| A | 1 `sections`; 2 `frame`; 3 `boundary` and the usage line; 4 `templates/tanto.json` and `templates/agent.md` | the three subcommands, tested, and the two config templates — nothing that any role text depends on yet | the test suite passes on the pinned Node; `verify --task 3` and `verify --task 4` clean, and `verify --task 1` and `--task 2` printing `no passages`; `diff` clean **except** added lines in `scripts/passage-check.js`, per Global Constraints; lint clean on the five changed paths; the JSON parse of `templates/tanto.json` printing `tanto.json ok 7 12` |
| B | 5 the seven roles in `SKILL.md`; 6 the config, the definitions, the limit rule; 7 the handshake, the roster, Messages, Human access; 8 Session exit, Artifacts, Workspace, Rules | the contract, whole and self-consistent | `verify --task 5..8` clean; `diff` clean under the batch A rule; lint clean; the frontmatter loads through a real YAML parser; **`boundary --plan` runs here for the first time** — the instrument's own first measurement, and its output is read, not trusted |
| C | 9 Start and On a handshake; 10 When the plan lands, the batch loop, the final batch; 11 the Kaiseki branch, Handover, Shoroku; 12 Bug intake and Limits, Human access, Session lifecycle | `roles/kanri.md`, agreeing with the contract batch B landed | `verify --task 9..12` clean; `diff` clean under the batch A rule; lint clean; no `O` needle of entities 6, 8, 9, 10, 11 and 19 left in `roles/kanri.md` |
| D | 13 `roles/sekkei.md` narrowed; 14 `roles/keikaku.md`; 15 `roles/kikaku.md`, `roles/hosa.md`, `templates/kikaku-decision.md` | the spec-and-plan split and the two seats outside the lifecycle | `verify --task 13..15` clean (tasks 14 and 15 report `no passages`, which is a result); `diff` clean under the batch A rule, the four created paths exempt; lint clean; `git ls-files --eol` showing `i/lf w/crlf` on each created file |
| E | 16 `roles/jisso.md` and `roles/kaiseki.md`; 17 `templates/kanri.md` and `templates/roster.md`; 18 the handover, batch-prompt and review-brief templates; 19 `README.md` | the executor seats, the templates, and the file a newcomer reads | `verify --task 16..19` clean; `diff` clean under the batch A rule; lint clean; the Residency header row identical in `templates/roster.md` and `templates/kanri-handover.md` |
| F | 20 `skills/shoroku/`; 21 the consistency note; 22 the `O` sweep and the note's checks 1 to 9; 23 the dogfood | the composed skill's two halves, the standing checks, and the proof | **the replacement boundary opens here**; `verify --task 20..21` clean; `diff` clean under the batch A rule; lint clean; all 64 `O` needles at their stated disposition with the hits printed; the note's checks 1 to 9 and 16 run with their output recorded; the dogfood's four measurements recorded as the harness printed them |

**Batch internal order.** A is sequential: tasks 1, 2 and 3 each add a
subcommand to one file and task 3's passage names all seven, so it runs last of
the three; task 4 is independent of the other three. B, C and E are sequential
by file region — several tasks edit one file, and a passage is measured against
the file as the previous task left it. D's task 13 and task 14 are a pair: 13
removes what 14 carries, and the two land in the same batch so that no boundary
sits between them. F is sequential: 22 sweeps what 20 and 21 finish, and 23
needs `templates/agent.md` from batch A and nothing else.

**No planned replacement before F.** One Jisso carries A to E. If its reading
shows a compaction, decision-6dea's replacement waits for batch F's boundary
like any other, and Kanri records the wait as a ruling — the plan's own rule 11
section is why.

**Two tasks are a sweep-and-check shape**, and are called out because their
size is the data issue-7281 asks for, not because anything is wrong with them:

- **Task 22** — its deliverable is recorded output; it modifies nothing, and
  "it changed a tracked file" is its failure condition.
- **Task 23** — the same, plus twelve files written outside the working tree
  and four measurements that need the human's hands.

Both dispatches tell the reviewer to **re-run** the commands rather than read
the report, per the consistency note's check 14. The context-cost run measured
this shape at 1.93× the median implementer and 1.39× the median reviewer; the
tanto-workspace run measured the same shape at roughly a mid-sized passage task
in both seats. Expect either, and record which.

---

## How a batch is verified

Named by name, and split by **who runs it**, because the two readers are not
the same. `boundary --plan` runs every fenced `bash` or `console` block under
this heading and judges each by its exit status; Kanri runs three more commands
by hand, because `boundary` cannot run them or cannot compare their output.
Every command runs in Git Bash from the repository root, and the implementer
records its output before and after — the output is the evidence
subagent-driven development asks for.

Three properties every fence below has, and every fence a later revision adds
must have:

- **It opens at column 0.** `extractCommandFences` anchors an opening fence at
  the start of a line, so a fence indented inside a numbered list item is
  invisible to `boundary` and to `replay` alike. Measured on this plan on
  2026-09-13, before this section was rewritten: 148 fences at column 0, 9
  indented, and **0 found under this heading** — `boundary` would have printed
  one built-in check and exited 0 at every boundary. The prose of a check is
  therefore a paragraph and its command a top-level fence, never a list item.
- **It exits non-zero when it fails.** `boundary` judges by exit status. A
  `for` loop's status is its last iteration's and a `printf` loop's is always
  0, so neither can fail; each loop below carries `|| exit 1` inside its body.
- **It is not matched by a `replay-skip` pattern.** Those patterns are written
  for `replay`'s scratch tree, and `boundary` honours them too (spec 8.3), so a
  pattern that names a filename or a tool removes the check from the boundary
  as well. The list in Global Constraints was narrowed to the task-step
  commands for exactly this reason; `git`-first commands are skipped by
  `replay`'s own built-in rule, which `boundary` does not inherit, and that is
  the mechanism this section relies on.

**`boundary --plan` is itself named in the Batches table and never fenced
here.** It runs the fences under this heading; a fence that invoked it would
make it run itself, once per nesting level, forever.

### What `boundary --plan` runs

`git status --porcelain` is `boundary`'s own built-in first check — pass when
empty — and is not repeated below. Then, in this order:

**1. Every commit of this batch carries its trailer.** First, because spec 7.3
puts `git status` and the trailers first, and because it is a check that can
pass.

```bash
git log --format=%H main..HEAD -- skills/tanto skills/shoroku docs/notes | while IFS= read -r c; do git log -1 --format=%B "$c" | grep -q 'Co-Authored-By: Claude' || { printf 'missing trailer: %s\n' "$c"; exit 1; }; done && echo "every commit of this plan carries its trailer"
```

Expected: `every commit of this plan carries its trailer`. The range is scoped
to the three paths this plan writes, so it is exactly the plan's own commits —
no commit before task 1 touches any of them (measured 2026-09-13) — and Sekkei's
commit of the plan itself, under `docs/superpowers/`, is outside it. The check
is a loop, so it carries its own `exit 1`.

**2. Every task's passages are still where the plan says.** One invocation per
task landed so far; the list is the batch's own, and the line below is batch
B's.

```bash
TANTO=skills/tanto && for t in 5 6 7 8; do node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task "$t" || exit 1; done
```

Expected: `task <n>: verify clean` for every task carrying a passage, and
`task <n>: no passages` for tasks 1, 2, 14, 15, 22 and 23, which carry none — a
result, not a failure, and one `verify` reports with exit 0.

Six of the twenty-three tasks carry no `P` block, for three different reasons,
and this loop is where they are checked rather than in their own sections:
tasks 1 and 2 are code with their tests quoted; tasks 14 and 15 create files,
which `verify` has nothing pre-existing to measure and which their own
`grep -cF` steps check; tasks 22 and 23 write nothing at all. A task in that
list whose `verify` ever prints anything but `no passages` has gained a passage
nobody declared, which is a stop.

**3. The JSON this plan writes parses, and says what it should** — from batch A
onward.

```bash
node -e 'const t=require("./skills/tanto/templates/tanto.json");const r=Object.keys(t.sessions),k=Object.keys(t.subagents);if(r.length!==7||k.length!==12)process.exit(1);for(const m of [t.sessions,t.subagents])for(const v of Object.values(m))if(!v.model||!v.effort)process.exit(1);console.log("tanto.json ok",r.length,k.length)'
```

Expected: `tanto.json ok 7 12`.

**4. Both skills' frontmatters load through a real parser** — from batch B on.
This is the one failure mode a Markdown linter cannot see, and that a
`description` carrying a colon and a space produces silently.

```bash
uv run --no-project --with pyyaml python -c "import pathlib,re,yaml;d=[yaml.safe_load(re.match(r'(?s)\A---\n(.*?)\n---\n', pathlib.Path(p).read_text(encoding='utf-8')).group(1)) for p in ['skills/tanto/SKILL.md','skills/shoroku/SKILL.md']];assert all(': ' not in x['description'] for x in d);print('frontmatter ok', len(d[0]), len(d[1]))"
```

Expected: `frontmatter ok 3 2` — three keys in tanto's frontmatter
(`argument-hint`, `description`, `name`), two in shoroku's (`description`,
`name`), and no colon-and-space inside either `description`. Three things make
this the shape a boundary check wants: a `yaml.safe_load` that cannot parse
raises, the `assert` fails on the silent-frontmatter-break case, and the output
is **one short line the expectation quotes literally** — `boundary` compares
output against this paragraph as a substring, so a prose expectation reports a
difference even when the check passed.

### What Kanri runs by hand, at every boundary

Three commands, named here and repeated in the Batches table's stop
conditions. Each is outside the fenced set for a stated reason, and none is
optional.

**Lint, on every changed path, each named individually:**
`./scripts/lint.sh <path> [<path> ...]`. Expected: exit 0, none `Failed`. It is
not a fence because the paths differ per batch and a fence cannot carry a
placeholder; `replay` cannot run it either, since pre-commit needs the
repository and its hook cache. For the six template paths the hooks that decide
the step are trailing whitespace, end-of-file and mixed line ending —
`.markdownlint-cli2.yaml` ignores `skills/tanto/templates/**`, so markdownlint
does not see them. For `SKILL.md`, the seven role files, `README.md`, both
`skills/shoroku/` files and the note, markdownlint runs.

**The unaccounted-line check**, which spec 7.3 makes the second of Kanri's two
boundary commands rather than one of the plan's own checks:

```text
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" diff --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --base "$(git log --format=%H --reverse main..HEAD -- skills/tanto skills/shoroku docs/notes | head -1)^"
```

Expected: `5 paths exempt as created:` followed by `diff: clean`, or only
`unaccounted-added` lines whose path is
`skills/tanto/scripts/passage-check.js`, or lines attributable to a
`docs: exit shoroku` / `docs: T<n> shoroku` commit under `docs/` outside this
plan's paths. Any other line is a defect. **This is Kanri's to read, not
`boundary`'s to judge**: `diff` exits 1 on any unaccounted-added line, and this
plan states that batch A's implementation lines are exactly that at every
boundary from A onward, so an exit-status reader would print `fail` on a correct
boundary — the "red by design" failure this plan rejects elsewhere. The fence is
`console` rather than `bash` for the same reason it sits here: it documents a
command a human runs and reads.

**The instrument's own tests**, on the pinned Node:

```text
mise x node@22 -- node --version && mise x node@22 -- node --test skills/tanto/scripts/passage-check.test.js
```

Expected: a `v22.` version line, then every test passing. The version is part
of the result: the machine's own `node` is newer, so a claim about the pinned
floor is a run, not an assertion. It is outside the fenced set because
`replay`'s skip list must keep it out of a scratch tree that carries no test
file, and one marker cannot mean two things — the collision spec 8.3 creates
between `replay`'s subject and `boundary`'s, which this plan works around here
and records as a shoroku candidate.

Both commands above sit in a `text` fence, not a `bash` or `console` one:
`extractCommandFences` collects **both** of those info strings, so a `console`
fence under this heading is a check `boundary` picks up — which is exactly what
these two must not be. The fence type is the mechanism that keeps Kanri's
hand-run commands out of the instrument's list.

## The closing checks

Run once, at batch F's boundary, by tasks 22 and 23: the 64 `O` needles and
their three allowlisted survivors, the consistency note's checks 1 to 9 **and
its new check 16**, and the dogfood's four harness measurements. They are
listed in those tasks rather than here because each becomes true only when the
batch that lands it has landed, and `boundary --plan` compares a command's
output against one stated expectation. The spec's Verification section names
them; tasks 22 and 23 are where they are named as commands with values.

---

### Task 1: `sections`

**Batch:** A. **Blocks:** none. This task and task 2 add the two reading
instruments the role files start calling in a later batch; `boundary` and the
usage line that names all seven subcommands follow in task 3.

`sections --file <path> <heading> [<heading>...]` prints, for each named
heading, the heading line and the body down to the next heading of the same or
higher depth, in the order the names were given (spec 8.1). Every report,
proposal, recommendation, direction, review and brief this skill writes has a
fixed skeleton, so a reader can name the sections it needs instead of taking
the file whole, which is the reading this design is buying. A name that
matches no heading prints one line `no section <heading>` to stderr and exits
`1` **after** the rest is printed, so a caller that names five sections still
gets the four that exist. Matching is on the heading text after the `#` marks,
exact and trimmed.

The task is written test-first: step 1 appends the tests, step 3 writes the
code against the interface below. Spec 11.7 is the change list for both files;
fixed inputs 1 and 16 put the three instruments in scope.

**Files:**

- Modify: `skills/tanto/scripts/passage-check.js` — `sectionsOf` and the four
  helpers it shares with task 2, `runSections`, the `sections` dispatch entry,
  the `file` option on `parseArgs`, and the `module.exports` addition.
- Modify (test): `skills/tanto/scripts/passage-check.test.js` — append this
  task's seven tests, their one fixture, and one helper: `runStreams`, which
  keeps stdout and stderr apart where the file's own `run` concatenates them.

**Interfaces:**

- Consumes, from the file as it stands: `normalize(text)`; `toLines(text)` →
  `{ lines, trailingNewline }`; and `main(argv)`'s `parseArgs` dispatch, which
  gains `file: { type: "string" }` and a `sections` entry passing
  `parsed.positionals.slice(1)` as the heading list. Not `parsePlan` and not
  `readFence`: a report is not a plan, and this subcommand never parses one.
- Produces, for task 2, four file-local helpers: `headingOf(line)` →
  `{ depth, text }` or `null`; `fenceFlags(lines)` → a `boolean[]` marking the
  lines inside a fenced block at any backtick count, exactly as `parsePlan`
  already marks them, so that a `#` line inside a fence is never read as a
  heading; `findSection(lines, inFence, name)` → the index of the first
  heading whose text is `name`, or `-1`; and
  `sectionEnd(lines, inFence, start)` → the index one past the section headed
  at `start`.
- Produces, exported: `sectionsOf(text, headings)` → `{ output, missing }`,
  `output` the lines to print in the order the names were given and `missing`
  the names that head no section. Add `sectionsOf` to `module.exports`.
- **The `USAGE` constant is not this task's.** It still lists the four
  subcommands it lists today; the line that names all seven is a single
  passage of task 3. Do not edit it here, do not assume it names `sections`,
  and write no test that asserts what it lists.
- markdownlint lints neither path: both are JavaScript, so the hook that
  decides this task's lint step is the biome one.

#### Steps

- [ ] **Step 1: Append the failing tests**

Append this, verbatim, to `skills/tanto/scripts/passage-check.test.js`. The
fixture is a report skeleton — two depth-2 sections with a deeper one inside
the first — because that is the shape of every document this subcommand is
built to read. The block also adds `runStreams`: the file's own `run` helper
concatenates stdout and stderr, which cannot tell the two apart, and one of
the seven tests is about exactly that.

````js
const { sectionsOf } = require("./passage-check.js");

// A report skeleton: two depth-2 sections with a deeper one inside the first,
// which is what every tanto report, brief and proposal looks like.
const REPORT = [
  "# Batch A report",
  "",
  "Preamble prose no reader names.",
  "",
  "## For Kanri",
  "",
  "The batch landed.",
  "",
  "### Deviations from the plan",
  "",
  "None.",
  "",
  "## Rulings",
  "",
  "One ruling needed.",
  "",
  "## Questions for the human",
  "",
  "Nothing blocking.",
];

test("sections prints a section's heading and body down to the next heading of the same depth", () => {
  const file = writePlan(REPORT);
  const result = run(["sections", "--file", file, "Rulings"]);
  assert.strictEqual(result.code, 0);
  assert.strictEqual(result.out, "## Rulings\n\nOne ruling needed.\n\n");
});

test("a deeper heading is body, and a deeper section ends at the next shallower heading", () => {
  const file = writePlan(REPORT);
  const whole = run(["sections", "--file", file, "For Kanri"]);
  assert.strictEqual(whole.code, 0);
  assert.match(whole.out, /### Deviations from the plan/);
  assert.match(whole.out, /None\./);
  assert.doesNotMatch(whole.out, /## Rulings/);

  const deeper = run(["sections", "--file", file, "Deviations from the plan"]);
  assert.strictEqual(deeper.code, 0);
  assert.strictEqual(deeper.out, "### Deviations from the plan\n\nNone.\n\n");
});

test("sections prints the named sections in the order the arguments give, not the file's", () => {
  const file = writePlan(REPORT);
  const result = run(["sections", "--file", file, "Questions for the human", "Rulings"]);
  assert.strictEqual(result.code, 0);
  assert.ok(
    result.out.indexOf("## Questions for the human") < result.out.indexOf("## Rulings"),
    "expected the argument order, not the document order",
  );
});

test("a name that matches no heading exits 1 after the rest is printed, naming it on stderr", () => {
  const file = writePlan(REPORT);
  const result = run(["sections", "--file", file, "Rulings", "Shoroku candidates", "Questions for the human"]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /^no section Shoroku candidates$/m);
  assert.match(result.out, /One ruling needed\./);
  assert.match(result.out, /Nothing blocking\./);

  const direct = sectionsOf(fs.readFileSync(file, "utf8"), ["Rulings", "Shoroku candidates"]);
  assert.deepStrictEqual(direct.missing, ["Shoroku candidates"]);
  assert.deepStrictEqual(direct.output, ["## Rulings", "", "One ruling needed.", ""]);
});

// `run` above concatenates the two streams, so it cannot tell a `no section`
// line written to stdout from one written to stderr -- the distinction spec
// 8.1 makes, and the one that matters: a caller is reading the printed
// sections out of stdout, and an error line there lands inside the body it is
// reading.
const { spawnSync } = require("node:child_process");

function runStreams(args) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" });
  return { code: result.status, stdout: result.stdout, stderr: result.stderr };
}

test("the no-section line goes to stderr, never into the stdout a caller is reading", () => {
  const file = writePlan(REPORT);
  const result = runStreams(["sections", "--file", file, "Rulings", "Shoroku candidates"]);
  assert.strictEqual(result.code, 1);
  assert.match(result.stderr, /^no section Shoroku candidates$/m);
  assert.doesNotMatch(result.stdout, /no section/);
  assert.strictEqual(result.stdout, "## Rulings\n\nOne ruling needed.\n\n");
});

test("the heading text is matched exactly and trimmed, never as a substring", () => {
  const file = writePlan(REPORT);
  const result = run(["sections", "--file", file, "Kanri"]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /no section Kanri/);
  assert.strictEqual(run(["sections", "--file", file, "  For Kanri  "]).code, 0);
});

test("sections exits 2 when no heading is named, and when the file cannot be read", () => {
  const file = writePlan(REPORT);
  const noHeading = run(["sections", "--file", file]);
  assert.strictEqual(noHeading.code, 2);
  assert.match(noHeading.out, /Usage:/);
  const missing = run(["sections", "--file", path.join(os.tmpdir(), "passage-check-absent", "report.md"), "Rulings"]);
  assert.strictEqual(missing.code, 2);
});
````

- [ ] **Step 2: Run the tests and watch the new ones fail**

```bash
mise x node@22 -- node --test skills/tanto/scripts/passage-check.test.js
```

Expected: every test the file already carried still passes, and the first six
new ones fail because `sections` is not yet a subcommand.

The seventh — the exit-2 one — passes before a line of `sections` is written,
and that is worth reading before you run this step rather than after. Both of
its cases are **error** outcomes, and an argument vector whose subcommand does
not exist already takes the same path: exit `2` with the usage line. It is
there to hold those two exit codes once the subcommand exists — a `sections`
that accepted no heading, or swallowed an unreadable file, would fail it then
— not to go red now. The other six each assert printed output only an
implemented `sections` produces, so they are the red step this task actually
has.

- [ ] **Step 3: Write `sections` in `skills/tanto/scripts/passage-check.js`**

Add the four helpers, `sectionsOf`, `runSections`, the `file` option and the
dispatch entry, against spec 8.1 and the interface above. The implementation
is deliberately not transcribed here: the tests of step 1 are what decides
whether it is right, and a transcription would only duplicate them. Five
points they pin:

- a heading is `#{1,6}` followed by at least one space; its **text** is what
  follows, trimmed, and a name is matched against that text exactly. No
  prefix, no substring, no case folding;
- a section ends at the next heading of the **same depth or higher** — a
  deeper heading is part of the body — or at the end of the file;
- `fenceFlags` is the same reading of a fenced block `parsePlan` already
  takes, and for the same reason: a `#` line inside a fence is a line of code,
  not a heading, and a report that quotes a shell comment must not lose its
  section boundary to it;
- the order of `output` is the order of the arguments, not of the document,
  and a name that heads more than one section takes the first;
- every named section is printed **before** any `no section <heading>` line,
  and that line goes to **stderr** — never to stdout, which is the section
  text the caller is reading and must stay free of the instrument's own
  complaints. The exit code is `1` when at least one name was missing and `0`
  otherwise, and a missing `--file`, an empty heading list or an unreadable
  file is `2`.

- [ ] **Step 4: Run the tests and watch them pass**

```bash
mise x node@22 -- node --test skills/tanto/scripts/passage-check.test.js
```

Expected: every test passes, `# fail 0`.

- [ ] **Step 5: Lint**

```bash
./scripts/lint.sh skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js
```

Expected: exit 0, the biome hook appearing as **run** — `Passed` — and none
`Failed`. A lint where every hook reports `(no files to check) Skipped`
proves nothing; stop and report that instead.

- [ ] **Step 6: Check the line endings, then commit**

```bash
git ls-files --eol skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js
git commit --only skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js -m "feat(tanto): passage-check sections prints a document by named section" -m "Every report, proposal, recommendation, direction, review and brief this skill writes has a fixed skeleton, so a reader can name the sections it needs instead of taking the file whole. sections --file prints each named heading and the body down to the next heading of the same or higher depth, in the order the names were given, and exits 1 naming on stderr every heading the file does not carry - after printing the ones it does (issue-2e52)." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

Expected: `i/lf w/lf attr/text eol=lf` on both paths — `.gitattributes` pins
the JavaScript family to `eol=lf`, so neither reads `w/crlf` as the Markdown
paths do, and `w/mixed` is a failure either way. Then the commit succeeds.

- [ ] **Step 7: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 8: Verify**

```bash
mise x node@22 -- node --version && mise x node@22 -- node --test skills/tanto/scripts/passage-check.test.js
```

Expected: a `v22.` line — `v22.23.2` when this task was drafted — followed by
a run in which every test passes, `# fail 0`, the file's existing tests and
this task's seven alike. This task has no `passage-check.js verify` step: it
carries no passages, and its own test file is the check.

**Done when:** the suite passes on the recorded Node 22 version;
`sections --file` prints a named section's heading and body down to the next
heading of the same or higher depth and stops there, prints several in
argument order, exits `1` naming a heading the file does not carry — on
stderr, with stdout carrying nothing but the sections — while still printing
the rest, and exits `2` with the usage line when no heading is named;
lint is clean on both paths with the biome hook run rather than skipped; and
the commit carries its `Co-Authored-By:` trailer.

---

### Task 2: `frame`

**Batch:** A. **Blocks:** none. The command this task writes is what a later
batch's passage puts into `roles/kanri.md` in place of the twenty-line `awk`
program that sits there now.

`frame --plan <path> [--stage 1|2] [--task <N>]` reads a plan the way Kanri
reads one (spec 8.2). A task starts at a heading matching `^##+ Task` at any
depth — issue-ac9d, which the `awk` gets wrong: it recognizes a task only at
three hashes, so of the plans in `docs/superpowers/plans/` it prints three
whole, the three whose tasks sit at two hashes, and collapses the rest. The
spec's `^##+ Task` is one character short of the real form, and the shortfall
is not academic: it matches a `## Tasks` heading too, which every plan in this
repository carries above its tasks, and that heading would then be a depth-2
task swallowing the tasks under it whole. The form is **`Task` followed by a
space and a number**. A task's step region starts at its first
`- [ ] **Step` line and ends at the next heading of the task's depth or
higher; fenced blocks inside a step region are skipped whole, as the `awk`
does, so a `##` line inside one ends neither the region nor the task. With no
`--stage` the output is what the `awk` printed — everything outside the step
regions, each region replaced by `[steps: <n> lines]` — and step 6 measures
that against the `awk` itself, plan by plan. `--stage 1` prints the headings
plus the Global Constraints,
Batches, How a batch is verified and Self-Review sections; `--stage 2` prints
each task's head, from its heading to its first step, with the step count;
`--task <N>` prints that task whole. Sections are found by the headings the
writing-plans skill and `roles/keikaku.md` fix, and a plan that is missing one
of them prints what it has.

Written test-first, like task 1: step 1 appends the tests, step 3 writes the
code. Spec 11.7 is the change list; fixed inputs 1 and 16 put the instrument
in scope.

**Files:**

- Modify: `skills/tanto/scripts/passage-check.js` — `planTasks`, the three
  renderers, `framePlan`, `runFrame`, the `frame` dispatch entry, the `stage`
  option on `parseArgs`, and the `module.exports` addition.
- Modify (test): `skills/tanto/scripts/passage-check.test.js` — append this
  task's eight tests and their two fixtures.

**Interfaces:**

- Consumes, from the file as it stands: `normalize(text)`, `toLines(text)`,
  and `main(argv)`'s `parseArgs` dispatch, which gains
  `stage: { type: "string" }` and a `frame` entry. The existing `task` option
  is reused as it is. Not `parsePlan`: `frame` reads a plan's headings and
  step lines, never its passage blocks, so a plan that does not lint still
  frames.
- Consumes, from task 1, nothing it exports — `frame` never calls
  `sectionsOf` — but it does reuse the four file-local helpers task 1
  introduces: `headingOf`, `fenceFlags`, `findSection` and `sectionEnd`. They
  are the same helpers, doing the same job, and a second copy of them in one
  file would be the wrong answer to the ordering. If the batch runs the two
  tasks out of order, whichever lands first carries them.
- Produces, exported: `framePlan(text, options)` → `{ output, found }`, with
  `options` `{ stage, task }` — `stage` `1`, `2` or `null`, `task` a number or
  `null` — `output` the lines to print, and `found` false only when `task`
  named a number no task heading carries. Add `framePlan` to
  `module.exports`. Nothing consumes it but the CLI and this task's tests.
- **The `USAGE` constant is not this task's.** It still lists the four
  subcommands it lists today; the line that names all seven is a single
  passage of task 3. Do not edit it here, do not assume it names `frame`, and
  write no test that asserts what it lists.
- markdownlint lints neither path: both are JavaScript, so the hook that
  decides this task's lint step is the biome one.

#### Steps

- [ ] **Step 1: Append the failing tests**

Append this, verbatim, to `skills/tanto/scripts/passage-check.test.js`. Two
fixtures carry the eight tests: one plan with its tasks at three hashes under
a `## Tasks` heading, as the plans in `docs/superpowers/plans/` are written,
and one with a task at two hashes, a step region that runs to the end of the
file, and only one of the four stage-1 sections. That `## Tasks` heading is
the trap of the paragraph above, placed on purpose; the comment on the fixture
says so, because the cheap way past the test it feeds is to delete the heading
instead of tightening the rule.

````js
const { framePlan } = require("./passage-check.js");

// Tasks at three hashes under a `## Tasks` heading, as the plans in
// `docs/superpowers/plans/` are written, with a fenced block inside a step
// region whose own `##` line must neither end the region nor the task.
//
// The `## Tasks` heading is a trap, and it is here on purpose: a rule written
// as `^##+ Task` alone matches it, and `## Tasks` would then be a depth-2
// task swallowing Task 1's steps and Task 2's heading whole. Fix the rule,
// never this fixture.
const FRAME_PLAN = [
  "# A fixture plan",
  "",
  "## Global Constraints",
  "",
  "Commit by explicit path.",
  "",
  "## Batches",
  "",
  "| Batch | Tasks |",
  "",
  "## How a batch is verified",
  "",
  "Run the linter.",
  "",
  "## Tasks",
  "",
  "### Task 1: the first task",
  "",
  "Head prose for task 1.",
  "",
  "- [ ] **Step 1: do the thing**",
  "",
  "```bash",
  "echo one",
  "## not a heading, inside a fence",
  "```",
  "",
  "Expected: `one`",
  "",
  "### Task 2: the second task",
  "",
  "Head prose for task 2.",
  "",
  "- [ ] **Step 1: do the other thing**",
  "",
  "Prose inside the step.",
  "",
  "## Self-Review",
  "",
  "Nothing to review.",
];

// A `## Task` heading at two hashes (issue-ac9d), a step region that runs to
// the end of the file, and only one of the four stage-1 sections.
const FRAME_SHALLOW = [
  "# A shallow fixture plan",
  "",
  "## Global Constraints",
  "",
  "Only this section.",
  "",
  "## Task 1: a task at two hashes",
  "",
  "Head prose only.",
  "",
  "- [ ] **Step 1: the only step**",
  "",
  "Body of the step.",
];

test("frame prints everything outside the step regions, each region replaced by its line count", () => {
  const result = run(["frame", "--plan", writePlan(FRAME_SHALLOW)]);
  assert.strictEqual(result.code, 0);
  assert.strictEqual(
    result.out,
    [
      "# A shallow fixture plan",
      "",
      "## Global Constraints",
      "",
      "Only this section.",
      "",
      "## Task 1: a task at two hashes",
      "",
      "Head prose only.",
      "",
      "[steps: 3 lines]",
      "",
    ].join("\n"),
  );
});

test("a task heading at three hashes is a task too, and a fenced block inside a step region is skipped whole", () => {
  const result = run(["frame", "--plan", writePlan(FRAME_PLAN)]);
  assert.strictEqual(result.code, 0);
  // 9 lines, not the 4 a fence-blind reader would stop at: the `##` line
  // inside the fence ends neither the region nor the task.
  assert.match(result.out, /\[steps: 9 lines\]/);
  assert.match(result.out, /\[steps: 4 lines\]/);
  assert.doesNotMatch(result.out, /echo one/);
  assert.doesNotMatch(result.out, /not a heading, inside a fence/);
  assert.match(result.out, /## Self-Review/);
  assert.match(result.out, /Head prose for task 2\./);
});

test("a task heading is `Task` followed by a space and a number, so `## Tasks` is not one", () => {
  // Were `## Tasks` read as a task, stage 2 would print its head -- which
  // contains Task 1's heading -- and one count for it, so the heading lines
  // of the output are the discriminator, not the counts.
  const stage2 = framePlan(plan(FRAME_PLAN), { stage: 2 });
  assert.deepStrictEqual(
    stage2.output.filter((line) => /^#/.test(line)),
    ["### Task 1: the first task", "### Task 2: the second task"],
  );
  assert.deepStrictEqual(
    stage2.output.filter((line) => line.startsWith("[steps:")),
    ["[steps: 9 lines]", "[steps: 4 lines]"],
  );
});

test("frame --stage 1 prints the headings and the four fixed sections, and no task body", () => {
  const result = run(["frame", "--plan", writePlan(FRAME_PLAN), "--stage", "1"]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /Commit by explicit path\./);
  assert.match(result.out, /\| Batch \| Tasks \|/);
  assert.match(result.out, /Run the linter\./);
  assert.match(result.out, /Nothing to review\./);
  assert.match(result.out, /### Task 1: the first task/);
  assert.match(result.out, /### Task 2: the second task/);
  assert.doesNotMatch(result.out, /Head prose for task 1\./);
  assert.doesNotMatch(result.out, /\[steps:/);
});

test("frame --stage 2 prints each task's head and its step count, and nothing else", () => {
  const result = run(["frame", "--plan", writePlan(FRAME_PLAN), "--stage", "2"]);
  assert.strictEqual(result.code, 0);
  assert.strictEqual(
    result.out,
    [
      "### Task 1: the first task",
      "",
      "Head prose for task 1.",
      "",
      "[steps: 9 lines]",
      "### Task 2: the second task",
      "",
      "Head prose for task 2.",
      "",
      "[steps: 4 lines]",
      "",
    ].join("\n"),
  );
});

test("frame --task <N> prints that task whole, its steps and fences included", () => {
  const result = run(["frame", "--plan", writePlan(FRAME_PLAN), "--task", "1"]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /- \[ \] \*\*Step 1: do the thing\*\*/);
  assert.match(result.out, /echo one/);
  assert.doesNotMatch(result.out, /\[steps:/);
  assert.doesNotMatch(result.out, /### Task 2/);
  assert.doesNotMatch(result.out, /## Global Constraints/);
});

test("a plan missing one of the stage-1 sections prints what it has", () => {
  const result = run(["frame", "--plan", writePlan(FRAME_SHALLOW), "--stage", "1"]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /Only this section\./);
  assert.match(result.out, /## Task 1: a task at two hashes/);
  assert.doesNotMatch(result.out, /Self-Review/);
  assert.doesNotMatch(result.out, /Head prose only\./);
});

test("frame exits 2 on a --task no heading carries and on a --stage outside 1 and 2", () => {
  const file = writePlan(FRAME_PLAN);
  const missing = run(["frame", "--plan", file, "--task", "9"]);
  assert.strictEqual(missing.code, 2);
  assert.match(missing.out, /no such task in the plan: 9/);
  assert.match(missing.out, /Usage:/);
  const badStage = run(["frame", "--plan", file, "--stage", "3"]);
  assert.strictEqual(badStage.code, 2);
  assert.match(badStage.out, /invalid --stage '3'/);

  assert.deepStrictEqual(framePlan(plan(FRAME_PLAN), { task: 9 }), { output: [], found: false });
});
````

- [ ] **Step 2: Run the tests and watch the new ones fail**

```bash
mise x node@22 -- node --test skills/tanto/scripts/passage-check.test.js
```

Expected: every test the file already carried still passes, and all eight new
ones fail because `frame` is not yet a subcommand. The last one is not the
exception task 1's sixth test was: an unknown subcommand does exit `2` with
the usage line, but this test also asserts the two messages only an
implemented `frame` prints, and calls `framePlan` directly. Read its failure
line and confirm it failed on one of those rather than on an exit code.

- [ ] **Step 3: Write `frame` in `skills/tanto/scripts/passage-check.js`**

Add `planTasks`, the three renderers, `framePlan`, `runFrame`, the `stage`
option and the dispatch entry, against spec 8.2 and the interface above. The
implementation is not transcribed here; the tests of step 1 decide whether it
is right. What they pin, and what the `awk` this replaces got right or wrong:

- a task starts at a heading of **any** depth of two or more — issue-ac9d and
  the whole reason the `awk` goes — whose text is `Task`, a space, and a
  number, and it ends at the next heading of that depth or higher. Both halves
  of that are load-bearing: the depth, because the `awk` sees only three
  hashes; and the number, because a pattern that stops at the word `Task`
  also takes the `## Tasks` heading above the tasks and swallows them. The
  `awk`'s terminator — any heading of depth two or more — also ends a step
  region one heading too early under a four-hash subheading, which the depth
  comparison replaces;
- the step region runs from the task's first `- [ ] **Step` line to the end of
  the task, and `<n>` is that region's line count, counting the step line
  itself and stopping before the terminating heading. The `awk` counted the
  same lines, and step 6 is that check: on every plan the `awk` frames at all,
  the default output must match it line for line;
- fenced blocks are skipped whole. `fenceFlags` already marks them, so a
  heading line inside a fence is not a heading here either — in a step region,
  in a task head, or anywhere else in the plan;
- `--stage 1` prints every heading line of the plan, plus the whole body of
  each of Global Constraints, Batches, How a batch is verified and Self-Review
  that the plan carries, in document order and each line once. A section the
  plan does not carry is silently absent; there is no complaint and no exit
  code for it, because a plan legitimately written without one is still worth
  framing;
- `--stage 2` prints each task's heading through the line before its first
  step, then one `[steps: <n> lines]` line, and nothing else. A task with no
  step region prints its head alone;
- `--task <N>` prints the task's lines unchanged, steps and fences included,
  and takes precedence over `--stage`. A `--task` no task heading carries is
  `2` with `no such task in the plan: <N>`, as `verify` already answers the
  same mistake; a `--stage` that is neither `1` nor `2` is `2` with
  `invalid --stage '<value>'`; an unreadable plan is `2`. Everything else is
  `0` — `frame` prints, it does not adjudicate.

- [ ] **Step 4: Run the tests and watch them pass**

```bash
mise x node@22 -- node --test skills/tanto/scripts/passage-check.test.js
```

Expected: every test passes, `# fail 0`.

- [ ] **Step 5: Lint**

```bash
./scripts/lint.sh skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js
```

Expected: exit 0, the biome hook appearing as **run** — `Passed` — and none
`Failed`. A lint where every hook reports `(no files to check) Skipped`
proves nothing; stop and report that instead.

- [ ] **Step 6: Measure the new command against the `awk` it replaces**

The one property this command must preserve is that its default output is what
the `awk` printed, and no test above measures it: the fixtures are fixtures.
This step measures it against the program itself, on every plan the repository
has. The `awk` is extracted from `roles/kanri.md` rather than retyped — it is
still there at this point in the batch, and a retyped copy would compare the
new command with a copy of the old one instead of with the old one.

```bash
TANTO=skills/tanto && sed -n '/^awk/,/"$P"$/p' "$TANTO/roles/kanri.md" > /tmp/frame-awk.sh
for P in docs/superpowers/plans/*.md; do
  P="$P" bash /tmp/frame-awk.sh > /tmp/awk-frame.out
  mise x node@22 -- node "$TANTO/scripts/passage-check.js" frame --plan "$P" > /tmp/new-frame.out
  cmp -s /tmp/awk-frame.out /tmp/new-frame.out && echo "same $(basename "$P")" || echo "DIFFERS $(basename "$P")"
done
```

Expected: `DIFFERS` on exactly these three, and `same` on every other plan in
the directory — ten of them when this task was drafted, this plan among them:

- `2026-05-28-install-scripts.md`
- `2026-09-11-kisou-refresh.md`
- `2026-09-12-tanto-workspace.md`

Those three are the intended divergence and the point of issue-ac9d: their
tasks sit at two hashes, the `awk` does not recognize them, and it prints
their step regions whole where the new command collapses them. A fourth
`DIFFERS`, or a `same` on one of those three, is a failure — read the `diff`
of the two outputs before going further. The `sed` range takes the `awk`
program from its first line to the line ending in `"$P"`; confirm
`/tmp/frame-awk.sh` is 16 lines before trusting the loop, since an extraction
that silently caught nothing would report `DIFFERS` on everything.

- [ ] **Step 7: Check the line endings, then commit**

```bash
git ls-files --eol skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js
git commit --only skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js -m "feat(tanto): passage-check frame reads a plan at three granularities" -m "Kanri's cold read takes the plan's frame, which until now was a twenty-line awk program inlined in a role file - one that recognizes a task only at three hashes and so prints three of this repository's twelve plans whole. frame keeps the awk's default output line for line on the nine it framed, finds a task at any heading depth of two or more (issue-ac9d), and adds the two stages and the single-task read the cold read actually wants (issue-2e52)." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

Expected: `i/lf w/lf attr/text eol=lf` on both paths — `.gitattributes` pins
the JavaScript family to `eol=lf`, so neither reads `w/crlf` as the Markdown
paths do, and `w/mixed` is a failure either way. Then the commit succeeds.

- [ ] **Step 8: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 9: Verify**

```bash
mise x node@22 -- node --version && mise x node@22 -- node --test skills/tanto/scripts/passage-check.test.js
```

Expected: a `v22.` line — `v22.23.2` when this task was drafted — followed by
a run in which every test passes, `# fail 0`, the file's existing tests, task
1's seven and this task's eight alike. This task has no
`passage-check.js verify` step: it carries no passages, and its own test file
is the check.

**Done when:** the suite passes on the recorded Node 22 version; the default
output is byte-identical to the extracted `awk`'s on every plan in
`docs/superpowers/plans/` but the three named in step 6, and differs on those
three; `frame` collapses each step region to `[steps: <n> lines]` and prints
everything else unchanged, finds a task heading at two hashes and at three,
reads `## Tasks` as no task at all, keeps a fenced
block inside a step region inside it, prints the four fixed sections at
`--stage 1` and what it has when one is absent, each task's head and step
count at `--stage 2`, and one task whole at `--task <N>`; lint is clean on
both paths with the biome hook run rather than skipped; and the commit carries
its `Co-Authored-By:` trailer.

---

### Task 3: `boundary`, and the usage line

**Batch:** A. **Blocks:** A3.1, P3.1.

Spec 8.3 adds the last of section 8's three subcommands: `boundary --plan
<path>`, Kanri's instrument at loop step 2 as `diff` and `verify` are Jisso's.
It runs the plan's own verification list — `git status --porcelain` first, then
every fenced `bash` or `console` block under the plan's How a batch is verified
heading, each with its `Expected:` paragraph where the plan has one — and
prints one line per check. This task also lands the plan's one passage against
the script: the `USAGE` constant, which section 8's preamble requires to name
all seven subcommands. That line is true only once `sections` (task 1) and
`frame` (task 2) have landed, so it sits here rather than in either of them.

**How spec 7.3 is read.** 7.3 says `git status` and the commit trailers are the
first two checks `boundary` prints. Only `git status --porcelain` is built in —
8.3 names it as the one command `boundary` runs of its own accord — and it is
therefore always check 1. The trailer check is not built in: it is a command
this plan's own How a batch is verified section carries, so `boundary` runs it
like any other fenced block, and it is check 2 because that section places it
first among its own fences. 7.3's "first two" is thus half a script rule and
half a plan obligation; 8.3's closing sentence, that the section "is written
knowing this command will run it verbatim", is what makes the second half
binding. A section that put another command first would print that command as
check 2, and `boundary` would not be wrong to do so.

**What decides a pass.** The command's exit status: `0` prints `pass <n>`,
anything else prints `fail <n>` followed by that command's output. `git status
--porcelain` is the one exception, and the spec has to state it precisely
because that command exits `0` whether the tree is clean or dirty — it passes
when its output is empty. The `Expected:` paragraph is read as `replay` reads
it and carried on the returned check, but it does not decide the pass:
`replay`'s comparison against an expectation is deliberately crude, and a
correct check whose command prints many lines against a one-sentence paragraph
would fail every run. 8.3 also fixes what is printed — one line per check, and
a failure's output after it — so the paragraph is not printed either. It
follows that a How a batch is verified section must be written so that a
failing check exits non-zero.

**What is skipped.** A `replay-skip` marker is honored as in `replay`, and
nothing else is. `replay`'s two built-in skips exist because its subject is a
scratch tree that is not a git repository and is not what `verify` reads;
`boundary`'s subject is the working tree, so it runs git commands and `verify`
invocations as written. A skipped block prints `replay`'s own
`skipped: <command> — <reason>` line and is not numbered, so "one line per
check" stays pass-or-fail.

**The collision that follows, stated rather than fixed.** A skip declaration is
written for a subject, and the two subcommands do not share one: `replay`'s
list is written for a scratch tree, while `boundary` runs in the working tree,
where `./scripts/lint.sh`, `mise`, `uv`, a base derived from `git log` and
every command naming the plan's own path all run correctly. So the same marker
means "cannot run here" to one subcommand and "do not check this" to the other,
and a marker broad enough to be useful to `replay` can silently remove most of
a boundary's checks — a green `boundary` standing for two checks out of seven.
Spec 8.3 says a marker is honored as in `replay`, and this task implements that
literally, substring matching included; the plan compensates by narrowing its
own markers to its task-step commands and by naming in the Batches table the
commands it cannot narrow as Kanri's own to run. The real fix is a declaration
that names its subject — a separate `boundary-skip:`, or a scope word on the
existing marker — which is a change to the instrument's grammar and outside
this plan's scope.

**Files:**

- Modify: `skills/tanto/scripts/passage-check.js` — one passage, the `USAGE`
  constant; plus the `boundary` implementation, which the plan does not quote.
- Modify (test): `skills/tanto/scripts/passage-check.test.js` — append this
  task's seven tests.

**Interfaces:**

- Consumes, from tasks 1 and 2: only that both have landed, and that `USAGE`
  still reads the old string when this task starts. Neither task touches
  `USAGE`; the `USAGE` passage is task 3's alone, which is what lets P3.1 quote
  one byte-exact old line.
- Consumes, from the file as it stands: `parsePlan(text)` and its `lines`
  field; `extractCommandFences(lines)`, which returns
  `{ command, expectation }` per `bash`/`console` fence, the expectation
  being the `Expected:` paragraph or `null`;
  `extractReplaySkipPatterns(lines)`, which returns `{ pattern, reason }`;
  `runShell(command, cwd)`; and `main(argv)`'s `parseArgs` dispatch, to which
  `boundary` adds a branch and no new option — `--plan` already exists.
- `runShell` discards the exit status, which is exactly what `boundary` needs,
  so this task splits it: `runShellResult(command, cwd)` →
  `{ output, status }`, with `runShell` kept as a one-line wrapper returning
  `.output`. `replay` and `verify` keep calling `runShell` unchanged.
- `boundary` finds its section with its own heading scan, by the rule 8.1
  fixes — the heading text after the `#` marks, exact and trimmed, down to the
  next heading of the same or higher depth — rather than by calling task 1's
  extractor, so the two tasks stay independent of each other's internals.
- Produces, for a later task and for the role files: `boundaryPlan(parsed,
  options)` → `{ ok, checks, skipped }`. `checks` is an array of
  `{ n, command, expectation, output, status }`, `n` starting at `1` on the
  built-in `git status --porcelain` check and `status` one of `"pass"` and
  `"fail"`; `skipped` is an array of `{ command, reason }`; `ok` is true when
  every check passed. `options.cwd` is the tree the checks run in, defaulting
  to `process.cwd()`. It throws when the plan carries no How a batch is
  verified heading, which the CLI wrapper reports as exit `2`, as `replayPlan`
  and `diffPlan` already do for their own broken invocations. Add
  `boundaryPlan` to `module.exports`.
- markdownlint lints neither path: `.js` is biome-check's, by
  `.pre-commit-config.yaml`'s `files` pattern.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js
```

Expected: `i/lf w/lf attr/text eol=lf` on both — `*.js` is pinned by
`.gitattributes`, so this is not the `attr/text=auto` the Markdown paths
report — and never `w/mixed`.

- [ ] **Step 2: Append the failing tests**

Append to `skills/tanto/scripts/passage-check.test.js`, verbatim.
`boundaryRepo` builds on the existing `makeRepo` and adds one empty commit
carrying a `Co-Authored-By` trailer, so that the trailer check the fixture
plan supplies as its own first command has something to find. Run Step 5's
command now and confirm the seven fail; that run is not a fenced step of its
own, because `replay` runs every fenced command in the plan and a
deliberately failing one would be noise at every dry run.

````js
const { boundaryPlan } = require("./passage-check.js");

// A repository whose HEAD carries a Co-Authored-By trailer, so that the
// trailer check the fixture plan supplies as its own first command has
// something to find. `boundary` runs in the working tree, so unlike `replay`
// it never skips a git command.
function boundaryRepo() {
  const repo = makeRepo({ "tmp/fixture.md": "alpha\nbeta\n" });
  repo.git("commit", "--allow-empty", "-qm", "base\n\nCo-Authored-By: Claude <noreply@anthropic.com>");
  return repo;
}

// The bash fences before the heading and under the next section of the same
// depth are the region bounds: `boundary` must run neither.
const BOUNDARY_PLAN = REPLACEMENT.concat([
  "",
  "```bash",
  "echo before-the-section",
  "```",
  "",
  "## How a batch is verified",
  "",
  "```bash",
  "git log -1 --format=%B | grep -c Co-Authored-By",
  "```",
  "",
  "Expected: `1`",
  "",
  "```bash",
  "echo boundary-second-check",
  "```",
  "",
  "Expected: `boundary-second-check`",
  "",
  "## Self-Review",
  "",
  "```bash",
  "echo outside-the-section",
  "```",
]);

// A two-line command whose output text differs from the command text, so
// that "printed once" and "the first line only" are both measurable.
const BOUNDARY_FAILING = REPLACEMENT.concat([
  "",
  "## How a batch is verified",
  "",
  "```bash",
  "printf 'boundary-output-%s\\n' once",
  "exit 3",
  "```",
  "",
  "Expected: `nothing in particular`",
]);

const BOUNDARY_NO_EXPECTATION = REPLACEMENT.concat(["", "## How a batch is verified", "", "```bash", "true", "```"]);

const BOUNDARY_SKIPPED = [
  "```text",
  "replay-skip: echo skip-marker — deliberately flaky in this fixture",
  "```",
].concat(REPLACEMENT, [
  "",
  "## How a batch is verified",
  "",
  "```bash",
  "echo skip-marker and other words",
  "```",
  "",
  "Expected: `does not matter`",
]);

test("boundary runs git status first, then each fence under the heading and none outside it", () => {
  const repo = boundaryRepo();
  const result = runIn(repo.dir, ["boundary", "--plan", writePlan(BOUNDARY_PLAN)]);
  assert.strictEqual(result.code, 0, result.out);
  assert.match(result.out, /^pass 1: git status --porcelain$/m);
  assert.match(result.out, /^pass 2: git log -1 --format=%B \| grep -c Co-Authored-By$/m);
  assert.match(result.out, /^pass 3: echo boundary-second-check$/m);
  assert.doesNotMatch(result.out, /before-the-section/);
  assert.doesNotMatch(result.out, /outside-the-section/);
});

test("boundary names a failing check by number and first line, prints its output once, and exits 1", () => {
  const repo = boundaryRepo();
  const result = runIn(repo.dir, ["boundary", "--plan", writePlan(BOUNDARY_FAILING)]);
  assert.strictEqual(result.code, 1);
  const failLine = result.out.split("\n").find((line) => line.startsWith("fail 2: "));
  assert.strictEqual(failLine, "fail 2: printf 'boundary-output-%s\\n' once");
  assert.strictEqual(result.out.split("boundary-output-once").length - 1, 1);
});

test("boundary exits 2 on a plan it cannot read and on one with no How a batch is verified heading", () => {
  const repo = boundaryRepo();
  const missing = path.join(os.tmpdir(), "passage-check-absent", "plan.md");
  assert.strictEqual(runIn(repo.dir, ["boundary", "--plan", missing]).code, 2);
  const noHeading = runIn(repo.dir, ["boundary", "--plan", writePlan(REPLACEMENT)]);
  assert.strictEqual(noHeading.code, 2);
  assert.match(noHeading.out, /How a batch is verified/);
});

test("boundary fails check 1 on a dirty working tree and still runs the checks after it", () => {
  const repo = boundaryRepo();
  fs.writeFileSync(path.join(repo.dir, "tmp/untracked.md"), "dirt\n", "utf8");
  const result = runIn(repo.dir, ["boundary", "--plan", writePlan(BOUNDARY_PLAN)]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /^fail 1: git status --porcelain$/m);
  assert.match(result.out, /tmp\/untracked\.md/);
  assert.match(result.out, /^pass 3: echo boundary-second-check$/m);
});

test("boundary honors a replay-skip marker and does not number the skipped block as a check", () => {
  const repo = boundaryRepo();
  const result = runIn(repo.dir, ["boundary", "--plan", writePlan(BOUNDARY_SKIPPED)]);
  assert.strictEqual(result.code, 0, result.out);
  assert.match(result.out, /^skipped: echo skip-marker and other words — deliberately flaky in this fixture$/m);
  assert.doesNotMatch(result.out, /pass 2:/);
});

test("boundaryPlan carries each fence's Expected paragraph, and null where the plan states none", () => {
  const repo = boundaryRepo();
  const stated = boundaryPlan(parsePlan(fs.readFileSync(writePlan(BOUNDARY_PLAN), "utf8")), { cwd: repo.dir });
  assert.strictEqual(stated.checks.length, 3);
  assert.strictEqual(stated.checks[2].expectation, "Expected: `boundary-second-check`");

  const bare = boundaryPlan(parsePlan(fs.readFileSync(writePlan(BOUNDARY_NO_EXPECTATION), "utf8")), { cwd: repo.dir });
  assert.strictEqual(bare.ok, true);
  assert.strictEqual(bare.checks.length, 2);
  assert.strictEqual(bare.checks[1].expectation, null);
  assert.strictEqual(bare.checks[1].status, "pass");
});

// A command that exits non-zero while printing exactly what its Expected
// paragraph states: `replay` would call this a MATCH, and `boundary` must
// still call it a failure.
const BOUNDARY_MATCHING_FAILURE = REPLACEMENT.concat([
  "",
  "## How a batch is verified",
  "",
  "```bash",
  "echo boundary-matching-output; exit 1",
  "```",
  "",
  "Expected: boundary-matching-output",
]);

test("boundary fails a check whose output matches its Expected paragraph but whose command exits non-zero", () => {
  const repo = boundaryRepo();
  const result = runIn(repo.dir, ["boundary", "--plan", writePlan(BOUNDARY_MATCHING_FAILURE)]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /^fail 2: echo boundary-matching-output; exit 1$/m);
  assert.match(result.out, /boundary-matching-output/);
});
````

- [ ] **Step 3: The usage line**

**A3.1** `skills/tanto/scripts/passage-check.js` — `grep -cF 'sections|frame|boundary' skills/tanto/scripts/passage-check.js` — before: 0, after: 1

**P3.1** `skills/tanto/scripts/passage-check.js` — replace exactly this 1 line

```text
const USAGE = "Usage: passage-check.js <lint|replay|diff|verify> --plan <path> [--base <ref>] [--task <N>]";
```

**P3.1 →**

```text
const USAGE =
  "Usage: passage-check.js <lint|replay|diff|verify|sections|frame|boundary> [--plan <path>] [--file <path>] [--base <ref>] [--task <N>] [--stage 1|2] [<heading>...]";
```

The seven subcommands are named in the order section 8 introduces them, and the
options are the union of what all seven take: `--plan` for six of them,
`--file` and the trailing heading names for `sections`, `--stage` for `frame`,
`--base` for `replay` and `diff`, `--task` for `verify` and `frame`. `--plan`
becomes bracketed because `sections` does not take it. The two-line form is
what biome's formatter prints for an assignment whose string exceeds the
configured 120-column width; writing it on one line would be rewritten by the
`biome-check` hook, and the passage and the file would then disagree.

- [ ] **Step 4: Write `boundary`**

Implement `boundaryPlan` and its `runBoundary` CLI wrapper against the
**Interfaces** section above, and add the `boundary` branch to `main`'s
dispatch. The implementation is not transcribed into this plan: its lines are
what the seven tests of Step 2 decide, and a transcription would only duplicate
them. The five points to get right, all of them pinned by those tests:

- the built-in check is `git status --porcelain` and it is check `1`; every
  fence under the heading follows, numbered from `2` in document order;
- the printed command is its **first line**, so a multi-line fence prints one
  line, and a failing check's output is printed after that line exactly once;
- a fence outside the heading's region — before the heading, or under the next
  heading of the same or higher depth — is not a check;
- the exit status decides and the text never does: a command that exits
  non-zero while printing exactly what its `Expected:` paragraph states is
  still `fail`, which is where `boundary` parts company with `replay`'s
  `MATCH`;
- exit `0` when every check passed, `1` when any failed, `2` when the plan
  cannot be read or carries no How a batch is verified heading.

- [ ] **Step 5: Run the tests on the pinned Node**

```bash
mise x node@22 -- node --version && mise x node@22 -- node --test skills/tanto/scripts/passage-check.test.js
```

Expected: the version line resolves to Node `v22.x` — record the exact patch
version beside the result — and every test passes, `# fail 0`, with the seven
`boundary` tests among them.

- [ ] **Step 6: Lint**

```bash
./scripts/lint.sh skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js
```

Expected: exit 0, none `Failed`, and `biome-check` appearing as run rather than
as `(no files to check) Skipped`. If biome rewrites the `USAGE` assignment,
re-author P3.1 to what it printed rather than leaving the file and the plan
disagreeing.

- [ ] **Step 7: Commit**

```bash
git commit --only skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js -m "feat(tanto): passage-check boundary, and the usage line for seven subcommands" -m "boundary --plan <path> runs the plan's own verification list at a batch boundary: git status --porcelain built in as check 1, then every fenced bash or console block under the plan's How a batch is verified heading, each with its Expected: paragraph where the plan has one. One line per check, pass or fail, with a failing check's output after it; exit 0, 1, or 2 when the plan or the heading is missing. A replay-skip marker is honored; replay's git and verify skips are not, because the subject here is the working tree. The usage line now names all seven subcommands and every option they take." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 8: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 9: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 3
```

Expected: `task 3: verify clean`.

**Done when:** the `USAGE` passage is present once in
`skills/tanto/scripts/passage-check.js` with A3.1 reading `1`, `boundary` is a
dispatchable subcommand whose seven tests and every existing test pass on the
recorded Node 22 version, `./scripts/lint.sh` exits 0 on both paths with
biome-check run rather than skipped, `verify --plan … --task 3` reports `task
3: verify clean`, and the commit carries its `Co-Authored-By:` trailer.

---

### Task 4: `templates/tanto.json` and `templates/agent.md`

**Batch:** A. **Blocks:** A4.1, P4.1, W4.1.

Spec 11.6 gives `tanto.json` "section 3.1 in full" and adds `agent.md` to the
templates. 3.1 re-keys both halves of the file: the seven roles of the session
matrix under `sessions`, each a `{ "model", "effort" }` object rather than a
bare family string, and the twelve kinds of 1.2 under `subagents`, replacing
the five old keys. The file is tanto's own and only a `/tanto` session reads
it, so its keys carry no prefix (Fixed input 5). A value may still be a bare
string — that is what keeps a personal file valid — but the template ships the
full form, so that every default is stated once and the overlay has a field to
overlay onto.

`agent.md` is the other half of the same namespace decision.
`~/.claude/agents/` is the harness's namespace, seen by every session of every
repository, so the definitions are named `tanto-<object>-<act>` and their
description says they are dispatched by name only (Fixed input 5). Spec 3.3
prints the rendered file for `task.implement`; this template is that file
with its three varying fields as `<...>` placeholders, in the idiom the other
templates here use. The varying fields are the `name`, the kind inside the
`description`, and the `effort`; everything else — the sentence about being
dispatched by name and never selected from the description, and the
two-sentence body — is fixed text, identical in all twelve files. For
`default` and `shoroku`, the two single-word kinds, the placeholder renders
as that one word: `tanto-default` and `tanto's default seat`. The definition
carries no `model` and no `tools` line, because the dispatch's own `model`
parameter binds the family and takes precedence over a definition's by the
Agent tool's contract (Fixed input 17), and the roles need every tool their
prompts assume.

The template carries no explanatory header of its own, unlike the briefs and
reports here, because a role copies it into `~/.claude/agents/` byte for byte:
anything above the frontmatter would land in the agent definition. What the
template is for is said in the role files and in 3.3, not in the file.

**Files:**

- Modify: `skills/tanto/templates/tanto.json` — one passage, the whole file.
- Create: `skills/tanto/templates/agent.md` — the agent definition template the
  roles render for each of the twelve kinds.

```text
created: skills/tanto/templates/agent.md
```

**Interfaces:**

- Consumes, from an earlier task: nothing. Both files stand alone; the role
  text that tells a role to read them is another task's.
- Produces, for later tasks: the twelve kind names and the seven role names in
  the spellings 3.1 fixes, which the role files, `batch-prompt.md` and the
  consistency note's checks 7 and 8 all quote; and the template path
  `templates/agent.md`, which check 1 counts among the thirteen and check 3
  cites as copied by every role.
- markdownlint lints neither path: `.markdownlint-cli2.yaml` ignores
  `skills/tanto/templates/**`. For `tanto.json` the hooks that decide the lint
  step are `biome-check` — the repository's JSON hook, whose `files` pattern in
  `.pre-commit-config.yaml` covers `jsonc?` — plus trailing whitespace,
  end-of-file and mixed line ending. For `agent.md` they are those last three
  plus `check-md-frontmatter`, which is typed on Markdown with no exclusion and
  so does parse this file's placeholder frontmatter.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/templates/tanto.json
```

Expected: `i/lf w/lf attr/text eol=lf` — `*.json` is pinned by
`.gitattributes`, so this is not the `attr/text=auto` the Markdown paths
report — and never `w/mixed`.

- [ ] **Step 2: `templates/tanto.json`**

**A4.1** `skills/tanto/templates/tanto.json` — `grep -cF 'task.review-quality' skills/tanto/templates/tanto.json` — before: 0, after: 1

**P4.1** `skills/tanto/templates/tanto.json` — replace exactly these 15 lines

```text
{
  "sessions": {
    "kanri": "fable",
    "sekkei": "fable",
    "jisso": "opus",
    "kaiseki": "fable"
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

**P4.1 →**

```text
{
  "sessions": {
    "kikaku": { "model": "fable", "effort": "xhigh" },
    "kanri": { "model": "sonnet", "effort": "high" },
    "sekkei": { "model": "fable", "effort": "high" },
    "keikaku": { "model": "sonnet", "effort": "high" },
    "jisso": { "model": "sonnet", "effort": "xhigh" },
    "kaiseki": { "model": "fable", "effort": "xhigh" },
    "hosa": { "model": "sonnet", "effort": "medium" }
  },
  "subagents": {
    "task.implement": { "model": "sonnet", "effort": "high" },
    "task.escalate": { "model": "opus", "effort": "high" },
    "task.review-spec": { "model": "opus", "effort": "medium" },
    "task.review-quality": { "model": "opus", "effort": "medium" },
    "plan.draft": { "model": "opus", "effort": "high" },
    "plan.review": { "model": "fable", "effort": "high" },
    "plan.coldread": { "model": "fable", "effort": "high" },
    "spec.review": { "model": "opus", "effort": "high" },
    "branch.review": { "model": "fable", "effort": "high" },
    "brief.write": { "model": "fable", "effort": "high" },
    "shoroku": { "model": "opus", "effort": "medium" },
    "default": { "model": "sonnet", "effort": "medium" }
  }
}
```

This is 3.1 byte for byte, including the order of the keys — the sessions in
the order of the matrix of 1.1, the kinds in the order of the table of 1.2, so
that the file reads as the design's own two tables. The one-line value objects
are what biome prints for an object whose opening brace is not followed by a
newline, so the shape survives `biome-check` unchanged.

- [ ] **Step 3: `templates/agent.md`**

**W4.1** `skills/tanto/templates/agent.md` — new file, 9 lines

```text
---
name: tanto-<object>-<act>
description: tanto's <object>.<act> seat. Dispatched by a tanto role by name through subagent_type, and never to be selected from this description.
effort: <effort>
---

Follow the prompt of the dispatch that named you. This file carries the
seat's effort; the procedure, the inputs, and the output path are in the
prompt.
```

The `description` is one line and must stay one line: it is written into YAML
frontmatter, and a value carrying a colon followed by a space would have to be
quoted. There is none here, and none should be introduced.

Then confirm the file landed once:

```bash
grep -cF 'tanto-<object>-<act>' skills/tanto/templates/agent.md
```

Expected: `1`.

This is a fenced step rather than an `A` block because `replay` collects the
base blob of every path a non-`W` block names, an anchor's path included, so an
anchor on a created file makes the whole dry run exit 2 on its own
`git show` of a path the base does not have, before any check runs; a
fenced command carries the same
one-line check without that lookup, since `replay` runs it against the applied
tree, which does hold the created file.

- [ ] **Step 4: Prove both files rather than assert them**

The JSON assertion is the spec's own one-liner: twelve kinds, seven roles, and
both fields on every value.

```bash
node -e 'const t=require("./skills/tanto/templates/tanto.json");const r=Object.keys(t.sessions),k=Object.keys(t.subagents);if(r.length!==7||k.length!==12)process.exit(1);for(const m of [t.sessions,t.subagents])for(const v of Object.values(m))if(!v.model||!v.effort)process.exit(1);console.log("tanto.json ok",r.length,k.length)'
```

Expected: `tanto.json ok 7 12`.

Then render the template for one kind and load the result through the real YAML
parser the consistency note names, so that the frontmatter is proved and not
read by eye.

```bash
uv run --no-project --with pyyaml python -c "import yaml;t=open('skills/tanto/templates/agent.md',encoding='utf-8').read().replace('<object>-<act>','task-implement').replace('<object>.<act>','task.implement').replace('<effort>','high').split('---')[1];d=yaml.safe_load(t);print(sorted(d));print(d['name'],d['effort'])"
```

Expected: `['description', 'effort', 'name']` on the first line and
`tanto-task-implement high` on the second — the three keys 3.3 states, no
`model` and no `tools` among them.

- [ ] **Step 5: Stage the new file and check its line endings**

```bash
git add skills/tanto/templates/agent.md && git ls-files --eol skills/tanto/templates/tanto.json skills/tanto/templates/agent.md
```

Expected: `i/lf w/lf attr/text eol=lf` for the JSON, and for the Markdown
`i/lf` with `attr/text=auto` and a `w/` field of `lf` or `crlf` depending on
how the file was written — never `w/mixed` on either.

- [ ] **Step 6: Lint**

```bash
./scripts/lint.sh skills/tanto/templates/tanto.json skills/tanto/templates/agent.md
```

Expected: exit 0, none `Failed`, with `biome-check` and
`check-md-frontmatter` both appearing as run rather than as `(no files to
check) Skipped`. If a hook rewrites either file, re-author the block it
touched rather than leaving the file and the plan disagreeing.

- [ ] **Step 7: Commit**

```bash
git commit --only skills/tanto/templates/tanto.json skills/tanto/templates/agent.md -m "docs(tanto): tanto.json in the seven-role, twelve-kind shape, and the agent definition template" -m "tanto.json is section 3.1 in full: the seven sessions of the role matrix and the twelve kinds, each value an object carrying both a model and an effort. A bare string stays valid and means the model alone, so a personal file that names one key keeps working. templates/agent.md is the definition every role renders into the harness agents directory for each kind, with the name, the kind in the description, and the effort as its three placeholders; it carries no model and no tools line, because the dispatch's model parameter binds the family and the roles need every tool their prompts assume." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 8: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 9: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 4
```

Expected: `task 4: verify clean`.

**Done when:** `skills/tanto/templates/tanto.json` holds 3.1's twenty-five
lines with A4.1 reading `1`, `skills/tanto/templates/agent.md` exists and is
tracked with its `grep -cF` check reading `1`, the JSON one-liner prints
`tanto.json ok 7 12`
and the rendered frontmatter loads as the three keys `description`, `effort`,
`name`, `./scripts/lint.sh` exits 0 on both paths with biome-check and
check-md-frontmatter run rather than skipped, `verify --plan … --task 4`
reports `task 4: verify clean`, and the commit carries its `Co-Authored-By:`
trailer.

---

### Task 5: SKILL.md — the seven roles, the ids, and the pointer

**Batch:** B. **Blocks:** A5.1, P5.1, P5.2, P5.3, P5.4, P5.5, P5.6.

The four places in `SKILL.md` that enumerate roles: the frontmatter, the
roles table with the line above it that counts the role files, the
Invocation table, and the closing pointer. Spec 11.1's `Frontmatter`,
`"The roles" table`, `"Invocation"`, and `"Now read your role file"`
bullets; the values come from section 1.1 (the matrix), sections 2.1 to
2.5 (what each seat owns and who opens it), and section 9.2 (the
Invocation rows, the eight ids, and the `argument-hint`).

The frontmatter is checked by a real YAML load rather than by eye: a colon
followed by a space anywhere in the `description` value breaks frontmatter
parsing silently, which is the pitfall this repository has already
measured, and the check is the one `docs/notes/tanto-consistency-checks.md`
carries as its check 8.

Task 6 edits the same file. It owns the Start sequence, the expected-model
config, and the transcript reading; this task owns none of those and none
of its passages reach past line 50 until the closing section.

**Files:**

- Modify: `skills/tanto/SKILL.md` — six passages: the frontmatter's
  `description` and `argument-hint`, the preamble's role-file count, the
  roles table, the Invocation table with its unknown-word sentence, the
  `/tanto fukki` sentence, and the closing pointer.

**Interfaces:**

- Consumes, from task 6: nothing. The two tasks touch disjoint regions of
  one file, and neither reads the other's text.
- Produces, for tasks 9 to 16 (batches D and E): the seven role ids and
  the seven `roles/<role>.md` names every role file and every template
  cites, and the `fukki` id with `resume` as its alias.
- markdownlint **does** run on `skills/tanto/SKILL.md` — the ignore list
  covers `docs/superpowers/**` and `skills/tanto/templates/**`, not this
  file — so the lint step is a real markdownlint run with `--fix`.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/SKILL.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The anchor and the frontmatter**

**A5.1** `skills/tanto/SKILL.md` — `grep -cF 'The other six are not yours' skills/tanto/SKILL.md` — before: 0, after: 1

**P5.1** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
description: Use when the user starts or joins a tanto multi-session orchestration run in Claude Code, invoked as `/tanto <role>`, `担当して <role>`, or `tantoして <role>`, where the role word is kanri (管理), sekkei (設計), jisso (実装), or kaiseki (解析) in hiragana, kanji, or romaji. Drives one implementation plan through separate interactive sessions that message each other, composing superpowers brainstorming, writing-plans, subagent-driven development, systematic-debugging, and the shoroku write-out. Claude Code only, because it needs ListAgents and SendMessage.
argument-hint: kanri | sekkei | jisso | kaiseki
```

**P5.1 →**

```text
description: Use when the user starts or joins a tanto multi-session orchestration run in Claude Code, invoked as `/tanto <role>`, `担当して <role>`, or `tantoして <role>`, where the role word is kanri (管理), sekkei (設計), keikaku (計画), jisso (実装), kaiseki (解析), kikaku (企画), or hosa (補佐) in hiragana, kanji, or romaji. Drives one implementation plan through separate interactive sessions that message each other, composing superpowers brainstorming, writing-plans, subagent-driven development, systematic-debugging, and the shoroku write-out. Claude Code only, because it needs ListAgents and SendMessage.
argument-hint: kanri | sekkei | keikaku | jisso | kaiseki | kikaku | hosa | fukki | resume
```

- [ ] **Step 3: The role-file count in the preamble**

**P5.2** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
`roles/<role>.md` — never the other three.
```

**P5.2 →**

```text
`roles/<role>.md` — never the other six.
```

- [ ] **Step 4: The roles table**

**P5.3** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```text
| Role | Count per repo | Owns | Talks to |
| --- | --- | --- | --- |
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, shoroku adoption and the T0 and T1 write-outs, the exit directions, the bug intake, lifecycle requests | human, Sekkei, Jisso, Kaiseki |
| Sekkei (設計) | 0 or 1 | spec, plan, spec and plan review | Kanri; the human by grant |
| Jisso (実装) | 0 or 1 | the SDD run, batch reports, commits, the T2 shoroku proposal and write-out | Kanri; the human by grant |
| Kaiseki (解析) | 0 or 1, on demand | root-cause reports; never a fix; no commit but its exit shoroku | Kanri; the human by grant |
```

**P5.3 →**

```text
| Role | Count | Owns | Talks to |
| --- | --- | --- | --- |
| Kanri (管理) | exactly 1 | roster, conductor ledger, batch prompts, rulings, the recommendations and the directions, the bug intake, lifecycle requests | human, Sekkei, Keikaku, Jisso, Kaiseki, Hosa; Kikaku at its handshake only |
| Sekkei (設計) | 0 or 1 per topic | the spec and its review | Kanri; the human by grant |
| Keikaku (計画) | 0 or 1 per topic | the plan, its dry run, and its review | Kanri; the human by grant |
| Jisso (実装) | 0 or 1 | the SDD run, batch reports, commits, the T2 shoroku proposal | Kanri; the human by grant |
| Kaiseki (解析) | 0 or 1, on demand | root-cause reports; never a fix; no commit | Kanri; the human by grant |
| Kikaku (企画) | 0 or 1, opened by the human | the consultation, and the decision files under `.tanto/kikaku/` | the human; Kanri, one `decision:` line |
| Hosa (補佐) | 0 or 1, opened by the human | the human's small chores and Kanri's filings, each in a slot Kanri gives | the human; Kanri |
```

- [ ] **Step 5: The Invocation table and the unknown-word sentence**

**P5.4** `skills/tanto/SKILL.md` — replace exactly these 9 lines

```text
| Accepted | Id |
| --- | --- |
| `かんり`, `管理`, `kanri` | `kanri` |
| `せっけい`, `設計`, `sekkei` | `sekkei` |
| `じっそう`, `実装`, `jisso` | `jisso` |
| `かいせき`, `解析`, `kaiseki` | `kaiseki` |
| `resume` | `resume` |

Any other word: say the role is unknown, list those five ids, and stop.
```

**P5.4 →**

```text
| Accepted | Id |
| --- | --- |
| `かんり`, `管理`, `kanri` | `kanri` |
| `せっけい`, `設計`, `sekkei` | `sekkei` |
| `けいかく`, `計画`, `keikaku` | `keikaku` |
| `じっそう`, `実装`, `jisso` | `jisso` |
| `かいせき`, `解析`, `kaiseki` | `kaiseki` |
| `きかく`, `企画`, `kikaku` | `kikaku` |
| `ほさ`, `補佐`, `hosa` | `hosa` |
| `ふっき`, `復帰`, `fukki`; `resume` as an accepted alias | `fukki` |

Any other word: say the role is unknown, list those eight ids, and stop.
```

- [ ] **Step 6: The sentence that skips the start sequence**

**P5.5** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
`/tanto resume` skips the start sequence — no model check, no first
handshake — and runs "Resuming" below.
```

**P5.5 →**

```text
`/tanto fukki` skips the start sequence — no model check, no first
handshake — and runs "Resuming" below.
```

- [ ] **Step 7: The closing pointer**

**P5.6** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```text
- `kanri` → `roles/kanri.md`
- `sekkei` → `roles/sekkei.md`
- `jisso` → `roles/jisso.md`
- `kaiseki` → `roles/kaiseki.md`

Read exactly one. The other three are not yours.
```

**P5.6 →**

```text
- `kanri` → `roles/kanri.md`
- `sekkei` → `roles/sekkei.md`
- `keikaku` → `roles/keikaku.md`
- `jisso` → `roles/jisso.md`
- `kaiseki` → `roles/kaiseki.md`
- `kikaku` → `roles/kikaku.md`
- `hosa` → `roles/hosa.md`

Read exactly one. The other six are not yours.
```

- [ ] **Step 8: Lint**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint
runs with `--fix`, and a fix that rewrote a line inside a passage would
leave `passage-check verify` reading text the plan does not contain. If it
fixes anything, re-author the block it touched rather than leaving the file
and the plan disagreeing.

- [ ] **Step 9: Load the frontmatter with a real YAML parser**

```bash
uv run --no-project --with pyyaml python -c "import yaml;t=open('skills/tanto/SKILL.md',encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')"
```

Expected: `['argument-hint', 'description', 'name']`, then `ok`. A colon
followed by a space anywhere in the `description` value breaks frontmatter
parsing silently, which is what `BAD` reports. Never a bare `python`. When
`--with pyyaml` cannot fetch PyYAML, fall back to
`sed -n 's/^description: //p' skills/tanto/SKILL.md | grep -c ': '`, expect
`0`, and record the fallback in the batch report.

- [ ] **Step 10: Commit**

```bash
git commit --only skills/tanto/SKILL.md -m "docs(tanto): name seven roles and eight ids in SKILL.md" -m "The frontmatter description and argument-hint, the roles table, the Invocation table, and the closing pointer carry Kikaku, Keikaku, and Hosa, and the fukki id with resume as its alias. Spec 11.1, with sections 1.1, 2.1 to 2.5, and 9.2." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 11: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 12: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 5
```

Expected: `task 5: verify clean`.

**Done when:** the six passages are present in `skills/tanto/SKILL.md`,
`grep -cF 'The other six are not yours' skills/tanto/SKILL.md` prints `1`,
the YAML load prints the three keys and `ok`, lint is clean on
`skills/tanto/SKILL.md`, and the commit carries its `Co-Authored-By:`
trailer.

---

### Task 6: SKILL.md — the config, the definitions, the limit rule, and the effort read

**Batch:** B. **Blocks:** A6.1, P6.1, P6.2, P6.3, P6.4, P6.5, P6.6.

The cost machinery of `SKILL.md`: the start sequence's check gains its
effort half (Fixed input 2), `tanto.json` becomes `{model, effort}` over
twelve kinds with a per-field overlay, the agent definitions every role
writes at its start are written down, the limit rule arrives as a new
passage at the end of the expected-model config, and the transcript
reading gains the one line the effort is read from. Spec 11.1's
`"Start sequence" / "The expected-model config"`, `"The transcript
reading"`, and second `"The expected-model config"` bullets; the design is
sections 3.1 to 3.3, 4.1, 9.1, and the start line of 3.2.

Two of these passages act on the same three lines in order: **P6.3**
inserts the limit rule after the "Every subagent dispatch names a `model`"
paragraph as that paragraph stands today, and **P6.4** then rewrites those
three lines. Apply them in that order and both old blocks match.

Task 5 edits the same file and owns the frontmatter, the preamble's
role-file count, the roles table, the whole Invocation section — including
the sentence saying that `/tanto fukki` skips the start sequence, which
names this task's section but belongs to Invocation — and the closing
pointer. This task touches none of them.

**Files:**

- Modify: `skills/tanto/SKILL.md` — six passages: the model check of the
  start sequence, the body of "The expected-model config", the limit rule
  inserted after it, the dispatch paragraph, one line in the transcript
  reading's shell block, and the bullet that explains it.

**Interfaces:**

- Consumes, from task 5: nothing. The two tasks touch disjoint regions of
  one file, and neither reads the other's text.
- Produces, for task 8 (`roles/kanri.md`, batch C) and tasks 17 to 19 (the
  templates, batch E): the twelve kind names, the
  `~/.claude/agents/tanto-<object>-<act>.md` path the definitions live at,
  the start line's `agents:` clause, and the `paused:` / `continue:`
  vocabulary those files cite.
- markdownlint **does** run on `skills/tanto/SKILL.md` — the ignore list
  covers `docs/superpowers/**` and `skills/tanto/templates/**`, not this
  file — so the lint step is a real markdownlint run with `--fix`.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/SKILL.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The anchor and the model check**

**A6.1** `skills/tanto/SKILL.md` — `grep -cF 'A limit is a pause, never a model change' skills/tanto/SKILL.md` — before: 0, after: 1

**P6.1** `skills/tanto/SKILL.md` — replace exactly these 7 lines

```text
### 1. Model check

Read the expected-model config below and compare `sessions.<role>` with your
own model id, which your system prompt states. A value matches when it is a
substring of that id. On a mismatch, tell the human what was expected and what
is running, ask them to run `/model <family>` and then `/tanto` again, and
stop. The check warns only. Never switch a model.
```

**P6.1 →**

```text
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
```

- [ ] **Step 3: The expected-model config**

**P6.2** `skills/tanto/SKILL.md` — replace exactly these 28 lines

```text
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
```

**P6.2 →**

```text
## The expected-model config

`$CLAUDE_CONFIG_DIR/tanto.json`, or `~/.claude/tanto.json` when that variable
is unset. Two maps, two mechanisms. Every value is
`{ "model": <family>, "effort": <level> }`, or a bare string, which means that
model with the effort from the defaults.

- `sessions.<role>` is **advisory**. The checks above and Kanri's handshake
  check compare against it. Nothing switches a session's model or its effort.
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

The effort vocabulary is the harness's — `low`, `medium`, `high`, `xhigh`,
`max` — and the family vocabulary is the Agent tool's.

The skill ships built-in defaults at `templates/tanto.json`, derived from the
family ladder `fable > opus > sonnet > haiku` (as of 2026-09). Read the
personal file and overlay it on the defaults **field by field**: a personal
`{"effort":"medium"}` under `subagents.task.implement` changes that effort and
keeps the default model. A partial personal file is complete; an absent file
is the case where every key is a default. A key that names no role and no
kind — an older file's, for instance — is reported in your start line as
`unknown key <name>, ignored` and otherwise ignored.

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
`subagent_type: tanto-<object>-<act>`.

Say once, in your start line, which file you read; which keys came from the
defaults, at the granularity of a field, or `no tanto.json at <path>, all
keys built-in defaults`; the ladder result if the check failed; and
`agents: <n> current, <m> written, <k> not visible to this session`, with the
kinds named when `<k>` is above zero. This is information, not a warning: the
human is told once and the session carries on.
```

- [ ] **Step 4: The limit rule, inserted after the section**

**P6.3** `skills/tanto/SKILL.md` — insert after these 3 lines

```text
**Every subagent dispatch names a `model`.** An omitted `model` inherits the
session's model, which on a Kanri, Sekkei, or Kaiseki session is the strongest
family — the exact failure this rule prevents.
```

**P6.3 →**

```text

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
```

- [ ] **Step 5: The dispatch paragraph**

**P6.4** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```text
**Every subagent dispatch names a `model`.** An omitted `model` inherits the
session's model, which on a Kanri, Sekkei, or Kaiseki session is the strongest
family — the exact failure this rule prevents.
```

**P6.4 →**

```text
**Every subagent dispatch names a `model`**, and a `subagent_type` from the
definitions when this session sees them. An omitted `model` inherits the
session's model, which on a Sekkei, Kikaku, or Kaiseki session is the
strongest family — the exact failure this rule prevents. A kind this session
cannot see is dispatched with `model` alone, and its effort is the session's.
```

- [ ] **Step 6: The effort line in the transcript reading**

**P6.5** `skills/tanto/SKILL.md` — insert after this 1 line

````text
echo "transcript: $b B, $r records, $w wake-ups, $c compactions"
````

**P6.5 →**

````text
e=$(grep '"type":"assistant"' "$T" | tail -n 1 | grep -oE '"(perTurnEffort|effort)":"[a-z]+"' | sort -r | head -n 1 | cut -d'"' -f4); echo "effort=${e:-unknown}"
````

- [ ] **Step 7: What that line reads**

**P6.6** `skills/tanto/SKILL.md` — insert after these 6 lines

````text
- **Compactions** are the wake-ups whose text begins with the harness's
  phrase. The check is on the record type and the text's first characters; a
  plain grep for the phrase over-counts, because the phrase also appears in
  tool output and in this file. The phrase is the harness's and may change: a
  reworded one reads as `0`, and a compaction the session notices for itself
  is still the signal it always was.
````

**P6.6 →**

````text
- **Effort** is not one of the four figures. It is the last `assistant`
  record's `perTurnEffort`, or its `effort` when that field is absent — the
  `sort -r` puts `perTurnEffort` first when the record carries both — and
  `unknown` when the transcript is unavailable or has neither. The start
  sequence's check and the handshake's `effort=` take it; the reading itself
  travels without it.
````

- [ ] **Step 8: Lint**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint
runs with `--fix`, and a fix that rewrote a line inside a passage would
leave `passage-check verify` reading text the plan does not contain. If it
fixes anything, re-author the block it touched rather than leaving the file
and the plan disagreeing.

- [ ] **Step 9: Commit**

```bash
git commit --only skills/tanto/SKILL.md -m "docs(tanto): model and effort config, agent definitions, and the limit rule" -m "tanto.json values become {model, effort} over the twelve kinds with a per-field overlay, the agent definitions every role writes at its start are written down, a limit is a pause rather than a model change, and the transcript reading prints the effort the start sequence and the handshake take. Spec 11.1, with sections 3.1 to 3.3, 4.1, and 9.1." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 10: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 11: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 6
```

Expected: `task 6: verify clean`.

**Done when:** the six passages are present in `skills/tanto/SKILL.md`, the
four commands of the transcript reading's shell block are unchanged beside
the new fifth line,
`grep -cF 'A limit is a pause, never a model change' skills/tanto/SKILL.md`
prints `1`, lint is clean on `skills/tanto/SKILL.md`, and the commit
carries its `Co-Authored-By:` trailer.

---

### Task 7: `SKILL.md` — the handshake, the roster, Resuming, Messages, Human access

**Batch:** B. **Blocks:** A7.1, P7.1, P7.2, P7.3, P7.4, P7.5, P7.6, P7.7,
P7.8, P7.9, P7.10, P7.11, P7.12, P7.13, P7.14.

This task carries the middle of `SKILL.md` — everything a session does after
its start sequence and before it exits. Spec 11.1 lists the changes:
"Handshake and roster" takes the handshake line and the roster columns of
spec 4.1 and 4.2, so that `effort=` travels with `model=` and the Topic
column exists; "Resuming" takes the resume word of spec 9.2; "Messages" takes
the boundary reply, the rewritten `review-ready:` paragraph of spec 6, and
the enumerations that grow from four roles to seven; "Human access" takes the
four standing grants of spec 2.2, 2.4, and 2.5, and Kikaku's exemption from
spec 2.1.

The one passage that is not new wording is P7.13. Spec 6 moves the brief's
form check out of `roles/kanri.md` Human access step 5 and into `SKILL.md`
under a new heading, "The brief's form", so that Sekkei and Keikaku cite one
copy instead of two. It is copied out of `roles/kanri.md` with `sed -n`, and
only what the new home requires is changed: the subject of the first sentence
becomes the document's author in place of Kanri's imperative; "your cold
read" becomes "Kanri's cold read", since the author is not Kanri; the two
closing sentences about sending Sekkei `brief: <path>` are dropped, because
spec 6 removes that reply; and the text is de-indented out of its numbered
list item and re-wrapped at the same column, without a word changing. Task 12
of batch C removes the original from `roles/kanri.md`. This task does not
depend on that: between batch B and batch C the form check exists in both
files, which is correct and temporary, and the order is the one the batch cut
fixes — `SKILL.md` whole first, `roles/kanri.md` after it.

**Files:**

- Modify: `skills/tanto/SKILL.md` — fourteen passages: four in "Handshake and
  roster" plus one in its "The address" subsection, three in "Resuming",
  three in "Messages" plus the inserted "The brief's form" subsection, and
  one in "Human access".

**Interfaces:**

- Consumes, from tasks 5 and 6: the Invocation table's `fukki` row and eight
  ids, which "Resuming" here spells as the argument `/tanto fukki`; the roles
  table's seven roles, which the enumerations here name; and the
  expected-model config's `{model, effort}`, which the handshake's new
  `effort=` field is checked against.
- Produces, for task 8: the `review-ready: <document path>; brief: <brief path>`
  line and the author's `brief.write` dispatch, which task 8's Artifacts row
  for the review brief names; and the roster columns its rows assume.
- Produces, for batch C: the `SKILL.md` copy of the brief's form check that
  task 12 removes from `roles/kanri.md`, and the handshake and roster forms
  that `roles/kanri.md` checks against. For batches D and E: the message
  forms and the standing grants the role files cite.
- markdownlint **does** run on `skills/tanto/SKILL.md` —
  `.markdownlint-cli2.yaml` ignores only `docs/superpowers/**` and
  `skills/tanto/templates/**` — so the lint step below is a real check on
  this file, not only the whitespace hooks.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/SKILL.md skills/tanto/roles/kanri.md
```

Expected: `i/lf w/crlf attr/text=auto` on both, and never `w/mixed`.

- [ ] **Step 2: The anchor, and the no-address fallback**

**A7.1** `skills/tanto/SKILL.md` — `grep -cF 'Jisso and Keikaku then' skills/tanto/SKILL.md` — before: 0, after: 1

**P7.1** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```text
Sekkei and Jisso started with no address on the command line read the first
data row of `.tanto/roster.md`, which is Kanri's own row, for it.
Kaiseki with no address is standalone and does not shake hands; an attached
Kaiseki always receives the address on the command line.
```

**P7.1 →**

```text
A Sekkei, Keikaku, or Jisso started with no address on the command line reads
the first data row of `.tanto/roster.md`, which is Kanri's own row, for it,
and so do a Kikaku and a Hosa, whose address argument is optional because the
human opens them and Kanri never requests them.
Kaiseki with no address is standalone and does not shake hands; an attached
Kaiseki always receives the address on the command line.
```

- [ ] **Step 3: The handshake line gains `effort=`**

**P7.2** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
handshake role=<role> name=<name [ref]> cwd=<path> model=<model id> branch=<branch> mode=<auto|unknown> transcript=<absolute path|unavailable>
```

**P7.2 →**

```text
handshake role=<role> name=<name [ref]> cwd=<path> model=<model id> effort=<level|unknown> branch=<branch> mode=<auto|unknown> transcript=<absolute path|unavailable>
```

- [ ] **Step 4: What `effort=` is read from, and what Kanri does with it**

**P7.3** `skills/tanto/SKILL.md` — insert after these 2 lines

```text
`name [ref]` is what `ListAgents` prints for this session on its first line
("This session is `<name> [<ref>]`").
```

**P7.3 →**

```text

`effort=` is read from this session's own transcript: the last record of
`type` `assistant`, its `perTurnEffort` field, or its `effort` field when
that one is absent; `unknown` when the transcript is unavailable. The same
read is the effort half of the start sequence's model check. Kanri compares
`model=` with `sessions.<role>.model` and `effort=` with
`sessions.<role>.effort`; a mismatch of either is one line to the human, and
the handshake still gets its roster row when only the effort differs — the
effort is the human's to change with `/effort` in that window, and the roster
records what runs. A model mismatch is refused, as today.
```

- [ ] **Step 5: Who waits for Kanri's reply**

**P7.4** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```text
Jisso then **waits** for Kanri's reply. It carries the plan path and the ledger
path Jisso cannot start without. Sekkei and Kaiseki start reading while they
wait — the human is in the room, and the reply arrives as a
`<cross-session-message>`.
```

**P7.4 →**

```text
Jisso and Keikaku then **wait** for Kanri's reply. It carries the plan path
and the ledger path Jisso cannot start without, and the topic, the spec path,
and the plan path Keikaku cannot start without. Sekkei, Kikaku, Hosa, and
Kaiseki start reading while they wait — the human is in the room, and the
reply arrives as a `<cross-session-message>`.
```

- [ ] **Step 6: The roster's columns, statuses, and keeping rule**

**P7.5** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```text
The roster lives at `.tanto/roster.md`, is written only by Kanri from
`templates/roster.md`, and has Kanri's row first. Columns are role, name
`[ref]`, cwd, model, branch, mode, started, status, transcript. `ListAgents`
shows name, `[ref]`, kind, and start time — not the cwd, the model, or the
role; the handshake carries those.
```

**P7.5 →**

```text
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
```

- [ ] **Step 7: Who may address whom**

**P7.6** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```text
- **Every other role's address** is known only to Kanri, from the handshake,
  and Kanri is the only session that sends to Jisso, Sekkei, or Kaiseki. A
  reply copies the envelope's `from` into `to` and needs no name at all.
```

**P7.6 →**

```text
- **Every other role's address** is known only to Kanri, from the handshake,
  and Kanri is the only session that sends to Sekkei, Keikaku, Jisso,
  Kaiseki, or Hosa. Kikaku is the human's seat: it sends Kanri a
  `decision: <path>` line and Kanri answers, but Kanri never addresses it
  first. A reply copies the envelope's `from` into `to` and needs no name at
  all.
```

- [ ] **Step 8: The resume word, where the act is named**

**P7.7** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
`/tanto resume`, typed by the human in a window, and the self-check every
```

**P7.7 →**

```text
`/tanto fukki`, typed by the human in a window — `resume` is an accepted
alias of the same id — and the self-check every
```

- [ ] **Step 9: The resume word, in Kanri's own paragraph**

**P7.8** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
  was resumed too, and re-handshakes on its own `/tanto resume`, finding the
```

**P7.8 →**

```text
  was resumed too, and re-handshakes on its own `/tanto fukki`, finding the
```

- [ ] **Step 10: The resume word, after an editor restart**

**P7.9** `skills/tanto/SKILL.md` — replace exactly these 8 lines

```text
After an editor restart, which resumes every window at once, the human types
`/tanto resume` in Kanri's window first and then in each other window, in any
order; no address is pasted. A session whose path matches no row is not a
resumed role: `/tanto resume` says so and stops, and the human runs
`/tanto <role> <address>` there as for a new session.

`/tanto resume` reads this file and nothing else. The role file is already in
the session's context, which is what a resume preserves.
```

**P7.9 →**

```text
After an editor restart, which resumes every window at once, the human types
`/tanto fukki` in Kanri's window first and then in each other window, in any
order; no address is pasted. A session whose path matches no row is not a
resumed role: `/tanto fukki` says so and stops, and the human runs
`/tanto <role> <address>` there as for a new session.

`/tanto fukki` reads this file and nothing else. The role file is already in
the session's context, which is what a resume preserves.
```

- [ ] **Step 11: One boss, over seven roles**

**P7.10** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```text
- One boss. Only Kanri messages Jisso. Sekkei and Kaiseki never do — inbound
  messages queue and drain in order, and a second boss interleaves
  instructions.
```

**P7.10 →**

```text
- One boss. Only Kanri messages Jisso; Sekkei, Keikaku, Kaiseki, Kikaku, and
  Hosa never do — inbound messages queue and drain in order, and a second
  boss interleaves instructions.
```

- [ ] **Step 12: The boundary reply**

**P7.11** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```text
- At a batch boundary Kanri has verified, Sekkei answers in one line,
  `committed <subject>` or `nothing to commit`, each with its reading appended
  after ` — `; Kanri sends the next batch prompt only after that reply, or,
  when the reply is overdue, after the notice of a subscription made then.
```

**P7.11 →**

```text
- At a batch boundary Kanri has verified, Sekkei or Keikaku answers in one
  line, `committed <subject>` or `nothing to commit`, each with its reading
  appended after ` — `; Kanri sends the next batch prompt only after that
  reply, or, when the reply is overdue, after the notice of a subscription
  made then.
```

- [ ] **Step 13: The brief is the author's dispatch**

**P7.12** `skills/tanto/SKILL.md` — replace exactly these 9 lines

```text
- Before the human reviews a spec or a plan, Sekkei sends Kanri
  `review-ready: <path>`. Kanri dispatches the **review brief** on
  `subagents.reviewer` — a read-only subagent that writes
  `.tanto/<topic>/review-brief-spec.md` or `review-brief-plan.md`
  from `templates/review-brief.md`, in the chat's language — checks its form,
  and answers `brief: <path>`. Sekkei puts the brief's text verbatim in its
  review request, with both paths. The human's answers to the brief's points
  are the confirmation that review asks for; the document is what the points
  point into, and the human reads it where a point sends them.
```

**P7.12 →**

```text
- Before the human reviews a spec or a plan, the document's author dispatches
  the **review brief** on `brief.write` — a read-only subagent that writes
  `.tanto/<topic>/review-brief-spec.md` for Sekkei, or `review-brief-plan.md`
  for Keikaku, from `templates/review-brief.md`, in the chat's language —
  checks its form against "The brief's form" below, and sends Kanri one line,
  `review-ready: <document path>; brief: <brief path>`, which waits for
  nothing: Kanri records it in the ledger's Session events and does nothing
  else. The author puts the brief's text verbatim in its review request, with
  both paths. The human's answers to the brief's points are the confirmation
  that review asks for; the document is what the points point into, and the
  human reads it where a point sends them.
```

- [ ] **Step 14: The brief's form, moved from `roles/kanri.md`**

Copy the old text first, so that the new passage is the file's own bytes and
not a retyping:

```bash
sed -n '717,736p' skills/tanto/roles/kanri.md
```

That range opens mid-sentence — the clause before `Check the brief's form` is
step 5's dispatch half, which stays — and closes on the sentence that sends
Sekkei the `brief:` reply, which spec 6 removes. Everything between is word
for word the new passage, apart from the sentence's new subject and
`Kanri's cold read` for `your cold read`. The original stays in
`roles/kanri.md` until task 12 of batch C takes it out.

**P7.13** `skills/tanto/SKILL.md` — insert after these 4 lines

```text
Kanri answers a bug report with one line, in one of five forms:
`triage: issue-<id>`, `triage: redirect — <one line>`,
`triage: kaiseki requested`, `triage: hotfix — <commit subject>`, and
`triage: relayed as I-<n>`.
```

**P7.13 →**

```text

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
```

- [ ] **Step 15: The four standing grants**

**P7.14** `skills/tanto/SKILL.md` — replace exactly these 9 lines

```text
The human's counterpart is Kanri. By default a role has no human access:
Jisso and an attached Kaiseki never address the human unless granted, and a
role addresses the human directly only for what needs the human's eyes or
hands — a visual check in a browser or a GUI, an OS dialog, a credential — and
only after Kanri has judged it necessary and granted it for that scope. Two
standing grants exist: Sekkei's spec and plan dialogue, given at its creation
and named in Kanri's orders line; and an attached Kaiseki's debugging
conversation, written in its brief. A standalone Kaiseki has no Kanri, and the
human in the room is its counterpart.
```

**P7.14 →**

```text
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
```

- [ ] **Step 16: Lint**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 17: Commit**

```bash
git commit --only skills/tanto/SKILL.md -m "docs(tanto): SKILL.md — the handshake, the roster, fukki, the messages, and human access" -m "The handshake carries effort=; the roster gains Topic, Effort, and cleared; Resuming reads /tanto fukki; the review brief is the author's dispatch and the form check moves in under The brief's form; four standing grants." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 18: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 19: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 7
```

Expected: `task 7: verify clean`.

**Done when:** the fourteen passages are present in `skills/tanto/SKILL.md`,
`grep -cF 'Jisso and Keikaku then' skills/tanto/SKILL.md` prints `1`, the
string `/tanto resume` is gone from the Resuming section, `./scripts/lint.sh
skills/tanto/SKILL.md` exits 0, and the commit carries its `Co-Authored-By:`
trailer.

---

### Task 8: `SKILL.md` — Session exit, Artifacts, Workspace, and the Rules

**Batch:** B. **Blocks:** A8.1, P8.1, P8.2, P8.3, P8.4, P8.5, P8.6, P8.7,
P8.8, P8.9, P8.10, P8.11, P8.12, P8.13, P8.14, P8.15, P8.16, P8.17.

This task carries the end of `SKILL.md` — what a session leaves behind, where
it leaves it, and the rules that bound all of it. Spec 11.1 lists the
changes. "Session exit" is rewritten to spec 5: one flow of four steps at
every stage, the exit line `exit proposal: <path> — <reading>`, the stage
words, `exit-keikaku` with no suffix beside `exit-sekkei`, the deletion that
follows the proposal rather than the commit (spec 5.3), and no session
applying the accepted subset of its own proposal (spec 5.2). "Artifacts"
gains the five files the new seats and the new flow produce and corrects the
writers and readers the split moved — the plan to Keikaku, the brief to the
author's dispatch, the ledger to six readers — and its two closing sentences
count thirteen templates and name the instrument's seven subcommands.
"Workspace" takes the branch cut of spec input 12, and "Rules" takes rules 2,
4, and 9 from spec 10, rule 5 from spec 2.1, 2.4, and 5.2, rule 6 from the
agent definitions, and rule 11's starting roles from the split.

Two neighbors are not this task's. The Messages copy of the one-boss sentence
belongs to task 7; rule 1, which states it in one clause, is unchanged and
stays as it is. Rule 2, next to it, is this task's: spec 10 retires
"strong-model" wherever `SKILL.md` says it — rule 9 and rule 2 both — and the
channel it names now carries the shoroku flow's recommendations and
directions (spec 5.1) and is no longer only the top family's, since Keikaku
and Hosa are on `sonnet`. And the `— /clear <name>'s window` reminder lives in
`roles/kanri.md`, which batch C edits. The Artifacts table's rows are one
line each however long, so the passages here are small and several — a row
whose Writer or Readers column changes in a word or two is easier to keep
unique as a two-row block than as a page of the table.

**Files:**

- Modify: `skills/tanto/SKILL.md` — seventeen passages: four in "Session
  exit", seven in "Artifacts", five in "Rules", and one in "Workspace".

**Interfaces:**

- Consumes, from task 7: the `review-ready: <document path>; brief: <brief path>`
  line and the author's `brief.write` dispatch, which the review-brief row
  names; and the roster's Topic column, which the per-topic rows assume.
- Consumes, from tasks 5 and 6: the twelve kinds and the agent definitions of
  the expected-model config, which rule 6 and the `~/.claude/agents/tanto-*.md`
  row name; and the roles table's seven roles.
- Produces, for batches C, D, and E: every path the role files name is a row
  of this table — `.tanto/kikaku/<YYYY-MM-DD>-<slug>.md` for
  `roles/kikaku.md`, `.tanto/<topic>/coldread.md` for `roles/kanri.md`,
  `.tanto/<topic>/spec-draft.md` for `roles/sekkei.md`, and
  `<stage>-recommendation.md` and `<stage>-direction.md` for the shoroku flow
  in `roles/kanri.md` and every exiting role's file. Produces, for the run
  itself: the Rules the batch prompts restate.
- markdownlint **does** run on `skills/tanto/SKILL.md` —
  `.markdownlint-cli2.yaml` ignores only `docs/superpowers/**` and
  `skills/tanto/templates/**` — so the lint step below is a real check on
  this file, not only the whitespace hooks.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/SKILL.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The anchor, and the exit as one flow of four steps**

**A8.1** `skills/tanto/SKILL.md` — `grep -cF 'Hosa edits a tracked file only in a slot Kanri gives' skills/tanto/SKILL.md` — before: 0, after: 1

**P8.1** `skills/tanto/SKILL.md` — replace exactly these 21 lines

```text
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
```

**P8.1 →**

```text
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
   full, in three groups — recommended adopt, recommended reject, unsure —
   each with its destination and its one-line reason.
3. **Check.** Kanri gives the human the path and the three counts in one
   line; the human answers by exception; Kanri writes `<stage>-direction.md`
   beside the recommendation, item by item, with the `S-n` rows in the
   conductor ledger.
4. **Apply.** Kanri dispatches the `shoroku` kind again, in apply mode, with
   the recommendation, the direction, and the commit subject; that subagent
   writes the accepted subset per `docs/AGENTS.md`, lints the changed paths,
   and commits once by explicit path in a slot. No session applies the
   accepted subset of its own proposal. Kanri verifies the diff as for any
   commit and marks the `S-n` rows written.

Nothing is adopted between stages, and no item is decided by Kanri alone: the
human sees the whole recommendation, grouped, at every stage. Candidates are
what is not yet in any file — a rejected alternative and its reason, a fact
measured, a defect noticed, an observation about the run — never a
restatement of a spec, a plan, a report, or a ledger. Kikaku and Hosa have no
exit shoroku; the human `/clear`s those windows instead. A standalone Kaiseki
has no Kanri, and its role file says how.
```

- [ ] **Step 3: The exit lines, and when the session is deleted**

**P8.2** `skills/tanto/SKILL.md` — replace exactly these 12 lines

```text
The lines, each sent without an idle subscription, like every other tanto line.
Kanri sends
`exit: propose your shoroku; write it to <path>`; the session answers with one
line and the path; Kanri sends `exit: direction at <path>`; the session answers
`exit write-out committed: <subject> — <reading>` or
`exit write-out: nothing accepted — <reading>`. A session that has stopped
answering is past answering, and Kanri learns it the way it learns of a missing
batch report — the human says the session is gone, or Kanri's window wakes for
another reason and the answer has not arrived. Kanri then treats the exit as
forced — the roster's Events line says the exit shoroku did not run and what
was lost, as far as Kanri knows — asks the human to delete it, and continues.
Jisso idles through another session's exit; the cost is one boundary.
```

**P8.2 →**

```text
The lines, each sent without an idle subscription, like every other tanto line.
Kanri sends `exit: propose your shoroku; write it to <path>`; the session
writes the proposal, runs the resume self-check, and answers
`exit proposal: <path> — <reading>`. Kanri checks that the file exists and
opens with the exclusion line and a numbered list — `sections` on it, not a
read — and dispatches the recommender at once. When the recommendation is on
disk, Kanri reads its `unsure` group by `sections`: an item there saying the
candidate could not be read as written is one question back to the session,
one line, answered by a rewrite of the proposal; otherwise Kanri asks the
human, as a numbered list, to delete the session. The session idles through
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
```

- [ ] **Step 4: The file pattern, with `exit-keikaku`**

**P8.3** `skills/tanto/SKILL.md` — replace exactly these 8 lines

```text
The file pattern is `exit-<role>[-<suffix>]`, with the suffix the batch letter
for Jisso (`exit-jisso-B`, a Jisso leaving at batch B's boundary), the case
number for Kaiseki (`exit-kaiseki-1`), absent for Sekkei (`exit-sekkei`), and
the date and the bare name for Kanri (`exit-kanri-<YYYY-MM-DD>-<name>`); the
conductor ledger's Stage values mirror it. The files live in the topic
directory, `.tanto/<topic>/`, for Jisso, Sekkei, and an attached Kaiseki, and
next to the roster, at `.tanto/`, for Kanri. Kanri's exit has a proposal file
but no direction file, because it rules on itself.
```

**P8.3 →**

```text
The file pattern is `exit-<role>[-<suffix>]`, with the suffix the batch letter
for Jisso (`exit-jisso-B`, a Jisso leaving at batch B's boundary), the case
number for Kaiseki (`exit-kaiseki-1`), absent for Sekkei (`exit-sekkei`) and
for Keikaku (`exit-keikaku`), and the date and the bare name for Kanri
(`exit-kanri-<YYYY-MM-DD>-<name>`); the conductor ledger's Stage values mirror
it. The files live in the topic directory, `.tanto/<topic>/`, for Jisso,
Sekkei, Keikaku, and an attached Kaiseki, and next to the roster, at
`.tanto/`, for Kanri. Kanri's own exit has a recommendation and a direction
file like every other, with the human checking as at every stage.
```

- [ ] **Step 5: Whose commit carries the subject**

**P8.4** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```text
The write-out commit's subject begins with `docs: exit shoroku` or
`docs: T<n> shoroku` — `docs: exit shoroku for jisso at B`,
`docs: T2 shoroku for <topic>` — which is the fixed prefix the whole-branch
review package excludes.
```

**P8.4 →**

```text
The apply subagent's commit subject begins with `docs: exit shoroku` or
`docs: T<n> shoroku` — `docs: exit shoroku for jisso at B`,
`docs: T2 shoroku for <topic>` — which is the fixed prefix the whole-branch
review package excludes.
```

- [ ] **Step 6: The spec, the draft, and the plan**

**P8.5** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
| the spec, at the path the orders line names — by default `docs/superpowers/specs/<date>-<topic>-design.md` | Sekkei | Kanri, Jisso | the spec; committed |
| the plan, at the path the orders line names — by default `docs/superpowers/plans/<date>-<topic>.md` | Sekkei | Kanri, Jisso | the plan; committed; carries Global Constraints, a Batches section, and how a batch is verified |
```

**P8.5 →**

```text
| the spec, at the path the orders line names — by default `docs/superpowers/specs/<date>-<topic>-design.md` | Sekkei | Kanri, Keikaku, Jisso | the spec; committed by Sekkei, or by the Keikaku created after the merge when it was a draft |
| `.tanto/<topic>/spec-draft.md` | Sekkei | the spec reviewer, Kanri, Keikaku | the spec while another topic's batch is in flight; nothing is committed and no branch is cut until Keikaku commits it at its final path |
| the plan, at the path the orders line names — by default `docs/superpowers/plans/<date>-<topic>.md` | Keikaku | Kanri, Jisso | the plan; committed; carries Global Constraints, a Batches section, and how a batch is verified |
```

- [ ] **Step 7: Kikaku's decision file, and the ledger's readers**

**P8.6** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
| `.tanto/inbox/<date>-<slug>.md` | Kanri | Kanri | a bug report received, with its Triage section |
| `.tanto/<topic>/kanri.md` | Kanri | Sekkei, Jisso, Kaiseki | the conductor ledger; it never moves |
```

**P8.6 →**

```text
| `.tanto/inbox/<date>-<slug>.md` | Kanri | Kanri | a bug report received, with its Triage section |
| `.tanto/kikaku/<YYYY-MM-DD>-<slug>.md` | Kikaku | Kanri | one decision from the human's consultation, from `templates/kikaku-decision.md`; named to Kanri as `decision: <path>`, and from there a T0 input, an `I-n`, or an `S-n` source |
| `.tanto/<topic>/kanri.md` | Kanri | Sekkei, Keikaku, Jisso, Kaiseki, Kikaku, Hosa | the conductor ledger; it never moves |
```

- [ ] **Step 8: The brief, the dry run, and the cold read**

**P8.7** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
| `.tanto/<topic>/review-brief-spec.md`, `.tanto/<topic>/review-brief-plan.md` | the brief writer Kanri dispatches | Kanri, then the human through Sekkei | the review brief, from `templates/review-brief.md`, in the chat's language |
| `.tanto/<topic>/plan-dryrun.md` | Sekkei | the plan reviewer, Kanri | from `lint` and `replay` — the two commands, each one's output, and Sekkei's ruling on every failure |
```

**P8.7 →**

```text
| `.tanto/<topic>/review-brief-spec.md`, `.tanto/<topic>/review-brief-plan.md` | the brief writer the document's author dispatches | the author, then the human; Kanri by the path in `review-ready:` | the review brief, from `templates/review-brief.md`, in the chat's language |
| `.tanto/<topic>/plan-dryrun.md` | Keikaku | the plan reviewer, Kanri | from `lint` and `replay` — the two commands, each one's output, and Keikaku's ruling on every failure |
| `.tanto/<topic>/coldread.md` | the `plan.coldread` subagent Kanri dispatches | Kanri, by `sections` | the cold read of the committed plan: a numbered list of open questions, or `none`; Kanri sends Keikaku one line per question |
```

- [ ] **Step 9: The proposals, the recommendation, and the direction**

**P8.8** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```text
| `.tanto/<topic>/shoroku-proposal.md` | Jisso | Kanri | the T2 proposal, written to a file instead of printed |
| `.tanto/<topic>/shoroku-direction.md` | Kanri | Jisso | Kanri's answer to that proposal, item by item |
| `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | the exiting session | Kanri | the exit shoroku proposal |
| `.tanto/<topic>/exit-<role>[-<suffix>]-direction.md` | Kanri | the exiting session | Kanri's answer, item by item |
```

**P8.8 →**

```text
| `.tanto/<topic>/shoroku-proposal.md` | Jisso | Kanri, the recommender | the T2 proposal, written to a file instead of printed |
| `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | the exiting session | Kanri, the recommender | the exit shoroku proposal, opening with the line that says what it excludes |
| `.tanto/<topic>/<stage>-recommendation.md`, or `.tanto/t0-recommendation.md` and Kanri's own exit at `.tanto/` | the `shoroku` recommender Kanri dispatches | Kanri, the human, the apply subagent | every candidate once, quoted in full, in three groups — recommended adopt, recommended reject, unsure — each with its destination and its one-line reason |
| `.tanto/<topic>/<stage>-direction.md`, beside the recommendation | Kanri, from the human's answer | the apply subagent | what the human accepted, item by item; the apply never runs without it |
```

- [ ] **Step 10: The agent definitions**

**P8.9** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
| `$CLAUDE_CONFIG_DIR/tanto.json` | the user | every role at start, Kanri at each handshake | the personal expected-model config |
```

**P8.9 →**

```text
| `$CLAUDE_CONFIG_DIR/tanto.json` | the user | every role at start, Kanri at each handshake | the personal expected-model config |
| `~/.claude/agents/tanto-*.md`, or `$CLAUDE_CONFIG_DIR/agents/` when that variable is set | every role at its start, from the merged config | the harness, at the next session start | one definition per kind, from `templates/agent.md`; a definition is dispatchable only from the sessions started after it was written |
```

- [ ] **Step 11: Thirteen templates**

**P8.10** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```text
Templates are copied and filled, never restated in prose. There are eleven:
`templates/roster.md`, `templates/roster-archive.md`, `templates/kanri.md`,
`templates/kanri-handover.md`, `templates/bug-report.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/review-brief.md`, and `templates/tanto.json`.
```

**P8.10 →**

```text
Templates are copied and filled, never restated in prose. Thirteen of them:
`templates/roster.md`, `templates/roster-archive.md`, `templates/kanri.md`,
`templates/kanri-handover.md`, `templates/bug-report.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/review-brief.md`, `templates/tanto.json`,
`templates/kikaku-decision.md`, and `templates/agent.md`.
```

- [ ] **Step 12: The instrument's seven subcommands, and who runs them**

**P8.11** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```text
The skill also ships one executable, `scripts/passage-check.js`: the instrument
a plan that carries passages checks itself with, run by Sekkei in place of an
agent dry run, by Jisso at every batch boundary, and by the whole-branch
reviewer. It is Node with no dependencies, its tests are beside it and run by
`node --test`, and `roles/sekkei.md` and `roles/jisso.md` name its
subcommands. Its path is written skill-relative, like every other path in
```

**P8.11 →**

```text
The skill also ships one executable, `scripts/passage-check.js`: the instrument
a plan that carries passages checks itself with, run by Keikaku in place of an
agent dry run, by Jisso at every batch boundary, by Kanri at every boundary it
rules on, and by the whole-branch reviewer. Its seven subcommands are `lint`,
`replay`, `diff`, `verify`, `sections`, `frame`, and `boundary`. It is Node
with no dependencies, its tests are beside it and run by `node --test`, and
`roles/keikaku.md`, `roles/jisso.md`, and `roles/kanri.md` name its
subcommands. Its path is written skill-relative, like every other path in
```

- [ ] **Step 13: Rules 4 and 5**

**P8.12** `skills/tanto/SKILL.md` — replace exactly these 10 lines

```text
4. One set of roles per repo. A session is bound to its cwd — CLAUDE.md,
   memory, and permissions all come from it.
5. Kanri does not edit tracked files while a batch runs, and writes under
   `docs/` only while Jisso is idle or absent. Sekkei writes only under the
   spec and plan directory the orders line names — by default
   `docs/superpowers/` — and `.tanto/`, at any time, and, while a batch is in
   flight, commits only at a batch boundary Kanri has verified; while no batch
   is in flight it commits whenever its work is ready. Kaiseki edits only to
   instrument and leaves the tree clean. Neither writes under the `docs/`
   document-management tree outside that directory, except the accepted subset of its own exit shoroku, at its exit.
```

**P8.12 →**

```text
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
   five writes under the `docs/` document-management tree.
```

- [ ] **Step 14: Rule 6 names the definitions**

**P8.13** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
6. Every subagent dispatch names a `model` from `tanto.json`; none omits it.
```

**P8.13 →**

```text
6. Every subagent dispatch names a `model` from `tanto.json`; none omits it,
   and it names a `subagent_type` from the definitions at
   `~/.claude/agents/tanto-<object>-<act>.md` when this session sees them.
```

- [ ] **Step 15: Rule 9 counts the top family**

**P8.14** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
9. At most two strong-model sessions active at once: Sekkei pauses while
   Kaiseki is active.
```

**P8.14 →**

```text
9. At most two top-family sessions active at once, Kikaku excepted as
   human-paced: Sekkei pauses while Kaiseki is active; Keikaku and Hosa, on
   the cheaper families, do not count.
```

- [ ] **Step 16: Rule 11's starting roles**

**P8.15** `skills/tanto/SKILL.md` — replace exactly these 3 lines

```text
    in view. The roles that start the plan — Jisso at the plan's landing,
    Sekkei before it — read the skill as it stands then, and the authority
    sentence above is what covers them.
```

**P8.15 →**

```text
    in view. The roles that start the plan — Jisso at the plan's landing,
    Keikaku before it, Sekkei before that — read the skill as it stands then,
    and the authority sentence above is what covers them.
```

- [ ] **Step 17: Who cuts the branch**

**P8.16** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
All roles share one working tree and one branch. Sekkei cuts the branch from
`main` before the spec commit, named after the topic; Jisso continues on it;
```

**P8.16 →**

```text
All roles share one working tree and one branch. Sekkei, or Keikaku when the
spec was a draft, cuts the branch from `main` before the first commit, named
after the topic; Jisso continues on it;
```

- [ ] **Step 18: Rule 2, the channel and who is on it**

**P8.17** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
2. Files between the strong-model sessions: the spec, the plan, the conductor
   ledger, the spec inputs, and the Kaiseki reports are the only channel.
```

**P8.17 →**

```text
2. Files between the sessions: the spec, the plan, the conductor ledger, the
   spec inputs, the Kaiseki reports, and the shoroku recommendations and
   directions are the only channel. Every role is on it, not only the ones on
   the top family — Keikaku and Hosa hand over files as the others do.
```

- [ ] **Step 19: Lint**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 20: Commit**

```bash
git commit --only skills/tanto/SKILL.md -m "docs(tanto): SKILL.md — the exit flow, the artifacts, the workspace, and the rules" -m "Session exit is the four-step shoroku flow with the deletion after the proposal; Artifacts gains the Kikaku decision, the spec draft, the cold read, the recommendation and direction, and the agent definitions, and counts thirteen templates and seven subcommands; rules 4, 5, 6, 9, and 11 take the seats and the topics." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 21: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 22: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 8
```

Expected: `task 8: verify clean`.

**Done when:** the seventeen passages are present in `skills/tanto/SKILL.md`,
the string `strong-model` is gone from the Rules section,
`grep -cF 'Hosa edits a tracked file only in a slot Kanri gives' skills/tanto/SKILL.md`
prints `1`, `./scripts/lint.sh skills/tanto/SKILL.md` exits 0, and the commit
carries its `Co-Authored-By:` trailer.

---

### Task 9: Kanri's Start and On a handshake

**Batch:** C. **Blocks:** A9.1, P9.1, P9.2, P9.3, P9.4, P9.5, P9.6, P9.7, P9.8, P9.9, P9.10.

This task rewrites the first two sections of `roles/kanri.md` for the new
matrix. Start gains the agent definitions and the start line of spec 3.2 and
3.3 — with Kanri's own effort checked there, since Kanri sends no handshake
(Fixed input 2) — the roster columns of 4.2, and the topic rule of section 10,
which replaces "only when no plan is in flight" and widens with 4.3's Sekkei
row. On a handshake gains the effort half of check 1 (4.1), the one-live-row
check per role and topic (Fixed input 11), and the orders lines the new seats
read: Keikaku's grant (2.2), the Sekkei draft rule's two sentences (2.3 and
Deferred item 5), and Kikaku's and Hosa's answers (2.1, 2.4), neither session
ever requested by Kanri.

Three passages carry what the sections themselves do not. One gives Kanri's
handling of a `decision:` file (2.1) a home, next to the scope-input relay it
belongs with; spec 11.2 names no section for it. The other two are the file's
opening, which still owns the T0 and T1 write-outs, names three peers, and
claims only a model check: the write-outs are the apply subagent's now (5.1
step 4, 5.2), the peers are the six roles Kanri addresses with Kikaku excluded
(2.1, 7.2), and the effort is checked wherever the model is (Fixed input 2).
The first of the two is written to agree with `SKILL.md`'s roles table as
batch B lands it.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — ten passages: two in the file's
  opening, four in `## Start` (the start line, the bootstrap row, the topic
  rule, the per-topic ledger) and four in `## On a handshake` (checks 1 and 2,
  the orders lines, the refusal paragraph, the relay paragraph).

**Interfaces:**

- Consumes, from batch B (`skills/tanto/SKILL.md`): the handshake line with
  `effort=`, the start sequence that writes the agent definitions, the roster
  columns, and the four standing grants.
- Produces, for batch D (`roles/sekkei.md`, `roles/keikaku.md`,
  `roles/kikaku.md`, `roles/hosa.md`): the orders lines those four files read
  back — Sekkei's grant and draft rule, Keikaku's grant, Kikaku's and Hosa's
  answers.
- markdownlint runs on `skills/tanto/roles/kanri.md`; the lint step is real.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kanri.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The anchor and the start line**

**A9.1** `skills/tanto/roles/kanri.md` — `grep -cF 'current, <m> written, <k> not visible' skills/tanto/roles/kanri.md` — before: 0, after: 1

**P9.1** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
1. Read `tanto.json` as `SKILL.md` describes, run `ListAgents` once for your
   own `name [ref]`, and say your start line: the config file and default keys,
   your `name [ref]`, and your bare name as the address.
```

**P9.1 →**

```text
1. Read `tanto.json` as `SKILL.md` describes, write the twelve agent
   definitions from the merged config as its start sequence prescribes, run
   `ListAgents` once for your own `name [ref]`, and say your start line: the
   config file, the keys that came from the defaults, the ladder result if
   that check failed, and
   `agents: <n> current, <m> written, <k> not visible to this session`; your
   own `model` and `effort` against `sessions.kanri`, since you send no
   handshake and this line is the only place your own two values are checked,
   a mismatch of either being one line to the human and nothing switched; and
   your `name [ref]`, with your bare name as the address.
```

- [ ] **Step 3: The bootstrap row's columns**

**P9.2** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
3. If `.tanto/roster.md` is absent, this is the bootstrap: create it
   from `templates/roster.md` with your row first — its Transcript column
   your own transcript path, since you send no handshake — and a Residency
   row carrying today's date, your own reading, and zero counts, then go to step 5.
```

**P9.2 →**

```text
3. If `.tanto/roster.md` is absent, this is the bootstrap: create it
   from `templates/roster.md` with your row first — its Topic column `—`,
   because a topic is a peer's; its Model and Effort columns the two values
   step 1 checked; its Transcript column your own transcript path, since you
   send no handshake — and a Residency
   row carrying today's date, your own reading, and zero counts, then go to step 5.
```

- [ ] **Step 4: The topic rule**

**P9.3** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
5. Only when no plan is in flight — the bootstrap, a kept Kanri between
   plans, or a recovery whose last ledger says closed — open the topic. Take
   it from whatever the human said the next work is — an issue id, a
```

**P9.3 →**

```text
5. Open a topic when every open topic has passed its spec stage — its spec
   review accepted — which the bootstrap, a kept Kanri between plans, and a
   recovery whose last ledger says closed all satisfy. A second topic may
   open while the first is in its plan stage or its batches; only one topic
   has a Jisso and batches in flight at a time, because the checkout belongs
   to the topic in flight. Take the word from whatever the human said the
   next work is — an issue id, a
```

- [ ] **Step 5: One ledger per topic**

**P9.4** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
   fixed, because Sekkei's file names carry it. When a plan is in flight, the
   ledger already exists and is named by the handover or the roster's Events.
```

**P9.4 →**

```text
   fixed, because Sekkei's file names carry it. Each topic keeps its own
   `.tanto/<topic>/kanri.md`, its own Progress line, and its own Batches
   table, and the roster's Topic column says which session belongs to which;
   a topic whose ledger already exists is named by the handover or the
   roster's Events and is not opened again.
```

- [ ] **Step 6: Checks 1 and 2**

**P9.5** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
1. Check `model=` against `sessions.<role>` from `tanto.json`.
2. Check the roster and the listing — no live roster row for that role, and the
   `name [ref]` the handshake carries appears in `ListAgents`.
```

**P9.5 →**

```text
1. Check `model=` against `sessions.<role>.model` and `effort=` against
   `sessions.<role>.effort` from `tanto.json`. A mismatch of either is one
   line to the human saying which of the two differs and what runs.
2. Check the roster and the listing — no live roster row for that role and
   topic, and the
   `name [ref]` the handshake carries appears in `ListAgents`.
```

- [ ] **Step 7: The orders lines**

**P9.6** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

```text
4. Reply with the role's standing orders as **one line carrying the variables**.
   There is no orders file. Sekkei gets the topic, the spec and plan
   locations, and its standing grant,
   `human-access: granted — the spec and plan dialogue — until the plan is committed and the cold read answered`.
   Jisso gets
   `orders: plan=<path> ledger=<path> branch=<b>; read roles/jisso.md in the tanto skill directory`.
   Kaiseki gets the brief path, or `no brief, stop` in a smoke test.
```

**P9.6 →**

```text
4. Reply with the role's standing orders as **one line carrying the variables**.
   There is no orders file.

   - Sekkei gets the topic, the spec location, and its standing grant,
     `human-access: granted — the spec dialogue — until the spec review is accepted`.
     When another topic's batch is in flight, the line says so: the spec is
     written to `.tanto/<topic>/spec-draft.md`, no branch is cut and nothing
     is committed; and it tells the spec reviewer that the in-flight plan's
     paths are out of scope.
   - Keikaku gets the topic, the spec path — committed, or the draft Sekkei
     left — the plan path, and its standing grant,
     `human-access: granted — the plan dialogue — until the plan is committed and the cold read answered`.
   - Jisso gets
     `orders: plan=<path> ledger=<path> branch=<b>; read roles/jisso.md in the tanto skill directory`.
   - Kaiseki gets the brief path, or `no brief, stop` in a smoke test.
   - Kikaku gets your address and the open topics, if any. Hosa gets your
     address and one line, "tracked files only in a slot I give". You request
     neither session: the human opens one when there is something to think
     about or a small job to hand off, and its handshake is the first you
     hear of it.
```

- [ ] **Step 8: The refusal paragraph**

**P9.7** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```text
A second handshake for a role that already has a live row, or a model
mismatch, gets **no row**: record it in the roster as `refused` with an Events
line saying which, and tell the human. A Jisso whose `mode=` is not `auto` also
earns a one-line warning to the human that a batch may stall on a Bash or
commit prompt; peer messages themselves are unaffected.
```

**P9.7 →**

```text
A second handshake for a role and topic that already has a live row, or a
model mismatch, gets **no row**: record it in the roster as `refused` with an
Events line saying which, and tell the human. An effort mismatch alone refuses
nothing: the row is written with the effort that runs, because `/effort` is
the human's to change in that window and the roster records what is there.
A Jisso whose `mode=` is not `auto` also
earns a one-line warning to the human that a batch may stall on a Bash or
commit prompt; peer messages themselves are unaffected.
```

- [ ] **Step 9: What arrives as a file**

**P9.8** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
When the human gives you scope input during spec work, relay it to Sekkei as a
file, not as a paraphrase: append a numbered `I-n` item with your advisory note
to `.tanto/<topic>/spec-inputs.md`, then send Sekkei one line with that path.
That file stays in the topic directory as the spec-phase record.
```

**P9.8 →**

```text
When the human gives you scope input during spec work, relay it to Sekkei as a
file, not as a paraphrase: append a numbered `I-n` item with your advisory note
to `.tanto/<topic>/spec-inputs.md`, then send Sekkei one line with that path.
That file stays in the topic directory as the spec-phase record.

A `decision: <path>` from Kikaku is the human's own thinking arriving as a
file, and your handling is one of three: a topic in its spec stage takes it as
the next `I-n` in that topic's `spec-inputs.md`; between plans it is a T0
input document; otherwise it is a source row in the `S-n` table. Note
`decision: <path> received from <name>` in the roster's Events either way. You
never send to Kikaku: it is the human's seat, not yours.
```

- [ ] **Step 10: What you own, and whom you talk to**

**P9.9** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```text
You manage this repository's tanto run. You own the roster, the conductor
ledger, the batch prompts, the rulings, shoroku adoption and the T0 and T1
write-outs, the exit directions, the bug intake, and every lifecycle request.
You talk to the human, Sekkei, Jisso, and Kaiseki, and you are the only role
that messages Jisso. You are the human's counterpart: a peer reaches the human
only under a grant of yours ("Human access" below).
```

**P9.9 →**

```text
You manage this repository's tanto run. You own the roster, the conductor
ledger, the batch prompts, the rulings, the shoroku recommendations and the
directions, the exit directions, the bug intake, and every lifecycle request;
the write-out itself is the apply subagent's work, at every stage.
You talk to the human, Sekkei, Keikaku, Jisso, Kaiseki, and Hosa, and you are
the only role that messages Jisso; Kikaku is the human's seat and hears
nothing from you. You are the human's counterpart: a peer reaches the human
only under a grant of yours ("Human access" below).
```

- [ ] **Step 11: The check you have already done**

**P9.10** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
You have done the model check. You do not shake hands — you receive handshakes.
```

**P9.10 →**

```text
You have done your own model and effort check, in your start line. You do not
shake hands — you receive handshakes.
```

- [ ] **Step 12: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 13: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md -m "docs(tanto): kanri Start and On a handshake for the new matrix" -m "The agent definitions and the effort check in the start line, the roster columns, the topic rule, and the orders lines for Sekkei, Keikaku, Kikaku, and Hosa (spec 3.2, 3.3, 4.1, 4.2, 4.3, 10)." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 14: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 15: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 9
```

Expected: `task 9: verify clean`.

**Done when:** the ten passages are present in `roles/kanri.md`, A9.1's
needle counts 1, `./scripts/lint.sh skills/tanto/roles/kanri.md` exits 0, and
the commit carries its `Co-Authored-By:` trailer.

---

### Task 10: Kanri's cold read, batch loop, and final batch

**Batch:** C. **Blocks:** A10.1, P10.1, P10.2, P10.3, P10.4, P10.5, P10.6, P10.7, P10.8, P10.9, P10.10, P10.11, P10.12.

This task takes the three sections that run a plan. When the plan lands: the
line now comes from Keikaku, the `awk` gives way to `frame` (spec 8.2,
issue-ac9d), the cold read becomes the `plan.coldread` dispatch of 7.1 with
its six inputs and its output file read by `sections`, and T1 becomes the four
steps of section 5 over the spec's own four sections (5.1 step 1). The batch
loop: step 2 becomes the two commands of 7.3, step 3 reads the report by
`sections` and copies candidates into the `S-n` table as `pending` at Stage
`t2` instead of ruling on them, step 6 carries the reminder of 4.4, step 7's
commit window names the shoroku apply subagent's slot and Hosa's (2.4, 5.1
step 4), and step 8's Models line restates the four `task.*` kinds (7.3, 1.2).
The final batch dispatches `branch.review` and runs T2 as section 5.

Two sentences move with them, per spec 11.2: the conflicting report's
cold-read question goes to Keikaku, and the plan's own reading is the stage 1
frame rather than the whole file.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — twelve passages: four in
  `## When the plan lands`, six in `## The batch loop`, two in
  `## The final batch`.

**Interfaces:**

- Consumes, from batch A (`scripts/passage-check.js`): the usage forms of
  `sections`, `frame`, and `boundary`, which this text names verbatim. From
  batch B (`SKILL.md`): the vocabulary — the twelve kinds with their
  `subagent_type` names, the stage words, and the `S-n` table's Adopted
  values `pending`, `yes`, `no`.
- Produces, for batch E: the batch prompt's Models line, which
  `templates/batch-prompt.md` must match, and the Adopted and Stage values
  `templates/kanri.md` carries. For batch D (`roles/keikaku.md`): the
  `plan committed:` line Kanri answers and the one-line cold-read questions
  Keikaku replies to with a pointer.
- markdownlint runs on `skills/tanto/roles/kanri.md`; the lint step is real.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kanri.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The anchor and the plan-committed line**

**A10.1** `skills/tanto/roles/kanri.md` — `grep -cF 'for its pass or fail lines and the failing output' skills/tanto/roles/kanri.md` — before: 0, after: 1

**P10.1** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
Sekkei sends you one line,
`plan committed: <plan path>; dryrun: <dry-run path> — <reading>`, naming the
plan and the dry-run report.
```

**P10.1 →**

```text
Keikaku sends you one line,
`plan committed: <plan path>; dryrun: <dry-run path> — <reading>`, naming the
plan and the dry-run report.
```

- [ ] **Step 3: `frame` in place of the `awk`**

**P10.2** `skills/tanto/roles/kanri.md` — replace exactly these 20 lines

````text
The frame command, from the repository root, with `P` the plan path:

```bash
awk '{
  if (s) {
    if (f) {
      if (match($0, /^`+/) && RLENGTH == k && $0 ~ /^`+[ \t]*$/) f = 0
      n++; next
    }
    if ($0 ~ /^##/) { s = 0; print "[steps: " n " lines]" }
    else {
      if (match($0, /^`{3,}/)) { f = 1; k = RLENGTH }
      n++; next
    }
  }
  if ($0 ~ /^### Task/) t = 1; else if ($0 ~ /^## /) t = 0
  if (t && $0 ~ /^- \[ \] \*\*Step/) { s = 1; n = 1; next }
  print
} END { if (s) print "[steps: " n " lines]" }' "$P"
```
````

**P10.2 →**

````text
Your own reading of the plan is its stage 1 frame, from the repository root:

```bash
node "$TANTO/scripts/passage-check.js" frame --plan <plan path> --stage 1
```

That prints the headings, Global Constraints, the Batches table, How a batch
is verified, and the Self-Review — what the batch prompts and the boundary
need, and nothing else. `--stage 2` prints each task's head and its step
count; `--task <N>` prints one task whole, which is how you read a passage
block by its id, on demand. You never read the plan whole.
````

- [ ] **Step 4: The cold read as a dispatch**

**P10.3** `skills/tanto/roles/kanri.md` — replace exactly these 18 lines

```text
1. Cold-read the spec whole and the plan's **frame** — everything outside the
   task steps: Global Constraints, File structure, each task's head down to its
   first step, Batches, How a batch is verified, the sweeps, and the
   Self-Review — as the frame command above prints it. The steps' commands
   and their outputs you take on Sekkei's dry-run report,
   `.tanto/<topic>/plan-dryrun.md`, which the plan-committed line
   names, and a passage block you need you read from the plan by its id, on
   demand — never the report whole, which is larger than the frame; plus one
   command of your own that checks every anchor the plan names against the
   tree; a plan that has no dry-run report is read whole.
   Send Sekkei one line per open question. Wait for its pointer: it answers by
   editing the plan or the spec, never by explaining in a message. If the plan
   edits this skill's own files,
   record as `R-n`, before any batch prompt or subagent is dispatched, that
   the run's sessions follow the constraints, your orders line, and the
   batch prompts rather than the role text on disk, and the boundary the plan
   names for a role start or replacement (contract rule 11); every batch
   prompt and a handover file then carry it.
```

**P10.3 →**

```text
1. **The cold read is a dispatch, not your reading.** Dispatch the
   `plan.coldread` kind — `subagent_type: tanto-plan-coldread`, with the
   model `tanto.json` gives it — naming: the spec path; the plan path; the
   frame, as `frame --stage 1` and `--stage 2` print it; the dry-run report,
   `.tanto/<topic>/plan-dryrun.md`, which the plan-committed line
   names; one command of your own that checks every anchor the plan names
   against the tree; and the output path, `.tanto/<topic>/coldread.md`. The
   subagent reads the spec whole and the frame, spot-checks the dry-run
   report, and writes a numbered list of open questions, or `none`. Read that
   file by `sections`, send Keikaku one line per question, and wait for its
   pointer: it answers by editing the plan or the spec, never by explaining in
   a message — the spec is on the branch and Sekkei is gone. If the plan
   edits this skill's own files,
   record as `R-n`, before any batch prompt or subagent is dispatched, that
   the run's sessions follow the constraints, your orders line, and the
   batch prompts rather than the role text on disk, and the boundary the plan
   names for a role start or replacement (contract rule 11); every batch
   prompt and a handover file then carry it.
```

- [ ] **Step 5: T1**

**P10.4** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
3. Do the T1 write-out — see "Shoroku" below.
```

**P10.4 →**

```text
3. Run T1: the four steps of "Shoroku" below, whose candidates are the spec's
   own four sections — Requirements, The ADRs, Deferred items, and Shoroku
   candidates from this spec work. Nothing is copied; the recommender reads
   those four sections of the spec by name.
```

- [ ] **Step 6: The boundary's two commands**

**P10.5** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```text
2. **Verify the tree before reading the report.** `git status` clean; the
   commits and their trailers as claimed; the plan file in the state this batch
   should have left it; repo-specific leftovers such as stray processes or temp
   directories; a spot check of the claimed tests. You verify in place — there
   is no worktree.
```

**P10.5 →**

````text
2. **Verify the tree before reading the report**, with two commands:

   ```bash
   node "$TANTO/scripts/passage-check.js" boundary --plan <plan path>
   node "$TANTO/scripts/passage-check.js" diff --plan <plan path> --base <merge base>
   ```

   `boundary` runs the plan's own verification list in order, `git status`
   clean and the commits' trailers being the first two checks it prints;
   `diff` accounts for the branch's changed lines against the passages the
   plan carries. Read each for its pass or fail lines and the failing output
   only. What no command knows about you check yourself: repo-specific
   leftovers such as stray processes or temp directories, and a spot check of
   the claimed tests. You verify in place — there is no worktree.
````

- [ ] **Step 7: The report, read by its sections**

**P10.6** `skills/tanto/roles/kanri.md` — replace exactly these 13 lines

```text
3. Read the report. For each item under "Rulings needed": a **known cause** you
   rule on yourself, recorded as `R-n` in the ledger with what it costs if
   wrong and which later tasks inherit it; an **unknown cause** opens the
   Kaiseki branch below; a **scope or spec change** goes to the human. Then
   adopt or reject each shoroku candidate per the adoption rule, and update the
   ledger's `S-n` table, its Batches row, and its Progress line.

   A **measurement** report — one whose deliverable is what a tool actually did
   — is read for whether its outcome **contradicts** the brief's prediction. A
   real run usually does, somewhere; a report that confirms every expectation
   deserves a second look rather than a faster approval, because a
   reconstruction is built from the same brief the prediction came from
   (issue-f2ec).
```

**P10.6 →**

````text
3. Read the report **by its sections**, never whole, in the order the batch
   prompt prescribes — For Kanri, Rulings, Questions for the human, Deviations
   from the plan, Shoroku candidates — with one call:

   ```bash
   node "$TANTO/scripts/passage-check.js" sections --file <path> <heading> [<heading>...]
   ```

   For each item under "Rulings needed": a **known cause** you
   rule on yourself, recorded as `R-n` in the ledger with what it costs if
   wrong and which later tasks inherit it; an **unknown cause** opens the
   Kaiseki branch below; a **scope or spec change** goes to the human. Then
   copy each shoroku candidate into the ledger's `S-n` table with Adopted
   `pending` and Stage `t2` — bookkeeping, not a ruling: nothing is adopted
   between stages, and the recommendation and the human's check at T2 rule on
   the whole list at once — and update the ledger's Batches row and its
   Progress line.

   A **measurement** report — one whose deliverable is what a tool actually did
   — is read for whether its outcome **contradicts** the brief's prediction. A
   real run usually does, somewhere; a report that confirms every expectation
   deserves a second look rather than a faster approval, because a
   reconstruction is built from the same brief the prediction came from
   (issue-f2ec). When the batch carried a measurement task, name that report's
   Tasks and Verification sections in the same `sections` call and read them
   for the contradiction: named sections, not the file.
````

- [ ] **Step 8: The lifecycle step and the reminder**

**P10.7** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```text
6. **Check the lifecycle tables and the handover trigger.** Rewrite the
   roster's Residency row from your own reading and from the readings the peers
   sent. If a create request is due, make it, unless a
   handover trigger has fired, in which case the successor makes it from the
   handover's Next step. If a delete or a replace of a live, coherent session
   is due, or a handover trigger has fired, run the proposal half of "Exit
   shoroku" now: send the `exit:` lines, rule on the proposals, write the
   directions. Delete requests wait for step 7.
```

**P10.7 →**

```text
6. **Check the lifecycle tables and the handover trigger.** Rewrite the
   roster's Residency row from your own reading and from the readings the peers
   sent. If a create request is due, make it, unless a
   handover trigger has fired, in which case the successor makes it from the
   handover's Next step. If a delete or a replace of a live, coherent session
   is due, or a handover trigger has fired, run the proposal half of "Exit
   shoroku" now: send the `exit:` lines, check each proposal and dispatch its
   recommender, and write the direction once the human has answered. Delete
   requests wait for step 7.

   Whenever a Kikaku, Hosa, or Kaiseki row is `live` and that session has
   reported to you and gone idle, your next line to the human — this
   boundary's report, a create or delete request, any line — ends with
   `— /clear <name>'s window` for a Kikaku or Hosa, or
   `— delete <name> after its exit shoroku` for a Kaiseki. Write
   `idle since <HH:MM>` in that row's Status, so that the reminder is not
   forgotten across a wake-up.
```

- [ ] **Step 9: The commit window's slots**

**P10.8** `skills/tanto/roles/kanri.md` — replace exactly these 15 lines

```text
7. **The commit window.** One committer at a time, in this order, Jisso idle
   throughout. (a) Each exiting session applies its direction and commits; you
   verify the diff and only then ask the human to delete that session. (b) Your
   own edits — the hotfix, the issues from step 4, and your own exit shoroku
   when a handover is due — each committed by you in its turn. (c) Tell Sekkei
   the boundary is verified, naming any Kaiseki create or delete since the
   last boundary, then wait for Sekkei's one-line reply —
   `committed <subject> — <reading>` or `nothing to commit — <reading>`;
   subscribe to its idle only
   when the reply is overdue, and record in the ledger's Session events if a
   notice came without a reply; skip (c) when Sekkei is not live. If a
   handover is due, the window ends, after the wait Timing prescribes, with
   steps 2 to 4 of "The handover, in a plan and between plans" — the exit
   shoroku was step 6's proposal and slot (b)'s commit — and the loop stops
   here; the next prompt is the successor's.
```

**P10.8 →**

```text
7. **The commit window.** One committer at a time, in this order, Jisso idle
   throughout. (a) The apply subagent's slot: for each stage whose direction
   is written, dispatch the `shoroku` kind in apply mode with the
   recommendation, the direction, and the commit subject, and verify its
   commit as you verify any — `git status` clean, the diff's paths those the
   direction names, lint on them. The session whose shoroku it is has already
   been deleted; it waits for nothing. (b) Your
   own edits — the hotfix, the issues from step 4, and your own exit shoroku
   when a handover is due — each committed by you in its turn, or handed to a
   live Hosa as `chore: <what> — <paths> — slot: now | at the next boundary`,
   which Hosa commits here and answers `committed <subject> — <reading>`; the
   ruling and the commit subject stay yours, and you verify the diff.
   (c) Tell Sekkei or Keikaku
   the boundary is verified, naming any Kaiseki create or delete since the
   last boundary, then wait for the one-line reply —
   `committed <subject> — <reading>` or `nothing to commit — <reading>`;
   subscribe to its idle only
   when the reply is overdue, and record in the ledger's Session events if a
   notice came without a reply; skip (c) when neither is live. If a
   handover is due, the window ends, after the wait Timing prescribes, with
   steps 2 to 4 of "The handover, in a plan and between plans" — your exit
   shoroku was step 6's proposal and slot (a)'s commit — and the loop stops
   here; the next prompt is the successor's.
```

- [ ] **Step 10: The batch prompt's Models line**

**P10.9** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```text
8. Write the next batch prompt from `templates/batch-prompt.md`, carrying the
   rulings the next tasks inherit and the concrete model families from
   `tanto.json`. Save it as
   `.tanto/<topic>/batch-<X>-prompt.md` and send the same
   text, without an idle subscription.
```

**P10.9 →**

```text
8. Write the next batch prompt from `templates/batch-prompt.md`, carrying the
   rulings the next tasks inherit and, on its Models line, the four kinds
   Jisso dispatches — `task.implement`, `task.review-spec`,
   `task.review-quality`, and `task.escalate` — each with the family
   `tanto.json` gives it and the definition name that family is dispatched
   with, so that the prompt still says them after a compaction. Save it as
   `.tanto/<topic>/batch-<X>-prompt.md` and send the same
   text, without an idle subscription.
```

- [ ] **Step 11: The conflicting report**

**P10.10** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
A report that conflicts with the plan or the spec is a cold-read question to
Sekkei, sent as one line; Sekkei answers by editing the plan or the spec and
sending back a pointer. If the spec itself moves, that is a numbered question
to the human.
```

**P10.10 →**

```text
A report that conflicts with the plan or the spec is a cold-read question to
Keikaku, sent as one line; Keikaku answers by editing the plan or the spec and
sending back a pointer. If the spec itself moves, that is a numbered question
to the human.
```

- [ ] **Step 12: The whole-branch review**

**P10.11** `skills/tanto/roles/kanri.md` — replace exactly these 19 lines

```text
1. Dispatch the whole-branch review yourself, on `subagents.reviewer`, with
   superpowers' `requesting-code-review` reviewer prompt
   (`skills/requesting-code-review/code-reviewer.md` inside the superpowers
   plugin), a review package over the merge base, and a pointer to the SDD
   ledger's parked and deferred-minor lines, and ask for a **Shoroku
   candidates** section at the end of its report; adopt from it into the
   `S-n` table. You dispatch it, not Jisso, so the executor never
   commissions its own final review. Anything else you dispatch takes
   `subagents.default`.

   For a plan that carries passages, give that reviewer the plan, the merge
   base, and one command —
   `node "$TANTO/scripts/passage-check.js" replay --plan <path> --base <merge base>`
   — so
   that the replay it would otherwise rebuild by hand is the instrument
   this run already built and used — Sekkei for `lint` and `replay`, Jisso
   for `diff` at every boundary (issue-7481). Its report says what the replay
   printed, and the review seat goes to the cross-file contracts and the
   human-facing questions, which no script judges.
```

**P10.11 →**

```text
1. Dispatch the whole-branch review yourself, on the `branch.review` kind —
   `subagent_type: tanto-branch-review` — with
   superpowers' `requesting-code-review` reviewer prompt
   (`skills/requesting-code-review/code-reviewer.md` inside the superpowers
   plugin), a review package over the merge base, and a pointer to the SDD
   ledger's parked and deferred-minor lines, and ask for a **Shoroku
   candidates** section at the end of its report; copy its candidates into the
   `S-n` table with Adopted `pending` and Stage `t2`, as you do a batch
   report's. You dispatch it, not Jisso, so the executor never
   commissions its own final review. Anything else you dispatch takes the
   `default` kind.

   For a plan that carries passages, give that reviewer the plan, the merge
   base, and one command —
   `node "$TANTO/scripts/passage-check.js" replay --plan <path> --base <merge base>`
   — so
   that the replay it would otherwise rebuild by hand is the instrument
   this run already built and used — Keikaku for `lint` and `replay`, Jisso
   for `diff` at every boundary (issue-7481). Its report says what the replay
   printed, and the review seat goes to the cross-file contracts and the
   human-facing questions, which no script judges.
```

- [ ] **Step 13: T2**

**P10.12** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```text
3. When the final batch is accepted, send Jisso one line —
   `T2: propose the shoroku write-out; write it to .tanto/<topic>/shoroku-proposal.md`
   — then verify the write-out as you verify any batch, and put the merge
   decision to the human.
   Residual load-bearing findings reach the human in that merge question, and
   so does any hotfix you took on this branch.
```

**P10.12 →**

```text
3. When the final batch is accepted, run T2: the four steps of "Shoroku"
   below, whose first step is Jisso's. Send it one line —
   `T2: propose the shoroku write-out; write it to .tanto/<topic>/shoroku-proposal.md`
   — and the recommendation, the human's check, and the apply follow as at
   every other stage. Then put the merge
   decision to the human.
   Residual load-bearing findings reach the human in that merge question, and
   so does any hotfix you took on this branch.
```

- [ ] **Step 14: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 15: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md -m "docs(tanto): kanri cold read, batch loop, and final batch" -m "The plan.coldread dispatch and frame in place of the awk, T1 and T2 as the four shoroku steps, the boundary's two commands, reports read by sections, the reminder of spec 4.4, the commit window's apply and Hosa slots, the batch prompt's Models line, and branch.review (spec 4.4, 5.1, 7.1, 7.3, 8.2, 8.3)." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 16: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 17: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 10
```

Expected: `task 10: verify clean`.

**Done when:** the twelve passages are present in `roles/kanri.md`, A10.1's
needle counts 1, `./scripts/lint.sh skills/tanto/roles/kanri.md` exits 0, and
the commit carries its `Co-Authored-By:` trailer.

---

### Task 11: Kanri's Kaiseki exit, handover, and the shoroku flow

**Batch:** C. **Blocks:** A11.1, P11.1, P11.2, P11.3, P11.4, P11.5, P11.6, P11.7, P11.8, P11.9, P11.10, P11.11.

This task rewrites the middle of `roles/kanri.md`: the Kaiseki branch's exit
and its escalation key (spec 2.5), the Handover section's trigger, Timing, and
handover file so that they read per open ledger (spec 10), and the whole
Shoroku section, which becomes section 5's four steps — candidates, recommend,
check, apply — with the recommendation and the human's check in place of the
rule Kanri used to apply alone (spec 5.1, 5.2, 5.3).

The three go together because they are one change seen three times: Kanri no
longer rules on a shoroku item, a session no longer applies its own write-out,
and a session is therefore deletable once the recommendation over its proposal
is written. The Kaiseki branch names that exit, the Handover's step 1 is
Kanri's own instance of it, and the Shoroku section is where the four steps are
stated once.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — eleven passages: two in "The Kaiseki
  branch", four in "Handover", and five that rewrite "Shoroku" whole.

**Interfaces:**

- Consumes, from batch B (`SKILL.md`): the "Session exit" section's four
  steps, the `exit proposal: <path> — <reading>` line, and the stage words
  `t0`, `t1`, `t2`, `exit-<role>[-<suffix>]`, which this section points at
  rather than restates.
- Consumes, from tasks 9 and 10: the Start section, "On a handshake", "When
  the plan lands", "The batch loop", and "The final batch", which name "Exit
  shoroku", the `S-n` table, and loop steps 6 and 7 by those names. This task
  does not touch those sections.
- Produces, for task 12: the "Exit shoroku" heading and the rule that the
  deletion request follows the recommendation, which the Replace and Delete
  tables cite.
- Produces, for batch E: `templates/kanri-handover.md` (task 18) must carry In
  flight as one block per open ledger and Live peers with a Topic per peer, as
  "The handover file" now describes; `templates/kanri.md`'s `S-n` table must
  carry the Adopted values `pending`, `yes`, `no` and accept Stage `t2` for a
  candidate copied at a boundary.
- markdownlint lints `skills/tanto/roles/kanri.md`; it is not under an ignored
  path.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kanri.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The anchor, and the Kaiseki branch's escalation key**

**A11.1** `skills/tanto/roles/kanri.md` — `grep -cF 'Between stages nothing is adopted' skills/tanto/roles/kanri.md` — before: 0, after: 1

**P11.1** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
   human declines to create Kaiseki, rule `continue the SDD rounds`: Jisso
   resumes at round 3 with the resumed implementer, and rounds 4-5 go to
   `subagents.escalation`.
```

**P11.1 →**

```text
   human declines to create Kaiseki, rule `continue the SDD rounds`: Jisso
   resumes at round 3 with the resumed implementer, and rounds 4-5 go to
   `task.escalate`.
```

- [ ] **Step 3: The Kaiseki branch's candidates and its exit**

**P11.2** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```text
   yet. An item tagged `blocks this task: no` goes into the `S-n` table as a
   shoroku candidate and is written by Kaiseki itself at its exit.
6. When Jisso's fix passes review and tests and no `blocks this task: yes` item
   is open, ask the human to delete Kaiseki — or to keep it if more of the same
   bug is expected. Not before: a fix that misses goes back to the same Kaiseki
   with its context intact.
```

**P11.2 →**

```text
   yet. An item tagged `blocks this task: no` is copied into the `S-n` table at
   this boundary with Adopted `pending` and Stage `t2`; nothing is adopted
   here, and T2's proposal is where it is recommended and checked.
6. When Jisso's fix passes review and tests and no `blocks this task: yes` item
   is open, run Kaiseki's exit as "Exit shoroku" below prescribes — its
   proposal, then the recommendation, then the deletion request — or keep it if
   more of the same bug is expected. Not before: a fix that misses goes back to
   the same Kaiseki with its context intact. The apply is not Kaiseki's work:
   the apply subagent commits the accepted subset, and Kaiseki may be gone by
   then.
```

- [ ] **Step 4: The handover trigger, checked per topic**

**P11.3** `skills/tanto/roles/kanri.md` — replace exactly these 13 lines

```text
Three signals fire a handover. Check them at every boundary: at loop step 6
while a plan is in flight, and, between plans, at the start of every turn you
get — a message, or the human speaking. Run the self-check of `SKILL.md`'s
Resuming at the same points — one `ListAgents`; a name that is not your row's
means you were resumed, and the roster's first row is rewritten before
anything else.

1. **The plan close**, and this is the ordinary one. After T2, the merge
   decision, the peers' deletion, and the archive move, the handover runs:
   without a threshold, and without asking (decision-b6cb). The close is the
   moment with nothing in flight and the record complete, and a resident
   session's per-turn cost is its age, so the reset is a planned step and not
   a question put to the human once a plan (req-04f5).
```

**P11.3 →**

```text
Three signals fire a handover. Check them at the boundaries of the topic whose
batches are in flight — at loop step 6 — and, between plans, at the start of
every turn you get, a message or the human speaking. A topic in its spec or
plan stage neither fires the check nor blocks it: its Sekkei or Keikaku holds
nothing you must wait for beyond an unanswered line, which that peer re-sends
to your successor's address. Run the self-check of `SKILL.md`'s Resuming at the
same points — one `ListAgents`; a name that is not your row's means you were
resumed, and the roster's first row is rewritten before anything else.

1. **The plan close**, and this is the ordinary one — the close of the topic
   whose batches were in flight. After T2, the merge decision, the peers'
   deletion, and the archive move, the handover runs: without a threshold, and
   without asking (decision-b6cb). The close is the moment with nothing in
   flight and the record complete, and a resident session's per-turn cost is
   its age, so the reset is a planned step and not a question put to the human
   once a plan (req-04f5).
```

- [ ] **Step 5: Timing, per the topic in flight**

**P11.4** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```text
Only at a boundary: a batch accepted and the next prompt not yet sent, the
plan close once the archive move is done, or between plans. Never mid-batch —
"never replace mid-batch on suspicion" names you too. Because the trigger is
checked before the next prompt is written, a
handover that is due stops the loop at that point, and the next prompt is the
successor's to send.
```

**P11.4 →**

```text
Only at a boundary of the topic whose batches are in flight: a batch accepted
and the next prompt not yet sent, that topic's close once the archive move is
done, or between plans. Never mid-batch — "never replace mid-batch on
suspicion" names you too. Another topic's spec or plan stage supplies no
boundary of this kind and holds no handover of yours. Because the trigger is
checked before the next prompt is written, a handover that is due stops the
loop at that point, and the next prompt is the successor's to send.
```

- [ ] **Step 6: The handover file's In flight and Live peers**

**P11.5** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```text
`.tanto/kanri-handover.md`, next to the roster, untracked under
`.tanto/.gitignore`, copied from `templates/kanri-handover.md`. Its
sections are Why, In flight, Live peers, Open questions for the human, Rulings
the next batch inherits, Residency, Next step, Not reconstructed, and Commands
for the human. Everything else is a pointer to the roster and the ledgers,
never a copy.
```

**P11.5 →**

```text
`.tanto/kanri-handover.md`, next to the roster, untracked under
`.tanto/.gitignore`, copied from `templates/kanri-handover.md`. Its
sections are Why, In flight, Live peers, Open questions for the human, Rulings
the next batch inherits, Residency, Next step, Not reconstructed, and Commands
for the human. Everything else is a pointer to the roster and the ledgers,
never a copy.

In flight carries one block — Plan, Ledger, Batch state — **per open ledger**,
so that a topic still in its spec or plan stage is handed over together with
the topic whose batches were in flight. Live peers lists every peer of every
open topic, each with its Topic and what it is waiting for, and marks the ones
whose last line you had not answered: the successor sends `kanri-address:` to
all of them, and each answers by re-sending its last unanswered line.
```

- [ ] **Step 7: The handover step 1 — Kanri's own exit**

**P11.6** `skills/tanto/roles/kanri.md` — replace exactly these 11 lines

```text
1. **Exit shoroku first** — the Kanri case under "Exit shoroku": propose to
   yourself from the ledger and the roster, not from recollection, escalate to
   the human, write, lint, commit once, and mark the `S-n` rows written. What
   you cannot reconstruct goes into the handover file's "Not reconstructed"
   section. At a **batch boundary** this step is loop step 6's proposal and
   step 7's slot (b) commit, already done when the window reaches this list. At
   a **plan close** it is a fresh act, run after T2, the merge decision, the
   peers' deletion and the archive move, and its commit lands where the tree
   is once the merge decision is executed — on `main` after a merge, on the
   plan's branch only when the human declined the merge (decision-b6cb).
   **Between plans** it is one act too, and the commit lands on `main`.
```

**P11.6 →**

```text
1. **Exit shoroku first** — the Kanri case under "Exit shoroku": write your own
   proposal from the ledger and the roster rather than from recollection,
   dispatch the recommender, put the recommendation to the human, write the
   direction and the `S-n` rows, and dispatch the apply, which commits and
   reports its subject. What you cannot reconstruct goes into the handover
   file's "Not reconstructed" section. Verify that commit **before** the
   handover file is written, so that the successor inherits a commit and not a
   pending write-out. At a **batch boundary** this step is loop step 6's
   proposal and recommendation and step 7's slot (b) apply, already done when
   the window reaches this list. At a **plan close** it is a fresh act, run
   after T2, the merge decision, the peers' deletion and the archive move, and
   its commit lands where the tree is once the merge decision is executed — on
   `main` after a merge, on the plan's branch only when the human declined the
   merge (decision-b6cb). **Between plans** it is one act too, and the commit
   lands on `main`.
```

- [ ] **Step 8: The Shoroku section's opening**

**P11.7** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
Every report has a mandatory Shoroku candidates section. Adopt or reject each
candidate at the batch boundary in the ledger's `S-n` table. Sekkei's
spec-review and plan-review reports, and the whole-branch review you dispatch,
carry the same section: adopt from them when their path reaches you.
```

**P11.7 →**

```text
One flow at every stage — T0, T1, T2, and every exit — in four steps. The
stage word is `t0`, `t1`, `t2`, or `exit-<role>[-<suffix>]`. You rule on no
item: you dispatch the recommender, the human checks by exception, and a
subagent applies. The `S-n` table's Adopted column takes `pending`, `yes`, or
`no`.

Between stages nothing is adopted. A batch report's mandatory Shoroku
candidates section, a Kaiseki report's `blocks this task: no` items, and a
review report's candidates — the spec review's, the plan review's, and the
whole-branch review's — are copied into the ledger's `S-n` table at the
boundary with Adopted `pending` and Stage `t2`, the bookkeeping you already do
minus the ruling; T2's proposal, which Jisso seeds from that table, is where
they are recommended and checked.
```

- [ ] **Step 9: The four steps, in place of the adoption rule**

**P11.8** `skills/tanto/roles/kanri.md` — replace exactly these 22 lines

```text
### The adoption rule

Adoption is your ruling at every stage. Escalate to the human, as one numbered
list, only two kinds of item:

1. one that adds to or changes a **requirement** or an **ADR** — what the
   project must do, and why a choice was made, stay the human's;
2. one you cannot classify, or are unsure about.

An escalated item whose wording is in a language other than the chat's is put
to the human as the original followed by a reference translation in the chat's
language.

Everything else — design, issues, notes, reports — you decide and record in the
`S-n` table, and the human sees the result in the commit.

A reference to an `S-n` or an `R-n` from outside its own ledger — the roster, a
handover file, another ledger — names the topic first, `<topic> S-n`; bare
numbers stay bare inside a ledger. The Written column takes only a value a
filter can read: `no`, a commit subject, or `superseded: <topic> R-n`, the last
counting as written; a candidate with two stages is split into two rows when
the second stage is identified, never written as a compound value.
```

**P11.8 →**

```text
### The four steps

1. **Candidates.** The session that holds them writes them, and only this step
   needs a resident context. T0: the input document — a Kikaku decision file,
   or a file of that kind. T1: the spec itself, whose four sections
   Requirements, The ADRs, Deferred items, and Shoroku candidates from this
   spec work are the candidates; nothing is copied. T2:
   `.tanto/<topic>/shoroku-proposal.md`, written by Jisso. An exit:
   `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`, or
   `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` for your own.
2. **Recommend.** Dispatch the `shoroku` kind in the skill's recommend mode
   over the candidate file — for T1, over the spec with the four section names
   — with `docs/` as the baseline, and name the output:
   `.tanto/<topic>/<stage>-recommendation.md`, or
   `.tanto/t0-recommendation.md`, and your own exit at `.tanto/`. The file
   lists every item once in three groups — recommended adopt, recommended
   reject, unsure — each item quoted in full from its source, so that the file
   stands alone as the apply's input, with its destination, its one-line
   reason, and for a `design` entry the `req-<id>` it serves; a requirement or
   an ADR item carries the original wording followed by a reference
   translation in the chat's language.
3. **Check.** Tell the human in one line: the path, and the three counts. The
   human answers as the `shoroku` skill already parses — `OK` for "as
   recommended", or the numbers that go the other way, or an edit — and you
   write `<stage>-direction.md` beside the recommendation, item by item, with
   the `S-n` rows in the ledger: Stage the stage word, Adopted from the human's
   answer. No item is escalated apart from the rest and none is decided by you
   alone; the human sees the whole list, grouped, and answers by exception.
4. **Apply.** Dispatch the `shoroku` kind in apply mode with the
   recommendation, the direction, and the commit subject —
   `docs: T<n> shoroku for <topic>` or
   `docs: exit shoroku for <role>[ at <suffix>]` — in a slot of the commit
   window under the hotfix lane's rule. The subagent writes the accepted subset
   per `docs/AGENTS.md` and the per-type files, lints the changed paths by
   name, commits once by explicit path with the trailer, and reports the
   subject. Verify that commit as you verify any — `git status` clean, the
   diff's paths those the direction names, lint on them — and fill the Written
   column.

Where the commit lands: on the topic's branch for T1, T2, and the exits of
that topic's sessions; on `main` for T0 and for your own between-plans exit. A
Sekkei exit of a topic whose branch does not exist yet waits — the direction is
written, and the apply is dispatched once Keikaku has cut the branch, so that
the topic's write-outs travel with the topic; hold the pending apply in the
ledger's Progress line.

The apply subagent is the writer at every stage. You write under `docs/` only
through the intake's filings and the hotfix lane, and you hand those to Hosa
when one is live.

A reference to an `S-n` or an `R-n` from outside its own ledger — the roster, a
handover file, another ledger — names the topic first, `<topic> S-n`; bare
numbers stay bare inside a ledger. The Written column takes only a value a
filter can read: `no`, a commit subject, or `superseded: <topic> R-n`, the last
counting as written; a candidate with two stages is split into two rows when
the second stage is identified, never written as a compound value.
```

- [ ] **Step 10: T0 and T1 as steps 2 to 4**

**P11.9** `skills/tanto/roles/kanri.md` — replace exactly these 13 lines

```text
### T0 and T1

At both stages you propose to yourself, apply the adoption rule, ask the human
the escalated items, original then reference translation, apply the accepted
subset per `docs/AGENTS.md` and the per-type files, lint, and make one commit.

- **T0**, before Sekkei is created — the decided items of the input document
  become ADRs, on `main`, before the branch is cut.
- **T1**, after the plan commit and before Jisso is created — requirements and
  issues from the spec. The spec's deferred items become issues one to one.

You may write under `docs/` at both: at T0 Jisso does not exist, at T1 it is
not yet created.
```

**P11.9 →**

```text
### T0 and T1

Both are steps 2 to 4 over a document that already exists, so step 1 is not
yours at either.

- **T0**, before Sekkei is created — the decided items of the input document
  become ADRs, on `main`, before the branch is cut.
- **T1**, after the plan commit and before Jisso is created — requirements and
  issues from the spec, whose four section names the recommend dispatch
  carries. The spec's deferred items become issues one to one.
```

- [ ] **Step 11: T2, the proposal and the apply subagent**

**P11.10** `skills/tanto/roles/kanri.md` — replace exactly these 21 lines

```text
### T2 — your Direct step

T2 is split because Jisso holds the context the write-out needs and cannot talk
to the human.

1. **Jisso proposes.** You send that line; Jisso writes the numbered list to
   `.tanto/<topic>/shoroku-proposal.md` and sends you one
   line.
2. **You direct.** Rule on every item per the adoption rule, record the rulings
   in the `S-n` table, ask the human the escalated items,
   original then reference translation, and write the answer **item by item**
   — accept, reject, or accept with an edit — to
   `.tanto/<topic>/shoroku-direction.md`, with the roster's
   Residency rows of this run appended for the dogfood report's Measurements
   table — the readings the archive will hold, kept under `docs/reports/`
   (issue-40ed). Then send Jisso one line with that path.
3. **Jisso applies.** It writes the accepted subset, lints, commits once, and
   reports. Verify the diff and the commit as you do for any batch. The human
   sees the result at the merge decision.

You stay out of `docs/` at T2 — Jisso is the writer there.
```

**P11.10 →**

```text
### T2

1. **Jisso proposes.** You send that line; Jisso writes the numbered list to
   `.tanto/<topic>/shoroku-proposal.md`, seeded from the `pending` rows of the
   `S-n` table and from its own context, and sends you one line.
2. **You recommend and check.** Steps 2 and 3 above, with the roster's
   Residency rows of this run appended to the direction file for the dogfood
   report's Measurements table — the readings the archive will hold, kept
   under `docs/reports/` (issue-40ed).
3. **The apply subagent writes.** Step 4 above. The human sees the result at
   the merge decision.

`shoroku-direction.md` no longer reaches Jisso: its T2 is the proposal only.
```

- [ ] **Step 12: Exit shoroku, shortened**

**P11.11** `skills/tanto/roles/kanri.md` — replace exactly these 45 lines

```text
### Exit shoroku

Every planned exit of a session, in any role, carries its own shoroku before
the human deletes it. `SKILL.md`'s "Session exit" defines the mechanism and the
file pattern `exit-<role>[-<suffix>]`; these are your steps.

1. At the boundary where the exit falls, send that session
   `exit: propose your shoroku; write it to <path>`, without an idle
   subscription, as with every other line you send. The path is
   `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`.
2. Rule on every item per the adoption rule, record the rulings in the `S-n`
   table with Stage `exit:<role>[-<suffix>]`, ask the human the escalated
   items, original then reference translation, and write the answer item by
   item to the matching
   `exit-<role>[-<suffix>]-direction.md`. Then send
   `exit: direction at <path>`, again without a subscription.
3. The session applies the accepted subset, lints, commits once by explicit
   path in the slot you give it in the commit window, and answers
   `exit write-out committed: <subject> — <reading>` or
   `exit write-out: nothing accepted — <reading>`.
4. Verify the diff and the commit as you do for any batch, fill the `S-n`
   rows' Written column with that subject, and only then ask the human to
   delete the session.

A session that has stopped answering is past answering, and you learn it the
way you learn of a missing batch report: the human says the session is gone, or
your window wakes for another reason and the answer has not arrived. Treat the
exit as forced, write a roster Events line saying its exit shoroku did not run
and what was lost as far as you know, ask the human to delete it, and continue.
The same Events line goes in whenever you mark a row `dead`.

**Your own exit.** You have no second session to rule on you, so you rule on
yourself: propose from the ledger and the roster rather than from recollection,
escalate to the human in this session, write, lint, commit once, and mark the
rows `exit:kanri-<YYYY-MM-DD>-<name>`, `<name>` being your own bare name. There
is a proposal file,
`.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`, and no direction
file. It is step 1 of the Handover above.

**Between plans** there is no ledger, so record candidates in the roster's
Shoroku candidates section instead, and move the rows whose Written column says
`no` into the new ledger's table when a topic opens.

Every write-out, T2 included, writes only the adopted rows whose Written column
says `no`, so nothing is written twice.
```

**P11.11 →**

```text
### Exit shoroku

Every planned exit of a session, in any role, carries its own shoroku, and the
session is deleted once the recommendation over its proposal is written: steps
3 and 4 run without it. `SKILL.md`'s "Session exit" defines the mechanism and
the file pattern `exit-<role>[-<suffix>]`; these are your steps.

1. At the boundary where the exit falls, send that session
   `exit: propose your shoroku; write it to <path>`, without an idle
   subscription, as with every other line you send. The path is
   `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`. The session writes it,
   runs its resume self-check, and answers
   `exit proposal: <path> — <reading>`.
2. Check the file's form, not its judgment: `sections` on it rather than a
   read, for the exclusion line it opens with and the numbered list under it.
   Then dispatch the recommender at once — step 2 above.
3. When the recommendation is on disk, read its `unsure` group with
   `sections`. An item there saying the candidate could not be read as written
   is one question back to the session, one line, answered by a rewrite of the
   proposal. Otherwise ask the human, as a numbered list, to delete the
   session.
4. Steps 3 and 4 above then run with the session gone. Record the rows with
   Stage `exit-<role>[-<suffix>]` and fill their Written column from the
   apply's commit subject.

The human's check works on the recommendation's full quotation of each item,
which is what the session would have been asked about: its judgment was spent
writing the proposal, and the file holds it. The session idles through one
recommender run and no longer through the human's check and the apply, so what
another session pays for an exit is the proposal and one recommender run.

A session that has stopped answering is past answering, and you learn it the
way you learn of a missing batch report: the human says the session is gone, or
your window wakes for another reason and the answer has not arrived. Treat the
exit as forced, write a roster Events line saying its exit shoroku did not run
and what was lost as far as you know, ask the human to delete it, and continue.
The same Events line goes in whenever you mark a row `dead`.

**Your own exit.** Steps 1 to 4 with you writing the proposal and the human
checking, as at every stage: propose from the ledger and the roster rather than
from recollection to
`.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`, `<name>` being your own
bare name, then the recommender, the human's check, the direction beside it,
and the apply. Your exit has a recommendation and a direction file like every
other, and the rows' Stage is `exit-kanri-<YYYY-MM-DD>-<name>`. It is step 1 of
the Handover above, and the apply's commit is verified before the handover file
is written.

**Between plans** there is no ledger, so record candidates in the roster's
Shoroku candidates section instead, and move the rows whose Written column says
`no` into the new ledger's table when a topic opens.

Every apply, T2 included, writes only the accepted rows whose Written column
says `no`, so nothing is written twice.
```

- [ ] **Step 13: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 14: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md -m "docs(tanto): kanri's Kaiseki exit, handover, and shoroku as one flow" -m "The Kaiseki branch's exit follows the shortened exit and its escalation dispatch is re-keyed; the handover trigger, Timing, and handover file read per open ledger; the Shoroku section is rewritten to the four steps, with the recommendation and the human's check in place of a ruling of Kanri's." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 15: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 16: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 11
```

Expected: `task 11: verify clean`.

**Done when:** all eleven passages are in `skills/tanto/roles/kanri.md`, the
anchor `Between stages nothing is adopted` counts 1 in that file, lint is clean
on it, and the commit carries its `Co-Authored-By:` trailer.

---

### Task 12: Kanri's intake, limits, human access, and session lifecycle

**Batch:** C. **Blocks:** A12.1, P12.1, P12.2, P12.3, P12.4, P12.5, P12.6, P12.7, P12.8, P12.9, P12.10, P12.11, P12.12, P12.13.

This task rewrites the last three sections of `roles/kanri.md`. The bug
intake's filings go to Hosa when one is live and stay Kanri's when none is
(spec 2.4), and a new `### Limits` heading carries the `paused:` and
`continue:` bookkeeping the limit rule leaves to Kanri (spec 9.1). Human access
loses step 5 — the review brief is the document author's dispatch now, and the
form check moves to `SKILL.md` (spec 6) — and its standing grants become four
(spec 11.1). Session lifecycle gains the five-line create request (spec 4.3),
the Keikaku rows of the Create, Replace, and Delete tables, the `cleared`
handling for Kikaku and Hosa, the compaction rows of spec 10, and a Recovery
section that reads `fukki` and names the seven roles.

The four belong together because each is a place where the new seats and the
shortened exit reach Kanri's clerical work: who files, who is asked to open a
window, who is asked to close one, and when the deletion request goes out —
after the recommendation, not after the proposal and not after a commit
(spec 5.3).

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — thirteen passages: five in "Bug
  intake", one insertion adding the `### Limits` subsection, two in "Human
  access", and five in "Session lifecycle".

**Interfaces:**

- Consumes, from batch B (task 7): `SKILL.md`'s new heading "The brief's
  form", which holds the form check this task deletes from Human access
  step 5. Between task 7 landing and this task landing the form check exists
  in both files; that overlap is expected and ends here, with `SKILL.md` the
  one copy.
- Consumes, from task 11: the "Exit shoroku" heading and its rule that the
  deletion request follows the recommendation over a session's proposal, which
  the Replace and Delete tables cite rather than restate.
- Consumes, from task 9: "On a handshake", which answers a Kikaku, a Hosa, and
  a Keikaku, and the roster's Topic column. This task does not touch it.
- Produces, for batch D: the create request's five lines and the Create
  table's third column, which `roles/keikaku.md` starts from, and the rule
  that Kikaku and Hosa are opened by the human, never requested, and `/clear`ed
  with the row marked `cleared`, which `roles/kikaku.md` and `roles/hosa.md`
  state from their own side.
- Produces, for batch E: `templates/kanri.md`'s Measurements table must take
  the `paused:` rows the Limits subsection writes into it.
- markdownlint lints `skills/tanto/roles/kanri.md`; it is not under an ignored
  path.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kanri.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The anchor, and the issue outcome**

**A12.1** `skills/tanto/roles/kanri.md` — `grep -cF 'A limit is a pause, never a model change' skills/tanto/roles/kanri.md` — before: 0, after: 1

**P12.1** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```text
1. **Issue** — a defect in a skill this repository ships, larger than a
   one-line fix, or with an unknown cause the human does not want a Kaiseki
   for. File it under `docs/issues/open/` per `docs/issues/AGENTS.md`, with the
   report's symptom and reproduction; issues are yours under the adoption rule,
   and the human sees the commit. The issue is then the tracker: `claimed_by`
   when a plan picks it up, `git mv` to `resolved/` at the T2 of the plan that
   lands the fix. A plan's spec names the issues it resolves, and that plan's
   T2 moves them.
```

**P12.1 →**

```text
1. **Issue** — a defect in a skill this repository ships, larger than a
   one-line fix, or with an unknown cause the human does not want a Kaiseki
   for. File it under `docs/issues/open/` per `docs/issues/AGENTS.md`, with the
   report's symptom and reproduction; the triage is your ruling, so the filing
   is yours to order, and the human sees the commit. The issue is then the
   tracker: `claimed_by` when a plan picks it up, `git mv` to `resolved/` at
   the T2 of the plan that lands the fix. A plan's spec names the issues it
   resolves, and that plan's T2 moves them.
```

- [ ] **Step 3: Who does the filing**

**P12.2** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
Redirect, the Kaiseki request, and the relay may happen whenever you read the
report. Filing an issue and the hotfix touch tracked files and wait for the
commit window at loop step 7, or for a gap between plans. When no plan is open,
triage on arrival.
```

**P12.2 →**

```text
Redirect, the Kaiseki request, and the relay may happen whenever you read the
report. Filing an issue and the hotfix touch tracked files. When a Hosa is
live, hand the filing to it as
`chore: <what> — <paths> — slot: now | at the next boundary`, and the slot you
name places it; when none is live, the filing is your own and waits for the
commit window at loop step 7, or for a gap between plans. When no plan is open,
triage on arrival.
```

- [ ] **Step 4: Hosa as your hand in the hotfix lane**

**P12.3** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```text
in-flight plan lists in its File structure table. In the lane you edit the
skill file directly, run lint on the changed paths by name and the README drift
review if `SKILL.md` changed, commit once by explicit path with the trailer,
and record `R-n`. No issue is filed: the commit is the durable record, so its
subject names the symptom, not only the report's slug, and its body names where
the report came from. The commit lands on the branch the tree is on — the plan
branch between batches, `main` between plans — and is never pushed. A hotfix on
a plan branch is named in your merge question.
```

**P12.3 →**

```text
in-flight plan lists in its File structure table. In the lane you edit the
skill file directly, run lint on the changed paths by name and the README drift
review if `SKILL.md` changed, commit once by explicit path with the trailer,
and record `R-n`. No issue is filed: the commit is the durable record, so its
subject names the symptom, not only the report's slug, and its body names where
the report came from. The commit lands on the branch the tree is on — the plan
branch between batches, `main` between plans — and is never pushed. A hotfix on
a plan branch is named in your merge question.

A live Hosa may be your hand in the lane when you would rather not hold the
edit: send it the `chore:` line with the paths and the slot. The lane's
conditions, the ruling `R-n`, and the commit subject stay yours.
```

- [ ] **Step 5: Where the carried-forward hotfixes are named**

**P12.4** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```text
So that hotfixes reach `docs/` once, carry them forward: when you create a new
topic's ledger, copy the hotfix lines recorded in the roster's Events since the
previous plan into the ledger's "Hotfixes since the previous plan" line, and at
T2 name that line in the shoroku direction so Jisso's dogfood report carries
them.
```

**P12.4 →**

```text
So that hotfixes reach `docs/` once, carry them forward: when you create a new
topic's ledger, copy the hotfix lines recorded in the roster's Events since the
previous plan into the ledger's "Hotfixes since the previous plan" line, and at
T2 name that line in the direction so the dogfood report carries them.
```

- [ ] **Step 6: A fix to a file the plan rewrites**

**P12.5** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```text
A fix to a file the in-flight plan rewrites takes one of three paths. If a task
that rewrites the file is still ahead, it is a cold-read question to Sekkei,
which edits the plan's fenced block so that the task delivers the fix. If every
rewriting task has run and only the final batch remains, the fix joins the
whole-branch review's single fix wave. If neither Sekkei is live nor the final
batch is next, it takes the issue outcome and waits.
```

**P12.5 →**

```text
A fix to a file the in-flight plan rewrites takes one of three paths. If a task
that rewrites the file is still ahead and Keikaku is still live, it is a
cold-read question to Keikaku, which edits the plan's fenced block so that the
task delivers the fix. If every rewriting task has run and only the final batch
remains, the fix joins the whole-branch review's single fix wave. If neither
holds, it takes the issue outcome and waits.
```

- [ ] **Step 7: The Limits subsection**

**P12.6** `skills/tanto/roles/kanri.md` — insert after these 3 lines

```text
address when it is not, or when that roster is absent; send
`bug-report: <absolute path>` to that bare name; and record the send in the
roster's Events.
```

**P12.6 →**

```text

### Limits

A limit is a pause, never a model change — `SKILL.md` carries the rule, and
this is the bookkeeping it leaves to you.

1. On `paused: <dispatch> on <family> — resets <time>`, sent as a line or
   written in a report's Rulings needed, record it as a row of the ledger's
   Measurements table — the dispatch, the family, and the reset time — and
   tell the human that reset time in your next line. The pause has no upper
   bound this skill can state; only the human's word ends it.
2. When the human says, in your window and in any words, that the quota is
   back, you may probe the family once with a trivial `default` subagent, and
   then send the paused role
   `continue: <the dispatch the pause named> — same model`. The role
   re-dispatches identically from where it stopped; no model and no effort
   changes at either end.
3. With no `paused:` marker in Measurements to bind the continuation to, ask
   the human what to continue. A human who says it in the role's own window
   instead is answered there, and that exchange reaches you as
   `human-contact:` like any other.
```

- [ ] **Step 8: The four standing grants**

**P12.7** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
3. Two standing grants are yours to give without a request: Sekkei's spec and
   plan dialogue, in its orders line at the handshake; an attached Kaiseki's
   debugging conversation, in the Human access section of its brief.
```

**P12.7 →**

```text
3. Four standing grants are yours to give without a request: Sekkei's spec
   dialogue and Keikaku's plan dialogue, each in that role's orders line at
   the handshake; an attached Kaiseki's debugging conversation, in the Human
   access section of its brief; and Hosa's chores, in the line you answer its
   handshake with. Kikaku needs none — the human is its counterpart by
   definition, and you never message it.
```

- [ ] **Step 9: The review brief is the author's**

**P12.8** `skills/tanto/roles/kanri.md` — replace exactly these 34 lines

```text
   it grants nothing beyond that exchange.
5. On `review-ready: <path>` from Sekkei — at any time, a batch in flight or
   not, because the writer reads only and writes one untracked file; unless a
   handover is due, in which case the successor dispatches it from the
   handover's Next step, and a writer still running when a handover is
   written on the human's word is listed under In flight like any agent —
   dispatch the review brief on `subagents.reviewer`, a read-only subagent,
   naming in the dispatch: the document's path; its inputs, for a spec also
   `spec-inputs.md` and `dialogue.md`, for a plan also the spec; the output,
   `.tanto/<topic>/review-brief-spec.md` or `review-brief-plan.md`;
   the template, `templates/review-brief.md`; and the chat's language, which
   is the language of the human's own messages to you (`dialogue.md` is the
   reference if the two windows differ). Check the brief's form, not the
   document: eight headings — the title, the how-to-answer section, the five
   numbered sections, and the unsettled section — present and in that order,
   the headings themselves in the chat's language (for a spec, section 5's
   body is the one line the template gives, rendered); every point opening
   with one of the four tags — confirm, choose, decide, nothing — and every
   unsettled line saying whether an answer is needed, and a decide line among
   them carrying the `— If unanswered:` clause after that; every point in its
   parts — the two before `See:`, then the pointer, and on a choose or decide
   point the `— If unanswered:` clause after it, so three parts or four, any
   of which may carry the ` — ` separator, as a plan's task headings do; a
   choose or decide point without that clause failing the check; every pointer
   the
   document's own heading text, verbatim and untranslated, so that
   `grep '^#'` on the document matches it. Dispatch once more if the form
   fails; if it fails again, send the brief as it stands and tell the human
   in one line. Never edit it, and do not read the document's prose to
   validate it — `grep '^#'` for its headings is the whole read you make;
   a point that misreads the document is caught by the human's answer or by
   your cold read, which stays where it is. Then send Sekkei `brief: <path>`.
   The human answers in Sekkei's window under the standing grant; the answers
   reach you through `dialogue.md` and the document.
```

**P12.8 →**

```text
   it grants nothing beyond that exchange.

A `review-ready: <document path>; brief: <brief path>` line asks nothing of
you. The brief is the document author's — Sekkei dispatches the spec brief,
Keikaku the plan brief, each checking its form against `SKILL.md`'s "The
brief's form" — and the human answers in that author's window under its
standing grant, the answers reaching you through `dialogue.md` and the
document. Record the line in the ledger's Session events and do nothing else.
Your cold read stays where it is.
```

- [ ] **Step 10: The create request and the Create table**

**P12.9** `skills/tanto/roles/kanri.md` — replace exactly these 13 lines

```text
The human is the only actor who can create or delete a session, and you are the
only role that asks. Every request is a numbered list, one line per item,
carrying the exact command the human will run in the new session, with your own
bare name as your start line printed it in place of `<name>`.

### Create

| When | Ask the human to | The request line carries |
| --- | --- | --- |
| bootstrap | nothing; the human opens a session and runs `/tanto kanri` | — |
| a plan is committed and your cold read has no open questions | create Jisso | `/tanto jisso <name>`, the plan path, the branch |
| the first batch of the current plan is accepted, or no plan is in flight | create Sekkei for the next spec, if there is one; the human may decline | `/tanto sekkei <name>`, the topic if known |
| Jisso reports the Kaiseki trigger with an unknown cause | create Kaiseki | `/tanto kaiseki <name>`; the brief follows the handshake |
```

**P12.9 →**

````text
The human is the only actor who can create or delete a session, and you are the
only role that asks. Every create request is this numbered list, which the
human can paste, with your own bare name as your start line printed it in place
of `<name>`:

```text
1. Open a new session in <repo path>.
2. /model <family>
3. /effort <level>
4. Make sure the session is in auto mode.
5. /tanto <role> <name>
```

Line 5 carries, after the command, what the Create table's third column names
for that role. The family and the level are `sessions.<role>` from
`tanto.json`, and they come before the command because the human forgets the
effort more often than the model. A delete request is a numbered list of its
own, one line per item.

### Create

| When | Ask the human to | The request line carries |
| --- | --- | --- |
| bootstrap | nothing; the human opens a session and runs `/tanto kanri` | — |
| a plan is committed and your cold read has no open questions | create Jisso | `/tanto jisso <name>`, the plan path, the branch |
| the spec review is accepted | create Keikaku | `/tanto keikaku <name>`, the topic, the spec path |
| the first batch of the current plan is accepted, or every open topic has passed its spec stage | create Sekkei for the next spec, if there is one; the human may decline | `/tanto sekkei <name>`, the topic if known |
| Jisso reports the Kaiseki trigger with an unknown cause | create Kaiseki | `/tanto kaiseki <name>`; the brief follows the handshake |
| — | nothing; Kikaku and Hosa are opened by the human and never requested by you | — |
````

- [ ] **Step 11: The Replace table's compaction rows**

**P12.10** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
| Sekkei's reading shows a compaction | at its next commit — a verified boundary, or, with no batch in flight, when its work is ready — run "Exit shoroku", then ask the human to delete and create; the dialogue, the drafts, and the reviews on disk are the recovery point, and the new Sekkei takes the spec inputs and `dialogue.md` as its own |
| Kaiseki's reading shows a compaction | at its report: the report as it stands is the recovery point; run "Exit shoroku", then ask the human to delete it and, if the case is open, create a new Kaiseki with the same brief |
```

**P12.10 →**

```text
| Sekkei's reading shows a compaction | at its next commit — a verified boundary, or, with no batch in flight, when its work is ready — run "Exit shoroku", then ask the human to delete and create; the dialogue, the drafts, and the reviews on disk are the recovery point, and the new Sekkei takes the spec inputs and `dialogue.md` as its own |
| Keikaku's reading shows a compaction | at its next commit, as for Sekkei (decision-6dea): run "Exit shoroku", then ask the human to delete and create; the spec, `dialogue.md`, and the plan draft on disk are the recovery point, and the new Keikaku takes them as its own |
| a Kikaku's or a Hosa's reading shows a compaction | neither is replaced: remind the human to `/clear` that window, mark the row `cleared`, and let the next `/tanto kikaku` or `/tanto hosa` handshake write a new row — what the session produced is already on disk or committed |
| Kaiseki's reading shows a compaction | at its report: the report as it stands is the recovery point; run "Exit shoroku", then ask the human to delete it and, if the case is open, create a new Kaiseki with the same brief |
```

- [ ] **Step 12: The Replace table's gone-session rows**

**P12.11** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
| Sekkei is gone before the plan is committed | ask the human to create a new Sekkei; the spec and plan drafts on disk are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
```

**P12.11 →**

```text
| Sekkei is gone before the spec review is accepted | ask the human to create a new Sekkei; the spec or its draft, the spec inputs, and `dialogue.md` on disk are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
| Keikaku is gone before the plan is committed | ask the human to create a new Keikaku; the spec on the branch and the plan draft on disk are the recovery point; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
```

- [ ] **Step 13: The Delete table**

**P12.12** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
| the plan is committed, the cold-read questions are answered, and the human does not want a next spec now | Sekkei is done; delete it after its exit shoroku is committed — a Sekkei is never kept for the next topic: the next spec needs the human's dialogue whether the session is old or new, what it carries is on disk and in the spec inputs, and its context would be re-read at every wake-up of the new topic |
| Jisso's fix from the Kaiseki report passed review and tests, and no `blocks this task: yes` item is open | Kaiseki is done; delete it after its exit shoroku is committed, or keep it if more of the same bug is expected |
| the final batch is accepted, T2 is written, leftovers are clean, and the human has executed the merge decision | Jisso is done; delete it after its exit shoroku is committed, which at plan end is T2 |
```

**P12.12 →**

```text
| the spec review is accepted and the human's answers to the spec brief are in `dialogue.md` | Sekkei is done; ask for its deletion once the recommendation over its exit proposal is on disk — a Sekkei is never kept for the next topic: the next spec needs the human's dialogue whether the session is old or new, what it carries is on disk and in the spec inputs, and its context would be re-read at every wake-up of the new topic |
| the plan has landed and the cold read is answered, or the human does not want the plan now | Keikaku is done; ask for its deletion once the recommendation over its exit proposal is on disk; a Keikaku is never reused across topics (decision-f496) |
| Jisso's fix from the Kaiseki report passed review and tests, and no `blocks this task: yes` item is open | Kaiseki is done; ask for its deletion once the recommendation over its exit proposal is on disk, or keep it if more of the same bug is expected |
| the final batch is accepted, T2's proposal is written, leftovers are clean, and the human has executed the merge decision | Jisso is done; ask for its deletion once the recommendation over that proposal is on disk, T2 being its exit |
```

- [ ] **Step 14: Recovery reads `fukki` and names the roles**

**P12.13** `skills/tanto/roles/kanri.md` — replace exactly these 8 lines

```text
Every window is resumed at once rather than recreated, and the human types
`/tanto resume` in your window first — the Resumed Kanri case above — and then
in each other window, in any order; no address is pasted. Mark `dead` only a
row whose session neither `ListAgents` lists nor re-handshakes by the time the
human says the windows are done. Verify the tree if a batch was in flight, then
ask for the roles still missing, in this order: Jisso only if a batch is in
flight, Kaiseki only if a bug is open, Sekkei only if a spec or plan is in
progress.
```

**P12.13 →**

```text
Every window is resumed at once rather than recreated, and the human types
`/tanto fukki` in your window first — the Resumed Kanri case above — and then
in each other window, in any order; no address is pasted. Mark `dead` only a
row whose session neither `ListAgents` lists nor re-handshakes by the time the
human says the windows are done. Verify the tree if a batch was in flight, then
ask for the roles still missing, in this order: Jisso only if a batch is in
flight, Kaiseki only if a bug is open, Keikaku only if a plan is in progress,
Sekkei only if a spec is in progress. Kikaku and Hosa you do not ask for: they
are the human's to reopen, and your part is the reminder.
```

- [ ] **Step 15: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 16: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md -m "docs(tanto): kanri's intake, limits, human access, and lifecycle" -m "Issue filings go to Hosa when one is live; a Limits subsection carries the paused and continue bookkeeping; Human access loses the brief dispatch and gains four standing grants; the lifecycle tables carry the create request's five lines, Keikaku, the cleared handling for Kikaku and Hosa, and a Recovery that reads fukki." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 17: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 18: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 12
```

Expected: `task 12: verify clean`.

**Done when:** all thirteen passages are in `skills/tanto/roles/kanri.md`, the
anchor `A limit is a pause, never a model change` counts 1 in that file, lint
is clean on it, and the commit carries its `Co-Authored-By:` trailer.

---

### Task 13: `roles/sekkei.md` narrowed to the spec and its review

**Batch:** D. **Blocks:** A13.1, P13.1, P13.2, P13.3, P13.4, P13.5, P13.6, P13.7, P13.8, P13.9.

This task takes the plan out of Sekkei. Spec 2.3 keeps Step 1 (the spec) and
Step 2 (the spec review and the gate), the write rule, and the exit, and loses
Step 3, Step 4, Handoff, and the boundary reply's plan half; spec 11.3 names
the sentences that change with them. The opening narrows to the spec and its
review and the standing grant to the spec dialogue; Step 1 gains the draft
rule of spec 2.3 and Fixed input 12 — a spec written while another topic's
batch is in flight is a draft under `.tanto/`, with no branch and no commit;
Step 2 gains the brief dispatch of spec 6, which Sekkei now runs itself, and
closes at the boundary `spec accepted:`; the exit is `exit-sekkei` with no
suffix and no write-out of its own (spec 5.2 and 5.3); and the Models table is
re-keyed to the kinds of spec 3.1.

P13.6 is the large deletion: 140 lines — Step 3, Step 4, and Handoff — leave
the file, and what the block writes back is the heading that follows the hole.
Every obligation in those 140 lines lands in `roles/keikaku.md` in task 14, and
this task and that one are in the same batch so that no boundary sits between
the removal and the file that carries it.

Two sentences in P13.5 are worth reading twice. The first is the reports rule
of spec 8.1 — read a report by its sections, never whole — with the one
exception this design measured and accepted: a review report is read whole.
The spec review of this very design ran to 369 lines in four sections, and all
four were findings to rule on, so `sections` would have saved nothing there;
everything else — a batch report, a proposal, a recommendation, a direction, a
brief — is read by section. The second is that `review-ready:` now carries both
paths and waits for nothing: the `brief: <path>` reply and the idle-until-brief
wait are gone (spec 6).

**Files:**

- Modify: `skills/tanto/roles/sekkei.md` — nine passages: the opening, the
  orders-line sentence, the files list, Step 1's branch and commit paragraphs,
  Step 2's body, the deletion of Step 3 / Step 4 / Handoff, the write and
  commit rule, the exit shoroku bullet, and the Models section.

**Interfaces:**

- Consumes, from batch B's `SKILL.md` tasks: the heading **The brief's form**,
  which P13.5 cites by name, and rule 9's new reading, which P13.7 restates in
  Sekkei's own words. Nothing from another task of this batch.
- Produces, for task 14: the narrowed Sekkei text that `roles/keikaku.md`
  completes. The one thing that must hold across the two: no obligation of the
  old Step 3 and Step 4 is lost, and none is stated twice — every bullet, rule
  and line form P13.6 deletes appears once in task 14's file, and nothing it
  deletes survives here.
- markdownlint runs on `skills/tanto/roles/sekkei.md` — the role files are not
  in `.markdownlint-cli2.yaml`'s ignore list — so the lint step is a real
  check, not only the whitespace hooks.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/sekkei.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The opening — the spec and its review**

**A13.1** `skills/tanto/roles/sekkei.md` — `grep -cF 'You own the spec and its review' skills/tanto/roles/sekkei.md` — before: 0, after: 1

**P13.1** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```text
You design what gets built. You own the spec, the plan, and the review of both.
You talk to Kanri, and to the human under the standing grant Kanri's orders
line names — the spec and plan dialogue, given at your creation — and
```

**P13.1 →**

```text
You design what gets built. You own the spec and its review; the plan is
Keikaku's, drafted after you exit. You talk to Kanri, and to the human under
the standing grant Kanri's orders line names — the spec dialogue, given at
your creation — and
```

- [ ] **Step 3: What Kanri's reply carries**

**P13.2** `skills/tanto/roles/sekkei.md` — replace exactly these 2 lines

```text
You have done the model check and sent the handshake. Kanri's reply carries the
topic and where the spec and the plan go.
```

**P13.2 →**

```text
You have done the model check and sent the handshake. Kanri's reply carries the
topic, where the spec goes, and whether a batch of another topic is in flight —
which is the draft rule of Step 1.
```

- [ ] **Step 4: Where your files go**

**P13.3** `skills/tanto/roles/sekkei.md` — replace exactly these 4 lines

```text
- Spec — the path Kanri's orders line names; by default
  `docs/superpowers/specs/<YYYY-MM-DD>-<topic>-design.md`
- Plan — the path Kanri's orders line names; by default
  `docs/superpowers/plans/<YYYY-MM-DD>-<topic>.md`
```

**P13.3 →**

```text
- Spec — the path Kanri's orders line names; by default
  `docs/superpowers/specs/<YYYY-MM-DD>-<topic>-design.md`. While a batch of
  another topic is in flight it is a draft at
  `.tanto/<topic>/spec-draft.md` instead, and Step 1 says what that changes
```

- [ ] **Step 5: Step 1 — the branch, the draft rule, and the commit**

**P13.4** `skills/tanto/roles/sekkei.md` — replace exactly these 11 lines

```text
Cut the branch from `main`, named after the topic, **before** the spec commit.
Everything from here rides on that branch.

Write the spec at the path above, self-contained. Kanri and Jisso both cold-read
it, and neither can ask you what you meant without a round trip.

In Fixed inputs, name the requirement each decision serves — `req-<id>` and
the bullet — or say that none does; the brief's third section reads it from
there. Commit the spec, then hold brainstorming's review gate: the human
reads the spec only after Step 2's brief has come back, and edits after the
human's answers are further commits.
```

**P13.4 →**

```text
When Kanri's orders line says no batch is in flight, cut the branch from
`main`, named after the topic, **before** the spec commit; everything from
here rides on that branch. When a batch of another topic **is** in flight,
the spec is a draft: write it to `.tanto/<topic>/spec-draft.md`, run Step 2's
review and the gate on that file, cut no branch, and commit nothing. The
checkout belongs to the topic whose batches are running; the Keikaku created
after that topic's merge cuts the branch and commits your text unchanged.

Write the spec at the path above, self-contained. Kanri and Jisso both cold-read
it, and neither can ask you what you meant without a round trip.

In Fixed inputs, name the requirement each decision serves — `req-<id>` and
the bullet — or say that none does; the brief's third section reads it from
there. Commit the spec unless it is a draft, then hold brainstorming's review
gate: the human reads the spec only after Step 2's brief has come back, and
the edits after the human's answers are further commits, or further edits to
the draft.
```

- [ ] **Step 6: Step 2 — the reviewer, the brief, and the boundary**

**P13.5** `skills/tanto/roles/sekkei.md` — replace exactly these 17 lines

```text
Dispatch a **read-only** reviewer on `subagents.reviewer`. Give it the spec and
the repo's `docs/decisions/` and `docs/requirements/`, ask it to check the
spec against them, and have it write its report to
`.tanto/<topic>/spec-review.md` with a **Shoroku candidates**
section at the end. Rule on every finding yourself. Scope findings go to the
human; everything else is yours. Then send Kanri one line with the report
path: Kanri adopts from its Shoroku candidates.

Then send Kanri `review-ready: <spec path>` and idle until `brief: <path>`
arrives; never poll, and send the line again if Kanri's session was replaced
meanwhile — a restart, a handover — because the writer dies with the session
that dispatched it. Put brainstorming's review gate to the human with the
brief's text verbatim, the spec's path, and the brief's, and record the
human's answers in `dialogue.md` in the brief's reply shape. A new brief is
written when the human asks for one, or when the document's judgment points
changed after the answers — a fixed input, a rejected alternative, a deferred
item — not when its prose did.
```

**P13.5 →**

```text
Dispatch a **read-only** reviewer on `spec.review`, naming
`subagent_type: tanto-spec-review` and its `model` together. Give it the spec
and the repo's `docs/decisions/` and `docs/requirements/`, ask it to check the
spec against them, and have it write its report to
`.tanto/<topic>/spec-review.md` with a **Shoroku candidates** section at the
end. When a batch of another topic is in flight, tell it — as the orders line
tells you — that the in-flight plan's paths are out of scope. Rule on every
finding yourself. Scope findings go to the human; everything else is yours.
Then send Kanri one line with the report path: Kanri adopts from its Shoroku
candidates.

Read a report by its sections and never whole —
`node "$TANTO/scripts/passage-check.js" sections --file <path> <heading>`
takes one or more headings and prints each with its body. The one exception is
a review report, which you read whole: every section of it is a finding you
must rule on, so naming them saves nothing.

Then dispatch the brief writer yourself, on `brief.write` —
`subagent_type: tanto-brief-write` with its `model` — from
`templates/review-brief.md`, naming the spec, its inputs, the output path
`.tanto/<topic>/review-brief-spec.md`, the template, and the chat's language.
Run the form check of `SKILL.md`'s **The brief's form** over what comes back;
on a failure dispatch once more, and on a second failure send the brief as it
stands, with one line to the human saying what is wrong with it. You never
edit the brief: a subagent shares none of your context, and that is the whole
of its value here.

Send Kanri `review-ready: <document path>; brief: <brief path>` — one line,
sent before you ask the human, and it waits for nothing. Then put
brainstorming's review gate to the human with the brief's text verbatim, the
spec's path, and the brief's, and record the human's answers in `dialogue.md`
in the brief's reply shape. A new brief is written when the human asks for
one, or when the document's judgment points changed after the answers — a
fixed input, a rejected alternative, a deferred item — not when its prose did.

Your tenure ends here. When the human's answers are in `dialogue.md` and the
edits they asked for are committed — or in the draft — send Kanri
`spec accepted: <spec path> — <reading>`. Kanri answers with `exit:`, and the
plan is Keikaku's from then on.
```

- [ ] **Step 7: Step 3, Step 4, and Handoff leave the file**

**P13.6** `skills/tanto/roles/sekkei.md` — replace exactly these 140 lines

```text
## Step 3 — the plan

Dispatch a drafter on `subagents.drafter` to write the plan from the spec with
superpowers writing-plans. Then add, yourself:

- the **Global Constraints** section the batch prompts are built from — the
  repo's `AGENTS.md` rules and the concrete model families from `tanto.json`;
- the **Batches** section — batch id, three or four tasks each, what the batch
  delivers, and the stop conditions at its boundary. Size the batches so that
  one Jisso carries a batch without growing long, and say at which boundaries
  a planned replacement is expected, if any. A stop condition worded as a
  property of the whole tree is backed by a command that sweeps the whole
  tree, not only the files the batch wrote;
- **how a batch is verified**. For a plan that ships Markdown, that section
  names lint on the changed paths by name, the content greps, a real YAML load
  of any frontmatter, and a JSON parse of any JSON the plan writes; for a plan
  that ships code, the test command together with the runtime version it is
  pinned to, so that a version claim is a run and not an assertion; and for a
  plan that carries passages,
  `node "$TANTO/scripts/passage-check.js" diff` as the boundary check,
  which is what makes that check outlive the session that wrote it
  (issue-7481);
- when the plan edits this skill's own files, the **boundary from which a
  role may be started or replaced** — where one is *permitted*, as distinct
  from the boundaries where the Batches bullet expects one — stated in Global
  Constraints and in the Batches section: the first boundary at which every
  file the plan touches agrees with every other, because a session started
  before it reads a half-edited skill — which may be the final boundary, in
  which case a replacement waits for it and the plan says so; and the
  sentence that until then the authority for the run's sessions is the
  constraints, Kanri's orders line, and the batch prompts (contract rule
  11).

A plan that carries passages rather than whole files wraps each new passage
at its destination file's column, chosen when the block is authored, and
writes every block in the shape `scripts/passage-check.js` parses — `$TANTO`
being the skill's own directory, as `SKILL.md` sets it — so that the
plan is machine-checkable and not only readable:

- a replacement is ``**P<task>.<n>** `<path>` — replace exactly these <N> lines``,
  the old block, then `**P<task>.<n> →**` and the new block; an insertion says
  `insert after these <N> lines` and its new block omits the anchor lines,
  because an insertion's anchor stays;
- an anchor step is
  ``**A<task>.<n>** `<path>` — `<command>` — before: <v>, after: <v>``, both values
  stated always: an anchor check inverts only when the new passage wholly
  supersedes the needle, and when the needle is the passage's unchanged
  opening it still returns `1` after a correct edit;
- an old value the plan contradicts is
  ``**O<task>.<n>** `<needle>` — <where it must be gone, or why it may stay>``,
  one per **entity** the plan changes — for a column added, the sentences that
  list the columns; for a template added, "There are ten"; for a file renamed,
  its old name. Write these before the passages, not after, and from the
  entity rather than from the new text: a set whose cardinality changes is
  reached by no new term at all, and a rule two role files state in different
  words needs both spellings as needles. Sweep the files the plan does **not**
  touch first — a file with a passage gets read anyway. **A needle must span
  the point where the text changes**: where a passage *inserts* into a phrase,
  every substring of the old phrase that avoids the insertion point survives
  the edit and returns the same count afterwards, which reads as "not fixed"
  or, worse, "already gone". `lint` checks this by searching the plan's own
  new-passage text for each needle. **Run each needle as you write it** — one
  that wraps in its target returns `0`, and `0` reads as "already gone".
  Record the raw count and the disposition of each hit, not one verdict. A
  sweep for the terms a plan introduces is not a sweep for the prose those
  terms contradict, and only this one catches the second (issue-10bc).

Each block appears **once**; a later task that needs one cites it by its id and
does not re-quote it. A count in prose is written only where a command consumes
it. Every Verify step of a task is one invocation of
`node "$TANTO/scripts/passage-check.js" verify --plan <path> --task <N>`,
rather than
commands you write out: the needles, the anchor values, and the
line counts are all determined by the blocks, so writing them again only
creates something that can drift from them (issue-f813).

The plan's Self-Review states the largest task's line count and step count, and
says whether any task is a **sweep-and-check** shape — one whose deliverable is
recorded output rather than a file. Size has two components, and the second
costs on both the implementer's seat and the reviewer's, because a
verification-only deliverable inverts the reviewer's standing instruction. No
threshold is set: the sizes are recorded until one can be chosen (issue-7281).

The report and prompt skeletons do **not** go in the plan. The plan says that
reports and prompts follow the tanto templates, and names nothing else.

## Step 4 — plan review

1. Run `node "$TANTO/scripts/passage-check.js" lint --plan <path>`, then the
   same script's `replay --plan <path> --base <merge base>`, and write
   `.tanto/<topic>/plan-dryrun.md` from what they print: the two
   commands, each one's output, and your ruling on every failure. `lint`
   checks the plan against itself — the lead lines, each `N` against its
   block's real line count, the ids' uniqueness, that every cited id exists,
   that every anchor states both of its values. `replay` applies the passages
   to copies of the merge-base blobs, asserting that each old passage occurs
   exactly once; re-runs each anchor against the applied copy and compares the
   result with its stated `after:` value, which a dry run that applies and
   then verifies can never test (issue-88d3); runs the plan's commands in
   order with each output beside its expectation — a command sits in a fenced
   `bash` or `console` block, and the paragraph after it that begins
   `Expected:` is what `replay` compares against; and prints every residual
   hit of the plan's `O` needles, swept over every path the plan touches — a
   wider set than the one an `O` row's counts were usually measured over, so
   a residual above the row's number is the first thing to place. A command
   that has never been run is a placeholder in a command's shape; fix the
   plan, not the expectation. The
   script prints failures and does not interpret them: deciding which are plan
   defects and which are artifacts of this machine is yours, and stays yours.
2. Dispatch a **read-only** reviewer on `subagents.reviewer` to run the
   writing-plans checklist against the plan **and the dry-run report**: it
   reads the report and spot-checks a few of its commands rather than
   re-running the set, and writes `.tanto/<topic>/plan-review.md`
   with a **Shoroku candidates** section at the end; after you have ruled,
   send Kanri one line with the report path.
3. Check spec conformance and the batch cuts yourself. A cut that leaves the
   tree inconsistent at its boundary is a bad cut. When the plan names a
   boundary as safe for a role start or replacement, grep the plan's own
   new-passage blocks for every term a later batch lands; a boundary is safe
   by that sweep, not by assertion.
4. Lint the changed paths.
5. Send Kanri `review-ready: <plan path>` and idle until `brief: <path>`
   arrives, never polling (send the line again if Kanri's session was
   replaced meanwhile); put the brief's text verbatim in your request for the
   one OK, with both paths, and record the answers in `dialogue.md` in the
   brief's reply shape. On the human's OK, commit under your commit rule
   below. A new brief is written on the same terms as in Step 2, a changed
   batch cut included; send `review-ready:` again to ask for it.

Then send Kanri one line naming both, with your reading appended:
`plan committed: <plan path>; dryrun: <dry-run path> — <reading>`.

## Handoff

Kanri cold-reads the committed plan and sends you its questions, one line each.
Answer by **editing the plan or the spec** and sending back a pointer — never
by explaining in a message. What you knew and did not write down is lost by
design; that is what the cold read is for.

## Your write and commit rule
```

**P13.6 →**

```text
## Your write and commit rule
```

- [ ] **Step 8: The write and commit rule**

**P13.7** `skills/tanto/roles/sekkei.md` — replace exactly these 13 lines

```text
- You write only under the spec and plan directory the orders line names — by
  default `docs/superpowers/` — and `.tanto/`, and you may write there **at
  any time**. No plan task touches those paths, which is what lets you draft
  the next plan while a batch of the current one runs.
- While **no batch is in flight** — the spec and plan commits of a first plan,
  or the gap between batches — you commit whenever your work is ready. While a
  batch **is** in flight, you **commit** only at a batch boundary, after Kanri
  has verified the tree and said so. The index is shared, and the pre-commit
  hooks stash unstaged changes while they run, which would disturb an
  implementer mid-task. Your commit lands on the shared branch and rides with
  it.
- You pause entirely while Kaiseki is active. At most two strong-model sessions
  run at once.
```

**P13.7 →**

```text
- You write only under the spec and plan directory the orders line names — by
  default `docs/superpowers/` — and `.tanto/`, and you may write there **at
  any time**. No plan task touches those paths, which is what lets you draft
  the next topic's spec while a batch of the current one runs.
- While **no batch is in flight** — the spec commit of a first plan, or the
  gap between batches — you commit whenever your work is ready. While a
  batch **is** in flight, you **commit** only at a batch boundary, after Kanri
  has verified the tree and said so; a spec begun under that condition is a
  draft and is not committed at all, by Step 1's rule. The index is shared,
  and the pre-commit hooks stash unstaged changes while they run, which would
  disturb an implementer mid-task. Your commit lands on the shared branch and
  rides with it.
- You pause entirely while Kaiseki is active. At most two top-family sessions
  are active at once, Kikaku excepted as human-paced; Keikaku and Hosa, on the
  cheaper families, do not count.
```

- [ ] **Step 9: The exit shoroku**

**P13.8** `skills/tanto/roles/sekkei.md` — replace exactly these 14 lines

```text
- **Your exit shoroku.** Before the human deletes you, Kanri sends
  `exit: propose your shoroku; write it to <path>`. Your candidates are the
  **delta**: the proposal's first line says "excludes what the spec, the two
  review reports, and T1 (Kanri's requirements and issues write-out after the plan commit) already carry", and the items are the dialogue's
  rejected alternatives with their reasons, the facts measured during the
  dialogue, the observations about the process, and the defects noticed. Kanri
  rules after T1 is committed, so the delta is known. Your proposal goes to
  `.tanto/<topic>/exit-sekkei-proposal.md` and Kanri's answer to
  `exit-sekkei-direction.md` beside it. On that answer, apply the accepted
  subset under `docs/` per `docs/AGENTS.md` — at your exit, and only then, you
  write there — lint, commit once by explicit path in the slot Kanri gives you
  in the commit window, ahead of your ordinary boundary commit, and answer
  `exit write-out committed: <subject> — <reading>` or
  `exit write-out: nothing accepted — <reading>`.
```

**P13.8 →**

```text
- **Your exit shoroku.** Before the human deletes you, Kanri sends
  `exit: propose your shoroku; write it to <path>`. Your candidates are the
  **delta**. T1 has not run when you exit, so the proposal's first line says
  what it excludes — the spec, the spec review, and the dialogue, which T1
  reads for itself — and the items are the dialogue's rejected alternatives
  with their reasons, the facts measured during the dialogue, the
  observations about the process, and the defects noticed. The stage word is
  `exit-sekkei`, no suffix, and the proposal goes to
  `.tanto/<topic>/exit-sekkei-proposal.md`. Run the self-check of
  `SKILL.md`'s Resuming, answer `exit proposal: <path> — <reading>`, and stop
  there: Kanri dispatches the recommender over your proposal, and once it is
  on disk and its recommendation written you are deleted. You write nothing
  under `docs/` — not at your exit, not ever. A subagent applies the accepted
  subset in Kanri's slot, and your judgment is already in the file.
```

- [ ] **Step 10: The Models table**

**P13.9** `skills/tanto/roles/sekkei.md` — replace exactly these 8 lines

```text
Every dispatch names a `model` from `tanto.json`; none omits it. An omitted
model inherits your session's, which is the strongest family.

| What you dispatch | tanto key |
| --- | --- |
| the plan drafter | `subagents.drafter` |
| the spec reviewer, the plan reviewer | `subagents.reviewer` |
| anything else — an ad-hoc search, a one-off exploration | `subagents.default` |
```

**P13.9 →**

```text
Every dispatch names a `subagent_type` and a `model` together; neither is
omitted. The family is `subagents.<kind>.model` in the merged `tanto.json`,
and an omitted model inherits your session's, which on a Sekkei session is
the strongest family — the most expensive way to run a subagent.

| What you dispatch | kind | `subagent_type` |
| --- | --- | --- |
| the spec reviewer | `spec.review` | `tanto-spec-review` |
| the brief writer, for the spec brief | `brief.write` | `tanto-brief-write` |
| anything else — an ad-hoc search, a one-off exploration | `default` | `tanto-default` |
```

- [ ] **Step 11: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/sekkei.md
```

Expected: exit 0, none `Failed`.

This step runs before the Verify step below, not after. markdownlint runs with
`--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 12: Commit**

```bash
git commit --only skills/tanto/roles/sekkei.md -m "docs(tanto): narrow Sekkei to the spec and its review" -m "Step 3, Step 4, and Handoff move to roles/keikaku.md; Sekkei dispatches its own spec brief, runs the draft rule when a batch is in flight, and exits at spec accepted with no write-out of its own." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 13: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 14: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 13
```

Expected: `task 13: verify clean`.

**Done when:** the nine passages are present in `skills/tanto/roles/sekkei.md`
and Step 3, Step 4 and Handoff are gone from it, A13.1 returns `1`,
`./scripts/lint.sh skills/tanto/roles/sekkei.md` exits 0 with nothing
`Failed`, and the commit carries its `Co-Authored-By:` trailer.

---

### Task 14: `roles/keikaku.md`, the plan seat

**Batch:** D. **Blocks:** W14.1.

The plan seat gets its file. Spec 2.2 fixes its content, and almost all of it
is today's `roles/sekkei.md` text moved rather than re-authored: Step 3 — the
plan (`roles/sekkei.md` lines 78-162), Step 4 — plan review (164-208), Handoff
(210-215), the write and commit rule with its boundary reply (217-258), and the
Models table (260-269). Task 13 removes exactly those lines; this task carries
them, which is why the two are in the same batch. A reviewer can check the move
against task 13's P13.6 block rather than re-reading the design.

What is new around the moved text, all from spec 2.2: the file's own opening —
who Keikaku is, that it owns the plan, its dry run and its review, that it
talks to Kanri and to the human under the standing grant and never messages
Jisso; its start at `/tanto keikaku <address>`, created on Kanri's request at
the boundary "the spec review is accepted", with the orders line carrying the
topic, the spec path, the plan path and the grant; what it takes as its own
(`dialogue.md`, `spec-inputs.md`, the spec, `spec-review.md`,
`review-brief-spec.md`), and the plan dialogue appended to `dialogue.md`; the
branch and the spec commit of a draft spec (Fixed input 12); the plan brief it
dispatches itself and the one-line `review-ready:` that waits for nothing
(spec 6); the cold read answered by editing the plan or the spec, Sekkei being
gone; and its exit, `exit-keikaku` with no suffix, with the proposal, its
reading, and deletion, and no write-out of its own (spec 5.2, 5.3).

Four changes inside the moved text. The two dispatches are re-keyed to the
kinds of spec 3.1 and name `subagent_type` and `model` together. The plan
review keeps `lint` and `replay` and gains `frame` and `boundary`: `frame` is
how Kanri reads the plan (spec 8.2), so the sections are named exactly as
`frame --stage 1` looks for them, and `boundary` runs the How a batch is
verified section's blocks verbatim (spec 8.3), so that section is written
knowing an unattended command will execute it. The idle-until-brief wait in
old item 5 becomes the brief dispatch and the one-line notice. And the exit
bullet loses its write-out.

The created path is declared for `diff`, which exempts it from the
unaccounted-lines check:

```text
created: skills/tanto/roles/keikaku.md
```

This task's content check is an ordinary grep step with its own `Expected:`
paragraph rather than an anchor block: `replay` builds its base-blob list from
every non-`W` block that names a path, so an anchor on a file that does not
exist at the merge base aborts the whole dry run with
`fatal: path ... does not exist`, and the instrument's one-line fix sits in
`replayPlan`, which this plan's Out of scope forbids it from touching. A
fenced command buys the same thing — `replay` runs it against the applied
tree, which does hold the new file, and Kanri's `boundary` runs it for real.

**Files:**

- Create: `skills/tanto/roles/keikaku.md` — the whole file, one `W` block.

**Interfaces:**

- Consumes, from task 13: the narrowed `roles/sekkei.md`. Task 13 deletes Step
  3, Step 4 and Handoff; this file is where they land. The one thing that must
  hold across the two: no obligation of the old Step 3 and Step 4 is lost, and
  none is stated twice — check the moved sections against P13.6, and check that
  nothing plan-shaped is left in `roles/sekkei.md`.
- Produces, for no later task: the file itself. Batch B's `SKILL.md` passages
  and the roles table already name `roles/keikaku.md`; this task is what makes
  that name resolve to a file.
- markdownlint runs on `skills/tanto/roles/keikaku.md` — the role files are not
  in `.markdownlint-cli2.yaml`'s ignore list — so the lint step is a real
  check, not only the whitespace hooks.

#### Steps

- [ ] **Step 1: Baseline the line endings**

This task touches no existing file, so there is nothing to baseline; run the
check on the sibling role file the new one is modeled on, to confirm what the
new file must match.

```bash
git ls-files --eol skills/tanto/roles/sekkei.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: Write the file**

**W14.1** `skills/tanto/roles/keikaku.md` — new file, 291 lines

```text
# Keikaku (計画)

You turn an accepted spec into a plan that can be built from.
You own the plan, its dry run, and its review. You talk to Kanri, and to the
human under the standing grant Kanri's orders line names — the plan dialogue,
given at your creation — and to nobody else; you never message Jisso. For
anything beyond that grant that needs the human's eyes or hands, send Kanri
`human-needed: <what the human must do> — <why no other way> — <where: this window>`
and idle until a `human-access:` line answers; under a grant stay within its
scope and end with `human-access: done — <what the human did or decided>`;
when the human speaks here unprompted, answer and send Kanri
`human-contact: <one line>`. A message whose first line is
`kanri-address: <name> [<ref>]` replaces Kanri's address from then on; if a
send to Kanri errors, re-read the roster's first data row.

You have done the model check and sent the handshake. Kanri asked for you at
the boundary "the spec review is accepted", and its orders line carries the
topic, the spec's path — committed, or a draft — the plan's path, and your
grant.

Steps 1 and 2 of this topic, the spec and its review, were Sekkei's, and
Sekkei is gone before you start: the same topic's Sekkei and Keikaku never
coexist. Your work begins at Step 3. A Keikaku is never reused across topics
(decision-f496), so this topic is the only one you see.

## Where your files go

- Plan — the path Kanri's orders line names; by default
  `docs/superpowers/plans/<YYYY-MM-DD>-<topic>.md`
- Spec — the path Kanri's orders line names: committed on the branch already,
  or a draft at `.tanto/<topic>/spec-draft.md` that you commit yourself
- Your dry-run report — `.tanto/<topic>/plan-dryrun.md`
- Your working notes — under `.tanto/<topic>/`

## What you take as your own

Sekkei's files are yours from your first turn, and nobody is left to explain
them to you:

- `.tanto/<topic>/dialogue.md` — the spec dialogue, each question Sekkei put
  and the human's answer, verbatim, in order. Append the plan dialogue to it
  in the same shape, so that one file holds the human's own words for the
  whole topic; Kanri may read it at any time, the brief writer reads it, and
  T1's shoroku takes it as an input.
- `.tanto/<topic>/spec-inputs.md`, when there is one — the human's scope
  inputs during spec work, numbered `I-n`, each with Kanri's advisory notes.
- The spec itself, `.tanto/<topic>/spec-review.md`, and
  `.tanto/<topic>/review-brief-spec.md` — what the document was reviewed
  against and what the human was shown of it.

Read them before you draft. Read a report by its sections and never whole —
`node "$TANTO/scripts/passage-check.js" sections --file <path> <heading>`
takes one or more headings and prints each with its body. The one exception is
a review report, which you read whole: every section of it is a finding, so
naming them saves nothing.

## The branch and the spec commit

When the spec is a draft — Sekkei wrote it while another topic's batch was in
flight, so no branch was cut — this comes before any plan work. Cut the branch
from `main`, named after the topic, and commit the spec at the final path the
orders line names, its text **unchanged**. It is the branch's first commit,
and the review it has already passed is the review of that text: an edit of
your own here would put something nobody reviewed on the branch. Everything
from here rides on that branch.

When the spec is already committed, the branch exists and you continue on it.

## Step 3 — the plan

Dispatch a drafter on `plan.draft`, naming `subagent_type: tanto-plan-draft`
and its `model` together, to write the plan from the spec with superpowers
writing-plans. Then add, yourself:

- the **Global Constraints** section the batch prompts are built from — the
  repo's `AGENTS.md` rules and the concrete model families from `tanto.json`;
- the **Batches** section — batch id, three or four tasks each, what the batch
  delivers, and the stop conditions at its boundary. Size the batches so that
  one Jisso carries a batch without growing long, and say at which boundaries
  a planned replacement is expected, if any. A stop condition worded as a
  property of the whole tree is backed by a command that sweeps the whole
  tree, not only the files the batch wrote;
- **how a batch is verified**. For a plan that ships Markdown, that section
  names lint on the changed paths by name, the content greps, a real YAML load
  of any frontmatter, and a JSON parse of any JSON the plan writes; for a plan
  that ships code, the test command together with the runtime version it is
  pinned to, so that a version claim is a run and not an assertion; and for a
  plan that carries passages,
  `node "$TANTO/scripts/passage-check.js" diff` as the boundary check,
  which is what makes that check outlive the session that wrote it
  (issue-7481). Write this section knowing that Kanri's `boundary --plan
  <path>` runs its fenced `bash` and `console` blocks verbatim, each against
  the `Expected:` paragraph after it: every check in it is a command that
  runs unattended, or it is not a check;
- when the plan edits this skill's own files, the **boundary from which a
  role may be started or replaced** — where one is *permitted*, as distinct
  from the boundaries where the Batches bullet expects one — stated in Global
  Constraints and in the Batches section: the first boundary at which every
  file the plan touches agrees with every other, because a session started
  before it reads a half-edited skill — which may be the final boundary, in
  which case a replacement waits for it and the plan says so; and the
  sentence that until then the authority for the run's sessions is the
  constraints, Kanri's orders line, and the batch prompts (contract rule
  11).

Name those sections exactly as they are named here, and the Self-Review with
them: `frame --stage 1` finds them by their headings, and a plan's frame is
what Kanri reads in place of the plan.

A plan that carries passages rather than whole files wraps each new passage
at its destination file's column, chosen when the block is authored, and
writes every block in the shape `scripts/passage-check.js` parses — `$TANTO`
being the skill's own directory, as `SKILL.md` sets it — so that the
plan is machine-checkable and not only readable:

- a replacement is ``**P<task>.<n>** `<path>` — replace exactly these <N> lines``,
  the old block, then `**P<task>.<n> →**` and the new block; an insertion says
  `insert after these <N> lines` and its new block omits the anchor lines,
  because an insertion's anchor stays;
- an anchor step is
  ``**A<task>.<n>** `<path>` — `<command>` — before: <v>, after: <v>``, both values
  stated always: an anchor check inverts only when the new passage wholly
  supersedes the needle, and when the needle is the passage's unchanged
  opening it still returns `1` after a correct edit;
- an old value the plan contradicts is
  ``**O<task>.<n>** `<needle>` — <where it must be gone, or why it may stay>``,
  one per **entity** the plan changes — for a column added, the sentences that
  list the columns; for a template added, "There are ten"; for a file renamed,
  its old name. Write these before the passages, not after, and from the
  entity rather than from the new text: a set whose cardinality changes is
  reached by no new term at all, and a rule two role files state in different
  words needs both spellings as needles. Sweep the files the plan does **not**
  touch first — a file with a passage gets read anyway. **A needle must span
  the point where the text changes**: where a passage *inserts* into a phrase,
  every substring of the old phrase that avoids the insertion point survives
  the edit and returns the same count afterwards, which reads as "not fixed"
  or, worse, "already gone". `lint` checks this by searching the plan's own
  new-passage text for each needle. **Run each needle as you write it** — one
  that wraps in its target returns `0`, and `0` reads as "already gone".
  Record the raw count and the disposition of each hit, not one verdict. A
  sweep for the terms a plan introduces is not a sweep for the prose those
  terms contradict, and only this one catches the second (issue-10bc).

Each block appears **once**; a later task that needs one cites it by its id and
does not re-quote it. A count in prose is written only where a command consumes
it. Every Verify step of a task is one invocation of
`node "$TANTO/scripts/passage-check.js" verify --plan <path> --task <N>`,
rather than
commands you write out: the needles, the anchor values, and the
line counts are all determined by the blocks, so writing them again only
creates something that can drift from them (issue-f813).

The plan's Self-Review states the largest task's line count and step count, and
says whether any task is a **sweep-and-check** shape — one whose deliverable is
recorded output rather than a file. Size has two components, and the second
costs on both the implementer's seat and the reviewer's, because a
verification-only deliverable inverts the reviewer's standing instruction. No
threshold is set: the sizes are recorded until one can be chosen (issue-7281).

The report and prompt skeletons do **not** go in the plan. The plan says that
reports and prompts follow the tanto templates, and names nothing else.

## Step 4 — plan review

1. Run `node "$TANTO/scripts/passage-check.js" lint --plan <path>`, then the
   same script's `replay --plan <path> --base <merge base>`, and write
   `.tanto/<topic>/plan-dryrun.md` from what they print: the two
   commands, each one's output, and your ruling on every failure. `lint`
   checks the plan against itself — the lead lines, each `N` against its
   block's real line count, the ids' uniqueness, that every cited id exists,
   that every anchor states both of its values. `replay` applies the passages
   to copies of the merge-base blobs, asserting that each old passage occurs
   exactly once; re-runs each anchor against the applied copy and compares the
   result with its stated `after:` value, which a dry run that applies and
   then verifies can never test (issue-88d3); runs the plan's commands in
   order with each output beside its expectation — a command sits in a fenced
   `bash` or `console` block, and the paragraph after it that begins
   `Expected:` is what `replay` compares against; and prints every residual
   hit of the plan's `O` needles, swept over every path the plan touches — a
   wider set than the one an `O` row's counts were usually measured over, so
   a residual above the row's number is the first thing to place. A command
   that has never been run is a placeholder in a command's shape; fix the
   plan, not the expectation. The
   script prints failures and does not interpret them: deciding which are plan
   defects and which are artifacts of this machine is yours, and stays yours.
2. Read the plan as Kanri will. `frame --plan <path> --stage 1` prints the
   headings, Global Constraints, Batches, How a batch is verified, and
   Self-Review; `--stage 2` prints each task's head and its step count. A
   section that does not appear is one you named differently, and Kanri will
   not see it either. Then run `boundary --plan <path>`, which exits `2` when
   the plan or its How a batch is verified heading is missing: what you are
   checking here is that it finds the section and runs the blocks you meant,
   since the checks themselves pass only once a batch has landed.
3. Dispatch a **read-only** reviewer on `plan.review`, naming
   `subagent_type: tanto-plan-review` and its `model` together, to run the
   writing-plans checklist against the plan **and the dry-run report**: it
   reads the report and spot-checks a few of its commands rather than
   re-running the set, and writes `.tanto/<topic>/plan-review.md`
   with a **Shoroku candidates** section at the end; after you have ruled,
   send Kanri one line with the report path.
4. Check spec conformance and the batch cuts yourself. A cut that leaves the
   tree inconsistent at its boundary is a bad cut. When the plan names a
   boundary as safe for a role start or replacement, grep the plan's own
   new-passage blocks for every term a later batch lands; a boundary is safe
   by that sweep, not by assertion.
5. Lint the changed paths.
6. Dispatch the brief writer yourself, on `brief.write` —
   `subagent_type: tanto-brief-write` with its `model` — from
   `templates/review-brief.md`, naming the plan, its inputs, the output path
   `.tanto/<topic>/review-brief-plan.md`, the template, and the chat's
   language. Run the form check of `SKILL.md`'s **The brief's form** over what
   comes back; on a failure dispatch once more, and on a second failure send
   the brief as it stands, with one line to the human saying what is wrong
   with it. You never edit the brief. Send Kanri
   `review-ready: <document path>; brief: <brief path>` — one line, before you
   ask the human, and it waits for nothing. Then put the brief's text verbatim
   in your request for the one OK, with both paths, and record the answers in
   `dialogue.md` in the brief's reply shape. On the human's OK, commit under
   your commit rule below. A new brief is written when the human asks for one,
   or when the plan's judgment points changed after the answers — a changed
   batch cut included — not when its prose did.

Then send Kanri one line naming both, with your reading appended:
`plan committed: <plan path>; dryrun: <dry-run path> — <reading>`.

## Handoff

Kanri cold-reads the committed plan and sends you its questions, one line each.
Answer by **editing the plan or the spec** and sending back a pointer — never
by explaining in a message. The spec is on the branch and Sekkei is gone, so
both documents are yours to correct. What you knew and did not write down is
lost by design; that is what the cold read is for.

## Your write and commit rule

- You write only under the spec and plan directory the orders line names — by
  default `docs/superpowers/` — and `.tanto/`, and you may write there **at
  any time**. No plan task touches those paths.
- While **no batch is in flight** — the spec and plan commits of a first plan,
  or the gap between batches — you commit whenever your work is ready. While a
  batch **is** in flight, you **commit** only at a batch boundary, after Kanri
  has verified the tree and said so. The index is shared, and the pre-commit
  hooks stash unstaged changes while they run, which would disturb an
  implementer mid-task. Your commit lands on the shared branch and rides with
  it.
- You pause while Kaiseki is active. Your family is a cheap one, so you do not
  count toward the two top-family sessions rule 9 allows, but the checkout is
  shared and that is what the pause is for.

You learn both from Kanri. If your work is ready and you have not heard, ask
Kanri in one line and wait.

Two more rules, one at each end of a batch boundary:

- **The boundary reply.** When Kanri says the boundary is verified, commit if
  your work is ready and answer in one line, `committed <subject> — <reading>`
  or `nothing to commit — <reading>`. Before the line, run the self-check of
  `SKILL.md`'s Resuming — one `ListAgents`; a name that is not your row's means
  you were resumed, and the handshake goes first. The authorization lasts until
  you answer or until Kanri's next message, and a commit you did not make
  within that window waits for the next boundary line.
- **Your exit shoroku.** Kanri sends
  `exit: propose your shoroku; write it to <path>` at the plan's landing, once
  the cold read is answered — or earlier, when the human does not want the
  plan now. The stage word is `exit-keikaku`, no suffix, and the proposal goes
  to `.tanto/<topic>/exit-keikaku-proposal.md`. Your candidates are the
  **delta**: the first line says what the proposal excludes — the plan, the
  dry-run report, and the plan review, which are on disk for anyone to read —
  and the items are the plan dialogue's rejected alternatives with their
  reasons, the facts measured while drafting, the observations about the
  process, and the defects noticed. Run the self-check of `SKILL.md`'s
  Resuming, answer `exit proposal: <path> — <reading>`, and stop there: Kanri
  dispatches the recommender over your proposal, and once it is on disk and
  its recommendation written you are deleted. You write nothing under `docs/`
  — not at your exit, not ever. A subagent applies the accepted subset in
  Kanri's slot, and your judgment is already in the file.

## Models

Every dispatch names a `subagent_type` and a `model` together; neither is
omitted. The family is `subagents.<kind>.model` in the merged `tanto.json`,
and an omitted model inherits your session's, which on a Keikaku session is
not the top family: a `plan.draft` that omits it runs cheaper than the plan
needs, and nothing reports that.

| What you dispatch | kind | `subagent_type` |
| --- | --- | --- |
| the plan drafter | `plan.draft` | `tanto-plan-draft` |
| the plan reviewer | `plan.review` | `tanto-plan-review` |
| the brief writer, for the plan brief | `brief.write` | `tanto-brief-write` |
| anything else — an ad-hoc search, a one-off exploration | `default` | `tanto-default` |
```

Then confirm the file is on disk with the text this block states:

```bash
grep -cF 'You own the plan, its dry run, and its review' skills/tanto/roles/keikaku.md
```

Expected: `1`.

- [ ] **Step 3: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/keikaku.md
```

Expected: exit 0, none `Failed`.

This step runs before the Verify step below, not after. markdownlint runs with
`--fix`, and a fix that rewrote a line of the new file would leave it
disagreeing with the plan's `W` block. If it fixes anything, re-author the
block rather than leaving the file and the plan apart.

- [ ] **Step 4: Stage and commit**

```bash
git add skills/tanto/roles/keikaku.md
```

```bash
git commit --only skills/tanto/roles/keikaku.md -m "docs(tanto): add the Keikaku role file" -m "The plan seat: Step 3, Step 4, Handoff, the write and commit rule and the Models table move here from roles/sekkei.md, re-keyed to plan.draft and plan.review, with the branch and spec commit of a draft spec, the plan brief Keikaku dispatches itself, frame and boundary in the plan review, and exit-keikaku." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 5: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 6: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 14
```

Expected: `task 14: no passages`, exit 0, and no further line. This task
carries no `P` block and no anchor, so a zero-passage result is the result and
not a failure; the file's own check is the grep of Step 2.

**Done when:** `skills/tanto/roles/keikaku.md` exists with the 291 lines of
W14.1, the grep of Step 2 prints `1`,
`./scripts/lint.sh skills/tanto/roles/keikaku.md` exits 0 with nothing
`Failed`, and the commit carries its `Co-Authored-By:` trailer.

---

### Task 15: Kikaku, Hosa, and the decision template

**Batch:** D. **Blocks:** W15.1, W15.2, W15.3.

The two seats that sit outside the lifecycle get their role files, and the
template one of them writes from. `roles/kikaku.md` is spec 2.1 — the human's
consultation seat, opened by the human, never requested by Kanri, writing only
under `.tanto/kikaku/` and reporting one `decision:` line. `roles/hosa.md` is
spec 2.4 — the place to hand small jobs, taking the human's work under a
standing grant and Kanri's chores as Kanri's hand, and touching a tracked file
only in a slot Kanri gives. `templates/kikaku-decision.md` is the file spec 2.1
names for Kikaku's output, with the three sections spec 2.1 fixes and spec 11.6
lists among the templates. Section 11.4 asks for both role files to be short
and to say the same six things: who it talks to, how it starts, what it writes
and where, its lines to Kanri, what it never does, and that it has no exit
shoroku.

All three paths are new. Both role files have to stand on their own to a cold
reader who has read `SKILL.md` and nothing else, because neither seat is ever
created from a batch prompt. One sentence in `roles/kikaku.md` is not in the
spec, which is silent on it: Kikaku writes under `.tanto/`, so the plan gives
it the same `.tanto/.gitignore` and `.tanto/.markdownlint-cli2.yaml` sentence
that `roles/kanri.md` and `roles/kaiseki.md` already carry, per `SKILL.md`'s
Artifacts row naming whichever role finds those two files absent first as the
one that writes them.

None of the three files carries an anchor step, and a created file cannot:
`replay` builds its base-blob list from every non-`W` block that names a path,
so an anchor on a path absent at the merge base makes `replay --plan` exit 2
with `fatal: path … does not exist in <base>` before any check runs. Each
needle is checked by an ordinary `grep -cF` step beside its `W` block instead,
the instrument's one-line fix in `replayPlan` being outside this plan's scope.

**Files:**

- Create: `skills/tanto/roles/kikaku.md` — the Kikaku role file, 67 lines.
- Create: `skills/tanto/roles/hosa.md` — the Hosa role file, 65 lines.
- Create: `skills/tanto/templates/kikaku-decision.md` — the template Kikaku
  copies for each decision, 24 lines.

Every path this task writes is new, so `diff` takes their added lines as
created rather than as text the plan quotes:

```text
created: skills/tanto/roles/kikaku.md
created: skills/tanto/roles/hosa.md
created: skills/tanto/templates/kikaku-decision.md
```

**Interfaces:**

- Consumes, from batch B: `SKILL.md`'s roles table, which names Kikaku and
  Hosa and says what each owns and talks to; the Invocation table's `kikaku`
  and `hosa` ids, without which neither `/tanto` line resolves; and the human
  access section these files rely on rather than restate — Kikaku for the
  reason it sends no `human-needed:` line, Hosa for the standing grant its
  work arrives under.
- Consumes, from batch C: the create table's row saying that Kikaku and Hosa
  are opened by the human and never requested, and the `chore:` and `slot:`
  lines `roles/kanri.md` sends — the forms these two files answer.
- Produces, for no later task: nothing a later task consumes. Batch E's
  `templates/roster.md` already carries the `cleared` status and the keeping
  rule these files name; task 21's consistency note counts the seven role
  files and the thirteen templates, which is a sweep, not a consumption.
- markdownlint lints `roles/kikaku.md` and `roles/hosa.md`.
  `templates/kikaku-decision.md` is under `skills/tanto/templates/`, which
  `.markdownlint-cli2.yaml` ignores, so its lint step rests on the trailing
  whitespace, end-of-file and mixed line ending hooks alone.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kikaku.md skills/tanto/roles/hosa.md skills/tanto/templates/kikaku-decision.md && git check-attr text -- skills/tanto/roles/kikaku.md skills/tanto/roles/hosa.md skills/tanto/templates/kikaku-decision.md
```

Expected: the first command prints nothing, because this task touches no
existing path — anything it prints means the file is already tracked and a `W`
block would overwrite it. The second prints `text: auto` for each of the three,
which is the attribute the new files inherit, so each reports
`i/lf w/crlf attr/text=auto` once it is added.

- [ ] **Step 2: Create `roles/kikaku.md`**

**W15.1** `skills/tanto/roles/kikaku.md` — new file, 67 lines

```text
# Kikaku (企画)

You are the human's consultation seat: what the next work is, and why. A
discussion that would otherwise crowd Kanri's window belongs here.

The human is your counterpart by definition — they are already in the room,
so there is no `human-needed:` line for you to send and no grant to stay
inside. You send Kanri one line when something is decided, and nothing
else; you never message Sekkei, Keikaku, Jisso, Kaiseki, or Hosa. A message
whose first line is `kanri-address: <name> [<ref>]` replaces Kanri's
address from then on; if a send to Kanri errors, re-read the roster's first
data row.

## How you start

`/tanto kikaku [<address>]` — with no address, Kanri's address is the first
data row of `.tanto/roster.md`. You have done the model and effort check
and sent the handshake; Kanri answers with its address and the open topics,
if any.

Kanri never requests a Kikaku. The human opens one when they want to think,
so there is no create request behind you and no deletion waiting for you.

## The work

Brainstorm with the human, superpowers style, on whatever they bring. The
subject is theirs to choose.

You read the repository, `docs/`, and `.tanto/`. You write only under
`.tanto/kikaku/`, and never under `docs/`: what is settled here reaches a
requirement, a decision, or an issue through Kanri, not by your hand.

## The output

Make sure `.tanto/.gitignore` exists and holds `*`, and
`.tanto/.markdownlint-cli2.yaml` exists and holds `config:` with
`default: false` indented two spaces beneath it. Write each only when it is
absent and never overwrite either: the first keeps everything under
`.tanto/` untracked, the second keeps the editor's markdownlint quiet on
files the commit path never lints.

When something is decided, write `.tanto/kikaku/<YYYY-MM-DD>-<slug>.md`
from `templates/kikaku-decision.md` and send Kanri one line,
`decision: <path>`.

Kanri's handling is one of three, and the file's third section is where you
say which one you expect: a topic in its spec stage relays it as the next
`I-n` in that topic's `spec-inputs.md`; between plans it is a T0 input
document; otherwise it is a source row in the `S-n` table. Nothing else
carries the discussion forward, so what you leave out of the file is lost.

## Lifecycle

You have a roster row — role `kikaku`, no topic — with status `live`. No
create request, no delete request, no replace row, and no exit shoroku:
what you produce is on disk before the window closes.

The human `/clear`s this window when the subject changes. The next
`/tanto kikaku` re-handshakes with a new transcript, and Kanri writes a new
row and marks the old one `cleared`. A `/tanto fukki` after an editor
restart matches the transcript as for any role.

## Rule 9

You are on the top family and human-paced, and you are not counted: at most
two top-family sessions are active at once, with you excepted. The human
keeps this window quiet while Sekkei and Kaiseki are both active.
```

```bash
grep -cF 'Brainstorm with the human, superpowers style' skills/tanto/roles/kikaku.md
```

Expected: `1`.

- [ ] **Step 3: Create `roles/hosa.md`**

**W15.2** `skills/tanto/roles/hosa.md` — new file, 65 lines

```text
# Hosa (補佐)

A place to hand small jobs you can forget right away. You take one, you
finish it, and you report in one line.

You talk to the human, who hands you work directly in this window under the
standing grant Kanri's answer names, and to Kanri. You never message
Sekkei, Keikaku, Jisso, or Kaiseki. A message whose first line is
`kanri-address: <name> [<ref>]` replaces Kanri's address from then on; if a
send to Kanri errors, re-read the roster's first data row.

## How you start

`/tanto hosa [<address>]` — with no address, Kanri's address is the first
data row of `.tanto/roster.md`. You have done the model and effort check
and sent the handshake; Kanri answers with its address and one line,
"tracked files only in a slot I give".

Kanri never requests a Hosa. The human opens one; while none is live, Kanri
does its own chores.

## Whose work you take

**The human's.** Handed to you here, under the standing grant. Send Kanri
`chore: <one line>` when you take one, so that Kanri knows what is in hand
without a `human-contact:` for every job.

**Kanri's.** Sent as one line:
`chore: <what> — <paths> — slot: now | at the next boundary`. These are the
bug intake's issue filings, the note updates, and the hotfix lane's edits
when Kanri prefers not to hold them. For those you are **Kanri's hand**:
the lane's conditions, the ruling `R-n`, and the commit subject stay
Kanri's. You make the edit and nothing around it.

## The slot

Untracked work, and anything under `.tanto/`, you do at any time.

A tracked edit waits. Send Kanri `slot-needed: <what> — <paths>` and idle;
never poll. Kanri answers `slot: now — commit and report` or
`slot: at the next boundary`, under the hotfix lane's rule — between
batches or between plans, never on a file the in-flight plan lists. Then
commit once by explicit path, with the `Co-Authored-By:` trailer, and
answer `committed <subject> — <reading>`. Kanri verifies the diff as it
verifies any commit.

## Not yours

The shoroku write-outs. You never write a recommendation, a direction, or
an `S-n` row: the session that holds the candidates writes the proposal,
Kanri writes the direction and the rows, and a subagent applies them.

## Lifecycle

You have a roster row, no topic. No create request, no delete request, no
replace row, and no exit shoroku. The human `/clear`s this window; the next
`/tanto hosa` re-handshakes as a new session, and Kanri marks the old row
`cleared`.

You are on `sonnet`, so you do not count under rule 9.

## Models

Any subagent you dispatch takes `subagents.default`; you never omit the
model.
```

```bash
grep -cF 'A place to hand small jobs you can forget right away' skills/tanto/roles/hosa.md
```

Expected: `1`.

- [ ] **Step 4: Create `templates/kikaku-decision.md`**

**W15.3** `skills/tanto/templates/kikaku-decision.md` — new file, 24 lines

```text
# Kikaku decision — <what was decided, in one line>

Written by Kikaku at `.tanto/kikaku/<YYYY-MM-DD>-<slug>.md` from the tanto
skill's `templates/kikaku-decision.md`, and sent to Kanri as one line,
`decision: <path>`. Kanri reads this file and nothing else of the
discussion.

## The human's words, verbatim

<What the human said, quoted, in order — the question they came with and
the answers that settled it. Their own words, not your paraphrase: this is
the record of the discussion, as `dialogue.md` is for a spec.>

## What was decided

<What was chosen, what was rejected, and why. Enough that a session which
was never in this window can act on it without asking.>

## What Kanri should do with it

<Which of the three handlings you expect, and for which topic: the next
`I-n` in that topic's `spec-inputs.md` while the topic is in its spec
stage; a T0 input document between plans; or a source row in the `S-n`
table. Kanri rules; this is what you expect, and why.>
```

```bash
grep -cF 'Which of the three handlings you expect' skills/tanto/templates/kikaku-decision.md
```

Expected: `1`.

- [ ] **Step 5: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kikaku.md skills/tanto/roles/hosa.md skills/tanto/templates/kikaku-decision.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 6: Commit**

```bash
git add skills/tanto/roles/kikaku.md skills/tanto/roles/hosa.md skills/tanto/templates/kikaku-decision.md && git commit --only skills/tanto/roles/kikaku.md skills/tanto/roles/hosa.md skills/tanto/templates/kikaku-decision.md -m "docs(tanto): add the Kikaku and Hosa role files and the decision template" -m "Kikaku is the human's consultation seat and Hosa the chores seat; neither is requested by Kanri, neither has an exit shoroku, and Kikaku writes its decisions from the new template." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

The three paths are untracked until the `git add`, which is why it runs first:
`--only` cannot pick up an untracked path.

- [ ] **Step 7: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 8: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 15
```

Expected: `task 15: no passages`, exit 0, and nothing else printed. This task
carries no `P` block, so the passage count is zero and `verify` says so instead
of `verify clean`; that is a result, not a failure. It carries no anchor
either, so `verify` checks nothing of this task's own: the three `grep -cF`
steps above are the only machine check that the three files landed as written,
and a step skipped there is a gap nothing later closes until `diff` runs at the
batch boundary.

**Done when:** the three files exist at their paths with the line counts their
`W` blocks state, each of the three `grep -cF` steps prints `1`, lint is clean
on all three paths, `verify --task 15` reports no passages and no failure, and
the single commit carries the three paths and its `Co-Authored-By:` trailer.

---

### Task 16: Jisso and Kaiseki — the kinds, the layer, and the exits

**Batch:** E. **Blocks:** A16.1, P16.1, P16.2, P16.3, P16.4, P16.5, P16.6,
P16.7, P16.8, A16.2, P16.9, P16.10, P16.11, P16.12, P16.13.

This task lands spec 11.5 in the two role files that dispatch the most
subagents. In `roles/jisso.md` the Models table is re-keyed to the four
`task.*` kinds of spec 1.2, each dispatch now naming a `subagent_type` and a
`model` together (3.3); "Your subagent layer" becomes the agent definitions
the role writes at its start rather than a bare Agent tool; the overrides
table's Model Selection and `shoroku` rows are rewritten to the first and
second ADRs; T2 and the exit shrink to the proposal (5.2, 5.3); and one
sentence points at `SKILL.md`'s limit rule (9.1). In `roles/kaiseki.md` the
exit is the proposal, its reading, and the deletion (5.3), the subagent key
becomes `default` (2.5), and the rule-9 sentence reads as rule 9 now reads
(spec section 10).

Two things stay untouched on purpose. The verbatim SDD stop-classes
blockquote of `roles/jisso.md`, which `SKILL.md`'s "The four SDD stop
classes" quotes byte for byte and the consistency note's check 5 pins, is
outside every passage below and no passage abuts it — leave those bytes
alone. And the heading `## T2 and the exit — the shoroku write-out` keeps its
text although Jisso no longer writes the write-out: headings are how the
consistency note and a refresh read find a section, so the body changes and
the heading does not.

**Files:**

- Modify: `skills/tanto/roles/jisso.md` — eight passages: the Models section
  (re-keyed table, the `subagent_type` plus `model` rule, the limit
  pointer), "Your subagent layer", the fix-loop paragraph, the Kanri-answers
  paragraph (the Kaiseki report read by `sections`, and the review-report
  exception), two rows of "What tanto overrides", the scoped re-review's
  kind, and the whole "T2 and the exit" section.
- Modify: `skills/tanto/roles/kaiseki.md` — five passages: the opening
  commit sentence, the `default` dispatch key, the rule-9 sentence, the Tree
  discipline bullet, and the exit paragraph.

**Interfaces:**

- Consumes, from task 6: the twelve kinds and their
  families, the agent definitions each role writes at its start and the
  `subagent_type: tanto-<object>-<act>` plus `model: <family>` dispatch
  form, the limit rule paragraph these passages point at, and "Session
  exit"'s four steps with `exit proposal: <path> — <reading>` and the
  deletion after the proposal.
- Consumes, from task 10: the batch prompt's re-keyed Models line, which
  "Every batch prompt restates the concrete families" defers to, and the
  boundary's reading of a report by its sections.
- Produces: nothing a later task consumes. Task 22's `O` blocks and the
  plan's Verification section sweep these two files for the removed strings
  (`subagents.implementer` and its siblings, "never the top family", every
  `exit write-out` line); they read the files, not this task's output.
- markdownlint lints both files: `.markdownlint-cli2.yaml` ignores
  `docs/superpowers/**` and `skills/tanto/templates/**` only, so
  `roles/jisso.md` and `roles/kaiseki.md` get a real markdownlint run in the
  lint step, with `--fix` active.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md
```

Expected: `i/lf w/crlf attr/text=auto` on both, and never `w/mixed`.

- [ ] **Step 2: The Models table, re-keyed, with the limit pointer**

**A16.1** `skills/tanto/roles/jisso.md` — `grep -cF 'a resident session is what must not hold one' skills/tanto/roles/jisso.md` — before: 0, after: 1

**P16.1** `skills/tanto/roles/jisso.md` — replace exactly these 18 lines

```text
## Models

Every dispatch names a `model` taken from `tanto.json`. None omits it — an
omitted model inherits your session's.

| The skill says | tanto key |
| --- | --- |
| implementer, cheap or standard model, fix rounds 1-3 | `subagents.implementer` |
| task reviewer, scoped re-review, final whole-branch review on the most capable available model | `subagents.reviewer`, and the whole-branch review is Kanri's dispatch and not yours |
| fix rounds 4-5, one tier above the implementer that got stuck | `subagents.escalation` |
| the plan drafter | `subagents.drafter`, which is Sekkei's dispatch and not yours |
| the spec reviewer, the plan reviewer | `subagents.reviewer`, also Sekkei's |
| the review brief writer | `subagents.reviewer`, Kanri's dispatch and not yours |
| anything else — an ad-hoc search, a one-off exploration | `subagents.default` |

One key for every review is deliberate: no `tanto` subagent runs on the top
family. Every batch prompt restates the concrete families as compaction
insurance — trust the prompt over your recollection.
```

**P16.1 →**

```text
## Models

Every dispatch names `subagent_type: tanto-<object>-<act>` and
`model: <family>` together — the model from `tanto.json`, the effort from the
definition that name resolves to. None omits the model; an omitted model
inherits your session's. The one exception is a kind your start line reported
as not visible to this session: that dispatch names `model` alone.

| The skill says | tanto kind |
| --- | --- |
| implementer, fix rounds 1-3 | `task.implement`, sonnet — `subagent_type: tanto-task-implement` |
| task reviewer, the spec-compliance half | `task.review-spec`, opus — `subagent_type: tanto-task-review-spec` |
| task reviewer, the code-quality half, and the scoped re-review | `task.review-quality`, opus — `subagent_type: tanto-task-review-quality` |
| fix rounds 4-5, one tier above the implementer that got stuck | `task.escalate`, opus — `subagent_type: tanto-task-escalate` |
| the final whole-branch review | `branch.review`, which is Kanri's dispatch and not yours |
| the plan drafter, the plan reviewer | `plan.draft` and `plan.review`, which are Keikaku's and not yours |
| the spec reviewer | `spec.review`, Sekkei's |
| the review brief writer | `brief.write`, the document's author's |
| anything else — an ad-hoc search, a one-off exploration | `default`, sonnet — `subagent_type: tanto-default` |

The families named are the built-in defaults; what a dispatch takes is the
merged `tanto.json`. Your reviews and your escalation sit a family above your
implementers on purpose: a one-shot is what the stronger family is bought
for, and a resident session is what must not hold one. Every batch prompt
restates the concrete families as compaction insurance — trust the prompt
over your recollection.

A limit is a pause, never a cheaper dispatch. Follow `SKILL.md`'s limit rule:
on a 429 that names a weekly or daily quota, no retry on a lower family,
nothing half-done committed, `paused: <dispatch> on <family> — resets <time>`
to Kanri — or into your report's Rulings needed when a report is due — and
idle with the work in hand; a per-minute 429 gets one retry, then the same.
```

- [ ] **Step 3: Your subagent layer is the definitions**

**P16.2** `skills/tanto/roles/jisso.md` — replace exactly these 7 lines

```text
## Your subagent layer

The built-in Agent tool with the `model` from `tanto.json`. No custom
`.claude/agents` definitions. The prompts are subagent-driven-development's own
templates — `implementer-prompt.md`, `task-reviewer-prompt.md`, and
`re-review-prompt.md`. Implementers never dispatch subagents; that SDD rule
holds here unchanged.
```

**P16.2 →**

```text
## Your subagent layer

The agent definitions you wrote at your start are the layer: one file per
kind, each carrying that kind's effort and nothing else, which is why the
definition carries the effort and the dispatch carries the model. They are
protocol, not prompts — the prompts are still subagent-driven-development's
own templates, `implementer-prompt.md`, `task-reviewer-prompt.md`, and
`re-review-prompt.md`, which nothing here replaces or edits. Implementers
never dispatch subagents; that SDD rule holds here unchanged.
```

- [ ] **Step 4: The fix loop's escalation kind**

**P16.3** `skills/tanto/roles/jisso.md` — replace exactly these 4 lines

```text
The SDD fix loop is unchanged: five rounds per task, rounds 1-3 resume the
original implementer, rounds 4-5 dispatch a fresh implementer on
`subagents.escalation`, and the breaker adjudicates at five. `tanto` adds one
condition on top:
```

**P16.3 →**

```text
The SDD fix loop is unchanged: five rounds per task, rounds 1-3 resume the
original implementer, rounds 4-5 dispatch a fresh implementer on
`task.escalate`, and the breaker adjudicates at five. `tanto` adds one
condition on top:
```

- [ ] **Step 5: Reading the Kaiseki report, and the review-report exception**

**P16.4** `skills/tanto/roles/jisso.md` — replace exactly these 7 lines

```text
Kanri answers with one of two things. `fix per kaiseki-<n>.md` means resume
task N, apply that report's minimal fix, add its regression test, and set the
fix-round counter back to zero. `continue the SDD rounds` means the human
declined to create Kaiseki: resume at round 3 with the resumed implementer and
send rounds 4-5 to `subagents.escalation`.

While Kaiseki works this tree, you idle.
```

**P16.4 →**

```text
Kanri answers with one of two things. `fix per kaiseki-<n>.md` means resume
task N, read that report by its `sections` and not whole — it has a fixed
skeleton, so name what you need — apply its minimal fix, add its regression
test, and set the fix-round counter back to zero. `continue the SDD rounds`
means the human declined to create Kaiseki: resume at round 3 with the
resumed implementer and send rounds 4-5 to `task.escalate`.

A review report is the exception to that reading: read one whole. Its worth
is the argument it makes, and a finding you skipped is a finding you did not
fix.

While Kaiseki works this tree, you idle.
```

- [ ] **Step 6: The overrides table's Model Selection row**

**P16.5** `skills/tanto/roles/jisso.md` — replace exactly this 1 line

```text
| SDD Model Selection — scale the tier per dispatch, final review on the most capable model | use the `tanto.json` kinds, with one `reviewer` key for every review and never the top family | the personal file sets the tiers, and a top-family subagent is what rate-limited a real run |
```

**P16.5 →**

```text
| SDD Model Selection — scale the tier per dispatch, final review on the most capable model | dispatch the `tanto.json` kinds of Models above, each by `subagent_type` and `model` | the personal file sets the families and the definitions the efforts, and the whole-branch review is Kanri's dispatch |
```

- [ ] **Step 7: The overrides table's `shoroku` row**

**P16.6** `skills/tanto/roles/jisso.md` — replace exactly this 1 line

```text
| `shoroku` — propose in chat, wait for the human's `Direction?`, never start without their explicit confirmation | propose and receive direction as files, with Kanri answering as the human's delegate | you do not talk to the human unless Kanri grants it, and adoption is a Kanri ruling by design |
```

**P16.6 →**

```text
| `shoroku` — propose in chat, wait for the human's `Direction?`, never start without their explicit confirmation | write the proposal to a file and stop there; a dispatched recommender reads it and the human checks the recommendation by exception | you do not talk to the human unless Kanri grants it, and every item reaches the human that way |
```

- [ ] **Step 8: The scoped re-review's kind**

**P16.7** `skills/tanto/roles/jisso.md` — replace exactly these 2 lines

```text
2. Run **exactly one** scoped re-review of the fix wave, on
   `subagents.reviewer`, with subagent-driven-development's re-review prompt.
```

**P16.7 →**

```text
2. Run **exactly one** scoped re-review of the fix wave, on
   `task.review-quality`, with subagent-driven-development's re-review
   prompt.
```

- [ ] **Step 9: T2 and the exit become the proposal**

**P16.8** `skills/tanto/roles/jisso.md` — replace exactly these 32 lines

```text
## T2 and the exit — the shoroku write-out

You hold the context this write-out needs — the SDD ledger's rulings, parked
findings, and deferred minors, plus everything the batch reports compressed —
and you do not talk to the human unless Kanri grants it. So the `shoroku` run
is split, and Kanri answers `Direction?` through a file.

**Propose.** On Kanri's T2 prompt, run `shoroku` in file mode over the
conductor ledger, inline in this session, up to the proposal. Write the
numbered list to `shoroku-proposal.md` in the topic directory,
`.tanto/<topic>/`, **instead of printing it**, seeded by the conductor
ledger's adopted `S-n` rows and extended from your own context. Then send
Kanri one line with the path, and idle.

**Apply.** Kanri answers with the path of `shoroku-direction.md`, which rules
on every item — accept, reject, or accept with an edit. Apply the accepted
subset per the repo's `docs/AGENTS.md` and the per-type `docs/<type>/AGENTS.md`
files, lint the changed paths, make **one** commit, and report. Write nothing
the direction file did not accept.

**Your exit** is this same procedure under the exit file names, run at the
boundary where Kanri replaces you or where the plan ends; at plan end, T2 *is*
that exit. Kanri sends `exit: propose your shoroku; write it to <path>`, the
path being `exit-jisso-<X>-proposal.md` in the topic directory,
`.tanto/<topic>/`, with `<X>` the batch letter, and answers item by item in
`exit-jisso-<X>-direction.md` beside it.
Apply, lint, commit once by explicit path in the slot Kanri gives you, and
answer `exit write-out committed: <subject> — <reading>` or
`exit write-out: nothing accepted — <reading>`. Any write-out — this one, T2,
or a later
one — takes only the adopted `S-n` rows whose Written column says `no`, so
nothing is written twice.
```

**P16.8 →**

```text
## T2 and the exit — the shoroku write-out

You hold the context this proposal needs — the SDD ledger's rulings, parked
findings, and deferred minors, plus everything the batch reports compressed —
and you do not talk to the human unless Kanri grants it. So you write the
proposal and stop there: the recommendation, the human's check, and the apply
are dispatched work of Kanri's, and none of it waits on you.

**Propose.** On Kanri's T2 prompt, run `shoroku` in file mode over the
conductor ledger, inline in this session, up to the proposal. Write the
numbered list to `shoroku-proposal.md` in the topic directory,
`.tanto/<topic>/`, **instead of printing it**, seeded by the conductor
ledger's adopted `S-n` rows whose Written column says `no` — so nothing is
proposed twice — and extended from your own context. Then send Kanri one line
with the path, and idle.

**Your exit** is that same proposal under the exit file names, written at the
boundary where Kanri replaces you or where the plan ends; at plan end, T2
*is* that exit. Kanri sends
`exit: propose your shoroku; write it to <path>`, the path being
`exit-jisso-<X>-proposal.md` in the topic directory, `.tanto/<topic>/`, with
`<X>` the batch letter. Write it, run the self-check of `SKILL.md`'s
Resuming, and answer `exit proposal: <path> — <reading>`. Then idle: you
apply nothing and commit nothing at your exit, and your deletion follows the
proposal.
```

- [ ] **Step 10: Kaiseki commits nothing when attached**

**A16.2** `skills/tanto/roles/kaiseki.md` — `grep -cF 'rule 9 counts top-family sessions' skills/tanto/roles/kaiseki.md` — before: 0, after: 1

**P16.9** `skills/tanto/roles/kaiseki.md` — replace exactly these 2 lines

```text
You find root causes. You never fix, and you commit nothing but your own exit
shoroku. Your output is one report per case; Jisso applies what it says.
```

**P16.9 →**

```text
You find root causes. You never fix, and attached you commit nothing at all.
Your output is one report per case; Jisso applies what it says.
```

- [ ] **Step 11: The `default` dispatch key**

**P16.10** `skills/tanto/roles/kaiseki.md` — replace exactly these 3 lines

```text
The tree is yours to use while you work. Run the tests as often as you like,
add temporary instrumentation, bisect. If you dispatch a subagent, it takes
`subagents.default`; you never omit the model.
```

**P16.10 →**

```text
The tree is yours to use while you work. Run the tests as often as you like,
add temporary instrumentation, bisect. If you dispatch a subagent, it is the
`default` kind — `subagent_type: tanto-default` with the `model` from
`tanto.json`; you never omit the model.
```

- [ ] **Step 12: The rule-9 sentence**

**P16.11** `skills/tanto/roles/kaiseki.md` — replace exactly these 4 lines

```text
Under the grant your brief names, the human may talk to you directly, and
often should — debugging needs what only they know about the environment;
beyond it, what you need from them is a `human-needed:` line to Kanri. Jisso
idles while you work, and Sekkei pauses.
```

**P16.11 →**

```text
Under the grant your brief names, the human may talk to you directly, and
often should — debugging needs what only they know about the environment;
beyond it, what you need from them is a `human-needed:` line to Kanri. Jisso
idles while you work, and Sekkei pauses: rule 9 counts top-family sessions,
you are one of them, and Kikaku is excepted as human-paced.
```

- [ ] **Step 13: Tree discipline's first bullet**

**P16.12** `skills/tanto/roles/kaiseki.md` — replace exactly these 2 lines

```text
- You **do not fix**. You commit once, at your exit, and only the accepted
  shoroku subset under `docs/`.
```

**P16.12 →**

```text
- You **do not fix**. Attached, you commit nothing at all: your exit is a
  proposal on disk, and the write-out is dispatched work.
```

- [ ] **Step 14: The exit paragraph**

**P16.13** `skills/tanto/roles/kaiseki.md` — replace exactly these 9 lines

```text
Attached, your exit is `SKILL.md`'s "Session exit" applied to you. Your
candidates are this case's **Shoroku candidates** section plus every "Other
defects observed" item tagged `blocks this task: no`. On Kanri's
`exit: propose your shoroku; write it to <path>`, write them to
`.tanto/<topic>/exit-kaiseki-<n>-proposal.md`; on its
`exit: direction at <path>`, apply the accepted subset under `docs/` per
`docs/AGENTS.md`, lint, commit once by explicit path in the slot Kanri gives
you, and answer `exit write-out committed: <subject> — <reading>` or
`exit write-out: nothing accepted — <reading>`.
```

**P16.13 →**

```text
Attached, your exit is `SKILL.md`'s "Session exit" applied to you. Your
candidates are this case's **Shoroku candidates** section plus every "Other
defects observed" item tagged `blocks this task: no`. On Kanri's
`exit: propose your shoroku; write it to <path>`, write them to
`.tanto/<topic>/exit-kaiseki-<n>-proposal.md`, run the self-check of
`SKILL.md`'s Resuming, and answer `exit proposal: <path> — <reading>`. Then
idle: the recommendation, the human's check, and the apply are dispatched
work, and your deletion follows.
```

- [ ] **Step 15: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 16: Commit**

```bash
git commit --only skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md -m "docs(tanto): re-key both role files to the twelve kinds and end their exits at the proposal" -m "Jisso: the Models table becomes task.implement, task.review-spec, task.review-quality and task.escalate, each dispatched by subagent_type with a model; the subagent layer is the generated definitions; the overrides table's Model Selection and shoroku rows follow the first two ADRs; T2 and the exit are the proposal only; one sentence points at the limit rule. Kaiseki: the default key, rule 9 on top-family sessions, and an exit that applies and commits nothing. Spec sections 11.5, 1.2, 2.5, 5.2, 5.3, 8.1, 9.1." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 17: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 18: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 16
```

Expected: `task 16: verify clean`.

**Done when:** all thirteen passages are present in the two role files, the
two anchors read 1, no `subagents.<kind>` key and no `exit write-out` line
survives in either file, the SDD stop-classes blockquote is byte-identical to
`SKILL.md`'s copy, lint is clean on both paths, and the one commit carries
its `Co-Authored-By:` trailer.

---

### Task 17: The ledger and the roster templates

**Batch:** E. **Blocks:** A17.1, P17.1, P17.2, P17.3, P17.4, P17.12, A17.2, P17.5, P17.6, P17.7, P17.8, P17.9, P17.10, P17.11.

These two templates are what a Kanri fills in, so every column name, status
word, and line form in them has to be the one the role files now use. Spec
11.6 lists what changes; the content behind it is section 4.2 for the roster's
columns, statuses, keeping rule, and Events forms, section 5.1 for the
ledger's Shoroku candidates table and the recommendation that replaces the
adoption ruling, section 8.4 for Measurements' fixed rows, section 9.1 for the
`paused:` rows, and section 10 for the per-topic reading of the keeping rule.
The ledger's Plan section joins them: its Branch line names Sekkei alone as
the one who cuts the branch, and fixed input 12 gives the branch two cutters —
Sekkei when no batch is in flight, Keikaku after the merge when the spec was
drafted during another topic's batches — so the guidance has to say both.

The placeholder rows are issue-2872. Each table gets one placeholder distinct
from the other's, and the angle-bracket guidance that used to live inside the
row moves to the prose above the table, so that a scripted fill keyed on the
placeholder is unambiguous. Counted from their header rows: the Batches table
has six columns, so its placeholder carries six empty cells and seven pipes;
both Shoroku candidates tables have seven columns, so eight pipes. The
`(none yet)` form issue-2872 quotes is what a Kanri wrote into a live ledger,
not what the template holds, so it is not what these blocks replace.

**Files:**

- Modify: `skills/tanto/templates/kanri.md` — five passages, in file order: the
  readers line, the Plan section's Branch line, the Batches table, the Shoroku
  candidates table with the paragraph that made adoption a Kanri ruling, and
  Measurements.
- Modify: `skills/tanto/templates/roster.md` — seven passages: two keeping-rule
  passages, the status table with the `refused` sentence, the Residency header
  row, the archive sentence in the Residency prose, the Shoroku candidates
  table, and the Events forms.

**Interfaces:**

- Consumes, from batch B and batch C: every name in these templates is fixed
  by a role file or `SKILL.md` written earlier — the roster's eleven columns,
  the five statuses and the keeping rule from `roles/kanri.md`; the four
  shoroku steps, the stage words, and the `<stage>-recommendation.md` and
  `<stage>-direction.md` paths from `roles/kanri.md` and `SKILL.md`; the
  `paused: <dispatch> on <family> — resets <time>` and
  `continue: <dispatch> — same model` forms from the limit rule; the
  `cleared:` and `decision:` Events forms from the roster's keeper. A template
  that disagrees with `roles/kanri.md` is the defect this task exists to
  avoid, so read those files as they stand after batches B and C, not as they
  stood when the plan was written.
- Produces, for task 22 and the plan's Verification section: the last two
  copies of the old adoption wording and of the roster's old column set. No
  later task consumes these files.
- markdownlint does not lint either file: `.markdownlint-cli2.yaml` ignores
  `skills/tanto/templates/**`. The hooks that decide the lint step here are
  trailing whitespace, end-of-file fixer, and mixed line ending, so nothing in
  the step normalizes Markdown and no passage can be rewritten under you.
- Not this task: `templates/tanto.json` and `templates/agent.md` are task 4's,
  `templates/kikaku-decision.md` is task 15's. `batch-report.md`,
  `bug-report.md`, `kaiseki-brief.md`, `kaiseki-report.md`, and
  `roster-archive.md` are unchanged by the whole plan.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/templates/kanri.md skills/tanto/templates/roster.md
```

Expected: `i/lf w/crlf attr/text=auto` on both, and never `w/mixed`.

- [ ] **Step 2: The ledger's anchor and its readers line**

**A17.1** `skills/tanto/templates/kanri.md` — `grep -cF '(no batch yet)' skills/tanto/templates/kanri.md` — before: 0, after: 1

**P17.1** `skills/tanto/templates/kanri.md` — replace exactly these 3 lines

```text
Kept by Kanri. Sekkei, Jisso, and Kaiseki read it; none of them writes it.
Lives at `.tanto/<topic>/kanri.md` from the topic's opening to the plan's
close, and never moves.
```

**P17.1 →**

```text
Kept by Kanri. Sekkei, Keikaku, Jisso, Kaiseki, Kikaku, and Hosa read it;
none of them writes it. Lives at `.tanto/<topic>/kanri.md` from the topic's
opening to the plan's close, and never moves.
```

- [ ] **Step 3: The Batches table's guidance and placeholder**

**P17.2** `skills/tanto/templates/kanri.md` — replace exactly these 3 lines

```text
| Batch | Tasks | State | Prompt | Report | Verdict |
| --- | --- | --- | --- | --- | --- |
| <A> | <1-4> | <planned, sent, reported, accepted, or rework> | <batch-A-prompt.md> | <batch-A-report.md> | <one line — accepted, or what must change> |
```

**P17.2 →**

```text
Columns: Batch, the letter; Tasks, the plan's task numbers; State, one of
planned, sent, reported, accepted, or rework; Prompt and Report, the two file
names under `.tanto/<topic>/`; Verdict, one line — accepted, or what must
change. One row per batch, added as the batch is planned; the placeholder row
stays until the first one is.

| Batch | Tasks | State | Prompt | Report | Verdict |
| --- | --- | --- | --- | --- | --- |
| (no batch yet) | | | | | |
```

- [ ] **Step 4: The Shoroku candidates table and the recommendation**

**P17.3** `skills/tanto/templates/kanri.md` — replace exactly these 8 lines

```text
| S-n | Source | Candidate | Destination | Adopted | Stage | Written |
| --- | --- | --- | --- | --- | --- | --- |
| S-1 | <the report or session that raised it> | <one line> | <requirements, design, decisions, issues, notes, or reports> | <yes, no, or escalated> | <T0, T1, T2, or exit:<role>[-<suffix>] — exit:jisso-B, exit:sekkei, exit:kaiseki-1, exit:kanri-<YYYY-MM-DD>-<name>> | <no, or the subject of the commit that wrote the row out> |

Adoption is a Kanri ruling at every stage. Escalate to the human, as one
numbered list, only an item that adds to or changes a requirement or an ADR,
and an item that cannot be classified with confidence. Everything else is
decided here and the human sees the result in the commit.
```

**P17.3 →**

```text
Columns: S-n, the row id; Source, the report or session that raised it;
Candidate, one line; Destination, one of requirements, design, decisions,
issues, notes, or reports; Adopted, one of `pending`, `yes`, and `no`; Stage,
the stage word — `t0`, `t1`, `t2`, or `exit-<role>[-<suffix>]`, as in
`exit-jisso-B`, `exit-sekkei`, `exit-kaiseki-1`, and
`exit-kanri-<YYYY-MM-DD>-<name>`; Written, `no` or the subject of the commit
that wrote the row out. The placeholder row stays until the first candidate
arrives.

| S-n | Source | Candidate | Destination | Adopted | Stage | Written |
| --- | --- | --- | --- | --- | --- | --- |
| (no candidate yet) | | | | | | |

Nothing is adopted here by a ruling. A candidate copied in at a boundary —
from a batch report's Shoroku candidates, a Kaiseki report's
`blocks this task: no` items, or a review report — arrives with Adopted
`pending` and Stage `t2`, and stays `pending` until the stage that recommends
it. At every stage Kanri dispatches the `shoroku` kind to write
`<stage>-recommendation.md`, which lists every item once in three groups —
recommended adopt, recommended reject, unsure; tells the human that path and
the three counts; and writes `<stage>-direction.md` from the human's answer,
and these rows with it, Adopted `yes` or `no` as the direction says and Stage
the stage word. No item is put to the human apart from the rest and none is
settled by Kanri alone: the human sees the whole list, grouped, and answers by
exception.
```

- [ ] **Step 5: Measurements**

**P17.4** `skills/tanto/templates/kanri.md` — replace exactly these 7 lines

```text
| What | When | Value |
| --- | --- | --- |
| strong-model sessions active at once, the peak, and whether a 429 was seen | <YYYY-MM-DD, the plan close> | <the peak count, and yes or no for the 429> |

The first row is fixed and always present. Kanri fills it at the plan close
from this ledger's Session events, where it writes one line each time a third
strong-model session goes live; further rows are added as they are measured.
```

**P17.4 →**

```text
| What | When | Value |
| --- | --- | --- |
| top-family sessions active at once, the peak, and whether a 429 was seen | <YYYY-MM-DD, the plan close> | <the peak count, and yes or no for the 429> |
| top-family one-shots per plan, counted by kind | <YYYY-MM-DD, the plan close> | <one count per kind dispatched on the top family> |
| each role's last reading | <YYYY-MM-DD, the plan close> | <the roster's Residency figures, copied, one role per line> |
| the day's cost, uncached input, cache miss, cache hit, and hit rate | <YYYY-MM-DD> | <the five figures as the human pastes them from the Claude Code Usage extension> |

These four rows are fixed and always present. Kanri fills the first at the
plan close from this ledger's Session events, where it writes one line each
time a third top-family session goes live; the second by counting those same
events' one-shot lines by kind and not by stage, since one kind is dispatched
at several stages; the third by copying the roster's Residency rows; the
fourth from what the human pastes. None of the four is a threshold — they are
the record the next measurement starts from.

A `paused: <dispatch> on <family> — resets <time>` line a role sends is
recorded as a row of its own: What the line as it arrived, When the date, and
Value the reset time Kanri told the human, joined by the
`continue: <dispatch> — same model` that ended the pause. Further rows are
added as they are measured.
```

- [ ] **Step 6: Who cuts the branch**

**P17.12** `skills/tanto/templates/kanri.md` — replace exactly this 1 line

```text
- Branch — <branch name, cut from main by Sekkei>
```

**P17.12 →**

```text
- Branch — <branch name; Sekkei cuts it from main when no batch is in flight,
  Keikaku after the merge otherwise>
```

- [ ] **Step 7: The roster's anchor and its keeping rule**

**A17.2** `skills/tanto/templates/roster.md` — `grep -cF 'live session per role and topic; Kanri, Kikaku, and Hosa one each' skills/tanto/templates/roster.md` — before: 0, after: 1

**P17.5** `skills/tanto/templates/roster.md` — replace exactly these 3 lines

```text
- One row per role, Kanri's own row first.
- One live session per role. A second handshake for a role that already has a
  live row gets no row and is reported to the human.
```

**P17.5 →**

```text
- One row per role and topic, Kanri's own row first.
- One live session per role and topic; Kanri, Kikaku, and Hosa one each. A
  second handshake for a role and topic that already has a live row gets no
  row and is reported to the human.
```

- [ ] **Step 8: The archive bullet and the address book**

**P17.6** `skills/tanto/templates/roster.md` — replace exactly these 9 lines

```text
- A row whose session is no longer listed by `ListAgents` gets status `dead`.
  A dead, replaced, or refused row stays, with its Residency row, until the
  plan closes, then both move to `roster-archive.md` as one row, so the run
  stays readable after a replacement and the roster stays short.
- This is the address book: one row per live role, Kanri's row first, the
  `Name [ref]` column being the address the row's session answers to, used as
  the bare name. It stays correct because nothing renames a session. The
  `[ref]` is load-bearing: it identifies a session across the listing, the
  roster, and the handover.
```

**P17.6 →**

```text
- A row whose session is no longer listed by `ListAgents` gets status `dead`.
  A dead, replaced, refused, or cleared row stays, with its Residency row,
  until the plan closes, then both move to `roster-archive.md` as one row, so
  the run stays readable after a replacement and the roster stays short.
- This is the address book: one row per live role and topic, Kanri's row
  first, the `Name [ref]` column being the address the row's session answers
  to, used as the bare name. It stays correct because nothing renames a
  session. The `[ref]` is load-bearing: it identifies a session across the
  listing, the roster, and the handover.
```

- [ ] **Step 9: The status table and the `refused` sentence**

**P17.7** `skills/tanto/templates/roster.md` — replace exactly these 8 lines

```text
| Role | Name [ref] | cwd | Model | Branch | Mode | Started | Status | Transcript |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | <name> [<ref>] | <absolute path> | <model id> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path or unavailable> |
| <role> | <name> [<ref>] | <absolute path> | <model id> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path or unavailable> |

Status is one of `live`, `dead`, `replaced`, `refused`. `refused` records a
handshake that got no row — a duplicate role, or a model that did not match
`sessions.<role>` — and is always followed by an Events line saying which.
```

**P17.7 →**

```text
| Role | Topic | Name [ref] | cwd | Model | Effort | Branch | Mode | Started | Status | Transcript |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> [<ref>] | <absolute path> | <model id> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path or unavailable> |
| <role> | <topic> | <name> [<ref>] | <absolute path> | <model id> | <level or unknown> | <branch> | <auto or unknown> | <YYYY-MM-DD HH:MM> | live | <absolute path or unavailable> |

Topic is the topic word Kanri's orders line gave that session, or `—` for
Kanri, Kikaku, Hosa, and a standalone Kaiseki. Effort is what the handshake's
`effort=` carried.

Status is one of `live`, `dead`, `replaced`, `refused`, and `cleared`.
`refused` records a handshake that got no row — a second live session for the
same role and topic, or a model that did not match `sessions.<role>` — and is
always followed by an Events line saying which; a second Sekkei or Keikaku
whose topic differs from the live one's is not a duplicate and gets its own
row. `cleared` records a Kikaku or Hosa row the human's `/clear` ended: a
handshake whose `transcript=` matches no row, or whose name is already here
with a different transcript, and whose role is Kikaku or Hosa, writes a new
row and marks the old one `cleared`.
```

- [ ] **Step 10: The Residency header row**

**P17.8** `skills/tanto/templates/roster.md` — replace exactly these 4 lines

```text
| Role | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | <name> [<ref>] | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | <n> | <m> | <k> |
| <role> | <name> [<ref>] | <YYYY-MM-DD> | <boundary> | <n> | <n> | <n> | <n> | — | — | — |
```

**P17.8 →**

```text
| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> [<ref>] | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | <n> | <m> | <k> |
| <role> | <topic> | <name> [<ref>] | <YYYY-MM-DD> | <boundary> | <n> | <n> | <n> | <n> | — | — | — |
```

- [ ] **Step 11: The Residency prose's archive sentence**

**P17.9** `skills/tanto/templates/roster.md` — replace exactly these 5 lines

```text
the session sent that. At the plan close every row whose session is dead,
replaced, or refused moves to `roster-archive.md`, joined with its status row
above, and it is the archive's rows across runs that a threshold for replacing
a peer will be read from (issue-40ed's other half; the handover half closed
with decision-b6cb, which made the plan close the ordinary trigger).
```

**P17.9 →**

```text
the session sent that. At the plan close every row whose session is dead,
replaced, refused, or cleared moves to `roster-archive.md`, joined with its
status row above, and it is the archive's rows across runs that a threshold
for replacing a peer will be read from (issue-40ed's other half; the handover
half closed with decision-b6cb, which made the plan close the ordinary
trigger).
```

- [ ] **Step 12: The roster's Shoroku candidates table**

**P17.10** `skills/tanto/templates/roster.md` — replace exactly these 3 lines

```text
| S-n | Source | Candidate | Destination | Adopted | Stage | Written |
| --- | --- | --- | --- | --- | --- | --- |
| S-1 | <the triage, report, or session that raised it> | <one line> | <requirements, design, decisions, issues, notes, or reports> | <yes, no, or escalated> | <T0, T1, T2, or exit:<role>[-<suffix>]> | <no, or the subject of the commit that wrote the row out> |
```

**P17.10 →**

```text
Columns as the ledger's, with Source the triage, report, or session that
raised it; Destination one of requirements, design, decisions, issues, notes,
or reports; Adopted one of `pending`, `yes`, and `no`; Stage the stage word —
`t0`, `t1`, `t2`, or `exit-<role>[-<suffix>]`; and Written `no` or the subject
of the commit that wrote the row out. The placeholder row stays until the
first candidate arrives.

| S-n | Source | Candidate | Destination | Adopted | Stage | Written |
| --- | --- | --- | --- | --- | --- | --- |
| (no candidate yet) | | | | | | |
```

- [ ] **Step 13: The Events forms**

**P17.11** `skills/tanto/templates/roster.md` — replace exactly these 5 lines

```text
  resumed: <old name> → <new name>;
  a handover written by <name> [<ref>];
  a handover accepted by <name> [<ref>] from <name> [<ref>]; an exit shoroku
  committed by <name> [<ref>], or not run and what was lost; a bug report
  received, or sent to <name> [<ref>]; a hotfix committed between plans>
```

**P17.11 →**

```text
  resumed: <old name> → <new name>;
  cleared: <old name> → <new name>;
  a handover written by <name> [<ref>];
  a handover accepted by <name> [<ref>] from <name> [<ref>]; an exit shoroku
  committed by <name> [<ref>], or not run and what was lost; a bug report
  received, or sent to <name> [<ref>];
  decision: <path> received from <name>;
  a hotfix committed between plans>
```

- [ ] **Step 14: Lint**

```bash
./scripts/lint.sh skills/tanto/templates/kanri.md skills/tanto/templates/roster.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 15: Commit**

```bash
git commit --only skills/tanto/templates/kanri.md skills/tanto/templates/roster.md -m "docs(tanto): re-key the ledger and roster templates to the recommendation, the topics, and the measurement" -m "kanri.md: the six readers; the Branch line's two cutters; the Batches and Shoroku candidates placeholder rows of issue-2872, distinct and with their guidance in the prose above each table; Adopted pending/yes/no and the recommendation in place of the adoption ruling; Measurements' four fixed rows and the paused: rows. roster.md: the Topic and Effort columns, the cleared status, the keeping rule per role and topic, the refused sentence, the Residency header row, and the two new Events forms." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 16: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 17: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 17
```

Expected: `task 17: verify clean`.

**Done when:** all twelve passages are in the two templates, both anchors read
1, each placeholder row's pipe count matches its header's, the Branch line
names both cutters, `./scripts/lint.sh` is clean on the two paths, and the
single commit carries its trailer.

---

### Task 18: The handover, batch prompt, and review brief templates

**Batch:** E. **Blocks:** A18.1, P18.1, P18.2, P18.3, P18.8, A18.2, P18.4, A18.3, P18.5, P18.6, P18.7.

Three templates re-keyed to what the roles now do. Spec 11.6 lists them;
section 10 is behind the handover's two changes — with two ledgers open, In
flight carries one block per open ledger and Live peers carries every peer of
every open topic with its Topic, so that the successor's `kanri-address:`
reaches all of them and the re-send rule has a list to work from (I-2,
point 2). The handover's Residency table goes with them: line 43 calls it
"Kanri's Residency row from the roster, verbatim", so its header row, its
separator, and its sample row take the Topic column cell for cell as
`templates/roster.md` takes it in task 17. Section 1.2 is behind the two
Models lines: the families now hang
off the kinds, so each line names the kind, its family, and its definition
file, as `roles/jisso.md` states them. Section 6 is behind the brief
template's three sentences: the author dispatches the brief writer, so the
template's header says so, and the two places where Sekkei was named as the
one who asks for a missing `— If unanswered:` clause and who states the
recommendation with the brief read "the author" — Keikaku is that author for
a plan.

Nothing here changes a heading, and no passage adds a rule the role files do
not already carry; these are the copies a session reads while it works, and a
copy that disagrees with its role file is the defect this task exists to
avoid.

**Files:**

- Modify: `skills/tanto/templates/kanri-handover.md` — four passages: the In
  flight section, the Live peers section, the Models line, and the Residency
  header row with its separator and sample row.
- Modify: `skills/tanto/templates/batch-prompt.md` — one passage: the Models
  line of "Rulings to carry into dispatches".
- Modify: `skills/tanto/templates/review-brief.md` — three passages: the
  header sentence and the two mentions of Sekkei.

**Interfaces:**

- Consumes, from batch B and batch C: the twelve kinds with their families and
  definition files as `roles/jisso.md` states them (task 16) — the two Models
  lines must read as that file reads; the handover's trigger and contents from
  `roles/kanri.md`, including `kanri-address:` and the re-send rule; and the
  brief's dispatcher and its form check from `roles/sekkei.md`,
  `roles/keikaku.md`, and `SKILL.md`'s "The brief's form".
- Produces, for task 22 and the plan's Verification section: the last copies of
  the old `subagents.*` family keys and of the brief template's Sekkei
  wording. No later task consumes these files.
- markdownlint lints none of the three: `.markdownlint-cli2.yaml` ignores
  `skills/tanto/templates/**`. The hooks that decide the lint step here are
  trailing whitespace, end-of-file fixer, and mixed line ending, so nothing in
  the step rewrites a passage under you.
- Not this task: `templates/tanto.json` and `templates/agent.md` are task 4's,
  `templates/kikaku-decision.md` is task 15's, and `templates/kanri.md` and
  `templates/roster.md` are task 17's. `batch-report.md`, `bug-report.md`,
  `kaiseki-brief.md`, `kaiseki-report.md`, and `roster-archive.md` are
  unchanged by the whole plan.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/templates/kanri-handover.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/review-brief.md
```

Expected: `i/lf w/crlf attr/text=auto` on all three, and never `w/mixed`.

- [ ] **Step 2: The handover's anchor and its In flight section**

**A18.1** `skills/tanto/templates/kanri-handover.md` — `grep -cF 'One block per open ledger' skills/tanto/templates/kanri-handover.md` — before: 0, after: 1

**P18.1** `skills/tanto/templates/kanri-handover.md` — replace exactly these 8 lines

```text
## In flight

- Plan — <the plan basename, or "none">
- Ledger — <.tanto/<topic>/kanri.md, or "none">
- Batch state — <"batch <X> accepted, batch <Y> prompt not sent", or "between
  plans, last plan closed <YYYY-MM-DD>">
- Agents of this session still running — <label and what it was to deliver,
  one per line, or "none">; lost with this session
```

**P18.1 →**

```text
## In flight

One block per open ledger, in the order the topics opened, each under its
topic word; write "none — between plans, last plan closed <YYYY-MM-DD>" when
no topic is open. The two lines after the blocks are written once.

- <topic>
  - Plan — <the plan basename, or "not yet written">
  - Ledger — <.tanto/<topic>/kanri.md>
  - Batch state — <"batch <X> accepted, batch <Y> prompt not sent", or "at the
    spec or plan stage, no batches yet">
- Peers whose last line this session did not answer — <name> [<ref>] — <the
  line, one per line, or "none">; each re-sends it to the successor's
  `kanri-address:`
- Agents of this session still running — <label and what it was to deliver,
  one per line, or "none">; lost with this session
```

- [ ] **Step 3: Live peers**

**P18.2** `skills/tanto/templates/kanri-handover.md` — replace exactly these 3 lines

```text
## Live peers

- <role> — <name> [<ref>] — <what that session is waiting for>
```

**P18.2 →**

```text
## Live peers

Every peer of every open topic, with its Topic as the roster carries it; the
successor sends `kanri-address:` to all of them.

- <role> — <topic> — <name> [<ref>] — <what that session is waiting for>
```

- [ ] **Step 4: The handover's Models line**

**P18.3** `skills/tanto/templates/kanri-handover.md` — replace exactly these 3 lines

```text
- Models the next prompt must restate — implementers on
  <the subagents.implementer family>, every review on <the subagents.reviewer
  family>, fix rounds 4-5 on <the subagents.escalation family>.
```

**P18.3 →**

```text
- Models the next prompt must restate — the task implementation on
  `task.implement` (sonnet, `tanto-task-implement.md`); the per-task reviews
  on `task.review-spec` and `task.review-quality` (opus,
  `tanto-task-review-spec.md` and `tanto-task-review-quality.md`); fix rounds
  4-5 on `task.escalate` (opus, `tanto-task-escalate.md`).
```

- [ ] **Step 5: The handover's Residency header row**

**P18.8** `skills/tanto/templates/kanri-handover.md` — replace exactly these 3 lines

```text
| Role | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | <name> [<ref>] | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | <n> | <m> | <k> |
```

**P18.8 →**

```text
| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kanri | — | <name> [<ref>] | <YYYY-MM-DD> | <boundary or plan close> | <n> | <n> | <n> | <n> | <n> | <m> | <k> |
```

- [ ] **Step 6: The batch prompt's anchor and its Models line**

**A18.2** `skills/tanto/templates/batch-prompt.md` — `grep -cF 'tanto-task-escalate.md' skills/tanto/templates/batch-prompt.md` — before: 0, after: 1

**P18.4** `skills/tanto/templates/batch-prompt.md` — replace exactly these 4 lines

```text
- Models, restated here so they survive compaction — implementers on
  <the subagents.implementer family>, every review on <the subagents.reviewer
  family>, fix rounds 4-5 on <the subagents.escalation family>. Every dispatch
  names its model. None omits it.
```

**P18.4 →**

```text
- Models, restated here so they survive compaction — the task implementation
  on `task.implement` (sonnet, `tanto-task-implement.md`); the per-task
  reviews on `task.review-spec` and `task.review-quality` (opus,
  `tanto-task-review-spec.md` and `tanto-task-review-quality.md`); fix rounds
  4-5 on `task.escalate` (opus, `tanto-task-escalate.md`). Every dispatch
  names its model. None omits it.
```

- [ ] **Step 7: The brief's anchor and its header sentence**

**A18.3** `skills/tanto/templates/review-brief.md` — `grep -cF 'Written by the brief writer the document' skills/tanto/templates/review-brief.md` — before: 0, after: 1

**P18.5** `skills/tanto/templates/review-brief.md` — replace exactly this 1 line

```text
Written by the brief writer Kanri dispatches, at
```

**P18.5 →**

```text
Written by the brief writer the document's author dispatches, at
```

- [ ] **Step 8: The missing `— If unanswered:` clause**

**P18.6** `skills/tanto/templates/review-brief.md` — replace exactly these 2 lines

```text
such clause is a defective brief: it stays open, and Sekkei asks for it on its
own line rather than reading a default into it.
```

**P18.6 →**

```text
such clause is a defective brief: it stays open, and the author asks for it on
its own line rather than reading a default into it.
```

- [ ] **Step 9: The recommendation a decide point falls back to**

**P18.7** `skills/tanto/templates/review-brief.md` — replace exactly this 1 line

```text
where one exists, and otherwise the recommendation Sekkei states with the
```

**P18.7 →**

```text
where one exists, and otherwise the recommendation the author states with the
```

- [ ] **Step 10: Lint**

```bash
./scripts/lint.sh skills/tanto/templates/kanri-handover.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/review-brief.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 11: Commit**

```bash
git commit --only skills/tanto/templates/kanri-handover.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/review-brief.md -m "docs(tanto): re-key the handover, batch prompt, and review brief templates" -m "kanri-handover.md: In flight carries one block per open ledger and the peers whose last line went unanswered, Live peers carries every peer of every open topic with its Topic, the Residency row takes the roster's Topic column, and the Models line names the task kinds. batch-prompt.md: the same Models line, each kind with its family and definition file. review-brief.md: the brief writer is dispatched by the document's author, and the two mentions of Sekkei read the author." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 12: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 13: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 18
```

Expected: `task 18: verify clean`.

**Done when:** all eight passages are in the three templates, the three
anchors read 1, the handover's Residency row matches the roster's cell for
cell, no `subagents.` key and no mention of Sekkei as the brief's dispatcher
survives in them, `./scripts/lint.sh` is clean on the three paths, and the
single commit carries its trailer.

---

### Task 19: `skills/tanto/README.md` — seven roles and the new flow

**Batch:** E. **Blocks:** A19.1, P19.1, P19.2, P19.3, P19.4, P19.5, P19.6,
P19.7, P19.8, P19.9.

This is the skill's shop window: the file a human reads to decide whether to
use `tanto` at all. Everything batches A to D changed shows here at one
sentence each — the seven roles of spec 1.1 and the two seats of 2.1 and 2.4,
the brief its author now dispatches (6), the resume word `fukki` (Fixed input
8), the `{model, effort}` config and the agent definitions (3.1, 3.3), the
seven subcommands (8) and the thirteen templates, and the shoroku flow of 5
in place of the old "who writes" rule. Spec 11.8 is the change list.

Keep it short. The README describes; the contract and the role files
prescribe, and no rule of theirs is repeated here. Three passages are
additions to 11.8's list, each covering a sentence the plan makes false
elsewhere: the model-check bullet and the `tanto.json` prerequisite both
state the config as one family name per key, which 3.1 replaces with a
per-field `{model, effort}` overlay (old-values entity 4 names that
prerequisite), and the superpowers prerequisite names the seats that invoke
the composed skills, which batch D's `roles/keikaku.md` changes. This is the
one file of the skill that may spell the path `skills/tanto/`, so the paths
it already carries stay as they are.

**Files:**

- Modify: `skills/tanto/README.md` — nine passages: the roles bullet plus a
  new seats bullet; the brief bullet; the composes and model-check bullets;
  the superpowers and `tanto.json` prerequisites; the create-request block in
  Usage; the resume paragraph; the Layout list; and the Relationship
  paragraph with the design list.

**Interfaces:**

- Consumes, from tasks 1 to 18: the whole of batches A to D — this file
  describes them, so every count it states (seven roles, thirteen templates,
  seven subcommands) must match what those tasks landed.
- Produces, for a later task: nothing a later task consumes.
- markdownlint runs on `skills/tanto/README.md`.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/README.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The roles bullet and the two seats**

**A19.1** `skills/tanto/README.md` — `grep -cF 'Adds two seats outside that lifecycle' skills/tanto/README.md` — before: 0, after: 1

**P19.1** `skills/tanto/README.md` — replace exactly these 4 lines

```text
- Runs one plan through separate interactive Claude Code sessions in the same
  repository and on the same branch: **Kanri** (管理) manages, **Sekkei** (設計)
  designs, **Jisso** (実装) implements, **Kaiseki** (解析) root-causes. The
  human creates and deletes sessions; Kanri is the only role that asks.
```

**P19.1 →**

```text
- Runs one plan through separate interactive Claude Code sessions in the same
  repository and on the same branch: **Kanri** (管理) manages, **Sekkei** (設計)
  writes the spec, **Keikaku** (計画) writes the plan, **Jisso** (実装)
  implements, **Kaiseki** (解析) root-causes. The human creates and deletes
  sessions; Kanri is the only role that asks.
- Adds two seats outside that lifecycle, opened by the human and never
  requested by Kanri: **Kikaku** (企画) thinks with the human about what the
  next work is and hands Kanri a decision file, and **Hosa** (補佐) takes the
  small jobs, editing tracked files only in a slot Kanri gives.
```

- [ ] **Step 3: The brief is the author's dispatch**

**P19.2** `skills/tanto/README.md` — replace exactly these 5 lines

```text
- Puts a **review brief** in front of the human before each spec and plan
  review: the points that need the human's judgment, each with a pointer into
  the document, in the chat's language, written by a third party Kanri
  dispatches — so the human confirms those and reads the rest only where a
  point sends them.
```

**P19.2 →**

```text
- Puts a **review brief** in front of the human before each spec and plan
  review: the points that need the human's judgment, each with a pointer into
  the document, in the chat's language, written by a subagent the document's
  author dispatches — Sekkei for the spec, Keikaku for the plan — so the
  human confirms those and reads the rest only where a point sends them.
```

- [ ] **Step 4: What tanto composes, and what it checks**

**P19.3** `skills/tanto/README.md` — replace exactly these 7 lines

```text
- Composes, without editing them, superpowers brainstorming, writing-plans,
  subagent-driven development, systematic-debugging, and requesting-code-review;
  the `docs/` document-management system that `kisou` installs; and `shoroku`
  for the write-out.
- Checks each session's model against a personal `tanto.json` and **warns
  only** — it never switches a model — and puts a concrete model family into
  every subagent dispatch.
```

**P19.3 →**

```text
- Uses superpowers as it is — brainstorming, writing-plans, subagent-driven
  development, systematic-debugging, requesting-code-review — with the `docs/`
  document-management system that `kisou` installs; the write-out runs through
  `shoroku`'s recommend and apply halves, which are that skill's own feature.
- Checks each session's model and effort against a personal `tanto.json` and
  **warns only** — it never switches either — and puts a concrete model family
  into every subagent dispatch and each kind's effort into the agent
  definitions it generates.
```

- [ ] **Step 5: Which seats invoke superpowers**

**P19.4** `skills/tanto/README.md` — replace exactly these 5 lines

```text
  requesting-code-review. Sekkei and Jisso invoke them directly. The SDD
  skill's `sdd-workspace` script owns `.superpowers/sdd/`; tanto's own state
  lives under `.tanto/`, which it ignores and lint-silences itself, and the
  spec and the plan are wherever Kanri's orders line says, by default the
  superpowers convention.
```

**P19.4 →**

```text
  requesting-code-review. Sekkei, Keikaku, and Jisso invoke them directly.
  The SDD skill's `sdd-workspace` script owns `.superpowers/sdd/`; tanto's
  own state lives under `.tanto/`, which it ignores and lint-silences
  itself, and the spec and the plan are wherever Kanri's orders line says,
  by default the superpowers convention.
```

- [ ] **Step 6: The personal config is a per-field overlay**

**P19.5** `skills/tanto/README.md` — replace exactly these 4 lines

```text
- **Optional** — a personal `$CLAUDE_CONFIG_DIR/tanto.json` (or
  `~/.claude/tanto.json`). When it is absent, every key falls back to the
  built-in defaults in `templates/tanto.json`; a partial file is complete,
  because the overlay is key by key.
```

**P19.5 →**

```text
- **Optional** — a personal `$CLAUDE_CONFIG_DIR/tanto.json` (or
  `~/.claude/tanto.json`). When it is absent, every key falls back to the
  built-in defaults in `templates/tanto.json`; a partial file is complete,
  because the overlay is field by field, and a key written as a bare model
  name takes its effort from the defaults.
```

- [ ] **Step 7: Who Kanri asks for, and which seats the human opens**

**P19.6** `skills/tanto/README.md` — replace exactly these 8 lines

````text
Every other role is created when Kanri asks the human for it, and starts with
Kanri's name as its request prints it:

```console
/tanto sekkei <kanri>
/tanto jisso <kanri>
/tanto kaiseki <kanri>
```
````

**P19.6 →**

````text
Every lifecycle role after Kanri is created when Kanri asks the human for it,
and starts with Kanri's name as its request prints it:

```console
/tanto sekkei <kanri>
/tanto keikaku <kanri>
/tanto jisso <kanri>
/tanto kaiseki <kanri>
```

Kikaku and Hosa are the human's own seats — `/tanto kikaku` and
`/tanto hosa`, opened whenever the human wants one. With no name after the
command, the session finds Kanri in the roster.
````

- [ ] **Step 8: The resume word**

**P19.7** `skills/tanto/README.md` — replace exactly these 3 lines

```text
context and its transcript but gets a new name. `/tanto resume`, typed in that
window, matches it to its roster row by that transcript path and rejoins it to
the run; no address is pasted, and Kanri's window goes first.
```

**P19.7 →**

```text
context and its transcript but gets a new name. `/tanto fukki` (復帰), typed in
that window, matches it to its roster row by that transcript path and rejoins
it to the run; no address is pasted, and Kanri's window goes first.
```

- [ ] **Step 9: The layout**

**P19.8** `skills/tanto/README.md` — replace exactly these 11 lines

```text
- `SKILL.md` — the shared contract every role reads.
- `roles/kanri.md`, `roles/sekkei.md`, `roles/jisso.md`, `roles/kaiseki.md` —
  one procedure per role. A session reads exactly one.
- `templates/` — copy-and-fill skeletons: `roster.md`, `roster-archive.md`,
  `kanri.md` (the conductor ledger), `kanri-handover.md`, `bug-report.md`,
  `batch-prompt.md`, `batch-report.md`, `kaiseki-brief.md`,
  `kaiseki-report.md`, `review-brief.md`, and `tanto.json` (the built-in
  expected-model defaults).
- `scripts/passage-check.js` — the instrument a plan that carries passages
  checks itself with, and `scripts/passage-check.test.js` beside it. Node, no
  dependencies, invoked as `node <path>`.
```

**P19.8 →**

```text
- `SKILL.md` — the shared contract every role reads.
- `roles/kanri.md`, `roles/sekkei.md`, `roles/keikaku.md`, `roles/jisso.md`,
  `roles/kaiseki.md`, `roles/kikaku.md`, `roles/hosa.md` — one procedure per
  role. A session reads exactly one.
- `templates/` — copy-and-fill skeletons: `roster.md`, `roster-archive.md`,
  `kanri.md` (the conductor ledger), `kanri-handover.md`, `bug-report.md`,
  `batch-prompt.md`, `batch-report.md`, `kaiseki-brief.md`,
  `kaiseki-report.md`, `review-brief.md`, `tanto.json` (the built-in model
  and effort defaults), `kikaku-decision.md`, and `agent.md`, the subagent
  definition every role generates from.
- `scripts/passage-check.js` — the instrument a plan that carries passages
  checks itself with: `lint`, `replay`, `diff`, `verify`, `sections`,
  `frame`, and `boundary`, with `scripts/passage-check.test.js` beside it.
  Node, no dependencies, invoked as `node <path>`.
```

- [ ] **Step 10: The relationship and the designs**

**P19.9** `skills/tanto/README.md` — replace exactly these 14 lines

```text
`kisou` installs the `docs/` document-management system and `shoroku` fills it;
`tanto` decides **when** it is filled and **who** fills it — Kanri at T0 and
T1, Jisso at T2 with Kanri answering `Direction?` through a file, and every
session at its own exit. superpowers supplies the spec, plan, implementation,
and debugging machinery; `tanto` supplies the sessions, the boundaries between
them, and the model discipline. None of those skills is edited: every override
`tanto` makes is written into its own role files.

The designs this skill implements are
`docs/superpowers/specs/2026-09-06-tanto-design.md`,
`docs/superpowers/specs/2026-09-07-kanri-lifecycle-design.md`,
`docs/superpowers/specs/2026-09-07-boundary-rules-design.md`,
`docs/superpowers/specs/2026-09-08-review-brief-design.md`, and
`docs/superpowers/specs/2026-09-09-context-cost-design.md`.
```

**P19.9 →**

```text
`kisou` installs the `docs/` document-management system and `shoroku` fills it;
`tanto` decides **when** it is filled and how each filling is checked: at
every stage the session holding the candidates writes them, `shoroku`
recommends in a subagent, the human answers by exception, and `shoroku`
applies and commits the accepted subset. superpowers supplies the spec, plan,
implementation, and debugging machinery; `tanto` supplies the sessions, the
boundaries between them, and the model discipline. superpowers is used as it
is, and `shoroku`'s two halves are its own feature, which `tanto` calls;
every override `tanto` makes is written into its own role files.

The designs this skill implements are
`docs/superpowers/specs/2026-09-06-tanto-design.md`,
`docs/superpowers/specs/2026-09-07-kanri-lifecycle-design.md`,
`docs/superpowers/specs/2026-09-07-boundary-rules-design.md`,
`docs/superpowers/specs/2026-09-08-review-brief-design.md`,
`docs/superpowers/specs/2026-09-09-context-cost-design.md`,
`docs/superpowers/specs/2026-09-11-tanto-workspace-design.md`, and
`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`.
```

- [ ] **Step 11: Lint**

```bash
./scripts/lint.sh skills/tanto/README.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 12: Commit**

```bash
git commit --only skills/tanto/README.md -m "docs(tanto): README for seven roles, the two seats, and the new flow" -m "Spec 11.8. The roles bullet names Keikaku, a new bullet names the Kikaku and Hosa seats the human opens, the brief is the author's dispatch, the resume word is fukki, the layout lists seven role files, thirteen templates and seven subcommands, and the relationship paragraph states the recommend-check-apply flow with shoroku's two halves as that skill's own feature." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 13: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 14: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 19
```

Expected: `task 19: verify clean`.

**Done when:** all nine passages are present in `skills/tanto/README.md`,
`grep -cF 'Adds two seats outside that lifecycle' skills/tanto/README.md`
prints `1`, `./scripts/lint.sh skills/tanto/README.md` is clean, and the one
commit carries its `Co-Authored-By:` trailer.

---

### Task 20: `shoroku` gains its recommend and apply halves

**Batch:** F. **Blocks:** A20.1, P20.1, P20.2, P20.3, P20.4, A20.2, P20.5.

Spec 5.4 is the whole of this task. `skills/shoroku/SKILL.md` gains one
subsection under Step 3 describing the two halves the flow of spec 5.1 runs
— recommend, which writes the proposal to a path instead of waiting at
`Direction?`, and apply, which reads that proposal with a direction file and
makes the one commit — and two of its Prohibited actions and the Soft nudge's
last sentence gain the scope that keeps the halves from being forbidden by
the file that defines them. The README's "What it does" gains one bullet
naming them.

This is the one task of the plan that edits a skill `tanto` composes, and it
is in scope by the human's ruling at the spec review: req-04f5's wording
changes at T1 to say that `tanto` composes without modifying *for tanto's
sake*, and the two halves are `shoroku`'s own feature, useful to any caller
that answers through files — req-3c4d gains the matching bullet at T1. Do not
stop on it as a scope question. Each re-scoped prohibition stays the same
rule with a scope on it: a reader who knows the old line must still see it
there.

**Files:**

- Modify: `skills/shoroku/SKILL.md` — four passages: the new subsection
  inserted at the end of Step 3, the Soft nudge's closing sentence, and the
  two Prohibited actions.
- Modify: `skills/shoroku/README.md` — one passage: a fourth bullet under
  "What it does".

**Interfaces:**

- Consumes, from task 11: nothing textual. `roles/kanri.md`'s Shoroku
  section, written in batch C, already dispatches the `shoroku` kind in
  recommend mode and in apply mode; this task is where the two halves it
  names come to exist. The role text lands first and the feature it calls
  lands in batch F: that is the plan's own ordering, stated here so that the
  implementer does not read it as a missing dependency.
- Produces, for task 11: the two halves — the recommend mode's inputs and
  output shape, and the apply mode's three arguments — as `roles/kanri.md`
  names them.
- markdownlint runs on both `skills/shoroku/SKILL.md` and
  `skills/shoroku/README.md`.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/shoroku/SKILL.md skills/shoroku/README.md
```

Expected: `i/lf w/crlf attr/text=auto` on both, and never `w/mixed`.

- [ ] **Step 2: The two halves, at the end of Step 3**

**A20.1** `skills/shoroku/SKILL.md` — `grep -cF 'the two halves for a caller that answers' skills/shoroku/SKILL.md` — before: 0, after: 1

**P20.1** `skills/shoroku/SKILL.md` — insert after these 2 lines

```text
Everything else — classification, proposal, partial-accept, single commit — is
identical to session mode.
```

**P20.1 →**

```text

### Recommend and apply — the two halves for a caller that answers `Direction?` through files

A caller that cannot answer in the chat — an orchestrator running this skill
in a subagent, say — gets the same workflow in two halves, split where
session mode waits at `Direction?`. A session-mode run is unchanged by this
section.

**Recommend mode.** Invoked with a source — a file, or a file and the names
of the sections to read — and an output path. Run the workflow up to the
proposal and write the proposal to that path instead of printing it: the
numbered items in three groups, **recommended adopt** / **recommended
reject** / **unsure**, each item quoted in full from its source so that the
file stands alone as the apply's input, and each carrying its destination, a
one-line reason, the `req-<id>` pairing for a `design` entry, and — for a
requirement or ADR item — the original wording followed by a reference
translation in the chat's language. Do not wait for `Direction?`, and write
nothing under `docs/`.

**Apply mode.** Invoked with a recommendation path, a direction path, and a
commit subject. The recommendation quotes every item in full, so no third
file is read: where the candidates were sections of the source document, the
recommendation is the only proposal there is. Apply the accepted subset per
the per-type `AGENTS.md`, lint the changed paths by name, make **one** commit
by explicit path with the subject you were given, and report the paths and
the subject. Write nothing the direction did not accept, and never run
without a direction file.

The direction file carries the directions this skill already parses — `OK`,
`2 と 5 だけ`, `3 はやめて`, an edit — one line per item, or one `OK` for the
whole list.
```

- [ ] **Step 3: The Soft nudge's scope**

**P20.2** `skills/shoroku/SKILL.md` — replace exactly these 2 lines

```text
shoroku run — **once per session at most**. If the user declines, stay quiet
for the rest of the session. Never start a run without explicit confirmation.
```

**P20.2 →**

```text
shoroku run — **once per session at most**. If the user declines, stay quiet
for the rest of the session. Never start a run without explicit confirmation
— in session mode; in recommend and apply mode the caller's dispatch is the
start, and the direction file is the confirmation.
```

- [ ] **Step 4: The confirmation prohibition, scoped**

**P20.3** `skills/shoroku/SKILL.md` — replace exactly this 1 line

```text
- Do NOT start a shoroku run without explicit user confirmation.
```

**P20.3 →**

```text
- Do NOT start a shoroku run without explicit user confirmation — in session
  mode; in recommend mode the caller's dispatch is the run's start and
  nothing is written under `docs/`, and in apply mode the direction file is
  the confirmation, written from the human's answers.
```

- [ ] **Step 5: The write prohibition, scoped**

**P20.4** `skills/shoroku/SKILL.md` — replace exactly these 2 lines

```text
- Do NOT write outside `docs/`. `shoroku` no longer installs or edits
  `AGENTS.md`; setting up the system is `kisou`'s job.
```

**P20.4 →**

```text
- Do NOT write outside `docs/` — except the recommendation file a caller
  names in recommend mode. `shoroku` no longer installs or edits
  `AGENTS.md`; setting up the system is `kisou`'s job.
```

- [ ] **Step 6: The README bullet**

**A20.2** `skills/shoroku/README.md` — `grep -cF 'the same workflow splits into two halves at' skills/shoroku/README.md` — before: 0, after: 1

**P20.5** `skills/shoroku/README.md` — insert after these 3 lines

```text
- On a trigger, excerpts the current **session** (default) or **memory**
  (explicit) into those docs: classify → numbered proposal → you partially
  accept → one git commit.
```

**P20.5 →**

```text
- For a caller that answers through files — an orchestrator running the skill
  in a subagent — the same workflow splits into two halves at `Direction?`:
  **recommend** writes the numbered proposal, each item marked adopt, reject,
  or unsure, to a path the caller names; **apply** reads that file with a
  direction file and makes the one commit.
```

- [ ] **Step 7: The frontmatter still parses**

```bash
uv run --no-project --with pyyaml python -c "import yaml;t=open('skills/shoroku/SKILL.md',encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')"
```

Expected: `['description', 'name']`, then `ok`. A colon followed by a space
anywhere in the `description` value breaks frontmatter parsing silently,
which is what `BAD` reports. When `--with pyyaml` cannot fetch PyYAML, fall
back to `sed -n 's/^description: //p' skills/shoroku/SKILL.md | grep -c ': '`,
expect `0`, and record the fallback. Use `uv run --no-project`, never a bare
`python`. This is the consistency note's check 8, read on this file.

- [ ] **Step 8: Lint**

```bash
./scripts/lint.sh skills/shoroku/SKILL.md skills/shoroku/README.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 9: Commit**

```bash
git commit --only skills/shoroku/SKILL.md skills/shoroku/README.md -m "docs(shoroku): add the recommend and apply halves" -m "Spec 5.4. Step 3 gains the subsection for a caller that answers Direction? through files: recommend writes the numbered proposal to a path it is given, apply reads it with a direction file and makes the one commit. Two Prohibited actions and the Soft nudge gain the scope that keeps the halves from being forbidden by the file that defines them, and the README names the two halves." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 10: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 11: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 20
```

Expected: `task 20: verify clean`.

**Done when:** the subsection, the scoped nudge and the two scoped
prohibitions are in `skills/shoroku/SKILL.md` and the bullet is in
`skills/shoroku/README.md`; both anchor greps print `1`; the frontmatter
parse prints `['description', 'name']` and `ok`; lint is clean on both
paths; and the one commit carries its `Co-Authored-By:` trailer.

---

### Task 21: The consistency note's checks

**Batch:** F. **Blocks:** A21.1, P21.1, P21.2, P21.3, P21.4, P21.5, P21.6,
P21.7, P21.8, P21.9, P21.10, P21.11, P21.12.

`docs/notes/tanto-consistency-checks.md` is where every mechanical check on
the skill lives, and batches A to E move almost everything it counts. Spec
11.10 names the checks that change: check 1's layout (seven role files,
thirteen templates, the agent template), check 3's map (`kikaku-decision.md`
by Kikaku, `agent.md` by every role), check 6's routing strings, check 7's
absent strings, check 8's frontmatter and JSON parse, and a new check for the
seven subcommands of spec 8. Three more passages follow from the note's own
rules rather than from a new rule: the "Versions these checks assume" bullet
and check 2's expected list, which the note's structural-count paragraph
names as two of the four places a plan that adds a template must edit; and
the two Residency header rows of check 6, which spec 4.2 gives a Topic
column and tasks 17 and 18 land in both templates.

**Every value in these passages was run against `tanto-cost` before the plan
was written, and the values the passages state are the post-batch ones.** The
pre-plan readings, for the rows that move: check 1 lists nineteen paths and
check 2 returns seventeen `ok` lines (twenty-four and twenty-two after
batches A to E add three role files, two templates, and the text that names
them); check 3's map is eleven rows, eight of them Kanri's, and becomes
twenty rows with eight still Kanri's; check 6's ten new line forms all return
`0` today and must return `1` each once task 7 lands the contract's Messages
section; check 7's four new sweeps return 23, 10, 0 and 1 hits today and must
return none; and check 16's subcommand count is `4` today and `7` once task 3
lands the usage line. This task runs last in the batch precisely so that the
tree already carries what the checks assert — if a command returns something
other than the value its passage states, that divergence is the finding, and
it is reported to Kanri rather than settled by editing the note to match.

**Files:**

- Modify: `docs/notes/tanto-consistency-checks.md` — twelve passages: the
  Versions bullet, check 1's path list and expected count, check 2's expected
  list, check 3's map and count, four passages in check 6, two in check 7,
  check 8 whole, and a new check appended at the end.

**Interfaces:**

- Consumes, from tasks 1 to 4: the seven-subcommand usage line, the twelve
  kinds and seven roles of `templates/tanto.json` with both fields, and
  `templates/agent.md`.
- Consumes, from tasks 5 to 8: `SKILL.md`'s nine-argument `argument-hint`,
  the ten line forms check 6 counts, and the in-skill paths check 2 resolves.
- Consumes, from tasks 9 to 12: `roles/kanri.md` with `frame` in place of the
  `awk`, so check 7's task-heading sweep is empty in the runtime text.
- Consumes, from tasks 13 to 15: `roles/keikaku.md`, `roles/kikaku.md`,
  `roles/hosa.md`, `templates/kikaku-decision.md`, and the citations check 3
  maps.
- Consumes, from tasks 16 to 18: the Residency header with its Topic column
  in `templates/roster.md` and `templates/kanri-handover.md`, and the
  roster's two new Events forms.
- Produces, for task 22: checks 1, 2, 3, 6, 7 and 8 in their final form, plus
  the new check 16. Task 22 runs them by extracting these fenced blocks and
  piping them to `bash`, never by transcribing them, as the note's
  "Scheduling these checks without drift" section requires; so each block
  keeps one command per line and the expected value stays beside it.
- markdownlint lints `docs/notes/tanto-consistency-checks.md` — it is not
  under either of `.markdownlint-cli2.yaml`'s ignores.

#### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol docs/notes/tanto-consistency-checks.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: The anchor, and the file count the checks assume**

**A21.1** `docs/notes/tanto-consistency-checks.md` — `grep -cF 'Expected: all twenty-four paths listed' docs/notes/tanto-consistency-checks.md` — before: 0, after: 1

**P21.1** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```text
- **Nineteen skill files, eleven of them templates**, as check 1 lists them.
```

**P21.1 →**

```text
- **Twenty-four skill files, thirteen of them templates**, as check 1 lists
  them.
```

- [ ] **Step 3: Check 1 — the layout**

**P21.2** `docs/notes/tanto-consistency-checks.md` — replace exactly these 19 lines

````text
```bash
ls skills/tanto/SKILL.md skills/tanto/README.md \
  skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md \
  skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md \
  skills/tanto/templates/roster.md skills/tanto/templates/kanri.md \
  skills/tanto/templates/roster-archive.md \
  skills/tanto/templates/kanri-handover.md \
  skills/tanto/templates/bug-report.md \
  skills/tanto/templates/batch-prompt.md \
  skills/tanto/templates/batch-report.md \
  skills/tanto/templates/kaiseki-brief.md \
  skills/tanto/templates/kaiseki-report.md \
  skills/tanto/templates/review-brief.md \
  skills/tanto/templates/tanto.json \
  skills/tanto/scripts/passage-check.js \
  skills/tanto/scripts/passage-check.test.js 2>&1
```

Expected: all nineteen paths listed, no `No such file or directory`.
````

**P21.2 →**

````text
```bash
ls skills/tanto/SKILL.md skills/tanto/README.md \
  skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md \
  skills/tanto/roles/keikaku.md skills/tanto/roles/jisso.md \
  skills/tanto/roles/kaiseki.md skills/tanto/roles/kikaku.md \
  skills/tanto/roles/hosa.md \
  skills/tanto/templates/roster.md skills/tanto/templates/kanri.md \
  skills/tanto/templates/roster-archive.md \
  skills/tanto/templates/kanri-handover.md \
  skills/tanto/templates/bug-report.md \
  skills/tanto/templates/batch-prompt.md \
  skills/tanto/templates/batch-report.md \
  skills/tanto/templates/kaiseki-brief.md \
  skills/tanto/templates/kaiseki-report.md \
  skills/tanto/templates/review-brief.md \
  skills/tanto/templates/kikaku-decision.md \
  skills/tanto/templates/agent.md \
  skills/tanto/templates/tanto.json \
  skills/tanto/scripts/passage-check.js \
  skills/tanto/scripts/passage-check.test.js 2>&1
```

Expected: all twenty-four paths listed, no `No such file or directory`.
Seven role files, thirteen templates, two scripts, the contract and the
skill's own `README.md`.
````

- [ ] **Step 4: Check 2 — the paths the contract and the role files name**

**P21.3** `docs/notes/tanto-consistency-checks.md` — replace exactly these 11 lines

```text
Expected: seventeen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`,
`roles/kanri.md`, `roles/sekkei.md`, `scripts/passage-check.js`,
`scripts/passage-check.test.js`, `templates/batch-prompt.md`,
`templates/batch-report.md`, `templates/bug-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/kanri-handover.md`, `templates/kanri.md`,
`templates/review-brief.md`, `templates/roster-archive.md`,
`templates/roster.md`, and `templates/tanto.json`, whose relative order for the
two roster paths is the locale's and is not part of this check —
and **no** `MISSING` line. A `MISSING` line is either a typo in the reference
or a file the plan forgot.
```

**P21.3 →**

```text
Expected: twenty-two `ok` lines — `roles/hosa.md`, `roles/jisso.md`,
`roles/kaiseki.md`, `roles/kanri.md`, `roles/keikaku.md`,
`roles/kikaku.md`, `roles/sekkei.md`, `scripts/passage-check.js`,
`scripts/passage-check.test.js`, `templates/agent.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/bug-report.md`, `templates/kaiseki-brief.md`,
`templates/kaiseki-report.md`, `templates/kanri-handover.md`,
`templates/kanri.md`, `templates/kikaku-decision.md`,
`templates/review-brief.md`, `templates/roster-archive.md`,
`templates/roster.md`, and `templates/tanto.json`, whose relative order for the
two roster paths is the locale's and is not part of this check —
and **no** `MISSING` line. A `MISSING` line is either a typo in the reference
or a file the plan forgot.
```

- [ ] **Step 5: Check 3 — the template map**

**P21.4** `docs/notes/tanto-consistency-checks.md` — replace exactly these 20 lines

````text
```bash
while read -r tpl reader; do
  if grep -qF "$tpl" "$reader"; then echo "ok       $tpl <- $reader"; else echo "UNCITED  $tpl <- $reader"; fi
done <<'MAP'
templates/roster.md skills/tanto/roles/kanri.md
templates/roster-archive.md skills/tanto/roles/kanri.md
templates/kanri.md skills/tanto/roles/kanri.md
templates/kanri-handover.md skills/tanto/roles/kanri.md
templates/bug-report.md skills/tanto/roles/kanri.md
templates/batch-prompt.md skills/tanto/roles/kanri.md
templates/kaiseki-brief.md skills/tanto/roles/kanri.md
templates/review-brief.md skills/tanto/roles/kanri.md
templates/batch-report.md skills/tanto/roles/jisso.md
templates/kaiseki-report.md skills/tanto/roles/kaiseki.md
templates/tanto.json skills/tanto/SKILL.md
MAP
```

Expected: eleven `ok` lines, no `UNCITED`. Eight of the eleven are Kanri's,
because Kanri copies eight of the templates itself.
````

**P21.4 →**

````text
```bash
while read -r tpl reader; do
  if grep -qF "$tpl" "$reader"; then echo "ok       $tpl <- $reader"; else echo "UNCITED  $tpl <- $reader"; fi
done <<'MAP'
templates/roster.md skills/tanto/roles/kanri.md
templates/roster-archive.md skills/tanto/roles/kanri.md
templates/kanri.md skills/tanto/roles/kanri.md
templates/kanri-handover.md skills/tanto/roles/kanri.md
templates/bug-report.md skills/tanto/roles/kanri.md
templates/batch-prompt.md skills/tanto/roles/kanri.md
templates/kaiseki-brief.md skills/tanto/roles/kanri.md
templates/review-brief.md skills/tanto/roles/sekkei.md
templates/review-brief.md skills/tanto/roles/keikaku.md
templates/batch-report.md skills/tanto/roles/jisso.md
templates/kaiseki-report.md skills/tanto/roles/kaiseki.md
templates/kikaku-decision.md skills/tanto/roles/kikaku.md
templates/tanto.json skills/tanto/SKILL.md
templates/agent.md skills/tanto/roles/kanri.md
templates/agent.md skills/tanto/roles/sekkei.md
templates/agent.md skills/tanto/roles/keikaku.md
templates/agent.md skills/tanto/roles/jisso.md
templates/agent.md skills/tanto/roles/kaiseki.md
templates/agent.md skills/tanto/roles/kikaku.md
templates/agent.md skills/tanto/roles/hosa.md
MAP
```

Expected: twenty `ok` lines, no `UNCITED`. Eight of the twenty are Kanri's —
seven templates Kanri copies itself, plus the agent definition, which every
role renders at its start and which therefore takes one row per role. The
review brief has two readers because the document's author dispatches it:
Sekkei for the spec, Keikaku for the plan.
````

- [ ] **Step 6: Check 6 — the rows the exit flow and the roster move**

**P21.5** `docs/notes/tanto-consistency-checks.md` — replace exactly these 9 lines

```text
grep -cF 'except the accepted subset of its own exit shoroku, at its exit' skills/tanto/SKILL.md
grep -cF 'no commit but its exit shoroku' skills/tanto/SKILL.md
grep -cF 'nothing to commit' skills/tanto/roles/sekkei.md
grep -cF 'nothing to commit' skills/tanto/roles/kanri.md
grep -cF 'nothing to commit' skills/tanto/SKILL.md
grep -cF 'human-needed:' skills/tanto/SKILL.md
grep -cF 'the human by grant' skills/tanto/SKILL.md
grep -cF '| Role | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |' skills/tanto/templates/roster.md
grep -cF '| Role | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |' skills/tanto/templates/kanri-handover.md
```

**P21.5 →**

```text
grep -cF 'nothing to commit' skills/tanto/roles/sekkei.md
grep -cF 'nothing to commit' skills/tanto/roles/kanri.md
grep -cF 'nothing to commit' skills/tanto/SKILL.md
grep -cF 'human-needed:' skills/tanto/SKILL.md
grep -cF 'the human by grant' skills/tanto/SKILL.md
grep -cF '| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |' skills/tanto/templates/roster.md
grep -cF '| Role | Topic | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |' skills/tanto/templates/kanri-handover.md
```

- [ ] **Step 7: Check 6 — the roster's two new Events forms**

**P21.6** `docs/notes/tanto-consistency-checks.md` — insert after this 1 line

```text
grep -cF 'confirmed: <path>' skills/tanto/roles/kanri.md
```

**P21.6 →**

```text
grep -cF 'cleared: <old name> → <new name>' skills/tanto/templates/roster.md
grep -cF 'decision: <path> received from <name>' skills/tanto/templates/roster.md
```

- [ ] **Step 8: Check 6 — the expected values, and the new line forms**

**P21.7** `docs/notes/tanto-consistency-checks.md` — replace exactly these 14 lines

```text
Expected, one number per line, in order: `2`, `1`, `1`, `3`, `1`, `1`, `1`,
`1`, `5`, `3`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `3`, `1`,
`1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`. The fourth is `3` because
`SKILL.md` spells `kanri-address:` three times: the handshake section's
handover form, the Resuming section's resumed form, and the `<kanri-address>`
blank's own paragraph. The six `1`s before the last five pin the three
cross-file pairs — the Residency table header, the seven-column `S-n` header,
and the bug-report line — each copy once, so that a change to one copy shows
up as a mismatch. The last five pin the strings the reading and the compaction
rule route on: the handshake's `transcript=` blank in the contract, and
`compacted:` and `confirmed:` in the contract and in Kanri's role file. The
`--` before the
`- Kanri` pattern is required: without it `grep` reads the leading `-` as an
option.
```

**P21.7 →**

````text
Expected, one number per line, in order: `2`, `1`, `1`, `3`, `1`, `1`, `1`,
`1`, `5`, `3`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `3`, `1`, `1`, `1`,
`1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`. The fourth is `3` because
`SKILL.md` spells `kanri-address:` three times: the handshake section's
handover form, the Resuming section's resumed form, and the `<kanri-address>`
blank's own paragraph. The six `1`s at positions 20 to 25 pin the three
cross-file pairs — the Residency table header, the seven-column `S-n` header,
and the bug-report line — each copy once, so that a change to one copy shows
up as a mismatch. The Residency header carries the Topic column because the
roster does, and the two copies of it gain the column together or the pair
goes loud. The five after them pin the strings the reading and the compaction
rule route on: the handshake's `transcript=` blank in the contract, and
`compacted:` and `confirmed:` in the contract and in Kanri's role file. The
last two pin the roster's two new Events forms. The
`--` before the
`- Kanri` pattern is required: without it `grep` reads the leading `-` as an
option.

The line forms the new seats and the limit rule route on, each exactly once
in the contract:

```bash
for s in 'decision: <path>' 'chore: <one line>' 'chore: <what> — <paths> — slot: now | at the next boundary' 'slot-needed: <what> — <paths>' 'slot: now — commit and report' 'slot: at the next boundary' 'paused: <dispatch> on <family> — resets <time>' 'continue: <dispatch> — same model' 'exit proposal: <path> — <reading>' 'spec accepted: <spec path> — <reading>'; do
  printf '%s -> %s\n' "$s" "$(grep -cF "$s" skills/tanto/SKILL.md)"
done
```

Expected: ten lines, each ending `-> 1`. Two of the ten are `chore:` forms
and two are `slot:` forms, because each of those lines has a form the sender
writes and a form Kanri writes, and a prefix grep cannot tell one from the
other — the rule at the head of this check. These are the contract's copies
only; a role file that repeats a form is pinned where that file's own rows
are.
````

- [ ] **Step 9: Check 6 — the brief's notice and the idle column**

**P21.8** `docs/notes/tanto-consistency-checks.md` — replace exactly these 17 lines

````text
The two lines of the review brief, and the idle subscription no tanto line
carries any more, each on one line where it occurs, counted raw over every
Markdown file of the skill so that a stray copy fails the check:

```bash
for f in skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/*.md skills/tanto/templates/*.md; do
  printf '%s review-ready %s brief %s idle %s\n' "$f" "$(grep -cF 'review-ready: <' "$f")" "$(grep -cF 'brief: <path>' "$f")" "$(grep -cF 'notify_when_idle: true' "$f")"
done
```

Expected: `skills/tanto/SKILL.md review-ready 1 brief 1 idle 0`,
`skills/tanto/roles/kanri.md review-ready 1 brief 1 idle 0`,
`skills/tanto/roles/sekkei.md review-ready 2 brief 2 idle 0`, and every other
line ending `review-ready 0 brief 0 idle 0`. Every `idle` figure reads `0`
since 2026-09-10: no tanto line carries a subscription, the `exit:` lines
included (issue-d725). Any nonzero figure is a subscription reintroduced,
which is what this column now checks for.
````

**P21.8 →**

````text
The review brief's notice, and the idle subscription no tanto line carries
any more, each on one line where it occurs, counted raw over every Markdown
file of the skill so that a stray copy fails the check:

```bash
for f in skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/*.md skills/tanto/templates/*.md; do
  printf '%s notice %s idle %s\n' "$f" "$(grep -cF 'review-ready: <document path>; brief: <brief path>' "$f")" "$(grep -cF 'notify_when_idle: true' "$f")"
done
```

Expected: `skills/tanto/SKILL.md notice 1 idle 0`,
`skills/tanto/roles/kanri.md notice 1 idle 0`,
`skills/tanto/roles/keikaku.md notice 1 idle 0`,
`skills/tanto/roles/sekkei.md notice 1 idle 0`, and every other line ending
`notice 0 idle 0`. The notice carries the document and the brief on one
line and waits for nothing, so its copies are the author that sends it and
the Kanri that receives it; the set of files carrying it is a structural
count in the sense of "Versions these checks assume", not an invariant, and
the batch that changes the set names the figures it restores. One column
counts the whole notice rather than two counting its halves, because a head
grep matches the literal and the placeholder alike. Every `idle` figure
reads `0` since 2026-09-10: no tanto line carries a subscription, the
`exit:` lines included (issue-d725). Any nonzero figure is a subscription
reintroduced, which is what this column now checks for.
````

- [ ] **Step 10: Check 7 — the four sweeps this plan adds**

**P21.9** `docs/notes/tanto-consistency-checks.md` — replace exactly these 2 lines

```text
grep -rn 'skills/tanto/' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rnE '\b[0-9a-f]{7,40}\b' skills/tanto/
```

**P21.9 →**

```text
grep -rn 'skills/tanto/' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rnE 'subagents\.(implementer|reviewer|drafter|escalation)\b' skills/tanto
grep -rnE 'exit write.out' skills/tanto
grep -rn -iE 'sho[m]u|jos[h]u' skills/tanto skills/shoroku docs/notes
grep -rnE '#{3} Task' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
grep -rnE '\b[0-9a-f]{7,40}\b' skills/tanto/
```

- [ ] **Step 11: Check 7 — what those sweeps mean, and the invocation line**

**P21.10** `docs/notes/tanto-consistency-checks.md` — replace exactly these 10 lines

```text
Expected: no output from the first nine (each exits 1). The sixth and
seventh flatten the file first and strip `**`, because their pre-images
— `You **do not commit**` with its bold markers, and
``never write under `docs/` yourself`` across a line break — would never
have matched a raw line. The tenth is read, not counted: no line may be
an actual commit hash. Tracked content carries commit subjects, never
hashes, and `<sha7>` inside a template blank is a placeholder, not a
hash. `<plan>` is checked because `<plan-basename>` is the only correct
form; runtime text is skill-relative, so only the skill's `README.md`
and this note may name `skills/tanto/`. This is a deliberate asymmetry, not an oversight: the skill's `README.md` may name `skills/tanto/` because it documents this repository's layout, which is precisely what runtime text must not depend on.
```

**P21.10 →**

````text
Expected: no output from the first thirteen (each exits 1). The sixth and
seventh flatten the file first and strip `**`, because their pre-images
— `You **do not commit**` with its bold markers, and
``never write under `docs/` yourself`` across a line break — would never
have matched a raw line. The tenth through the thirteenth are the strings
retired when the seats and the kinds were recut, and all four are written as
regular expressions rather than as the literals they forbid, for two reasons
that hold permanently: the rejected-seat sweep runs over `docs/notes/` and so
over this file, and a standing check written into the file it checks must not
count its own text; and a plan that removes a string refuses that string in
its own new passages, so a literal here would fail the plan that installs the
check rather than the tree it checks. The tenth pins the four subagent keys
that are gone — `default` survives as one of the twelve kinds and is not
swept. The eleventh pins the retired wording for a session committing its own
exit shoroku. The twelfth pins the two rejected seat names, over the skill,
`shoroku`, and this directory, which is the scope the choice was recorded
against; the spec and the dialogue under `docs/superpowers/` keep them as the
record and are deliberately outside it. The thirteenth pins a frame command
keyed on a depth-three task heading: `frame` matches a task heading at any
depth (issue-ac9d), so no runtime text carries that pattern any more, and the
row names the contract, `roles/` and `templates/` rather than `skills/tanto`
because the script's own code and its test fixtures carry that heading by
design. The fourteenth is read, not counted: no line may be
an actual commit hash. Tracked content carries commit subjects, never
hashes, and `<sha7>` inside a template blank is a placeholder, not a
hash. `<plan>` is checked because `<plan-basename>` is the only correct
form; runtime text is skill-relative, so only the skill's `README.md`
and this note may name `skills/tanto/`. This is a deliberate asymmetry, not an oversight: the skill's `README.md` may name `skills/tanto/` because it documents this repository's layout, which is precisely what runtime text must not depend on.

The invocation line is read rather than counted, for the second reason above:
the value it must no longer carry cannot be written here.

```bash
grep -n 'argument-hint' skills/tanto/SKILL.md
```

Expected: one line, whose value reads
`kanri | sekkei | keikaku | jisso | kaiseki | kikaku | hosa | fukki | resume`
— nine arguments, every one the contract accepts, the alias included
(issue-260c). The line is unique in the file, so reading it settles both
halves at once: the nine-argument value is there, and the four-role value it
replaced is not.
````

- [ ] **Step 12: Check 8 — the frontmatters and the JSON parse**

**P21.11** `docs/notes/tanto-consistency-checks.md` — replace exactly these 13 lines

````text
```bash
uv run --no-project --with pyyaml python -c "import yaml;t=open('skills/tanto/SKILL.md',encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')"
uv run --no-project python -c "import json;json.load(open('skills/tanto/templates/tanto.json'));print('json ok')"
```

Expected: `['argument-hint', 'description', 'name']`, then `ok`, then
`json ok`. A colon followed by a space anywhere in the `description` value
breaks frontmatter parsing silently, which is what the second line prints
`BAD` for. When `--with pyyaml` cannot fetch PyYAML, fall back to
`sed -n 's/^description: //p' skills/tanto/SKILL.md | grep -c ': '`, expect
`0`, and record the fallback.

Use `uv run --no-project`, never a bare `python`.
````

**P21.11 →**

````text
```bash
uv run --no-project --with pyyaml python -c "import yaml;t=open('skills/tanto/SKILL.md',encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')"
node -e 'const t=require("./skills/tanto/templates/tanto.json");const r=Object.keys(t.sessions),k=Object.keys(t.subagents);if(r.length!==7||k.length!==12)process.exit(1);for(const m of [t.sessions,t.subagents])for(const v of Object.values(m))if(!v.model||!v.effort)process.exit(1);console.log("tanto.json ok",r.length,k.length)'
uv run --no-project --with pyyaml python -c "import yaml,sys;t=open(sys.argv[1],encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')" skills/tanto/templates/agent.md
uv run --no-project --with pyyaml python -c "import yaml,sys;t=open(sys.argv[1],encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d),d['effort'])" "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/agents/tanto-task-implement.md"
```

Expected: `['argument-hint', 'description', 'name']`, then `ok`; then
`tanto.json ok 7 12`; then `['description', 'effort', 'name']` and `ok`;
then `['description', 'effort', 'name'] high`. A colon followed by a space
anywhere in a `description` value
breaks frontmatter parsing silently, which is what the `BAD` branch prints
for, and it is run against the agent template as well as the contract
because the rendered definition is a frontmatter file the harness parses.
The second line is a parse and two assertions in one: the twelve kinds, the
seven roles, and `model` and `effort` on every entry of both maps, which is
what makes a half-widened config fail here rather than at a dispatch. The
fourth line reads a **rendered** definition, which exists only where a role
has already generated one; where the directory is empty, record
`definitions not generated on this host` and let the dogfood settle it.
When `--with pyyaml` cannot fetch PyYAML, fall back to
`sed -n 's/^description: //p' skills/tanto/SKILL.md | grep -c ': '`, expect
`0`, and record the fallback.

Use `uv run --no-project`, never a bare `python`.
````

- [ ] **Step 13: The new check for the usage line**

**P21.12** `docs/notes/tanto-consistency-checks.md` — insert after this 1 line

```text
Assigning a write-out by section name — "the `Bug intake` section of the design entry" — fails when the destination's headings differ from the source's, which they routinely do: a design entry and `SKILL.md` describe the same mechanism under different words. Quote the heading text, or give a line number, so the assignment names a place that exists in the file it is addressed to.
```

**P21.12 →**

````text

## 16. The usage line names every subcommand

```bash
node skills/tanto/scripts/passage-check.js 2>&1 | head -n 1
node skills/tanto/scripts/passage-check.js 2>&1 | head -n 1 | grep -oE 'lint|replay|diff|verify|sections|frame|boundary' | sort -u | wc -l
```

Expected: the script's usage line, then `7`. The first line is read, not
matched: the wording belongs to the script, and a plan that rewords it is not
wrong for doing so. The second is the check. A subcommand the script
implements and the usage line omits is invisible to every reader who has only
the usage line, and a role that never learns of it keeps doing the work by
hand — which is the whole reason the three new ones were added. `sort -u`
before the count so a name the line spells twice is counted once.

This check is numbered after the lessons above rather than beside checks 1 to
9 because the numbers here are cited by plans; renumbering a check would make
every earlier citation point at something else. A plan that schedules the
mechanical set schedules checks 1 to 9 and this one.
````

- [ ] **Step 14: Lint**

```bash
./scripts/lint.sh docs/notes/tanto-consistency-checks.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 15: Commit**

```bash
git commit --only docs/notes/tanto-consistency-checks.md -m "docs(notes): tanto consistency checks for the new role and kind set" -m "Check 1 lists seven role files and thirteen templates, check 2 the paths they name, check 3 the agent template every role renders and Kikaku's decision template. Check 6 drops the rows for the retired exit flow, carries the Residency header's Topic column, and gains the roster's two Events forms and the ten line forms the new seats and the limit rule route on. Check 7 gains four sweeps, written as regular expressions so that a standing check does not count its own text. Check 8 asserts the twelve kinds and the seven roles with both fields and loads the agent template's frontmatter. A new check 16 pins the seven subcommands in the usage line." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 16: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 17: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-cost.md --task 21
```

Expected: `task 21: verify clean`.

**Done when:** the twelve passages are present in
`docs/notes/tanto-consistency-checks.md`, the anchor's `grep -cF` on that file
prints `1`, every check the task edits returns the value its own text states
when run from the repository root, `./scripts/lint.sh` is clean on that path,
and the commit carries its `Co-Authored-By:` trailer.

---

### Task 22: The old values, swept, and the consistency note's checks 1 to 9 and 16

**Batch:** F. **Blocks:** O22.1 to O22.65, less one id the sweep does not use (see entity 5).

Every other task of this plan lands text. This one proves that the text it
replaced is gone. The spec's "Old values this plan contradicts" names
**34 entities**; an entity is a thing the plan changes, and several are spelled
more than one way across the skill, so the 34 entities are carried here as
**64 needles**, each measured on 2026-09-13 against the tree as it stood before
task 1, each written from the entity rather than from the new text, and each
spanning the point where the text changes. Two of the 64 — the rejected seat
names — stood at zero before the plan and must still stand at zero after it;
the other 62 stood above zero and must reach zero.

The needles are not the whole check. Three of the spec's entities survive the
plan **by design** — a word the new text keeps, in a place the new text names —
and a needle whose disposition is "gone" would be permanently red for them, so
they are counted against an allowlist in Step 2 rather than written as `O`
blocks. `passage-check.js lint` refuses a needle that occurs in the plan's own
new-passage text, and it is right to: for a needle whose disposition is "gone",
finding it in the new text means the plan reintroduces what it claims to
remove.

**This task modifies nothing.** Its deliverable is recorded output, and "it
changed a tracked file" is its failure condition. Its reviewer **re-runs** the
commands rather than reading the report, per the consistency note's check 14.

**Files:**

- Modify: none.
- Write (untracked, not committed): `.tanto/tanto-cost/o-needles.txt`, the
  needle list Step 1 reads. It is scratch, it lives under `.tanto/`, and it is
  never staged.

**Interfaces:**

- Consumes, from tasks 1 to 21: every passage of the plan, and from task 21
  the note's checks with the expected values it measured — check 16 included,
  which task 21 appends. This task is the last of batch F and runs after task
  21 has committed.
- Produces, for the batch report: the recorded output of Steps 1 to 3, which
  Kanri reads at the boundary as the plan's own closing evidence.
- markdownlint sees nothing here; the task changes no file.

#### The needles

One per spelling, grouped by the spec's entity. The count after each needle is
what it measured on 2026-09-13 over the sweep set — every tracked file under
`skills/tanto/` and `skills/shoroku/`, plus
`docs/notes/tanto-consistency-checks.md`. `docs/superpowers/**` is **not** in
the sweep set: the spec and this plan quote these strings by design, and a
sweep that read them would never reach zero.

**Entity 1 — four roles.**

**O22.1** `never the other three` — SKILL.md 1 → 0 at task 5.

**O22.2** `The other three are not yours` — SKILL.md 1 → 0 at task 5.

**O22.3** `list those five ids` — SKILL.md 1 → 0 at task 5.

**O22.4** `argument-hint: kanri | sekkei | jisso | kaiseki` — SKILL.md 1 → 0 at task 5.

**O22.5** `Sekkei, Jisso, and Kaiseki read it` — templates/kanri.md 1 → 0 at task 17.

**O22.6** `Only Kanri messages Jisso. Sekkei and Kaiseki never do` — SKILL.md 1 → 0 at task 7.

**O22.7** `sends to Jisso, Sekkei, or Kaiseki` — SKILL.md 1 → 0 at task 7.

**Entity 2 — Sekkei owns the plan.**

**O22.8** `You own the spec, the plan, and the review of both` — roles/sekkei.md 1 → 0 at task 13.

**O22.9** `the spec and plan dialogue` — roles/kanri.md 1, roles/sekkei.md 1 → 0 at tasks 9 and 13.

**O22.10** `run by Sekkei in place of an` — SKILL.md 1 → 0 at task 8. The
sentence's tail, "agent dry run, by Jisso at every batch boundary", survives
the edit, so the needle is the half that names Sekkei.

**O22.11** `Sekkei cuts the branch from` — SKILL.md 1 → 0 at task 8.

**O22.12** `cold-read question to Sekkei` — roles/kanri.md 1 → 0 at task 12.

**O22.13** `cut from main by Sekkei` — templates/kanri.md 1 → 0 at task 17.

**O22.14** `the recommendation Sekkei states with the` — templates/review-brief.md 1 → 0 at task 18.

**Entity 3 — the five kinds.**

**O22.15** `The fixed kinds are` — SKILL.md 1 → 0 at task 6.

**O22.16** `subagents.implementer` — SKILL.md 1, roles/jisso.md 1, templates/batch-prompt.md 1, templates/kanri-handover.md 1 → 0 at tasks 6, 16, 18.

**O22.17** `subagents.reviewer` — SKILL.md 1, roles/jisso.md 4, roles/kanri.md 2, roles/sekkei.md 3, templates/batch-prompt.md 1, templates/kanri-handover.md 1 → 0 at tasks 7, 10, 12, 13, 16, 18. The heaviest needle of the plan at twelve hits, and the one whose residual will name any file a task forgot.

**O22.18** `subagents.drafter` — roles/jisso.md 1, roles/sekkei.md 2 → 0 at tasks 13 and 16.

**O22.19** `subagents.escalation` — SKILL.md 1, roles/jisso.md 3, roles/kanri.md 1, templates/batch-prompt.md 1, templates/kanri-handover.md 1 → 0 at tasks 6, 11, 16, 18.

**O22.20** `key for every review and never the top family` — roles/jisso.md 1 → 0 at task 16.

**Entity 4 — a key's value is a family name.**

**O22.21** `substring of that id. On a mismatch` — SKILL.md 1 → 0 at task 6.

**Entity 5 — Kanri dispatches the brief.**

**O22.22** `Kanri dispatches the **review brief** on` — SKILL.md 1 → 0 at task 7.

**O22.23** `the brief writer Kanri dispatches` — SKILL.md 1, templates/review-brief.md 1 → 0 at tasks 8 and 18.

**O22.24** `dispatch the review brief on` — roles/kanri.md 1 → 0 at task 12, with Human access step 5.

**O22.25** `arrives; never poll` — roles/sekkei.md 1 → 0 at task 13.

Entity 5's fifth site, `roles/jisso.md`'s review-brief row, carries no needle of
its own: the phrase "Kanri's dispatch and not yours" survives on the row above
it, where the whole-branch review stays Kanri's, and the row's own distinguishing
text is inside backticks, which a needle cannot carry. It is swept by O22.17
instead — the row's old cell names `subagents.reviewer`, which is one of that
needle's twelve hits.

**Entity 6 — the adoption rule.**

**O22.27** `the adoption rule` — SKILL.md 2, roles/kanri.md 5 → 0 at tasks 8, 10, 11, 12.

**O22.28** `section. Adopt or reject each` — roles/kanri.md 1 → 0 at task 11.

**Entity 7 — the session writes its own exit.**

**O22.29** `exit write-out` — SKILL.md 2, roles/jisso.md 2, roles/kaiseki.md 2, roles/kanri.md 2, roles/sekkei.md 2 → 0 at tasks 8, 11, 13, 16.

**O22.30** `the cost is one boundary` — SKILL.md 1 → 0 at task 8.

**Entity 8 — Kanri writes T0 and T1, Jisso writes T2.**

**O22.31** `Jisso is the writer there` — roles/kanri.md 1 → 0 at task 11.

**O22.32** `T1, Jisso at T2 with Kanri answering` — README.md 1 → 0 at task 19.

**Entity 9 — the frame is an `awk` keyed on a fixed heading depth.**

**O22.33** `if ($0 ~ /^### Task/) t = 1; else if ($0 ~ /^## /) t = 0` — roles/kanri.md 1 → 0 at task 10. This is the `awk`'s own line, and it is the needle rather than the bare heading pattern because `### Task` occurs sixteen times across the skill, most of them in the instrument's own fixtures, which the plan does not touch.

**Entity 10 — reports are read whole.**

**O22.34** `Read the report. For each item under` — roles/kanri.md 1 → 0 at task 10.

**Entity 11 — the boundary is hand-built.**

**O22.35** `Verify the tree before reading the report.` — roles/kanri.md 1 → 0 at task 10.

**Entity 14 — two standing grants.**

**O22.36** `Two standing grants` — roles/kanri.md 1 → 0 at task 12. `SKILL.md`'s own copy of this sentence is spelled differently and is O22.37.

**O22.37** `standing grants exist: Sekkei's spec and plan dialogue` — SKILL.md 1 → 0 at task 7.

**Entity 15 — the roster columns.**

**O22.38** `| Role | Name [ref] | cwd | Model | Branch | Mode | Started | Status | Transcript |` — templates/roster.md 1 → 0 at task 17.

**O22.39** `| Role | Name [ref] | Since | Read at | Bytes | Records | Wake-ups | Compactions | Batches | Plans | Noticed |` — templates/roster.md 1, templates/kanri-handover.md 1, docs/notes/tanto-consistency-checks.md 2 → 0 at tasks 17, 18, 21. Four copies of one table header, and the handover's is declared "verbatim" from the roster's: the needle is what holds the four together.

**O22.40** `Columns are role, name` — SKILL.md 1 → 0 at task 7.

**O22.41** `One live session per role. A second handshake` — templates/roster.md 1 → 0 at task 17. The new keeping rule opens with the same seven words and
continues "and topic", so the needle carries the sentence's old ending.

**Entity 16 — eleven templates.**

**O22.42** `There are eleven` — SKILL.md 1 → 0 at task 8.

**O22.43** `Nineteen skill files, eleven of them templates` — docs/notes/tanto-consistency-checks.md 1 → 0 at task 21.

**O22.44** `Eight of the eleven are Kanri's` — docs/notes/tanto-consistency-checks.md 1 → 0 at task 21.

**Entity 17 — four subcommands.**

**O22.45** `lint|replay|diff|verify> --plan` — scripts/passage-check.js 1 → 0 at task 3. The new usage line opens with the same four names and adds three,
so the needle carries the closing bracket the new line does not have there.
The needle drops the opening angle bracket the usage line has: a lead whose
needle begins with `<` is read by the parser as a documentation placeholder and
silently carries no block, which the dry run found by counting 63 blocks where
the plan claimed 64.

**Entity 18 — the placeholders (issue-2872).**

**O22.46** `| <A> | <1-4> | <planned, sent, reported, accepted, or rework>` — templates/kanri.md 1 → 0 at task 17.

**O22.47** `| S-1 | <the report or session that raised it>` — templates/kanri.md 1 → 0 at task 17.

**O22.48** `| S-1 | <the triage, report, or session that raised it>` — templates/roster.md 1 → 0 at task 17.

**Entity 19 — a topic is opened only when no plan is in flight.**

**O22.49** `Only when no plan is in flight` — roles/kanri.md 1 → 0 at task 9.

**Entity 22 — the create request carries the command only.**

**O22.50** `is accepted, or no plan is in flight` — roles/kanri.md 1 → 0 at task 12, in the Create table's Sekkei row.

**Entity 20 — rule 9 counts strong-model sessions.**

**O22.51** `the strong-model sessions` — SKILL.md 1 → 0 at task 8.

**O22.52** `At most two strong-model sessions` — SKILL.md 1, roles/sekkei.md 1 → 0 at tasks 8 and 13.

**Entity 21 — the handshake has no effort.**

**O22.53** `model=<model id> branch=` — SKILL.md 1 → 0 at task 7.

**Entity 23 — the rejected seat names.**

**O22.54** `Shomu` — 0 today (measured 2026-09-13 over the sweep set) and 0 after. The dialogue and the spec carry the record of the choice, under `docs/superpowers/`, which this sweep does not read.

**O22.55** `Joshu` — 0 today and 0 after, on the same terms.

**Entity 24 — the skill-name key is personal only.**

**O22.56** `No skill uses this today` — SKILL.md 1 → 0 at task 6.

**Entity 25 — an omitted model inherits the strongest family on Kanri.**

**O22.57** `Kaiseki session is the strongest` — SKILL.md 1 → 0 at task 6.

**O22.58** `which is the strongest family.` — roles/sekkei.md 1 → 0 at task 13.

**Entity 26 — Kanri's exit has no direction file.**

**O22.59** `no direction file, because it rules on itself` — SKILL.md 1 → 0 at task 8.

**O22.60** `You have no second session to rule on you` — roles/kanri.md 1 → 0 at task 11.

**Entity 27 — one set of roles per repo.**

**O22.61** `One set of roles per repo` — SKILL.md 1 → 0 at task 8.

**Entity 29 — tanto edits none of the skills it composes.**

**O22.62** `Composes, without editing them` — README.md 1 → 0 at task 19.

**O22.63** `None of those skills is edited` — README.md 1 → 0 at task 19.

**Entity 30 — Sekkei's exit delta assumes T1 has run.**

**O22.64** `rules after T1 is committed, so the delta is known` — roles/sekkei.md 1 → 0 at task 13.

**Entity 31 — Kanri does the cold read itself.**

**O22.65** `Cold-read the spec whole` — roles/kanri.md 1 → 0 at task 10.

Entities 12, 13, 28, 32, 33 and 34 carry no `O` block, each for a stated
reason:

- **12, `/tanto resume`** and **32, shoroku's two prohibitions** survive the
  plan in a named place — the alias, and the two rules with their new scope —
  so they are Step 2's allowlisted counts, not needles whose disposition is
  zero.
- **13, nothing about a limit**, and **28, the reading is four figures**, are
  *additions*: there is no old string to sweep. Task 6's anchor is what proves
  the limit paragraph and the `effort=` line landed.
- **33, the Adopted column's `escalated`**, is inside O22.47 and O22.48 — the
  placeholder rows those needles name are the only two lines that carry it.
- **34, rule 11's starting roles**, is inside O22.43's neighbourhood in
  `SKILL.md` and is proved by task 8's anchor instead: the sentence is
  rewritten in place, and its old spelling `Jisso at the plan's landing,`
  wraps in the file, so a line-based needle for it reads zero before the plan
  and would report "already gone".

#### Steps

- [ ] **Step 1: The needle sweep**

**Extract** the needles rather than retyping them. Several carry `|`, `<`, `**`
and a spaced em dash, and one mistyped character makes that needle print `0`,
which is indistinguishable from "the old value is gone" — the exact failure
this task exists to detect, with no second witness:

```bash
TANTO=skills/tanto && node -e 'const {parsePlan}=require("./"+process.env.TANTO+"/scripts/passage-check.js");const fs=require("fs");const p=parsePlan(fs.readFileSync(process.argv[1],"utf8"));const n=p.blocks.filter(b=>b.kind==="O").map(b=>b.needle);fs.writeFileSync(".tanto/tanto-cost/o-needles.txt",n.join("\n")+"\n");console.log("needles written:",n.length)' docs/superpowers/plans/2026-09-12-tanto-cost.md
```

Expected: `needles written: 64`. A number other than 64 means a lead is
malformed or a needle begins with `<`, which the parser reads as a
documentation placeholder — check the lead before going on, because a needle
that is not a block is a needle nobody sweeps.

Then, from the repository root:

```bash
while IFS= read -r n; do printf '%3s  %s\n' "$(grep -rhF -- "$n" $(git ls-files skills/tanto skills/shoroku docs/notes/tanto-consistency-checks.md) 2>/dev/null | wc -l)" "$n"; done < .tanto/tanto-cost/o-needles.txt
```

Expected: `0` on all 64 lines. Record the whole output in the report, not a
verdict: a count above zero names the file that still carries the old value,
and the next command prints it.

```bash
while IFS= read -r n; do grep -rnF -- "$n" $(git ls-files skills/tanto skills/shoroku docs/notes/tanto-consistency-checks.md) 2>/dev/null; done < .tanto/tanto-cost/o-needles.txt
```

Expected: no output.

- [ ] **Step 2: The three survivors, counted against their allowlist**

These strings stay, and the check is *where* and *how many*, not *whether*.

```bash
grep -rnF '/tanto resume' $(git ls-files skills/tanto)
```

Expected: exactly two lines, both in `skills/tanto/SKILL.md` — the Invocation
table's alias row and the one sentence of "Resuming" that names the alias.
Before the plan, measured 2026-09-13: eight lines, over `SKILL.md`,
`roles/kanri.md` and `README.md`.

```bash
grep -c 'Do NOT write outside' skills/shoroku/SKILL.md
```

Expected: `1`.

```bash
grep -c 'Do NOT start a shoroku run without explicit user confirmation' skills/shoroku/SKILL.md
```

Expected: `1`.

```bash
grep -c 'Never start a run without explicit confirmation' skills/shoroku/SKILL.md
```

Expected: `1`.

The three are one rule each, counted one command at a time so that a failure
names its own line: task 20 re-scopes all three rather than removing any. Two of
them are also `O` needles, because their old form ends in a period and the
period is where the text changes; `Do NOT write outside` has no backtick-free
needle that spans its change point, so it is counted here and its new qualifier
is proved positively by the next command.

```bash
grep -c 'except the recommendation file' skills/shoroku/SKILL.md
```

Expected: `1`.

- [ ] **Step 3: The consistency note's checks 1 to 9, and its new check 16**

Run them as `docs/notes/tanto-consistency-checks.md` states them, in order,
against the note **as task 21 left it** — the note is the standing check and
this plan is its first exercise. Record each check's command and its output.

Expected, at the values task 21 measured and wrote into the note: check 1 lists
**twenty-four** paths, seven of them role files and thirteen templates, the
agent template included — nineteen before the plan; check 2 resolves every
in-skill path, twenty-two `ok` lines where there were seventeen,
`roles/keikaku.md`, `roles/kikaku.md`, `roles/hosa.md`,
`templates/kikaku-decision.md` and `templates/agent.md` among them; check 3
cites every template with no `UNCITED`, twenty rows where there were eleven;
check 4's superpowers and shoroku sentences still exist; check 5's two pinned
quotes are present in every copy; check 6 finds every routing string, the ten
line forms this plan adds included; check 7 finds none of the absent strings,
including its four new sweeps, which stood at 23, 10, 0 and 1 hits before the
plan; check 8 loads both frontmatters and prints `tanto.json ok 7 12`, where
the same assertion exited 1 before; check 9 lints an extracted tree clean; and
**check 16**, the note's new one, finds seven subcommands in the usage line
where there were four.

Check 16 is named here because task 21 appends it as `## 16.` rather than as
`## 10.` — the note's sections 10 to 15 are already numbered and renumbering
them is forbidden, so the plan's own scheduling line reads "checks 1 to 9 and
16", not "1 to 10".

A check whose expectation task 21 changed is run against **its** value, not
against this paragraph: task 21 measured them, and where the two disagree the
note wins and the disagreement is a finding for the report.

- [ ] **Step 4: Prove the task changed nothing**

```bash
git status --porcelain
```

Expected: empty. `.tanto/` is self-ignored, so the needle file does not appear;
any other output means this task edited the tree, which is its failure
condition.

**Done when:** all 64 needles print `0` and the second sweep prints nothing;
the three survivors stand at their allowlisted counts and the new qualifier is
present; the note's checks 1 to 9 **and 16** have been run with their output
recorded in the batch report; and `git status --porcelain` is empty.

---

### Task 23: The dogfood — the definitions on this machine, and the four harness measurements

**Batch:** F. **Blocks:** none.

The effort half of this design rests on four things about the harness that
nobody here has measured. Fixed input 6 measured one of them — a definition
written during a session is not dispatchable from that session — and the spec
records the other four as Deferred item 2, to be closed by this task or by what
it finds. Until this task runs, "the definition carries the kind's effort" is
an assertion; after it, it is a measurement or a known negative.

**This task modifies no tracked file.** It writes twelve files outside the
working tree, into the user's own configuration directory, and its other
deliverable is recorded output. Its reviewer **re-runs** what can be re-run and
reads the recorded transcript lines for what cannot, per the consistency note's
check 14.

**The discipline this task is measured by (issue-f2ec): record what the harness
listed, not what it was expected to list.** Every step below ends in a
transcript line, a file listing, or a quoted error. A step that reports "as
expected" without the output it saw has not been done.

**Files:**

- Modify: none under `git`.
- Write, outside the working tree: `~/.claude/agents/tanto-<object>-<act>.md`,
  twelve files, plus one throwaway `~/.claude/agents/tanto-probe-effort.md`
  that step 4 removes. Under `$CLAUDE_CONFIG_DIR/agents/` when that variable is
  set; this machine has it unset (measured 2026-09-13), so the path is
  `~/.claude/agents/`.

**Interfaces:**

- Consumes, from task 4: `templates/agent.md` and `templates/tanto.json`.
  Consumes, from task 6: the rule that says where the definitions live, when a
  role writes one, and what the start line reports.
- Produces, for the ledger: four measurements Kanri records, and the answer to
  Deferred item 2. Produces nothing any task consumes.

**Writing outside the worktree is deliberate and is authorized by the plan.**
The twelve files are this design's own artifact — every role writes them at its
start, and this task is the first time anything does — and they are personal
configuration beside `tanto.json`, not repository state (Fixed input 6). The
implementer writes them, names every path it wrote in the report, and stops
before anything else outside the tree.

#### Steps

- [ ] **Step 1: Render the twelve definitions**

Read `skills/tanto/templates/tanto.json`, overlay the personal file at
`~/.claude/tanto.json` field by field as `SKILL.md` describes, and render
`skills/tanto/templates/agent.md` once per kind into
`~/.claude/agents/tanto-<object>-<act>.md`, the kind's `.` becoming `-`. Write
a file only when it is absent or its content differs from what the template
renders; leave a matching file alone.

```bash
ls -1 ~/.claude/agents/ | sort
```

Expected: the twelve names of the spec's 1.2 — `tanto-task-implement.md`,
`tanto-task-escalate.md`, `tanto-task-review-spec.md`,
`tanto-task-review-quality.md`, `tanto-plan-draft.md`, `tanto-plan-review.md`,
`tanto-plan-coldread.md`, `tanto-spec-review.md`, `tanto-branch-review.md`,
`tanto-brief-write.md`, `tanto-shoroku.md`, `tanto-default.md` — and nothing
else of tanto's. Record the listing verbatim, including anything already there
that this task did not write.

- [ ] **Step 2: Prove each rendered file is loadable and carries its own effort**

```bash
for f in ~/.claude/agents/tanto-*.md; do printf '%s ' "$(basename "$f")"; sed -n '1,6p' "$f" | grep -E '^(name|effort):' | tr '\n' ' '; echo; done
```

Expected: twelve lines, each naming the file, its `name:` equal to the file's
basename without `.md`, and its `effort:` equal to that kind's effort in the
merged config — `high` for `task.implement`, `task.escalate`, `plan.draft`,
`plan.review`, `plan.coldread`, `spec.review`, `branch.review` and
`brief.write`; `medium` for `task.review-spec`, `task.review-quality`,
`shoroku` and `default`. Then load one of them through a real YAML parser, as
the consistency note's check 8 does, and record the parser's output.

- [ ] **Step 3: Write the effort probe**

Render one extra definition, `~/.claude/agents/tanto-probe-effort.md`, from the
same template, with `name: tanto-probe-effort` and `effort: low` — `low` because
it is the level furthest from every session's own, so a subagent that inherits
rather than obeys is unambiguous. Record the file's content in the report.

- [ ] **Step 4: The `human-needed:` line — the four measurements**

Jisso has no human access; this step is one line to Kanri, which grants it and
puts the list to the human:

```text
human-needed: open one new session in this repository and report four things from it — the harness's agent-type list, one probe dispatch's effort, the transcript field a /effort change moves, and whether /clear changes a session's name — because a definition is loaded at session start and none of the four is visible from a session that already exists — where: the human's own new window
```

The four things, as the numbered list Kanri gives the human. Each is recorded
as what the harness printed:

1. **Does a new session see a definition written moments before it started?**
   In the new window, ask the session to list its available agent types.
   Record the list verbatim. The twelve `tanto-*` names present is the
   expected answer and the one this design rests on; their absence is a
   finding that invalidates the definition mechanism, not a retry.
2. **Is a definition's `effort:` honored by a dispatch that names it?** In the
   new window, dispatch one trivial subagent with
   `subagent_type: tanto-probe-effort` and `model: haiku` — a one-sentence
   task, anything — then read that subagent's own transcript and record its
   `effort` and `perTurnEffort` values. `low` on both is the design working;
   the dispatching session's own level on either is the harness ignoring the
   key, which makes the effort half of this design inert and is the single
   most valuable thing this task can find.
3. **Which transcript field follows a `/effort` change?** In the new window,
   type `/effort low`, then have the session read the last `assistant` record
   of its own transcript and record both `effort` and `perTurnEffort`. The
   handshake reads `perTurnEffort` with `effort` as the fallback (spec 4.1);
   record which one actually moved.
4. **Does `/clear` change a session's name as well as its transcript?** In the
   new window, run `ListAgents` and record the name and `[ref]`; `/clear`;
   run `ListAgents` again and record both, and the session's transcript path
   before and after. The roster's `cleared` handling keys on the transcript
   (spec 4.2), and this says whether the name is a second signal or none.

- [ ] **Step 5: Remove the probe**

```bash
rm -f ~/.claude/agents/tanto-probe-effort.md && ls -1 ~/.claude/agents/ | grep -c probe
```

Expected: `0`. The twelve stay; the probe was a measurement and is not part of
the design.

- [ ] **Step 6: Record**

Write the four answers into the batch report's Measurements, each as the output
it came from rather than as a verdict, and name in one line which of Deferred
item 2's four questions each one closes and which, if any, it leaves open.

```bash
git status --porcelain
```

Expected: empty — this task changes no tracked file.

**Done when:** the twelve definitions exist and each carries its own `effort:`;
the probe has been dispatched from a session that was started after they were
written, and its transcript's effort values are recorded; the `/effort` and
`/clear` observations are recorded as the harness printed them; the probe file
is gone; and `git status --porcelain` is empty.

---

## Self-Review

**Sizes**, measured on this document after the plan review's fixes,
2026-09-13. The whole plan is 9,836 lines and 250 blocks — 159 `P`, 22 `A`, 5
`W`, 64 `O` — over 21 paths.

| Task | Lines | Steps | Blocks | Shape |
| --- | --- | --- | --- | --- |
| 1 | 276 | 8 | 0 | code, test-first |
| 2 | 416 | 9 | 0 | code, test-first |
| 3 | 378 | 9 | 2 | code, test-first, plus one passage |
| 4 | 246 | 9 | 3 | one passage, one created file |
| 5 | 239 | 12 | 7 | passages |
| 6 | 337 | 11 | 7 | passages |
| 7 | 450 | 19 | 15 | passages |
| 8 | 530 | 22 | 18 | passages |
| 9 | 335 | 15 | 11 | passages |
| 10 | 509 | 17 | 13 | passages |
| 11 | 587 | 16 | 12 | passages |
| 12 | 475 | 18 | 14 | passages |
| 13 | 532 | 14 | 10 | passages |
| 14 | 435 | 6 | 1 | one created file |
| 15 | 327 | 8 | 3 | three created files |
| 16 | 469 | 18 | 15 | passages |
| 17 | 436 | 17 | 14 | passages |
| 18 | 276 | 13 | 11 | passages |
| 19 | 341 | 14 | 10 | passages |
| 20 | 229 | 11 | 7 | passages |
| 21 | 609 | 17 | 13 | passages |
| 22 | 393 | 4 | 64 | sweep-and-check |
| 23 | 152 | 6 | 0 | sweep-and-check, human-in-the-loop |

**The largest task is task 21, at 609 lines and 17 steps** — the consistency
note, whose six changed checks are each a command with a measured expected
value, so most of its length is quoted command text rather than prose.
**Task 8 has the most steps, 22**, across four sections of `SKILL.md`; **task
22 has the most blocks, 64**, all of them `O` needles carrying no text at all.
Three files are large enough that one task per file was impossible:
`SKILL.md` is four tasks, `roles/kanri.md` four, and their cuts are by section
region, which is what makes each old block plainly unique. The numbers are
recorded rather than judged: issue-7281 asks for the sizes until a threshold
can be chosen.

**Two tasks are a sweep-and-check shape** — 22 and 23 — and both are in batch
F. Task 22's deliverable is the recorded output of a 64-needle sweep and the
consistency note's ten checks; task 23's is twelve files outside the working
tree and four harness measurements that need the human's hands. That shape
inverts the reviewer's standing instruction, so both dispatches say the
reviewer **re-runs** the commands rather than reading the report. The
context-cost run measured the shape at 1.93× the median implementer and 1.39×
the median reviewer; the tanto-workspace run measured the same shape at roughly
a mid-sized passage task. Expect either and record which — that disagreement is
the open half of issue-7281.

**Three tasks carry no block of any kind** — 1, 2 and 23 — and this is the
first plan of this repository where a task's correctness rests on something
other than the block grammar. Tasks 1 and 2 are test-first code: the plan
quotes every test verbatim, the implementation is the implementer's against a
stated interface, and the evidence is the suite failing before and passing
after. Task 23's evidence is what the harness printed. `verify` reports
`no passages` for each, which is a result and not a failure.

**What this plan does not carry.** No task writes under `docs/` except
`docs/notes/tanto-consistency-checks.md` — the requirement edits, the five
ADRs, the nine deferred issues and the six issues that move to `resolved/` are
T1's and T2's, and `docs/design/4807-tanto.md` and
`docs/design/e3f4-shoroku.md` are T2's. No task touches
`templates/batch-report.md`, `templates/bug-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md` or
`templates/roster-archive.md`, which the spec's 11.6 leaves unchanged; none
touches the repository's `.gitignore`, `.markdownlint-cli2.yaml` or
`.gitattributes`; and none changes `passage-check.js`'s four existing
subcommands beyond the one usage line. Report and prompt skeletons are the
tanto templates'; this plan names nothing else about them.

**T1 is already committed, so the plan carries no T1 list.** The spec's "What
the plan must contain" asks for one; by the time this plan was written, Kanri
had already run T1 on the spec's own four sections — the two requirement files'
edits, five new ADRs with the frontmatter bookkeeping on their five amendment
targets, and nine issues from the spec's Deferred items — in
`docs: T1 shoroku for tanto-cost`. Nothing of T1 is left for this plan, and the
plan asserts nothing about it; what *is* left is the T2 list below.

**The T2 list, so that it is written down once.** Six issues move to
`docs/issues/resolved/` at **this plan's own T2**, not at T1 — issue-3c7a,
issue-2e52, issue-5a17, issue-260c, issue-ac9d, issue-2872 — because the
intake's rule is that the plan whose T2 lands the fix moves them, and the fix
is the skill's files actually rewritten. The spec's "What the plan must
contain" bullet reads otherwise and is a drafting slip; Kanri ruled on it
(tanto-cost R-2) and this plan follows the ruling and the spec's own "Issues
this design closes" section.

**Eleven deviations from the spec's literal instruction, all deliberate and
all stated where they apply.** The last three were found by the plan review,
which is where an undeclared choice reads as an omission.

1. **How a batch is verified carries the per-boundary checks only.** The spec
   asks for the content greps, the YAML loads and the JSON parse in that
   section. The JSON parse and the frontmatter loads are there; the content
   greps and the `O` sweep are not — they are tasks 22 and 23, under "The
   closing checks". The reason is the instrument the same spec asks for:
   `boundary --plan` runs every fenced command under that heading and compares
   its output against one `Expected:` paragraph, so a check whose right answer
   is `4` at batch B and `0` at batch F can only be expressed as a failure at
   four of the six boundaries. A check that is red by design for most of a
   plan stops being read. Split as it is, `boundary`'s output is honest at
   every boundary, and the sweeps run once, against the tree the whole plan
   built.
2. **Batch A's implementation lines are `unaccounted-added` in `diff`, by a
   rule stated in Global Constraints** rather than by an exemption. The plan
   quotes the tests, not the implementation; the alternative — quoting code no
   one has run — is the "placeholder in a command's shape" this repository
   already rules against. The proper fix is an `exempt:` declaration for
   `diff`, which is issue-4eef and out of scope by the spec's own Out of scope.
   The accepted lines are the new `sections`, `frame` and `boundary` code and
   the helpers they share; the rule's wording accepts any added line in that
   file, so the reviewer of each batch A task **reads** them, and the four
   existing subcommands' own tests — which the suite covers — are what guards
   an accidental edit to `lintPlan`, `replayPlan`, `diffPlan` or `verifyTask`.
3. **A created path carries no anchor step.** Measured on this plan's own
   assembly: `replay` collects a base blob for every path a non-`W` block
   names, so an anchor on a file the plan creates aborts the whole dry run with
   exit 2 before any check runs. The five created files verify with a fenced
   `grep -cF` step on the same needle instead, which `replay` runs against the
   applied tree and the boundary runs for real. The one-line fix is in
   `replayPlan`, which the spec keeps out of scope; it goes to Kanri as a
   shoroku candidate.
4. **64 needles for 34 entities, and four entities with no needle.** Entities
   12 and 32 survive the plan in a named place — the `resume` alias, and
   shoroku's two re-scoped prohibitions — so they are counted against an
   allowlist in task 22 Step 2 rather than written as needles whose
   disposition is zero, which `lint`'s `needle-in-new-text` rule would refuse.
   Entities 13 and 28 are *additions*, with no old string to sweep; task 6's
   anchor is what proves they landed. Entity 5's fifth site and entities 33 and
   34 are swept by another entity's needle, as task 22 says row by row. Every
   entity is checked; three mechanisms, not one.
5. **Six of my first-cut needles read `0` and were re-cut.** A needle that
   wraps in its target returns `0`, and `0` reads as "already gone" — the trap
   `roles/sekkei.md` names. `run by Sekkei in place of an agent dry run`,
   `Sekkei asks for it on its own line`, `Kanri at T0 and T1, Jisso at T2`,
   `which on a Kanri, Sekkei, or Kaiseki session is the strongest family`,
   `Kanri rules after T1 is committed` and
   `Jisso at the plan's landing, Sekkei before it` all span a line break in
   the file. Each was re-cut against the real line and re-measured. Four more
   were re-cut after `lint` found them inside the plan's own new text.
6. **Eleven passages beyond the spec's per-file change list**, each because
   leaving the sentence would strand an old value the same spec names: the
   opening paragraph and the model-check sentence of `roles/kanri.md` (task 9);
   the model-check bullet, the `tanto.json` prerequisite and the superpowers
   prerequisite of `README.md` (task 19); Jisso's and Kaiseki's Owns cells and
   the roles table's `Count` header in `SKILL.md` (task 5); the Measurements
   row's "strong-model" wording, the two restatements of the keeping rule and
   the `cleared` archive sentences in the two templates (task 17). Each task's
   prose says which of its passages are additions and why.
7. **Two headings are renamed and one is deliberately not.**
   `roles/kanri.md`'s `### The adoption rule` becomes `### The four steps` and
   `### T2 — your Direct step` becomes `### T2`, because the first *is* an old
   value this plan removes; the drafter grepped the skill and the consistency
   note for citations of both before renaming. `roles/jisso.md`'s
   `## T2 and the exit — the shoroku write-out` keeps its name although Jisso
   no longer writes the write-out, and that task's prose says so explicitly so
   that an implementer does not "fix" it.
8. **One sentence in the plan comes from a measurement, not the spec.**
   `roles/sekkei.md`, `roles/keikaku.md` and `roles/jisso.md` say that a review
   report is read whole and everything else by section. Section 8.1 says every
   reader names sections; the previous Sekkei measured, at its exit, that the
   369-line spec review's four sections were all needed, so `sections` would
   have saved nothing there. Kanri relayed the finding to this Sekkei for
   exactly this passage. It narrows 8.1 rather than contradicting it, and it is
   named here because the spec does not carry it.

9. **The Models table carries families and not efforts.** The spec's checklist
   asks Global Constraints for "the concrete families **and** efforts of
   section 3.1 for the run's own dispatches". This run's sessions read today's
   skill, where a kind has no effort at all — the effort arrives with
   `templates/tanto.json` in batch A and reaches a dispatch only through the
   agent definitions of task 23 — so an effort column here would name a
   mechanism that does not exist for the sessions the table governs. The
   efforts are in the drafting conventions' vocabulary and in the spec's 1.1
   and 1.2, where the tasks read them.
10. **The rendered `agent.md` is not loaded by a boundary check.** The
    checklist asks "How a batch is verified" for a YAML load of both skills'
    frontmatters **and of a rendered `agent.md`**. The two frontmatters are
    check 4. A *rendered* definition does not exist until task 23 writes one
    outside the working tree, so there is nothing for a boundary before F to
    load: task 4 loads a rendered copy in its own steps, task 23 loads the
    twelve it writes, and the consistency note's check 8 (`P21.11`) makes the
    load a standing check from batch F on.
11. **Tasks 1 and 2 carry no `verify` step.** The checklist asks for every
    Verify step to be one `verify --plan … --task <N>` invocation. Those two
    tasks carry no block at all, so the invocation would print `no passages`
    and prove nothing about work that is code; their own Verify step is the
    pinned-Node test run, and the boundary's check 2 runs `verify` over them
    anyway, where `no passages` is the assertion that they gained no
    undeclared passage.

**One gap the spec leaves that the plan closes rather than defers.**
`roles/kikaku.md` writes under `.tanto/kikaku/`, and the spec never says who
creates `.tanto/.gitignore` and `.tanto/.markdownlint-cli2.yaml` for a Kikaku
opened in a workspace that has neither. The plan gives Kikaku the same sentence
every other role that writes under `.tanto/` already carries — write each only
when absent, never overwrite — rather than leaving a seat that can produce an
untracked, unignored file. It is a completion of the existing rule, not a new
one, and the human sees it here.

**The replacement boundary, and the sweep that shows it.** Batch F's boundary,
the final one. The sweep is a grep of this plan's own new-passage blocks for
every term a later batch lands, and the number depends on the term set, so both
readings are given rather than one:

| Term set | Forward references | Blocks carrying one |
| --- | --- | --- |
| **narrow** — the four created paths, and `shoroku`'s recommend and apply modes | 49 | 34 |
| **fair** — the narrow set plus the three seat names whose role files land in D (`Keikaku`, `Kikaku`, `Hosa`) | 128 | 65 |

Measured on the assembled plan, 2026-09-13, by the plan reviewer and by Sekkei
independently; an earlier Sekkei count of "ten" was a sample of the narrow set,
not the set, and is corrected here. The conclusion is the same either way and
is strengthened by the larger number: the latest batch named by an earlier one
is **F**, and the references run B→D, B→F, C→F, D→F and E→F. Representative
blocks, one per direction: `P5.6` (B names the three new role files), `P8.6` (B
names `templates/kikaku-decision.md`), `P8.1` and `P11.8` (B and C name the
`shoroku` halves), `W14.1` (D names them), `P19.9` (E names them).

Each reference is a sentence that, at its own batch's boundary, points at a file
or a feature that does not exist yet. That is the half-edited skill rule 11
exists for, and F is the first boundary at which none is outstanding. The
command is in the dry-run report so that a reader can re-run it rather than
trust either number.
