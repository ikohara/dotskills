# The shoroku-at-close dogfood

The `shoroku-at-close` run consolidates every topic's shoroku human-check to
one, at T2, and splits the `shoroku` kind into `shoroku.recommend` and
`shoroku.apply`. This report is written mid-batch D, before the plan's own
close — the close is the first real run of the text this plan writes, so its
own figures are not yet on disk. What follows is the three measurements the
plan's own spec calls for, each read from a ledger file rather than from
recollection, plus the issues this batch closes and the readings the plan
asks this report to carry.

## The three measurements

### 1. Exits form-checked with no recommender run

Three topics ran under the same interim rule (Kikaku decision
`2026-09-14-shoroku-at-close.md`, adopted under contract rule 11's authority
before the skill text itself said so): a Sekkei's or Keikaku's exit proposal
is form-checked directly and the seat deleted, with its items copied straight
to pending `S-n` rows and no recommender dispatched — the recommend/check
pass waits for that topic's own T2. Counting every session across the whole
run, not only this text's own topic:

| Topic | Role | Items | `S-n` range | Ruling | Source |
| --- | --- | --- | --- | --- | --- |
| `shoroku-at-close` | Sekkei | 8 | S-1..S-8 | R-3 | `.tanto/shoroku-at-close/kanri.md` |
| `shoroku-at-close` | Keikaku | 5 | S-9..S-13 | R-3 | `.tanto/shoroku-at-close/kanri.md` |
| `tanto-sweep-2` | Keikaku | 6 | S-12..S-17 | R-4 | `.tanto/tanto-sweep-2/kanri.md` |
| `tanto-project-config` | Sekkei | 10 | S-8..S-17 | R-4 | `.tanto/tanto-project-config/kanri.md` |
| `tanto-project-config` | Keikaku | 4 | S-18..S-21 | R-4 | `.tanto/tanto-project-config/kanri.md` |

**Five sessions, 33 items, across two Sekkei exits and three Keikaku exits.**
One exit is deliberately excluded: `tanto-sweep-2`'s own Sekkei exit did get a
normal recommender dispatch (`opus`, the retired unsplit `tanto-shoroku` kind,
`.tanto/tanto-sweep-2/exit-sekkei-recommendation.md`) — its ledger's own R-4
names only that topic's Keikaku as governed by the interim rule, since the
Sekkei exit had already happened before the Kikaku decision arrived that same
day. Read from each ledger's own Rulings (R-3 in `shoroku-at-close`'s case,
R-4 in the other two) and each one's Session events lines recording the
`spec accepted:`/`plan committed:`/`coldread answered:` boundary and the
"no recommender dispatch" sentence beside it.

### 2. The close's one recommend

```console
$ ls -1 .tanto/shoroku-at-close/t2-*.md 2>/dev/null | head -n 1
```

printed nothing — confirming Step 1's expectation. No `t2-recommendation.md`,
`t2-brief.md`, or `t2-direction.md` exists yet. Per the conductor ledger's own
R-17, the live Kanri (`dotskills-31`) and the live Hosa (`dotskills-ed`) both
started before Batch D and so cannot dispatch the close's
`shoroku.recommend`/`shoroku.apply` — that dispatch waits for a fresh
`/tanto` start after Batch D lands.

**This measurement is deferred.** The number of sources the close's dispatch
names, the number of items its recommendation quotes, and the subagent's own
token count all land in `.tanto/shoroku-at-close/kanri.md`'s Measurements
table once the close actually runs — not in this frozen report.

### 3. The human's shoroku checks, and the Hosa delegation

`.tanto/shoroku-at-close/kanri.md`'s Session events record no `close:` line
and no human check on a shoroku recommendation for this topic yet — every
exit this topic has run so far went through measurement 1's no-recommender
rule, which carries no human check either. **This topic's own shoroku-check
count stands at 0, expected 1 once the close runs.** Whether the close is
delegated to a Hosa, and if so the time from Kanri's `close:` line to the
Hosa's handover file, is part of the same not-yet-run event and is deferred
alongside measurement 2, to the same ledger's Measurements table.

Neither `tanto-sweep-2`'s nor `tanto-project-config`'s own close had a
`close:` line or a Hosa delegation — this plan's own design is what
introduces both — so there is no prior figure of the same shape. The closest
analogous interval, read from each ledger's own Session events, turns out to
have a different shape in each case:

