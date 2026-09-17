---
id: "40ed"
title: a count threshold for the Kanri handover
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-07
updated: 2026-09-17
---

decision-de63 fires a Kanri handover on two signals only, the human's word
and a compaction the session notices. A count of batches or plans since the
Kanri's start would let the handover run before a compaction rather than
after one, but there is one data point so far (a Kanri that conducted a full
plan and started a second without a compaction), so no threshold was chosen.

The roster's Residency line records, per Kanri, the batches accepted, the
plans closed, and the compactions noticed, cumulative since that Kanri's
start. Once a few Kanri lifetimes are on record, choose a batch or plan count
that triggers a handover before a compaction, or decide none is needed.

The tokens-left figure the harness prints in its reminders was rejected as a
signal: its unit is not documented as the context window and its presence is
not guaranteed.

Two more data points, 2026-09-09. The kanri-lifecycle Kanri noticed its
compaction at 8 batches and 1 plan close on its second day, at 8.6 MB and
618 wake-ups of transcript. Its successor conducted the boundary-rules plan
and the review-brief spec phase — 4 batches, 2 plan closes, 1.7 days, 5.3 MB
and 394 wake-ups — with no compaction, and handed over on the human's word
for a reason the two signals do not name: cost. Each wake-up re-reads the
whole context, so a resident Kanri's per-turn cost grows with its age, and
the human feels it as the 5-hour usage window filling across the workspaces
that run tanto. A third candidate signal, then, beside the human's word and a
noticed compaction: a cost threshold on wake-ups times context size, readable
from the transcript (issue-e5a2's method), with a handover at the next plan
close once it is crossed — cheaper than waiting for the compaction it
predicts.

Two refinements from the review-brief run, both recorded in fuller form on
issue-e5a2. First, a threshold on wake-ups **alone** under-counts: the
Account & Usage view of 2026-09-09 attributes 89% of a day's usage to contexts
over 150k and only 23% to parallel sessions, so the charge scales with context
size and the candidate signal above — wake-ups times context size — is the
right shape rather than a wake-up count with a bigger number. Second, a
resident Kanri is not the only thing that can exhaust a session's budget: an
`opus` reviewer subagent was killed mid-review by a session limit during this
run, independently of the conductor's own wake-ups. A handover trigger read off
Kanri's transcript will not see that, so the cost threshold and the handover
threshold are not quite the same instrument.

A fourth residency data point, 2026-09-09: the successor Kanri (`dotskills-8c`)
closed one plan — 3 batches, 1 plan close, 0 compactions — in under a day, at
2.9 MB and 851 transcript records, and handed over at the plan close on the
human's word, so that the next plan starts on a short context. With the idle
subscriptions gone its wake-ups were on the order of thirty, a tenth of its
predecessor's, which puts the weight of the cost signal on context size — the
plan's cold read above all — rather than on the wake-up count.

The instrument, 2026-09-09. The context-cost design (its T1) delivers the
measurement and not the number: every session takes a **reading** of its own
transcript — bytes, records, wake-ups, compactions — at its boundaries and
sends it with the lines it already sends; the roster's Residency becomes a
table of those readings, and at each plan close the rows of dead, replaced,
and refused sessions move to an untracked `roster-archive.md` next to the
roster, whose rows across runs are the dataset this threshold is read from.
Because that archive is untracked and local, each plan's dogfood report under
`docs/reports/` carries the rows the archive gained, so the dataset survives a
workspace wipe. Two corrections to the figures above: a wake-up is a user
record **without** a tool result, so the 618 of the kanri-lifecycle Kanri is
84 wake-ups (the rest were tool results), and the 394 and 851 are record
counts of the same kind; the readings from here on use the corrected form.
This issue stays open, blocked on the data, until enough sessions have ended
for an ADR to choose the number — or to decide that none is needed. Whether
bytes and records are comparable across hosts stays open too; on one host the
sessions are compared with each other.

The handover half of this issue closed on 2026-09-10 without a number: the
human set the rule that Kanri hands over at every plan close, without a
threshold and without asking (req-04f5's residency bullet, reworded that day),
because the close is the cheapest moment to reset a resident session's
context and the question had been answered "yes" at every close so far. What
stays open here is the **replacement** half — the reading at which a peer's
growth, short of a compaction, should replace it — and the data for it. One
more Kanri data point for that: `dotskills-38` (the resumed `dotskills-e0`)
handed over at the context-cost close at `transcript: 5287752 B, 1979
records, 49 wake-ups, 0 compactions`, after five batches and two plans in
one day; of its 49 wake-ups about fifteen were the human's turns, twenty peer
lines, four idle notices from two Sekkei exits (issue-d725), and four subagent
completions. That session was also the first strong session here to hit the
usage-credit limit, at the T2 commit line.

A token measurement, 2026-09-14, and a correction to the figures above. Taken
from this repository's session transcripts under the user's personal Claude
Code config directory: every `assistant`
record carries a `usage` object, and the sum of its `input_tokens`,
`cache_creation_input_tokens` and `cache_read_input_tokens` is that turn's
context size in tokens — a direct instrument this issue's readings have not
used (they measure bytes and records; issue-e5a2 chose bytes, and the
`tokens left` reminder was rejected above for a different reason, that its
unit is undocumented). The instrument itself is kept in
`docs/notes/claude-code-sessions-observed.md`. Four sessions of the current
run, measured that day:

| session | model | first turn | peak | compactions |
| --- | --- | --- | --- | --- |
| previous Kanri `dotskills-2d` | claude-sonnet-5 | 77,265 | 949,985 | 0 |
| current Kanri `dotskills-0b` | claude-sonnet-5 | 82,818 | 129,403 | 0 |
| Hosa `dotskills-60` | claude-sonnet-5 | 82,824 | 92,958 | 0 |
| Kikaku `dotskills-6f` | claude-fable-5-1 | 72,014 | 122,011 | 0 |

The previous Kanri's context at the quartiles of its life was 374,704 /
569,791 / 770,049, and it never compacted — which is the replacement half of
this issue stated in tokens: nothing in the two signals would have fired
before 950k. Three figures fall out of the four rows. A tanto seat's fixed
load is 72 to 83k at its first turn, of which the skill's own text is roughly
15 to 27k (`SKILL.md` 47 KB, `kanri.md` 62 KB, the other role files 3 to
18 KB) and the rest is the harness's system prompt, tool definitions,
superpowers, `CLAUDE.md`, and memory. Kanri's per-batch consumption, from the
previous Kanri's ~870k of growth across the tanto-cost run's boundaries, is
roughly 60 to 70k per batch cycle — so a 150k ceiling buys about one batch per
Kanri life.

The correction: no Anthropic document names 150k as a quality threshold. The
closest is the engineering post "Effective context engineering for AI agents",
which describes recall degrading with context as "a performance gradient
rather than a hard cliff". The 150k figure is the Account & Usage view's cost
bucket, plus third-party "context rot" commentary — so the ">150k" share
quoted above (89% of a day's usage) is a **cost** attribution, not evidence of
a documented quality cliff, and any ceiling at that value is the human's
chosen operating ceiling rather than Anthropic's view. The ceiling itself and
how it is derived are the `tanto-context-ceiling` topic's work.

What the second row of that table cannot say, 2026-09-14: the shape of the
tenure it measures. That Kanri spanned one full T0 shoroku stage, one full
spec-writing cycle including the document author's own exit shoroku, four
bug-report triages arriving from two sibling repositories, and one resume across
the profile-switch event — and ran zero batches and closed zero plans, because
the topic never reached its implementation stage before the handover that ends
the tenure. The bearing on this issue is plain: a handover-timing threshold read
only off the batch-count and plan-count columns would never have fired for this
tenure, since both stayed at zero from its first turn to its last. The whole
cost sat in spec-stage and intake work, which the existing counters do not see.

A data point on the handover's cost itself, 2026-09-14, from
`C:\Users\0000105523\devel\kuchidome` (tanto, topic `gated-permissions`):
Kanri changed from `kuchidome-eb` to `kuchidome-0b` between a Sekkei's
`spec-review:` line and its `review-ready:` line. The `kanri-address:` line
arrived as a cross-session message; the Sekkei's next three sends went to
the new name; nothing was lost or repeated. The first Sekkei-side
observation, in that repository, that a mid-tenure Kanri handover costs the
peer session nothing.

A concurrent-topic data point, 2026-09-15, which the rows above do not hold.
The `dotskills-00` Kanri accepted the handover mid-topic — at the plan-drafting
stage, on the human's explicit word, not at a plan close — and then ran one
topic (`tanto-context-ceiling`) through its whole remaining lifecycle: the cold
read, T1, six batches (five implementation plus one fix wave), a whole-branch
review, T2, and the merge. It did that while opening and running the early
stages of two more concurrent topics (`tanto-sweep-2` through its spec
acceptance and Sekkei's exit; `tanto-project-config` through T0) and serving as
this repository's bug intake for two sibling repositories (`ellmx`,
`kuchidome`) throughout, roughly twenty bug reports across the tenure. Batches
accepted: 6. Plans closed: 1. Compactions noticed: 0. Final reading at its exit
proposal: `transcript: 7370743 B, 2996 records, 62 wake-ups, 0 compactions`. No
ceiling instrument existed for Kanri until this very topic's own plan landed it
partway through the tenure (task 7, batch C); by that instrument's own numbers
(`docs/reports/2026-09-14-tanto-context-ceiling-dogfood.md`) this Kanri read
`over` its derived ceiling at every boundary from batch A on, non-binding by
Rule 11. The bearing here is the shape rather than the counts: one topic's full
implementation lifecycle, two topics' opening stages, and continuous
cross-repository intake, all at once, is a heavier tenure than the single-topic
rows above record, and a threshold read off the batch and plan columns alone
sees only the one topic's six batches.

A coordination-only data point, 2026-09-15, from the next Kanri
(`dotskills-e9`), whose tenure ran no batch loop of its own: handshakes, a
cold-read dispatch and its verification, spec-input answers, and bug-report
triage across two concurrent pre-batch topics (`tanto-sweep-2`,
`tanto-project-config`). Its first-turn baseline was 72,376 tokens — stated
here because that figure lives nowhere else on disk than the exit proposal.
At the plan-landing check for `tanto-sweep-2`, with zero batches run under
this Kanri, the reading was 321,359 against a derived ceiling of 202,376
(72,376 + 2 × 65,000, the `per_batch` figure from `tanto.json`): over, on
coordination overhead alone, before a single batch report had been read. The
`per_batch` figure is presumably calibrated against a batch loop's own
per-boundary cost; a tenure spent servicing concurrent pre-batch topics is a
different cost shape that reaches the same number for a different reason —
one for whoever calibrates `ceiling.kanri`'s defaults next. The queued
`tanto-diet` topic is a second reader of this data point, for the reduction
lever as much as for the threshold.

A coordination-plus-one-batch data point, 2026-09-15, from the next Kanri
(`dotskills-0d`). Its ceiling (`context=276206` against `202384`) crossed
within one continuous window that included: a full handover acceptance
(roster/ledger rewrites across two open topics), two handshakes (one
processed as newly-arrived from the predecessor, one a same-name/ref jisso
re-handshake), one Kikaku decision processed across two ledgers, one Keikaku
plan-drafted report requiring a cross-topic ruling, and one full batch-A
verification (boundary, diff, three `verify --task` calls, lint, eleven
content greps, a `node --test` run). Unlike the prior `dotskills-e9` data
point (zero batches, pure coordination), this one shows the ceiling crossed
with real batch-verification work mixed in — a second reader for whoever
calibrates `ceiling.kanri`'s defaults next, alongside the prior
coordination-only figure.

A third ceiling data point, 2026-09-15, from the next Kanri (`dotskills-57`),
and the leanest one yet. Its ceiling (`context=242840` against a derived
`202690`) crossed within one continuous window that included: a full handover
acceptance (roster and two ledgers rewritten, four `kanri-address:` sends),
opening one new topic (`shoroku-at-close`, its ledger written, R-1 and R-2
ruled), one Sekkei handshake and orders line, one full batch-B verification
(boundary, diff at two successive bases since R-10's own re-resolution, lint,
a `node --test` run, two content-grep checks), and two boundary-verified
notices sent to live peers. No Kikaku churn and no cross-topic ruling drove
this crossing — unlike both prior tenures' data points (`dotskills-e9`: zero
batches, pure coordination; `dotskills-0d`: coordination plus one batch, with
two handshakes and a Kikaku decision mixed in) — yet the ceiling still crossed
after exactly one batch's own verification work layered on one ordinary
handover accept. A third reader, on the leaner end, for whoever calibrates
`ceiling.kanri`'s defaults next.

A fourth ceiling data point, 2026-09-15, from the next Kanri (`dotskills-a1`),
a leaner one. Its ceiling (`context=235458` against a derived `215214`)
crossed within one boundary mixing a full Kanri handover acceptance (roster
rewrite, five `kanri-address:` sends), one Kikaku re-handshake reply, one
bug-report intake (copy plus `received:` reply, no triage under the hold
policy), one Sekkei exit (form check, a fresh ruling, an 8-item S-n table
write, no recommender dispatch under R-3's consolidation), and one full batch
acceptance (`boundary`, `diff`, a `git show` spot-check, a `sections` read,
ledger updates across two topics). No handshake for a new role and no
plan-landing cold read this time, yet the ceiling still crossed inside one
boundary — a data point that the concurrent-topic administrative load
(handshakes, intake, exits) costs comparably to the batch-verification work
itself, not just a smaller addition to it.

A fifth ceiling data point, 2026-09-15, from the next Kanri (`dotskills-df`),
and the heaviest single-boundary one yet: `context=378678` against a derived
ceiling of `215248`, crossed within one boundary that mixed a full handover
acceptance (roster rewrite, four `kanri-address:` sends), two Kikaku decision
iterations on the same file (the "now" half dropped, then restored after this
Kanri's own notice), a re-ruling of another topic's held plan (R-9, with a
full message to that topic's Keikaku), a new Keikaku handshake and its full
queued-topic orders line, a projection dry-run cold read (dispatch, a
four-question read, verification of all four answers against the tree), a new
Kikaku handshake and reply, one mid-batch escalation ruling (R-17), and one
full batch acceptance (`boundary`, `diff`, lint, two test suites, five content
checks). No single administrative action stands out as the cost driver — it is
the sum of ordinary per-topic bookkeeping across three concurrently open
topics in one boundary. This point crossed its ceiling by about 1.76 times;
the three earlier points that quote a derived ceiling crossed by between about
1.09 and 1.37 times (`dotskills-a1`, `dotskills-57`, `dotskills-0d`). That the
sum of ordinary bookkeeping across three concurrently open topics in one
boundary is itself the finding: `ceiling.kanri.per_batch` prices one batch,
and a boundary's cost scales with how many topics are open at it, which the
instrument does not see. A candidate for whoever calibrates `ceiling.kanri`
next — derive Kanri's ceiling per boundary as a function of the open topics,
or count an open topic as a batch, rather than raising `per_batch` alone.

A sixth ceiling data point, 2026-09-15, from the next Kanri (`dotskills-4c`):
`context=258609` against a derived ceiling of `215572` (baseline `85572` +
2 × `65000`), about 1.20 times, crossed after accepting a handover, one Kikaku
handshake (`dotskills-fd`), one Hosa resume (`dotskills-b0` → `dotskills-70`),
and one full batch's own verification — the plan's final batch (E), including
reading a report with a refuted reviewer Critical finding and four shoroku
candidates, plus direct hand-verification of `diff`, lint, `node --test`, and
`git ls-files --eol`. Lighter than the heaviest prior point (the `dotskills-df`
point, about 1.76 times) but still crossed within a single boundary carrying
one full-batch verification pass — a data point for whatever follow-up to this
issue eventually calibrates `ceiling.kanri` against the shape of the work at a
boundary, not only its count.

A seventh data point, 2026-09-16, and the first with no batch boundary in it at
all. The prior five ceiling crossings of this tenure (`dotskills-4c` and its
predecessors) each fired at a batch boundary carrying a full verification pass.
This one fired on the very first turn after a plain `/tanto fukki` resume, with
the human's `OK` to a pending T2 question as the only work done before the
ceiling-plus-presence check found both conditions met. The bearing is on the
instrument rather than the number: a resumed session's baseline is the same
transcript's own growth, not a fresh one, so a session that ends close to its
ceiling hands its successor-by-resume a context that can cross on turn one —
before any work a batch-shaped or boundary-shaped threshold would see.

An eighth data point, 2026-09-17, from `kuchidome`
(bug-report-kanri-ceiling-per-batch-underestimates-final-batch), naming a
different axis than the fifth data point's concurrent-topic finding above:
`ceiling.kanri`'s flat `per_batch` figure does not distinguish a plan's
ordinary lettered batches from its structurally heavier *final* one. That
repository's `residency-retention` plan's own final batch (I) carried two
full-suite test runs instead of one, a real YAML frontmatter parse across
every edited document, and a repoint-grep across several directories; a
Kanri whose own first-turn baseline was `context=78909` crossed its ceiling
(`208909` = baseline + 2×65,000) at `context=261682` verifying that one
boundary alone, with no other topic's work interleaved, and the same
reading's `--presence` check nearly expired (57, then 59, of the 60-minute
window) during that single boundary. Not urgent — the Replace table's own
"never at the final batch's boundary" carve-out already prevents a *Jisso*
replacement from firing wrongly here — but the *Kanri* ceiling has no
equivalent carve-out. A candidate for whoever calibrates `ceiling.kanri`
next, alongside the fifth data point's finding: a distinct, larger
`per_batch` allowance (or an explicit multiplier) for the boundary
`roles/kanri.md`'s "The final batch" section names.

A ninth data point, 2026-09-17, from this repository's `shoroku-at-close` run,
and the first with a *Jisso* and a Kanri reading crossed at the same boundary —
the plan's very first one. The fresh Jisso (`dotskills-35`) read
`context=296542` against a derived `210523`, about 1.4×, on batch A alone, its
first batch ever; the Kanri (`dotskills-1a`) read `context=420475` against
`210713`, about 2.0×, inclusive of two concurrent topics' coordination load (the
`seat-lineage` T0 cycle, five bug-report triages, a full `/clear`-and-reconnect
round, and the branch-checkout race issue-1bff records). The Kanri half is
another instance of the fifth data point's concurrent-topic finding. The Jisso
half is new here: this plan — a wholesale rewrite of `roles/kanri.md`'s own
"Shoroku" section, `SKILL.md`'s definitions paragraph, and several templates —
costs Jisso well above the flat `ceiling.jisso.per_batch` default on an
*ordinary early* batch, not only a final one, which is a second and independent
signal beside the eighth data point's final-batch axis: a plan whose batches
rewrite large chunks of `roles/kanri.md` costs more per batch than the default
assumes, whatever the batch letter.

A tenth data point, 2026-09-17, and the first on the **Jisso** seat rather than
Kanri's — from the `shoroku-at-close` run's Jisso at its Batch A boundary. That
session's context read 90,349 tokens right after the handshake and 296,542
tokens at Batch A's own boundary, crossing its ceiling (210,523) inside the very
first batch, with zero fix rounds and no escalation. The growth is not
batch-loop iteration cost: it is almost entirely the Start sequence's own
required reading — the full plan (≈4,109 lines, ≈82,000 tokens), the conductor
ledger, the role file, the spec's section list, and several `git show` and
`grep` reads used to fill in Batch A's own task text before any subagent was
dispatched. A plan this size (11 tasks, four batches) may make the
Start-sequence reading cost a distinct line item worth tracking separately from
`ceiling.jisso.per_batch`, which prices a batch cycle and not the reading that
precedes the first one. It is the same shape of gap the eighth data point above
names for `ceiling.kanri`'s flat `per_batch` at a structurally heavier *final*
batch — here at the *first* boundary instead, where the Replace table's
"never at the final batch's boundary" carve-out gives no cover at all.

An eleventh data point, 2026-09-17, and the measurement gap it leaves open — from
the same `shoroku-at-close` run's **replacement** Jisso (`dotskills-1f`), which
took over mid-plan and ran Batch B. Its two readings: `context=104,635` right
after its handshake, and `context=343,993` at Batch B's own boundary, against a
ceiling of `213,973`. Unlike the tenth data point above, this tenure cannot
split "onboarding reading" from "batch-loop cost", because no reading was taken
between the two — only handshake-time and the batch boundary exist for this
session. That matters because a replacement Jisso's own onboarding is a
different cost shape from a fresh Start's Start-sequence reading: instead of the
Start sequence, it reads Kanri's orders line, the conductor ledger, the existing
SDD workspace's `progress.md` (confirming the prior batch's state rather than
re-deriving it), the batch prompt, and the new batch's own task text before its
first dispatch. Whether that is cheaper than a fresh Start's reading, and by how
much, this run's data cannot say. The ask for next time: a Jisso taking over
mid-plan should record one reading at exactly "onboarding done, before the first
dispatch", as the comparable counterpart to the ninth point's own figure.

**2026-09-17 — a plan whose Kanri ceiling crossed at all four of its batch
boundaries.** `shoroku-at-close` ran four batches, A through D, and the ceiling
fired at every one of them — a 100% hit rate across the topic's whole run, not
merely "usually". As far as that run's ledger was read, it is the first plan in
this run's own history where every single batch boundary crossed it, which is a
new kind of point for the threshold dataset above.

**2026-09-18, `seat-lineage` — a close-shaped boundary costs more than any
implementation batch.** That Kanri tenure's one boundary was batch E plus the
whole T2 close — the whole-branch review, the recommend, the check, the apply,
the merge, the hotfix, and the archive move — and it was a heavier cost shape
than any of the plan's own four implementation-batch boundaries. This is the
close-side twin of the "final batch costs more" finding above: the threshold
dataset needs a class for a boundary that is a close, not only for one that is
a batch.
