---
name: wayaku
description: Translate a file's prose or comments to Japanese under .wayaku/<same-relative-path>. Use when the user says "和訳して", "wayakuして", "wayaku <path>", "和訳更新", or "日本語で見せて".
---

# wayaku

Spot translation cache. On-demand, file-by-file. For source file `<root>/path/to/file.ext`, the translation
is written to `<root>/.wayaku/path/to/file.ext`. The source file itself is never touched.
(`<root>` denotes the project root throughout this document.)

This is not a tree mirror — only files the user references get translated.

The cache lives inside the workspace so that IDE click-to-open works on report links. To keep the
shared repo clean, the cache is hidden via the per-clone `<root>/.git/info/exclude` (not via the shared
`.gitignore`). See Step 0.

## Workflow

### Step 0: Ensure local-ignore

The cache directory `<root>/.wayaku/` is a per-user artifact and must not be committed. Register it
in the per-clone `<root>/.git/info/exclude` (not the shared `.gitignore`) so other team members never
see it.

Idempotently append `.wayaku/` to the exclude file. If `<root>` is not inside a git repo, skip this
step.

```bash
# POSIX
exclude="$(git rev-parse --git-path info/exclude 2>/dev/null)"
if [ -n "$exclude" ] && ! grep -qxF '.wayaku/' "$exclude" 2>/dev/null; then
  echo '.wayaku/' >> "$exclude"
fi
```

```powershell
# PowerShell
$exclude = git rev-parse --git-path info/exclude 2>$null
if ($exclude -and -not (Select-String -Path $exclude -Pattern '^\.wayaku/$' -Quiet -ErrorAction SilentlyContinue)) {
    Add-Content -Path $exclude -Value '.wayaku/'
}
```

### Step 1: Identify target

Determine the target file (one or more) in this order of precedence:

1. Explicit file paths from the user request
2. Files referenced or edited in the most recent tool use, or the file currently open in the user's IDE
3. If neither, ask the user for the path

### Step 2: Check the cache

For each target `<root>/path/to/file.ext`, the cached translation is at `<root>/.wayaku/path/to/file.ext`.

Skip translation when both hold:

- The cache file exists, AND
- The source file is not newer than the cache (mtime check)

Use the Bash tool for the mtime check (POSIX `[ "$src" -nt "$dst" ]`), or the PowerShell equivalent
`(Get-Item $src).LastWriteTime -gt (Get-Item $dst).LastWriteTime`, where `$src` is the source path and
`$dst` the cache path.

### Step 3: Classify the file

Detect the file kind by **filename → shebang → extension**, in that order.

Two qualifications on the filename rule:

- Treat known names as **prefixes terminated by `.` or end-of-name** — `Dockerfile.dev`, `LICENSE.txt`,
  `README.md` all match; `READMEcat` does not.
- A filename match wins only if the suffix is not a known extension of a different kind — `Dockerfile.dev`
  matches as Source code, but `Dockerfile.txt` falls through to the extension rule and is classified as
  Prose.

Recognized file kinds:

- **Prose** (extensions `.md`, `.mdx`, `.txt`, `.rst`; or filenames starting with `README`, `CHANGELOG`,
  `LICENSE`, `NOTICE`, `AUTHORS`) — the whole file is translatable; preserve the document structure
  exactly.
- **Source code** (extensions `.py`, `.js`, `.jsx`, `.ts`, `.tsx`, `.go`, `.rs`, `.c`, `.cpp`, `.cs`,
  `.php`, `.java`, `.kt`, `.swift`, `.rb`, `.sh`, `.lua`, `.dart`, `.scala`, `.pl`, ...; extensionless
  files with a `#!` shebang; or filenames starting with `Dockerfile`, `Makefile`, `Rakefile`) — translate
  **comments and docstrings only**. Leave code, identifiers, and string literals untouched. The output
  file must remain syntactically valid.
- **Markup** (`.html`, `.htm`, `.svg`) — translate **visible text content** (between tags, plus
  text-bearing attributes like `alt`, `title`). Leave tags, identifiers, and code untouched.
- **Config / data** (`.yaml`, `.toml`, `.json`, `.ini`, `.env`) — translate **comments only**. Leave keys
  and values untouched.
- **Binary / unknown** — skip and report.

If all translatable content (prose, comments, docstrings, visible markup text) in the file is already in
Japanese, skip the file and report.

### Step 4: Translate (three-pass)

Each translatable area from Step 3 is split into **regions** (one sentence each; comments and docstrings
are split into sentence-level regions). Translate region by region: any region in a non-Japanese source
language is translated; any region already in Japanese is left as-is.

A sentence is "non-Japanese" only if its **prose** is predominantly in another language; embedded English
technical tokens inside otherwise Japanese sentences (e.g. `compute shader が ...`) do NOT make a
sentence non-Japanese.

For each translatable region, internally run three passes and emit only the final result:

