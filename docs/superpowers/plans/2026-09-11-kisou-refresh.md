# The kisou refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the doc-system half of `kisou migrate` out of prose and into one
shipped executable — `skills/kisou/scripts/doc-system-check.js` — change the
fall-through for a file no fingerprint matches from "rename to `.bak` and
rewrite" to "leave alone and report", and close this repository's own
template-versus-copy drift by running the new path on itself.

**Architecture:** Two kinds of task, and they do not mix. The first three tasks
write one CommonJS program and its `node:test` suite under test-driven
development — no dependency step, no `package.json`, standard library only.
The skill-text tasks are passage edits that replace one quoted passage with
another and change no other byte. The last three tasks are sweep-and-check
work on this repository: a measurement recorded verbatim in a batch report, a
`kisou migrate` run driven through its real trigger, and the dated report that
freezes what the run answered.

**Tech Stack:** Node 22 or newer for the instrument (`node:fs`, `node:path`,
`node:util` — nothing else); `mise x node@22` to pin the test run to the floor;
`node:test` and `node:assert` for the suite; Markdown for the skill text;
`pre-commit` through `./scripts/lint.sh` (Windows: `scripts\lint.bat`);
`git diff` against the merge base and `grep -c` for the hand-written
verification. Every fenced command in this plan is written for **Git Bash**,
run from the repository root.

**Spec:** `docs/superpowers/specs/2026-09-11-kisou-refresh-design.md`


---

## Global Constraints

Built from `AGENTS.md`, the spec's Fixed inputs, and the effective
`tanto.json`. Every batch prompt restates these; trust the prompt over
recollection.

### The shell

**Every fenced block in this plan runs in Git Bash**, from the repository
root. The host's primary shell is PowerShell, where a POSIX
`grep -c '...'` with single quotes is unrunnable. Every dispatch says so.

### Repository rules

- American English for everything in the repo — code, messages, comments,
  docs, commits, branch names.
- Run `./scripts/lint.sh` on the changed paths, **each named individually**.
  A directory argument makes every hook skip and proves nothing.
- Commit by explicit path with `git commit --only <paths>`; the index is
  shared. A new file needs `git add <path>` first, because `--only` cannot
  pick up an untracked file.
- Every commit message ends with a `Co-Authored-By:` trailer identifying the
  agent. The check greps the prefix `Co-Authored-By: Claude` **per commit, in
  a loop** — an aggregate count over the branch balances a commit with two
  trailers against a commit with none. **The trailer spelled out in each task's
  commit command is the plan author's session's**; use the one your own
  session's attribution names, which is what "identifying the agent" asks for.
  Only the prefix is checked, so either satisfies the check — but a commit that
  credits the wrong model is a false record, and this repository's history is
  read as one.
- Never `git add -A`, `.`, or `-u`; never a bare `git commit`; never
  `git commit -a`. Never amend a published commit. Never push to
  `origin/main`. Never bypass a hook (`--no-verify`, a `core.hooksPath`
  override).
- **Do not edit agent instruction files, repo-root Markdown, or
  linter/formatter configuration** — except the three edits the human has
  already approved, below.

### The three approved edits

`AGENTS.md`'s "Never do" list covers three edits this plan makes. The human
approved all three on 2026-09-11, at the spec's review gate; the record is
`.superpowers/sdd/kisou-refresh/dialogue.md`, Q-12, and the spec's "Open for
the human at the review" section. **No task asks again**; each of the three
cites Q-12 in its own text and in its commit body.

| Edit | Task | Class under `AGENTS.md` |
| --- | --- | --- |
| the `kisou-doc-system-check` hook in `.pre-commit-config.yaml` | 8 | linter configuration |
| the `node` line in `CONTRIBUTING.md`'s Prerequisites | 8 | repo-root Markdown |
| the rewrite of `docs/notes/AGENTS.md` and `docs/reports/AGENTS.md` | 7 | agent instruction files |

The two rewrites in task 7 are made **by the dogfood run itself**, by
accepting the instrument's two `replace` items. Nobody hand-edits either
file: that is the point of the run, and a hand edit would prove nothing.

### Models

From the **effective** `tanto.json` — the personal file at
`$CLAUDE_CONFIG_DIR/tanto.json` overlaid on the skill's built-in defaults,
key by key. At the time this plan was written the personal file set only
`sessions.sekkei`, so every `subagents` key below is a built-in default.

| Dispatch | `tanto.json` key | Model |
| --- | --- | --- |
| implementer, fix rounds 1–3 | `subagents.implementer` | `sonnet` |
| task reviewer, scoped re-review, whole-branch review | `subagents.reviewer` | `opus` |
| a drafter | `subagents.drafter` | `opus` |
| fix rounds 4–5 (the escalation) | `subagents.escalation` | `opus` |
| anything else | `subagents.default` | `sonnet` |

**Every dispatch names a `model`.** An omitted `model` inherits the session's,
which on Jisso is `opus` — the exact failure the rule prevents.

The `drafter` row is in the table because the catch-all row is not a synonym
for it: `subagents.default` is `sonnet` and `subagents.drafter` is `opus`, so
a drafter dispatched under "anything else" would run a family below the one
the configuration names.

**A note on what "effective" means here, since the file moved.** The personal
overlay set exactly one key, `sessions.sekkei = "opus"`, which is why this
session runs on `opus`; the run's own ruling had the human remove it as soon
as the handshake was accepted, and on this machine it is now
`_tanto.json` — a name `tanto` does not read. That changes nothing in this
table: **every `subagents` key was a built-in default before the rename and
still is**, so a Jisso reading the configuration later gets the same five
values. The one key the overlay carried governs a session model, not a
dispatch, and that session is this one.

### The runtime, and how the floor is exercised

Two assumptions at two levels, not to be conflated.

- **Using the skill** assumes only **Node 22 or newer on `PATH`**. Nothing
  pins a version at that level and nothing installs one. The pre-commit hook
  task 8 adds runs whatever `node` is on the path; the script's stated floor
  is what makes that safe.
- **Testing the script** assumes **`mise`**, a contributor's tool. Tests run
  pinned to the floor, in the quoted-glob form:

  ```bash
  mise x node@22 -- node --test 'skills/kisou/scripts/*.test.js'
  ```

  Expected: every test passes. Record the version the run resolved beside the
  result, so that "the tests pass on the floor" is a run and not a claim.

**Never the directory form** `node --test skills/kisou/scripts/` — it fails
with `MODULE_NOT_FOUND` on this host (issue-235b, measured 2026-09-10 and
again at this spec's review).

Three prerequisites of that paragraph were run on 2026-09-11, before this
plan was committed, so that batch A does not discover a missing toolchain at
its first Verify: `mise --version` answers, `mise x node@22 -- node --version`
resolves a 22, and the host's own `node --version` is a 24 — the two-level
claim above, measured rather than assumed. The resolved patch versions are
not written here; the batch report records what the run resolved, which is
the point of recording it there.

The repository's `biome-check` hook binds on
`\.(jsx?|tsx?|c(js|ts)|m(js|ts)|d\.(ts|cts|mts)|jsonc?|css)$`, which matches
`.js`, so both created files are formatted and linted by the existing
configuration and **no linter configuration change is needed for them** —
checked 2026-09-11 against `.pre-commit-config.yaml`. The only linter
configuration this plan touches is the hook task 8 adds, which is approved.

### `$KISOU` and `$TANTO`

Both are set **in the same tool call as the command that uses them**; shell
state does not persist between calls, and an unset variable makes the command
read a path at the filesystem root.

- `$KISOU` is the kisou skill's own directory. In this repository the skill is
  `skills/kisou/`, and every command in this plan spells that path in full
  rather than through the variable — the variable is what the **runtime text**
  the plan writes into `SKILL.md` uses, for a user whose skill is installed
  elsewhere.
- `$TANTO` is the tanto skill's own directory, for `passage-check.js`. The
  harness names it when it invokes the tanto skill.

### The created paths

`diff` reads this list; it is why the two new files are not unaccounted added
lines.

```text
created: skills/kisou/scripts/doc-system-check.js
created: skills/kisou/scripts/doc-system-check.test.js
created: docs/reports/2026-09-11-kisou-refresh-dogfood.md
```

The third is the dogfood report task 9 writes. It is listed for the same
reason as the other two: without it, every line of a file this plan
deliberately creates reads as an unaccounted added line at the batch C
boundary.

The plan's own path is **not** listed, and for one commit it was. `diff` had
no exemption for the plan file, so the first edit to this plan after its
commit read as two `unexplained-removed` lines — and every answer Sekkei gives
Kanri's cold read by editing the plan would have done the same at every later
boundary. Reported, and fixed on this branch the same day in "fix(tanto): diff
exempts the plan's own path, so a post-base plan edit is not an unexplained
removal"; the workaround was removed once the fix was measured. A reader of the branch's history will see the line come
and go; this is why.

### `diff`'s base is the last commit before task 1, not the merge base

The branch `kisou-refresh` already carries commits over `main` that no task
of this plan wrote — the spec and its amendments, issue filings, an exit
shoroku, two `skills/tanto/` hotfixes, the plan itself and its own
corrections — and more may land before task 1 begins, because Kanri files
and hotfixes on this branch while Jisso is absent. `git merge-base main HEAD`
reaches back past all of it, and `diff` would report every line as
unaccounted (issue-909c).

**The base is the parent of task 1's first commit** — the commit that adds
the instrument — resolved from the tree rather than written down as a hash:

```bash
git log --diff-filter=A --format=%H -1 -- skills/kisou/scripts/doc-system-check.js
```

Expected: one 40-character commit hash, task 1's commit; its parent, written
`<that hash>^`, is the base. **Before task 1 has committed, the command prints
nothing** and there is no `diff` to run — batch A is not checked this way, and
the first `diff` is at the batch B boundary, by which time the value exists.

Every `diff` invocation in this plan passes that parent as `--base`. It is
stable in both directions that matter: a commit landing before task 1 —
another hotfix, another filing — falls inside the base and is not reported;
a fix round that later edits the instrument does not move it, because
`--diff-filter=A` names the commit that **added** the file. A commit landing
**between** batches that no task wrote is reported, and should be: that is
`diff` doing its job, and its explanation is Kanri's, in the ledger.

This replaced a first form, "the commit that adds this plan", on 2026-09-11,
before task 1: a `skills/tanto/` hotfix landed after the plan's commit and
before any task, and `diff` against the plan's commit reported the hotfix's
every line. The plan's commit is a fixed point in the history; "before
task 1" is the moving one this rule actually wants.

### The commands `replay` does not run

`replay` reads this list the way it reads `created:`. Declared once here
rather than marked line by line:

```text
replay-skip: ./scripts/lint.sh — pre-commit needs the repository and its hook cache, which the applied tree is not
replay-skip: mise — the test runner resolves a toolchain and runs a suite the applied tree does not carry
replay-skip: doc-system-check.js — the instrument is a created path; the applied tree holds only the blobs this plan's passages edit
replay-skip: uv run — the frontmatter load needs this repository's tooling, not a scratch tree
replay-skip: pre-commit run — the hook run needs the repository and its hook cache
replay-skip: docs/reports/ — task 9 reads the reports type's AGENTS.md and writes the dogfood report, neither of which the applied tree carries: it holds only the blobs this plan's passages edit
```

`git` and `passage-check.js verify` are skipped by the script's own rules and
need no declaration.

That second rule was **wrong until this plan's dry run found it**: it read
`/passage-check\.js\s+verify\b/`, which does not match the invocation
`roles/sekkei.md` itself prescribes —
`node "$TANTO/scripts/passage-check.js" verify` — because a closing quote sits
where the rule expects whitespace. All three of this plan's `verify` fences
ran inside the applied tree and reported `MODULE_NOT_FOUND`. It was fixed on
this branch the same day, in "fix(tanto): replay skips the quoted $TANTO form
of verify, not only the bare one", and the plan's own workaround was removed
once the fix was measured. Nothing here depends on it any more; it is written
down because a reader of an older dry-run report will meet the noise.

### The tree encoding and line endings this work must preserve

Measured in this repository on 2026-09-11. `.gitattributes` carries
`* text=auto`, with `eol=lf` for the JavaScript family (`*.js` among them) and
`eol=crlf` for `*.bat`; `core.autocrlf` is `true`. Every **Markdown** and
**YAML** file this plan touches reports `i/lf w/crlf attr/text=auto` under
`git ls-files --eol`; the two `.js` files it creates report
`i/lf w/lf attr/text eol=lf`, pinned rather than inherited.

- Read as UTF-8 and normalize CRLF to LF before any comparison, search, or
  line count. A block written LF against a file checked out CRLF never
  matches, and the failure looks like a missing passage.
- Write with the target file's own ending.
- A file whose endings are mixed is reported, never silently normalized.
  `git ls-files --eol` decides, before and after — never a grep for a control
  character.
- The instrument carries **no shebang** and is always invoked as
  `node <path>`, because the runtime text spells the command
  `node "$KISOU/scripts/doc-system-check.js"` and a reader who is setting
  `$KISOU` needs the interpreter named rather than implied.

### Rule 11 does not apply, and a role may be started at any boundary

This plan edits `skills/kisou/`. The sessions of this run read `skills/tanto/`,
which no task of this plan touches, so the role text on disk is the authority
throughout — the ordinary case, not contract rule 11's (ledger R-1).

**A role may therefore be started or replaced at any batch boundary.** No
batch expects a replacement; none is forbidden one. A session started
mid-plan reads a `skills/kisou/` that may be half-edited, which matters to
nothing it does: no session of this run runs `kisou`, except Jisso in task 7,
by which point every `skills/kisou/` edit has landed.

That is the contract-rule answer. The other half of the question — whether
the **tree** is self-consistent at each boundary — was swept rather than
asserted, by grepping this plan's own new-passage blocks (96 lines across 18
blocks) for every term a later batch lands:

- `CONTRIBUTING`, `dogfood`, and the report's path: **0 hits** anywhere;
- `pre-commit`, `hook`, `kisou-doc-system-check`: hits only in `P8.1` and
  `P8.2`, which are batch C's own blocks and land in one task.

So no batch B passage forward-references anything batch C lands, and the two
boundaries hold:

- **At the batch A boundary** the instrument exists and no text refers to it.
  `skills/kisou/README.md`'s Layout does not yet list `scripts/`, and
  `SKILL.md` does not yet name the script. That is an omission, not a
  contradiction — nothing points at a file that is missing, which is the
  failure mode that matters — and the hook that would enforce the invariant is
  not wired until batch C, so nothing fails.
- **At the batch B boundary** the skill text names the instrument and the
  instrument exists. This repository's own copies are still the two items
  short of level, which is deliberate: task 6 measures exactly that, and
  batch C closes it.

### The workspace

**No worktree.** All roles share the working tree and the branch
`kisou-refresh`. Kanri verifies the tree in place and the human can watch it.

---

## Batches

Three batches, nine tasks.

| Batch | Tasks | Delivers | Stop conditions at the boundary |
| --- | --- | --- | --- |
| A | 1 expansion, the target set, the fingerprint, the section split; 2 `check`; 3 `apply --items` and the insertion position | the instrument and its tests | the tests pass under `mise x node@22 -- node --test 'skills/kisou/scripts/*.test.js'`, with the resolved version recorded; `./scripts/lint.sh` on both `.js` paths shows a **JavaScript hook running**, not `(no files to check) Skipped`; `check --docs docs --case snake_case` exits **1 with two items** on this repository |
| B | 4 `SKILL.md`, P4.1–P4.11; 5 `README.md`, P5.1–P5.3; 6 the sweep-and-check on this repository's seven copies | the skill text level with the spec | `passage-check.js diff` clean against the last commit before task 1; the `description` frontmatter line loads as YAML and carries no `: `; `grep -c 'doc-system-check' skills/kisou/SKILL.md` ≥ 2 and `skills/kisou/README.md` ≥ 1; `check` still exits 1 with the same two items, recorded verbatim in the batch report |
| C | 7 the dogfood; 8 the hook, the `CONTRIBUTING.md` line; 9 the dogfood report | this repository level, with the check wired | `check --docs docs --case snake_case` exits **0**; `uv tool run pre-commit run kisou-doc-system-check --all-files` passes; `grep -c 'kisou-doc-system-check' .pre-commit-config.yaml` = 1; `passage-check.js diff` clean; every `O` needle at its stated disposition, hits printed |

**The spec's nine test cases, and where they land.** The spec allocates them
1, 3, 7 to task 1; 2, 4, 6, and 8's first half to task 2; and 5, 6's second
half, 8's second half, and 9 to task 3. This plan follows that with **one
deviation**: test case 2's second sentence — "`apply` with all seven yields
identity" — is in **task 3**, not task 2, because task 2 does not build
`apply` and a test cannot precede the subcommand it calls. Its first sentence,
the seven `create` items and exit 1, stays in task 2. Test case 8 also gains a
**third** part in task 3, from the BOM ruling in the specification below.