- **`tanto-sweep-2`** — its final batch (E, tasks 13-14, "All 14 tasks of the
  plan are complete") was accepted and Kanri's own ceiling crossed at that
  same boundary in the same session turn; the only thing between the
  acceptance and **handover written** was that Kanri's own exit-shoroku apply
  commit. The interval is effectively zero — the acceptance and the handover
  file landed in the same turn, no intervening dispatch.
- **`tanto-project-config`** — its final batch (B, tasks 5-8) was accepted
  and the same Kanri session carried straight through the whole-branch
  review, T2's recommend/check/apply, and the merge to `main` — no Kanri
  handover was ever written after that final batch's acceptance. There is no
  interval to measure here at all; the shape is "no handover in the loop,"
  not "a short one."

Neither is a like-for-like prior figure for a delegated close. This run's own
delegated-close time, once the close actually runs, is recorded beside these
two as the first measurement of the shape this plan's own design creates —
for a later topic's close to compare against for real.

## Issues closed

**issue-19d4** (`a Sekkei or Keikaku idles until Kanri sends exit: it should
write its exit proposal unasked, as the last act of its final boundary`)
closes. This plan's own Task 10 whole-tree sweep found no site still waiting
on an `exit:` line at a Sekkei's or Keikaku's own final boundary — every site
the issue named (`SKILL.md`'s "Session exit", the `spec accepted:`/
`plan committed:` report lines in `roles/sekkei.md` and `roles/keikaku.md`,
and `roles/kanri.md`'s Delete table rows and Exit shoroku section) now has
the seat write its own exit proposal unasked. The file moves from
`docs/issues/open/` to `docs/issues/resolved/` (`git mv`, per
`docs/issues/AGENTS.md`'s status-by-directory convention), `updated:` bumped,
and a resolution paragraph appended naming Task 10's sweep as the resolution
— no body rewrite.

**issue-52fd** (`the apply half of shoroku on sonnet, the second
measurement's first variable`) stays **open**. Its subject is re-pointed:
this plan's own split of the `shoroku` kind into `shoroku.recommend` and
`shoroku.apply` means "the apply half" the issue already discusses now has an
exact kind name, so a dated append notes that the issue's own proposed
variable change reads, from here on, as "`shoroku.apply` to `sonnet`, with
`shoroku.recommend` on `opus`" — not changed now, for the reason already on
file: the first measured run under decision-03f9's second-measurement order
has to land before this variable is worth changing. This task files nothing
new under `docs/issues/`; only these two existing files are touched.

## The readings

**Each batch boundary's `context=` figure**, from
`.tanto/shoroku-at-close/kanri.md`'s own Measurements table:

| Boundary | Reading |
| --- | --- |
| Opening (2026-09-15) | Kanri `context=179645` |
| Batch A (2026-09-17) | Kanri `context=420475` (over 210713, present); Jisso `context=296542` (over 210523, present) |
| Handover acceptance (2026-09-17) | Kanri (successor `dotskills-ff`) `context=126737`, fresh post-handover baseline |
| Batch C (2026-09-17) | Kanri (`dotskills-26`) `context=342377` (over 213704, present at 59 min); Jisso (`dotskills-99`) `context=282349` (over 213715, present) |

The Measurements table itself carries no Batch B row — the batch B boundary
readings (Jisso `context=343993` vs. `213973`; Kanri `context=287248` vs.
`212593`, both present) exist only in the ledger's Rulings (R-15), not in its
Measurements table. This report follows the brief's own instruction to pull
from the Measurements table specifically, so that gap is named here rather
than filled from a different section.

**The top-family (`fable`/`opus`) one-shot dispatch tally**, from the same
ledger's Session events lines that name a dispatch's family explicitly:

| Kind | Family | Count |
| --- | --- | --- |
| `spec.review` | opus | 1 |
| `plan.review` | fable | 1 |
| `plan.coldread` | fable | 1 |

Three explicitly-tagged top-family one-shot dispatches. `brief.write` was
also dispatched twice in this topic (once for the spec stage, once
re-dispatched after `plan.review`'s findings changed the plan materially),
but this ledger never writes its family in the `dispatch: <kind> on <family>`
form either time — the same gap `tanto-project-config`'s own dogfood report
already named (issue-b673) — so it is excluded from the tally rather than
guessed at.

This is itself the run ADR 2 (this plan's own spec) rests its data point on:
the close's recommend half runs on the top family (`spec.review`,
`plan.review`, `plan.coldread` all opus or fable) while the apply-shaped work
— every task implementation, every exit-shoroku apply — runs on `sonnet`. The
recommend half and the apply half are not symmetric in this run, which is
exactly the asymmetry issue-52fd's own second-measurement variable is about.

## What this report does not cover, and why

**The close itself.** This plan's own close — the one recommend, the one
human check, the one apply, and whether Kanri delegates it to a Hosa — had
not run when this report was written; Step 1 confirmed no `t2-*.md` file
exists yet, and R-17 explains why (the live Kanri and Hosa both started
before Batch D and cannot dispatch the close's `shoroku.recommend`/
`shoroku.apply` until a fresh `/tanto` start happens after this batch lands).
`docs/reports/` is frozen once written, so those figures belong in the
conductor ledger's own Measurements table when the close actually produces
them, not in a number guessed at here and never revisited.

One more thing to flag for whoever runs the close: the spec's own Shoroku
candidate 10 (section 8.3) says "check 22," but real `main`'s checks 22 and
23 landed after this plan's own review, and this plan's own new check
renumbered to 24 at release — the close's recommender quotes the spec
verbatim, so it will write "check 22" for that candidate; correcting it to 24
is the human's own check on the brief, or Kanri's own read of the
recommendation, not a plan defect and not this task's to fix in the spec.
