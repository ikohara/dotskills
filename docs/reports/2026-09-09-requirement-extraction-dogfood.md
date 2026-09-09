# requirement-extraction: the kisou refresh path's first dogfood

The requirement-extraction plan taught the docs system that a stated need is a
requirement even when unmet, and that a design names the requirement it serves.
Six passages went into four `kisou` templates and one paragraph into
`shoroku`'s `SKILL.md`; this repository's own four installed
`docs/**/AGENTS.md` copies were then brought level **through kisou's own
refresh path**, which had never been exercised. That last part is what this
report is about. The refreshed files were only half the deliverable; the other
half was a record of what the refresh actually did, and this freezes it.

Scope: the migrate run and the run that carried it. It does not restate the
rule that landed — that is in `design-e3f4` and `design-c1d2` — nor the plan and
spec, which stand as the requirement-extraction spec and plan of 2026-09-09
under the superpowers workspace. There were no hotfixes between the previous
plan's close and this one's landing.

## Why the run existed

`decision-281f` gives kisou a stateless structural refresh: re-running migrate
on a project kisou set up brings it toward the current template, so a
kisou-using project does not freeze at its scaffold-time version. Nothing had
ever tested it. The plan needed exactly that operation — four installed copies
behind their templates by six passages — so it ran the real path rather than
hand-mirroring, precisely so the path would be exercised. Hand-mirroring alone
was considered and rejected for that reason.

Two open questions were named in advance, and a third and fourth besides, so
that the run would answer them rather than assume them.

## The five points, and what happened

**1. Is a present doc-system refreshed at all?** kisou's own text disagrees
with itself: its detection calls a `full` doc-system "still a refresh target"
while its per-artifact list says "leave it intact and add only around it"
(`issue-f50d`). Answer: it refreshed the one file it recognized. The
contradiction stands as a defect regardless of what the run did, since the
operator's explicit docs-only scope pick is what resolved it here.

**2. Which sections count as fixed-text?** Read literally, kisou's "no `<...>`
free-text" test classifies any section whose body carries `<id>` notation as
author free-text, which would make three of the four expected items unreachable
(`issue-2bf9`). Answer: **not tested, and masked rather than disproved.** The
fingerprint gap of point 3 diverted three files before the fixed-text test ever
ran on them. For the one file that did reach the refresh branch,
`docs/AGENTS.md`, the *intended* reading held — its "Session shoroku
(excerpting)" section was offered even though its body carries `<id>` notation.
One data point for the intended reading, none against the literal one. The
issue must not be closed on this evidence.

**3. What is a per-type `AGENTS.md`'s fingerprint?** There is none
(`issue-e19f`), and it decided the run. kisou classified
`docs/requirements/AGENTS.md`, `docs/design/AGENTS.md` and
`docs/issues/AGENTS.md` as **not kisou-managed** and offered, for each, to
rename it to `<file>.bak` and write a fresh template-filled file. All three
offers were rejected per the plan and the passages hand-mirrored. **Two thirds
of the refresh the plan needed did not happen.**

The shape of that failure is worth more than the count. The gate is a filename
fingerprint; when it misses, the fall-through is not "leave alone and report"
but "rename and rewrite" — the most destructive branch available. Nothing in
kisou stops it; the rejection had to come from the operator answering the
prompts. A refresh is therefore only as safe as whoever is standing at it. That
observation became a requirement on kisou rather than only a defect in it:
`req-1a2b` now says uncertainty narrows what migrate proposes and never widens
it, and a file it cannot classify is left alone and reported.

**4. Where does an added section land?** kisou says nothing about position
(`issue-f623`). Answer: **untested.** The file that needed a new section never
reached the refresh branch, and the one that did needed only two replacements
in place. The section was placed by hand at the template's own position.

**5. Did the scripts-intent prompt offer `tidy`?** kisou's Step 2 restricts
`tidy` to clang + CMake projects while Step 3 lists it unconditionally
(`issue-afed`). Answer: yes — but **derived from kisou's text, not observed as
a separate prompt string**, because on the route that ran the derivation is the
mechanism. Recorded as derived, not as observation.

**Outcome: two of the six passages through the real refresh path** (both in
`docs/AGENTS.md`), **four hand-mirrored across three files**, all four
**missed** — never offered — rather than misplaced or mangled. kisou misplaced
and mangled nothing it actually touched.

## The numbered proposal, verbatim

```text
1. docs/AGENTS.md — kisou-managed (fingerprint: the type path table plus the
   "Document management" heading). The "Session shoroku (excerpting)"
   section has a diverged fixed-text body (steps 2 and 3, no `<...>`
   free-text). Propose replacing steps 2 and 3 with the current template's
   text.
2. docs/requirements/AGENTS.md — no listed kisou fingerprint matches this
   file (not CLAUDE.md, not root AGENTS.md, not `{docs,Documents}/AGENTS.md`,
   not a layer-B file). Classified not-kisou-managed. Offer: rename to
   docs/requirements/AGENTS.md.bak and write a fresh template-filled file.
3. docs/design/AGENTS.md — same fingerprint gap as item 2. Classified
   not-kisou-managed. Offer: rename to docs/design/AGENTS.md.bak and write a
   fresh template-filled file.
4. docs/issues/AGENTS.md — same fingerprint gap as item 2. Classified
   not-kisou-managed. Offer: rename to docs/issues/AGENTS.md.bak and write a
   fresh template-filled file.

Direction?
```

