<!--
TEMPLATE FILL (delete this block after filling):
- Replace <...> with content.
- `{{name}}` placeholders below — scripts (`{{setup}}`, `{{run}}`) — are
  expanded by kisou per the chosen case convention (snake_case as written;
  PascalCase title-cased).
- Author-omittable sections and kisou-pruned (key=value) sections / blocks /
  lines are marked with an OPTIONAL comment marker. Keys used in this file:
  os (windows / unix), os.mode (both / single, derived from os), scripts
  (setup / run). See the kisou spec for the full grammar.
- For libraries, Usage may be a code example instead.
- Delete this block before committing.
-->

# <project-name>

<one-paragraph overview>

<!-- OPTIONAL: badges, screenshots -->

## Prerequisites

<list>

<!-- OPTIONAL -->
## Download

<download instructions>

<!-- OPTIONAL scripts=setup -->
## Setup

<!-- OPTIONAL os.mode=both -->
- Windows: `{{setup}}.bat`
- macOS, Linux: `./{{setup}}.sh`

<!-- OPTIONAL os.mode=single --><!-- OPTIONAL os=windows -->
```console
{{setup}}.bat
```

<!-- OPTIONAL os.mode=single --><!-- OPTIONAL os=unix -->
```console
./{{setup}}.sh
```

For variations, refer to the usage of the commands the script invokes.

<!-- OPTIONAL -->
## Install

<install instructions>

## Usage

<!-- OPTIONAL scripts=run --><!-- OPTIONAL os.mode=both -->
- Windows: `{{run}}.bat`
- macOS, Linux: `./{{run}}.sh`

<!-- OPTIONAL scripts=run --><!-- OPTIONAL os.mode=single --><!-- OPTIONAL os=windows -->
```console
{{run}}.bat
```

<!-- OPTIONAL scripts=run --><!-- OPTIONAL os.mode=single --><!-- OPTIONAL os=unix -->
```console
./{{run}}.sh
```

For variations, refer to the usage of the commands the script invokes.    <!-- OPTIONAL scripts=run -->

<!-- OPTIONAL -->
## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| <e.g., `FOO_API_KEY`> | <e.g., (none)> | <e.g., Required for X feature> |

<!-- OPTIONAL -->
## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

<!-- OPTIONAL -->
## License

<license name (e.g., MIT)>