**Batch C's order 7 → 8 → 9 is load-bearing.** The commit that adds the hook
runs the hook, and the hook passes only on a level tree. Task 7 is what makes
the tree level. Reordering them makes task 8's own commit fail.

**No planned replacement.** No batch expects one, and — per Global
Constraints — none is forbidden one either.

Two tasks are called out because their size is the data issue-7281 asks for,
not because anything is wrong with them.

- **Task 6 is a sweep-and-check shape**: its deliverable is recorded output,
  not a file. Its dispatch tells the reviewer to **re-run** the command rather
  than read the report, because the output is the deliverable.
- **Task 7 is a sweep-and-check shape too**, and additionally the only task
  that runs another skill. Its deliverable is the run's transcript and the two
  accepted writes; the file it changes, it changes through `kisou`.

---

## How a batch is verified

Named by name. Every command runs in Git Bash from the repository root, and
the implementer records its output before and after — the output is the
evidence subagent-driven development asks for.

1. **Lint**, on every changed path, each named individually:
   `./scripts/lint.sh <path> [<path> ...]`. On the two `.js` paths a
   JavaScript hook must appear as **run**, not as `(no files to check)
   Skipped`: presence of the hook in the configuration is not a match on the
   path, and a lint that matches no hook passes and proves nothing.

2. **The tests**, on the declared floor, in the quoted-glob form, with the
   version the run resolved recorded beside the result:

   ```bash
   mise x node@22 -- node --test 'skills/kisou/scripts/*.test.js'
   ```

   Expected: every test passes.

3. **The instrument on this repository**, which is this plan's acceptance
   test and changes value exactly once:

   ```bash
   node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case
   ```

   Expected: after batch A and after batch B, exit 1 with two `replace` items
   and no note; after batch C, `0 items, 0 notes` and exit 0. The change of
   that value is batch C's acceptance test.

4. **A real YAML load of `SKILL.md`'s frontmatter**, from batch B on — the
   `description` line must not carry `: ` (colon-space), which breaks the
   frontmatter parse silently:

   ```bash
   uv run --no-project --with pyyaml python -c "import yaml,io; yaml.safe_load(io.open('skills/kisou/SKILL.md',encoding='utf-8').read().split('---')[1])"
   ```

   Expected: no output and exit 0.

   ```bash
   ! sed -n 's/^description: //p' skills/kisou/SKILL.md | grep -q ': '
   ```

   Expected: no output and exit 0. The `!` is not decoration: `grep -q` with
   no match exits 1, and a Verify step read by exit code would call the pass a
   failure.

5. **The boundary check, from the batch B boundary on** — both options are
   required, and the base is the parent of task 1's first commit, never the
   merge base:

   ```bash
   TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" diff --plan docs/superpowers/plans/2026-09-11-kisou-refresh.md --base "$(git log --diff-filter=A --format=%H -1 -- skills/kisou/scripts/doc-system-check.js)^"
   ```

   Expected: every passage block applied exactly, no unaccounted added line,
   no unexplained removed line, and the three `created:` paths named as
   exempted. Batch A is not checked this way: it carries no passages, its two
   files are the exemption, and the base does not resolve until task 1 has
   committed.

6. **The content greps**, each stated by the task that lands it:
   `grep -c 'doc-system-check' skills/kisou/SKILL.md` ≥ 2 and
   `skills/kisou/README.md` ≥ 1 after batch B;
   `grep -c 'kisou-doc-system-check' .pre-commit-config.yaml` = 1 after
   batch C.

7. **The old-value sweep, at the batch C boundary.** Every `O` needle at its
   stated disposition over `skills/kisou/` and `docs/design/c1d2-kisou.md`,
   **with the hits printed rather than counted**, and the raw count compared
   with the raw count the plan records. A qualifier such as "outside the
   passages" is not what the command returns, and a needle that wraps in its
   target returns `0`, which reads as "already gone".

8. **The hook, run by id over all files**, at the batch C boundary:

   ```bash
   uv tool run pre-commit run kisou-doc-system-check --all-files
   ```

   Expected: `Passed`. `./scripts/lint.sh` on the changed path alone would
   **skip** this hook, because `.pre-commit-config.yaml` does not match the
   hook's own `files:` pattern — a lint that skips the hook is not a run of
   it.

9. **Line endings**, in two parts, because they are two different claims:

   ```bash
   git ls-files --eol skills/kisou/SKILL.md skills/kisou/README.md .pre-commit-config.yaml CONTRIBUTING.md
   ```

   Expected: `i/lf w/crlf attr/text=auto` on every one, and never `w/mixed`.

   ```bash
   git ls-files --eol docs/notes/AGENTS.md docs/reports/AGENTS.md
   ```

   Expected: `i/lf w/lf attr/text=auto` on both, and never `w/mixed`. These
   two are the **only** doc-system copies whose working-tree copy is LF —
   measured 2026-09-11, and the same fact that makes them the two that
   drifted (a tool wrote them after checkout). `apply` writes a file with the
   ending it already has, so the dogfood leaves them LF; the index is LF
   either way, and a later fresh checkout may turn them CRLF without anything
   being wrong. `w/mixed` is the failure, at any point.

   ```bash
   git ls-files --eol skills/kisou/scripts/doc-system-check.js skills/kisou/scripts/doc-system-check.test.js
   ```

   Expected: `i/lf w/lf attr/text eol=lf` on both — pinned by
   `.gitattributes`, not inherited, so a checkout produces LF too. Note the
   `attr/` field: it reads `attr/text eol=lf`, not `attr/text=auto`.

10. **The trailer**, per commit, in a loop over the batch's commits, grepping
    the prefix `Co-Authored-By: Claude`.

A stop condition worded as a property of the whole tree is backed by a command
that sweeps the whole tree, not only the files the batch wrote. Checks 3, 7,
8 and 9 are those.

---

## What an executor needs cold

You are dispatched into one task and see only it. This section is what the task
assumes and does not repeat.

**kisou** is a skill in this repository, at `skills/kisou/`. It stands up
(`scaffold`) or retrofits (`migrate`) a project's standard structure: the
repo-root Markdown — `README.md`, `CONTRIBUTING.md`, `CLAUDE.md`, `AGENTS.md`,
which this plan and the spec call **layer B** — and the `docs/`
document-management system, which this plan calls the **doc-system**. It
carries its own copies of every file it writes under
`skills/kisou/templates/`, and the doc-system templates are the seven files
under `skills/kisou/templates/docs/`.

**A doc-system copy** is one of those seven templates, expanded and installed
in a project. The seven **targets** under a docs root are:

```text
AGENTS.md
requirements/AGENTS.md
design/AGENTS.md
decisions/AGENTS.md
issues/AGENTS.md
notes/AGENTS.md
reports/AGENTS.md
```

A template holds `{{name}}` placeholders — `{{docs}}`, `{{requirements}}`,
`{{notes}}` and so on — which kisou expands per the project's `case`
convention. For `snake_case` a name expands to itself; for `PascalCase`,
`docs → Documents`, `src → Source`, and every other name is title-cased. This
repository is `snake_case`, so its docs root is `docs/` and its expanded copies
are the seven paths above under `docs/`.

**Byte equality with the expanded template is the invariant** (spec fixed input
7). The template is the source. Nobody edits an installed copy directly; a
wanted change goes into the template and reaches the copy through a refresh. A
difference that is only line-wrapping still breaks the invariant and is
proposed for replacement — that is the drift this plan measures and closes on
this repository. It is also why no task in this plan edits
`skills/kisou/templates/**`: a template body change is out of scope, and a
hand edit to `docs/**/AGENTS.md` is forbidden even where the outcome would look
right. Those two files are written by the instrument, through the dogfood.

**`$KISOU`** is the kisou skill's own directory, set in the same tool call as
the command that uses it — the `$TANTO` convention this repository already
uses, for the same reason: shell state does not persist between tool calls, and
an unset variable makes the command read a path at the filesystem root. Runtime
text (`SKILL.md`) spells the instrument's command as
`node "$KISOU/scripts/doc-system-check.js" …`. Inside this repository, where
the path is known, the same command is written `node
skills/kisou/scripts/doc-system-check.js …`.

**The shell.** This host's primary shell is PowerShell, but every fenced block
in this plan is a Git Bash block run from the repository root. A POSIX
`grep -c '…'` pipeline is unrunnable in PowerShell; run it in Git Bash or not
at all. The Windows equivalent of `./scripts/lint.sh` is `scripts\lint.bat`
with the same arguments.

**The test command** is always the quoted-glob form:

```text
mise x node@22 -- node --test 'skills/kisou/scripts/*.test.js'
```

Never the directory form `node --test skills/kisou/scripts/` — it fails with
`MODULE_NOT_FOUND` on this host (issue-235b, measured on 2026-09-10 and again
at this spec's review).

---

## File structure

Two files are created, and the dogfood report is a third. The `created:` list
`diff` reads is in Global Constraints, above; it is written once and not
repeated here.

- `skills/kisou/scripts/doc-system-check.js` — the whole instrument: argument
  parsing, `{{name}}` expansion, the target set, the fingerprint, the
  fence-aware section split, the comparison, the report, and `apply`. One
  file, because the skill ships a directory of two files and a reader who
  opens it should hold the whole decision procedure at once. CommonJS,
  `'use strict'`, no shebang — it is always invoked as `node <path>`, because
  the runtime text names the interpreter rather than implying it and a reader
  setting `$KISOU` needs to see it.
- `skills/kisou/scripts/doc-system-check.test.js` — the suite, beside it, run
  by `node --test`. Every task appends to this one file; no task rewrites what
  an earlier one wrote.

Files modified, and what each carries:

- `skills/kisou/SKILL.md` — the eleven passages of spec section 2: the Node
  prerequisite, the `tidy` condition stated once, the scripts prompt
  referring to Step 2, the `full` class setting no scope, the doc-system
  fingerprint line, which angle brackets are free text, the doc-system
  refresh becoming the instrument, the "leave alone and report" fall-through,
  the per-artifact `docs/` line, the prohibited `.bak` offer, and the sentence
  issue-2bf9 was filed against.
- `skills/kisou/README.md` — the three places of spec section 3, reviewed after
  `SKILL.md` as this repository's `AGENTS.md` requires.
- `.pre-commit-config.yaml` — one hook in the existing `repo: local` block.
- `CONTRIBUTING.md` — one line in Prerequisites naming `node` (22 or later).
- `docs/notes/AGENTS.md` and `docs/reports/AGENTS.md` — **written by the
  instrument's `apply`, through the dogfood run, never by hand.**
- `docs/reports/2026-09-11-kisou-refresh-dogfood.md` — created by the report
  task, in the shape `docs/reports/AGENTS.md` sets.

---

## The instrument's specification

This section is the contract for `doc-system-check.js`. It restates spec
section 1 as something an implementer works from; where the spec left a detail
to the implementer, the choice is marked **(chosen here)** and is binding on
every task.

### The command line

```text
node skills/kisou/scripts/doc-system-check.js check --docs <dir> [--templates <dir>] [--case snake_case|PascalCase]
node skills/kisou/scripts/doc-system-check.js apply --items <n,…> --docs <dir> [--templates <dir>] [--case snake_case|PascalCase]
```

| Option | Meaning | Default |
| --- | --- | --- |
| `--templates <dir>` | the bundled `docs` templates | `../templates/docs`, resolved from the script's own path |
| `--docs <dir>` | the target docs root (`docs/` or `Documents/`) | required |
| `--case snake_case\|PascalCase` | the `{{name}}` expansion | derived from the docs root's basename: `Documents` → `PascalCase`, otherwise `snake_case` |
| `--items <n,…>` | `apply` only: the item numbers to write | required for `apply` |

Parsing is `node:util`'s `parseArgs` with `allowPositionals: true`, the
positional being the subcommand and every option `type: 'string'`. A
subcommand the vector does not name, an unknown option, an absent `--docs`, or
a `--case` value that is neither of the two, prints usage on stderr and exits
2. `--items` is split on commas, each field trimmed; every field must be a
decimal integer of 1 or more; a repeated number is applied once, not twice
**(chosen here — the spec is silent; a repeat is a typo, not an error)**.
`--items` given to `check` is **exit 2**, not silently ignored **(chosen here
— one option table serves both subcommands, so `check --items 3` would
otherwise parse and be discarded, and an operator who typed it meant `apply`)**.

### Expansion and the target set

`expandName(name, case)` — for `snake_case`, the name as written; for
`PascalCase`, `docs → Documents`, `src → Source`, and every other name
title-cased (first character upper, rest unchanged). The mapping is one table
in the script, the same names `SKILL.md` Step 2 lists: the dir names
`docs`, `src`, `tests`, `scripts`, `requirements`, `design`, `decisions`,
`issues`, `notes`, `reports`. `expandTemplate(text, case)` replaces every
`{{name}}` occurrence with `expandName(name, case)`.

The seven targets, in this order — the order the report uses:

| # | Template, under `--templates` | Target, under `--docs` |
| --- | --- | --- |
| 1 | `AGENTS.md` | `AGENTS.md` |
| 2 | `requirements/AGENTS.md` | `<requirements>/AGENTS.md` |
| 3 | `design/AGENTS.md` | `<design>/AGENTS.md` |
| 4 | `decisions/AGENTS.md` | `<decisions>/AGENTS.md` |
| 5 | `issues/AGENTS.md` | `<issues>/AGENTS.md` |
| 6 | `notes/AGENTS.md` | `<notes>/AGENTS.md` |
| 7 | `reports/AGENTS.md` | `<reports>/AGENTS.md` |

`<type>` in the target column is the expanded directory name. The status
subdirectories under `issues/` are not targets and are not created — by this
tool or by kisou.

A `--docs` directory that does not exist is a docs root with seven absent
targets: seven `create` items, exit 1, not an error. A `--docs` path that
exists and is not a directory is exit 2, as is a path that exists and cannot
be read.

**Whether a target exists is decided by an exact-name directory lookup**
(`fs.readdirSync` of the parent directory and an exact string match), not by
`fs.existsSync` **(chosen here — the spec is silent, and this host's
filesystem is case-insensitive, so `existsSync('docs/requirements/AGENTS.md')`
returns true for an installed `docs/Requirements/AGENTS.md` and the `--case`
guard below could never fire)**.

**The `--case` derivation guard.** When `--case` is omitted, count how many of
the **six per-type** targets exist under the derived case and how many exist
under the other case; the root target's path is the same under both cases and
carries no evidence, so it is not counted **(chosen here — the spec says
"none of the seven … while the other finds at least one", which as written
never fires, since the root target is common to both cases)**. When the
derived case finds none and the other finds at least one, exit 2 with a
message telling the operator to pass `--case`, rather than proposing six
creates over an intact doc-system whose root is named neither `docs` nor
`Documents`.

### Reading a file

Files are read as UTF-8. On read, a leading byte-order mark (U+FEFF) is
stripped, `\r\n` becomes `\n`, and the trailing newlines are reduced to
exactly one. Every comparison, split and line count runs on that result, so a
difference of line endings or of a BOM alone is not a divergence. Line
wrapping is **not** normalized: a paragraph wrapped at a different column is a
divergence, which is exactly the drift issue-acc0 measured.

`apply` writes a file with the line ending the target already uses — `\r\n`
when its first line ended so, `\n` otherwise — and a `create` writes `\n`. A
file `apply` writes **keeps the byte-order mark the target had**, and a
`create` writes none **(ruled by Sekkei; the draft chose the opposite)**. The
reason is the reason `apply` keeps the target's line ending: the spec says in
so many words that a difference of line endings **or of a BOM** alone is not a
divergence, so neither is a change the user accepted when they accepted an
item, and `apply` writes the item and nothing else. Dropping the BOM would be
a byte change to a file whose BOM nobody proposed removing — the one thing
this whole plan exists to stop. Every written file ends with exactly one
trailing newline.

Test case 8 therefore carries a third part: a BOM'd copy with one diverged
section — `apply` restores the section **and** writes the BOM back.

### The section split

Both the expanded template and the target are split into sections at every
**ATX** heading line — one to six `#`, at most three leading spaces, then a
space — that is outside a fenced code block.

- A fence opens with a run of three or more backticks or tildes and closes
  with a run of the same character at least as long. An indented code block is
  not a fence, and a `#` inside one is not a heading either, since it is
  indented four spaces and the ATX rule allows at most three.
- A leading YAML frontmatter block — `---` on line 1, through the next `---`
  line — is skipped, so a `#` inside it is not a heading.
- Setext headings (a text line underlined with `===` or `---`) are **not**
  recognized. A target that uses one for its H1 fails the fingerprint and is
  reported as not kisou-managed, which is the safe side.
- A heading inside a fence is body text. The bundle has two of these: the
  `# POSIX` and `# PowerShell` comments in the root template's command blocks,
  and the `## Context` / `## Options` / `## Decision` / `## Consequences`
  lines in the ADR template's `text`-fenced body sketch. An implementation
  that missed the fence rule would split the decisions template into five
  extra sections and propose four bogus additions to every installed copy.
- A section is its heading line and every line up to the next heading, flat,
  with no nesting: a `###` under a `##` is its own section.
- Lines before the first heading are the **preamble**: neither fixed nor
  author text, left as they are, never reported. The seven templates have no
  preamble, so on a level tree the preamble is empty.

A section's **identity** is its heading line's text, exactly. Its **body** is
every line after the heading up to the next heading. Two bodies are compared
**after trailing blank lines are removed from each**, and every other line —
blank lines inside the body included — is compared exactly. A section is
**written** as its heading, its body without trailing blank lines, and then
one blank line if another section follows it in the file and nothing if it is
the file's last. **(Ruled by Sekkei. The plan's first draft compared bodies
including their trailing blank lines, which is the more literal reading of the
spec's "compared exactly after the normalization"; the plan review measured
that it does not converge, and the paragraph below says why.)**

