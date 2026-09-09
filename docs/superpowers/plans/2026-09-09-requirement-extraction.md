# requirement-extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Teach the docs system that a stated need is a requirement even when
the system does not meet it yet, and that a design names the requirement it
serves — in kisou's four `docs/` templates, in `skills/shoroku/SKILL.md`, and
in this repository's four installed copies. No `skills/tanto/` file changes.

**Architecture:** Markdown only, and every edit is a **passage**, never a
file. Six passages go into the four templates kisou installs — the
`## requirements vs issues` section with the rule and its two tests, the exit
from the issue definition, the rewritten Classify and Propose steps, and the
two pairing bullets — and one paragraph goes into `skills/shoroku/SKILL.md`.
For each passage the task carries the anchor, the old passage verbatim from the
tree where the shape is a replacement, and the new passage verbatim from the
spec, and changes no other byte, so the diff of a touched file against the
merge base is exactly the union of its passages so far. The four installed
copies under `docs/` receive the same six passages with the `{{…}}` variables
expanded, through a run of kisou's own refresh path, with the passages
hand-mirrored where the refresh misses. There is no executable code.

**Tech Stack:** Markdown; `pre-commit` through `scripts/lint.sh` and
`scripts\lint.bat`; the pre-commit cache's `markdownlint-cli2` for the
markdownlint-exempt templates, on scratch copies; `git diff` against the merge
base, `git ls-files --eol`, `grep -cF` with every needle set from a quoted
heredoc, `sed` plus `diff --strip-trailing-cr` for the expanded-template diff;
`uv run --no-project` with PyYAML for the `SKILL.md` frontmatter load; the
`kisou` skill in migrate mode for Task 3.

**Spec:** `docs/superpowers/specs/2026-09-09-requirement-extraction-design.md`
— the binding authority. This plan argues from it; where the plan and the spec
disagree, the spec wins, and executors read both. The spec's sections "The rule
and the two tests", "The pairing", "shoroku", "This repository's copies: the
refresh run", "Where each change lives", "What the plan must contain", and
"Verification" are what the four tasks below implement. Branch
`requirement-extraction`, cut from `main` after review-brief merges; **no
worktree**; **no push**.

## Global Constraints

- American English in every file, commit message, and comment.
- Every fenced `bash` block in this plan runs in **Git Bash**, from the
  repository root — on this Windows host, not PowerShell. Only the lint line
  has a `scripts\lint.bat` alternative; the greps, the `sed` pipelines, the
  quoted heredocs, and `diff --strip-trailing-cr` have none.
- Lint before every commit: `./scripts/lint.sh <explicit file paths>`
  (Windows: `scripts\lint.bat <paths>`), every hook `Passed` or `Skipped`; a
  directory argument makes every hook skip, so always name files.
  `.markdownlint-cli2.yaml` ignores `skills/**/templates/**`, so on the four
  kisou templates the lint runs only the whitespace, final-newline,
  line-ending, and frontmatter hooks; markdownlint binds on the four installed
  copies under `docs/` and on `skills/shoroku/SKILL.md`. Task 1 therefore
  lints the template passages on scratch copies, the way
  `docs/notes/tanto-consistency-checks.md` item 5 prescribes, at paths the
  configuration does not ignore.
- Commit by explicit path only: `git add <paths>` (no new file in this plan)
  then `git commit --only <paths> -m "<subject>" -m "<body>" -m "Co-Authored-By: Claude <noreply@anthropic.com>"`.
  Never `git add -A` / `.` / `-u`, never a bare `git commit` or
  `git commit -a`, never `--no-verify`, never amend. Branch
  `requirement-extraction`, cut from `main` after review-brief merged;
  **no worktree**; **no push**.
- Every commit message ends with a trailer whose line begins
  `Co-Authored-By: Claude` — verify with
  `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'` (expect `1`).
- Models for this run: implementers `sonnet`, every reviewer `opus`,
  fix-round escalation `opus`; never dispatch a subagent on `fable`; every
  dispatch names its `model`.
- **Rule 11 does not apply.** No file the run's sessions load is edited —
  nothing under `skills/tanto/` changes — so the authority for the sessions
  is the skill on disk as always, and **a role may be started or replaced at
  any boundary**; the single batch A boundary is also the final one. The plan
  expects one Jisso throughout.
- **Never edit**: anything under `skills/tanto/`; the repo-root Markdown
  (`README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `CLAUDE.md`); linter or
  formatter config; the superpowers plugin; `skills/kisou/SKILL.md` and every
  kisou template other than the four under `skills/kisou/templates/docs/`
  this plan names; anything under `docs/` other than the four installed
  copies `docs/AGENTS.md`, `docs/requirements/AGENTS.md`,
  `docs/issues/AGENTS.md`, `docs/design/AGENTS.md` — in particular no entry
  file under `docs/requirements/`, `docs/design/`, `docs/decisions/`,
  `docs/issues/`, `docs/notes/`, or `docs/reports/`.
- **The four installed copies are the plan's to edit.** They are the docs
  system's own rule files, installed by kisou and refreshed by kisou in
  Task 3; they are not the repo-root agent instruction files the repository's
  `AGENTS.md` protects, and the human's OK on this plan, given through the
  review brief, is the approval for exactly the passages the spec quotes for
  them. Any other change to them is a Rulings-needed item.
- **The write-out exception.** T1, T2, and every exit shoroku write under
  `docs/requirements/`, `docs/design/`, `docs/decisions/`, and `docs/issues/`.
  No task touches those paths, and "never edit" above does not forbid a
  session's own shoroku write-out.
- **The hotfix lane stays closed on the files this plan lists**
  (decision-2f36): a defect noticed in one of them during the run is a
  Rulings-needed item in the report, not a hotfix.
- **The whole-branch review package excludes** exactly the commits whose
  subject begins `docs: T<n> shoroku` or `docs: exit shoroku`; Kanri's own
  `docs(issues):` commits on the branch, if any, are outside the plan's scope
  and the dispatch names them by subject.
- **Passages, not files.** A task replaces exactly the old passage with the
  new one, or inserts the new passage next to its anchor, and the file's
  other bytes do not change. The diff of a file against the merge base —
  `git diff "$(git merge-base main HEAD)" -- <file>`, which sees the working
  tree and so is right before and after a task's commit — is exactly its
  passages so far. A fix outside a passage is a Rulings-needed item.
- **Needles from heredocs.** Every anchor and passage check sets its needle
  with `needle=$(cat <<'EOF'` … `EOF)` and passes it as `"$needle"`; a needle
  is never inlined in quotes. A flattened `grep -cF` (CR stripped, lines
  joined, spaces squeezed) returns `0` or `1` and pins presence; a raw
  `grep -cF` on the file counts lines.
- **Line endings per file, never mixed.** `git ls-files --eol <file>` before
  each edit says which ending the file has in this working tree (the four
  templates and the four copies are `w/crlf`, `skills/shoroku/SKILL.md` too —
  the task confirms); a passage is written with that ending; after the edit
  the same command shows the same value, never `w/mixed`. The index is LF
  (`* text=auto`), so the "LF will be replaced by CRLF" warning at commit is
  not a defect. Git Bash's `sed` and `grep` strip CR on input and `diff` does
  not, which is why the expanded-template diff carries
  `--strip-trailing-cr`.
- **The refresh run's standing-in rule (Task 3).** The implementer runs the
  `kisou` skill in migrate mode with docs-only scope on this repository and
  answers kisou's prompts in the user's place, under this constraint and the
  batch prompt: it confirms the detected values; **declines** the
  scripts-intent prompt for every slot offered (`setup`, `run`, `build`,
  `test`, and `tidy` if kisou offers it); **accepts** every refresh item that touches the four
  installed copies; **rejects** any offer to rename one of them to `.bak` and
  write a fresh file, and any other offer (a `notes/` or `reports/` create, a
  layer-B change); **stops before kisou's commit step** and commits nothing
  through kisou — Jisso commits at the task boundary by explicit path. It
  records kisou's numbered proposal verbatim and the outcome of each of the
  spec's four points in its report. The expanded-template diff decides the
  outcome: where it is not `identical`, the implementer applies the missing
  passage by hand (variables expanded) from the spec, re-runs the diff, and
  the report names the passage as a finding against kisou. No `.bak` file is
  left in the tree.
- **`skills/shoroku/SKILL.md`'s frontmatter is unchanged** — `name: shoroku`
  and a `description` with no colon followed by a space; the
  `check-md-frontmatter` hook parses it, and Task 2 loads it through PyYAML:
  `uv run --no-project --with pyyaml python -c "import yaml,io; t=io.open('skills/shoroku/SKILL.md',encoding='utf-8').read().split('---')[1]; print(yaml.safe_load(t)['name'])"`
  — prints `shoroku`.
- **No heading of a fixed section is renamed** in any kisou template; the one
  heading this plan adds is `## requirements vs issues`, literal lowercase like
  its sibling `## design vs decisions`. kisou's refresh identifies sections by
  heading.
- `docs/` and `docs/<type>/` in the templates are written `{{docs}}`,
  `{{requirements}}`, `{{design}}`, `{{decisions}}`, `{{issues}}`; the
  installed copies carry `docs`, `requirements`, `design`, `decisions`,
  `issues`. A passage for a copy is the template passage with exactly that
  expansion and nothing else changed.
- No commit hashes and no user-specific paths in tracked content.

---

## File structure

Nine files carry a passage — the four kisou templates, `skills/shoroku/SKILL.md`,
and the four installed copies under `docs/` — two more carry a drift check, and
four more are read-only inputs.
Each passage's shape is the spec's, from "Where each change lives": a
**replacement** supersedes the old passage; an **insertion** adds text next to
an anchor that stays. The kisou templates use `{{docs}}`, `{{requirements}}`,
`{{design}}`, `{{decisions}}`, and `{{issues}}` for the directory names; the
installed copies under `docs/` carry the same text with those variables
expanded. Line endings are not tabulated — they are an artifact of this working
tree; each task reads `git ls-files --eol` before its first edit and expects
the same value after.

| File | Passages | Task |
| --- | --- | --- |
| `skills/kisou/templates/docs/requirements/AGENTS.md` | P1.1 `## Body`, one bullet after "State the wish and the why …" (insertion); P1.2 the `## requirements vs issues` section between `## Body` and `## Growth` (insertion) | 1 |
| `skills/kisou/templates/docs/issues/AGENTS.md` | P1.3 one paragraph after the opening paragraph, before `## Lifecycle (by directory)` (insertion) | 1 |
| `skills/kisou/templates/docs/AGENTS.md` | P1.4 step 2 of "Session shoroku (excerpting)" (replacement); P1.5 step 3 of the same section (replacement) | 1 |
| `skills/kisou/templates/docs/design/AGENTS.md` | P1.6 `## Body`, one bullet after "Link to a recorded choice with `decision-<id>` where relevant." (insertion) | 1 |
| `skills/shoroku/SKILL.md` | P2.1 Step 3, one paragraph after the paragraph ending "commit hash." and before "Parse direction flexibly:" (insertion) | 2 |
| `skills/shoroku/README.md` | drift check against P2.1 only; **no change expected** | 2 |
| `skills/kisou/README.md` | drift check against P1.1 to P1.6 and the refresh path only; **no change expected** | 2 |
| `docs/AGENTS.md`, `docs/requirements/AGENTS.md`, `docs/issues/AGENTS.md`, `docs/design/AGENTS.md` | the same six passages, variables expanded, through `kisou migrate` docs-only; hand-mirrored where the refresh misses | 3 |

Read-only inputs, never edited by any task: `skills/kisou/SKILL.md` (Step 3
(migrate) is the procedure task 3 follows), `.markdownlint-cli2.yaml`,
`scripts/lint.sh`, and `docs/notes/tanto-consistency-checks.md` (item 5 is the
scratch-lint method task 1 uses).

Task 4 creates no file and edits none: it is the whole-tree sweep, a
**verification-only task** in the sense `skills/tanto/roles/jisso.md` defines,
whose deliverable is the recorded output of its checks. Its dispatch tells the
reviewer to **re-run** the checks rather than trust the report.

**Files that must NOT change.**

- Everything under `skills/tanto/` — the spec's Out of scope, checked in task 4
  by `git diff --name-only "$(git merge-base main HEAD)" -- skills/tanto`,
  which must print nothing.
- Everything under `docs/` outside the four installed copies above. In
  particular `docs/requirements/3c4d-shoroku.md`, `docs/design/e3f4-shoroku.md`,
  and `docs/design/c1d2-kisou.md` are T1's and T2's to update, not the plan's,
  and `docs/notes/tanto-consistency-checks.md`, `docs/issues/**`,
  `docs/decisions/**`, `docs/reports/**`, and `docs/superpowers/**` are
  untouched by every task. The one exception the repository's `AGENTS.md`
  already allows is a session's own shoroku write-out, which is not a task
  here.
- Repo-root Markdown (`README.md`, `AGENTS.md`, `CLAUDE.md`,
  `CONTRIBUTING.md`), linter and formatter configuration, the superpowers
  plugin, and `skills/kisou/SKILL.md`.

The four installed copies under `docs/` are not repo-root Markdown and are not
agent instruction files in the sense of the repository's "never edit" rule:
they are the docs system's own installed files, which kisou's refresh path
edits by design and which task 3 edits on that path. Every byte they receive is
verbatim in the spec and in this plan.

---

### Task 1: the four kisou templates — the rule, the exit, the two steps, the pairing

**Files:**

- Modify: `skills/kisou/templates/docs/requirements/AGENTS.md` — two passages,
  P1.1 and P1.2, both **insertions**.
- Modify: `skills/kisou/templates/docs/issues/AGENTS.md` — one passage, P1.3,
  an **insertion**.
- Modify: `skills/kisou/templates/docs/AGENTS.md` — two passages, P1.4 and
  P1.5, both **replacements**.
- Modify: `skills/kisou/templates/docs/design/AGENTS.md` — one passage, P1.6,
  an **insertion**.

**Interfaces:**

- Consumes: nothing. The tree as it stands on the branch.
- Produces: the six passages task 3 mirrors into this repository's four
  installed copies, with `{{docs}}` → `docs`, `{{requirements}}` →
  `requirements`, `{{design}}` → `design`, `{{issues}}` → `issues`. Task 3's
  expanded-template diff is what decides that the mirror is exact, so no byte
  written here may be re-wrapped there. Task 2's shoroku paragraph names two
  things these passages define — the section title `requirements vs issues`
  and "the Propose step" — so their wording is what makes that sentence
  resolve.
- All four files live under `skills/**/templates/**`, which
  `.markdownlint-cli2.yaml` ignores, so `./scripts/lint.sh` will not
  markdownlint them; step 20 lints their expansion in a scratch tree instead,
  the method `docs/notes/tanto-consistency-checks.md` item 5 prescribes. The
  trailing-whitespace, end-of-file, mixed-line-ending, and frontmatter hooks
  still apply to the real paths.
- The templates may carry bare `<...>` blanks — `<id>`, `<slug>`, `<status>`
  — and the new passages carry `req-<id>` and `design-<id>` inside code spans,
  as the surrounding text already does.

**The needle form, used in every anchor and passage check of this plan.** Every
check sets its needle with a quoted heredoc and passes it as `"$needle"`; a
needle is never inlined in single or double quotes, because nearly every
passage contains an apostrophe, a backtick, or a double quote. A **raw** check
greps the file as it is — `grep -cF -- "$needle" <file>` — and counts lines, so
it pins a phrase that stays on one line. A **flattened** check strips CR, joins
the lines with spaces, and squeezes the runs —
`tr -d '\r' < <file> | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"` — so it
pins a passage that wraps, and it returns `0` or `1`, never an occurrence
count. The needle of a flattened check is written as one physical line inside
the heredoc. Every fenced `bash` block in this plan runs in **Git Bash**, from
the repository root, on this Windows host — not PowerShell.

- [ ] **Step 1: Read the four files' line endings, before the first edit**

````bash
git ls-files --eol skills/kisou/templates/docs/AGENTS.md skills/kisou/templates/docs/requirements/AGENTS.md skills/kisou/templates/docs/issues/AGENTS.md skills/kisou/templates/docs/design/AGENTS.md
````

Expected: `i/lf    w/crlf  attr/text=auto` for each of the four. Measured
2026-09-09. Every passage below is written **CRLF**, the ending the file has in
this working tree.

- [ ] **Step 2: Verify the P1.1 anchor, before the edit**

Anchor — the last two current lines of `## Body` in
`skills/kisou/templates/docs/requirements/AGENTS.md`, which stay exactly as
they are. The new bullet goes **after** them.

````markdown
- State the wish and the why. Keep it about user-visible behavior and intent,
  not implementation.
````

Run:

````bash
needle=$(cat <<'EOF'
- State the wish and the why. Keep it about user-visible behavior and intent,
EOF
)
grep -cF -- "$needle" skills/kisou/templates/docs/requirements/AGENTS.md
````

Expected: `1`

- [ ] **Step 3: P1.1 — insert the requirements Body bullet**

This is an **insertion**: the new bullet becomes the last bullet of `## Body`,
immediately after the anchor's second line `  not implementation.`, with no
blank line between them. The blank line that follows and the `## requirements
vs issues` heading P1.2 puts there stay separated by it.

New passage — the spec's block under "`skills/kisou/templates/docs/requirements/AGENTS.md`, the Body", written CRLF:

````markdown
- A `## Section` or a bullet may name the `design-<id>` that serves it. One
  that no design names is either unmet — see "requirements vs issues" — or
  met but not yet described.
````

- [ ] **Step 4: Verify P1.1**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
- State the wish and the why. Keep it about user-visible behavior and intent, not implementation. - A `## Section` or a bullet may name the `design-<id>` that serves it. One that no design names is either unmet — see "requirements vs issues" — or met but not yet described.
EOF
)
tr -d '\r' < skills/kisou/templates/docs/requirements/AGENTS.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

