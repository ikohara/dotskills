# notes/ and reports/ Doc-System Adoption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two document types — `notes/` (maintained references) and
`reports/` (dated, frozen investigations) — to the kisou/shoroku doc-system,
fixing the "free-space" and frontmatter-ambiguity problems.

**Architecture:** The kisou template (`skills/kisou/templates/`) is the source
of truth; this repo's own `docs/` mirrors it (dogfood). Changes land in four
groups: the template, the kisou skill, the shoroku skill, and this repo's docs.
No executable code — deliverables are Markdown/skill files verified by lint plus
content greps.

**Tech Stack:** Markdown, kisou `{{name}}` template placeholders, `pre-commit`
(via `scripts/lint.sh`).

## Global Constraints

- American English for all repo content (code, docs, commits).
- **Template files** (`skills/kisou/templates/**`) use `{{name}}` placeholders
  (`{{docs}}`, `{{notes}}`, `{{reports}}`, `{{requirements}}`, …) and are
  markdownlint-ignored. **Rendered files** (this repo's `docs/**`,
  root `CONTRIBUTING.md`) use plain names; `docs/**` is linted except
  `docs/superpowers/**`.
- The `docs/AGENTS.md` **"For the four type directories only:"** block keeps the
  word "four" — the `<id>`/slug/no-frontmatter rules apply to the managed four
  only. Do NOT change it.
- The CONTRIBUTING **"References"** section keeps its four managed types — it is
  about the `<type>-<id>` reference convention, which flat types do not use.
