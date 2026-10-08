---
id: "41df"
title: no layout rule for a scratch directory a dispatch creates, so a denied recursive delete leaves it uncleaned
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: inbox 2026-10-08-feedback-454d742

Item #37 of that copy.

`rm -rf` can be denied by a host's tool policy, subagents included, so
scratch repositories made under the system temp directory are never cleaned.
The sender's repair was a dispatch that names a directory under the job's own
`tmp/`, which goes with the job; this skill's layout has no counterpart.

The decision this holds is a layout rule for a scratch directory a dispatch
creates: where under the workspace it lives, and who removes it. The deny
itself is issue-a881's class (the sandbox's own deny pattern on a recursive
delete).

Related: issue-a881.
