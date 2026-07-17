# {{notes}}/ — AGENTS

A `note` is a **maintained reference** on **one** concern — a registry,
glossary, mapping table, cheat sheet. It is *living* (updated in place), the
opposite of `{{reports}}/` (dated, frozen). It is **not** a scratchpad or
session log; non-curated content does not belong here (see "Not a scratch
space" in `{{docs}}/AGENTS.md`).

A *flat* type (like `{{reports}}/`): no `<id>`, no frontmatter — the slug is the
identity.

## Rules

- Path `{{docs}}/{{notes}}/<slug>.<ext>`; slug is English kebab-case.
- Format fits the concern: Markdown for prose, TOML/YAML for structured data a
  tool consumes. A structured note may pair with a Markdown sibling of the same
  stem.
- **No frontmatter, decided by extension:** a `.md` note's `# H1` is the title;
  a `.toml`/`.yaml` note states its scope in a leading comment block.
- One concern per note — split if it grows a second. No index file.
- Cited by **path** (notes have no `<id>`); a structured note may be read by
  tooling at runtime.
