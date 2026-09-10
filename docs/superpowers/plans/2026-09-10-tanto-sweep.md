# The tanto small-items sweep Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `skills/tanto/scripts/passage-check.js`, the instrument a plan
that carries passages checks itself with, and land eleven small `tanto` fixes
plus the operational text of req-04f5 and decision-b6cb as passages into
`SKILL.md`, three role files, three templates, the skill's `README.md`, and
`docs/notes/tanto-consistency-checks.md`.

**Architecture:** Two kinds of task, and they do not mix. Batch A's first three
tasks write one CommonJS program and its `node:test` suite — the only
non-Markdown deliverable of the sweep — under test-driven development, with no
dependency step and no `package.json`. Every other task is a **passage** edit:
the task carries the old passage and the new passage verbatim, replaces exactly
the one for the other, and changes no other byte, so a touched file's diff
against the merge base is exactly the union of the passages landed in it so
far. Each block appears in this plan exactly once and is cited by its id
wherever it is needed again.

**Tech Stack:** Node 22 or newer on `PATH` (the runtime the skill's host
guarantees); `mise` for pinning the test run to the floor; `node:test` and
`node:assert` for the suite; Markdown for everything else; `pre-commit` through
`./scripts/lint.sh` (Windows: `scripts\lint.bat`); `git diff` against the merge
base, `git ls-files --eol`, and `grep -c` / `grep -cF` for the hand-written
verification.

**Spec:** `docs/superpowers/specs/2026-09-10-tanto-sweep-design.md`

## Global Constraints

Built from `AGENTS.md`, the spec's Fixed inputs, and `tanto.json`. Every batch
prompt restates these; trust the prompt over recollection.

### The shell

**Every fenced block in this plan runs in Git Bash.** The host's primary shell
is PowerShell, where a POSIX `grep -c '...'` with single quotes is unrunnable.
Every dispatch says so.

### Repository rules

- American English for everything in the repo — code, messages, comments, docs,
  commits, branch names.
- Run `./scripts/lint.sh` on the changed paths, **each named individually**. A
  directory argument makes every hook skip and proves nothing.
- Commit by explicit path with `git commit --only <paths>`; the index is
  shared. A new file needs `git add <path>` first, because `--only` cannot pick
  up an untracked file.
- Every commit message ends with a `Co-Authored-By:` trailer identifying the
  agent. Two identities coexist in practice and both satisfy `AGENTS.md`, so
  **the check greps the prefix `Co-Authored-By: Claude`, per commit, in a loop**
  — an aggregate `grep -c` over the branch counts trailer lines, so a commit
  carrying two and a commit carrying none balance out.
- Never `git add -A`, `.`, or `-u`; never a bare `git commit`; never
  `git commit -a`. Never amend a published commit. Never push to `origin/main`.
  Never bypass a hook (`--no-verify`, a `core.hooksPath` override).
- Do not edit agent instruction files, repo-root Markdown, or linter/formatter
  configuration. This plan's prerequisites below are the human's for exactly
  that reason.

### Models

From `tanto.json`. The personal file at `$CLAUDE_CONFIG_DIR/tanto.json` sets
only `sessions.sekkei = "opus"`; every `subagents` key is a built-in default.

| Dispatch | Model |
| --- | --- |
| implementer, fix rounds 1-3 | `sonnet` |
| task reviewer, scoped re-review, whole-branch review | `opus` |
| fix rounds 4-5 | `opus` |
| anything else | `sonnet` |

**Every dispatch names a `model`.** An omitted `model` inherits the session's,
which on Jisso is `opus` — the exact failure the rule prevents.

### The runtime, and how the floor is exercised

Two assumptions at two levels, not to be conflated.

- **Using the skill** assumes only **Node 22 or newer on `PATH`**. Nothing pins
  a version at that level and nothing installs one.
- **Testing the script** assumes **`mise`**, a contributor's tool. Tests run
  pinned to the floor:

  ```bash
  mise x node@22 -- node --test skills/tanto/scripts/
  ```

  Record the version it resolved beside the result, so that "the tests pass on
  the floor" is a run and not a claim.

### Prerequisites, the human's, before task 1

Two things arrive through the dotrepo base scaffold, not through a task of this
plan: a JavaScript linter targeting `skills/tanto/scripts/*.js` at Node 22, and
`mise` in `CONTRIBUTING.md`'s Prerequisites (approved at dialogue D-13). Kanri
runs these three gates and records their output in the ledger before sending
batch A's prompt:

```bash
grep -cE 'eslint|oxlint|biome|prettier' .pre-commit-config.yaml
grep -ci 'mise' CONTRIBUTING.md
mise --version
```

**The plan records no values for these** — Kanri writes what they returned
into the ledger, because a number written here would be a measurement of a
world the plan outlives. What belongs here is why each gate is shaped as it
is: **a gate must be able to read zero before the thing it gates arrives.** A
word-list gate such as `grep -c 'js\|javascript\|eslint\|oxlint\|biome'`
returns a count on a tree with no JavaScript linter at all — every hit an
exclude pattern for a generated file (`package-lock\.json$`,
`compile_commands\.json$`, `\.(js|css)\.map$`), none of them a linter — and
would open the gate before the prerequisite landed. A word-list gate matches
the exclusions; name the tools. The first two must read non-zero before
task 1.

A fourth check is deferred into task 1, because it cannot run before the file
exists: `./scripts/lint.sh skills/tanto/scripts/passage-check.js` must show a
JavaScript hook **running**, not `(no files to check) Skipped`. Presence in the
config is not a match on the path, and a lint that matches no hook passes and
proves nothing.

### The created paths

`diff` reads this list; it is why the two new files are not unaccounted added
lines.

```text
created: skills/tanto/scripts/passage-check.js
created: skills/tanto/scripts/passage-check.test.js
```

### The commands `replay` does not run

`replay` reads this list the way it reads `created:`. Two families of command
in this plan need what a scratch tree does not have — the repository and its
pre-commit hook cache, and the toolchain the test runner resolves against — so
they are declared here once rather than marked line by line.

```text
replay-skip: ./scripts/lint.sh — pre-commit needs the repository and its hook cache, which the applied tree is not
replay-skip: mise — the test runner resolves a toolchain and runs the suite in skills/tanto/scripts/, neither of which the applied tree carries
```

These two patterns cover the commands in this plan that `replay` would
otherwise run in a directory that is not a repository: its own lint and its own
test runner. No tally is written here, because no command consumes one — the
plan's own rule, and the third count of mine to have been wrong when nothing
read it. `git` and `scripts/passage-check.js verify` are skipped by the
script's own rule and need no declaration.

### The tree encoding and line endings this work must preserve

Measured in this repository on 2026-09-10, and re-measured after the human's
Biome commit landed the same day: `.gitattributes` carries `* text=auto`, with
`eol=lf` for `*.sh` and for the JavaScript and JSON family (`*.js`, `*.cjs`,
`*.mjs`, `*.ts` and their neighbours), and `eol=crlf` for `*.bat`.
`core.autocrlf` is `true` both locally and globally. Every **Markdown** file
this plan touches reports `i/lf w/crlf attr/text=auto` under
`git ls-files --eol` — index LF, working tree CRLF, nothing mixed — and the two
`.js` files it creates will report `i/lf w/lf attr/text eol=lf`, pinned rather
than inherited. Both halves are measured, and the second changed under this
document between one review and the next.

- Read as UTF-8 and normalise CRLF to LF before any comparison, search, or line
  count. A block written LF against a file checked out CRLF never matches, and
  the failure looks like a missing passage.
- Write with the target file's own ending.
- Strip CR from `git diff` output before classifying it.
- A file whose endings are mixed is reported, never silently normalised.
  `git ls-files --eol` decides, before and after — never a grep for a control
  character.
- The script carries **no shebang** and is always invoked as `node <path>`.
  The line-ending reason is gone — `.gitattributes` now pins `*.js` to
  `eol=lf`, which the human landed in the Biome commit of 2026-09-10, so a
  shebang would work. The rule stands on the remaining one: the runtime text
  spells the command `node "$TANTO/scripts/passage-check.js"`, and a reader
  who is setting `$TANTO` needs the interpreter named rather than implied.
  This plan still makes no `.gitattributes` change; it no longer says none is
  needed.

### Rule 11 — the authority for this run's sessions

This plan edits `skills/tanto/` files that the run's own sessions read, and
this repository links the skill into the working tree, so a session started
mid-plan reads whatever is on disk at that moment. **Until the boundary named
below, the authority for every session of this run is this Global Constraints
section, Kanri's orders line, and the batch prompts — not the role text on
disk.** Kanri records that as a ruling when the plan lands, and every batch
prompt and any handover file carries it.

## Batches

Four batches, fourteen tasks. Every cross-file item whose two halves must
agree is one task — that is what keeps the tree self-consistent at each
boundary: P11.3 with issue-12d3, P9.7 and P9.8 with the handover, P12.6 with
the brief, P7.7 with the other three seats of issue-7481. The invariant is
about text that must stay byte-identical across files, not about issues, and
two items are deliberately split without creating an inconsistency, because
neither half quotes the other: issue-f2ec's dispatch half (`roles/jisso.md`,
task 7, batch B) and its reading half (`roles/kanri.md`, task 13, batch D) are
parallel prose, and issue-7481's four seats span five files inside batch B.

| Batch | Tasks | Delivers | Stop conditions at the boundary |
| --- | --- | --- | --- |
| A | 1 the parser and `lint`; 2 `replay`; 3 `diff` and `verify`; 4 the note (P4.1—P4.5) | the instrument, tested, and the note that schedules it | the four gates above; `mise x node@22 -- node --test` passes with its version recorded; the note's checks 1 and 2 pass at their new expected values |
| B | 5 `roles/sekkei.md` Step 3 and the verification bullet (P5.1, P5.2); 6 `roles/sekkei.md` Step 4 (P6.1); 7 the executing seats (A7.1, P7.2, A7.3, P7.4, P7.5, A7.6, P7.7); 8 the instrument's existence (A8.1, P8.2, A8.3, P8.4, A8.5, P8.6) | issue-7481's four seats, and the authoring rules that use the script | **the replacement boundary opens here**; `passage-check.js diff` runs clean from this boundary on |
| C | 9 the handover, whole (P9.1, P9.2, P9.3, P9.4, P9.5, P9.6, P9.7, P9.8); 10 issue-d725 (P10.1, P10.2, P10.3, P10.4, P10.5); 11 issue-12d3 (P11.1, P11.2, P11.3) | Kanri's procedure and the contract | `passage-check.js diff` clean; no `notify_when_idle: true` anywhere under `skills/tanto/` |
| D | 12 issue-867f (P12.1, A12.2, P12.3, P12.4, P12.5, P12.6); 13 issue-f2ec's reading and issue-15bf (A13.1, P13.2, P13.3); 14 the whole-tree sweeps and the `O` needles | the brief, the measurement, the mode, and the proof | every `O` needle at its stated disposition with hits printed; the note's check 5 in-repo greps unchanged |

**No planned replacement.** No batch expects one. Batch A is the heaviest and
runs entirely on one Jisso.

Two tasks are called out because their size is the data issue-7281 asks for,
not because anything is wrong with them.

- **Task 9 is the largest at eight blocks.** It is one task because splitting it
  would put `P9.3`'s "run the Handover section" in the tree a boundary before
  `P9.4` and `P9.5` fix what that section says at a plan close.
- **Task 14 is verification-only** — its deliverable is recorded output and it
  creates no file. Its dispatch tells the reviewer to **re-run** the checks
  rather than read the report, because the output is the deliverable; the
  context-cost run measured that shape at 1.93× the median implementer and
  1.39× the median reviewer, so expect it to cost.

## How a batch is verified

Named by name. Every command runs in Git Bash from the repository root, and the
implementer records its output before and after — the output is the evidence
subagent-driven development asks for.

1. **Lint**, on every changed path, each named individually:
   `./scripts/lint.sh <path> [<path> ...]`. On
   `skills/tanto/scripts/passage-check.js` a JavaScript hook must appear as
   run, not as `(no files to check) Skipped`.
2. **The tests**, on the declared floor:
   `mise x node@22 -- node --test skills/tanto/scripts/`, with the version it
   resolved recorded beside the result.
3. **The content greps** each task states: every new passage present exactly
   once, every old passage absent, every anchor at its stated post-edit value.
   An anchor check inverts only when the new passage wholly supersedes the
   needle, so a boundary that re-runs the blocks mechanically reads the
   non-inverting half as a failure without the stated value — the values are in
   the blocks and are not optional.
4. **Line endings**, in two parts, because they are two different claims:

   ```bash
   git ls-files --eol skills/tanto/SKILL.md skills/tanto/README.md \
     skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md \
     skills/tanto/roles/jisso.md skills/tanto/templates/review-brief.md \
     skills/tanto/templates/roster.md skills/tanto/templates/kanri-handover.md \
     docs/notes/tanto-consistency-checks.md
   git ls-files --eol skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js
   ```

   For the **nine existing paths**, `i/lf w/crlf attr/text=auto`, unchanged
   from the baseline recorded before task 1, and never `w/mixed`.
   For the **two created paths**, `i/lf w/lf attr/text eol=lf` — pinned by
   `.gitattributes`, not inherited, so a checkout produces LF too. The value
   was right before the Biome commit and its stated reason was not: it read
   "a file an implementer has just written is LF, and `w/crlf` is what a later
   checkout produces", which `eol=lf` now makes false while leaving the value
   alone — design-4807's rule that an explanation is a second claim beside the
   number and can be wrong while the number is right. Note the `attr/` field:
   it reads `attr/text eol=lf`, not `attr/text=auto` as the nine Markdown paths
   do. `w/mixed` fails either way.
5. **The boundary check, from the batch B boundary on:**

   ```bash
   node skills/tanto/scripts/passage-check.js diff --plan docs/superpowers/plans/2026-09-10-tanto-sweep.md --base "$(git merge-base main HEAD)"
   ```

   No unaccounted added line, no unexplained removed line, and it names the two
   `created:` paths it exempted. Batch A is not checked this way: it carries no
   passages, and its two files are the exemption.
6. **The old-value sweep, at the batch D boundary.** Every `O` needle at its
   stated disposition over `skills/tanto/`, **with the hits printed rather than
   counted**, and the raw count compared with the raw count the plan records. A
   qualifier such as "outside the passages" is not what the command returns,
   and a needle that wraps in its target returns `0`, which reads as "already
   gone".
7. **The note's checks 1 and 2**, at their new expected values — nineteen paths
   listed, seventeen `ok` lines, no `MISSING`. This is what proves P4.1 to P4.4
   landed together rather than one without the others.
8. **The note's check 5**, read for what it can decide. It pins two quotes, not
   one: the four SDD stop classes, in the superpowers source, in
   `roles/jisso.md` and in `SKILL.md`; and the four implementer statuses, in
   the source and in `roles/jisso.md` only. Two of its five greps target
   `$HOME/.claude/plugins/cache/...`, which no edit of this plan could move —
   those two are context, not stop conditions. The three in-repo greps are the
   check: this plan touches neither quote, and they are what proves it.
9. **The note's check 7, and specifically its ninth line**, which must stay
   silent:

   ```bash
   grep -rn 'skills/tanto/' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
   ```

   Runtime text in this skill is skill-relative; only the skill's `README.md`
   and the note itself may name `skills/tanto/`. The reason is stronger than
   tidiness: that path is repo-relative, and `tanto` runs in any repository,
   where `skills/tanto/` does not exist. A hit names the file and the line, and
   the fix belongs in the passage that wrote it.
10. **The trailer**, per commit, in a loop over the batch's commits, grepping
    the prefix `Co-Authored-By: Claude`.

A stop condition worded as a property of the whole tree is backed by a command
that sweeps the whole tree, not only the files the batch wrote. Checks 6, 7, 8
and 9 are those.

## The boundary from which a role may be started or replaced

**The batch B boundary.** Not batch A.

This is where every file the plan touches agrees with every other, which is
decision-5c8e's test — and it is the swept answer, not the intended one. At the
batch A boundary `docs/notes/tanto-consistency-checks.md` names
`passage-check.js` as the replay while `roles/sekkei.md` Step 4 still tells
Sekkei to write an application script and put its path in `plan-dryrun.md`: two
files this plan touches, disagreeing. Batch B lands that passage and closes it,
and batch B is also where `SKILL.md`'s new paragraph about the executable
stops forward-referencing `roles/sekkei.md`, `roles/jisso.md`, and the
whole-branch reviewer, because all three land in the same batch.

Before that boundary **no role is created and none replaced**, with two
exceptions the contract names: Kanri's own handover proceeds when it is due,
and its successor takes the authority ruling above from the handover file
rather than from the tree; and a Kaiseki needed before the boundary is a Kanri
ruling, recorded as `R-n`, made with the half-edited skill in view.

Distinguish this from where a replacement is *expected*: the Batches section
below names those separately, and there are none.

---

## What an executor needs cold

You are editing `skills/tanto/`, an Agent Skill written in Markdown that
orchestrates a multi-session run: `SKILL.md` is the contract every session
reads, `roles/kanri.md`, `roles/sekkei.md`, `roles/jisso.md` and
`roles/kaiseki.md` are the four role procedures, `templates/` holds the
copy-and-fill skeletons, and `README.md` describes the skill to a human.
`docs/notes/tanto-consistency-checks.md` is the repository note that governs
how a plan editing that skill verifies itself. Nothing you touch is executed by
a runtime except the one script this plan adds.

**The shell.** Every fenced command block in this plan runs in **Git Bash**,
not PowerShell, even though PowerShell is this host's primary shell. The `A`
anchor steps are POSIX `grep` invocations and the verification steps are bash.
Where a step names `./scripts/lint.sh`, `scripts\lint.bat` with the same
arguments is the Windows equivalent and is run from PowerShell or `cmd`.

**How a passage edit is made.** A replacement block gives you the old passage
and the new passage. Locate the old passage in the named file — it occurs
exactly once unless the lead line says otherwise — and replace exactly those
lines with exactly the new block's lines. Change no other byte: no re-wrapping,
no trailing-whitespace tidy, no heading renames, nothing outside the block. An
insertion block's old block is an **anchor that stays**: the new block is the
text to add, and it is added after (or before, when the lead says so) the
anchor lines, which are not repeated in the new block. Anchor lines are never
deleted.

**Line endings.** The working tree is CRLF and the index is LF for every
existing path this plan touches. Write each passage with the target file's own
ending, and use an edit tool that rewrites only the lines you name rather than
one that rewrites the whole file. `git ls-files --eol` is the command that
settles any line-ending question; a grep for a control character is not.
`w/mixed` on any path is a failure. The two files this plan creates are written
LF and read `i/lf w/lf attr/text eol=lf`, because `.gitattributes` pins `*.js`
to `eol=lf` — the value is pinned rather than inherited from `text=auto`, and
a checkout produces LF too.

**The block grammar this plan is written in.** Every block has an id of the
form `<kind><task>.<n>` — kind `P` for a passage, `A` for an anchor step, `O`
for an old value; `<task>` is the task number that carries it and `<n>` its
ordinal inside that task. A replacement leads with
`**P<id>** <path> — replace exactly these <N> lines`, then the old block, then
`**P<id> →**`, then the new block. An insertion leads with
`insert after these <N> lines` or `insert before these <N> lines`. A global
replacement leads with `replace all <N> occurrences of these <M> lines`, and it
is the one shape whose old block matches more than once. Wherever a count in a
lead is 1 the lead reads the singular — `this 1 line`,
`1 occurrence of this 1 line` — and `lint` accepts both agreements. An anchor
step leads
with `**A<id>** <path> — <command> — before: <v>, after: <v>`, both values
always stated, because an anchor check inverts only when the new passage wholly
supersedes the needle. An old value the plan contradicts leads with
`**O<id>** <needle> — <where it must be gone, or why it may stay>`.

**Each block appears once.** A task that needs a block another task carries
cites it by id and does not re-quote it. Where you see an id such as `P9.1`
with no block beneath it, the block is in the task whose number the id names.

**This plan's Verify steps are hand-written on purpose.** The script that would
replace them is what this plan builds, in its own batch A, and it does not
exist when the plan is reviewed. Do **not** substitute
`passage-check.js verify` for a Verify step of this plan. That convention binds
the next plan, not this one.

**Repository rules that bind every task.** Commit by explicit path with
`git commit --only <paths>`; a new file needs `git add <path>` first, because
`--only` cannot pick up an untracked path. Never `git add -A`, `.`, or `-u`,
never a bare `git commit` or `git commit -a`, and never `--no-verify`. End
every commit message with a `Co-Authored-By:` trailer naming the AI agent.
American English throughout. Do not edit `.pre-commit-config.yaml`,
`CONTRIBUTING.md`, `.gitattributes`, `.editorconfig`, or any other linter,
formatter, or contributor-prerequisite configuration — those are out of scope
and need explicit human approval.

**markdownlint coverage is uneven, and that is configuration, not an accident.**
`.markdownlint-cli2.yaml` ignores `docs/superpowers/**` and
`skills/**/templates/**`. So for `templates/review-brief.md`,
`templates/roster.md` and `templates/kanri-handover.md` the hooks that decide a
lint step are trailing whitespace, end-of-file, and mixed line ending, not
markdownlint; for `SKILL.md`, the role files, `README.md` and the note,
markdownlint runs.

**The merge base** referred to throughout is `$(git merge-base main HEAD)`.

## File structure

Two files are created and nine are modified.

- Create: `skills/tanto/scripts/passage-check.js` — the whole instrument: the
  plan parser and the four subcommands `lint`, `replay`, `diff`, `verify`. One
  file, because it is one program with one grammar at its centre and the skill
  ships it as a single path that a role file names.
- Create: `skills/tanto/scripts/passage-check.test.js` — its regression guard,
  beside it, run by `node --test`.
- Modify: `skills/tanto/SKILL.md` — the contract's subscription rule, the two
  directories, what `mode=` can say, and the paragraph that says the skill
  ships an executable.
