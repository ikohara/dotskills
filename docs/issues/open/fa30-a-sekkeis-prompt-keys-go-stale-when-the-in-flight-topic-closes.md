---
id: "fa30"
title: a Sekkei's prompt keys go stale without a line when the in-flight topic closes
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-07
updated: 2026-10-07
---

Source: shoroku tanto-feedback S-10

A Sekkei spawned while another topic's batch is in flight carries prompt keys
that name that topic: `spec=` a draft path, and `ledger=` the in-flight
topic's ledger. In the tanto-feedback run that topic closed, merged, and
handed Kanri over while the spec dialogue ran, and nothing told the seat. It
learned it from a roster row whose Branch cell read differently, checked
`git branch --show-current`, and asked. A `review-ready:` event written to
the key's ledger would have landed in a closed ledger with no reader.
Kanri's answer came at once and was right; the gap is that the seat had to
notice.

The decision to take: who tells a live Sekkei or Keikaku of another topic
that its keys moved, and where. The natural site is `roles/kanri.md`'s
plan-close row or its landing: one line to each such seat, naming the new
`ledger=<path>` and whether its draft rule still holds.

Kin issue-322d (the orders line at a topic's opening) and issue-c8e2 (a
spec's fixed input re-confirmed at plan-draft time); neither covers a key
that goes stale mid-dialogue.
