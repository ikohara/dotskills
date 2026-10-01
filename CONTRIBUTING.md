# Contributing

See [README.md](README.md) for what this project is and how to use it.

## Prerequisites

- Everything in the Prerequisites section of [README.md](README.md)
- [uv](https://docs.astral.sh/uv/)
- [mise](https://mise.jdx.dev/) — the pinned Node 22 the tanto plans test on
- [Node.js](https://nodejs.org/) 22 or later — the `kisou-doc-system-check`
  pre-commit hook runs `node`.
- [PowerShell 7](https://aka.ms/powershell) (`pwsh`) — the PowerShell pre-commit hook requires it; 5.1 is not sufficient.
- [PSScriptAnalyzer](https://www.powershellgallery.com/packages/PSScriptAnalyzer) — `pwsh -Command "Install-Module -Scope CurrentUser PSScriptAnalyzer"`.

## Development setup

- Windows: `scripts\bootstrap.bat`
- macOS, Linux: `./scripts/bootstrap.sh`

For variations, refer to the usage of the commands the script invokes.

## Project structure

- [`docs/experience.md`](docs/experience.md) — who uses this and what they expect; scenes in [`docs/experience/`](docs/experience/)
- [`docs/design/`](docs/design/) — how the system is built
- [`docs/decisions/`](docs/decisions/) — Architecture Decision Records
- [`docs/issues/`](docs/issues/) — known issues and TODOs
- [`docs/notes/`](docs/notes/) — maintained single-concern references
- [`docs/reports/`](docs/reports/) — dated, frozen investigations
- `scripts/` — dev tooling scripts
- `skills/` — Agent Skills shipped by this repo

## References

Project context documents under `docs/` — `experience/`, `design/`,
`decisions/`, and `issues/` — are managed by AI agents: ask an agent to add
or update entries.

Refer to them as `<type>-<id>` in commits, code comments, and prose:

- `decision-a3f7`
- `issue-b9c2`
- `exp-d4e5`
- `design-f607`

## Code style

- Markdown: see [`.markdownlint-cli2.yaml`](.markdownlint-cli2.yaml).
- Markdown frontmatter: checked by the `check-md-frontmatter` pre-commit hook ([`scripts/check_md_frontmatter.py`](scripts/check_md_frontmatter.py)).
- PowerShell: see [`scripts/PSScriptAnalyzerSettings.psd1`](scripts/PSScriptAnalyzerSettings.psd1).
- YAML: see [`.yamllint`](.yamllint).
- JavaScript / TypeScript / CSS: see [`biome.json`](biome.json).
- All files: see [`.editorconfig`](.editorconfig).

### Pre-commit

Formatting and linting run through [pre-commit](https://pre-commit.com/):
`bootstrap` installs it as a commit hook, and `lint` runs the same checks on
demand. The first run downloads the hooks from GitHub — slow once, then cached.

> [!WARNING]
> Several hooks auto-fix files (e.g., markdownlint `--fix`). A fix also fails
> the commit with the change left unstaged — re-stage and retry. During a
> rebase it aborts mid-way, so run the rebase with hooks off:
>
> ```console
> git -c core.hooksPath=/dev/null rebase -i <base>
> ```
