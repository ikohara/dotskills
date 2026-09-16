---
id: "9d17"
title: no role sweeps the workspace root, so a stale file next to the roster can be misread
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-08
updated: 2026-09-16
---

Kanri's Start makes sure `.superpowers/sdd/.gitignore` holds `*` and reads
the roster; no step of any role looks at what else sits at the root of
`.superpowers/sdd/`. Found by the boundary-rules spec review on 2026-09-07:
the root held an unrelated run's litter from July — a `progress.md`, a
`final-fixes-report.md`, five `review-*.diff` files, eight `task-N-*.md`
files — next to the roster. `roles/kanri.md` tells a cold Kanri that the SDD
ledger is `.superpowers/sdd/<plan-basename>/progress.md`; a stale root-level
`progress.md` is a live misread risk for a Kanri or a Jisso that globs or
guesses. The human had the fifteen files deleted the same day; the gap in
the procedure remains.

What belongs at the root by design: `.gitignore`, `roster.md`, the `inbox/`
directory, one topic directory per open topic, one workspace per plan, and
Kanri's own `exit-kanri-<YYYY-MM-DD>-proposal.md` files. Anything else is a
leftover.

Proposed: Kanri's Start step 2 lists the root of `.superpowers/sdd/` and
reports to the human, in its start line, every entry that is none of the
above, so the human can decide on it; the same listing at every plan close.
Nothing is deleted by Kanri without the human's word. design-4807's start
sequence records the sweep.

Related: design-4807 (the start sequence, the roster and the conductor
ledger), issue-f2c4 (one directory per topic would shorten the list of what
belongs at the root).

**2026-09-16, the `tanto-sweep-2` run — the first measured figure since the
workspace moved to `.tanto/`.** At that topic's spec stage the root of
`.tanto/` held **four leftovers from closed topics**, corroborated
independently by that ledger's own Session events. This is the first real
count for the listing this issue proposes, and it names the category the "what
belongs at the root by design" list above does not yet cover: a topic
directory is legitimate while its topic is open and becomes a leftover the
moment the topic closes, so the list cannot be read as a static set of
permitted names. The closed-topic case needs its own entry — a topic directory
whose topic has closed is a leftover, and the listing should say so rather than
letting it pass as "one topic directory per open topic".