- Commit by explicit path: `git add <new paths>` first, then
  `git commit --only <paths>`. End every message with
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`. Commit to `main`
  (approved). No auto-push. No `--no-verify`.
- Before each commit run `bash scripts/lint.sh <changed paths>` and confirm
  every hook is `Passed`/`Skipped` (never a `Failed`/auto-fix-and-fail).
- Do NOT touch historical records: `CHANGELOG.md`, `docs/issues/resolved/**`,
  and older files under `docs/superpowers/{plans,specs}/`.

---

### Task 1: kisou template — new types + `docs/AGENTS.md` + CONTRIBUTING

**Files:**
- Create: `skills/kisou/templates/docs/notes/AGENTS.md`
- Create: `skills/kisou/templates/docs/reports/AGENTS.md`
- Modify: `skills/kisou/templates/docs/AGENTS.md`
- Modify: `skills/kisou/templates/CONTRIBUTING.md`

**Interfaces:**
- Produces: the placeholder-form wording that Task 4 mirrors in rendered form,
  and the `{{notes}}` / `{{reports}}` placeholders that Task 2's mapping expands.

- [ ] **Step 1: Create `skills/kisou/templates/docs/notes/AGENTS.md`**

```markdown
# {{notes}}/ — AGENTS

A `note` is a **maintained reference** on **one** concern — a registry,
glossary, mapping table, cheat sheet. It is *living* (updated in place), the
opposite of `{{reports}}/` (dated, frozen). It is **not** a scratchpad or
session log; non-curated content does not belong here (see "Not a scratch
space" in `{{docs}}/AGENTS.md`).

A *flat* type (like `{{reports}}/`): no `<id>`, no frontmatter — the slug is the
identity.

## Rules

- Path `{{docs}}/{{notes}}/<slug>.<ext>`; slug is English kebab-case.
- Format fits the concern: Markdown for prose, TOML/YAML for structured data a
  tool consumes. A structured note may pair with a Markdown sibling of the same
  stem.
- **No frontmatter, decided by extension:** a `.md` note's `# H1` is the title;
  a `.toml`/`.yaml` note states its scope in a leading comment block.
- One concern per note — split if it grows a second. No index file.
- Cited by **path** (notes have no `<id>`); a structured note may be read by
  tooling at runtime.
```

- [ ] **Step 2: Create `skills/kisou/templates/docs/reports/AGENTS.md`**

```markdown
# {{reports}}/ — AGENTS

A `report` records a one-off investigation — a recon, feasibility scan,
measurement run, audit. It is **dated and frozen**: it preserves what was true
at investigation time so later docs can cite it, and is not rewritten as the
project moves on.

A *flat* type (like `{{notes}}/`): no `<id>`, no frontmatter — the file-name
date is the identity.

## Rules

- Path `{{docs}}/{{reports}}/<YYYY-MM-DD>-<slug>.md`; slug is English kebab-case.
- **No frontmatter.** The `# H1` is the title; the leading paragraph states the
  scope.
- **The date lives only in the file name.** Never restate it as an
  `Investigation date:` line or frontmatter field — a second copy just drifts.
  A later write-up or multi-day span can be noted in prose, but the canonical
  date is the single file-name value.
- No index file. Cited by **path** (reports have no `<id>`).

## Lifecycle

- Append-only. To supersede a report, write a new dated one and link back in
  prose; never rewrite history. Edit in place only to fix mistakes or add refs.
```

- [ ] **Step 3: Edit `skills/kisou/templates/docs/AGENTS.md` — intro + type table (delta a)**

Replace the current lines 3–16 (from `This project keeps its state…` through the
closing fence of the four-row `text` block) with:

`````markdown
This project keeps its state as a set of small documents under `{{docs}}/`. The
rules are agent-agnostic: any agent editing these docs follows them, with or
without the `shoroku` skill.

## Document management

Project state lives in six types, one file per entry — four **managed**
(frontmatter with a hash `<id>`) and two **flat** (no `<id>`, no frontmatter;
slug or date is the identity):

```text
{{docs}}/{{requirements}}/<id>-<slug>.md    — what the project must do for users, and why
{{docs}}/{{design}}/<id>-<slug>.md          — how it is built now, and why this shape
{{docs}}/{{decisions}}/<id>-<slug>.md       — ADRs: why a choice was made (immutable record)
{{docs}}/{{issues}}/<status>/<id>-<slug>.md — known problems / deferred decisions
{{docs}}/{{notes}}/<slug>.<ext>             — maintained single-concern references (living)
{{docs}}/{{reports}}/<YYYY-MM-DD>-<slug>.md — dated, frozen investigations
```
`````

- [ ] **Step 4: Edit `skills/kisou/templates/docs/AGENTS.md` — new-subdir + routing (delta b)**

Replace the current "New subdirectories under `{{docs}}/`" paragraph (the "four
above" one) with these two paragraphs:

```markdown
**New subdirectories under `{{docs}}/`.** The six above are the standing schema.
Add another only after proposing its path for the linter's ignore list — or
leave it linted like the rest.

**Not a scratch space.** These six types are curated project state. A tool or
skill's own working artifacts (plans, specs, scratch, session logs) go under its
**own** `{{docs}}/` subdirectory (e.g. `{{docs}}/superpowers/`), exempt from
these rules — never into `{{notes}}/` or any of the six types.
```

Leave the following `For the four type directories only:` block unchanged.

- [ ] **Step 5: Edit `skills/kisou/templates/docs/AGENTS.md` — shoroku section (delta c)**

In the "Session shoroku (excerpting)" numbered list, change step 2's opening
`**Classify** each candidate` to `**Classify** each fragment`. Then insert this
paragraph **between** step 5 and the trailing `(With the shoroku skill…)`
parenthetical:

```markdown
shoroku targets all six types. Fragments fold into the four **managed** types;
the two **flat** types take whole files — propose a new `{{reports}}/` entry when
the session is essentially an investigation worth freezing, or a `{{notes}}/`
create/append when it built durable reference material. Don't cram an
investigation record into `{{design}}/`/`{{decisions}}/` when it is really a
report.
```

- [ ] **Step 6: Edit `skills/kisou/templates/CONTRIBUTING.md` — Project structure**

In `## Project structure`, insert two lines immediately after the `{{issues}}/`
line and before the `{{scripts}}/` line:

```markdown
- [`{{docs}}/{{notes}}/`]({{docs}}/{{notes}}/) — maintained single-concern references
- [`{{docs}}/{{reports}}/`]({{docs}}/{{reports}}/) — dated, frozen investigations
```

Leave the `## References` section (four managed types) unchanged.

- [ ] **Step 7: Lint the changed paths**

Run: `bash scripts/lint.sh skills/kisou/templates/docs/notes/AGENTS.md skills/kisou/templates/docs/reports/AGENTS.md skills/kisou/templates/docs/AGENTS.md skills/kisou/templates/CONTRIBUTING.md`
Expected: markdownlint `Skipped`/`Passed` (templates are ignored), all other hooks `Passed`/`Skipped`, no `Failed`.

- [ ] **Step 8: Verify content**

Run: `grep -c '{{notes}}\|{{reports}}' skills/kisou/templates/docs/AGENTS.md && grep -n 'six types' skills/kisou/templates/docs/AGENTS.md && grep -n 'four type directories only' skills/kisou/templates/docs/AGENTS.md`
Expected: nonzero count; "six types" present; the "four type directories only" line still present (unchanged).

- [ ] **Step 9: Commit**

```bash
git add skills/kisou/templates/docs/notes/AGENTS.md skills/kisou/templates/docs/reports/AGENTS.md
git commit --only skills/kisou/templates/docs/notes/AGENTS.md skills/kisou/templates/docs/reports/AGENTS.md skills/kisou/templates/docs/AGENTS.md skills/kisou/templates/CONTRIBUTING.md -F - <<'EOF'
docs(kisou): add notes/ and reports/ to the doc-system template

Two new flat types (no id, no frontmatter): notes/ (maintained references)
and reports/ (dated, frozen investigations). Reframes docs/AGENTS.md as six
types (four managed + two flat) and adds the "Not a scratch space" routing
clause.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
```

---

### Task 2: kisou SKILL.md — generate + refresh the two type dirs

**Files:**
- Modify: `skills/kisou/SKILL.md`
- Review: `skills/kisou/README.md` (drift check)

**Interfaces:**
- Consumes: the `{{notes}}`/`{{reports}}` placeholders and template files from
  Task 1.

- [ ] **Step 1: Add `{{notes}}`/`{{reports}}` to the dir-name mapping (Step 2)**

In the "**Dir names:**" bullet, extend the placeholder list. Change:

```text
- **Dir names:** `{{docs}}`, `{{src}}`, `{{tests}}`, `{{scripts}}`,
  `{{requirements}}`, `{{design}}`, `{{decisions}}`, `{{issues}}` —
  abbreviations expand for `PascalCase` (`docs → Documents`,
  `src → Source`); the rest just title-case.
```

to:

```text
- **Dir names:** `{{docs}}`, `{{src}}`, `{{tests}}`, `{{scripts}}`,
  `{{requirements}}`, `{{design}}`, `{{decisions}}`, `{{issues}}`, `{{notes}}`,
  `{{reports}}` — abbreviations expand for `PascalCase` (`docs → Documents`,
  `src → Source`); the rest just title-case.
```

- [ ] **Step 2: Add notes/reports to the scaffold dir list (Step 3 scaffold, point 3)**

Change `create` `{requirements,design,decisions}/` to include the two new dirs:

```text
   cased docs root (`docs/` or `Documents/`), create
   `{requirements,design,decisions,notes,reports}/` (each title-cased for
   `PascalCase`)
```

(The existing `Copy the bundled … templates/docs/<type>/AGENTS.md` sentence
already covers the two new per-type files generically — no further edit there.)

- [ ] **Step 3: Add the migrate refresh-additions clause (Step 3 migrate)**

In the "**Existing doc-system**" classification block, after the `partial`
bullet, add this bullet:

```markdown
  - **`notes/` and `reports/`** are standard flat types but sit **outside** the
    none/partial/full tally (which covers the root `AGENTS.md` + the four
    managed per-type files). On any migrate, enumerate
    `{docs,Documents}/{notes,reports}/AGENTS.md` too and offer each **absent**
    one as a create — a refresh addition — so a repo already `full` on the
    managed four is not reclassified `partial` for lacking them.
```

- [ ] **Step 4: Neutralize the stale fingerprint description**

In the kisou-managed fingerprint list, change the `{docs,Documents}/AGENTS.md`
line from `the four-type path table plus the "Document management" heading` to
`the type path table plus the "Document management" heading` (so it matches both
old four-row and new six-row tables).

- [ ] **Step 5: Drift-check `skills/kisou/README.md`**

Read `skills/kisou/README.md`. It describes the doc-system generically ("the
`docs/` document-management system") and does **not** enumerate the type set, so
no edit is expected. Confirm by:

Run: `grep -n 'four\|six type' skills/kisou/README.md`
Expected: no matches → leave the README unchanged. (If a type enumeration is
found, update it to six types and include it in the commit.)

- [ ] **Step 6: Lint**

Run: `bash scripts/lint.sh skills/kisou/SKILL.md`
Expected: all hooks `Passed`/`Skipped`.

- [ ] **Step 7: Verify content**

Run: `grep -n '{{notes}}\|{{reports}}\|decisions,notes,reports\|the type path table' skills/kisou/SKILL.md`
Expected: matches for the dir-name mapping, the scaffold dir list, and the
neutralized fingerprint line.

- [ ] **Step 8: Commit**

```bash
git commit --only skills/kisou/SKILL.md -F - <<'EOF'
docs(kisou): generate and refresh notes/reports type dirs

SKILL now maps {{notes}}/{{reports}}, stamps both dirs on scaffold, and on
migrate offers their AGENTS.md as refresh additions without disturbing the
none/partial/full tally over the four managed types.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
```

---

### Task 3: shoroku SKILL.md + README — target all six types

**Files:**
- Modify: `skills/shoroku/SKILL.md`
- Modify: `skills/shoroku/README.md`

**Interfaces:**
- Consumes: the six-type framing established in `docs/AGENTS.md` (Task 4 renders
  it for this repo; Task 1 for the template). shoroku defers detail to
  `docs/AGENTS.md`.

- [ ] **Step 1: Update the classify wording in `skills/shoroku/SKILL.md` (Step 3)**

Change:

```text
classify each candidate 4-way (requirement / design / decision / issue) → emit
```

to:

```text
classify each candidate into the six types — fragments into the four managed
(requirement / design / decision / issue), whole files into the two flat
(notes / reports) — per `docs/AGENTS.md` → emit
```

Do **not** add any "notes/reports are off-limits" prohibition.

- [ ] **Step 2: Update `skills/shoroku/README.md` "What it does"**

Change the first bullet:

```markdown
- Maintains four document types under `docs/`: **requirements**, **design**,
  **decisions** (ADRs), and **issues** — one file per entry,
  `docs/<type>/<id>-<slug>.md`, no index.
```

to:

```markdown
- Maintains the six document types under `docs/`: the four managed —
  **requirements**, **design**, **decisions** (ADRs), **issues**
  (`docs/<type>/<id>-<slug>.md`, no index) — plus two flat types,
  **notes** (living references) and **reports** (dated investigations).
```

- [ ] **Step 3: Lint**

Run: `bash scripts/lint.sh skills/shoroku/SKILL.md skills/shoroku/README.md`
Expected: all hooks `Passed`/`Skipped`.

- [ ] **Step 4: Verify content**

Run: `grep -n 'six types' skills/shoroku/SKILL.md && grep -n 'six document types' skills/shoroku/README.md && grep -c '4-way' skills/shoroku/SKILL.md`
Expected: "six types" and "six document types" present; `4-way` count is 0.

- [ ] **Step 5: Commit**

```bash
git commit --only skills/shoroku/SKILL.md skills/shoroku/README.md -F - <<'EOF'
docs(shoroku): target all six doc types

Classification now spans six types — fragments into the four managed, whole
files into the two flat (notes/reports) — deferring detail to docs/AGENTS.md.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
```

---

### Task 4: this repo (dogfood) — adopt notes/ and reports/

**Files:**
- Create: `docs/notes/AGENTS.md`
- Create: `docs/reports/AGENTS.md`
- Modify: `docs/AGENTS.md`
- Modify: `CONTRIBUTING.md` (repo root — edit approved by the user)
- Modify: `docs/design/e3f4-shoroku.md` (living design doc, now stale)

**Interfaces:**
- Consumes: the reviewed wording from Task 1, rendered with plain `docs/` names.

- [ ] **Step 1: Create `docs/notes/AGENTS.md`** (rendered form)

```markdown
# notes/ — AGENTS

A `note` is a **maintained reference** on **one** concern — a registry,
glossary, mapping table, cheat sheet. It is *living* (updated in place), the
opposite of `reports/` (dated, frozen). It is **not** a scratchpad or session
log; non-curated content does not belong here (see "Not a scratch space" in
`docs/AGENTS.md`).

A *flat* type (like `reports/`): no `<id>`, no frontmatter — the slug is the
identity.

## Rules

- Path `docs/notes/<slug>.<ext>`; slug is English kebab-case.
- Format fits the concern: Markdown for prose, TOML/YAML for structured data a
  tool consumes. A structured note may pair with a Markdown sibling of the same
  stem.
- **No frontmatter, decided by extension:** a `.md` note's `# H1` is the title;
  a `.toml`/`.yaml` note states its scope in a leading comment block.
- One concern per note — split if it grows a second. No index file.
- Cited by **path** (notes have no `<id>`); a structured note may be read by
  tooling at runtime.
```

- [ ] **Step 2: Create `docs/reports/AGENTS.md`** (rendered form)

```markdown
# reports/ — AGENTS

A `report` records a one-off investigation — a recon, feasibility scan,
measurement run, audit. It is **dated and frozen**: it preserves what was true
at investigation time so later docs can cite it, and is not rewritten as the
project moves on.

A *flat* type (like `notes/`): no `<id>`, no frontmatter — the file-name date is
the identity.

## Rules

- Path `docs/reports/<YYYY-MM-DD>-<slug>.md`; slug is English kebab-case.
- **No frontmatter.** The `# H1` is the title; the leading paragraph states the
  scope.
- **The date lives only in the file name.** Never restate it as an
  `Investigation date:` line or frontmatter field — a second copy just drifts.
  A later write-up or multi-day span can be noted in prose, but the canonical
  date is the single file-name value.
- No index file. Cited by **path** (reports have no `<id>`).

## Lifecycle

- Append-only. To supersede a report, write a new dated one and link back in
  prose; never rewrite history. Edit in place only to fix mistakes or add refs.
```

- [ ] **Step 3: Apply deltas (a)/(b)/(c) to `docs/AGENTS.md`** (rendered form)

Mirror Task 1 Steps 3–5, using plain `docs/` names. Delta (a) — replace intro +
table:

`````markdown
This project keeps its state as a set of small documents under `docs/`. The
rules are agent-agnostic: any agent editing these docs follows them, with or
without the `shoroku` skill.

## Document management

Project state lives in six types, one file per entry — four **managed**
(frontmatter with a hash `<id>`) and two **flat** (no `<id>`, no frontmatter;
slug or date is the identity):

```text
docs/requirements/<id>-<slug>.md    — what the project must do for users, and why
docs/design/<id>-<slug>.md          — how it is built now, and why this shape
docs/decisions/<id>-<slug>.md       — ADRs: why a choice was made (immutable record)
docs/issues/<status>/<id>-<slug>.md — known problems / deferred decisions
docs/notes/<slug>.<ext>             — maintained single-concern references (living)
docs/reports/<YYYY-MM-DD>-<slug>.md — dated, frozen investigations
```
`````

Delta (b) — replace the "New subdirectories under `docs/`" paragraph with:

```markdown
**New subdirectories under `docs/`.** The six above are the standing schema. Add
another only after proposing its path for the linter's ignore list — or leave it
linted like the rest.

**Not a scratch space.** These six types are curated project state. A tool or
skill's own working artifacts (plans, specs, scratch, session logs) go under its
**own** `docs/` subdirectory (e.g. `docs/superpowers/`), exempt from these rules
— never into `notes/` or any of the six types.
```

Leave the `For the four type directories only:` block unchanged. Delta (c) —
change step 2's `**Classify** each candidate` to `**Classify** each fragment`,
then insert after step 5 (before the `(With the shoroku skill…)` line):

```markdown
shoroku targets all six types. Fragments fold into the four **managed** types;
the two **flat** types take whole files — propose a new `reports/` entry when
the session is essentially an investigation worth freezing, or a `notes/`
create/append when it built durable reference material. Don't cram an
investigation record into `design/`/`decisions/` when it is really a report.
```

- [ ] **Step 4: Add Project-structure lines to root `CONTRIBUTING.md`**

In `## Project structure`, insert after the `docs/issues/` line and before the
`scripts/` line:

```markdown
- [`docs/notes/`](docs/notes/) — maintained single-concern references
- [`docs/reports/`](docs/reports/) — dated, frozen investigations
```

Leave the `## References` section unchanged.

- [ ] **Step 5: Fix the stale reference in `docs/design/e3f4-shoroku.md`**

On line 12, change `classifies into the four-type doc system` to
`classifies into the doc system's types`. Bump the frontmatter `updated:` to
`2026-07-17`.

- [ ] **Step 6: Lint the changed paths**

Run: `bash scripts/lint.sh docs/notes/AGENTS.md docs/reports/AGENTS.md docs/AGENTS.md CONTRIBUTING.md docs/design/e3f4-shoroku.md`
Expected: markdownlint `Passed` for the `docs/` and root files (these are NOT
ignored), all other hooks `Passed`/`Skipped`, no `Failed`. If markdownlint
auto-fixes and fails, re-stage and re-run.

- [ ] **Step 7: Verify content**

Run: `grep -n 'six types' docs/AGENTS.md && grep -n 'four type directories only' docs/AGENTS.md && grep -c 'four-type' docs/design/e3f4-shoroku.md && ls docs/notes/AGENTS.md docs/reports/AGENTS.md`
Expected: "six types" present; "four type directories only" still present;
`four-type` count 0 in the design doc; both new files exist.

- [ ] **Step 8: Commit**

```bash
git add docs/notes/AGENTS.md docs/reports/AGENTS.md
git commit --only docs/notes/AGENTS.md docs/reports/AGENTS.md docs/AGENTS.md CONTRIBUTING.md docs/design/e3f4-shoroku.md -F - <<'EOF'
docs(doc-system): adopt notes/ and reports/ in this repo

Dogfood the six-type doc-system: add docs/notes/ and docs/reports/ AGENTS.md,
reframe docs/AGENTS.md, list the two dirs in CONTRIBUTING, and correct the
stale "four-type" reference in design-e3f4.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
```

---

## Self-Review

**Spec coverage** — every spec Scope item maps to a task:

- Template notes/reports/`docs/AGENTS.md`/CONTRIBUTING → Task 1.
- kisou SKILL Scope/mapping/scaffold/migrate + README → Task 2.
- shoroku SKILL classify + README → Task 3.
- Dogfood docs + root CONTRIBUTING → Task 4. Discovered extra: the living
  design doc `e3f4-shoroku.md` (not in the spec's file list) is now stale and is
  folded into Task 4 Step 5.
- Spec "Out of scope" (originating-project retrofit, flat-type cross-ref
  tension, lint enforcement) — intentionally no task.

**Placeholder scan** — no TBD/TODO; every file's full content or exact old→new
edit is shown.

**Type consistency** — `{{notes}}`/`{{reports}}` used identically in Task 1
(template) and Task 2 (mapping); "six types", "flat", "managed", and "Not a
scratch space" phrasings match across template (Task 1) and rendered (Task 4).
The "For the four type directories only:" block and CONTRIBUTING "References"
section are explicitly preserved in both Task 1 and Task 4.