- Modify: `skills/tanto/README.md` — the layout list and the prerequisites.
- Modify: `skills/tanto/roles/kanri.md` — the handover trigger and procedure,
  the residency line, the plan-close row, the brief's form check, the
  measurement report, and the whole-branch reviewer's command.
- Modify: `skills/tanto/roles/sekkei.md` — the block conventions of Step 3,
  Step 4's dry run, and the "how a batch is verified" bullet.
- Modify: `skills/tanto/roles/jisso.md` — the boundary check, a measurement
  task's dispatch, the workspace row, and the test-suite premise.
- Modify: `skills/tanto/templates/review-brief.md` — the unanswered-point
  default, in four places plus its two prose statements.
- Modify: `skills/tanto/templates/kanri-handover.md` — the trigger blank.
- Modify: `skills/tanto/templates/roster.md` — what the archive's rows feed.
- Modify: `docs/notes/tanto-consistency-checks.md` — checks 1 and 2's path set
  and counts, check 2's extraction expression, and the passage-plan list's
  replay entry.

## Where each change lives

The spec labels its blocks by destination file (`P-K1`, `A-S5`, `P-M2`); a spec
has no tasks, so those are not plan ids. This table is where the two are
mapped, once.

| Spec label | Plan id | File | Task | Batch | Issue or input |
| --- | --- | --- | --- | --- | --- |
| — | — | `skills/tanto/scripts/passage-check.js`, `passage-check.test.js` | 1, 2, 3 | A | 7481, 88d3, 10bc, f813 (the instrument; new files, not passages) |
| P-N1 | P4.1 | `docs/notes/tanto-consistency-checks.md` | 4 | A | 7481, 88d3, 10bc (the governing note) |
| P-N2 | P4.2 | `docs/notes/tanto-consistency-checks.md` | 4 | A | as above |
| P-N3 | P4.3 | `docs/notes/tanto-consistency-checks.md` | 4 | A | as above |
| P-N4 | P4.4 | `docs/notes/tanto-consistency-checks.md` | 4 | A | as above |
| P-N5 | P4.5 | `docs/notes/tanto-consistency-checks.md` | 4 | A | as above |
| P-E1 | P5.1 | `skills/tanto/roles/sekkei.md` | 5 | B | f813, 10bc, 7281, D-6 |
| P-E3 | P5.2 | `skills/tanto/roles/sekkei.md` | 5 | B | 7481 (how a batch is verified) |
| P-E2 | P6.1 | `skills/tanto/roles/sekkei.md` | 6 | B | 7481, 88d3, 10bc |
| A-J1 | A7.1 | `skills/tanto/roles/jisso.md` | 7 | B | 7481 |
| P-J1 | P7.2 | `skills/tanto/roles/jisso.md` | 7 | B | 7481 |
| A-J2 | A7.3 | `skills/tanto/roles/jisso.md` | 7 | B | f2ec (the dispatch) |
| P-J2 | P7.4 | `skills/tanto/roles/jisso.md` | 7 | B | f2ec (the dispatch) |
| P-J4 | P7.5 | `skills/tanto/roles/jisso.md` | 7 | B | this plan ships a test suite |
| A-K12 | A7.6 | `skills/tanto/roles/kanri.md` | 7 | B | 7481 (the whole-branch reviewer's seat) |
| P-K12 | P7.7 | `skills/tanto/roles/kanri.md` | 7 | B | 7481 (the whole-branch reviewer's seat) |
| A-S5 | A8.1 | `skills/tanto/SKILL.md` | 8 | B | the instrument's existence |
| P-S5 | P8.2 | `skills/tanto/SKILL.md` | 8 | B | the instrument's existence |
| A-M1 | A8.3 | `skills/tanto/README.md` | 8 | B | the instrument's existence |
| P-M1 | P8.4 | `skills/tanto/README.md` | 8 | B | the instrument's existence |
| A-M2 | A8.5 | `skills/tanto/README.md` | 8 | B | the instrument's existence |
| P-M2 | P8.6 | `skills/tanto/README.md` | 8 | B | the instrument's existence |
| P-K1 | P9.1 | `skills/tanto/roles/kanri.md` | 9 | C | b6cb + req-04f5 (the trigger) |
| P-K2 | P9.2 | `skills/tanto/roles/kanri.md` | 9 | C | b6cb (the residency line) |
| P-K6 | P9.3 | `skills/tanto/roles/kanri.md` | 9 | C | b6cb (the plan-close row) |
| P-K10 | P9.4 | `skills/tanto/roles/kanri.md` | 9 | C | b6cb (the handover procedure's third case) |
| P-K11 | P9.5 | `skills/tanto/roles/kanri.md` | 9 | C | b6cb (the handover procedure's third case) |
| P-K13 | P9.6 | `skills/tanto/roles/kanri.md` | 9 | C | b6cb (the handover procedure's third case) |
| P-H1 | P9.7 | `skills/tanto/templates/kanri-handover.md` | 9 | C | b6cb (the trigger, as the handover file states it) |
| P-T1 | P9.8 | `skills/tanto/templates/roster.md` | 9 | C | b6cb (the archive's threshold, as the roster states it) |
| P-K3 | P10.1 | `skills/tanto/roles/kanri.md` | 10 | C | d725 |
| P-K4 | P10.2 | `skills/tanto/roles/kanri.md` | 10 | C | d725 |
| P-K5 | P10.3 | `skills/tanto/roles/kanri.md` | 10 | C | d725 |
| P-S1 | P10.4 | `skills/tanto/SKILL.md` | 10 | C | d725 |
| P-S2 | P10.5 | `skills/tanto/SKILL.md` | 10 | C | d725 |
| P-S3 | P11.1 | `skills/tanto/SKILL.md` | 11 | C | 12d3 |
| P-K7 | P11.2 | `skills/tanto/roles/kanri.md` | 11 | C | b6cb + 12d3 (residency, both directories) |
| P-J3 | P11.3 | `skills/tanto/roles/jisso.md` | 11 | C | 12d3 (Jisso's copy of the workspace rule) |
| P-R1 | P12.1 | `skills/tanto/templates/review-brief.md` | 12 | D | 867f |
| A-R2 | A12.2 | `skills/tanto/templates/review-brief.md` | 12 | D | 867f |
| P-R2 | P12.3 | `skills/tanto/templates/review-brief.md` | 12 | D | 867f |
| P-R3 | P12.4 | `skills/tanto/templates/review-brief.md` | 12 | D | 867f |
| P-R4 | P12.5 | `skills/tanto/templates/review-brief.md` | 12 | D | 867f |
| P-K9 | P12.6 | `skills/tanto/roles/kanri.md` | 12 | D | 867f (the form check that enforces it) |
| A-K8 | A13.1 | `skills/tanto/roles/kanri.md` | 13 | D | f2ec (the reading) |
| P-K8 | P13.2 | `skills/tanto/roles/kanri.md` | 13 | D | f2ec (the reading) |
| P-S4 | P13.3 | `skills/tanto/SKILL.md` | 13 | D | 15bf |
| the spec's "Old values this plan contradicts" table | O14.1 to O14.16 | `skills/tanto/` | 14 | D | 10bc |

Two changes the spec's own table names are **not** passages of this plan and
are named here so the gap is stated rather than discovered:
`docs/design/4807-tanto.md` carries superseded text in two places — its
Handover section still says "Two signals fire one", and its report-line
paragraph still states the subscription rule the exit lines are losing — and
both are T2 shoroku, along with the eleven issues' move to
`docs/issues/resolved/`. This plan touches no file under `docs/design/`,
`docs/requirements/`, `docs/decisions/`, or `docs/issues/`.

## The instrument's specification

This section is the specification for the program tasks 1, 2 and 3 build, and
it is transcribed from the spec's sections "What it is", "The block grammar",
"The four subcommands", "Files the plan creates", "Exit codes, and what counts
as a failure", "Encoding and line endings", and "Module format". **Dispatch
tasks 1 to 3 with this section attached.** Tasks 4 to 14 do not need it.

### What it is

A plain CLI. It reads a plan file and runs `git`; it invokes no skill and
dispatches no agent. It never writes into the working tree — `replay` works on
copies under a temporary directory. Standard library only: `node:fs`,
`node:path`, `node:child_process`, `node:util`'s `parseArgs`. No
`package.json`, no dependency step, no install. Its tests are
`skills/tanto/scripts/passage-check.test.js`, using `node:test` and
`node:assert`.

### The block grammar the parser implements

The lead line is the machine contract. There is exactly one place each fact is
written.

Every block's id is `<task>.<n>` — the plan's task number, a dot, and the
block's ordinal within that task — prefixed by its kind: `P` for a passage, `A`
for an anchor step, `O` for an old value, `W` for a whole file.
`verify --plan <path> --task <N>` selects by that first component, so the task
number in the id is load-bearing and not decoration.

Four shapes:

- A **replacement** leads with
  `**P<id>** <path> — replace exactly these <N> lines`, then the old block,
  then `**P<id> →**`, then the new block. **When a count is 1 the lead reads
  the singular** — `this 1 line`, `1 occurrence of this 1 line` — everywhere a
  count appears in a lead, and `lint` accepts both. It is English and not a
  second shape: a grammar that admitted only the plural would make `these 1
  lines` mandatory, and this plan's own first eight blocks would fail `lint`
  as `malformed-lead`.
- An **insertion** leads with `insert after these <N> lines` or
  `insert before these <N> lines`, and its new block omits the anchor lines the
  old block names, because an insertion's anchor stays.
- A **global replacement** leads with
  `replace all <N> occurrences of these <M> lines`. It is the one shape whose
  old block is allowed to match more than once, and `<N>` is the count `lint`
  checks.
- A **whole file** leads with `**W<id>** <path> — new file, <N> lines` and
  carries the file's entire content.

An **anchor step** leads with
`**A<id>** <path> — <command> — before: <v>, after: <v>`, both values stated,
always. **Every insertion carries one**; a replacement carries one only when
the plan wants a needle its blocks do not already quote. `lint` enforces that
rule. An anchor needle never contains a backtick, because it is written inside
an inline code span.

**An old value the plan contradicts** leads with
`**O<id>** <needle> — <where it must be gone, or why it may stay>`, one per
entity the plan changes.

Two rules keep documentation from being read as a block, and both are
mechanical:

- a lead whose id or path is a `<...>` placeholder is documentation and is
  skipped;
- a lead is resolved only inside a **task body**, which is the text under a
  heading matching `^### Task <n>` or `^## Task <n>`. `lint` **fails** when it
  finds zero task headings, rather than reporting success over zero blocks.

Two further rules the parser enforces because prose cannot: a count is written
only where a command consumes it, and a block appears once.

### The four subcommands

| Subcommand | What it does | What it closes |
| --- | --- | --- |
| `lint --plan <path>` | Parses only. Every lead line well-formed; every `N` equal to its block's real line count; every id unique; every id cited in prose present as a block; every anchor step stating both values; every insertion carrying an anchor step; and **no `O` needle occurring in the plan's own new-passage text** — that text being the concatenation of the blocks that follow a `**P<id> →**` lead, and nothing else, because a search over the whole plan would flag all of them by way of their own `O` lead lines. A needle the plan's replacement text contains cannot detect the change it was written for, and returns the same count after the plan as before. | issue-88d3's count half, issue-f813's citation rule, issue-10bc's needle trap |
| `replay --plan <path> --base <ref>` | Copies the base blobs to a temporary tree and applies each passage, asserting each old passage occurs **exactly once**. Then re-runs each anchor command against the applied copy and compares the result with its stated `after:` value. Then runs the plan's commands in order against that tree, printing each output beside its stated expectation — **skipping what it cannot run**: any `git` command, any invocation of `passage-check.js verify` (which reads the working tree, not the applied copy), and any pattern the plan declares as `replay-skip:`. The rules and the comparison are in "What `replay` treats as a command" below; this cell is a summary and not the contract. Then runs every `O` needle against the applied tree and prints every residual hit. | issue-88d3's anchor half, issue-7481's command-runner half, issue-10bc |
| `diff --plan <path> --base <ref>` | Every added line of `git diff <base>` must be text the plan literally quotes; lists the added lines that are not, and the removed lines outside any fenced block. A path the plan declares as created is exempt — its lines are accounted for by construction — and the exemption is read from the plan's `created:` list, never inferred. Needs only the plan and `git`. | issue-7481's core |
| `verify --plan <path> --task <N>` | What a task's Verify step invokes, against the working tree: each of task `N`'s new passages present exactly once, and each of its anchors at its stated `after:` value. It takes no `--base` and does no diffing — that is `diff`'s job at the boundary, and a subcommand that did both would need a base ref its callers do not have. | D-6 |

`replay` reconstructs; `diff` classifies. They prove the same thing from
opposite sides, and only `diff` survives the session that wrote it.

### Files the plan creates

A plan that adds a file has nothing for `diff` to match its lines against, and
every one of them is an added line of the merge-base diff. So the plan states,
once, in its Global Constraints:

```text
created: skills/tanto/scripts/passage-check.js
created: skills/tanto/scripts/passage-check.test.js
```

`diff` exempts those paths and says so in its output — `2 paths exempt as
created`, naming them — rather than passing them silently, so that a reader
sees what was not checked. `verify --task <N>` reports "no passages" for a task
that touches only created paths, which is a result and not a failure.

### Exit codes, and what counts as a failure

Each subcommand exits `0` only when everything it checked held.

| Subcommand | Exits non-zero when |
| --- | --- |
| `lint` | any lead is malformed; any `N` disagrees with its block; any id repeats; any cited id has no block; any insertion has no anchor step; any anchor omits a value; **or zero task headings were found** |
| `replay` | a passage's old block matches other than the stated number of times, or an applied anchor disagrees with its `after:` value. **Not** a command whose output differs from its expectation: that is printed, counted and left to Sekkei, because a dry run's value is the adjudication — the context-cost run's twelve automated failures were six plan defects and six harness artifacts, and a `replay` that exited non-zero on all twelve would have said nothing the six did not |
| `diff` | any added line outside a `created:` path is not quoted by the plan, or any removed line falls outside every fenced block |
| `verify` | a task's new passage is absent or present more than once, or one of its anchors disagrees with its `after:` value |

A residual `O` hit is the exception and exits `0`: the old-value sweep is
adjudicated, not decided, so `replay` prints the hits under a heading that
names their count and leaves the judgment with Sekkei. **Exit `2` is a broken invocation**, distinct from a check
failure's `1`, so that a script that could not run is never read as a clean
tree: an unresolvable `--base`, an absent `git`, an unreadable plan, a missing
required option, and an unknown or absent subcommand. `2` also carries a usage
line to stderr.

### Encoding and line endings

- **Read as UTF-8, and normalize CRLF to LF before any comparison, search, or
  line count.** A plan block written LF and a target file checked out CRLF
  otherwise never match, and the failure looks like a missing passage rather
  than an encoding problem.
- **Write with the target file's own ending.** `replay` detects the dominant
  ending of each file it copies and restores it when it writes the applied
  copy, so that the reconstructed tree is byte-comparable with the real one
  instead of differing on every line.
- **Strip CR from `git diff` output before classifying it.** A CRLF working
  tree diffed against an LF index carries CR bytes on the added lines, which no
  literal quote from the plan will contain.
- **A file whose endings are mixed is reported, never silently normalized.**
  `git ls-files --eol` must show the same `i/` and `w/` values before and after
  a task and must never show `w/mixed`.
- **The script carries no shebang and is always invoked as `node <path>`.**
  The original reason was that under `text=auto` its working-tree copy would be
  CRLF on Windows and a shebang line ending in CR is not a runnable interpreter
  path. That reason is gone — `.gitattributes` now pins `*.js` to `eol=lf`, so
  a shebang would work. The rule stands on the remaining one: the runtime text
  spells the command `node "$TANTO/scripts/passage-check.js"`, and a reader who
  is setting `$TANTO` needs the interpreter named rather than implied.

### What `replay` treats as a command, and how it compares

A dry run's value is that it runs the plan's commands; three things decide
which commands those are, and a first draft of this spec pinned none of them.

- **Which fences carry commands.** A fenced block is a command block when its
  info string is `bash` or `console`, at any backtick count — this plan uses
  four backticks for its command fences and three for its passage blocks, and
  a parser keyed on three would find one block out of eighty.
- **Which commands are not run.** `replay` works on a scratch tree that is not
  a git repository, so it **skips** and reports as skipped: any command whose
  first word is `git`; any invocation of `scripts/passage-check.js verify`,
  whose subject is the working tree rather than the applied copy; and any
  command matching a pattern the plan declares in its Global Constraints as
  `replay-skip: <pattern> — <reason>`, one line per pattern, which is how a
  plan names the commands the script cannot classify — its own lint, its own
  test runner, anything needing a toolchain the scratch tree lacks. Everything
  else runs. The skipped set is printed with its reasons, never elided: a dry
  run that silently skips is a dry run that passed nothing.
- **A command fence with no `Expected:` paragraph after it** is run and its
  output recorded under "no stated expectation". It is not a failure and not
  a skip; roughly a third of a real plan's fences are `git add`/`git commit`
  blocks and setup steps that state no expectation because they have none.
- **How an expectation is found and compared.** The paragraph immediately
  following a command block, when it begins with `Expected:`, is that block's
  expectation. `replay` prints the command, its actual output, and that
  paragraph, adjacent, and marks them `MATCH` only when the output appears in
  the expectation as a literal substring after both are stripped of
  surrounding whitespace. Anything else is `DIFFERS`, which is a report and
  not a verdict — the comparison is deliberately crude, because Sekkei
  adjudicates and a clever comparison would hide the cases worth reading.

### Module format

CommonJS with `require`, because there is no `package.json` and a bare `.js`
file is CommonJS to Node. The test file follows the same choice. `import` in
either file is a runtime error, not a lint finding.

---
### Task 1: the plan parser and `lint`

**Batch:** A. **Blocks:** none — this task creates files, and a created file has
no old passage to anchor to.

**Files:**

- Create: `skills/tanto/scripts/passage-check.js`
- Create (test): `skills/tanto/scripts/passage-check.test.js`

**Interfaces:**

- Consumes: nothing from an earlier task. Read the section "The instrument's
  specification" above first; it is the contract for this file.
- Produces, for tasks 2 and 3, the module surface they extend:

```js
module.exports = { normalize, parsePlan, lintPlan, main };
```

  - `normalize(text)` → `string`. CRLF to LF. Every comparison, search and line
    count in the program runs on its result.
  - `parsePlan(text)` → `{ blocks, created, citations, taskHeadings }`.
    `blocks` is an array of block objects; `created` is the array of paths read
    from the plan's `created:` lines; `citations` is the array of block ids
    mentioned outside a lead line; `taskHeadings` is the array of task numbers
    whose headings were found.
  - A block object is
    `{ kind, id, task, ordinal, path, shape, count, old, new, command, before,
    after, needle, note, line }`. `kind` is `'P'`, `'A'`, `'O'` or `'W'`;
    `shape` is `'replace'`, `'insert-after'`, `'insert-before'`,
    `'replace-all'`, `'whole-file'`, `'anchor'` or `'old-value'`; `old` and
    `new` are arrays of lines or `null`; `count` is the `N` the lead declares;
    `line` is the 1-based line number of the lead in the plan.
  - `lintPlan(parsed)` → `Problem[]`, where a `Problem` is
    `{ code, id, message }` and `code` is one of `'malformed-lead'`,
    `'count-mismatch'`, `'duplicate-id'`, `'missing-block'`,
    `'insertion-without-anchor'`, `'anchor-missing-value'`,
    `'no-task-headings'`, `'needle-in-new-text'`. An empty array means the
    plan passed.
  - `main(argv)` → the process exit code, `argv` being `process.argv.slice(2)`.
    Tasks 2 and 3 add their subcommands to its dispatch.

- Argument parsing is `node:util`'s `parseArgs` with
  `allowPositionals: true`, the positional being the subcommand and the options
  being `--plan`, `--base` and `--task`, all `type: 'string'`.
- No shebang. The file is always invoked as `node <path>`.

- [ ] **Step 1: Write the failing test file**

Create `skills/tanto/scripts/passage-check.test.js` with exactly this content.
The fixtures are built from arrays of lines rather than template literals so
that no line of a fixture plan starts at column 0 in this document — a lead
line written flush left inside this task's body would be a block of this plan.

`SWEEP_CLEAN` and `SWEEP_TRAPPED` are the `needle-in-new-text` pair, and they
differ only in the needle. `alpha` occurs in the fixture's **old** block and in
the `O` lead itself but in no `→` block, so it is clean; `gamma` is the
replacement text, so it is the trap. The pair is what pins the searched text to
the concatenation of the `→` blocks: an implementation that searched the whole
plan would flag both, and on a real plan it would flag every needle by way of
its own `O` lead line.

````js
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const { normalize, parsePlan, lintPlan } = require('./passage-check.js');

const SCRIPT = path.join(__dirname, 'passage-check.js');

function plan(lines) {
  return lines.join('\n') + '\n';
}

function writePlan(lines) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'passage-check-'));
  const file = path.join(dir, 'plan.md');
  fs.writeFileSync(file, plan(lines), 'utf8');
  return file;
}

function run(args) {
  try {
    const stdout = execFileSync(process.execPath, [SCRIPT, ...args], {
      encoding: 'utf8',
    });
    return { code: 0, out: stdout };
  } catch (err) {
    return { code: err.status, out: `${err.stdout || ''}${err.stderr || ''}` };
  }
}

const REPLACEMENT = [
  '### Task 91: a fixture task',
  '',
  '**P91.1** `tmp/fixture.md` — replace exactly these 2 lines',
  '',
  '```text',
  'alpha',
  'beta',
  '```',
  '',
  '**P91.1 →**',
  '',
  '```text',
  'gamma',
  '```',
];

const INSERTION = [
  '### Task 92: another fixture task',
  '',
  '**A92.1** `tmp/fixture.md` — `grep -c alpha tmp/fixture.md` — before: 1, after: 1',
  '',
  '**P92.2** `tmp/fixture.md` — insert after these 1 lines',
  '',
  '```text',
  'alpha',
  '```',
  '',
  '**P92.2 →**',
  '',
  '```text',
  'delta',
  '```',
];

const SWEEP_CLEAN = [
  '### Task 94: the old-value sweep',
  '',
  '**O94.1** `alpha` — gone from `tmp/fixture.md`; P91.1 replaces it',
];

const SWEEP_TRAPPED = [
  '### Task 94: the old-value sweep',
  '',
  '**O94.1** `gamma` — gone from `tmp/fixture.md`; P91.1 replaces it',
];

const codes = (lines) => lintPlan(parsePlan(plan(lines))).map((p) => p.code);

test('normalize turns CRLF into LF', () => {
  assert.strictEqual(normalize('a\r\nb\r\n'), 'a\nb\n');
});

test('a replacement inside a task body parses', () => {
  const parsed = parsePlan(plan(REPLACEMENT));
  assert.strictEqual(parsed.blocks.length, 1);
  const block = parsed.blocks[0];
  assert.strictEqual(block.id, 'P91.1');
  assert.strictEqual(block.kind, 'P');
  assert.strictEqual(block.task, 91);
  assert.strictEqual(block.ordinal, 1);
  assert.strictEqual(block.shape, 'replace');
  assert.strictEqual(block.path, 'tmp/fixture.md');
  assert.strictEqual(block.count, 2);
  assert.deepStrictEqual(block.old, ['alpha', 'beta']);
  assert.deepStrictEqual(block.new, ['gamma']);
});

test('an insertion parses, and its new block omits the anchor lines', () => {
  const parsed = parsePlan(plan(INSERTION));
  const insertion = parsed.blocks.find((b) => b.id === 'P92.2');
  assert.strictEqual(insertion.shape, 'insert-after');
  assert.deepStrictEqual(insertion.old, ['alpha']);
  assert.deepStrictEqual(insertion.new, ['delta']);
  const anchor = parsed.blocks.find((b) => b.id === 'A92.1');
  assert.strictEqual(anchor.kind, 'A');
  assert.strictEqual(anchor.command, 'grep -c alpha tmp/fixture.md');
  assert.strictEqual(anchor.before, '1');
  assert.strictEqual(anchor.after, '1');
});

test('an insert-before lead is read as insert-before', () => {
  const lines = INSERTION.slice();
  lines[4] = '**P92.2** `tmp/fixture.md` — insert before these 1 lines';
  const parsed = parsePlan(plan(lines));
  assert.strictEqual(parsed.blocks.find((b) => b.id === 'P92.2').shape, 'insert-before');
});

test('a global replacement carries its occurrence count', () => {
  const lines = REPLACEMENT.slice();
  lines[2] = '**P91.1** `tmp/fixture.md` — replace all 4 occurrences of these 2 lines';
  const block = parsePlan(plan(lines)).blocks[0];
  assert.strictEqual(block.shape, 'replace-all');
  assert.strictEqual(block.occurrences, 4);
  assert.strictEqual(block.count, 2);
});

test('a singular lead parses, and both number agreements are accepted', () => {
  const one = REPLACEMENT.slice();
  one[2] = '**P91.1** `tmp/fixture.md` — replace exactly this 1 line';
  one.splice(6, 1);
  const block = parsePlan(plan(one)).blocks[0];
  assert.strictEqual(block.shape, 'replace');
  assert.strictEqual(block.count, 1);
  assert.deepStrictEqual(block.old, ['alpha']);
  assert.deepStrictEqual(codes(one), []);

  const all = one.slice();
  all[2] = '**P91.1** `tmp/fixture.md` — replace all 4 occurrences of this 1 line';
  const globalBlock = parsePlan(plan(all)).blocks[0];
  assert.strictEqual(globalBlock.shape, 'replace-all');
  assert.strictEqual(globalBlock.occurrences, 4);
  assert.strictEqual(globalBlock.count, 1);

  const plural = one.slice();
  plural[2] = '**P91.1** `tmp/fixture.md` — replace exactly these 1 lines';
  assert.deepStrictEqual(codes(plural), []);
});

test('an old-value lead parses its needle', () => {
  const parsed = parsePlan(plan([
    '### Task 93: the sweep',
    '',
    '**O93.1** `Two signals` — gone from `roles/kanri.md`; P93.2 replaces it',
  ]));
  const block = parsed.blocks[0];
  assert.strictEqual(block.kind, 'O');
  assert.strictEqual(block.needle, 'Two signals');
});

test('a lead whose id or path is a placeholder is documentation and is skipped', () => {
  const parsed = parsePlan(plan([
    '### Task 1: a fixture task',
    '',
    '**P<id>** `<path>` — replace exactly these 1 lines',
    '',
    '```text',
    'alpha',
    '```',
  ]));
  assert.deepStrictEqual(parsed.blocks, []);
});

test('a lead outside every task body is not resolved', () => {
  const parsed = parsePlan(plan(['## Context', ''].concat(REPLACEMENT.slice(2))));
  assert.deepStrictEqual(parsed.blocks, []);
});

test('the created list is read from the plan', () => {
  const parsed = parsePlan(plan([
    '```text',
    'created: skills/tanto/scripts/passage-check.js',
    'created: skills/tanto/scripts/passage-check.test.js',
    '```',
  ].concat(REPLACEMENT)));
  assert.deepStrictEqual(parsed.created, [
    'skills/tanto/scripts/passage-check.js',
    'skills/tanto/scripts/passage-check.test.js',
  ]);
});

test('a well-formed plan lints clean', () => {
  assert.deepStrictEqual(codes(REPLACEMENT.concat([''], INSERTION)), []);
});

test('lint fails when zero task headings were found', () => {
  assert.deepStrictEqual(codes(['## Context', '', 'Nothing here.']), ['no-task-headings']);
});

test('lint reports a declared count that disagrees with its block', () => {
  const lines = REPLACEMENT.slice();
  lines[2] = '**P91.1** `tmp/fixture.md` — replace exactly these 3 lines';
  assert.deepStrictEqual(codes(lines), ['count-mismatch']);
});

test('lint reports a repeated id', () => {
  const lines = REPLACEMENT.concat([''], REPLACEMENT.slice(2));
  assert.ok(codes(lines).includes('duplicate-id'));
});

test('lint reports an id cited in prose that has no block', () => {
  const lines = REPLACEMENT.concat(['', 'Applied after P91.9, which does not exist.']);
  const problems = lintPlan(parsePlan(plan(lines)));
  assert.deepStrictEqual(problems.map((p) => p.code), ['missing-block']);
  assert.strictEqual(problems[0].id, 'P91.9');
});

test('lint reports an insertion with no anchor step', () => {
  const lines = INSERTION.slice(0, 2).concat(INSERTION.slice(4));
  assert.deepStrictEqual(codes(lines), ['insertion-without-anchor']);
});

test('lint reports an anchor that omits a value', () => {
  const lines = INSERTION.slice();
  lines[2] = '**A92.1** `tmp/fixture.md` — `grep -c alpha tmp/fixture.md` — before: 1';
  assert.ok(codes(lines).includes('anchor-missing-value'));
});

test('a needle occurring outside every new-passage block lints clean', () => {
  assert.deepStrictEqual(codes(REPLACEMENT.concat([''], SWEEP_CLEAN)), []);
});

test('lint reports a needle the plan reproduces in its own new-passage text', () => {
  const problems = lintPlan(parsePlan(plan(REPLACEMENT.concat([''], SWEEP_TRAPPED))));
  assert.deepStrictEqual(problems.map((p) => p.code), ['needle-in-new-text']);
  assert.strictEqual(problems[0].id, 'O94.1');
});

test('lint exits 0 on a clean plan and 1 on a failing one', () => {
  const clean = writePlan(REPLACEMENT);
  assert.strictEqual(run(['lint', '--plan', clean]).code, 0);
  const broken = writePlan(['## Context', '', 'Nothing here.']);
  const result = run(['lint', '--plan', broken]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /no-task-headings/);
});

test('an unreadable plan exits 2, not 1', () => {
  const missing = path.join(os.tmpdir(), 'passage-check-absent', 'plan.md');
  assert.strictEqual(run(['lint', '--plan', missing]).code, 2);
});

test('a CRLF plan parses the same as an LF one', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'passage-check-'));
  const file = path.join(dir, 'plan.md');
  fs.writeFileSync(file, plan(REPLACEMENT).replace(/\n/g, '\r\n'), 'utf8');
  assert.strictEqual(run(['lint', '--plan', file]).code, 0);
  const parsed = parsePlan(fs.readFileSync(file, 'utf8'));
  assert.deepStrictEqual(parsed.blocks[0].old, ['alpha', 'beta']);
});
````

- [ ] **Step 2: Run the tests and watch them fail**

````bash
mise x node@22 -- node --test skills/tanto/scripts/
````

Expected: FAIL, with `Cannot find module './passage-check.js'`. Record the Node
version the run resolved: `mise x node@22 -- node --version`.

- [ ] **Step 3: Write `skills/tanto/scripts/passage-check.js`**

Create the file with this surface, and implement the bodies from the section
"The instrument's specification" above. The specification, not this skeleton,
is what the bodies must satisfy; the tests of Step 1 are what decides whether
they do. The program's text is deliberately not transcribed into this plan: a
created file has no old passage, its lines are exempt from the merge-base diff
check by the `created:` list, and its own tests are the check that a
transcription would only duplicate.

````js
'use strict';

// No shebang: this file is always invoked as `node <path>`. Not for a
// line-ending reason -- `.gitattributes` pins `*.js` to `eol=lf` -- but
// because the runtime text spells the command
// `node "$TANTO/scripts/passage-check.js"`, and a reader who is setting
// `$TANTO` needs the interpreter named rather than implied.

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { parseArgs } = require('node:util');

/** CRLF to LF. Every comparison, search and line count runs on the result. */
function normalize(text) {}

/** Read a plan. Returns { blocks, created, citations, taskHeadings }. */
function parsePlan(text) {}

/** Check a parsed plan against itself. Returns Problem[]; empty means clean. */
function lintPlan(parsed) {}

/** Dispatch a subcommand. Returns the process exit code. */
function main(argv) {}

module.exports = { normalize, parsePlan, lintPlan, main };

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}
````