- [ ] **Step 5: Verify the P1.2 anchor, before the edit**

Anchor — one current line of the same file, which occurs there exactly once.
It is the heading the new section sits above.

````markdown
## Growth
````

Run:

````bash
needle=$(cat <<'EOF'
## Growth
EOF
)
grep -cF -- "$needle" skills/kisou/templates/docs/requirements/AGENTS.md
````

Expected: `1`

- [ ] **Step 6: P1.2 — insert the `## requirements vs issues` section**

This is an **insertion** between `## Body` and `## Growth`: the section below,
followed by one blank line, goes immediately **before** the `## Growth` line.
The blank line that already precedes the insertion point now separates P1.1's
bullet from the new heading, and the blank line added after the section's last
line `  judgment.` separates it from `## Growth`. No heading is renamed and no
section is removed — kisou's refresh identifies sections by heading.

New passage — the spec's block under "`skills/kisou/templates/docs/requirements/AGENTS.md`" in "The rule and the two tests", written CRLF:

````markdown
## requirements vs issues

- `{{requirements}}/` = what the user needs and why — whether or not the
  system meets it yet (living).
- `{{issues}}/` = what is wrong or missing and is not being fixed now.
- A need the user states is a requirement fragment **even when it is unmet**.
  The gap it leaves is a separate issue fragment. One statement yielding two
  entries is not duplication: the requirement outlives the fix, the issue
  closes with it. Filing the issue alone loses the requirement.
- Two tests for "this is a requirement": the need survives a change of design
  — it would still hold if the system were built another way; and its reason
  is the user's own situation — time, trust, language, authority — not the
  system's coherence. A statement that passes neither is design or an issue.
- The granularity rule above applies to classification too: a small need folds
  into an existing topic file as one bullet under a `## Section`, or is
  design; a new file only for a new topic. Never one file per sentence.
- The user's confirmation is the gate. A requirement candidate is proposed
  and accepted at `Direction?`; it is never written on the classifier's own
  judgment.
````

"The granularity rule above" is the `## File` bullet that already reads
"Granularity: **coarse — one file per topic/area** … Do not create one file per
atomic sentence." It stays where it is; nothing in `## File` changes.

- [ ] **Step 7: Verify P1.2**

The heading, raw:

````bash
grep -c '^## requirements vs issues$' skills/kisou/templates/docs/requirements/AGENTS.md
````

Expected: `1`. Baseline `0`, measured 2026-09-09.

The section body, on the flattened file:

````bash
needle=$(cat <<'EOF'
## requirements vs issues - `{{requirements}}/` = what the user needs and why — whether or not the system meets it yet (living). - `{{issues}}/` = what is wrong or missing and is not being fixed now. - A need the user states is a requirement fragment **even when it is unmet**. The gap it leaves is a separate issue fragment. One statement yielding two entries is not duplication: the requirement outlives the fix, the issue closes with it. Filing the issue alone loses the requirement. - Two tests for "this is a requirement": the need survives a change of design — it would still hold if the system were built another way; and its reason is the user's own situation — time, trust, language, authority — not the system's coherence. A statement that passes neither is design or an issue. - The granularity rule above applies to classification too: a small need folds into an existing topic file as one bullet under a `## Section`, or is design; a new file only for a new topic. Never one file per sentence. - The user's confirmation is the gate. A requirement candidate is proposed and accepted at `Direction?`; it is never written on the classifier's own judgment. ## Growth
EOF
)
tr -d '\r' < skills/kisou/templates/docs/requirements/AGENTS.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`. The needle ends with `## Growth`, so it pins the position as
well as the text: an append after `## Growth` returns `0` here.

- [ ] **Step 8: Verify the P1.3 anchor, before the edit**

Anchor — one current line of `skills/kisou/templates/docs/issues/AGENTS.md`,
which occurs there exactly once. It is the heading the new paragraph sits
above; the opening paragraph that ends `**directory**, not a frontmatter
field.` stays exactly as it is.

````markdown
## Lifecycle (by directory)
````

Run:

````bash
needle=$(cat <<'EOF'
## Lifecycle (by directory)
EOF
)
grep -cF -- "$needle" skills/kisou/templates/docs/issues/AGENTS.md
````

Expected: `1`

- [ ] **Step 9: P1.3 — insert the issues paragraph**

This is an **insertion** after the opening paragraph and before
`## Lifecycle (by directory)`: the paragraph below, followed by one blank line,
goes immediately **before** the `## Lifecycle (by directory)` line. The blank
line that already precedes the insertion point separates the opening paragraph
from the new one. This is the exit placed where classifiers read first — the
issue definition is the passage that matched "missing".

New passage — the spec's block under "`skills/kisou/templates/docs/issues/AGENTS.md`", written CRLF:

````markdown
When the missing thing is a need the user stated, the need itself is a
requirement fragment and the issue records only the gap — see
"requirements vs issues" in `{{docs}}/{{requirements}}/AGENTS.md`. An issue
filed alone loses the requirement.
````

- [ ] **Step 10: Verify P1.3**

On the flattened file:

