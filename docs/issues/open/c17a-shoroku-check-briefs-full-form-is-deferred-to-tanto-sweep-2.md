---
id: "c17a"
title: the shoroku check step's full-form brief — a second reader-facing file rendered in the chat's language, form-checked like a review brief — is deferred to `tanto-sweep-2`
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-14
---

The 2026-09-14 hotfix bundle (R-12) landed the interim form of the shoroku
check step: Kanri reads the whole recommendation once and renders its items
as a numbered list, in the chat's language, in the same message as the path
and the three counts. The full form, decided in the same window
(`.tanto/kikaku/2026-09-14-shoroku-check-brief-and-topic-order.md`, "3. Two
forms") but deferred as beyond the hotfix lane's size, is:

- the `shoroku` recommender writes a second output in the same dispatch: the
  check brief at `.tanto/<topic>/<stage>-brief.md` beside the recommendation
  (`.tanto/<stage>-brief.md` for T0 and Kanri's own exit), from a new tanto
  template `templates/shoroku-brief.md` — the English source the writer
  renders, with its form markers kept: the `## How to answer` heading, the
  group headings, the item numbers, `→`, `See:`;
- `shoroku`'s recommend mode gains one sentence: when the caller names a
  brief path, a template, and a chat language, write the brief from that
  template at that path, rendered in that language, in the same run and from
  the same judgment; its "write nothing outside `docs/` except the
  recommendation file a caller names" clause admits the second file;
- Kanri's check step then checks the brief's form the way a review brief's
  author checks its own — the headings present and in order, every `###`
  item heading of the recommendation appearing exactly once as a `See:`
  pointer, counted by grep, never by reading the prose — dispatches once
  more on a failure, and on a second failure pastes it as it stands with one
  line to the human; then puts the brief's text verbatim to the human with
  both paths and the three counts;
- `SKILL.md`'s Artifacts table gains the row for the new file, and both
  `tanto`'s and `shoroku`'s READMEs get a drift review.

Why the recommender writes it, and not a separate `brief.write` seat: the
review brief is written by a separate seat on purpose, so the selection is
made without the author's context; the check brief is a rendering of the
recommender's own judgment, not an independent read, and the recommender
already holds every item — a `brief.write` dispatch on fable measured
115,120 subagent tokens and 262 s for the same day's spec brief, against a
few KB of extra output from a seat that has already paid its read.

This is a `tanto-sweep-2` candidate (the topic follows `tanto-context-ceiling`).

Reference: `.tanto/kikaku/2026-09-14-shoroku-check-brief-and-topic-order.md`,
sections 2 and 3; `tanto-context-ceiling` ledger, R-12 and its `S-n` source
rows.
