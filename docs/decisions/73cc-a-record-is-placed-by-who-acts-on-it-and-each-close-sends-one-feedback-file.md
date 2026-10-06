---
id: "73cc"
title: a record is placed by who acts on it, and each close sends one feedback file
status: accepted
supersedes: []
superseded_by: null
amends: ["c322"]
amended_by: []
created: 2026-10-07
updated: 2026-10-07
---

## Context

A run leaves findings whose only reader is the skill that ran it: a role
file's gap, a template's slot, a default that measured wrong. In a
repository that uses the skill, a close had nowhere to put them but that
repository's own `docs/`, where no document cites them and no rule of the
skill changes by reading them. The intake of decision-c322 carried one line
kind, the bug report, and a report is written by hand by whoever notices.
The tanto-feedback design (2026-10-06), sections 1 to 3 and 7, takes the
question of where such a record lives. Serves exp-1c7a and exp-1c02.

## Options

- **Classify a record by its subject.** Rejected: that is how a cost report
  lands where nobody cites it.
- **A tracked list of the human's departures.** Rejected: no document cites a
  raw row.
- **Shoki as the sender.** Rejected: its contract is one line to Kanri, and
  the measurement it would carry cannot include itself (Q-4).
- **A Hosa chore after the close.** Rejected: a hand of the human's at every
  close.
- **Sending the human's words.** Rejected: the paraphrase is the
  recommender's, shown before it is written.
- **Place a record by who acts on it, and send one feedback file per close.**
  Chosen.

## Decision

The design's sections 1 to 3. The recommender gains a `feedback`
destination and its compound form; the line that travels is shown in the
kessai brief; one file and one line per close, written by shoki's apply and
by `usage.js close`, sent by Kanri; the human's departures from a
recommendation ride in it in four classes; nothing is sent from the
repository that ships the skill; departures stay in the inbox copies and are
distilled by Kikaku, never automatically.

A second `close` finds the file the first one placed through an untracked
marker, `.tanto/<topic>/shoroku-feedback-placed.txt`, which the design did
not name and the plan added: without it `close` would find the file by the
workspace id and the date in `sent/`, and a second close of another topic on
the same day would collide.

**Amends decision-c322** in three parts: the intake's line was the bug
report's alone, and it is one of four (the design's section 7); a copy that
is a consult turn is the Kikaku's and is decided at no close; and for the two
consult lines the intake's act, which read nothing and did nothing else,
adds one `request attention`. A feedback copy's items take the inbox's six
destinations, and `feedback` is the Outcome word that marks such a copy
triaged. The rest of decision-c322 stands: the cheapest listed seat copies
and reads nothing, and every bug report and every feedback item is decided at
a close.

## Consequences

A finding about the skill reaches the repository that ships it without the
human carrying it, and nothing in the file names the repository it came
from. A close gains one untracked file, one line, and one marker; the
receiving close gains a second kind of inbox copy to triage. A backfill of
departures already on disk, and a record of an inbox sweep's own departures,
are deferred (issue-357f).
