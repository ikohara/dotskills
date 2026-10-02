---
name: kisou
description: Use when the user explicitly invokes project drafting with `起草して` or `kisouして` (optionally followed by a `scaffold` or `migrate` mode word) — stands up or retrofits a project's standard structure (README / CONTRIBUTING / CLAUDE / a slim AGENTS.md, the docs/ document-management system, and optional empty script files); project names follow the chosen `case` convention (`snake_case` or `PascalCase`, with `docs → Documents` / `src → Source` etc. for the latter). `scaffold` / `migrate` are mode arguments that only apply AFTER a `起草`/`kisou` invocation — do NOT trigger on the bare English words "scaffold" or "migrate" (e.g. scaffolding a test harness, migrating a database or code). Never touches src/ or tests/.
---

# kisou

起草 — "draft / draw up." Stand up a project's standard structure from a bundled
template, or retrofit that structure onto an existing repository without
clobbering it. `kisou` owns the bundled template end to end, including the
`docs/` document-management system that the `shoroku` skill later fills.

`kisou` is a **thin shell** over its bundled template at `templates/` (relative
to this skill folder). Do not restate the template's contents here — read and
copy from the bundle.

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

## Scope

- **Produces:** `README.md`, `CONTRIBUTING.md`, `CLAUDE.md`, a slim top-level
  `AGENTS.md`, the `docs/` doc-management system (`docs/AGENTS.md`, the
  per-type `docs/<type>/AGENTS.md` under the cased type directories, and the
  hand-written hub `docs/experience.md`, cased like the rest), and — on
  request — empty script
  files.
- **Never produces:** `src/` or `tests/` (not even empty dirs). Never runs
  `git init`. Never auto-generates script content.

## Step 1: Detect mode

- **scaffold** — the target dir is empty / has no project structure.
- **migrate** — the target repo already has files.
- An explicit mode argument (`scaffold` / `migrate`) overrides detection.

## Step 2: Gather inputs up front

