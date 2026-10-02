---
id: "0e40"
title: wayaku — per-file Japanese translation into a per-clone cache
created: 2026-10-01
updated: 2026-10-02
---

## Shape

Serves exp-2daa.

wayaku translates one file at a time, on request, and writes the result to a
cache rather than beside the source. The cached translation of
`<root>/path/to/file.ext` is `<root>/.wayaku/path/to/file.ext`: the cache path
mirrors the source's relative path, so a link to it in a report opens in the
IDE with a click. The source file is never touched. The cache is excluded
from the repository per clone, through `<root>/.git/info/exclude`, and not
through the shared `.gitignore`; why is decision-d4dc.

## Classification

Serves no expectation; internal shape.

Each target is classified by **filename → shebang → extension**, in that
order, and the class decides what is translated:

- **Prose** — translated in full.
- **Source code** — comments and docstrings only; the code stays
  syntactically valid.
- **Markup** — visible text only.
- **Config** — comments only.
- **Binary / unknown** — skipped, and the skip is reported.

## Passes

Serves no expectation; internal shape.

Each translatable region goes through three passes — literal, then review,
then polish — and only the polished result is written. The polish pass
produces natural Japanese in ですます調 (desu/masu).

## Related

Serves no expectation; internal shape.

- exp-bcf4 — two languages, one tree; the want this skill serves.
- issue-2028 — wayaku re-translates after every edit.
- issue-aeed — bulk translation is intentionally not supported.
- `skills/wayaku/SKILL.md` — the procedure; this entry records the shape.
