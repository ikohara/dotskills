---
id: "5e6f"
title: wayaku — on-demand Japanese translation of any file
created: 2026-05-28
updated: 2026-05-28
---

## Purpose

A Claude Agent Skill that provides spot, file-by-file Japanese
translation of arbitrary files (prose, source code comments, markup,
config). Output is cached per-file under `<root>/.wayaku/<same-relative-path>`
so the IDE's click-to-open works on report links. The source file is
never touched, and the cache is excluded from the shared repo via
`<root>/.git/info/exclude` (per-clone), not the shared `.gitignore`.

## Required behavior

- One-shot, file-by-file — no whole-tree traversal. Only translate files
  the user actually referenced (explicit paths, the IDE-opened file,
  recent tool-use targets).
- Classify each target by **filename → shebang → extension** in that
  order. Prose files are fully translated; source code translates only
  comments and docstrings (code stays syntactically valid); markup
  translates visible text only; config translates comments only;
  binary / unknown files are skipped with a report.
- Three-pass translation: literal → review → polish in ですます調
  (desu/masu).
- Preserve code blocks, inline code, identifiers, established acronyms,
  CS / programming terms (`callback` / `cache` / `compiler` etc.), file
  paths, and URLs in the original form.
- Skip already-Japanese content; skip when the cache is up-to-date
  (source not newer than cache).
- Report each target with a clickable workspace-relative cache link.

## Out of scope

- Tree-wide bulk translation.
- Editing the source file or the cache (the cache is derived from the
  source — re-run the skill to refresh it).
- Reverse translation (`.wayaku/` → source).
