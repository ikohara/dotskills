# tanto review-brief Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change `skills/tanto/` and one note under `docs/notes/` so that a
third party writes a brief of the judgment points before the human reads a spec
or a plan, Sekkei keeps the spec dialogue's own words in a record, and Kanri
sends batch prompts and Kaiseki briefs without an idle subscription.

**Architecture:** Markdown only, and every edit is a **passage**, never a file.
For each of the twenty-two passages in the five existing files the task carries
three fenced blocks — the anchor line, the old passage verbatim from the tree,
the new passage verbatim from the spec — and changes no other byte, so the diff
of a touched file against the merge base is exactly the union of its passages
written so far. The twenty-third passage is a whole new file,
`skills/tanto/templates/review-brief.md`, the English source the brief writer
renders into the chat's language. `SKILL.md` carries the two terms the roles
route on, `review-ready: <path>` and `brief: <path>` (the two design rules of
design-4807); each obligation lives in the file of the role that performs it —
Sekkei's dialogue record and its two review-gate steps in `roles/sekkei.md`,
Kanri's dispatch and form check in `roles/kanri.md`; and the consistency note
gains the counts the new template moves and one new pinned block. There is no
executable code: verification is fixed-string greps on the tree, the per-file
merge-base diff, and lint on named paths.

**Tech Stack:** Markdown; `pre-commit` through `scripts/lint.sh` and
`scripts\lint.bat`; `git diff`, `git ls-files --eol`, `grep -cF` and `grep -nF`
with every needle set from a quoted heredoc; `uv run --no-project` with PyYAML
for the `SKILL.md` frontmatter load.

**Spec:** `docs/superpowers/specs/2026-09-08-review-brief-design.md` — the
binding authority. This plan argues from it; where the plan and the spec
disagree, the spec wins. Executors read both. The spec's sections "Where each
change lives", "What the plan must contain", and "Verification" are what the
tasks below implement.

## Global Constraints

- American English in every file, commit message, and comment.
- Every fenced `bash` block in this plan runs in **Git Bash**, from the repository root — on this Windows host, not PowerShell. Only the lint line has a `scripts\lint.bat` alternative; the greps, the `tr` pipelines, and the quoted heredocs have none.
- Lint before every commit: `./scripts/lint.sh <explicit file paths>` (Windows: `scripts\lint.bat <paths>`), every hook `Passed` or `Skipped`; a directory argument makes every hook skip, so always name files.
- Commit by explicit path only: `git add <paths>` then `git commit --only <paths> -m "<subject>" -m "<body>" -m "Co-Authored-By: Claude <noreply@anthropic.com>"`. Never `git add -A` / `.` / `-u`, never a bare `git commit` or `git commit -a`, never `--no-verify`, never amend. Branch `review-brief`; **no worktree**; **no push**.
- Every commit message ends with a trailer whose line begins `Co-Authored-By: Claude` — verify with `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'` (expect `1`). The plan's commands write `Co-Authored-By: Claude <noreply@anthropic.com>`; a harness that puts its model name after `Claude` satisfies the same check.
- Models for this run: implementers `sonnet`, every reviewer `opus`, fix-round escalation `opus`; never dispatch a subagent on `fable`; every dispatch names its `model`.
- **The authority for this run's sessions** is this section, Kanri's orders line, and the batch prompts — not the role text on disk, which this plan edits under the sessions that read it (contract rule 11; Kanri's R-3, recorded before any dispatch). **The batch B boundary is the boundary from which a role may be started or replaced, and it is the final boundary.** After batch A the contract defines `review-ready: <path>` and `brief: <path>`, two artifacts, ten templates, and the rule that batch prompts and briefs go out without an idle subscription, and the README describes the brief, while the two role files still send neither line and keep no `dialogue.md`, `roles/kanri.md` still subscribes on every prompt and brief, and the note still expects thirteen `ok` lines from check 2 and "Fifteen skill files, nine of them templates" — the forward-reference set, named in the Batches section and decided by the two sweeps in "How a batch is verified". Before the batch B boundary no role is replaced and no further role is created; this plan expects one Jisso throughout, and a replacement, if one is forced, waits for the batch B boundary as Sekkei's Step 3 bullet and rule 11 provide. Kanri applies the idle rule by its own ruling (R-4) from the first prompt of this run, so the tree's forward reference costs nothing at runtime.
- **Never edit** — the spec's unchanged list: `skills/tanto/roles/jisso.md`, `skills/tanto/roles/kaiseki.md`, every template but the new `skills/tanto/templates/review-brief.md`, `skills/tanto/templates/tanto.json`, the repo-root `README.md` and every other repo-root Markdown, anything under `docs/requirements/`, `docs/design/`, `docs/decisions/`, or `docs/issues/`, linter or formatter config, agent instruction files (`AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`), the `kisou` and `shoroku` skills, and the superpowers plugin.
- **The write-out exception to that rule.** T1, T2, and every exit shoroku write under `docs/requirements/`, `docs/design/`, `docs/decisions/`, and `docs/issues/`. No task in this plan touches those paths, and "never edit" above does **not** forbid a session's own shoroku write-out.
- **The hotfix lane stays closed on the six files this plan lists** (decision-2f36), although the plan carries passages rather than complete files; a defect noticed in one of them during the run is a Rulings-needed item, not a hotfix.
- **The whole-branch review package excludes** exactly the commits whose subject begins with `docs: T<n> shoroku` or `docs: exit shoroku`, and the dispatch says so. Kanri's own `docs(issues):` commits on this branch, if any, are outside the plan's scope; the dispatch lists them by subject from `git log --format=%s main..HEAD` and names them as such. Task 6's note commit is plan output and stays in the package.
- **Passages, not files.** A task replaces exactly the old passage with the new one, or inserts the new passage next to its anchor, and the file's other bytes do not change; the new template is one passage of its own shape. Each of the twenty-three passages is written once; a file may be touched by more than one task, and the diff of a file against the merge base — `git diff "$(git merge-base main HEAD)" -- <file>`, which sees the working tree and so is right before and after a task's commit — is exactly its passages so far. No task makes a fix outside its passages: such a fix is a Rulings-needed item in the report, and the whole-branch review's fix wave is where a ruled correction lands.
- **Needles from heredocs.** Every anchor and passage check sets its needle with `needle=$(cat <<'EOF'` ... `EOF)` and passes it as `"$needle"`; a needle is never inlined in single or double quotes. A flattened `grep -cF` returns `0` or `1` and pins presence only; a per-file occurrence count is a raw `grep -cF` on the file.
- **Line endings per file, never mixed, and never encoded as a table.** `git ls-files --eol <file>` before each edit says which ending the file has in this working tree; a passage is written with that ending; after the edit the same command shows the same `w/crlf` or `w/lf`, never `w/mixed`. The new template is written LF and checked after `git add` (`i/lf w/lf`), because the command prints nothing for an untracked path. The index is LF throughout (`* text=auto`), so the "LF will be replaced by CRLF" warning at commit is not a defect.
- A task that edits `skills/tanto/SKILL.md` reviews `skills/tanto/README.md` for drift in the same task (repo rule from `AGENTS.md`); this plan edits both in consecutive tasks of the same batch, and the README task, Task 3, records the review against `SKILL.md` as Task 2 left it — the task in which a drift it finds can be acted on, which is the spec's intent for "the task that edits `SKILL.md`".
- `skills/tanto/SKILL.md`'s frontmatter is unchanged — `name: tanto`, `argument-hint: kanri | sekkei | jisso | kaiseki`, and a `description` whose value contains **no colon followed by a space**; the `check-md-frontmatter` hook parses it, and the `SKILL.md` task loads it through PyYAML — `uv run --no-project --with pyyaml python -c "import yaml;t=open('skills/tanto/SKILL.md',encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')"` — expecting `['argument-hint', 'description', 'name']` then `ok`; the fallback for a host that cannot fetch PyYAML is named there, once.
- Markdown follows `.markdownlint-cli2.yaml`: `docs/superpowers/**` and `skills/**/templates/**` are markdownlint-ignored; `skills/tanto/SKILL.md`, `skills/tanto/README.md`, `skills/tanto/roles/*.md`, and `docs/notes/**` are **not**, so in those files every `<placeholder>` outside a fenced block lives in a code span, never bare. The new template may carry bare `<...>` blanks.
- Runtime text inside the skill (`SKILL.md`, `roles/*.md`, `templates/*`) never names `skills/tanto/`; no new passage does. `skills/tanto/` appears only in this plan's own commands and in the note.
- The two routed strings, `review-ready: <path>` and `brief: <path>`, and `notify_when_idle: true`, each stay on one line wherever a passage carries them, so the note's new check 6 block can count them raw; after this plan the subscription string occurs only in the exit lines (twice in `SKILL.md`, twice in `roles/kanri.md`).
- No commit hashes and no user-specific paths in tracked content, decided by the note's check 7 — its commit-hash grep, read by eye, and its path greps.
- The skill's own wording says **multi-session orchestration**; "four" appears only where the current role set is listed. No passage changes either; check 7 counts them.

---

## File structure

Six files, twenty-three passages, one file new. Each passage's shape is the
spec's, from "Where each change lives": a **replacement** supersedes the old
passage; an **insertion** adds text next to an anchor that stays; the new file
is one passage of its own shape. Line endings are not tabulated here — the
consistency note forbids a plan from encoding them, because they are an
artifact of this working tree; each task states what `git ls-files --eol` shows
for its file before its first edit and expects the same value after.

| File | Passages | Task |
| --- | --- | --- |
| `skills/tanto/templates/review-brief.md` | the whole file (new file) | 1 |
| `skills/tanto/SKILL.md` | Messages, the bullet list (replacement); Artifacts, two rows after the `spec-inputs.md` row (insertion); the Templates sentence, ten (replacement) | 2 |
| `skills/tanto/README.md` | What it does, the review-brief bullet after the bug-reports bullet (insertion); Layout, the templates bullet (replacement); the closing sentence, four designs (replacement) | 3 |
| `skills/tanto/roles/sekkei.md` | Step 1, the `dialogue.md` paragraph (insertion); Step 1, the requirement-citation and review-gate paragraph (insertion); Step 2, the body (replacement); Step 3, the passage-plan paragraph (insertion); Step 4, the numbered list (replacement) | 4 |
| `skills/tanto/roles/kanri.md` | When the plan lands, step 5 (replacement); the batch loop, steps 1 to 8 (replacement); the Kaiseki branch, step 2 (replacement); Human access, item 5 after item 4 (insertion); Session lifecycle, the Replace table's first row (replacement) | 5 |
| `docs/notes/tanto-consistency-checks.md` | the opening, the flattened-count sentence (insertion); Versions, sixteen files and ten templates (replacement); check 1, the `ls` and its Expected (replacement); check 2, its Expected (replacement); check 3, the MAP and its Expected (replacement); check 6, a sixth and last block (insertion) | 6 |

Task 7 creates no file and edits none: it is the consistency pass, a
verification-only task whose deliverable is the recorded output of the checks
in `docs/notes/tanto-consistency-checks.md`.

Each file is touched by exactly one task. The invariant is per passage, not per
file: after each task, `git diff "$(git merge-base main HEAD)" -- <file>` shows
exactly that task's passages.

---

### Task 1: `templates/review-brief.md` — the review brief template

**Files:**

- Create: `skills/tanto/templates/review-brief.md` — one passage, a **new
  file**, the whole content.

**Interfaces:**

- Consumes: nothing. The tree as it stands on the branch.
- Produces: the path `templates/review-brief.md` that Task 2's Messages bullet
  and Templates sentence name, that Task 5's Human access item 5 names as the
  template the dispatch carries, and that Task 6's checks 1, 2, and 3 count.
  The template comes first so that no later task leaves `SKILL.md` naming a
  file that is not in the tree.
- The file lives under `skills/**/templates/**`, which is markdownlint-ignored,
  so its bare `<...>` blanks and its long lines are correct there. The
  trailing-whitespace, end-of-file, and mixed-line-ending hooks still apply.

**The needle form, used in every verification step of this plan.** Every anchor
and passage check sets its needle with a quoted heredoc and passes it as
`"$needle"`; a needle is never inlined in single or double quotes, because
nearly every passage contains an apostrophe or a backtick. A **raw** check
greps the file as it is — `grep -cF -- "$needle" <file>` — and counts lines,
so it pins a phrase that stays on one line. A **flattened** check strips CR,
joins the lines with spaces, and squeezes the runs —
`tr -d '\r' < <file> | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"` — so
it pins a passage that wraps, and it returns `0` or `1`, never an occurrence
count. The needle of a flattened check is written as one physical line inside
the heredoc. Every fenced `bash` block in this plan runs in Git Bash, from the
repository root.

- [ ] **Step 1: Confirm the file is not in the tree yet**

Run: `ls skills/tanto/templates/review-brief.md`
Expected: `ls: cannot access 'skills/tanto/templates/review-brief.md': No such file or directory`

Run: `git ls-files skills/tanto/templates/review-brief.md`
Expected: no output — the path is neither tracked nor present.

- [ ] **Step 2: Create the file with the template's whole content**

New file — the spec's block under "The brief › The template", written **LF**,
seventy-two lines, with a final newline and no trailing whitespace:

````markdown
# Review brief — <spec or plan> — <topic>

Written by the brief writer Kanri dispatches, at
`.superpowers/sdd/<topic>/review-brief-spec.md` or `review-brief-plan.md`,
next to the review reports and untracked under `.superpowers/sdd/.gitignore`.
Every part of the brief, these headings included, is written in the chat's
language, which the dispatch names; this template is the English source the
writer renders. The brief selects and renders; it does not analyze anew.

Document: <path> — brief written <YYYY-MM-DD> on <model family> for the chat
language <language>. Inputs read: <the document; for a spec also
spec-inputs.md and dialogue.md; for a plan also the spec>.

## How to answer

Answer in a numbered list, one line per point, `<section>.<point>` then the
reply. The shapes: `OK` confirms the document's answer; `→ <option>` chooses
one of the options a point names; `→ <decision>` decides what the document
left open; `change: <what>` accepts with an edit; `later: <reason>` defers.
`all OK` confirms every point tagged confirm at once, and a point not
mentioned counts as confirmed. Example:

    all OK
    2.1 → (b)
    3.1 change: the bullet reads "..."
    4.2 later: measure first

Each point opens with what it asks of you: **confirm** — the document
decided, say OK or object; **choose** — the document names options, pick
one; **decide** — the document left it open, your answer decides it;
**nothing** — information, no answer needed unless you object. Then the
question, in one sentence; the document's answer, in one sentence; and the
pointer — the document's section heading that answers it, copied as it
stands in the document and not translated, never a line number; the pointer
is the one part of a point not rendered into the chat's language. At most
five points per section; what does not fit goes to the last section, one
line each. For a spec, section 5's body is the single line
`<not applicable — a spec>`.

## 1. Scope and what was excluded

1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section>

## 2. Choices among alternatives, with the rejected ones and their reasons

1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section>

## 3. Requirements

Two questions per item: which requirement this design serves — read from the
document's own `req-<id>` citations, "not stated" when it has none — and
whether it adds to or changes a requirement or an ADR. A point that adds or
changes one asks you to confirm its wording; a point that serves one and
changes nothing asks nothing.

1. [confirm | nothing] Serves: <req-<id>, the bullet, or "not stated"> — Adds or changes: <yes: what, or no> — See: <section>

## 4. Deferred items

1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section>

## 5. For a plan: the batch cut, the replacement boundary, what each batch verifies

1. [confirm | choose | decide | nothing] Q: <...> — A: <...> — See: <section>

## What the writer could not settle

Each line says what an answer here does: "no answer needed unless you
object" for a decided item that overflowed its section, or "an answer here
decides <what>" for a gap the document leaves.

- [nothing | decide] <the point, one line> — <no answer needed unless you object | an answer here decides <what>>
````

- [ ] **Step 3: Verify the headings, in order**

Run: `grep '^#' skills/tanto/templates/review-brief.md`
Expected, in this order, eight lines:

````text
# Review brief — <spec or plan> — <topic>
## How to answer
## 1. Scope and what was excluded
## 2. Choices among alternatives, with the rejected ones and their reasons
## 3. Requirements
## 4. Deferred items
## 5. For a plan: the batch cut, the replacement boundary, what each batch verifies
## What the writer could not settle
````

- [ ] **Step 4: Verify the line ending, after `git add`**

`git ls-files --eol` prints nothing for an untracked path, so the file is staged
first and the ending read from the index and the working tree together.

````bash
git add skills/tanto/templates/review-brief.md
git ls-files --eol skills/tanto/templates/review-brief.md
````

Expected: `i/lf    w/lf    attr/text=auto` — never `w/crlf`, never `w/mixed`.

- [ ] **Step 5: The diff is exactly the new file**

Run: `git diff "$(git merge-base main HEAD)" -- skills/tanto/templates/review-brief.md`
Expected: one new file, seventy-two added lines, nothing removed.

Run: `git diff "$(git merge-base main HEAD)" -- skills/tanto/templates/review-brief.md | grep -c '^@@'`
Expected: `1`. A task-time check, measured while this plan was drafted.

- [ ] **Step 6: Lint the path**

Run: `./scripts/lint.sh skills/tanto/templates/review-brief.md` (Windows: `scripts\lint.bat skills/tanto/templates/review-brief.md`)
Expected: every hook `Passed` or `Skipped`, none `Failed`. Name the file — a
directory argument makes every hook skip and proves nothing.

- [ ] **Step 7: Commit**

Commit by explicit path, the only form this repository allows:

````bash
git add skills/tanto/templates/review-brief.md
git commit --only skills/tanto/templates/review-brief.md -m "feat(tanto): the review brief template, the tenth" -m "templates/review-brief.md is the English source the brief writer renders into the chat's language: How to answer with the reply shapes and one worked example, the five fixed sections, and the section for what the writer could not settle. It lands before the contract names it, so no task leaves SKILL.md pointing at a file that is not in the tree." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 8: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 2: `SKILL.md` — the two routed lines, the two artifacts, ten templates