````bash
needle=$(cat <<'EOF'
**directory**, not a frontmatter field. When the missing thing is a need the user stated, the need itself is a requirement fragment and the issue records only the gap — see "requirements vs issues" in `{{docs}}/{{requirements}}/AGENTS.md`. An issue filed alone loses the requirement. ## Lifecycle (by directory)
EOF
)
tr -d '\r' < skills/kisou/templates/docs/issues/AGENTS.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`. The needle carries the anchor on both sides, so it pins the
position too. The raw line count
`grep -c 'requirements vs issues' skills/kisou/templates/docs/issues/AGENTS.md`
returns `1` as well: the passage keeps the phrase on one line (the spec's block
wraps before it), so the spec's "classify pointer" grep holds on this file.

- [ ] **Step 11: Verify the P1.4 anchor, before the edit**

Anchor — the first current line of step 2 of "Session shoroku (excerpting)" in
`skills/kisou/templates/docs/AGENTS.md`, which occurs there exactly once.

````markdown
2. **Classify** each fragment as exactly one of requirement / design /
````

Run:

````bash
needle=$(cat <<'EOF'
2. **Classify** each fragment as exactly one of requirement / design /
EOF
)
grep -cF -- "$needle" skills/kisou/templates/docs/AGENTS.md
````

Expected: `1`

- [ ] **Step 12: P1.4 — replace step 2 in full**

This is a **replacement**: the whole three-line step 2 item goes, and the
six-line item below takes its place. Step 1 above it and step 3 below it are
untouched by this passage; P1.5 replaces step 3 next. "Exactly one" stays — the
unmet need is **two** fragments, each of exactly one type, which is the wording
that reconciles the new rule with the existing principle.

Old passage — replace exactly these 3 lines of
`skills/kisou/templates/docs/AGENTS.md` and nothing else:

````markdown
2. **Classify** each fragment as exactly one of requirement / design /
   decision / issue (see "design vs decisions" in the type files for the
   design/decision split).
````

New passage — the spec's block under "`skills/kisou/templates/docs/AGENTS.md`, the Classify step", written CRLF:

````markdown
2. **Classify** each fragment as exactly one of requirement / design /
   decision / issue. The type files define the two splits that are easy to
   get wrong: "design vs decisions" in `{{docs}}/{{design}}/AGENTS.md`, and
   "requirements vs issues" in `{{docs}}/{{requirements}}/AGENTS.md` — a need
   the user states that the system does not meet yet is **two** fragments, a
   requirement and an issue, not one issue.
````

- [ ] **Step 13: Verify P1.4**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
2. **Classify** each fragment as exactly one of requirement / design / decision / issue. The type files define the two splits that are easy to get wrong: "design vs decisions" in `{{docs}}/{{design}}/AGENTS.md`, and "requirements vs issues" in `{{docs}}/{{requirements}}/AGENTS.md` — a need the user states that the system does not meet yet is **two** fragments, a requirement and an issue, not one issue.
EOF
)
tr -d '\r' < skills/kisou/templates/docs/AGENTS.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The old passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
2. **Classify** each fragment as exactly one of requirement / design / decision / issue (see "design vs decisions" in the type files for the design/decision split).
EOF
)
tr -d '\r' < skills/kisou/templates/docs/AGENTS.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 14: Verify the P1.5 anchor, before the edit**

Anchor — the first current line of step 3 of the same section, which occurs in
the file exactly once.

````markdown
3. **Propose** a single numbered list, grouped by destination file, of only the
````

Run:

````bash
needle=$(cat <<'EOF'
3. **Propose** a single numbered list, grouped by destination file, of only the
EOF
)
grep -cF -- "$needle" skills/kisou/templates/docs/AGENTS.md
````

Expected: `1`

- [ ] **Step 15: P1.5 — replace step 3 in full**

This is a **replacement**: the whole two-line step 3 item goes, and the
eight-line item below takes its place. Steps 4 and 5 after it are untouched.
The check the new step defines runs over the entries the proposal carries,
never over the standing tree.

Old passage — replace exactly these 2 lines of
`skills/kisou/templates/docs/AGENTS.md` and nothing else:

````markdown
3. **Propose** a single numbered list, grouped by destination file, of only the
   entries that would change project state. End with `Direction?` and wait.
````

New passage — the spec's block under "`skills/kisou/templates/docs/AGENTS.md`, the Propose step", written CRLF:

````markdown
3. **Propose** a single numbered list, grouped by destination file, of only the
   entries that would change project state. Each `{{design}}/` entry in the
   list names the `req-<id>` it serves, or says it serves none. Of the entries
   in the list, flag the unpaired: a design section that serves no requirement
   (ask whether an unstated need stands behind it), and a requirement bullet
   no design serves (ask whether the need is unmet — an issue — or met but not
   described — a `{{design}}/` entry). The standing tree is not swept; a
   backfill is its own run. End with `Direction?` and wait.
````

- [ ] **Step 16: Verify P1.5**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
3. **Propose** a single numbered list, grouped by destination file, of only the entries that would change project state. Each `{{design}}/` entry in the list names the `req-<id>` it serves, or says it serves none. Of the entries in the list, flag the unpaired: a design section that serves no requirement (ask whether an unstated need stands behind it), and a requirement bullet no design serves (ask whether the need is unmet — an issue — or met but not described — a `{{design}}/` entry). The standing tree is not swept; a backfill is its own run. End with `Direction?` and wait.
EOF
)
tr -d '\r' < skills/kisou/templates/docs/AGENTS.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The old passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
3. **Propose** a single numbered list, grouped by destination file, of only the entries that would change project state. End with `Direction?` and wait.
EOF
)
tr -d '\r' < skills/kisou/templates/docs/AGENTS.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 17: Verify the P1.6 anchor, before the edit**

Anchor — one current line of `skills/kisou/templates/docs/design/AGENTS.md`,
which occurs there exactly once. It is the last bullet of `## Body` and stays
exactly as it is; the new bullet goes **after** it.

````markdown
- Link to a recorded choice with `decision-<id>` where relevant.
````

Run:

````bash
needle=$(cat <<'EOF'
- Link to a recorded choice with `decision-<id>` where relevant.
EOF
)
grep -cF -- "$needle" skills/kisou/templates/docs/design/AGENTS.md
````

Expected: `1`

- [ ] **Step 18: P1.6 — append the design Body bullet**

This is an **insertion**: the new bullet becomes the last bullet of `## Body`,
immediately after the anchor line, with no blank line between them. The blank
line and the `## design vs decisions` heading that follow stay where they are.
The explicit "serves none" is what makes the Propose step's first flag work: a
silent omission and a considered "none" would otherwise look the same.

New passage — the spec's block under "`skills/kisou/templates/docs/design/AGENTS.md`, the Body", written CRLF:

````markdown
- Name the requirement each `## Section` serves with `req-<id>`. A section
  that serves none says so ("serves no requirement; internal shape"), so a
  shoroku proposal can ask whether an unstated need stands behind it.
````

- [ ] **Step 19: Verify P1.6**

On the flattened file, with the anchor on both sides:

````bash
needle=$(cat <<'EOF'
- Link to a recorded choice with `decision-<id>` where relevant. - Name the requirement each `## Section` serves with `req-<id>`. A section that serves none says so ("serves no requirement; internal shape"), so a shoroku proposal can ask whether an unstated need stands behind it. ## design vs decisions
EOF
)
tr -d '\r' < skills/kisou/templates/docs/design/AGENTS.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

- [ ] **Step 20: Lint the templates' expansion in a scratch tree**

`.markdownlint-cli2.yaml` ignores `skills/**/templates/**`, so
`./scripts/lint.sh` will not markdownlint these four files; and
`scripts/lint.sh` runs pre-commit, which takes only paths inside the
repository, so a scratch tree cannot go through it. Run the markdownlint-cli2
that the hook itself uses, out of the pre-commit cache, on scratch copies
placed at the installed copies' relative paths with the `{{…}}` names expanded
— the method of `docs/notes/tanto-consistency-checks.md` item 5, with check 9's
command shape. At those paths the repository configuration's `ignores` do not
apply (only `docs/superpowers/**` and the templates are skipped), so the lint
binds exactly as it will on the real copies in task 3.

````bash
ROOT=$(git rev-parse --show-toplevel)
S=$(mktemp -d)/tree
mkdir -p "$S/docs/requirements" "$S/docs/issues" "$S/docs/design"
for f in docs/AGENTS.md docs/requirements/AGENTS.md docs/issues/AGENTS.md docs/design/AGENTS.md; do
  sed -e 's/{{docs}}/docs/g' -e 's/{{requirements}}/requirements/g' \
      -e 's/{{design}}/design/g' -e 's/{{decisions}}/decisions/g' \
      -e 's/{{issues}}/issues/g' -e 's/{{notes}}/notes/g' \
      -e 's/{{reports}}/reports/g' "$ROOT/skills/kisou/templates/$f" > "$S/$f"
done
ML=$(ls ~/.cache/pre-commit/repo*/node_env-default/Scripts/markdownlint-cli2 | head -1)
( cd "$S" && "$ML" --config "$ROOT/.markdownlint-cli2.yaml" docs/AGENTS.md docs/requirements/AGENTS.md docs/issues/AGENTS.md docs/design/AGENTS.md )
````

Expected: `Linting: 4 file(s)` then `Summary: 0 error(s)`. Measured
2026-09-09 with the six passages applied. The `repo*` directory is named after
the hook's `rev` and changes whenever it does, so glob for it rather than
naming it; on a POSIX host the executable sits under `bin/` instead of
`Scripts/`. `$ROOT` is captured before the `cd` because
`git rev-parse --show-toplevel` does not work inside the scratch tree, and the
config path is never a home-directory literal.

- [ ] **Step 21: The content greps on the four template files**

The Verification section's checks, restricted to the templates — the installed
copies still carry the old text until task 3.

````bash
grep -c '^## requirements vs issues$' skills/kisou/templates/docs/requirements/AGENTS.md
grep -c 'requirements vs issues' skills/kisou/templates/docs/AGENTS.md skills/kisou/templates/docs/issues/AGENTS.md
grep -c 'serves no requirement; internal shape' skills/kisou/templates/docs/design/AGENTS.md
grep -c 'serves no requirement' skills/kisou/templates/docs/AGENTS.md
grep -c 'may name the' skills/kisou/templates/docs/requirements/AGENTS.md
grep -c 'The standing tree is not swept' skills/kisou/templates/docs/AGENTS.md
grep -c 'exactly one of requirement / design' skills/kisou/templates/docs/AGENTS.md
grep -rn 'in the type files for the' skills
````

Expected, line by line:

- `1` — the new section's heading. Baseline `0`.
- `skills/kisou/templates/docs/AGENTS.md:1` and
  `skills/kisou/templates/docs/issues/AGENTS.md:1`. Baseline `0` for both.
- `1` — the design Body bullet. Baseline `0`.
- `1` — the Propose step's first flag. Baseline `0`.
- `1` — the requirements Body bullet. Baseline `0`.
- `1` — the Propose step's last sentence. Baseline `0`.
- `1` — "exactly one" stays. Baseline `1`.
- nothing printed — the old Classify pointer is gone from `skills`. Baseline:
  one hit, `skills/kisou/templates/docs/AGENTS.md:103`. The spec's form of this
  absence check is
  `grep -rn --exclude-dir=superpowers 'in the type files for the' skills docs`;
  over `docs` too it still prints `docs/AGENTS.md:103` until task 3 refreshes
  the copy, so task 1 runs it over `skills` alone and task 4 runs the full
  form.

- [ ] **Step 22: The headings are unchanged but for the one added**

````bash
for f in skills/kisou/templates/docs/AGENTS.md skills/kisou/templates/docs/requirements/AGENTS.md skills/kisou/templates/docs/issues/AGENTS.md skills/kisou/templates/docs/design/AGENTS.md; do
  echo "== $f"
  diff <(grep '^#' "$f") <(git show main:"$f" | grep '^#') && echo "no difference"
done
````

Expected: `no difference` for the docs, issues, and design templates; for
`skills/kisou/templates/docs/requirements/AGENTS.md` exactly the two lines
`5d4` and `< ## requirements vs issues` — the working tree is the **left** side
of this `diff`, so the one heading this plan adds prints with `<` and a `d`; it
is the added line, not a removed one, and `no difference` does not print for
that file because `diff` exits 1. Baseline: `no difference` for all four,
measured 2026-09-09. kisou's refresh identifies a section by its heading, so a
renamed heading anywhere here would break the refresh task 3 runs.

