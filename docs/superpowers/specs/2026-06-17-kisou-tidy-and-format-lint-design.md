# kisou: add a Tidy step and rename Lint to "Format & Lint"

**Goal:** Extend the kisou bundled template's Development workflow so that

1. the existing **Lint** row reads **Format & Lint** (label only), and
2. a new optional **Tidy** row (clang-tidy) follows it, offered mainly for
   clang + CMake projects.

Both ride the existing `scripts=<name>` opt-in machinery — no new gating axis.

## Context (current state)

`skills/kisou/templates/CONTRIBUTING.md` carries a Development workflow table
whose rows (`Build` / `Test` / `Lint`) are pruned by kisou when the matching
script is declined. Pruning is driven by the file's `TEMPLATE FILL` prose
("kisou removes rows for declined scripts"), not by inline `OPTIONAL` markers.
Script entities are written as `{{name}}` placeholders (`{{build}}`, `{{test}}`,
`{{lint}}`, …) that kisou expands per the chosen `case` convention
(snake_case as written; PascalCase title-cased). The opt-in set
(`setup` / `run` / `build` / `test` / `lint`; `bootstrap` always created) is
enumerated in `SKILL.md` Step 2, the `{{name}}` mapping list, the
section-drop rule, and the migrate-mode detection list, and is summarized in
`skills/kisou/README.md`.

## Decisions

- **Rename is label-only.** The table Task cell becomes `Format & Lint`; the
  script stays `{{lint}}` → `lint.bat` / `lint.sh`. The `scripts=lint` key,
  migrate detection, and README wording all keep the name `lint`. One script
  is assumed to both format and lint.
- **Tidy is a normal opt-in script + an advisory note.** `tidy` joins
  `build` / `test` / `lint` as a declinable `scripts=tidy` value using the
  exact same template machinery (a workflow-table row, pruned via the
  `TEMPLATE FILL` prose, no inline marker). It lives under `{{scripts}}/`
  like the other dev-workflow scripts and expands as `{{tidy}}` → `tidy` /
  `Tidy`. The "effectively clang + CMake only" constraint is **advisory**:
  it lives in `SKILL.md` Step 2 and the `TEMPLATE FILL` note so kisou offers
  `tidy` only when the project is a clang + CMake project. No new OPTIONAL
  gating key (`lang=` / `buildsystem=`) is introduced.

## Changes

### 1. `skills/kisou/templates/CONTRIBUTING.md` — workflow table

Rename the Lint row to `Format & Lint`, then add a `Tidy` row directly after
it (re-padded for column width):

```text
| Task          | Windows                     | macOS, Linux                 |
|---------------|-----------------------------|------------------------------|
| Build         | `{{scripts}}\{{build}}.bat` | `./{{scripts}}/{{build}}.sh` |
| Test          | `{{scripts}}\{{test}}.bat`  | `./{{scripts}}/{{test}}.sh`  |
| Format & Lint | `{{scripts}}\{{lint}}.bat`  | `./{{scripts}}/{{lint}}.sh`  |
| Tidy          | `{{scripts}}\{{tidy}}.bat`  | `./{{scripts}}/{{tidy}}.sh`  |
```

### 2. `skills/kisou/templates/CONTRIBUTING.md` — `TEMPLATE FILL` block

- Add `{{tidy}}` to the scripts placeholder list (alongside `{{build}}`,
  `{{test}}`, `{{lint}}`).
- `(build / test / lint -- bootstrap is always created)` →
  `(build / test / lint / tidy -- bootstrap is always created)`.
- Section-drop rule: "If all of build, test, **and lint** are declined …" →
  "If all of build, test, lint, **and tidy** are declined …".
- Add a one-line note: Tidy is the clang-tidy step, offered mainly for
  clang + CMake projects.

### 3. `skills/kisou/SKILL.md`

- **Step 2 script selection** (currently lists `scripts/build`,
  `scripts/test`, `scripts/lint`): add `scripts/tidy`, with an advisory that
  tidy is clang-tidy — offer it only for clang + CMake projects.
- **`{{name}}` script mapping list**: add `{{tidy}}` (PascalCase → `Tidy`,
  simple title-case).
- **Section-drop rule**: "build, test, and lint" → "build, test, lint, and
  tidy".
- **Migrate detection list**: `{build,Build,test,Test,lint,Lint}` →
  add `tidy,Tidy`.

### 4. `skills/kisou/README.md`

- "`setup` / `run` / `build` / `test` / `lint` are opt-in" → add `tidy`,
  with a short clang + CMake note.

## Out of scope (verified — no change needed)

- `SKILL.md` frontmatter `description` — does not enumerate script names.
- `skills/kisou/templates/README.md` — covers `setup` / `run` only; no
  workflow table.
- `templates/docs/**/AGENTS.md` — "linter" / "markdownlint" mentions are
  unrelated to the workflow scripts.

## Verification

- Re-read the edited `CONTRIBUTING.md` table and confirm four rows render with
  aligned pipes and the new label/row.
- Grep `skills/kisou` for `lint` / `tidy` and confirm every script-enumeration
  site (Step 2, `{{name}}` list, section-drop rule, migrate detection, README)
  now includes `tidy` and that the Lint→"Format & Lint" change is label-only
  (the `{{lint}}` placeholder and `scripts=lint` key are unchanged).
- After editing `SKILL.md`, review sibling `README.md` for drift (per
  `AGENTS.md`).