**Files:**

- Modify: `skills/tanto/SKILL.md` — three passages. Messages, the bullet list,
  a **replacement**; Artifacts, two rows after the `spec-inputs.md` row, an
  **insertion**; the Templates sentence, a **replacement**.

**Interfaces:**

- Consumes: `skills/tanto/templates/review-brief.md` from Task 1 — the
  Messages bullet and the Templates sentence both name it, and check 2 of the
  note resolves it as a path.
- Produces: the two terms two or more roles route on, each on one line of its
  own — `review-ready: <path>` and `brief: <path>` — which Task 4 sends from
  `roles/sekkei.md` and Task 5 answers from `roles/kanri.md`; the two artifact
  rows `dialogue.md` and the two brief paths, which Task 4 writes and Task 5
  dispatches; and the sentence that names ten templates, which Task 6's
  Versions line counts.
- `skills/tanto/SKILL.md` is markdownlint-checked, so every angle-bracket
  blank in the new passages sits inside a code span, never bare. Its
  frontmatter is not touched by any passage here.
- The README's three passages and the drift review the repository's `AGENTS.md`
  asks for after a `SKILL.md` edit are Task 3, the next task of this same
  batch.

- [ ] **Step 1: Read the file's line ending, before the first edit**

Run: `git ls-files --eol skills/tanto/SKILL.md`
Expected: `i/lf    w/lf    attr/text=auto`. Every passage below is written LF.

- [ ] **Step 2: Verify the P2.1 anchor, before the edit**

Anchor — one current line of `skills/tanto/SKILL.md`, which occurs there
exactly once.
It is the first line of the bullet this passage rewrites.

````markdown
- Kanri sends every batch prompt and every Kaiseki brief with
````

Run:

