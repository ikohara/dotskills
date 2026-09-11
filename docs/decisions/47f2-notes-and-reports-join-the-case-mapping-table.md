---
id: "47f2"
title: "`notes` and `reports` join the `case` mapping table"
status: accepted
supersedes: []
superseded_by: null
amends: ["8b1f"]
amended_by: []
created: 2026-09-11
updated: 2026-09-11
---

## Context

decision-8b1f's mapping table enumerates the directory names `case` flips:
`docs` and `src` with abbreviation expansion, then `tests`, `scripts`,
`requirements`, `design`, `decisions`, `issues` title-cased. It closes with the
rule that anything not in the table is not case-flipped.

`notes` and `reports` joined the doc-system later, as flat types
(decision-3544), and were never added to the table. Meanwhile
`skills/kisou/SKILL.md` Step 2 and design-c1d2 both say the two names
participate in the `case` mapping. So 8b1f read alone says a PascalCase project
gets `Documents/notes/AGENTS.md` beside `Documents/Requirements/AGENTS.md`,
while the skill says `Documents/Notes/AGENTS.md`. Found 2026-09-11 at the
kisou-refresh spec review; the human approved this amendment the same day.

## Options

- **Leave them unmapped** — `Documents/notes`, `Documents/reports`. Consistent
  with 8b1f's letter, inconsistent with the skill and with every other
  doc-system type directory.
- **Add them to the mapping** — `Documents/Notes`, `Documents/Reports`.
  Consistent with the skill, and with decision-3544's intent that the two are
  ordinary flat types of the same doc-system rather than project-specific
  directories.

## Decision

`notes` and `reports` **are in the mapping table**, title-cased like the other
type names: `notes` ↔ `Notes`, `reports` ↔ `Reports`. This amends the
enumeration in decision-8b1f's Decision section and, with it, the reach of its
"anything not in the mapping table" clause. Everything else in 8b1f stands on
its own reasoning: abbreviation expansion for `docs` and `src`, the script-name
list, the issue-status subdirectories staying lowercase under any `case`, and
the rule itself that unmapped names are not flipped.

The instrument the kisou-refresh plan ships carries the same table as one list:
`docs`, `src`, `tests`, `scripts`, `requirements`, `design`, `decisions`,
`issues`, `notes`, `reports`.

## Consequences

- 8b1f's "anything not in the mapping table" clause now reads with the two
  names included, so a `Notes/` in a PascalCase project is kisou's own
  destination name, not an author's custom directory.
- Downstream PascalCase projects that already hold `Documents/notes` are a
  `--case` question for the instrument to surface on the next migrate, not
  something this ADR resolves.
- The table now has one authority and two copies that must agree with it —
  `skills/kisou/SKILL.md` Step 2 and the instrument's list — which is the drift
  this amendment closes rather than a new exposure.

Related: req-1a2b, design-c1d2, decision-3544, decision-281f.
