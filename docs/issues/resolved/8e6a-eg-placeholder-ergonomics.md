---
id: "8e6a"
title: AGENTS.md `<e.g., "...">` placeholder lines are not mechanically fillable
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-05-28
updated: 2026-05-28
---

`kisou`'s bundled `templates/AGENTS.md` uses example-style placeholders for
the Commits / Always do / Never do sections:

```markdown
- <e.g., "One logical change per commit">
- <e.g., "Don't commit; the user will commit manually">
- <e.g., "Wait for user approval before each commit">
```

These are **conceptually open-ended** — the author has to decide what rules
apply to their project. kisou's Step 2 ("Gather inputs up front") doesn't
currently include open-ended questions for these; the agent ends up either
leaving the `<e.g., ...>` lines in place (literal placeholders shipped) or
guessing project conventions on the author's behalf.

Observed on `dotskills` (commit `1caf975`): I had to hand-write reasonable
Commits / Always-do / Never-do entries based on inferred repo conventions
(prefer-new-commit-over-amend, run pre-commit before claiming done, etc.) —
none of this was actually asked of the user.

## Suggested fix

Either:

- Have kisou explicitly **ask the user** for these in Step 2 (small set of
  open-ended prompts) and fill in their answers.
- Or, ship sensible defaults (one or two universally-applicable rules per
  section) and tell the user to edit afterward.

The current "leave as `<e.g., ...>`" outcome is the worst of both.

## Resolution

The template's `Commits` section was removed entirely, and the
open-ended `<e.g., ...>` lines in Always do / Never do were demoted to
optional extensions beneath universally-applicable fixed items
(`Co-Authored-By:` trailer, root MD / secret / amend / main-push bans).
Even if the example placeholders are shipped as-is, the section now has
substance. This implements the second suggested fix ("ship sensible
defaults") above.