````bash
needle=$(cat <<'EOF'
- Kanri sends every batch prompt and every Kaiseki brief with
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`

- [ ] **Step 3: P2.1 — replace the passage**

This is a **replacement**: the whole bullet list of the Messages section,
between the heading and the paragraph that begins "A defect noticed in a
skill", is replaced. The first, second, fourth, fifth, and last bullets are the
file's current text, transcribed; the third and sixth change for I-4 and the
seventh is new. The two paragraphs after the list — the bug report and the five
`triage:` forms — are untouched.

Old passage — replace exactly these 18 lines of `skills/tanto/SKILL.md` and
nothing else:

````markdown
- One boss. Only Kanri messages Jisso. Sekkei and Kaiseki never do — inbound
  messages queue and drain in order, and a second boss interleaves
  instructions.
- A message is one line plus a path. Report bodies, rulings, briefs, and plans
  live in files: a message dies with the session, a file survives compaction
  and a VS Code restart.
- Kanri sends every batch prompt and every Kaiseki brief with
  `notify_when_idle: true`. The receiver also sends one line back when its
  report is written. Either signal is enough to proceed.
- Never poll `ListAgents`; never send "are you done". Check the listing only
  when an expected signal did not arrive.
- A reply copies the incoming message's `from` into `to`.
- At a batch boundary Kanri has verified, Sekkei answers in one line,
  `committed <subject>` or `nothing to commit`; Kanri sends the next batch
  prompt only after that reply or Sekkei's idle notice.
- Permission boundaries are per session. Never ask a peer for work that was
  denied in your own session or would be blocked there. Blocked work goes to
  Kanri, which rules on human access.
````

New passage — the spec's block under "The flow › The lines, in the contract",
written with the file's LF ending:

````markdown
- One boss. Only Kanri messages Jisso. Sekkei and Kaiseki never do — inbound
  messages queue and drain in order, and a second boss interleaves
  instructions.
- A message is one line plus a path. Report bodies, rulings, briefs, and plans
  live in files: a message dies with the session, a file survives compaction
  and a VS Code restart.
- Kanri sends batch prompts and Kaiseki briefs **without** an idle
  subscription and waits for the receiver's one-line report. It subscribes —
  a pure `notify_when_idle`, no message — only when an expected signal is
  overdue, and treats a notice that arrives before the report as a reason to
  check the workspace, never as the signal: a peer's turn ends whenever it
  dispatches a subagent, so most notices are false idles. The exit lines keep
  their `notify_when_idle: true`, because there the idle notice is the
  forced-exit signal by design.
- Never poll `ListAgents`; never send "are you done". Check the listing only
  when an expected signal did not arrive.
- A reply copies the incoming message's `from` into `to`.
- At a batch boundary Kanri has verified, Sekkei answers in one line,
  `committed <subject>` or `nothing to commit`; Kanri sends the next batch
  prompt only after that reply, or, when the reply is overdue, after the
  notice of a subscription made then.
- Before the human reviews a spec or a plan, Sekkei sends Kanri
  `review-ready: <path>`. Kanri dispatches the **review brief** on
  `subagents.reviewer` — a read-only subagent that writes
  `.superpowers/sdd/<topic>/review-brief-spec.md` or `review-brief-plan.md`
  from `templates/review-brief.md`, in the chat's language — checks its form,
  and answers `brief: <path>`. Sekkei puts the brief's text verbatim in its
  review request, with both paths. The human's answers to the brief's points
  are the confirmation that review asks for; the document is what the points
  point into, and the human reads it where a point sends them.
- Permission boundaries are per session. Never ask a peer for work that was
  denied in your own session or would be blocked there. Blocked work goes to
  Kanri, which rules on human access.
````

- [ ] **Step 4: Verify P2.1**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
- One boss. Only Kanri messages Jisso. Sekkei and Kaiseki never do — inbound messages queue and drain in order, and a second boss interleaves instructions. - A message is one line plus a path. Report bodies, rulings, briefs, and plans live in files: a message dies with the session, a file survives compaction and a VS Code restart. - Kanri sends batch prompts and Kaiseki briefs **without** an idle subscription and waits for the receiver's one-line report. It subscribes — a pure `notify_when_idle`, no message — only when an expected signal is overdue, and treats a notice that arrives before the report as a reason to check the workspace, never as the signal: a peer's turn ends whenever it dispatches a subagent, so most notices are false idles. The exit lines keep their `notify_when_idle: true`, because there the idle notice is the forced-exit signal by design. - Never poll `ListAgents`; never send "are you done". Check the listing only when an expected signal did not arrive. - A reply copies the incoming message's `from` into `to`. - At a batch boundary Kanri has verified, Sekkei answers in one line, `committed <subject>` or `nothing to commit`; Kanri sends the next batch prompt only after that reply, or, when the reply is overdue, after the notice of a subscription made then. - Before the human reviews a spec or a plan, Sekkei sends Kanri `review-ready: <path>`. Kanri dispatches the **review brief** on `subagents.reviewer` — a read-only subagent that writes `.superpowers/sdd/<topic>/review-brief-spec.md` or `review-brief-plan.md` from `templates/review-brief.md`, in the chat's language — checks its form, and answers `brief: <path>`. Sekkei puts the brief's text verbatim in its review request, with both paths. The human's answers to the brief's points are the confirmation that review asks for; the document is what the points point into, and the human reads it where a point sends them. - Permission boundaries are per session. Never ask a peer for work that was denied in your own session or would be blocked there. Blocked work goes to Kanri, which rules on human access.
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The old passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
- One boss. Only Kanri messages Jisso. Sekkei and Kaiseki never do — inbound messages queue and drain in order, and a second boss interleaves instructions. - A message is one line plus a path. Report bodies, rulings, briefs, and plans live in files: a message dies with the session, a file survives compaction and a VS Code restart. - Kanri sends every batch prompt and every Kaiseki brief with `notify_when_idle: true`. The receiver also sends one line back when its report is written. Either signal is enough to proceed. - Never poll `ListAgents`; never send "are you done". Check the listing only when an expected signal did not arrive. - A reply copies the incoming message's `from` into `to`. - At a batch boundary Kanri has verified, Sekkei answers in one line, `committed <subject>` or `nothing to commit`; Kanri sends the next batch prompt only after that reply or Sekkei's idle notice. - Permission boundaries are per session. Never ask a peer for work that was denied in your own session or would be blocked there. Blocked work goes to Kanri, which rules on human access.
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 5: Verify the P2.2 anchor, before the edit**

Anchor — one current line of `skills/tanto/SKILL.md`, which occurs there
exactly once.

````markdown
| `.superpowers/sdd/<topic>/spec-inputs.md` (optional) | Kanri | Sekkei | scope inputs the human gave Kanri during spec work, numbered `I-n`, each with Kanri's advisory notes |
````

Run:

````bash
needle=$(cat <<'EOF'
| `.superpowers/sdd/<topic>/spec-inputs.md` (optional) | Kanri | Sekkei | scope inputs the human gave Kanri during spec work, numbered `I-n`, each with Kanri's advisory notes |
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`

- [ ] **Step 6: P2.2 — insert the passage**

This is an **insertion** into the Artifacts table: the two new rows go
immediately after the `spec-inputs.md` row, with no blank line between them,
and the `batch-<X>-prompt.md` row that follows stays where it is.

Old passage — the anchor line, which stays exactly as it is. The new passage
goes **after** it:

````markdown
| `.superpowers/sdd/<topic>/spec-inputs.md` (optional) | Kanri | Sekkei | scope inputs the human gave Kanri during spec work, numbered `I-n`, each with Kanri's advisory notes |
````

New passage — the spec's block under "The flow › The artifacts", written with
the file's LF ending:

````markdown
| `.superpowers/sdd/<topic>/dialogue.md` | Sekkei | Kanri, the brief writer, T1 | the spec dialogue: each question Sekkei put and the human's answer, verbatim, in order |
| `.superpowers/sdd/<topic>/review-brief-spec.md`, `.superpowers/sdd/<topic>/review-brief-plan.md` | the brief writer Kanri dispatches | Kanri, then the human through Sekkei | the review brief, from `templates/review-brief.md`, in the chat's language |
````

- [ ] **Step 7: Verify P2.2**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
| `.superpowers/sdd/<topic>/dialogue.md` | Sekkei | Kanri, the brief writer, T1 | the spec dialogue: each question Sekkei put and the human's answer, verbatim, in order | | `.superpowers/sdd/<topic>/review-brief-spec.md`, `.superpowers/sdd/<topic>/review-brief-plan.md` | the brief writer Kanri dispatches | Kanri, then the human through Sekkei | the review brief, from `templates/review-brief.md`, in the chat's language |
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The anchor, raw, still in the file:

````bash
needle=$(cat <<'EOF'
| `.superpowers/sdd/<topic>/spec-inputs.md` (optional) | Kanri | Sekkei | scope inputs the human gave Kanri during spec work, numbered `I-n`, each with Kanri's advisory notes |
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`

- [ ] **Step 8: Verify the P2.3 anchor, before the edit**

Anchor — one current line of `skills/tanto/SKILL.md`, which occurs there
exactly once.

````markdown
Templates are copied and filled, never restated in prose. There are nine:
````

Run:

````bash
needle=$(cat <<'EOF'
Templates are copied and filled, never restated in prose. There are nine:
EOF
)
grep -cF -- "$needle" skills/tanto/SKILL.md
````

Expected: `1`

- [ ] **Step 9: P2.3 — replace the passage**

This is a **replacement**: the sentence and its list of template names, five
lines, become six. `templates/review-brief.md` is inserted before
`templates/tanto.json`, and "nine" becomes "ten".

Old passage — replace exactly these 5 lines of `skills/tanto/SKILL.md` and
nothing else:

````markdown
Templates are copied and filled, never restated in prose. There are nine:
`templates/roster.md`, `templates/kanri.md`, `templates/kanri-handover.md`,
`templates/bug-report.md`, `templates/batch-prompt.md`,
`templates/batch-report.md`, `templates/kaiseki-brief.md`,
`templates/kaiseki-report.md`, and `templates/tanto.json`.
````

New passage — the spec's block under "The flow › The artifacts", written with
the file's LF ending:

````markdown
Templates are copied and filled, never restated in prose. There are ten:
`templates/roster.md`, `templates/kanri.md`, `templates/kanri-handover.md`,
`templates/bug-report.md`, `templates/batch-prompt.md`,
`templates/batch-report.md`, `templates/kaiseki-brief.md`,
`templates/kaiseki-report.md`, `templates/review-brief.md`, and
`templates/tanto.json`.
````

- [ ] **Step 10: Verify P2.3**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
Templates are copied and filled, never restated in prose. There are ten: `templates/roster.md`, `templates/kanri.md`, `templates/kanri-handover.md`, `templates/bug-report.md`, `templates/batch-prompt.md`, `templates/batch-report.md`, `templates/kaiseki-brief.md`, `templates/kaiseki-report.md`, `templates/review-brief.md`, and `templates/tanto.json`.
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The old passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
Templates are copied and filled, never restated in prose. There are nine: `templates/roster.md`, `templates/kanri.md`, `templates/kanri-handover.md`, `templates/bug-report.md`, `templates/batch-prompt.md`, `templates/batch-report.md`, `templates/kaiseki-brief.md`, `templates/kaiseki-report.md`, and `templates/tanto.json`.
EOF
)
tr -d '\r' < skills/tanto/SKILL.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 11: The three routed strings, raw, in `SKILL.md`**

The two brief lines and the idle subscription each stay on one line where they
occur, so a raw `grep -cF` counts their occurrences.

````bash
grep -cF 'review-ready: <' skills/tanto/SKILL.md
grep -cF 'brief: <path>' skills/tanto/SKILL.md
grep -cF 'notify_when_idle: true' skills/tanto/SKILL.md
````

Expected: `1`, `1`, `2`. The two `notify_when_idle: true` are the Messages
bullet's exception and the Session exit paragraph; the batch-prompt and
Kaiseki-brief subscriptions are gone from the contract.

- [ ] **Step 12: The frontmatter still parses, and its `description` has no colon-space**

Run:

````bash
uv run --no-project --with pyyaml python -c "import yaml;t=open('skills/tanto/SKILL.md',encoding='utf-8').read().split('---')[1];d=yaml.safe_load(t);print(sorted(d));print('BAD' if ': ' in d['description'] else 'ok')"
````

Expected: `['argument-hint', 'description', 'name']`, then `ok`. A colon followed
by a space inside the `description` value silently breaks the frontmatter parse,
which is why the check loads the real YAML rather than reading the line.

If this host cannot fetch PyYAML, run the fallback and record in the batch report
that the fallback was used and why:

````bash
sed -n 's/^description: //p' skills/tanto/SKILL.md | grep -c ': '
````

Expected: `0`.

- [ ] **Step 13: Runtime text still never names `skills/tanto/`**

Run: `grep -n 'skills/tanto/' skills/tanto/SKILL.md`
Expected: no output at all (the command exits 1). The contract names the
working tree's own copy — `templates/review-brief.md`, not the repository path.

- [ ] **Step 14: The diff is exactly this task's passages**

Run: `git diff "$(git merge-base main HEAD)" -- skills/tanto/SKILL.md`
Expected: three hunks — the Messages bullet list, the two Artifacts rows,
and the Templates sentence — and nothing else.

Run: `git diff "$(git merge-base main HEAD)" -- skills/tanto/SKILL.md | grep -c '^@@'`
Expected: `3`. A task-time check, measured on scratch copies of the tree with a
3-context unified diff while this plan was drafted; `git diff` merges two changed
regions into one hunk when at most six unchanged lines separate them, so read the
hunks against the blocks above rather than trusting the number alone.

- [ ] **Step 15: The line ending did not change**

Run: `git ls-files --eol skills/tanto/SKILL.md`
Expected: `i/lf    w/lf    attr/text=auto` — the same `w/lf` this task read
before its first edit, and never `w/mixed`.

- [ ] **Step 16: Lint the path**

Run: `./scripts/lint.sh skills/tanto/SKILL.md` (Windows: `scripts\lint.bat skills/tanto/SKILL.md`)
Expected: every hook `Passed` or `Skipped`, none `Failed`. Name the file — a
directory argument makes every hook skip and proves nothing.

- [ ] **Step 17: Commit**

Commit by explicit path, the only form this repository allows:

````bash
git add skills/tanto/SKILL.md
git commit --only skills/tanto/SKILL.md -m "feat(tanto): the contract carries the review brief and drops the idle subscriptions" -m "Messages gains the review-brief bullet with review-ready: <path> and brief: <path>, and its idle rule becomes the report line with a subscription only when a signal is overdue; the exit lines keep theirs. Artifacts gains the dialogue record and the two brief files. Templates counts ten." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 18: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 3: `README.md` — the brief, ten templates, four designs

**Files:**

- Modify: `skills/tanto/README.md` — three passages. What it does, a bullet
  after the bug-reports bullet, an **insertion**; Layout, the templates
  bullet, a **replacement**; the closing sentence, a **replacement**.

**Interfaces:**

- Consumes: `skills/tanto/templates/review-brief.md` from Task 1, which the
  Layout bullet names, and the contract's description of the brief from Task 2,
  which the What it does bullet summarizes for a reader outside the protocol.
- Produces: nothing a later task reads. `README.md` is documentation; no role
  file and no template points into it.
- `skills/tanto/README.md` is markdownlint-checked. None of the three passages
  carries an angle-bracket blank.
- This task also records the README drift review that this repository's
  `AGENTS.md` asks for after a `SKILL.md` edit; Task 2 of this batch made that
  edit.

- [ ] **Step 1: Read the file's line ending, before the first edit**

Run: `git ls-files --eol skills/tanto/README.md`
Expected: `i/lf    w/lf    attr/text=auto`. Every passage below is written LF.

- [ ] **Step 2: Verify the P3.1 anchor, before the edit**

Anchor — one current line of `skills/tanto/README.md`, which occurs there
exactly once.
It is the last line of the bug-reports bullet.

````markdown
  root-cause session, a one-line hotfix, or an input to a spec in progress.
````

Run:

````bash
needle=$(cat <<'EOF'
  root-cause session, a one-line hotfix, or an input to a spec in progress.
EOF
)
grep -cF -- "$needle" skills/tanto/README.md
````

Expected: `1`

- [ ] **Step 3: P3.1 — insert the passage**

This is an **insertion** into the What it does list: the new bullet goes
immediately after the bug-reports bullet, with no blank line between them, and
before the bullet that begins "- Composes, without editing them".

Old passage — the anchor line, which stays exactly as it is. The new passage
goes **after** it:

````markdown
  root-cause session, a one-line hotfix, or an input to a spec in progress.
````

New passage — the spec's block under "The flow › The README", written with the
file's LF ending:

````markdown
- Puts a **review brief** in front of the human before each spec and plan
  review: the points that need the human's judgment, each with a pointer into
  the document, in the chat's language, written by a third party Kanri
  dispatches — so the human confirms those and reads the rest only where a
  point sends them.
````

- [ ] **Step 4: Verify P3.1**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
- Puts a **review brief** in front of the human before each spec and plan review: the points that need the human's judgment, each with a pointer into the document, in the chat's language, written by a third party Kanri dispatches — so the human confirms those and reads the rest only where a point sends them.
EOF
)
tr -d '\r' < skills/tanto/README.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The anchor, raw, still in the file:

````bash
needle=$(cat <<'EOF'
  root-cause session, a one-line hotfix, or an input to a spec in progress.
EOF
)
grep -cF -- "$needle" skills/tanto/README.md
````

Expected: `1`

- [ ] **Step 5: Verify the P3.2 anchor, before the edit**

Anchor — one current line of `skills/tanto/README.md`, which occurs there
exactly once.

````markdown
- `templates/` — copy-and-fill skeletons: `roster.md`, `kanri.md` (the
````

Run:

````bash
needle=$(cat <<'EOF'
- `templates/` — copy-and-fill skeletons: `roster.md`, `kanri.md` (the
EOF
)
grep -cF -- "$needle" skills/tanto/README.md
````

Expected: `1`

- [ ] **Step 6: P3.2 — replace the passage**

This is a **replacement**: the Layout section's templates bullet, four lines,
becomes four with `review-brief.md` added before `tanto.json`.

Old passage — replace exactly these 4 lines of `skills/tanto/README.md` and
nothing else:

````markdown
- `templates/` — copy-and-fill skeletons: `roster.md`, `kanri.md` (the
  conductor ledger), `kanri-handover.md`, `bug-report.md`, `batch-prompt.md`,
  `batch-report.md`, `kaiseki-brief.md`, `kaiseki-report.md`, and `tanto.json`
  (the built-in expected-model defaults).
````

New passage — the spec's block under "The flow › The README", written with the
file's LF ending:

````markdown
- `templates/` — copy-and-fill skeletons: `roster.md`, `kanri.md` (the
  conductor ledger), `kanri-handover.md`, `bug-report.md`, `batch-prompt.md`,
  `batch-report.md`, `kaiseki-brief.md`, `kaiseki-report.md`,
  `review-brief.md`, and `tanto.json` (the built-in expected-model defaults).
````

- [ ] **Step 7: Verify P3.2**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
- `templates/` — copy-and-fill skeletons: `roster.md`, `kanri.md` (the conductor ledger), `kanri-handover.md`, `bug-report.md`, `batch-prompt.md`, `batch-report.md`, `kaiseki-brief.md`, `kaiseki-report.md`, `review-brief.md`, and `tanto.json` (the built-in expected-model defaults).
EOF
)
tr -d '\r' < skills/tanto/README.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The old passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
- `templates/` — copy-and-fill skeletons: `roster.md`, `kanri.md` (the conductor ledger), `kanri-handover.md`, `bug-report.md`, `batch-prompt.md`, `batch-report.md`, `kaiseki-brief.md`, `kaiseki-report.md`, and `tanto.json` (the built-in expected-model defaults).
EOF
)
tr -d '\r' < skills/tanto/README.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 8: Verify the P3.3 anchor, before the edit**

Anchor — one current line of `skills/tanto/README.md`, which occurs there
exactly once.

````markdown
The designs this skill implements are
````

Run:

````bash
needle=$(cat <<'EOF'
The designs this skill implements are
EOF
)
grep -cF -- "$needle" skills/tanto/README.md
````

Expected: `1`

- [ ] **Step 9: P3.3 — replace the passage**

This is a **replacement**: the closing sentence names three designs and now
names four.

Old passage — replace exactly these 4 lines of `skills/tanto/README.md` and
nothing else:

````markdown
The designs this skill implements are
`docs/superpowers/specs/2026-09-06-tanto-design.md`,
`docs/superpowers/specs/2026-09-07-kanri-lifecycle-design.md`, and
`docs/superpowers/specs/2026-09-07-boundary-rules-design.md`.
````

New passage — the spec's block under "The flow › The README", written with the
file's LF ending:

````markdown
The designs this skill implements are
`docs/superpowers/specs/2026-09-06-tanto-design.md`,
`docs/superpowers/specs/2026-09-07-kanri-lifecycle-design.md`,
`docs/superpowers/specs/2026-09-07-boundary-rules-design.md`, and
`docs/superpowers/specs/2026-09-08-review-brief-design.md`.
````

- [ ] **Step 10: Verify P3.3**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
The designs this skill implements are `docs/superpowers/specs/2026-09-06-tanto-design.md`, `docs/superpowers/specs/2026-09-07-kanri-lifecycle-design.md`, `docs/superpowers/specs/2026-09-07-boundary-rules-design.md`, and `docs/superpowers/specs/2026-09-08-review-brief-design.md`.
EOF
)
tr -d '\r' < skills/tanto/README.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The old passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
The designs this skill implements are `docs/superpowers/specs/2026-09-06-tanto-design.md`, `docs/superpowers/specs/2026-09-07-kanri-lifecycle-design.md`, and `docs/superpowers/specs/2026-09-07-boundary-rules-design.md`.
EOF
)
tr -d '\r' < skills/tanto/README.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 11: Record the README drift review**

Read `skills/tanto/README.md` section by section against `skills/tanto/SKILL.md` as
Task 2 left it, and record the result in the batch report as this checklist, one
line each with what was read and what was found:

- [ ] **What it does** — the six bullets plus the new seventh. Expected: the
  review-brief bullet is the only change; the other six still describe the
  contract as it stands.
- [ ] **Prerequisites** — Claude Code, the superpowers plugin, a `kisou`-style
  `docs/` system, the optional `tanto.json`. Expected: no change; the brief adds
  no prerequisite, and the writer runs on `subagents.reviewer`, a key the
  built-in defaults already carry.
- [ ] **Usage** — the invocation forms and the handshake paragraph. Expected: no
  change; no role word, address form, or start line moves.
- [ ] **Layout** — `SKILL.md`, the four role files, the templates bullet.
  Expected: the templates bullet is the only change, and it lists the same ten
  names as `SKILL.md`'s Templates sentence.
- [ ] **Relationship to kisou, shoroku, and superpowers** — the two paragraphs.
  Expected: the closing sentence is the only change; the paragraph above it still
  holds, because the brief is an override written into tanto's own role files.
- [ ] **The closing sentence** — Expected: four design paths, the fourth being
  `docs/superpowers/specs/2026-09-08-review-brief-design.md`.

Expected overall: the three passages of this task are the only changes the review
finds. A drift the review does find outside them is a **Rulings needed** item in
the batch report, not a fourth passage.

- [ ] **Step 12: The diff is exactly this task's passages**

Run: `git diff "$(git merge-base main HEAD)" -- skills/tanto/README.md`
Expected: three hunks — the What it does bullet, the Layout templates
bullet, and the closing sentence — and nothing else.

Run: `git diff "$(git merge-base main HEAD)" -- skills/tanto/README.md | grep -c '^@@'`
Expected: `3`. A task-time check, measured on scratch copies of the tree with a
3-context unified diff while this plan was drafted; `git diff` merges two changed
regions into one hunk when at most six unchanged lines separate them, so read the
hunks against the blocks above rather than trusting the number alone.

- [ ] **Step 13: The line ending did not change**

Run: `git ls-files --eol skills/tanto/README.md`
Expected: `i/lf    w/lf    attr/text=auto` — the same `w/lf` this task read
before its first edit, and never `w/mixed`.

- [ ] **Step 14: Lint the path**

Run: `./scripts/lint.sh skills/tanto/README.md` (Windows: `scripts\lint.bat skills/tanto/README.md`)
Expected: every hook `Passed` or `Skipped`, none `Failed`. Name the file — a
directory argument makes every hook skip and proves nothing.

- [ ] **Step 15: Commit**

Commit by explicit path, the only form this repository allows:

````bash
git add skills/tanto/README.md
git commit --only skills/tanto/README.md -m "docs(tanto): the README describes the review brief and the tenth template" -m "What it does gains the review brief: the judgment points with a pointer into the document, in the chat's language, by a third party Kanri dispatches. Layout lists review-brief.md, and the closing sentence names the fourth design. The drift review of the other sections found nothing else to change." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 16: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 4: `roles/sekkei.md` — the dialogue record, the two review gates, three conventions

**Files:**

- Modify: `skills/tanto/roles/sekkei.md` — five passages. Step 1, the
  `dialogue.md` paragraph, an **insertion**; Step 1, the requirement-citation
  and review-gate paragraph, an **insertion**; Step 2, the body, a
  **replacement**; Step 3, the passage-plan paragraph, an **insertion**;
  Step 4, the numbered list, a **replacement**.

**Interfaces:**

- Consumes: the two terms Task 2 put in `SKILL.md` — `review-ready: <path>`
  and `brief: <path>` — which Step 2 and Step 4 send and idle on; and the
  `dialogue.md` artifact row Task 2 added.
- Produces: `.superpowers/sdd/<topic>/dialogue.md`, which Task 5's Human
  access item 5 names as an input to the dispatch; and the two `review-ready:`
  sends that Task 5's item 5 answers. The three plan conventions the previous
  run's T2 landed in design-4807 ride along here — the other role's check in
  Step 2, the wrap column and the passage shape in Step 3, the term sweep in
  Step 4 item 2 — because this plan edits Sekkei's file anyway.
- `skills/tanto/roles/sekkei.md` is markdownlint-checked; every angle-bracket
  blank in the new passages sits inside a code span.

- [ ] **Step 1: Read the file's line ending, before the first edit**

Run: `git ls-files --eol skills/tanto/roles/sekkei.md`
Expected: `i/lf    w/crlf    attr/text=auto`. Every passage below is written CRLF,
the ending this working tree has for this file.

- [ ] **Step 2: Verify the P4.1 anchor, before the edit**

Anchor — one current line of `skills/tanto/roles/sekkei.md`, which occurs there
exactly once.
It is the last line of Step 1's brainstorming paragraph.

````markdown
a one-liner.
````

Run:

````bash
needle=$(cat <<'EOF'
a one-liner.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/sekkei.md
````

Expected: `1`

- [ ] **Step 3: P4.1 — insert the passage**

This is an **insertion**: the new paragraph goes after the brainstorming
paragraph and before "Cut the branch from `main`", separated from each by one
blank line.

Old passage — the anchor line, which stays exactly as it is. The new passage
goes **after** it:

````markdown
a one-liner.
````

New passage — the spec's block under "The flow › Sekkei's obligations", written
with the file's CRLF ending:

````markdown
Keep `.superpowers/sdd/<topic>/dialogue.md` as you go: each question you put
and the human's answer, verbatim, in order. Kanri may read it at any time, the
brief writer reads it, and T1's shoroku takes it as an input — under this
protocol it is the one record of the human's own words.
````

- [ ] **Step 4: Verify P4.1**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
Keep `.superpowers/sdd/<topic>/dialogue.md` as you go: each question you put and the human's answer, verbatim, in order. Kanri may read it at any time, the brief writer reads it, and T1's shoroku takes it as an input — under this protocol it is the one record of the human's own words.
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The anchor, raw, still in the file:

````bash
needle=$(cat <<'EOF'
a one-liner.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/sekkei.md
````

Expected: `1`

- [ ] **Step 5: Verify the P4.2 anchor, before the edit**

Anchor — one current line of `skills/tanto/roles/sekkei.md`, which occurs there
exactly once.
It is the last line of Step 1's "Write the spec" paragraph.

````markdown
it, and neither can ask you what you meant without a round trip.
````

Run:

````bash
needle=$(cat <<'EOF'
it, and neither can ask you what you meant without a round trip.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/sekkei.md
````

Expected: `1`

- [ ] **Step 6: P4.2 — insert the passage**

This is an **insertion**: the new paragraph goes after the "Write the spec"
paragraph and before the `## Step 2 — spec review` heading, separated from each
by one blank line.

Old passage — the anchor line, which stays exactly as it is. The new passage
goes **after** it:

````markdown
it, and neither can ask you what you meant without a round trip.
````

New passage — the spec's block under "The flow › Sekkei's obligations", written
with the file's CRLF ending:

````markdown
In Fixed inputs, name the requirement each decision serves — `req-<id>` and
the bullet — or say that none does; the brief's third section reads it from
there. Commit the spec, then hold brainstorming's review gate: the human
reads the spec only after Step 2's brief has come back, and edits after the
human's answers are further commits.
````

- [ ] **Step 7: Verify P4.2**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
In Fixed inputs, name the requirement each decision serves — `req-<id>` and the bullet — or say that none does; the brief's third section reads it from there. Commit the spec, then hold brainstorming's review gate: the human reads the spec only after Step 2's brief has come back, and edits after the human's answers are further commits.
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The anchor, raw, still in the file:

````bash
needle=$(cat <<'EOF'
it, and neither can ask you what you meant without a round trip.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/sekkei.md
````

Expected: `1`

- [ ] **Step 8: Verify the P4.3 anchor, before the edit**

Anchor — one current line of `skills/tanto/roles/sekkei.md`, which occurs there
exactly once.
The heading stays; its body is what this passage replaces.

````markdown
## Step 2 — spec review
````

Run:

````bash
needle=$(cat <<'EOF'
## Step 2 — spec review
EOF
)
grep -cF -- "$needle" skills/tanto/roles/sekkei.md
````

Expected: `1`

- [ ] **Step 9: P4.3 — replace the passage**

This is a **replacement**: Step 2's body, everything between the `## Step 2 —
spec review` heading and the `## Step 3 — the plan` heading, is replaced. The
middle paragraph of the new passage is the file's current Step 2, transcribed;
the first and the last are new.

Old passage — replace exactly these 7 lines of `skills/tanto/roles/sekkei.md`
and nothing else:

````markdown
Dispatch a **read-only** reviewer on `subagents.reviewer`. Give it the spec and
the repo's `docs/decisions/` and `docs/requirements/`, ask it to check the
spec against them, and have it write its report to
`.superpowers/sdd/<topic>/spec-review.md` with a **Shoroku candidates**
section at the end. Rule on every finding yourself. Scope findings go to the
human; everything else is yours. Then send Kanri one line with the report
path: Kanri adopts from its Shoroku candidates.
````

New passage — the spec's block under "The flow › Sekkei's obligations", written
with the file's CRLF ending:

````markdown
Before the review, a passage in the spec that rewrites another role's
procedure goes to that role's session for a check, when that session is live:
send Kanri the passage and the question which of its obligations it touches;
Kanri relays it and answers as an `I-n`.

Dispatch a **read-only** reviewer on `subagents.reviewer`. Give it the spec and
the repo's `docs/decisions/` and `docs/requirements/`, ask it to check the
spec against them, and have it write its report to
`.superpowers/sdd/<topic>/spec-review.md` with a **Shoroku candidates**
section at the end. Rule on every finding yourself. Scope findings go to the
human; everything else is yours. Then send Kanri one line with the report
path: Kanri adopts from its Shoroku candidates.

Then send Kanri `review-ready: <spec path>` and idle until `brief: <path>`
arrives; never poll, and send the line again if Kanri's session was replaced
meanwhile — a restart, a handover — because the writer dies with the session
that dispatched it. Put brainstorming's review gate to the human with the
brief's text verbatim, the spec's path, and the brief's, and record the
human's answers in `dialogue.md` in the brief's reply shape. A new brief is
written when the human asks for one, or when the spec's judgment points
changed after the answers — a fixed input, a rejected alternative, a deferred
item — not when its prose did.
````

- [ ] **Step 10: Verify P4.3**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
Before the review, a passage in the spec that rewrites another role's procedure goes to that role's session for a check, when that session is live: send Kanri the passage and the question which of its obligations it touches; Kanri relays it and answers as an `I-n`. Dispatch a **read-only** reviewer on `subagents.reviewer`. Give it the spec and the repo's `docs/decisions/` and `docs/requirements/`, ask it to check the spec against them, and have it write its report to `.superpowers/sdd/<topic>/spec-review.md` with a **Shoroku candidates** section at the end. Rule on every finding yourself. Scope findings go to the human; everything else is yours. Then send Kanri one line with the report path: Kanri adopts from its Shoroku candidates. Then send Kanri `review-ready: <spec path>` and idle until `brief: <path>` arrives; never poll, and send the line again if Kanri's session was replaced meanwhile — a restart, a handover — because the writer dies with the session that dispatched it. Put brainstorming's review gate to the human with the brief's text verbatim, the spec's path, and the brief's, and record the human's answers in `dialogue.md` in the brief's reply shape. A new brief is written when the human asks for one, or when the spec's judgment points changed after the answers — a fixed input, a rejected alternative, a deferred item — not when its prose did.
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

Step 2's middle paragraph is the file's current text transcribed into the new passage, so the old passage as a whole still returns `1`; the two junction needles below are what decide that the old body is gone. First junction — the heading joined to the old first paragraph:

````bash
needle=$(cat <<'EOF'
## Step 2 — spec review Dispatch a **read-only** reviewer on `subagents.reviewer`. Give it the spec and
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

Second junction — the old last line joined to the next heading:

````bash
needle=$(cat <<'EOF'
path: Kanri adopts from its Shoroku candidates. ## Step 3 — the plan
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 11: Verify the P4.4 anchor, before the edit**

Anchor — one current line of `skills/tanto/roles/sekkei.md`, which occurs there
exactly once.
It is the first line of the paragraph the new passage goes before.

````markdown
The report and prompt skeletons do **not** go in the plan. The plan says that
````

Run:

````bash
needle=$(cat <<'EOF'
The report and prompt skeletons do **not** go in the plan. The plan says that
EOF
)
grep -cF -- "$needle" skills/tanto/roles/sekkei.md
````

Expected: `1`

- [ ] **Step 12: P4.4 — insert the passage**

This is an **insertion**: the new paragraph goes before the "The report and
prompt skeletons" paragraph, after the numbered bullet list of Step 3,
separated from each by one blank line.

Old passage — the anchor line, which stays exactly as it is. The new passage
goes **before** it:

````markdown
The report and prompt skeletons do **not** go in the plan. The plan says that
````

New passage — the spec's block under "The flow › Sekkei's obligations", written
with the file's CRLF ending:

````markdown
A plan that carries passages rather than whole files wraps each new passage
at its destination file's column, chosen when the block is authored, and
states each passage's shape — a replacement of an old passage, or an
insertion next to an anchor that stays.
````

- [ ] **Step 13: Verify P4.4**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
A plan that carries passages rather than whole files wraps each new passage at its destination file's column, chosen when the block is authored, and states each passage's shape — a replacement of an old passage, or an insertion next to an anchor that stays.
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The anchor, raw, still in the file:

````bash
needle=$(cat <<'EOF'
The report and prompt skeletons do **not** go in the plan. The plan says that
EOF
)
grep -cF -- "$needle" skills/tanto/roles/sekkei.md
````

Expected: `1`

- [ ] **Step 14: Verify the P4.5 anchor, before the edit**

Anchor — one current line of `skills/tanto/roles/sekkei.md`, which occurs there
exactly once.
The heading stays; the numbered list under it is what this passage replaces.

````markdown
## Step 4 — plan review
````

Run:

````bash
needle=$(cat <<'EOF'
## Step 4 — plan review
EOF
)
grep -cF -- "$needle" skills/tanto/roles/sekkei.md
````

Expected: `1`

- [ ] **Step 15: P4.5 — replace the passage**

This is a **replacement**: Step 4's five numbered items are replaced whole.
Items 1, 3, and 4 are the file's current text, transcribed; items 2 and 5
change. The sentence after the list — "Then send Kanri one line saying the plan
is committed, with its path." — is untouched.

Old passage — replace exactly these 13 lines of `skills/tanto/roles/sekkei.md`
and nothing else:

````markdown
1. Dispatch a **read-only** reviewer on `subagents.reviewer` to run the
   writing-plans checklist against the plan, writing its report to
   `.superpowers/sdd/<topic>/plan-review.md` with a **Shoroku candidates**
   section at the end; after you have ruled, send Kanri one line with the
   report path.
2. Check spec conformance and the batch cuts yourself. A cut that leaves the
   tree inconsistent at its boundary is a bad cut.
3. Run every verification command the plan states, once, on this machine,
   and compare its output with what the plan expects. A command that has
   never been run is a placeholder in a command's shape; fix the plan, not
   the expectation.
4. Lint the changed paths.
5. Get one OK from the human, then commit under your commit rule below.
````

New passage — the spec's block under "The flow › Sekkei's obligations", written
with the file's CRLF ending:

````markdown
1. Dispatch a **read-only** reviewer on `subagents.reviewer` to run the
   writing-plans checklist against the plan, writing its report to
   `.superpowers/sdd/<topic>/plan-review.md` with a **Shoroku candidates**
   section at the end; after you have ruled, send Kanri one line with the
   report path.
2. Check spec conformance and the batch cuts yourself. A cut that leaves the
   tree inconsistent at its boundary is a bad cut. When the plan names a
   boundary as safe for a role start or replacement, grep the plan's own
   new-passage blocks for every term a later batch lands; a boundary is safe
   by that sweep, not by assertion.
3. Run every verification command the plan states, once, on this machine,
   and compare its output with what the plan expects. A command that has
   never been run is a placeholder in a command's shape; fix the plan, not
   the expectation.
4. Lint the changed paths.
5. Send Kanri `review-ready: <plan path>` and idle until `brief: <path>`
   arrives, never polling (send the line again if Kanri's session was
   replaced meanwhile); put the brief's text verbatim in your request for the
   one OK, with both paths, and record the answers in `dialogue.md` in the
   brief's reply shape. On the human's OK, commit under your commit rule
   below.
````

- [ ] **Step 16: Verify P4.5**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
1. Dispatch a **read-only** reviewer on `subagents.reviewer` to run the writing-plans checklist against the plan, writing its report to `.superpowers/sdd/<topic>/plan-review.md` with a **Shoroku candidates** section at the end; after you have ruled, send Kanri one line with the report path. 2. Check spec conformance and the batch cuts yourself. A cut that leaves the tree inconsistent at its boundary is a bad cut. When the plan names a boundary as safe for a role start or replacement, grep the plan's own new-passage blocks for every term a later batch lands; a boundary is safe by that sweep, not by assertion. 3. Run every verification command the plan states, once, on this machine, and compare its output with what the plan expects. A command that has never been run is a placeholder in a command's shape; fix the plan, not the expectation. 4. Lint the changed paths. 5. Send Kanri `review-ready: <plan path>` and idle until `brief: <path>` arrives, never polling (send the line again if Kanri's session was replaced meanwhile); put the brief's text verbatim in your request for the one OK, with both paths, and record the answers in `dialogue.md` in the brief's reply shape. On the human's OK, commit under your commit rule below.
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The old passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
1. Dispatch a **read-only** reviewer on `subagents.reviewer` to run the writing-plans checklist against the plan, writing its report to `.superpowers/sdd/<topic>/plan-review.md` with a **Shoroku candidates** section at the end; after you have ruled, send Kanri one line with the report path. 2. Check spec conformance and the batch cuts yourself. A cut that leaves the tree inconsistent at its boundary is a bad cut. 3. Run every verification command the plan states, once, on this machine, and compare its output with what the plan expects. A command that has never been run is a placeholder in a command's shape; fix the plan, not the expectation. 4. Lint the changed paths. 5. Get one OK from the human, then commit under your commit rule below.
EOF
)
tr -d '\r' < skills/tanto/roles/sekkei.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 17: The two routed strings, raw, in `roles/sekkei.md`**

````bash
grep -cF 'review-ready: <' skills/tanto/roles/sekkei.md
grep -cF 'brief: <path>' skills/tanto/roles/sekkei.md
````

Expected: `2` and `2` — the spec gate in Step 2 and the plan gate in Step 4,
each sending one line and idling on the other, each on a line of its own.

Run: `grep -cF 'notify_when_idle: true' skills/tanto/roles/sekkei.md`
Expected: `0`. Sekkei's file never subscribes, before this task or after it.

- [ ] **Step 18: The diff is exactly this task's passages**

Run: `git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/sekkei.md`
Expected: four hunks for five passages. The `dialogue.md` paragraph, the
requirement-citation paragraph, and Step 2's new first paragraph fall into one
hunk, because fewer than seven unchanged lines separate them; Step 2's new last
paragraph, the Step 3 paragraph, and the Step 4 list are the other three.

Run: `git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/sekkei.md | grep -c '^@@'`
Expected: `4`. A task-time check, measured on scratch copies of the tree with a
3-context unified diff while this plan was drafted; `git diff` merges two changed
regions into one hunk when at most six unchanged lines separate them, so read the
hunks against the blocks above rather than trusting the number alone.

- [ ] **Step 19: The line ending did not change**

Run: `git ls-files --eol skills/tanto/roles/sekkei.md`
Expected: `i/lf    w/crlf    attr/text=auto` — the same `w/crlf` this task read
before its first edit, and never `w/mixed`.

- [ ] **Step 20: Lint the path**

Run: `./scripts/lint.sh skills/tanto/roles/sekkei.md` (Windows: `scripts\lint.bat skills/tanto/roles/sekkei.md`)
Expected: every hook `Passed` or `Skipped`, none `Failed`. Name the file — a
directory argument makes every hook skip and proves nothing.

- [ ] **Step 21: Commit**

Commit by explicit path, the only form this repository allows:

````bash
git add skills/tanto/roles/sekkei.md
git commit --only skills/tanto/roles/sekkei.md -m "feat(tanto): Sekkei keeps the dialogue record and asks for the review brief" -m "Step 1 keeps dialogue.md, the human's own words in order, and names the requirement each decision serves. Step 2 and Step 4 send review-ready: and idle until brief: arrives, then put the brief's text verbatim to the human and record the answers in the brief's reply shape. Three plan conventions from design-4807 ride along: the other role's check before the spec review, the wrap column and passage shape, and the term sweep at a named boundary." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 22: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 5: `roles/kanri.md` — the brief dispatch and the end of the idle subscriptions

**Files:**

- Modify: `skills/tanto/roles/kanri.md` — five passages. When the plan lands,
  step 5, a **replacement**; the batch loop, steps 1 to 8, a **replacement**;
  the Kaiseki branch, step 2, a **replacement**; Human access, item 5 after
  item 4, an **insertion**; Session lifecycle, the Replace table's first row,
  a **replacement**.

**Interfaces:**

- Consumes: `skills/tanto/templates/review-brief.md` from Task 1, which item 5
  names as the template of the dispatch; the two terms Task 2 put in
  `SKILL.md`; and Task 4's two `review-ready:` sends, which item 5 answers
  with `brief: <path>`.
- Produces: nothing a later task edits. Task 6's new check 6 block counts what
  this task leaves — one `review-ready: <`, one `brief: <path>`, and two
  `notify_when_idle: true`, the two exit lines — and Task 7 runs that count.
- `skills/tanto/roles/kanri.md` is markdownlint-checked; every angle-bracket
  blank in the new passages sits inside a code span.
- Kanri's cold read of the committed plan (When the plan lands, step 1) is not
  touched: the brief is the human's pre-read and the cold read is Kanri's, and
  they read for different things.

- [ ] **Step 1: Read the file's line ending, before the first edit**

Run: `git ls-files --eol skills/tanto/roles/kanri.md`
Expected: `i/lf    w/crlf    attr/text=auto`. Every passage below is written CRLF,
the ending this working tree has for this file.

- [ ] **Step 2: Count the subscriptions before the edits**

Run: `grep -cF 'notify_when_idle: true' skills/tanto/roles/kanri.md`
Expected: `6` — four prompt-and-brief subscriptions that this task removes (When
the plan lands step 5, the batch loop steps 7 and 8, the Kaiseki branch step 2)
and the two exit lines, which stay. The count after the task is `2`.

- [ ] **Step 3: Verify the P5.1 anchor, before the edit**

Anchor — one current line of `skills/tanto/roles/kanri.md`, which occurs there
exactly once.
It is the first line of the numbered item this passage replaces.

````markdown
5. On Jisso's handshake, reply with the orders line. Then write batch A's
````

Run:

````bash
needle=$(cat <<'EOF'
5. On Jisso's handshake, reply with the orders line. Then write batch A's
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`

- [ ] **Step 4: P5.1 — replace the passage**

This is a **replacement**: item 5 of "When the plan lands", five lines. Only
its last line changes; the passage is replaced whole so that the item reads as
one block. Item 6 — "Enter the batch loop below at step 1." — is untouched.

Old passage — replace exactly these 5 lines of `skills/tanto/roles/kanri.md`
and nothing else:

````markdown
5. On Jisso's handshake, reply with the orders line. Then write batch A's
   prompt from `templates/batch-prompt.md`, with
   `First batch, no previous verdict.` in its previous-batch-verdict section,
   save it as `.superpowers/sdd/<plan-basename>/batch-A-prompt.md`, and send
   the same text with `notify_when_idle: true`.
````

New passage — the spec's block under "Kanri stops subscribing to idle (I-4) ›
The rule", written with the file's CRLF ending:

````markdown
5. On Jisso's handshake, reply with the orders line. Then write batch A's
   prompt from `templates/batch-prompt.md`, with
   `First batch, no previous verdict.` in its previous-batch-verdict section,
   save it as `.superpowers/sdd/<plan-basename>/batch-A-prompt.md`, and send
   the same text, without an idle subscription.
````

- [ ] **Step 5: Verify P5.1**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
5. On Jisso's handshake, reply with the orders line. Then write batch A's prompt from `templates/batch-prompt.md`, with `First batch, no previous verdict.` in its previous-batch-verdict section, save it as `.superpowers/sdd/<plan-basename>/batch-A-prompt.md`, and send the same text, without an idle subscription.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The old passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
5. On Jisso's handshake, reply with the orders line. Then write batch A's prompt from `templates/batch-prompt.md`, with `First batch, no previous verdict.` in its previous-batch-verdict section, save it as `.superpowers/sdd/<plan-basename>/batch-A-prompt.md`, and send the same text with `notify_when_idle: true`.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 6: Verify the P5.2 anchor, before the edit**

Anchor — one current line of `skills/tanto/roles/kanri.md`, which occurs there
exactly once.
It is the first line of the numbered list this passage replaces.

````markdown
1. Wait for the idle notice or Jisso's one-line report message. Do not poll.
````

Run:

````bash
needle=$(cat <<'EOF'
1. Wait for the idle notice or Jisso's one-line report message. Do not poll.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`

- [ ] **Step 7: P5.2 — replace the passage**

This is a **replacement**: the batch loop's eight numbered items, everything
between "Per batch, in this order." and the paragraph that begins "Steps 4, 6,
and 7 are everything", are replaced whole. Steps 2 to 6 are the file's current
text, transcribed; steps 1, 7, and 8 change. The three paragraphs after the
list are untouched.

Old passage — replace exactly these 44 lines of `skills/tanto/roles/kanri.md`
and nothing else:

````markdown
1. Wait for the idle notice or Jisso's one-line report message. Do not poll.
2. **Verify the tree before reading the report.** `git status` clean; the
   commits and their trailers as claimed; the plan file in the state this batch
   should have left it; repo-specific leftovers such as stray processes or temp
   directories; a spot check of the claimed tests. You verify in place — there
   is no worktree.
3. Read the report. For each item under "Rulings needed": a **known cause** you
   rule on yourself, recorded as `R-n` in the ledger with what it costs if
   wrong and which later tasks inherit it; an **unknown cause** opens the
   Kaiseki branch below; a **scope or spec change** goes to the human. Then
   adopt or reject each shoroku candidate per the adoption rule, and update the
   ledger's `S-n` table, its Batches row, and its Progress line.
4. **Triage any bug report that arrived during the batch**, per "Bug intake"
   below: rule on each, and send the redirects, the Kaiseki requests, and the
   relays now. An issue to file or a hotfix to make waits for the commit window
   at step 7.
5. Report one line to the human. Ask numbered questions only for the four SDD
   stop classes and for a scope or spec change.
6. **Check the lifecycle tables and the handover trigger.** Rewrite the
   roster's Residency line. If a create request is due, make it, unless a
   handover trigger has fired, in which case the successor makes it from the
   handover's Next step. If a delete or a replace of a live, coherent session
   is due, or a handover trigger has fired, run the proposal half of "Exit
   shoroku" now: send the `exit:` lines, rule on the proposals, write the
   directions. Delete requests wait for step 7.
7. **The commit window.** One committer at a time, in this order, Jisso idle
   throughout. (a) Each exiting session applies its direction and commits; you
   verify the diff and only then ask the human to delete that session. (b) Your
   own edits — the hotfix, the issues from step 4, and your own exit shoroku
   when a handover is due — each committed by you in its turn. (c) Tell Sekkei
   the boundary is verified, with `notify_when_idle: true`, naming any Kaiseki
   create or delete since the last boundary, then wait for Sekkei's one-line
   reply — `committed <subject>` or `nothing to commit` — or for its idle
   notice, whichever comes first, and record in the ledger's Session events if
   the notice came without a reply; skip (c) when Sekkei is not live. If a
   handover is due, the window ends, after the wait Timing prescribes, with
   steps 2 to 4 of "The handover, in a plan and between plans" — the exit
   shoroku was step 6's proposal and slot (b)'s commit — and the loop stops
   here; the next prompt is the successor's.
8. Write the next batch prompt from `templates/batch-prompt.md`, carrying the
   rulings the next tasks inherit and the concrete model families from
   `tanto.json`. Save it as
   `.superpowers/sdd/<plan-basename>/batch-<X>-prompt.md` and send the same
   text with `notify_when_idle: true`.
````

New passage — the spec's block under "Kanri stops subscribing to idle (I-4) ›
The rule", written with the file's CRLF ending:

````markdown
1. Wait for Jisso's one-line report message. Do not poll; subscribe to its
   idle — a pure `notify_when_idle`, no message — only when the report is
   overdue, and check the workspace before acting on any notice: a notice
   before the report is usually a false idle, an implementer's turn ending.
2. **Verify the tree before reading the report.** `git status` clean; the
   commits and their trailers as claimed; the plan file in the state this batch
   should have left it; repo-specific leftovers such as stray processes or temp
   directories; a spot check of the claimed tests. You verify in place — there
   is no worktree.
3. Read the report. For each item under "Rulings needed": a **known cause** you
   rule on yourself, recorded as `R-n` in the ledger with what it costs if
   wrong and which later tasks inherit it; an **unknown cause** opens the
   Kaiseki branch below; a **scope or spec change** goes to the human. Then
   adopt or reject each shoroku candidate per the adoption rule, and update the
   ledger's `S-n` table, its Batches row, and its Progress line.
4. **Triage any bug report that arrived during the batch**, per "Bug intake"
   below: rule on each, and send the redirects, the Kaiseki requests, and the
   relays now. An issue to file or a hotfix to make waits for the commit window
   at step 7.
5. Report one line to the human. Ask numbered questions only for the four SDD
   stop classes and for a scope or spec change.
6. **Check the lifecycle tables and the handover trigger.** Rewrite the
   roster's Residency line. If a create request is due, make it, unless a
   handover trigger has fired, in which case the successor makes it from the
   handover's Next step. If a delete or a replace of a live, coherent session
   is due, or a handover trigger has fired, run the proposal half of "Exit
   shoroku" now: send the `exit:` lines, rule on the proposals, write the
   directions. Delete requests wait for step 7.
7. **The commit window.** One committer at a time, in this order, Jisso idle
   throughout. (a) Each exiting session applies its direction and commits; you
   verify the diff and only then ask the human to delete that session. (b) Your
   own edits — the hotfix, the issues from step 4, and your own exit shoroku
   when a handover is due — each committed by you in its turn. (c) Tell Sekkei
   the boundary is verified, naming any Kaiseki create or delete since the
   last boundary, then wait for Sekkei's one-line reply — `committed
   <subject>` or `nothing to commit`; subscribe to its idle only when the
   reply is overdue, and record in the ledger's Session events if a notice
   came without a reply; skip (c) when Sekkei is not live. If a handover is
   due, the window ends, after the wait Timing prescribes, with steps 2 to 4
   of "The handover, in a plan and between plans" — the exit shoroku was step
   6's proposal and slot (b)'s commit — and the loop stops here; the next
   prompt is the successor's.
8. Write the next batch prompt from `templates/batch-prompt.md`, carrying the
   rulings the next tasks inherit and the concrete model families from
   `tanto.json`. Save it as
   `.superpowers/sdd/<plan-basename>/batch-<X>-prompt.md` and send the same
   text, without an idle subscription.
````

- [ ] **Step 8: Verify P5.2**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
1. Wait for Jisso's one-line report message. Do not poll; subscribe to its idle — a pure `notify_when_idle`, no message — only when the report is overdue, and check the workspace before acting on any notice: a notice before the report is usually a false idle, an implementer's turn ending. 2. **Verify the tree before reading the report.** `git status` clean; the commits and their trailers as claimed; the plan file in the state this batch should have left it; repo-specific leftovers such as stray processes or temp directories; a spot check of the claimed tests. You verify in place — there is no worktree. 3. Read the report. For each item under "Rulings needed": a **known cause** you rule on yourself, recorded as `R-n` in the ledger with what it costs if wrong and which later tasks inherit it; an **unknown cause** opens the Kaiseki branch below; a **scope or spec change** goes to the human. Then adopt or reject each shoroku candidate per the adoption rule, and update the ledger's `S-n` table, its Batches row, and its Progress line. 4. **Triage any bug report that arrived during the batch**, per "Bug intake" below: rule on each, and send the redirects, the Kaiseki requests, and the relays now. An issue to file or a hotfix to make waits for the commit window at step 7. 5. Report one line to the human. Ask numbered questions only for the four SDD stop classes and for a scope or spec change. 6. **Check the lifecycle tables and the handover trigger.** Rewrite the roster's Residency line. If a create request is due, make it, unless a handover trigger has fired, in which case the successor makes it from the handover's Next step. If a delete or a replace of a live, coherent session is due, or a handover trigger has fired, run the proposal half of "Exit shoroku" now: send the `exit:` lines, rule on the proposals, write the directions. Delete requests wait for step 7. 7. **The commit window.** One committer at a time, in this order, Jisso idle throughout. (a) Each exiting session applies its direction and commits; you verify the diff and only then ask the human to delete that session. (b) Your own edits — the hotfix, the issues from step 4, and your own exit shoroku when a handover is due — each committed by you in its turn. (c) Tell Sekkei the boundary is verified, naming any Kaiseki create or delete since the last boundary, then wait for Sekkei's one-line reply — `committed <subject>` or `nothing to commit`; subscribe to its idle only when the reply is overdue, and record in the ledger's Session events if a notice came without a reply; skip (c) when Sekkei is not live. If a handover is due, the window ends, after the wait Timing prescribes, with steps 2 to 4 of "The handover, in a plan and between plans" — the exit shoroku was step 6's proposal and slot (b)'s commit — and the loop stops here; the next prompt is the successor's. 8. Write the next batch prompt from `templates/batch-prompt.md`, carrying the rulings the next tasks inherit and the concrete model families from `tanto.json`. Save it as `.superpowers/sdd/<plan-basename>/batch-<X>-prompt.md` and send the same text, without an idle subscription.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The old passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
1. Wait for the idle notice or Jisso's one-line report message. Do not poll. 2. **Verify the tree before reading the report.** `git status` clean; the commits and their trailers as claimed; the plan file in the state this batch should have left it; repo-specific leftovers such as stray processes or temp directories; a spot check of the claimed tests. You verify in place — there is no worktree. 3. Read the report. For each item under "Rulings needed": a **known cause** you rule on yourself, recorded as `R-n` in the ledger with what it costs if wrong and which later tasks inherit it; an **unknown cause** opens the Kaiseki branch below; a **scope or spec change** goes to the human. Then adopt or reject each shoroku candidate per the adoption rule, and update the ledger's `S-n` table, its Batches row, and its Progress line. 4. **Triage any bug report that arrived during the batch**, per "Bug intake" below: rule on each, and send the redirects, the Kaiseki requests, and the relays now. An issue to file or a hotfix to make waits for the commit window at step 7. 5. Report one line to the human. Ask numbered questions only for the four SDD stop classes and for a scope or spec change. 6. **Check the lifecycle tables and the handover trigger.** Rewrite the roster's Residency line. If a create request is due, make it, unless a handover trigger has fired, in which case the successor makes it from the handover's Next step. If a delete or a replace of a live, coherent session is due, or a handover trigger has fired, run the proposal half of "Exit shoroku" now: send the `exit:` lines, rule on the proposals, write the directions. Delete requests wait for step 7. 7. **The commit window.** One committer at a time, in this order, Jisso idle throughout. (a) Each exiting session applies its direction and commits; you verify the diff and only then ask the human to delete that session. (b) Your own edits — the hotfix, the issues from step 4, and your own exit shoroku when a handover is due — each committed by you in its turn. (c) Tell Sekkei the boundary is verified, with `notify_when_idle: true`, naming any Kaiseki create or delete since the last boundary, then wait for Sekkei's one-line reply — `committed <subject>` or `nothing to commit` — or for its idle notice, whichever comes first, and record in the ledger's Session events if the notice came without a reply; skip (c) when Sekkei is not live. If a handover is due, the window ends, after the wait Timing prescribes, with steps 2 to 4 of "The handover, in a plan and between plans" — the exit shoroku was step 6's proposal and slot (b)'s commit — and the loop stops here; the next prompt is the successor's. 8. Write the next batch prompt from `templates/batch-prompt.md`, carrying the rulings the next tasks inherit and the concrete model families from `tanto.json`. Save it as `.superpowers/sdd/<plan-basename>/batch-<X>-prompt.md` and send the same text with `notify_when_idle: true`.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 9: Verify the P5.3 anchor, before the edit**

Anchor — one current line of `skills/tanto/roles/kanri.md`, which occurs there
exactly once.
It is the first line of the numbered item this passage replaces.

````markdown
2. Classify. Known cause — rule and send Jisso back to work. Unknown — ask the
````

Run:

````bash
needle=$(cat <<'EOF'
2. Classify. Known cause — rule and send Jisso back to work. Unknown — ask the
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`

- [ ] **Step 10: P5.3 — replace the passage**

This is a **replacement**: item 2 of the Kaiseki branch, nine lines. Items 1
and 3 are untouched.

Old passage — replace exactly these 9 lines of `skills/tanto/roles/kanri.md`
and nothing else:

````markdown
2. Classify. Known cause — rule and send Jisso back to work. Unknown — ask the
   human to create Kaiseki; after its handshake, write
   `.superpowers/sdd/<plan-basename>/kaiseki-<n>-brief.md` from
   `templates/kaiseki-brief.md`, its Human access line filled — the debugging
   conversation in Kaiseki's window until its report is written, unless you
   judge otherwise — and send its path with
   `notify_when_idle: true`. If the human declines to create Kaiseki, rule
   `continue the SDD rounds`: Jisso resumes at round 3 with the resumed
   implementer, and rounds 4-5 go to `subagents.escalation`.
````

New passage — the spec's block under "Kanri stops subscribing to idle (I-4) ›
The rule", written with the file's CRLF ending:

````markdown
2. Classify. Known cause — rule and send Jisso back to work. Unknown — ask the
   human to create Kaiseki; after its handshake, write
   `.superpowers/sdd/<plan-basename>/kaiseki-<n>-brief.md` from
   `templates/kaiseki-brief.md`, its Human access line filled — the debugging
   conversation in Kaiseki's window until its report is written, unless you
   judge otherwise — and send its path, without an idle subscription. If the
   human declines to create Kaiseki, rule `continue the SDD rounds`: Jisso
   resumes at round 3 with the resumed implementer, and rounds 4-5 go to
   `subagents.escalation`.
````

- [ ] **Step 11: Verify P5.3**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
2. Classify. Known cause — rule and send Jisso back to work. Unknown — ask the human to create Kaiseki; after its handshake, write `.superpowers/sdd/<plan-basename>/kaiseki-<n>-brief.md` from `templates/kaiseki-brief.md`, its Human access line filled — the debugging conversation in Kaiseki's window until its report is written, unless you judge otherwise — and send its path, without an idle subscription. If the human declines to create Kaiseki, rule `continue the SDD rounds`: Jisso resumes at round 3 with the resumed implementer, and rounds 4-5 go to `subagents.escalation`.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The old passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
2. Classify. Known cause — rule and send Jisso back to work. Unknown — ask the human to create Kaiseki; after its handshake, write `.superpowers/sdd/<plan-basename>/kaiseki-<n>-brief.md` from `templates/kaiseki-brief.md`, its Human access line filled — the debugging conversation in Kaiseki's window until its report is written, unless you judge otherwise — and send its path with `notify_when_idle: true`. If the human declines to create Kaiseki, rule `continue the SDD rounds`: Jisso resumes at round 3 with the resumed implementer, and rounds 4-5 go to `subagents.escalation`.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 12: Verify the P5.4 anchor, before the edit**

Anchor — one current line of `skills/tanto/roles/kanri.md`, which occurs there
exactly once.
It is the last line of Human access item 4.

````markdown
   it grants nothing beyond that exchange.
````

Run:

````bash
needle=$(cat <<'EOF'
   it grants nothing beyond that exchange.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`

- [ ] **Step 13: P5.4 — insert the passage**

This is an **insertion**: the new item 5 goes immediately after item 4, with no
blank line between them, and before the paragraph that begins "The harness's
own prompts", which keeps the blank line already above it.

Old passage — the anchor line, which stays exactly as it is. The new passage
goes **after** it:

````markdown
   it grants nothing beyond that exchange.
````

New passage — the spec's block under "The flow › Kanri's obligation", written
with the file's CRLF ending:

````markdown
5. On `review-ready: <path>` from Sekkei — at any time, a batch in flight or
   not, because the writer reads only and writes one untracked file; unless a
   handover is due, in which case the successor dispatches it from the
   handover's Next step, and a writer still running when a handover is
   written on the human's word is listed under In flight like any agent —
   dispatch the review brief on `subagents.reviewer`, a read-only subagent,
   naming in the dispatch: the document's path; its inputs, for a spec also
   `spec-inputs.md` and `dialogue.md`, for a plan also the spec; the output,
   `.superpowers/sdd/<topic>/review-brief-spec.md` or `review-brief-plan.md`;
   the template, `templates/review-brief.md`; and the chat's language, which
   is the language of the human's own messages to you (`dialogue.md` is the
   reference if the two windows differ). Check the brief's form, not the
   document: the five sections, the unsettled section, and "How to answer"
   present (section 5 reads "not applicable" for a spec); every point opening
   with one of the four tags — confirm, choose, decide, nothing — and every
   unsettled line saying whether an answer is needed; every point in its
   three parts — the two before `See:` and the pointer after it, which may
   carry the ` — ` separator, as a plan's task headings do; every pointer the
   document's own heading text, verbatim and untranslated, so that
   `grep '^#'` on the document matches it. Dispatch once more if the form
   fails; if it fails again, send the brief as it stands and tell the human
   in one line. Never edit it, and do not read the document to validate it —
   a point that misreads the document is caught by the human's answer or by
   your cold read, which stays where it is. Then send Sekkei `brief: <path>`.
   The human answers in Sekkei's window under the standing grant; the answers
   reach you through `dialogue.md` and the document.
````

- [ ] **Step 14: Verify P5.4**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
5. On `review-ready: <path>` from Sekkei — at any time, a batch in flight or not, because the writer reads only and writes one untracked file; unless a handover is due, in which case the successor dispatches it from the handover's Next step, and a writer still running when a handover is written on the human's word is listed under In flight like any agent — dispatch the review brief on `subagents.reviewer`, a read-only subagent, naming in the dispatch: the document's path; its inputs, for a spec also `spec-inputs.md` and `dialogue.md`, for a plan also the spec; the output, `.superpowers/sdd/<topic>/review-brief-spec.md` or `review-brief-plan.md`; the template, `templates/review-brief.md`; and the chat's language, which is the language of the human's own messages to you (`dialogue.md` is the reference if the two windows differ). Check the brief's form, not the document: the five sections, the unsettled section, and "How to answer" present (section 5 reads "not applicable" for a spec); every point opening with one of the four tags — confirm, choose, decide, nothing — and every unsettled line saying whether an answer is needed; every point in its three parts — the two before `See:` and the pointer after it, which may carry the ` — ` separator, as a plan's task headings do; every pointer the document's own heading text, verbatim and untranslated, so that `grep '^#'` on the document matches it. Dispatch once more if the form fails; if it fails again, send the brief as it stands and tell the human in one line. Never edit it, and do not read the document to validate it — a point that misreads the document is caught by the human's answer or by your cold read, which stays where it is. Then send Sekkei `brief: <path>`. The human answers in Sekkei's window under the standing grant; the answers reach you through `dialogue.md` and the document.
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The anchor, raw, still in the file:

````bash
needle=$(cat <<'EOF'
   it grants nothing beyond that exchange.
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`

- [ ] **Step 15: Verify the P5.5 anchor, before the edit**

Anchor — one current line of `skills/tanto/roles/kanri.md`, which occurs there
exactly once.
It is the whole table row this passage replaces.

````markdown
| Jisso is gone — not in `ListAgents`, `SendMessage` errors, or the idle subscription expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers); ask the human to delete the dead session and create a new Jisso; the next prompt says `resume batch X from task N`; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
````

Run:

````bash
needle=$(cat <<'EOF'
| Jisso is gone — not in `ListAgents`, `SendMessage` errors, or the idle subscription expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers); ask the human to delete the dead session and create a new Jisso; the next prompt says `resume batch X from task N`; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
EOF
)
grep -cF -- "$needle" skills/tanto/roles/kanri.md
````

Expected: `1`

- [ ] **Step 16: P5.5 — replace the passage**

This is a **replacement**: the first data row of the Replace table, one line.
Only the Symptom cell changes — "or the idle subscription expired with no
report" becomes "or a subscription made when the report was overdue expired
with no report"; the Action cell is byte-for-byte the same. The header rows and
the five rows below are untouched.

Old passage — replace exactly these 1 line of `skills/tanto/roles/kanri.md` and
nothing else:

````markdown
| Jisso is gone — not in `ListAgents`, `SendMessage` errors, or the idle subscription expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers); ask the human to delete the dead session and create a new Jisso; the next prompt says `resume batch X from task N`; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
````

New passage — the spec's block under "Kanri stops subscribing to idle (I-4) ›
The rule", written with the file's CRLF ending:

````markdown
| Jisso is gone — not in `ListAgents`, `SendMessage` errors, or a subscription made when the report was overdue expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers); ask the human to delete the dead session and create a new Jisso; the next prompt says `resume batch X from task N`; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
````

- [ ] **Step 17: Verify P5.5**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
| Jisso is gone — not in `ListAgents`, `SendMessage` errors, or a subscription made when the report was overdue expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers); ask the human to delete the dead session and create a new Jisso; the next prompt says `resume batch X from task N`; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The old passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
| Jisso is gone — not in `ListAgents`, `SendMessage` errors, or the idle subscription expired with no report | verify the tree (`git status`, the last commit against the SDD ledger, leftovers); ask the human to delete the dead session and create a new Jisso; the next prompt says `resume batch X from task N`; run "Exit shoroku" first if the session is alive and coherent, otherwise record in the roster's Events that its exit shoroku did not run and what was lost |
EOF
)
tr -d '\r' < skills/tanto/roles/kanri.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 18: The three routed strings, raw, in `roles/kanri.md`**

````bash
grep -cF 'review-ready: <' skills/tanto/roles/kanri.md
grep -cF 'brief: <path>' skills/tanto/roles/kanri.md
grep -cF 'notify_when_idle: true' skills/tanto/roles/kanri.md
````

Expected: `1`, `1`, `2`. The two `notify_when_idle: true` are the two exit
lines, where the idle notice is the forced-exit signal by design; a batch prompt
or a Kaiseki brief sent with a subscription would show as a third.

- [ ] **Step 19: The authority-triad plural did not creep back in**

Run: `grep -c 'orders lines' skills/tanto/roles/kanri.md`
Expected: `0`. Step 5 and the batch loop both carry "orders line"; the plural is
the defect the note's check 6 pins across the whole skill.

- [ ] **Step 20: The diff is exactly this task's passages**

Run: `git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/kanri.md`
Expected: five hunks, one per passage — step 5 of "When the plan lands",
the batch loop, the Kaiseki branch's step 2, Human access item 5, and the Replace
table row — and nothing else.

Run: `git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/kanri.md | grep -c '^@@'`
Expected: `5`. A task-time check, measured on scratch copies of the tree with a
3-context unified diff while this plan was drafted; `git diff` merges two changed
regions into one hunk when at most six unchanged lines separate them, so read the
hunks against the blocks above rather than trusting the number alone.

- [ ] **Step 21: The line ending did not change**

Run: `git ls-files --eol skills/tanto/roles/kanri.md`
Expected: `i/lf    w/crlf    attr/text=auto` — the same `w/crlf` this task read
before its first edit, and never `w/mixed`.

- [ ] **Step 22: Lint the path**

Run: `./scripts/lint.sh skills/tanto/roles/kanri.md` (Windows: `scripts\lint.bat skills/tanto/roles/kanri.md`)
Expected: every hook `Passed` or `Skipped`, none `Failed`. Name the file — a
directory argument makes every hook skip and proves nothing.

- [ ] **Step 23: Commit**

Commit by explicit path, the only form this repository allows:

````bash
git add skills/tanto/roles/kanri.md
git commit --only skills/tanto/roles/kanri.md -m "feat(tanto): Kanri dispatches the review brief and stops subscribing to idle" -m "Human access gains item 5: on review-ready: from Sekkei, dispatch the read-only brief writer on subagents.reviewer, check the brief's form and not the document, then answer brief: <path>; a due handover defers the dispatch to the successor. Batch prompts, Kaiseki briefs, and the boundary line to Sekkei go out without a subscription, which is now the overdue fallback, and the Replace row's symptom follows. The exit lines keep theirs." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 24: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 6: the note — sixteen files, ten templates, and the brief's two lines pinned

**Files:**

- Modify: `docs/notes/tanto-consistency-checks.md` — six passages. The
  opening, the flattened-count sentence, an **insertion**; the Versions
  bullet, a **replacement**; check 1, the `ls` and its Expected, a
  **replacement**; check 2, its Expected, a **replacement**; check 3, the MAP
  and its Expected, a **replacement**; check 6, a sixth and last block, an
  **insertion**.

**Interfaces:**

- Consumes: the tree Tasks 1 to 5 left. Check 1 lists the file Task 1 created;
  check 2 resolves it because Task 2 names it in `SKILL.md`; check 3 finds it
  cited because Task 5 names it in `roles/kanri.md`; the new check 6 block
  counts what Tasks 2, 4, and 5 wrote.
- Produces: the commands Task 7 runs. Task 7 runs them **as written**, in the
  state this task leaves them.
- `docs/notes/**` is markdownlint-checked. The new check 6 block contains a
  fenced `bash` block of its own, so its passage is shown here inside a
  four-backtick fence; what goes into the file is the three-backtick fence
  the block itself carries.
- Four of the six passages change a count the spec describes rather than
  quotes — Versions, check 1, check 2, and check 3 — and each new block below
  is the tree's current text with exactly the change the spec's table names.

- [ ] **Step 1: Read the file's line ending, before the first edit**

Run: `git ls-files --eol docs/notes/tanto-consistency-checks.md`
Expected: `i/lf    w/crlf    attr/text=auto`. Every passage below is written CRLF,
the ending this working tree has for this file.

- [ ] **Step 2: Verify the P6.1 anchor, before the edit**

Anchor — one current line of `docs/notes/tanto-consistency-checks.md`, which
occurs there exactly once.
It is the last line of the paragraph about line endings and byte counts.

````markdown
counts instead — `git cat-file -s` against the piped byte count, or `od -c`.
````

Run:

````bash
needle=$(cat <<'EOF'
counts instead — `git cat-file -s` against the piped byte count, or `od -c`.
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected: `1`

- [ ] **Step 3: P6.1 — insert the passage**

This is an **insertion**: the new paragraph goes after the paragraph that ends
"or `od -c`." and before the paragraph that begins "That mixture is an
artifact", separated from each by one blank line.

Old passage — the anchor line, which stays exactly as it is. The new passage
goes **after** it:

````markdown
counts instead — `git cat-file -s` against the piped byte count, or `od -c`.
````

New passage — the spec's block under "Where each change lives", written with
the file's CRLF ending:

````markdown
A flattened `grep -cF` counts lines, so it returns `0` or `1`: it pins the
presence of a phrase that may wrap, never a per-file occurrence count. Count
the occurrences of a line that does not wrap with a raw `grep -cF` on the
file.
````

- [ ] **Step 4: Verify P6.1**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
A flattened `grep -cF` counts lines, so it returns `0` or `1`: it pins the presence of a phrase that may wrap, never a per-file occurrence count. Count the occurrences of a line that does not wrap with a raw `grep -cF` on the file.
EOF
)
tr -d '\r' < docs/notes/tanto-consistency-checks.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The anchor, raw, still in the file:

````bash
needle=$(cat <<'EOF'
counts instead — `git cat-file -s` against the piped byte count, or `od -c`.
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected: `1`

- [ ] **Step 5: Verify the P6.2 anchor, before the edit**

Anchor — one current line of `docs/notes/tanto-consistency-checks.md`, which
occurs there exactly once.
It is the last bullet of "Versions these checks assume".

````markdown
- **Fifteen skill files, nine of them templates**, as check 1 lists them.
````

Run:

````bash
needle=$(cat <<'EOF'
- **Fifteen skill files, nine of them templates**, as check 1 lists them.
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected: `1`

- [ ] **Step 6: P6.2 — replace the passage**

This is a **replacement**: one line. Fifteen becomes sixteen and nine becomes
ten, because Task 1 added the tenth template.

Old passage — replace exactly these 1 line of
`docs/notes/tanto-consistency-checks.md` and nothing else:

````markdown
- **Fifteen skill files, nine of them templates**, as check 1 lists them.
````

New passage — the tree's current text with exactly the change the spec's table
under "Where each change lives" names, written with the file's CRLF ending:

````markdown
- **Sixteen skill files, ten of them templates**, as check 1 lists them.
````

- [ ] **Step 7: Verify P6.2**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
- **Sixteen skill files, ten of them templates**, as check 1 lists them.
EOF
)
tr -d '\r' < docs/notes/tanto-consistency-checks.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The old passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
- **Fifteen skill files, nine of them templates**, as check 1 lists them.
EOF
)
tr -d '\r' < docs/notes/tanto-consistency-checks.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 8: Verify the P6.3 anchor, before the edit**

Anchor — one current line of `docs/notes/tanto-consistency-checks.md`, which
occurs there exactly once.
It is check 1's Expected line.

````markdown
Expected: all fifteen paths listed, no `No such file or directory`.
````

Run:

````bash
needle=$(cat <<'EOF'
Expected: all fifteen paths listed, no `No such file or directory`.
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected: `1`

- [ ] **Step 9: P6.3 — replace the passage**

This is a **replacement** of check 1's last `ls` argument, its closing fence,
and its Expected line: the line `  skills/tanto/templates/review-brief.md \` is
added before the `tanto.json` line, and "fifteen" becomes "sixteen". The
thirteen `ls` argument lines above are untouched.

Old passage — replace exactly these 4 lines of
`docs/notes/tanto-consistency-checks.md` and nothing else:

````markdown
  skills/tanto/templates/tanto.json 2>&1
```

Expected: all fifteen paths listed, no `No such file or directory`.
````

New passage — the tree's current text with exactly the change the spec's table
under "Where each change lives" names, written with the file's CRLF ending:

````markdown
  skills/tanto/templates/review-brief.md \
  skills/tanto/templates/tanto.json 2>&1
```

Expected: all sixteen paths listed, no `No such file or directory`.
````

- [ ] **Step 10: Verify P6.3**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
skills/tanto/templates/review-brief.md \ skills/tanto/templates/tanto.json 2>&1 ``` Expected: all sixteen paths listed, no `No such file or directory`.
EOF
)
tr -d '\r' < docs/notes/tanto-consistency-checks.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The old passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
skills/tanto/templates/tanto.json 2>&1 ``` Expected: all fifteen paths listed, no `No such file or directory`.
EOF
)
tr -d '\r' < docs/notes/tanto-consistency-checks.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 11: Verify the P6.4 anchor, before the edit**

Anchor — one current line of `docs/notes/tanto-consistency-checks.md`, which
occurs there exactly once.
It is the first line of check 2's Expected paragraph.

````markdown
Expected: thirteen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`,
````

Run:

````bash
needle=$(cat <<'EOF'
Expected: thirteen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`,
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected: `1`

- [ ] **Step 12: P6.4 — replace the passage**

This is a **replacement** of check 2's Expected paragraph: "thirteen" becomes
"fourteen", `templates/review-brief.md` joins the list after
`templates/kanri.md` — where `sort -u` puts it — and the paragraph is rewrapped
at the file's column. The `bash` block above it is untouched: the command
already finds the new path.

Old passage — replace exactly these 7 lines of
`docs/notes/tanto-consistency-checks.md` and nothing else:

````markdown
Expected: thirteen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`,
`roles/kanri.md`, `roles/sekkei.md`, `templates/batch-prompt.md`,
`templates/batch-report.md`, `templates/bug-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/kanri-handover.md`, `templates/kanri.md`, `templates/roster.md`,
`templates/tanto.json` — and **no** `MISSING` line. A `MISSING` line is either
a typo in the reference or a file the plan forgot.
````

New passage — the tree's current text with exactly the change the spec's table
under "Where each change lives" names, written with the file's CRLF ending:

````markdown
Expected: fourteen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`,
`roles/kanri.md`, `roles/sekkei.md`, `templates/batch-prompt.md`,
`templates/batch-report.md`, `templates/bug-report.md`,
`templates/kaiseki-brief.md`, `templates/kaiseki-report.md`,
`templates/kanri-handover.md`, `templates/kanri.md`,
`templates/review-brief.md`, `templates/roster.md`, `templates/tanto.json` —
and **no** `MISSING` line. A `MISSING` line is either a typo in the reference
or a file the plan forgot.
````

- [ ] **Step 13: Verify P6.4**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
Expected: fourteen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`, `roles/kanri.md`, `roles/sekkei.md`, `templates/batch-prompt.md`, `templates/batch-report.md`, `templates/bug-report.md`, `templates/kaiseki-brief.md`, `templates/kaiseki-report.md`, `templates/kanri-handover.md`, `templates/kanri.md`, `templates/review-brief.md`, `templates/roster.md`, `templates/tanto.json` — and **no** `MISSING` line. A `MISSING` line is either a typo in the reference or a file the plan forgot.
EOF
)
tr -d '\r' < docs/notes/tanto-consistency-checks.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The old passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
Expected: thirteen `ok` lines — `roles/jisso.md`, `roles/kaiseki.md`, `roles/kanri.md`, `roles/sekkei.md`, `templates/batch-prompt.md`, `templates/batch-report.md`, `templates/bug-report.md`, `templates/kaiseki-brief.md`, `templates/kaiseki-report.md`, `templates/kanri-handover.md`, `templates/kanri.md`, `templates/roster.md`, `templates/tanto.json` — and **no** `MISSING` line. A `MISSING` line is either a typo in the reference or a file the plan forgot.
EOF
)
tr -d '\r' < docs/notes/tanto-consistency-checks.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 14: Verify the P6.5 anchor, before the edit**

