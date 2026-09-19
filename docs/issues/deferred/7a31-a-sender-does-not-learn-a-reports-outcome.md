---
id: "7a31"
title: a sender hears `received:` and never learns its report's outcome
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-20
updated: 2026-09-20
---

Source: shoroku bug-report-hold S-26

Under the held-until-a-close intake (decision-c322) the reporter hears
`received: <inbox path>` and nothing more. The outcome lives in the receiving
repository's untracked inbox copy, which the sender cannot read.

If a run wants the outcome, the close could send one line per `relay` or
`issue` back to the Send-to name. Deferred because that name is a session which
may well have been cleared in the days between the report and the close, and
the human's word is the surer channel meanwhile.

Revisit when a second repository runs closes of its own — at that point both
sides have a close to hang the reply on, and the channel is symmetric.