Four points the tests pin and the specification states, called out because
they are the ones an implementer gets wrong:

- **both number agreements in a lead are accepted.** When a count is 1 the
  lead reads the singular — `replace exactly this 1 line`,
  `replace all 4 occurrences of this 1 line` — and the plural with a count of
  1 parses too. This plan's own first eight blocks are written in the
  singular, and a parser built to the plural alone would report all eight as
  `malformed-lead`;
- a lead is resolved **only** inside a task body — the text under a heading
  matching `^### Task <n>` or `^## Task <n>` — and a lead whose id or path is a
  `<...>` placeholder is documentation and is skipped;
- `lint` **fails** with `no-task-headings` when it finds no task heading at
  all, rather than reporting success over zero blocks;
- a failed check exits `1`; an unreadable plan, an unresolvable `--base` and an
  absent `git` exit `2`.

For a subcommand the argument vector does not name, this task prints usage and
exits `2`, which the specification now states. See "Concerns for
Sekkei".

- [ ] **Step 4: Run the tests and watch them pass**

````bash
mise x node@22 -- node --test skills/tanto/scripts/
````

Expected: every test passes, `fail 0`. Record the resolved version beside the
result.

- [ ] **Step 5: Prove the JavaScript linter actually matches the path**

````bash
./scripts/lint.sh skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js
````

Windows alternative: `scripts\lint.bat` with the same two paths. Expected: exit
0, and a JavaScript hook appearing as **run** — `Passed` — not as
`(no files to check) Skipped`. A lint that matches no hook passes and proves
nothing. If every hook skips, stop and report: the prerequisite linter is not
in place, and this task cannot verify itself.

- [ ] **Step 6: Stage both files and check their line endings**

````bash
git add skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js
git ls-files --eol skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js
````

Expected, quoting the shape and not the column spacing: `i/lf`, `w/lf`,
`attr/text eol=lf` for both — pinned by `.gitattributes`, not inherited, so a
checkout produces LF too. Note the `attr/` field: it reads `attr/text eol=lf`,
not `attr/text=auto` as the nine Markdown paths do. `w/mixed` is a failure
either way.

- [ ] **Step 7: Commit**

````bash
git commit --only skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js -m "feat(tanto): the passage-check plan parser and its lint subcommand" -m "A plan that carries passages states each block's shape in a lead line, and the lead line is the machine contract. passage-check.js parses it: the four block shapes, the anchor steps, the old-value needles, the created list, and the task bodies a lead is resolved inside. lint checks the plan against itself - every lead well-formed, every N equal to its block's real line count, every id unique, every cited id present, every anchor stating both values - and fails rather than passes when it finds no task heading at all (issue-88d3, issue-f813, issue-5e47)." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 8: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

**Done when:** `mise x node@22 -- node --test skills/tanto/scripts/` passes on
the recorded Node 22 version, `lint --plan` exits `0` on a clean plan and `1`
with `no-task-headings` on one with no task heading, `lint` reports
`needle-in-new-text` for a needle that occurs in a `→` block and stays silent
for one that occurs only outside them, an unreadable plan exits `2`, the
JavaScript hook ran rather than skipped, and both paths read `i/lf w/lf`.

---

### Task 2: `replay`

**Batch:** A. **Blocks:** none.

**Files:**

- Modify: `skills/tanto/scripts/passage-check.js` — add `replay` and its
  dispatch entry.
- Modify (test): `skills/tanto/scripts/passage-check.test.js` — append this
  task's tests.

**Interfaces:**

- Consumes, from task 1: `normalize(text)`, `parsePlan(text)`, and `main(argv)`
  with its `parseArgs` dispatch; the block object's `kind`, `id`, `task`,
  `path`, `shape`, `count`, `occurrences`, `old`, `new`, `command`, `before`,
  `after` and `needle` fields.
- Produces, for task 3: `replayPlan(parsed, base, options)` →
  `{ ok, tree, failures, residuals }`, where `tree` is the temporary directory
  holding the applied copies, `failures` is an array of
  `{ code, id, message }` with `code` one of `'occurrence-count'` and
  `'anchor-after'` — a command whose output differs is reported and
  counted, never a failure — and `residuals` is an array of
  `{ id, needle, hits }`. `options` carries `cwd`, the repository the base
  blobs are read from, defaulting to `process.cwd()`; this task's own tests
  pass the throwaway repository they built.
- Add `replayPlan` to `module.exports`.

- [ ] **Step 1: Append the failing tests**

Append to `skills/tanto/scripts/passage-check.test.js`. `makeRepo` builds a
throwaway git repository so that `--base` resolves without touching this one;
`-c user.email`, `-c user.name` and `-c core.autocrlf=false` are passed so the
test does not depend on the machine's git configuration — the last of the three
because the line-ending test reads the bytes of a blob it wrote as CRLF, and an
`autocrlf` that normalized it would make that test measure git rather than
`replay`.

````js
const { replayPlan } = require('./passage-check.js');

function makeRepo(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'passage-check-repo-'));
  const git = (...args) =>
    execFileSync('git', ['-C', dir, '-c', 'user.email=t@t', '-c', 'user.name=t', '-c', 'core.autocrlf=false', ...args], {
      encoding: 'utf8',
    });
  git('init', '-q');
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), content, 'utf8');
    git('add', name);
  }
  git('commit', '-qm', 'base');
  return { dir, git, head: git('rev-parse', 'HEAD').trim() };
}

function runIn(cwd, args) {
  try {
    return { code: 0, out: execFileSync(process.execPath, [SCRIPT, ...args], { cwd, encoding: 'utf8' }) };
  } catch (err) {
    return { code: err.status, out: `${err.stdout || ''}${err.stderr || ''}` };
  }
}

test('replay applies a passage to a copy of the base blob and exits 0', () => {
  const repo = makeRepo({ 'tmp/fixture.md': 'alpha\nbeta\n' });
  const file = writePlan(REPLACEMENT);
  const result = runIn(repo.dir, ['replay', '--plan', file, '--base', repo.head]);
  assert.strictEqual(result.code, 0);
  assert.strictEqual(fs.readFileSync(path.join(repo.dir, 'tmp/fixture.md'), 'utf8'), 'alpha\nbeta\n');
});

test('replay fails when an old passage occurs other than the stated number of times', () => {
  const repo = makeRepo({ 'tmp/fixture.md': 'alpha\nbeta\nalpha\nbeta\n' });
  const file = writePlan(REPLACEMENT);
  const result = runIn(repo.dir, ['replay', '--plan', file, '--base', repo.head]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /P91\.1/);
});

test('replay re-runs each anchor against the applied copy and compares it with after', () => {
  const repo = makeRepo({ 'tmp/fixture.md': 'alpha\n' });
  const wrong = INSERTION.slice();
  wrong[2] = '**A92.1** `tmp/fixture.md` — `grep -c alpha tmp/fixture.md` — before: 1, after: 0';
  assert.strictEqual(runIn(repo.dir, ['replay', '--plan', writePlan(INSERTION), '--base', repo.head]).code, 0);
  assert.strictEqual(runIn(repo.dir, ['replay', '--plan', writePlan(wrong), '--base', repo.head]).code, 1);
});

test('replay restores the dominant line ending of the file it copied', () => {
  const repo = makeRepo({ 'tmp/fixture.md': 'alpha\r\nbeta\r\n' });
  const parsed = parsePlan(fs.readFileSync(writePlan(REPLACEMENT), 'utf8'));
  const result = replayPlan(parsed, repo.head, { cwd: repo.dir });
  assert.strictEqual(result.ok, true);
  assert.strictEqual(fs.readFileSync(path.join(result.tree, 'tmp/fixture.md'), 'utf8'), 'gamma\r\n');
});

test('replay prints residual O hits under a heading naming their count, and still exits 0', () => {
  const repo = makeRepo({ 'tmp/fixture.md': 'alpha\nbeta\n' });
  const lines = REPLACEMENT.concat([
    '',
    '**O91.2** `alpha` — gone once P91.1 lands',
  ]);
  const result = runIn(repo.dir, ['replay', '--plan', writePlan(lines), '--base', repo.head]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /1 residual/i);
});

test('replay skips a command that invokes passage-check verify', () => {
  const repo = makeRepo({ 'tmp/fixture.md': 'alpha\nbeta\n' });
  const lines = REPLACEMENT.concat([
    '',
    '```bash',
    'node skills/tanto/scripts/passage-check.js verify --plan p.md --task 91',
    '```',
    '',
    'Expected: `0`',
  ]);
  const result = runIn(repo.dir, ['replay', '--plan', writePlan(lines), '--base', repo.head]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /skipped/i);
});

test('an unresolvable base exits 2 and names the ref, unlike an unknown subcommand', () => {
  const repo = makeRepo({ 'tmp/fixture.md': 'alpha\nbeta\n' });
  const file = writePlan(REPLACEMENT);
  const unknown = runIn(repo.dir, ['no-such-subcommand', '--plan', file]);
  assert.strictEqual(unknown.code, 2);
  assert.doesNotMatch(unknown.out, /no-such-ref/);
  const result = runIn(repo.dir, ['replay', '--plan', file, '--base', 'no-such-ref']);
  assert.strictEqual(result.code, 2);
  assert.match(result.out, /no-such-ref/);
});
````

- [ ] **Step 2: Run the tests and watch the new ones fail**

````bash
mise x node@22 -- node --test skills/tanto/scripts/
````

Expected: the task 1 tests still pass; all **seven** new ones fail — six
because `replay` is not yet a subcommand, and the seventh on its ref-naming
assertion rather than on its exit code, which is the distinction the paragraph
below explains.

The seventh fails for a different reason from the other six, and that reason
is worth reading before you run this step. Its assertion is an **error**
outcome, and the error path a not-yet-written subcommand already takes is the
same one: before
`replay` exists, `['replay', '--plan', ..., '--base', 'no-such-ref']` is an
unknown subcommand, which exits `2` as well. Its exit-code assertion therefore
holds before a line of `replay` is written and can never go red on its own, and
the usage line cannot separate the two cases either, because the exit-code
table gives **every** `2` one. What fails today is its other assertion — that
the output names the ref that could not be resolved, which only an implemented
`replay` prints. Read that test's failure line and confirm it failed on the
missing ref rather than on the exit code; a test whose red step passes is not
yet a test.

- [ ] **Step 3: Implement `replay`**

Add `replayPlan` and its dispatch entry to `skills/tanto/scripts/passage-check.js`,
against "What `replay` treats as a command, and how it compares" and the
`replay` row of the exit-code table, both in "The instrument's specification"
above. That section, and not the subcommand table's summary cell, is where the
command rules are stated. The order of its passes is part of the contract,
because a later pass reads the tree an earlier one wrote:

1. copy each blob the plan names from `--base` into a temporary directory,
   recording each file's dominant line ending;
2. apply each passage in plan order, asserting the old block occurs **exactly
   once** — or, for a global replacement, exactly `occurrences` times;
3. re-run each anchor command against the applied copy and compare the result
   with its stated `after:` value;
4. run the plan's commands in order against that tree — every fence whose
   info string is `bash` or `console`, at any backtick count — printing each
   output beside its stated expectation. Three skips, and none of them silent:
   any command whose first word is `git`; any invocation of
   `scripts/passage-check.js verify`, whose subject is the working tree rather
   than the applied copy; and any command matching a `replay-skip:` pattern the
   plan declares in its Global Constraints. The expectation is the paragraph
   immediately following the fence when it begins with `Expected:`; a fence
   with no such paragraph is run anyway and its output recorded under "no
   stated expectation". A command whose output differs is `DIFFERS`, printed
   and counted, and never an exit code;
5. run every `O` needle against the applied tree and print every residual hit
   under a heading that names their count.

It never writes into the working tree. Neither a residual `O` hit nor a
`DIFFERS` fails the run: both are adjudicated by Sekkei, not decided by the
script.

- [ ] **Step 4: Run the tests and watch them pass**

````bash
mise x node@22 -- node --test skills/tanto/scripts/
````

Expected: every test passes, `fail 0`. Record the resolved Node version.

- [ ] **Step 5: Lint both paths**

````bash
./scripts/lint.sh skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js
````

Expected: exit 0, the JavaScript hook `Passed`, none `Failed`.