Anchor — one current line of `docs/notes/tanto-consistency-checks.md`, which
occurs there exactly once.
It is the first line of check 3's Expected paragraph.

````markdown
Expected: nine `ok` lines, no `UNCITED`. Six of the nine are Kanri's, because
````

Run:

````bash
needle=$(cat <<'EOF'
Expected: nine `ok` lines, no `UNCITED`. Six of the nine are Kanri's, because
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected: `1`

- [ ] **Step 15: P6.5 — replace the passage**

This is a **replacement** of the last five MAP lines, the closing fence, and
check 3's Expected paragraph: the line `templates/review-brief.md
skills/tanto/roles/kanri.md` is added after the `kaiseki-brief` line, "nine"
becomes "ten", and "Six of the nine ... six of the templates" becomes "Seven of
the ten ... seven of the templates". The five MAP lines above are untouched.

Old passage — replace exactly these 9 lines of
`docs/notes/tanto-consistency-checks.md` and nothing else:

````markdown
templates/kaiseki-brief.md skills/tanto/roles/kanri.md
templates/batch-report.md skills/tanto/roles/jisso.md
templates/kaiseki-report.md skills/tanto/roles/kaiseki.md
templates/tanto.json skills/tanto/SKILL.md
MAP
```

Expected: nine `ok` lines, no `UNCITED`. Six of the nine are Kanri's, because
Kanri copies six of the templates itself.
````

New passage — the tree's current text with exactly the change the spec's table
under "Where each change lives" names, written with the file's CRLF ending:

````markdown
templates/kaiseki-brief.md skills/tanto/roles/kanri.md
templates/review-brief.md skills/tanto/roles/kanri.md
templates/batch-report.md skills/tanto/roles/jisso.md
templates/kaiseki-report.md skills/tanto/roles/kaiseki.md
templates/tanto.json skills/tanto/SKILL.md
MAP
```

Expected: ten `ok` lines, no `UNCITED`. Seven of the ten are Kanri's, because
Kanri copies seven of the templates itself.
````

- [ ] **Step 16: Verify P6.5**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
templates/kaiseki-brief.md skills/tanto/roles/kanri.md templates/review-brief.md skills/tanto/roles/kanri.md templates/batch-report.md skills/tanto/roles/jisso.md templates/kaiseki-report.md skills/tanto/roles/kaiseki.md templates/tanto.json skills/tanto/SKILL.md MAP ``` Expected: ten `ok` lines, no `UNCITED`. Seven of the ten are Kanri's, because Kanri copies seven of the templates itself.
EOF
)
tr -d '\r' < docs/notes/tanto-consistency-checks.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The old passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
templates/kaiseki-brief.md skills/tanto/roles/kanri.md templates/batch-report.md skills/tanto/roles/jisso.md templates/kaiseki-report.md skills/tanto/roles/kaiseki.md templates/tanto.json skills/tanto/SKILL.md MAP ``` Expected: nine `ok` lines, no `UNCITED`. Six of the nine are Kanri's, because Kanri copies six of the templates itself.
EOF
)
tr -d '\r' < docs/notes/tanto-consistency-checks.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `0`

- [ ] **Step 17: Verify the P6.6 anchor, before the edit**

Anchor — one current line of `docs/notes/tanto-consistency-checks.md`, which
occurs there exactly once.
It is the last line of check 6's final Expected paragraph.

````markdown
see all three copies at once caught it.
````

Run:

````bash
needle=$(cat <<'EOF'
see all three copies at once caught it.
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected: `1`

- [ ] **Step 18: P6.6 — insert the passage**

This is an **insertion**: the new block is check 6's sixth and last, appended
after the final Expected paragraph of the block that pins "orders line, and the
batch prompts" and before the `## 7. The strings that must be absent` heading,
separated from each by one blank line.