**Why the trailing blank lines are excluded.** They are not information the
format can hold at the end of a file: `normalize` reduces a file's trailing
newlines to exactly one, so the last section's body can never end in a blank
line no matter what is written there. Comparing them therefore makes two
things go wrong, both measured at this plan's review:

- **A `replace` on a file's last section never converges** when the template's
  body for it ends with a blank line — which it does for every section the
  template does not itself end with. `apply` writes the blank line, the
  trailing-newline rule trims it, and the next `check` reports the same item
  again. This is reachable on a real tree: it is any copy that is missing the
  sections after the one being replaced. A permanently failing `check` is a
  permanently failing pre-commit hook on a tree nobody can level.
- **Deleting a section makes its predecessor diverge**, because the blank line
  that used to separate them went with it. Every fixture built by deleting a
  trailing section gains a spurious `replace` item.

**What this costs, stated plainly.** A copy that differs from its expanded
template *only* in the number of blank lines between two sections is not
reported, and byte equality — the invariant of the spec's fixed input 7 — is
therefore enforced up to line endings, a byte-order mark, **and** inter-section
blank-line count, and — counted by the whole-branch review on 2026-09-11 and
closed by the fix wave — the text before a target's first heading, which the
section split leaves to a note. The first two exemptions are the spec's, and
the fourth is the review's; this third one is
this plan's, and it is the price of convergence. It is not reachable by the
drift the tool exists to catch: a rewrap changes the words on a line, never the
count of blank lines between two headings. A section written by `apply` always
gets exactly one separating blank line, which is what all seven templates use,
so an accepted item leaves the file byte-equal to the expanded template.

The template's headings are the **fixed sections**. Every template section is
fixed-text: the doc-system templates carry no `TEMPLATE FILL` block, measured
2026-09-11, so the free-text test is a layer-B test and does not apply here. A
heading in the target that the template does not have is an **author-added
section** — reported, never written, never moved. When a heading repeats in
the target, the first occurrence is the fixed section and every later one is
an author-added section, reported by heading. A **template** in which a
heading repeats is a template error, exit 2, as is a template with no H1;
neither is true of the seven, measured fence-aware at this spec's review.

### The fingerprint

A target that exists is **kisou-managed** when its first heading, read
fence-aware, is exactly the expanded template's H1:

- root — `# AGENTS.md`, **and** the file also carries a `## Document
  management` heading. That second condition is what keeps a layer-B
  `AGENTS.md` copied into the docs root from passing.
- a type — `# <type>/ — AGENTS` expanded, e.g. `# requirements/ — AGENTS`
  under `snake_case` and `# Requirements/ — AGENTS` under `PascalCase`.

A target whose first heading is anything else, or that has no heading at all,
is **not kisou-managed**: the script reports it and proposes nothing for it. A
root whose H1 matches but which lacks `## Document management` gets its own
note rather than the generic one — because that heading is also a fixed
section, and the generic note would hide that the file is one `add` away from
refreshable — and, like any target that fails the fingerprint, draws no item.

### `check` — the report

`check` prints to stdout a numbered list, one item per proposed change, in a
deterministic order: the seven templates in the order of the table above and,
within a file, the template's section order. Numbering is global across files
and starts at 1. The item kinds:

- **`create`** — the target is absent. The item writes the whole expanded
  template.
- **`add`** — the target is kisou-managed and a fixed section is missing. The
  item inserts the expanded section at the position the insertion rule gives
  it.
- **`replace`** — the target is kisou-managed and a fixed section's body
  differs. The item replaces the section's body with the template's, and is
  followed by the whole section both ways: every line of the target's body
  prefixed `-`, then every line of the template's body prefixed `+`. No
  line-matching algorithm — the sections are short, and a rewrap, the case the
  dogfood pins, is unreadable as a matched diff and plain as two blocks.

The printed forms **(chosen here — the spec fixes the note lines and the
summary line but not the item line, and test case 4 asserts the item's text
exactly, so it must be pinned somewhere)**:

```text
<n>. create: <path>
<n>. add: <path> — <heading line>
<n>. replace: <path> — <heading line>
```

A `replace` item's diff follows its item line immediately, one line per body
line, no blank line between: a non-empty body line prints as `- ` (or `+ `)
followed by the line; an empty body line prints as a bare `-` (or `+`), with
no trailing space. The `-` block comes first, whole, then the `+` block.

`<path>` is the target's path as the operator would type it — `--docs` joined
with the target's relative path, with backslashes rewritten to forward slashes
so the output reads the same on both platforms **(chosen here — the spec is
silent, and a Windows-shaped path in the dogfood report would not match the
one the hook prints)**.

After the numbered items come the notices, which are not items, have no
number, and cannot be applied — in the same file order, and within a file
author-section notes in the target's own order:

```text
note: <path> — author section kept: <heading line>
note: <path> — not kisou-managed: first heading is <text>, expected <text>
note: <path> — kisou-managed by H1, but the "## Document management" heading is missing; restore it by hand
```

In the second line, `<text>` is the whole heading line on both sides, and
`(none)` when the file has no heading at all. The third line is the root-only
case above. **(The first two forms are the spec's, verbatim; the third's
wording is chosen here.)**

`check` ends with one summary line — `<n> items, <m> notes`, with `item` and
`note` in the singular when the count is exactly 1 **(chosen here)**. An
item's number is the handle `apply` takes, and a `check` on an unchanged tree
prints the same numbers again.

### Insertion position

An added section takes the position the template gives it, relative to the
fixed sections around it (issue-f623):

1. directly after the end of the nearest **preceding** template section that
   exists in the target;
2. when none precedes it in the target, directly before the nearest
   **following** template section that exists;
3. when neither exists, at the end of the file.

Rules 2 and 3 are defensive: a kisou-managed target passed the fingerprint, so
it has the template's H1 section, and every other template section therefore
has at least one preceding template section present. They are implemented
anyway, because the rule is the spec's and a future fingerprint change would
reach them.

An author-added section stays where the author put it, because the rule counts
template sections only. The inserted text is the template's section — its
heading line and its body with trailing blank lines removed — written by the
one writing rule above: one blank line before the section that follows it, and
none when it is the file's last. That rule covers the end-of-file case the
spec's "a blank line separates the inserted section from its neighbors as the
template's own spacing does" leaves open, without a second rule for it.

### `apply --items <n,…>`

`apply` recomputes the same list `check` would print, takes the numbers given,
and resolves each to an item's **identity** — path, kind, heading — from that
list. Then it writes them in list order, and **after every write it recomputes
the list from the tree as it now is** and finds the next accepted item by
identity, so an `add` whose anchor another accepted `add` just created lands
after it, in template order. A `create` writes the file, creating its
directory; an `add` inserts; a `replace` substitutes the body. A section the
user did not accept is left exactly as it was, and partial acceptance is the
normal case, not the exception.

`apply` refuses to run with no `--items`, refuses a number past the end of the
list, and refuses a number that is not an item — a note has no number, so any
number a note might seem to occupy is simply past the list or another item.
Each refusal is exit 2 with nothing written. A write failure is exit 2. On
success it prints the items it applied, in the `check` item form, then the
line `<n> items applied` **(chosen here — the spec says "it prints the items
it applied, in the `check` form" and does not fix a closing line)**, and exits
0. That printout is also the only guard against the tree having moved between
the operator's `check` and the `apply`: the numbers are re-derived, not
stored, and what was written is shown.

### Exit codes

| Code | `check` | `apply` |
| --- | --- | --- |
| 0 | no items (notes may exist) | every requested item written |
| 1 | one or more items | — |
| 2 | bad arguments, an unreadable template, a target that exists and cannot be read, a template with no H1 or with a repeated heading, a `--case` derivation that finds no target while the other case finds one | bad arguments, no `--items`, an item number that does not exist, a write failure |

Everything the report prints goes to stdout; every exit-2 message goes to
stderr, prefixed `error: ` **(chosen here)**. The pre-commit hook uses
`check`'s code as it is: a level tree exits 0.

### Module format and dependencies

CommonJS, `'use strict'`, `node:fs`, `node:path`, `node:util` (`parseArgs`),
and nothing else; the line diff is the script's own. No `package.json`, no
`node_modules`, no lockfile, no dependency step in any task. The floor is
**Node 22**, stated in the script's header comment. Node 24 is what this
machine runs; the tests run under the floor through `mise x node@22`, as the
tanto instrument's do. The repository's biome hook binds on `.js`, so both
files are formatted and linted by the existing configuration with no addition
— write double-quoted strings and two-space indent, as
`skills/tanto/scripts/passage-check.js` does, and let `lint` settle the rest.

---

## Task 1: expansion, the target set, the fingerprint, and the section split

Test cases 1, 3 and 7 of the spec. This task creates both files and delivers a
`check` that resolves the seven targets, classifies each, prints the notes and
the summary line, and exits 0 — the comparison it computes is exposed as a
unit and is not yet turned into items, which is the next task.

**Files:**

- Create: `skills/kisou/scripts/doc-system-check.js`
- Create (test): `skills/kisou/scripts/doc-system-check.test.js`

**Interfaces:**

- Consumes: nothing from an earlier task. The section "The instrument's
  specification" above is the contract for this file; read it first.
- Produces, for tasks 2 and 3, the module surface they extend:

```js
module.exports = {
  normalize,
  expandName,
  expandTemplate,
  targetSet,
  splitSections,
  firstHeading,
  classify,
  compareSections,
  main,
};
```

- `normalize(text)` → `string`. Strips a leading BOM, turns `\r\n` into `\n`,
  reduces trailing newlines to one. Every comparison, split and line count in
  the program runs on its result.
- `expandName(name, kase)` → `string`, and `expandTemplate(text, kase)` →
  `string`, as the specification's expansion table gives them.
- `targetSet(kase)` → an array of seven
  `{ type, template, target }` objects in the specification's order. `type` is
  `"root"` or the unexpanded type name; `template` is the path under the
  templates directory and `target` the path under the docs root, both with
  forward slashes.
- `splitSections(text)` → `{ frontmatter, preamble, sections }`, where
  `frontmatter` and `preamble` are arrays of lines and `sections` is an array
  of `{ heading, body }`, `heading` being the whole heading line and `body` an
  array of lines.
- `firstHeading(text)` → the whole first heading line, or `null`.
- `classify(text, expandedTemplate, isRoot)` →
  `{ managed, found, expected, missingDocManagement }`. `found` is the target's
  first heading line or `null`; `expected` is the template's H1;
  `missingDocManagement` is true only for a root whose H1 matched and which
  carries no `## Document management` heading, and such a root has
  `managed: false`.
- `compareSections(templateSections, targetSections)` →
  `{ missing, diverged, authorAdded }`. `missing` and `diverged` are arrays of
  heading lines in template order; `authorAdded` is an array of heading lines
  in the target's own order, and a heading that repeats in the target
  contributes its second and later occurrences to it.
- `main(argv)` → the process exit code, `argv` being `process.argv.slice(2)`.
  Tasks 2 and 3 add to its dispatch.

- [ ] **Step 1: Write the failing test file**

Create `skills/kisou/scripts/doc-system-check.test.js` with exactly this
content. Two fixture builders carry the whole suite: `expandBundle` installs
the **real** seven templates, which is what test case 1 is about, and
`fakeTemplates` writes a seven-file miniature whose bodies this plan controls,
which is what lets a later task assert the report's text to the byte.

````js
"use strict";

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const {
  normalize,
  expandName,
  expandTemplate,
  targetSet,
  splitSections,
  firstHeading,
  classify,
  compareSections,
} = require("./doc-system-check.js");

const SCRIPT = path.join(__dirname, "doc-system-check.js");
const TEMPLATES = path.join(__dirname, "..", "templates", "docs");
const TYPES = ["requirements", "design", "decisions", "issues", "notes", "reports"];

function tmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "doc-system-check-"));
}

function run(args) {
  try {
    const out = execFileSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" });
    return { code: 0, out };
  } catch (err) {
    return { code: err.status, out: `${err.stdout || ""}${err.stderr || ""}` };
  }
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, "utf8");
}

/** Install the real bundle, expanded, under `docsDir`. */
function expandBundle(docsDir, kase, templatesDir = TEMPLATES) {
  for (const t of targetSet(kase)) {
    const source = read(path.join(templatesDir, t.template));
    write(path.join(docsDir, t.target), expandTemplate(source, kase));
  }
}

/** A seven-file miniature bundle whose bodies this suite controls. */
function fakeTemplates(dir) {
  write(
    path.join(dir, "AGENTS.md"),
    "# AGENTS.md\n\nRoot intro.\n\n## Document management\n\nRoot rules.\n",
  );
  for (const type of TYPES) {
    write(
      path.join(dir, type, "AGENTS.md"),
      `# {{${type}}}/ — AGENTS\n\nIntro.\n\n## File\n\nFile body.\n\n## Body\n\nBody body.\n\n## Growth\n\nGrowth body.\n`,
    );
  }
  return dir;
}

/** A docs root holding the expanded miniature bundle. */
function fakeInstall(kase = "snake_case") {
  const root = tmp();
  const templates = fakeTemplates(path.join(root, "templates"));
  const docs = path.join(root, "docs");
  expandBundle(docs, kase, templates);
  return { root, templates, docs };
}

const posix = (p) => p.split(path.sep).join("/");

test("normalize strips a BOM, folds CRLF, and collapses trailing newlines", () => {
  assert.strictEqual(normalize("﻿a\r\nb\r\n\n\n"), "a\nb\n");
  assert.strictEqual(normalize("a\n"), "a\n");
});

test("expandName follows the case-aware mapping", () => {
  assert.strictEqual(expandName("docs", "snake_case"), "docs");
  assert.strictEqual(expandName("requirements", "snake_case"), "requirements");
  assert.strictEqual(expandName("docs", "PascalCase"), "Documents");
  assert.strictEqual(expandName("src", "PascalCase"), "Source");
  assert.strictEqual(expandName("requirements", "PascalCase"), "Requirements");
  assert.strictEqual(expandName("reports", "PascalCase"), "Reports");
});

test("expandTemplate replaces every placeholder occurrence", () => {
  assert.strictEqual(
    expandTemplate("{{docs}}/{{notes}}/x — {{notes}}", "PascalCase"),
    "Documents/Notes/x — Notes",
  );
});

test("the target set is seven entries in the report's order", () => {
  const snake = targetSet("snake_case");
  assert.deepStrictEqual(
    snake.map((t) => t.target),
    [
      "AGENTS.md",
      "requirements/AGENTS.md",
      "design/AGENTS.md",
      "decisions/AGENTS.md",
      "issues/AGENTS.md",
      "notes/AGENTS.md",
      "reports/AGENTS.md",
    ],
  );
  assert.deepStrictEqual(
    snake.map((t) => t.template),
    [
      "AGENTS.md",
      "requirements/AGENTS.md",
      "design/AGENTS.md",
      "decisions/AGENTS.md",
      "issues/AGENTS.md",
      "notes/AGENTS.md",
      "reports/AGENTS.md",
    ],
  );
  assert.deepStrictEqual(
    targetSet("PascalCase").map((t) => t.target),
    [
      "AGENTS.md",
      "Requirements/AGENTS.md",
      "Design/AGENTS.md",
      "Decisions/AGENTS.md",
      "Issues/AGENTS.md",
      "Notes/AGENTS.md",
      "Reports/AGENTS.md",
    ],
  );
});

// --- test case 1: identity -------------------------------------------------

