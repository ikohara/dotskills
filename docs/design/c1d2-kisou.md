---
id: "c1d2"
title: kisou skill — modes, template syntax, case mapping, migrate detection
created: 2026-05-28
updated: 2026-10-01
---

## Shape

Serves exp-2c03.

A **thin shell over a bundled project template** at
`skills/kisou/templates/`. The skill itself is mostly trigger / mode
detection / orchestration; the substance is in the bundle.

The bundle produces (always, when scaffolding): `README.md`,
`CONTRIBUTING.md`, `CLAUDE.md`, a slim top-level `AGENTS.md`, the
`docs/` doc-management system (`docs/AGENTS.md` +
`docs/<type>/AGENTS.md` + the `docs/issues/{open,deferred,resolved}/`
skeleton), and `scripts/bootstrap.{bat,sh}`. Optional, on user request:
`setup.{bat,sh}`, `run.{bat,sh}`, and the other `scripts/*.{bat,sh}`.
Never produces `src/` or `tests/` (neither content nor empty dirs);
never runs `git init`; never auto-generates script content.

The doc-system spans six types — four managed (`requirements` / `design` /
`decisions` / `issues`) plus two flat (`notes` / `reports`; decision `3544`).
Both flat dirs are stamped on scaffold, and `{{notes}}` / `{{reports}}`
participate in the `case` mapping (plain title-case, no abbreviation
expansion).

The bundled top-level `AGENTS.md` tells agents to run `lint` *on the changed
paths* before committing — this assumes the project's `lint` script accepts
file-path arguments (lint only those). Because kisou ships `lint` as an empty
stub (never auto-generates script content), this is a contract the
author-filled script must satisfy, not something kisou enforces.

Beside the bundle, the skill ships **one executable**,
`scripts/doc-system-check.js` — Node 22 or later, standard library only, no
dependencies. It decides the doc-system half of a migrate: which
`{docs,Documents}/**/AGENTS.md` files are kisou-managed (by an H1 fingerprint),
which fixed sections are missing or diverged, and where an added section lands;
byte equality with the expanded template is its invariant, up to four
exemptions — line endings, a byte-order mark, inter-section blank-line count,
and text before the first heading, the last reported as a note (decision-19ea).
Its numbered report **is** the proposal — not a reading of the files by an
agent — and `apply --items` writes the items the user accepted.

Behaviors the instrument carries that the spec did not name, or that the
kisou-refresh fix wave added: the preamble — text before the first heading —
is the fourth exemption, kept through `apply` and reported as a note
(`text before the first heading kept: <n> line(s)`); `apply` prints the
check-list numbering on its success and its failure printout alike, so the
guard against a moved tree reads in the same numbers as the operator's
`check`; the not-kisou-managed note quotes the heading texts it compared, the
first heading found and the one expected; a write failure raises `ApplyError`
and exits 2 with one stderr line; and the `--case` derivation guard resolves
its six per-type targets by exact-name lookup. Its exported surface also
carries two members the spec did not name: `applyItems`'s `onApply` callback
and `collect`'s `bom` field.

How the bundle's own Markdown is verified, and by whom:

- The docs templates are markdownlint-checked **where they live**. This
  repository's `.markdownlint-cli2.yaml` ignores `skills/tanto/templates/**`
  and `skills/kisou/templates/*.md` (the layer-B templates) and lints
  `skills/kisou/templates/docs/**` in place — 7 files, 0 errors when the ignore
  was narrowed on 2026-09-11. The hooks that bind on the docs templates are
  markdownlint, the frontmatter hook, trailing-whitespace, end-of-file,
  mixed-line-ending, and `kisou-doc-system-check` (below). A layer-B template
  is still linted only by copying it to a non-ignored path with the `{{…}}`
  names expanded and running the linter there.
- The installed `docs/**/AGENTS.md` copies are **agent instruction files** in
  the sense of this repository's own `AGENTS.md`, which forbids editing them
  without explicit human approval. A refresh of them therefore needs a recorded
  approval before any task touches them — not because kisou requires it, but
  because the files it installs are governed by the rule they themselves state.
  The requirement-extraction plan had that approval through its review brief.

## Template syntax (three categories, processed in order)

Serves no expectation; internal shape.

1. **Substitution.** `<...>` = free-text user fill. `{{name}}` = project
   entity name (script or dir), expanded by kisou per a built-in
   `case`-aware mapping (see decision `8b1f`).
2. **OPTIONAL gating** in three granularities (see decision `6d7e`):
   *section-scope*, *block-scope*, *line-scope*. Bare
   `<!-- OPTIONAL -->` = author-omittable; `<!-- OPTIONAL key=value -->`
   = kisou auto-drops unless condition met. Multiple markers on one
   line are AND.
