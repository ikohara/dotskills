# tanto's own state under `.tanto/` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move every file `tanto` writes for itself out of `.superpowers/sdd/`
and into `<workspace>/.tanto/` — one directory per topic, from the topic's
opening to the plan's close, self-ignored and self-lint-silenced — so that the
ledger move at the plan's landing disappears, the topic word and the plan
basename stop naming two directories, and the roster sits at a fixed path a
bug-report sender can read the intake's address from. The artifacts of the
skills `tanto` composes stay where those skills put them and are reached by
pointer.

**Architecture:** Every task is a **passage** edit of Markdown: the task
carries the old passage and the new passage verbatim, replaces exactly the one
for the other, and changes no other byte, so a touched file's diff against the
base is exactly the union of the passages landed in it so far. Each block
appears in this plan exactly once and is cited by its id wherever it is needed
again. Nothing executable changes: `skills/tanto/scripts/passage-check.js` and
its test carry no path this plan moves, and no task touches them. The batch cut
follows one line — batch A lands **every file a session loads** (`SKILL.md`,
the four role files, the templates), batch B lands the two files that are read
by people and by verification commands but never loaded by a session.

**Tech Stack:** Markdown throughout; `node "$TANTO/scripts/passage-check.js"`
(Node 22 or newer) for `lint`, `replay`, `diff` and `verify`; `pre-commit`
through `./scripts/lint.sh` (Windows: `scripts\lint.bat`); `git diff` against
the base named below, `git ls-files --eol`, and `grep -rn` / `grep -rcF` for
the sweeps.

**Spec:** `docs/superpowers/specs/2026-09-11-tanto-workspace-design.md`

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
  shared. This plan creates no file, so no `git add` is needed anywhere in it.
- Every commit message ends with a `Co-Authored-By:` trailer identifying the
  agent. Two identities coexist in practice and both satisfy `AGENTS.md`, so
  **the check greps the prefix `Co-Authored-By: Claude`, per commit, in a
  loop** — an aggregate `grep -c` over the branch counts trailer lines, so a
  commit carrying two and a commit carrying none balance out.
- Never `git add -A`, `.`, or `-u`; never a bare `git commit`; never
  `git commit -a`. Never amend a published commit. Never push to `origin/main`.
  Never bypass a hook (`--no-verify`, a `core.hooksPath` override).
- Do not edit agent instruction files, repo-root Markdown, or linter/formatter
  configuration. In particular this plan touches neither the repository's
  `.gitignore` nor its `.markdownlint-cli2.yaml`: the two files that keep
  `.tanto/` quiet are written **inside** `.tanto/`, which is the whole point of
  the design (spec input 3).

### Models

From `tanto.json`. The personal file at `$CLAUDE_CONFIG_DIR/tanto.json` sets
only `sessions.sekkei = "opus"` for this topic's plan stage; every `subagents`
key is a built-in default.

| Dispatch | Model |
| --- | --- |
| implementer, fix rounds 1-3 | `sonnet` |
| task reviewer, scoped re-review, whole-branch review | `opus` |
| fix rounds 4-5 | `opus` |
| anything else | `sonnet` |

**Every dispatch names a `model`.** An omitted `model` inherits the session's,
which on Jisso is `opus` — the exact failure the rule prevents.

### `$TANTO`

`$TANTO` is the tanto skill's own directory, which the harness names when it
invokes the skill. It is set **in the same tool call as the command that uses
it**; shell state does not persist between calls, and an unset variable makes
the command read a path at the filesystem root. In this repository the skill is
linked into the working tree at `skills/tanto`, so `TANTO=skills/tanto` is the
form every command in this plan spells.

### The created paths

None. This plan creates no tracked file: every task replaces text in a file
that already exists. `diff` therefore exempts nothing but the plan's own path,
which it exempts by itself.

```text
created:
```

The empty declaration above is deliberate and is not read by the instrument —
`created:` lines are collected by prefix, and a line with nothing after the
colon exempts nothing. It is here so that a reader who looks for the section
finds the answer rather than its absence.

### `diff`'s base is the last commit before task 1, not the merge base

The branch `tanto-workspace` already carries commits over `main` that no task
of this plan wrote — the spec, the spec Sekkei's exit shoroku, and whatever T1
Kanri commits once the plan lands — and `diff` is unscoped by path: every added
line of those commits would read as `unaccounted-added` at every boundary.

**No commit hash is written here.** A hash in tracked content goes stale the
first time the branch is rebased. The base is derived instead, and the
derivation holds because **no commit before task 1 touches `skills/tanto/`**
(measured 2026-09-12: `git log main..HEAD -- skills/tanto` is empty), and
decision-2f36's hotfix lane is closed for every `skills/tanto/` file while this
plan is in flight, because the plan lists them all (tanto-workspace S-5):

```bash
BASE="$(git log --format=%H --reverse main..HEAD -- skills/tanto | head -1)^" && echo "$BASE"
```

That is the parent of task 1's first commit. It resolves to nothing until task
1 has committed, which is correct: `diff` runs at a boundary, after commits.

**Kanri records the resolved value in the ledger at the first boundary, and
every batch prompt carries it. A later re-derivation that yields a different
hash — or nothing — is a stop, not a recompute.** `main..HEAD` is re-evaluated
every time the command runs: a commit touching `skills/tanto/` landing on
`main` mid-plan moves the first commit in the range, and a `main` fast-forwarded
past this branch empties it. Neither should happen — the hotfix lane is closed
for `skills/tanto/` while this plan is in flight — but "should not" is not a
check, and a base that moves silently turns `diff` into a check that passes for
the wrong reason.

**The option not taken.** `created:` exempts by **path**, so declaring the
spec's path and the known shoroku paths there would let `diff` keep the merge
base and would shrink the hand-triage below to the paths nobody can name in
advance. It is rejected because exempting a path exempts *every* change to it,
including one this plan should have caught, and because a shoroku commit's
paths are chosen at the moment it is written — an exemption list that is
right today and wrong at the close is worse than a triage rule that is stated
once and holds.

**One class of line will show up in `diff` and is not a defect.** A
`docs: exit shoroku …` or `docs: T<n> shoroku …` commit that lands *after* the
base — a role leaving at a boundary, T2 at the close — writes under `docs/`
outside this plan's two paths, and its lines are `unaccounted-added` because no
block quotes them. Kanri places each against the commit that wrote it. The
check's subject is `skills/tanto/` and `docs/notes/tanto-consistency-checks.md`;
a line outside those two, attributable to a shoroku commit, is noise, and a
line **inside** them that no block explains is the defect the check exists for.

### The commands `replay` does not run

`replay` reads this list the way it reads `created:`. Declared once here rather
than marked line by line:

```text
replay-skip: ./scripts/lint.sh — pre-commit needs the repository and its hook cache, which the applied tree is not
replay-skip: node --test — the test suite lives in skills/tanto/scripts/, which no passage of this plan touches and the applied tree therefore does not carry
replay-skip: uv run — the frontmatter and JSON loads need this repository's tooling, not a scratch tree
replay-skip: .tanto/ — the transition's state is created in the working tree by Kanri at batch A's boundary; an applied copy of the plan's blobs has no such directory
replay-skip: plugins/cache — the pinned-quote check reads the superpowers source outside the repository, which is not what a replay of this plan's passages tests
replay-skip: passage-check.js diff — diff's subject is this branch's history, which the applied tree is not; verify is skipped by the script's own rule, diff is not
replay-skip: git log --format=%H --reverse — the base derivation reads the branch history, which the applied tree does not have
replay-skip: 2026-09-12-tanto-workspace.md — a command that reads the plan's own text, such as task 6's boundary sweep; the applied tree holds only the blobs the plan's passages edit
```

`git` and `passage-check.js verify` are skipped by the script's own rules and
need no declaration.

**The whole-tree sweeps are deliberately *not* skipped.** Every file in the
sweep set that carries a needle also carries a passage, so `replay`'s applied
tree holds the same text the real tree will hold after the plan; running the
sweeps there is a real test of the expected counts rather than noise. The files
the applied tree lacks — `templates/kaiseki-report.md`, `templates/tanto.json`,
`scripts/passage-check.js` and its test — carry zero hits of every needle today
(measured 2026-09-12), so their absence changes no count.

### The tree encoding and line endings this work must preserve

Measured in this repository on 2026-09-12. `.gitattributes` carries
`* text=auto`, with `eol=lf` for `*.sh` and the JavaScript and JSON family and
`eol=crlf` for `*.bat`. `core.autocrlf` is `true`. Every file this plan touches
is Markdown and reports `i/lf w/crlf attr/text=auto` under `git ls-files --eol`
— index LF, working tree CRLF, nothing mixed.

- Read as UTF-8 and normalize CRLF to LF before any comparison, search, or line
  count. A block written LF against a file checked out CRLF never matches, and
  the failure looks like a missing passage.
- Write each passage with the target file's own ending, and use an edit tool
  that rewrites only the lines you name rather than one that rewrites the whole
  file.
- A file whose endings are mixed is reported, never silently normalized.
  `git ls-files --eol` decides, before and after — never a grep for a control
  character. `w/mixed` on any path is a failure.

### Rule 11 — the authority for this run's sessions

This plan edits `skills/tanto/` files that the run's own sessions read, and
this repository links the skill into the working tree, so a session started
mid-plan reads whatever is on disk at that moment. **Until batch A's boundary,
the authority for every session of this run is this Global Constraints section,
Kanri's orders line, and the batch prompts — not the role text on disk.** Kanri
records that as a ruling when the plan lands (ledger R-1), and every batch
prompt and any handover file carries it.

The boundary itself is stated in its own section below, because it is a
narrowing of decision-5c8e and has to be legible as one.

### The transition at batch A's boundary — a Kanri directive

This is **not a task**. It is a step addressed to Kanri, performed under rule
11's authority sentence above, once batch A is accepted and before batch B's
prompt is written — where Kanri's own boundary edits sit, after the commit
window (loop step 7, Jisso idle) and before the next prompt (step 8). It
touches untracked files only and needs no commit. In order:

1. Create `.tanto/` and write into it `.gitignore` holding the one line `*`,
   and `.markdownlint-cli2.yaml` holding the two lines `config:` and
   `  default: false`. Write each only when it is absent; never overwrite
   either.
2. Rename, with `mv` and never a copy, to the same names under `.tanto/`:
   `.superpowers/sdd/roster.md`, `.superpowers/sdd/roster-archive.md`,
   `.superpowers/sdd/inbox/`, every
   `.superpowers/sdd/exit-kanri-*-proposal.md`,
   `.superpowers/sdd/kanri-handover.md` if one is pending, and
   `.superpowers/sdd/tanto-workspace/` — this topic's directory, ledger
   included. `.superpowers/sdd/kisou-refresh/`,
   `.superpowers/sdd/2026-09-11-kisou-refresh/`, every older topic directory
   and plan workspace, and this plan's own SDD workspace
   `.superpowers/sdd/<plan-basename>/` all stay where they are.
3. Leave `.superpowers/sdd/.gitignore` and
   `.superpowers/sdd/.markdownlint-cli2.yaml` alone: the first is superpowers',
   the second the human placed by hand, and the SDD workspaces still there
   benefit from it.
4. In the moved files, rewrite the two header lines that name the old place:
   the roster's "Kept by Kanri at `.superpowers/sdd/roster.md`" to
   `.tanto/roster.md`, and the live ledger's "Lives at
   `.superpowers/sdd/<topic>/kanri.md` until the plan is committed, then moves
   …" paragraph to the new text of `P4.2`, which task 4 lands in
   `templates/kanri.md`. Every
   other file in the moved directory — `spec-inputs.md`'s header,
   `dialogue.md`'s note on where the draft lived, the review reports — keeps
   its text as the spec-phase record, and the ledgers of the closed plans under
   `.superpowers/sdd/` keep their old headers: historical text, and nobody
   "fixes" it.
5. Write one Events line in the roster, at its new path, after the `mv`: "live
   state moved from `.superpowers/sdd/` to `.tanto/` at batch A's boundary
   (tanto-workspace input 6): the roster, the archive, the inbox, the Kanri
   exit proposals, and this topic's directory; older records stay". Kanri's
   Residency row is rewritten at this boundary as at any other.
6. From here on, name `.tanto/tanto-workspace/` in every prompt and every
   orders line — batch B's prompt is the first — and read the roster at
   `.tanto/roster.md`. A session started after this boundary reads the new text
   and finds the state where the text says.

If a Kanri handover falls due at this boundary it proceeds — rule 11's "no
replacement before the boundary" is met, this being the boundary — and the
handover file goes to `.tanto/kanri-handover.md`, which the successor's new
role text names. The step has no rollback: a plan that stops between batch A
and its close leaves `.tanto/` in place, and the skill's loaded files already
agree with it.

### The `O` needles this plan carries, and the seven it does not

The spec's "Old values this plan contradicts" table (spec lines 780-818) has
twenty-one rows and **twenty-seven needles** — five rows carry more than one
spelling of the same entity. Every one of the twenty-seven is checked. They are
checked three ways, not one:

| How | How many | Which |
| --- | --- | --- |
| an `O` block, swept by the instrument | 20 | task 6's block list |
| named in Verification 5, counted against an allowlist | 5 | `.superpowers/sdd`, `plan-basename`, `docs/superpowers/specs/<`, `docs/superpowers/plans/<`, `spec-phase record` |
| the absence greps of task 6 Step 3 | 2 | `superpowers/sdd/.gitignore`, `path under docs/superpowers` |

The five in the second row survive the plan **inside the plan's own new
passages** — the SDD ledger's path in S6, K7, K15 and four templates; the two
default spec and plan locations, now preceded by "by default"; the sentence K5
keeps. `passage-check.js lint` refuses a needle that occurs in the plan's own
new-passage text (`needle-in-new-text`), and it is right to: for a needle whose
disposition is "gone", finding it in the new text means the plan reintroduces
what it claims to remove. A survivor needle is a different question — *how
many* and *where*, not *whether* — and it is answered by a counted sweep
against an allowlist, which is what Verification items 3, 4 and 5 are. Writing
those five as `O` blocks would make `lint` permanently red on five known
findings, and a check that is always red stops being read.

The two in the third row are substrings of two of the five — `.superpowers/sdd`
and `docs/superpowers/` — so they would run into the same rule for no added
coverage. Their disposition is "gone", and task 6 Step 3 greps for them by name
and expects no output, which is the strongest form the check has.