1. **Literal pass** — translate mechanically while preserving every preservation-list item (see "Translation
   rules").
2. **Review pass** — flag awkward phrasing, mistranslated technical terms, and inconsistent terminology.
   Internal only; do not emit.
3. **Polish pass** — produce natural Japanese in ですます調 (desu/masu form) while keeping technical
   precision. This is the final output.

### Step 5: Write the cache

Write the result to `<root>/.wayaku/<same-relative-path>`, creating parent directories as needed.
Outside the translatable areas defined in Step 3 (code, tags, non-text-bearing attributes, identifiers,
literals, keys/values, indentation, line breaks), the output is preserved verbatim. Within those areas,
follow Step 4.

Always end the output file with exactly one trailing newline character, regardless of whether the source
has one, so it passes linters such as markdownlint MD047 ("Files should end with a single newline
character").

### Step 6: Report

Report each target with one of:

- **translated** — fresh translation written
- **up-to-date** — source not newer than the cache; existing translation kept
- **skipped (already Japanese)**
- **skipped (binary / unknown)**

**Always present the cache path as a clickable markdown link** so the user can open the translation in
their IDE with one click. Use a **workspace-root-relative path** (no leading `/`, no `./`) for both the
link text and the URL — this is what the Claude IDE extensions resolve to a clickable file open.

Format:

- When a cache file exists (statuses **translated** and **up-to-date**), use a markdown link to the cache
  path: `[<.wayaku/relative/path>](<.wayaku/relative/path>) — <status>`.
- When no cache file was written (statuses **skipped (already Japanese)** and **skipped (binary /
  unknown)**), use the source path in backticks: `` `<source/relative/path>` — <status> ``.

Example:

- [.wayaku/docs/intro.md](.wayaku/docs/intro.md) — translated
- [.wayaku/src/utils.py](.wayaku/src/utils.py) — up-to-date
- `notes-ja.txt` — skipped (already Japanese)
- `assets/logo.png` — skipped (binary / unknown)

Do NOT swap in a different display label, absolute path, `file://` URL, or anchor — those defeat the
IDE's click-to-open. Link text and URL must match and must be the relative cache path verbatim.

For multi-file requests, process all targets through Steps 1–5 first, then emit a single consolidated
report at the end (one line per file).

## Translation rules

### Preserve in original form (do NOT translate)

- Inline code (`` `...` ``) and code blocks (```` ```...``` ````) in prose
- File paths, URLs, identifiers (function, variable, class, type names)
- YAML / TOML / JSON keys and values — preserved verbatim. **Markdown frontmatter only**: prose values
  like `title` / `description` translate with the document.
- Established acronyms: API, HTTP(S), SDK, CLI, JWT, OAuth, SSO, JSON, YAML, SQL, GPU, CPU, RAM, OS, URL,
  UUID, etc.
- **Computer-science / programming terms that would normally be katakana — keep in English, do not
  transliterate.** If a term has a widely-known English form among programmers and would be understood
  as-is by a Japanese developer, keep it in English (e.g. `callback`, `cache`, `compiler`).
  Only translate when there is an established Japanese term that is genuinely more readable (e.g.
  "ファイル" for "file" is fine because it is universally understood).

### Style

- Use ですます調 (polite form), not である調
- Mix English technical terms with Japanese prose naturally; do not add awkward parentheses or annotations
  unless the term is genuinely obscure
- Preserve markdown / source-code structure exactly (heading levels, list nesting, comment delimiters,
  indentation, line breaks)
- Put one ASCII space between adjacent Japanese and English tokens. Example: `compute shader が` (not
  `compute shaderが`). **Exception:** no space immediately before or after Japanese punctuation marks
  (`、`, `。`, `「」`, `（）`). Example: `API を呼び、CLI も使う` (not `API を呼び 、 CLI も使う`).
- Translate the display text of markdown links (`[text](url)`) and the alt text of images
  (`![alt](path)`); preserve URLs, paths, and reference labels (`[text][ref]` keeps `ref` unchanged).
- Keep numerical formats and dates in their original form

### Example (prose)

Source (English):

> The compute shader writes to a storage buffer, and the next render pass reads from it via a descriptor
> set. Use a pipeline barrier between them.

Translation:

> compute shader が storage buffer に書き込み、次の render pass が descriptor set 経由でそれを読み取ります。
> 両者の間には pipeline barrier を使ってください。

### Example (source code — Python)

Source:

```python
# Build the index from the manifest.
def build_index(manifest):
    """Return a dict keyed by entry name."""
    return {e.name: e for e in manifest.entries}
```

Translation (comments and docstring only):

```python
# manifest から index を構築します。
def build_index(manifest):
    """エントリ名を key にした dict を返します。"""
    return {e.name: e for e in manifest.entries}
```

## Prohibited actions

- Do NOT walk the tree. wayaku is spot translation; only translate the files the user actually referenced.
- Do NOT modify the source file. Always write to `.wayaku/...`.
- Do NOT translate `.wayaku/` files back to the source (no reverse translation).
- Do NOT edit `.wayaku/` files as if they were a primary source. If the user asks to edit one, redirect
  them to edit the source and re-run this skill.
- Do NOT translate code, identifiers, string literals, or computer-science / programming terms into katakana.
- Do NOT add `.wayaku/` to the shared `.gitignore`. Use the per-clone `<root>/.git/info/exclude`
  (Step 0) instead.
- Do NOT stage `.wayaku/` files for commit.
