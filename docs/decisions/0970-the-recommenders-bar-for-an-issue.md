---
id: "0970"
title: the recommender files an issue only for a decision, a measured defect, or medium severity
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-20
updated: 2026-09-20
---

## Context

The open issue pile reached 234 files, and the human asked whether that count
is a defect signal — whether a stronger model or more effort on the seats that
produce the work would reduce it.

It is not a defect signal; it is a yield. The pile is readers per run × prose
read × adoption rate. Every run puts eight or more readers — the roles and the
review subagents — through the same prose under load, each files what it
notices, and the close adopts about nine items in ten with the human answering
`OK`. Of the 234 titles, 45% are of the form "X never states Y", 70% are
severity low, none is high, and ten record a measured defect. Kanri's
independent verification found no defect in Jisso's work across a whole plan.

So the human's hypothesis holds in one half — a skill's semantics can only be
tested by running it, every run is such a test, and the findings get filed —
and not in the other: the issues are not defects in the executing seats' output
that a stronger family would have avoided.

The bar below landed by hotfix during `bug-report-hold` (that ledger's R-6)
with its reasoning only in an untracked Kikaku file. This ADR records it,
because it was a choice with a rejected alternative.

## Options

- **Raise Keikaku's or Jisso's model or effort.** Rejected. It spends opus
  quota on seats whose output is already verified clean, and a sharper reader
  files *more* gaps, not fewer. Where gaps are born is Sekkei, which the human
  moved to fable the same day; `tanto-feedback`'s usage extract gains a
  per-topic "issues filed, by finder" count so that the effect can be read
  instead of argued.
- **Leave the recommender's judgment unstated**, as it was. Rejected: the
  human's departures from a recommendation are rare, so a bar that is not in
  the prompt is not a bar at all.
- **State the bar in the recommend-mode prompt.** Chosen.

## Decision

An item is recommended as an **issue** only when it is medium severity or
above, needs a decision, or records a measured defect. A low-severity gap whose
whole repair is a sentence is recommended `fix` (the group decision-83aa
creates); before that group existed the same item was recommended `reject` with
the sentence written into the reason, so that the direction could still order
it.

The bar lives in one sentence in `roles/kanri.md`'s close step 2 dispatch and
in the shoroku skill's recommend mode.

## Consequences

The pile stops growing by a sentence at a time, and the sentences reach the
text instead. The cost is that the recommender now judges severity on every
item rather than routing everything to `docs/issues/`, and a
misjudged-as-`fix` item lands in a commit the human approved by exception
rather than in a file a later plan reads. Pairs with req-3c4d; consistent with
decision-ce83 and with decision-83aa, which gives `fix` its own commit.