**The third option, named because it is the better one and is out of scope
here.** The instrument could learn a *survivor* form for an `O` block — a
declared expected count instead of the implied zero — and then all
twenty-seven needles would be machine-compared rather than five of them ruled
in prose by a human reading `replay`'s `DIFFERS` lines. That is a change to
`skills/tanto/scripts/passage-check.js`, which no task of this plan touches
(the spec's Out of scope names the script explicitly), so it is not taken here
and goes to Kanri as a shoroku candidate instead.

This is the first of three deliberate deviations from the spec's literal
instruction; the Self-Review lists all three in one place.

### The workspace

**No worktree.** All roles share the working tree and the branch
`tanto-workspace`, cut from `main` at the kisou-refresh T2 head. Kanri verifies
the tree in place and the human can watch it. The merge decision is the
human's.

---

## Batches

Two batches, six tasks.

| Batch | Tasks | Delivers | Stop conditions at the boundary |
| --- | --- | --- | --- |
| A | 1 `SKILL.md`; 2 `roles/kanri.md`; 3 `roles/sekkei.md`, `roles/kaiseki.md`, `roles/jisso.md`; 4 the nine templates | every file a session loads, agreeing with itself on where tanto's state lives | **the replacement boundary opens here**; `passage-check.js diff` clean; Verification 1, 2, 3, 5, 6, 7, 9 and 10 in full, and 4 for the `O` needles batch A's own passages close; then Kanri's transition directive above, and Verification 8 after it |
| B | 5 `README.md` and `docs/notes/tanto-consistency-checks.md`; 6 the whole-tree sweep and the `O` needles | the two files read by people and by verification, and the proof | `passage-check.js diff` clean; every `O` needle at its stated disposition with the hits printed; Verification 3, 4 and 5 at their batch B values; Verification 8 unchanged from batch A |

**No planned replacement.** Neither batch expects one. Batch A is the heavier
of the two and runs on one Jisso; the Jisso of this plan reads
`roles/jisso.md` as it stands at the plan's landing — the old text, whose four
passages are J1 and J2's three "in the workspace" sentences — and takes every
path from the batch prompt, never from the role text.

**Batch A's internal order is free.** Its four tasks touch four disjoint file
sets and no task consumes another's output. Batch B's is not: task 6 sweeps the
tree task 5 finishes, so 5 runs before 6.

**Batch B has two tasks, not the three or four `roles/sekkei.md` asks for.**
The cut is the spec's, section 6, and the spec's cut takes precedence over the
role file's sizing guidance: batch B is "the README, the consistency note, and
the whole-tree absence sweep with its recorded output", which is two tasks
because the README and the note are one commit and the sweep writes nothing.
Splitting either would make a task out of a single passage or a single grep.

One task is called out because its size is the data issue-7281 asks for, not
because anything is wrong with it.

- **Task 6 is a sweep-and-check shape** — its deliverable is recorded output,
  not a file; it modifies nothing, and "it changed a tracked file" is its
  failure condition. Its dispatch tells the reviewer to **re-run** the
  commands rather than read the report, because the output is the deliverable.
  The context-cost run measured that shape at 1.93× the median implementer and
  1.39× the median reviewer; expect it to cost more than its line count
  suggests.

---

## How a batch is verified

Named by name. Every command runs in Git Bash from the repository root, and the
implementer records its output before and after — the output is the evidence
subagent-driven development asks for. The numbering follows the spec's
Verification section, items 1 to 8, with two additions the repository's own
rules require (9 and 10). One item sits differently: the spec's item 5, the
`There are eleven` guard, is inside item 5 here, beside the other survivor
needles it belongs with.

1. **The boundary check.** Both options are required, and the base is the one
   derived in Global Constraints, never the merge base:

   ```bash
   TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" diff --plan docs/superpowers/plans/2026-09-12-tanto-workspace.md --base "$(git log --format=%H --reverse main..HEAD -- skills/tanto | head -1)^"
   ```

   Expected: `diff: clean`, or only lines attributable to a `docs: exit
   shoroku` / `docs: T<n> shoroku` commit under `docs/` outside this plan's two
   paths, per Global Constraints.

2. **Lint**, on every changed path, each named individually:
   `./scripts/lint.sh <path> [<path> ...]`. Expected: exit 0, none `Failed`.
   For the nine template paths the hooks that decide the step are trailing
   whitespace, end-of-file and mixed line ending — `.markdownlint-cli2.yaml`
   ignores `skills/**/templates/**`, so markdownlint does not see them. For
   `SKILL.md`, the four role files, `README.md` and the note, markdownlint
   runs.

3. **The absence sweep, scoped to the skill and the note.** The lines are
   printed, not counted, and each printed line is placed against the allowlist
   of the spec's section 3; a line not on it is a defect.

   ```bash
   grep -rn '\.superpowers/sdd' skills/tanto docs/notes/tanto-consistency-checks.md | grep -v 'sdd/<plan-basename>/'
   grep -rn 'plan-basename' skills/tanto docs/notes/tanto-consistency-checks.md | grep -v 'sdd/<plan-basename>/'
   ```

   After batch A the first prints exactly **three** lines — S6's sentence in
   `SKILL.md`, the README's superpowers bullet, and the note's "Two traps"
   sentence, the last two in their old spelling until batch B rewrites them as
   R1 and N1, which keep the spelling, so the count is three at both
   boundaries — and the second prints exactly **one**, the note's own prose
   about the SDD workspace. The counted form, which is what a machine compares:

   ```bash
   grep -rn '\.superpowers/sdd' skills/tanto docs/notes/tanto-consistency-checks.md | grep -vc 'sdd/<plan-basename>/'
   ```

   Expected: 3

   ```bash
   grep -rn 'plan-basename' skills/tanto docs/notes/tanto-consistency-checks.md | grep -vc 'sdd/<plan-basename>/'
   ```

   Expected: 1

4. **The entity needles**, task 6's `O` blocks, each as `grep -rcF` over
   `skills/tanto` and the note, compared with the disposition the block states.
   At the batch B boundary this is task 6's whole deliverable; at batch A's it
   is read for the ones batch A's own passages close.

5. **The survivor needles**, the five the plan carries by name rather than as
   `O` blocks:

   ```bash
   grep -rcF '.superpowers/sdd' skills/tanto docs/notes/tanto-consistency-checks.md | grep -v ':0$'
   grep -rcF 'plan-basename' skills/tanto docs/notes/tanto-consistency-checks.md | grep -v ':0$'
   grep -rcF 'docs/superpowers/specs/<' skills/tanto | grep -v ':0$'
   grep -rcF 'docs/superpowers/plans/<' skills/tanto | grep -v ':0$'
   grep -rcF 'spec-phase record' skills/tanto | grep -v ':0$'
   grep -c 'There are eleven' skills/tanto/SKILL.md
   ```

   Expected after the plan: `.superpowers/sdd` on `SKILL.md` 3,
   `roles/kanri.md` 2, `templates/batch-prompt.md` 1,
   `templates/batch-report.md` 1, `templates/kaiseki-brief.md` 1,
   `templates/kanri.md` 1, `README.md` 1 and the note 1, and **nowhere else**
   — `roles/sekkei.md`, `roles/kaiseki.md`, `roles/jisso.md` and the other six
   templates read 0. `plan-basename` on the same files except `SKILL.md` 2 and
   `README.md` 0. The two `docs/superpowers/…/<` needles on `SKILL.md` 1 and
   `roles/sekkei.md` 1 each, every one now preceded by "by default".
   `spec-phase record` on `roles/kanri.md` 1 and `SKILL.md` 0. `There are
   eleven` on `SKILL.md` 1 — the guard that no template was added or removed.
   Before the plan, measured 2026-09-12: `.superpowers/sdd` 31/1/24/8/0/4 over
   `SKILL.md`, `README.md`, `roles/kanri.md`, `roles/sekkei.md`,
   `roles/jisso.md`, `roles/kaiseki.md` and 23 over the nine templates, 1 over
   the note; `plan-basename` 16/0/9/0/0/1, 13 over the templates, 1 over the
   note.

6. **The instrument's own tests**, which this plan does not touch, still pass:

   ```bash
   node --test skills/tanto/scripts/
   ```

   Expected: every test passes. `mise x node@22 -- node --test skills/tanto/scripts/`
   is the pinned-floor form; record the version it resolved beside the result.

7. **Three of the consistency note's own checks**, which this plan schedules
   by naming them here. Check 5 because `roles/jisso.md` is touched; checks 6
   and 7 **whole**, because the note's governing sentence says a plan that
   schedules only a subset of its checks must still schedule the absence
   checks, an absence check being the one kind a new passage breaks by adding
   text rather than by omitting it.

   **Check 5**, the two pinned quotes, five lines, `1` on every one:

   ```bash
   SP="$HOME/.claude/plugins/cache/claude-plugins-official/superpowers/6.3.0/skills" && grep -cF 'that norms say you ask about first (a merge, a push to a shared branch, a' "$SP/subagent-driven-development/SKILL.md" skills/tanto/roles/jisso.md skills/tanto/SKILL.md && grep -cF 'Implementer subagents report one of four statuses. Handle each appropriately:' "$SP/subagent-driven-development/SKILL.md" skills/tanto/roles/jisso.md
   ```

   **Checks 6 and 7** are run out of the note itself rather than from a copy,
   so that the command list cannot drift from the note; task 6 Steps 8 and 9
   carry the two extraction commands, their expected values, and the
   measurement that says this plan changes neither. Kanri runs the same two at
   every boundary.

8. **After batch A's boundary only**, once Kanri's transition directive has
   run:

   ```bash
   ls -a .tanto/ && git status --short .tanto/ && ls .superpowers/sdd/roster.md
   ```

   Expected: `.tanto/` holds `.gitignore`, `.markdownlint-cli2.yaml`,
   `roster.md`, `roster-archive.md`, `inbox/`, the `exit-kanri-*-proposal.md`
   files and `tanto-workspace/`; `git status --short` prints nothing for it;
   and `ls .superpowers/sdd/roster.md` reports no such file. This is a check on
   Kanri's own step, not on a task's commit, and it is read at the batch B
   boundary too, unchanged.

9. **Line endings**, on every path the batch touched:

   ```bash
   git ls-files --eol skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/templates/*.md docs/notes/tanto-consistency-checks.md
   ```

   Expected: `i/lf w/crlf attr/text=auto` on every one, and never `w/mixed`.

10. **The trailer**, per commit, in a loop over the batch's commits, grepping
    the prefix `Co-Authored-By: Claude`.

A stop condition worded as a property of the whole tree is backed by a command
that sweeps the whole tree, not only the files the batch wrote. Checks 3, 4, 5,
7 and 9 are those.

---

## The boundary from which a role may be started or replaced

**Batch A's boundary**, and the plan says so here and in the Batches table
above because contract rule 11 requires the plan to name it.

Batch A lands every file a session **loads**: `SKILL.md`, the four role files,
and the eleven templates. `skills/tanto/README.md` and
`docs/notes/tanto-consistency-checks.md` are read by people and by a plan's
verification commands and are never loaded by a session, so a session started
at batch A's boundary reads a skill that agrees with itself and finds the state
where the text says it is — which is why Kanri's transition directive runs at
that same boundary, before batch B's prompt. A permitted boundary at which the
state the new text names does not yet exist would be nominal.

Before that boundary **no role is created and none replaced**, with the two
exceptions the contract names: Kanri's own handover proceeds when it is due,
and its successor takes the authority ruling above from the handover file
rather than from the tree; and a Kaiseki needed before the boundary is a Kanri
ruling, recorded as `R-n`, made with the half-edited skill in view.

Distinguish this from where a replacement is *expected*: the Batches table says
none is, at either boundary.

**This is a narrowing of decision-5c8e, knowingly made.** That ADR's Decision
defines the boundary as "the first boundary at which every file the plan
touches agrees with every other", under which batch A's boundary — the README
and the note still carrying the old wording — is not legal. The reading this
plan records is that "every file the plan touches" is met when **every file a
session loads** agrees, because the README and a note cannot leave a session
half-instructed. `docs/decisions/AGENTS.md` leaves two legal moves for a
narrowing: a new ADR with `amends: [5c8e]` and the matching `amended_by` on
5c8e, or a sentence in design-4807 with no ADR change, on the precedent
design-4807 already records for rule 11's creation clause. The human chose the
second at the spec review of 2026-09-11: T1 writes the sentence in design-4807,
decision-5c8e is not amended, and the reading stands in the spec and here.

**The boundary is swept, not asserted.** The sweep is task 6's step 1: grep
this plan's own new-passage blocks for every term batch B lands, and confirm
that no batch A passage forward-references anything batch B writes. The result
is recorded there, in the dry-run report, and in the batch A report.

---

## What an executor needs cold

You are dispatched into one task and see only it. This section is what the task
assumes and does not repeat.

**What you are editing.** `skills/tanto/` is an Agent Skill written in
Markdown that orchestrates a multi-session run: `SKILL.md` is the contract
every session reads, `roles/kanri.md`, `roles/sekkei.md`, `roles/jisso.md` and
`roles/kaiseki.md` are the four role procedures, `templates/` holds the
copy-and-fill skeletons, `README.md` describes the skill to a human, and
`scripts/passage-check.js` is the instrument this plan is checked with.
`docs/notes/tanto-consistency-checks.md` is the repository note that governs
how a plan editing that skill verifies itself. Nothing you touch is executed by
a runtime.

**What the change is, in one sentence.** Every path at which `tanto` keeps its
own state moves from `.superpowers/sdd/…` to `.tanto/…`, with one directory per
topic (`.tanto/<topic>/`) replacing today's two (`<topic>/` before the plan
lands and `<plan-basename>/` after), and the one path that stays is the SDD
skill's own ledger, `.superpowers/sdd/<plan-basename>/progress.md`.

**The shell.** Every fenced command block in this plan runs in **Git Bash**,
not PowerShell, even though PowerShell is this host's primary shell. Where a
step names `./scripts/lint.sh`, `scripts\lint.bat` with the same arguments is
the Windows equivalent.

**How a passage edit is made.** A replacement block gives you the old passage
and the new passage. Locate the old passage in the named file — it occurs
exactly once unless the lead line says otherwise — and replace exactly those
lines with exactly the new block's lines. Change no other byte: no re-wrapping,
no trailing-whitespace tidy, no heading renames, nothing outside the block. An
insertion block's old block is an **anchor that stays**: the new block is the
text to add, and it is added after (or before, when the lead says so) the
anchor lines, which are not repeated in the new block. Anchor lines are never
deleted.

**Line endings.** The working tree is CRLF and the index is LF for every path
this plan touches. Write each passage with the target file's own ending, and
use an edit tool that rewrites only the lines you name rather than one that
rewrites the whole file. `git ls-files --eol` is the command that settles any
line-ending question; a grep for a control character is not. `w/mixed` on any
path is a failure.

**The block grammar this plan is written in.** Every block has an id of the
form `<kind><task>.<n>` — kind `P` for a passage, `A` for an anchor step, `O`
for an old value; `<task>` is the task number that carries it and `<n>` its
ordinal inside that task. A replacement leads with
``**P<id>** `<path>` — replace exactly these <N> lines``, then the old block,
then `**P<id> →**`, then the new block. An insertion leads with
`insert after these <N> lines` or `insert before these <N> lines`. Wherever a
count in a lead is 1 the lead reads the singular — `this 1 line`. An anchor
step leads with
``**A<id>** `<path>` — `<command>` — before: <v>, after: <v>``, both values
always stated, because an anchor check inverts only when the new passage wholly
supersedes the needle. An old value the plan contradicts leads with
``**O<id>** `<needle>` — <where it must be gone, or why it may stay>``.

**Each block appears once.** A task that needs a block another task carries
cites it by id and does not re-quote it. Where you see an id such as `P4.7`
with no block beneath it, the block is in the task whose number the id names.

**Every Verify step is one invocation of the instrument**, and it is the last
step of the task, after the lint and the commit:

```text
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-workspace.md --task <N>
```

Do not substitute hand-written greps for it. The needles, the anchor values and
the line counts are all determined by the blocks; writing them out again only
creates something that can drift from them (issue-f813).

**Lint runs before Verify, not after.** markdownlint runs with `--fix`, and a
fix that rewrote a line inside a passage would leave `verify` reading text the
plan does not contain. If it fixes anything, re-author the block it touched
rather than leaving the file and the plan disagreeing. (`MD013` is `false` in
this repository, so line length is not what would trigger it.)

**markdownlint coverage is uneven, and that is configuration, not an accident.**
`.markdownlint-cli2.yaml` ignores `docs/superpowers/**` and
`skills/**/templates/**`. So for the nine template paths the hooks that decide
a lint step are trailing whitespace, end-of-file and mixed line ending, not
markdownlint; for `SKILL.md`, the four role files, `README.md` and the note,
markdownlint runs.

**Repository rules that bind every task.** Commit by explicit path with
`git commit --only <paths>`. This plan creates no file, so no `git add` is
needed anywhere in it. Never `git add -A`, `.`, or `-u`, never a bare
`git commit` or `git commit -a`, and never `--no-verify`. End every commit
message with a `Co-Authored-By:` trailer naming the AI agent. American English
throughout. Do not edit `.gitignore`, `.markdownlint-cli2.yaml`,
`.pre-commit-config.yaml`, `CONTRIBUTING.md`, `.gitattributes`, `.editorconfig`,
or any other linter, formatter, or contributor-prerequisite configuration —
those are out of scope and need explicit human approval.

