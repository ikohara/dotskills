---
id: "5a17"
title: tanto says nothing about a rate limit met mid-run, and the rule it needs is that a limit is a pause, never a model change
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-09-11
---

tanto's model selection is configuration, checked at the edges: `tanto.json`'s
`sessions.<role>` is advisory and read once, at a role's start and at Kanri's
handshake check; `subagents.<kind>` is effective and goes into every
dispatch's `model` (contract rule 6); rule 9 caps strong-model sessions at
two at once. Nothing in `SKILL.md` or the role files says what a session does
when a rate limit is met while a batch, a review, or a translation is
running — not the per-minute 429 that issue-9a68 measures between
strong-model sessions, and not a weekly quota on one family.

The gap showed on 2026-09-11, in the kisou-refresh run: five parallel
`sonnet` subagents dispatched for a translation all died on HTTP 429
"weekly limit, resets Sep 13 10am (Asia/Tokyo)". Kanri had no text to rule
from and wrote R-17 for the run — on a 429 that names a weekly limit, no
retry loop; commit nothing half-done; write the report with the event under
Rulings needed; idle — and probed the family with one trivial subagent
before the next dispatch. The same day, in another repository's run, a
session that resumed after a limit had dropped its model a family
(`sonnet` to `haiku`) to continue, which the human called out: a resume
after a limit means the quota came back, by time or by payment, so the
degradation was unnecessary — a limit is a quota event, not a quality one.

What the skill needs, in one paragraph under "The expected-model config" or
beside rule 6:

- **A limit is a pause, never a model change.** No role switches its own
  session model on a limit, and no dispatch is retried on a lower family;
  the models are what `tanto.json` says until the human changes the file.
- **The procedure**: on a 429 that names a weekly or daily quota, the
  dispatching role stops retrying, commits nothing half-done, records the
  event (the family, the message's reset time, what was lost) in its report
  or in a line to Kanri, and idles; Kanri records it in the ledger's
  Measurements table and tells the human the reset time. On a per-minute
  429, one retry after the message's interval, then the same.
- **Resuming** is the human's word (the quota is back, or they raised it):
  the same dispatch, the same model, from where it stopped; Kanri may probe
  the family with one trivial subagent first, as R-17 did.
- **What is not detected**: a session that changes its own model mid-run
  with `/model` is invisible to the skill, because the model check runs
  only at the start and at the handshake; the rule above is protocol, not
  enforcement.

This edits `SKILL.md`, so it runs under contract rule 11 — with the
`.tanto/` move (issue-0b97) or the Keikaku split (issue-3c7a).

**Addendum, 2026-09-11, later the same day.** The resume half needs a
protocol too. After the opus weekly limit stopped a spec reviewer, the human
raised the quota and typed `再開` alone in the Sekkei's window; the Sekkei
asked "resume what?" — it had nothing to bind the word to, and the human had
to say which dispatch. The same day the human had typed `再開` in Kanri's
window after an editor restart, where it meant the session-resume of
`/tanto resume`. So two different acts share one word, and neither is
defined for a limit.

What the skill needs, beside the pause rule above:

- **The pause leaves a marker.** When a dispatch dies on a limit, the role
  records in its next line to Kanri (or its report) what died, on which
  model, and the reset time the message named — `paused: <dispatch> on
  <family> — resets <time>` — and Kanri records it in the ledger's
  Measurements. That line is what a resume binds to.
- **The resume is a line, not a bare word.** The human says the quota is
  back — by time or by payment — to Kanri, in Kanri's window; Kanri probes
  the family once with a trivial subagent if it doubts, then sends the
  paused role `resume: <the dispatch the pause named> — same model`. A
  human who speaks in the role's window instead says the same thing in
  words the role can bind (`spec reviewer を再 dispatch`), and the role
  sends Kanri `human-contact:` as usual. A bare `再開` in a role's window is
  ambiguous by construction and the role asks — which is correct behavior,
  and the reason the line form exists.
- **One word per act.** The session-resume of `/tanto resume` and the
  resume after a limit are different acts and must not share a word. Which
  word each gets — and whether the after-a-limit act is a Kanri line, a
  `/tanto` argument, or something else — is the spec's to choose, together
  with issue-260c's romaji forms; the human asked that the words be decided
  at design time, not here. The line shapes above (`paused:`, `resume:`)
  are the shape of the exchange, not its final vocabulary.

Measured twice on 2026-09-11 (kisou-refresh ledger R-17, R-37, R-38;
tanto-workspace R-6, R-7).
