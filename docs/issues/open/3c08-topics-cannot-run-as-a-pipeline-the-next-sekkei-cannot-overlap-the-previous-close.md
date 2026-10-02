---
id: "3c08"
title: "topics cannot run as a pipeline: the next topic's Sekkei cannot overlap the previous topic's close"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-96

The next topic's Sekkei cannot overlap the previous topic's close, so topics
cannot run as a pipeline. The close writes `docs/issues`, and the topic's
branch cut waits for the merge; a spec-draft path exists only while a batch
is in flight, not during the close. On 2026-10-01 Kanri advised waiting for
`experience-layer`'s merge before opening `tanto-issue-triage`'s Sekkei, and
the human answered that pipelined running is then impossible and asked for
this issue. No open issue names the close as the serialization point
(issue-2065 is a prose pass).
