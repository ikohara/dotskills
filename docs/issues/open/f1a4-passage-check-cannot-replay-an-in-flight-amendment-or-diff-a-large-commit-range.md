---
id: "f1a4"
title: "`passage-check.js` cannot `replay` a plan amended in flight, and `diff` over a large commit range fails with `spawnSync git ENOBUFS`"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-19
---

Source: session 2026-09-17

Two related tool limits, both hit by kuchidome's `residency-retention` plan
(M6b, a 36-task plan, 2026-09-14 through 2026-09-17), reported alongside the
whole-branch review's own flagging of the same run.

`replay` cannot handle a plan that was amended mid-run: for tasks committed
after an amendment (Tasks 32-36 in this run), `replay` quotes the tree as it
stood mid-amendment rather than the plan's final text, so its check is
against a version of the plan that no longer exists on disk.

Separately, `diff` over a large commit range — this run's own whole-branch
review spanned 87 commits — fails outright with `spawnSync git ENOBUFS`
rather than reporting a scoped or truncated result. No `maxBuffer` override
exists for the `git` calls the script shells out to.

Reported by Hosa `kuchidome-6b [d17de0]` from `C:\Users\0000105523\devel\kuchidome`,
2026-09-15 (delayed in transit — original addressee no longer live; relayed
by this repository's own Kanri 2026-09-17).
