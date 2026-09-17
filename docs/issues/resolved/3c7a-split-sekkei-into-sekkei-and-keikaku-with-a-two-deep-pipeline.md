---
id: "3c7a"
title: split Sekkei into Sekkei (the spec) and Keikaku (the plan), and run the topics as a two-deep pipeline
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-09-17
---

The human's decisions of 2026-09-10, taken in Kanri's window during the
tanto-sweep run and carried here from that run's conductor ledger (S-2). A
topic of its own, after kisou-refresh; it edits `skills/tanto/` and so runs
under rule 11 (decision-5c8e).

**The split.** The role that writes the spec and the role that writes the
plan want different models: the spec is where judgment is paid for, the plan
is the heavier context whose review already runs on `opus`. The tanto-sweep
run measured an `opus` Sekkei on both (the dogfood report of 2026-09-10):
passage craft and responsiveness good, every defect of the "did not run or
re-read its own text" kind, the cost moved to the review net. So: a
`keikaku` (計画) role with its own role file and `sessions.keikaku` in
`tanto.json`; Sekkei keeps the spec, the spec review, and the spec dialogue;
Keikaku owns the plan, the plan review, the dry run (`lint` and `replay`),
and the plan dialogue by grant. The boundary between them is **the spec
review accepted**, not the spec commit: Sekkei runs its exit shoroku there
and is deleted; Keikaku is created later, takes `dialogue.md`,
`spec-inputs.md`, and the spec as its own, and makes the branch's first
commits — the reviewed spec, then the plan. decision-f496 (no Sekkei reuse
across topics) is untouched. The first measurement is Sekkei on `fable` and
Keikaku on `opus`.

A mid-session `/model` switch was considered for the same effect and
withdrawn: the human recalls that a Fable 5.1 thinking block cannot be read
by an older model, so the switch would not keep the context it was meant to
keep, and it sits outside the protocol (self-reported, unchecked).

**The pipeline, depth two.** Topic N+1's spec is drafted during topic N's
batches — Sekkei ∥ Jisso, which the Create table already allows and which
the review-brief, context-cost, and tanto-sweep runs practised in part —
and N+1's plan is written after N merges, on the merged tree, so that its
anchors land. Kanri's concurrent peers stay at Sekkei and Jisso plus Kaiseki
on demand, which is today's load. Depth three (Keikaku ∥ Jisso) was rejected
for Kanri's context cost and for the anchors.

**The workspace: no worktree.** The next topic's Sekkei and Keikaku write
only Markdown, so they draft in `.superpowers/sdd/<topic>/` as untracked
files and commit nothing until Kanri says the branch may be cut, after the
in-flight topic merges (context-cost R-2 as practised); the specification to
make explicit is that **the checkout belongs to Jisso** — the branch of the
topic whose batches are in flight. A git worktree per topic was considered
and dropped under the requirement that the skill does not expect the calling
repository to be buildable or runnable in a worktree (req-04f5). issue-9a68's
concurrency constraint concerns `fable` sessions only (Kanri, Sekkei,
Kaiseki), so rule 9 stands and Keikaku on `opus` does not count.

**The handover.** Stays at the plan close (decision-b6cb); Sekkei's and
Keikaku's closes are boundaries where a reading is taken, not triggers. The
one overlap — Sekkei of N+1 mid-dialogue when N closes — is handled by the
successor's `kanri-address:` line plus one new rule: **a peer that receives
`kanri-address:` re-sends its last unanswered line to the new address**,
since a line sent to the old Kanri after it stopped sits unread in a session
that is still alive until deleted; the handover file's "In flight" lists the
peers the outgoing Kanri has not answered.

**Order.** 1. the role split with the workspace rule and the boundary at the
spec review; 2. write down the existing Sekkei ∥ Jisso stage (the next spec
during the current batches, the branch cut after the merge); 3. Keikaku
after the merge, and the re-send rule. If the split holds, the follow-up is
a phase-keyed `sessions.sekkei` in `tanto.json` becoming unnecessary because
the roles are two.

**The exit file's suffix.** `skills/tanto/SKILL.md`, "Session exit", fixes
the pattern `exit-<role>[-<suffix>]` with the suffix "absent for Sekkei
(`exit-sekkei`)", and the Artifacts table says the same. That clause is
contradicted the moment the spec and the plan are two sessions: the
kisou-refresh run (2026-09-11) used `exit-sekkei-spec` and
`exit-sekkei-plan` by ruling (its R-7), because two Sekkei sessions by stage
would otherwise write the same file. So the split defines the suffix rule —
or the roles' own names do (`exit-sekkei`, `exit-keikaku`), which needs no
suffix at all — and the Artifacts table follows whichever it is.

**A second topic's Sekkei during another plan's batches, measured
2026-09-11 to 2026-09-12.** The tanto-workspace Sekkei was created while
kisou-refresh's batch C ran on the one shared tree. It could cut no branch
and place no file under `docs/` (Jisso's boundary check needs a clean tree),
so its spec was drafted, reviewed by its reviewer, briefed, and gated by the
human in the workspace (`spec-draft.md`; kisou-refresh's Kanri ruled it as
tanto-workspace R-4), and committed on its own branch, cut from `main`, only
after the other plan's merge — the same day, with the text unchanged. The
cost: one `main is free` line from Kanri and a spec whose file date is the
gate's day, not the commit's. What the shared tree still broke: the second
Sekkei's reviewer saw the other plan's in-flight files and reported them,
which the orders line had to pre-empt. So the two-deep pipeline this issue
asks for already runs at the spec stage on one tree; what the plan stage
needs, and the spec stage does not, is a second worktree — the boundary
between "draft in the workspace" and "commit on a branch" is where the
worktree requirement of the exit shoroku of 2026-09-11 starts to bind.

Related: req-04f5, decision-b6cb, decision-f496, decision-5c8e, design-4807,
issue-9a68, issue-40ed, the dogfood report of 2026-09-10.

**Resolved 2026-09-17.** The split landed and is recorded as decision-1ab5.
`skills/tanto/roles/keikaku.md` exists, `templates/tanto.json` carries
`sessions.keikaku`, and the exit file is `exit-keikaku` with no suffix — this
issue's own "the roles' own names do" option. The boundary between the two roles
sits at the spec review's acceptance, which is the whole of what this issue asked
for.
