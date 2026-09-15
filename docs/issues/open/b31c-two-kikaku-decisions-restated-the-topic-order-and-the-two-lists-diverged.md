---
id: "b31c"
title: "two Kikaku decisions restated the topic order and the two lists diverged"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-15
updated: 2026-09-15
---

Measured by the `dotskills-0d` Kanri on 2026-09-15.

Two Kikaku decisions produced a directly conflicting topic order, and
nothing caught it until a human question surfaced it. The decision file
`.tanto/kikaku/2026-09-15-bug-report-hold.md`, section 8, states a topic
order (`shoroku-at-close` → `bug-report-hold` → `passage-check-hardening`)
that omits `experience-layer` entirely — the earlier same-day decision
`.tanto/kikaku/2026-09-15-experience-layer.md` had already placed
`experience-layer` third, right after `tanto-project-config` and before
`passage-check-hardening`. Kikaku's own "What was measured before deciding"
section for `bug-report-hold` cites `2026-09-14-shoroku-at-close.md` as its
ordering source but not the same-day `experience-layer` decision that had
already amended that order.

Kanri flagged the conflict to the human rather than guessing at a merge. A
rejected alternative, recorded here so it is not tried next time: silently
merging the two orders by inserting `bug-report-hold` after
`experience-layer` — an inference from file dates — was considered and not
done, because which decision's author intended precedence is the human's
call, not something file dates can settle.

The conflict itself is closed. At 12:37 the same day the Kikaku decision
`.tanto/kikaku/2026-09-15-topic-order-experience-layer.md` resolved it: the
human chose `experience-layer` sixth, after `shoroku-at-close` and
`bug-report-hold`, before `passage-check-hardening`, and the
`tanto-context-ceiling` ledger's S-46 row was amended accordingly. What this
issue tracks is the process gap only — no open question for the human
remains.

The cause is not that one decision forgot to read the other. It is that
both decisions **restated the whole order list**, and two restated lists
diverged. A convention of grepping the roster's Events for the latest
"Queue order changed" line would not hold: the Events move to
`roster-archive.md` at each plan close, and the Events are Kanri's
narrative, not the order's holder. The convention that does hold:

```text
the topic order has one holder (today, the tanto-context-ceiling ledger's
S-46 row in kanri.md); a decision that changes the order names the one
move it makes — which topic, before and after which — and points to the
holder; it never restates the list
```

A list that is not restated cannot diverge.

Kin of issue-7b7b, which is the opposite failure: there a Kikaku decision
cited a list with nothing behind it; here two written lists disagree. The
two land at the same spot — `skills/tanto/templates/kikaku-decision.md` and
`skills/tanto/roles/kikaku.md` — and form one section on what a decision
cites (write it in or point to it, issue-7b7b) and how it amends an
existing list (point to the holder, never restate it, this issue).

A process gap, not a user-stated need, so no paired requirement.
