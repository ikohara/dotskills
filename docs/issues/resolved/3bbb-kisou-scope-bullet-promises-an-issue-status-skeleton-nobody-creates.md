---
id: "3bbb"
title: "kisou's Scope bullet still promises the `docs/issues/{open,deferred,resolved}/` skeleton that nobody creates"
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-09-30
---

Source: shoroku kisou-refresh

`skills/kisou/SKILL.md`'s Scope section says under **Produces**:

> the `docs/` doc-management system (`docs/AGENTS.md` +
> `docs/<type>/AGENTS.md` + the `docs/issues/{open,deferred,resolved}/`
> skeleton)

Nothing creates that skeleton, and two places in the tree say it must not be
created. Step 3 (scaffold) item 3 instructs: "Do **not** create the
`open`/`deferred`/`resolved` status subdirs and do **not** add `.gitkeep`: git
does not track empty directories, so a writer creates a status subdir on demand
when the first issue lands there". The installed `docs/issues/AGENTS.md` says
the same from the other end — a status directory exists only while it holds at
least one issue, and a writer recreates it on demand when the next issue lands
there.

So the Scope bullet promises an artifact the skill deliberately does not
produce. It is a reader-facing contradiction only; no code path depends on it.

Found by the kisou-refresh plan review (finding 12). That plan left it standing
deliberately: it is **pre-existing** — no passage of the plan causes it — and
none of the six kisou issues that plan resolves is about it, so making it a
fourteenth passage would have widened the plan's scope for an unrelated defect.

Fix: reword the Scope bullet so it names the doc-system it actually writes —
`docs/AGENTS.md` plus the per-type `docs/<type>/AGENTS.md` under the cased type
directories — and drops the status-subdirectory skeleton.

Related: design-c1d2, req-1a2b.
