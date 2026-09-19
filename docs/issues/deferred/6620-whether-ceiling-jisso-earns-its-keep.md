---
id: "6620"
title: "whether `ceiling.jisso` earns its keep"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-18
updated: 2026-09-19
---

Source: shoroku seat-lineage

The per-batch rotation (decision-ea95) makes `ceiling.jisso`'s verdict act on
nothing: a Jisso is replaced at its boundary whatever the ceiling says. The
config key and the `--role jisso` line of `scripts/reading.js` stay, and Jisso's
reading is still taken, but the reading is now a **measurement** rather than a
trigger — which is what decision-ea95's amendment of decision-eee2 says in as
many words.

**The measured trigger for removing them.** If the roster archive's Jisso rows
show every seat under its own ceiling for two plans, the config key and the
`--role jisso` line can go. Until then the line keeps producing the data that
would answer the question.

Related: issue-c44b (a ceiling for the measuring roles) is the neighbouring
question — whether roles that only measure need a ceiling at all — and not this
one. issue-9ca6 weakens the archive as this question's dataset, since a row's
figures survive the archive move but its Transcript does not.

A configuration question with a stated measurement, not a user-stated need, so
no paired requirement.