- [ ] **Step 6: Check the line endings, then commit**

````bash
git ls-files --eol skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js
git commit --only skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js -m "feat(tanto): passage-check replay reconstructs a plan against its merge base" -m "replay copies the base blobs to a temporary tree, applies each passage while asserting the old block occurs exactly once, re-runs every anchor against the applied copy and compares it with the stated after value - which a dry run that applies and then verifies can never test - runs the plan's commands beside their expectations while skipping any that invoke verify, and prints the residual hits of the plan's O needles without ruling on them (issue-88d3, issue-7481, issue-10bc)." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: `i/lf w/lf attr/text eol=lf` for both paths, then `1`.

**Done when:** the suite passes on Node 22; `replay` exits `0` on a plan whose
old passages each match once and whose anchors land on their `after:` values,
`1` when an occurrence count or an anchor disagrees, and `2`, with the
unresolvable ref named in the output, on an unresolvable `--base`; the applied
copy of a CRLF file reads back CRLF byte for byte; a residual `O` hit prints
under a count heading and does not fail the run; and a `verify` command in the
plan is reported as skipped.

---

### Task 3: `diff` and `verify`

**Batch:** A. **Blocks:** none. This task completes the instrument, and from
its commit the script can check a plan that carries passages end to end.

**Files:**

- Modify: `skills/tanto/scripts/passage-check.js` — add `diff` and `verify`.
- Modify (test): `skills/tanto/scripts/passage-check.test.js` — append this
  task's tests.

**Interfaces:**

- Consumes, from task 1: `normalize`, `parsePlan`, `main`, and `parsed.created`
  — the `created:` list is read from the plan and never inferred. From task 2:
  `replayPlan` is not called by either subcommand; `diff` needs only the plan
  and `git`, which is the property that makes it outlive the session that wrote
  the plan.
- Produces: `diffPlan(parsed, base, options)` →
  `{ ok, unaccountedAdded, unexplainedRemoved, exempt }` and
  `verifyTask(parsed, taskNumber, options)` →
  `{ ok, failures }`, `failures` carrying `{ code, id, message }` with `code`
  one of `'passage-absent'`, `'passage-repeated'`, `'anchor-after'`. Both go
  into `module.exports`.

- [ ] **Step 1: Append the failing tests**

Append to `skills/tanto/scripts/passage-check.test.js`.

````js
test('diff passes when every added line is text the plan quotes', () => {
  const repo = makeRepo({ 'tmp/fixture.md': 'alpha\nbeta\n' });
  fs.writeFileSync(path.join(repo.dir, 'tmp/fixture.md'), 'gamma\n', 'utf8');
  const result = runIn(repo.dir, ['diff', '--plan', writePlan(REPLACEMENT), '--base', repo.head]);
  assert.strictEqual(result.code, 0);
});

test('diff lists an added line the plan does not quote, and exits 1', () => {
  const repo = makeRepo({ 'tmp/fixture.md': 'alpha\nbeta\n' });
  fs.writeFileSync(path.join(repo.dir, 'tmp/fixture.md'), 'gamma\nepsilon\n', 'utf8');
  const result = runIn(repo.dir, ['diff', '--plan', writePlan(REPLACEMENT), '--base', repo.head]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /epsilon/);
});

test('diff exempts a created path and names it in the output', () => {
  const repo = makeRepo({ 'tmp/fixture.md': 'alpha\nbeta\n' });
  fs.writeFileSync(path.join(repo.dir, 'tmp/fixture.md'), 'gamma\n', 'utf8');
  fs.writeFileSync(path.join(repo.dir, 'tmp/made.md'), 'anything at all\n', 'utf8');
  repo.git('add', 'tmp/made.md');
  const lines = ['```text', 'created: tmp/made.md', '```'].concat(REPLACEMENT);
  const result = runIn(repo.dir, ['diff', '--plan', writePlan(lines), '--base', repo.head]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /1 path exempt as created/);
  assert.match(result.out, /tmp\/made\.md/);
});

test('diff strips CR before classifying an added line', () => {
  const repo = makeRepo({ 'tmp/fixture.md': 'alpha\nbeta\n' });
  fs.writeFileSync(path.join(repo.dir, 'tmp/fixture.md'), 'gamma\r\n', 'utf8');
  assert.strictEqual(runIn(repo.dir, ['diff', '--plan', writePlan(REPLACEMENT), '--base', repo.head]).code, 0);
});

test('diff reports a removed line that falls outside every fenced block', () => {
  const repo = makeRepo({ 'tmp/fixture.md': 'alpha\nbeta\nzeta\n' });
  fs.writeFileSync(path.join(repo.dir, 'tmp/fixture.md'), 'gamma\n', 'utf8');
  const result = runIn(repo.dir, ['diff', '--plan', writePlan(REPLACEMENT), '--base', repo.head]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /zeta/);
});

test('verify passes when a task new passage is present exactly once', () => {
  const repo = makeRepo({ 'tmp/fixture.md': 'alpha\nbeta\n' });
  fs.writeFileSync(path.join(repo.dir, 'tmp/fixture.md'), 'gamma\n', 'utf8');
  const result = runIn(repo.dir, ['verify', '--plan', writePlan(REPLACEMENT), '--task', '91']);
  assert.strictEqual(result.code, 0);
});

test('verify fails when a new passage is absent, and when it is present twice', () => {
  const repo = makeRepo({ 'tmp/fixture.md': 'alpha\nbeta\n' });
  const file = writePlan(REPLACEMENT);
  assert.strictEqual(runIn(repo.dir, ['verify', '--plan', file, '--task', '91']).code, 1);
  fs.writeFileSync(path.join(repo.dir, 'tmp/fixture.md'), 'gamma\ngamma\n', 'utf8');
  assert.strictEqual(runIn(repo.dir, ['verify', '--plan', file, '--task', '91']).code, 1);
});

test('verify checks a task anchor against its after value', () => {
  const repo = makeRepo({ 'tmp/fixture.md': 'alpha\n' });
  fs.writeFileSync(path.join(repo.dir, 'tmp/fixture.md'), 'alpha\ndelta\n', 'utf8');
  assert.strictEqual(runIn(repo.dir, ['verify', '--plan', writePlan(INSERTION), '--task', '92']).code, 0);
  const wrong = INSERTION.slice();
  wrong[2] = '**A92.1** `tmp/fixture.md` — `grep -c alpha tmp/fixture.md` — before: 1, after: 3';
  assert.strictEqual(runIn(repo.dir, ['verify', '--plan', writePlan(wrong), '--task', '92']).code, 1);
});

test('verify reports no passages for a task that touches only created paths', () => {
  const repo = makeRepo({ 'tmp/fixture.md': 'alpha\nbeta\n' });
  const lines = ['```text', 'created: tmp/made.md', '```', '', '### Task 94: only a created path', '', 'Nothing but a new file.'];
  const result = runIn(repo.dir, ['verify', '--plan', writePlan(lines), '--task', '94']);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /no passages/i);
});
````

- [ ] **Step 2: Run the tests and watch the new ones fail**

````bash
mise x node@22 -- node --test skills/tanto/scripts/
````

Expected: the task 1 and task 2 tests still pass; the nine new ones fail.

- [ ] **Step 3: Implement `diff` and `verify`**

Add both to `skills/tanto/scripts/passage-check.js`, against their rows in the
subcommand table and the exit-code table in "The instrument's specification"
above.

`diff` runs `git diff <base>`, strips CR from the output before classifying it,
and requires every added line outside a `created:` path to be text the plan
literally quotes; it lists the added lines that are not and the removed lines
that fall outside every fenced block. It names the exempted paths in its output
rather than passing them silently. It needs only the plan and `git`.

`verify` reads the **working tree**: each of task `N`'s new passages present
exactly once, and each of its anchors at its stated `after:` value. It takes no
`--base` and does no diffing — that is `diff`'s job at the boundary, and a
subcommand that did both would need a base ref its callers do not have. A task
that touches only created paths reports "no passages", which is a result and
not a failure.

- [ ] **Step 4: Run the tests and watch them pass**

````bash
mise x node@22 -- node --test skills/tanto/scripts/
````

Expected: every test passes, `fail 0`. Record the resolved Node version.

- [ ] **Step 5: Lint, check the line endings, and commit**

````bash
./scripts/lint.sh skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js
git ls-files --eol skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js
git commit --only skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js -m "feat(tanto): passage-check diff and verify close the alignment check" -m "diff classifies the merge-base diff from the other side: every added line outside a created path must be text the plan literally quotes, and every removed line must fall inside a fenced block. It needs only the plan and git, so unlike an application script written into a session's scratchpad it is still there at the last boundary, which is the boundary that most needs it. verify is what a task's Verify step invokes against the working tree (issue-7481, D-6)." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: exit 0 with the JavaScript hook `Passed`;
`i/lf w/lf attr/text eol=lf` for both paths; then `1`.

**Done when:** the whole suite passes on Node 22; `diff` exits `0` on a tree
whose added lines the plan quotes and `1` when one is unaccounted for or a
removed line falls outside every fence, naming the created paths it exempted;
`verify --task <N>` exits `0` when task `N`'s passages are each present once
and its anchors are at their `after:` values, and `1` otherwise.

---

### Task 4: the note that governs this plan's own verification

**Batch:** A. **Blocks:** P4.1, P4.2, P4.3, P4.4, P4.5.

This task edits the note that governs how a plan editing `skills/tanto/`
verifies itself, which design-4807 records as a legitimate but watchable
pattern: the warrant and the thing warranted arrive in one branch. Checks 1 and
2 gain the two paths task 1 created, with the counts they state; check 2's
extraction expression gains an alternative for `.js`, whose character class
admits `.` because `passage-check.test.js` carries one in its stem; and the
passage-plan list's replay entry stops describing a script in a session's
scratchpad.

**Files:**

- Modify: `docs/notes/tanto-consistency-checks.md` — five passages, all
  replacements.

**Interfaces:**

- Consumes, from tasks 1 to 3: the two created paths
  `skills/tanto/scripts/passage-check.js` and
  `skills/tanto/scripts/passage-check.test.js`, which must exist in the tree
  before this task's verification can pass, and the subcommand names `replay`
  and `diff`.
- Produces: nothing a later task consumes. `docs/notes/` is markdownlint-linted
  (it is not under either ignore), so the wrapped column of the note matters.

- [ ] **Step 1: Baseline the line endings**

````bash
git ls-files --eol docs/notes/tanto-consistency-checks.md
````

Expected: `i/lf`, `w/crlf`, `attr/text=auto`. Measured 2026-09-10. Write the
five passages with CRLF, the file's own ending.

- [ ] **Step 2: P4.1 — checks 1 and 2 list the two new paths**

**P4.1** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```text
  skills/tanto/templates/tanto.json 2>&1
```

**P4.1 →**

```text
  skills/tanto/templates/tanto.json \
  skills/tanto/scripts/passage-check.js \
  skills/tanto/scripts/passage-check.test.js 2>&1
```

- [ ] **Step 3: P4.2 — check 1's expected path count**

**P4.2** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```text
Expected: all seventeen paths listed, no `No such file or directory`.
```

**P4.2 →**

```text
Expected: all nineteen paths listed, no `No such file or directory`.
```

- [ ] **Step 4: P4.3 — check 2's extraction expression reaches a `.js` stem**

**P4.3** `docs/notes/tanto-consistency-checks.md` — replace exactly this 1 line

```text
grep -oh 'roles/[a-z]*\.md\|templates/[a-z-]*\.md\|templates/tanto\.json\|skills/tanto/[a-z/-]*\.md\|skills/tanto/[a-z/-]*\.json' \
```

**P4.3 →**

```text
grep -oh 'roles/[a-z]*\.md\|templates/[a-z-]*\.md\|templates/tanto\.json\|scripts/[a-z.-]*\.js\|skills/tanto/[a-z/-]*\.md\|skills/tanto/[a-z/-]*\.json' \
```

- [ ] **Step 5: P4.4 — check 2's expected `ok` lines**

**P4.4** `docs/notes/tanto-consistency-checks.md` — replace exactly these 10 lines

```text
Expected: fifteen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`,
`roles/kanri.md`, `roles/sekkei.md`, `templates/batch-prompt.md`,
`templates/batch-report.md`, `templates/bug-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/kanri-handover.md`, `templates/kanri.md`,
`templates/review-brief.md`, `templates/roster-archive.md`,
`templates/roster.md`, and `templates/tanto.json`, whose relative order for the
two roster paths is the locale's and is not part of this check —
and **no** `MISSING` line. A `MISSING` line is either a typo in the reference
or a file the plan forgot.
```

**P4.4 →**

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

- [ ] **Step 6: P4.5 — the passage-plan list's replay entry**

**P4.5** `docs/notes/tanto-consistency-checks.md` — replace exactly these 5 lines

```text
   **Prefer the second form, and treat the first as unavailable by default.**
   A plan that names the dry run's application script as its replay names a
   tool that lives in the drafting session's scratchpad: on the context-cost
   run that script was already gone by the final boundary, which is the
   boundary that most needs it. The second form needs only the plan and
```

**P4.5 →**

```text
   **Both forms are `skills/tanto/scripts/passage-check.js` now** — `replay`
   is the first and `diff` the second — and the script lives in the
   repository rather than in a session's scratchpad. That was the defect: on
   the context-cost run the dry run's application script was already gone by
   the final boundary, which is the boundary that most needs it (issue-7481).
   The second form needs only the plan and
```

- [ ] **Step 7: Verify the five passages**

````bash
grep -cF 'skills/tanto/scripts/passage-check.test.js 2>&1' docs/notes/tanto-consistency-checks.md
grep -cF 'skills/tanto/templates/tanto.json 2>&1' docs/notes/tanto-consistency-checks.md
grep -cF 'Expected: all nineteen paths listed, no `No such file or directory`.' docs/notes/tanto-consistency-checks.md
grep -cF 'Expected: all seventeen paths listed, no `No such file or directory`.' docs/notes/tanto-consistency-checks.md
grep -cF 'scripts/[a-z.-]*\.js' docs/notes/tanto-consistency-checks.md
grep -cF 'tanto\.json\|skills/tanto/' docs/notes/tanto-consistency-checks.md
grep -cF 'Expected: seventeen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`,' docs/notes/tanto-consistency-checks.md
grep -cF 'Expected: fifteen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`,' docs/notes/tanto-consistency-checks.md
grep -cF 'the final boundary, which is the boundary that most needs it (issue-7481).' docs/notes/tanto-consistency-checks.md
grep -cF '**Prefer the second form, and treat the first as unavailable by default.**' docs/notes/tanto-consistency-checks.md
````

Expected, line by line: `1`, `0`, `1`, `0`, `1`, `0`, `1`, `0`, `1`, `0`.
Baseline before the edit, measured 2026-09-10: `0`, `1`, `0`, `1`, `0`, `1`,
`0`, `1`, `0`, `1`. The sixth needle **spans the point P4.3 changes**. P4.3
inserts one alternative into check 2's extraction expression rather than
rewriting the line, so every substring that avoids the insertion point — the
line's `.json' \` tail among them — survives the edit and returns the same
count afterwards, which reads as "not fixed". This needle straddles
`templates/tanto\.json\|` and the alternative that used to follow it, so it
is the one that inverts.

- [ ] **Step 8: Run the note's own checks 1 and 2, as the note now states them**

Open `docs/notes/tanto-consistency-checks.md` and run its check 1 and its check
2 exactly as they are written there after this task's edits — they are the
commands P4.1 and P4.3 changed, and running them is what proves the five
passages landed together rather than some without the others.

Expected: check 1 lists nineteen paths with no `No such file or directory`;
check 2 prints seventeen `ok` lines and no `MISSING` line. Both counts are the
ones P4.2 and P4.4 now state. If check 2 prints `MISSING`, the extraction
expression or the reference list disagrees with the tree, and the fix is here
rather than in the tree.

- [ ] **Step 9: The diff of the note is exactly its five passages**

````bash
git diff "$(git merge-base main HEAD)" -- docs/notes/tanto-consistency-checks.md
````

Expected: hunks holding P4.1 to P4.5 and nothing else, read against the blocks
above and matched by text. No hunk count is stated: `git diff` coalesces
regions separated by six or fewer unchanged lines.

- [ ] **Step 10: Lint the changed path**

````bash
./scripts/lint.sh docs/notes/tanto-consistency-checks.md
````

Windows alternative: `scripts\lint.bat` with the same path. Expected: exit 0,
every hook `Passed` or `Skipped`, none `Failed`. markdownlint runs on this path
— `docs/notes/` is under neither ignore — so a long line or a bad fence fails
here.

- [ ] **Step 11: Commit**

````bash
git commit --only docs/notes/tanto-consistency-checks.md -m "docs(notes): the consistency checks reach the skill's first executable" -m "Checks 1 and 2 list scripts/passage-check.js and passage-check.test.js, and their expected counts move with them - nineteen paths, seventeen ok lines; check 2's extraction expression gains a .js alternative whose character class admits a dot, because passage-check.test.js carries one in its stem. The passage-plan list stops calling the reconstruct-and-compare check something a session writes for itself: both forms are the script now, and it lives in the repository rather than in a scratchpad that is gone by the final boundary (issue-7481)." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: `1`.

**Done when:** the ten greps of Step 7 read `1 0 1 0 1 0 1 0 1 0`, the note's
own checks 1 and 2 pass with nineteen paths and seventeen `ok` lines and no
`MISSING`, the note's diff against the merge base is exactly P4.1 to P4.5, and
lint is clean on the one changed path.

---
### Task 5: Sekkei's block conventions, and the verification bullet

**Batch:** B. **Blocks:** P5.1, P5.2.

**Files:**

- Modify: `skills/tanto/roles/sekkei.md` — two passages, both replacements.

**Interfaces:**

- Consumes, from tasks 1 to 3: the subcommand names `lint`, `replay`, `diff`
  and `verify`, and the invocation form
  `node "$TANTO/scripts/passage-check.js" <subcommand>` — `$TANTO` being the
  skill's own directory, as `SKILL.md` sets it — which P5.1 and P5.2 write
  into Sekkei's procedure as commands a future Sekkei will run.
- Produces, for tasks 6 to 14: the authoring rules those tasks are already
  written under — a block appears once and is cited by id; a count is written
  only where a command consumes it; the `O` blocks of task 14 are one per
  changed entity. P5.1 also fixes the id grammar `<task>.<n>` that every plan
  id in this document uses.
- `roles/sekkei.md` is markdownlint-linted: it is under neither ignore.

- [ ] **Step 1: Baseline the line endings**

````bash
git ls-files --eol skills/tanto/roles/sekkei.md
````

Expected: `i/lf`, `w/crlf`, `attr/text=auto`. Measured 2026-09-10. Write both
passages with CRLF.

- [ ] **Step 2: P5.1 — Step 3's block conventions**

**P5.1** `skills/tanto/roles/sekkei.md` — replace exactly these 4 lines

```text
A plan that carries passages rather than whole files wraps each new passage
at its destination file's column, chosen when the block is authored, and
states each passage's shape — a replacement of an old passage, or an
insertion next to an anchor that stays.
```

**P5.1 →**

```text
A plan that carries passages rather than whole files wraps each new passage
at its destination file's column, chosen when the block is authored, and
writes every block in the shape `scripts/passage-check.js` parses — `$TANTO`
being the skill's own directory, as `SKILL.md` sets it — so that the
plan is machine-checkable and not only readable:

- a replacement is `**P<task>.<n>** <path> — replace exactly these <N> lines`,
  the old block, then `**P<task>.<n> →**` and the new block; an insertion says
  `insert after these <N> lines` and its new block omits the anchor lines,
  because an insertion's anchor stays;
- an anchor step is
  `**A<task>.<n>** <path> — <command> — before: <v>, after: <v>`, both values
  stated always: an anchor check inverts only when the new passage wholly
  supersedes the needle, and when the needle is the passage's unchanged
  opening it still returns `1` after a correct edit;
- an old value the plan contradicts is
  `**O<task>.<n>** <needle> — <where it must be gone, or why it may stay>`,
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
```

- [ ] **Step 3: P5.2 — the "how a batch is verified" bullet**

**P5.2** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```text
- **how a batch is verified**. For a plan that ships Markdown, that section
  names lint on the changed paths by name, the content greps, a real YAML load
  of any frontmatter, and a JSON parse of any JSON the plan writes;
```

**P5.2 →**

```text
- **how a batch is verified**. For a plan that ships Markdown, that section
  names lint on the changed paths by name, the content greps, a real YAML load
  of any frontmatter, and a JSON parse of any JSON the plan writes; for a plan
  that ships code, the test command together with the runtime version it is
  pinned to, so that a version claim is a run and not an assertion; and for a
  plan that carries passages,
  `node "$TANTO/scripts/passage-check.js" diff` as the boundary check,
  which is what makes that check outlive the session that wrote it
  (issue-7481);