3. **Table pruning** (instruction-based via TEMPLATE FILL): the
   `CONTRIBUTING.md` workflow table is too dense for inline markers;
   kisou prunes rows for declined scripts and the column for an
   unselected OS, and drops the whole `## Development workflow` section
   if all of `build` / `test` / `lint` / `tidy` are declined. The lint
   row is labeled **Format & Lint** (one script covers both; still backed
   by the `lint` script).

Then **all TEMPLATE FILL blocks are deleted** before writing.

## Inputs (gathered up front; auto-detected in migrate)

Serves exp-802f.

- `os` — `windows` / `unix` (asked, multi-select).
- `os.mode` — `both` / `single` (derived from `os`).
- `scripts` — `setup` / `run` / `build` / `test` / `lint` / `tidy`
  (asked, multi-select; `bootstrap` always created per decision `2a5e`;
  `tidy` is the clang-tidy step, offered mainly for clang + CMake
  projects).
- `dirs` — `src` / `tests` (asked, multi-select; see decision `4f5a`).
- `case` — `snake_case` (default) / `PascalCase` (asked; drives
  `{{name}}` expansion via the mapping in decision `8b1f`).

## Modes

Serves exp-0eda, exp-0fa4.

- **scaffold** — empty target. Gather all inputs in Step 2, write
  the structure (placeholders resolved → OPTIONAL pruned → TEMPLATE
  FILL deleted), one git commit, no auto-push.
- **migrate** — existing repository. **Pre-flight detection** scans the
  target for existing dirs, case-flavored names, scripts, OS-script
  presence, and doc-system files, and pre-populates the inputs above.
  Doc-system detection is **three-state** (`none` / `partial` / `full`); on
  `partial`, only the missing artifacts are added and non-standard subdirs are
  kept (naming-exempt). The flat `notes` / `reports` `AGENTS.md` sit outside
  the tally; on any migrate, an absent one is offered as a refresh addition. Detected values are surfaced for confirmation; beyond
  them, migrate also **asks once about scripts the repo lacks** (`dirs` stays
  existence-only). Scope is **full** (層B + doc-system) or **docs-only**. Per
  artifact: absent → create; a present **kisou-managed** README/AGENTS/CLAUDE
  (or doc-system `AGENTS.md`) → **refresh toward the current template** — add
  missing sections and update diverged fixed-text ones via shown diff + explicit
  approval, never touching free-text or removing author sections (the upgrade
  path for older scaffolds); a file **no fingerprint matches** → left alone and
  reported, naming the fingerprint it missed, with nothing proposed for it —
  `.bak` + fresh write survives only as something the user asks for by naming
  the file, and kisou never offers it; `scripts/` → add missing requested
  scripts, never overwrite; a present doc-system → **intact as content,
  refreshed as structure** — its `none` / `partial` / `full` class says what is
  absent and nothing more and sets no scope, and a doc-system inside the scope
  gets the instrument's proposals whatever its class, which for a `full` one
  level with the templates is zero items.

  The refresh compares **section structure against the template** and reads no
  `docs/` content; kisou has no consistency check over what the documents say.
  Its gate is a per-file fingerprint — the expanded template's H1 for a
  doc-system file, applied by the instrument; the heading-set match for a
  layer-B file, applied by reading — and where no fingerprint matches the file
  is left alone and reported (decision-0590), so an unrecognized file draws no
  proposal at all. What still rests on the operator is the layer-B refresh,
  whose proposals come from a reading rather than a tool. Refreshing a downstream
  copy by hand instead was considered and rejected: it would leave this path
  (decision-281f) unexercised, so the plan runs `kisou migrate` in docs-only
  scope and hand-mirrors only what the refresh misses. Leaving a missed passage
  un-mirrored, to display the failure in the tree, was also rejected — the
  template-versus-copy diff is the invariant that makes an installed copy
  trustworthy, and a finding is carried by an issue and by the run's record,
  never by a knowingly wrong file.

