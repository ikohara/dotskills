# dotskills

Kohara's toolkit for [Agent Skills](https://agentskills.io).

## Prerequisites

- Claude, Codex, Kilo, or another Agent Skills–compatible agent.

## Install

With [APM](https://microsoft.github.io/apm/):

```bash
apm install ikohara/dotskills#v0.1.0
```

Or pick one of two install strategies depending on whether skills should live
host-wide or inside a single project.

### Host-wide (link via the worktree)

Run `link-user.{bat,sh} <target> [<target> ...]` to junction (Windows) /
symlink (Unix) every skill in `./skills/` into the target tool's user-level
skills directory. Edits in this worktree are immediately visible to every
project on the host.

```console
./link-user.sh claude
```

Targets: `agents` (for Codex, etc.), `claude`, `kilo`.

### Project-local (copy a snapshot)

Run `copy-project.{bat,sh} [--force] <target> <project-path> [<skill> ...]`
to copy every skill in `./skills/` into a specific project's skills
directory. Subsequent worktree edits do not propagate — re-run with
`--force` to update.

```console
./copy-project.sh claude ../myproj           # all skills
./copy-project.sh claude ../myproj wayaku    # only one skill
./copy-project.sh --force claude ../myproj   # overwrite existing
```

Or copy a folder from `skills/` directly into your project's `.agents/skills/`
or `.claude/skills/`.

## Skills

- **[wayaku](./skills/wayaku/)** (和訳) — on-demand Japanese translation of any
  file (prose or code comments).
- **[shoroku](./skills/shoroku/)** (抄録) — excerpt session / memory / file into
  a project's living `docs/` (requirements / design / decisions / issues),
  governed by an agent-agnostic `AGENTS.md` document-management system.
- **[kisou](./skills/kisou/)** (起草) — scaffold a project's standard structure
  (`README` / `CONTRIBUTING` / `CLAUDE` / `AGENTS` + the `docs/` system), or
  retrofit it onto an existing repo; installs the doc-management system that
  `shoroku` fills.

## Versioning

Repo-level [SemVer](https://semver.org/); all skills share the tag. See
[CHANGELOG.md](./CHANGELOG.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
