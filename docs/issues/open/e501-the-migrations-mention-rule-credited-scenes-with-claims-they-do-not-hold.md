---
id: "e501"
title: "the migration's mention rule: a dropped sentence's mention took the file map's target and credited scenes with claims they do not hold"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-68

The `experience-layer` migration's rule — "a mention takes the file map's
target; a dropped sentence takes it too" — produced citations that read as
"this scene says so" for sentences no scene holds: about ten in design-4807
before batch D's D-5 fix round, and six that remain. A pointer form
("folded into exp-…"), or "drop the citation where no expectation holds the
claim", would have avoided the round. The rule lives in the spec's section 9
and in the recommend mode's pairing paragraph in `skills/shoroku/SKILL.md`,
which the next kisou project's hand migration will read.

The six bare `(exp-06b2)` citations that stand in design-4807 are this
issue's example rather than a design edit: each needs judgment per sentence.

The sweep script had the same blindness from the other side (S-70): its
`Related:` shortcut mapped every `req-` id in a `Related:` paragraph to the
file-level target, while a parenthetical that quotes a sentence (in
issue-36c0) needs the sentence's destination, which the script cannot see;
the Jisso found it only by reading the dry-run list.

Two alternatives were rejected in the spec dialogue (its Q3): 38 per-issue
judgments for lines that are boilerplate `Related:` mentions; and dropping
the mentions, which loses the one pointer from an issue to the want it sits
under.
