---
id: "ba0f"
title: boundary record writes a `<destination> — <text>` bullet into the wrong columns, and --peer-reading drops a line with a context figure but no transcript
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-08
updated: 2026-10-08
---

Source: inbox 2026-10-08-feedback-454d742

Item #39 of that copy.

Two measured `record` defects in `scripts/boundary.js`:

- A boundary `record` call wrote a batch report's shoroku items with the
  destination word in the Source column and an empty Destination, when the
  items were bullets of the form `<destination> — <text>`.
- `--peer-reading` drops a line that carries a context figure without a
  transcript.

issue-20de records an empty Destination from a different cause and
issue-7bd1 a multi-word name dropped, so these are new cases of the same
parser family.

Related: issue-20de, issue-7bd1.
