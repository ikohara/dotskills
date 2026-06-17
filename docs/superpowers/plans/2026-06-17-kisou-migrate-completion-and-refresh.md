# kisou Migrate Completion & Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make kisou's migrate mode detect partial doc-system state, offer
scripts the repo lacks, and refresh kisou-managed files toward the current
template — resolving issues `5e7f`, `b2a4`, `e8f9`, and `c6d7`.

**Architecture:** All deliverables are **prose/instruction edits** — no code,
no runtime, no unit tests. The substance lives in `skills/kisou/SKILL.md`; the
bundled template files are unchanged (they are the comparison source). Each
task's "test cycle" is: apply the exact edit shown → verify by re-reading /
grepping for the listed strings → let the `markdownlint-cli2` pre-commit hook
gate the commit → commit. Spec:
`docs/superpowers/specs/2026-06-17-kisou-migrate-completion-and-refresh-design.md`.

**Tech Stack:** Markdown; git; pre-commit (`markdownlint-cli2`, run automatically
on `git commit`).

## Global Constraints

- **Language:** American English for all repo content (the edits below).
- **Pre-commit gate:** every `git commit` runs `markdownlint-cli2`; expected
  result for each task is `markdownlint-cli2 ... Passed`. Do not pass
  `--no-verify`.
- **Commit trailer:** end every commit message with
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- **No commit hashes in tracked content** — reference issues/decisions by their
  `issue-<id>` / `decision-<id>` token or by prose, never by SHA.
- **Approval-gated files:** do **not** edit any `AGENTS.md` or `CLAUDE.md` under
  the repo root or `docs/` as part of this work (none of the tasks require it).
  `skills/kisou/templates/**` is **not** edited.
- **No push.** Commit locally only; never push to `origin/main`.
- **Preserve prior wording:** the `e3a1` (FS-enumeration, no `test -d`), `543b`
  (non-type subdir naming exemption), and `7d5f` (real-content `.bak`) behaviors
  must remain intact — these edits extend, never regress them.

---

### Task 1: SKILL.md — three-state doc-system detection (issue `e8f9`)

