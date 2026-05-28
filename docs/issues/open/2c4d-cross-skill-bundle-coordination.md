---
id: "2c4d"
title: cross-skill bundle coordination between kisou and shoroku has no automated check
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-05-28
updated: 2026-05-28
---

`kisou` bundles `templates/docs/AGENTS.md`, whose "Session shoroku
(excerpting)" section describes how the `shoroku` skill operates from an
agent-agnostic perspective. The authoritative description of shoroku's
behavior is in `skills/shoroku/SKILL.md` — but the version shipped to
target projects via kisou is the **bundled copy in kisou's templates**.

If `shoroku` evolves its workflow (e.g., adds a new source mode, changes
the partial-accept parsing), the bundled copy in `kisou/templates/docs/AGENTS.md`
must also be updated to match — there is no automated check that flags drift.

Mitigation today is convention only (commits touching shoroku's workflow
should also touch the kisou bundle). The "single authored source" principle
from the kisou spec acknowledges that distribution copies exist; the gap
is that the **source** is split: shoroku's behavior is authored in
`skills/shoroku/SKILL.md`, but the **published description** lives in kisou's
bundle.

## Options

1. **Manual convention + pre-commit check.** Add a pre-commit hook that
   diffs the relevant section between `skills/shoroku/SKILL.md` and
   `skills/kisou/templates/docs/AGENTS.md` and warns on divergence.
2. **Move authoritative shoroku-workflow text into kisou's bundle**, and
   have `skills/shoroku/SKILL.md` reference it (inversion of current
   ownership). Awkward — shoroku's skill file ideally owns its own
   description.
3. **Generate the bundled section from the skill file** at build time
   (extract the relevant block and write into the bundle). Build step
   complexity.

Defer to whichever feels lightest when the next shoroku workflow change
lands.
