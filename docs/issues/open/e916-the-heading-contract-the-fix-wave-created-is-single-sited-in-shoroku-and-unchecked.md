---
id: "e916"
title: "the `##`-heading contract the fix wave created for `shoroku`'s recommendation file is single-sited and unchecked from the `tanto` side that depends on it"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

Found by the tanto-cost run's final fix-wave re-review (2026-09-14),
recorded in `.tanto/tanto-cost/final-fix-wave-report.md`, "Parked and
deferred minors" and "Shoroku candidates" — a consequence of the fix wave's
own fix 1, not a defect it left unaddressed.

Fix 1 (this run's whole-branch review, Critical finding C1) made
`skills/shoroku/SKILL.md`'s recommend mode write its three groups as real
`##` headings with exact text, so that `tanto`'s `sections --file <rec>
unsure` — which matches heading text exactly — can find the `unsure`
group. The heading-text contract this creates is stated in exactly **one**
place: `skills/shoroku/SKILL.md:90-91`. Every `tanto`-side description of
the same three groups (`SKILL.md:515`, `:597`, `roles/kanri.md:602`,
`templates/kanri.md:61`) describes them **form-agnostically** — as groups,
never as headings — so nothing on the `tanto` side currently contradicts
the contract, but nothing pins it there either, and nothing checks it.

The coupling this creates: `shoroku` is a skill this repository composes
and does not otherwise modify for `tanto`'s sake (`SKILL.md`'s "Composes
without modifying" requirement); its recommend-mode output format is now
something a second skill's read depends on being exactly right, with no
test or consistency-note check on either side enforcing the pairing. If
`shoroku`'s recommend mode ever changes that heading form again — for a
reason having nothing to do with `tanto` — `tanto`'s `unsure`-group read
breaks silently, the same way it silently broke before this fix wave.

Not something to fix now: this is a new, narrow coupling the fix itself
introduced correctly (the alternative, reading the recommendation file
whole, was rejected in favor of the by-exception read the whole redesign
exists for). What's missing is a check, not a text change — e.g. a
consistency-note entry that greps `shoroku/SKILL.md` for the exact heading
strings `tanto`'s role files depend on, so a future change to either side
that breaks the pairing is caught mechanically rather than by an exit
shoroku quietly reading nothing.

Related: issue-4d8a (nothing checks a role file's own cross-references —
the same shape, here between two skills instead of within one file).