- [ ] **Step 23: The line endings are what step 1 read**

````bash
git ls-files --eol skills/kisou/templates/docs/AGENTS.md skills/kisou/templates/docs/requirements/AGENTS.md skills/kisou/templates/docs/issues/AGENTS.md skills/kisou/templates/docs/design/AGENTS.md
````

Expected: `i/lf    w/crlf  attr/text=auto` for each — the same value as step 1,
and never `w/mixed`.

- [ ] **Step 24: The diff of each file is exactly its passages**

````bash
for f in skills/kisou/templates/docs/AGENTS.md skills/kisou/templates/docs/requirements/AGENTS.md skills/kisou/templates/docs/issues/AGENTS.md skills/kisou/templates/docs/design/AGENTS.md; do
  echo "== $f"
  git diff "$(git merge-base main HEAD)" -- "$f"
done
````

Expected: `skills/kisou/templates/docs/AGENTS.md` — one hunk holding P1.4 and
P1.5 (the two steps are adjacent, so the changed regions merge); the
requirements template — one hunk holding P1.1 and P1.2 (P1.1's bullet and
P1.2's heading are separated by one unchanged blank line, fewer than seven, so
they merge); the issues template — one hunk, P1.3; the design template — one
hunk, P1.6. Read each hunk against the blocks above; the counts are a
**task-time check**, not an invariant — `git diff` merges two changed regions
when at most six unchanged lines separate them. The merge-base form sees the
working tree, so it is right both before and after the commit; `main...HEAD`
would miss an uncommitted edit.

- [ ] **Step 25: Lint the four paths**

````bash
./scripts/lint.sh skills/kisou/templates/docs/AGENTS.md skills/kisou/templates/docs/requirements/AGENTS.md skills/kisou/templates/docs/issues/AGENTS.md skills/kisou/templates/docs/design/AGENTS.md
````

Windows alternative: `scripts\lint.bat` with the same four paths. Expected:
exit 0, every hook `Passed` or `Skipped`, none `Failed`. markdownlint reports
`Skipped` or no files for these paths — they are configuration-exempt, and step
20 is their lint. Name the files: a directory argument makes every hook skip
and proves nothing.

- [ ] **Step 26: Commit**

Commit by explicit path, the only form this repository allows. No file is new,
so no `git add` of an untracked path is needed; `--only` cannot pick up an
untracked file, and there is none here.

````bash
git add skills/kisou/templates/docs/AGENTS.md skills/kisou/templates/docs/requirements/AGENTS.md skills/kisou/templates/docs/issues/AGENTS.md skills/kisou/templates/docs/design/AGENTS.md
git commit --only skills/kisou/templates/docs/AGENTS.md skills/kisou/templates/docs/requirements/AGENTS.md skills/kisou/templates/docs/issues/AGENTS.md skills/kisou/templates/docs/design/AGENTS.md -m "feat(kisou): the docs templates gain requirements vs issues and the pairing" -m "A need the user states is a requirement fragment even when it is unmet, and the gap it leaves is a separate issue: the rule, its two tests, the granularity gate and the Direction? gate go into the requirements template as a new section between Body and Growth, the exit goes into the issues template where classifiers read first, and the Classify step points at both splits. The pairing is bullet-level: a design section names the req-<id> it serves or says it serves none, a requirement may name its design-<id>, and the Propose step flags the unpaired among the entries it carries, never sweeping the standing tree." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 27: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 2: `skills/shoroku/SKILL.md` — the one mirroring paragraph, and the two README drift checks

**Files:**

- Modify: `skills/shoroku/SKILL.md` — one passage, P2.1, an **insertion** into
  Step 3.
- Check, edit only on a finding: `skills/shoroku/README.md`,
  `skills/kisou/README.md`. **No change expected.**

**Interfaces:**

- Consumes: task 1's P1.2 (the section title `requirements vs issues`) and
  P1.5 (the Propose step, which is where the pairing is defined). The sentence
  names what the other side names, so that neither file carries a term the
  other lacks; issue-2c4d records why that matters between these two skills.
- Produces: nothing later tasks depend on, except that task 4's sweep counts
  `requirements vs issues` in this file once.
- `skills/shoroku/SKILL.md` is **not** markdownlint-ignored, so every
  angle-bracket blank in the new passage would have to sit in a code span —
  the passage has none, and its only code spans are `docs/AGENTS.md` and
  nothing else.
- The frontmatter is **not** touched. `description` contains a colon followed
  by a space nowhere in its value, and a colon-space there breaks the
  frontmatter parse silently; there is no reason to go near it. Step 5 loads
  it through PyYAML to prove the edit left it intact.
- The repository's `AGENTS.md` asks that a `SKILL.md` edit be followed by a
  review of the sibling `README.md` in the same task; this task does both
  READMEs, `skills/shoroku/README.md` for P2.1 and `skills/kisou/README.md`
  for task 1's six passages, because task 1 has already landed when this task
  runs and a drift it finds can be acted on here.

- [ ] **Step 1: Read the file's line ending, before the edit**

Run: `git ls-files --eol skills/shoroku/SKILL.md`
Expected: `i/lf    w/crlf  attr/text=auto`. Measured 2026-09-09. The passage
is written **CRLF**.

- [ ] **Step 2: Verify the P2.1 anchors, before the edit**

Two anchors, one on each side of the insertion point, each occurring in
`skills/shoroku/SKILL.md` exactly once. Both stay exactly as they are.

The line the paragraph above the insertion point ends with:

````markdown
**one** git commit (no auto-push) → report files changed + commit hash.
````

The line the paragraph below the insertion point begins with:

````markdown
Parse direction flexibly: `OK` / `全部適用` accept all; `2 と 5 だけ` accept
````

Run:

````bash
needle=$(cat <<'EOF'
**one** git commit (no auto-push) → report files changed + commit hash.
EOF
)
grep -cF -- "$needle" skills/shoroku/SKILL.md
needle=$(cat <<'EOF'
Parse direction flexibly: `OK` / `全部適用` accept all; `2 と 5 だけ` accept
EOF
)
grep -cF -- "$needle" skills/shoroku/SKILL.md
````

Expected: `1` then `1`

- [ ] **Step 3: P2.1 — insert the paragraph**

This is an **insertion** into Step 3: the paragraph below becomes a new
paragraph between the two anchors, separated from each by one blank line. The
blank line that already sits between them stays and separates the anchor above
from the new paragraph; one blank line is added after the new paragraph's last
line. Nothing else in the skill changes — not the trigger, not the three source
modes, not the direction parsing, not the prohibitions, not the frontmatter.
`shoroku` is a thin shell and forbids itself to restate the format rules, which
is why this is one sentence that names the other side's terms rather than a
restatement of them.

New passage — the spec's block under "shoroku", written CRLF:

````markdown
Classification follows the two splits the type files define — design vs
decisions, requirements vs issues — and the proposal carries the requirement
pairing `docs/AGENTS.md`'s Propose step defines; neither is restated here.
````

- [ ] **Step 4: Verify P2.1**

On the flattened file, with both anchors:

````bash
needle=$(cat <<'EOF'
**one** git commit (no auto-push) → report files changed + commit hash. Classification follows the two splits the type files define — design vs decisions, requirements vs issues — and the proposal carries the requirement pairing `docs/AGENTS.md`'s Propose step defines; neither is restated here. Parse direction flexibly:
EOF
)
tr -d '\r' < skills/shoroku/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

Raw:

````bash
grep -c 'requirements vs issues' skills/shoroku/SKILL.md
````

Expected: `1`. Baseline `0`, measured 2026-09-09.

- [ ] **Step 5: The frontmatter still parses**

A real YAML load, never a regex — a colon followed by a space in a value breaks
it silently:

````bash
uv run --no-project --with pyyaml python -c "import yaml,io; t=io.open('skills/shoroku/SKILL.md',encoding='utf-8').read().split('---')[1]; print(yaml.safe_load(t)['name'])"
````

Expected: prints `shoroku`. Baseline: prints `shoroku`, measured 2026-09-09. If
the host cannot fetch PyYAML, the fallback is the `check-md-frontmatter`
pre-commit hook, which step 8's lint run already exercises on this path; record
which of the two ran.

- [ ] **Step 6: The README drift check, on the changed passages only**

Read `skills/shoroku/README.md` against `skills/shoroku/SKILL.md` as step 3
left it, and `skills/kisou/README.md` against the four templates as task 1 left
them. The question is narrow: **does any sentence in either README now
misstate one of the seven changed passages?** Nothing else in either file is in
scope.

What to compare, and the expected answer:

- `skills/shoroku/README.md` "What it does", third bullet — "On a trigger,
  excerpts the current **session** (default) or **memory** (explicit) into
  those docs: classify → numbered proposal → you partially accept → one git
  commit." P2.1 adds no step to that flow and renames nothing in it: it says
  which splits the classification follows and what the proposal carries. **No
  edit.**
- `skills/shoroku/README.md` "What it does", second bullet — "The format and
  standing rules live in committed `docs/AGENTS.md` (+ each
  `docs/<type>/AGENTS.md`), so **any** agent follows the system, with or
  without this skill." Still exactly true, and it is what P2.1 relies on.
  **No edit.**
- `skills/shoroku/README.md` "Layout" and its closing sentence — "The bundled
  document-management template lives with the `kisou` skill, which installs it;
  `shoroku` only reads and writes into it." Unchanged by any passage. **No
  edit.**
- `skills/kisou/README.md` "What it does", the **migrate** bullet — "re-running
  migrate **refreshes it toward the current template** — adding missing
  sections and updating diverged fixed-text ones, never touching author
  free-text or removing author sections." This is the path task 3 exercises;
  task 1 changed template text, not the refresh behavior. **No edit.**
- `skills/kisou/README.md` "Layout", the `templates/` bullet, and
  "Relationship to shoroku" — they say the bundle carries the `docs/`
  document-management system that `shoroku` fills, and that `kisou` is its sole
  installer. Task 1 changed the content of that system, not its ownership.
  **No edit.**

Expected result: **no edit to either README.** Record the comparison and the
result in the batch report. If a sentence does misstate one of the seven
passages, fix that sentence in this task, add the path to step 8's lint and
step 9's commit, and say so in the report.

**A pre-existing omission is not this task's to fix.** `skills/shoroku/README.md`
"What it does" names two of the three source modes — file mode appears only
under Usage. It is unrelated to the seven passages, so it is a **shoroku
candidate for the batch report**, not a task edit.

- [ ] **Step 7: The line ending is what step 1 read, and the diff is one passage**

````bash
git ls-files --eol skills/shoroku/SKILL.md
git diff "$(git merge-base main HEAD)" -- skills/shoroku/SKILL.md
git diff --name-only "$(git merge-base main HEAD)" -- skills/shoroku/README.md skills/kisou/README.md
````

Expected: `i/lf    w/crlf  attr/text=auto`, never `w/mixed`; one hunk, four
added lines (the paragraph plus one blank line), nothing removed; and the third
command prints **nothing** — neither README changed. Read the hunk against the
block in step 3.

- [ ] **Step 8: Lint the path**

````bash
./scripts/lint.sh skills/shoroku/SKILL.md
````

Windows alternative: `scripts\lint.bat skills/shoroku/SKILL.md`. Expected: exit
0, every hook `Passed` or `Skipped`, none `Failed`. Here markdownlint binds —
the file is not configuration-exempt. If step 6 edited a README, name that path
here too.

- [ ] **Step 9: Commit**

