---
id: "c841"
title: "`extractCommandFences` reads only column-0 fences, so a plan whose checks live in a list is invisible to `replay` and `boundary`"
severity: medium
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-13
updated: 2026-09-13
---

Found by the plan reviewer of the tanto-cost run (2026-09-13), reading
`docs/superpowers/plans/2026-09-12-tanto-cost.md`; recorded in
`.tanto/tanto-cost/plan-review.md`, "Shoroku candidates", under the lead
"**`extractCommandFences` reads only column-0 fences, and every plan in this
repository indents the commands of its verification section.**"

`skills/tanto/scripts/passage-check.js` anchors a command fence's opening
line at column 0. That is correct for a passage block, which always sits at
the margin, and wrong for a fence inside a numbered or bulleted list — which
is exactly how "How a batch is verified" is written, in this plan and in its
predecessors. An indented fence is not seen at all: not by `replay`, which
runs a plan's fenced commands against the applied scratch tree, and not by
the `boundary` subcommand the tanto-cost plan adds, whose whole input is the
fences under that heading.

Measured on the tanto-cost plan: **148 column-0 fences, 9 indented, and 0
found under the heading `boundary` reads.** A `boundary` run over that plan
would therefore report a clean batch having executed nothing but
`git status --porcelain`, and `replay` silently skips the ten-odd commands
the verification section carries.

The fix is a dedent in `extractCommandFences`: capture the indent of the
opening fence, strip it from each body line, and test the closing fence at
the same indent. One change serves both subcommands.

Until it lands, any plan whose checks live in a list is invisible to both
`replay` and `boundary`, and a green dry run means less than its reader
takes it to mean.

Related: issue-860b (what `boundary` runs, and what it cannot reach),
issue-ebd9 and issue-1d95 (`replay`'s skip rules over the same fence set),
issue-2d69 (the skip list `boundary` would inherit).
