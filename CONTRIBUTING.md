# Contributing

See [README.md](README.md) for what this project is and how to use it.

## Prerequisites

- Everything in the Prerequisites section of [README.md](README.md)
- [uv](https://docs.astral.sh/uv/)
- [PowerShell 7](https://aka.ms/powershell) (`pwsh`) — the PowerShell pre-commit hook requires it; 5.1 is not sufficient.
- [PSScriptAnalyzer](https://www.powershellgallery.com/packages/PSScriptAnalyzer) — `pwsh -Command "Install-Module -Scope CurrentUser PSScriptAnalyzer"`.

## Development setup

- Windows: `scripts\bootstrap.bat`
- macOS, Linux: `./scripts/bootstrap.sh`

For variations, refer to the usage of the commands the script invokes.

## Project structure

- [`docs/requirements/`](docs/requirements/) — what we're building
- [`docs/design/`](docs/design/) — how the system is built
- [`docs/decisions/`](docs/decisions/) — Architecture Decision Records
- [`docs/issues/`](docs/issues/) — known issues and TODOs
- `scripts/` — dev tooling scripts
- `skills/` — Agent Skills shipped by this repo

## References

Project context documents under `docs/` — `requirements/`, `design/`,
`decisions/`, and `issues/` — are managed by AI agents: ask an agent to add
or update entries.

Refer to them as `<type>-<id>` in commits, code comments, and prose:

- `decision-a3f7`
- `issue-b9c2`
- `req-d4e5`
- `design-f6g7`

## Code style

- Markdown: see [`.markdownlint-cli2.yaml`](.markdownlint-cli2.yaml).
- PowerShell: see [`scripts/PSScriptAnalyzerSettings.psd1`](scripts/PSScriptAnalyzerSettings.psd1).
- YAML: see [`.yamllint`](.yamllint).

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
