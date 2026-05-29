---
name: kisou
description: Use when the user explicitly invokes project drafting with `起草して` or `kisouして` (optionally followed by a `scaffold` or `migrate` mode word) — stands up or retrofits a project's standard structure: README / CONTRIBUTING / CLAUDE / a slim AGENTS.md, the docs/ document-management system, and optional empty script files; project names follow the chosen `case` convention (`snake_case` or `PascalCase`, with `docs → Documents` / `src → Source` etc. for the latter). `scaffold` / `migrate` are mode arguments that only apply AFTER a `起草`/`kisou` invocation — do NOT trigger on the bare English words "scaffold" or "migrate" (e.g. scaffolding a test harness, migrating a database or code). Never touches src/ or tests/.
---

# kisou

起草 — "draft / draw up." Stand up a project's standard structure from a bundled
template, or retrofit that structure onto an existing repository without
clobbering it. `kisou` owns the bundled template end to end, including the
`docs/` document-management system that the `shoroku` skill later fills.

`kisou` is a **thin shell** over its bundled template at `templates/` (relative
to this skill folder). Do not restate the template's contents here — read and
copy from the bundle.

## Scope

- **Produces:** `README.md`, `CONTRIBUTING.md`, `CLAUDE.md`, a slim top-level
  `AGENTS.md`, the `docs/` doc-management system (`docs/AGENTS.md` +
  `docs/<type>/AGENTS.md` + the `docs/issues/{open,deferred,resolved}/`
  skeleton), and — on request — empty script files.
- **Never produces:** `src/` or `tests/` (not even empty dirs). Never runs
  `git init`. Never auto-generates script content.

## Step 1: Detect mode

- **scaffold** — the target dir is empty / has no project structure.
- **migrate** — the target repo already has files.
- An explicit mode argument (`scaffold` / `migrate`) overrides detection.

## Step 2: Gather inputs up front

In a single pass, collect all template placeholders (`<project-name>`,
`<overview>`, tech stack, etc.), the **script selection** (which of `setup`,
`run`, `scripts/build`, `scripts/test`, `scripts/lint` the project needs;
`scripts/bootstrap` is always created), the **`dirs` selection** (which
optional structural dirs the project has — `src` and/or `tests`; kisou
itself never creates these but the templates reference them), the **target
OS(es)** (`windows` and/or `unix` — pick one or both), and the **`case`
convention** for project names (`snake_case` (default) or `PascalCase`). In
**migrate** mode, detect what's already present before asking — see Step 3
(migrate) — and only ask about inputs detection couldn't determine. Fall
back to iterative one-at-a-time questioning only if the set is too large or
branchy to ask at once.

From the OS answer, derive **`os.mode`**: `both` if `windows` and `unix` were
both selected, otherwise `single`. Templates use it to switch between a
labeled bullet list (`os.mode=both`) and an unlabeled `console` block
(`os.mode=single`, with the surviving `os=` selector). Templates also use
**`{{name}}` placeholders** for project entities that kisou expands per a
built-in `case`-aware mapping:

- **Script names:** `{{setup}}`, `{{run}}`, `{{bootstrap}}`, `{{build}}`,
  `{{test}}`, `{{lint}}` — just title-cased for `PascalCase`.
- **Dir names:** `{{docs}}`, `{{src}}`, `{{tests}}`, `{{scripts}}`,
  `{{requirements}}`, `{{design}}`, `{{decisions}}`, `{{issues}}` —
  abbreviations expand for `PascalCase` (`docs → Documents`,
  `src → Source`); the rest just title-case.
- **Issue status dirs** (`open` / `deferred` / `resolved`) are NOT cased
  (they are status labels, lowercase by convention).

## Step 3 (scaffold): Write the structure

1. Confirm the target dir. Do **not** `git init`.
2. Copy the `templates/` layer-B files. Process in this order: **(a)**
   resolve `<...>` user placeholders and **expand `{{name}}` placeholders**
   (script names and dir names) per the `case`-aware mapping; **(b)**
   evaluate `<!-- OPTIONAL ... -->` markers — drop bare-`<!-- OPTIONAL -->`
   sections whose body still has unfilled `<...>` placeholders, drop
   sections / blocks / lines whose `<!-- OPTIONAL key=value -->` references
   an unselected value (keys:
   `os`, `os.mode`, `scripts`; multiple markers on one line are AND; a
   marker on its own line gates the next heading **or** the next contiguous
   non-blank block, an end-of-line marker gates that line); **(c)** for the
   `CONTRIBUTING.md` workflow table, prune rows for declined scripts, remove
   the column for an unselected OS, and **drop the whole `## Development
   workflow` section if all of `build`, `test`, and `lint` were declined**,
   per that file's TEMPLATE FILL instructions; **(d) delete every
   `<!-- TEMPLATE FILL ... -->` block**.
