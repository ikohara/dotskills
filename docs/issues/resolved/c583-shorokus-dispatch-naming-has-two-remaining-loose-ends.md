---
id: "c583"
title: "`shoroku`'s dispatch naming has two remaining loose ends after the fix wave: a third unnamed dispatch site, and a naming rule that doesn't literally cover dotless kinds"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-17
---

Found by the tanto-cost run's final fix-wave re-review (2026-09-14),
recorded in `.tanto/tanto-cost/final-fix-wave-report.md`, "Rulings" (parked,
with a ruling — no second fix wave) and "Parked and deferred minors".

The fix wave named `subagent_type: tanto-shoroku` at the two dispatch sites
the whole-branch review's I3 finding pointed at (`roles/kanri.md`'s
Recommend and Apply steps). The re-review found a **third** site the
finding did not name: `roles/kanri.md:308`, in the commit window's step
7(a), still reads "dispatch the `shoroku` kind in apply mode with the
recommendation, the direction, and the commit subject" — the exact
unnamed phrasing the fix corrected elsewhere. Ruled to park rather than
reopen a closed fix wave for one cross-reference: it plausibly reads as
pointing back at step 4's own instruction rather than as an independent
dispatch, so the practical harm is small, but it leaves one of the three
mentions of this dispatch still unnamed — the exact inconsistency the fix
existed to remove.

Separately, `SKILL.md:143` states the seat-naming rule as
`subagent_type: tanto-<object>-<act>`. `tanto-shoroku` (and `tanto-default`)
are two-part names — the rule's `<object>-<act>` pattern assumes a dot to
split, and `shoroku`/`default` have none. The agent exists at the right
path and the dispatch is correct in practice; the naming rule as literally
worded does not say what a dotless kind's name looks like.

Neither fixable now: `roles/kanri.md`'s passages closed after batch C
(and the fix wave, itself outside the plan's tasks, has landed); `SKILL.md`'s
passages closed after batch B.

Related: the whole-branch review's I3 finding (fixed at the other two
sites), issue-9d84 (a related "the same fact is stated in more than one
place, and one copy goes unmaintained" shape).

**Resolved 2026-09-17 on the `shoroku-at-close` branch.** Both loose ends are
closed. The third, unnamed dispatch site — `roles/kanri.md`'s step 7 (a) — now
reads "dispatch `subagent_type: tanto-shoroku-apply` with the recommendation, the
direction, and the commit subject". And `skills/tanto/SKILL.md`'s naming rule now
says "`subagent_type: tanto-<object>-<act>` — or `tanto-<kind>` for a kind with no
dot in its name, which is `tanto-default`", so the dotless case is stated
literally; `tanto-shoroku` no longer exists to need it.
