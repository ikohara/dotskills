---
id: "0e74"
title: "\"workspace\" carries three senses in tanto's runtime text"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-12
updated: 2026-10-01
---

Source: shoroku tanto-workspace

The word "workspace" names three different things in the skill's runtime text:

- the **repository checkout** the sessions share — `<workspace>/.tanto/`, and
  the `cwd` every handshake carries;
- **`.tanto/<topic>/`**, the topic's own directory, where a role's files go;
- the **SDD skill's** workspace, `.superpowers/sdd/<plan-basename>/`, which the
  `sdd-workspace` script creates and which holds `progress.md`.

Each is unambiguous where it stands, which is why this has never produced a
wrong action. The cost lands on a session that reads more than one of them in a
single sitting — a Jisso reads all three — and has to reconcile which sense is
meant per sentence.

Noticed in the tanto-workspace whole-branch review (2026-09-12), where the third
sense became more visible: after that plan, the SDD workspace is the **only**
thing tanto still names under `.superpowers/`, so "the workspace" in a sentence
about state is now more likely to mean `.tanto/<topic>/` than it used to be.

The cheap remedy is to spend a word: "repository" for the first sense, "the
topic directory" for the second, and "the SDD workspace" for the third, leaving
"workspace" unqualified nowhere. That is a passage plan over the skill's own
text, not a one-line fix, which is why it is filed rather than done.

Related: exp-06b2, design-4807.