3. Write the doc-system using **case-correct directory names**: under the
   cased docs root (`docs/` or `Documents/`), create
   `{requirements,design,decisions}/` (each title-cased for `PascalCase`)
   and the `issues/` parent (cased). Copy the bundled
   `templates/docs/AGENTS.md` and `templates/docs/<type>/AGENTS.md` to the
   cased destinations, expanding any `{{name}}` placeholders inside them as
   in step **(a)**. Do **not** create the `open`/`deferred`/`resolved`
   status subdirs and do **not** add `.gitkeep`: git does not track empty
   directories, so a writer creates a status subdir on demand when the
   first issue lands there (those names stay lowercase).
4. Create the requested scripts as **empty files** (`.bat` + `.sh`).
5. Present a numbered plan of files to create, end with `Direction?`, wait,
   apply the accepted subset, make **one** git commit, report files changed +
   commit hash. No auto-push.

## Step 3 (migrate): Retrofit non-destructively

**First, detect what's already present in the target** and skip the
corresponding questions in Step 2. Only ask about inputs detection
couldn't determine; always present detected values back to the user for
confirmation before applying.

Detection must **enumerate actual FS entries** (e.g., `ls -d */`,
`git ls-files`, `Get-ChildItem -Directory`) and match against the listed
names. Do **not** probe candidates with existence tests like
`test -d Source/` or `Test-Path Source/` — on case-insensitive
filesystems (Windows/NTFS, macOS default APFS/HFS+) they match the
opposite case and mis-set `case`, which then cascades through every
`{{name}}` expansion.

- **Existing dirs** → set `dirs`: `{src,Source}/` ⇒ `dirs=src`;
  `{tests,Tests}/` ⇒ `dirs=tests`.
- **Existing case** → set `case`: a Pascal-cased dir name observed (e.g.,
  `Documents/`, `Source/`, `Tests/`) ⇒ `case=PascalCase`; otherwise
  `snake_case`.
- **Existing scripts** → set `scripts`: top-level `{setup,Setup}.{bat,sh}`
  or `{run,Run}.{bat,sh}`, and `{scripts,Scripts}/{build,Build,test,Test,
  lint,Lint}.{bat,sh}` each imply the matching `scripts=name` value.
  `bootstrap` is always created so it is not a `scripts=` value, but a
  present `{scripts,Scripts}/{bootstrap,Bootstrap}.{bat,sh}` is left
  untouched.
- **Existing OS support** → set `os`: presence of `.bat` files ⇒ `os`
  includes `windows`; presence of `.sh` files ⇒ includes `unix`; derive
  `os.mode` from the union.
- **Existing doc-system** → `{docs,Documents}/AGENTS.md` and per-type files
  present ⇒ doc-system installed; treat the migrate scope as **layer-B
  only** unless the user explicitly asks otherwise.

Pick a **scope**: full (layer B + doc-system) or **docs-only** (the case
`shoroku` delegates here). Then, per artifact:

- **Absent** → create (filled), as in scaffold.
- **Present** (`README` / `AGENTS.md` / `CLAUDE.md`) → branch on the file's shape:
  - **Stub-shaped** (heading set matches the template, or `<...>` placeholders
    still remain) → section/block merge: show the diff, get explicit approval,
    insert only what is missing (e.g., the `docs/AGENTS.md` pointer, a missing
    convention section).
  - **Real content** (custom headings / prose, no `<...>` placeholders to fill)
    → do not attempt a merge. With approval, rename the original to `<file>.bak`
    and write a fresh template-filled file, then tell the author to graft the
    wanted sections back by hand. The `.bak` keeps this non-destructive.
- **`scripts/`** → add only the missing requested scripts as empty files; never
  overwrite an existing script.
- **`docs/` doc-system** → write the bundle if absent; if already present, leave
  it intact and add only around it.

Same interaction as scaffold: numbered proposal → partial-accept (`OK` / `2 と 5
だけ` / `3 はやめて` / `全部やめ`) → one commit → report. No auto-push.

## Relationship to shoroku

`kisou` installs the document-management system; `shoroku` fills it by excerpt
and defers to the committed `docs/AGENTS.md`. `kisou` is the **sole
installer** — when `shoroku` finds an unprepared repo it suggests running
`kisou` (docs-only scope). The bundled `docs/AGENTS.md` carries the
agent-agnostic "Session shoroku" workflow that `shoroku` drives.

## Prohibited actions

- Do NOT create `src/` or `tests/` (not even empty dirs).
- Do NOT run `git init`.
- Do NOT auto-generate script content — empty files only, on request.
- Do NOT overwrite an existing file in migrate mode without showing the diff and
  getting approval.
- Do NOT auto-push.
- Do NOT edit an existing `AGENTS.md` / `CLAUDE.md` beyond the approved merge.
