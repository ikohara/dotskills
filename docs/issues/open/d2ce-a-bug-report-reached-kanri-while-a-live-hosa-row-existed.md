---
id: "d2ce"
title: a bug report reached Kanri while a live Hosa row existed; cause unknown
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-02
updated: 2026-10-02
---

Source: shoroku experience-layer S-61

On 2026-10-01 another repository's Kanri sent `bug-report:` to this
repository's Kanri while the roster carried a `live` Hosa row (idle). The
intake rule makes the live Hosa the intake. Either the sender read the
roster's first data row, or the Hosa row's Status did not carry the
`idle since` text the sender looks for. The cause is unknown: a `kaiseki`
candidate, held here until a Kaiseki or the next occurrence settles it.
