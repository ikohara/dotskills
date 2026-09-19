---
id: "83aa"
title: a Recommended fix group with a commit of its own, and fix as the sixth triage outcome
status: accepted
supersedes: []
superseded_by: null
amends: ["ce83"]
amended_by: []
created: 2026-09-20
updated: 2026-09-20
---

## Context

Most of what a run's readers file is a sentence: of 234 open issues, 105 are of
the form "X never states Y", and the repair for nearly all of them is one
clause in one file. Routing each to `docs/issues/` costs a file, a later plan's
attention, and a second reading of the same finding, and leaves the skill's own
prose wrong in the meantime. The close already has the human's one check, by
exception, over a recommendation — which is the moment at which a one-sentence
repair could simply be approved.

## Options

- **`fix` as a destination word inside `Recommended adopt`.** Rejected: it
  hides a change to the skill's own behaviour behind the adopt count, which is
  exactly what the human reads past when answering by exception.
- **An issue per sentence**, the status quo. Rejected on the measurement above.
- **A separate outcome word for the hotfix lane**, distinct from the close's
  `fix`. Rejected: two words for one act — a sentence applied on the human's
  word.
- **A `Recommended fix` group of its own, with its own commit, sharing the
  outcome word `fix` with the hotfix lane.** Chosen.

## Decision

The recommendation carries a `Recommended fix` group beside `Recommended
adopt`, `Recommended reject` and `Unsure`. Each item in it names the file and
an `Old:`/`New:` pair the apply can put in exactly once. `fix` is the sixth
triage outcome, shared with the hotfix lane.

**Amends decision-ce83** in two parts: the apply makes **two** commits at a
close, the second carrying the fixes, and the whole-branch review's exclusion
names both commit prefixes. The rest of decision-ce83 stands.

## Consequences

A `fix` lands on the topic branch after the whole-branch review and is
therefore unreviewed by a subagent; Kanri's diff verification and the human's
brief line are its checks, and that gap is recorded as a deferred issue rather
than closed here. The human's exception check now covers a group whose items
change shipped text, so the group is listed separately and counted separately
from adopt. Pairs with decision-0970, whose bar routes a one-sentence gap here
rather than to `docs/issues/`.
