---
id: "40ed"
title: a count threshold for the Kanri handover
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-07
updated: 2026-09-15
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
