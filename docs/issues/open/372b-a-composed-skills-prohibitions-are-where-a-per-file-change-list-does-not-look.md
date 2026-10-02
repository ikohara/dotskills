---
id: "372b"
title: a composed skill's prohibitions are where a per-file change list does not look
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-10-02
---

Source: shoroku tanto-cost

Raised by the spec review (candidate 4) and deferred by the tanto-cost design
(`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`, "Deferred items"
8). A design that changes how a composed skill is called lists the files it
touches; what it does not list is the composed skill's own Prohibited actions
section, which may forbid exactly the new call. This design has to re-scope
two such clauses in `skills/shoroku/SKILL.md`, which a per-file change list
would not have surfaced on its own.

The check exists in `docs/notes/tanto-consistency-checks.md` in a narrower
form; its check 3 could extend to "every prohibition of a composed skill that
a change relaxes". Deferred to that note's next revision rather than written
into this design.

**2026-09-17, a second measured instance.** `shoroku-at-close`'s spec declared
the rest of `skills/shoroku/SKILL.md`'s recommend-mode section "unchanged" in
its section 8.2, and so never asked how items are numbered across several
numbered sources, or how a pointer line is treated. The first design that made
the recommender read more than one proposal did not re-read the recommender's
own contract — the same failure as the first instance, with a per-file change
list naming one sentence of a composed skill's section and the rest of that
section going unread.

**2026-09-30, a third measured instance** (shoroku experience-layer S-20, the
`experience-layer` spec review's finding 3). The spec declared shoroku's apply
mode "unchanged in text" and quoted one sentence of recommend mode, while the
run it designs needs the pointer grammar, the item quoting rule, and the
standing-tree sentence of the same section. The consistency note's check 3
extension this issue proposes would have flagged the `Source:` grammar
mechanically.
