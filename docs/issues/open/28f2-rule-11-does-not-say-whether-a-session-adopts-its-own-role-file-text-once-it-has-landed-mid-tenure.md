---
id: "28f2"
title: "rule 11 does not say whether a session adopts its own role-file text once that text has landed mid-tenure"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-17
---

Observed in the `shoroku-at-close` run (2026-09-17), by Jisso at the Batch C
boundary, while writing its own exit proposal.

Rule 11 in `skills/tanto/SKILL.md` makes a running session's authority the
plan's Global Constraints, Kanri's orders line, and the batch prompts — "not
the role text on disk" — precisely because, on a plan that edits the tanto
skill, the file is mid-edit under the session reading it. What it does not say
is what happens once a paragraph is no longer mid-edit: the case here was the
session's *own* role-file paragraph, already landed and already reviewed clean
inside the same plan.

The instance: Task 8 of this run, which this same Jisso dispatched in this same
batch, rewrote the "Propose" paragraph of `skills/tanto/roles/jisso.md` into
the pointer-list form (pending `S-n` rows listed by number instead of quoted).
The next thing that session did was write its own Batch C exit proposal — the
very artifact that paragraph describes — and it used the established
plain-numbered form instead, matching every prior exit in this run's ledger
(Sekkei's, Keikaku's, and both earlier Jisso exits).

Two reasons were given, and they do not carry equal weight. The first stands on
its own: by Rule 11 the on-disk text is not this session's authority until every
task has landed, so the established form was the covered choice and the new one
would have been an unruled adoption. The second is this session's judgment
rather than a reading of the text — that pointer rows into pending ledger rows
would only produce pointers to pointers, since Kanri ledgerizes an exit's items
as new pending rows whatever their format. A factual nuance belongs with it:
the landed paragraph itself says "Your exit is that same proposal under the exit
file names, written at the boundary where Kanri replaces you or where the plan
ends", so by its own wording the new form *does* reach a mid-plan exit. The
session's reading at the time — that the paragraph was written only for the
actual T2 close — was its own framing, not what the paragraph says. Recorded
here as the observed instance, not as a claim about the landed text.

The gap is that nothing settles this in either direction. The default reading
Rule 11 implies (disk text is not authority until the plan lands) fits, but it
is nowhere stated for a session's own already-landed self-description, so the
next session in this position re-derives it from scratch — and a plausible
opposite reading exists, since a paragraph that has landed and passed review is
no longer the moving target Rule 11's clause was written against.

Not the same gap as issue-11db, which is phrased entirely around a session of a
*different* topic whose skill file changes under it; this one is the editing
plan's own session reading its own landed text. Folding them together would
blur the one-gap-two-sides shape issue-11db keeps. One layer up sits a sibling
this run has not filed yet: Rule 11 names no exception for a Replace-triggered
mid-plan role replacement (only Kanri's own handover and a Kaiseki ruling),
carried as a pending row in this run's ledger for the T2 close. A Rule 11 plan
that reads the three together is the natural place to close all of them.

A system gap, not a user-stated need, so no paired requirement.

**2026-09-17, the worked example.** The `shoroku-at-close` branch carries three
`docs: exit shoroku for jisso at A/B/C` commits: Jisso exits applied mid-plan
under the old four-step flow, after that plan's own Task 2 had already landed
the text saying an exit applies nothing. Rule 11 made the orders line, not the
disk, the running Kanri's authority, and the 2026-09-14 Kikaku interim rule
covered Sekkei and Keikaku only, so the Jisso exits fell through to the old
flow. That is this issue's question answered in the measured case — the text
that governs is the one the orders line names — and the argument for saying so
in the skill rather than leaving each run to re-derive it. issue-11db is the
other-topic case; this is the same-plan one.