```

- [ ] **Step 4: Verify both passages**

````bash
grep -cF 'Each block appears **once**; a later task that needs one cites it by its id and' skills/tanto/roles/sekkei.md
grep -cF 'insertion next to an anchor that stays.' skills/tanto/roles/sekkei.md
grep -cF 'of any frontmatter, and a JSON parse of any JSON the plan writes; for a plan' skills/tanto/roles/sekkei.md
grep -c 'the plan writes;$' skills/tanto/roles/sekkei.md
````

Expected, line by line: `1`, `0`, `1`, `0`. Baseline before the edit, measured
2026-09-10: `0`, `1`, `0`, `1`. The fourth needle is anchored with `$` rather
than matched literally: P5.2 keeps its old first three words and only continues
the sentence, so the old line is a prefix of the new one and only the end of
line decides.

- [ ] **Step 5: The diff of the file is exactly its two passages**

````bash
git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/sekkei.md
````

Expected: hunks holding P5.1 and P5.2 and nothing else, read against the blocks
above and matched by text.

- [ ] **Step 6: Lint the changed path**

````bash
./scripts/lint.sh skills/tanto/roles/sekkei.md
````

Expected: exit 0, every hook `Passed` or `Skipped`, none `Failed`.

- [ ] **Step 7: Commit**

````bash
git commit --only skills/tanto/roles/sekkei.md -m "docs(tanto): Sekkei writes a passage plan in the shape the script parses" -m "Step 3's block conventions become the grammar passage-check.js reads: the lead line of each shape, the anchor step with both of its values stated always, and the O block written one per changed entity, before the passages, swept over the untouched files first and run as each needle is written, because an O needle that wraps in its target returns zero and zero reads as already gone. A block appears once and a later task cites it by id; a count is written only where a command consumes it; a Verify step is one invocation. The verification bullet gains the two cases a Markdown-only plan never had: a test command with the runtime version it is pinned to, and diff as the boundary check that outlives the session that wrote it (issue-f813, issue-10bc, issue-7281, issue-7481)." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: `1`.

**Done when:** the four checks of Step 4 read `1 0 1 0`, the file's diff against
the merge base is exactly P5.1 and P5.2, and lint is clean on the one changed
path.

---

### Task 6: Sekkei's Step 4 — the dry run is the script

**Batch:** B. **Blocks:** P6.1.

Step 4's items 2 to 5 are unchanged, and this task does not touch them. The
reviewer still reads the dry-run report and spot-checks rather than re-running
the set, and the forward-reference sweep of item 3 still decides whether a
boundary the plan calls safe really is.

**Files:**

- Modify: `skills/tanto/roles/sekkei.md` — one passage, a replacement.

**Interfaces:**

- Consumes, from task 5: nothing textually — P6.1's old passage does not
  overlap P5.1's or P5.2's, and the two tasks may be applied in either order.
  From tasks 1 to 3: `lint` and `replay`, the two commands P6.1 names.
- Produces: nothing a later task consumes.

- [ ] **Step 1: Confirm the line endings are still as task 5 left them**

````bash
git ls-files --eol skills/tanto/roles/sekkei.md
````

Expected: `i/lf`, `w/crlf`, `attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: P6.1 — Step 4 item 1**

**P6.1** `skills/tanto/roles/sekkei.md` — replace exactly these 6 lines

```text
1. Run every verification command the plan states, once, on this machine, on
   scratch copies with the passages applied, and write
   `.superpowers/sdd/<topic>/plan-dryrun.md`: the application script's path,
   then each command, its output, and the plan's expectation. A command that
   has never been run is a placeholder in a command's shape; fix the plan,
   not the expectation.
```

**P6.1 →**

```text
1. Run `node "$TANTO/scripts/passage-check.js" lint --plan <path>`, then the
   same script's `replay --plan <path> --base <merge base>`, and write
   `.superpowers/sdd/<topic>/plan-dryrun.md` from what they print: the two
   commands, each one's output, and your ruling on every failure. `lint`
   checks the plan against itself — the lead lines, each `N` against its
   block's real line count, the ids' uniqueness, that every cited id exists,
   that every anchor states both of its values. `replay` applies the passages
   to copies of the merge-base blobs, asserting that each old passage occurs
   exactly once; re-runs each anchor against the applied copy and compares the
   result with its stated `after:` value, which a dry run that applies and
   then verifies can never test (issue-88d3); runs the plan's commands in
   order with each output beside its expectation; and prints every residual
   hit of the plan's `O` needles. A command that has never been run is a
   placeholder in a command's shape; fix the plan, not the expectation. The
   script prints failures and does not interpret them: deciding which are plan
   defects and which are artifacts of this machine is yours, and stays yours.
```

- [ ] **Step 3: Verify the passage**

````bash
grep -cF '1. Run `node "$TANTO/scripts/passage-check.js" lint --plan <path>`, then the' skills/tanto/roles/sekkei.md
grep -cF '1. Run every verification command the plan states, once, on this machine, on' skills/tanto/roles/sekkei.md
grep -cF "application script's path" skills/tanto/roles/sekkei.md
````

Expected, line by line: `1`, `0`, `0`. Baseline before the edit, measured
2026-09-10: `0`, `1`, `1`. The first needle is P6.1's whole new first line: it
carries no apostrophe, so nothing has to be cut short, and single quotes keep
`$TANTO` literal and stop the backticked path from being read as a command
substitution. The third is the `O` needle of the spec's old-value table for
this file, carried in task 14 as O14.8 and re-run here because this is the
task that
removes its only hit.

- [ ] **Step 4: The diff of the file is its three passages so far**

````bash
git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/sekkei.md
````

Expected: hunks holding P5.1, P5.2 and P6.1 and nothing else.

- [ ] **Step 5: Lint the changed path**

````bash
./scripts/lint.sh skills/tanto/roles/sekkei.md
````

Expected: exit 0, none `Failed`.

- [ ] **Step 6: Commit**

````bash
git commit --only skills/tanto/roles/sekkei.md -m "docs(tanto): Sekkei's dry run is lint and replay, not a scratchpad script" -m "Step 4 item 1 becomes two invocations of skills/tanto/scripts/passage-check.js and a report written from what they print. lint checks the plan against itself; replay applies the passages to copies of the merge-base blobs, asserts each old passage occurs exactly once, re-runs each anchor against the applied copy and compares it with the stated after value - which a dry run that applies and then verifies can never test - and prints the residual O hits. The script prints failures and does not interpret them: which are plan defects and which are artifacts of the machine stays Sekkei's ruling (issue-7481, issue-88d3, issue-10bc)." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: `1`.

**Done when:** the three checks of Step 3 read `1 0 0`, the file's diff against
the merge base is exactly P5.1, P5.2 and P6.1, and lint is clean.

---

### Task 7: the executing seats — Jisso's boundary check and dispatch, and the whole-branch reviewer

**Batch:** B. **Blocks:** A7.1, P7.2, A7.3, P7.4, P7.5, A7.6, P7.7.

Two of issue-7481's four seats are here. The whole-branch review is Kanri's
dispatch, not Jisso's, which is why the instrument for it lands in
`roles/kanri.md` alongside Jisso's three.

**Apply P7.2 before P7.4.** Both insert into the same neighbourhood of
`roles/jisso.md`: P7.2's anchor is the two lines that end the paragraph above
the `## Fix rounds and the Kaiseki trigger` heading, and P7.4 inserts a whole
new section **before** that heading. P7.2 first puts its text above P7.4's
heading, which is where it belongs. P7.4 is the plan's one `insert before`
block: a section that must precede an existing heading has no other anchor than
that heading.

**Files:**

- Modify: `skills/tanto/roles/jisso.md` — three passages, P7.2 and P7.4
  insertions and P7.5 a replacement, with anchors A7.1 and A7.3.
- Modify: `skills/tanto/roles/kanri.md` — one passage, P7.7, an insertion, with
  anchor A7.6.

**Interfaces:**

- Consumes, from tasks 1 to 3: `diff` and `replay`, the two subcommands these
  passages name, and the invocation form with `--plan` and `--base`. From task
  5: P5.2's verification bullet, which is Sekkei's side of the same rule that
  P7.2 puts in Jisso's hands.
- Produces, for task 8: the fact that `roles/jisso.md` and `roles/kanri.md`
  name the script's subcommands, which is what P8.2's new `SKILL.md` paragraph
  asserts — this task is why that assertion is true of the tree.
- Both files are markdownlint-linted.

- [ ] **Step 1: Baseline the line endings**

````bash
git ls-files --eol skills/tanto/roles/jisso.md skills/tanto/roles/kanri.md
````

Expected for both: `i/lf`, `w/crlf`, `attr/text=auto`. Measured 2026-09-10.

- [ ] **Step 2: A7.1 — the anchor for P7.2, before the edit**

**A7.1** `skills/tanto/roles/jisso.md` — `grep -c 'because the output is the deliverable.' skills/tanto/roles/jisso.md` — before: 1, after: 1

````bash
grep -c 'because the output is the deliverable.' skills/tanto/roles/jisso.md
````

Expected: `1`, the `before:` value. This anchor does not invert: P7.2 is an
insertion and its anchor lines stay.

- [ ] **Step 3: P7.2 — Jisso's boundary check**

**P7.2** `skills/tanto/roles/jisso.md` — insert after these 2 lines

```text
inverts the reviewer's standing instruction: tell the reviewer to re-run the
checks rather than trust the report, because the output is the deliverable.
```

**P7.2 →**

```text

For a plan that carries passages, run
`node "$TANTO/scripts/passage-check.js" diff --plan <path> --base <merge base>`
at every batch boundary, before you report. It prints the added lines of the
merge-base diff that the plan does not literally quote, and the removed lines
that fall outside any fenced block; both sets must be empty, or accounted for
in your report. It needs only the plan and `git`, so unlike an application
script written into some other session's scratchpad it is still there at the
last boundary — the one that most needs it (issue-7481).
```

- [ ] **Step 4: A7.3 — the anchor for P7.4, before the edit**

**A7.3** `skills/tanto/roles/jisso.md` — `grep -c '^## Fix rounds and the Kaiseki trigger$' skills/tanto/roles/jisso.md` — before: 1, after: 1

````bash
grep -c '^## Fix rounds and the Kaiseki trigger$' skills/tanto/roles/jisso.md
````

Expected: `1`, the `before:` value.

- [ ] **Step 5: P7.4 — a measurement task's dispatch**

This is an **insert before**: the new section goes above the anchor heading,
which stays where it is and is not repeated in the new block.

**P7.4** `skills/tanto/roles/jisso.md` — insert before these 1 lines

```text
## Fix rounds and the Kaiseki trigger
```

**P7.4 →**

```text
## A measurement task's dispatch

A task whose deliverable is a **measurement** — run a tool, record what it did
— has a failure mode that a task which only produces files does not: the
implementer can stop running the tool and start predicting it, and the
prediction looks exactly like a real run, because it is built from the same
brief the reviewer holds. Say this in the dispatch, in so many words:

- every byte written is either what the tool produced or a documented fallback
  applied from the plan's own blocks, and nothing is written from what the tool
  was expected to produce;
- a fallback is a sanctioned outcome, to be named in the report — never
  something to be ashamed of or to paper over;
- "execute the procedure directly", where the plan offers it as a fallback
  route, means **carry it out against the tree**, not predict its output.

Read the report back for the same thing. A measurement that contradicts the
brief's prediction somewhere is what a real run usually looks like; one that
confirms every expectation deserves a second look rather than a faster
approval. Neither half is enforcement — an implementer can always lie — but the
first removes the ambiguity that made simulating look like compliance, and the
second gives the reader something to check other than the report's own
confidence (issue-f2ec).

```

- [ ] **Step 6: P7.5 — the test-suite premise**

**P7.5** `skills/tanto/roles/jisso.md` — replace exactly these 3 lines

```text
subagent-driven-development's dispatch templates assume a test suite. A plan
that produces Markdown — a skill, a document set, a template pack — has none,
and its equivalents differ in kind. Substitute these, and say so in every
```

**P7.5 →**

```text
subagent-driven-development's dispatch templates assume a test suite. A plan
that produces Markdown — a skill, a document set, a template pack — usually has
none, and its equivalents differ in kind. A plan that also ships code has a real
one, and then both apply: the suite for the code, on the runtime version the
plan pins, and the substitutes below for everything else. Substitute these, and
say so in every
```

- [ ] **Step 7: A7.6 — the anchor for P7.7, before the edit**

**A7.6** `skills/tanto/roles/kanri.md` — `grep -cF 'commissions its own final review.' skills/tanto/roles/kanri.md` — before: 1, after: 1

````bash
grep -cF 'commissions its own final review.' skills/tanto/roles/kanri.md
````

Expected: `1`, the `before:` value.

- [ ] **Step 8: P7.7 — the whole-branch reviewer's command**

**P7.7** `skills/tanto/roles/kanri.md` — insert after these 2 lines

```text
   commissions its own final review. Anything else you dispatch takes
   `subagents.default`.
```

**P7.7 →**

```text

   For a plan that carries passages, give that reviewer the plan, the merge
   base, and one command —
   `node "$TANTO/scripts/passage-check.js" replay --plan <path> --base <merge base>`
   — so
   that the replay it would otherwise rebuild by hand is the instrument
   Sekkei and Jisso already ran (issue-7481). Its report says what the replay
   printed, and the review seat goes to the cross-file contracts and the
   human-facing questions, which no script judges.
```

- [ ] **Step 9: Verify the four passages and the three anchors**

````bash
grep -cF '`node "$TANTO/scripts/passage-check.js" diff --plan <path> --base <merge base>`' skills/tanto/roles/jisso.md
grep -cF 'approval. Neither half is enforcement — an implementer can always lie — but the' skills/tanto/roles/jisso.md
grep -cF 'none, and its equivalents differ in kind. A plan that also ships code has a real' skills/tanto/roles/jisso.md
grep -cF 'that produces Markdown — a skill, a document set, a template pack — has none,' skills/tanto/roles/jisso.md
grep -cF '`node "$TANTO/scripts/passage-check.js" replay --plan <path> --base <merge base>`' skills/tanto/roles/kanri.md
grep -c 'because the output is the deliverable.' skills/tanto/roles/jisso.md
grep -c '^## Fix rounds and the Kaiseki trigger$' skills/tanto/roles/jisso.md
grep -cF 'commissions its own final review.' skills/tanto/roles/kanri.md
grep -c '^## A measurement task.s dispatch$' skills/tanto/roles/jisso.md
````

Expected, line by line: `1`, `1`, `1`, `0`, `1`, then `1`, `1`, `1` — the three
anchors at their stated `after:` values, each unchanged because all three
passages here are insertions or leave the needle alone — and `1` for the new
section's own heading. Baseline before the edits, measured 2026-09-10: `0`,
`0`, `0`, `1`, `0`, `1`, `1`, `1`, `0`. The last needle spells the apostrophe
as `.` so that the pattern needs no quoting gymnastics.

- [ ] **Step 10: P7.4's section sits above the anchor heading, not below it**

````bash
grep -n '^## A measurement task.s dispatch$' skills/tanto/roles/jisso.md
grep -n '^## Fix rounds and the Kaiseki trigger$' skills/tanto/roles/jisso.md
````

Expected: two line numbers, the first smaller than the second. This is the check
the direction word in P7.4's lead is for; `insert after` would have put the new
section below the heading and every content grep would still have passed.

- [ ] **Step 11: The diff of each file is exactly its passages**

````bash
for f in skills/tanto/roles/jisso.md skills/tanto/roles/kanri.md; do
  echo "== $f"
  git diff "$(git merge-base main HEAD)" -- "$f"
done
````

Expected: for `roles/jisso.md`, hunks holding P7.2, P7.4 and P7.5 and nothing
else; for `roles/kanri.md`, a hunk holding P7.7 and nothing else. Every hunk is
an addition except P7.5's, which is a replacement.

- [ ] **Step 12: Lint both changed paths**

````bash
./scripts/lint.sh skills/tanto/roles/jisso.md skills/tanto/roles/kanri.md
````

Expected: exit 0, none `Failed`. markdownlint runs on both.

- [ ] **Step 13: Commit**

````bash
git commit --only skills/tanto/roles/jisso.md skills/tanto/roles/kanri.md -m "docs(tanto): the executing seats run the instrument, and a measurement is dispatched as one" -m "Jisso runs passage-check.js diff at every batch boundary before reporting, and Kanri gives the whole-branch reviewer the plan, the merge base and one replay command, so the review seat goes to the cross-file contracts and the human-facing questions instead of a reconstruction rebuilt by hand. A new section says how a measurement task is dispatched and how its report is read back: every byte written is what the tool produced or a documented fallback, a fallback is a sanctioned outcome to be named, and a report that confirms every expectation deserves a second look rather than a faster approval. The verification section stops asserting that a tanto plan has no test suite (issue-7481, issue-f2ec)." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: `1`.

**Done when:** the nine checks of Step 9 read `1 1 1 0 1 1 1 1 1`, P7.4's
section precedes the anchor heading, both files' diffs against the merge base
are exactly their passages, and lint is clean on both changed paths.

---

### Task 8: the skill says it ships an executable

**Batch:** B. **Blocks:** A8.1, P8.2, A8.3, P8.4, A8.5, P8.6.

P8.2's paragraph forward-references `roles/sekkei.md`, `roles/jisso.md` and the
whole-branch reviewer, which is why it lands with them in batch B rather than
beside the script in batch A: until tasks 5 to 7 are in the tree it would be
asserting a capability the tree does not have.

**Files:**

- Modify: `skills/tanto/SKILL.md` — one passage, P8.2, an insertion, with
  anchor A8.1.
- Modify: `skills/tanto/README.md` — two passages, P8.4 and P8.6, both
  insertions.

**Interfaces:**

- Consumes, from tasks 1 to 3: the two created paths and the fact that the
  tests run under `node --test`. From tasks 5 to 7: the sentences in
  `roles/sekkei.md` and `roles/jisso.md` that name the subcommands, which is
  what P8.2's last clause asserts.
- Produces: nothing a later task consumes.
- Both files are markdownlint-linted.

**On the two README insertions:** A8.3 and A8.5 are their anchor steps, added
to the spec after the plan drafter ran `lint`'s rule against it and found the
spec violating its own grammar — the rule that every insertion carries an
anchor was written after those two blocks and never applied back to them. Both
needles are backtick-free, as an anchor needle must be. Step 5 also pins both
insertion points by line number, which the anchors do not do.

- [ ] **Step 1: Baseline the line endings**

````bash
git ls-files --eol skills/tanto/SKILL.md skills/tanto/README.md
````

Expected for both: `i/lf`, `w/crlf`, `attr/text=auto`. Measured 2026-09-10.

- [ ] **Step 2: A8.1 — the anchor for P8.2, before the edit**

**A8.1** `skills/tanto/SKILL.md` — `grep -cF 'Templates are copied and filled, never restated in prose.' skills/tanto/SKILL.md` — before: 1, after: 1

````bash
grep -cF 'Templates are copied and filled, never restated in prose.' skills/tanto/SKILL.md
````

Expected: `1`, the `before:` value. The needle carries no backtick on purpose:
an anchor needle is written inside an inline code span, and a backtick inside
one ends the span and truncates the command a parser extracts.

- [ ] **Step 3: P8.2 — `SKILL.md` says the skill ships one executable**

**P8.2** `skills/tanto/SKILL.md` — insert after these 1 lines

```text
`templates/review-brief.md`, and `templates/tanto.json`.
```

**P8.2 →**

```text

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
```

- [ ] **Step 4: P8.4 and P8.6 — the README's layout and prerequisites**

**A8.3** `skills/tanto/README.md` — `grep -cF 'expected-model defaults).' skills/tanto/README.md` — before: 1, after: 1

**P8.4** `skills/tanto/README.md` — insert after these 5 lines

```text
- `templates/` — copy-and-fill skeletons: `roster.md`, `roster-archive.md`,
  `kanri.md` (the conductor ledger), `kanri-handover.md`, `bug-report.md`,
  `batch-prompt.md`, `batch-report.md`, `kaiseki-brief.md`,
  `kaiseki-report.md`, `review-brief.md`, and `tanto.json` (the built-in
  expected-model defaults).
```

**P8.4 →**

```text
- `scripts/passage-check.js` — the instrument a plan that carries passages
  checks itself with, and `scripts/passage-check.test.js` beside it. Node, no
  dependencies, invoked as `node <path>`.
```

**A8.5** `skills/tanto/README.md` — `grep -cF 'is not host-agnostic and does not run on other Agent' skills/tanto/README.md` — before: 1, after: 1

**P8.6** `skills/tanto/README.md` — insert after these 4 lines

```text
- **Claude Code.** `tanto` needs `ListAgents` to see the live sessions and
  `SendMessage` to address them by name. Unlike `kisou`, `shoroku`, and
  `wayaku`, it is not host-agnostic and does not run on other Agent Skills
  hosts.
```

**P8.6 →**

```text
- **Node 22 or newer on `PATH`**, for `scripts/passage-check.js`. Only a plan
  that carries passages needs it, and only at the moments that check such a
  plan; everything else in the skill is Markdown. Claude Code is itself a Node
  application, and the first-party skills assume `node` the same way.
```

- [ ] **Step 5: Verify the three passages, the three anchors, and all three insertion points**

````bash
grep -cF 'The skill also ships one executable, `scripts/passage-check.js`: the instrument' skills/tanto/SKILL.md
grep -cF 'Templates are copied and filled, never restated in prose.' skills/tanto/SKILL.md
grep -cF 'expected-model defaults).' skills/tanto/README.md
grep -cF 'is not host-agnostic and does not run on other Agent' skills/tanto/README.md
grep -cF -- '- `scripts/passage-check.js` — the instrument a plan that carries passages' skills/tanto/README.md
grep -cF -- '- **Node 22 or newer on `PATH`**, for `scripts/passage-check.js`. Only a plan' skills/tanto/README.md
grep -nF '`templates/review-brief.md`, and `templates/tanto.json`.' skills/tanto/SKILL.md
grep -nF 'The skill also ships one executable, `scripts/passage-check.js`: the instrument' skills/tanto/SKILL.md
grep -nF 'expected-model defaults).' skills/tanto/README.md
grep -nF -- '- `scripts/passage-check.js` — the instrument a plan that carries passages' skills/tanto/README.md
grep -nF 'is not host-agnostic and does not run on other Agent' skills/tanto/README.md
grep -nF -- '- **Node 22 or newer on `PATH`**, for `scripts/passage-check.js`. Only a plan' skills/tanto/README.md
grep -cF 'There are eleven' skills/tanto/SKILL.md
````