In a single pass, collect all template placeholders (`<project-name>`,
`<overview>`, tech stack, etc.), the **script selection** (which of `setup`,
`run`, `scripts/build`, `scripts/test`, `scripts/lint`, and `scripts/tidy` the
project needs — offer `scripts/tidy` (clang-tidy) only for a clang + CMake
project, which in migrate means a `CMakeLists.txt` at the repository root, and
this is the one place that condition is stated; `scripts/bootstrap` is always
created), the **`dirs` selection** (which
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
  `{{test}}`, `{{lint}}`, `{{tidy}}` — just title-cased for `PascalCase`.
- **Dir names:** `{{docs}}`, `{{src}}`, `{{tests}}`, `{{scripts}}`,
  `{{experience}}`, `{{design}}`, `{{decisions}}`, `{{issues}}`, `{{notes}}`,
  `{{reports}}` — abbreviations expand for `PascalCase` (`docs → Documents`,
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
   workflow` section if all of `build`, `test`, `lint`, and `tidy` were declined**,
   per that file's TEMPLATE FILL instructions; **(d) delete every
   `<!-- TEMPLATE FILL ... -->` block**.
3. Write the doc-system using **case-correct directory names**: under the
   cased docs root (`docs/` or `Documents/`), create
   `{experience,design,decisions,notes,reports}/` (each title-cased for
   `PascalCase`) and the `issues/` parent (cased). Copy the bundled
   `templates/docs/AGENTS.md` and `templates/docs/<type>/AGENTS.md` to the
   cased destinations, expanding any `{{name}}` placeholders inside them as
   in step **(a)**. Do **not** create the `open`/`deferred`/`resolved`
   status subdirs and do **not** add `.gitkeep`: git does not track empty
   directories, so a writer creates a status subdir on demand when the
   first issue lands there (those names stay lowercase). Copy
   `templates/docs/experience.md` to the cased docs root as the hub,
   `{{docs}}/{{experience}}.md` (`Documents/Experience.md` under `PascalCase`),
   expanding its `{{name}}` as in step (a), filling its `<...>` from the
   inputs where they are known and leaving the rest for the author, and
   deleting its `TEMPLATE FILL` block as in step (d) and telling the author
   that the `markdownlint-disable MD033` line goes once no `<...>` remains;
   this file is written
   once and is not a doc-system copy the instrument checks.
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
  lint,Lint,tidy,Tidy}.{bat,sh}` each imply the matching `scripts=name` value.
  `bootstrap` is always created so it is not a `scripts=` value, but a
  present `{scripts,Scripts}/{bootstrap,Bootstrap}.{bat,sh}` is left
  untouched.
- **Existing OS support** → set `os`: presence of `.bat` files ⇒ `os`
  includes `windows`; presence of `.sh` files ⇒ includes `unix`; derive
  `os.mode` from the union.
- **Existing doc-system** → classify as `none` / `partial` / `full` by
  enumerating each artifact: `{docs,Documents}/AGENTS.md` and each
  `{docs,Documents}/<type>/AGENTS.md` (experience / design / decisions /
  issues).
  - **none** (no doc-system artifacts) → all five tallied targets are absent
    (the two flat copies are tallied on their own and may be present); each
    absent one is one of the instrument's `create` items. The class says what is absent and nothing more; it sets no
    scope.
  - **full** (root `AGENTS.md` + all four per-type files present) → the root
    and the four managed per-type files are present. What is absent —
    `notes/` and `reports/` included, since they sit outside this tally — and
    what diverged comes from the instrument in the `docs/` doc-system bullet
    below, inside whatever scope the user picks. The class says what is absent
    and nothing more; it sets no scope.
  - **partial** (some artifacts present, others missing) → say what is present
    and what is missing, and stop there: what gets proposed comes from the
    instrument in the `docs/` doc-system bullet below, inside whatever scope
    the user picks, exactly as for a `full` doc-system. Surface any
    non-standard subdirectory under `{docs,Documents}/` (e.g. `superpowers/`, a
    non-standard issue-status dir) as **kept by default**, and note it is
    **exempt from the `<id>-<slug>` naming rules** — its own tool's convention
    wins. A `requirements/` directory is one such — the name this type had
    before `experience/`; the instrument says so in a note, and the rename is
    a hand migration this skill does not perform. The
    `open`/`deferred`/`resolved` status subdirs are created on demand
    and are not part of the present/missing tally.
  - **`notes/` and `reports/`** are standard flat types but sit **outside** the
    none/partial/full tally (which covers the root `AGENTS.md` + the four
    managed per-type files), so a repo already `full` on the managed four is
    not reclassified `partial` for lacking them. Both are among the seven
    targets the instrument enumerates in the `docs/` doc-system bullet below,
    and an absent one is one of its `create` items; you do not enumerate them.

After surfacing the detected values for confirmation, **also ask once about
scripts the repo lacks**: list the slots **Step 2 offers** that the repository
lacks — `tidy` among them only under Step 2's clang + CMake condition — and
let the user opt into any. A script
expresses **intent** ("the project should have this"), so absence is a prompt,
not a silent decline. `dirs`, by contrast, is a **fact** (an absent `src/`
means there is no source dir), so its absence is never prompted.

Pick a **scope**: full (layer B + doc-system) or **docs-only** (the case
`shoroku` delegates here). Then, per artifact:

- **Absent** → for a layer-B file, create (filled), as in scaffold; an absent
  doc-system file is the instrument's `create` item (see the `docs/` bullet
  below).
- **Present** (`README` / `AGENTS.md` / `CLAUDE.md`, or a doc-system
  `AGENTS.md`) → branch on whether the file is **kisou-managed**, i.e. carries a
  template fingerprint:
  - `CLAUDE.md` — the `@AGENTS.md` pointer plus the "All project instructions
    live in `AGENTS.md`" body.
  - `AGENTS.md` — the `@CONTRIBUTING.md or read …` pointer line.
  - `{docs,Documents}/**/AGENTS.md` — the root and every `<type>/AGENTS.md`:
    the H1 the expanded template gives it (`# AGENTS.md`, together with the
    `## Document management` heading, for the root; `# <type>/ — AGENTS` for
    a type). This is a test `scripts/doc-system-check.js` applies, not you.
  - any layer-B file whose heading set substantially matches the template (the
    prior "stub-shaped" test), or that still has `<...>` placeholders.

  **Kisou-managed** → **refresh toward the current template**. This is the
  upgrade path for a repo scaffolded by an older kisou: re-running migrate picks
  up template changes — no separate mode or trigger. For a **layer-B** file,
  compare its structure against what the current template would produce for
  the detected inputs, and propose — always as numbered items, never a silent
  auto-merge:
  - a **missing** fixed section / block → add it, template-filled;
  - a **diverged fixed-text section** — one whose body differs from the
    template's, fixed text being what the paragraph below defines (e.g. AGENTS
    `## Language`, `CLAUDE.md`'s pointer body) → show the diff and propose
    replacing the stale body.

  Never flag a **free-text section** (template body carrying `<...>` for the
  author to fill, e.g. README `## Tech stack`) — the author owns it and
  staleness cannot be told from an intentional edit. Never propose **deleting**
  an author-added section. Refresh is additive / updating only.

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

  **Not kisou-managed** (no fingerprint matches) → **leave it alone and report
  it**: name the file, say which fingerprint it missed, and propose nothing
  for it. Renaming a file to `<file>.bak` and writing a fresh template-filled
  one is an operation the user asks for by naming the file; kisou never offers
  it. Uncertainty narrows the proposal.
- **`scripts/`** → add only the missing requested scripts as empty files; never
  overwrite an existing script.
- **`docs/` doc-system** → the instrument's report is the proposal, whether the
  doc-system is absent or present: an absent file is a `create` item (all
  seven, for a `none` doc-system — that is "write the bundle"), a missing
  fixed section an `add`, a diverged fixed-text section a `replace` shown with
  its diff. An author-added section is kept and reported. Content is never
  touched.

Same interaction as scaffold: numbered proposal ending with `Direction?` →
partial-accept (`OK` / `2 と 5 だけ` / `3 はやめて` / `全部やめ`) → one commit →
report. No auto-push.

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
- Do NOT rename a file to `.bak`, or offer to, unless the user asked for that
  file by name.
- Do NOT edit an existing `AGENTS.md` / `CLAUDE.md` beyond what the user
  accepted from the numbered proposal.