**Files:**
- Modify: `skills/kisou/SKILL.md` (Step 3 migrate detection list — the
  "Existing doc-system" bullet, currently the last bullet before "Pick a
  **scope**").

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: the `none` / `partial` / `full` vocabulary that Task 5 (design
  doc) and Task 7 (issue `e8f9` resolution) reference verbatim.

- [ ] **Step 1: Apply the edit**

Replace this exact block:

```text
- **Existing doc-system** → `{docs,Documents}/AGENTS.md` and per-type files
  present ⇒ doc-system installed; treat the migrate scope as **layer-B
  only** unless the user explicitly asks otherwise.
```

with:

```text
- **Existing doc-system** → classify as `none` / `partial` / `full` by
  enumerating each artifact: `{docs,Documents}/AGENTS.md` and each
  `{docs,Documents}/<type>/AGENTS.md` (requirements / design / decisions /
  issues).
  - **none** (no doc-system artifacts) → install the full doc-system.
  - **full** (root `AGENTS.md` + all four per-type files present) → leave
    intact; treat the migrate scope as **layer-B only** unless the user asks
    otherwise. It is still a refresh target (see the Present branch below).
  - **partial** (some artifacts present, others missing) → list what is present
    vs. missing and propose adding **only the missing** pieces. Surface any
    non-standard subdirectory under `{docs,Documents}/` (e.g. `superpowers/`, a
    non-standard issue-status dir) as **kept by default**, and note it is
    **exempt from the `<id>-<slug>` naming rules** — its own tool's convention
    wins. The `open`/`deferred`/`resolved` status subdirs are created on demand
    and are not part of the present/missing tally.
```

- [ ] **Step 2: Verify the edit**

Run: `Grep -n "none / partial / full" skills/kisou/SKILL.md`
Expected: 1 match (the new bullet).
Run: `Grep -n "test -d" skills/kisou/SKILL.md`
Expected: still present in the detection-preamble paragraph (the `e3a1`
no-`test -d` caveat must be untouched).
Re-read the bullet and confirm `partial` mentions the `543b` naming exemption.

- [ ] **Step 3: Commit**

```bash
git add skills/kisou/SKILL.md
git commit -m "feat(kisou): detect partial doc-system state in migrate (issue-e8f9)

Classify the doc-system as none/partial/full and, on partial, add only the
missing AGENTS.md artifacts while keeping non-standard subdirs (naming-exempt
per issue-543b).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

Expected: pre-commit `markdownlint-cli2 ... Passed`; commit succeeds.

---

### Task 2: SKILL.md — offer absent scripts; dirs stays fact-based (issue `b2a4`)

**Files:**
- Modify: `skills/kisou/SKILL.md` (Step 3 migrate — insert a paragraph
  immediately before the "Pick a **scope**:" paragraph).

**Interfaces:**
- Consumes: nothing.
- Produces: the two-part scripts behavior that Task 5 and Task 7 (issue `b2a4`
  resolution) reference.

- [ ] **Step 1: Apply the edit**

Replace this exact block:

```text
Pick a **scope**: full (layer B + doc-system) or **docs-only** (the case
`shoroku` delegates here). Then, per artifact:
```

with:

```text
After surfacing the detected values for confirmation, **also ask once about
scripts the repo lacks**: list the not-yet-present slots (`setup` / `run` /
`build` / `test` / `lint` / `tidy`) and let the user opt into any. A script
expresses **intent** ("the project should have this"), so absence is a prompt,
not a silent decline. `dirs`, by contrast, is a **fact** (an absent `src/`
means there is no source dir), so its absence is never prompted.

Pick a **scope**: full (layer B + doc-system) or **docs-only** (the case
`shoroku` delegates here). Then, per artifact:
```

- [ ] **Step 2: Verify the edit**

Run: `Grep -n "also ask once about" skills/kisou/SKILL.md`
Expected: 1 match.
Re-read and confirm the paragraph contrasts script-`intent` with dir-`fact` and
that the original "Pick a **scope**:" sentence is preserved directly after it.

- [ ] **Step 3: Commit**

```bash
git add skills/kisou/SKILL.md
git commit -m "feat(kisou): offer absent scripts in migrate; dirs stays fact-based (issue-b2a4)

Split the migrate scripts question into detected (confirm) + an explicit prompt
for not-yet-present slots, so a user can opt into a script the repo lacks. dirs
keeps its existence-based behavior.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

Expected: pre-commit `Passed`; commit succeeds.

---

### Task 3: SKILL.md — refresh kisou-managed files toward template (issues `5e7f`, `c6d7`)

**Files:**
- Modify: `skills/kisou/SKILL.md` (Step 3 migrate — the "Present" per-artifact
  bullet; and a read-only check of "Prohibited actions").

**Interfaces:**
- Consumes: nothing (the fingerprint is self-contained).
- Produces: the "kisou-managed", "refresh toward the current template",
  "fixed-text vs. free-text" vocabulary that Tasks 4–7 reference verbatim.

- [ ] **Step 1: Apply the edit**

Replace this exact block:

```text
- **Present** (`README` / `AGENTS.md` / `CLAUDE.md`) → branch on the file's shape:
  - **Stub-shaped** (heading set matches the template, or `<...>` placeholders
    still remain) → section/block merge: show the diff, get explicit approval,
    insert only what is missing (e.g., the `docs/AGENTS.md` pointer, a missing
    convention section).
  - **Real content** (custom headings / prose, no `<...>` placeholders to fill)
    → do not attempt a merge. With approval, rename the original to `<file>.bak`
    and write a fresh template-filled file, then tell the author to graft the
    wanted sections back by hand. The `.bak` keeps this non-destructive.
```

with:

```text
- **Present** (`README` / `AGENTS.md` / `CLAUDE.md`, or a doc-system
  `AGENTS.md`) → branch on whether the file is **kisou-managed**, i.e. carries a
  template fingerprint:
  - `CLAUDE.md` — the `@AGENTS.md` pointer plus the "All project instructions
    live in `AGENTS.md`" body.
  - `AGENTS.md` — the `@CONTRIBUTING.md or read …` pointer line.
  - `{docs,Documents}/AGENTS.md` — the four-type path table plus the "Document
    management" heading.
  - any layer-B file whose heading set substantially matches the template (the
    prior "stub-shaped" test), or that still has `<...>` placeholders.

  **Kisou-managed** → **refresh toward the current template**. This is the
  upgrade path for a repo scaffolded by an older kisou: re-running migrate picks
  up template changes — no separate mode or trigger. Compare the file's
  structure against what the current template would produce for the detected
  inputs, and propose (always as numbered items, never a silent auto-merge):
    - a **missing** fixed section / block → add it, template-filled;
    - a **diverged fixed-text section** — one whose template body has **no
      `<...>` free-text** (e.g. AGENTS `## Language`, the `docs/AGENTS.md`
      document-management rules) → show the diff and propose replacing the stale
      body.

  Never flag a **free-text section** (template body carrying `<...>` for the
  author to fill, e.g. README `## Tech stack`) — the author owns it and
  staleness cannot be told from an intentional edit. Never propose **deleting**
  an author-added section. Refresh is additive / updating only.

  **Not kisou-managed** (real project content: custom headings / prose, no
  fingerprint) → do not attempt a merge. With approval, rename the original to
  `<file>.bak` and write a fresh template-filled file, then tell the author to
  graft the wanted sections back by hand. The `.bak` keeps this non-destructive.