Expected: `1`, then `1`, `1`, `1` — P8.2 present, and A8.1, A8.3 and A8.5 at
their stated `after:` values — then `1`, `1` for the two README bullets. The
six `grep -n` lines then print line numbers in three pairs, and **the three
pairs have different offsets**, so a pair is read against its own offset and
not against a blanket rule. P8.2's paragraph lands **two** lines after
`` `templates/review-brief.md`, and `templates/tanto.json`. ``, which is `+2`,
because P8.2's new block opens with a blank line — this is the pair that pins
where the SKILL.md insertion went, which its anchor at `before: 1, after: 1`
cannot do. P8.4's bullet lands on the line immediately after
`expected-model defaults).`, which is `+1`, because that needle is the last
line of A8.3's five-line anchor block. P8.6's bullet lands **two** lines after
the host-agnostic line, `+2`, because A8.5's needle is the *third* line of a
four-line block and the insertion goes after the fourth. A blanket "+1" here
was wrong and the dry run measured it. Neither README block opens with a blank line, and neither list
separates its items with one. The last check reads `1`: the templates count is
unchanged, because the executable is not a template and P8.2 adds it in a
paragraph of its own rather than to that list — it is **recorded as context,
not as a stop condition**. Baseline before the edits, measured 2026-09-10:
`0`, `1`, `1`, `1`, `0`, `0`, then the three insertion-point line numbers alone
(`422:`, `102:` and `41:`, the new text absent in all three), and `1`.

- [ ] **Step 6: The diff of each file is exactly its passages**

````bash
for f in skills/tanto/SKILL.md skills/tanto/README.md; do
  echo "== $f"
  git diff "$(git merge-base main HEAD)" -- "$f"
done
````

Expected: for `SKILL.md`, one hunk holding P8.2, an addition; for `README.md`,
hunks holding P8.4 and P8.6, both additions. No removed line in either file.

- [ ] **Step 7: Lint both changed paths**

````bash
./scripts/lint.sh skills/tanto/SKILL.md skills/tanto/README.md
````

Expected: exit 0, none `Failed`.

- [ ] **Step 8: Commit**

````bash
git commit --only skills/tanto/SKILL.md skills/tanto/README.md -m "docs(tanto): the skill ships one executable, and says so" -m "SKILL.md gains a paragraph naming scripts/passage-check.js as the instrument a plan that carries passages checks itself with - run by Sekkei in place of an agent dry run, by Jisso at every batch boundary, and by the whole-branch reviewer - in a paragraph of its own, because the executable is not a template and the templates count does not move. The README's layout list gains the script and its tests, and its prerequisites gain Node 22 or newer on PATH, which only a plan that carries passages needs." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: `1`.

**Done when:** the checks of Step 5 hold, each of the three insertions sits at
its own stated offset below its insertion point — `+2`, `+1`, `+2` — neither
file's diff against the merge base removes a line, and lint is clean on both
changed paths.

---
### Task 9: the handover, whole

**Batch:** C. **Blocks:** P9.1, P9.2, P9.3, P9.4, P9.5, P9.6, P9.7, P9.8.

This is the largest task in the plan by block count, at eight blocks, and it is
one task on purpose. Splitting it would put P9.3's "run the Handover section" in
the tree a boundary before P9.4 and P9.5 fix what that section says at a close,
and would leave `templates/kanri-handover.md` and `templates/roster.md`
describing a trigger set and an archive purpose that `roles/kanri.md` no longer
has. Every cross-file statement of one rule moves together.

The rule itself: decision-b6cb makes the plan close the third and ordinary
handover trigger — without a threshold and without asking — and req-04f5's
residency bullet says whatever resets a resident session's cost is a planned
step and never a question put to the human. The procedure the trigger routes
into was written for two cases, and two of its steps say the wrong thing at a
close: step 1 says the exit shoroku is already done, which is true only at a
batch boundary, and step 3 overwrites the ledger's Progress line with "handover
written" — the very line P9.3's delete-table row keys on.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — six passages, all replacements:
  P9.1, P9.2, P9.3, P9.4, P9.5, P9.6.
- Modify: `skills/tanto/templates/kanri-handover.md` — one passage, P9.7.
- Modify: `skills/tanto/templates/roster.md` — one passage, P9.8.

**Interfaces:**

- Consumes: nothing from an earlier task. This task's blocks do not overlap
  P7.7's insertion into the same file, which lands in a different section.
- Produces, for task 10: nothing textual — task 10's `roles/kanri.md` passages
  are in the exit-shoroku section, which none of these eight touch. For task
  11: P11.2 replaces the residency paragraph P9.1 and P9.3 refer to as "the
  Handover section"; the two are in different sections of the same file and may
  be applied in either order.
- `templates/kanri-handover.md` and `templates/roster.md` are **markdownlint-
  ignored** under `skills/**/templates/**`; the hooks that decide their lint
  step are trailing whitespace, end-of-file, and mixed line ending. Their long
  lines are by design and are never wrapped. `roles/kanri.md` is linted
  normally.

- [ ] **Step 1: Baseline the line endings**

````bash
git ls-files --eol skills/tanto/roles/kanri.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/roster.md
````

Expected for all three: `i/lf`, `w/crlf`, `attr/text=auto`. Measured
2026-09-10. Write every passage with CRLF.

- [ ] **Step 2: P9.1 — the trigger gains the plan close**

**P9.1** `skills/tanto/roles/kanri.md` — replace exactly these 26 lines

```text
### The trigger

Two signals fire a handover. Check them at every boundary: at loop step 6 while
a plan is in flight, and, between plans, at the start of every turn you get — a
message, or the human speaking. Run the self-check of `SKILL.md`'s Resuming at
the same points — one `ListAgents`; a name that is not your row's means you
were resumed, and the roster's first row is rewritten before anything else.

1. **The human's word.** Always, and it overrides the residency line.
2. **A compaction noticed.** Your context now begins with a summary of earlier
   conversation instead of the conversation itself, or a ruling the ledger
   holds is one you do not remember making. State lives in files, so a
   compaction loses nothing the successor cannot read back; it is the harness's
   own signal that the session has grown long, and it is the one signal a
   session can see for itself.

Not the `tokens left` figure the harness prints in its reminders, whose
unit is not documented as the context window and whose presence is not
guaranteed; not a batch or plan count, for which the data points are still
few; and not a threshold on the reading, because none has been chosen. At
every check take your own reading (`SKILL.md`, "The transcript reading")
and rewrite your Residency row with it: a compactions figure of `1` where
you noticed none is the second signal, seen in a file, and counts as
noticed. The Residency rows, and the archive's rows across runs, are the
data a threshold on cost will be chosen from, by an ADR, once enough
sessions have ended (issue-40ed).
```

**P9.1 →**

```text
### The trigger

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
2. **The human's word.** Always, and at any boundary.
3. **A compaction noticed.** Your context now begins with a summary of earlier
   conversation instead of the conversation itself, or a ruling the ledger
   holds is one you do not remember making. State lives in files, so a
   compaction loses nothing the successor cannot read back; it is the harness's
   own signal that the session has grown long, and it is the one signal a
   session can see for itself.

Signal 3 is the mid-plan case; signal 2 is any time at all, and a human who
says "continue" at a plan close declines that close's handover the way the
Handover section already describes. Not the `tokens left` figure the
harness prints in its reminders, whose unit is not documented as the context
window and whose presence is not guaranteed; and not a threshold on the
reading, because the plan close arrives first in practice and no number was
needed. At every check take your own reading (`SKILL.md`, "The transcript
reading") and rewrite your Residency row with it: a compactions figure of `1`
where you noticed none is signal 3, seen in a file, and counts as noticed. The
Residency rows, and the archive's rows across runs, are the data a threshold
for **replacing a peer** will be chosen from, by an ADR, once enough sessions
have ended (issue-40ed's other half; its handover half closed with
decision-b6cb).
```

- [ ] **Step 3: P9.2 — the residency line at a plan close**

The two-line code block below this paragraph in the file is **unchanged**: both
forms survive, and only which one a plan close prints is fixed. Do not touch
it.

**P9.2** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
At every plan close, and whenever the human asks, print one of two lines to the
human. The `[<ref>]` is the identity; the human copies the bare name into the
next `/tanto <role> <name>`.
```

**P9.2 →**

```text
At every plan close, and whenever the human asks, print one of two lines to the
human. At a plan close it is always the second, because the close is itself a
handover trigger; "Kanri stays" is only ever the answer to the human's own
mid-plan question. The `[<ref>]` is the identity; the human copies the bare
name into the next `/tanto <role> <name>`.
```

- [ ] **Step 4: P9.3 — the plan-close row of the delete table**

**P9.3** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
| Jisso is deleted and the ledger's Progress line says closed | this plan is closed; Kanri stays, prints the residency line, marks `dead` the rows of the sessions deleted at this close, moves the dead, replaced, and refused rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet — fills the ledger's Measurements fixed row, and waits for the next topic |
```

**P9.3 →**

```text
| Jisso is deleted and the ledger's Progress line says closed | this plan is closed; mark `dead` the rows of the sessions deleted at this close, move the dead, replaced, and refused rows with their last readings and this plan's Events lines to `roster-archive.md` — from `templates/roster-archive.md` when the file does not exist yet, fill the ledger's Measurements fixed row, and then hand over: the close is a handover trigger, so run the Handover section rather than wait for the next topic (decision-b6cb) |
```

- [ ] **Step 5: P9.4 — the handover procedure's step 1**

**P9.4** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

```text
1. **Exit shoroku first** — the Kanri case under "Exit shoroku": propose to
   yourself from the ledger and the roster, not from recollection, escalate to
   the human, write, lint, commit once, and mark the `S-n` rows written. What
   you cannot reconstruct goes into the handover file's "Not reconstructed"
   section. In a plan this step is loop step 6's proposal and step 7's slot (b)
   commit, already done when the window reaches this list; between plans it is
   one act and the commit lands on `main`.
```

**P9.4 →**

```text
1. **Exit shoroku first** — the Kanri case under "Exit shoroku": propose to
   yourself from the ledger and the roster, not from recollection, escalate to
   the human, write, lint, commit once, and mark the `S-n` rows written. What
   you cannot reconstruct goes into the handover file's "Not reconstructed"
   section. At a **batch boundary** this step is loop step 6's proposal and
   step 7's slot (b) commit, already done when the window reaches this list. At
   a **plan close** it is a fresh act, run after T2, the merge decision, the
   peers' deletion and the archive move, and its commit lands on the plan's
   branch (decision-b6cb). **Between plans** it is one act too, and the commit
   lands on `main`.
```

- [ ] **Step 6: P9.5 — the handover procedure's step 3**

**P9.5** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
3. **In a plan**, set the ledger's Progress line to "handover written".
   **Between plans**, there is no ledger, so write "handover written by
   `<name> [<ref>]`" as a roster Events line instead.
```

**P9.5 →**

```text
3. **At a batch boundary**, set the ledger's Progress line to "handover
   written". **At a plan close** that line already says "closed", which the
   delete table's row keys on, so leave it and record "handover written by
   `<name> [<ref>]`" as a roster Events line. **Between plans** there is no
   ledger, and that Events line is the only record.
```

- [ ] **Step 7: P9.6 — which procedure follows**

**P9.6** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
Which of the two procedures follows is decided by whether a ledger is open.
```

**P9.6 →**

```text
Which procedure follows is decided by whether a ledger is open. A plan close
has one open until you close it, so it takes the in-plan procedure with the two
exceptions steps 1 and 3 name.
```

- [ ] **Step 8: P9.7 — the handover file's trigger blank**

**P9.7** `skills/tanto/templates/kanri-handover.md` — replace exactly this 1 line

```text
<The trigger that fired — the human's word, or a compaction noticed — and when.>
```

**P9.7 →**

```text
<The trigger that fired — the plan close, the human's word, or a compaction noticed — and when.>
```

- [ ] **Step 9: P9.8 — what the archive's rows feed**

**P9.8** `skills/tanto/templates/roster.md` — replace exactly these 2 lines

```text
above, and it is the archive's rows across runs that a threshold for the
handover or a replacement will be read from (issue-40ed).
```

**P9.8 →**

```text
above, and it is the archive's rows across runs that a threshold for replacing
a peer will be read from (issue-40ed's other half; the handover half closed
with decision-b6cb, which made the plan close the ordinary trigger).
```

- [ ] **Step 10: Verify the eight passages**

````bash
grep -cF '3. **A compaction noticed.** Your context now begins with a summary of earlier' skills/tanto/roles/kanri.md
grep -cF 'Two signals fire a handover. Check them at every boundary: at loop step 6 while' skills/tanto/roles/kanri.md
grep -cF 'human. At a plan close it is always the second, because the close is itself a' skills/tanto/roles/kanri.md
grep -cF 'human. The `[<ref>]` is the identity; the human copies the bare name into the' skills/tanto/roles/kanri.md
grep -cF 'run the Handover section rather than wait for the next topic (decision-b6cb) |' skills/tanto/roles/kanri.md
grep -cF 'Kanri stays, prints the residency line' skills/tanto/roles/kanri.md
grep -cF 'branch (decision-b6cb). **Between plans** it is one act too, and the commit' skills/tanto/roles/kanri.md
grep -cF 'commit, already done when the window reaches this list; between plans it is' skills/tanto/roles/kanri.md
grep -cF 'written". **At a plan close** that line already says "closed", which the' skills/tanto/roles/kanri.md
grep -cF '**Between plans**, there is no ledger, so write "handover written by' skills/tanto/roles/kanri.md
grep -cF 'has one open until you close it, so it takes the in-plan procedure with the two' skills/tanto/roles/kanri.md
grep -cF 'Which of the two procedures follows is decided by whether a ledger is open.' skills/tanto/roles/kanri.md
grep -cF 'the plan close, the human' skills/tanto/templates/kanri-handover.md
grep -cF '<The trigger that fired — the human' skills/tanto/templates/kanri-handover.md
grep -cF 'with decision-b6cb, which made the plan close the ordinary trigger).' skills/tanto/templates/roster.md
grep -cF 'handover or a replacement will be read from (issue-40ed).' skills/tanto/templates/roster.md
````

Expected, line by line: `1`, `0`, `1`, `0`, `1`, `0`, `1`, `0`, `1`, `0`, `1`,
`0`, `1`, `0`, `1`, `0`. Baseline before the edits, measured 2026-09-10: the
same sixteen values with `1` and `0` exchanged.

- [ ] **Step 11: Verify the old values this task is the only one that removes**

````bash
grep -cF 'Two signals fire a handover' skills/tanto/roles/kanri.md
grep -cF 'threshold on the reading' skills/tanto/roles/kanri.md
grep -cF 'Which of the two procedures' skills/tanto/roles/kanri.md
grep -cF 'handover or a replacement will be read from' skills/tanto/templates/roster.md
grep -cF 'compaction noticed' skills/tanto/roles/kanri.md
````

Expected, line by line: `0`, `0`, `0`, `0`, `1`. Baseline before the edits,
measured 2026-09-10: `1`, `1`, `1`, `1`, `1`. The last needle **stays at 1**:
that hit is signal 3's own heading inside P9.1's new block, and it is the one
hit of this sweep that a correct edit does not remove, so it is **recorded as
context, not as a stop condition**. These five are O14.2, O14.6, O14.14,
O14.11 and O14.15 of task 14, re-run here because this is the task that settles
them.

- [ ] **Step 12: The diff of each file is exactly its passages**

````bash
for f in skills/tanto/roles/kanri.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/roster.md; do
  echo "== $f"
  git diff "$(git merge-base main HEAD)" -- "$f"
done
````

Expected: for `roles/kanri.md`, hunks holding P7.7 from task 7 and P9.1 to
P9.6 and nothing else; for `templates/kanri-handover.md`, one changed line,
P9.7; for `templates/roster.md`, one hunk, P9.8.

- [ ] **Step 13: Lint the three changed paths**

````bash
./scripts/lint.sh skills/tanto/roles/kanri.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/roster.md
````

Expected: exit 0, none `Failed`. markdownlint reports `Skipped` or no files for
the two template paths — `skills/**/templates/**` is ignored by configuration —
so what decides them is trailing whitespace, end-of-file, and mixed line
ending.

- [ ] **Step 14: Commit**

````bash
git commit --only skills/tanto/roles/kanri.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/roster.md -m "docs(tanto): the plan close is the ordinary handover trigger" -m "Three signals fire a handover, and the first is the plan close: after T2, the merge decision, the peers' deletion and the archive move, the handover runs without a threshold and without asking, because a resident session's per-turn cost is its age and the reset is a planned step rather than a question put to the human once a plan. The delete table's plan-close row hands over instead of waiting for the next topic; the procedure gains its third case, where the exit shoroku is a fresh act whose commit lands on the plan's branch and the ledger's Progress line stays closed; the handover template's trigger blank offers the close; and the roster template stops promising a threshold for the handover, which the archive's rows no longer feed (decision-b6cb, req-04f5, issue-40ed)." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: `1`.

**Done when:** the sixteen checks of Step 10 alternate `1 0`, the four removals
of Step 11 read `0 0 0 0` with `compaction noticed` recorded at `1` as context,
each file's diff against the merge base is exactly its passages, and lint is
clean on all three changed paths.

---

### Task 10: no line carries an idle subscription

**Batch:** C. **Blocks:** P10.1, P10.2, P10.3, P10.4, P10.5.

The measurement behind this task, for the record: two Sekkei exits ran under
the rule that kept the subscription on the `exit:` lines, and produced four
idle notices at a Kanri holding about 5 MB of transcript, none of them the
forced-exit signal — both sessions answered every line normally and every
notice arrived after its answer (issue-d725). This is text, not behaviour;
Kanri has already ruled it for the current run as `R-1`.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — three passages, P10.1, P10.2, P10.3.
- Modify: `skills/tanto/SKILL.md` — two passages, P10.4, P10.5.

**Interfaces:**

- Consumes: nothing from an earlier task. P10.1 to P10.3 sit in the exit-shoroku
  section of `roles/kanri.md`, which tasks 7 and 9 do not touch.
- Produces: nothing a later task consumes. What this task settles is the
  `notify_when_idle: true` needle, which task 14 sweeps over the whole skill and
  which no other task removes a hit of.
- Both files are markdownlint-linted.

- [ ] **Step 1: Baseline the line endings**

````bash
git ls-files --eol skills/tanto/roles/kanri.md skills/tanto/SKILL.md
````

Expected for both: `i/lf`, `w/crlf`, `attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: P10.1 — the exit shoroku's first line**

**P10.1** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
1. At the boundary where the exit falls, send that session
   `exit: propose your shoroku; write it to <path>` with
   `notify_when_idle: true`. The path is
```

**P10.1 →**

```text
1. At the boundary where the exit falls, send that session
   `exit: propose your shoroku; write it to <path>`, without an idle
   subscription, as with every other line you send. The path is
```

- [ ] **Step 3: P10.2 — the exit direction line**

**P10.2** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
   `exit-<role>[-<suffix>]-direction.md`. Then send
   `exit: direction at <path>` with `notify_when_idle: true`.
```

**P10.2 →**

```text
   `exit-<role>[-<suffix>]-direction.md`. Then send
   `exit: direction at <path>`, again without a subscription.
```

- [ ] **Step 4: P10.3 — how a forced exit is learned**

**P10.3** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
A session that has not answered when its idle notice arrives is past answering:
treat the exit as forced, write a roster Events line saying its exit shoroku
did not run and what was lost as far as you know, ask the human to delete it,
and continue. The same Events line goes in whenever you mark a row `dead`.
```

**P10.3 →**

```text
A session that has stopped answering is past answering, and you learn it the
way you learn of a missing batch report: the human says the session is gone, or
your window wakes for another reason and the answer has not arrived. Treat the
exit as forced, write a roster Events line saying its exit shoroku did not run
and what was lost as far as you know, ask the human to delete it, and continue.
The same Events line goes in whenever you mark a row `dead`.
```

- [ ] **Step 5: P10.4 — the contract's subscription rule**

**P10.4** `skills/tanto/SKILL.md` — replace exactly these 10 lines

```text
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
```

**P10.4 →**

```text
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
```

- [ ] **Step 6: P10.5 — the exit lines in `SKILL.md`**

**P10.5** `skills/tanto/SKILL.md` — replace exactly these 10 lines

```text
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
```

**P10.5 →**

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

- [ ] **Step 7: Verify the five passages**

````bash
grep -cF '`exit: propose your shoroku; write it to <path>`, without an idle' skills/tanto/roles/kanri.md
grep -cF '`exit: propose your shoroku; write it to <path>` with' skills/tanto/roles/kanri.md
grep -cF '`exit: direction at <path>`, again without a subscription.' skills/tanto/roles/kanri.md
grep -cF '`exit: direction at <path>` with `notify_when_idle: true`.' skills/tanto/roles/kanri.md
grep -cF 'way you learn of a missing batch report: the human says the session is gone, or' skills/tanto/roles/kanri.md
grep -cF 'A session that has not answered when its idle notice arrives is past answering:' skills/tanto/roles/kanri.md
grep -cF -- '- Kanri sends every line **without** an idle subscription — batch prompts,' skills/tanto/SKILL.md
grep -cF '`notify_when_idle: true`, because there the idle notice is the forced-exit' skills/tanto/SKILL.md
grep -cF 'The lines, each sent without an idle subscription, like every other tanto line.' skills/tanto/SKILL.md
grep -cF 'session that has not answered when its idle notice arrives is past answering:' skills/tanto/SKILL.md
````

Expected, line by line: `1`, `0`, `1`, `0`, `1`, `0`, `1`, `0`, `1`, `0`.
Baseline before the edits, measured 2026-09-10: the same ten values with `1`
and `0` exchanged.

- [ ] **Step 8: Verify the needle this task exists to remove**

````bash
grep -c 'notify_when_idle: true' skills/tanto/roles/kanri.md
grep -c 'notify_when_idle: true' skills/tanto/SKILL.md
grep -c 'notify_when_idle' skills/tanto/SKILL.md
grep -c 'exit lines' skills/tanto/SKILL.md
````

Expected, line by line: `0`, `0`, `1`, `1`. Baseline before the edits, measured
2026-09-10: `2`, `2`, `3`, `2`. The third check reads `1` and not `0`: the bare
word survives in P10.4's own new text, where the pure `notify_when_idle` with
no message is still what Kanri sends when a signal is overdue. The fourth is
half of O14.10, whose other hit is in `roles/kanri.md` and stays.

- [ ] **Step 9: The diff of each file is exactly its passages**

````bash
for f in skills/tanto/roles/kanri.md skills/tanto/SKILL.md; do
  echo "== $f"
  git diff "$(git merge-base main HEAD)" -- "$f"
done
````

