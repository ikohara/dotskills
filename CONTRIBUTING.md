# Contributing

See [README.md](README.md) for what this project is and how to use it.

## Development setup

- Windows: `scripts\bootstrap.bat`
- macOS, Linux: `./scripts/bootstrap.sh`

For variations, refer to the usage of the commands the script invokes.

## Tech stack

TypeScript / JavaScript (Biome), PowerShell (PSScriptAnalyzer),
Bash (shellcheck / shfmt), Markdown (markdownlint-cli2), YAML (yamllint),
orchestrated through `pre-commit`.

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

- TypeScript / JavaScript: see [`biome.json`](biome.json).
- PowerShell: see [`scripts/PSScriptAnalyzerSettings.psd1`](scripts/PSScriptAnalyzerSettings.psd1).
- Markdown: see [`.markdownlint-cli2.yaml`](.markdownlint-cli2.yaml).
- YAML: see [`.yamllint`](.yamllint).
