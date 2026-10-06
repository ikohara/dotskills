---
id: "4a66"
title: claudeProcessWrapper is unmeasured as a way past the tab's open-elsewhere check
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-06
updated: 2026-10-06
---

Source: shoroku run-owned-seats S-32

A deferred item of the run-owned-seats design: the editor extension's
`claudeProcessWrapper` setting skips the check that shows "This conversation
is still open somewhere else", and can point the extension at a separately
installed binary; a wrapped setup starts conversations in Manual mode unless
`initialPermissionMode` is set (the extension's documentation, read on
2026-10-05). Whether the run should use it waits on a measurement of its
own, which nobody has run.

Carrier: Kept — waits on a measurement of its own.