Expected: for `roles/kanri.md`, hunks holding P7.7, P9.1 to P9.6, and P10.1 to
P10.3 and nothing else; for `SKILL.md`, hunks holding P8.2, P10.4 and P10.5.

- [ ] **Step 10: Lint both changed paths**

````bash
./scripts/lint.sh skills/tanto/roles/kanri.md skills/tanto/SKILL.md
````

Expected: exit 0, none `Failed`.

- [ ] **Step 11: Commit**

````bash
git commit --only skills/tanto/roles/kanri.md skills/tanto/SKILL.md -m "docs(tanto): no tanto line carries an idle subscription" -m "The exit lines lose theirs, which is the last pair that had one. They carried it on the reasoning that there the idle notice is the forced-exit signal; measured across two Sekkei exits it woke Kanri four times and signalled nothing, because both sessions answered normally and every notice arrived after its answer. A session that has stopped answering is learned the way a missing batch report is learned - the human says the session is gone, or the window wakes for another reason and the answer has not arrived - and the forced exit follows from that (issue-d725)." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: `1`.

**Done when:** the ten checks of Step 7 alternate `1 0`, `notify_when_idle: true`
returns `0` in both files while the bare `notify_when_idle` still returns `1` in
`SKILL.md`, both diffs are exactly their passages, and lint is clean.

---

### Task 11: both directories stay, and nobody asks

**Batch:** C. **Blocks:** P11.1, P11.2, P11.3.

The human's decision, of 2026-09-09: keep both untracked directories, ask about
neither. The deletion question was answered three times in three days, which is
what req-04f5's "asked only for what only the human can do" is against. The
rule is stated in three places — the contract, Kanri's residency paragraph, and
Jisso's copy in the "What tanto overrides" table — and all three move together
or the tree contradicts itself.

This task does **not** collapse the topic directory into the workspace: that is
issue-f2c4, which is out of this plan's scope and has its own plan, where its
old values are the ones on `main` today.

**Files:**

- Modify: `skills/tanto/SKILL.md` — one passage, P11.1.
- Modify: `skills/tanto/roles/kanri.md` — one passage, P11.2.
- Modify: `skills/tanto/roles/jisso.md` — one passage, P11.3.

**Interfaces:**

- Consumes, from task 9: P11.2 replaces the paragraph whose last sentence names
  "the Handover section above", which P9.4 to P9.6 rewrote. The two are in
  different sections and may be applied in either order, but P11.2's new text
  is written on the assumption that the close hands the role over, which is
  P9.1's rule.
- Produces: nothing a later task consumes.
- All three files are markdownlint-linted.

- [ ] **Step 1: Baseline the line endings**

````bash
git ls-files --eol skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/jisso.md
````

Expected for all three: `i/lf`, `w/crlf`, `attr/text=auto`, and never
`w/mixed`.

- [ ] **Step 2: P11.1 — the contract**

**P11.1** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
`.superpowers/sdd/<plan-basename>/` outlives the SDD run. Jisso never deletes
it. After T2 and the merge decision, Kanri asks the human whether to delete it.
```

**P11.1 →**

```text
`.superpowers/sdd/<plan-basename>/` outlives the SDD run, and so does the topic
directory beside it. Jisso never deletes either, and nothing asks the human to
delete either: after T2 the two have the same standing — untracked, local to one
machine, useful only for a later re-read — and disk is the only cost
(issue-12d3).
```

- [ ] **Step 3: P11.2 — Kanri's residency paragraph**

**P11.2** `skills/tanto/roles/kanri.md` — replace exactly these 7 lines

```text
You are resident. A plan's end is a boundary like any other, and the next topic
starts with a new topic directory and a new ledger under the same roster,
cold-read as if fresh. Your only exit is the Handover section above.

After T2 and the merge decision, also ask the human whether to delete
`.superpowers/sdd/<plan-basename>/`. Jisso never deletes it, and the roster
stays either way.
```

**P11.2 →**

```text
The role is resident; the session that carries it is not. A plan's end is a
boundary like any other for the run, and the next topic starts with a new topic
directory and a new ledger under the same roster, cold-read as if fresh —
normally by your successor, because the close hands the role over
(decision-b6cb), and by you when the human declines that handover. Your only
exit is the Handover section above.

Neither `.superpowers/sdd/<plan-basename>/` nor the topic directory beside it is
deleted at the close, and you ask the human about neither. After T2 the two have
the same standing: untracked, local to one machine, and useful only for a later
re-read (issue-12d3).
```

- [ ] **Step 4: P11.3 — Jisso's copy of the workspace rule**

**P11.3** `skills/tanto/roles/jisso.md` — replace exactly this 1 line

```text
| SDD Finish — delete the workspace once the final review is clean | never delete it | it holds the conductor ledger, the reports, and the T2 source; Kanri asks the human about it after T2 and the merge decision |
```

**P11.3 →**

```text
| SDD Finish — delete the workspace once the final review is clean | never delete it | it holds the conductor ledger, the reports, and the T2 source; nobody deletes it at the close, and the topic directory beside it stays on the same terms (issue-12d3) |
```

- [ ] **Step 5: Verify the three passages**

````bash
grep -cF 'delete either: after T2 the two have the same standing — untracked, local to one' skills/tanto/SKILL.md
grep -cF 'it. After T2 and the merge decision, Kanri asks the human whether to delete it.' skills/tanto/SKILL.md
grep -cF 'Neither `.superpowers/sdd/<plan-basename>/` nor the topic directory beside it is' skills/tanto/roles/kanri.md
grep -cF '`.superpowers/sdd/<plan-basename>/`. Jisso never deletes it, and the roster' skills/tanto/roles/kanri.md
grep -cF '| SDD Finish — delete the workspace once the final review is clean | never delete it | it holds the conductor ledger, the reports, and the T2 source; nobody deletes it at the close, and the topic directory beside it stays on the same terms (issue-12d3) |' skills/tanto/roles/jisso.md
grep -cF '| SDD Finish — delete the workspace once the final review is clean | never delete it | it holds the conductor ledger, the reports, and the T2 source; Kanri asks the human about it after T2 and the merge decision |' skills/tanto/roles/jisso.md
````

Expected, line by line: `1`, `0`, `1`, `0`, `1`, `0`. Baseline before the
edits, measured 2026-09-10: the same six values with `1` and `0` exchanged.

- [ ] **Step 6: Verify the three old values this task removes**

````bash
grep -cF 'whether to delete' skills/tanto/roles/kanri.md
grep -cF 'whether to delete' skills/tanto/SKILL.md
grep -cF 'You are resident' skills/tanto/roles/kanri.md
grep -cF 'asks the human about it' skills/tanto/roles/jisso.md
````

Expected, line by line: `0`, `0`, `0`, `0`. Baseline before the edits, measured
2026-09-10: `1`, `1`, `1`, `1`. These are O14.4, O14.5 and O14.16 of task 14.
`asks the human about it` is `whether to delete` said in other words in another
role's copy of the same rule, and it is one of the two hits the spec's first
old-value sweep missed — a file with a passage gets read anyway, a file without
one is opened only if a needle reaches it.

- [ ] **Step 7: The diff of each file is exactly its passages**

````bash
for f in skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/jisso.md; do
  echo "== $f"
  git diff "$(git merge-base main HEAD)" -- "$f"
done
````

Expected: for `SKILL.md`, hunks holding P8.2, P10.4, P10.5 and P11.1; for
`roles/kanri.md`, P7.7, P9.1 to P9.6, P10.1 to P10.3 and P11.2; for
`roles/jisso.md`, P7.2, P7.4, P7.5 and P11.3.

- [ ] **Step 8: Lint the three changed paths**

````bash
./scripts/lint.sh skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/jisso.md
````

Expected: exit 0, none `Failed`.

- [ ] **Step 9: Commit**

````bash
git commit --only skills/tanto/SKILL.md skills/tanto/roles/kanri.md skills/tanto/roles/jisso.md -m "docs(tanto): both untracked directories stay, and nobody asks about either" -m "The workspace and the topic directory beside it have the same standing after T2: untracked, local to one machine, useful only for a later re-read, and disk is the only cost. The contract, Kanri's residency paragraph and Jisso's copy of the workspace rule all say so, so no seat is left holding the deletion question the human answered three times in three days. Kanri's paragraph also separates the role from the session that carries it: the role is resident, the session is not, and the next topic is normally cold-read by a successor (issue-12d3, decision-b6cb)." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: `1`.

**Done when:** the six checks of Step 5 alternate `1 0`, the four of Step 6 all
read `0`, each file's diff against the merge base is exactly its passages, and
lint is clean on all three changed paths.

---
### Task 12: a decide point carries its own default

**Batch:** D. **Blocks:** P12.1, A12.2, P12.3, P12.4, P12.5, P12.6.

A decide point in a review brief carries `— If unanswered: <what>`, so silence
selects something the human saw before answering. The template states the rule
twice — once in the answering paragraph, once in the point-form paragraph — and
the four point templates in sections 1, 2, 4 and 5 show where the clause goes.
`roles/kanri.md`'s brief form check counts a point's parts, and the clause adds
a fourth; without P12.6 the rule would be stated in the template and unenforced
by the check that reads it.

**Files:**

- Modify: `skills/tanto/templates/review-brief.md` — four passages: P12.1 a
  replacement, P12.3 an insertion with anchor A12.2, P12.4 a **global
  replacement**, P12.5 a replacement.
- Modify: `skills/tanto/roles/kanri.md` — one passage, P12.6, a replacement.

**Interfaces:**

- Consumes: nothing from an earlier task.
- Produces: nothing a later task consumes. P12.4 is the one block in this plan
  whose old passage occurs more than once on purpose, and the only one whose
  lead states an occurrence count rather than a bare line count.
- `templates/review-brief.md` is **markdownlint-ignored** under
  `skills/**/templates/**`; `roles/kanri.md` is linted normally.

- [ ] **Step 1: Baseline the line endings**

````bash
git ls-files --eol skills/tanto/templates/review-brief.md skills/tanto/roles/kanri.md
````

Expected for both: `i/lf`, `w/crlf`, `attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: P12.1 — what an unanswered point selects**

**P12.1** `skills/tanto/templates/review-brief.md` — replace exactly these 3 lines

```text
`all OK` confirms every point tagged confirm at once, and a point tagged
confirm or nothing that goes unmentioned counts as confirmed; a point tagged
choose or decide needs its own line, and an unanswered one stays open.
```

**P12.1 →**

```text
`all OK` confirms every point tagged confirm at once, and a point tagged
confirm or nothing that goes unmentioned counts as confirmed. A point tagged
choose or decide needs its own line; when it goes unanswered, what the point
names after `— If unanswered:` is what it selects, so that you see before
answering what your silence will choose. A choose or decide point carrying no
such clause is a defective brief: it stays open, and Sekkei asks for it on its
own line rather than reading a default into it.
```

- [ ] **Step 3: A12.2 — the anchor for P12.3, before the edit**

**A12.2** `skills/tanto/templates/review-brief.md` — `grep -c 'For a spec, section 5' skills/tanto/templates/review-brief.md` — before: 1, after: 1

````bash
grep -c 'For a spec, section 5' skills/tanto/templates/review-brief.md
````

Expected: `1`, the `before:` value. It does not invert: P12.3 is an insertion
and its anchor lines stay.

- [ ] **Step 4: P12.3 — the clause, in the point-form paragraph**

**P12.3** `skills/tanto/templates/review-brief.md` — insert after these 2 lines

```text
one line each. For a spec, section 5's body is the single rendered line
`not applicable — a spec`.
```

**P12.3 →**

```text

Every point tagged **choose** or **decide** ends with `— If unanswered: <what>`
after the pointer. For a **decide** point it names the document's own answer
where one exists, and otherwise the recommendation Sekkei states with the
brief; for a **choose** point it names one of the options the point lists. The
clause is the writer's, it is rendered in the chat's language like the rest of
the point, and the marker `— If unanswered:` itself is a form marker and stays
as it is. The unsettled section's `decide` lines carry it too; they have no
pointer, so it follows the line's own trailing clause instead (issue-867f).
```

- [ ] **Step 5: P12.4 — the four point templates**

This is a **global replacement**: the same one line appears in sections 1, 2, 4
and 5, and all four are replaced. The clause is written out rather than
bracketed, because on this line `[...]` already means "pick one of these tag
words" and a bracketed clause would make one line use the same punctuation for
two meanings — and would read as optional the clause P12.3 makes mandatory.

**P12.4** `skills/tanto/templates/review-brief.md` — replace all 4 occurrences of this 1 line

```text
1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section>
```

**P12.4 →**

```text
1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section> — If unanswered: <what, on a choose or decide point only>
```

- [ ] **Step 6: P12.5 — the form-marker list**

**P12.5** `skills/tanto/templates/review-brief.md` — replace exactly these 4 lines

```text
renders. The form markers are the exception and stay exactly as they are
here: the bracketed tag words `confirm`, `choose`, `decide`, `nothing`, the
labels `Q:`, `A:`, `Serves:`, `Adds or changes:`, `See:`, the `## <n>.`
numbers, and the pointer after `See:`. The brief selects and renders; it does
```

**P12.5 →**

```text
renders. The form markers are the exception and stay exactly as they are
here: the bracketed tag words `confirm`, `choose`, `decide`, `nothing`, the
labels `Q:`, `A:`, `Serves:`, `Adds or changes:`, `See:`,
`— If unanswered:`, the `## <n>.` numbers, and the pointer after `See:`. The
brief selects and renders; it does
```

- [ ] **Step 7: P12.6 — the brief form check counts the parts**

**P12.6** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
   unsettled line saying whether an answer is needed; every point in its
   three parts — the two before `See:` and the pointer after it, which may
   carry the ` — ` separator, as a plan's task headings do; every pointer the
```

**P12.6 →**

```text
   unsettled line saying whether an answer is needed; every point in its
   parts — the two before `See:`, then the pointer, and on a choose or decide
   point the `— If unanswered:` clause after it, so three parts or four, any
   of which may carry the ` — ` separator, as a plan's task headings do; a
   choose or decide point without that clause failing the check; every pointer
   the
```

- [ ] **Step 8: Verify the five passages and the anchor**

````bash
grep -cF 'such clause is a defective brief: it stays open, and Sekkei asks for it on its' skills/tanto/templates/review-brief.md
grep -cF 'confirm or nothing that goes unmentioned counts as confirmed; a point tagged' skills/tanto/templates/review-brief.md
grep -c 'For a spec, section 5' skills/tanto/templates/review-brief.md
grep -cF 'Every point tagged **choose** or **decide** ends with `— If unanswered: <what>`' skills/tanto/templates/review-brief.md
grep -cF 'If unanswered: <what, on a choose or decide point only>' skills/tanto/templates/review-brief.md
grep -c 'A: <...> — See: <section>$' skills/tanto/templates/review-brief.md
grep -cF '`— If unanswered:`, the `## <n>.` numbers, and the pointer after `See:`. The' skills/tanto/templates/review-brief.md
grep -cF 'numbers, and the pointer after `See:`. The brief selects and renders; it does' skills/tanto/templates/review-brief.md
grep -cF 'choose or decide point without that clause failing the check; every pointer' skills/tanto/roles/kanri.md
grep -cF 'three parts — the two before `See:` and the pointer after it, which may' skills/tanto/roles/kanri.md
grep -n 'For a spec, section 5' skills/tanto/templates/review-brief.md
grep -nF 'Every point tagged **choose** or **decide** ends with `— If unanswered: <what>`' skills/tanto/templates/review-brief.md
````

Expected, line by line: `1`, `0`, `1` — the anchor at its stated `after:` value
— `1`, `4`, `0`, `1`, `0`, `1`, `0`. Baseline before the edits, measured
2026-09-10: `0`, `1`, `1`, `0`, `0`, `4`, `0`, `1`, `0`, `1`. The fifth check
is the only one in this plan whose passing value is `4`: it is P12.4's
occurrence count, and the sixth is the same four lines counted from their old
ending, which is why it is anchored with `$` — the old line is a prefix of the
new one and only the end of line decides. `grep -c` counts lines, and these
four lines are distinct lines.

The two `grep -n` lines then pin where P12.3 landed, which no content grep can:
the second prints a line number **three** greater than the first — A12.2's
anchor line, the second line of its two-line block, the blank line P12.3's new
block opens with, then the paragraph. The absolute numbers move, because P12.1
lands earlier in the same file and is four lines longer than what it replaces;
the offset does not. Baseline before the edits, measured 2026-09-10: `43:`
alone, the paragraph absent.

- [ ] **Step 9: Verify the two old values this task removes**

````bash
grep -cF 'an unanswered one stays open' skills/tanto/templates/review-brief.md
grep -cF 'three parts' skills/tanto/roles/kanri.md
grep -cF 'has none' skills/tanto/templates/review-brief.md
````

Expected, line by line: `0`, `0`, `1`. Baseline before the edits, measured
2026-09-10: `1`, `1`, `1`. The third **stays at 1**: that hit is
`"not stated" when it has none`, about a `req-<id>` citation, and has nothing
to do with the test-suite premise task 7 removed from `roles/jisso.md`. It is
the standing example of why an `O` row records the disposition of each hit
rather than one verdict, and it is **recorded as context, not as a stop
condition**. These are O14.7, O14.12 and O14.13 of task 14.

- [ ] **Step 10: The diff of each file is exactly its passages**

````bash
for f in skills/tanto/templates/review-brief.md skills/tanto/roles/kanri.md; do
  echo "== $f"
  git diff "$(git merge-base main HEAD)" -- "$f"
done
````

Expected: for `templates/review-brief.md`, hunks holding P12.1, P12.3, the four
occurrences of P12.4, and P12.5 and nothing else; for `roles/kanri.md`, its
passages from tasks 7, 9, 10 and 11 plus P12.6.

- [ ] **Step 11: Lint both changed paths**

````bash
./scripts/lint.sh skills/tanto/templates/review-brief.md skills/tanto/roles/kanri.md
````

Expected: exit 0, none `Failed`. markdownlint reports `Skipped` or no files for
the template path.

- [ ] **Step 12: Commit**

````bash
git commit --only skills/tanto/templates/review-brief.md skills/tanto/roles/kanri.md -m "docs(tanto): a choose or decide point states what silence selects" -m "Every point tagged choose or decide ends with an If unanswered clause naming what the point selects when it goes unanswered - the document's own answer for a decide point, one of the listed options for a choose point - so the human sees before answering what silence will choose. A point carrying no such clause is a defective brief and stays open rather than resolving to a default nobody wrote. The four point templates show where the clause goes, the form-marker list keeps the marker untranslated, and Kanri's form check counts three parts or four and fails a choose or decide point without the clause (issue-867f)." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: `1`.

**Done when:** the ten checks of Step 8 read `1 0 1 1 4 0 1 0 1 0` and its two
`grep -n` lines put P12.3's paragraph three lines below the anchor, the two
removals of Step 9 read `0 0` with `has none` recorded at `1` as context, both
diffs are exactly their passages, and lint is clean on both changed paths.

---

### Task 13: how a measurement report is read, and what `mode=` can say

**Batch:** D. **Blocks:** A13.1, P13.2, P13.3.

Two unrelated small items, in two files, neither of which any other task
touches in the same section. P13.2 is Kanri's half of issue-f2ec — task 7's
P7.4 is Jisso's half, the dispatch side, and this is the reading side. P13.3
closes issue-15bf on the measurement of 2026-09-10: a default-mode window's
system prompt names no permission mode, the only occurrence of the phrase being
the harness line that tools run behind a user-selected one, while an auto-mode
session carries a "While auto mode is active:" block. So `unknown` is the
ceiling, not a gap.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — one passage, P13.2, an insertion,
  with anchor A13.1.
- Modify: `skills/tanto/SKILL.md` — one passage, P13.3, a replacement.

**Interfaces:**

- Consumes, from task 7: P7.4's section in `roles/jisso.md`, which states the
  dispatch side of the same rule. The two say the same thing from opposite
  seats and their wording is deliberately parallel; neither quotes the other,
  so no line has to stay byte-identical between them.
- Produces: nothing a later task consumes.
- Both files are markdownlint-linted.

- [ ] **Step 1: Baseline the line endings**

````bash
git ls-files --eol skills/tanto/roles/kanri.md skills/tanto/SKILL.md
````

Expected for both: `i/lf`, `w/crlf`, `attr/text=auto`, and never `w/mixed`.

- [ ] **Step 2: A13.1 — the anchor for P13.2, before the edit**

**A13.1** `skills/tanto/roles/kanri.md` — `grep -c 'adopt or reject each shoroku candidate per the adoption rule' skills/tanto/roles/kanri.md` — before: 1, after: 1

````bash
grep -c 'adopt or reject each shoroku candidate per the adoption rule' skills/tanto/roles/kanri.md
````

Expected: `1`, the `before:` value. It does not invert: P13.2 is an insertion
into the batch loop's step, and the anchor lines stay.

- [ ] **Step 3: P13.2 — the batch loop reads a measurement report**

**P13.2** `skills/tanto/roles/kanri.md` — insert after these 2 lines

```text
   adopt or reject each shoroku candidate per the adoption rule, and update the
   ledger's `S-n` table, its Batches row, and its Progress line.
```

**P13.2 →**

```text

   A **measurement** report — one whose deliverable is what a tool actually did
   — is read for whether its outcome **contradicts** the brief's prediction. A
   real run usually does, somewhere; a report that confirms every expectation
   deserves a second look rather than a faster approval, because a
   reconstruction is built from the same brief the prediction came from
   (issue-f2ec).
```

- [ ] **Step 4: P13.3 — what `mode=` can say**

**P13.3** `skills/tanto/SKILL.md` — replace exactly these 2 lines

```text
`mode=` is what you can see about your own permission mode — `auto` when your
system prompt says auto mode is active, otherwise `unknown`. It is advisory.
```

**P13.3 →**

```text
`mode=` is what you can see about your own permission mode — `auto` when your
system prompt says auto mode is active, otherwise `unknown`. It is advisory,
and `unknown` is the measured ceiling rather than a gap: a session outside auto
mode carries no statement of which mode is active, only the harness's line that
tools run behind a user-selected one, so nothing better than `unknown` can be
reported and Kanri's warning stays keyed on the absence of `auto` (measured
2026-09-10, issue-15bf).
```

- [ ] **Step 5: Verify both passages and the anchor**

````bash
grep -cF 'A **measurement** report — one whose deliverable is what a tool actually did' skills/tanto/roles/kanri.md
grep -c 'adopt or reject each shoroku candidate per the adoption rule' skills/tanto/roles/kanri.md
grep -cF 'and `unknown` is the measured ceiling rather than a gap: a session outside auto' skills/tanto/SKILL.md
grep -cF 'system prompt says auto mode is active, otherwise `unknown`. It is advisory.' skills/tanto/SKILL.md
grep -n 'adopt or reject each shoroku candidate per the adoption rule' skills/tanto/roles/kanri.md
grep -nF 'A **measurement** report — one whose deliverable is what a tool actually did' skills/tanto/roles/kanri.md
grep -n '^4\. \*\*Triage any bug report that arrived during the batch\*\*' skills/tanto/roles/kanri.md
````

Expected, line by line: `1`, `1` — the anchor at its stated `after:` value —
`1`, `0`. Baseline before the edits, measured 2026-09-10: `0`, `1`, `0`, `1`.

The three `grep -n` lines then pin where P13.2 landed, and this is the
placement check that matters most in this plan: P13.2 inserts **into a numbered
step** of Kanri's batch loop, where landing under the wrong step is invisible
to every content grep above. Expected: the second line number is **three**
greater than the first — the anchor line, the second line of A13.1's two-line
block, the blank line the new block opens with, then the paragraph — and the
third, the batch loop's next numbered step, is greater still, so the paragraph
sits inside step 3 rather than under step 4. Baseline before the edit, measured
2026-09-10: `208:`, nothing for the paragraph, and `210:` for step 4.

- [ ] **Step 6: The diff of each file is exactly its passages**

````bash
for f in skills/tanto/roles/kanri.md skills/tanto/SKILL.md; do
  echo "== $f"
  git diff "$(git merge-base main HEAD)" -- "$f"
done
````

Expected: for `roles/kanri.md`, its passages from tasks 7, 9, 10, 11 and 12
plus P13.2, an addition; for `SKILL.md`, its passages from tasks 8, 10 and 11
plus P13.3.

- [ ] **Step 7: Lint both changed paths**

````bash
./scripts/lint.sh skills/tanto/roles/kanri.md skills/tanto/SKILL.md
````

Expected: exit 0, none `Failed`.

- [ ] **Step 8: Commit**

````bash
git commit --only skills/tanto/roles/kanri.md skills/tanto/SKILL.md -m "docs(tanto): a measurement report is read for what contradicts the brief" -m "Kanri's batch loop learns the reading side of a measurement task: a report whose deliverable is what a tool actually did is read for whether its outcome contradicts the brief's prediction, and one that confirms every expectation deserves a second look rather than a faster approval, because a reconstruction is built from the same brief the prediction came from. Separately, mode= says what it can: unknown is the measured ceiling and not a gap, because a session outside auto mode carries no statement of which mode is active, so Kanri's warning stays keyed on the absence of auto (issue-f2ec, issue-15bf)." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: `1`.

**Done when:** the four checks of Step 5 read `1 1 1 0` and its three `grep -n`
lines put P13.2's paragraph three lines below the anchor and above the batch
loop's next numbered step, both diffs are exactly their passages, and lint is
clean on both changed paths.

---

### Task 14: the whole-tree sweeps and the `O` needles

**Batch:** D. **Blocks:** O14.1 to O14.16.

**This task is a measurement, and it writes no file.** Its deliverable is
recorded output: the sixteen `O` needles run over `skills/tanto/` with their
**hits printed rather than counted**, the whole-tree checks run over the
finished branch, and a ruling on every residual hit. It makes no commit,
because it changes nothing.

Two rules from P7.4, which is in the tree by the time this task runs, bind it:
every byte recorded is what the command printed, and nothing is written from
what a command was expected to print; and a run that confirms every expectation
deserves a second look rather than a faster approval. Its reviewer is told to
**re-run the checks rather than read the report**, because a verification-only
deliverable inverts the reviewer's standing instruction.

Where the output is recorded: the batch report, per
`skills/tanto/templates/batch-report.md`. This plan names no other destination
and prescribes no report skeleton of its own.

**Files:**

- Reads: every path this plan touched, plus `skills/tanto/` as a whole. Writes:
  none.

**Interfaces:**

- Consumes: every other task. This task can only run after task 13, and its
  expected values are the dispositions the `O` blocks below state.
- Produces: the recorded output that closes the plan.

**The sixteen `O` blocks.** Each is one entity this plan changes, with the
raw hit count recorded at authoring time on 2026-09-10 and the disposition
ruled by Sekkei. A disposition of "gone" cites the passages that remove the
hits; a disposition of "stays" says why.

**O14.1** `notify_when_idle: true` — 4 hits: `roles/kanri.md` ×2, `SKILL.md` ×2; gone; P10.1, P10.2, P10.4, P10.5

**O14.2** `Two signals fire a handover` — 1 hit: `roles/kanri.md` ×1; gone; P9.1

**O14.3** `Kanri stays, prints the residency line` — 1 hit: `roles/kanri.md` ×1; gone; P9.3

**O14.4** `whether to delete` — 2 hits: `roles/kanri.md` ×1, `SKILL.md` ×1; gone; P11.2, P11.1

**O14.5** `You are resident` — 1 hit: `roles/kanri.md` ×1; gone; P11.2

**O14.6** `threshold on the reading` — 1 hit: `roles/kanri.md` ×1; gone; P9.1

**O14.7** `an unanswered one stays open` — 1 hit: `templates/review-brief.md` ×1; gone; P12.1

**O14.8** `application script's path` — 1 hit: `roles/sekkei.md` ×1; gone; P6.1

**O14.9** `There are eleven` — 1 hit: `SKILL.md` ×1; **stays.** The templates count is unchanged; the executable is not a template, and P8.2 adds it in a paragraph of its own rather than to that list

**O14.10** `exit lines` — 3 raw: `roles/kanri.md` ×1, `SKILL.md` ×2, one of which is inside P10.4's old block; **stays**, ending at 2. Both survivors are about where a reading travels, not about a subscription. The raw count is recorded because this sweep re-runs the needle over the whole skill, where a qualifier is not what the command returns

**O14.11** `handover or a replacement will be read from` — 1 hit: `templates/roster.md` ×1; gone; P9.8

**O14.12** `three parts — the two before` — 1 hit: `roles/kanri.md` ×1; gone; P12.6. The needle was `three parts` until the dry run measured it at 1 after the plan as well as before: P12.6's own replacement text reads "so three parts or four", so the short form is reproduced by the very change it was meant to detect

**O14.13** `has none` — 2 hits: `roles/jisso.md` ×1, `templates/review-brief.md` ×1; ends at 1. Jisso's is the test-suite premise and goes (P7.5); the brief template's is `"not stated" when it has none`, about a `req-<id>` citation, and stays

**O14.14** `Which of the two procedures` — 1 hit: `roles/kanri.md` ×1; gone; P9.6

**O14.15** `fired — the human's word` — 1 hit: `templates/kanri-handover.md` ×1; gone; P9.7. This needle took three attempts. `compaction noticed` returns 2 before and 2 after. `the human's word, or a compaction noticed` returns 1 before and 1 after, because P9.7 **inserts** `the plan close, ` into the line and every substring that avoids the insertion point survives it. Only a needle that **spans** the insertion point works, which is what this one does

**O14.16** `asks the human about it` — 1 hit: `roles/jisso.md` ×1; gone; P11.3

`Two signals` is not a row of its own. It is `Two signals fire a handover`
without its tail — one needle inside the other, in one file, removed by the one
passage — and the rule is one needle per changed **entity**, so the shorter form
would count the same removal twice.

- [ ] **Step 1: Extract the sixteen needles from this plan, and count them**

The needles are read out of the `O` blocks above rather than retyped, so that
there is one place each needle is written.

````bash
plan=docs/superpowers/plans/2026-09-10-tanto-sweep.md
needles="${TMPDIR:-/tmp}/tanto-sweep-o-needles.txt"
sed -n 's/^\*\*O14\.[0-9]\{1,2\}\*\* `\([^`]*\)`.*/\1/p' "$plan" > "$needles"
wc -l < "$needles"
````

