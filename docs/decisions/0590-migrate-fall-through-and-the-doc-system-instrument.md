---
id: "0590"
title: the migrate fall-through for an unclassifiable file is leave-alone-and-report, and the doc-system comparison is an instrument
status: accepted
supersedes: []
superseded_by: null
amends: ["281f"]
amended_by: []
created: 2026-09-11
updated: 2026-09-11
---

## Context

decision-281f made refresh a stateless structural comparison, but left two
things in prose: real-content files keep the `.bak` + fresh-write path, and the
comparison itself is a reading of the files by the agent. Both failed in
practice. The first dogfood, 2026-09-09, classified three of the four per-type
`docs/<type>/AGENTS.md` copies as foreign and offered a `.bak` and a rewrite of
files that were kisou's own. req-1a2b had already gained the opposite rule on
2026-09-09 — "Uncertainty narrows what migrate proposes … a file it cannot
classify is left alone and reported" — which the skill text never followed.

Six issues sit on the same ground: issue-e19f (no fingerprint for a per-type
doc-system `AGENTS.md`), issue-2bf9 (the fixed-text test reads `<id>` as free
text), issue-f50d (migrate contradicts itself on a present doc-system),
issue-f623 (no insertion position for an added section), issue-afed (the `tidy`
condition stated twice, differently), and issue-acc0 (the notes and reports
copies drift, and nothing tracks it). The kisou refresh design spec of
2026-09-11 worked the dialogue that settled them.

## Options

- **Keep `.bak` as the fall-through** (Q-1 A) — it is what produced the
  2026-09-09 dogfood's offer to overwrite kisou's own files.
- **Drop the `.bak` path entirely** (Q-1 C) — removes an operation that is
  still the right answer when a user asks for it by name.
- **A per-type fingerprint list** (Q-2 A) — the gap it would close was opened
  by exactly such a list going stale.
- **A repository-local check script** (Q-7 A) — would not travel with the
  skill, so every downstream repository would lack it.
- **Prose-only migrate with a check-only script** (Q-8 B) — leaves the writing
  to the same reading that misclassified the copies.
- **A script that also handles layer B** (Q-8 C) — doubles the estimate, and
  none of the six issues is in layer B.
- **An `apply` without partial acceptance** (Q-9 C) — contradicts req-1a2b's
  numbered partial-accept, which decision-281f already relies on.
- **An `apply` that stores item numbers from the last `check` in a state
  file** — stateful, which is the whole point decision-281f avoids, and the
  tree can move between the two calls; recompute by identity and print what
  was applied instead.
- **A typographic free-text rule, bare `<...>` versus backticked** —
  `docs/AGENTS.md`'s type path table and the frontmatter examples carry bare
  notation, so the rule would misread them as author fill.

## Decision

This ADR replaces decision-281f's `.bak` fall-through and its prose comparison.
The rest of decision-281f — stateless refresh, no version stamp, refresh as a
sub-case of the migrate Present branch, numbered partial-accept — stands.

- **The fall-through when no fingerprint matches is "leave alone and
  report".** The file is named, the fingerprint it missed is said, and nothing
  is proposed for it. `.bak`-and-rewrite survives only as an operation the user
  asks for by naming the file; kisou never offers it.
- **The doc-system comparison is a deterministic executable shipped with the
  skill**, `scripts/doc-system-check.js` (Node 22 or later, standard library
  only). Which `{docs,Documents}/**/AGENTS.md` are kisou-managed, which fixed
  sections are missing or diverged, and where an added section lands are what
  the script says. Its numbered report **is** the proposal, and
  `apply --items` writes the items the user accepted.
- **The fingerprint is one general rule, not a list**: a doc-system file is
  kisou-managed when its first heading is the expanded template's H1 — and,
  for the docs root alone, the file also carries the `## Document management`
  heading.
- **A `<...>` is free text only where a template's `TEMPLATE FILL` block says
  so.** Every other `<...>` is notation the rule text uses, and its section is
  fixed-text.
- **migrate presumes `node` for the doc-system half.** Without it, that half
  stops and says so, rather than substituting a reading.

## Consequences

- decision-281f's stateless-refresh principle stands, and is now executable
  rather than a reading.
- Layer B — `README`, `CONTRIBUTING`, `AGENTS.md`, `CLAUDE.md` — stays a prose
  judgment; the instrument does not touch it.
- kisou gains a runtime prerequisite for migrate: Node 22 or later.
- The `.bak` path survives only as a user-named operation, never an offer.
- The skill ships a `scripts/` directory, which it did not before.