test("the expanded snake_case bundle is level with its templates", () => {
  const docs = path.join(tmp(), "docs");
  expandBundle(docs, "snake_case");
  const result = run(["check", "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /^0 items, 0 notes$/m);
});

test("the expanded PascalCase bundle is level, with the case derived", () => {
  const docs = path.join(tmp(), "Documents");
  expandBundle(docs, "PascalCase");
  const result = run(["check", "--docs", docs]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /^0 items, 0 notes$/m);
});

test("compareSections finds nothing between a template and its own copy", () => {
  const source = read(path.join(TEMPLATES, "requirements", "AGENTS.md"));
  const expanded = expandTemplate(source, "snake_case");
  const compared = compareSections(
    splitSections(expanded).sections,
    splitSections(expanded).sections,
  );
  assert.deepStrictEqual(compared, { missing: [], diverged: [], authorAdded: [] });
});

// --- test case 3: the fingerprint -----------------------------------------

test("a type copy with a foreign H1 is a note, not an item", () => {
  const { templates, docs } = fakeInstall();
  write(path.join(docs, "requirements", "AGENTS.md"), "# Requirements\n\nOurs.\n");
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.ok(
    result.out.includes(
      `note: ${posix(docs)}/requirements/AGENTS.md — not kisou-managed: first heading is # Requirements, expected # requirements/ — AGENTS`,
    ),
  );
  assert.match(result.out, /^0 items, 1 note$/m);
});

test("a root with the right H1 but no document-management heading is a note", () => {
  const { templates, docs } = fakeInstall();
  write(path.join(docs, "AGENTS.md"), "# AGENTS.md\n\nRoot intro.\n");
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.ok(
    result.out.includes(
      `note: ${posix(docs)}/AGENTS.md — kisou-managed by H1, but the "## Document management" heading is missing; restore it by hand`,
    ),
  );
  assert.match(result.out, /^0 items, 1 note$/m);
});

test("classify reports what it found and what it expected", () => {
  const template = "# requirements/ — AGENTS\n\nIntro.\n";
  assert.deepStrictEqual(classify(template, template, false), {
    managed: true,
    found: "# requirements/ — AGENTS",
    expected: "# requirements/ — AGENTS",
    missingDocManagement: false,
  });
  const foreign = classify("Prose first.\n\n# Something\n", template, false);
  assert.strictEqual(foreign.managed, false);
  assert.strictEqual(foreign.found, "# Something");
  const headless = classify("Just prose.\n", template, false);
  assert.strictEqual(headless.managed, false);
  assert.strictEqual(headless.found, null);
});

// --- test case 7: fences, frontmatter, setext, preamble --------------------

test("a hash inside a backtick fence is not a heading", () => {
  const split = splitSections("# H\n\n```bash\n# POSIX\n```\n\n## Real\n\nx\n");
  assert.deepStrictEqual(
    split.sections.map((s) => s.heading),
    ["# H", "## Real"],
  );
});

test("a hash inside a tilde fence is not a heading", () => {
  const split = splitSections("# H\n\n~~~text\n## Context\n## Options\n~~~\n\n## Real\n\nx\n");
  assert.deepStrictEqual(
    split.sections.map((s) => s.heading),
    ["# H", "## Real"],
  );
});

test("a longer closing run closes the fence and a shorter one does not", () => {
  const split = splitSections("# H\n\n````text\n```\n# not a heading\n````\n\n## Real\n\nx\n");
  assert.deepStrictEqual(
    split.sections.map((s) => s.heading),
    ["# H", "## Real"],
  );
});

test("an indented hash is a code block, not a heading", () => {
  const split = splitSections("# H\n\n    # indented\n\n## Real\n\nx\n");
  assert.deepStrictEqual(
    split.sections.map((s) => s.heading),
    ["# H", "## Real"],
  );
});

test("leading frontmatter is skipped and its hash is not a heading", () => {
  const split = splitSections("---\ntitle: # not a heading\n---\n\n# H\n\nx\n");
  assert.deepStrictEqual(split.frontmatter, ["---", "title: # not a heading", "---"]);
  assert.deepStrictEqual(
    split.sections.map((s) => s.heading),
    ["# H"],
  );
});

test("a setext underline is not a heading", () => {
  const split = splitSections("Title\n=====\n\nx\n");
  assert.deepStrictEqual(split.sections, []);
  assert.deepStrictEqual(split.preamble, ["Title", "=====", "", "x"]);
  assert.strictEqual(firstHeading("Title\n=====\n\nx\n"), null);
});

test("lines before the first heading are the preamble", () => {
  const split = splitSections("Lead in.\n\n# H\n\nx\n");
  assert.deepStrictEqual(split.preamble, ["Lead in.", ""]);
  assert.deepStrictEqual(split.sections[0].body, ["", "x"]);
});

test("a section body runs to the next heading, flat", () => {
  const split = splitSections("# H\n\na\n\n## Two\n\nb\n\n### Three\n\nc\n");
  assert.deepStrictEqual(
    split.sections.map((s) => s.heading),
    ["# H", "## Two", "### Three"],
  );
  assert.deepStrictEqual(split.sections[1].body, ["", "b", ""]);
  assert.deepStrictEqual(split.sections[2].body, ["", "c"]);
});

test("a fenced heading in the real bundle does not split the ADR template", () => {
  const source = read(path.join(TEMPLATES, "decisions", "AGENTS.md"));
  const headings = splitSections(expandTemplate(source, "snake_case")).sections.map(
    (s) => s.heading,
  );
  assert.ok(!headings.includes("## Context       — what forced a decision"));
  assert.ok(headings.includes("## Body (MADR-lite)"));
});

test("a copy whose H1 is setext is reported as not kisou-managed", () => {
  const { templates, docs } = fakeInstall();
  write(path.join(docs, "notes", "AGENTS.md"), "notes/ — AGENTS\n===============\n\nIntro.\n");
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.ok(result.out.includes("not kisou-managed: first heading is (none)"));
});

test("a copy whose fenced block holds a hash line stays level", () => {
  const { templates, docs } = fakeInstall();
  const withFence = "# {{notes}}/ — AGENTS\n\nIntro.\n\n## File\n\n```bash\n# POSIX\n```\n\n## Body\n\nBody body.\n\n## Growth\n\nGrowth body.\n";
  write(path.join(templates, "notes", "AGENTS.md"), withFence);
  write(path.join(docs, "notes", "AGENTS.md"), expandTemplate(withFence, "snake_case"));
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /^0 items, 0 notes$/m);
});
````

- [ ] **Step 2: Run the tests and watch them fail**

````bash
mise x node@22 -- node --test 'skills/kisou/scripts/*.test.js'
````

Expected: FAIL, with `Cannot find module './doc-system-check.js'`. Record the
Node version the run resolved: `mise x node@22 -- node --version`.

- [ ] **Step 3: Write `skills/kisou/scripts/doc-system-check.js`**

Create the file with this surface and implement the bodies from "The
instrument's specification" above. The specification, not this skeleton, is
what the bodies must satisfy; the tests of Step 1 are what decides whether they
do. The program's text is deliberately not transcribed into this plan: a
created file has no old passage, its lines are exempt from the merge-base diff
check by the `created:` list, and its own tests are the check a transcription
would only duplicate.

````js
"use strict";

// The doc-system half of `kisou migrate`: compare an installed doc-system
// against the bundled templates expanded for one `case`, report the
// differences (`check`), or write the accepted ones (`apply --items`).
//
// Node 22 or later. Standard library only.
//
// No shebang: this file is always invoked as `node <path>`, because the
// runtime text spells the command `node "$KISOU/scripts/doc-system-check.js"`
// and a reader who is setting `$KISOU` needs the interpreter named rather
// than implied.

const fs = require("node:fs");
const path = require("node:path");
const { parseArgs } = require("node:util");

const USAGE =
  "Usage: doc-system-check.js <check|apply> --docs <dir> [--templates <dir>] [--case snake_case|PascalCase] [--items <n,...>]";

const TYPES = ["requirements", "design", "decisions", "issues", "notes", "reports"];

// `docs -> Documents`, `src -> Source`, every other name title-cased. The same
// names SKILL.md Step 2 lists.
const PASCAL = { docs: "Documents", src: "Source" };

/** Strip a BOM, fold CRLF, collapse trailing newlines to one. */
function normalize(text) {}

/** One `{{name}}` value under one case convention. */
function expandName(name, kase) {}

/** Every `{{name}}` in a template body. */
function expandTemplate(text, kase) {}

/** The seven { type, template, target } entries, in report order. */
function targetSet(kase) {}

/** { frontmatter, preamble, sections: [{ heading, body }] }, fence-aware. */
function splitSections(text) {}

/** The whole first ATX heading line, or null. */
function firstHeading(text) {}

/** { managed, found, expected, missingDocManagement }. */
function classify(text, expandedTemplate, isRoot) {}

/** { missing, diverged, authorAdded } — heading lines. */
function compareSections(templateSections, targetSections) {}

/** Dispatch a subcommand. Returns the process exit code. */
function main(argv) {}

module.exports = {
  normalize,
  expandName,
  expandTemplate,
  targetSet,
  splitSections,
  firstHeading,
  classify,
  compareSections,
  main,
};

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}
````

Four points the tests pin and the specification states, called out because they
are the ones an implementer gets wrong:

- **the fence rule is not optional.** The real ADR template carries four `##`
  lines inside a `text` fence and the root template two `#` lines inside
  command fences; an implementation that split on them would propose bogus
  additions to every installed copy, and the two real-bundle tests in Step 1
  are what catches it;
- **a fence closes only on a run of the same character at least as long as the
  opener**, so a four-backtick block containing a three-backtick line is one
  fence, not two;
- **a target that fails the fingerprint draws a note and no item**, including
  the root that has the H1 but not `## Document management` — `classify`
  returns `managed: false` for it and a distinct note is printed;
- **`check` at this task exits 0 and prints `0 items`** for every tree,
  because no item kind exists yet. Test case 1 is not yet load-bearing here —
  it becomes so in the next task, and it must pass at both points.

- [ ] **Step 4: Run the tests and watch them pass**

````bash
mise x node@22 -- node --test 'skills/kisou/scripts/*.test.js'
````

Expected: every test passes, `fail 0`. Record the resolved version beside the
result.

- [ ] **Step 5: Prove the JavaScript linter matches the paths**

````bash
./scripts/lint.sh skills/kisou/scripts/doc-system-check.js skills/kisou/scripts/doc-system-check.test.js
````

Windows alternative: `scripts\lint.bat` with the same two paths. Expected: exit
0, and a JavaScript hook appearing as **run** — `Passed` — not as
`(no files to check) Skipped`. A lint that matches no hook passes and proves
nothing. If biome reformatted either file, re-stage and re-run the tests before
continuing.

- [ ] **Step 6: Commit**

````bash
git add skills/kisou/scripts/doc-system-check.js skills/kisou/scripts/doc-system-check.test.js
git commit --only skills/kisou/scripts/doc-system-check.js skills/kisou/scripts/doc-system-check.test.js -m "feat(kisou): the doc-system comparison's expansion, targets, fingerprint and section split" -m "The doc-system half of migrate becomes one executable the skill ships. This first part resolves the seven targets under a docs root for either case convention, decides whether each is kisou-managed by the H1 the expanded template gives it, and splits a file into sections at every ATX heading outside a fenced block - the rule the ADR template's fenced body sketch and the root template's fenced command blocks make load-bearing (issue-e19f)." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
````

- [ ] **Step 7: Verify the trailer**

````bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: `1`.

**Verify.** Run the suite in the glob form and show the deliverable exists:

````bash
mise x node@22 -- node --test 'skills/kisou/scripts/*.test.js' && node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case | tail -1
````

Expected: every test passes; record the `node --version` the run resolved. The
second command prints a summary line — at this task it reads `0 items, 0
notes`, because no item kind exists yet, and its value is not the acceptance;
that the command runs at all, against this repository's real docs root, is.

**Done when:** the suite passes on the recorded Node 22 version, the seven
targets resolve for both case conventions, a foreign H1 and a
document-management-less root each produce their own note and no item, no
fenced `#` line splits a section, and the JavaScript hook ran rather than
skipped.

---

## Task 2: `check` — the item kinds, the diff, the notes, the ordering, the exit codes

Test cases 2, 4, 6 and the check-side half of 8. This task turns
`compareSections` into a numbered report and gives `check` its exit codes.

**Files:**

- Modify: `skills/kisou/scripts/doc-system-check.js`
- Modify (test): `skills/kisou/scripts/doc-system-check.test.js` — appended to,
  never rewritten

**Interfaces:**

- Consumes, from task 1: `normalize`, `expandName`, `expandTemplate`,
  `targetSet`, `splitSections`, `firstHeading`, `classify`,
  `compareSections`, and `main`'s dispatch.
- Produces, for task 3:

```js
module.exports = { /* task 1's exports, plus: */ collect, formatReport };
```

- `collect({ templatesDir, docsDir, kase })` → `{ items, notes }`. `items` is
  the numbered list in report order, each entry
  `{ kind, path, absPath, heading, oldBody, newBody, text, lineEnding }`:
  `kind` is `"create"`, `"add"` or `"replace"`; `path` is the printed
  forward-slash path and `absPath` the one to write; `heading` is the section's
  heading line, or `null` for a `create`; `oldBody` and `newBody` are arrays of
  lines, both `null` for a `create`, `oldBody` `null` for an `add`; `text` is
  the whole expanded template, for a `create`; `lineEnding` is `"\r\n"` or
  `"\n"`. `notes` is an array of finished note strings, in report order.
  `collect` throws a `TemplateError` for a template with no H1 or a repeated
  heading, and a `ReadError` for a target that exists and cannot be read; both
  become exit 2.
- `formatReport({ items, notes })` → `string`, the whole stdout of `check`,
  ending with the summary line and a final newline. Item numbers are the
  1-based index in `items`.

- [ ] **Step 1: Append the failing tests**

Append exactly this to `skills/kisou/scripts/doc-system-check.test.js`. The
`fakeInstall` fixture from task 1 is what makes the byte-exact assertion in the
`replace` test possible: its miniature templates have bodies this plan chose.

````js
// --- test case 2: absent ---------------------------------------------------

test("an empty docs root is seven create items", () => {
  const root = tmp();
  const templates = fakeTemplates(path.join(root, "templates"));
  const docs = path.join(root, "docs");
  fs.mkdirSync(docs, { recursive: true });
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /^1\. create: .*\/AGENTS\.md$/m);
  assert.match(result.out, /^7\. create: .*\/reports\/AGENTS\.md$/m);
  assert.match(result.out, /^7 items, 0 notes$/m);
});

test("a docs root that does not exist is seven create items, not an error", () => {
  const root = tmp();
  const templates = fakeTemplates(path.join(root, "templates"));
  const docs = path.join(root, "absent");
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 1);
  assert.match(result.out, /^7 items, 0 notes$/m);
  assert.strictEqual(fs.existsSync(docs), false);
});

test("a docs path that is a file is exit 2", () => {
  const root = tmp();
  const templates = fakeTemplates(path.join(root, "templates"));
  const file = path.join(root, "docs.md");
  write(file, "not a directory\n");
  const result = run(["check", "--templates", templates, "--docs", file, "--case", "snake_case"]);
  assert.strictEqual(result.code, 2);
});

// --- test case 4: diverged, with its printed text asserted -----------------

test("a rewrapped section is one replace item, printed as two blocks", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, read(target).replace("File body.", "File\nbody rewrapped."));
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 1);
  assert.strictEqual(
    result.out,
    [
      `1. replace: ${posix(docs)}/notes/AGENTS.md — ## File`,
      "-",
      "- File",
      "- body rewrapped.",
      "-",
      "+",
      "+ File body.",
      "+",
      "1 item, 0 notes",
      "",
    ].join("\n"),
  );
});

test("items are ordered by file, then by the template's section order", () => {
  const { templates, docs } = fakeInstall();
  for (const type of ["reports", "design"]) {
    const target = path.join(docs, type, "AGENTS.md");
    write(target, read(target).replace("Growth body.", "Changed.").replace("File body.", "Also changed."));
  }
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  const items = result.out.split("\n").filter((l) => /^\d+\. /.test(l));
  assert.deepStrictEqual(items, [
    `1. replace: ${posix(docs)}/design/AGENTS.md — ## File`,
    `2. replace: ${posix(docs)}/design/AGENTS.md — ## Growth`,
    `3. replace: ${posix(docs)}/reports/AGENTS.md — ## File`,
    `4. replace: ${posix(docs)}/reports/AGENTS.md — ## Growth`,
  ]);
});

test("a missing fixed section is an add item", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "issues", "AGENTS.md");
  write(target, read(target).replace("## Body\n\nBody body.\n\n", ""));
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 1);
  assert.strictEqual(
    result.out,
    [`1. add: ${posix(docs)}/issues/AGENTS.md — ## Body`, "1 item, 0 notes", ""].join("\n"),
  );
});

// --- test case 6, first half: author sections ------------------------------

test("an author-added section is a note and no item", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "design", "AGENTS.md");
  write(target, read(target).replace("## Body\n", "## Local conventions\n\nOurs.\n\n## Body\n"));
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.strictEqual(
    result.out,
    [
      `note: ${posix(docs)}/design/AGENTS.md — author section kept: ## Local conventions`,
      "0 items, 1 note",
      "",
    ].join("\n"),
  );
});

