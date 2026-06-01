# wayaku

Spot translation cache for any file. wayaku writes a Japanese version of the requested file to
`<root>/.wayaku/<same-relative-path>` on demand; the source file is never modified.
(`<root>` denotes the project root.)

## How it works

- **Not a mirror**: wayaku does not walk the tree. Only files the user references get translated.
- **Cache semantics**: an existing translation is reused as long as the source is not newer than the cache.
- **Source language auto-detected**: files with any non-Japanese content are translated, region by region.
- **Code files**: only comments and docstrings are translated; code stays intact and the file remains
  syntactically valid.
- **Three-pass translation** (literal → review → polish) produces natural ですます調 prose.
- **Computer-science / programming terms** (`callback`, `cache`, `compiler`, ...) are kept in English
  rather than transliterated to awkward katakana.

## Trigger phrases

The agent will invoke this skill when you say things like:

- 「和訳して」 / 「訳して」
- 「wayakuして」 / 「wayaku `<path>`」
- 「和訳更新」
- 「日本語で見せて」 / 「日本語で読みたい」

## Setup

None required. On first invocation in a git repo, the skill registers `.wayaku/` in your per-clone
`<root>/.git/info/exclude` so the cache stays out of `git status` without modifying the shared
`.gitignore`. It also drops `<root>/.wayaku/.markdownlint-cli2.yaml` (all rules off) so the
translated artifacts never trip the project's Markdown linter — again without touching the shared
lint config.

## See also

- [SKILL.md](./SKILL.md) — the actual skill instructions (read by the agent).
