---
id: "ebb3"
title: "kisou's legacy fold: a note printed once, a sentence shipped to fresh scaffolds, and migrate's type rename deferred"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-86

Three faces of the consequence decision-78a5 accepts — other kisou projects
migrate lazily, by hand.

**A note printed once.** `doc-system-check.js`'s legacy note is conditional
on `experience/AGENTS.md` being absent, so it prints exactly once in a
project's life, at the check before the first `apply`. Afterwards the old
`requirements/AGENTS.md`, which still says "Reference prefix: `req`",
coexists silently with `experience/AGENTS.md`, and a classifier reading
`docs/<type>/AGENTS.md` sees five managed type-rule files. The spec chose
this; that the note is one-shot is what no file states.

**A sentence shipped to fresh scaffolds** (S-88). The `docs/AGENTS.md`
legacy sentence — "A `req-<id>` reference in a document older than this
layer names a `requirements/` file the project folded into `experience/`" —
ships in the kisou template to every fresh scaffold, asserting a fold the new
project never did. Harmless and spec-mandated; a conditional form ("in a
project that once had a `requirements/` type") would be true everywhere. The
template's installed copy is pinned byte for byte by the doc-system hook, so
the two change together.

**Migrate's type rename deferred** (S-29, the spec's Deferred item 5): kisou
migrate learns the rename when a second kisou project needs it.
