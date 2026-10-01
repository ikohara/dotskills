---
id: "e916"
title: "the `##`-heading contract the fix wave created for `shoroku`'s recommendation file is single-sited and unchecked from the `tanto` side that depends on it"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-10-01
---

Source: session 2026-09-14

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

**2026-09-16, the `tanto-sweep-2` run — the "Composes without modifying" claim
had drifted from practice, and nothing re-checks it.** The tanto requirement's "Composes
without modifying" bullet (folded into exp-06b2) named `shoroku` among the skills this repository uses
as-is, while `skills/shoroku/SKILL.md` had by then been edited for `tanto`'s
sake **twice**. The requirement and the practice were out of step until that
run's own T1 amended the bullet, so the bullet itself is now correct. What
remains is this issue's own subject one level up: the coupling described above
is exactly the thing the bullet asserts does not exist, and no check compares
the claim against the tree. A run noticed it by reading; the next drift will
need someone to read again.

**2026-09-16, the `tanto-sweep-2` run — one unpinned site survived the
batch-F fix wave.** `skills/tanto/SKILL.md`'s Artifacts table still names the
unpinned "item's `###` heading" phrasing in the last column of its
`<stage>-brief.md` row — the same ambiguity the whole-branch review's Important
1 pinned everywhere else in that wave. It survived because it sat outside the
wave's dispatched edit sets, not because it was judged correct. A one-phrase
follow-up, and a concrete instance of the coverage gap this issue names: the
contract is stated in one place and restated informally in others, with
nothing that finds the restatements.
