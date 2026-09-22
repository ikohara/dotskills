---
id: "b59a"
title: a wake-up is spent only on a decision; fixed bookkeeping lines go to the ledger through `boundary.js record --event`, written by the peer
status: accepted
supersedes: []
superseded_by: null
amends: ["2b1a"]
amended_by: []
created: 2026-09-22
updated: 2026-09-22
---

## Context

Every message to a resident session costs a wake-up, and a wake-up re-reads
the whole context. A meaningful share of the lines Kanri received were not
decisions to make but facts to write down: a peer reporting that its brief
was rendered, that a commit was ready, that a form check passed. Kanri's only
act on such a line was to append it to the ledger — which is to say, the
expensive part of the round trip bought nothing.

The ledger already had a writer's interface for exactly this shape:
`boundary.js record --event`. The question was whether a peer may use it, and
against which rule.

## Options

- **A closed set of fixed bookkeeping lines the peer writes to the ledger
  itself, through `boundary.js record --event`; everything Kanri acts on
  stays a message.**
- **Keep every line a message.** Rejected on the cost above: a wake-up per
  fact, for facts nobody decides anything about.
- **Let a peer write any line it likes to the ledger.** Rejected: the set has
  to be closed and named in the role files, or the ledger becomes a place
  where anything can appear and Kanri has to read all of it.

## Decision

A wake-up is spent only on a decision. Fixed bookkeeping lines go to the
ledger through `boundary.js record --event`, written by the peer itself. The
set of such lines is closed and named in the role files; everything Kanri
acts on stays a message.

**This ADR amends the contract's rule 3** — "Kanri is the only writer" — to
name the ledger's Events lines as the exception, and **amends
decision-2b1a** in one part: its `review-ready:` line becomes the author's
own ledger event rather than a message to Kanri. The rest of 2b1a stands: the
brief is dispatched by the document's author, the author runs the form check,
and the author never edits the brief.

## Consequences

- Kanri's wake-up count falls by the count of bookkeeping lines, which is the
  cheapest possible saving because nothing is decided differently.
- The ledger now has more than one writer, so `record --event`'s own
  behavior — its dedup rule in particular — becomes load-bearing in a way it
  was not when Kanri was the only caller; a peer event that collapses into an
  earlier identical one is filed as its own issue.
- The closed set has to be kept in step across the role files, which is one
  more consistency surface.
- The reasoning is the tanto-bg-seats design spec of 2026-09-20.