````bash
git add skills/shoroku/SKILL.md
git commit --only skills/shoroku/SKILL.md -m "feat(shoroku): the classification names the two splits and the pairing" -m "Step 3 gains one paragraph: classification follows the two splits the type files define, design vs decisions and requirements vs issues, and the proposal carries the requirement pairing docs/AGENTS.md's Propose step defines. Neither is restated here, because the skill is a thin shell over the committed rules; the sentence exists so that neither side carries a term the other lacks. The frontmatter is untouched, and the two READMEs were reviewed against the changed passages with no drift found." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

If step 6 found and fixed a drift, add that README path to both the `git add`
and the `git commit --only` list, and say so in the commit body.

- [ ] **Step 10: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 3: this repository's four installed copies — the refresh run

**Files:**

- Modify, through kisou's refresh path: `docs/AGENTS.md`,
  `docs/requirements/AGENTS.md`, `docs/issues/AGENTS.md`,
  `docs/design/AGENTS.md` — the same six passages as task 1, with the `{{…}}`
  variables expanded.
- Read-only: `skills/kisou/SKILL.md`, Step 3 (migrate) — the procedure this
  task follows. It is **not** edited, whatever the run finds in it.

**Interfaces:**

- Consumes: task 1's six passages. This task **depends on task 1** and runs
  after it: the refresh compares each installed copy against what the current
  template would produce, so the templates must already carry the new text.
- Produces: four installed copies that equal their templates expanded, byte for
  byte — the state task 4's expanded-template diff re-checks — and, for the
  batch report, kisou's numbered proposal **verbatim** plus, for each of the
  four points below, what kisou actually did. That record is the dogfood
  measurement decision-281f's refresh path has never had.
- All four copies are markdownlint-checked (only `docs/superpowers/**` and the
  templates are exempt), and every angle-bracket blank in the new passages sits
  in a code span or a fenced block, as it already does in the surrounding text.
  Task 1 step 20 lint-proved exactly this expansion in a scratch tree.
- Measured 2026-09-09 against the unedited tree: each copy equals its template
  with the seven `{{…}}` variables expanded, byte for byte apart from that. So
  after task 1 they diverge in exactly the six passages and nothing else.

**Standing in for the user at kisou's prompts.** kisou's flow asks the user to
confirm detected values and to accept or reject numbered items; under this task
the implementer answers, on the batch prompt's authority. The confirmation
kisou's flow exists to get — "show diffs and ask before modifying existing
files" — is given for these four files at the plan's OK: every passage they
receive is verbatim in the spec and in task 1 above, the human's answers to the
review brief are the confirmation, and the diff reaches the human through the
batch report. This stand-in is a one-run plan instruction; it changes neither
`kisou` nor `tanto`.

**Four points of kisou's own text bear on the run.** They are recorded, not
fixed: fixing kisou's text is out of scope, and each point is a finding or an
issue candidate for the batch report whatever the run does.

1. **Whether a present doc-system is refreshed at all.** kisou's detection says
   of a `full` doc-system — this repository's case, the root `AGENTS.md` and all
   four per-type files present — "leave intact; treat the migrate scope as
   **layer-B only** unless the user asks otherwise. It is still a refresh target
   (see the Present branch below)", while its per-artifact list ends
   "**`docs/` doc-system** → write the bundle if absent; if already present,
   leave it intact and add only around it." Follow the parenthetical — "still a
   refresh target" — together with the explicit **docs-only** scope pick, which
   is the user asking otherwise. The contradiction is a finding for the batch
   report whatever the run does.
2. **Which sections count as fixed-text.** The refresh replaces "a diverged
   fixed-text section — one whose template body has **no `<...>` free-text**",
   and never flags "a free-text section (template body carrying `<...>` for the
   author to fill)". Read literally, `<id>` in "`decision-<id>`" makes the
   design template's `## Body` free-text today, and the new `req-<id>` and
   `design-<id>` would make the requirements `## Body` and the docs template's
   "Session shoroku (excerpting)" free-text too — three of the four expected
   items would never be offered. Read as intended, `<...>` means an author-fill
   placeholder such as `<topic title>`, not the `<id>` / `<slug>` / `<status>`
   notation the docs rules are written in. **Rely on the intended reading.** A
   refresh that skips a section because its body carries `<id>` is a finding
   against kisou.
3. **What a per-type `AGENTS.md`'s fingerprint is.** kisou lists fingerprints
   for `CLAUDE.md`, `AGENTS.md`, `{docs,Documents}/AGENTS.md` (the root), and
   "any layer-B file whose heading set substantially matches the template". A
   per-type `docs/<type>/AGENTS.md` matches none by name. If the run classifies
   one as **not** kisou-managed, kisou's branch is to rename the original to
   `<file>.bak` and write a fresh template-filled file: **reject** that offer
   for each of the four files and hand-mirror instead (step 6). No `.bak` file
   is left in the tree. The missing fingerprint is an issue candidate against
   kisou.
4. **Where an added section lands.** kisou says "add it, template-filled" and
   nothing about position. `## requirements vs issues` must sit between
   `## Body` and `## Growth`; an append after `## Growth` passes a heading grep
   and fails only the expanded-template diff — which is why the diff, not the
   grep, decides this run.

- [ ] **Step 1: Record the starting state**

````bash
git ls-files --eol docs/AGENTS.md docs/requirements/AGENTS.md docs/issues/AGENTS.md docs/design/AGENTS.md
git status --porcelain
grep -c '^## requirements vs issues$' skills/kisou/templates/docs/requirements/AGENTS.md
````

Expected: `i/lf    w/crlf  attr/text=auto` for each of the four copies; a clean
working tree — tasks 1 and 2 have committed; and `1`, which proves task 1
landed and the refresh has something to offer. A dirty tree here is a
Rulings-needed item, not something to clean up.

- [ ] **Step 2: Record the four copies as they diverge now**

````bash
for t in docs requirements issues design; do
  f=$([ $t = docs ] && echo docs/AGENTS.md || echo docs/$t/AGENTS.md)
  printf '%s: ' "$f"
  sed -e 's/{{docs}}/docs/g' -e 's/{{requirements}}/requirements/g' \
      -e 's/{{design}}/design/g' -e 's/{{decisions}}/decisions/g' \
      -e 's/{{issues}}/issues/g' -e 's/{{notes}}/notes/g' \
      -e 's/{{reports}}/reports/g' "skills/kisou/templates/$f" \
    | diff --strip-trailing-cr -q - "$f" >/dev/null && echo identical || echo DIFFERS
done
````

Expected now: `DIFFERS` for all four — task 1 changed the templates and no copy
has caught up. Baseline before task 1: `identical` for all four, measured
2026-09-09 on this machine. `--strip-trailing-cr` is load-bearing: the files
are CRLF in the working tree (`.gitattributes` has `* text=auto`,
`core.autocrlf` is `true`) and Git Bash's `sed` emits LF, so without it the
diff reports every line. `grep` strips CR on input the same way, so the greps
elsewhere in this plan need nothing.

- [ ] **Step 3: Run the kisou skill in migrate mode, docs-only scope**

Invoke the `kisou` skill on this repository — the `Skill` tool with
`skill: kisou`, `args: migrate`; if the skill is not available in this turn,
read `skills/kisou/SKILL.md` Step 3 (migrate) and execute it directly, which is
the same procedure and counts as the refresh-path dogfood all the same (the
measurement is what kisou's text makes the run do, not the tool route; the
report says which route ran — decided by the human at the plan brief, D-6) —
and follow that step as written. Do **not** stop for a
human at any prompt: this task's authority is the plan's OK, and the answers
below are the user's answers. kisou's partial-accept vocabulary is `OK` /
`2 と 5 だけ` / `3 はやめて` / `全部やめ`; give the accept or the exclusion list
in that form, and record what you gave, verbatim, in the report. Answer its
prompts as the user, thus:

- **Detected values** — confirm them. Detection enumerates actual FS entries;
  expect `case=snake_case` (`docs/`, `scripts/` are lower-case), `dirs` with
  neither `src` nor `tests` (this repository has neither), `os` including both
  `windows` and `unix` (`.bat` and `.sh` both present), `scripts` covering
  `lint` (`scripts/lint.sh` / `scripts/lint.bat`), with `bootstrap` present and
  not a `scripts=` value, and the doc-system classified **full** — the root
  `docs/AGENTS.md` plus all four per-type files present, with
  `docs/notes/AGENTS.md` and `docs/reports/AGENTS.md` also present so no
  create is offered for them.
- **The scripts-intent prompt** — kisou asks once about the script slots the
  repository lacks (`setup`, `run`, `build`, `test` here, since `scripts/`
  holds `bootstrap` and `lint`; `tidy` only if kisou offers it — its Step 2
  restricts `tidy` to clang + CMake projects while Step 3's list names it
  unconditionally, so whether it appears is the fifth point to record).
  **Decline every one.**
- **The scope pick** — choose **docs-only**. This is also the answer to point 1
  above: it is the user asking otherwise.
- **The refresh items** — accept every item that touches `docs/AGENTS.md`,
  `docs/requirements/AGENTS.md`, `docs/issues/AGENTS.md`, or
  `docs/design/AGENTS.md`.
- **A `.bak`-and-rewrite offer** — **reject** it for each of the four files, per
  point 3, and hand-mirror in step 6 instead. No `.bak` is left in the tree.
- **Anything else** — reject. A `notes/` or `reports/` create is not expected
  (`docs/notes/AGENTS.md`, `docs/reports/AGENTS.md`, and
  `docs/decisions/AGENTS.md` are present and unchanged), and layer-B files are
  outside docs-only scope.
- **kisou's commit step** — **stop before it.** kisou's flow ends in one commit
  of its own; under tanto the commit happens at the task boundary, by explicit
  path, in step 9. Leave the tree for the batch report to describe.

Expected refresh items, under point 2's intended reading:

- `docs/AGENTS.md` — the "Session shoroku (excerpting)" section body diverged;
  replace.
- `docs/requirements/AGENTS.md` — the section `## requirements vs issues`
  missing; add. And the `## Body` body diverged; replace.
- `docs/design/AGENTS.md` — the `## Body` body diverged; replace.
- `docs/issues/AGENTS.md` — the paragraph before the first `##` heading
  diverged.

Three open points of the measurement, to be answered in the report by what the
run actually offered: whether the refresh sees the issues preamble at all (kisou
speaks of a "fixed section / block", and a preamble is a block but not a
section); whether it offers the three sections whose bodies carry `<id>`; and
where it put the added section.

- [ ] **Step 4: Record kisou's numbered proposal verbatim, and the four points**

Copy kisou's numbered proposal into the batch report **verbatim** — this is the
dogfood's measurement, and the human is to see what the refresh path offered,
not a summary of it. Then record, for each of the four points above, what kisou
did: whether it treated the present `full` doc-system as a refresh target;
whether it offered the three `<id>`-carrying sections; whether it recognized
each per-type `AGENTS.md` as kisou-managed or offered a `.bak` rewrite; and
where it put `## requirements vs issues`. Record a fifth point beside them:
whether the scripts-intent prompt offered `tidy` (kisou's Step 2 and Step 3
disagree on it).

- [ ] **Step 5: The expanded-template diff — the check that decides the run**

````bash
for t in docs requirements issues design; do
  f=$([ $t = docs ] && echo docs/AGENTS.md || echo docs/$t/AGENTS.md)
  printf '%s: ' "$f"
  sed -e 's/{{docs}}/docs/g' -e 's/{{requirements}}/requirements/g' \
      -e 's/{{design}}/design/g' -e 's/{{decisions}}/decisions/g' \
      -e 's/{{issues}}/issues/g' -e 's/{{notes}}/notes/g' \
      -e 's/{{reports}}/reports/g' "skills/kisou/templates/$f" \
    | diff --strip-trailing-cr -q - "$f" >/dev/null && echo identical || echo DIFFERS
done
````

Expected: `identical` for all four. This, not a heading grep, is what decides
the run — an appended section passes a grep and fails here. If every file is
`identical`, skip step 6 and go to step 7.

