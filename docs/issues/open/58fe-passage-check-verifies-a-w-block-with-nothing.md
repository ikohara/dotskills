---
id: "58fe"
title: passage-check verifies a `W` block with nothing — `verify` reads only `P` blocks and `A` anchors, and `diff` exempts every `created:` path, which a `W` block's path always is
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-11
updated: 2026-09-19
---

Source: inbox 2026-09-11-passage-check-w-blocks

A plan's `W` block declares a whole new file whose bytes must land as
written. `skills/tanto/SKILL.md` presents `scripts/passage-check.js` as the
instrument a plan that carries passages checks itself with — Sekkei's dry
run, Jisso's boundary check, the whole-branch reviewer's replay. For a `W`
block none of its subcommands looks: `verify` filters the task's blocks to
`P` (`kind === "P" && b.new`) and checks `A` anchors; `diff` skips every
path the plan declares `created:`, and a `W` block's path is such a path by
construction. So a whole-file passage whose file lands with different bytes
is reported by nothing in the skill; only the task reviewer's own byte
comparison against the brief catches it.

Reported 2026-09-11 by the Kanri of the kuchidome repository (inbox
`2026-09-11-passage-check-w-blocks.md`), measured in its M6a run: task 6's
whole-file fence for `src/cli/token.ts` was committed with biome's
pre-commit hook having joined a four-line `run(...)` signature onto one
line; `verify --task 6` was clean and the boundary `diff` listed the path
as exempt. The same batch's `P8.1` reflow was caught by both `verify`
(`passage-absent`) and `diff` (twelve unaccounted lines) — the behavior a
`W` block should have too. A stronger reproduction needs no formatter:
change any byte of a file a `W` block declares, commit, and both commands
stay clean.

Two fixes, the first preferred, in the reporter's words:

- `verify` gains a `W` check — for each `W` block of the task, the file at
  the block's path equals the block's text byte for byte (modulo the plan's
  declared placeholders), and a mismatch is reported like `passage-absent`;
  and `diff` stops exempting a `created:` path that a `W` block covers,
  comparing the file's lines against the block instead.
- At minimum, `roles/sekkei.md` and `roles/jisso.md` say that a `W` block is
  verified by the task reviewer's byte comparison and by nothing in the
  checker, so a plan author knows what the instrument covers.

Related, from the same run: a `W` or `P` block has to be formatter-canonical
(produced by running the repository's formatter over the intended text),
because `replay`'s lint pass runs on a scratch tree without the formatter's
dependencies and cannot catch a rewrite by the pre-commit hook. The
kisou-refresh run met the same class in its batch A (biome reformatting
appended test blocks, token-identical but not byte-identical to the plan's).

Under contract rule 11, with tests: the Keikaku split (issue-3c7a) or the
small tanto items after it. Related: issue-7c11 and issue-2f17, the two
other instrument defects of 2026-09-11.

**2026-09-13 — a third subcommand blind to `W` blocks: `lint`.** The plan
reviewer of the tanto-cost run found it while reading
`docs/superpowers/plans/2026-09-12-tanto-cost.md`; recorded in
`.tanto/tanto-cost/plan-review.md`, "Shoroku candidates", under the lead
"**`lint`'s `needle-in-new-text` rule does not read `W` blocks.**" The rule
builds the plan's "own new text" at `skills/tanto/scripts/passage-check.js:365`
by filtering `b.kind === "P"`, so a needle that reappears in a **created**
file's whole text is not refused. The hole is closed in practice for a plan
that also runs `replay`, whose residual sweep does cover `W` paths — but the
two checks then disagree about what the plan's own new text is, and `lint` is
the cheap one people run alone. One-word fix, in the same family as the
`verify` and `diff` gaps above: whatever defines "a `W` block is text the plan
commits to" has to hold in all three subcommands at once.

**2026-09-17 — a second corroborating measurement, from kuchidome's
`residency-retention` run (M6b).** Task 12's plan entry was `W`-blocks only,
and `verify` reported `no passages` for it regardless of what the file
actually contained — the task reviewer's own byte comparison against the
brief was the only real check on a "create verbatim" deviation for such a
task. Same root cause as the 2026-09-11 report above, on a different
repository's own run; no new fix proposed beyond the two already on file.

Reported by Hosa `kuchidome-6b [d17de0]` from `C:\Users\0000105523\devel\kuchidome`,
2026-09-15 (delayed in transit — original addressee no longer live; relayed
by this repository's own Kanri 2026-09-17).
