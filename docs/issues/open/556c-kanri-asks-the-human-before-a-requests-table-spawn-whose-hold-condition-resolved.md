---
id: "556c"
title: Kanri asked the human before a Requests-table spawn whose hold condition had resolved
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-03
---

Source: inbox 2026-09-25-kanri-asks-before-a-routine-requests-table-spawn

`roles/kanri.md`'s "Session lifecycle" has two tables: **Requests**, which
Kanri writes on its own, and **Asks**, which it puts to the human as a
numbered list the human may decline. The Requests row for a Keikaku — "the
spec review is accepted | one spawn for Keikaku | `/tanto keikaku …`" —
carries no human approval, and the surrounding text lets a Keikaku that
needs no branch be requested even while another topic holds the checkout.

In a reporter's run, Kanri had recorded its own ruling that a topic's
Keikaku spawn was held until another topic closed. When that topic closed,
Kanri did not re-request the Keikaku. It noticed the resolved condition only
when the human asked a direct question, then described why it could proceed
and asked whether to — treating a Requests-table act as an Asks-table one.
The human's answer asked, verbatim, that this class proceed automatically
next time.

The likely trigger: a ruling Kanri wrote naming a condition ("wait for topic
X to close") reads, on a later visit, like a standing decision that needs a
fresh act to reverse, rather than a note whose condition, once met, releases
the hold. Nothing in the role file says so.

Proposed (the reporter's): one sentence in or after the Requests table — a
Requests-table spawn that Kanri itself held pending a named condition is
re-requested automatically the moment the check that condition names is run
again and finds it satisfied (the next boundary, the next status check, or
the blocking topic's own close), with no human ask, as if the spec review
had just been accepted. A hold Kanri wrote against its own future self is a
note whose stated condition is the trigger, not a standing decision. It
states a rule about Kanri's own earlier rulings, a decision for the
lifecycle tables.

Serves exp-26d5 (tanto-issue-triage, 2026-10-03).