Old passage — the anchor line, which stays exactly as it is. The new passage
goes **after** it:

````markdown
see all three copies at once caught it.
````

New passage — the spec's block under "Where each change lives", written with
the file's CRLF ending:

````markdown
The two lines of the review brief, and the idle subscription that only the
exit lines keep, each on one line where it occurs, counted raw over every
Markdown file of the skill so that a stray copy fails the check:

```bash
for f in skills/tanto/SKILL.md skills/tanto/roles/*.md skills/tanto/templates/*.md; do
  printf '%s review-ready %s brief %s idle %s\n' "$f" "$(grep -cF 'review-ready: <' "$f")" "$(grep -cF 'brief: <path>' "$f")" "$(grep -cF 'notify_when_idle: true' "$f")"
done
```

Expected: `skills/tanto/SKILL.md review-ready 1 brief 1 idle 2`,
`skills/tanto/roles/kanri.md review-ready 1 brief 1 idle 2`,
`skills/tanto/roles/sekkei.md review-ready 2 brief 2 idle 0`, and every other
line ending `review-ready 0 brief 0 idle 0`. The two `idle` in `SKILL.md`
are the Messages bullet's exception and the Session exit paragraph; the two
in `roles/kanri.md` are the exit lines. A batch prompt or a brief sent with a
subscription would show as a third.
````