test("a repeated heading compares the first and notes the second", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, `${read(target)}\n## File\n\nA second one.\n`);
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.ok(
    result.out.includes(
      `note: ${posix(docs)}/notes/AGENTS.md — author section kept: ## File`,
    ),
  );
  assert.match(result.out, /^0 items, 1 note$/m);
});

// --- test case 8, first half: encoding and line endings --------------------

test("a CRLF copy of the bundle is level", () => {
  const docs = path.join(tmp(), "docs");
  expandBundle(docs, "snake_case");
  for (const t of targetSet("snake_case")) {
    const file = path.join(docs, t.target);
    write(file, read(file).replace(/\n/g, "\r\n"));
  }
  const result = run(["check", "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /^0 items, 0 notes$/m);
});

test("a copy with a BOM is level", () => {
  const docs = path.join(tmp(), "docs");
  expandBundle(docs, "snake_case");
  const file = path.join(docs, "reports", "AGENTS.md");
  write(file, `﻿${read(file)}`);
  const result = run(["check", "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
  assert.match(result.out, /^0 items, 0 notes$/m);
});

test("extra trailing newlines are not a divergence", () => {
  const docs = path.join(tmp(), "docs");
  expandBundle(docs, "snake_case");
  const file = path.join(docs, "issues", "AGENTS.md");
  write(file, `${read(file)}\n\n`);
  const result = run(["check", "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 0);
});
````

- [ ] **Step 2: Run the tests and watch them fail**

````bash
mise x node@22 -- node --test 'skills/kisou/scripts/*.test.js'
````

Expected: FAIL. The task-1 tests still pass; the new ones fail on the exit code
(0 where 1 was expected) and on the report text.

- [ ] **Step 3: Implement `collect` and `formatReport`**

Add the two functions to `skills/kisou/scripts/doc-system-check.js` with this
shape, export them, and make `check` return `items.length > 0 ? 1 : 0` after
writing `formatReport(...)` to stdout. Implement the bodies from "`check` — the
report" in the specification above.

````js
class TemplateError extends Error {}
class ReadError extends Error {}

/** Walk the seven targets. Returns { items, notes }. */
function collect({ templatesDir, docsDir, kase }) {}

/** The whole stdout of `check`, summary line included. */
function formatReport({ items, notes }) {}
````

Four points the tests pin:

- the item line is `<n>. <kind>: <path>` for a `create` and
  `<n>. <kind>: <path> — <heading line>` for an `add` or a `replace`, with
  `<path>` forward-slashed;
- a `replace`'s diff prints the target's **whole** body first, every line
  prefixed, then the template's whole body — an empty body line prints as a
  bare `-` or `+` with no trailing space, which is what the byte-exact test
  asserts;
- `create` items come from an absent target, and an absent docs root yields
  seven of them and creates nothing;
- the summary reads `1 item` and `1 note` in the singular and `0 items` /
  `2 notes` otherwise, and a tree with notes but no items exits **0**.

- [ ] **Step 4: Run the tests and watch them pass**

````bash
mise x node@22 -- node --test 'skills/kisou/scripts/*.test.js'
````

Expected: every test passes, `fail 0`.

- [ ] **Step 5: Lint**

````bash
./scripts/lint.sh skills/kisou/scripts/doc-system-check.js skills/kisou/scripts/doc-system-check.test.js
````

Expected: exit 0 with the JavaScript hook reported as run. Re-run Step 4 if
biome reformatted either file.

- [ ] **Step 6: Commit**

````bash
git commit --only skills/kisou/scripts/doc-system-check.js skills/kisou/scripts/doc-system-check.test.js -m "feat(kisou): the doc-system check's numbered report" -m "check now prints one numbered item per proposed change - create for an absent target, add for a missing fixed section, replace for a diverged one, the diverged section shown whole both ways - then the notes that cannot be applied, then a summary line. A tree with notes but no items exits 0; one with items exits 1, which is the code the pre-commit hook will use (issue-acc0)." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
````

- [ ] **Step 7: Verify the trailer**

````bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: `1`.

**Verify.** Run the suite in the glob form and show the deliverable exists:

````bash
mise x node@22 -- node --test 'skills/kisou/scripts/*.test.js' && grep -c 'formatReport' skills/kisou/scripts/doc-system-check.js
````

Expected: every test passes; record the `node --version` the run resolved. The
`grep -c` prints a count of 2 or more — the definition and the export. This is
a Git Bash pipeline; PowerShell has no `grep`.

**Done when:** the suite passes, an empty docs root reports seven `create`
items and exits 1, a rewrapped section prints exactly the two blocks the
byte-exact test asserts, an author section and a repeated heading each produce
a note and no item, and CRLF, a BOM and extra trailing newlines are not
divergences.

---

## Task 3: `apply --items` and the insertion position

Test cases 5, 9, the apply-side halves of 2, 6 and 8. This task delivers the
whole instrument.

**Files:**

- Modify: `skills/kisou/scripts/doc-system-check.js`
- Modify (test): `skills/kisou/scripts/doc-system-check.test.js` — appended to,
  never rewritten

**Interfaces:**

- Consumes, from tasks 1 and 2: `collect`, `formatReport`, `splitSections`,
  `targetSet`, `expandTemplate`, `normalize`, and `main`'s dispatch.
- Produces the finished module surface — nothing later in this plan imports it;
  `SKILL.md` and the pre-commit hook call the command line:

```js
module.exports = { /* tasks 1 and 2's exports, plus: */ parseItems, applyItems };
```

- `parseItems(raw)` → a sorted array of unique positive integers, or throws for
  a field that is not a decimal integer of 1 or more.
- `applyItems({ templatesDir, docsDir, kase, numbers })` → the number of items
  written. Resolves each number against the list `collect` returns to an
  identity — `{ path, kind, heading }` — then writes them in list order,
  recomputing the list from the tree after every write and finding the next
  accepted item by identity. Throws for a number past the list or an identity
  that has vanished; the caller turns that into exit 2 with nothing further
  written.

- [ ] **Step 1: Append the failing tests**

Append exactly this to `skills/kisou/scripts/doc-system-check.test.js`.

````js
// --- test case 5: the insertion position -----------------------------------

test("an added section lands after the nearest preceding section present", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "requirements", "AGENTS.md");
  write(target, read(target).replace("## Body\n\nBody body.\n\n", ""));
  const applied = run([
    "apply", "--items", "1",
    "--templates", templates, "--docs", docs, "--case", "snake_case",
  ]);
  assert.strictEqual(applied.code, 0);
  assert.deepStrictEqual(
    splitSections(read(target)).sections.map((s) => s.heading),
    ["# requirements/ — AGENTS", "## File", "## Body", "## Growth"],
  );
  const after = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(after.code, 0);
});

test("applying only the later of two adds anchors it to what is present", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "requirements", "AGENTS.md");
  write(
    target,
    read(target).replace("## Body\n\nBody body.\n\n", "").replace("## Growth\n\nGrowth body.\n", ""),
  );
  const listed = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.match(listed.out, /^2 items, 0 notes$/m);
  const applied = run([
    "apply", "--items", "2",
    "--templates", templates, "--docs", docs, "--case", "snake_case",
  ]);
  assert.strictEqual(applied.code, 0);
  assert.deepStrictEqual(
    splitSections(read(target)).sections.map((s) => s.heading),
    ["# requirements/ — AGENTS", "## File", "## Growth"],
  );
});

test("applying both adds in one run lands them in template order", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "requirements", "AGENTS.md");
  write(
    target,
    read(target).replace("## Body\n\nBody body.\n\n", "").replace("## Growth\n\nGrowth body.\n", ""),
  );
  const applied = run([
    "apply", "--items", "1,2",
    "--templates", templates, "--docs", docs, "--case", "snake_case",
  ]);
  assert.strictEqual(applied.code, 0);
  assert.deepStrictEqual(
    splitSections(read(target)).sections.map((s) => s.heading),
    ["# requirements/ — AGENTS", "## File", "## Body", "## Growth"],
  );
  const after = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(after.code, 0);
  assert.match(after.out, /^0 items, 0 notes$/m);
});

test("an add whose only preceding section is the H1 lands directly after it", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, "# notes/ — AGENTS\n\nIntro.\n\n## Body\n\nBody body.\n\n## Growth\n\nGrowth body.\n");
  const applied = run([
    "apply", "--items", "1",
    "--templates", templates, "--docs", docs, "--case", "snake_case",
  ]);
  assert.strictEqual(applied.code, 0);
  assert.deepStrictEqual(
    splitSections(read(target)).sections.map((s) => s.heading),
    ["# notes/ — AGENTS", "## File", "## Body", "## Growth"],
  );
});

test("a copy with only its H1 takes every section, in order, at the end", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, "# notes/ — AGENTS\n\nIntro.\n");
  const applied = run([
    "apply", "--items", "1,2,3",
    "--templates", templates, "--docs", docs, "--case", "snake_case",
  ]);
  assert.strictEqual(applied.code, 0);
  assert.deepStrictEqual(
    splitSections(read(target)).sections.map((s) => s.heading),
    ["# notes/ — AGENTS", "## File", "## Body", "## Growth"],
  );
});

// --- test case 2, apply side: seven creates yield identity -----------------

test("applying all seven creates yields a level tree", () => {
  const root = tmp();
  const templates = fakeTemplates(path.join(root, "templates"));
  const docs = path.join(root, "docs");
  const applied = run([
    "apply", "--items", "1,2,3,4,5,6,7",
    "--templates", templates, "--docs", docs, "--case", "snake_case",
  ]);
  assert.strictEqual(applied.code, 0);
  assert.match(applied.out, /^7 items applied$/m);
  const after = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(after.code, 0);
  assert.match(after.out, /^0 items, 0 notes$/m);
});

test("a replace restores identity and leaves the rest of the file alone", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  const original = read(target);
  write(target, original.replace("File body.", "File\nbody rewrapped."));
  const applied = run([
    "apply", "--items", "1",
    "--templates", templates, "--docs", docs, "--case", "snake_case",
  ]);
  assert.strictEqual(applied.code, 0);
  assert.strictEqual(read(target), original);
});

// --- test case 6, second half: an author section survives an apply ---------

test("an unrelated apply leaves an author section where the author put it", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "design", "AGENTS.md");
  write(
    target,
    read(target)
      .replace("## Body\n", "## Local conventions\n\nOurs.\n\n## Body\n")
      .replace("Growth body.", "Growth\nbody rewrapped."),
  );
  const applied = run([
    "apply", "--items", "1",
    "--templates", templates, "--docs", docs, "--case", "snake_case",
  ]);
  assert.strictEqual(applied.code, 0);
  assert.deepStrictEqual(
    splitSections(read(target)).sections.map((s) => s.heading),
    ["# design/ — AGENTS", "## File", "## Local conventions", "## Body", "## Growth"],
  );
  const after = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(after.code, 0);
  assert.match(after.out, /^0 items, 1 note$/m);
});

// --- test case 8, second half: apply writes the target's line ending -------

test("a CRLF target keeps CRLF after an apply", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, read(target).replace("File body.", "File\nbody rewrapped.").replace(/\n/g, "\r\n"));
  const applied = run([
    "apply", "--items", "1",
    "--templates", templates, "--docs", docs, "--case", "snake_case",
  ]);
  assert.strictEqual(applied.code, 0);
  const written = read(target);
  assert.ok(written.includes("\r\n"));
  assert.strictEqual(written.replace(/\r\n/g, "\n").includes("File body."), true);
  const after = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(after.code, 0);
});

// --- test case 8, third part: apply writes the target's BOM back -----------

test("a BOM'd target keeps its BOM after an apply", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, `﻿${read(target).replace("File body.", "File\nbody rewrapped.")}`);
  const applied = run([
    "apply", "--items", "1",
    "--templates", templates, "--docs", docs, "--case", "snake_case",
  ]);
  assert.strictEqual(applied.code, 0);
  const raw = fs.readFileSync(target, "utf8");
  assert.strictEqual(raw.charCodeAt(0), 0xfeff);
  assert.ok(raw.includes("File body."));
  const after = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(after.code, 0);
});

// --- test case 9: errors ---------------------------------------------------

test("apply with no --items is exit 2 and writes nothing", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, read(target).replace("File body.", "Changed."));
  const before = read(target);
  const applied = run(["apply", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(applied.code, 2);
  assert.strictEqual(read(target), before);
});

test("apply with a number past the list is exit 2 and writes nothing", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "notes", "AGENTS.md");
  write(target, read(target).replace("File body.", "Changed."));
  const before = read(target);
  const applied = run([
    "apply", "--items", "1,9",
    "--templates", templates, "--docs", docs, "--case", "snake_case",
  ]);
  assert.strictEqual(applied.code, 2);
  assert.strictEqual(read(target), before);
});

test("apply cannot reach a note, which has no number", () => {
  const { templates, docs } = fakeInstall();
  const target = path.join(docs, "requirements", "AGENTS.md");
  write(target, "# Requirements\n\nOurs.\n");
  const listed = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.match(listed.out, /^0 items, 1 note$/m);
  const applied = run([
    "apply", "--items", "1",
    "--templates", templates, "--docs", docs, "--case", "snake_case",
  ]);
  assert.strictEqual(applied.code, 2);
  assert.strictEqual(read(path.join(docs, "requirements", "AGENTS.md")), "# Requirements\n\nOurs.\n");
});

test("a template with a repeated heading is exit 2", () => {
  const { templates, docs } = fakeInstall();
  const file = path.join(templates, "notes", "AGENTS.md");
  write(file, `${read(file)}\n## File\n\nAgain.\n`);
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 2);
});