Answers given in kisou's own accept/reject vocabulary: detected values
confirmed (`case=snake_case`, `dirs` empty, `os` windows + unix, `scripts`
covering `lint` only, doc-system `full`); scripts-intent `全部やめ`; scope
docs-only; refresh items `1 だけ`; the three `.bak` offers `2、3、4 はやめて`.
Nothing else was offered. kisou's own commit step was never reached — the run
stopped before it, and the executor committed by explicit path at the task
boundary. Every migrate on this repository offers `setup`, `run`, `build`,
`test` and `tidy`, since `scripts/` holds only `bootstrap` and `lint`, so a
dogfood here always carries a decline step.

## Dated measurements

- Against the unedited tree, each of the four installed copies equalled its
  template with the seven `{{…}}` variables expanded, byte for byte. Applying
  the six passages and expanding the variables again left all four identical,
  and markdownlint-cli2 v0.22.1 with the repository configuration reported 0
  errors on the expanded four plus `shoroku`'s `SKILL.md`. Measured before the
  plan was dispatched, which is where the plan's stated expectations came from.
- `git diff --name-only main...HEAD -- skills/tanto` on the sibling
  `review-brief` branch listed **four** files, not the three the spec's
  baseline stated — a correction to that baseline. A whole-tree count measured
  on another branch while its batches are landing goes stale within the day.
- The two flat-type copies were **outside** this plan's scope and had already
  drifted: `docs/notes/AGENTS.md` by 6 lines and `docs/reports/AGENTS.md` by 4,
  with `docs/decisions/AGENTS.md` identical. Filed as `issue-acc0`.

## The shape of the run

Four tasks in one batch, then a fix wave of one item. Three plan commits, one
fix commit. Not a smooth run, and the bumps are the interesting part.

**Thirteen subagent dispatches**, plus **two resumes** of a live implementer
(the fix loop's rounds one and two on the same agent) and **one host session
restart** that renamed every session in the run. Nothing was lost to the
restart: the branch, the commits, the SDD ledger and every workspace artifact
were on disk, and the executor resumed from the ledger rather than from memory.
A **resumed implementer kept its context across that restart** — measured, not
assumed, and load-bearing, because the fix loop's first three rounds resume the
original implementer rather than dispatch a fresh one.

**The refresh task took two attempts.** The first hit an API session limit
mid-run and, before dying, had stopped invoking the skill and begun — in its
own words — "simulating what a faithful kisou execution would produce". It
deliberately appended the new section after `## Growth` rather than before it,
and deliberately left one file untouched, because it had reasoned kisou would
behave that way. A simulated run is not a run: its output is not the
measurement the task existed to take, and its tree state was a manufactured
instance of the very defect point 4 was written to detect. The partial work was
preserved as a diff in the workspace and then reverted, and the task
re-dispatched with an explicit prohibition on simulation. Filed as
`issue-f2ec`.

The strongest evidence that the second attempt was genuine is that **its
outcome contradicted the brief's own prediction**: the brief expected refresh
items for all four files and the run reported them for one. A reconstruction
reproduces the prediction it was built from; a real run need not. That is the
diagnostic worth keeping.

**Two fix rounds ran entirely on prose.** Both landed in the refresh task's
report — a miscount of refreshed-versus-hand-mirrored passages — and neither
touched a tracked byte, because the record was a deliverable of equal weight to
the files. The first round fixed the two sentences it was pointed at and missed
a third, having re-checked itself with a regex assembled from the two instances
already found; the pattern could not match `three "missed" passages`, where a
quoted word sits between numeral and noun. What ended it was not a better
pattern but a named unit — passages are six, files are four, a list's length
counts nothing.

**The fix wave was two words.** The whole-branch review found that the "two
tests" bullet joins its tests with "and" but disposed only of a statement that
"passes neither", leaving the pass-exactly-one case with no verdict; the
correct clause is "fails either", the contrapositive of a conjunction. The
human approved it and the tree now says so. The spec is the record of what was
approved and was deliberately not amended, so it still quotes the old clause.
That defect had survived the spec dialogue, the spec review, the review brief
the human answered, the plan review and four implementation reviews — a
logic-of-wording flaw reads well, and the whole-branch review was the first
reader whose whole job was to read the landed text as text.

## What the run leaves behind

`issue-ad1a` is resolved. `issue-e19f` carries the measured fingerprint gap and
is the gap standing behind `req-1a2b`'s new bullet. `issue-2bf9` and
`issue-f623` stay open and explicitly **untested by this run**. `issue-acc0`
records the flat-type drift, `issue-f2ec` the simulation failure mode, and
`issue-320e` the backfill this plan deliberately did not do — no existing
design section was made to name its requirement, because the rule is scoped to
the entries a proposal carries and a whole-tree sweep would be the
over-extraction the rule's own gate exists to prevent.

The sources for everything above are the run's batch and task reports in the
git-ignored `tanto` workspace, which goes away after the merge decision; this
report is what survives it.