- [ ] **Step 19: Verify P6.6**

The new passage, on the flattened file:

````bash
needle=$(cat <<'EOF'
The two lines of the review brief, and the idle subscription that only the exit lines keep, each on one line where it occurs, counted raw over every Markdown file of the skill so that a stray copy fails the check: ```bash for f in skills/tanto/SKILL.md skills/tanto/roles/*.md skills/tanto/templates/*.md; do printf '%s review-ready %s brief %s idle %s\n' "$f" "$(grep -cF 'review-ready: <' "$f")" "$(grep -cF 'brief: <path>' "$f")" "$(grep -cF 'notify_when_idle: true' "$f")" done ``` Expected: `skills/tanto/SKILL.md review-ready 1 brief 1 idle 2`, `skills/tanto/roles/kanri.md review-ready 1 brief 1 idle 2`, `skills/tanto/roles/sekkei.md review-ready 2 brief 2 idle 0`, and every other line ending `review-ready 0 brief 0 idle 0`. The two `idle` in `SKILL.md` are the Messages bullet's exception and the Session exit paragraph; the two in `roles/kanri.md` are the exit lines. A batch prompt or a brief sent with a subscription would show as a third.
EOF
)
tr -d '\r' < docs/notes/tanto-consistency-checks.md | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"
````

Expected: `1`

The anchor, raw, still in the file:

````bash
needle=$(cat <<'EOF'
see all three copies at once caught it.
EOF
)
grep -cF -- "$needle" docs/notes/tanto-consistency-checks.md
````

Expected: `1`

- [ ] **Step 20: The diff is exactly this task's passages**