Expected: `16`. A smaller number means a needle carries a backtick or a lead
was reworded, and the sweep below would then be silently short.

- [ ] **Step 2: Run every needle over the whole skill, with the hits printed**

````bash
while IFS= read -r needle; do
  printf '== %s\n' "$needle"
  grep -rnF -- "$needle" skills/tanto || printf '   (no hits)\n'
done < "${TMPDIR:-/tmp}/tanto-sweep-o-needles.txt"
````

Expected, needle by needle, against the dispositions above: `(no hits)` for
O14.1 to O14.8, O14.11, O14.12, O14.14, O14.15 and O14.16 — thirteen of the
sixteen; one hit in `SKILL.md` for O14.9; two hits for O14.10, in
`roles/kanri.md` and `SKILL.md`; and one hit in
`templates/review-brief.md` for O14.13.

**Read O14.15's result carefully before recording it.** Its disposition says
the phrase is gone from the handover template's two-signal list, which is a
statement about the list and not about the string; whether the string itself
survives P9.7 is what this command decides, and the recorded answer is what it
printed. Record every hit and rule on it; a raw count with a qualifier attached
is not what the command returns, and the qualifier is where the first sweep of
this spec went wrong twice.

- [ ] **Step 3: The line endings of all eleven paths, in two parts**

````bash
git ls-files --eol skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md skills/tanto/roles/jisso.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/roster.md skills/tanto/templates/review-brief.md docs/notes/tanto-consistency-checks.md
git ls-files --eol skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js
````

Expected: for the nine existing paths, `i/lf w/crlf attr/text=auto`, unchanged
from the baseline recorded before batch A; for the two created paths,
`i/lf w/lf attr/text eol=lf` — pinned by `.gitattributes`, not inherited, so a
checkout produces LF too. Never `w/mixed` on any of the eleven. The two claims
are different and are not merged into one table: note the `attr/` field, which
reads `attr/text eol=lf` for the two created paths and `attr/text=auto` for
the nine Markdown ones.

- [ ] **Step 4: The test suite, on the floor**

````bash
mise x node@22 -- node --version
mise x node@22 -- node --test skills/tanto/scripts/
````

Expected: a `v22.` version, recorded beside the result, and every test passing
with `fail 0`. The floor is the version the tests run on, and the only one.

- [ ] **Step 5: The instrument, on this plan's own branch**

````bash
node skills/tanto/scripts/passage-check.js diff --plan docs/superpowers/plans/2026-09-10-tanto-sweep.md --base "$(git merge-base main HEAD)"
````

Expected: no unaccounted added line, no unexplained removed line, and a line
naming the two `created:` paths it exempted. This is the instrument's own
dogfood against the branch that built it. If it reports an added line the plan
does not quote, the tree and the plan disagree and the report says which
line — do not adjust the plan to match the tree.

- [ ] **Step 6: The note's checks 1, 2 and 5**

Open `docs/notes/tanto-consistency-checks.md` and run its check 1 ("Every file
of the layout exists"), its check 2 ("Every in-skill path named by the contract
or a role file resolves"), and the three in-repo greps of its check 5 ("The two
verbatim quotes' pinned lines are present in every copy"), exactly as the note
states them.

Expected: check 1 lists nineteen paths with no `No such file or directory`;
check 2 prints seventeen `ok` lines and no `MISSING`; check 5's three in-repo
greps hold — this plan touches neither of the two pinned quotes, and those
greps are what proves it. Check 5's other two greps target
`$HOME/.claude/plugins/cache/...`, which no edit of this plan could move; they
are recorded as context, not as a stop condition.

- [ ] **Step 7: The note's check 7, the string that must be absent**

````bash
grep -rn 'skills/tanto/' skills/tanto/SKILL.md skills/tanto/roles skills/tanto/templates
````

Expected: no output, and the command exits 1. This is check 7's ninth line, run
whole rather than paraphrased. Runtime text in this skill is skill-relative;
only the skill's `README.md` and the note itself may name `skills/tanto/`, and
the reason is stronger than tidiness — that path is repo-relative, and `tanto`
runs in any repository, where `skills/tanto/` does not exist. Baseline on the
pre-plan tree, measured 2026-09-10: silent. A hit names the file and the line,
and the fix belongs in the passage that wrote it, not here.

- [ ] **Step 8: Lint every changed path, named individually**

````bash
./scripts/lint.sh skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md skills/tanto/roles/jisso.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/roster.md skills/tanto/templates/review-brief.md docs/notes/tanto-consistency-checks.md skills/tanto/scripts/passage-check.js skills/tanto/scripts/passage-check.test.js
````

Windows alternative: `scripts\lint.bat` with the same eleven paths. Expected:
exit 0, every hook `Passed` or `Skipped`, none `Failed`, and the JavaScript
hook appearing as run rather than as `(no files to check) Skipped`.

- [ ] **Step 9: Record the output**

Write what the commands printed into the batch report, per
`skills/tanto/templates/batch-report.md`: each command, its output, and the
expectation it was read against, plus a ruling on every residual `O` hit as
"this becomes a passage" or "unchanged, and why". A fallback — a command that
could not run on this machine and the route taken instead — is a sanctioned
outcome and is named in the report rather than papered over. Nothing is written
from what a command was expected to produce.

**Done when:** the sixteen needles have been run with their hits printed and
each hit ruled on; the eleven paths report their two expected line-ending
shapes and none reports `w/mixed`; the suite passes on a recorded `v22.`
version; `diff` reports nothing unaccounted and names the two exempt paths; the
note's checks 1, 2 and 5 hold with their new values and its check 7 is silent;
lint is clean on all eleven paths with the JavaScript hook run; and the output
is recorded.

---

## Self-Review

**1. Spec coverage.** Every block the spec authors is placed. The spec carries
38 `P` blocks and 8 `A` blocks; this plan carries all 46 of them, each exactly
once, plus the 16 `O` blocks of its own old-value sweep — **62 blocks** in
all. Both figures are lead-line censuses, taken over the spec and over this
file outside every fenced region, on 2026-09-10 and re-taken after the third
re-transcription from the corrected spec. The "Where each change lives" table
maps every spec
label to its plan id and its task. The spec's eleven issues each have a task: 7481, 88d3, 10bc and
f813 in tasks 1 to 3 (the instrument), task 4 (the note that schedules it), and
tasks 5 and 7 (the seats that run it); d725 in task 10; 12d3 in task 11; 867f
in task 12; f2ec in tasks 7 and 13; 15bf in task 13; 7281 in task 5's P5.1 and
in this review. The operational text of req-04f5 and decision-b6cb is task 9.
The spec's Verification items 1 to 7 are covered: item 1 by the lint step of
every task and by task 14 step 8, with the deferred fourth gate at task 1 step
5; item 2 by task 1 step 4, task 2 step 4, task 3 step 4 and task 14 step 4;
item 3 by the baseline step of every passage task and by task 14 step 3; item 4
by task 14 steps 1 and 2; item 5 by task 14 step 5; item 6 by task 4 step 8 and
task 14 step 6; item 7 by task 14 step 6. issue-f2c4 is out of scope by D-1 and
no task touches the path it would rename.

**2. Placeholder scan.** No task says TBD, "implement later", "add error
handling", "similar to Task N", or "write tests for the above". The two created
files are the one place where a code step does not carry the code it writes:
task 1's test file is given in full, and its implementation step gives the
module's surface and points at the specification section instead of a
transcription. That is the spec's own ruling — a created file's lines are
exempt from `diff` by the `created:` list and its tests are the check a
transcription would only duplicate (issue-7281) — and it is recorded here
because it is a real departure from "code blocks required for code steps".

**3. Type and name consistency.** The module surface is named once and used
consistently: `normalize`, `parsePlan`, `lintPlan`, `main` in task 1;
`replayPlan` added in task 2; `diffPlan` and `verifyTask` added in task 3. The
block object's fields (`kind`, `id`, `task`, `ordinal`, `path`, `shape`,
`count`, `occurrences`, `old`, `new`, `command`, `before`, `after`, `needle`,
`note`, `line`) are declared in task 1's Interfaces and used unchanged in tasks
2 and 3; `occurrences` appears in task 1's global-replacement test and in task
2's occurrence assertion under the same name. The `Problem` shape
`{ code, id, message }` is one shape across `lintPlan`, `replayPlan` and
`verifyTask`, with disjoint `code` vocabularies per subcommand. The subcommand
names and the option names `--plan`, `--base` and `--task` match between tasks
1 to 3 and the passages that name them in tasks 5, 6, 7 and 8. The path in
front of them deliberately does not, and the split is the one thing in this
item that is not a single form: this plan's own commands run in this
repository and say `node skills/tanto/scripts/passage-check.js <subcommand>`,
while the runtime text the passages write is skill-relative and says
`node "$TANTO/scripts/passage-check.js" <subcommand>`, because `tanto` runs in
any repository and `skills/tanto/` exists only in this one. P8.2's `SKILL.md`
paragraph sets `$TANTO` to the skill's own directory, and `node` stands in
front of the path in both forms because the file carries no shebang: dropping
the prefix is not the same edit as dropping the interpreter. The note's
check 7 is what enforces the skill-relative half, and this plan now runs it —
"How a batch is verified" item 9, and task 14 step 7.

**4. Sizes, per P5.1's own new rule.** Size has two components and they do not
pick the same task. By **line count** the largest is **task 1**, at 458 lines
and 8 steps: it carries the whole first test file, and three of batch A's four
tasks build one program. By **block count** the largest is **task 9**, at eight
blocks — 342 lines and 14 steps — and it is one task because splitting it would
put P9.3's "run the Handover section" in the tree a boundary before P9.4 and
P9.5 fix what that section says at a close. Then task 7 at 248 lines and 13
steps, task 12 at 242 lines and 12 steps, task 2 at 229 lines and 6 steps,
task 10 at 227 lines and 11 steps, and task 14 at 208 lines and 9 steps. The
smallest is task 6, at 109 lines and 6 steps. The whole plan is 3949 lines.
Every task figure here was re-measured on 2026-09-10, after the third
re-transcription from the corrected spec — the one that answered the human's
review gate and followed the Biome commit: a line count is the span from that
task's own heading to the line before the next task's,
a step count is the number of step checkboxes inside that span, and the file
total is `wc -l`. **Task 14 is a sweep-and-check task**: its deliverable is
recorded output rather than a file, it makes no commit, and its reviewer is
told to re-run the checks rather than read the report — per P5.1's own rule,
because a verification-only deliverable inverts the reviewer's standing
instruction. No threshold is set on any of these numbers; the sizes are
recorded until one can be chosen (issue-7281).

**5. Ordering constraints, stated where they bind.** Task 7 applies P7.2 before
P7.4. Tasks 1, 2 and 3 are strictly ordered: each extends the file the previous
one wrote. Task 4 cannot verify itself before tasks 1 to 3 have created the two
paths its check 1 lists. Task 14 runs last. Everywhere else the order inside a
task is free, and each task says so in its Interfaces block.

## Concerns for Sekkei

Six were raised. Sekkei ruled on all six on 2026-09-10; four changed the spec
and this plan, two stand as the drafter left them. Each ruling is recorded
here rather than only in the spec, because a task reads this file.

1. **A lead inside a fenced code block is not a lead** — *accepted, the spec
   now says so.* The rule is mechanical rather than a judgment call: a lead is
   by construction the line *before* a fence, so one that appears *within* one
   is text. The instrument's own tests are the case that forced it, since
   their fixtures are plans containing leads. The fixtures also number their
   ids from 90 upward so a fixture id can never collide with a real task's.
   `parsePlan` skips fenced regions.

2. **Two insertions carried no anchor step** — *accepted; the spec was wrong,
   not the plan.* The rule that every insertion carries an anchor was written
   after `P-M1` and `P-M2` were authored and never applied back to them, and
   the drafter found it by running `lint`'s own rule against the spec. The
   spec now carries `A-M1` and `A-M2`, this plan carries them as `A8.3` and
   `A8.5`, and task 8 renumbered accordingly. Both needles are backtick-free.

3. **`O14.15` could not detect the change it was written for** — *accepted,
   the needle is replaced.* `compaction noticed` returns 2 before the plan and
   2 after, because `P9.7`'s new line keeps the phrase and `roles/kanri.md`
   keeps it as signal 3's own heading. The replacement took two more attempts,
   which is the finding: `the human's word, or a compaction noticed` also
   returns 1 today and 1 after, because `P9.7` **inserts** `the plan close, `
   into the line and every substring avoiding the insertion point survives it.
   The needle is `fired — the human's word`, 1 today and 0 after, because it
   spans the insertion point. This is the third old-value defect of this plan
   found by someone other than its author, and the first found by the drafter.

4. **The `created:` list** — *no change needed; it is in Global Constraints*,
   verbatim, where `diff` reads it, and it is also transcribed under "Files
   the plan creates". Task 14 step 5 has what it needs.

5. **An unknown subcommand's exit code** — *accepted; the spec now states it.*
   Exit `2` is a broken invocation as against a check failure's `1`, and it
   covers an unresolvable `--base`, an absent `git`, an unreadable plan, a
   missing required option, and an unknown or absent subcommand. `2` carries a
   usage line to stderr. Task 1's choice was right and is now sanctioned
   rather than inferred.

6. **The module's exported surface and the `require.main` guard** — *they stay
   plan decisions, and the spec now says so.* Nothing outside the file imports
   it today, and its tests may import it or invoke it as a program; the plan
   records which was chosen, in each task's Interfaces block, so that a later
   change is a change and not a discovery.

Nothing else in the spec looked wrong to me. The 38 `P` blocks each resolve
against exactly one place in their target file on today's tree, the 8 `A`
anchors each return their stated `before:` value, and all sixteen `O` needles
return exactly the hit counts the spec's table records — checked before this
plan was written, and the baselines quoted in each task's verification steps
are those measurements.
