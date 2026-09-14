# tanto-context-ceiling dogfood — what the run that landed the ceiling measured about itself

The `tanto-context-ceiling` plan gave Kanri and Jisso a derived context
ceiling, a presence-gated handover/replacement trigger, the harness's
auto-compact window as a backstop, and a fifth reading figure
(`context=<n>`). This report is that plan's own dogfood task (task 17,
spec 5.2), written mid-batch E, before batch E's own boundary and before the
plan's actual close — both later events this task cannot wait for. Its
numbers come from `.tanto/tanto-context-ceiling/kanri.md`'s Measurements
table (filled by Kanri from batch A on, backfilled retroactively per ruling
R-32) and from a `--share` run made as this report is written, not from a
fresh close-time measurement.

## 1. Per-batch consumption, through batch D

This run's own Kanri and Jisso predate the ceiling instrument: they took the
four-figure reading, and the ceiling rule did not bind them (Global
Constraints). The two rows before batch A are recorded as `absent` rather
than guessed, per that same acceptance — the instrument (and the reading
that would have produced a `context=` figure) did not exist yet at the
topic's opening or at the plan's landing.

| Boundary | Kanri `context=` | Kanri delta | Jisso `context=` | Jisso delta |
| --- | --- | --- | --- | --- |
| Topic opening | absent | — | n/a (Jisso not yet created) | — |
| Plan landing | absent | — | n/a (Jisso not yet created) | — |
| Batch A | 281231 | seat-change baseline — this Kanri's handover was accepted before batch A, so no delta per the seat-change rule | 396629 | +325942 (from baseline 70687) |
| Batch B | 317149 | +35918 | 463616 | +66987 |
| Batch C | 417089 | +99940 | 544618 | +81002 |
| Batch D | 543116 | +126027 | 598092 | +53474 |

Batch E's own row is **not** in this table. It is recorded only in the
ledger's Measurements table, at batch E's boundary, after this report has
already committed.

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
$ TANTO=skills/tanto && node "$TANTO/scripts/reading.js" --share "C:\Users\0000105523\.claude\projects\c--Users-0000105523-devel-dotskills\f4714da9-6217-4044-84e6-8fecaf4b0615.jsonl" "C:\Users\0000105523\.claude-priv\projects\c--Users-0000105523-devel-dotskills\5d313f8e-db0e-4635-b56e-4449c16195c2.jsonl" "C:\Users\0000105523\.claude-priv\projects\c--Users-0000105523-devel-dotskills\38bf08e0-d318-4e7e-9cf1-908a0e36bddc.jsonl" "C:\Users\0000105523\.claude-priv\projects\c--Users-0000105523-devel-dotskills\c405a7a9-5fe0-4eb9-bc50-49235f91a8f0.jsonl"

share: 97% of usage at context > 150000 over 4 transcripts (565528290 / 585359723 tokens)
```

All four named paths were read; none were skipped or reported unreadable by
the script. **97%** of this run's own usage sat above the 150,000-token
`share_threshold`, against **74%** — the Account & Usage figure the spec
names as the comparison point from an earlier day's Kikaku consultation (the
target the human set is 30% or less).

This is **Step 2's proxy, as of this task's own writing** — not the
plan-close figure spec 5.1 describes. The real close-time comparison
(this run's own transcripts at the actual close, alongside the Account &
Usage figure Kanri asks the human for at that close, per task 13's
Delete-table row) belongs in the ledger's Measurements table, not in this
frozen report. This section's 97% should not be read as that close-time
number.

## 4. The backstop line

**Absent**, for the same reason section 1's two Kanri-only rows are absent:
this run's own Kanri (`dotskills-00 [1575d1]`) accepted its handover and
began its tenure **before** task 7 — which added the backstop-quoting
passage to `roles/kanri.md`'s Start sequence — landed on this same plan's
branch. Its actual start line, as said, predates the feature that would
have printed a `backstop:` line, so none was printed, and none can be
truthfully reconstructed after the fact. This is a genuine "absent" case
per Global Constraints ("The run's own Kanri and Jisso... are not bound by
the ceiling rule until this plan lands"), not a gap in this task's own
search.

## 5. What the harness listed

The SDD ledger's own opening (`.superpowers/sdd/2026-09-14-tanto-context-ceiling/progress.md`,
"Global Constraints noted") records this run's own confirmation: "all twelve
`tanto-<object>-<act>` definitions exist and are visible to this run
(confirmed at Keikaku's start sequence, 12/0/0, and independently at this
Jisso's own start, 12/0/0 — see the handshake)". That is, both Keikaku and
this Jisso reported **12 current, 0 written, 0 not visible to this
session** at their own starts.

No equivalent figure for Sekkei's or the current Kanri's own start sequence
was found recorded anywhere in the conductor ledger, the SDD ledger, or the
roster for this topic — those two roles' own twelve-definitions counts are
**not available** from this run's written record, and are reported here as
unavailable rather than assumed to match Keikaku's and Jisso's.

## Recommendation: a T2 candidate

Section 1's two mean deltas are a T2 shoroku candidate:
`skills/tanto/templates/tanto.json`'s `ceiling.kanri.per_batch` (currently
65000) and `ceiling.jisso.per_batch` (currently 65000, Jisso's value
defaulted from Kanri's for want of a Jisso measurement until this run) are
corrected to this run's measured mean deltas, rounded to the nearest 5000:

- `ceiling.kanri.per_batch`: 87,295 → **85,000**
- `ceiling.jisso.per_batch`: 131,851 → **130,000**

This is named here for T2, not applied by this task, and would land in a
future commit by explicit path against `templates/tanto.json` alone.

## Notes on the shared tree

No modification was found in the shared tree during this task's work beyond
what this task itself made. The ongoing `docs/issues/`, `docs/decisions/`,
`docs/requirements/`, and `docs/notes/` churn from other concurrent sessions
noted in the conductor ledger (R-22 and its siblings) is already known and
not re-flagged here.
