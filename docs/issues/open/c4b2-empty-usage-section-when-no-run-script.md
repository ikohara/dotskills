---
id: "c4b2"
title: empty `## Usage` section when no run script is selected
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-05-28
updated: 2026-05-28
---

In `kisou`'s bundled `templates/README.md`, the `## Usage` heading is
unconditionally present, but all of its content blocks (Windows / macOS-Linux
bullet, single-OS `console` blocks, "For variations…" line) are gated by
`<!-- OPTIONAL scripts=run -->`. If the user declines the `run` script, every
content block drops and the section ends up with **just the heading** and an
awkward blank body.

The intent (per the spec note "for libraries, Usage may be a code example
instead") was that the author would replace the run-script blocks with their
own code example. But the template provides no scaffold for that path, and the
result of a strict scaffold without author intervention is degraded.

## Options

1. Add a section-scope `<!-- OPTIONAL scripts=run -->` before `## Usage`,
   dropping the whole section when `run` is declined. Loses the "code
   example" affordance.
2. Add a bare `<!-- OPTIONAL -->` before `## Usage` so authors can omit it.
   Less deterministic than (1).
3. Add a fallback block (e.g., `<!-- OPTIONAL scripts=!run -->` "negation"
   syntax) that displays a Usage stub / code-example placeholder when `run`
   is declined. Adds new syntax (negation), heavier.

Workaround for now: author manually fills `## Usage` after scaffold.
