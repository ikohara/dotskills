---
id: "f727"
title: "the Sources entry form: nothing forbids a `req-` id or a path to a deleted file, and a blanket confirmation's quoting is undecided"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-56

Two gaps in `docs/experience/AGENTS.md`'s Sources rules, which the
`experience-layer` migration met by ruling and by literal compliance. Each
needs a rule decided, and the file is a template-pinned copy that changes
with `skills/kisou/templates/docs/experience/AGENTS.md`.

**A `req-` id or a path to a deleted file.** The `[inferred]` form,
`inferred from <ids> and 「<quote>」; not stated directly`, does not forbid
a `req-<id>` or a path to a file a fold deletes. The migration's recommender
wrote 20 such entries, and the plan's fences grep `req-` only in
`docs/design`, `docs/issues/open`, `docs/issues/deferred` and `docs/notes`,
not in `docs/experience` (batch C's quality review, Important 1). A gap in
the type rules or in the fences.

**A blanket confirmation** (S-85). Thirteen `[confirmed]` entries across
six scenes quote the same blanket confirmation 「今のところ他に違和感なし」
("nothing else feels off so far"), and one quotes 「抽象案でOK」 twice. The
form is met, and exp-27e8 asks for confirmation by exception, but such a
line carries no more information than `[inferred]` plus a date. Whether a
blanket confirmation is quoted on each line, or once in the scene with its
date, is undecided.