- [ ] **Step 6: The hand-mirror fallback, for any file the diff still reports**

For each file the previous step reports `DIFFERS`, apply the missing or mangled
passage by hand from the blocks below, then re-run step 5 until all four read
`identical`. If a passage is present but in the wrong place, or present with
bytes the block below does not carry, **delete the refresh's version first** —
the block below is the only text the passage may contribute — then apply the
block at its anchor; after each removal re-run the presence greps at the head
of this step, and each must read `1`, never `2`. Name in the report the passage
the refresh missed, misplaced, or mangled, and which of the three it was: that
is a **finding against `kisou`** for the batch report's findings list, and
Kanri carries it to T2 as an issue candidate. Fixing kisou's own text is out of
scope.

Run first, to see which of the six passages are already in place:

````bash
grep -c '^## requirements vs issues$' docs/requirements/AGENTS.md
grep -c 'may name the' docs/requirements/AGENTS.md
grep -c 'requirements vs issues' docs/issues/AGENTS.md
grep -c 'requirements vs issues' docs/AGENTS.md
grep -c 'The standing tree is not swept' docs/AGENTS.md
grep -c 'serves no requirement; internal shape' docs/design/AGENTS.md
````

Expected after a complete refresh: `1` six times.

**M3.1 — `docs/requirements/AGENTS.md`, the `## Body` bullet.** An
**insertion** after the anchor's second line `  not implementation.`, with no
blank line between them.

Anchor, which stays:

````markdown
- State the wish and the why. Keep it about user-visible behavior and intent,
  not implementation.
````

New passage:

````markdown
- A `## Section` or a bullet may name the `design-<id>` that serves it. One
  that no design names is either unmet — see "requirements vs issues" — or
  met but not yet described.
````

**M3.2 — `docs/requirements/AGENTS.md`, the new section.** An **insertion**
between `## Body` and `## Growth`: the section below, followed by one blank
line, immediately before the `## Growth` line.

Anchor, which stays:

````markdown
## Growth
````

New passage:

````markdown
## requirements vs issues

- `requirements/` = what the user needs and why — whether or not the
  system meets it yet (living).
- `issues/` = what is wrong or missing and is not being fixed now.
- A need the user states is a requirement fragment **even when it is unmet**.
  The gap it leaves is a separate issue fragment. One statement yielding two
  entries is not duplication: the requirement outlives the fix, the issue
  closes with it. Filing the issue alone loses the requirement.
- Two tests for "this is a requirement": the need survives a change of design
  — it would still hold if the system were built another way; and its reason
  is the user's own situation — time, trust, language, authority — not the
  system's coherence. A statement that passes neither is design or an issue.
- The granularity rule above applies to classification too: a small need folds
  into an existing topic file as one bullet under a `## Section`, or is
  design; a new file only for a new topic. Never one file per sentence.
- The user's confirmation is the gate. A requirement candidate is proposed
  and accepted at `Direction?`; it is never written on the classifier's own
  judgment.
````

**M3.3 — `docs/issues/AGENTS.md`, the paragraph.** An **insertion** after the
opening paragraph and before `## Lifecycle (by directory)`: the paragraph
below, followed by one blank line, immediately before that heading.

Anchor, which stays:

````markdown
## Lifecycle (by directory)
````

New passage:

````markdown
When the missing thing is a need the user stated, the need itself is a
requirement fragment and the issue records only the gap — see
"requirements vs issues" in `docs/requirements/AGENTS.md`. An issue
filed alone loses the requirement.
````

**M3.4 — `docs/AGENTS.md`, step 2 of "Session shoroku (excerpting)".** A
**replacement** of the whole item.

Old passage — replace exactly these 3 lines and nothing else:

````markdown
2. **Classify** each fragment as exactly one of requirement / design /
   decision / issue (see "design vs decisions" in the type files for the
   design/decision split).
````

New passage:

````markdown
2. **Classify** each fragment as exactly one of requirement / design /
   decision / issue. The type files define the two splits that are easy to
   get wrong: "design vs decisions" in `docs/design/AGENTS.md`, and
   "requirements vs issues" in `docs/requirements/AGENTS.md` — a need
   the user states that the system does not meet yet is **two** fragments, a
   requirement and an issue, not one issue.
````

**M3.5 — `docs/AGENTS.md`, step 3 of the same section.** A **replacement** of
the whole item.

Old passage — replace exactly these 2 lines and nothing else:

````markdown
3. **Propose** a single numbered list, grouped by destination file, of only the
   entries that would change project state. End with `Direction?` and wait.
````

New passage:

````markdown
3. **Propose** a single numbered list, grouped by destination file, of only the
   entries that would change project state. Each `design/` entry in the
   list names the `req-<id>` it serves, or says it serves none. Of the entries
   in the list, flag the unpaired: a design section that serves no requirement
   (ask whether an unstated need stands behind it), and a requirement bullet
   no design serves (ask whether the need is unmet — an issue — or met but not
   described — a `design/` entry). The standing tree is not swept; a
   backfill is its own run. End with `Direction?` and wait.
````

**M3.6 — `docs/design/AGENTS.md`, the `## Body` bullet.** An **insertion**
after the anchor line, with no blank line between them.

Anchor, which stays:

````markdown
- Link to a recorded choice with `decision-<id>` where relevant.
````

New passage:

````markdown
- Name the requirement each `## Section` serves with `req-<id>`. A section
  that serves none says so ("serves no requirement; internal shape"), so a
  shoroku proposal can ask whether an unstated need stands behind it.
````

Each of these six blocks is task 1's passage with `{{docs}}` → `docs`,
`{{requirements}}` → `requirements`, `{{design}}` → `design`, and
`{{issues}}` → `issues`; the wrapping is the template's, unchanged, because
step 5's diff compares byte for byte.

- [ ] **Step 7: No `.bak` file is left, and nothing outside the four copies changed**

````bash
git status --porcelain -- docs | grep -c '\.bak'
git status --porcelain
git diff --name-only "$(git merge-base main HEAD)" -- docs
````

Expected: `0` for the `.bak` count — baseline `0`, measured 2026-09-09; the
second command lists only the four copies as modified; the third lists exactly
`docs/AGENTS.md`, `docs/design/AGENTS.md`, `docs/issues/AGENTS.md`, and
`docs/requirements/AGENTS.md` — no other path under `docs/`. Anything else the
run created or touched is reverted and named in the report as a finding against
kisou: for a path **outside** the four copies that the run created, `rm <path>`;
for a tracked path outside the four copies that the run modified,
`git checkout -- <path>`. Never `git checkout` one of the four copies — that
discards the refresh; a wrong byte inside a copy is fixed by step 6's blocks and
re-checked by step 5. If a `.bak` exists, `rm` it and record that the rejection
in step 3 was not honored.

- [ ] **Step 8: The line endings are what step 1 read, and lint the four paths**

````bash
git ls-files --eol docs/AGENTS.md docs/requirements/AGENTS.md docs/issues/AGENTS.md docs/design/AGENTS.md
./scripts/lint.sh docs/AGENTS.md docs/requirements/AGENTS.md docs/issues/AGENTS.md docs/design/AGENTS.md
````

Windows alternative for the second line: `scripts\lint.bat` with the same four
paths. Expected: `i/lf    w/crlf  attr/text=auto` for each, never `w/mixed`;
then exit 0 with every hook `Passed` or `Skipped`, none `Failed`. Here
markdownlint binds — these paths are not configuration-exempt — and task 1
step 20 already lint-proved this exact expansion in a scratch tree. A
markdownlint `--fix` that rewrites a file also fails the run and leaves the
change unstaged: re-run step 5's diff before re-staging, because a fix that
alters a byte breaks `identical`.

- [ ] **Step 9: Commit**

````bash
git add docs/AGENTS.md docs/requirements/AGENTS.md docs/issues/AGENTS.md docs/design/AGENTS.md
git commit --only docs/AGENTS.md docs/requirements/AGENTS.md docs/issues/AGENTS.md docs/design/AGENTS.md -m "docs: the installed docs system gains requirements vs issues and the pairing" -m "The four kisou-installed copies catch up with the templates through kisou migrate in docs-only scope, the first dogfood of the refresh path: the requirements file gains the requirements vs issues section and its Body bullet, the issues file the exit paragraph, the docs root the rewritten Classify and Propose steps, the design file the req-<id> bullet. Verified by the expanded-template diff, which reads identical for all four; the batch report carries kisou's numbered proposal verbatim and what the refresh did at each of the four points where kisou's own text is not of one mind." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 10: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 4: the whole-tree sweep

**Files:**

- Modify: nothing. This task writes no file and makes no commit.

**Interfaces:**

- Consumes: the seven files tasks 1 to 3 wrote, and the spec's Verification
  section as the source of the commands.
- Produces: the recorded output of every check. That output **is** the
  deliverable. This is a **verification-only task** in the sense
  `skills/tanto/roles/jisso.md` defines: the dispatch tells the reviewer to
  **re-run** the checks rather than trust this report, because a report of a
  check is not the check.

Run the commands **as written** — do not paraphrase them — so that a divergence
between the spec and the tree is the spec's problem or the tree's, never a
transcription's. **A failing check is a Rulings-needed item in the batch
report, never an edit.** An edit outside the seven passages would break the
invariant that each touched file's merge-base diff is exactly its passages;
Kanri rules on it, and a ruled correction lands in the whole-branch review's
fix wave.

- [ ] **Step 1: Lint every changed path, each named individually**

````bash
./scripts/lint.sh skills/kisou/templates/docs/AGENTS.md skills/kisou/templates/docs/requirements/AGENTS.md skills/kisou/templates/docs/issues/AGENTS.md skills/kisou/templates/docs/design/AGENTS.md skills/shoroku/SKILL.md docs/AGENTS.md docs/requirements/AGENTS.md docs/issues/AGENTS.md docs/design/AGENTS.md
````

Windows alternative: `scripts\lint.bat` with the same nine paths. Expected:
exit 0, every hook `Passed` or `Skipped`, none `Failed`. markdownlint binds on
`skills/shoroku/SKILL.md` and the four `docs/**` copies, and not on the four
templates, which `.markdownlint-cli2.yaml` ignores — task 1 step 20's scratch
run is their lint. Name the files: a directory argument makes every hook skip
and proves nothing. If a README was edited in task 2 step 6, add its path here.

- [ ] **Step 2: The new section, template and copy**

````bash
grep -c '^## requirements vs issues$' skills/kisou/templates/docs/requirements/AGENTS.md docs/requirements/AGENTS.md
````

Expected: `1` for each. Baseline `0`, `0`, measured 2026-09-09.

- [ ] **Step 3: The classify pointer**

````bash
grep -c 'requirements vs issues' skills/kisou/templates/docs/AGENTS.md docs/AGENTS.md skills/kisou/templates/docs/issues/AGENTS.md docs/issues/AGENTS.md
````

Expected: at least `1` for each of the four, as the spec states; `1` on this
tree (the docs template and copy carry the phrase in step 2; the issues
template and copy carry it in the new paragraph, which keeps it on one line;
measured 2026-09-09). Baseline `0` for all four.

- [ ] **Step 4: The old pointer is gone, everywhere**

The absence check at repository scope, the full form the spec states:

````bash
grep -rn --exclude-dir=superpowers 'in the type files for the' skills docs
````

Expected: prints nothing. Baseline: two hits, the template and the copy, each
at line 103 — the old sentence wraps after "for the", so the pattern stops
there. `docs/superpowers/` is excluded because the spec and this plan quote the
old passage there; without the exclusion the command would report its own
quotations. This is the falsifiable half of step 3: it decides that the old
form is gone everywhere rather than that the new form arrived somewhere.

- [ ] **Step 5: The pairing bullets**

