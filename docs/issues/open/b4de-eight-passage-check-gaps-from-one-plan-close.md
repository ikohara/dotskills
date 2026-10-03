---
id: "b4de"
title: eight `passage-check.js` gaps from one plan close
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-10-03
updated: 2026-10-03
---

Source: inbox 2026-10-02-passage-check-instrument-gaps-from-a-plan-close

Eight gaps in `scripts/passage-check.js` and the role text that describes
it. Four extend open issues with new measurements (items 2, 3, 6, 7, 8 name
theirs); the rest are new. All are code or role-text changes for the
carrier topic `passage-check-hardening`. Severity medium overall: item 6
stood out, because the tool gap hid a deviation behind a "will be flagged"
assumption; item 2 cost the most repeated hand work.

1. **No `apply`.** The subcommands are `lint`, `replay`, `diff`, `verify`,
   `sections`, `frame`, `boundary`; `replay` applies passages only to a
   scratch copy. Three Jisso sessions each wrote the same throwaway applier
   (unique old text, line endings preserved) to land hundreds of passage
   lines. Fix: `apply --task N`, applying that task's `P` blocks with the
   `replay` matcher and `verify`'s line-ending handling.
2. **`boundary` honors `replay-skip:`** (extends issue-2d69). `boundaryPlan`
   reads `extractReplaySkipPatterns` and skips every matching fence, as
   `roles/keikaku.md` documents. A plan whose fences are all git-only (a
   `diff` against the base, trailer counts, `git grep` sweeps) skips each in
   `replay` for want of a base tree, and `boundary` then skips them too
   although its cwd is the real tree, so the controller runs them by hand.
   Fix: a skip that applies to `replay` only (`replay-skip` versus
   `boundary-skip`), or `boundary` ignoring `replay-skip`.
3. **`diff` exits 1 for added text no block can quote** (extends issue-c963,
   which asks for a per-path exemption). A dated report whose date the plan
   cannot know (so no `created:` line), and a hotfix bullet named after the
   plan is frozen, are unaccounted by construction, so the fence cannot be
   read by exit status as `roles/keikaku.md` says boundary fences are. Fix:
   that exemption as `diff --allow <path>`, or the role file naming the
   case.
4. **`lint` forces a later task's final text into an earlier task.** `lint`
   pushes `needle-in-new-text` when an `O` needle occurs in any `P` block's
   new text, transient ones included. When a later task rewrites a line the
   first task wrote, the first task must write the line in its final form,
   leaving a stated transitional state at the earlier boundary.
   `roles/keikaku.md`'s `O` paragraph explains the needle-span rule but not
   this consequence. Fix: exempt a needle whose occurrence sits in a passage
   a later task's `P` block replaces, or say the needle forces the final
   text into the first writer.
5. **`frame --stage 2` can print about three times stage 1.**
   `renderStage2` prints every task's whole head (heading to first step); a
   plan with long heads printed about 99,000 characters against about 34,000
   for stage 1, and `roles/kanri.md` has Kanri read stage 2 in place of the
   plan. Fix: a head-length cap with a `[head: N lines]` marker, or
   `roles/keikaku.md` asking for short heads.
6. **A `W` block is checked at creation only** (extends issue-58fe).
   `verifyTask` filters `P` blocks, so a W-only task prints no verdict;
   `diff` skips every `created:` path; `replay` writes each `W` into a
   scratch tree and never compares it to the real file. A later edit to a
   W-created file is invisible to all three, and a plan or ledger saying
   "the final replay flags it" rests on a check that does not exist (a
   measured false claim). Fix: `verify` compares a `W` block's bytes with
   the file, or `diff` lists created paths changed since their creating
   commit.
7. **`verify` cannot tell a rewritten passage from a damaged one** (extends
   issue-a449). `verifyTask` reports `passage-absent` for both. The
   controller proved 16 absent ids by a scratch script that looked for each
   missing line in a later task's old text, rising to 20 by the last batch.
   Fix: `verify --explain-absent` names the later block whose old text
   quotes the missing lines. Related: `verify --rev <commit>`, so a
   read-only reviewer can check a base claim without a temporary worktree.
8. **`diff` explains a removed line only from a fence** (extends
   issue-4eef). `diffPlan` explains a removed line only if it is a line of
   some fenced block (`fencedLineSet`). Three `updated: <date>` lines whose
   old value already equaled the plan's new value are quoted only in prose
   or a table, so a date sweep reads `unexplained-removed` by construction;
   the trigger is the quote's location, not its role. Fix: explain a
   removed line that equals any plan line, as an added line already is, or
   document the fence-only rule in `roles/keikaku.md`.

Reproduction sketches (items 1, 2, 5, 8 are checkable from the source;
items 3, 4, 6 were read from the code, no fixture built):

```console
node scripts/passage-check.js apply --plan <plan> --task 1
node scripts/passage-check.js frame --plan <plan> --stage 2 | wc -c
node scripts/passage-check.js verify --plan <plan> --task N
```

Item 1: the first prints the usage line and exits 2. Item 5: compare the
second with `--stage 1 | wc -c`. Item 7: `verify` on an earlier task whose
line a later `P` block replaced prints `passage-absent` with no pointer.
Item 2: a plan with `replay-skip: git diff — git-only` and one `git diff`
fence makes `boundary --plan <plan>` print `skipped: git diff …` in a real
tree. Item 8: a P block whose new text is `updated: 2026-10-01`, quoted
also in prose, over a file whose base line already read that, then `diff
--plan <plan> --base <ref>` after a sweep prints `unexplained-removed`.
