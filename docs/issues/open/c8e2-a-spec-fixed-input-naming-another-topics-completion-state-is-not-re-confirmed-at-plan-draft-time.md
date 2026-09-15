---
id: "c8e2"
title: "a spec Fixed input naming another topic's completion state is not re-confirmed at plan-draft time"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-15
updated: 2026-09-15
---

Measured by the `dotskills-0d` Kanri on 2026-09-15.

A spec's Fixed input can bake in a sequencing assumption that a later
ruling quietly overtakes. The `tanto-project-config` design spec draft (the
untracked `spec-draft.md` under `.tanto/tanto-project-config/`, as of
2026-09-15), section "Fixed inputs", item 8, reads verbatim:

> **The plan is drafted after `tanto-sweep-2` lands.** That topic
> restructures `SKILL.md` and the role files; this spec names its sites by
> the headings and phrases that identify them today, and Keikaku re-reads
> each site as it stands when the plan is drafted.

True when the spec was reviewed, under a strict-sequence topic order. By the
time Keikaku actually drafted the plan, Kanri's own rulings R-6 and R-8 in
the `tanto-project-config` ledger had put the topic in "continue
draft-only" mode precisely *because* the topics were now concurrent, and
Keikaku correctly executed that — drafting against a mid-batch
`tanto-sweep-2` tree, not a landed one. The mismatch was caught only
because Keikaku itself noticed and asked, not because anything checked the
Fixed input against the live roster at draft time.

Nothing in `docs/issues/` covers this; the existing "Fixed input" mentions
are resolutions citing a spec, not this failure mode.

Two rules follow, at two landing spots.

Mitigation, at `skills/tanto/roles/keikaku.md`: a Fixed input naming
another topic's completion state is re-confirmed against the live roster
and ledger before the `plan.draft` dispatch runs, not only trusted from the
spec-review moment.

Prevention, at `skills/tanto/roles/sekkei.md` or the `spec.review` seat's
prompt: a Fixed input fixes **what** the design holds constant; **when** a
plan is drafted is not the spec's to say — the schedule lives in the topic
order and Kanri's rulings, both of which change under the spec. Fixed
input 8 shows the seam exactly: its second sentence onward (Keikaku
re-reads each site as it stands at draft time) is design content and stays
true under any schedule; its first sentence is a schedule claim and went
stale. So a Fixed input naming when something happens, rather than what
holds regardless of when, is flagged at spec review.

A process gap, not a user-stated need, so no paired requirement.
