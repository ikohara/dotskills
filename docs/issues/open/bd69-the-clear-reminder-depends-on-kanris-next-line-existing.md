---
id: "bd69"
title: the idle-session reminder depends on Kanri's next line to the human existing
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-13
---

Deferred by the tanto-cost design
(`docs/superpowers/specs/2026-09-12-tanto-cost-design.md`, "Deferred items"
6). The reminder that an idle Kikaku or Hosa window can be `/clear`ed, or an
idle Kaiseki deleted, rides on the end of Kanri's next line to the human. If
there is no next line, there is no reminder: a Kikaku that reports at the end
of a day gets its reminder the next morning, and the session's context is
paid for in the meantime.

A reminder line sent on its own was considered and rejected — it is a wake-up
that costs more than the miss it prevents. The mitigation in the design is
the `idle since <HH:MM>` value Kanri writes in the roster row, so that the
reminder is not forgotten across a wake-up even when it is late.