```

- [ ] **Step 2: Verify the edit**

Run: `Grep -n "refresh toward the current template" skills/kisou/SKILL.md`
Expected: 1 match.
Run: `Grep -n "<file>.bak" skills/kisou/SKILL.md`
Expected: still present (the `7d5f` real-content path is preserved in the
"Not kisou-managed" sub-case).
Run: `Grep -n "overwrite an existing file in migrate mode" skills/kisou/SKILL.md`
Expected: 1 match in "Prohibited actions" — confirm it still reads "without
showing the diff and getting approval" (covers refresh; no edit needed).

- [ ] **Step 3: Commit**

```bash
git add skills/kisou/SKILL.md
git commit -m "feat(kisou): refresh kisou-managed files toward template in migrate (issue-5e7f, issue-c6d7)

Recognize kisou-managed files by a template fingerprint and refresh them: add
missing fixed sections/blocks, update diverged fixed-text sections via numbered
partial-accept; never touch author free-text or remove author sections. This is
the stateless upgrade path; real-content files keep the .bak path (issue-7d5f).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

Expected: pre-commit `Passed`; commit succeeds.

---

### Task 4: README — sync with migrate completion & refresh

**Files:**
- Modify: `skills/kisou/README.md` (the "What it does" → **migrate** bullet,
  currently lines ~13–17).

**Interfaces:**
- Consumes: the vocabulary produced by Tasks 1–3.
- Produces: nothing downstream.

- [ ] **Step 1: Apply the edit**

Replace this exact block:

```text
- **migrate** an existing repo: detects what's already there and drops in
  what's missing without clobbering, with a full or docs-only scope. When an
  existing `README` / `AGENTS` / `CLAUDE` holds real project content rather than
  a fillable stub, it backs the file up to `.bak` and writes a fresh one (with
  approval) instead of forcing a merge.
```

with:

```text
- **migrate** an existing repo: detects what's already there — down to a
  partial doc-system — and drops in what's missing without clobbering, with a
  full or docs-only scope; it also offers scripts the repo lacks. When a present
  `README` / `AGENTS` / `CLAUDE` (or a doc-system `AGENTS.md`) is kisou-managed,
  re-running migrate **refreshes it toward the current template** — adding
  missing sections and updating diverged fixed-text ones, never touching author
  free-text or removing author sections. When such a file instead holds real
  project content, it backs the file up to `.bak` and writes a fresh one (with
  approval) instead of forcing a merge.
```

- [ ] **Step 2: Verify the edit**

Run: `Grep -n "refreshes it toward the current template" skills/kisou/README.md`
Expected: 1 match.
Re-read the bullet and confirm the `.bak` real-content sentence is preserved.

- [ ] **Step 3: Commit**

