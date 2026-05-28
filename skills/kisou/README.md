# kisou

起草 — "draft / draw up." A Claude skill that scaffolds a project's standard
structure, or retrofits it onto an existing repository.

## What it does

- **scaffold** a new project: `README` / `CONTRIBUTING` / `CLAUDE.md` / a slim
  `AGENTS.md`, the `docs/` document-management system, and empty script files
  (`scripts/bootstrap` is always created; `setup` / `run` / `build` / `test` /
  `lint` are opt-in).
- **migrate** an existing repo: detects what's already there and drops in
  what's missing without clobbering, with a full or docs-only scope.
- Never touches `src/` or `tests/`; never runs `git init`; never auto-generates
  script content.

## Usage

Trigger with `起草して` or `kisouして` — optionally followed by `scaffold` or
`migrate` to pin the mode (e.g., `kisouして migrate`); otherwise kisou infers
the mode from the target directory's state. It then gathers the needed inputs
(template placeholders, script selection, optional `src` / `tests` presence,
target OS(es), and the `case` convention — `snake_case` or `PascalCase`) and
proposes a numbered file list before writing. In **migrate** mode it
enumerates existing files first and only asks about what detection couldn't
determine.

## Layout

- `SKILL.md` — the skill (a thin shell over the bundled template).
- `templates/` — the bundled project template: layer-B files
  (`README` / `CONTRIBUTING` / `CLAUDE` / `AGENTS`) plus the `docs/`
  document-management system that `shoroku` fills.

## Relationship to shoroku

`kisou` installs the document-management system; `shoroku` (抄録) fills it by
excerpting sessions or memory. `kisou` is the sole installer of the structure;
`shoroku` defers to the committed `docs/AGENTS.md`.