Run: `git diff "$(git merge-base main HEAD)" -- docs/notes/tanto-consistency-checks.md`
Expected: six hunks, one per passage — the flattened-count paragraph, the
Versions bullet, check 1, check 2's Expected, check 3, and check 6's new block —
and nothing else.

Run: `git diff "$(git merge-base main HEAD)" -- docs/notes/tanto-consistency-checks.md | grep -c '^@@'`
Expected: `6`. A task-time check, measured on scratch copies of the tree with a
3-context unified diff while this plan was drafted; `git diff` merges two changed
regions into one hunk when at most six unchanged lines separate them, so read the
hunks against the blocks above rather than trusting the number alone.

- [ ] **Step 21: The line ending did not change**

Run: `git ls-files --eol docs/notes/tanto-consistency-checks.md`
Expected: `i/lf    w/crlf    attr/text=auto` — the same `w/crlf` this task read
before its first edit, and never `w/mixed`.

- [ ] **Step 22: Lint the path**

Run: `./scripts/lint.sh docs/notes/tanto-consistency-checks.md` (Windows: `scripts\lint.bat docs/notes/tanto-consistency-checks.md`)
Expected: every hook `Passed` or `Skipped`, none `Failed`. Name the file — a
directory argument makes every hook skip and proves nothing.

- [ ] **Step 23: Commit**

Commit by explicit path, the only form this repository allows:

````bash
git add docs/notes/tanto-consistency-checks.md
git commit --only docs/notes/tanto-consistency-checks.md -m "docs(notes): the consistency checks count the tenth template and the brief lines" -m "Checks 1, 2, and 3 count sixteen skill files and ten templates now that templates/review-brief.md exists and SKILL.md and roles/kanri.md name it. A sixth check 6 block pins review-ready: <, brief: <path>, and notify_when_idle: true raw over every Markdown file of the skill, so a stray copy or a subscription that came back fails the check. The opening records that a flattened grep -cF returns 0 or 1 and is never an occurrence count." -m "Co-Authored-By: Claude <noreply@anthropic.com>"
````

- [ ] **Step 24: Verify the trailer**

Run: `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'`
Expected: `1`

---

### Task 7: the consistency pass

**Files:**

- Modify: nothing. This task writes no file and makes no commit.

**Interfaces:**

- Consumes: the six files Tasks 1 to 6 wrote;
  `docs/notes/tanto-consistency-checks.md` as the source of the commands, in
  the state Task 6 leaves it; and
  `.superpowers/sdd/review-brief/checks-baseline.md`, the recorded output of
  the same checks on the pre-edit tree. Sekkei recorded it on 2026-09-08,
  before any task, by running checks 1 to 8 and check 9's second block; the
  six files this plan edits have not changed since, so it is not re-taken
  before batch B; it is untracked. If it is missing, that is a Rulings-needed
  item, not a reason to skip the comparison.
- Produces: the recorded output of every check. That output **is** the
  deliverable. This is a **verification-only task** in the sense
  `roles/jisso.md` defines: the dispatch tells the reviewer to **re-run** the
  checks rather than trust this report, because a report of a check is not the
  check.

Run the note's commands **as written** — do not paraphrase them — so that a
divergence between the note and the tree is the note's problem or the tree's,
never a transcription's. Compare every output with two things: the note's own
Expected text, and the same check's Output block in
`.superpowers/sdd/review-brief/checks-baseline.md`. Checks 1, 2, 3, and 6 are
**expected to differ** from the baseline, exactly as Task 6 changed them; the
report names the difference per check. Every other check must equal its
baseline.

**A failing check is a Rulings-needed item in the batch report, never an edit.**
A fix outside the twenty-three passages would break the invariant that each
file's merge-base diff is exactly its passages. Kanri rules on it, and a ruled
correction lands in the whole-branch review's fix wave.

- [ ] **Step 1: Check 1 — every file of the layout exists**

Run the fenced `bash` block under `## 1. Every file of the layout exists` in
`docs/notes/tanto-consistency-checks.md`.
Expected: all sixteen paths listed, no `No such file or directory`.
**Differs from the baseline**, which lists fifteen: the extra line is
`skills/tanto/templates/review-brief.md`, created by Task 1. Say so in the report.

- [ ] **Step 2: Check 2 — every in-skill path resolves**

Run the block under
`## 2. Every in-skill path named by the contract or a role file resolves`.
Expected: fourteen `ok` lines and no `MISSING` line — `roles/jisso.md`,
`roles/kaiseki.md`, `roles/kanri.md`, `roles/sekkei.md`,
`templates/batch-prompt.md`, `templates/batch-report.md`,
`templates/bug-report.md`, `templates/kaiseki-brief.md`,
`templates/kaiseki-report.md`, `templates/kanri-handover.md`,
`templates/kanri.md`, `templates/review-brief.md`, `templates/roster.md`,
`templates/tanto.json`.
**Differs from the baseline**, which has thirteen: the extra line is
`ok       templates/review-brief.md`, which resolves because Task 1 created the
file and Task 2 named it in `SKILL.md`. Say so in the report.

- [ ] **Step 3: Check 3 — every template is cited by its copier**

Run the block under `## 3. Every template is cited by the role that copies it`.
Expected: ten `ok` lines, no `UNCITED`.
**Differs from the baseline**, which has nine: the extra line is
`ok       templates/review-brief.md <- skills/tanto/roles/kanri.md`, which is `ok`
because Task 5's Human access item 5 names the template. Seven of the ten are
Kanri's. Say so in the report.

- [ ] **Step 4: Check 4 — the superpowers and shoroku sentences still exist**

Run the block under
`## 4. The superpowers and shoroku sentences the skill overrides still exist`.
Expected: a nonzero count on every `grep` line, and `code-reviewer-present`. Same
as the baseline. A zero here is **not** fixed: report which line no longer matches
as a ruling needed, and record the version stamp the note's "Versions these checks
assume" section asks for.

- [ ] **Step 5: Check 5 — the two verbatim quotes**

Run the block under
`## 5. The two verbatim quotes' pinned lines are present in every copy`.
Expected: `1` on all five lines. Same as the baseline.

- [ ] **Step 6: Check 6 — the strings the roles route on**

Run all **six** blocks under `## 6. The strings the roles route on` — the five the
note already had and the sixth Task 6 added.

Expected from the first block, the twenty-seven numbers `2`, `1`, `1`, `2`, `1`,
`1`, `1`, `1`, `5`, `3`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `1`, `3`,
`1`, `1`, `1`, `1`, `1`, `1` in that order; then five lines each ending `-> 1`
(the triage answers); then five more each ending `-> 1` (the human-access request
line in the contract and the four role files); then three each ending `-> 1` (the
`kanri-address:` obligation sentence, flattened, in the three peer role files);
then three lines each ending `-> 1` and no output from the `grep -rn 'orders
lines'` (the authority triad). Those five blocks are **the same as the baseline**:
no passage of this plan adds or removes a string they count.

Expected from the sixth block, fourteen lines:

````text
skills/tanto/SKILL.md review-ready 1 brief 1 idle 2
skills/tanto/roles/jisso.md review-ready 0 brief 0 idle 0
skills/tanto/roles/kaiseki.md review-ready 0 brief 0 idle 0
skills/tanto/roles/kanri.md review-ready 1 brief 1 idle 2
skills/tanto/roles/sekkei.md review-ready 2 brief 2 idle 0
skills/tanto/templates/batch-prompt.md review-ready 0 brief 0 idle 0
skills/tanto/templates/batch-report.md review-ready 0 brief 0 idle 0
skills/tanto/templates/bug-report.md review-ready 0 brief 0 idle 0
skills/tanto/templates/kaiseki-brief.md review-ready 0 brief 0 idle 0
skills/tanto/templates/kaiseki-report.md review-ready 0 brief 0 idle 0
skills/tanto/templates/kanri-handover.md review-ready 0 brief 0 idle 0
skills/tanto/templates/kanri.md review-ready 0 brief 0 idle 0
skills/tanto/templates/review-brief.md review-ready 0 brief 0 idle 0
skills/tanto/templates/roster.md review-ready 0 brief 0 idle 0
````

**Differs from the baseline**, which has no sixth block at all: the block is
new with Task 6, and its fourteen lines are the tree sweep that decides the batch
B boundary — one `review-ready: <` and one `brief: <path>` in the contract and in
Kanri's file, two in Sekkei's, two `notify_when_idle: true` in the contract and
two in Kanri's file, and zeros everywhere else. Say so in the report.

- [ ] **Step 7: Check 7 — the strings that must be absent**

Run both blocks under `## 7. The strings that must be absent`.
Expected: no output from the first nine greps; the tenth read by eye for an actual
commit hash, of which there must be none; then exactly `skills/tanto/SKILL.md:1`
and `skills/tanto/README.md:1`. Same as the baseline. The ninth grep —
`skills/tanto/` inside `SKILL.md`, `roles/`, and `templates/` — is the one this
plan could have broken, since Tasks 1, 2, 4, and 5 added runtime text; it must
still print nothing.

- [ ] **Step 8: Check 8 — the frontmatter and the JSON parse**

Run the block under `## 8. The frontmatter and the JSON parse`.
Expected: `['argument-hint', 'description', 'name']`, then `ok`, then `json ok`.
Same as the baseline. Use `uv run --no-project`, never a bare `python`.

- [ ] **Step 9: Check 9, the second block only — the whitespace and final-newline sweep**

Run the **second** fenced `bash` block under `## 9. Linting an extracted tree` —
the `find skills docs -name '*.md' -print0` loop.
Expected: `done` alone. Same as the baseline.

Do **not** run the first block of check 9. It lints a tree of blocks extracted
from a whole-file plan; this plan carries passages and extracts nothing, which is
what the note's opening records.

- [ ] **Step 10: Lint every path the plan touched, by name**

Run: `./scripts/lint.sh skills/tanto/templates/review-brief.md skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/sekkei.md skills/tanto/roles/kanri.md docs/notes/tanto-consistency-checks.md`
(Windows: the same six paths after `scripts\lint.bat`.)
Expected: every hook `Passed` or `Skipped`, none `Failed`. Six paths, the six of
the File structure table. Naming the files matters — a directory argument makes
every hook skip and proves nothing.

- [ ] **Step 11: Every file's diff is still exactly its passages**

Run:

````bash
git diff "$(git merge-base main HEAD)" -- skills/tanto/templates/review-brief.md | grep -c '^@@'
git diff "$(git merge-base main HEAD)" -- skills/tanto/SKILL.md | grep -c '^@@'
git diff "$(git merge-base main HEAD)" -- skills/tanto/README.md | grep -c '^@@'
git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/sekkei.md | grep -c '^@@'
git diff "$(git merge-base main HEAD)" -- skills/tanto/roles/kanri.md | grep -c '^@@'
git diff "$(git merge-base main HEAD)" -- docs/notes/tanto-consistency-checks.md | grep -c '^@@'
git ls-files --eol skills/tanto/templates/review-brief.md skills/tanto/SKILL.md skills/tanto/README.md skills/tanto/roles/sekkei.md skills/tanto/roles/kanri.md docs/notes/tanto-consistency-checks.md
````

Expected: `1`, `3`, `3`, `4`, `5`, `6` — twenty-two hunks over six files for
twenty-three passages: in `roles/sekkei.md` three passages merge into one hunk
(the `dialogue.md` paragraph, the requirement-citation paragraph, and Step 2's
new first paragraph, within six unchanged lines of each other), and Step 2's
replacement splits into two hunks across its seven-line transcribed middle
paragraph, so five passages give four hunks. Then `w/lf` for
`templates/review-brief.md`, `SKILL.md`, and `README.md`, `w/crlf` for
`roles/sekkei.md`, `roles/kanri.md`, and the note, and `w/mixed` for none. The
hunk numbers are task-time checks; read the hunks themselves against the plan's
twenty-three passages.

- [ ] **Step 12: Every commit on the branch carries the trailer**

Run:

````bash
for c in $(git log --format=%H main..HEAD); do
  printf '%s %s\n' "$(git log -1 --format=%s "$c" | cut -c1-60)" "$(git log -1 --format=%B "$c" | grep -c '^Co-Authored-By: Claude')"
done
````

Expected: one line per commit, every line ending in ` 1`. The branch also
carries Sekkei's spec and plan commits, Kanri's T1 write-out, and Kanri's
`docs(issues):` commits, so there are more lines than this plan's six task
commits; the per-commit `1` is the check. An aggregate `grep -c` over the
whole range would let a commit with two trailer lines hide one with none
(design-4807's plan conventions), which is why the loop.

- [ ] **Step 13: Record the output**

Paste every command's actual output into the batch report's Verification section,
one line per command, and next to each say whether it matches
`.superpowers/sdd/review-brief/checks-baseline.md` — and for checks 1, 2, 3, and 6,
name the difference and why Task 6 made it. The report is not "all checks passed";
it is the output. This task changes no file and makes no commit — say so
explicitly. Anything that failed goes under **Rulings needed**, with the check
number, the command, and the actual output.

---

## Batches

Two batches, seven tasks. Batch A lands the contract's side — the new
template first, then `SKILL.md`'s two lines, two artifact rows, and ten
templates, then the README — and batch B lands the roles that act on it,
the note, and the consistency pass. The template comes first so that
`SKILL.md` never names a file the tree lacks.

**The batch A boundary is not the boundary from which a role may be started
or replaced.** After A the contract and the README describe a flow the two
role files do not yet run — neither sends `review-ready:` or `brief:`,
Sekkei's file keeps no `dialogue.md`, and Kanri's file still sends every
prompt and brief with the idle subscription the contract now forbids — and
the note still expects thirteen `ok` lines from check 2 where the tree now
gives fourteen, and still says "Fifteen skill files, nine of them templates".
That is the forward-reference set, the contract a batch ahead of the roles
and the note that act on it. **The batch B boundary is the boundary from which a role may
be started or replaced, and it is the final boundary** — the case Sekkei's
Step 3 bullet foresees; a replacement waits for it. This plan expects one
Jisso throughout, so no replacement is planned at either. Kanri edits
nothing at either boundary: the roster and the ledger are untracked, and no
template this plan changes or adds is one Kanri copies mid-run (the brief
template is copied by the writer Kanri dispatches, after the plan lands).

| Batch | Tasks | Delivers | Stop conditions at the boundary |
| --- | --- | --- | --- |
| A | 1, 2, 3 | `templates/review-brief.md`, new; `SKILL.md` with its Messages list replaced (the idle rule, the boundary reply, the review-brief bullet), the `dialogue.md` and `review-brief-*.md` rows in Artifacts, and ten templates; `README.md` with the review-brief bullet, ten templates in Layout, and four designs | lint clean on the three paths, by name; `git ls-files --eol` shows `i/lf w/lf` for the template after `git add`, and the same `w/lf` as before for `SKILL.md` and `README.md`; every flattened new-passage grep of Tasks 2 and 3 returns `1`, the old-passage greps of the replacements return `0`, the anchors of the insertions still return `1`, and Task 1's heading listing (eight headings in the template's order), line-ending check, and one-hunk diff pass; `git diff "$(git merge-base main HEAD)" -- <file>` for each of the three read hunk by hunk against the blocks, with the hunk counts the tasks state; `SKILL.md` passes the frontmatter hook and its PyYAML load prints `['argument-hint', 'description', 'name']` then `ok`; the README drift review recorded in Task 3; the raw tree sweep of "How a batch is verified" prints `skills/tanto/SKILL.md review-ready 1 brief 1 idle 2`, `skills/tanto/roles/kanri.md review-ready 0 brief 0 idle 6`, and `review-ready 0 brief 0 idle 0` on every other line — the six in Kanri's file are the forward reference the idle rule leaves until Task 5; the term sweep over batch A's blocks records its set — the two lines, `dialogue.md`, `templates/review-brief.md`, `review-brief-spec.md`, `review-brief-plan.md`, `notify_when_idle` — as the forward-reference set, not empty; `git status --short` prints nothing; every commit carries the trailer; the note's checks 1 to 8 are **not** run here |
| B | 4, 5, 6, 7 | `roles/sekkei.md` with `dialogue.md`, the requirement citation and the held review gate, Step 2 replaced, the passage-plan paragraph, and Step 4's list; `roles/kanri.md` with the idle rule in When the plan lands, the batch loop, and the Kaiseki branch, Human access item 5, and the Replace row; the note with the flattened-count sentence, sixteen files, fourteen `ok` lines, ten templates, and the sixth check 6 block; the consistency pass recorded | lint clean on each named path; every flattened new-passage grep of Tasks 4 to 6 returns `1`, the old-passage greps of the replacements return `0`, the anchors of the insertions still return `1`; the diffs of all six files read hunk by hunk against the blocks; `git ls-files --eol` unchanged for the five edited files; the raw tree sweep prints `skills/tanto/SKILL.md review-ready 1 brief 1 idle 2`, `skills/tanto/roles/kanri.md review-ready 1 brief 1 idle 2`, `skills/tanto/roles/sekkei.md review-ready 2 brief 2 idle 0`, and `review-ready 0 brief 0 idle 0` on every other line — the note's new check 6 values; every check in Task 7's report matches the note's Expected text as Task 6 leaves it, and matches `.superpowers/sdd/review-brief/checks-baseline.md` except checks 1, 2, 3, and 6, whose differences are exactly Task 6's (sixteen, fourteen, ten and seven, the sixth block) and are named per check; Task 7's per-commit loop shows every commit on `main..HEAD` carrying exactly one `Co-Authored-By: Claude` line; `git diff "$(git merge-base main HEAD)" --stat` names, besides the spec, this plan, and paths under `docs/` from Kanri's own commits, exactly the six files; `git status --short` prints nothing; the tree is self-consistent, so a role may be started or replaced from here |

