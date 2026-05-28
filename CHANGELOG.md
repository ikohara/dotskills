# Changelog

All notable changes to this skill collection are documented here.
This repo follows [Semantic Versioning](https://semver.org/), applied at the
repository level.

## [0.1.0] - 2026-05-28

Initial release. Three skills, two install strategies, and the tooling to
develop them.

### Skills

- **`wayaku`** (和訳) — on-demand Japanese translation of any file's prose or
  code comments, written to `.wayaku/<same-relative-path>` so the original
  stays untouched.
- **`shoroku`** (抄録) — excerpt a working session, accumulated memory, or
  named Markdown files into a project's living `docs/` in four types
  (requirements, design, decisions/ADRs, issues), one file per entry
  `docs/<type>/<id>-<slug>.md` with no index. A run produces a numbered
  proposal; the user partially accepts; the skill commits the approved
  subset as one git commit. Memory is read-only — only project-relevant
  facts route into docs. `shoroku` does not install the doc-management
  system itself; in an unprepared repo it stops and points the user at
  `kisou`.
- **`kisou`** (起草) — scaffold a project's standard structure (`README` /
  `CONTRIBUTING` / `CLAUDE` / a slim `AGENTS.md` + the `docs/`
  doc-management system, plus optional empty script stubs), or retrofit
  the structure onto an existing repo. Migrate mode runs pre-flight
  detection (existing dirs / case / scripts / OS / doc-system) and only
  asks about inputs it cannot determine. Template syntax: `<...>` user
  fill, `{{name}}` case-aware placeholder expansion via a built-in
  mapping (snake_case ↔ PascalCase, with abbreviation expansion —
  `docs ↔ Documents`, `src ↔ Source`), and `<!-- OPTIONAL ... -->`
  markers in three granularities (section / block / line) with AND
  combinator across multiple markers.

### Install

- `link-user.{bat,sh} <target> [<target> ...]` — junction (Windows) /
  symlink (Unix) every skill into the target tool's user-level skills
  directory. Targets: `agents` (Codex etc.), `claude`, `kilo`. Edits in
  this worktree are visible to every project on the host immediately.
- `copy-project.{bat,sh} [--force] <target> <project-path> [<skill> ...]` —
  copy a snapshot of every skill (or a chosen subset) into a specific
  project's skills directory. Worktree edits do not propagate; re-run
  with `--force` to update.

### Tooling

- `scripts/bootstrap.{bat,sh}` — one-shot dev environment setup.
- `scripts/lint.{bat,sh}` — run the full linter stack locally.
- Pre-commit pipeline (`.pre-commit-config.yaml`) orchestrating Biome
  (TS/JS), PSScriptAnalyzer (PowerShell), shellcheck / shfmt (Bash),
  markdownlint-cli2 (Markdown), and yamllint (YAML).
- `scripts/release.ps1` (+ Pester tests) — release-tagging helper.

### Project structure

This repo itself adopted the kisou-installed structure: `AGENTS.md` +
`CONTRIBUTING.md` + `CLAUDE.md` at the root, and the four
`docs/<type>/AGENTS.md` files governing the document-management system
that `shoroku` fills.
