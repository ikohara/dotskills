---
id: "d7de"
title: path-link rot from immutable docs to status-moved issues
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-06-23
updated: 2026-06-23
---

The doc-management system kisou emits encodes issue status **by directory**
(`{{issues}}/<status>/<id>-<slug>.md`), so a status change is a `git mv` that
**moves the issue's path**. Any inbound Markdown **path link** to that issue then
dies. The acute case: the link lives in a document the project's own rules say
must never be edited after it is written — an ADR (immutable record) or a dated
point-in-time record (report, dated plan). Those path links can never be
repaired, so they rot permanently.

The dynamics that made this structural, not incidental:

- The canonical cross-reference was already `<type>-<id>` (e.g. `issue-b9c2`),
  with path links described as an optional convenience "for clickability." So
  the rot came entirely from the optional path link, never from the doc-id.
- The worst pairing is immutable/frozen document → status-movable target: the
  source cannot be fixed and the target's path is unstable by design. Only two
  things are safe there — reference by doc-id only, or make the target's path
  stable.
- Path links are fragile for a broader reason than issue-status moves: a **slug
  rename** on any type moves its path too. doc-id is the only durable reference
  across all types.

Resolution (convention clarification — the complete-coverage fix, covering both
status moves and slug renames):

- `{{docs}}/AGENTS.md` Cross-references now states doc-id is the durable pointer
  and path links are fragile; from an immutable/frozen document use doc-id only,
  from a living document path links are allowed but the actor who moves the
  target owns the inbound links.
- `{{issues}}/AGENTS.md` lifecycle now spells out the post-`git mv` duty: fix
  inbound path links in living docs; immutable docs are already doc-id only.
- `{{decisions}}/AGENTS.md` reinforces doc-id-only at the point of use.
- The `shoroku` skill, which cross-links new entries, points at the rule and is
  barred from adding a path link out of an immutable/frozen entry.

Alternatives considered and not taken:

- Flatten canonical issues (status back in frontmatter): reverses the
  deliberate "directory is the truth" design and only fixes the issue-status
  case — slug renames still rot path links from immutable docs — so the
  convention fix is needed regardless.
- Ship a status-aware link checker: redundant once the convention holds, and
  inconsistent with this system's stance that every other convention is an
  agent-followed hint, not tool-enforced (issues are "hints, not contracts").

Retrofit for existing repos: the rule reaches them through kisou migrate's
fixed-text refresh of `{{docs}}/AGENTS.md`. Already-rotted links in immutable
docs stay unrepaired by design; living-doc links can be fixed by a one-off
sweep on demand, not a standing tool. Relates to design-c1d2 and design-e3f4.
