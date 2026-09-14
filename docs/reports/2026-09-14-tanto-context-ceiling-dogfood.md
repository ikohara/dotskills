# tanto-context-ceiling dogfood — what the run that landed the ceiling measured about itself

The `tanto-context-ceiling` plan gave Kanri and Jisso a derived context
ceiling, a presence-gated handover/replacement trigger, the harness's
auto-compact window as a backstop, and a fifth reading figure
(`context=<n>`). This report is that plan's own dogfood task (task 17,
spec 5.2), written mid-batch E, before batch E's own boundary and before the
plan's actual close — both later events this task cannot wait for. Its
numbers come from `.tanto/tanto-context-ceiling/kanri.md`'s Measurements
table — a **retroactive reconstruction**, not readings taken live at the
time of each boundary (see section 1's own note and R-32) — and from a
`--share` run made as this report is written, not from a fresh close-time
measurement.

## 1. Per-batch consumption, through batch D

This run's own Kanri and Jisso predate the ceiling instrument: they took the
four-figure reading, and the ceiling rule did not bind them (Global
Constraints). The two rows before batch A are recorded as `absent` rather
than guessed, per that same acceptance — the instrument (and the reading
that would have produced a `context=` figure) did not exist yet at the
topic's opening or at the plan's landing.

**None of the batch A-D rows below is a reading taken live, at the time of
its own boundary.** Per R-32, the batch loop's own instruction to record
this row — take Kanri's `reading.js --role kanri` reading and Jisso's
ceiling line from its report header, at every boundary — landed
progressively *during* batches A-C themselves (via task 7 and task 10), so
it was never actually run at the time of batch A's, B's, or C's own
boundary; contract Rule 11 makes it binding retroactively regardless, and
batch D's own boundary predates the discovery too. Kanri reconstructed all
four rows after the fact, while preparing batch E, by proxying each
transcript's nearest assistant-record `usage` against the batch-prompt
(Kanri) or batch-report (Jisso) file's mtime — a close proxy per R-32's own
words, with R-32's own stated accuracy caveats, not a live reading.

| Boundary | Kanri `context=` | Kanri delta | Jisso `context=` | Jisso delta |
| --- | --- | --- | --- | --- |
| Baseline | 70675 | — | 70687 | — |
| Topic opening | absent | — | n/a (Jisso not yet created) | — |
| Plan landing | absent | — | n/a (Jisso not yet created) | — |
| Batch A | 281231 | seat-change baseline — this Kanri's handover was accepted before batch A, so no delta per the seat-change rule | 396629 | +325942 (delta from baseline) |
| Batch B | 317149 | +35918 | 463616 | +66987 |
| Batch C | 417089 | +99940 | 544618 | +81002 |
| Batch D | 543116 | +126027 | 598092 | +53474 |

Batch E's own row is **not** in this table. It is recorded only in the
ledger's Measurements table, at batch E's boundary, after this report has
already committed.

**The instrument's real operational history is worse than a clean
per-boundary table suggests, and this report should say so plainly rather
than let the table imply otherwise.** Spec 5.2 item 1 specifies the Jisso
column as "Jisso's `context=` from its report" — but R-32 also records that
Jisso's own batch reports, all four of them (A through D), never carried
the template's "Ceiling" header line at all: task 6 added that slot to
`templates/batch-report.md`, but Jisso generated each of its four reports
without re-reading the template fresh that batch, so the slot stayed blank
throughout the entire run. Combined with the point above, this means: the
ceiling/context instrument this plan built was **never exercised live, in
real time, at any of the four boundaries this dogfood measures** — every
per-boundary figure in this table and in section 2 is the retroactive
reconstruction described above, not the instrument's own real-time output.
Whether the instrument works when actually run in the moment, batch by
batch, remains to be seen at batch E and beyond.

**Mean delta, same-seat rows only:**

- Kanri: batch A excluded (seat-change baseline, no delta). Mean over B, C, D
  = (35918 + 99940 + 126027) / 3 = **87,295**.
- Jisso: no seat change across A-D, all four deltas count. Mean over A, B, C,
  D = (325942 + 66987 + 81002 + 53474) / 4 = **131,851** (131851.25,
  truncated).
- **Spec-and-plan-stage growth** (topic opening → plan landing, for Kanri):
  **absent** — both readings it would be computed from are themselves
  `absent`, for the same predates-the-instrument reason (Global Constraints).
  It is not a gap in this report; it is a gap the instrument itself could not
  close for this run.

## 2. The ceiling as it ran, through this point

- **Kanri's ceiling**, first computed against baseline 70675:
  `70675 + 2×65000 = 200675`.
- **Jisso's ceiling**, first computed against baseline 70687:
  `70687 + 2×65000 = 200687`.
- **Every boundary's verdict, batches A-D**: both seats read `over` at every
  one of the four boundaries (A, B, C, D), per R-32's reconstruction.
- **Presence verdicts**: one taken, at the live check made just after the
  Measurements-table backfill (not a batch boundary — no batch has been
  accepted since D): `reading.js --role kanri --presence --backstop` →
  `context=561176` (`over`), human present (40 minutes), backstop reading
  above the ceiling.
- **Deferrals**: **none**. Neither seat deferred, because the ceiling
  verdict never bound this run to begin with (Rule 11 — both seats predate
  the ceiling instrument that this plan's own batches A-D are in the
  process of landing).
- **Handover/replacement boundary**: this Kanri's handover from its
  predecessor was accepted **mid-topic, before batch A was dispatched** —
  not at a plan boundary this instrument governs. No further handover or
  replacement of either seat has run through batch D. Per R-27, the
  boundary this plan itself names for a role replacement is batch E; no
  role of this topic is replaced before then except by the two standing
  exceptions (Kanri's own handover; a Kaiseki by Kanri's ruling), and the
  one handover that did happen used the first exception.

## 3. The share, as of this report

Command run exactly as specified, over all four transcripts the roster
names for this topic (Sekkei, Keikaku, Jisso, and the current Kanri
`dotskills-00 [1575d1]` only — its predecessor `dotskills-3b` is out of
scope for this run's own snapshot):

```console
$ TANTO=skills/tanto && node "$TANTO/scripts/reading.js" --share <Sekkei's transcript, dotskills-46 [5d01aa]> <Keikaku's transcript, dotskills-65 [9613c4]> <Jisso's own transcript, dotskills-d5 [9771ef]> <Kanri's transcript, dotskills-00 [1575d1]>

share: 97% of usage at context > 150000 over 4 transcripts (565528290 / 585359723 tokens)
```

All four named paths were read; none were skipped or reported unreadable by
the script. **97%** of this run's own usage sat above the 150,000-token
`share_threshold`, against **74%** — the spec's own named comparison
figure, which is **this same day's** (2026-09-14) Account & Usage reading
from the Kikaku consultation, not an earlier day's; the spec separately
cites 89% from 2026-09-09 (issue-40ed) as the earlier day's figure. The
target the human set is 30% or less.

This is **Step 2's proxy, as of this task's own writing** — not the
plan-close figure spec 5.1 describes. The real close-time comparison
(this run's own transcripts at the actual close, alongside the Account &
Usage figure Kanri asks the human for at that close, per task 13's
Delete-table row) belongs in the ledger's Measurements table, not in this
frozen report. This section's 97% should not be read as that close-time
number.

## 4. The backstop line

**The line itself, and its verdict, are absent**, for the same reason
section 1's two Kanri-only rows are absent: this run's own Kanri
(`dotskills-00 [1575d1]`) accepted its handover and began its tenure
**before** task 7 — which added the backstop-quoting passage to
`roles/kanri.md`'s Start sequence — landed on this same plan's branch. Its
actual start line, as said, predates the feature that would have printed a
`backstop:` line, so none was printed, and none can be truthfully
reconstructed after the fact. This is a genuine "absent" case per Global
Constraints ("The run's own Kanri and Jisso... are not bound by the ceiling
rule until this plan lands"), not a gap in this task's own search.

**The third question — whether the human changed the window after the
recommendation — is answerable, from data already in this report.** Every
backstop reading this run has actually taken read the harness's
auto-compact window at its `(default)` source, never `env` or `settings`:
task 3's own smoke test (batch A, run against Jisso's transcript) printed
`backstop: autoCompactWindow=967000 (default) — above ceiling 200687`, and
section 2's live check at the Measurements-table backfill likewise read
`above` the ceiling. A skill recommendation to lower the window is only
ever produced on a `below` verdict (`roles/kanri.md`'s Start sequence); no
`below` verdict has fired at any point this run has actually checked, so no
recommendation was ever made for the human to act on — and consequently
nothing for the human to have changed. This is not a further "absent":
it is a "no" answered from evidence, not a gap.

## 5. What the harness listed

The SDD ledger's own opening (`.superpowers/sdd/2026-09-14-tanto-context-ceiling/progress.md`,
"Global Constraints noted") records this run's own confirmation: "all twelve
`tanto-<object>-<act>` definitions exist and are visible to this run
(confirmed at Keikaku's start sequence, 12/0/0, and independently at this
Jisso's own start, 12/0/0 — see the handshake)". That is, both Keikaku and
this Jisso reported **12 current, 0 written, 0 not visible to this
session** at their own starts.

**Sekkei is a known negative, not an unknown.** Its own exit shoroku
proposal states plainly (`.tanto/tanto-context-ceiling/exit-sekkei-proposal.md`,
item 2): its recommender dispatches "were dispatched with `model` alone,
since the `tanto-*` definitions were not visible to this session after the
config-directory move" — i.e. that session did **not** see the twelve
`tanto-*` definitions (0 visible, not 12), and that absence is exactly why
its two one-shots ran on `model` alone with no `subagent_type`. This is
corroborated by the conductor ledger's own R-9 (this same config-directory
symptom, hit firsthand "during Sekkei's exit shoroku dispatch"). R-21
records the same class of harness agent-type staleness, reported from
another session.

For the two Kanri seats — the predecessor (`dotskills-3b`, itself continued
from `dotskills-2d`/`dotskills-0b`) and the current (`dotskills-00
[1575d1]`) — no figure and no negative finding of Sekkei's kind was found
recorded anywhere in the conductor ledger, the SDD ledger, or the roster for
this topic, after checking specifically for one. The predecessor Kanri did
live through a related event (a profile switch mid-tenure, resolved by a
junction linking the new profile's static config back to the original, per
the roster's own Events), but nothing in its record states whether its own
start sequence's twelve-definitions check came back 12/0/0, came back
negative like Sekkei's, or was never printed at all. Those two roles' own
twelve-definitions counts are genuinely **not available** from this run's
written record — reported as unavailable because the record is silent, not
inferred to match either Keikaku's/Jisso's positive count or Sekkei's known
negative.

## Recommendation: a T2 candidate

Section 1's two mean deltas are a T2 shoroku candidate:
`skills/tanto/templates/tanto.json`'s `ceiling.kanri.per_batch` (currently
65000) and `ceiling.jisso.per_batch` (currently 65000, Jisso's value
defaulted from Kanri's for want of a Jisso measurement until this run) are
corrected to this run's measured mean deltas, rounded to the nearest 5000:

- `ceiling.kanri.per_batch`: 87,295 → **85,000**
- `ceiling.jisso.per_batch`: 131,851 → **130,000**

**What Jisso's mean is built from, so its size against Kanri's is not
misread**: Jisso's 131,851 is dominated by batch A's own delta of
+325,942 — the baseline-to-first-boundary figure, which folds in the
whole session's initial load (reading the plan and the spec whole,
dispatching three tasks) rather than one batch's steady-state cost alone.
Batches B-D alone average (66,987 + 81,002 + 53,474) / 3 = **67,154**, well
under the recommended 130,000 and much closer to Kanri's own 87,295. The
seat-change rule correctly admits batch A into Jisso's mean (no seat change
happened for Jisso across A-D, unlike Kanri's excluded batch-A row), so the
131,851 figure and the rounded 130,000 recommendation both stand as
computed — but a reader should know the number is pulled up by one
session's start-up cost, not by four batches of uniformly heavy load.

This is named here for T2, not applied by this task, and would land in a
future commit by explicit path against `templates/tanto.json` alone.

## Notes on the shared tree

No modification was found in the shared tree during this task's work beyond
what this task itself made. The ongoing `docs/issues/`, `docs/decisions/`,
`docs/requirements/`, and `docs/notes/` churn from other concurrent sessions
noted in the conductor ledger (R-22 and its siblings) is already known and
not re-flagged here.
