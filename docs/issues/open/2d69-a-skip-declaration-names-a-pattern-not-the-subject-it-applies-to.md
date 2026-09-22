---
id: "2d69"
title: a skip declaration names a pattern and not the subject it applies to, so `replay`'s list is the wrong list for `boundary`
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-22
---

Source: session 2026-09-13

Found by the plan reviewer of the tanto-cost run (2026-09-13), reading
`docs/superpowers/plans/2026-09-12-tanto-cost.md`; recorded in
`.tanto/tanto-cost/plan-review.md`, "Shoroku candidates", under the lead
"**A `replay-skip` list written for a scratch tree is the wrong list for a
working tree.**"

A `replay-skip:` declaration exists because `replay` applies a plan's
passages to a scratch tree holding only the blobs those passages edit: a
command needing `mise`, `uv`, the repository's lint, or a git history cannot
run there. The tanto-cost design's spec section 8.3 has the new `boundary`
subcommand honor those declarations "as in `replay`" — but `boundary` runs in
the **real repository**, where every one of those commands works. Measured on
this plan, honoring the list would remove five of the section's seven checks,
which are the checks a boundary exists to run.

Two lessons, the second sharper:

- A skip declaration should name the **subject** it does not apply to, not
  only the pattern: `replay-skip:` beside a separate `boundary-skip:`, or a
  scope word on the existing marker. A plan author who writes one marker today
  is silently writing a rule for every future consumer of the fence set.
- A skip pattern that is a **filename** — `2026-09-12-tanto-cost.md` — matches
  every command that names the plan, which is very nearly every command a
  plan runs. The pattern's shape decides its blast radius and nothing reports
  how many fences a declaration removed.

A related mitigation is already proposed elsewhere: issue-ebd9 would widen
`replay`'s automatic skips so that the plan's own path need not be declared by
hand at all, which removes the most over-matching pattern from the list.
Either fix alone leaves the other half open.

Related: issue-ebd9 (the auto-skip rule, and the plan-path pattern),
issue-1d95 (skip granularity is the fence), issue-2f17 (the first-word
classification), issue-c841 (the fences `boundary` can see at all),
issue-860b (what `boundary` runs).

**2026-09-13, the same run's Sekkei, on the plan's own first draft.** The
filename-shaped pattern this issue warns about was not hypothetical: the
tanto-cost plan's first `replay-skip` list carried
`2026-09-12-tanto-cost.md`, written to keep one sweep of the plan's own text
out of the scratch tree, and the plan review measured it removing `verify` and
`diff` from the boundary as well — five of the section's seven checks skipped
in total, counting the `uv run`, `mise x node@22` and `node --test` patterns
beside it. Both patterns were then deleted: what the filename pattern was
there to protect was already covered by the `.tanto/` pattern, and dropping
`uv run` turned the frontmatter load into a check that runs in **both**
subjects, since the applied tree does carry the two `SKILL.md` blobs. The plan
now narrows every marker to the task-step commands and leans on `replay`'s
built-in `git` and `verify` skips, which `boundary` does not inherit, for the
two checks that must run in one subject and not the other. That narrowing is a
plan author's workaround, not a fix: it has to be redone, by hand and
correctly, in every plan that declares a skip.

**2026-09-22, `tanto-bg-seats` — a pattern that matched nothing, and the lint
rule that would have said so.** A `replay-skip:` pattern is matched by plain
substring against a fence's own text (`fence.command.includes(pattern)`), not by
matching the *intent* the pattern's prose describes. This plan's first-draft
patterns were written as descriptions — "scratch clone", "git worktree" as two
words — rather than as literal excerpts of the fenced text, and so silently
skipped nothing. Nothing in `lint` catches that: a `replay-skip:` pattern
matching zero fences is not itself a lint error.

The consequence was measured, and it was not cheap: the fence those patterns
were meant to skip started a resident process, and `replay` hung on it for 86
minutes (issue-126e). A `passage-check.js lint` check — does each declared
`replay-skip:` pattern occur as a literal substring in at least one fence the
plan actually contains? — would have caught this on the first `lint` run instead
of the first `replay`.