````bash
grep -c 'serves no requirement; internal shape' skills/kisou/templates/docs/design/AGENTS.md docs/design/AGENTS.md
grep -c 'serves no requirement' skills/kisou/templates/docs/AGENTS.md docs/AGENTS.md
grep -c 'may name the' skills/kisou/templates/docs/requirements/AGENTS.md docs/requirements/AGENTS.md
````

Expected: `1` each on the first (the design Body bullet), `1` each on the
second (the Propose step's flag), `1` each on the third (the requirements Body
bullet). Baseline `0` for all six.

- [ ] **Step 6: The standing tree is not swept**

````bash
grep -c 'The standing tree is not swept' skills/kisou/templates/docs/AGENTS.md docs/AGENTS.md
````

Expected: `1` each. Baseline `0`.

- [ ] **Step 7: shoroku's paragraph, and the frontmatter**

````bash
grep -c 'requirements vs issues' skills/shoroku/SKILL.md
uv run --no-project --with pyyaml python -c "import yaml,io; t=io.open('skills/shoroku/SKILL.md',encoding='utf-8').read().split('---')[1]; print(yaml.safe_load(t)['name'])"
````

Expected: `1`, baseline `0`; then prints `shoroku`, baseline prints `shoroku`.

- [ ] **Step 8: Exactly one stays**

````bash
grep -c 'exactly one of requirement / design' skills/kisou/templates/docs/AGENTS.md docs/AGENTS.md
````

Expected: `1` each. Baseline `1` each — the principle the new Classify step
keeps.

- [ ] **Step 9: The headings are unchanged but for the one added**

````bash
for f in skills/kisou/templates/docs/AGENTS.md skills/kisou/templates/docs/requirements/AGENTS.md skills/kisou/templates/docs/issues/AGENTS.md skills/kisou/templates/docs/design/AGENTS.md; do
  echo "== $f"
  diff <(grep '^#' "$f") <(git show main:"$f" | grep '^#') && echo "no difference"
done
````

Expected: `no difference` for the docs, issues, and design templates; for the
requirements template exactly `5d4` and `< ## requirements vs issues` — the
working tree is the left side, so the added heading prints with `<` and a `d`
(task 1 step 22 says the same). Baseline: `no difference` for all four.

- [ ] **Step 10: The expanded-template diff**

````bash
for t in docs requirements issues design; do
  f=$([ $t = docs ] && echo docs/AGENTS.md || echo docs/$t/AGENTS.md)
  printf '%s: ' "$f"
  sed -e 's/{{docs}}/docs/g' -e 's/{{requirements}}/requirements/g' \
      -e 's/{{design}}/design/g' -e 's/{{decisions}}/decisions/g' \
      -e 's/{{issues}}/issues/g' -e 's/{{notes}}/notes/g' \
      -e 's/{{reports}}/reports/g' "skills/kisou/templates/$f" \
    | diff --strip-trailing-cr -q - "$f" >/dev/null && echo identical || echo DIFFERS
done
````

Expected: `identical` for all four. Baseline `identical` for all four, measured
2026-09-09 against the unedited tree. This is the check that binds the
templates and the installed copies together; a `DIFFERS` here is a
Rulings-needed item, and the passage it names is task 3's hand-mirror blocks.

- [ ] **Step 11: No `.bak` left**

````bash
git status --porcelain -- docs | grep -c '\.bak'
````

Expected: `0`. Baseline `0`.

- [ ] **Step 12: No tanto file changed**

````bash
git diff --name-only "$(git merge-base main HEAD)" -- skills/tanto
````

Expected: empty. The merge-base form sees uncommitted edits, which the
three-dot form does not
(`docs/notes/tanto-consistency-checks.md`, the first of its six points).
Baseline: empty on the `requirement-extraction` branch, which is cut from
`main` after review-brief merges. On `review-brief`, where the spec was
drafted, the same command lists the tanto files that plan edited, so this check
means something only on the plan's own branch — if it is not empty, confirm the
branch before reporting a failure.

- [ ] **Step 13: The whole diff is the seven passages and nothing else**

````bash
git diff --name-only "$(git merge-base main HEAD)"
git diff "$(git merge-base main HEAD)"
````

Expected from the first command: the plan's nine paths —
`docs/AGENTS.md`, `docs/design/AGENTS.md`, `docs/issues/AGENTS.md`,
`docs/requirements/AGENTS.md`, `skills/kisou/templates/docs/AGENTS.md`,
`skills/kisou/templates/docs/design/AGENTS.md`,
`skills/kisou/templates/docs/issues/AGENTS.md`,
`skills/kisou/templates/docs/requirements/AGENTS.md`,
`skills/shoroku/SKILL.md` — plus only the paths that are not plan output and
ride the same branch: the spec
`docs/superpowers/specs/2026-09-09-requirement-extraction-design.md`, this plan
under `docs/superpowers/plans/`, and the paths under `docs/requirements/`,
`docs/design/`, `docs/decisions/`, and `docs/issues/` that Kanri's T1 write-out
and any `docs(issues):` commit touched. Any other path is a Rulings-needed
item. Read the second command's hunks for the nine plan paths against the
blocks of tasks 1, 2, and 3: every added and removed line must be covered by
one of them, and no hunk may sit outside them. Hunk order is file order, not
task order, so match each hunk to a passage by its text, never by index.

- [ ] **Step 14: The trailers on this branch's plan commits**

````bash
git log --format='%s' "$(git merge-base main HEAD)"..HEAD
git log --format=%B "$(git merge-base main HEAD)"..HEAD | grep -c 'Co-Authored-By: Claude'
````

Expected: the three subjects of tasks 1, 2, and 3, and besides them only
commits that are not plan output — Sekkei's spec and plan commits
(`docs(superpowers): …`), Kanri's `docs: T<n> shoroku` and `docs(issues):`
commits — and a count equal to the number of commits listed: every one carries
the trailer.

- [ ] **Step 15: No commit — the deliverable is the recorded output**

This task writes no file, so there is nothing to `git add` and nothing to
`git commit --only`. `git status --porcelain` must print nothing: task 3
committed the last passage, and a dirty tree here means a check was answered
with an edit, which this task forbids. Put every check's command and its actual
output in the batch report, next to the expectation above, and put every
mismatch in the report's Rulings-needed list.

---

## Batches

One batch, A, of four tasks. Tasks 1 and 2 land the templates and shoroku's
paragraph; Task 3 runs kisou's refresh on this repository's four installed
copies and depends on Task 1; Task 4 is the whole-tree sweep. The tasks run in
order under subagent-driven development.

**The batch A boundary is the final boundary, and a role may be started or
replaced at it — or at any point, since rule 11 does not apply.** Nothing
this plan writes is a `skills/tanto/` file, so rule 11 does not apply and no
session's authority changes under it. One file this plan writes is read by a
session of this run: `docs/AGENTS.md`, whose rewritten Propose step T2 and
every exit shoroku after Task 3 follow — deliberately, since the new rule is
what those write-outs are for. It changes no session's authority and forces no
replacement. This plan expects one Jisso throughout, so no replacement is
planned. Kanri edits nothing at the boundary: the roster and the ledger are
untracked, and T1 is committed before Jisso exists. T2 runs at that boundary,
after Task 4's sweep is accepted; its write-outs go under `docs/requirements/`,
`docs/design/`, `docs/decisions/`, and `docs/issues/`, which no task touches.

| Batch | Tasks | Delivers | Stop conditions at the boundary |
| --- | --- | --- | --- |
| A | 1, 2, 3, 4 | the four kisou templates with the six passages (`## requirements vs issues` and the `## Body` bullet in requirements; the paragraph in issues; steps 2 and 3 of "Session shoroku (excerpting)" in `docs/AGENTS.md`; the `## Body` bullet in design); `skills/shoroku/SKILL.md` with the one paragraph in Step 3; the four installed copies refreshed to the same passages with variables expanded, through `kisou migrate` docs-only, hand-mirrored where the refresh missed; the refresh's verbatim proposal and the four points' outcomes in the batch report; both READMEs checked for drift on the changed passages | lint clean on every changed path, by name (nine files); the scratch markdownlint of Task 1 clean; every flattened new-passage grep of Tasks 1 and 2 returns `1`, the two old-passage greps of the replacements return `0`, the anchors of the five insertions still return `1`; the spec's content greps hold on templates **and** copies (`^## requirements vs issues$` 1 and 1; `requirements vs issues` at least 1 in each of the four docs/issues files and 1 in `SKILL.md`; `serves no requirement; internal shape` 1 and 1; `serves no requirement` 1 and 1 in the docs template and copy; `may name the` 1 and 1; `The standing tree is not swept` 1 and 1; `exactly one of requirement / design` 1 and 1); the absence grep `grep -rn --exclude-dir=superpowers 'in the type files for the' skills docs` prints nothing; the headings of each template differ from `main`'s only by the one added heading; the expanded-template diff prints `identical` for all four copies; `git diff --name-only "$(git merge-base main HEAD)" -- skills/tanto` prints nothing; `git status --porcelain -- docs \| grep -c '\.bak'` prints `0`; the PyYAML load prints `shoroku`; `git ls-files --eol` unchanged for all nine files; `git diff "$(git merge-base main HEAD)" -- <file>` for each of the nine files read hunk by hunk against the blocks; `git status --short` prints nothing; every commit on `main..HEAD` carries exactly one `Co-Authored-By: Claude` line; the tree is self-consistent, so a role may be started or replaced from here — as it could before |

The final batch — the whole-branch review's fix wave, dispatched by Kanri
after batch A — is the protocol's own and not counted here; a fix-wave list
is drafted under the same conditions as a plan, each command run once before
it is dispatched.

## How a batch is verified

For a Markdown-only plan of passage edits plus one skill run, run this
checklist at the boundary. Every dispatch says what "tests" means for its
task, per `roles/jisso.md`'s "Verification when the plan ships documents".

- [ ] **Lint the changed paths by name.** `./scripts/lint.sh <file> [<file> ...]`
      (Windows: `scripts\lint.bat <file> ...`) on the nine files: the four
      templates, `skills/shoroku/SKILL.md`, the four installed copies. Every
      hook `Passed` or `Skipped`, none `Failed`. On the templates markdownlint
      is skipped by configuration; Task 1's scratch lint is where the
      template Markdown meets markdownlint, and its clean run is recorded in
      Task 1's report.
- [ ] **The passage checks, with needles from heredocs.** For each of the
      seven passages of Tasks 1 and 2, on the flattened file
      (`tr -d '\r' < <file> | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"`):
      the new passage returns `1`; for the two replacements the old passage
      returns `0`; for the five insertions the anchor still returns `1`. For
      the four installed copies the expanded-template diff (below) subsumes
      these checks byte for byte, and Task 3 step 6's six presence greps are
      their task-time form.
- [ ] **The spec's content greps, on templates and copies together** — the
      list in the Batches table's stop conditions, each with its expected
      count — and the absence grep, which prints nothing.
- [ ] **Headings unchanged.** For each template, `grep '^#' <file>` against
      `git show main:<file> | grep '^#'` differs only by the added
      `## requirements vs issues` in the requirements template.
- [ ] **The expanded-template diff** — the spec's loop with
      `--strip-trailing-cr` — prints `identical` for all four copies. This is
      the check that decides Task 3, not the heading grep: an added section
      in the wrong place passes the grep and fails the diff.
- [ ] **The refresh run's record.** Task 3's report carries kisou's numbered
      proposal verbatim, the answer given to each prompt (detected values
      confirmed, scripts declined, which items accepted, which offers
      rejected), and, for each of the spec's four points — a present
      doc-system refreshed or not, sections whose bodies carry `<id>`, the
      per-type fingerprint and any `.bak` offer, the added section's position
      — what kisou did; and the hand-mirrored passages, if any, named as
      findings against kisou.
