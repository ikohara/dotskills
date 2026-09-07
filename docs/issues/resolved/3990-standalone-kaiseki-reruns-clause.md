---
id: "3990"
title: standalone Kaiseki is still told to let Kanri decide whether Jisso reruns
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-06
updated: 2026-09-07
---

`skills/tanto/roles/kaiseki.md` describes one role with two entry modes. In the
attached mode a manager session exists and an executor session exists; in
standalone mode neither does — there is no roster, no handshake, no brief, and
no one to send the report to but the human in the room.

The final fix wave qualified two clauses for standalone mode, because those were
the two the finding named: "read the brief first" and "send one line with the
path". A third clause was outside that finding's scope and still reads
unconditionally:

> "Cannot reproduce" is still a report. Write it, say exactly what you tried,
> and let Kanri decide whether Jisso reruns or the human is asked about the
> environment.

In standalone mode there is no Kanri to decide and no Jisso to rerun. The human
who asked for the debugging is the one who decides, and the file does not say
so. A session that reaches the sentence has to work that out for itself, which
is the same class of gap as the two clauses the wave did fix.

To do: qualify the sentence for standalone mode the way the other two were —
name the human as the one who decides when there is no manager session. It is
one clause, in the same paragraph the wave already touched.

Resolution (kanri-lifecycle, 2026-09-07): the cannot-reproduce sentence in
`skills/tanto/roles/kaiseki.md` now names standalone mode explicitly — "let Kanri
decide whether Jisso reruns or the human is asked about the environment —
standalone, there is no Kanri, and the human in the room decides." The same plan
qualified the rest of the standalone path: the role ensures the workspace ignore
file exists so its report stays untracked, it commits once at its own exit under
`docs/` (decision-d831), and it is the bug reporter when the human asks for a
defect to be sent to another repository.
