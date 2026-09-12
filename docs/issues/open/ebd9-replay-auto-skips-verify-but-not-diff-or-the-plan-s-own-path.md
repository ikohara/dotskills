---
id: "ebd9"
title: replay auto-skips verify but not diff, nor a command that reads the plan's own path
severity: low
depends_on: []
blocks: []
claimed_by: null
claimed_at: null
created: 2026-09-12
updated: 2026-09-12
---

`skills/tanto/scripts/passage-check.js` `replay` runs every fenced `bash` or
`console` block of the plan against a scratch tree holding copies of the blobs
the plan's passages edit. It skips two families by its own rule: a command
whose first word is `git`, "a git command; the applied tree is not a git
repository", and a command invoking `passage-check.js verify`, "whose subject
is the working tree, not the applied copy".

Two more families meet that second reason exactly and are not skipped.

- **`passage-check.js diff`.** Its subject is the branch's history — it runs
  `git diff <base>` and classifies the result — which the applied tree does not
  have. Every plan that states its own boundary check in a fenced block has
  one, because "how a batch is verified" is where that command belongs.
- **A command that reads the plan file itself.** The applied tree holds only
  the blobs the passages edit, so a `sed`, `awk` or `grep` over
  `docs/superpowers/plans/<name>.md` fails there. `diff` already exempts the
  plan's own path from its classification, for a related reason; `replay` has
  no matching rule.

Measured on the tanto-workspace plan, 2026-09-12: both had to be declared by
hand in the plan's Global Constraints —

```text
replay-skip: passage-check.js diff — diff's subject is this branch's history, which the applied tree is not; verify is skipped by the script's own rule, diff is not
replay-skip: 2026-09-12-tanto-workspace.md — a command that reads the plan's own text, such as task 6's boundary sweep; the applied tree holds only the blobs the plan's passages edit
```

— after the first dry run showed both failing in the scratch tree, the first
with `could not resolve --base`, the second with `sed: can't read …: No such
file or directory`.

Neither is a wrong answer from the script; both are boilerplate every passage
plan of this shape will write again. The fix is to widen the auto-skip rule: a
fence invoking `passage-check.js` at any subcommand other than the ones whose
subject *is* the applied tree, and a fence naming the `--plan` path the run was
given. The `verify` rule already had to be widened once, when its regex
`/passage-check\.js\s+verify\b/` missed the quoted `$TANTO` form the role files
prescribe; this is the same rule reaching one case short again.

Related: issue-2f17 (the `subagents` keys), and the `replay-skip:` mechanism
itself, which stays useful for the commands only a repository can run.
