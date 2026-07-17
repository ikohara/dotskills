# Design: `notes/` and `reports/` in the doc-system

Formally adopt two new document types — `notes/` (maintained references) and
`reports/` (dated, frozen investigations) — into the kisou/shoroku
document-management system, promoting the pattern already run in an existing
project's `docs/` and fixing two known problems with it.

## Problem

The originating operation proved the two types useful but surfaced two defects:

1. **`notes/` reads as free space.** Its definition is reasonable, but the name
   invites ad-hoc use: an agent mid-task drops working artifacts there instead
   of the concern-scoped reference it is meant to be. (Other skills already have
   homes — e.g. superpowers writes to `docs/superpowers/` — so the collision is
   ad-hoc agent choice, not a skill default.)
2. **Frontmatter is ambiguous.** The four managed types carry frontmatter
   (`id`/`title`/`created`/`updated`); `notes`/`reports` were made
   frontmatter-free as a deliberate departure. That exception makes AIs
   second-guess and add/skip frontmatter inconsistently. Concrete evidence: the
   report date lives in free prose and drifts badly across that project's reports
   (`of 2026-06-10` / `Investigation date: 2026-07-05` / `dated 2026-07-04` /
   `Recon, 2026-07-08`), and one file's stated date disagrees with its file
   name.

## Decisions

- **Name: keep `notes/`.** Renaming (e.g. `references/`) is a weak lever; the
  structural fix is a sharpened definition plus an explicit routing rule. Other
  candidates (`knowledge/`, `guides/`, `wiki/`) either share the dumping-ground
  risk or misfit structured notes.
- **Frontmatter: none, for both flat types — stated firmly per type.** The
  cure for the add/skip drift is a *definite* rule, not tooling.
  - `reports`: **the date lives only in the file name.** No `Investigation
    date:` line, no frontmatter field — a second copy is exactly what drifts.
  - `notes`: **decided by extension** — a `.md` note's `# H1` is the title (no
    frontmatter); a `.toml`/`.yaml` note states scope in a leading comment.
- **No custom frontmatter guard.** Rejected: the doc-system enforces via
  AGENTS.md prose that agents read (even the managed types' `id:`-quoting is not
  lint-checked); adding a guard only for these two dirs breaks that consistency.
  General markdownlint still applies normally to `docs/notes|reports/**.md`;
  this only rules out a *new* frontmatter-specific check.
- **shoroku targets all six types.** Not "notes/reports are off-limits" —
  session material can belong in a note or report. The distinction is *shape*:
  managed types receive excerpted **fragments**; flat types are proposed as
  **whole files** (a dated report; a note create/append). Report/note quality
  stays human-gated by shoroku's propose → approve → commit flow.
- **kisou always stamps `notes/`/`reports/`.** They become standard types (not
  optional gating) — the goal is to end their "non-standard subdirectory"
  ambiguity. Existing kisou-scaffolded repos pick them up via migrate refresh.
- **Templates stay tool-agnostic.** The kisou template gets the vendor-neutral
  core only; the originating project's NDA-twin / path-isolation sections do
  **not** flow into the template.

## Final AGENTS.md wording

Shown in rendered form (`docs/` names). The kisou template copies use `{{docs}}`
/ `{{notes}}` / `{{reports}}` / `{{requirements}}` … placeholders; wording is
identical.

### `docs/notes/AGENTS.md` (new)

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

### `docs/reports/AGENTS.md` (new)

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

### `docs/AGENTS.md` (deltas)

**(a) Intro + type table** — replace the current "four types / small Markdown
documents" opening:

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

**(b) New-subdirectory clause + routing clause** — update "four" → "six" and add
the routing rule:

```markdown
**New subdirectories under `docs/`.** The six above are the standing schema. Add
another only after proposing its path for the linter's ignore list — or leave it
linted like the rest.

**Not a scratch space.** These six types are curated project state. A tool or
skill's own working artifacts (plans, specs, scratch, session logs) go under its
**own** `docs/` subdirectory (e.g. `docs/superpowers/`), exempt from these rules
— never into `notes/` or any of the six types.
```

The following "For the four type directories only:" block (`<id>` / slug rules)
is unchanged — it already correctly scopes those rules to the managed four.

**(c) Session shoroku section** — replace the 4-way classify framing so it
covers all six types with the fragment-vs-whole-file distinction. Add after the
numbered workflow list:

```markdown
shoroku targets all six types. Fragments fold into the four **managed** types;
the two **flat** types take whole files — propose a new `reports/` entry when
the session is essentially an investigation worth freezing, or a `notes/`
create/append when it built durable reference material. Don't cram an
investigation record into `design/`/`decisions/` when it is really a report.
```

## Scope — files to change

### kisou template (source of truth)

- `skills/kisou/templates/docs/notes/AGENTS.md` — **new** (placeholder form).
- `skills/kisou/templates/docs/reports/AGENTS.md` — **new** (placeholder form).
- `skills/kisou/templates/docs/AGENTS.md` — apply deltas (a)/(b)/(c),
  placeholder form.
- `skills/kisou/templates/CONTRIBUTING.md` — add `notes/` and `reports/` lines
  to the `## Project structure` list.

### kisou skill

- `skills/kisou/SKILL.md`:
  - Scope "Produces": add `docs/notes/AGENTS.md` + `docs/reports/AGENTS.md`.
  - Step 2 / Step 3 `{{name}}` dir mapping: add `{{notes}}` → `notes`/`Notes`
    and `{{reports}}` → `reports`/`Reports` (plain title-case for PascalCase; no
    abbreviation expansion).
  - Step 3 (scaffold): create `notes/` and `reports/` with their AGENTS.md.
  - Step 3 (migrate): treat `docs/notes/AGENTS.md` + `docs/reports/AGENTS.md`
    as **refresh additions** (missing fixed files offered on migrate), *not* as
    gating the `none`/`partial`/`full` classification — so an existing repo
    already "full" on the four managed types is not reclassified to "partial";
    the two files are simply offered as missing pieces.
- `skills/kisou/README.md` — drift check against the SKILL changes.

### shoroku skill

- `skills/shoroku/SKILL.md`: update Step 3 "classify 4-way" → six types, flat
  types as whole-file destinations (defer detail to `docs/AGENTS.md`). Do **not**
  add a "notes/reports off-limits" prohibition.
- `skills/shoroku/README.md` — drift check.

### this repo (dogfood)

- `docs/notes/AGENTS.md` — **new** (rendered form). Will be markdownlinted
  (`docs/superpowers/**` is ignored, `docs/notes/**` is not).
- `docs/reports/AGENTS.md` — **new** (rendered form). Same lint note.
- `docs/AGENTS.md` — apply deltas (a)/(b)/(c), rendered form.
- Repo-root `CONTRIBUTING.md` `## Project structure` — add `notes/`/`reports/`
  lines. **Repo-root Markdown → needs explicit human approval before editing.**

## Out of scope

- **Originating-project retrofit.** Left as a follow-up; that project keeps its
  NDA-twin / path-isolation extensions and re-syncs later via migrate refresh.
- **Cross-reference of flat types.** `notes`/`reports` have no `<id>` and are
  cited by path; the tension with the "immutable docs use `<type>-<id>` only"
  rule is acknowledged but not resolved here (candidate future issue).
- **Lint enforcement of the no-frontmatter rule** (rejected above).
