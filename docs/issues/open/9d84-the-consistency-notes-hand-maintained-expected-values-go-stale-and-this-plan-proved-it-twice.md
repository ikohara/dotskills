---
id: "9d84"
title: "the consistency note's hand-maintained expected values go stale silently, and this plan's own batches proved it twice in one boundary"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-17
---

Found by the tanto-cost run's batch F (2026-09-14), recorded in
`.tanto/tanto-cost/batch-F-report.md`, "Two divergences task 22 found that
nobody had seen" and "Shoroku candidates" (landed as written under R-30's
resolution; not fixable inside this plan).

`docs/notes/tanto-consistency-checks.md` states each check's expected
output as literal numbers or strings, hand-maintained by whoever last
touched the check. Two instances of the same failure mode surfaced within
this single plan's own run, one caused by an earlier batch of the plan and
missed by a later one:

- **Check 6's stated values are wrong at three of its 32 positions**
  (positions 9, 10, and 19 of the one-number-per-line list P21.7 lands).
  Landed exactly as the plan states, per R-30's resolution — task 21
  forbids editing a check to make it pass, and the divergence is the
  finding.
- **`Direction?`'s stated count is `1` where `skills/shoroku/SKILL.md` now
  reads `4`.** Task 20 (this same plan, three commits earlier) added three
  more occurrences inside the section it wrote; task 21 rewrote the
  consistency note in the **very next commit** and did not carry the
  count forward, even though both commits belong to the plan whose own
  task 21 explicitly measures every value "against `tanto-cost` before the
  plan was written." The gap is temporal, not conceptual: task 21's
  passage was authored before task 20 landed, and no step re-measured it
  after.

Neither is fixable inside the tanto-cost plan: both are in
`docs/notes/tanto-consistency-checks.md`, whose passage under task 21 has
already landed.

The general lesson, stated for whoever next maintains this note: a check
whose expected value is typed by hand has no way to notice the tree
changing under it, and a plan that both changes the tree **and** updates
the note in the same run needs the note's own values re-measured *after*
every task that could move them — not only once, at drafting time. Where
a check's subject is cheap to compute (a `grep -c`, a line count), deriving
the expected value from the tree at doc-generation time, rather than
typing a number, would close this class of drift for good.

Related: R-30 (the ten-form check, the same run's largest instance of this
pattern), issue-e18b, issue-2e19, issue-a5e9 (the same "a hand-maintained
count or list drifts from the tree" shape at other sites this run found).

**2026-09-14, the whole-branch review — the open question this issue
leaves.** The review corroborated R-30 and sharpened it into a decision
nobody has made yet: the ten-form check's five forms that live only in
role files (`chore:`, both `slot:` forms, `spec accepted:`) could be
**added** to `SKILL.md`'s `## Messages` register — where every other
cross-role line form already lives, including `paused:`, `continue:`,
`exit proposal:`, `human-needed:`, `review-ready:`, `bug-report:`, and all
five `triage:` forms — instead of correcting the check's file list to
point at the role files that actually carry them. Kanri's own resolution
(R-30) is to correct the check, not the register: these five are
Hosa-specific or Sekkei-specific protocol detail, not contract-wide
vocabulary the way the existing `## Messages` register's entries are,
and moving them to `SKILL.md` would state role-specific mechanics in the
one file meant to hold only what every role shares. A future plan that
touches this check should settle this explicitly rather than assume
either answer.

**2026-09-14, the `tanto-context-ceiling` run — measured evidence, and one
deferred addition.** Three findings from that run's batches and its T2, all
about check 6 and all of this issue's kind:

- **Four of check 6's strings never existed in `SKILL.md` at all**, before
  this plan or after it: `chore: <one line>`, both `slot:` forms, and
  `slot-needed:`. Measured at the branch's base commit and at its tip — zero
  occurrences at both — so these are not a count that drifted, they are a file
  list that was wrong when written. This is the evidence the open question
  above lacked: the choice is not between a stale count and a fresh one, it is
  between correcting the check's file list to the role files that actually
  carry these forms and adding the forms to `SKILL.md`'s `## Messages`
  register.
- **The loop's own "ten end `-> 1`" framing is stale independently of any
  plan.** Measured the same way: `decision: <path>` reads `2` at both the base
  and the tip, not `1`, and there are **5** pre-existing zero-count strings,
  not 4. The prose that frames the loop is therefore wrong about the shape of
  its own expectations, not only about individual numbers — which is a harder
  failure to notice than a single stale count, since nothing in the loop's
  output contradicts the framing.
- **A deferred addition to check 6: a `grep -cF` pin for the batch-D carrier
  line.** That run's batch D proved the line `coldread answered: <pointer, one
  per question, or none>; exit proposal: <path> — <reading>` byte-identical
  across `SKILL.md`, `roles/keikaku.md` and `roles/kanri.md` — a cross-file
  contract that no standing check guards once that run's own stop condition is
  history. A pin beside the Residency-header pins was drafted and deliberately
  skipped in the fix wave, because adding a position to check 6 renumbers
  every position after it and the run had live expectations keyed to those
  numbers. **Trigger: whenever check 6 is next safely renumbered.**

**2026-09-16, the `tanto-sweep-2` run — the third instance, and the first at
spec time.** The note's own four-site rule — "a plan that adds a template edits
four of them: this bullet, check 1's path list and expected count, check 2's
expected count, and check 3's map" — was missed by a **second spec in a row**.
It was caught only during that plan's own drafting, after the spec had already
been written and reviewed; nothing between the spec's authoring and the
drafter's read re-measures the counts a new file under `skills/` moves. The
two earlier instances above are both batch-time; this one shows the same gap
reaching one stage further upstream, where the cost of missing it is larger
because every downstream task inherits the wrong values.

The candidate fix that run named: a Keikaku drafting convention — a plan that
creates a file under `skills/` lists, in its own text, the structural counts
the new file moves, so the drafter's list and the note's four sites are
checked against each other rather than each trusted separately.

**2026-09-17 — four stale checks measured, all of them pre-dating the branch
that found them.** `shoroku-at-close`'s Task 10 swept the note and confirmed,
against `main`, that checks 3, 4, 6 and 7 carry stale expected values that
pre-date that topic entirely and are not its responsibility:

- **Check 3** — the `templates/agent.md` citation premise has apparently never
  been true in any role file's history; issue-c526 holds that premise.
- **Check 4** — the `Direction?` count in `skills/shoroku/SKILL.md` reads `4`
  where the note still says `1`.
- **Check 6** — the `chore:` / `slot:` line-forms block reads `0` across the
  whole skill, a past rename or removal never reflected in the note, and two
  single-line counts drifted (`exit-<role>` 5 to 4, `the human by grant` 3 to
  4).
- **Check 7** — the `argument-hint` line is missing the `resume` alias
  entirely, possibly folded into `fukki` and possibly dropped outright;
  issue-260c's own history might settle it.

Recording rather than fixing is what that task's own Done-when asked for. The
measured figures above are the input to what resolves this issue: a dedicated
cleanup task or small plan against the note itself, never a fold-in to some
later plan's unrelated scope.
