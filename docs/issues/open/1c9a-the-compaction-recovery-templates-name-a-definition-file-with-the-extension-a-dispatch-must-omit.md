---
id: "1c9a"
title: "the compaction-recovery templates name a subagent definition file with its `.md` extension, where a dispatch must name it without one"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-13
---

Found by the tanto-cost run's batch E task 18 reviewer (2026-09-13),
recorded in `.tanto/tanto-cost/batch-E-report.md`, "Parked and deferred
minors" (called out as "the one worth your eyes") and "Shoroku
candidates".

`templates/kanri-handover.md` and `templates/batch-prompt.md`'s Models
lines name a subagent kind's definition by its **file**,
`tanto-task-implement.md`, **with** the extension — correct as a file
reference, per `SKILL.md:124`. But a dispatch itself names
`subagent_type: tanto-task-implement`, **without** the extension
(`roles/jisso.md:89`), and `jisso.md:110-112` tells a compacted Jisso to
trust exactly this prompt "over your recollection" when resuming.

So the one artifact this design built to survive a compaction — the batch
prompt and the handover file, both restating the Models line so a resumed
or replaced session does not have to remember it — points at a string that
is not the one a dispatch actually takes. A Jisso resuming from either
template and copying the Models line literally into a `subagent_type` value
would pass the wrong string.

Not fixable inside the tanto-cost plan: both templates' passages, under
task 18, have already landed.

Fix: either templates say "the definition `tanto-task-implement` (file
`tanto-task-implement.md`)" so both forms are present and unambiguous, or
they drop the extension entirely and let `SKILL.md:124` be the one place
that states the file-naming rule.

Related: issue-62e7 (the same run's other placeholder-consistency gap
between templates and role files).
