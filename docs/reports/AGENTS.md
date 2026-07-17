# reports/ — AGENTS

A `report` records a one-off investigation — a recon, feasibility scan,
measurement run, audit. It is **dated and frozen**: it preserves what was true
at investigation time so later docs can cite it, and is not rewritten as the
project moves on.

A *flat* type (like `notes/`): no `<id>`, no frontmatter — the file-name date is
the identity.

## Rules

- Path `docs/reports/<YYYY-MM-DD>-<slug>.md`; slug is English kebab-case.
- **No frontmatter.** The `# H1` is the title; the leading paragraph states the
  scope.
- **The date lives only in the file name.** Never restate it as an
  `Investigation date:` line or frontmatter field — a second copy just drifts.
  A later write-up or multi-day span can be noted in prose, but the canonical
  date is the single file-name value.
- No index file. Cited by **path** (reports have no `<id>`).

## Lifecycle

- Append-only. To supersede a report, write a new dated one and link back in
  prose; never rewrite history. Edit in place only to fix mistakes or add refs.
