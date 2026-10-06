---
id: "7e52"
title: a shusei fix text is not read in its target paragraph before it is listed
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-1

A shusei's `fix` texts have now read wrong in context at two consecutive
closes: the shoki-seat close's two (items 84 and 38) and the run-owned-seats
close's four (items 21, 82, 106, 111; that close's R-13 and the shusei's
Deviations). The recommender quotes each `New` text from an inbox report or a
proposal, and nothing reads it in the target file's sentence until the
shusei's implementer or the prompt's renderer does.

The `shoroku.recommend` mode could check every `fix` `New` text in its target
paragraph before it lists it, as the shusei prompt's renderer was told to; an
item that fails goes to `issue`, not to `fix`. Measured at the shoki-seat
close: the renderer's check cost one subagent run (about 81,000 tokens,
135 s) and moved 4 of 17 items to a corrected form. The repair is a step in
the recommend mode, not a sentence. Kin issue-32f9 (a shusei batch has no
verify block).

Carrier: Kept — the recommend mode's step in `skills/shoroku/SKILL.md` and
the shusei prompt's renderer, no instrument topic's file.
