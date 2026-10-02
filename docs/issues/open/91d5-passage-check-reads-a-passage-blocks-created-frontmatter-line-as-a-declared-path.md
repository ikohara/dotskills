---
id: "91d5"
title: "`passage-check.js` reads a passage block's column-0 `created: <value>` frontmatter line as a declared created path"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-46

`passage-check.js` reads a column-0 `created: <value>` line inside a passage
block as a declared created path. On the `experience-layer` plan (batch A,
2026-09-30), the W1.1 passage's example frontmatter line
`created: 2026-05-27` made the first line of `diff` read "5 paths exempt as
created:", one more than the four the plan declares. Harmless there, since
no file is named `2026-05-27`; but the count and the list on that first line
can no longer be trusted as the plan's own declaration, and a real path that
matched a frontmatter value would be exempted silently. Carrier topic:
`passage-check-hardening`.
