---
id: "12d3"
title: tanto keeps both untracked directories at a plan close instead of asking the human to delete one
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-09
updated: 2026-09-10
---

Raised by the human on 2026-09-09 at the requirement-extraction plan close,
when Kanri asked for the third time in three days that the plan workspace be
deleted by hand: "this is a chore every time — why is the workspace deleted
and the topic directory kept, when neither is committed?"

What the skill says today. `skills/tanto/SKILL.md`, Workspace: the plan
workspace `.superpowers/sdd/<plan-basename>/` "outlives the SDD run. Jisso
never deletes it. After T2 and the merge decision, Kanri asks the human
whether to delete it." And, of the ledger move at the plan's landing: "Only
the ledger moves; the topic directory stays as the spec-phase record."
`roles/kanri.md` repeats the question in its Session lifecycle section. Both
directories sit under `.superpowers/sdd/`, whose `.gitignore` is a bare `*`,
so neither is ever committed and neither survives a fresh clone.

Why the asymmetry exists, and why it does not hold. The workspace was seen as
disposable because T2 distills what it holds — the task reports' measurements
into the dogfood report, the findings into design entries and issues — and
because it is large (review packages, task briefs and reports, prompts). The
topic directory was declared kept when the ledger move was designed, because
T1 and later topics read `dialogue.md` (the human's answers verbatim), the
reviews, and the briefs. After T2 the two have the same standing: untracked,
local to one machine, useful only for a later re-read. The deletion is a
chore only because recursive deletion is denied to Kanri's session by
permission policy, so every plan close ends with a numbered request to the
human — against req-04f5's rule that the human is asked only for what only
the human can do.

Decision, the human's (2026-09-09): keep both. The plan workspace stays after
the plan close like the topic directory; nothing asks the human to delete
either. Disk is the only cost, the directories are per plan so they do not
collide, and a later investigation can still read `progress.md` and the
reports (issue-42be's kind of question). Rejected: deleting both at the close
(needs a permission grant for recursive deletion under `.superpowers/sdd/`,
and the record would be gone), and keeping the rule while granting Kanri the
deletion (removes the chore, keeps an asymmetry with no reason).

The fix is two passages: drop the "asks the human whether to delete it"
sentence from the contract's Workspace section and the matching sentence from
`roles/kanri.md`'s Session lifecycle, and say in one line that both
directories stay. The requirement side is already in req-04f5 ("The human is
interrupted only at defined checkpoints … asked only for what only the human
can do"); this issue is the gap against it, not a new need.

Related: req-04f5, design-4807 (Workspace, Session lifecycle), issue-42be,
issue-9d17 (no role sweeps the workspace root).

Resolved by the tanto-sweep plan's task 11, which removes the "asks the
human whether to delete it" sentence from `SKILL.md`'s Workspace section and
the matching sentence from `roles/kanri.md`'s Session lifecycle, and states
in all three places that move together — the contract, Kanri's residency
paragraph, and Jisso's copy in the "What tanto overrides" table — that both
untracked directories stay after a plan close, per the human's 2026-09-09
decision recorded above.
