<!--
TEMPLATE FILL (delete this block after filling):
- Replace <...> with content.
- `{{name}}` placeholders below — scripts (`{{bootstrap}}`, `{{build}}`,
  `{{test}}`, `{{lint}}`, `{{tidy}}`) and dirs (`{{docs}}`, `{{src}}`, `{{tests}}`,
  `{{scripts}}`, `{{requirements}}`, `{{design}}`, `{{decisions}}`,
  `{{issues}}`) — are expanded by kisou per the chosen case convention
  (snake_case as written; PascalCase title-cased, with abbreviations
  expanded: docs -> Documents, src -> Source).
- Author-omittable sections and kisou-pruned (key=value) sections / blocks /
  lines are marked with an OPTIONAL comment marker. Keys used in this file:
  os (windows / unix), os.mode (both / single, derived from os), scripts
  (build / test / lint / tidy -- bootstrap is always created), dirs (src / tests --
  the optional structural dirs kisou itself never creates). See the kisou
  spec for the full grammar.
- In the Development workflow table, kisou removes rows for declined scripts
  and removes the column for an unselected OS. If all of build, test, lint,
  and tidy are declined, kisou drops the whole Development workflow section.
  The Tidy row is the clang-tidy step, offered mainly for clang + CMake
  projects.
- Delete this block before committing.
-->

# Contributing

See [README.md](README.md) for what this project is and how to use it.

## Prerequisites

- Everything in the Prerequisites section of [README.md](README.md)
- [uv](https://docs.astral.sh/uv/)
- <anything else needed for development>

## Development setup

<!-- OPTIONAL os.mode=both -->
- Windows: `{{scripts}}\{{bootstrap}}.bat`
- macOS, Linux: `./{{scripts}}/{{bootstrap}}.sh`

<!-- OPTIONAL os.mode=single --><!-- OPTIONAL os=windows -->
```console
{{scripts}}\{{bootstrap}}.bat
```

<!-- OPTIONAL os.mode=single --><!-- OPTIONAL os=unix -->
```console
./{{scripts}}/{{bootstrap}}.sh
```

For variations, refer to the usage of the commands the script invokes.

<!-- OPTIONAL -->
## Tech stack

<core dependencies in 1–3 lines>

## Project structure

- [`{{docs}}/{{requirements}}/`]({{docs}}/{{requirements}}/) — what we're building
- [`{{docs}}/{{design}}/`]({{docs}}/{{design}}/) — how the system is built
- [`{{docs}}/{{decisions}}/`]({{docs}}/{{decisions}}/) — Architecture Decision Records
- [`{{docs}}/{{issues}}/`]({{docs}}/{{issues}}/) — known issues and TODOs
- `{{scripts}}/` — dev tooling scripts
- `{{src}}/` — source code                            <!-- OPTIONAL dirs=src -->
- `{{tests}}/` — tests                                <!-- OPTIONAL dirs=tests -->

## References

Project context documents under `{{docs}}/` — `{{requirements}}/`,
`{{design}}/`, `{{decisions}}/`, and `{{issues}}/` — are managed by AI agents:
ask an agent to add or update entries.

Refer to them as `<type>-<id>` in commits, code comments, and prose:

- `decision-a3f7`
- `issue-b9c2`
- `req-d4e5`
- `design-f6g7`

## Development workflow

| Task          | Windows                     | macOS, Linux                 |
|---------------|-----------------------------|------------------------------|
| Build         | `{{scripts}}\{{build}}.bat` | `./{{scripts}}/{{build}}.sh` |
| Test          | `{{scripts}}\{{test}}.bat`  | `./{{scripts}}/{{test}}.sh`  |
| Format & Lint | `{{scripts}}\{{lint}}.bat`  | `./{{scripts}}/{{lint}}.sh`  |
| Tidy          | `{{scripts}}\{{tidy}}.bat`  | `./{{scripts}}/{{tidy}}.sh`  |

For variations, refer to the usage of the commands the scripts invoke.

## Code style

- <language>: see <config files>
- <language>: see <config files>

<!-- OPTIONAL dirs=tests -->
## Testing

- Location: `{{tests}}/`
- Required: <when tests are required>
- Naming: <test naming convention>
- Fixtures: <fixtures location>
- Mocking: <what to mock and not>
- Coverage: <target and exceptions>

<!-- OPTIONAL -->
## Pull requests

<message format, branch naming, PR checklist>

<!-- OPTIONAL -->
## License agreement

By contributing, you agree to license your work under [LICENSE](LICENSE).