Because refresh keys on **section identity (the heading)** and never removes an
author section, fixed-section headings in `skills/kisou/templates/**` are
stable identifiers: a template change goes inside the existing section's body,
never into a renamed heading. A renamed heading lands downstream as a duplicate
(the old section kept, the new one added); rename detection is deferred
(issue-9ab0). The ADR template's `## Superseding (the only edit to an accepted
ADR)` heading was kept verbatim for this reason when partial supersession was
added (decision-89da).

## Refresh (measured 2026-09-09)

Serves exp-0ed2.

The refresh path had never been exercised until the requirement-extraction plan
ran it on this repository's own four installed `docs/**/AGENTS.md` copies, in
docs-only scope, after the templates had gained six passages. Measured shape:

- **Two of the six passages went through the real refresh path**, both in
  `docs/AGENTS.md` — the one file whose fingerprint matched. The refresh found
  the diverged fixed-text section, proposed replacing it, and once accepted
  produced the exact template text; it misplaced and mangled nothing it
  actually touched.
- **The other four were never offered.** `docs/requirements/AGENTS.md`,
  `docs/design/AGENTS.md`, and `docs/issues/AGENTS.md` were classified
  not-kisou-managed, because no fingerprint covers a per-type
  `docs/<type>/AGENTS.md` (issue-e19f), and each drew a `.bak`-and-rewrite
  offer instead. Two thirds of the refresh the plan needed did not happen.
- **Two open questions stayed open**, and the run is not evidence about them:
  the fingerprint gap diverted three files before the fixed-text test ever ran
  (issue-2bf9, masked rather than disproved), and the one file that did reach
  the refresh branch needed no new section, so insertion position went untested
  (issue-f623).
- Every migrate on **this** repository offers the script slots `scripts/` lacks
  — `setup`, `run`, `build`, and `test` — since it holds only `bootstrap` and
  `lint`, so a dogfood here always carries a decline step. `tidy` is not among
  them: it is offered only for a clang + CMake project, which in migrate means
  a `CMakeLists.txt` at the repository root, and this repository has none.

The run is written up in
`docs/reports/2026-09-09-requirement-extraction-dogfood.md`.

**Refresh, measured again 2026-09-11.** The kisou-refresh plan ran
`起草して migrate` on this repository with the refreshed skill, in docs-only
scope. All seven doc-system copies were classified kisou-managed by the H1 rule
(issue-e19f). The instrument proposed two `replace` items — the rewrapped H1
paragraphs of the `notes` and `reports` copies — and `apply` wrote them; the
sections carrying `<id>` notation compared level once the rewrap was closed,
so none was read as free text (issue-2bf9). `tidy` was not offered, on the
detectable condition of no `CMakeLists.txt` at the repository root
(issue-afed). The class `full` was stated before scope was asked and set no
scope; the docs-only pick drew the two proposals (issue-f50d). The hook's
command exited 1 before `apply` and 0 after, and the two copies came level
(issue-acc0). The one question the run could not answer — where an added
section lands — is closed by the instrument's suite, test case 5 on the real
requirements template and the miniature fixtures; the dogfood produced no
`add` item (issue-f623). The run is written up in
`docs/reports/2026-09-11-kisou-refresh-dogfood.md`.

## How this repository enforces the invariant

Serves exp-0ed2.

The invariant the instrument checks — each installed `docs/**/AGENTS.md`
byte-equal to its expanded template, up to the four exemptions — is enforced
in this repository by one pre-commit hook, `kisou-doc-system-check`, in
`.pre-commit-config.yaml`. Its shape: `language: system`,
`pass_filenames: false`, and one entry,
`node skills/kisou/scripts/doc-system-check.js check --docs docs --case snake_case`,
which is the same command for `--all-files` and for a matching commit alike;
`check`'s exit code is the hook's. Its `files:` regex covers the fourteen
guarded paths — the seven docs templates and the seven installed copies —
plus the instrument's own path:

```text
^(skills/kisou/(templates/docs/|scripts/doc-system-check\.js$)|docs/AGENTS\.md$|docs/[^/]+/AGENTS\.md$)
```

So a template-body edit fails its own commit unless the copies come level in
the same commit, and an edit to the instrument re-runs the check on the tree
it now reads. Measured 2026-09-11: on the level tree `check` exits 0 and the
hook passes by id; before the dogfood's `apply`, the same command exited 1 on
the two drifted copies.

## File output paths

Serves no expectation; internal shape.

Destination directory names are **case-correct** per `case` (a
PascalCase scaffold writes to `Documents/AGENTS.md`,
`Documents/Requirements/AGENTS.md`, `Documents/Issues/{open,deferred,
resolved}/`, etc.). The bundle inside this repo is authored in canonical
(snake) form; case is applied at scaffold time.

## Related

Serves no expectation; internal shape.

- `req-1a2b` — kisou's scope and required behavior.
- `decision-9f4b` — kisou as sole installer (Option X rejected).
- `decision-8b1f` — case mapping with abbreviation expansion.
- `decision-2a5e` — bootstrap is mandatory.
- `decision-6d7e` — OPTIONAL syntax three granularities.
- `decision-4f5a` — `dirs` key + migrate auto-detection.
- `decision-281f` — stateless structural refresh in migrate.
- `decision-89da` — partial supersession links; why fixed-section headings in
  the template stay stable.
- `decision-3544` — notes/reports adopted as flat types.
- `docs/reports/2026-09-09-requirement-extraction-dogfood.md` — the first
  measured refresh.
- `docs/reports/2026-09-11-kisou-refresh-dogfood.md` — the second, through
  the instrument.
