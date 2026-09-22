---
id: "1ea3"
title: the spawner is the only process that runs `claude --bg`, `stop`, and `rm`; a session writes a request file
status: accepted
supersedes: []
superseded_by: null
amends: []
amended_by: []
created: 2026-09-22
updated: 2026-09-22
---

## Context

The tanto-bg-seats design of 2026-09-20 makes the machine-facing seats
background sessions, which someone has to start, stop, and remove. The
obvious hand is the run's own conductor: Kanri runs `claude --bg "/tanto
jisso …"` when a batch's prompt exists. Measured against the harness, that
hand does not exist. The auto-mode permission classifier refuses a
session-issued `claude --bg "/tanto …"` as unsafe agent creation, and the
refusal is a property of what the command does, not of how it is spelled.

That left two honest directions and one dishonest one, and the dishonest one
had to be named and closed rather than left for a later reader to rediscover
as an idea worth trying.

## Options

- **A process outside any Claude session — the spawner — owns every
  session-lifecycle command**, and a session that wants a seat started,
  stopped, or removed writes a request file the spawner reads.
- **A settings allow rule the human places per repository**, unblocking the
  classifier for `claude --bg`. Rejected: it asks every consuming repository
  to weaken its own permission posture for the skill's convenience, and the
  rule would sit in a file the run does not own.
- **A prompt shape that slips past the classifier.** Rejected outright. The
  design uses the front door, or a process the classifier does not judge, and
  never a disguise: a command written to read as something other than what it
  does is permission laundering, and a design that depends on it breaks the
  day the classifier improves.

## Decision

The spawner is the only process that runs `claude --bg`, `claude stop`, and
`claude rm`. A session that needs a seat started, stopped, or removed writes
a request file; the spawner, running outside any Claude session, reads the
request and acts on it, and writes its own result files back.

The rule has no exception. In particular the launcher does not spawn the
first Kanri directly but goes through the spawner too, so that a reader never
has to hold an exception in mind (see the start-sequence sentence in
design-4807).

## Consequences

- No session in the run issues a session-creating command, so the classifier
  never has to judge one, and no allow rule is asked of a consuming
  repository.
- The request file becomes a real interface with its own keys, its own
  failure shapes, and its own tests; a bug there is a run that never starts
  rather than a message that never arrives.
- The spawner is now a resident process the human's machine carries for the
  length of a run, and its own cost — the census poll included — is a thing
  the run has to account for.
- The reasoning is the tanto-bg-seats design spec of 2026-09-20; design-4807
  records the resulting shape.