**Two strings that must not appear in what you write.** Runtime text in this
skill is skill-relative, so no new line under `skills/tanto/SKILL.md`,
`skills/tanto/roles/` or `skills/tanto/templates/` may contain the literal
`skills/tanto/` — only the skill's own `README.md` and the consistency note may
name it (the note's check 7). And no new passage may reintroduce
`.superpowers/sdd` except where the block you are given already carries it; the
plan's sweep is computed from the new texts, and a stray one falsifies it.

**The base** referred to throughout is the one Global Constraints derives, the
parent of task 1's first commit — **not** `$(git merge-base main HEAD)`.

---

## File structure

Sixteen files are modified and none is created.

- Modify: `skills/tanto/SKILL.md` — the contract: the roster's path, the
  compaction file, the bug-report paragraph, the exit file pattern, the
  Artifacts table whole, the topic-directory paragraph, rule 5, the Workspace
  paragraph, and the review-brief bullet (task 1).
- Modify: `skills/tanto/roles/kanri.md` — Kanri's procedure: the start
  sequence's two files, the topic-opening checks, the plan-landing step, the
  intake and the two bug-report paragraphs, the handover, the exits, and the
  session-lifecycle paragraph (task 2).
- Modify: `skills/tanto/roles/sekkei.md` — where Sekkei's files go, its five
  working-note paths, and its write-and-commit rule (task 3).
- Modify: `skills/tanto/roles/kaiseki.md` — the standalone paragraph and the
  exit proposal path (task 3).
- Modify: `skills/tanto/roles/jisso.md` — the workspace row of "What tanto
  overrides" and the three "in the workspace" sentences (task 3). This file
  carries **no** path spelling today, which is why its passages are found by
  the entity and not by a grep for `.superpowers`.
- Modify: the nine templates that carry a path —
  `templates/kanri.md`, `templates/roster.md`, `templates/roster-archive.md`,
  `templates/kanri-handover.md`, `templates/batch-prompt.md`,
  `templates/batch-report.md`, `templates/kaiseki-brief.md`,
  `templates/review-brief.md`, `templates/bug-report.md` (task 4).
  `templates/kaiseki-report.md` and `templates/tanto.json` carry none and are
  not touched; `SKILL.md`'s "There are eleven:" stays true, and Verification 5
  checks it.
- Modify: `skills/tanto/README.md` — the superpowers bullet in Prerequisites
  (task 5). Per `AGENTS.md` the skill's `README.md` is reviewed for drift after
  `SKILL.md` changes; this passage is that review's result.
- Modify: `docs/notes/tanto-consistency-checks.md` — the second of the "Two
  traps of this host", and the extraction paragraph's last sentence (task 5).

Not touched, and named here because a reader will ask: `skills/tanto/scripts/`
(no path in it changes), the repository's `.gitignore` and
`.markdownlint-cli2.yaml` (the two files that quiet `.tanto/` live inside
`.tanto/`), `docs/design/4807-tanto.md`, `docs/requirements/04f5-tanto.md` and
the ADR of spec input 10 (T1's and T2's, not a task's), and the accepted ADRs
decision-de63 and decision-ace0, whose bodies name the old paths and are
immutable — the paths in them read as-of-then.

---

## Where each change lives

The spec labels its passages by destination file (`S5`, `K13`, `T10`); a spec
has no tasks, so those are not plan ids. This table is where the two are
mapped, once. A spec label that lands as more than one block names more than
one site in the same file, and the block list of the task says which.

| Spec | Plan blocks | File | Task | Batch |
| --- | --- | --- | --- | --- |
| S1 | P1.1, P1.2, P1.3 | `skills/tanto/SKILL.md` | 1 | A |
| S2 | P1.4 | `skills/tanto/SKILL.md` | 1 | A |
| S9 | P1.5 | `skills/tanto/SKILL.md` | 1 | A |
| S3 | P1.6 | `skills/tanto/SKILL.md` | 1 | A |
| S4 | P1.7 | `skills/tanto/SKILL.md` | 1 | A |
| S5 | P1.8 | `skills/tanto/SKILL.md` | 1 | A |
| S6 | P1.9 | `skills/tanto/SKILL.md` | 1 | A |
| S7 | P1.10 | `skills/tanto/SKILL.md` | 1 | A |
| S8 | P1.11 | `skills/tanto/SKILL.md` | 1 | A |
| K1 | P2.1 | `skills/tanto/roles/kanri.md` | 2 | A |
| K2 | P2.2 | `skills/tanto/roles/kanri.md` | 2 | A |
| K3 | P2.3 | `skills/tanto/roles/kanri.md` | 2 | A |
| K4 | P2.4 | `skills/tanto/roles/kanri.md` | 2 | A |
| K5 | P2.5 | `skills/tanto/roles/kanri.md` | 2 | A |
| K6 | P2.6 | `skills/tanto/roles/kanri.md` | 2 | A |
| K7 | P2.7 | `skills/tanto/roles/kanri.md` | 2 | A |
| K8 | P2.8 to P2.15 | `skills/tanto/roles/kanri.md` | 2 | A |
| K9 | P2.16, P2.17 | `skills/tanto/roles/kanri.md` | 2 | A |
| K10 | P2.18 | `skills/tanto/roles/kanri.md` | 2 | A |
| K11 | P2.19 | `skills/tanto/roles/kanri.md` | 2 | A |
| K12 | P2.20 | `skills/tanto/roles/kanri.md` | 2 | A |
| K13 | P2.21 | `skills/tanto/roles/kanri.md` | 2 | A |
| K14 | P2.22 | `skills/tanto/roles/kanri.md` | 2 | A |
| K15 | P2.23 | `skills/tanto/roles/kanri.md` | 2 | A |
| E1 | P3.1 | `skills/tanto/roles/sekkei.md` | 3 | A |
| E2 | P3.2 to P3.6 | `skills/tanto/roles/sekkei.md` | 3 | A |
| E3 | P3.7 | `skills/tanto/roles/sekkei.md` | 3 | A |
| A1 | P3.8 | `skills/tanto/roles/kaiseki.md` | 3 | A |
| A2 | P3.9, P3.10 | `skills/tanto/roles/kaiseki.md` | 3 | A |
| J1 | P3.12 | `skills/tanto/roles/jisso.md` | 3 | A |
| J2 | P3.11, P3.13, P3.14 | `skills/tanto/roles/jisso.md` | 3 | A |
| T1 | P4.1, P4.2 | `skills/tanto/templates/kanri.md` | 4 | A |
| T2 | P4.3, P4.4 | `skills/tanto/templates/kanri.md` | 4 | A |
| T3 | P4.5, P4.6 | `skills/tanto/templates/roster.md` | 4 | A |
| T4 | P4.7 | `skills/tanto/templates/roster-archive.md` | 4 | A |
| T5 | P4.8, P4.9 | `skills/tanto/templates/kanri-handover.md` | 4 | A |
| T6 | P4.10 to P4.13 | `skills/tanto/templates/batch-prompt.md` | 4 | A |
| T7 | P4.14 | `skills/tanto/templates/batch-report.md` | 4 | A |
| T8 | P4.15 to P4.17 | `skills/tanto/templates/kaiseki-brief.md` | 4 | A |
| T9 | P4.18 | `skills/tanto/templates/review-brief.md` | 4 | A |
| T10 | P4.19, P4.20 | `skills/tanto/templates/bug-report.md` | 4 | A |
| R1 | P5.1 | `skills/tanto/README.md` | 5 | B |
| N1 | P5.2 | `docs/notes/tanto-consistency-checks.md` | 5 | B |
| N2 | P5.3 | `docs/notes/tanto-consistency-checks.md` | 5 | B |
| the "Old values" table | O6.1 to O6.20 | the sweep set | 6 | B |

Two spec labels land as more blocks than the spec's own count of sites, and
both are recorded here rather than reconciled away:

- **K8** names seven sites and lands as **eight** blocks, because "the T2
  split, steps 1 and 2" is one named site and two non-contiguous list items.
- **J2** names three sentences and lands as three blocks, but they are not
  contiguous with **J1**, so `roles/jisso.md`'s four blocks interleave:
  P3.11 (J2, the batch-report sentence), P3.12 (J1, the SDD Finish row),
  P3.13 and P3.14 (J2's other two). The ordinals are file order, which is what
  an implementer reads top to bottom.

The anchors, one per file, are `A1.1`, `A2.1`, `A3.1` to `A3.3`, `A4.1` to
`A4.9`, and `A5.1`, `A5.2` — sixteen files with a passage, sixteen anchors.

---

## Task 1: The contract file — `skills/tanto/SKILL.md`

**Batch:** A. **Blocks:** A1.1, P1.1, P1.2, P1.3, P1.4, P1.5, P1.6, P1.7, P1.8,
P1.9, P1.10, P1.11.

`SKILL.md` is the file every tanto session loads first, so it is the file that
has to agree with the new layout before any role reads it. This task carries
the spec's section 4.1 whole — S1 (the handshake paragraph, the roster
paragraph, and the third precedence of "The address"), S2 (the compaction
path), S9 (the review-brief bullet under Messages), S3 (the bug-report
paragraph, replaced whole so that the intake's address is read from the target
workspace's roster), S4 (the exit file-pattern sentence), S5 (the Artifacts
table, replaced whole), S6 (the paragraph that today describes the ledger
move), S7 (rule 5's two clauses), and S8 (the Workspace section's last
paragraph) — plus every mechanical substitution section 3's path map makes in
this file. The eleven passages together account for all thirty-one lines
carrying `.superpowers` and all sixteen carrying `plan-basename` measured on
2026-09-12.

**The survivors.** Three lines keep `.superpowers` on purpose and no others:
the Artifacts table's SDD-ledger row
(`.superpowers/sdd/<plan-basename>/progress.md`, inside P1.8), the S6 sentence
"The SDD ledger is the one artifact tanto reads under `.superpowers/sdd/`"
(inside P1.9), and the S8 sentence naming the SDD workspace
`.superpowers/sdd/<plan-basename>/` (inside P1.11). Two of those three also
keep `plan-basename` — the Artifacts row and S8; S6 names the ledger in prose
and carries no `<plan-basename>`. Every other occurrence in the file is
replaced by one of the eleven blocks. The spellings the map reaches that are
not literal `.superpowers` hits are covered too: "next to the roster" in the
exit paragraph (P1.7), "or the topic directory for Sekkei" in the compaction
paragraph (P1.4) and in the three exit and compaction rows of the table
(P1.8), "No `<plan-basename>` exists before the plan is committed" and the
ledger move (P1.9), and the spec and plan default paths, which become "at the
path the orders line names — by default …" in the table's first two rows
(P1.8) and "the spec and plan directory the orders line names" in rule 5
(P1.10). `SKILL.md` carries no `<path under docs/superpowers/…>` template
placeholder; those live in the templates.

**Files:**

- Modify: `skills/tanto/SKILL.md` — eleven passages: three one-line
  substitutions for S1, one re-wrapped paragraph each for S2, S4, S6, S7 and
  S8, one one-line substitution for S9, the bug-report paragraph replaced
  whole for S3, and the Artifacts table replaced whole for S5.

**Interfaces:**

- Consumes: nothing — this task is first in its batch and depends on no
  other.
- Produces, for task 6: the `SKILL.md` side of the sweep — after this task
  `.superpowers/sdd` survives in `SKILL.md` on exactly three lines and
  `plan-basename` on exactly two.
- markdownlint lints `skills/tanto/SKILL.md`; it is not under an ignored path.

### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/SKILL.md
```

Expected: `i/lf w/crlf attr/text=auto`, and never `w/mixed`. Write every
passage with CRLF.

- [ ] **Step 2: The handshake paragraph's roster path (S1)**

**A1.1** `skills/tanto/SKILL.md` — `grep -cF 'since a resumed Kanri carries a new name' skills/tanto/SKILL.md` — before: 0, after: 1

**P1.1** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
data row of `.superpowers/sdd/roster.md`, which is Kanri's own row, for it.
```

**P1.1 →**

```text
data row of `.tanto/roster.md`, which is Kanri's own row, for it.
```

- [ ] **Step 3: The roster paragraph (S1)**

**P1.2** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
The roster lives at `.superpowers/sdd/roster.md`, is written only by Kanri from
```

**P1.2 →**

```text
The roster lives at `.tanto/roster.md`, is written only by Kanri from
```

- [ ] **Step 4: The third precedence under "The address" (S1)**

The line is a list item's continuation; its two-space indent is part of the
block.

**P1.3** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
  first data row of `.superpowers/sdd/roster.md`.
```

**P1.3 →**

```text
  first data row of `.tanto/roster.md`.
```

- [ ] **Step 5: The compaction file's path and parenthesis (S2)**

The path shortens and the parenthesis loses its first clause, so the paragraph
is re-wrapped from the replaced line onward; four lines become three. The
sentence that follows, on the two sessions with no Kanri, is untouched.

**P1.4** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```text
`.superpowers/sdd/<plan-basename>/compaction-<role>-<n>.md` (the topic
directory for Sekkei; `<n>` one more than the highest such file for that
role, so that a second compaction or a replaced session does not overwrite
the first), names the file in its next line to Kanri as
```

**P1.4 →**

```text
`.tanto/<topic>/compaction-<role>-<n>.md` (`<n>` one more than the highest
such file for that role, so that a second compaction or a replaced session
does not overwrite the first), names the file in its next line to Kanri as
```

- [ ] **Step 6: The review-brief bullet under Messages (S9)**

**P1.5** `skills/tanto/SKILL.md` — replace exactly this 1 line

```text
  `.superpowers/sdd/<topic>/review-brief-spec.md` or `review-brief-plan.md`
```

**P1.5 →**

```text
  `.tanto/<topic>/review-brief-spec.md` or `review-brief-plan.md`
```

- [ ] **Step 7: The bug-report paragraph (S3)**

Replaced whole: the intake's address is now read from the target workspace's
roster, with the `ListAgents` check and the two fallbacks to the human.

**P1.6** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```text
A defect noticed in a skill goes to the Kanri of the repository that ships that
skill, as a **bug report**: a file written from `templates/bug-report.md` and
one line, `bug-report: <absolute path>`. Kanri is the intake, and the human
supplies the intake's address. A defect that surfaces in a spec dialogue
reaches Kanri as an `I-n` in `spec-inputs.md`, not as a bug report.
```

**P1.6 →**

```text
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
```

- [ ] **Step 8: The exit file-pattern paragraph (S4)**

One sentence changes; the paragraph is re-wrapped around it because the new
sentence is shorter, and five lines become four.

**P1.7** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```text
conductor ledger's Stage values mirror it. The files live where the role's
other files live: Jisso's and
an attached Kaiseki's under `.superpowers/sdd/<plan-basename>/`, Sekkei's under
`.superpowers/sdd/<topic>/`, Kanri's own next to the roster. Kanri's exit has a
proposal file but no direction file, because it rules on itself.
```

**P1.7 →**

```text
conductor ledger's Stage values mirror it. The files live in the topic
directory, `.tanto/<topic>/`, for Jisso, Sekkei, and an attached Kaiseki, and
next to the roster, at `.tanto/`, for Kanri. Kanri's exit has a proposal file
but no direction file, because it rules on itself.
```

- [ ] **Step 9: The Artifacts table (S5)**

The whole table — header row, separator row, and every data row — is replaced.
Twenty-three rows become twenty-four: the spec and the plan are named by the
orders line with the superpowers path as the default, the standalone Kaiseki's
report gets a row of its own, the two self-contained files replace the SDD
`.gitignore` row, and the SDD-ledger row is the one row that keeps
`.superpowers/sdd`. Every row stays on one line however long. The sentence
after the table, "Templates are copied and filled … There are eleven: …", is
not part of the block and does not change.

**P1.8** `skills/tanto/SKILL.md` — replace exactly these 25 lines

```text
| Path | Writer | Readers | Content |
| --- | --- | --- | --- |
| `docs/superpowers/specs/<date>-<topic>-design.md` | Sekkei | Kanri, Jisso | the spec; committed |
| `docs/superpowers/plans/<date>-<topic>.md` | Sekkei | Kanri, Jisso | the plan; committed; carries Global Constraints, a Batches section, and how a batch is verified |
| `.superpowers/sdd/roster.md` | Kanri | all roles | one row per role |
| `.superpowers/sdd/roster-archive.md` | Kanri | Kanri | from `templates/roster-archive.md`; the roster's dead, replaced, and refused rows with their last readings, and the closed plans' Events lines, appended at each plan close |
| `.superpowers/sdd/kanri-handover.md` | the outgoing Kanri | the successor Kanri | the handover; deleted by the successor once accepted |
| `.superpowers/sdd/inbox/<date>-<slug>.md` | Kanri | Kanri | a bug report received, with its Triage section |
| `.superpowers/sdd/<topic>/kanri.md`, then `.superpowers/sdd/<plan-basename>/kanri.md` | Kanri | Sekkei, Jisso, Kaiseki | the conductor ledger |
| `.superpowers/sdd/<topic>/spec-inputs.md` (optional) | Kanri | Sekkei | scope inputs the human gave Kanri during spec work, numbered `I-n`, each with Kanri's advisory notes |
| `.superpowers/sdd/<topic>/dialogue.md` | Sekkei | Kanri, the brief writer, T1 | the spec dialogue: each question Sekkei put and the human's answer, verbatim, in order |
| `.superpowers/sdd/<topic>/review-brief-spec.md`, `.superpowers/sdd/<topic>/review-brief-plan.md` | the brief writer Kanri dispatches | Kanri, then the human through Sekkei | the review brief, from `templates/review-brief.md`, in the chat's language |
| `.superpowers/sdd/<topic>/plan-dryrun.md` | Sekkei | the plan reviewer, Kanri | from `lint` and `replay` — the two commands, each one's output, and Sekkei's ruling on every failure |
| `.superpowers/sdd/<plan-basename>/batch-<X>-prompt.md` | Kanri | Jisso, human | the same text as the `SendMessage`, so the human can paste it if the message did not arrive |
| `.superpowers/sdd/<plan-basename>/batch-<X>-report.md` | Jisso | Kanri | fixed skeleton |
| `.superpowers/sdd/<plan-basename>/kaiseki-<n>-brief.md` | Kanri | Kaiseki | fixed skeleton |
| `.superpowers/sdd/<plan-basename>/kaiseki-<n>.md` | Kaiseki | Kanri, Jisso | fixed skeleton |
| `.superpowers/sdd/<plan-basename>/shoroku-proposal.md` | Jisso | Kanri | the T2 proposal, written to a file instead of printed |
| `.superpowers/sdd/<plan-basename>/shoroku-direction.md` | Kanri | Jisso | Kanri's answer to that proposal, item by item |
| `.superpowers/sdd/<plan-basename>/exit-<role>[-<suffix>]-proposal.md`, or the topic directory for Sekkei, or `.superpowers/sdd/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | the exiting session | Kanri | the exit shoroku proposal |
| `.superpowers/sdd/<plan-basename>/exit-<role>[-<suffix>]-direction.md`, or the topic directory for Sekkei | Kanri | the exiting session | Kanri's answer, item by item |
| `.superpowers/sdd/<plan-basename>/compaction-<role>-<n>.md`, or the topic directory for Sekkei | the compacted session | Kanri, or the human for Kanri itself and a standalone Kaiseki | every item a compaction summary attributes to the human, one per line, rewritten with the human's answers |
| `.superpowers/sdd/<plan-basename>/progress.md` | Jisso, through the SDD skill | Kanri | the SDD ledger; Kanri reads it and never writes it |
| `.superpowers/sdd/.gitignore` holding `*` | the SDD skill's `sdd-workspace` script, or Kanri at start when it runs first | git | keeps everything above untracked, so nothing is ever staged |
| `$CLAUDE_CONFIG_DIR/tanto.json` | the user | every role at start, Kanri at each handshake | the personal expected-model config |
```

**P1.8 →**

```text
| Path | Writer | Readers | Content |
| --- | --- | --- | --- |
| the spec, at the path the orders line names — by default `docs/superpowers/specs/<date>-<topic>-design.md` | Sekkei | Kanri, Jisso | the spec; committed |
| the plan, at the path the orders line names — by default `docs/superpowers/plans/<date>-<topic>.md` | Sekkei | Kanri, Jisso | the plan; committed; carries Global Constraints, a Batches section, and how a batch is verified |
| `.tanto/roster.md` | Kanri | all roles; a bug-report sender, its first data row | one row per role |
| `.tanto/roster-archive.md` | Kanri | Kanri | from `templates/roster-archive.md`; the roster's dead, replaced, and refused rows with their last readings, and the closed plans' Events lines, appended at each plan close |
| `.tanto/kanri-handover.md` | the outgoing Kanri | the successor Kanri | the handover; deleted by the successor once accepted |
| `.tanto/inbox/<date>-<slug>.md` | Kanri | Kanri | a bug report received, with its Triage section |
| `.tanto/<topic>/kanri.md` | Kanri | Sekkei, Jisso, Kaiseki | the conductor ledger; it never moves |
| `.tanto/<topic>/spec-inputs.md` (optional) | Kanri | Sekkei | scope inputs the human gave Kanri during spec work, numbered `I-n`, each with Kanri's advisory notes |
| `.tanto/<topic>/dialogue.md` | Sekkei | Kanri, the brief writer, T1 | the spec dialogue: each question Sekkei put and the human's answer, verbatim, in order |
| `.tanto/<topic>/review-brief-spec.md`, `.tanto/<topic>/review-brief-plan.md` | the brief writer Kanri dispatches | Kanri, then the human through Sekkei | the review brief, from `templates/review-brief.md`, in the chat's language |
| `.tanto/<topic>/plan-dryrun.md` | Sekkei | the plan reviewer, Kanri | from `lint` and `replay` — the two commands, each one's output, and Sekkei's ruling on every failure |
| `.tanto/<topic>/batch-<X>-prompt.md` | Kanri | Jisso, human | the same text as the `SendMessage`, so the human can paste it if the message did not arrive |
| `.tanto/<topic>/batch-<X>-report.md` | Jisso | Kanri | fixed skeleton |
| `.tanto/<topic>/kaiseki-<n>-brief.md` | Kanri | Kaiseki | fixed skeleton |
| `.tanto/<topic>/kaiseki-<n>.md` | Kaiseki | Kanri, Jisso | fixed skeleton |
| `.tanto/<topic>/shoroku-proposal.md` | Jisso | Kanri | the T2 proposal, written to a file instead of printed |
| `.tanto/<topic>/shoroku-direction.md` | Kanri | Jisso | Kanri's answer to that proposal, item by item |
| `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`, or `.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md` | the exiting session | Kanri | the exit shoroku proposal |
| `.tanto/<topic>/exit-<role>[-<suffix>]-direction.md` | Kanri | the exiting session | Kanri's answer, item by item |
| `.tanto/<topic>/compaction-<role>-<n>.md` | the compacted session | Kanri, or the human for Kanri itself and a standalone Kaiseki | every item a compaction summary attributes to the human, one per line, rewritten with the human's answers |
| `.tanto/kaiseki/kaiseki-<n>.md` | a standalone Kaiseki | the human | its report, outside any run |
| `.superpowers/sdd/<plan-basename>/progress.md` | Jisso, through the SDD skill | Kanri | the SDD ledger; Kanri reads it and never writes it; the one artifact tanto reads under `.superpowers/` |
| `.tanto/.gitignore` holding `*`, and `.tanto/.markdownlint-cli2.yaml` holding `config:` / `default: false` | Kanri at start, a standalone Kaiseki, or a bug-report writer — whichever finds them absent first; never overwritten | git; the editor's markdownlint | keeps everything above untracked, so nothing is ever staged, and keeps the editor quiet on files the commit path never lints |
| `$CLAUDE_CONFIG_DIR/tanto.json` | the user | every role at start, Kanri at each handshake | the personal expected-model config |
```

- [ ] **Step 10: The paragraph on where the ledger lives (S6)**

Replaced whole. The ledger move is gone; what stands in its place is the topic
directory's lifetime and the one artifact tanto reads under `.superpowers/sdd/`.

**P1.9** `skills/tanto/SKILL.md` — replace exactly these 4 lines

```text
No `<plan-basename>` exists before the plan is committed, so the conductor
ledger starts under `.superpowers/sdd/<topic>/` and Kanri moves it to
`.superpowers/sdd/<plan-basename>/kanri.md` when the plan lands. Only the
ledger moves; the topic directory stays as the spec-phase record.
```

**P1.9 →**

```text
`.tanto/<topic>/` is created by Kanri when the topic opens — its first file is
the conductor ledger — and holds every per-topic file from then to the plan's
close; nothing in it moves when the plan lands. The SDD ledger is the one
artifact tanto reads under `.superpowers/sdd/`: the SDD skill writes it
there, and the conductor ledger's Plan section and every batch prompt name
its path.
```

- [ ] **Step 11: Rule 5 (S7)**

Two clauses change: what Sekkei may write under, and what "outside
`docs/superpowers/`" refers to. The rule is re-wrapped because the first clause
grows; the last line keeps the single-line form it has today.

**P1.10** `skills/tanto/SKILL.md` — replace exactly these 6 lines

```text
   `docs/` only while Jisso is idle or absent. Sekkei writes only under
   `docs/superpowers/` and `.superpowers/sdd/`, at any time, and, while a batch
   is in flight, commits only at a batch boundary Kanri has verified; while no
   batch is in flight it commits whenever its work is ready. Kaiseki edits only
   to instrument and leaves the tree clean. Neither writes under the `docs/`
   document-management tree outside `docs/superpowers/`, except the accepted subset of its own exit shoroku, at its exit.
```

**P1.10 →**

```text
   `docs/` only while Jisso is idle or absent. Sekkei writes only under the
   spec and plan directory the orders line names — by default
   `docs/superpowers/` — and `.tanto/`, at any time, and, while a batch is in
   flight, commits only at a batch boundary Kanri has verified; while no batch
   is in flight it commits whenever its work is ready. Kaiseki edits only to
   instrument and leaves the tree clean. Neither writes under the `docs/`
   document-management tree outside that directory, except the accepted subset of its own exit shoroku, at its exit.
```

- [ ] **Step 12: The Workspace section's last paragraph (S8)**

Replaced whole: the two survivors of a closed plan are named as the topic
directory and the SDD workspace, and issue-12d3's ruling is restated over them.

**P1.11** `skills/tanto/SKILL.md` — replace exactly these 5 lines

```text
`.superpowers/sdd/<plan-basename>/` outlives the SDD run, and so does the topic
directory beside it. Jisso never deletes either, and nothing asks the human to
delete either: after T2 the two have the same standing — untracked, local to one
machine, useful only for a later re-read — and disk is the only cost
(issue-12d3).
```

**P1.11 →**

```text
`.tanto/<topic>/` outlives the plan, and so does the SDD workspace
`.superpowers/sdd/<plan-basename>/`. Jisso never deletes either, and nothing
asks the human to delete either: after T2 the two have the same standing —
untracked, local to one machine, useful only for a later re-read — and disk
is the only cost (issue-12d3).
```

- [ ] **Step 13: Lint**

```bash
./scripts/lint.sh skills/tanto/SKILL.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 14: Commit**

```bash
git commit --only skills/tanto/SKILL.md -m "docs(tanto): the contract names .tanto/<topic>/ and reads the intake from the roster" -m "Every path tanto writes for itself moves to .tanto/, one directory per topic; the Artifacts table is rewritten, the ledger move is gone, the spec and the plan are reached by pointer, and a bug-report sender reads Kanri's name from the target workspace's roster." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 15: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 16: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-workspace.md --task 1
```

Expected: `task 1: verify clean`.

**Done when:** all eleven passages are present in `skills/tanto/SKILL.md`,
A1.1's needle counts 1 in the file, `.superpowers/sdd` survives on exactly the
three lines named above and `plan-basename` on exactly two, lint is clean on
`skills/tanto/SKILL.md`, and the commit carries its `Co-Authored-By:` trailer.

---

## Task 2: Kanri's role file

**Batch:** A. **Blocks:** A2.1, P2.1, P2.2, P2.3, P2.4, P2.5, P2.6, P2.7, P2.8, P2.9, P2.10, P2.11, P2.12, P2.13, P2.14, P2.15, P2.16, P2.17, P2.18, P2.19, P2.20, P2.21, P2.22, P2.23.

This task moves every path Kanri writes for itself out of `.superpowers/sdd/`
and into `.tanto/`, and with it the two sentences the move falsifies: the
ledger no longer moves when the plan lands (K7), and the intake's address is
read from the roster rather than relayed by the human (K13, K14). The spec's
passages K1 to K15 are all here. K1, K7, K13, K14 and K15 carry fixed new text
from the spec and are reproduced whole; K3, K5, K10 and K12 change one clause
of a sentence each; K2, K4, K6, K8, K9 and K11 are the mechanical substitutions
of section 3's path map.

K8 names seven sites and K9 two, each in a different section of the file, so
they become one block per site — eleven blocks between them; the T2 split's
steps 1 and 2 are two separate list items and take two blocks. After this task
`.superpowers/sdd` survives in this file on exactly two lines, both of them new
text the spec wrote: K7's SDD-ledger path
`.superpowers/sdd/<plan-basename>/progress.md` and K15's SDD workspace. The
same two lines are the only survivors of `plan-basename`. Every other one of
the 24 `.superpowers` lines and 9 `plan-basename` lines this file carried on
2026-09-12 sits inside a block below.

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — 23 passages: Start steps 2, 3 and 5
  (K1, K2, K3); the Handover case (K4); the spec-inputs relay (K5); the
  cold-read's dry-run pointer (K6); the plan-lands steps 2 and 5 (K7, K8); the
  batch loop's step 8, the final batch's T2 line and the Kaiseki brief (K8);
  the handover file and its write step (K9); the T2 split's two steps (K8); a
  peer's exit path (K10); Kanri's own exit proposal (K11); the intake copy
  (K12); the intake's address (K13); the relay outcome (K8); reporting from the
  other side (K14); the review-brief dispatch (K8); and the session-lifecycle
  close (K15).

**Interfaces:**

- Consumes, from task 1: nothing.
- Produces, for task 6: nothing a later task consumes — task 6 sweeps this
  file's two allowed survivors.
- markdownlint lints `skills/tanto/roles/kanri.md`; it is a role file, not a
  template, so the lint step is a real markdownlint run.

### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/kanri.md
```

Expected: `i/lf w/crlf attr/text=auto`, never `w/mixed`. Write every passage
with CRLF.

- [ ] **Step 2: Start, step 2 — the two files of `.tanto/` (K1)**

The step stops checking superpowers' ignore file and writes tanto's own two.
The spec's text is fixed; it is re-wrapped here to 79 columns with the
numbered item's three-space continuation indent.

**A2.1** `skills/tanto/roles/kanri.md` — `grep -cF 'Nothing moves: the ledger stays at' skills/tanto/roles/kanri.md` — before: 0, after: 1

**P2.1** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
2. Make sure `.superpowers/sdd/.gitignore` exists and holds `*`. The SDD
   skill's `sdd-workspace` script writes the same line on every run; you are
   only running first.
```

**P2.1 →**

```text
2. Make sure `.tanto/.gitignore` exists and holds `*`, and
   `.tanto/.markdownlint-cli2.yaml` exists and holds the two lines `config:`
   and `  default: false`. Write each only when it is absent and never
   overwrite either: the first keeps everything under `.tanto/` untracked
   without touching the repository's own `.gitignore`, the second keeps the
   editor's markdownlint quiet on files the commit path never lints
   (issue-6aa8). Nothing else writes these two files for you; the SDD skill's
   `sdd-workspace` writes its own ignore file in its own workspace on every
   run, and that is no longer your concern.
```

- [ ] **Step 3: Start, step 3 — the roster's path (K2)**

Mechanical.

**P2.2** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
3. If `.superpowers/sdd/roster.md` is absent, this is the bootstrap: create it
```

**P2.2 →**

```text
3. If `.tanto/roster.md` is absent, this is the bootstrap: create it
```

- [ ] **Step 4: Start, step 5 — the topic-word collision checks (K3)**

The slug check now looks for `.tanto/<slug>/`, and the spec clause naming the
default spec location is stated as such. The paragraph is re-wrapped from the
first changed line to the end of the sentence that follows it; the rest of the
step is unchanged.

**P2.3** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```text
   that no `.superpowers/sdd/<slug>/`, no
   `docs/superpowers/specs/*-<slug>-design.md`, and no branch `<slug>`
   exists (`ls -d`, the glob, and `git branch --list <slug>`), state the
   slug in your reply, and create `.superpowers/sdd/<topic>/kanri.md` from
   `templates/kanri.md`, where the `<topic>` is that slug. Never ask the
```

**P2.3 →**

```text
   that no `.tanto/<slug>/`, no spec for that slug at the default spec
   location (`docs/superpowers/specs/*-<slug>-design.md`), and no branch
   `<slug>` exists (`ls -d`, the glob, and `git branch --list <slug>`), state
   the slug in your reply, and create `.tanto/<topic>/kanri.md` from
   `templates/kanri.md`, where the `<topic>` is that slug. Never ask the
```

- [ ] **Step 5: The five cases, Handover — the handover file's path (K4)**

Mechanical.

**P2.4** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
**Handover** — `.superpowers/sdd/kanri-handover.md` exists. In order: read the
```

**P2.4 →**

```text
**Handover** — `.tanto/kanri-handover.md` exists. In order: read the
```

- [ ] **Step 6: The spec-inputs relay (K5)**

The path moves, and the last sentence drops its "even after the ledger moves"
tail — there is no ledger move any more. The tail of the paragraph is
re-wrapped; the "spec-phase record" wording stays.

**P2.5** `skills/tanto/roles/kanri.md` — replace exactly these 3 lines

```text
to `.superpowers/sdd/<topic>/spec-inputs.md`, then send Sekkei one line with
that path. That file stays in the topic directory as the spec-phase record even
after the ledger moves.
```

**P2.5 →**

```text
to `.tanto/<topic>/spec-inputs.md`, then send Sekkei one line with that path.
That file stays in the topic directory as the spec-phase record.
```

- [ ] **Step 7: The cold-read's dry-run pointer (K6)**

Mechanical.

**P2.6** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
   `.superpowers/sdd/<topic>/plan-dryrun.md`, which the plan-committed line
```

**P2.6 →**

```text
   `.tanto/<topic>/plan-dryrun.md`, which the plan-committed line
```

- [ ] **Step 8: When the plan lands, step 2 — nothing moves (K7)**

The step that moved the ledger becomes the step that records the SDD ledger's
path. The spec's text is fixed, re-wrapped to 79 columns. This is one of the
two lines in this file where `.superpowers/sdd` legitimately survives.

**P2.7** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
2. Move the ledger from `.superpowers/sdd/<topic>/` to
   `.superpowers/sdd/<plan-basename>/kanri.md`, note the move in the roster's
   Events list, and name the topic directory in the moved ledger's Plan
   section. Only the ledger moves.
```

**P2.7 →**

```text
2. Record in the ledger's Plan section the plan's path and the SDD ledger's,
   `.superpowers/sdd/<plan-basename>/progress.md`, which Jisso's
   `sdd-workspace` run will create, and note the landing in the roster's
   Events list. Nothing moves: the ledger stays at `.tanto/<topic>/kanri.md`.
```

- [ ] **Step 9: When the plan lands, step 5 — batch A's prompt (K8)**

Mechanical.

**P2.8** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
   save it as `.superpowers/sdd/<plan-basename>/batch-A-prompt.md`, and send
```

**P2.8 →**

```text
   save it as `.tanto/<topic>/batch-A-prompt.md`, and send
```

- [ ] **Step 10: The batch loop, step 8 — the next batch prompt (K8)**

Mechanical.

**P2.9** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
   `.superpowers/sdd/<plan-basename>/batch-<X>-prompt.md` and send the same
```

**P2.9 →**

```text
   `.tanto/<topic>/batch-<X>-prompt.md` and send the same
```

- [ ] **Step 11: The final batch's T2 line (K8)**

Mechanical. The line is one code span and stays on one line.

**P2.10** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
   `T2: propose the shoroku write-out; write it to .superpowers/sdd/<plan-basename>/shoroku-proposal.md`
```

**P2.10 →**

```text
   `T2: propose the shoroku write-out; write it to .tanto/<topic>/shoroku-proposal.md`
```

- [ ] **Step 12: The Kaiseki trigger, step 2 — the brief's path (K8)**

Mechanical.

**P2.11** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
   `.superpowers/sdd/<plan-basename>/kaiseki-<n>-brief.md` from
```

**P2.11 →**

```text
   `.tanto/<topic>/kaiseki-<n>-brief.md` from
```

- [ ] **Step 13: The handover file, first paragraph (K9)**

Mechanical, both paths; the paragraph's first two lines are re-wrapped because
the shorter paths change where they break.

**P2.12** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
`.superpowers/sdd/kanri-handover.md`, next to the roster, untracked under
`.superpowers/sdd/.gitignore`, copied from `templates/kanri-handover.md`. Its
```

**P2.12 →**

```text
`.tanto/kanri-handover.md`, next to the roster, untracked under
`.tanto/.gitignore`, copied from `templates/kanri-handover.md`. Its
```

- [ ] **Step 14: The Handover steps, step 2 (K9)**

Mechanical.

**P2.13** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
2. Write `.superpowers/sdd/kanri-handover.md` from its template.
```

**P2.13 →**

```text
2. Write `.tanto/kanri-handover.md` from its template.
```

- [ ] **Step 15: The T2 split, step 1 — Jisso's proposal path (K8)**

Mechanical.

**P2.14** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
   `.superpowers/sdd/<plan-basename>/shoroku-proposal.md` and sends you one
```

**P2.14 →**

```text
   `.tanto/<topic>/shoroku-proposal.md` and sends you one
```

- [ ] **Step 16: The T2 split, step 2 — the direction's path (K8)**

Mechanical. Steps 1 and 2 are separate list items, so they are separate blocks.

**P2.15** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
   `.superpowers/sdd/<plan-basename>/shoroku-direction.md`, with the roster's
```

**P2.15 →**

```text
   `.tanto/<topic>/shoroku-direction.md`, with the roster's
```

- [ ] **Step 17: A peer's exit, step 1 (K10)**

The proposal path moves and the ", or the topic directory for Sekkei" clause
goes: every session's exit file now sits in the same topic directory.

**P2.16** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
   `.superpowers/sdd/<plan-basename>/exit-<role>[-<suffix>]-proposal.md`, or
   the topic directory for Sekkei.
```

**P2.16 →**

```text
   `.tanto/<topic>/exit-<role>[-<suffix>]-proposal.md`.
```

- [ ] **Step 18: Kanri's own exit proposal (K11)**

Mechanical.

**P2.17** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
`.superpowers/sdd/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`, and no direction
```

**P2.17 →**

```text
`.tanto/exit-kanri-<YYYY-MM-DD>-<name>-proposal.md`, and no direction
```

- [ ] **Step 19: Intake, the first paragraph (K12)**

The inbox copy's path moves, and "under the existing `.gitignore`" becomes "if
it is absent" — the ignore file is now written by Kanri's own step 2, not
inherited from superpowers. The two lines are re-wrapped.

**P2.18** `skills/tanto/roles/kanri.md` — replace exactly these 2 lines

```text
`.superpowers/sdd/inbox/<YYYY-MM-DD>-<slug>.md`, the slug kebab-case derived by
you from the Symptom, creating `inbox/` under the existing `.gitignore`. When
```

**P2.18 →**

```text
`.tanto/inbox/<YYYY-MM-DD>-<slug>.md`, the slug kebab-case derived by you
from the Symptom, creating `inbox/` if it is absent. When
```

- [ ] **Step 20: Intake, the address paragraph (K13)**

The paragraph is replaced whole: the roster's path is now fixed, so a reporter
reads the intake's name from it instead of the human relaying the name. The
spec's text is fixed, re-wrapped to 79 columns.

**P2.19** `skills/tanto/roles/kanri.md` — replace exactly these 6 lines

```text
The intake's address is the human's to supply. No session outside this
repository can learn your name — `ListAgents` shows no cwd, the roster is per
repository, and the skill's runtime text never names its source location — so
the human, who alone sees both repositories, tells the reporter the bare name
your start line and your residency line print. A report the reporter cannot
send stays a file the human pastes to you as `bug-report: <path>`.
```

**P2.19 →**

```text
The intake's address is read, not relayed. A reporter that knows this
workspace's path reads the first data row of `<workspace>/.tanto/roster.md`
— your row — and takes the bare `<name>` before the bracket of its
`Name [ref]` column as your address; the human supplies the path where the
reporter does not know it, which is the one thing only the human, who sees
both repositories, can tell it. A resume gives you a new name and the row
follows only when you rewrite it, so a reporter checks the name against
`ListAgents` before sending and asks the human for the address when it is
not listed, or when the roster is absent. You write the roster; a reporter
only reads it, and that read, outside the reporter's own working directory,
may draw a harness permission prompt in the reporter's window outside auto
mode — the harness's, not a protocol failure. A report the reporter cannot
send stays a file the human pastes to you as `bug-report: <path>`.
```

- [ ] **Step 21: Triage, the relay outcome (K8)**

Mechanical.

**P2.20** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
   to `.superpowers/sdd/<topic>/spec-inputs.md` as the next `I-n` with your
```

**P2.20 →**

```text
   to `.tanto/<topic>/spec-inputs.md` as the next `I-n` with your
```

- [ ] **Step 22: Reporting from the other side (K14)**

Replaced whole: as a reporter, Kanri now reads the target repository's roster
for the intake's bare name instead of asking the human for it. The spec's text
is fixed, re-wrapped to 79 columns.

**P2.21** `skills/tanto/roles/kanri.md` — replace exactly these 5 lines

```text
You are also a reporter: a Kanri in another repository is where a defect in
this repository's skills is often noticed. On the human's request, write the
report from `templates/bug-report.md`, ask the human for the intake address if
it was not given, send `bug-report: <absolute path>` to that bare name, and
record the send in the roster's Events.
```

**P2.21 →**

```text
You are also a reporter: a Kanri in another repository is where a defect in
this repository's skills is often noticed. On the human's request, write the
report from `templates/bug-report.md`; read the intake's bare name — the
`<name>` before the bracket of the `Name [ref]` column — from the first data
row of `<target workspace>/.tanto/roster.md`, asking the human for the
workspace's path if you do not know it, and expecting, outside auto mode, a
harness permission prompt in your window for a read outside your working
directory; check that the name is in `ListAgents`, and ask the human for the
address when it is not, or when that roster is absent; send
`bug-report: <absolute path>` to that bare name; and record the send in the
roster's Events.
```

- [ ] **Step 23: The review-brief dispatch (K8)**

Mechanical.

**P2.22** `skills/tanto/roles/kanri.md` — replace exactly this 1 line

```text
   `.superpowers/sdd/<topic>/review-brief-spec.md` or `review-brief-plan.md`;
```

**P2.22 →**

```text
   `.tanto/<topic>/review-brief-spec.md` or `review-brief-plan.md`;
```

- [ ] **Step 24: Session lifecycle, the close (K15)**

Replaced whole: the two directories that survive a close are now the topic
directory under `.tanto/` and the SDD workspace, named as superpowers' own.
The spec's text is fixed, re-wrapped to 79 columns. This is the second and
last line in this file where `.superpowers/sdd` legitimately survives.

**P2.23** `skills/tanto/roles/kanri.md` — replace exactly these 4 lines

```text
Neither `.superpowers/sdd/<plan-basename>/` nor the topic directory beside it is
deleted at the close, and you ask the human about neither. After T2 the two have
the same standing: untracked, local to one machine, and useful only for a later
re-read (issue-12d3).
```

**P2.23 →**

```text
Neither `.tanto/<topic>/` nor the SDD workspace
`.superpowers/sdd/<plan-basename>/` is deleted at the close, and you ask the
human about neither. After T2 the two have the same standing: untracked,
local to one machine, and useful only for a later re-read (issue-12d3).
```

- [ ] **Step 25: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/kanri.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 26: Commit**

```bash
git commit --only skills/tanto/roles/kanri.md -m "docs(tanto): Kanri writes its own state under .tanto/" -m "The ledger no longer moves when the plan lands, the two self-contained files of .tanto/ are Kanri's to write, and the intake's address is read from the roster instead of relayed by the human (K1-K15)." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 27: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 28: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-workspace.md --task 2
```

Expected: `task 2: verify clean`.

**Done when:** all 23 passages are present in `skills/tanto/roles/kanri.md`,
A2.1's needle counts 1 there, `.superpowers/sdd` and `plan-basename` each
survive on exactly the two lines P2.7 and P2.23 wrote, lint is clean on the
changed path, and the commit carries its `Co-Authored-By:` trailer.

---

## Task 3: the three non-Kanri role files

**Batch:** A. **Blocks:** A3.1, P3.1, P3.2, P3.3, P3.4, P3.5, P3.6, P3.7,
A3.2, P3.8, P3.9, P3.10, A3.3, P3.11, P3.12, P3.13, P3.14.

This task moves Sekkei's, Kaiseki's, and Jisso's own state out of
`.superpowers/sdd/` and into `.tanto/`, per the spec's path map (section 3)
and passages E1-E3, A1-A2, and J1-J2. Sekkei's seven passages are the "Where
your files go" list replaced whole (E1), the five working-file paths of E2
(Step 1's `dialogue.md`, Step 2's `spec-review.md`, Step 4's `plan-dryrun.md`
and `plan-review.md`, and the exit proposal and direction), and the first
bullet of "Your write and commit rule" (E3). Kaiseki's three are the
Standalone paragraph replaced whole (A1), which also picks up the second
self-contained file and the roster-read bug-report route, and A2's two
mechanical sites. Jisso's four are J1's table row and J2's three "in the
workspace" sentences.

Jisso carries no path spelling at all today — `grep -n '\.superpowers'` and
`grep -n 'plan-basename'` both return nothing there — yet it carries four
passages, because "the workspace" in its text means the SDD workspace once J1
has said so, and Kanri no longer reads there. Jisso's step 2, the
`sdd-workspace` run, names no path and is unchanged; "this plan's workspace"
in that step is superpowers' own and is not a hit. Measured on 2026-09-12,
`.superpowers` and `plan-basename` stand at 8 and 0 in `roles/sekkei.md`, 4
and 1 in `roles/kaiseki.md`, and 0 and 0 in `roles/jisso.md`; after these
fourteen passages all three files read 0 for both, with no survivor in any of
them. No passage here goes near Jisso's verbatim quote of the four SDD stop
classes, which must stay byte-identical with `SKILL.md`'s copy
(`docs/notes/tanto-consistency-checks.md` check 5); its count is 1 before and
1 after.

**Files:**

- Modify: `skills/tanto/roles/sekkei.md` — seven passages: E1's four-item
  list, E2's five paths, E3's bullet.
- Modify: `skills/tanto/roles/kaiseki.md` — three passages: A1's Standalone
  paragraph, A2's exit proposal path and standalone report numbering.
- Modify: `skills/tanto/roles/jisso.md` — four passages: J2's batch-report
  sentence, J1's SDD Finish row, J2's T2 proposal sentence and exit path
  sentence.

**Interfaces:**

- Consumes, from task 1 or 2: nothing.
- Produces, for task 6: the three role files free of `.superpowers` and of
  `plan-basename`, which task 6's sweep counts.
- markdownlint lints all three: `skills/**/templates/**` is ignored, the role
  files are not.

### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/roles/sekkei.md skills/tanto/roles/kaiseki.md skills/tanto/roles/jisso.md
```

Expected: `i/lf w/crlf attr/text=auto` on every one, and never `w/mixed`.
Write every passage with CRLF.

- [ ] **Step 2: Sekkei's anchor, and "Where your files go" (E1)**

**A3.1** `skills/tanto/roles/sekkei.md` — `grep -cF 'You write only under the spec and plan directory the orders line names' skills/tanto/roles/sekkei.md` — before: 0, after: 1

**P3.1** `skills/tanto/roles/sekkei.md` — replace exactly these 7 lines

```text
- Spec — `docs/superpowers/specs/<YYYY-MM-DD>-<topic>-design.md`
- Plan — `docs/superpowers/plans/<YYYY-MM-DD>-<topic>.md`
- Your working notes — under `.superpowers/sdd/<topic>/`
- Kanri's relay of what the human said during spec work, when there is one —
  `.superpowers/sdd/<topic>/spec-inputs.md`, numbered `I-n`, each with Kanri's
  advisory notes. Read it before the dialogue and answer every `I-n` in the
  spec.
```

**P3.1 →**

```text
- Spec — the path Kanri's orders line names; by default
  `docs/superpowers/specs/<YYYY-MM-DD>-<topic>-design.md`
- Plan — the path Kanri's orders line names; by default
  `docs/superpowers/plans/<YYYY-MM-DD>-<topic>.md`
- Your working notes — under `.tanto/<topic>/`
- Kanri's relay of what the human said during spec work, when there is one —
  `.tanto/<topic>/spec-inputs.md`, numbered `I-n`, each with Kanri's advisory
  notes. Read it before the dialogue and answer every `I-n` in the spec.
```

The spec and the plan become "the path Kanri's orders line names; by default
…", so the first two items grow to two lines each; the last item is re-wrapped
because its text no longer fills three lines at this width. The wording is the
spec's E1, unchanged.

- [ ] **Step 3: Step 1's dialogue path (E2)**

**P3.2** `skills/tanto/roles/sekkei.md` — replace exactly this 1 line

```text
Keep `.superpowers/sdd/<topic>/dialogue.md` as you go: each question you put
```

**P3.2 →**

```text
Keep `.tanto/<topic>/dialogue.md` as you go: each question you put
```

Mechanical. The substitution shortens the line, so the paragraph is not
re-wrapped.

- [ ] **Step 4: Step 2's spec-review path (E2)**

**P3.3** `skills/tanto/roles/sekkei.md` — replace exactly this 1 line

```text
`.superpowers/sdd/<topic>/spec-review.md` with a **Shoroku candidates**
```

**P3.3 →**

```text
`.tanto/<topic>/spec-review.md` with a **Shoroku candidates**
```

Mechanical.

- [ ] **Step 5: Step 4's plan-dryrun path (E2)**

**P3.4** `skills/tanto/roles/sekkei.md` — replace exactly this 1 line

```text
   `.superpowers/sdd/<topic>/plan-dryrun.md` from what they print: the two
```

**P3.4 →**

```text
   `.tanto/<topic>/plan-dryrun.md` from what they print: the two
```

Mechanical. The line is a numbered item's continuation; keep its three-space
indent.

- [ ] **Step 6: Step 4's plan-review path (E2)**

**P3.5** `skills/tanto/roles/sekkei.md` — replace exactly this 1 line

```text
   re-running the set, and writes `.superpowers/sdd/<topic>/plan-review.md`
```

**P3.5 →**

```text
   re-running the set, and writes `.tanto/<topic>/plan-review.md`
```

Mechanical, three-space indent kept.

- [ ] **Step 7: Your write and commit rule, the first bullet (E3)**

**P3.6** `skills/tanto/roles/sekkei.md` — replace exactly these 3 lines

```text
- You write only under `docs/superpowers/` and `.superpowers/sdd/`, and you may
  write there **at any time**. No plan task touches those paths, which is what
  lets you draft the next plan while a batch of the current one runs.
```

**P3.6 →**

```text
- You write only under the spec and plan directory the orders line names — by
  default `docs/superpowers/` — and `.tanto/`, and you may write there **at
  any time**. No plan task touches those paths, which is what lets you draft
  the next plan while a batch of the current one runs.
```

Only the first sentence changes, to the spec's E3 wording; the rest of the
bullet is the file's own text, re-wrapped because the longer first sentence
pushes it.

- [ ] **Step 8: the exit proposal and direction paths (E2)**

**P3.7** `skills/tanto/roles/sekkei.md` — replace exactly this 1 line

```text
  `.superpowers/sdd/<topic>/exit-sekkei-proposal.md` and Kanri's answer to
```

**P3.7 →**

```text
  `.tanto/<topic>/exit-sekkei-proposal.md` and Kanri's answer to
```

Mechanical; `exit-sekkei-direction.md` on the next line is named "beside it"
and needs no change.

- [ ] **Step 9: Kaiseki's anchor, and the Standalone paragraph (A1)**

**A3.2** `skills/tanto/roles/kaiseki.md` — `grep -cF 'the report stays untracked and unflagged' skills/tanto/roles/kaiseki.md` — before: 0, after: 1

**P3.8** `skills/tanto/roles/kaiseki.md` — replace exactly these 11 lines

```text
**Standalone.** `/tanto kaiseki` with no address — no roster, no handshake, no
batch loop. Ask the human for the symptom and the reproduction, and write your
report to `.superpowers/sdd/kaiseki/kaiseki-<n>.md`, creating that directory if
it is absent, and `.superpowers/sdd/.gitignore` holding `*` if that is absent
too, so the report stays untracked. Everything else below is the same, with two
additions. Before the
human closes the session, run `shoroku` in its ordinary session mode, with the
human answering `Direction?`, and commit once — there is no Kanri to rule for
you. And when the human asks for a defect to be reported to another repository,
write the report from `templates/bug-report.md` and send it to the address the
human gives, or leave it as a file for the human.
```

**P3.8 →**

```text
**Standalone.** `/tanto kaiseki` with no address — no roster, no handshake, no
batch loop. Ask the human for the symptom and the reproduction, and write your
report to `.tanto/kaiseki/kaiseki-<n>.md`, creating that directory if it is
absent, and, if they are absent too, `.tanto/.gitignore` holding `*` and
`.tanto/.markdownlint-cli2.yaml` holding `config:` and `  default: false`, so
the report stays untracked and unflagged. Everything else below is the same,
with two additions. Before the human closes the session, run `shoroku` in its
ordinary session mode, with the human answering `Direction?`, and commit once —
there is no Kanri to rule for you. And when the human asks for a defect to be
reported to another repository, write the report from
`templates/bug-report.md`, read the intake's bare name — the `<name>` before
the bracket of the `Name [ref]` column — from the first data row of that
repository's `.tanto/roster.md`, the human giving you the workspace's path,
check the name against `ListAgents`, and send `bug-report: <absolute path>`
to it; when that roster is absent or the name is not listed, ask the human
for the address, and a report you still cannot send stays a file the human
carries.
```

The spec's A1 wording, re-wrapped to this file's column; the paragraph's two
short lines ("additions. Before the") are absorbed by the re-wrap. The inline
code `  default: false` carries its two leading spaces.

- [ ] **Step 10: the exit proposal path (A2)**

**P3.9** `skills/tanto/roles/kaiseki.md` — replace exactly this 1 line

```text
`.superpowers/sdd/<plan-basename>/exit-kaiseki-<n>-proposal.md`; on its
```

**P3.9 →**

```text
`.tanto/<topic>/exit-kaiseki-<n>-proposal.md`; on its
```

Mechanical, and the file's only `plan-basename`.

- [ ] **Step 11: the standalone report's numbering (A2)**

**P3.10** `skills/tanto/roles/kaiseki.md` — replace exactly this 1 line

```text
already in `.superpowers/sdd/kaiseki/`. Attached, before the line, run the
```

**P3.10 →**

```text
already in `.tanto/kaiseki/`. Attached, before the line, run the
```

Mechanical.

- [ ] **Step 12: Jisso's anchor, and the batch report's directory (J2)**

**A3.3** `skills/tanto/roles/jisso.md` — `grep -cF 'it holds the SDD ledger; nobody deletes it at the close' skills/tanto/roles/jisso.md` — before: 0, after: 1

**P3.11** `skills/tanto/roles/jisso.md` — replace exactly these 3 lines

```text
1. Write `batch-<X>-report.md` in the workspace from the tanto skill's
   `templates/batch-report.md`, taking your own reading (`SKILL.md`, "The
   transcript reading") into its `- Transcript — <reading>` line.
```

**P3.11 →**

```text
1. Write `batch-<X>-report.md` in the topic directory, `.tanto/<topic>/`, from
   the tanto skill's `templates/batch-report.md`, taking your own reading
   (`SKILL.md`, "The transcript reading") into its `- Transcript — <reading>`
   line.
```

The first of J2's three sentences; the item is re-wrapped because the named
directory is longer than "the workspace", and its three-space continuation
indent is kept.

- [ ] **Step 13: the SDD Finish row of "What tanto overrides" (J1)**

**P3.12** `skills/tanto/roles/jisso.md` — replace exactly this 1 line

```text
| SDD Finish — delete the workspace once the final review is clean | never delete it | it holds the conductor ledger, the reports, and the T2 source; nobody deletes it at the close, and the topic directory beside it stays on the same terms (issue-12d3) |
```

**P3.12 →**

```text
| SDD Finish — delete the workspace once the final review is clean | never delete it | it holds the SDD ledger; nobody deletes it at the close, and `.tanto/<topic>/`, which holds the conductor ledger, the reports, and the T2 source, stays on the same terms (issue-12d3) |
```

Only the Why cell changes, to the spec's J1 wording; the row stays one line.

- [ ] **Step 14: the T2 proposal's directory (J2)**

**P3.13** `skills/tanto/roles/jisso.md` — replace exactly these 3 lines

```text
numbered list to `shoroku-proposal.md` in the workspace **instead of printing
it**, seeded by the conductor ledger's adopted `S-n` rows and extended from
your own context. Then send Kanri one line with the path, and idle.
```

**P3.13 →**

```text
numbered list to `shoroku-proposal.md` in the topic directory,
`.tanto/<topic>/`, **instead of printing it**, seeded by the conductor
ledger's adopted `S-n` rows and extended from your own context. Then send
Kanri one line with the path, and idle.
```

The second of J2's three sentences; the rest of the paragraph is re-wrapped
around it and its words are unchanged.

- [ ] **Step 15: the exit proposal's directory (J2)**

**P3.14** `skills/tanto/roles/jisso.md` — replace exactly these 2 lines

```text
path being `exit-jisso-<X>-proposal.md` in the workspace with `<X>` the batch
letter, and answers item by item in `exit-jisso-<X>-direction.md` beside it.
```

**P3.14 →**

```text
path being `exit-jisso-<X>-proposal.md` in the topic directory,
`.tanto/<topic>/`, with `<X>` the batch letter, and answers item by item in
`exit-jisso-<X>-direction.md` beside it.
```

The third of J2's three sentences, re-wrapped; the direction file stays
"beside it".

- [ ] **Step 16: Lint**

```bash
./scripts/lint.sh skills/tanto/roles/sekkei.md skills/tanto/roles/kaiseki.md skills/tanto/roles/jisso.md
```

Expected: exit 0, none `Failed`.

This step runs before the Verify step below, not after. markdownlint runs with
`--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 17: Commit**

```bash
git commit --only skills/tanto/roles/sekkei.md skills/tanto/roles/kaiseki.md skills/tanto/roles/jisso.md -m "docs(tanto): move Sekkei, Kaiseki, and Jisso state to .tanto/" -m "Sekkei's working files, Kaiseki's standalone reports and exit proposal, and the three Jisso sentences that said the workspace now name the topic directory. Kaiseki's standalone paragraph also writes the markdownlint file and reads a bug report's intake from the target roster." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 18: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 19: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-workspace.md --task 3
```

Expected: `task 3: verify clean`.

**Done when:** all fourteen passages are present in the three role files, the
three anchors read 1, `.superpowers` and `plan-basename` read 0 in every one
of the three, lint is clean on the three changed paths, and the commit carries
its `Co-Authored-By:` trailer.

---

## Task 4: The tanto templates

**Batch:** A. **Blocks:** A4.1, P4.1, P4.2, P4.3, P4.4, A4.2, P4.5, P4.6, A4.3,
P4.7, A4.4, P4.8, P4.9, A4.5, P4.10, P4.11, P4.12, P4.13, A4.6, P4.14, A4.7,
P4.15, P4.16, P4.17, A4.8, P4.18, A4.9, P4.19, P4.20.

This task moves every path the templates write or name from `.superpowers/sdd/`
to `.tanto/`, and with it the wording that only existed because the conductor
ledger used to move at the plan's landing. It carries the spec's passages T1 to
T10: T1 and T2 in `templates/kanri.md` (the title, the opening paragraph, and
the Plan section), T3 in `templates/roster.md`, T4 in
`templates/roster-archive.md`, T5 in `templates/kanri-handover.md`, T6 in
`templates/batch-prompt.md`, T7 in `templates/batch-report.md`, T8 in
`templates/kaiseki-brief.md`, T9 in `templates/review-brief.md`, and T10 in
`templates/bug-report.md`. The templates are what every session writes its
state into, so they belong in batch A with the files a session loads (input 7).

Four lines keep `.superpowers/sdd`, and they are the SDD ledger's own path,
`.superpowers/sdd/<plan-basename>/progress.md`, written by Jisso through
`sdd-workspace` and only read by tanto (input 5): one in
`templates/batch-prompt.md` (Setup on resume), one in
`templates/batch-report.md` (the header list), one in
`templates/kaiseki-brief.md` (the Task list), and one in `templates/kanri.md`
(the Plan section). Those same four lines are the only place `plan-basename`
survives. On 2026-09-12 the nine files carried 23 lines with `.superpowers`
and 13 with `plan-basename`; this task rewrites 19 of the first and 9 of the
second, leaving 4 of each. `templates/kaiseki-report.md` and
`templates/tanto.json` carry no path and are not touched, so `SKILL.md`'s
sentence "There are eleven:" and its list stay true — this task adds and
removes no template.

**Files:**

- Modify: `skills/tanto/templates/kanri.md` — four passages: the H1 title, the
  opening paragraph's second and third sentences, the Spec and Plan lines, and
  the Topic directory line (T1, T2).
- Modify: `skills/tanto/templates/roster.md` — two passages: line 3's keeping
  address, and the Events example's ledger-move clause (T3). The Keeping rule
  is unchanged.
- Modify: `skills/tanto/templates/roster-archive.md` — one passage: line 3's
  keeping address (T4).
- Modify: `skills/tanto/templates/kanri-handover.md` — two passages: the
  opening paragraph, and the In flight section's Ledger line (T5).
- Modify: `skills/tanto/templates/batch-prompt.md` — four passages: the Guard,
  the Plan and Spec lines, the Conductor ledger line, and the Report paragraph
  (T6).
- Modify: `skills/tanto/templates/batch-report.md` — one passage: the Plan line
  (T7).
- Modify: `skills/tanto/templates/kaiseki-brief.md` — three passages: the
  opening sentence, the Batch report line, and the Report paragraph (T8).
- Modify: `skills/tanto/templates/review-brief.md` — one passage: the opening
  paragraph's first three lines (T9).
- Modify: `skills/tanto/templates/bug-report.md` — two passages: the opening
  paragraph, replaced whole, and the Send to placeholder (T10).

**Interfaces:**

- Consumes, from task 1, 2 or 3: nothing. Every passage here is local to a
  template file; no earlier task edits these nine files.
- Produces, for task 6: nothing a later task consumes as text. Task 6's sweep
  counts the four SDD-ledger survivors this task leaves, so the counts above
  must hold when that sweep runs.
- markdownlint does **not** lint these files: `.markdownlint-cli2.yaml` ignores
  `skills/**/templates/**`. The lint step on this task exercises the
  trailing-whitespace, end-of-file-fixer and mixed-line-ending hooks only, so
  no `--fix` can rewrite a line inside a passage here.

### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/templates/kanri.md skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/batch-report.md skills/tanto/templates/kaiseki-brief.md skills/tanto/templates/review-brief.md skills/tanto/templates/bug-report.md
```

Expected: `i/lf w/crlf attr/text=auto` on every one, and never `w/mixed`. Write
every passage with CRLF.

- [ ] **Step 2: The ledger template's title (T1, first half)**

**A4.1** `skills/tanto/templates/kanri.md` — `grep -cF 'Topic directory — <.tanto/<topic>/>' skills/tanto/templates/kanri.md` — before: 0, after: 1

**P4.1** `skills/tanto/templates/kanri.md` — replace exactly this 1 line

```text
# Conductor ledger — <topic, then the plan basename after the move>
```

**P4.1 →**

```text
# Conductor ledger — <topic>
```

- [ ] **Step 3: The ledger template's opening paragraph (T1, second half)**

The paragraph's first sentence, on line 3, is unchanged; only the second and
third sentences are replaced, and the two sentences become one.

**P4.2** `skills/tanto/templates/kanri.md` — replace exactly these 3 lines

```text
Lives at `.superpowers/sdd/<topic>/kanri.md` until the plan is committed, then
moves to `.superpowers/sdd/<plan-basename>/kanri.md` next to Jisso's own
`progress.md`. The move is recorded in the roster's Events list.
```

**P4.2 →**

```text
Lives at `.tanto/<topic>/kanri.md` from the topic's opening to the plan's
close, and never moves.
```

- [ ] **Step 4: The ledger template's Spec and Plan lines (T2)**

**P4.3** `skills/tanto/templates/kanri.md` — replace exactly these 2 lines

```text
- Spec — <path under docs/superpowers/specs/, or "not yet written">
- Plan — <path under docs/superpowers/plans/, or "not yet written">
```

**P4.3 →**

```text
- Spec — <the spec's path, or "not yet written">
- Plan — <the plan's path, or "not yet written">
```

- [ ] **Step 5: The ledger template's Topic directory line (T2)**

The Branch line above it and the SDD ledger line below it are unchanged; the
SDD ledger line is one of this plan's four `.superpowers/sdd` survivors.

**P4.4** `skills/tanto/templates/kanri.md` — replace exactly this 1 line

```text
- Topic directory — <.superpowers/sdd/<topic>/, kept after the ledger moves>
```

**P4.4 →**

```text
- Topic directory — <.tanto/<topic>/>
```

- [ ] **Step 6: The roster's keeping address (T3, first part)**

**A4.2** `skills/tanto/templates/roster.md` — `grep -cF 'the plan landed and the SDD' skills/tanto/templates/roster.md` — before: 0, after: 1

**P4.5** `skills/tanto/templates/roster.md` — replace exactly this 1 line

```text
Kept by Kanri at `.superpowers/sdd/roster.md`. Kanri is the only writer.
```

**P4.5 →**

```text
Kept by Kanri at `.tanto/roster.md`. Kanri is the only writer.
```

- [ ] **Step 7: The roster's Events example (T3, second part)**

The clause naming the ledger's move becomes the clause naming the plan's
landing. The substitution shortens the text, so the three continuation lines
are re-wrapped as a group; the bullet's first line and every line after the
third are untouched.

**P4.6** `skills/tanto/templates/roster.md` — replace exactly these 3 lines

```text
  session declared dead and what was verified; the conductor ledger moved from
  .superpowers/sdd/<topic>/ to .superpowers/sdd/<plan-basename>/; a VS Code
  restart and which roles were recreated; resumed: <old name> → <new name>;
```

**P4.6 →**

```text
  session declared dead and what was verified; the plan landed and the SDD
  ledger's path recorded; a VS Code restart and which roles were recreated;
  resumed: <old name> → <new name>;
```

- [ ] **Step 8: The roster archive's keeping address (T4)**

Mechanical: the path map's `roster-archive.md` row.

**A4.3** `skills/tanto/templates/roster-archive.md` — `grep -cF '.tanto/roster-archive.md' skills/tanto/templates/roster-archive.md` — before: 0, after: 1

**P4.7** `skills/tanto/templates/roster-archive.md` — replace exactly this 1 line

```text
Kept by Kanri at `.superpowers/sdd/roster-archive.md`, next to the roster.
```

**P4.7 →**

```text
Kept by Kanri at `.tanto/roster-archive.md`, next to the roster.
```

- [ ] **Step 9: The handover's opening paragraph (T5, first part)**

Both paths on lines 3 and 4 change, and the `.gitignore` named is now
`.tanto/`'s own. The substitutions shorten the first two lines, so the whole
four-line paragraph is re-wrapped.

**A4.4** `skills/tanto/templates/kanri-handover.md` — `grep -cF '.tanto/kanri-handover.md' skills/tanto/templates/kanri-handover.md` — before: 0, after: 1

**P4.8** `skills/tanto/templates/kanri-handover.md` — replace exactly these 4 lines

```text
Written by the outgoing Kanri at `.superpowers/sdd/kanri-handover.md`, next to
the roster and untracked under `.superpowers/sdd/.gitignore`. The successor
reads it, acts on it, and deletes it. Everything not listed below is a pointer
to the roster and the ledgers, never a copy.
```

**P4.8 →**

```text
Written by the outgoing Kanri at `.tanto/kanri-handover.md`, next to the
roster and untracked under `.tanto/.gitignore`. The successor reads it, acts
on it, and deletes it. Everything not listed below is a pointer to the roster
and the ledgers, never a copy.
```

- [ ] **Step 10: The handover's In flight Ledger line (T5, second part)**

**P4.9** `skills/tanto/templates/kanri-handover.md` — replace exactly this 1 line

```text
- Ledger — <.superpowers/sdd/<plan-basename>/kanri.md, or "none">
```

**P4.9 →**

```text
- Ledger — <.tanto/<topic>/kanri.md, or "none">
```

- [ ] **Step 11: The batch prompt's Guard (T6, first part)**

The workspace the Guard names is the topic directory, not the plan basename.
The substitution shortens line 4, so the three-line Guard is re-wrapped.

**A4.5** `skills/tanto/templates/batch-prompt.md` — `grep -cF 'Conductor ledger, read only — <.tanto/<topic>/kanri.md>' skills/tanto/templates/batch-prompt.md` — before: 0, after: 1

**P4.10** `skills/tanto/templates/batch-prompt.md` — replace exactly these 3 lines

```text
Guard — this prompt belongs to the tanto workspace
`.superpowers/sdd/<plan-basename>/` in `<repo path>` on branch `<branch>`. If
that is not your workspace, reply `not me` to `<kanri-address>` and stop.
```

**P4.10 →**

```text
Guard — this prompt belongs to the tanto workspace `.tanto/<topic>/` in
`<repo path>` on branch `<branch>`. If that is not your workspace, reply
`not me` to `<kanri-address>` and stop.
```

- [ ] **Step 12: The batch prompt's Plan and Spec lines (T6, second part)**

**P4.11** `skills/tanto/templates/batch-prompt.md` — replace exactly these 2 lines

```text
- Plan — <path under docs/superpowers/plans/>
- Spec — <path under docs/superpowers/specs/>
```

**P4.11 →**

```text
- Plan — <the plan's path>
- Spec — <the spec's path>
```

- [ ] **Step 13: The batch prompt's Conductor ledger line (T6, third part)**

The SDD ledger line directly above it is unchanged — the second of the four
survivors.

**P4.12** `skills/tanto/templates/batch-prompt.md` — replace exactly this 1 line

```text
- Conductor ledger, read only — <.superpowers/sdd/<plan-basename>/kanri.md>
```

**P4.12 →**

```text
- Conductor ledger, read only — <.tanto/<topic>/kanri.md>
```

- [ ] **Step 14: The batch prompt's Report paragraph (T6, fourth part)**

The substitution shortens line 50, so the paragraph's first three lines are
re-wrapped; its last line is untouched.

**P4.13** `skills/tanto/templates/batch-prompt.md` — replace exactly these 3 lines

```text
Write `.superpowers/sdd/<plan-basename>/batch-<X>-report.md` from the tanto
skill's `templates/batch-report.md`, then send `<kanri-address>` one line with
its path. Kanri reads these sections first, in this order — For Kanri, Rulings,
```

**P4.13 →**

```text
Write `.tanto/<topic>/batch-<X>-report.md` from the tanto skill's
`templates/batch-report.md`, then send `<kanri-address>` one line with its
path. Kanri reads these sections first, in this order — For Kanri, Rulings,
```

- [ ] **Step 15: The batch report's Plan line (T7)**

The SDD ledger line three lines below it is unchanged — the third survivor.

**A4.6** `skills/tanto/templates/batch-report.md` — `grep -cF 'Plan — <the plan' skills/tanto/templates/batch-report.md` — before: 0, after: 1

**P4.14** `skills/tanto/templates/batch-report.md` — replace exactly this 1 line

```text
- Plan — <path under docs/superpowers/plans/>
```

**P4.14 →**

```text
- Plan — <the plan's path>
```

- [ ] **Step 16: The Kaiseki brief's opening sentence (T8, first part)**

The new path fits on one line, so "Read it first, then start." stays where it
is.

**A4.7** `skills/tanto/templates/kaiseki-brief.md` — `grep -cF '.tanto/<topic>/kaiseki-<n>-brief.md' skills/tanto/templates/kaiseki-brief.md` — before: 0, after: 1

**P4.15** `skills/tanto/templates/kaiseki-brief.md` — replace exactly this 1 line

```text
Written by Kanri at `.superpowers/sdd/<plan-basename>/kaiseki-<n>-brief.md`.
```

**P4.15 →**

```text
Written by Kanri at `.tanto/<topic>/kaiseki-<n>-brief.md`.
```

- [ ] **Step 17: The Kaiseki brief's Batch report line (T8, second part)**

The SDD ledger line directly below it is unchanged — the fourth and last
survivor.

**P4.16** `skills/tanto/templates/kaiseki-brief.md` — replace exactly this 1 line

```text
- Batch report — <.superpowers/sdd/<plan-basename>/batch-<X>-report.md>
```

**P4.16 →**

```text
- Batch report — <.tanto/<topic>/batch-<X>-report.md>
```

- [ ] **Step 18: The Kaiseki brief's Report paragraph (T8, third part)**

The substitution shortens the first line, so the three-line paragraph is
re-wrapped.

**P4.17** `skills/tanto/templates/kaiseki-brief.md` — replace exactly these 3 lines

```text
Write `.superpowers/sdd/<plan-basename>/kaiseki-<n>.md` from the tanto
skill's `templates/kaiseki-report.md`, then send `<kanri-address>` one line
with its path.
```

**P4.17 →**

```text
Write `.tanto/<topic>/kaiseki-<n>.md` from the tanto skill's
`templates/kaiseki-report.md`, then send `<kanri-address>` one line with its
path.
```

- [ ] **Step 19: The review brief's opening paragraph (T9)**

Both paths change, and the `.gitignore` named is now `.tanto/`'s own. The
substitutions shorten lines 4 and 5, so the paragraph's first three lines are
re-wrapped; the sentence that starts on line 6 is untouched.

**A4.8** `skills/tanto/templates/review-brief.md` — `grep -cF '.tanto/<topic>/review-brief-spec.md' skills/tanto/templates/review-brief.md` — before: 0, after: 1

**P4.18** `skills/tanto/templates/review-brief.md` — replace exactly these 3 lines

```text
Written by the brief writer Kanri dispatches, at
`.superpowers/sdd/<topic>/review-brief-spec.md` or `review-brief-plan.md`,
next to the review reports and untracked under `.superpowers/sdd/.gitignore`.
```

**P4.18 →**

```text
Written by the brief writer Kanri dispatches, at
`.tanto/<topic>/review-brief-spec.md` or `review-brief-plan.md`, next to the
review reports and untracked under `.tanto/.gitignore`.
```

- [ ] **Step 20: The bug report's opening paragraph (T10, first part)**

Replaced whole with the spec's fixed wording, re-wrapped to 79 columns: the
reporter's own `.tanto/` and both of its two files, and the intake's bare name
read from the target workspace's roster and checked against `ListAgents`.

**A4.9** `skills/tanto/templates/bug-report.md` — `grep -cF '.tanto/inbox/<YYYY-MM-DD>-<slug>.md' skills/tanto/templates/bug-report.md` — before: 0, after: 1

**P4.19** `skills/tanto/templates/bug-report.md` — replace exactly these 6 lines

```text
Written from the tanto skill's `templates/bug-report.md` by whoever noticed the
defect, saved anywhere untracked under the reporter's own repository's
`.superpowers/sdd/` (whose `.gitignore` holds `*`; create it if absent), and
sent to the intake as one line,
`bug-report: <absolute path>`. The intake Kanri copies it to
`.superpowers/sdd/inbox/<YYYY-MM-DD>-<slug>.md` and fills Triage in the copy.
```

**P4.19 →**

```text
Written from the tanto skill's `templates/bug-report.md` by whoever noticed
the defect, saved anywhere untracked under the reporter's own repository's
`.tanto/` (whose `.gitignore` holds `*` and whose `.markdownlint-cli2.yaml`
holds `config:` / `default: false`; create both if absent), and sent to the
intake as one line, `bug-report: <absolute path>`, the intake's bare name —
the `<name>` before the bracket of the `Name [ref]` column — read from the
first data row of the target workspace's `.tanto/roster.md` and checked
against `ListAgents`, or given by the human when that roster is absent or
the name is not listed. The intake Kanri copies it to
`.tanto/inbox/<YYYY-MM-DD>-<slug>.md` and fills Triage in the copy.
```

- [ ] **Step 21: The bug report's Send to placeholder (T10, second part)**

**P4.20** `skills/tanto/templates/bug-report.md` — replace exactly these 2 lines

```text
<The intake's bare name, as the human gave it. Leave it blank if the report was
never sent, so the file still says where it was meant to go.>
```

**P4.20 →**

```text
<The intake's bare name, as read from the target roster's first data row, or
as the human gave it. Leave it blank if the report was never sent, so the
file still says where it was meant to go.>
```

- [ ] **Step 22: Lint**

```bash
./scripts/lint.sh skills/tanto/templates/kanri.md skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/batch-report.md skills/tanto/templates/kaiseki-brief.md skills/tanto/templates/review-brief.md skills/tanto/templates/bug-report.md
```

Expected: exit 0, none `Failed`. markdownlint is not among the hooks that see
these paths; trailing whitespace, end of file and mixed line ending are.

**This step runs before the Verify step below, not after.** If a hook fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 23: Commit**

```bash
git commit --only skills/tanto/templates/kanri.md skills/tanto/templates/roster.md skills/tanto/templates/roster-archive.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/batch-report.md skills/tanto/templates/kaiseki-brief.md skills/tanto/templates/review-brief.md skills/tanto/templates/bug-report.md -m "docs(tanto): the templates write under .tanto/, one directory per topic" -m "Nine templates name their own paths. Every one becomes .tanto/<topic>/ or .tanto/, and the ledger's move at the plan's landing goes with them: the conductor ledger's title, its opening paragraph, and the roster's Events example no longer describe a move that does not happen. The spec and plan placeholders lose their docs/superpowers qualifier, and the bug report's opening paragraph is replaced whole — the reporter's own .tanto/ with both of its files, and the intake's name read from the target roster. The SDD ledger's path stays on four lines." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 24: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 25: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-workspace.md --task 4
```

Expected: `task 4: verify clean`.

**Done when:** all twenty passages are present in the nine templates, the nine
anchors each read 1, `.superpowers/sdd` and `plan-basename` survive on exactly
four lines across the nine files — the SDD ledger line of `batch-prompt.md`,
`batch-report.md`, `kaiseki-brief.md` and `kanri.md` — `templates/kaiseki-report.md`
and `templates/tanto.json` are unchanged, lint is clean on the nine changed
paths, and the commit carries its `Co-Authored-By:` trailer.

---

## Task 5: The README and the consistency note

**Batch:** B. **Blocks:** A5.1, P5.1, A5.2, P5.2, P5.3.

The two files nobody's session loads: `skills/tanto/README.md`, read by a
person deciding whether to install the skill, and
`docs/notes/tanto-consistency-checks.md`, read by a person or a verification
step checking the skill against itself. That is why they are batch B (spec
section 6): a session started at batch A's boundary reads a skill that agrees
with itself, and these two catch up afterwards. Three passages, all from
spec section 4: R1 (the README's superpowers bullet, 4.7), N1 and N2 (the
note's second trap and its extraction paragraph, 4.8). Per the repository's
`AGENTS.md`, a skill's `README.md` is reviewed for drift after `SKILL.md`
changes; R1 is that review's result, written into the plan instead of left to
a later pass.

All three passages **keep** the `.superpowers` spelling they carry, by
design: every one of these sentences is about the SDD workspace and the
superpowers directory, which this plan does not move. What changes is what
the sentences *say* — that tanto's own state now sits elsewhere — not the
path they name. `grep -n '\.superpowers' skills/tanto/README.md
docs/notes/tanto-consistency-checks.md` printed 1 line for the README and 2
for the note on 2026-09-12, and must print the same 3 lines after this task;
the plan's whole-tree sweep (task 6) expects that count unchanged. The note's
other mentions of `docs/superpowers/` — the absence-grep exclusion and the
lint ignores — are about the spec and plan directory, whose default this plan
keeps (fixed input 4), and are not touched. The README's list of past specs
under `docs/superpowers/specs/` names real files and is not touched either.

**Files:**

- Modify: `skills/tanto/README.md` — one passage, R1: the last sentence of
  the superpowers bullet in Prerequisites, re-wrapped because the new
  sentence is longer.
- Modify: `docs/notes/tanto-consistency-checks.md` — two passages, N1 (the
  second of "Two traps of this host", which now names both untracked trees)
  and N2 (the last sentence of the extraction paragraph under check 9).

**Interfaces:**

- Consumes, from tasks 1-4: nothing. No passage here quotes skill text; both
  files are read by people and by verification commands, never loaded by a
  session, so this task is independent of batch A's landing.
- Produces, for task 6: the final state of the only two files outside
  `skills/tanto/`'s session-loaded set that carry `.superpowers` — three
  lines, the same three, after the task as before it.
- markdownlint lints both files: `.markdownlint-cli2.yaml` ignores only
  `docs/superpowers/**` and the two template directories, so the lint step
  here is the real markdownlint, not just the whitespace hooks. Neither
  passage may add the string `skills/tanto/` anywhere but these two files
  (the note's own check 7), and neither does.

### Steps

- [ ] **Step 1: Baseline the line endings**

```bash
git ls-files --eol skills/tanto/README.md docs/notes/tanto-consistency-checks.md
```

Expected: `i/lf w/crlf attr/text=auto` on both, and never `w/mixed`. Write
every passage with CRLF.

- [ ] **Step 2: The README's superpowers bullet (R1)**

**A5.1** `skills/tanto/README.md` — `grep -cF 'invoke them directly. The SDD' skills/tanto/README.md` — before: 0, after: 1

**P5.1** `skills/tanto/README.md` — replace exactly these 2 lines

```text
  requesting-code-review. Sekkei and Jisso invoke them directly, and the SDD
  skill's `sdd-workspace` script owns `.superpowers/sdd/`.
```

**P5.1 →**

```text
  requesting-code-review. Sekkei and Jisso invoke them directly. The SDD
  skill's `sdd-workspace` script owns `.superpowers/sdd/`; tanto's own state
  lives under `.tanto/`, which it ignores and lint-silences itself, and the
  spec and the plan are wherever Kanri's orders line says, by default the
  superpowers convention.
```

The bullet's first two lines are untouched; the sentence that ends on
`requesting-code-review.` is reproduced so the replaced block starts at a
line boundary. The bullet's continuation indent of two spaces is kept on
every line.

- [ ] **Step 3: The second of the note's two traps (N1)**

**A5.2** `docs/notes/tanto-consistency-checks.md` — `grep -cF 'nothing under either has ever been committed' docs/notes/tanto-consistency-checks.md` — before: 0, after: 1

**P5.2** `docs/notes/tanto-consistency-checks.md` — replace exactly these 4 lines

```text
measurement script mid-run. And the SDD workspace under `.superpowers/sdd/` is
**untracked** — its `.gitignore` is `*`, nothing under it has ever been
committed — so the repository's "no commit hashes, no user-specific paths in
tracked content" rule does not bind a report or a ledger there. Two reviewers
```

**P5.2 →**

```text
measurement script mid-run. And the SDD workspace under `.superpowers/sdd/`
and tanto's own under `.tanto/` are **untracked** — each carries a
`.gitignore` of `*`, nothing under either has ever been committed — so the
repository's "no commit hashes, no user-specific paths in tracked content"
rule does not bind a report or a ledger there. Two reviewers
```

The paragraph is re-wrapped because the added clause moves every line's
break; the sentence about the shoroku write-out that follows `Two reviewers`
is unchanged. `.superpowers/sdd/` stays: the SDD workspace is still where
superpowers puts it, and the trap is now that there are two such trees.

- [ ] **Step 4: The extraction paragraph's last sentence (N2)**

**P5.3** `docs/notes/tanto-consistency-checks.md` — replace exactly these 2 lines

```text
And the editor's markdownlint reports on files under `.superpowers/` — a plan
draft, a brief — are advisory: the commit path ignores that directory.
```

**P5.3 →**

```text
And the editor's markdownlint reports on files under `.superpowers/` are
advisory: the commit path ignores that directory, and `.tanto/`, where a
brief or a draft now lives, carries its own configuration that turns every
rule off.
```

The examples the old sentence carried between dashes — a plan draft, a brief
— move into the new clause, because that is where such a file now sits. Bare
`.superpowers/` stays: the commit path still ignores it.

- [ ] **Step 5: Lint**

```bash
./scripts/lint.sh skills/tanto/README.md docs/notes/tanto-consistency-checks.md
```

Expected: exit 0, none `Failed`.

**This step runs before the Verify step below, not after.** markdownlint runs
with `--fix`, and a fix that rewrote a line inside a passage would leave
`passage-check verify` reading text the plan does not contain. If it fixes
anything, re-author the block it touched rather than leaving the file and the
plan disagreeing.

- [ ] **Step 6: Commit**

```bash
git commit --only skills/tanto/README.md docs/notes/tanto-consistency-checks.md -m "docs(tanto): point the README and the consistency note at .tanto/" -m "The README's superpowers bullet now says what sdd-workspace owns and what tanto owns, and the consistency note names both untracked trees and the configuration that silences the second one. Neither file is loaded by a session, so both land in batch B." -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

One commit for the task, covering both files, so the subject is the
skill-scoped one rather than `docs(notes): …`.

- [ ] **Step 7: Verify the trailer**

```bash
git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'
```

Expected: `1`.

- [ ] **Step 8: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-workspace.md --task 5
```

Expected: `task 5: verify clean`.

**Done when:** R1, N1 and N2 are present in their files with the three
`.superpowers` lines still there and still three, `A5.1` and `A5.2` each
count 1, `./scripts/lint.sh` is clean on both paths, and one commit carries
both files with its `Co-Authored-By:` trailer.

---

## Task 6: the whole-tree sweep, and the old values this plan contradicts

**Batch:** B. **Blocks:** O6.1 to O6.20.

This task **modifies no file**. Its deliverable is recorded output: the twenty
`O` needles at their stated dispositions with the hits printed, the scoped
absence sweep, the survivor counts, three of the consistency note's own checks
— 5 because `roles/jisso.md` is touched, and 6 and 7 whole because the note
requires a plan that schedules a subset of its checks to schedule the absence
checks — and the boundary sweep that backs the plan's claim about where a role
may be started. "It changed a tracked file" is its failure condition.

It runs last because it sweeps the tree task 5 finishes. Every command here is
also one of the boundary checks the plan's "How a batch is verified" section
numbers; this task is where their output is written down rather than glanced
at, and the batch report carries it verbatim.

**Files:**

- Modify: nothing.

**Interfaces:**

- Consumes, from tasks 1 to 5: every passage they land. The needles below are
  dispositions of *their* work, not of this task's.
- Produces: the recorded output the batch B report carries, and the numbers
  the dogfood record would use if T2 writes one.

### The old values this plan contradicts

Counts measured on `tanto-workspace` on 2026-09-12 with `grep -rcF` over
`skills/tanto` and `docs/notes/tanto-consistency-checks.md`, which is the sweep
set. Every count below reproduces the spec's own table exactly. The needle is
the entity's spelling, and the disposition says where it must be gone or why it
may stay.

The spec's table carries **twenty-seven** needles across its twenty-one rows —
five rows give more than one spelling of one entity. Twenty are `O` blocks
below. The other seven are checked in the two steps that follow the block list:
`.superpowers/sdd`, `plan-basename`, `docs/superpowers/specs/<`,
`docs/superpowers/plans/<` and `spec-phase record` in Step 4, because each
survives the plan inside the plan's own new passages, which is what `lint`'s
`needle-in-new-text` rule exists to forbid for a needle whose disposition is
"gone"; and `superpowers/sdd/.gitignore` and `path under docs/superpowers` in
Step 3, because both are substrings of one of those five and would meet the
same rule for no added coverage. Global Constraints gives the full reasoning
and names the option that would put all twenty-seven under the instrument.

**O6.1** `Move the ledger` — `roles/kanri.md` 1 (the plan-landing step 2). Gone by P2's rewrite of that step; nowhere else.

**O6.2** `Only the ledger moves` — `roles/kanri.md` 1, the sentence after it. Gone by the same passage.

**O6.3** `moves it to` — `SKILL.md` 1, the paragraph on where the conductor ledger starts. Gone by P1.9. Nowhere else.

**O6.4** `after the ledger moves` — `roles/kanri.md` 1 (the spec-inputs paragraph), `templates/kanri.md` 1 (the Topic directory line). Gone by the task 2 and task 4 passages at those two sites.

**O6.5** `ledger moved` — `templates/roster.md` 1, the Events example line. Gone by the task 4 passage.

**O6.6** `ledger move` — 5 in all: `roles/kanri.md` 2, `SKILL.md` 1, `templates/kanri.md` 1, `templates/roster.md` 1. The substring of O6.2, O6.4 and O6.5 plus `SKILL.md`'s own "ledger moves" sentence; all five gone. The roster's Events history under `.tanto/roster.md` keeps the phrase in past lines, and that file is untracked and not in the sweep set.

**O6.7** `next to Jisso's own` — `templates/kanri.md` 1, the opening paragraph. Gone by the task 4 passage. This is the sentence that put tanto's state beside superpowers' in the first place.

**O6.8** `topic directory beside it` — `roles/jisso.md` 1 (the SDD Finish row), `roles/kanri.md` 1 (the session-lifecycle paragraph). Gone by P3.12 and the task 2 passage. Two files, two roles, one rule — the reason both are in batch A.

**O6.9** `topic directory for Sekkei` — `SKILL.md` 3 (three Artifacts rows), `roles/kanri.md` 1 (a peer's exit, step 1). Gone: after this plan Sekkei's files and Jisso's are in the same directory, so the qualifier has nothing to qualify.

**O6.10** `or the topic directory` — the same four lines as O6.9, reached by the shorter spelling in case a row is reworded rather than replaced. Gone.

**O6.11** `in the workspace` — `roles/jisso.md` 3: the boundary step 1, the T2 Propose paragraph, and the exit paragraph. Gone by P3.11, P3.13 and P3.14. `roles/jisso.md`'s "this plan's workspace" in step 2 is a different phrase and is not a hit.

**O6.12** `when it runs first` — `SKILL.md` 1, the `.gitignore` row of the Artifacts table. Gone by P1.8: tanto never writes under `.superpowers/` any more, so it never runs first for that file.

**O6.13** `only running first` — `roles/kanri.md` 1, start step 2. Gone by the task 2 passage, the same fact said in the other file's words.

**O6.14** `supplies the intake's address` — `SKILL.md` 1, the bug-report paragraph. Gone by P1.6: the address is read from the roster, not relayed.

**O6.15** `human's to supply` — `roles/kanri.md` 1, the Intake section. Gone by the task 2 passage.

**O6.16** `ask the human for the intake address` — `roles/kanri.md` 1, "Reporting from the other side". Gone by the task 2 passage. The three needles O6.14 to O6.16 are one entity — who supplies the intake's address — spelled three ways in two files, which is why each is swept separately.

**O6.17** `or leave it as a file for the human` — `roles/kaiseki.md` 1, the standalone paragraph. Gone by P3.8. The shorter `the address the human gives` wraps across two lines there and measures 0, so it is not the needle.

**O6.18** `after the move` — `templates/kanri.md` 1, the ledger template's H1. Gone by the task 4 title passage: there is no move.

**O6.19** `under the existing` — `roles/kanri.md` 1, the Intake's first paragraph, where `inbox/` was created under a `.gitignore` that was superpowers'. Gone by the task 2 passage.

**O6.20** `There are eleven` — `SKILL.md` 1. **Stays at 1.** This is the guard that no template was added or removed: the plan rewrites nine template bodies and touches neither `templates/kaiseki-report.md` nor `templates/tanto.json`, so the sentence that counts them must still say eleven.

`superpowers/sdd/.gitignore` and `path under docs/superpowers` are covered by
the absence sweep of Step 3 rather than as needles of their own: both are
substrings of `.superpowers/sdd` and `docs/superpowers/` respectively, whose
counted allowlists Verification 5 pins, and writing them as `O` blocks would
run into the same `needle-in-new-text` rule for no added coverage. Their
measured values, 2026-09-12: `superpowers/sdd/.gitignore` 6 lines
(`roles/kanri.md` 2, `roles/kaiseki.md` 1, `SKILL.md` 1,
`templates/kanri-handover.md` 1, `templates/review-brief.md` 1), all gone;
`path under docs/superpowers` 5 lines (`templates/batch-prompt.md` 2,
`templates/batch-report.md` 1, `templates/kanri.md` 2), all gone. Step 3 prints
both.

### Steps

- [ ] **Step 1: The boundary sweep — no batch A passage forward-references batch B**

The plan claims batch A's boundary is safe for a role start or replacement.
That claim is swept, not asserted: grep this plan's own new-passage text for
the terms batch B lands. The term list is **chosen, not exhaustive** —
`README`, `consistency`, `Two traps`, and `carries its own configuration` — and
it is chosen from the three things batch B actually writes: the README's
`sdd-workspace` sentence (R1) and the note's two sentences (N1, N2). A term
such as `note` or `untracked` would match batch A text that has nothing to do
with batch B and would turn the check into noise.

The subject is the plan's own **new-passage text**, not its prose: what a
session reads at that boundary is the text the passages land, and the plan's
commentary about the note is not something any file will carry. The `awk`
extracts every `P1.*` to `P4.*` new block and nothing else.

```bash
NEW=$(awk '/^## Task 5:/{exit} /^\*\*P[1-4]\.[0-9]+ →\*\*$/{f=1;next} f&&/^```/{if(inb){inb=0;f=0}else{inb=1};next} inb{print}' docs/superpowers/plans/2026-09-12-tanto-workspace.md) && printf '%s\n' "$NEW" | wc -l && printf '%s\n' "$NEW" | grep -cE 'README|consistency|Two traps|carries its own configuration'
```

Expected: `232`, then `0` — 232 lines across the 68 new-passage blocks of tasks
1 to 4 (measured 2026-09-12), and no hit. Tasks 1 to
4 write only `SKILL.md`, the four role files and the nine templates, and none
of that text names the README or the note, so a session started at batch A's
boundary is not pointed at a file that still says something else. `grep -c`
with no match exits 1, which is the pass here; record the count, not the exit
status.

- [ ] **Step 2: The tree is untouched by this task**

```bash
git status --short
```

Expected: no output. This task modifies nothing; a tracked file changed by it
is its failure condition.

- [ ] **Step 3: The scoped absence sweep, with the lines printed**

```bash
grep -rn '\.superpowers/sdd' skills/tanto docs/notes/tanto-consistency-checks.md | grep -v 'sdd/<plan-basename>/'
```

Three lines, and only these three: `SKILL.md`'s paragraph on where the
conductor ledger lives, `skills/tanto/README.md`'s superpowers bullet, and the
note's "Two traps" sentence. Each is placed against the allowlist of the spec's
section 3; a line not on it is a defect. Record all three verbatim.

```bash
grep -rn 'plan-basename' skills/tanto docs/notes/tanto-consistency-checks.md | grep -v 'sdd/<plan-basename>/'
```

One line: the note's own prose about the SDD workspace. And the two spellings
the map removes entirely:

```bash
grep -rn 'superpowers/sdd/\.gitignore' skills/tanto ; grep -rn 'path under docs/superpowers' skills/tanto
```

Expected: no output from either.

- [ ] **Step 4: The survivor counts**

```bash
grep -rcF '.superpowers/sdd' skills/tanto docs/notes/tanto-consistency-checks.md | grep -v ':0$'
```

Expected, as Verification 5 states them: `SKILL.md` 3, `roles/kanri.md` 2,
`templates/batch-prompt.md` 1, `templates/batch-report.md` 1,
`templates/kaiseki-brief.md` 1, `templates/kanri.md` 1, `README.md` 1, the note
1 — eleven lines over eight files, and nothing from `roles/sekkei.md`,
`roles/kaiseki.md`, `roles/jisso.md` or the other six templates.

```bash
grep -rcF 'plan-basename' skills/tanto docs/notes/tanto-consistency-checks.md | grep -v ':0$'
```

Expected: the same eight files less `README.md`, with `SKILL.md` at 2.

```bash
grep -rcF 'docs/superpowers/specs/<' skills/tanto ; grep -rcF 'docs/superpowers/plans/<' skills/tanto ; grep -rcF 'spec-phase record' skills/tanto
```

Expected: `SKILL.md` 1 and `roles/sekkei.md` 1 for each of the first two, every
one now preceded by "by default"; `roles/kanri.md` 1 and `SKILL.md` 0 for the
third.

- [ ] **Step 5: The twenty `O` needles, hits printed**

```bash
for n in 'Move the ledger' 'Only the ledger moves' 'moves it to' 'after the ledger moves' 'ledger moved' 'ledger move' "next to Jisso's own" 'topic directory beside it' 'topic directory for Sekkei' 'or the topic directory' 'in the workspace' 'when it runs first' 'only running first' "supplies the intake's address" "human's to supply" 'ask the human for the intake address' 'or leave it as a file for the human' 'after the move' 'under the existing' 'There are eleven'; do printf '== %s\n' "$n"; grep -rnF -- "$n" skills/tanto docs/notes/tanto-consistency-checks.md; done
```

Expected: one `==` line per needle with **nothing under it**, except the last,
`There are eleven`, which prints its single `SKILL.md` line. The hits are
printed rather than counted on purpose: a qualifier such as "outside the
passages" is not what the command returns, and a needle that wraps in its
target returns nothing, which reads the same as "already gone". Every needle
above was measured non-zero on this branch before the plan ran, and the
per-needle values are in the block list.

- [ ] **Step 6: The instrument's own tests still pass**

```bash
node --test skills/tanto/scripts/
```

Expected: every test passes. No task of this plan touches
`skills/tanto/scripts/`; this is the check that says so from the other side.
Record the Node version the run resolved.

- [ ] **Step 7: The two pinned quotes, because `roles/jisso.md` was touched**

```bash
SP="$HOME/.claude/plugins/cache/claude-plugins-official/superpowers/6.3.0/skills" && grep -cF 'that norms say you ask about first (a merge, a push to a shared branch, a' "$SP/subagent-driven-development/SKILL.md" skills/tanto/roles/jisso.md skills/tanto/SKILL.md && grep -cF 'Implementer subagents report one of four statuses. Handle each appropriately:' "$SP/subagent-driven-development/SKILL.md" skills/tanto/roles/jisso.md
```

Expected: `1` on all five lines (the note's check 5). If the superpowers cache
is at a different version on this machine, record the path that was read; the
two in-repo greps are the part of the check this plan can fail.

- [ ] **Step 8: The note's absence checks, whole**

`docs/notes/tanto-consistency-checks.md` says that a plan which schedules only
a subset of its checks **must still schedule the absence checks**, because an
absence check is the one kind a new passage breaks by adding text rather than
by omitting it — and it names a plan that broke check 7 without ever running
it. So this step runs check 7 entire, and it runs it **out of the note itself**
rather than from a copy pasted here, so that the command list cannot drift from
the note the way a copy would:

```bash
sed -n '/^## 7\. The strings that must be absent/,/^Expected: no output from the first nine/p' docs/notes/tanto-consistency-checks.md | sed -n '/^```bash/,/^```$/p' | grep -v '^```' | bash
```

Expected: no output at all. The nine absence greps are silent, and the tenth —
the hash-shaped-token grep, which the note says is read rather than counted —
was silent too when measured on 2026-09-12, before and after. The ninth line,
`grep -rn 'skills/tanto/' …`, is the one this plan could most easily break:
runtime text in the skill is skill-relative, and only the skill's `README.md`
and the note may name that path.

- [ ] **Step 9: The note's routing strings**

Check 6 pins each copy of a cross-role line by its own full string, so that a
drift between copies is loud. This plan rewrites text around several of them,
so the check is scheduled here too, extracted from the note the same way:

```bash
sed -n '/^## 6\. The strings the roles route on/,/^Expected, one number per line/p' docs/notes/tanto-consistency-checks.md | sed -n '/^```bash/,/^```$/p' | grep -v '^```' | bash | tr '\n' ' '
```

Expected: 2 1 1 3 1 1 1 1 5 3 1 1 1 1 1 1 1 1 1 1 3 1 1 1 1 1 1 1 1 1 1 1

Those are the note's own thirty-two expected values, and this plan changes none
of them: measured identical on the working tree and on the dry run's applied
tree, 2026-09-12. One thing the check does **not** cover, and which this plan
makes true: `bug-report: <absolute path>` stands at three copies today
(`SKILL.md`, `roles/kanri.md`, `templates/bug-report.md`) of which check 6 pins
two, and `P3.8` adds a fourth in `roles/kaiseki.md`. Extending check 6 is the
note's own business and the spec's Deferred item 2 gives it to Kanri at T2; a
`4` where this step expects a number is not that, and is a real failure.

- [ ] **Step 10: Line endings across every path the plan touched**

```bash
git ls-files --eol skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/kanri.md skills/tanto/roles/sekkei.md skills/tanto/roles/jisso.md skills/tanto/roles/kaiseki.md skills/tanto/templates/batch-prompt.md skills/tanto/templates/batch-report.md skills/tanto/templates/bug-report.md skills/tanto/templates/kaiseki-brief.md skills/tanto/templates/kanri-handover.md skills/tanto/templates/kanri.md skills/tanto/templates/review-brief.md skills/tanto/templates/roster-archive.md skills/tanto/templates/roster.md docs/notes/tanto-consistency-checks.md
```

Expected: `i/lf w/crlf attr/text=auto` on all sixteen, and never `w/mixed`.

- [ ] **Step 11: `.tanto/` is where the text now says it is**

```bash
ls -a .tanto/ && git status --short .tanto/ && ls .superpowers/sdd/roster.md
```

Expected: `.tanto/` holds `.gitignore`, `.markdownlint-cli2.yaml`, `roster.md`,
`roster-archive.md`, `inbox/`, the `exit-kanri-*-proposal.md` files and
`tanto-workspace/`; `git status --short .tanto/` prints nothing; and the last
command reports no such file. This checks Kanri's transition directive, which
ran at batch A's boundary — not a task's commit. Record the listing.

- [ ] **Step 12: Verify**

```bash
TANTO=skills/tanto && node "$TANTO/scripts/passage-check.js" verify --plan docs/superpowers/plans/2026-09-12-tanto-workspace.md --task 6
```

Expected: `task 6: no passages`. This task carries only `O` blocks, which
`verify` does not read — `replay` sweeps them against the applied tree and Step
5 sweeps them against the real one. The invocation is here so that the task's
shape is the same as every other task's, and so that a future `P` block added
to it is checked without anyone remembering to add the step.

**Done when:** Step 1 prints `232` and then `0`, Step 2 shows a clean tree,
Steps 3 and 4 reproduce the counts stated above line for line, Step 5 prints
nothing under nineteen of the twenty needles and one `SKILL.md` line under
`There are eleven`, Steps 6 to 10 pass at their stated values — Step 8 silent,
Step 9 at the note's thirty-two numbers — Step 11 shows `.tanto/` populated and
`.superpowers/sdd/roster.md` gone, Step 12 prints `task 6: no passages`, and
the batch report carries every one of those outputs verbatim.

---

## Self-Review

**Sizes**, measured on this document, 2026-09-12.

| Task | Lines | Steps | Blocks |
| --- | --- | --- | --- |
| 1 | 402 | 16 | 12 |
| 2 | 556 | 28 | 24 |
| 3 | 404 | 19 | 17 |
| 4 | 515 | 25 | 29 |
| 5 | 185 | 8 | 5 |
| 6 | 263 | 11 | 20 |

**The largest task is task 2, at 556 lines and 28 steps**, and it is one task
rather than two because it is one file: `roles/kanri.md`'s twenty-three
passages are twenty-three sites in one procedure, and a cut through them would
put half of Kanri's text on `.tanto/` and half on `.superpowers/sdd/` at a
boundary where a Kanri may be replaced. **Task 4 has the most blocks, 29**
(twenty passages and nine anchors) across nine files, and its 515 lines are
almost entirely quoted template text, which is a different kind of length from
task 2's. Both numbers are recorded rather than judged: issue-7281 asks for the
sizes until a threshold can be chosen.

Task 2 is also the one place where the file-per-task cut and the "three or four
tasks to a batch" rule pull against each other. The alternative — splitting
`roles/kanri.md` into a start-and-topic half and an intake-and-exit half — was
rejected on the boundary argument above, not on size.

**One task is a sweep-and-check shape**, task 6: its deliverable is recorded
output rather than a file, it modifies nothing, and "it changed a tracked file"
is its failure condition. That shape inverts the reviewer's standing
instruction, so its dispatch says the reviewer **re-runs** the commands rather
than reading the report. The context-cost run measured the shape at 1.93× the
median implementer and 1.39× the median reviewer; expect it to cost more than
its 263 lines suggest.

**What this plan does not carry.** No task creates a file. No task touches
`skills/tanto/scripts/`, `templates/kaiseki-report.md`, `templates/tanto.json`,
the repository's `.gitignore` or `.markdownlint-cli2.yaml`, or any document
under `docs/` other than `docs/notes/tanto-consistency-checks.md` — the
requirement bullet, the design-4807 sections and the ADR of the spec's input 10
are T1's and T2's. Report and prompt skeletons are the tanto templates'; this
plan names nothing else about them.

**One tension inside the spec, resolved the only way it can be.** The spec's
"What the plan must contain" item 5 asks for "a `verify` step per task as one
invocation of the instrument; no hand-written greps in a task", and its item 2
puts "the whole-tree absence sweep with its recorded output" in batch B as a
task. A sweep task *is* hand-written greps: that is its deliverable. So tasks 1
to 5 carry no hand-written grep at all — their only check is the single
`verify` invocation — and task 6 carries nothing but greps, plus the `verify`
invocation kept for shape. The rule holds where it was aimed: at a passage task
re-deriving by hand what the blocks already determine (issue-f813).

**Three deviations from the spec's literal instruction, all deliberate and all
stated where they apply.**

1. **Seven of the spec's twenty-seven old-value needles are not `O` blocks.**
   The spec's table has twenty-one rows and twenty-seven needles, because five
   rows give more than one spelling of one entity. Twenty are `O` blocks in
   task 6. Five — `.superpowers/sdd`, `plan-basename`,
   `docs/superpowers/specs/<`, `docs/superpowers/plans/<` and
   `spec-phase record` — survive the plan inside the plan's own new passages,
   which `lint`'s `needle-in-new-text` rule forbids for a needle whose
   disposition is "gone", and are counted instead by Verification 5 and task 6
   Step 4. The last two — `superpowers/sdd/.gitignore` and
   `path under docs/superpowers` — are substrings of two of those five and are
   grepped for absence in task 6 Step 3. Every needle is checked; three
   mechanisms, not one. Global Constraints gives the reasoning and names the
   better option that is out of scope here: a survivor form for an `O` block,
   which would need a change to `skills/tanto/scripts/passage-check.js` that no
   task of this plan makes.
2. **All twenty `O` blocks sit after the passages, not before them.** The spec
   and `roles/sekkei.md` both say the `O` rows are written before the passages.
   That rule is about **authoring order** — sweep the files the plan does not
   touch first, so a needle is not invented from the new text — and it was
   followed: the counts in task 6's block list were measured on the tree before
   a line of the plan was written, and every one reproduces the spec's own
   table. The **document** order is different, and it is deliberate: an `O`
   block is resolved by `passage-check.js` only under a `### Task <n>` heading,
   so a "section before the passages" would have to be a task of its own, and
   task 6 is the task that runs the sweep those blocks describe. This is the
   shape `docs/superpowers/plans/2026-09-10-tanto-sweep.md` used for the same
   reason, with its own task 14.
3. **`diff`'s base is not the merge base** but the parent of task 1's first
   commit, derived rather than written as a hash, because the branch already
   carries the spec and an exit-shoroku commit that no block of this plan
   quotes. Global Constraints gives the derivation, the guard against `main`
   moving under it, the one class of line that will legitimately appear in
   `diff`'s output anyway, and the `created:` option that was weighed and not
   taken.

**The dry run.** `lint` is clean. `replay` against the merge base applies all
seventy-one passages with every old block occurring exactly once, re-runs all
sixteen anchors at their stated `after: 1`, and sweeps the twenty `O` needles:
nineteen at `0` and `There are eleven` at `1`, exactly as the block list
states. The applied tree reproduces the post-plan counts of Verification 5 file
for file. `.superpowers/sdd/tanto-workspace/plan-dryrun.md` carries the two
commands, their output, and a ruling on every line `replay` reported as
`DIFFERS` — all of which are the crude-comparison artifact of a prose
`Expected:` paragraph against multi-line output, or a command that reads
something the applied tree does not have.