```bash
git add skills/kisou/README.md
git commit -m "docs(kisou): sync README with migrate completion & refresh

Mention partial doc-system detection, the offer-absent-scripts prompt, and the
re-run-to-refresh upgrade path for kisou-managed files.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

Expected: pre-commit `Passed`; commit succeeds.

---

### Task 5: design doc c1d2 — update the Modes section

**Files:**
- Modify: `docs/design/c1d2-kisou.md` (the `## Modes` → **migrate** bullet, and
  the `## Related` list).

**Interfaces:**
- Consumes: vocabulary from Tasks 1–3.
- Produces: the `decision-<id>` cross-reference slot filled in Task 6.

- [ ] **Step 1: Update the migrate bullet**

Replace this exact block:

```text
- **migrate** — existing repository. **Pre-flight detection** scans the
  target for existing dirs, case-flavored names, scripts, OS-script
  presence, and doc-system files, and pre-populates the inputs above.
  Only undetermined inputs are asked; detected values are surfaced for
  confirmation. Scope is **full** (層B + doc-system) or **docs-only**
  (installing only the doc-system into an existing repo). Per artifact: absent →
  create; present README/AGENTS/CLAUDE → section / block merge with
  shown diff + explicit approval; `scripts/` → add missing requested
  scripts as empty files, never overwrite; existing doc-system → leave
  intact, add only around it.
```

with:

```text
- **migrate** — existing repository. **Pre-flight detection** scans the
  target for existing dirs, case-flavored names, scripts, OS-script
  presence, and doc-system files, and pre-populates the inputs above.
  Doc-system detection is **three-state** (`none` / `partial` / `full`); on
  `partial`, only the missing artifacts are added and non-standard subdirs are
  kept (naming-exempt). Detected values are surfaced for confirmation; beyond
  them, migrate also **asks once about scripts the repo lacks** (`dirs` stays
  existence-only). Scope is **full** (層B + doc-system) or **docs-only**. Per
  artifact: absent → create; a present **kisou-managed** README/AGENTS/CLAUDE
  (or doc-system `AGENTS.md`) → **refresh toward the current template** — add
  missing sections and update diverged fixed-text ones via shown diff + explicit
  approval, never touching free-text or removing author sections (the upgrade
  path for older scaffolds); a present **real-content** file → `.bak` + fresh
  write; `scripts/` → add missing requested scripts, never overwrite; existing
  doc-system → leave intact, add only around it.
```

- [ ] **Step 2: Add the decision cross-reference**

In the `## Related` list, after the `decision-4f5a` line, add:

```text
- `decision-<id>` — stateless structural refresh in migrate (fill in the id
  generated in Task 6).
```

- [ ] **Step 3: Verify**

Run: `Grep -n "three-state" docs/design/c1d2-kisou.md`
Expected: 1 match.

- [ ] **Step 4: Commit**

```bash
git add docs/design/c1d2-kisou.md
git commit -m "docs(design): update c1d2 for migrate completion & refresh

Three-state doc-system detection, the offer-absent-scripts prompt, and the
kisou-managed refresh path in the Modes section.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

Note: the `decision-<id>` line is finalized in Task 6 (after the id exists);
amend it into this commit there, or include it as part of Task 6's commit if you
run Task 6 first. Either ordering is fine as long as the final id matches.

---

### Task 6: new ADR — stateless structural refresh

**Files:**
- Create: `docs/decisions/<id>-stateless-migrate-refresh.md`.

**Interfaces:**
- Consumes: the design vocabulary from Tasks 1–3.
- Produces: `decision-<id>`, referenced by Task 5's `## Related` line and by the
  `5e7f` / `c6d7` resolutions in Task 7.

- [ ] **Step 1: Generate a unique id**

Run (PowerShell):

```powershell
[guid]::NewGuid().ToString('N').Substring(0,4).ToLower()
```

Then confirm it is unused:

Run: `Glob docs/decisions/**/<id>-*.md`
Expected: no matches. (If it matches, regenerate.)

- [ ] **Step 2: Create the file**

Write `docs/decisions/<id>-stateless-migrate-refresh.md` with `<id>` substituted
in the frontmatter:

