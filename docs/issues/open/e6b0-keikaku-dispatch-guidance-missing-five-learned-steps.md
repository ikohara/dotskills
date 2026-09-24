---
id: "e6b0"
title: Keikaku dispatch guidance missing five learned steps
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-17
updated: 2026-09-24
---

Source: inbox 2026-09-17-keikaku-dry-run-and-review-brief-guidance

Five process facts measured while running Keikaku in kuchidome (M6a/M6b/M10)
that `roles/keikaku.md` (or the `plan.draft`/`plan.review`/`brief.write`
dispatch prompts) should state rather than leave for each project to
rediscover:

1. A plan revised after its dry run leaves no trace that the dry-run report
   is stale — the report should carry the plan's git blob hash or block
   counts so a reader can check.
2. A review brief that goes stale only because counts moved (no point's
   question or answer changed) should get a one-line delta, not a full
   re-brief — measured at M6a: brief sent verbatim plus one line naming the
   new blob and which points' numbers moved.
3. A `plan.draft` dispatch told to write its own filesystem-touching
   verification script should be told explicitly to use `fs.mkdtempSync`
   (never `process.cwd()`) and to print the resolved scratch path before
   its first write — measured at M6b, a scratch replay script applied real
   passages onto the live working tree; `git status` caught it by luck.
4. `passage-check.js`'s `planTasks` only recognizes a step region by
   `^- \[ \] \*\*Step`; `roles/keikaku.md`'s drafter-dispatch guidance
   doesn't say this convention is required, and an uninstructed drafter
   wrote plain numbered lists instead, silently inert for `frame`'s
   step-collapsing — caught only by that Keikaku's own dry run (M10,
   `target-concurrency`). Worth stating the convention explicitly (or one
   example line) plus a `lint` warning for a plan with no such line at all.
5. A Keikaku facing several fix rounds can continue one `plan.draft`
   dispatch across them, or open a fresh dispatch per round with the exact
   decided answer stated up front; the discriminator worth stating in
   `roles/keikaku.md` is: fresh dispatch when every finding's answer can be
   stated precisely up front, continuation when the round expects to
   iterate collaboratively on an open question (measured at M6b and M10,
   `target-concurrency` — both approaches worked, neither hit the other's
   risk).

6. Resuming one `plan.draft` dispatch beats a fresh one for a plan-drafting
   seat, and the role file says nothing either way. Measured on `tanto-diet`
   (2026-09-20): all seven dispatches of that plan's drafting cycle resumed
   the same subagent, and every resume both fixed what it was asked to fix
   and caught follow-on breakage the fix itself introduced without being told
   to look — the clearest instance being the `writeEvent` dedup fix's
   test-count growth (18 → 23), which falsified nine unrelated count claims
   elsewhere in the plan, all found and corrected in the same turn. A fresh
   subagent handed a text summary of the prior turns would very likely have
   missed several, since none was named in what it was asked to do. This is
   distinct from a `task.implement` seat, which the contract already treats
   as disposable per batch, and it cuts the other way from item 5's
   discriminator for a *fix round*: for drafting, the resume is the default.

Reported by Hosa `kuchidome-6b [d17de0]` from `C:\Users\0000105523\devel\kuchidome`,
2026-09-15 (delayed in transit — original addressee no longer live; relayed
by this repository's own Kanri 2026-09-17).

**2026-09-24, a received report — three more drafting heuristics** (inbox
bug-report-plan-drafting-passage-check-guidance, its items 1-3):

1. **Anchor a passage on the smallest byte-stable statement pair, not on a
   comment.** A passage failed twice while anchored on a comment plus the
   line under it, and survived once anchored on the two statements that
   stayed identical across three tips. For a passage into a file another
   topic is still working on: quote the statement pair the edit actually
   wraps, and put the explanation in the new text, not in the anchor.
2. **A renumber needs a prose grep, not just `replay`.** A stale number lived
   in two places, a mechanism paragraph and a step; `replay` and `lint` see
   only fenced blocks and `A` commands. After any re-anchor that changes a
   literal, `grep -n '<old literal>' <plan>` over the whole file would have
   caught it.
3. **Step text drifts when blocks are split.** An off-by-one came from
   splitting one `P` block into two without updating the step that names
   them; the same grep applies after any block renumbering.
