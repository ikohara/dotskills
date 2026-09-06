---
id: "0673"
title: Kaiseki in a worktree so Jisso can continue
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-06
updated: 2026-09-06
---

The tanto design of 2026-09-06 has Jisso idle while Kaiseki works the same
tree, because Kaiseki instruments the tree and Kanri verifies it in place. A
worktree for Kaiseki would let Jisso continue with the next task, at the cost
of duplicating the environment in the worktree (dependencies, toolchain setup,
whatever the repo's tests need). That cost is unknown per repo and was high in
the practice tanto formalizes.

Deferred until a real case shows the idle time matters more than the setup
cost. If adopted, it is Kanri's option per repo, stated in the Kaiseki brief,
and the default stays idle.
