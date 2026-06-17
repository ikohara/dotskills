---
id: "9ab0"
title: migrate refresh can mis-detect a renamed fixed-text section as missing
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-06-17
updated: 2026-06-17
---

The migrate-mode refresh introduced for kisou-managed files (decision `281f`,
SKILL.md Step 3 Present branch) is **additive**: a fixed section/block the
template defines but the file lacks is proposed for addition. The comparison
keys on section identity (heading), and it has **no rename detection**.

If an author renames a fixed-text section — e.g. `## Language` → `## Languages`
in `AGENTS.md`, or retitles the `docs/AGENTS.md` document-management heading —
the file can still match the kisou-managed fingerprint overall (the pointer
lines and the bulk of the heading set are intact), yet the refresh sees the
template's original heading as **missing** and proposes adding it back. The
result is a near-duplicate section: the author's renamed one plus a freshly
inserted template copy.

decision `281f` records the inverse safeguard — for a *diverged* fixed-text
section whose body was edited, refresh errs toward leaving the author's content
untouched. This issue is the **uncovered side**: the *missing*-section
verdict has no equivalent "did the author just rename it?" check.

Mitigations today are the interaction gates, not the logic: every refresh item
is a numbered proposal the user can reject, so a spurious "add `## Language`"
can be declined. But the duplicate is offered rather than suppressed, and a
user clicking through `OK` would accept it.

## Possible directions

- **Fuzzy heading match.** Before proposing a missing fixed section, check
  whether a sibling heading is a likely rename (high token overlap, same
  position) and, if so, treat it as present (optionally offer a rename-to-
  canonical suggestion instead of an add).
- **Body-similarity guard.** If some existing section's body closely matches
  the template body of the "missing" section, suppress the add and surface it
  as a possible rename for the user to confirm.
- **Defer.** Keep refresh purely heading-keyed and rely on the per-item reject
  gate; revisit if a real run produces a confusing duplicate.

Lowest-cost is defer; the fuzzy-heading match is the most useful if the
false-add proves common in practice.
