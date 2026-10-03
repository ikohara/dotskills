---
id: "a14f"
title: the launcher spawned a second Kanri beside a live one, twice
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: shoroku tanto-issue-triage S-12

Two measured occurrences of a Kanri spawn request nobody can account for:

- **While the live Kanri sat `blocked` for 4.5 hours** (S-12). The launcher
  spawned a second Kanri at 21:22 with a request id in the launcher's own
  format, while the first Kanri's roster row was `live` and its census
  state had been `blocked` since 16:50. The second session went `gone` at
  21:28 with no roster row. `blocked` is also the state of a Kanri idling
  on the human's kessai answer, and it has no roster word and no cause
  (issue-feac).
- **Two minutes after a handover was accepted** (S-23). The spawner's log
  shows `spawn … ok` at 10:49, after the new Kanri's own start at 10:47 and
  the predecessor's `stop`. The request id has the launcher's shape
  (`<ISO>Z-<random>`), not the `<ISO>-<pid>` shape Kanri's own requests
  take, and no Kanri's ledger line names it. The new window read the
  roster, found a live first row, and stopped — the Second Kanri case
  working as written.

Neither `SKILL.md` nor the launcher says whether a long-`blocked` Kanri is
taken for a dead one, and what wrote the requests is not identified. Each
occurrence costs a window of reads. The defect to find is the writer of the
request and the condition it fires on.