```markdown
---
id: "<id>"
title: stateless structural refresh in kisou migrate (no version stamp)
status: accepted
supersedes: []
superseded_by: null
created: 2026-06-17
updated: 2026-06-17
---

## Context

kisou migrate could add what an existing repo was missing but had no way to
bring a repo *scaffolded by an older kisou* up to the current template — such
projects drift from the template forever (issue `5e7f`). The merge granularity
for the existing stub-shaped Present branch (auto-merge vs. always ask) was also
never pinned (issue `c6d7`).

## Options

- **Version stamp (stateful).** Write a `kisou-template-version` into generated
  files; migrate compares versions and offers a refresh. Adds persistent state
  to every project, demands a bump on every template change, and still needs
  content comparison to say *what* changed — and already-deployed repos carry no
  stamp, so the projects that most need upgrading cannot be recognized.
- **Stateless structural comparison.** No stamp; recognize kisou-managed files
  by a template fingerprint and compare structure against the current template
  at migrate time.

## Decision

Adopt **stateless structural comparison**. Refresh is a sub-case of the migrate
Present branch — no new mode, no new trigger: a kisou-managed file is refreshed
toward the current template by adding missing fixed sections / blocks and
updating **fixed-text** sections that diverged, always via numbered
partial-accept. Free-text (`<...>`) sections and author-added sections are never
flagged or removed — this is the `c6d7` granularity answer and what bounds false
positives. Real-content files keep the `7d5f` `.bak` + fresh-write path.

## Consequences

- Re-running `kisou migrate` is the upgrade path; it works on any kisou-shaped
  repo regardless of scaffold-time version, including pre-existing ones.
- No manifest / version field is introduced; kisou stays a thin, stateless
  shell.
- Refresh fidelity depends on the fingerprint and the fixed-text / free-text
  line; ambiguous sections err toward leaving the author's content untouched.
- Resolves issues `5e7f` and `c6d7`; complements `e8f9` (three-state doc-system
  detection) and `b2a4` (scripts intent prompt) landed in the same change.
```

- [ ] **Step 3: Backfill the design cross-reference**

Replace the `decision-<id>` placeholder line added in Task 5 with the real id.

Run: `Grep -n "stateless structural refresh in migrate" docs/design/c1d2-kisou.md`
Expected: 1 match, with the real 4-hex id (no literal `<id>`).

- [ ] **Step 4: Commit**

```bash
git add docs/decisions/ docs/design/c1d2-kisou.md
git commit -m "docs(decisions): record stateless migrate refresh

ADR for recognizing kisou-managed files by fingerprint and refreshing toward the
current template, with no version stamp. Resolves the 5e7f/c6d7 fork.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

Expected: pre-commit `Passed`; commit succeeds.

---

### Task 7: resolve issues `5e7f`, `b2a4`, `e8f9`, `c6d7`

**Files:**
- Modify + move: `docs/issues/open/5e7f-kisou-template-upgrade-path.md` →
  `docs/issues/resolved/`.
- Modify + move: `docs/issues/open/b2a4-migrate-script-detection-declines-absent.md` →
  `docs/issues/resolved/`.
- Modify + move: `docs/issues/open/e8f9-partial-doc-system-detection.md` →
  `docs/issues/resolved/`.
- Modify + move: `docs/issues/deferred/c6d7-migrate-merge-granularity.md` →
  `docs/issues/resolved/`.

**Interfaces:**
- Consumes: `decision-<id>` from Task 6 (substitute the real id in the
  resolutions below).

- [ ] **Step 1: Append Resolution + bump `updated:` for each issue**

In `5e7f-...md`: set frontmatter `updated: 2026-06-17` and append:

```markdown

## Resolution

Adopted option (b), stateless: migrate now recognizes kisou-managed files by a
template fingerprint and refreshes them toward the current template (add missing
sections, update diverged fixed-text sections; free-text and author-added
sections untouched). No version stamp (option (a) rejected). Re-running
`kisou migrate` is the upgrade path. See `decision-<id>` and `SKILL.md` Step 3
(migrate) Present branch.
```

In `b2a4-...md`: set `updated: 2026-06-17` and append:

```markdown

## Resolution

