---
id: "19d4"
title: a Sekkei or Keikaku idles until Kanri sends `exit:`; it should write its exit proposal unasked, as the last act of its final boundary
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-09-17
---

A Sekkei or Keikaku currently idles until Kanri sends `exit:` at its final
boundary. Decided (Kikaku consultation,
`.tanto/kikaku/2026-09-14-tanto-small-items-and-next-topic.md`, item 5): it
should instead write its exit proposal as the last act of that boundary,
unasked, and name it in the same report line —
`spec accepted: <spec>; exit proposal: <path> — <reading>` for Sekkei, the
same clause after `plan committed:` (once the cold read is answered) for
Keikaku. Kanri, on that line, sends no `exit:`; it dispatches the recommender
at once and asks the human to delete the seat once the recommendation is on
disk with nothing unreadable in its `unsure` group. Jisso and an attached
Kaiseki are Kanri-paced and keep the `exit:` line.

Rationale: the seat's own wake-up after the exit-only gap crosses the 1-hour
prompt-cache TTL and pays a cold read — a cache write at 1.25x against a
cache read at 0.1x, about twelve warm wake-ups' worth, paid once per such
gap. The gap being removed is the one whose only remaining act is the exit,
not a gap waiting on the human's real answer.

Sites to change when this is taken up: `SKILL.md`'s "Session exit", the
`spec accepted:` / `plan committed:` report lines in `roles/sekkei.md` and
`roles/keikaku.md`, and `roles/kanri.md`'s Delete table rows for Sekkei and
Keikaku plus its "Exit shoroku" section.

Not yet scheduled — the topic `tanto-context-ceiling`'s Sekkei decides
whether it rides there or waits for `tanto-sweep-2` (see that topic's
`spec-inputs.md` I-2).

The choice itself is now recorded: that Sekkei decided at Q5 that it rides
with `tanto-context-ceiling`, and decision-d538 holds the decision, its
options, and its consequences.

Resolved by the `shoroku-at-close` plan's own Task 10 whole-tree sweep: no
site still has a Sekkei or Keikaku waiting on an `exit:` line at its own final
boundary. Every site listed above now has the seat write its own exit
proposal unasked, named in the same `spec accepted:`/`plan committed:` report
line, per that plan's own passages.