test("a template with no H1 is exit 2", () => {
  const { templates, docs } = fakeInstall();
  write(path.join(templates, "notes", "AGENTS.md"), "Just prose.\n");
  const result = run(["check", "--templates", templates, "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(result.code, 2);
});

test("a PascalCase doc-system under a root named Docs needs an explicit case", () => {
  const root = tmp();
  const templates = fakeTemplates(path.join(root, "templates"));
  const docs = path.join(root, "Docs");
  expandBundle(docs, "PascalCase", templates);
  const derived = run(["check", "--templates", templates, "--docs", docs]);
  assert.strictEqual(derived.code, 2);
  assert.match(derived.out, /--case/);
  const explicit = run(["check", "--templates", templates, "--docs", docs, "--case", "PascalCase"]);
  assert.strictEqual(explicit.code, 0);
});

test("an unknown subcommand and an unknown option are exit 2", () => {
  const { templates, docs } = fakeInstall();
  assert.strictEqual(run(["frobnicate", "--docs", docs]).code, 2);
  assert.strictEqual(run(["check", "--docs", docs, "--nope", "x"]).code, 2);
  assert.strictEqual(run(["check", "--templates", templates, "--docs", docs, "--case", "camelCase"]).code, 2);
  assert.strictEqual(run(["check", "--templates", templates, "--docs", docs, "--items", "1"]).code, 2);
});

// --- test case 5, on the real bundle ---------------------------------------
// The spec writes case 5 against the shipped `requirements` template, and task
// 9 quotes it as the evidence that closes issue-f623. The miniature-bundle
// cases above cover the same three insertion positions; this one makes the
// evidence a real template rather than a fixture the suite invented.

test("a section deleted from the real requirements copy is re-inserted in place", () => {
  const docs = path.join(tmp(), "docs");
  expandBundle(docs, "snake_case");
  const target = path.join(docs, "requirements", "AGENTS.md");
  const text = read(target);
  const start = text.indexOf("## requirements vs issues");
  const end = text.indexOf("## Growth", start);
  assert.ok(start > 0 && end > start);
  write(target, text.slice(0, start) + text.slice(end));
  const before = run(["check", "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(before.code, 1);
  assert.match(before.out, /^1\. add: .*requirements\/AGENTS\.md — ## requirements vs issues$/m);
  assert.strictEqual(run(["apply", "--items", "1", "--docs", docs, "--case", "snake_case"]).code, 0);
  assert.deepStrictEqual(
    splitSections(read(target)).sections.map((s) => s.heading),
    [
      "# requirements/ — AGENTS",
      "## File",
      "## Frontmatter",
      "## Body",
      "## requirements vs issues",
      "## Growth",
    ],
  );
  const after = run(["check", "--docs", docs, "--case", "snake_case"]);
  assert.strictEqual(after.code, 0);
  assert.match(after.out, /^0 items, 0 notes$/m);
});
````

- [ ] **Step 2: Run the tests and watch them fail**

````bash
mise x node@22 -- node --test 'skills/kisou/scripts/*.test.js'
````

Expected: FAIL. Everything from tasks 1 and 2 still passes; every `apply` call
fails, because the subcommand does not exist yet.

- [ ] **Step 3: Implement `parseItems`, `applyItems`, and the `apply` dispatch**

Add these to `skills/kisou/scripts/doc-system-check.js`, export them, and route
`apply` through `main`. Implement the bodies from "Insertion position" and
"`apply --items <n,…>`" in the specification above.

````js
/** "1,2,5" -> [1, 2, 5]. Throws on a field that is not a positive integer. */
function parseItems(raw) {}

/** Insert one template section into a target's lines at the template's place. */
function insertSection(targetText, templateSections, heading) {}

/** Write the accepted items. Returns how many were written. */
function applyItems({ templatesDir, docsDir, kase, numbers }) {}
````

Four points the tests pin:

- **the list is recomputed after every write**, and the next accepted item is
  found by identity — path, kind, heading — not by its old number. The
  two-`add` test is what catches an implementation that resolved every number
  up front and then wrote against stale offsets;
- **the anchor is the nearest preceding template section that the target
  actually has**, then the nearest following one, then the end of the file —
  which is why applying only the second of two `add` items must land it after
  `## File`, not after the still-absent `## Body`;
- **nothing is written when any requested number is bad.** Validate every
  number against the list before the first write, so an exit 2 leaves the tree
  untouched;
- **a note occupies no number.** With one note and no items the list is empty,
  so `--items 1` is past the list and is exit 2.

- [ ] **Step 4: Run the tests and watch them pass**

````bash
mise x node@22 -- node --test 'skills/kisou/scripts/*.test.js'
````

Expected: every test passes, `fail 0`.

- [ ] **Step 5: Lint**

````bash
./scripts/lint.sh skills/kisou/scripts/doc-system-check.js skills/kisou/scripts/doc-system-check.test.js
````

Expected: exit 0 with the JavaScript hook reported as run. Re-run Step 4 if
biome reformatted either file.

- [ ] **Step 6: Commit**

````bash
git commit --only skills/kisou/scripts/doc-system-check.js skills/kisou/scripts/doc-system-check.test.js -m "feat(kisou): apply --items, and where an added section lands" -m "apply recomputes the list check would print, resolves the accepted numbers to identities, and writes them in order - recomputing after every write, so an add whose anchor another accepted add just created lands after it. An added section takes the template's position relative to the fixed sections the target actually has; an author-added section stays where the author put it. Partial acceptance is the normal case (issue-f623)." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
````

- [ ] **Step 7: Verify the trailer**

````bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: `1`.

**Verify.** Run the suite in the glob form and show the deliverable exists:

````bash
mise x node@22 -- node --test 'skills/kisou/scripts/*.test.js' && node skills/kisou/scripts/doc-system-check.js apply --docs docs --case snake_case; echo "exit $?"
````

Expected: every test passes; record the `node --version` the run resolved. The
second command is `apply` with no `--items`, on this repository's real docs
root: it prints an error, writes nothing, and the `echo` reports `exit 2`. The
`;` is deliberate — the command is expected to fail, so it is not chained with
`&&`.

**Done when:** the suite passes, every insertion case lands where the template
puts it, a partial acceptance leaves the unaccepted sections untouched, an
author section survives an unrelated apply, a CRLF target stays CRLF, a BOM'd
target keeps its BOM, and every error case exits 2 with nothing written.

---

## Task 4: `SKILL.md` — the eleven passages

**Batch:** B. **Blocks:** O4.1–O4.10, A4.1–A4.3, P4.1–P4.11.

**Files:**

- Modify: `skills/kisou/SKILL.md` — eleven passages: eight replacements and
  three insertions.

**Interfaces:**

- Consumes, from tasks 1 to 3: the subcommand names `check` and
  `apply --items`, the option names `--docs` and `--case`, and the invocation
  form `node "$KISOU/scripts/doc-system-check.js" <subcommand>`. P4.1, P4.5,
  P4.6 and P4.9 write those into the skill's runtime text, so a name changed
  in batch A and not here leaves the skill telling a user to run a command
  that does not exist.
- Produces, for task 5: the wording `README.md` is brought level with, and
  the fact that the fall-through is now "leave alone and report".
- Produces, for task 6 and task 7: nothing the tool reads. The instrument does
  not parse `SKILL.md`.
- `skills/kisou/SKILL.md` is markdownlint-linted; the templates beside it are
  not (`.markdownlint-cli2.yaml` ignores `skills/**/templates/**`).

**The spec's passage names map to this task's block ids one to one, except
that spec P6 and the second half of spec P7 land in one insertion:**

| Spec | Block | What |
| --- | --- | --- |
| P1 | P4.1 | the prerequisite paragraph |
| P2 | P4.2 | Step 2, the `tidy` condition |
| P3 | P4.3 | Step 3's scripts prompt |
| P4 | P4.4 | the `full` class sets no scope |
| P5 | P4.5 | the doc-system fingerprint line |
| P6 + P7's paragraph | P4.6 | which angle brackets are free text, then the instrument |
| P7's first half | P4.7 | the "compare the structure" sentence, scoped to layer B |
| P8 | P4.8 | the fall-through |
| P9 | P4.9 | the per-artifact `docs/` line |
| P10 | P4.10 | Prohibited actions |
| P11 | P4.11 | the diverged fixed-text bullet |

**P6 and P7's paragraph are one block** because both land at the same anchor —
the "Never flag a free-text section" paragraph — and the spec puts P7's
paragraph *after* P6's. Two insertions at one anchor apply in the reverse of
the order they are written, which would put them the wrong way round; one
block states the order it wants.

### The old values this task contradicts

Counts measured on this branch, 2026-09-11, with `grep -cF` over
`skills/kisou/SKILL.md`, `skills/kisou/README.md`, and
`docs/design/c1d2-kisou.md`. The sweep set is `skills/kisou/**` plus
`docs/design/c1d2-kisou.md`, and the file this plan does **not** touch —
`docs/design/c1d2-kisou.md` — was swept first.

**O4.1** `add only around it` — `skills/kisou/SKILL.md` 1, gone by P4.9. `docs/design/c1d2-kisou.md` 1, which is T1's to update and may stay through the run.

**O4.2** `layer-B only` — `skills/kisou/SKILL.md` 1, gone by P4.4. Nowhere else.

**O4.3** `still a refresh target` — `skills/kisou/SKILL.md` 1, gone by P4.4. Nowhere else.

**O4.4** `the type path table plus` — `skills/kisou/SKILL.md` 1, gone by P4.5. Nowhere else.

**O4.5** `rename the original to` — `skills/kisou/SKILL.md` 1, gone by P4.8. Nowhere else.

**O4.6** `only for clang + CMake` — `skills/kisou/SKILL.md` 1, gone by P4.2, which rewords it to "only for a clang + CMake project"; this needle does not match that. `skills/kisou/README.md` carries "for clang + CMake projects", a different phrase, and stays.

**O4.7** `list the not-yet-present slots` — `skills/kisou/SKILL.md` 1, gone by P4.3. Step 2's own list of the six slots is a different sentence and stays. The needle the spec names — the parenthesized slot list — cannot be written as a lead: the block grammar delimits a needle with single backticks, and that list carries its own.

**O4.8** `keeps this non-destructive` — `skills/kisou/SKILL.md` 1, gone by P4.8. Nowhere else.

**O4.9** `one whose template body has` — `skills/kisou/SKILL.md` 1, gone by P4.11. This is the opening of the sentence issue-2bf9 was filed against, and it spans the point P4.11 changes. The spec names the other half of that sentence, which carries backticks and so cannot be written as a lead.

**O4.10** `backs the file up to` — `skills/kisou/README.md` 1, gone by P5.1 in task 5. Recorded here because the entity is one — the `.bak` fall-through — and it is stated in two files in different words.

**O4.11** `propose adding **only the missing**` — `skills/kisou/SKILL.md` 1, gone by P4.12. Nowhere else. The entity is "what the none/partial/full class decides", whose other two spellings are O4.2 and O4.3.

**O4.12** `offer each **absent**` — `skills/kisou/SKILL.md` 1, gone by P4.13. Nowhere else. The entity is "who enumerates the doc-system's targets", which after P4.9 and P4.6 is the instrument alone.

### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/kisou/SKILL.md
```

Expected: `i/lf w/crlf attr/text=auto`. Write every passage with CRLF.

- [ ] **Step 2: P4.1 — the prerequisite**

**A4.1** `skills/kisou/SKILL.md` — `grep -cF 'doc-system half of migrate runs one executable' skills/kisou/SKILL.md` — before: 0, after: 1

**P4.1** `skills/kisou/SKILL.md` — insert after these 3 lines

```text
`kisou` is a **thin shell** over its bundled template at `templates/` (relative
to this skill folder). Do not restate the template's contents here — read and
copy from the bundle.
```

**P4.1 →**

```text

The doc-system half of migrate runs one executable,
`scripts/doc-system-check.js` beside the templates, on **Node 22 or later**,
standard library only. Invoke it as
`node "$KISOU/scripts/doc-system-check.js" <subcommand>`, with `$KISOU` set to
this skill's own directory in the same tool call as the command. When `node`
is not on the path, say so and do not run the doc-system half of that migrate:
it is not replaced by reading the files yourself, because a comparison the
tool did not make is not a comparison — uncertainty narrows what migrate
proposes, never widens it. Scaffold needs nothing; it writes the templates as
they are.
```

- [ ] **Step 3: P4.2 — Step 2, the `tidy` condition, stated once**

**P4.2** `skills/kisou/SKILL.md` — replace exactly these 3 lines

```text
`run`, `scripts/build`, `scripts/test`, `scripts/lint`, and `scripts/tidy` the
project needs — offer `scripts/tidy` (clang-tidy) only for clang + CMake
projects; `scripts/bootstrap` is always created), the **`dirs` selection** (which
```

**P4.2 →**

```text
`run`, `scripts/build`, `scripts/test`, `scripts/lint`, and `scripts/tidy` the
project needs — offer `scripts/tidy` (clang-tidy) only for a clang + CMake
project, which in migrate means a `CMakeLists.txt` at the repository root, and
this is the one place that condition is stated; `scripts/bootstrap` is always
created), the **`dirs` selection** (which
```

- [ ] **Step 4: P4.3 — Step 3's scripts prompt refers to Step 2**

**P4.3** `skills/kisou/SKILL.md` — replace exactly these 3 lines

```text
After surfacing the detected values for confirmation, **also ask once about
scripts the repo lacks**: list the not-yet-present slots (`setup` / `run` /
`build` / `test` / `lint` / `tidy`) and let the user opt into any. A script
```

**P4.3 →**

```text
After surfacing the detected values for confirmation, **also ask once about
scripts the repo lacks**: list the slots **Step 2 offers** that the repository
lacks — `tidy` among them only under Step 2's clang + CMake condition — and
let the user opt into any. A script
```

- [ ] **Step 5: P4.4 — the `full` class sets no scope**

**P4.4** `skills/kisou/SKILL.md` — replace exactly these 3 lines

```text
  - **full** (root `AGENTS.md` + all four per-type files present) → leave
    intact; treat the migrate scope as **layer-B only** unless the user asks
    otherwise. It is still a refresh target (see the Present branch below).
```

**P4.4 →**

```text
  - **full** (root `AGENTS.md` + all four per-type files present) → the root
    and the four managed per-type files are present. What is absent —
    `notes/` and `reports/` included, since they sit outside this tally — and
    what diverged comes from the instrument in the Present branch below,
    inside whatever scope the user picks. The class says what is absent and
    nothing more; it sets no scope.
```

- [ ] **Step 6: P4.5 — the doc-system fingerprint**

**P4.5** `skills/kisou/SKILL.md` — replace exactly these 2 lines

```text
  - `{docs,Documents}/AGENTS.md` — the type path table plus the "Document
    management" heading.
```

**P4.5 →**

```text
  - `{docs,Documents}/**/AGENTS.md` — the root and every `<type>/AGENTS.md`:
    the H1 the expanded template gives it (`# AGENTS.md`, together with the
    `## Document management` heading, for the root; `# <type>/ — AGENTS` for
    a type). This is a test `scripts/doc-system-check.js` applies, not you.
```

- [ ] **Step 7: P4.6 — which angle brackets are free text, then the instrument**

**A4.2** `skills/kisou/SKILL.md` — `grep -cF 'the comparison is not yours' skills/kisou/SKILL.md` — before: 0, after: 1

**P4.6** `skills/kisou/SKILL.md` — insert after these 4 lines

```text
  Never flag a **free-text section** (template body carrying `<...>` for the
  author to fill, e.g. README `## Tech stack`) — the author owns it and
  staleness cannot be told from an intentional edit. Never propose **deleting**
  an author-added section. Refresh is additive / updating only.
```

**P4.6 →**

```text

  A `<...>` marks author free text **only** where the template's own
  `<!-- TEMPLATE FILL ... -->` block says to replace `<...>` with content.
  Every other `<...>` — `<id>`, `<slug>`, `<type>-<id>`, a frontmatter
  example's `title: <topic title>` — is notation the rule text uses, and its
  section is fixed-text. The doc-system templates carry no `TEMPLATE FILL`
  block, so every section of a doc-system `AGENTS.md` is fixed-text and this
  free-text test is a layer-B test.

  For a doc-system `AGENTS.md` the comparison is not yours. Run
  `node "$KISOU/scripts/doc-system-check.js" check --docs <root> --case <case>`
  with the detected values, `$KISOU` set to this skill's directory in the same
  tool call. Its items go into the proposal as one contiguous block at the
  **end** of the numbered list, in the tool's order, renumbered to follow the
  layer-B items; keep the offset you added and, after the user's answer, pass
  `apply --items` the accepted numbers **minus that offset**. The tool's notes
  go after the list, unnumbered. `apply` writes the accepted items and nothing
  else. It places an added section where the template places it — after the
  nearest preceding fixed section the file has, else before the nearest
  following one, else at the end — and it leaves an author-added section where
  the author put it. There is one authority per file: the instrument for
  `{docs,Documents}/**/AGENTS.md`, your own reading for layer B.
```

- [ ] **Step 8: P4.7 — the structural comparison is a layer-B rule**

**P4.7** `skills/kisou/SKILL.md` — replace exactly these 3 lines

```text
  up template changes — no separate mode or trigger. Compare the file's
  structure against what the current template would produce for the detected
  inputs, and propose (always as numbered items, never a silent auto-merge):
```

**P4.7 →**

```text
  up template changes — no separate mode or trigger. For a **layer-B** file,
  compare its structure against what the current template would produce for
  the detected inputs, and propose — always as numbered items, never a silent
  auto-merge:
```

- [ ] **Step 9: P4.8 — the fall-through**

**P4.8** `skills/kisou/SKILL.md` — replace exactly these 4 lines

```text
  **Not kisou-managed** (real project content: custom headings / prose, no
  fingerprint) → do not attempt a merge. With approval, rename the original to
  `<file>.bak` and write a fresh template-filled file, then tell the author to
  graft the wanted sections back by hand. The `.bak` keeps this non-destructive.
```

**P4.8 →**

```text
  **Not kisou-managed** (no fingerprint matches) → **leave it alone and report
  it**: name the file, say which fingerprint it missed, and propose nothing
  for it. Renaming a file to `<file>.bak` and writing a fresh template-filled
  one is an operation the user asks for by naming the file; kisou never offers
  it. Uncertainty narrows the proposal.
```

- [ ] **Step 10: P4.9 — the per-artifact `docs/` line**

**P4.9** `skills/kisou/SKILL.md` — replace exactly these 2 lines

```text
- **`docs/` doc-system** → write the bundle if absent; if already present, leave
  it intact and add only around it.
```

**P4.9 →**

```text
- **`docs/` doc-system** → the instrument's report is the proposal, whether the
  doc-system is absent or present: an absent file is a `create` item (all
  seven, for a `none` doc-system — that is "write the bundle"), a missing
  fixed section an `add`, a diverged fixed-text section a `replace` shown with
  its diff. An author-added section is kept and reported. Content is never
  touched.
```

- [ ] **Step 11: P4.10 — Prohibited actions**

**A4.3** `skills/kisou/SKILL.md` — `grep -cF 'unless the user asked for that' skills/kisou/SKILL.md` — before: 0, after: 1

**P4.10** `skills/kisou/SKILL.md` — insert after this 1 line

```text
- Do NOT auto-push.
```

**P4.10 →**

```text
- Do NOT rename a file to `.bak`, or offer to, unless the user asked for that
  file by name.
```

- [ ] **Step 12: P4.11 — the sentence issue-2bf9 was filed against**

**P4.11** `skills/kisou/SKILL.md` — replace exactly these 4 lines

```text
  - a **diverged fixed-text section** — one whose template body has **no
    `<...>` free-text** (e.g. AGENTS `## Language`, the `docs/AGENTS.md`
    document-management rules) → show the diff and propose replacing the stale
    body.
```

**P4.11 →**

```text
  - a **diverged fixed-text section** — one whose body differs from the
    template's, fixed text being what the paragraph below defines (e.g. AGENTS
    `## Language`, `CLAUDE.md`'s pointer body) → show the diff and propose
    replacing the stale body.
```

The spec's P11 says "the examples stay". This block keeps one of the two and
**replaces the other**, because P4.7 scopes the bullet this example sits on to
layer B and `docs/AGENTS.md`'s document-management rules are precisely a file
the instrument now owns — an example that would send a reader to do by hand
what the paragraph below tells them not to. `CLAUDE.md`'s pointer body is a
layer-B fixed-text section, which is what the bullet is now about.

- [ ] **Step 13: P4.12 — the `partial` class sets no scope either**

The plan review found that P4.4 and P4.9 leave the `partial` bullet saying the
class decides what is proposed, and that only the missing pieces are proposed
— so after this plan `SKILL.md` would state two incompatible rules, and a
`partial` doc-system with a diverged present copy would read as out of scope.
This passage is **not one of the spec's eleven**; it is what spec fixed input 5
already says ("the classification says what is absent and nothing more"),
applied to the one bullet the spec did not name.

**P4.12** `skills/kisou/SKILL.md` — replace exactly these 2 lines

```text
  - **partial** (some artifacts present, others missing) → list what is present
    vs. missing and propose adding **only the missing** pieces. Surface any
```

**P4.12 →**

```text
  - **partial** (some artifacts present, others missing) → say what is present
    and what is missing, and stop there: what gets proposed comes from the
    instrument in the Present branch below, inside whatever scope the user
    picks, exactly as for a `full` doc-system. Surface any
```

- [ ] **Step 14: P4.13 — the flat types are the instrument's too**

Same cause. After P4.9 the instrument enumerates all seven targets and emits
the `create` items, so this bullet's instruction to enumerate
`{notes,reports}/AGENTS.md` by hand is a second authority for a fact P4.6's
closing sentence gives to one. The tally sentence, which is what the bullet is
for, stays.

**P4.13** `skills/kisou/SKILL.md` — replace exactly these 4 lines

```text
    managed per-type files). On any migrate, enumerate
    `{docs,Documents}/{notes,reports}/AGENTS.md` too and offer each **absent**
    one as a create — a refresh addition — so a repo already `full` on the
    managed four is not reclassified `partial` for lacking them.
```

**P4.13 →**

```text
    managed per-type files), so a repo already `full` on the managed four is
    not reclassified `partial` for lacking them. Both are among the seven
    targets the instrument enumerates in the Present branch below, and an
    absent one is one of its `create` items; you do not enumerate them.
```

- [ ] **Step 15: Lint**

```bash
./scripts/lint.sh skills/kisou/SKILL.md
```

Expected: exit 0, with `markdownlint-cli2` and the frontmatter hook reported as
**run**. `skills/kisou/SKILL.md` is under neither of
`.markdownlint-cli2.yaml`'s two `ignores` — those cover `docs/superpowers/**`
and `skills/**/templates/**` — so the hook really sees it.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing. (`MD013` is `false` in this repository, so line length is not
what would trigger it.)

- [ ] **Step 16: Commit**

```bash
git commit --only skills/kisou/SKILL.md -m "docs(kisou): the doc-system half of migrate is one executable, and an unmatched file is left alone" -m "Eleven passages. The doc-system comparison stops being a reading and becomes scripts/doc-system-check.js, whose numbered report is the proposal; the fall-through for a file no fingerprint matches becomes leave alone and report, and offering a .bak rename becomes a prohibited action; the doc-system fingerprint is the expanded H1 over every {docs,Documents}/**/AGENTS.md; the full class stops setting a scope; tidy's condition is stated once, in Step 2, as a CMakeLists.txt at the repository root; and a <...> marks free text only where a TEMPLATE FILL block says so (issue-e19f, issue-2bf9, issue-f50d, issue-f623, issue-afed)." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 17: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 18: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-11-kisou-refresh.md --task 4
```

Expected: every block of task 4 reported as applied, every anchor at its
stated `after:` value, and no residual for an `O` needle whose disposition
says gone.

---

## Task 5: `README.md` — the three places

**Batch:** B. **Blocks:** A5.1, P5.1–P5.3.

**Files:**

- Modify: `skills/kisou/README.md` — two replacements and one insertion.

**Interfaces:**

- Consumes, from task 4: the fall-through wording ("left alone and
  reported") and the fact that the doc-system comparison is the instrument.
  This task exists because `AGENTS.md` requires the sibling `README.md` to be
  reviewed for drift after a `SKILL.md` edit; it must land in the same batch
  as task 4 or the two disagree at the boundary.
- Consumes, from tasks 1 to 3: the file name `doc-system-check.js` and the
  fact that its tests run under `node --test`.
- O4.10 is this task's needle. It is written in task 4 with the rest of the
  `.bak` entity's needles and is not re-quoted here.

### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/kisou/README.md
```

Expected: `i/lf w/crlf attr/text=auto`. Write every passage with CRLF.

- [ ] **Step 2: P5.1 — the migrate bullet**

**P5.1** `skills/kisou/README.md` — replace exactly these 7 lines

```text
  full or docs-only scope; it also offers scripts the repo lacks. When a present
  `README` / `AGENTS` / `CLAUDE` (or a doc-system `AGENTS.md`) is kisou-managed,
  re-running migrate **refreshes it toward the current template** — adding
  missing sections and updating diverged fixed-text ones, never touching author
  free-text or removing author sections. When such a file instead holds real
  project content, it backs the file up to `.bak` and writes a fresh one (with
  approval) instead of forcing a merge.
```

**P5.1 →**

```text
  full or docs-only scope; it also offers scripts the repo lacks. When a present
  `README` / `AGENTS` / `CLAUDE` (or a doc-system `AGENTS.md`) is kisou-managed,
  re-running migrate **refreshes it toward the current template** — adding
  missing sections and updating diverged fixed-text ones, never touching author
  free-text or removing author sections; for a doc-system `AGENTS.md` that
  comparison is made by the bundled `scripts/doc-system-check.js` (Node 22 or
  later), not by reading. A file that matches no fingerprint is left alone and
  reported.
```

- [ ] **Step 3: P5.2 — Layout gains the `scripts/` bullet**

**A5.1** `skills/kisou/README.md` — `grep -cF 'the doc-system comparison migrate runs' skills/kisou/README.md` — before: 0, after: 1

**P5.2** `skills/kisou/README.md` — insert after these 3 lines

```text
- `templates/` — the bundled project template: layer-B files
  (`README` / `CONTRIBUTING` / `CLAUDE` / `AGENTS`) plus the `docs/`
  document-management system that `shoroku` fills.
```

**P5.2 →**

```text
- `scripts/` — `doc-system-check.js`, the doc-system comparison migrate runs,
  and its tests (`node --test`).
```

- [ ] **Step 4: P5.3 — Usage names the `node` requirement**

**P5.3** `skills/kisou/README.md` — replace exactly these 3 lines

```text
proposes a numbered file list before writing. In **migrate** mode it
enumerates existing files first and only asks about what detection couldn't
determine.
```

**P5.3 →**

```text
proposes a numbered file list before writing. In **migrate** mode it
enumerates existing files first and only asks about what detection couldn't
determine. Migrate's doc-system refresh needs `node` (22 or later) on the
path.
```

- [ ] **Step 5: Lint**

```bash
./scripts/lint.sh skills/kisou/README.md
```

Expected: exit 0, with `markdownlint-cli2` reported as **run**. As in task 4,
this runs **before** the Verify step below, because markdownlint runs with
`--fix`.

- [ ] **Step 6: Commit**

```bash
git commit --only skills/kisou/README.md -m "docs(kisou): the README follows SKILL.md on the instrument and the fall-through" -m "Three places, reviewed after SKILL.md as AGENTS.md requires: the migrate bullet says the doc-system comparison is made by the bundled scripts/doc-system-check.js and that a file matching no fingerprint is left alone and reported, replacing the .bak-and-rewrite sentence; Layout gains the scripts/ bullet; and Usage says migrate's doc-system refresh needs node (22 or later) on the path." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 7: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 8: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-11-kisou-refresh.md --task 5
```

Expected: every block of task 5 reported as applied and the anchor at its
stated `after:` value.

---

## Task 6: the sweep-and-check on this repository's copies

The measurement the dogfood's expectation is pinned to. It runs the finished
instrument against this repository's own seven copies and records what it
prints. **Its deliverable is recorded output, not a file:** nothing in the tree
changes, and the batch report carries the result verbatim. The reviewer of this
task re-runs the command rather than reading the report — a recorded number
nobody can reproduce is not a measurement.

**Files:**

- Create: none.
- Modify: none. **If this task changes a tracked file, it has gone wrong** —
  the two divergences it finds are closed by the dogfood, in a later batch, by
  the instrument, not by hand here.

**Interfaces:**

- Consumes: the finished `skills/kisou/scripts/doc-system-check.js` and, from
  the specification above, the report's printed forms.
- Produces: the verbatim `check` output that the dogfood task compares its
  proposal against, and that the dogfood report quotes.

- [ ] **Step 1: Run the check on this repository's seven copies**

This command's expected exit code is inverted by a later task in this plan —
it exits 1 now and 0 once the dogfood has landed — so it is written here as
text rather than as a replayable block. Run it in Git Bash from the repository
root:

```text
node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case
```

Expected, from the measurement of 2026-09-11 recorded in the spec: exit **1**,
two `replace` items and no note —

```text
1. replace: docs/notes/AGENTS.md — # notes/ — AGENTS
2. replace: docs/reports/AGENTS.md — # reports/ — AGENTS
```

the first being the H1 section's intro paragraph and the second the H1
section's second paragraph. Both are line-wrapping only: the content is
identical, which is what makes them the clean demonstration of the invariant.

The spec's "6 lines" and "4 lines" are the two paragraphs' own line counts.
**The printed item is longer than that**, because a `replace` prints the whole
section body both ways and the H1 section holds more than the one paragraph.
Do not reconcile on a line count.

The expectation was re-measured independently on 2026-09-11, before this plan
was committed, without the instrument — each template expanded by substituting
every `{{name}}` with the name itself (the `snake_case` mapping is the
identity) and compared with `diff --strip-trailing-cr`:

- `docs/AGENTS.md` and the `requirements`, `design`, `decisions` and `issues`
  copies are **identical** to their expanded templates once trailing CR is
  ignored — the five are `w/crlf`, so a byte comparison without that flag
  shows every line changed and means nothing;
- `docs/notes/AGENTS.md` and `docs/reports/AGENTS.md` really differ, in the H1
  section only, by wrapping only;
- those same two are the only doc-system copies that are `w/lf`, which is the
  mechanism: a tool rewrote them after checkout.

So two items, and the instrument's CRLF normalization is what makes the other
five identity rather than five more `replace` items. If this task reports
seven, the normalization is missing.

- [ ] **Step 2: Record the output verbatim in the batch report**

Paste the command's whole stdout into the batch report, inside a fence, with
the exit code beside it. Every line, including both diff blocks — the `-` block
and the `+` block of each item — and the summary line. This is the text the
dogfood's proposal is checked against, so an abridged copy is worthless.

- [ ] **Step 3: Reconcile the result with the expectation**

Compare what you recorded against Step 1's expectation, on three points: the
number of items is 2; both are `replace`; the paths are `docs/notes/AGENTS.md`
and `docs/reports/AGENTS.md`, in that order; and there is no note.

- If it matches, say so in the report and continue.
- **If it does not match, stop and report.** Do not adjust the instrument to
  produce the expected output, and do not edit either copy. A third item, a
  note, or a different path means either the instrument disagrees with the
  spec's measurement or the tree moved since 2026-09-11; which one it is, is
  the next session's question, not this task's.

- [ ] **Step 4: Confirm nothing was written**

````bash
git status --porcelain
````

Expected: no line for any path under `docs/` and none for
`skills/kisou/scripts/`. `check` reads and prints; it writes nothing.

**Verify.** The task carries no passage, so its Verify is the command that
shows its deliverable exists, on this repository's real tree:

````bash
node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case | grep -c '^[0-9]\+\. replace: docs/'
````

Expected: `2`. This is a Git Bash pipeline and is unrunnable in PowerShell. It
reports the count only, so it stays true whether the tree is level or not —
the count is `2` here and `0` after the dogfood, and a reviewer re-running it
at this batch's boundary sees `2`. Note that `grep -c` printing `0` exits 1,
so read the printed number, not the exit code.

**Done when:** the batch report carries the whole `check` output verbatim with
its exit code, the two expected items reconcile with the spec's measurement of
2026-09-11, and `git status --porcelain` shows the task changed nothing.

---

## Task 7: the dogfood — `kisou migrate` on this repository

The first task of the last batch. It runs the refreshed skill against this
repository through the trigger a user would type, accepts the two replacements,
and measures the hook's command before and after. **This task is run in
Jisso's own session**, not in a subagent: the migrate flow is a dialogue, and
its prompts and answers are the measurement.

**Approval.** Two of this plan's edits fall under this repository's `AGENTS.md`
"Never do" list, and both were approved by the human on **2026-09-11**, in
`.superpowers/sdd/kisou-refresh/dialogue.md` at **Q-12**: the rewrite of
`docs/notes/AGENTS.md` and `docs/reports/AGENTS.md` (agent instruction files),
and the `.pre-commit-config.yaml` hook together with the `CONTRIBUTING.md`
line. Cite Q-12 in the commit body. **Do not ask again.**

**Files:**

- Create: none.
- Modify: `docs/notes/AGENTS.md` and `docs/reports/AGENTS.md` — **written by
  `apply`, through the migrate run, never by hand.** If you find yourself
  editing either file in an editor, the task has gone wrong: the whole point is
  that the instrument writes them.

**Interfaces:**

- Consumes: the finished instrument, the refreshed `SKILL.md` and `README.md`,
  and the verbatim `check` output the sweep-and-check task recorded.
- Produces: the two files brought level; a `check` on this repository that
  exits 0, which is the precondition of the hook task that follows; and the
  session record — the prompts, the answers, the six measurements — that the
  dogfood report is written from.

- [ ] **Step 1: Confirm the session will load the branch's skill**

The kisou skill is reached through a link into this working tree, so a session
started on this branch reads the new text. Confirm it before the run, from the
repository root:

````bash
grep -c 'doc-system-check' skills/kisou/SKILL.md
````

Expected: `2` or more — the prerequisite paragraph and the migrate command.
This plan's own passages land `4`, measured by applying them at this plan's
dry run; the check is a floor rather than that number, so a later fix that
mentions the script again does not fail it. If it prints `0`, the skill text
of this batch is not on the branch yet and this task cannot run.

- [ ] **Step 2: Measure the "before"**

Run the hook's exact command once, **before** accepting anything, so the
failure is measured rather than asserted. Its expected exit code is inverted by
this very task, so it is written as text rather than as a replayable block:

```text
node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case
```

Expected: exit **1**, the same two `replace` items the sweep-and-check task
recorded. Copy the output and the exit code into the session record — this is
issue-acc0's "before".

- [ ] **Step 3: Invoke migrate through its real trigger**

Type the trigger, in this session, exactly as a user would:

```text
起草して migrate
```

Do not call the skill any other way, and do not paraphrase the flow. The point
of the dogfood is that the skill's own text drives the run; a hand-run
approximation measures nothing.

- [ ] **Step 4: Answer the scope and detection prompts, and record them**

The scope is **docs-only**. Record verbatim, in the session record: what the
run detected (`case`, the docs root, the doc-system classification), what it
asked, and what was answered. The classification for this repository is `full`;
under the refreshed text that sets no scope of its own, which is issue-f50d's
measurement — record whether the run tried to narrow the scope on its own.

- [ ] **Step 5: Record the scripts-intent prompt, and decline every slot**

Record the offered slots verbatim. Expected: `setup`, `run`, `build` and
`test`, **and not `tidy`** — this repository has no `CMakeLists.txt` at its
root, which is the detectable condition the refreshed Step 2 states, and this
is issue-afed's measurement. Decline all of them: this plan adds no script.

If `tidy` is offered, record that verbatim and continue — it is a finding
against the skill text, not a reason to stop the run.

- [ ] **Step 6: Record the numbered proposal**

Record the whole proposal verbatim. Expected: exactly two items, both
`replace`, on `docs/notes/AGENTS.md` and `docs/reports/AGENTS.md`, each shown
with its diff, and no note — the same two the sweep-and-check task recorded,
renumbered by kisou if the proposal carries layer-B items above them (in
docs-only scope it does not, so the numbers are the tool's own).

**If the proposal instead offers to rename either file to `.bak`, or reports
any of the seven copies as not kisou-managed, stop and report.** That is the
old skill text running, which means the session loaded a stale copy of the
skill, and no acceptance should be given.

- [ ] **Step 7: Accept both items**

Accept items 1 and 2. The run passes the accepted numbers to
`apply --items`, which writes both files. Record what `apply` printed.

- [ ] **Step 8: Measure the "after"**

````bash
node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case
````

Expected: exit 0, and the summary line `0 items, 0 notes`. This is issue-acc0's
"after", and it is the precondition for the hook task that follows: the commit
that adds the hook runs it, and it passes only on a level tree.

- [ ] **Step 9: Confirm the two files are what changed, and only them**

````bash
git status --porcelain
````

Expected: exactly two modified paths, `docs/notes/AGENTS.md` and
`docs/reports/AGENTS.md`. Nothing under `skills/kisou/templates/` — this plan
changes no template body — and no third `docs/` file.

- [ ] **Step 10: Lint the two changed paths, then re-check**

````bash
./scripts/lint.sh docs/notes/AGENTS.md docs/reports/AGENTS.md && node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case
````

Windows alternative for the first half: `scripts\lint.bat` with the same two
paths. Expected: lint exits 0, and the re-run `check` still exits 0 with
`0 items, 0 notes`. The order matters: markdownlint runs with `--fix` on these
paths and the templates are excluded from it by configuration, so if lint
changed either file the templates expand to something markdownlint would fix
and the invariant cannot hold. **If the second command now reports an item,
stop and report** — that is a template-side finding, and a template body change
is out of this plan's scope.

- [ ] **Step 11: Commit the two files**

````bash
git commit --only docs/notes/AGENTS.md docs/reports/AGENTS.md -m "docs: bring the two drifted doc-system copies level with their templates" -m "kisou migrate, docs-only scope, run through its own trigger with the refreshed skill: two replace items, both line-wrapping only, written by scripts/doc-system-check.js apply. The check now exits 0 on this repository, which is what the pre-commit hook needs. Approved by the human on 2026-09-11 (dialogue.md Q-12) as an edit to agent instruction files (issue-acc0, issue-f50d)." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
````

- [ ] **Step 12: Verify the trailer**

````bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: `1`.

**Verify.** The task carries no passage, so its Verify is the command that
shows its deliverable exists:

````bash
node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case && git diff --name-only HEAD~1 HEAD
````

Expected: `check` exits 0 printing `0 items, 0 notes`, and the diff names
exactly `docs/notes/AGENTS.md` and `docs/reports/AGENTS.md`.

**Done when:** the run went through the `起草して migrate` trigger in docs-only
scope, the scripts prompt offered `setup` / `run` / `build` / `test` and not
`tidy`, the proposal was exactly the two expected `replace` items with no
`.bak` offer and no note, both were accepted and written by `apply`, the
check's exit code moved from 1 to 0, lint left both files alone, and the
session record holds the prompts, the answers, the "before" and the "after"
verbatim.

---

## Task 8: the hook, and the `node` prerequisite

**Batch:** C, **after task 7**. **Blocks:** A8.1, A8.2, P8.1, P8.2.

**Files:**

- Modify: `.pre-commit-config.yaml` — one insertion, into the existing
  `repo: local` block that holds `check-md-frontmatter`.
- Modify: `CONTRIBUTING.md` — one insertion, into Prerequisites.

**Both edits are on `AGENTS.md`'s "Never do" list and both are approved**:
`dialogue.md` Q-12, 2026-09-11, the spec's review gate, brief point 1.4. The
commit body cites Q-12. Do not ask again, and do not widen the edit past
these two blocks.

**Interfaces:**

- Consumes, from task 7: a level tree. The commit that adds the hook **runs**
  the hook, and the hook passes only when
  `check --docs docs --case snake_case` exits 0. Running this task before
  task 7 makes its own commit fail; that is why the batch's order is
  load-bearing.
- Consumes, from tasks 1 to 3: the script's path and its exact `check`
  invocation, which the hook's `entry:` spells out in full.

### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol .pre-commit-config.yaml CONTRIBUTING.md
```

Expected: `i/lf w/crlf attr/text=auto` on both. Write both passages with
CRLF.

- [ ] **Step 2: P8.1 — the hook**

**A8.1** `.pre-commit-config.yaml` — `uv run --no-project --with pyyaml python -c "import yaml,io; d=yaml.safe_load(io.open('.pre-commit-config.yaml',encoding='utf-8').read()); print(sum(1 for r in d['repos'] for h in r.get('hooks',[]) if h['id']=='kisou-doc-system-check'))"` — before: 0, after: 1

The anchor is the **YAML load**, not a grep, because the spec asks for "the
file's own YAML load as its anchor" and because a grep cannot tell a hook that
is a member of a `repos[].hooks` list from one that is merely present in the
file's text. `replay` runs every anchor against the applied copy, so this one
is exercised at every dry run of this plan and not only when Jisso reaches
Step 4.

**P8.1** `.pre-commit-config.yaml` — insert after these 5 lines

```text
      - id: check-md-frontmatter
        name: check Markdown frontmatter
        language: system
        types: [markdown]
        entry: uv run --no-project --with pyyaml python scripts/check_md_frontmatter.py
```

**P8.1 →**

```text

      - id: kisou-doc-system-check
        name: kisou doc-system copies match their templates
        language: system
        pass_filenames: false
        files: ^(skills/kisou/templates/docs/|docs/AGENTS\.md$|docs/[^/]+/AGENTS\.md$)
        entry: node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case
```

- [ ] **Step 3: P8.2 — `node` in Prerequisites**

**A8.2** `CONTRIBUTING.md` — `grep -cF 'kisou-doc-system-check' CONTRIBUTING.md` — before: 0, after: 1

**P8.2** `CONTRIBUTING.md` — insert after this 1 line

```text
- [mise](https://mise.jdx.dev/) — the pinned Node 22 the tanto plans test on
```

**P8.2 →**

```text
- [Node.js](https://nodejs.org/) 22 or later — the `kisou-doc-system-check`
  pre-commit hook runs `node`.
```

- [ ] **Step 4: Load the YAML for real**

```bash
uv run --no-project --with pyyaml python -c "import yaml,io; d=yaml.safe_load(io.open('.pre-commit-config.yaml',encoding='utf-8').read()); print(sum(1 for r in d['repos'] for h in r.get('hooks',[]) if h['id']=='kisou-doc-system-check'))"
```

Expected: `1`. This is `A8.1`'s command, run as a step so the executor sees it
rather than only the dry run.

- [ ] **Step 5: Lint both changed paths**

```bash
./scripts/lint.sh .pre-commit-config.yaml CONTRIBUTING.md
```

Expected: exit 0, with `yamllint`, `check yaml` and `markdownlint-cli2`
reported as **run**. This is the only place in the plan that lints either
path, and it runs **before** the commit and before the Verify below, because
markdownlint runs with `--fix`.

Note what this lint does **not** do: it does not run the new hook.
`.pre-commit-config.yaml` does not match the hook's own `files:` pattern, so
pre-commit skips it here. Step 6 is what runs it.

- [ ] **Step 6: Run the hook by id, over all files**

```bash
uv tool run pre-commit run kisou-doc-system-check --all-files
```

Expected: `Passed`. If it fails, **task 7 did not land** — the hook passes
only on a tree the dogfood has levelled, which is why this batch's order is
7 → 8 → 9. Do not weaken the hook to make this pass.

- [ ] **Step 7: Commit**

The commit that adds the hook is the first commit the hook runs on. It passes
only because task 7 already levelled the tree; that is the whole point of the
order.

```bash
git commit --only .pre-commit-config.yaml CONTRIBUTING.md -m "build: check that this repository's doc-system copies match their kisou templates" -m "One pre-commit hook, in the existing repo: local block, running scripts/doc-system-check.js check over docs/ whenever a doc-system copy or a kisou docs template changes; and one line in CONTRIBUTING.md's Prerequisites naming Node 22 or later, which is what the hook runs. From here on, a commit that edits a template's body fails its own check unless the same commit brings this repository's copies level - the invariant working as designed. Approved by the human on 2026-09-11 (dialogue.md Q-12) as an edit to linter configuration and to repo-root Markdown (issue-acc0)." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 8: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 9: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-11-kisou-refresh.md --task 8
```

Expected: both blocks applied and both anchors at their stated `after:`
values.

---

## Task 9: the dogfood report

The last task of the last batch. It freezes what the dogfood run answered, so
the six issues can be closed against a record rather than a memory.

**Files:**

- Create: `docs/reports/2026-09-11-kisou-refresh-dogfood.md`
- Modify: none.

**Interfaces:**

- Consumes: the session record the dogfood task produced — the prompts, the
  answers, the proposal, the "before" and "after" of the hook's command — and
  the verbatim `check` output the sweep-and-check task recorded.
- Produces: the report the six issues cite when they move to
  `docs/issues/resolved/`, which happens outside this plan.

**Shape.** `docs/reports/AGENTS.md` governs, and it is the file to read before
writing:

- **No frontmatter.** The `# H1` is the title; the leading paragraph states the
  scope.
- **The date lives only in the file name.** Never restate it as an
  `Investigation date:` line or a frontmatter field.
- Path is `docs/reports/<YYYY-MM-DD>-<slug>.md`, slug in English kebab-case —
  here `2026-09-11-kisou-refresh-dogfood.md`.
- Dated and frozen: it preserves what was true at the run, and is not
  rewritten as the project moves on. Append-only afterwards.
- Reports are cited **by path**, and they cite others by path too; but a
  managed entry is cited as `<type>-<id>`, never by path — so the six issues
  are `issue-e19f`, `issue-2bf9`, `issue-f50d`, `issue-f623`, `issue-afed`,
  `issue-acc0`, and the spec is cited **by name and date** — "the kisou refresh
  design spec of 2026-09-11" — because a document under `docs/superpowers/` has
  neither an `<id>` nor a renamer who owns inbound links, and a path to it from
  a frozen report can neither survive nor be repaired.

- [ ] **Step 1: Read the type's rules**

````bash
cat docs/reports/AGENTS.md
````

Expected: the `# reports/ — AGENTS` file, with its `## Rules` and
`## Lifecycle` sections. Follow it, not this task's summary of it, where the
two differ.

- [ ] **Step 2: Write the report**

Create `docs/reports/2026-09-11-kisou-refresh-dogfood.md` with this structure.
Every quoted block is copied from the session record — nothing is
reconstructed from memory, and nothing is rounded.

```text
# The kisou refresh dogfood

<leading paragraph: what was run — kisou migrate, docs-only scope, on this
repository, through its own trigger, with the refreshed skill on the
kisou-refresh branch — and what the run was for: to measure the six issues the
kisou refresh design spec of 2026-09-11 set out to resolve.>

## What was run

<the trigger, the scope, the case and docs root the run detected, and the
session it ran in.>

## The proposal, verbatim

<the numbered proposal exactly as the run printed it, both diffs included.>

## The answers given

<every prompt and the answer it got: the scope, the detected values confirmed,
the scripts-intent prompt with the slots it offered, and the acceptance.>

## The six measurements

<one subsection or one row per issue, each naming the issue by <type>-<id>,
what was expected, and what was observed.>

## What the session reads like

<the reading: what the run showed about the refreshed text — where it was
clear, where it hesitated, what a next reader should know.>
```

The six measurements, with their expected values from the spec:

| Issue | The question the run answers | Expected |
| --- | --- | --- |
| issue-e19f | Are the four per-type copies and the two flat copies classified kisou-managed? | Yes, all six, by the H1 rule |
| issue-2bf9 | Are the sections that carry `<id>` notation treated as fixed-text? | Yes — the two replacements are in such files, and no section was skipped as free text |
| issue-f623 | Where does an added section land? | **The run has no `add` item, so the evidence is test case 5, quoted in the report** — not the run |
| issue-afed | Is `tidy` offered on this repository? | No |
| issue-f50d | Does a `full` doc-system in docs-only scope draw refresh proposals? | Yes, the two above |
| issue-acc0 | Do the two copies come level, and does the hook's command fail before and pass after? | Yes; the "before" was measured by running the command once before accepting |

**issue-f623's row is the one to get right.** This run produced no `add` item,
so the run is not its evidence. Quote test case 5 from
`skills/kisou/scripts/doc-system-check.test.js` in the report — the three
insertion cases and what each asserts — and say plainly that the dogfood did
not exercise the insertion rule, so the test is what closes the issue. A report
that implied otherwise would be the kind of claim this whole plan exists to
stop.

Record the observed values, not the expected ones. Where an observation differs
from the expectation, write the observation and say it differed; the
expectation is the spec's, and a report that edits its measurements to match a
prediction is worthless.

- [ ] **Step 3: Lint the new file**

````bash
./scripts/lint.sh docs/reports/2026-09-11-kisou-refresh-dogfood.md
````

Windows alternative: `scripts\lint.bat` with the same path. Expected: exit 0,
with markdownlint and the frontmatter hook reported as run. The frontmatter
hook is the one to watch: a report takes **no** frontmatter, and a hook failure
here means the file has some.

- [ ] **Step 4: Confirm the report cites what it must, and nothing it must not**

````bash
grep -c 'issue-e19f\|issue-2bf9\|issue-f50d\|issue-f623\|issue-afed\|issue-acc0' docs/reports/2026-09-11-kisou-refresh-dogfood.md
````

Expected: `6` or more — every one of the six issues cited at least once by
`issue-<id>`.

````bash
grep -c 'docs/superpowers/specs' docs/reports/2026-09-11-kisou-refresh-dogfood.md
````

Expected: `0` — the spec is cited by name and date, never by path, because this
report is frozen and such a path can neither survive nor be repaired. `grep -c`
printing `0` exits 1, so read the printed number, not the exit code. Both are
Git Bash pipelines and are unrunnable in PowerShell.

- [ ] **Step 5: Commit**

````bash
git add docs/reports/2026-09-11-kisou-refresh-dogfood.md
git commit --only docs/reports/2026-09-11-kisou-refresh-dogfood.md -m "docs(reports): the kisou refresh dogfood" -m "What the migrate run on this repository answered: the proposal verbatim, the prompts and the answers given, and the six measurements the refresh was designed to take - including that the run produced no add item, so the insertion rule is closed by the instrument's test case, not by this run (issue-e19f, issue-2bf9, issue-f50d, issue-f623, issue-afed, issue-acc0)." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
````

- [ ] **Step 6: Verify the trailer**

````bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
````

Expected: `1`.

**Verify.** The task carries no passage, so its Verify is the command that
shows its deliverable exists:

````bash
test -f docs/reports/2026-09-11-kisou-refresh-dogfood.md && head -1 docs/reports/2026-09-11-kisou-refresh-dogfood.md
````

Expected: the file exists and its first line is the `# ` H1 — not `---`, which
would mean it grew frontmatter a report may not have.

**Done when:** the report exists at its dated path with no frontmatter, carries
the proposal verbatim, the answers given, and the six measurements with their
observed values; issue-f623's row says the evidence is test case 5 and not the
run; the six issues are cited by `issue-<id>` and the spec by name and date;
and lint passes on the new path.

---

## Self-Review

**Sizes**, measured on this document, 2026-09-11.

| Task | Lines | Steps |
| --- | --- | --- |
| 1 | 540 | 7 |
| 2 | 287 | 7 |
| 3 | 384 | 7 |
| 4 | 340 | 13 |
| 5 | 106 | 5 |
| 6 | 117 | 4 |
| 7 | 177 | 12 |
| 8 | 109 | 6 |
| 9 | 168 | 6 |

**The largest task is task 1, at 540 lines and 7 steps.** It is the widest by
line count because it carries the module's whole skeleton — the helpers every
later task calls, and the test file's preamble — and three of the spec's nine
test cases. **Task 4 has the most steps, 13**, one per passage plus the
baseline and the Verify; its 340 lines are almost entirely quoted text, old
and new, which is a different kind of length from task 1's. Both numbers are
recorded rather than judged: issue-7281 asks for the sizes until a threshold
can be chosen.

**Two tasks are sweep-and-check shapes** — their deliverable is recorded
output rather than a file:

- **task 6**, which runs `check` on this repository's seven copies and records
  what it prints; it modifies nothing, and "it changed a tracked file" is its
  failure condition;
- **task 7**, the dogfood, whose deliverable is the run's transcript and the
  two writes the instrument makes when the run accepts them — no file in it is
  edited by hand.

Both invert the reviewer's standing instruction, so both dispatches say the
reviewer **re-runs** the commands rather than reading the report. The
context-cost run measured that shape at 1.93× the median implementer and 1.39×
the median reviewer; expect these two to cost more than their line counts
suggest.

**What this plan does not carry.** No task touches a template body, no task
renames a heading in `skills/kisou/templates/**`, and no task edits
`docs/design/c1d2-kisou.md` or any issue file — those are T1's and T2's, and
`O4.1`'s residual in `c1d2` is left standing for that reason. Report and
prompt skeletons are the tanto templates'; this plan names nothing else about
them.

**One inconsistency is knowingly left standing.** `skills/kisou/SKILL.md`'s
Scope bullet still promises "the `docs/issues/{open,deferred,resolved}/`
skeleton", while Step 3 (scaffold) item 3 says not to create those directories
and the spec's own review ruled that nobody creates them. The plan review
found it. It is **pre-existing** — no passage of this plan causes it, and none
of the six issues is about it — so it is left for an issue at T1 rather than
becoming a fourteenth passage. This is the line the plan draws: a
contradiction **this plan creates** is fixed here (that is what `P4.12` and
`P4.13` are), and one it merely stands next to is filed.