The final batch — the whole-branch review's fix wave, dispatched by Kanri
after batch B — is the protocol's own and not counted here; a fix-wave list
is drafted under the same conditions as a plan, each command run once
before it is dispatched (Kanri's procedure, The final batch, step 2).

## How a batch is verified

For a Markdown-only plan of passage edits, run this checklist at every
boundary. Every dispatch says what "tests" means for its task, per
`roles/jisso.md`'s "Verification when the plan ships documents".

- [ ] **Lint the changed paths by name.** `./scripts/lint.sh <file> [<file> ...]`
      (Windows: `scripts\lint.bat <file> ...`). Every hook `Passed` or
      `Skipped`, none `Failed`. A directory argument makes every hook skip
      and proves nothing, so always name files. If a hook auto-fixes and
      fails the run, re-stage and re-run.
- [ ] **The passage checks, with needles from heredocs.** For each passage of
      the batch, on the flattened file
      (`tr -d '\r' < <file> | tr '\n' ' ' | tr -s ' ' | grep -cF -- "$needle"`):
      the new passage returns `1`; for a replacement the old passage returns
      `0`; for an insertion the anchor still returns `1`. For the new
      template, the file exists and its eight headings — the title and seven
      `##` — are in the template's order. The commands and the flattened
      needles are in each task.
- [ ] **The diff is exactly the passages.** `git diff "$(git merge-base main HEAD)" -- <file>`
      (the working tree against the merge base, so right before and after a
      commit), read hunk by hunk against the task's blocks. The hunk count
      `git diff "$(git merge-base main HEAD)" -- <file> | grep -c '^@@'`
      is a task-time check the task states, not an invariant: two passages
      within six unchanged lines of each other coalesce into one hunk.
- [ ] **Line endings.** `git ls-files --eol <file>` for each touched file
      shows the same `w/crlf` or `w/lf` it showed before the edit and never
      `w/mixed`; for the new template, after `git add`, `i/lf w/lf`.
- [ ] **The whole-tree sweeps.** `git status --short` prints nothing: the
      workspace `.superpowers/sdd/` is ignored by its own `.gitignore`, and
      nothing else is untracked once the template is added.
      `git diff "$(git merge-base main HEAD)" --stat` names, besides
      `docs/superpowers/specs/2026-09-08-review-brief-design.md`,
      `docs/superpowers/plans/2026-09-09-review-brief.md`, and paths under
      `docs/` from Kanri's own commits (the `docs(issues):` commits and the
      T1 write-out), exactly the plan's files written so far: at the batch A
      boundary the template, `skills/tanto/SKILL.md`, and
      `skills/tanto/README.md`; at the batch B boundary all six.
- [ ] **The raw tree sweep — the two routed lines and the idle subscription**,
      the block under "The two sweeps" below, with the expected output stated
      there for each boundary.
- [ ] **The term sweep — the forward-reference set, from the plan's own
      blocks**, the second block under "The two sweeps" below. At the batch A
      boundary it records the set found as the forward-reference set, which the
      Batches section names and which is expected to be non-empty, since the
      contract is a batch ahead of the roles; at the batch B boundary the set
      is closed, every term having its consumer in the tree.
- [ ] **The frontmatter hook and the colon-space check** (batch A, the
      `SKILL.md` task): the `check-md-frontmatter` hook passes on
      `skills/tanto/SKILL.md`, and the PyYAML load in Global Constraints
      prints `['argument-hint', 'description', 'name']` then `ok`.
- [ ] **Review `README.md` for drift whenever `SKILL.md` changed** — the
      repo's `AGENTS.md` rule; here the README task follows the `SKILL.md`
      task in the same batch and records the review; the three passages are
      the expected changes.
- [ ] **Commit by explicit path with the trailer**, then confirm it:
      `git log -1 --format=%B | grep -c 'Co-Authored-By: Claude'` returns `1`.
- [ ] **At every boundary, re-run the whole set of task-time checks of the
      batch**, not only the ones the boundary asked for.
- [ ] **In batch B only**, Task 7 runs checks 1 to 8 of
      `docs/notes/tanto-consistency-checks.md` as written and check 9's
      whitespace and final-newline sweep, records every output, and compares
      each with the note's Expected text as Task 6 leaves it and with the
      pre-edit baseline `.superpowers/sdd/review-brief/checks-baseline.md`.
      Checks 1, 2, 3, and 6 differ from the baseline exactly as Task 6
      changes them — sixteen paths, fourteen `ok` lines, ten templates and
      seven of Kanri's, the sixth block — and the report names the difference
      per check; every other check equals the baseline. A mismatch beyond
      those is a Rulings-needed item, never an edit. Check 9's extracted-tree
      lint is not run: a passage plan has no extracted tree, and the lint of
      the real file after each task is the lint the hook sees. The note's
      checks are not run at the batch A boundary, where the note is still a
      batch B file and check 2 and the Versions line are in the
      forward-reference set.

### The two sweeps

The raw tree sweep, run as one block from the repository root:

````bash
for f in skills/tanto/SKILL.md skills/tanto/roles/*.md skills/tanto/templates/*.md; do
  printf '%s review-ready %s brief %s idle %s\n' "$f" "$(grep -cF 'review-ready: <' "$f")" "$(grep -cF 'brief: <path>' "$f")" "$(grep -cF 'notify_when_idle: true' "$f")"
done
````

Expected at the batch A boundary: `skills/tanto/SKILL.md review-ready 1 brief
1 idle 2`, `skills/tanto/roles/kanri.md review-ready 0 brief 0 idle 6`, and
`review-ready 0 brief 0 idle 0` on every other line — the contract names
lines no role sends yet and forbids a subscription Kanri's file still makes
four times, which is the forward reference the Batches section declares.
Expected at the batch B boundary: `skills/tanto/SKILL.md review-ready 1 brief
1 idle 2`, `skills/tanto/roles/kanri.md review-ready 1 brief 1 idle 2`,
`skills/tanto/roles/sekkei.md review-ready 2 brief 2 idle 0`, and
`review-ready 0 brief 0 idle 0` on every other line — the values the note's
new check 6 block expects; the remaining `idle` are the exit lines. The count
is raw, per file: a flattened count would return `0` or `1`.

The term sweep, over this plan's own new-passage blocks of Tasks 1 to 3 —
the four-backtick blocks that follow a `New passage —` or `New file` caption —
for every term batch B lands or the note counts. The `awk` keeps only the
lines inside those blocks; the `grep` lists the hits, so the record is the
output itself:

````bash
sed -n '/^### Task 1:/,/^### Task 4:/p' docs/superpowers/plans/2026-09-09-review-brief.md \
  | awk '/^New passage —|^New file/{want=1;next} want&&/^````/{inb=!inb; if(!inb){want=0}; next} inb' \
  | grep -n -F -e 'review-ready: <' -e 'brief: <path>' -e 'dialogue.md' -e 'templates/review-brief.md' \
    -e 'review-brief-spec.md' -e 'review-brief-plan.md' -e 'notify_when_idle'
````

Expected at the batch A boundary: hits for exactly these terms, and no
others — `review-ready: <` and `brief: <path>` (the Messages list),
`dialogue.md` (the template and the Artifacts rows), `templates/review-brief.md`
(the Messages list, the Templates sentence, the README's Layout bullet),
`review-brief-spec.md` and `review-brief-plan.md` (the template, the Messages
list, the Artifacts rows), and `notify_when_idle` (the Messages list). That
set is the forward-reference set the Batches section names, and the boundary
is declared unsafe for a role start or replacement because of it; a term
missing from the output means a passage lost it, and a term not in this list
means the set grew. Record the output. At the batch B boundary the same
command is not needed: the set is closed by construction, and the raw tree
sweep shows every consumer in place.

Write-outs — T1, T2, and every exit shoroku — are outside this plan: they
write under `docs/requirements/`, `docs/design/`, `docs/decisions/`, and
`docs/issues/`, which no task touches, and their commits begin
`docs: T<n> shoroku` or `docs: exit shoroku`; the whole-branch review
package excludes exactly those subjects and keeps Task 6's note commit.

## Reporting protocol

Batch prompts and reports follow the tanto templates —
`skills/tanto/templates/batch-prompt.md` and
`skills/tanto/templates/batch-report.md` — and this plan names nothing else
about their shape. A Kaiseki brief and report follow
`skills/tanto/templates/kaiseki-brief.md` and
`skills/tanto/templates/kaiseki-report.md` the same way.

One template is added mid-plan: Task 1 creates
`skills/tanto/templates/review-brief.md`. No batch prompt and no batch report
is written from it — it is the brief writer's template, copied by the subagent
Kanri dispatches, not by an implementer.

## Self-Review

**1. Spec coverage.** Every section and subsection of
`docs/superpowers/specs/2026-09-08-review-brief-design.md` maps to a task or is
named here with the reason it has none:

| Spec section | Task |
| --- | --- |
| the opening paragraphs and the input list | no task: they name what the design closes and what it read; nothing to build |
| Fixed inputs | no task: its decisions are constraints and shape, not deliverables — the passage-level blocks, the two batches, the template first, the boundary from which a role may be started or replaced, the unchanged list. They reach the run through Global Constraints and the Batches section, which Sekkei writes |
| The brief — What it is | 1 (the template is the English source of everything this subsection describes: the five sections plus the unsettled one, the four tags, "How to answer", the pointer as untranslated heading text) |
| The brief — The template | 1 (`skills/tanto/templates/review-brief.md`, the whole file) |
| The brief — The writer | 5 (Human access item 5: the dispatch, its five named inputs, the form check, the one retry, the handover exception, `brief: <path>`) |
| The flow — The lines, in the contract | 2 (`SKILL.md` Messages, the bullet list replaced whole) |
| The flow — Sekkei's obligations | 4 (all five passages of `roles/sekkei.md`) |
| The flow — Kanri's obligation | 5 (`roles/kanri.md` Human access, item 5) |
| The flow — The artifacts | 2 (the two Artifacts rows; the Templates sentence, ten) |
| The flow — The README | 3 (the What it does bullet, the Layout templates bullet, the closing sentence), with the drift review recorded in the same task |
| Kanri stops subscribing to idle (I-4) — The measurement | no task: it is the measurement that motivates the rule |
| Kanri stops subscribing to idle (I-4) — The rule | 2 (the contract's bullet, inside the Messages list) and 5 (`roles/kanri.md`: When the plan lands step 5, the batch loop steps 1 to 8, the Kaiseki branch step 2, the Replace table row) |
| Kanri stops subscribing to idle (I-4) — At T2 | no task: design-4807's "Kanri's loop" paragraph is a shoroku write-out, outside every plan task |
| What the human's answer means | no task: it says what the brief's answers count as, and the two role files carry it as the review gates of Task 4 and the dispatch of Task 5 |
| Requirements — The two questions | 1 (the template's section 3, its two questions and its tags) and 4 (Step 1's requirement-citation paragraph, which is where the first question's answer comes from) |
| Requirements — The a1c9 need is a requirement | no task: req-04f5 gains the bullet at T1, a write-out outside the plan |
| Requirements — What goes to kisou and shoroku | no task: it is the analysis for deferred item 1, filed as an issue at T1 |
| Where each change lives | the File structure table above, row for row, and the twenty-three passages of Tasks 1 to 6; the Task 7 sentence is its last paragraph, and the two quoted blocks in it are the new passages of P6.1 and P6.6 |
| What the plan must contain | the passage-level blocks in every task; the needle rule stated once at the top of Task 1 and used in every check; seven tasks in two batches; the boundaries, Global Constraints, and how a batch is verified, which Sekkei writes; the line-ending rule as a per-task command rather than a table; the Reporting protocol section |
| Verification, per passage | each task's anchor, flattened-passage, diff, line-ending, lint, commit, and trailer steps |
| Verification, the new template | 1 (Steps 1, 3, 4, and 5: the file exists, its eight headings in order, `i/lf w/lf` after `git add`, one hunk) |
| Verification, at the batch A boundary | 2 (the PyYAML load and its fallback, the `skills/tanto/` sweep, the three raw counts) and 3 (the recorded README drift review); the raw tree sweep and the term sweep over batch A's blocks belong to the Batches and How-a-batch-is-verified sections, which Sekkei writes |
| Verification, at the batch B boundary | 7 (checks 1 to 8, check 9's second block, the comparison with the baseline, the lint by name, the six hunk counts and endings, the trailer equality, the recorded output) |
| Out of scope | no task, by construction: no task names the repo-root `README.md`, superpowers, `shoroku`, `kisou`, `templates/tanto.json`, `roles/jisso.md`, `roles/kaiseki.md`, or anything under `docs/requirements/`, `docs/design/`, `docs/decisions/`, or `docs/issues/` |
| Answers to the spec inputs | no task: I-1 to I-4 are answered by the passages above and the table adds nothing to build |
| Deferred items | no task: both are filed as issues at T1, a write-out outside the plan |
| Shoroku candidates from this spec work | no task: T1, T2, and the exit shoroku write those under `docs/`, which no task touches except the note, and the note is plan output |

**2. Placeholder scan.** No `TBD`, no `TODO`, no "implement later", no "similar
to Task N", no "add appropriate ...". Every edit step carries the anchor, the
old passage, and the new passage in full, verbatim; every verification step
names the exact command and the exact expected output. The three sections
Global Constraints, Batches, and How a batch is verified are **Sekkei's own
additions** under `roles/sekkei.md` Step 3, written after the drafter's tasks,
and each is complete: the constraints the batch prompts are built from, each
batch's tasks, deliverable, and stop conditions, and the verification
checklist with its two sweeps, including the batch B boundary as the point
from which a role may be started or replaced.

**3. Consistency across tasks.** Checked and reconciled:

- **File paths.** The six paths in the File structure table are the same
  strings used in every task's `Files:` block, in every `grep`, `git diff`, and
  `git ls-files --eol` command, in every commit command, and in Task 7's lint
  line. No task names a seventh path.
- **Passage count.** Twenty-three: one new file (Task 1), three in `SKILL.md`
  (Task 2), three in `README.md` (Task 3), five in `roles/sekkei.md` (Task 4),
  five in `roles/kanri.md` (Task 5), and six in the note (Task 6). The File
  structure table and the spec's "Where each change lives" table both say
  twenty-three, row for row.
- **Anchors and old passages.** Each of the twenty-two anchors was run with
  `grep -cF -- "$needle"` against the tree before this plan was written and
  returned `1`. Each replacement's old passage was run in the flattened form
  against the tree and returned `1`. Task 1's file was confirmed absent.
- **Hunk counts.** `1`, `3`, `3`, `4`, `5`, `6`, measured while this plan was
  drafted by applying the twenty-two passages to scratch copies of the five
  files — never to the tree — and taking a 3-context unified diff of each copy
  against its original. `roles/sekkei.md` is the one file whose hunks are fewer
  than its passages: the `dialogue.md` paragraph, the requirement-citation
  paragraph, and Step 2's new first paragraph are separated by fewer than seven
  unchanged lines and merge into one hunk, while Step 2's replacement splits
  into two hunks across its seven-line transcribed middle paragraph — five
  passages, four hunks. Every count is labeled a task-time
  check, and every diff step tells the reviewer to read the hunks against the
  blocks.
- **The routed-string counts.** They agree across four places: Task 2's step
  expects `1`, `1`, `2` on `SKILL.md`; Task 4's expects `2`, `2`, `0` on
  `roles/sekkei.md`; Task 5's expects `1`, `1`, `2` on `roles/kanri.md`; and
  Task 6's new check 6 block, run in Task 7, expects those same three files at
  those same values with zeros on every other file of the skill. Every one of
  them is a **raw** `grep -cF`, because `review-ready: <path>`,
  `brief: <path>`, and `notify_when_idle: true` each stay on one line wherever
  they occur — which is also what the note's new flattened-count sentence
  (P6.1) says a flattened count could not do.
- **The counts the note carries.** Sixteen skill files and ten templates in
  Versions (P6.2) and in check 1 (P6.3); fourteen `ok` lines in check 2 (P6.4);
  ten `ok` lines, seven of them Kanri's, in check 3 (P6.5). They agree with
  `SKILL.md`'s Templates sentence (P2.3, ten names) and with the README's
  Layout bullet (P3.2, the same ten names), and Task 7 reads them back off the
  tree.
- **Task order inside batch B.** Task 6 changes what check 3 expects and Task 5
  is what makes it true — `templates/review-brief.md` is `ok` only because
  Kanri's item 5 cites it — so Task 5 precedes Task 6, and Task 7 runs after
  both.
- **Line endings.** No table: each task's first step runs
  `git ls-files --eol <file>` and states the value it must read —
  `w/lf` for `SKILL.md` and `README.md`, `w/crlf` for `roles/sekkei.md`,
  `roles/kanri.md`, and the note — and each task's line-ending step expects the
  same value again, never `w/mixed`. Task 1's new file is written LF and read
  after `git add`, because `git ls-files --eol` prints nothing for an untracked
  path.
- **The trailer string.** Every commit command ends with
  `-m "Co-Authored-By: Claude <noreply@anthropic.com>"`, every per-task trailer
  check greps the prefix `Co-Authored-By: Claude`, and Task 7's branch-wide
  count greps that same prefix.
- **Linted versus ignored.** `SKILL.md`, `README.md`, `roles/sekkei.md`,
  `roles/kanri.md`, and the note are markdownlint-checked, and none of their new
  passages carries a bare `<placeholder>` — every angle-bracket blank sits
  inside a code span. `templates/review-brief.md` is markdownlint-ignored under
  `skills/**/templates/**`, so Task 1's bare `<...>` blanks and its long lines
  are correct there, and the trailing-whitespace, end-of-file, and
  mixed-line-ending hooks still apply to it.
- **Runtime text.** No new passage of Tasks 1, 2, 4, or 5 contains the string
  `skills/tanto/`; the contract, the role files, and the new template name
  `templates/review-brief.md` skill-relative. Task 2 Step 12 asserts it for
  `SKILL.md` and Task 7 Step 7 asserts it over the whole skill. `skills/tanto/`
  appears only in this plan's own commands and in the note.
