---
id: "1f92"
title: "`SKILL.md` calls the share threshold's unit a wake-up's usage where `reading.js` measures a turn's"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-14
updated: 2026-10-01
---

Source: shoroku tanto-context-ceiling

Measured at the `tanto-context-ceiling` run's T2 (2026-09-14), against the
shipped script's actual loop.

`skills/tanto/SKILL.md`'s `ceiling.share_threshold` bullet describes the
threshold's unit as **"a wake-up's usage"**. `skills/tanto/scripts/reading.js`'s
`runShare` sums `contextOf(record)` per `assistant` record and calls the unit
`turn` — a smaller unit than "wake-up", which the same `SKILL.md` already
defines distinctly elsewhere. The bullet should read **"a turn's usage"**.

A one-word correction. It was held rather than fixed during the plan because
the bullet sits inside a `P`-block passage, per the standing in-run rule that
pinned text is not edited while its plan is open; the plan then closed without
landing it, so it needs this carrier or it is lost.

Related: exp-06b2, decision-eee2, issue-7f2a (the same class of held fix).