- [ ] **The diff is exactly the passages.**
      `git diff "$(git merge-base main HEAD)" -- <file>` for each of the nine
      files, read hunk by hunk against the task's blocks (for the copies, the
      template blocks with the variables expanded).
- [ ] **Line endings.** `git ls-files --eol <file>` for each of the nine files
      shows the same `w/crlf` or `w/lf` it showed before the edit and never
      `w/mixed`.
- [ ] **The frontmatter hook and the PyYAML load** on `skills/shoroku/SKILL.md`:
      the hook passes; the load prints `shoroku`.
- [ ] **The READMEs.** Task 2's report records the drift check of
      `skills/shoroku/README.md` and `skills/kisou/README.md` against the
      changed passages, expected result: no edit; the README's pre-existing
      omission of file mode is listed as a shoroku candidate, not edited.
- [ ] **The whole-tree sweeps.** `git status --short` prints nothing (the
      workspace `.superpowers/sdd/` is ignored by its own `.gitignore`).
      `git diff "$(git merge-base main HEAD)" --stat` names, besides the spec
      `docs/superpowers/specs/2026-09-09-requirement-extraction-design.md`,
      the plan `docs/superpowers/plans/2026-09-09-requirement-extraction.md`, and
      paths under `docs/` from Kanri's own commits (T1 and any
      `docs(issues):` commit), exactly the nine files.
      `git diff --name-only "$(git merge-base main HEAD)" -- skills/tanto`
      prints nothing. `git status --porcelain -- docs | grep -c '\.bak'`
      prints `0`.
- [ ] **Commit by explicit path with the trailer**, then confirm it:
      `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'` returns `1`;
      at the boundary, every commit on `main..HEAD` outside the excluded
      subjects carries exactly one such line.
- [ ] **At the boundary, re-run the whole set of task-time checks of the
      batch**, not only the ones the boundary asked for — that is Task 4 for
      the spec's Verification set and the tree-wide sweeps; the per-passage
      flattened needles stay task-time checks of Tasks 1 and 2, and Task 4
      step 13's hunk-by-hunk read against the blocks is what re-decides them at
      the boundary.

Write-outs — T1, T2, and every exit shoroku — are outside this plan: they
write under `docs/requirements/`, `docs/design/`, `docs/decisions/`, and
`docs/issues/`, which no task touches, and their commits begin
`docs: T<n> shoroku` or `docs: exit shoroku`; the whole-branch review
package excludes exactly those subjects.

## Reporting protocol

Batch prompts and reports follow the tanto templates —
`skills/tanto/templates/batch-prompt.md` and
`skills/tanto/templates/batch-report.md` — and this plan names nothing else
about their shape; a Kaiseki brief and report follow
`skills/tanto/templates/kaiseki-brief.md` and
`skills/tanto/templates/kaiseki-report.md` the same way. No template is added
or changed by this plan, and no task touches `skills/tanto/`. The two things
this plan asks a report to carry beyond the template's own sections go in the
sections the template already has: kisou's numbered proposal, verbatim, with
the four points' outcomes (task 3, steps 3 and 4) and the checks' recorded
output (task 4) are the batch's evidence, and each mismatch is a
Rulings-needed item.

## Self-Review

**1. Spec coverage.** Every section of
`docs/superpowers/specs/2026-09-09-requirement-extraction-design.md` maps to a
task or is named here with the reason it has none:

| Spec section | Task |
| --- | --- |
| the opening paragraphs and the input list | no task: they name what the design closes and what it read; nothing to build |
| Fixed inputs | no task: its decisions are scope and shape, not deliverables — issue-ad1a alone, the branch cut after review-brief merges, the rule and its two tests, the docs-system-not-a-kisou-feature reading, no translation rule, the refresh through kisou, the three sections as put. They reach the run through Global Constraints and the Batches section, which Sekkei writes; the last of them is task 3's whole procedure |
| The mechanism that loses a requirement | no task: it is the diagnosis the six passages answer |
| The rule and the two tests — the requirements template | 1 (P1.2, the `## requirements vs issues` section, between `## Body` and `## Growth`, with the granularity gate and the `Direction?` gate inside it) |
| The rule and the two tests — the issues template | 1 (P1.3, the exit paragraph where classifiers read first) |
| The rule and the two tests — the Classify step | 1 (P1.4, step 2 replaced in full, "exactly one" kept) |
| The pairing — the design Body | 1 (P1.6, the `req-<id>` bullet with the explicit "serves none") |
| The pairing — the requirements Body | 1 (P1.1, the optional `design-<id>` bullet) |
| The pairing — the Propose step | 1 (P1.5, step 3 replaced in full, both flags as questions, the standing tree not swept) |
| shoroku | 2 (P2.1, the one paragraph in Step 3; the frontmatter untouched and load-checked; the two README drift checks on the changed passages, with the pre-existing source-mode omission recorded as a shoroku candidate rather than fixed) |
| This repository's copies: the refresh run | 3 (the migrate run in docs-only scope, the stand-in answers with their declines and rejections, the stop before kisou's commit, the verbatim proposal, the four points' outcomes, the expanded-template diff, the hand-mirror fallback with all six expanded passages, the `.bak` check) |
| Where each change lives | the File structure table above, row for row, and the seven passages of tasks 1 and 2 plus their six expanded mirrors in task 3; the table's last paragraph is the "Files that must NOT change" list |
| Requirements | no task: req-1a2b is exercised by task 3 and req-3c4d gains two Required-behavior bullets at T1, a write-out outside every plan task; issue-2c4d's manual drift check is task 4's sweep across templates, copies, and `SKILL.md`, and its "no ADR" ruling is Kanri's at T1 |
| What the plan must contain | the four tasks in this order, the needle rule stated once at the top of task 1 and used in every check, the scratch markdownlint of task 1 step 20, the per-task commit by explicit path with the trailer, the Reporting protocol section, and — Sekkei's to write — Global Constraints, Batches, and How a batch is verified |
| Verification | task 4 steps 1 to 12, one step per bullet, each with the spec's expectation and the measured baseline; the per-passage anchor, flattened, diff, line-ending, and lint checks inside tasks 1 to 3 |
| Out of scope | no task, by construction: no task names a `skills/tanto/` path (task 4 step 12 proves it), no task adds a translation rule or a kisou-side `docs/` scan, no task backfills `req-<id>` into an existing design entry, no task edits `skills/kisou/SKILL.md` where the run finds it ambiguous, and no task touches issues e5a2, b7d3, f2c4, 9d17, or 2c4d |
| Answers to the spec inputs | no task: I-1 and Kanri's five notes are answered by the passages and the procedure above; note 2's "rule 11 does not apply" is Sekkei's to state in Global Constraints and Batches |
| Deferred items | no task: the backfill is a later shoroku run's work, and the refresh run's three open points are measured by task 3 and reported, not fixed |
| Shoroku candidates from this spec work | no task: T1 and T2 write those under `docs/`, which no task touches outside the four installed copies |

**2. Placeholder scan.** No `TBD`, no `TODO`, no "implement later", no "similar
to task N", no "add appropriate …", no "write tests for the above". Every edit
step carries its anchor, its old passage where the shape is a replacement, and
its new passage, in full and verbatim; task 3's fallback repeats all six
passages expanded rather than pointing back at task 1, because a task may be
read out of order. Every verification step names the exact command and the
exact expected output, with the measured baseline beside it. Task 3's
stand-in answers are enumerated — the detected values, the scripts decline, the
docs-only scope, the accepts, the two rejections, the stop before the commit —
rather than left as "answer kisou's prompts". The three sections Global
Constraints, Batches, and How a batch is verified are Sekkei's own additions
under `skills/tanto/roles/sekkei.md` Step 3, written after the drafter's tasks
and merged in place of the drafter's three headings.

**3. Consistency across tasks.** Checked and reconciled:

- **File paths.** The nine paths of the File structure table are the same
  strings in every task's `Files:` block, in every `grep`, `diff`,
  `git ls-files --eol`, and `git diff` command, in every lint line, and in
  every commit command. No task names a tenth path, and the two READMEs appear
  only as checks.
- **Passage count.** Seven: two in the requirements template, one in the issues
  template, two in the docs template, one in the design template (task 1), one
  in `skills/shoroku/SKILL.md` (task 2); six of those seven — every one but
  P2.1 — are mirrored into the four installed copies by task 3 as M3.1 to M3.6.
  The spec's "Where each change lives" table has nine rows for the same seven
  passages, because it groups the copies into one row and the drift check into
  another.
- **Anchors and old passages.** Every anchor in tasks 1 and 2 was run with
  `grep -cF -- "$needle"` against the tree while this plan was written and
  returned `1`; every replacement's old passage was run in the flattened form
  and returned `1`. The expanded anchors of task 3's fallback were run against
  the four installed copies and returned `1` each.
- **The passages were applied and linted before this plan was written.** All
  six template passages were applied to scratch copies — never to the tree —
  expanded, and run through the pre-commit cache's markdownlint-cli2 with the
  repository configuration: `Summary: 0 error(s)`. The content greps of task 4
  were run on that scratch tree, which is where every "measured 2026-09-09"
  expectation in this plan comes from, and where the one mismatch with the
  spec's Verification — the wrapped `requirements vs issues` pointer in the two
  issues files — was found.
- **Variable expansion.** `{{docs}}` → `docs`, `{{requirements}}` →
  `requirements`, `{{design}}` → `design`, `{{issues}}` → `issues` is the only
  difference between task 1's blocks and task 3's; `{{decisions}}`,
  `{{notes}}`, and `{{reports}}` appear in no new passage but are in every
  `sed` pipeline, because the diff compares whole files. No new passage
  re-wraps a line, so the expanded-template diff can read `identical`.
- **Every grep needle of the spec's Verification sits on one line in the
  passage it pins.** The drafter found the issues paragraph wrapping
  "requirements vs issues" across a line break; Sekkei re-wrapped that block
  in the spec before the spec was committed, so the plan's block and the
  spec's agree and the raw count is `1` for the two issues files (task 1
  step 10, task 1 step 21, task 4 step 3).
- **Line endings.** No table. Each task's first step runs
  `git ls-files --eol` on its files and states the value it must read —
  `i/lf w/crlf attr/text=auto` for all nine paths in this working tree — and
  each task's later step expects the same value again, never `w/mixed`. Every
  passage is written CRLF. No task creates a file, so the `git add`-then-read
  dance an untracked path needs does not arise.
- **The diff form.** Every diff command is
  `git diff "$(git merge-base main HEAD)" -- <path>`, which sees the working
  tree and so is right both before and after a task's commit; no command uses
  `main...HEAD`. Hunk counts are labeled task-time checks, and every diff step
  tells the reader to match hunks to passages by text.
- **The trailer string.** Every commit command ends with
  `-m "Co-Authored-By: Claude <noreply@anthropic.com>"`, every per-task trailer
  check greps the prefix `Co-Authored-By: Claude`, and task 4 step 14 counts
  that same prefix across the branch's commits.
- **Linted versus ignored.** The four templates are markdownlint-ignored under
  `skills/**/templates/**`, so their bare `<id>` blanks and their long lines
  are correct there and task 1 step 20's scratch run is their markdownlint;
  `skills/shoroku/SKILL.md` and the four installed copies are checked, and
  every angle-bracket blank in the passages they receive sits inside a code
  span or a fenced block. The same nine paths appear in task 4 step 1's lint
  line, and its expectation says which hooks bind where.
- **Task order.** Task 3 depends on task 1 and says so in its Interfaces;
  task 2 names the terms task 1's P1.2 and P1.5 define and reviews
  `skills/kisou/README.md` after task 1 landed; task 4 runs last and edits
  nothing. The absence grep of the spec's Verification is run over `skills`
  alone in task 1 (the copy still carries the old text) and in its full
  `skills docs` form in task 4 — stated in both places.