migrate's scripts question is now two-part: confirm the detected scripts, then
explicitly ask about the not-yet-present slots so a user can opt into a script
the repo lacks. `dirs` keeps its existence-based behavior (a fact, not an
intent). See `SKILL.md` Step 3 (migrate).
```

In `e8f9-...md`: set `updated: 2026-06-17` and append:

```markdown

## Resolution

Doc-system detection in migrate is now three-state (`none` / `partial` /
`full`). On `partial`, kisou lists present vs. missing artifacts and adds only
what is missing, and surfaces non-standard subdirs as kept + naming-exempt (per
issue `543b`). See `SKILL.md` Step 3 (migrate).
```

In `c6d7-...md`: set `updated: 2026-06-17` and append:

```markdown

## Resolution

Settled by design rather than by accumulated runs: the kisou-managed Present
branch refreshes at **section / block** granularity, always via numbered
partial-accept (no silent auto-merge). The fixed-text-vs-free-text line decides
what is proposed — fixed-text sections may be updated, free-text and
author-added sections are never touched. See `decision-<id>` and `SKILL.md`.
```

(Substitute the real id from Task 6 in the `5e7f` and `c6d7` resolutions.)

- [ ] **Step 2: Move each issue to resolved/**

```bash
git mv docs/issues/open/5e7f-kisou-template-upgrade-path.md docs/issues/resolved/
git mv docs/issues/open/b2a4-migrate-script-detection-declines-absent.md docs/issues/resolved/
git mv docs/issues/open/e8f9-partial-doc-system-detection.md docs/issues/resolved/
git mv docs/issues/deferred/c6d7-migrate-merge-granularity.md docs/issues/resolved/
```

- [ ] **Step 3: Verify**

Run: `Glob docs/issues/resolved/{5e7f,b2a4,e8f9,c6d7}-*.md`
Expected: 4 matches.
Run: `Grep -n "<id>" docs/issues/resolved/5e7f-kisou-template-upgrade-path.md`
Expected: no literal `<id>` — the real decision id is filled in.
Confirm `docs/issues/deferred/` no longer contains `c6d7` (it had 3 other
entries — `3694`, `abaf`, `aeed` — so the directory still exists).

- [ ] **Step 4: Commit**

```bash
git add docs/issues/
git commit -m "docs(issues): resolve 5e7f/b2a4/e8f9/c6d7 (migrate completion & refresh)

Append resolutions and move the four issues to resolved/ now that migrate does
three-state doc-system detection, offers absent scripts, and refreshes
kisou-managed files toward the template.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

Expected: pre-commit `Passed`; commit succeeds.

---

## Self-Review

**Spec coverage:**

- D1 (stateless, no stamp) → Task 6 ADR.
- D2 (refresh is a Present sub-case, re-run = upgrade) → Task 3 prose + Task 6.
- D3 (three-state doc-system) → Task 1.
- D4 (scripts two-part; dirs = fact) → Task 2.
- D5 (additive + fixed-text granularity) → Task 3 + Task 6 + Task 7 (`c6d7`).
- D6 (fingerprint) → Task 3.
- Changes §1–4 (SKILL.md) → Tasks 1–3. §5 (README) → Task 4. §6 (c1d2, ADR,
  issue resolutions) → Tasks 5–7.

**Placeholder scan:** The only `<id>` / `<file>` tokens are intentional — `<id>`
is the to-be-generated decision id (Task 6 generates it; Tasks 5/7 backfill it)
and `<file>.bak` is literal SKILL.md prose. No TBD/TODO.

**Type consistency:** The strings `none / partial / full`, `kisou-managed`,
`refresh toward the current template`, `fixed-text` / `free-text`, and
`decision-<id>` are used identically across Tasks 1–7.

## Notes on ordering

Tasks 1–4 are independent SKILL.md / README edits and may run in any order.
Task 6 must precede the id-backfill steps of Tasks 5 and 7 (or run Task 5's
backfill and Task 7 after Task 6). The recommended order is 1 → 2 → 3 → 4 → 6 →
5-backfill → 7, but executing 5 before 6 is fine if you defer the `decision-<id>`
line to Task 6's commit.
